import { TopicInfo } from '../types';

export const TOPICS_DATA: TopicInfo[] = [
  {
    id: 'right_form_of_verbs',
    number: 1,
    title: 'Right Form of Verbs',
    bengaliTitle: 'ভার্ব এর সঠিক রূপ (Right Form of Verbs)',
    marks: 7,
    icon: '⚡',
    accentColor: '#22d3ee',
    description: 'Master all 12 tenses, Subject-Verb agreement, modal auxiliaries, conditionals, and non-finite verbs according to HSC Board patterns.',
    subtopics: [
      {
        id: 'tenses_and_agreement',
        title: 'Tenses & Subject-Verb Agreement',
        bengaliTitle: 'টেন্স ও সাবজেক্ট-ভার্ব এগ্রিমেন্ট',
        description: 'Singular/plural agreement, collective nouns, neither/either, each/every, as well as, along with.',
        rulesSummary: [
          'Singular subject takes singular verb (V1 + s/es or is/was/has).',
          'Words connected by "as well as", "with", "along with", "together with", "accompanied by" follow the FIRST subject.',
          'With "either...or" / "neither...nor" / "not only...but also", the verb agrees with the NEAREST subject.',
          'Every / Each / One of / Many a + Singular Noun takes a Singular Verb.',
        ]
      },
      {
        id: 'modals_and_bare_infinitives',
        title: 'Modals & Special Verb Forms',
        bengaliTitle: 'মডাল অক্সিলিয়ারি ও বিশেষ রূপ',
        description: 'Had better, would rather, used to, let, make, cannot help, with a view to, look forward to.',
        rulesSummary: [
          'After can/could/may/might/shall/should/will/would/must/ought to/had better/would rather/let/make -> Base form (V1).',
          'After "with a view to", "look forward to", "get used to", "be accustomed to", "cannot help", "worth" -> Verb + ing.',
          'Having / getting / being + V3 (Past Participle).',
          'It is high time / It is time + Subject -> V2 (Past Form).'
        ]
      }
    ]
  },
  {
    id: 'articles',
    number: 2,
    title: 'Articles (A / An / The / Zero)',
    bengaliTitle: 'আর্টিকেল (A, An, The ও Zero Article)',
    marks: 5,
    icon: '🎯',
    accentColor: '#38bdf8',
    description: 'Definite & Indefinite articles, vowel-sound vs consonant-sound rules, geographical names, and omission of articles (cross [x]).',
    subtopics: [
      {
        id: 'indefinite_articles',
        title: 'Indefinite Articles (A / An)',
        description: 'Sound-based phonetic distinction: a European, a university, an honest man, an hour, a one-taka note.',
        rulesSummary: [
          'Use "an" before vowel sounds (a, e, i, o, u) and silent "h" (an honest, an hour, an heir).',
          'Use "a" before vowel letters sounding like "you" or "wa" (a university, a European, a unique, a one-eyed man).',
          'Abbreviations pronounced with initial vowel sounds take "an" (an MA, an MBBS, an MP, an HSC examinee).'
        ]
      },
      {
        id: 'definite_and_zero',
        title: 'Definite Article (The) & Zero Article (x)',
        description: 'Unique objects, superlatives, ordinals, musical instruments, rivers/seas vs zero articles before proper nouns and abstract concepts.',
        rulesSummary: [
          'Use "the" for specific nouns, unique cosmic entities (the sun, the moon), superlatives (the best), ordinals (the first).',
          'Use "the" before names of rivers, seas, oceans, mountain ranges, famous books, newspapers.',
          'Use Zero Article (x) before proper nouns, sports names, languages (unless followed by "language"), abstract nouns in general sense.'
        ]
      }
    ]
  },
  {
    id: 'preposition',
    number: 3,
    title: 'Prepositions & Appropriate Prepositions',
    bengaliTitle: 'উপযুক্ত প্রিপজিশন (Appropriate Prepositions)',
    marks: 7,
    icon: '📍',
    accentColor: '#818cf8',
    description: 'Master time/place/direction prepositions and 150+ high-frequency HSC board appropriate prepositions.',
    subtopics: [
      {
        id: 'appropriate_prep',
        title: 'High-Frequency Board Prepositions',
        description: 'Abide by, agree with/to, fond of, good at, senior to, look into, abstain from, adhere to, proud of, deprived of.',
        rulesSummary: [
          'Agree with (a person) / Agree to (a proposal) / Agree on (a point).',
          'Die of (disease) / Die from (overeating/wound) / Die for (a noble cause) / Die by (poison/violence).',
          'Senior / Junior / Superior / Inferior / Preferable take "TO" (not than).',
          'Abstain / Refrain / Prevent / Desist take "FROM" + V-ing.'
        ]
      },
      {
        id: 'time_place_direction',
        title: 'Prepositions of Time & Location',
        description: 'In vs At (small vs big place/time), Between vs Among, Since vs For (point vs period of time).',
        rulesSummary: [
          'At + specific time (at 5 PM, at night) / On + day/date (on Sunday, on 21st February) / In + month/year/season/century.',
          'Since + point of time (since morning, since 1971) / For + duration/period of time (for five years).',
          'Between for two entities / Among for more than two entities.'
        ]
      }
    ]
  },
  {
    id: 'completing_sentences',
    number: 4,
    title: 'Completing Sentences (Clauses & Phrases)',
    bengaliTitle: 'বাক্য সম্পূর্ণকরণ (Completing Sentences)',
    marks: 7,
    icon: '🧩',
    accentColor: '#a78bfa',
    description: 'Complete conditional sentences, so...that, lest, as if/as though, no sooner had...than, hardly had...when, in order that.',
    subtopics: [
      {
        id: 'connective_structures',
        title: 'Special Connective Rules',
        description: 'So...that, Too...to, In order that, Lest, As if / As though, It is high time.',
        rulesSummary: [
          'Too + Adj + to + V1 (Negative sense: The load is too heavy for him to carry).',
          'So + Adj + that + Subject + cannot/could not + V1.',
          'Lest + Subject + should/might + V1 (no "not" allowed).',
          'As if / As though: Present -> Past (V2 / were) | Past -> Past Perfect (had + V3).'
        ]
      },
      {
        id: 'conditionals_and_inversions',
        title: 'Conditionals & Correlative Inversions',
        description: '1st, 2nd, 3rd Conditionals, No sooner had...than, Scarcely had...when, Had I seen.',
        rulesSummary: [
          '1st Conditional: If + Present, Subject + will/can/may + V1.',
          '2nd Conditional: If + Past, Subject + would/could/might + V1.',
          '3rd Conditional: If + Past Perfect, Subject + would have + V3.',
          'No sooner had + S + V3... than + S + V2 (Past Simple).'
        ]
      }
    ]
  },
  {
    id: 'connectors',
    number: 5,
    title: 'Sentence Connectors & Linkers',
    bengaliTitle: 'সেন্টেন্স কানেক্টরস ও লিঙ্কার্স (Connectors)',
    marks: 7,
    icon: '🔗',
    accentColor: '#c084fc',
    description: 'Addition, contrast, cause & effect, consequence, illustration, and sequence linkers in board passages.',
    subtopics: [
      {
        id: 'contrast_and_addition',
        title: 'Contrast & Addition Linkers',
        description: 'Moreover, furthermore, on the other hand, however, nevertheless, despite, in addition, not only...but also.',
        rulesSummary: [
          'Addition: Moreover, Furthermore, In addition, Besides, Also, What is more.',
          'Contrast: However, On the contrary, On the other hand, Nevertheless, Although, Whereas.',
          'Result/Consequence: Therefore, Consequently, As a result, Hence, Thus, So.'
        ]
      }
    ]
  },
  {
    id: 'synonyms_antonyms',
    number: 6,
    title: 'Synonyms & Antonyms',
    bengaliTitle: 'সমার্থক ও বিপরীতার্থক শব্দ (Synonyms & Antonyms)',
    marks: 7,
    icon: '📖',
    accentColor: '#f472b6',
    description: 'HSC core vocabulary bank: formal synonyms, antonym prefixes (un-, in-, dis-, mis-), context-based board vocabulary.',
    subtopics: [
      {
        id: 'hsc_vocab_bank',
        title: 'Core Board Vocabulary & Contextual Meaning',
        description: 'Authentic, benevolent, conspicuous, detrimental, emulate, frugal, hinder, jeopardize, lucrative, pragmatic, resilient.',
        rulesSummary: [
          'Identify parts of speech first: A verb requires a verb synonym, an adjective requires an adjective synonym.',
          'Watch out for subtle connotations (e.g. "childlike" vs "childish", "famous" vs "notorious").'
        ]
      }
    ]
  },
  {
    id: 'punctuation',
    number: 7,
    title: 'Punctuation & Capitalization',
    bengaliTitle: 'যতিচিহ্ন ও ক্যাপিটালাইজেশন (Punctuation)',
    marks: 7,
    icon: '✍️',
    accentColor: '#fb7185',
    description: 'Direct speech quotes, commas in appositives/clauses, apostrophes in contractions/possessives, semicolons, and proper nouns.',
    subtopics: [
      {
        id: 'dialogue_and_quotes',
        title: 'Narration Punctuation & Quotes',
        description: 'Punctuation in reported speeches, tags, commas, exclamation marks.',
        rulesSummary: [
          'Direct speech inside quotation marks: "Where are you going?" asked Rahim.',
          'Comma separates introductory reporting clauses: The teacher said, "Be attentive."',
          'Apostrophe for possession (the boy\'s book, teachers\' common room) vs contraction (it\'s = it is).'
        ]
      }
    ]
  },
  {
    id: 'modifiers',
    number: 8,
    title: 'Use of Modifiers',
    bengaliTitle: 'মডিফায়ার এর ব্যবহার (Modifiers)',
    marks: 5,
    icon: '🪄',
    accentColor: '#fb923c',
    description: 'Pre-modifiers (adjectives, participles, nouns as adjectives, determiners, quantifiers, intensifiers) and Post-modifiers (appositives, prepositional phrases, relative clauses).',
    subtopics: [
      {
        id: 'pre_modifiers',
        title: 'Pre-modifying Nouns & Verbs',
        description: 'Intensifiers (very, extremely), present participle ("a barking dog"), determiners, quantifiers.',
        rulesSummary: [
          'Intensifier to pre-modify adjective: usually "very" or "extremely".',
          'Present Participle (V-ing) / Past Participle (V3) as pre-modifier.',
          'Noun Adjective: using a noun to modify another noun (e.g. "train station", "water pollution").'
        ]
      },
      {
        id: 'post_modifiers',
        title: 'Post-modifying Nouns & Verbs',
        description: 'Appositives ("Kazi Nazrul Islam, our national poet,"), infinitive phrases, prepositional phrases.',
        rulesSummary: [
          'Appositive: noun or noun phrase placed after a noun to give extra identifying info.',
          'Infinitive Phrase: "to + V1 + object/extension" to post-modify verbs (showing purpose).',
          'Prepositional Phrase: "with a smile", "in the corner".'
        ]
      }
    ]
  },
  {
    id: 'changing_sentences',
    number: 9,
    title: 'Changing Sentences (Transformation)',
    bengaliTitle: 'বাক্য পরিবর্তন (Changing Sentences ⭐ 10 Marks)',
    marks: 10,
    icon: '👑',
    accentColor: '#a3e635',
    description: 'The premier 10-mark section: Voice Change (all 12 tenses & modals), Narration, 16 Affirmative/Negative rules, Assertive/Interrogative/Exclamatory/Imperative, Simple/Complex/Compound, and Degrees of Comparison.',
    subtopics: [
      {
        id: 'voice_change',
        title: 'Voice Change (Active ↔ Passive)',
        bengaliTitle: 'বাচ্য পরিবর্তন (Voice Change)',
        description: 'All tenses, modals, imperatives (let/let not), interrogatives (wh- words), reflexive verbs, quasi-passive.',
        rulesSummary: [
          'Simple Present: S + V1 + O -> O + am/is/are + V3 + by + S.',
          'Continuous: is/am/are/was/were + being + V3.',
          'Perfect: has/have/had/will have + been + V3.',
          'Modals: can/could/may/must/should + be + V3.',
          'Imperative: Let + O + be + V3 | Negative: Let + O + not + be + V3.'
        ]
      },
      {
        id: 'narration',
        title: 'Narration (Direct ↔ Indirect)',
        bengaliTitle: 'উক্তি পরিবর্তন (Narration)',
        description: 'Assertive, Interrogative, Imperative, Exclamatory, Optative with tense backshifts & pronoun changes.',
        rulesSummary: [
          'Assertive: said to -> told, connecting word "that".',
          'Interrogative: asked, connecting word "if/whether" (or Wh-word).',
          'Imperative: ordered/requested/advised/forbidden + to + V1 (not to + V1).',
          'Exclamatory: exclaimed with joy/sorrow/wonder that...',
          'Optative: prayed / wished that + Subject + might + V1.'
        ]
      },
      {
        id: 'affirmative_negative',
        title: 'Affirmative ↔ Negative (16 Rules)',
        bengaliTitle: 'হ্যাঁ-বোধক ও না-বোধক রূপান্তর (16 Rules)',
        description: 'None but, cannot but, not only...but also, there is no...but, no sooner...than, too...to, as...as.',
        rulesSummary: [
          'Rule 1: Only/Alone -> None but (person) / Nothing but (thing) / Not more than (number/age).',
          'Rule 2: Must / Have to -> Cannot but + V1 (or Cannot help + V-ing).',
          'Rule 3: Both...and / And -> Not only...but also.',
          'Rule 4: Every + noun -> There is no + noun + but + verb.',
          'Rule 5: As soon as -> No sooner had + S + V3...than + S + V2.',
          'Rule 6: Too...to -> So...that + S + cannot/could not + V1.'
        ]
      },
      {
        id: 'simple_compound_complex',
        title: 'Simple ↔ Complex ↔ Compound',
        bengaliTitle: 'সরল, জটিল ও যৌগিক বাক্য রূপান্তর',
        description: 'By+V-ing, Without+V-ing, In spite of, Since/As/When, Though/Although, So that, Relative Pronouns.',
        rulesSummary: [
          'Concession: In spite of + Noun/V-ing (Simple) <-> Though/Although (Complex) <-> but/yet (Compound).',
          'Condition (Positive): By + V-ing (Simple) <-> If + affirmative (Complex) <-> and (Compound).',
          'Condition (Negative): Without + V-ing (Simple) <-> If + negative / Unless (Complex) <-> or / otherwise (Compound).',
          'Reason/Cause: Because of / On account of (Simple) <-> Since / As / Because (Complex) <-> and so / therefore (Compound).'
        ]
      },
      {
        id: 'degree',
        title: 'Degrees of Comparison (Degree Change)',
        bengaliTitle: 'তুলনামূলক মাত্রা (Positive ↔ Comparative ↔ Superlative)',
        description: 'No other, Very few, Than any other, Than most other, One of the, Latin comparatives.',
        rulesSummary: [
          'Superlative "the best" <-> Comparative "better than any other" <-> Positive "No other...as good as".',
          'Superlative "one of the best" <-> Comparative "better than most other" <-> Positive "Very few...as good as".',
          'Two items compared (A is taller than B) <-> B is not as tall as A.'
        ]
      },
      {
        id: 'assertive_interrogative',
        title: 'Assertive ↔ Interrogative',
        bengaliTitle: 'বিবৃতিমূলক ও প্রশ্নবোধক রূপান্তর',
        description: 'Auxiliary inversion, negative additions, "Who doesn\'t", "Why + V1", "What though".',
        rulesSummary: [
          'Affirmative Assertive -> Negative Interrogative (He is honest -> Isn\'t he honest?).',
          'Negative Assertive -> Affirmative Interrogative (He does not smoke -> Does he smoke?).',
          'Everybody / Everyone / All -> Who doesn\'t + V1...?'
        ]
      },
      {
        id: 'assertive_exclamatory',
        title: 'Assertive ↔ Exclamatory',
        bengaliTitle: 'বিস্ময়সূচক বাক্য রূপান্তর',
        description: 'What a/an, How, Hurrah, Alas, If only, Had I the wings of a bird.',
        rulesSummary: [
          'S + V + a very + Adj + Noun <-> What a/an + Adj + Noun + S + V!',
          'S + V + very + Adj <-> How + Adj + S + V!',
          'I wish I had the wings of a bird <-> Had I the wings of a bird! / If I had the wings of a bird!'
        ]
      },
      {
        id: 'assertive_imperative',
        title: 'Assertive ↔ Imperative',
        bengaliTitle: 'অনুজ্ঞাসূচক বাক্য রূপান্তর',
        description: 'You should do -> Do, Let us, You are requested/advised to.',
        rulesSummary: [
          'You should do the work -> Do the work.',
          'We should go out -> Let us go out.',
          'You should not go there -> Do not go there / Never go there.'
        ]
      }
    ]
  },
  {
    id: 'tag_questions_and_special',
    number: 10,
    title: 'Tag Questions & Board Essentials',
    bengaliTitle: 'ট্যাগ কোশ্চেন ও অন্যান্য ব্যাকরণ',
    marks: 5,
    icon: '🏷️',
    accentColor: '#e879f9',
    description: 'Tag questions with negative markers (hardly, scarcely, seldom, little), imperative tags, collective subjects, and common board idioms.',
    subtopics: [
      {
        id: 'tag_questions',
        title: 'Tag Questions Rules',
        description: 'Positive statement -> Negative tag; Negative statement -> Positive tag.',
        rulesSummary: [
          'Hardly, scarcely, rarely, seldom, barely, neither, none, little, few make the sentence negative -> use POSITIVE tag.',
          'Let us / Let\'s -> shall we? | Let him / Let them -> will you?',
          'Everybody / Everyone / Nobody / None -> use pronoun "they" in tag (e.g. "Nobody phoned, did they?").'
        ]
      }
    ]
  }
];
