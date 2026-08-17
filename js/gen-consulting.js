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

  /* ------------------- MARKET SIZING (additional variants) ------------------- */

  add({
    id: 'con_size_household_penetration', topic: 'Market Sizing', subtopic: 'Household penetration', difficulty: 3, targetTime: 120,
    build(r) {
      const populationM = r.pick([1, 2, 3, 5]);
      const population = populationM * 1000000;
      const avgHH = r.pick([2.5, 3, 3.5]);
      const households = Math.round(population / avgHH);
      const penetration = r.pick([0.4, 0.5, 0.6, 0.7]);
      const owners = Math.round(households * penetration);
      const annualSpend = r.pick([40, 60, 80, 100]);
      const market = owners * annualSpend;
      return {
        prompt: `A metro area has a population of ${populationM} million people, with an average household size of ${avgHH} people. ${round(penetration * 100, 0)}% of households own a dishwasher, and each dishwasher-owning household spends $${annualSpend} per year on detergent and maintenance. What is the total annual market size for dishwasher detergent/maintenance in this metro area, in dollars?`,
        answerType: 'numeric', correctAnswer: market, tolerance: Math.max(1000, market * 0.02),
        hint: 'Convert population to households first, then apply the ownership rate, then multiply by annual spend per owning household.',
        approach: 'Bottom-up chain: population → households (population / household size) → owning households (× penetration rate) → dollars (× annual spend).',
        solution: `Households = ${population.toLocaleString()} / ${avgHH} = ${households.toLocaleString()}. Owning households = ${households.toLocaleString()} × ${round(penetration * 100, 0)}% = ${owners.toLocaleString()}. Market = ${owners.toLocaleString()} × $${annualSpend} = $${market.toLocaleString()}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Applying the ownership rate to the raw POPULATION figure instead of to the household count, effectively skipping the population-to-households conversion step.',
        tags: ['market-sizing', 'bottom-up']
      };
    }
  });

  add({
    id: 'con_size_b2b_seats', topic: 'Market Sizing', subtopic: 'B2B seat-based sizing', difficulty: 3, targetTime: 120,
    build(r) {
      const numBusinesses = r.pick([5000, 8000, 12000, 20000]);
      const avgEmployees = r.pick([20, 35, 50, 75]);
      const adoptionRate = r.pick([0.1, 0.15, 0.2, 0.25]);
      const pricePerSeat = r.pick([50, 80, 120, 150]);
      const adoptingBusinesses = Math.round(numBusinesses * adoptionRate);
      const totalSeats = adoptingBusinesses * avgEmployees;
      const market = totalSeats * pricePerSeat;
      return {
        prompt: `A region has ${numBusinesses.toLocaleString()} target businesses, averaging ${avgEmployees} employees each. A new B2B software product expects ${round(adoptionRate * 100, 0)}% of these businesses to adopt it, with every employee at an adopting business becoming a paid "seat" at $${pricePerSeat}/year. What is the annual addressable market size, in dollars?`,
        answerType: 'numeric', correctAnswer: market, tolerance: Math.max(1000, market * 0.02),
        hint: 'Build the chain: businesses → adopting businesses → total seats (adopting businesses × employees each) → dollars.',
        approach: 'Bottom-up B2B sizing: number of adopting businesses × seats per business × price per seat.',
        solution: `Adopting businesses = ${numBusinesses.toLocaleString()} × ${round(adoptionRate * 100, 0)}% = ${adoptingBusinesses.toLocaleString()}. Total seats = ${adoptingBusinesses.toLocaleString()} × ${avgEmployees} = ${totalSeats.toLocaleString()}. Market = ${totalSeats.toLocaleString()} × $${pricePerSeat} = $${market.toLocaleString()}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Applying the adoption rate AFTER multiplying by employees (i.e. treating the adoption rate as a per-seat probability) instead of applying it at the business level first, then multiplying by seats per adopting business.',
        tags: ['market-sizing', 'b2b']
      };
    }
  });

  add({
    id: 'con_size_frequency_chain', topic: 'Market Sizing', subtopic: 'Day-to-year annualization', difficulty: 2, targetTime: 100,
    build(r) {
      const dailyCustomers = r.pick([200, 300, 500, 800]);
      const avgSpend = r.pick([8, 10, 12, 15]);
      const daysOpen = r.pick([300, 330, 350, 365]);
      const dailyRevenue = dailyCustomers * avgSpend;
      const annualRevenue = dailyRevenue * daysOpen;
      return {
        prompt: `A restaurant chain location serves ${dailyCustomers} customers per day, each spending an average of $${avgSpend}, and is open ${daysOpen} days per year. What is the location's annual revenue, in dollars?`,
        answerType: 'numeric', correctAnswer: annualRevenue, tolerance: Math.max(500, annualRevenue * 0.01),
        hint: 'Find daily revenue first, then annualize using the ACTUAL number of days open per year, not a default 365.',
        approach: 'Daily revenue (customers × average spend) × the specific number of days open per year given in the prompt.',
        solution: `Daily revenue = ${dailyCustomers} × $${avgSpend} = $${dailyRevenue.toLocaleString()}. Annual revenue = $${dailyRevenue.toLocaleString()} × ${daysOpen} days = $${annualRevenue.toLocaleString()}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Defaulting to 365 days/year instead of using the specific "days open" figure given in the prompt (many businesses are closed some days per year).',
        tags: ['market-sizing', 'annualization']
      };
    }
  });

  add({
    id: 'con_size_top_down_narrow', topic: 'Market Sizing', subtopic: 'Top-down estimation', difficulty: 3, targetTime: 120,
    build(r) {
      const totalNationalB = r.pick([50, 80, 120, 150]);
      const totalNational = totalNationalB * 1000000000;
      const categoryShare = r.pick([0.05, 0.08, 0.1, 0.12]);
      const cityShare = r.pick([0.01, 0.02, 0.03]);
      const categorySpend = totalNational * categoryShare;
      const citySpend = Math.round(categorySpend * cityShare);
      return {
        prompt: `National annual spending on a product category is $${totalNationalB}bn. This specific product line represents ${round(categoryShare * 100, 0)}% of that category. A target city accounts for ${round(cityShare * 100, 0)}% of national population, used as a proxy for its share of spending. What is the estimated annual spend on this product line in that city, in dollars?`,
        answerType: 'numeric', correctAnswer: citySpend, tolerance: Math.max(10000, citySpend * 0.02),
        hint: 'Narrow in two steps: national total → this product line\'s share of the category → this city\'s share of that.',
        approach: 'Top-down, two-step narrowing: total × category share × city share.',
        solution: `Category spend = $${totalNationalB}bn × ${round(categoryShare * 100, 0)}% = $${(categorySpend / 1000000000).toFixed(2)}bn. City spend = $${(categorySpend / 1000000000).toFixed(2)}bn × ${round(cityShare * 100, 0)}% = $${citySpend.toLocaleString()}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Applying the city population share directly to the NATIONAL total instead of to the already-narrowed category spend, skipping the intermediate step.',
        tags: ['market-sizing', 'top-down']
      };
    }
  });

  add({
    id: 'con_size_kmb_notation', topic: 'Market Sizing', subtopic: 'K/M/B notation', difficulty: 1, targetTime: 45,
    build(r) {
      const units = [{ suffix: 'K', mult: 1000 }, { suffix: 'M', mult: 1000000 }, { suffix: 'B', mult: 1000000000 }];
      const idx = r.int(0, 2);
      const unit = units[idx];
      const val = r.pick([1.2, 2.4, 3.6, 4.8, 5.5, 6.3, 7.7, 8.9]);
      const raw = Math.round(val * unit.mult);
      const correct = `$${val}${unit.suffix}`;
      const options = [correct];
      const smaller = units[Math.max(0, idx - 1)];
      const larger = units[Math.min(2, idx + 1)];
      if (smaller.suffix !== unit.suffix) options.push(`$${val}${smaller.suffix}`);
      if (larger.suffix !== unit.suffix) options.push(`$${val}${larger.suffix}`);
      options.push(`$${round(val * 10, 1)}${unit.suffix}`);
      while (options.length < 4) options.push(`$${round(val / 10, 2)}${unit.suffix}`);
      return {
        prompt: `A market-sizing chain produces a raw total of $${raw.toLocaleString()}. Expressed in standard K/M/B shorthand, this is approximately:`,
        answerType: 'mc', options: r.shuffle(options.slice(0, 4)), correctAnswer: correct,
        hint: 'Count the zeros: three zeros is thousands (K), six is millions (M), nine is billions (B).',
        approach: 'K/M/B notation: divide the raw figure by 1,000 (K), 1,000,000 (M), or 1,000,000,000 (B) depending on its actual magnitude.',
        solution: `$${raw.toLocaleString()} has ${unit.suffix === 'K' ? 'three' : unit.suffix === 'M' ? 'six' : 'nine'} trailing zeros beyond the leading digits, so it is correctly expressed as ${correct} (dividing by ${unit.mult.toLocaleString()}).`,
        recognitionTechnique: 'Other', commonTrap: 'Miscounting the zeros and shifting the decimal by the wrong number of places, landing one order of magnitude too high or too low (e.g. reporting millions as billions).',
        tags: ['market-sizing', 'notation']
      };
    }
  });

  add({
    id: 'con_size_replacement_cycle', topic: 'Market Sizing', subtopic: 'Installed-base replacement demand', difficulty: 3, targetTime: 120,
    build(r) {
      const installedBaseM = r.pick([2, 4, 6, 8]);
      const installedBase = installedBaseM * 1000000;
      const cycleYears = r.pick([8, 10, 12, 15]);
      const avgPrice = r.pick([400, 600, 800, 1000]);
      const annualUnits = Math.round(installedBase / cycleYears);
      const market = annualUnits * avgPrice;
      return {
        prompt: `A country has ${installedBaseM} million water heaters currently installed. Each water heater is replaced, on average, once every ${cycleYears} years, at an average replacement price of $${avgPrice}. What is the annual replacement-demand market size, in dollars?`,
        answerType: 'numeric', correctAnswer: market, tolerance: Math.max(10000, market * 0.02),
        hint: 'If every unit is replaced once every N years, then 1/N of the installed base is replaced each year, on average.',
        approach: 'Annual replacement units = installed base / average replacement cycle (years); market size = annual replacement units × average price.',
        solution: `Annual replacement units = ${installedBase.toLocaleString()} / ${cycleYears} = ${annualUnits.toLocaleString()}. Market = ${annualUnits.toLocaleString()} × $${avgPrice} = $${market.toLocaleString()}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Multiplying the installed base by the replacement cycle length instead of DIVIDING by it — a longer replacement cycle means FEWER units replaced per year, not more.',
        tags: ['market-sizing', 'replacement-demand']
      };
    }
  });

  /* ----------------------- BREAK-EVEN (additional variants) ----------------------- */

  add({
    id: 'con_breakeven_price', topic: 'Profitability Trees', subtopic: 'Break-even: solving for price', difficulty: 3, targetTime: 100,
    build(r) {
      const targetVolume = r.pick([1000, 1500, 2000, 3000]);
      const varCost = r.pick([15, 20, 25, 30]);
      const k = r.pick([5, 10, 15, 20, 25]);
      const fixedCost = targetVolume * k;
      const minPrice = varCost + k;
      return {
        prompt: `A company plans to sell exactly ${targetVolume.toLocaleString()} units this year, at a variable cost of $${varCost} per unit, with fixed costs of $${fixedCost.toLocaleString()} per year. What is the minimum price per unit needed to break even at this volume?`,
        answerType: 'numeric', correctAnswer: minPrice, tolerance: 0,
        hint: 'Break-even requires total contribution (volume × (price − variable cost)) to at least cover fixed costs — solve for price.',
        approach: 'Minimum price = variable cost + (fixed costs / target volume), i.e. the variable cost plus the contribution-per-unit needed to cover fixed costs at exactly this volume.',
        solution: `Required contribution per unit = $${fixedCost.toLocaleString()} / ${targetVolume.toLocaleString()} = $${k}. Minimum price = $${varCost} + $${k} = $${minPrice}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Solving for price using the standard break-even VOLUME formula (fixed costs / contribution) without rearranging it to isolate price instead.',
        tags: ['profitability-tree', 'break-even']
      };
    }
  });

  add({
    id: 'con_breakeven_time', topic: 'Profitability Trees', subtopic: 'Break-even: solving for time', difficulty: 3, targetTime: 110,
    build(r) {
      const investment = r.pick([60000, 90000, 120000, 150000]);
      const monthlyVolume = r.pick([200, 300, 400, 500]);
      const contributionPerUnit = r.pick([10, 15, 20, 25]);
      const monthlyContribution = monthlyVolume * contributionPerUnit;
      const monthsExact = investment / monthlyContribution;
      const months = Math.ceil(monthsExact);
      return {
        prompt: `A new product line requires an upfront investment of $${investment.toLocaleString()}. It sells ${monthlyVolume} units per month, each contributing $${contributionPerUnit} toward covering the investment. How many whole months will it take to break even on the upfront investment?`,
        answerType: 'numeric', correctAnswer: months, tolerance: 0,
        hint: 'Find monthly contribution first (units per month × contribution per unit), then divide the investment by that monthly figure.',
        approach: 'Months to break even = upfront investment / monthly contribution (units × contribution per unit), rounded up to the next whole month.',
        solution: `Monthly contribution = ${monthlyVolume} × $${contributionPerUnit} = $${monthlyContribution.toLocaleString()}. Months to break even = $${investment.toLocaleString()} / $${monthlyContribution.toLocaleString()} = ${round(monthsExact, 2)}, rounded up to ${months} months (a fractional month does not fully recover the investment).`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Rounding DOWN instead of up — a fractional month means the investment has not yet been fully recovered by the end of that month.',
        tags: ['profitability-tree', 'break-even']
      };
    }
  });

  add({
    id: 'con_breakeven_marketshare', topic: 'Profitability Trees', subtopic: 'Break-even: solving for market share', difficulty: 4, targetTime: 130,
    build(r) {
      const price = r.pick([30, 40, 50]);
      const varCost = Math.round(price * r.pick([0.4, 0.5, 0.6]));
      const fixedCost = r.pick([100000, 150000, 200000]);
      const contribution = price - varCost;
      const breakevenUnits = Math.ceil(fixedCost / contribution);
      const totalMarketUnits = r.pick([400000, 600000, 800000, 1000000]);
      const requiredSharePct = round((breakevenUnits / totalMarketUnits) * 100, 2);
      return {
        prompt: `A product sells for $${price} with a variable cost of $${varCost} per unit, and fixed costs of $${fixedCost.toLocaleString()} per year. The total addressable market is ${totalMarketUnits.toLocaleString()} units per year. What MARKET SHARE (in percent, to two decimal places) does the company need to capture in order to break even?`,
        answerType: 'numeric', correctAnswer: requiredSharePct, tolerance: 0.02,
        hint: 'First find the break-even volume in units, then express that as a percentage of the total addressable market.',
        approach: 'Required market share = break-even units (fixed costs / contribution per unit) / total addressable market units, expressed as a percentage.',
        solution: `Contribution per unit = $${price} − $${varCost} = $${contribution}. Break-even units = $${fixedCost.toLocaleString()} / $${contribution} = ${breakevenUnits.toLocaleString()}. Required share = ${breakevenUnits.toLocaleString()} / ${totalMarketUnits.toLocaleString()} = ${requiredSharePct}%.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Stopping at the break-even UNIT figure and forgetting the final step of dividing by total market size to express it as a share.',
        tags: ['profitability-tree', 'break-even', 'market-share']
      };
    }
  });

  add({
    id: 'con_breakeven_max_investment', topic: 'Profitability Trees', subtopic: 'Break-even: solving for maximum affordable investment', difficulty: 3, targetTime: 100,
    build(r) {
      const volume = r.pick([2000, 3000, 4000, 5000]);
      const price = r.pick([25, 35, 45]);
      const varCost = Math.round(price * r.pick([0.4, 0.5, 0.6]));
      const contribution = price - varCost;
      const maxInvestment = volume * contribution;
      return {
        prompt: `A company expects to sell ${volume.toLocaleString()} units per year of a new product at $${price} each, with a variable cost of $${varCost} per unit. What is the MAXIMUM amount of annual fixed cost (e.g. from a new piece of equipment) the company could take on while still breaking even at this volume?`,
        answerType: 'numeric', correctAnswer: maxInvestment, tolerance: 0,
        hint: 'The maximum affordable fixed cost is exactly the total contribution generated at this volume — any more, and the company would no longer break even.',
        approach: 'Maximum affordable fixed cost = volume × contribution per unit (price − variable cost) — the total contribution available to cover fixed costs before turning a loss.',
        solution: `Contribution per unit = $${price} − $${varCost} = $${contribution}. Maximum fixed cost = ${volume.toLocaleString()} × $${contribution} = $${maxInvestment.toLocaleString()}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Using price instead of contribution margin (price minus variable cost) to compute the maximum affordable fixed cost, overstating the true break-even ceiling.',
        tags: ['profitability-tree', 'break-even']
      };
    }
  });

  add({
    id: 'con_breakeven_target_profit', topic: 'Profitability Trees', subtopic: 'Break-even: solving for a target profit', difficulty: 3, targetTime: 110,
    build(r) {
      const price = r.pick([20, 30, 50]);
      const varCost = Math.round(price * r.pick([0.4, 0.5, 0.6]));
      const fixedCost = r.pick([30000, 50000, 70000]);
      const targetProfit = r.pick([10000, 20000, 30000]);
      const contribution = price - varCost;
      const volumeNeeded = Math.ceil((fixedCost + targetProfit) / contribution);
      return {
        prompt: `A product sells for $${price} with a variable cost of $${varCost} per unit, and fixed costs of $${fixedCost.toLocaleString()} per year. How many units must be sold to achieve a target PROFIT of $${targetProfit.toLocaleString()} (not merely to break even)?`,
        answerType: 'numeric', correctAnswer: volumeNeeded, tolerance: 0,
        hint: 'Treat the target profit as an ADDITIONAL amount the contribution margin must cover, on top of the fixed costs.',
        approach: 'Volume needed = (fixed costs + target profit) / contribution margin per unit — extending the standard break-even formula by adding the target profit to what must be covered.',
        solution: `Contribution per unit = $${price} − $${varCost} = $${contribution}. Volume needed = ($${fixedCost.toLocaleString()} + $${targetProfit.toLocaleString()}) / $${contribution} = ${round((fixedCost + targetProfit) / contribution, 2)}, rounded up to ${volumeNeeded} units.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Computing only the standard break-even volume (ignoring the target profit entirely) instead of adding the target profit to fixed costs before dividing.',
        tags: ['profitability-tree', 'break-even', 'target-profit']
      };
    }
  });

  /* ------------------- PROFITABILITY ANALYSIS: YoY price/volume/mix ------------------- */

  add({
    id: 'con_profitability_price_effect', topic: 'Profitability Trees', subtopic: 'YoY price effect', difficulty: 3, targetTime: 110,
    build(r) {
      const priceOld = r.pick([20, 30, 40, 50]);
      const priceNew = priceOld + r.pick([-5, -3, 3, 5, 8]);
      const volumeOld = r.pick([1000, 2000, 3000, 4000]);
      const volumeNew = volumeOld + r.pick([-300, -150, 150, 300, 500]);
      const priceEffect = (priceNew - priceOld) * volumeOld;
      return {
        prompt: `Last year, a product sold ${volumeOld.toLocaleString()} units at $${priceOld} each. This year, it sold ${volumeNew.toLocaleString()} units at $${priceNew} each. Using last year's volume as the base (holding volume constant), what is the PRICE EFFECT on revenue — the portion of the revenue change attributable specifically to the price change?`,
        answerType: 'numeric', correctAnswer: priceEffect, tolerance: 0,
        hint: 'Isolate price by asking: if only price had changed (volume stayed at last year\'s level), how much would revenue have changed?',
        approach: 'Price effect = (this year\'s price − last year\'s price) × last year\'s volume, holding volume at its old-year base to isolate the price-driven portion of the revenue change.',
        solution: `Price effect = ($${priceNew} − $${priceOld}) × ${volumeOld.toLocaleString()} = $${priceEffect.toLocaleString()}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Using the NEW year\'s volume instead of the OLD year\'s volume as the base when isolating the price effect, which mixes the price effect with part of the volume effect.',
        tags: ['profitability-analysis', 'yoy-decomposition', 'price-effect']
      };
    }
  });

  add({
    id: 'con_profitability_volume_effect', topic: 'Profitability Trees', subtopic: 'YoY volume effect', difficulty: 3, targetTime: 110,
    build(r) {
      const priceOld = r.pick([20, 30, 40, 50]);
      const priceNew = priceOld + r.pick([-5, -3, 3, 5, 8]);
      const volumeOld = r.pick([1000, 2000, 3000, 4000]);
      const volumeNew = volumeOld + r.pick([-300, -150, 150, 300, 500]);
      const volumeEffect = (volumeNew - volumeOld) * priceOld;
      return {
        prompt: `Last year, a product sold ${volumeOld.toLocaleString()} units at $${priceOld} each. This year, it sold ${volumeNew.toLocaleString()} units at $${priceNew} each. Using last year's price as the base (holding price constant), what is the VOLUME EFFECT on revenue — the portion of the revenue change attributable specifically to the volume change?`,
        answerType: 'numeric', correctAnswer: volumeEffect, tolerance: 0,
        hint: 'Isolate volume by asking: if only volume had changed (price stayed at last year\'s level), how much would revenue have changed?',
        approach: 'Volume effect = (this year\'s volume − last year\'s volume) × last year\'s price, holding price at its old-year base to isolate the volume-driven portion of the revenue change.',
        solution: `Volume effect = (${volumeNew.toLocaleString()} − ${volumeOld.toLocaleString()}) × $${priceOld} = $${volumeEffect.toLocaleString()}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Using the NEW year\'s price instead of the OLD year\'s price as the base when isolating the volume effect, which mixes the volume effect with part of the price effect.',
        tags: ['profitability-analysis', 'yoy-decomposition', 'volume-effect']
      };
    }
  });

  add({
    id: 'con_profitability_mix_effect', topic: 'Profitability Trees', subtopic: 'YoY mix effect', difficulty: 4, targetTime: 130,
    build(r) {
      const marginA = r.pick([20, 25, 30]);
      const marginB = r.pick([50, 55, 60]);
      const shareA_old = r.pick([0.3, 0.4, 0.5, 0.6]);
      const shareB_old = round(1 - shareA_old, 2);
      const shareA_new = round(shareA_old + r.pick([-0.15, -0.1, 0.1, 0.15]), 2);
      const shareB_new = round(1 - shareA_new, 2);
      const blendedOld = round(shareA_old * marginA + shareB_old * marginB, 2);
      const blendedNew = round(shareA_new * marginA + shareB_new * marginB, 2);
      const mixEffect = round(blendedNew - blendedOld, 2);
      return {
        prompt: `A company sells two products: Product A (${marginA}% margin) and Product B (${marginB}% margin) — both margins UNCHANGED year over year. Last year's sales mix was ${round(shareA_old * 100, 0)}% Product A / ${round(shareB_old * 100, 0)}% Product B. This year's mix shifted to ${round(shareA_new * 100, 0)}% Product A / ${round(shareB_new * 100, 0)}% Product B. What is the MIX EFFECT on the company's blended margin, in percentage points (this year's blended margin minus last year's, given both products' own margins stayed constant)?`,
        answerType: 'numeric', correctAnswer: mixEffect, tolerance: 0.05,
        hint: 'Compute the blended (weighted-average) margin in each year separately, then take the difference — the individual product margins never changed, only the weights.',
        approach: 'Blended margin = (share of A × margin of A) + (share of B × margin of B), computed separately for each year; mix effect = new blended margin − old blended margin.',
        solution: `Last year\'s blended margin = ${round(shareA_old * 100, 0)}%×${marginA}% + ${round(shareB_old * 100, 0)}%×${marginB}% = ${blendedOld}%. This year\'s blended margin = ${round(shareA_new * 100, 0)}%×${marginA}% + ${round(shareB_new * 100, 0)}%×${marginB}% = ${blendedNew}%. Mix effect = ${blendedNew}% − ${blendedOld}% = ${mixEffect}pp.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Assuming the blended margin can only change if the individual products\' own margins change, missing that a pure MIX shift toward the higher- or lower-margin product moves the blended average even with both margins held constant.',
        tags: ['profitability-analysis', 'yoy-decomposition', 'mix-effect']
      };
    }
  });

  /* ---------------------------- PRICE ELASTICITY ---------------------------- */

  add({
    id: 'con_elasticity_segment', topic: 'Price Elasticity', subtopic: 'Computing elasticity', difficulty: 3, targetTime: 100,
    build(r) {
      const priceChangePct = r.pick([5, 10, 15, 20, 25]);
      const qtyChangePct = -r.pick([5, 10, 15, 20, 25, 30, 35, 40]);
      const elasticity = round(qtyChangePct / priceChangePct, 2);
      return {
        prompt: `A retailer raises the price of a product by ${priceChangePct}%, and observes quantity sold fall by ${Math.abs(qtyChangePct)}%. What is the price elasticity of demand for this product (using %ΔQuantity / %ΔPrice, keeping the sign)?`,
        answerType: 'numeric', correctAnswer: elasticity, tolerance: 0.02,
        hint: 'Elasticity = (percent change in quantity) / (percent change in price) — keep the negative sign, since quantity fell while price rose.',
        approach: 'Price elasticity of demand = %ΔQuantity / %ΔPrice.',
        solution: `Elasticity = ${qtyChangePct}% / ${priceChangePct}% = ${elasticity}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Dropping the negative sign, or inverting the ratio (dividing the price change by the quantity change instead of the other way around).',
        tags: ['price-elasticity']
      };
    }
  });

  add({
    id: 'con_elasticity_optimal_price', topic: 'Price Elasticity', subtopic: 'Elasticity and revenue-maximizing pricing', difficulty: 3, targetTime: 90,
    build(r) {
      const scenarios = [
        { absE: 0.6, label: 'inelastic' }, { absE: 0.8, label: 'inelastic' },
        { absE: 1.3, label: 'elastic' }, { absE: 1.8, label: 'elastic' }, { absE: 2.5, label: 'elastic' }
      ];
      const s = r.pick(scenarios);
      const isInelastic = s.label === 'inelastic';
      const correct = isInelastic
        ? `Increase the price — with inelastic demand (|E| = ${s.absE} < 1), the percentage drop in quantity sold from a price increase is SMALLER than the percentage price increase, so total revenue rises`
        : `Decrease the price — with elastic demand (|E| = ${s.absE} > 1), the percentage rise in quantity sold from a price decrease MORE than offsets the smaller price per unit, so total revenue rises`;
      const options = [
        `Increase the price — with inelastic demand (|E| = ${s.absE} < 1), the percentage drop in quantity sold from a price increase is SMALLER than the percentage price increase, so total revenue rises`,
        `Decrease the price — with elastic demand (|E| = ${s.absE} > 1), the percentage rise in quantity sold from a price decrease MORE than offsets the smaller price per unit, so total revenue rises`,
        'Price changes never affect total revenue, regardless of elasticity',
        'Always increase the price, regardless of the elasticity value'
      ];
      return {
        prompt: `A segment's price elasticity of demand is measured at ${isInelastic ? '−' : '−'}${s.absE} (i.e. |E| = ${s.absE}, ${s.label}). To INCREASE total revenue from this segment, what should the company do?`,
        answerType: 'mc', options: r.shuffle(options.slice()), correctAnswer: correct,
        hint: `Recall the rule: for inelastic demand (|E|<1), raising price raises revenue; for elastic demand (|E|>1), lowering price raises revenue.`,
        approach: 'Revenue-maximizing pricing rule: with inelastic demand, a price increase raises revenue (quantity falls proportionally less); with elastic demand, a price decrease raises revenue (quantity rises proportionally more).',
        solution: `Since |E| = ${s.absE} is ${s.label}, the correct move is to ${isInelastic ? 'INCREASE' : 'DECREASE'} price: ${isInelastic ? 'demand is unresponsive enough that the price increase outweighs the small quantity drop' : 'demand is responsive enough that the price decrease is more than offset by the resulting rise in quantity sold'}.`,
        recognitionTechnique: 'Other', commonTrap: 'Applying the same pricing direction (always raise, or always lower) regardless of whether demand is measured as elastic or inelastic.',
        tags: ['price-elasticity', 'pricing-strategy']
      };
    }
  });

  /* ------------------------ CUSTOMER LIFETIME VALUE ------------------------ */

  add({
    id: 'con_clv_basic', topic: 'Customer Lifetime Value', subtopic: 'Computing CLV', difficulty: 2, targetTime: 90,
    build(r) {
      const annualMargin = r.pick([50, 80, 120, 150]);
      const lifespanYears = r.pick([3, 4, 5, 6, 8]);
      const clv = annualMargin * lifespanYears;
      return {
        prompt: `A subscription business earns $${annualMargin} in profit per customer per year, and the average customer remains subscribed for ${lifespanYears} years before churning. What is the customer lifetime value (CLV), in dollars?`,
        answerType: 'numeric', correctAnswer: clv, tolerance: 0,
        hint: 'CLV, in its simplest form, is annual profit per customer multiplied by the average number of years a customer stays.',
        approach: 'CLV = annual profit per customer × average customer lifespan (in years).',
        solution: `CLV = $${annualMargin} × ${lifespanYears} years = $${clv.toLocaleString()}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Using annual REVENUE per customer instead of annual PROFIT (margin) per customer — CLV should reflect the profit actually retained, not the top-line revenue.',
        tags: ['clv']
      };
    }
  });

  add({
    id: 'con_clv_cac_ratio', topic: 'Customer Lifetime Value', subtopic: 'LTV:CAC health check', difficulty: 3, targetTime: 90,
    build(r) {
      const pairs = [[900, 150], [600, 150], [450, 300], [300, 300], [900, 300], [750, 500], [400, 400], [1200, 200]];
      const [clv, cac] = r.pick(pairs);
      const ratio = round(clv / cac, 2);
      let label;
      if (ratio >= 3) label = `Healthy — the LTV:CAC ratio of ${ratio}:1 is at or comfortably above the standard 3:1 benchmark`;
      else if (ratio >= 1.5) label = `Borderline — the LTV:CAC ratio of ${ratio}:1 is positive but below the standard 3:1 benchmark, worth monitoring`;
      else label = `Concerning — the LTV:CAC ratio of ${ratio}:1 is well below the standard benchmark, meaning the company is spending too much to acquire customers relative to their value`;
      const options = [
        `Healthy — the LTV:CAC ratio of ${ratio}:1 is at or comfortably above the standard 3:1 benchmark`,
        `Borderline — the LTV:CAC ratio of ${ratio}:1 is positive but below the standard 3:1 benchmark, worth monitoring`,
        `Concerning — the LTV:CAC ratio of ${ratio}:1 is well below the standard benchmark, meaning the company is spending too much to acquire customers relative to their value`,
        'Impossible to classify without further data'
      ];
      return {
        prompt: `A company's customer lifetime value (LTV) is $${clv}, and its customer acquisition cost (CAC) is $${cac}. Using the standard "3:1 or better is healthy" LTV:CAC benchmark, how should this ratio be classified?`,
        answerType: 'mc', options: r.shuffle(options.slice()), correctAnswer: label,
        hint: 'Divide LTV by CAC to get the ratio, then compare it against the standard benchmark bands (≥3 healthy, 1.5-3 borderline, <1.5 concerning).',
        approach: 'LTV:CAC ratio = LTV / CAC, compared against standard benchmark bands used to assess whether acquisition spending is sustainable relative to customer value.',
        solution: `LTV:CAC ratio = $${clv} / $${cac} = ${ratio}:1, which falls into the "${ratio >= 3 ? 'healthy' : ratio >= 1.5 ? 'borderline' : 'concerning'}" band.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Inverting the ratio (CAC/LTV instead of LTV/CAC), which reverses which direction is considered "healthy."',
        tags: ['clv', 'cac']
      };
    }
  });

  /* ------------------------------ ROI & PAYBACK ------------------------------ */

  add({
    id: 'con_roi_basic', topic: 'ROI & Payback', subtopic: 'Basic ROI', difficulty: 2, targetTime: 80,
    build(r) {
      const investment = r.pick([50000, 80000, 100000, 150000]);
      const k = r.pick([0.1, 0.2, 0.25, 0.4, 0.5]);
      const netProfit = Math.round(investment * k);
      const roi = round((netProfit / investment) * 100, 1);
      return {
        prompt: `A company invests $${investment.toLocaleString()} in a new initiative, which generates a net profit of $${netProfit.toLocaleString()} over its first year. What is the return on investment (ROI), as a percentage?`,
        answerType: 'numeric', correctAnswer: roi, tolerance: 0.1,
        hint: 'ROI = net profit divided by the amount invested, expressed as a percentage.',
        approach: 'ROI (%) = (net profit / investment) × 100.',
        solution: `ROI = $${netProfit.toLocaleString()} / $${investment.toLocaleString()} × 100 = ${roi}%.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Dividing net profit by the TOTAL RETURN (investment + profit) instead of by the original investment amount.',
        tags: ['roi']
      };
    }
  });

  add({
    id: 'con_payback_simple', topic: 'ROI & Payback', subtopic: 'Simple payback period', difficulty: 2, targetTime: 80,
    build(r) {
      const investment = r.pick([80000, 120000, 150000, 200000]);
      const annualCashFlow = r.pick([20000, 30000, 40000, 50000]);
      const payback = round(investment / annualCashFlow, 2);
      return {
        prompt: `A project requires an upfront investment of $${investment.toLocaleString()} and generates $${annualCashFlow.toLocaleString()} in cash flow per year (assumed steady). What is the simple payback period, in years (to two decimal places)?`,
        answerType: 'numeric', correctAnswer: payback, tolerance: 0.02,
        hint: 'Simple payback period = how many years of steady cash flow it takes to recover the original investment.',
        approach: 'Simple payback period (years) = investment / annual cash flow.',
        solution: `Payback period = $${investment.toLocaleString()} / $${annualCashFlow.toLocaleString()} = ${payback} years.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Confusing payback period with ROI — payback measures TIME to recover the investment, not a percentage return.',
        tags: ['payback']
      };
    }
  });

  add({
    id: 'con_discounted_payback', topic: 'ROI & Payback', subtopic: 'Discounted payback period', difficulty: 4, targetTime: 150,
    build(r) {
      const investment = r.pick([100000, 150000, 200000]);
      const annualCashFlow = r.pick([40000, 50000, 60000]);
      const discountRate = r.pick([0.08, 0.1, 0.12]);
      let cum = 0, year = 0, disc = 0, paybackPeriod = 0;
      for (year = 1; year <= 15; year++) {
        disc = annualCashFlow / Math.pow(1 + discountRate, year);
        if (cum + disc >= investment) {
          const frac = (investment - cum) / disc;
          paybackPeriod = round(year - 1 + frac, 1);
          break;
        }
        cum += disc;
      }
      return {
        prompt: `A project requires an upfront investment of $${investment.toLocaleString()}, generates $${annualCashFlow.toLocaleString()} in cash flow per year, and the company discounts future cash flows at ${round(discountRate * 100, 0)}% per year. What is the DISCOUNTED payback period, in years (to one decimal place) — i.e. how long until the sum of the DISCOUNTED (present-value) cash flows recovers the investment?`,
        answerType: 'numeric', correctAnswer: paybackPeriod, tolerance: 0.2,
        hint: 'Discount each year\'s cash flow back to present value BEFORE accumulating it toward the investment, unlike simple payback which uses undiscounted cash flows.',
        approach: 'Discounted payback period: accumulate each year\'s cash flow divided by (1 + discount rate)^year until the cumulative discounted total reaches the investment; interpolate within the crossing year for a fractional answer.',
        solution: `Discounting the annual $${annualCashFlow.toLocaleString()} cash flow at ${round(discountRate * 100, 0)}% per year and accumulating, the cumulative discounted cash flow crosses $${investment.toLocaleString()} at approximately year ${paybackPeriod}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Computing the SIMPLE (undiscounted) payback period instead — discounted payback is always longer than simple payback, since future cash flows are worth less in present-value terms.',
        tags: ['payback', 'discounted-payback']
      };
    }
  });

  add({
    id: 'con_roi_multi_year', topic: 'ROI & Payback', subtopic: 'Multi-year cumulative ROI', difficulty: 3, targetTime: 110,
    build(r) {
      const investment = r.pick([100000, 150000, 200000]);
      const cf1 = r.pick([30000, 40000, 50000]);
      const cf2 = r.pick([30000, 40000, 50000]);
      const cf3 = r.pick([30000, 40000, 50000]);
      const totalCashFlow = cf1 + cf2 + cf3;
      const netProfit = totalCashFlow - investment;
      const roi = round((netProfit / investment) * 100, 1);
      return {
        prompt: `A project requires an upfront investment of $${investment.toLocaleString()}, and generates cash flows of $${cf1.toLocaleString()} in Year 1, $${cf2.toLocaleString()} in Year 2, and $${cf3.toLocaleString()} in Year 3. What is the cumulative 3-year ROI, as a percentage (using total 3-year cash flow minus the investment, divided by the investment)?`,
        answerType: 'numeric', correctAnswer: roi, tolerance: 0.2,
        hint: 'First sum all three years\' cash flows, then subtract the investment to get net profit, then divide by the investment.',
        approach: 'Cumulative ROI (%) = (sum of all cash flows − investment) / investment × 100.',
        solution: `Total cash flow = $${cf1.toLocaleString()} + $${cf2.toLocaleString()} + $${cf3.toLocaleString()} = $${totalCashFlow.toLocaleString()}. Net profit = $${totalCashFlow.toLocaleString()} − $${investment.toLocaleString()} = $${netProfit.toLocaleString()}. ROI = $${netProfit.toLocaleString()} / $${investment.toLocaleString()} × 100 = ${roi}%.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Dividing total cash flow (instead of NET profit, after subtracting the investment) by the investment amount, overstating the ROI.',
        tags: ['roi', 'multi-year']
      };
    }
  });

  add({
    id: 'con_roi_compare', topic: 'ROI & Payback', subtopic: 'Comparing two investment options', difficulty: 3, targetTime: 110,
    build(r) {
      const pairs = [
        [[100000, 25000], [150000, 30000]], [[80000, 20000], [120000, 40000]],
        [[200000, 40000], [90000, 20000]], [[150000, 50000], [100000, 20000]]
      ];
      const [[invA, cfA], [invB, cfB]] = r.pick(pairs);
      const paybackA = round(invA / cfA, 2);
      const paybackB = round(invB / cfB, 2);
      const correct = paybackA < paybackB ? 'Option A has the shorter payback period' : 'Option B has the shorter payback period';
      const options = ['Option A has the shorter payback period', 'Option B has the shorter payback period', 'Both options have identical payback periods', 'Cannot be determined from this information'];
      return {
        prompt: `Option A requires a $${invA.toLocaleString()} investment generating $${cfA.toLocaleString()}/year. Option B requires a $${invB.toLocaleString()} investment generating $${cfB.toLocaleString()}/year. Which option has the SHORTER payback period?`,
        answerType: 'mc', options: options.slice(), correctAnswer: correct,
        hint: 'Compute each option\'s payback period (investment / annual cash flow) separately before comparing.',
        approach: 'Payback period = investment / annual cash flow, computed independently for each option, then compared.',
        solution: `Option A payback = $${invA.toLocaleString()} / $${cfA.toLocaleString()} = ${paybackA} years. Option B payback = $${invB.toLocaleString()} / $${cfB.toLocaleString()} = ${paybackB} years. ${correct}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Comparing the two options by the SIZE of the investment or cash flow alone, rather than actually computing and comparing each option\'s payback period.',
        tags: ['roi', 'payback', 'comparison']
      };
    }
  });

  /* --------------------------------- OPERATIONS --------------------------------- */

  add({
    id: 'con_bottleneck_identify', topic: 'Operations', subtopic: 'Identifying the bottleneck', difficulty: 2, targetTime: 90,
    build(r) {
      const stageNames = ['Mixing', 'Baking', 'Cooling', 'Packaging'];
      const caps = r.shuffle([r.int(70, 90), r.int(95, 115), r.int(55, 68), r.int(100, 130)]);
      let bIdx = 0; caps.forEach((c, j) => { if (c < caps[bIdx]) bIdx = j; });
      const rows = stageNames.map((n, j) => `${n}: ${caps[j]} units/hour`).join(', ');
      return {
        prompt: `A bakery's production line has four stages, each with a different hourly capacity: ${rows}. Which stage limits the total output of the entire line?`,
        answerType: 'mc', options: stageNames.slice(), correctAnswer: stageNames[bIdx],
        hint: 'The line as a whole can only move as fast as its SLOWEST stage — every unit must pass through every stage in sequence.',
        approach: 'Bottleneck identification: the stage with the LOWEST hourly capacity constrains the throughput of the entire line, regardless of how fast the other stages can run.',
        solution: `${stageNames[bIdx]} has the lowest capacity at ${caps[bIdx]} units/hour, compared to the other stages (${stageNames.filter((_, j) => j !== bIdx).map((n, j2) => n).join(', ')}), all of which can process faster — so ${stageNames[bIdx]} is the bottleneck limiting total line output.`,
        recognitionTechnique: 'Other', commonTrap: 'Assuming the bottleneck is the stage that SOUNDS slowest or most labor-intensive, rather than checking the actual stated hourly capacity figures.',
        tags: ['operations', 'bottleneck']
      };
    }
  });

  add({
    id: 'con_bottleneck_throughput', topic: 'Operations', subtopic: 'Computing bottleneck-limited throughput', difficulty: 3, targetTime: 100,
    build(r) {
      const bottleneckCap = r.pick([50, 60, 75, 90]);
      const otherCaps = [bottleneckCap + r.int(15, 30), bottleneckCap + r.int(35, 50), bottleneckCap + r.int(20, 40)];
      const hoursPerDay = r.pick([8, 10, 12]);
      const dailyOutput = bottleneckCap * hoursPerDay;
      return {
        prompt: `An assembly line runs ${hoursPerDay} hours per day. Its four stages have hourly capacities of ${bottleneckCap}, ${otherCaps[0]}, ${otherCaps[1]}, and ${otherCaps[2]} units/hour respectively. What is the line's total daily output, in units?`,
        answerType: 'numeric', correctAnswer: dailyOutput, tolerance: 0,
        hint: 'Only the SLOWEST stage\'s capacity determines total line throughput — the faster stages simply end up waiting on it.',
        approach: 'Daily output = bottleneck (minimum) stage capacity × hours of operation per day — the faster stages\' capacities are irrelevant to total throughput.',
        solution: `The bottleneck stage runs at ${bottleneckCap} units/hour (the lowest of the four). Daily output = ${bottleneckCap} × ${hoursPerDay} hours = ${dailyOutput.toLocaleString()} units.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Averaging all four stages\' capacities (or using the FASTEST stage\'s capacity) instead of using only the bottleneck (minimum) stage\'s capacity to compute total line throughput.',
        tags: ['operations', 'bottleneck', 'throughput']
      };
    }
  });

  /* --------------------------------- MENTAL MATH --------------------------------- */

  add({
    id: 'con_mental_percent_estimate', topic: 'Mental Math', subtopic: 'Percent of a budget line', difficulty: 1, targetTime: 40,
    build(r) {
      const base = r.pick([48000, 82000, 124000, 196000, 360000]);
      const pct = r.pick([15, 20, 25, 30, 35]);
      const correct = round(base * pct / 100, 0);
      return {
        prompt: `In a budget review, one line item is $${base.toLocaleString()}. A proposed cut removes ${pct}% of it. Quickly estimate the dollar size of the cut.`,
        answerType: 'numeric', correctAnswer: correct, tolerance: Math.max(50, correct * 0.02),
        hint: 'Break the percentage into friendly chunks, e.g. 10% + 10% + 5% instead of computing 25% directly.',
        approach: 'Decompose the percentage into round, easy-to-multiply pieces (10%, 5%, etc.) and add them, rather than long-multiplying the exact percentage.',
        solution: `${pct}% of $${base.toLocaleString()} = $${base.toLocaleString()} × ${pct / 100} = $${correct.toLocaleString()}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Losing track of a zero while scaling a large base number by a percentage, landing an order of magnitude off.',
        tags: ['mental-math', 'percent']
      };
    }
  });

  add({
    id: 'con_mental_round_multiply', topic: 'Mental Math', subtopic: 'Friendly-number multiplication', difficulty: 2, targetTime: 45,
    build(r) {
      const a = r.pick([47, 53, 68, 92, 124, 187]);
      const b = r.pick([203, 298, 412, 55, 78, 96]);
      const correct = a * b;
      return {
        prompt: `A consultant needs a quick estimate of ${a} × ${b} while thinking out loud in a case. What is the product?`,
        answerType: 'numeric', correctAnswer: correct, tolerance: Math.max(5, correct * 0.03),
        hint: 'Round each number to the nearest friendly value (e.g. ${a} ≈ a round number), multiply, then adjust for the rounding.',
        approach: 'Friendly-number decomposition: round one or both factors to the nearest ten/hundred, multiply the rounded values, then adjust for the small difference from rounding.',
        solution: `${a} × ${b} = ${correct.toLocaleString()} (e.g. rounding to ${Math.round(a / 10) * 10} × ${Math.round(b / 10) * 10} ≈ ${(Math.round(a / 10) * 10 * Math.round(b / 10) * 10).toLocaleString()} gets close, then adjust for the rounding to reach the exact figure).`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Rounding both numbers in the same direction without tracking which way each rounding pushes the estimate, compounding the error instead of partially cancelling it.',
        tags: ['mental-math', 'multiplication']
      };
    }
  });

  add({
    id: 'con_mental_kmb_zeros', topic: 'Mental Math', subtopic: 'K/M/B zero-tracking', difficulty: 2, targetTime: 40,
    build(r) {
      const val = r.pick([1.2, 2.4, 3.6, 4.8, 6.5, 7.2]);
      const fromBillion = r.pick([true, false]);
      const fromUnit = fromBillion ? 'billion' : 'million';
      const toUnit = fromBillion ? 'million' : 'thousand';
      const correct = round(val * 1000, 1);
      return {
        prompt: `A case exhibit reports a market size of $${val} ${fromUnit}. Expressed in ${toUnit}s instead, this is how many $${toUnit}?`,
        answerType: 'numeric', correctAnswer: correct, tolerance: correct * 0.01,
        hint: 'Moving from a larger unit (billion or million) to the next smaller one (million or thousand) means multiplying by exactly 1,000.',
        approach: 'Each step down in K/M/B notation (billion → million → thousand) is a factor of exactly 1,000 — multiply by 1,000 to convert to the next-smaller unit.',
        solution: `$${val} ${fromUnit} × 1,000 = ${correct} ${toUnit}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Multiplying or dividing by 100 instead of 1,000 when converting between K/M/B units, an easy zero-counting slip.',
        tags: ['mental-math', 'kmb']
      };
    }
  });

  add({
    id: 'con_mental_percent_change', topic: 'Mental Math', subtopic: 'Quick percent change', difficulty: 2, targetTime: 40,
    build(r) {
      const oldVal = r.pick([240, 360, 480, 620, 840]);
      const mult = r.pick([1.1, 1.15, 1.2, 0.85, 0.9, 0.75]);
      const newVal = Math.round(oldVal * mult);
      const correct = round(((newVal - oldVal) / oldVal) * 100, 1);
      return {
        prompt: `A metric moved from ${oldVal} last quarter to ${newVal} this quarter. What is the percentage change (to one decimal place)?`,
        answerType: 'numeric', correctAnswer: correct, tolerance: 0.3,
        hint: 'Percent change = (new − old) / old × 100 — always divide by the OLD (starting) value, not the new one.',
        approach: 'Percent change = (new value − old value) / old value × 100.',
        solution: `(${newVal} − ${oldVal}) / ${oldVal} × 100 = ${correct}%.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Dividing the change by the NEW value instead of the OLD (starting) value, which is the standard convention for percent change.',
        tags: ['mental-math', 'percent-change']
      };
    }
  });

  add({
    id: 'con_mental_division_estimate', topic: 'Mental Math', subtopic: 'Quick division estimate', difficulty: 2, targetTime: 40,
    build(r) {
      const total = r.pick([3200000, 4800000, 7200000, 9600000]);
      const count = r.pick([40, 60, 80, 120]);
      const correct = Math.round(total / count);
      return {
        prompt: `A retail chain's total annual revenue is $${total.toLocaleString()}, spread across ${count} stores. Quickly estimate the average annual revenue per store.`,
        answerType: 'numeric', correctAnswer: correct, tolerance: Math.max(500, correct * 0.02),
        hint: 'Simplify both numbers to friendly round figures before dividing, e.g. drop matching trailing zeros from both numbers first.',
        approach: 'Cancel common factors of 10 from both the total and the count before dividing, to make the division easier to do in your head.',
        solution: `$${total.toLocaleString()} / ${count} = $${correct.toLocaleString()} per store.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Losing a zero when simplifying the large numerator before dividing, understating or overstating the result by a factor of ten.',
        tags: ['mental-math', 'division']
      };
    }
  });

  add({
    id: 'con_mental_addback_percent', topic: 'Mental Math', subtopic: 'Reverse percentage', difficulty: 3, targetTime: 60,
    build(r) {
      const combos = [[10, 4400], [10, 8800], [20, 4800], [20, 9600], [25, 5000], [25, 10000], [50, 6000], [50, 12000]];
      const [increasePct, original] = r.pick(combos);
      const final = Math.round(original * (1 + increasePct / 100));
      return {
        prompt: `Revenue increased by ${increasePct}% year over year to reach $${final.toLocaleString()} this year. What was revenue LAST year (before the increase)?`,
        answerType: 'numeric', correctAnswer: original, tolerance: Math.max(10, original * 0.01),
        hint: 'The final figure represents (100% + the increase) of the original — divide by that combined factor to recover the original.',
        approach: 'Original value = final value / (1 + percentage increase as a decimal).',
        solution: `Original revenue = $${final.toLocaleString()} / (1 + ${increasePct}%) = $${final.toLocaleString()} / ${round(1 + increasePct / 100, 2)} = $${original.toLocaleString()}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: `Simply subtracting ${increasePct}% of the FINAL value from the final value (instead of dividing by 1+the growth rate), which does not correctly reverse a percentage increase.`,
        tags: ['mental-math', 'reverse-percentage']
      };
    }
  });

  add({
    id: 'con_mental_run_rate', topic: 'Mental Math', subtopic: 'Annualizing a run-rate', difficulty: 1, targetTime: 35,
    build(r) {
      const figure = r.pick([180000, 240000, 320000, 410000, 560000]);
      const basis = r.pick(['month', 'quarter']);
      const multiplier = basis === 'month' ? 12 : 4;
      const correct = figure * multiplier;
      return {
        prompt: `A business's most recent ${basis}ly revenue was $${figure.toLocaleString()}. Assuming this rate holds steady, what is the implied annual run-rate?`,
        answerType: 'numeric', correctAnswer: correct, tolerance: 0,
        hint: `There are ${multiplier} ${basis}s in a year — multiply the ${basis}ly figure by ${multiplier} to annualize it.`,
        approach: `Annual run-rate = most recent ${basis}ly figure × ${multiplier} (the number of ${basis}s in a year).`,
        solution: `$${figure.toLocaleString()} × ${multiplier} = $${correct.toLocaleString()}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Using the wrong multiplier (e.g. multiplying a quarterly figure by 12 instead of 4, confusing months and quarters).',
        tags: ['mental-math', 'run-rate']
      };
    }
  });

  add({
    id: 'con_mental_weighted_avg_estimate', topic: 'Mental Math', subtopic: 'Quick weighted average', difficulty: 2, targetTime: 50,
    build(r) {
      const valA = r.pick([20, 30, 40]);
      const weightA = r.pick([0.3, 0.4, 0.6, 0.7]);
      const valB = r.pick([60, 70, 80]);
      const weightB = round(1 - weightA, 1);
      const correct = round(valA * weightA + valB * weightB, 1);
      return {
        prompt: `Division A has a ${valA}% margin and generates ${round(weightA * 100, 0)}% of company revenue. Division B has a ${valB}% margin and generates the remaining ${round(weightB * 100, 0)}% of revenue. What is the company's blended (weighted-average) margin?`,
        answerType: 'numeric', correctAnswer: correct, tolerance: 0.3,
        hint: 'Multiply each division\'s margin by its revenue share, then add the two results together.',
        approach: 'Blended margin = (Division A margin × its revenue share) + (Division B margin × its revenue share).',
        solution: `${valA}%×${round(weightA * 100, 0)}% + ${valB}%×${round(weightB * 100, 0)}% = ${correct}%.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Taking a simple (unweighted) average of the two margins instead of weighting each by its actual share of revenue.',
        tags: ['mental-math', 'weighted-average']
      };
    }
  });

  add({
    id: 'con_mental_ratio_estimate', topic: 'Mental Math', subtopic: 'Quick ratio/multiple estimate', difficulty: 2, targetTime: 45,
    build(r) {
      const valB = r.pick([120, 180, 300, 420]);
      const k = r.pick([4, 5, 6, 7, 8]);
      const valA = valB * k;
      const correct = round(valA / valB, 1);
      return {
        prompt: `A company's enterprise value is $${valA.toLocaleString()}m, and its annual revenue is $${valB.toLocaleString()}m. Quickly estimate the EV/Revenue multiple.`,
        answerType: 'numeric', correctAnswer: correct, tolerance: 0.1,
        hint: 'Simplify the ratio by cancelling common factors before dividing, rather than performing long division.',
        approach: 'EV/Revenue multiple = enterprise value / annual revenue.',
        solution: `$${valA.toLocaleString()}m / $${valB.toLocaleString()}m = ${correct}x.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Inverting the ratio (Revenue/EV instead of EV/Revenue), producing a fraction less than 1 instead of the intended multiple.',
        tags: ['mental-math', 'ratio']
      };
    }
  });

  add({
    id: 'con_mental_fraction_of_market', topic: 'Mental Math', subtopic: 'Fraction-to-percent conversion', difficulty: 2, targetTime: 45,
    build(r) {
      const fractions = [[1, 8], [1, 6], [3, 8], [5, 8], [1, 3], [2, 3], [1, 16], [3, 16]];
      const [num, den] = r.pick(fractions);
      const totalMarketM = r.pick([40, 60, 80, 120]);
      const totalMarket = totalMarketM * 1000000;
      const correct = Math.round(totalMarket * (num / den));
      return {
        prompt: `A company holds ${num}/${den} of a $${totalMarketM}m addressable market. Quickly estimate the dollar value of the company's share.`,
        answerType: 'numeric', correctAnswer: correct, tolerance: Math.max(1000, correct * 0.01),
        hint: `Convert ${num}/${den} to a percentage first (a friendly fraction like this has a clean percentage equivalent), then apply it to the market size.`,
        approach: `Convert the fraction to a percentage, then multiply by the total market size.`,
        solution: `${num}/${den} = ${round((num / den) * 100, 1)}% of $${totalMarketM.toLocaleString()}m = $${correct.toLocaleString()}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Misconverting a common fraction to the wrong percentage (e.g. treating 1/8 as 18% instead of 12.5%).',
        tags: ['mental-math', 'fractions']
      };
    }
  });

  /* ------------------------------- INDUSTRY KNOWLEDGE ------------------------------- */

  add({
    id: 'con_industry_magnitude', topic: 'Industry Knowledge', subtopic: 'Sizing benchmarks', difficulty: 1, targetTime: 40,
    build(r) {
      const facts = [
        { label: 'the current US population', correct: '≈330-340 million', options: ['≈33-34 million', '≈330-340 million', '≈3.3-3.4 billion', '≈33-34 billion'] },
        { label: 'current world population', correct: '≈8 billion', options: ['≈800 million', '≈8 billion', '≈80 billion', '≈8 million'] },
        { label: 'current US GDP', correct: '≈$25-29 trillion', options: ['≈$2.5-2.9 trillion', '≈$25-29 trillion', '≈$250-290 trillion', '≈$25-29 billion'] },
        { label: 'current world GDP', correct: '≈$100-110 trillion', options: ['≈$10-11 trillion', '≈$100-110 trillion', '≈$1,000-1,100 trillion', '≈$100-110 billion'] },
        { label: 'the number of households in the US', correct: '≈130 million', options: ['≈13 million', '≈130 million', '≈1.3 billion', '≈13 billion'] },
        { label: "China's current population", correct: '≈1.4 billion', options: ['≈140 million', '≈1.4 billion', '≈14 billion', '≈1.4 million'] },
        { label: "India's current population", correct: '≈1.4 billion', options: ['≈140 million', '≈1.4 billion', '≈14 billion', '≈1.4 million'] },
        { label: "the EU's current population", correct: '≈450 million', options: ['≈45 million', '≈450 million', '≈4.5 billion', '≈45 billion'] }
      ];
      const f = r.pick(facts);
      return {
        prompt: `As a quick sizing-anchor check: what is the correct ORDER OF MAGNITUDE for ${f.label}?`,
        answerType: 'mc', options: r.shuffle(f.options.slice()), correctAnswer: f.correct,
        hint: 'Focus on getting the right power of ten — exact precision is not what is being tested here, only the correct general scale.',
        approach: 'Recall the rough, order-of-magnitude benchmark for this figure, used as a starting anchor for market-sizing chains.',
        solution: `${f.label[0].toUpperCase() + f.label.slice(1)} is ${f.correct} — this is the correct order of magnitude to use as a starting anchor in a market-sizing chain.`,
        recognitionTechnique: 'Other', commonTrap: 'Being off by an entire order of magnitude (a factor of 10 or more) rather than by a small, acceptable margin within the correct order of magnitude.',
        tags: ['industry-knowledge', 'sizing-facts']
      };
    }
  });

  global.QTL_GEN_CONSULTING = G;
})(window);
