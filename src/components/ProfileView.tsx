import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Upload,
  Trophy,
  Award,
  Flame,
  Diamond,
  Zap,
  Target,
  Clock,
  ChevronRight,
  Sparkles,
  Lock,
  Star,
  Crown,
  CheckCircle2,
  Edit2,
  Info,
  X,
  Cloud,
  LogIn,
  LogOut,
  Building2
} from 'lucide-react';
import { AppState, TopicProgressItem, Badge } from '../types';
import { ALL_BADGES } from '../data/badges';
import { TOPICS_DATA } from '../data/topics';
import { soundManager } from '../utils/sound';
import { getMasteryTier } from '../utils/storage';
import { getExamHistory, LastHourPrepAttempt } from '../utils/examGenerator';
import { getDashboardTopicIcon } from './HomeDashboard';
import { AvatarPickerModal, resolveAvatar } from './AvatarPickerModal';
import { useAuth } from '../context/AuthContext';
import { maskEmail, formatLastSynced, syncProfileToSupabase } from '../utils/syncEngine';
import { LoginModal } from './LoginModal';

interface ProfileViewProps {
  state: AppState;
  onEditProfile: () => void;
  onExportBackup: () => void;
  onImportBackup: (jsonStr: string) => void;
  onOpenCertificate: () => void;
  onNavigateTopic?: (topicId: string) => void;
  onStartExam?: () => void;
  onToast?: (msg: string) => void;
  onUpdateAvatar?: (avatar: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  state,
  onEditProfile,
  onExportBackup,
  onImportBackup,
  onOpenCertificate,
  onNavigateTopic,
  onStartExam,
  onToast,
  onUpdateAvatar,
}) => {
  const { user, isLoggedIn, logout, lastSynced } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [copiedRoll, setCopiedRoll] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const handleSaveAvatar = (newAvatar: string) => {
    if (onUpdateAvatar) {
      onUpdateAvatar(newAvatar);
    }
    if (isLoggedIn && user) {
      syncProfileToSupabase({ ...state.user, avatar: newAvatar }, user);
    }
    setShowPicker(false);
    if (onToast) {
      onToast('Avatar updated!');
    }
  };

  const examHistory: LastHourPrepAttempt[] = getExamHistory();
  const latestExam = examHistory.length > 0 ? examHistory[0] : null;

  const handleCopyRoll = () => {
    const rollToCopy = state.user.roll || state.user.roll_id;
    if (!rollToCopy) return;
    soundManager.playClick();
    navigator.clipboard.writeText(rollToCopy);
    setCopiedRoll(true);
    setTimeout(() => setCopiedRoll(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportBackup(content);
        setImportStatus('Backup loaded successfully!');
        soundManager.playLevelUp();
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  const topicProgressArray = Object.values(state.topicProgress) as TopicProgressItem[];
  const totalCorrect = topicProgressArray.reduce((acc, curr) => acc + (curr.correct || 0), 0);
  const totalAttempts = topicProgressArray.reduce((acc, curr) => acc + (curr.attempts || 0), 0);
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const lastBackupFormatted = state.lastBackupAt
    ? new Date(state.lastBackupAt).toLocaleString()
    : 'Never (Export backup recommended!)';

  return (
    <div id="view-student-profile" className="space-y-4 max-w-5xl mx-auto pb-20 animate-fade-in">
      {/* Cloud Sync Status / Prompt Card */}
      {isLoggedIn ? (
        <div
          id="card-cloud-auth-active"
          className="rounded-xl p-4 sm:p-5 border border-white/[0.08] bg-slate-800/80 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-semibold text-white">
                  Logged in as <span className="font-mono text-cyan-300">{maskEmail(user?.email)}</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Cloud Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Last synced:{' '}
                <span className="text-slate-300 font-medium">
                  {formatLastSynced(lastSynced || state.lastSyncedAt)}
                </span>
              </p>
            </div>
          </div>

          <button
            id="btn-profile-logout"
            type="button"
            onClick={async () => {
              soundManager.playClick();
              await logout();
              onToast?.('Logged out. Switched to local mode.');
            }}
            className="px-3.5 py-2 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-500 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95 shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      ) : (
        <div
          id="card-cloud-auth-prompt"
          className="rounded-xl p-4 sm:p-5 border border-cyan-500/30 bg-[#1e293b] shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 text-[#0ea5e9] flex items-center justify-center shrink-0">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">Save Progress to Cloud</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Optional. Login with email to backup your data.
              </p>
            </div>
          </div>

          <button
            id="btn-profile-login"
            type="button"
            onClick={() => {
              soundManager.playClick();
              setShowLoginModal(true);
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs sm:text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <LogIn className="w-4 h-4" />
            <span>Login with Email</span>
          </button>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="rounded-xl p-4 sm:p-5 border border-white/[0.08] bg-slate-800/80 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {/* Avatar Trigger Button */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative">
              <button
                id="btn-profile-avatar-picker"
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setShowPicker(true);
                }}
                className="
                  w-20 h-20 rounded-full
                  bg-slate-700/50 border-2 border-white/10
                  hover:border-cyan-400 hover:bg-slate-700
                  flex items-center justify-center
                  text-4xl
                  transition-all active:scale-95 cursor-pointer
                "
                title="Tap to change avatar"
              >
                {resolveAvatar(state.user.avatar)}
              </button>
              <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md bg-cyan-500 text-slate-950 text-[10px] font-bold shadow pointer-events-none">
                Lvl {state.level}
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-1">Tap to change</p>
          </div>

          {/* Profile Info */}
          <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-white truncate">
                  {state.user.name || 'HSC Aspirant'}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-0.5">
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 text-xs font-semibold font-mono border border-cyan-500/20">
                    {state.user.title || 'Apprentice 🐣'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {state.user.group || 'Science'} • {state.user.board || 'Dhaka'} Board
                  </span>
                </div>
              </div>

              <button
                id="btn-edit-student-profile"
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onEditProfile();
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/[0.08] flex items-center justify-center gap-1.5 transition-colors self-center sm:self-auto shadow-sm active:scale-95 shrink-0"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Roll Number, College / Institute & Gender */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
              {(state.user.roll || state.user.roll_id) ? (
                <div id="profile-user-roll" className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400 font-mono">Roll:</span>
                  <span className="text-xs font-mono font-semibold text-white bg-slate-900/90 px-2 py-0.5 rounded-md border border-white/[0.06]">
                    {state.user.roll || state.user.roll_id}
                  </span>
                  <button
                    id="btn-copy-roll"
                    type="button"
                    onClick={handleCopyRoll}
                    className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    title="Copy Roll ID"
                  >
                    {copiedRoll ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              ) : (
                <div id="profile-user-roll" className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900/90 border border-white/[0.06]">
                  <span className="text-xs text-slate-400 font-mono">Roll:</span>
                  <span className="text-xs text-slate-500 italic">Not set</span>
                </div>
              )}

              {(state.user.college_name || state.user.institute) ? (
                <div
                  id="profile-user-institute"
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900/90 border border-white/[0.06] max-w-[240px] sm:max-w-[320px]"
                  title={state.user.college_name || state.user.institute || ''}
                >
                  <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-xs text-slate-200 truncate font-medium">
                    {state.user.college_name || state.user.institute}
                  </span>
                </div>
              ) : (
                <div
                  id="profile-user-institute"
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900/90 border border-white/[0.06]"
                >
                  <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="text-xs text-slate-400">College:</span>
                  <span className="text-xs text-slate-500 italic">Not set</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900/90 border border-white/[0.06]">
                <span className="text-xs">
                  {state.user.gender === 'male' ? '🚹' : state.user.gender === 'female' ? '🚺' : '👤'}
                </span>
                <span className="text-xs text-slate-300">
                  {state.user.gender === 'male' ? 'Male' : state.user.gender === 'female' ? 'Female' : 'Not set'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 1. Enhanced Top Stats Row (5 stats in responsive grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-4 mt-4 border-t border-white/[0.08]">
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-white/[0.04] text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Drills</span>
            <span className="text-sm sm:text-base font-bold text-cyan-400">{totalAttempts} Qs</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-white/[0.04] text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Accuracy</span>
            <span className="text-sm sm:text-base font-bold text-emerald-400">{overallAccuracy}%</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-white/[0.04] text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total XP</span>
            <span className="text-sm sm:text-base font-bold text-cyan-400">{state.xp}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-white/[0.04] text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Streak</span>
            <span className="text-sm sm:text-base font-bold text-amber-400 flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{state.streak} d</span>
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-white/[0.04] text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Diamonds</span>
            <span className="text-sm sm:text-base font-bold text-cyan-300 flex items-center justify-center gap-1">
              <Diamond className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
              <span>{state.diamonds}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Topic Mastery Grid (10 small cards with Tiered Mastery Visuals) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
              <Target className="w-4 h-4 text-cyan-400" />
              <span>10-Topic Mastery Breakdown</span>
            </h2>
            <p className="text-xs text-slate-400">Track your learning progress across all board grammar items</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {TOPICS_DATA.map((topic) => {
            const prog = state.topicProgress[topic.id] || {
              unlocked: true,
              attempts: 0,
              correct: 0,
              wrong: 0,
              mastery: 0,
            };

            const mastery = getMasteryTier(prog);
            const topicAccuracy = prog.attempts > 0 ? Math.round((prog.correct / prog.attempts) * 100) : 0;

            return (
              <div
                key={topic.id}
                className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                  mastery.isMastered
                    ? 'bg-slate-800/80 border-amber-500/40 shadow-sm'
                    : 'bg-slate-800/60 border-white/[0.08] hover:border-cyan-500/30'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1 rounded-md bg-slate-900 border border-white/[0.06] flex items-center justify-center shrink-0">
                        {getDashboardTopicIcon(topic.id)}
                      </div>
                      <h3 className="font-semibold text-xs text-white truncate">
                        {topic.title}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {topic.marks}M
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="flex items-center gap-1 font-medium">
                      {mastery.hasLock && <Lock className="w-2.5 h-2.5 text-slate-400" />}
                      {mastery.hasStar && <Star className="w-2.5 h-2.5 text-cyan-400 fill-cyan-400/30" />}
                      {mastery.hasCrown && <Crown className="w-2.5 h-2.5 text-amber-400 fill-amber-400/30" />}
                      {mastery.hasCheck && <CheckCircle2 className="w-2.5 h-2.5 text-amber-400" />}
                      <span className={mastery.textColor}>{mastery.label}</span>
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {prog.attempts > 0 ? `${topicAccuracy}% (${prog.attempts} Qs)` : '0 attempts'}
                    </span>
                  </div>

                  {mastery.tier > 0 && (
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/[0.04]">
                      <div
                        className={`h-full ${mastery.barColor} rounded-full`}
                        style={{ width: `${mastery.percent}%` }}
                      />
                    </div>
                  )}
                </div>

                {onNavigateTopic && (
                  <div className="mt-2.5 pt-1.5 border-t border-white/[0.06] flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        onNavigateTopic(topic.id);
                      }}
                      className="px-2 py-0.5 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[10px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>Practice</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Last Hour Prep Exam History Card */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Board Exam Simulator History</span>
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">60 Marks · 90 Mins</span>
        </div>

        {latestExam ? (
          <div className="rounded-xl p-4 border border-amber-500/30 bg-slate-800/80 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 text-xs font-semibold font-mono border border-amber-500/30">
                    Latest Mock: {latestExam.score} / {latestExam.totalMarks} Marks
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    Grade: {latestExam.grade} ({latestExam.percentage}%)
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-white">
                  Last Exam: {new Date(latestExam.date).toLocaleDateString()} at {new Date(latestExam.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </h3>
                <p className="text-xs text-slate-300">
                  {latestExam.rawCorrectCount} of {latestExam.totalQuestions} questions correct • Time taken: {Math.floor(latestExam.timeTakenSeconds / 60)}m {latestExam.timeTakenSeconds % 60}s
                </p>
              </div>

              {onStartExam && (
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    onStartExam();
                  }}
                  className="px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5 transition-transform hover:scale-102 active:scale-98 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Take Another Mock</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl p-4 border border-white/[0.08] bg-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-200">
                {state.level >= 2
                  ? 'Ready to take your first Board Mock Exam!'
                  : 'Board Exam Simulator Unlocks at Level 2'}
              </h3>
              <p className="text-xs text-slate-400">
                {state.level >= 2
                  ? 'Test your full 60-mark grammar mastery under real 90-minute board conditions.'
                  : 'Keep completing topic drills and daily challenges to reach Level 2.'}
              </p>
            </div>

            {state.level >= 2 && onStartExam && (
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onStartExam();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1 shrink-0"
              >
                <span>Start Simulator</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </section>

      {/* 4. Badges Wall */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Badges & Trophies Wall</span>
            </h2>
            <p className="text-xs text-slate-400">
              Unlocked: {state.badges.length} of {ALL_BADGES.length} Badges
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = state.badges.includes(badge.id);

            return (
              <div
                key={badge.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedBadge(badge);
                }}
                className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all relative group ${
                  isUnlocked
                    ? 'bg-slate-800/80 border-cyan-500/30 shadow-sm hover:border-cyan-400'
                    : 'bg-slate-900/40 border-white/[0.04] opacity-50 hover:opacity-80'
                }`}
              >
                <div className="text-2xl mb-1 flex items-center justify-center relative">
                  <span>{badge.icon}</span>
                  {!isUnlocked && (
                    <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-slate-950 border border-slate-700">
                      <Lock className="w-2 h-2 text-slate-400" />
                    </div>
                  )}
                </div>

                <h4 className="text-[11px] font-semibold text-white truncate">
                  {badge.title}
                </h4>
                <span className="text-[9px] text-slate-400 truncate block mt-0.5">
                  {isUnlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/[0.08] rounded-2xl p-5 max-w-sm w-full shadow-2xl text-center space-y-3.5 animate-scale-up">
            <div className="text-4xl mx-auto">{selectedBadge.icon}</div>
            <div>
              <h3 className="text-base font-bold text-white">{selectedBadge.title}</h3>
              <p className="text-xs text-slate-300 mt-1">{selectedBadge.description}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-white/[0.06] text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Category:</span>
                <span className="font-semibold text-slate-200 capitalize">{selectedBadge.category}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Reward:</span>
                <span className="font-semibold text-cyan-300">+{selectedBadge.xpReward} XP, +{selectedBadge.coinReward} 💎</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Status:</span>
                <span className={`font-semibold ${state.badges.includes(selectedBadge.id) ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {state.badges.includes(selectedBadge.id) ? '✅ Unlocked' : '🔒 Locked'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Official Certificate Card */}
      <div className="rounded-xl p-4 sm:p-5 border border-cyan-500/20 bg-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="space-y-0.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1.5">
            <Award className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              Official HSC Grammar Certificate
            </h3>
          </div>
          <p className="text-xs text-slate-300">
            Generate and export your verified Certificate of Grammar Mastery with your Board details and total XP.
          </p>
        </div>

        <button
          id="btn-view-certificate"
          type="button"
          onClick={() => {
            soundManager.playClick();
            onOpenCertificate();
          }}
          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow flex items-center gap-1.5 active:scale-95 transition-all shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>View Certificate</span>
        </button>
      </div>

      {/* Backup & Restore Section */}
      <div className="rounded-xl p-4 sm:p-5 border border-white/[0.08] bg-slate-800/80 space-y-3">
        <div className="space-y-0.5">
          <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Data Backup & Progress Protection</span>
          </h3>
          <p className="text-xs text-slate-400">
            Last Backup:{' '}
            <strong className={state.lastBackupAt ? 'text-cyan-300' : 'text-amber-400'}>
              {lastBackupFormatted}
            </strong>
          </p>
        </div>

        {importStatus && (
          <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold">
            {importStatus}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {/* Export JSON */}
          <button
            id="btn-export-backup-json"
            type="button"
            onClick={() => {
              soundManager.playCoin();
              onExportBackup();
            }}
            className="p-2.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Progress (.JSON)</span>
          </button>

          {/* Import JSON */}
          <label className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/[0.08] text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95">
            <Upload className="w-3.5 h-3.5" />
            <span>Restore Backup File</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* About This App Section */}
      <div className="rounded-xl p-4 sm:p-5 border border-white/[0.08] bg-slate-800/80 space-y-3">
        <div className="space-y-0.5 text-center sm:text-left">
          <h3 className="text-xs sm:text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>About Gramify</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Gramify is crafted to help students master HSC English grammar through gamified learning and syllabus-accurate drills.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/60 border border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
          <div>
            <span className="text-xs sm:text-sm font-bold text-cyan-400 block">
              Made by ARHAM
            </span>
            <span className="text-[10px] text-slate-400">
              Created for HSC Students
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <a
              href="https://www.launchvault.dev"
              target="_blank"
              rel="noopener noreferrer"
              title="Featured on LaunchVault"
              className="inline-block transition-transform hover:scale-105"
            >
              <img
                src="https://www.launchvault.dev/images/badges/launch-valut-badge.svg"
                alt="Featured on LaunchVault"
                style={{ width: '135px', height: 'auto' }}
                className="w-[125px] sm:w-[135px] h-auto"
              />
            </a>
            <span className="text-[10px] font-mono font-semibold text-slate-400 px-2.5 py-1 rounded-md bg-slate-900 border border-white/[0.06]">
              (HSC Board Standard)
            </span>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onToast={onToast}
      />

      {showPicker && (
        <AvatarPickerModal
          isOpen={showPicker}
          currentAvatar={state.user.avatar}
          onSelect={handleSaveAvatar}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
};
