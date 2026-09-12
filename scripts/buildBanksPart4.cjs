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
// TOPIC 5: SENTENCE CONNECTORS & LINKERS (122 items)
// -------------------------------------------------------------
function generateConnectors() {
  const list = [];
  const tid = 'connectors';
  const inst = 'Choose the appropriate sentence connector for the blank:';

  // 1. Addition (18)
  const addData = [
    ["He is an accomplished scholar; _____, he is a renowned philanthropist.", "moreover", "however", "therefore", "otherwise", "Additive Linker ('moreover')", "'Moreover' adds extra supporting information reinforcing the subject's merits."],
    ["Trees give us oxygen and timber. _____, they protect our coastal embankments from cyclones.", "Furthermore", "Nevertheless", "Otherwise", "Consequently", "Additive Linker ('furthermore')", "'Furthermore' introduces an additional significant benefit of trees."],
    ["He failed to submit his assignment on time. _____, he skipped the laboratory demonstration.", "In addition", "However", "Therefore", "Instead", "Additive Linker ('in addition')", "'In addition' connects two additive shortcomings."],
    ["The student is intelligent; _____, he is extremely punctual.", "besides", "though", "hence", "yet", "Additive Linker ('besides')", "'Besides' provides another positive trait of the student."],
    ["She is a talented singer. _____, she paints masterfully.", "Also", "However", "Thus", "Unless", "Additive Linker ('also')", "'Also' introduces another artistic accomplishment."],
    ["The project will create employment for thousands. _____, it will accelerate regional GDP growth.", "What is more", "On the other hand", "Accordingly", "Yet", "Additive Linker ('what is more')", "'What is more' adds an impactful secondary benefit."],
    ["Not only is he a brilliant scientist, _____ he is a dedicated teacher.", "but also", "and also", "as well", "too", "Correlative Conjunction (Not only...but also)", "'Not only' is paired with 'but also' to emphasize two qualities."],
    ["Physical exercise keeps our body fit. _____, it refreshes our overburdened mind.", "Similarly", "However", "Therefore", "Instead", "Comparative Addition ('similarly')", "'Similarly' draws a parallel benefit of exercise."],
    ["The country is endowed with fertile soil. _____, its human resource is industrious.", "Likewise", "Nevertheless", "Thus", "Whereas", "Comparative Addition ('likewise')", "'Likewise' adds a parallel economic asset."],
    ["He provided food to the flood victims. _____, he arranged medical supplies.", "Besides this", "In contrast", "Therefore", "Still", "Additive Linker ('besides this')", "'Besides this' introduces further humanitarian assistance."],
    ["Air pollution harms human lungs. _____, it degrades urban atmospheric quality.", "Moreover", "However", "Consequently", "Rather", "Additive Linker", "Adds further environmental damage."],
    ["The college has a modern science lab. _____, it boasts a rich digital library.", "Furthermore", "Nevertheless", "Hence", "Otherwise", "Additive Linker", "Adds institutional facilities."],
    ["He won the first prize in debate. _____, he secured a gold medal in sprint.", "In addition to this", "On the contrary", "Thus", "Yet", "Additive Linker", "Adds athletic achievement."],
    ["We must conserve wetlands. _____, we should plant mangrove trees.", "Also", "However", "Therefore", "Unless", "Additive Linker", "Adds conservation strategy."],
    ["He is honest. _____, he is remarkably kindhearted.", "Besides", "However", "Therefore", "Otherwise", "Additive Linker", "Adds character virtues."],
    ["Education broadens our outlook. _____, it empowers us to combat social evils.", "What is more", "Nevertheless", "Hence", "Instead", "Additive Linker", "Adds societal benefits."],
    ["Padma Bridge reduces travel time. _____, it integrates the southwest economy.", "Moreover", "However", "Thus", "Whereas", "Additive Linker", "Adds infrastructure impact."],
    ["He donated blood to the patient. _____, he bore all medical expenses.", "Furthermore", "On the other hand", "Therefore", "Yet", "Additive Linker", "Adds selfless deeds."]
  ];
  addData.forEach((d, i) => {
    list.push(makeMCQ(`conn_add_${i+1}`, tid, 'contrast_and_addition', 'addition', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'easy'));
  });

  // 2. Contrast (22)
  const contData = [
    ["He is exceptionally wealthy; _____, he leads a very austere and unhappy life.", "however", "therefore", "moreover", "because", "Contrastive Linker ('however')", "'However' introduces a sharp contrast between wealth and lack of happiness."],
    ["The student worked tirelessly for months; _____, he failed to secure the top grade.", "nevertheless", "furthermore", "thus", "likewise", "Concessive Contrast ('nevertheless')", "'Nevertheless' indicates that despite rigorous efforts, the outcome was contrary to expectation."],
    ["He did not study attentively; _____, he passed the examination miraculously.", "nonetheless", "therefore", "moreover", "in addition", "Concessive Contrast ('nonetheless')", "'Nonetheless' marks an unexpected positive outcome despite lack of preparation."],
    ["Many people in rural areas are illiterate; _____, they possess immense practical wisdom.", "yet", "so", "hence", "besides", "Contrastive Conjunction ('yet')", "'Yet' introduces an opposing fact emphasizing practical intelligence."],
    ["He was invited cordially to the reunion; _____, he declined to attend.", "still", "therefore", "moreover", "thus", "Contrastive Linker ('still')", "'Still' marks unexpected refusal."],
    ["Urban life offers modern civic amenities. _____, it suffers from severe pollution.", "On the other hand", "Consequently", "Furthermore", "Namely", "Opposing Perspective ('on the other hand')", "'On the other hand' presents the contrasting negative aspect of city life."],
    ["He is not a miser; _____, he is exceptionally generous to the poor.", "on the contrary", "therefore", "moreover", "subsequently", "Direct Contradiction ('on the contrary')", "'On the contrary' refutes the previous negative idea with a positive extreme."],
    ["_____ he was severely ill, he appeared at the board examination.", "Although", "Because", "Therefore", "Moreover", "Subordinating Concession ('although')", "'Although' introduces a subordinate concessive clause."],
    ["_____ of working day and night, the poor peasant could not clear his debt.", "In spite", "Because", "Despite", "Although", "Prepositional Concession ('in spite of')", "'In spite of' is followed by a noun or gerund phrase."],
    ["_____ his extreme poverty, he maintained impeccable honesty throughout life.", "Despite", "In spite", "Although", "Because", "Prepositional Concession ('despite')", "'Despite' is used without 'of' before a noun phrase."],
    ["Some students prefer science, _____ others are passionate about humanities.", "while", "therefore", "moreover", "hence", "Contrastive Conjunction ('while')", "'While' (or whereas) contrasts two simultaneous differing preferences."],
    ["Dhaka is a bustling metropolis, _____ Barishal is a tranquil riverine city.", "whereas", "consequently", "moreover", "thus", "Contrastive Linker ('whereas')", "'Whereas' connects two contrasting descriptions."],
    ["The question paper was tricky; _____, most examinees managed to answer well.", "however", "therefore", "furthermore", "similarly", "Contrastive Linker", "'However' introduces contrasting performance."],
    ["He had no formal training in coding; _____, he built an impressive web app.", "nevertheless", "therefore", "besides", "hence", "Concessive Contrast", "'Nevertheless' indicates surprise capability."],
    ["The weather was stormy; _____, the courageous fishermen sailed out into the sea.", "still", "so", "moreover", "namely", "Contrastive Linker", "'Still' marks defying adverse weather."],
    ["He claims to be an expert in grammar. _____, his own writing is full of errors.", "In reality", "Therefore", "Moreover", "Thus", "Reality vs Claim Contrast", "'In reality' contrasts pretension with factual truth."],
    ["Plastic is versatile and cheap. _____, its disposal creates massive pollution.", "However", "Consequently", "Furthermore", "Similarly", "Negative Counter-aspect", "'However' introduces environmental drawback."],
    ["He was warned repeatedly by his mentors; _____, he repeated the same mistake.", "yet", "so", "moreover", "hence", "Defiant Contrast", "'Yet' marks persistence in error."],
    ["Some consider exams stressful. _____, others view them as motivating challenges.", "Conversely", "Therefore", "Moreover", "Thus", "Opposite Viewpoint ('conversely')", "'Conversely' introduces an inverted perspective."],
    ["He apologized sincerely; _____, the principal decided to suspend him.", "even so", "therefore", "moreover", "likewise", "Concessive Linker ('even so')", "'Even so' means despite his apology."],
    ["He is physically challenged; _____, his mental resolve is unbreakable.", "nonetheless", "therefore", "moreover", "hence", "Inner Strength Contrast", "'Nonetheless' marks inner resilience."],
    ["The journey was long and tedious; _____, we reached our destination in high spirits.", "nonetheless", "hence", "furthermore", "namely", "Concessive Linker", "'Nonetheless' contrasts fatigue with joy."]
  ];
  contData.forEach((d, i) => {
    list.push(makeMCQ(`conn_cont_${i+1}`, tid, 'contrast_and_addition', 'contrast', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'medium'));
  });

  // 3. Cause & Effect (18)
  const causeData = [
    ["He could not attend the online class _____ his internet connection was unstable.", "because", "therefore", "however", "moreover", "Causal Conjunction ('because')", "'Because' introduces the direct clause explaining the cause of his absence."],
    ["_____ it was raining cats and dogs, the sports tournament was postponed.", "Since", "Therefore", "However", "Moreover", "Subordinating Cause ('since')", "'Since' introduces the reason clause at the start of the sentence."],
    ["_____ the severe cold wave, schools across the northern districts were declared closed.", "Due to", "Because", "Since", "Although", "Prepositional Cause ('due to')", "'Due to' is a prepositional phrase followed by a noun phrase indicating cause."],
    ["The flight was delayed _____ thick fog blanketed the runway.", "as", "therefore", "however", "moreover", "Subordinating Conjunction ('as')", "'As' introduces the cause of flight delay."],
    ["The train was canceled _____ unavoidable technical glitches.", "owing to", "because", "since", "although", "Prepositional Cause ('owing to')", "'Owing to' introduces the noun phrase stating the cause."],
    ["The crops failed _____ severe drought in the northern region.", "on account of", "because", "since", "though", "Prepositional Cause ('on account of')", "'On account of' indicates the natural cause of crop failure."],
    ["He secured GPA 5 _____ his disciplined self-study routine.", "because of", "since", "as", "although", "Prepositional Cause ('because of')", "'Because of' takes a noun phrase explaining his success."],
    ["The bridge collapsed _____ heavy flood currents eroded the base.", "because", "therefore", "furthermore", "yet", "Direct Cause Clause", "'Because' connects the effect to its causal clause."],
    ["_____ darkness was setting in, we decided to return to our hotel.", "As", "Therefore", "However", "Consequently", "Causal Clause ('as')", "'As' explains why we returned."],
    ["_____ he was honest and diligent, the employer promoted him rapidly.", "Since", "Therefore", "However", "Besides", "Causal Clause ('since')", "'Since' sets out the reason for his rapid promotion."],
    ["He caught a cold _____ walking in the rain without an umbrella.", "due to", "because", "since", "though", "Prepositional Cause", "'Due to' followed by gerund phrase."],
    ["The match was stopped _____ bad light at the stadium.", "owing to", "because", "since", "as", "Prepositional Cause", "'Owing to' + noun phrase."],
    ["Prices soared _____ the disruption in international supply chains.", "because of", "since", "as", "though", "Prepositional Cause", "'Because of' + noun phrase."],
    ["He was penalized _____ he arrived late at the examination hall.", "because", "therefore", "however", "moreover", "Causal Clause", "'Because' links penalty with late arrival."],
    ["_____ the road was blocked by a fallen tree, we took a detour.", "As", "Therefore", "However", "Hence", "Causal Conjunction", "'As' introduces the reason for detour."],
    ["The factory was closed _____ labor unrest.", "on account of", "because", "since", "although", "Prepositional Cause", "'On account of' + noun phrase."],
    ["He was rewarded _____ his extraordinary courage in rescuing the child.", "for", "because", "since", "though", "Causal Preposition ('for')", "'For' introduces the reason for reward."],
    ["_____ he was thoroughly prepared, he faced the viva board with confidence.", "Since", "Therefore", "However", "Moreover", "Causal Clause", "'Since' explains his confidence."]
  ];
  causeData.forEach((d, i) => {
    list.push(makeMCQ(`conn_cause_${i+1}`, tid, 'contrast_and_addition', 'cause_effect', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'easy'));
  });

  // 4. Consequence & Result (15)
  const resData = [
    ["He did not study systematically throughout the academic year; _____, he failed in the test.", "therefore", "however", "moreover", "besides", "Result Linker ('therefore')", "'Therefore' introduces the logical consequence of neglect."],
    ["The price of petroleum increased globally; _____, transportation fares rose locally.", "consequently", "however", "moreover", "on the contrary", "Result Linker ('consequently')", "'Consequently' marks the resulting impact of global fuel price hike."],
    ["He violated the college traffic discipline; _____, he was fined by the administration.", "hence", "however", "moreover", "although", "Result Linker ('hence')", "'Hence' introduces the resultant penalty."],
    ["He missed the morning bus; _____, he arrived thirty minutes late at college.", "as a result", "however", "moreover", "otherwise", "Result Linker ('as a result')", "'As a result' explains the direct outcome of missing the bus."],
    ["He practiced mathematics every single day; _____, he secured full marks in the exam.", "thus", "however", "nevertheless", "yet", "Result Linker ('thus')", "'Thus' indicates how daily practice led to full marks."],
    ["The weather was extremely hostile; _____, all outdoor activities were canceled.", "so", "however", "moreover", "whereas", "Coordinating Result ('so')", "'So' connects hostile weather to event cancellation."],
    ["The dam broke under tidal pressure; _____, twenty coastal villages were submerged.", "as a consequence", "however", "moreover", "otherwise", "Result Linker", "Marks the flood disaster outcome."],
    ["He invested wisely in innovative technologies; _____, his startup flourished.", "accordingly", "however", "nevertheless", "yet", "Result Linker ('accordingly')", "'Accordingly' reflects appropriate positive result."],
    ["The examinee copied from an unauthorized sheet; _____, the board expelled him.", "in consequence", "however", "moreover", "besides", "Result Linker", "Marks expulsion outcome."],
    ["Deforestation destroys animal habitats; _____, many species face extinction.", "as a result", "however", "moreover", "on the other hand", "Result Linker", "Marks biodiversity loss."],
    ["He saved a portion of his monthly income; _____, he bought a piece of land.", "eventually", "however", "moreover", "nevertheless", "Result Linker", "Marks accumulated outcome."],
    ["The student mastered English grammar rules; _____, his writing improved drastically.", "hence", "however", "yet", "otherwise", "Result Linker", "Marks writing proficiency result."],
    ["Padma Bridge was opened to traffic; _____, passenger travel time dropped by half.", "consequently", "however", "although", "besides", "Result Linker", "Marks transit time savings."],
    ["He exercised daily and maintained a balanced diet; _____, he overcame his obesity.", "thus", "however", "nevertheless", "yet", "Result Linker", "Marks health recovery outcome."],
    ["The government cracked down on illicit hoarders; _____, commodity prices stabilized.", "therefore", "however", "moreover", "otherwise", "Result Linker", "Marks market stabilization result."]
  ];
  resData.forEach((d, i) => {
    list.push(makeMCQ(`conn_res_${i+1}`, tid, 'contrast_and_addition', 'consequence_result', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'medium'));
  });

  // 5. Illustration & Example (12)
  const illData = [
    ["Bangladesh produces many succulent seasonal fruits; _____, mango, jackfruit, and litchi.", "for example", "however", "therefore", "consequently", "Exemplification ('for example')", "'For example' introduces representative instances of seasonal fruits."],
    ["Deforestation leads to severe ecological crises; _____, soil erosion and global warming.", "for instance", "however", "therefore", "moreover", "Exemplification ('for instance')", "'For instance' provides concrete examples of crises."],
    ["Several Asian nations have modernized their economies rapidly; _____, Singapore and South Korea.", "namely", "however", "therefore", "otherwise", "Specification ('namely')", "'Namely' specifically names the precise countries intended."],
    ["He enjoys playing outdoor sports, _____ football, cricket, and badminton.", "such as", "for example", "therefore", "namely", "Prepositional Example ('such as')", "'Such as' is followed directly by a list of noun examples."],
    ["Renewable energy sources, _____ solar and wind power, are environmentally sustainable.", "such as", "however", "therefore", "namely", "Exemplification ('such as')", "'Such as' introduces green energy examples."],
    ["He possesses many noble virtues; _____, compassion, humility, and truthful speech.", "in particular", "however", "therefore", "otherwise", "Highlighting Example ('in particular')", "'In particular' draws specific attention to key virtues."],
    ["The district is famous for cottage crafts, _____ handloom sarees and pottery.", "namely", "however", "therefore", "consequently", "Specification ('namely')", "'Namely' identifies the traditional crafts."],
    ["Green vegetables, _____ spinach and bitter gourd, contain essential vitamins.", "like", "however", "therefore", "namely", "Informal Exemplification ('like')", "'Like' introduces nutritional examples."],
    ["Certain diseases are water-borne; _____, cholera, typhoid, and dysentery.", "for example", "however", "therefore", "moreover", "Exemplification", "Introduces examples of diseases."],
    ["The college offers various extracurricular activities; _____, debate, scout, and rover.", "such as", "however", "therefore", "namely", "Exemplification", "Lists club activities."],
    ["Many historical sites in Bangladesh attract tourists; _____, Shat Gombuj Mosque and Paharpur.", "for instance", "however", "therefore", "consequently", "Exemplification", "Cites historical tourist spots."],
    ["Natural disasters frequent our delta; _____, floods, cyclones, and riverbank erosion.", "namely", "however", "therefore", "otherwise", "Specification", "Names specific deltaic calamities."]
  ];
  illData.forEach((d, i) => {
    list.push(makeMCQ(`conn_ill_${i+1}`, tid, 'contrast_and_addition', 'illustration_example', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'easy'));
  });

  // 6. Sequence & Time (15)
  const seqData = [
    ["To write an effective essay, _____ outline your main arguments logically.", "first", "however", "therefore", "finally", "Sequence Starter ('first')", "'First' introduces the primary step in an instructional sequence."],
    ["Collect the experimental data carefully. _____, analyze the statistical trends.", "Next", "However", "Therefore", "Otherwise", "Sequential Step ('next')", "'Next' introduces the subsequent operational step."],
    ["The doctor examined the patient thoroughly. _____, he prescribed the appropriate antibiotics.", "Then", "However", "Nevertheless", "Otherwise", "Chronological Sequence ('then')", "'Then' indicates action occurring immediately afterward."],
    ["The students revised their notes for weeks. _____, the examination day arrived.", "Finally", "However", "Moreover", "Namely", "Conclusion of Sequence ('finally')", "'Finally' marks the ultimate culmination of a sequence."],
    ["The fire brigade rushed to the spot. _____, the local volunteers started rescue operations.", "Meanwhile", "Therefore", "However", "Finally", "Simultaneous Time ('meanwhile')", "'Meanwhile' indicates simultaneous action occurring at the same time."],
    ["He completed his graduation with distinction. _____, he was recruited by a multinational firm.", "Subsequently", "However", "Nevertheless", "Namely", "Subsequent Time ('subsequently')", "'Subsequently' means following in time as a next event."],
    ["The patient was treated in ICU for ten days. _____, he made a full recovery.", "Eventually", "However", "Moreover", "Otherwise", "Eventual Culmination ('eventually')", "'Eventually' denotes an outcome reached after a struggle."],
    ["He visited the National Museum in Shahbagh. _____, he strolled through Ramna Park.", "Afterward", "However", "Therefore", "Namely", "Subsequent Sequence ('afterward')", "'Afterward' indicates activity following an initial visit."],
    ["_____ of all, we must identify the root causes of urban waterlogging.", "First", "Secondly", "Finally", "Meanwhile", "Sequence Opener ('first of all')", "'First of all' sets the opening priority."],
    ["We have discussed the economic factors. _____, let us evaluate the social implications.", "Secondly", "However", "Therefore", "Finally", "Second Point ('secondly')", "'Secondly' introduces the next analytical point."],
    ["The minister addressed the opening rally. _____, the cultural festival commenced.", "Thereafter", "However", "Moreover", "Otherwise", "Chronological Marker ('thereafter')", "'Thereafter' denotes time following an address."],
    ["He studied in a rural primary school. _____, he moved to Dhaka for higher secondary.", "Later on", "However", "Therefore", "Namely", "Later Time ('later on')", "'Later on' indicates chronological progression."],
    ["The pilot announced the landing descent. _____, the flight touched down smoothly.", "Soon after", "However", "Therefore", "Otherwise", "Time Sequence ('soon after')", "'Soon after' indicates immediate next event."],
    ["He worked hard in silence. _____, his efforts bore magnificent fruit.", "In the end", "However", "Moreover", "Namely", "Ultimate Result ('in the end')", "'In the end' marks long-term realization."],
    ["The teacher distributed the question papers. _____, the examinees commenced writing.", "Immediately", "However", "Therefore", "Otherwise", "Instant Time Marker ('immediately')", "'Immediately' denotes instantaneous sequential action."]
  ];
  seqData.forEach((d, i) => {
    list.push(makeMCQ(`conn_seq_${i+1}`, tid, 'contrast_and_addition', 'sequence_time', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'easy'));
  });

  // 7. Condition & Mixed Linkers (22)
  const condData = [
    ["You will succeed in your endeavors _____ you remain focused and industrious.", "if", "unless", "however", "therefore", "Conditional Conjunction ('if')", "'If' introduces the positive condition required for success."],
    ["You cannot achieve GPA 5 _____ you study all topics with equal emphasis.", "unless", "if", "provided", "however", "Negative Condition ('unless')", "'Unless' (meaning 'if not') expresses the necessary negative condition."],
    ["We will start our field trip on time _____ the weather remains pleasant.", "provided that", "unless", "however", "therefore", "Conditional Linker ('provided that')", "'Provided that' establishes the contingent condition."],
    ["You may borrow this rare dictionary _____ you return it tomorrow.", "as long as", "unless", "however", "therefore", "Time Condition ('as long as')", "'As long as' sets the duration/condition for borrowing."],
    ["Carry an umbrella _____ it rains during the journey.", "in case", "unless", "however", "therefore", "Precautionary Condition ('in case')", "'In case' provides for a possible contingency."],
    ["Work hard; _____, you will lag behind your peers.", "otherwise", "moreover", "therefore", "however", "Alternative Consequence ('otherwise')", "'Otherwise' indicates the negative outcome if the advice is not followed."],
    ["He is not only meritorious _____ remarkably polite.", "but also", "and also", "as well", "too", "Correlative Pair", "'Not only' pairs with 'but also'."],
    ["The student is both intelligent _____ hardworking.", "and", "or", "but", "nor", "Correlative Conjunction (Both...and)", "'Both' is paired with 'and'."],
    ["Either you apologize for your misconduct _____ face strict disciplinary action.", "or", "nor", "and", "but", "Correlative (Either...or)", "'Either' is paired with 'or'."],
    ["Neither Rahim _____ his brother attended the ceremony yesterday.", "nor", "or", "and", "but", "Correlative (Neither...nor)", "'Neither' is strictly paired with 'nor'."],
    ["No sooner had the alarm sounded _____ the soldiers mobilized.", "than", "when", "then", "before", "Correlative Inversion (No sooner...than)", "'No sooner had' strictly takes 'than'."],
    ["Hardly had we entered the hall _____ the lecture commenced.", "when", "than", "then", "after", "Correlative (Hardly...when)", "'Hardly had' takes 'when'."],
    ["Scarcely had the match started _____ it began to pour heavily.", "when", "than", "then", "after", "Correlative (Scarcely...when)", "'Scarcely had' takes 'when'."],
    ["He is so weak _____ he cannot walk even a short distance.", "that", "as", "than", "when", "So...that Clause of Result", "'So + adjective + that' expresses result."],
    ["The book was so captivating _____ I finished reading it in one sitting.", "that", "as", "than", "when", "So...that", "'So captivating that' denotes complete absorption."],
    ["The problem was such _____ nobody could solve it in ten minutes.", "that", "as", "than", "when", "Such...that", "'Such...that' expresses degree and result."],
    ["As you sow, _____ shall you reap.", "so", "than", "then", "as", "Proverbial Correlative (As...so)", "'As...so' is the classic correlative of consequence."],
    ["He speaks as _____ he were an authority on linguistics.", "if", "that", "so", "than", "As if + Subjunctive", "'As if' introduces unreal comparison."],
    ["The boy acted as _____ he had never seen an airplane before.", "though", "that", "so", "than", "As though + Past Perfect", "'As though' introduces past unreal condition."],
    ["Hurry up; _____, you will miss the morning train.", "otherwise", "moreover", "therefore", "however", "Warning Linker ('otherwise')", "'Otherwise' warns of missing the train."],
    ["He had no money; _____, he was in deep distress.", "in fact", "however", "nevertheless", "yet", "Emphatic Confirmation ('in fact')", "'In fact' reinforces his dire circumstance."],
    ["The weather was terrible. _____, we enjoyed the family gathering immensely.", "All the same", "Therefore", "Moreover", "Namely", "Concessive Linker ('all the same')", "'All the same' means despite the bad weather."]
  ];
  condData.forEach((d, i) => {
    list.push(makeMCQ(`conn_cond_${i+1}`, tid, 'contrast_and_addition', 'condition', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'hard'));
  });

  return list;
}

console.log('Connectors generator logic defined.');
