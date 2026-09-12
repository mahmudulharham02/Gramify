import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { soundManager } from '../utils/sound';

interface ThemeToggleProps {
  id?: string;
  variant?: 'icon' | 'switch';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  id = 'btn-theme-toggle',
  variant = 'icon',
  className = '',
}) => {
  const { isLight, toggleTheme } = useTheme();

  const handleToggle = () => {
    soundManager.playClick();
    toggleTheme();
  };

  if (variant === 'switch') {
    return (
      <div className={`flex items-center justify-between ${className}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white">Light Mode</h4>
            <p className="text-[11px] text-slate-400">
              Clean white theme for daytime study
            </p>
          </div>
        </div>

        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={isLight}
          onClick={handleToggle}
          className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
            isLight ? 'bg-cyan-500' : 'bg-slate-700'
          }`}
          title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center transition-transform ${
              isLight ? 'translate-x-5 text-amber-500' : 'translate-x-0 text-slate-700'
            }`}
          >
            {isLight ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
          </div>
        </button>
      </div>
    );
  }

  // Default: icon button (used in Hamburger drawer header, Login card, etc.)
  return (
    <button
      id={id}
      type="button"
      onClick={handleToggle}
      className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer select-none flex items-center justify-center active:scale-95 border ${
        isLight
          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 hover:border-slate-300 shadow-sm'
          : 'bg-slate-800/90 hover:bg-slate-700 text-amber-400 border-white/[0.08] hover:border-amber-400/40'
      } ${className}`}
      aria-label={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      {isLight ? (
        <Moon className="w-4 h-4 text-slate-700" />
      ) : (
        <Sun className="w-4 h-4 text-amber-400" />
      )}
    </button>
  );
};
