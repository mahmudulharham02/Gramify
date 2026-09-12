import { AppState, TopicProgressItem, SubModuleProgressItem, StudentProfile, CurrentDrillSession, SmartPracticeStats } from '../types';
import { TOPICS_DATA } from '../data/topics';
import { getLevelTitle, getXpRequiredForLevel, ALL_BADGES } from '../data/badges';

const STORAGE_KEY = 'hscGrammarQuest_v1';
const DRILL_SESSION_KEY = 'currentDrillSession';
export const HEART_REGEN_INTERVAL_MS = 3 * 60 * 60 * 1000; // 3 hours per heart (10,800,000 ms)

export const SUBMODULE_FRIENDLY_NAMES: Record<string, string> = {
  // Voice
  simple_present: 'Simple Present Voice',
  present_continuous: 'Present Continuous Voice',
  present_perfect: 'Present Perfect Voice',
  simple_past: 'Simple Past Voice',
  past_continuous: 'Past Continuous Voice',
  past_perfect: 'Past Perfect Voice',
  simple_future: 'Simple Future Voice',
  future_perfect: 'Future Perfect Voice',
  modals: 'Modal Verbs Voice',
  imperatives: 'Imperative Voice',
  interrogatives: 'Interrogative Voice',
  negatives: 'Negatives & Intransitive',
  // Narration
  assertive: 'Assertive Sentences Narration',
  interrogative: 'Interrogative Sentences Narration',
  imperative: 'Imperative Sentences Narration',
  exclamatory: 'Exclamatory Sentences Narration',
  optative: 'Optative Sentences Narration',
  mixed: 'Mixed Board Narration',
  // Changing sentences subtopics
  voice_change: 'Voice Transformations',
  simple_complex_compound: 'Simple, Complex, Compound',
  degree_comparison: 'Degrees of Comparison',
  affirmative_negative: 'Affirmative to Negative',
  assertive_interrogative: 'Assertive to Interrogative',
  exclamatory_assertive: 'Exclamatory to Assertive',
  mixed_board_transformations: 'Mixed Board Transformations',
  // General topics
  right_form_of_verbs: 'Right Form of Verbs',
  articles: 'Articles & Determiners',
  preposition: 'Prepositions',
  completing_sentences: 'Completing Sentences',
  connectors: 'Sentence Connectors',
  synonyms_antonyms: 'Synonyms & Antonyms',
  punctuation: 'Punctuation & Capitalization',
  modifiers: 'Modifiers (Pre & Post)',
  changing_sentences: 'Changing Sentences (10M)',
  tag_questions_and_special: 'Tag Questions & Special Uses',
};

export interface MasteryTierInfo {
  tier: number; // 0 to 5
  label: string;
  percent: number;
  textColor: string;
  barColor: string;
  glowColor: string;
  badgeBg: string;
  hasLock: boolean;
  hasStar: boolean;
  hasCrown: boolean;
  hasCheck: boolean;
  isMastered: boolean;
}

export function getMasteryTier(prog?: TopicProgressItem): MasteryTierInfo {
  const attempts = prog?.attempts || 0;
  const correct = prog?.correct || 0;

  if (attempts === 0) {
    return {
      tier: 0,
      label: 'Not Started',
      percent: 0,
      textColor: 'text-slate-400',
      barColor: 'bg-slate-700',
      glowColor: '',
      badgeBg: 'bg-slate-800 text-slate-400 border-slate-700',
      hasLock: true,
      hasStar: false,
      hasCrown: false,
      hasCheck: false,
      isMastered: false,
    };
  }

  const percent = Math.min(100, Math.round((correct / Math.max(1, attempts)) * 100));

  if (percent === 0) {
    return {
      tier: 0,
      label: 'Not Started',
      percent: 0,
      textColor: 'text-slate-400',
      barColor: 'bg-slate-700',
      glowColor: '',
      badgeBg: 'bg-slate-800 text-slate-400 border-slate-700',
      hasLock: true,
      hasStar: false,
      hasCrown: false,
      hasCheck: false,
      isMastered: false,
    };
  }

  if (percent < 50) {
    return {
      tier: 1,
      label: 'In Progress',
      percent,
      textColor: 'text-cyan-400',
      barColor: 'bg-cyan-500',
      glowColor: 'shadow-cyan-500/20',
      badgeBg: 'bg-cyan-950/60 text-cyan-400 border-cyan-500/30',
      hasLock: false,
      hasStar: false,
      hasCrown: false,
      hasCheck: false,
      isMastered: false,
    };
  }

  if (percent < 100) {
    return {
      tier: 2,
      label: 'Almost Mastered',
      percent,
      textColor: 'text-amber-400',
      barColor: 'bg-amber-500',
      glowColor: 'shadow-amber-500/30',
      badgeBg: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
      hasLock: false,
      hasStar: false,
      hasCrown: true,
      hasCheck: false,
      isMastered: false,
    };
  }

  return {
    tier: 3,
    label: 'Mastered',
    percent: 100,
    textColor: 'text-green-400 font-bold',
    barColor: 'bg-green-500',
    glowColor: 'shadow-green-500/30',
    badgeBg: 'bg-green-950/60 text-green-300 border-green-500/40',
    hasLock: false,
    hasStar: false,
    hasCrown: false,
    hasCheck: true,
    isMastered: true,
  };
}

export interface WeakSpotInfo {
  topicId: string;
  subModuleId: string;
  subModuleName: string;
  accuracy: number;
  totalAttempts: number;
  correct: number;
  wrong: number;
}

export function getWeakestSubModule(state: AppState): WeakSpotInfo | null {
  const candidates: WeakSpotInfo[] = [];

  Object.entries(state.topicProgress || {}).forEach(([topicId, topicProg]) => {
    if (topicProg.subModules) {
      Object.entries(topicProg.subModules).forEach(([subId, subProg]) => {
        if (subProg.attempts >= 5) {
          const accuracy = Math.round((subProg.correct / Math.max(1, subProg.attempts)) * 100);
          candidates.push({
            topicId,
            subModuleId: subId,
            subModuleName: SUBMODULE_FRIENDLY_NAMES[subId] || subId.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
            accuracy,
            totalAttempts: subProg.attempts,
            correct: subProg.correct,
            wrong: subProg.wrong,
          });
        }
      });
    }

    if (topicProg.attempts >= 5 && (!topicProg.subModules || Object.keys(topicProg.subModules).length === 0)) {
      const accuracy = Math.round((topicProg.correct / Math.max(1, topicProg.attempts)) * 100);
      candidates.push({
        topicId,
        subModuleId: topicId,
        subModuleName: SUBMODULE_FRIENDLY_NAMES[topicId] || topicId.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        accuracy,
        totalAttempts: topicProg.attempts,
        correct: topicProg.correct,
        wrong: topicProg.wrong,
      });
    }
  });

  if (candidates.length === 0) return null;

  // Pick the lowest accuracy
  candidates.sort((a, b) => {
    if (a.accuracy !== b.accuracy) {
      return a.accuracy - b.accuracy;
    }
    return b.wrong - a.wrong;
  });

  return candidates[0];
}

export function saveCurrentDrillSession(session: CurrentDrillSession | null): void {
  try {
    if (!session) {
      localStorage.removeItem(DRILL_SESSION_KEY);
    } else {
      localStorage.setItem(DRILL_SESSION_KEY, JSON.stringify(session));
    }
  } catch (e) {
    console.error('Failed to save current drill session:', e);
  }
}

export function getCurrentDrillSession(): CurrentDrillSession | null {
  try {
    const raw = localStorage.getItem(DRILL_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CurrentDrillSession;
  } catch (e) {
    console.error('Failed to get current drill session:', e);
    return null;
  }
}

export function clearCurrentDrillSession(): void {
  try {
    localStorage.removeItem(DRILL_SESSION_KEY);
  } catch (e) {
    console.error('Failed to clear current drill session:', e);
  }
}

export function formatHMS(secondsOrMs: number, isMs: boolean = false): string {
  const totalSec = isMs ? Math.floor(secondsOrMs / 1000) : Math.floor(secondsOrMs);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function ensureUserDefaults(user: Partial<StudentProfile> = {}): StudentProfile {
  const college = user.college_name ?? user.institute ?? '';
  const rollVal = user.roll_id ?? user.roll ?? null;
  return {
    name: user.name || null,
    roll: rollVal,
    roll_id: rollVal,
    college_name: college,
    institute: college,
    group: user.group || null,
    board: user.board || null,
    avatar: user.avatar || '🧑🎓',
    avatarFrame: user.avatarFrame || 'none',
    joinedAt: user.joinedAt || new Date().toISOString(),
    title: user.title || 'Apprentice 🐣',
    gender: user.gender === 'male' || user.gender === 'female' ? user.gender : null,
  };
}

function createInitialTopicProgress(): Record<string, TopicProgressItem> {
  const progress: Record<string, TopicProgressItem> = {};
  TOPICS_DATA.forEach((topic) => {
    progress[topic.id] = {
      unlocked: true,
      completedLessons: [],
      bestScores: {},
      attempts: 0,
      correct: 0,
      wrong: 0,
      mastery: 0,
      subModules: {},
    };
  });
  return progress;
}

export function getDefaultState(): AppState {
  return {
    version: 3,
    user: {
      name: null,
      roll: null,
      roll_id: null,
      college_name: '',
      institute: '',
      group: null,
      board: null,
      avatar: '🧑🎓',
      avatarFrame: 'none',
      joinedAt: null,
      title: 'Apprentice 🐣',
      gender: null,
    },
    supabaseUserId: null,
    lastSyncedAt: null,
    syncPreference: 'auto',
    xp: 0,
    level: 1,
    coins: 10,
    diamonds: 20, // starting bonus for new users (20 💎)
    hearts: 20,
    maxHearts: 20,
    lastHeartLostAt: null,
    lastAdWatchedAt: null,
    streak: 1,
    lastStudyDate: new Date().toISOString().split('T')[0],
    lastBackupAt: null,
    settings: {
      sound: true,
      theme: 'dark',
      timerEnabled: false,
      timerSeconds: 30,
      cacheWarningDismissed: false,
    },
    inventory: {
      themes: ['default'],
      avatarFrames: ['none'],
      hints: 3, // starting bonus: 3 hints (max 8)
    },
    activeTheme: 'default',
    badges: [],
    unclaimedBadges: [],
    topicProgress: createInitialTopicProgress(),
    dailyChallenge: {
      lastCompletedDate: null,
      currentStreak: 0,
    },
    bookmarkedQuestionIds: [],
    wrongQuestionReviewPool: [],
    recentScores: [],
    firstTimeUser: true,
    bestStreak: 1,
    totalStudyMinutes: 0,
    authTeaserDismissedForever: false,
    cacheWarningCollapsed: false,
    dailyRuleIndex: 0,
    feedbackCount: 0,
    lastFeedbackDate: null,
    feedbackPromptLevel5: false,
    onboardingSubmittedToFormspree: false,
    onboardingSubmittedAt: null,
    smartPracticeStats: {
      totalSmartSessions: 0,
      totalWeakSpotQuestions: 0,
      totalWeakSpotCorrect: 0,
      lastWeakSpotModule: null,
      lastSessionDate: null,
    },
    currentDrillSession: null,
  };
}

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getDefaultState();
      saveAppState(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as AppState;

    // Migrate v2 / missing fields to v3
    if (parsed.version === undefined || parsed.version < 3) {
      parsed.version = 3;
      parsed.maxHearts = 20;
      if (parsed.hearts === undefined || parsed.hearts < 20) {
        parsed.hearts = Math.max(parsed.hearts || 0, 20);
      }
      if (parsed.diamonds === undefined || parsed.diamonds === null) {
        parsed.diamonds = 20;
      }
      if (parsed.lastAdWatchedAt === undefined) {
        parsed.lastAdWatchedAt = null;
      }
    }

    // Ensure all topics exist in topicProgress
    TOPICS_DATA.forEach((topic) => {
      if (!parsed.topicProgress[topic.id]) {
        parsed.topicProgress[topic.id] = {
          unlocked: true,
          completedLessons: [],
          bestScores: {},
          attempts: 0,
          correct: 0,
          wrong: 0,
          mastery: 0,
          subModules: {},
        };
      }
    });

    if (!parsed.user) {
      parsed.user = getDefaultState().user;
    } else {
      parsed.user = ensureUserDefaults(parsed.user);
    }

    if (!parsed.settings) {
      parsed.settings = getDefaultState().settings;
    }

    // Preserve existing diamonds (if already defined e.g. 0, do NOT overwrite), only default undefined/null
    if (parsed.diamonds === undefined || parsed.diamonds === null) {
      parsed.diamonds = 20;
    }
    if (parsed.maxHearts === undefined) {
      parsed.maxHearts = 20;
    }

    if (parsed.inventory) {
      if (parsed.inventory.hints === undefined || parsed.inventory.hints === null) {
        parsed.inventory.hints = 3;
      } else {
        parsed.inventory.hints = Math.min(8, parsed.inventory.hints);
      }
    }

    if (parsed.smartPracticeStats === undefined) {
      parsed.smartPracticeStats = {
        totalSmartSessions: 0,
        totalWeakSpotQuestions: 0,
        totalWeakSpotCorrect: 0,
        lastWeakSpotModule: null,
        lastSessionDate: null,
      };
    }
    if (parsed.bestStreak === undefined) {
      parsed.bestStreak = Math.max(1, parsed.streak || 1);
    } else {
      parsed.bestStreak = Math.max(parsed.bestStreak, parsed.streak || 1);
    }
    if (parsed.totalStudyMinutes === undefined) {
      parsed.totalStudyMinutes = 0;
    }
    if (parsed.authTeaserDismissedForever === undefined) {
      parsed.authTeaserDismissedForever = false;
    }
    if (parsed.cacheWarningCollapsed === undefined) {
      parsed.cacheWarningCollapsed = false;
    }
    if (parsed.dailyRuleIndex === undefined) {
      parsed.dailyRuleIndex = 0;
    }
    if (parsed.supabaseUserId === undefined) {
      parsed.supabaseUserId = null;
    }
    if (parsed.lastSyncedAt === undefined) {
      parsed.lastSyncedAt = null;
    }
    if (parsed.syncPreference === undefined) {
      parsed.syncPreference = 'auto';
    }
    if (parsed.onboardingSubmittedToFormspree === undefined) {
      try {
        const submittedRecord = localStorage.getItem('gramify_onboarding_formspree_submitted_v1');
        parsed.onboardingSubmittedToFormspree = !!submittedRecord;
      } catch {
        parsed.onboardingSubmittedToFormspree = false;
      }
    }
    if (parsed.onboardingSubmittedAt === undefined) {
      parsed.onboardingSubmittedAt = null;
    }

    // Check & calculate heart regeneration (every 3 hours)
    const updated = calculateHeartRegen(parsed);
    // Check streak
    const updatedWithStreak = checkStreakIntegrity(updated);
    return updatedWithStreak;
  } catch (e) {
    console.error('Failed to load localStorage state:', e);
    return getDefaultState();
  }
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function calculateHeartRegen(state: AppState): AppState {
  const maxHearts = state.maxHearts || 20;
  if (state.hearts >= maxHearts || !state.lastHeartLostAt) {
    return state;
  }

  const now = Date.now();
  const lastLost = new Date(state.lastHeartLostAt).getTime();
  const elapsed = now - lastLost;

  if (elapsed >= HEART_REGEN_INTERVAL_MS) {
    const heartsToAdd = Math.floor(elapsed / HEART_REGEN_INTERVAL_MS);
    const newHearts = Math.min(maxHearts, state.hearts + heartsToAdd);

    let newLastLost: string | null = null;
    if (newHearts < maxHearts) {
      const remainder = elapsed % HEART_REGEN_INTERVAL_MS;
      newLastLost = new Date(now - remainder).toISOString();
    }

    const newState = {
      ...state,
      hearts: newHearts,
      lastHeartLostAt: newLastLost,
    };
    saveAppState(newState);
    return newState;
  }

  return state;
}

export function getNextHeartRegenSeconds(state: AppState): number {
  const maxHearts = state.maxHearts || 20;
  if (state.hearts >= maxHearts || !state.lastHeartLostAt) {
    return 0;
  }
  const now = Date.now();
  const lastLost = new Date(state.lastHeartLostAt).getTime();
  const elapsed = now - lastLost;
  const remainingMs = HEART_REGEN_INTERVAL_MS - (elapsed % HEART_REGEN_INTERVAL_MS);
  return Math.max(0, Math.ceil(remainingMs / 1000));
}

export function tradeDiamondsForHearts(
  state: AppState,
  heartsToBuy: number,
  customCost?: number
): { success: boolean; newState: AppState; message: string } {
  // New rate: 1 💎 = 3 hearts
  const costInDiamonds = customCost !== undefined ? customCost : Math.ceil(heartsToBuy / 3);
  if (state.diamonds < costInDiamonds) {
    return {
      success: false,
      newState: state,
      message: `Not enough diamonds! You need ${costInDiamonds} 💎 for ${heartsToBuy} ❤️.`,
    };
  }

  const maxHearts = state.maxHearts || 20;
  if (state.hearts >= maxHearts) {
    return {
      success: false,
      newState: state,
      message: `Your hearts are already full (${maxHearts}/${maxHearts})!`,
    };
  }

  const newDiamonds = state.diamonds - costInDiamonds;
  const newHearts = Math.min(maxHearts, state.hearts + heartsToBuy);
  const newLastLost = newHearts >= maxHearts ? null : state.lastHeartLostAt;

  const updated: AppState = {
    ...state,
    diamonds: newDiamonds,
    hearts: newHearts,
    lastHeartLostAt: newLastLost,
  };
  saveAppState(updated);
  return {
    success: true,
    newState: updated,
    message: `Successfully refilled +${newHearts - state.hearts} hearts for ${costInDiamonds} 💎!`,
  };
}

export function tradeDiamondsForHints(
  state: AppState,
  hintsToBuy: number,
  costInDiamonds: number
): { success: boolean; newState: AppState; message: string } {
  const currentHints = state.inventory?.hints ?? 3;
  const maxHints = 8;

  if (currentHints >= maxHints) {
    return {
      success: false,
      newState: state,
      message: `Your hint inventory is already full (max ${maxHints} 💡)!`,
    };
  }

  if (state.diamonds < costInDiamonds) {
    return {
      success: false,
      newState: state,
      message: `Not enough diamonds! You need ${costInDiamonds} 💎 for ${hintsToBuy} 💡.`,
    };
  }

  const newDiamonds = state.diamonds - costInDiamonds;
  const newHints = Math.min(maxHints, currentHints + hintsToBuy);
  const actualAdded = newHints - currentHints;

  const updated: AppState = {
    ...state,
    diamonds: newDiamonds,
    inventory: {
      ...state.inventory,
      hints: newHints,
    },
  };
  saveAppState(updated);
  return {
    success: true,
    newState: updated,
    message: `Successfully gained +${actualAdded} hints for ${costInDiamonds} 💎!`,
  };
}

export function rewardMockAdWatch(state: AppState): { success: boolean; newState: AppState; message: string } {
  const now = Date.now();
  if (state.lastAdWatchedAt) {
    const elapsed = now - new Date(state.lastAdWatchedAt).getTime();
    const cooldownMs = 10 * 60 * 1000; // 10 min cooldown
    if (elapsed < cooldownMs) {
      const remainingMins = Math.ceil((cooldownMs - elapsed) / 60000);
      return {
        success: false,
        newState: state,
        message: `Ad reward cooldown active. Please wait ${remainingMins} minute(s).`,
      };
    }
  }

  const maxHearts = state.maxHearts || 20;
  const newHearts = Math.min(maxHearts, state.hearts + 5);
  const updated: AppState = {
    ...state,
    hearts: newHearts,
    lastHeartLostAt: newHearts >= maxHearts ? null : state.lastHeartLostAt,
    lastAdWatchedAt: new Date().toISOString(),
  };
  saveAppState(updated);
  return {
    success: true,
    newState: updated,
    message: `+5 Hearts unlocked from sponsor reward! ❤️`,
  };
}

export function checkStreakIntegrity(state: AppState): AppState {
  const todayStr = new Date().toISOString().split('T')[0];
  if (!state.lastStudyDate) {
    return { ...state, lastStudyDate: todayStr, streak: 1 };
  }

  if (state.lastStudyDate === todayStr) {
    return state;
  }

  const lastDate = new Date(state.lastStudyDate);
  const today = new Date(todayStr);
  const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

  if (diffDays === 1) {
    return state;
  } else if (diffDays > 1) {
    const newState = {
      ...state,
      streak: 0,
    };
    saveAppState(newState);
    return newState;
  }

  return state;
}

export function recordStudySession(state: AppState): AppState {
  const todayStr = new Date().toISOString().split('T')[0];
  let newStreak = state.streak;

  if (state.lastStudyDate !== todayStr) {
    const lastDate = state.lastStudyDate ? new Date(state.lastStudyDate) : null;
    if (lastDate) {
      const today = new Date(todayStr);
      const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        newStreak = state.streak + 1;
      } else {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }
  }

  const newState = {
    ...state,
    streak: newStreak,
    lastStudyDate: todayStr,
  };
  saveAppState(newState);
  return newState;
}

export function addXPAndCoins(
  state: AppState,
  earnedXP: number,
  earnedCoins: number,
  earnedDiamonds: number = 0
): { newState: AppState; leveledUp: boolean; newLevel: number; newlyUnlockedBadges: string[] } {
  let xp = state.xp + earnedXP;
  let coins = state.coins + earnedCoins;
  let diamonds = (state.diamonds || 0) + earnedDiamonds;
  let level = state.level;
  let leveledUp = false;

  let requiredXP = getXpRequiredForLevel(level);
  while (xp >= requiredXP) {
    xp -= requiredXP;
    level += 1;
    leveledUp = true;
    requiredXP = getXpRequiredForLevel(level);
  }

  const userTitle = getLevelTitle(level);

  let updatedState: AppState = {
    ...state,
    xp,
    coins,
    diamonds,
    level,
    user: {
      ...state.user,
      title: userTitle,
    },
  };

  const newlyUnlockedBadges = checkBadges(updatedState);
  if (newlyUnlockedBadges.length > 0) {
    // Award 10 bonus diamonds for each unlocked badge
    updatedState = {
      ...updatedState,
      diamonds: updatedState.diamonds + newlyUnlockedBadges.length * 10,
      badges: [...updatedState.badges, ...newlyUnlockedBadges],
      unclaimedBadges: [...(updatedState.unclaimedBadges || []), ...newlyUnlockedBadges],
    };
  }

  saveAppState(updatedState);
  return { newState: updatedState, leveledUp, newLevel: level, newlyUnlockedBadges };
}

export function checkBadges(state: AppState): string[] {
  const unlocked: string[] = [];
  const currentBadges = new Set(state.badges);
  const totalCorrect = Object.values(state.topicProgress).reduce((acc, curr) => acc + curr.correct, 0);

  if (!currentBadges.has('first_steps') && totalCorrect >= 1) {
    unlocked.push('first_steps');
  }

  if (!currentBadges.has('on_fire_7') && state.streak >= 7) {
    unlocked.push('on_fire_7');
  }

  if (!currentBadges.has('coin_collector') && state.coins >= 100) {
    unlocked.push('coin_collector');
  }

  if (!currentBadges.has('level_10') && state.level >= 10) {
    unlocked.push('level_10');
  }

  const voiceProgress = state.topicProgress['changing_sentences'];
  if (!currentBadges.has('voice_master') && voiceProgress && voiceProgress.mastery >= 90) {
    unlocked.push('voice_master');
  }

  const totalAttempts = Object.values(state.topicProgress).reduce((acc, curr) => acc + curr.attempts, 0);
  if (!currentBadges.has('bookworm') && totalAttempts >= 50) {
    unlocked.push('bookworm');
  }

  const hour = new Date().getHours();
  if (!currentBadges.has('early_bird') && hour >= 5 && hour < 8 && totalCorrect > 0) {
    unlocked.push('early_bird');
  }
  if (!currentBadges.has('night_owl') && (hour >= 23 || hour < 4) && totalCorrect > 0) {
    unlocked.push('night_owl');
  }

  return unlocked;
}

export function recordQuestionResult(
  state: AppState,
  questionId: string,
  topicId: string,
  isCorrect: boolean,
  subModuleId?: string,
  mode: 'mcq' | 'write' = 'mcq',
  answerStatus: 'correct' | 'almost_correct' | 'wrong' = isCorrect ? 'correct' : 'wrong'
): AppState {
  const topicProg = state.topicProgress[topicId] || {
    unlocked: true,
    completedLessons: [],
    bestScores: {},
    attempts: 0,
    correct: 0,
    wrong: 0,
    mastery: 0,
    subModules: {},
  };

  const attempts = topicProg.attempts + 1;
  const isActualCorrect = answerStatus === 'correct';
  const isAlmost = answerStatus === 'almost_correct';
  const isWrong = answerStatus === 'wrong';

  const correct = topicProg.correct + (isActualCorrect ? 1 : 0);
  const wrong = topicProg.wrong + (isWrong ? 1 : 0);
  const mastery = Math.min(100, Math.round((correct / Math.max(1, attempts)) * 100));

  // Mode specific tracking on topic level
  let mcqAttempts = topicProg.mcqAttempts || 0;
  let mcqCorrect = topicProg.mcqCorrect || 0;
  let mcqWrong = topicProg.mcqWrong || 0;
  let writeAttempts = topicProg.writeAttempts || 0;
  let writeCorrect = topicProg.writeCorrect || 0;
  let writeAlmostCorrect = topicProg.writeAlmostCorrect || 0;
  let writeWrong = topicProg.writeWrong || 0;

  if (mode === 'write') {
    writeAttempts += 1;
    if (isActualCorrect) writeCorrect += 1;
    else if (isAlmost) writeAlmostCorrect += 1;
    else writeWrong += 1;
  } else {
    mcqAttempts += 1;
    if (isActualCorrect) mcqCorrect += 1;
    else mcqWrong += 1;
  }

  const mcqAccuracy = mcqAttempts > 0 ? Math.round((mcqCorrect / mcqAttempts) * 100) : 0;
  const writeModeAccuracy = writeAttempts > 0 ? Math.round(((writeCorrect + writeAlmostCorrect * 0.5) / writeAttempts) * 100) : 0;

  const updatedSubModules = { ...(topicProg.subModules || {}) };
  if (subModuleId) {
    const prevSub = updatedSubModules[subModuleId] || {
      attempts: 0,
      correct: 0,
      wrong: 0,
      mastery: 0,
    };
    const subAttempts = prevSub.attempts + 1;
    const subCorrect = prevSub.correct + (isActualCorrect ? 1 : 0);
    const subWrong = prevSub.wrong + (isWrong ? 1 : 0);
    const subMastery = Math.min(100, Math.round((subCorrect / Math.max(1, subAttempts)) * 100));

    let subMcqAttempts = prevSub.mcqAttempts || 0;
    let subMcqCorrect = prevSub.mcqCorrect || 0;
    let subMcqWrong = prevSub.mcqWrong || 0;
    let subWriteAttempts = prevSub.writeAttempts || 0;
    let subWriteCorrect = prevSub.writeCorrect || 0;
    let subWriteAlmostCorrect = prevSub.writeAlmostCorrect || 0;
    let subWriteWrong = prevSub.writeWrong || 0;

    if (mode === 'write') {
      subWriteAttempts += 1;
      if (isActualCorrect) subWriteCorrect += 1;
      else if (isAlmost) subWriteAlmostCorrect += 1;
      else subWriteWrong += 1;
    } else {
      subMcqAttempts += 1;
      if (isActualCorrect) subMcqCorrect += 1;
      else subMcqWrong += 1;
    }

    const subMcqAccuracy = subMcqAttempts > 0 ? Math.round((subMcqCorrect / subMcqAttempts) * 100) : 0;
    const subWriteModeAccuracy = subWriteAttempts > 0 ? Math.round(((subWriteCorrect + subWriteAlmostCorrect * 0.5) / subWriteAttempts) * 100) : 0;

    updatedSubModules[subModuleId] = {
      attempts: subAttempts,
      correct: subCorrect,
      wrong: subWrong,
      mastery: subMastery,
      mcqAttempts: subMcqAttempts,
      mcqCorrect: subMcqCorrect,
      mcqWrong: subMcqWrong,
      mcqAccuracy: subMcqAccuracy,
      writeAttempts: subWriteAttempts,
      writeCorrect: subWriteCorrect,
      writeAlmostCorrect: subWriteAlmostCorrect,
      writeWrong: subWriteWrong,
      writeModeAccuracy: subWriteModeAccuracy,
    };
  }

  let wrongPool = [...state.wrongQuestionReviewPool];
  if (isWrong) {
    if (!wrongPool.includes(questionId)) {
      wrongPool.push(questionId);
    }
  } else {
    wrongPool = wrongPool.filter((id) => id !== questionId);
  }

  let hearts = state.hearts;
  let lastHeartLostAt = state.lastHeartLostAt;
  const maxHearts = state.maxHearts || 20;

  // Only wrong answers lose a heart (almost correct costs nothing)
  if (isWrong) {
    hearts = Math.max(0, state.hearts - 1);
    if (lastHeartLostAt === null || hearts === maxHearts - 1) {
      lastHeartLostAt = new Date().toISOString();
    }
  }

  // Award 1 Diamond on exact correct answer
  const diamonds = (state.diamonds || 0) + (isActualCorrect ? 1 : 0);

  const newState: AppState = {
    ...state,
    hearts,
    diamonds,
    lastHeartLostAt,
    wrongQuestionReviewPool: wrongPool,
    topicProgress: {
      ...state.topicProgress,
      [topicId]: {
        ...topicProg,
        attempts,
        correct,
        wrong,
        mastery,
        mcqAttempts,
        mcqCorrect,
        mcqWrong,
        mcqAccuracy,
        writeAttempts,
        writeCorrect,
        writeAlmostCorrect,
        writeWrong,
        writeModeAccuracy,
        subModules: updatedSubModules,
      },
    },
  };

  saveAppState(newState);
  return newState;
}

export function toggleBookmarkQuestion(state: AppState, questionId: string): AppState {
  const exists = state.bookmarkedQuestionIds.includes(questionId);
  const updated = exists
    ? state.bookmarkedQuestionIds.filter((id) => id !== questionId)
    : [...state.bookmarkedQuestionIds, questionId];

  const newState = {
    ...state,
    bookmarkedQuestionIds: updated,
  };
  saveAppState(newState);
  return newState;
}

export function exportStateAsJSON(state: AppState): AppState {
  const nowStr = new Date().toISOString();
  const dateTag = nowStr.split('T')[0];
  const updatedState: AppState = {
    ...state,
    lastBackupAt: nowStr,
  };
  saveAppState(updatedState);

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(updatedState, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `hsc-grammar-quest-backup-${dateTag}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  return updatedState;
}

export function importStateFromJSON(jsonString: string): AppState | null {
  try {
    const parsed = JSON.parse(jsonString) as AppState;
    if (parsed && typeof parsed.xp === 'number' && parsed.topicProgress) {
      saveAppState(parsed);
      return parsed;
    }
    return null;
  } catch (e) {
    console.error('Invalid JSON import:', e);
    return null;
  }
}

export function recordFeedbackSubmission(state: AppState): AppState {
  const updated: AppState = {
    ...state,
    feedbackCount: (state.feedbackCount || 0) + 1,
    lastFeedbackDate: new Date().toISOString(),
    feedbackPromptLevel5: true,
  };
  saveAppState(updated);
  return updated;
}

export function hasFeedbackBeenSentRecently(lastFeedbackDate?: string | null, days = 7): boolean {
  if (!lastFeedbackDate) return false;
  try {
    const lastDate = new Date(lastFeedbackDate).getTime();
    const now = Date.now();
    const daysDiff = (now - lastDate) / (1000 * 60 * 60 * 24);
    return daysDiff < days;
  } catch {
    return false;
  }
}

