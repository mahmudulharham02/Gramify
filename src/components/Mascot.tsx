import React from 'react';

export type MascotMood = 'neutral' | 'happy' | 'thinking' | 'shocked' | 'celebrating';

interface MascotProps {
  mood?: MascotMood;
  size?: 'sm' | 'md' | 'lg';
  showSpeech?: string | null;
}

export const Mascot: React.FC<MascotProps> = ({
  mood = 'neutral',
  size = 'md',
  showSpeech = null,
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-2xl',
    md: 'w-16 h-16 text-4xl',
    lg: 'w-24 h-24 text-6xl',
  };

  const getMascotEmoji = () => {
    switch (mood) {
      case 'happy':
        return '🦉';
      case 'shocked':
        return '🦉';
      case 'thinking':
        return '🦉';
      case 'celebrating':
        return '🦉';
      case 'neutral':
      default:
        return '🦉';
    }
  };

  const getAnimationClass = () => {
    switch (mood) {
      case 'happy':
        return 'hover:scale-105 transition-transform duration-200';
      case 'shocked':
        return 'hover:scale-105 transition-transform duration-200';
      case 'celebrating':
        return 'hover:scale-105 transition-transform duration-200';
      case 'thinking':
        return 'hover:scale-105 transition-transform duration-200';
      case 'neutral':
      default:
        return 'hover:scale-105 transition-transform duration-200';
    }
  };

  return (
    <div id="app-mascot-container" className="relative inline-flex items-center gap-2.5 select-none max-w-full">
      <div
        id="mascot-avatar"
        className={`shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-950/40 via-violet-950/40 to-slate-900 border border-cyan-500/20 shadow-inner cursor-pointer ${sizeClasses[size]} ${getAnimationClass()}`}
      >
        <span>{getMascotEmoji()}</span>
      </div>

      {showSpeech && (
        <div
          id="mascot-speech-bubble"
          className="relative flex items-center gap-1.5 bg-slate-900/90 text-cyan-300 text-xs px-3 py-1.5 rounded-xl border border-cyan-500/30 shadow-md backdrop-blur-sm animate-fade-in z-10 font-semibold max-w-[200px] sm:max-w-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
          <span className="truncate sm:whitespace-normal">{showSpeech}</span>
        </div>
      )}
    </div>
  );
};
