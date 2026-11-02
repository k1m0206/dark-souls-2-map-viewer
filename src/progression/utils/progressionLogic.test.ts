import test from 'node:test';
import assert from 'node:assert/strict';
import { MAP_NODES } from '../data/soulsData';
import {
  filterMapNodes,
  calculateNodePosition,
  generateBezierPath,
  calculateProgressStats,
  evaluateEndingStatus,
  getInitialProgress,
  getRecommendedOption
} from './progressionLogic';

test('filterMapNodes handles search query accurately', () => {
  const result = filterMapNodes(MAP_NODES, {
    routeFilter: 'all',
    npcFilter: 'all',
    searchQuery: '风车'
  });
  assert.ok(result.length > 0);
  assert.equal(result.some(n => n.id === 'earthen_peak'), true);
});

test('filterMapNodes filters by NPC questline', () => {
  const lucatielMaps = filterMapNodes(MAP_NODES, {
    routeFilter: 'all',
    npcFilter: 'lucatiel',
    searchQuery: ''
  });
  // Lucatiel appears in No-man's Wharf, Lost Bastille, Sinner's Rise, Black Gulch, Aldia's Keep
  assert.ok(lucatielMaps.length >= 4);
  assert.equal(lucatielMaps.some(n => n.id === 'no_mans_wharf'), true);
  assert.equal(lucatielMaps.some(n => n.id === 'aldias_keep'), true);
});

test('calculateNodePosition produces valid coordinate bounds and left-to-right progression', () => {
  const thingsBetwixtPos = calculateNodePosition(MAP_NODES.find(n => n.id === 'things_betwixt')!);
  const majulaPos = calculateNodePosition(MAP_NODES.find(n => n.id === 'majula')!);
  const thronePos = calculateNodePosition(MAP_NODES.find(n => n.id === 'throne_of_want')!);

  assert.ok(thingsBetwixtPos.x < majulaPos.x, 'Things Betwixt should be to the left of Majula');
  assert.ok(majulaPos.x < thronePos.x, 'Majula should be to the left of Throne of Want');
  assert.equal(thingsBetwixtPos.width, 310);
  assert.equal(thingsBetwixtPos.height, 195);
});

test('generateBezierPath outputs valid SVG cubic bezier command', () => {
  const path = generateBezierPath(100, 200, 400, 500);
  assert.ok(path.startsWith('M 100 200 C'));
  assert.ok(path.endsWith('400 500'));
});

test('calculateProgressStats accurately tracks completion counters', () => {
  const initial = getInitialProgress();
  const stats = calculateProgressStats(MAP_NODES, initial);

  assert.equal(stats.completedChecklistsCount, 0);
  assert.equal(stats.totalProgressPercentage, 0);
  assert.ok(stats.totalBosses > 20);

  // Add a defeated boss and checklist
  const updated = {
    ...initial,
    completedChecklists: ['tb_c1', 'tb_c2'],
    defeatedBosses: ['last_giant'],
    obtainedItems: ['maj_estus_1']
  };

  const updatedStats = calculateProgressStats(MAP_NODES, updated);
  assert.equal(updatedStats.completedChecklistsCount, 2);
  assert.equal(updatedStats.defeatedBossesCount, 1);
  assert.equal(updatedStats.estusShardsFound, 1);
});

test('evaluateEndingStatus correctly gates Scholar of the First Sin ending', () => {
  const progressWithoutRequirements = getInitialProgress();
  const res1 = evaluateEndingStatus(progressWithoutRequirements);
  assert.equal(res1.canGetEndingInherit, false);
  assert.equal(res1.canGetEndingLeave, false);

  // Meet normal ending requirements
  const progressNormalEnding = {
    ...progressWithoutRequirements,
    defeatedBosses: ['throne_duo', 'nashandra']
  };
  const res2 = evaluateEndingStatus(progressNormalEnding);
  assert.equal(res2.canGetEndingInherit, true);
  assert.equal(res2.canGetEndingLeave, false); // missing Vendrick, 3 Aldia talks, and Aldia boss

  // Meet full Scholar true ending requirements
  const progressTrueEnding = {
    ...progressNormalEnding,
    vendrickDefeated: true,
    aldiaConversations: 3,
    defeatedBosses: ['throne_duo', 'nashandra', 'aldia_boss']
  };
  const res3 = evaluateEndingStatus(progressTrueEnding);
  assert.equal(res3.canGetEndingInherit, true);
  assert.equal(res3.canGetEndingLeave, true);
});

test('choice helper retrieves recommendation properly', () => {
  const dummyChoice = {
    id: 'test_c',
    title: '测试抉择',
    situation: '面对强敌',
    recommendedChoice: '选项A',
    options: [
      { label: '选项A', isRecommended: true, consequence: '胜利', loreReasoning: '兵法' },
      { label: '选项B', isRecommended: false, consequence: '惨败', loreReasoning: '冒进' }
    ]
  };
  const rec = getRecommendedOption(dummyChoice);
  assert.equal(rec.label, '选项A');
  assert.equal(rec.consequence, '胜利');
});
