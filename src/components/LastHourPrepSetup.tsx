import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Flame,
  AlertTriangle,
  ChevronRight,
  BookOpen,
  History,
  Crown
} from 'lucide-react';
import { AppState } from '../types';
import { soundManager } from '../utils/sound';
import {
  EXAM_TOPIC_CONFIG,
  getExamHistory,
  LastHourPrepAttempt
} from '../utils/examGenerator';
import { TOPICS_DATA } from '../data/topics';

interface LastHourPrepSetupProps {
  state: AppState;
  onStartExam: () => void;
  onBackToDashboard: () => void;
  onViewPastAttempt?: (attempt: LastHourPrepAttempt) => void;
}

export const LastHourPrepSetup: React.FC<LastHourPrepSetupProps> = ({
  onStartExam,
  onBackToDashboard,
  onViewPastAttempt,
}) => {
  const [history, setHistory] = useState<LastHourPrepAttempt[]>([]);

  useEffect(() => {
    setHistory(getExamHistory());
  }, []);

  // Map topic metadata
  const topicsWithMeta = EXAM_TOPIC_CONFIG.map((conf, index) => {
    const matched = TOPICS_DATA.find((t) => t.id === conf.topicId);
    return {
      ...conf,
      number: index + 1,
      icon: matched?.icon || '📝',
      accentColor: matched?.accentColor || '#38bdf8',
      bengaliTitle: matched?.bengaliTitle || conf.title,
    };
  });

  return (
    <div id="last-hour-prep-setup-container" className="max-w-4xl mx-auto space-y-4 pb-12 animate-fade-in">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onBackToDashboard();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/[0.08] transition-colors text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Crown className="w-3.5 h-3.5" />
          <span>HSC Board Exam Simulator</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="rounded-xl bg-slate-800/80 border border-amber-500/30 p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-red-300 text-[10px] font-bold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span>Full Board Exam Simulator</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Last Hour Prep Test
            </h1>
            <div className="text-xs text-amber-300 flex items-center flex-wrap gap-2 pt-0.5 font-mono">
              <span className="bg-slate-900 px-2 py-0.5 rounded border border-white/[0.08]">60 Marks</span>
              <span className="text-slate-500">•</span>
              <span className="bg-slate-900 px-2 py-0.5 rounded border border-white/[0.08] text-cyan-300">90 Questions</span>
              <span className="text-slate-500">•</span>
              <span className="bg-slate-900 px-2 py-0.5 rounded border border-white/[0.08] text-slate-300">90 Minutes</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              Authentic NCTB Board syllabus exam experience. Complete 90 randomized questions across all 10 grammar items with weighted scoring, real-time countdown, and comprehensive diagnostics.
            </p>
          </div>

          {/* Quick Stat Pill Highlights */}
          <div className="grid grid-cols-3 gap-2 w-full sm:w-auto shrink-0">
            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-white/[0.06] text-center min-w-[70px]">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Marks</span>
              <span className="text-base font-bold text-amber-400 font-mono">60</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-white/[0.06] text-center min-w-[70px]">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Questions</span>
              <span className="text-base font-bold text-cyan-400 font-mono">90</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-white/[0.06] text-center min-w-[70px]">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Duration</span>
              <span className="text-base font-bold text-slate-200 font-mono">90m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="rounded-xl bg-slate-900/90 border border-red-500/30 p-3.5 flex items-start gap-2.5">
        <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400 shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-red-200">Strict Board Rules</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Once started, the timer cannot be paused. Minimizing the browser or switching tabs will <strong className="text-red-300">not</strong> stop the timer. No hints, no bookmarks, and no heart cost.
          </p>
        </div>
      </div>

      {/* Syllabus & Weightage Breakdown */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Full Syllabus Structure (10 Topics · 90 Qs · 60 Marks)</span>
            </h2>
            <p className="text-xs text-slate-400">Official NCTB / BOU HSC English 2nd Paper mark distribution</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-bold hidden sm:inline">60 Marks Total</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {topicsWithMeta.map((item) => (
            <div
              key={item.topicId}
              className="p-2.5 rounded-xl bg-slate-800/60 border border-white/[0.06] flex items-center justify-between hover:border-white/[0.12] transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-sm shrink-0 border border-white/[0.06]">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    {item.number}. {item.title}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {item.count} Questions · {item.perQuestionMark} mark each
                  </div>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <span className="inline-block px-2 py-0.5 rounded-md bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-mono">
                  {item.marks} Marks
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exam History List */}
      {history.length > 0 && (
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
              <History className="w-4 h-4 text-amber-400" />
              <span>Previous Exam Attempts</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">{history.length} Attempt(s)</span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {history.map((att, idx) => {
              const attemptDate = new Date(att.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={att.id || idx}
                  onClick={() => {
                    soundManager.playClick();
                    if (onViewPastAttempt) {
                      onViewPastAttempt(att);
                    }
                  }}
                  className="p-3 rounded-xl bg-slate-800/70 border border-white/[0.08] hover:border-amber-500/50 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/[0.06] flex items-center justify-center font-bold text-xs text-amber-400 font-mono">
                      #{history.length - idx}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          Scored {att.score % 1 === 0 ? att.score : att.score.toFixed(1)} / {att.totalMarks} ({att.percentage}%)
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            att.grade === 'A+'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : att.grade === 'A'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : att.grade === 'B'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          Grade {att.grade}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {attemptDate} • {Math.floor(att.timeTakenSeconds / 60)}m {att.timeTakenSeconds % 60}s taken
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-amber-400 transition-colors font-semibold">
                    <span>Review</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Start Exam Button */}
      <div className="pt-2 sticky bottom-4 z-20">
        <button
          type="button"
          id="btn-start-last-hour-prep"
          onClick={() => {
            soundManager.playClick();
            onStartExam();
          }}
          className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 border border-red-400/30 cursor-pointer select-none active:scale-[0.99] transition-all"
        >
          <Flame className="w-4 h-4 fill-white" />
          <span>START BOARD EXAM (90 MIN)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
