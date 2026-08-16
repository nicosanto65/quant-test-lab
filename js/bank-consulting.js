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

  items.forEach((q) => { q.track = 'consulting'; });
  global.QTL_BANK.addMany(items);
})(window);
