import React, { useState, useEffect } from 'react';
import {
  Heart,
  Lightbulb,
  Flame,
  Settings,
  BookOpen,
  Award,
  BarChart3,
  Home,
  Layers,
  RotateCcw,
  Bookmark,
  Menu,
  X,
  User,
  Zap,
  MessageSquare,
  ChevronRight,
  Cloud,
} from 'lucide-react';
import { AppState } from '../types';
import { getNextHeartRegenSeconds, formatHMS } from '../utils/storage';
import { soundManager } from '../utils/sound';
import { useAuth } from '../context/AuthContext';
import { maskEmail } from '../utils/syncEngine';
import { LoginModal } from './LoginModal';
import { resolveAvatar } from './AvatarPickerModal';
import { ThemeToggle } from './ThemeToggle';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  state: AppState;
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenShop: () => void;
  onOpenHeartsShop: (tab?: 'hearts' | 'hints') => void;
  onOpenSettings: () => void;
  onOpenRules: () => void;
  onToggleSound: () => void;
  onOpenFeedback?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  state,
  currentRoute,
  onNavigate,
  onOpenShop,
  onOpenHeartsShop,
  onOpenSettings,
  onOpenRules,
  onToggleSound,
  onOpenFeedback,
}) => {
  const { user, isLoggedIn, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [regenSecs, setRegenSecs] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      setRegenSecs(getNextHeartRegenSeconds(state));
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [state]);

  const formatRegenTime = (seconds: number) => {
    return formatHMS(seconds);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'topics', label: 'Topics', icon: BookOpen },
    { id: 'practice_hub', label: 'Drills', icon: Zap },
    { id: 'changing_sentences', label: 'Transform', icon: Layers, badge: '10M' },
    { id: 'review_wrong', label: 'Errors', icon: RotateCcw, count: state.wrongQuestionReviewPool.length },
    { id: 'bookmarks', label: 'Saved', icon: Bookmark, count: state.bookmarkedQuestionIds.length },
    { id: 'achievements', label: 'Badges', icon: Award, count: state.unclaimedBadges?.length || 0 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const isRefilling = state.hearts < state.maxHearts;

  return (
    <>
      {/* Top Header */}
      <header
        id="main-navbar"
        className="fixed top-0 left-0 right-0 z-20 h-16 w-full border-b border-white/[0.08] bg-[#0f172a] select-none"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-full flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              id="brand-logo-container"
              onClick={() => {
                soundManager.playClick();
                onNavigate('home');
              }}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center p-1 group-hover:border-cyan-400 transition-colors">
                <img
                  src="/logo1.png"
                  alt="Gramify"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base text-white leading-tight">
                  Gramify
                </span>
                <p className="text-[10px] text-slate-400 truncate max-w-[140px] hidden sm:block leading-none mt-0.5">
                  {state.user.name || 'HSC Aspirant'} • Lvl {state.level}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav-links" className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    soundManager.playClick();
                    onNavigate(item.id);
                  }}
                  className={`relative px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] bg-amber-950/80 text-amber-300 border border-amber-500/30 px-1 py-0.2 rounded font-semibold font-mono">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-red-950 text-red-400 border border-red-500/40 font-semibold font-mono">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Stats Bar */}
          <div id="stats-header-bar" className="flex items-center gap-1.5 sm:gap-2">
            {/* Hearts */}
            <button
              id="stat-hearts-badge"
              onClick={() => {
                soundManager.playClick();
                onOpenHeartsShop('hearts');
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-950/50 border border-red-500/30 text-red-400 font-semibold text-xs hover:bg-red-950/80 transition-colors cursor-pointer"
              title={
                isRefilling
                  ? `Hearts refilling (+1 per 3h). Next in ${formatRegenTime(regenSecs)}.`
                  : 'Hearts full (20/20).'
              }
            >
              <Heart
                className={`w-3.5 h-3.5 fill-red-500 text-red-500 ${
                  isRefilling ? 'heart-pulse' : ''
                }`}
              />
              <span className="font-mono text-xs">{state.hearts}</span>
              {isRefilling && (
                <span className="text-[9px] text-red-300/70 font-mono hidden md:inline ml-0.5">
                  ({formatRegenTime(regenSecs)})
                </span>
              )}
            </button>

            {/* Diamonds */}
            <button
              id="stat-diamonds-badge"
              onClick={() => {
                soundManager.playCoin();
                onOpenHeartsShop('hearts');
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 font-semibold text-xs hover:bg-cyan-950/80 transition-colors cursor-pointer"
              title="Diamonds Balance"
            >
              <span className="text-xs">💎</span>
              <span className="font-mono text-xs">{state.diamonds ?? 20}</span>
            </button>

            {/* Hints */}
            <button
              id="stat-hints-badge"
              onClick={() => {
                soundManager.playClick();
                onOpenHeartsShop('hints');
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-950/50 border border-amber-500/30 text-amber-300 font-semibold text-xs hover:bg-amber-950/80 transition-colors cursor-pointer"
              title="Hints Inventory"
            >
              <Lightbulb className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-mono text-xs">{state.inventory?.hints ?? 3}</span>
            </button>

            {/* Streak */}
            <div
              id="stat-streak-badge"
              className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-950/40 border border-amber-500/20 text-amber-400 font-semibold text-xs"
              title="Daily Streak"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{state.streak}</span>
            </div>

            {/* Theme Toggle (Quick Access) */}
            <ThemeToggle id="btn-navbar-theme-toggle" variant="icon" className="hidden sm:flex" />

            {/* Settings */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenSettings();
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/[0.08] transition-colors"
              title="Settings"
              aria-label="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Drawer Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/[0.08] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (z-index 30) */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="fixed inset-0 z-30 bg-black/80 lg:hidden pt-20 px-4 pb-24 overflow-y-auto animate-fade-in"
        >
          <div className="bg-[#1e293b] rounded-2xl p-4 border border-white/[0.08] space-y-2">
            <div className="p-3 rounded-xl bg-slate-900 border border-white/[0.06] flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] leading-none select-none">{resolveAvatar(state.user.avatar)}</span>
                <div>
                  <span className="text-xs font-semibold text-white block">
                    {state.user.name || 'HSC Aspirant'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {state.user.roll
                      ? `Roll: ${state.user.roll} • Lvl ${state.level}`
                      : state.user.institute
                      ? `${state.user.institute} • Lvl ${state.level}`
                      : `Lvl ${state.level} • ${state.user.group || 'Science'}`}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {/* Location 2: Hamburger Menu top-right theme toggle */}
                <ThemeToggle id="btn-drawer-theme-toggle" variant="icon" />
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('profile');
                  }}
                  className="text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 px-2.5 py-1.5 rounded-lg border border-cyan-500/20"
                >
                  Profile
                </button>
              </div>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundManager.playClick();
                    setMobileMenuOpen(false);
                    onNavigate(item.id);
                  }}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] bg-amber-950/80 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-semibold font-mono">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="px-2 py-0.5 text-[9px] rounded-full bg-red-950 text-red-400 border border-red-500/40 font-semibold font-mono">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            {/* PWA Native App Install In Drawer */}
            <div className="pt-2">
              <PWAInstallButton variant="mobile-item" />
            </div>

            {/* Cloud Auth Section in Drawer */}
            <div className="pt-2">
              <div className="border-t border-white/[0.08] my-2" />
              {isLoggedIn ? (
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/[0.08] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Cloud className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-[11px] text-slate-400 truncate">
                      Logged in as <span className="text-white font-mono">{maskEmail(user?.email)}</span>
                    </span>
                  </div>
                  <button
                    id="drawer-logout-btn"
                    type="button"
                    onClick={async () => {
                      soundManager.playClick();
                      await logout();
                    }}
                    className="text-[11px] font-semibold text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  id="drawer-login-sync-btn"
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setShowLoginModal(true);
                  }}
                  className="w-full p-2.5 rounded-xl flex items-center justify-between text-left text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/15 border border-cyan-500/25 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0">
                      <Cloud className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-cyan-300 font-semibold block text-xs">
                        Cloud Sync (Upcoming)
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Progress saved on this device
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-cyan-400">Login</span>
                </button>
              )}
            </div>

            {/* Send Feedback Entry */}
            <div className="pt-2">
              <div className="border-t border-white/[0.08] my-2" />
              <button
                id="drawer-send-feedback-btn"
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setMobileMenuOpen(false);
                  if (onOpenFeedback) {
                    onOpenFeedback();
                  }
                }}
                className="w-full p-2.5 rounded-xl flex items-center justify-between text-left text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-white/[0.08] hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="text-white font-semibold">Send Feedback</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Footer credit in drawer */}
            <div className="pt-3 mt-1 border-t border-white/[0.08] text-center space-y-0.5">
              <div className="text-xs text-slate-400">
                Created by <strong className="text-cyan-400 font-semibold">ARHAM</strong>
              </div>
              <p className="text-[10px] text-slate-500">
                Gramify · HSC English 2nd Paper
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Fix 6: 56px height, solid dark background, cyan active indicator) */}
      <div
        id="mobile-bottom-bar"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-14 bg-[#0f172a] border-t border-white/[0.08] px-2 flex items-center justify-around select-none"
      >
        <button
          id="mobile-tab-home"
          type="button"
          onClick={() => {
            soundManager.playClick();
            onNavigate('home');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 transition-colors relative ${
            currentRoute === 'home' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
          {currentRoute === 'home' && (
            <span className="absolute bottom-0 w-3 h-0.5 rounded-full bg-cyan-400" />
          )}
        </button>

        <button
          id="mobile-tab-topics"
          type="button"
          onClick={() => {
            soundManager.playClick();
            onNavigate('topics');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 transition-colors relative ${
            currentRoute === 'topics' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Topics</span>
          {currentRoute === 'topics' && (
            <span className="absolute bottom-0 w-3 h-0.5 rounded-full bg-cyan-400" />
          )}
        </button>

        <button
          id="mobile-tab-drills"
          type="button"
          onClick={() => {
            soundManager.playClick();
            onNavigate('practice_hub');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 transition-colors relative ${
            currentRoute === 'practice_hub' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Drills</span>
          {currentRoute === 'practice_hub' && (
            <span className="absolute bottom-0 w-3 h-0.5 rounded-full bg-cyan-400" />
          )}
        </button>

        <button
          id="mobile-tab-changing"
          type="button"
          onClick={() => {
            soundManager.playClick();
            onNavigate('changing_sentences');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 transition-colors relative ${
            currentRoute === 'changing_sentences' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Transform</span>
          {currentRoute === 'changing_sentences' && (
            <span className="absolute bottom-0 w-3 h-0.5 rounded-full bg-cyan-400" />
          )}
        </button>

        <button
          id="mobile-tab-profile"
          type="button"
          onClick={() => {
            soundManager.playClick();
            onNavigate('profile');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 transition-colors relative ${
            currentRoute === 'profile' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Profile</span>
          {currentRoute === 'profile' && (
            <span className="absolute bottom-0 w-3 h-0.5 rounded-full bg-cyan-400" />
          )}
        </button>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};
