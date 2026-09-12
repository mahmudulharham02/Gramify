export type QuestionType =
  | 'mcq'
  | 'fill_blank'
  | 'rearrange'
  | 'spot_error'
  | 'true_false'
  | 'transformation_mcq'
  | 'match_pairs';

export type TopicId =
  | 'right_form_of_verbs'
  | 'articles'
  | 'preposition'
  | 'completing_sentences'
  | 'connectors'
  | 'synonyms_antonyms'
  | 'punctuation'
  | 'modifiers'
  | 'changing_sentences'
  | 'tag_questions_and_special';

export type VoiceSubModuleId =
  | 'simple_present'
  | 'present_continuous'
  | 'present_perfect'
  | 'simple_past'
  | 'past_continuous'
  | 'past_perfect'
  | 'simple_future'
  | 'future_perfect'
  | 'modals'
  | 'imperatives'
  | 'interrogatives'
  | 'negatives';

export type NarrationSubModuleId =
  | 'assertive'
  | 'interrogative'
  | 'imperative'
  | 'exclamatory'
  | 'optative'
  | 'mixed';

export type ChangingSentenceSubtopic =
  | 'voice_change'
  | 'simple_complex_compound'
  | 'degree_comparison'
  | 'affirmative_negative'
  | 'assertive_interrogative'
  | 'exclamatory_assertive'
  | 'mixed_board_transformations';


export interface Question {
  id: string;
  topicId: TopicId;
  subtopicId?: string;
  subtopic?: string;
  subTopic?: string;
  subModule?: string;
  direction?: string; // e.g. 'active_to_passive' | 'passive_to_active' | 'direct_to_indirect' | 'indirect_to_direct'
  type: QuestionType;
  instruction: string;
  prompt: string;
  sentence?: string; // Target sentence or context
  originalSentence?: string; // For transformations
  targetTransformation?: string; // e.g. "(Make it Passive)" or "(Make it Complex)"
  options?: string[]; // 4 options for MCQ
  correctAnswer: string | string[] | number | boolean; // Answer or index
  acceptedAnswers?: string[]; // Multiple valid answers for Write Mode
  correctIndex?: number;
  rearrangeWords?: string[]; // For sentence rearrange
  errorTokens?: { text: string; isError: boolean }[]; // For spot error
  matchPairs?: { left: string; right: string }[]; // For matching
  explanation: {
    rule: string;
    formula?: string;
    whyCorrect: string;
    whyWrong?: { [optionIndex: number]: string };
    tenseShift?: string;
    timeShift?: string;
    pronounShift?: string;
    tip?: string;
  };
  rule?: string;
  rules?: string[];
  boardReference?: string; // e.g., "Dhaka Board 2023", "Cumilla Board 2022"
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface SubTopic {
  id: string;
  title: string;
  bengaliTitle?: string;
  description: string;
  marksWeightage?: string;
  rulesSummary: string[];
}

export interface TopicInfo {
  id: TopicId;
  number: number;
  title: string;
  bengaliTitle: string;
  marks: number;
  icon: string;
  accentColor: string;
  description: string;
  subtopics: SubTopic[];
}

export type DrillMode = 'mcq' | 'write';
export type AnswerResultState = 'correct' | 'almost_correct' | 'wrong';

export interface SubModuleProgressItem {
  attempts: number;
  correct: number;
  wrong: number;
  mastery: number;
  mcqAttempts?: number;
  mcqCorrect?: number;
  mcqWrong?: number;
  mcqAccuracy?: number;
  writeAttempts?: number;
  writeCorrect?: number;
  writeAlmostCorrect?: number;
  writeWrong?: number;
  writeModeAccuracy?: number;
}

export interface TopicProgressItem {
  unlocked: boolean;
  completedLessons: string[];
  bestScores: Record<string, number>;
  attempts: number;
  correct: number;
  wrong: number;
  mastery: number; // 0 to 100%
  mcqAttempts?: number;
  mcqCorrect?: number;
  mcqWrong?: number;
  mcqAccuracy?: number;
  writeAttempts?: number;
  writeCorrect?: number;
  writeAlmostCorrect?: number;
  writeWrong?: number;
  writeModeAccuracy?: number;
  subModules?: Record<string, SubModuleProgressItem>;
}

export interface Badge {
  id: string;
  title: string;
  icon: string;
  description: string;
  category: 'progress' | 'streak' | 'mastery' | 'special';
  xpReward: number;
  coinReward: number;
  unlockedAt?: string;
}

export interface ShopItem {
  id: string;
  name: string;
  title?: string;
  category: 'theme' | 'frame' | 'hints' | 'hearts' | 'boost';
  cost: number;
  icon: string;
  description: string;
  previewColor?: string;
  frameClass?: string;
}

export interface GrammarTip {
  id: string;
  topic: string;
  title: string;
  tip: string;
  example: string;
  boardNote: string;
}

export interface GrammarRule {
  id: string;
  topicId: TopicId;
  topicName: string;
  title: string;
  example1: string;
  example2: string;
  example3: string;
  tip: string;
  boardReference?: string;
}

export interface CurrentDrillSession {
  topicId: string;
  subModuleId?: string;
  subtopicId?: string;
  mode?: DrillMode;
  title: string;
  subTitle?: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswers?: Record<number, string>;
  sessionStartTime: number;
  questionIds: string[];
}

export interface SmartPracticeStats {
  totalSmartSessions: number;
  totalWeakSpotQuestions: number;
  totalWeakSpotCorrect: number;
  lastWeakSpotModule: string | null;
  lastSessionDate: string | null;
}

export interface DailyChallengeState {
  lastCompletedDate: string | null;
  currentStreak: number;
  todayQuestionsIds?: string[];
  todayCompleted?: boolean;
  score?: number;
}

export interface StudentProfile {
  name: string | null;
  roll: string | null;
  roll_id?: string | null;
  institute?: string | null;
  college_name: string;
  group: string | null; // Science | Humanities | Business Studies
  board: string | null; // Dhaka | Rajshahi | Chattogram | Sylhet | Barishal | Cumilla | Jashore | Mymensingh | Dinajpur | Madrasah
  avatar: string;
  avatarFrame?: string;
  joinedAt: string | null;
  title: string;
  gender: 'male' | 'female' | null;
}

export interface AppState {
  version: number;
  user: StudentProfile;
  supabaseUserId?: string | null;
  lastSyncedAt?: string | null;
  syncPreference?: 'auto' | 'manual';
  xp: number;
  level: number;
  coins: number;
  diamonds: number;
  hearts: number;
  maxHearts: number;
  lastHeartLostAt: string | null;
  lastAdWatchedAt: string | null;
  streak: number;
  bestStreak?: number;
  totalStudyMinutes?: number;
  lastStudyDate: string | null;
  lastBackupAt: string | null;
  settings: {
    sound: boolean;
    theme: 'dark' | 'light';
    timerEnabled: boolean;
    timerSeconds: number;
    cacheWarningDismissed: boolean;
  };
  inventory: {
    themes: string[];
    avatarFrames: string[];
    hints: number;
  };
  activeTheme: string;
  badges: string[]; // Badge IDs
  unclaimedBadges: string[];
  topicProgress: Record<string, TopicProgressItem>;
  dailyChallenge: DailyChallengeState;
  bookmarkedQuestionIds: string[];
  wrongQuestionReviewPool: string[]; // Question IDs missed by user
  recentScores: { date: string; score: number; topic: string }[];
  firstTimeUser: boolean;
  currentDrillSession?: CurrentDrillSession | null;
  smartPracticeStats?: SmartPracticeStats;
  authTeaserDismissedForever?: boolean;
  cacheWarningCollapsed?: boolean;
  dailyRuleIndex?: number;
  feedbackCount?: number;
  lastFeedbackDate?: string | null;
  feedbackPromptLevel5?: boolean;
  onboardingSubmittedToFormspree?: boolean;
  onboardingSubmittedAt?: string | null;
}
