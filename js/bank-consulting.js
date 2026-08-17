/* QUANT TEST LAB — CONSULTING TRACK curated bank.
   Two parts: (1) copies the two existing quant-track McKinsey-style curated
   items (h059, h060) under new ids and track:'consulting' — the prompt/
   solution text is reused programmatically (never re-authored), and the
   original quant-tagged entries are left completely untouched. (2) New
   original curated items: profitability-tree reasoning, market sizing
   structure, and further exhibit-interpretation practice. Loaded after
   bank.js — appends into the SAME QTL_BANK.questions array via addMany(). */
(function (global) {
  'use strict';

  const items = [];

  /* ---- (1) reuse the two existing McKinsey-style curated items ---- */
  const REUSE_IDS = ['h059', 'h060'];
  (global.QTL_BANK.questions || []).filter((q) => REUSE_IDS.includes(q.id)).forEach((orig) => {
    const copy = Object.assign({}, orig, { id: 'con_' + orig.id, track: 'consulting' });
    delete copy.source;
    items.push(copy);
  });

  /* ---------------------------- MARKET SIZING ---------------------------- */
  items.push(
    {
      id: 'con_b001', topic: 'Market Sizing', subtopic: 'Structuring the estimate', difficulty: 2, targetTime: 90,
      prompt: 'Before doing any arithmetic in a market-sizing question, what should you do FIRST?',
      answerType: 'mc', options: [
        'Guess a single plausible-sounding final number',
        'Explicitly state the chain of estimation steps you plan to multiply together, and name each input',
        'Ask for the exact real-world answer to check against',
        'Skip straight to the calculator'
      ], correctAnswer: 'Explicitly state the chain of estimation steps you plan to multiply together, and name each input',
      hint: 'The structure of the estimate matters more than any single number in it.',
      approach: 'Market sizing is fundamentally about building a transparent, defensible chain of reasoning, not about knowing a "correct" number from memory.',
      solution: 'Stating the full chain (e.g. population → ownership rate → frequency → price) BEFORE calculating lets the interviewer follow your logic, and lets you sanity-check each input before compounding errors across the whole chain.',
      recognitionTechnique: 'Other', commonTrap: 'Jumping straight to a number without showing the structure, making it impossible to identify or fix a single bad assumption.',
      tags: ['market-sizing']
    },
    {
      id: 'con_b002', topic: 'Market Sizing', subtopic: 'Bottom-up estimation', difficulty: 3, targetTime: 120,
      prompt: 'Estimate the annual market size for premium coffee subscriptions in a city of 3 million people. Assume 25% of adults (adults = 75% of the population) drink premium coffee regularly, 20% of those would subscribe to a delivery service, and the average subscriber pays $180/year. What is the estimated market size?',
      answerType: 'numeric', correctAnswer: 20250000, tolerance: 500000,
      hint: 'Work through each multiplication in order: population → adults → regular premium coffee drinkers → subscribers → dollars.',
      approach: 'Bottom-up chain: population × adult share × regular-drinker share × subscription-conversion share × annual price.',
      solution: 'Adults = 3,000,000×75% = 2,250,000. Regular premium drinkers = 2,250,000×25% = 562,500. Subscribers = 562,500×20% = 112,500. Market size = 112,500×$180 = $20,250,000.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Applying the adult-share percentage to the wrong base, or skipping the adult-filtering step entirely and applying coffee-drinking rates to the full population including children.',
      tags: ['market-sizing', 'bottom-up']
    },
    {
      id: 'con_b003', topic: 'Market Sizing', subtopic: 'Sanity-checking', difficulty: 3, targetTime: 90,
      prompt: 'A candidate estimates the market size for a niche B2B software product at $500 billion per year, in a country whose entire technology sector is estimated at $80 billion per year. What is the single most useful next step?',
      answerType: 'mc', options: [
        'Report the $500bn figure with full confidence',
        'Recognise the estimate is implausible relative to the known technology sector size, and re-examine the assumption chain for an error',
        'Round the number to a cleaner figure and move on',
        'Assume the technology sector figure must be wrong instead'
      ], correctAnswer: 'Recognise the estimate is implausible relative to the known technology sector size, and re-examine the assumption chain for an error',
      hint: 'A niche product cannot plausibly be worth more than 6× the entire sector it sits inside.',
      approach: 'Sanity-checking: compare a bottom-up estimate against a known top-down reference point to catch compounding errors.',
      solution: 'A niche product exceeding the ENTIRE technology sector\'s size by 6× is a clear signal that one or more assumptions in the chain were too aggressive — a good estimator always checks the final number against an independent, known reference point.',
      recognitionTechnique: 'Other', commonTrap: 'Trusting a bottom-up chain of multiplications without ever comparing the result to any external reference point.',
      tags: ['market-sizing', 'sanity-check']
    },
    {
      id: 'con_b004', topic: 'Market Sizing', subtopic: 'Top-down estimation', difficulty: 2, targetTime: 75,
      prompt: 'The total national grocery market is $200bn. A new entrant\'s realistic segment (premium organic) is 8% of that total, and the entrant expects to capture 5% of the segment within 3 years. What is the entrant\'s 3-year revenue target implied by this estimate?',
      answerType: 'numeric', correctAnswer: 800000000, tolerance: 20000000,
      hint: 'Narrow step by step: total market → segment → the entrant\'s specific share of that segment.',
      approach: 'Top-down: total × segment share × target market share within the segment.',
      solution: 'Segment size = $200bn×8% = $16bn. Entrant\'s target = $16bn×5% = $0.8bn = $800,000,000.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Applying the 5% share directly to the full $200bn market instead of to the $16bn segment.',
      tags: ['market-sizing', 'top-down']
    }
  );

  /* ------------------------- PROFITABILITY TREES ------------------------- */
  items.push(
    {
      id: 'con_b005', topic: 'Profitability Trees', subtopic: 'Diagnosing a decline', difficulty: 3, targetTime: 100,
      prompt: 'A retailer\'s profit fell even though revenue rose. Using a profitability tree (Profit = Revenue − Costs), what is the single most useful next question to ask?',
      answerType: 'mc', options: [
        'Did total costs grow even faster than revenue, and if so, in which cost category?',
        'What color is the store\'s logo?',
        'How many total employees does the company have, with no further breakdown?',
        'What was the CEO\'s starting salary?'
      ], correctAnswer: 'Did total costs grow even faster than revenue, and if so, in which cost category?',
      hint: 'If profit fell while revenue rose, the tree tells you exactly where to look next: the cost side.',
      approach: 'A profitability tree turns "why did profit fall" into a small number of concrete, checkable branches (revenue drivers vs. cost drivers).',
      solution: 'Since Profit = Revenue − Costs, and revenue rose while profit fell, costs must have grown even faster than revenue — the next useful question narrows down WHICH cost category (fixed vs. variable, or a specific line item) drove that growth.',
      recognitionTechnique: 'Other', commonTrap: 'Asking a question that cannot possibly change the diagnosis (like an unrelated detail) instead of following the tree to the side of the equation that must be responsible.',
      tags: ['profitability-tree']
    },
    {
      id: 'con_b006', topic: 'Profitability Trees', subtopic: 'Break-even analysis', difficulty: 3, targetTime: 90,
      prompt: 'A product has a $50 price, $30 variable cost per unit, and $40,000 of fixed costs. How many units must be sold to break even?',
      answerType: 'numeric', correctAnswer: 2000, tolerance: 0,
      hint: 'Break-even volume = fixed costs / contribution margin per unit.',
      approach: 'Contribution margin = price − variable cost; break-even volume = fixed costs / contribution margin.',
      solution: 'Contribution margin = $50−$30 = $20. Break-even = $40,000/$20 = 2,000 units.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Dividing fixed costs by the full price ($50) instead of the contribution margin ($20).',
      tags: ['profitability-tree', 'break-even']
    },
    {
      id: 'con_b007', topic: 'Profitability Trees', subtopic: 'Lever comparison', difficulty: 4, targetTime: 120,
      prompt: 'A business sells 10,000 units at $40 with $25 variable cost and $60,000 fixed costs (current profit = $90,000). Management is deciding between: (A) a 10% price increase with no volume change, or (B) a 15% volume increase with no price change. Which option yields higher profit?',
      answerType: 'mc', options: ['Option A (price increase)', 'Option B (volume increase)', 'Both yield identical profit', 'Neither changes profit'], correctAnswer: 'Option A (price increase)',
      hint: 'Compute the resulting profit under each option separately before comparing.',
      approach: 'Rebuild the profitability tree under each scenario: Profit = Volume×(Price−Variable Cost)−Fixed Costs.',
      solution: 'Option A: new price $44, same 10,000 units, same $25 variable cost. Profit = 10,000×(44−25)−60,000 = 190,000−60,000 = $130,000. Option B: new volume 11,500, same $40 price and $25 variable cost. Profit = 11,500×(40−25)−60,000 = 172,500−60,000 = $112,500. Option A yields the higher profit ($130,000 vs $112,500) — a price increase flows straight through to margin on every unit, while a volume increase only captures the existing (lower, pre-increase) margin per unit.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Assuming a volume increase and an equivalent-sounding price increase have the same profit impact — price increases generally have a larger effect per percentage point, since they do not require additional variable costs to realise.',
      tags: ['profitability-tree', 'levers']
    },
    {
      id: 'con_b008', topic: 'Profitability Trees', subtopic: 'Fixed vs variable costs', difficulty: 2, targetTime: 60,
      prompt: 'Which of the following is a FIXED cost (does not change with the number of units produced), rather than a variable cost?',
      answerType: 'mc', options: ['Raw materials used per unit', 'Sales commission paid per unit sold', 'Factory rent paid monthly regardless of output', 'Packaging cost per unit'], correctAnswer: 'Factory rent paid monthly regardless of output',
      hint: 'A fixed cost does not scale up or down as production volume changes.',
      approach: 'Fixed costs are incurred regardless of output level; variable costs scale directly with the number of units produced or sold.',
      solution: 'Factory rent is paid at a set monthly amount regardless of how many units are actually produced, making it a fixed cost. Raw materials, sales commissions, and packaging all scale directly with unit volume, making them variable costs.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing "large" costs with "fixed" costs — a cost\'s size has nothing to do with whether it scales with volume.',
      tags: ['profitability-tree', 'cost-structure']
    }
  );

  /* --------------------------- EXHIBIT READING --------------------------- */
  items.push(
    {
      id: 'con_b009', topic: 'Data Interpretation', subtopic: 'Exhibit reading', difficulty: 2, targetTime: 75,
      prompt: '<p>Quarterly revenue by region (€m):</p><table class="qtable"><thead><tr><th>Region</th><th>Q1</th><th>Q2</th><th>Q3</th><th>Q4</th></tr></thead><tbody><tr><td>North</td><td>40</td><td>42</td><td>38</td><td>44</td></tr><tr><td>South</td><td>30</td><td>33</td><td>36</td><td>39</td></tr></tbody></table><p>Which region shows a more CONSISTENT upward trend across all four quarters?</p>',
      answerType: 'mc', options: ['North', 'South', 'Both are equally consistent', 'Neither shows any upward trend'], correctAnswer: 'South',
      hint: 'Check whether each quarter is strictly higher than the one before it, region by region.',
      approach: 'Read across each row and check whether the sequence is strictly increasing every quarter, not just increasing overall.',
      solution: 'South rises every single quarter (30→33→36→39, +3 each time) — a strictly consistent trend. North fluctuates (40→42→38→44), dipping in Q3 despite an overall increase from Q1 to Q4.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Only comparing the first and last values (Q1 vs Q4) instead of checking every quarter-to-quarter step for consistency.',
      tags: ['exhibit']
    },
    {
      id: 'con_b010', topic: 'Data Interpretation', subtopic: 'Simpson\'s paradox', difficulty: 4, targetTime: 150,
      prompt: 'Why can a company have a LOWER overall (pooled) success rate than a competitor, while simultaneously having a HIGHER success rate within every individual sub-category, when compared to that same competitor?',
      answerType: 'mc', options: [
        'This situation is mathematically impossible and must indicate a data error',
        'It can occur when the two companies serve very different MIXES of easy versus hard sub-categories (Simpson\'s paradox) — the company doing more hard cases can look worse overall despite outperforming in every category',
        'It only happens when the sample sizes are identical',
        'It means one company is definitely committing fraud'
      ], correctAnswer: 'It can occur when the two companies serve very different MIXES of easy versus hard sub-categories (Simpson\'s paradox) — the company doing more hard cases can look worse overall despite outperforming in every category',
      hint: 'The key is that the two groups are not weighted the same way across categories.',
      approach: 'Simpson\'s paradox: pooling data across groups with very different underlying case mixes can reverse the apparent comparison.',
      solution: 'This is Simpson\'s paradox: if one company handles disproportionately more of the harder, lower-success-rate sub-category, its pooled rate is dragged down by that MIX, even while it beats the competitor within every individual sub-category. Always check the case mix behind a pooled exhibit figure.',
      recognitionTechnique: 'Other', commonTrap: 'Reading only the pooled/aggregate row of an exhibit without checking the mix of sub-categories behind it.',
      tags: ['exhibit', 'simpson']
    },
    {
      id: 'con_b011', topic: 'Data Interpretation', subtopic: 'Exhibit reading', difficulty: 3, targetTime: 90,
      prompt: '<p>Customer satisfaction survey results, by response count:</p><table class="qtable"><thead><tr><th>Rating</th><th>Count</th></tr></thead><tbody><tr><td>1 star</td><td>20</td></tr><tr><td>2 stars</td><td>30</td></tr><tr><td>3 stars</td><td>50</td></tr><tr><td>4 stars</td><td>70</td></tr><tr><td>5 stars</td><td>30</td></tr></tbody></table><p>What is the average (mean) star rating across all respondents?</p>',
      answerType: 'numeric', correctAnswer: 3.3, tolerance: 0.05,
      hint: 'Weight each rating by its own count, sum, then divide by the total number of respondents.',
      approach: 'Weighted average: Σ(rating × count) / Σ(count).',
      solution: '(1×20 + 2×30 + 3×50 + 4×70 + 5×30) / (20+30+50+70+30) = (20+60+150+280+150)/200 = 660/200 = 3.3.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Simply averaging the five rating VALUES (1,2,3,4,5) equally, ignoring how many respondents gave each rating.',
      tags: ['exhibit', 'weighted average']
    },
    {
      id: 'con_b012', topic: 'Data Interpretation', subtopic: 'Framework application', difficulty: 3, targetTime: 90,
      prompt: 'A company\'s revenue is declining. Which structured breakdown correctly and MECE-ly (Mutually Exclusive, Collectively Exhaustive) decomposes "Revenue" into its immediate drivers?',
      answerType: 'mc', options: [
        'Revenue = Number of customers × Average revenue per customer',
        'Revenue = Marketing spend + Employee morale',
        'Revenue = Profit + Costs',
        'Revenue = Market share × Competitor count'
      ], correctAnswer: 'Revenue = Number of customers × Average revenue per customer',
      hint: 'A correct decomposition should multiply or add to reconstruct the original total exactly, with no gaps or double-counting.',
      approach: 'MECE decomposition: break a metric into parts that together add up to exactly the whole, with no overlap.',
      solution: 'Number of customers × average revenue per customer reconstructs total revenue exactly, with each customer counted once — a clean, MECE decomposition. The other options either use unrelated or non-reconstructing quantities (profit+costs actually reconstructs REVENUE too by definition, but is a different, cost-side decomposition than what best isolates customer-driven revenue levers; marketing spend + morale and market share × competitor count do not mathematically reconstruct revenue at all).',
      recognitionTechnique: 'Other', commonTrap: 'Picking a decomposition using plausible-sounding business terms that does not actually multiply or add back up to the original total.',
      tags: ['framework', 'mece']
    },
    {
      id: 'con_b013', topic: 'Data Interpretation', subtopic: 'Framework application', difficulty: 3, targetTime: 90,
      prompt: 'A generic "issue tree" for diagnosing a profit decline should branch first into which two MECE categories?',
      answerType: 'mc', options: ['Revenue and Costs', 'Marketing and Sales', 'Employees and Customers', 'Domestic and International'], correctAnswer: 'Revenue and Costs',
      hint: 'Profit is defined as one quantity minus another — start the tree from that exact definition.',
      approach: 'Since Profit = Revenue − Costs by definition, this is the natural, MECE top-level split for any profit-decline issue tree.',
      solution: 'Because Profit is DEFINED as Revenue minus Costs, splitting the top of the issue tree into exactly these two branches is guaranteed to be Mutually Exclusive (no overlap) and Collectively Exhaustive (nothing left out) — every possible driver of a profit change falls under one of the two.',
      recognitionTechnique: 'Other', commonTrap: 'Starting from a business-specific category (like "Marketing and Sales") that is neither guaranteed to be exhaustive nor mutually exclusive, rather than from the exact mathematical definition of profit.',
      tags: ['framework', 'mece', 'issue-tree']
    },
    {
      id: 'con_b014', topic: 'Structured Decisions', subtopic: 'Relevance ranking', difficulty: 3, targetTime: 100,
      prompt: 'A hospital\'s patient wait times have increased only in the emergency department, not elsewhere. Which piece of information would be MOST useful to investigate first?',
      answerType: 'mc', options: [
        'Emergency department staffing levels and patient volume over the same period',
        'The hospital\'s total annual budget across all departments',
        'The architectural style of the hospital building',
        'General patient satisfaction with the cafeteria'
      ], correctAnswer: 'Emergency department staffing levels and patient volume over the same period',
      hint: 'Look for the information that could directly explain a change ISOLATED to one specific department.',
      approach: 'Relevance test: prioritise information that could plausibly explain why the effect is isolated to the specific area affected.',
      solution: 'Since the problem is isolated specifically to the emergency department, comparing its staffing and patient volume over the relevant period directly targets a plausible cause of that isolated change — a department-wide or hospital-wide detail unrelated to the ED specifically is far less likely to explain why ONLY that department is affected.',
      recognitionTechnique: 'Other', commonTrap: 'Reaching for a hospital-wide statistic that cannot explain why the problem is isolated to just one department.',
      tags: ['structured-decisions', 'relevance']
    },
    {
      id: 'con_b015', topic: 'Structured Decisions', subtopic: 'Hypothesis testing', difficulty: 4, targetTime: 120,
      prompt: 'A consultant has three competing hypotheses for a client\'s declining profit: (1) rising input costs, (2) declining sales volume, (3) increased price discounting. What is the most efficient next step before gathering ANY new data?',
      answerType: 'mc', options: [
        'Immediately commission a full new customer survey covering all three hypotheses',
        'Identify what specific evidence, from data the client ALREADY has, would distinguish between the three hypotheses',
        'Pick the hypothesis that sounds most interesting and proceed directly to a recommendation',
        'Present all three hypotheses to the client with no further analysis and ask them to choose'
      ], correctAnswer: 'Identify what specific evidence, from data the client ALREADY has, would distinguish between the three hypotheses',
      hint: 'Before commissioning new, potentially expensive data collection, check what could be learned from data the client already has.',
      approach: 'Hypothesis-driven structuring: identify the specific evidence that would discriminate between competing explanations, prioritising data already available.',
      solution: 'Checking existing data first (e.g. unit cost trends would address hypothesis 1, unit sales volume would address hypothesis 2, and average realised price vs. list price would address hypothesis 3) is far more efficient than commissioning new data collection before knowing what is already available and what it already shows.',
      recognitionTechnique: 'Other', commonTrap: 'Jumping to new data collection (survey work) before checking whether the client\'s EXISTING data can already discriminate between the hypotheses.',
      tags: ['structured-decisions', 'hypothesis-driven']
    }
  );

  /* ---------------------- CASE INTERVIEW PROCESS ---------------------- */
  items.push(
    {
      id: 'con_b016', topic: 'Case Interview Process', subtopic: 'Clarify', difficulty: 2, targetTime: 75,
      prompt: 'An interviewer opens with: "Our client is a mid-size regional airline whose profits have declined over the past two years. Figure out why and what to do about it." What should the candidate do in the first 45-60 seconds, BEFORE asking any clarifying questions?',
      answerType: 'mc', options: [
        'Paraphrase the objective back in their own words to confirm they understood the actual question being asked',
        'Immediately start building a full profitability framework on paper',
        'Ask the interviewer to simply state the answer',
        'Begin estimating the airline\'s market size'
      ], correctAnswer: 'Paraphrase the objective back in their own words to confirm they understood the actual question being asked',
      hint: 'The very first move in Clarify is confirming you heard the question correctly, not answering it.',
      approach: 'The Clarify phase opens with explicit paraphrasing of the prompt, before any framework or clarifying questions.',
      solution: 'Paraphrasing the prompt back ("So we\'re looking at a two-year profit decline at a regional airline, and I need to find the cause and a recommendation — is that right?") confirms the candidate understood the actual question before spending any time on it. Jumping to a framework or to estimation skips this confirmation step and risks solving the wrong problem.',
      recognitionTechnique: 'Other', commonTrap: 'Skipping straight to framework-building or math before confirming the objective was understood correctly.',
      tags: ['case-process', 'clarify']
    },
    {
      id: 'con_b017', topic: 'Case Interview Process', subtopic: 'Clarify', difficulty: 3, targetTime: 90,
      prompt: 'In a "command-and-control" style case, the interviewer feeds data and sub-questions one step at a time and expects the candidate to react to each new piece of information. In an "open-ended" case, by contrast, who drives the direction of the analysis?',
      answerType: 'mc', options: [
        'The candidate drives essentially the entire structure and direction themselves',
        'The interviewer drives 100% of the analysis in both formats',
        'Neither format ever involves a framework',
        'The two formats are functionally identical'
      ], correctAnswer: 'The candidate drives essentially the entire structure and direction themselves',
      hint: 'The key difference between the two formats is who chooses what to analyze next.',
      approach: 'Recognizing which format is in play early changes how much initiative the candidate needs to take.',
      solution: 'In an open-ended case, the candidate proposes the framework, chooses which branch to pursue first, and drives the analysis with minimal interviewer steering. In a command-and-control case, the interviewer instead feeds specific data or sub-questions at each step, and the candidate reacts to what is handed to them. Misreading which format is in play can make a candidate look either passive (in an open-ended case) or unresponsive to the interviewer\'s cues (in a command-and-control case).',
      recognitionTechnique: 'Other', commonTrap: 'Treating a command-and-control case as if the candidate should be independently proposing the entire direction, ignoring the data the interviewer is actively feeding in.',
      tags: ['case-process', 'clarify', 'case-format']
    },
    {
      id: 'con_b018', topic: 'Case Interview Process', subtopic: 'Clarify', difficulty: 3, targetTime: 90,
      prompt: 'A candidate is given a profit-decline case for a regional airline. Which of the following clarifying questions FAILS the "relevance test" and should NOT be one of the 2-4 questions asked during Clarify?',
      answerType: 'mc', options: [
        'What does the interviewer consider the airline\'s main hub airport\'s weather to have been like this year?',
        'Over what time period exactly did the decline occur, and is "profit" defined as operating profit or net income?',
        'Is the client interested in organic fixes only, or would M&A also be in scope?',
        'Are there specific business lines or routes driving the decline, or is it broad-based?'
      ], correctAnswer: 'What does the interviewer consider the airline\'s main hub airport\'s weather to have been like this year?',
      hint: 'A relevant clarifying question should change how the candidate would structure or prioritize the analysis.',
      approach: 'The relevance test: a clarifying question earns its place only if the answer would actually change the structure or direction of the analysis.',
      solution: 'Weather trivia has no clear bearing on how the candidate would structure a two-year profit-decline analysis, so it fails the relevance test and just burns limited Clarify time. The other three questions each would change the analysis materially: the time-period/definition question affects what data to pull, the M&A-scope question affects which branches of the framework are even in play, and the route-specific question affects whether to start broad or narrow.',
      recognitionTechnique: 'Other', commonTrap: 'Asking a question just to seem thorough, without checking whether the answer would actually change anything about the approach.',
      tags: ['case-process', 'clarify', 'relevance-test']
    },
    {
      id: 'con_b019', topic: 'Case Interview Process', subtopic: 'Structure', difficulty: 2, targetTime: 75,
      prompt: 'After Clarify, a candidate is ready to build their framework. What should they explicitly say to the interviewer before starting to write?',
      answerType: 'mc', options: [
        'Ask for a short amount of time (roughly 45-90 seconds) to organize their thoughts on paper',
        'Nothing — silently start writing without any comment',
        'Announce their final recommendation immediately',
        'Ask the interviewer to build the framework for them'
      ], correctAnswer: 'Ask for a short amount of time (roughly 45-90 seconds) to organize their thoughts on paper',
      hint: 'Silence without explanation reads very differently from silence the interviewer was told to expect.',
      approach: 'Explicitly asking for structuring time signals process awareness and prevents the pause from reading as being stuck.',
      solution: 'Asking for time ("Can I take a minute to organize my thoughts before I walk you through my approach?") turns an unexplained silence into a signal of a deliberate, professional process — the same 30-45 seconds of silence reads completely differently depending on whether it was announced.',
      recognitionTechnique: 'Other', commonTrap: 'Going silent to think without saying anything first, leaving the interviewer unsure whether the candidate is structuring or simply stuck.',
      tags: ['case-process', 'structure']
    },
    {
      id: 'con_b020', topic: 'Case Interview Process', subtopic: 'Structure', difficulty: 3, targetTime: 90,
      prompt: 'Why is a framework presented as a TREE (branches that split into sub-branches, each MECE) generally stronger than the same content presented as a flat bulleted list?',
      answerType: 'mc', options: [
        'A tree makes the logical relationship between categories and their drivers explicit, and makes gaps or overlaps easy to spot',
        'A tree always contains more total words than a bulleted list',
        'Interviewers only accept frameworks drawn as literal tree diagrams and reject all other formats',
        'A bulleted list is mathematically impossible to use in a case'
      ], correctAnswer: 'A tree makes the logical relationship between categories and their drivers explicit, and makes gaps or overlaps easy to spot',
      hint: 'Think about what a tree shows that a flat list cannot: hierarchy and relationship, not just a set of topics.',
      approach: 'A tree encodes MECE structure visually — top-level branches split into sub-drivers — while a flat list of the same words hides whether the categories are exhaustive or overlapping.',
      solution: 'A tree shows explicitly which sub-drivers roll up into which top-level category, making it easy for both the candidate and the interviewer to check the structure is MECE (Mutually Exclusive, Collectively Exhaustive). A flat bulleted list can contain the exact same words but hides those relationships, making gaps and overlaps much harder to catch at a glance.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming format is cosmetic — that a tree and an equivalent bullet list convey the same information, when the tree\'s hierarchy is itself doing analytical work.',
      tags: ['case-process', 'structure', 'mece']
    },
    {
      id: 'con_b021', topic: 'Case Interview Process', subtopic: 'Structure', difficulty: 3, targetTime: 90,
      prompt: 'A candidate builds their framework and then says: "Based on this framework, I believe the answer is that the client should exit the underperforming route." They have not yet gathered or analyzed any data. What is wrong with this move?',
      answerType: 'mc', options: [
        'The framework is meant to be a roadmap for what to investigate, not a pre-baked conclusion delivered before any analysis',
        'Nothing is wrong — frameworks should always produce an immediate recommendation',
        'The candidate should have skipped the framework entirely',
        'The mistake is only that they didn\'t use a bulleted list instead of the framework'
      ], correctAnswer: 'The framework is meant to be a roadmap for what to investigate, not a pre-baked conclusion delivered before any analysis',
      hint: 'A framework tells you WHERE to look; it cannot, by itself, tell you WHAT you will find there.',
      approach: 'A framework is a map of hypotheses to test, not a substitute for actually testing them with data.',
      solution: 'Announcing a recommendation straight off the framework, with zero data gathered or analyzed, skips the entire Solve phase — the framework only identifies WHICH branches are worth investigating; it cannot on its own tell the candidate which branch is actually the cause without looking at real numbers or facts from the case.',
      recognitionTechnique: 'Other', commonTrap: 'Treating the framework itself as the analysis, rather than as a roadmap for the analysis that still needs to happen.',
      tags: ['case-process', 'structure']
    },
    {
      id: 'con_b022', topic: 'Case Interview Process', subtopic: 'Solve', difficulty: 3, targetTime: 90,
      prompt: 'Halfway through a case, new exhibit data rules out the candidate\'s leading hypothesis (rising fuel costs) but supports a different branch of their framework (falling average fares). What is the correct next move?',
      answerType: 'mc', options: [
        'Update the working hypothesis to reflect the new evidence and continue investigating the fare-decline branch',
        'Keep pursuing the original fuel-cost hypothesis regardless, since it was stated first',
        'Discard the framework entirely and start over from Clarify',
        'Present both hypotheses to the interviewer with no view on which is more likely'
      ], correctAnswer: 'Update the working hypothesis to reflect the new evidence and continue investigating the fare-decline branch',
      hint: 'A working hypothesis is meant to update as new evidence comes in, not stay fixed regardless of what the data shows.',
      approach: 'Hypothesis-driven thinking means the leading explanation is a live, updatable belief, revised each time new evidence arrives.',
      solution: 'The entire point of a working hypothesis is that it updates as evidence comes in — sticking to the fuel-cost hypothesis after it has been directly contradicted by data ignores the interviewer\'s clue and wastes the remaining case time. Restarting from Clarify or refusing to take a view are both overreactions to a single piece of new evidence.',
      recognitionTechnique: 'Other', commonTrap: 'Anchoring on the first hypothesis stated and failing to revise it even after data directly contradicts it.',
      tags: ['case-process', 'solve', 'hypothesis-driven']
    },
    {
      id: 'con_b023', topic: 'Case Interview Process', subtopic: 'Solve', difficulty: 2, targetTime: 60,
      prompt: 'A candidate is working through a calculation and goes completely silent for roughly 30 seconds while writing numbers. From the interviewer\'s side, what does this silence typically signal?',
      answerType: 'mc', options: [
        'A red flag — the interviewer cannot tell if the candidate is on track, stuck, or making an error, since nothing is being said',
        'Nothing at all — interviewers are trained to ignore silence completely',
        'That the candidate has definitely reached the correct answer',
        'That the case is now over'
      ], correctAnswer: 'A red flag — the interviewer cannot tell if the candidate is on track, stuck, or making an error, since nothing is being said',
      hint: 'The interviewer can only evaluate what they can see or hear — silence hides the reasoning process itself.',
      approach: 'Thinking aloud during Solve lets the interviewer follow (and, if needed, redirect) the reasoning in real time.',
      solution: 'Extended silence during calculation is typically read as a red flag because the interviewer loses visibility into whether the candidate\'s process is sound, stuck, or heading toward an error — narrating the steps out loud ("so first I\'ll find the contribution margin, then divide fixed costs by that...") keeps the interviewer able to follow along and step in with a clue if needed.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming that going quiet to "just focus" is neutral, when in a live interview it removes the interviewer\'s only window into the candidate\'s reasoning.',
      tags: ['case-process', 'solve', 'thinking-aloud']
    },
    {
      id: 'con_b024', topic: 'Case Interview Process', subtopic: 'Solve', difficulty: 3, targetTime: 90,
      prompt: 'During Solve, an interviewer says: "That\'s an interesting angle, but let\'s set that aside and look at the cost side instead." What is this an example of, and what should the candidate do?',
      answerType: 'mc', options: [
        'A negative/redirecting clue — the candidate should drop that branch and pivot to the cost side as directed',
        'A random aside with no bearing on the analysis, to be ignored',
        'Confirmation that the candidate\'s original branch was correct',
        'A signal that the case interview is now finished'
      ], correctAnswer: 'A negative/redirecting clue — the candidate should drop that branch and pivot to the cost side as directed',
      hint: 'Interviewers often steer candidates through indirect language rather than saying "wrong" outright.',
      approach: 'Interviewer clues (positive or negative) are real signals about which branches are worth pursuing, and should change the candidate\'s path.',
      solution: 'Phrases like "let\'s set that aside" or "let\'s look at X instead" are negative/redirecting clues — politely worded instructions to drop the current branch. A candidate who continues down the original branch anyway, ignoring the clue, misses one of the clearest signals the interviewer gives about where the useful information actually is.',
      recognitionTechnique: 'Other', commonTrap: 'Missing an indirect redirect because it wasn\'t phrased as an explicit correction, and continuing down a branch the interviewer has already signaled to abandon.',
      tags: ['case-process', 'solve', 'interviewer-clues']
    },
    {
      id: 'con_b025', topic: 'Case Interview Process', subtopic: 'Recommend', difficulty: 2, targetTime: 75,
      prompt: 'At the end of a case, which opening is the stronger way to deliver a recommendation?',
      answerType: 'mc', options: [
        '"My recommendation is that the client should exit Route X, for three reasons: ..." (conclusion first, then supporting reasons)',
        '"Well, first I looked at revenue, then I looked at costs, then I found this exhibit, and eventually..." (walking through the whole analysis chronologically before stating a conclusion)',
        'Restating the original case prompt word for word',
        'Asking the interviewer what they think the answer should be'
      ], correctAnswer: '"My recommendation is that the client should exit Route X, for three reasons: ..." (conclusion first, then supporting reasons)',
      hint: 'Clients (and interviewers) want the bottom line up front, with the reasoning available on request.',
      approach: 'The pyramid-principle structure: state the recommendation first, then back it with 2-3 supporting reasons drawn from the analysis.',
      solution: 'Leading with the conclusion mirrors how a real client wants to hear a recommendation — the headline first, with supporting detail available if they want to dig in. Narrating the entire chronological path of the analysis before ever stating a conclusion buries the actual answer and forces the listener to wait for it.',
      recognitionTechnique: 'Other', commonTrap: 'Re-walking through the whole case chronologically instead of leading with the bottom-line recommendation.',
      tags: ['case-process', 'recommend']
    },
    {
      id: 'con_b026', topic: 'Case Interview Process', subtopic: 'Recommend', difficulty: 3, targetTime: 90,
      prompt: 'Two candidates deliver otherwise-identical final recommendations. Candidate A stops after stating the recommendation and its supporting reasons. Candidate B adds 2-3 concrete "next steps" the client should take to implement or validate the recommendation. What does this difference typically signal to the interviewer?',
      answerType: 'mc', options: [
        'Candidate B is demonstrating the kind of forward-looking, action-oriented thinking that differentiates a star candidate',
        'Next steps are irrelevant filler and should generally be omitted',
        'Candidate A\'s answer is automatically the stronger one for being more concise',
        'Next steps only matter in market-sizing cases, not in profitability cases'
      ], correctAnswer: 'Candidate B is demonstrating the kind of forward-looking, action-oriented thinking that differentiates a star candidate',
      hint: 'A recommendation without next steps tells the client WHAT to do; next steps tell them HOW to actually start doing it.',
      approach: 'Concrete next steps show the candidate is thinking beyond the analysis toward real-world implementation and risk.',
      solution: 'Naming specific next steps (e.g. "validate the route-level cost data with finance," "pilot the fare change on one route before rolling out network-wide," "assess contractual exit costs") shows the candidate is thinking about implementation and risk, not just the analytical answer — this is explicitly the kind of differentiator that separates a good recommendation from a great one.',
      recognitionTechnique: 'Other', commonTrap: 'Treating the recommendation and its supporting reasons as the entire deliverable, and omitting any forward-looking next steps.',
      tags: ['case-process', 'recommend', 'next-steps']
    },
    {
      id: 'con_b027', topic: 'Case Interview Process', subtopic: 'Recommend', difficulty: 3, targetTime: 90,
      prompt: 'A candidate\'s Solve phase found: (1) the underperforming route has a 40% lower load factor than the rest of the network, (2) fuel costs on that route are in line with the network average, (3) a competitor launched a cheaper direct route on the same city pair last year. Which single sentence best opens the Recommend phase?',
      answerType: 'mc', options: [
        'The client should exit the underperforming route, primarily because new competition has drawn away passengers, evidenced by its low load factor, while costs remain in line with the rest of the network',
        'The client should investigate fuel costs further before concluding anything',
        'The client should lower fares across the entire network immediately',
        'No recommendation can be made without more data on employee morale'
      ], correctAnswer: 'The client should exit the underperforming route, primarily because new competition has drawn away passengers, evidenced by its low load factor, while costs remain in line with the rest of the network',
      hint: 'The strongest opening states the recommendation and ties it directly to the specific findings already established.',
      approach: 'Recommend should open with the conclusion and immediately tie it to the concrete findings from Solve, not restate an unresolved question.',
      solution: 'Findings (1) and (3) directly point to lost demand from new competition (low load factor, a cheaper competing route) as the cause, while finding (2) rules out costs as the driver — so the recommendation should lead with exiting (or restructuring) the route and cite exactly those findings. Reopening the fuel-cost question or demanding unrelated data (employee morale) ignores what Solve already established.',
      recognitionTechnique: 'Other', commonTrap: 'Reopening a branch that the Solve-phase data already ruled out (fuel costs), instead of building the recommendation on the findings that actually pointed to a cause.',
      tags: ['case-process', 'recommend']
    },
    {
      id: 'con_b028', topic: 'Case Interview Process', subtopic: 'Case types', difficulty: 2, targetTime: 75,
      prompt: 'A case opens: "Our client, a national coffee chain, has seen its operating margin fall by 4 percentage points over the past year despite steady revenue. What\'s going on?" Which case type is this, and what is the most likely starting framework?',
      answerType: 'mc', options: [
        'Profitability Analysis — starting from Profit = Revenue − Costs (with steady revenue, the cost side is the natural first branch)',
        'Market Sizing — starting from population × penetration × frequency × price',
        'Market Entry — starting from market attractiveness × client capability to win',
        'Investment/M&A — starting from a return-on-investment framework'
      ], correctAnswer: 'Profitability Analysis — starting from Profit = Revenue − Costs (with steady revenue, the cost side is the natural first branch)',
      hint: 'Margin falling with revenue flat is a direct signal about which side of the profit equation moved.',
      approach: 'Recognize case type from the opening cue — a margin or profit change with a specific numeric detail (steady revenue) points straight at a profitability framework, and even hints at which branch to prioritize.',
      solution: 'A falling operating margin despite steady revenue is a classic Profitability Analysis case, and the detail that revenue was steady is itself a clue pointing the candidate toward the cost side of Profit = Revenue − Costs as the higher-priority branch to investigate first.',
      recognitionTechnique: 'Other', commonTrap: 'Defaulting to Market Sizing whenever a case mentions a company and a market, without reading the specific cue (margin decline, steady revenue) that points to a different case type.',
      tags: ['case-process', 'case-types']
    },
    {
      id: 'con_b029', topic: 'Case Interview Process', subtopic: 'Case types', difficulty: 3, targetTime: 90,
      prompt: 'Case prompt A: "How many golf balls are sold in the US each year?" Case prompt B: "Our client, a domestic golf equipment maker, is considering launching a new product line into the golf-ball market — should they?" Both involve golf balls, but which best describes the key difference in what each case actually requires?',
      answerType: 'mc', options: [
        'Prompt A is a pure Market Sizing exercise (an estimate), while Prompt B is a Market Entry case (requires assessing market attractiveness AND the client\'s ability to win, not just market size)',
        'The two prompts require identical analysis since both mention golf balls',
        'Prompt A requires assessing the client\'s capabilities, while Prompt B does not',
        'Neither prompt requires any structured framework'
      ], correctAnswer: 'Prompt A is a pure Market Sizing exercise (an estimate), while Prompt B is a Market Entry case (requires assessing market attractiveness AND the client\'s ability to win, not just market size)',
      hint: 'Ask what decision the case is actually asking to be made — an estimate, or a go/no-go call for a specific company.',
      approach: 'Case type depends on the DECISION being asked for, not just the shared subject matter — market sizing estimates a number, market entry evaluates whether a specific client should act.',
      solution: 'Prompt A only asks for a number (a market-sizing estimate), with no company-specific decision involved. Prompt B asks whether a SPECIFIC client should enter a market, which requires the fuller Market Entry framework — market attractiveness (size, growth, competition, barriers) combined with the client\'s own capability and fit to win in that market. Market sizing might still be a sub-step inside Prompt B, but it is not the whole case.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming two prompts sharing the same subject (golf balls) require the same framework, without checking what decision is actually being asked for.',
      tags: ['case-process', 'case-types']
    },
    {
      id: 'con_b030', topic: 'Case Interview Process', subtopic: 'Case types', difficulty: 3, targetTime: 90,
      prompt: 'A case opens: "Our client runs a single manufacturing plant. Output has plateaued even after adding a second shift. Diagnose the constraint and recommend a fix." Which case type and framework fit best?',
      answerType: 'mc', options: [
        'Operations — bottleneck/constraint analysis of the production process',
        'Industry Analysis — Porter\'s Five Forces applied to the manufacturing sector',
        'Investment — a discounted cash flow evaluation of the plant',
        'Market Sizing — estimating total demand for the plant\'s product'
      ], correctAnswer: 'Operations — bottleneck/constraint analysis of the production process',
      hint: 'The prompt is entirely internal to one plant\'s process — no market, competitor, or investment decision is mentioned.',
      approach: 'Recognize an Operations case from cues about a single internal process (a plant, a factory, a service line) where output is capped despite added inputs.',
      solution: 'The prompt is about a single plant\'s output plateauing despite more labor input (a second shift) — a classic signal of a process bottleneck (a single constraining step capping total throughput regardless of other capacity added elsewhere). Porter\'s Five Forces, DCF, and market sizing are all frameworks for external, market-facing, or financial-return questions, none of which this internal-process prompt is asking about.',
      recognitionTechnique: 'Other', commonTrap: 'Reaching for a market- or finance-facing framework (Five Forces, DCF) on a prompt that is actually entirely about an internal production process.',
      tags: ['case-process', 'case-types', 'operations']
    },
    {
      id: 'con_b031', topic: 'Case Interview Process', subtopic: 'Evaluation', difficulty: 3, targetTime: 90,
      prompt: 'A candidate keeps clear, organized notes visible on the page — labeled framework branches, numbers written legibly, key findings underlined as they emerge. On a standard consulting feedback sheet, which dimension does this behavior specifically feed into, SEPARATELY from "Structure"?',
      answerType: 'mc', options: [
        'Notes — evaluated as its own dimension, distinct from the structure of the framework itself',
        'It is not evaluated at all; only the final answer matters',
        'It only affects the Math Proficiency dimension',
        'It replaces the need for a spoken recommendation'
      ], correctAnswer: 'Notes — evaluated as its own dimension, distinct from the structure of the framework itself',
      hint: 'How the candidate organizes what they write is graded independently of the content of the framework itself.',
      approach: 'A standard case-interview feedback sheet (e.g. the WSO 7-dimension framework) scores Notes as its own line, separate from Structure, Communication, or Math Proficiency.',
      solution: 'Legible, organized, labeled notes are their own evaluated dimension ("Notes") on a standard 7-dimension feedback sheet (alongside Demeanor, Structure, Communication, Math Proficiency, Creativity, and Recommendation) — a candidate can have a perfectly logical framework (good Structure) while still losing points on Notes for illegible or disorganized handwriting that the interviewer cannot follow.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming Notes and Structure are the same dimension, when a feedback sheet scores them independently.',
      tags: ['case-process', 'evaluation', 'feedback-sheet']
    },
    {
      id: 'con_b032', topic: 'Case Interview Process', subtopic: 'Evaluation', difficulty: 2, targetTime: 60,
      prompt: 'Case interview coaching often describes the ideal relationship between candidate and interviewer as "partner, not examiner." What does this mean in practice?',
      answerType: 'mc', options: [
        'The candidate should engage the interviewer as a working colleague solving the problem together, not treat every interviewer comment as a pass/fail verdict to be feared',
        'The candidate should ask the interviewer to solve the case for them',
        'The interviewer is legally required to give the candidate the answer if asked',
        'It means candidates should avoid speaking to the interviewer entirely during Solve'
      ], correctAnswer: 'The candidate should engage the interviewer as a working colleague solving the problem together, not treat every interviewer comment as a pass/fail verdict to be feared',
      hint: 'A real engagement team works together on a client problem — the interview is meant to simulate that dynamic, not an exam.',
      approach: 'Demeanor is evaluated on whether the candidate behaves like a future colleague under pressure, not just on the correctness of the analysis.',
      solution: 'Treating the interviewer as a partner means engaging naturally — asking questions, reacting to clues, thinking aloud — the way an associate would with a case-team colleague, rather than freezing up or treating every interviewer remark as a graded verdict on performance. This composure under pressure is itself part of what "Demeanor" evaluates, separately from whether the final numbers are correct.',
      recognitionTechnique: 'Other', commonTrap: 'Going silent or visibly anxious around the interviewer out of fear of being judged, rather than engaging them as a collaborator.',
      tags: ['case-process', 'evaluation', 'demeanor']
    },
    {
      id: 'con_b033', topic: 'Case Interview Process', subtopic: 'Evaluation', difficulty: 3, targetTime: 90,
      prompt: 'A candidate gets stuck mid-calculation and cannot see the next step. What is the correct sequence of actions?',
      answerType: 'mc', options: [
        'Return to the framework/structure already laid out to see which branch offers the next logical step, and if still stuck, explicitly and gracefully ask the interviewer for a hint',
        'Immediately give up and ask the interviewer to finish the case for them',
        'Silently guess a number and move on without comment',
        'Restart the entire case from the Clarify phase'
      ], correctAnswer: 'Return to the framework/structure already laid out to see which branch offers the next logical step, and if still stuck, explicitly and gracefully ask the interviewer for a hint',
      hint: 'The framework built in Structure is exactly the tool meant to reorient a candidate who feels lost mid-case.',
      approach: 'Being stuck is not itself a failure — the recovery sequence (return to structure, then explicitly ask for help if still stuck) is what interviewers actually evaluate.',
      solution: 'Re-anchoring on the framework already built in Structure often reveals the next logical branch to pursue; if that still doesn\'t resolve it, explicitly and calmly asking for a hint ("I want to make sure I\'m using my time well — could you point me toward what\'s relevant here?") is a far stronger look than silently guessing or restarting the whole case. How a candidate recovers from being stuck is itself part of what is evaluated, not just whether they ever get stuck at all.',
      recognitionTechnique: 'Other', commonTrap: 'Treating a moment of being stuck as unrecoverable and either guessing silently or restarting the case, instead of using the structure already built and asking for help gracefully.',
      tags: ['case-process', 'evaluation', 'recovery']
    }
  );

  /* ---------------------------- BUSINESS FRAMEWORKS ---------------------------- */
  items.push(
    {
      id: 'con_b034', topic: 'Business Frameworks', subtopic: 'Profit Equation', difficulty: 2, targetTime: 75,
      prompt: 'Under the Profit Equation framework, the Revenue branch is typically split into which two top-level sub-drivers?',
      answerType: 'mc', options: ['Volume and Price', 'Fixed and Variable', 'COGS and SG&A', 'Domestic and International'], correctAnswer: 'Volume and Price',
      hint: 'Revenue is Volume multiplied by Price — the sub-driver menu splits it into exactly these two factors.',
      approach: 'The Profit Equation framework proactively lists the standard sub-drivers under Revenue and Costs before any data is shared.',
      solution: 'Revenue = Volume × Price, so the standard sub-driver menu splits Revenue into Volume (further: new vs. existing customers) and Price (list price, discounting, product mix). Fixed/Variable and COGS/SG&A are Cost-side splits, not Revenue-side.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing the Cost-side sub-driver menu (Fixed/Variable, COGS/SG&A) with the Revenue-side menu (Volume, Price).',
      tags: ['frameworks', 'profit-equation']
    },
    {
      id: 'con_b035', topic: 'Business Frameworks', subtopic: 'Profit Equation', difficulty: 3, targetTime: 90,
      prompt: 'A candidate is told membership volume at a gym chain is flat, but revenue still fell. Using the Price sub-driver menu, which of the following is NOT one of the specific checks the candidate should propose?',
      answerType: 'mc', options: [
        'Did the list price change?',
        'Did average discounting or promotional activity increase?',
        'Did the mix of membership tiers shift toward cheaper tiers even with total volume flat?',
        'Did the number of gym locations change?'
      ], correctAnswer: 'Did the number of gym locations change?',
      hint: 'The Price sub-driver menu narrows specifically into list price, discounting, and product mix — not physical footprint.',
      approach: 'With Volume ruled out, Revenue = Volume × Price means the cause must sit in Price, and the sub-driver menu (list price, discounting, mix) narrows this further into specific checkable pieces.',
      solution: 'List price, discounting, and mix shift are all specific sub-drivers of the Price branch. The number of gym locations is a capacity/footprint question, not one of the Price sub-drivers, and would not directly explain a revenue decline with volume already confirmed flat.',
      recognitionTechnique: 'Other', commonTrap: 'Reaching for a plausible-sounding business detail (location count) that does not actually belong to the specific sub-driver menu implied by the branch already ruled relevant (Price).',
      tags: ['frameworks', 'profit-equation']
    },
    {
      id: 'con_b036', topic: 'Business Frameworks', subtopic: 'Profit Equation', difficulty: 2, targetTime: 75,
      prompt: 'Which Cost-side split separates costs directly tied to producing/delivering the product from the general overhead of running the business?',
      answerType: 'mc', options: ['Fixed vs. Variable', 'COGS vs. SG&A', 'New vs. Existing customers', 'Price vs. Promotion'], correctAnswer: 'COGS vs. SG&A',
      hint: 'One of these cost splits is about what the cost IS FOR, not whether it scales with volume.',
      approach: 'COGS (cost of goods sold) ties directly to production/delivery; SG&A (selling, general & administrative) is the overhead of running the business itself.',
      solution: 'COGS vs. SG&A separates production/delivery costs from business overhead — a distinction Fixed vs. Variable (which is about whether a cost scales with volume) does not capture on its own.',
      recognitionTechnique: 'Other', commonTrap: 'Treating Fixed/Variable and COGS/SG&A as interchangeable splits, when they classify costs along two different, non-overlapping dimensions.',
      tags: ['frameworks', 'profit-equation']
    },
    {
      id: 'con_b037', topic: 'Business Frameworks', subtopic: 'Five Forces', difficulty: 2, targetTime: 75,
      prompt: 'Which of Porter\'s Five Forces is directly weakened when a customer segment could easily satisfy the same underlying need with a completely different type of product (e.g. video calling instead of business travel)?',
      answerType: 'mc', options: ['Threat of new entrants', 'Bargaining power of suppliers', 'Threat of substitutes', 'Rivalry among existing competitors'], correctAnswer: 'Threat of substitutes',
      hint: 'A different product category meeting the same underlying need is the definition of this specific force.',
      approach: 'Substitutes cap industry pricing power by offering an alternate way to meet the same customer need, without being a direct, same-category competitor.',
      solution: 'A strong substitute (a different product category meeting the same need) directly increases the "threat of substitutes" force, capping how much the industry can charge before customers simply switch to the substitute.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing threat of substitutes with rivalry among existing competitors, which is about direct, same-category competitors rather than a different type of product entirely.',
      tags: ['frameworks', 'five-forces']
    },
    {
      id: 'con_b038', topic: 'Business Frameworks', subtopic: 'Five Forces', difficulty: 3, targetTime: 90,
      prompt: 'An industry has low, stagnant growth and high exit barriers (expensive, specialized equipment that cannot be repurposed). What effect does this combination tend to have on rivalry among existing competitors?',
      answerType: 'mc', options: [
        'It intensifies rivalry, since firms are stuck competing over a fixed or shrinking pie rather than able to exit',
        'It reduces rivalry, since firms have less incentive to compete',
        'It has no effect on rivalry at all',
        'It eliminates the threat of new entrants entirely'
      ], correctAnswer: 'It intensifies rivalry, since firms are stuck competing over a fixed or shrinking pie rather than able to exit',
      hint: 'Firms that cannot easily leave an industry, in a market that is not growing, are forced to fight over the same limited demand.',
      approach: 'Slow growth removes the option to grow alongside the market; high exit barriers remove the option to leave — both push firms toward fighting harder over existing share.',
      solution: 'Slow growth forces firms to compete for share rather than growing alongside an expanding market, and high exit barriers keep unprofitable competitors in the fight rather than exiting, both of which intensify rivalry among existing competitors.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming exit barriers and growth rate only affect a firm\'s own individual decisions, rather than recognizing their combined effect on the whole industry\'s competitive intensity.',
      tags: ['frameworks', 'five-forces']
    },
    {
      id: 'con_b039', topic: 'Business Frameworks', subtopic: 'Five Forces', difficulty: 3, targetTime: 90,
      prompt: 'A firm underperforms its own historical profitability, but so does every other competitor in its industry, across several years. What does the Five Forces framework suggest is the most likely explanation?',
      answerType: 'mc', options: [
        'This firm\'s management must be uniquely incompetent',
        'A structural, industry-wide shift in one or more of the five forces is likely squeezing every competitor, not just this one firm',
        'This pattern is impossible and must reflect a data error',
        'The five forces framework cannot explain industry-wide profitability trends'
      ], correctAnswer: 'A structural, industry-wide shift in one or more of the five forces is likely squeezing every competitor, not just this one firm',
      hint: 'When an entire industry underperforms at once, look for a cause that affects the whole industry, not just one firm.',
      approach: 'Five Forces is a structural, industry-level lens — a pattern affecting every competitor simultaneously points to a structural cause rather than individual firm-level failure.',
      solution: 'When an entire industry underperforms simultaneously, a structural, industry-level cause (e.g. new low-cost entrants, or a strong emerging substitute) is far more plausible than every individual competitor independently mismanaging their own strategy at the same time.',
      recognitionTechnique: 'Other', commonTrap: 'Diagnosing an industry-wide profitability decline as a firm-specific management failure, missing the structural, industry-level pattern.',
      tags: ['frameworks', 'five-forces']
    },
    {
      id: 'con_b040', topic: 'Business Frameworks', subtopic: '3 C\'s', difficulty: 1, targetTime: 60,
      prompt: 'What do the "3 C\'s" in the case-interview situational framework stand for?',
      answerType: 'mc', options: ['Company, Customers, Competitors', 'Cost, Capital, Cash flow', 'Clarify, Construct, Conclude', 'Channels, Context, Cost'], correctAnswer: 'Company, Customers, Competitors',
      hint: 'This framework scans a business situation from three angles: internal, demand-side, and rival-side.',
      approach: 'The 3 C\'s is a fast, qualitative situational scan used to orient thinking early in a case.',
      solution: 'The 3 C\'s stand for Company (internal position), Customers (demand side), and Competitors (rival firms) — a fast qualitative first-pass scan of a business situation.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing the 3 C\'s with the 4 P\'s or with the common "4th C" extensions (Channels, Context/Cost).',
      tags: ['frameworks', '3cs']
    },
    {
      id: 'con_b041', topic: 'Business Frameworks', subtopic: '3 C\'s', difficulty: 2, targetTime: 75,
      prompt: 'Why is the 3 C\'s framework often especially useful very early in an OPEN-ENDED case, before the interviewer has shared much specific data?',
      answerType: 'mc', options: [
        'It requires extensive financial data to apply',
        'It is a fast, qualitative scan that works even before detailed data is available, making it useful for generating early clarifying questions',
        'It is only usable at the very end of a case',
        'It automatically replaces the need for any further analysis'
      ], correctAnswer: 'It is a fast, qualitative scan that works even before detailed data is available, making it useful for generating early clarifying questions',
      hint: 'Think about what tool works when almost nothing specific is known yet about the situation.',
      approach: 'A detailed, quantitative framework needs data to hang on its branches; a qualitative scan does not.',
      solution: 'Because the 3 C\'s does not depend on detailed data, it can generate broadly relevant clarifying questions ("what does the client\'s business look like? who are the customers? who are the competitors?") right from the start of Clarify, before a more data-dependent framework could usefully be applied.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming every useful framework requires data to be shared first, missing the specific value of a qualitative first-pass tool.',
      tags: ['frameworks', '3cs']
    },
    {
      id: 'con_b042', topic: 'Business Frameworks', subtopic: '3 C\'s', difficulty: 2, targetTime: 75,
      prompt: 'A candidate uses only the 3 C\'s scan for an ENTIRE case, even after detailed financial data becomes available midway through. What is the main risk of this approach?',
      answerType: 'mc', options: [
        'There is no risk — the 3 C\'s is always sufficient on its own',
        'The analysis stays too shallow, since the 3 C\'s is a qualitative first pass, not a precise diagnostic tool suited to detailed, data-driven analysis',
        'The 3 C\'s framework becomes mathematically invalid once data is available',
        'This guarantees the strongest possible case performance'
      ], correctAnswer: 'The analysis stays too shallow, since the 3 C\'s is a qualitative first pass, not a precise diagnostic tool suited to detailed, data-driven analysis',
      hint: 'A tool built for a fast qualitative scan is not the same as a tool built for precise, data-driven diagnosis.',
      approach: 'The 3 C\'s trades precision for speed and breadth — appropriate early, but not as the sole tool once real data is available.',
      solution: 'Once real data is available, sticking with a deliberately broad, qualitative scan instead of transitioning to a sharper, more quantitative framework (like a profitability tree or Five Forces) leaves the analysis shallower than it should be.',
      recognitionTechnique: 'Other', commonTrap: 'Never transitioning from an appropriate early-case tool (3 C\'s) to a more precise, data-driven framework once the case actually provides data to analyze.',
      tags: ['frameworks', '3cs']
    },
    {
      id: 'con_b043', topic: 'Business Frameworks', subtopic: '4 P\'s', difficulty: 1, targetTime: 60,
      prompt: 'What do the 4 P\'s (Product, Price, Promotion, Placement) framework primarily structure?',
      answerType: 'mc', options: [
        'The tactical decisions involved in bringing a product to market',
        'A company\'s internal organizational alignment',
        'An industry\'s overall structural attractiveness',
        'A portfolio of business units by growth and share'
      ], correctAnswer: 'The tactical decisions involved in bringing a product to market',
      hint: 'This framework operates at a more granular, execution-focused level than a broad strategic or industry framework.',
      approach: 'The 4 P\'s addresses the specific go-to-market mix: what is sold, at what price, how demand is generated, and through which channels.',
      solution: 'The 4 P\'s structures the tactical go-to-market mix (Product, Price, Promotion, Placement), distinct from broader strategic tools like Five Forces (industry structure) or 7S (organizational alignment).',
      recognitionTechnique: 'Other', commonTrap: 'Confusing the 4 P\'s tactical go-to-market focus with a broader strategic or organizational framework.',
      tags: ['frameworks', '4ps']
    },
    {
      id: 'con_b044', topic: 'Business Frameworks', subtopic: '4 P\'s', difficulty: 2, targetTime: 75,
      prompt: 'A well-reviewed product with competitive pricing and active advertising still sells poorly because it is only stocked in a handful of stores far from where target customers actually shop. Which P is the isolated weak link?',
      answerType: 'mc', options: ['Product', 'Price', 'Promotion', 'Placement'], correctAnswer: 'Placement',
      hint: 'Product, Price, and Promotion are all functioning well in this scenario — the gap is in how the product actually reaches customers.',
      approach: 'The 4 P\'s lets a candidate rule three P\'s in as functioning well and isolate the one genuine weak link.',
      solution: 'Product quality, pricing, and promotion are all confirmed to be working — the specific gap is Placement, the channels through which the product physically reaches its target customers.',
      recognitionTechnique: 'Other', commonTrap: 'Diagnosing a vague "go-to-market problem" without isolating which specific P is actually responsible.',
      tags: ['frameworks', '4ps']
    },
    {
      id: 'con_b045', topic: 'Business Frameworks', subtopic: '4 P\'s', difficulty: 2, targetTime: 75,
      prompt: 'A B2B software company has a strong product, competitive price, and good distribution, but potential customers report never having heard of it before a sales rep contacted them directly. Which P is the weak link?',
      answerType: 'mc', options: ['Product', 'Price', 'Promotion', 'Placement'], correctAnswer: 'Promotion',
      hint: 'The issue is a lack of inbound awareness before any direct sales contact — think about which P covers demand generation and communication.',
      approach: 'Promotion covers how customers learn about and are persuaded to buy the product, distinct from how it is distributed (Placement).',
      solution: 'No inbound awareness (advertising, content marketing, PR) building demand ahead of direct sales contact points specifically to a Promotion gap, not a Placement, Price, or Product issue, all three of which are already confirmed strong.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing lack of awareness (a Promotion issue) with a distribution/access issue (Placement).',
      tags: ['frameworks', '4ps']
    },
    {
      id: 'con_b046', topic: 'Business Frameworks', subtopic: 'Value Chain', difficulty: 1, targetTime: 60,
      prompt: 'In the simplified value chain, which stage comes immediately after "Operations"?',
      answerType: 'mc', options: ['Inbound Logistics', 'Outbound Logistics', 'Marketing & Sales', 'Service'], correctAnswer: 'Outbound Logistics',
      hint: 'The chain runs from receiving inputs, through transforming them, to getting the finished product out.',
      approach: 'Simplified value chain: Inbound Logistics → Operations → Outbound Logistics → Marketing & Sales → Service.',
      solution: 'After Operations (transforming inputs into the finished product), the next stage is Outbound Logistics — getting the finished product to the point of sale or delivery.',
      recognitionTechnique: 'Other', commonTrap: 'Reversing the order of Outbound Logistics and Marketing & Sales in the sequence.',
      tags: ['frameworks', 'value-chain']
    },
    {
      id: 'con_b047', topic: 'Business Frameworks', subtopic: 'Value Chain', difficulty: 3, targetTime: 90,
      prompt: 'A manufacturer\'s cost problem is not found in any of the five primary value-chain activities when checked individually, but stems from uncoordinated, decentralized purchasing across the whole company, missing volume-discount leverage. Which category does this issue belong to?',
      answerType: 'mc', options: [
        'Outbound Logistics, since purchasing involves moving goods',
        'The Procurement support activity, which cuts across all primary activities',
        'Marketing & Sales, since purchasing affects final pricing',
        'This scenario cannot occur under the value chain framework'
      ], correctAnswer: 'The Procurement support activity, which cuts across all primary activities',
      hint: 'This issue does not sit inside any single sequential stage — it cuts across all of them at once.',
      approach: 'The Porter-style value chain adds four cross-cutting support activities (Firm Infrastructure, HR Management, Technology Development, Procurement) alongside the five primary activities.',
      solution: 'Uncoordinated purchasing across the whole company is a Procurement issue — a support activity that cuts across every primary activity, which is exactly why it can be the source of a cost problem even when every individual primary activity looks fine on its own.',
      recognitionTechnique: 'Other', commonTrap: 'Only checking the five primary activities and concluding no issue exists, missing that a cross-cutting support activity can still be the actual source.',
      tags: ['frameworks', 'value-chain']
    },
    {
      id: 'con_b048', topic: 'Business Frameworks', subtopic: 'Value Chain', difficulty: 2, targetTime: 75,
      prompt: 'Customer complaints center specifically on slow post-purchase issue resolution and returns handling, not on product quality or availability. Which value-chain stage does this point to?',
      answerType: 'mc', options: ['Inbound Logistics', 'Operations', 'Service', 'Firm Infrastructure'], correctAnswer: 'Service',
      hint: 'Post-purchase support and issue resolution fall under the final stage of the primary activities.',
      approach: 'Walking the chain stage by stage narrows a vague complaint pattern down to the specific stage actually responsible.',
      solution: 'Post-purchase support and returns handling fall under the Service stage of the primary activities, distinct from Operations (production) or Inbound Logistics (receiving inputs).',
      recognitionTechnique: 'Other', commonTrap: 'Confusing a post-purchase support issue (Service) with a product-quality issue (Operations).',
      tags: ['frameworks', 'value-chain']
    },
    {
      id: 'con_b049', topic: 'Business Frameworks', subtopic: 'BCG Matrix', difficulty: 1, targetTime: 60,
      prompt: 'In the BCG Growth-Share Matrix, a business unit with LOW market growth and HIGH relative market share is classified as a:', answerType: 'mc',
      options: ['Star', 'Question Mark', 'Cash Cow', 'Dog'], correctAnswer: 'Cash Cow',
      hint: 'This quadrant describes a mature, dominant business that no longer needs heavy reinvestment to maintain its position.',
      approach: 'BCG quadrants: high growth/high share = Star; high growth/low share = Question Mark; low growth/high share = Cash Cow; low growth/low share = Dog.',
      solution: 'Low growth combined with high relative market share is the Cash Cow quadrant — a mature, dominant business generating more cash than it needs to maintain its position.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing Cash Cow (low growth, high share) with Star (high growth, high share) — both involve high share, but differ on growth.',
      tags: ['frameworks', 'bcg']
    },
    {
      id: 'con_b050', topic: 'Business Frameworks', subtopic: 'BCG Matrix', difficulty: 2, targetTime: 75,
      prompt: 'A business unit sits in a high-growth market but holds only a distant #4 market share position behind three larger competitors. Which BCG quadrant is this, and what is the central strategic question it raises?',
      answerType: 'mc', options: [
        'Cash Cow — whether to maintain its dominant position',
        'Question Mark — whether further investment could realistically win a leading position, or whether to divest instead',
        'Dog — whether to wind it down immediately with no further consideration',
        'Star — how best to defend its already-dominant position'
      ], correctAnswer: 'Question Mark — whether further investment could realistically win a leading position, or whether to divest instead',
      hint: 'High growth but low relative share is a distinct quadrant from both Star and Dog.',
      approach: 'Question Marks sit in attractive, fast-growing markets without yet having won a leading position.',
      solution: 'High growth combined with low relative share is the Question Mark quadrant, and the open strategic question is precisely whether investment could realistically build a leading position, or whether the unit should be divested instead.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming any business unit in a high-growth market is automatically a Star, without checking its relative market share.',
      tags: ['frameworks', 'bcg']
    },
    {
      id: 'con_b051', topic: 'Business Frameworks', subtopic: 'BCG Matrix', difficulty: 3, targetTime: 90,
      prompt: 'Why does a Star, despite strong revenue and leading market share, often still require significant continued cash investment rather than being a pure source of surplus cash like a Cash Cow?',
      answerType: 'mc', options: [
        'Stars never actually require any investment',
        'A Star sits in a still-growing market, so maintaining and defending its leading position typically requires continued spending on capacity, R&D, or marketing to keep pace with that growth',
        'Stars always have negative revenue',
        'This is only true for technology companies'
      ], correctAnswer: 'A Star sits in a still-growing market, so maintaining and defending its leading position typically requires continued spending on capacity, R&D, or marketing to keep pace with that growth',
      hint: 'The key difference from a Cash Cow is whether the underlying market is still expanding.',
      approach: 'A Star\'s market is still growing, unlike a Cash Cow\'s mature, no-longer-growing market.',
      solution: 'Because the market is still growing, defending a leading position usually requires continued investment (capacity, R&D, marketing) to keep pace — unlike a Cash Cow, whose mature, flat market requires little further investment to maintain its position.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming high market share alone (regardless of growth rate) implies a business unit generates pure surplus cash.',
      tags: ['frameworks', 'bcg']
    },
    {
      id: 'con_b052', topic: 'Business Frameworks', subtopic: 'Ansoff Matrix', difficulty: 1, targetTime: 60,
      prompt: 'Under Ansoff\'s Matrix, which growth strategy (existing product, existing market) is generally considered the LOWEST-risk?',
      answerType: 'mc', options: ['Market Penetration', 'Product Development', 'Market Development', 'Diversification'], correctAnswer: 'Market Penetration',
      hint: 'This strategy requires no new product development and no unfamiliar market.',
      approach: 'Ansoff classifies growth strategies by product (existing/new) × market (existing/new).',
      solution: 'Market Penetration (existing product, existing market) requires no new product development and no unfamiliar market, making it the lowest-risk of the four Ansoff strategies.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing Market Penetration with Market Development, which involves an existing product but a NEW, unfamiliar market.',
      tags: ['frameworks', 'ansoff']
    },
    {
      id: 'con_b053', topic: 'Business Frameworks', subtopic: 'Ansoff Matrix', difficulty: 2, targetTime: 75,
      prompt: 'A coffee chain sells its existing, unchanged café format and menu in a brand-new international market it has never entered before. Which Ansoff strategy is this?',
      answerType: 'mc', options: ['Market Penetration', 'Product Development', 'Market Development', 'Diversification'], correctAnswer: 'Market Development',
      hint: 'The product is unchanged; only the market is new.',
      approach: 'Existing product combined with a new market is Market Development.',
      solution: 'Existing product, new market is Market Development — moderate risk concentrated in market/cultural unfamiliarity, since the product itself is already proven domestically.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing Market Development (existing product, new market) with Product Development (new product, existing market) — the two moderate-risk quadrants are easy to mix up.',
      tags: ['frameworks', 'ansoff']
    },
    {
      id: 'con_b054', topic: 'Business Frameworks', subtopic: 'Ansoff Matrix', difficulty: 3, targetTime: 90,
      prompt: 'Why is Diversification (new product, new market) considered the HIGHEST-risk of the four Ansoff strategies, rather than merely "somewhat riskier" than the other three?',
      answerType: 'mc', options: [
        'It is not actually the highest-risk strategy',
        'It compounds two fully independent sources of uncertainty simultaneously — an unproven product AND an unfamiliar market — whereas the other three quadrants each introduce at most one new source of uncertainty',
        'Diversification always fails, with no exceptions',
        'Risk level has nothing to do with how many things are new at once'
      ], correctAnswer: 'It compounds two fully independent sources of uncertainty simultaneously — an unproven product AND an unfamiliar market — whereas the other three quadrants each introduce at most one new source of uncertainty',
      hint: 'Compare how many things are genuinely unknown at once in each quadrant.',
      approach: 'Product Development and Market Development each hold one side of the equation familiar and proven; Diversification has neither anchor.',
      solution: 'Product Development and Market Development each keep one side (product or market) familiar and proven, while Diversification stacks both sources of uncertainty at once, with no familiar anchor on either side.',
      recognitionTechnique: 'Other', commonTrap: 'Treating all four Ansoff quadrants as roughly equally risky simply because they are all labeled "growth strategies."',
      tags: ['frameworks', 'ansoff']
    },
    {
      id: 'con_b055', topic: 'Business Frameworks', subtopic: '7S / Fallbacks', difficulty: 2, targetTime: 75,
      prompt: 'In the McKinsey 7S framework, which element sits at the CENTER of the classic diagram, influencing all the others?',
      answerType: 'mc', options: ['Strategy', 'Shared Values', 'Systems', 'Structure'], correctAnswer: 'Shared Values',
      hint: 'This is one of the four "soft" elements, and it is positioned as the core the other six elements surround.',
      approach: 'McKinsey 7S splits into 3 "hard" elements (Strategy, Structure, Systems) and 4 "soft" elements (Shared Values, Skills, Staff, Style).',
      solution: 'Shared Values (the core culture and beliefs) sits at the center of the classic 7S diagram, positioned as influencing all six other elements.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming Strategy, as the most commonly discussed element, must be the one at the center of the diagram.',
      tags: ['frameworks', '7s']
    },
    {
      id: 'con_b056', topic: 'Business Frameworks', subtopic: '7S / Fallbacks', difficulty: 2, targetTime: 75,
      prompt: 'A retailer\'s new strategy emphasizes exceptional in-store customer service, but its sales-staff rewards system pays commission purely on total sales volume, with nothing tied to customer satisfaction. What does this illustrate?',
      answerType: 'mc', options: [
        'A pricing error unrelated to organizational alignment',
        'A misalignment between the Rewards (or Systems) element and the stated Strategy, a common cause of failed initiatives',
        'An industry structural weakness best addressed with Five Forces',
        'A market-sizing error'
      ], correctAnswer: 'A misalignment between the Rewards (or Systems) element and the stated Strategy, a common cause of failed initiatives',
      hint: 'Staff respond to the incentives they actually operate under, not to what the strategy document says.',
      approach: 'The Star Diagram\'s Rewards point (or 7S\'s Systems element) can pull against the stated Strategy if incentives are not aligned with it.',
      solution: 'Employees respond to the actual incentives they operate under day to day — a rewards system that incentivizes pure sales volume works against a strategy emphasizing service quality, exactly the kind of misalignment 7S/the Star Diagram is designed to surface.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming a well-designed strategy will succeed regardless of whether the surrounding incentive systems actually support it.',
      tags: ['frameworks', '7s', 'star-diagram']
    },
    {
      id: 'con_b057', topic: 'Business Frameworks', subtopic: '7S / Fallbacks', difficulty: 2, targetTime: 75,
      prompt: 'When should SWOT or Cost-Benefit Analysis generally be used as the framework of choice for a case?',
      answerType: 'mc', options: [
        'As the first choice for every single case, regardless of type',
        'As a fallback, specifically when no more tailored, specific framework (like Five Forces or a profitability tree) clearly fits the situation',
        'Never — these frameworks should never be used in a case interview',
        'Only for cases explicitly about nonprofit organizations'
      ], correctAnswer: 'As a fallback, specifically when no more tailored, specific framework (like Five Forces or a profitability tree) clearly fits the situation',
      hint: 'These two frameworks are intentionally general-purpose, which is exactly what makes them useful as a specific kind of tool.',
      approach: 'SWOT and Cost-Benefit are less diagnostic than a tailored framework, which is why they are positioned as fallbacks rather than first choices.',
      solution: 'SWOT and Cost-Benefit are intentionally general-purpose and less diagnostic than a tailored framework, making them most appropriate specifically when nothing more specific applies — not as the default first choice for every case.',
      recognitionTechnique: 'Other', commonTrap: 'Reaching for SWOT or Cost-Benefit as the first-choice framework even when a more specific, better-fitting framework (like Five Forces) clearly applies to the situation.',
      tags: ['frameworks', 'swot', 'cost-benefit']
    }
  );

  /* ---------------------------- INDUSTRY KNOWLEDGE ---------------------------- */
  items.push(
    {
      id: 'con_b058', topic: 'Industry Knowledge', subtopic: 'CPG / Retail / E-Commerce', difficulty: 2, targetTime: 75,
      prompt: 'In the CPG (Consumer Packaged Goods) industry, who is typically the company\'s true "customer" in a B2B2C sense?',
      answerType: 'mc', options: ['The end consumer directly', 'The retailer who stocks and resells the product', 'The government', 'Competing CPG companies'], correctAnswer: 'The retailer who stocks and resells the product',
      hint: 'CPG companies sell to an intermediary before the product reaches the shopper.',
      approach: 'CPG typically sells through retail intermediaries, making the retailer the direct customer, with consumers reached via separate brand marketing.',
      solution: 'CPG companies sell to retailers, who then resell to end consumers — the retailer is the direct customer in this B2B2C structure, while consumers are reached separately through brand marketing.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming the end consumer is always the direct customer, missing the retailer intermediary step specific to CPG.',
      tags: ['industry-knowledge', 'cpg']
    },
    {
      id: 'con_b059', topic: 'Industry Knowledge', subtopic: 'CPG / Retail / E-Commerce', difficulty: 2, targetTime: 75,
      prompt: 'What is the defining current trend putting pressure on E-Commerce businesses specifically?',
      answerType: 'mc', options: ['A total absence of digital advertising', 'The rising cost of customer acquisition, as digital advertising grows more competitive and privacy regulation limits targeting precision', 'A shortage of physical retail store locations', 'Falling website traffic with no explanation'], correctAnswer: 'The rising cost of customer acquisition, as digital advertising grows more competitive and privacy regulation limits targeting precision',
      hint: 'Think about what has become more expensive for e-commerce businesses to obtain.',
      approach: 'E-commerce revenue depends on website traffic and conversion, both of which are increasingly costly to generate via digital advertising.',
      solution: 'Rising digital customer acquisition costs, driven by advertising competition and privacy regulation limiting targeting precision, are the specific structural pressure facing e-commerce businesses.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing e-commerce\'s acquisition-cost pressure with retail\'s omnichannel pressure — the two industries face related but distinct current trends.',
      tags: ['industry-knowledge', 'e-commerce']
    },
    {
      id: 'con_b060', topic: 'Industry Knowledge', subtopic: 'CPG / Retail / E-Commerce', difficulty: 3, targetTime: 90,
      prompt: 'What is the standard revenue formula for a physical Retail business?',
      answerType: 'mc', options: ['Foot Traffic × Conversion Rate × Average Transaction Value', 'Website Traffic × Conversion Rate × Average Order Value', 'Volume × Price only', 'Billable Hours × Rate'], correctAnswer: 'Foot Traffic × Conversion Rate × Average Transaction Value',
      hint: 'Physical retail depends on people physically entering the store.',
      approach: 'Retail revenue depends on how many people enter the store, what fraction buy, and how much they spend.',
      solution: 'Physical retail revenue = Foot Traffic × Conversion Rate × Average Transaction Value, distinct from e-commerce\'s website-traffic-based formula.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing the physical retail revenue formula (foot traffic) with the e-commerce formula (website traffic).',
      tags: ['industry-knowledge', 'retail']
    },
    {
      id: 'con_b061', topic: 'Industry Knowledge', subtopic: 'Automotive / Energy / Clean Energy', difficulty: 2, targetTime: 75,
      prompt: 'What is the defining current trend reshaping the Automotive industry?',
      answerType: 'mc', options: ['A total absence of competition', 'The capital-intensive, industry-wide transition from internal combustion engines (ICE) toward electric vehicles (EVs)', 'A permanent halt in vehicle production worldwide', 'A complete shift away from personal vehicle ownership'], correctAnswer: 'The capital-intensive, industry-wide transition from internal combustion engines (ICE) toward electric vehicles (EVs)',
      hint: 'Think about what is forcing incumbent automakers to fund two manufacturing platforms at once.',
      approach: 'The ICE-to-EV transition is the specific, currently reshaping force in Automotive.',
      solution: 'The ICE-to-EV transition is forcing incumbents to fund overlapping manufacturing platforms simultaneously, a defining, capital-intensive current pressure.',
      recognitionTechnique: 'Other', commonTrap: 'Describing the trend too vaguely (e.g. "increased competition") instead of naming the specific ICE-to-EV transition.',
      tags: ['industry-knowledge', 'automotive']
    },
    {
      id: 'con_b062', topic: 'Industry Knowledge', subtopic: 'Automotive / Energy / Clean Energy', difficulty: 3, targetTime: 90,
      prompt: 'Why is a traditional Energy (oil & gas) company\'s revenue considered heavily exposed to factors largely outside any single company\'s control?',
      answerType: 'mc', options: ['Because its revenue depends on a global commodity price set by broad supply and demand, not by the individual company', 'Because oil & gas companies never set their own production volumes', 'Because energy companies have no customers at all', 'Because commodity prices are set individually by each producer'], correctAnswer: 'Because its revenue depends on a global commodity price set by broad supply and demand, not by the individual company',
      hint: 'Think about which half of the Volume × Price revenue formula a single producer can actually control.',
      approach: 'Energy revenue = Volume × Commodity Price, and the price component is set globally, largely outside any one company\'s control.',
      solution: 'The commodity PRICE component of Energy revenue is a global market price, unlike a more controllable list price in other industries, making Energy revenue heavily exposed to factors outside any single company\'s control.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming energy companies set prices the same way a CPG or retail company sets a list price.',
      tags: ['industry-knowledge', 'energy']
    },
    {
      id: 'con_b063', topic: 'Industry Knowledge', subtopic: 'Automotive / Energy / Clean Energy', difficulty: 3, targetTime: 90,
      prompt: 'What role does a Power Purchase Agreement (PPA) typically play in the Clean Energy industry\'s revenue model?',
      answerType: 'mc', options: ['It has no effect on revenue', 'It locks in a price for electricity sold over a long term, making revenue substantially predictable once the asset is built', 'It sets the global wholesale oil price', 'It is a vehicle financing arrangement specific to Automotive'], correctAnswer: 'It locks in a price for electricity sold over a long term, making revenue substantially predictable once the asset is built',
      hint: 'Think about what makes clean energy behave more like an infrastructure investment than a traditional commodity business.',
      approach: 'A PPA is a long-term contract fixing the price a developer receives for its electricity output.',
      solution: 'A PPA locks in the electricity price for a long term (often 15+ years), making a clean energy developer\'s post-construction revenue substantially predictable, unlike traditional Energy\'s ongoing commodity-price exposure.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing clean energy\'s PPA-locked revenue model with traditional energy\'s ongoing commodity-price exposure.',
      tags: ['industry-knowledge', 'clean-energy']
    },
    {
      id: 'con_b064', topic: 'Industry Knowledge', subtopic: 'Pharma / Hospitals / Financial Services', difficulty: 2, targetTime: 75,
      prompt: 'What happens to a specific drug\'s revenue when its patent protection expires and generic competitors enter — a phenomenon commonly called a "patent cliff"?',
      answerType: 'mc', options: ['Revenue typically rises sharply', 'Revenue typically falls sharply as cheaper generics take share', 'Revenue stays completely flat', 'The patent is usually automatically renewed'], correctAnswer: 'Revenue typically falls sharply as cheaper generics take share',
      hint: 'Generic competitors can legally enter and undercut price once patent protection ends.',
      approach: 'Patent expiration removes legal exclusivity, allowing cheaper generics to rapidly take share from the branded drug.',
      solution: 'A "patent cliff" describes the sharp, predictable revenue decline a drug experiences once patent protection ends and generic competitors legally enter the market.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming patent expiration is a minor or gradual event rather than the sharp, structural revenue cliff it typically causes.',
      tags: ['industry-knowledge', 'pharma']
    },
    {
      id: 'con_b065', topic: 'Industry Knowledge', subtopic: 'Pharma / Hospitals / Financial Services', difficulty: 2, targetTime: 75,
      prompt: 'What is typically the LARGEST single cost category for a Hospital?', answerType: 'mc',
      options: ['Marketing and advertising', 'Labor (physicians, nurses, and staff)', 'Raw materials/commodities', 'Retail real estate rent'], correctAnswer: 'Labor (physicians, nurses, and staff)',
      hint: 'Hospitals sell expert medical labor and care, not a physical product.',
      approach: 'Hospital costs are dominated by the labor required to deliver patient care.',
      solution: 'Labor costs — physicians, nurses, and other staff — are typically the dominant cost category for hospitals, which is why staffing shortages hit hospital profitability especially hard.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming medical equipment, not labor, is a hospital\'s largest cost category.',
      tags: ['industry-knowledge', 'hospitals']
    },
    {
      id: 'con_b066', topic: 'Industry Knowledge', subtopic: 'Pharma / Hospitals / Financial Services', difficulty: 3, targetTime: 90,
      prompt: 'What is the defining current pressure facing traditional retail/commercial banks?',
      answerType: 'mc', options: ['A total absence of regulation', 'Intensifying competition from fintech challengers operating with a much lower fixed-cost base (no physical branch network)', 'A complete halt in all lending activity', 'The total elimination of interest rates'], correctAnswer: 'Intensifying competition from fintech challengers operating with a much lower fixed-cost base (no physical branch network)',
      hint: 'Think about what a digital-only competitor can offer that a traditional branch-based bank struggles to match.',
      approach: 'Fintech competitors\' lower fixed-cost structure lets them compete aggressively on rates and convenience.',
      solution: 'Fintech challengers\' much lower fixed-cost base (no branch network) lets them offer better rates while remaining profitable, pressuring traditional banks to invest heavily in digital capabilities.',
      recognitionTechnique: 'Other', commonTrap: 'Treating fintech competition as purely a marketing challenge rather than a structural cost-base disadvantage for traditional banks.',
      tags: ['industry-knowledge', 'financial-services']
    },
    {
      id: 'con_b067', topic: 'Industry Knowledge', subtopic: 'Technology / Media / Telecom', difficulty: 1, targetTime: 60,
      prompt: 'What do MRR and ARR stand for in the context of a Technology/SaaS company\'s revenue?',
      answerType: 'mc', options: ['Monthly/Annual Recurring Revenue', 'Marketing Return Rate', 'Maximum Revenue Realized', 'Minimum Return Ratio'], correctAnswer: 'Monthly/Annual Recurring Revenue',
      hint: 'These are the standard metrics for tracking a subscription business\'s predictable revenue base.',
      approach: 'MRR and ARR track a subscription business\'s recurring revenue base.',
      solution: 'MRR (Monthly Recurring Revenue) and ARR (Annual Recurring Revenue) are the standard ways SaaS businesses track their predictable, recurring revenue.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing MRR/ARR with one-time or non-recurring revenue metrics.',
      tags: ['industry-knowledge', 'technology']
    },
    {
      id: 'con_b068', topic: 'Industry Knowledge', subtopic: 'Technology / Media / Telecom', difficulty: 2, targetTime: 75,
      prompt: 'What does "cord-cutting" refer to in the Media industry?',
      answerType: 'mc', options: ['A type of content licensing agreement between studios', 'The ongoing consumer shift away from traditional cable/linear television toward streaming services', 'A telecom-specific cost-cutting measure', 'A regulatory requirement affecting broadcast media only'], correctAnswer: 'The ongoing consumer shift away from traditional cable/linear television toward streaming services',
      hint: 'This term describes consumers cancelling one type of subscription in favor of another.',
      approach: '"Cord-cutting" describes the structural shift of media consumption from cable to streaming.',
      solution: '"Cord-cutting" describes consumers canceling traditional cable subscriptions in favor of streaming, the defining current pressure reshaping legacy media companies\' revenue mix.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing "cord-cutting" with a cost-management term rather than a consumer-behavior/demand-shift term.',
      tags: ['industry-knowledge', 'media']
    },
    {
      id: 'con_b069', topic: 'Industry Knowledge', subtopic: 'Technology / Media / Telecom', difficulty: 3, targetTime: 90,
      prompt: 'Why does operating in a "saturated" market (like Telecom in most developed countries) shift a company\'s growth strategy specifically toward upgrading existing customers rather than acquiring new ones?',
      answerType: 'mc', options: [
        'Saturation has no effect on growth strategy',
        'When most potential customers already have the service, the pool of genuinely new customers to acquire is small, so growth in average revenue per user becomes the more available lever',
        'Saturated markets always mean a company should exit the industry',
        'New customer acquisition is always the best strategy regardless of saturation'
      ], correctAnswer: 'When most potential customers already have the service, the pool of genuinely new customers to acquire is small, so growth in average revenue per user becomes the more available lever',
      hint: 'Think about how many genuinely new customers remain to be won once nearly everyone already has the product.',
      approach: 'With few new customers left to win, growth shifts toward monetizing (upgrading) the existing customer base.',
      solution: 'With most potential customers already served, the available growth lever naturally shifts from acquisition toward upgrading existing customers to higher-priced plans (average-revenue-per-user growth).',
      recognitionTechnique: 'Other', commonTrap: 'Assuming acquisition-focused growth strategy applies equally regardless of how saturated the market already is.',
      tags: ['industry-knowledge', 'telecom']
    },
    {
      id: 'con_b070', topic: 'Industry Knowledge', subtopic: 'Real Estate / Travel / Professional Services', difficulty: 2, targetTime: 75,
      prompt: 'Why is Real Estate described as highly sensitive to interest rates specifically?',
      answerType: 'mc', options: ['Real estate has no meaningful sensitivity to interest rates', 'Real estate is typically financed with substantial debt, so rising interest rates directly raise financing costs across the industry', 'Interest rates only affect Technology companies', 'Real estate financing never involves debt'], correctAnswer: 'Real estate is typically financed with substantial debt, so rising interest rates directly raise financing costs across the industry',
      hint: 'Think about how real estate is typically funded.',
      approach: 'Real estate is heavily debt-financed, so interest rate changes flow directly into financing costs.',
      solution: 'Because real estate is heavily debt-financed, rising interest rates directly raise financing costs, making the industry unusually sensitive to rate movements.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming real estate is financed primarily with equity, missing its typically heavy reliance on debt financing.',
      tags: ['industry-knowledge', 'real-estate']
    },
    {
      id: 'con_b071', topic: 'Industry Knowledge', subtopic: 'Real Estate / Travel / Professional Services', difficulty: 3, targetTime: 90,
      prompt: 'What is typically the LARGEST cost category for a Professional Services firm (consulting, law, accounting)?',
      answerType: 'mc', options: ['Raw materials/commodities', 'Compensation, since the firm\'s "product" is expert labor itself', 'Real estate/property ownership', 'Fuel costs'], correctAnswer: 'Compensation, since the firm\'s "product" is expert labor itself',
      hint: 'Think about what a professional services firm is actually selling to its clients.',
      approach: 'Professional Services sells expert labor directly, making compensation the dominant cost category.',
      solution: 'Because Professional Services sells expert labor directly, compensation for that labor is by far the dominant cost category, unlike industries selling a physical product.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming office real estate or technology costs dominate, rather than the compensation of the expert professionals themselves.',
      tags: ['industry-knowledge', 'professional-services']
    },
    {
      id: 'con_b072', topic: 'Industry Knowledge', subtopic: 'Real Estate / Travel / Professional Services', difficulty: 3, targetTime: 90,
      prompt: 'A commercial office REIT\'s rental income falls even though rent PER SQUARE FOOT stayed flat. What does this most directly point to?',
      answerType: 'mc', options: ['A pricing problem, since rent per square foot must have fallen', 'A falling OCCUPANCY problem, since rental revenue = occupied square footage × rent per square foot and rent held flat', 'A currency exchange rate issue', 'An unrelated marketing problem'], correctAnswer: 'A falling OCCUPANCY problem, since rental revenue = occupied square footage × rent per square foot and rent held flat',
      hint: 'If one half of the revenue formula stayed constant, the decline must trace to the other half.',
      approach: 'Rental revenue = Occupied Square Footage × Rent per Square Foot — with rent flat, the decline must trace to occupancy.',
      solution: 'Since rent per square foot held flat, the revenue decline must come from falling occupancy — consistent with the office-vacancy trend driven by remote/hybrid work, not a pricing problem.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming any real estate revenue decline must be a pricing problem, without checking whether occupancy (the other half of the formula) actually moved.',
      tags: ['industry-knowledge', 'real-estate']
    },
    {
      id: 'con_b073', topic: 'Industry Knowledge', subtopic: 'Sizing benchmarks', difficulty: 1, targetTime: 45,
      prompt: 'What is the correct order of magnitude for the current US population?',
      answerType: 'mc', options: ['Roughly 33 million', 'Roughly 330-340 million', 'Roughly 3.3 billion', 'Roughly 33 billion'], correctAnswer: 'Roughly 330-340 million',
      hint: 'The US is the third most populous country, but well below the two countries with over a billion people each.',
      approach: 'Recall the order-of-magnitude benchmark for US population as a market-sizing anchor.',
      solution: 'The US population is roughly 330-340 million — an order of magnitude above 33 million and an order of magnitude below 3.3 billion.',
      recognitionTechnique: 'Other', commonTrap: 'Being off by an entire order of magnitude rather than recalling the correct general scale.',
      tags: ['industry-knowledge', 'sizing-facts']
    },
    {
      id: 'con_b074', topic: 'Industry Knowledge', subtopic: 'Sizing benchmarks', difficulty: 2, targetTime: 75,
      prompt: 'Why does what is actually being tested with these population/GDP benchmarks matter more as ORDER OF MAGNITUDE than as an exact, precise figure?',
      answerType: 'mc', options: [
        'Because exact figures never change over time',
        'Because these figures drift gradually over time, so a fixed "exact" number would quickly become stale — the durable, testable skill is knowing the correct power of ten',
        'Because order of magnitude is easier to memorize but less useful in practice',
        'Precision does not matter at all, even to the nearest power of ten'
      ], correctAnswer: 'Because these figures drift gradually over time, so a fixed "exact" number would quickly become stale — the durable, testable skill is knowing the correct power of ten',
      hint: 'Think about why testing an exact point-in-time figure would be a bad long-term quiz design choice.',
      approach: 'Order-of-magnitude recall remains valid for years, unlike a precise figure that drifts and goes stale.',
      solution: 'Since exact figures decay over time while the correct order of magnitude remains stable for years, testing order-of-magnitude recall keeps the skill durable rather than rewarding memorization of a soon-outdated number.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming precision to the nearest exact figure is the goal, rather than recognizing that a stable, durable order-of-magnitude estimate is what actually matters for case purposes.',
      tags: ['industry-knowledge', 'sizing-facts']
    },
    {
      id: 'con_b075', topic: 'Industry Knowledge', subtopic: 'Sizing benchmarks', difficulty: 3, targetTime: 90,
      prompt: 'A candidate\'s market-sizing estimate for a US product category comes out larger than the entire US GDP (roughly $25-29 trillion). What should this signal?',
      answerType: 'mc', options: [
        'Nothing — this is a completely normal, expected result',
        'A likely compounding error somewhere in the assumption chain, since no single product category could plausibly exceed the ENTIRE economy\'s total output',
        'That the GDP figure itself must be wrong',
        'That the candidate should simply report the number without further checking'
      ], correctAnswer: 'A likely compounding error somewhere in the assumption chain, since no single product category could plausibly exceed the ENTIRE economy\'s total output',
      hint: 'Compare the scale of a single product category to the scale of the entire national economy.',
      approach: 'GDP represents the total output of the entire economy — a sanity-check ceiling for any single product category estimate.',
      solution: 'GDP represents the total output of the entire economy, so any single product category estimate exceeding it is a clear, usable sanity-check failure pointing to an error in the assumption chain.',
      recognitionTechnique: 'Other', commonTrap: 'Reporting an implausibly large estimate with confidence instead of sanity-checking it against a known, larger reference point like GDP.',
      tags: ['industry-knowledge', 'sizing-facts', 'sanity-check']
    }
  );

  items.forEach((q) => { q.track = 'consulting'; });
  global.QTL_BANK.addMany(items);
})(window);
