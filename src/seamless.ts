import mapBounds from './map-bounds.json';

// Only direct overland / tunnel connections. Memories and the chasm need a warp in game.
const LINKS: [string, string][] = [
  ['m10_02', 'm10_04'], ['m10_04', 'm10_10'], ['m10_04', 'm10_29'],
  ['m10_04', 'm10_23'], ['m10_04', 'm10_34'], ['m10_04', 'm10_32'],
  ['m10_29', 'm10_31'], ['m10_29', 'm10_34'],
  ['m10_31', 'm10_30'], ['m10_30', 'm10_18'], ['m10_31', 'm10_18'],
  ['m10_18', 'm10_16'], ['m10_23', 'm10_17'], ['m10_17', 'm10_19'],
  ['m10_34', 'm10_25'], ['m10_32', 'm10_33'], ['m10_33', 'm10_14'],
  ['m10_32', 'm20_21'], ['m20_21', 'm20_11'], ['m20_11', 'm20_24'],
  ['m20_21', 'm10_15'], ['m20_24', 'm10_15'], ['m10_15', 'm10_27'],
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

export function nearbyRegions(mapId: string, point: readonly number[], radius = 160, count = 2): string[] {
  return (ADJACENT.get(mapId) ?? [])
    .map((id) => ({ id, distance: distanceToRegion(id, point) }))
    .filter((entry) => entry.distance <= radius)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count)
    .map((entry) => entry.id);
}

export function linkedRegions(mapId: string): readonly string[] {
  return ADJACENT.get(mapId) ?? [];
}
