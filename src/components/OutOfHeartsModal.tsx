import React, { useState, useEffect } from 'react';
import { Heart, Clock, Tv, X, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../utils/sound';
import { formatHMS } from '../utils/storage';

interface OutOfHeartsModalProps {
  diamonds: number;
  regenSecondsLeft: number;
  lastAdWatchedAt: string | null;
  onTradeDiamonds: (hearts: number, cost?: number) => { success: boolean; message: string };
  onWatchMockAd: () => { success: boolean; message: string };
  onClose?: () => void;
  onOpenShop?: () => void;
}

export const OutOfHeartsModal: React.FC<OutOfHeartsModalProps> = ({
  diamonds,
  regenSecondsLeft,
  lastAdWatchedAt,
  onTradeDiamonds,
  onWatchMockAd,
  onClose,
}) => {
  const [seconds, setSeconds] = useState(regenSecondsLeft || 10800);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adProgress, setAdProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Countdown timer for next heart (updates every second in HH:MM:SS)
  useEffect(() => {
    setSeconds(regenSecondsLeft > 0 ? regenSecondsLeft : 10800);
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 1 ? prev - 1 : 10800));
    }, 1000);
    return () => clearInterval(interval);
  }, [regenSecondsLeft]);

  // Handle Mock Ad 30s timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isWatchingAd) {
      const stepMs = 300;
      const totalSteps = 30000 / stepMs;
      timer = setInterval(() => {
        setAdProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            const res = onWatchMockAd();
            setIsWatchingAd(false);
            soundManager.playReward();
            setStatusMessage(res.message);
            return 100;
          }
          return prev + 100 / totalSteps;
        });
      }, stepMs);
    }
    return () => clearInterval(timer);
  }, [isWatchingAd, onWatchMockAd]);

  const handleTrade = (hearts: number, cost: number) => {
    soundManager.playClick();
    const res = onTradeDiamonds(hearts, cost);
    if (res.success) {
      soundManager.playReward();
      setStatusMessage(res.message);
      setTimeout(() => {
        if (onClose) onClose();
      }, 1000);
    } else {
      soundManager.playIncorrect();
      setStatusMessage(res.message);
    }
  };

  // Check ad cooldown (10 min)
  const canWatchAd = (() => {
    if (!lastAdWatchedAt) return true;
    const elapsed = Date.now() - new Date(lastAdWatchedAt).getTime();
    return elapsed >= 10 * 60 * 1000;
  })();

  const getAdCooldownMinutes = () => {
    if (!lastAdWatchedAt) return 0;
    const elapsed = Date.now() - new Date(lastAdWatchedAt).getTime();
    return Math.max(1, Math.ceil((10 * 60 * 1000 - elapsed) / 60000));
  };

  return (
    <div
      id="modal-out-of-hearts"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="w-full max-w-lg bg-slate-900 border border-white/[0.08] rounded-xl p-4 sm:p-5 relative animate-fade-in my-auto shadow-2xl">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header */}
        <div className="text-center space-y-1 mb-3.5">
          <div className="w-12 h-12 mx-auto rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-2xl animate-bounce">
            💔
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white">Out of Hearts!</h2>
          <p className="text-xs text-slate-400">
            You need at least 1 ❤️ to continue your grammar drills. Exchange diamonds for instant refill or wait.
          </p>
        </div>

        {statusMessage && (
          <div className="mb-3 p-2 rounded-lg bg-cyan-950/70 border border-cyan-500/50 text-xs text-cyan-200 text-center flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Options List */}
        <div className="space-y-2.5">
          {/* PRIMARY OPTION: Trade Diamonds (1 💎 = 3 ❤️) */}
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-red-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-base">💎</span>
                <div>
                  <h4 className="text-xs font-bold text-white">Instant Diamond Refill</h4>
                  <p className="text-[11px] text-red-300 font-semibold">1 💎 = 3 Hearts</p>
                </div>
              </div>
              <div className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-white/[0.08] text-xs font-mono font-bold text-cyan-300">
                {diamonds} 💎 available
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                disabled={diamonds < 1}
                onClick={() => handleTrade(3, 1)}
                className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-all ${
                  diamonds >= 1
                    ? 'bg-red-500/10 hover:bg-red-500/20 border-red-500/40 text-white active:scale-95'
                    : 'bg-slate-900/40 border-white/[0.04] text-slate-500 cursor-not-allowed'
                }`}
              >
                <span className="text-xs font-bold text-red-300">+3 ❤️</span>
                <span className="text-[10px] font-mono font-bold text-cyan-300">1 💎</span>
              </button>

              <button
                type="button"
                disabled={diamonds < 3}
                onClick={() => handleTrade(9, 3)}
                className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-all ${
                  diamonds >= 3
                    ? 'bg-red-500/10 hover:bg-red-500/20 border-red-500/40 text-white active:scale-95'
                    : 'bg-slate-900/40 border-white/[0.04] text-slate-500 cursor-not-allowed'
                }`}
              >
                <span className="text-xs font-bold text-red-300">+9 ❤️</span>
                <span className="text-[10px] font-mono font-bold text-cyan-300">3 💎</span>
              </button>

              <button
                type="button"
                disabled={diamonds < 5}
                onClick={() => handleTrade(15, 5)}
                className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-all ${
                  diamonds >= 5
                    ? 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/40 text-white active:scale-95'
                    : 'bg-slate-900/40 border-white/[0.04] text-slate-500 cursor-not-allowed'
                }`}
              >
                <span className="text-xs font-bold text-cyan-300">+15 ❤️</span>
                <span className="text-[10px] font-mono font-bold text-cyan-300">5 💎</span>
              </button>

              <button
                type="button"
                disabled={diamonds < 7}
                onClick={() => handleTrade(20, 7)}
                className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-all ${
                  diamonds >= 7
                    ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-400/50 text-white active:scale-95'
                    : 'bg-slate-900/40 border-white/[0.04] text-slate-500 cursor-not-allowed'
                }`}
              >
                <span className="text-xs font-bold text-amber-300">Full (20 ❤️)</span>
                <span className="text-[10px] font-mono font-bold text-amber-400">7 💎</span>
              </button>
            </div>
          </div>

          {/* SECONDARY OPTION: Watch Mock Ad */}
          <div className="p-3 rounded-xl bg-slate-800/80 border border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-cyan-400" />
                <h4 className="text-xs font-bold text-white">Sponsor Clip (Mock)</h4>
              </div>
              <span className="text-[10px] text-red-400 font-bold">+5 ❤️</span>
            </div>

            {isWatchingAd ? (
              <div className="space-y-1.5 py-0.5">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Watching sponsor clip...</span>
                  <span className="font-mono">{Math.round(adProgress)}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${adProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <button
                type="button"
                disabled={!canWatchAd}
                onClick={() => {
                  soundManager.playClick();
                  setIsWatchingAd(true);
                  setAdProgress(0);
                }}
                className={`w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  canWatchAd
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/[0.04]'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>
                  {canWatchAd
                    ? 'Watch Sponsor Clip (+5 Hearts)'
                    : `Available in ${getAdCooldownMinutes()}m`}
                </span>
              </button>
            )}
          </div>

          {/* TERTIARY OPTION: Wait 3 Hours for Auto-Refill */}
          <div className="p-3 rounded-xl bg-slate-800/50 border border-white/[0.06] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-slate-800 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-semibold text-slate-300">Wait for Auto-Refill</h4>
                <p className="text-[10px] text-slate-500">Each heart takes 3 hours to refill</p>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-md bg-slate-900 text-xs font-mono font-bold text-cyan-400 border border-white/[0.06]">
              {formatHMS(seconds)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
