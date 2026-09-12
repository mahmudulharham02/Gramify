import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Zap,
  CheckCircle2,
  FileText,
  Crown,
  Sliders,
  HelpCircle,
  Hash,
  Compass,
  Sparkles,
  Layers,
  Shuffle,
} from 'lucide-react';
import { AppState } from '../types';
import { TOPICS_DATA } from '../data/topics';
import { ALL_QUESTIONS } from '../data/questions';
import { soundManager } from '../utils/sound';

interface TopicsLibraryProps {
  state: AppState;
  onSelectTopic: (topicId: string, subtopicId?: string) => void;
  onOpenRules: () => void;
}

// Shortened display titles for compact list presentation
const SHORT_TITLES: Record<string, string> = {
  right_form_of_verbs: 'Right Form of Verbs',
  articles: 'Articles',
  preposition: 'Prepositions',
  completing_sentences: 'Completing Sentences',
  connectors: 'Sentence Connectors',
  synonyms_antonyms: 'Synonyms & Antonyms',
  punctuation: 'Punctuation',
  modifiers: 'Modifiers',
  changing_sentences: 'Changing Sentences',
  tag_questions_and_special: 'Tag Questions',
};

export function getTopicIcon(topicId: string, className = 'w-6 h-6 text-cyan-400') {
  switch (topicId) {
    case 'changing_sentences':
      return <Crown className={className} />;
    case 'articles':
      return <BookOpen className={className} />;
    case 'preposition':
      return <Compass className={className} />;
    case 'completing_sentences':
      return <Sparkles className={className} />;
    case 'right_form_of_verbs':
      return <Zap className={className} />;
    case 'connectors':
      return <Layers className={className} />;
    case 'synonyms_antonyms':
      return <Shuffle className={className} />;
    case 'punctuation':
      return <Hash className={className} />;
    case 'modifiers':
      return <Sliders className={className} />;
    case 'tag_questions_and_special':
      return <HelpCircle className={className} />;
    default:
      return <BookOpen className={className} />;
  }
}

export const TopicsLibrary: React.FC<TopicsLibraryProps> = ({
  state,
  onSelectTopic,
  onOpenRules,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'changing' | 'core' | 'vocab'>('all');

  const filteredTopics = useMemo(() => {
    return TOPICS_DATA.filter((topic) => {
      // Filter tab
      if (activeFilter === 'changing' && topic.id !== 'changing_sentences') return false;
      if (
        activeFilter === 'core' &&
        !['right_form_of_verbs', 'articles', 'preposition', 'completing_sentences', 'connectors'].includes(
          topic.id
        )
      ) {
        return false;
      }
      if (
        activeFilter === 'vocab' &&
        !['synonyms_antonyms', 'modifiers', 'punctuation', 'tag_questions_and_special'].includes(topic.id)
      ) {
        return false;
      }

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const shortTitle = SHORT_TITLES[topic.id] || topic.title;
      const matchTitle = topic.title.toLowerCase().includes(q) || shortTitle.toLowerCase().includes(q);
      const matchDesc = topic.description.toLowerCase().includes(q);
      const matchSub = topic.subtopics.some(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.rulesSummary.some((r) => r.toLowerCase().includes(q))
      );
      return matchTitle || matchDesc || matchSub;
    });
  }, [searchQuery, activeFilter]);

  return (
    <div id="topics-library-view" className="space-y-5 pb-16 px-1 sm:px-0 max-w-7xl mx-auto">
      {/* Header & Global Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <span>HSC Grammar Topics</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Complete 60-mark syllabus breakdown for English 2nd Paper.
          </p>
        </div>

        <button
          id="btn-rules-guide-link"
          type="button"
          onClick={() => {
            soundManager.playClick();
            onOpenRules();
          }}
          className="self-start md:self-auto px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/[0.08] text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>Rules Handbook</span>
        </button>
      </div>

      {/* Search Input & Category Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="input-search-topics"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rules, verbs, voice, narration, lest..."
            className="w-full bg-[#1e293b] border border-white/[0.08] focus:border-cyan-400 text-slate-200 pl-9 pr-8 py-2 rounded-lg text-xs sm:text-sm focus:outline-none transition-colors placeholder:text-slate-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Topics' },
            { id: 'changing', label: 'Transform (10M)' },
            { id: 'core', label: 'Verbs & Clauses' },
            { id: 'vocab', label: 'Modifiers & Vocab' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                soundManager.playClick();
                setActiveFilter(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'bg-[#1e293b] text-slate-300 hover:bg-slate-800 border border-white/[0.08]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Grid: 2 columns on tablet/desktop, 8px gap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {filteredTopics.map((topic) => {
          const prog = state.topicProgress[topic.id] || {
            unlocked: true,
            attempts: 0,
            correct: 0,
            wrong: 0,
            mastery: 0,
          };

          const attempts = prog.attempts || 0;
          const percent = prog.mastery || (attempts > 0 ? Math.round((prog.correct / attempts) * 100) : 0);
          const isMastered = attempts >= 5 && percent >= 80;
          const isInProgress = attempts > 0 && !isMastered;

          const questionCount = ALL_QUESTIONS.filter((q) => q.topicId === topic.id).length || 50;
          const shortTitle = SHORT_TITLES[topic.id] || topic.title;

          return (
            <div
              key={topic.id}
              id={`topic-item-${topic.id}`}
              onClick={() => {
                soundManager.playClick();
                onSelectTopic(topic.id);
              }}
              className="h-[116px] p-3 rounded-xl bg-[#1e293b] border border-white/[0.08] hover:border-cyan-500/40 hover:bg-slate-800/80 transition-all flex flex-col justify-between cursor-pointer select-none group"
            >
              {/* Top micro row: 10px font, uppercase, muted slate */}
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-semibold text-slate-400 font-mono leading-none">
                <span>Topic {topic.number} of 10</span>
                <span>{questionCount} MCQs</span>
                <span className="text-cyan-400">{topic.marks} Marks</span>
              </div>

              {/* Main content row: 36x36 icon + nowrap title + 1-line description */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 shrink-0 flex items-center justify-center text-cyan-400">
                  {getTopicIcon(topic.id, 'w-6 h-6 text-cyan-400')}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold text-white truncate leading-tight">
                    {shortTitle}
                  </h2>
                  <p className="text-xs text-slate-400 truncate mt-0.5 leading-tight">
                    {topic.description}
                  </p>
                </div>
              </div>

              {/* Bottom action row: Status badge on left + compact button on right */}
              <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.06]">
                <div>
                  {isMastered ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-mono">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Mastered ({percent}%)
                    </span>
                  ) : isInProgress ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      In Progress ({percent}%)
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-white/[0.08] font-mono">
                      Not Started
                    </span>
                  )}
                </div>

                <button
                  id={`btn-launch-topic-${topic.id}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundManager.playClick();
                    onSelectTopic(topic.id);
                  }}
                  className="h-8 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors shadow-sm active:scale-95 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Start</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
