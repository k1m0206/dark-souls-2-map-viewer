// Auto-generated from Dark Souls II Scholar of the First Sin Game Data
import allItemsData from './all-items.json';

export interface PickableItem {
  id: number;
  name: string;
  count: number;
  category: string;
  summary: string;
  description: string;
}

export interface TreasureSpot {
  id: string;
  mapId: string;
  event_name: string;
  in_chest: boolean;
  chest_type?: 'wood' | 'iron';
  rotY?: number;
  pos: [number, number, number];
  items: PickableItem[];
  availability?: 'recovery' | 'class-dependent';
  conditionNote?: string;
}

export const ALL_MAP_ITEMS: Record<string, TreasureSpot[]> = allItemsData as unknown as Record<string, TreasureSpot[]>;
