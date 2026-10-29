import test from 'node:test';
import assert from 'node:assert/strict';

// Test pure math functions
function joystickVector(x, y, radius) {
  const length = Math.hypot(x, y);
  if (length < radius * 0.12) return [0, 0];
  const divisor = Math.max(length, radius);
  return [x / divisor, y / divisor];
}

function screenDeltaToLandscape(x, y, rotated) {
  return rotated ? [y, x === 0 ? 0 : -x] : [x, y];
}

test('joystickVector: deadzone returns [0, 0]', () => {
  const [x, y] = joystickVector(1, 1, 40);
  assert.equal(x, 0);
  assert.equal(y, 0);
});

test('joystickVector: normalizes vector to radius clamp', () => {
  const [x, y] = joystickVector(0, -80, 40);
  assert.equal(x, 0);
  assert.equal(y, -1);
});

test('screenDeltaToLandscape: transforms deltas under 90 deg clockwise landscape rotation', () => {
  // Non-rotated (Native Landscape via hbSDK.viewport.setDisplay): [dx, dy] unchanged
  assert.deepEqual(screenDeltaToLandscape(10, 20, false), [10, 20]);
  assert.deepEqual(screenDeltaToLandscape(-15, 45, false), [-15, 45]);

  // Rotated (CSS 90deg rotation in default portrait): physical right (+X) is visual down (+Y), physical down (+Y) is visual left (-X)
  // Forward motion on landscape screen is visual -Y (physical -X)
  const [rx, ry] = screenDeltaToLandscape(0, -30, true);
  assert.deepEqual([rx, ry], [-30, 0]);
});

test('Native landscape mode determination flag', () => {
  // When in map-view and native landscape is active, isStageRotatedLandscape must be false
  const isStageRotatedLandscape = (isMapView, isNativeLandscapeActive, width, height) => {
    if (!isMapView) return false;
    if (isNativeLandscapeActive || width >= height) return false;
    return true;
  };

  assert.equal(isStageRotatedLandscape(false, false, 375, 812), false, 'Welcome screen never rotates');
  assert.equal(isStageRotatedLandscape(true, false, 375, 812), true, 'Mobile portrait map-view without SDK uses CSS rotation');
  assert.equal(isStageRotatedLandscape(true, true, 812, 375), false, 'Native landscape active does not use CSS rotation');
  assert.equal(isStageRotatedLandscape(true, false, 1920, 1080), false, 'PC widescreen does not use CSS rotation');
});

test('Touch events failsafe: release when touches is empty', () => {
  let stick = [0, -1];
  let stickId = -1;

  const onTouchEnd = (touches, changedTouches) => {
    if (touches && touches.length === 0) {
      stickId = null;
      stick = [0, 0];
      return;
    }
    if (changedTouches && changedTouches.some((t) => stickId === -(t.identifier + 1))) {
      stickId = null;
      stick = [0, 0];
    }
  };

  // 1. All fingers lifted from screen
  onTouchEnd([], [{ identifier: 5 }]);
  assert.equal(stickId, null);
  assert.deepEqual(stick, [0, 0], 'All fingers lifted must stop joystick immediately');
});

test('Touch events failsafe: release when touch identifier missing from active touches inventory', () => {
  let stick = [0, -1];
  let stickId = -2; // corresponds to identifier 1: -(1 + 1) = -2

  const syncTouches = (activeTouches) => {
    const held = new Set(activeTouches.map((t) => -(t.identifier + 1)));
    if (!held.has(stickId)) {
      stickId = null;
      stick = [0, 0];
    }
  };

  // Only finger 0 is on screen, finger 1 was lifted without touchend
  syncTouches([{ identifier: 0 }]);
  assert.equal(stickId, null);
  assert.deepEqual(stick, [0, 0], 'Missing touch in inventory must stop joystick');
});
