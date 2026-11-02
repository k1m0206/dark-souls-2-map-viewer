import React, { useState } from 'react';
import { 
  X, 
  CheckSquare, 
  Skull, 
  Sparkles, 
  Flame, 
  RotateCcw, 
  Award,
  CheckCircle2,
  Circle,
  TrendingUp
} from 'lucide-react';
import { MapNode, UserProgress } from '../types/souls';
import { calculateProgressStats } from '../utils/progressionLogic';

interface ProgressSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: MapNode[];
  userProgress: UserProgress;
  onToggleBoss: (bossId: string) => void;
  onResetProgress: () => void;
}

export const ProgressSummaryModal: React.FC<ProgressSummaryModalProps> = ({
  isOpen,
  onClose,
  nodes,
  userProgress,
  onToggleBoss,
  onResetProgress,
}) => {
  const [bossFilter, setBossFilter] = useState<'all' | 'great_souls' | 'optional' | 'dlc'>('all');

  if (!isOpen) return null;

  const stats = calculateProgressStats(nodes, userProgress);

  // Compile all bosses with their map names
  const allBossList: {
    id: string;
    name: string;
    nameEn: string;
    mapName: string;
    isOptional: boolean;
    isGreatSoul?: boolean;
    isDlc: boolean;
  }[] = [];

  const seenBossIds = new Set<string>();
  nodes.forEach(node => {
    node.bosses.forEach(boss => {
      if (seenBossIds.has(boss.id)) return;
      seenBossIds.add(boss.id);
      allBossList.push({
        ...boss,
        mapName: node.name,
        isDlc: node.stage === 'dlc',
      });
    });
  });

  const filteredBosses = allBossList.filter(boss => {
    if (bossFilter === 'great_souls') return boss.isGreatSoul;
    if (bossFilter === 'optional') return boss.isOptional;
    if (bossFilter === 'dlc') return boss.isDlc;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 landscape:p-2">
      <div className="bg-[#12141c] border border-[#4a3f32] rounded-2xl max-w-4xl w-full max-h-[96vh] sm:max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-3 sm:p-5 landscape:py-2 border-b border-stone-800 flex items-center justify-between bg-gradient-to-r from-[#1c1f2b] to-[#12141c]">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-amber-950/60 border border-amber-600/70 text-amber-400 shrink-0">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold font-cinzel text-stone-100">
                个人游玩成就与全Boss讨伐看板
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-400 hidden sm:block">
                追踪学者版{stats.totalBosses}场首领战、原素瓶最大强化与贵人骨灰搜集
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Stats Cards */}
        <div className="p-2.5 sm:p-5 border-b border-stone-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 bg-black/20">
          <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800">
            <div className="text-[11px] text-stone-400 flex items-center gap-1.5 mb-1">
              <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>事项总进度</span>
            </div>
            <div className="text-xl font-bold font-mono text-amber-300">
              {stats.totalProgressPercentage}%
            </div>
            <div className="text-[10px] text-stone-500">
              {stats.completedChecklistsCount} / {stats.totalChecklists} 项已勾选
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800">
            <div className="text-[11px] text-stone-400 flex items-center gap-1.5 mb-1">
              <Skull className="w-3.5 h-3.5 text-red-400" />
              <span>首领击破数</span>
            </div>
            <div className="text-xl font-bold font-mono text-red-300">
              {stats.defeatedBossesCount} / {stats.totalBosses}
            </div>
            <div className="text-[10px] text-stone-500">
              共计 {stats.totalBosses} 场独立首领战
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800">
            <div className="text-[11px] text-stone-400 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>原素碎片</span>
            </div>
            <div className="text-xl font-bold font-mono text-amber-200">
              {stats.estusShardsFound} / {stats.totalEstusShards}
            </div>
            <div className="text-[10px] text-stone-500">
              最高可升至 12 瓶
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800">
            <div className="text-[11px] text-stone-400 flex items-center gap-1.5 mb-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>贵人骨灰</span>
            </div>
            <div className="text-xl font-bold font-mono text-orange-300">
              {stats.sublimeBoneDustsFound} / {stats.totalBoneDusts}
            </div>
            <div className="text-[10px] text-stone-500">
              原素瓶最高 +5
            </div>
          </div>
        </div>

        {/* Boss Checklist Header & Filters */}
        <div className="px-5 pt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 p-1 bg-black/40 rounded-lg border border-stone-800 text-xs">
            <button
              onClick={() => setBossFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                bossFilter === 'all'
                  ? 'bg-amber-600/30 text-amber-200 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              全部 ({allBossList.length})
            </button>
            <button
              onClick={() => setBossFilter('great_souls')}
              className={`px-2.5 py-1 rounded transition-colors ${
                bossFilter === 'great_souls'
                  ? 'bg-amber-600/30 text-amber-200 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              始源四巨魂 (4)
            </button>
            <button
              onClick={() => setBossFilter('optional')}
              className={`px-2.5 py-1 rounded transition-colors ${
                bossFilter === 'optional'
                  ? 'bg-amber-600/30 text-amber-200 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              可选支线Boss
            </button>
            <button
              onClick={() => setBossFilter('dlc')}
              className={`px-2.5 py-1 rounded transition-colors ${
                bossFilter === 'dlc'
                  ? 'bg-amber-600/30 text-amber-200 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              DLC三王冠Boss
            </button>
          </div>

          <button
            onClick={() => {
              if (window.confirm('确定要重置所有已保存的勾选记录和探索进度吗？')) {
                onResetProgress();
              }
            }}
            className="flex items-center gap-1 px-3 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded border border-red-900/60 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置所有记录</span>
          </button>
        </div>

        {/* Boss List Grid */}
        <div className="flex-1 p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {filteredBosses.map(boss => {
            const isDefeated = userProgress.defeatedBosses.includes(boss.id);
            return (
              <div
                key={boss.id}
                onClick={() => onToggleBoss(boss.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isDefeated
                    ? 'bg-emerald-950/20 border-emerald-800/70 text-emerald-300'
                    : boss.isGreatSoul
                    ? 'bg-gradient-to-r from-orange-950/30 to-black/40 border-orange-700/80 text-stone-200'
                    : 'bg-stone-900/60 border-stone-800 hover:border-amber-600/60 text-stone-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isDefeated ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-stone-600 shrink-0" />
                  )}
                  <div>
                    <div className="font-semibold text-xs flex items-center gap-1.5">
                      <span className={isDefeated ? 'line-through opacity-70' : ''}>
                        {boss.name}
                      </span>
                      {boss.isGreatSoul && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-orange-900/80 text-orange-200 font-bold border border-orange-600">
                          巨魂
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-stone-500">
                      所在地图: {boss.mapName}
                    </div>
                  </div>
                </div>

                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                  isDefeated
                    ? 'bg-emerald-900/40 border-emerald-700 text-emerald-300'
                    : 'bg-stone-800 border-stone-700 text-stone-400'
                }`}>
                  {isDefeated ? '已讨伐' : '未讨伐'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
