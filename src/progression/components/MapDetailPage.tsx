import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  CheckSquare, 
  Square, 
  Skull, 
  Sparkles, 
  Key, 
  Users, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  Sword,
  Info,
  Scale,
  Compass,
  Flame,
  ChevronRight,
  Eye,
  MapPin,
  ShoppingBag,
  Coins,
  BookOpen,
  Award
} from 'lucide-react';
import { MapNode, UserProgress } from '../types/souls';
import { SpoilerText } from './SpoilerText';
import { getMerchantsForMap, MERCHANT_CATEGORY_CONFIG } from '../data/merchantData';
import { getAchievementsForMap } from '../data/achievementsData';
import { AchievementIcon } from './AchievementIcon';
import { PROGRESSION_TO_3D_MAP_ID, PROGRESSION_RETURN_MAPS } from '../data/mapNavigation';

interface MapDetailPageProps {
  node: MapNode;
  allNodes: MapNode[];
  onBackToFlowchart: () => void;
  userProgress: UserProgress;
  onToggleChecklist: (taskId: string) => void;
  onToggleBoss: (bossId: string) => void;
  onToggleItem: (itemId: string) => void;
  onToggleMapComplete: (mapId: string) => void;
  onNavigateToNode: (nodeId: string) => void;
  isSpoilerProtectionOn?: boolean;
  onOpenMap?: (mapId: string) => void;
  onToggleAchievement?: (achievementId: string) => void;
  onOpenAchievementsModal?: () => void;
}

export const MapDetailPage: React.FC<MapDetailPageProps> = ({
  node,
  allNodes,
  onBackToFlowchart,
  userProgress,
  onToggleChecklist,
  onToggleBoss,
  onToggleItem,
  onToggleMapComplete,
  onNavigateToNode,
  isSpoilerProtectionOn = true,
  onOpenMap,
  onToggleAchievement,
  onOpenAchievementsModal,
}) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'choices' | 'bosses' | 'items' | 'npc' | 'tricks' | 'merchants' | 'achievements'>('checklist');
  const [merchantSearchFilter, setMerchantSearchFilter] = useState('');

  const mapMerchants = getMerchantsForMap(node.id);
  const mapAchievements = getAchievementsForMap(node.id);
  const unlockedSet = new Set(userProgress.unlockedAchievements || []);
  const completedMapAchievementsCount = mapAchievements.filter(a => unlockedSet.has(a.id)).length;
  const hasMissableAchievements = mapAchievements.some(a => a.isMissable);

  // If node has choices, user might want to see choices easily
  useEffect(() => {
    // Reset to checklist on node switch
    setActiveTab('checklist');
    setMerchantSearchFilter('');
  }, [node.id]);

  // Handle ESC key to return to flowchart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBackToFlowchart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBackToFlowchart]);

  const isMapCompleted = userProgress.completedMaps.includes(node.id);
  const completedTaskCount = node.checklists.filter(c => userProgress.completedChecklists.includes(c.id)).length;
  const progressPercent = node.checklists.length > 0 
    ? Math.round((completedTaskCount / node.checklists.length) * 100) 
    : 100;

  // Find incoming & outgoing maps
  const incomingMaps = allNodes.filter(n => n.connectionsTo.some(c => c.targetId === node.id));
  const outgoingMaps = node.connectionsTo.map(c => {
    const target = allNodes.find(n => n.id === c.targetId);
    return {
      conn: c,
      target
    };
  });

  return (
    <div 
      className="absolute inset-0 z-50 bg-[#0c0d12] text-stone-200 overflow-y-auto flex flex-col animate-in fade-in duration-200"
      style={{
        paddingLeft: 'var(--safe-left, 0px)',
        paddingRight: 'var(--safe-right, 0px)',
        paddingBottom: 'var(--safe-bottom, 0px)',
      }}
    >
      
      {/* Top Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#12141c]/95 backdrop-blur-md border-b border-[#3e3427] px-3 sm:px-6 py-1.5 sm:py-2.5 shadow-xl shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          
          {/* Back button & Breadcrumb */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={onBackToFlowchart}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-600/70 text-amber-200 text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95 shrink-0"
              title="返回游玩全景流程图 (快捷键: Esc)"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>返回流程图</span>
            </button>

            <div className="flex items-center gap-1.5 text-xs text-stone-400 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="hidden md:inline">阶段:</span>
              <span className="font-mono text-amber-400/90 truncate">{node.stageName}</span>
              <span className="text-stone-600 hidden sm:inline">/</span>
              <span className="text-stone-300 font-semibold truncate hidden sm:inline">{node.branchName}</span>
            </div>
          </div>

          {/* Right actions: Map complete status toggle & 3D Map switch */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] sm:text-xs font-mono px-2 py-0.5 rounded bg-black/60 border border-stone-700 text-amber-300 hidden sm:inline">
              SL {node.levelRecommendation.replace('SL ', '')}
            </span>

            {onOpenMap && PROGRESSION_TO_3D_MAP_ID[node.id] && (
              <button
                onClick={() => onOpenMap(PROGRESSION_TO_3D_MAP_ID[node.id])}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border border-amber-600/70 bg-gradient-to-r from-amber-950/80 to-amber-900/60 text-amber-200 hover:text-amber-100 hover:border-amber-400 transition-all shadow-sm active:scale-95"
                title="在3D实景模型中漫步探索此地图"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>进入3D地图</span>
              </button>
            )}

            <button
              onClick={() => onToggleMapComplete(node.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                isMapCompleted
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950'
                  : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-amber-500 hover:text-amber-200'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${isMapCompleted ? 'text-emerald-400' : 'text-stone-500'}`} />
              <span>{isMapCompleted ? '已探索通关' : '标记已探索'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6 space-y-6">
        {onOpenMap && PROGRESSION_RETURN_MAPS[node.id]?.map(returnMap => (
          <button
            key={returnMap.mapId}
            onClick={() => onOpenMap(returnMap.mapId)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm border border-amber-700/60 text-amber-200 hover:bg-amber-950/40"
            title="取得灰雾核心后，返回芙蕾雅战场调查结晶进入"
          >
            <Compass className="w-4 h-4" />
            {returnMap.label}（后期返程）
          </button>
        ))}
        
        {/* Hero Section: Location Title & Atmosphere Lore */}
        <div className="relative rounded-2xl bg-gradient-to-br from-[#1c1f2d] via-[#141620] to-[#0d0f17] border border-[#4a3e2e] p-4 sm:p-6 shadow-2xl overflow-hidden">
          {/* Subtle souls background ambient light */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-mono font-bold bg-amber-950/70 border border-amber-600 text-amber-300">
                  {node.stageName} • {node.branchName}
                </span>
                <span className="text-xs font-mono text-stone-400">
                  推荐等级：SL {node.levelRecommendation.replace('SL ', '')}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-200">
                {node.name}
              </h1>
              <p className="text-xs sm:text-sm text-stone-400 font-serif italic mt-0.5">
                {node.nameEn}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-black/40 p-2.5 sm:p-3 rounded-xl border border-stone-800">
              <div className="text-center px-2 py-1">
                <div className="text-[10px] text-stone-400">流程清单</div>
                <div className="font-mono text-xs sm:text-sm font-bold text-amber-300">
                  {completedTaskCount}/{node.checklists.length}
                </div>
              </div>
              <div className="h-6 w-px bg-stone-800" />

              <div className="text-center px-2 py-1">
                <div className="text-[10px] text-stone-400">首领战</div>
                <div className="font-mono text-xs sm:text-sm font-bold text-orange-400">
                  {node.bosses.length} 尊
                </div>
              </div>
              <div className="h-6 w-px bg-stone-800" />

              <div className="text-center px-2 py-1">
                <div className="text-[10px] text-stone-400">关键道具</div>
                <div className="font-mono text-xs sm:text-sm font-bold text-cyan-400">
                  {node.keyItems.length} 件
                </div>
              </div>
              <div className="h-6 w-px bg-stone-800" />

              <div className="text-center px-2 py-1">
                <div className="text-[10px] text-stone-400">核心抉择</div>
                <div className="font-mono text-xs sm:text-sm font-bold text-amber-400">
                  {node.choices?.length ?? 0} 处
                </div>
              </div>

              {mapAchievements.length > 0 && (
                <>
                  <div className="h-6 w-px bg-stone-800" />
                  <div 
                    className="text-center px-2 py-1 cursor-pointer hover:bg-stone-800/50 rounded-lg transition-colors" 
                    onClick={() => setActiveTab('achievements')}
                    title="点击切换到 Steam 成就板块"
                  >
                    <div className="text-[10px] text-stone-400">Steam成就</div>
                    <div className="font-mono text-xs sm:text-sm font-bold text-amber-300 flex items-center justify-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{completedMapAchievementsCount}/{mapAchievements.length}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Missable Achievement Warning Alert Banner */}
          {hasMissableAchievements && (
            <div className="mt-3 p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 flex items-start gap-2.5 shadow-sm">
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5 animate-pulse" />
              <div className="text-xs text-rose-200">
                <div className="font-bold text-rose-300 text-xs sm:text-sm flex items-center gap-1.5 flex-wrap">
                  <span>包含重要防错过成就决策节点！</span>
                  <button 
                    onClick={() => setActiveTab('achievements')}
                    className="underline text-amber-300 hover:text-amber-100 font-normal text-xs"
                  >
                    查看详情与攻略 →
                  </button>
                </div>
                <div className="mt-0.5 text-rose-200/90 leading-relaxed">
                  本区域涉及易错过成就的重要决策（如 NPC 剧情、Boss 存活助战或关键道具保留）。请仔细阅读成就指引与清单中的防错过警告，切勿盲目推进。
                </div>
              </div>
            </div>
          )}

          {/* Lore Quote */}
          {node.lore && (
            <div className="mt-4 p-3 rounded-xl bg-amber-950/25 border-l-4 border-amber-600 text-xs sm:text-sm text-amber-200/90 font-serif italic leading-relaxed">
              &ldquo;{node.lore}&rdquo;
            </div>
          )}

          {/* Progress bar inside map */}
          <div className="mt-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>探索进度达成度</span>
              <span className="font-mono text-amber-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-stone-800/80 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-600 via-orange-500 to-amber-300 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls (Horizontal scroll on mobile, responsive buttons) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 border-b border-stone-800 text-xs sm:text-sm scrollbar-none">
          
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'checklist'
                ? 'bg-amber-600/30 border border-amber-500 text-amber-200 shadow-sm'
                : 'bg-stone-900/60 border border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-amber-400" />
            <span>流程清单 ({node.checklists.length})</span>
          </button>

          {node.choices && node.choices.length > 0 && (
            <button
              onClick={() => setActiveTab('choices')}
              className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                activeTab === 'choices'
                  ? 'bg-gradient-to-r from-amber-700/40 to-orange-950/60 border border-amber-400 text-amber-100 shadow-md shadow-amber-950'
                  : 'bg-amber-950/20 border border-amber-800/60 text-amber-300 hover:border-amber-500'
              }`}
            >
              <Scale className="w-4 h-4 text-amber-400" />
              <span className="flex items-center gap-1">
                <span>关键抉择与后果</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-black font-bold font-mono">
                  {node.choices.length}
                </span>
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('bosses')}
            className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'bosses'
                ? 'bg-amber-600/30 border border-amber-500 text-amber-200 shadow-sm'
                : 'bg-stone-900/60 border border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Skull className="w-4 h-4 text-orange-400" />
            <span>首领讨伐 ({node.bosses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('items')}
            className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'items'
                ? 'bg-amber-600/30 border border-amber-500 text-amber-200 shadow-sm'
                : 'bg-stone-900/60 border border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>重要收集 ({node.keyItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('npc')}
            className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'npc'
                ? 'bg-amber-600/30 border border-amber-500 text-amber-200 shadow-sm'
                : 'bg-stone-900/60 border border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Users className="w-4 h-4 text-indigo-400" />
            <span>NPC支线 ({node.npcInteractions.length})</span>
          </button>

          {mapMerchants.length > 0 && (
            <button
              onClick={() => setActiveTab('merchants')}
              className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                activeTab === 'merchants'
                  ? 'bg-gradient-to-r from-amber-700/50 to-yellow-950/70 border border-amber-400 text-amber-100 shadow-md shadow-amber-950'
                  : 'bg-amber-950/30 border border-amber-700/60 text-amber-300 hover:border-amber-400'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="flex items-center gap-1">
                <span>商人与法术</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-black font-bold font-mono">
                  {mapMerchants.length}
                </span>
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('tricks')}
            className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              activeTab === 'tricks'
                ? 'bg-amber-600/30 border border-amber-500 text-amber-200 shadow-sm'
                : 'bg-stone-900/60 border border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span>机关近道与路线</span>
          </button>

          {mapAchievements.length > 0 && (
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                activeTab === 'achievements'
                  ? 'bg-amber-600/30 border border-amber-500 text-amber-200 shadow-sm'
                  : 'bg-stone-900/60 border border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Steam成就 ({completedMapAchievementsCount}/{mapAchievements.length})</span>
              {hasMissableAchievements && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse ml-0.5" />
              )}
            </button>
          )}
        </div>

        {/* TAB 1: CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-stone-900/60 border border-stone-800 text-xs text-stone-400">
              <span>点击方框可实时记录推图进度，已完成项目带有划线提示，进度持久化存储于本地：</span>
              <span className="font-mono text-amber-300 shrink-0">
                已完成: {completedTaskCount} / {node.checklists.length} 项
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {node.checklists.map((item) => {
                const isChecked = userProgress.completedChecklists.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => onToggleChecklist(item.id)}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-emerald-950/25 border-emerald-800/80 text-stone-300'
                        : 'bg-[#141620] border-stone-800 hover:border-amber-600/60 text-stone-100 hover:bg-[#181a26]'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Square className="w-5 h-5 text-stone-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                          item.category === 'essential'
                            ? 'bg-amber-950/90 border border-amber-600 text-amber-300'
                            : item.category === 'boss'
                            ? 'bg-red-950/90 border border-red-600 text-red-300'
                            : item.category === 'npc'
                            ? 'bg-cyan-950/90 border border-cyan-600 text-cyan-300'
                            : item.category === 'secret'
                            ? 'bg-purple-950/90 border border-purple-600 text-purple-300'
                            : 'bg-stone-800 border border-stone-700 text-stone-300'
                        }`}>
                          {item.category === 'essential' ? '核心必经' :
                           item.category === 'boss' ? '首领讨伐' :
                           item.category === 'npc' ? 'NPC支线' :
                           item.category === 'secret' ? '隐藏机关' : '宝物收集'}
                        </span>
                      </div>
                      <p className={`text-xs sm:text-sm leading-relaxed break-words ${
                        isChecked ? 'line-through text-stone-400' : 'text-stone-200'
                      }`}>
                        {item.task}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: CHOICES & CONSEQUENCES (KEY REQUEST!) */}
        {activeTab === 'choices' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-stone-900/80 to-black border border-amber-700/60 flex items-start gap-3">
              <Scale className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                <strong className="text-amber-300 font-semibold">魂2关键抉择与后果导引：</strong>
                此处汇集了本地区面临的重要决策分歧。我们为玩家整理了<span className="text-amber-200 font-bold">【官方/资深玩家推荐选择】</span>，并详尽剖析了每项分支的即时后果与长期影响。涉及重大结局剧透的内容已启用马赛克防护，点击即可随时查看。
              </div>
            </div>

            {node.choices && node.choices.map((choice) => (
              <div
                key={choice.id}
                className="p-5 rounded-2xl bg-[#141622] border border-amber-800/60 shadow-xl space-y-4"
              >
                {/* Choice Title & Dilemma */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    <h3 className="text-lg sm:text-xl font-bold font-cinzel text-amber-200">
                      {choice.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed bg-black/40 p-3 rounded-xl border border-stone-800/80">
                    <span className="text-stone-400 font-medium mr-1.5">【面临情境】：</span>
                    {choice.situation}
                  </p>
                </div>

                {/* Highly Visible Recommended Choice Banner */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/80 via-amber-900/40 to-black/70 border-2 border-amber-500 flex items-start gap-3 shadow-md">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm">
                    <div className="font-bold text-amber-300 text-sm mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>推荐玩家如何选择：</span>
                    </div>
                    <div className="text-amber-100 font-medium leading-relaxed">
                      {choice.recommendedChoice}
                    </div>
                  </div>
                </div>

                {/* Options and Consequence breakdown */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                    <span>各分支方案与后果深度剖析：</span>
                  </h4>

                  <div className="grid grid-cols-1 gap-3">
                    {choice.options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className={`p-4 rounded-xl border transition-all ${
                          opt.isRecommended
                            ? 'border-emerald-700/80 bg-emerald-950/20 shadow-sm'
                            : 'border-stone-800 bg-stone-900/60'
                        }`}
                      >
                        {/* Option Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${
                              opt.isRecommended ? 'text-emerald-300' : 'text-stone-100'
                            }`}>
                              分支 {optIdx + 1}：{opt.label}
                            </span>
                          </div>

                          {opt.isRecommended ? (
                            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>推荐路线</span>
                            </span>
                          ) : (
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-stone-800 border border-stone-700 text-stone-400">
                              高风险 / 惩罚分支
                            </span>
                          )}
                        </div>

                        {/* Consequence Breakdown */}
                        <div className="text-xs sm:text-sm text-stone-200 leading-relaxed mb-2 bg-black/30 p-2.5 rounded-lg border border-stone-800/80">
                          <strong className="text-amber-400 font-semibold mr-1">选择后果与直接影响：</strong>
                          <span>{opt.consequence}</span>
                        </div>

                        {/* Lore Reasoning */}
                        {opt.loreReasoning && (
                          <div className="text-xs text-amber-300/80 italic font-serif mb-2.5 pl-2 border-l-2 border-amber-600/60 flex items-center gap-1.5">
                            <BookOpen className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>魂学考据与收益考量：{opt.loreReasoning}</span>
                          </div>
                        )}

                        {/* Mosaic Spoiler Mask for story/ending spoilers */}
                        {opt.spoilerContent && (
                          <div className="mt-3 pt-3 border-t border-stone-800">
                            <div className="text-[11px] font-mono text-stone-400 mb-1 flex items-center gap-1">
                              <Eye className="w-3 h-3 text-amber-400" />
                              <span>涉及中后期主线或结局的剧透分析：</span>
                            </div>
                            <SpoilerText
                              text={opt.spoilerContent}
                              isProtected={isSpoilerProtectionOn}
                              label="点击揭晓涉及结局与长远剧情的详细剧透"
                              className="text-xs sm:text-sm"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: BOSSES */}
        {activeTab === 'bosses' && (
          <div className="space-y-4">
            {node.bosses.length === 0 ? (
              <div className="text-center py-12 rounded-2xl bg-stone-900/40 border border-stone-800 text-stone-400 text-sm">
                此地点无主线首领战，属于安全中继站或纯探索地图。
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {node.bosses.map((boss) => {
                  const isDefeated = userProgress.defeatedBosses.includes(boss.id);
                  return (
                    <div
                      key={boss.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isDefeated
                          ? 'bg-emerald-950/20 border-emerald-800'
                          : boss.isGreatSoul
                          ? 'bg-gradient-to-br from-[#271515] to-[#17121b] border-orange-600/90 shadow-lg shadow-orange-950/30'
                          : 'bg-[#141622] border-stone-800'
                      }`}
                    >
                      <div>
                        {/* Boss header */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-stone-100 font-cinzel text-base sm:text-lg flex items-center gap-1.5">
                                <Skull className={`w-4 h-4 sm:w-5 sm:h-5 ${boss.isGreatSoul ? 'text-orange-500 animate-pulse' : 'text-stone-400'}`} />
                                <span>{boss.name}</span>
                              </h4>
                              {boss.isGreatSoul && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-950 border border-orange-500 text-orange-200 font-bold">
                                  始源古魂
                                </span>
                              )}
                              {boss.isOptional && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 text-stone-400">
                                  可选首领
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-stone-400 font-serif italic mt-0.5">
                              {boss.nameEn}
                            </div>
                          </div>

                          {/* Defeated button */}
                          <button
                            onClick={() => onToggleBoss(boss.id)}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
                              isDefeated
                                ? 'bg-emerald-900/70 border-emerald-500 text-emerald-200'
                                : 'bg-stone-800 border-stone-700 text-stone-300 hover:border-amber-500 hover:text-amber-200'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isDefeated ? '已击败' : '标记击破'}</span>
                          </button>
                        </div>

                        {/* Strategy tips */}
                        <div className="text-xs sm:text-sm text-stone-200 bg-black/40 p-3 rounded-xl border border-stone-800 leading-relaxed mb-3">
                          <span className="text-amber-400 font-bold flex items-center gap-1.5 mb-1">
                            <Sword className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>讨伐策略与弱点破法：</span>
                          </span>
                          {boss.tips}
                        </div>
                      </div>

                      {/* Transpose Weapon */}
                      <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
                        <span className="flex items-center gap-1">
                          <Sword className="w-3.5 h-3.5 text-stone-500" />
                          <span>灵魂炼化神兵:</span>
                        </span>
                        <span className="text-amber-300 font-mono font-medium">{boss.transposeWeapon}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: KEY ITEMS */}
        {activeTab === 'items' && (
          <div className="space-y-4">
            {node.keyItems.length === 0 ? (
              <div className="text-center py-12 rounded-2xl bg-stone-900/40 border border-stone-800 text-stone-400 text-sm">
                本区域无特殊剧情关键道具或原素强化物。
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {node.keyItems.map((item) => {
                  const isObtained = userProgress.obtainedItems.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => onToggleItem(item.id)}
                      className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 cursor-pointer transition-all ${
                        isObtained
                          ? 'bg-amber-950/20 border-amber-700/70'
                          : 'bg-[#141620] border-stone-800 hover:border-amber-600/60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-2 rounded-lg bg-black/60 border border-stone-800 shrink-0">
                          {item.type === 'estus_shard' ? (
                            <Sparkles className="w-4 h-4 text-amber-400" />
                          ) : item.type === 'sublime_bone_dust' ? (
                            <Flame className="w-4 h-4 text-orange-400" />
                          ) : (
                            <Key className="w-4 h-4 text-cyan-400" />
                          )}
                        </div>

                        <div>
                          <div className="font-bold text-xs sm:text-sm text-stone-100 flex items-center gap-2">
                            <span>{item.name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/60 text-stone-400 border border-stone-700">
                              {item.type === 'estus_shard' ? '原素碎片' :
                               item.type === 'sublime_bone_dust' ? '贵人骨灰' :
                               item.type === 'fragrant_branch' ? '怀念香木' : '关键剧情钥匙'}
                            </span>
                          </div>
                          <div className="text-xs text-stone-400 mt-1 leading-relaxed flex items-start gap-1">
                            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>获取位置与解法: {item.location}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`text-xs px-2.5 py-1 rounded-lg border font-semibold shrink-0 transition-colors ${
                          isObtained
                            ? 'bg-amber-900/60 border-amber-500 text-amber-200'
                            : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        {isObtained ? '已拾取' : '未拾取'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: NPC INTERACTIONS */}
        {activeTab === 'npc' && (
          <div className="space-y-4">
            {node.npcInteractions.length === 0 ? (
              <div className="text-center py-12 rounded-2xl bg-stone-900/40 border border-stone-800 text-stone-400 text-sm">
                该地图无核心NPC关键互动事件。
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {node.npcInteractions.map((npc, idx) => (
                  <div
                    key={`${npc.npcId}-${idx}`}
                    className="p-4 sm:p-5 rounded-2xl border border-stone-800 bg-[#141620] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm sm:text-base text-amber-300 flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-400" />
                        <span>{npc.npcName}</span>
                      </h4>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/70 border border-stone-700 text-stone-400">
                        支线步骤 {npc.stepNumber} / {npc.totalSteps}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-200 leading-relaxed bg-black/40 p-3 rounded-xl border border-stone-800">
                      <span className="text-stone-400 font-medium mr-1">【对话与交互要求】：</span>
                      {npc.actionRequired}
                    </p>

                    {npc.warning && (
                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-red-950/30 border border-red-800/70 text-xs text-red-300">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <span><strong>注意：</strong>{npc.warning}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: TRICKS, TRAPS & CONNECTED ROUTES */}
        {activeTab === 'tricks' && (
          <div className="space-y-6">
            
            {/* Traps and Tricks */}
            <div className="space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>地图机制、陷阱与隐藏近道</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {node.trapsAndTricks.map((trick, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-stone-800 bg-[#141620] text-xs sm:text-sm text-stone-300 flex items-start gap-3 leading-relaxed"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{trick}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Outgoing routes & next maps */}
            <div className="pt-4 border-t border-stone-800 space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-stone-300 uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>本图后续通向地点（点击可直接进入该地点专属全页查看）：</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {outgoingMaps.map(({ conn, target }, idx) => {
                  const targetName = target ? target.name : conn.targetId;
                  const targetNameEn = target ? target.nameEn : '';
                  const targetStage = target ? target.stageName : '';

                  return (
                    <div
                      key={idx}
                      onClick={() => onNavigateToNode(conn.targetId)}
                      className="p-3.5 rounded-xl border border-stone-800 bg-[#141622] hover:border-amber-500 hover:bg-[#1a1c2a] flex flex-col justify-between cursor-pointer transition-all group shadow-sm hover:scale-[1.01]"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1">
                          <span className="font-mono text-amber-400">{targetStage}</span>
                          <span className="text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                            进入详情 <ChevronRight className="w-3 h-3 inline" />
                          </span>
                        </div>
                        <h5 className="font-bold text-sm text-stone-100 group-hover:text-amber-300 transition-colors">
                          {targetName}
                        </h5>
                        <div className="text-[11px] text-stone-400 font-serif italic">
                          {targetNameEn}
                        </div>
                      </div>

                      {conn.requirement && (
                        <div className="mt-2 pt-2 border-t border-stone-800/80 text-[11px] text-amber-300/90 font-mono">
                          通行条件：{conn.requirement}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Incoming routes */}
            {incomingMaps.length > 0 && (
              <div className="pt-4 border-t border-stone-800 space-y-2">
                <h5 className="text-xs text-stone-400 uppercase tracking-wider">
                  从哪些前置地图可抵达此处：
                </h5>
                <div className="flex flex-wrap gap-2">
                  {incomingMaps.map((inc) => (
                    <button
                      key={inc.id}
                      onClick={() => onNavigateToNode(inc.id)}
                      className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-stone-600 text-xs text-stone-300 flex items-center gap-1 transition-colors"
                    >
                      <ArrowLeft className="w-3 h-3 text-stone-400" />
                      <span>{inc.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 7: MERCHANTS & SPELLS */}
        {activeTab === 'merchants' && (
          <div className="space-y-6">
            {/* Header info & Local search */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-stone-900/90 via-[#181b26] to-stone-900/80 border border-amber-600/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <h4 className="font-bold text-sm sm:text-base text-amber-200 font-cinzel">
                    {node.name} • 驻留商人与导师 ({mapMerchants.length} 位)
                  </h4>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  在此可购买强力法术、关键道具、强化素材，或进行灵魂炼金与装备变质
                </p>
              </div>

              {/* In-page filter input */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="筛选此处的物品或法术..."
                  value={merchantSearchFilter}
                  onChange={(e) => setMerchantSearchFilter(e.target.value)}
                  className="w-full px-3 py-1.5 bg-black/60 border border-stone-700 rounded-lg text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
                {merchantSearchFilter && (
                  <button
                    onClick={() => setMerchantSearchFilter('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 text-xs"
                  >
                    清空
                  </button>
                )}
              </div>
            </div>

            {/* Merchant Cards */}
            <div className="space-y-5">
              {mapMerchants.map((merchant) => {
                const query = merchantSearchFilter.trim().toLowerCase();
                const visibleItems = merchant.items.filter(item => {
                  if (!query) return true;
                  const matchName = item.name.toLowerCase().includes(query);
                  const matchNotes = item.notes?.toLowerCase().includes(query) ?? false;
                  const matchCategory = MERCHANT_CATEGORY_CONFIG[item.category]?.label.toLowerCase().includes(query) ?? false;
                  return matchName || matchNotes || matchCategory;
                });

                if (query && visibleItems.length === 0) return null;

                return (
                  <div
                    key={merchant.id}
                    className="rounded-2xl bg-[#141724]/90 border border-stone-800 shadow-xl overflow-hidden"
                  >
                    {/* Merchant banner */}
                    <div className="p-4 bg-gradient-to-r from-stone-900/90 to-[#191c2b] border-b border-stone-800 flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-black/60 border border-amber-700/60 flex items-center justify-center shrink-0">
                          <Flame className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-base text-stone-100 font-cinzel">
                              {merchant.name}
                            </h4>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-700/70 text-amber-300 font-medium">
                              {merchant.roleLabel}
                            </span>
                          </div>
                          <p className="text-xs text-stone-400 mt-0.5">
                            {merchant.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pre-condition warning banner */}
                    {merchant.condition && (
                      <div className="px-4 py-2 bg-amber-950/20 border-b border-amber-900/30 flex items-center gap-2 text-xs text-amber-300/90">
                        <Info className="w-4 h-4 text-amber-400 shrink-0" />
                        <span><strong className="text-amber-200">解锁/交互要求：</strong>{merchant.condition}</span>
                      </div>
                    )}

                    {/* Items table / grid */}
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {visibleItems.map(item => {
                        const catConfig = MERCHANT_CATEGORY_CONFIG[item.category];

                        return (
                          <div
                            key={item.id}
                            className={`p-3 rounded-xl border flex flex-col justify-between gap-2 transition-all ${
                              item.isKeyMustBuy
                                ? 'bg-[#1b1d2e] border-amber-500/60 shadow-md shadow-amber-950/30'
                                : 'bg-black/40 border-stone-800/90 hover:border-stone-700'
                            }`}
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h5 className="font-bold text-sm text-stone-100">
                                      {item.name}
                                    </h5>
                                    {item.isKeyMustBuy && (
                                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-900/80 border border-amber-500 text-amber-200 font-bold shrink-0">
                                        推荐必买
                                      </span>
                                    )}
                                    {item.isBossTransposition && (
                                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950/80 border border-purple-500 text-purple-200 font-semibold shrink-0">
                                        Boss魂兑换
                                      </span>
                                    )}
                                  </div>
                                  {item.nameEn && (
                                    <p className="text-[10px] font-mono text-stone-500 mt-0.5">
                                      {item.nameEn}
                                    </p>
                                  )}
                                </div>

                                <span className={`text-[10px] px-1.5 py-0.5 rounded border shrink-0 font-medium ${catConfig.badgeColor}`}>
                                  {catConfig.label}
                                </span>
                              </div>

                              {item.notes && (
                                <p className="text-xs text-stone-300 mt-2 leading-relaxed bg-black/40 p-2 rounded-lg border border-stone-800/80">
                                  {item.notes}
                                </p>
                              )}
                            </div>

                            <div className="pt-2 border-t border-stone-800/70 flex flex-wrap items-center justify-between gap-1 text-xs">
                              {item.requirement ? (
                                <span className="font-mono text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/50">
                                  要求: {item.requirement}
                                </span>
                              ) : (
                                <span className="text-stone-500 font-mono">数量: {item.quantity}</span>
                              )}

                              <div className="flex items-center gap-1 text-amber-300 font-mono font-bold shrink-0">
                                <Coins className="w-3.5 h-3.5 text-amber-400" />
                                <span>{item.price}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 8: STEAM ACHIEVEMENTS */}
        {activeTab === 'achievements' && mapAchievements.length > 0 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-stone-900/60 border border-stone-800 rounded-xl">
              <div>
                <h3 className="text-base font-bold text-amber-200 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span>本区域关联 Steam 成就 ({completedMapAchievementsCount}/{mapAchievements.length})</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  已关联 {mapAchievements.length} 项 Steam 成就，重点留意易错过决策预警以防永久错过
                </p>
              </div>

              {onOpenAchievementsModal && (
                <button
                  onClick={onOpenAchievementsModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/70 text-amber-200 border border-amber-600/60 text-xs transition-colors shadow-sm shrink-0 self-start sm:self-auto"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>全 38 项成就总览 →</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {mapAchievements.map(ach => {
                const isCompleted = unlockedSet.has(ach.id);

                return (
                  <div
                    key={ach.id}
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                      isCompleted
                        ? 'bg-stone-900/50 border-stone-800'
                        : ach.isMissable
                        ? 'bg-rose-950/20 border-rose-800/70 shadow-sm'
                        : 'bg-stone-900/30 border-stone-800/70'
                    }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      {onToggleAchievement ? (
                        <div 
                          className="cursor-pointer shrink-0" 
                          onClick={() => onToggleAchievement(ach.id)}
                          title="点击标记达成/未达成"
                        >
                          <AchievementIcon
                            achievementId={ach.id}
                            isUnlocked={isCompleted}
                            name={ach.name}
                            size={56}
                            className="hover:scale-105 transition-transform"
                          />
                        </div>
                      ) : (
                        <AchievementIcon
                          achievementId={ach.id}
                          isUnlocked={isCompleted}
                          name={ach.name}
                          size={56}
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className={`text-base font-bold ${isCompleted ? 'text-stone-300' : 'text-amber-100'}`}>
                              {ach.name}
                            </h4>
                            <span className="text-xs font-mono text-stone-400">
                              {ach.nameEn}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
                              {ach.categoryName}
                            </span>
                            {ach.isMissable && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700 font-semibold flex items-center gap-1 animate-pulse">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                易错过警示
                              </span>
                            )}
                          </div>

                          {onToggleAchievement && (
                            <button
                              onClick={() => onToggleAchievement(ach.id)}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors border ${
                                isCompleted
                                  ? 'bg-emerald-950/50 text-emerald-300 border-emerald-600/60 hover:bg-emerald-900/50'
                                  : 'bg-stone-800/80 text-stone-400 border-stone-700 hover:text-amber-200 hover:border-amber-600/50'
                              }`}
                            >
                              {isCompleted ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>已达成</span>
                                </>
                              ) : (
                                <>
                                  <Square className="w-3.5 h-3.5 text-stone-500" />
                                  <span>标记达成</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {/* Description */}
                        <div className="mt-1 text-xs text-stone-300 flex flex-col gap-0.5">
                          <p>{ach.description}</p>
                          <p className="text-stone-500 font-mono text-[11px]">{ach.descriptionEn}</p>
                        </div>

                        {/* Missable Warning Callout */}
                        {ach.isMissable && ach.missableWarning && (
                          <div className="mt-2.5 p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/70 text-xs text-rose-200 leading-relaxed shadow-sm">
                            <div className="flex items-center gap-1.5 font-semibold text-rose-300 mb-0.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                              <span>【防错过关键决策预警】</span>
                            </div>
                            <p className="whitespace-pre-line text-rose-100 text-[11.5px] pl-5">
                              {ach.missableWarning}
                            </p>
                          </div>
                        )}

                        {/* Unlock Guide */}
                        <div className="mt-2 p-2.5 rounded-lg bg-black/40 border border-stone-800 text-xs text-stone-300">
                          <div className="flex items-center gap-1 text-amber-400 font-medium mb-1 text-[11px]">
                            <Sparkles className="w-3 h-3" />
                            <span>解锁攻略要点：</span>
                          </div>
                          <p className="whitespace-pre-line text-stone-300 text-[11.5px] leading-relaxed">
                            {ach.unlockGuide}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
