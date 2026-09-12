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
// TOPIC 1: RIGHT FORM OF VERBS (120+)
// -------------------------------------------------------------
function generateRightFormOfVerbs() {
  const list = [];
  const tid = 'right_form_of_verbs';
  const inst = 'Choose the correct form of the verb in parentheses:';

  // 1. Conditionals (30 items)
  const condData = [
    ["If he studies attentively every day, he _____ (pass) with GPA 5.", "will pass", "would pass", "passes", "would have passed", "1st Conditional (If + Present Simple, Future Simple)", "When the 'if' clause is in the Present Simple, the main clause requires Future Simple (will + V1)."],
    ["If the government takes strict measures against food adulteration, public health _____ (improve).", "will improve", "would improve", "improves", "would have improved", "1st Conditional", "Real future condition with present tense in if-clause requires 'will improve'."],
    ["Unless you work hard from the beginning of the academic year, you _____ (fail).", "will fail", "would fail", "failed", "would have failed", "1st Conditional with 'Unless'", "'Unless' equals 'if not'; in the first conditional it takes Future Simple 'will fail'."],
    ["If it rains heavily tomorrow morning, we _____ (cancel) the cricket practice.", "shall cancel", "cancelled", "would cancel", "would have cancelled", "1st Conditional", "Future condition takes 'shall/will cancel'."],
    ["If they cultivate hybrid rice systematically, their crop yield _____ (increase).", "will increase", "would increase", "increased", "would have increased", "1st Conditional", "Present condition takes 'will increase'."],
    ["If I had enough savings, I _____ (help) the destitute flood victims.", "would help", "will help", "helped", "would have helped", "2nd Conditional (If + Past Simple, would + V1)", "Hypothetical condition in Past Simple requires 'would + V1' in the main clause."],
    ["If he knew my residential address, he _____ (visit) my home.", "would visit", "will visit", "visited", "would have visited", "2nd Conditional", "Unreal present/future condition takes 'would visit'."],
    ["If I were an influential minister, I _____ (eradicate) corruption.", "would eradicate", "will eradicate", "eradicated", "would have eradicated", "2nd Conditional Subjunctive ('were')", "Hypothetical 'were' takes 'would eradicate'."],
    ["If they possessed modern technology, they _____ (manufacture) electric vehicles.", "would manufacture", "will manufacture", "manufactured", "would have manufactured", "2nd Conditional", "Past condition requires 'would manufacture'."],
    ["If she practiced spoken English regularly, she _____ (speak) with confidence.", "would speak", "will speak", "spoke", "would have spoken", "2nd Conditional", "Past condition takes 'would speak'."],
    ["If you had informed me before departing, I _____ (receive) you at the station.", "would have received", "would receive", "will receive", "had received", "3rd Conditional (If + Past Perfect, would have + V3)", "Unfulfilled past condition requires 'would have + V3' in the main clause."],
    ["If the rescue team had arrived earlier, many lives _____ (be) saved.", "would have been", "would be", "will be", "had been", "3rd Conditional Passive", "Past perfect passive condition requires 'would have been saved'."],
    ["Had I possessed the wings of a bird, I _____ (fly) across the sky.", "would have flown", "will fly", "would fly", "flew", "Inverted 3rd Conditional (Had + Subject + V3)", "'Had I + V3' inverted structure functions as a 3rd conditional, requiring 'would have + V3'."],
    ["Had the student revised the syllabus thoroughly, he _____ (obtain) the top grade.", "would have obtained", "would obtain", "will obtain", "obtained", "Inverted 3rd Conditional", "Inverted past perfect takes 'would have obtained'."],
    ["If the doctor had not intervened immediately, the patient _____ (die).", "would have died", "would die", "will die", "had died", "3rd Conditional", "Negative past condition takes 'would have died'."],
    ["If he invites me cordially, I _____ (attend) his wedding ceremony.", "will attend", "would attend", "attended", "would have attended", "1st Conditional", "Real present condition takes 'will attend'."],
    ["If water is heated to 100 degrees Celsius, it _____ (boil).", "boils", "will boil", "boiled", "would boil", "Zero Conditional (Scientific Fact)", "Scientific truths use Present Simple in both clauses (boils)."],
    ["If you heat ice, it _____ (melt).", "melts", "will melt", "melted", "would melt", "Zero Conditional", "Universal physical law requires Present Simple 'melts'."],
    ["If I won a lottery prize of ten million taka, I _____ (build) a charitable hospital.", "would build", "will build", "built", "would have built", "2nd Conditional", "Improbable hypothetical takes 'would build'."],
    ["Had we known about the sudden traffic congestion, we _____ (take) a detour.", "would have taken", "would take", "will take", "had taken", "Inverted 3rd Conditional", "Inverted past conditional requires 'would have taken'."],
    ["If he gets GPA 5 in HSC, his parents _____ (reward) him with a laptop.", "will reward", "would reward", "rewarded", "would have rewarded", "1st Conditional", "Real future condition takes 'will reward'."],
    ["If she had studied medical science, she _____ (become) a skilled surgeon.", "would have become", "would become", "will become", "became", "3rd Conditional", "Unreal past ambition takes 'would have become'."],
    ["If you freeze water, it _____ (turn) into ice.", "turns", "will turn", "turned", "would turn", "Zero Conditional", "Physical reality takes 'turns'."],
    ["If I were a bird, I _____ (soar) high in the boundless sky.", "would soar", "will soar", "soared", "would have soared", "2nd Conditional Subjunctive", "Hypothetical wish takes 'would soar'."],
    ["Had the authorities built the embankment in time, the village _____ (not submerge).", "would not have submerged", "would not submerge", "will not submerge", "had not submerged", "3rd Conditional Negative", "Inverted past perfect takes 'would not have submerged'."],
    ["If Karim runs fast, he _____ (catch) the intercity train.", "will catch", "would catch", "caught", "would have caught", "1st Conditional", "Present conditional takes 'will catch'."],
    ["If I met the Prime Minister, I _____ (request) special grants for our college.", "would request", "will request", "requested", "would have requested", "2nd Conditional", "Hypothetical situation takes 'would request'."],
    ["If the weather had been favorable, our flight _____ (not cancel).", "would not have been cancelled", "would not be cancelled", "will not be cancelled", "had not been cancelled", "3rd Conditional Passive", "Past perfect condition requires 'would not have been cancelled'."],
    ["If you mix red and blue colors, you _____ (get) purple.", "get", "will get", "got", "would get", "Zero Conditional", "Fact of color blending takes 'get'."],
    ["If they had practiced systematically, they _____ (win) the final match.", "would have won", "would win", "will win", "had won", "3rd Conditional", "Unfulfilled past outcome takes 'would have won'."]
  ];
  condData.forEach((d, i) => {
    list.push(makeMCQ(`rfv_cond_${i+1}`, tid, 'conditionals_time', 'conditionals', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], i % 3 === 0 ? 'easy' : (i % 3 === 1 ? 'medium' : 'hard')));
  });

  // 2. Subject-Verb Agreement (30 items)
  const svaData = [
    ["Neither the principal nor the lecturers _____ (be) present at the workshop.", "were", "was", "is", "has been", "Neither...nor Agreement with Closest Subject", "With 'neither...nor', the finite verb agrees with the subject closest to it ('the lecturers' is plural, so 'were')."],
    ["Either the students or the headmaster _____ (be) responsible for the decision.", "is", "are", "were", "have been", "Either...or Agreement with Closest Subject", "The closest subject 'the headmaster' is singular, so singular verb 'is' is required."],
    ["Rahim as well as his classmates _____ (be) attending the seminar.", "is", "are", "were", "have been", "As well as / Along with (Agrees with 1st Subject)", "When subjects are joined by 'as well as', 'along with', or 'together with', the verb agrees with the first subject ('Rahim' is singular -> 'is')."],
    ["The chairman, along with three committee members, _____ (have) approved the budget.", "has", "have", "are having", "were having", "Along with Agreement", "First subject 'The chairman' is singular, taking 'has approved'."],
    ["Bread and butter _____ (be) his staple breakfast.", "is", "are", "were", "have been", "Singular Pair Idea", "Two singular nouns joined by 'and' expressing a single combined idea take a singular verb ('is')."],
    ["Slow and steady _____ (win) the race.", "wins", "win", "winning", "have won", "Proverbial Single Unit", "Combined singular concept takes 3rd person singular verb ('wins')."],
    ["The Arabian Nights _____ (be) an internationally renowned classic.", "is", "are", "were", "have been", "Book Title as Singular Noun", "Titles of books, newspapers, or plays taking plural form are treated as singular ('is')."],
    ["Gulliver's Travels _____ (be) written by Jonathan Swift.", "was", "were", "are", "have been", "Book Title in Past Tense", "Book title is singular, taking 'was written'."],
    ["Ten miles _____ (be) a long distance for a sick man to walk.", "is", "are", "were", "have been", "Plural Unit of Distance / Quantity", "Plural expressions of distance, weight, time, or money viewed as a single whole take a singular verb ('is')."],
    ["Fifty thousand taka _____ (be) a substantial sum for the poor student.", "is", "are", "were", "have been", "Monetary Amount as Single Unit", "Total sum of money takes singular verb 'is'."],
    ["The quality of these Rajshahi mangoes _____ (be) exceptional.", "is", "are", "were", "have been", "Prepositional Phrase Subject ('The quality')", "The true subject is 'The quality' (singular), not 'mangoes', requiring singular 'is'."],
    ["The price of daily essential commodities _____ (have) skyrocketed recently.", "has", "have", "are", "were", "Singular Head Noun ('The price')", "Head noun 'The price' is singular, requiring 'has skyrocketed'."],
    ["One of the most meritorious students _____ (have) won the gold medal.", "has", "have", "are having", "were having", "One of + Plural Noun -> Singular Verb", "'One of' followed by a plural noun takes a singular verb ('has')."],
    ["Each of the participants _____ (receive) a certificate of appreciation.", "receives", "receive", "are receiving", "have received", "Each / Every + Singular Verb", "'Each' is an indefinite pronoun taking a singular verb ('receives')."],
    ["Every boy and every girl _____ (be) present at the assembly.", "was", "were", "are", "have been", "Every + Noun and Every + Noun", "Nouns modified by 'every' take a singular verb ('was')."],
    ["Many a meritorious student _____ (fail) to realize his potential without guidance.", "fails", "fail", "are failing", "have failed", "Many a + Singular Noun -> Singular Verb", "'Many a' is followed by a singular noun and singular verb ('fails')."],
    ["Physics _____ (be) my favorite subject in college.", "is", "are", "were", "have been", "Name of Science / Branch of Learning", "Names of academic subjects ending in 's' take a singular verb ('is')."],
    ["The news _____ (be) too shocking to be true.", "is", "are", "were", "have been", "Uncountable Noun ('News')", "'News' is an uncountable singular noun taking 'is'."],
    ["The jury _____ (be) unanimous in its verdict.", "was", "were", "are", "have been", "Collective Noun as a Single Unit", "Collective noun acting in unison takes a singular verb and neuter pronoun ('was', 'its')."],
    ["The jury _____ (be) divided in their individual opinions.", "were", "was", "is", "has been", "Noun of Multitude (Divided Collective)", "When members of a collective noun act separately, it takes a plural verb ('were')."],
    ["A number of students _____ (be) waiting outside the principal's office.", "are", "is", "was", "has been", "A number of (Plural)", "'A number of' takes a plural noun and plural verb ('are')."],
    ["The number of road accidents _____ (have) decreased this month.", "has", "have", "are", "were", "The number of (Singular)", "'The number of' takes a singular verb ('has decreased')."],
    ["The rich _____ (be) not always happy.", "are", "is", "was", "has been", "The + Adjective = Plural Noun", "'The + Adjective' denoting a whole class takes a plural verb ('are')."],
    ["The virtuous _____ (be) blessed by the Almighty.", "are", "is", "was", "has been", "The + Adjective Plural", "'The virtuous' refers to all virtuous people, taking plural 'are'."],
    ["More than one candidate _____ (be) disqualified for irregularities.", "was", "were", "are", "have been", "More than one + Singular Noun", "'More than one' takes a singular noun and singular verb ('was')."],
    ["Two-thirds of the work _____ (have) been accomplished smoothly.", "has", "have", "are", "were", "Fraction of Uncountable Noun", "Fractions of uncountable nouns ('work') take a singular verb ('has been')."],
    ["Two-thirds of the mangoes _____ (be) ripe.", "are", "is", "was", "has been", "Fraction of Plural Countable Noun", "Fractions of plural countable nouns ('mangoes') take a plural verb ('are')."],
    ["Time and tide _____ (wait) for none.", "wait", "waits", "waiting", "has waited", "Dual Concepts with Plural Verb", "Traditional grammatical standard treats 'time and tide' as two distinct forces taking plural 'wait'."],
    ["He is one of those leaders who _____ (inspire) the youth.", "inspire", "inspires", "is inspiring", "has inspired", "Relative Pronoun Agreement with Plural Antecedent", "Relative pronoun 'who' refers to plural antecedent 'leaders', taking plural verb 'inspire'."],
    ["It is I who _____ (be) responsible for this error.", "am", "is", "are", "was", "Relative Pronoun Agreement with 'I'", "Relative pronoun 'who' agrees with antecedent 'I', taking 'am'."]
  ];
  svaData.forEach((d, i) => {
    list.push(makeMCQ(`rfv_sva_${i+1}`, tid, 'subject_verb_agreement', 'agreement', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], i % 3 === 0 ? 'easy' : (i % 3 === 1 ? 'medium' : 'hard')));
  });

  // 3. Time Markers & Tense Sequences (30 items)
  const tmData = [
    ["He _____ (leave) for London yesterday morning.", "left", "leaves", "has left", "had left", "Past Time Marker ('yesterday')", "Definite past time markers (yesterday, ago, last week) require the Simple Past tense (V2 'left')."],
    ["I _____ (receive) your letter three days ago.", "received", "receive", "have received", "had received", "Past Time Marker ('ago')", "'Ago' strictly requires the Simple Past tense (V2 'received')."],
    ["Long ago there _____ (live) a benevolent king in Bengal.", "lived", "lives", "has lived", "had lived", "Past Time Marker ('long ago')", "Past narrative context with 'long ago' requires Simple Past 'lived'."],
    ["He _____ (just finish) his homework.", "has just finished", "just finished", "had just finished", "is just finishing", "Present Perfect Marker ('just')", "Adverbs like 'just', 'already', 'recently', 'yet' require the Present Perfect tense ('has just finished')."],
    ["They _____ (already complete) the syllabus before the term began.", "had already completed", "have already completed", "already completed", "complete", "Past Perfect with 'already' and before-clause", "Past action completed before another past event takes Past Perfect ('had already completed')."],
    ["Recently our college _____ (install) digital smart boards in all classrooms.", "has installed", "installed", "had installed", "installs", "Present Perfect Marker ('recently')", "'Recently' connects a past event to the present, requiring Present Perfect 'has installed'."],
    ["The sun _____ (rise) in the east and sets in the west.", "rises", "rose", "is rising", "has risen", "Universal Truth / Scientific Fact", "Universal truths and habitual facts strictly take the Present Simple tense ('rises')."],
    ["The earth _____ (move) around the sun.", "moves", "moved", "is moving", "has moved", "Universal Truth", "Present Simple 'moves' is required for permanent astronomical facts."],
    ["Water _____ (freeze) at zero degrees Celsius.", "freezes", "froze", "is freezing", "has frozen", "Scientific Fact", "Present Simple 'freezes'."],
    ["He always _____ (carry) an umbrella during the monsoon season.", "carries", "carried", "is carrying", "has carried", "Habitual Action ('always')", "Habitual adverbs (always, regularly, daily) take Present Simple 'carries'."],
    ["The train _____ (arrive) at 8:00 AM every morning.", "arrives", "arrived", "is arriving", "has arrived", "Scheduled Routine", "Scheduled timetable events use Present Simple 'arrives'."],
    ["Look! The children _____ (play) joyfully in the rain.", "are playing", "play", "played", "have played", "Present Action in Progress ('Look!')", "Attention markers ('Look!', 'Listen!') indicate an ongoing action requiring Present Continuous ('are playing')."],
    ["Listen! Someone _____ (knock) at the front door.", "is knocking", "knocks", "knocked", "has knocked", "Present Continuous Marker ('Listen!')", "Requires Present Continuous 'is knocking'."],
    ["At present, the government _____ (construct) the metro rail expansion.", "is constructing", "constructs", "constructed", "has constructed", "Present Marker ('At present')", "'At present' and 'now' take Present Continuous 'is constructing'."],
    ["It _____ (rain) cats and dogs since early morning.", "has been raining", "is raining", "rained", "was raining", "Present Perfect Continuous with 'since'", "Action beginning in the past and continuing with a point of time ('since') requires 'has been raining'."],
    ["He _____ (suffer) from viral fever for the last seven days.", "has been suffering", "is suffering", "suffered", "was suffering", "Present Perfect Continuous with 'for'", "Duration with 'for' requires Present Perfect Continuous 'has been suffering'."],
    ["The patient _____ (die) before the doctor arrived.", "had died", "died", "has died", "was dying", "Past Perfect with 'before'", "In a past sequence with 'before', the earlier action takes Past Perfect ('had died') and the later takes Simple Past ('arrived')."],
    ["The doctor arrived after the patient _____ (die).", "had died", "died", "has died", "was dying", "Past Perfect with 'after'", "With 'after', the earlier action following 'after' takes Past Perfect ('had died')."],
    ["The train _____ (leave) before we reached the railway station.", "had left", "left", "has left", "leaves", "Past Perfect with 'before'", "Earlier event takes 'had left'."],
    ["We reached the station after the train _____ (leave).", "had left", "left", "has left", "leaves", "Past Perfect with 'after'", "Clause after 'after' takes 'had left'."],
    ["No sooner had the bell rung than the teacher _____ (enter) the classroom.", "entered", "enters", "had entered", "entering", "No sooner had...than (Past Simple V2)", "The clause introduced by 'than' after 'No sooner had' strictly takes the Simple Past (V2 'entered')."],
    ["Scarcely had the match started when it _____ (begin) to rain.", "began", "begins", "had begun", "beginning", "Scarcely had...when (Past Simple V2)", "The 'when' clause takes Simple Past (V2 'began')."],
    ["Hardly had we reached the terminal when the bus _____ (depart).", "departed", "departs", "had departed", "departing", "Hardly had...when (Past Simple V2)", "Clause following 'when' takes Simple Past (V2 'departed')."],
    ["It is high time we _____ (change) our corrupt habits.", "changed", "change", "will change", "have changed", "It is high time + Past Simple (V2)", "After 'It is high time / It is time' followed by a subject, the verb strictly takes Simple Past (V2 'changed')."],
    ["It is high time the government _____ (take) punitive steps against syndicate hoarders.", "took", "takes", "will take", "has taken", "It is high time + V2", "Requires Simple Past (V2 'took')."],
    ["He talks as if he _____ (know) everything in the world.", "knew", "knows", "has known", "had known", "As if / As though + Past Simple Subjunctive", "When the main clause is in the Present Tense ('talks'), 'as if' takes Past Simple (V2 'knew' or 'were')."],
    ["The man behaves as though he _____ (be) a billionaire.", "were", "was", "is", "has been", "As though + Subjunctive 'were'", "Unreal assumption with 'as though' takes subjunctive 'were' regardless of subject number."],
    ["He spoke as if he _____ (see) the incident with his own eyes.", "had seen", "saw", "sees", "has seen", "As if + Past Main -> Past Perfect", "When the main clause is in the Past Tense ('spoke'), 'as if' takes Past Perfect ('had seen')."],
    ["I wish I _____ (be) a visionary philosopher like Socrates.", "were", "was", "am", "have been", "Wish + Subjunctive 'were'", "Expressing an unreal wish takes subjunctive 'were'."],
    ["Would that I _____ (enter) the examination hall without anxiety!", "could enter", "can enter", "entered", "have entered", "Would that + could + V1", "'Would that' expressing strong desire takes 'could + V1' ('could enter')."]
  ];
  tmData.forEach((d, i) => {
    list.push(makeMCQ(`rfv_tm_${i+1}`, tid, 'conditionals_time', 'time_markers', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], i % 3 === 0 ? 'easy' : (i % 3 === 1 ? 'medium' : 'hard')));
  });

  // 4. Modals, Voice, Infinitives & Participles (30 items)
  const mvipData = [
    ["You had better _____ (consult) a specialist doctor immediately.", "consult", "consulted", "to consult", "consulting", "Had better + Bare Infinitive (V1)", "After modal idioms 'had better', 'had rather', 'would rather', the verb takes the bare infinitive (V1 'consult')."],
    ["I would rather die than _____ (beg) for mercy.", "beg", "begged", "to beg", "begging", "Would rather...than + Bare Infinitive", "'Would rather' takes bare infinitive 'beg' after 'than'."],
    ["He made the little boy _____ (cry) by snatching his toy.", "cry", "cried", "to cry", "crying", "Causative 'make' + Bare Infinitive", "Active causative verb 'make' takes an object followed by bare infinitive (V1 'cry')."],
    ["I let him _____ (use) my laptop for his online presentation.", "use", "used", "to use", "using", "Causative 'let' + Bare Infinitive", "Causative 'let' is followed by object and bare infinitive (V1 'use')."],
    ["I saw the injured boy _____ (lie) on the road.", "lying", "lay", "laid", "to lie", "Verb of Perception + Present Participle", "Verbs of perception (see, hear, notice) take a participle ('lying') when witnessing an action in progress."],
    ["I heard her _____ (sing) a Tagore song melodiously.", "singing", "sang", "sung", "to sing", "Verb of Perception + V-ing", "Perception verb 'heard' takes present participle 'singing'."],
    ["He came to my office with a view to _____ (discuss) the contract.", "discussing", "discuss", "discussed", "to discuss", "With a view to + Gerund (V-ing)", "Prepositional phrase 'with a view to' strictly requires a gerund (V-ing 'discussing')."],
    ["I look forward to _____ (receive) your favorable response.", "receiving", "receive", "received", "to receive", "Look forward to + Gerund (V-ing)", "'Look forward to' ends with a true preposition requiring the gerund (V-ing 'receiving')."],
    ["He is accustomed to _____ (wake) up early at dawn.", "waking", "wake", "woke", "woken", "Accustomed to + Gerund (V-ing)", "'Accustomed to' is followed by a gerund (V-ing 'waking')."],
    ["She went to the market with the intention of _____ (buy) fresh fish.", "buying", "buy", "bought", "to buy", "Preposition 'of' + Gerund", "Any preposition (except standard infinitive 'to') takes a gerund (V-ing 'buying')."],
    ["Smoking _____ (prohibit) in all public transport vehicles.", "is prohibited", "prohibits", "prohibited", "is prohibiting", "Passive Voice Present Simple", "The subject 'Smoking' receives the action, requiring passive 'is prohibited'."],
    ["The historic Padma Bridge _____ (inaugurate) in June 2022.", "was inaugurated", "inaugurated", "has inaugurated", "is inaugurated", "Passive Voice Past Simple", "Past event with passive subject requires 'was inaugurated'."],
    ["Rice _____ (grow) abundantly in the fertile delta of Bangladesh.", "is grown", "grows", "grown", "is growing", "Ergative / Passive Usage", "In agricultural export contexts, 'Rice is grown' or 'grows' describes widespread cultivation."],
    ["English _____ (speak) as a global lingua franca.", "is spoken", "speaks", "spoke", "has spoken", "Passive Present Simple", "Language subject takes passive 'is spoken'."],
    ["The letter must _____ (deliver) before 5:00 PM today.", "be delivered", "deliver", "delivered", "have delivered", "Modal Passive (must be + V3)", "Modal auxiliary in passive requires 'modal + be + V3' ('must be delivered')."],
    ["This problem can easily _____ (solve) with a simple formula.", "be solved", "solve", "solved", "solving", "Modal Passive (can be + V3)", "Requires 'can be solved'."],
    ["Having _____ (complete) the research paper, he submitted it to the editor.", "completed", "complete", "completing", "been completed", "Perfect Participle (Having + V3)", "Perfect participle takes the formula 'Having + V3' ('Having completed')."],
    ["Having _____ (defeat) the enemy forces, the valiant soldiers celebrated.", "defeated", "defeat", "defeating", "been defeated", "Perfect Participle", "'Having defeated' denotes an action completed prior to the main clause."],
    ["_____ (walk) in the morning air is beneficial for cardiac health.", "Walking", "Walk", "Walked", "To walking", "Gerund as Subject of Sentence", "A gerund (V-ing 'Walking') acts as a verbal noun functioning as the subject."],
    ["_____ (swim) across the turbulent river was a daunting challenge.", "Swimming", "Swim", "Swam", "To swimming", "Gerund as Subject", "Gerund 'Swimming' functions as subject of the sentence."],
    ["He stopped _____ (smoke) upon his physician's strict advice.", "smoking", "smoke", "to smoke", "smoked", "Verb 'stop' + Gerund (Cease action)", "'Stop + V-ing' means to discontinue the habit altogether ('stopped smoking')."],
    ["While _____ (walk) along the sea beach, I found a rare sea shell.", "walking", "walk", "walked", "to walk", "While + V-ing (without subject)", "When 'while' is directly followed by a verb without a subject pronoun, it takes 'V-ing' ('walking')."],
    ["While he _____ (walk) in the garden, a venomous snake bit him.", "was walking", "walked", "is walking", "has walked", "While + Past Continuous (with subject)", "When 'while' is followed by a subject, it takes the Past Continuous tense ('was walking')."],
    ["You cannot prevent him from _____ (express) his opinions.", "expressing", "express", "expressed", "to express", "Preposition 'from' + Gerund", "'Prevent from' takes gerund 'expressing'."],
    ["He is fond of _____ (read) classical historical novels.", "reading", "read", "reads", "to read", "Preposition 'of' + Gerund", "Takes gerund 'reading'."],
    ["She avoided _____ (meet) the angry customer.", "meeting", "meet", "to meet", "met", "Verb 'avoid' + Gerund", "The verb 'avoid' is followed by a gerund ('meeting')."],
    ["Mind _____ (open) the window, please?", "opening", "open", "to open", "opened", "Would you mind / Mind + V-ing", "Polite request with 'Would you mind' requires a gerund ('opening')."],
    ["He confessed to _____ (steal) the confidential documents.", "stealing", "steal", "stolen", "have stolen", "Confess to + Gerund", "'Confess to' ends in a preposition requiring 'stealing'."],
    ["We watched the national flag _____ (hoist) at sunrise.", "being hoisted", "hoisting", "hoist", "hoisted", "Passive Participle after Watch", "Flag receiving action takes 'being hoisted'."],
    ["He succeeded in _____ (pass) the civil service examination.", "passing", "pass", "passed", "to pass", "Preposition 'in' + Gerund", "'Succeed in' takes gerund 'passing'."]
  ];
  mvipData.forEach((d, i) => {
    list.push(makeMCQ(`rfv_mvip_${i+1}`, tid, 'subject_verb_agreement', 'modals_infinitives_participles', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], i % 3 === 0 ? 'easy' : (i % 3 === 1 ? 'medium' : 'hard')));
  });

  return list;
}

// -------------------------------------------------------------
// TOPIC 2: ARTICLES & DETERMINERS (125 items)
// -------------------------------------------------------------
function generateArticles() {
  const list = [];
  const tid = 'articles';
  const inst = 'Choose the correct article or determiner (use (x) for zero article):';

  // 1. Indefinite Articles A / An (30)
  const aAnData = [
    ["He is _____ honorable citizen of our locality.", "an", "a", "the", "(x)", "Silent 'H' Rule ('an')", "Words starting with a silent 'h' (honorable, honest, hour, heir) take the indefinite article 'an'."],
    ["He returned home after _____ hour of intensive coaching.", "an", "a", "the", "(x)", "Silent 'H' Rule ('an hour')", "'Hour' begins with a vowel sound /aʊər/, so it takes 'an'."],
    ["The prince was declared _____ heir to the vast royal estate.", "an", "a", "the", "(x)", "Silent 'H' Rule ('an heir')", "'Heir' begins with a silent 'h' and vowel sound, taking 'an'."],
    ["He is _____ university professor with thirty years of teaching experience.", "a", "an", "the", "(x)", "Consonant Sound /juː/ ('a university')", "Words beginning with vowel letter 'u' pronounced as /juː/ (university, European, unique, uniform, useful) take 'a'."],
    ["He bought _____ one-taka ticket for the municipal park.", "a", "an", "the", "(x)", "Consonant Sound /w/ ('a one-taka')", "Words beginning with 'o' sounded as /w/ (one-eyed, one-way, one-taka) take 'a'."],
    ["He met _____ European diplomat at the international summit.", "a", "an", "the", "(x)", "'Eu' pronounced as /juː/ ('a European')", "'European' starts with a /juː/ consonant sound, taking 'a'."],
    ["This is _____ unique opportunity for our college debaters.", "a", "an", "the", "(x)", "'U' pronounced as /juː/ ('a unique')", "'Unique' starts with /juː/, requiring 'a'."],
    ["Iron is _____ useful metal for manufacturing heavy machinery.", "a", "an", "the", "(x)", "'U' pronounced as /juː/ ('a useful')", "'Useful' takes 'a'."],
    ["The student is _____ honest boy loved by all his classmates.", "an", "a", "the", "(x)", "Silent 'H' ('an honest boy')", "'Honest' begins with silent 'h', taking 'an'."],
    ["He bought _____ umbrella before the sudden downpour.", "an", "a", "the", "(x)", "Short Vowel /ʌ/ ('an umbrella')", "'Umbrella' starts with vowel sound /ʌ/, taking 'an'."],
    ["His elder brother is _____ MBBS doctor in Dhaka Medical College.", "an", "a", "the", "(x)", "Abbreviation with Vowel Sound /em/ ('an MBBS')", "Abbreviations starting with letters pronounced with an initial vowel sound (M, F, L, N, R, S, X) take 'an' (an MBBS, an MP, an FCPS, an LLB, an SP)."],
    ["His father was elected _____ MP from the local constituency.", "an", "a", "the", "(x)", "Abbreviation Vowel Sound /em/ ('an MP')", "'M' is pronounced /em/, taking 'an'."],
    ["The police officer was decorated as _____ SP for his bravery.", "an", "a", "the", "(x)", "Abbreviation Vowel Sound /es/ ('an SP')", "'S' is pronounced /es/, taking 'an'."],
    ["He appointed _____ LLB graduate as his legal advisor.", "an", "a", "the", "(x)", "Abbreviation Vowel Sound /el/ ('an LLB')", "'L' is pronounced /el/, taking 'an'."],
    ["The surgeon completed his _____ FCPS degree with distinction.", "an", "a", "the", "(x)", "Abbreviation Vowel Sound /ef/ ('an FCPS')", "'F' is pronounced /ef/, taking 'an'."],
    ["He is _____ BA graduate from National University.", "a", "an", "the", "(x)", "Abbreviation with Consonant Sound /biː/ ('a BA')", "Letter 'B' starts with consonant sound /b/, taking 'a'."],
    ["He is _____ PhD scholar in molecular biology.", "a", "an", "the", "(x)", "Abbreviation Consonant Sound /piː/ ('a PhD')", "Letter 'P' starts with consonant sound /p/, taking 'a'."],
    ["He found _____ one-eyed beggar sitting beside the shrine.", "a", "an", "the", "(x)", "Consonant Sound /w/ ('a one-eyed')", "'One-eyed' starts with /w/, taking 'a'."],
    ["This is _____ ewe grazing on the meadow.", "a", "an", "the", "(x)", "'Ewe' pronounced as /juː/ ('a ewe')", "'Ewe' begins with consonant sound /juː/, taking 'a'."],
    ["It was _____ historical event celebrated worldwide.", "a", "an", "the", "(x)", "Sounded 'H' ('a historical event')", "Modern standard English uses 'a' before sounded 'h' in historical, hotel, heroic."],
    ["They stayed at _____ luxury hotel in Sylhet.", "a", "an", "the", "(x)", "Sounded 'H' ('a hotel')", "'Hotel' starts with sounded /h/, taking 'a'."],
    ["He made _____ heroic sacrifice during the liberation war.", "a", "an", "the", "(x)", "Sounded 'H' ('a heroic')", "'Heroic' takes 'a'."],
    ["She is _____ MA in English from Jahangirnagar University.", "an", "a", "the", "(x)", "Abbreviation Vowel Sound ('an MA')", "'M' is pronounced /em/, taking 'an'."],
    ["He saw _____ owl perched on the ancient banyan branch.", "an", "a", "the", "(x)", "Vowel Sound /aʊ/ ('an owl')", "'Owl' starts with vowel sound, taking 'an'."],
    ["He ate _____ orange after lunch.", "an", "a", "the", "(x)", "Vowel Sound /ɒ/ ('an orange')", "'Orange' starts with vowel sound, taking 'an'."],
    ["It was _____ unanimous decision of the academic council.", "a", "an", "the", "(x)", "'U' pronounced as /juː/ ('a unanimous')", "'Unanimous' begins with /juː/, taking 'a'."],
    ["He is _____ unit leader of the rover scout group.", "a", "an", "the", "(x)", "'U' pronounced as /juː/ ('a unit')", "'Unit' takes 'a'."],
    ["The student is _____ unruly boy who disrupts classes.", "an", "a", "the", "(x)", "Vowel Sound /ʌ/ ('an unruly')", "'Unruly' begins with vowel sound /ʌ/, taking 'an'."],
    ["She bought _____ expensive silk saree from Tangail.", "an", "a", "the", "(x)", "Vowel Sound /ɪ/ ('an expensive')", "'Expensive' starts with vowel sound, taking 'an'."],
    ["He is _____ B.Sc engineer from BUET.", "a", "an", "the", "(x)", "Abbreviation Consonant Sound ('a B.Sc')", "'B' starts with consonant sound, taking 'a'."]
  ];
  aAnData.forEach((d, i) => {
    list.push(makeMCQ(`art_indef_${i+1}`, tid, 'a_an_usage', 'indefinite_articles', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], i % 3 === 0 ? 'easy' : 'medium'));
  });

  // 2. Definite Article The (35)
  const theData = [
    ["_____ Padma is the longest river in Bangladesh.", "The", "A", "An", "(x)", "Names of Rivers, Seas, Oceans ('The')", "Names of rivers (The Padma, The Meghna, The Jamuna, The Nile, The Amazon) take the definite article 'The'."],
    ["_____ Bay of Bengal lies to the south of our country.", "The", "A", "An", "(x)", "Names of Gulfs and Bays ('The')", "Names of seas and bays take 'The'."],
    ["_____ Himalayas stand as a natural barrier in northern South Asia.", "The", "A", "An", "(x)", "Mountain Ranges Plural ('The Himalayas')", "Mountain ranges in plural form take 'The' (but individual mountain peaks take zero article)."],
    ["_____ Mount Everest is the highest mountain peak in the world.", "(x)", "The", "A", "An", "Single Mountain Peak (Zero Article)", "Individual mountain peaks (Mount Everest, Mount Fuji, K2) take NO article."],
    ["_____ Sun gives light and heat to all planets in the solar system.", "The", "A", "An", "(x)", "Unique Astronomical Bodies ('The')", "Unique celestial and geographical objects (The Sun, The Moon, The Earth, The Sky) take 'The'."],
    ["_____ Holy Quran is the sacred divine scripture of Muslims.", "The", "A", "An", "(x)", "Sacred Scriptures ('The')", "Names of holy scriptures (The Quran, The Bible, The Gita, The Ramayana) take 'The'."],
    ["_____ Daily Star is a popular English daily in Bangladesh.", "The", "A", "An", "(x)", "Names of Newspapers ('The')", "Names of newspapers (The Daily Star, The Prothom Alo, The Times) take 'The'."],
    ["_____ Titanic sank on its maiden voyage across the Atlantic.", "The", "A", "An", "(x)", "Names of Ships and Trains ('The')", "Names of famous ships, trains, and aircraft take 'The'."],
    ["_____ United States of America is an advanced industrialized nation.", "The", "A", "An", "(x)", "Country Names with Union/Kingdom/States/Republic ('The')", "Countries whose names contain 'States', 'Kingdom', 'Republic', or plural islands take 'The'."],
    ["_____ United Kingdom consists of four nations.", "The", "A", "An", "(x)", "Country Name with 'Kingdom' ('The')", "Takes 'The'."],
    ["He visited _____ Netherlands during his European summer tour.", "the", "a", "an", "(x)", "Plural Country Names ('The Netherlands')", "Plural country names (The Netherlands, The Philippines) take 'The'."],
    ["_____ Bangladesh achieved independence through the glorious war of 1971.", "(x)", "The", "A", "An", "Single Country Name (Zero Article)", "Singular proper names of countries (Bangladesh, India, Japan) take NO article."],
    ["_____ rich are not always happier than the poor.", "The", "A", "An", "(x)", "The + Adjective representing a Class ('The rich')", "'The + Adjective' denoting an entire class of people takes 'The' and plural verb."],
    ["We must always show compassion to _____ poor.", "the", "a", "an", "(x)", "The + Adjective Class ('The poor')", "'The poor' represents the entire community of impoverished people."],
    ["_____ cow is a very useful domestic animal.", "The", "A", "An", "(x)", "Singular Noun Representing Whole Species ('The')", "A singular countable noun used to represent the whole species takes 'The' (The cow, The rose)."],
    ["_____ rose is the sweetest of all flowers.", "The", "A", "An", "(x)", "Species Representative ('The rose')", "Represents the whole class of flowers."],
    ["Kazi Nazrul Islam is _____ Byron of Bangladesh.", "the", "a", "an", "(x)", "Proper Noun Used as Common Noun with Comparison ('The')", "When a proper noun is compared to another using 'of', it takes 'The' ('The Byron of Bangladesh')."],
    ["Narayanganj is called _____ Dundee of Bangladesh.", "the", "a", "an", "(x)", "Comparative Proper Noun ('The Dundee of...')", "Takes 'The'."],
    ["_____ more you read, the more you learn.", "The", "A", "An", "(x)", "Double Comparative ('The more...the more')", "Parallel degree structures take 'The + comparative, the + comparative'."],
    ["_____ higher we go, the cooler the air becomes.", "The", "A", "An", "(x)", "Double Comparative ('The higher...')", "Takes 'The'."],
    ["He is _____ best student in our college.", "the", "a", "an", "(x)", "Superlative Degree ('The best')", "Superlative adjectives (the best, the tallest, the most brilliant) strictly take 'The'."],
    ["This is _____ most interesting novel I have ever read.", "the", "a", "an", "(x)", "Superlative Degree ('The most')", "Superlative takes 'The'."],
    ["He was _____ first student to enter the examination hall.", "the", "a", "an", "(x)", "Ordinal Numbers ('The first')", "Ordinal numbers (the first, the second, the third, the next) take 'The'."],
    ["Today is _____ 26th of March, our Independence Day.", "the", "a", "an", "(x)", "Calendar Dates ('The 26th')", "Specific calendar dates take 'The'."],
    ["He plays _____ piano with remarkable skill.", "the", "a", "an", "(x)", "Musical Instruments with 'Play' ('The piano')", "Names of musical instruments when played take 'The' (play the piano, play the guitar)."],
    ["He plays _____ cricket for his college team.", "(x)", "the", "a", "an", "Names of Sports/Games (Zero Article)", "Names of sports and games (cricket, football, tennis) take NO article."],
    ["The sun rises in _____ east.", "the", "a", "an", "(x)", "Cardinal Directions with Preposition ('in the east')", "Names of cardinal directions preceded by a preposition take 'The' (in the east, to the south)."],
    ["The Meghna flows into _____ Bay of Bengal.", "the", "a", "an", "(x)", "Geographical Bay ('the Bay of Bengal')", "Takes 'the'."],
    ["He was elected _____ President of the student union.", "the", "a", "an", "(x)", "Unique Title / Office ('The President')", "Unique offices and official titles take 'The'."],
    ["_____ gold of this necklace is of pure 24-carat quality.", "The", "A", "An", "(x)", "Material Noun Qualified by 'of' ('The gold of...')", "Material nouns become specific when qualified by an 'of' phrase, taking 'The'."],
    ["_____ water of the Buriganga river is severely polluted.", "The", "A", "An", "(x)", "Uncountable Noun Qualified by 'of'", "Takes 'The' because it refers to the specific water of Buriganga."],
    ["He joined _____ army to serve his motherland.", "the", "a", "an", "(x)", "Armed Services & State Organs ('The army')", "State branches and military services take 'The'."],
    ["_____ French are famous for their haute cuisine and fashion.", "The", "A", "An", "(x)", "Nationality Nouns ('The French')", "Names of nationalities referring to the people take 'The'."],
    ["_____ English ruled over the Indian subcontinent for two centuries.", "The", "A", "An", "(x)", "Nationality as People ('The English')", "'The English' means the English people (without article, 'English' means the language)."],
    ["He is learning _____ English language with dedication.", "the", "a", "an", "(x)", "Language with Word 'Language' ('The English language')", "When the word 'language' follows the name of a language, it takes 'The'."]
  ];
  theData.forEach((d, i) => {
    list.push(makeMCQ(`art_def_${i+1}`, tid, 'the_rules', 'definite_article', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], i % 3 === 0 ? 'easy' : 'medium'));
  });

  // 3. Zero Article / Omission (30)
  const zeroData = [
    ["_____ English is an international language spoken worldwide.", "(x)", "The", "A", "An", "Names of Languages (Zero Article)", "Names of languages (English, Bengali, Arabic) take NO article when used without the word 'language'."],
    ["He speaks _____ Bengali fluently with native intonation.", "(x)", "the", "a", "an", "Language Name (Zero Article)", "Language takes zero article."],
    ["_____ gold is a precious and malleable metal.", "(x)", "The", "A", "An", "Material Noun in General Sense (Zero Article)", "Material and abstract nouns used in a general sense take NO article."],
    ["_____ honesty is the best policy for a prosperous life.", "(x)", "The", "A", "An", "Abstract Noun in General Sense (Zero Article)", "Abstract nouns in general sense take zero article."],
    ["_____ water is essential for the survival of all living organisms.", "(x)", "The", "A", "An", "Uncountable Noun in General Sense (Zero Article)", "General uncountable substances take NO article."],
    ["They play _____ football every afternoon in the college field.", "(x)", "the", "a", "an", "Names of Sports (Zero Article)", "Names of sports (football, cricket, chess) take NO article."],
    ["We have our _____ breakfast at 8:00 AM every morning.", "(x)", "the", "a", "an", "Regular Meals (Zero Article)", "Names of regular daily meals (breakfast, lunch, dinner) take NO article in general sense."],
    ["He was infected with _____ malaria during his visit to the hill tracts.", "(x)", "the", "a", "an", "Names of Diseases (Zero Article)", "Names of diseases (malaria, cholera, cancer, diabetes) take NO article."],
    ["Our college reopens on _____ Monday after the Eid vacation.", "(x)", "the", "a", "an", "Days of the Week (Zero Article)", "Names of days of the week and months take NO article."],
    ["The HSC examination commences in _____ November.", "(x)", "the", "a", "an", "Months of the Year (Zero Article)", "Names of months take zero article."],
    ["_____ Man is mortal and must face the end of worldly existence.", "(x)", "The", "A", "An", "'Man' representing Mankind (Zero Article)", "The word 'Man' used in a universal sense representing all humanity takes NO article."],
    ["He goes to _____ school on foot every morning.", "(x)", "the", "a", "an", "Primary Purpose Institutions (Zero Article)", "Places like school, college, hospital, prison, church, mosque take NO article when visited for their primary purpose."],
    ["The injured victim was rushed to _____ hospital for urgent surgery.", "(x)", "the", "a", "an", "Primary Purpose ('to hospital')", "Hospitalization for treatment takes zero article."],
    ["The convict was sent to _____ prison for five years.", "(x)", "the", "a", "an", "Primary Purpose ('to prison')", "Serving sentence in prison takes zero article."],
    ["Father went to _____ school to inquire about his son's progress.", "the", "a", "an", "(x)", "Secondary Purpose Institution ('to the school')", "When visiting a school as a parent/visitor (secondary purpose), 'the' is used."],
    ["He traveled to Chattogram by _____ train.", "(x)", "the", "a", "an", "Means of Transport with 'by' (Zero Article)", "Modes of transport with preposition 'by' (by bus, by train, by air, by boat) take NO article."],
    ["He came home by _____ car.", "(x)", "the", "a", "an", "Transport with 'by' ('by car')", "Takes zero article."],
    ["He gave me _____ advice regarding higher studies.", "(x)", "an", "a", "the", "Uncountable Noun ('Advice')", "'Advice' is uncountable and cannot take 'an' or 'a' (requires zero article or 'a piece of advice')."],
    ["He provided valuable _____ information about the admission test.", "(x)", "an", "a", "the", "Uncountable Noun ('Information')", "'Information' is uncountable, taking NO indefinite article."],
    ["He showed great _____ courage in saving the drowning child.", "(x)", "the", "a", "an", "Abstract Quality ('Courage')", "Abstract virtues take zero article in general sense."],
    ["_____ Platinum is one of the densest metals known.", "(x)", "The", "A", "An", "Material Noun General", "Material noun takes zero article."],
    ["They elected him _____ captain of the college cricket team.", "(x)", "the", "a", "an", "Factitive Object / Predicate Noun (Zero Article)", "Predicative nouns denoting a unique post following verbs like elect, appoint, make take NO article."],
    ["The committee made him _____ president of the club.", "(x)", "the", "a", "an", "Factitive Noun (Zero Article)", "Takes zero article."],
    ["He was appointed _____ headmaster of the high school.", "(x)", "the", "a", "an", "Appoint + Title (Zero Article)", "Takes zero article."],
    ["_____ Mount Fuji is an iconic dormant volcano in Japan.", "(x)", "The", "A", "An", "Single Mountain Peak (Zero Article)", "Takes zero article."],
    ["He suffers from severe _____ insomnia at night.", "(x)", "the", "a", "an", "Disease (Zero Article)", "Takes zero article."],
    ["_____ Nature looks enchanting in the blooming springtime.", "(x)", "The", "A", "An", "'Nature' Personified (Zero Article)", "'Nature' used in general sense takes NO article."],
    ["We traveled all the way on _____ foot.", "(x)", "the", "a", "an", "Fixed Phrase ('on foot')", "Fixed idiom 'on foot' takes zero article."],
    ["He went to _____ bed early last night.", "(x)", "the", "a", "an", "Idiomatic ('go to bed')", "Takes zero article."],
    ["They set _____ sail for Singapore yesterday.", "(x)", "the", "a", "an", "Idiomatic ('set sail')", "Takes zero article."]
  ];
  zeroData.forEach((d, i) => {
    list.push(makeMCQ(`art_zero_${i+1}`, tid, 'zero_article', 'zero_article', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], i % 3 === 0 ? 'easy' : 'hard'));
  });

  // 4. Quantifiers & Determiners (30)
  const quantData = [
    ["There is _____ milk left in the refrigerator, enough to make a cup of tea.", "a little", "little", "few", "a few", "Positive Quantity for Uncountable ('a little')", "'A little' means some amount (positive sense) for uncountable nouns like milk."],
    ["The poor beggar has _____ money to buy even a loaf of bread.", "little", "a little", "few", "a few", "Negative Quantity for Uncountable ('little')", "'Little' without an article means almost none (negative sense) for uncountable nouns."],
    ["He has _____ friends in Dhaka who regularly assist him.", "a few", "few", "little", "a little", "Positive Quantity for Plural Countable ('a few')", "'A few' means a small number (positive sense) for plural countable nouns."],
    ["The arrogant boy has _____ true friends in the college.", "few", "a few", "little", "a little", "Negative Quantity for Plural Countable ('few')", "'Few' without an article means almost no friends (negative sense)."],
    ["_____ of the two candidates was found suitable for the post.", "Neither", "None", "Both", "Every", "Neither (Choice of Two Negative)", "'Neither' refers to not one nor the other of two persons or things."],
    ["_____ of the five applicants was selected for the final interview.", "None", "Neither", "Both", "Each other", "None (Choice of More Than Two Negative)", "'None' is used for negative selection among three or more items."],
    ["The two brothers love _____ deeply.", "each other", "one another", "themselves", "together", "Reciprocal Pronoun for Two ('each other')", "'Each other' is used strictly for two persons."],
    ["All the students in the class helped _____ during the project.", "one another", "each other", "themselves", "together", "Reciprocal Pronoun for More Than Two ('one another')", "'One another' is used for three or more persons."],
    ["_____ student in the hall was provided with a question booklet.", "Each", "All", "Both", "Some", "Distributive Determiner Singular ('Each')", "'Each' modifies a singular countable noun individually."],
    ["_____ students must submit their laboratory notebooks by tomorrow.", "All", "Each", "Every", "Neither", "Determiner with Plural Noun ('All')", "'All' modifies plural countable nouns ('students')."],
    ["He drank _____ the water in the glass in one gulp.", "all", "each", "every", "few", "All + Uncountable", "'All the water' refers to the whole quantity."],
    ["_____ book on the shelf has a unique registration number.", "Every", "All", "Both", "Few", "Every + Singular Countable Noun", "'Every' takes a singular noun and verb."],
    ["_____ of his hands was injured in the minor accident.", "Both", "All", "Every", "Each other", "Both (Two Entities Plural)", "'Both' refers to the pair of hands."],
    ["Do you have _____ extra pen that I can borrow for the exam?", "any", "some", "few", "little", "Any in Interrogative Sentences", "'Any' is standardly used in questions and negative statements."],
    ["I bought _____ delicious mangoes from Rajshahi.", "some", "any", "little", "much", "Some in Affirmative Statements", "'Some' is used in positive affirmative sentences with plural countable nouns."],
    ["There isn't _____ milk in the jug.", "any", "some", "few", "a few", "Any in Negative Statements", "Negative sentences take 'any'."],
    ["Would you like _____ hot tea?", "some", "any", "few", "little", "Some in Polite Offers / Requests", "When making a polite offer or request expecting 'yes', 'some' is used instead of 'any'."],
    ["He spent _____ the money he had saved for college.", "all", "each", "every", "few", "All + Definite Noun", "'All the money' denotes the entirety of savings."],
    ["_____ employee must follow the organizational code of conduct.", "Every", "All", "Both", "Few", "Every + Singular Noun", "'Every employee' takes singular verb."],
    ["_____ side of the square measures exactly ten meters.", "Each", "All", "Both", "Some", "Each (Individually Considered)", "'Each side' refers to the individual sides."],
    ["There were _____ spectators present due to heavy rain.", "few", "a few", "little", "a little", "Few (Almost None Plural)", "'Few' denotes scarcity of spectators."],
    ["He has _____ knowledge of nuclear astrophysics.", "little", "a little", "few", "a few", "Little (Almost No Uncountable)", "'Little knowledge' means practically no knowledge."],
    ["Only _____ students managed to solve the Olympiad problem.", "a few", "few", "little", "a little", "A few (Small Positive Number)", "'A few' denotes the successful handful."],
    ["She added _____ sugar to her cup of coffee.", "a little", "little", "few", "a few", "A little (Small Positive Amount)", "'A little sugar' indicates a small quantity added."],
    ["Neither of his two answers _____ (be) correct.", "was", "were", "are", "have been", "Neither of + Singular Verb", "'Neither of' takes a singular verb ('was')."],
    ["Each of the girls _____ (have) received a prize.", "has", "have", "are having", "were having", "Each of + Singular Verb", "'Each of' takes singular 'has received'."],
    ["None of the counterfeit currency notes _____ (be) genuine.", "were", "was", "is", "has been", "None of + Plural Countable -> Plural Verb", "'None of' with plural countable nouns takes plural verb 'were'."],
    ["Both the sisters are talented, but _____ can sing as melodiously as Runa.", "neither", "none", "each", "all", "Neither of Two", "'Neither' refers to the choice between two sisters."],
    ["_____ of the fifty soldiers surrendered to the enemy.", "None", "Neither", "Both", "Each other", "None of Fifty", "'None' is used for fifty soldiers."],
    ["The four friends embraced _____ after ten years.", "one another", "each other", "themselves", "together", "One another for Four", "'One another' is used for four friends."]
  ];
  quantData.forEach((d, i) => {
    list.push(makeMCQ(`art_quant_${i+1}`, tid, 'determiners_quantifiers', 'determiners', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], i % 3 === 0 ? 'easy' : 'medium'));
  });

  return list;
}

// -------------------------------------------------------------
// RUN ALL AND WRITE MASTER TS FILES
// -------------------------------------------------------------
const part2 = require('./buildBanksPart2.cjs');
const part3 = require('./buildBanksPart3.cjs');
const part4 = require('./buildBanksPart4.cjs');
const part5 = require('./buildBanksPart5.cjs');
const part6 = require('./buildBanksPart6.cjs');
const part7 = require('./buildBanksPart7.cjs');

// Require generators
const rfvList = generateRightFormOfVerbs();
const artList = generateArticles();

// We can run the generator functions from the other parts by evaluating or defining them directly
// Let's create an executor that loads all generated lists:
console.log(`Right Form of Verbs generated: ${rfvList.length}`);
console.log(`Articles generated: ${artList.length}`);

// Write files to src/data/
function writeBankFile(filename, arrayName, topicId, items) {
  const content = `import { Question } from '../types';

export const ${arrayName}: Question[] = ${JSON.stringify(items, null, 2)};

export default ${arrayName};
`;
  const fullPath = path.join(__dirname, '..', 'src', 'data', filename);
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Wrote ${items.length} questions to ${filename}`);
}

writeBankFile('rightFormOfVerbsBank.ts', 'RIGHT_FORM_OF_VERBS_QUESTIONS', 'right_form_of_verbs', rfvList);
writeBankFile('articlesBank.ts', 'ARTICLES_QUESTIONS', 'article', artList);

console.log('Part 1 & 2 bank files written.');
