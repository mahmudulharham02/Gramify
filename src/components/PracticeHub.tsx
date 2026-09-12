import React, { useState } from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { AppState, VoiceSubModuleId, NarrationSubModuleId } from '../types';
import { VOICE_CHANGE_QUESTIONS } from '../data/voiceChangeQuestions';
import { NARRATION_QUESTIONS } from '../data/narrationQuestions';
import { soundManager } from '../utils/sound';

interface PracticeHubProps {
  state: AppState;
  onStartVoiceDrill: (subModule: VoiceSubModuleId) => void;
  onStartNarrationDrill: (subModule: NarrationSubModuleId) => void;
  onOpenRules: () => void;
}

export const PracticeHub: React.FC<PracticeHubProps> = ({
  onStartVoiceDrill,
  onStartNarrationDrill,
  onOpenRules,
}) => {
  const [activeTab, setActiveTab] = useState<'voice' | 'narration'>('voice');

  // Voice submodules
  const voiceSubModules: { id: VoiceSubModuleId; name: string }[] = [
    { id: 'simple_present', name: 'Simple Present' },
    { id: 'present_continuous', name: 'Present Continuous' },
    { id: 'present_perfect', name: 'Present Perfect' },
    { id: 'simple_past', name: 'Simple Past' },
    { id: 'past_continuous', name: 'Past Continuous' },
    { id: 'past_perfect', name: 'Past Perfect' },
    { id: 'simple_future', name: 'Simple Future' },
    { id: 'future_perfect', name: 'Future Perfect' },
    { id: 'modals', name: 'Modal Verbs' },
    { id: 'imperatives', name: 'Imperative Sentences' },
    { id: 'interrogatives', name: 'Interrogatives' },
    { id: 'negatives', name: 'Negatives & No Passive' },
  ];

  // Narration submodules
  const narrationSubModules: { id: NarrationSubModuleId; name: string }[] = [
    { id: 'assertive', name: 'Assertive Sentences' },
    { id: 'interrogative', name: 'Interrogative Sentences' },
    { id: 'imperative', name: 'Imperative Sentences' },
    { id: 'exclamatory', name: 'Exclamatory Sentences' },
    { id: 'optative', name: 'Optative Sentences' },
    { id: 'mixed', name: 'Mixed Board Review' },
  ];

  return (
    <div id="view-practice-hub" className="px-3 sm:px-4 max-w-7xl mx-auto pb-16">
      {/* Top Micro Row + Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] font-mono">
            CORE 10-MARK MASTERY
          </span>
          <span className="text-[10px] text-[#94a3b8] font-mono">•</span>
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#94a3b8]">
            Official Board Drills
          </span>
        </div>
        <h1 className="text-[20px] font-bold text-[#f8fafc] leading-tight truncate mt-0.5">
          Grammar Drill Center
        </h1>
      </div>

      {/* Rules Cheat Sheet Button */}
      <div className="mt-3">
        <button
          id="btn-open-rules-cheat-sheet"
          type="button"
          onClick={() => {
            soundManager.playClick();
            onOpenRules();
          }}
          className="h-[40px] px-4 rounded-lg bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer select-none"
        >
          <BookOpen className="w-4 h-4 text-white" />
          <span>Rules Cheat Sheet</span>
        </button>
      </div>

      {/* Tab Bar (Voice Change / Narration) */}
      <div className="mt-4 flex items-center gap-2">
        <button
          id="tab-practice-voice"
          type="button"
          onClick={() => {
            soundManager.playClick();
            setActiveTab('voice');
          }}
          className={`h-[40px] px-5 rounded-full text-[14px] font-semibold transition-all cursor-pointer select-none flex items-center justify-center ${
            activeTab === 'voice'
              ? 'bg-[#0ea5e9] text-white'
              : 'bg-transparent text-[#94a3b8] border border-white/10 hover:text-[#f8fafc]'
          }`}
        >
          Voice Change (12)
        </button>

        <button
          id="tab-practice-narration"
          type="button"
          onClick={() => {
            soundManager.playClick();
            setActiveTab('narration');
          }}
          className={`h-[40px] px-5 rounded-full text-[14px] font-semibold transition-all cursor-pointer select-none flex items-center justify-center ${
            activeTab === 'narration'
              ? 'bg-[#0ea5e9] text-white'
              : 'bg-transparent text-[#94a3b8] border border-white/10 hover:text-[#f8fafc]'
          }`}
        >
          Narration (6)
        </button>
      </div>

      {/* Sub-Module Cards: 1 column on mobile, 2 columns on desktop, gap 8px (gap-2) */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
        {activeTab === 'voice' &&
          voiceSubModules.map((sub, index) => {
            const qCount = VOICE_CHANGE_QUESTIONS.filter((q) => q.subModule === sub.id).length;

            return (
              <div
                key={sub.id}
                id={`card-voice-${sub.id}`}
                onClick={() => {
                  soundManager.playClick();
                  onStartVoiceDrill(sub.id);
                }}
                className="h-[76px] p-3 rounded-[12px] bg-[#1e293b] border border-white/[0.08] hover:border-[#0ea5e9]/30 transition-all flex items-center justify-between gap-3 select-none cursor-pointer group"
              >
                <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                  {/* 1. Top micro row */}
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#0ea5e9]/10 text-[#0ea5e9] border border-[#0ea5e9]/20 font-mono">
                      Part {index + 1}
                    </span>
                    <span className="text-[10px] text-[#94a3b8] font-mono">
                      {qCount > 0 ? `${qCount} Qs` : 'Curriculum Pool'}
                    </span>
                  </div>

                  {/* 2. Title: 16px semibold white, single line */}
                  <h3 className="text-[16px] font-semibold text-[#f8fafc] truncate leading-tight">
                    {sub.name}
                  </h3>
                </div>

                {/* 4. Compact Drill button (36px tall, cyan bg, white text, arrow icon) */}
                <button
                  id={`btn-drill-voice-${sub.id}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundManager.playClick();
                    onStartVoiceDrill(sub.id);
                  }}
                  className="h-[36px] px-3.5 rounded-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all active:scale-95 cursor-pointer shadow-sm"
                >
                  <span>Drill</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

        {activeTab === 'narration' &&
          narrationSubModules.map((sub, index) => {
            const qCount = NARRATION_QUESTIONS.filter((q) => q.subModule === sub.id).length;

            return (
              <div
                key={sub.id}
                id={`card-narration-${sub.id}`}
                onClick={() => {
                  soundManager.playClick();
                  onStartNarrationDrill(sub.id);
                }}
                className="h-[76px] p-3 rounded-[12px] bg-[#1e293b] border border-white/[0.08] hover:border-[#0ea5e9]/30 transition-all flex items-center justify-between gap-3 select-none cursor-pointer group"
              >
                <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                  {/* 1. Top micro row */}
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#0ea5e9]/10 text-[#0ea5e9] border border-[#0ea5e9]/20 font-mono">
                      Part {index + 1}
                    </span>
                    <span className="text-[10px] text-[#94a3b8] font-mono">
                      {qCount > 0 ? `${qCount} Qs` : 'Curriculum Pool'}
                    </span>
                  </div>

                  {/* 2. Title: 16px semibold white, single line */}
                  <h3 className="text-[16px] font-semibold text-[#f8fafc] truncate leading-tight">
                    {sub.name}
                  </h3>
                </div>

                {/* 4. Compact Drill button (36px tall, cyan bg, white text, arrow icon) */}
                <button
                  id={`btn-drill-narration-${sub.id}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundManager.playClick();
                    onStartNarrationDrill(sub.id);
                  }}
                  className="h-[36px] px-3.5 rounded-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all active:scale-95 cursor-pointer shadow-sm"
                >
                  <span>Drill</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
};
