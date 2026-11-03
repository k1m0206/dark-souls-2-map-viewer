import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Circle, 
  RotateCcw, 
  ExternalLink, 
  Compass, 
  Filter, 
  Sparkles, 
  CheckSquare, 
  Layers
} from 'lucide-react';
import { MapNode, UserProgress, SteamAchievement, AchievementCategory } from '../types/souls';
import { STEAM_ACHIEVEMENTS } from '../data/achievementsData';
import { AchievementIcon } from './AchievementIcon';

interface SteamAchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: MapNode[];
  userProgress: UserProgress;
  onToggleAchievement: (achievementId: string) => void;
  onBatchSetAchievements?: (achievementIds: string[]) => void;
  onResetAchievements?: () => void;
  onNavigateToMap: (mapId: string) => void;
}

export const SteamAchievementsModal: React.FC<SteamAchievementsModalProps> = ({
  isOpen,
  onClose,
  nodes,
  userProgress,
  onToggleAchievement,
  onBatchSetAchievements,
  onResetAchievements,
  onNavigateToMap,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all' | 'missable'>('all');
  const [completionFilter, setCompletionFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const nodeMap = useMemo(() => {
    const map = new Map<string, string>();
    nodes.forEach(n => map.set(n.id, n.name));
    return map;
  }, [nodes]);

  const unlockedSet = useMemo(() => {
    return new Set(userProgress.unlockedAchievements || []);
  }, [userProgress.unlockedAchievements]);

  const totalCount = STEAM_ACHIEVEMENTS.length;
  const unlockedCount = useMemo(() => {
    return STEAM_ACHIEVEMENTS.filter(a => unlockedSet.has(a.id)).length;
  }, [unlockedSet]);

  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  const missableCount = useMemo(() => {
    return STEAM_ACHIEVEMENTS.filter(a => a.isMissable).length;
  }, []);

  const missableUnlockedCount = useMemo(() => {
    return STEAM_ACHIEVEMENTS.filter(a => a.isMissable && unlockedSet.has(a.id)).length;
  }, [unlockedSet]);

  // Categories config
  const categories: { id: AchievementCategory | 'all' | 'missable'; label: string; icon: string }[] = [
    { id: 'all', label: `全部 (${totalCount})`, icon: '🏆' },
    { id: 'missable', label: `易错过提醒 (${missableUnlockedCount}/${missableCount})`, icon: '🚨' },
    { id: 'story', label: '主线始源', icon: '📜' },
    { id: 'boss', label: '强敌首领', icon: '⚔️' },
    { id: 'npc_inheritance', label: 'NPC装备传承', icon: '👥' },
    { id: 'magic_mastery', label: '全法术大师', icon: '🔮' },
    { id: 'covenant', label: '誓约与奉献', icon: '🛡️' },
    { id: 'special', label: '强化与特殊', icon: '🌟' },
  ];

  const filteredAchievements = useMemo(() => {
    return STEAM_ACHIEVEMENTS.filter(ach => {
      // Category filter
      if (selectedCategory === 'missable') {
        if (!ach.isMissable) return false;
      } else if (selectedCategory !== 'all') {
        if (ach.category !== selectedCategory) return false;
      }

      // Completion filter
      const isDone = unlockedSet.has(ach.id);
      if (completionFilter === 'unlocked' && !isDone) return false;
      if (completionFilter === 'locked' && isDone) return false;

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchZh = ach.name.toLowerCase().includes(query);
        const matchEn = ach.nameEn.toLowerCase().includes(query);
        const matchDescZh = ach.description.toLowerCase().includes(query);
        const matchDescEn = ach.descriptionEn.toLowerCase().includes(query);
        const matchGuide = ach.unlockGuide.toLowerCase().includes(query);
        const matchWarning = ach.missableWarning?.toLowerCase().includes(query);
        const matchMaps = ach.relatedMapIds.some(mid => (nodeMap.get(mid) || mid).toLowerCase().includes(query));

        return matchZh || matchEn || matchDescZh || matchDescEn || matchGuide || Boolean(matchWarning) || matchMaps;
      }

      return true;
    });
  }, [selectedCategory, completionFilter, searchQuery, unlockedSet, nodeMap]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-2 sm:p-4 overflow-hidden animate-fade-in">
      <div 
        className="bg-[#12141a] border border-amber-900/60 rounded-xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl text-stone-300 relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="p-4 sm:p-5 border-b border-stone-800/80 bg-gradient-to-r from-stone-900 via-[#181b22] to-stone-900 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-950/70 border border-amber-500/50 flex items-center justify-center shadow-inner">
                <Award className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-wide text-amber-200">
                    Steam 官方全成就指引
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded bg-stone-800 text-stone-400 border border-stone-700">
                    原罪学者 38 项
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  全成就防错过决策预警 · 官方中英对照 · 地图节点一键跳转追踪
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title="关闭"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Overview Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-950/70 border border-stone-800/70 rounded-lg p-3">
            <div className="sm:col-span-2 flex flex-col justify-center gap-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-medium text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  总成就进度：{unlockedCount} / {totalCount} ({progressPercent}%)
                </span>
                <span className="text-stone-400 font-mono">
                  {unlockedCount === totalCount ? '🏆 达成白金殿堂！' : `剩余 ${totalCount - unlockedCount} 项`}
                </span>
              </div>
              <div className="w-full bg-stone-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-stone-700/60">
                <div
                  className="bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 h-full rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-around sm:justify-end gap-3 text-xs border-t sm:border-t-0 sm:border-l border-stone-800 pt-2 sm:pt-0 sm:pl-3">
              <div className="text-center sm:text-right">
                <span className="block text-stone-400">易错过成就</span>
                <span className={`font-bold text-sm ${missableUnlockedCount === missableCount ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {missableUnlockedCount} / {missableCount}
                </span>
              </div>
              <div className="flex gap-1.5">
                {onBatchSetAchievements && (
                  <button
                    onClick={() => {
                      if (window.confirm('确定要将所有 38 项 Steam 成就标记为全部完成吗？')) {
                        onBatchSetAchievements(STEAM_ACHIEVEMENTS.map(a => a.id));
                      }
                    }}
                    className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-200 border border-stone-700 rounded text-xs transition-colors"
                    title="全部标记完成"
                  >
                    全部完成
                  </button>
                )}
                {onResetAchievements && (
                  <button
                    onClick={() => {
                      if (window.confirm('确定要重置所有成就的完成状态吗？')) {
                        onResetAchievements();
                      }
                    }}
                    className="p-1 bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-rose-400 border border-stone-700 rounded text-xs transition-colors"
                    title="重置成就进度"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                placeholder="搜索成就名 (中/英)、描述、相关地图或攻略要点..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 bg-stone-950/80 border border-stone-700/80 rounded-lg text-xs sm:text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-0.5">
              <button
                onClick={() => setCompletionFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  completionFilter === 'all'
                    ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50'
                    : 'bg-stone-900 text-stone-400 border border-stone-800 hover:bg-stone-800'
                }`}
              >
                全部状态
              </button>
              <button
                onClick={() => setCompletionFilter('locked')}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  completionFilter === 'locked'
                    ? 'bg-stone-700 text-amber-200 border border-amber-500/50'
                    : 'bg-stone-900 text-stone-400 border border-stone-800 hover:bg-stone-800'
                }`}
              >
                未解锁 ({totalCount - unlockedCount})
              </button>
              <button
                onClick={() => setCompletionFilter('unlocked')}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  completionFilter === 'unlocked'
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/50'
                    : 'bg-stone-900 text-stone-400 border border-stone-800 hover:bg-stone-800'
                }`}
              >
                已达成 ({unlockedCount})
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md whitespace-nowrap transition-colors border ${
                    isSelected
                      ? cat.id === 'missable'
                        ? 'bg-rose-950/60 text-rose-200 border-rose-600/70 font-semibold'
                        : 'bg-amber-500/20 text-amber-200 border-amber-500/60 font-semibold'
                      : 'bg-stone-900/60 text-stone-400 border-stone-800 hover:bg-stone-800/80 hover:text-stone-300'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3.5 divide-y divide-stone-800/40">
          {filteredAchievements.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              <Award className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">未找到匹配的 Steam 成就</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setCompletionFilter('all');
                }}
                className="mt-2 text-xs text-amber-400 hover:underline"
              >
                清空过滤条件
              </button>
            </div>
          ) : (
            filteredAchievements.map(ach => {
              const isCompleted = unlockedSet.has(ach.id);

              return (
                <div
                  key={ach.id}
                  className={`pt-3.5 first:pt-0 transition-all rounded-lg p-2.5 sm:p-3 border ${
                    isCompleted
                      ? 'bg-stone-900/40 border-stone-800/60'
                      : ach.isMissable
                      ? 'bg-rose-950/15 border-rose-900/30'
                      : 'bg-stone-950/40 border-stone-800/50'
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Achievement Icon */}
                    <div className="cursor-pointer" onClick={() => onToggleAchievement(ach.id)}>
                      <AchievementIcon
                        achievementId={ach.id}
                        isUnlocked={isCompleted}
                        name={ach.name}
                        size={56}
                        className="cursor-pointer hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className={`text-base font-bold tracking-wide ${isCompleted ? 'text-stone-300' : 'text-amber-100'}`}>
                            {ach.name}
                          </h3>
                          <span className="text-xs text-stone-400 font-mono">
                            {ach.nameEn}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800/90 text-stone-300 border border-stone-700">
                            {ach.categoryName}
                          </span>
                          {ach.isMissable && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-700/60 font-medium flex items-center gap-0.5 animate-pulse">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              易错过
                            </span>
                          )}
                        </div>

                        {/* Interactive Completion Button */}
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
                              <Circle className="w-3.5 h-3.5 text-stone-500" />
                              <span>标记达成</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Achievement Description (Bilingual) */}
                      <div className="mt-1 text-xs text-stone-300 flex flex-col gap-0.5">
                        <p>{ach.description}</p>
                        <p className="text-stone-500 font-mono text-[11px]">{ach.descriptionEn}</p>
                      </div>

                      {/* Missable Warning Callout */}
                      {ach.isMissable && ach.missableWarning && (
                        <div className="mt-2 p-2 sm:p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-200 leading-relaxed shadow-sm">
                          <div className="flex items-start gap-1.5 font-semibold text-rose-300 mb-0.5">
                            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-rose-400" />
                            <span>防错过决策预警：</span>
                          </div>
                          <div className="pl-5 text-rose-100 whitespace-pre-line text-[11.5px]">
                            {ach.missableWarning}
                          </div>
                        </div>
                      )}

                      {/* Step-by-Step Unlock Guide */}
                      <div className="mt-2 p-2 sm:p-2.5 rounded-lg bg-stone-900/70 border border-stone-800/80 text-xs text-stone-300">
                        <div className="flex items-center gap-1 text-amber-400/90 font-medium mb-1 text-[11px]">
                          <Sparkles className="w-3 h-3" />
                          <span>解锁攻略要点：</span>
                        </div>
                        <p className="whitespace-pre-line text-stone-300 text-[11.5px] leading-relaxed">
                          {ach.unlockGuide}
                        </p>
                      </div>

                      {/* Related Map Nodes with Click-to-Jump Navigation */}
                      {ach.relatedMapIds && ach.relatedMapIds.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] text-stone-400 flex items-center gap-1">
                            <Compass className="w-3 h-3 text-stone-500" />
                            关联地图节点：
                          </span>
                          {ach.relatedMapIds.map(mapId => {
                            const mapName = nodeMap.get(mapId) || mapId;
                            return (
                              <button
                                key={mapId}
                                onClick={() => {
                                  onNavigateToMap(mapId);
                                  onClose();
                                }}
                                className="group flex items-center gap-1 px-2 py-0.5 rounded bg-stone-800/80 hover:bg-amber-900/40 text-stone-300 hover:text-amber-200 border border-stone-700/70 hover:border-amber-600/60 text-xs transition-colors shadow-sm"
                                title={`点击跳转并聚焦地图：${mapName}`}
                              >
                                <span>{mapName}</span>
                                <ExternalLink className="w-2.5 h-2.5 text-stone-500 group-hover:text-amber-300 transition-colors" />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Bar */}
        <div className="p-3 border-t border-stone-800/80 bg-stone-950 flex flex-wrap items-center justify-between text-xs text-stone-400 gap-2">
          <div className="flex items-center gap-2">
            <span>💡 提示：点击任意地图标签可立即关闭弹窗并跳转定位至对应地图节点。</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg border border-stone-700 transition-colors ml-auto"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
