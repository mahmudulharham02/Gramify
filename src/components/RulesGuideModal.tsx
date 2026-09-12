import React, { useState } from 'react';
import { X, Search, BookOpen, Sparkles, Check, ChevronRight, Layers } from 'lucide-react';
import { RULES_GUIDE_DATA } from '../data/rulesGuide';
import { soundManager } from '../utils/sound';

interface RulesGuideModalProps {
  onClose: () => void;
}

export const RulesGuideModal: React.FC<RulesGuideModalProps> = ({ onClose }) => {
  const [selectedSectionId, setSelectedSectionId] = useState(RULES_GUIDE_DATA[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const activeSection =
    RULES_GUIDE_DATA.find((s) => s.id === selectedSectionId) || RULES_GUIDE_DATA[0];

  const filteredRulesList = activeSection.rulesList?.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.formula.toLowerCase().includes(q) ||
      r.example.original.toLowerCase().includes(q) ||
      r.example.transformed.toLowerCase().includes(q)
    );
  });

  return (
    <div
      id="modal-rules-guide"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
    >
      <div className="glass-panel w-full max-w-5xl h-[90vh] rounded-2xl border border-white/[0.08] bg-[#0f172a] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-base shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-white truncate">
                Grammar Rules & Formula Handbook
              </h2>
              <p className="text-[11px] text-slate-400 truncate">
                Standard transformation matrices and rules reference
              </p>
            </div>
          </div>

          <button
            id="btn-close-rules"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs & Search */}
        <div className="px-4 py-2.5 bg-slate-900/80 border-b border-white/[0.08] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {RULES_GUIDE_DATA.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedSectionId(sec.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSectionId === sec.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-white/[0.04]'
                }`}
              >
                {sec.title.split('(')[0]}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-60 shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rules..."
              className="w-full bg-slate-950/80 border border-slate-700/80 text-slate-200 pl-8 pr-3 py-1.5 rounded-lg text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Section Banner */}
          <div className="bg-slate-800/70 border border-white/[0.08] p-3.5 sm:p-4 rounded-xl">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                {activeSection.badge}
              </span>
              <span className="text-xs text-slate-400 font-medium">{activeSection.bengaliTitle}</span>
            </div>
            <h3 className="text-base font-bold text-white">{activeSection.title}</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {activeSection.description}
            </p>
          </div>

          {/* Formula Table (If available) */}
          {activeSection.formulaTable && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Transformation Formula Table</span>
              </h4>
              <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-slate-950/60">
                <table className="w-full text-left text-xs border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-900 border-b border-white/[0.08] text-slate-300 font-semibold">
                      {activeSection.formulaTable.header.map((h, i) => (
                        <th key={i} className="px-3.5 py-2.5">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] text-slate-300">
                    {activeSection.formulaTable.rows.map((row, rIdx) => (
                      <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-slate-900/30' : 'bg-transparent'}>
                        <td className="px-3.5 py-2.5 font-medium text-white">{row[0]}</td>
                        <td className="px-3.5 py-2.5 font-mono text-cyan-300">{row[1]}</td>
                        <td className="px-3.5 py-2.5 font-mono text-emerald-300">{row[2]}</td>
                        <td className="px-3.5 py-2.5 text-slate-400">{row[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Rules List (If available e.g. 16 Affirmative/Negative Rules) */}
          {activeSection.rulesList && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Specific Rule Breakdown ({filteredRulesList?.length || 0} Rules)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredRulesList?.map((rule) => (
                  <div
                    key={rule.ruleNo}
                    className="bg-slate-800/60 border border-white/[0.08] rounded-xl p-3.5 space-y-2 hover:border-cyan-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/20">
                        Rule {rule.ruleNo}
                      </span>
                      <span className="text-xs font-semibold text-slate-200 truncate">{rule.title}</span>
                    </div>

                    <div className="bg-slate-950/70 p-2 rounded-lg border border-white/[0.05] font-mono text-xs text-cyan-200">
                      {rule.formula}
                    </div>

                    <div className="text-xs text-slate-300 space-y-1 pt-1.5 border-t border-white/[0.06]">
                      <p>
                        <span className="text-slate-400 font-medium">Affirmative:</span>{' '}
                        {rule.example.original}
                      </p>
                      <p>
                        <span className="text-slate-400 font-medium">Negative:</span>{' '}
                        <span className="text-white font-medium">{rule.example.transformed}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Takeaways & Board Tips */}
          {activeSection.keyTakeaways && (
            <div className="bg-slate-800/60 border border-white/[0.08] rounded-xl p-3.5 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Key Exam Takeaways & Warnings
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeSection.keyTakeaways.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
