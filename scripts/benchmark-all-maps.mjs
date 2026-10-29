import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const mapsDir = 'miniapp-ds2/public-lite/maps';
const files = fs.readdirSync(mapsDir).filter((f) => f.endsWith('.js'));

const t0 = Date.now();
for (let i = 0; i < files.length; i += 3) {
  const batch = files.slice(i, i + 3);
  for (const f of batch) {
    const content = fs.readFileSync(path.join(mapsDir, f), 'utf8');
    const quote1 = content.indexOf('",');
    const quote2 = content.lastIndexOf('")');
    if (quote1 === -1 || quote2 === -1) continue;
    const b64 = content.slice(quote1 + 3, quote2);
    const buf = Buffer.from(b64, 'base64');
    zlib.gunzipSync(buf);
  }
}
console.log('Batch decode time for all 27 maps:', Date.now() - t0, 'ms');
