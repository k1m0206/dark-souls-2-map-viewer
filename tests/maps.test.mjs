import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'fflate';

const __dirname = dirname(fileURLToPath(import.meta.url));
const mapsDir = resolve(__dirname, '../public-lite/maps');

test('Map catalog has exactly 24 Dark Souls 2 maps', async () => {
  const manifestRaw = await readFile(resolve(mapsDir, 'manifest.json'), 'utf8');
  const manifest = JSON.parse(manifestRaw);
  const spawnPoints = JSON.parse(await readFile(resolve(__dirname, '../src/spawn-points.json'), 'utf8'));
  assert.equal(manifest.length, 24, 'Should contain 24 maps');
  assert.equal(Object.keys(spawnPoints).length, 24, 'Should have one curated spawn for each map');

  const ids = new Set();
  for (const m of manifest) {
    assert.ok(m.id, 'Map must have an id');
    assert.ok(m.name, 'Map must have a name');
    assert.ok(m.enName, 'Map must have an English name');
    assert.equal(typeof m.isDlc, 'boolean', `Map ${m.name} must declare whether it is DLC`);
    assert.ok(m.triangles > 0, `Map ${m.name} must have triangles`);
    assert.ok(m.vertices > 0, `Map ${m.name} must have vertices`);
    assert.ok(m.chunks > 0, `Map ${m.name} must have chunks`);
    assert.ok(m.spawnWalk, `Map ${m.name} must have a walkable spawn point`);
    assert.ok(m.spawnFly, `Map ${m.name} must have a flight spawn point`);
    assert.deepEqual(m.spawnWalk, spawnPoints[m.id], `Map ${m.name} must use its curated walk spawn`);
    assert.equal(m.spawnFly[0], m.spawnWalk[0]);
    assert.equal(m.spawnFly[1], Number((m.spawnWalk[1] + 30).toFixed(2)));
    ids.add(m.id);
  }
  assert.equal(ids.size, 24, 'All 24 map IDs must be unique');
});

test('All 24 map JavaScript bundles exist on disk', async () => {
  const files = await readdir(mapsDir);
  const jsFiles = files.filter((f) => f.endsWith('.js'));
  assert.equal(jsFiles.length, 24, 'Should have 24 .js map files');
});

test('Decode and verify sample maps (Majula and Things Betwixt)', async () => {
  for (const mapId of ['m10_02', 'm10_04']) {
    const jsContent = await readFile(resolve(mapsDir, `${mapId}.js`), 'utf8');
    assert.ok(jsContent.startsWith('globalThis.__atlasReceive('), 'Should match atlas loader signature');

    // Extract base64 payload
    const match = jsContent.match(/__atlasReceive\([^,]+,\s*"([^"]+)"\)/);
    assert.ok(match, 'Must contain valid base64 payload');
    const b64 = match[1];

    const binaryString = atob(b64);
    const compressed = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      compressed[i] = binaryString.charCodeAt(i);
    }

    const decompressed = gunzipSync(compressed);
    const view = new DataView(decompressed.buffer, decompressed.byteOffset, decompressed.byteLength);
    const headerLen = view.getUint32(0, true);
    assert.ok(headerLen > 0 && headerLen < decompressed.byteLength, 'Header length must be valid');

    const headerBytes = decompressed.subarray(4, 4 + headerLen);
    const header = JSON.parse(new TextDecoder('utf-8').decode(headerBytes));

    assert.equal(header.id, mapId);
    assert.ok(header.chunks.length > 0);
    assert.ok(header.triangles > 0);
  }
});
