import React from 'react';
import { Bookmark, Play, Trash2 } from 'lucide-react';
import { AppState, Question } from '../types';
import { ALL_QUESTIONS } from '../data/questions';
import { soundManager } from '../utils/sound';

interface BookmarksViewProps {
  state: AppState;
  onStartBookmarkDrill: (questions: Question[]) => void;
  onToggleBookmark: (questionId: string) => void;
  onNavigateHome: () => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  state,
  onStartBookmarkDrill,
  onToggleBookmark,
  onNavigateHome,
}) => {
  const bookmarkedQuestions = ALL_QUESTIONS.filter((q) =>
    state.bookmarkedQuestionIds.includes(q.id)
  );

  return (
    <div id="bookmarks-view" className="space-y-4 pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold mb-1">
            <Bookmark className="w-3 h-3 fill-amber-400" />
            <span>Saved Questions Library</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Bookmarked Questions ({bookmarkedQuestions.length})
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Questions saved for rapid revision before exams and tests.
          </p>
        </div>

        {bookmarkedQuestions.length > 0 && (
          <button
            id="btn-practice-all-bookmarks"
            onClick={() => {
              soundManager.playClick();
              onStartBookmarkDrill(bookmarkedQuestions);
            }}
            className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 self-start md:self-auto"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>Practice All Saved</span>
          </button>
        )}
      </div>

      {bookmarkedQuestions.length === 0 ? (
        <div className="rounded-xl border border-white/[0.08] bg-slate-800/80 p-8 sm:p-10 text-center space-y-3">
          <div className="text-4xl">🔖</div>
          <h3 className="text-base sm:text-lg font-bold text-white">No Bookmarked Questions</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click the bookmark icon on any question during drills to save it here for targeted review.
          </p>
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigateHome();
            }}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
          >
            Explore Topics
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {bookmarkedQuestions.map((q) => (
            <div
              key={q.id}
              className="bg-slate-800/80 border border-white/[0.08] rounded-xl p-3.5 space-y-2.5 flex flex-col justify-between hover:border-amber-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-white/[0.06]">
                    {q.instruction}
                  </span>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onToggleBookmark(q.id);
                    }}
                    title="Remove from bookmarks"
                    className="p-1 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-700/60 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-xs font-semibold text-white mb-2">{q.prompt}</h3>

                <div className="bg-slate-900/80 p-2 rounded-lg border border-white/[0.04] text-xs space-y-0.5">
                  <p className="text-slate-400 text-[11px]">
                    Rule:{' '}
                    <span className="text-amber-300 font-medium">{q.explanation.rule}</span>
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
                    onStartBookmarkDrill([q]);
                  }}
                  className="px-2.5 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition-all"
                >
                  Practice Question
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
