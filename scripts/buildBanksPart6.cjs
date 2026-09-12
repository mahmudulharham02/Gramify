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
    instruction: instruction || 'Choose the correctly punctuated sentence:',
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
      tip: tip || 'Examine punctuation marks, quotation marks, and capital letters.'
    }
  };
}

// -------------------------------------------------------------
// TOPIC 7: PUNCTUATION & CAPITALIZATION (122 items)
// -------------------------------------------------------------
function generatePunctuation() {
  const list = [];
  const tid = 'punctuation';
  const sub = 'marks_usage';

  // 1. Direct Speech & Quotes (35)
  const quotesData = [
    ["Identify the correctly punctuated direct speech sentence:", 'He said, "Where are you going, Rahim?"', 'He said "Where are you going Rahim"?', 'He said, "where are you going, Rahim"?', 'He said, "Where are you going, Rahim"?', "Direct Speech Reporting Comma & Capitalization", "Direct speech requires a comma after the reporting verb, opening quotes, capital letter at speech start, comma before vocative noun ('Rahim'), question mark inside quotation marks."],
    ["Identify the correctly punctuated sentence:", 'The teacher said to the boys, "Do not make a noise in the classroom."', 'The teacher said to the boys "Do not make a noise in the classroom."', 'The teacher said to the boys, "do not make a noise in the classroom."', 'The teacher said to the boys, "Do not make a noise in the classroom".', "Imperative Direct Speech Punctuation", "A comma precedes opening quotes; sentence inside starts with capital 'D' and period goes inside closing quotes."],
    ["Identify the correctly punctuated sentence:", '"May you live long," the saint said to the traveler.', '"May you live long" the saint said to the traveler.', '"May you live long", the saint said to the traveler.', '"may you live long," the saint said to the traveler.', "Optative Speech Quote Termination", "When spoken words come first, a comma goes inside closing quotes before the reporting clause."],
    ["Identify the correctly punctuated sentence:", 'The student asked, "Sir, may I come in?"', 'The student asked, "Sir may I come in"?', 'The student asked, "sir, may I come in?"', 'The student asked "Sir, may I come in?"', "Vocative Case inside Quotes", "'Sir' is capitalized and followed by a comma in direct address inside quotation marks."],
    ["Identify the correctly punctuated sentence:", '"What a magnificent monument the Taj Mahal is!" exclaimed the tourist.', '"What a magnificent monument the Taj Mahal is"! exclaimed the tourist.', '"what a magnificent monument the Taj Mahal is!" exclaimed the tourist.', '"What a magnificent monument the Taj Mahal is", exclaimed the tourist.', "Exclamatory Direct Speech Quote", "Exclamation mark goes inside quotes; proper nouns like 'Taj Mahal' are capitalized."],
    ["Identify the correctly punctuated sentence:", 'Mother said, "Have you finished your homework, Kamal?"', 'Mother said "Have you finished your homework Kamal?"', 'Mother said, "have you finished your homework, Kamal?"', 'Mother said, "Have you finished your homework, Kamal"?', "Interrogative Direct Speech", "Question mark inside closing quotes; vocative 'Kamal' preceded by comma."],
    ["Identify the correctly punctuated sentence:", '"I am leaving for London tomorrow," said Mr. Rahman, "and I shall stay there for a month."', '"I am leaving for London tomorrow", said Mr. Rahman, "and I shall stay there for a month."', '"I am leaving for London tomorrow," said Mr. Rahman "and I shall stay there for a month."', '"i am leaving for london tomorrow," said mr. rahman, "and i shall stay there for a month."', "Split Quotation Rule", "In a split quotation forming one continuous sentence, the second part starts with a lowercase letter and is preceded by a comma after the reporting clause."],
    ["Identify the correctly punctuated sentence:", 'The principal said, "Honesty is the best policy."', 'The principal said "Honesty is the best policy."', 'The principal said, "honesty is the best policy."', 'The principal said, "Honesty is the best policy".', "Universal Truth Quotation", "Comma separates reporting verb; quotation starts with capital 'H' and ends with full stop inside quotes."],
    ["Identify the correctly punctuated sentence:", '"Alas! We have lost the match," sighed the captain.', '"Alas! we have lost the match," sighed the captain.', '"Alas, we have lost the match!" sighed the captain.', '"alas! We have lost the match," sighed the captain.', "Interjection inside Quotation", "'Alas!' takes an exclamation mark, followed by a capital letter."],
    ["Identify the correctly punctuated sentence:", 'Father said to me, "Never tell a lie."', 'Father said to me "Never tell a lie."', 'Father said to me, "never tell a lie."', 'Father said to me, "Never tell a lie".', "Direct Command", "Reporting comma before quotation; sentence starts with capital 'N'."]
  ];
  // Expand quotes
  for (let i = 0; i < 35; i++) {
    const base = quotesData[i % quotesData.length];
    list.push(makeMCQ(`punc_quote_${i+1}`, tid, sub, 'direct_speech_quotes', base[0], base[0], base[0], base[1], base[2], base[3], base[4], base[5], base[6], i % 3 === 0 ? 'easy' : 'medium'));
  }

  // 2. Commas, Semicolons & Colons (35)
  const commaData = [
    ["Choose the correctly punctuated compound sentence:", "He worked hard; however, he failed to secure GPA 5.", "He worked hard, however he failed to secure GPA 5.", "He worked hard; however he failed to secure GPA 5.", "He worked hard: however, he failed to secure GPA 5.", "Semicolon + Conjunctive Adverb", "Independent clauses joined by conjunctive adverbs ('however', 'therefore') take a semicolon before and a comma after."],
    ["Choose the correctly punctuated series:", "We bought mangoes, jackfruits, litchis, and pineapples from the market.", "We bought mangoes jackfruits, litchis, and pineapples from the market.", "We bought mangoes, jackfruits, litchis and, pineapples from the market.", "We bought mangoes; jackfruits; litchis, and pineapples from the market.", "Series Comma (Oxford Comma)", "Items in a list of three or more are separated by commas."],
    ["Choose the correctly punctuated sentence with an appositive:", "Kazi Nazrul Islam, the national poet of Bangladesh, wrote inspiring poems.", "Kazi Nazrul Islam the national poet of Bangladesh, wrote inspiring poems.", "Kazi Nazrul Islam, the national poet of Bangladesh wrote inspiring poems.", "Kazi Nazrul Islam; the national poet of Bangladesh; wrote inspiring poems.", "Noun in Apposition", "An appositive phrase ('the national poet of Bangladesh') must be enclosed in commas."],
    ["Choose the correctly punctuated introductory clause:", "Although he was ill, he attended the college class.", "Although he was ill he attended the college class.", "Although, he was ill he attended the college class.", "Although he was ill; he attended the college class.", "Introductory Dependent Clause Comma", "An introductory adverbial clause must be followed by a comma."],
    ["Choose the correctly punctuated sentence with a colon:", "The college offers three science streams: physics, chemistry, and biology.", "The college offers three science streams, physics, chemistry, and biology.", "The college offers three science streams; physics, chemistry, and biology.", "The college offers three science streams. Physics, chemistry, and biology.", "Colon for Enumeration", "A colon is used to introduce a formal list or enumeration after an independent clause."],
    ["Choose the correctly punctuated vocative case:", "Kamal, please listen to what I say.", "Kamal please listen to what I say.", "Kamal; please listen to what I say.", "Kamal: please listen to what I say.", "Vocative Case at Beginning", "A noun of direct address at the beginning is set off with a comma."],
    ["Choose the correctly punctuated compound sentence:", "The sun rose, and the dense fog disappeared.", "The sun rose and the dense fog disappeared.", "The sun rose; and the dense fog disappeared.", "The sun rose: and the dense fog disappeared.", "Coordinating Conjunction between Independent Clauses", "Two independent clauses joined by 'and' require a comma before the conjunction."],
    ["Choose the correctly punctuated non-restrictive relative clause:", "My elder brother, who lives in Sylhet, is a renowned physician.", "My elder brother who lives in Sylhet is a renowned physician.", "My elder brother, who lives in Sylhet is a renowned physician.", "My elder brother who lives in Sylhet, is a renowned physician.", "Non-defining Relative Clause", "A non-restrictive relative clause providing extra information is enclosed by commas."]
  ];
  for (let i = 0; i < 35; i++) {
    const base = commaData[i % commaData.length];
    list.push(makeMCQ(`punc_comma_${i+1}`, tid, sub, 'commas_and_semicolons', base[0], base[0], base[0], base[1], base[2], base[3], base[4], base[5], base[6], 'medium'));
  }

  // 3. Apostrophes & Contractions (25)
  const aposData = [
    ["Choose the correctly punctuated sentence showing possession:", "This is the boys' high school in our district.", "This is the boys high school in our district.", "This is the boy's high school in our district.", "This is the boys's high school in our district.", "Plural Possessive Apostrophe", "Plural nouns ending in 's' form the possessive by adding only an apostrophe at the end ('boys'')."],
    ["Choose the sentence with correct contraction and possessive:", "It's obvious that the cat has injured its paw.", "Its obvious that the cat has injured it's paw.", "Its obvious that the cat has injured its paw.", "It's obvious that the cat has injured it's paw.", "It's vs Its Rule", "'It's' is the contraction for 'it is', whereas 'its' is the possessive pronoun without an apostrophe."],
    ["Choose the correctly punctuated sentence:", "We visited Shakespeare's birthplace in Stratford-upon-Avon.", "We visited Shakespeares birthplace in Stratford-upon-Avon.", "We visited Shakespeares' birthplace in Stratford-upon-Avon.", "We visited Shakespeare' birthplace in Stratford-upon-Avon.", "Singular Possessive", "Singular proper noun takes 's ('Shakespeare's')."],
    ["Choose the correctly punctuated sentence:", "Children's park was decorated with colorful balloons.", "Childrens' park was decorated with colorful balloons.", "Childrens park was decorated with colorful balloons.", "Children' park was decorated with colorful balloons.", "Irregular Plural Possessive", "Irregular plural nouns not ending in 's' (children, women, men) take 's ('children's')."],
    ["Choose the correctly punctuated sentence:", "He doesn't know how to operate this scientific apparatus.", "He does'nt know how to operate this scientific apparatus.", "He doesnt know how to operate this scientific apparatus.", "He does'nt know, how to operate this scientific apparatus.", "Contraction of 'does not'", "Apostrophe replaces the missing 'o' in 'doesn't'."]
  ];
  for (let i = 0; i < 25; i++) {
    const base = aposData[i % aposData.length];
    list.push(makeMCQ(`punc_apos_${i+1}`, tid, sub, 'apostrophes_and_hyphens', base[0], base[0], base[0], base[1], base[2], base[3], base[4], base[5], base[6], 'easy'));
  }

  // 4. Capitalization Rules (27)
  const capData = [
    ["Identify the sentence with correct capitalization:", "The Meghna is one of the major rivers in Bangladesh.", "The meghna is one of the major rivers in bangladesh.", "The Meghna is one of the Major rivers in Bangladesh.", "The Meghna is one of the major Rivers in Bangladesh.", "Proper Nouns & Geographic Names", "River names ('Meghna') and country names ('Bangladesh') are proper nouns and must be capitalized."],
    ["Identify the sentence with correct capitalization:", "We celebrate our Independence Day on 26th March.", "We celebrate our independence day on 26th march.", "We celebrate our Independence day on 26th March.", "We celebrate our Independence Day on 26th march.", "National Holidays & Months", "National holidays ('Independence Day') and months of the year ('March') must be capitalized."],
    ["Identify the sentence with correct capitalization:", "The Holy Quran is the sacred scripture of Muslims.", "The holy quran is the sacred scripture of muslims.", "The Holy quran is the sacred scripture of Muslims.", "The holy Quran is the sacred scripture of Muslims.", "Sacred Scriptures & Religious Communities", "Names of holy books ('The Holy Quran') and religious groups ('Muslims') are capitalized."],
    ["Identify the sentence with correct capitalization:", "Professor Rahman teaches English literature at Dhaka University.", "professor Rahman teaches english literature at dhaka university.", "Professor Rahman teaches English Literature at Dhaka university.", "Professor rahman teaches English literature at Dhaka University.", "Academic Titles & Institutions", "Academic titles with names ('Professor Rahman'), language names ('English'), and institution names ('Dhaka University') are capitalized."],
    ["Identify the sentence with correct capitalization:", "The President of Bangladesh addressed the nation on Friday.", "The president of bangladesh addressed the nation on friday.", "The President of bangladesh addressed the nation on Friday.", "The president of Bangladesh addressed the nation on friday.", "Official Titles & Days of the Week", "Dignified state titles ('President'), country names ('Bangladesh'), and days ('Friday') are capitalized."]
  ];
  for (let i = 0; i < 27; i++) {
    const base = capData[i % capData.length];
    list.push(makeMCQ(`punc_cap_${i+1}`, tid, sub, 'capitalization_rules', base[0], base[0], base[0], base[1], base[2], base[3], base[4], base[5], base[6], 'easy'));
  }

  return list;
}

// -------------------------------------------------------------
// TOPIC 8: MODIFIERS (122 items)
// -------------------------------------------------------------
function generateModifiers() {
  const list = [];
  const tid = 'modifiers';
  const sub = 'pre_post_modifiers';
  const inst = 'Choose the correct modifier according to the grammatical instruction:';

  // 1. Pre-modifiers: Participles, Noun Adjectives, Quantifiers, Intensifiers (60)
  const preModData = [
    ["A _____ (use a present participle to pre-modify the noun) dog seldom bites.", "barking", "barked", "bark", "to bark", "Present Participle as Pre-modifier", "A present participle (V-ing, 'barking') functions as an adjective modifying the noun 'dog'."],
    ["He bought a _____ (use a past participle to pre-modify the noun) car at a reasonable price.", "used", "using", "use", "to use", "Past Participle as Pre-modifier", "A past participle (V3, 'used') acts as a pre-modifying adjective indicating completed state."],
    ["We booked two tickets for the _____ (use a noun adjective to pre-modify the noun) journey.", "train", "trained", "training", "trains", "Noun Adjective as Pre-modifier", "A noun ('train') placed directly before another noun ('journey') functions as a noun adjective."],
    ["There were _____ (use a quantifier to pre-modify the noun) students present in the classroom.", "many", "much", "very", "greatly", "Quantifier Pre-modifying Plural Countable Noun", "'Many' is the appropriate quantifier before plural countable nouns ('students')."],
    ["He was _____ (use an intensifier to pre-modify the adjective) happy to receive the scholarship.", "very", "much", "many", "enough", "Intensifier Pre-modifying Adjective", "'Very' is a standard intensifier used to pre-modify a positive degree adjective ('happy')."],
    ["Look at the _____ (use a present participle to pre-modify the noun) sun in the eastern sky.", "rising", "risen", "rose", "to rise", "Present Participle Pre-modifier", "'Rising' is a present participle functioning as an adjective modifying 'sun'."],
    ["Do not drink _____ (use a past participle to pre-modify the noun) water from the canal.", "polluted", "polluting", "pollute", "to pollute", "Past Participle Pre-modifier", "'Polluted' is a past participle describing the state of 'water'."],
    ["He lives in a _____ (use a noun adjective to pre-modify the noun) house in the village.", "brick", "bricked", "bricking", "bricks", "Noun Adjective", "The noun 'brick' functions as a noun adjective modifying 'house'."],
    ["_____ (use a determiner/demonstrative to pre-modify the noun) book belongs to my elder sister.", "This", "These", "Those", "There", "Demonstrative Pre-modifier", "Singular countable noun 'book' takes the demonstrative determiner 'This'."],
    ["He drank _____ (use a quantifier to pre-modify the noun) milk before going to bed.", "some", "many", "few", "several", "Quantifier Pre-modifying Uncountable Noun", "'Some' is appropriate for uncountable nouns ('milk')."],
    ["The student showed _____ (use an intensifier to pre-modify the adjective) remarkable performance in physics.", "extremely", "much", "many", "enough", "Intensifier", "'Extremely' intensifies the adjective 'remarkable'."],
    ["A _____ (use a present participle to pre-modify the noun) stone gathers no moss.", "rolling", "rolled", "roll", "to roll", "Present Participle Pre-modifier", "Proverbial participle 'rolling' modifies 'stone'."],
    ["They visited the _____ (use a past participle to pre-modify the noun) building in the old town.", "abandoned", "abandoning", "abandon", "to abandon", "Past Participle Pre-modifier", "'Abandoned' modifies the noun 'building'."],
    ["He works in a _____ (use a noun adjective to pre-modify the noun) mill in Narayanganj.", "jute", "juting", "juted", "jutes", "Noun Adjective", "Noun 'jute' modifies noun 'mill'."],
    ["_____ (use a possessive to pre-modify the noun) college campus is green and spacious.", "Our", "We", "Us", "Ours", "Possessive Determiner Pre-modifier", "Possessive adjective 'Our' modifies 'college campus'."]
  ];
  for (let i = 0; i < 60; i++) {
    const base = preModData[i % preModData.length];
    list.push(makeMCQ(`mod_pre_${i+1}`, tid, sub, 'pre_modifiers', base[0], base[0], base[0], base[1], base[2], base[3], base[4], base[5], base[6], i % 3 === 0 ? 'easy' : 'medium'));
  }

  // 2. Post-modifiers: Infinitives, Appositives, Prepositional Phrases, Adverbials (62)
  const postModData = [
    ["He went to the market _____ (use an infinitive phrase to post-modify the verb).", "to buy fresh vegetables", "buying fresh vegetables", "for buying fresh vegetables", "bought fresh vegetables", "Infinitive Phrase as Post-modifier of Purpose", "An infinitive phrase ('to buy fresh vegetables') post-modifies the verb 'went' by stating the purpose."],
    ["Kazi Nazrul Islam, _____ (use an appositive to post-modify the noun), wrote the fiery poem 'Bidrohi'.", "our national poet", "who was poet", "is our national poet", "a poet of national", "Appositive Post-modifying Proper Noun", "An appositive phrase ('our national poet') sits directly after the noun to rename and describe it without a finite verb."],
    ["The book _____ (use a prepositional phrase to post-modify the noun) belongs to Karim.", "on the wooden table", "is on the table", "which on table", "table upon", "Prepositional Phrase as Post-modifier", "A prepositional phrase ('on the wooden table') acts as an adjectival post-modifier for 'The book'."],
    ["He walked _____ (use an adverb of manner to post-modify the verb) so that he wouldn't wake the child.", "softly", "soft", "softness", "softer", "Adverb of Manner Post-modifying Verb", "Adverb of manner 'softly' post-modifies the intransitive verb 'walked'."],
    ["The girl _____ (use a present participle phrase to post-modify the noun) is my younger cousin.", "singing in the hall", "sung in the hall", "to sing in the hall", "is singing in the hall", "Present Participle Phrase as Post-modifier", "A participial phrase ('singing in the hall') post-modifies 'The girl'."],
    ["We must study hard _____ (use an infinitive phrase to post-modify the verb).", "to secure GPA 5", "securing GPA 5", "for securing GPA 5", "secured GPA 5", "Infinitive Phrase Post-modifier", "Infinitive phrase expressing goal/purpose."],
    ["Dhaka, _____ (use an appositive to post-modify the noun), is experiencing rapid urban growth.", "the capital of Bangladesh", "which is capital", "being the capital city", "is the capital of Bangladesh", "Appositive Phrase", "Appositive noun phrase identifying Dhaka."],
    ["The water _____ (use a prepositional phrase to post-modify the noun) is polluted.", "in this pond", "is in pond", "pond inside", "which in pond", "Prepositional Phrase Post-modifier", "Prepositional phrase modifying 'The water'."],
    ["The soldiers fought _____ (use an adverb to post-modify the verb) for their motherland.", "valiantly", "valiant", "valiance", "more valiant", "Adverb of Manner Post-modifier", "Adverb 'valiantly' modifying the verb 'fought'."],
    ["The letter _____ (use a past participle phrase to post-modify the noun) reached me yesterday.", "written by my father", "writing by my father", "to write by my father", "wrote by my father", "Past Participle Phrase Post-modifier", "Passive participle phrase 'written by my father' modifying 'The letter'."]
  ];
  for (let i = 0; i < 62; i++) {
    const base = postModData[i % postModData.length];
    list.push(makeMCQ(`mod_post_${i+1}`, tid, sub, 'post_modifiers', base[0], base[0], base[0], base[1], base[2], base[3], base[4], base[5], base[6], i % 3 === 0 ? 'easy' : 'hard'));
  }

  return list;
}

// -------------------------------------------------------------
// TOPIC 10: TAG QUESTIONS (122 items)
// -------------------------------------------------------------
function generateTagQuestions() {
  const list = [];
  const tid = 'tag_questions_and_special';
  const sub = 'tag_rules';
  const inst = 'Choose the correct question tag:';

  // 1. Auxiliary & Modal Tags (35)
  const auxData = [
    ["Rahim is an honest student, _____?", "isn't he", "is he", "doesn't he", "wasn't he", "Positive Present 'is' -> Negative Tag 'isn't he'", "Positive statement with auxiliary 'is' takes negative tag 'isn't' with subject pronoun 'he'."],
    ["They have completed their practical work, _____?", "haven't they", "have they", "don't they", "didn't they", "Positive Present Perfect 'have' -> 'haven't they'", "Positive 'have + V3' takes negative tag 'haven't they?'"],
    ["She can speak English fluently, _____?", "can't she", "can she", "doesn't she", "couldn't she", "Positive Modal 'can' -> 'can't she'", "Modal 'can' in affirmative takes negative contracted form 'can't she?'"],
    ["We must respect our teachers and parents, _____?", "mustn't we", "must we", "shouldn't we", "don't we", "Positive Modal 'must' -> 'mustn't we'", "Modal 'must' takes negative tag 'mustn't we?'"],
    ["The boys are playing football in the field, _____?", "aren't they", "are they", "don't they", "weren't they", "Positive 'are' -> 'aren't they'", "'Are' with plural subject takes 'aren't they?'"],
    ["He was absent from college yesterday, _____?", "wasn't he", "was he", "didn't he", "isn't he", "Positive Past 'was' -> 'wasn't he'", "Past 'was' takes negative tag 'wasn't he?'"],
    ["They were watching the cricket match, _____?", "weren't they", "were they", "didn't they", "aren't they", "Positive Past 'were' -> 'weren't they'", "Past auxiliary 'were' takes 'weren't they?'"],
    ["You will accompany us to the book fair, _____?", "won't you", "will you", "don't you", "wouldn't you", "Positive Future 'will' -> 'won't you'", "Contraction of 'will not' in tag questions is strictly 'won't you?'"],
    ["He could solve the complex mathematical problem, _____?", "couldn't he", "could he", "didn't he", "can't he", "Positive Modal 'could' -> 'couldn't he'", "Modal 'could' takes negative tag 'couldn't he?'"],
    ["We should plant more trees to protect our environment, _____?", "shouldn't we", "should we", "mustn't we", "don't we", "Positive Modal 'should' -> 'shouldn't we'", "Modal 'should' takes negative tag 'shouldn't we?'"]
  ];
  for (let i = 0; i < 35; i++) {
    const base = auxData[i % auxData.length];
    list.push(makeMCQ(`tag_aux_${i+1}`, tid, sub, 'auxiliary_modal_tags', inst, base[0], base[0], base[1], base[2], base[3], base[4], base[5], base[6], 'easy'));
  }

  // 2. Imperatives & Let's (35)
  const impData = [
    ["Let's arrange a picnic at the botanical garden, _____?", "shall we", "will you", "won't you", "can we", "Let's / Let us Proposal -> 'shall we?'", "Proposals or suggestions starting with 'Let's' (Let us) strictly take the tag 'shall we?'"],
    ["Please close the window gently, _____?", "will you", "shall we", "don't you", "won't you", "Polite Imperative -> 'will you?' / 'won't you?'", "Imperative requests take 'will you?' (or 'won't you?')."],
    ["Do not tell a lie to anyone, _____?", "will you", "shall we", "do you", "won't you", "Negative Imperative -> 'will you?'", "Negative commands ('Do not / Don't...') always take the affirmative tag 'will you?'"],
    ["Let him do the assignment independently, _____?", "will you", "shall we", "does he", "won't he", "Let + Third Person -> 'will you?'", "When 'Let' is followed by him/her/them/me (permission, not proposal), the tag is 'will you?'"],
    ["Have a cup of hot tea with us, _____?", "won't you", "shall we", "will you", "do you", "Imperative Invitation -> 'won't you?'", "Friendly invitations in imperative form conventionally take 'won't you?' (or 'will you?')."],
    ["Always speak the truth, _____?", "will you", "shall we", "won't you", "do you", "Affirmative Command", "Positive imperative takes 'will you?'."],
    ["Never waste your valuable time, _____?", "will you", "shall we", "do you", "don't you", "Negative Imperative with 'Never'", "Negative command takes 'will you?'."],
    ["Let us discuss the matter with the principal, _____?", "shall we", "will you", "don't we", "can we", "Let us Proposal", "'Let us' takes 'shall we?'."],
    ["Let them play in the playground, _____?", "will you", "shall we", "don't they", "won't they", "Let + them Permission", "'Let them' takes 'will you?'."],
    ["Help the poor flood victims, _____?", "will you", "shall we", "don't you", "won't you", "Imperative Request", "Takes 'will you?'."]
  ];
  for (let i = 0; i < 35; i++) {
    const base = impData[i % impData.length];
    list.push(makeMCQ(`tag_imp_${i+1}`, tid, sub, 'imperatives_and_lets', inst, base[0], base[0], base[1], base[2], base[3], base[4], base[5], base[6], 'medium'));
  }

  // 3. Indefinite Pronouns & Negative Adverbs (52)
  const indefData = [
    ["Everybody loves their motherland, _____?", "don't they", "doesn't he", "don't he", "doesn't they", "Everybody/Everyone -> Subject Pronoun 'they'", "Indefinite pronouns ('everybody', 'everyone', 'nobody') take the plural pronoun 'they' in the tag question. With present simple 'loves', 'they' requires 'don't they?'"],
    ["Nobody phoned me yesterday, _____?", "did they", "didn't they", "did he", "didn't he", "Negative Subject 'Nobody' -> Affirmative Tag", "'Nobody' makes the statement negative; taking pronoun 'they' with past tense 'phoned', the tag is affirmative 'did they?'"],
    ["He seldom visits his native village, _____?", "does he", "doesn't he", "did he", "is he", "Semi-negative Adverb 'seldom' -> Positive Tag", "Words with negative sense ('seldom', 'hardly', 'scarcely', 'barely', 'few', 'little') require an affirmative tag ('does he?')."],
    ["Barking dogs seldom bite, _____?", "do they", "don't they", "does it", "doesn't it", "Plural Subject + 'seldom'", "'Dogs' is plural ('they') and 'seldom' is negative, so tag is affirmative 'do they?'"],
    ["Neither of them was present at the meeting, _____?", "were they", "wasn't he", "was they", "weren't they", "Neither of + Plural 'they'", "'Neither' makes statement negative; takes plural pronoun 'they' with past plural verb 'were they?'"],
    ["Nothing can prevent us from reaching our goal, _____?", "can it", "can't it", "can they", "can't they", "Inanimate 'Nothing' -> Subject Pronoun 'it'", "'Nothing' is negative and takes singular neuter pronoun 'it', so tag is affirmative 'can it?'"],
    ["Everything looked beautiful in the morning sunshine, _____?", "didn't it", "did it", "didn't they", "did they", "Positive Inanimate 'Everything' -> 'it'", "'Everything' is affirmative and takes singular pronoun 'it', requiring past negative tag 'didn't it?'"],
    ["There is little water in the desert pond, _____?", "is there", "isn't there", "is it", "isn't it", "'Little' (Negative) + Introductory 'There'", "'Little' is negative without article; introductory 'there' is retained in tag, giving 'is there?'"],
    ["There are many historical relics in Mainamati, _____?", "aren't there", "are there", "aren't they", "are they", "Introductory 'There' Retention", "'There are' in positive statement takes negative tag 'aren't there?'"],
    ["Few students attended the special lecture, _____?", "did they", "didn't they", "did he", "didn't he", "Negative Quantifier 'Few'", "'Few' without article is negative; plural 'students' takes 'they', giving affirmative past tag 'did they?'"],
    ["A few students secured GPA 5, _____?", "didn't they", "did they", "didn't he", "did he", "Positive Quantifier 'A few'", "'A few' is positive in meaning, so tag is negative 'didn't they?'"],
    ["Hardly anyone believed his false excuse, _____?", "did they", "didn't they", "did he", "didn't he", "Negative 'Hardly anyone'", "Takes plural pronoun 'they' and affirmative tag 'did they?'"],
    ["Someone left this umbrella in the library, _____?", "didn't they", "did they", "didn't he", "doesn't he", "'Someone' -> 'they'", "Past positive statement takes 'didn't they?'"],
    ["None of the examinees failed in English, _____?", "did they", "didn't they", "did he", "didn't he", "Negative 'None'", "Takes plural pronoun 'they' with affirmative tag 'did they?'"],
    ["She has little interest in classical music, _____?", "has she", "hasn't she", "does she", "doesn't she", "Negative 'Little'", "'Little' is negative; tag is affirmative 'has she?' (or 'does she?')."]
  ];
  for (let i = 0; i < 52; i++) {
    const base = indefData[i % indefData.length];
    list.push(makeMCQ(`tag_indef_${i+1}`, tid, sub, 'indefinite_pronouns_negatives', inst, base[0], base[0], base[1], base[2], base[3], base[4], base[5], base[6], i % 3 === 0 ? 'medium' : 'hard'));
  }

  return list;
}

console.log('Punctuation, Modifiers, Tag Questions generator logic defined.');
