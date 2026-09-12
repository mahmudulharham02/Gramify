import { TopicId } from '../types';

export type WriteAnswerStatus = 'correct' | 'almost_correct' | 'wrong';

export interface WriteValidationResult {
  status: WriteAnswerStatus;
  scoreRatio: number; // 0 to 1
  userNormalized: string;
  targetNormalized: string;
  diffBreakdown: string[];
  ruleSummary: string;
}

// Normalize a string for validation
export function normalizeSentence(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[“”"']/g, '') // remove quotes
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '') // remove punctuation
    .replace(/\s+/g, ' ') // collapse multiple spaces
    .trim();
}

export function normalizeSingleWord(str: string): string {
  if (!str) return '';
  let clean = str.toLowerCase().trim();
  // Handle articles zero representations
  if (clean === 'x' || clean === 'no article' || clean === 'zero' || clean === 'zero article' || clean === '-') {
    return 'x';
  }
  return clean.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').replace(/\s+/g, ' ').trim();
}

// Check if a topic uses single-word or multi-line sentence answers
export function isSentenceTopic(topicId: string, subModule?: string): boolean {
  if (
    topicId === 'changing_sentences' ||
    topicId === 'completing_sentences' ||
    topicId === 'punctuation' ||
    subModule?.includes('voice') ||
    subModule?.includes('narration') ||
    subModule?.includes('simple_complex') ||
    subModule?.includes('degree') ||
    subModule?.includes('affirmative')
  ) {
    return true;
  }
  return false;
}

export function getPlaceholderForTopic(topicId: string, subModule?: string): string {
  if (subModule?.includes('voice') || subModule?.startsWith('voice_') || topicId === 'changing_sentences' && subModule?.includes('voice')) {
    return 'Type the transformed sentence...';
  }
  if (subModule?.includes('narration') || subModule?.startsWith('narration_') || topicId === 'changing_sentences' && subModule?.includes('narration')) {
    return 'Type the indirect speech...';
  }

  switch (topicId) {
    case 'articles':
      return 'Type a, an, the, or x...';
    case 'preposition':
      return 'Type the correct preposition...';
    case 'right_form_of_verbs':
      return 'Type the correct verb form...';
    case 'completing_sentences':
      return 'Complete the sentence...';
    case 'connectors':
      return 'Type the correct linker...';
    case 'synonyms_antonyms':
      if (subModule?.includes('synonym')) return 'Type a synonym...';
      if (subModule?.includes('antonym')) return 'Type an antonym...';
      return 'Type the synonym or antonym...';
    case 'punctuation':
      return 'Type the corrected sentence...';
    case 'modifiers':
      return 'Type the correct modifier...';
    case 'tag_questions_and_special':
      return 'Type the correct tag...';
    case 'changing_sentences':
      return 'Type the transformed sentence...';
    default:
      return 'Type your answer...';
  }
}

export function getFormatTipsForTopic(topicId: string): string[] {
  switch (topicId) {
    case 'articles':
      return [
        'Type "a", "an", "the", or "x" for zero article.',
        'Case does not matter ("An" and "an" are both accepted).',
      ];
    case 'preposition':
      return [
        'Type the single preposition word (e.g., "to", "of", "with", "at", "for").',
        'Verify dependent verbs (e.g. "senior to", "abide by").',
      ];
    case 'right_form_of_verbs':
      return [
        'Type the correct conjugated verb form (e.g., "went", "had seen", "playing").',
        'Check tense markers and subject-verb agreement.',
      ];
    case 'changing_sentences':
      return [
        'Type the full transformed sentence clearly.',
        'Check tense preservation, modal auxiliaries, and clause structure.',
        'Minor article/preposition errors receive Almost Correct points.',
      ];
    case 'completing_sentences':
      return [
        'Type the remaining clause or phrase (e.g. "than the train left" or "to walk").',
        'Check conditional clauses (if/had) and conjunctions (lest + should).',
      ];
    case 'connectors':
      return [
        'Type the logical connector or linker (e.g. "Moreover", "However", "Therefore", "In spite of").',
      ];
    case 'synonyms_antonyms':
      return [
        'Type the exact synonym or antonym requested in the prompt.',
      ];
    case 'punctuation':
      return [
        'Type the full sentence with appropriate commas, quotation marks, and capitalization.',
      ];
    case 'modifiers':
      return [
        'Type the modifying word or phrase requested (e.g., "broken", "very", "running in the field").',
      ];
    case 'tag_questions_and_special':
      return [
        'Type the auxiliary verb + pronoun tag (e.g., "didn\'t he", "shall we", "aren\'t I").',
      ];
    default:
      return ['Type your answer carefully and submit.'];
  }
}

// Calculate Levenshtein similarity ratio between 0 and 1
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  if (s1 === s2) return 1.0;
  if (!s1.length || !s2.length) return 0.0;

  const track = Array(s2.length + 1)
    .fill(null)
    .map(() => Array(s1.length + 1).fill(null));

  for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
  for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;

  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  const distance = track[s2.length][s1.length];
  const maxLen = Math.max(s1.length, s2.length);
  return 1.0 - distance / maxLen;
}

// Validate Write Mode Answer
export function validateWriteAnswer(
  userInput: string,
  targetAnswer: string | string[],
  topicId: string,
  subModule?: string,
  ruleHint?: string
): WriteValidationResult {
  const isSentence = isSentenceTopic(topicId, subModule);

  const rawTargets = Array.isArray(targetAnswer) ? targetAnswer : [String(targetAnswer)];
  const targets = rawTargets.map((t) => String(t).trim()).filter(Boolean);
  if (targets.length === 0) {
    targets.push('');
  }

  // 1. Check exact match against all possible targets
  for (const t of targets) {
    if (!isSentence) {
      const uNorm = normalizeSingleWord(userInput);
      const tNorm = normalizeSingleWord(t);
      if (uNorm && (uNorm === tNorm || (tNorm === 'x' && (uNorm === 'x' || uNorm === 'no' || uNorm === 'none')))) {
        return {
          status: 'correct',
          scoreRatio: 1.0,
          userNormalized: userInput.trim(),
          targetNormalized: t,
          diffBreakdown: ['Perfect match! Exactly right according to board standard.'],
          ruleSummary: ruleHint || 'Exact match with official board answer key.',
        };
      }
    } else {
      const uNorm = normalizeSentence(userInput);
      const tNorm = normalizeSentence(t);
      if (uNorm && uNorm === tNorm) {
        return {
          status: 'correct',
          scoreRatio: 1.0,
          userNormalized: userInput.trim(),
          targetNormalized: t,
          diffBreakdown: ['All words and structure matched precisely.'],
          ruleSummary: ruleHint || 'Transformed structure follows board grammatical rules.',
        };
      }
    }
  }

  // 2. If not sentence topic -> single-word fuzzy match against closest target
  if (!isSentence) {
    const uNorm = normalizeSingleWord(userInput);
    let bestSim = 0;
    let bestTarget = targets[0];

    for (const t of targets) {
      const tNorm = normalizeSingleWord(t);
      const sim = calculateSimilarity(uNorm, tNorm);
      if (sim > bestSim) {
        bestSim = sim;
        bestTarget = t;
      }
    }

    const breakdown: string[] = [];

    if (bestSim >= 0.85 && uNorm.length > 3) {
      breakdown.push(`Minor spelling difference: You typed "${userInput.trim()}", expected form is "${bestTarget}".`);
      return {
        status: 'almost_correct',
        scoreRatio: 0.85,
        userNormalized: userInput.trim(),
        targetNormalized: bestTarget,
        diffBreakdown: breakdown,
        ruleSummary: ruleHint || 'Check spelling and exact morphological suffix.',
      };
    }

    breakdown.push(`Expected "${targets[0]}" but received "${userInput.trim() || '(empty)'}".`);
    return {
      status: 'wrong',
      scoreRatio: 0,
      userNormalized: userInput.trim() || '(blank)',
      targetNormalized: targets[0],
      diffBreakdown: breakdown,
      ruleSummary: ruleHint || 'Review the core grammatical rule for this topic.',
    };
  }

  // 3. Sentence topic fuzzy match against closest matching accepted target
  const uNorm = normalizeSentence(userInput);
  const uWords = uNorm.split(' ').filter(Boolean);

  if (uWords.length === 0) {
    return {
      status: 'wrong',
      scoreRatio: 0,
      userNormalized: '(empty answer)',
      targetNormalized: targets[0],
      diffBreakdown: ['No answer was provided.'],
      ruleSummary: ruleHint || 'Review the transformation formula.',
    };
  }

  interface MatchEvaluation {
    target: string;
    compositeScore: number;
    missingWords: string[];
    extraWords: string[];
    isMinorArticleDiff: boolean;
    isMinorPrepDiff: boolean;
  }

  let bestEval: MatchEvaluation = {
    target: targets[0],
    compositeScore: -1,
    missingWords: [],
    extraWords: [],
    isMinorArticleDiff: false,
    isMinorPrepDiff: false,
  };

  for (const t of targets) {
    const tNorm = normalizeSentence(t);
    const tWords = tNorm.split(' ').filter(Boolean);

    let matchCount = 0;
    const missingWords: string[] = [];
    const extraWords: string[] = [];
    const tSet = new Set(tWords);
    const uSet = new Set(uWords);

    tWords.forEach((tw) => {
      if (uSet.has(tw)) {
        matchCount += 1;
      } else {
        missingWords.push(tw);
      }
    });

    uWords.forEach((uw) => {
      if (!tSet.has(uw)) {
        extraWords.push(uw);
      }
    });

    const wordOverlapRatio = tWords.length > 0 ? matchCount / tWords.length : 0;
    const sentenceSimilarity = calculateSimilarity(uNorm, tNorm);
    const compositeScore = Math.max(wordOverlapRatio, sentenceSimilarity);

    const isMinorArticleDiff =
      (uWords.includes('a') && tWords.includes('an')) ||
      (uWords.includes('an') && tWords.includes('a')) ||
      (uWords.includes('the') && tWords.includes('a')) ||
      (uWords.includes('a') && tWords.includes('the'));

    const isMinorPrepDiff =
      (uWords.includes('by') && tWords.includes('with')) ||
      (uWords.includes('with') && tWords.includes('by')) ||
      (uWords.includes('in') && tWords.includes('at')) ||
      (uWords.includes('at') && tWords.includes('in'));

    if (compositeScore > bestEval.compositeScore) {
      bestEval = {
        target: t,
        compositeScore,
        missingWords,
        extraWords,
        isMinorArticleDiff,
        isMinorPrepDiff,
      };
    }
  }

  const diffBreakdown: string[] = [];

  if (bestEval.isMinorArticleDiff) {
    diffBreakdown.push('Article nuance: Notice indefinite vs definite article distinction (a/an/the).');
  }
  if (bestEval.isMinorPrepDiff) {
    diffBreakdown.push('Preposition distinction: Check the exact preposition required (e.g. by vs with).');
  }
  if (bestEval.missingWords.length > 0 && bestEval.missingWords.length <= 3) {
    diffBreakdown.push(`Missing key word(s): ${bestEval.missingWords.map((w) => `"${w}"`).join(', ')}`);
  }
  if (bestEval.extraWords.length > 0 && bestEval.extraWords.length <= 3) {
    diffBreakdown.push(`Unexpected word(s): ${bestEval.extraWords.map((w) => `"${w}"`).join(', ')}`);
  }

  if (
    bestEval.compositeScore >= 0.8 ||
    (bestEval.compositeScore >= 0.75 && (bestEval.isMinorArticleDiff || bestEval.isMinorPrepDiff))
  ) {
    if (diffBreakdown.length === 0) {
      diffBreakdown.push('Minor word order or phrasing variation from standard key.');
    }
    return {
      status: 'almost_correct',
      scoreRatio: bestEval.compositeScore,
      userNormalized: userInput.trim(),
      targetNormalized: bestEval.target,
      diffBreakdown,
      ruleSummary: ruleHint || 'Almost there! Pay close attention to subtle modifiers and verb forms.',
    };
  }

  // Wrong answer
  if (diffBreakdown.length === 0) {
    diffBreakdown.push('Structural and tense differences from standard board transformation.');
  }

  return {
    status: 'wrong',
    scoreRatio: bestEval.compositeScore,
    userNormalized: userInput.trim(),
    targetNormalized: bestEval.target || targets[0],
    diffBreakdown,
    ruleSummary: ruleHint || 'Review the transformation rule and tense alignment.',
  };
}
