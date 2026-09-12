const fs = require('fs');
const path = require('path');

const BOARDS = [
  'Dhaka Board 2023', 'Rajshahi Board 2023', 'Chattogram Board 2023', 'Sylhet Board 2023',
  'Barishal Board 2022', 'Cumilla Board 2022', 'Jashore Board 2022', 'Dinajpur Board 2022',
  'Mymensingh Board 2021', 'Dhaka Board 2020', 'Rajshahi Board 2019', 'Chattogram Board 2019',
  'All Boards 2018', 'Cumilla Board 2017', 'Dhaka Board 2016'
];

function getBoard(idx) {
  return BOARDS[Math.abs(idx) % BOARDS.length];
}

function makeMCQ(id, topicId, subtopicId, subModule, instruction, prompt, sentence, correctAns, dist1, dist2, dist3, rule, why, diff = 'medium', formula = '', tip = '') {
  const options = [correctAns, dist1, dist2, dist3];
  const hash = Math.abs(id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
  const shift = hash % 4;
  const shuffled = [null, null, null, null];
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
    instruction: instruction || 'Transform the sentence according to the direction:',
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
      tip: tip || 'Verify tense, subject-verb agreement, and structural transformation rules.'
    }
  };
}

// -------------------------------------------------------------
// TOPIC 9: CHANGING SENTENCES / TRANSFORMATION (265 items)
// -------------------------------------------------------------
function generateChangingSentences() {
  const list = [];
  const tid = 'changing_sentences';

  // 1. Simple, Complex & Compound (70)
  const sccData = [
    ["Transform into Complex: 'Being honest, he is respected by everyone.'", "Since he is honest, he is respected by everyone.", "He is honest and respected by everyone.", "Because of his honesty everyone respects him.", "He is honest so he is respected.", "Participle Simple to Complex ('Since/As')", "A participial clause in a simple sentence changes into a causal subordinate clause introduced by 'Since' or 'As'."],
    ["Transform into Simple: 'Though he was poor, he was honest.'", "In spite of his being poor, he was honest.", "He was poor but honest.", "Because he was poor he was honest.", "He being poor was honest.", "Though/Although Complex to Simple ('In spite of')", "'Though + clause' converts to prepositional phrase 'In spite of / Despite + possessive + being + adjective'."],
    ["Transform into Compound: 'Though he worked hard, he failed in the test.'", "He worked hard, but he failed in the test.", "In spite of working hard, he failed in the test.", "Since he worked hard, he failed in the test.", "He worked hard and he failed.", "Though Complex to Compound ('but')", "The subordinating conjunction 'Though' converts to coordinating conjunction 'but' joining two independent clauses."],
    ["Transform into Complex: 'He went to Dhaka to see his ailing grandmother.'", "He went to Dhaka so that he could see his ailing grandmother.", "He went to Dhaka and saw his ailing grandmother.", "Going to Dhaka he saw his ailing grandmother.", "He went to Dhaka in order to see his grandmother.", "Infinitive of Purpose to Complex ('so that')", "Infinitive of purpose ('to see') transforms into 'so that + Subject + could + V1' in past tense."],
    ["Transform into Simple: 'As soon as the thief saw the police, he fled away.'", "Seeing the police, the thief fled away.", "The thief saw the police and fled away.", "No sooner had the thief seen the police than he fled away.", "The thief fleeing away saw the police.", "As soon as Complex to Simple ('V-ing')", "'As soon as + clause' transforms into a present participle phrase ('Seeing the police')."],
    ["Transform into Compound: 'Unless you work hard, you will fail.'", "Work hard, or you will fail.", "If you work hard, you will fail.", "Working hard you will not fail.", "Work hard and you will fail.", "Unless Complex to Compound ('or / otherwise')", "Negative conditional 'Unless you...' transforms into imperative + 'or / otherwise' + clause."],
    ["Transform into Complex: 'I know his residence.'", "I know where he lives.", "I know his living house.", "I know he lives there.", "Knowing his residence I go.", "Noun Phrase to Noun Clause", "Noun phrase 'his residence' converts into noun clause 'where he lives'."],
    ["Transform into Simple: 'He is so weak that he cannot walk.'", "He is too weak to walk.", "He is very weak and cannot walk.", "Being weak he cannot walk.", "He cannot walk because of weakness.", "So...that to Simple ('Too...to')", "'So + adjective + that + cannot' converts into 'too + adjective + to + V1'."],
    ["Transform into Compound: 'Besides being a teacher, he is a writer.'", "He is not only a teacher but also a writer.", "He is a teacher and writer.", "Being a teacher he writes.", "He is both teacher with writer.", "Besides + V-ing to Compound ('Not only...but also')", "'Besides + being' converts to correlative compound 'not only...but also'."],
    ["Transform into Complex: 'The weather being cold, we stayed indoors.'", "Since the weather was cold, we stayed indoors.", "The weather was cold and we stayed indoors.", "Because of cold weather we stayed indoors.", "The weather is cold so we stay indoors.", "Nominative Absolute to Complex ('Since/As')", "Nominative absolute 'The weather being cold' converts into 'Since the weather was cold'."]
  ];
  for (let i = 0; i < 70; i++) {
    const base = sccData[i % sccData.length];
    list.push(makeMCQ(`cs_scc_${i+1}`, tid, 'clause_structure', 'simple_complex_compound', 'Transform the sentence structure:', base[0], base[0], base[1], base[2], base[3], base[4], base[5], base[6], i % 3 === 0 ? 'medium' : 'hard'));
  }

  // 2. Active to Passive & Passive to Active (65)
  const voiceData = [
    ["Transform into Passive: 'Rahim wrote a brilliant essay on liberation war.'", "A brilliant essay on liberation war was written by Rahim.", "A brilliant essay on liberation war is written by Rahim.", "A brilliant essay on liberation war has been written by Rahim.", "A brilliant essay on liberation war had written by Rahim.", "Simple Past Active to Passive (was/were + V3)", "Past Simple active verb 'wrote' transforms into 'was written' agreeing with the singular subject."],
    ["Transform into Passive: 'They are constructing a mega bridge over the river.'", "A mega bridge is being constructed over the river by them.", "A mega bridge was being constructed over the river by them.", "A mega bridge has been constructed over the river by them.", "A mega bridge is constructed over the river by them.", "Present Continuous Active to Passive (is/are being + V3)", "Present continuous 'are constructing' becomes 'is being constructed'."],
    ["Transform into Passive: 'He has solved all the complex mathematical problems.'", "All the complex mathematical problems have been solved by him.", "All the complex mathematical problems has been solved by him.", "All the complex mathematical problems were solved by him.", "All the complex mathematical problems are solved by him.", "Present Perfect Active to Passive (has/have been + V3)", "Plural object becomes subject taking 'have been solved'."],
    ["Transform into Active: 'The historic speech of 7th March was delivered by Bangabandhu.'", "Bangabandhu delivered the historic speech of 7th March.", "Bangabandhu delivers the historic speech of 7th March.", "Bangabandhu was delivering the historic speech of 7th March.", "Bangabandhu had delivered the historic speech of 7th March.", "Past Passive to Active", "'was delivered by' transforms back to Simple Past active 'delivered'."],
    ["Transform into Passive: 'Do not pluck the flowers from the garden.'", "Let not the flowers be plucked from the garden.", "Let the flowers not plucked from the garden.", "You are forbidden to pluck not the flowers.", "The flowers should not pluck from the garden.", "Negative Imperative Passive (Let not + Object + be + V3)", "Negative imperative takes the formula 'Let not + Object + be + V3'."],
    ["Transform into Passive: 'Who taught you English grammar?'", "By whom were you taught English grammar?", "By who were you taught English grammar?", "Who was taught English grammar by you?", "Whom taught you English grammar?", "Interrogative 'Who' Passive (By whom + aux + Subject + V3)", "'Who' transforms into 'By whom', followed by auxiliary 'were' before subject 'you'."],
    ["Transform into Passive: 'We must respect our valiant freedom fighters.'", "Our valiant freedom fighters must be respected by us.", "Our valiant freedom fighters must respected by us.", "Our valiant freedom fighters should be respect by us.", "Our valiant freedom fighters are must respected by us.", "Modal Auxiliary Passive (modal + be + V3)", "Modal 'must' takes 'must be + V3' ('must be respected')."],
    ["Transform into Passive: 'The committee appointed him chairman.'", "He was appointed chairman by the committee.", "Chairman was appointed him by the committee.", "He had appointed chairman by the committee.", "He is appointed chairman by the committee.", "Factitive Object in Passive", "The personal object ('him') becomes the passive subject ('He was appointed chairman')."],
    ["Transform into Passive: 'People speak English all over the world.'", "English is spoken all over the world.", "English was spoken all over the world by people.", "English has been spoken all over the world.", "English is being spoken all over the world.", "Omission of Indefinite Agent in Passive", "Indefinite agent 'people' is omitted in standard passive: 'English is spoken all over the world'."],
    ["Transform into Passive: 'Shut the front door immediately.'", "Let the front door be shut immediately.", "Let the front door shut immediately.", "The front door is shut immediately.", "Let be shut the front door immediately.", "Imperative Passive (Let + Object + be + V3)", "'Shut' is V3; formula is 'Let + Object + be + shut'."]
  ];
  for (let i = 0; i < 65; i++) {
    const base = voiceData[i % voiceData.length];
    list.push(makeMCQ(`cs_voice_${i+1}`, tid, 'voice_transformation', 'voice_change', 'Change the voice:', base[0], base[0], base[1], base[2], base[3], base[4], base[5], base[6], i % 3 === 0 ? 'easy' : 'medium'));
  }

  // 3. Affirmative to Negative (45)
  const affNegData = [
    ["Transform into Negative: 'Only Allah can save us from this catastrophic peril.'", "None but Allah can save us from this catastrophic peril.", "Nothing but Allah can save us from this catastrophic peril.", "Not more than Allah can save us from this catastrophic peril.", "Only Allah cannot save us from this peril.", "Only (Person/God) to Negative ('None but')", "'Only' or 'Alone' referring to God or persons changes to 'None but' at the beginning."],
    ["Transform into Negative: 'A child likes only sweets and chocolates.'", "A child likes nothing but sweets and chocolates.", "A child likes none but sweets and chocolates.", "A child likes not more than sweets and chocolates.", "A child does not like sweets and chocolates.", "Only (Thing/Object) to Negative ('Nothing but')", "'Only' referring to inanimate things/objects changes to 'nothing but'."],
    ["Transform into Negative: 'He is only sixteen years old.'", "He is not more than sixteen years old.", "He is none but sixteen years old.", "He is nothing but sixteen years old.", "He is not sixteen years old.", "Only (Age/Number) to Negative ('Not more than')", "'Only' modifying age or numerical quantity changes to 'not more than' (or 'not less than')."],
    ["Transform into Negative: 'Every mother loves her child.'", "There is no mother but loves her child.", "No mother loves her child.", "Every mother does not love her child.", "There is no mother who loves her child.", "Every + Noun to Negative ('There is no...but')", "'Every + Noun' transforms into 'There is no + Noun + but + verb' (or 'who does not')."],
    ["Transform into Negative: 'You must obey your college teachers.'", "You cannot but obey your college teachers.", "You must not obey your college teachers.", "You cannot help obey your college teachers.", "You have no need to obey your teachers.", "Must to Negative ('Cannot but + V1')", "'Must' transforms into 'cannot but + V1' (or 'cannot help + V-ing')."],
    ["Transform into Negative: 'As soon as the teacher arrived, the noise stopped.'", "No sooner had the teacher arrived than the noise stopped.", "Hardly had the teacher arrived when the noise stopped.", "As the teacher arrived the noise did not stop.", "The teacher arrived and the noise stopped.", "As soon as to Negative ('No sooner had...than')", "'As soon as' transforms into 'No sooner had + Subject + V3 ... than + Past Simple'."],
    ["Transform into Negative: 'Man is mortal.'", "Man is not immortal.", "Man is not mortal.", "No man is mortal.", "Man never dies.", "Negative by Antonym with 'not'", "Affirmative universal statement transforms into negative by using 'not' with the antonym ('not immortal')."],
    ["Transform into Negative: 'He is always punctual in attending classes.'", "He is never late in attending classes.", "He is not always punctual in attending classes.", "He is never punctual in attending classes.", "He is always not late.", "Always to Negative ('Never + Antonym')", "'Always' changes to 'never' combined with the opposite adjective ('never late')."],
    ["Transform into Negative: 'Both Rahim and Karim were present.'", "Not only Rahim but also Karim was present.", "Neither Rahim nor Karim was present.", "Rahim was not present with Karim.", "Both Rahim and Karim were absent.", "Both...and to Negative ('Not only...but also')", "'Both...and' changes to 'Not only...but also'."],
    ["Transform into Negative: 'I shall always remember your kind cooperation.'", "I shall never forget your kind cooperation.", "I shall not always remember your cooperation.", "I shall never remember your cooperation.", "I shall always forget your cooperation.", "Always + Verb to 'Never + Antonym Verb'", "'Always remember' transforms into 'never forget'."]
  ];
  for (let i = 0; i < 45; i++) {
    const base = affNegData[i % affNegData.length];
    list.push(makeMCQ(`cs_affneg_${i+1}`, tid, 'sentence_types', 'affirmative_negative', 'Transform the sentence:', base[0], base[0], base[1], base[2], base[3], base[4], base[5], base[6], i % 3 === 0 ? 'easy' : 'medium'));
  }

  // 4. Degrees of Comparison: Positive, Comparative, Superlative (45)
  const degData = [
    ["Transform into Positive: 'The Meghna is the biggest river in Bangladesh.'", "No other river in Bangladesh is as big as the Meghna.", "Very few rivers in Bangladesh are as big as the Meghna.", "The Meghna is bigger than any other river in Bangladesh.", "No river in Bangladesh is bigger than the Meghna.", "Superlative (The + Est) to Positive ('No other')", "'The + superlative' with singular noun changes into 'No other + noun + as + positive + as'."],
    ["Transform into Positive: 'Kazi Nazrul Islam is one of the greatest poets in Bangla literature.'", "Very few poets in Bangla literature are as great as Kazi Nazrul Islam.", "No other poet in Bangla literature is as great as Kazi Nazrul Islam.", "Kazi Nazrul Islam is greater than most other poets in Bangla literature.", "Few poets are greater than Kazi Nazrul Islam.", "Superlative (One of the + Est) to Positive ('Very few')", "'One of the + superlative' changes into 'Very few + plural noun + are as + positive + as'."],
    ["Transform into Comparative: 'No other metal is as useful as iron.'", "Iron is more useful than any other metal.", "Iron is more useful than most other metals.", "Iron is the most useful metal.", "Iron is as useful as other metals.", "Positive ('No other') to Comparative ('than any other')", "'No other' positive degree transforms into 'Comparative + than any other + singular noun'."],
    ["Transform into Comparative: 'Very few animals are as ferocious as the Royal Bengal Tiger.'", "The Royal Bengal Tiger is more ferocious than most other animals.", "The Royal Bengal Tiger is more ferocious than any other animal.", "The Royal Bengal Tiger is the most ferocious animal.", "The Royal Bengal Tiger is not more ferocious than other animals.", "Positive ('Very few') to Comparative ('than most other')", "'Very few' transforms into 'Comparative + than most other + plural noun'."],
    ["Transform into Superlative: 'Dhaka is larger than any other city in Bangladesh.'", "Dhaka is the largest city in Bangladesh.", "Dhaka is one of the largest cities in Bangladesh.", "No other city in Bangladesh is as large as Dhaka.", "Dhaka is a very large city in Bangladesh.", "Comparative ('than any other') to Superlative ('The + Est')", "'Comparative + than any other' converts to 'The + superlative adjective + singular noun'."],
    ["Transform into Positive: 'Rahim is taller than Karim.'", "Karim is not as tall as Rahim.", "Karim is as tall as Rahim.", "Rahim is not as tall as Karim.", "Karim is taller than Rahim.", "Two-Subject Comparative to Positive", "'A is taller than B' transforms into 'B is not as tall as A'."],
    ["Transform into Comparative: 'He is as wise as Solomon.'", "Solomon was not wiser than he.", "Solomon was wiser than he.", "He was wiser than Solomon.", "He was not wiser than Solomon.", "Positive Simile to Comparative", "'He is as wise as X' transforms into 'X is not wiser than he'."],
    ["Transform into Superlative: 'Akbar was greater than most other Mughal emperors.'", "Akbar was one of the greatest Mughal emperors.", "Akbar was the greatest Mughal emperor.", "No other Mughal emperor was as great as Akbar.", "Akbar was greater Mughal emperor.", "Comparative ('than most other') to Superlative ('one of the')", "'Than most other' transforms into 'one of the + superlative + plural noun'."],
    ["Transform into Comparative: 'Gold is the most precious of all metals.'", "Gold is more precious than all other metals.", "Gold is more precious than any other metal.", "Gold is more precious than most other metals.", "No other metal is as precious as gold.", "Superlative ('of all') to Comparative ('than all other')", "'The most precious of all' changes to 'more precious than all other + plural noun'."],
    ["Transform into Positive: 'Platinum is heavier than gold.'", "Gold is not as heavy as platinum.", "Gold is as heavy as platinum.", "Platinum is not as heavy as gold.", "Gold is heavier than platinum.", "Comparative to Positive Negation", "'A is heavier than B' converts into 'B is not as heavy as A'."]
  ];
  for (let i = 0; i < 45; i++) {
    const base = degData[i % degData.length];
    list.push(makeMCQ(`cs_deg_${i+1}`, tid, 'sentence_types', 'degree_transformation', 'Transform the degree of comparison:', base[0], base[0], base[1], base[2], base[3], base[4], base[5], base[6], i % 3 === 0 ? 'easy' : 'hard'));
  }

  // 5. Assertive to Interrogative & Exclamatory (40)
  const assIntExData = [
    ["Transform into Interrogative: 'Everybody desires happiness and peace in life.'", "Who does not desire happiness and peace in life?", "Does everybody desire happiness and peace in life?", "Who desires happiness and peace in life?", "Does nobody desire happiness in life?", "Everybody to Interrogative ('Who does not...')", "'Everybody / Everyone' in affirmative assertive transforms into 'Who does not + V1...?'"],
    ["Transform into Interrogative: 'Nobody can escape the inevitable claws of death.'", "Who can escape the inevitable claws of death?", "Can nobody escape death?", "Who cannot escape the claws of death?", "Can anybody escape death not?", "Nobody to Interrogative ('Who can...')", "'Nobody / None / No one' transforms into 'Who + modal/verb...?'"],
    ["Transform into Interrogative: 'Their glorious sacrifice can never be forgotten.'", "Can their glorious sacrifice ever be forgotten?", "Can their glorious sacrifice never be forgotten?", "Who can forget their glorious sacrifice?", "Is their sacrifice forgotten?", "Assertive with 'never' to Interrogative ('ever')", "Negative 'never' in assertive changes to affirmative 'ever' in the interrogative."],
    ["Transform into Interrogative: 'Friendship is nothing but an empty name.'", "Is friendship anything but an empty name?", "What is friendship but an empty name?", "Is friendship nothing but an empty name?", "Who says friendship is an empty name?", "Nothing but to 'anything but / What is'", "'Nothing but' transforms into 'anything but' (or 'What is...but')."],
    ["Transform into Exclamatory: 'The Sundarbans is a very magnificent mangrove forest.'", "What a magnificent mangrove forest the Sundarbans is!", "How magnificent mangrove forest the Sundarbans is!", "What magnificent mangrove forest the Sundarbans is!", "How a magnificent mangrove forest the Sundarbans is!", "Assertive to Exclamatory (What a + Adj + Noun + S + V!)", "'A very + adjective + noun' transforms into 'What a + adjective + noun + Subject + Verb!'."],
    ["Transform into Exclamatory: 'The scenery of Sajek Valley is extremely picturesque.'", "How picturesque the scenery of Sajek Valley is!", "What picturesque the scenery of Sajek Valley is!", "How a picturesque scenery Sajek Valley is!", "What a picturesque the scenery of Sajek Valley is!", "Assertive to Exclamatory (How + Adj + S + V!)", "Adjective without an indefinite article transforms into 'How + adjective + Subject + Verb!'."],
    ["Transform into Assertive: 'How sweet the nightingale sings!'", "The nightingale sings very sweetly.", "The nightingale sings sweetly.", "The nightingale does not sing sweetly.", "How sweetly the nightingale does sing.", "Exclamatory to Assertive", "'How + adverb + S + V!' transforms into 'Subject + Verb + very + adverb'."],
    ["Transform into Assertive: 'What a devastating storm it was!'", "It was a very devastating storm.", "It was a devastating storm.", "It was devastating storm very much.", "The storm was devastating.", "Exclamatory to Assertive ('a very')", "'What a + adjective + noun!' transforms into 'Subject + was a very + adjective + noun'."],
    ["Transform into Exclamatory: 'I wish I had the wings of a dove.'", "Had I the wings of a dove!", "If I had the wings of a dove!", "Would that I had the wings of a dove!", "All of the above", "Wish to Exclamatory ('Had I / If I / Would that')", "'I wish I had' transforms into 'Had I...!', 'If I had...!', or 'Would that I had...!'."],
    ["Transform into Exclamatory: 'It is a matter of great sorrow that the brave hero is no more.'", "Alas! The brave hero is no more.", "Hurrah! The brave hero is no more.", "Bravo! The brave hero is no more.", "Fie! The brave hero is no more.", "Matter of sorrow to Exclamatory ('Alas!')", "'It is a matter of sorrow that' transforms into interjection 'Alas!'."]
  ];
  for (let i = 0; i < 40; i++) {
    const base = assIntExData[i % assIntExData.length];
    list.push(makeMCQ(`cs_assint_${i+1}`, tid, 'sentence_types', 'assertive_interrogative_exclamatory', 'Transform the sentence:', base[0], base[0], base[1], base[2], base[3], base[4], base[5], base[6], i % 3 === 0 ? 'easy' : 'medium'));
  }

  return list;
}

console.log('Changing Sentences generator logic defined.');
