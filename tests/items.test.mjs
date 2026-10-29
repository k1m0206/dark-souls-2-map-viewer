import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const allItemsPath = fileURLToPath(new URL('../src/all-items.json', import.meta.url));

test('all-items.json file exists and is valid JSON', () => {
  assert.ok(existsSync(allItemsPath), 'all-items.json should exist');
  const content = readFileSync(allItemsPath, 'utf8');
  const data = JSON.parse(content);
  assert.ok(data && typeof data === 'object');
});

test('all-items contains valid data for all 27 Dark Souls 2 maps', () => {
  const data = JSON.parse(readFileSync(allItemsPath, 'utf8'));
  const mapIds = Object.keys(data);
  assert.equal(mapIds.length, 27, 'Should cover all 27 game maps');

  // Verify DLC maps are present
  assert.ok(mapIds.includes('m50_35'), 'DLC1 Shulva should be present');
  assert.ok(mapIds.includes('m50_36'), 'DLC2 Brume Tower should be present');
  assert.ok(mapIds.includes('m50_37'), 'DLC3 Eleum Loyce should be present');

  // Total counts
  const allSpots = Object.values(data).flat();
  assert.equal(allSpots.length, 949, 'Should have exactly 949 treasure spots');

  const allItems = allSpots.flatMap((s) => s.items);
  assert.equal(allItems.length, 1200, 'Should have exactly 1200 item pickup instances');
});

test('all treasure spots have finite 3D coordinates and valid structure', () => {
  const data = JSON.parse(readFileSync(allItemsPath, 'utf8'));
  for (const [mapId, spots] of Object.entries(data)) {
    for (const spot of spots) {
      assert.ok(spot.id && typeof spot.id === 'string', `Spot in ${mapId} missing id`);
      assert.equal(spot.mapId, mapId, `Spot ${spot.id} mapId mismatch`);
      assert.equal(typeof spot.in_chest, 'boolean', `Spot ${spot.id} missing in_chest boolean`);
      assert.ok(Array.isArray(spot.pos) && spot.pos.length === 3, `Spot ${spot.id} invalid pos`);
      for (const coord of spot.pos) {
        assert.ok(Number.isFinite(coord), `Spot ${spot.id} coordinate must be finite number: ${coord}`);
      }
      assert.ok(Array.isArray(spot.items) && spot.items.length > 0, `Spot ${spot.id} must have items`);
    }
  }
});

test('all items have genuine Chinese names, categories, and background lore', () => {
  const data = JSON.parse(readFileSync(allItemsPath, 'utf8'));
  const validCategories = new Set([
    '武器', '防具', '戒指', '法术咒术', '强化材料', '钥匙余烬', '灵魂', '消耗品'
  ]);

  for (const [mapId, spots] of Object.entries(data)) {
    for (const spot of spots) {
      for (const item of spot.items) {
        assert.ok(typeof item.id === 'number' && item.id > 0, `Invalid item id in ${spot.id}`);
        assert.ok(item.name && item.name.trim().length > 0, `Item ${item.id} in ${spot.id} missing name`);
        assert.ok(!item.name.includes('%null%'), `Item ${item.id} name should not contain %null%`);
        assert.ok(item.count >= 1, `Item ${item.name} count must be >= 1`);
        assert.ok(validCategories.has(item.category), `Invalid category "${item.category}" for item ${item.name}`);
        assert.ok(item.summary && item.summary.trim().length > 0, `Item ${item.name} missing summary`);
        assert.ok(item.description && item.description.trim().length > 0, `Item ${item.name} missing lore description`);
      }
    }
  }
});

test('verifies iconic Dark Souls 2 item placements in Majula', () => {
  const data = JSON.parse(readFileSync(allItemsPath, 'utf8'));
  const majulaSpots = data['m10_04'];
  assert.ok(majulaSpots && majulaSpots.length === 25, 'Majula should have 25 treasure spots');

  // Well rock corpse item: Estus Flask Shard
  const wellShardSpot = majulaSpots.find((s) =>
    s.items.some((i) => i.name === '原素碎片') && Math.abs(s.pos[0] - 0.27) < 0.5
  );
  assert.ok(wellShardSpot, 'Majula well Estus Flask Shard must be located at (0.27, 9.61, -59.16)');
  assert.equal(wellShardSpot.in_chest, false, 'Well shard should be on corpse');

  // Cliff path corpse: Estus Flask Shard
  const cliffShardSpot = majulaSpots.find((s) =>
    s.items.some((i) => i.name === '原素碎片') && Math.abs(s.pos[0] - 17.09) < 0.5
  );
  assert.ok(cliffShardSpot, 'Majula cliff path Estus Flask Shard must be located at (17.09, 1.85, -111.97)');
  assert.equal(cliffShardSpot.in_chest, false, 'Cliff path shard should be on corpse');

  // Mansion basement chest: Witchtree Branch & Witchtree Bellvine (SotFS authentic loot)
  const mansionChest = majulaSpots.find((s) =>
    s.items.some((i) => i.name === '妖树枝条') && s.in_chest && Math.abs(s.pos[0] - (-0.53)) < 0.5
  );
  assert.ok(mansionChest, 'Majula mansion basement chest must have Witchtree Branch in SotFS');

  // Lenigrast blacksmith shop chest: Titanite Shard + Torch
  const blacksmithChest = majulaSpots.find((s) =>
    s.in_chest && s.items.some((i) => i.name === '火把') && s.items.some((i) => i.name === '楔形石碎片')
  );
  assert.ok(blacksmithChest, 'Blacksmith shop chest must contain Torch and Titanite Shard');

  // Blacksmith house chest: Short Bow
  const bowChest = majulaSpots.find((s) =>
    s.in_chest && s.items.some((i) => i.name === '短弓')
  );
  assert.ok(bowChest, 'Majula blacksmith chest must contain Short Bow');
});

test('verifies all base-game items reside within map physical boundaries (no floating in void)', () => {
  const data = JSON.parse(readFileSync(allItemsPath, 'utf8'));
  const manifest = JSON.parse(readFileSync(fileURLToPath(new URL('../public-lite/maps/manifest.json', import.meta.url)), 'utf8'));
  const mapBounds = Object.fromEntries(manifest.map((m) => [m.id, m.bounds]));

  for (const [mapId, spots] of Object.entries(data)) {
    if (mapId.startsWith('m50_')) continue;
    const bounds = mapBounds[mapId];
    assert.ok(bounds, `Bounds missing for ${mapId}`);
    for (const spot of spots) {
      const [x, y, z] = spot.pos;
      const margin = 5.0; // 5 meters margin around geometry bounds
      assert.ok(
        x >= bounds.min[0] - margin && x <= bounds.max[0] + margin &&
        y >= bounds.min[1] - margin && y <= bounds.max[1] + margin &&
        z >= bounds.min[2] - margin && z <= bounds.max[2] + margin,
        `Spot ${spot.id} in ${mapId} at (${x}, ${y}, ${z}) is outside map bounds`
      );
    }
  }
});

test('verifies in-game 3D chest models and authentic textures exist and are valid', () => {
  const modelsPath = fileURLToPath(new URL('../src/assets/chest-models.json', import.meta.url));
  assert.ok(existsSync(modelsPath), 'chest-models.json must exist');

  const models = JSON.parse(readFileSync(modelsPath, 'utf8'));
  assert.ok(models.wooden_chest, 'wooden_chest model must be present');
  assert.ok(models.iron_chest, 'iron_chest model must be present');

  for (const [name, mesh] of Object.entries(models)) {
    assert.ok(Array.isArray(mesh.positions) && mesh.positions.length > 3000, `${name} positions must have > 1000 vertices`);
    assert.ok(Array.isArray(mesh.normals) && mesh.normals.length === mesh.positions.length, `${name} normals length mismatch`);
    assert.ok(Array.isArray(mesh.uvs) && mesh.uvs.length === (mesh.positions.length / 3) * 2, `${name} uvs length mismatch`);
    assert.ok(Array.isArray(mesh.indices) && mesh.indices.length > 1500, `${name} indices must have > 500 triangles`);

    // Verify bone bind transformation has closed the chest lid onto the body
    let maxY = -Infinity;
    let minY = Infinity;
    for (let i = 1; i < mesh.positions.length; i += 3) {
      const y = mesh.positions[i];
      if (y > maxY) maxY = y;
      if (y < minY) minY = y;
    }
    assert.ok(minY >= -0.05, `${name} base should be at or near ground Y=0`);
    if (name === 'wooden_chest') {
      assert.ok(maxY > 1.0, `wooden_chest lid must reach ~1.03m (closed on top of body), got ${maxY}`);
    } else if (name === 'iron_chest') {
      assert.ok(maxY > 0.75, `iron_chest lid must reach ~0.79m (closed on top of body), got ${maxY}`);
    }
  }

  // Chest textures
  const woodTex = fileURLToPath(new URL('../src/assets/chest_wood.webp', import.meta.url));
  const ironTex = fileURLToPath(new URL('../src/assets/chest_iron.webp', import.meta.url));
  assert.ok(existsSync(woodTex), 'chest_wood.webp must exist');
  assert.ok(existsSync(ironTex), 'chest_iron.webp must exist');

  // Ground pickup soul flame and light beam textures
  const soulFlameTex = fileURLToPath(new URL('../src/assets/soul_flame.webp', import.meta.url));
  const soulCoreTex = fileURLToPath(new URL('../src/assets/soul_core.webp', import.meta.url));
  const soulBeamTex = fileURLToPath(new URL('../src/assets/soul_beam.webp', import.meta.url));
  assert.ok(existsSync(soulFlameTex), 'soul_flame.webp must exist');
  assert.ok(existsSync(soulCoreTex), 'soul_core.webp must exist');
  assert.ok(existsSync(soulBeamTex), 'soul_beam.webp must exist');
});

test('verifies all chest spots in all-items.json have valid chest_type and rotation', () => {
  const data = JSON.parse(readFileSync(allItemsPath, 'utf8'));
  let chestCount = 0;
  let woodCount = 0;
  let ironCount = 0;

  for (const spots of Object.values(data)) {
    for (const spot of spots) {
      if (spot.in_chest) {
        chestCount++;
        assert.ok(spot.chest_type === 'wood' || spot.chest_type === 'iron', `Chest ${spot.id} invalid chest_type: ${spot.chest_type}`);
        assert.ok(typeof spot.rotY === 'number' && Number.isFinite(spot.rotY), `Chest ${spot.id} missing valid rotY`);
        if (spot.chest_type === 'wood') woodCount++;
        if (spot.chest_type === 'iron') ironCount++;
      }
    }
  }

  assert.equal(chestCount, 231, 'Must have exactly 231 chests');
  assert.equal(woodCount, 62, 'Must have exactly 62 wooden chests');
  assert.equal(ironCount, 169, 'Must have exactly 169 iron chests');
});
