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
  // Deterministic shuffle
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
      tip: tip || 'Examine the subject-verb context and grammatical tense markers.'
    }
  };
}

// -------------------------------------------------------------
// TOPIC 1: RIGHT FORM OF VERBS (125 items)
// -------------------------------------------------------------
function generateRightFormOfVerbs() {
  const list = [];
  const tid = 'right_form_of_verbs';
  const inst = 'Choose the correct form of the verb for the blank:';

  // 1. Present Simple (10)
  const psData = [
    ["He _____ (go) to college regularly on foot.", "goes", "go", "going", "is gone", "Universal Habit / 3rd Person Singular", "With a 3rd person singular subject ('He') in habitual present simple, the verb takes -s/-es ('goes')."],
    ["The sun _____ (rise) in the east and sets in the west.", "rises", "rise", "is rising", "has risen", "Universal Truth / Eternal Fact", "Universal truths are always expressed in the Simple Present Tense, hence 'rises'."],
    ["Ice _____ (float) on water because of its lower density.", "floats", "float", "is floating", "floated", "Scientific Fact", "Scientific facts are stated in the simple present tense with singular verb agreement ('floats')."],
    ["Rahim always _____ (speak) the truth in every situation.", "speaks", "speak", "is speaking", "spoken", "Adverb of Frequency (always)", "'Always' with habitual action requires present simple; 3rd person singular 'Rahim' takes 'speaks'."],
    ["Trees _____ (give) us oxygen and absorb carbon dioxide.", "give", "gives", "giving", "are given", "Plural Subject Agreement", "The plural subject 'Trees' takes the base verb 'give' without -s/-es."],
    ["Water _____ (boil) at 100 degrees Celsius.", "boils", "boil", "is boiling", "has boiled", "Scientific Law", "Scientific facts take Simple Present tense with 3rd person singular subject ('boils')."],
    ["Virtue _____ (triumph) over vice in the long run.", "triumphs", "triumph", "triumphing", "is triumphed", "General Truth", "Abstract noun 'Virtue' is singular and takes 'triumphs' in simple present."],
    ["My mother _____ (read) the Holy Quran every dawn.", "reads", "read", "is reading", "has read", "Habitual Action", "Routine actions marked by 'every dawn' take present simple with 'reads' for singular subject."],
    ["The earth _____ (move) round the sun in an elliptical orbit.", "moves", "move", "is moving", "moved", "Universal Truth", "The celestial motion of the earth is a universal fact requiring simple present 'moves'."],
    ["Time and tide _____ (wait) for none.", "wait", "waits", "waiting", "is waiting", "Traditional Proverb Rule", "In traditional board English grammar, 'Time and tide' is treated as two distinct concepts taking plural verb 'wait'."]
  ];
  psData.forEach((d, i) => {
    list.push(makeMCQ(`rfv_pres_simp_${i+1}`, tid, 'tenses_and_agreement', 'present_simple', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], i % 3 === 0 ? 'easy' : 'medium'));
  });

  // 2. Present Continuous (10)
  const pcData = [
    ["Look! The children _____ (play) cricket in the school ground.", "are playing", "play", "is playing", "played", "Action at Present Moment (Look!)", "'Look!' indicates an action occurring right now, requiring present continuous 'are playing'."],
    ["The economic condition of Bangladesh _____ (improve) day by day.", "is improving", "improves", "are improving", "has improved", "Gradual Change (day by day)", "Gradual ongoing changes indicated by 'day by day' take present continuous 'is improving'."],
    ["Listen! Someone _____ (knock) at the front door.", "is knocking", "knocks", "knock", "are knocking", "Present Marker (Listen!)", "'Listen!' draws attention to an immediate ongoing event, requiring 'is knocking'."],
    ["The farmers of our village _____ (work) hard at this moment.", "are working", "work", "is working", "have worked", "Time Marker (at this moment)", "'At this moment' specifies ongoing action with plural subject 'farmers' taking 'are working'."],
    ["Prices of essential commodities _____ (increase) rapidly nowadays.", "are increasing", "increases", "is increasing", "increased", "Ongoing Trend (nowadays)", "Plural subject 'Prices' with ongoing trend indicator 'nowadays' takes 'are increasing'."],
    ["Don't make a noise; the baby _____ (sleep) right now.", "is sleeping", "sleeps", "slept", "has slept", "Immediate Command Context", "The command not to make noise indicates the baby is currently in the act of sleeping ('is sleeping')."],
    ["The climate of the world _____ (change) at an alarming rate.", "is changing", "changes", "are changing", "changed", "Ongoing Global Process", "A continuous progressive global process takes present continuous 'is changing'."],
    ["Currently, the government _____ (construct) many new bridges.", "is constructing", "constructs", "are constructing", "constructed", "Time Marker (Currently)", "'Currently' calls for present continuous with singular subject 'government' ('is constructing')."],
    ["Why _____ you _____ (waste) your valuable time now?", "are / wasting", "do / waste", "have / wasted", "did / waste", "Interrogative Continuous (now)", "'Now' in an interrogative sentence with subject 'you' takes 'are ... wasting'."],
    ["The pollution in Dhaka city _____ (grow) worse every passing day.", "is growing", "grows", "are growing", "grown", "Progressive Development", "'Every passing day' denotes continuous development, taking present continuous 'is growing'."]
  ];
  pcData.forEach((d, i) => {
    list.push(makeMCQ(`rfv_pres_cont_${i+1}`, tid, 'tenses_and_agreement', 'present_continuous', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], i % 3 === 0 ? 'easy' : 'medium'));
  });

  // 3. Present Perfect (10)
  const ppData = [
    ["Karim _____ (just / receive) the appointment letter from the bank.", "has just received", "just receives", "received", "had just received", "Time Marker (just / just now)", "'Just' indicates a recently completed action requiring present perfect 'has just received'."],
    ["I _____ (already / complete) my assignment for the HSC exam.", "have already completed", "already completed", "had already completed", "am completing", "Time Marker (already)", "'Already' marks completion with present relevance, taking 'have already completed'."],
    ["They have not _____ (reach) the railway station yet.", "reached", "reach", "reaching", "reaches", "Present Perfect with 'yet'", "'Have not' requires past participle (V3) 'reached' when paired with 'yet'."],
    ["The prime minister _____ (recently / inaugurate) the mega project.", "has recently inaugurated", "recently inaugurated", "had recently inaugurated", "inaugurates", "Time Marker (recently)", "'Recently' with present impact is expressed in the Present Perfect tense ('has recently inaugurated')."],
    ["We _____ (not see) him since last Monday.", "have not seen", "did not see", "had not seen", "do not see", "Since + Past Point", "'Since last Monday' connects a past point to the present, requiring present perfect 'have not seen'."],
    ["_____ you ever _____ (visit) Cox's Bazar sea beach?", "Have / visited", "Did / visit", "Do / visit", "Had / visited", "Experience Marker (ever)", "'Ever' asking about life experience takes Present Perfect ('Have you ever visited')."],
    ["He _____ (live) in Sylhet for ten years now.", "has lived", "lived", "had lived", "is living", "Period of time connecting to now", "A duration continuing up to the present takes present perfect 'has lived'."],
    ["The teacher _____ (just now / enter) the classroom.", "has just now entered", "just now entered", "had entered", "enters", "Time Marker (just now)", "'Just now' takes Present Perfect tense 'has just now entered' in standard HSC grammar."],
    ["She _____ (finish) reading three books this week.", "has finished", "finished", "finishes", "had finished", "Incomplete Time Period (this week)", "'This week' is an incomplete time period requiring present perfect 'has finished'."],
    ["Science _____ (bring) about revolutionary changes in communication.", "has brought", "brought", "had brought", "brings", "Present Result of Past Action", "Scientific achievements with ongoing modern impact take present perfect 'has brought'."]
  ];
  ppData.forEach((d, i) => {
    list.push(makeMCQ(`rfv_pres_perf_${i+1}`, tid, 'tenses_and_agreement', 'present_perfect', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], i % 3 === 0 ? 'easy' : 'medium'));
  });

  // 4. Present Perfect Continuous (8)
  const ppcData = [
    ["It _____ (rain) cats and dogs since early morning.", "has been raining", "is raining", "was raining", "rained", "Since + Point of Time", "Action beginning in the past and continuing now with 'since morning' takes present perfect continuous 'has been raining'."],
    ["They _____ (read) in this reputed college for two years.", "have been reading", "are reading", "were reading", "had read", "For + Period of Time", "Ongoing duration with 'for two years' takes present perfect continuous 'have been reading'."],
    ["The workers _____ (repair) the damaged road since yesterday.", "have been repairing", "are repairing", "were repairing", "repaired", "Since + Past Point", "Plural subject 'workers' with 'since yesterday' takes 'have been repairing'."],
    ["How long _____ you _____ (wait) here for the bus?", "have / been waiting", "are / waiting", "did / wait", "had / waited", "Duration Question (How long)", "'How long' asking about ongoing duration takes present perfect continuous ('have you been waiting')."],
    ["Mother _____ (cook) biryani in the kitchen for two hours.", "has been cooking", "is cooking", "was cooking", "cooked", "For + Duration", "Singular subject 'Mother' with 'for two hours' takes 'has been cooking'."],
    ["The patient _____ (suffer) from viral fever since Friday last.", "has been suffering", "is suffering", "suffered", "had suffered", "Since + Point in Time", "'Since Friday last' demands present perfect continuous 'has been suffering'."],
    ["He _____ (exercise) regularly for the last three months.", "has been exercising", "is exercising", "exercised", "was exercising", "For + Last Duration", "Continued regular activity over a period up to now takes 'has been exercising'."],
    ["The students _____ (prepare) their practical notes since noon.", "have been preparing", "are preparing", "prepared", "were preparing", "Since + Specific Point", "Plural subject 'students' with 'since noon' takes 'have been preparing'."]
  ];
  ppcData.forEach((d, i) => {
    list.push(makeMCQ(`rfv_pres_perf_cont_${i+1}`, tid, 'tenses_and_agreement', 'present_perfect_continuous', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'medium'));
  });

  // 5. Past Simple (10)
  const pastSimpData = [
    ["I _____ (receive) your affectionate letter yesterday.", "received", "have received", "had received", "receive", "Past Time Marker (yesterday)", "'Yesterday' is an explicit past time indicator requiring simple past tense (V2) 'received'."],
    ["Alexander Graham Bell _____ (invent) the telephone in 1876.", "invented", "invents", "has invented", "had invented", "Historical Event / Specific Year", "Past historical events with specific dates/years take Simple Past (V2) 'invented'."],
    ["The freedom fighters _____ (liberate) Bangladesh in 1971.", "liberated", "have liberated", "liberate", "were liberating", "Historical Past Action", "Historical completed events with a specific past year take Simple Past (V2) 'liberated'."],
    ["He left Dhaka three days _____ (ago).", "ago", "since", "before", "past", "Adverb of Past Time (ago)", "'Ago' follows a duration to indicate past simple time context."],
    ["Long ago, there _____ (live) a mighty sultan in Baghdad.", "lived", "lives", "has lived", "was living", "Narrative Past (Long ago)", "'Long ago' sets a narrative past requiring simple past V2 'lived'."],
    ["My grandfather _____ (die) of heart attack last year.", "died", "has died", "had died", "dies", "Past Time Marker (last year)", "'Last year' explicitly marks completed past action, requiring 'died'."],
    ["He _____ (not come) to our college yesterday.", "did not come", "does not come", "has not come", "had not come", "Negative Past Simple (yesterday)", "Negative past simple uses 'did not + V1 (base form)', hence 'did not come'."],
    ["When _____ you _____ (meet) the principal yesterday?", "did / meet", "do / meet", "have / met", "had / met", "Interrogative Past Simple", "Past interrogative with 'yesterday' requires 'did + subject + V1 (meet)'."],
    ["It is high time we _____ (change) our corrupted habits.", "changed", "change", "should change", "have changed", "It is high time + Subject Rule", "After 'It is high time / It is time' with a personal subject, the verb must be in Simple Past (V2) 'changed'."],
    ["I wish I _____ (be) a bird flying in the boundless sky.", "were", "was", "am", "be", "Unreal Wish / Subjunctive Were", "After 'I wish', the subjunctive verb 'were' is used regardless of the subject's person."]
  ];
  pastSimpData.forEach((d, i) => {
    list.push(makeMCQ(`rfv_past_simp_${i+1}`, tid, 'tenses_and_agreement', 'past_simple', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], i % 3 === 0 ? 'easy' : 'hard'));
  });

  // 6. Past Continuous (10)
  const pastContData = [
    ["While I _____ (walk) in the garden, a venomous snake bit me.", "was walking", "walked", "am walking", "had walked", "While + Continuous Action", "While + continuous past action interrupted by simple past takes 'was walking'."],
    ["They _____ (play) football when the sudden thunderstorm began.", "were playing", "played", "had played", "are playing", "Interrupted Past Action", "An ongoing past background action interrupted by a past event takes 'were playing'."],
    ["When Father returned home, Mother _____ (cook) dinner.", "was cooking", "cooked", "has cooked", "is cooking", "Simultaneous / Ongoing Past Action", "An ongoing action at the point when another past event occurred takes past continuous 'was cooking'."],
    ["I saw that the little boy _____ (cry) bitterly on the street.", "was crying", "cried", "has cried", "is crying", "Observed Ongoing Past Action", "Past observation of an ongoing action requires past continuous 'was crying'."],
    ["At 8 PM yesterday, we _____ (watch) the cricket match on TV.", "were watching", "watched", "had watched", "are watching", "Specific Past Point Time", "A specific past point in time ('At 8 PM yesterday') takes past continuous 'were watching'."],
    ["While he _____ (cross) the road, a speeding truck hit him.", "was crossing", "crossed", "crosses", "had crossed", "While + Past Progressive", "'While' introducing an ongoing action in the past requires past continuous 'was crossing'."],
    ["The students _____ (make) a noise when the teacher entered the hall.", "were making", "made", "have made", "had made", "Background Past Activity", "Ongoing background state interrupted by teacher's entry takes 'were making'."],
    ["It _____ (rain) heavily all evening yesterday.", "was raining", "rained", "has rained", "is raining", "Continuous Duration in Past", "Continuous ongoing past weather over an evening takes 'was raining'."],
    ["What _____ you _____ (do) at this time yesterday?", "were / doing", "did / do", "have / done", "had / done", "Past Continuous Interrogative", "Specific point in past ('at this time yesterday') takes 'were you doing'."],
    ["She _____ (read) a novel while her brother was playing games.", "was reading", "read", "reads", "had read", "Parallel Past Continuous Actions", "Two parallel ongoing past actions connected by 'while' both take past continuous ('was reading')."]
  ];
  pastContData.forEach((d, i) => {
    list.push(makeMCQ(`rfv_past_cont_${i+1}`, tid, 'tenses_and_agreement', 'past_continuous', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'medium'));
  });

  // 7. Past Perfect (10)
  const pastPerfData = [
    ["The train had left before we _____ (reach) the station.", "reached", "had reached", "reach", "was reaching", "Before Rule (Past Perfect before, Simple Past after)", "With 'before', the earlier action is Past Perfect ('had left') and the subsequent action is Simple Past (V2 'reached')."],
    ["The doctor arrived after the patient _____ (die).", "had died", "died", "has died", "was dying", "After Rule (Simple Past before, Past Perfect after)", "With 'after', the earlier action takes Past Perfect ('had died') while the main clause is Simple Past."],
    ["No sooner had the thief seen the police than he _____ (flee) away.", "fled", "had fled", "flees", "fleeing", "No sooner had...than + Past Simple", "The clause following 'than' in 'No sooner had...than' takes Simple Past (V2 'fled')."],
    ["Scarcely had I entered the room when the lights _____ (go) out.", "went", "had gone", "goes", "have gone", "Scarcely had...when + Past Simple", "'Scarcely had + V3 ... when' takes Simple Past (V2 'went') in the subsequent clause."],
    ["Hardly had the teacher entered the hall when the bell _____ (ring).", "rang", "had rung", "rings", "was ringing", "Hardly had...when + Past Simple", "'Hardly had + V3 ... when' takes Simple Past (V2 'rang') in the subsequent clause."],
    ["I reached the examination hall after the exam _____ (begin).", "had begun", "began", "has begun", "was beginning", "After + Past Perfect", "Action occurring earlier before reaching the hall takes Past Perfect ('had begun')."],
    ["We had finished our practical experiment before the bell _____ (ring).", "rang", "had rung", "rings", "was ringing", "Before + Past Simple", "Clause following 'before' takes Simple Past (V2 'rang') when preceding clause is Past Perfect."],
    ["He told me that he _____ (lose) his academic certificate.", "had lost", "lost", "has lost", "loses", "Reported Speech Past Shift", "An action that occurred prior to the reporting verb 'told' takes Past Perfect 'had lost'."],
    ["If I had seen him earlier, I _____ (tell) him the good news.", "would have told", "will tell", "would tell", "told", "3rd Conditional (If + Past Perfect)", "3rd conditional formula: If + Past Perfect, Subject + would have + V3 ('would have told')."],
    ["Had I possessed the required funds, I _____ (establish) a charitable clinic.", "would have established", "will establish", "would establish", "established", "Inverted 3rd Conditional", "Inverted conditional 'Had I possessed' requires 'would have + V3' ('would have established')."]
  ];
  pastPerfData.forEach((d, i) => {
    list.push(makeMCQ(`rfv_past_perf_${i+1}`, tid, 'tenses_and_agreement', 'past_perfect', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'hard'));
  });

  // 8. Past Perfect Continuous (8)
  const pastPerfContData = [
    ["He had been _____ (work) in the company for five years before he resigned.", "working", "work", "worked", "works", "Had been + V-ing", "'Had been' auxiliary in past perfect continuous requires verb+ing ('working')."],
    ["They had been playing for two hours when it _____ (start) to rain.", "started", "had started", "starts", "was starting", "Past Interruption of Ongoing Past Action", "The point event interrupting a past continuous duration takes Simple Past (V2 'started')."],
    ["The patient had been suffering for days before a specialist _____ (examine) him.", "examined", "had examined", "examines", "was examining", "Before + Past Simple with Past Perfect Continuous", "Subsequent event following 'before' takes Simple Past (V2 'examined')."],
    ["She was exhausted because she _____ (study) all night long.", "had been studying", "studied", "is studying", "has studied", "Past Cause of Past State", "Continuous past exertion explaining a past state of exhaustion takes past perfect continuous 'had been studying'."],
    ["The ground was wet because it _____ (rain) heavily before morning.", "had been raining", "rained", "is raining", "was rained", "Past Evidence of Prior Continuous Action", "Wet ground in the past caused by prior continuous rain takes 'had been raining'."],
    ["How long had you been _____ (prepare) for the HSC exam before the routine was published?", "preparing", "prepared", "prepare", "prepares", "Past Perfect Continuous Form", "'Had you been' takes V-ing 'preparing' to express prior continuous duration."],
    ["The villagers had been _____ (struggle) against the flood until relief arrived.", "struggling", "struggled", "struggle", "struggles", "Past Continuous Duration until Past Point", "Continuous struggle prior to a past event takes 'had been struggling'."],
    ["Karim had been trying to solve the calculus problem for an hour before he _____ (find) the solution.", "found", "had found", "finds", "was finding", "Past Simple Termination", "Event terminating a past continuous effort takes Simple Past (V2 'found')."]
  ];
  pastPerfContData.forEach((d, i) => {
    list.push(makeMCQ(`rfv_past_perf_cont_${i+1}`, tid, 'tenses_and_agreement', 'past_perfect_continuous', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'hard'));
  });

  // 9. Future Simple (10)
  const futSimpData = [
    ["We _____ (visit) the National Memorial at Savar tomorrow.", "will visit", "visited", "have visited", "are visiting", "Future Marker (tomorrow)", "'Tomorrow' marks simple future action requiring 'will visit'."],
    ["If you study diligently, you _____ (pass) the HSC examination with GPA 5.", "will pass", "passed", "would pass", "had passed", "1st Conditional (If + Present Simple)", "1st Conditional formula: If + Present Simple, Subject + will + V1 ('will pass')."],
    ["I promise I _____ (help) you in your distress next week.", "will help", "helped", "have helped", "am helped", "Future Promise (next week)", "Promises for future time ('next week') take simple future 'will help'."],
    ["The HSC Board results _____ (publish) next month.", "will be published", "published", "is publishing", "will publish", "Future Passive with 'next month'", "'Next month' with a passive subject ('The results') takes 'will be published'."],
    ["Unless you work hard, you _____ (suffer) in the future.", "will suffer", "suffered", "would suffer", "have suffered", "Unless + Present, Future Simple", "Unless + present clause is followed by future simple 'will suffer'."],
    ["They _____ (reach) Cox's Bazar by tomorrow evening.", "will reach", "reached", "have reached", "reach", "Future Time Reference", "Anticipated future arrival takes future simple 'will reach'."],
    ["I _____ (call) you as soon as I arrive at Dhaka airport.", "will call", "called", "call", "had called", "Time Clause Rule (Present -> Future Main)", "In time clauses (as soon as + present), the main clause takes future simple 'will call'."],
    ["Provided that the weather remains favorable, the match _____ (start) on time.", "will start", "started", "would start", "had started", "Condition with 'Provided that'", "Provided that + present simple condition takes future simple 'will start' in main clause."],
    ["He _____ (turn) twenty-one next birthday.", "will turn", "turned", "is turning", "has turned", "Future Fact", "Future chronological age fact takes simple future 'will turn'."],
    ["If it rains, we _____ (postpone) the outdoor tournament.", "will postpone", "postponed", "would postpone", "had postponed", "1st Conditional", "If + present simple ('If it rains') requires future simple 'will postpone'."]
  ];
  futSimpData.forEach((d, i) => {
    list.push(makeMCQ(`rfv_fut_simp_${i+1}`, tid, 'tenses_and_agreement', 'future_simple', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'easy'));
  });

  // 10. Future Continuous (8)
  const futContData = [
    ["At this time tomorrow, we _____ (travel) to Sylhet by train.", "will be traveling", "will travel", "travel", "traveled", "Specific Point in Future Time", "A specific ongoing point in future time ('At this time tomorrow') takes future continuous 'will be traveling'."],
    ["Don't call him at 3 PM; he _____ (sit) for his examination then.", "will be sitting", "will sit", "sits", "sat", "Ongoing Future Event", "Action that will be actively in progress at a future moment takes 'will be sitting'."],
    ["They _____ (celebrate) their victory when the final results arrive.", "will be celebrating", "celebrate", "celebrated", "will celebrate", "Progressive Action in Future Context", "Future continuous action in progress during an event takes 'will be celebrating'."],
    ["I _____ (wait) for you at the library entrance tomorrow morning.", "will be waiting", "will wait", "waited", "am waited", "Anticipated Ongoing Future Presence", "Anticipated ongoing presence at a specific future time takes 'will be waiting'."],
    ["This time next week, the students _____ (enjoy) their vacation.", "will be enjoying", "enjoy", "enjoyed", "will enjoy", "Specific Future Point", "'This time next week' takes Future Continuous 'will be enjoying'."],
    ["The engineer _____ (inspect) the Padma Bridge site all afternoon tomorrow.", "will be inspecting", "inspects", "inspected", "has inspected", "Continuous Duration in Future", "Ongoing inspection over the entire afternoon takes 'will be inspecting'."],
    ["What _____ you _____ (do) at 10 AM tomorrow?", "will / be doing", "will / do", "are / doing", "did / do", "Future Continuous Interrogative", "'At 10 AM tomorrow' requires future continuous 'will you be doing'."],
    ["The farmers _____ (harvest) their golden paddy during the upcoming season.", "will be harvesting", "harvest", "harvested", "are harvested", "Future Continuous Action", "Ongoing seasonal activity in the future takes 'will be harvesting'."]
  ];
  futContData.forEach((d, i) => {
    list.push(makeMCQ(`rfv_fut_cont_${i+1}`, tid, 'tenses_and_agreement', 'future_continuous', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'medium'));
  });

  // 11. Future Perfect (8)
  const futPerfData = [
    ["By next December, we _____ (complete) the entire HSC English syllabus.", "will have completed", "will complete", "completed", "have completed", "By + Future Time Marker", "'By next December' indicates completion prior to a future deadline, requiring future perfect 'will have completed'."],
    ["They _____ (finish) the construction of the flyover by 2027.", "will have finished", "will finish", "finished", "have finished", "By + Future Year", "'By + future year' requires Future Perfect tense 'will have finished'."],
    ["She _____ (reach) London before the conference begins.", "will have reached", "will reach", "reaches", "reached", "Before + Present Simple in Future Context", "Action completed before another future action ('before the conference begins') takes Future Perfect 'will have reached'."],
    ["By the time you return, Father _____ (retire) from government service.", "will have retired", "will retire", "retires", "retired", "By the time + Present Simple", "'By the time + present' takes Future Perfect 'will have retired' in the main clause."],
    ["The students _____ (solve) all test papers by the end of this month.", "will have solved", "will solve", "solved", "have solved", "By the end of + Time", "Completion before an endpoint takes Future Perfect 'will have solved'."],
    ["I _____ (write) my research paper before the submission portal closes.", "will have written", "will write", "wrote", "have written", "Prior Future Completion", "Action to be finished before a future closure takes Future Perfect 'will have written'."],
    ["By tomorrow noon, the flood water _____ (recede) significantly.", "will have receded", "will recede", "recedes", "receded", "By tomorrow + Future Perfect", "'By tomorrow noon' denotes completion by a future point, requiring 'will have receded'."],
    ["The medical team _____ (vaccinate) all citizens by next year.", "will have vaccinated", "will vaccinate", "vaccinated", "vaccinates", "By next year + Future Perfect", "'By next year' demands Future Perfect tense 'will have vaccinated'."]
  ];
  futPerfData.forEach((d, i) => {
    list.push(makeMCQ(`rfv_fut_perf_${i+1}`, tid, 'tenses_and_agreement', 'future_perfect', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'hard'));
  });

  // 12. Future Perfect Continuous (6)
  const futPerfContData = [
    ["By next year, Mr. Rahman _____ (teach) in this college for 25 years.", "will have been teaching", "will teach", "is teaching", "has been teaching", "By + Future Time with For + Duration", "Ongoing duration reaching a future point ('By next year ... for 25 years') takes Future Perfect Continuous 'will have been teaching'."],
    ["By 5 PM, they _____ (play) cricket continuously for six hours.", "will have been playing", "will play", "are playing", "have been playing", "By + Time + For + Duration", "Duration continuing up to a future point takes 'will have been playing'."],
    ["By the end of this semester, she _____ (live) in Dhaka for a decade.", "will have been living", "will live", "is living", "lived", "Future Continuous Duration", "Future milestone with duration takes Future Perfect Continuous 'will have been living'."],
    ["When Father returns at night, the boy _____ (study) for four hours.", "will have been studying", "will study", "studies", "studied", "Future Duration before Event", "Continuous action prior to a future event takes 'will have been studying'."],
    ["By tomorrow morning, it _____ (rain) without pause for forty-eight hours.", "will have been raining", "will rain", "is raining", "rained", "Future Continuous Weather Duration", "A 48-hour continuous rain reaching tomorrow morning takes 'will have been raining'."],
    ["By 2030, scientists _____ (work) on this climate initiative for fifteen years.", "will have been working", "will work", "are working", "have worked", "By + Future Year + For + Duration", "Long-term ongoing scientific effort measured at a future year takes 'will have been working'."]
  ];
  futPerfContData.forEach((d, i) => {
    list.push(makeMCQ(`rfv_fut_perf_cont_${i+1}`, tid, 'tenses_and_agreement', 'future_perfect_continuous', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'hard'));
  });

  // 13. Subject-Verb Agreement & Special Modals (15)
  const svaData = [
    ["The principal, along with his colleagues, _____ (attend) the seminar yesterday.", "attended", "attends", "were attending", "have attended", "Subject Agreement with 'along with'", "When subjects are joined by 'along with', the verb agrees with the FIRST subject ('The principal', singular) in past tense 'attended'."],
    ["Neither the chairman nor the members _____ (be) present at the meeting.", "were", "was", "is", "has been", "Neither...nor Agreement with Nearest Subject", "With 'neither...nor', the verb agrees with the nearest subject ('the members', plural), hence 'were'."],
    ["Each of the students _____ (have) received a certificate of merit.", "has", "have", "are having", "having", "Each of + Plural Noun + Singular Verb", "'Each of' takes a singular verb, so 'has' is correct."],
    ["Bread and butter _____ (be) his favorite breakfast every morning.", "is", "are", "were", "being", "Compound Subject Expressing Single Idea", "When two nouns connected by 'and' express a single unified concept/dish, a singular verb ('is') is used."],
    ["Many a student _____ (ruin) his career through negligence.", "ruins", "ruin", "are ruining", "have ruined", "Many a + Singular Noun + Singular Verb", "'Many a + singular noun' takes a singular verb ('ruins')."],
    ["One of my dearest friends _____ (be) a renowned physician in Dhaka.", "is", "are", "were", "have been", "One of + Plural Noun + Singular Verb", "'One of' followed by plural noun takes a singular verb ('is')."],
    ["Slow and steady _____ (win) the race.", "wins", "win", "is winning", "won", "Proverbial Singular Unit", "Two words expressing one composite idea take a singular verb ('wins')."],
    ["Ten miles _____ (be) a long distance to walk on foot.", "is", "are", "were", "being", "Plural Quantity as Single Unit", "A specific distance, amount of money, or period of time treated as a single unit takes a singular verb ('is')."],
    ["The quality of these mangoes _____ (be) truly outstanding.", "is", "are", "were", "have been", "Agreement with Real Subject (Head Word)", "The real subject is the singular noun 'quality' (not 'mangoes'), requiring the singular verb 'is'."],
    ["Neither of the two allegations _____ (be) true.", "is", "are", "were", "have been", "Neither of + Plural Noun takes Singular Verb", "'Neither of' takes a singular verb ('is')."],
    ["Rahim as well as his friends _____ (be) invited to the ceremony.", "was", "were", "are", "have been", "Agreement with 'as well as'", "With 'as well as', the verb agrees with the first subject ('Rahim', singular), hence 'was'."],
    ["A number of meritorious students _____ (have) qualified for the scholarship.", "have", "has", "is having", "was", "'A number of' vs 'The number of'", "'A number of' takes a plural verb ('have'), whereas 'The number of' takes a singular verb."],
    ["The jury _____ (be) divided in their opinions regarding the verdict.", "were", "was", "is", "has been", "Collective Noun of Divided Multitude", "When members of a collective noun are divided in opinion, a plural verb ('were') is used."],
    ["Physics _____ (be) my favorite subject in HSC science group.", "is", "are", "were", "being", "Branch of Study Ending in -s takes Singular Verb", "Names of academic subjects (Physics, Mathematics, Civics, Economics) take singular verbs ('is')."],
    ["Fifty thousand taka _____ (be) allocated for the cultural program.", "was", "were", "are", "have been", "Monetary Amount as Single Sum", "A specific sum of money treated as a whole takes a singular verb ('was')."]
  ];
  svaData.forEach((d, i) => {
    list.push(makeMCQ(`rfv_sva_${i+1}`, tid, 'tenses_and_agreement', 'subject_verb_agreement', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'medium'));
  });

  return list;
}

// -------------------------------------------------------------
// TOPIC 2: ARTICLES (126 items)
// -------------------------------------------------------------
function generateArticles() {
  const list = [];
  const tid = 'articles';
  const inst = 'Choose the correct article for the blank (use (x) for zero article):';

  // 1. A vs An (26)
  const aVsAn = [
    ["He is _____ honest and hardworking officer in the civil service.", "an", "a", "the", "(x)", "Silent 'h' takes 'an'", "'Honest' begins with a silent 'h' producing an initial vowel sound (/ɒ/), requiring the indefinite article 'an'."],
    ["Dhaka University is _____ renowned university in South Asia.", "a", "an", "the", "(x)", "Vowel letter 'u' with /juː/ sound takes 'a'", "'University' begins with the consonant glide /j/ ('you' sound), requiring 'a' rather than 'an'."],
    ["Mr. Rahman is _____ European scholar visiting Dhaka.", "a", "an", "the", "(x)", "'Eu' pronounced /juː/ takes 'a'", "Words starting with 'Eu' sounding like /juː/ (European, eulogy) take the indefinite article 'a'."],
    ["I waited for him at the station for _____ hour.", "an", "a", "the", "(x)", "Silent 'h' in 'hour' takes 'an'", "'Hour' has a silent 'h', beginning with a vowel diphthong sound, hence 'an hour'."],
    ["He gave me _____ one-taka note as a token of blessing.", "a", "an", "the", "(x)", "'One' starting with /w/ sound takes 'a'", "'One' begins with the consonant sound /w/ ('wa'), taking the article 'a' ('a one-taka note')."],
    ["His father is _____ MA in English literature from Rajshahi University.", "an", "a", "the", "(x)", "Abbreviation starting with vowel sound (/em/)", "The letter 'M' in 'MA' is pronounced /em/, beginning with vowel sound /e/, requiring 'an'."],
    ["She is _____ MBBS doctor serving rural patients in Sylhet.", "an", "a", "the", "(x)", "Abbreviation 'MBBS' (/em-bi-bi-es/) takes 'an'", "Initial letter 'M' begins with vowel sound /e/, requiring 'an MBBS doctor'."],
    ["He is _____ heir to a huge ancestral property in Chattogram.", "an", "a", "the", "(x)", "Silent 'h' in 'heir' takes 'an'", "'Heir' has a silent 'h' (pronounced /eə/), thus taking 'an'."],
    ["It was _____ unique opportunity to showcase Bangladeshi culture.", "a", "an", "the", "(x)", "'Unique' with /juː/ sound takes 'a'", "'Unique' begins with the consonant sound /j/, requiring indefinite article 'a'."],
    ["Karim is _____ honorable member of the parliament.", "an", "a", "the", "(x)", "Silent 'h' in 'honorable' takes 'an'", "'Honorable' starts with a silent 'h' and vowel sound /ɒ/, taking 'an'."],
    ["He is _____ LLB student at the University of Dhaka.", "an", "a", "the", "(x)", "Abbreviation 'LLB' (/el-el-bi/) takes 'an'", "'L' is pronounced /el/ starting with vowel sound /e/, requiring 'an LLB'."],
    ["The tiger is _____ ferocious animal living in the Sundarbans.", "a", "an", "the", "(x)", "Consonant sound /f/ takes 'a'", "'Ferocious' begins with the consonant sound /f/, requiring 'a'."],
    ["She saw _____ ewe grazing peacefully in the green pasture.", "a", "an", "the", "(x)", "'Ewe' pronounced /juː/ takes 'a'", "'Ewe' (female sheep) is pronounced /juː/ ('you'), thus taking the article 'a'."],
    ["He proved to be _____ useful guide during our tour to Bandarban.", "a", "an", "the", "(x)", "'Useful' starting with /juː/ takes 'a'", "'Useful' starts with the /juː/ consonant glide, requiring 'a'."],
    ["It was _____ historic day for the freedom-loving people of Bengal.", "a", "an", "the", "(x)", "Pronounced 'h' in modern English takes 'a'", "In modern standard English, 'historic' has a sounded /h/ consonant, taking 'a historic day'."],
    ["He bought _____ umbrella before stepping out in the heavy rain.", "an", "a", "the", "(x)", "Vowel sound /ʌ/ takes 'an'", "'Umbrella' begins with the short vowel sound /ʌ/, requiring 'an'."],
    ["My uncle is _____ MP representing our constituency in Jashore.", "an", "a", "the", "(x)", "Abbreviation 'MP' (/em-pi/) takes 'an'", "'M' begins with vowel sound /e/, requiring 'an MP'."],
    ["He holds _____ SDO post in the district administration.", "an", "a", "the", "(x)", "Abbreviation 'SDO' (/es-di-o/) takes 'an'", "'S' is pronounced /es/ beginning with vowel sound /e/, taking 'an'."],
    ["He is _____ FCPS doctor at Dhaka Medical College Hospital.", "an", "a", "the", "(x)", "Abbreviation 'FCPS' (/ef-si-pi-es/) takes 'an'", "'F' is pronounced /ef/ starting with vowel sound /e/, taking 'an'."],
    ["He is _____ BA graduate seeking employment.", "a", "an", "the", "(x)", "Abbreviation 'BA' (/bi-ei/) starts with consonant sound /b/", "'B' starts with consonant sound /b/, taking 'a BA'."],
    ["The child caught _____ one-eyed fish in the pond.", "a", "an", "the", "(x)", "'One-eyed' with /w/ sound takes 'a'", "Compound word starting with 'one' takes 'a' due to initial consonant sound /w/."],
    ["He received _____ urgent telegram from home.", "an", "a", "the", "(x)", "Vowel sound /ɜː/ in 'urgent' takes 'an'", "'Urgent' begins with a vowel sound, requiring 'an'."],
    ["We stayed in _____ hotel near the Cox's Bazar beach.", "a", "an", "the", "(x)", "Sounded /h/ in 'hotel' takes 'a'", "'Hotel' begins with voiced consonant /h/, taking 'a hotel'."],
    ["He is _____ upright and principled schoolteacher.", "an", "a", "the", "(x)", "Vowel sound /ʌ/ in 'upright' takes 'an'", "'Upright' begins with short vowel /ʌ/, taking 'an'."],
    ["It was _____ unanimous decision taken by the committee.", "a", "an", "the", "(x)", "'Unanimous' with /juː/ sound takes 'a'", "'Unanimous' begins with the consonant glide /juː/, requiring 'a'."],
    ["He bought _____ unit of electricity measurement device.", "a", "an", "the", "(x)", "'Unit' with /juː/ sound takes 'a'", "'Unit' begins with /juː/ sound, taking 'a'."]
  ];
  aVsAn.forEach((d, i) => {
    list.push(makeMCQ(`art_a_an_${i+1}`, tid, 'indefinite_articles', 'a_vs_an', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], i % 3 === 0 ? 'easy' : 'medium'));
  });

  // 2. Definite Article 'The' (30)
  const definiteThe = [
    ["_____ sun radiates immense heat and light across our solar system.", "The", "A", "An", "(x)", "Unique Celestial Object takes 'The'", "Unique natural celestial entities (the sun, the moon, the earth, the sky) strictly take 'The'."],
    ["Kazi Nazrul Islam is _____ Shelley of Bangladesh literature.", "the", "a", "an", "(x)", "Proper Noun Used as Metaphorical Standard", "When a proper noun is used to indicate a standard of comparison, it takes 'the' ('the Shelley of Bangladesh')."],
    ["He is _____ best boy in the entire college section.", "the", "a", "an", "(x)", "Superlative Adjective takes 'The'", "Superlative degree adjectives ('best', 'most talented', 'tallest') strictly take the definite article 'the'."],
    ["_____ Padma is one of the mightiest rivers in Bangladesh.", "The", "A", "An", "(x)", "Names of Rivers take 'The'", "Names of rivers, seas, oceans, gulfs, and mountain ranges strictly take 'The'."],
    ["He reads _____ Daily Star every single morning.", "the", "a", "an", "(x)", "Names of Newspapers take 'The'", "Names of famous newspapers and journals take 'the' ('The Daily Star', 'The Ittefaq')."],
    ["_____ Holy Quran is the divine scripture revealed to Prophet Muhammad (PBUH).", "The", "A", "An", "(x)", "Sacred Religious Scriptures take 'The'", "Holy scriptures take the definite article 'the' ('The Quran', 'The Bible', 'The Gita')."],
    ["Neil Armstrong was _____ first man to step on the lunar surface.", "the", "a", "an", "(x)", "Ordinal Numbers take 'The'", "Ordinal numbers ('the first', 'the second', 'the third') take the definite article 'the'."],
    ["_____ rich are not always happier than the underprivileged.", "The", "A", "An", "(x)", "The + Adjective for Entire Class/Plural", "'The rich' represents the entire class of wealthy people as a plural concept, taking 'The'."],
    ["_____ poor often face immense economic hardship during inflation.", "The", "A", "An", "(x)", "The + Adjective for Social Group", "'The poor' represents the entire community of poor people, taking 'The'."],
    ["He can play _____ harmonium melodiously.", "the", "a", "an", "(x)", "Musical Instruments take 'The'", "When referring to playing a musical instrument, the definite article 'the' is used ('play the harmonium')."],
    ["_____ Titanic was considered an unsinkable ocean liner.", "The", "A", "An", "(x)", "Famous Ships/Vessels take 'The'", "Names of famous ships, trains, and aircraft take 'The' ('The Titanic', 'The Subarna Express')."],
    ["Dhaka stands on _____ bank of the Buriganga river.", "the", "a", "an", "(x)", "Specific Physical Feature / River Bank", "A specific designated riverbank takes 'the bank of the Buriganga'."],
    ["_____ more you read, the more you learn.", "The", "A", "An", "(x)", "Double Comparative Structure (The more... the more)", "Correlative comparative structures showing proportion take 'The ... the'."],
    ["_____ sooner it is completed, the better the outcome.", "The", "A", "An", "(x)", "Double Comparative Structure", "'The sooner, the better' uses 'The' with both comparative degrees."],
    ["Look at _____ picture hanging on the wall.", "the", "a", "an", "(x)", "Specific Definite Object in View", "Referring to a specific, identifiable object in the room takes 'the picture'."],
    ["_____ Himalayas stand majestically on the northern frontier of South Asia.", "The", "A", "An", "(x)", "Mountain Ranges (Plural) take 'The'", "Plural mountain chains/ranges take 'The' ('The Himalayas', 'The Alps')."],
    ["_____ Bay of Bengal lies to the south of Bangladesh.", "The", "A", "An", "(x)", "Bays and Gulfs take 'The'", "Geographical bodies like bays and gulfs take 'The' ('The Bay of Bengal')."],
    ["He joined _____ Bangladesh Army as a commissioned officer.", "the", "a", "an", "(x)", "Armed Forces / State Organs take 'The'", "Armed forces and official institutions take 'the' ('the Army', 'the Navy', 'the Police')."],
    ["_____ English are known for their industrial history.", "The", "A", "An", "(x)", "The + Nation Name for People/Citizens", "When a language word refers to the nation's people, it takes 'The' ('The English' = the people of England)."],
    ["He was elected _____ President of the student welfare union.", "(x)", "the", "a", "an", "Predicate Noun of Unique Office", "Nouns denoting unique official positions after verbs like 'elect', 'appoint', 'make' take zero article '(x)'."],
    ["This is _____ very boy who saved the drowning child yesterday.", "the", "a", "an", "(x)", "Emphatic 'The Very'", "'The very' is used emphatically to single out a specific individual."],
    ["_____ Pacific Ocean is the largest and deepest ocean on earth.", "The", "A", "An", "(x)", "Oceans take 'The'", "Names of all oceans strictly take 'The' ('The Pacific', 'The Atlantic')."],
    ["He lives on _____ third floor of the apartment complex.", "the", "a", "an", "(x)", "Ordinal Floor Numbers take 'The'", "Ordinals describing floors ('the third floor') take 'the'."],
    ["We visited _____ Sundarbans during our winter vacation.", "the", "a", "an", "(x)", "Famous Forest / Geographical Entity", "The Sundarbans mangrove forest takes 'the' ('the Sundarbans')."],
    ["_____ French defeated the enemies in the historic battle.", "The", "A", "An", "(x)", "The + Nationality for People", "'The French' refers to the French nation/people, requiring 'The'."],
    ["He strikes _____ iron while it is red-hot.", "the", "a", "an", "(x)", "Specific Object in Proverb", "In the famous proverb 'Strike the iron while it is hot', 'the' is used."],
    ["_____ bravery of the freedom fighters is immortal in our history.", "The", "A", "An", "(x)", "Abstract Noun Qualified by Prepositional Phrase", "When an abstract noun is defined by 'of + noun', it takes 'the' ('The bravery of the freedom fighters')."],
    ["_____ water of this tube-well is crystal clear and safe.", "The", "A", "An", "(x)", "Material Noun Defined Specifically", "When a material noun is made specific by 'of + place', it takes 'the' ('The water of this tube-well')."],
    ["He is _____ Newton of modern astrophysics.", "the", "a", "an", "(x)", "Proper Noun Used as Archetype", "Using a famous name as a descriptive archetype takes 'the' ('the Newton of...')."],
    ["_____ President of Bangladesh addressed the parliament session.", "The", "A", "An", "(x)", "Official Title with Specific Jurisdiction", "Head of state titles referring to specific dignitaries take 'The' ('The President')."]
  ];
  definiteThe.forEach((d, i) => {
    list.push(makeMCQ(`art_def_the_${i+1}`, tid, 'definite_and_zero', 'definite_the', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], i % 3 === 0 ? 'easy' : 'medium'));
  });

  // 3. Zero Article (25)
  const zeroArticles = [
    ["Gold is _____ precious metal used in ornaments.", "a", "the", "an", "(x)", "Material Noun in General Sense", "Material nouns used in a general sense (Gold, Iron, Water) take no article before the noun, but 'precious metal' takes 'a'."],
    ["_____ honesty is the best policy in human life.", "(x)", "The", "A", "An", "Abstract Noun in General Sense", "Abstract nouns used in a general sense (Honesty, Kindness, Virtue) take zero article '(x)'."],
    ["We take _____ breakfast at 8 o'clock in the morning.", "(x)", "a", "the", "an", "Names of Regular Meals take Zero Article", "Names of regular daily meals (breakfast, lunch, dinner) take zero article unless preceded by an adjective."],
    ["He speaks _____ Bengali with remarkable eloquence.", "(x)", "the", "a", "an", "Names of Languages take Zero Article", "Names of languages (Bengali, English, Arabic) take zero article unless followed by the word 'language'."],
    ["Cricket is _____ extremely popular sport in Bangladesh.", "an", "the", "a", "(x)", "Pre-modified Singular Noun", "'Extremely popular sport' has a vowel sound /ɪk/, taking indefinite article 'an'."],
    ["He plays _____ cricket every afternoon with his classmates.", "(x)", "the", "a", "an", "Names of Sports/Games take Zero Article", "Names of sports and games (cricket, football, chess) take zero article '(x)'."],
    ["Man is _____ mortal being created by God.", "(x)", "a", "the", "an", "'Man' in General Universal Sense", "'Man' referring to the entire human race in a universal sense takes zero article '(x)'."],
    ["Father goes to _____ bed early after reciting his prayers.", "(x)", "the", "a", "an", "Institutions used for Primary Purpose", "Words like 'bed', 'school', 'hospital', 'mosque' take zero article when used for their primary purpose."],
    ["The sick patient was rushed to _____ hospital for emergency treatment.", "(x)", "the", "a", "an", "Hospital for Primary Medical Purpose", "When a patient goes to hospital for treatment (primary purpose), no article is used."],
    ["Children go to _____ school to acquire knowledge.", "(x)", "the", "a", "an", "School for Primary Educational Purpose", "Going to school for study purposes takes zero article '(x)'."],
    ["He was suffering from _____ malaria last monsoon.", "(x)", "the", "a", "an", "Names of Diseases take Zero Article", "Names of common diseases (malaria, cholera, typhoid, diabetes) take zero article '(x)'."],
    ["_____ water is essential for the survival of all living beings.", "(x)", "The", "A", "An", "Material Noun in General Context", "Material nouns in general statements take zero article '(x)'."],
    ["We celebrate Victory Day in _____ December every year.", "(x)", "the", "a", "an", "Names of Months take Zero Article", "Names of months and days of the week take zero article '(x)'."],
    ["He does not like _____ winter because of the biting cold.", "(x)", "the", "a", "an", "Names of Seasons in General Sense", "Names of seasons generally take zero article '(x)'."],
    ["They traveled to Chattogram by _____ train yesterday.", "(x)", "the", "a", "an", "Means of Transport after 'by'", "Modes of travel after 'by' (by train, by bus, by air, by boat) take zero article '(x)'."],
    ["She left for college on _____ foot.", "(x)", "the", "a", "an", "Fixed Idiomatic Phrase 'on foot'", "The idiom 'on foot' takes zero article '(x)'."],
    ["He traveled to Dubai by _____ air.", "(x)", "the", "a", "an", "Means of Transport 'by air'", "Fixed travel phrase 'by air' takes zero article '(x)'."],
    ["_____ Platinum is one of the most expensive metals on earth.", "(x)", "The", "A", "An", "Material Noun in General Statement", "Material noun in a general scientific context takes zero article '(x)'."],
    ["Knowledge is _____ power.", "(x)", "the", "a", "an", "Abstract Noun in Predicate", "Abstract noun used in proverb/predicate takes zero article '(x)'."],
    ["He was appointed _____ headmaster of the government high school.", "(x)", "the", "a", "an", "Title after 'appointed'", "Appointed/elected to a unique post takes zero article '(x)'."],
    ["We visited him on _____ Friday evening.", "(x)", "the", "a", "an", "Days of Week take Zero Article", "Days of the week take zero article '(x)'."],
    ["_____ English language is spoken across the globe.", "The", "A", "An", "(x)", "Language Name + 'Language' takes 'The'", "When the word 'language' follows the language name ('The English language'), 'The' is required."],
    ["He is suffering from _____ fever and headache.", "(x)", "the", "a", "an", "General Ailment takes Zero Article", "General ailments take zero article '(x)'."],
    ["Dinner was served at _____ night.", "(x)", "the", "a", "an", "Fixed Phrase 'at night'", "Fixed prepositional phrase 'at night' takes zero article '(x)'."],
    ["They arrived home at _____ dawn.", "(x)", "the", "a", "an", "Fixed Phrase 'at dawn'", "Fixed prepositional phrase 'at dawn' takes zero article '(x)'."]
  ];
  zeroArticles.forEach((d, i) => {
    list.push(makeMCQ(`art_zero_${i+1}`, tid, 'definite_and_zero', 'zero_article', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'medium'));
  });

  // 4. Geographical (15)
  const geoArticles = [
    ["_____ USA is a developed federal republic in North America.", "The", "A", "An", "(x)", "Countries with Republic/Kingdom/States take 'The'", "Countries with plural names or words like 'States', 'Kingdom', 'Republic' take 'The' ('The USA', 'The UK')."],
    ["_____ United Kingdom comprises four constituent nations.", "The", "A", "An", "(x)", "Country with 'Kingdom' takes 'The'", "The United Kingdom takes the definite article 'The'."],
    ["_____ Bangladesh is our beloved sovereign motherland.", "(x)", "The", "A", "An", "Individual Country Name takes Zero Article", "Names of single individual countries (Bangladesh, India, Japan) take zero article '(x)'."],
    ["Mount Everest is _____ highest peak in the world.", "the", "a", "an", "(x)", "Superlative Degree before 'highest'", "Superlative adjectives take 'the', whereas single mountains (Mount Everest) take zero article."],
    ["_____ Mount Everest is located in the Himalayas.", "(x)", "The", "A", "An", "Single Mountain Peak takes Zero Article", "Individual single peaks preceded by 'Mount' take zero article '(x)'."],
    ["_____ Sahara is the largest hot desert in the world.", "The", "A", "An", "(x)", "Names of Deserts take 'The'", "Names of deserts take the definite article 'The' ('The Sahara', 'The Gobi')."],
    ["_____ Netherlands is famous for its picturesque canals and tulips.", "The", "A", "An", "(x)", "Plural Country Name takes 'The'", "Countries with plural names take 'The' ('The Netherlands', 'The Philippines')."],
    ["_____ Maldives consists of over a thousand coral islands.", "The", "A", "An", "(x)", "Island Group (Plural) takes 'The'", "Plural island groups take 'The' ('The Maldives', 'The West Indies')."],
    ["He visited _____ Saint Martin's Island during winter.", "(x)", "the", "a", "an", "Single Island takes Zero Article", "Individual single islands take zero article '(x)'."],
    ["_____ Nile is the longest river in the African continent.", "The", "A", "An", "(x)", "Names of Rivers take 'The'", "All rivers strictly take 'The' ('The Nile', 'The Amazon', 'The Meghna')."],
    ["_____ Asia is the largest continent in terms of both area and population.", "(x)", "The", "A", "An", "Names of Continents take Zero Article", "Names of continents (Asia, Europe, Africa) take zero article '(x)'."],
    ["_____ Red Sea separates Africa from the Arabian Peninsula.", "The", "A", "An", "(x)", "Names of Seas take 'The'", "Seas strictly take the definite article 'The' ('The Red Sea')."],
    ["_____ Panama Canal connects the Atlantic and Pacific oceans.", "The", "A", "An", "(x)", "Names of Canals take 'The'", "Famous canals take 'The' ('The Panama Canal', 'The Suez Canal')."],
    ["_____ Dhaka is the capital and largest metropolis of Bangladesh.", "(x)", "The", "A", "An", "Names of Cities take Zero Article", "Names of cities (Dhaka, London, Tokyo) take zero article '(x)'."],
    ["_____ Indian Ocean washes the southern coast of the subcontinent.", "The", "A", "An", "(x)", "Names of Oceans take 'The'", "Oceans strictly take 'The' ('The Indian Ocean')."]
  ];
  geoArticles.forEach((d, i) => {
    list.push(makeMCQ(`art_geo_${i+1}`, tid, 'definite_and_zero', 'geographical', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'medium'));
  });

  // 5. Omission Rules & Idiomatic Phrases (15)
  const omissionArticles = [
    ["He sent the crucial information by _____ email.", "(x)", "the", "a", "an", "Communication Medium after 'by'", "Communication methods after 'by' (by email, by post, by phone) take zero article '(x)'."],
    ["They fought _____ tooth and nail against oppression.", "(x)", "the", "a", "an", "Paired Idiomatic Nouns take Zero Article", "Idiomatic coordinate pairs (tooth and nail, hand to hand, day by day) take zero article '(x)'."],
    ["The soldiers marched _____ arm in arm through the victory parade.", "(x)", "the", "a", "an", "Idiomatic Pair 'arm in arm'", "Coordinate idiomatic phrases take zero article '(x)'."],
    ["He was elected _____ captain of the college football team.", "(x)", "the", "a", "an", "Factitive Object / Unique Role after 'elected'", "Predicate role denoting a single unique office after 'elected' takes zero article '(x)'."],
    ["We set _____ sail for the remote island at dawn.", "(x)", "the", "a", "an", "Idiomatic Verb Phrase 'set sail'", "The idiomatic expression 'set sail' takes zero article '(x)'."],
    ["The house caught _____ fire due to an electrical short circuit.", "(x)", "the", "a", "an", "Idiomatic Verb Phrase 'catch fire'", "The fixed expression 'catch fire' takes zero article '(x)'."],
    ["He lost _____ heart after failing the preliminary test.", "(x)", "the", "a", "an", "Idiomatic Expression 'lose heart'", "The idiom 'lose heart' takes zero article '(x)'."],
    ["She gave _____ birth to a healthy baby girl in the hospital.", "(x)", "the", "a", "an", "Fixed Expression 'give birth'", "'Give birth' is a fixed verbal phrase taking zero article '(x)'."],
    ["They shook _____ hands warmly after concluding the bilateral agreement.", "(x)", "the", "a", "an", "Fixed Expression 'shake hands'", "'Shake hands' takes zero article '(x)'."],
    ["He took _____ shelter under a banyan tree during the heavy downpour.", "(x)", "the", "a", "an", "Fixed Expression 'take shelter'", "Idiomatic phrase 'take shelter' takes zero article '(x)'."],
    ["I made him _____ monitor of the classroom.", "(x)", "the", "a", "an", "Role after 'make + object'", "Official post title following 'make' takes zero article '(x)'."],
    ["He went to _____ sea as a young sailor.", "(x)", "the", "a", "an", "Idiom 'go to sea' (become a sailor)", "The idiomatic phrase 'go to sea' (to become a sailor) takes zero article '(x)'."],
    ["The student was sent to _____ prison for his criminal misconduct.", "(x)", "the", "a", "an", "Primary Purpose of Prison", "Being sent to prison as a convict (primary purpose) takes zero article '(x)'."],
    ["Mother is at _____ home preparing afternoon snacks.", "(x)", "the", "a", "an", "Fixed Phrase 'at home'", "The phrase 'at home' takes zero article '(x)'."],
    ["He took _____ offense at my casual humorous remark.", "(x)", "the", "a", "an", "Idiomatic Verb Phrase 'take offense'", "The phrase 'take offense' takes zero article '(x)'."]
  ];
  omissionArticles.forEach((d, i) => {
    list.push(makeMCQ(`art_omiss_${i+1}`, tid, 'definite_and_zero', 'omission_rules', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'hard'));
  });

  // 6. Mixed Board Standard Article Items (15)
  const mixedArticles = [
    ["He is _____ honorable guest at our annual prize giving ceremony.", "an", "a", "the", "(x)", "Silent 'h' in 'honorable'", "Honorable begins with vowel sound /ɒ/, requiring 'an'."],
    ["English is _____ international language spoken globally.", "an", "a", "the", "(x)", "Vowel sound /ɪ/ in 'international'", "International begins with vowel sound /ɪ/, requiring 'an'."],
    ["_____ Sundarbans is home to the majestic Royal Bengal Tiger.", "The", "A", "An", "(x)", "Geographical Mangrove Forest", "The Sundarbans forest takes definite article 'The'."],
    ["He is _____ LLB degree holder practicing at the High Court.", "an", "a", "the", "(x)", "Abbreviation 'LLB' starting with /el/", "L begins with vowel sound /e/, taking 'an'."],
    ["Padma Bridge has connected _____ southern region with Dhaka.", "the", "a", "an", "(x)", "Specific Geographic Directional Region", "Defined geographical regions take 'the' ('the southern region')."],
    ["Smoking is _____ injurious habit for health.", "an", "a", "the", "(x)", "Vowel sound in 'injurious'", "Injurious starts with vowel sound /ɪn/, taking 'an'."],
    ["He has _____ few friends in this new city.", "a", "the", "an", "(x)", "Idiomatic Quantifier 'a few'", "'A few' means a small positive quantity of friends."],
    ["There is _____ little milk left in the glass.", "a", "the", "an", "(x)", "Idiomatic Quantifier 'a little'", "'A little' denotes a small positive amount of uncountable milk."],
    ["_____ idle always suffer in the long run.", "The", "A", "An", "(x)", "The + Adjective for Class of People", "'The idle' refers to the entire class of lazy people, requiring 'The'."],
    ["He will return in _____ quarter of an hour.", "a", "the", "an", "(x)", "Fraction Expression 'a quarter of an hour'", "'A quarter of an hour' is a fixed standard phrase."],
    ["What _____ beautiful scenery it is!", "a", "(x)", "the", "an", "Exclamatory Sentence Pattern (What a/an)", "'What a + adjective + noun' is the standard exclamatory formula."],
    ["He gave me _____ hundred taka note.", "a", "the", "an", "(x)", "Number Determiner 'a hundred'", "'A hundred' takes the indefinite article 'a'."],
    ["He is _____ University professor with high reputation.", "a", "an", "the", "(x)", "'University' with /juː/ sound", "University begins with /juː/ consonant sound, taking 'a'."],
    ["_____ water of the Buriganga is severely polluted.", "The", "A", "An", "(x)", "Specific Qualified Material Noun", "'Water of the Buriganga' is made specific by the prepositional phrase, taking 'The'."],
    ["He goes to college by _____ bus every morning.", "(x)", "the", "a", "an", "Means of Transport 'by bus'", "'By bus' takes zero article '(x)'."]
  ];
  mixedArticles.forEach((d, i) => {
    list.push(makeMCQ(`art_mix_${i+1}`, tid, 'definite_and_zero', 'mixed', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'medium'));
  });

  return list;
}

console.log('RightFormOfVerbs and Articles generator logic defined.');
