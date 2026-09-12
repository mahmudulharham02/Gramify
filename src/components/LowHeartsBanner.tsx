import React from 'react';
import { Heart, Sparkles, AlertTriangle, Flame } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface LowHeartsBannerProps {
  hearts: number;
  maxHearts?: number;
  diamonds: number;
  onOpenShop: () => void;
}

export const LowHeartsBanner: React.FC<LowHeartsBannerProps> = ({
  hearts,
  maxHearts = 20,
  diamonds,
  onOpenShop,
}) => {
  if (hearts >= 15) {
    return null;
  }

  const handleOpen = () => {
    soundManager.playClick();
    onOpenShop();
  };

  if (hearts >= 10 && hearts <= 14) {
    const hoursWait = (maxHearts - hearts) * 3;
    return (
      <div
        id="banner-hearts-low"
        className="w-full mb-3 px-3.5 py-2 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs animate-fade-in"
      >
        <div className="flex items-center gap-2 text-cyan-200">
          <span className="text-sm">💡</span>
          <span>
            Hearts running low ({hearts}/{maxHearts}). Trade diamonds or wait ~{hoursWait} hours for a full refill.
          </span>
        </div>
        <button
          onClick={handleOpen}
          className="px-2.5 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-[11px] border border-cyan-400/40 transition-all flex items-center gap-1 shrink-0 ml-2"
        >
          <span>Trade 💎</span>
        </button>
      </div>
    );
  }

  if (hearts >= 5 && hearts <= 9) {
    return (
      <div
        id="banner-hearts-medium"
        className="w-full mb-3 px-3.5 py-2.5 rounded-2xl bg-amber-950/50 border border-amber-500/40 flex items-center justify-between text-xs animate-fade-in"
      >
        <div className="flex items-center gap-2 text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Only <strong className="text-white">{hearts}</strong> hearts left! Each heart refills in 3 hours. Top up with diamonds now.
          </span>
        </div>
        <button
          onClick={handleOpen}
          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] shadow-md shadow-amber-500/20 transition-all shrink-0 ml-2"
        >
          Top Up with 💎
        </button>
      </div>
    );
  }

  if (hearts >= 1 && hearts <= 4) {
    return (
      <div
        id="banner-hearts-critical"
        className="w-full mb-3 px-3.5 py-2.5 rounded-2xl bg-rose-950/60 border border-rose-500/50 flex items-center justify-between text-xs animate-fade-in"
      >
        <div className="flex items-center gap-2 text-rose-200">
          <Heart className="w-4 h-4 text-rose-400 fill-rose-500/40 animate-pulse shrink-0" />
          <span>
            <strong className="text-white font-bold">⚠️ Last {hearts === 1 ? 'heart' : `${hearts} hearts`}!</strong> Spend 1 💎 for 3 hearts or wait 3 hours.
          </span>
        </div>
        <button
          onClick={handleOpen}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-extrabold text-[11px] shadow-md shadow-rose-500/30 transition-all shrink-0 ml-2 animate-pulse"
        >
          Refill 1 💎 → 3 ❤️
        </button>
      </div>
    );
  }

  return null;
};
