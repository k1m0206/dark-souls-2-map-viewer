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
const { PROGRESSION_TO_3D_MAP_ID, PROGRESSION_RETURN_MAPS } = load('src/progression/data/mapNavigation.ts');

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

test('Every playable walkthrough node opens an existing physical map with the correct destination', () => {
  const manifest = JSON.parse(readFileSync(resolve(root, 'public-lite/maps/manifest.json'), 'utf8'));
  const mapIds = new Set(manifest.map(m => m.id));
  const playable = MAP_NODES.filter(n => !n.id.startsWith('ending_'));
  assert.deepEqual(Object.keys(PROGRESSION_TO_3D_MAP_ID).sort(), playable.map(n => n.id).sort());
  for (const [nodeId, mapId] of Object.entries(PROGRESSION_TO_3D_MAP_ID)) {
    assert.ok(mapIds.has(mapId), `${nodeId} targets missing map ${mapId}`);
  }
  // Semantic assertions catch destinations that exist but belong to the wrong area.
  const expectedNames = {
    undead_crypt: 'Undead Crypt', aldias_keep: "Aldia's Keep",
    dragon_aerie: 'Dragon Aerie', dragon_shrine: 'Dragon Shrine',
    dark_chasm_of_old: 'Dark Chasm', memories_of_ancients: 'Memory of the Giants',
    kings_memory: 'Undead Crypt', dlc_shulva: 'Shulva',
    dlc_brume_tower: 'Brume Tower', dlc_eleum_loyce: 'Eleum Loyce',
  };
  for (const [nodeId, name] of Object.entries(expectedNames)) {
    const physical = manifest.find(m => m.id === PROGRESSION_TO_3D_MAP_ID[nodeId]);
    assert.ok(physical.enName.includes(name), `${nodeId}: ${physical.enName}`);
  }
  for (const [nodeId, returns] of Object.entries(PROGRESSION_RETURN_MAPS)) {
    assert.ok(MAP_NODES.some(n => n.id === nodeId));
    for (const visit of returns) assert.ok(mapIds.has(visit.mapId));
  }
  const dragonMemory = PROGRESSION_RETURN_MAPS.brightstone_cove[0];
  assert.match(manifest.find(m => m.id === dragonMemory.mapId).enName, /Dragon Memor/);
});

test('Expanded routes preserve legacy completions without auto-completing newly added exploration', () => {
  const legacy = {
    completedChecklists: ['tb_c2', 'hv_c3', 'bc_c5', 'moa_c4', 'dlc1_c4', 'dlc2_c4', 'dlc3_c3'],
    completedMaps: ['earthen_peak', 'dlc_eleum_loyce'],
    obtainedItems: ['bl_southern_ring', 'cob_ring', 'ik_dlc_key', 'moa_giant_souls'],
    defeatedBosses: ['giant_lord', 'ava'],
  };
  const restored = normalizeProgress(legacy);
  for (const key of Object.keys(legacy)) assert.deepEqual(restored[key], legacy[key]);
  for (const newTask of ['ep_covetous', 'dlc1_cave_route', 'dlc2_iron_passage', 'dlc3_knight_inner', 'dlc3_lud_zallen']) {
    assert.ok(MAP_NODES.some(n => n.checklists.some(t => t.id === newTask)));
    assert.equal(restored.completedChecklists.includes(newTask), false);
  }
  assert.equal(restored.obtainedItems.includes('dlc3_garrison_key'), false);
  assert.equal(calculateProgressStats(MAP_NODES, restored).completedChecklistsCount, legacy.completedChecklists.length);
});

test('NPC interaction identities and single-location quest steps match the tracker', () => {
  const drummond = MAP_NODES.find(n => n.id === 'memories_of_ancients').npcInteractions.find(n => n.npcId === 'drummond');
  assert.ok(drummond);
  for (const quest of NPC_QUESTLINES) for (const node of MAP_NODES) {
    const steps = quest.steps.filter(s => s.mapId === node.id);
    if (steps.length !== 1) continue;
    for (const interaction of node.npcInteractions.filter(n => n.npcId === quest.id)) {
      assert.equal(interaction.stepNumber, steps[0].stepIndex, `${node.id}/${quest.id}`);
      assert.equal(interaction.totalSteps, quest.steps.length, `${node.id}/${quest.id}`);
    }
  }
});

test('Ending readiness, a possible pending Aldia encounter, and an actual ending choice are separate', () => {
  const progress = { ...getInitialProgress(), defeatedBosses: ['throne_duo', 'nashandra'] };
  let status = evaluateEndingStatus(progress);
  assert.equal(status.canGetEndingInherit, true);
  assert.equal(status.hasSelectedEndingInherit, false);
  assert.equal(status.hasSelectedEndingLeave, false);
  progress.vendrickDefeated = true;
  progress.completedChecklists = ['bg_c7', 'uc_aldia_dialogue', 'ds_c1'];
  status = evaluateEndingStatus(progress);
  assert.equal(status.needsAldiaConfirmation, true);
  assert.equal(status.canGetEndingInherit, false);
  assert.equal(status.canGetEndingLeave, false);
  progress.defeatedBosses.push('aldia_boss');
  status = evaluateEndingStatus(progress);
  assert.equal(status.needsAldiaConfirmation, false);
  assert.equal(status.canGetEndingInherit, true);
  assert.equal(status.canGetEndingLeave, true);
  assert.equal(status.hasSelectedEndingLeave, false);
  progress.completedChecklists.push('end2_c4');
  status = evaluateEndingStatus(progress);
  assert.equal(status.hasSelectedEndingLeave, true);
  assert.equal(status.hasSelectedEndingInherit, false);
});
