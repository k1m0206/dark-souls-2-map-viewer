import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const boundsPath = resolve(__dirname, '../src/map-bounds.json');
const mapBounds = JSON.parse(readFileSync(boundsPath, 'utf8'));

// 从 seamless.ts 读取定义与逻辑镜像测试
const ALL_MAP_IDS = [
  'm10_02', 'm10_04', 'm10_10', 'm10_14', 'm10_15', 'm10_16', 'm10_17', 'm10_18',
  'm10_19', 'm10_23', 'm10_25', 'm10_27', 'm10_29', 'm10_30', 'm10_31', 'm10_32',
  'm10_33', 'm10_34', 'm20_10', 'm20_11', 'm20_21', 'm20_24', 'm20_26', 'm40_03',
  'm50_35', 'm50_36', 'm50_37'
];

const WARP_ISOLATED_MAPS = [
  'm50_35', // 圣壁之都萨尔瓦 (DLC 1)
  'm50_36', // 黑雾之塔 (DLC 2)
  'm50_37', // 埃斯・洛耶斯 (DLC 3)
  'm20_10', // 巨人回忆 (梦境回忆)
  'm20_26', // 古龙回忆 (梦境回忆)
  'm40_03', // 暗潜古穴 (深渊异空间)
];

function isWarpIsolatedMap(mapId) {
  return WARP_ISOLATED_MAPS.includes(mapId);
}

const LINKS = [
  // 1. 初期启程
  ['m10_02', 'm10_04'], // 一线天森林 <-> 如蜜
  ['m10_04', 'm10_10'], // 如蜜 <-> 巨人陨落之森
  ['m10_04', 'm10_29'], // 如蜜 <-> 地底通道与通路
  ['m10_04', 'm10_23'], // 如蜜 <-> 狩猎森林 (提灯修女回廊)
  ['m10_04', 'm10_34'], // 如蜜 <-> 圣人墓地 (如蜜大坑第一层横木梯子)
  ['m10_04', 'm10_25'], // 如蜜 <-> 废渊黑溪谷 (如蜜大坑落底深渊)
  ['m10_04', 'm10_32'], // 如蜜 <-> 虚影森林 (解石化机关大门)

  // 2. 海德与密港
  ['m10_29', 'm10_31'], // 地底通道 <-> 青之圣堂
  ['m10_29', 'm10_30'], // 地底通道 <-> 海德巨火塔 (拉动机关铁门)
  ['m10_29', 'm10_34'], // 地底通道 <-> 圣人墓地
  ['m10_31', 'm10_30'], // 青之圣堂 <-> 海德巨火塔
  ['m10_30', 'm10_18'], // 海德巨火塔 <-> 密港 (龙骑兵螺旋梯)
  ['m10_31', 'm10_18'], // 青之圣堂 <-> 密港

  // 3. 遗忘牢笼航线
  ['m10_18', 'm10_16'], // 密港 <-> 遗忘牢笼 (幽灵船直航)
  ['m10_10', 'm10_16'], // 巨人陨落之森 <-> 遗忘牢笼 (击败咒缚者鸟巢直飞)

  // 4. 熔铁城路线
  ['m10_23', 'm10_17'], // 狩猎森林 <-> 流油谷
  ['m10_17', 'm10_19'], // 流油谷 <-> 熔铁城

  // 5. 圣人墓地与废渊深处
  ['m10_34', 'm10_25'], // 圣人墓地 <-> 废渊 (木梁落底)

  // 6. 虚影森林与辉石镇
  ['m10_32', 'm10_33'], // 虚影森林 <-> 法洛斯门径 (歧路遗迹右路)
  ['m10_33', 'm10_14'], // 法洛斯门径 <-> 辉石镇盖多勒

  // 7. 多兰古雷格王城与深处
  ['m10_32', 'm20_21'], // 虚影森林(冬之庙) <-> 多兰古雷格王城
  ['m20_21', 'm20_11'], // 多兰古雷格王城 <-> 阿玛纳祭坛 (镜之骑士升降机)
  ['m20_11', 'm20_24'], // 阿玛纳祭坛 <-> 不死灵庙 (歌唱恶魔水路)

  // 8. 安第尔与巨龙圣域
  ['m10_32', 'm10_15'], // 虚影森林 <-> 安第尔之馆 (歧路遗迹左路国王门大道)
  ['m10_15', 'm10_27'], // 安第尔之馆 <-> 卫龙巢穴与龙祭坛 (后门吊桥)
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

function getCompatibleWorldMaps(activeMapId) {
  if (isWarpIsolatedMap(activeMapId)) {
    return [activeMapId];
  }
  const isAldiaRoute = activeMapId === 'm10_15' || activeMapId === 'm10_27';
  const baseOverland = [
    'm10_02', 'm10_04', 'm10_29', 'm10_10', 'm10_30', 'm10_31', 'm10_18', 'm10_16',
    'm10_23', 'm10_17', 'm10_19', 'm10_34', 'm10_25', 'm10_32', 'm10_33', 'm10_14'
  ];

  if (isAldiaRoute) {
    return [...baseOverland, 'm10_15', 'm10_27'];
  } else {
    return [...baseOverland, 'm20_21', 'm20_11', 'm20_24'];
  }
}

function nearbyRegions(mapId, point, radius = 500, count = 5) {
  if (isWarpIsolatedMap(mapId)) {
    return [];
  }
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

test('Map catalog has exactly 27 maps: 21 overland continent and 6 warp isolated maps', () => {
  assert.equal(ALL_MAP_IDS.length, 27);
  assert.equal(WARP_ISOLATED_MAPS.length, 6);
  const overland = ALL_MAP_IDS.filter((id) => !isWarpIsolatedMap(id));
  assert.equal(overland.length, 21);
});

test('Isolated warp maps are strictly identified', () => {
  assert.equal(isWarpIsolatedMap('m50_35'), true, 'Shulva DLC is isolated');
  assert.equal(isWarpIsolatedMap('m50_36'), true, 'Brume Tower DLC is isolated');
  assert.equal(isWarpIsolatedMap('m50_37'), true, 'Eleum Loyce DLC is isolated');
  assert.equal(isWarpIsolatedMap('m20_10'), true, 'Memory of Giants is isolated');
  assert.equal(isWarpIsolatedMap('m20_26'), true, 'Memory of Dragon is isolated');
  assert.equal(isWarpIsolatedMap('m40_03'), true, 'Dark Chasm of Old is isolated');
  assert.equal(isWarpIsolatedMap('m10_04'), false, 'Majula is overland mainland');
  assert.equal(isWarpIsolatedMap('m20_21'), false, 'Drangleic Castle is overland mainland');
});

test('Overland connectivity: all 21 mainland continent maps are connected in a single graph', () => {
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

  assert.equal(visited.size, 21, `All 21 overland maps must be reachable from Majula, found ${visited.size}`);
});

test('Isolated warp maps return empty adjacent list and empty nearby regions', () => {
  for (const warpId of WARP_ISOLATED_MAPS) {
    assert.equal(ADJACENT.get(warpId), undefined, `Isolated warp map ${warpId} should not have overland adjacency`);
    const nearby = nearbyRegions(warpId, [0, 0, 0]);
    assert.deepEqual(nearby, [], `Isolated warp map ${warpId} should not load any nearby regions`);
  }
});

test('getCompatibleWorldMaps: isolated warp maps load strictly alone', () => {
  for (const warpId of WARP_ISOLATED_MAPS) {
    const maps = getCompatibleWorldMaps(warpId);
    assert.deepEqual(maps, [warpId], `Isolated warp map ${warpId} must load strictly as single map [${warpId}]`);
  }
});

test('getCompatibleWorldMaps: mainland maps load without any isolated warp maps to prevent clipping', () => {
  const majulaMaps = getCompatibleWorldMaps('m10_04');
  assert.equal(majulaMaps.length, 19);
  for (const warpId of WARP_ISOLATED_MAPS) {
    assert.equal(majulaMaps.includes(warpId), false, `Mainland world maps must NOT include ${warpId}`);
  }

  // Drangleic route includes Castle but excludes Aldia
  assert.ok(majulaMaps.includes('m20_21'));
  assert.ok(majulaMaps.includes('m20_11'));
  assert.ok(majulaMaps.includes('m20_24'));
  assert.equal(majulaMaps.includes('m10_15'), false);

  // Aldia route includes Keep & Shrine but excludes Castle
  const aldiaMaps = getCompatibleWorldMaps('m10_15');
  assert.equal(aldiaMaps.length, 18);
  assert.ok(aldiaMaps.includes('m10_15'));
  assert.ok(aldiaMaps.includes('m10_27'));
  assert.equal(aldiaMaps.includes('m20_21'), false);
});

test('Crucial overland routes are properly connected', () => {
  // 虚影森林与安第尔之馆
  assert.ok(ADJACENT.get('m10_32').includes('m10_15'));
  // 虚影森林与多兰古雷格王城 (冬之庙)
  assert.ok(ADJACENT.get('m10_32').includes('m20_21'));
  // 巨人陨落之森与遗忘牢笼 (鸟巢直飞)
  assert.ok(ADJACENT.get('m10_10').includes('m10_16'));
  // 如蜜地底通道与海德巨火塔
  assert.ok(ADJACENT.get('m10_29').includes('m10_30'));
  // 如蜜大坑直通废渊
  assert.ok(ADJACENT.get('m10_04').includes('m10_25'));
});

test('Dynamic loading radius & count: Majula loads adjacent mainland maps', () => {
  const majulaSpawn = [-11.38, -45.66, -33.15];
  const nearby = nearbyRegions('m10_04', majulaSpawn, 500, 5);
  assert.ok(nearby.length >= 3, `Expected at least 3 nearby regions from Majula center, got ${nearby.length}`);
  assert.ok(nearby.length <= 5, 'Should not exceed max count of 5');
});

test('Hysteresis unloading: distant regions are marked far while nearby are kept', () => {
  const majulaSpawn = [-11.38, -45.66, -33.15];
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
