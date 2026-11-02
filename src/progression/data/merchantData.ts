import { MerchantNPC, MerchantItem, MerchantItemCategory } from '../types/souls';

export const MERCHANT_CATEGORY_CONFIG: Record<MerchantItemCategory, { label: string; badgeColor: string }> = {
  magic: { label: '魔法', badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-600/60' },
  miracle: { label: '奇迹', badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-600/60' },
  pyromancy: { label: '咒术', badgeColor: 'bg-red-950/80 text-red-300 border-red-600/60' },
  hex: { label: '暗术', badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-600/60' },
  weapon_shield: { label: '武器/盾牌', badgeColor: 'bg-stone-800 text-stone-200 border-stone-600' },
  armor: { label: '防具/套装', badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-600/60' },
  ring: { label: '戒指', badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-600/60' },
  key_item: { label: '关键道具', badgeColor: 'bg-yellow-950/80 text-yellow-300 border-yellow-600/60' },
  consumable: { label: '消耗品/素材', badgeColor: 'bg-stone-900 text-stone-400 border-stone-700' },
};

export const DRANGLEIC_MERCHANTS: MerchantNPC[] = [
  {
    id: 'hag_melentia',
    name: '行商老妪 玛伦提雅',
    title: '拾荒流浪商人',
    locationMapId: 'majula',
    locationName: '如蜜 (初始在巨人陨落之森主塔)',
    role: 'merchant',
    roleLabel: '杂货与道具商',
    description: '背着沉重包裹的老行商。初见于巨人陨落之森主塔篝火旁，击败最后巨人并对话耗尽后移居如蜜大坑旁。死去的NPC装备也会出现在她的货架上。',
    condition: '在巨森主塔对话耗尽，击杀最后巨人后搬迁至如蜜篝火旁',
    items: [
      {
        id: 'mel_key',
        name: '雷尼加尔钥匙',
        nameEn: 'Lenigrast\'s Key',
        category: 'key_item',
        price: '1,000 魂',
        quantity: '1',
        isKeyMustBuy: true,
        notes: '【必买】开启如蜜铁匠雷尼加尔工房大门的唯一钥匙，开启后铁匠才能为你强化修理装备！'
      },
      {
        id: 'mel_branch',
        name: '怀念香木',
        nameEn: 'Fragrant Branch of Yore',
        category: 'key_item',
        price: '12,000 魂',
        quantity: '1',
        isKeyMustBuy: true,
        notes: '【关键道具】原罪学者版特有进货！用于解除各地石化NPC或石化挡路活尸，解救法师与重要关卡必备。'
      },
      {
        id: 'mel_lockstone',
        name: '法老之石',
        nameEn: 'Pharros\' Lockstone',
        category: 'key_item',
        price: '4,000 魂',
        quantity: '1',
        notes: '启动法老石机关，解开隐藏宝物、密室或启动古老陷阱。'
      },
      {
        id: 'mel_lifegem',
        name: '滴石',
        nameEn: 'Lifegem',
        category: 'consumable',
        price: '300 魂',
        quantity: '迁往如蜜后无限',
        notes: '前期推图恢复血量的主力药丸，迁往如蜜后不限数量，建议随时备满99个。'
      },
      {
        id: 'mel_effigy',
        name: '人像',
        nameEn: 'Human Effigy',
        category: 'consumable',
        price: '1,500 魂',
        quantity: '5个',
        notes: '捏碎解除游魂活尸化，恢复生命上限并允许召唤白灵玩家与金灵NPC。'
      },
      {
        id: 'mel_brightbug',
        name: '光虫',
        nameEn: 'Brightbug',
        category: 'consumable',
        price: '6,000 - 48,000 魂 (击杀四巨魂随阶段翻倍涨价)',
        quantity: '每阶段限购3只',
        notes: '击败始源四巨魂与特定主线阶段后刷新货源。使用后全攻击力+20%、受伤害减免20%，单挑高难Boss终极buff！'
      },
      {
        id: 'mel_club',
        name: '棍棒 (木棒)',
        nameEn: 'Club',
        category: 'weapon_shield',
        price: '800 魂',
        quantity: '无限',
        requirement: '力气 12 / 敏捷 3',
        notes: '【打击流开荒神器】纯力量S补正，对付重甲敌人与茫然卫兵有极大克制加成。'
      },
      {
        id: 'mel_firebomb',
        name: '火壶',
        nameEn: 'Firebomb',
        category: 'consumable',
        price: '200 魂',
        quantity: '无限',
        notes: '可用于投掷引爆主塔火药桶炸开捷径墙壁！'
      }
    ]
  },
  {
    id: 'blacksmith_lenigrast',
    name: '铁匠 雷尼加尔',
    title: '如蜜驻留铁匠',
    locationMapId: 'majula',
    locationName: '如蜜 (铁匠工房)',
    role: 'blacksmith',
    roleLabel: '武器锻造师',
    description: '半活尸化的老铁匠，被锁在自家工房门外。使用老妪出售的钥匙开门后入驻，提供基础武器防具强化、维修以及早期极其实用的神器武器。',
    condition: '从巨森老妪购买雷尼加尔钥匙（1000魂），打开如蜜工房并刷新区域',
    items: [
      {
        id: 'leni_rapier',
        name: '细剑 (刺剑)',
        nameEn: 'Rapier',
        category: 'weapon_shield',
        price: '1,000 魂',
        quantity: '无限',
        requirement: '力气 5 / 敏捷 12',
        isKeyMustBuy: true,
        notes: '【全游戏最强PVE开荒神器】反击倍率极高，配合狮子戒指与附魔戳怪融化Boss！'
      },
      {
        id: 'leni_estoc',
        name: '刺剑 (破甲重刺剑)',
        nameEn: 'Estoc',
        category: 'weapon_shield',
        price: '1,500 魂',
        quantity: '无限',
        requirement: '力气 12 / 敏捷 12',
        notes: '自带重击横扫破盾效果，攻击距离比普通刺剑更远。'
      },
      {
        id: 'leni_battle_axe',
        name: '战斧',
        nameEn: 'Battle Axe',
        category: 'weapon_shield',
        price: '1,500 魂',
        quantity: '无限',
        requirement: '力气 15 / 敏捷 8',
        notes: '高削韧与强力单手横挥，前期对付多群狗与铠甲骑士效果优异。'
      },
      {
        id: 'leni_mace',
        name: '矛锤',
        nameEn: 'Mace',
        category: 'weapon_shield',
        price: '1,200 魂',
        quantity: '无限',
        requirement: '力气 12 / 敏捷 5',
        notes: '【打击神器】圣职开荒同款强力矛锤，纯力量打击加成，前期敲重甲古骑士与卫兵极为强悍！'
      },
      {
        id: 'leni_titanite_shard',
        name: '楔形石碎片',
        nameEn: 'Titanite Shard',
        category: 'consumable',
        price: '800 魂',
        quantity: '10个',
        notes: '用于将常规武器防具强化至+3的基础强化石。'
      },
      {
        id: 'leni_hammer_reward',
        name: '铁匠之锤 (对话赠送)',
        nameEn: 'Blacksmith\'s Hammer',
        category: 'weapon_shield',
        price: '0 (累计消费8000魂后对话)',
        quantity: '1',
        notes: '累计在他这里消费8000魂强化维修后对话获赠，极其强力的早期单手打击神锤！'
      }
    ]
  },
  {
    id: 'sorcerer_carhillion',
    name: '魔导师 卡莉希欧',
    title: '梅尔菲亚魔法学者',
    locationMapId: 'no_mans_wharf',
    locationName: '密港栈桥 (击败密港Boss后移居如蜜)',
    role: 'sorcerer',
    roleLabel: '法术导师',
    description: '傲慢而技艺精湛的魔法大师，坐在密港最深处港湾栈桥旁。对缺乏智力的人不屑一顾。智力达到8点以上才会与玩家对话并传授法术，击败放逐佣兵后搬迁至如蜜树下。',
    condition: '角色智力(INT)必须达到 8 点或以上！否则拒绝交谈',
    items: [
      {
        id: 'car_yearn',
        name: '思乡',
        nameEn: 'Yearn',
        category: 'magic',
        price: '3,000 魂',
        quantity: '初始1个，开启冬之庙后无限',
        requirement: '智力 19 / 记忆格 1',
        isKeyMustBuy: true,
        notes: '【全游戏跑图断层第一神技】发射吸引敌人的诱饵光球，全图90%活尸怪物都会丢下玩家疯狂攻击光球，推图跑酷犹如无人之境！'
      },
      {
        id: 'car_soul_arrow',
        name: '灵魂箭',
        nameEn: 'Soul Arrow',
        category: 'magic',
        price: '1,500 魂',
        quantity: '初始1个，开启冬之庙后无限',
        requirement: '智力 10 / 记忆格 1',
        notes: '基础法系远程弹药，次数充沛(30发)。'
      },
      {
        id: 'car_great_soul_arrow',
        name: '强力灵魂箭',
        nameEn: 'Great Soul Arrow',
        category: 'magic',
        price: '3,000 魂',
        quantity: '初始1个，开启冬之庙后无限',
        requirement: '智力 14 / 记忆格 1',
        notes: '速度与伤害平衡优秀的法术主力输出。'
      },
      {
        id: 'car_heavy_soul_arrow',
        name: '灵魂巨箭',
        nameEn: 'Heavy Soul Arrow',
        category: 'magic',
        price: '2,000 魂',
        quantity: '初始1个，开启冬之庙后无限',
        requirement: '智力 12 / 记忆格 1',
        notes: '较长咏唱时间换取更高单发伤害。'
      },
      {
        id: 'car_great_heavy_soul_arrow',
        name: '强力灵魂巨箭',
        nameEn: 'Great Heavy Soul Arrow',
        category: 'magic',
        price: '4,500 魂',
        quantity: '初始1个，开启冬之庙后无限',
        requirement: '智力 16 / 记忆格 1',
        notes: '前期对单体Boss最高单发纯魔法伤害。'
      },
      {
        id: 'car_magic_weapon',
        name: '法术武器',
        nameEn: 'Magic Weapon',
        category: 'magic',
        price: '2,000 魂',
        quantity: '初始1个，开启冬之庙后无限',
        requirement: '智力 10 / 记忆格 1',
        notes: '法系初期核心的武器魔力附魔，为右手近战武器附加法术伤害！'
      },
      {
        id: 'car_soul_barrage',
        name: '乱射灵魂枪',
        nameEn: 'Soul Spear Barrage',
        category: 'magic',
        price: '2,600 魂',
        quantity: '初始1个，开启冬之庙后无限',
        requirement: '智力 17 / 记忆格 1',
        notes: '横向扇面射出多发密集灵魂弹，对大型Boss与群怪有极佳的近身爆发。'
      },
      {
        id: 'car_clear_bluestone_ring',
        name: '清澄苍石戒指',
        nameEn: 'Clear Bluestone Ring',
        category: 'ring',
        price: '2,000 魂',
        quantity: '1',
        notes: '缩短法术、奇迹、咒术与暗术的咏唱前摇时间，法师必备。'
      },
      {
        id: 'car_northern_ritual_band',
        name: '北灵庙戒指 (高智力赠送)',
        nameEn: 'Northern Ritual Band +1',
        category: 'ring',
        price: '0 (智力达到30后对话)',
        quantity: '1',
        notes: '降低生命上限但大幅增加法术使用次数。'
      }
    ]
  },
  {
    id: 'pyromancer_rosabeth',
    name: '咒术少女 罗莎贝娜',
    title: '来自梅尔菲亚的咒术学徒',
    locationMapId: 'majula',
    locationName: '如蜜入口 (初见于虚影森林入口大门)',
    role: 'pyromancer',
    roleLabel: '咒术导师与强化',
    description: '卡莉希欧的崇拜者与咒术师。被石化在通往虚影森林的机关拉杆前。解石化后需要给她任意一件衣服，她便会迁至如蜜篝火旁，提供全系咒术购买并强化咒术之火。',
    condition: '需消耗1支【怀念香木】解除石化，并赠予任意衣服一件',
    items: [
      {
        id: 'rosa_upgrade_fire',
        name: '强化咒术之火',
        nameEn: 'Upgrade Pyromancy Flame',
        category: 'key_item',
        price: '消耗火种子与灵魂',
        quantity: '强化至+10',
        isKeyMustBuy: true,
        notes: '使用火种子与灵魂强化至+10；罗莎贝娜和卡莉昂均可强化。'
      },
      {
        id: 'rosa_fireball',
        name: '火球',
        nameEn: 'Fireball',
        category: 'pyromancy',
        price: '1,200 魂',
        quantity: '1',
        requirement: '无属性要求 / 记忆格 1',
        notes: '投掷基本燃烧火球，适合无智力信仰的近战战士挂备。'
      },
      {
        id: 'rosa_fire_orb',
        name: '火弹',
        nameEn: 'Fire Orb',
        category: 'pyromancy',
        price: '3,400 魂',
        quantity: '1',
        requirement: '无属性要求 / 记忆格 1',
        notes: '弹道更远、爆炸范围更大的升级火球。'
      },
      {
        id: 'rosa_combustion',
        name: '引燃烈火',
        nameEn: 'Combustion',
        category: 'pyromancy',
        price: '1,500 魂',
        quantity: '1',
        requirement: '无属性要求 / 记忆格 1',
        notes: '近距离瞬发烈焰喷涌，对近身偷袭敌人有极强打断力。'
      },
      {
        id: 'rosa_iron_flesh',
        name: '铁身躯',
        nameEn: 'Iron Flesh',
        category: 'pyromancy',
        price: '3,500 魂',
        quantity: '1',
        requirement: '无属性要求 / 记忆格 1',
        notes: '大幅强化全身物理防御力与各项异常抗性，但大幅增加重量与减慢移速，特定站撸换血神器。'
      },
      {
        id: 'rosa_poison_mist',
        name: '剧毒雾',
        nameEn: 'Poison Mist',
        category: 'pyromancy',
        price: '3,400 魂',
        quantity: '1',
        requirement: '无属性要求 / 记忆格 1',
        notes: '扩散一片剧毒烟雾，对大量高血量Boss(如双骑兵、罪人、古龙)可无视防御疯狂掉血！'
      },
      {
        id: 'rosa_flash_sweat',
        name: '剧烈出汗 (铁汗)',
        nameEn: 'Flash Sweat',
        category: 'pyromancy',
        price: '2,300 魂',
        quantity: '1',
        requirement: '无属性要求 / 记忆格 1',
        isKeyMustBuy: true,
        notes: '【熔铁城必备】提升火抗性300点！踩熔铁城岩浆捡宝箱和打熔铁恶魔的保命绝技！'
      },
      {
        id: 'rosa_fire_seed',
        name: '火种子',
        nameEn: 'Fire Seed',
        category: 'consumable',
        price: '8,000 魂',
        quantity: '3个',
        notes: '专用于提升咒术手套强度的珍贵素材。'
      }
    ]
  },
  {
    id: 'cleric_licia',
    name: '圣女 莉珊德拉 (琳德的莉丝)',
    title: '林德特的伪圣职',
    locationMapId: 'majula',
    locationName: '如蜜环形地下通道 (初见于海德巨火塔)',
    role: 'cleric',
    roleLabel: '奇迹修士',
    description: '身穿神圣修女服的传教女子。初见于海德巨火塔击败龙骑兵后的篝火旁，对话后迁往如蜜大坑与海德之间的地下通道。支付2000魂后可转动机关开启通往狩猎森林之路。',
    condition: '初见海德巨火塔篝火旁对话耗尽；支付2000魂转动机关',
    items: [
      {
        id: 'lic_lightning_spear',
        name: '雷枪',
        nameEn: 'Lightning Spear',
        category: 'miracle',
        price: '6,000 魂',
        quantity: '初始1个，开启冬之庙后无限',
        requirement: '信仰 22 / 记忆格 1',
        isKeyMustBuy: true,
        notes: '【信仰流核心输出】高雷电伤害贯穿投掷长枪，对水面敌人与重甲骑士伤害暴增。'
      },
      {
        id: 'lic_heal',
        name: '恢复',
        nameEn: 'Heal',
        category: 'miracle',
        price: '1,500 魂',
        quantity: '初始1个，开启冬之庙后无限',
        requirement: '信仰 12 / 记忆格 1',
        notes: '基本恢复自身生命，大幅节省推图原素瓶。'
      },
      {
        id: 'lic_med_heal',
        name: '中等恢复',
        nameEn: 'Med Heal',
        category: 'miracle',
        price: '3,000 魂',
        quantity: '初始1个，开启冬之庙后无限',
        requirement: '信仰 18 / 记忆格 1',
        notes: '中量恢复生命，性价比极高。'
      },
      {
        id: 'lic_great_heal_excerpt',
        name: '缩约大恢复',
        nameEn: 'Great Heal Excerpt',
        category: 'miracle',
        price: '4,500 魂',
        quantity: '初始1个，开启冬之庙后无限',
        requirement: '信仰 14 / 记忆格 1',
        notes: '虽次数较少(1发)但单次回复量极大，前期挑战高难Boss极佳救命奇迹！'
      },
      {
        id: 'lic_replenishment',
        name: '生命力涌现',
        nameEn: 'Replenishment',
        category: 'miracle',
        price: '3,000 魂',
        quantity: '初始1个，开启冬之庙后无限',
        requirement: '信仰 16 / 记忆格 1',
        notes: '缓慢持续恢复生命值，推图节省药丸的优秀辅助奇迹。'
      },
      {
        id: 'lic_force',
        name: '原力',
        nameEn: 'Force',
        category: 'miracle',
        price: '1,800 魂',
        quantity: '初始1个，开启冬之庙后无限',
        requirement: '信仰 12 / 记忆格 1',
        notes: '以自身为中心爆发冲击波，可将悬崖边的敌人或入侵红灵直接震落悬崖秒杀！'
      },
      {
        id: 'lic_guidance',
        name: '导引之语 (引路天音)',
        nameEn: 'Guidance',
        category: 'miracle',
        price: '3,700 魂',
        quantity: '初始1个，开启冬之庙后无限',
        requirement: '信仰 12 / 记忆格 1',
        notes: '揭示原本隐藏的建言与隐藏的召募金印。'
      },
      {
        id: 'lic_ring_prayer',
        name: '祈祷戒指 (高信仰赠送)',
        nameEn: 'Ring of Prayer',
        category: 'ring',
        price: '0 (信仰达到30后对话)',
        quantity: '1',
        notes: '直接提升佩戴者5点信仰值。'
      }
    ]
  },
  {
    id: 'hexer_felkin',
    name: '暗术师 菲尔金',
    title: '逃离象牙塔的流浪暗术士',
    locationMapId: 'huntsmans_copse',
    locationName: '狩猎森林入口 (如蜜往狩猎森林阴暗通道)',
    role: 'hexer',
    roleLabel: '暗术导师',
    description: '孤坐在狩猎森林通道椅子上的暗术研究者。只有当玩家智力与信仰均达到8点或以上时才会搭理；当智力与信仰双双达到20点时，更会赠予魂2全期毕业级暗术神杖【日暮之杖】与日暮套装！',
    condition: '玩家智力(INT)与信仰(FTH)均需达到 8 点或以上！',
    items: [
      {
        id: 'fel_dark_orb',
        name: '暗珠',
        nameEn: 'Dark Orb',
        category: 'hex',
        price: '600 魂',
        quantity: '1',
        requirement: '智力 12 / 信仰 10 / 记忆格 1',
        isKeyMustBuy: true,
        notes: '【魂2最强推图连发输出神技】20发高威力、施法次数充足、自带极强削韧与击退硬直，配合暗之日暮之杖三颗暗珠秒杀大多数小怪！'
      },
      {
        id: 'fel_dark_weapon',
        name: '暗黑武器',
        nameEn: 'Dark Weapon',
        category: 'hex',
        price: '2,700 魂',
        quantity: '1',
        requirement: '智力 16 / 信仰 14 / 记忆格 1',
        isKeyMustBuy: true,
        notes: '【性价比最高的附魔】极低属性要求获得50点暗基础面板+30%暗伤提升，4发高持久，暗变质刺剑通关标配！'
      },
      {
        id: 'fel_resonant_soul',
        name: '灵魂共鸣',
        nameEn: 'Resonant Soul',
        category: 'hex',
        price: '1,100 魂',
        quantity: '1',
        requirement: '智力 10 / 信仰 18 / 消耗100魂施放',
        notes: '消耗微量灵魂发射强力暗影能量球，初期暗术流成型最快的高伤害法术！'
      },
      {
        id: 'fel_great_resonant_soul',
        name: '强烈灵魂共鸣',
        nameEn: 'Great Resonant Soul',
        category: 'hex',
        price: '3,400 魂',
        quantity: '1',
        requirement: '智力 13 / 信仰 26 / 消耗500魂施放',
        isKeyMustBuy: true,
        notes: '【暗术终极爆发炮】消耗500灵魂造成毁天灭地的纯暗属性打击，前期Boss血条瞬间融化！'
      },
      {
        id: 'fel_resonant_weapon',
        name: '共鸣武器',
        nameEn: 'Resonant Weapon',
        category: 'hex',
        price: '4,000 魂',
        quantity: '1',
        requirement: '智力 15 / 信仰 24 / 消耗2000魂施放',
        notes: '消耗灵魂大幅提高武器暗属性加成。'
      },
      {
        id: 'fel_sunset_staff',
        name: '日暮之杖 + 日暮套装 (双20属性赠送)',
        nameEn: 'Sunset Staff & Hexer Set',
        category: 'weapon_shield',
        price: '0 (智力20且信仰20对话赠送)',
        quantity: '1',
        requirement: '智力 22 / 信仰 18',
        isKeyMustBuy: true,
        notes: '【暗术终极毕业神杖】暗变质+5后拥有全游戏最高暗补正(S)与基础暗伤害！兜帽增加施法次数。'
      },
      {
        id: 'fel_archdrake_staff',
        name: '古龙院之杖',
        nameEn: 'Archdrake Staff',
        category: 'weapon_shield',
        price: '4,000 魂',
        quantity: '1',
        requirement: '智力 15 / 信仰 15',
        notes: '早期过渡兼顾魔法与暗术的手杖。'
      }
    ]
  },
  {
    id: 'straid_olaphis',
    name: '孤高法师 史垂德 (史崽子)',
    title: '奥拉菲斯的古代魔导士',
    locationMapId: 'lost_bastille',
    locationName: '遗忘囚笼 (顶层牢房篝火前)',
    role: 'transposition',
    roleLabel: 'Boss魂炼金 & 古代法术',
    description: '被石化堵在牢房篝火前的古代奥拉菲斯宫廷法师。性格极其傲慢，嘲弄当世魔法落后。解石化后可在此将前期击败的各大Boss灵魂兑换为顶级武器或独有法术！兑换4个Boss魂后赠送黑衣法师全套防具。',
    condition: '需使用【怀念香木】解除其石化状态',
    items: [
      {
        id: 'str_warped_sword',
        name: '扭曲之刃',
        nameEn: 'Warped Sword',
        category: 'weapon_shield',
        price: '密港Boss【放逐佣兵的灵魂】 + 1,500 魂',
        quantity: '1',
        requirement: '力气 15 / 敏捷 25',
        isBossTransposition: true,
        isKeyMustBuy: true,
        notes: '【全魂2最强PVP/PVE单手曲剑之一】极高反击伤害，独特的特殊跑戳与大风车战技！'
      },
      {
        id: 'str_dragonrider_bow',
        name: '龙骑兵弓',
        nameEn: 'Dragonrider Bow',
        category: 'weapon_shield',
        price: '海德巨火塔Boss【龙骑兵的灵魂】 + 1,500 魂',
        quantity: '1',
        requirement: '力气 20 / 敏捷 18',
        isBossTransposition: true,
        notes: '自带高额魔法伤害的重装大杀伤战弓，射速与伤害比极佳。'
      },
      {
        id: 'str_dragonrider_halberd',
        name: '龙骑兵戟',
        nameEn: 'Dragonrider Halberd',
        category: 'weapon_shield',
        price: '【龙骑兵的灵魂】 + 1,500 魂',
        quantity: '1',
        requirement: '力气 18 / 敏捷 17',
        isBossTransposition: true,
        notes: '高打击面与魔力混伤戟。'
      },
      {
        id: 'str_sunlight_spear',
        name: '巨雷枪',
        nameEn: 'Great Lightning Spear',
        category: 'miracle',
        price: '13,000 魂',
        quantity: '1',
        requirement: '信仰 42 / 记忆格 1',
        notes: '高阶圣职必带的暴击雷电枪。'
      },
      {
        id: 'str_soul_spear',
        name: '灵魂结晶枪',
        nameEn: 'Crystal Soul Spear',
        category: 'magic',
        price: '辉石镇Boss【远古白龙的灵魂 (添火击杀弗蕾札)】 + 10,000 魂',
        quantity: '无限',
        requirement: '智力 53 / 记忆格 2',
        isBossTransposition: true,
        isKeyMustBuy: true,
        notes: '【法爷最强爆发长枪】威力大幅超越常规灵魂枪，贯穿整排敌人，法系封神必备！'
      },
      {
        id: 'str_flame_weapon',
        name: '咒术：附火焰武器',
        nameEn: 'Flame Weapon',
        category: 'pyromancy',
        price: '遗忘囚笼Boss【远古魔女的灵魂 (添火击杀罪人)】 + 10,000 魂',
        quantity: '无限',
        requirement: '无属性要求 / 记忆格 1',
        isBossTransposition: true,
        notes: '纯战神也可随意施放的火属性武器增伤附魔。'
      },
      {
        id: 'str_dark_fog',
        name: '暗毒雾',
        nameEn: 'Dark Fog',
        category: 'hex',
        price: '5,200 魂',
        quantity: '1',
        requirement: '智力 25 / 信仰 14 / 记忆格 1',
        notes: '大范围暗属性剧毒云雾，中毒速度极快，高血量Boss掉血神器！'
      },
      {
        id: 'str_sunlight_blade',
        name: '阳光之剑',
        nameEn: 'Sunlight Blade',
        category: 'miracle',
        price: '12,400 魂',
        quantity: '1',
        requirement: '信仰 36 / 记忆格 1',
        isKeyMustBuy: true,
        notes: '【信仰流顶级雷附魔】为右手武器附加巨额雷电属性伤害，雷变质武器附魔伤害爆炸！'
      },
      {
        id: 'str_black_set',
        name: '黑衣法师全套 + 黑衣兜帽 (兑换4个Boss魂后赠送)',
        nameEn: 'Black Hood & Black Set',
        category: 'armor',
        price: '0 (兑换任意4个Boss魂后对话)',
        quantity: '1',
        requirement: '智力 16 / 信仰 16',
        isKeyMustBuy: true,
        notes: '【法系神器头盔】黑衣兜帽直接增加+2智力与+2信仰，并大幅提升施法速度！'
      }
    ]
  },
  {
    id: 'weaponsmith_ornifex',
    name: '鸟人铁匠 欧尼菲克斯 (欧尼佛斯)',
    title: '继承艾莲诺姆技术的异形锻造师',
    locationMapId: 'brightstone_cove_tseldora',
    locationName: '辉石镇采石场下层 (初见于虚影森林流沙洞)',
    role: 'transposition',
    roleLabel: '高阶Boss武器锻造',
    description: '人身乌鸦翅膀的鸟身女妖铁匠。初见被反锁在虚影森林流沙塌陷洞窟中(需用尖牙钥匙开门)，解救后返回辉石镇下层私人工房。她拥有远超凡人的灵魂重铸秘术，第一次制作Boss武器【完全免费】！',
    condition: '虚影森林石化狮子掉落【尖牙钥匙】，开洞救出后前往辉石镇下层',
    items: [
      {
        id: 'orni_free_first',
        name: '【首件免费】Boss灵魂武器打造',
        nameEn: 'Free First Transposition',
        category: 'key_item',
        price: '0 魂 (仅消耗首个Boss魂)',
        quantity: '仅限第1件',
        isKeyMustBuy: true,
        notes: '初次在辉石镇对话，她感激救命之恩，打造的第一把Boss神器无需支付灵魂！'
      },
      {
        id: 'orni_moonlight',
        name: '月光大剑',
        nameEn: 'Moonlight Greatsword',
        category: 'weapon_shield',
        price: '辉石镇Boss【白龙的灵魂 (添火击杀公爵夫人的白蜘蛛)】 + 10,000 魂',
        quantity: '1',
        requirement: '力气 18 / 敏捷 18 / 智力 18',
        isBossTransposition: true,
        isKeyMustBuy: true,
        notes: '【法师近战终极浪漫】纯法术魔力伤害大剑，重击发射毁灭月光剑气波！'
      },
      {
        id: 'orni_chaos_blade',
        name: '混沌之刃',
        nameEn: 'Chaos Blade',
        category: 'weapon_shield',
        price: '【古老魔女的灵魂】 + 10,000 魂',
        quantity: '1',
        requirement: '力气 12 / 敏捷 25',
        isBossTransposition: true,
        notes: '【全游戏最强反击刀】160%离谱反击倍率，虽然每次击中自损50点生命，但输出极度毁天灭地！'
      },
      {
        id: 'orni_crypt_blacksword',
        name: '不死灵庙黑剑 (特大剑 / 冰棒)',
        nameEn: 'Crypt Blacksword',
        category: 'weapon_shield',
        price: '不死灵庙Boss【腐败物添火掉落死者之王魂】 + 10,000 魂',
        quantity: '1',
        requirement: '力气 40 / 敏捷 10 / 智力 12 / 信仰 12',
        isBossTransposition: true,
        notes: '【暗变质一刀千伤】暗变质暗附魔后，一刀挥出破千输出的重装杀器！'
      },
      {
        id: 'orni_kings_ultra',
        name: '王者特大剑',
        nameEn: 'King\'s Ultra Greatsword',
        category: 'weapon_shield',
        price: '不死灵庙Boss【国王凡克拉德的灵魂】 + 10,000 魂',
        quantity: '1',
        requirement: '力气 50 / 敏捷 10',
        isBossTransposition: true,
        notes: '用凡克拉德灵魂铸造的石像纯打击特大剑，极强削韧压制力。'
      },
      {
        id: 'orni_dragonslayer_greatbow',
        name: '猎龙大弓',
        nameEn: 'Dragonslayer Greatbow',
        category: 'weapon_shield',
        price: '熔铁城Boss【古龙之魂 / 铁之古王魂】 + 10,000 魂',
        quantity: '1',
        requirement: '力气 30 / 敏捷 20',
        isBossTransposition: true,
        notes: '超远距离将重甲敌人一箭击飞轰下悬崖的战略重武器。'
      },
      {
        id: 'orni_arrows_infinite',
        name: '各类火焰箭 / 雷箭 / 毒箭 / 破坏大箭',
        nameEn: 'Elemental & Great Arrows',
        category: 'consumable',
        price: '60 - 180 魂',
        quantity: '无限',
        notes: '辉石镇下层工坊无限供应各种元素箭矢与大箭。'
      }
    ]
  },
  {
    id: 'blacksmith_mcduff',
    name: '牢不可破的麦道夫',
    title: '遗忘牢狱的质变大师',
    locationMapId: 'lost_bastille',
    locationName: '遗忘囚笼 (麦道夫工房)',
    role: 'blacksmith',
    roleLabel: '全属性质变大师',
    description: '蹲坐在宝箱上的老铁匠，嘴里念叨着「火啊，快给我将熄之火」。通过炸开牢房墙壁或使用守卫钥匙进入。只有将熔铁城拾取的【将熄余烬】交付给他后，他才会离开箱子开始为玩家进行全属性质变！',
    condition: '需交付熔铁城宝箱中的【将熄余烬】(Dull Ember)',
    items: [
      {
        id: 'mcduff_infusion_service',
        name: '武器装备全属性变质服务',
        nameEn: 'Full Weapon Infusion Service',
        category: 'key_item',
        price: '消耗各类变质石 + 2,000 魂',
        quantity: '无限',
        isKeyMustBuy: true,
        notes: '【魂2质变质跃】提供雷变质、火变质、暗变质、法术变质、粗制变质、中毒变质等服务！魂2变质+附魔伤害叠加极高！'
      },
      {
        id: 'mcduff_large_titanite',
        name: '大楔形石碎片',
        nameEn: 'Large Titanite Shard',
        category: 'consumable',
        price: '2,500 魂',
        quantity: '无限',
        notes: '强化武器从+3至+6不可或缺的重要素材，在此无限供应！'
      },
      {
        id: 'mcduff_titanite_shard',
        name: '楔形石碎片',
        nameEn: 'Titanite Shard',
        category: 'consumable',
        price: '800 魂',
        quantity: '10个',
        notes: '用于将常规武器防具强化至+3的基础强化石。'
      },
      {
        id: 'mcduff_uchigatana',
        name: '打刀',
        nameEn: 'Uchigatana',
        category: 'weapon_shield',
        price: '5,000 魂',
        quantity: '1 (移居后无限)',
        requirement: '力气 10 / 敏捷 16',
        notes: '敏捷流经典太刀，出手速度快、出血加成与削韧优良。'
      },
      {
        id: 'mcduff_craftsmans_hammer',
        name: '名匠金锤 (宝箱)',
        nameEn: 'Craftsman\'s Hammer',
        category: 'weapon_shield',
        price: '0 (交出将熄余烬后开他坐着的箱子)',
        quantity: '1',
        requirement: '力气 20 / 敏捷 10',
        isKeyMustBuy: true,
        notes: '【全游戏最强开荒锤之一】他起身后打开其原先坐着的宝箱即可拾取，反击率极高且打击属性暴击强悍！'
      }
    ]
  },
  {
    id: 'cat_shalquoir',
    name: '甜美猫咪 夏娜罗亚',
    title: '不朽的智慧古猫',
    locationMapId: 'majula',
    locationName: '如蜜 (右侧小屋)',
    role: 'merchant',
    roleLabel: '戒指与誓约指引',
    description: '趴在如蜜小木屋里会说人话的神秘猫咪。拥有不朽的身躯与看透世俗的慵懒态度。提供全大陆誓约等级查询与解除誓约，并售卖跳大坑必备的银猫戒指。',
    condition: '如蜜常驻NPC，绝不离开',
    items: [
      {
        id: 'cat_silvercat',
        name: '银猫戒指',
        nameEn: 'Silvercat Ring',
        category: 'ring',
        price: '13,400 魂',
        quantity: '1',
        isKeyMustBuy: true,
        notes: '【如蜜大坑与跳楼必备】大幅降低从高处跌落所受到的坠落伤害！不买它跳如蜜大坑必死无疑。'
      },
      {
        id: 'cat_redeye_ring',
        name: '红眼戒指',
        nameEn: 'Redeye Ring',
        category: 'ring',
        price: '6,700 魂',
        quantity: '1',
        notes: '佩戴后更容易吸引怪物仇恨，联机做T吸引Boss仇恨或当白灵保护世界主必备！'
      },
      {
        id: 'cat_name_engraved_ring',
        name: '刻名戒指',
        nameEn: 'Name-engraved Ring',
        category: 'ring',
        price: '5,500 魂',
        quantity: '1',
        isKeyMustBuy: true,
        notes: '【联机必备神器】选择对应神明名字后，大幅放宽联机灵魂记忆量匹配范围，好友开黑连线必备！'
      },
      {
        id: 'cat_evil_eye',
        name: '邪眼戒指',
        nameEn: 'Ring of the Evil Eye',
        category: 'ring',
        price: '4,500 魂',
        quantity: '1',
        notes: '每击杀一名敌人自动回复30点生命值，推图极佳续航。'
      },
      {
        id: 'cat_alluring_skull',
        name: '诱敌头骨 (诱引骸骨)',
        nameEn: 'Alluring Skull',
        category: 'consumable',
        price: '300 魂',
        quantity: '初始10个 / 冬之庙后无限',
        notes: '投掷后吸引周围活尸敌人注意，非智力法系流派聚怪跑图神器。'
      },
      {
        id: 'cat_prism_stone',
        name: '七色石',
        nameEn: 'Prism Stone',
        category: 'consumable',
        price: '300 魂',
        quantity: '初始10个 / 冬之庙后无限',
        notes: '丢下测量悬崖落差高度，若发出刺耳碎裂尖叫声说明跳下去必死。'
      }
    ]
  },
  {
    id: 'merchant_maughlin',
    name: '防具商人 玛夫穆兰',
    title: '沃尔肯的防具商',
    locationMapId: 'majula',
    locationName: '如蜜 (铁匠对面的两层石屋)',
    role: 'merchant',
    roleLabel: '防具与Boss套装商',
    description: '从遥远沃尔肯来到如蜜的胆怯商人。随着玩家在他这里累计消费灵魂，他会变得越来越富有且自傲，并进货更奢华的套装；当击败特定主线Boss后，更会在此出售Boss专属防具套装。',
    condition: '累计消费1,000魂进货一批；累计消费16,000魂后坐姿改变并进货亚瓦套装与极品Boss防具',
    items: [
      {
        id: 'mau_twin_dragon_shield',
        name: '双龙大盾',
        nameEn: 'Twin Dragon Greatshield',
        category: 'weapon_shield',
        price: '2,000 魂',
        quantity: '无限',
        requirement: '力气 20',
        notes: '仅需20点力量即可佩戴的早期最强大盾，拥有高达95%物理减伤与极高稳定性！'
      },
      {
        id: 'mau_elite_knight',
        name: '上级骑士套装',
        nameEn: 'Elite Knight Set',
        category: 'armor',
        price: '全套 11,600 魂 (散件2200-4000)',
        quantity: '1套',
        notes: '消费满1000魂后进货，魂系列经典传承外观与扎实物防。'
      },
      {
        id: 'mau_alva_set',
        name: '亚瓦套装 (流浪骑士)',
        nameEn: 'Alva Set',
        category: 'armor',
        price: '全套 26,300 魂 (散件5200-8000)',
        quantity: '1套',
        isKeyMustBuy: true,
        notes: '【全游戏最帅轻重平衡防具】消费满16000魂后进货。重量极轻却拥有中甲的惊人防御与全抗性！'
      },
      {
        id: 'mau_smelter_demon',
        name: '熔铁恶魔套装 (含熔铁恶魔头)',
        nameEn: 'Smelter Demon Set',
        category: 'armor',
        price: '全套 35,300 魂 (击败熔铁恶魔后进货)',
        quantity: '1套',
        notes: '拥有全游戏数一数二的极高火抗性与物理硬甲。'
      },
      {
        id: 'mau_looking_glass',
        name: '镜之骑士套装',
        nameEn: 'Looking Glass Knight Set',
        category: 'armor',
        price: '全套 42,000 魂 (击败镜之骑士后进货)',
        quantity: '1套',
        notes: '高雷抗性与威严的金属镜面盔甲。'
      },
      {
        id: 'mau_tseldora_set',
        name: '盖多勒套装 (刷魂神器)',
        nameEn: 'Tseldora Set',
        category: 'armor',
        price: '击杀他掉落 或 零灵魂对话/进货',
        quantity: '1套',
        isKeyMustBuy: true,
        notes: '【全套装备+22.5%灵魂获取】全套穿戴能大幅提升击杀敌人获得的灵魂量，刷魂巨人王必备！'
      }
    ]
  },
  {
    id: 'merchant_magerold',
    name: '杂货商 玛格罗拉',
    title: '来自东方拉纳菲尔的商人',
    locationMapId: 'iron_keep',
    locationName: '熔铁城 (入口大桥右侧拐角大厅)',
    role: 'covenant',
    roleLabel: '古龙契约与洗香大师',
    description: '在熔铁城大桥旁静候客人的异国商人。持有古龙化石并可签订【古龙誓约】；此外他是全大陆唯一能使用【不信者香料】与【愚者香料】降低法术与奇迹属性要求的学者！',
    condition: '熔铁城入口进门右转大厅尽头',
    items: [
      {
        id: 'mag_branch',
        name: '怀念香木',
        nameEn: 'Fragrant Branch of Yore',
        category: 'key_item',
        price: '7,500 魂',
        quantity: '1',
        isKeyMustBuy: true,
        notes: '【关键道具】熔铁城商人处售卖的珍贵香木，价格比玛伦提雅老妪的12,000魂便宜得多，必买！'
      },
      {
        id: 'mag_jester_robes',
        name: '奇术师大衣 (小丑服)',
        nameEn: 'Jester\'s Robes',
        category: 'armor',
        price: '3,000 魂',
        quantity: '无限',
        notes: '【防背刺防暴击神装】穿戴后彻底免疫背刺与致命一击！PVP与推图防伏击必备神器。'
      },
      {
        id: 'mag_cov_serpent_gold',
        name: '贪婪金蛇戒指 +1',
        nameEn: 'Covetous Gold Serpent Ring +1',
        category: 'ring',
        price: '消费满10,000魂后对话赠送',
        quantity: '1',
        notes: '大幅提升敌人掉落道具与稀有装备的掉宝率。'
      },
      {
        id: 'mag_cov_serpent_silver',
        name: '贪婪银蛇戒指 +1',
        nameEn: 'Covetous Silver Serpent Ring +1',
        category: 'ring',
        price: '消费满10,000魂后对话赠送',
        quantity: '1',
        notes: '提升击败敌人时获取灵魂量20%。'
      },
      {
        id: 'mag_incense_service',
        name: '吸香降低法术信仰需求服务',
        nameEn: 'Lower Spell Requirements with Incense',
        category: 'key_item',
        price: '消耗愚者香料 / 不信者香料',
        quantity: '无限',
        isKeyMustBuy: true,
        notes: '【洗香服务】能将高阶法术(如阳光之枪、灵魂枪)的智力或信仰属性要求一路削减至最低10点！'
      },
      {
        id: 'mag_repair_powder',
        name: '修理光粉',
        nameEn: 'Repair Powder',
        category: 'consumable',
        price: '2,500 魂',
        quantity: '1',
        notes: '瞬间修补当前装备武器防具的耐久度。'
      },
      {
        id: 'mag_dragon_eye',
        name: '古龙眼眸 (加入古龙誓约)',
        nameEn: 'Dragon Eye',
        category: 'key_item',
        price: '交付【化石龙蛋】后免费获得',
        quantity: '1',
        notes: '在龙祭坛拾取化石蛋交付给他后，可签订古龙誓约，获取黑龙铠甲。'
      }
    ]
  },
  {
    id: 'grave_warden_agdayne',
    name: '守墓人 阿加德温',
    title: '死者长眠的守护者',
    locationMapId: 'undead_crypt',
    locationName: '不死灵庙 (大殿石柱区)',
    role: 'hexer',
    roleLabel: '高级暗术与灵庙守卫',
    description: '不死灵庙沉睡死者的守护者。极度憎恨光芒！如果在接近他时手持火把或施放引路光源，他会瞬间狂暴并带领全体暗术重甲卫兵追杀你！和平交谈可购买终极暗术，并可在打王盾与渴望王座时召唤他。',
    condition: '【切勿点火把！】靠近他时绝对不能有任何光源！否则敌对！',
    items: [
      {
        id: 'agd_soul_spear',
        name: '灵魂枪',
        nameEn: 'Soul Spear',
        category: 'magic',
        price: '12,000 魂',
        quantity: '1',
        requirement: '智力 40 / 记忆格 1',
        isKeyMustBuy: true,
        notes: '【法爷核心输出狙击枪】贯穿整排敌人的高速魔法长枪，单发伤害极高！'
      },
      {
        id: 'agd_soul_appease',
        name: '镇魂',
        nameEn: 'Soul Appease',
        category: 'miracle',
        price: '8,800 魂',
        quantity: '1',
        requirement: '信仰 19 / 记忆格 1',
        notes: '以自身为中心爆发神圣波，对全图所有游魂活尸类敌人造成无视障碍的毁灭性打击！'
      },
      {
        id: 'agd_warmth',
        name: '温暖的火',
        nameEn: 'Warmth',
        category: 'pyromancy',
        price: '5,200 魂',
        quantity: '1',
        requirement: '无属性要求 / 记忆格 1',
        notes: '生成悬空治疗火球，持续为周围玩家与友方恢复生命，联机与推图极佳续航。'
      },
      {
        id: 'agd_ring_of_thorns',
        name: '荆棘戒指 +1',
        nameEn: 'Ring of Thorns +1',
        category: 'ring',
        price: '9,000 魂',
        quantity: '1',
        notes: '受到伤害时有较高几率向攻击者反弹棘刺造成穿刺反伤。'
      },
      {
        id: 'agd_effigy',
        name: '人像 (数量充足)',
        nameEn: 'Human Effigy',
        category: 'consumable',
        price: '3,000 魂',
        quantity: '13个',
        notes: '灵庙后备的大量人像供应，复活游魂必备。'
      },
      {
        id: 'agd_crypt_set',
        name: '阿加德温的黑袍套装 + 暗胧 (获得国王戒指后对话)',
        nameEn: 'Agdayne\'s Set & Darkdrift',
        category: 'armor',
        price: '0 (获得国王戒指后对话赠送)',
        quantity: '1套',
        notes: '获得【国王戒指】后与其对话直接赠送！暗胧为能够穿透盾牌防御的神秘虚空太刀。'
      }
    ]
  },
  {
    id: 'cleric_cromwell',
    name: '赦罪僧 克伦威尔',
    title: '罪业消解者与圣职',
    locationMapId: 'brightstone_cove_tseldora',
    locationName: '辉石镇礼拜堂 (徘徊术士Boss房出门左转梯子阁楼)',
    role: 'cleric',
    roleLabel: '赦罪与高阶奇迹',
    description: '站在辉石镇礼拜堂房梁暗道阁楼上的赦罪僧。如果不小心误伤或打死了友好NPC导致断支线，可在此处请求赦罪解除NPC敌对状态(每个周目有一次免费赦免机会)；同时售卖高阶武器附魔奇迹。',
    condition: '击败礼拜堂徘徊术士后出门左转爬隐秘长梯上阁楼',
    items: [
      {
        id: 'cro_pardoning',
        name: '解除NPC敌对 / 赦罪',
        nameEn: 'Absolution of Sin',
        category: 'key_item',
        price: '免费一次 / 后续为 等级 x 1,000 魂',
        quantity: '无限',
        isKeyMustBuy: true,
        notes: '【解除敌对救命服务】若不小心砍中铁匠、老妪等NPC导致他们敌对追杀，来此赦罪即可恢复友好！'
      },
      {
        id: 'cro_great_heal',
        name: '大恢复',
        nameEn: 'Great Heal',
        category: 'miracle',
        price: '8,000 魂',
        quantity: '1',
        requirement: '信仰 28 / 记忆格 1',
        notes: '瞬间大额补充生命，高周目联机主力回血奇迹。'
      },
      {
        id: 'cro_emitted_force',
        name: '原力迸射',
        nameEn: 'Emitted Force',
        category: 'miracle',
        price: '4,200 魂',
        quantity: '1',
        requirement: '信仰 20 / 记忆格 1',
        notes: '远程投掷出原力冲击炸裂球，能将敌人直接击倒。'
      },
      {
        id: 'cro_heavenly_thunder',
        name: '苍天雷鸣',
        nameEn: 'Heavenly Thunder',
        category: 'miracle',
        price: '3,300 魂',
        quantity: '1 (无限后)',
        requirement: '信仰 17 / 记忆格 1',
        isKeyMustBuy: true,
        notes: '在自身周围降下随机密集强力落雷，对大型Boss或群怪伤害极其恐怖！'
      },
      {
        id: 'cro_scraps_of_life',
        name: '生命残渣',
        nameEn: 'Scraps of Life',
        category: 'hex',
        price: '2,200 魂',
        quantity: '1 (无限后)',
        requirement: '智力 8 / 信仰 12 / 记忆格 1',
        notes: '从地面升起黑色死者柱，将周围所有敌人击飞倒地。'
      },
      {
        id: 'cro_ring_resistance',
        name: '抵抗戒指 (高信仰赠送)',
        nameEn: 'Ring of Resistance',
        category: 'ring',
        price: '0 (信仰达到35后对话)',
        quantity: '1',
        notes: '大幅提升中毒、出血、石化与诅咒四大状态抗性。'
      }
    ]
  },
  {
    id: 'sorcerer_navlaan',
    name: '禁忌法师 宫廷魔导士纳瓦兰',
    title: '被囚禁的疯狂人格魔术师',
    locationMapId: 'aldias_keep',
    locationName: '安第尔之馆 (一楼巨龙骨骸左侧长廊)',
    role: 'hexer',
    roleLabel: '禁忌暗术与刺杀委托',
    description: '双重人格的古代巫师，被封印在一楼的魔力防护罩内。在【肉身状态】下他会哀求你不要拉动机关；千万不要去拉右侧的杠杆释放他！以【游魂活尸状态】隔着护罩交谈，另一疯狂人格会委托你进行刺杀任务，提交对应道具后可买到全游戏最强禁忌咒术【封印太阳】！',
    condition: '保持封印，以活尸状态接任务；完成全部四项后解锁封印内商店。拉杆会中断任务线，释放后仅可用肉身形态交易。',
    items: [
      {
        id: 'nav_bonfire_ascetic',
        name: '营火的探究者 (添火道具)',
        nameEn: 'Bonfire Ascetic',
        category: 'consumable',
        price: '7,500 魂',
        quantity: '10个',
        isKeyMustBuy: true,
        notes: '【关键道具】用于在篝火添火提升周目难度并刷新Boss与稀有宝物，后期刷魂核心道具！'
      },
      {
        id: 'nav_black_witch_set',
        name: '黑魔女套装 (帽子/外衣/护手/长裤)',
        nameEn: 'Black Witch Set',
        category: 'armor',
        price: '帽子7200 / 外衣7700 / 手5600 / 裤6500 魂',
        quantity: '无限',
        notes: '【全游戏最高属性抗性轻甲】黑魔女外衣全属性防御极高，黑魔女帽子直接增加法术施法次数！'
      },
      {
        id: 'nav_great_magic_weapon',
        name: '强力法术武器',
        nameEn: 'Great Magic Weapon',
        category: 'magic',
        price: '6,000 魂',
        quantity: '无限',
        requirement: '智力 18 / 记忆格 1',
        notes: '中后期法师的高效强力近战武器附魔。'
      },
      {
        id: 'nav_forbidden_sun',
        name: '封印太阳',
        nameEn: 'Forbidden Sun',
        category: 'pyromancy',
        price: '完成第三个任务：出示费尔金的日暮之杖',
        quantity: '1',
        requirement: '无属性要求 / 记忆格 3',
        isKeyMustBuy: true,
        notes: '【咒术终极杀器】极速射出犹如微型太阳的巨大烈焰熔球，超快弹道与毁灭性火爆伤害！'
      },
      {
        id: 'nav_destructive_greatarrow',
        name: '破坏大箭 / 雷之大箭 / 火之大箭',
        nameEn: 'Destructive & Elemental Greatarrows',
        category: 'consumable',
        price: '各 180 魂',
        quantity: '无限',
        notes: '大弓流玩家的无限高级弹药补充站。'
      },
      {
        id: 'nav_chaos_hood',
        name: '混沌兜帽 + 混沌套装',
        nameEn: 'Chaos Hood & Chaos Set',
        category: 'armor',
        price: '完成全部4个暗杀任务后对话赠送',
        quantity: '1套',
        requirement: '智力 16 / 信仰 16',
        notes: '【毕业法师头盔】混沌兜帽提供超高法术防御并直接增加施法速度！'
      }
    ]
  },
  {
    id: 'chancellor_wellager',
    name: '宰相幽灵 贝拉格',
    title: '守护多兰古雷格的忠诚残魂',
    locationMapId: 'drangleic_castle',
    locationName: '王都多兰古雷格 (王都大门进入正殿阶梯)',
    role: 'merchant',
    roleLabel: '白金毕业神NPC',
    description: '多兰古雷格城堡正殿台阶上的半透明宰相幽灵。神智恍惚却坚守职守。最关键的是在【三周目 (NG++)】时，他会直接出售原本需要誓约排位500胜才能拿到的白金全成就奇迹【诸神之怒】与咒术【混沌大火球】！',
    condition: '王都正殿阶梯上直接对话',
    items: [
      {
        id: 'wel_spirit_tree_shield',
        name: '圣树之盾 (法术弹反神盾)',
        nameEn: 'Spirit Tree Shield',
        category: 'weapon_shield',
        price: '10,000 魂',
        quantity: '1',
        requirement: '力气 12',
        notes: '【法术弹反盾】虽然是中盾却拥有独特的法术偏转弹反判定，可将飞来的魔法长枪与光弹直接弹飞反制！'
      },
      {
        id: 'wel_great_magic_barrier',
        name: '强化法术防护',
        nameEn: 'Great Magic Barrier',
        category: 'miracle',
        price: '9,300 魂',
        quantity: '1',
        requirement: '信仰 28 / 记忆格 1',
        notes: '【全属性抗性暴涨250点】极大降低受到的法术、雷电、火焰、暗属性伤害，暗穴与Boss战防秒杀神技。'
      },
      {
        id: 'wel_wrath_of_gods',
        name: '诸神之怒 (三周目白金必买)',
        nameEn: 'Wrath of the Gods',
        category: 'miracle',
        price: '8,200 魂 (需在三周目NG++购买)',
        quantity: '1',
        requirement: '信仰 30 / 记忆格 1',
        isKeyMustBuy: true,
        notes: '【全奇迹白金必备】正常需青教誓约500胜，三周目到王都找宰相购买可补齐全奇迹收集，仍需取得其余全部奇迹！'
      },
      {
        id: 'wel_great_chaos_fireball',
        name: '混沌大火球 (三周目白金必买)',
        nameEn: 'Great Chaos Fireball',
        category: 'pyromancy',
        price: '17,400 魂 (需在三周目NG++购买)',
        quantity: '1',
        requirement: '无属性要求 / 记忆格 2',
        isKeyMustBuy: true,
        notes: '【全咒术白金必备】正常需血之同盟500胜，三周目找宰相购买可补齐全咒术收集，仍需取得其余全部咒术！'
      },
      {
        id: 'wel_bountiful_sunlight',
        name: '阳光滋润 (三周目购买)',
        nameEn: 'Bountiful Sunlight',
        category: 'miracle',
        price: '11,000 魂 (需在三周目NG++购买)',
        quantity: '1',
        requirement: '信仰 38',
        notes: '长时间全队大额群体恢复生命。'
      },
      {
        id: 'wel_repair_infinite',
        name: '修理光粉 (数量充足)',
        nameEn: 'Repair Powder',
        category: 'consumable',
        price: '2,500 魂',
        quantity: '无限',
        notes: '王都后全期无限供应。'
      }
    ]
  },
  {
    id: 'laddersmith_gilligan',
    name: '工匠 吉利冈 (吉里甘)',
    title: '市侩的梯子搭建者',
    locationMapId: 'majula',
    locationName: '如蜜大坑边缘 (初见于流油谷/堆土塔)',
    role: 'merchant',
    roleLabel: '梯子架设与特殊防具',
    description: '贪财而圆滑的逃亡木匠。初见于堆土塔外围窗台，堆土塔击败Boss后移居如蜜大坑边缘。支付灵魂让他为如蜜大坑架设不同档次的木梯与长梯，安全下坑探索圣壁之都与废渊。',
    condition: '初见堆土塔，Boss打完后移居如蜜大坑边缘',
    items: [
      {
        id: 'gil_ladder_mini',
        name: '架设小梯子 (下第一层)',
        nameEn: 'Small Ladder',
        category: 'key_item',
        price: '500 魂',
        quantity: '1次性',
        notes: '架设一根简易短梯，方便下落到如蜜大坑第一层平台。'
      },
      {
        id: 'gil_ladder_medium',
        name: '架设中梯子 (下圣人墓地)',
        nameEn: 'Medium Ladder',
        category: 'key_item',
        price: '3,500 魂',
        quantity: '1次性',
        notes: '通往圣人墓地入口平台。'
      },
      {
        id: 'gil_ladder_long',
        name: '架设最长梯子 (直通废渊与深渊密室)',
        nameEn: 'Longest Ladder',
        category: 'key_item',
        price: '12,000 魂',
        quantity: '1次性',
        isKeyMustBuy: true,
        notes: '最长梯子通向如蜜大坑下层平台。购买后与吉里甘对话，获赠Melu Scimitar并解锁其继承装备成就；不是赠送梯子饰物。'
      },
      {
        id: 'gil_reinforced_club',
        name: '强化棍棒',
        nameEn: 'Reinforced Club',
        category: 'weapon_shield',
        price: '1,600 魂 (推土塔) / 2,000 魂 (如蜜)',
        quantity: '无限',
        requirement: '力气 12 / 敏捷 3',
        notes: '高削韧打击武器，带有出血效果，力量型开荒推图利器。'
      },
      {
        id: 'gil_ladder_miniature',
        name: '梯子饰物',
        nameEn: 'Ladder Miniature',
        category: 'key_item',
        price: '6,399 魂（推土坊）／7,999 魂（如蜜）',
        quantity: '1',
        notes: '【刺杀任务关键道具】纳瓦兰刺杀任务的目标信物，出示此物即可向纳瓦兰交差而无需杀死吉利冈！'
      }
    ]
  },
  {
    id: 'vengarl_head',
    name: '温格的头颅',
    title: '领悟宁静的北方蛮族狂剑士',
    locationMapId: 'shaded_woods',
    locationName: '虚影森林 (浓雾森林左侧石环)',
    role: 'merchant',
    roleLabel: '战技与狂战兵器',
    description: '在虚影森林浓雾中沿左侧石壁摸索找到的沉思头颅。在数百年静思中放下了杀戮执念。售卖强力的雷壶、松脂以及标志性的红锈弯刀。',
    condition: '在虚影森林迷雾区沿左侧岩壁行进找到石堆上的头颅',
    items: [
      {
        id: 'ven_claymore_greatsword',
        name: '大剑 / 巨剑',
        nameEn: 'Claymore & Greatsword',
        category: 'weapon_shield',
        price: '大剑 4,300 魂 / 巨剑 5,000 魂',
        quantity: '无限',
        requirement: '大剑 (力16/敏13) / 巨剑 (力28/敏10)',
        notes: '【经典质变与特大剑神器】斩龙大剑与特大巨剑在此处无限供应，随时选购！'
      },
      {
        id: 'ven_red_rust_scimitar',
        name: '红锈弯刀',
        nameEn: 'Red Rust Scimitar',
        category: 'weapon_shield',
        price: '击败无头身躯后购买 / 7,500 魂',
        quantity: '1',
        requirement: '力气 18 / 敏捷 15',
        notes: '力量补正为主的重型曲剑，单手重击具备霸体判定。'
      },
      {
        id: 'ven_gold_pine_resin',
        name: '黄金松脂 (雷电涂油)',
        nameEn: 'Gold Pine Resin',
        category: 'consumable',
        price: '1,500 魂',
        quantity: '无限',
        isKeyMustBuy: true,
        notes: '【近战Boss神器】纯物理战士的雷电附魔药膏，每次使用为武器附加50点雷电伤害与持续雷附魔！'
      },
      {
        id: 'ven_lightning_urn',
        name: '雷壶',
        nameEn: 'Lightning Urn',
        category: 'consumable',
        price: '400 魂',
        quantity: '无限',
        notes: '远距离高伤害雷电投掷罐，推图引怪破防神品。'
      },
      {
        id: 'ven_dest_shadow_armor',
        name: '温格全套防具 (对话赠送)',
        nameEn: 'Vengarl\'s Set',
        category: 'armor',
        price: '0 (初见赠送头盔，击杀无头身躯后赠送全套)',
        quantity: '1套',
        isKeyMustBuy: true,
        notes: '【极强物防重装】初次对话耗尽赠送【温格头盔】(力气+2)；击杀其狂暴身体后再对话赠送其余三件防具！'
      }
    ]
  },
  {
    id: 'stone_trader_chloanne',
    name: '石商人 克洛安娜',
    nameEn: 'Stone Trader Chloanne',
    title: '矿脉开采与稀有强化矿石商人',
    locationMapId: 'harvest_valley',
    locationName: '流油谷 (采掘场首个篝火旁) / 后期移居如蜜 (铁匠铺旁)',
    role: 'merchant',
    roleLabel: '全矿石商人',
    description: '铁匠雷尼加尔的亲生女儿，四处开采矿石却因诅咒侵蚀而与近在咫尺的父亲互不相识。全游戏最核心的武器强化与变质石材供应商！',
    condition: '在流油谷对话耗尽后移居如蜜；累计消费20,000魂后对话赠送【光辉楔形石】。',
    inventoryType: 'specialty',
    accentColor: '#ca8a04',
    items: [
      {
        id: 'chlo_titanite_shard',
        name: '楔形石碎片',
        nameEn: 'Titanite Shard',
        category: 'consumable',
        price: '1,000 魂',
        quantity: '初期10个 / 击败铁之古王后无限',
        isKeyMustBuy: true,
        notes: '武器强化+1至+3的基础素材。'
      },
      {
        id: 'chlo_large_titanite',
        name: '大楔形石碎片',
        nameEn: 'Large Titanite Shard',
        category: 'consumable',
        price: '2,500 魂',
        quantity: '击败铁之古王后10个 / 击败镜之骑士后无限',
        isKeyMustBuy: true,
        notes: '武器强化+4至+6的进阶素材。'
      },
      {
        id: 'chlo_titanite_chunk',
        name: '楔形石块',
        nameEn: 'Titanite Chunk',
        category: 'consumable',
        price: '6,000 魂',
        quantity: '击败王盾韦施塔德后10个 / 击败王妃后无限',
        isKeyMustBuy: true,
        notes: '武器强化+7至+9的高级素材，全游戏中后期极度稀缺！'
      },
      {
        id: 'chlo_titanite_slab',
        name: '楔形石原盘',
        nameEn: 'Titanite Slab',
        category: 'consumable',
        price: '13,000 魂',
        quantity: '1',
        isKeyMustBuy: true,
        notes: '武器普通强化升至顶阶+10的至宝原盘！击败王盾后解锁购买。'
      },
      {
        id: 'chlo_twinkling_titanite',
        name: '光辉楔形石',
        nameEn: 'Twinkling Titanite',
        category: 'consumable',
        price: '15,000 魂',
        quantity: '3',
        isKeyMustBuy: true,
        notes: '强化特殊传奇装备（如哈维尔套装、黑银枪、温格套）至最高+5的贵重素材！击败王盾后解锁。'
      },
      {
        id: 'chlo_petrified_dragon_bone',
        name: '龙骨化石',
        nameEn: 'Petrified Dragon Bone',
        category: 'consumable',
        price: '17,500 魂',
        quantity: '3',
        isKeyMustBuy: true,
        notes: '强化Boss灵魂炼化武器（如特大剑、冰棒、刺剑）至最高+5的核心素材！击败王盾后解锁。'
      },
      {
        id: 'chlo_infusion_stones',
        name: '全套变质矿石 (苍天石/雷光石/暗夜石/火蜥蜴石等)',
        nameEn: 'Infusion Stones (Boltstone, Faintstone, etc.)',
        category: 'consumable',
        price: '6,000 - 10,000 魂',
        quantity: '各3个',
        notes: '提供粗石(6000)、苍天石/雷光石/火蜥蜴石/暗夜石/毒石/出血石/魔力石(各7000)、秘奥石(10000)，击败王盾后解锁。'
      },
      {
        id: 'chlo_soul_appease',
        name: '镇魂',
        nameEn: 'Soul Appease',
        category: 'miracle',
        price: '8,800 魂',
        quantity: '1',
        requirement: '信仰 19 / 记忆格 1',
        notes: '【亡灵秒杀神技】只对游魂与不死人造成毁灭性神圣范围暴击伤害，推图打鼠王与骷髅群的王牌！'
      },
      {
        id: 'chlo_dead_again',
        name: '引爆死尸',
        nameEn: 'Dead Again',
        category: 'hex',
        price: '4,000 魂',
        quantity: '1',
        requirement: '智力 22 / 信仰 20 / 记忆格 1',
        notes: '引爆周围尸体造成暗属性连锁爆炸。'
      },
      {
        id: 'chlo_bonfire_ascetic',
        name: '营火的探究者 (添火道具)',
        nameEn: 'Bonfire Ascetic',
        category: 'consumable',
        price: '7,500 魂',
        quantity: '1',
        isKeyMustBuy: true,
        notes: '提升当前篝火强度+1，使Boss和红魂杂兵重生并刷新二周目专属奖励。'
      }
    ]
  },
  {
    id: 'lonesome_gavlan',
    name: '孤独的噶瓦兰',
    nameEn: 'Lonesome Gavlan',
    title: '矮人流浪商人 (全游戏唯一道具回收商)',
    locationMapId: 'doors_of_pharros',
    locationName: '密港 (毒罐房) -> 流油谷 (首个洞穴) -> 法洛斯门径 (永久定居)',
    role: 'merchant',
    roleLabel: '道具回收 & 毒箭之王',
    description: '豪饮麦酒的盖鲁姆流浪矮人。「Gavlan wheel? Gavlan deal!」他是多兰古雷格全境唯一能将玩家闲置装备与消耗品折算回收为灵魂的NPC！并在法洛斯门径无限供应PVE终极逃课神器——毒箭！',
    condition: '在密港初遇后移居流油谷，流油谷对话后永久定居于法洛斯门径；累计卖出/买入16,000魂后对话赠送【噶瓦兰战斧】。',
    inventoryType: 'general',
    accentColor: '#16a34a',
    items: [
      {
        id: 'gav_buyback_service',
        name: '【独家特色】废旧装备与道具灵魂回收服务',
        nameEn: 'Gavlan Item Buyback Service',
        category: 'consumable',
        price: '变现获取灵魂 (按物品价值)',
        quantity: '无限',
        isKeyMustBuy: true,
        notes: '【全游戏独一无二】可将背包中所有多余重复的武器、防具、箭矢、战利品卖给噶瓦兰换取大量灵魂！'
      },
      {
        id: 'gav_poison_arrow',
        name: '毒箭',
        nameEn: 'Poison Arrow',
        category: 'consumable',
        price: '60 魂',
        quantity: '前期20支 / 法洛斯门径无限供应',
        isKeyMustBuy: true,
        notes: '【魂2第一逃课神物】普通怪物与绝大多数Boss中3~4箭必触发剧毒！每秒持续削减巨额生命值，推阿玛娜祭坛、黑溪谷与各路难缠精英怪的绝对杀器！'
      },
      {
        id: 'gav_poison_throwing_knife',
        name: '剧毒飞刀',
        nameEn: 'Poison Throwing Knife',
        category: 'consumable',
        price: '350 魂',
        quantity: '前期20个 / 法洛斯门径无限供应',
        notes: '无须弓箭即可快速投掷积累高额剧毒条，打断施法与风筝利器。'
      },
      {
        id: 'gav_poison_moss',
        name: '毒藓苔',
        nameEn: 'Poison Moss',
        category: 'consumable',
        price: '1,500 魂',
        quantity: '前期20个 / 法洛斯门径无限供应',
        notes: '瞬间解除剧毒状态，开荒流油谷、废渊与堆土塔的救命草药。'
      },
      {
        id: 'gav_rotten_pine_resin',
        name: '腐败松脂',
        nameEn: 'Rotten Pine Resin',
        category: 'consumable',
        price: '2,000 魂',
        quantity: '前期20个 / 法洛斯门径无限供应',
        notes: '为物理武器涂抹剧毒，高攻速刺剑或双持弯刀配合下可瞬间令敌人陷入剧毒！'
      },
      {
        id: 'gav_ring_of_giants',
        name: '巨人戒指',
        nameEn: 'Ring of Giants',
        category: 'ring',
        price: '5,000 - 7,000 魂 (随地图递增)',
        quantity: '1',
        isKeyMustBuy: true,
        notes: '提升10点强韧度，避免被轻型武器攻击打断出刀动作。'
      },
      {
        id: 'gav_gyrm_axe',
        name: '噶瓦兰战斧 (赠礼)',
        nameEn: 'Gyrm Axe',
        category: 'weapon_shield',
        price: '0 (交易满16,000魂后对话赠送)',
        quantity: '1',
        notes: '沉重的盖鲁姆矮人战斧，拥有极高削韧与力量加成。'
      }
    ]
  },
  {
    id: 'darkdiver_grandahl',
    name: '暗之巡礼者 格兰达尔',
    nameEn: 'Darkdiver Grandahl',
    title: '古老暗穴指引者与深渊契约主',
    locationMapId: 'shaded_woods',
    locationName: '虚影森林 / 黑溪谷 / 王都地下吸魂室 (三次相遇后常驻暗穴)',
    role: 'covenant',
    roleLabel: '深渊誓约 & 添火商人',
    description: '端坐于轮椅上的失明盲眼长者，引导受深渊吸引的不死人进入三大古老暗穴，探索纯粹黑暗并迎战全游戏难度最高的隐藏Boss【黑暗潜伏者 (暗天使)】。',
    condition: '在虚影森林、黑溪谷、王都地下室三处全部对话后正式开启誓约；每次进入暗穴需消耗1个人像。',
    inventoryType: 'spells',
    accentColor: '#581c87',
    items: [
      {
        id: 'gra_bonfire_ascetic',
        name: '营火的探究者 (添火道具)',
        nameEn: 'Bonfire Ascetic',
        category: 'consumable',
        price: '7,500 魂',
        quantity: '10',
        isKeyMustBuy: true,
        notes: '【全游戏最富集的添火储备】一人独卖整整10个营火探究者！刷巨人王、刷领主Boss魂与古王武器的顶级资源！'
      },
      {
        id: 'gra_human_effigy',
        name: '人像',
        nameEn: 'Human Effigy',
        category: 'consumable',
        price: '3,000 魂',
        quantity: '3',
        notes: '恢复肉身形态，亦是开启暗穴之门的消耗祭品。'
      },
      {
        id: 'gra_profound_still',
        name: '沉默暗雾 (深层沉默)',
        nameEn: 'Profound Still',
        category: 'hex',
        price: '13,000 魂',
        quantity: '1',
        requirement: '智力 20 / 信仰 42 / 记忆格 2',
        isKeyMustBuy: true,
        notes: '【法系Boss绝对克星】大范围彻底封印全场敌人的所有法术施放！在面对暗天使分身、王妃或阿玛娜法师时使用，能让敌方沦为任人宰割的木桩！'
      },
      {
        id: 'gra_darkstorm',
        name: '黑暗风暴',
        nameEn: 'Darkstorm',
        category: 'hex',
        price: '4,700 魂',
        quantity: '1',
        requirement: '智力 12 / 信仰 21 / 记忆格 2',
        notes: '在施法者周围引爆汹涌的黑暗旋风柱，群体近身杀伤极大。'
      },
      {
        id: 'gra_dark_hail',
        name: '暗雹',
        nameEn: 'Dark Hail',
        category: 'hex',
        price: '1,500 魂',
        quantity: '1',
        requirement: '智力 18 / 信仰 19 / 记忆格 2',
        notes: '向前呈扇形散射大片暗黑法球，贴脸伤害极高。'
      },
      {
        id: 'gra_dark_orb',
        name: '暗珠',
        nameEn: 'Dark Orb',
        category: 'hex',
        price: '600 魂',
        quantity: '1',
        requirement: '智力 12 / 信仰 10 / 记忆格 1',
        notes: '暗术流高性价比速射基础攻击法术。'
      },
      {
        id: 'gra_cast_light',
        name: '照亮 (光明照耀)',
        nameEn: 'Cast Light',
        category: 'magic',
        price: '3,000 魂',
        quantity: '1',
        requirement: '智力 14 / 记忆格 1',
        notes: '头顶漂浮发光法球，照亮黑暗区域，废渊与暗穴探索实用工具。'
      }
    ]
  },
  {
    id: 'blue_sentinel_targray',
    name: '青教守护者 达格兰',
    nameEn: 'Blue Sentinel Targray',
    title: '青之骑士团统领与信义圣职',
    locationMapId: 'cathedral_of_blue',
    locationName: '青之圣堂 (海德巨火塔吊桥后)',
    role: 'covenant',
    roleLabel: '青之守护者誓约商',
    description: '伫立在海德青之圣堂内室的骄傲骑士长，统领致力于保护弱小青教信徒、反击血之同胞暗灵的青之守护者骑士团。',
    condition: '击败古老的猎龙者，背包中必须持有【信义之证】(通过白灵助战获胜获取)方可对话加入誓约与购买物品。',
    inventoryType: 'specialty',
    accentColor: '#2563eb',
    items: [
      {
        id: 'tar_heavenly_thunder',
        name: '苍天雷鸣',
        nameEn: 'Heavenly Thunder',
        category: 'miracle',
        price: '3,300 魂',
        quantity: '1',
        requirement: '信仰 17 / 记忆格 1',
        isKeyMustBuy: true,
        notes: '在周身召唤漫天落雷，兼具极强击飞与范围伤害，PVP防近身神技！'
      },
      {
        id: 'tar_emit_force',
        name: '原力迸射',
        nameEn: 'Emit Force',
        category: 'miracle',
        price: '4,200 魂',
        quantity: '1',
        requirement: '信仰 20 / 记忆格 1',
        notes: '向前推出冲击波光球，击倒敌人并造成中等雷电伤害。'
      },
      {
        id: 'tar_boltstone',
        name: '雷光石',
        nameEn: 'Boltstone',
        category: 'consumable',
        price: '7,000 魂',
        quantity: '无限',
        isKeyMustBuy: true,
        notes: '【雷电质变核心素材】雷变质海德骑士剑、刺剑、大剑的必需品，在此无限购买！'
      },
      {
        id: 'tar_holy_water_urn',
        name: '圣水瓶',
        nameEn: 'Holy Water Urn',
        category: 'consumable',
        price: '300 魂',
        quantity: '无限',
        notes: '对不死族与暗灵造成显著神圣伤害的投掷瓶。'
      },
      {
        id: 'tar_monastery_charm',
        name: '修道院护符',
        nameEn: 'Monastery Charm',
        category: 'consumable',
        price: '2,200 魂',
        quantity: '3',
        notes: '瞬间解除毒素并持续恢复大量生命。'
      },
      {
        id: 'tar_morning_star',
        name: '晨星锤 / 戟',
        nameEn: 'Morning Star / Halberd',
        category: 'weapon_shield',
        price: '1,600 / 2,500 魂',
        quantity: '无限',
        notes: '自带出血效果的打击钝器与基础长柄武器。'
      },
      {
        id: 'tar_cracked_blue_orb',
        name: '龟裂蓝眸之石 (二周目)',
        nameEn: 'Cracked Blue Eye Orb (NG+)',
        category: 'consumable',
        price: '10,000 魂',
        quantity: '二周目无限',
        notes: '入侵惩戒罪人世界专用的蓝灵眼眸。'
      }
    ]
  }
];

export interface MerchantItemSearchResult {
  item: MerchantItem;
  merchant: {
    id: string;
    name: string;
    title: string;
    locationMapId: string;
    locationName: string;
    roleLabel: string;
  };
}

/**
 * Searches across all merchant goods, spells, weapons, rings, and notes.
 */
export function searchMerchantItems(query: string): MerchantItemSearchResult[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  const results: MerchantItemSearchResult[] = [];

  DRANGLEIC_MERCHANTS.forEach(merchant => {
    merchant.items.forEach(item => {
      const matchName = item.name.toLowerCase().includes(clean);
      const matchNameEn = item.nameEn?.toLowerCase().includes(clean) ?? false;
      const matchNotes = item.notes?.toLowerCase().includes(clean) ?? false;
      const matchCategory = MERCHANT_CATEGORY_CONFIG[item.category]?.label.toLowerCase().includes(clean) ?? false;
      const matchMerchantName = merchant.name.toLowerCase().includes(clean);
      const matchLocation = merchant.locationName.toLowerCase().includes(clean);

      if (matchName || matchNameEn || matchNotes || matchCategory || matchMerchantName || matchLocation) {
        results.push({
          item,
          merchant: {
            id: merchant.id,
            name: merchant.name,
            title: merchant.title,
            locationMapId: merchant.locationMapId,
            locationName: merchant.locationName,
            roleLabel: merchant.roleLabel,
          }
        });
      }
    });
  });

  return results;
}

/**
 * Returns merchants residing in a specific map
 */
export function getMerchantsForMap(mapId: string): MerchantNPC[] {
  return DRANGLEIC_MERCHANTS.filter(m => {
    if (m.locationMapId === mapId) return true;
    // Special handling for NPCs with alternate/transferred locations
    if (mapId === 'forest_of_fallen_giants' && m.id === 'hag_melentia') return true;
    if (mapId === 'majula' && ['hag_melentia', 'cleric_licia', 'sorcerer_carhillion', 'pyromancer_rosabeth', 'laddersmith_gilligan', 'stone_trader_chloanne'].includes(m.id)) return true;
    if (mapId === 'heides_tower' && m.id === 'cleric_licia') return true;
    if (mapId === 'cathedral_of_blue' && m.id === 'blue_sentinel_targray') return true;
    if (mapId === 'shaded_woods' && ['weaponsmith_ornifex', 'pyromancer_rosabeth', 'darkdiver_grandahl'].includes(m.id)) return true;
    if (mapId === 'no_mans_wharf' && ['sorcerer_carhillion', 'lonesome_gavlan'].includes(m.id)) return true;
    if (mapId === 'harvest_valley' && ['stone_trader_chloanne', 'lonesome_gavlan'].includes(m.id)) return true;
    if (mapId === 'doors_of_pharros' && m.id === 'lonesome_gavlan') return true;
    if (mapId === 'black_gulch' && m.id === 'darkdiver_grandahl') return true;
    if (mapId === 'drangleic_castle' && m.id === 'darkdiver_grandahl') return true;
    if (mapId === 'dark_chasm_of_old' && m.id === 'darkdiver_grandahl') return true;
    return false;
  });
}
