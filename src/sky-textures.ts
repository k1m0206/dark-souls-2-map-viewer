// 《黑暗之魂 2》（Dark Souls II）原版原生天空贴图映射表
// 提取自游戏原始 GameDataEbl 资源包中各区域对应的 tXX_XX_00_00.tpfbdt 纹理档案
import t_10_02 from './assets/sky/10_02_enkeiA00_d.webp';
import t_10_04 from './assets/sky/10_04_m10_04_sky_01_d.webp';
import t_10_10 from './assets/sky/10_10_sky_01_d.webp';
import t_10_14 from './assets/sky/10_14_sky_17_d.webp';
import t_10_15 from './assets/sky/10_15_sky_03_d.webp';
import t_10_16 from './assets/sky/10_16_sky_32_d.webp';
import t_10_17 from './assets/sky/10_17_sky_32_d.webp';
import t_10_18 from './assets/sky/10_18_m99_91_sky_00.webp';
import t_10_19 from './assets/sky/10_19_sky_00_d.webp';
import t_10_23 from './assets/sky/10_23_sky_00_d.webp';
import t_10_27 from './assets/sky/10_27_sky_00_d.webp';
import t_10_29 from './assets/sky/10_29_sky_02_d.webp';
import t_10_31 from './assets/sky/10_31_sky_02_d.webp';
import t_10_32 from './assets/sky/10_32_sky_32_d.webp';
import t_20_10 from './assets/sky/20_10_sky_01_d.webp';
import t_20_21 from './assets/sky/20_21_sky_00_d.webp';
import t_20_24 from './assets/sky/20_24_sky_01.webp';
import t_20_26 from './assets/sky/20_26_sky_32_d.webp';
import t_50_35 from './assets/sky/50_35_enkei_04_d.webp';
import t_50_36 from './assets/sky/50_36_sky_00_d.webp';
import t_50_37 from './assets/sky/50_37_sky_50_d.webp';

export const MAP_SKY_TEXTURES: Record<string, string> = {
  m10_02: t_10_02, // 一线天森林：石穹洞穴破口天光
  m10_04: t_10_04, // 如蜜：绝美落日余晖海平面晚霞
  m10_10: t_10_10, // 巨人陨落之森：苍茫海岸阴云
  m10_14: t_10_14, // 辉石镇盖多勒：炽烈干涸黄沙晴空
  m10_15: t_10_15, // 安第尔之馆：冷寂暗暮长空
  m10_16: t_10_16, // 遗忘牢笼：幽暗夜海狂澜
  m10_17: t_10_17, // 流油谷堆土塔：沉滞毒雾霾天
  m10_18: t_10_18, // 密港：海蚀地穴暗夜幽海
  m10_19: t_10_19, // 熔铁城：烈焰焚天熔岩烟云
  m10_23: t_10_23, // 狩猎森林：阴暗幽绿森林夜空
  m10_27: t_10_27, // 卫龙巢穴与龙祭坛：高耸云海纯净蔚蓝苍穹
  m10_29: t_10_29, // 如蜜地底通道
  m10_30: t_10_31, // 海德巨火塔：海天一色碧波晴空（共享青之圣堂）
  m10_31: t_10_31, // 青之圣堂：海天一色碧波晴空
  m10_32: t_10_32, // 虚影森林：迷雾笼罩灰白寒空
  m20_10: t_20_10, // 巨人回忆：战火废墟灰烬天穹
  m20_21: t_20_21, // 多兰古雷格王城：倾盆暴雨暗夜狂雷
  m20_24: t_20_24, // 不死灵庙：幽暗冥宫深渊
  m20_26: t_20_26, // 古龙回忆：虚幻原初苍白虚空
  m50_35: t_50_35, // 圣壁之都萨尔瓦：深邃毒沼地底古城远景
  m50_36: t_50_36, // 黑雾之塔：漫天煤灰滚滚黑风暴
  m50_37: t_50_37, // 埃斯・洛耶斯：壁外雪原极寒暴风雪
};
