import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, Lock } from 'lucide-react';
import { AppState, Badge } from '../types';
import { ALL_BADGES } from '../data/badges';
import { soundManager } from '../utils/sound';

interface AchievementsViewProps {
  state: AppState;
  onClaimBadge: (badgeId: string) => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ state, onClaimBadge }) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const unlockedSet = new Set(state.badges);
  const unclaimedSet = new Set(state.unclaimedBadges || []);

  const filteredBadges = ALL_BADGES.filter((b) => {
    const isUnlocked = unlockedSet.has(b.id);
    if (filter === 'unlocked') return isUnlocked;
    if (filter === 'locked') return !isUnlocked;
    return true;
  });

  const handleClaim = (badge: Badge) => {
    soundManager.playCoin();
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#0ea5e9', '#22c55e'],
      });
    } catch {
      // ignore
    }
    onClaimBadge(badge.id);
  };

  return (
    <div id="achievements-view" className="space-y-4 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Badges & Achievements</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Unlock trophies by maintaining study streaks, mastering topics, and leveling up.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5">
          {[
            { id: 'all', label: `All (${ALL_BADGES.length})` },
            { id: 'unlocked', label: `Unlocked (${unlockedSet.size})` },
            { id: 'locked', label: `Locked (${ALL_BADGES.length - unlockedSet.size})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playClick();
                setFilter(tab.id as any);
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                filter === tab.id
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-white/[0.04]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredBadges.map((badge) => {
          const isUnlocked = unlockedSet.has(badge.id);
          const isUnclaimed = unclaimedSet.has(badge.id);

          return (
            <div
              key={badge.id}
              className={`rounded-xl p-3.5 border transition-all flex flex-col justify-between relative ${
                isUnlocked
                  ? 'bg-slate-800/90 border-cyan-500/30 shadow-md'
                  : 'bg-slate-900/60 border-white/[0.04] opacity-60'
              }`}
            >
              {isUnclaimed && (
                <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-amber-400 text-slate-950 font-bold text-[10px] rounded-full shadow animate-pulse">
                  Claim Reward! 🎁
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl p-1.5 rounded-lg bg-slate-900 border border-white/[0.06]">
                    {badge.icon}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      isUnlocked
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-900 text-slate-500 border-white/[0.04]'
                    }`}
                  >
                    {isUnlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white truncate">{badge.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-amber-400">
                  +{badge.xpReward} XP • +{badge.coinReward} 💎
                </span>

                {isUnclaimed ? (
                  <button
                    onClick={() => handleClaim(badge)}
                    className="px-2.5 py-1 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow transition-transform hover:scale-105"
                  >
                    Claim 🎁
                  </button>
                ) : isUnlocked ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
