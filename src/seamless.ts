import mapBounds from './map-bounds.json';

// 传送不连通的独立异空间地图集合（三大王冠 DLC、回忆梦境与深渊古穴）
// 依据原版游戏逻辑：这些区域在游戏中通过传送门/蛇之祭坛/触碰调查单独载入，
// 原版直接复用了原点坐标系，因此必须独立单独加载自身，绝不可与本体大地图混在一起加载！
export const WARP_ISOLATED_MAPS = new Set([
  'm50_35', // 深渊王冠·萨尔瓦 (DLC1 始源篝火蛇之祭坛传送)
  'm50_36', // 铁之王冠·黑雾塔 (DLC2 始源篝火蛇之祭坛传送)
  'm50_37', // 白王王冠·埃斯洛耶斯 (DLC3 冬之庙蛇之祭坛传送)
  'm20_10', // 巨人回忆 (调查巨人树梦境空间)
  'm20_26', // 古龙回忆 (公爵私室调查巨龙残晶)
  'm40_03', // 暗潜者古穴 (暗之朝圣者传送门)
]);

export function isWarpIsolatedMap(mapId: string): boolean {
  return WARP_ISOLATED_MAPS.has(mapId);
}

// 安第尔与巨龙圣域专属连通域 (安第尔之馆 <-> 卫龙巢穴与龙祭坛)
export const ALDIA_SANCTUM_MAPS = new Set([
  'm10_15', // 安第尔之馆
  'm10_27', // 卫龙巢穴与龙祭坛
]);

export function isAldiaSanctumMap(mapId: string): boolean {
  return ALDIA_SANCTUM_MAPS.has(mapId);
}

// 多兰古雷格本体大陆真实连通拓扑（纯物理陆地走廊、洞窟通道与海航渡口）
export const LINKS: [string, string][] = [
  // 1. 初期启程与狭间通道
  ['m10_02', 'm10_29'], // 一线天森林 <-> 狭间通路 (岩窟洞口)
  ['m10_29', 'm10_04'], // 狭间通路 <-> 如蜜 (海滨悬崖入口)
  ['m10_02', 'm10_04'], // 一线天森林 <-> 如蜜 (广域邻近)
  ['m10_04', 'm10_10'], // 如蜜 <-> 巨人陨落之森 (河道水闸)
  ['m10_04', 'm10_30'], // 如蜜 <-> 海德巨火塔 (地底水闸与下沉石阶长廊)
  ['m10_04', 'm10_23'], // 如蜜 <-> 狩猎森林 (机关水渠石门)
  ['m10_04', 'm10_34'], // 如蜜 <-> 圣人墓地 (大坑中层)
  ['m10_04', 'm10_25'], // 如蜜 <-> 废渊 (大坑底部长梯)
  ['m10_04', 'm10_32'], // 如蜜 <-> 虚影森林 (解石化大门)

  // 2. 海德与密港
  ['m10_30', 'm10_31'], // 海德巨火塔 <-> 青之圣堂 (吊桥相连)
  ['m10_30', 'm10_18'], // 海德巨火塔 <-> 密港 (龙骑兵螺旋深梯)
  ['m10_31', 'm10_18'], // 青之圣堂 <-> 密港

  // 3. 遗忘牢笼航线
  ['m10_18', 'm10_16'], // 密港 <-> 遗忘牢笼 (幽灵船直航)
  ['m10_10', 'm10_16'], // 巨人陨落之森 <-> 遗忘牢笼 (击败咒缚者鸟巢直飞)

  // 4. 熔铁城路线
  ['m10_23', 'm10_17'], // 狩猎森林 <-> 流油谷
  ['m10_17', 'm10_19'], // 流油谷堆土塔 <-> 熔铁城 (升降机直上)

  // 5. 圣人墓地与废渊深处
  ['m10_34', 'm10_25'], // 圣人墓地 <-> 废渊 (木梁落底)

  // 6. 虚影森林与辉石镇
  ['m10_32', 'm10_33'], // 虚影森林 <-> 法洛斯门径 (歧路遗迹右路)
  ['m10_33', 'm10_14'], // 法洛斯门径 <-> 辉石镇盖多勒

  // 7. 多兰古雷格王城与深处
  ['m10_32', 'm20_21'], // 虚影森林(冬之庙) <-> 多兰古雷格王城
  ['m20_21', 'm20_11'], // 多兰古雷格王城 <-> 阿玛纳祭坛 (镜之骑士升降机)
  ['m20_11', 'm20_24'], // 阿玛纳祭坛 <-> 不死灵庙 (歌唱恶魔水路)

  // 8. 安第尔与巨龙圣域 (安第尔之馆与卫龙圣域自身连通，通过后门吊桥衔接)
  ['m10_15', 'm10_27'], // 安第尔之馆 <-> 卫龙巢穴与龙祭坛
];

const ADJACENT = new Map<string, string[]>();
for (const [a, b] of LINKS) {
  ADJACENT.set(a, [...(ADJACENT.get(a) ?? []), b]);
  ADJACENT.set(b, [...(ADJACENT.get(b) ?? []), a]);
}

const BOUNDS = mapBounds as Record<string, { min: number[]; max: number[] }[]>;

function pointBoxDistance(point: readonly number[], min: readonly number[], max: readonly number[]): number {
  return Math.hypot(...point.map((value, axis) => Math.max(min[axis] - value, 0, value - max[axis])));
}

export function distanceToRegion(mapId: string, point: readonly number[]): number {
  const boxes = BOUNDS[mapId];
  if (!boxes) return Infinity;
  return Math.min(...boxes.map((box) => pointBoxDistance(point, box.min, box.max)));
}

/**
 * 获取与当前地图同域、互不冲突、可同时加载的大世界地图 ID 列表
 */
export function getCompatibleWorldMaps(activeMapId: string): string[] {
  // 传送不连通的独立异空间地图：单独自己加载一个地图！
  if (isWarpIsolatedMap(activeMapId)) {
    return [activeMapId];
  }

  // 安第尔与巨龙圣域：专属连通域 (m10_15 安第尔之馆 <-> m10_27 卫龙巢穴与龙祭坛)
  // 原版通过歧路遗迹国王门后走廊硬切加载。原版坐标系下安第尔之馆与虚影森林/法洛斯门径
  // 存在超过 740 万立方米的大面积物理坐标重叠（穿模严重），故安第尔之馆与巨龙圣域
  // 作为独立专属连通域加载，彻底消除重叠穿模！
  if (isAldiaSanctumMap(activeMapId)) {
    return ['m10_15', 'm10_27'];
  }

  // 多兰古雷格本体大陆主陆 (共 19 张大地图连通，不含安第尔与巨龙圣域)
  return [
    'm10_02', 'm10_04', 'm10_29', 'm10_10', 'm10_30', 'm10_31', 'm10_18', 'm10_16',
    'm10_23', 'm10_17', 'm10_19', 'm10_34', 'm10_25', 'm10_32', 'm10_33', 'm10_14',
    'm20_21', 'm20_11', 'm20_24'
  ];
}

/**
 * 获取与当前地图相邻且在感应半径内的地图集合，按距离由近到远排序
 */
export function nearbyRegions(
  mapId: string,
  point: readonly number[],
  radius = 500,
  count = 5
): string[] {
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

export function isRegionFar(mapId: string, point: readonly number[], unloadRadius = 850): boolean {
  return distanceToRegion(mapId, point) > unloadRadius;
}

export function linkedRegions(mapId: string): readonly string[] {
  return ADJACENT.get(mapId) ?? [];
}
