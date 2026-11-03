import React from 'react';
import { X, Crown, Flame, CheckCircle, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { GAME_ENDINGS } from '../data/soulsData';
import { UserProgress } from '../types/souls';
import { evaluateEndingStatus } from '../utils/progressionLogic';
import { SpoilerText } from './SpoilerText';

interface EndingsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProgress: UserProgress;
  onNavigateToNode: (nodeId: string) => void;
  isSpoilerProtectionOn?: boolean;
}

export const EndingsGuideModal: React.FC<EndingsGuideModalProps> = ({
  isOpen,
  onClose,
  userProgress,
  onNavigateToNode,
  isSpoilerProtectionOn = true,
}) => {
  if (!isOpen) return null;

  const status = evaluateEndingStatus(userProgress);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 landscape:p-2">
      <div className="bg-[#12141c] border border-[#4a3f32] rounded-2xl max-w-4xl w-full max-h-[96vh] sm:max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-3 sm:p-5 landscape:py-2 border-b border-stone-800 flex items-center justify-between bg-gradient-to-r from-[#1c1f2b] to-[#12141c]">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-red-950/60 border border-red-600/70 text-red-400 shrink-0">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold font-cinzel text-stone-100">
                多重结局与终极王冠祝福全解
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-400 hidden sm:block">
                学者版双结局与安第尔前置条件；四王冠祝福为独立装备奖励，不是第三结局
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

        {/* Content list */}
        <div className="flex-1 p-3 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6">
          {GAME_ENDINGS.map((ending, idx) => {
            let isEligible = false;
            if (ending.id === 'ending_inherit') isEligible = status.canGetEndingInherit;
            if (ending.id === 'ending_leave') isEligible = status.canGetEndingLeave;
            if (ending.id === 'ending_crowns') isEligible = status.canGetBlessing;
            const isSelected = ending.id === 'ending_inherit'
              ? status.hasSelectedEndingInherit
              : ending.id === 'ending_leave' && status.hasSelectedEndingLeave;
            const isComplete = isSelected || (ending.id === 'ending_crowns' && status.canGetBlessing);
            const isHighlighted = isEligible || isSelected;
            const progressLabel = isComplete
              ? ending.id === 'ending_crowns' ? '已取得四冠并确认祝福' : '已确认选择此结局'
              : isEligible ? '战斗条件已满足，待选择结局'
              : ending.id === 'ending_inherit' && status.needsAldiaConfirmation ? '需确认已触发的安第尔战斗'
              : ending.id === 'ending_crowns' && status.hasFourCrowns ? '已集齐王冠，待确认国王祝福对话'
              : '尚未完成所列步骤';

            return (
              <div
                key={ending.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isHighlighted
                    ? 'bg-amber-950/20 border-amber-600/70 shadow-lg shadow-amber-950/20'
                    : 'bg-stone-900/60 border-stone-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold font-cinzel text-stone-100">
                        {ending.name}
                      </h3>
                      {ending.isScholarExclusive && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/80 border border-red-600 text-red-300 font-bold">
                          学者版内容
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-amber-400 font-mono">
                      {ending.subtitle}
                    </div>
                  </div>

                  <div className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start ${
                    isHighlighted
                      ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300'
                      : 'bg-stone-800 border border-stone-700 text-stone-400'
                  }`}>
                    {isHighlighted ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>{progressLabel}</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-stone-500" />
                        <span>{progressLabel}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Lore quote */}
                <div className="text-xs text-amber-300/80 bg-black/40 p-2.5 rounded-lg border border-stone-800/80 italic mb-3">
                  {ending.loreQuote}
                </div>

                <div className="mb-4">
                  <SpoilerText
                    text={ending.description}
                    isProtected={isSpoilerProtectionOn}
                    label="点击揭晓结局动画与剧情描述"
                  />
                </div>

                {/* Conditions Checklist */}
                <div className="space-y-2 pt-3 border-t border-stone-800">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    必须满足的前置步骤与判定：
                  </h4>
                  <div className="space-y-1.5">
                    {ending.conditions.map((cond, cIdx) => (
                      <div
                        key={cIdx}
                        className="flex items-center gap-2 text-xs text-stone-300 bg-stone-950/40 p-2 rounded-lg border border-stone-800/60"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span className="flex-1">{cond.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
