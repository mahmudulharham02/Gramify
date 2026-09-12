import React, { useState } from 'react';
import { X, Volume2, VolumeX, Download, Upload, Trash2, AlertTriangle, User, ShieldCheck, MessageSquare, RotateCcw, Check, PenTool, Cloud, Activity, Smartphone } from 'lucide-react';
import { AppState } from '../types';
import { soundManager } from '../utils/sound';
import { exportStateAsJSON, importStateFromJSON } from '../utils/storage';
import { clearAllDrillModePreferences } from '../utils/modePreferences';
import { AvatarPickerModal, resolveAvatar } from './AvatarPickerModal';
import { ThemeToggle } from './ThemeToggle';
import { PWAInstallButton } from './PWAInstallButton';
import { isOnboardingAlreadySubmitted } from '../utils/formspree';

interface SettingsModalProps {
  state: AppState;
  onUpdateState: (newState: AppState) => void;
  onResetProgress: () => void;
  onClose: () => void;
  onOpenFeedback?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  state,
  onUpdateState,
  onResetProgress,
  onClose,
  onOpenFeedback,
}) => {
  const [name, setName] = useState(state.user.name);
  const [avatar, setAvatar] = useState(resolveAvatar(state.user.avatar));
  const [showPicker, setShowPicker] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [clearedPreferencesMsg, setClearedPreferencesMsg] = useState(false);
  const [diagRunning, setDiagRunning] = useState(false);
  const [diagStatus, setDiagStatus] = useState<string | null>(null);

  const handleSaveProfile = () => {
    soundManager.playClick();
    onUpdateState({
      ...state,
      user: {
        ...state.user,
        name: name.trim() || 'HSC Candidate',
        avatar,
      },
    });
  };

  const handleToggleSound = () => {
    const nextSound = !state.settings.sound;
    soundManager.setEnabled(nextSound);
    onUpdateState({
      ...state,
      settings: {
        ...state.settings,
        sound: nextSound,
      },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = importStateFromJSON(content);
      if (parsed) {
        soundManager.playLevelUp();
        onUpdateState(parsed);
        onClose();
      } else {
        setImportError('Invalid backup file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      id="modal-settings"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    >
      <div className="w-full max-w-xl rounded-xl border border-white/[0.08] bg-slate-900 flex flex-col max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center text-base border border-white/[0.06]">
              ⚙️
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Settings & Data Management</h2>
              <p className="text-xs text-slate-400">Manage profile, audio, backups, and progress</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {/* Appearance Section */}
          <div className="space-y-2.5 bg-slate-800/80 p-3.5 rounded-xl border border-white/[0.08]">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
              Appearance
            </h3>
            <ThemeToggle id="btn-settings-theme-toggle" variant="switch" />
          </div>

          {/* Profile Customization */}
          <div className="space-y-2.5 bg-slate-800/80 p-3.5 rounded-xl border border-white/[0.08]">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
              Student Profile
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium block">Student Name</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name..."
                  className="flex-1 bg-slate-950 border border-white/[0.08] focus:border-cyan-400 text-slate-200 px-3 py-1.5 rounded-lg text-xs focus:outline-none"
                />
                <button
                  onClick={handleSaveProfile}
                  className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <label className="text-xs text-slate-300 font-medium block">Avatar</label>
                <p className="text-[11px] text-slate-400">Choose your profile emoji</p>
              </div>
              <button
                type="button"
                id="btn-settings-avatar-picker"
                onClick={() => {
                  soundManager.playClick();
                  setShowPicker(true);
                }}
                className="w-12 h-12 rounded-full bg-slate-700/50 border border-white/10 hover:border-cyan-400 hover:bg-slate-700 flex items-center justify-center text-2xl transition-all active:scale-95 cursor-pointer"
                title="Change Avatar"
              >
                {resolveAvatar(avatar)}
              </button>
            </div>
          </div>

          {/* Sound Audio Settings */}
          <div className="space-y-2.5 bg-slate-800/80 p-3.5 rounded-xl border border-white/[0.08]">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
              Audio & Feedback
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {state.settings.sound ? (
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-500" />
                )}
                <div>
                  <h4 className="text-xs font-semibold text-white">Sound Effects & Feedback</h4>
                  <p className="text-[11px] text-slate-400">
                    Plays playCorrect.mp3 on success & playWrong.mp3 on errors
                  </p>
                </div>
              </div>

              <button
                onClick={handleToggleSound}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                  state.settings.sound
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 border border-white/[0.08]'
                }`}
              >
                {state.settings.sound ? 'Enabled' : 'Muted'}
              </button>
            </div>

            {/* Audio Test Controls */}
            <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-mono text-slate-400">Test:</span>
              <button
                type="button"
                id="btn-test-correct-sound"
                onClick={() => {
                  soundManager.playCorrect();
                }}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Nice (Correct)</span>
              </button>
              <button
                type="button"
                id="btn-test-wrong-sound"
                onClick={() => {
                  soundManager.playWrong();
                }}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Bah (Wrong)</span>
              </button>
              <button
                type="button"
                id="btn-run-diagnostics"
                disabled={diagRunning}
                onClick={async () => {
                  setDiagRunning(true);
                  setDiagStatus('Testing audio files...');
                  soundManager.playClick();
                  try {
                    const summary = await soundManager.runAudioDiagnostics();
                    if (summary.failedCount === 0) {
                      setDiagStatus(`Verified (${summary.successCount}/${summary.totalTested} OK)`);
                    } else {
                      setDiagStatus(`${summary.failedCount} Failed (Check Console)`);
                    }
                  } catch {
                    setDiagStatus('Diagnostic error');
                  } finally {
                    setDiagRunning(false);
                  }
                }}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                title="Verify Audio object loading, canplaythrough, error events and codec integrity"
              >
                <Activity className="w-3 h-3" />
                <span>{diagRunning ? 'Testing...' : 'Run Diagnostics'}</span>
              </button>
              {diagStatus && (
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-500/30">
                  {diagStatus}
                </span>
              )}
            </div>
          </div>

          {/* App & Offline Capabilities (PWA) */}
          <div className="space-y-2.5 bg-slate-800/80 p-3.5 rounded-xl border border-white/[0.08]">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                <span>App & Offline Capabilities (PWA)</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gramify is built as an installable Progressive Web App. Service workers cache all 10 syllabus topics, transformation drills, rules, and audio so you can practice completely offline anytime.
            </p>
            <div className="pt-1">
              <PWAInstallButton variant="settings" />
            </div>
          </div>

          {/* Backup Data Export & Import */}
          <div className="space-y-2 bg-slate-800/80 p-3.5 rounded-xl border border-white/[0.08]">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
              Data Backup & Transfer
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export your full progress (XP, streak, wrong questions, badges) to a JSON file to transfer between devices.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                onClick={() => exportStateAsJSON(state)}
                className="flex-1 py-2 px-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON Backup</span>
              </button>

              <label className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-white/[0.08] text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Import JSON Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            {importError && <p className="text-xs text-red-400">{importError}</p>}
          </div>

          {/* About Cloud Sync */}
          <div className="space-y-2 bg-slate-800/80 p-3.5 rounded-xl border border-white/[0.08]">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-cyan-400" />
              <span>About Cloud Sync</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              All progress is currently stored locally on this device. Cloud sync is an upcoming feature, not yet live.
            </p>
          </div>

          {/* Practice Mode Preferences */}
          <div className="space-y-2 bg-slate-800/80 p-3.5 rounded-xl border border-white/[0.08]">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <PenTool className="w-3.5 h-3.5 text-cyan-400" />
                <span>Drill Mode Preferences</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reset remembered practice mode choices (MCQ or Write Mode) across all grammar topics.
            </p>

            <button
              id="btn-settings-clear-mode-preferences"
              type="button"
              onClick={() => {
                soundManager.playClick();
                clearAllDrillModePreferences();
                setClearedPreferencesMsg(true);
                setTimeout(() => setClearedPreferencesMsg(false), 2500);
              }}
              className="py-2 px-3.5 bg-slate-900 hover:bg-slate-700/80 border border-white/[0.08] text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              {clearedPreferencesMsg ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">All topic preferences cleared!</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Clear All Saved Mode Preferences</span>
                </>
              )}
            </button>
          </div>

          {/* Feedback Section */}
          <div className="space-y-2 bg-slate-800/80 p-3.5 rounded-xl border border-white/[0.08]">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span>Feedback</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                {state.lastFeedbackDate
                  ? `Last sent: ${new Date(state.lastFeedbackDate).toLocaleDateString()}`
                  : 'Never sent'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Found a bug or have a suggestion? We would love to hear from you.
            </p>

            <button
              id="btn-settings-send-feedback"
              type="button"
              onClick={() => {
                soundManager.playClick();
                if (onOpenFeedback) {
                  onOpenFeedback();
                }
              }}
              className="py-2 px-4 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Send Feedback</span>
            </button>

            {/* Formspree Onboarding Status */}
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Onboarding Sync (Formspree):</span>
              {isOnboardingAlreadySubmitted(state) ? (
                <span className="flex items-center gap-1 font-semibold text-emerald-400">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Submitted</span>
                </span>
              ) : (
                <span className="text-amber-400 font-medium">Pending first completion</span>
              )}
            </div>
          </div>

          {/* Danger Zone: Reset Progress */}
          <div className="space-y-2 bg-red-950/20 p-3.5 rounded-xl border border-red-500/30">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-red-400">
              Danger Zone
            </h3>

            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-3.5 py-1.5 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset All Progress</span>
              </button>
            ) : (
              <div className="space-y-2.5 bg-red-950/80 p-3 rounded-lg border border-red-500/50">
                <div className="flex items-center gap-2 text-red-300 font-semibold text-xs">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Are you sure? This will wipe all XP, badges, and scores.</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onResetProgress();
                      setShowResetConfirm(false);
                      onClose();
                    }}
                    className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-md shadow transition-colors"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1 bg-slate-800 text-slate-300 font-semibold text-xs rounded-md hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPicker && (
        <AvatarPickerModal
          isOpen={showPicker}
          currentAvatar={avatar}
          onSelect={(selected) => {
            setAvatar(selected);
            onUpdateState({
              ...state,
              user: { ...state.user, avatar: selected },
            });
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
};
