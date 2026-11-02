import React, { useState } from 'react';
import { Eye, EyeOff, ShieldAlert } from 'lucide-react';

interface SpoilerTextProps {
  children?: React.ReactNode;
  text?: string;
  isProtected: boolean;
  hint?: string;
  label?: string;
  className?: string;
}

export const SpoilerText: React.FC<SpoilerTextProps> = ({
  children,
  text,
  isProtected,
  hint,
  label,
  className = '',
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const displayHint = label || hint || '涉及关键剧透，点击揭晓内容';
  const content = text ?? children;

  // If global protection is turned off, show clean content directly
  if (!isProtected) {
    return <span className={className}>{content}</span>;
  }

  // If revealed by user click
  if (isRevealed) {
    return (
      <span
        onClick={() => setIsRevealed(false)}
        className={`relative inline-block px-2 py-1 rounded-lg bg-amber-950/30 border border-amber-600/50 text-amber-200 transition-all cursor-pointer group shadow-sm ${className}`}
        title="已揭晓剧情，再次点击可重新遮盖保护"
      >
        <span>{content}</span>
        <span className="inline-flex items-center gap-1 ml-2 text-[10px] text-amber-400/90 font-mono opacity-80 group-hover:opacity-100 transition-opacity bg-black/50 px-1.5 py-0.5 rounded border border-amber-500/40">
          <EyeOff className="w-2.5 h-2.5 inline" />
          <span>点击重新遮盖</span>
        </span>
      </span>
    );
  }

  // Obfuscated / Pixel Mosaic Mask state
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        setIsRevealed(true);
      }}
      className={`relative inline-flex items-center cursor-pointer group select-none transition-all rounded-lg overflow-hidden align-middle my-1 border border-amber-700/60 shadow-inner ${className}`}
      title={displayHint}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsRevealed(true);
        }
      }}
    >
      {/* Blurred background preview */}
      <span className="filter blur-[6px] opacity-25 pointer-events-none px-3 py-1.5 bg-[#141018] text-stone-400 select-none">
        {content}
      </span>

      {/* Mosaic Pixel Grid overlay */}
      <span className="absolute inset-0 bg-[#16121a]/90 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:6px_6px] flex items-center justify-center gap-1.5 px-3 py-1 text-xs font-medium text-amber-300 shadow-inner group-hover:bg-[#20141f]/95 group-hover:text-amber-200 group-hover:border-amber-400 transition-all">
        <Eye className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
        <span className="font-sans tracking-tight">{displayHint}</span>
        <span className="text-[10px] text-amber-500/80 font-mono ml-1 hidden sm:inline">(点击揭晓)</span>
      </span>
    </span>
  );
};
