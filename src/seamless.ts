import mapBounds from './map-bounds.json';

// 全量 27 区域完整拓扑链接：地理接壤、长廊隧道、航线飞越与传送秘道（含三大王冠 DLC）
export const LINKS: [string, string][] = [
  // 1. 初期启程
  ['m10_02', 'm10_04'], // 一线天森林 <-> 如蜜
  ['m10_04', 'm10_10'], // 如蜜 <-> 巨人陨落之森
  ['m10_04', 'm10_29'], // 如蜜 <-> 如蜜地底通道
  ['m10_04', 'm10_23'], // 如蜜 <-> 狩猎森林 (机关水渠石门)
  ['m10_04', 'm10_34'], // 如蜜 <-> 圣人墓地 (大坑中层)
  ['m10_04', 'm10_25'], // 如蜜 <-> 废渊 (大坑底部长梯)
  ['m10_04', 'm10_32'], // 如蜜 <-> 虚影森林 (解石化大门)

  // 2. 海德与密港
  ['m10_29', 'm10_31'], // 地底通道 <-> 青之圣堂
  ['m10_29', 'm10_30'], // 地底通道 <-> 海德巨火塔 (水闸直通海德长廊)
  ['m10_29', 'm10_34'], // 地底通道 <-> 圣人墓地
  ['m10_31', 'm10_30'], // 青之圣堂 <-> 海德巨火塔
  ['m10_30', 'm10_18'], // 海德巨火塔 <-> 密港 (龙骑兵螺旋梯)
  ['m10_31', 'm10_18'], // 青之圣堂 <-> 密港

  // 3. 遗忘牢笼与巨人回忆航线
  ['m10_18', 'm10_16'], // 密港 <-> 遗忘牢笼 (幽灵船直航)
  ['m10_10', 'm10_16'], // 巨人陨落之森 <-> 遗忘牢笼 (击败咒缚者鸟巢直飞)
  ['m10_10', 'm20_10'], // 巨人陨落之森 <-> 巨人回忆 (瓦玛尔/奥罗/杰森回忆树)

  // 4. 熔铁城路线
  ['m10_23', 'm10_17'], // 狩猎森林 <-> 流油谷
  ['m10_17', 'm10_19'], // 流油谷堆土塔 <-> 熔铁城 (升降机直上)

  // 5. 圣人墓地与废渊深处
  ['m10_34', 'm10_25'], // 圣人墓地 <-> 废渊 (木梁落底)
  ['m10_25', 'm40_03'], // 废渊黑溪谷 <-> 暗潜古穴 (黑溪谷隐藏洞穴)

  // 6. 虚影森林与辉石镇
  ['m10_32', 'm10_33'], // 虚影森林 <-> 法洛斯门径 (歧路遗迹右路)
  ['m10_33', 'm10_14'], // 法洛斯门径 <-> 辉石镇盖多勒
  ['m10_14', 'm20_26'], // 辉石镇盖多勒 <-> 古龙回忆 (公爵私室巨龙残晶)

  // 7. 多兰古雷格与深处
  ['m10_32', 'm20_21'], // 虚影森林(冬之庙) <-> 多兰古雷格王城
  ['m20_21', 'm20_11'], // 多兰古雷格王城 <-> 阿玛纳祭坛 (镜之骑士升降机)
  ['m20_21', 'm40_03'], // 多兰古雷格王城 <-> 暗潜古穴 (石像地下暗门)
  ['m20_21', 'm10_15'], // 多兰古雷格王城 <-> 安第尔之馆
  ['m20_11', 'm20_24'], // 阿玛纳祭坛 <-> 不死灵庙 (歌唱恶魔水路)
  ['m20_24', 'm10_15'], // 不死灵庙 <-> 安第尔之馆

  // 8. 安第尔与巨龙圣域
  ['m10_32', 'm10_15'], // 虚影森林 <-> 安第尔之馆 (歧路遗迹左路国王门大道)
  ['m10_15', 'm10_27'], // 安第尔之馆 <-> 卫龙巢穴与龙祭坛 (后门吊桥)
  ['m10_32', 'm40_03'], // 虚影森林 <-> 暗潜古穴 (陷阱地穴暗门)

  // 9. 失落王冠三大 DLC (始源篝火蛇之祭坛传送通道)
  ['m10_25', 'm50_35'], // 废渊黑溪谷 (腐败物后蛇之祭坛) <-> 圣壁之都萨尔瓦
  ['m10_19', 'm50_36'], // 熔铁城 (铁之古王后蛇之祭坛) <-> 黑雾之塔
  ['m10_32', 'm50_37'], // 虚影森林 (冬之庙门外蛇之祭坛) <-> 埃斯・洛耶斯
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
 * 获取与当前地图相邻且在感应半径内的地图集合，按距离由近到远排序
 * @param mapId 当前主地图 ID
 * @param point 玩家三维坐标
 * @param radius 预加载感应半径 (默认 500，适应黑魂大尺度空间)
 * @param count 最多同时加载的相邻区域数 (默认 5)
 */
export function nearbyRegions(
  mapId: string,
  point: readonly number[],
  radius = 500,
  count = 5
): string[] {
  const linked = ADJACENT.get(mapId) ?? [];
  return linked
    .map((id) => ({ id, distance: distanceToRegion(id, point) }))
    .filter((entry) => entry.distance <= radius)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count)
    .map((entry) => entry.id);
}

/**
 * 判断指定区域是否已经过远，可安全卸载以节约显存 (防抖动)
 * @param mapId 地图 ID
 * @param point 玩家三维坐标
 * @param unloadRadius 安全卸载半径 (默认 850，高于加载半径 500)
 */
export function isRegionFar(mapId: string, point: readonly number[], unloadRadius = 850): boolean {
  return distanceToRegion(mapId, point) > unloadRadius;
}

export function linkedRegions(mapId: string): readonly string[] {
  return ADJACENT.get(mapId) ?? [];
}
