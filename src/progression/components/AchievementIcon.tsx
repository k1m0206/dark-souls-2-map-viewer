import React, { useState } from 'react';
import { Award, Lock } from 'lucide-react';

interface AchievementIconProps {
  achievementId: string;
  isUnlocked: boolean;
  name: string;
  size?: number;
  className?: string;
  showLockedPlaceholder?: boolean;
}

export const AchievementIcon: React.FC<AchievementIconProps> = ({
  achievementId,
  isUnlocked,
  name,
  size = 48,
  className = '',
  showLockedPlaceholder = false,
}) => {
  const [hasError, setHasError] = useState(false);

  const imageSrc = `./achievements/${showLockedPlaceholder && !isUnlocked ? 'locked' : achievementId}.jpg`;

  if (hasError) {
    return (
      <div
        className={`relative flex items-center justify-center rounded border border-amber-900/60 bg-stone-900 select-none ${className}`}
        style={{ width: size, height: size }}
        title={name}
      >
        {isUnlocked ? (
          <Award className="w-6 h-6 text-amber-400" />
        ) : (
          <Lock className="w-5 h-5 text-stone-500" />
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative inline-block overflow-hidden rounded transition-all duration-200 select-none flex-shrink-0 ${
        isUnlocked
          ? 'border border-amber-500/70 shadow-md shadow-amber-950/40 ring-1 ring-amber-500/30'
          : 'border border-stone-700/60 opacity-55 grayscale contrast-90 brightness-75'
      } ${className}`}
      style={{ width: size, height: size }}
      title={`${name} (${isUnlocked ? '已完成' : '未解锁'})`}
    >
      <img
        src={imageSrc}
        alt={name}
        loading="lazy"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover"
      />
      {!isUnlocked && (
        <div className="absolute inset-0 bg-stone-950/40 flex items-center justify-center pointer-events-none">
          <Lock className="w-3.5 h-3.5 text-stone-300 drop-shadow-md" />
        </div>
      )}
    </div>
  );
};
