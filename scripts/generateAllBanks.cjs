const fs = require('fs');
const path = require('path');

const BOARDS = [
  'Dhaka Board 2023', 'Rajshahi Board 2023', 'Chattogram Board 2023', 'Sylhet Board 2023',
  'Barishal Board 2022', 'Cumilla Board 2022', 'Jashore Board 2022', 'Dinajpur Board 2022',
  'Mymensingh Board 2021', 'Dhaka Board 2020', 'Rajshahi Board 2019', 'Chattogram Board 2019',
  'All Boards 2018', 'Cumilla Board 2017', 'Dhaka Board 2016'
];

function getBoard(idx) {
  return BOARDS[idx % BOARDS.length];
}

function makeMCQ(id, topicId, subtopicId, subModule, instruction, prompt, sentence, correctAns, dist1, dist2, dist3, rule, why, diff = 'medium', formula = '', tip = '') {
  const options = [correctAns, dist1, dist2, dist3];
  // Deterministic shuffle
  const hash = Math.abs(id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
  const shift = hash % 4;
  const shuffled = [];
  for (let i = 0; i < 4; i++) {
    shuffled[(i + shift) % 4] = options[i];
  }
  const correctIdx = shuffled.indexOf(correctAns);

  return {
    id,
    topicId,
    subtopicId,
    subModule,
    type: 'mcq',
    instruction: instruction || 'Choose the correct option:',
    prompt: prompt || sentence,
    sentence: sentence || prompt,
    options: shuffled,
    correctAnswer: correctAns,
    correctIndex: correctIdx,
    difficulty: diff,
    boardReference: getBoard(hash),
    rule,
    explanation: {
      rule,
      formula: formula || undefined,
      whyCorrect: why,
      tip: tip || 'Analyze the context and grammatical agreement carefully.'
    }
  };
}

console.log('Script template ready.');
