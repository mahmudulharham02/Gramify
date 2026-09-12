import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Flame,
  ChevronRight,
  BookOpen,
  Layers,
  Check,
  Calendar,
  Lock,
  Crown,
  Heart,
  RotateCcw,
  Compass,
  Shuffle,
  Sliders,
  HelpCircle,
  Hash
} from 'lucide-react';
import { AppState, CurrentDrillSession } from '../types';
import { TOPICS_DATA } from '../data/topics';
import { getXpRequiredForLevel } from '../data/badges';
import { soundManager } from '../utils/sound';
import { CacheWarningBanner } from './CacheWarningBanner';
import { LowHeartsBanner } from './LowHeartsBanner';
import { RuleOfTheDayCard } from './RuleOfTheDayCard';
import { PWAInstallButton } from './PWAInstallButton';
import {
  getWeakestSubModule,
  getCurrentDrillSession,
  WeakSpotInfo
} from '../utils/storage';
import { resolveAvatar } from './AvatarPickerModal';

interface HomeDashboardProps {
  state: AppState;
  onNavigate: (route: string, params?: { topicId?: string; subtopicId?: string }) => void;
  onStartDailyChallenge: () => void;
  onStartSmartPractice?: (weakSpot: WeakSpotInfo) => void;
  onResumeDrillSession?: (session: CurrentDrillSession) => void;
  onOpenRules: () => void;
  onOpenCertificate: () => void;
  onOpenHeartsShop: () => void;
  onExportBackup: () => void;
  onDismissCacheWarning: () => void;
}

export function getDashboardTopicIcon(topicId: string) {
  switch (topicId) {
    case 'changing_sentences':
      return <Crown className="w-4 h-4 text-amber-400" />;
    case 'articles':
      return <BookOpen className="w-4 h-4 text-cyan-400" />;
    case 'preposition':
      return <Compass className="w-4 h-4 text-cyan-400" />;
    case 'completing_sentences':
      return <Sparkles className="w-4 h-4 text-cyan-400" />;
    case 'right_form_of_verbs':
      return <Zap className="w-4 h-4 text-cyan-400" />;
    case 'connectors':
      return <Layers className="w-4 h-4 text-cyan-400" />;
    case 'synonyms_antonyms':
      return <Shuffle className="w-4 h-4 text-cyan-400" />;
    case 'punctuation':
      return <Hash className="w-4 h-4 text-cyan-400" />;
    case 'modifiers':
      return <Sliders className="w-4 h-4 text-cyan-400" />;
    case 'tag_questions_and_special':
      return <HelpCircle className="w-4 h-4 text-cyan-400" />;
    default:
      return <BookOpen className="w-4 h-4 text-cyan-400" />;
  }
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  state,
  onNavigate,
  onStartDailyChallenge,
  onStartSmartPractice,
  onResumeDrillSession,
  onOpenHeartsShop,
  onExportBackup,
  onDismissCacheWarning,
}) => {
  const requiredXP = getXpRequiredForLevel(state.level);
  const xpProgressPercent = Math.min(100, Math.round((state.xp / requiredXP) * 100));

  const todayStr = new Date().toISOString().split('T')[0];
  const isDailyCompletedToday = state.dailyChallenge.lastCompletedDate === todayStr;

  const currentSavedSession = state.currentDrillSession || getCurrentDrillSession();
  const weakestSubModule = getWeakestSubModule(state);
  const isZeroHearts = state.hearts <= 0;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Trigger smooth fill animation on mount
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="home-dashboard-container" className="space-y-4 pb-12 max-w-7xl mx-auto">
      {/* Low Hearts Banner */}
      <LowHeartsBanner
        hearts={state.hearts}
        maxHearts={state.maxHearts}
        diamonds={state.diamonds}
        onOpenShop={onOpenHeartsShop}
      />

      {/* Cache Warning Banner */}
      {!state.settings.cacheWarningDismissed && (
        <CacheWarningBanner
          onExport={onExportBackup}
          onDismiss={onDismissCacheWarning}
        />
      )}

      {/* PWA Native App Install Banner */}
      <PWAInstallButton variant="banner" />

      {/* ========================================================================= */}
      {/* ZONE 1 — QUICK ACTIONS (COMPACT SINGLE ROW)                               */}
      {/* ========================================================================= */}
      {isZeroHearts ? (
        /* Out of Hearts */
        <div
          id="priority-card-zero-hearts"
          className="rounded-xl bg-red-950/40 border border-red-500/40 p-3 sm:p-4 flex items-center justify-between gap-3 animate-shake"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-white truncate">
                Out of Hearts! Refill to Continue
              </h2>
              <p className="text-xs text-slate-300 truncate">
                Trade diamonds or wait for auto-refill to answer questions.
              </p>
            </div>
          </div>

          <button
            id="btn-priority-refill-hearts"
            type="button"
            onClick={() => {
              soundManager.playClick();
              onOpenHeartsShop();
            }}
            className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shrink-0 transition-colors"
          >
            Refill Hearts
          </button>
        </div>
      ) : currentSavedSession && currentSavedSession.currentQuestionIndex < currentSavedSession.totalQuestions ? (
        /* Continue Drill Session */
        <div
          id="priority-card-continue-drill"
          className="rounded-xl bg-slate-800/80 border border-cyan-500/40 p-3 sm:p-4 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-semibold uppercase text-cyan-400">
                Continue Drill
              </span>
              <h2 className="text-sm font-semibold text-white truncate">
                {currentSavedSession.title} ({currentSavedSession.currentQuestionIndex}/{currentSavedSession.totalQuestions})
              </h2>
            </div>
          </div>

          <button
            id="btn-priority-resume-drill"
            type="button"
            onClick={() => {
              soundManager.playClick();
              if (onResumeDrillSession) {
                onResumeDrillSession(currentSavedSession);
              } else {
                onNavigate('game', {
                  topicId: currentSavedSession.topicId,
                  subtopicId: currentSavedSession.subtopicId || currentSavedSession.subModuleId,
                });
              }
            }}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shrink-0 transition-colors flex items-center gap-1"
          >
            <span>Resume</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : !isDailyCompletedToday ? (
        /* Daily Challenge */
        <div
          id="priority-card-daily-challenge"
          className="rounded-xl bg-slate-800/80 border border-white/[0.08] hover:border-cyan-500/30 p-3 sm:p-4 flex items-center justify-between gap-3 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase text-cyan-400">
                  Daily Challenge
                </span>
                <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-0.5">
                  <Flame className="w-3 h-3 fill-amber-400" />
                  {state.streak} Days
                </span>
              </div>
              <h2 className="text-sm font-semibold text-white truncate">
                Today's 10-Topic Board Challenge
              </h2>
            </div>
          </div>

          <button
            id="btn-priority-start-daily"
            type="button"
            onClick={() => {
              soundManager.playClick();
              onStartDailyChallenge();
            }}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shrink-0 transition-colors flex items-center gap-1"
          >
            <span>Start</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* Completed Today / Welcome Summary Row */
        <div
          id="hero-profile-banner"
          className="rounded-xl bg-slate-800/80 border border-white/[0.08] p-3 sm:p-4 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              onClick={() => {
                soundManager.playClick();
                onNavigate('profile');
              }}
              className="w-9 h-9 rounded-lg bg-slate-700 border border-white/[0.08] flex items-center justify-center text-lg cursor-pointer hover:border-cyan-500/40 shrink-0 select-none leading-none"
            >
              <span>{resolveAvatar(state.user.avatar)}</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white truncate">
                  {state.user.name || 'HSC Aspirant'}
                </h2>
                <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-500/20">
                  Lvl {state.level}
                </span>
              </div>
              {/* XP Progress Bar */}
              <div className="flex items-center gap-2 mt-1 w-36 sm:w-48">
                <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all"
                    style={{ width: `${xpProgressPercent}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                  {state.xp}/{requiredXP} XP
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onNavigate('practice_hub');
            }}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shrink-0 transition-colors flex items-center gap-1"
          >
            <span>Drills</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ZONE 2 — SMART PRACTICE & EXAM SIMULATOR (COMPACT ROWS)                    */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Smart Practice Card */}
        {weakestSubModule ? (
          <div
            id="card-smart-practice-active"
            onClick={() => {
              soundManager.playClick();
              if (onStartSmartPractice) {
                onStartSmartPractice(weakestSubModule);
              } else {
                onNavigate('game', { topicId: weakestSubModule.topicId, subtopicId: weakestSubModule.subModuleId });
              }
            }}
            className="rounded-xl bg-slate-800/80 border border-white/[0.08] hover:border-cyan-500/30 p-3 flex items-center justify-between gap-3 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-semibold uppercase text-cyan-400">
                    Smart Practice
                  </span>
                  <span className="text-[10px] text-red-400 font-semibold">
                    {weakestSubModule.accuracy}% Accuracy
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white truncate">
                  {weakestSubModule.subModuleName}
                </h3>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
        ) : (
          <div
            id="card-smart-practice-disabled"
            className="rounded-xl bg-slate-800/50 border border-white/[0.05] p-3 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 border border-white/[0.05] flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-semibold uppercase text-slate-400">
                  Smart Practice
                </span>
                <p className="text-xs text-slate-400 truncate">
                  Complete 5+ drills to identify weak spots
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onNavigate('practice_hub');
              }}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 shrink-0"
            >
              Browse
            </button>
          </div>
        )}

        {/* Last Hour Prep Test Card */}
        {state.level >= 2 ? (
          <div
            id="card-last-hour-prep-unlocked"
            onClick={() => {
              soundManager.playClick();
              onNavigate('last_hour_prep');
            }}
            className="rounded-xl bg-slate-800/80 border border-amber-500/40 hover:border-amber-400 p-3 flex items-center justify-between gap-3 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Crown className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-semibold uppercase text-amber-400">
                    Exam Simulator
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    60 Marks · 90m
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white truncate">
                  Last Hour Prep Test
                </h3>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-amber-400 shrink-0" />
          </div>
        ) : (
          <div
            id="card-last-hour-prep-locked"
            className="rounded-xl bg-slate-800/50 border border-amber-500/20 p-3 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-amber-400/80 border border-amber-500/20 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-semibold uppercase text-amber-400/80">
                  Exam Simulator · Locked
                </span>
                <p className="text-xs text-slate-400 truncate">
                  Unlocks at Level 2 (60 Marks · 90m)
                </p>
              </div>
            </div>

            <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 shrink-0">
              Lvl 2
            </span>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* ZONE 3 — QUICK DRILLS (VOICE & NARRATION)                                  */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div
          onClick={() => {
            soundManager.playClick();
            onNavigate('practice_hub');
          }}
          className="rounded-xl bg-slate-800/80 border border-white/[0.08] hover:border-cyan-500/30 p-3 flex items-center justify-between gap-3 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-white truncate">
                Voice Change Drills
              </h3>
              <p className="text-xs text-slate-400 truncate">
                12 Sub-Modules · 120+ Questions
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </div>

        <div
          onClick={() => {
            soundManager.playClick();
            onNavigate('practice_hub');
          }}
          className="rounded-xl bg-slate-800/80 border border-white/[0.08] hover:border-cyan-500/30 p-3 flex items-center justify-between gap-3 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-white truncate">
                Direct & Indirect Narration
              </h3>
              <p className="text-xs text-slate-400 truncate">
                6 Sub-Modules · 60+ Questions
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ZONE 4 — ALL TOPICS GRID (FIX 2 COMPACT TOPIC CARDS)                      */}
      {/* ========================================================================= */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">
            All Topics
          </h2>
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onNavigate('topics');
            }}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {TOPICS_DATA.map((topic) => {
            const prog = state.topicProgress[topic.id] || {
              unlocked: true,
              attempts: 0,
              correct: 0,
              wrong: 0,
              mastery: 0,
            };

            const attempts = prog.attempts || 0;
            const percent = attempts > 0 ? Math.min(100, Math.max(0, prog.mastery || 0)) : 0;

            // Mastery color logic:
            // 0 attempts: gray bar, tiny lock icon (16px) in top-right corner
            // 1 to 49%: cyan bar, partial fill
            // 50 to 99%: amber bar, partial fill
            // 100%: green bar, full fill, tiny checkmark icon
            let barColor = 'bg-slate-700';
            let showLock = false;
            let showCheck = false;

            if (attempts === 0) {
              barColor = 'bg-slate-700';
              showLock = true;
            } else if (percent < 50) {
              barColor = 'bg-cyan-500';
            } else if (percent < 100) {
              barColor = 'bg-amber-500';
            } else {
              barColor = 'bg-green-500';
              showCheck = true;
            }

            return (
              <div
                key={topic.id}
                id={`topic-card-${topic.id}`}
                onClick={() => {
                  soundManager.playClick();
                  if (topic.id === 'changing_sentences') {
                    onNavigate('changing_sentences');
                  } else {
                    onNavigate('game', { topicId: topic.id });
                  }
                }}
                className="rounded-xl bg-slate-800/80 border border-white/[0.08] hover:border-cyan-500/30 p-3 flex flex-col justify-between gap-2.5 cursor-pointer transition-colors min-h-[64px]"
              >
                {/* Top Row: Icon + Title + Marks Badge + (Lock/Check) */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-white/[0.06] flex items-center justify-center shrink-0">
                      {getDashboardTopicIcon(topic.id)}
                    </div>
                    <span className="text-sm font-semibold text-white truncate">
                      {topic.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-900/80 border border-white/[0.06] text-slate-300 font-mono">
                      {topic.marks}M
                    </span>
                    {showLock && <Lock className="w-3.5 h-3.5 text-slate-500" />}
                    {showCheck && <Check className="w-3.5 h-3.5 text-green-400" />}
                  </div>
                </div>

                {/* Bottom Row: 4px progress bar */}
                <div className="w-full h-1 bg-slate-700/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} rounded-full transition-[width] duration-700 ease-out`}
                    style={{ width: isMounted && attempts > 0 ? `${percent}%` : '0%' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ZONE 5 — RULE OF THE DAY                                                  */}
      {/* ========================================================================= */}
      <section id="rule-of-the-day-section">
        <RuleOfTheDayCard onDrillTopic={(topicId) => onNavigate('game', { topicId })} />
      </section>
    </div>
  );
};
