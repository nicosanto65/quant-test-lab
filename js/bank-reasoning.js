/* QUANT TEST LAB — REASONING TRACK curated verbal bank.
   Analogies, classification/intruder, and Watson-Glaser-style statement
   reasoning (True / False / Cannot Say). Loaded after bank.js — appends into
   the SAME QTL_BANK.questions array via QTL_BANK.addMany(), tagged
   track:'reasoning' so store.js's per-track filtering picks it up. */
(function (global) {
  'use strict';

  const items = [

    /* ============================== ANALOGIES ============================== */
    /* word:word :: word:? — one relation type per item, verified so exactly
       one option matches the SAME relation as the stem pair. */

    {
      id: 'rv_an001', topic: 'Verbal Reasoning', subtopic: 'Analogies', difficulty: 1, targetTime: 20,
      prompt: 'HAPPY is to JOYFUL as LARGE is to ?',
      answerType: 'mc', options: ['ENORMOUS', 'SMALL', 'ROUND', 'HEAVY'], correctAnswer: 'ENORMOUS',
      hint: 'Name the exact relation between the first pair before looking at the options.',
      approach: 'Relation: synonym pair. Find the option that means the same as LARGE.',
      solution: 'HAPPY and JOYFUL are synonyms. ENORMOUS means the same as LARGE, so it completes the same relation. SMALL is an antonym, not a synonym; ROUND and HEAVY are unrelated properties.',
      recognitionTechnique: 'Other', commonTrap: 'Picking SMALL because it is the most familiar paired word with LARGE, without checking that the stem relation is synonym, not antonym.',
      tags: ['analogy', 'synonym']
    },
    {
      id: 'rv_an002', topic: 'Verbal Reasoning', subtopic: 'Analogies', difficulty: 1, targetTime: 20,
      prompt: 'RAPID is to QUICK as ANCIENT is to ?',
      answerType: 'mc', options: ['OLD', 'MODERN', 'LARGE', 'FRAGILE'], correctAnswer: 'OLD',
      hint: 'The stem pair means the same thing as each other.',
      approach: 'Relation: synonym pair.',
      solution: 'RAPID and QUICK are synonyms. OLD means the same as ANCIENT. MODERN is the opposite; LARGE and FRAGILE are unrelated to age.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing "the word most associated with ANCIENT" (like FRAGILE, since old things can be fragile) with "the word that MEANS ANCIENT."',
      tags: ['analogy', 'synonym']
    },
    {
      id: 'rv_an003', topic: 'Verbal Reasoning', subtopic: 'Analogies', difficulty: 1, targetTime: 20,
      prompt: 'BRAVE is to COURAGEOUS as INTELLIGENT is to ?',
      answerType: 'mc', options: ['CLEVER', 'FOOLISH', 'STRONG', 'TALL'], correctAnswer: 'CLEVER',
      hint: 'The stem pair are synonyms.',
      approach: 'Relation: synonym pair.',
      solution: 'BRAVE and COURAGEOUS mean the same thing. CLEVER means the same thing as INTELLIGENT. FOOLISH is an antonym; STRONG and TALL describe unrelated qualities.',
      recognitionTechnique: 'Other', commonTrap: 'Picking a word that often appears alongside "intelligent" in conversation rather than one that means the same thing.',
      tags: ['analogy', 'synonym']
    },
    {
      id: 'rv_an004', topic: 'Verbal Reasoning', subtopic: 'Analogies', difficulty: 1, targetTime: 20,
      prompt: 'BEGIN is to START as CONCLUDE is to ?',
      answerType: 'mc', options: ['FINISH', 'CONTINUE', 'PAUSE', 'OPEN'], correctAnswer: 'FINISH',
      hint: 'The stem pair are two verbs that mean the same action.',
      approach: 'Relation: synonym pair.',
      solution: 'BEGIN and START are synonyms. FINISH means the same as CONCLUDE. CONTINUE and PAUSE describe different actions; OPEN is closer to BEGIN, the wrong end of the process.',
      recognitionTechnique: 'Other', commonTrap: 'Answering OPEN by pattern-matching "beginning/end" pairs instead of checking which option actually MEANS "conclude."',
      tags: ['analogy', 'synonym']
    },

    {
      id: 'rv_an005', topic: 'Verbal Reasoning', subtopic: 'Analogies', difficulty: 1, targetTime: 20,
      prompt: 'HOT is to COLD as FAST is to ?',
      answerType: 'mc', options: ['SLOW', 'QUICK', 'WARM', 'RAPID'], correctAnswer: 'SLOW',
      hint: 'The stem pair are opposites.',
      approach: 'Relation: antonym pair.',
      solution: 'HOT and COLD are opposites. SLOW is the opposite of FAST. QUICK and RAPID are synonyms of FAST, not opposites; WARM is unrelated to speed.',
      recognitionTechnique: 'Other', commonTrap: 'Picking a synonym of FAST (QUICK or RAPID) by momentum, when the stem relation actually calls for an opposite.',
      tags: ['analogy', 'antonym']
    },
    {
      id: 'rv_an006', topic: 'Verbal Reasoning', subtopic: 'Analogies', difficulty: 2, targetTime: 25,
      prompt: 'GENEROUS is to STINGY as OPTIMISTIC is to ?',
      answerType: 'mc', options: ['PESSIMISTIC', 'HOPEFUL', 'CHEERFUL', 'CONFIDENT'], correctAnswer: 'PESSIMISTIC',
      hint: 'The stem pair describe opposite personality traits.',
      approach: 'Relation: antonym pair.',
      solution: 'GENEROUS and STINGY are opposites. PESSIMISTIC is the opposite of OPTIMISTIC. HOPEFUL and CHEERFUL are close synonyms of OPTIMISTIC, not opposites; CONFIDENT is an unrelated trait.',
      recognitionTechnique: 'Other', commonTrap: 'Choosing a word that merely sounds negative rather than the specific direct opposite of OPTIMISTIC.',
      tags: ['analogy', 'antonym']
    },
    {
      id: 'rv_an007', topic: 'Verbal Reasoning', subtopic: 'Analogies', difficulty: 2, targetTime: 25,
      prompt: 'TRANSPARENT is to OPAQUE as ABUNDANT is to ?',
      answerType: 'mc', options: ['SCARCE', 'PLENTIFUL', 'CLEAR', 'FREQUENT'], correctAnswer: 'SCARCE',
      hint: 'The stem pair describe opposite levels of see-through-ness.',
      approach: 'Relation: antonym pair.',
      solution: 'TRANSPARENT and OPAQUE are opposites. SCARCE is the opposite of ABUNDANT. PLENTIFUL is a synonym of ABUNDANT; CLEAR and FREQUENT are unrelated to quantity.',
      recognitionTechnique: 'Other', commonTrap: 'Picking PLENTIFUL because it "goes with" abundant, without checking the stem relation requires an opposite, not a synonym.',
      tags: ['analogy', 'antonym']
    },
    {
      id: 'rv_an008', topic: 'Verbal Reasoning', subtopic: 'Analogies', difficulty: 2, targetTime: 25,
      prompt: 'EXPAND is to CONTRACT as ACCELERATE is to ?',
      answerType: 'mc', options: ['DECELERATE', 'SPEED', 'INCREASE', 'MOVE'], correctAnswer: 'DECELERATE',
      hint: 'The stem pair are opposite directions of change.',
      approach: 'Relation: antonym pair.',
      solution: 'EXPAND and CONTRACT are opposite processes. DECELERATE is the opposite of ACCELERATE. SPEED and INCREASE are close in meaning to ACCELERATE, not opposites; MOVE is unrelated.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing "related to acceleration" with "opposite of acceleration."',
      tags: ['analogy', 'antonym']
    },

    {
      id: 'rv_an009', topic: 'Verbal Reasoning', subtopic: 'Analogies', difficulty: 2, targetTime: 25,
      prompt: 'WHEEL is to CAR as PAGE is to ?',
      answerType: 'mc', options: ['BOOK', 'LIBRARY', 'CHAPTER', 'PENCIL'], correctAnswer: 'BOOK',
      hint: 'The first word is a PART; the second word is the WHOLE it belongs to.',
      approach: 'Relation: part-to-whole. Find what a PAGE is a part of.',
      solution: 'A WHEEL is a part of a CAR (the whole). A PAGE is a part of a BOOK (the whole). LIBRARY is too broad (a collection of books, not the direct whole); CHAPTER is itself another PART of a book, not the whole; PENCIL is unrelated.',
      recognitionTechnique: 'Other', commonTrap: 'Picking CHAPTER because it is "bigger than a page" — bigger is not the same as being the WHOLE the part belongs to.',
      tags: ['analogy', 'part-whole']
    },
    {
      id: 'rv_an010', topic: 'Verbal Reasoning', subtopic: 'Analogies', difficulty: 2, targetTime: 25,
      prompt: 'BRANCH is to TREE as ROOM is to ?',
      answerType: 'mc', options: ['HOUSE', 'FURNITURE', 'DOOR', 'NEIGHBORHOOD'], correctAnswer: 'HOUSE',
      hint: 'The first word is a PART; the second word is the WHOLE.',
      approach: 'Relation: part-to-whole.',
      solution: 'A BRANCH is a part of a TREE. A ROOM is a part of a HOUSE. FURNITURE is contained within a room, not the whole containing the room; DOOR is itself a part, like ROOM; NEIGHBORHOOD is too broad (many houses, not the direct whole).',
      recognitionTechnique: 'Other', commonTrap: 'Selecting NEIGHBORHOOD because a house is "part of" one too — the correct whole is the most immediate, direct one, matching how BRANCH relates to TREE (one level, not two).',
      tags: ['analogy', 'part-whole']
    },
    {
      id: 'rv_an011', topic: 'Verbal Reasoning', subtopic: 'Analogies', difficulty: 2, targetTime: 25,
      prompt: 'CHAPTER is to BOOK as SCENE is to ?',
      answerType: 'mc', options: ['PLAY', 'ACTOR', 'STAGE', 'AUDIENCE'], correctAnswer: 'PLAY',
      hint: 'The first word is a PART; the second word is the WHOLE.',
      approach: 'Relation: part-to-whole.',
      solution: 'A CHAPTER is a part of a BOOK. A SCENE is a part of a PLAY. ACTOR, STAGE and AUDIENCE are all things involved in a play, but none of them is the WHOLE that a scene is a piece of.',
      recognitionTechnique: 'Other', commonTrap: 'Picking any word that is thematically related to "scene" (like STAGE) instead of the one that a scene is literally a subdivision of.',
      tags: ['analogy', 'part-whole']
    },
    {
      id: 'rv_an012', topic: 'Verbal Reasoning', subtopic: 'Analogies', difficulty: 2, targetTime: 25,
      prompt: 'TOE is to FOOT as FINGER is to ?',
      answerType: 'mc', options: ['HAND', 'ARM', 'NAIL', 'RING'], correctAnswer: 'HAND',
      hint: 'Match the exact same "distance" between part and whole as in the stem — not one step further.',
      approach: 'Relation: part-to-whole, at the most immediate level.',
      solution: 'A TOE is a part of a FOOT (one direct level up). A FINGER is a part of a HAND (the same one direct level up). ARM is a level further still (the hand is part of the arm), which breaks the exact parallel; NAIL is a part OF a finger, the wrong direction; RING is an unrelated accessory.',
      recognitionTechnique: 'Other', commonTrap: 'Picking ARM because it is "in the right area" without checking it is one step too far to match the stem\'s level of part-to-whole.',
      tags: ['analogy', 'part-whole']
    },

    {
      id: 'rv_an013', topic: 'Verbal Reasoning', subtopic: 'Analogies', difficulty: 2, targetTime: 25,
      prompt: 'SPARK is to FIRE as VIRUS is to ?',
      answerType: 'mc', options: ['INFECTION', 'MEDICINE', 'DOCTOR', 'HEALTH'], correctAnswer: 'INFECTION',
      hint: 'The first word CAUSES the second word.',
      approach: 'Relation: cause and effect.',
      solution: 'A SPARK causes a FIRE. A VIRUS causes an INFECTION. MEDICINE and DOCTOR are things that respond to a virus, not effects it causes; HEALTH is closer to the opposite of the effect a virus causes.',
      recognitionTechnique: 'Other', commonTrap: 'Picking a word merely associated with "virus" (like DOCTOR) rather than the specific thing it directly causes.',
      tags: ['analogy', 'cause-effect']
    },
    {
      id: 'rv_an014', topic: 'Verbal Reasoning', subtopic: 'Analogies', difficulty: 2, targetTime: 25,
      prompt: 'STUDY is to KNOWLEDGE as EXERCISE is to ?',
      answerType: 'mc', options: ['FITNESS', 'WEAKNESS', 'GYM', 'SPORT'], correctAnswer: 'FITNESS',
      hint: 'The first word, done consistently, produces the second word as a result.',
      approach: 'Relation: cause and effect (the intended, positive long-run result).',
      solution: 'STUDY produces KNOWLEDGE as its intended result. EXERCISE produces FITNESS as its intended result. WEAKNESS is the opposite of the intended effect; GYM is a place, not an effect; SPORT is a related activity, not a result.',
      recognitionTechnique: 'Other', commonTrap: 'Picking a plausible short-term side effect (like fatigue) instead of the intended long-run result that mirrors "knowledge."',
      tags: ['analogy', 'cause-effect']
    },
    {
      id: 'rv_an015', topic: 'Verbal Reasoning', subtopic: 'Analogies', difficulty: 3, targetTime: 30,
      prompt: 'DROUGHT is to FAMINE as NEGLIGENCE is to ?',
      answerType: 'mc', options: ['ACCIDENT', 'CARELESSNESS', 'SAFETY', 'INSURANCE'], correctAnswer: 'ACCIDENT',
      hint: 'The first word CAUSES the second word — CARELESSNESS just means the same thing as NEGLIGENCE, it is not an effect of it.',
      approach: 'Relation: cause and effect.',
      solution: 'A DROUGHT causes a FAMINE. NEGLIGENCE causes an ACCIDENT. CARELESSNESS is a near-synonym of NEGLIGENCE, not its effect; SAFETY is closer to the opposite of the effect; INSURANCE is an unrelated financial product.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing a synonym of the first word (CARELESSNESS) with the effect the first word produces.',
      tags: ['analogy', 'cause-effect']
    },
    {
      id: 'rv_an016', topic: 'Verbal Reasoning', subtopic: 'Analogies', difficulty: 2, targetTime: 25,
      prompt: 'PRACTICE is to SKILL as SAVING is to ?',
      answerType: 'mc', options: ['WEALTH', 'SPENDING', 'BANK', 'DEBT'], correctAnswer: 'WEALTH',
      hint: 'The first word, sustained over time, builds up the second word.',
      approach: 'Relation: cause and effect (accumulation).',
      solution: 'Sustained PRACTICE builds up SKILL. Sustained SAVING builds up WEALTH. SPENDING and DEBT work against accumulation, closer to opposite effects; BANK is a place, not an effect.',
      recognitionTechnique: 'Other', commonTrap: 'Picking BANK because it is the place most associated with saving, rather than the actual accumulated result.',
      tags: ['analogy', 'cause-effect']
    },

    {
      id: 'rv_an017', topic: 'Verbal Reasoning', subtopic: 'Analogies', difficulty: 2, targetTime: 25,
      prompt: 'SCALPEL is to SURGEON as GAVEL is to ?',
      answerType: 'mc', options: ['JUDGE', 'LAWYER', 'COURT', 'JURY'], correctAnswer: 'JUDGE',
      hint: 'Who is the one person that actually wields the tool named second?',
      approach: 'Relation: tool used by a specific professional.',
      solution: 'A SCALPEL is the tool a SURGEON personally uses. A GAVEL is the tool a JUDGE personally uses. LAWYER and JURY are present in a courtroom but do not use a gavel; COURT is a place, not a person.',
      recognitionTechnique: 'Other', commonTrap: 'Picking any courtroom-related role instead of specifically the one who wields the gavel.',
      tags: ['analogy', 'tool-user']
    },
    {
      id: 'rv_an018', topic: 'Verbal Reasoning', subtopic: 'Analogies', difficulty: 2, targetTime: 25,
      prompt: 'STETHOSCOPE is to DOCTOR as WHISK is to ?',
      answerType: 'mc', options: ['CHEF', 'WAITER', 'FARMER', 'BUTCHER'], correctAnswer: 'CHEF',
      hint: 'Who actually uses this specific kitchen tool?',
      approach: 'Relation: tool used by a specific professional.',
      solution: 'A STETHOSCOPE is a tool a DOCTOR personally uses. A WHISK is a tool a CHEF personally uses. WAITER, FARMER and BUTCHER are food-related roles but do not typically use a whisk as their characteristic tool.',
      recognitionTechnique: 'Other', commonTrap: 'Picking any food-industry role instead of the specific one that wields this exact tool.',
      tags: ['analogy', 'tool-user']
    },
    {
      id: 'rv_an019', topic: 'Verbal Reasoning', subtopic: 'Analogies', difficulty: 2, targetTime: 25,
      prompt: 'TELESCOPE is to ASTRONOMER as MICROSCOPE is to ?',
      answerType: 'mc', options: ['BIOLOGIST', 'OPTICIAN', 'PHOTOGRAPHER', 'JEWELER'], correctAnswer: 'BIOLOGIST',
      hint: 'One tool lets you see very far away; the other lets you see very small things — who studies very small things?',
      approach: 'Relation: tool used by a specific professional.',
      solution: 'A TELESCOPE is the characteristic tool of an ASTRONOMER (who studies distant objects). A MICROSCOPE is the characteristic tool of a BIOLOGIST (who studies tiny structures). OPTICIAN, PHOTOGRAPHER and JEWELER use different optical tools (lenses, cameras, loupes), not microscopes as their defining instrument.',
      recognitionTechnique: 'Other', commonTrap: 'Picking OPTICIAN just because the word sounds related to lenses and optics.',
      tags: ['analogy', 'tool-user']
    },
    {
      id: 'rv_an020', topic: 'Verbal Reasoning', subtopic: 'Analogies', difficulty: 2, targetTime: 25,
      prompt: 'ANVIL is to BLACKSMITH as EASEL is to ?',
      answerType: 'mc', options: ['PAINTER', 'SCULPTOR', 'CARPENTER', 'MASON'], correctAnswer: 'PAINTER',
      hint: 'Who sets their canvas on this stand while working?',
      approach: 'Relation: tool used by a specific professional.',
      solution: 'An ANVIL is the characteristic workstation of a BLACKSMITH. An EASEL is the characteristic workstation of a PAINTER. SCULPTOR, CARPENTER and MASON all work with hard materials, but none of them uses an easel.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming any "artistic" profession fits, without checking which one actually uses an easel specifically.',
      tags: ['analogy', 'tool-user']
    },

    {
      id: 'rv_an021', topic: 'Verbal Reasoning', subtopic: 'Analogies', difficulty: 2, targetTime: 25,
      prompt: 'ROSE is to FLOWER as SALMON is to ?',
      answerType: 'mc', options: ['FISH', 'OCEAN', 'MAMMAL', 'RIVER'], correctAnswer: 'FISH',
      hint: 'The second word is the broad CATEGORY the first word belongs to.',
      approach: 'Relation: member-of-category.',
      solution: 'A ROSE is a type of FLOWER. A SALMON is a type of FISH. OCEAN and RIVER are places salmon are found, not the category it belongs to; MAMMAL is a wrong category (salmon are fish, not mammals).',
      recognitionTechnique: 'Other', commonTrap: 'Picking a habitat (OCEAN/RIVER) instead of the biological category.',
      tags: ['analogy', 'category']
    },
    {
      id: 'rv_an022', topic: 'Verbal Reasoning', subtopic: 'Analogies', difficulty: 3, targetTime: 30,
      prompt: 'OAK is to TREE as COBRA is to ?',
      answerType: 'mc', options: ['SNAKE', 'REPTILE', 'LIZARD', 'AMPHIBIAN'], correctAnswer: 'SNAKE',
      hint: 'OAK is one specific TYPE of tree, not "plant" in general — match that same level of specificity.',
      approach: 'Relation: member-of-category, matched at the same level of specificity as the stem.',
      solution: 'OAK is a specific type of TREE (one level up from "oak", not two). COBRA is a specific type of SNAKE — the same one level up. REPTILE is technically true of a cobra too, but it is a broader category one level further up (as if OAK\'s pair had been "PLANT" instead of "TREE"), so it does not match the stem\'s level. LIZARD and AMPHIBIAN are simply the wrong category.',
      recognitionTechnique: 'Other', commonTrap: 'Picking the technically-true-but-too-broad category (REPTILE) instead of matching the exact specificity level used in the stem pair.',
      tags: ['analogy', 'category']
    },
    {
      id: 'rv_an023', topic: 'Verbal Reasoning', subtopic: 'Analogies', difficulty: 2, targetTime: 25,
      prompt: 'VIOLIN is to STRING INSTRUMENT as TRUMPET is to ?',
      answerType: 'mc', options: ['BRASS INSTRUMENT', 'WOODWIND INSTRUMENT', 'PERCUSSION INSTRUMENT', 'ORCHESTRA'], correctAnswer: 'BRASS INSTRUMENT',
      hint: 'What instrument family does a trumpet belong to?',
      approach: 'Relation: member-of-category.',
      solution: 'A VIOLIN belongs to the STRING INSTRUMENT family. A TRUMPET belongs to the BRASS INSTRUMENT family. WOODWIND and PERCUSSION are different, wrong families; ORCHESTRA is a performing group, not an instrument category.',
      recognitionTechnique: 'Other', commonTrap: 'Guessing WOODWIND because trumpets have finger-operated valves similar to some woodwind fingerings, rather than recalling that sound is produced by a brass mouthpiece.',
      tags: ['analogy', 'category']
    },
    {
      id: 'rv_an024', topic: 'Verbal Reasoning', subtopic: 'Analogies', difficulty: 3, targetTime: 30,
      prompt: 'GOLD is to METAL as OXYGEN is to ?',
      answerType: 'mc', options: ['GAS', 'ELEMENT', 'LIQUID', 'COMPOUND'], correctAnswer: 'GAS',
      hint: 'GOLD is classified by the type of MATERIAL it is (a metal), not simply by the fact that it is a chemical element — find the material-type classification of oxygen.',
      approach: 'Relation: member-of-category, matched by the SAME kind of classification used in the stem.',
      solution: 'GOLD is classified as a METAL — a material-state / material-type category. OXYGEN, by that same kind of classification, is a GAS. ELEMENT is true of gold too (gold is also a chemical element), so it fails to mirror the specific "material type" relation the stem uses; LIQUID is factually wrong for oxygen at room temperature; COMPOUND is wrong (oxygen gas, O₂, is an element, not a compound).',
      recognitionTechnique: 'Other', commonTrap: 'Picking ELEMENT because it is technically true of oxygen, without checking that it is equally true of gold and therefore does not mirror the specific relation used in the stem.',
      tags: ['analogy', 'category']
    },

    /* ========================= CLASSIFICATION / INTRUDER ========================= */
    /* Five of six words share one property; the sixth breaks it. */

    {
      id: 'rv_cl001', topic: 'Verbal Reasoning', subtopic: 'Classification', difficulty: 1, targetTime: 20,
      prompt: 'Which word does NOT belong with the others? Apple, Banana, Carrot, Orange, Grape',
      answerType: 'mc', options: ['Apple', 'Banana', 'Carrot', 'Orange', 'Grape'], correctAnswer: 'Carrot',
      hint: 'Four of these grow on plants and are eaten as sweet, seed-bearing produce — which one is a root vegetable instead?',
      approach: 'Name the shared category explicitly, then test each word against it.',
      solution: 'Apple, Banana, Orange and Grape are all fruits. Carrot is a root vegetable, not a fruit.',
      recognitionTechnique: 'Other', commonTrap: 'Grouping by color or shape instead of the actual biological category (fruit vs. vegetable).',
      tags: ['classification']
    },
    {
      id: 'rv_cl002', topic: 'Verbal Reasoning', subtopic: 'Classification', difficulty: 1, targetTime: 20,
      prompt: 'Which word does NOT belong with the others? Square, Triangle, Circle, Cube, Rectangle',
      answerType: 'mc', options: ['Square', 'Triangle', 'Circle', 'Cube', 'Rectangle'], correctAnswer: 'Cube',
      hint: 'Four of these are flat shapes you could draw on paper — which one is a solid, three-dimensional object?',
      approach: 'Name the shared category explicitly, then test each word against it.',
      solution: 'Square, Triangle, Circle and Rectangle are all flat, two-dimensional shapes. Cube is a three-dimensional solid.',
      recognitionTechnique: 'Other', commonTrap: 'Grouping by "has straight edges" (which would wrongly exclude Circle too) instead of the dimensionality property that cleanly isolates Cube.',
      tags: ['classification']
    },
    {
      id: 'rv_cl003', topic: 'Verbal Reasoning', subtopic: 'Classification', difficulty: 2, targetTime: 25,
      prompt: 'Which word does NOT belong with the others? Salmon, Trout, Dolphin, Cod, Herring',
      answerType: 'mc', options: ['Salmon', 'Trout', 'Dolphin', 'Cod', 'Herring'], correctAnswer: 'Dolphin',
      hint: 'Four of these breathe through gills; one breathes air through lungs.',
      approach: 'Name the shared category explicitly, then test each word against it.',
      solution: 'Salmon, Trout, Cod and Herring are all fish. A Dolphin is a marine mammal, not a fish, despite living in water.',
      recognitionTechnique: 'Other', commonTrap: 'Grouping by "lives in water" instead of the correct biological class, which wrongly includes Dolphin.',
      tags: ['classification']
    },
    {
      id: 'rv_cl004', topic: 'Verbal Reasoning', subtopic: 'Classification', difficulty: 2, targetTime: 25,
      prompt: 'Which word does NOT belong with the others? Hammer, Screwdriver, Wrench, Nail, Pliers',
      answerType: 'mc', options: ['Hammer', 'Screwdriver', 'Wrench', 'Nail', 'Pliers'], correctAnswer: 'Nail',
      hint: 'Four of these are hand-held tools that DO something; one is the small metal object a tool acts on.',
      approach: 'Name the shared category explicitly, then test each word against it.',
      solution: 'Hammer, Screwdriver, Wrench and Pliers are all tools used to perform an action. A Nail is a fastener acted upon (e.g. by a hammer), not itself a tool.',
      recognitionTechnique: 'Other', commonTrap: 'Grouping by "found in a toolbox" (which would wrongly include Nail too) instead of "is a tool that performs an action."',
      tags: ['classification']
    },
    {
      id: 'rv_cl005', topic: 'Verbal Reasoning', subtopic: 'Classification', difficulty: 2, targetTime: 25,
      prompt: 'Which word does NOT belong with the others? Piano, Violin, Guitar, Harp, Flute',
      answerType: 'mc', options: ['Piano', 'Violin', 'Guitar', 'Harp', 'Flute'], correctAnswer: 'Flute',
      hint: 'Four of these produce sound from vibrating strings; one is played by blowing air.',
      approach: 'Name the shared category explicitly, then test each word against it.',
      solution: 'Piano, Violin, Guitar and Harp all produce sound via strings. A Flute is a woodwind instrument, producing sound from a column of air.',
      recognitionTechnique: 'Other', commonTrap: 'Grouping by "classical orchestra instrument" (which would wrongly include Flute too) instead of the actual sound-production mechanism.',
      tags: ['classification']
    },
    {
      id: 'rv_cl006', topic: 'Verbal Reasoning', subtopic: 'Classification', difficulty: 2, targetTime: 25,
      prompt: 'Which word does NOT belong with the others? Kilometer, Liter, Meter, Mile, Yard',
      answerType: 'mc', options: ['Kilometer', 'Liter', 'Meter', 'Mile', 'Yard'], correctAnswer: 'Liter',
      hint: 'Four of these measure distance; one measures volume.',
      approach: 'Name the shared category explicitly, then test each word against it.',
      solution: 'Kilometer, Meter, Mile and Yard are all units of length. A Liter is a unit of volume.',
      recognitionTechnique: 'Other', commonTrap: 'Grouping by "unit of measurement" too broadly instead of the specific quantity (length vs. volume) being measured.',
      tags: ['classification']
    },
    {
      id: 'rv_cl007', topic: 'Verbal Reasoning', subtopic: 'Classification', difficulty: 2, targetTime: 25,
      prompt: 'Which word does NOT belong with the others? Whisper, Shout, Murmur, Mumble, Walk',
      answerType: 'mc', options: ['Whisper', 'Shout', 'Murmur', 'Mumble', 'Walk'], correctAnswer: 'Walk',
      hint: 'Four of these describe HOW someone speaks; one describes a different kind of action entirely.',
      approach: 'Name the shared category explicitly, then test each word against it.',
      solution: 'Whisper, Shout, Murmur and Mumble all describe ways of speaking. Walk describes a way of moving, not speaking.',
      recognitionTechnique: 'Other', commonTrap: 'Grouping by "quiet vs. loud" and missing that the real distinguishing property is "speaking verb vs. non-speaking verb."',
      tags: ['classification']
    },
    {
      id: 'rv_cl008', topic: 'Verbal Reasoning', subtopic: 'Classification', difficulty: 3, targetTime: 30,
      prompt: 'Which word does NOT belong with the others? Oxygen, Nitrogen, Helium, Water, Argon',
      answerType: 'mc', options: ['Oxygen', 'Nitrogen', 'Helium', 'Water', 'Argon'], correctAnswer: 'Water',
      hint: 'Four of these cannot be broken down into simpler substances; one is a combination of other substances.',
      approach: 'Name the shared category explicitly, then test each word against it.',
      solution: 'Oxygen, Nitrogen, Helium and Argon are all pure chemical elements (single entries on the periodic table). Water is a compound, made of hydrogen and oxygen bonded together.',
      recognitionTechnique: 'Other', commonTrap: 'Grouping by "found in air" (which would wrongly include water vapor too) instead of the element-versus-compound distinction.',
      tags: ['classification']
    },
    {
      id: 'rv_cl009', topic: 'Verbal Reasoning', subtopic: 'Classification', difficulty: 2, targetTime: 25,
      prompt: 'Which word does NOT belong with the others? Whale, Dolphin, Seal, Otter, Shark',
      answerType: 'mc', options: ['Whale', 'Dolphin', 'Seal', 'Otter', 'Shark'], correctAnswer: 'Shark',
      hint: 'Four of these nurse their young with milk; one lays eggs or gives birth without nursing, and breathes entirely through gills.',
      approach: 'Name the shared category explicitly, then test each word against it.',
      solution: 'Whale, Dolphin, Seal and Otter are all mammals. Shark is a fish.',
      recognitionTechnique: 'Other', commonTrap: 'Grouping by "lives in the ocean," which wrongly includes Shark alongside the marine mammals.',
      tags: ['classification']
    },
    {
      id: 'rv_cl010', topic: 'Verbal Reasoning', subtopic: 'Classification', difficulty: 1, targetTime: 20,
      prompt: 'Which word does NOT belong with the others? Red, Blue, Green, Circle, Yellow',
      answerType: 'mc', options: ['Red', 'Blue', 'Green', 'Circle', 'Yellow'], correctAnswer: 'Circle',
      hint: 'Four of these describe how something looks in terms of hue; one describes its outline instead.',
      approach: 'Name the shared category explicitly, then test each word against it.',
      solution: 'Red, Blue, Green and Yellow are all colors. Circle is a shape, not a color.',
      recognitionTechnique: 'Other', commonTrap: 'Rushing past the obvious category and missing that "Circle" is a different TYPE of property (shape) entirely.',
      tags: ['classification']
    },
    {
      id: 'rv_cl011', topic: 'Verbal Reasoning', subtopic: 'Classification', difficulty: 1, targetTime: 20,
      prompt: 'Which word does NOT belong with the others? Monday, Tuesday, March, Friday, Sunday',
      answerType: 'mc', options: ['Monday', 'Tuesday', 'March', 'Friday', 'Sunday'], correctAnswer: 'March',
      hint: 'Four of these are days of the week; one is a month of the year.',
      approach: 'Name the shared category explicitly, then test each word against it.',
      solution: 'Monday, Tuesday, Friday and Sunday are all days of the week. March is a month.',
      recognitionTechnique: 'Other', commonTrap: 'Grouping by "unit of the calendar" too broadly instead of the specific unit (day vs. month).',
      tags: ['classification']
    },
    {
      id: 'rv_cl012', topic: 'Verbal Reasoning', subtopic: 'Classification', difficulty: 2, targetTime: 25,
      prompt: 'Which word does NOT belong with the others? Novel, Poem, Essay, Painting, Biography',
      answerType: 'mc', options: ['Novel', 'Poem', 'Essay', 'Painting', 'Biography'], correctAnswer: 'Painting',
      hint: 'Four of these are made entirely of written words; one is a visual artwork.',
      approach: 'Name the shared category explicitly, then test each word against it.',
      solution: 'Novel, Poem, Essay and Biography are all written literary forms. Painting is a visual art form, not a written one.',
      recognitionTechnique: 'Other', commonTrap: 'Grouping by "creative work" too broadly, which wrongly includes Painting alongside the literary forms.',
      tags: ['classification']
    },
    {
      id: 'rv_cl013', topic: 'Verbal Reasoning', subtopic: 'Classification', difficulty: 2, targetTime: 25,
      prompt: 'Which word does NOT belong with the others? Copper, Aluminum, Plastic, Iron, Silver',
      answerType: 'mc', options: ['Copper', 'Aluminum', 'Plastic', 'Iron', 'Silver'], correctAnswer: 'Plastic',
      hint: 'Four of these are metallic elements found on the periodic table; one is a synthetic, non-metal material.',
      approach: 'Name the shared category explicitly, then test each word against it.',
      solution: 'Copper, Aluminum, Iron and Silver are all metals. Plastic is a synthetic polymer, not a metal.',
      recognitionTechnique: 'Other', commonTrap: 'Grouping by "used to make everyday objects," which wrongly includes Plastic alongside the metals.',
      tags: ['classification']
    },
    {
      id: 'rv_cl014', topic: 'Verbal Reasoning', subtopic: 'Classification', difficulty: 3, targetTime: 30,
      prompt: 'Which word does NOT belong with the others? Democracy, Monarchy, Oligarchy, Republic, Continent',
      answerType: 'mc', options: ['Democracy', 'Monarchy', 'Oligarchy', 'Republic', 'Continent'], correctAnswer: 'Continent',
      hint: 'Four of these describe HOW a country is governed; one describes a landmass, unrelated to governance.',
      approach: 'Name the shared category explicitly, then test each word against it.',
      solution: 'Democracy, Monarchy, Oligarchy and Republic are all forms of government/political system. A Continent is a large landmass, with no connection to how it is governed.',
      recognitionTechnique: 'Other', commonTrap: 'Overthinking whether "Democracy" and "Republic" are different enough to both belong — both ARE forms of political system, so the real outlier is the landmass term.',
      tags: ['classification']
    },
    {
      id: 'rv_cl015', topic: 'Verbal Reasoning', subtopic: 'Classification', difficulty: 1, targetTime: 20,
      prompt: 'Which word does NOT belong with the others? Inch, Foot, Yard, Pound, Mile',
      answerType: 'mc', options: ['Inch', 'Foot', 'Yard', 'Pound', 'Mile'], correctAnswer: 'Pound',
      hint: 'Four of these measure distance; one measures weight.',
      approach: 'Name the shared category explicitly, then test each word against it.',
      solution: 'Inch, Foot, Yard and Mile are all units of length. A Pound is a unit of weight.',
      recognitionTechnique: 'Other', commonTrap: 'Grouping by "imperial unit" too broadly instead of the specific quantity being measured.',
      tags: ['classification']
    },
    {
      id: 'rv_cl016', topic: 'Verbal Reasoning', subtopic: 'Classification', difficulty: 2, targetTime: 25,
      prompt: 'Which word does NOT belong with the others? Anxious, Nervous, Worried, Confident, Tense',
      answerType: 'mc', options: ['Anxious', 'Nervous', 'Worried', 'Confident', 'Tense'], correctAnswer: 'Confident',
      hint: 'Four of these describe feeling uneasy about an outcome; one describes feeling secure about it.',
      approach: 'Name the shared category explicitly, then test each word against it.',
      solution: 'Anxious, Nervous, Worried and Tense all describe unease. Confident describes the opposite emotional state — self-assurance, not unease.',
      recognitionTechnique: 'Other', commonTrap: 'Grouping by "emotion word" too broadly, which wrongly includes Confident alongside the unease-related words.',
      tags: ['classification']
    },

    /* ==================== STATEMENT REASONING (True / False / Cannot Say) ==================== */
    /* Watson-Glaser style: judge only what the passage logically forces, never
       what merely sounds plausible in the real world. True = the statement
       must follow. False = the statement directly contradicts the passage.
       Cannot Say = the passage does not give enough information either way. */

    {
      id: 'rv_st001', topic: 'Verbal Reasoning', subtopic: 'Statement reasoning', difficulty: 2, targetTime: 35,
      prompt: 'Passage: "All employees at Meridian Corp who have worked for more than five years receive an extra week of paid leave. Priya has worked at Meridian Corp for seven years." Statement: "Priya receives an extra week of paid leave." Is this statement TRUE, FALSE, or CANNOT SAY, based only on the passage?',
      answerType: 'mc', options: ['True', 'False', 'Cannot Say'], correctAnswer: 'True',
      hint: 'Check whether Priya\'s stated years of service satisfy the exact condition given in the rule.',
      approach: 'Apply the stated rule directly to the stated fact: 7 years > 5 years, so the rule\'s condition is met.',
      solution: 'The rule applies to anyone with more than five years of service. Priya has seven years, which satisfies "more than five." The conclusion follows directly. True.',
      recognitionTechnique: 'Other', commonTrap: 'Second-guessing a straightforward, directly-stated deduction by looking for a hidden catch that isn\'t there.',
      tags: ['statement-reasoning']
    },
    {
      id: 'rv_st002', topic: 'Verbal Reasoning', subtopic: 'Statement reasoning', difficulty: 3, targetTime: 40,
      prompt: 'Passage: "Every certified auditor at the firm has passed the CPA exam. Marcus has passed the CPA exam." Statement: "Marcus is a certified auditor at the firm." Is this statement TRUE, FALSE, or CANNOT SAY, based only on the passage?',
      answerType: 'mc', options: ['True', 'False', 'Cannot Say'], correctAnswer: 'Cannot Say',
      hint: 'The rule says certified auditors have passed the exam — it does not say everyone who passed the exam is a certified auditor at this firm.',
      approach: 'This is "affirming the consequent": the rule only runs one direction (certified ⇒ passed exam), so knowing someone passed the exam does not establish certification.',
      solution: 'The passage guarantees passing the exam is NECESSARY for certification, not that it is SUFFICIENT. Many people could pass the CPA exam without being certified auditors at this specific firm. Cannot Say.',
      recognitionTechnique: 'Other', commonTrap: 'Treating "certified auditors have passed the exam" as if it also meant "everyone who passed the exam is a certified auditor."',
      tags: ['statement-reasoning', 'affirming-consequent']
    },
    {
      id: 'rv_st003', topic: 'Verbal Reasoning', subtopic: 'Statement reasoning', difficulty: 3, targetTime: 40,
      prompt: 'Passage: "No members of the trading desk hold personal positions in securities they cover professionally, according to this year\'s company records. Company records show that Elena holds a personal position in a semiconductor stock she covers professionally this year." Statement: "According to company records, Elena is not a member of the trading desk this year." Is this statement TRUE, FALSE, or CANNOT SAY, based only on the passage?',
      answerType: 'mc', options: ['True', 'False', 'Cannot Say'], correctAnswer: 'True',
      hint: 'The passage states a fact about ALL trading-desk members as recorded this year, not just a permission or policy.',
      approach: 'This is modus tollens: "No M are P" plus "Elena is P" forces "Elena is not M."',
      solution: 'Company records state, as fact, that no trading-desk member holds such a position. Elena does hold one. So, according to those same records, she cannot be a member of the trading desk. True.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing a stated FACT ("no member does X, per records") with a mere POLICY that could in principle be violated — here the passage asserts it as an established record, not a rule someone might be secretly breaking.',
      tags: ['statement-reasoning', 'modus-tollens']
    },
    {
      id: 'rv_st004', topic: 'Verbal Reasoning', subtopic: 'Statement reasoning', difficulty: 2, targetTime: 30,
      prompt: 'Passage: "The fund\'s mandate prohibits investing more than 5% of assets in any single issuer. As of today, the fund holds 4.8% of its assets in Company X." Statement: "The fund is in compliance with its single-issuer concentration limit today." Is this statement TRUE, FALSE, or CANNOT SAY, based only on the passage?',
      answerType: 'mc', options: ['True', 'False', 'Cannot Say'], correctAnswer: 'True',
      hint: 'Compare the stated holding directly against the stated limit.',
      approach: 'Direct numeric comparison against the stated threshold.',
      solution: '4.8% is below the 5% limit, so the mandate\'s condition is satisfied for Company X as described. True.',
      recognitionTechnique: 'Other', commonTrap: 'Overlooking that the passage only discusses ONE issuer — but the statement being tested is specifically about compliance regarding that limit as described, which the numbers directly support.',
      tags: ['statement-reasoning']
    },
    {
      id: 'rv_st005', topic: 'Verbal Reasoning', subtopic: 'Statement reasoning', difficulty: 3, targetTime: 40,
      prompt: 'Passage: "Analysts who cover more than 15 companies report lower AVERAGE forecast accuracy than analysts who cover 15 or fewer. Analyst Chen covers 12 companies." Statement: "Chen has higher forecast accuracy than every individual analyst who covers more than 15 companies." Is this statement TRUE, FALSE, or CANNOT SAY, based only on the passage?',
      answerType: 'mc', options: ['True', 'False', 'Cannot Say'], correctAnswer: 'Cannot Say',
      hint: 'The passage compares GROUP AVERAGES, not every possible individual pairing.',
      approach: 'A comparison of averages between two groups does not guarantee that every member of one group beats every member of the other.',
      solution: 'The passage only establishes that Chen\'s group has a higher average than the other group. It says nothing about Chen\'s individual accuracy compared to every specific analyst in the other group — some individual in the ">15" group could still outperform Chen personally. Cannot Say.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming a true statement about group averages automatically applies to every individual pairing within those groups.',
      tags: ['statement-reasoning', 'group-vs-individual']
    },
    {
      id: 'rv_st006', topic: 'Verbal Reasoning', subtopic: 'Statement reasoning', difficulty: 2, targetTime: 35,
      prompt: 'Passage: "Every bond in the portfolio has a credit rating of at least BBB. The portfolio contains exactly 40 bonds." Statement: "None of the bonds in the portfolio has a credit rating below BBB." Is this statement TRUE, FALSE, or CANNOT SAY, based only on the passage?',
      answerType: 'mc', options: ['True', 'False', 'Cannot Say'], correctAnswer: 'True',
      hint: '"At least BBB" and "not below BBB" describe exactly the same set of ratings.',
      approach: 'Restate the quantifier carefully: "at least BBB" is logically identical to "not below BBB."',
      solution: '"At least BBB" means BBB or any higher rating — which is exactly the same condition as "not below BBB." The statement is a direct restatement of the given fact. True.',
      recognitionTechnique: 'Other', commonTrap: 'Treating a careful restatement of the same fact as if it required extra unstated information.',
      tags: ['statement-reasoning']
    },
    {
      id: 'rv_st007', topic: 'Verbal Reasoning', subtopic: 'Statement reasoning', difficulty: 3, targetTime: 40,
      prompt: 'Passage: "Since the new compliance software was installed in March, the number of flagged transactions has risen every month." Statement: "The new compliance software caused the increase in flagged transactions." Is this statement TRUE, FALSE, or CANNOT SAY, based only on the passage?',
      answerType: 'mc', options: ['True', 'False', 'Cannot Say'], correctAnswer: 'Cannot Say',
      hint: 'The passage only establishes that the two things happened around the same time.',
      approach: 'Correlation (or mere timing) does not establish causation. Some other factor — like rising trading volume — could explain the rise instead.',
      solution: 'The passage only tells us the timing lines up, not that the software is the CAUSE. An unstated third factor could explain the increase. Cannot Say.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming that because one event followed another, the first must have caused the second.',
      tags: ['statement-reasoning', 'correlation-causation']
    },
    {
      id: 'rv_st008', topic: 'Verbal Reasoning', subtopic: 'Statement reasoning', difficulty: 4, targetTime: 50,
      prompt: 'Passage: "All interns in the summer program are assigned a mentor. No mentor is assigned more than three interns at once. There are 45 interns in this summer\'s program." Statement: "The program has at least 15 mentors this summer." Is this statement TRUE, FALSE, or CANNOT SAY, based only on the passage?',
      answerType: 'mc', options: ['True', 'False', 'Cannot Say'], correctAnswer: 'True',
      hint: 'If every mentor covers at most 3 interns, how few mentors could possibly cover all 45?',
      approach: 'Pigeonhole-style deduction: minimum mentors needed = total interns ÷ maximum interns per mentor, rounded up.',
      solution: 'All 45 interns must be covered, and no mentor covers more than 3. The fewest mentors that could cover 45 interns at 3 each is 45 ÷ 3 = 15. Since all interns ARE assigned (stated as fact), at least 15 mentors must exist. True.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming the passage does not give "enough" information because it never states the number of mentors directly, missing that the two given facts force a minimum.',
      tags: ['statement-reasoning', 'pigeonhole']
    },
    {
      id: 'rv_st009', topic: 'Verbal Reasoning', subtopic: 'Statement reasoning', difficulty: 2, targetTime: 30,
      prompt: 'Passage: "Most senior partners at the firm studied economics or finance as undergraduates. Raj is a senior partner at the firm." Statement: "Raj studied economics or finance as an undergraduate." Is this statement TRUE, FALSE, or CANNOT SAY, based only on the passage?',
      answerType: 'mc', options: ['True', 'False', 'Cannot Say'], correctAnswer: 'Cannot Say',
      hint: '"Most" is not the same as "all" — some senior partners are the exception.',
      approach: 'A "most" statement leaves open the possibility that any specific individual is in the minority.',
      solution: 'The passage says MOST senior partners fit this description, not ALL. Raj could be among the minority who did not study economics or finance. Cannot Say.',
      recognitionTechnique: 'Other', commonTrap: 'Reading "most" as if it meant "all," and treating group membership as automatically proving the individual case.',
      tags: ['statement-reasoning', 'quantifier']
    },
    {
      id: 'rv_st010', topic: 'Verbal Reasoning', subtopic: 'Statement reasoning', difficulty: 3, targetTime: 40,
      prompt: 'Passage: "If the quarterly revenue target is missed, the bonus pool is reduced by 20%. The bonus pool was not reduced this quarter." Statement: "The quarterly revenue target was met this quarter." Is this statement TRUE, FALSE, or CANNOT SAY, based only on the passage?',
      answerType: 'mc', options: ['True', 'False', 'Cannot Say'], correctAnswer: 'True',
      hint: 'If missing the target always triggers a reduction, and no reduction happened, what does that tell you about the target?',
      approach: 'Modus tollens: "If missed, then reduced" plus "not reduced" forces "not missed" — i.e. met.',
      solution: 'The rule guarantees a reduction whenever the target is missed. Since no reduction occurred, the target cannot have been missed — so it was met. True.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming a conditional rule only works forwards, and missing that "not reduced" lets you validly work backwards to "not missed."',
      tags: ['statement-reasoning', 'modus-tollens']
    },
    {
      id: 'rv_st011', topic: 'Verbal Reasoning', subtopic: 'Statement reasoning', difficulty: 3, targetTime: 40,
      prompt: 'Passage: "Every trader who exceeded their risk limit last quarter received a formal warning. Daniel did not receive a formal warning last quarter." Statement: "Daniel did not exceed his risk limit last quarter." Is this statement TRUE, FALSE, or CANNOT SAY, based only on the passage?',
      answerType: 'mc', options: ['True', 'False', 'Cannot Say'], correctAnswer: 'True',
      hint: 'If exceeding the limit always leads to a warning, and Daniel got no warning, what does that tell you?',
      approach: 'Modus tollens: "If exceeded, then warned" plus "not warned" forces "not exceeded."',
      solution: 'Everyone who exceeded the limit was warned. Daniel was not warned, so he cannot have exceeded the limit. True.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing this valid backward inference with the invalid forward-guessing case in the next item.',
      tags: ['statement-reasoning', 'modus-tollens']
    },
    {
      id: 'rv_st012', topic: 'Verbal Reasoning', subtopic: 'Statement reasoning', difficulty: 3, targetTime: 40,
      prompt: 'Passage: "Every trader who exceeded their risk limit last quarter received a formal warning. Daniel received a formal warning last quarter." Statement: "Daniel exceeded his risk limit last quarter." Is this statement TRUE, FALSE, or CANNOT SAY, based only on the passage?',
      answerType: 'mc', options: ['True', 'False', 'Cannot Say'], correctAnswer: 'Cannot Say',
      hint: 'The rule only says exceeding the limit leads to a warning — it does not say a warning can ONLY happen for that reason.',
      approach: 'Affirming the consequent: knowing the effect (warning) occurred does not establish the specific cause (exceeding the limit) stated in the rule.',
      solution: 'The passage never says a formal warning is given ONLY for exceeding the risk limit — other reasons for a warning are not ruled out. Cannot Say.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming the rule works in both directions, when it was only ever stated in one direction.',
      tags: ['statement-reasoning', 'affirming-consequent']
    },
    {
      id: 'rv_st013', topic: 'Verbal Reasoning', subtopic: 'Statement reasoning', difficulty: 2, targetTime: 35,
      prompt: 'Passage: "The report states that revenue grew in every region except the Northeast, where it declined by 3%." Statement: "Total company-wide revenue declined this year." Is this statement TRUE, FALSE, or CANNOT SAY, based only on the passage?',
      answerType: 'mc', options: ['True', 'False', 'Cannot Say'], correctAnswer: 'Cannot Say',
      hint: 'The passage does not say how large the Northeast region is relative to the others.',
      approach: 'Without knowing the relative sizes of each region\'s revenue, a decline in one region alone does not determine the company-wide total.',
      solution: 'One region declining does not tell us the OVERALL total, since we do not know how big that region is compared to the others whose revenue grew. Cannot Say.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming that any regional decline must drag down the company-wide total, without checking relative scale.',
      tags: ['statement-reasoning']
    },
    {
      id: 'rv_st014', topic: 'Verbal Reasoning', subtopic: 'Statement reasoning', difficulty: 1, targetTime: 25,
      prompt: 'Passage: "The report states that revenue grew in every region except the Northeast, where it declined by 3%." Statement: "Revenue in the Northeast region declined this year." Is this statement TRUE, FALSE, or CANNOT SAY, based only on the passage?',
      answerType: 'mc', options: ['True', 'False', 'Cannot Say'], correctAnswer: 'True',
      hint: 'Check what the passage says specifically about the Northeast.',
      approach: 'Direct restatement of a fact given explicitly in the passage.',
      solution: 'The passage states directly that the Northeast declined by 3%. True.',
      recognitionTechnique: 'Other', commonTrap: 'Overanalyzing a statement that is simply restating a fact given directly in the passage.',
      tags: ['statement-reasoning']
    },
    {
      id: 'rv_st015', topic: 'Verbal Reasoning', subtopic: 'Statement reasoning', difficulty: 3, targetTime: 40,
      prompt: 'Passage: "A survey of 500 randomly selected clients found that 60% preferred the new mobile app interface over the old one." Statement: "Exactly 60% of ALL the company\'s clients prefer the new interface over the old one." Is this statement TRUE, FALSE, or CANNOT SAY, based only on the passage?',
      answerType: 'mc', options: ['True', 'False', 'Cannot Say'], correctAnswer: 'Cannot Say',
      hint: 'A sample gives an ESTIMATE of the whole population, not a guaranteed exact figure for every single client.',
      approach: 'A survey result describes the sample measured; generalizing an exact percentage to the entire population as certain fact overstates what sampling can establish.',
      solution: 'The 60% figure describes the 500 surveyed clients. It is reasonable evidence about the wider client base, but the passage does not establish that the EXACT figure holds for every single client in the whole population. Cannot Say.',
      recognitionTechnique: 'Other', commonTrap: 'Treating a sample statistic as an exact, certain fact about the entire population rather than an estimate.',
      tags: ['statement-reasoning', 'sampling']
    },
    {
      id: 'rv_st016', topic: 'Verbal Reasoning', subtopic: 'Statement reasoning', difficulty: 2, targetTime: 30,
      prompt: 'Passage: "No employee may access the client database without two-factor authentication, according to policy. Yesterday, someone accessed the client database using only a single password, without two-factor authentication." Statement: "The person who accessed the database yesterday was not following the required security policy." Is this statement TRUE, FALSE, or CANNOT SAY, based only on the passage?',
      answerType: 'mc', options: ['True', 'False', 'Cannot Say'], correctAnswer: 'True',
      hint: 'This question only asks about policy-compliance, not about who the person was.',
      approach: 'Directly compare the described access method against the stated policy requirement.',
      solution: 'The policy requires two-factor authentication for any access. The described access used only a single password. That access therefore did not follow the required policy, regardless of who performed it. True.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing "did this action follow the stated policy" (directly checkable) with unrelated questions like "who is this person," which the passage does not address.',
      tags: ['statement-reasoning']
    },
    {
      id: 'rv_st017', topic: 'Verbal Reasoning', subtopic: 'Statement reasoning', difficulty: 2, targetTime: 30,
      prompt: 'Passage: "The fund\'s mandate prohibits investing more than 5% of assets in any single issuer. As of today, the fund holds 6.2% of its assets in Company Y." Statement: "The fund is in compliance with its single-issuer concentration limit today." Is this statement TRUE, FALSE, or CANNOT SAY, based only on the passage?',
      answerType: 'mc', options: ['True', 'False', 'Cannot Say'], correctAnswer: 'False',
      hint: 'Compare the stated holding directly against the stated limit — is it above or below it?',
      approach: 'Direct numeric comparison against the stated threshold.',
      solution: '6.2% exceeds the 5% limit. This directly contradicts the claim of compliance. False.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing "insufficient information to be sure" with a case where the numbers directly and unambiguously contradict the statement.',
      tags: ['statement-reasoning']
    },
    {
      id: 'rv_st018', topic: 'Verbal Reasoning', subtopic: 'Statement reasoning', difficulty: 2, targetTime: 35,
      prompt: 'Passage: "The portfolio\'s investment policy requires every bond held to carry a credit rating of at least BBB. A review of today\'s holdings shows that Bond Z, currently held in the portfolio, carries a BB rating." Statement: "The portfolio is currently in full compliance with its credit-rating policy." Is this statement TRUE, FALSE, or CANNOT SAY, based only on the passage?',
      answerType: 'mc', options: ['True', 'False', 'Cannot Say'], correctAnswer: 'False',
      hint: 'BB is one notch below BBB — check that directly against the stated minimum requirement.',
      approach: 'Direct comparison of a specific stated fact against the stated policy threshold.',
      solution: 'The policy requires at least BBB for every bond. Bond Z, currently held, carries a BB rating — below the minimum. This directly contradicts full compliance. False.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming a policy statement automatically means the policy is being followed, without checking the specific fact given that contradicts it.',
      tags: ['statement-reasoning']
    },
    {
      id: 'rv_st019', topic: 'Verbal Reasoning', subtopic: 'Statement reasoning', difficulty: 3, targetTime: 40,
      prompt: 'Passage: "If the quarterly revenue target is missed, the bonus pool is reduced by 20%. The quarterly revenue target was missed this quarter." Statement: "The bonus pool was not reduced this quarter." Is this statement TRUE, FALSE, or CANNOT SAY, based only on the passage?',
      answerType: 'mc', options: ['True', 'False', 'Cannot Say'], correctAnswer: 'False',
      hint: 'The target being missed is exactly the condition that triggers the reduction.',
      approach: 'Modus ponens: "If missed, then reduced" plus "missed" forces "reduced" — directly contradicting the statement.',
      solution: 'The rule guarantees a reduction whenever the target is missed. The target WAS missed, so the bonus pool WAS reduced — directly contradicting the claim that it was not reduced. False.',
      recognitionTechnique: 'Other', commonTrap: 'Mistaking a directly-triggered consequence for something merely "likely" rather than logically forced.',
      tags: ['statement-reasoning', 'modus-ponens']
    },
    {
      id: 'rv_st020', topic: 'Verbal Reasoning', subtopic: 'Statement reasoning', difficulty: 2, targetTime: 35,
      prompt: 'Passage: "No employee may access the client database without two-factor authentication, according to policy. Every access attempt yesterday used two-factor authentication successfully." Statement: "At least one access attempt yesterday violated the two-factor authentication policy." Is this statement TRUE, FALSE, or CANNOT SAY, based only on the passage?',
      answerType: 'mc', options: ['True', 'False', 'Cannot Say'], correctAnswer: 'False',
      hint: 'Check what the passage says about EVERY attempt yesterday, not just some of them.',
      approach: 'Direct contradiction check against a stated universal fact.',
      solution: 'The passage states that every access attempt yesterday used two-factor authentication successfully — meaning none violated the policy. The statement claims the opposite. False.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming policies are occasionally violated in general, and projecting that assumption onto a passage that explicitly states full compliance.',
      tags: ['statement-reasoning']
    }
  ];

  items.forEach((q) => { q.track = 'reasoning'; });
  global.QTL_BANK.addMany(items);
})(window);
