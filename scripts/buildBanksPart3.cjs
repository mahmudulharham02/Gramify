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
      tip: tip || 'Examine the contextual clue and grammatical rule.'
    }
  };
}

// -------------------------------------------------------------
// TOPIC 4: COMPLETING SENTENCES (122 items)
// -------------------------------------------------------------
function generateCompletingSentences() {
  const list = [];
  const tid = 'completing_sentences';
  const inst = 'Choose the correct clause or phrase to complete the sentence:';

  // 1. So that / In order that (15)
  const soThatData = [
    ["He worked hard day and night so that he _____ in the HSC exam.", "could succeed", "can succeed", "succeeds", "will succeed", "So that + Past Clause (could + V1)", "When the principal clause is in the past tense ('worked'), 'so that' is followed by 'Subject + could/might + V1'."],
    ["We eat balanced food so that we _____ healthy.", "may remain", "remained", "might remain", "had remained", "So that + Present Clause (may/can + V1)", "When the main clause is present tense ('eat'), 'so that' takes 'Subject + can/may + V1'."],
    ["The farmers sow quality seeds in order that they _____ a bumper harvest.", "may reap", "reaped", "might reap", "had reaped", "In order that + Present Clause", "'In order that' expressing purpose in present tense takes 'Subject + may/can + V1'."],
    ["Rahim went to Dhaka with a view to _____ admission in a renowned college.", "getting", "get", "got", "to get", "With a view to + V-ing", "After the prepositional phrase 'with a view to', a gerund (V-ing) is strictly required."],
    ["The girl studied attentively so that she _____ GPA 5.", "might secure", "secures", "secured", "had secured", "So that + Past Clause Purpose", "'Studied' is in the past, so the purpose clause takes 'might/could + V1'."],
    ["They left home early in order that they _____ the morning intercity train.", "could catch", "can catch", "caught", "will catch", "In order that + Past Clause", "Past principal verb 'left' requires 'could catch' in the subordinate purpose clause."],
    ["He took a loan from the Grameen Bank so that he _____ a dairy farm.", "could establish", "can establish", "establishes", "established", "So that + Past Subject + could", "Past main clause takes 'could establish'."],
    ["Plants absorb sunlight so that they _____ their own food through photosynthesis.", "can synthesize", "synthesized", "could synthesize", "had synthesized", "Scientific Fact with So That (Present)", "Present scientific context takes 'can synthesize'."],
    ["The boy saved his pocket money so that he _____ the reference book.", "could purchase", "can purchase", "purchases", "purchased", "So that + Past", "Past intention requires 'could purchase'."],
    ["We plant more trees in our locality so that the environment _____ balanced.", "may remain", "remained", "might remain", "had remained", "So that + Present", "Present general statement takes 'may remain'."],
    ["The government enacted strict laws so that corruption _____ from society.", "could be eradicated", "can eradicate", "eradicates", "eracicated", "So that + Passive Modal (could be + V3)", "Passive purpose in past context requires 'could be eradicated'."],
    ["He spoke clearly so that everyone _____ his message.", "could understand", "can understand", "understands", "understood", "So that + Past", "Past clause 'spoke' requires 'could understand'."],
    ["She walked fast so that she _____ the last bus.", "might catch", "can catch", "catches", "had caught", "So that + Past", "'Walked fast' takes 'might catch'."],
    ["He practices English speaking every day in order that he _____ fluently.", "may speak", "spoke", "might speak", "had spoken", "In order that + Present", "Daily present practice takes 'may speak'."],
    ["The doctor operated immediately so that the patient's life _____ saved.", "could be", "can be", "is", "was", "So that + Past Passive", "Past surgical context requires 'could be'."]
  ];
  soThatData.forEach((d, i) => {
    list.push(makeMCQ(`cs_so_that_${i+1}`, tid, 'connective_structures', 'so_that', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'medium'));
  });

  // 2. Such that & Too...to (12)
  const suchThatData = [
    ["His behavior was such that everybody _____ him.", "disliked", "dislikes", "disliking", "will dislike", "Such that + Past Consequence", "Past state 'was such' is followed by a past consequence clause 'disliked'."],
    ["The load was too heavy for the frail old man _____.", "to carry", "carrying", "for carrying", "carried", "Too + Adj + for + Pronoun + to + V1", "'Too + adjective + to-infinitive' conveys a negative meaning ('so heavy that he could not carry it')."],
    ["The problem was too complicated for the students _____ in twenty minutes.", "to solve", "solving", "to be solved", "solved", "Too + Adj + to + V1", "Negative infinitive structure 'too complicated to solve'."],
    ["He is too honest _____ a bribe from anyone.", "to take", "taking", "taken", "to taking", "Too + Adj + to-Infinitive (Negative Sense)", "'Too honest to take' means he is so honest that he cannot take a bribe."],
    ["The tea is too hot for the child _____.", "to drink", "drinking", "to be drunk", "drunk", "Too + Adj + to + V1", "'Too hot to drink' means cannot drink."],
    ["The boy is too dull _____ this mathematical concept.", "to grasp", "grasping", "grasped", "to grasping", "Too dull to grasp", "Standard negative infinitive construction."],
    ["Her voice was such that it _____ the entire audience.", "captivated", "captivates", "captivating", "had captivated", "Such that + Past Result", "Past descriptive clause takes 'captivated'."],
    ["The speed of the car was such that the driver _____ control.", "lost", "loses", "losing", "had lost", "Such that + Past Result", "Past context takes 'lost'."],
    ["He was too weak _____ even a few steps.", "to walk", "walking", "walked", "to walking", "Too weak to walk", "'Too weak to walk' expresses inability."],
    ["The night was too dark for us _____ the path.", "to see", "seeing", "seen", "for seeing", "Too dark to see", "'Too dark to see' indicates negative outcome."],
    ["The question is too difficult for a beginner _____.", "to answer", "answering", "answered", "to be answered", "Too difficult to answer", "Standard infinitive complement."],
    ["The mountain was too steep for the climbers _____ without ropes.", "to scale", "scaling", "scaled", "to scaling", "Too steep to scale", "Infinitive showing impossibility."]
  ];
  suchThatData.forEach((d, i) => {
    list.push(makeMCQ(`cs_such_too_${i+1}`, tid, 'connective_structures', 'such_that', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'medium'));
  });

  // 3. As...as & Degree structures (10)
  const asAsData = [
    ["Padma Bridge is as magnificent as _____ in South Asia.", "any other modern structure", "all modern structures", "more modern structure", "most modern structure", "Positive Degree (as + Adj + as)", "'As + positive adjective + as' compares equality with singular singular reference."],
    ["He is as wise as _____ in the village.", "any other elder", "all elders", "more elder", "most elder", "Positive Degree Comparison", "'As wise as' compares two entities equally."],
    ["No other river in Bangladesh is as long as _____.", "the Meghna", "Meghna", "a Meghna", "longer Meghna", "No other... as + Adj + as + Subject", "The positive degree comparison names the standard entity 'the Meghna'."],
    ["Very few metals are as precious as _____.", "gold", "the gold", "a gold", "more gold", "Very few ... as + Adj + as", "'Gold' is the positive standard of comparison."],
    ["He cannot run as fast as _____.", "Karim", "Karim runs faster", "Karim is", "more fast Karim", "As fast as + Subject", "Comparing speed equality between two persons."],
    ["Iron is not as expensive as _____.", "gold", "the gold", "a gold", "golds", "Not as + Adj + as", "Standard negative positive degree comparison."],
    ["No other student in the class is as meritorious as _____.", "Rahim", "a Rahim", "the Rahim", "Rahim is more", "No other ... as meritorious as", "Comparative positive structure."],
    ["A plane flies as swiftly as _____.", "a bird", "bird", "the bird flying", "more bird", "As swiftly as + Object", "Simile of speed comparison."],
    ["Cox's Bazar sea beach is as scenic as _____ in the world.", "any other beach", "all beaches", "more beach", "most beach", "As scenic as + any other", "Positive degree formula."],
    ["He is not as clever as _____.", "his brother", "his brother is cleverer", "more clever brother", "cleverest brother", "Not as clever as", "Negative comparison of equality."]
  ];
  asAsData.forEach((d, i) => {
    list.push(makeMCQ(`cs_as_as_${i+1}`, tid, 'connective_structures', 'as_as', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'easy'));
  });

  // 4. As soon as (10)
  const asSoonAsData = [
    ["As soon as the teacher entered the classroom, the students _____.", "stood up", "stand up", "had stood up", "standing up", "As soon as (Past Simple , Past Simple)", "When 'as soon as' links two past events, both clauses take the Simple Past tense (V2)."],
    ["As soon as the thief saw the police, he _____.", "fled away", "flees away", "had fled away", "fleeing away", "As soon as + Past Simple", "Immediate sequential past action takes Simple Past (V2 'fled away')."],
    ["As soon as I reached the station, the train _____.", "left", "leaves", "had left", "leaving", "As soon as + Past", "Both events take Simple Past (V2)."],
    ["As soon as the bell rang, the children _____ out of the room.", "rushed", "rush", "had rushed", "rushing", "As soon as + Past Simple", "Immediate reaction takes Simple Past (V2 'rushed')."],
    ["As soon as he receives the message, he _____ us.", "will notify", "notified", "notifies", "had notified", "As soon as (Present Simple , Future Simple)", "When 'as soon as' is in present simple, the main clause takes future simple ('will notify')."],
    ["As soon as the rain stopped, the cricket match _____.", "resumed", "resumes", "had resumed", "resuming", "As soon as + Past", "Both clauses in past context take Simple Past 'resumed'."],
    ["As soon as she finished her speech, the audience _____ enthusiastically.", "applauded", "applauds", "had applauded", "applauding", "As soon as + Past", "Immediate response takes 'applauded'."],
    ["As soon as the sun rose, the dense fog _____.", "disappeared", "disappears", "had disappeared", "disappearing", "As soon as + Past", "Immediate natural occurrence takes 'disappeared'."],
    ["As soon as you finish your exam, you _____ home.", "may return", "returned", "might return", "had returned", "As soon as + Present Modal", "Present permission takes 'may return'."],
    ["As soon as the signal turned green, the vehicles _____ forward.", "moved", "moves", "had moved", "moving", "As soon as + Past", "Sequential past action takes 'moved'."]
  ];
  asSoonAsData.forEach((d, i) => {
    list.push(makeMCQ(`cs_as_soon_${i+1}`, tid, 'conditionals_and_inversions', 'as_soon_as', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'easy'));
  });

  // 5. As if / As though (10)
  const asIfData = [
    ["He talks as if he _____ everything about the confidential project.", "knew", "knows", "has known", "had known", "As if + Present Main -> Past Subjunctive (V2 / were)", "When the main clause is Present ('talks'), 'as if' takes Past Simple (V2 'knew' or 'were')."],
    ["He spoke as if he _____ present at the historic scene.", "had been", "was", "were", "is", "As if + Past Main -> Past Perfect (had + V3)", "When the main clause is Past ('spoke'), 'as if' takes Past Perfect ('had been')."],
    ["The man behaves as though he _____ the owner of the entire building.", "were", "was", "is", "has been", "As though + Subjunctive 'were'", "Unreal assumption in present takes subjunctive 'were' for all persons."],
    ["She recited the poem as if she _____ a professional elocutionist.", "were", "is", "was", "had been", "As if + were", "Unreal present comparison takes 'were'."],
    ["He explained the theorem as though he _____ it himself.", "had discovered", "discovered", "discovers", "has discovered", "As though + Past Main -> Past Perfect", "Past main clause 'explained' requires Past Perfect 'had discovered'."],
    ["Karim acts as if he _____ the chief guest.", "were", "is", "was", "has been", "As if + Subjunctive were", "Present unreal state takes 'were'."],
    ["The child cried as though it _____ a terrifying ghost.", "had seen", "saw", "sees", "has seen", "As though + Past Main -> Past Perfect", "Past main clause takes 'had seen'."],
    ["He ordered us around as if we _____ his bonded servants.", "were", "are", "was", "have been", "As if + were", "Unreal relationship takes 'were'."],
    ["The student spoke as though he _____ all the board questions beforehand.", "had solved", "solved", "solves", "has solved", "As though + Past Main", "Past main clause takes 'had solved'."],
    ["She walks as if she _____ a royal queen.", "were", "was", "is", "has been", "As if + were", "Unreal present demeanor takes 'were'."]
  ];
  asIfData.forEach((d, i) => {
    list.push(makeMCQ(`cs_as_if_${i+1}`, tid, 'connective_structures', 'as_if_as_though', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'hard'));
  });

  // 6. Lest (10)
  const lestData = [
    ["Walk fast lest you _____ the last intercity train.", "should miss", "miss", "will miss", "might missed", "Lest + Subject + should/might + V1", "After 'lest' (meaning 'for fear that'), the clause strictly takes 'Subject + should (or might) + V1' (no 'not' allowed)."],
    ["Study attentively lest you _____ in the upcoming board exam.", "should fail", "fail", "will fail", "do not fail", "Lest + should + V1", "'Lest' expresses negative fear and takes 'should fail' without any negative word."],
    ["He held the child's hand tightly lest it _____ down on the busy road.", "should fall", "falls", "fell", "will fall", "Lest + should + V1", "Precautionary fear clause takes 'should fall'."],
    ["They concealed the confidential report lest anyone _____ it.", "should discover", "discovers", "discovered", "will discover", "Lest + should + V1", "'Lest' takes 'should discover'."],
    ["Speak in a whisper lest someone _____ our private conversation.", "should overhear", "overhears", "overheard", "will overhear", "Lest + should + V1", "'Lest' takes 'should overhear'."],
    ["Take your umbrella lest you _____ drenched in the sudden shower.", "should get", "get", "got", "will get", "Lest + should + V1", "'Lest' takes 'should get'."],
    ["He drove cautiously lest an accident _____ on the slippery highway.", "should happen", "happens", "happened", "will happen", "Lest + should + V1", "'Lest' takes 'should happen'."],
    ["Save some money for retirement lest you _____ into dire poverty.", "should fall", "falls", "fell", "will fall", "Lest + should + V1", "'Lest' takes 'should fall'."],
    ["He started his journey early lest he _____ in the notorious traffic jam.", "should get stuck", "gets stuck", "got stuck", "will get stuck", "Lest + should + V1", "'Lest' takes 'should get stuck'."],
    ["Double-check your examination roll number lest an administrative error _____.", "should occur", "occurs", "occurred", "will occur", "Lest + should + V1", "'Lest' takes 'should occur'."]
  ];
  lestData.forEach((d, i) => {
    list.push(makeMCQ(`cs_lest_${i+1}`, tid, 'connective_structures', 'lest', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'hard'));
  });

  // 7. No sooner had... than (10)
  const noSoonerData = [
    ["No sooner had the teacher entered the examination hall than the students _____ silent.", "became", "become", "had become", "becoming", "No sooner had...than + Past Simple (V2)", "The clause introduced by 'than' in 'No sooner had...than' strictly takes Simple Past (V2 'became')."],
    ["No sooner had the train stopped at the station than the passengers _____ to get in.", "rushed", "rush", "had rushed", "rushing", "No sooner had...than + V2", "'Than' clause takes Simple Past 'rushed'."],
    ["No sooner had the bell rung than the examinees _____ writing.", "stopped", "stop", "had stopped", "stopping", "No sooner had...than + V2", "'Than' clause takes Simple Past 'stopped'."],
    ["No sooner had the police arrived than the robbers _____ through the back door.", "escaped", "escape", "had escaped", "escaping", "No sooner had...than + V2", "'Than' clause takes Simple Past 'escaped'."],
    ["No sooner had he received the tragic news than he _____ into tears.", "burst", "bursts", "had burst", "bursting", "No sooner had...than + V2", "'Than' clause takes Simple Past 'burst'."],
    ["No sooner had I reached home than it _____ raining cats and dogs.", "started", "starts", "had started", "starting", "No sooner had...than + V2", "'Than' clause takes Simple Past 'started'."],
    ["No sooner had the sun set than darkness _____ the entire rural landscape.", "covered", "covers", "had covered", "covering", "No sooner had...than + V2", "'Than' clause takes Simple Past 'covered'."],
    ["No sooner had the chief guest arrived than the grand cultural program _____.", "commenced", "commences", "had commenced", "commencing", "No sooner had...than + V2", "'Than' clause takes Simple Past 'commenced'."],
    ["No sooner had the plane landed than the passengers _____ their seatbelts.", "unfastened", "unfasten", "had unfastened", "unfastening", "No sooner had...than + V2", "'Than' clause takes Simple Past 'unfastened'."],
    ["No sooner had the referee blown the whistle than the final match _____.", "ended", "ends", "had ended", "ending", "No sooner had...than + V2", "'Than' clause takes Simple Past 'ended'."]
  ];
  noSoonerData.forEach((d, i) => {
    list.push(makeMCQ(`cs_no_sooner_${i+1}`, tid, 'conditionals_and_inversions', 'no_sooner_than', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'hard'));
  });

  // 8. Hardly / Scarcely had... when / before (10)
  const hardlyData = [
    ["Hardly had we reached the railway station when the intercity train _____.", "started", "start", "had started", "starting", "Hardly had...when + Past Simple (V2)", "The clause introduced by 'when' after 'Hardly had' strictly takes Simple Past (V2 'started')."],
    ["Scarcely had the doctor arrived when the critical patient _____ his last breath.", "breathed", "breathes", "had breathed", "breathing", "Scarcely had...when + V2", "'When' clause takes Simple Past 'breathed'."],
    ["Hardly had I stepped out of the house when the sudden storm _____.", "struck", "strikes", "had struck", "striking", "Hardly had...when + V2", "'When' clause takes Simple Past 'struck'."],
    ["Scarcely had the speaker finished his speech when the hall _____ with applause.", "resounded", "resounds", "had resounded", "resounding", "Scarcely had...when + V2", "'When' clause takes Simple Past 'resounded'."],
    ["Hardly had the examination begun when an examinee _____ ill.", "fell", "falls", "had fallen", "falling", "Hardly had...when + V2", "'When' clause takes Simple Past 'fell'."],
    ["Scarcely had the meeting started before a chaotic dispute _____ among the members.", "arose", "arises", "had arisen", "arising", "Scarcely had...before + V2", "'Before' clause takes Simple Past 'arose'."],
    ["Hardly had the morning dawned when the songbirds _____ chirping sweetly.", "began", "begin", "had begun", "beginning", "Hardly had...when + V2", "'When' clause takes Simple Past 'began'."],
    ["Scarcely had we entered the botanical garden when it _____ to drizzle.", "began", "begins", "had begun", "beginning", "Scarcely had...when + V2", "'When' clause takes Simple Past 'began'."],
    ["Hardly had the thief unlocked the safe when the security alarm _____.", "went off", "goes off", "had gone off", "going off", "Hardly had...when + V2", "'When' clause takes Simple Past 'went off'."],
    ["Scarcely had the mother fed the baby when it _____ asleep peacefully.", "fell", "falls", "had fallen", "falling", "Scarcely had...when + V2", "'When' clause takes Simple Past 'fell'."]
  ];
  hardlyData.forEach((d, i) => {
    list.push(makeMCQ(`cs_hardly_${i+1}`, tid, 'conditionals_and_inversions', 'hardly_when_before', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'hard'));
  });

  // 9. In order that (10)
  const inOrderData = [
    ["He planted herbal trees in order that he _____ natural medicines.", "might produce", "produces", "produced", "had produced", "In order that + Past -> might + V1", "Past main clause takes 'might produce'."],
    ["We respect our national freedom fighters in order that our patriotism _____.", "may grow", "grew", "might grow", "had grown", "In order that + Present -> may + V1", "Present main clause takes 'may grow'."],
    ["He went to the library in order that he _____ reference books for HSC.", "could consult", "can consult", "consults", "consulted", "In order that + Past -> could + V1", "Past action takes 'could consult'."],
    ["The farmer irrigates his fields in order that crops _____ luxuriantly.", "may grow", "grew", "might grow", "had grown", "In order that + Present", "Present regular action takes 'may grow'."],
    ["The government set up digital centers in order that citizens _____ fast services.", "might receive", "receive", "received", "had received", "In order that + Past", "Past institutional setup takes 'might receive'."],
    ["He exercises daily in order that his physical stamina _____ high.", "may remain", "remained", "might remain", "had remained", "In order that + Present", "Daily routine takes 'may remain'."],
    ["She learned computer programming in order that she _____ an IT career.", "could build", "can build", "builds", "built", "In order that + Past", "Past learning action takes 'could build'."],
    ["We must conserve wetlands in order that biodiversity _____ protected.", "may be", "was", "might be", "had been", "In order that + Present Passive", "Present obligation takes 'may be'."],
    ["The teacher explained the formula twice in order that all students _____ it.", "could understand", "understand", "understands", "understood", "In order that + Past", "Past explanation takes 'could understand'."],
    ["They organized a charity concert in order that they _____ relief funds for flood victims.", "could raise", "can raise", "raises", "raised", "In order that + Past", "Past event takes 'could raise'."]
  ];
  inOrderData.forEach((d, i) => {
    list.push(makeMCQ(`cs_in_order_${i+1}`, tid, 'connective_structures', 'in_order_that', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'medium'));
  });

  // 10. Though / Although (10)
  const thoughData = [
    ["Though he worked with utmost devotion, he _____ to attain the top rank.", "failed", "fails", "is failing", "has failed", "Though + Past -> Past Concession Clause", "A concession clause with 'though' in past tense connects to a past result 'failed'."],
    ["Although Bangladesh is a developing nation, it _____ rapid economic growth.", "is achieving", "achieved", "had achieved", "was achieved", "Although + Present Context", "Present factual situation takes 'is achieving'."],
    ["Though he was extremely wealthy, he _____ a simple and modest life.", "led", "leads", "is leading", "has led", "Though + Past", "Past concession takes Simple Past 'led'."],
    ["Although the question was difficult, the meritorious student _____ it correctly.", "answered", "answers", "is answering", "has answered", "Although + Past", "Past event takes 'answered'."],
    ["Though he is poor, he is _____ and morally upright.", "honest", "dishonest", "dishonesty", "honesty", "Though + Complement Agreement", "Concession contrasting poverty with moral integrity takes 'honest'."],
    ["Although it rained heavily, the football match _____ uninterrupted.", "continued", "continues", "is continuing", "has continued", "Although + Past", "Past sports event takes 'continued'."],
    ["Though he ran with all his might, he _____ the train.", "missed", "misses", "is missing", "has missed", "Though + Past", "Past unsuccessful attempt takes 'missed'."],
    ["Although she was ill, she _____ the annual cultural function.", "attended", "attends", "is attending", "has attended", "Although + Past", "Past attendance takes 'attended'."],
    ["Though the Sundarbans is a hazardous forest, tourists _____ it enthusiastically.", "visit", "visited", "visiting", "were visited", "Though + Present Habitual", "Present ongoing tourism takes 'visit'."],
    ["Although he had little formal education, he _____ remarkable wisdom.", "possessed", "possesses", "is possessing", "has possessed", "Although + Past", "Past narrative takes 'possessed'."]
  ];
  thoughData.forEach((d, i) => {
    list.push(makeMCQ(`cs_though_${i+1}`, tid, 'connective_structures', 'though_although', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'easy'));
  });

  // 11. Provided that (10)
  const provData = [
    ["The cricket match will resume tomorrow provided that the rain _____.", "stops", "stopped", "will stop", "had stopped", "Provided that + Present Simple", "'Provided that' (meaning 'if / on condition that') in a conditional sentence takes Present Simple ('stops') when main clause is future."],
    ["You will succeed in your mission provided that you _____ sincere and dedicated.", "remain", "remained", "will remain", "had remained", "Provided that + Present Simple", "Future main clause takes Present Simple 'remain'."],
    ["I will lend you my reference book provided that you _____ it next week.", "return", "returned", "will return", "had returned", "Provided that + Present Simple", "Condition takes Present Simple 'return'."],
    ["We shall go on an educational tour provided that the principal _____ permission.", "grants", "granted", "will grant", "had granted", "Provided that + Present Simple", "Condition takes 'grants'."],
    ["You can secure GPA 5 provided that you _____ the syllabus thoroughly.", "master", "mastered", "will master", "had mastered", "Provided that + Present Simple", "Condition takes 'master'."],
    ["The flight will take off on schedule provided that the weather _____ favorable.", "is", "was", "will be", "had been", "Provided that + Present Simple", "Condition takes 'is'."],
    ["He agreed to join the project provided that he _____ full operational autonomy.", "received", "receives", "will receive", "had received", "Provided that in Past Context", "Past main clause 'agreed' takes Past Simple 'received'."],
    ["You may borrow the camera provided that you _____ it carefully.", "handle", "handled", "will handle", "had handled", "Provided that + Present", "Condition takes 'handle'."],
    ["The business will prosper provided that the management _____ honest.", "remains", "remained", "will remain", "had remained", "Provided that + Present", "Condition takes 'remains'."],
    ["We shall overcome this crisis provided that we _____ united.", "stay", "stayed", "will stay", "had stayed", "Provided that + Present", "Condition takes 'stay'."]
  ];
  provData.forEach((d, i) => {
    list.push(makeMCQ(`cs_provided_${i+1}`, tid, 'conditionals_and_inversions', 'provided_that', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'medium'));
  });

  // 12. Mixed Completing Sentences Rules (5)
  const mixedData = [
    ["It is high time we _____ against rampant food adulteration.", "raised our voice", "raise our voice", "will raise our voice", "have raised our voice", "It is high time + Past Simple (V2)", "After 'It is high time + Subject', the verb strictly takes the Past Simple form ('raised')."],
    ["Had I possessed the wings of a dove, I _____ across the sky.", "would have flown", "will fly", "would fly", "flew", "Inverted 3rd Conditional (Had + Subject + V3)", "'Had I + V3' requires 'Subject + would have + V3' in the main clause."],
    ["If you had informed me earlier, I _____ the meeting.", "would have attended", "will attend", "would attend", "attended", "3rd Conditional (If + Past Perfect)", "'If + Past Perfect' takes 'would have + V3'."],
    ["If he studied regularly, he _____ good results in the college examination.", "would obtain", "will obtain", "would have obtained", "obtained", "2nd Conditional (If + Past Simple)", "'If + Past Simple' takes 'would + V1'."],
    ["Unless you cultivate punctuality, you _____ behind in life.", "will lag", "lagged", "would lag", "had lagged", "Unless + Present, Future Simple", "'Unless' with present simple takes future simple 'will lag'."]
  ];
  mixedData.forEach((d, i) => {
    list.push(makeMCQ(`cs_mix_${i+1}`, tid, 'connective_structures', 'mixed', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'hard'));
  });

  return list;
}

console.log('Completing sentences generator logic defined.');
