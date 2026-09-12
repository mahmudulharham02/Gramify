import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, Question, ShopItem, VoiceSubModuleId, NarrationSubModuleId, DrillMode, StudentProfile } from './types';
import {
  loadAppState,
  saveAppState,
  recordStudySession,
  addXPAndCoins,
  recordQuestionResult,
  toggleBookmarkQuestion,
  calculateHeartRegen,
  getNextHeartRegenSeconds,
  tradeDiamondsForHearts,
  tradeDiamondsForHints,
  rewardMockAdWatch,
  getDefaultState,
  exportStateAsJSON,
  importStateFromJSON,
  recordFeedbackSubmission,
} from './utils/storage';
import { ALL_QUESTIONS, getQuestionsByTopicAndSubtopic } from './data/questions';
import { VOICE_CHANGE_QUESTIONS } from './data/voiceChangeQuestions';
import { NARRATION_QUESTIONS } from './data/narrationQuestions';
import { TOPICS_DATA } from './data/topics';
import { soundManager } from './utils/sound';
import { getDrillModePreference, setDrillModePreference } from './utils/modePreferences';
import { X as CloseIcon } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { scheduleProgressSync, initSyncListeners } from './utils/syncEngine';
import {
  sendOnboardingToFormspree,
  initOnboardingFormspreeSyncListener,
} from './utils/formspree';

// Components
import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { TopicsLibrary } from './components/TopicsLibrary';
import { PracticeHub } from './components/PracticeHub';
import { ChangingSentencesHub } from './components/ChangingSentencesHub';
import { LastHourPrepSetup } from './components/LastHourPrepSetup';
import { LastHourPrepExam } from './components/LastHourPrepExam';
import { LastHourPrepResults } from './components/LastHourPrepResults';
import { GameScreen } from './components/GameScreen';
import { ReviewWrongPool } from './components/ReviewWrongPool';
import { BookmarksView } from './components/BookmarksView';
import { AchievementsView } from './components/AchievementsView';
import { AnalyticsView } from './components/AnalyticsView';
import { ProfileView } from './components/ProfileView';
import { AppFooter } from './components/AppFooter';
import {
  generateExamPaper,
  saveExamAttempt,
  calculateExamGrade,
  EXAM_TOPIC_CONFIG,
  LastHourPrepAttempt,
  ExamTopicScore,
  ExamQuestion,
  TOTAL_EXAM_MARKS,
} from './utils/examGenerator';

// Modals
import { RulesGuideModal } from './components/RulesGuideModal';
import { ShopModal } from './components/ShopModal';
import { HeartsShopModal } from './components/HeartsShopModal';
import { OutOfHeartsModal } from './components/OutOfHeartsModal';
import { SettingsModal } from './components/SettingsModal';
import { CertificateModal } from './components/CertificateModal';
import { StudentIntroModal } from './components/StudentIntroModal';
import { FeedbackModal } from './components/FeedbackModal';
import { ModeSelectionModal } from './components/ModeSelectionModal';
import { OfflineIndicator } from './components/OfflineIndicator';

export function App() {
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { user, isLoggedIn, syncProfile, setLastSynced } = useAuth();
  const stateRef = useRef(state);
  stateRef.current = state;
  const userRef = useRef(user);
  userRef.current = user;

  // Active game session config
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [gameTitle, setGameTitle] = useState<string>('Grammar Practice');
  const [gameSubTitle, setGameSubTitle] = useState<string | undefined>();
  const [gameInitialMode, setGameInitialMode] = useState<DrillMode>('mcq');

  // Pre-drill mode selection overlay state
  const [pendingModeSelection, setPendingModeSelection] = useState<{
    topicId: string;
    subModuleId?: string;
    topicTitle: string;
    subModuleTitle?: string;
    onLaunch: (mode: DrillMode) => void;
  } | null>(null);

  // Last Hour Prep Test (Board Exam Simulator) session state
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
  const [currentExamAttempt, setCurrentExamAttempt] = useState<LastHourPrepAttempt | null>(null);

  // Modals state
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [showHeartsShopModal, setShowHeartsShopModal] = useState(false);
  const [heartsShopTab, setHeartsShopTab] = useState<'hearts' | 'hints'>('hearts');
  const [showOutOfHeartsModal, setShowOutOfHeartsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState<boolean>(state.firstTimeUser);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const handleOpenHeartsShop = useCallback((tab: 'hearts' | 'hints' = 'hearts') => {
    setHeartsShopTab(tab);
    setShowHeartsShopModal(true);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  // Sync sound settings with soundManager
  useEffect(() => {
    soundManager.setEnabled(state.settings.sound);
  }, [state.settings.sound]);

  // Periodic Heart Regeneration check
  useEffect(() => {
    const timer = setInterval(() => {
      setState((prev) => calculateHeartRegen(prev));
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Initialize visibilitychange and online sync listeners
  useEffect(() => {
    const cleanup = initSyncListeners(
      () => stateRef.current,
      () => userRef.current,
      (ts) => {
        setLastSynced(ts);
        setState((prev) => ({ ...prev, lastSyncedAt: ts }));
      }
    );
    return cleanup;
  }, [setLastSynced]);

  // Initialize background listener for flushing offline Formspree onboarding submissions
  useEffect(() => {
    const cleanup = initOnboardingFormspreeSyncListener(
      () => stateRef.current,
      () => userRef.current?.email || null,
      (submittedAt) => {
        setState((prev) => ({
          ...prev,
          onboardingSubmittedToFormspree: true,
          onboardingSubmittedAt: submittedAt,
        }));
      }
    );
    return cleanup;
  }, []);

  // Send user onboarding data to dedicated Formspree form on first-time completion
  const handleOnboardingComplete = useCallback(
    (profile: Partial<StudentProfile>) => {
      const fullProfile = { ...stateRef.current.user, ...profile };
      sendOnboardingToFormspree(fullProfile, {
        state: stateRef.current,
        userEmail: userRef.current?.email || null,
      }).then((result) => {
        if (result.success && result.submittedAt) {
          setState((prev) => {
            const next = {
              ...prev,
              onboardingSubmittedToFormspree: true,
              onboardingSubmittedAt: result.submittedAt || new Date().toISOString(),
            };
            saveAppState(next);
            return next;
          });
        }
      });
    },
    []
  );

  // Debounced progress sync trigger for significant events (30 seconds debounce)
  const triggerProgressSync = useCallback(() => {
    if (userRef.current) {
      scheduleProgressSync(
        () => stateRef.current,
        userRef.current.id,
        (ts) => {
          setLastSynced(ts);
          setState((prev) => ({ ...prev, lastSyncedAt: ts }));
        }
      );
    }
  }, [setLastSynced]);

  // Update & persist state helper
  const updateState = useCallback((updater: AppState | ((prev: AppState) => AppState)) => {
    setState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveAppState(next);
      return next;
    });
  }, []);

  const handleFeedbackSuccess = useCallback(() => {
    updateState((prev) => recordFeedbackSubmission(prev));
    showToast('Feedback sent! Thank you.');
  }, [updateState, showToast]);

  // History-aware navigation handler
  const navigate = (newPage: string, params?: { topicId?: string; subtopicId?: string }) => {
    if (newPage === 'game' && params?.topicId) {
      startTopicLesson(params.topicId, params.subtopicId);
      return;
    }
    window.history.pushState(
      { page: newPage, params },
      '',
      `#${newPage}`
    );
    setCurrentRoute(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // On initial app load: replace current state without pushing extra history
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    const validRoutes = [
      'home',
      'practice_hub',
      'topics',
      'changing_sentences',
      'last_hour_prep',
      'last_hour_prep_exam',
      'last_hour_prep_results',
      'review_wrong',
      'bookmarks',
      'achievements',
      'analytics',
      'profile',
    ];
    const initialRoute = validRoutes.includes(hash) ? hash : 'home';
    if (initialRoute !== 'home') {
      setCurrentRoute(initialRoute);
    }
    window.history.replaceState(
      { page: initialRoute },
      '',
      `#${initialRoute}`
    );
  }, []);

  // Listen for browser back/forward (popstate)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state && state.page) {
        setCurrentRoute(state.page);
      } else {
        // No state means we're at the root/first entry, default to home
        setCurrentRoute('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Launch a standard topic lesson
  const launchTopicLessonWithMode = (
    topicId: string,
    subtopicId: string | undefined,
    mode: DrillMode,
    subtopicTitle?: string
  ) => {
    let matchedQuestions = getQuestionsByTopicAndSubtopic(topicId, subtopicId, subtopicTitle);

    if (matchedQuestions.length === 0) {
      if (subtopicId) {
        // Fallback exclusively within this parent topic
        const topicPool = ALL_QUESTIONS.filter((q) => q.topicId === topicId);
        matchedQuestions = topicPool.filter(
          (q) => q.subtopicId === subtopicId || (q as any).subModule === subtopicId
        );
        if (matchedQuestions.length === 0 && topicPool.length > 0) {
          matchedQuestions = topicPool;
        }
      } else {
        matchedQuestions = ALL_QUESTIONS.filter((q) => q.topicId === topicId);
      }
    }

    if (matchedQuestions.length === 0) {
      matchedQuestions = ALL_QUESTIONS.slice(0, 10);
    }

    // Shuffle and pick 10 questions max
    const shuffled = [...matchedQuestions].sort(() => Math.random() - 0.5).slice(0, 10);
    const topic = TOPICS_DATA.find((t) => t.id === topicId);
    const resolvedTopicTitle = topic
      ? topic.title
      : (topicId === 'changing_sentences' ? 'Changing Sentences' : 'Grammar Drill');

    let resolvedSubTitle = subtopicTitle;
    if (!resolvedSubTitle && subtopicId) {
      const pretty = subtopicId.replace(/_/g, ' ');
      resolvedSubTitle = pretty.charAt(0).toUpperCase() + pretty.slice(1);
    }

    setGameTitle(resolvedTopicTitle);
    setGameSubTitle(resolvedSubTitle);
    setGameInitialMode(mode);
    setActiveQuestions(shuffled);
    window.history.pushState({ page: 'game' }, '', '#game');
    setCurrentRoute('game');
  };

  const startTopicLesson = (
    topicId: string,
    subtopicId?: string,
    forcedMode?: DrillMode,
    subtopicTitle?: string
  ) => {
    if (forcedMode) {
      launchTopicLessonWithMode(topicId, subtopicId, forcedMode, subtopicTitle);
      return;
    }

    const savedPref = getDrillModePreference(topicId, subtopicId);
    if (savedPref) {
      launchTopicLessonWithMode(topicId, subtopicId, savedPref, subtopicTitle);
      return;
    }

    const topic = TOPICS_DATA.find((t) => t.id === topicId);
    const resolvedTopicTitle = topic
      ? topic.title
      : (topicId === 'changing_sentences' ? 'Changing Sentences' : 'Grammar Practice');

    let resolvedSubTitle = subtopicTitle;
    if (!resolvedSubTitle && subtopicId) {
      const pretty = subtopicId.replace(/_/g, ' ');
      resolvedSubTitle = pretty.charAt(0).toUpperCase() + pretty.slice(1);
    }

    setPendingModeSelection({
      topicId,
      subModuleId: subtopicId,
      topicTitle: resolvedTopicTitle,
      subModuleTitle: resolvedSubTitle,
      onLaunch: (mode: DrillMode) => {
        launchTopicLessonWithMode(topicId, subtopicId, mode, subtopicTitle);
      },
    });
  };

  // Launch Daily Challenge (1 question from each of the 10 topics)
  const startDailyChallenge = () => {
    const selected: Question[] = [];
    TOPICS_DATA.forEach((topic) => {
      const topicQuestions = ALL_QUESTIONS.filter((q) => q.topicId === topic.id);
      if (topicQuestions.length > 0) {
        const randomQ = topicQuestions[Math.floor(Math.random() * topicQuestions.length)];
        selected.push(randomQ);
      }
    });

    if (selected.length === 0) {
      selected.push(...ALL_QUESTIONS.slice(0, 10));
    }

    setGameTitle('Daily Board Challenge (10 Topics)');
    setGameSubTitle('Mixed 10-Topic Board Standard Test');
    setGameInitialMode('mcq');
    setActiveQuestions(selected);
    window.history.pushState({ page: 'game' }, '', '#game');
    setCurrentRoute('game');
  };

  // Launch Smart Practice (Adaptive Weak-Spot 10-Question Drill)
  const launchSmartPracticeWithMode = (
    weakSpot: {
      topicId: string;
      subModuleId: string;
      subModuleName: string;
      accuracy: number;
    },
    mode: DrillMode
  ) => {
    let pool: Question[] = [];

    if (weakSpot.topicId === 'changing_sentences') {
      const voiceMatch = VOICE_CHANGE_QUESTIONS.filter(
        (q) => q.subModule === weakSpot.subModuleId
      );
      if (voiceMatch.length > 0) {
        pool = voiceMatch;
      } else {
        const narrationMatch = NARRATION_QUESTIONS.filter(
          (q) => q.subModule === weakSpot.subModuleId
        );
        if (narrationMatch.length > 0) {
          pool = narrationMatch;
        }
      }
    }

    if (pool.length === 0) {
      const matched = ALL_QUESTIONS.filter(
        (q) =>
          q.topicId === weakSpot.topicId &&
          (q.subtopicId === weakSpot.subModuleId || (q as any).subModule === weakSpot.subModuleId)
      );
      pool = matched.length > 0 ? matched : ALL_QUESTIONS.filter((q) => q.topicId === weakSpot.topicId);
    }

    if (pool.length === 0) {
      pool = ALL_QUESTIONS;
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
    setGameTitle(`Smart Practice: ${weakSpot.subModuleName}`);
    setGameSubTitle(`Targeting ${weakSpot.accuracy}% Accuracy Weak Area`);
    setGameInitialMode(mode);
    setActiveQuestions(shuffled);
    window.history.pushState({ page: 'game' }, '', '#game');
    setCurrentRoute('game');
  };

  const startSmartPractice = (weakSpot: {
    topicId: string;
    subModuleId: string;
    subModuleName: string;
    accuracy: number;
  }) => {
    const savedPref = getDrillModePreference(weakSpot.topicId, weakSpot.subModuleId);
    if (savedPref) {
      launchSmartPracticeWithMode(weakSpot, savedPref);
      return;
    }

    setPendingModeSelection({
      topicId: weakSpot.topicId,
      subModuleId: weakSpot.subModuleId,
      topicTitle: `Smart Practice: ${weakSpot.subModuleName}`,
      subModuleTitle: `Targeting ${weakSpot.accuracy}% Accuracy Weak Area`,
      onLaunch: (mode: DrillMode) => {
        launchSmartPracticeWithMode(weakSpot, mode);
      },
    });
  };

  // Resume saved drill session
  const resumeDrillSession = (session: any) => {
    if (session.questionIds && session.questionIds.length > 0) {
      const restored = session.questionIds
        .map((id: string) =>
          ALL_QUESTIONS.find((q) => q.id === id) ||
          VOICE_CHANGE_QUESTIONS.find((q) => q.id === id) ||
          NARRATION_QUESTIONS.find((q) => q.id === id)
        )
        .filter(Boolean) as Question[];

      if (restored.length > 0) {
        setGameTitle(session.title || 'Resumed Drill');
        setGameSubTitle(session.subTitle);
        setGameInitialMode(session.mode || 'mcq');
        setActiveQuestions(restored);
        window.history.pushState({ page: 'game' }, '', '#game');
        setCurrentRoute('game');
        return;
      }
    }
    startTopicLesson(session.topicId, session.subtopicId || session.subModuleId);
  };

  // Launch custom question set drill (e.g. from mistake pool or bookmarks)
  const startCustomDrill = (questions: Question[], title: string) => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setGameTitle(title);
    setGameSubTitle(undefined);
    setGameInitialMode('mcq');
    setActiveQuestions(shuffled);
    window.history.pushState({ page: 'game' }, '', '#game');
    setCurrentRoute('game');
  };

  const subModuleVoiceNames: Record<string, string> = {
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
  };

  // Launch specialized Voice Change Drill
  const launchVoiceDrillWithMode = (subModule: VoiceSubModuleId, mode: DrillMode) => {
    const matched = VOICE_CHANGE_QUESTIONS.filter((q) => q.subModule === subModule);
    const questionsToUse = matched.length > 0 ? matched : VOICE_CHANGE_QUESTIONS;
    const shuffled = [...questionsToUse].sort(() => Math.random() - 0.5).slice(0, 10);
    setGameTitle(`Voice Change: ${subModuleVoiceNames[subModule] || subModule}`);
    setGameSubTitle('Active ↔ Passive Transformation Drill');
    setGameInitialMode(mode);
    setActiveQuestions(shuffled);
    window.history.pushState({ page: 'game' }, '', '#game');
    setCurrentRoute('game');
  };

  const startVoiceDrill = (subModule: VoiceSubModuleId, forcedMode?: DrillMode) => {
    if (forcedMode) {
      launchVoiceDrillWithMode(subModule, forcedMode);
      return;
    }
    const savedPref = getDrillModePreference('voice_change', subModule);
    if (savedPref) {
      launchVoiceDrillWithMode(subModule, savedPref);
      return;
    }
    setPendingModeSelection({
      topicId: 'voice_change',
      subModuleId: subModule,
      topicTitle: `Voice Change: ${subModuleVoiceNames[subModule] || subModule}`,
      subModuleTitle: 'Active ↔ Passive Transformation Drill',
      onLaunch: (mode: DrillMode) => {
        launchVoiceDrillWithMode(subModule, mode);
      },
    });
  };

  const subModuleNarrationNames: Record<string, string> = {
    assertive: 'Assertive Sentences',
    interrogative: 'Interrogative Sentences',
    imperative: 'Imperative Sentences',
    exclamatory: 'Exclamatory Sentences',
    optative: 'Optative Sentences',
    mixed: 'Mixed Board Narration',
  };

  // Launch specialized Narration Change Drill
  const launchNarrationDrillWithMode = (subModule: NarrationSubModuleId, mode: DrillMode) => {
    const matched = NARRATION_QUESTIONS.filter((q) => q.subModule === subModule);
    const questionsToUse = matched.length > 0 ? matched : NARRATION_QUESTIONS;
    const shuffled = [...questionsToUse].sort(() => Math.random() - 0.5).slice(0, 10);
    setGameTitle(`Narration: ${subModuleNarrationNames[subModule] || subModule}`);
    setGameSubTitle('Direct ↔ Indirect Speech Drill');
    setGameInitialMode(mode);
    setActiveQuestions(shuffled);
    window.history.pushState({ page: 'game' }, '', '#game');
    setCurrentRoute('game');
  };

  const startNarrationDrill = (subModule: NarrationSubModuleId, forcedMode?: DrillMode) => {
    if (forcedMode) {
      launchNarrationDrillWithMode(subModule, forcedMode);
      return;
    }
    const savedPref = getDrillModePreference('narration', subModule);
    if (savedPref) {
      launchNarrationDrillWithMode(subModule, savedPref);
      return;
    }
    setPendingModeSelection({
      topicId: 'narration',
      subModuleId: subModule,
      topicTitle: `Narration: ${subModuleNarrationNames[subModule] || subModule}`,
      subModuleTitle: 'Direct ↔ Indirect Speech Drill',
      onLaunch: (mode: DrillMode) => {
        launchNarrationDrillWithMode(subModule, mode);
      },
    });
  };

  // Launch Last Hour Prep Test (Board Exam Simulator)
  const startLastHourPrepExam = () => {
    const questions = generateExamPaper();
    setExamQuestions(questions);
    window.history.pushState({ page: 'last_hour_prep_exam' }, '', '#last_hour_prep_exam');
    setCurrentRoute('last_hour_prep_exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishExam = (
    userAnswers: Record<string, string>,
    flaggedIds: string[],
    timeTakenSeconds: number
  ) => {
    let totalWeightedScore = 0;
    let rawCorrectCount = 0;
    const topicBreakdown: Record<string, ExamTopicScore> = {};

    EXAM_TOPIC_CONFIG.forEach((cfg) => {
      topicBreakdown[cfg.topicId] = {
        topicId: cfg.topicId,
        topicTitle: cfg.title,
        marks: cfg.marks,
        scoredMarks: 0,
        correctCount: 0,
        totalQuestions: cfg.count,
        perQuestionMark: cfg.perQuestionMark,
      };
    });

    examQuestions.forEach((q) => {
      const selected = userAnswers[q.id];
      const isCorrect = selected === q.correctAnswer;
      const questionMark = q.markValue !== undefined ? q.markValue : 1;

      if (isCorrect) {
        totalWeightedScore += questionMark;
        rawCorrectCount += 1;

        if (topicBreakdown[q.topicId]) {
          topicBreakdown[q.topicId].correctCount += 1;
          topicBreakdown[q.topicId].scoredMarks += questionMark;
        } else {
          const found = Object.keys(topicBreakdown).find((k) => q.topicId.includes(k) || k.includes(q.topicId));
          if (found) {
            topicBreakdown[found].correctCount += 1;
            topicBreakdown[found].scoredMarks += questionMark;
          }
        }
      }

      // Record question result in user state for analytics & mistakes pool
      setState((prev) => recordQuestionResult(prev, q.id, q.topicId, isCorrect));
    });

    // Clean rounding for floating point representation (e.g. 0.5 steps)
    const finalScore = Math.round(totalWeightedScore * 10) / 10;
    const gradeData = calculateExamGrade(finalScore, TOTAL_EXAM_MARKS);
    const bonusXP = Math.round(finalScore * 2);
    const bonusDiamonds = gradeData.diamondReward;

    // Apply XP and Diamond bonus to user state
    setState((prev) => {
      const withSession = recordStudySession(prev);
      const { newState } = addXPAndCoins(withSession, bonusXP, 0, bonusDiamonds);
      return newState;
    });

    const attempt: LastHourPrepAttempt = {
      id: `exam_${Date.now()}`,
      date: new Date().toISOString(),
      score: finalScore,
      totalMarks: TOTAL_EXAM_MARKS,
      totalQuestions: examQuestions.length,
      grade: gradeData.grade,
      percentage: gradeData.percentage,
      timeTakenSeconds,
      questionsAttemptedCount: Object.keys(userAnswers).length,
      rawCorrectCount,
      topicBreakdown,
      userAnswers,
      flaggedQuestionIds: flaggedIds,
      questions: examQuestions,
    };

    saveExamAttempt(attempt);
    setCurrentExamAttempt(attempt);
    triggerProgressSync();
    window.history.pushState({ page: 'last_hour_prep_results' }, '', '#last_hour_prep_results');
    setCurrentRoute('last_hour_prep_results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewPastAttempt = (attempt: LastHourPrepAttempt) => {
    setCurrentExamAttempt(attempt);
    window.history.pushState({ page: 'last_hour_prep_results' }, '', '#last_hour_prep_results');
    setCurrentRoute('last_hour_prep_results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Game action handlers
  const handleRecordResult = (
    questionId: string,
    topicId: string,
    isCorrect: boolean,
    subModuleId?: string
  ) => {
    setState((prev) => recordQuestionResult(prev, questionId, topicId, isCorrect, subModuleId));
  };

  const handleAddXP = (xp: number, coins: number) => {
    setState((prev) => {
      const withSession = recordStudySession(prev);
      const { newState, leveledUp, newlyUnlockedBadges } = addXPAndCoins(withSession, xp, coins);
      if (leveledUp || (newlyUnlockedBadges && newlyUnlockedBadges.length > 0)) {
        triggerProgressSync();
      }
      return newState;
    });
  };

  const handleToggleBookmark = (questionId: string) => {
    setState((prev) => toggleBookmarkQuestion(prev, questionId));
  };

  const handleUseHint = (): boolean => {
    const currentHints = state.inventory?.hints ?? 0;
    if (currentHints > 0) {
      setState((prev) => ({
        ...prev,
        inventory: {
          ...prev.inventory,
          hints: Math.max(0, (prev.inventory?.hints ?? 1) - 1),
        },
      }));
      return true;
    }
    return false;
  };

  const handleRefillHearts = () => {
    setState((prev) => ({
      ...prev,
      hearts: prev.maxHearts,
      lastHeartLostAt: null,
    }));
  };

  const handleClaimBadge = (badgeId: string) => {
    setState((prev) => ({
      ...prev,
      coins: prev.coins + 10,
      xp: prev.xp + 50,
      unclaimedBadges: (prev.unclaimedBadges || []).filter((id) => id !== badgeId),
    }));
    triggerProgressSync();
  };

  const handleBuyShopItem = (item: ShopItem) => {
    setState((prev) => {
      if (prev.coins < item.cost) return prev;
      const newCoins = prev.coins - item.cost;

      if (item.category === 'hearts') {
        return {
          ...prev,
          coins: newCoins,
          hearts: prev.maxHearts,
          lastHeartLostAt: null,
        };
      }

      if (item.category === 'hints' || item.category === 'boost') {
        return {
          ...prev,
          coins: newCoins,
          inventory: {
            ...prev.inventory,
            hints: prev.inventory.hints + 3,
          },
        };
      }

      if (item.category === 'frame') {
        return {
          ...prev,
          coins: newCoins,
          inventory: {
            ...prev.inventory,
            avatarFrames: [...prev.inventory.avatarFrames, item.id],
          },
          user: {
            ...prev.user,
            avatarFrame: item.id,
          },
        };
      }

      if (item.category === 'theme') {
        return {
          ...prev,
          coins: newCoins,
          inventory: {
            ...prev.inventory,
            themes: [...prev.inventory.themes, item.id],
          },
          activeTheme: item.id,
        };
      }

      return prev;
    });
  };

  const handleEquipShopItem = (category: string, itemId: string) => {
    setState((prev) => {
      if (category === 'frame') {
        return {
          ...prev,
          user: {
            ...prev.user,
            avatarFrame: itemId,
          },
        };
      }
      if (category === 'theme') {
        return {
          ...prev,
          activeTheme: itemId,
        };
      }
      return prev;
    });
  };

  const handleResetProgress = () => {
    const initial = getDefaultState();
    initial.firstTimeUser = false;
    initial.onboardingSubmittedToFormspree = true;
    updateState(initial);
  };

  const handleExportBackup = () => {
    exportStateAsJSON(state);
    updateState((prev) => ({
      ...prev,
      lastBackupAt: new Date().toISOString(),
      settings: {
        ...prev.settings,
        cacheWarningDismissed: true,
      },
    }));
  };

  const handleImportBackup = (jsonStr: string) => {
    const parsed = importStateFromJSON(jsonStr);
    if (parsed) {
      updateState(parsed);
    }
  };

  const handleDismissCacheWarning = () => {
    updateState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        cacheWarningDismissed: true,
      },
    }));
  };

  const handleTradeDiamonds = (hearts: number, cost?: number) => {
    const res = tradeDiamondsForHearts(state, hearts, cost);
    if (res.success) {
      updateState(res.newState);
    }
    return { success: res.success, message: res.message };
  };

  const handleTradeHints = (hints: number, cost: number) => {
    const res = tradeDiamondsForHints(state, hints, cost);
    if (res.success) {
      updateState(res.newState);
    }
    return { success: res.success, message: res.message };
  };

  const handleWatchMockAd = () => {
    const res = rewardMockAdWatch(state);
    if (res.success) {
      updateState(res.newState);
    }
    return { success: res.success, message: res.message };
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="global-app-toast"
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-2xl bg-slate-900/95 border border-pink-500/50 shadow-2xl text-xs sm:text-sm font-bold text-pink-300 flex items-center gap-2 animate-bounce"
        >
          <span>💖</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Main Navigation Bar */}
      <Navbar
        state={state}
        currentRoute={currentRoute}
        onNavigate={(route) => navigate(route)}
        onOpenShop={() => setShowShopModal(true)}
        onOpenHeartsShop={(tab) => handleOpenHeartsShop(tab || 'hearts')}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenRules={() => setShowRulesModal(true)}
        onOpenFeedback={() => setShowFeedbackModal(true)}
        onToggleSound={() => {
          const nextSound = !state.settings.sound;
          soundManager.setEnabled(nextSound);
          updateState({
            ...state,
            settings: { ...state.settings, sound: nextSound },
          });
        }}
      />

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-[15px] pb-0">
        {currentRoute === 'home' && (
          <HomeDashboard
            state={state}
            onNavigate={(route, params) => navigate(route, params)}
            onStartDailyChallenge={startDailyChallenge}
            onStartSmartPractice={startSmartPractice}
            onResumeDrillSession={resumeDrillSession}
            onOpenRules={() => setShowRulesModal(true)}
            onOpenCertificate={() => setShowCertModal(true)}
            onOpenHeartsShop={() => handleOpenHeartsShop('hearts')}
            onExportBackup={handleExportBackup}
            onDismissCacheWarning={handleDismissCacheWarning}
          />
        )}

        {currentRoute === 'practice_hub' && (
          <PracticeHub
            state={state}
            onStartVoiceDrill={startVoiceDrill}
            onStartNarrationDrill={startNarrationDrill}
            onOpenRules={() => setShowRulesModal(true)}
          />
        )}

        {currentRoute === 'topics' && (
          <TopicsLibrary
            state={state}
            onSelectTopic={(topicId, subtopicId) => {
              if (topicId === 'changing_sentences') {
                navigate('changing_sentences');
              } else {
                startTopicLesson(topicId, subtopicId);
              }
            }}
            onOpenRules={() => setShowRulesModal(true)}
          />
        )}

        {currentRoute === 'changing_sentences' && (
          <ChangingSentencesHub
            state={state}
            onStartDrill={(subtopicId, subtopicTitle, parentTopic = 'changing_sentences') =>
              startTopicLesson(parentTopic, subtopicId, undefined, subtopicTitle)
            }
            onOpenRules={() => setShowRulesModal(true)}
          />
        )}

        {currentRoute === 'last_hour_prep' && (
          <LastHourPrepSetup
            state={state}
            onStartExam={startLastHourPrepExam}
            onBackToDashboard={() => navigate('home')}
            onViewPastAttempt={handleViewPastAttempt}
          />
        )}

        {currentRoute === 'last_hour_prep_exam' && (
          <LastHourPrepExam
            questions={examQuestions}
            onFinishExam={handleFinishExam}
            onExit={() => navigate('home')}
          />
        )}

        {currentRoute === 'last_hour_prep_results' && currentExamAttempt && (
          <LastHourPrepResults
            attempt={currentExamAttempt}
            lastFeedbackDate={state.lastFeedbackDate}
            onRetakeExam={startLastHourPrepExam}
            onBackToDashboard={() => navigate('home')}
            onToast={showToast}
            onOpenFeedback={() => setShowFeedbackModal(true)}
          />
        )}

        {currentRoute === 'game' && (
          <GameScreen
            state={state}
            questions={activeQuestions}
            title={gameTitle}
            subTitle={gameSubTitle}
            initialMode={gameInitialMode}
            onComplete={(stats) => {
              const todayStr = new Date().toISOString().split('T')[0];
              if (gameTitle.includes('Daily Board Challenge')) {
                updateState((prev) => ({
                  ...prev,
                  dailyChallenge: {
                    lastCompletedDate: todayStr,
                    currentStreak: prev.dailyChallenge.currentStreak + 1,
                  },
                }));
              }
              triggerProgressSync();
            }}
            onRecordResult={handleRecordResult}
            onAddXP={handleAddXP}
            onToggleBookmark={handleToggleBookmark}
            onUseHint={handleUseHint}
            onRefillHearts={handleRefillHearts}
            onTradeDiamonds={handleTradeDiamonds}
            onExit={() => navigate('home')}
          />
        )}

        {currentRoute === 'review_wrong' && (
          <ReviewWrongPool
            state={state}
            onStartReviewDrill={(questions) =>
              startCustomDrill(questions, 'Mistake Review Session')
            }
            onNavigateHome={() => navigate('topics')}
          />
        )}

        {currentRoute === 'bookmarks' && (
          <BookmarksView
            state={state}
            onStartBookmarkDrill={(questions) =>
              startCustomDrill(questions, 'Saved Questions Revision')
            }
            onToggleBookmark={handleToggleBookmark}
            onNavigateHome={() => navigate('topics')}
          />
        )}

        {currentRoute === 'achievements' && (
          <AchievementsView state={state} onClaimBadge={handleClaimBadge} />
        )}

        {currentRoute === 'analytics' && (
          <AnalyticsView
            state={state}
            onOpenCertificate={() => setShowCertModal(true)}
            onNavigateTopic={(topicId) => startTopicLesson(topicId)}
          />
        )}

        {currentRoute === 'profile' && (
          <ProfileView
            state={state}
            onEditProfile={() => setShowIntroModal(true)}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
            onOpenCertificate={() => setShowCertModal(true)}
            onNavigateTopic={(topicId) => startTopicLesson(topicId)}
            onStartExam={startLastHourPrepExam}
            onToast={showToast}
            onUpdateAvatar={(newAvatar) => {
              updateState((prev) => ({
                ...prev,
                user: {
                  ...prev.user,
                  avatar: newAvatar,
                },
              }));
              if (isLoggedIn) {
                syncProfile({ avatar: newAvatar });
              }
            }}
          />
        )}
      </main>

      {/* Site-wide Persistent Footer */}
      <AppFooter hidden={currentRoute === 'game' || currentRoute === 'last_hour_prep_exam'} onToast={showToast} />

      {/* Global Modals */}
      {showRulesModal && (
        <RulesGuideModal onClose={() => setShowRulesModal(false)} />
      )}

      {showHeartsShopModal && (
        <HeartsShopModal
          hearts={state.hearts}
          maxHearts={state.maxHearts}
          hints={state.inventory?.hints ?? 3}
          maxHints={8}
          diamonds={state.diamonds}
          initialTab={heartsShopTab}
          onTradeDiamonds={handleTradeDiamonds}
          onTradeHints={handleTradeHints}
          onClose={() => setShowHeartsShopModal(false)}
        />
      )}

      {showOutOfHeartsModal && (
        <OutOfHeartsModal
          diamonds={state.diamonds}
          regenSecondsLeft={getNextHeartRegenSeconds(state)}
          lastAdWatchedAt={state.lastAdWatchedAt}
          onTradeDiamonds={handleTradeDiamonds}
          onWatchMockAd={handleWatchMockAd}
          onClose={() => setShowOutOfHeartsModal(false)}
          onOpenShop={() => {
            setShowOutOfHeartsModal(false);
            handleOpenHeartsShop('hearts');
          }}
        />
      )}

      {showShopModal && (
        <ShopModal
          state={state}
          onBuyItem={handleBuyShopItem}
          onEquipItem={handleEquipShopItem}
          onClose={() => setShowShopModal(false)}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          state={state}
          onUpdateState={(newState) => updateState(newState)}
          onResetProgress={handleResetProgress}
          onClose={() => setShowSettingsModal(false)}
          onOpenFeedback={() => setShowFeedbackModal(true)}
        />
      )}

      {showFeedbackModal && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          onSuccess={handleFeedbackSuccess}
        />
      )}

      {/* Mode Selection Pre-Drill Modal */}
      {pendingModeSelection && (
        <ModeSelectionModal
          isOpen={!!pendingModeSelection}
          topicTitle={pendingModeSelection.topicTitle}
          subModuleTitle={pendingModeSelection.subModuleTitle}
          topicId={pendingModeSelection.topicId}
          subModuleId={pendingModeSelection.subModuleId}
          initialMode="mcq"
          onSelectMode={(mode, remember) => {
            if (remember) {
              setDrillModePreference(
                pendingModeSelection.topicId,
                pendingModeSelection.subModuleId,
                mode
              );
            }
            const launch = pendingModeSelection.onLaunch;
            setPendingModeSelection(null);
            launch(mode);
          }}
          onClose={() => setPendingModeSelection(null)}
        />
      )}

      {/* Level 5 Milestone Feedback Prompt Toast */}
      {state.level >= 5 && !state.feedbackPromptLevel5 && (
        <div
          id="level-5-feedback-banner"
          className="fixed bottom-20 sm:bottom-6 right-4 left-4 sm:left-auto sm:max-w-md z-40 p-4 rounded-2xl bg-[#0d121f]/95 border border-cyan-500/40 shadow-2xl backdrop-blur-md animate-fade-in space-y-2.5"
          style={{ boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 25px rgba(6,182,212,0.15)' }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 border border-cyan-500/30">
                Lv.5
              </div>
              <div className="text-xs font-bold text-white">
                Milestone Reached!
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                updateState((prev) => ({ ...prev, feedbackPromptLevel5: true }));
              }}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Dismiss feedback prompt"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            You are leveling up fast. Mind sharing what you think of Gramify so far?
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              id="btn-level-5-send-feedback"
              onClick={() => {
                soundManager.playClick();
                updateState((prev) => ({ ...prev, feedbackPromptLevel5: true }));
                setShowFeedbackModal(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-all shadow cursor-pointer active:scale-95"
            >
              Send Feedback
            </button>
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                updateState((prev) => ({ ...prev, feedbackPromptLevel5: true }));
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}

      {showCertModal && (
        <CertificateModal
          state={state}
          onClose={() => setShowCertModal(false)}
        />
      )}

      {showIntroModal && (
        <StudentIntroModal
          initialProfile={state.user}
          isEditing={!state.firstTimeUser}
          onCompleteOnboarding={handleOnboardingComplete}
          onSave={(profile) => {
            const wasFirstTime = state.firstTimeUser;
            setShowIntroModal(false);
            updateState((prev) => ({
              ...prev,
              firstTimeUser: false,
              user: {
                ...prev.user,
                ...profile,
              },
            }));
            if (isLoggedIn) {
              syncProfile(profile);
            }
            if (wasFirstTime) {
              handleOnboardingComplete(profile);
            }
          }}
          onSaveProfile={(profile) => {
            const wasFirstTime = state.firstTimeUser;
            setShowIntroModal(false);
            updateState((prev) => ({
              ...prev,
              firstTimeUser: false,
              user: {
                ...prev.user,
                ...profile,
              },
            }));
            if (isLoggedIn) {
              syncProfile(profile);
            }
            if (wasFirstTime) {
              handleOnboardingComplete(profile);
            }
          }}
          onClose={() => setShowIntroModal(false)}
        />
      )}

      {/* Global Offline Mode Status Banner */}
      <OfflineIndicator />
    </div>
  );
}

export default App;
