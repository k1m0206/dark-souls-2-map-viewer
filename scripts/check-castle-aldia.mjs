import fs from 'fs';
import zlib from 'zlib';

function loadChunks(mapId) {
  const content = fs.readFileSync(`miniapp-ds2/public-lite/maps/${mapId}.js`, 'utf8');
  const q1 = content.indexOf('",');
  const q2 = content.lastIndexOf('")');
  const b64 = content.slice(q1 + 3, q2);
  const decompressed = zlib.gunzipSync(Buffer.from(b64, 'base64'));
  const headerLen = decompressed.readUInt32LE(0);
  const header = JSON.parse(decompressed.subarray(4, 4 + headerLen).toString('utf8'));
  return header.chunks;
}

const chunks21 = loadChunks('m20_21');
const chunks15 = loadChunks('m10_15');

console.log('m20_21 chunks count:', chunks21.length);
console.log('m10_15 chunks count:', chunks15.length);

let overlapCount = 0;
for (const c1 of chunks21) {
  const min1 = c1.min;
  const max1 = [min1[0] + c1.scale[0] * 65535, min1[1] + c1.scale[1] * 65535, min1[2] + c1.scale[2] * 65535];
  for (const c2 of chunks15) {
    const min2 = c2.min;
    const max2 = [min2[0] + c2.scale[0] * 65535, min2[1] + c2.scale[1] * 65535, min2[2] + c2.scale[2] * 65535];
    if (
      min1[0] <= max2[0] && max1[0] >= min2[0] &&
      min1[1] <= max2[1] && max1[1] >= min2[1] &&
      min1[2] <= max2[2] && max1[2] >= min2[2]
    ) {
      overlapCount++;
    }
  }
}
console.log('Chunk bounding box collisions between m20_21 and m10_15:', overlapCount);
