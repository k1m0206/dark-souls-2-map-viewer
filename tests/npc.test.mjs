import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const merchantShopsPath = fileURLToPath(new URL('../src/merchant-shops.json', import.meta.url));
const merchantDetailsPath = fileURLToPath(new URL('../src/merchant-details.json', import.meta.url));
const npcModelsPath = fileURLToPath(new URL('../src/npc-models.json', import.meta.url));
const npcTexturesPath = fileURLToPath(new URL('../src/npc-textures.ts', import.meta.url));
const npcDataPath = fileURLToPath(new URL('../src/npc-data.ts', import.meta.url));

test('merchant-shops.json exists, is valid JSON, and contains key NPCs', () => {
  assert.ok(existsSync(merchantShopsPath), 'merchant-shops.json should exist');
  const shops = JSON.parse(readFileSync(merchantShopsPath, 'utf8'));
  assert.ok(shops && typeof shops === 'object');

  // Verify key NPCs exist
  const expectedKeys = [
    'emerald_herald',
    'melentia',
    'lenigrast',
    'maughlin',
    'shalquoir',
    'licia',
    'straid',
    'ornifex',
    'vengarl',
    'wellager',
    'carhillion',
    'felkin',
    'chloanne',
    'gavlan',
    'mcduff',
    'gilligan',
    'agdayne',
    'grandahl',
    'rat_king',
    'rosabeth',
    'navlaan',
    'magerold'
  ];

  for (const key of expectedKeys) {
    assert.ok(key in shops, `Expected merchant ${key} to be in merchant-shops.json`);
    assert.ok(Array.isArray(shops[key]), `Merchant ${key} inventory should be an array`);
  }

  // Count total shop items
  const allShopItems = Object.values(shops).flat();
  assert.ok(allShopItems.length >= 350, `Expected at least 350 shop items across all merchants, got ${allShopItems.length}`);

  for (const item of allShopItems) {
    assert.ok(Array.isArray(item) && item.length === 4, `Shop entry must be [name, category, price, quantity]`);
    const [name, category, price, qty] = item;
    assert.equal(typeof name, 'string', `Item name must be string: ${name}`);
    assert.equal(typeof category, 'string', `Item category must be string: ${category}`);
    assert.ok(Number.isFinite(price) && price >= 0, `Price must be non-negative finite number: ${price}`);
    assert.ok(qty === null || (Number.isFinite(qty) && qty >= 0), `Quantity must be null or non-negative number: ${qty}`);
  }
});

test('merchant-details.json covers all shop item entries with valid lore description', () => {
  assert.ok(existsSync(merchantDetailsPath), 'merchant-details.json should exist');
  const details = JSON.parse(readFileSync(merchantDetailsPath, 'utf8'));
  assert.ok(details && typeof details === 'object');

  const shops = JSON.parse(readFileSync(merchantShopsPath, 'utf8'));
  const allShopItems = Object.values(shops).flat();

  for (const [name, category] of allShopItems) {
    const detailKey = `${category}:${name}`;
    assert.ok(detailKey in details, `Shop item "${detailKey}" should have detail entry in merchant-details.json`);
    const detail = details[detailKey];
    assert.equal(typeof detail.name, 'string');
    assert.equal(typeof detail.group, 'string');
    assert.equal(typeof detail.description, 'string');
    assert.ok(detail.description.length > 0, `Description for "${detailKey}" should not be empty`);
  }
});

test('npc-data.ts defines valid NPC records with world positions and dialogues', () => {
  assert.ok(existsSync(npcDataPath), 'npc-data.ts should exist');
  const content = readFileSync(npcDataPath, 'utf8');

  // Verify key NPC identifiers are defined in the file
  const keyIds = [
    'emerald_herald',
    'melentia',
    'lenigrast',
    'maughlin',
    'shalquoir',
    'licia',
    'straid',
    'ornifex',
    'vengarl',
    'wellager'
  ];

  for (const id of keyIds) {
    assert.ok(content.includes(`"${id}"`) || content.includes(`'${id}'`), `npc-data.ts should define NPC id ${id}`);
  }

  // Emerald Herald (夏娜洛特) must be placed in Majula (m10_04)
  assert.ok(content.includes('m10_04'), 'Emerald Herald should be placed in Majula (m10_04)');
  assert.ok(content.includes('绿衣朝圣者 夏娜洛特'), 'Should have Chinese name for Emerald Herald');
});

test('npc-models.json exists, contains 3D character meshes with valid geometry', () => {
  assert.ok(existsSync(npcModelsPath), 'npc-models.json should exist');
  const models = JSON.parse(readFileSync(npcModelsPath, 'utf8'));
  assert.ok(models && typeof models === 'object');

  const expectedModelKeys = [
    'emerald_herald',
    'melentia',
    'lenigrast',
    'shalquoir',
    'licia',
    'maughlin',
    'straid',
    'ornifex',
    'vengarl',
    'wellager'
  ];

  for (const modelKey of expectedModelKeys) {
    assert.ok(modelKey in models, `Expected model key ${modelKey} in npc-models.json`);
    const model = models[modelKey];
    assert.ok(Array.isArray(model.submeshes) && model.submeshes.length > 0, `${modelKey} must have submeshes`);

    for (const sub of model.submeshes) {
      assert.ok(Array.isArray(sub.positions), `${modelKey} submesh must have positions array`);
      assert.ok(Array.isArray(sub.normals), `${modelKey} submesh must have normals array`);
      assert.ok(Array.isArray(sub.uvs), `${modelKey} submesh must have uvs array`);
      assert.ok(Array.isArray(sub.indices), `${modelKey} submesh must have indices array`);

      const vertexCount = sub.positions.length / 3;
      assert.equal(sub.normals.length / 3, vertexCount, `${modelKey} normals count must match positions`);
      assert.equal(sub.uvs.length / 2, vertexCount, `${modelKey} UVs count must match positions`);
      assert.ok(sub.indices.length >= 3, `${modelKey} must have at least 1 triangle`);

      for (const idx of sub.indices) {
        assert.ok(idx >= 0 && idx < vertexCount, `Index ${idx} out of vertex bounds 0..${vertexCount - 1}`);
      }
    }
  }
});

test('npc-textures.ts maps model diffuse textures and corresponding WebP files exist', () => {
  assert.ok(existsSync(npcTexturesPath), 'npc-textures.ts should exist');
  const content = readFileSync(npcTexturesPath, 'utf8');

  // Extract all imported/mapped texture asset filenames
  const matches = [...content.matchAll(/import\s+(\w+)\s+from\s+'\.\/assets\/npc\/([^']+)';/g)];
  assert.ok(matches.length >= 10, `Expected at least 10 imported NPC textures, found ${matches.length}`);

  for (const match of matches) {
    const filename = match[2];
    const textureFilePath = fileURLToPath(new URL(`../src/assets/npc/${filename}`, import.meta.url));
    assert.ok(existsSync(textureFilePath), `Texture file ${filename} must exist on disk`);
  }
});
