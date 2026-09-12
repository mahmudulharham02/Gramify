import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Heart,
  Bookmark,
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Lightbulb,
  ArrowLeftRight,
  HelpCircle,
  Edit3,
  CheckSquare,
  Repeat,
  Info,
  Check
} from 'lucide-react';
import { Question, AppState, DrillMode, AnswerResultState } from '../types';
import { soundManager } from '../utils/sound';
import { getNextHeartRegenSeconds, formatHMS } from '../utils/storage';
import { Mascot, MascotMood } from './Mascot';
import {
  validateWriteAnswer,
  isSentenceTopic,
  getPlaceholderForTopic,
  getFormatTipsForTopic,
  WriteValidationResult
} from '../utils/writeModeValidator';

interface GameScreenProps {
  state: AppState;
  questions: Question[];
  title: string;
  subTitle?: string;
  initialMode?: DrillMode;
  onComplete: (sessionStats: { correct: number; total: number; xpEarned: number; coinsEarned: number }) => void;
  onRecordResult: (
    questionId: string,
    topicId: string,
    isCorrect: boolean,
    subModuleId?: string,
    mode?: DrillMode,
    answerStatus?: AnswerResultState
  ) => void;
  onAddXP: (xp: number, coins: number) => void;
  onToggleBookmark: (questionId: string) => void;
  onUseHint: () => boolean;
  onRefillHearts: () => void;
  onTradeDiamonds?: (hearts: number, cost?: number) => { success: boolean; message: string };
  onExit: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  state,
  questions,
  title,
  subTitle,
  initialMode = 'mcq',
  onComplete,
  onRecordResult,
  onAddXP,
  onToggleBookmark,
  onUseHint,
  onRefillHearts,
  onTradeDiamonds,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMode: DrillMode = (initialMode as DrillMode) || 'mcq';
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [selectedRearrangeWords, setSelectedRearrangeWords] = useState<string[]>([]);
  const [availableRearrangeWords, setAvailableRearrangeWords] = useState<string[]>([]);
  const [disabledOptionIndices, setDisabledOptionIndices] = useState<number[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answerStatus, setAnswerStatus] = useState<AnswerResultState>('wrong');
  const [validationResult, setValidationResult] = useState<WriteValidationResult | null>(null);
  const [showFormatTips, setShowFormatTips] = useState(false);

  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);
  const [sessionTotalXp, setSessionTotalXp] = useState(0);
  const [sessionTotalCoins, setSessionTotalCoins] = useState(0);
  const [mascotMood, setMascotMood] = useState<MascotMood>('neutral');
  const [mascotSpeech, setMascotSpeech] = useState<string | null>(null);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [countdownSecs, setCountdownSecs] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentQ = questions[currentIndex] || questions[0];
  const isSentence = currentQ ? isSentenceTopic(currentQ.topicId, currentQ.subModule) : false;

  useEffect(() => {
    if (!showGameOverModal) return;
    setCountdownSecs(getNextHeartRegenSeconds(state));
    const interval = setInterval(() => {
      setCountdownSecs(getNextHeartRegenSeconds(state));
    }, 1000);
    return () => clearInterval(interval);
  }, [showGameOverModal, state]);

  useEffect(() => {
    if (!currentQ) return;
    setSelectedOption(null);
    setTypedAnswer('');
    setIsAnswered(false);
    setAnswerStatus('wrong');
    setValidationResult(null);
    setDisabledOptionIndices([]);
    setMascotMood('neutral');
    setMascotSpeech(null);
    setShowFormatTips(false);

    if (currentQ.type === 'rearrange' && currentQ.rearrangeWords) {
      setAvailableRearrangeWords([...currentQ.rearrangeWords].sort(() => Math.random() - 0.5));
      setSelectedRearrangeWords([]);
    }

    // Auto focus on question change in Write mode
    if (currentMode === 'write') {
      setTimeout(() => {
        if (isSentence && textareaRef.current) {
          textareaRef.current.focus();
        } else if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 80);
    }
  }, [currentIndex, currentQ, currentMode, isSentence]);

  useEffect(() => {
    if (state.hearts <= 0 && !isAnswered && !showSessionSummary) {
      setShowGameOverModal(true);
    }
  }, [state.hearts, isAnswered, showSessionSummary]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showGameOverModal || showSessionSummary) return;

      if (!isAnswered) {
        if (currentMode === 'mcq' && currentQ?.options && (currentQ.type === 'mcq' || currentQ.type === 'transformation_mcq')) {
          if (['1', '2', '3', '4'].includes(e.key)) {
            const idx = parseInt(e.key, 10) - 1;
            if (idx < currentQ.options.length && !disabledOptionIndices.includes(idx)) {
              setSelectedOption(currentQ.options[idx]);
            }
          }
          if (e.key === 'Enter') {
            handleSubmitAnswer();
          }
        } else if (currentMode === 'write') {
          // In write mode: Enter submits single-line, or Cmd/Ctrl+Enter for textarea
          if (!isSentence && e.key === 'Enter') {
            e.preventDefault();
            handleSubmitAnswer();
          } else if (isSentence && e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleSubmitAnswer();
          }
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isAnswered,
    selectedOption,
    typedAnswer,
    selectedRearrangeWords,
    currentQ,
    currentMode,
    isSentence,
    disabledOptionIndices,
    showGameOverModal,
    showSessionSummary,
  ]);

  const fireVictoryConfetti = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#22d3ee', '#34d399', '#fbbf24', '#a78bfa'],
      });
    } catch {
      // ignore
    }
  };

  const handleSubmitAnswer = () => {
    if (isAnswered || !currentQ) return;

    if (currentMode === 'write') {
      if (!typedAnswer.trim()) return;

      const targetAnswers =
        currentQ.acceptedAnswers && currentQ.acceptedAnswers.length > 0
          ? currentQ.acceptedAnswers
          : [String(currentQ.correctAnswer)];

      const result = validateWriteAnswer(
        typedAnswer,
        targetAnswers,
        currentQ.topicId,
        currentQ.subModule,
        currentQ.explanation.rule
      );

      setValidationResult(result);
      setAnswerStatus(result.status);
      setIsAnswered(true);

      const isCorrectFlag = result.status === 'correct';

      onRecordResult(
        currentQ.id,
        currentQ.topicId,
        isCorrectFlag,
        currentQ.subModule,
        'write',
        result.status
      );

      if (result.status === 'correct') {
        soundManager.playCorrect();
        fireVictoryConfetti();
        const xpEarned = 10;
        const coinEarned = 1;
        setSessionCorrectCount((prev) => prev + 1);
        setSessionTotalXp((prev) => prev + xpEarned);
        setSessionTotalCoins((prev) => prev + coinEarned);
        onAddXP(xpEarned, coinEarned);

        setMascotMood('happy');
        setMascotSpeech('Spot on! Excellent typing.');
      } else if (result.status === 'almost_correct') {
        soundManager.playCorrect();
        const xpEarned = 5;
        setSessionTotalXp((prev) => prev + xpEarned);
        onAddXP(xpEarned, 0);

        setMascotMood('surprised');
        setMascotSpeech('Almost correct! Check the small difference.');
      } else {
        soundManager.playWrong();
        setMascotMood('sad');
        setMascotSpeech('Read the rule and compare below!');
      }
      return;
    }

    // MCQ Mode submission
    let correct = false;

    if (currentQ.type === 'mcq' || currentQ.type === 'transformation_mcq' || currentQ.type === 'true_false') {
      if (!selectedOption) return;
      const normalize = (str: string) =>
        str.trim().toLowerCase().replace(/\s+/g, ' ').replace(/\s+([.,!?;:"])/g, '$1');
      const cleanOption = normalize(selectedOption);
      const cleanTarget = normalize(String(currentQ.correctAnswer));
      const cleanIndexedTarget =
        currentQ.correctIndex !== undefined && currentQ.options && currentQ.options[currentQ.correctIndex]
          ? normalize(currentQ.options[currentQ.correctIndex])
          : '';
      correct = cleanOption === cleanTarget || (cleanIndexedTarget !== '' && cleanOption === cleanIndexedTarget);
    } else if (currentQ.type === 'fill_blank') {
      if (!typedAnswer.trim()) return;
      const userClean = typedAnswer.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').replace(/\s+/g, ' ');
      const targetClean = String(currentQ.correctAnswer).trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').replace(/\s+/g, ' ');
      correct = userClean === targetClean;
    } else if (currentQ.type === 'rearrange') {
      if (selectedRearrangeWords.length === 0) return;
      const builtSentence = selectedRearrangeWords.join(' ').trim().toLowerCase().replace(/\s+/g, ' ');
      const targetClean = String(currentQ.correctAnswer).trim().toLowerCase().replace(/\s+/g, ' ');
      correct = builtSentence === targetClean;
    }

    const status: AnswerResultState = correct ? 'correct' : 'wrong';
    setAnswerStatus(status);
    setIsAnswered(true);

    onRecordResult(currentQ.id, currentQ.topicId, correct, currentQ.subModule, 'mcq', status);

    if (correct) {
      soundManager.playCorrect();
      fireVictoryConfetti();
      const xpEarned = 10;
      const coinEarned = 1;
      setSessionCorrectCount((prev) => prev + 1);
      setSessionTotalXp((prev) => prev + xpEarned);
      setSessionTotalCoins((prev) => prev + coinEarned);
      onAddXP(xpEarned, coinEarned);

      setMascotMood('happy');
      setMascotSpeech('Nailed it, mate.');
    } else {
      soundManager.playWrong();
      setMascotMood('sad');
      setMascotSpeech('Read the Rules, mate!');
    }
  };

  const handleNextQuestion = () => {
    soundManager.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      soundManager.playLevelUp();
      setShowSessionSummary(true);
      onComplete({
        correct: sessionCorrectCount,
        total: questions.length,
        xpEarned: sessionTotalXp,
        coinsEarned: sessionTotalCoins,
      });
    }
  };

  const handleUse5050Hint = () => {
    if (isAnswered || !currentQ?.options || disabledOptionIndices.length > 0) return;
    const currentHints = state.inventory?.hints ?? 0;
    if (currentHints <= 0) {
      soundManager.playIncorrect();
      setMascotMood('surprised');
      setMascotSpeech("You're out of 50/50 hints! Recharge in the Grammar Shop.");
      return;
    }

    const granted = onUseHint();
    if (!granted) return;

    soundManager.playReward();
    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.8 },
      });
    } catch (_) {}

    const wrongIndices: number[] = [];
    currentQ.options.forEach((opt, idx) => {
      if (opt.trim().toLowerCase() !== String(currentQ.correctAnswer).trim().toLowerCase()) {
        wrongIndices.push(idx);
      }
    });

    const shuffled = wrongIndices.sort(() => Math.random() - 0.5);
    const toDisable = shuffled.slice(0, 2);
    setDisabledOptionIndices(toDisable);
    setMascotMood('thinking');
    setMascotSpeech('✨ I removed two incorrect choices for you!');
  };

  const handleWatchMockAd = () => {
    setIsWatchingAd(true);
    soundManager.playClick();
    setTimeout(() => {
      setIsWatchingAd(false);
      onRefillHearts();
      setShowGameOverModal(false);
      soundManager.playCorrect();
    }, 1500);
  };

  const isBookmarked = state.bookmarkedQuestionIds.includes(currentQ?.id);

  const canSubmit =
    !isAnswered &&
    (currentMode === 'write'
      ? !!typedAnswer.trim()
      : ((currentQ?.type === 'mcq' || currentQ?.type === 'transformation_mcq') && !!selectedOption) ||
        (currentQ?.type === 'fill_blank' && !!typedAnswer.trim()) ||
        (currentQ?.type === 'rearrange' && selectedRearrangeWords.length > 0) ||
        (currentQ?.type === 'true_false' && selectedOption !== null));

  const placeholderText = getPlaceholderForTopic(currentQ?.topicId, currentQ?.subModule);
  const formatTips = getFormatTipsForTopic(currentQ?.topicId);

  return (
    <div id="screen-game" className="relative z-content max-w-3xl mx-auto space-y-3.5 sm:space-y-4 w-full min-w-0 pb-16 sm:pb-8">
      {/* Top Header Controls Bar */}
      <div className="flex items-center justify-between gap-2 sm:gap-3 p-2.5 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 w-full min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button
            onClick={() => {
              soundManager.playClick();
              onExit();
            }}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors shrink-0 cursor-pointer"
          >
            ✕ Exit
          </button>
          <div className="min-w-0 flex-1">
            {subTitle ? (
              <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-medium truncate leading-none mb-0.5">
                <span className="text-slate-400 truncate max-w-[100px]">{title}</span>
                <span className="text-slate-600">›</span>
                <span className="text-cyan-300 font-semibold truncate">{subTitle}</span>
              </div>
            ) : null}
            <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-[150px] sm:max-w-xs">
              {subTitle || title}
            </h2>
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
              <span className="shrink-0 font-medium">
                Q {currentIndex + 1}/{questions.length}
              </span>
              {currentQ?.boardReference && (
                <span className="text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded font-mono truncate max-w-[100px] sm:max-w-none">
                  {currentQ.boardReference}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mode Indicator + Hearts, Bookmark & Hints */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mode Indicator Badge */}
          <div
            id="badge-drill-mode"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border select-none ${
              currentMode === 'write'
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
            }`}
          >
            {currentMode === 'write' ? (
              <>
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden xs:inline">Write Mode</span>
              </>
            ) : (
              <>
                <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden xs:inline">MCQ Mode</span>
              </>
            )}
          </div>

          {/* Hearts Counter */}
          <div className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 px-2 sm:px-2.5 py-1 rounded-xl text-rose-400 text-xs font-extrabold shrink-0">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse shrink-0" />
            <span>{state.hearts}</span>
          </div>

          {/* Bookmark */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleBookmark(currentQ.id);
            }}
            className={`p-1.5 sm:p-2 rounded-xl border transition-colors shrink-0 cursor-pointer ${
              isBookmarked
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Bookmark this question"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>

          {/* 50/50 Hint (only for MCQ) */}
          {currentMode === 'mcq' && (
            <button
              onClick={handleUse5050Hint}
              disabled={isAnswered || state.inventory.hints <= 0 || disabledOptionIndices.length > 0}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl bg-violet-500/20 border border-violet-500/30 hover:bg-violet-500/30 text-violet-300 text-xs font-bold disabled:opacity-40 transition-colors shrink-0 cursor-pointer"
              title="50/50 hint: removes 2 wrong options"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{state.inventory.hints}</span>
            </button>
          )}

          {/* Format Tips (for Write Mode) */}
          {currentMode === 'write' && (
            <button
              onClick={() => setShowFormatTips((prev) => !prev)}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 hover:text-white transition-colors shrink-0 cursor-pointer"
              title="Formatting Tips"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Format Tips Dropdown */}
      {showFormatTips && currentMode === 'write' && (
        <div className="p-3 rounded-2xl bg-[#0f172a] border border-cyan-500/30 shadow-lg text-xs space-y-1.5 text-slate-300 animate-fade-in">
          <div className="flex items-center justify-between font-bold text-cyan-400 text-xs">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Write Mode Tips for {currentQ.topicId.replace(/_/g, ' ')}</span>
            </span>
            <button
              type="button"
              onClick={() => setShowFormatTips(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
            {formatTips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Linear Progress Bar */}
      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-violet-400 to-lime-400 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Question Card Area */}
      {currentQ && (
        <div className="glass-panel rounded-3xl p-3.5 sm:p-6 border border-slate-800 flex flex-col gap-3.5 sm:gap-4 w-full min-w-0 overflow-hidden">
          {/* Question Direction & Submodule Tags */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 sm:px-2.5 py-1 rounded-lg border border-cyan-500/20 flex items-center gap-1.5 break-words max-w-full">
              <Sparkles className="w-3 h-3 shrink-0" />
              <span>{currentQ.instruction || 'Transform according to rules'}</span>
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {currentMode === 'write' ? '✍️ WRITE MODE' : '📝 MCQ MODE'}
              </span>

              {currentQ.direction && (
                <span className="text-[10px] sm:text-[11px] font-bold text-violet-300 bg-violet-500/10 px-2 sm:px-2.5 py-1 rounded-lg border border-violet-500/20 flex items-center gap-1 shrink-0">
                  <ArrowLeftRight className="w-3 h-3 shrink-0" />
                  <span>
                    {currentQ.direction === 'active_to_passive'
                      ? 'Active ➔ Passive'
                      : currentQ.direction === 'passive_to_active'
                      ? 'Passive ➔ Active'
                      : currentQ.direction === 'direct_to_indirect'
                      ? 'Direct ➔ Indirect'
                      : 'Indirect ➔ Direct'}
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Sentence / Prompt Display */}
          <div className="space-y-2 w-full min-w-0">
            {currentQ.sentence && (
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 w-full min-w-0 overflow-hidden">
                <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider mb-1">
                  Given Sentence / Context:
                </span>
                <span className="text-sm sm:text-base md:text-lg font-bold text-white break-words block leading-snug">
                  "{currentQ.sentence}"
                </span>
              </div>
            )}

            {currentQ.originalSentence && (
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 w-full min-w-0 overflow-hidden">
                <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider mb-1">
                  Original Sentence:
                </span>
                <span className="text-sm sm:text-base font-bold text-white break-words block leading-snug">
                  "{currentQ.originalSentence}"
                </span>
              </div>
            )}

            <h2 className="text-xs sm:text-sm md:text-base font-bold text-slate-200 leading-relaxed break-words">
              {currentQ.prompt}
            </h2>
          </div>

          {/* WRITE MODE INPUT AREA */}
          {currentMode === 'write' && (
            <div className="space-y-2.5 w-full min-w-0">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Your Answer:</span>
                </span>
                <span className="text-[11px] text-slate-500">
                  {isSentence ? 'Press Cmd/Ctrl + Enter to check' : 'Press Enter to check'}
                </span>
              </div>

              {isSentence ? (
                <textarea
                  ref={textareaRef}
                  id="textarea-write-answer"
                  rows={4}
                  value={typedAnswer}
                  disabled={isAnswered}
                  onChange={(e) => setTypedAnswer(e.target.value)}
                  onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  placeholder={placeholderText}
                  className="w-full min-h-[120px] bg-[#0f172a] border-2 border-slate-700 focus:border-cyan-400 text-slate-100 p-3 sm:p-4 rounded-2xl text-base font-sans leading-relaxed focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all placeholder:text-slate-500 disabled:opacity-80"
                  style={{ fontSize: '16px' }}
                />
              ) : (
                <input
                  ref={inputRef}
                  id="input-write-answer"
                  type="text"
                  value={typedAnswer}
                  disabled={isAnswered}
                  onChange={(e) => setTypedAnswer(e.target.value)}
                  onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  placeholder={placeholderText}
                  className="w-full h-14 min-h-[56px] bg-[#0f172a] border-2 border-slate-700 focus:border-cyan-400 text-slate-100 px-4 rounded-2xl text-base font-mono focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all placeholder:text-slate-500 disabled:opacity-80"
                  style={{ fontSize: '16px' }}
                />
              )}
            </div>
          )}

          {/* MCQ MODE OPTIONS AREA */}
          {currentMode === 'mcq' && (currentQ.type === 'mcq' || currentQ.type === 'transformation_mcq') && currentQ.options && (
            <div className="grid grid-cols-1 gap-2 sm:gap-2.5 w-full min-w-0">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isDisabled = disabledOptionIndices.includes(idx);

                let optionStyle = 'bg-slate-900/80 border-slate-700 text-slate-200 hover:border-cyan-500/50';

                if (isAnswered) {
                  const isThisCorrect = option.trim().toLowerCase() === String(currentQ.correctAnswer).trim().toLowerCase();
                  if (isThisCorrect) {
                    optionStyle = 'bg-emerald-950/70 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400/30';
                  } else if (isSelected && !isThisCorrect) {
                    optionStyle = 'bg-rose-950/70 border-rose-500 text-rose-100 ring-2 ring-rose-500/30';
                  } else {
                    optionStyle = 'opacity-40 bg-slate-900 border-slate-800';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-cyan-950/50 border-cyan-400 text-white ring-2 ring-cyan-400/20';
                }

                return (
                  <button
                    key={idx}
                    id={`option-btn-${idx}`}
                    disabled={isAnswered || isDisabled}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedOption(option);
                    }}
                    className={`w-full p-2.5 sm:p-3.5 md:p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-2.5 sm:gap-3 min-w-0 overflow-hidden cursor-pointer ${optionStyle} ${
                      isDisabled ? 'opacity-25 line-through cursor-not-allowed' : ''
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-slate-800 text-slate-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-slate-700 mt-0.5 sm:mt-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs sm:text-sm font-medium leading-relaxed break-words min-w-0 flex-1">{option}</span>
                    </div>

                    {isAnswered && (option.trim().toLowerCase().replace(/\s+/g, ' ').replace(/\s+([.,!?;:"])/g, '$1') === String(currentQ.correctAnswer).trim().toLowerCase().replace(/\s+/g, ' ').replace(/\s+([.,!?;:"])/g, '$1') || (currentQ.correctIndex !== undefined && idx === currentQ.correctIndex)) && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-1" />
                    )}
                    {isAnswered && isSelected && (option.trim().toLowerCase().replace(/\s+/g, ' ').replace(/\s+([.,!?;:"])/g, '$1') !== String(currentQ.correctAnswer).trim().toLowerCase().replace(/\s+/g, ' ').replace(/\s+([.,!?;:"])/g, '$1') && (currentQ.correctIndex === undefined || idx !== currentQ.correctIndex)) && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Fill in the Blank (MCQ mode fallback) */}
          {currentMode === 'mcq' && currentQ.type === 'fill_blank' && (
            <div className="space-y-3 w-full min-w-0">
              <input
                id="input-fill-blank"
                type="text"
                value={typedAnswer}
                disabled={isAnswered}
                onChange={(e) => setTypedAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-400 text-slate-100 px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-2xl text-xs sm:text-sm md:text-base font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
          )}

          {/* Rearrange Sentence (MCQ mode fallback) */}
          {currentMode === 'mcq' && currentQ.type === 'rearrange' && (
            <div className="space-y-3 w-full min-w-0">
              <div className="min-h-[52px] p-2.5 sm:p-3 rounded-2xl bg-slate-950/80 border-2 border-dashed border-slate-700 flex flex-wrap gap-1.5 sm:gap-2 items-center w-full min-w-0">
                {selectedRearrangeWords.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">Click words below in correct order...</span>
                ) : (
                  selectedRearrangeWords.map((word, i) => (
                    <button
                      key={i}
                      disabled={isAnswered}
                      onClick={() => {
                        if (isAnswered) return;
                        soundManager.playClick();
                        setSelectedRearrangeWords(selectedRearrangeWords.filter((_, idx) => idx !== i));
                        setAvailableRearrangeWords([...availableRearrangeWords, word]);
                      }}
                      className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-cyan-950 text-cyan-200 border border-cyan-500/40 text-xs font-mono font-bold hover:bg-rose-950 hover:text-rose-300 transition-all max-w-full break-all cursor-pointer"
                    >
                      {word} ✕
                    </button>
                  ))
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full min-w-0">
                {availableRearrangeWords.map((word, i) => (
                  <button
                    key={i}
                    disabled={isAnswered}
                    onClick={() => {
                      if (isAnswered) return;
                      soundManager.playClick();
                      setSelectedRearrangeWords([...selectedRearrangeWords, word]);
                      setAvailableRearrangeWords(availableRearrangeWords.filter((_, idx) => idx !== i));
                    }}
                    className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono font-bold transition-all hover:scale-105 active:scale-95 max-w-full break-words cursor-pointer"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* INLINE SUBMIT / NEXT ACTION BUTTON */}
          <div className="pt-1 w-full min-w-0">
            {!canSubmit && !isAnswered && (
              <button
                id="btn-disabled-check"
                disabled
                className="w-full min-h-[48px] sm:min-h-[56px] rounded-2xl bg-slate-800/80 text-slate-400 font-bold text-xs sm:text-base border border-slate-700/60 opacity-60 cursor-not-allowed flex items-center justify-center gap-2 px-3 py-2 text-center"
              >
                <span>{currentMode === 'write' ? '✍️ Type your answer first' : '👆 Select an option first'}</span>
              </button>
            )}

            {canSubmit && !isAnswered && (
              <button
                id="btn-check-answer"
                onClick={handleSubmitAnswer}
                className="w-full min-h-[48px] sm:min-h-[52px] rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm sm:text-base shadow-md active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 px-3 py-2 text-center cursor-pointer"
              >
                <span>Check Answer</span>
              </button>
            )}

            {isAnswered && (
              <button
                id="btn-next-question"
                onClick={handleNextQuestion}
                className="w-full min-h-[48px] sm:min-h-[52px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm sm:text-base shadow-md active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 px-3 py-2 text-center cursor-pointer"
              >
                <span>{currentIndex + 1 < questions.length ? 'Next Question →' : 'Finish Session 🏆'}</span>
              </button>
            )}
          </div>

          {/* WRITE MODE 4-PART EXPLANATION CARD */}
          {isAnswered && currentMode === 'write' && (
            <div
              id="write-mode-explanation-card"
              className={`rounded-2xl p-4 sm:p-5 border space-y-4 animate-fade-in w-full min-w-0 overflow-hidden ${
                answerStatus === 'correct'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : answerStatus === 'almost_correct'
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
              }`}
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2">
                  {answerStatus === 'correct' ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  ) : answerStatus === 'almost_correct' ? (
                    <AlertCircle className="w-6 h-6 text-amber-400 shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                      {answerStatus === 'correct'
                        ? 'Correct Answer! (+10 XP, +1 💎)'
                        : answerStatus === 'almost_correct'
                        ? 'Almost Correct! (+5 XP)'
                        : 'Incorrect Answer (-1 ❤️)'}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {answerStatus === 'correct'
                        ? 'Your typed answer matches board standards.'
                        : answerStatus === 'almost_correct'
                        ? 'Minor detail deviation — review differences below.'
                        : 'Review the correct answer and grammatical rule.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 1. YOUR ANSWER BOX */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">
                  1. Your Answer:
                </span>
                <div
                  className={`p-3 rounded-xl border text-sm sm:text-base font-medium break-words ${
                    answerStatus === 'correct'
                      ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-100'
                      : answerStatus === 'almost_correct'
                      ? 'bg-amber-950/80 border-amber-500/40 text-amber-100'
                      : 'bg-rose-950/80 border-rose-500/40 text-rose-100 line-through'
                  }`}
                >
                  {typedAnswer || '(No input)'}
                </div>
              </div>

              {/* 2. CORRECT ANSWER BOX */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-400">
                  2. Correct Board Answer:
                </span>
                <div className="p-3 rounded-xl bg-slate-900/95 border-2 border-emerald-500/60 text-emerald-300 text-sm sm:text-base font-bold break-words">
                  {currentQ.acceptedAnswers && currentQ.acceptedAnswers.length > 0
                    ? currentQ.acceptedAnswers[0]
                    : String(currentQ.correctAnswer)}
                </div>
                {currentQ.acceptedAnswers && currentQ.acceptedAnswers.length > 1 && (
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/[0.06] space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                      Other Accepted Variations:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentQ.acceptedAnswers.slice(1).map((alt, altIdx) => (
                        <span
                          key={altIdx}
                          className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 text-xs font-mono"
                        >
                          {alt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. WHAT YOU GOT WRONG (BULLETS) */}
              <div className="space-y-1.5 bg-slate-950/70 p-3 sm:p-3.5 rounded-xl border border-white/[0.06]">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-300 block">
                  3. What You Got Wrong / Key Differences:
                </span>
                <ul className="list-disc list-inside text-xs space-y-1 text-slate-200 leading-relaxed">
                  {validationResult?.diffBreakdown && validationResult.diffBreakdown.length > 0 ? (
                    validationResult.diffBreakdown.map((item, idx) => (
                      <li key={idx} className="break-words">
                        {item}
                      </li>
                    ))
                  ) : (
                    <li>{currentQ.explanation.whyCorrect}</li>
                  )}
                </ul>
              </div>

              {/* 4. THE RULE (ONE LINE) */}
              <div className="space-y-1 bg-slate-900/90 p-3 rounded-xl border border-cyan-500/30">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-cyan-400 block">
                  4. The Rule:
                </span>
                <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                  {currentQ.explanation.rule || currentQ.rule || 'Board Standard Transformation Rule'}
                </p>
              </div>

              {/* Formula if available */}
              {currentQ.explanation.formula && (
                <div className="bg-slate-950/90 p-2.5 rounded-lg border border-slate-800 text-[11px] sm:text-xs font-mono text-cyan-300 break-words">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Formula Reference:</span>
                  {currentQ.explanation.formula}
                </div>
              )}
            </div>
          )}

          {/* MCQ MODE EXPLANATION CARD */}
          {isAnswered && currentMode === 'mcq' && (
            <div
              id="feedback-card"
              className={`rounded-xl p-3 sm:p-4 border space-y-2.5 animate-fade-in w-full min-w-0 overflow-hidden ${
                answerStatus === 'correct'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-red-950/40 border-red-500/40 text-red-200'
              }`}
            >
              <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 sm:gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {answerStatus === 'correct' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm md:text-base font-bold text-white">
                    {answerStatus === 'correct' ? 'Correct! +10 XP (+1 💎)' : 'Incorrect (-1 Heart ❤️)'}
                  </span>
                </div>

                <span className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 break-words self-start xs:self-auto max-w-full">
                  {currentQ.explanation.rule}
                </span>
              </div>

              {/* Grammar Formula */}
              {currentQ.explanation.formula && (
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-[11px] sm:text-xs font-mono text-cyan-300 break-words overflow-x-auto">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Rule Formula:</span>
                  {currentQ.explanation.formula}
                </div>
              )}

              {/* Detailed Reason */}
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed break-words">
                {currentQ.explanation.whyCorrect}
              </p>

              {currentQ.explanation.tip && (
                <div className="p-2 rounded-lg bg-slate-900/60 text-xs text-amber-300 font-medium break-words border border-amber-500/20">
                  {currentQ.explanation.tip}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Floating Mascot in Corner */}
      <div className="fixed bottom-16 sm:bottom-20 right-2 sm:right-6 z-10 pointer-events-none drop-shadow-xl scale-75 sm:scale-100 origin-bottom-right">
        <Mascot mood={mascotMood} size="sm" showSpeech={mascotSpeech} />
      </div>

      {/* Game Over Modal (0 Hearts) */}
      {showGameOverModal && (
        <div
          id="modal-game-over"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div className="w-full max-w-sm sm:max-w-md rounded-2xl p-4 sm:p-5 text-center space-y-3.5 border border-white/[0.08] bg-[#0f172a] shadow-2xl my-auto animate-fade-in max-h-[92vh] overflow-y-auto">
            <div className="text-3xl sm:text-4xl">💔</div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Out of Hearts</h3>
              <p className="text-xs text-slate-400 mt-1">
                You need at least 1 ❤️ to continue your drill session.
              </p>
            </div>

            {/* 1. PRIMARY: Trade Diamonds (1 💎 = 3 ❤️) */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-red-500/30 text-left space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">💎</span>
                  <span className="text-xs font-bold text-white">Instant Refill (1 💎 = 3 ❤️)</span>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {state.diamonds} 💎
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                <button
                  type="button"
                  disabled={state.diamonds < 1}
                  onClick={() => {
                    if (onTradeDiamonds) {
                      const res = onTradeDiamonds(3, 1);
                      if (res.success) {
                        setShowGameOverModal(false);
                      }
                    }
                  }}
                  className={`p-2 rounded-lg border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                    state.diamonds >= 1
                      ? 'bg-red-500/20 hover:bg-red-500/30 border-red-500/50 text-white'
                      : 'bg-slate-800/40 border-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span className="text-xs font-bold text-red-300">+3 ❤️</span>
                  <span className="text-[10px] font-mono text-cyan-400">1 💎</span>
                </button>

                <button
                  type="button"
                  disabled={state.diamonds < 3}
                  onClick={() => {
                    if (onTradeDiamonds) {
                      const res = onTradeDiamonds(9, 3);
                      if (res.success) {
                        setShowGameOverModal(false);
                      }
                    }
                  }}
                  className={`p-2 rounded-lg border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                    state.diamonds >= 3
                      ? 'bg-red-500/20 hover:bg-red-500/30 border-red-500/50 text-white'
                      : 'bg-slate-800/40 border-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span className="text-xs font-bold text-red-300">+9 ❤️</span>
                  <span className="text-[10px] font-mono text-cyan-400">3 💎</span>
                </button>

                <button
                  type="button"
                  disabled={state.diamonds < 7}
                  onClick={() => {
                    if (onTradeDiamonds) {
                      const res = onTradeDiamonds(20, 7);
                      if (res.success) {
                        setShowGameOverModal(false);
                      }
                    }
                  }}
                  className={`p-2 rounded-lg border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                    state.diamonds >= 7
                      ? 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/50 text-white'
                      : 'bg-slate-800/40 border-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span className="text-xs font-bold text-amber-300">Full (20)</span>
                  <span className="text-[10px] font-mono text-amber-400">7 💎</span>
                </button>
              </div>
            </div>

            {/* 2. SECONDARY: Watch Mock Ad */}
            <button
              id="btn-watch-ad-refill"
              disabled={isWatchingAd}
              onClick={handleWatchMockAd}
              className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isWatchingAd ? 'Refilling Hearts...' : '📺 Watch Sponsor Clip (+5 ❤️)'}</span>
            </button>

            {/* 3. TERTIARY: Wait 3 Hours */}
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/[0.08] flex items-center justify-between text-left">
              <div>
                <span className="text-xs font-semibold text-slate-400 block">Wait for Auto-Refill</span>
                <span className="text-[10px] text-slate-500">Each heart takes 3 hours to refill</span>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {formatHMS(countdownSecs)}
              </span>
            </div>

            <button
              id="btn-exit-to-home"
              onClick={() => {
                setShowGameOverModal(false);
                onExit();
              }}
              className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Session Summary Modal */}
      {showSessionSummary && (
        <div
          id="modal-session-summary"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div className="w-full max-w-sm sm:max-w-md rounded-2xl p-5 sm:p-6 text-center space-y-4 border border-white/[0.08] bg-[#0f172a] shadow-2xl my-auto animate-fade-in max-h-[92vh] overflow-y-auto">
            <div className="text-4xl">🎉</div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Drill Completed</h3>
              <p className="text-xs text-slate-400 mt-1">{title}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-950/70 p-3 rounded-xl border border-white/[0.08]">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Score</span>
                <span className="text-base font-bold text-emerald-400 block">
                  {sessionCorrectCount}/{questions.length}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">XP</span>
                <span className="text-base font-bold text-cyan-400 block">
                  +{sessionTotalXp}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Coins</span>
                <span className="text-base font-bold text-amber-400 block">
                  +{sessionTotalCoins}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowSessionSummary(false);
                onExit();
              }}
              className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
