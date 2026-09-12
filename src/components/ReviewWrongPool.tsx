import React from 'react';
import { RotateCcw, Play } from 'lucide-react';
import { AppState, Question } from '../types';
import { ALL_QUESTIONS } from '../data/questions';
import { soundManager } from '../utils/sound';

interface ReviewWrongPoolProps {
  state: AppState;
  onStartReviewDrill: (questions: Question[]) => void;
  onNavigateHome: () => void;
}

export const ReviewWrongPool: React.FC<ReviewWrongPoolProps> = ({
  state,
  onStartReviewDrill,
  onNavigateHome,
}) => {
  const missedQuestions = ALL_QUESTIONS.filter((q) =>
    state.wrongQuestionReviewPool.includes(q.id)
  );

  return (
    <div id="review-wrong-pool-view" className="space-y-4 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-[11px] font-bold mb-1">
            <RotateCcw className="w-3 h-3" />
            <span>Targeted Weakness Rectification</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Mistake Review Pool ({missedQuestions.length})
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Questions you missed during practice. Answering them correctly removes them from this pool!
          </p>
        </div>

        {missedQuestions.length > 0 && (
          <button
            id="btn-start-mistake-drill"
            onClick={() => {
              soundManager.playClick();
              onStartReviewDrill(missedQuestions);
            }}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white font-bold text-xs shadow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 self-start md:self-auto"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Practice All Mistakes</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {missedQuestions.length === 0 ? (
        <div className="rounded-xl border border-white/[0.08] bg-slate-800/80 p-8 sm:p-10 text-center space-y-3">
          <div className="text-4xl">✨</div>
          <h3 className="text-base sm:text-lg font-bold text-white">All Mistakes Cleared!</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You currently have 0 unresolved mistakes in your review pool. Continue with new topics to build further mastery!
          </p>
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigateHome();
            }}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
          >
            Back to Topics
          </button>
        </div>
      ) : (
        /* Mistake Cards List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {missedQuestions.map((q) => (
            <div
              key={q.id}
              className="bg-slate-800/80 border border-white/[0.08] rounded-xl p-3.5 space-y-2.5 flex flex-col justify-between hover:border-red-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-white/[0.06]">
                    {q.instruction}
                  </span>
                  {q.boardReference && (
                    <span className="text-[10px] font-mono text-slate-400">{q.boardReference}</span>
                  )}
                </div>

                <h3 className="text-xs font-semibold text-white mb-2">{q.prompt}</h3>

                <div className="bg-slate-900/80 p-2 rounded-lg border border-white/[0.04] text-xs space-y-0.5">
                  <p className="text-slate-400 text-[11px]">
                    Rule:{' '}
                    <span className="text-red-300 font-medium">{q.explanation.rule}</span>
                  </p>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {q.explanation.whyCorrect}
                  </p>
                </div>
              </div>

              <div className="pt-1 flex justify-end">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onStartReviewDrill([q]);
                  }}
                  className="px-2.5 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition-all"
                >
                  Retry This Question
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
