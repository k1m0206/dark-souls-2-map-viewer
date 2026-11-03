import { MapNode, NPCId, UserProgress } from '../types/souls';
import { MAP_NODES, NPC_QUESTLINES } from '../data/soulsData';
import { getMerchantsForMap } from '../data/merchantData';

export type RouteFilterType = 'all' | 'golden_path' | 'four_souls' | 'endings' | 'dlc';

export interface FilterOptions {
  routeFilter: RouteFilterType;
  npcFilter: NPCId | 'all';
  searchQuery: string;
}

export interface NodePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function filterMapNodes(nodes: MapNode[], options: FilterOptions): MapNode[] {
  const { routeFilter, npcFilter, searchQuery } = options;

  let filtered = [...nodes];

  // Route filter
  if (routeFilter === 'golden_path') {
    // Only non-optional main path
    // Recommended route through the four souls; optional detours and endings stay in their own filters.
    const detours = new Set(['belfry_luna', 'belfry_sol', 'cathedral_of_blue', 'undead_purgatory', 'dark_chasm_of_old', 'kings_memory', 'ending_leave', 'ending_inherit']);
    filtered = filtered.filter(node => node.stage !== 'dlc' && !detours.has(node.id));
  } else if (routeFilter === 'four_souls') {
    filtered = filtered.filter(node => node.stage === 'four_souls' || node.stage === 'prologue');
  } else if (routeFilter === 'endings') {
    filtered = filtered.filter(node => node.stage === 'memories' || node.stage === 'throne_endings');
  } else if (routeFilter === 'dlc') {
    filtered = filtered.filter(node => node.stage === 'dlc' || node.id === 'black_gulch' || node.id === 'iron_keep' || node.id === 'shrine_of_winter');
  }

  // NPC filter
  if (npcFilter !== 'all') {
    const quest = NPC_QUESTLINES.find(q => q.id === npcFilter);
    if (quest) {
      const targetMapIds = new Set(quest.steps.map(s => s.mapId));
      filtered = filtered.filter(node => targetMapIds.has(node.id));
    }
  }

  // Search filter
  if (searchQuery.trim()) {
    const query = searchQuery.trim().toLowerCase();
    filtered = filtered.filter(node => {
      const matchName = node.name.toLowerCase().includes(query) || node.nameEn.toLowerCase().includes(query);
      const matchDescription = node.description.toLowerCase().includes(query);
      const matchBosses = node.bosses.some(b => b.name.toLowerCase().includes(query) || b.nameEn.toLowerCase().includes(query));
      const matchItems = node.keyItems.some(i => i.name.toLowerCase().includes(query));
      const matchChecklist = node.checklists.some(c => c.task.toLowerCase().includes(query));
      const matchTraps = node.trapsAndTricks.some(t => t.toLowerCase().includes(query));
      const matchNpc = node.npcInteractions.some(n => n.npcName.toLowerCase().includes(query));
      
      // Also match merchant wares and spells in this location
      const merchants = getMerchantsForMap(node.id);
      const matchMerchant = merchants.some(m => 
        m.name.toLowerCase().includes(query) || 
        m.roleLabel.toLowerCase().includes(query) ||
        m.items.some(it => it.name.toLowerCase().includes(query) || (it.nameEn && it.nameEn.toLowerCase().includes(query)) || (it.notes && it.notes.toLowerCase().includes(query)))
      );

      return matchName || matchDescription || matchBosses || matchItems || matchChecklist || matchTraps || matchNpc || matchMerchant;
    });
  }

  return filtered;
}

/**
 * Stage order definitions mapping to X column coordinate bands (From Left to Right)
 */
export const STAGE_X_MAPPING: Record<string, number> = {
  prologue: 80,
  four_souls_col1: 440,
  four_souls_col2: 800,
  four_souls_col3: 1160,
  four_souls_col4: 1520,
  four_souls_col5: 1880,
  drangleic: 2240,
  undead_crypt: 2600,
  dragon_shrine: 2960,
  memories: 3320,
  throne_endings: 3700,
  dlc: 1880, // DLC starts below stage 2/3
};

/**
 * Lane order definitions mapping to Y row coordinate bands (Vertical branches)
 */
export const LANE_Y_OFFSET: Record<number, number> = {
  0: 70,     // Sinner's Path (Top)
  0.5: 620,  // Cathedral of Blue / Undead Purgatory
  1: 340,    // Iron King's Path
  1.5: 900,  // Central Spine (Majula / Castle / Amana / Crypt / Shrine / Memories / Throne)
  2: 1200,   // Brightstone Path
  2.5: 1100, // King's Memory
  3: 1520,   // The Gutter & Rotten Path (Bottom of 4 Souls)
  3.5: 1840  // DLC Crowns (Bottom horizontal strip)
};

export function calculateNodePosition(node: MapNode): NodePosition {
  const width = 330;
  const height = 210;

  let x = 80;

  if (node.stage === 'prologue') {
    x = 80 + node.order * 360;
  } else if (node.stage === 'four_souls') {
    // Stage 2 has columns depending on step order in branch
    if (node.order === 2) x = 820;
    else if (node.order === 3) x = 1190;
    else if (node.order === 4) x = 1560;
    else if (node.order === 5) x = 1930;
    else if (node.order === 6) x = 2300;
    else if (node.order === 7) x = 2670;
    else if (node.order === 8) x = 3040;
    else x = 820;
  } else if (node.stage === 'drangleic') {
    // Winter Shrine & Drangleic Castle & Amana
    x = 3440 + node.order * 370;
  } else if (node.stage === 'undead_crypt') {
    x = 4550;
  } else if (node.stage === 'dragon_shrine') {
    x = 4920 + node.order * 370;
  } else if (node.stage === 'memories') {
    x = 6030 + node.order * 370;
  } else if (node.stage === 'throne_endings') {
    if (node.id === 'throne_of_want') {
      x = 6770;
    } else {
      x = 7180; // Endings columns
    }
  } else if (node.stage === 'dlc') {
    x = 1930 + node.order * 460;
  }

  let y = LANE_Y_OFFSET[node.lane] ?? 900;

  // Custom adjustments for special nodes
  if (node.id === 'things_betwixt') y = 900;
  if (node.id === 'majula') y = 900;
  if (node.id === 'cathedral_of_blue') {
    x = 1190;
    y = 620;
  }
  if (node.id === 'belfry_luna') {
    x = 1190;
    y = -160;
  }
  if (node.id === 'undead_purgatory') {
    x = 1930;
    y = 620;
  }
  if (node.id === 'belfry_sol') {
    x = 3040;
    y = 100;
  }
  if (node.id === 'dark_chasm_of_old') {
    x = 4180;
    y = 1100;
  }
  if (node.id === 'ending_inherit') y = 760;
  if (node.id === 'ending_leave') y = 1040;

  return { x, y, width, height };
}

export function generateBezierPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number
): string {
  const deltaX = Math.abs(endX - startX);
  const controlPointOffset = Math.max(deltaX * 0.45, 60);

  const cp1X = startX + controlPointOffset;
  const cp1Y = startY;
  const cp2X = endX - controlPointOffset;
  const cp2Y = endY;

  return `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
}

export function calculateProgressStats(nodes: MapNode[], progress: UserProgress) {
  const checklistIds = new Set(nodes.flatMap(node => node.checklists.map(task => task.id)));
  const bossIds = new Set(nodes.flatMap(node => node.bosses.map(boss => boss.id)));
  const mapIds = new Set(nodes.map(node => node.id));
  const items = nodes.flatMap(node => node.keyItems);
  const shardIds = new Set(items.filter(item => item.type === 'estus_shard').map(item => item.id));
  const dustIds = new Set(items.filter(item => item.type === 'sublime_bone_dust').map(item => item.id));
  const countKnown = (saved: string[], known: Set<string>) => new Set(saved.filter(id => known.has(id))).size;
  const totalChecklists = checklistIds.size;
  const totalBosses = bossIds.size;
  const estusShardsFound = countKnown(progress.obtainedItems, shardIds);
  const sublimeBoneDustsFound = countKnown(progress.obtainedItems, dustIds);
  const completedChecklistsCount = countKnown(progress.completedChecklists, checklistIds);
  const defeatedBossesCount = countKnown(progress.defeatedBosses.map(id => id === 'vendrick_fight' ? 'vendrick' : id), bossIds);
  const completedMapsCount = countKnown(progress.completedMaps, mapIds);

  const totalProgressPercentage = totalChecklists > 0
    ? Math.min(100, Math.round((completedChecklistsCount / totalChecklists) * 100))
    : 0;

  return {
    totalMaps: nodes.length,
    completedMapsCount,
    totalChecklists,
    completedChecklistsCount,
    totalBosses,
    defeatedBossesCount,
    estusShardsFound,
    totalEstusShards: shardIds.size,
    sublimeBoneDustsFound,
    totalBoneDusts: dustIds.size,
    totalProgressPercentage,
  };
}

export function evaluateEndingStatus(progress: UserProgress) {
  const hasThroneDuo = progress.defeatedBosses.includes('throne_duo');
  const hasNashandra = progress.defeatedBosses.includes('nashandra');
  const hasVendrick = progress.vendrickDefeated || progress.defeatedBosses.includes('vendrick') || progress.defeatedBosses.includes('vendrick_fight');
  const hasAldiaDialogues = progress.aldiaConversations >= 3 ||
    ['bg_c7', 'uc_aldia_dialogue', 'ds_c1'].every(id => progress.completedChecklists.includes(id));
  const hasAldiaBoss = progress.defeatedBosses.includes('aldia_boss');

  const hasThroneVictories = hasThroneDuo && hasNashandra;
  // Saved progress cannot establish whether Vendrick/dialogues preceded Nashandra.
  // Ask the player to finish/confirm a possible Aldia encounter before calling the throne ready.
  const needsAldiaConfirmation = hasThroneVictories && hasVendrick && hasAldiaDialogues && !hasAldiaBoss;
  const canGetEndingInherit = hasThroneVictories && !needsAldiaConfirmation;
  // Defeating Aldia is itself evidence that his dialogue and Vendrick prerequisites were met.
  const canGetEndingLeave = hasThroneVictories && hasAldiaBoss;
  const hasSelectedEndingInherit = progress.completedChecklists.includes('end1_c2');
  const hasSelectedEndingLeave = progress.completedChecklists.includes('end2_c4');
  const hasFourCrowns = ['dlc1_crown', 'dlc2_crown', 'dlc3_crown', 'km_king_crown']
    .every(id => progress.obtainedItems.includes(id));
  // Owning the crowns alone does not grant the blessing: confirm Vendrick's dialogue too.
  const canGetBlessing = hasFourCrowns && progress.completedChecklists.includes('km_c4');

  return {
    canGetEndingInherit,
    canGetEndingLeave,
    hasSelectedEndingInherit,
    hasSelectedEndingLeave,
    needsAldiaConfirmation,
    canGetBlessing,
    hasVendrick,
    hasAldiaDialogues,
    hasAldiaBoss,
    hasFourCrowns,
  };
}

/** Preserve valid v1 progress while retiring entries that do not exist in Scholar. */
export function normalizeProgress(saved: Partial<UserProgress> | null): UserProgress {
  const initial = getInitialProgress();
  if (!saved || typeof saved !== 'object') return initial;
  const known = {
    completedMaps: new Set(MAP_NODES.map(node => node.id)),
    completedChecklists: new Set(MAP_NODES.flatMap(node => node.checklists.map(task => task.id))),
    defeatedBosses: new Set(MAP_NODES.flatMap(node => node.bosses.map(boss => boss.id))),
    obtainedItems: new Set(MAP_NODES.flatMap(node => node.keyItems.map(item => item.id))),
  };
  for (const key of ['completedMaps', 'completedChecklists', 'defeatedBosses', 'obtainedItems'] as const) {
    const values = Array.isArray(saved[key]) ? saved[key] : [];
    initial[key] = [...new Set(values.map(id => key === 'defeatedBosses' && id === 'vendrick_fight' ? 'vendrick' : id)
      .filter(id => typeof id === 'string' && known[key].has(id)))];
  }
  initial.aldiaConversations = Number.isFinite(saved.aldiaConversations)
    ? Math.max(0, Math.min(3, saved.aldiaConversations!)) : 0;
  initial.vendrickDefeated = initial.defeatedBosses.includes('vendrick') || saved.vendrickDefeated === true;
  initial.fourCrownsCollected = saved.fourCrownsCollected === true;
  return initial;
}

export function getInitialProgress(): UserProgress {
  return {
    completedMaps: [],
    completedChecklists: [],
    defeatedBosses: [],
    obtainedItems: [],
    aldiaConversations: 0,
    vendrickDefeated: false,
    fourCrownsCollected: false,
  };
}

export function getAllChoicePoints(nodes: MapNode[]) {
  const result: { mapId: string; mapName: string; choice: import('../types/souls').ChoicePoint }[] = [];
  nodes.forEach(node => {
    if (node.choices && node.choices.length > 0) {
      node.choices.forEach(c => {
        result.push({
          mapId: node.id,
          mapName: node.name,
          choice: c,
        });
      });
    }
  });
  return result;
}

export function getRecommendedOption(choice: import('../types/souls').ChoicePoint) {
  return choice.options.find(opt => opt.isRecommended) || choice.options[0];
}
