export interface RuleGuideSection {
  id: string;
  topicId: string;
  title: string;
  bengaliTitle: string;
  badge: string;
  description: string;
  formulaTable?: {
    header: string[];
    rows: string[][];
  };
  rulesList?: {
    ruleNo: number;
    title: string;
    formula: string;
    example: { original: string; transformed: string; explanation: string };
  }[];
  keyTakeaways: string[];
}

export const RULES_GUIDE_DATA: RuleGuideSection[] = [
  {
    id: 'voice_change_guide',
    topicId: 'changing_sentences',
    title: 'Voice Change Master Matrix (Active ↔ Passive)',
    bengaliTitle: 'বাচ্য পরিবর্তনের সম্পূর্ণ সূত্র ও নিয়মাবলি',
    badge: '10 Marks Core',
    description: 'Active voice indicates the subject does the action. Passive voice indicates the subject receives the action. Formula: Object becomes Subject + Auxiliary (be verb) + V3 (Past Participle) + Preposition (by/with/to/at) + Subject becomes Object.',
    formulaTable: {
      header: ['Tense / Structure', 'Active Voice Pattern', 'Passive Voice Pattern', 'Board Example'],
      rows: [
        ['Simple Present', 'S + V1 (s/es) + O', 'O + am/is/are + V3 + by + S', 'He plays football. ➔ Football is played by him.'],
        ['Present Continuous', 'S + is/am/are + V-ing + O', 'O + is/am/are + being + V3 + by + S', 'She is singing a song. ➔ A song is being sung by her.'],
        ['Present Perfect', 'S + has/have + V3 + O', 'O + has/have + been + V3 + by + S', 'They have done the work. ➔ The work has been done by them.'],
        ['Simple Past', 'S + V2 + O', 'O + was/were + V3 + by + S', 'He wrote a letter. ➔ A letter was written by him.'],
        ['Past Continuous', 'S + was/were + V-ing + O', 'O + was/were + being + V3 + by + S', 'He was watching TV. ➔ TV was being watched by him.'],
        ['Past Perfect', 'S + had + V3 + O', 'O + had + been + V3 + by + S', 'I had finished the task. ➔ The task had been finished by me.'],
        ['Simple Future', 'S + will/shall + V1 + O', 'O + will/shall + be + V3 + by + S', 'We will help them. ➔ They will be helped by us.'],
        ['Future Perfect', 'S + will have + V3 + O', 'O + will have + been + V3 + by + S', 'He will have won the prize. ➔ The prize will have been won by him.'],
        ['Modals (can/must/etc.)', 'S + modal + V1 + O', 'O + modal + be + V3 + by + S', 'You must obey the law. ➔ The law must be obeyed by you.'],
        ['Imperative (Order)', 'V1 + O', 'Let + O + be + V3', 'Do the work. ➔ Let the work be done.'],
        ['Imperative (Negative)', 'Don\'t + V1 + O', 'Let + O + not + be + V3', 'Don\'t close the window. ➔ Let not the window be closed.'],
        ['Wh- Questions', 'Who + Verb + Object?', 'By whom + aux + O + V3?', 'Who broke the glass? ➔ By whom was the glass broken?']
      ]
    },
    keyTakeaways: [
      'Present Perfect Continuous, Past Perfect Continuous, Future Continuous, and Future Perfect Continuous do NOT have customary passive forms in HSC syllabus.',
      'Reflexive verbs (He killed himself) ➔ He was killed by himself.',
      'Quasi-passive verbs (Honey tastes sweet) ➔ Honey is sweet when it is tasted (or Honey is tasted sweet).',
      'Preposition variations: Known TO me, Pleased WITH you, Surprised AT his conduct, Contained IN the box.'
    ]
  },
  {
    id: 'affirmative_negative_guide',
    topicId: 'changing_sentences',
    title: '16 Affirmative ↔ Negative Rules Matrix',
    bengaliTitle: 'হ্যাঁ-বোধক থেকে না-বোধক রূপান্তরের ১৬টি নির্দিষ্ট নিয়ম',
    badge: 'HSC Top Rules',
    description: 'Transforming Affirmative to Negative requires altering structure while preserving the exact original semantic meaning (without changing the meaning).',
    rulesList: [
      {
        ruleNo: 1,
        title: 'Only / Alone (Person/God)',
        formula: 'Only/Alone ➔ None but (placed at the beginning)',
        example: {
          original: 'Only Allah can save us in times of danger.',
          transformed: 'None but Allah can save us in times of danger.',
          explanation: 'Since Allah is the divine creator/person, "Only" is substituted with "None but".'
        }
      },
      {
        ruleNo: 2,
        title: 'Only (Things/Objects)',
        formula: 'Only ➔ Nothing but (placed where Only was)',
        example: {
          original: 'A child likes only sweets.',
          transformed: 'A child likes nothing but sweets.',
          explanation: 'Sweets are inanimate objects, so "Only" is substituted with "Nothing but".'
        }
      },
      {
        ruleNo: 3,
        title: 'Only (Number / Age / Quantity)',
        formula: 'Only ➔ Not more than / Not less than',
        example: {
          original: 'He is only sixteen.',
          transformed: 'He is not more than sixteen.',
          explanation: 'Sixteen represents age/number, so "Only" becomes "Not more than".'
        }
      },
      {
        ruleNo: 4,
        title: 'Must / Have to / Has to',
        formula: 'Must ➔ Cannot but + V1 (or Cannot help + V-ing)',
        example: {
          original: 'Man must submit to destiny.',
          transformed: 'Man cannot but submit to destiny. (OR: Man cannot help submitting to destiny.)',
          explanation: '"Cannot but" is followed by bare infinitive V1; "Cannot help" requires verb+ing.'
        }
      },
      {
        ruleNo: 5,
        title: 'Both...and / And',
        formula: 'Both...and ➔ Not only...but also',
        example: {
          original: 'He is both sincere and punctual.',
          transformed: 'He is not only sincere but also punctual.',
          explanation: 'Replaces dual affirmative connector with correlative negative connector.'
        }
      },
      {
        ruleNo: 6,
        title: 'Every + Noun / Everybody / Everyone',
        formula: 'Every + noun ➔ There is no + noun + but + V1 (or Nobody + opposite verb)',
        example: {
          original: 'Every mother loves her child.',
          transformed: 'There is no mother but loves her child.',
          explanation: 'Can also be written: "There is no mother who does not love her child."'
        }
      },
      {
        ruleNo: 7,
        title: 'As soon as',
        formula: 'As soon as ➔ No sooner had + S + V3 ... than + S + V2',
        example: {
          original: 'As soon as the thief saw the police, he ran away.',
          transformed: 'No sooner had the thief seen the police than he ran away.',
          explanation: 'Notice the past participle "seen" after had, and the connector "than" before the second clause.'
        }
      },
      {
        ruleNo: 8,
        title: 'Too...to Structure',
        formula: 'Too + Adj + to + V1 ➔ So + Adj + that + S + cannot/could not + V1',
        example: {
          original: 'The old man was too weak to walk.',
          transformed: 'The old man was so weak that he could not walk.',
          explanation: 'Past tense "was" requires "could not"; present tense requires "cannot".'
        }
      },
      {
        ruleNo: 9,
        title: 'Universal Truths / Facts',
        formula: 'Affirmative Statement ➔ Negative Interrogative',
        example: {
          original: 'Health is wealth.',
          transformed: 'Isn\'t health wealth?',
          explanation: 'Universal facts keep their affirmative meaning in negative interrogative form.'
        }
      },
      {
        ruleNo: 10,
        title: 'Using Antonyms (Opposite Words)',
        formula: 'S + Verb + Adj ➔ S + Aux + not + Opposite Adj',
        example: {
          original: 'He is an honest boy.',
          transformed: 'He is not a dishonest boy.',
          explanation: 'Adding "not" and the antonym "dishonest" retains original meaning.'
        }
      },
      {
        ruleNo: 11,
        title: 'Always ➔ Never + Antonym',
        formula: 'Always + Word ➔ Never + Opposite Word',
        example: {
          original: 'I will always remember your kindness.',
          transformed: 'I will never forget your kindness.',
          explanation: '"Always" is inverted to "Never", and "remember" to "forget".'
        }
      },
      {
        ruleNo: 12,
        title: 'As...as (Positive Degree)',
        formula: 'As + Adj + as ➔ Not less + Adj + than',
        example: {
          original: 'Kamal is as wise as Jamal.',
          transformed: 'Kamal is not less wise than Jamal.',
          explanation: 'Alternative: "Jamal is not wiser than Kamal."'
        }
      },
      {
        ruleNo: 13,
        title: 'Many ➔ Not a few',
        formula: 'Many + Plural Noun ➔ Not a few + Plural Noun',
        example: {
          original: 'There are many flowers in the garden.',
          transformed: 'There are not a few flowers in the garden.',
          explanation: '"Many" (countable) transforms to "not a few".'
        }
      },
      {
        ruleNo: 14,
        title: 'A few ➔ Not many',
        formula: 'A few + Plural Noun ➔ Not many + Plural Noun',
        example: {
          original: 'Bangladesh has a few rivers with high tides.',
          transformed: 'Bangladesh does not have many rivers with high tides.',
          explanation: '"A few" transforms to negative quantifier "not many".'
        }
      },
      {
        ruleNo: 15,
        title: 'Much ➔ A little (Uncountable)',
        formula: 'Much + Uncountable ➔ Not a little',
        example: {
          original: 'He has much wealth.',
          transformed: 'He has not a little wealth.',
          explanation: '"Much" indicates large quantity of uncountable noun.'
        }
      },
      {
        ruleNo: 16,
        title: 'It is no use + V-ing',
        formula: 'It is no use + V-ing ➔ It is useless + to + V1 (or Why + V1...?)',
        example: {
          original: 'It is no use crying over spilt milk.',
          transformed: 'It is useless to cry over spilt milk.',
          explanation: 'Gerund phrase changes to infinitive with negative adjective "useless".'
        }
      }
    ],
    keyTakeaways: [
      'Never double negative unintentionally (e.g. "I did not see nobody" is grammatically incorrect).',
      'Maintain exact tense agreement when replacing modals.'
    ]
  },
  {
    id: 'simple_complex_compound_guide',
    topicId: 'changing_sentences',
    title: 'Simple ↔ Complex ↔ Compound Transformation Rules',
    bengaliTitle: 'সরল, জটিল ও যৌগিক বাক্য পরিবর্তনের পূর্ণাঙ্গ গাইডলাইন',
    badge: 'Highest Weightage',
    description: 'Simple sentence has 1 Principal Clause & no Subordinate Clause. Complex sentence has 1 Principal Clause & 1+ Subordinate Clauses (linked with who, which, that, since, as, when, though, if). Compound sentence has 2+ Principal Clauses linked with coordinating conjunctions (and, but, or, so, yet).',
    formulaTable: {
      header: ['Semantic Relationship', 'Simple Form (Non-finite / Preposition)', 'Complex Form (Subordinating Conjunction)', 'Compound Form (Coordinating Conjunction)'],
      rows: [
        ['Concession / Contrast', 'In spite of / Despite + V-ing/Noun', 'Though / Although + S + V', 'Clause 1 + but / yet + Clause 2'],
        ['Positive Condition', 'By + V-ing + object', 'If + S + V1 (affirmative)', 'Imperative / Clause 1 + and + Clause 2'],
        ['Negative Condition', 'Without + V-ing + object', 'Unless + S + V1 (or If + S + negative)', 'Imperative / Clause 1 + or / otherwise + Clause 2'],
        ['Reason / Cause', 'Because of / Owing to / Due to + V-ing/Noun', 'Since / As / Because + S + V', 'Clause 1 + and so / therefore + Clause 2'],
        ['Simultaneous Action (Time)', 'At the time of / On + V-ing', 'When / While + S + V', 'Clause 1 + and + Clause 2'],
        ['Sequential Action', 'Having + V3 / Verb+ing (Participle)', 'When / After + S + had + V3', 'Clause 1 + and then + Clause 2'],
        ['Purpose', 'To + V1 / In order to + V1', 'So that / In order that + S + can/could + V1', 'Clause 1 + and + Clause 2 (with want/wish)'],
        ['Result / Degree', 'Too + Adj + to + V1', 'So + Adj + that + S + cannot/could not + V1', 'Very + Adj + and therefore + S + cannot + V1']
      ]
    },
    keyTakeaways: [
      'Simple uses Non-finite verbs (Participle, Gerund, Infinitive).',
      'Complex uses Subordinators: Though, Although, Since, As, When, Where, Who, Which, That, If, Unless, So that.',
      'Compound uses FANBOYS: For, And, Nor, But, Or, Yet, So (and correlatives like "not only...but also").'
    ]
  },
  {
    id: 'narration_guide',
    topicId: 'changing_sentences',
    title: 'Direct ↔ Indirect Speech (Narration Rules)',
    bengaliTitle: 'উক্তি পরিবর্তন (Direct to Indirect Speech)',
    badge: 'Board Passage Mastery',
    description: 'Reported statements require backshifting tenses when the reporting verb is in the past, changing pronouns to match speaker perspective, and shifting time/place adverbs.',
    formulaTable: {
      header: ['Sentence Type', 'Reporting Verb Transformation', 'Connecting Conjunction', 'Internal Sentence Shift'],
      rows: [
        ['Assertive', 'said to ➔ told / said', 'that', 'Tense backshift + pronoun change'],
        ['Interrogative (Wh-)', 'said to ➔ asked / inquired of', 'Wh-word (What, Where, Why, etc.)', 'Wh-word + S + V (Assertive order, no aux inversion)'],
        ['Interrogative (Yes/No)', 'said to ➔ asked / inquired of', 'if / whether', 'if + S + V (Assertive order, end with period .)'],
        ['Imperative (Order/Advice)', 'said to ➔ ordered / advised / requested', 'to + V1 (not to + V1 for negative)', 'Verb remains in base infinitive'],
        ['Exclamatory', 'said ➔ exclaimed with joy / sorrow / wonder', 'that', 'Exclamatory order ➔ Assertive order with very/great'],
        ['Optative (Wish/Prayer)', 'said to ➔ wished / prayed', 'that', 'that + Subject + might + V1']
      ]
    },
    keyTakeaways: [
      'Adverb Shifts: now ➔ then | today ➔ that day | yesterday ➔ the previous day | tomorrow ➔ the next day / following day | here ➔ there | this ➔ that | ago ➔ before | come ➔ go (often).',
      'Tense Backshift: Present Simple ➔ Past Simple | Present Continuous ➔ Past Continuous | Present Perfect / Past Simple ➔ Past Perfect | will/shall ➔ would | can ➔ could | may ➔ might.'
    ]
  }
];
