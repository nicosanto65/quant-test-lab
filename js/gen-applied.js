/* QUANT TEST LAB — parameterised generators: speed maths, finance,
   data interpretation, constraint optimisation, logic, market making. */
(function (global) {
  'use strict';
  const U = global.QTL_UTIL;
  const { round, money, nCr } = U;
  const G = [];
  const add = (g) => G.push(g);

  /* ============================ O. MENTAL MATHS ============================ */

  add({
    id: 'm_pct_of', topic: 'Mental Maths', subtopic: 'Percentages', difficulty: 1, targetTime: 20,
    build(r) {
      const p = r.pick([12.5, 15, 17.5, 22, 35, 45, 65, 85]);
      const n = r.pick([240, 360, 480, 640, 800, 1200]);
      const ans = round(p * n / 100, 2);
      return {
        prompt: `What is ${p}% of ${n}?`,
        answerType: 'numeric', correctAnswer: ans, tolerance: 0.01,
        hint: 'Break the percentage into friendly pieces (10% + 5% + …).',
        approach: 'Decompose into 10%, 5%, 1% chunks and add.',
        solution: `10% of ${n} = ${n / 10}. Scaling to ${p}% gives ${ans}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Slipping a decimal place.', tags: ['speed']
      };
    }
  });

  add({
    id: 'm_pct_change', topic: 'Mental Maths', subtopic: 'Percentages', difficulty: 2, targetTime: 30,
    build(r) {
      const a = r.pick([40, 50, 80, 120, 250, 400]);
      const up = r.pick([10, 20, 25, 50]), down = r.pick([10, 20, 25, 50]);
      const ans = round(a * (1 + up / 100) * (1 - down / 100), 2);
      return {
        prompt: `A price of ${a} rises ${up}% and then falls ${down}%. What is the final price?`,
        answerType: 'numeric', correctAnswer: ans, tolerance: 0.02,
        hint: 'Multiply the factors; do not add the percentages.',
        approach: 'Chain multiplicative factors: a·(1+u)·(1−d).',
        solution: `${a}·${round(1 + up / 100, 2)}·${round(1 - down / 100, 2)} = ${ans}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: `Concluding the net move is ${up - down}%.`, tags: ['speed']
      };
    }
  });

  add({
    id: 'm_ratio_split', topic: 'Mental Maths', subtopic: 'Ratios', difficulty: 1, targetTime: 30,
    build(r) {
      const a = r.int(2, 7), b = r.int(2, 7), c = r.int(1, 5);
      const unit = r.pick([12, 20, 25, 40, 50]);
      const total = (a + b + c) * unit;
      return {
        prompt: `${money(total, '€')} is split in the ratio ${a} : ${b} : ${c}. How much does the largest share receive?`,
        answerType: 'numeric', correctAnswer: Math.max(a, b, c) * unit, tolerance: 0.01,
        hint: 'Find the value of one ratio unit first.',
        approach: 'Total parts = a+b+c; one part = total / parts.',
        solution: `Parts = ${a + b + c}, one part = ${unit}. Largest share = ${Math.max(a, b, c)}·${unit} = ${Math.max(a, b, c) * unit}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Dividing by the number of shares (3) instead of total parts.', tags: ['speed']
      };
    }
  });

  add({
    id: 'm_mult', topic: 'Mental Maths', subtopic: 'Multiplication', difficulty: 2, targetTime: 25,
    build(r) {
      const a = r.int(11, 99), b = r.pick([11, 12, 15, 19, 21, 25, 49, 51, 99]);
      return {
        prompt: `Compute ${a} × ${b}.`,
        answerType: 'numeric', correctAnswer: a * b, tolerance: 0,
        hint: 'Round to a friendly number and correct.',
        approach: 'Difference-of-friendly-numbers: e.g. ×99 = ×100 − ×1, ×25 = ×100/4.',
        solution: `${a} × ${b} = ${a * b}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Long multiplication when a shortcut exists.', tags: ['speed']
      };
    }
  });

  add({
    id: 'm_sqrt', topic: 'Mental Maths', subtopic: 'Roots and powers', difficulty: 2, targetTime: 35,
    build(r) {
      const n = r.int(20, 95) * r.pick([1, 10]);
      const ans = round(Math.sqrt(n), 3);
      return {
        prompt: `Estimate √${n} to two decimal places.`,
        answerType: 'numeric', correctAnswer: ans, tolerance: 0.06,
        hint: 'Bracket between two perfect squares and interpolate linearly.',
        approach: 'Linearisation: √(a²+d) ≈ a + d/(2a).',
        solution: `√${n} ≈ ${ans}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Interpolating between the roots rather than the squares.', tags: ['speed', 'approximation']
      };
    }
  });

  add({
    id: 'm_frac_dec', topic: 'Mental Maths', subtopic: 'Fractions', difficulty: 1, targetTime: 20,
    build(r) {
      const d = r.pick([7, 8, 9, 11, 12, 16]), n = r.int(1, d - 1);
      return {
        prompt: `Express ${n}/${d} as a percentage, to one decimal place.`,
        answerType: 'numeric', correctAnswer: round(100 * n / d, 1), tolerance: 0.12,
        hint: 'Anchor on the common ones: 1/7 ≈ 14.3%, 1/8 = 12.5%, 1/9 ≈ 11.1%, 1/11 ≈ 9.09%.',
        approach: 'Memorised unit-fraction anchors scaled by the numerator.',
        solution: `${n}/${d} = ${round(100 * n / d, 2)}%.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Long division under time pressure instead of using anchors.', tags: ['speed']
      };
    }
  });

  add({
    id: 'm_reverse_pct', topic: 'Mental Maths', subtopic: 'Percentages', difficulty: 2, targetTime: 40,
    build(r) {
      const orig = r.pick([80, 120, 200, 250, 400, 500]);
      const up = r.pick([20, 25, 50, 60]);
      const after = round(orig * (1 + up / 100), 2);
      return {
        prompt: `After a ${up}% increase, a value is ${after}. What was it before the increase?`,
        answerType: 'numeric', correctAnswer: orig, tolerance: 0.05,
        hint: 'Divide by the growth factor; do not subtract the same percentage.',
        approach: 'Reverse percentage: original = after / (1 + rate).',
        solution: `${after} / ${round(1 + up / 100, 2)} = ${orig}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: `Taking ${up}% off ${after}.`, tags: ['speed']
      };
    }
  });

  add({
    id: 'm_weighted', topic: 'Mental Maths', subtopic: 'Weighted averages', difficulty: 2, targetTime: 45,
    build(r) {
      const n1 = r.pick([20, 30, 40, 60]), n2 = r.pick([10, 20, 50, 80]);
      const a1 = r.int(40, 70), a2 = r.int(60, 95);
      const ans = round((n1 * a1 + n2 * a2) / (n1 + n2), 2);
      return {
        prompt: `Desk A has ${n1} trades averaging ${a1} bps of profit; desk B has ${n2} trades averaging ${a2} bps. What is the overall average across all trades, in bps?`,
        answerType: 'numeric', correctAnswer: ans, tolerance: 0.05,
        hint: 'Weight by the number of trades, not equally.',
        approach: 'Weighted mean = Σ(nᵢaᵢ)/Σnᵢ.',
        solution: `(${n1}·${a1} + ${n2}·${a2}) / ${n1 + n2} = ${n1 * a1 + n2 * a2}/${n1 + n2} = ${ans}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Averaging the two averages.', tags: ['speed', 'weighted average']
      };
    }
  });

  add({
    id: 'm_compound', topic: 'Mental Maths', subtopic: 'Growth rates', difficulty: 3, targetTime: 45,
    build(r) {
      const rate = r.pick([3, 4, 5, 6, 7, 8, 9, 12]);
      const ans = round(72 / rate, 2);
      return {
        prompt: `At a constant annual growth rate of ${rate}%, roughly how many years does it take for a quantity to double? (Use the rule of 72.)`,
        answerType: 'numeric', correctAnswer: ans, tolerance: 0.6,
        hint: 'One division.',
        approach: 'Rule of 72: doubling time ≈ 72 / rate in percent.',
        solution: `72/${rate} ≈ ${ans} years (exact: ln2/ln(1+${rate}/100) = ${round(Math.log(2) / Math.log(1 + rate / 100), 2)}).`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Using 100/rate.', tags: ['speed', 'growth']
      };
    }
  });

  add({
    id: 'm_unitrate', topic: 'Mental Maths', subtopic: 'Approximation', difficulty: 2, targetTime: 40,
    build(r) {
      const total = r.int(120, 900) * 1000, per = r.int(7, 40);
      const ans = round(total / per, 1);
      return {
        prompt: `A fund of ${money(total, '€')} is allocated equally across ${per} strategies. Approximately how much does each receive?`,
        answerType: 'numeric', correctAnswer: ans, tolerance: Math.max(1, ans * 0.02),
        hint: 'Round the divisor to something friendly, then correct the direction of the error.',
        approach: 'Estimate by rounding, then adjust.',
        solution: `${total}/${per} ≈ ${ans}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Rounding in the wrong direction and not correcting.', tags: ['speed', 'approximation']
      };
    }
  });

  /* ============================ P. FINANCE (SIG) =========================== */

  add({
    id: 'f_mktcap', topic: 'Finance', subtopic: 'Market cap', difficulty: 1, targetTime: 40,
    build(r) {
      const sh = r.pick([20, 40, 50, 80, 120, 250]);      // millions
      const px = r.pick([12, 15, 24, 33, 48, 60]);
      return {
        prompt: `A company has ${sh} million shares outstanding trading at $${px}. What is its market capitalisation, in $ millions?`,
        answerType: 'numeric', correctAnswer: sh * px, tolerance: 0.5,
        hint: 'Two numbers, one multiplication.',
        approach: 'Market cap = share price × diluted shares outstanding.',
        solution: `${sh}m × $${px} = $${sh * px}m.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Confusing market cap with enterprise value.', tags: ['valuation']
      };
    }
  });

  add({
    id: 'f_ev', topic: 'Finance', subtopic: 'Enterprise value', difficulty: 2, targetTime: 50,
    build(r) {
      const mc = r.pick([500, 800, 1200, 2000]), debt = r.pick([100, 250, 400, 600]), cash = r.pick([50, 120, 300, 450]);
      return {
        prompt: `A company has a market cap of $${mc}m, total debt of $${debt}m and cash of $${cash}m. What is its enterprise value, in $ millions?`,
        answerType: 'numeric', correctAnswer: mc + debt - cash, tolerance: 0.5,
        hint: 'Cash is subtracted because an acquirer effectively gets it back.',
        approach: 'EV = market cap + net debt = cap + debt − cash.',
        solution: `${mc} + ${debt} − ${cash} = $${mc + debt - cash}m.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Adding cash instead of subtracting it.', tags: ['valuation']
      };
    }
  });

  add({
    id: 'f_pe', topic: 'Finance', subtopic: 'P/E and EPS', difficulty: 2, targetTime: 60,
    build(r) {
      const ni = r.pick([60, 90, 120, 200]), sh = r.pick([20, 30, 40, 50]), px = r.pick([18, 24, 30, 45, 60]);
      const eps = ni / sh, pe = px / eps;
      return {
        prompt: `Net income is $${ni}m across ${sh}m shares, and the stock trades at $${px}. What is the trailing P/E ratio?`,
        answerType: 'numeric', correctAnswer: round(pe, 3), tolerance: 0.06,
        hint: 'Compute EPS first.',
        approach: 'EPS = NI / shares; P/E = price / EPS (equivalently market cap / net income).',
        solution: `EPS = ${ni}/${sh} = $${round(eps, 3)}. P/E = ${px}/${round(eps, 3)} = ${round(pe, 2)}×.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Inverting the ratio (that gives the earnings yield).', tags: ['multiples']
      };
    }
  });

  add({
    id: 'f_evebitda', topic: 'Finance', subtopic: 'EV/EBITDA', difficulty: 2, targetTime: 60,
    build(r) {
      const rev = r.pick([400, 600, 900, 1500]), m = r.pick([0.15, 0.2, 0.25, 0.3]);
      const ebitda = rev * m, mult = r.pick([6, 8, 10, 12]);
      return {
        prompt: `A business has revenue of $${rev}m at a ${round(m * 100, 0)}% EBITDA margin. If comparable firms trade at ${mult}× EV/EBITDA, what enterprise value does that imply, in $ millions?`,
        answerType: 'numeric', correctAnswer: round(ebitda * mult, 2), tolerance: 1,
        hint: 'Margin × revenue gives EBITDA.',
        approach: 'Comparable-multiple valuation: EV = multiple × EBITDA.',
        solution: `EBITDA = ${rev}·${m} = $${ebitda}m. EV = ${mult}× × ${ebitda} = $${round(ebitda * mult, 1)}m.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Applying the multiple to revenue.', tags: ['multiples']
      };
    }
  });

  add({
    id: 'f_margin', topic: 'Finance', subtopic: 'Margins', difficulty: 1, targetTime: 40,
    build(r) {
      const rev = r.pick([250, 480, 750, 1100]), op = r.int(20, 140);
      return {
        prompt: `Revenue is $${rev}m and operating income is $${op}m. What is the operating margin, in percent?`,
        answerType: 'numeric', correctAnswer: round(100 * op / rev, 2), tolerance: 0.1,
        hint: 'Margins are always over revenue.',
        approach: 'Margin = income / revenue.',
        solution: `${op}/${rev} = ${round(100 * op / rev, 2)}%.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Dividing by income instead of revenue.', tags: ['margins']
      };
    }
  });

  add({
    id: 'f_growth', topic: 'Finance', subtopic: 'Growth rates', difficulty: 2, targetTime: 60,
    build(r) {
      const a = r.pick([100, 250, 400]), yrs = r.pick([2, 3, 4]);
      const g = r.pick([1.1, 1.15, 1.2, 1.25]);
      const b = round(a * Math.pow(g, yrs), 1);
      const cagr = round((Math.pow(b / a, 1 / yrs) - 1) * 100, 2);
      return {
        prompt: `Revenue grew from $${a}m to $${b}m over ${yrs} years. What is the compound annual growth rate, in percent?`,
        answerType: 'numeric', correctAnswer: cagr, tolerance: 0.35,
        hint: 'Take the ratio, then the n-th root.',
        approach: 'CAGR = (end/start)^{1/n} − 1.',
        solution: `(${b}/${a})^{1/${yrs}} − 1 = ${cagr}%.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Dividing the total growth by the number of years.', tags: ['growth']
      };
    }
  });

  add({
    id: 'f_dilution', topic: 'Finance', subtopic: 'Dilution', difficulty: 3, targetTime: 75,
    build(r) {
      const sh = r.pick([40, 60, 100]), ni = r.pick([80, 120, 200]);
      const newSh = r.pick([5, 10, 20]);
      const before = ni / sh, after = ni / (sh + newSh);
      return {
        prompt: `A company earning $${ni}m issues ${newSh}m new shares on top of ${sh}m existing shares, with no change to net income. By what percentage does EPS fall?`,
        answerType: 'numeric', correctAnswer: round(100 * (before - after) / before, 2), tolerance: 0.15,
        hint: 'EPS falls in proportion to the share-count increase.',
        approach: 'EPS dilution = 1 − old shares/new shares.',
        solution: `EPS goes from ${round(before, 3)} to ${round(after, 3)}, a fall of ${round(100 * (before - after) / before, 2)}% (= ${newSh}/${sh + newSh}).`,
        recognitionTechnique: 'Direct calculation', commonTrap: `Answering ${round(100 * newSh / sh, 1)}% by dividing by the old share count.`, tags: ['eps']
      };
    }
  });

  add({
    id: 'f_bond', topic: 'Finance', subtopic: 'Bonds and yields', difficulty: 2, targetTime: 60,
    build(r) {
      const cpn = r.pick([2, 3, 4, 5, 6]), px = r.pick([80, 90, 95, 105, 110]);
      const cy = round(100 * cpn / px, 3);
      return {
        prompt: `A bond with a ${cpn}% annual coupon on $100 face trades at $${px}. What is its current yield, in percent?`,
        answerType: 'numeric', correctAnswer: cy, tolerance: 0.06,
        hint: 'Current yield ignores the pull to par.',
        approach: 'Current yield = annual coupon / clean price.',
        solution: `${cpn}/${px} = ${cy}%. ${px < 100 ? 'Trading below par, so yield exceeds the coupon.' : 'Trading above par, so yield is below the coupon.'}`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Confusing current yield with yield to maturity.', tags: ['rates']
      };
    }
  });

  add({
    id: 'f_fx', topic: 'Finance', subtopic: 'FX', difficulty: 2, targetTime: 60,
    build(r) {
      const eurusd = r.pick([1.05, 1.08, 1.10, 1.12, 1.20]);
      const usdjpy = r.pick([130, 140, 145, 150]);
      const cross = round(eurusd * usdjpy, 2);
      return {
        prompt: `EUR/USD is ${eurusd} and USD/JPY is ${usdjpy}. What is the implied EUR/JPY cross rate?`,
        answerType: 'numeric', correctAnswer: cross, tolerance: 0.5,
        hint: 'Cancel the USD leg.',
        approach: 'Triangular arbitrage / cross-rate chaining.',
        solution: `EUR/JPY = EUR/USD × USD/JPY = ${eurusd} × ${usdjpy} = ${cross}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Dividing when the quote convention already lines up.', tags: ['fx']
      };
    }
  });

  add({
    id: 'f_beat', topic: 'Finance', subtopic: 'Earnings beats', difficulty: 3, targetTime: 90,
    build(r) {
      const est = r.pick([1.20, 1.50, 2.00, 2.40]);
      const act = round(est * r.pick([1.03, 1.05, 1.08, 0.95, 0.92]), 2);
      const beat = round(100 * (act - est) / est, 2);
      const guideCut = r.pick([true, false]);
      return {
        prompt: `Consensus EPS was $${est.toFixed(2)} and the company reported $${act.toFixed(2)}. By what percentage did EPS ${act >= est ? 'beat' : 'miss'} consensus? ${guideCut ? '(Management also cut full-year guidance — note this does not change the arithmetic.)' : ''}`,
        answerType: 'numeric', correctAnswer: Math.abs(beat), tolerance: 0.3,
        hint: 'Surprise is always measured against the estimate.',
        approach: 'Earnings surprise = (actual − estimate)/estimate.',
        solution: `(${act.toFixed(2)} − ${est.toFixed(2)})/${est.toFixed(2)} = ${beat}% ⇒ magnitude ${Math.abs(beat)}%.${guideCut ? ' A guidance cut alongside a beat often still sends the stock lower — the market prices forward expectations.' : ''}`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Dividing by the actual figure rather than the estimate.', tags: ['earnings']
      };
    }
  });

  add({
    id: 'f_leverage', topic: 'Finance', subtopic: 'Leverage', difficulty: 3, targetTime: 75,
    build(r) {
      const eq = r.pick([100, 200, 400]), lev = r.pick([2, 3, 4, 5]);
      const move = r.pick([2, 3, 5, -4, -6]);
      const assets = eq * lev;
      const ret = round(move * lev, 2);
      return {
        prompt: `A book of $${assets}m is funded with $${eq}m of equity (the rest borrowed). If the assets move ${move}%, what is the percentage return on equity, ignoring funding costs?`,
        answerType: 'numeric', correctAnswer: ret, tolerance: 0.1,
        hint: 'Leverage multiplies both gains and losses.',
        approach: 'Return on equity = asset return × (assets/equity).',
        solution: `Leverage = ${assets}/${eq} = ${lev}×. RoE = ${move}% × ${lev} = ${ret}%.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Forgetting that the same multiplier applies to losses.', tags: ['leverage']
      };
    }
  });

  /* ======================= MARKET MAKING / TRADING EV ====================== */

  add({
    id: 'mm_spread', topic: 'Market Making', subtopic: 'Fair value and edge', difficulty: 3, targetTime: 90,
    build(r) {
      const s = r.pick([6, 8, 10, 12]);
      const dice = r.pick([1, 2]);
      const fair = round(dice * (s + 1) / 2, 2);
      const edgeSize = r.pick([0.5, 1, 1.5]);
      const spreadPad = r.pick([0.5, 1, 1.5]);
      const scenario = r.pick(['buy', 'sell', 'none']);
      let bid, ask, correctAnswer, edgeText;
      if (scenario === 'buy') {
        ask = round(fair - edgeSize, 2);
        bid = round(ask - spreadPad, 2);
        correctAnswer = 'Buy at the offer';
        edgeText = `the offer (${ask}) sits below fair value, so buying at ${ask} captures ${fair} − ${ask} = ${edgeSize} of expected edge per contract; selling into the bid (${bid}) would be even further below fair value, a losing trade`;
      } else if (scenario === 'sell') {
        bid = round(fair + edgeSize, 2);
        ask = round(bid + spreadPad, 2);
        correctAnswer = 'Sell at the bid';
        edgeText = `the bid (${bid}) sits above fair value, so selling into it captures ${bid} − ${fair} = ${edgeSize} of expected edge per contract; buying at the offer (${ask}) would be even further above fair value, a losing trade`;
      } else {
        bid = round(fair - edgeSize, 2);
        ask = round(fair + edgeSize, 2);
        correctAnswer = 'No trade — the market is fair';
        edgeText = `buying at the offer (${ask}) would cost ${edgeSize} more than fair value, and selling into the bid (${bid}) would receive ${edgeSize} less than fair value — neither side offers positive edge here, so the correct action is not to trade`;
      }
      return {
        prompt: `A contract settles at the sum of ${dice} fair ${s}-sided dice. You are shown a market of ${bid} bid / ${ask} offered. Which side (if any) offers positive expected value?`,
        answerType: 'mc',
        options: ['Buy at the offer', 'Sell at the bid', 'No trade — the market is fair', 'Both sides offer positive edge'],
        correctAnswer,
        hint: 'Compute fair value first (linearity of expectation), then compare it against both the bid and the offer — remember you can only BUY at the offer and SELL at the bid, never the reverse.',
        approach: 'Fair value by linearity of expectation, then compare against both sides of the market; only one side (or neither) can ever have genuine positive edge.',
        solution: `Fair value = ${dice} × ${(s + 1) / 2} = ${fair}. In a "X bid / Y offered" market you can only sell into the bid (X) or buy at the offer (Y), never the reverse. Here ${edgeText}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Assuming a quoted market always has a trade available — often the market brackets fair value symmetrically with no edge on either side; also, mixing up which side you buy versus sell on (you buy at the offer, sell at the bid, never the reverse).',
        tags: ['market making']
      };
    }
  });

  add({
    id: 'mm_ev_quote', topic: 'Market Making', subtopic: 'Adverse selection', difficulty: 4, targetTime: 120,
    build(r) {
      const p = r.pick([0.2, 0.25, 0.3]);
      const edge = r.int(2, 6), loss = r.int(8, 20);
      const ev = round((1 - p) * edge - p * loss, 3);
      return {
        prompt: `You quote a two-sided market. ${round(p * 100, 0)}% of the counterparties you trade with are informed and cost you ${loss} ticks on average; the rest are uninformed and you earn ${edge} ticks of spread from them. What is your expected profit per trade, in ticks?`,
        answerType: 'numeric', correctAnswer: ev, tolerance: 0.05,
        hint: 'Weight both counterparty types by their frequency.',
        approach: 'Two-outcome EV with adverse selection.',
        solution: `EV = ${round(1 - p, 2)}·${edge} − ${p}·${loss} = ${round((1 - p) * edge, 2)} − ${round(p * loss, 2)} = ${ev} ticks. ${ev < 0 ? 'Negative — the quote must be widened.' : 'Positive — the spread covers the adverse selection.'}`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Looking only at the spread earned and ignoring informed flow.',
        tags: ['market making', 'adverse selection']
      };
    }
  });

  /* ====================== SEQUENCES / LOGIC (IMC-style) ==================== */

  add({
    id: 'l_seq_linear', topic: 'Logic', subtopic: 'Sequences', difficulty: 2, targetTime: 40,
    build(r) {
      const a = r.int(2, 9), d = r.int(2, 9), mode = r.pick(['arith', 'geom', 'quad']);
      let seq = [], next;
      if (mode === 'arith') { for (let i = 0; i < 5; i++) seq.push(a + i * d); next = a + 5 * d; }
      else if (mode === 'geom') { const q = r.pick([2, 3]); for (let i = 0; i < 5; i++) seq.push(a * Math.pow(q, i)); next = a * Math.pow(q, 5); }
      else { for (let i = 1; i <= 5; i++) seq.push(a + i * i * d); next = a + 36 * d; }
      return {
        prompt: `What number comes next in the sequence: ${seq.join(', ')}, ?`,
        answerType: 'numeric', correctAnswer: next, tolerance: 0,
        hint: 'Take first differences; if those are not constant, take second differences or ratios.',
        approach: 'Difference table / ratio test to identify arithmetic, geometric or quadratic structure.',
        solution: `The pattern is ${mode === 'arith' ? 'arithmetic with common difference ' + d : mode === 'geom' ? 'geometric' : 'quadratic (second differences constant)'}. Next term = ${next}.`,
        recognitionTechnique: 'Other', commonTrap: 'Forcing an arithmetic pattern onto a quadratic sequence.',
        tags: ['sequences']
      };
    }
  });

  add({
    id: 'l_rate_work', topic: 'Logic', subtopic: 'Rates', difficulty: 2, targetTime: 60,
    build(r) {
      const t1 = r.pick([4, 6, 10, 12]), t2 = r.pick([3, 8, 15, 20]);
      const combined = round(1 / (1 / t1 + 1 / t2), 3);
      return {
        prompt: `One process completes a task in ${t1} hours and another in ${t2} hours. Working simultaneously and independently, how long do they take together, in hours?`,
        answerType: 'numeric', correctAnswer: combined, tolerance: 0.03,
        hint: 'Add rates, not times.',
        approach: 'Rate addition: 1/T = 1/t₁ + 1/t₂.',
        solution: `Combined rate = 1/${t1} + 1/${t2} = ${round(1 / t1 + 1 / t2, 4)} per hour ⇒ T = ${combined} h.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Averaging the two times.',
        tags: ['rates']
      };
    }
  });

  add({
    id: 'l_relative', topic: 'Logic', subtopic: 'Rates', difficulty: 3, targetTime: 75,
    build(r) {
      const d = r.pick([120, 180, 240, 300]), v1 = r.pick([40, 50, 60]), v2 = r.pick([30, 60, 90]);
      const t = round(d / (v1 + v2), 3);
      return {
        prompt: `Two vehicles start ${d} km apart and drive towards each other at ${v1} km/h and ${v2} km/h. After how many hours do they meet?`,
        answerType: 'numeric', correctAnswer: t, tolerance: 0.03,
        hint: 'The gap closes at the sum of the speeds.',
        approach: 'Relative velocity: t = distance / closing speed.',
        solution: `Closing speed ${v1 + v2} km/h ⇒ t = ${d}/${v1 + v2} = ${t} h.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Using only one vehicle\'s speed.',
        tags: ['rates']
      };
    }
  });

  add({
    id: 'l_truth', topic: 'Logic', subtopic: 'Deduction', difficulty: 3, targetTime: 90,
    build(r) {
      const names = r.shuffle(['Ana', 'Beto', 'Carla', 'Dario']);
      const [x, y, z, w] = names;
      return {
        prompt: `Four analysts finished a task in some order, with no ties. ${x} finished before ${y}. ${z} finished after ${y} but before ${w}. Who finished last?`,
        answerType: 'mc', options: names.slice(), correctAnswer: w,
        hint: 'Chain the two statements into one ordering.',
        approach: 'Transitive chaining of ordering constraints.',
        solution: `${x} < ${y} and ${y} < ${z} < ${w} give the full order ${x} < ${y} < ${z} < ${w}, so ${w} is last.`,
        recognitionTechnique: 'Other', commonTrap: 'Assuming the first-named person is first.',
        tags: ['deduction']
      };
    }
  });

  /* ================== McKINSEY-STYLE: DATA INTERPRETATION ================= */

  add({
    id: 'k_table_share', topic: 'Data Interpretation', subtopic: 'Table reading', difficulty: 2, targetTime: 90,
    build(r) {
      const regions = ['North', 'South', 'East', 'West'];
      const rev = regions.map(() => r.int(20, 90) * 10);
      const cost = rev.map((v) => Math.round(v * (0.55 + r.int(0, 25) / 100)));
      const total = rev.reduce((a, b) => a + b, 0);
      const i = r.int(0, 3);
      const share = round(100 * rev[i] / total, 2);
      const rows = regions.map((rg, j) =>
        `<tr><td>${rg}</td><td>${rev[j]}</td><td>${cost[j]}</td><td>${rev[j] - cost[j]}</td></tr>`).join('');
      return {
        prompt: `<p>Regional results for the last financial year (€ thousands):</p>
        <table class="qtable"><thead><tr><th>Region</th><th>Revenue</th><th>Cost</th><th>Profit</th></tr></thead>
        <tbody>${rows}</tbody></table>
        <p>What share of total revenue came from the ${regions[i]} region, in percent?</p>`,
        answerType: 'numeric', correctAnswer: share, tolerance: 0.2,
        hint: 'You only need one column.',
        approach: 'Locate the required column, ignore the rest, compute the share.',
        solution: `Total revenue = ${total}. ${regions[i]} = ${rev[i]} ⇒ ${share}%.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Computing profit share instead of revenue share.',
        tags: ['exhibit', 'mckinsey']
      };
    }
  });

  add({
    id: 'k_table_margin', topic: 'Data Interpretation', subtopic: 'Ratios from exhibits', difficulty: 3, targetTime: 110,
    build(r) {
      const prods = ['Alpha', 'Beta', 'Gamma', 'Delta'];
      const units = prods.map(() => r.int(10, 60) * 100);
      const price = prods.map(() => r.int(8, 40));
      const unitCost = price.map((p) => Math.max(2, Math.round(p * (0.4 + r.int(0, 40) / 100))));
      const margins = prods.map((_, j) => (price[j] - unitCost[j]) / price[j]);
      let best = 0; margins.forEach((m, j) => { if (m > margins[best]) best = j; });
      const rows = prods.map((p, j) =>
        `<tr><td>${p}</td><td>${units[j].toLocaleString()}</td><td>${price[j]}</td><td>${unitCost[j]}</td></tr>`).join('');
      return {
        prompt: `<p>Product line data (units, € per unit):</p>
        <table class="qtable"><thead><tr><th>Product</th><th>Units sold</th><th>Price</th><th>Unit cost</th></tr></thead>
        <tbody>${rows}</tbody></table>
        <p>Which product has the highest gross margin percentage?</p>`,
        answerType: 'mc', options: prods.slice(), correctAnswer: prods[best],
        hint: 'Margin percentage does not depend on volume at all.',
        approach: 'Filter the exhibit to the two relevant columns; compute (price − cost)/price.',
        solution: prods.map((p, j) => `${p}: (${price[j]}−${unitCost[j]})/${price[j]} = ${round(margins[j] * 100, 1)}%`).join('; ') + `. Highest is ${prods[best]}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Choosing the product with the largest absolute profit (volume × margin).',
        tags: ['exhibit', 'mckinsey']
      };
    }
  });

  add({
    id: 'k_growth_table', topic: 'Data Interpretation', subtopic: 'Growth from exhibits', difficulty: 3, targetTime: 110,
    build(r) {
      const yrs = [2022, 2023, 2024, 2025];
      const seg = ['Retail', 'Wholesale', 'Digital'];
      const data = seg.map(() => {
        let v = r.int(50, 200); const row = [v];
        for (let i = 1; i < 4; i++) { v = Math.round(v * (1 + r.int(-10, 35) / 100)); row.push(v); }
        return row;
      });
      const gr = data.map((row) => (row[3] - row[0]) / row[0]);
      let best = 0; gr.forEach((g, j) => { if (g > gr[best]) best = j; });
      const rows = seg.map((s, j) => `<tr><td>${s}</td>${data[j].map((v) => `<td>${v}</td>`).join('')}</tr>`).join('');
      return {
        prompt: `<p>Segment revenue (€m):</p>
        <table class="qtable"><thead><tr><th>Segment</th>${yrs.map((y) => `<th>${y}</th>`).join('')}</tr></thead>
        <tbody>${rows}</tbody></table>
        <p>Which segment grew fastest in percentage terms between ${yrs[0]} and ${yrs[3]}?</p>`,
        answerType: 'mc', options: seg.slice(), correctAnswer: seg[best],
        hint: 'Compare ratios of end to start, not the absolute increases.',
        approach: 'Percentage growth comparison across rows of an exhibit.',
        solution: seg.map((s, j) => `${s}: ${data[j][0]}→${data[j][3]} = ${round(gr[j] * 100, 1)}%`).join('; ') + `. Fastest: ${seg[best]}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Picking the segment with the biggest euro increase.',
        tags: ['exhibit', 'mckinsey']
      };
    }
  });

  add({
    id: 'k_weighted_exhibit', topic: 'Data Interpretation', subtopic: 'Weighted averages', difficulty: 3, targetTime: 120,
    build(r) {
      const sites = ['Site 1', 'Site 2', 'Site 3'];
      const vol = sites.map(() => r.int(10, 50) * 100);
      const defect = sites.map(() => round(r.int(5, 60) / 10, 1));
      const totalV = vol.reduce((a, b) => a + b, 0);
      const wavg = round(vol.reduce((a, v, j) => a + v * defect[j], 0) / totalV, 3);
      const rows = sites.map((s, j) => `<tr><td>${s}</td><td>${vol[j].toLocaleString()}</td><td>${defect[j]}%</td></tr>`).join('');
      return {
        prompt: `<p>Production and quality by site:</p>
        <table class="qtable"><thead><tr><th>Site</th><th>Units</th><th>Defect rate</th></tr></thead><tbody>${rows}</tbody></table>
        <p>What is the overall defect rate across all sites, in percent?</p>`,
        answerType: 'numeric', correctAnswer: wavg, tolerance: 0.06,
        hint: 'Sites of different size cannot be averaged equally.',
        approach: 'Volume-weighted average: Σ(vᵢrᵢ)/Σvᵢ.',
        solution: `Weighted total defects = ${round(vol.reduce((a, v, j) => a + v * defect[j] / 100, 0), 1)} units over ${totalV.toLocaleString()} units = ${wavg}%.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Taking the simple mean of the three rates.',
        tags: ['exhibit', 'mckinsey', 'weighted average']
      };
    }
  });

  /* ================ McKINSEY-STYLE: CONSTRAINT OPTIMISATION =============== */

  add({
    id: 'k_knapsack', topic: 'Constraint Optimisation', subtopic: 'Budget allocation', difficulty: 4, targetTime: 180,
    build(r) {
      const names = ['Automation', 'Training', 'Logistics', 'Packaging', 'Analytics'];
      const items = names.map((n) => ({ n, cost: r.int(2, 9), val: r.int(3, 14) }));
      const budget = r.int(10, 16);
      // exact best subset by enumeration
      let bestVal = -1, bestSet = [];
      for (let m = 0; m < 32; m++) {
        let c = 0, v = 0, s = [];
        for (let i = 0; i < 5; i++) if (m & (1 << i)) { c += items[i].cost; v += items[i].val; s.push(items[i].n); }
        if (c <= budget && v > bestVal) { bestVal = v; bestSet = s; }
      }
      const rows = items.map((i) => `<tr><td>${i.n}</td><td>${i.cost}</td><td>${i.val}</td></tr>`).join('');
      return {
        prompt: `<p>Each initiative can be funded at most once. Budget: <strong>€${budget}m</strong>.</p>
        <table class="qtable"><thead><tr><th>Initiative</th><th>Cost (€m)</th><th>Value score</th></tr></thead><tbody>${rows}</tbody></table>
        <p>What is the maximum total value score achievable within the budget?</p>`,
        answerType: 'numeric', correctAnswer: bestVal, tolerance: 0,
        hint: 'Rank by value per euro first, then check whether the leftover budget can be used better.',
        approach: 'Small 0/1 knapsack: greedy by value density, then repair by swapping to use the residual budget.',
        solution: `Best affordable combination: ${bestSet.join(' + ')} — cost ${items.filter((i) => bestSet.includes(i.n)).reduce((a, i) => a + i.cost, 0)}, value ${bestVal}.`,
        recognitionTechnique: 'Other', commonTrap: 'Pure greedy by value density can leave budget stranded — always check the residual.',
        tags: ['optimisation', 'mckinsey']
      };
    }
  });

  add({
    id: 'k_feasible', topic: 'Constraint Optimisation', subtopic: 'Feasibility', difficulty: 3, targetTime: 150,
    build(r) {
      const cap = r.int(40, 70);
      const min = r.int(10, 20);
      const opts = [];
      for (let i = 0; i < 4; i++) {
        opts.push({ a: r.int(5, 40), b: r.int(5, 40) });
      }
      // feasible: a+b <= cap and a >= min and b >= min
      let good = opts.findIndex((o) => o.a + o.b <= cap && o.a >= min && o.b >= min);
      if (good === -1) { opts[0] = { a: min + 2, b: Math.min(cap - min - 2, min + 3) }; good = 0; }
      // ensure uniqueness
      opts.forEach((o, i) => {
        if (i !== good && o.a + o.b <= cap && o.a >= min && o.b >= min) o.a = min - 1;
      });
      const labels = ['Plan A', 'Plan B', 'Plan C', 'Plan D'];
      const rows = opts.map((o, i) => `<tr><td>${labels[i]}</td><td>${o.a}</td><td>${o.b}</td></tr>`).join('');
      return {
        prompt: `<p>Two production lines share ${cap} machine-hours per week in total. Regulation requires each line to run at least ${min} hours.</p>
        <table class="qtable"><thead><tr><th>Plan</th><th>Line 1 hours</th><th>Line 2 hours</th></tr></thead><tbody>${rows}</tbody></table>
        <p>Which plan is feasible?</p>`,
        answerType: 'mc', options: labels.slice(), correctAnswer: labels[good],
        hint: 'Test the binding constraint that eliminates the most options first.',
        approach: 'Constraint screening: apply each constraint in turn and discard infeasible options.',
        solution: `Only ${labels[good]} satisfies both the total cap of ${cap} hours and the ${min}-hour minimum on each line.`,
        recognitionTechnique: 'Other', commonTrap: 'Checking only the capacity constraint and forgetting the minimums.',
        tags: ['optimisation', 'mckinsey']
      };
    }
  });

  add({
    id: 'k_priority', topic: 'Structured Decisions', subtopic: 'Relevance ranking', difficulty: 3, targetTime: 120,
    build(r) {
      const scenarios = [
        {
          q: 'A retailer’s same-store sales fell 8% while total sales rose 3%. Which single piece of information is most useful for diagnosing the decline?',
          right: 'Change in traffic and average basket size at existing stores',
          wrong: ['Number of new stores opened this year', 'The CEO’s tenure', 'Total marketing spend across all channels']
        },
        {
          q: 'A manufacturer’s gross margin fell 4 points despite flat prices. Which analysis should come first?',
          right: 'Decomposition of unit cost into materials, labour and overhead',
          wrong: ['Competitor advertising spend', 'Customer satisfaction survey results', 'Board meeting minutes']
        },
        {
          q: 'A subscription business has rising revenue but falling profit. What should be examined first?',
          right: 'Customer acquisition cost relative to lifetime value',
          wrong: ['Office lease renewal terms', 'Website colour scheme', 'Number of employees hired last quarter']
        },
        {
          q: 'A logistics firm misses delivery windows only on Mondays. What is the most relevant next step?',
          right: 'Compare Monday capacity and inbound volume against other weekdays',
          wrong: ['Survey drivers about job satisfaction', 'Review the annual fuel contract', 'Benchmark competitor pricing']
        }
      ];
      const s = r.pick(scenarios);
      const opts = r.shuffle([s.right].concat(s.wrong));
      return {
        prompt: `<p>${s.q}</p>`,
        answerType: 'mc', options: opts, correctAnswer: s.right,
        hint: 'Pick the option that would change your conclusion depending on its value.',
        approach: 'Relevance test: an item is high-priority only if different values of it lead to different actions.',
        solution: `The decisive information is: ${s.right}. The other options are either downstream of the problem or cannot discriminate between competing explanations.`,
        recognitionTechnique: 'Other', commonTrap: 'Choosing information that is interesting but cannot change the diagnosis.',
        tags: ['mckinsey', 'structured']
      };
    }
  });

  /* ========================= BRAINTEASERS / INVARIANTS ===================== */

  add({
    id: 'bt_domino_parity', topic: 'Brainteasers', subtopic: 'Parity arguments', difficulty: 3, targetTime: 120,
    build(r) {
      const n = r.pick([6, 8, 10]);
      let r1 = r.int(0, n - 1), c1 = r.int(0, n - 1), r2, c2;
      do { r2 = r.int(0, n - 1); c2 = r.int(0, n - 1); } while (r2 === r1 && c2 === c1);
      const color1 = (r1 + c1) % 2, color2 = (r2 + c2) % 2;
      const sameColor = color1 === color2;
      const optYes = 'Yes — the tiling is always possible, because one square of each colour was removed, leaving equal counts of both colours';
      const optNo = 'No — the tiling is always impossible, because two squares of the same colour were removed, leaving unequal counts of the two colours';
      const optDepends = 'It depends on exactly which two squares were removed, not just their colour';
      const optUnknown = 'Cannot be determined without seeing the board';
      const correct = sameColor ? optNo : optYes;
      return {
        prompt: `Colour an ${n}×${n} board like a checkerboard. Two squares are removed: one at row ${r1 + 1}, column ${c1 + 1}, the other at row ${r2 + 1}, column ${c2 + 1}. Can the remaining ${n * n - 2} squares always be exactly covered by 1×2 dominoes?`,
        answerType: 'mc', options: r.shuffle([optYes, optNo, optDepends, optUnknown]), correctAnswer: correct,
        hint: 'Every domino covers exactly one black square and one white square — count how many of each colour remain.',
        approach: 'Parity/colouring argument: a domino always covers one square of each colour, so removing two same-coloured squares makes the two colour-counts unequal (impossible), while removing one of each colour keeps them equal — and a classical theorem guarantees a full tiling exists whenever the counts are equal.',
        solution: `Square 1 has colour (${r1 + 1}+${c1 + 1}) mod 2 = ${color1}; square 2 has colour (${r2 + 1}+${c2 + 1}) mod 2 = ${color2}. ${sameColor ? 'They are the SAME colour, so the two colour-counts on the remaining board are unequal — no tiling can exist.' : 'They are DIFFERENT colours, so the remaining board still has equal colour-counts, and a full domino tiling is always achievable.'}`,
        recognitionTechnique: 'Other', commonTrap: 'Trying to reason about the specific geometry of where the squares sit, when only their COLOUR (a single invariant) actually determines the answer.',
        tags: ['invariant', 'parity', 'coloring']
      };
    }
  });

  add({
    id: 'bt_coin_parity', topic: 'Brainteasers', subtopic: 'Invariants', difficulty: 3, targetTime: 120,
    build(r) {
      const n = r.pick([5, 6, 7, 8, 9]);
      const T0 = r.int(1, n);
      const reachable = T0 % 2 === 0;
      const optYes = 'Yes — reachable, because the number of tails is currently EVEN, and each move changes that count by 0 or ±2, preserving evenness all the way down to 0';
      const optNo = 'No — unreachable, because the number of tails is currently ODD, and each move changes that count by 0 or ±2, so an odd count can never become 0 (which is even)';
      const optAlways = 'Yes — reachable regardless of the starting number of tails';
      const optNever = 'No — unreachable regardless of the starting number of tails, since a flip only swaps which coins are tails';
      const correct = reachable ? optYes : optNo;
      return {
        prompt: `${n} coins are laid out, ${T0} showing tails and the rest heads. A move consists of choosing any two coins (not necessarily next to each other) and flipping both simultaneously. Is it possible to reach a state where all ${n} coins show heads, using this move repeatedly (possibly zero times)?`,
        answerType: 'mc', options: r.shuffle([optYes, optNo, optAlways, optNever]), correctAnswer: correct,
        hint: 'Track how the NUMBER of tails changes with each move — does it ever change by an odd amount?',
        approach: 'Invariant identification: flipping two coins changes the tails count by exactly 0 (one H, one T), +2 (both H→T), or −2 (both T→H) — so the PARITY of the tails count never changes, no matter which two coins are chosen.',
        solution: `The tails count starts at ${T0}, which is ${reachable ? 'EVEN' : 'ODD'}. Since every move changes the tails count by 0 or ±2, its parity is invariant. The target (all heads) has 0 tails, which is even. ${reachable ? 'Since the starting count is also even, the target is reachable.' : 'Since the starting count is odd, the target can never be reached.'}`,
        recognitionTechnique: 'Other', commonTrap: 'Trying to search through move sequences by trial and error instead of first identifying the invariant quantity (the parity of the tails count) that determines reachability instantly.',
        tags: ['invariant', 'parity']
      };
    }
  });

  global.QTL_GEN_APPLIED = G;
})(window);
