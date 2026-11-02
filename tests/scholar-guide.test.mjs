import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const cache = new Map();
// Execute the real TypeScript data and pure logic without a browser or a second data fixture.
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
const { MAP_NODES, NPC_QUESTLINES } = load('src/progression/data/soulsData.ts');
const { calculateProgressStats, evaluateEndingStatus, getInitialProgress, normalizeProgress, filterMapNodes } = load('src/progression/utils/progressionLogic.ts');

test('Scholar collection checklist represents 12 distinct shards and 5 dusts', () => {
  const items = MAP_NODES.flatMap(n => n.keyItems);
  const shards = items.filter(i => i.type === 'estus_shard');
  const dusts = items.filter(i => i.type === 'sublime_bone_dust');
  assert.equal(shards.length, 12);
  assert.equal(dusts.length, 5);
  assert.equal(new Set(items.map(i => i.id)).size, items.length);
  const full = { ...getInitialProgress(), obtainedItems: items.map(i => i.id) };
  const stats = calculateProgressStats(MAP_NODES, full);
  assert.equal(stats.estusShardsFound, stats.totalEstusShards);
  assert.equal(stats.sublimeBoneDustsFound, stats.totalBoneDusts);
  assert.deepEqual(MAP_NODES.filter(n => n.keyItems.some(i => i.type === 'sublime_bone_dust')).map(n => n.id).sort(),
    ['heides_tower', 'huntsmans_copse', 'shaded_woods', 'drangleic_castle', 'grave_of_saints'].sort());
});

test('All map links and quest steps resolve, with no duplicate checklist or boss IDs', () => {
  const maps = new Set(MAP_NODES.map(n => n.id));
  const bosses = MAP_NODES.flatMap(n => n.bosses.map(b => b.id));
  const tasks = MAP_NODES.flatMap(n => n.checklists.map(t => t.id));
  assert.equal(bosses.length, 41);
  assert.equal(new Set(bosses).size, bosses.length);
  assert.equal(new Set(tasks).size, tasks.length);
  for (const n of MAP_NODES) for (const edge of n.connectionsTo) assert.ok(maps.has(edge.targetId), edge.targetId);
  for (const q of NPC_QUESTLINES) for (const s of q.steps) assert.ok(maps.has(s.mapId), `${q.id}: ${s.mapId}`);
  const lucatiel = filterMapNodes(MAP_NODES, { routeFilter: 'all', npcFilter: 'lucatiel', searchQuery: '' });
  assert.ok(lucatiel.some(n => n.id === 'earthen_peak'));
  assert.ok(lucatiel.some(n => n.id === 'iron_keep'));
  assert.ok(NPC_QUESTLINES.find(q => q.id === 'benhart').steps.some(s => s.mapId === 'forest_of_fallen_giants'));
});

test('Legacy Vendrick progress merges and retired or duplicated records do not inflate counters', () => {
  const saved = normalizeProgress({
    defeatedBosses: ['vendrick_fight', 'vendrick', 'executioners_chariot', 'executioners_chariot', 'mad_warrior'],
    obtainedItems: ['maj_bone_dust', 'lb_bone_dust', 'ik_bone_dust', 'ep_estus', 'maj_estus_1', 'maj_estus_1'],
    completedChecklists: ['tb_c1', 'tb_c1', 'retired_task'], completedMaps: ['majula', 'majula'],
  });
  assert.deepEqual(saved.defeatedBosses, ['vendrick', 'executioners_chariot']);
  assert.deepEqual(saved.obtainedItems, ['maj_estus_1']);
  const stats = calculateProgressStats(MAP_NODES, saved);
  assert.equal(stats.defeatedBossesCount, 2);
  assert.equal(stats.completedChecklistsCount, 1);
  assert.equal(stats.completedMapsCount, 1);
  assert.equal(stats.estusShardsFound, 1);
  assert.equal(stats.sublimeBoneDustsFound, 0);
});

test('Actual gameplay checklists can satisfy Aldia dialogues without hidden counters', () => {
  const progress = { ...getInitialProgress(), completedChecklists: ['bg_c7', 'uc_aldia_dialogue', 'ds_c1'] };
  assert.equal(evaluateEndingStatus(progress).hasAldiaDialogues, true);
  progress.defeatedBosses = ['throne_duo', 'nashandra'];
  assert.equal(evaluateEndingStatus(progress).canGetEndingLeave, false);
  progress.defeatedBosses.push('aldia_boss');
  assert.equal(evaluateEndingStatus(progress).canGetEndingLeave, true);
});

test('Collecting four crowns alone does not mark Vendrick blessing complete', () => {
  const progress = { ...getInitialProgress(), fourCrownsCollected: true };
  assert.equal(evaluateEndingStatus(progress).canGetBlessing, false);
  progress.obtainedItems = ['dlc1_crown', 'dlc2_crown', 'dlc3_crown', 'km_king_crown'];
  assert.equal(evaluateEndingStatus(progress).hasFourCrowns, true);
  assert.equal(evaluateEndingStatus(progress).canGetBlessing, false);
  progress.completedChecklists = ['km_c4'];
  assert.equal(evaluateEndingStatus(progress).canGetBlessing, true);
  progress.obtainedItems.pop();
  assert.equal(evaluateEndingStatus(progress).canGetBlessing, false);
});
