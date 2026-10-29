import fs from 'fs';

const bounds = JSON.parse(fs.readFileSync('miniapp-ds2/src/map-bounds.json', 'utf8'));

function getAABB(boxes) {
  return {
    minX: Math.min(...boxes.map((b) => b.min[0])),
    maxX: Math.max(...boxes.map((b) => b.max[0])),
    minY: Math.min(...boxes.map((b) => b.min[1])),
    maxY: Math.max(...boxes.map((b) => b.max[1])),
    minZ: Math.min(...boxes.map((b) => b.min[2])),
    maxZ: Math.max(...boxes.map((b) => b.max[2]))
  };
}

const mapAABBs = {};
for (const [id, boxes] of Object.entries(bounds)) {
  mapAABBs[id] = getAABB(boxes);
}

function intersects(a, b) {
  return (
    a.minX <= b.maxX &&
    a.maxX >= b.minX &&
    a.minY <= b.maxY &&
    a.maxY >= b.minY &&
    a.minZ <= b.maxZ &&
    a.maxZ >= b.minZ
  );
}

console.log('--- MAP BOUNDING BOXES ---');
for (const [id, b] of Object.entries(mapAABBs)) {
  console.log(
    id.padEnd(8),
    `X:[${b.minX.toFixed(0)}, ${b.maxX.toFixed(0)}]`,
    `Y:[${b.minY.toFixed(0)}, ${b.maxY.toFixed(0)}]`,
    `Z:[${b.minZ.toFixed(0)}, ${b.maxZ.toFixed(0)}]`
  );
}

const dlcIds = ['m50_35', 'm50_36', 'm50_37'];
const memoryIds = ['m20_10', 'm20_26', 'm40_03'];
const overlandIds = Object.keys(mapAABBs).filter(
  (id) => !dlcIds.includes(id) && !memoryIds.includes(id)
);

console.log('\n--- OVERLAND-ONLY INTERSECTIONS ---');
for (let i = 0; i < overlandIds.length; i++) {
  for (let j = i + 1; j < overlandIds.length; j++) {
    const a = overlandIds[i];
    const b = overlandIds[j];
    if (intersects(mapAABBs[a], mapAABBs[b])) {
      console.log(`  Overland adjacent seam: ${a} <-> ${b}`);
    }
  }
}

console.log('\n--- DLC INTERSECTIONS WITH OVERLAND ---');
for (const dlc of dlcIds) {
  const overlapping = overlandIds.filter((o) => intersects(mapAABBs[dlc], mapAABBs[o]));
  console.log(`  DLC ${dlc} overlaps with ${overlapping.length} overland maps:`, overlapping);
}

console.log('\n--- MEMORIES / CHASM INTERSECTIONS WITH OVERLAND ---');
for (const mem of memoryIds) {
  const overlapping = overlandIds.filter((o) => intersects(mapAABBs[mem], mapAABBs[o]));
  console.log(`  Memory ${mem} overlaps with ${overlapping.length} overland maps:`, overlapping);
}
