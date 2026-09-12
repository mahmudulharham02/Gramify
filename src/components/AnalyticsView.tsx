import React from 'react';
import { BarChart3, Award } from 'lucide-react';
import { AppState, TopicProgressItem } from '../types';
import { TOPICS_DATA } from '../data/topics';
import { soundManager } from '../utils/sound';

interface AnalyticsViewProps {
  state: AppState;
  onOpenCertificate: () => void;
  onNavigateTopic: (topicId: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  state,
  onOpenCertificate,
  onNavigateTopic,
}) => {
  const totalCorrect = (Object.values(state.topicProgress) as TopicProgressItem[]).reduce(
    (a, b) => a + b.correct,
    0
  );
  const totalWrong = (Object.values(state.topicProgress) as TopicProgressItem[]).reduce(
    (a, b) => a + b.wrong,
    0
  );
  const totalAttempts = totalCorrect + totalWrong;
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const avgMastery = Math.round(
    (Object.values(state.topicProgress) as TopicProgressItem[]).reduce(
      (a, b) => a + b.mastery,
      0
    ) / Math.max(1, Object.keys(state.topicProgress).length)
  );

  return (
    <div id="analytics-view" className="space-y-4 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <span>Learning Analytics & Progress</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time syllabus coverage, accuracy rates, and topic mastery breakdown.
          </p>
        </div>

        <button
          id="btn-analytics-cert"
          onClick={() => {
            soundManager.playClick();
            onOpenCertificate();
          }}
          className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow self-start sm:self-auto transition-all"
        >
          <Award className="w-4 h-4" />
          <span>View Mastery Certificate</span>
        </button>
      </div>

      {/* Top Stat Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div className="bg-slate-800/80 border border-white/[0.08] rounded-xl p-3.5 space-y-0.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Practice XP</span>
          <div className="text-xl sm:text-2xl font-bold text-cyan-400 font-mono">
            {state.xp}
          </div>
          <span className="text-[10px] text-slate-400">Level {state.level} Scholar</span>
        </div>

        <div className="bg-slate-800/80 border border-white/[0.08] rounded-xl p-3.5 space-y-0.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Accuracy Rate</span>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">
            {overallAccuracy}%
          </div>
          <span className="text-[10px] text-slate-400">{totalCorrect} correct of {totalAttempts}</span>
        </div>

        <div className="bg-slate-800/80 border border-white/[0.08] rounded-xl p-3.5 space-y-0.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Syllabus Mastery</span>
          <div className="text-xl sm:text-2xl font-bold text-cyan-300 font-mono">
            {avgMastery}%
          </div>
          <span className="text-[10px] text-slate-400">Across 10 Board Topics</span>
        </div>

        <div className="bg-slate-800/80 border border-white/[0.08] rounded-xl p-3.5 space-y-0.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Study Streak</span>
          <div className="text-xl sm:text-2xl font-bold text-amber-400 font-mono">
            {state.streak} Days 🔥
          </div>
          <span className="text-[10px] text-slate-400">Active streak</span>
        </div>
      </div>

      {/* 10-Topic Mastery Breakdown Bars */}
      <div className="rounded-xl p-4 border border-white/[0.08] bg-slate-800/80 space-y-3">
        <div>
          <h2 className="text-xs sm:text-sm font-bold text-white">Curriculum Topic Mastery Matrix</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Green (≥80% Strong), Amber (50-79% Progressing), Red (&lt;50% Needs Practice)
          </p>
        </div>

        <div className="space-y-2">
          {TOPICS_DATA.map((topic) => {
            const prog = state.topicProgress[topic.id] || {
              unlocked: true,
              attempts: 0,
              correct: 0,
              wrong: 0,
              mastery: 0,
            };

            const masteryColor =
              prog.mastery >= 80
                ? 'bg-emerald-400 text-emerald-400'
                : prog.mastery >= 50
                ? 'bg-amber-400 text-amber-400'
                : 'bg-red-400 text-red-400';

            return (
              <div
                key={topic.id}
                onClick={() => {
                  soundManager.playClick();
                  onNavigateTopic(topic.id);
                }}
                className="p-2.5 rounded-lg bg-slate-900/60 border border-white/[0.04] hover:border-white/[0.12] cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="shrink-0">{topic.icon}</span>
                    <span className="font-semibold text-white truncate">
                      {topic.number}. {topic.title}
                    </span>
                    <span className="text-[10px] text-slate-500 hidden sm:inline shrink-0">
                      ({topic.marks} Marks)
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] font-mono text-slate-400">
                      {prog.correct}/{prog.attempts} Correct
                    </span>
                    <span className={`font-mono font-bold text-xs ${masteryColor.split(' ')[1]}`}>
                      {prog.mastery}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${masteryColor.split(' ')[0]} rounded-full transition-all`}
                    style={{ width: `${prog.mastery}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
