import React, { useState } from 'react';
import { LayoutGrid, PenTool, ArrowRight, X, ArrowLeft } from 'lucide-react';
import { DrillMode } from '../types';
import { soundManager } from '../utils/sound';

interface ModeSelectionModalProps {
  isOpen: boolean;
  topicTitle: string;
  subModuleTitle?: string;
  topicId: string;
  subModuleId?: string;
  initialMode?: DrillMode;
  onSelectMode: (mode: DrillMode, remember: boolean) => void;
  onClose: () => void;
}

export const ModeSelectionModal: React.FC<ModeSelectionModalProps> = ({
  isOpen,
  topicTitle,
  subModuleTitle,
  initialMode = 'mcq',
  onSelectMode,
  onClose,
}) => {
  const [selectedMode, setSelectedMode] = useState<DrillMode>(initialMode);
  const [rememberChoice, setRememberChoice] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleStart = () => {
    soundManager.playClick();
    onSelectMode(selectedMode, rememberChoice);
  };

  return (
    <div
      id="modal-mode-selection"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div
        className="w-full max-w-lg bg-[#0f172a] border border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5 text-white relative"
        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(14, 165, 233, 0.15)' }}
      >
        {/* Close / Back Button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider border border-cyan-500/30 font-mono">
              Practice Format
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Choose Practice Mode
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {topicTitle} {subModuleTitle ? `— ${subModuleTitle}` : ''}
          </p>
        </div>

        {/* Two Large Cards: Side by side on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {/* Left Card: MCQ Mode */}
          <div
            id="card-mode-mcq"
            onClick={() => {
              soundManager.playClick();
              setSelectedMode('mcq');
            }}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none ${
              selectedMode === 'mcq'
                ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/20'
                : 'border-slate-800 bg-[#1e293b]/70 hover:border-slate-700 hover:bg-[#1e293b]'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedMode === 'mcq'
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </div>
                {selectedMode === 'mcq' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500 text-slate-950 font-mono">
                    SELECTED
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-white">MCQ Mode</h3>
                <p className="text-xs text-slate-300 font-medium mt-1">
                  Pick from 4 options.
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Best for quick review.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-white/[0.06] flex items-center gap-1.5 text-[11px] text-cyan-300 font-semibold">
              <span>⚡ Fast-paced practice</span>
            </div>
          </div>

          {/* Right Card: Write Mode */}
          <div
            id="card-mode-write"
            onClick={() => {
              soundManager.playClick();
              setSelectedMode('write');
            }}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none ${
              selectedMode === 'write'
                ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/20'
                : 'border-slate-800 bg-[#1e293b]/70 hover:border-slate-700 hover:bg-[#1e293b]'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedMode === 'write'
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <PenTool className="w-5 h-5" />
                </div>
                {selectedMode === 'write' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500 text-slate-950 font-mono">
                    SELECTED
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-white">Write Mode</h3>
                <p className="text-xs text-slate-300 font-medium mt-1">
                  Type your answer.
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Best for board exam prep.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-white/[0.06] flex items-center gap-1.5 text-[11px] text-amber-300 font-semibold">
              <span>✍️ Board exam authentic</span>
            </div>
          </div>
        </div>

        {/* Remember choice toggle */}
        <div className="pt-2 flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-white/[0.06]">
          <label htmlFor="toggle-remember-choice" className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
            <input
              id="toggle-remember-choice"
              type="checkbox"
              checked={rememberChoice}
              onChange={(e) => setRememberChoice(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 bg-slate-800 border-slate-700 cursor-pointer"
            />
            <span className="font-medium">Remember my choice for this topic</span>
          </label>
          <span className="text-[10px] text-slate-400 hidden sm:inline font-mono">
            {selectedMode.toUpperCase()}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            id="btn-confirm-drill-mode"
            type="button"
            disabled={!selectedMode}
            onClick={handleStart}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span>Start</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
