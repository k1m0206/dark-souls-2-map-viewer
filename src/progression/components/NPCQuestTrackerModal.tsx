import React, { useState } from 'react';
import { X, Users, AlertTriangle, ArrowRight, Award, CheckCircle, Shield, Sparkles } from 'lucide-react';
import { NPC_QUESTLINES, MAP_NODES } from '../data/soulsData';
import { NPCId } from '../types/souls';

interface NPCQuestTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMapNode: (mapId: string) => void;
  onFilterByNpc: (npcId: NPCId) => void;
}

export const NPCQuestTrackerModal: React.FC<NPCQuestTrackerModalProps> = ({
  isOpen,
  onClose,
  onSelectMapNode,
  onFilterByNpc,
}) => {
  const [selectedNpcId, setSelectedNpcId] = useState<NPCId>('lucatiel');

  if (!isOpen) return null;

  const currentQuest = NPC_QUESTLINES.find(q => q.id === selectedNpcId) || NPC_QUESTLINES[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 landscape:p-2">
      <div className="bg-[#12141c] border border-[#4a3f32] rounded-2xl max-w-4xl w-full max-h-[96vh] sm:max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-3 sm:p-5 landscape:py-2 border-b border-stone-800 flex items-center justify-between bg-gradient-to-r from-[#1c1f2b] to-[#12141c]">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-600/70 text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-cinzel text-stone-100">
                黑暗之魂2 NPC 支线全景导引
              </h2>
              <p className="text-xs text-stone-400">
                追踪各大NPC在不同地图的触发节点、招募条件与致命避坑事项
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* NPC Selector Sidebar / Mobile Horizontal Scrollbar */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-stone-800 p-2 sm:p-3 bg-black/40 flex md:flex-col overflow-x-auto md:overflow-y-auto gap-1.5 md:space-y-1.5 shrink-0 scrollbar-none">
            {NPC_QUESTLINES.map(npc => (
              <button
                key={npc.id}
                onClick={() => setSelectedNpcId(npc.id)}
                className={`text-left p-2 sm:p-2.5 rounded-xl transition-all flex flex-col gap-0.5 shrink-0 whitespace-nowrap md:whitespace-normal ${
                  selectedNpcId === npc.id
                    ? 'bg-amber-950/60 border border-amber-500/80 text-amber-200 shadow-sm'
                    : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200 border border-stone-800/60'
                }`}
              >
                <span className="font-bold text-xs">{npc.name}</span>
                <span className="text-[10px] text-stone-500 truncate hidden sm:inline md:inline">{npc.title}</span>
              </button>
            ))}
          </div>

          {/* NPC Detail Content */}
          <div className="flex-1 p-3 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5">
            {/* Lore and Summary */}
            <div className="p-4 rounded-xl bg-stone-900/70 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-cinzel text-amber-300">
                  {currentQuest.name}
                </h3>
                <button
                  onClick={() => {
                    onFilterByNpc(currentQuest.id);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/70 text-amber-200 text-xs rounded-lg transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>在主流程图仅高亮此支线</span>
                </button>
              </div>
              <div className="text-xs text-amber-400/90 font-mono italic">
                {currentQuest.title}
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                {currentQuest.summary}
              </p>
              <div className="pt-2 border-t border-stone-800 text-xs text-stone-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>最终奖励成就:</span>
                <span className="text-amber-200 font-medium">{currentQuest.finalReward}</span>
              </div>
            </div>

            {/* Step by Step Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                各阶段地图与推进顺序 ({currentQuest.steps.length} 个步骤)
              </h4>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-700">
                {currentQuest.steps.map((step, idx) => (
                  <div key={idx} className="relative group">
                    {/* Timeline bullet */}
                    <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-[#12141c] border-2 border-amber-500 flex items-center justify-center text-[9px] font-bold text-amber-300">
                      {step.stepIndex}
                    </div>

                    <div className="p-3.5 rounded-xl border border-stone-800 bg-stone-900/50 hover:border-amber-600/60 transition-colors">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-sm text-stone-100">
                            {step.title}
                          </h5>
                          {(() => {
                            const targetMap = MAP_NODES.find(m => m.id === step.mapId);
                            const displayName = targetMap ? `${targetMap.name}` : step.mapId;
                            return (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 text-amber-300 border border-amber-600/50">
                                触发地图: {displayName}
                              </span>
                            );
                          })()}
                        </div>
                        <button
                          onClick={() => {
                            onSelectMapNode(step.mapId);
                            onClose();
                          }}
                          className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                        >
                          <span>查看该地图</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <p className="text-xs text-stone-300 leading-relaxed mb-2">
                        {step.description}
                      </p>

                      {step.warning && (
                        <div className="flex items-start gap-2 p-2 rounded-lg bg-red-950/30 border border-red-800/60 text-xs text-red-300">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                          <span>{step.warning}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
