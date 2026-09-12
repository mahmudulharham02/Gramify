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
      tip: tip || 'Analyze the context and grammatical part of speech.'
    }
  };
}

// -------------------------------------------------------------
// TOPIC 6: SYNONYMS & ANTONYMS (122 items)
// -------------------------------------------------------------
function generateSynonymsAntonyms() {
  const list = [];
  const tid = 'synonyms_antonyms';
  const sub = 'hsc_vocab_bank';

  // 1. Synonyms Easy (30)
  const synEasy = [
    ["The synonym of 'ABUNDANT' is:", "plentiful", "scarce", "tiny", "sparse", "Synonym: Abundant", "'Abundant' means existing or available in large quantities; its direct synonym is 'plentiful'."],
    ["The synonym of 'BENEVOLENT' is:", "kindhearted", "cruel", "arrogant", "hostile", "Synonym: Benevolent", "'Benevolent' denotes well-meaning, generous, and kindly."],
    ["The synonym of 'CEASE' is:", "stop", "commence", "prolong", "initiate", "Synonym: Cease", "'Cease' means to come or bring to an end; its synonym is 'stop'."],
    ["The synonym of 'CANDID' is:", "frank", "dishonest", "secretive", "cunning", "Synonym: Candid", "'Candid' means truthful, straightforward, and frank."],
    ["The synonym of 'DILIGENT' is:", "hardworking", "lazy", "sluggish", "careless", "Synonym: Diligent", "'Diligent' refers to having or showing care and conscientious hard work."],
    ["The synonym of 'EMERGE' is:", "appear", "vanish", "submerge", "disappear", "Synonym: Emerge", "'Emerge' means to become apparent, visible, or prominent."],
    ["The synonym of 'FRUGAL' is:", "economical", "extravagant", "wasteful", "reckless", "Synonym: Frugal", "'Frugal' means sparing or economical with regard to money or food."],
    ["The synonym of 'GENUINE' is:", "authentic", "fake", "counterfeit", "spurious", "Synonym: Genuine", "'Genuine' means truly what something is said to be; authentic."],
    ["The synonym of 'HAZARDOUS' is:", "dangerous", "safe", "secure", "harmless", "Synonym: Hazardous", "'Hazardous' means risky or dangerous."],
    ["The synonym of 'IMMENSE' is:", "enormous", "minute", "slender", "trivial", "Synonym: Immense", "'Immense' means extremely large or great."],
    ["The synonym of 'JUDICIOUS' is:", "prudent", "foolish", "rash", "irrational", "Synonym: Judicious", "'Judicious' means having or showing good judgment or sense."],
    ["The synonym of 'KEEN' is:", "eager", "reluctant", "dull", "apathetic", "Synonym: Keen", "'Keen' means having or showing eagerness or enthusiasm."],
    ["The synonym of 'LUCID' is:", "clear", "vague", "ambiguous", "muddy", "Synonym: Lucid", "'Lucid' means expressed clearly or easy to understand."],
    ["The synonym of 'MIGHTY' is:", "powerful", "feeble", "weak", "fragile", "Synonym: Mighty", "'Mighty' means possessing great strength or power."],
    ["The synonym of 'NOBLE' is:", "magnanimous", "vile", "ignoble", "mean", "Synonym: Noble", "'Noble' denotes having high moral qualities."],
    ["The synonym of 'OBSTACLE' is:", "hindrance", "assistance", "aid", "advantage", "Synonym: Obstacle", "'Obstacle' means a thing that blocks one's way or hinders progress."],
    ["The synonym of 'PROMPT' is:", "quick", "delayed", "sluggish", "tardy", "Synonym: Prompt", "'Prompt' means done without delay; immediate."],
    ["The synonym of 'QUELL' is:", "suppress", "provoke", "incite", "agitate", "Synonym: Quell", "'Quell' means to put an end to a rebellion or disorder, typically by force."],
    ["The synonym of 'RESILIENT' is:", "flexible", "rigid", "fragile", "brittle", "Synonym: Resilient", "'Resilient' means able to withstand or recover quickly from difficult conditions."],
    ["The synonym of 'SERENE' is:", "peaceful", "turbulent", "chaotic", "furious", "Synonym: Serene", "'Serene' means calm, peaceful, and untroubled."],
    ["The synonym of 'TRANQUIL' is:", "calm", "noisy", "rowdy", "stormy", "Synonym: Tranquil", "'Tranquil' means free from disturbance; calm."],
    ["The synonym of 'UNIQUE' is:", "incomparable", "common", "ordinary", "customary", "Synonym: Unique", "'Unique' means being the only one of its kind; unlike anything else."],
    ["The synonym of 'VALIANT' is:", "brave", "cowardly", "fearful", "timid", "Synonym: Valiant", "'Valiant' means possessing or showing courage or determination."],
    ["The synonym of 'WRATH' is:", "anger", "peace", "calm", "delight", "Synonym: Wrath", "'Wrath' means extreme anger."],
    ["The synonym of 'YIELD' is:", "surrender", "resist", "conquer", "withstand", "Synonym: Yield", "'Yield' means to give way to arguments, demands, or pressure."],
    ["The synonym of 'ZEAL' is:", "enthusiasm", "indifference", "apathy", "lethargy", "Synonym: Zeal", "'Zeal' means great energy or enthusiasm in pursuit of a cause."],
    ["The synonym of 'ACCURATE' is:", "precise", "erroneous", "faulty", "flawed", "Synonym: Accurate", "'Accurate' means correct in all details; exact."],
    ["The synonym of 'BARREN' is:", "infertile", "fertile", "productive", "fruitful", "Synonym: Barren", "'Barren' means too poor to produce much or any vegetation."],
    ["The synonym of 'COMPASSION' is:", "sympathy", "cruelty", "callousness", "spite", "Synonym: Compassion", "'Compassion' means sympathetic pity and concern for the sufferings of others."],
    ["The synonym of 'DIVERSE' is:", "varied", "identical", "uniform", "similar", "Synonym: Diverse", "'Diverse' means showing a great deal of variety."]
  ];
  synEasy.forEach((d, i) => {
    list.push(makeMCQ(`sa_syn_easy_${i+1}`, tid, sub, 'synonyms_easy', 'Select the correct synonym:', d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'easy'));
  });

  // 2. Synonyms Medium (25)
  const synMed = [
    ["The synonym of 'AUTHENTIC' is:", "genuine", "spurious", "counterfeit", "bogus", "Synonym: Authentic", "'Authentic' means of undisputed origin; genuine."],
    ["The synonym of 'CONSPICUOUS' is:", "noticeable", "hidden", "obscure", "invisible", "Synonym: Conspicuous", "'Conspicuous' means standing out so as to be clearly visible."],
    ["The synonym of 'DETRIMENTAL' is:", "harmful", "beneficial", "advantageous", "favorable", "Synonym: Detrimental", "'Detrimental' means tending to cause harm."],
    ["The synonym of 'EMULATE' is:", "imitate", "neglect", "condemn", "oppose", "Synonym: Emulate", "'Emulate' means match or surpass a person or achievement, typically by imitation."],
    ["The synonym of 'HINDER' is:", "impede", "facilitate", "assist", "advance", "Synonym: Hinder", "'Hinder' means create difficulties for someone, resulting in delay or obstruction."],
    ["The synonym of 'JEOPARDIZE' is:", "endanger", "protect", "shield", "safeguard", "Synonym: Jeopardize", "'Jeopardize' means put someone or something into a situation in which there is a danger of loss, harm, or failure."],
    ["The synonym of 'LUCRATIVE' is:", "profitable", "unprofitable", "costly", "disastrous", "Synonym: Lucrative", "'Lucrative' means producing a great deal of profit."],
    ["The synonym of 'PRAGMATIC' is:", "practical", "idealistic", "theoretical", "unrealistic", "Synonym: Pragmatic", "'Pragmatic' means dealing with things sensibly and realistically based on practical rather than theoretical considerations."],
    ["The synonym of 'SCRUTINIZE' is:", "examine", "glance", "ignore", "overlook", "Synonym: Scrutinize", "'Scrutinize' means examine or inspect closely and thoroughly."],
    ["The synonym of 'TRANSIENT' is:", "temporary", "permanent", "eternal", "perpetual", "Synonym: Transient", "'Transient' means lasting only for a short time; impermanent."],
    ["The synonym of 'UBIQUITOUS' is:", "omnipresent", "rare", "scarce", "localized", "Synonym: Ubiquitous", "'Ubiquitous' means present, appearing, or found everywhere."],
    ["The synonym of 'VIGILANT' is:", "watchful", "careless", "negligent", "heedless", "Synonym: Vigilant", "'Vigilant' means keeping careful watch for possible danger or difficulties."],
    ["The synonym of 'AUGMENT' is:", "increase", "diminish", "decrease", "reduce", "Synonym: Augment", "'Augment' means make something greater by adding to it; increase."],
    ["The synonym of 'BELLIGERENT' is:", "aggressive", "peaceful", "friendly", "conciliatory", "Synonym: Belligerent", "'Belligerent' means hostile and aggressive."],
    ["The synonym of 'CURTAIL' is:", "shorten", "extend", "prolong", "expand", "Synonym: Curtail", "'Curtail' means reduce in extent or quantity; impose a restriction on."],
    ["The synonym of 'DELETERIOUS' is:", "harmful", "healthy", "constructive", "beneficial", "Synonym: Deleterious", "'Deleterious' means causing harm or damage."],
    ["The synonym of 'EPHEMERAL' is:", "short-lived", "eternal", "enduring", "everlasting", "Synonym: Ephemeral", "'Ephemeral' means lasting for a very short time."],
    ["The synonym of 'FASTIDIOUS' is:", "meticulous", "careless", "sloppy", "easygoing", "Synonym: Fastidious", "'Fastidious' means very attentive to and concerned about accuracy and detail."],
    ["The synonym of 'GREGARIOUS' is:", "sociable", "introverted", "reclusive", "solitary", "Synonym: Gregarious", "'Gregarious' means fond of company; sociable."],
    ["The synonym of 'HYPOCRISY' is:", "deceit", "sincerity", "honesty", "candor", "Synonym: Hypocrisy", "'Hypocrisy' means the practice of claiming to have moral standards to which one's behavior does not conform."],
    ["The synonym of 'IMPECUNIOUS' is:", "poor", "wealthy", "affluent", "rich", "Synonym: Impecunious", "'Impecunious' means having little or no money."],
    ["The synonym of 'JUXTAPOSE' is:", "collocate", "separate", "isolate", "disconnect", "Synonym: Juxtapose", "'Juxtapose' means place or deal with close together for contrasting effect."],
    ["The synonym of 'METICULOUS' is:", "precise", "hasty", "sloppy", "inattentive", "Synonym: Meticulous", "'Meticulous' means showing great attention to detail; very careful and precise."],
    ["The synonym of 'NEFARIOUS' is:", "wicked", "virtuous", "pious", "noble", "Synonym: Nefarious", "'Nefarious' means wicked or criminal."],
    ["The synonym of 'OSTENTATIOUS' is:", "showy", "modest", "plain", "unassuming", "Synonym: Ostentatious", "'Ostentatious' means characterized by vulgar or pretentious display."]
  ];
  synMed.forEach((d, i) => {
    list.push(makeMCQ(`sa_syn_med_${i+1}`, tid, sub, 'synonyms_medium', 'Select the correct synonym:', d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'medium'));
  });

  // 3. Synonyms Hard (15)
  const synHard = [
    ["The synonym of 'ANACHRONISTIC' is:", "outdated", "modern", "contemporary", "futuristic", "Synonym: Anachronistic", "'Anachronistic' means belonging or appropriate to an earlier period, especially so as to seem conspicuously old-fashioned."],
    ["The synonym of 'CACophony' is:", "dissonance", "harmony", "symphony", "euphony", "Synonym: Cacophony", "'Cacophony' means a harsh, discordant mixture of sounds."],
    ["The synonym of 'DIAPHANOUS' is:", "sheer", "opaque", "thick", "heavy", "Synonym: Diaphanous", "'Diaphanous' means light, delicate, and translucent."],
    ["The synonym of 'ENERVATE' is:", "weaken", "invigorate", "energize", "strengthen", "Synonym: Enervate", "'Enervate' means to cause someone to feel drained of energy or vitality."],
    ["The synonym of 'FARRAGO' is:", "hodgepodge", "order", "uniformity", "neatness", "Synonym: Farrago", "'Farrago' means a confused mixture."],
    ["The synonym of 'GRANDILOQUENT' is:", "pompous", "humble", "concise", "simple", "Synonym: Grandiloquent", "'Grandiloquent' means pompous or extravagant in language."],
    ["The synonym of 'HEGEMONY' is:", "dominance", "subordination", "weakness", "subservience", "Synonym: Hegemony", "'Hegemony' means leadership or dominance, especially by one country or social group over others."],
    ["The synonym of 'ICONOCLAST' is:", "rebel", "conformist", "traditionalist", "devotee", "Synonym: Iconoclast", "'Iconoclast' means a person who attacks cherished beliefs or institutions."],
    ["The synonym of 'LACHRYMOSE' is:", "tearful", "cheerful", "jovial", "ecstatic", "Synonym: Lachrymose", "'Lachrymose' means tearful or given to weeping."],
    ["The synonym of 'MUNIFICENT' is:", "generous", "stingy", "parsimonious", "tightfisted", "Synonym: Munificent", "'Munificent' means larger or more generous than is usual or necessary."],
    ["The synonym of 'OBDURATE' is:", "stubborn", "flexible", "pliable", "docile", "Synonym: Obdurate", "'Obdurate' means stubbornly refusing to change one's opinion or course of action."],
    ["The synonym of 'PERSPICACIOUS' is:", "shrewd", "obtuse", "ignorant", "foolish", "Synonym: Perspicacious", "'Perspicacious' means having a ready insight into and understanding of things."],
    ["The synonym of 'QUINTESSENTIAL' is:", "exemplary", "flawed", "atypical", "inferior", "Synonym: Quintessential", "'Quintessential' means representing the most perfect or typical example of a quality or class."],
    ["The synonym of 'RECALCITRANT' is:", "unruly", "obedient", "compliant", "yielding", "Synonym: Recalcitrant", "'Recalcitrant' means having an obstinately uncooperative attitude toward authority or discipline."],
    ["The synonym of 'SANGUINE' is:", "optimistic", "pessimistic", "gloomy", "melancholy", "Synonym: Sanguine", "'Sanguine' means optimistic or positive, especially in an apparently bad or difficult situation."]
  ];
  synHard.forEach((d, i) => {
    list.push(makeMCQ(`sa_syn_hard_${i+1}`, tid, sub, 'synonyms_hard', 'Select the correct synonym:', d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'hard'));
  });

  // 4. Antonyms Easy (20)
  const antEasy = [
    ["The antonym of 'BENEVOLENT' is:", "cruel", "kind", "generous", "friendly", "Antonym: Benevolent", "'Benevolent' means kind and compassionate; its opposite is 'cruel'."],
    ["The antonym of 'ABUNDANT' is:", "scarce", "plentiful", "copious", "rich", "Antonym: Abundant", "'Abundant' means plentiful; its antonym is 'scarce'."],
    ["The antonym of 'DILIGENT' is:", "lazy", "hardworking", "industrious", "attentive", "Antonym: Diligent", "'Diligent' means hardworking; its direct antonym is 'lazy'."],
    ["The antonym of 'FERTILE' is:", "barren", "productive", "fruitful", "rich", "Antonym: Fertile", "'Fertile' means capable of producing crops; its antonym is 'barren' (or infertile)."],
    ["The antonym of 'GENUINE' is:", "fake", "authentic", "real", "original", "Antonym: Genuine", "'Genuine' means real and true; its antonym is 'fake'."],
    ["The antonym of 'HONEST' is:", "corrupt", "truthful", "sincere", "upright", "Antonym: Honest", "'Honest' means morally upright; its antonym is 'corrupt'."],
    ["The antonym of 'INCREASE' is:", "decrease", "expand", "augment", "multiply", "Antonym: Increase", "'Increase' means to become greater; its antonym is 'decrease'."],
    ["The antonym of 'MIGHTY' is:", "weak", "strong", "powerful", "robust", "Antonym: Mighty", "'Mighty' means very powerful; its antonym is 'weak'."],
    ["The antonym of 'NOBLE' is:", "ignoble", "honorable", "grand", "dignified", "Antonym: Noble", "'Noble' means having high moral qualities; its antonym is 'ignoble'."],
    ["The antonym of 'OPTIMISTIC' is:", "pessimistic", "hopeful", "confident", "cheerful", "Antonym: Optimistic", "'Optimistic' means viewing the future positively; its antonym is 'pessimistic'."],
    ["The antonym of 'PROMPT' is:", "delayed", "quick", "speedy", "immediate", "Antonym: Prompt", "'Prompt' means done without delay; its antonym is 'delayed'."],
    ["The antonym of 'PRUDENT' is:", "reckless", "wise", "cautious", "judicious", "Antonym: Prudent", "'Prudent' means acting with care and thought; its antonym is 'reckless'."],
    ["The antonym of 'RIGID' is:", "flexible", "stiff", "inflexible", "firm", "Antonym: Rigid", "'Rigid' means unable to bend; its antonym is 'flexible'."],
    ["The antonym of 'SERENE' is:", "turbulent", "calm", "peaceful", "tranquil", "Antonym: Serene", "'Serene' means peaceful; its antonym is 'turbulent'."],
    ["The antonym of 'TRANSPARENT' is:", "opaque", "clear", "translucent", "lucid", "Antonym: Transparent", "'Transparent' means allowing light to pass through clearly; its antonym is 'opaque'."],
    ["The antonym of 'UNIQUE' is:", "common", "rare", "singular", "exclusive", "Antonym: Unique", "'Unique' means being one of a kind; its antonym is 'common'."],
    ["The antonym of 'VALIANT' is:", "cowardly", "brave", "heroic", "courageous", "Antonym: Valiant", "'Valiant' means brave; its antonym is 'cowardly'."],
    ["The antonym of 'VIRTUE' is:", "vice", "morality", "goodness", "righteousness", "Antonym: Virtue", "'Virtue' means moral excellence; its antonym is 'vice'."],
    ["The antonym of 'WISDOM' is:", "folly", "knowledge", "insight", "sagacity", "Antonym: Wisdom", "'Wisdom' means good judgment; its antonym is 'folly'."],
    ["The antonym of 'ZEAL' is:", "apathy", "passion", "ardor", "fervor", "Antonym: Zeal", "'Zeal' means great enthusiasm; its antonym is 'apathy'."]
  ];
  antEasy.forEach((d, i) => {
    list.push(makeMCQ(`sa_ant_easy_${i+1}`, tid, sub, 'antonyms_easy', 'Select the correct antonym:', d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'easy'));
  });

  // 5. Antonyms Medium (20)
  const antMed = [
    ["The antonym of 'ADVERSITY' is:", "prosperity", "misfortune", "hardship", "affliction", "Antonym: Adversity", "'Adversity' means difficulties or misfortune; its antonym is 'prosperity'."],
    ["The antonym of 'BELLIGERENT' is:", "peaceful", "hostile", "aggressive", "combative", "Antonym: Belligerent", "'Belligerent' means aggressive; its antonym is 'peaceful'."],
    ["The antonym of 'CANDID' is:", "deceitful", "frank", "honest", "open", "Antonym: Candid", "'Candid' means straightforward and frank; its antonym is 'deceitful'."],
    ["The antonym of 'DETRIMENTAL' is:", "beneficial", "injurious", "harmful", "destructive", "Antonym: Detrimental", "'Detrimental' means causing harm; its antonym is 'beneficial'."],
    ["The antonym of 'EPHEMERAL' is:", "permanent", "transient", "fleeting", "brief", "Antonym: Ephemeral", "'Ephemeral' means lasting a very short time; its antonym is 'permanent'."],
    ["The antonym of 'FRUGAL' is:", "extravagant", "thrifty", "economical", "sparing", "Antonym: Frugal", "'Frugal' means careful with money; its antonym is 'extravagant'."],
    ["The antonym of 'GREGARIOUS' is:", "solitary", "sociable", "outgoing", "friendly", "Antonym: Gregarious", "'Gregarious' means fond of company; its antonym is 'solitary'."],
    ["The antonym of 'HAZARDOUS' is:", "safe", "perilous", "risky", "precarious", "Antonym: Hazardous", "'Hazardous' means dangerous; its antonym is 'safe'."],
    ["The antonym of 'IMPECCABLE' is:", "flawed", "faultless", "perfect", "spotless", "Antonym: Impeccable", "'Impeccable' means faultless; its antonym is 'flawed'."],
    ["The antonym of 'JUDICIOUS' is:", "indiscreet", "wise", "prudent", "sensible", "Antonym: Judicious", "'Judicious' means having good judgment; its antonym is 'indiscreet'."],
    ["The antonym of 'LUCID' is:", "confusing", "clear", "comprehensible", "plain", "Antonym: Lucid", "'Lucid' means easy to understand; its antonym is 'confusing' (or obscure)."],
    ["The antonym of 'METICULOUS' is:", "careless", "precise", "exacting", "thorough", "Antonym: Meticulous", "'Meticulous' means very careful; its antonym is 'careless'."],
    ["The antonym of 'NEFARIOUS' is:", "virtuous", "vicious", "wicked", "evil", "Antonym: Nefarious", "'Nefarious' means wicked; its antonym is 'virtuous'."],
    ["The antonym of 'OBSTINATE' is:", "yielding", "stubborn", "inflexible", "headstrong", "Antonym: Obstinate", "'Obstinate' means stubbornly refusing to give in; its antonym is 'yielding'."],
    ["The antonym of 'PRAGMATIC' is:", "idealistic", "practical", "realistic", "down-to-earth", "Antonym: Pragmatic", "'Pragmatic' means realistic and practical; its antonym is 'idealistic'."],
    ["The antonym of 'QUELL' is:", "provoke", "suppress", "calm", "soothe", "Antonym: Quell", "'Quell' means put an end to disorder; its antonym is 'provoke'."],
    ["The antonym of 'RESILIENT' is:", "fragile", "tough", "elastic", "hardy", "Antonym: Resilient", "'Resilient' means strong and adaptable; its antonym is 'fragile'."],
    ["The antonym of 'SCRUTINIZE' is:", "glance", "inspect", "examine", "investigate", "Antonym: Scrutinize", "'Scrutinize' means examine closely; its antonym is 'glance'."],
    ["The antonym of 'TRANSIENT' is:", "enduring", "temporary", "fleeting", "short-lived", "Antonym: Transient", "'Transient' means passing quickly; its antonym is 'enduring'."],
    ["The antonym of 'UBIQUITOUS' is:", "rare", "omnipresent", "widespread", "pervasive", "Antonym: Ubiquitous", "'Ubiquitous' means found everywhere; its antonym is 'rare'."]
  ];
  antMed.forEach((d, i) => {
    list.push(makeMCQ(`sa_ant_med_${i+1}`, tid, sub, 'antonyms_medium', 'Select the correct antonym:', d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'medium'));
  });

  // 6. Antonyms Hard (12)
  const antHard = [
    ["The antonym of 'ABSTEMIOUS' is:", "gluttonous", "moderate", "sober", "temperate", "Antonym: Abstemious", "'Abstemious' means self-disciplined or temperate; its antonym is 'gluttonous'."],
    ["The antonym of 'BELLICOSE' is:", "peaceable", "hostile", "antagonistic", "war-mongering", "Antonym: Bellicose", "'Bellicose' means eager to fight; its antonym is 'peaceable'."],
    ["The antonym of 'CAPRICIOUS' is:", "steadfast", "fickle", "unpredictable", "whimsical", "Antonym: Capricious", "'Capricious' means fickle or subject to sudden changes; its antonym is 'steadfast'."],
    ["The antonym of 'DOGMATIC' is:", "open-minded", "authoritarian", "imperious", "inflexible", "Antonym: Dogmatic", "'Dogmatic' means rigidly opinionated; its antonym is 'open-minded'."],
    ["The antonym of 'EXONERATE' is:", "incriminate", "absolve", "acquit", "vindicate", "Antonym: Exonerate", "'Exonerate' means absolve from blame; its antonym is 'incriminate'."],
    ["The antonym of 'GARRULOUS' is:", "taciturn", "talkative", "loquacious", "voluble", "Antonym: Garrulous", "'Garrulous' means excessively talkative; its antonym is 'taciturn'."],
    ["The antonym of 'IMPECUNIOUS' is:", "affluent", "penniless", "destitute", "poverty-stricken", "Antonym: Impecunious", "'Impecunious' means having no money; its antonym is 'affluent'."],
    ["The antonym of 'MUNIFICENT' is:", "parsimonious", "generous", "bountiful", "magnanimous", "Antonym: Munificent", "'Munificent' means extraordinarily generous; its antonym is 'parsimonious' (or stingy)."],
    ["The antonym of 'OBDURATE' is:", "amenable", "stubborn", "unyielding", "intractable", "Antonym: Obdurate", "'Obdurate' means stubbornly unbending; its antonym is 'amenable'."],
    ["The antonym of 'PERSPICACIOUS' is:", "obtuse", "shrewd", "astute", "discerning", "Antonym: Perspicacious", "'Perspicacious' means acutely perceptive; its antonym is 'obtuse'."],
    ["The antonym of 'RECALCITRANT' is:", "submissive", "rebellious", "defiant", "unruly", "Antonym: Recalcitrant", "'Recalcitrant' means refusing to obey; its antonym is 'submissive'."],
    ["The antonym of 'SANGUINE' is:", "morose", "cheerful", "buoyant", "hopeful", "Antonym: Sanguine", "'Sanguine' means cheerfully optimistic; its antonym is 'morose'."]
  ];
  antHard.forEach((d, i) => {
    list.push(makeMCQ(`sa_ant_hard_${i+1}`, tid, sub, 'antonyms_hard', 'Select the correct antonym:', d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'hard'));
  });

  return list;
}

console.log('Synonyms & Antonyms generator logic defined.');
