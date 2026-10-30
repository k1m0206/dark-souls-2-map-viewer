import spawnPoints from './spawn-points.json';

export interface MapDefinition {
  id: string;
  name: string;
  enName: string;
  category: string;
  isDlc: boolean;
  desc: string;
  color: [number, number, number];
  bounds: { min: [number, number, number]; max: [number, number, number] };
  center: [number, number, number];
  spawnWalk: [number, number, number];
  spawnFly: [number, number, number];
  triangles: number;
  vertices: number;
}

export const MAP_CATEGORIES = [
  '全部',
  '初期启程',
  '海德与密港',
  '遗忘牢笼路线',
  '熔铁城路线',
  '废渊与圣人墓地',
  '虚影与辉石镇',
  '多兰古雷格与深处',
  '安第尔与巨龙圣域',
  '回忆与深渊',
  '失落王冠 DLC',
] as const;

export type MapCategory = typeof MAP_CATEGORIES[number];

const MAP_CATALOG: Omit<MapDefinition, 'spawnWalk' | 'spawnFly' | 'isDlc'>[] = [
  {
    id: 'm10_02',
    name: '一线天森林',
    enName: 'Things Betwixt',
    category: '初期启程',
    desc: '穿越时光与漩涡而至的狭间夹缝，防火女与火防女之居所。',
    color: [0.1, 0.3, 0.1],
    bounds: { min: [-262.85, -51.19, -357.65], max: [-13.74, 86.18, -71.52] },
    center: [-138.29, 17.5, -214.59],
    triangles: 181878,
    vertices: 223270
  },
  {
    id: 'm10_04',
    name: '如蜜',
    enName: 'Majula',
    category: '初期启程',
    desc: '面朝浩渺之海与绝壁的安宁聚落，旅者集聚的远火之地。',
    color: [0.3, 0.3, 0.1],
    bounds: { min: [-138.25, -141.32, -124.57], max: [115.5, 50.0, 58.27] },
    center: [-11.38, -45.66, -33.15],
    triangles: 169976,
    vertices: 352340
  },
  {
    id: 'm10_29',
    name: '一线天 · 狭间通路',
    enName: 'Things Betwixt to Majula Passage',
    category: '初期启程',
    desc: '连结一线天森林与如蜜的狭间岩洞与峡谷山道，穿越岩隙即可步入如蜜海滨。',
    color: [0.1, 0.3, 0.1],
    bounds: { min: [-170.65, 12.18, -213.51], max: [-58.82, 50.69, -71.99] },
    center: [-114.74, 31.43, -142.75],
    triangles: 106810,
    vertices: 192619
  },
  {
    id: 'm10_10',
    name: '巨人陨落之森',
    enName: 'Forest of Fallen Giants',
    category: '初期启程',
    desc: '昔日王国对抗巨人的残酷战场要塞，古老的城壁与枯石。',
    color: [0.3, 0.1, 0.3],
    bounds: { min: [-286.34, -80.16, -125.73], max: [-72.35, 29.7, 222.63] },
    center: [-179.35, -25.23, 48.45],
    triangles: 234381,
    vertices: 273768
  },
  {
    id: 'm10_30',
    name: '海德巨火塔',
    enName: 'Heide\'s Tower of Flame',
    category: '海德与密港',
    desc: '沉入碧海中的巍峨巨塔与古老骑士之殿，遗存昔日诸神风貌。',
    color: [0.3, 0.3, 0.3],
    bounds: { min: [318.77, -87.06, -46.07], max: [420.45, -3.84, 24.98] },
    center: [369.61, -45.45, -10.54],
    triangles: 109588,
    vertices: 286062
  },
  {
    id: 'm10_31',
    name: '海德巨火塔 · 青之圣堂',
    enName: 'Cathedral of Blue',
    category: '海德与密港',
    desc: '青之圣堂与巨火塔相连的殿堂群，青之骑士守护之地。',
    color: [0.3, 0.1, 0.3],
    bounds: { min: [-6.7, -69.4, -308.81], max: [361.57, 75.78, 41.23] },
    center: [177.43, 3.19, -133.79],
    triangles: 296239,
    vertices: 530908
  },
  {
    id: 'm10_18',
    name: '密港',
    enName: 'No-man\'s Wharf',
    category: '海德与密港',
    desc: '幽暗潮湿的海蚀洞窟流浪海盗港口，停泊着幽灵船只。',
    color: [0.3, 0.0, 0.0],
    bounds: { min: [416.35, -88.62, -109.09], max: [570.41, -8.93, 44.93] },
    center: [493.38, -48.78, -32.08],
    triangles: 225679,
    vertices: 376775
  },
  {
    id: 'm10_16',
    name: '遗忘牢笼 · 罪人塔 · 月之钟楼',
    enName: 'The Lost Bastille, Sinners\' Rise & Belfry Luna',
    category: '遗忘牢笼路线',
    desc: '隔绝怒海的孤岛巨囚禁所，月之钟楼与罪人塔高耸于暗海之上。',
    color: [0.3, 0.1, 0.3],
    bounds: { min: [444.38, -140.82, -269.95], max: [686.43, 91.18, 75.27] },
    center: [565.41, -24.82, -97.34],
    triangles: 270255,
    vertices: 210880
  },
  {
    id: 'm10_23',
    name: '狩猎森林 · 不死刑场',
    enName: 'Huntsman\'s Copse & Undead Purgatory',
    category: '熔铁城路线',
    desc: '昔日王侯猎捕不死人的阴暗荒林，吊桥连接着不死刑场。',
    color: [0.3, 0.1, 0.1],
    bounds: { min: [-139.13, -21.79, -608.09], max: [279.47, 111.56, -103.55] },
    center: [70.17, 44.88, -355.82],
    triangles: 274965,
    vertices: 415157
  },
  {
    id: 'm10_17',
    name: '流油谷 · 堆土塔',
    enName: 'Harvest Valley & Earthen Peak',
    category: '熔铁城路线',
    desc: '弥漫浓郁毒雾的矿坑流油谷，与巨大风车耸立的堆土塔要塞。',
    color: [0.3, 0.0, 0.0],
    bounds: { min: [251.94, 7.56, -630.39], max: [862.55, 176.53, -375.89] },
    center: [557.24, 92.05, -503.14],
    triangles: 151399,
    vertices: 283590
  },
  {
    id: 'm10_19',
    name: '熔铁城 · 阳之钟楼',
    enName: 'Iron Keep & Belfry Sol',
    category: '熔铁城路线',
    desc: '因重负沉入熔岩深处的雄伟铁铸城堡，铁之古王覆灭之地。',
    color: [0.1, 0.1, 0.3],
    bounds: { min: [413.25, 135.6, -848.54], max: [855.44, 287.89, -318.67] },
    center: [634.34, 211.74, -583.6],
    triangles: 210754,
    vertices: 341933
  },
  {
    id: 'm10_34',
    name: '圣人墓地',
    enName: 'Grave of Saints',
    category: '废渊与圣人墓地',
    desc: '如蜜大坑底部的湿润墓窟，鼠王契约者聚集之地。',
    color: [0.3, 0.1, 0.3],
    bounds: { min: [-127.87, -121.52, -184.08], max: [140.35, -17.86, -61.4] },
    center: [6.24, -69.69, -122.74],
    triangles: 134665,
    vertices: 340853
  },
  {
    id: 'm10_25',
    name: '废渊 · 黑溪谷',
    enName: 'The Gutter & Black Gulch',
    category: '废渊与圣人墓地',
    desc: '不见天日的层叠弃置木构深渊，深处是流淌毒液的翡翠黑溪谷。',
    color: [0.1, 0.3, 0.3],
    bounds: { min: [-160.93, -385.79, -298.4], max: [24.47, -85.82, -15.83] },
    center: [-68.23, -235.8, -157.12],
    triangles: 176859,
    vertices: 250827
  },
  {
    id: 'm10_32',
    name: '虚影森林 · 冬之庙',
    enName: 'Shaded Woods & Shrine of Winter',
    category: '虚影与辉石镇',
    desc: '被迷雾与石化诅咒笼罩的废墟森林，通往冬之庙的大门。',
    color: [0.1, 0.1, 0.3],
    bounds: { min: [-361.94, -101.73, -512.46], max: [-20.6, 118.02, -177.56] },
    center: [-191.27, 8.14, -345.01],
    triangles: 309938,
    vertices: 303206
  },
  {
    id: 'm10_33',
    name: '法洛斯门径',
    enName: 'Doors of Pharros',
    category: '虚影与辉石镇',
    desc: '遍布法洛斯机关水池的地下巨殿，连接迷雾森林与辉石镇。',
    color: [0.3, 0.1, 0.3],
    bounds: { min: [-306.15, 90.22, -676.12], max: [-71.76, 170.14, -466.0] },
    center: [-188.95, 130.18, -571.06],
    triangles: 124634,
    vertices: 345777
  },
  {
    id: 'm10_14',
    name: '辉石镇盖多勒 · 领主私室',
    enName: 'Brightstone Cove Tseldora & Lord\'s Private Chamber',
    category: '虚影与辉石镇',
    desc: '依傍巨大流沙峡谷而建的开采聚落，公爵私室与蜘蛛盘踞之地。',
    color: [0.3, 0.0, 0.1],
    bounds: { min: [-228.99, -27.17, -748.04], max: [109.98, 205.96, -465.85] },
    center: [-59.51, 89.4, -606.95],
    triangles: 198071,
    vertices: 195023
  },
  {
    id: 'm20_21',
    name: '多兰古雷格王城 · 国王回廊 · 渴望王座',
    enName: 'Drangleic Castle, King\'s Passage & Throne of Want',
    category: '多兰古雷格与深处',
    desc: '多兰古雷格王国的权力中心，宏伟冷峻的黑石城堡与渴望王座。',
    color: [0.3, 0.1, 0.1],
    bounds: { min: [-431.29, -107.27, -789.65], max: [-179.58, 237.73, -231.09] },
    center: [-305.44, 65.23, -510.37],
    triangles: 212695,
    vertices: 440363
  },
  {
    id: 'm20_11',
    name: '阿玛纳祭坛',
    enName: 'Shrine of Amana',
    category: '多兰古雷格与深处',
    desc: '水光潋滟却暗藏深渊杀机的地下湖泊圣所，米勒法妮托之歌回荡。',
    color: [0.3, 0.0, 0.1],
    bounds: { min: [-484.78, -192.84, -1183.44], max: [-58.74, 74.17, -679.79] },
    center: [-271.76, -59.33, -931.62],
    triangles: 210066,
    vertices: 403572
  },
  {
    id: 'm20_24',
    name: '不死灵庙',
    enName: 'Undead Crypt',
    category: '多兰古雷格与深处',
    desc: '沉睡于暗黑尽头的安息之所，凡克拉德王漫步的终末长廊。',
    color: [0.3, 0.1, 0.1],
    bounds: { min: [-252.2, -232.72, -1174.21], max: [45.38, -55.58, -830.52] },
    center: [-103.41, -144.15, -1002.37],
    triangles: 250406,
    vertices: 636980
  },
  {
    id: 'm10_15',
    name: '安第尔之馆',
    enName: 'Aldia\'s Keep',
    category: '安第尔与巨龙圣域',
    desc: '安第尔探求不朽真理的隐秘研究所，陈列着巨龙骸骨与异形造物。',
    color: [0.3, 0.0, 0.0],
    bounds: { min: [-365.51, -237.83, -863.63], max: [-185.39, 250.57, -330.08] },
    center: [-275.45, 6.37, -596.86],
    triangles: 198980,
    vertices: 358397
  },
  {
    id: 'm10_27',
    name: '卫龙巢穴 · 龙祭坛',
    enName: 'Dragon Aerie & Dragon Shrine',
    category: '安第尔与巨龙圣域',
    desc: '凌驾于云海孤峰之上的飞龙聚所，尽头是古龙静候的宏伟祭坛。',
    color: [0.1, 0.3, 0.3],
    bounds: { min: [-794.23, 217.99, -991.93], max: [-226.65, 423.71, -782.34] },
    center: [-510.44, 320.85, -887.13],
    triangles: 77793,
    vertices: 99540
  },
  {
    id: 'm20_10',
    name: '巨人回忆（瓦玛尔 / 奥罗 / 杰森）',
    enName: 'Memory of the Giants (Vammar, Orro, Jeigh)',
    category: '回忆与深渊',
    desc: '追寻灰雾核心进入的过去幻影，巨人战争攻城的浩劫记忆。',
    color: [0.3, 0.1, 0.3],
    bounds: { min: [-333.45, -53.61, -33.48], max: [-103.66, 12.25, 220.64] },
    center: [-218.56, -20.68, 93.58],
    triangles: 97739,
    vertices: 190730
  },
  {
    id: 'm20_26',
    name: '古龙回忆',
    enName: 'Dragon Memories',
    category: '回忆与深渊',
    desc: '凝视灰烬之湖巨龙尸骸所见的古老时代梦境。',
    color: [0.3, 0.3, 0.1],
    bounds: { min: [-176.0, -336.13, -176.08], max: [176.02, 24.54, 175.94] },
    center: [0.01, -155.8, -0.07],
    triangles: 33966,
    vertices: 19037
  },
  {
    id: 'm40_03',
    name: '暗潜古穴',
    enName: 'Dark Chasm of Old',
    category: '回忆与深渊',
    desc: '点亮三座古老火盆方能抵达的深渊领域，暗天使居所。',
    color: [0.3, 0.1, 0.1],
    bounds: { min: [207.34, -22.41, -1107.07], max: [370.68, 68.85, -872.56] },
    center: [289.01, 23.22, -989.82],
    triangles: 177718,
    vertices: 531962
  },
  {
    id: "m50_35",
    name: "圣壁之都萨尔瓦 · 龙之圣壁",
    enName: "Shulva, Sanctum City & Dragon's Sanctum",
    category: "失落王冠 DLC",
    desc: "沉眠于深邃地底的古老水上圣壁之都，沉睡之龙辛与毒雾的死寂祭坛。",
    color: [0.12, 0.32, 0.22],
    bounds: { min: [-51.33, -83.57, -218.69], max: [177.93, 106.02, 85.11] },
    center: [63.3, 11.22, -66.79],
    triangles: 93949,
    vertices: 112105
  },
  {
    id: "m50_36",
    name: "黑雾之塔 · 铁之回廊",
    enName: "Brume Tower & Iron Passage",
    category: "失落王冠 DLC",
    desc: "被厚重灰烬与黑雾吞噬的熔铁巨塔，烟之骑士与铁之古王余烬沉沦之所。",
    color: [0.35, 0.16, 0.1],
    bounds: { min: [-255.3, -23.94, 353.47], max: [-60.73, 208.98, 525.7] },
    center: [-158.02, 92.52, 439.58],
    triangles: 205957,
    vertices: 322391
  },
  {
    id: "m50_37",
    name: "埃斯・洛耶斯 · 主神殿 · 壁外雪原",
    enName: "Frozen Eleum Loyce & Frigid Outskirts",
    category: "失落王冠 DLC",
    desc: "白霜封冻的宏伟北境神殿之城，暴风雪咆哮的壁外雪原与混沌余烬。",
    color: [0.18, 0.26, 0.38],
    bounds: { min: [-325.93, -221.28, -951.8], max: [1034.82, 126.69, 161.46] },
    center: [354.45, -47.29, -395.17],
    triangles: 105275,
    vertices: 116626
  },
];

const SPAWN_POINTS = spawnPoints as unknown as Record<string, [number, number, number]>;
const DLC_MAP_IDS = new Set<string>(['m50_35', 'm50_36', 'm50_37']);

export const MAPS: MapDefinition[] = MAP_CATALOG.map((map) => {
  const spawnWalk = SPAWN_POINTS[map.id];
  if (!spawnWalk) throw new Error(`Missing spawn point for ${map.id}`);
  const spawnFly: [number, number, number] = [
    spawnWalk[0],
    Number((spawnWalk[1] + 3).toFixed(2)),
    spawnWalk[2],
  ];
  return { ...map, isDlc: DLC_MAP_IDS.has(map.id), spawnWalk, spawnFly };
});

export const MAP_DICT = new Map(MAPS.map((m) => [m.id, m]));

export function searchMaps(keyword: string): MapDefinition[] {
  const query = keyword.trim().toLowerCase();
  if (!query) return MAPS;
  return MAPS.filter(
    (m) =>
      m.name.toLowerCase().includes(query) ||
      m.enName.toLowerCase().includes(query) ||
      m.category.toLowerCase().includes(query) ||
      (m.isDlc ? 'dlc' : '').includes(query) ||
      m.desc.toLowerCase().includes(query) ||
      m.id.toLowerCase().includes(query)
  );
}

