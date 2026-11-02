import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

test('Progression module files exist on disk', () => {
  const requiredFiles = [
    'src/progression/index.tsx',
    'src/progression/App.tsx',
    'src/progression/index.css',
    'src/progression/data/soulsData.ts',
    'src/progression/data/merchantData.ts',
    'src/progression/components/FlowchartCanvas.tsx',
    'src/progression/components/MapDetailPage.tsx',
    'src/progression/components/Header.tsx',
    'src/progression/components/NavigationMenuDrawer.tsx',
    'src/progression/components/StageQuickNav.tsx'
  ];

  for (const relPath of requiredFiles) {
    const fullPath = join(projectRoot, relPath);
    assert.ok(existsSync(fullPath), `Expected file to exist: ${relPath}`);
  }
});

test('Progression soulsData contains all stages and map nodes', () => {
  const soulsDataRaw = readFileSync(join(projectRoot, 'src/progression/data/soulsData.ts'), 'utf8');

  // Verify key stages
  assert.ok(soulsDataRaw.includes('prologue'));
  assert.ok(soulsDataRaw.includes('four_souls'));
  assert.ok(soulsDataRaw.includes('drangleic'));
  assert.ok(soulsDataRaw.includes('undead_crypt'));
  assert.ok(soulsDataRaw.includes('dragon_shrine'));
  assert.ok(soulsDataRaw.includes('memories'));
  assert.ok(soulsDataRaw.includes('throne_endings'));
  assert.ok(soulsDataRaw.includes('dlc'));

  // Verify key nodes
  assert.ok(soulsDataRaw.includes('things_betwixt'));
  assert.ok(soulsDataRaw.includes('majula'));
  assert.ok(soulsDataRaw.includes('forest_of_fallen_giants'));
  assert.ok(soulsDataRaw.includes('heides_tower'));
  assert.ok(soulsDataRaw.includes('drangleic_castle'));
});

test('Progression buttons and view containers are present in main.ts and styles.css', () => {
  const mainTs = readFileSync(join(projectRoot, 'src/main.ts'), 'utf8');
  assert.ok(mainTs.includes('btn-welcome-progression'), 'main.ts has welcome progression button');
  assert.ok(mainTs.includes('btn-header-progression'), 'main.ts has header progression button');
  assert.ok(mainTs.includes('btn-drawer-progression'), 'main.ts has drawer progression button');
  assert.ok(mainTs.includes('progression-view'), 'main.ts has progression-view mount point');
  assert.ok(mainTs.includes('mountProgressionView'), 'main.ts imports and mounts progression view');

  const stylesCss = readFileSync(join(projectRoot, 'src/styles.css'), 'utf8');
  assert.ok(stylesCss.includes('progression-view-fullscreen'), 'styles.css defines progression-view-fullscreen');
  assert.ok(stylesCss.includes('btn-welcome-progression'), 'styles.css styles btn-welcome-progression');
  assert.ok(stylesCss.includes('body.rotated-landscape .progression-view-fullscreen'), 'styles.css supports rotated landscape');
  assert.ok(stylesCss.includes('body.native-landscape .progression-view-fullscreen'), 'styles.css supports native landscape');
});

test('Progression landscape orientation and touch adaptation in main.ts and FlowchartCanvas', () => {
  const mainTs = readFileSync(join(projectRoot, 'src/main.ts'), 'utf8');
  assert.ok(mainTs.includes('progression-view-active'), 'main.ts manages progression-view-active class');
  assert.ok(mainTs.includes('orientation: \'landscape\''), 'main.ts requests landscape orientation on enter');
  assert.ok(mainTs.includes('orientation: \'portrait\''), 'main.ts restores portrait orientation on exit to welcome');

  const canvasTs = readFileSync(join(projectRoot, 'src/progression/components/FlowchartCanvas.tsx'), 'utf8');
  assert.ok(canvasTs.includes('rotated-landscape'), 'FlowchartCanvas handles rotated-landscape touch/mouse coords');
  assert.ok(canvasTs.includes('pinchDistRef'), 'FlowchartCanvas supports two-finger pinch-to-zoom');
});

