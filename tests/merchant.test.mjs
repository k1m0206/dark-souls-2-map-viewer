import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

test('Merchant data has all 22 Drangleic merchants and valid structure', () => {
  const merchantDataRaw = readFileSync(join(projectRoot, 'src/progression/data/merchantData.ts'), 'utf8');

  // Verify all 22 merchant IDs are present
  const requiredMerchants = [
    'hag_melentia',
    'blacksmith_lenigrast',
    'sorcerer_carhillion',
    'pyromancer_rosabeth',
    'cleric_licia',
    'hexer_felkin',
    'straid_olaphis',
    'weaponsmith_ornifex',
    'blacksmith_mcduff',
    'cat_shalquoir',
    'merchant_maughlin',
    'merchant_magerold',
    'grave_warden_agdayne',
    'cleric_cromwell',
    'sorcerer_navlaan',
    'chancellor_wellager',
    'laddersmith_gilligan',
    'vengarl_head',
    'stone_trader_chloanne',
    'lonesome_gavlan',
    'darkdiver_grandahl',
    'blue_sentinel_targray',
  ];

  for (const mid of requiredMerchants) {
    assert.ok(merchantDataRaw.includes(`id: '${mid}'`), `Expected merchant ${mid} to exist`);
  }
});

test('Merchant prices and quantities match SotFS regulation parameters', () => {
  const raw = readFileSync(join(projectRoot, 'src/progression/data/merchantData.ts'), 'utf8');

  // Chancellor Wellager
  assert.ok(raw.includes("17,400 魂"), 'Wellager sells Great Chaos Fireball for 17,400 souls');
  assert.ok(raw.includes("11,000 魂"), 'Wellager sells Bountiful Sunlight for 11,000 souls');
  assert.ok(raw.includes("8,200 魂"), 'Wellager sells Wrath of the Gods for 8,200 souls');
  assert.ok(raw.includes("Spirit Tree Shield"), 'Wellager sells Spirit Tree Shield');

  // Carhillion of the Fold
  assert.ok(raw.includes("id: 'car_yearn'") && raw.includes("price: '3,000 魂'"), 'Carhillion sells Yearn for 3,000 souls');

  // Steady Hand McDuff & Lenigrast
  assert.ok(raw.includes("id: 'leni_titanite_shard'") && raw.includes("price: '800 魂'"), 'Lenigrast sells Titanite Shards for 800 souls');
  assert.ok(raw.includes("id: 'mcduff_titanite_shard'") && raw.includes("price: '800 魂'"), 'McDuff sells Titanite Shards for 800 souls');
  assert.ok(raw.includes("id: 'mcduff_large_titanite'") && raw.includes("price: '2,500 魂'"), 'McDuff sells Large Titanite Shards for 2,500 souls');

  // Sweet Shalquoir
  assert.ok(raw.includes("id: 'cat_redeye_ring'") && raw.includes("price: '6,700 魂'"), 'Shalquoir sells Redeye Ring for 6,700 souls');
  assert.ok(raw.includes("id: 'cat_prism_stone'") && raw.includes("price: '300 魂'"), 'Shalquoir sells Prism Stone for 300 souls');
  assert.ok(raw.includes("id: 'cat_name_engraved_ring'") && raw.includes("price: '5,500 魂'"), 'Shalquoir sells Name-engraved Ring for 5,500 souls');

  // Straid of Olaphis
  assert.ok(raw.includes("id: 'str_sunlight_spear'") && raw.includes("price: '13,000 魂'"), 'Straid sells Great Lightning Spear for 13,000 souls');
  assert.ok(raw.includes("id: 'str_flame_weapon'") && raw.includes("10,000 魂"), 'Straid trades Flame Weapon for 10,000 souls');
  assert.ok(raw.includes("id: 'str_sunlight_blade'") && raw.includes("12,400 魂"), 'Straid sells Sunlight Blade for 12,400 souls');

  // Felkin the Outcast
  assert.ok(raw.includes("id: 'fel_resonant_soul'") && raw.includes("price: '1,100 魂'"), 'Felkin sells Resonant Soul for 1,100 souls');
  assert.ok(raw.includes("id: 'fel_great_resonant_soul'") && raw.includes("price: '3,400 魂'"), 'Felkin sells Great Resonant Soul for 3,400 souls');

  // Grave Warden Agdayne
  assert.ok(raw.includes("id: 'agd_soul_spear'") && raw.includes("price: '12,000 魂'"), 'Agdayne sells Soul Spear for 12,000 souls');
  assert.ok(raw.includes("id: 'agd_soul_appease'") && raw.includes("price: '8,800 魂'"), 'Agdayne sells Soul Appease for 8,800 souls');
  assert.ok(raw.includes("id: 'agd_warmth'") && raw.includes("price: '5,200 魂'"), 'Agdayne sells Warmth for 5,200 souls');

  // Cromwell the Pardoner
  assert.ok(raw.includes("id: 'cro_heavenly_thunder'") && raw.includes("price: '3,300 魂'"), 'Cromwell sells Heavenly Thunder for 3,300 souls');
  assert.ok(raw.includes("id: 'cro_scraps_of_life'") && raw.includes("price: '2,200 魂'"), 'Cromwell sells Scraps of Life for 2,200 souls');

  // Royal Sorcerer Navlaan
  assert.ok(raw.includes("id: 'nav_bonfire_ascetic'") && raw.includes("price: '7,500 魂'"), 'Navlaan sells Bonfire Ascetic for 7,500 souls');
  assert.ok(raw.includes("id: 'nav_forbidden_sun'"), 'Navlaan provides Forbidden Sun');

  // Stone Trader Chloanne
  assert.ok(raw.includes("id: 'chlo_titanite_shard'") && raw.includes("price: '1,000 魂'"), 'Chloanne sells Titanite Shard for 1,000 souls');
  assert.ok(raw.includes("id: 'chlo_large_titanite'") && raw.includes("price: '2,500 魂'"), 'Chloanne sells Large Titanite Shard for 2,500 souls');
  assert.ok(raw.includes("id: 'chlo_titanite_chunk'") && raw.includes("price: '6,000 魂'"), 'Chloanne sells Titanite Chunk for 6,000 souls');
  assert.ok(raw.includes("id: 'chlo_titanite_slab'") && raw.includes("price: '13,000 魂'"), 'Chloanne sells Titanite Slab for 13,000 souls');
  assert.ok(raw.includes("id: 'chlo_twinkling_titanite'") && raw.includes("price: '15,000 魂'"), 'Chloanne sells Twinkling Titanite for 15,000 souls');
  assert.ok(raw.includes("id: 'chlo_petrified_dragon_bone'") && raw.includes("price: '17,500 魂'"), 'Chloanne sells Dragon Bone for 17,500 souls');

  // Lonesome Gavlan
  assert.ok(raw.includes("id: 'gav_poison_arrow'") && raw.includes("price: '60 魂'"), 'Gavlan sells Poison Arrows for 60 souls');
  assert.ok(raw.includes("id: 'gav_poison_moss'") && raw.includes("price: '1,500 魂'"), 'Gavlan sells Poison Moss for 1,500 souls');
  assert.ok(raw.includes("id: 'gav_buyback_service'"), 'Gavlan provides item recycling buyback service');

  // Darkdiver Grandahl
  assert.ok(raw.includes("id: 'gra_bonfire_ascetic'") && raw.includes("price: '7,500 魂'"), 'Grandahl sells Bonfire Ascetic for 7,500 souls');
  assert.ok(raw.includes("id: 'gra_profound_still'") && raw.includes("price: '13,000 魂'"), 'Grandahl sells Profound Still for 13,000 souls');

  // Blue Sentinel Targray
  assert.ok(raw.includes("id: 'tar_boltstone'") && raw.includes("price: '7,000 魂'"), 'Targray sells Boltstone for 7,000 souls');
  assert.ok(raw.includes("id: 'tar_heavenly_thunder'") && raw.includes("price: '3,300 魂'"), 'Targray sells Heavenly Thunder for 3,300 souls');
});
