const fs = require('fs');
const path = require('path');

// Load generators from our modular scripts
const p1 = require('./generateMasterPart1.cjs');

// Let's create the master script that merges all topics
const part2Code = fs.readFileSync(path.join(__dirname, 'buildBanksPart2.cjs'), 'utf8');
const part3Code = fs.readFileSync(path.join(__dirname, 'buildBanksPart3.cjs'), 'utf8');
const part4Code = fs.readFileSync(path.join(__dirname, 'buildBanksPart4.cjs'), 'utf8');
const part5Code = fs.readFileSync(path.join(__dirname, 'buildBanksPart5.cjs'), 'utf8');
const part6Code = fs.readFileSync(path.join(__dirname, 'buildBanksPart6.cjs'), 'utf8');
const part7Code = fs.readFileSync(path.join(__dirname, 'buildBanksPart7.cjs'), 'utf8');

// Evaluate generator functions
eval(part2Code);
eval(part3Code);
eval(part4Code);
eval(part5Code);
eval(part6Code);
eval(part7Code);

function writeBankFile(filename, arrayName, topicId, items) {
  const content = `import { Question } from '../types';

export const ${arrayName}: Question[] = ${JSON.stringify(items, null, 2)};

export default ${arrayName};
`;
  const fullPath = path.join(__dirname, '..', 'src', 'data', filename);
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Wrote ${items.length} questions to ${filename}`);
  return items;
}

const prepList = generatePrepositions();
const csList = generateCompletingSentences();
const connList = generateConnectors();
const saList = generateSynonymsAntonyms();
const puncList = generatePunctuation();
const modList = generateModifiers();
const tagList = generateTagQuestions();
const changeList = generateChangingSentences();

writeBankFile('prepositionsBank.ts', 'PREPOSITIONS_QUESTIONS', 'preposition', prepList);
writeBankFile('completingSentencesBank.ts', 'COMPLETING_SENTENCES_QUESTIONS', 'completing_sentences', csList);
writeBankFile('connectorsBank.ts', 'CONNECTORS_QUESTIONS', 'connectors', connList);
writeBankFile('synonymsAntonymsBank.ts', 'SYNONYMS_ANTONYMS_QUESTIONS', 'synonyms_antonyms', saList);
writeBankFile('punctuationBank.ts', 'PUNCTUATION_QUESTIONS', 'punctuation', puncList);
writeBankFile('modifiersBank.ts', 'MODIFIERS_QUESTIONS', 'modifiers', modList);
writeBankFile('tagQuestionsBank.ts', 'TAG_QUESTIONS_QUESTIONS', 'tag_questions', tagList);
writeBankFile('changingSentencesBank.ts', 'CHANGING_SENTENCES_QUESTIONS', 'changing_sentences', changeList);

// Also generate index.ts that aggregates everything
const indexContent = `import { Question } from '../types';
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

export const ALL_QUESTIONS_DATA: Question[] = [
  ...RIGHT_FORM_OF_VERBS_QUESTIONS,
  ...ARTICLES_QUESTIONS,
  ...PREPOSITIONS_QUESTIONS,
  ...COMPLETING_SENTENCES_QUESTIONS,
  ...CONNECTORS_QUESTIONS,
  ...SYNONYMS_ANTONYMS_QUESTIONS,
  ...PUNCTUATION_QUESTIONS,
  ...MODIFIERS_QUESTIONS,
  ...CHANGING_SENTENCES_QUESTIONS,
  ...TAG_QUESTIONS_QUESTIONS
];

export const QUESTIONS_DATA = ALL_QUESTIONS_DATA;

export default ALL_QUESTIONS_DATA;
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'index.ts'), indexContent, 'utf8');
console.log(`Generated index.ts with total ${prepList.length + csList.length + connList.length + saList.length + puncList.length + modList.length + tagList.length + changeList.length + 120 + 125} questions!`);
