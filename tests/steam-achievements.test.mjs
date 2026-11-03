import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const cache = new Map();

function load(relative) {
  const filename = resolve(root, relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const module = { exports: {} };
  cache.set(filename, module);
  const code = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  new Function('exports', 'require', 'module', code)(module.exports, specifier => {
    assert.ok(specifier.startsWith('.'), `Unexpected external dependency: ${specifier}`);
    return load(resolve(dirname(filename), `${specifier}.ts`));
  }, module);
  return module.exports;
}

const { STEAM_ACHIEVEMENTS, MISSABLE_ACHIEVEMENTS } = load('src/progression/data/achievementsData.ts');
const { MAP_NODES } = load('src/progression/data/soulsData.ts');

test('Steam Achievements data file exists on disk', () => {
  const filePath = resolve(root, 'src/progression/data/achievementsData.ts');
  assert.ok(existsSync(filePath), 'achievementsData.ts must exist');
});

test('Steam Achievements has exactly 38 official achievements and valid properties', () => {
  assert.equal(STEAM_ACHIEVEMENTS.length, 38, `Expected exactly 38 achievements, found ${STEAM_ACHIEVEMENTS.length}`);

  const uniqueIds = new Set(STEAM_ACHIEVEMENTS.map(a => a.id));
  assert.equal(uniqueIds.size, 38, 'All 38 achievement IDs must be unique');

  for (const ach of STEAM_ACHIEVEMENTS) {
    assert.ok(ach.id && ach.id.length > 0, 'Achievement must have an ID');
    assert.ok(ach.name && ach.name.length > 0, `Achievement ${ach.id} must have a Chinese name`);
    assert.ok(ach.nameEn && ach.nameEn.length > 0, `Achievement ${ach.id} must have an English name`);
    assert.ok(ach.description && ach.description.length > 0, `Achievement ${ach.id} must have a description`);
    assert.ok(ach.descriptionEn && ach.descriptionEn.length > 0, `Achievement ${ach.id} must have an English description`);
    assert.ok(ach.unlockGuide && ach.unlockGuide.length > 0, `Achievement ${ach.id} must have unlockGuide`);
    assert.ok(ach.category, `Achievement ${ach.id} must have a category`);
    assert.ok(Array.isArray(ach.relatedMapIds), `Achievement ${ach.id} must have relatedMapIds array`);
  }

  // Verify key achievements exist
  const expectedKeyAchievements = [
    'the_dark_soul',
    'self_recollection',
    'this_is_dark_souls',
    'last_giant',
    'sinners_bonfire',
    'iron_keep_bonfire',
    'brightstone_bonfire',
    'gulch_bonfire',
    'looking_glass_knight',
    'kings_ring',
    'ancient_dragon',
    'vendrick',
    'the_heir',
    'lucatiel',
    'moonlight_greatsword',
    'gathering_of_exiles',
    'curious_map',
    'holder_of_the_fort',
    'reflections_disembodiment',
    'smith_for_life',
    'garrulous_miser',
    'change_of_clothes',
    'supreme_weapon',
    'master_of_sorceries',
    'master_of_miracles',
    'master_of_pyromancies',
    'master_of_hexes',
    'gesture_maestro',
    'brilliant_covenant',
    'protector_covenant',
    'sanguinary_covenant',
    'clangorous_covenant',
    'gnawing_covenant',
    'covenant_of_ancients',
    'covenant_of_the_fittest',
    'abysmal_covenant',
    'covenant_of_the_meek',
    'selfless_giver'
  ];

  for (const expectedId of expectedKeyAchievements) {
    assert.ok(uniqueIds.has(expectedId), `Achievement ID ${expectedId} should be present`);
  }
});

test('All missable achievements have decision warnings and valid map bindings in MAP_NODES', () => {
  const mapIds = new Set(MAP_NODES.map(node => node.id));

  // Verify all relatedMapIds are real nodes
  for (const ach of STEAM_ACHIEVEMENTS) {
    for (const mapId of ach.relatedMapIds) {
      assert.ok(mapIds.has(mapId), `Related map ID "${mapId}" for achievement "${ach.id}" must exist in MAP_NODES`);
    }
  }

  // Check missable warning texts
  assert.ok(MISSABLE_ACHIEVEMENTS.length >= 6, 'Must have at least 6 missable achievements');
  for (const missable of MISSABLE_ACHIEVEMENTS) {
    assert.ok(missable.missableWarning, `Missable achievement ${missable.id} must have a missableWarning`);
  }
});

test('All 38 official Steam achievement image files and locked.jpg exist in public-lite', () => {
  const assetsDir = resolve(root, 'public-lite/achievements');
  assert.ok(existsSync(assetsDir), 'public-lite/achievements folder must exist');

  assert.ok(existsSync(resolve(assetsDir, 'locked.jpg')), 'locked.jpg placeholder must exist');

  for (const ach of STEAM_ACHIEVEMENTS) {
    const iconFile = resolve(assetsDir, `${ach.id}.jpg`);
    assert.ok(existsSync(iconFile), `Achievement icon file ${ach.id}.jpg must exist on disk`);
  }
});

test('getAchievementsForMap returns accurate mappings for key game areas', () => {
  const { getAchievementsForMap } = load('src/progression/data/achievementsData.ts');

  const majulaAchs = getAchievementsForMap('majula');
  assert.ok(majulaAchs.length >= 3, 'Majula should have multiple achievements');

  const aldiaAchs = getAchievementsForMap('aldias_keep');
  const lucatiel = aldiaAchs.find(a => a.id === 'lucatiel');
  assert.ok(lucatiel, 'Aldias Keep must map to Lucatiel achievement');

  const cryptAchs = getAchievementsForMap('undead_crypt');
  const vendrick = cryptAchs.find(a => a.id === 'vendrick');
  assert.ok(vendrick, 'Undead Crypt must map to Vendrick achievement');
});

test('UserProgress normalization safely handles unlockedAchievements', () => {
  const { getInitialProgress, normalizeProgress } = load('src/progression/utils/progressionLogic.ts');

  const initial = getInitialProgress();
  assert.ok(Array.isArray(initial.unlockedAchievements), 'initial progress must have unlockedAchievements array');
  assert.equal(initial.unlockedAchievements.length, 0);

  // Normalization with undefined
  const normalizedEmpty = normalizeProgress({});
  assert.ok(Array.isArray(normalizedEmpty.unlockedAchievements), 'normalized progress must have array');
  assert.equal(normalizedEmpty.unlockedAchievements.length, 0);

  // Normalization with existing array
  const normalizedWithValues = normalizeProgress({
    unlockedAchievements: ['the_dark_soul', 'last_giant'],
  });
  assert.deepEqual(normalizedWithValues.unlockedAchievements, ['the_dark_soul', 'last_giant']);
});
