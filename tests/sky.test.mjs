import test from 'node:test';
import assert from 'node:assert/strict';
import { stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const KEY_SKY_MAPS = [
  'm10_02', // 一线天森林
  'm10_04', // 如蜜
  'm10_10', // 巨人陨落之森
  'm10_14', // 辉石镇
  'm10_15', // 安第尔之馆
  'm10_16', // 遗忘牢笼
  'm10_17', // 流油谷
  'm10_18', // 密港
  'm10_19', // 熔铁城
  'm10_23', // 狩猎森林
  'm10_27', // 卫龙巢穴
  'm10_31', // 青之圣堂
  'm10_32', // 虚影森林
  'm20_10', // 巨人回忆
  'm20_21', // 多兰古雷格王城
  'm20_24', // 不死灵庙
  'm20_26', // 古龙回忆
  'm50_35', // 圣壁之都萨尔瓦 DLC
  'm50_36', // 黑雾之塔 DLC
  'm50_37', // 埃斯・洛耶斯 DLC
];

const INDOOR_ABYSS_MAPS = [
  'm10_25', // 废渊与黑溪谷
  'm10_33', // 法洛斯门径
  'm10_34', // 圣人墓地
  'm40_03', // 暗潜古穴
];

test('Curated sky texture assets exist on disk', async () => {
  const assets = [
    '10_02_enkeiA00_d.webp',
    '10_04_m10_04_sky_01_d.webp',
    '10_10_sky_01_d.webp',
    '10_14_sky_17_d.webp',
    '10_15_sky_03_d.webp',
    '10_16_sky_32_d.webp',
    '10_17_sky_32_d.webp',
    '10_18_m99_91_sky_00.webp',
    '10_19_sky_00_d.webp',
    '10_23_sky_00_d.webp',
    '10_27_sky_00_d.webp',
    '10_29_sky_02_d.webp',
    '10_31_sky_02_d.webp',
    '10_32_sky_32_d.webp',
    '20_10_sky_01_d.webp',
    '20_21_sky_00_d.webp',
    '20_24_sky_01.webp',
    '20_26_sky_32_d.webp',
    '50_35_enkei_04_d.webp',
    '50_36_sky_00_d.webp',
    '50_37_sky_50_d.webp',
  ];

  for (const name of assets) {
    const p = resolve(__dirname, '../src/assets/sky', name);
    const s = await stat(p);
    assert.ok(s.size > 1000, `Asset ${name} should have substantial size, got ${s.size}`);
  }
});
