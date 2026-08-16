/* QUANT TEST LAB — CONSULTING TRACK generators.
   Two parts: (1) thin wrappers that make the existing quant-track McKinsey-
   style generators (Data Interpretation / Constraint Optimisation /
   Structured Decisions, defined in gen-applied.js) ALSO available under the
   consulting track, by reusing their exact build() functions under new ids
   — no prose is duplicated, and the original quant-tagged entries are left
   completely untouched. (2) New original generators: market sizing,
   profitability trees, and market-share-shift exhibit reading. All use
   generic, original structured-problem-solving logic — no reproduction of
   any named consultancy's proprietary framework. track:'consulting'
   throughout. Must load after gen-applied.js. */
(function (global) {
  'use strict';
  const U = global.QTL_UTIL;
  const { round } = U;
  const G = [];
  const add = (g) => { g.track = 'consulting'; G.push(g); };

  /* ---- (1) reuse the existing McKinsey-style generators under this track ---- */
  const REUSE_IDS = ['k_table_share', 'k_table_margin', 'k_growth_table', 'k_weighted_exhibit', 'k_knapsack', 'k_feasible', 'k_priority'];
  (global.QTL_GEN_APPLIED || []).forEach((gen) => {
    if (!REUSE_IDS.includes(gen.id)) return;
    add({
      id: 'con_' + gen.id, topic: gen.topic, subtopic: gen.subtopic,
      difficulty: gen.difficulty, targetTime: gen.targetTime, build: gen.build
    });
  });

  /* ---------------------------- MARKET SIZING ---------------------------- */

  add({
    id: 'con_size_bottom_up', topic: 'Market Sizing', subtopic: 'Bottom-up estimation', difficulty: 3, targetTime: 120,
    build(r) {
      const population = r.pick([2, 4, 6, 8, 10]) * 1000000;
      const ownRate = r.pick([0.3, 0.4, 0.5, 0.6]);
      const freqPerYear = r.pick([4, 6, 8, 12]);
      const pricePerUse = r.pick([15, 20, 25, 30]);
      const owners = Math.round(population * ownRate);
      const totalUses = owners * freqPerYear;
      const marketSize = totalUses * pricePerUse;
      return {
        prompt: `A city has a population of ${(population / 1000000).toFixed(0)} million. ${round(ownRate * 100, 0)}% of the population owns a car. Each car owner uses a car wash service ${freqPerYear} times per year, at an average price of $${pricePerUse} per wash. What is the annual market size for car washes in this city, in dollars?`,
        answerType: 'numeric', correctAnswer: marketSize, tolerance: marketSize * 0.02,
        hint: 'Build the chain one link at a time: population → owners → total uses per year → total dollars.',
        approach: 'Bottom-up market sizing: multiply a chain of estimation inputs (population × penetration × frequency × price) to reach a total.',
        solution: `Owners = ${(population / 1000000).toFixed(0)}m × ${round(ownRate * 100, 0)}% = ${owners.toLocaleString()}. Total washes/year = ${owners.toLocaleString()} × ${freqPerYear} = ${totalUses.toLocaleString()}. Market size = ${totalUses.toLocaleString()} × $${pricePerUse} = $${marketSize.toLocaleString()}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Applying the ownership rate to the wrong base, or forgetting one link in the multiplication chain (e.g. using population instead of owners for the frequency step).',
        tags: ['market-sizing', 'bottom-up']
      };
    }
  });

  add({
    id: 'con_size_top_down', topic: 'Market Sizing', subtopic: 'Top-down estimation', difficulty: 3, targetTime: 120,
    build(r) {
      const totalIndustry = r.pick([8, 10, 12, 15, 20]) * 1000000000;
      const segmentShare = r.pick([0.15, 0.2, 0.25, 0.3]);
      const targetableShare = r.pick([0.4, 0.5, 0.6]);
      const segmentSize = totalIndustry * segmentShare;
      const targetable = segmentSize * targetableShare;
      return {
        prompt: `The total national industry is worth $${(totalIndustry / 1000000000).toFixed(0)}bn. This company's specific segment represents ${round(segmentShare * 100, 0)}% of that total. Within that segment, ${round(targetableShare * 100, 0)}% is realistically addressable given the company's current distribution reach. What is the addressable market size, in dollars?`,
        answerType: 'numeric', correctAnswer: targetable, tolerance: targetable * 0.02,
        hint: 'Narrow the total step by step: total industry → this segment → the realistically addressable slice of it.',
        approach: 'Top-down market sizing: start from a known total and progressively apply narrowing percentages.',
        solution: `Segment size = $${(totalIndustry / 1000000000).toFixed(0)}bn × ${round(segmentShare * 100, 0)}% = $${(segmentSize / 1000000000).toFixed(2)}bn. Addressable = $${(segmentSize / 1000000000).toFixed(2)}bn × ${round(targetableShare * 100, 0)}% = $${(targetable / 1000000000).toFixed(3)}bn, i.e. exactly $${targetable.toLocaleString()}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Applying both percentages to the ORIGINAL total independently (i.e. adding them) instead of narrowing sequentially, step by step.',
        tags: ['market-sizing', 'top-down']
      };
    }
  });

  /* ------------------------- PROFITABILITY TREES ------------------------- */

  add({
    id: 'con_profit_tree', topic: 'Profitability Trees', subtopic: 'Profit decomposition', difficulty: 2, targetTime: 90,
    build(r) {
      const volume = r.pick([2000, 3000, 5000, 8000]);
      const price = r.pick([25, 40, 60, 80]);
      const varCost = Math.round(price * r.pick([0.4, 0.5, 0.6]));
      const fixedCost = r.pick([20000, 40000, 60000, 80000]);
      const revenue = volume * price;
      const totalVarCost = volume * varCost;
      const profit = revenue - totalVarCost - fixedCost;
      return {
        prompt: `A product sells ${volume.toLocaleString()} units per year at $${price} each. Variable cost is $${varCost} per unit, and fixed costs are $${fixedCost.toLocaleString()} per year. What is annual profit, in dollars?`,
        answerType: 'numeric', correctAnswer: profit, tolerance: Math.max(5, Math.abs(profit) * 0.01),
        hint: 'Build the tree: Revenue = volume × price. Total variable cost = volume × unit variable cost. Profit = Revenue − total variable cost − fixed costs.',
        approach: 'Profitability tree: Profit = Revenue − Variable Costs − Fixed Costs, with Revenue = Volume × Price and Variable Costs = Volume × unit variable cost.',
        solution: `Revenue = ${volume.toLocaleString()}×$${price} = $${revenue.toLocaleString()}. Variable costs = ${volume.toLocaleString()}×$${varCost} = $${totalVarCost.toLocaleString()}. Profit = ${revenue.toLocaleString()} − ${totalVarCost.toLocaleString()} − ${fixedCost.toLocaleString()} = $${profit.toLocaleString()}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Subtracting the per-unit variable cost from price and forgetting to also subtract the separate, volume-independent fixed cost.',
        tags: ['profitability-tree']
      };
    }
  });

  add({
    id: 'con_breakeven', topic: 'Profitability Trees', subtopic: 'Break-even analysis', difficulty: 3, targetTime: 90,
    build(r) {
      const price = r.pick([20, 30, 50, 75]);
      const varCost = Math.round(price * r.pick([0.3, 0.4, 0.5, 0.6]));
      const fixedCost = r.pick([30000, 45000, 60000, 90000]);
      const contribution = price - varCost;
      const breakeven = Math.ceil(fixedCost / contribution);
      return {
        prompt: `A product sells for $${price} with a variable cost of $${varCost} per unit. Fixed costs are $${fixedCost.toLocaleString()} per year. What is the break-even volume, in units (the minimum whole number of units needed to at least cover all costs)?`,
        answerType: 'numeric', correctAnswer: breakeven, tolerance: 0,
        hint: 'Each unit sold contributes (price − variable cost) toward covering the fixed cost — find how many contributions are needed to cover it.',
        approach: 'Break-even volume = fixed costs / contribution margin per unit, rounded up to the next whole unit.',
        solution: `Contribution margin per unit = $${price} − $${varCost} = $${contribution}. Break-even volume = $${fixedCost.toLocaleString()} / $${contribution} = ${round(fixedCost / contribution, 2)}, rounded up to ${breakeven} units (a fractional unit cannot actually be sold).`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Dividing fixed costs by the full price instead of by the contribution margin (price minus variable cost).',
        tags: ['profitability-tree', 'break-even']
      };
    }
  });

  /* --------------------------- EXHIBIT READING --------------------------- */

  add({
    id: 'con_share_shift', topic: 'Data Interpretation', subtopic: 'Market share shifts', difficulty: 3, targetTime: 100,
    build(r) {
      const names = ['Acme', 'Borealis', 'Cordia', 'Delta Co'];
      let shares1 = names.map(() => r.int(10, 40));
      const t1 = shares1.reduce((a, b) => a + b, 0);
      shares1 = shares1.map((s) => round(100 * s / t1, 1));
      let shares2 = names.map(() => r.int(10, 40));
      const t2 = shares2.reduce((a, b) => a + b, 0);
      shares2 = shares2.map((s) => round(100 * s / t2, 1));
      const deltas = names.map((_, j) => round(shares2[j] - shares1[j], 1));
      let best = 0; deltas.forEach((d, j) => { if (d > deltas[best]) best = j; });
      const rows = names.map((n, j) => `<tr><td>${n}</td><td>${shares1[j]}%</td><td>${shares2[j]}%</td></tr>`).join('');
      return {
        prompt: `<p>Market share by competitor, this year vs last year:</p>
        <table class="qtable"><thead><tr><th>Competitor</th><th>Last year</th><th>This year</th></tr></thead><tbody>${rows}</tbody></table>
        <p>Which competitor GAINED the most market share (in percentage POINTS, not percentage change)?</p>`,
        answerType: 'mc', options: names.slice(), correctAnswer: names[best],
        hint: 'Subtract last year\'s share from this year\'s share for each competitor — do not compute a percentage change of the share itself.',
        approach: 'Percentage-point change = this year\'s share − last year\'s share, computed separately for each competitor.',
        solution: names.map((n, j) => `${n}: ${shares2[j]}%−${shares1[j]}% = ${deltas[j] >= 0 ? '+' : ''}${deltas[j]}pp`).join('; ') + `. Largest gain: ${names[best]}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Computing the PERCENTAGE CHANGE in share (e.g. share this year ÷ share last year) instead of the simple percentage-POINT difference — these are different measures.',
        tags: ['exhibit', 'market-share']
      };
    }
  });

  global.QTL_GEN_CONSULTING = G;
})(window);
