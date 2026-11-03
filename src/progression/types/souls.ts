export type StageId = 
  | 'prologue'
  | 'four_souls'
  | 'drangleic'
  | 'undead_crypt'
  | 'dragon_shrine'
  | 'memories'
  | 'throne_endings'
  | 'dlc';

export type BranchId = 
  | 'main'
  | 'branch_sinner'
  | 'branch_iron_king'
  | 'branch_brightstone'
  | 'branch_gutter'
  | 'branch_dlc'
  | 'ending';

export type NPCId = 
  | 'lucatiel'
  | 'benhart'
  | 'pate_creighton'
  | 'aldia'
  | 'grandahl'
  | 'navlaan'
  | 'herald'
  | 'ornifex'
  | 'vengarl'
  | 'licia'
  | 'straid'
  | 'cale'
  | 'chloanne'
  | 'gavlan'
  | 'agdayne'
  | 'targray'
  | 'gren'
  | 'felkin'
  | 'magerold'
  | 'tark'
  | 'cromwell'
  | 'nashandra'
  | 'drummond'
  | 'vendrick'
  | 'alsanna';

export interface Boss {
  id: string;
  name: string;
  nameEn: string;
  isOptional: boolean;
  isGreatSoul?: boolean;
  tips: string;
  transposeWeapon: string;
}

export interface CollectibleItem {
  id: string;
  name: string;
  type: 'estus_shard' | 'sublime_bone_dust' | 'fragrant_branch' | 'pharros_stone' | 'key_item' | 'spell';
  location: string;
}

export interface NPCInteraction {
  npcId: NPCId;
  npcName: string;
  stepNumber: number;
  totalSteps: number;
  actionRequired: string;
  warning?: string;
  reward?: string;
}

export interface ChoiceOption {
  label: string;
  isRecommended: boolean;
  consequence: string;
  spoilerContent?: string;
  loreReasoning: string;
}

export interface ChoicePoint {
  id: string;
  title: string;
  situation: string;
  recommendedChoice: string;
  options: ChoiceOption[];
}

export interface MapChecklistItem {
  id: string;
  task: string;
  category: 'essential' | 'boss' | 'npc' | 'secret' | 'collectible';
}

export interface MapNode {
  id: string;
  name: string;
  nameEn: string;
  stage: StageId;
  stageName: string;
  branch: BranchId;
  branchName: string;
  order: number; // sequential position inside stage
  lane: number; // vertical lane index (0 = top, 1, 2, 3...)
  levelRecommendation: string;
  bonfireCount: number;
  description: string;
  lore: string;
  colorTheme: string;
  bosses: Boss[];
  keyItems: CollectibleItem[];
  npcInteractions: NPCInteraction[];
  checklists: MapChecklistItem[];
  choices?: ChoicePoint[];
  trapsAndTricks: string[];
  connectionsTo: {
    targetId: string;
    requirement?: string;
    isSecret?: boolean;
  }[];
}

export interface NPCQuestline {
  id: NPCId;
  name: string;
  title: string;
  summary: string;
  finalReward: string;
  steps: {
    mapId: string;
    stepIndex: number;
    title: string;
    description: string;
    warning?: string;
  }[];
}

export interface GameEnding {
  id: string;
  name: string;
  nameEn: string;
  subtitle: string;
  description: string;
  loreQuote: string;
  isScholarExclusive?: boolean;
  conditions: {
    text: string;
    checkKey: string;
  }[];
}

export type MerchantItemCategory = 
  | 'magic'
  | 'miracle'
  | 'pyromancy'
  | 'hex'
  | 'weapon_shield'
  | 'armor'
  | 'ring'
  | 'key_item'
  | 'consumable';

export interface MerchantItem {
  id: string;
  name: string;
  nameEn?: string;
  category: MerchantItemCategory;
  price: string;
  quantity: string;
  requirement?: string;
  notes?: string;
  isBossTransposition?: boolean;
  isKeyMustBuy?: boolean;
}

export interface MerchantNPC {
  id: string;
  name: string;
  nameEn?: string;
  title: string;
  locationMapId: string;
  locationName: string;
  role: 'merchant' | 'sorcerer' | 'pyromancer' | 'hexer' | 'cleric' | 'blacksmith' | 'transposition' | 'covenant';
  roleLabel: string;
  description: string;
  condition?: string;
  inventoryType?: string;
  accentColor?: string;
  items: MerchantItem[];
}

export interface UserProgress {
  completedMaps: string[];
  completedChecklists: string[];
  defeatedBosses: string[];
  obtainedItems: string[];
  aldiaConversations: number;
  vendrickDefeated: boolean;
  fourCrownsCollected: boolean;
}

