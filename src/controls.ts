import { vec3 } from 'gl-matrix';
import type { ICollider } from './collider';

export function joystickVector(x: number, y: number, radius: number): [number, number] {
  const length = Math.hypot(x, y);
  if (length < radius * 0.12) return [0, 0];
  const divisor = Math.max(length, radius);
  return [x / divisor, y / divisor];
}

export function screenDeltaToLandscape(x: number, y: number, rotated: boolean): [number, number] {
  return rotated ? [y, x === 0 ? 0 : -x] : [x, y];
}

function isRotatedLandscape(): boolean {
  return typeof document !== 'undefined' && Boolean(document.body?.classList.contains('rotated-landscape'));
}

export class FlightControls {
  // A lost release event must never leave an unbounded movement command.
  static readonly MAX_HOLD_MS = 10_000;
  position = vec3.create();
  yaw = 0;
  pitch = 0;
  speed = 18;
  sensitivity = 0.005;
  stick: [number, number] = [0, 0];
  vertical = new Map<number, number>();
  keys = new Set<string>();
  mode: 'flight' | 'walk' = 'flight';
  collider: ICollider | null = null;
  isGrounded = false;
  velocityY = 0;
  eyeHeight = 1.4;
  jumpSpeed = 7.2;
  gravity = 18.0;
  jumpRequested = false;
  lastGroundedPos = vec3.create();
  spawnPos = vec3.create();
  fallTime = 0;

  private look: { id: number; x: number; y: number } | null = null;
  private stickId: number | null = null;
  private riseHolds = new Map<number, { button: HTMLButtonElement; since: number }>();
  private keyActivity = new Map<string, number>();
  clear: () => void = () => {};

  constructor(canvas: HTMLCanvasElement, joystick: HTMLElement) {
    const knob = joystick.querySelector<HTMLElement>('span')!;

    // --- Pointer Look for Canvas (Desktop mouse / stylus) ---
    canvas.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch' || this.look || e.button !== 0) return;
      this.look = { id: e.pointerId, x: e.clientX, y: e.clientY };
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {}
    });

    const movePointerLook = (e: PointerEvent) => {
      if (this.look?.id !== e.pointerId) return;
      const [dx, dy] = screenDeltaToLandscape(
        e.clientX - this.look.x,
        e.clientY - this.look.y,
        isRotatedLandscape()
      );
      this.yaw -= dx * this.sensitivity;
      this.pitch = Math.max(-1.52, Math.min(1.52, this.pitch - dy * this.sensitivity));
      this.look.x = e.clientX;
      this.look.y = e.clientY;
    };

    canvas.addEventListener('pointermove', movePointerLook as EventListener);
    window.addEventListener('pointermove', movePointerLook as EventListener);

    const endPointerLook = (e: Event) => {
      if (this.look?.id === (e as PointerEvent).pointerId) this.look = null;
    };
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      canvas.addEventListener(type, endPointerLook);
      window.addEventListener(type, endPointerLook);
    }

    // --- Touch Look for Mobile WebView ---
    const moveTouchLook = (touch: Touch) => {
      if (this.look?.id !== -(touch.identifier + 1)) return;
      const [dx, dy] = screenDeltaToLandscape(
        touch.clientX - this.look.x,
        touch.clientY - this.look.y,
        isRotatedLandscape()
      );
      this.yaw -= dx * this.sensitivity;
      this.pitch = Math.max(-1.52, Math.min(1.52, this.pitch - dy * this.sensitivity));
      this.look.x = touch.clientX;
      this.look.y = touch.clientY;
    };

    canvas.addEventListener(
      'touchstart',
      (e) => {
        if (this.look) return;
        const touch = e.changedTouches[0];
        if (!touch) return;
        this.look = { id: -(touch.identifier + 1), x: touch.clientX, y: touch.clientY };
        e.preventDefault();
      },
      { passive: false }
    );

    window.addEventListener(
      'touchmove',
      (e) => {
        const touch = Array.from(e.changedTouches).find((item) => this.look?.id === -(item.identifier + 1));
        if (!touch) return;
        moveTouchLook(touch);
        e.preventDefault();
      },
      { passive: false }
    );

    const endTouchLook = (e: TouchEvent) => {
      if (Array.from(e.changedTouches).some((touch) => this.look?.id === -(touch.identifier + 1))) this.look = null;
    };
    window.addEventListener('touchend', endTouchLook, { passive: true });
    window.addEventListener('touchcancel', endTouchLook, { passive: true });

    // --- Virtual Joystick ---
    const moveStick = (clientX: number, clientY: number) => {
      const rect = joystick.getBoundingClientRect();
      const [x, y] = screenDeltaToLandscape(
        clientX - rect.left - rect.width / 2,
        clientY - rect.top - rect.height / 2,
        isRotatedLandscape()
      );
      this.stick = joystickVector(x, y, rect.width * 0.35);
      if (knob) knob.style.transform = `translate(${this.stick[0] * 35}px, ${this.stick[1] * 35}px)`;
    };

    joystick.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch' || this.stickId !== null) return;
      this.stickId = e.pointerId;
      try {
        joystick.setPointerCapture(e.pointerId);
      } catch {}
      moveStick(e.clientX, e.clientY);
    });

    const onStickPointerMove = (e: PointerEvent) => {
      if (this.stickId === e.pointerId) moveStick(e.clientX, e.clientY);
    };
    joystick.addEventListener('pointermove', onStickPointerMove as EventListener);
    window.addEventListener('pointermove', onStickPointerMove as EventListener);

    const endPointerStick = (e: Event) => {
      if (this.stickId !== (e as PointerEvent).pointerId) return;
      this.stickId = null;
      this.stick = [0, 0];
      if (knob) knob.style.transform = '';
    };
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      joystick.addEventListener(type, endPointerStick);
      window.addEventListener(type, endPointerStick);
    }

    joystick.addEventListener(
      'touchstart',
      (e) => {
        if (this.stickId !== null) return;
        const touch = e.changedTouches[0];
        if (!touch) return;
        this.stickId = -(touch.identifier + 1);
        moveStick(touch.clientX, touch.clientY);
        e.preventDefault();
      },
      { passive: false }
    );

    window.addEventListener(
      'touchmove',
      (e) => {
        const touch = Array.from(e.changedTouches).find((item) => this.stickId === -(item.identifier + 1));
        if (!touch) return;
        moveStick(touch.clientX, touch.clientY);
        e.preventDefault();
      },
      { passive: false }
    );

    const endTouchStick = (e: TouchEvent) => {
      // 权威兜底：若所有手指均已离开，或当前触点在 changedTouches 中，清零摇杆
      if (e.touches && e.touches.length === 0) {
        this.stickId = null;
        this.stick = [0, 0];
        if (knob) knob.style.transform = '';
        return;
      }
      if (!Array.from(e.changedTouches).some((touch) => this.stickId === -(touch.identifier + 1))) return;
      this.stickId = null;
      this.stick = [0, 0];
      if (knob) knob.style.transform = '';
    };
    window.addEventListener('touchend', endTouchStick, { passive: true });
    window.addEventListener('touchcancel', endTouchStick, { passive: true });

    // --- Rise / Descend Elevation Controls ---
    const releaseRise = (id: number) => {
      this.vertical.delete(id);
      this.riseHolds.delete(id);
    };
    const endRisePointer = (e: Event) => releaseRise((e as PointerEvent).pointerId);
    const insideRiseButton = (id: number, x: number, y: number) => {
      const hold = this.riseHolds.get(id);
      if (!hold || !Number.isFinite(x) || !Number.isFinite(y)) return true;
      const rect = hold.button.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    };

    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      window.addEventListener(type, endRisePointer, { capture: true });
    }
    window.addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType !== 'touch' && typeof e.buttons === 'number' && (e.buttons & 1) === 0) {
          releaseRise(e.pointerId);
        }
        if (!insideRiseButton(e.pointerId, e.clientX, e.clientY)) releaseRise(e.pointerId);
      },
      { capture: true }
    );
    window.addEventListener('pointerdown', endRisePointer, { capture: true });
    window.addEventListener(
      'pointerout',
      (e) => {
        if (e.relatedTarget === null && e.pointerType !== 'touch') releaseRise(e.pointerId);
      },
      { capture: true }
    );

    const syncRiseTouches = (e: TouchEvent) => {
      if (e.type === 'touchend' || e.type === 'touchcancel') {
        for (const touch of Array.from(e.changedTouches)) releaseRise(-(touch.identifier + 1));
      }
      if (e.touches) {
        const held = new Set(Array.from(e.touches, (touch) => -(touch.identifier + 1)));
        for (const id of this.vertical.keys()) if (id < 0 && !held.has(id)) releaseRise(id);
        for (const touch of Array.from(e.touches)) {
          const id = -(touch.identifier + 1);
          if (!insideRiseButton(id, touch.clientX, touch.clientY)) releaseRise(id);
        }
      }
    };
    for (const type of ['touchstart', 'touchmove', 'touchend', 'touchcancel']) {
      window.addEventListener(type, syncRiseTouches as EventListener, { capture: true, passive: true });
    }

    document.querySelectorAll<HTMLButtonElement>('[data-rise]').forEach((button) => {
      button.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch' || e.button !== 0) return;
        e.preventDefault();
        this.vertical.set(e.pointerId, Number(button.dataset.rise));
        this.riseHolds.set(e.pointerId, { button, since: performance.now() });
        try {
          button.setPointerCapture(e.pointerId);
        } catch {}
      });
      for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
        button.addEventListener(type, endRisePointer);
      }
      button.addEventListener(
        'touchstart',
        (e) => {
          e.preventDefault();
          for (const touch of Array.from(e.changedTouches)) {
            this.vertical.set(-(touch.identifier + 1), Number(button.dataset.rise));
            this.riseHolds.set(-(touch.identifier + 1), { button, since: performance.now() });
          }
        },
        { passive: false }
      );
    });

    document.querySelectorAll<HTMLButtonElement>('[data-action="jump"]').forEach((button) => {
      button.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch') return;
        e.preventDefault();
        this.jump();
      });
      button.addEventListener(
        'touchstart',
        (e) => {
          e.preventDefault();
          this.jump();
        },
        { passive: false }
      );
    });

    // --- Keyboard controls ---
    const GAME_KEYS = new Set([
      'KeyW',
      'KeyA',
      'KeyS',
      'KeyD',
      'KeyQ',
      'KeyE',
      'ShiftLeft',
      'ShiftRight',
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'Space',
      'ControlLeft',
      'ControlRight'
    ]);

    window.addEventListener('keydown', (e) => {
      if ((e.target as HTMLElement).matches?.('input, select, textarea, button')) return;
      if (GAME_KEYS.has(e.code)) {
        e.preventDefault();
        this.keys.add(e.code);
        this.keyActivity.set(e.code, performance.now());
        if (e.code === 'Space' && this.mode === 'walk' && this.isGrounded) {
          this.jump();
        }
      }
    });

    window.addEventListener(
      'keyup',
      (e) => {
        this.keys.delete(e.code);
        this.keyActivity.delete(e.code);
        if (!e.ctrlKey) {
          this.keys.delete('ControlLeft');
          this.keys.delete('ControlRight');
          this.keyActivity.delete('ControlLeft');
          this.keyActivity.delete('ControlRight');
        }
      },
      { capture: true }
    );

    const clear = () => {
      this.keys.clear();
      this.keyActivity.clear();
      this.vertical.clear();
      this.riseHolds.clear();
      this.look = null;
      this.stickId = null;
      this.stick = [0, 0];
      this.jumpRequested = false;
      if (knob) knob.style.transform = '';
    };
    this.clear = clear;
    window.addEventListener('blur', clear);
    window.addEventListener('pagehide', clear);
    window.addEventListener('focus', clear);
    window.addEventListener('resize', clear);
    window.addEventListener('orientationchange', clear);
    document.addEventListener('focusin', (e) => {
      if ((e.target as HTMLElement).matches?.('input, select, textarea, [contenteditable="true"]')) clear();
    });
    document.addEventListener('visibilitychange', clear);
  }

  jump() {
    if (this.mode === 'walk' && this.isGrounded) {
      this.velocityY = this.jumpSpeed;
      this.isGrounded = false;
      this.jumpRequested = true;
    }
  }

  levelHorizon() {
    this.pitch = 0;
  }

  levelView() {
    this.pitch = 0;
  }

  setMode(mode: 'flight' | 'walk') {
    this.clear();
    if (this.mode === mode) return;
    this.mode = mode;
    this.velocityY = 0;
    this.jumpRequested = false;
    if (mode === 'walk') {
      this.snapToGround();
    }
  }

  snapToGround() {
    if (!this.collider) return;
    const feetY = this.position[1] - this.eyeHeight;
    const ground = this.collider.getGroundHeight(this.position[0], feetY + 1.2, this.position[2], 120);
    if (ground) {
      this.position[1] = ground.groundY + this.eyeHeight;
      this.isGrounded = true;
      this.velocityY = 0;
      this.fallTime = 0;
      if (this.lastGroundedPos) vec3.copy(this.lastGroundedPos, this.position);
    }
  }

  resetToSpawn() {
    this.clear();
    vec3.copy(this.position, this.spawnPos);
    this.pitch = 0;
    this.velocityY = 0;
    this.isGrounded = true;
    this.fallTime = 0;
  }

  respawnAtLastSafe() {
    this.clear();
    if (vec3.length(this.lastGroundedPos) > 0.01) {
      vec3.copy(this.position, this.lastGroundedPos);
    } else {
      vec3.copy(this.position, this.spawnPos);
    }
    this.velocityY = 0;
    this.isGrounded = true;
    this.fallTime = 0;
  }

  restoreState(pos: [number, number, number], yaw: number, pitch: number) {
    this.clear();
    vec3.set(this.position, pos[0], pos[1], pos[2]);
    if (this.spawnPos) vec3.copy(this.spawnPos, this.position);
    if (this.lastGroundedPos) vec3.copy(this.lastGroundedPos, this.position);
    this.yaw = yaw;
    this.pitch = Math.max(-1.52, Math.min(1.52, pitch));
    this.velocityY = 0;
    this.isGrounded = false;
    this.fallTime = 0;
    if (this.mode === 'walk') {
      this.snapToGround();
      vec3.copy(this.spawnPos, this.position);
      vec3.copy(this.lastGroundedPos, this.position);
    }
  }

  update(dtSec: number) {
    const now = performance.now();
    for (const [id, hold] of this.riseHolds) {
      if (now - hold.since >= FlightControls.MAX_HOLD_MS) {
        this.vertical.delete(id);
        this.riseHolds.delete(id);
      }
    }
    for (const [code, lastActive] of this.keyActivity) {
      if (now - lastActive >= FlightControls.MAX_HOLD_MS) {
        this.keys.delete(code);
        this.keyActivity.delete(code);
      }
    }
    const key = (...codes: string[]) => Number(codes.some((code) => this.keys.has(code)));

    if (this.mode !== 'walk') {
      // Free flight mode
      this.velocityY = 0;
      this.fallTime = 0;
      this.jumpRequested = false;
      let x = this.stick[0] + key('KeyD', 'ArrowRight') - key('KeyA', 'ArrowLeft');
      let z = this.stick[1] + key('KeyS', 'ArrowDown') - key('KeyW', 'ArrowUp');
      const length = Math.max(1, Math.hypot(x, z));
      x /= length;
      z /= length;
      const step = Math.min(dtSec, 0.05) * this.speed * (key('ShiftLeft', 'ShiftRight') ? 3 : 1);
      this.position[0] += (Math.cos(this.yaw) * x + Math.sin(this.yaw) * z) * step;
      this.position[2] += (-Math.sin(this.yaw) * x + Math.cos(this.yaw) * z) * step;

      const up = key('Space', 'KeyE');
      const down = key('ControlLeft', 'ControlRight', 'KeyQ');
      const vertical = Math.max(-1, Math.min(1, [...this.vertical.values()].reduce((a, b) => a + b, 0) + up - down));
      const previousY = this.position[1];
      let nextY = previousY + vertical * step;

      if (vertical < 0 && this.collider) {
        const clearance = 0.2;
        const ground = this.collider.getGroundHeight(
          this.position[0],
          previousY,
          this.position[2],
          previousY - nextY + clearance
        );
        if (ground && ground.groundY <= previousY && nextY <= ground.groundY + clearance) {
          nextY = ground.groundY + clearance;
          for (const [id, value] of this.vertical) {
            if (value < 0) {
              this.vertical.delete(id);
              this.riseHolds.delete(id);
            }
          }
          for (const code of ['ControlLeft', 'ControlRight', 'KeyQ']) {
            this.keys.delete(code);
            this.keyActivity.delete(code);
          }
        }
      }
      this.position[1] = nextY;
      return;
    }

    // Walk mode: First-Person walking & jumping
    let x = this.stick[0] + key('KeyD', 'ArrowRight') - key('KeyA', 'ArrowLeft');
    let z = this.stick[1] + key('KeyS', 'ArrowDown') - key('KeyW', 'ArrowUp');
    const len = Math.hypot(x, z);
    if (len > 1) {
      x /= len;
      z /= len;
    }

    const sprint = key('ShiftLeft', 'ShiftRight') ? 1.7 : 1.0;
    const walkSpeed = Math.min(this.speed / 3, 10) * sprint;
    const stepDt = Math.min(dtSec, 0.05);
    const step = stepDt * walkSpeed;

    const dx = (Math.cos(this.yaw) * x + Math.sin(this.yaw) * z) * step;
    const dz = (-Math.sin(this.yaw) * x + Math.cos(this.yaw) * z) * step;
    const up = key('Space', 'KeyE');
    const down = key('ControlLeft', 'ControlRight', 'KeyQ');
    const vertical = Math.max(-1, Math.min(1, [...this.vertical.values()].reduce((a, b) => a + b, 0) + up - down));

    const previousFeetY = this.position[1] - this.eyeHeight;
    if (this.jumpRequested) {
      this.velocityY = this.jumpSpeed;
      this.isGrounded = false;
      this.jumpRequested = false;
    }

    if (vertical > 0) {
      this.velocityY = 0;
      this.isGrounded = false;
      this.fallTime = 0;
      this.position[1] += vertical * 10.0 * stepDt;
    } else if (vertical < 0) {
      this.position[1] += vertical * 10.0 * stepDt;
      this.velocityY = 0;
    } else {
      this.velocityY -= this.gravity * stepDt;
    }

    let feetY = this.position[1] - this.eyeHeight + (vertical === 0 ? this.velocityY * stepDt : 0);

    let targetX = this.position[0] + dx;
    let targetZ = this.position[2] + dz;

    if (this.collider) {
      const stepUp = 0.5;
      const maxStepDown = this.isGrounded ? 1.8 : 80;
      const probeY = Math.max(previousFeetY, feetY) + stepUp;
      let ground = this.collider.getGroundHeight(targetX, probeY, targetZ, maxStepDown);

      if (!ground && (dx !== 0 || dz !== 0)) {
        const groundX = this.collider.getGroundHeight(targetX, probeY, this.position[2], maxStepDown);
        if (groundX) {
          targetZ = this.position[2];
          ground = groundX;
        } else {
          const groundZ = this.collider.getGroundHeight(this.position[0], probeY, targetZ, maxStepDown);
          if (groundZ) {
            targetX = this.position[0];
            ground = groundZ;
          } else {
            targetX = this.position[0];
            targetZ = this.position[2];
          }
        }
      }

      this.position[0] = targetX;
      this.position[2] = targetZ;

      const landingGround = ground ?? this.collider.getGroundHeight(this.position[0], probeY, this.position[2], maxStepDown);
      if (landingGround && feetY <= landingGround.groundY) {
        feetY = landingGround.groundY;
        this.velocityY = 0;
        this.isGrounded = true;
        this.fallTime = 0;
        if (this.lastGroundedPos) {
          vec3.copy(this.lastGroundedPos, this.position);
          this.lastGroundedPos[1] = feetY + this.eyeHeight;
        }
      } else {
        this.isGrounded = false;
        this.fallTime += stepDt;
        if (this.fallTime > 4.0 || (this.collider.lowestY && feetY < this.collider.lowestY - 50)) {
          this.respawnAtLastSafe();
          feetY = this.position[1] - this.eyeHeight;
        }
      }
    } else {
      this.position[0] = targetX;
      this.position[2] = targetZ;
    }

    this.position[1] = feetY + this.eyeHeight;
  }
}

export { FlightControls as CameraControls };
