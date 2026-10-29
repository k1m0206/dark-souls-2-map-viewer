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

const overland = [
  'm10_02', 'm10_04', 'm10_29', 'm10_10', 'm10_30', 'm10_31', 'm10_18', 'm10_16',
  'm10_23', 'm10_17', 'm10_19', 'm10_34', 'm10_25', 'm10_32', 'm10_33', 'm10_14',
  'm20_21', 'm20_11', 'm20_24', 'm10_15', 'm10_27'
];

console.log('Testing overland maps overlap volume...');
for (let i = 0; i < overland.length; i++) {
  for (let j = i + 1; j < overland.length; j++) {
    const a = overland[i];
    const b = overland[j];
    const ba = getAABB(bounds[a]);
    const bb = getAABB(bounds[b]);

    const overlapX = Math.max(0, Math.min(ba.maxX, bb.maxX) - Math.max(ba.minX, bb.minX));
    const overlapY = Math.max(0, Math.min(ba.maxY, bb.maxY) - Math.max(ba.minY, bb.minY));
    const overlapZ = Math.max(0, Math.min(ba.maxZ, bb.maxZ) - Math.max(ba.minZ, bb.minZ));
    const volume = overlapX * overlapY * overlapZ;

    if (volume > 0) {
      console.log(
        `${a} <-> ${b}: Overlap Size: [${overlapX.toFixed(0)}, ${overlapY.toFixed(0)}, ${overlapZ.toFixed(0)}]`
      );
    }
  }
}
