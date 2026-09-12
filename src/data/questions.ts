import { Question } from '../types';
import { VOICE_CHANGE_QUESTIONS } from './voiceChangeQuestions';
import { NARRATION_QUESTIONS } from './narrationQuestions';
import { VOICE_CHANGE_BANK } from './voiceChangeBank';
import { NARRATION_BANK } from './narrationBank';

// Import all 10 Topic Question Banks
import { RIGHT_FORM_OF_VERBS_QUESTIONS } from './rightFormOfVerbsBank';
import { ARTICLES_QUESTIONS } from './articlesBank';
import { PREPOSITIONS_QUESTIONS } from './prepositionsBank';
import { COMPLETING_SENTENCES_QUESTIONS } from './completingSentencesBank';
import { CONNECTORS_QUESTIONS } from './connectorsBank';
import { SYNONYMS_ANTONYMS_QUESTIONS } from './synonymsAntonymsBank';
import { PUNCTUATION_QUESTIONS } from './punctuationBank';
import { MODIFIERS_QUESTIONS } from './modifiersBank';
import { CHANGING_SENTENCES_QUESTIONS } from './changingSentencesBank';
import { TAG_QUESTIONS_QUESTIONS } from './tagQuestionsBank';

export {
  VOICE_CHANGE_BANK,
  NARRATION_BANK,
  VOICE_CHANGE_QUESTIONS,
  NARRATION_QUESTIONS,
  RIGHT_FORM_OF_VERBS_QUESTIONS,
  ARTICLES_QUESTIONS,
  PREPOSITIONS_QUESTIONS,
  COMPLETING_SENTENCES_QUESTIONS,
  CONNECTORS_QUESTIONS,
  SYNONYMS_ANTONYMS_QUESTIONS,
  PUNCTUATION_QUESTIONS,
  MODIFIERS_QUESTIONS,
  CHANGING_SENTENCES_QUESTIONS,
  TAG_QUESTIONS_QUESTIONS
};

export const QUESTIONS_DATA: Question[] = [
  ...RIGHT_FORM_OF_VERBS_QUESTIONS,
  ...ARTICLES_QUESTIONS,
  ...PREPOSITIONS_QUESTIONS,
  ...COMPLETING_SENTENCES_QUESTIONS,
  ...CONNECTORS_QUESTIONS,
  ...SYNONYMS_ANTONYMS_QUESTIONS,
  ...PUNCTUATION_QUESTIONS,
  ...MODIFIERS_QUESTIONS,
  ...CHANGING_SENTENCES_QUESTIONS,
  ...TAG_QUESTIONS_QUESTIONS,
  ...VOICE_CHANGE_QUESTIONS,
  ...NARRATION_QUESTIONS
];

export function getQuestionsByTopic(topicId: string, subtopicId?: string): Question[] {
  return getQuestionsByTopicAndSubtopic(topicId, subtopicId);
}

export function getQuestionsByTopicAndSubtopic(
  topicId: string,
  subtopicIdOrName?: string,
  subtopicTitle?: string
): Question[] {
  const topicQuestions = QUESTIONS_DATA.filter((q) => q.topicId === topicId);
  if (!subtopicIdOrName && !subtopicTitle) {
    return topicQuestions;
  }

  const cleanId = (subtopicIdOrName || '').toLowerCase().trim();
  const cleanTitle = (subtopicTitle || '').toLowerCase().trim();

  const matches = topicQuestions.filter((q) => {
    const qSubId = (q.subtopicId || '').toLowerCase().trim();
    const qSubName = (q.subtopic || '').toLowerCase().trim();
    const qSubMod = (q.subModule || '').toLowerCase().trim();

    // Direct exact match
    if (cleanId && (qSubId === cleanId || qSubMod === cleanId || qSubName === cleanId)) {
      return true;
    }
    if (cleanTitle && (qSubName === cleanTitle || qSubId === cleanTitle)) {
      return true;
    }

    // Changing Sentences specific subtopic filtering
    if (topicId === 'changing_sentences') {
      if (cleanId === 'voice_change' || cleanTitle.includes('voice')) {
        return qSubId === 'voice_change' || qSubName === 'voice change' || qSubMod === 'voice_change';
      }
      if (cleanId === 'narration' || cleanTitle.includes('narration') || cleanTitle.includes('speech')) {
        return qSubId === 'narration' || qSubName === 'narration' || qSubMod === 'narration';
      }
      if (cleanId === 'affirmative_negative' || cleanTitle.includes('negative') || cleanTitle.includes('affirmative')) {
        return qSubId === 'affirmative_negative' || qSubName === 'affirmative to negative' || qSubMod === 'affirmative_negative';
      }
      if (
        cleanId === 'simple_compound_complex' ||
        cleanId === 'simple_complex_compound' ||
        cleanTitle.includes('simple') ||
        cleanTitle.includes('complex') ||
        cleanTitle.includes('compound')
      ) {
        return (
          qSubId === 'simple_compound_complex' ||
          qSubName === 'simple complex compound' ||
          qSubMod === 'simple_complex_compound'
        );
      }
      if (
        cleanId === 'degree' ||
        cleanId === 'degree_transformation' ||
        cleanId === 'degrees_of_comparison' ||
        cleanTitle.includes('degree') ||
        cleanTitle.includes('comparison')
      ) {
        return (
          qSubId === 'degree' ||
          qSubName === 'degrees of comparison' ||
          qSubMod === 'degree' ||
          qSubMod === 'degree_transformation'
        );
      }
      if (cleanId === 'assertive_interrogative' || cleanTitle.includes('interrogative')) {
        return (
          qSubId === 'assertive_interrogative' ||
          qSubName === 'assertive to interrogative' ||
          qSubMod === 'assertive_interrogative'
        );
      }
      if (cleanId === 'assertive_exclamatory' || cleanTitle.includes('exclamatory')) {
        return (
          qSubId === 'assertive_exclamatory' ||
          qSubName === 'assertive to exclamatory' ||
          qSubMod === 'assertive_exclamatory'
        );
      }
      if (cleanId === 'assertive_imperative' || cleanTitle.includes('imperative')) {
        return (
          qSubId === 'assertive_imperative' ||
          qSubName === 'assertive to imperative' ||
          qSubMod === 'assertive_imperative'
        );
      }
    }

    return false;
  });

  return matches;
}

export function getRandomQuestions(count: number, topicId?: string): Question[] {
  const pool = topicId
    ? QUESTIONS_DATA.filter((q) => q.topicId === topicId)
    : QUESTIONS_DATA;
  
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.length));
}

export function getDailyChallengeQuestions(): Question[] {
  // 1 question from each available topic group
  const distinctTopics = Array.from(new Set(QUESTIONS_DATA.map((q) => q.topicId)));
  const dailySet: Question[] = [];

  for (const topic of distinctTopics) {
    const topicPool = QUESTIONS_DATA.filter((q) => q.topicId === topic);
    if (topicPool.length > 0) {
      const randomIdx = Math.floor(Math.random() * topicPool.length);
      dailySet.push(topicPool[randomIdx]);
    }
  }

  // If less than 10, fill with random questions up to 10
  if (dailySet.length < 10) {
    const remaining = QUESTIONS_DATA.filter((q) => !dailySet.some((d) => d.id === q.id));
    const extra = remaining.sort(() => Math.random() - 0.5).slice(0, 10 - dailySet.length);
    dailySet.push(...extra);
  }

  return dailySet;
}

export const ALL_QUESTIONS = QUESTIONS_DATA;
export default QUESTIONS_DATA;
