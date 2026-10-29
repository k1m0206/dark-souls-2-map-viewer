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

const list = [
  'm10_02', 'm10_04', 'm10_29', 'm10_10', 'm10_30', 'm10_31', 'm10_18', 'm10_16',
  'm10_23', 'm10_17', 'm10_19', 'm10_34', 'm10_25', 'm10_32', 'm10_33', 'm10_14',
  'm20_21', 'm20_11', 'm20_24'
];

console.log('Testing royal mainland 19 maps:');
for (let i = 0; i < list.length; i++) {
  for (let j = i + 1; j < list.length; j++) {
    const a = list[i];
    const b = list[j];
    const ba = getAABB(bounds[a]);
    const bb = getAABB(bounds[b]);
    const overlapX = Math.max(0, Math.min(ba.maxX, bb.maxX) - Math.max(ba.minX, bb.minX));
    const overlapY = Math.max(0, Math.min(ba.maxY, bb.maxY) - Math.max(ba.minY, bb.minY));
    const overlapZ = Math.max(0, Math.min(ba.maxZ, bb.maxZ) - Math.max(ba.minZ, bb.minZ));
    if (overlapX > 0 && overlapY > 0 && overlapZ > 0) {
      console.log(`  Adjacent seam: ${a} <-> ${b}`);
    }
  }
}
