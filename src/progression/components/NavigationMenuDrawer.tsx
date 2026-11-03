import React, { useEffect } from 'react';
import { 
  X, 
  Flame, 
  Compass, 
  Users, 
  Crown, 
  CheckSquare, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  MapPin, 
  Sparkles,
  Smartphone,
  ChevronRight,
  Layers,
  HelpCircle,
  Trash2,
  ShoppingBag
} from 'lucide-react';
import { RouteFilterType } from '../utils/progressionLogic';
import { NPCId } from '../types/souls';
import { MAP_NODES, NPC_QUESTLINES } from '../data/soulsData';
import { DRANGLEIC_MERCHANTS } from '../data/merchantData';

interface NavigationMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  routeFilter: RouteFilterType;
  onSelectRouteFilter: (filter: RouteFilterType) => void;
  npcFilter: NPCId | 'all';
  onSelectNpcFilter: (npc: NPCId | 'all') => void;
  isSpoilerProtectionOn: boolean;
  onToggleSpoilerProtection: () => void;
  onOpenNpcModal: () => void;
  onOpenEndingsModal: () => void;
  onOpenProgressModal: () => void;
  onOpenMerchantModal: () => void;
  onResetView: () => void;
  completionPercentage: number;
  defeatedBossCount: number;
  totalBossCount: number;
  onBack?: () => void;
}

export const NavigationMenuDrawer: React.FC<NavigationMenuDrawerProps> = ({
  isOpen,
  onClose,
  routeFilter,
  onSelectRouteFilter,
  npcFilter,
  onSelectNpcFilter,
  isSpoilerProtectionOn,
  onToggleSpoilerProtection,
  onOpenNpcModal,
  onOpenEndingsModal,
  onOpenProgressModal,
  onOpenMerchantModal,
  onResetView,
  completionPercentage,
  defeatedBossCount,
  totalBossCount,
  onBack,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const routeOptions: { id: RouteFilterType; label: string; desc: string; iconColor: string }[] = [
    { id: 'all', label: '全部地图节点', desc: `完整展示${MAP_NODES.length}个流程节点关系网`, iconColor: 'text-amber-400' },
    { id: 'golden_path', label: '推荐通关流程', desc: '按四古魂推进的常规探索路线，含推荐支路', iconColor: 'text-yellow-400' },
    { id: 'four_souls', label: '始源四巨魂', desc: '罪人/铁之王/腐败物/辉石镇分支', iconColor: 'text-orange-400' },
    { id: 'endings', label: '渴望王座结局', desc: '王座与安第尔双结局必由之路', iconColor: 'text-red-400' },
    { id: 'dlc', label: '失落王冠三部曲', desc: '圣壁之城/黑雾之塔/埃斯洛耶斯', iconColor: 'text-purple-400' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-in fade-in duration-200"
      style={{
        paddingRight: 'var(--safe-right, 0px)',
        paddingBottom: 'var(--safe-bottom, 0px)',
      }}
    >
      {/* Dark backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-label="关闭菜单"
      />

      {/* Menu Panel */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg bg-[#11131c] border-l border-[#4a3f32] shadow-2xl flex flex-col h-full overflow-hidden text-stone-200 animate-in slide-in-from-right duration-300">
        
        {/* Menu Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-gradient-to-r from-[#181b26] to-[#12141d] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-600/60 flex items-center justify-center glow-ember shrink-0">
              <Compass className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-cinzel text-amber-200">
                流程图菜单与设置
              </h2>
              <p className="text-[11px] text-stone-400">
                路线筛选 • NPC追踪 • 剧透防护 • 专题全书
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
            aria-label="关闭菜单"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-xs sm:text-sm">

          {/* Quick Progress Banner */}
          <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-300 font-medium flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                当前探索进度
              </span>
              <span className="font-mono text-amber-400 font-bold">{completionPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-600 via-orange-500 to-amber-300 transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-stone-400 pt-0.5">
              <span>已讨伐首领: {defeatedBossCount} / {totalBossCount}</span>
              <button
                onClick={() => {
                  onClose();
                  onOpenProgressModal();
                }}
                className="text-amber-400 hover:underline flex items-center gap-0.5"
              >
                <span>查看详细清单</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 1. Route Filter Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase font-mono tracking-wider text-amber-400/90 font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>流程路线筛选</span>
              </h3>
              {routeFilter !== 'all' && (
                <button
                  onClick={() => onSelectRouteFilter('all')}
                  className="text-[10px] text-amber-400 hover:underline"
                >
                  重置为全部
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {routeOptions.map((opt) => {
                const isActive = routeFilter === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onSelectRouteFilter(opt.id)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                      isActive
                        ? 'bg-amber-950/40 border-amber-500/80 text-amber-100 shadow-sm shadow-amber-950/50'
                        : 'bg-stone-900/50 border-stone-800/80 text-stone-300 hover:bg-stone-800/60 hover:border-stone-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-xs sm:text-sm">
                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-amber-400' : 'bg-stone-600'}`} />
                        <span>{opt.label}</span>
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5 pl-3.5">
                        {opt.desc}
                      </div>
                    </div>
                    {isActive && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-900/60 border border-amber-500/60 text-amber-300 shrink-0">
                        生效中
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. NPC Questline Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase font-mono tracking-wider text-amber-400/90 font-semibold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>NPC 支线高亮追踪</span>
              </h3>
              {npcFilter !== 'all' && (
                <button
                  onClick={() => onSelectNpcFilter('all')}
                  className="text-[10px] text-amber-400 hover:underline"
                >
                  清除NPC高亮
                </button>
              )}
            </div>

            <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 space-y-2">
              <label htmlFor="menu-npc-select" className="text-[11px] text-stone-400 block">
                选择特定NPC可在流程图上以青色高亮其现身的地图与连线路径：
              </label>
              <select
                id="menu-npc-select"
                value={npcFilter}
                onChange={(e) => onSelectNpcFilter(e.target.value as NPCId | 'all')}
                className="w-full p-2 rounded-lg bg-black/60 border border-stone-700 text-stone-200 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="all">显示全部路线（不高亮单一NPC）</option>
                {NPC_QUESTLINES.map((npc) => (
                  <option key={npc.id} value={npc.id}>
                    {npc.name} — {npc.title} ({npc.steps.length} 处出没)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Spoiler Protection Setting */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-mono tracking-wider text-amber-400/90 font-semibold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
              <span>剧透防护设置</span>
            </h3>

            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-950/20 via-stone-900/60 to-black/60 border border-purple-900/40 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {isSpoilerProtectionOn ? (
                    <EyeOff className="w-5 h-5 text-purple-400 shrink-0" />
                  ) : (
                    <Eye className="w-5 h-5 text-stone-400 shrink-0" />
                  )}
                  <div>
                    <div className="font-semibold text-xs sm:text-sm text-stone-200">
                      剧透保护遮罩: {isSpoilerProtectionOn ? '已开启 (推荐)' : '已关闭'}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      {isSpoilerProtectionOn 
                        ? '地点抉择后果、结局与剧情细节将以马赛克蒙版遮挡，点击即可逐条查看' 
                        : '所有剧情、选项后果与剧透内容直接清晰展示'}
                    </div>
                  </div>
                </div>

                {/* Switch button */}
                <button
                  onClick={onToggleSpoilerProtection}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all shrink-0 ${
                    isSpoilerProtectionOn
                      ? 'bg-purple-900/60 border-purple-500 text-purple-200 shadow-md shadow-purple-950'
                      : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {isSpoilerProtectionOn ? '切换为关闭' : '开启防护'}
                </button>
              </div>
            </div>
          </div>

          {/* 4. Special Guide Modals */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-mono tracking-wider text-amber-400/90 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>专题攻略图鉴</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  onClose();
                  onOpenMerchantModal();
                }}
                className="p-3 rounded-xl bg-gradient-to-br from-[#1b1c28] to-[#12131c] border border-amber-600/60 hover:border-amber-400 text-left transition-all group flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <ShoppingBag className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>商人与法术</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    全{DRANGLEIC_MERCHANTS.length}位商人/法师/暗术与Boss魂换兵器
                  </p>
                </div>
                <span className="text-[10px] text-amber-400 font-mono mt-2 group-hover:underline flex items-center gap-0.5 font-semibold">
                  全书图鉴 <ChevronRight className="w-2.5 h-2.5" />
                </span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenEndingsModal();
                }}
                className="p-3 rounded-xl bg-stone-900/70 border border-stone-800 hover:border-amber-500/70 text-left transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <Crown className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>多重结局</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    学者版双结局与四王冠祝福条件
                  </p>
                </div>
                <span className="text-[10px] text-amber-400/80 font-mono mt-2 group-hover:underline flex items-center gap-0.5">
                  打开查看 <ChevronRight className="w-2.5 h-2.5" />
                </span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenNpcModal();
                }}
                className="p-3 rounded-xl bg-stone-900/70 border border-stone-800 hover:border-amber-500/70 text-left transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <Users className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>NPC支线</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    全{NPC_QUESTLINES.length}条NPC支线相遇与关键触发点
                  </p>
                </div>
                <span className="text-[10px] text-amber-400/80 font-mono mt-2 group-hover:underline flex items-center gap-0.5">
                  打开查看 <ChevronRight className="w-2.5 h-2.5" />
                </span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenProgressModal();
                }}
                className="p-3 rounded-xl bg-stone-900/70 border border-stone-800 hover:border-amber-500/70 text-left transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <CheckSquare className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>全收集清单</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    全首领击破率与要素汇总
                  </p>
                </div>
                <span className="text-[10px] text-amber-400/80 font-mono mt-2 group-hover:underline flex items-center gap-0.5">
                  打开查看 <ChevronRight className="w-2.5 h-2.5" />
                </span>
              </button>
            </div>
          </div>

          {/* 5. Mobile & Usability Hints */}
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 text-[11px] text-stone-300 space-y-1.5">
            <div className="font-semibold text-amber-300 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              <span>常见手机分辨率与交互优化</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-stone-400">
              <li><strong className="text-stone-300">手机横屏推荐：</strong>手机横置后视野更加宽广，符合流程图从左至右的推图逻辑。</li>
              <li><strong className="text-stone-300">地点全页查看：</strong>在流程图中轻触任意地点，即可进入一整个专属页面查看全量清单、打法与关键抉择。</li>
              <li><strong className="text-stone-300">双指与拖拽：</strong>可自由平移、双指缩放流程图；底部还配有阶段快速跳跃坞。</li>
            </ul>
          </div>

          {/* 6. Utility actions */}
          <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
            <button
              onClick={() => {
                onResetView();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-700 bg-stone-900 hover:bg-stone-800 text-xs text-stone-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>重置视野至起点</span>
            </button>

            <div className="flex items-center gap-2">
              {onBack && (
                <button
                  onClick={() => {
                    onClose();
                    onBack();
                  }}
                  className="px-3 py-1.5 rounded-lg border border-amber-600 bg-amber-950/70 hover:bg-amber-900 text-xs text-amber-200 transition-colors"
                >
                  返回主页/地图
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-semibold text-xs transition-colors"
              >
                完成
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
