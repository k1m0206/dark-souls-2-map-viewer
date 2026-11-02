import React from 'react';
import { Eye, EyeOff, ShieldCheck, Flame, Sparkles } from 'lucide-react';

interface SpoilerPromptModalProps {
  isOpen: boolean;
  onSelectOption: (enableSpoilerProtection: boolean) => void;
}

export const SpoilerPromptModal: React.FC<SpoilerPromptModalProps> = ({
  isOpen,
  onSelectOption,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#12141c] border border-amber-600/60 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-gradient-to-r from-[#201c27] via-[#161722] to-[#12141c] text-center relative">
          <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-amber-950/70 border border-amber-500/60 flex items-center justify-center shadow-lg shadow-amber-950/40">
            <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
          </div>
          <h2 className="text-base sm:text-xl font-bold font-cinzel text-amber-200">
            多玛多兰的旅人，欢迎来到多兰古雷格
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            进入《黑暗之魂2：原罪学者》流程图鉴前，请设置您的浏览偏好：
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-3.5 text-xs sm:text-sm">
          {/* Option 1: Protected (Recommended) */}
          <button
            onClick={() => onSelectOption(true)}
            className="w-full text-left p-3.5 sm:p-4 rounded-xl border-2 border-amber-600/70 bg-gradient-to-r from-amber-950/30 to-stone-900/80 hover:border-amber-400 hover:from-amber-950/50 transition-all group shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-900/60 border border-amber-500 text-amber-300 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-amber-300 text-sm sm:text-base">
                    开启剧透防护
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/50">
                    ★ 推荐新手与首通
                  </span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  分支抉择后果、隐藏剧情转折、结局描述等将以<strong className="text-amber-200">马赛克蒙版遮盖</strong>。点击被遮盖内容可逐条揭晓，防止提前被关键剧情剧透。
                </p>
              </div>
            </div>
          </button>

          {/* Option 2: Full Reveal */}
          <button
            onClick={() => onSelectOption(false)}
            className="w-full text-left p-3.5 sm:p-4 rounded-xl border border-stone-800 bg-stone-900/60 hover:border-stone-600 hover:bg-stone-800/80 transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-stone-800 border border-stone-700 text-stone-400 shrink-0 mt-0.5 group-hover:text-stone-200">
                <Eye className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-stone-200 text-sm sm:text-base">
                    关闭剧透防护（直接明文浏览）
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-800 text-stone-400 border border-stone-700">
                    速通 / 查漏补缺
                  </span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  无需点击揭晓，所有分支策略、结局动画条件与隐藏剧情直接完整展示。
                </p>
              </div>
            </div>
          </button>

          {/* Tip footer */}
          <div className="p-2.5 rounded-lg bg-stone-950/60 border border-stone-800 text-[11px] text-stone-400 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>进入应用后，随时可在顶部导航栏点击「剧透防护」按钮重新切换。</span>
          </div>
        </div>
      </div>
    </div>
  );
};
