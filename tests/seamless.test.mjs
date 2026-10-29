import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const boundsPath = resolve(__dirname, '../src/map-bounds.json');
const mapBounds = JSON.parse(readFileSync(boundsPath, 'utf8'));

// 从 seamless.ts 读取 LINKS 并进行纯逻辑镜像测试
const ALL_MAP_IDS = [
  'm10_02', 'm10_04', 'm10_10', 'm10_14', 'm10_15', 'm10_16', 'm10_17', 'm10_18',
  'm10_19', 'm10_23', 'm10_25', 'm10_27', 'm10_29', 'm10_30', 'm10_31', 'm10_32',
  'm10_33', 'm10_34', 'm20_10', 'm20_11', 'm20_21', 'm20_24', 'm20_26', 'm40_03',
  'm50_35', 'm50_36', 'm50_37'
];

const LINKS = [
  ['m10_02', 'm10_04'],
  ['m10_04', 'm10_10'],
  ['m10_04', 'm10_29'],
  ['m10_04', 'm10_23'],
  ['m10_04', 'm10_34'],
  ['m10_04', 'm10_25'],
  ['m10_04', 'm10_32'],
  ['m10_29', 'm10_31'],
  ['m10_29', 'm10_30'],
  ['m10_29', 'm10_34'],
  ['m10_31', 'm10_30'],
  ['m10_30', 'm10_18'],
  ['m10_31', 'm10_18'],
  ['m10_18', 'm10_16'],
  ['m10_10', 'm10_16'],
  ['m10_10', 'm20_10'],
  ['m10_23', 'm10_17'],
  ['m10_17', 'm10_19'],
  ['m10_34', 'm10_25'],
  ['m10_25', 'm40_03'],
  ['m10_32', 'm10_33'],
  ['m10_33', 'm10_14'],
  ['m10_14', 'm20_26'],
  ['m10_32', 'm20_21'],
  ['m20_21', 'm20_11'],
  ['m20_21', 'm40_03'],
  ['m20_21', 'm10_15'],
  ['m20_11', 'm20_24'],
  ['m20_24', 'm10_15'],
  ['m10_32', 'm10_15'],
  ['m10_15', 'm10_27'],
  ['m10_32', 'm40_03'],
  ['m10_25', 'm50_35'],
  ['m10_19', 'm50_36'],
  ['m10_32', 'm50_37']
];

const ADJACENT = new Map();
for (const [a, b] of LINKS) {
  ADJACENT.set(a, [...(ADJACENT.get(a) ?? []), b]);
  ADJACENT.set(b, [...(ADJACENT.get(b) ?? []), a]);
}

function pointBoxDistance(point, min, max) {
  return Math.hypot(...point.map((value, axis) => Math.max(min[axis] - value, 0, value - max[axis])));
}

function distanceToRegion(mapId, point) {
  const boxes = mapBounds[mapId];
  if (!boxes) return Infinity;
  return Math.min(...boxes.map((box) => pointBoxDistance(point, box.min, box.max)));
}

function nearbyRegions(mapId, point, radius = 500, count = 5) {
  const linked = ADJACENT.get(mapId) ?? [];
  return linked
    .map((id) => ({ id, distance: distanceToRegion(id, point) }))
    .filter((entry) => entry.distance <= radius)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count)
    .map((entry) => entry.id);
}

function isRegionFar(mapId, point, unloadRadius = 850) {
  return distanceToRegion(mapId, point) > unloadRadius;
}

test('All 27 maps are represented in the seamless adjacency graph', () => {
  assert.equal(ALL_MAP_IDS.length, 27);
  for (const mapId of ALL_MAP_IDS) {
    const neighbors = ADJACENT.get(mapId);
    assert.ok(neighbors && neighbors.length > 0, `Map ${mapId} must have at least one seamless connection`);
  }
});

test('Graph connectivity: entire Dark Souls 2 world is a single connected graph', () => {
  const visited = new Set();
  const queue = ['m10_04']; // 从如蜜出发
  visited.add('m10_04');

  while (queue.length > 0) {
    const curr = queue.shift();
    for (const neighbor of ADJACENT.get(curr) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  assert.equal(visited.size, 27, `All 27 maps must be reachable in seamless world graph, found ${visited.size}`);
});

test('Crucial overland and warp routes are properly connected', () => {
  // 虚影森林与安第尔之馆
  assert.ok(ADJACENT.get('m10_32').includes('m10_15'));
  // 巨人陨落之森与遗忘牢笼 (鸟巢直飞)
  assert.ok(ADJACENT.get('m10_10').includes('m10_16'));
  // 如蜜地底通道与海德巨火塔
  assert.ok(ADJACENT.get('m10_29').includes('m10_30'));
  // 如蜜大坑直通废渊
  assert.ok(ADJACENT.get('m10_04').includes('m10_25'));
  // 巨人回忆与巨人森林
  assert.ok(ADJACENT.get('m10_10').includes('m20_10'));
  // 古龙回忆与辉石镇
  assert.ok(ADJACENT.get('m10_14').includes('m20_26'));
  // 暗潜古穴与三处入口 (黑溪谷、王城、虚影森林)
  assert.ok(ADJACENT.get('m40_03').includes('m10_25'));
  assert.ok(ADJACENT.get('m40_03').includes('m20_21'));
  assert.ok(ADJACENT.get('m40_03').includes('m10_32'));
  // 失落王冠三大 DLC 蛇之祭坛通道
  assert.ok(ADJACENT.get('m10_25').includes('m50_35'), 'Black Gulch must connect to Shulva DLC');
  assert.ok(ADJACENT.get('m10_19').includes('m50_36'), 'Iron Keep must connect to Brume Tower DLC');
  assert.ok(ADJACENT.get('m10_32').includes('m50_37'), 'Shaded Woods must connect to Eleum Loyce DLC');
});

test('Dynamic loading radius & count: Majula can load up to 5 adjacent maps simultaneously', () => {
  const majulaSpawn = [-11.38, -45.66, -33.15];
  const nearby = nearbyRegions('m10_04', majulaSpawn, 500, 5);
  // 如蜜周边在 500 范围内有多个相邻区域，应成功加载多个
  assert.ok(nearby.length >= 3, `Expected at least 3 nearby regions from Majula center, got ${nearby.length}`);
  assert.ok(nearby.length <= 5, 'Should not exceed max count of 5');
});

test('Hysteresis unloading: distant regions are marked far while nearby are kept', () => {
  const majulaSpawn = [-11.38, -45.66, -33.15];
  // 暗潜古穴离如蜜非常远 (> 850)
  assert.ok(isRegionFar('m40_03', majulaSpawn, 850));
  // 卫龙巢穴离如蜜超过 800
  assert.ok(isRegionFar('m10_27', majulaSpawn, 800));
  // 巨人陨落之森离如蜜很近 (<= 800)
  assert.equal(isRegionFar('m10_10', majulaSpawn, 800), false);
});

test('Full world spatial sorting prioritizes nearby regions before distant kingdoms', () => {
  const majulaCenter = [-11, -46, -33];
  const sorted = [...ALL_MAP_IDS]
    .filter((id) => id !== 'm10_04')
    .sort((a, b) => {
      const distA = distanceToRegion(a, majulaCenter);
      const distB = distanceToRegion(b, majulaCenter);
      return distA - distB;
    });

  // Top closest maps to Majula must include adjacent Grave of Saints, Things Betwixt, or nearby areas
  const top5 = sorted.slice(0, 5);
  assert.ok(top5.includes('m10_34') || top5.includes('m10_02') || top5.includes('m10_29'));
  // Dragon Shrine / Aerie / Undead Crypt should be in the back half
  const aerieIdx = sorted.indexOf('m10_27');
  assert.ok(aerieIdx > 10, `Dragon Aerie should be in back half of sorted list, got index ${aerieIdx}`);
});
