import React from 'react';
import { Flame, Shield, Compass, Crown, Sparkles } from 'lucide-react';
import { STAGES_CONFIG } from '../data/soulsData';

interface StageQuickNavProps {
  onJumpToStage: (stageX: number, stageY?: number) => void;
}

export const StageQuickNav: React.FC<StageQuickNavProps> = ({ onJumpToStage }) => {
  const quickJumps = [
    { label: '1. 序章与如蜜', x: 20, y: -650, color: 'text-amber-400' },
    { label: '2. 四大巨魂分支', x: -850, y: -650, color: 'text-orange-400' },
    { label: '3. 冬之庙与王都', x: -3950, y: -650, color: 'text-blue-400' },
    { label: '4. 不死灵庙', x: -5250, y: -650, color: 'text-purple-400' },
    { label: '5. 龙祭坛', x: -5750, y: -650, color: 'text-teal-400' },
    { label: '6. 巨人回忆', x: -7050, y: -650, color: 'text-amber-300' },
    { label: '7. 渴望王座 (双结局)', x: -7950, y: -650, color: 'text-red-400' },
    { label: '8. DLC三王冠', x: -2100, y: -1500, color: 'text-indigo-400' },
  ];

  return (
    <div 
      className="fixed left-1/2 -translate-x-1/2 z-20 max-w-[95vw] overflow-x-auto p-1.5 landscape:py-1 bg-[#0e1017]/95 border border-[#4a3f32] rounded-full shadow-2xl backdrop-blur-md flex items-center gap-1 landscape:scale-95 transition-transform"
      style={{ bottom: 'max(6px, var(--safe-bottom, 0px))' }}
    >
      <div className="flex items-center gap-1 px-2 text-[11px] font-mono text-stone-400 shrink-0 hidden sm:flex">
        <Compass className="w-3.5 h-3.5 text-amber-500" />
        <span>快速跳跃:</span>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
        {quickJumps.map((jump, idx) => (
          <button
            key={idx}
            onClick={() => onJumpToStage(jump.x, jump.y)}
            className="px-2.5 py-1 rounded-full bg-stone-900/80 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/60 text-[11px] font-medium text-stone-300 transition-all shrink-0 hover:scale-105 active:scale-95 flex items-center gap-1"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${jump.color.replace('text-', 'bg-')}`} />
            <span>{jump.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
