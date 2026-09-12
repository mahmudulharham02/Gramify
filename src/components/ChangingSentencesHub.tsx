import React from 'react';
import {
  ArrowLeftRight,
  MessageSquare,
  PlusCircle,
  Layers,
  BarChart3,
  HelpCircle,
  AlertCircle,
  Terminal,
  BookOpen,
} from 'lucide-react';
import { AppState } from '../types';
import { soundManager } from '../utils/sound';

interface ChangingSentencesHubProps {
  state: AppState;
  onStartDrill: (subtopicId: string, subtopicTitle?: string, parentTopic?: string) => void;
  onOpenRules: () => void;
}

interface SubtopicCardItem {
  id: string;
  title: string;
  marks: string;
  icon: React.ReactNode;
}

export const ChangingSentencesHub: React.FC<ChangingSentencesHubProps> = ({
  onStartDrill,
  onOpenRules,
}) => {
  const subtopics: SubtopicCardItem[] = [
    {
      id: 'voice_change',
      title: 'Voice Change',
      marks: '10M',
      icon: <ArrowLeftRight className="w-7 h-7 text-cyan-400" />,
    },
    {
      id: 'narration',
      title: 'Narration',
      marks: '10M',
      icon: <MessageSquare className="w-7 h-7 text-cyan-400" />,
    },
    {
      id: 'affirmative_negative',
      title: 'Affirmative to Negative',
      marks: '10M',
      icon: <PlusCircle className="w-7 h-7 text-cyan-400" />,
    },
    {
      id: 'simple_compound_complex',
      title: 'Simple Complex Compound',
      marks: '10M',
      icon: <Layers className="w-7 h-7 text-cyan-400" />,
    },
    {
      id: 'degree',
      title: 'Degrees of Comparison',
      marks: '10M',
      icon: <BarChart3 className="w-7 h-7 text-cyan-400" />,
    },
    {
      id: 'assertive_interrogative',
      title: 'Assertive to Interrogative',
      marks: '10M',
      icon: <HelpCircle className="w-7 h-7 text-cyan-400" />,
    },
    {
      id: 'assertive_exclamatory',
      title: 'Assertive to Exclamatory',
      marks: '10M',
      icon: <AlertCircle className="w-7 h-7 text-cyan-400" />,
    },
    {
      id: 'assertive_imperative',
      title: 'Assertive to Imperative',
      marks: '10M',
      icon: <Terminal className="w-7 h-7 text-cyan-400" />,
    },
  ];

  const handleCardClick = (sub: SubtopicCardItem) => {
    soundManager.playClick();
    onStartDrill(sub.id, sub.title, 'changing_sentences');
  };

  return (
    <div id="changing-sentences-hub-view" className="px-3 sm:px-4 max-w-7xl mx-auto pb-4">
      {/* Page Header */}
      <div>
        <h1 className="text-[20px] font-bold text-[#f8fafc] leading-tight truncate">
          Changing Sentences
        </h1>
        <p className="text-[12px] text-[#94a3b8] leading-tight mt-0.5 truncate">
          10-mark board transformation module
        </p>
      </div>

      {/* Rule Matrices button below header */}
      <div className="mt-3">
        <button
          id="btn-open-rules-matrix"
          type="button"
          onClick={() => {
            soundManager.playClick();
            onOpenRules();
          }}
          className="h-8 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-white/[0.08] hover:border-cyan-500/40 text-cyan-400 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>Rule Matrices</span>
        </button>
      </div>

      {/* 8 Compact Sub-Category Cards: 2 cols on mobile, 4 cols on desktop, 8px gap */}
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2">
        {subtopics.map((sub) => (
          <div
            key={sub.id}
            id={`card-changing-${sub.id}`}
            role="button"
            tabIndex={0}
            onClick={() => handleCardClick(sub)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick(sub);
              }
            }}
            className="h-[88px] p-3 rounded-[12px] bg-[#1e293b] border border-white/[0.08] hover:border-cyan-500/40 hover:bg-slate-800/80 active:scale-[0.98] transition-all flex flex-col justify-between cursor-pointer select-none group"
          >
            {/* Top row: Small cyan icon (28px) at top-left, tiny marks pill at top-right */}
            <div className="flex items-center justify-between">
              <div className="text-cyan-400 shrink-0">
                {sub.icon}
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 leading-none">
                {sub.marks}
              </span>
            </div>

            {/* Bottom row: Topic name as a single line, 14px semibold white, truncated */}
            <h2
              className="text-[14px] font-semibold text-[#f8fafc] truncate leading-tight w-full"
              title={sub.title}
            >
              {sub.title}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};
