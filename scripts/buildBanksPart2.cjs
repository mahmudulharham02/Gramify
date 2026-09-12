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
// TOPIC 3: PREPOSITIONS & APPROPRIATE PREPOSITIONS (142 items)
// -------------------------------------------------------------
function generatePrepositions() {
  const list = [];
  const tid = 'preposition';
  const inst = 'Choose the appropriate preposition for the blank:';

  // 1. Time Prepositions (30)
  const timeData = [
    ["The meeting is scheduled to begin _____ 10:00 AM sharp.", "at", "in", "on", "by", "Time of Clock ('at')", "'At' is used before precise points on the clock (at 10:00 AM, at noon, at midnight)."],
    ["Our Independence Day is celebrated _____ 26th March every year.", "on", "in", "at", "by", "Dates and Specific Days ('on')", "'On' is used before specific calendar dates and days of the week (on 26th March, on Friday)."],
    ["The liberation war of Bangladesh took place _____ 1971.", "in", "on", "at", "during", "Years and Centuries ('in')", "'In' is used before years, decades, centuries, and long historical eras (in 1971)."],
    ["It has been raining continuously _____ 6 o'clock this morning.", "since", "for", "from", "at", "Point of Time ('since')", "'Since' indicates the exact starting point of an ongoing action in the perfect continuous tense."],
    ["He has been preparing for the HSC exam _____ the last six months.", "for", "since", "during", "in", "Period of Time ('for')", "'For' is used before a duration or period of time (for six months, for two years)."],
    ["The students must submit their practical records _____ next Monday.", "by", "at", "in", "since", "Deadline Marker ('by')", "'By' indicates a deadline meaning 'not later than' or 'on or before' a specific time."],
    ["We stayed in our village home _____ the entire summer vacation.", "during", "for", "since", "at", "Duration of an Event ('during')", "'During' refers to the whole period within an event or vacation."],
    ["The train will reach the platform _____ twenty minutes.", "in", "at", "on", "by", "Time Span Until Event ('in')", "'In' with a duration indicates the time elapsed before a future event occurs."],
    ["He always wakes up early _____ dawn to recite his prayers.", "at", "in", "on", "during", "Fixed Time Expression ('at dawn')", "Specific transitional times like 'at dawn', 'at dusk', 'at night' take 'at'."],
    ["Flowers blossom in our garden _____ spring.", "in", "on", "at", "during", "Names of Seasons ('in')", "Names of seasons (in spring, in winter, in summer) take 'in'."],
    ["He promised to return home _____ sunset.", "before", "in", "on", "at", "Preceding Event Marker ('before')", "'Before' indicates prior to a specific point like sunset."],
    ["The ceremony concluded _____ midnight.", "at", "in", "on", "by", "Fixed Point ('at midnight')", "'At midnight' is the standard prepositional phrase for 12:00 AM."],
    ["He completed the entire syllabus _____ two months.", "within", "at", "on", "since", "Inside a Time Limit ('within')", "'Within' specifies completion inside the bounds of a given timeframe."],
    ["We usually have our lunch _____ 2 PM.", "at", "in", "on", "for", "Specific Hour ('at 2 PM')", "Definite hours take 'at'."],
    ["He visited his grandparents _____ the Eid holidays.", "during", "at", "in", "for", "Festival Period ('during')", "'During' describes activity throughout a holiday period."],
    ["The semester exams will begin _____ November.", "in", "on", "at", "by", "Months of the Year ('in')", "Months take the preposition 'in' (in November)."],
    ["I haven't seen my childhood friend _____ ten long years.", "for", "since", "during", "in", "Duration in Negative Perfect Tense", "'For ten years' indicates the elapsed span of time."],
    ["She has been working in the hospital _____ 2018.", "since", "for", "from", "at", "Past Starting Year ('since 2018')", "Exact past year marking origin of ongoing activity takes 'since'."],
    ["The bell will ring _____ five minutes.", "in", "at", "on", "since", "Future Elapsed Time ('in 5 minutes')", "'In five minutes' means five minutes from now."],
    ["He worked in the tea garden _____ morning till evening.", "from", "since", "at", "during", "Time Range ('from ... till')", "'From' pairs with 'till/to' to indicate the start and end of a time span."],
    ["I will finish the assignment _____ tomorrow evening.", "by", "at", "in", "since", "Future Deadline ('by')", "'By tomorrow evening' sets the latest acceptable time."],
    ["The museum remains closed _____ Mondays.", "on", "in", "at", "by", "Recurring Days of Week ('on Mondays')", "Days of the week take 'on'."],
    ["He came to my residence _____ a rainy morning.", "on", "in", "at", "during", "Specific Modified Day ('on a rainy morning')", "When 'morning' is modified by an adjective, 'on' is used ('on a rainy morning')."],
    ["The results will be declared _____ the first week of August.", "in", "on", "at", "by", "Week of a Month ('in')", "Time periods like 'in the first week' take 'in'."],
    ["He was born _____ a Friday.", "on", "in", "at", "by", "Day of Birth ('on a Friday')", "Days of the week always take 'on'."],
    ["The cricket tournament starts _____ 15th December.", "on", "in", "at", "by", "Date Marker ('on')", "Calendar dates take 'on'."],
    ["We reached Sylhet _____ the morning.", "in", "at", "on", "by", "Part of the Day ('in the morning')", "Parts of the day take 'in the morning', 'in the afternoon', 'in the evening'."],
    ["He studied diligently _____ the night before the examination.", "throughout", "at", "on", "in", "Whole Duration ('throughout')", "'Throughout the night' means continuously through the entire night."],
    ["The doctor advised him to take this medicine _____ meals.", "after", "in", "on", "at", "Sequence Time ('after meals')", "'After meals' indicates the correct sequence following eating."],
    ["He arrived _____ time for the scheduled interview.", "on", "in", "at", "by", "Punctual ('on time')", "'On time' means punctual according to the schedule."]
  ];
  timeData.forEach((d, i) => {
    list.push(makeMCQ(`prep_time_${i+1}`, tid, 'time_place_direction', 'time_prepositions', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], i % 3 === 0 ? 'easy' : 'medium'));
  });

  // 2. Place & Position Prepositions (30)
  const placeData = [
    ["He lives _____ a small village in Cumilla district.", "in", "at", "on", "into", "Large Area vs Small Place ('in')", "'In' is used before districts, cities, and countries, as well as enclosed areas."],
    ["The train arrived _____ Kamalapur railway station on time.", "at", "in", "on", "to", "Specific Point of Location ('at')", "'At' is used for specific pinpoint locations, buildings, and stations."],
    ["The book is lying _____ the study table.", "on", "in", "at", "over", "Surface Contact ('on')", "'On' indicates physical contact with a flat surface."],
    ["The cat jumped _____ the fence into the neighboring yard.", "over", "above", "on", "across", "Movement Higher Above ('over')", "'Over' indicates movement from one side of a barrier to the other above it."],
    ["The temperature in Dhaka dropped _____ 10 degrees Celsius.", "below", "under", "down", "beneath", "Measurement Scale ('below')", "'Below' is used for levels, points on a scale, or temperature measurements."],
    ["Distribute these mangoes _____ the two brothers equally.", "between", "among", "with", "into", "Between Two Parties ('between')", "'Between' is strictly used when dividing or comparing two persons or things."],
    ["The teacher distributed the notebooks _____ all the students.", "among", "between", "with", "into", "Among More Than Two ('among')", "'Among' is used when distributing among three or more persons."],
    ["The ceiling fan is rotating _____ our heads.", "above", "over", "on", "at", "Higher Level Without Contact ('above')", "'Above' denotes a position higher than something without touching."],
    ["He sat _____ a shady banyan tree to rest.", "under", "below", "behind", "between", "Underneath / Below Shade ('under')", "'Under' indicates being directly beneath the coverage of a tree or roof."],
    ["He lives _____ 45 Green Road, Dhanmondi.", "at", "in", "on", "by", "Exact Street Address ('at')", "'At' is used when the exact house/building number is mentioned with the street."],
    ["He lives _____ Mirpur Road in Dhaka.", "on", "at", "in", "by", "Street Name Alone ('on')", "'On' is used when referring to a street or road name without a specific house number."],
    ["The submarine submerged deep _____ the surface of the sea.", "beneath", "on", "above", "over", "Directly Underneath / Deep ('beneath')", "'Beneath' indicates directly underneath or covered by water/surface."],
    ["There is a grand banyan tree _____ our college building.", "in front of", "at", "on", "into", "Position Relative to Building ('in front of')", "'In front of' indicates position directly facing the building."],
    ["He stood _____ the door waiting for the principal's permission.", "at", "in", "on", "into", "Pinpoint Location ('at the door')", "'At the door' indicates proximity to the entrance point."],
    ["Our college campus is situated _____ the scenic bank of the Meghna.", "on", "in", "at", "by", "Position Along River Bank ('on/by')", "'On the bank of' is the standard geographic locator."],
    ["The treasure was hidden _____ the ancient ruins.", "among", "between", "over", "at", "Surrounded By ('among')", "'Among the ruins' indicates surrounded by multiple objects."],
    ["The picture is hung _____ the fireplace.", "above", "over", "in", "on", "Vertical Higher Position ('above')", "'Above the fireplace' indicates higher position on the wall."],
    ["The child hid _____ the wooden wardrobe.", "behind", "at", "on", "over", "Concealed Position ('behind')", "'Behind' indicates at the back of an object."],
    ["He sat _____ his best friend during the classroom lecture.", "beside", "besides", "between", "at", "Next to ('beside')", "'Beside' means 'at the side of / next to' (not 'besides' which means 'in addition to')."],
    ["The village is located _____ the foothills of the hills.", "at", "in", "on", "over", "Location Point ('at the foothills')", "'At the foothills' denotes specific geographical position."],
    ["There is a small footbridge _____ the narrow canal.", "across", "along", "through", "in", "From One Side to Other ('across')", "'Across' indicates spanning from one side to the other."],
    ["He walked _____ the tranquil riverbank in the evening.", "along", "across", "through", "into", "Following the Line Of ('along')", "'Along' means moving in a line parallel to the edge of the river."],
    ["The hikers walked _____ the dense forest of Sundarbans.", "through", "across", "along", "over", "Passing Inside 3D Space ('through')", "'Through' indicates moving inside a three-dimensional dense area or forest."],
    ["The bird flew _____ the open window into the room.", "through", "across", "along", "over", "Entry Through Opening ('through')", "'Through the window' indicates passing through an opening."],
    ["He poured fresh milk _____ the tea cup.", "into", "in", "on", "to", "Motion Inward ('into')", "'Into' indicates movement from outside to inside a container."],
    ["The diver plunged deep _____ the cold river water.", "into", "in", "at", "on", "Dynamic Movement Inward ('into')", "'Into' shows dynamic inward motion into water."],
    ["The ball rolled _____ the sloping road.", "down", "below", "under", "beneath", "Movement in Downward Direction ('down')", "'Down the road' indicates downward movement along the incline."],
    ["He stepped _____ the bus at the terminal.", "off", "of", "out", "away", "Disembarking Vehicle ('off')", "'Step off / get off the bus' is the correct prepositional verb."],
    ["The cat jumped _____ the dining table.", "onto", "into", "in", "at", "Movement onto Surface ('onto')", "'Onto' shows movement toward and resting upon a surface."],
    ["Bangladesh lies _____ India and Myanmar.", "between", "among", "within", "around", "Geographical Between Two Countries", "'Between' is used when situated between two designated boundary nations."]
  ];
  placeData.forEach((d, i) => {
    list.push(makeMCQ(`prep_place_${i+1}`, tid, 'time_place_direction', 'place_prepositions', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], i % 3 === 0 ? 'easy' : 'medium'));
  });

  // 3. Direction & Motion (15)
  const dirData = [
    ["He is traveling _____ Chattogram by the Subarna Express.", "to", "into", "at", "for", "Destination Marker ('to')", "'To' indicates the intended destination of travel."],
    ["He set out _____ Cox's Bazar early in the morning.", "for", "to", "towards", "into", "Departure with Destination ('set out for')", "'Set out for / leave for' takes 'for' to indicate departure destination."],
    ["The crowd rushed _____ the exit when the fire alarm sounded.", "towards", "at", "to", "into", "Direction of Movement ('towards')", "'Towards' indicates the direction in which movement is oriented."],
    ["Water flows _____ high ground to low ground naturally.", "from", "out", "away", "off", "Point of Origin ('from')", "'From' indicates the starting point or origin of motion."],
    ["He walked _____ the library and took a seat.", "into", "in", "to", "at", "Entry Motion ('into')", "'Into' represents motion resulting in being inside the building."],
    ["The arrow passed right _____ his shoulder without touching him.", "past", "through", "across", "over", "Moving Beyond Point ('past')", "'Past' indicates moving beyond a specific point."],
    ["The boys ran _____ the field to catch the kite.", "across", "through", "along", "over", "Across Open Area ('across')", "'Across' denotes traversing an open area from one side to the other."],
    ["The boat sailed _____ the Meghna river against the tide.", "up", "on", "into", "at", "Upstream Motion ('up the river')", "'Up the river' means moving upstream against the current."],
    ["He climbed _____ the ladder to fix the roof.", "up", "on", "into", "over", "Ascending Motion ('up')", "'Climb up' indicates upward motion."],
    ["He fell _____ the moving rickshaw and got injured.", "from", "off", "out", "of", "Falling Off Moving Vehicle ('from/off')", "'Fell from/off' indicates detachment from a moving transport."],
    ["The airplane flew _____ the dark clouds safely.", "above", "over", "across", "through", "Altitude Higher Than ('above')", "'Above the clouds' denotes higher altitude."],
    ["They walked _____ the seashore collecting seashells.", "along", "across", "through", "into", "Parallel Shoreline Motion ('along')", "'Along the seashore' means walking along the edge of the coast."],
    ["He threw the empty plastic bottle _____ the dustbin.", "into", "in", "at", "to", "Direct Motion into Receptacle ('into')", "'Into the dustbin' denotes motion ending inside the receptacle."],
    ["The soldiers marched _____ the city gate proudly.", "through", "across", "along", "over", "Passing Through Entrance ('through')", "'Through the gate' indicates passing between the gateposts."],
    ["He traveled all the way _____ London to Dhaka.", "from", "to", "at", "into", "Origin Indicator ('from ... to')", "'From' marks the origin of the international journey."]
  ];
  dirData.forEach((d, i) => {
    list.push(makeMCQ(`prep_dir_${i+1}`, tid, 'time_place_direction', 'direction_motion', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'medium'));
  });

  // 4. Appropriate Prepositions: Verb + Preposition (32)
  const verbPrepData = [
    ["Success in the HSC examination depends _____ hard work and perseverance.", "on", "in", "at", "with", "Depend on", "The verb 'depend' is strictly followed by the appropriate preposition 'on' (or upon)."],
    ["We must abide _____ the established rules of our educational institution.", "by", "with", "to", "in", "Abide by (Obey)", "'Abide by' is an appropriate preposition meaning to obey or conform to rules."],
    ["He believes _____ honesty and moral integrity.", "in", "on", "at", "with", "Believe in", "'Believe in' means to have faith in the existence or value of something."],
    ["Our college library consists _____ more than twenty thousand books.", "of", "in", "with", "by", "Consist of (Composed of)", "'Consist of' means to be made up or composed of items."],
    ["True happiness consists _____ contentment of mind.", "in", "of", "with", "at", "Consist in (Lie / Inhere)", "'Consist in' means to exist or lie inherently in something."],
    ["He aimed _____ the flying bird with his arrow.", "at", "on", "to", "for", "Aim at", "The verb 'aim' takes the preposition 'at' when targeting an object."],
    ["I look forward to _____ (receive) your favorable reply.", "receiving", "receive", "received", "receives", "Look forward to + V-ing", "'Look forward to' is a phrasal idiom where 'to' is a preposition, requiring the gerund form (V-ing)."],
    ["He succeeded _____ obtaining GPA 5 in the HSC examination.", "in", "at", "to", "for", "Succeed in", "'Succeed' is appropriately followed by 'in' + gerund (succeeded in obtaining)."],
    ["The doctor advised the patient to abstain _____ smoking.", "from", "of", "to", "in", "Abstain from", "'Abstain', 'refrain', and 'desist' take the preposition 'from' + V-ing."],
    ["He refrained _____ taking any hasty decision.", "from", "of", "to", "in", "Refrain from", "'Refrain from' means to deliberately hold back from an action."],
    ["The student was prevented _____ entering the examination hall without admit card.", "from", "to", "of", "with", "Prevent from", "'Prevent' takes 'from' + V-ing."],
    ["You must adhere _____ your noble principles in times of crisis.", "to", "with", "on", "in", "Adhere to", "'Adhere to' means to stick firmly to principles, rules, or beliefs."],
    ["The principal agreed _____ my proposal warmly.", "to", "with", "on", "in", "Agree to (a proposal)", "One agrees 'with' a person, but agrees 'to' a proposal or suggestion."],
    ["I completely agree _____ you on this crucial educational issue.", "with", "to", "on", "in", "Agree with (a person)", "'Agree with' is used when concurring with a person."],
    ["The committee finally agreed _____ a plan of action.", "on", "with", "to", "in", "Agree on (a point/plan)", "Parties agree 'on' a mutually decided matter or course of action."],
    ["The heroic freedom fighter died _____ his beloved country.", "for", "of", "by", "from", "Die for (a noble cause)", "'Die for' is used when someone sacrifices their life for a country or noble cause."],
    ["The old man died _____ cholera last night.", "of", "from", "by", "for", "Die of (a disease)", "'Die of' is used when death is caused by a specific disease (malaria, cancer, cholera)."],
    ["He died _____ overwork and extreme physical exhaustion.", "from", "of", "by", "for", "Die from (an external effect)", "'Die from' is used when death results from a cause like overeating, wound, or overwork."],
    ["The corrupt officer died _____ poison.", "by", "of", "from", "for", "Die by (violence/poison)", "'Die by' is used for unnatural deaths caused by poison, violence, or suicide."],
    ["He deals _____ rice and wheat in the wholesale market.", "in", "with", "out", "of", "Deal in (Trade/Business)", "'Deal in' means to carry on a trade or business in a commodity."],
    ["A teacher should know how to deal _____ different kinds of students.", "with", "in", "at", "to", "Deal with (Behave/Handle)", "'Deal with' means to handle, treat, or interact with persons or matters."],
    ["He appeals _____ the higher authority for justice.", "to", "at", "for", "with", "Appeal to (a person/authority)", "'Appeal to' is used when addressing an authority for assistance or redress."],
    ["He contributed generously _____ the flood relief fund.", "to", "in", "for", "with", "Contribute to", "'Contribute' is followed by the preposition 'to'."],
    ["The reckless driver was charged _____ causing the fatal accident.", "with", "of", "for", "in", "Charged with", "A person is 'charged with' an offense or crime (accused takes 'of')."],
    ["The prisoner was accused _____ stealing valuable documents.", "of", "with", "for", "in", "Accused of", "'Accuse' is appropriately paired with the preposition 'of'."],
    ["He was acquitted _____ all criminal charges by the High Court.", "of", "from", "with", "in", "Acquitted of", "'Acquit' (declared not guilty) takes the preposition 'of'."],
    ["He recovered _____ his severe illness after intensive medical treatment.", "from", "of", "with", "at", "Recover from", "'Recover' is followed by 'from' when overcoming an illness."],
    ["She longs _____ seeing her native village after many years.", "for", "to", "in", "with", "Long for", "'Long for' means to desire or yearn earnestly for something."],
    ["The police are looking _____ the mysterious bank robbery.", "into", "at", "for", "after", "Look into (Investigate)", "'Look into' is a phrasal verb meaning to investigate."],
    ["The nurse looked _____ the orphan child with great tenderness.", "after", "into", "for", "at", "Look after (Take care of)", "'Look after' means to tend to or care for someone."],
    ["He applied _____ the principal for three days' leave of absence.", "to", "for", "with", "at", "Apply to (an authority)", "One applies 'to' a person/authority, but applies 'for' a post or leave."],
    ["He applied _____ the vacant post of assistant lecturer.", "for", "to", "with", "in", "Apply for (a position)", "'Apply for' is used when seeking a post, grant, or permission."]
  ];
  verbPrepData.forEach((d, i) => {
    list.push(makeMCQ(`prep_verb_${i+1}`, tid, 'appropriate_prep', 'verb_preposition', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'hard'));
  });

  // 5. Appropriate Prepositions: Adjective + Preposition (20)
  const adjPrepData = [
    ["He is very good _____ mathematics and English grammar.", "at", "in", "on", "for", "Good at (Proficient in)", "'Good at' is the appropriate preposition indicating skill or proficiency in a subject."],
    ["Children are generally fond _____ sweets and chocolates.", "of", "to", "in", "with", "Fond of", "'Fond of' is the appropriate phrase expressing affection or liking."],
    ["The teacher was extremely angry _____ the unruly students.", "with", "at", "for", "to", "Angry with (a person)", "One is 'angry with' a person, but 'angry at' a situation or conduct."],
    ["He was angry _____ my unexpected delay in arriving.", "at", "with", "for", "in", "Angry at (a conduct/thing)", "'Angry at' is used when provoked by an action or event."],
    ["He is senior _____ me by three academic years.", "to", "than", "from", "of", "Senior to (Latin Comparative)", "Latin comparatives (senior, junior, superior, inferior, prior, preferable) strictly take 'to', never 'than'."],
    ["Health is preferable _____ immense accumulated wealth.", "to", "than", "for", "of", "Preferable to", "'Preferable' takes the preposition 'to' (not 'than')."],
    ["She is proud _____ her daughter's brilliant achievement in the HSC board.", "of", "for", "in", "at", "Proud of", "'Proud of' is the standard appropriate phrase."],
    ["We take pride _____ our glorious Liberation War of 1971.", "in", "of", "with", "for", "Pride in (Noun)", "As a noun, 'pride' takes 'in' ('take pride in'), whereas adjective 'proud' takes 'of'."],
    ["He is blind _____ his only son's grievous faults.", "to", "of", "in", "with", "Blind to (Indifferent to faults)", "'Blind to' means deliberately ignoring or indifferent to mistakes/faults."],
    ["The unfortunate beggar is blind _____ one eye.", "of", "to", "in", "with", "Blind of/in (Physical Sight Loss)", "'Blind of / in an eye' refers to physical loss of vision."],
    ["He is conscious _____ his social responsibilities as an educated citizen.", "of", "to", "with", "for", "Conscious of", "'Conscious of' means aware and mindful of something."],
    ["The flood victims were deprived _____ basic relief materials.", "of", "from", "with", "to", "Deprived of", "'Deprived of' means stripped or denied of necessities."],
    ["He is capable _____ solving complex trigonometric equations.", "of", "to", "for", "in", "Capable of", "'Capable of' takes the preposition 'of' + gerund."],
    ["The student is deficient _____ English vocabulary.", "in", "of", "with", "at", "Deficient in", "'Deficient in' means lacking or inadequate in a skill/resource."],
    ["Smoking is detrimental _____ human health.", "to", "for", "with", "in", "Detrimental to", "'Detrimental to' (and 'injurious to') takes the preposition 'to'."],
    ["Smoking is injurious _____ health.", "to", "for", "of", "in", "Injurious to", "'Injurious' is followed by the preposition 'to'."],
    ["He is zealous _____ social welfare activities in his locality.", "for", "of", "in", "with", "Zealous for", "'Zealous for' means enthusiastic and passionate about a cause."],
    ["We are indebted _____ our valiant freedom fighters for our liberty.", "to", "for", "with", "of", "Indebted to", "One is 'indebted to' a person (and indebted for a benefit)."],
    ["He is very keen _____ pursuing higher education abroad.", "on", "in", "for", "at", "Keen on", "'Keen on' expresses strong interest or eagerness."],
    ["She is jealous _____ her classmate's academic success.", "of", "at", "with", "for", "Jealous of", "'Jealous of' (and 'envious of') takes the preposition 'of'."]
  ];
  adjPrepData.forEach((d, i) => {
    list.push(makeMCQ(`prep_adj_${i+1}`, tid, 'appropriate_prep', 'adjective_preposition', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'medium'));
  });

  // 6. Mixed Board Standard Prepositions (15)
  const mixedData = [
    ["He has no appetite _____ junk food nowadays.", "for", "of", "to", "in", "Appetite for", "'Appetite for' is the appropriate preposition for desire for food or learning."],
    ["He was born _____ a noble Muslim family in Sylhet.", "of", "in", "to", "from", "Born of (parents/family)", "'Born of' refers to descent from parents/family ('born in' refers to a place)."],
    ["The corrupt clerk was accused _____ bribery.", "of", "for", "with", "in", "Accused of", "'Accuse' is paired with 'of'."],
    ["He is absorbed _____ his research studies day and night.", "in", "with", "at", "for", "Absorbed in (Engrossed)", "'Absorbed in' means deeply engaged or engrossed in an activity."],
    ["He is eligible _____ the HSC scholarship award.", "for", "to", "in", "with", "Eligible for", "'Eligible for' means qualified to receive something."],
    ["The student is eager _____ knowledge and innovation.", "for", "to", "of", "with", "Eager for", "'Eager for' indicates strong yearning."],
    ["He has great admiration _____ his college teachers.", "for", "to", "of", "in", "Admiration for", "'Admiration for' is the standard noun-preposition pair."],
    ["We should show compassion _____ the distressed destitute.", "for", "to", "with", "in", "Compassion for", "'Compassion for' means deep sympathy for the suffering of others."],
    ["He is ignorant _____ the basic rules of computer programming.", "of", "in", "at", "with", "Ignorant of", "'Ignorant of' means lacking knowledge about something."],
    ["She is gifted _____ a melodious singing voice.", "with", "in", "of", "by", "Gifted with", "'Gifted with' means naturally endowed with a talent."],
    ["The committee consists _____ five senior professors.", "of", "in", "with", "by", "Consist of", "'Consist of' means comprised of."],
    ["He took pity _____ the homeless orphan on the street.", "on", "at", "for", "with", "Pity on / Take pity on", "'Take pity on' takes the preposition 'on'."],
    ["He died _____ overeating at the wedding banquet.", "from", "of", "by", "for", "Die from", "'Die from' is used when death is caused by an external cause like overeating."],
    ["He is accustomed _____ hard labor in the fields.", "to", "with", "in", "of", "Accustomed to + Noun/V-ing", "'Accustomed to' is followed by 'to'."],
    ["He has a great taste _____ classical Bengali music.", "for", "in", "of", "to", "Taste for (Liking)", "'Taste for' means appreciation or liking for an art/subject."]
  ];
  mixedData.forEach((d, i) => {
    list.push(makeMCQ(`prep_mix_${i+1}`, tid, 'appropriate_prep', 'mixed', inst, d[0], d[0], d[1], d[2], d[3], d[4], d[5], d[6], 'hard'));
  });

  return list;
}

console.log('Prepositions generator logic defined.');
