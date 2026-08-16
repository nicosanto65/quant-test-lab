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

  items.forEach((q) => { q.track = 'consulting'; });
  global.QTL_BANK.addMany(items);
})(window);
