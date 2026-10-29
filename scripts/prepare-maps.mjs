import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import spawnPoints from '../src/spawn-points.json' with { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));
const inputDir = resolve(__dirname, '../../data/DarkSouls2CollisionData');
const outputDir = resolve(__dirname, '../public-lite/maps');
const DLC_MAP_IDS = new Set(['m50_35', 'm50_36', 'm50_37']);

// Complete metadata and mapping for all 24 Dark Souls 2 maps
export const MAP_CONFIGS = [
  {
    id: 'm10_02',
    file: '10_02_Things Betwixt.iv',
    name: '一线天森林',
    enName: 'Things Betwixt',
    category: '初期启程',
    desc: '穿越时光与漩涡而至的狭间夹缝，防火女与火防女之居所。'
  },
  {
    id: 'm10_04',
    file: '10_04_Majula.iv',
    name: '如蜜',
    enName: 'Majula',
    category: '初期启程',
    desc: '面朝浩渺之海与绝壁的安宁聚落，旅者集聚的远火之地。'
  },
  {
    id: 'm10_29',
    file: '10_29_Majula.iv',
    name: '一线天 · 狭间通路',
    enName: 'Things Betwixt to Majula Passage',
    category: '初期启程',
    desc: '连结一线天森林与如蜜的狭间岩洞与峡谷山道，穿越岩隙即可步入如蜜海滨。'
  },
  {
    id: 'm10_10',
    file: '10_10_Forest of Fallen Giants.iv',
    name: '巨人陨落之森',
    enName: 'Forest of Fallen Giants',
    category: '初期启程',
    desc: '昔日王国对抗巨人的残酷战场要塞，古老的城壁与枯石。'
  },
  {
    id: 'm10_30',
    file: '10_30_Heide\'s Tower of Flame.iv',
    name: '海德巨火塔',
    enName: 'Heide\'s Tower of Flame',
    category: '海德与密港',
    desc: '沉入碧海中的巍峨巨塔与古老骑士之殿，遗存昔日诸神风貌。'
  },
  {
    id: 'm10_31',
    file: '10_31_Heide\'s Tower of Flame & Cathedral of Blue.iv',
    name: '海德巨火塔 · 青之圣堂',
    enName: 'Cathedral of Blue',
    category: '海德与密港',
    desc: '青之圣堂与巨火塔相连的殿堂群，青之骑士守护之地。'
  },
  {
    id: 'm10_18',
    file: '10_18_No-man\'s Wharf.iv',
    name: '密港',
    enName: 'No-man\'s Wharf',
    category: '海德与密港',
    desc: '幽暗潮湿的海蚀洞窟流浪海盗港口，停泊着幽灵船只。'
  },
  {
    id: 'm10_16',
    file: '10_16_The Lost Bastille & Sinners\' Rise & Belfry Luna.iv',
    name: '遗忘牢笼 · 罪人塔 · 月之钟楼',
    enName: 'The Lost Bastille, Sinners\' Rise & Belfry Luna',
    category: '遗忘牢笼路线',
    desc: '隔绝怒海的孤岛巨囚禁所，月之钟楼与罪人塔高耸于暗海之上。'
  },
  {
    id: 'm10_23',
    file: '10_23_Huntsman\'s Copse & Undead Purgatory.iv',
    name: '狩猎森林 · 不死刑场',
    enName: 'Huntsman\'s Copse & Undead Purgatory',
    category: '熔铁城路线',
    desc: '昔日王侯猎捕不死人的阴暗荒林，吊桥连接着不死刑场。'
  },
  {
    id: 'm10_17',
    file: '10_17_Harvest Valley & Earthen Peak.iv',
    name: '流油谷 · 堆土塔',
    enName: 'Harvest Valley & Earthen Peak',
    category: '熔铁城路线',
    desc: '弥漫浓郁毒雾的矿坑流油谷，与巨大风车耸立的堆土塔要塞。'
  },
  {
    id: 'm10_19',
    file: '10_19_Iron Keep & Belfry Sol.iv',
    name: '熔铁城 · 阳之钟楼',
    enName: 'Iron Keep & Belfry Sol',
    category: '熔铁城路线',
    desc: '因重负沉入熔岩深处的雄伟铁铸城堡，铁之古王覆灭之地。'
  },
  {
    id: 'm10_34',
    file: '10_34_Grave of Saints.iv',
    name: '圣人墓地',
    enName: 'Grave of Saints',
    category: '废渊与圣人墓地',
    desc: '如蜜大坑底部的湿润墓窟，鼠王契约者聚集之地。'
  },
  {
    id: 'm10_25',
    file: '10_25_The Gutter & Black Gulch.iv',
    name: '废渊 · 黑溪谷',
    enName: 'The Gutter & Black Gulch',
    category: '废渊与圣人墓地',
    desc: '不见天日的层叠弃置木构深渊，深处是流淌毒液的翡翠黑溪谷。'
  },
  {
    id: 'm10_32',
    file: '10_32_Shaded Woods & Shrine of Winter.iv',
    name: '虚影森林 · 冬之庙',
    enName: 'Shaded Woods & Shrine of Winter',
    category: '虚影与辉石镇',
    desc: '被迷雾与石化诅咒笼罩的废墟森林，通往冬之庙的大门。'
  },
  {
    id: 'm10_33',
    file: '10_33_Doors of Pharros.iv',
    name: '法洛斯门径',
    enName: 'Doors of Pharros',
    category: '虚影与辉石镇',
    desc: '遍布法洛斯机关水池的地下巨殿，连接迷雾森林与辉石镇。'
  },
  {
    id: 'm10_14',
    file: '10_14_Brightstone Cove Tseldora & Lord\'s Private Chamber.iv',
    name: '辉石镇盖多勒 · 领主私室',
    enName: 'Brightstone Cove Tseldora & Lord\'s Private Chamber',
    category: '虚影与辉石镇',
    desc: '依傍巨大流沙峡谷而建的开采聚落，公爵私室与蜘蛛盘踞之地。'
  },
  {
    id: 'm20_21',
    file: '20_21_Drangleic Castle & King\'s Passage & Throne of Want.iv',
    name: '多兰古雷格王城 · 国王回廊 · 渴望王座',
    enName: 'Drangleic Castle, King\'s Passage & Throne of Want',
    category: '多兰古雷格与深处',
    desc: '多兰古雷格王国的权力中心，宏伟冷峻的黑石城堡与渴望王座。'
  },
  {
    id: 'm20_11',
    file: '20_11_Shrine of Amana.iv',
    name: '阿玛纳祭坛',
    enName: 'Shrine of Amana',
    category: '多兰古雷格与深处',
    desc: '水光潋滟却暗藏深渊杀机的地下湖泊圣所，米勒法妮托之歌回荡。'
  },
  {
    id: 'm20_24',
    file: '20_24_Undead Crypt.iv',
    name: '不死灵庙',
    enName: 'Undead Crypt',
    category: '多兰古雷格与深处',
    desc: '沉睡于暗黑尽头的安息之所，凡克拉德王漫步的终末长廊。'
  },
  {
    id: 'm10_15',
    file: '10_15_Aldia\'s Keep.iv',
    name: '安第尔之馆',
    enName: 'Aldia\'s Keep',
    category: '安第尔与巨龙圣域',
    desc: '安第尔探求不朽真理的隐秘研究所，陈列着巨龙骸骨与异形造物。'
  },
  {
    id: 'm10_27',
    file: '10_27_Dragon Aerie & Dragon Shrine.iv',
    name: '卫龙巢穴 · 龙祭坛',
    enName: 'Dragon Aerie & Dragon Shrine',
    category: '安第尔与巨龙圣域',
    desc: '凌驾于云海孤峰之上的飞龙聚所，尽头是古龙静候的宏伟祭坛。'
  },
  {
    id: 'm20_10',
    file: '20_10_Memory of Vammar, Orro, Jeigh.iv',
    name: '巨人回忆（瓦玛尔 / 奥罗 / 杰森）',
    enName: 'Memory of the Giants (Vammar, Orro, Jeigh)',
    category: '回忆与深渊',
    desc: '追寻灰雾核心进入的过去幻影，巨人战争攻城的浩劫记忆。'
  },
  {
    id: 'm20_26',
    file: '20_26_Dragon Memories.iv',
    name: '古龙回忆',
    enName: 'Dragon Memories',
    category: '回忆与深渊',
    desc: '凝视灰烬之湖巨龙尸骸所见的古老时代梦境。'
  },
  {
    id: 'm40_03',
    file: '40_03_Dark Chasm of Old.iv',
    name: '暗潜古穴',
    enName: 'Dark Chasm of Old',
    category: '回忆与深渊',
    desc: '点亮三座古老火盆方能抵达的深渊领域，暗天使居所。'
  },
  {
    id: 'm50_35',
    file: "50_35_Shulva, Sanctum City & Dragon's Sanctum.iv",
    name: '圣壁之都萨尔瓦 · 龙之圣壁',
    enName: 'Shulva, Sanctum City & Dragon\'s Sanctum',
    category: '失落王冠 DLC',
    desc: '沉眠于深邃地底的古老水上圣壁之都，沉睡之龙辛与毒雾的死寂祭坛。'
  },
  {
    id: 'm50_36',
    file: '50_36_Brume Tower & Iron Passage.iv',
    name: '黑雾之塔 · 铁之回廊',
    enName: 'Brume Tower & Iron Passage',
    category: '失落王冠 DLC',
    desc: '被厚重灰烬与黑雾吞噬的熔铁巨塔，烟之骑士与铁之古王余烬沉沦之所。'
  },
  {
    id: 'm50_37',
    file: '50_37_Frozen Eleum Loyce & Frigid Outskirts.iv',
    name: '埃斯・洛耶斯 · 主神殿 · 壁外雪原',
    enName: 'Frozen Eleum Loyce & Frigid Outskirts',
    category: '失落王冠 DLC',
    desc: '白霜封冻的宏伟北境神殿之城，暴风雪咆哮的壁外雪原与混沌余烬。'
  }
];

async function prepareAllMaps() {
  await mkdir(outputDir, { recursive: true });
  console.log(`Starting map compilation from ${inputDir} to ${outputDir}...`);

  const manifest = [];
  let totalRawBytes = 0;
  let totalPackedBytes = 0;
  let totalTriangles = 0;

  for (let idx = 0; idx < MAP_CONFIGS.length; idx++) {
    const config = MAP_CONFIGS[idx];
    const filePath = resolve(inputDir, config.file);
    const buf = await readFile(filePath);
    const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);

    const numChunks = view.getUint32(0, true);
    const r = view.getFloat32(4, true);
    const g = view.getFloat32(8, true);
    const b = view.getFloat32(12, true);

    let chunkTableIdx = 0x10;
    let totalIndices = 0;
    let totalPositions = 0;
    let globalMin = [Infinity, Infinity, Infinity];
    let globalMax = [-Infinity, -Infinity, -Infinity];

    const chunkMeta = [];
    const binaryParts = [];
    let binaryOffset = 0;
    const processedChunks = [];

    for (let i = 0; i < numChunks; i++) {
      const idxDataOffs = view.getUint32(chunkTableIdx + 0x00, true);
      const idxDataCount = view.getUint32(chunkTableIdx + 0x04, true);
      const posDataOffs = view.getUint32(chunkTableIdx + 0x08, true);
      const posDataCount = view.getUint32(chunkTableIdx + 0x0C, true);
      chunkTableIdx += 0x10;

      const indices = new Uint16Array(buf.buffer.slice(buf.byteOffset + idxDataOffs, buf.byteOffset + idxDataOffs + idxDataCount * 2));
      const pos = new Float32Array(buf.buffer.slice(buf.byteOffset + posDataOffs, buf.byteOffset + posDataOffs + posDataCount * 12));

      // Skip identical duplicate chunks (resolves duplicate geometry and Z-fighting flicker)
      let isDuplicate = false;
      for (const prev of processedChunks) {
        if (prev.posDataCount === posDataCount && prev.idxDataCount === idxDataCount) {
          let maxDiff = 0;
          for (let pIdx = 0; pIdx < pos.length; pIdx += 10) {
            const d = Math.abs(pos[pIdx] - prev.pos[pIdx]);
            if (d > maxDiff) maxDiff = d;
          }
          if (maxDiff < 0.01) {
            isDuplicate = true;
            console.log(`  [Deduplication] Skipped duplicate chunk ${i} in ${config.id} (${posDataCount} verts, ${Math.round(idxDataCount / 3)} tris)`);
            break;
          }
        }
      }
      if (isDuplicate) continue;
      processedChunks.push({ posDataCount, idxDataCount, pos });

      totalIndices += idxDataCount;
      totalPositions += posDataCount;


      let min = [Infinity, Infinity, Infinity];
      let max = [-Infinity, -Infinity, -Infinity];
      for (let j = 0; j < pos.length; j += 3) {
        for (let k = 0; k < 3; k++) {
          const v = pos[j + k];
          min[k] = Math.min(min[k], v);
          max[k] = Math.max(max[k], v);
          globalMin[k] = Math.min(globalMin[k], v);
          globalMax[k] = Math.max(globalMax[k], v);
        }
      }

      const scale = max.map((v, k) => (v - min[k]) / 65535);
      const qpos = new Uint16Array(posDataCount * 3);
      for (let j = 0; j < pos.length; j += 3) {
        for (let k = 0; k < 3; k++) {
          qpos[j + k] = scale[k] ? Math.round((pos[j + k] - min[k]) / scale[k]) : 0;
        }
      }

      const posBytes = new Uint8Array(qpos.buffer, qpos.byteOffset, qpos.byteLength);
      const idxBytes = new Uint8Array(indices.buffer, indices.byteOffset, indices.byteLength);

      chunkMeta.push({
        min: min.map(v => Number(v.toFixed(3))),
        scale: scale.map(v => Number(v.toFixed(6))),
        vertices: posDataCount,
        indicesCount: idxDataCount,
        posOffs: binaryOffset,
        posLen: posBytes.byteLength,
        idxOffs: binaryOffset + posBytes.byteLength,
        idxLen: idxBytes.byteLength
      });

      binaryParts.push(posBytes);
      binaryParts.push(idxBytes);
      binaryOffset += posBytes.byteLength + idxBytes.byteLength;
    }

    const centerX = (globalMin[0] + globalMax[0]) / 2;
    const centerY = (globalMin[1] + globalMax[1]) / 2;
    const centerZ = (globalMin[2] + globalMax[2]) / 2;

    const spawnWalk = spawnPoints[config.id];
    if (!spawnWalk) throw new Error(`Missing curated spawn point for ${config.id}`);
    const spawnFly = [
      spawnWalk[0],
      Number((spawnWalk[1] + 30).toFixed(2)),
      Number(Math.min(spawnWalk[2] + 25, globalMax[2] - 2).toFixed(2))
    ];

    const triangles = Math.round(totalIndices / 3);

    const header = {
      id: config.id,
      name: config.name,
      enName: config.enName,
      category: config.category,
      isDlc: DLC_MAP_IDS.has(config.id),
      desc: config.desc,
      color: [Number(r.toFixed(3)), Number(g.toFixed(3)), Number(b.toFixed(3))],
      bounds: {
        min: globalMin.map(v => Number(v.toFixed(2))),
        max: globalMax.map(v => Number(v.toFixed(2)))
      },
      center: [Number(centerX.toFixed(2)), Number(centerY.toFixed(2)), Number(centerZ.toFixed(2))],
      spawnWalk,
      spawnFly,
      triangles,
      vertices: totalPositions,
      chunks: chunkMeta
    };

    const headerJson = JSON.stringify(header);
    const headerBuf = Buffer.from(headerJson, 'utf8');
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32LE(headerBuf.length, 0);

    const fullData = Buffer.concat([lenBuf, headerBuf, ...binaryParts]);
    const gz = gzipSync(fullData, { level: 9 });
    const b64 = gz.toString('base64');
    const js = `globalThis.__atlasReceive(${JSON.stringify(config.id)},${JSON.stringify(b64)});`;

    const outJsPath = resolve(outputDir, `${config.id}.js`);
    await writeFile(outJsPath, js, 'utf8');

    totalRawBytes += buf.length;
    totalPackedBytes += js.length;
    totalTriangles += triangles;

    manifest.push({
      id: config.id,
      name: config.name,
      enName: config.enName,
      category: config.category,
      isDlc: DLC_MAP_IDS.has(config.id),
      desc: config.desc,
      color: header.color,
      bounds: header.bounds,
      center: header.center,
      spawnWalk,
      spawnFly,
      triangles,
      vertices: totalPositions,
      chunks: chunkMeta.length,
      chunkBounds: chunkMeta.map(({ min, scale }) => ({
        min,
        max: min.map((v, axis) => Number((v + scale[axis] * 65535).toFixed(2)))
      })),
      bytes: js.length,
      originalBytes: buf.length
    });

    console.log(`[${idx + 1}/${MAP_CONFIGS.length}] ${config.name} (${config.id}): ${triangles.toLocaleString()} tris, ${(js.length / 1024 / 1024).toFixed(2)} MB`);
  }

  // Write manifest.json
  const manifestPath = resolve(outputDir, 'manifest.json');
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  const boundsPath = resolve(__dirname, '../src/map-bounds.json');
  await writeFile(boundsPath, JSON.stringify(Object.fromEntries(
    manifest.map(({ id, chunkBounds }) => [id, chunkBounds])
  )), 'utf8');

  console.log('\n--- Map Compilation Finished ---');
  console.log(`Total maps: ${MAP_CONFIGS.length}`);
  console.log(`Total triangles: ${totalTriangles.toLocaleString()}`);
  console.log(`Original IV size: ${(totalRawBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Packed miniapp size: ${(totalPackedBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Manifest written to: ${manifestPath}`);
}

prepareAllMaps().catch(err => {
  console.error('Fatal error during map compilation:', err);
  process.exit(1);
});
