import { MapNode, NPCQuestline, GameEnding } from '../types/souls';

// 适用：PC DX11 / PS4 / Xbox One《原罪学者》。来源与版本约定见 SCHOLAR_GUIDE_SOURCES.md。
export const STAGES_CONFIG = [
  {
    id: 'prologue',
    name: '阶段一：序章与如蜜枢纽',
    description: '新手初探与核心大本营',
    color: '#b4813f'
  },
  {
    id: 'four_souls',
    name: '阶段二：四大古魂分支',
    description: '罪人/古王/蜘蛛/腐败四大巨魂',
    color: '#c2410c'
  },
  {
    id: 'drangleic',
    name: '阶段三：冬之庙与王都多兰古雷格',
    description: '凭借巨魂开启王都之门，面见王妃',
    color: '#2563eb'
  },
  {
    id: 'undead_crypt',
    name: '阶段四：不死灵庙与国王宿命',
    description: '探索死者之都，获取国王戒指',
    color: '#7c3aed'
  },
  {
    id: 'dragon_shrine',
    name: '阶段五：安第尔之馆与龙祭坛',
    description: '突破禁忌研究室，晋见古龙获灰雾核心',
    color: '#0d9488'
  },
  {
    id: 'memories',
    name: '阶段六：巨人战争回忆与王之记忆',
    description: '穿越时光之雾，击败巨人王获取巨人的共鸣',
    color: '#d97706'
  },
  {
    id: 'throne_endings',
    name: '阶段七：渴望王座决战与最终分歧',
    description: '王座双守卫、王妃杜娜湘卓、原罪学者安第尔',
    color: '#dc2626'
  },
  {
    id: 'dlc',
    name: '阶段八：失落的王冠 (DLC三部曲)',
    description: '圣壁之都、黑雾之塔、白王之都与皇冠加冕',
    color: '#4f46e5'
  }
];

export const MAP_NODES: MapNode[] = [
  {
    id: 'things_betwixt',
    name: '一线天森林',
    nameEn: 'Things Betwixt',
    stage: 'prologue',
    stageName: '序章与起源',
    branch: 'main',
    branchName: '主线起始',
    order: 0,
    lane: 1,
    levelRecommendation: 'SL 1 - 10',
    bonfireCount: 1,
    description: '不死人苏醒的神秘迷雾裂隙，由三位火防女老妪引导踏入多兰古雷格的大陆。',
    lore: '「你将到达那片被遗忘的荒废之国，像飞蛾扑向火光般，吞噬你的灵魂……」',
    colorTheme: '#71717a',
    bosses: [],
    keyItems: [
      {
        id: 'tb_stone_ring',
        name: '石之指环',
        type: 'key_item',
        location: '击败河马独眼怪物掉落(大幅增强削韧)'
      },
      {
        id: 'tb_smooth_silky',
        name: '某种化石 / 光滑石头',
        type: 'key_item',
        location: '初始挑选礼物或瀑布后鸟巢兑换'
      },
      {
        id: 'tb_gender_coffin',
        name: '转性魔棺',
        type: 'key_item',
        location: '海边沙滩击败双河马后躺进棺木'
      },
      {
        id: 'tb_estus',
        name: '原素碎片',
        type: 'estus_shard',
        location: '用怀念香木解除第三处教学雾门前的石化活尸，沿教学路线落入三只石化蛙所在的坑中，搜查尸体；可取得香木后回访。'
      }
    ],
    npcInteractions: [
      {
        npcId: 'herald',
        npcName: '防火女老妪三姐妹',
        stepNumber: 1,
        totalSteps: 1,
        actionRequired: '完成角色创建、定名并领取人像。如持有洗点道具「灵魂容器」，可随时返回重新分配属性点。'
      }
    ],
    checklists: [
      {
        id: 'tb_c1',
        task: '完成屋内核实外貌与捏脸环节，拾取房内与楼上的人像',
        category: 'essential'
      },
      {
        id: 'tb_c2',
        task: '依次穿过三处迷雾树穴，完成攻击、翻滚、跳跃等新手教学石碑',
        category: 'essential'
      },
      {
        id: 'tb_c3',
        task: '探索瀑布树洞与小鸟「鸟巢」交付光滑石头/化石换取强化素材',
        category: 'secret'
      },
      {
        id: 'tb_c4',
        task: '击败瀑布旁的第一只独眼巨怪(河马)，拾取强力开荒神器【石之指环】',
        category: 'collectible'
      },
      {
        id: 'tb_c5',
        task: '穿过长长日光隧道前往绝壁之村「如蜜」',
        category: 'essential'
      }
    ],
    trapsAndTricks: [
      '【迅速与翻滚】：适应力与记忆力共同提升迅速（Agility）。以迅速面板为准选择92、96、99或105等翻滚无敌帧档位；所需适应力随记忆力不同而变化。迅速也影响原素瓶等道具的使用速度；负重影响翻滚距离。',
      '多数普通敌人被击杀约12次后停止刷新，但有例外；加入霸者契约可让多数此类敌人持续刷新，添火也会恢复相应区域敌人并永久提高该篝火强度。',
      '新手若攻击力不足，可先不打河马怪物，拿到武器后再回来清怪。',
      '沙滩边的棺材躺进去会改变角色性别，并非传送棺材。'
    ],
    connectionsTo: [
      {
        targetId: 'majula',
        requirement: '穿过一线天岩洞通道'
      }
    ]
  },
  {
    id: 'majula',
    name: '如蜜',
    nameEn: 'Majula',
    stage: 'prologue',
    stageName: '核心大本营',
    branch: 'main',
    branchName: '世界枢纽',
    order: 1,
    lane: 1,
    levelRecommendation: 'SL 10+',
    bonfireCount: 1,
    description: '沐浴在永恒余晖中的宁静崖边村落，是连接多兰古雷格各大路径的轴心大本营。',
    lore: '「这里是如蜜，那些迷失方向的不死人聚集之地。愿火光指引你那残破的灵魂。」',
    colorTheme: '#f59e0b',
    bosses: [],
    keyItems: [
      {
        id: 'maj_estus_1',
        name: '原素碎片 (井口)',
        type: 'estus_shard',
        location: '击打豪宅门口古井配重石，水桶拉出获得碎片'
      },
      {
        id: 'maj_estus_2',
        name: '原素碎片 (豪宅地下室)',
        type: 'estus_shard',
        location: '用行商凯尔交付的豪宅钥匙开门，击杀骷髅拾取'
      },
      {
        id: 'maj_mansion_key',
        name: '如蜜豪宅钥匙',
        type: 'key_item',
        location: '巨森主塔洞穴中与制图师凯尔对话耗尽后获得'
      }
    ],
    npcInteractions: [
      {
        npcId: 'herald',
        npcName: '绿衣巡礼者 夏娜洛特',
        stepNumber: 1,
        totalSteps: 5,
        actionRequired: '悬崖篝火旁对话获得【原素瓶】，以后在此升级与强化原素瓶使用次数。',
        warning: '绝对不要杀死她！她是全游戏唯一的升级NPC。'
      },
      {
        npcId: 'herald',
        npcName: '灰心哥 索丹 (青教引导者)',
        stepNumber: 1,
        totalSteps: 1,
        actionRequired: '坐在悲哀石碑旁，初次对话可加入【青教】并获得青带戒指；如果在本周目累计死亡达到100次后与他对话，他会怜悯赠予【钢之防护戒指】。'
      }
    ],
    checklists: [
      {
        id: 'maj_c1',
        task: '找到悬崖边的绿衣巡礼者，对话获得原素瓶并提升等级',
        category: 'essential'
      },
      {
        id: 'maj_c2',
        task: '击打大井旁的缠绳石头，拉出水桶拾取【原素碎片】',
        category: 'collectible'
      },
      {
        id: 'maj_c3',
        task: '拜访猫咪夏娜罗亚，按需购买银猫戒指、低语戒指，查看或退出誓约',
        category: 'npc'
      },
      {
        id: 'maj_c4',
        task: '拜访锁在门外的铁匠雷尼加尔(后续在巨森主塔老奶奶处购买钥匙开门)',
        category: 'npc'
      },
      {
        id: 'maj_c5',
        task: '与索丹对话可加入青教；另一侧悬崖的霸者石碑用于加入霸者契约，两者不是同一个机关',
        category: 'secret'
      },
      {
        id: 'maj_c6',
        task: '沿海边石阶前往【巨人陨落之森】开启第一条征程',
        category: 'essential'
      }
    ],
    choices: [
      {
        id: 'majula_covenant',
        title: '悬崖霸者石碑抉择',
        situation: '在如蜜右侧悬崖尽头有一座雕刻着狂乱文字的古代石碑，调查时系统会反复弹出警告询问是否祈祷。',
        recommendedChoice: '新手绝对不要加入！选择「否」或前往悬崖柱子处加入「青教」',
        options: [
          {
            label: '拒绝祈祷 / 加入青教',
            isRecommended: true,
            consequence: '游戏维持正常难度，所有BOSS战均可正常召唤NPC白灵与在线玩家协助，受到暗灵入侵时青之守护者会赶来救援。',
            loreReasoning: '新手正常开荒的不二选择。'
          },
          {
            label: '执意多次确定加入【霸者契约】',
            isRecommended: false,
            consequence: '全图所有怪物防御大幅提升，对玩家伤害增加33%，且【全游戏彻底禁用所有白灵召唤】！',
            spoilerContent: '霸者契约适合二周目老手挑战极限或刷力敏空手骨拳，新手误入会导致甚至打不过第一个小兵。',
            loreReasoning: '这是强者的孤独试炼，神明不眷顾弱者。'
          }
        ]
      }
    ],
    trapsAndTricks: [
      '下如蜜大坑前先准备足够生命、减轻负重并使用银猫戒指、落下减伤法术或吉里甘的梯子。银猫戒指不免疫全部坠落伤害，需逐级落到木板，不能直接跳到底。',
      '霸者石碑会让怪物伤害大幅增加且无法召唤白灵，新手千万注意不要盲目点「是」。'
    ],
    connectionsTo: [
      {
        targetId: 'forest_of_fallen_giants',
        requirement: '沿海岸水渠石洞前往'
      },
      {
        targetId: 'heides_tower',
        requirement: '沿地下大石门机关通道前往'
      },
      {
        targetId: 'shaded_woods',
        requirement: '需使用【怀念香木】解除石化罗莎贝娜'
      },
      {
        targetId: 'grave_of_saints',
        requirement: '购买银猫戒指或梯子吉里甘下大坑'
      }
    ]
  },
  {
    id: 'forest_of_fallen_giants',
    name: '巨人陨落之森',
    nameEn: 'Forest of Fallen Giants',
    stage: 'four_souls',
    stageName: '四大古魂之路',
    branch: 'branch_sinner',
    branchName: '罪人分支 (上路)',
    order: 2,
    lane: 0,
    levelRecommendation: 'SL 15 - 30',
    bonfireCount: 4,
    description: '曾经多兰古雷格与北方巨人族爆发血战的废墟，城堡外墙被巨人尸树环绕。',
    lore: '「巨人曾跨海而来，将整座王国摧毁殆尽。国王凡克拉德夺取了不可言说的力量。」',
    colorTheme: '#84cc16',
    bosses: [
      {
        id: 'last_giant',
        name: '最后的巨人',
        nameEn: 'The Last Giant',
        isOptional: false,
        tips: '修脚打法，注意踩踏；残血会撕断自己手臂当大棒挥击。',
        transposeWeapon: '巨人石斧'
      },
      {
        id: 'pursuer',
        name: '咒缚者',
        nameEn: 'The Pursuer',
        isOptional: true,
        tips: '向右前方翻滚避开突刺。可弹反后操作场地弩炮造成大量伤害，通常需多次命中；注意弩炮也能误伤白灵。',
        transposeWeapon: '咒缚者特大剑 / 咒缚者大盾'
      }
    ],
    keyItems: [
      {
        id: 'fofg_estus',
        name: '原素碎片',
        type: 'estus_shard',
        location: '主塔篝火附近、咒缚者首次乘鹰降落的平台尸体上；学者版不在篝火楼上宝箱。'
      },
      {
        id: 'fofg_soldier_key',
        name: '士兵钥匙',
        type: 'key_item',
        location: '击败最后的巨人获得，开启主塔所有铁门'
      },
      {
        id: 'fofg_smith_key',
        name: '雷尼加尔铁匠钥匙',
        type: 'key_item',
        location: '向行商老妪玛伦提雅购买(1000魂)'
      }
    ],
    npcInteractions: [
      {
        npcId: 'pate_creighton',
        npcName: '亲切的佩特',
        stepNumber: 1,
        totalSteps: 5,
        actionRequired: '与倚坐在门边的佩特对话，穿过铁栅栏陷阱门生还后再次对话，获得【白标记蜡石（大白蜡石）】。',
        warning: '这是佩特与克雷顿恩怨长线的开端，务必听完全部对话！'
      }
    ],
    checklists: [
      {
        id: 'fofg_c1',
        task: '到达主塔篝火，在行商老妪玛伦提雅处购买【雷尼加尔钥匙】与法洛斯石头',
        category: 'essential'
      },
      {
        id: 'fofg_c2',
        task: '深入洞穴找到制图师凯尔，对话至重复获得【如蜜豪宅钥匙】',
        category: 'npc'
      },
      {
        id: 'fofg_c3',
        task: '击败第一个主线BOSS【最后的巨人】，获得【士兵钥匙】与巨人灵魂',
        category: 'boss'
      },
      {
        id: 'fofg_c4',
        task: '用士兵钥匙打开通往咒缚者的门，挑战可选BOSS【咒缚者】；可利用弩炮造成大量伤害',
        category: 'boss'
      },
      {
        id: 'fofg_c5',
        task: '调查咒缚者战场后方的巨鹰鸟巢，被巨鹰抓起直接飞往【遗忘囚笼】',
        category: 'essential'
      }
    ],
    trapsAndTricks: [
      '主塔墙体有炸药桶，引诱投弹杂兵引爆墙体可炸出直接连接篝火的近道！',
      '学者版树下已没有原版的海德骑士；不要按原版路线在这里寻找海德直剑。'
    ],
    connectionsTo: [
      {
        targetId: 'lost_bastille',
        requirement: '击败咒缚者后调查鸟巢乘巨鹰飞往'
      }
    ]
  },
  {
    id: 'lost_bastille',
    name: '遗忘囚笼',
    nameEn: 'The Lost Bastille',
    stage: 'four_souls',
    stageName: '四大古魂之路',
    branch: 'branch_sinner',
    branchName: '罪人分支 (上路)',
    order: 3,
    lane: 0,
    levelRecommendation: 'SL 35 - 50',
    bonfireCount: 5,
    description: '隔海孤立的死寂监牢，用于关押并隔离出现诅咒的不死人，由茫然卫兵看管。',
    lore: '「无论英雄还是凡夫，只要被打上不死印记，最终都将被放逐囚禁于此。」',
    colorTheme: '#64748b',
    bosses: [
      {
        id: 'ruin_sentinels',
        name: '茫然三卫兵 (雷吉姆、亚历桑德、法宾)',
        nameEn: 'Ruin Sentinels',
        isOptional: true,
        tips: '先在高台击杀第一名，再根据另外两名的位置决定继续在台上迎战或跳下。可召唤巡礼者贝尔克娜；小丑托马斯不在此处。',
        transposeWeapon: '强力追踪灵魂箭（Heavy Homing Soul Arrow）'
      }
    ],
    keyItems: [
      {
        id: 'lb_estus',
        name: '原素碎片',
        type: 'estus_shard',
        location: '从麦道夫工房外的恶犬庭院沿建筑外墙窄路绕行，开启木架后方的铁箱；不是跳屋檐破窗。'
      },
      {
        id: 'lb_dull_ember',
        name: '将熄余烬 (枯萎余烬)',
        type: 'key_item',
        location: '原罪学者版在【离塔】篝火旁房间宝箱中(由巨鹰抓取初次抵达处)'
      },
      {
        id: 'bl_bastille_key',
        name: '牢房钥匙',
        type: 'key_item',
        location: '击败茫然三卫兵后，从仆人住处篝火继续沿外墙平台前进，在杂物后方的平台尽头拾取；无需打月亮钟楼石像鬼。'
      }
    ],
    npcInteractions: [
      {
        npcId: 'lucatiel',
        npcName: '米勒的鲁卡提耶',
        stepNumber: 2,
        totalSteps: 7,
        actionRequired: '在离塔篝火旁边的废弃塔楼内与她对话，倾听她对丧失记忆与家乡的忧虑。',
        warning: '若想获得她的装备套装与成就，全游戏中必须召唤她打赢至少3场Boss且她必须幸存！'
      }
    ],
    checklists: [
      {
        id: 'lb_c1',
        task: '点燃离塔篝火，在废塔内与【米勒的鲁卡提耶】对话',
        category: 'npc'
      },
      {
        id: 'lb_c2',
        task: '将炸药桶推下斜坡炸开墙壁，点燃【熟练麦道夫】铁匠房的篝火，交付余烬解锁强化与质变',
        category: 'secret'
      },
      {
        id: 'lb_c3',
        task: '击败BOSS【茫然三卫兵】，获得卫兵灵魂',
        category: 'boss'
      },
      {
        id: 'lb_c4',
        task: '探索钟楼契约区域(月亮钟楼，可选击败石像鬼)',
        category: 'secret'
      },
      {
        id: 'lb_c5',
        task: '穿过长长吊桥前往【罪人塔】',
        category: 'essential'
      }
    ],
    trapsAndTricks: [
      '【熟练麦道夫的宝箱】：麦道夫一直屁股坐在宝箱上不肯挪动；只需点燃火把将他工坊角落里的灯台引燃，并在篝火坐下刷新，他就会起身坐到铁砧前打铁，即可开启他身后的宝箱拿到【名匠金锤】与光辉楔形石！',
      '用怀念香木解除高层牢房门口石化的【孤高法师史垂德】，点燃牢房篝火后可开启Boss灵魂武器兑换与黑衣法师套装获取。',
      '如果不打茫然三卫兵，可以通过密港乘船侧的一系列暗门与小道跳过Boss直通罪人塔。'
    ],
    connectionsTo: [
      {
        targetId: 'sinners_rise',
        requirement: '穿过升降梯吊桥直达'
      },
      {
        targetId: 'belfry_luna',
        requirement: '仆人住处篝火下方使用法洛斯之石开启隐藏门',
        isSecret: true
      }
    ],
    choices: [
      {
        id: 'lost_bastille_belfry_key',
        title: '先取得牢房钥匙，再选择是否探索月亮钟楼',
        situation: '学者版牢房钥匙在仆人住处之后的外墙平台，月亮钟楼已不是取钥匙的必经路线。',
        recommendedChoice: '先取外墙平台的钥匙，打罪人前打开两侧油灯房并点火；钟楼按需探索。',
        options: [
          {
            label: '先取钥匙并点亮罪人战场',
            isRecommended: true,
            consequence: '用钥匙开启罪人塔两侧油灯房，以火把点燃油槽，提高战场照明与可锁定距离。',
            loreReasoning: '学者版将钥匙移出钟楼，方便先处理罪人战的环境。'
          },
          {
            label: '额外挑战月亮钟楼',
            isRecommended: false,
            consequence: '可探索钟卫誓约、挑战石像鬼和收集其他奖励；不影响是否取得牢房钥匙。',
            loreReasoning: '这是独立的可选探索分支。'
          }
        ]
      }
    ]
  },
  {
    id: 'belfry_luna',
    name: '月亮钟楼 (支线)',
    nameEn: 'Belfry Luna',
    stage: 'four_souls',
    stageName: '四大古魂之路',
    branch: 'branch_sinner',
    branchName: '罪人分支 (钟卫区域)',
    order: 3,
    lane: -0.2,
    levelRecommendation: 'SL 40 - 55',
    bonfireCount: 1,
    description: '隐藏在遗忘囚笼下层的机关钟楼，受钟卫侏儒眷属誓死守护。',
    lore: '「那对无法相见的恋人建造了日与月的双钟楼，跨越时空寄托着永不消逝的誓言。」',
    colorTheme: '#6366f1',
    bosses: [
      {
        id: 'belfry_gargoyles',
        name: '守钟的石像鬼',
        nameEn: 'Belfry Gargoyles',
        isOptional: true,
        tips: '多目标战，最多五只同时活跃，总共六只。优先集中伤害击杀一只，避免把多只都打入喷火阶段；不要只压低血量却不收尾。',
        transposeWeapon: '石像鬼双叉枪（Gargoyle Bident）'
      }
    ],
    keyItems: [
      {
        id: 'bl_southern_ring',
        name: '南方仪式指环',
        type: 'key_item',
        location: '钟楼二楼木箱'
      }
    ],
    npcInteractions: [],
    checklists: [
      {
        id: 'bl_c1',
        task: '在仆人住处篝火下方向法洛斯面具嵌入法洛斯石头，击碎幻影假墙进入月亮钟楼',
        category: 'secret'
      },
      {
        id: 'bl_c2',
        task: '与钟卫侏儒对话，可选择加入【钟卫契约】(联机入侵守护钟楼)',
        category: 'npc'
      },
      {
        id: 'bl_c3',
        task: '拉动顶楼铁链拉杆，敲响巨钟升起铁栅栏雾门',
        category: 'essential'
      },
      {
        id: 'bl_c4',
        task: '击败BOSS【守钟的石像鬼】',
        category: 'boss'
      },
      {
        id: 'bl_c5',
        task: '探索石像鬼后方篝火与恶犬庭院，收集奖励；学者版牢房钥匙已移至遗忘囚笼外墙',
        category: 'collectible'
      }
    ],
    trapsAndTricks: [
      '月亮钟楼为可选区域。学者版不用打石像鬼即可在遗忘囚笼拿牢房钥匙；注意钟卫入侵。'
    ],
    connectionsTo: [
      {
        targetId: 'sinners_rise',
        requirement: '携带牢房钥匙前往罪人塔点燃油灯'
      }
    ]
  },
  {
    id: 'sinners_rise',
    name: '罪人塔',
    nameEn: 'Sinner\'s Rise',
    stage: 'four_souls',
    stageName: '四大古魂之路',
    branch: 'branch_sinner',
    branchName: '罪人分支 (上路)',
    order: 4,
    lane: 0,
    levelRecommendation: 'SL 45 - 60',
    bonfireCount: 1,
    description: '浸泡在恶臭污水深渊的牢狱水牢，关押着因试图再次点燃初始之火而获罪的古老受刑者。',
    lore: '「她因重罪将自己囚禁在无光暗渊，怀抱罪孽，永远惩罚着自己……」',
    colorTheme: '#475569',
    bosses: [
      {
        id: 'lost_sinner',
        name: '【始源之火 1/4】被遗忘的罪人',
        nameEn: 'The Lost Sinner',
        isOptional: false,
        isGreatSoul: true,
        tips: '极为敏捷的剑术。如果事先用牢房钥匙点燃Boss房两侧火油，Boss房将变亮，锁定距离大增！可召唤鲁卡提耶助阵。',
        transposeWeapon: '罪人特大剑'
      }
    ],
    keyItems: [
      {
        id: 'sr_fragrant',
        name: '怀念香木',
        type: 'fragrant_branch',
        location: 'Boss房后方始源之火宝箱'
      },
      {
        id: 'sr_lockstone',
        name: '法洛斯石头',
        type: 'pharros_stone',
        location: '罪人塔水下铁栏杆角'
      }
    ],
    npcInteractions: [
      {
        npcId: 'lucatiel',
        npcName: '米勒的鲁卡提耶 (白灵召唤)',
        stepNumber: 3,
        totalSteps: 7,
        actionRequired: '升降机底端召唤鲁卡提耶，击败被遗忘的罪人并且确保她存活。'
      },
      {
        npcId: 'aldia',
        npcName: '原罪学者 安第尔',
        stepNumber: 1,
        totalSteps: 4,
        actionRequired: '若此地是你击败的第四个始源火Boss，安第尔将从始源篝火爆炸现身！若是第一到三个则暂不出现。',
        warning: '只有最后点燃的第四个始源火会首次出现安第尔；请耗尽对话，回答是或否均可。'
      }
    ],
    checklists: [
      {
        id: 'sr_c1',
        task: '清理水牢底层的强化水怪，拾取水底道具',
        category: 'essential'
      },
      {
        id: 'sr_c2',
        task: '使用遗忘囚笼仆人住处后方外墙拾取的【牢房钥匙】，打开罪人塔两侧油灯房并以火把点燃油槽',
        category: 'secret'
      },
      {
        id: 'sr_c3',
        task: '召唤鲁卡提耶，击败伟大的始源古魂BOSS【被遗忘的罪人】',
        category: 'boss'
      },
      {
        id: 'sr_c4',
        task: '点燃第一具【始源之火】，传送返回如蜜',
        category: 'essential'
      }
    ],
    trapsAndTricks: [
      '若不点亮两侧油灯，Boss在暗处会频繁跳出玩家锁定范围，打起来极难捕捉。'
    ],
    connectionsTo: [
      {
        targetId: 'majula',
        requirement: '点燃始源之火传送回如蜜'
      }
    ]
  },
  {
    id: 'heides_tower',
    name: '海德巨火塔',
    nameEn: 'Heide\'s Tower of Flame',
    stage: 'four_souls',
    stageName: '四大古魂之路',
    branch: 'branch_iron_king',
    branchName: '古王分支 (中上路)',
    order: 2,
    lane: 1,
    levelRecommendation: 'SL 20 - 35',
    bonfireCount: 2,
    description: '半淹没于湛蓝汪洋的古代巨石卫城，矗立着沉眠的绿锈古骑士与海德骑士。',
    lore: '「这座被海水吞没的壮美神殿，其建筑风格仿佛重现了昔日神族罗德兰的荣光。」',
    colorTheme: '#0284c7',
    bosses: [
      {
        id: 'dragonrider',
        name: '龙骑兵',
        nameEn: 'Dragonrider',
        isOptional: false,
        tips: '战前可拉动两处扩展战斗平台的机关。也可不扩建平台，利用开局站位诱使其突刺落水；新手建议先升起平台再正常绕身战斗。',
        transposeWeapon: '龙骑兵戟 / 龙骑兵双刃剑 / 龙骑兵大弓'
      }
    ],
    keyItems: [
      {
        id: 'ht_binding_ring',
        name: '【开荒第一神戒】缚誓者戒指 (束缚戒指)',
        type: 'key_item',
        location: '龙骑兵雾门前，由沉睡海德骑士守着的铁宝箱；学者版不在青之圣堂吊桥前。'
      },
      {
        id: 'ht_bone_dust',
        name: '贵人骨灰',
        type: 'sublime_bone_dust',
        location: '击败龙骑兵后沿楼梯和升降梯前往密港，在地下通道支路开启守卫看守的铁箱。'
      }
    ],
    npcInteractions: [
      {
        npcId: 'licia',
        npcName: '林德的莉歇尔 (圣职莉奇亚)',
        stepNumber: 1,
        totalSteps: 4,
        actionRequired: '击败龙骑兵后在上方篝火旁与她对话直至重复，她将移居如蜜地下转动机关通往狩猎森林。'
      }
    ],
    checklists: [
      {
        id: 'ht_c1',
        task: '探索神殿，击败沿途大盾重甲古骑士，激活升起地面的圆环拉杆',
        category: 'essential'
      },
      {
        id: 'ht_c_ring',
        task: '在龙骑兵雾门前开启海德骑士看守的铁箱，取得【缚誓者戒指】',
        category: 'collectible'
      },
      {
        id: 'ht_c2',
        task: '击败BOSS【龙骑兵】(或利用经典的「6步落水法」逃课)',
        category: 'boss'
      },
      {
        id: 'ht_c3',
        task: '在龙骑兵上方篝火处与【林德的莉歇尔】耗尽所有对话',
        category: 'npc'
      },
      {
        id: 'ht_c4',
        task: '向下进入通往水下隧道，前往【密港】',
        category: 'essential'
      }
    ],
    trapsAndTricks: [
      '【缚誓者戒指】：学者版在龙骑兵雾门前的铁箱。可减轻死亡造成的生命上限损失，通常将最低上限由50%提高至75%；不会恢复肉身。',
      '在原罪学者版中，一旦击败龙骑兵，全图原本沉睡的海德骑士会全部苏醒并主动攻击！',
      '吊桥前有一只守门喷火飞龙，开局可以带弓箭从远处台阶卡视野安全射杀。'
    ],
    connectionsTo: [
      {
        targetId: 'cathedral_of_blue',
        requirement: '击败飞龙并放下吊桥前往青之圣堂'
      },
      {
        targetId: 'no_mans_wharf',
        requirement: '乘地下升降机前往密港'
      }
    ]
  },
  {
    id: 'cathedral_of_blue',
    name: '青之圣堂 (支线)',
    nameEn: 'Cathedral of Blue',
    stage: 'four_souls',
    stageName: '四大古魂之路',
    branch: 'branch_iron_king',
    branchName: '古王分支 (分支点)',
    order: 3,
    lane: 0.5,
    levelRecommendation: 'SL 25 - 40',
    bonfireCount: 1,
    description: '孤悬海面之上的神圣教堂，守护着古老誓约与古龙猎人的遗风。',
    lore: '「伫立在大殿中央的长枪骑士，身形与昔日太阳王城的猎龙者翁斯坦如出一辙……」',
    colorTheme: '#3b82f6',
    bosses: [
      {
        id: 'old_dragonslayer',
        name: '古老的猎龙者',
        nameEn: 'Old Dragonslayer',
        isOptional: true,
        tips: '招式类似一代翁斯坦，注意暗属性突刺冲锋与飞天震地，绕背翻滚后输出。',
        transposeWeapon: '猎龙之枪'
      }
    ],
    keyItems: [
      {
        id: 'cob_ring',
        name: '青之骑士团指环 / 锁链指环',
        type: 'key_item',
        location: '加入誓约或击败Boss后宝箱获得'
      }
    ],
    npcInteractions: [
      {
        npcId: 'targray',
        npcName: '青教守护者 达格兰',
        stepNumber: 1,
        totalSteps: 1,
        actionRequired: '击败古老的猎龙者后在神殿内室与他交谈，持有【信义之证】(联机助战胜利获取)可加入【青之守护者】誓约并开启商店购买雷光石与奇迹。'
      }
    ],
    checklists: [
      {
        id: 'cob_c1',
        task: '在海德巨火塔击败守护巨龙，放下吊桥',
        category: 'essential'
      },
      {
        id: 'cob_c2',
        task: '挑战BOSS【古老的猎龙者】',
        category: 'boss'
      },
      {
        id: 'cob_c3',
        task: '与青之守护者达格兰对话，可选择加入【青之守护者】誓约',
        category: 'secret'
      }
    ],
    trapsAndTricks: [
      'Boss门前有一只沉睡的火龙，最好带弓箭快速射杀或引开。'
    ],
    connectionsTo: [
      {
        targetId: 'heides_tower',
        requirement: '返回海德巨火塔'
      }
    ]
  },
  {
    id: 'no_mans_wharf',
    name: '密港',
    nameEn: 'No-man\'s Wharf',
    stage: 'four_souls',
    stageName: '四大古魂之路',
    branch: 'branch_iron_king',
    branchName: '古王分支 (中上路)',
    order: 4,
    lane: 1,
    levelRecommendation: 'SL 30 - 45',
    bonfireCount: 1,
    description: '藏匿于海蚀巨洞下的漆黑海盗海港，充斥着畏光的长臂梦魇怪物与不法暴徒。',
    lore: '「这里曾是不死人被装船押送往遗忘囚笼的最终渡口，如今唯有亡灵与海盗盘踞。」',
    colorTheme: '#0f766e',
    bosses: [
      {
        id: 'flexile_sentry',
        name: '四臂守卫 (流放守卫)',
        nameEn: 'Flexile Sentry',
        isOptional: false,
        tips: '前后各有双臂(持刺剑与棒槌)；战斗中海水会不断上涨降低翻滚速度，需速战速决！可召唤鲁卡提耶。',
        transposeWeapon: '扭曲之刃（曲剑）／弓形大刀／刺针棍'
      }
    ],
    keyItems: [
      {
        id: 'nmw_estus',
        name: '原素碎片',
        type: 'estus_shard',
        location: '海德通往密港的地下通道，使用怀念香木解除挡住楼梯的石化活尸，在石化蛙附近尸体上拾取。'
      },
      {
        id: 'nmw_pyro',
        name: '咒术手套',
        type: 'key_item',
        location: '击败四臂守卫后幽灵船舱宝箱'
      }
    ],
    npcInteractions: [
      {
        npcId: 'lucatiel',
        npcName: '米勒的鲁卡提耶',
        stepNumber: 1,
        totalSteps: 7,
        actionRequired: '在港口民房内与倚着柱子的鲁卡提耶初遇，对话耗尽并可在幽灵船前召唤她参战。',
        warning: '务必召唤她并确保她在四臂守卫战斗中存活！'
      }
    ],
    checklists: [
      {
        id: 'nmw_c1',
        task: '点燃火把，长臂畏光怪物因恐惧火光不敢接近，大幅降低推图难度',
        category: 'essential'
      },
      {
        id: 'nmw_c2',
        task: '登上高处拉响敲钟吊车机关，召唤幽灵海盗船驶入港口泊位',
        category: 'essential'
      },
      {
        id: 'nmw_c3',
        task: '拜访孤独的魔法师卡莉昂(智力需>=8才理你)，可邀请其前往如蜜贩售法术',
        category: 'npc'
      },
      {
        id: 'nmw_c4',
        task: '召唤鲁卡提耶，击败幽灵船舱内的BOSS【四臂守卫】',
        category: 'boss'
      },
      {
        id: 'nmw_c5',
        task: '调查幽灵船舵启动航行，驶向【遗忘囚笼】后方秘道水闸',
        category: 'essential'
      }
    ],
    trapsAndTricks: [
      '用一个法洛斯石头嵌入地面，可点亮整座密港中央的巨型吊灯，使所有畏光怪物全部逃回房内！'
    ],
    connectionsTo: [
      {
        targetId: 'lost_bastille',
        requirement: '启动幽灵船直达遗忘囚笼下层'
      },
      {
        targetId: 'huntsmans_copse',
        requirement: '经由如蜜交2000魂给林德的莉歇尔转动机关'
      }
    ]
  },
  {
    id: 'huntsmans_copse',
    name: '狩猎森林',
    nameEn: 'Huntsman\'s Copse',
    stage: 'four_souls',
    stageName: '四大古魂之路',
    branch: 'branch_iron_king',
    branchName: '古王分支 (中上路)',
    order: 5,
    lane: 1,
    levelRecommendation: 'SL 45 - 60',
    bonfireCount: 3,
    description: '铁之古王昔日用于围猎、屠杀并囚禁不死人的幽暗密林与石桥悬崖。',
    lore: '「残忍的贵族们将不死人视为猎物，驱使恶犬与刑车在此上演血腥狩猎游戏。」',
    colorTheme: '#15803d',
    bosses: [
      {
        id: 'skeleton_lords',
        name: '骷髅王 (三王)',
        nameEn: 'Skeleton Lords',
        isOptional: false,
        tips: '先集火法师骷髅王，逐个击杀！每击杀一个王会分裂出数只小骷髅，切忌同时击杀三王导致小怪围攻。',
        transposeWeapon: '咆哮戟'
      }
    ],
    keyItems: [
      {
        id: 'hc_bone_dust',
        name: '贵人骨灰',
        type: 'sublime_bone_dust',
        location: '从桥边篝火前往下方圆顶建筑（灵魂枪所在处），在守卫看守的铁箱内获得。'
      },
      {
        id: 'hc_lockstone',
        name: '法洛斯石头',
        type: 'pharros_stone',
        location: '圆形石塔顶层跳跃拾取'
      },
      {
        id: 'hc_estus',
        name: '原素碎片',
        type: 'estus_shard',
        location: '从不死人牢房篝火探索骷髅洞穴，在可开启的栅门近道附近、结晶蜥蜴旁的尸体上拾取。'
      }
    ],
    npcInteractions: [
      {
        npcId: 'pate_creighton',
        npcName: '流浪骑士 克雷顿',
        stepNumber: 2,
        totalSteps: 5,
        actionRequired: '使用不死人牢房钥匙救出被锁在圆石塔内的克雷顿，倾听他痛斥被佩特陷害的真相。',
        warning: '佩特与克雷顿互指对方是杀人犯，必须在此救出克雷顿才能推进后续！'
      }
    ],
    checklists: [
      {
        id: 'hc_c1',
        task: '在如蜜交2000魂给林德的莉歇尔转动机关，开启通往狩猎森林大门',
        category: 'essential'
      },
      {
        id: 'hc_c2',
        task: '找到被关押的克雷顿，用牢房钥匙开门救出他并耗尽对话',
        category: 'npc'
      },
      {
        id: 'hc_c3',
        task: '放下石桥机关，前往不死人刑场(可选击败BOSS【查略特刑车】解锁血之同胞誓约)',
        category: 'secret'
      },
      {
        id: 'hc_c4',
        task: '穿过瀑布洞窟，击败BOSS【骷髅王】，降下吊桥前往【流油谷】',
        category: 'boss'
      }
    ],
    trapsAndTricks: [
      '骷髅群非常容易被【诱敌头盖骨】吸引，带几个头盖骨打骷髅王和刑车轻松十倍！'
    ],
    connectionsTo: [
      {
        targetId: 'harvest_valley',
        requirement: '击败骷髅王降下吊桥'
      },
      {
        targetId: 'undead_purgatory',
        requirement: '放下石桥拉杆，穿过巨大悬崖吊桥前往刑场',
        isSecret: true
      }
    ]
  },
  {
    id: 'undead_purgatory',
    name: '不死人刑场 (支线)',
    nameEn: 'Undead Purgatory',
    stage: 'four_souls',
    stageName: '四大古魂之路',
    branch: 'branch_iron_king',
    branchName: '古王分支 (死斗刑场)',
    order: 5,
    lane: 0.5,
    levelRecommendation: 'SL 50 - 65',
    bonfireCount: 1,
    description: '孤悬于悬崖绝壁上的圆形角斗竞技场，由疯狂疾驰的黑铁双头战马刑车昼夜巡弋。',
    lore: '「古王将反抗者与被俘的不死人丢入刑场，供贵族观赏战马将他们碾得粉身碎骨。」',
    colorTheme: '#b91c1c',
    bosses: [
      {
        id: 'executioners_chariot',
        name: '查略特刑车',
        nameEn: 'Executioner\'s Chariot',
        isOptional: true,
        tips: '开局躲入墙壁凹槽躲避每圈疾驰的刑车；沿途击杀两位复活骷髅的死灵法师；在通道尽头拉下铁闸拉杆撞毁刑车，再迎战受伤的双头战马。弱雷。',
        transposeWeapon: '查略特骑枪／盾弩（Shield Crossbow）'
      }
    ],
    keyItems: [
      {
        id: 'up_chloranthy',
        name: '绿花戒指+2 (二周目/添火)',
        type: 'key_item',
        location: '刑场添火击败刑车掉落，精力恢复速度极大提升'
      }
    ],
    npcInteractions: [
      {
        npcId: 'gren',
        npcName: '小矮人 格雷南 (血之同胞誓约)',
        stepNumber: 1,
        totalSteps: 1,
        actionRequired: '背包持有【憎恨之证】(联机入侵击败宿主或圣人墓地大坑拾取)与他对话，可加入全游戏最嗜血的【血之同胞】暗杀誓约并购买无限火焰箭与龟裂红眸之石。'
      }
    ],
    checklists: [
      {
        id: 'up_c1',
        task: '穿过狭窄悬崖吊桥，躲避黑灵红影长柄大刀守门人',
        category: 'essential'
      },
      {
        id: 'up_c2',
        task: '投掷诱敌头盖骨引开骷髅，冲刺击杀两名死灵法师并拉下铁闸栏',
        category: 'essential'
      },
      {
        id: 'up_c3',
        task: '击败BOSS【查略特刑车】',
        category: 'boss'
      },
      {
        id: 'up_c4',
        task: '点燃刑场篝火，与小矮人格雷南对话加入【血之同胞誓约】',
        category: 'secret'
      }
    ],
    trapsAndTricks: [
      '诱敌头盖骨是此图神物！扔一个头盖骨，全场骷髅会发疯聚在一起，根本不管你，直接一路冲到闸门拉杆。'
    ],
    connectionsTo: [
      {
        targetId: 'huntsmans_copse',
        requirement: '过吊桥返回狩猎森林主干道'
      }
    ]
  },
  {
    id: 'harvest_valley',
    name: '流油谷',
    nameEn: 'Harvest Valley',
    stage: 'four_souls',
    stageName: '四大古魂之路',
    branch: 'branch_iron_king',
    branchName: '古王分支 (中上路)',
    order: 6,
    lane: 1,
    levelRecommendation: 'SL 50 - 65',
    bonfireCount: 2,
    description: '弥漫浓烈剧毒绿雾的矿山采掘场，地下浸泡着腐蚀性的毒液泥潭。',
    lore: '「这片谷地蕴藏着丰饶的矿脉，但在贪婪毒雾的侵蚀下，开采者皆沦为毒囊异形。」',
    colorTheme: '#65a30d',
    bosses: [],
    keyItems: [
      {
        id: 'hv_fragrant',
        name: '怀念香木',
        type: 'fragrant_branch',
        location: '毒雾深坑洞穴宝箱'
      },
      {
        id: 'hv_sunlight_altar',
        name: '太阳祭坛 (加入太阳誓约)',
        type: 'key_item',
        location: '断桥后方隐秘山洞内，学会赞美太阳姿势'
      }
    ],
    npcInteractions: [
      {
        npcId: 'chloanne',
        npcName: '石商人 克洛安娜',
        stepNumber: 1,
        totalSteps: 2,
        actionRequired: '在采掘场首个篝火旁的岩石上与她交谈耗尽所有对话，她将移居如蜜成为供应全强化矿石的核心商人！'
      },
      {
        npcId: 'gavlan',
        npcName: '孤独的噶瓦兰',
        stepNumber: 2,
        totalSteps: 3,
        actionRequired: '在第一个毒雾大坑后方的山洞深处遇到他，可清理背包卖废品换取灵魂并采购毒箭与解毒药。'
      }
    ],
    checklists: [
      {
        id: 'hv_c1',
        task: '备足解毒药，探索毒雾大坑拾取钛晶石块与怀念香木',
        category: 'collectible'
      },
      {
        id: 'hv_c_chloanne',
        task: '在采掘场篝火旁与【石商人克洛安娜】耗尽对话，使其搬迁至如蜜铁匠铺旁',
        category: 'npc'
      },
      {
        id: 'hv_c_gavlan',
        task: '在山洞中找到【噶瓦兰】，卖出冗余装备换取灵魂并备齐解毒药与毒箭',
        category: 'npc'
      },
      {
        id: 'hv_c2',
        task: '找到山崖洞穴内的【太阳祭坛】，加入太阳誓约(开启联机刷太阳徽章之路)',
        category: 'secret'
      },
      {
        id: 'hv_c3',
        task: '从流油谷进入推土坊下层，先探索毒罐支路找到【鲁卡提耶】，再挑战入口大厅的【贪婪恶魔】',
        category: 'boss'
      },
      {
        id: 'hv_c4',
        task: '乘梯步入高耸冒烟的工业巨塔【推土坊】',
        category: 'essential'
      }
    ],
    trapsAndTricks: [
      '毒雾会积累中毒。装备耐久腐蚀与中毒是不同机制，不要把所有毒池都当作酸液池；备解毒药并注意安全落脚点。'
    ],
    connectionsTo: [
      {
        targetId: 'earthen_peak',
        requirement: '击败贪婪恶魔直接进入'
      }
    ]
  },
  {
    id: 'earthen_peak',
    name: '推土塔 (推土坊)',
    nameEn: 'Earthen Peak',
    stage: 'four_souls',
    stageName: '四大古魂之路',
    branch: 'branch_iron_king',
    branchName: '古王分支 (中上路)',
    order: 7,
    lane: 1,
    levelRecommendation: 'SL 55 - 70',
    bonfireCount: 3,
    description: '巨大的毒性风车加工厂，由沉溺美貌而身化半人半蛇的毒妃米妲所统领。',
    lore: '「王妃米妲为了博取铁之古王的倾心，服下剧毒之药保持妖娆容颜，终招致灭顶之灾。」',
    colorTheme: '#854d0e',
    bosses: [
      {
        id: 'covetous_demon',
        name: '贪婪恶魔',
        nameEn: 'Covetous Demon',
        isOptional: false,
        tips: '极其笨重，绕到身侧或尾部狂打；可用弓箭射击天花板吊罐释放尸体吸引其进食。',
        transposeWeapon: '贪婪恶魔骨镰'
      },
      {
        id: 'mytha',
        name: '毒妃米妲',
        nameEn: 'Mytha, the Baneful Queen',
        isOptional: false,
        tips: '推荐在中层篝火附近点燃火把，烧毁风车转轴，排掉Boss场地中央毒液。外圈仍有毒，米妲进入毒中仍会回血。可召唤小丑托马斯。',
        transposeWeapon: '米妲弯刃（Mytha\'s Bent Blade，匕首）'
      }
    ],
    keyItems: [
      {
        id: 'ep_gilligan_ladder',
        name: '梯子吉里甘移居',
        type: 'key_item',
        location: '击破外侧木栅栏与吉里甘对话花费2000魂架设梯子'
      }
    ],
    npcInteractions: [
      {
        npcId: 'pate_creighton',
        npcName: '亲切的佩特',
        stepNumber: 3,
        totalSteps: 5,
        actionRequired: '找到佩特，绕行拾取他提到的宝物并从另一侧打开近道门，再耗尽对话；克雷顿的第二次会面在虚影遗迹，不在推土坊。'
      },
      {
        npcId: 'lucatiel',
        npcName: '米勒的鲁卡提耶',
        stepNumber: 3,
        totalSteps: 7,
        actionRequired: '在贪婪恶魔前的下层毒罐支路，法洛斯机关对面的房间与她耗尽对话，之后可在镕铁恶魔雾门前召唤她。'
      }
    ],
    checklists: [
      {
        id: 'ep_c1',
        task: '【至关重要】：在中层篝火旁点燃火把，走上风车外缘点燃转轴木料，烧毁整座风车！',
        category: 'essential'
      },
      {
        id: 'ep_c2',
        task: '在外侧阳台找到吉里甘，按需付2000魂架梯取宝；击败米妲后他会移居如蜜，无需把买梯子当作搬迁条件',
        category: 'npc'
      },
      {
        id: 'ep_c3',
        task: '击败BOSS【毒妃米妲】(已烧风车状态下召唤强力火法小丑托马斯单刷Boss)',
        category: 'boss'
      },
      {
        id: 'ep_c4',
        task: '乘坐Boss房后方的大型升降梯，穿过岩层上升来到火山口上的【镕铁城】',
        category: 'essential'
      }
    ],
    trapsAndTricks: [
      '如果不烧风车打米妲，属于魂2最折磨的噩梦挑战之一；烧掉风车后直接变为简单难度。',
      '隐藏门：在米妲雾门正上方有一整面隐藏墙壁，推开里面是篝火和强力宝箱。',
      '贪婪恶魔位于推土坊入口大厅。先在下层毒罐支路与鲁卡提耶交谈，再继续上塔；佩特支线需绕行打开他附近的门并耗尽对话。'
    ],
    connectionsTo: [
      {
        targetId: 'iron_keep',
        requirement: '乘后方升降梯直升镕铁城'
      }
    ],
    choices: [
      {
        id: 'earthen_peak_windmill',
        title: '烧毁巨型毒风车站桩决断',
        situation: '在推土坊中层篝火附近有一处凸向风车轴承的狭窄斜坡，手持点燃的火把靠近转轴时会弹出互动提示。',
        recommendedChoice: '推荐先烧风车，排掉场地中央毒液。',
        options: [
          {
            label: '点燃火把烧毁中央风车轴承',
            isRecommended: true,
            consequence: '中央场地毒液排去，可以在干地战斗；外圈毒液仍会让米妲回血，尽量把她留在中央。可召唤小丑托马斯协助。',
            loreReasoning: '毒妃米妲赖以长生与美貌的毒泉网络被彻底切断。'
          },
          {
            label: '不烧风车直接硬闯毒妃米妲雾门',
            isRecommended: false,
            consequence: '场地中央也有毒液，玩家需应对中毒，米妲在毒中持续回血。可以挑战，但对伤害、解毒与恢复资源要求更高。',
            spoilerContent: '不烧风车并非禁止通关，只是显著增加战斗压力。',
            loreReasoning: '在毒妃的本命毒潭中与她搏杀几乎等于自杀。'
          }
        ]
      }
    ]
  },
  {
    id: 'iron_keep',
    name: '镕铁城',
    nameEn: 'Iron Keep',
    stage: 'four_souls',
    stageName: '四大古魂之路',
    branch: 'branch_iron_king',
    branchName: '古王分支 (中上路)',
    order: 8,
    lane: 1,
    levelRecommendation: 'SL 65 - 80',
    bonfireCount: 3,
    description: '因过于沉重而彻底沉没进炽热岩浆火海的黑铁要塞，由亚伦骑士团与熔岩恶魔驻守。',
    lore: '「古王因傲慢建造了宏伟黑铁城堡，大地不堪重负塌陷沉入地心岩浆，古王亦被恶魔撕裂。」',
    colorTheme: '#ea580c',
    bosses: [
      {
        id: 'smelter_demon',
        name: '镕铁恶魔 (可选)',
        nameEn: 'Smelter Demon',
        isOptional: true,
        tips: '三阶段火焰爆发自燃掉血；穿高火抗装备、喝水滴回血，躲避砸地冲击波。击败可开启极近篝火。',
        transposeWeapon: '镕铁剑'
      },
      {
        id: 'old_iron_king',
        name: '【始源之火 2/4】铁之古王',
        nameEn: 'Old Iron King',
        isOptional: false,
        isGreatSoul: true,
        tips: '巨大熔岩伊扎里斯恶魔！站在拐角避开横扫火柱与激光；最大的杀手是场地角落的【失足岩浆小洞】，切勿后滚掉入岩浆！',
        transposeWeapon: '巨铁兵大锤（Iron King Hammer）；铁之古王冠在DLC黑雾之塔取得'
      }
    ],
    keyItems: [
      {
        id: 'ik_iron_key',
        name: '镕铁钥匙',
        type: 'key_item',
        location: '大火喷吐机关下的火焰尸体(需抗火翻滚拾取)，开启巨森蝾螈地下火蜥蜴洞'
      },
      {
        id: 'ik_dlc_key',
        name: '重铁钥匙 (DLC2入口道具)',
        type: 'key_item',
        location: '原罪学者版在火焰蝾螈洞穴拾取'
      },
      {
        id: 'bs_chaos_storm',
        name: '混沌风暴',
        type: 'spell',
        location: '铁炉大厅后方活动铁桥区域，下至岩浆中的狭窄石路，开启尽头铁箱；先准备火抗、湿身与恢复道具。'
      }
    ],
    npcInteractions: [
      {
        npcId: 'aldia',
        npcName: '原罪学者 安第尔',
        stepNumber: 1,
        totalSteps: 4,
        actionRequired: '若这是你的第四个始源之火，安第尔将从点火坑中剧烈爆发出现！'
      },
      {
        npcId: 'lucatiel',
        npcName: '米勒的鲁卡提耶（镕铁恶魔助战）',
        stepNumber: 4,
        totalSteps: 7,
        actionRequired: '在推土坊与她对话后，可于镕铁恶魔雾门前召唤她。胜利且她存活可计入三场要求，也可添火重复累计。'
      }
    ],
    checklists: [
      {
        id: 'ik_c1',
        task: '降下铁桥，清理成群亚伦骑士弓箭手',
        category: 'essential'
      },
      {
        id: 'ik_c2',
        task: '可在镕铁恶魔雾门前召唤【鲁卡提耶】，确保她存活后获胜；此Boss可跳过，但能计入她的支线场次',
        category: 'boss'
      },
      {
        id: 'ik_c3',
        task: '利用法洛斯水池淋湿身体增加火抗，在岩浆小道上翻滚开宝箱',
        category: 'secret'
      },
      {
        id: 'ik_c4',
        task: '击败伟大的始源古魂BOSS【铁之古王】，小心脚下的小熔岩坑！',
        category: 'boss'
      },
      {
        id: 'ik_c5',
        task: '在始源之火后方房间调查祭坛，可传送至【DLC2 黑雾之塔】(需重铁钥匙)',
        category: 'secret'
      },
      {
        id: 'ik_c6',
        task: '点燃第二具【始源之火】，传送回如蜜',
        category: 'essential'
      }
    ],
    trapsAndTricks: [
      '铁之古王真正的本体是场地里的那个小洞！被火掌推下去直接融化，时刻保持贴近右侧雾门墙壁。'
    ],
    connectionsTo: [
      {
        targetId: 'majula',
        requirement: '点燃始源之火传送回如蜜'
      },
      {
        targetId: 'dlc_brume_tower',
        requirement: '始源火后方蛇头方尖碑传送(DLC2入口)'
      },
      {
        targetId: 'belfry_sol',
        requirement: '艾刚篝火旁使用法洛斯之石破开幻影墙进入太阳钟楼',
        isSecret: true
      }
    ]
  },
  {
    id: 'belfry_sol',
    name: '太阳钟楼 (支线)',
    nameEn: 'Belfry Sol',
    stage: 'four_souls',
    stageName: '四大古魂之路',
    branch: 'branch_iron_king',
    branchName: '古王分支 (钟卫要塞)',
    order: 8,
    lane: 0.8,
    levelRecommendation: 'SL 70 - 85',
    bonfireCount: 1,
    description: '矗立在镕铁要塞内侧的高空火红钟楼，与月亮钟楼遥相呼应。',
    lore: '「古老恋人的誓约在烈火中化为永恒，狂热的钟卫猎犬绝不容许侵入者敲响太阳之钟。」',
    colorTheme: '#ea580c',
    bosses: [],
    keyItems: [
      {
        id: 'bs_simple_spice',
        name: '不逊香料 / 愚者香料',
        type: 'key_item',
        location: '屋顶角落尸体'
      }
    ],
    npcInteractions: [],
    checklists: [
      {
        id: 'bs_c1',
        task: '使用法洛斯之石击碎幻影门进入太阳钟楼',
        category: 'secret'
      },
      {
        id: 'bs_c2',
        task: '与钟卫矮人交谈，可加入或推进【钟卫誓约】等级',
        category: 'npc'
      },
      {
        id: 'bs_c3',
        task: '清理沿途双刀侏儒与弩手，拉动铁链敲响太阳之钟升起铁门',
        category: 'essential'
      },
      {
        id: 'bs_c4',
        task: '探索钟楼收集咒术与强化素材；混沌风暴需返回镕铁城的岩浆宝箱取得',
        category: 'collectible'
      },
      {
        id: 'bs_c5',
        task: '从阳台跳下直接落回镕铁城主干道中层',
        category: 'essential'
      }
    ],
    trapsAndTricks: [
      '狂战士黑灵是刷离线钟卫契约30次升级拿【隐形武器】法术(全法术成就必需)的最快途径！',
      '狂战士是加入钟卫后概率出现的可重复击杀敌人，不是拥有独立Boss血条的首领；可刷取其武器与防具。'
    ],
    connectionsTo: [
      {
        targetId: 'iron_keep',
        requirement: '从屋檐阳台跳下返回镕铁城'
      }
    ]
  },
  {
    id: 'shaded_woods',
    name: '虚影森林',
    nameEn: 'Shaded Woods',
    stage: 'four_souls',
    stageName: '四大古魂之路',
    branch: 'branch_brightstone',
    branchName: '蜘蛛分支 (中下路)',
    order: 2,
    lane: 2,
    levelRecommendation: 'SL 40 - 55',
    bonfireCount: 3,
    description: '如蜜北方被浓厚白雾与透明暗杀者笼罩的迷惘森林，暗藏着古龙研究遗迹与狮人族。',
    lore: '「安第尔公爵在此进行禁忌实验，迷雾中潜伏着失去头颅的狂战士与嗜血的蝎形异种。」',
    colorTheme: '#059669',
    bosses: [
      {
        id: 'scorp_najka',
        name: '蝎子纳吉卡',
        nameEn: 'Scorpion Najka',
        isOptional: false,
        tips: '潜入沙中时站在石板地面上可免受地底突刺偷袭；可召唤蝎子男塔克共同迎战。',
        transposeWeapon: '灵魂降雹（Soul Shower）'
      }
    ],
    keyItems: [
      {
        id: 'sw_estus',
        name: '原素碎片',
        type: 'estus_shard',
        location: '解除罗莎贝娜石化、拉杆开门后，在下一间大厅底层楼梯右侧房间的铁箱内；不在浓雾森林。'
      },
      {
        id: 'sw_fragrant',
        name: '怀念香木',
        type: 'fragrant_branch',
        location: '击败石化狮子战士获取钥匙开启地下牢房'
      },
      {
        id: 'sw_whisper_ring',
        name: '低语戒指',
        type: 'key_item',
        location: '如蜜猫咪处购买，戴上后可与蝎子男塔克对话'
      },
      {
        id: 'sw_bone_dust',
        name: '贵人骨灰',
        type: 'sublime_bone_dust',
        location: '从虚影遗迹篝火附近窗口跳至石化狮子战士所在区域，探索左侧建筑，开启守卫看守的铁箱。'
      }
    ],
    npcInteractions: [
      {
        npcId: 'benhart',
        npcName: '优格的本哈特',
        stepNumber: 1,
        totalSteps: 5,
        actionRequired: '在被石化的罗莎贝娜门前与手握发光大剑的他交谈；用怀念香木解救罗莎贝娜后再次与他对话，他由衷致谢并承诺后续有难必帮。'
      },
      {
        npcId: 'herald',
        npcName: '石化魔女 罗莎贝娜',
        stepNumber: 1,
        totalSteps: 1,
        actionRequired: '使用【怀念香木】解除她在如蜜北门拉杆前的石化状态，赠送她任意衣服，她将回如蜜升级咒术。'
      },
      {
        npcId: 'ornifex',
        npcName: '鸟人铁匠 欧尼佛斯',
        stepNumber: 1,
        totalSteps: 2,
        actionRequired: '解石化狮子获得钥匙，跳入地陷陷阱木地板解救被困在牢房中的鸟人铁匠，她将返回辉石镇开店。',
        warning: '她是全游戏唯一能用Boss灵魂兑换顶级高阶武器的终极铁匠，切勿伤她！'
      },
      {
        npcId: 'grandahl',
        npcName: '暗之巡礼者 格兰达尔',
        stepNumber: 1,
        totalSteps: 3,
        actionRequired: '在长满高草的大深坑地下找到轮椅老人格兰达尔，与其对话开启【深渊契约】第一步。'
      },
      {
        npcId: 'pate_creighton',
        npcName: '流浪骑士 克雷顿',
        stepNumber: 3,
        totalSteps: 5,
        actionRequired: '在狩猎森林救出他后，到虚影遗迹通往蝎子纳吉卡方向的右侧塔顶再次耗尽对话，推进辉石镇决斗。'
      }
    ],
    checklists: [
      {
        id: 'sw_c1',
        task: '用香木解除罗莎贝娜石化，拉动开门拉杆',
        category: 'essential'
      },
      {
        id: 'sw_c_benhart',
        task: '在解救罗莎贝娜前后与【优格的本哈特】对话，开启月光大剑白金支线',
        category: 'npc'
      },
      {
        id: 'sw_c2',
        task: '沿浓雾区左侧岩壁找到【温格头颅】，耗尽对话取得头盔；无头身躯在虚影遗迹的石化狮子后方，击杀后可解锁红锈武器购买与召唤',
        category: 'npc'
      },
      {
        id: 'sw_c3',
        task: '佩戴低语之戒与蝎子男塔克对话，约定诛杀其疯狂的伴侣纳吉卡',
        category: 'npc'
      },
      {
        id: 'sw_c4',
        task: '解救地洞中的【鸟人铁匠欧尼佛斯】',
        category: 'secret'
      },
      {
        id: 'sw_c5',
        task: '击败BOSS【蝎子纳吉卡】，进入【法洛斯门径】',
        category: 'boss'
      }
    ],
    trapsAndTricks: [
      '迷雾森林中的半透明幽灵敌人无法被锁定，不要盲目奔跑，顺着左侧崖壁一直走即可到达温格头颅处。'
    ],
    connectionsTo: [
      {
        targetId: 'doors_of_pharros',
        requirement: '击败纳吉卡穿过石窟'
      },
      {
        targetId: 'shrine_of_winter',
        requirement: '歧路分岔向左通往冬之庙(需4巨魂开启)'
      }
    ]
  },
  {
    id: 'doors_of_pharros',
    name: '法洛斯门径',
    nameEn: 'Doors of Pharros',
    stage: 'four_souls',
    stageName: '四大古魂之路',
    branch: 'branch_brightstone',
    branchName: '蜘蛛分支 (中下路)',
    order: 3,
    lane: 2,
    levelRecommendation: 'SL 45 - 60',
    bonfireCount: 2,
    description: '机关匠人法洛斯建造的错综复杂的地下蓄水遗迹，遍布法洛斯机关孔与鼠人卫士。',
    lore: '「机关大师法洛斯周游世界，将无数暗锁与宝藏留在了这片受鼠王管辖的地下水窟。」',
    colorTheme: '#0d9488',
    bosses: [
      {
        id: 'royal_rat_authority',
        name: '鼠王试炼 (可选)',
        nameEn: 'Royal Rat Authority',
        isOptional: true,
        tips: '开局迅速用火球或弓箭清掉4只剧毒小鼠；对巨鼠贴肚皮钻胯下猛砍后腿，当心中毒。',
        transposeWeapon: '酸液喷射（Acid Surge）'
      }
    ],
    keyItems: [
      {
        id: 'dp_faintstone',
        name: '苍天石 (法术质变石)',
        type: 'key_item',
        location: '水池宝箱'
      },
      {
        id: 'dp_bow',
        name: '海象重斧 / 关刀',
        type: 'key_item',
        location: '击败海象矮人掉落'
      }
    ],
    npcInteractions: [
      {
        npcId: 'gavlan',
        npcName: '孤独的噶瓦兰 (永久定居点)',
        stepNumber: 3,
        totalSteps: 3,
        actionRequired: '穿过浅水滩走上通往辉石镇的旋转石阶，在尽头洞窟中找到噶瓦兰。他在此永久定居！无限收购玩家冗余装备道具换取大量灵魂，并无限出售推图最强神器【毒箭】！'
      }
    ],
    checklists: [
      {
        id: 'dp_c1',
        task: '穿过主干道直接向上前往辉石镇(水池侧为可选鼠王誓约地)',
        category: 'essential'
      },
      {
        id: 'dp_c_gavlan',
        task: '拜访永久定居阶梯尽头的【噶瓦兰】，变卖废旧装备并屯足无限供应的【毒箭】',
        category: 'npc'
      },
      {
        id: 'dp_c2',
        task: '挑战可选BOSS【鼠王试炼】，与鼠王对话可加入【鼠王誓约】',
        category: 'secret'
      },
      {
        id: 'dp_c3',
        task: '收集沿途法洛斯石头与战利品，穿过石阶步入【辉石镇盖儿·诺姆】',
        category: 'essential'
      }
    ],
    trapsAndTricks: [
      '【毒箭之王噶瓦兰在此永久定居】：噶瓦兰会在此处无限出售【毒箭】(60魂/支)与毒飞刀。强烈建议一次性购入200~300支毒箭，后面阿玛娜祭坛、王都和DLC的各类难缠小怪与红魂均可远程毒杀逃课！',
      '大部分水坑里的法洛斯机关孔是陷阱或释放怪物的装置，不要随意把宝贵的石头全插进去！'
    ],
    connectionsTo: [
      {
        targetId: 'brightstone_cove',
        requirement: '穿过上层石道直通辉石镇'
      }
    ]
  },
  {
    id: 'brightstone_cove',
    name: '辉石镇盖儿·诺姆',
    nameEn: 'Brightstone Cove Tseldora',
    stage: 'four_souls',
    stageName: '四大古魂之路',
    branch: 'branch_brightstone',
    branchName: '蜘蛛分支 (中下路)',
    order: 4,
    lane: 2,
    levelRecommendation: 'SL 55 - 75',
    bonfireCount: 3,
    description: '开采出璀璨灵魂结晶但最终被公爵的疯狂与白龙实验所吞噬的蜘蛛寄生之城。',
    lore: '「盖儿·诺姆公爵痴迷于古老白龙希斯的结晶智慧，最终整座小镇沉沦为蛛网孵化场。」',
    colorTheme: '#0891b2',
    bosses: [
      {
        id: 'prowling_magus',
        name: '徘徊主教与信徒',
        nameEn: 'Prowling Magus and Congregation',
        isOptional: false,
        tips: '群体战。先冲上前秒掉两只回血白袍圣职，再清杂兵，最后围殴主教，极其脆皮。',
        transposeWeapon: '不掉落可兑换的Boss灵魂'
      },
      {
        id: 'freja',
        name: '【始源之火 3/4】公爵的夫席·弗蕾札',
        nameEn: 'The Duke\'s Dear Freja',
        isOptional: false,
        isGreatSoul: true,
        tips: '【核心机制】：手持火把时全场小蜘蛛不敢靠近你！弗蕾札全身上下仅有正反两颗头颅受伤害，诱使其喷吐激光时猛打另一侧头颅！',
        transposeWeapon: '弗蕾札魂：蜘蛛牙／蜘蛛针；篝火强度2以上额外掉落远古白龙魂，可换月光大剑／灵魂结晶枪'
      }
    ],
    keyItems: [
      {
        id: 'bc_estus_1',
        name: '原素碎片 (下层民宅)',
        type: 'estus_shard',
        location: '从高处滑索滑落至悬崖平台民房内'
      },
      {
        id: 'bc_ornifex_shop',
        name: '欧尼佛斯武器工坊',
        type: 'key_item',
        location: '下层蛛网区域底部木门内开张营业'
      },
      {
        id: 'bc_ancient_dragon_soul',
        name: '古龙之魂 (巨龙回忆)',
        type: 'key_item',
        location: '持有灰雾核心后返回弗蕾札战场，调查结晶进入古龙回忆，再调查巨龙遗骸取得。'
      }
    ],
    npcInteractions: [
      {
        npcId: 'benhart',
        npcName: '优格的本哈特 (礼拜堂助战)',
        stepNumber: 2,
        totalSteps: 5,
        actionRequired: '在礼拜堂营火旁帐篷内找到本哈特的召唤印，召唤他参战击败BOSS【徘徊主教与信徒】并确保其存活！'
      },
      {
        npcId: 'pate_creighton',
        npcName: '佩特与克雷顿 (宿命决斗)',
        stepNumber: 4,
        totalSteps: 5,
        actionRequired: '在下层民居中撞见佩特与克雷顿生死搏杀！协助其中一人斩杀另一人，获胜者会赠送你【特瑟尔朵拉隐秘钥匙】。',
        warning: '若直接两人都不帮或全杀，将无法正常拿到宝库奖励。'
      },
      {
        npcId: 'ornifex',
        npcName: '鸟人铁匠 欧尼佛斯',
        stepNumber: 2,
        totalSteps: 2,
        actionRequired: '在底层工坊与她对话，首次兑换Boss灵魂武器免费！此后可随意锻造所有王魂神兵。'
      }
    ],
    checklists: [
      {
        id: 'bc_c1',
        task: '穿过农夫帐篷营地，在礼拜堂击败BOSS【徘徊主教与信徒】',
        category: 'boss'
      },
      {
        id: 'bc_c_benhart',
        task: '在礼拜堂帐篷内召唤【优格的本哈特】协助击败主教并保证其幸存',
        category: 'npc'
      },
      {
        id: 'bc_c2',
        task: '利用滑索飞跃沙谷，在民宅见证【佩特与克雷顿的死斗】，二选一做出抉择',
        category: 'npc'
      },
      {
        id: 'bc_c3',
        task: '手持火把震慑小蜘蛛，击败伟大的始源古魂BOSS【公爵的夫席·弗蕾札】',
        category: 'boss'
      },
      {
        id: 'bc_c4',
        task: '【重要提醒】：弗蕾札死后必须走到悬崖边拾取发光的【伟大灵魂】(始源之火)',
        category: 'essential'
      },
      {
        id: 'bc_c5',
        task: '取得灰雾核心后再返回弗蕾札战场，调查结晶进入【古龙回忆】拾取古龙之魂；首次击杀时暂时不能进入',
        category: 'secret'
      },
      {
        id: 'bc_c6',
        task: '点燃第三具【始源之火】，传送回如蜜',
        category: 'essential'
      }
    ],
    trapsAndTricks: [
      '弗蕾札本身不会掉落始源火，必须自己动手从地面的红色发光遗迹拾取！很多新手打完以为没掉巨魂卡关。',
      '学者版手持火把能驱赶小蜘蛛，但不能防住弗蕾札本体的攻击，也不要在收起火把后仍假定蜘蛛不会接近。'
    ],
    connectionsTo: [
      {
        targetId: 'majula',
        requirement: '点燃始源之火传送回如蜜'
      }
    ],
    choices: [
      {
        id: 'brightstone_pate_creighton',
        title: '佩特与克雷顿决斗',
        situation: '先完成佩特在巨森、推土坊的对话和开门事件，以及克雷顿在狩猎森林、虚影遗迹的对话，二人才会在辉石镇民居决斗。',
        recommendedChoice: '按偏好帮助其中一人，主动造成足够伤害，战后与幸存者对话取钥匙。',
        options: [
          {
            label: '帮助克雷顿',
            isRecommended: true,
            consequence: '佩特掉佩特之枪与荆棘戒指；与克雷顿对话可取得其防具和隐匿处钥匙。宝库有爆炸陷阱，开箱及时后撤，奖励包括雕刻护腕与生锈硬币。',
            loreReasoning: '两人各执一词，不能把帮助哪一方视为官方善恶判定。'
          },
          {
            label: '帮助佩特',
            isRecommended: false,
            consequence: '克雷顿掉铁面具，其余防具可向老妪购买；与佩特对话取隐匿处钥匙。佩特自己的整套赠礼另取决于此前最后巨人助战与推土坊对话。',
            loreReasoning: '选择另一方同样可以取得宝库钥匙。'
          },
          {
            label: '旁观或同时攻击两人',
            isRecommended: false,
            consequence: '仅旁观可能拿不到幸存者的对话奖励；推荐先帮助一方并完成取钥匙对话。不要指望老妪出售任务钥匙。',
            loreReasoning: '任务奖励需要满足助战与对话条件。'
          }
        ]
      }
    ]
  },
  {
    id: 'grave_of_saints',
    name: '圣人墓地',
    nameEn: 'Grave of Saints',
    stage: 'four_souls',
    stageName: '四大古魂之路',
    branch: 'branch_gutter',
    branchName: '腐败分支 (下路)',
    order: 2,
    lane: 3,
    levelRecommendation: 'SL 35 - 50',
    bonfireCount: 2,
    description: '如蜜大坑深处由啮齿群鼠与暗影守护的古代墓窟。',
    lore: '「人类弃绝了这片阴暗地底，群鼠在鼠王的带领下尊奉着属于它们的古老荣光。」',
    colorTheme: '#78716c',
    bosses: [
      {
        id: 'royal_rat_vanguard',
        name: '鼠王先锋 (可选)',
        nameEn: 'Royal Rat Vanguard',
        isOptional: true,
        tips: '无数老鼠涌出；盯紧背上有显眼黑色浓密莫西干鬃毛的本体鼠王，速杀它即通关。',
        transposeWeapon: '剧毒雾（Toxic Mist）'
      }
    ],
    keyItems: [
      {
        id: 'gos_bone_dust',
        name: '贵人骨灰',
        type: 'sublime_bone_dust',
        location: '如蜜大坑通往废渊的入口前，在守卫看守的铁箱内取得；可沿大坑下层路线到达，不要求击败鼠王先锋。'
      }
    ],
    npcInteractions: [],
    checklists: [
      {
        id: 'gos_c1',
        task: '购买如蜜猫咪【银猫戒指】或让吉里甘架设梯子，安全下跳如蜜大坑第一洞口',
        category: 'essential'
      },
      {
        id: 'gos_c2',
        task: '击败BOSS【鼠王先锋】，与鼠王对话可加入鼠王契约',
        category: 'secret'
      },
      {
        id: 'gos_c3',
        task: '从吊桥向下攀爬悬崖梯子，坠入无底深渊【废渊】',
        category: 'essential'
      }
    ],
    trapsAndTricks: [
      '如果血量充足佩戴银猫戒指脱光所有防具，甚至不需要买梯子即可逐级跳板直接跳到底。'
    ],
    connectionsTo: [
      {
        targetId: 'the_gutter',
        requirement: '顺木梯跳跃到底部大竖井'
      }
    ]
  },
  {
    id: 'the_gutter',
    name: '废渊',
    nameEn: 'The Gutter',
    stage: 'four_souls',
    stageName: '四大古魂之路',
    branch: 'branch_gutter',
    branchName: '腐败分支 (下路)',
    order: 3,
    lane: 3,
    levelRecommendation: 'SL 45 - 60',
    bonfireCount: 2,
    description: '深不见底、毫无光明的污秽棚户废墟，层层搭建的危楼充斥着恶臭毒像与失魂落魄者。',
    lore: '「王都将所有残次、腐朽与不可见人的污秽之物倾倒于此，构筑成了这片痛苦泥潭。」',
    colorTheme: '#57534e',
    bosses: [],
    keyItems: [
      {
        id: 'gut_havel',
        name: '哈维尔套装 + 哈维尔大盾',
        type: 'key_item',
        location: '用弃置钥匙开启石瓶房间隐藏木门后拾取'
      },
      {
        id: 'gut_fragrant',
        name: '怀念香木',
        type: 'fragrant_branch',
        location: '下层吊桥前滑索平台'
      },
      {
        id: 'gut_estus',
        name: '原素碎片',
        type: 'estus_shard',
        location: '靠近持枪海德骑士、透明奥罗斯套装宝箱的区域，攀上附近长梯，在顶部尸体上拾取；靠近滑索。'
      }
    ],
    npcInteractions: [],
    checklists: [
      {
        id: 'gut_c1',
        task: '手持火把沿途点燃所有石灯台，照亮整个立体脚手架网络(点亮全部灯台会引出黑灵入侵并掉落装备)',
        category: 'essential'
      },
      {
        id: 'gut_c2',
        task: '沿脆弱的木桥逐层下落，清理沿途喷射毒液的恶毒石像',
        category: 'essential'
      },
      {
        id: 'gut_c3',
        task: '在底层穿过石化酸液甲虫群，来到恶臭斑驳的绿色岩洞【黑溪谷】',
        category: 'essential'
      }
    ],
    trapsAndTricks: [
      '火把是废渊的神！只要点燃一座石灯台就永久亮起，即使死亡也不会熄灭，点亮地图便不会迷路。'
    ],
    connectionsTo: [
      {
        targetId: 'black_gulch',
        requirement: '底层穿过酸液坑石洞'
      }
    ]
  },
  {
    id: 'black_gulch',
    name: '黑溪谷',
    nameEn: 'Black Gulch',
    stage: 'four_souls',
    stageName: '四大古魂之路',
    branch: 'branch_gutter',
    branchName: '腐败分支 (下路)',
    order: 4,
    lane: 3,
    levelRecommendation: 'SL 55 - 70',
    bonfireCount: 2,
    description: '散发诡异荧光的深渊裂隙，崖壁上密密麻麻布满了致命的吐毒石像与焦油怪兽。',
    lore: '「所有被世间抛弃的不死人残骸在此聚合成可悲的巨型缝合怪物，沉溺在苦痛泥沼中。」',
    colorTheme: '#166534',
    bosses: [
      {
        id: 'the_rotten',
        name: '【始源之火 4/4】腐败物',
        nameEn: 'The Rotten',
        isOptional: false,
        isGreatSoul: true,
        tips: '由无数哀嚎躯体拼合而成的巨兽。注意避开场地四周的燃烧火坑；斩断其右臂可使其无法挥舞大菜刀并掉落法洛斯石头。可召唤鲁卡提耶。',
        transposeWeapon: '屠夫菜刀 / 腐败物灵魂'
      }
    ],
    keyItems: [
      {
        id: 'bg_forgotten_key',
        name: '弃置钥匙 (遗忘钥匙)',
        type: 'key_item',
        location: '在黑溪谷悬崖下方隐藏石壁洞穴中击杀两只双生巨人掉落'
      },
      {
        id: 'bg_dlc_key',
        name: '龙爪 (DLC1入口道具)',
        type: 'key_item',
        location: '用弃置钥匙开启如蜜大坑梯子隐藏铁门获得'
      }
    ],
    npcInteractions: [
      {
        npcId: 'lucatiel',
        npcName: '米勒的鲁卡提耶',
        stepNumber: 4,
        totalSteps: 7,
        actionRequired: '在黑溪谷第一个篝火后方悬崖边缘向下小心跳落，穿过石缝在隐藏石穴找到她对话。',
        warning: '极其容易错过！必须在此对话并在打腐败物时召唤她且幸存！'
      },
      {
        npcId: 'grandahl',
        npcName: '暗之巡礼者 格兰达尔',
        stepNumber: 2,
        totalSteps: 3,
        actionRequired: '使用弃置钥匙打开黑溪谷下层另一处隐藏悬崖洞穴的门，找到格兰达尔对话。'
      },
      {
        npcId: 'aldia',
        npcName: '原罪学者 安第尔',
        stepNumber: 1,
        totalSteps: 4,
        actionRequired: '若这是你点燃的最后一个始源之火，安第尔将轰然破火而出，进行宿命问答。'
      }
    ],
    checklists: [
      {
        id: 'bg_c1',
        task: '用长柄武器或鞭子一路击碎沿途密集的吐毒石像(火属性弓箭可引燃黑油池直接秒杀油怪)',
        category: 'essential'
      },
      {
        id: 'bg_c2',
        task: '在悬崖边点燃火把观察落脚点，跳下第一层石沿找到【鲁卡提耶】对话',
        category: 'npc'
      },
      {
        id: 'bg_c3',
        task: '跳下深层隐藏山洞，在黑暗中斩杀【两只双生独眼巨人】，获取至关重要的【弃置钥匙】与巨人灵魂',
        category: 'secret'
      },
      {
        id: 'bg_c4',
        task: '顺着崖壁边缘走到最深处点燃第二隐藏篝火',
        category: 'essential'
      },
      {
        id: 'bg_c5',
        task: '召唤鲁卡提耶，击败伟大的始源古魂BOSS【腐败物】',
        category: 'boss'
      },
      {
        id: 'bg_c6',
        task: '在始源之火后方祭坛调查蛇头方尖碑，可传送至【DLC1 圣壁之都萨鲁瓦】(需龙爪)',
        category: 'secret'
      },
      {
        id: 'bg_c7',
        task: '完成四处始源之火，并在最后一处与安第尔耗尽首次对话（若最后点燃的不是黑溪谷，请在对应区域完成）',
        category: 'essential'
      }
    ],
    trapsAndTricks: [
      '双巨人的山洞非常暗，可以引诱一只出来逐一击破，或者站在洞口用毒箭或法术远程射杀。',
      '弃置钥匙可用于开启如蜜大坑拿DLC1门钥匙【龙爪】、废渊哈维尔套房、黑溪谷暗穴门！'
    ],
    connectionsTo: [
      {
        targetId: 'shrine_of_winter',
        requirement: '集齐四大始源之火前往虚影森林左转开启冬之庙'
      },
      {
        targetId: 'dlc_shulva',
        requirement: '始源火后方祭坛传送(DLC1入口)'
      }
    ]
  },
  {
    id: 'shrine_of_winter',
    name: '冬之庙',
    nameEn: 'Shrine of Winter',
    stage: 'drangleic',
    stageName: '王城大道',
    branch: 'main',
    branchName: '主线进阶',
    order: 0,
    lane: 1.5,
    levelRecommendation: 'SL 75+',
    bonfireCount: 0,
    description: '通往王都多兰古雷格的神圣隘口，唯有点燃四大始源之火或累积极强灵魂记忆的强者方能开启。',
    lore: '「王都的大门永向真正的王侯敞开。凡人若无始源巨魂的烙印，必将困死于门外。」',
    colorTheme: '#3b82f6',
    bosses: [],
    keyItems: [
      {
        id: 'sow_dlc_key',
        name: '冰冻花 (DLC3入口道具)',
        type: 'key_item',
        location: '冬之庙内祭坛调查方尖碑，原罪学者版在王都内部拾取'
      }
    ],
    npcInteractions: [],
    checklists: [
      {
        id: 'sow_c1',
        task: '从虚影森林歧路遗迹篝火走左边通道直达冬之庙',
        category: 'essential'
      },
      {
        id: 'sow_c2',
        task: '取得四大古魂的认可（弗蕾札后另触碰地面红光），或在本周目新增灵魂达到门槛：一周目100万，二周目200万，依次递增至800万；不是只看当前持有魂量',
        category: 'essential'
      },
      {
        id: 'sow_c3',
        task: '在冬之庙祭坛调查蛇头传送碑，可直通【DLC3 冰雪之都埃斯洛耶斯】(需冰冻花)',
        category: 'secret'
      },
      {
        id: 'sow_c4',
        task: '穿过暴雨倾盆的王都长阶，抵达宏伟巍峨的【王城多兰古雷格】',
        category: 'essential'
      }
    ],
    trapsAndTricks: [
      '四大古魂分支可按自身进度调整顺序。灵魂记忆替代门槛按本周目新增量计算，进入二周目前累计的灵魂记忆不能直接抵扣。',
      'DLC可在取得对应钥匙后进入，不要求先击败最终Boss；本攻略将其列在后段作为难度推荐。'
    ],
    connectionsTo: [
      {
        targetId: 'drangleic_castle',
        requirement: '推开冬之庙巨门'
      },
      {
        targetId: 'dlc_eleum_loyce',
        requirement: '冬之庙蛇头方尖碑传送(DLC3入口)'
      }
    ]
  },
  {
    id: 'drangleic_castle',
    name: '王城多兰古雷格',
    nameEn: 'Drangleic Castle',
    stage: 'drangleic',
    stageName: '王国中枢',
    branch: 'main',
    branchName: '主线进阶',
    order: 1,
    lane: 1.5,
    levelRecommendation: 'SL 80 - 95',
    bonfireCount: 4,
    description: '凡克拉德王为王妃杜娜湘卓建造的壮丽黑石巨城，如今王座空悬，石像卫兵被暗之魔力所驱使。',
    lore: '「王妃来自远方异国，她的美貌带来了繁荣，也引向了无尽的深渊与毁灭。」',
    colorTheme: '#1e40af',
    bosses: [
      {
        id: 'twin_dragonriders',
        name: '双龙骑兵',
        nameEn: 'Twin Dragonriders',
        isOptional: false,
        tips: '一人持大弓在高台射击，另一人持戟在下方近战；诱导近战龙骑兵击毁高台立柱使红衣龙骑兵摔下，逐一斩杀。',
        transposeWeapon: '龙骑兵大盾'
      },
      {
        id: 'looking_glass_knight',
        name: '镜之骑士',
        nameEn: 'Looking-glass Knight',
        isOptional: false,
        tips: '暴风雨暴雨之巅决战。其巨镜能格挡一切正面攻击；下插巨镜时会召唤镜中暗灵(线上可召唤真实玩家)，务必趁召唤时打断或先清暗灵！',
        transposeWeapon: '国王之镜／荆棘大剑（Thorned Greatsword）'
      }
    ],
    keyItems: [
      {
        id: 'dc_sublime_dust',
        name: '贵人骨灰',
        type: 'sublime_bone_dust',
        location: '进入王城门厅后走左侧通道，在持戟扎因骑士后方房间开启守卫看守的铁箱。'
      },
      {
        id: 'dc_key_passage',
        name: '王之回廊钥匙',
        type: 'key_item',
        location: '启动中央篝火附近的升降梯，到顶层笼中歌女所在房间，开启铁箱获得；不需要先解救歌女。'
      },
      {
        id: 'dc_frozen_flower',
        name: '冰冻花 (DLC3钥匙)',
        type: 'key_item',
        location: '王城一楼右侧开门房间尸体上拾取'
      },
      {
        id: 'dc_estus',
        name: '原素碎片',
        type: 'estus_shard',
        location: '从中央篝火沿流程经过石像吸魂机关与骑士大厅，到室外向下走阶梯进入武器房，在出口近道拉杆旁铁箱取得。'
      }
    ],
    npcInteractions: [
      {
        npcId: 'benhart',
        npcName: '优格的本哈特 (镜之骑士助战)',
        stepNumber: 3,
        totalSteps: 5,
        actionRequired: '在击败双龙骑兵后抵达的【中央篝火】旁耗尽本哈特对话，再于镜之骑士雾门前召唤他并确保获胜时存活。'
      },
      {
        npcId: 'aldia',
        npcName: '王妃 杜娜湘卓',
        stepNumber: 1,
        totalSteps: 4,
        actionRequired: '在谒见大厅阶梯上方与巨大的王妃对话，倾听她要求你去寻找国王凡克拉德的命令。'
      },
      {
        npcId: 'grandahl',
        npcName: '暗之巡礼者 格兰达尔',
        stepNumber: 3,
        totalSteps: 3,
        actionRequired: '在王城地下室左起第三个石像门内暗穴找到他，完成3次相遇正式开启三大古老暗穴！'
      }
    ],
    checklists: [
      {
        id: 'dc_c1',
        task: '在城门前与地下室击杀杂兵，利用杂兵死后释放的灵魂激活两侧石像像吸魂机关开门',
        category: 'essential'
      },
      {
        id: 'dc_c2',
        task: '谒见王妃杜娜湘卓，听取她关于凡克拉德王的虚伪告诫',
        category: 'npc'
      },
      {
        id: 'dc_c3',
        task: '击败BOSS【双龙骑兵】',
        category: 'boss'
      },
      {
        id: 'dc_c4',
        task: '启动升降梯到顶层，先开铁箱取得【王之回廊钥匙】；笼中歌女须以后带回歌唱恶魔掉落的【被封者钥匙】才能解救',
        category: 'secret'
      },
      {
        id: 'dc_c_benhart',
        task: '在镜之骑士雾门前召唤【优格的本哈特】参战并确保其幸存',
        category: 'boss'
      },
      {
        id: 'dc_c5',
        task: '在风雨交加的城墙上挑战BOSS【镜之骑士】',
        category: 'boss'
      },
      {
        id: 'dc_c6',
        task: '乘坐骑士后方升降机深入潮湿地底，来到【阿玛娜祭坛】',
        category: 'essential'
      }
    ],
    trapsAndTricks: [
      '地下室六扇石像门内各有虚无骑士和茫然卫兵，必须在门旁石像前击杀怪物让石像吸魂才能开门，千万别一次全开！'
    ],
    connectionsTo: [
      {
        targetId: 'shrine_of_amana',
        requirement: '镜之骑士后方升降梯下达'
      },
      {
        targetId: 'dark_chasm_of_old',
        requirement: '吸魂开启地下室石像门，跳入地穴进入古老暗穴',
        isSecret: true
      }
    ]
  },
  {
    id: 'dark_chasm_of_old',
    name: '古老暗穴 (隐藏深渊)',
    nameEn: 'Dark Chasm of Old',
    stage: 'drangleic',
    stageName: '深渊契约挑战',
    branch: 'main',
    branchName: '深渊之底',
    order: 3,
    lane: 2.2,
    levelRecommendation: 'SL 110 - 130',
    bonfireCount: 0,
    description: '失明轮椅老人格兰达尔开启的深渊古代圣域，潜藏着远古深渊哈维尔、里卡尔等幽灵守卫以及深渊之神暗天使。',
    lore: '「暗之深处并非空无一物。在那里，沉眠着古老纯洁的暗之本质……」',
    colorTheme: '#581c87',
    bosses: [
      {
        id: 'darklurker',
        name: '【全魂2最强法系BOSS】黑暗潜伏者 (暗天使)',
        nameEn: 'Darklurker',
        isOptional: true,
        tips: '【高难死斗】：全游戏最强法术Boss！悬浮四翼暗天使。一阶段释放暗影爆弹、巨型灵魂光剑、灵魂结晶枪、追踪黑洞；二阶段分裂为两个完全独立的暗天使同时施法！【破法】：火抗极低！堆高暗抗与魔抗(佩戴暗晶+2与大魔力防护)，二阶段分裂瞬间使用高伤咒术【混沌风暴】或【火焰风暴】在正下方同时命中双体造成数倍伤害瞬间蒸发！',
        transposeWeapon: '吸精（Lifedrain Patch）'
      }
    ],
    keyItems: [
      {
        id: 'dco_dragon_chime',
        name: '【至高神器】龙之圣铃',
        type: 'key_item',
        location: '击败黑暗潜伏者并把暗之巡礼者提升至Rank 3后，与格兰达尔对话获赠；龙之圣铃擅长奇迹，不能称为暗术最强圣铃。'
      },
      {
        id: 'dco_abyss_seal',
        name: '亢奋指环 (提升暗术威力)',
        type: 'key_item',
        location: '加入暗之巡礼者誓约赠送'
      }
    ],
    npcInteractions: [
      {
        npcId: 'grandahl',
        npcName: '暗之巡礼者 格兰达尔 (誓约圆满)',
        stepNumber: 3,
        totalSteps: 3,
        actionRequired: '分别从虚影森林、黑溪谷、王城地下室进入3处暗穴，各点燃一座大火盆。全部点燃后雾门开启直通暗天使战场。击破后对话获得【龙之圣铃】与【黄衣套装】！'
      }
    ],
    checklists: [
      {
        id: 'dco_c1',
        task: '在虚影森林、黑溪谷、王城多兰古雷格与格兰达尔完成3次对话，消耗一个人像开启暗穴大门',
        category: 'essential'
      },
      {
        id: 'dco_c2',
        task: '在3处暗穴中击败哈维尔、里卡尔、魔女等古代暗之守卫',
        category: 'essential'
      },
      {
        id: 'dco_c3',
        task: '手持火把分别点燃3处暗穴核心的巨型暗之大火盆',
        category: 'essential'
      },
      {
        id: 'dco_c4',
        task: '跃入深渊裂隙，挑战全游戏最强隐藏BOSS【黑暗潜伏者·暗天使】',
        category: 'boss'
      },
      {
        id: 'dco_c5',
        task: '与格兰达尔对话将暗之巡礼者誓约升至最高Rank 3，获得终极神器【龙之圣铃】与全法术成就必备暗术',
        category: 'secret'
      }
    ],
    trapsAndTricks: [
      '暗穴每次死亡进入都需要消耗一个【人像】，切记备足人像；暗天使极度弱火，火弹和火焰风暴打它如切菜。'
    ],
    connectionsTo: [
      {
        targetId: 'drangleic_castle',
        requirement: '击破暗天使后从深渊光井传送返回王城'
      }
    ]
  },
  {
    id: 'shrine_of_amana',
    name: '阿玛娜祭坛',
    nameEn: 'Shrine of Amana',
    stage: 'drangleic',
    stageName: '祭坛水境',
    branch: 'main',
    branchName: '主线进阶',
    order: 2,
    lane: 1.5,
    levelRecommendation: 'SL 85 - 100',
    bonfireCount: 4,
    description: '回荡着凄婉幽美歌声的广袤水下遗迹，潜藏着无数潜水伏击者与超远距离追踪魔法女巫。',
    lore: '「歌女米丽法妮托用歌声安抚着死者的狂暴灵魂，但在死者王国的入口，恶魔已然悄悄滋生。」',
    colorTheme: '#06b6d4',
    bosses: [
      {
        id: 'demon_of_song',
        name: '歌唱恶魔 (青蛙恶魔)',
        nameEn: 'Demon of Song',
        isOptional: false,
        tips: '外层包裹坚不可摧的骨质硬壳；仅在其张开骷髅人脸外皮露出本体时攻击才有效！拉开距离，避开压杀与突进后惩罚面部。',
        transposeWeapon: '斑斓鞭'
      }
    ],
    keyItems: [
      {
        id: 'soa_estus',
        name: '原素碎片',
        type: 'estus_shard',
        location: '第二篝火后方深入水下隐藏树根处宝箱'
      },
      {
        id: 'soa_sunlight_blade',
        name: '阳光之剑 (奇迹)',
        type: 'key_item',
        location: '第三篝火前潜水小道尽头宝箱'
      },
      {
        id: 'soa_king_soul',
        name: '国王灵魂与王之套装',
        type: 'key_item',
        location: '击败国王凡克拉德后，以肉身状态推开阿玛娜第二篝火对岸藤蔓门拾取'
      }
    ],
    npcInteractions: [],
    checklists: [
      {
        id: 'soa_c1',
        task: '点燃火把或注意水面反光观察水下断崖悬崖边缘，切勿失足跌落深渊',
        category: 'essential'
      },
      {
        id: 'soa_c2',
        task: '准备一把强力十字弩或猎头大弓，超视距狙击烦人的阿玛娜法师',
        category: 'essential'
      },
      {
        id: 'soa_c3',
        task: '找到歌女房屋倾听歌声，救出第三位歌女米丽法妮托',
        category: 'secret'
      },
      {
        id: 'soa_c4',
        task: '击败【歌唱恶魔】，获得【被封者钥匙】；可返回王城顶层解救歌女，再继续前往不死灵庙',
        category: 'boss'
      },
      {
        id: 'soa_c5',
        task: '乘坐升降机进入阴森冰冷的终极亡灵圣地【不死灵庙】',
        category: 'essential'
      }
    ],
    trapsAndTricks: [
      '【阿玛娜推图逃课神器：噶瓦兰毒箭】：阿玛娜法师的远距离追踪水球弹道极其折磨。在法洛斯门径噶瓦兰处买足200支【毒箭】，佩戴任意弓箭在法师射程之外射3支毒箭即可挂上剧毒静待其毒发身亡，推图难度骤降！',
      '【死者之塔免费恢复人身】：在活尸状态且身上与储物箱【完全没有任何人像】时，登上死者之塔顶层向火盆祭坛祈祷，可无限次免费恢复肉身！',
      '阿玛娜祭坛是全游戏最容易失足溺水的地方，关掉火把看水下光亮反光能清晰看到浅滩与深水断崖的分界线。'
    ],
    connectionsTo: [
      {
        targetId: 'undead_crypt',
        requirement: '击败歌唱恶魔乘升降机前往'
      }
    ]
  },
  {
    id: 'undead_crypt',
    name: '不死灵庙',
    nameEn: 'Undead Crypt',
    stage: 'undead_crypt',
    stageName: '死者之都',
    branch: 'main',
    branchName: '主线进阶',
    order: 0,
    lane: 1.5,
    levelRecommendation: 'SL 90 - 105',
    bonfireCount: 2,
    description: '多兰古雷格所有不死人的永眠之所，傲慢的卫兵与幽魂长眠于此，国王凡克拉德亦自我放逐于黑暗深处。',
    lore: '「此乃不可触碰火光的圣地。切勿带来光明，否则安眠者将化为屠杀狂潮。」',
    colorTheme: '#6b21a8',
    bosses: [
      {
        id: 'velstadt',
        name: '王盾 韦施塔德',
        nameEn: 'Velstadt, the Royal Aegis',
        isOptional: false,
        tips: '手持巨大黄金圣铃大锤的忠诚卫士。二阶段下跪念咒附魔暗属性并释放暗球，趁其念咒绕背猛攻；暗抗高，怕雷属性。',
        transposeWeapon: '圣铃大槌'
      },
      {
        id: 'vendrick',
        name: '国王 凡克拉德 (可选/第二结局必打)',
        nameEn: 'King Vendrick',
        isOptional: true,
        tips: '最多五枚【巨人灵魂】放在背包可降低其防御倍率：0枚32倍、4枚2倍、5枚正常。最后巨人的Boss魂不能代替巨人灵魂。贴身绕至左后侧观察横斩，不要求必须集齐五枚才能挑战。',
        transposeWeapon: '王之特大剑／国王之盾／统治者大剑（Ruler\'s Sword）'
      }
    ],
    keyItems: [
      {
        id: 'uc_kings_ring',
        name: '【关键剧情物品】国王戒指',
        type: 'key_item',
        location: '在凡克拉德失智拖剑徘徊处拾取地上的王衣'
      }
    ],
    npcInteractions: [
      {
        npcId: 'agdayne',
        npcName: '守墓人 阿加德温',
        stepNumber: 1,
        totalSteps: 1,
        actionRequired: '不要把火把带近阿加德温或让持火把活尸跟随进入，否则他与身边守卫会敌对。照明魔法不等于火把。保持友好可交易并在王盾战前召唤；误触敌对可尝试在辉石镇赎罪。',
        warning: '绝对不要点火把！'
      },
      {
        npcId: 'aldia',
        npcName: '原罪学者 安第尔',
        stepNumber: 2,
        totalSteps: 4,
        actionRequired: '在不死灵庙第一个篝火处，安第尔将再度从火坑爆发出来，探讨因果与谎言，耗尽对话（是／否均可）。'
      }
    ],
    checklists: [
      {
        id: 'uc_c1',
        task: '熄灭一切火把，与守墓人阿加德温对话，避免触发全图狂暴追杀',
        category: 'essential'
      },
      {
        id: 'uc_c2',
        task: '谨慎应对墓碑法师，切勿让杂兵敲响铜钟，敲钟会无休止召唤幽灵魔导士',
        category: 'essential'
      },
      {
        id: 'uc_c3',
        task: '在长廊拉下近道捷径拉杆，击败BOSS【王盾韦施塔德】',
        category: 'boss'
      },
      {
        id: 'uc_c4',
        task: '步入最深处陵寝，目睹失智赤裸徘徊的国王凡克拉德，拾取地面的【国王戒指】',
        category: 'essential'
      },
      {
        id: 'uc_c5',
        task: '【重要抉择】：凡克拉德此时为中立状态，先不打他；等后续搜集满4-5个巨人灵魂再返回斩杀他！',
        category: 'secret'
      },
      {
        id: 'uc_aldia_dialogue',
        task: '在入口篝火与安第尔耗尽第二处对话；回答是或否均可',
        category: 'npc'
      }
    ],
    trapsAndTricks: [
      '国王戒指是解开全游戏三扇封印大门(虚影森林往安第尔之馆、巨森国王门、王城渴望王座)的终极钥匙！'
    ],
    connectionsTo: [
      {
        targetId: 'aldias_keep',
        requirement: '前往虚影森林歧路分岔右侧，佩戴国王戒指开启大门'
      },
      {
        targetId: 'memories_of_ancients',
        requirement: '后续获得灰雾核心后调查各处巨人尸树'
      },
      {
        targetId: 'throne_of_want',
        requirement: '王城第一篝火左侧国王门开启'
      }
    ],
    choices: [
      {
        id: 'undead_crypt_torch',
        title: '守墓人阿加德温「光之死罪」禁忌',
        situation: '进入灵庙第一个大殿时，守墓人阿加德温会通过阴冷的声音严厉警告：「不要带来光亮，切勿点燃火把！」',
        recommendedChoice: '收起火把，别让持火把活尸跟进守墓人房间。',
        options: [
          {
            label: '熄灭火把，在黑暗中平静进入谒见',
            isRecommended: true,
            consequence: '守墓人阿加德温与周围的不死守卫均保持中立友好态。你可以与阿加德温安全对话并购买稀有法术与装备，还可以在王盾韦施塔德门前召唤阿加德温作为极为强力的白灵助战！',
            loreReasoning: '不死灵庙是逝者安息之地，光芒会惊扰并激怒沉睡的亡魂。'
          },
          {
            label: '手持火把或点亮火盆强行进入',
            isRecommended: false,
            consequence: '带火把接近会使阿加德温与附近守卫敌对，影响交易与助战。并非全地图所有敌人一起改变状态；可尝试到辉石镇找牧师赎罪。',
            spoilerContent: '如果带着火把走近，阿加德温会拔出暗黑剑直接将你砍碎，且你将彻底失去一个极其可靠的Boss战抗伤NPC白灵。',
            loreReasoning: '擅自点火是对灵庙安眠律法的直接亵渎。'
          }
        ]
      },
      {
        id: 'undead_crypt_vendrick_timing',
        title: '国王凡克拉德斩杀时机抉择',
        situation: '击败王盾韦施塔德后，在灵庙最深处可以看到失智赤裸、拖着大剑绕圈游荡的多兰古雷格昔日霸主——凡克拉德王。地上的国王戒指可以直接拾取，国王本身不会主动攻击。',
        recommendedChoice: '【此时切勿攻击国王！】先拿走国王戒指推进剧情，待拿到4~5个巨人灵魂后再回来轻松斩杀！',
        options: [
          {
            label: '拿走国王戒指暂时撤退，等集齐巨人灵魂再战',
            isRecommended: true,
            consequence: '先取国王戒指继续推进，之后携带4或5枚巨人灵魂返回。击败凡克拉德后，他本人不直接掉落王魂和全套装备，需以肉身状态回阿玛娜密室领取。',
            loreReasoning: '巨人的怨念灵魂是唯一能够彻底撕裂凡克拉德王之坚壁的因果武器。'
          },
          {
            label: '现在立刻拔刀攻击凡克拉德王',
            isRecommended: false,
            consequence: '凡克拉德在拥有0个巨人灵魂时，拥有高达【32倍的绝对防御免伤】！玩家砍一刀只有几十点抓痒伤害，而凡克拉德拖刀随手一挥即可直接满血秒杀玩家，是一场长达十几分钟且容错率为零的折磨死斗。',
            spoilerContent: '若已先击败王妃，可补齐安第尔三处对话和凡克拉德击杀条件，再在王城【国王之门】篝火添火，重打王座双守卫与王妃以触发安第尔；添火会永久提高关联战斗难度。',
            loreReasoning: '在毫无准备时挑战王者的残躯纯属盲目送死。'
          }
        ]
      }
    ]
  },
  {
    id: 'aldias_keep',
    name: '安第尔之馆',
    nameEn: 'Aldia\'s Keep',
    stage: 'dragon_shrine',
    stageName: '巨龙神域',
    branch: 'main',
    branchName: '主线进阶',
    order: 0,
    lane: 1.5,
    levelRecommendation: 'SL 95 - 110',
    bonfireCount: 2,
    description: '国王凡克拉德之兄安第尔公爵的疯狂基因实验室，到处陈列着异形骨架、酸液池与活体标本。',
    lore: '「安第尔为了探寻超越不死因果的真理，将自己封闭于馆内，企图以飞龙再造古龙神话。」',
    colorTheme: '#0f766e',
    bosses: [
      {
        id: 'guardian_dragon',
        name: '看守龙',
        nameEn: 'Guardian Dragon',
        isOptional: false,
        tips: '巨大的飞龙。当其攀附在铁笼鸟笼壁上喷吐大范围漫天烈焰时，迅速跑到其正下方死角；修脚打法即可。',
        transposeWeapon: '龙翼特大剑（Drakewing Ultra Greatsword）／喷火枪（Spitfire Spear）'
      }
    ],
    keyItems: [
      {
        id: 'ak_fragrant',
        name: '怀念香木',
        type: 'fragrant_branch',
        location: '大厅巨大骨龙残骸嘴部'
      },
      {
        id: 'ak_aldia_key',
        name: '安第尔钥匙',
        type: 'key_item',
        location: '点燃馆内四个火盆并处理出现的暗灵，回大厅触发骨龙取得钥匙；学者版不在酸液池。'
      }
    ],
    npcInteractions: [
      {
        npcId: 'lucatiel',
        npcName: '米勒的鲁卡提耶 (命运终章)',
        stepNumber: 5,
        totalSteps: 7,
        actionRequired: '在馆前小屋篝火旁与她进行最后的悲伤对话。她彻底认出了自己即将失去一切记忆，赠予你她的【鲁卡提耶面具与全套装备】。',
        warning: '先确认已完成此前四处会面、至少三次助战获胜且她存活，再进行馆前最终对话；条件不足就结束对话会失去本周目继承装备的机会。'
      },
      {
        npcId: 'navlaan',
        npcName: '禁忌者 纳瓦兰',
        stepNumber: 1,
        totalSteps: 1,
        actionRequired: '保持一楼拉杆不动，以活尸状态隔着蓝色屏障接四次暗杀任务；正常取得并出示信物即可，不需要杀NPC。释放后将失去本周目的任务奖励，并在多个区域遭遇其入侵。',
        warning: '千万不要拉下一楼的杠杆！'
      }
    ],
    checklists: [
      {
        id: 'ak_c1',
        task: '与馆前鲁卡提耶进行最终对话前，先确认四处会面与累计三次助战存活条件；不够先返回添火补足，再来继承装备',
        category: 'npc'
      },
      {
        id: 'ak_c2',
        task: '穿过大厅躲避骨龙骨架砸落，注意避开纳瓦兰拉杆陷阱',
        category: 'essential'
      },
      {
        id: 'ak_c3',
        task: '探索后方长廊，躲避河马怪撞破木门伏击',
        category: 'essential'
      },
      {
        id: 'ak_c4',
        task: '在巨型鸟笼斗兽场击败BOSS【看守龙】',
        category: 'boss'
      },
      {
        id: 'ak_c5',
        task: '走出后门，搭乘升降梯眺望浮空龙峰【卫龙巢穴】',
        category: 'essential'
      }
    ],
    trapsAndTricks: [
      '纳瓦兰的杀手任务完全不需要杀任何NPC：吉里甘的梯子微型模型可购买、凯尔的头盔可对话拿、费尔金的日暮之杖满足智信对话拿、羽毛由绿衣巡礼者赠送！'
    ],
    connectionsTo: [
      {
        targetId: 'dragon_aerie',
        requirement: '击败看守龙乘升降梯出馆'
      }
    ],
    choices: [
      {
        id: 'aldias_keep_navlaan_lever',
        title: '禁忌者纳瓦兰一楼拉杆生死禁忌',
        situation: '一楼右侧通道是囚禁纳瓦兰的蓝色屏障；释放他的拉杆在大厅另一侧通道尽头，附近有阻止拉杆的建言。',
        recommendedChoice: '【绝对千万不要拉杆！】以活尸形态隔着屏障对话接暗杀任务（伪暗杀免死NPC拿全部奖励）！',
        options: [
          {
            label: '保留拉杆不拉，以活尸形态隔着魔障对话',
            isRecommended: true,
            consequence: '保持封印并以活尸状态接任务。依次出示梯子饰物、凯尔头盔、日暮之杖、老旧羽毛即可免杀目标，奖励为驱散戒指、香料、封印太阳（Forbidden Sun）、释放魔力（Unleash Magic）及混沌套装。',
            loreReasoning: '隔着封印完成契约，既能保全无辜NPC生命，又能掏空魔导士毕生禁忌魔法。'
          },
          {
            label: '好奇拉下一楼拉杆释放纳瓦兰',
            isRecommended: false,
            consequence: '解除封印会终止本周目的暗杀任务线。他会在安第尔之馆、卫龙巢穴、巨森、废渊、辉石镇和王城的特定位置入侵；不是渴望王座Boss助战事件。',
            spoilerContent: '入侵的纳瓦兰施法速度极快，暗影箭弹幕和强力结晶枪极容易打得玩家猝不及防，且一旦拉杆，【本周目内暗杀委托与封印太阳咒术将永久无法获取】！',
            loreReasoning: '放虎归山，封印古代最疯狂的魔导刺客是安第尔为数不多的明智之举。'
          }
        ]
      }
    ]
  },
  {
    id: 'dragon_aerie',
    name: '卫龙巢穴',
    nameEn: 'Dragon Aerie',
    stage: 'dragon_shrine',
    stageName: '巨龙神域',
    branch: 'main',
    branchName: '主线进阶',
    order: 1,
    lane: 1.5,
    levelRecommendation: 'SL 100 - 115',
    bonfireCount: 1,
    description: '群峰环绕的险峻天险，无数飞龙在白云间盘旋，吊桥横跨于万仞绝壁之上。',
    lore: '「这里是飞龙与自爆僵尸的巢穴，也是通往神圣古龙祭坛的唯一天险之路。」',
    colorTheme: '#14b8a6',
    bosses: [],
    keyItems: [
      {
        id: 'da_feather',
        name: '【神器】老旧羽毛 (无限回骨片)',
        type: 'key_item',
        location: '桥头与绿衣巡礼者夏娜洛特对话直接赠送'
      },
      {
        id: 'da_titanite',
        name: '大量光辉钛晶石与龙骨化石',
        type: 'key_item',
        location: '击杀满地结晶蜥蜴与三只红飞龙拾取'
      }
    ],
    npcInteractions: [
      {
        npcId: 'herald',
        npcName: '绿衣巡礼者 夏娜洛特',
        stepNumber: 4,
        totalSteps: 5,
        actionRequired: '在长索桥入口与她相遇，她揭示自己是由龙创造的人造人，赠予你无限次回营地的神器【老旧羽毛】。'
      }
    ],
    checklists: [
      {
        id: 'da_c1',
        task: '在索桥头与绿衣巡礼者对话，获取极其好用的终身道具【老旧羽毛】',
        category: 'npc'
      },
      {
        id: 'da_c2',
        task: '逐一猎杀三只盘踞在龙蛋窝中的飞龙，扫荡满地的结晶蜥蜴获取巨量顶级强化素材',
        category: 'collectible'
      },
      {
        id: 'da_c3',
        task: '穿越惊险漫长的木质吊桥，迈入庄严神秘的【龙祭坛】',
        category: 'essential'
      }
    ],
    trapsAndTricks: [
      '踢碎龙蛋虽然爽快，但会激怒沿途飞龙并加快吊桥被龙撞塌的判定，尽量不要多打龙蛋。'
    ],
    connectionsTo: [
      {
        targetId: 'dragon_shrine',
        requirement: '穿过长木吊桥直达'
      }
    ]
  },
  {
    id: 'dragon_shrine',
    name: '龙祭坛',
    nameEn: 'Dragon Shrine',
    stage: 'dragon_shrine',
    stageName: '巨龙神域',
    branch: 'main',
    branchName: '主线进阶',
    order: 2,
    lane: 1.5,
    levelRecommendation: 'SL 105 - 120',
    bonfireCount: 1,
    description: '古龙与其崇敬者驻守的恢弘白色圣殿，龙人近卫骑士遵循崇高决斗礼仪默默注视行者。',
    lore: '「古龙静默地注视着轮回的生灭，它不属于这个时代，却知晓过去的全部真理。」',
    colorTheme: '#0d9488',
    bosses: [
      {
        id: 'ancient_dragon',
        name: '古龙 (可选极难Boss)',
        nameEn: 'Ancient Dragon',
        isOptional: true,
        tips: '【非敌对NPC】：正常对话即可拿剧情道具！若主动攻击则触发血条巨厚的隐藏Boss。飞天喷火全屏秒杀，需狂奔向龙尾逃离；打其脚趾缝修脚。击败掉落第5个【巨人灵魂】。',
        transposeWeapon: '此处掉巨人灵魂；古龙之魂需另到辉石镇古龙回忆取得，可换弯曲龙大剑（Curved Dragon Greatsword）'
      }
    ],
    keyItems: [
      {
        id: 'ds_ashen_mist',
        name: '【核心剧情道具】灰雾核心',
        type: 'key_item',
        location: '和平觐见古龙，对话直接获得'
      },
      {
        id: 'ds_egg',
        name: '化石龙蛋 (加入古龙誓约)',
        type: 'key_item',
        location: '神社深处台座拾取，可交给熔铁城商人加入古龙誓约'
      }
    ],
    npcInteractions: [
      {
        npcId: 'aldia',
        npcName: '原罪学者 安第尔',
        stepNumber: 3,
        totalSteps: 4,
        actionRequired: '在龙祭坛入口第一篝火处，安第尔完成第三次问答。耗尽对话即可；回答是或否不影响，仍需在王妃前击败凡克拉德。'
      }
    ],
    checklists: [
      {
        id: 'ds_c1',
        task: '点燃第一篝火，与原罪学者安第尔完成最后一次火边问答',
        category: 'npc'
      },
      {
        id: 'ds_c2',
        task: '【绅士试炼规则】：原罪学者版中龙人黑金骑士绝不会群殴，只要你公平单挑重甲卫兵，两旁龙骑士会鞠躬致敬放行！切勿拉怪或逃跑逃课！',
        category: 'essential'
      },
      {
        id: 'ds_c3',
        task: '登上最高阶梯面见庞大的古龙，与之交谈获取进入古代记忆的关键钥匙【灰雾核心】',
        category: 'essential'
      }
    ],
    trapsAndTricks: [
      '在原罪学者版中，如果玩家在长阶梯上试图逃跑跑酷不打单挑卫兵，全场几十名龙人近卫骑士会瞬间拔刀群起暴动围殴！'
    ],
    connectionsTo: [
      {
        targetId: 'memories_of_ancients',
        requirement: '持有灰雾核心调查巨人陨落之森巨人尸体'
      }
    ],
    choices: [
      {
        id: 'dragon_shrine_duel_etiquette',
        title: '龙祭坛台阶单挑古龙卫兵礼仪',
        situation: '在原罪学者版本中，通往古龙神殿的长长石阶两旁伫立着数十名黑金龙人武士，中间则是重甲大锤/大斧古骑士。',
        recommendedChoice: '【严格遵守单挑礼仪】老老实实逐一击杀中间的重甲古骑士，切勿逃课跑酷！',
        options: [
          {
            label: '遵守武士礼仪，公平单挑台阶中央古骑士',
            isRecommended: true,
            consequence: '只要你不逃跑、不拉怪、不召唤白灵破坏规则，两旁数十名黑金龙人武士会在你获胜时全体向你整齐划一地鞠躬致敬，绝不插手干预，你可以一路平静通往古龙王座。',
            loreReasoning: '龙人近卫骑士只敬重以武道证明自身力量的真正强者。'
          },
          {
            label: '试图冲刺跑酷、拉怪或召唤白灵逃课',
            isRecommended: false,
            consequence: '一旦被判定违反试炼规则（如跑过古骑士未击杀），两旁整整二十余名黑金龙人武士会【瞬间拔刀全场狂暴围殴追杀】！在狭窄阶梯上会被数十把太刀和大盾瞬间秒杀，几乎不可能生还。',
            spoilerContent: '这是原罪学者版专门设计的防跑酷惩罚机制，任何试图偷鸡直冲雾门的玩家都会被秒杀教做人。',
            loreReasoning: '背对战士逃跑被龙族视作极致的懦弱与冒犯。'
          }
        ]
      },
      {
        id: 'dragon_shrine_ancient_dragon_fight',
        title: '古龙和平交谈 vs 宣战击杀抉择',
        situation: '神殿尽头盘踞着如同山岳般宏伟的古龙。它属于中立剧情NPC，走近按互动键即可与之和平交谈。',
        recommendedChoice: '【推荐和平交谈即可】直接拿走【灰雾核心】，无需自找苦吃攻击古龙！',
        options: [
          {
            label: '和平交谈获取【灰雾核心】',
            isRecommended: true,
            consequence: '古龙将直接把进入古代记忆的至高神器【灰雾核心】赠送给你，让你能顺利探索三大巨人回忆，推进主线决战，过程安全祥和。',
            loreReasoning: '古龙本就是超脱世俗争斗的古老智者，无意与人类为敌。'
          },
          {
            label: '主动拔刀攻击古龙触发隐藏BOSS战',
            isRecommended: false,
            consequence: '古龙化身全游戏血量最厚（近20000HP）的超级隐藏巨兽！其飞天喷火范围几乎覆盖全场，没有堆满890点火抗或熟练修脚跑尾技巧会被一击秒杀。击败它仅额外掉落第5个【巨人灵魂】（其实4个巨人魂就足以轻松打败凡克拉德）。',
            spoilerContent: '古龙体内实际上是安第尔用巨人灵魂与飞龙基因人工合成的人造古龙（真正的远古古龙遗骸在辉石镇蛛网深处），击杀它难度极大但收益有限。',
            loreReasoning: '屠龙纯粹是追求全BOSS斩杀与极限挑战的受苦之选。'
          }
        ]
      }
    ]
  },
  {
    id: 'memories_of_ancients',
    name: '巨人回忆群 (洛/奥罗/瓦姆)',
    nameEn: 'Memories of the Ancients',
    stage: 'memories',
    stageName: '穿越古昔记忆',
    branch: 'main',
    branchName: '主线进阶',
    order: 0,
    lane: 1.5,
    levelRecommendation: 'SL 110 - 125',
    bonfireCount: 0,
    description: '凭借灰雾核心穿梭进巨人陨落之森三具巨人石化尸木的古代深层记忆，重返多兰古雷格惨烈的围城血战。',
    lore: '「在熊熊燃烧的战火深处，巨人们的愤怒摧毁了王都的城墙。唯有一位无名旅者力挽狂澜。」',
    colorTheme: '#d97706',
    bosses: [
      {
        id: 'giant_lord',
        name: '【关键核心BOSS】巨人王',
        nameEn: 'Giant Lord',
        isOptional: false,
        tips: '在【巨人洛的回忆】城墙尽头。奔跑途中躲避投石机巨石与滚石；钻入其两脚后侧贴脚修脚，注意抬脚重踩；弱暗弱火。击败获得【巨人的共鸣】！',
        transposeWeapon: '反作用（Repel）；巨人王可在不为人知之地篝火添火重复挑战'
      }
    ],
    keyItems: [
      {
        id: 'moa_resonance',
        name: '【核心通关凭证】巨人的共鸣',
        type: 'key_item',
        location: '击败巨人洛回忆中的巨人王直接获得；战场尽头尸体另给一枚巨人灵魂，二者不要混淆。'
      },
      {
        id: 'moa_giant_souls',
        name: '三个【巨人灵魂】',
        type: 'key_item',
        location: '分别通关奥罗、瓦姆、洛三个回忆调查尸身获得'
      }
    ],
    npcInteractions: [
      {
        npcId: 'benhart',
        npcName: '优格的本哈特 (月光遗志继承)',
        stepNumber: 4,
        totalSteps: 5,
        actionRequired: '在咒缚者后方的【巨人奥罗的回忆】深处与他交谈。若此前至少3次Boss战召唤他且幸存，他会将【苍之大剑】、帕玛圆盾及全套防具赠送给你，达成成就「月光大剑」！',
        warning: '若存活场次不足3次，他将不会交付装备，需添火补打或下周目重新完成！'
      },
      {
        npcId: 'herald',
        npcName: '王国队长 德拉蒙德',
        stepNumber: 1,
        totalSteps: 1,
        actionRequired: '在巨人瓦姆回忆中与德拉蒙德队长对话，击败巨人王后再回来对话获得【德拉蒙德头盔】。'
      }
    ],
    checklists: [
      {
        id: 'moa_c1',
        task: '手持灰雾核心前往巨人陨落之森，调查咒缚者后方的巨人树进入【巨人奥罗的回忆】，获取第1个巨人灵魂',
        category: 'collectible'
      },
      {
        id: 'moa_c_benhart',
        task: '在奥罗回忆中与本哈特对话，若已满3次参战存活则继承【苍之大剑与全套防具】',
        category: 'npc'
      },
      {
        id: 'moa_c2',
        task: '调查佩特陷阱旁的巨人树进入【巨人瓦姆的回忆】，获取第2个巨人灵魂',
        category: 'collectible'
      },
      {
        id: 'moa_c3',
        task: '调查主塔后方国王印记门后的巨人树，进入【巨人洛的回忆】',
        category: 'essential'
      },
      {
        id: 'moa_c4',
        task: '在烽火连天的城墙上击败BOSS【巨人王】，斩获【巨人的共鸣】与第3个巨人灵魂！',
        category: 'boss'
      }
    ],
    trapsAndTricks: [
      '刷巨人王应在【不为人知之地（The Place Unbeknownst）】篝火添火，不是主塔。添火会提高关联巨人回忆难度；可在洛回忆中补充添火道具再重复挑战。',
      '回忆有停留时限。先完成本哈特、德拉蒙德对话并确认召唤条件，再规划拾取与Boss战；巨人灵魂用于凡克拉德减防，留在背包不要使用。'
    ],
    connectionsTo: [
      {
        targetId: 'kings_memory',
        requirement: '持灰雾核心进入不死灵庙凡克拉德衣物'
      },
      {
        targetId: 'throne_of_want',
        requirement: '持有【巨人的共鸣】前往渴望王座开启石门'
      }
    ]
  },
  {
    id: 'kings_memory',
    name: '国王记忆与凡克拉德之死 (支线)',
    nameEn: 'King\'s Memory & Vendrick',
    stage: 'memories',
    stageName: '穿越古昔记忆',
    branch: 'main',
    branchName: '第二结局必备前置',
    order: 1,
    lane: 2.5,
    levelRecommendation: 'SL 115 - 130',
    bonfireCount: 0,
    description: '持灰雾核心调查不死灵庙的王袍可进入国王记忆；为第二结局准备时，推荐携带4至5枚巨人灵魂击败现实中的凡克拉德。四王冠祝福可随后回访取得。',
    lore: '「王啊，你为何避而不见火之终焉？——火必将熄灭，因果终将轮回，而人，究竟该何去何从？」',
    colorTheme: '#b45309',
    bosses: [],
    keyItems: [
      {
        id: 'km_blessing',
        name: '【终极祝福】真·国王的加冕祝福',
        type: 'key_item',
        location: '集齐本体与DLC三大王冠后调查国王记忆触发'
      },
      {
        id: 'km_king_crown',
        name: '国王的王冠',
        type: 'key_item',
        location: '击败凡克拉德后，以肉身状态前往阿玛娜第二篝火附近藤蔓密室，开门取得国王灵魂与王装中的王冠。'
      }
    ],
    npcInteractions: [
      {
        npcId: 'aldia',
        npcName: '昔日的国王 凡克拉德',
        stepNumber: 1,
        totalSteps: 4,
        actionRequired: '在记忆中与仍保持神智的国王凡克拉德交谈，倾听他剖析王妃的深渊本质与火之诅咒的真相。'
      }
    ],
    checklists: [
      {
        id: 'km_c1',
        task: '确认背包拥有至少4个【巨人灵魂】(切勿捏碎使用！放在背包即可产生被动破防效果)',
        category: 'essential'
      },
      {
        id: 'km_c2',
        task: '回到不死灵庙深处，对徘徊的【国王凡克拉德】发起攻击并将其彻底击败！',
        category: 'boss'
      },
      {
        id: 'km_c3',
        task: '调查地上的国王防具进入【国王的记忆】，与凡克拉德对话',
        category: 'npc'
      },
      {
        id: 'km_c4',
        task: '四顶王冠均带在背包中，持灰雾核心进入国王记忆，与凡克拉德耗尽对话获得祝福后再勾选；祝福仅本周目佩戴受祝福王冠时生效',
        category: 'secret'
      }
    ],
    trapsAndTricks: [
      '要在王妃战后遇到安第尔，需先完成三处安第尔对话并击败凡克拉德。回答是或否不影响资格。',
      '若已先击败王妃，可补齐安第尔三处对话和凡克拉德击杀条件，再在王城【国王之门】篝火添火，重打王座双守卫与王妃以触发安第尔；添火会永久提高关联战斗难度。',
      '持有灰雾核心即可调查王袍进入国王记忆，不要求先杀凡克拉德；取得他本人的王冠则需击败他，再以肉身状态前往阿玛娜密室。'
    ],
    connectionsTo: [
      {
        targetId: 'throne_of_want',
        requirement: '返回王城多兰古雷格渴望王座决战'
      }
    ]
  },
  {
    id: 'throne_of_want',
    name: '渴望王座',
    nameEn: 'Throne of Want',
    stage: 'throne_endings',
    stageName: '终局决战',
    branch: 'ending',
    branchName: '终局决战',
    order: 0,
    lane: 1.5,
    levelRecommendation: 'SL 120+',
    bonfireCount: 0,
    description: '深埋于王城地下的巨大石窑，象征着统治世界与维持火之时代的至高王座。',
    lore: '「继承光芒之人，承受苦难之人……王座将接纳你的一切，亦将封存你的一切。」',
    colorTheme: '#dc2626',
    bosses: [
      {
        id: 'throne_duo',
        name: '王座看守者 & 王座监视者',
        nameEn: 'Throne Defender & Throne Watcher',
        isOptional: false,
        tips: '双人组。一个偏重甲慢速，一个轻盈敏捷；【核心机制】：两人必须几乎同时击杀！若其中一人倒地太久，另一人会念咒将其以满血完全复活！',
        transposeWeapon: '看守者大剑 / 监视者大剑'
      },
      {
        id: 'nashandra',
        name: '【深渊之相】杜娜湘卓 (王妃)',
        nameEn: 'Nashandra',
        isOptional: false,
        tips: '深渊之祖马努斯最小的碎片化身。场地生成诅咒紫雾石球，迅速滚开砍碎石球；使用雷属性或高物攻武器猛砍其白骨巨躯。',
        transposeWeapon: '渴望弓／渴望镰刀／渴望铃'
      },
      {
        id: 'aldia_boss',
        name: '【第二结局隐藏BOSS】原罪学者 安第尔',
        nameEn: 'Aldia, Scholar of the First Sin',
        isOptional: true,
        tips: '完成第四始源火、不死灵庙、龙祭坛三处对话，并在击败王妃前击败凡克拉德即可触发；回答是或否不影响。避开火环，等护体火焰减弱时输出。',
        transposeWeapon: '不掉落灵魂或道具，无Boss魂兑换'
      }
    ],
    keyItems: [],
    npcInteractions: [
      {
        npcId: 'aldia',
        npcName: '原罪学者 安第尔 (决战台词)',
        stepNumber: 4,
        totalSteps: 4,
        actionRequired: '击败安第尔后，他不会真正死去，而是化作无处不在的低语，见证你最终的道路抉择。'
      }
    ],
    checklists: [
      {
        id: 'tow_c1',
        task: '佩戴国王戒指开启王城第一篝火左侧巨门，沿长长幽暗斜坡下行',
        category: 'essential'
      },
      {
        id: 'tow_c2',
        task: '按支线进度在王座雾门附近召唤【本哈特】、【温格】或学者版【老兵布拉德雷】；凡克拉德不能在此助战',
        category: 'secret'
      },
      {
        id: 'tow_c3',
        task: '击败BOSS【王座看守者 & 王座监视者】(注意平衡血量双杀)',
        category: 'boss'
      },
      {
        id: 'tow_c4',
        task: '持有【巨人的共鸣】时，直接触发最终决战BOSS【王妃杜娜湘卓】！',
        category: 'boss'
      },
      {
        id: 'tow_c5',
        task: '若满足前置条件(3次对话+击杀凡克拉德)，立刻触发隐藏连续决战BOSS【原罪学者 安第尔】！',
        category: 'boss'
      },
      {
        id: 'tow_c6',
        task: '战斗胜利后，走向光芒王座或转身迈出大殿，迎来属于你的终极结局！',
        category: 'essential'
      }
    ],
    trapsAndTricks: [
      '取得不死灵庙的国王戒指后即可提前挑战王座双守卫。巨人王击败后王妃才会出现，准备第二结局时应先处理凡克拉德。',
      '若已先击败王妃，可补齐安第尔三处对话和凡克拉德击杀条件，再在王城【国王之门】篝火添火，重打王座双守卫与王妃以触发安第尔；添火会永久提高关联战斗难度。'
    ],
    connectionsTo: [
      {
        targetId: 'ending_inherit',
        requirement: '走向石棺王座登基'
      },
      {
        targetId: 'ending_leave',
        requirement: '击败安第尔后，转身向大殿出口大门离开'
      }
    ],
    choices: [
      {
        id: 'throne_of_want_ending_choice',
        title: '多兰古雷格终极道路决断 (结局选择)',
        situation: '在消灭深渊化身杜娜湘卓（以及击破原罪学者安第尔）之后，光芒指引着悬浮在中央石桥上的巨石王座，而背后的大殿大门亦微微敞开。',
        recommendedChoice: '两种结局按个人理解选择；要看到离开王座结局，先完成安第尔与凡克拉德的前置条件。',
        options: [
          {
            label: '背对王座，大步走出大殿大门【结局二：离开王座结局】',
            isRecommended: true,
            consequence: '击败安第尔后可转身离开王座，触发另一段结局动画。它也存在于原版1.10更新后，不要求完成DLC。',
            spoilerContent: '「既无光明，亦无黑暗……前方究竟有何等待着我们？纵使希望渺茫，人啊，为何依然不断追寻？」安第尔的低语宣告了不死人对既定宿命的最强反叛！通关后不会强制进入二周目，可在如蜜篝火随时开启新周目。',
            loreReasoning: '跳脱出被操控的火与暗之轮回，探寻人类真正的自由。'
          },
          {
            label: '走上石桥踏入石室王座【结局一：继承王座】',
            isRecommended: false,
            consequence: '踏入王座坐下，由巨人巨石雕凿的厚重大门沉重闭合，将你永久封存在王座之中。世界或将迎来新的短暂光芒，或者沉寂于黑暗，但火与暗的死循环因果从未被打破。',
            spoilerContent: '成为新的凡克拉德，在无尽的岁月流逝中静静等待下一个被诅咒的无名不死人踏入灵庙……这是魂2原版的基础结局。',
            loreReasoning: '顺从了传统火之时代的体制与规则，成为因果齿轮的一部分。'
          }
        ]
      }
    ]
  },
  {
    id: 'ending_inherit',
    name: '结局一：继承王座',
    nameEn: 'Inherit the Throne',
    stage: 'throne_endings',
    stageName: '多结局归宿',
    branch: 'ending',
    branchName: '光之结局',
    order: 1,
    lane: 1,
    levelRecommendation: '通关',
    bonfireCount: 0,
    description: '踏入由石像巨人身躯铸造的石室王座中，巨门轰然紧闭，你成为了多兰古雷格新的主宰，亦是火之因果的守护者。',
    lore: '「王啊，请登上王座。究竟是要点燃火光，还是让世界沉于幽暗，均取决于你的意志……」',
    colorTheme: '#f59e0b',
    bosses: [],
    keyItems: [],
    npcInteractions: [],
    checklists: [
      {
        id: 'end1_c1',
        task: '击败杜娜湘卓(或击败安第尔后)，直接径直走向前方石桥与悬空的石室王座',
        category: 'essential'
      },
      {
        id: 'end1_c2',
        task: '坐在冰冷的石椅上，巨人巨石门合拢，触发原版经典继承王座通关CG动画',
        category: 'essential'
      }
    ],
    trapsAndTricks: [
      '无论你是否击败安第尔，只要向前走向王座，都必然触发该结局。'
    ],
    connectionsTo: []
  },
  {
    id: 'ending_leave',
    name: '结局二：抛弃王座 / 遁入因果之外',
    nameEn: 'Leave the Throne (Scholar of the First Sin)',
    stage: 'throne_endings',
    stageName: '多结局归宿',
    branch: 'ending',
    branchName: '离开王座结局',
    order: 1,
    lane: 2,
    levelRecommendation: '通关（安第尔支线）',
    bonfireCount: 0,
    description: '主角拒绝步入被设定的王座石棺，毅然转身背对王座，大步走出渴望王座大殿，寻求跳脱火与暗宿命轮回的第三条道路。',
    lore: '「既无光明，亦无黑暗……前方究竟有何等待着我们？纵使希望渺茫，人啊，为何依然不断追寻？」',
    colorTheme: '#ef4444',
    bosses: [],
    keyItems: [],
    npcInteractions: [],
    checklists: [
      {
        id: 'end2_c1',
        task: '在第四个始源火、不死灵庙、龙祭坛与安第尔分别耗尽对话，回答是或否均可',
        category: 'essential'
      },
      {
        id: 'end2_c2',
        task: '【必备前置2】：在渴望王座击杀杜娜湘卓之前，前往不死灵庙击杀国王凡克拉德',
        category: 'essential'
      },
      {
        id: 'end2_c3',
        task: '在渴望王座击败杜娜湘卓后迎战隐藏BOSS【原罪学者 安第尔】并将其击败',
        category: 'boss'
      },
      {
        id: 'end2_c4',
        task: '战胜后【不要走上王座】，直接转身跑向大殿出口大门处按互动键离开，触发离开王座CG！',
        category: 'essential'
      }
    ],
    trapsAndTricks: [
      '此结局也存在于原版1.10更新后，并非学者重制版独占；无须完成三部DLC。',
      '若已先击败王妃，可补齐安第尔三处对话和凡克拉德击杀条件，再在王城【国王之门】篝火添火，重打王座双守卫与王妃以触发安第尔；添火会永久提高关联战斗难度。'
    ],
    connectionsTo: []
  },
  {
    id: 'dlc_shulva',
    name: 'DLC 1：圣壁之都萨鲁瓦',
    nameEn: 'Crown of the Sunken King',
    stage: 'dlc',
    stageName: '失落的王冠',
    branch: 'branch_dlc',
    branchName: '沉没之王 (地下城)',
    order: 0,
    lane: 3.5,
    levelRecommendation: 'SL 110 - 130',
    bonfireCount: 4,
    description: '深埋于黑溪谷下方地底的古代阿兹特克风格阶梯金字塔圣城，崇拜着沉睡的剧毒古龙希瓦尔。',
    lore: '「圣壁之王建立了繁荣的地下圣城，然而入侵者的毒枪刺穿了巨龙，整座城市终被毒云淹没。」',
    colorTheme: '#10b981',
    bosses: [
      {
        id: 'elana',
        name: '污秽艾莲娜',
        nameEn: 'Elana, the Squalid Queen',
        isOptional: false,
        tips: '深渊碎片之一。会召唤王盾韦施塔德骨灰或猪群；趁其施法间隙爆发输出。',
        transposeWeapon: '愤怒斧'
      },
      {
        id: 'sinh',
        name: '睡龙 希瓦尔',
        nameEn: 'Sinh, the Slumbering Dragon',
        isOptional: false,
        tips: '频繁在空中吐毒与俯冲；身上带有极强武器腐蚀腐烂度，多备修理光粉；击败获得【沉没之王的王冠】。',
        transposeWeapon: '尤格之枪'
      },
      {
        id: 'gank_squad',
        name: '盗墓三人组 (死者峡谷支线)',
        nameEn: 'Graverobber, Varg, & Cerah',
        isOptional: true,
        tips: '哈维尔战士、双刀盗贼与大弓猎人；绕大水池秦王绕柱风筝，先杀后排弓手。',
        transposeWeapon: '无Boss魂兑换'
      }
    ],
    keyItems: [
      {
        id: 'dlc1_crown',
        name: '【四大王冠 1/4】沉没之王的王冠',
        type: 'key_item',
        location: '击败睡龙希瓦尔后王座拾取'
      }
    ],
    npcInteractions: [],
    checklists: [
      {
        id: 'dlc1_c1',
        task: '从黑溪谷始源火后方祭坛进入，用【龙爪】推开圣壁巨门',
        category: 'essential'
      },
      {
        id: 'dlc1_c2',
        task: '击打沿途发光石柱机关，升降石柱方块解开迷宫谜题与隐藏捷径',
        category: 'secret'
      },
      {
        id: 'dlc1_c3',
        task: '在龙之圣壁寻找并破坏幽灵骑士对应的发光遗体，使其实体化后再战斗',
        category: 'essential'
      },
      {
        id: 'dlc1_dragon_stone',
        task: '在龙之圣壁地刺房铁箱取得【龙石】，到下层水域的圆盘机关嵌入龙石，升起通往龙之安息处的桥并开启升降梯近道',
        category: 'essential'
      },
      {
        id: 'dlc1_c4',
        task: '击败BOSS【污秽艾莲娜】与【睡龙希瓦尔】，夺得【沉没之王冠】',
        category: 'boss'
      }
    ],
    trapsAndTricks: [
      '幽灵骑士的物理抗性极高，优先寻找对应发光遗体并破坏，不要把它们当作普通敌人硬打。',
      '死者之洞的盗墓三人组是可选挑战，不影响沉没王冠；先完成龙石机关与艾莲娜、睡龙主线，再决定是否探索。'
    ],
    connectionsTo: []
  },
  {
    id: 'dlc_brume_tower',
    name: 'DLC 2：黑雾之塔',
    nameEn: 'Crown of the Old Iron King',
    stage: 'dlc',
    stageName: '失落的王冠',
    branch: 'branch_dlc',
    branchName: '铁之古王 (熔炉塔)',
    order: 1,
    lane: 3.5,
    levelRecommendation: 'SL 120 - 140',
    bonfireCount: 4,
    description: '铁之古王曾经开采黑铁与熔炉的核心高塔，如今被灰烬煤炭与烟之骑士雷姆彻底占据。',
    lore: '「王城倾覆后，被放逐的反叛骑士雷姆来到此地，寻得了他誓死效忠的灰烬新娘……」',
    colorTheme: '#f97316',
    bosses: [
      {
        id: 'fume_knight',
        name: '【魂2最强BOSS】烟之骑士 雷姆',
        nameEn: 'Fume Knight (Raime)',
        isOptional: false,
        tips: '推荐先用溶土之楔清除场外四座煤炭神像，防止烟骑士靠近时回血。观察直剑与特大剑连段，二阶段注意慢速火焰横扫，避免提前连滚。',
        transposeWeapon: '烟之特大剑 / 烟之剑'
      },
      {
        id: 'sir_alonne',
        name: '骑士 亚伦 (记忆挑战)',
        nameEn: 'Sir Alonne',
        isOptional: true,
        tips: '古王昔日最亲密挚友。在光滑的大理石大殿上决斗，极致的居合斩与刀法；若无伤击败他，亚伦会触发特殊的切腹自尽死亡动画！',
        transposeWeapon: '亚伦妖刀'
      },
      {
        id: 'blue_smelter',
        name: '蓝镕铁恶魔 (铁之回廊支线)',
        nameEn: 'Blue Smelter Demon',
        isOptional: true,
        tips: '魔力属性高伤害恶魔；战前跑酷铁之回廊拉杆机关，堆高魔抗。',
        transposeWeapon: '老化熔铁剑'
      }
    ],
    keyItems: [
      {
        id: 'dlc2_crown',
        name: '【四大王冠 2/4】铁之古王的王冠',
        type: 'key_item',
        location: '击败烟之骑士雷姆后后方神龛拾取'
      }
    ],
    npcInteractions: [],
    checklists: [
      {
        id: 'dlc2_c1',
        task: '从镕铁城始源火后方祭坛进入，用【重铁钥匙】开启大门',
        category: 'essential'
      },
      {
        id: 'dlc2_c2',
        task: '入口先取得6个【溶土之楔】，规划使用并为烟骑士场外四座神像保留4个；启动升降梯后可再取4个',
        category: 'essential'
      },
      {
        id: 'dlc2_scepter',
        task: '沿塔内路线下降，在喷火敌人所在侧塔底部取得【灼热的铁棒】，返回大厅装入机关启动升降梯，再向底层烟骑士推进',
        category: 'essential'
      },
      {
        id: 'dlc2_c3',
        task: '击败BOSS【烟之骑士雷姆】，获得【铁之古王的王冠】',
        category: 'boss'
      },
      {
        id: 'dlc2_c4',
        task: '持有【灰雾核心】且取得铁之古王冠后，调查顶层亚伦铠甲，进入古王记忆挑战【骑士亚伦】',
        category: 'secret'
      }
    ],
    trapsAndTricks: [
      '溶土之楔共11个：入口6个、启动升降梯后宝箱4个、击败亚伦后1个。推荐先为烟骑士外四座神像保留4个，剩余神像可之后回访清理。',
      '蓝镕铁恶魔在可选的铁之回廊，亚伦在持灰雾核心和铁之古王冠后进入的古王记忆；两者不应写成取得铁之古王冠的前置。'
    ],
    connectionsTo: []
  },
  {
    id: 'dlc_eleum_loyce',
    name: 'DLC 3：冰雪之都埃斯洛耶斯',
    nameEn: 'Crown of the Ivory King',
    stage: 'dlc',
    stageName: '失落的王冠',
    branch: 'branch_dlc',
    branchName: '象牙之王 (雪原极境)',
    order: 2,
    lane: 3.5,
    levelRecommendation: 'SL 130 - 150',
    bonfireCount: 5,
    description: '矗立于狂暴暴风雪之中的冰封神圣国度，镇压着来自混沌深处企图焚尽世界的无尽余烬。',
    lore: '「高洁的象牙之王为了守护子民，率领洛耶斯骑士团舍身跃入古老混沌，抵御熊熊烈焰。」',
    colorTheme: '#67e8f9',
    bosses: [
      {
        id: 'ivory_king',
        name: '【史诗团战】灼热的白王',
        nameEn: 'Burnt Ivory King',
        isOptional: false,
        tips: '默认已有一名洛耶斯骑士，解冻后推荐再救三名，共四名。三名可牺牲封住刷怪门，余下一名协助战斗；未找齐仍可挑战，但要承受更多杂兵压力。',
        transposeWeapon: '白王特大剑'
      },
      {
        id: 'ava',
        name: '王之宠儿 亚瓦 (雪豹)',
        nameEn: 'Aava, the King\'s Pet',
        isOptional: false,
        tips: '推荐先沿右侧路线探索并取得巫女之眼，让亚瓦现形后再战；未取得眼睛也可挑战，但隐形且不能正常锁定，难度显著提高。',
        transposeWeapon: '象牙直剑（Ivory Straight Sword）'
      },
      {
        id: 'lud_zallen',
        name: '苍之卫士 鲁德 & 扎连 (壁外雪原支线)',
        nameEn: 'Lud and Zallen',
        isOptional: true,
        tips: '魂系列最恶名昭彰的「暴风雪驯鹿马拉松跑酷」壁外雪原！双雪豹连战，血量降至一定程度另一只狂暴回血。',
        transposeWeapon: '鲁德魂：洛耶斯大剑；扎连魂：洛耶斯盾'
      }
    ],
    keyItems: [
      {
        id: 'dlc3_crown',
        name: '【四大王冠 3/4】象牙之王的王冠',
        type: 'key_item',
        location: '击败灼热白王后调查混沌王座拾取'
      },
      {
        id: 'dlc3_eye',
        name: '巫女之眼 (破除隐形神物)',
        type: 'key_item',
        location: '神殿回廊拾取，可看清透明敌人与隐形亚瓦'
      }
    ],
    npcInteractions: [
      {
        npcId: 'herald',
        npcName: '沉默王妃 阿尔娜娜',
        stepNumber: 1,
        totalSteps: 1,
        actionRequired: '在至高王座与她对话，她将驱散整座城市的暴风雪冰封，解锁深层探索并允许你唤醒洛耶斯骑士。'
      }
    ],
    checklists: [
      {
        id: 'dlc3_c1',
        task: '从冬之庙传送门进入，用【冰冻花】推开冰雪大门',
        category: 'essential'
      },
      {
        id: 'dlc3_c2',
        task: '先不要打亚瓦，右转拾取【巫女之眼】破除隐形，再击败BOSS【王之宠儿亚瓦】',
        category: 'boss'
      },
      {
        id: 'dlc3_c3',
        task: '击败亚瓦后与阿尔娜娜对话解冻，探索新开放区域救出另外【3名洛耶斯骑士】，加上默认1名共4名',
        category: 'essential'
      },
      {
        id: 'dlc3_c4',
        task: '率领4骑士跃入混沌巨坑，封印熔岩门并击败传奇BOSS【灼热的白王】',
        category: 'boss'
      },
      {
        id: 'dlc3_c5',
        task: '收集全部4顶王冠(沉没+铁之古王+象牙+本体国王)，返回不死灵庙国王记忆触发终极加冕！',
        category: 'secret'
      }
    ],
    trapsAndTricks: [
      '默认有1名骑士，另救3名即可带齐4名。推荐找齐以封住三道刷怪门；这不是进入Boss战的硬性条件。'
    ],
    connectionsTo: [],
    choices: [
      {
        id: 'dlc_eleum_loyce_knights',
        title: '老混沌决战前召集4位洛耶斯骑士抉择',
        situation: '觐见沉默王妃阿尔娜娜解冻冰雪城邦后，大圣堂的混沌巨坑深渊敞开，可以直接跳下迎战白王，也可先探索全城拯救被困的另外3位洛耶斯白骑士。',
        recommendedChoice: '推荐救出另外3名骑士，与默认1名合计4名后再挑战。',
        options: [
          {
            label: '救出另外3名骑士，带齐4名助战',
            isRecommended: true,
            consequence: '默认一名加上救出的三名，共四名骑士助战。三名可牺牲自己封住三道刷怪门，另外一名可继续协助；玩家仍需清理场上残留敌人。',
            loreReasoning: '洛耶斯骑士团誓死追随白王，以身躯完成最后的镇压使命。'
          },
          {
            label: '仅带开局默认的1位骑士直接跳入混沌',
            isRecommended: false,
            consequence: '仅有1名骑士只能封印1道门，其余熔岩门中会源源不断、无休止地涌出高韧性、手持大剑大盾的焦黑洛耶斯骑士！在白王降临后，玩家将被白王与数名精英骑士同时围殴狂砍，死斗难度堪比噩梦地狱！',
            spoilerContent: '骑士未找齐仍可挑战白王，但需要同时处理未封印传送门产生的杂兵。',
            loreReasoning: '孤身一人妄图对抗深渊混沌的余烬，是对昔日白王军团牺牲的轻视。'
          }
        ]
      }
    ]
  }
];

export const NPC_QUESTLINES: NPCQuestline[] = [
  {
    id: 'lucatiel',
    name: '米勒的鲁卡提耶',
    title: '追求自我存在的悲情剑士',
    summary: '来自东方骑士之国米勒的杰出女剑士。因感染不死人诅咒来到多兰古雷格寻找解咒之法。随着旅途深入，她的记忆不断流失，最终在安第尔之馆将象征身份的面具交予主角，令人动容。',
    finalReward: '鲁卡提耶套装、鲁卡提耶正统骑士团面具、米勒大剑、达成「继承遗志之人」成就',
    steps: [
      {
        mapId: 'no_mans_wharf',
        stepIndex: 1,
        title: '密港会面与四臂守卫助战',
        description: '在第一段楼梯后的左侧民房与她耗尽对话，码头船前可召唤她挑战四臂守卫。胜利且她存活计一次；前四处会面顺序可调整。'
      },
      {
        mapId: 'lost_bastille',
        stepIndex: 2,
        title: '遗忘囚笼会面',
        description: '在离塔与麦道夫工房之间的塔楼与她耗尽对话。'
      },
      {
        mapId: 'sinners_rise',
        stepIndex: 3,
        title: '罪人塔助战',
        description: '在升降梯底部召唤她，击败被遗忘的罪人并保证她存活可计一次。'
      },
      {
        mapId: 'earthen_peak',
        stepIndex: 4,
        title: '推土坊下层会面',
        description: '贪婪恶魔前从毒罐支路进入法洛斯机关对面的房间，与她耗尽对话，解锁镕铁恶魔助战。'
      },
      {
        mapId: 'iron_keep',
        stepIndex: 5,
        title: '镕铁恶魔助战',
        description: '在镕铁恶魔雾门前召唤她，胜利且她存活可计一次。可用添火重复同一Boss累计三次。'
      },
      {
        mapId: 'black_gulch',
        stepIndex: 6,
        title: '黑溪谷隐洞会面与腐败物助战',
        description: '从第一篝火沿崖边找到下方小平台，落下进入隐洞耗尽对话；她的召唤印在第二隐藏篝火附近。'
      },
      {
        mapId: 'aldias_keep',
        stepIndex: 7,
        title: '完成条件后再进行最后对话',
        description: '此前四处会面全部完成，且至少三次召唤获胜并存活，再到馆前小屋篝火旁对话继承面具、防具与米勒大剑。',
        warning: '条件不足不要先结束这里的对话；先返回添火补足，否则会失去本周目任务机会。'
      }
    ]
  },
  {
    id: 'benhart',
    name: '优格的本哈特',
    title: '手持苍蓝伪月光的豪迈流浪武士',
    summary: '来自极东之地优格的魁梧异邦武士，身披祖传战袍，背负着他自以为是正统月光大剑的传家宝（实为苍之大剑）。生性豪迈豁达，在多场关键战役中召唤他协助并在3次胜利中保证其存活，即可在巨人奥罗的回忆中继承其剑与甲，达成成就。',
    finalReward: '苍之大剑 (伪月光大剑)、本哈特套装、帕玛圆盾、达成「月光大剑」银奖杯/成就',
    steps: [
      {
        mapId: 'shaded_woods',
        stepIndex: 1,
        title: '解救罗莎贝娜前后对话',
        description: '解除罗莎贝娜石化后，返回本哈特处耗尽对话。'
      },
      {
        mapId: 'brightstone_cove',
        stepIndex: 2,
        title: '王国军野营地召唤',
        description: '召唤印在王国军野营地带练习假人的帐篷内，召唤后击败徘徊主教与信徒并保证他存活。'
      },
      {
        mapId: 'drangleic_castle',
        stepIndex: 3,
        title: '中央篝火与镜之骑士',
        description: '双龙骑兵后的中央篝火旁耗尽对话，在镜之骑士雾门前召唤并保证他存活。'
      },
      {
        mapId: 'forest_of_fallen_giants',
        stepIndex: 4,
        title: '咒缚者后方尸树前对话',
        description: '在咒缚者战场后、巨人奥罗尸树前与实体本哈特耗尽对话。'
      },
      {
        mapId: 'memories_of_ancients',
        stepIndex: 5,
        title: '奥罗会面、洛回忆助战与领奖',
        description: '进入奥罗回忆与他对话后，可在洛回忆召唤他打巨人王。累计三次助战胜利且存活，再回奥罗回忆交谈继承苍之大剑与防具；可添火重复主教等Boss累计。',
        warning: '巨人王战本哈特与德拉蒙德不能同时召唤。'
      }
    ]
  },
  {
    id: 'pate_creighton',
    name: '佩特 与 克雷顿',
    title: '勾心斗角的暗算者与复仇者',
    summary: '温文尔雅却满怀心机的「亲切佩特」与凶狠狂暴的杀人犯逃犯「流浪骑士克雷顿」。两人在旅途中互相算计下套，最终在辉石镇展开你死我活的生死决斗，主角需要决定谁生谁死。',
    finalReward: '隐匿处钥匙、雕刻护腕、生锈硬币；双方防具与佩特之枪、荆棘戒指依具体选择取得',
    steps: [
      {
        mapId: 'forest_of_fallen_giants',
        stepIndex: 1,
        title: '巨森佩特与大白蜡石',
        description: '与铁栅门前佩特对话，探索陷阱后回来耗尽对话取得大白蜡石；若召唤他击败最后巨人且他存活，后续可领取额外装备。'
      },
      {
        mapId: 'huntsmans_copse',
        stepIndex: 2,
        title: '牢房救出克雷顿',
        description: '用不死人牢房钥匙打开第三篝火所在牢房，耗尽克雷顿对话。'
      },
      {
        mapId: 'earthen_peak',
        stepIndex: 3,
        title: '佩特的宝物与近道门',
        description: '绕到佩特房间另一侧取宝并打开门，回来耗尽对话。克雷顿不在本区域。'
      },
      {
        mapId: 'shaded_woods',
        stepIndex: 4,
        title: '虚影遗迹再见克雷顿',
        description: '在通往纳吉卡方向的右侧塔顶耗尽克雷顿对话。'
      },
      {
        mapId: 'brightstone_cove',
        stepIndex: 5,
        title: '决斗与隐匿处奖励',
        description: '主动帮助一方击败另一方，与幸存者取钥匙。佩特掉枪与荆棘戒指，克雷顿掉铁面具。开宝库陷阱箱时及时后撤，收集雕刻护腕与硬币。'
      }
    ]
  },
  {
    id: 'aldia',
    name: '原罪学者 安第尔',
    title: '探寻火与因果真相的禁忌求道者',
    summary: '国王凡克拉德的亲兄长。因反对盲目传火而将自身化作火与根须的不可名状异象。在旅途中不断通过始源火质问主角对火、暗以及人类诅咒的理解，是指引走向第二结局的核心角色。',
    finalReward: '解锁隐藏最终BOSS战、解锁「抛弃王座 / 遁入因果之外」第二结局',
    steps: [
      {
        mapId: 'sinners_rise',
        stepIndex: 1,
        title: '第四始源火破火现身',
        description: '在点燃罪人/铁之古王/弗蕾札/腐败物当中的最后一个始源之火时，安第尔从火坑剧烈爆炸现身，耗尽对话，回答是或否均可。'
      },
      {
        mapId: 'undead_crypt',
        stepIndex: 2,
        title: '不死灵庙初火之辨',
        description: '在不死灵庙第一个篝火处再度爆出，追问你对凡克拉德王逃避责任的看法，耗尽对话，回答是或否均可。'
      },
      {
        mapId: 'dragon_shrine',
        stepIndex: 3,
        title: '龙祭坛终极质询',
        description: '在龙祭坛第一篝火处最后一次问答，追问你是否仍然渴求平静或是想要超越因果，耗尽对话，回答是或否均可。'
      },
      {
        mapId: 'throne_of_want',
        stepIndex: 4,
        title: '渴望王座的决战',
        description: '在打王妃之前先斩杀凡克拉德。击败王妃后，安第尔作为最终隐藏BOSS破火降临！击败他后可背对王座走出大门触发第二结局。若已先击败王妃，可补齐安第尔三处对话和凡克拉德击杀条件，再在王城【国王之门】篝火添火，重打王座双守卫与王妃以触发安第尔；添火会永久提高关联战斗难度。'
      }
    ]
  },
  {
    id: 'grandahl',
    name: '暗之巡礼者 格兰达尔',
    title: '古老暗穴的引导者',
    summary: '坐轮椅的神秘失明盲人老者，引领主角加入暗之巡礼者誓约，开启三处古老暗穴并挑战全游戏最强的隐藏Boss黑暗潜伏者。',
    finalReward: '加入暗之巡礼者誓约、击败【暗天使·黑暗潜伏者】、获得亢奋指环、龙之圣铃',
    steps: [
      {
        mapId: 'shaded_woods',
        stepIndex: 1,
        title: '虚影森林深坑',
        description: '在第三篝火附近长满高草的悬崖凹陷处跳入隐藏山洞，第一次与轮椅老人对话。'
      },
      {
        mapId: 'black_gulch',
        stepIndex: 2,
        title: '黑溪谷悬崖石门',
        description: '用击杀双巨人获得的弃置钥匙，打开黑溪谷下层悬崖边缘的紧闭石门，第二次与他对话。'
      },
      {
        mapId: 'drangleic_castle',
        stepIndex: 3,
        title: '王城地下暗穴汇合',
        description: '在王城地下室左起第三个吸魂开门房间内跳入地洞，第三次与他对话。此时正式受邀加入誓约，点亮三处暗穴的大火台迎战暗天使！'
      }
    ]
  },
  {
    id: 'ornifex',
    name: '鸟人铁匠 欧尼佛斯',
    title: '古代乌鸦眷属之锻造大师',
    summary: '继承了罗德兰画中世界乌鸦人外貌的女性铁匠。掌握着用伟大领主与Boss灵魂打造传奇神兵的失传秘术。',
    finalReward: '所有Boss灵魂武器兑换、强化素材无限购买',
    steps: [
      {
        mapId: 'shaded_woods',
        stepIndex: 1,
        title: '虚影森林地牢获救',
        description: '解石化狮子战士获取尖牙钥匙，跳入地陷陷阱木地板打开牢门解救欧尼佛斯，她邀请你到辉石镇家里做客。'
      },
      {
        mapId: 'brightstone_cove',
        stepIndex: 2,
        title: '辉石镇工坊开业',
        description: '在辉石镇下层流沙附近的屋舍找到她开张的工坊，首次免费为你用Boss魂兑换武器，开启全王魂锻造系统！'
      }
    ]
  },
  {
    id: 'navlaan',
    name: '禁忌者 纳瓦兰',
    title: '双重人格的禁忌宫廷魔导师',
    summary: '被凡克拉德王封印在安第尔之馆的死灵法师。拥有温和学者与嗜血狂徒双重人格。活尸状态与肉身状态会展现出截然相反的行为。',
    finalReward: '驱散戒指、香料、封印太阳（Forbidden Sun）、释放魔力（Unleash Magic）、混沌套装',
    steps: [
      {
        mapId: 'aldias_keep',
        stepIndex: 1,
        title: '保持封印，以活尸形态接任务',
        description: '依次出示：吉里甘出售的梯子饰物、凯尔任务赠送的头盔、智信各20与费尔金对话赠送的日暮之杖、卫龙巢穴绿衣巡礼者赠送的老旧羽毛。无需杀死目标，交差不消耗信物。',
        warning: '不要拉释放拉杆；保持封印，以活尸形态对话。封印太阳是费尔金任务奖励，最终羽毛任务奖励释放魔力。'
      }
    ]
  },
  {
    id: 'vengarl',
    name: '温格的头颅与身躯',
    title: '身首异处的悲情狂战士',
    summary: '来自北方蛮族福洛萨的无双狂剑士。在残酷战争中被斩断头颅，其头颅被遗弃在虚影森林的迷雾中，经过数百年冥想领悟了内心的平静；然而他那不知疲倦的无头肉身依然狂暴地在大陆上本能挥刀杀戮。',
    finalReward: '温格头盔、其余防具、红锈武器购买与后续召唤资格',
    steps: [
      {
        mapId: 'shaded_woods',
        stepIndex: 1,
        title: '浓雾区找到头颅',
        description: '沿左侧岩壁找到温格头颅，耗尽对话即可取得头盔，无需先杀身躯。'
      },
      {
        mapId: 'shaded_woods',
        stepIndex: 2,
        title: '虚影遗迹击败无头身躯',
        description: '学者版身躯在虚影遗迹石化狮子战士后方的区域，击杀后取得铠甲、护手、腿甲。'
      },
      {
        mapId: 'shaded_woods',
        stepIndex: 3,
        title: '回报头颅',
        description: '返回头颅处耗尽对话，解锁红锈武器出售和后续符合条件的召唤。'
      }
    ]
  },
  {
    id: 'licia',
    name: '林德的莉歇尔 (圣职莉奇亚)',
    title: '被深渊浸染的伪圣职与反杀宿命',
    summary: '表面上是传播奇迹的虔诚圣职女修士，实际上是在多国流窜欺诈、私藏巨款并被深渊侵蚀的重犯。引导主角转动机关后，主角将在不死灵庙获得揭穿其罪孽的信物，并在如蜜展开因果清算。',
    finalReward: '环形机关回转石(无需再交魂随时转动机关)、阳光愈合大奇迹、旋天圣铃、圣女全套套装',
    steps: [
      {
        mapId: 'heides_tower',
        stepIndex: 1,
        title: '巨火塔初遇',
        description: '击败龙骑兵后在上层篝火旁与她对话直至重复，她表示渴望前往更繁华的中心聚集地，随后移居如蜜地下通道。'
      },
      {
        mapId: 'majula',
        stepIndex: 2,
        title: '支付2000魂转动机关',
        description: '在如蜜通往海德的地下环形大门处找到她，支付2000灵魂让她转动圆环机关，开启通往狩猎森林的道路。'
      },
      {
        mapId: 'undead_crypt',
        stepIndex: 3,
        title: '获取【碎裂眼眸宝珠】',
        description: '在不死灵庙探索时，从上层梯子隐秘宝箱中拾取专门感应罪孽圣职的神秘道具【碎裂眼眸宝珠】。'
      },
      {
        mapId: 'majula',
        stepIndex: 4,
        title: '眼眸震颤与叛徒反杀',
        description: '携带碎裂眼眸宝珠回到如蜜转动机关处，宝珠开始强烈颤抖鸣响！使用宝珠直接【入侵莉歇尔的世界】！她会疯狂施放原力爆发、雷枪与阳光愈合；将其击杀后揭露真相，夺回回转石与神圣圣铃！',
        warning: '入侵战她回血极猛，务必带打断韧性高的重武器压制连招，切勿让她从容念咒愈合！'
      }
    ]
  },
  {
    id: 'straid',
    name: '孤高法师 史垂德',
    title: '傲慢的古代古龙魔法学者',
    summary: '来自早已覆灭的古老奥拉菲斯王国的傲慢宫廷魔导师。为了躲避灾难而将自己石化数百年。被解除石化后，他以高高在上的语气嘲讽当世的愚昧，却也是全游戏最早为你用Boss灵魂炼化神兵与失传暗术的导师。',
    finalReward: '全早期Boss灵魂武器与稀有法术兑换、黑衣法师全套套装、智力信仰双加成',
    steps: [
      {
        mapId: 'lost_bastille',
        stepIndex: 1,
        title: '牢房解石化救出',
        description: '在遗忘囚笼高层牢房，使用【怀念香木】解除堵住牢门篝火的史垂德石化雕像，点燃牢房内的篝火并与他对话。'
      },
      {
        mapId: 'lost_bastille',
        stepIndex: 2,
        title: '兑换4个Boss魂获赠黑衣套装',
        description: '在他这里使用任意4个领主/Boss灵魂兑换武器或法术后，再次对话他会惊叹你的非凡造诣，赠予极品法师神器【黑衣法师兜帽与全套防具】(大幅增加施法速度与智力)！'
      }
    ]
  },
  {
    id: 'cale',
    name: '制图师 凯尔',
    title: '绘制全大陆巨幅地图的流浪测量者',
    summary: '手持羽毛笔与地图工具的学者。为了测绘多兰古雷格的全境而挖掘了如蜜豪宅地下的巨幅石质大陆浮雕。随着玩家击杀各大阶段领主，石板上的火焰将逐一点亮，最终见证大陆的全貌。',
    finalReward: '如蜜豪宅钥匙、凯尔头盔防具全套、达成「点亮地图之人」成就',
    steps: [
      {
        mapId: 'forest_of_fallen_giants',
        stepIndex: 1,
        title: '巨森主塔洞穴初遇',
        description: '在巨人陨落之森主塔下方的岩洞深处找到正在挖石头的凯尔，反复对话直至他将【如蜜豪宅钥匙】交给你，随后他将启程搬迁至如蜜。'
      },
      {
        mapId: 'majula',
        stepIndex: 2,
        title: '豪宅地下石板点亮8火',
        description: '清理如蜜豪宅地下骷髅后，凯尔可搬入。地图八火对应：最后巨人、罪人、铁之古王、弗蕾札、腐败物，以及取得国王戒指、取得灰雾核心、击败王座双守卫。不是镜之骑士、王盾、巨人王各点一火。'
      },
      {
        mapId: 'majula',
        stepIndex: 3,
        title: '成就与凯尔套装',
        description: '当石板全部8团火焰亮起后，与豪宅地下室的凯尔交谈，他惊叹于整片大陆重现光明，赠予你【凯尔全套防具】，并解锁白金必达成就「点亮地图之人」！'
      }
    ]
  }
];

export const GAME_ENDINGS: GameEnding[] = [
  {
    id: 'ending_inherit',
    name: '结局一：继承王座 (点燃初火 / 封闭王座)',
    nameEn: 'Inherit the Throne',
    subtitle: '多兰古雷格的正统登基之道',
    description: '击败渴望王妃杜娜湘卓后，踏入由石像巨人们身躯铸造的石室王座中。随着石门缓缓合拢，你成为了多兰古雷格新的主宰。无论你是选择点燃初始之火延缓时代的终结，还是选择在王座中静默等待黑暗，因果的锁链都将再次紧扣。',
    loreQuote: '「王啊，请登上王座。究竟是要继承光芒，还是承受苦难，均取决于你的意志……」',
    isScholarExclusive: false,
    conditions: [
      {
        text: '击败渴望王座的【王座看守者 & 王座监视者】',
        checkKey: 'throne_duo'
      },
      {
        text: '持有【巨人的共鸣】，击败最终BOSS【王妃 杜娜湘卓】',
        checkKey: 'nashandra'
      },
      {
        text: '战斗胜利后，直接向前迈步走向石室王座入座',
        checkKey: 'approach_throne'
      }
    ]
  },
  {
    id: 'ending_leave',
    name: '结局二：离开王座',
    nameEn: 'Leave the Throne',
    subtitle: '挣脱虚假轮回的求道者之路',
    description: '在击败杜娜湘卓与原罪学者安第尔后，主角拒绝踏入被神明设定的王座石棺。背对着王座，你毅然决然地迈出宏伟的大殿之门。既没有选择光，也没有选择暗，而是与安第尔一同，走向无人踏足过的「因果之外」的真理追寻之路。',
    loreQuote: '「既无光，亦无暗……前方究竟有何在等待？即使如此，人啊，为何依然不断追求？哪怕前路渺茫，依然前行。」',
    isScholarExclusive: false,
    conditions: [
      {
        text: '在第四个始源火、不死灵庙、龙祭坛与安第尔耗尽对话，回答是或否均可',
        checkKey: 'aldia_dialogues'
      },
      {
        text: '在打渴望王座王妃之前，前往不死灵庙彻底击杀【国王 凡克拉德】',
        checkKey: 'vendrick_defeated'
      },
      {
        text: '击败王妃后，迎战并击败隐藏BOSS【原罪学者 安第尔】',
        checkKey: 'aldia_boss'
      },
      {
        text: '战斗结束后【不要走向王座】，转身走向大殿入口大门推门离开',
        checkKey: 'leave_door'
      }
    ]
  },
  {
    id: 'ending_crowns',
    name: '额外奖励：四王冠祝福（非结局）',
    nameEn: 'The King\'s Blessing',
    subtitle: '佩戴受祝福的王冠时免疫诅咒与死亡活尸化',
    description: '同一周目取得三部DLC王冠和凡克拉德的国王王冠，四顶均带在背包中，持灰雾核心进入国王记忆并耗尽对话可获得祝福。无需先通关本体，原版配齐DLC也能获得。祝福只在本周目、佩戴这四顶受祝福王冠之一时有效，不延续到下一周目，也不会代替人像恢复已有的活尸状态。',
    loreQuote: '「寻求王冠之人啊，你已证明了自己的力量。诅咒将不再侵蚀你的肉身与神智。」',
    isScholarExclusive: false,
    conditions: [
      {
        text: '击败睡龙希瓦尔，获得【沉没之王的王冠】(DLC1)',
        checkKey: 'crown_sunken'
      },
      {
        text: '击败烟之骑士雷姆，获得【铁之古王的王冠】(DLC2)',
        checkKey: 'crown_iron'
      },
      {
        text: '击败灼热的白王，获得【象牙之王的王冠】(DLC3)',
        checkKey: 'crown_ivory'
      },
      {
        text: '击败凡克拉德并在阿玛娜祭坛密室拾取【国王的王冠】',
        checkKey: 'crown_vendrick'
      },
      {
        text: '携带四顶王冠进入不死灵庙国王记忆与凡克拉德对话完成终极加冕',
        checkKey: 'crowns_consecrated'
      }
    ]
  }
];
