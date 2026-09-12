import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Lightbulb, ExternalLink } from 'lucide-react';
import { getRuleOfTheDay } from '../data/grammarRules';
import { soundManager } from '../utils/sound';

interface RuleOfTheDayCardProps {
  onDrillTopic?: (topicId: string) => void;
}

export const RuleOfTheDayCard: React.FC<RuleOfTheDayCardProps> = ({ onDrillTopic }) => {
  const [expanded, setExpanded] = useState(false);
  const rule = getRuleOfTheDay();
  const dayNumber = new Date().getDate();

  const handleToggle = () => {
    soundManager.playClick();
    setExpanded((prev) => !prev);
  };

  return (
    <div
      id="card-rule-of-the-day"
      className="w-full rounded-xl bg-slate-800/80 border border-white/[0.08] p-3 sm:p-4 transition-all hover:border-cyan-500/30"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-semibold uppercase text-cyan-400 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-500/20">
                Rule of the Day • Day {dayNumber}
              </span>
              <span className="text-[10px] text-slate-400 truncate">
                {rule.topicName}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white truncate">
              {rule.title}
            </h3>
          </div>
        </div>

        <button
          id="btn-expand-daily-rule"
          type="button"
          onClick={handleToggle}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all shrink-0 active:scale-95"
        >
          <span>{expanded ? 'Less' : 'Details'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Primary example always visible */}
      <div className="mt-2.5 px-3 py-2 rounded-lg bg-slate-900/70 border border-white/[0.05] font-mono text-xs text-slate-200">
        <span className="text-slate-400 font-sans text-[11px] mr-2 font-semibold">Example:</span>
        <span>{rule.example1}</span>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-3 space-y-2.5 pt-2.5 border-t border-white/[0.08] animate-fade-in">
          {rule.example2 && (
            <div className="px-3 py-2 rounded-lg bg-slate-900/70 border border-white/[0.05] font-mono text-xs text-slate-200">
              <span className="text-slate-400 font-sans text-[11px] mr-2 font-semibold">Example 2:</span>
              <span>{rule.example2}</span>
            </div>
          )}

          <div className="p-3 rounded-lg bg-slate-900/80 border border-white/[0.06] text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200 font-semibold block mb-0.5">Why This Matters:</strong>
              <span>{rule.tip}</span>
              {rule.boardReference && (
                <span className="block mt-1 text-[10px] text-slate-400 font-medium">
                  Tested in: {rule.boardReference}
                </span>
              )}
            </div>
          </div>

          {onDrillTopic && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onDrillTopic(rule.topicId);
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
              >
                <span>Practice {rule.topicName}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
