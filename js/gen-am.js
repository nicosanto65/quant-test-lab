/* QUANT TEST LAB — ASSET MANAGEMENT TRACK generators.
   Deliberately scoped to what has an exact, verifiable answer: factor
   exposure / return attribution, fixed income duration & convexity, and
   quantifiable macro relationships (Fisher equation, yield curve spreads).
   No stock pitches or open-ended investment cases — those need a rubric
   engine this app does not have yet. Builds on the existing quant-track
   Variance/Covariance/Sharpe-ratio concepts rather than repeating them.
   track:'am' throughout. */
(function (global) {
  'use strict';
  const U = global.QTL_UTIL;
  const { round } = U;
  const G = [];
  const add = (g) => { g.track = 'am'; G.push(g); };

  /* ======================= QUANT PORTFOLIO CONSTRUCTION ======================= */

  add({
    id: 'am_factor_return', topic: 'Factor Exposure', subtopic: 'Return attribution', difficulty: 3, targetTime: 90,
    build(r) {
      const alpha = r.pick([0.5, 1, 1.5, 2]);
      const bMkt = r.pick([0.8, 1, 1.1, 1.2]), fMkt = r.pick([6, 8, 10]);
      const bVal = r.pick([0.3, 0.5, -0.3]), fVal = r.pick([2, -1, 3]);
      const total = round(alpha + bMkt * fMkt + bVal * fVal, 3);
      return {
        prompt: `A stock's return is decomposed as: alpha ${alpha}%, market factor exposure (beta) ${bMkt} on a market factor return of ${fMkt}%, and value factor exposure ${bVal} on a value factor return of ${fVal}%. What is the stock's total return, in percent?`,
        answerType: 'numeric', correctAnswer: total, tolerance: 0.05,
        hint: 'Multiply each factor\'s exposure by that factor\'s own return, then add everything (including alpha) together.',
        approach: 'Linear factor model: total return = alpha + Σ(factor exposure × factor return).',
        solution: `Total = ${alpha}% + (${bMkt}×${fMkt}%) + (${bVal}×${fVal}%) = ${alpha}% + ${round(bMkt * fMkt, 3)}% + ${round(bVal * fVal, 3)}% = ${total}%.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Adding the raw factor returns directly instead of first scaling each one by its own exposure (beta/loading).',
        tags: ['factor-model']
      };
    }
  });

  add({
    id: 'am_alpha_isolate', topic: 'Factor Exposure', subtopic: 'Return attribution', difficulty: 3, targetTime: 90,
    build(r) {
      const totalReturn = r.pick([8, 10, 12, 14]);
      const bMkt = r.pick([0.9, 1, 1.1]), fMkt = r.pick([6, 7, 8]);
      const bSize = r.pick([0.4, 0.5, 0.6]), fSize = r.pick([2, 3]);
      const explained = round(bMkt * fMkt + bSize * fSize, 3);
      const alpha = round(totalReturn - explained, 3);
      return {
        prompt: `A portfolio returned ${totalReturn}% in total. Its market factor exposure is ${bMkt} on a market return of ${fMkt}%, and its size factor exposure is ${bSize} on a size factor return of ${fSize}%. What is the portfolio's alpha (the return NOT explained by these factors), in percent?`,
        answerType: 'numeric', correctAnswer: alpha, tolerance: 0.05,
        hint: 'Work out how much of the total return the factors explain first, then see what is left over.',
        approach: 'Alpha = total return − Σ(factor exposure × factor return), i.e. the residual after removing factor-explained return.',
        solution: `Factor-explained return = (${bMkt}×${fMkt}%) + (${bSize}×${fSize}%) = ${round(bMkt * fMkt, 3)}% + ${round(bSize * fSize, 3)}% = ${explained}%. Alpha = ${totalReturn}% − ${explained}% = ${alpha}%.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Treating the total return itself as alpha, without first subtracting the portion explained by factor exposures.',
        tags: ['factor-model', 'alpha']
      };
    }
  });

  add({
    id: 'am_info_ratio', topic: 'Factor Exposure', subtopic: 'Active management', difficulty: 3, targetTime: 90,
    build(r) {
      const portRet = r.pick([9, 11, 13, 15]), benchRet = r.pick([7, 8, 9, 10]);
      const trackingError = r.pick([3, 4, 5, 6]);
      const activeReturn = round(portRet - benchRet, 3);
      const ir = round(activeReturn / trackingError, 3);
      return {
        prompt: `A portfolio returns ${portRet}% while its benchmark returns ${benchRet}%. The tracking error (standard deviation of the return DIFFERENCE versus the benchmark) is ${trackingError}%. What is the information ratio?`,
        answerType: 'numeric', correctAnswer: ir, tolerance: 0.02,
        hint: 'The information ratio is structurally just like the Sharpe ratio, but measured relative to a benchmark instead of the risk-free rate.',
        approach: 'Information ratio = (portfolio return − benchmark return) / tracking error.',
        solution: `Active return = ${portRet}% − ${benchRet}% = ${activeReturn}%. Information ratio = ${activeReturn}/${trackingError} = ${ir}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Using the risk-free rate instead of the benchmark return, which would give a Sharpe ratio, not an information ratio — these measure different things.',
        tags: ['information-ratio', 'active-management']
      };
    }
  });

  add({
    id: 'am_tracking_error', topic: 'Factor Exposure', subtopic: 'Active management', difficulty: 4, targetTime: 120,
    build(r) {
      const ir = r.pick([0.4, 0.5, 0.6, 0.8]), activeReturn = r.pick([2, 3, 4]);
      const te = round(activeReturn / ir, 3);
      return {
        prompt: `A portfolio achieves an information ratio of ${ir} with an active return (portfolio minus benchmark) of ${activeReturn}%. What is its tracking error, in percent?`,
        answerType: 'numeric', correctAnswer: te, tolerance: 0.05,
        hint: 'Rearrange the information ratio formula to solve for the denominator.',
        approach: 'Tracking error = active return / information ratio.',
        solution: `TE = ${activeReturn}/${ir} = ${te}%.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Multiplying instead of dividing when rearranging the formula.',
        tags: ['information-ratio', 'tracking-error']
      };
    }
  });

  /* ============================== FIXED INCOME ============================== */

  add({
    id: 'am_duration_price', topic: 'Fixed Income', subtopic: 'Duration', difficulty: 2, targetTime: 75,
    build(r) {
      const duration = r.pick([3, 4, 5, 6, 7]), px = r.pick([95, 98, 100, 102, 105]);
      const dy = r.pick([0.25, 0.5, 0.75, 1]) / 100;
      const pctChange = round(-duration * dy * 100, 3);
      const newPx = round(px * (1 + pctChange / 100), 2);
      return {
        prompt: `A bond has modified duration ${duration} and currently trades at $${px}. If yields RISE by ${round(dy * 10000, 0)} basis points, what is the approximate new price?`,
        answerType: 'numeric', correctAnswer: newPx, tolerance: Math.max(0.15, Math.abs(newPx) * 0.003),
        hint: 'First find the approximate percentage price change, then apply it to the starting price.',
        approach: 'First-order duration approximation: ΔP/P ≈ −modified duration × Δyield.',
        solution: `ΔP/P ≈ −${duration} × ${round(dy * 100, 3)}% = ${pctChange}%. New price ≈ ${px} × (1 ${pctChange >= 0 ? '+' : ''}${round(pctChange / 100, 5)}) ≈ $${newPx}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Forgetting the negative sign — rising yields mean FALLING bond prices, an inverse relationship.',
        tags: ['duration']
      };
    }
  });

  add({
    id: 'am_convexity', topic: 'Fixed Income', subtopic: 'Convexity', difficulty: 4, targetTime: 120,
    build(r) {
      const duration = r.pick([5, 6, 7, 8]), convexity = r.pick([40, 60, 80, 100]);
      const dy = r.pick([1, 1.5, 2]) / 100;
      const durationTerm = -duration * dy;
      const convexityTerm = 0.5 * convexity * dy * dy;
      const pctChange = round((durationTerm + convexityTerm) * 100, 3);
      return {
        prompt: `A bond has modified duration ${duration} and convexity ${convexity}. Yields rise by ${round(dy * 10000, 0)} basis points. Using the duration-PLUS-convexity approximation, what is the approximate percentage price change?`,
        answerType: 'numeric', correctAnswer: pctChange, tolerance: 0.08,
        hint: 'The convexity term is always added, using half the convexity times the SQUARE of the yield change — and it partially offsets the duration term\'s effect for a large yield move.',
        approach: 'ΔP/P ≈ −(modified duration × Δy) + ½ × convexity × (Δy)².',
        solution: `Duration term = −${duration} × ${round(dy * 100, 3)}% = ${round(durationTerm * 100, 3)}%. Convexity term = ½ × ${convexity} × (${round(dy * 100, 3)}%)² = ${round(convexityTerm * 100, 3)}%. Total ≈ ${round(durationTerm * 100, 3)}% + ${round(convexityTerm * 100, 3)}% = ${pctChange}%.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Forgetting to square the yield change in the convexity term, or forgetting the ½ factor.',
        tags: ['convexity', 'duration']
      };
    }
  });

  add({
    id: 'am_portfolio_duration', topic: 'Fixed Income', subtopic: 'Portfolio duration', difficulty: 3, targetTime: 90,
    build(r) {
      const w1 = r.pick([0.3, 0.4, 0.5, 0.6]), d1 = r.pick([3, 4, 5]);
      const w2 = round(1 - w1, 2), d2 = r.pick([7, 8, 9, 10]);
      const portDur = round(w1 * d1 + w2 * d2, 3);
      return {
        prompt: `A bond portfolio holds ${round(w1 * 100, 0)}% in a bond with duration ${d1}, and ${round(w2 * 100, 0)}% in a bond with duration ${d2}. What is the portfolio's (weighted-average) duration?`,
        answerType: 'numeric', correctAnswer: portDur, tolerance: 0.03,
        hint: 'Portfolio duration is a value-weighted average, exactly like a weighted-average price or return.',
        approach: 'Portfolio duration = Σ(weight × individual bond duration).',
        solution: `${w1}×${d1} + ${w2}×${d2} = ${round(w1 * d1, 3)} + ${round(w2 * d2, 3)} = ${portDur}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Simply averaging the two durations (ignoring the weights) instead of weighting by position size.',
        tags: ['duration', 'portfolio-construction']
      };
    }
  });

  add({
    id: 'am_duration_target', topic: 'Fixed Income', subtopic: 'Portfolio duration', difficulty: 4, targetTime: 120,
    build(r) {
      const dShort = r.pick([2, 3]), dLong = r.pick([8, 9, 10]);
      const target = r.pick([5, 6, 7]);
      const wLong = round((target - dShort) / (dLong - dShort), 4);
      const wShort = round(1 - wLong, 4);
      return {
        prompt: `A manager wants a portfolio duration of exactly ${target}, using only a short bond (duration ${dShort}) and a long bond (duration ${dLong}). What WEIGHT should be allocated to the long bond (as a fraction of the portfolio, 0 to 1)?`,
        answerType: 'numeric', correctAnswer: wLong, tolerance: 0.005,
        hint: 'Set up the weighted-average duration equation and solve for the unknown weight.',
        approach: 'Solve w×D_long + (1−w)×D_short = target duration for w.',
        solution: `w×${dLong} + (1−w)×${dShort} = ${target}. w×(${dLong}−${dShort}) = ${target}−${dShort}. w = (${target}−${dShort})/(${dLong}−${dShort}) = ${wLong}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Setting up the equation backwards, solving for the short-bond weight instead of the long-bond weight (or vice versa).',
        tags: ['duration', 'portfolio-construction']
      };
    }
  });

  /* ==================================== MACRO ==================================== */

  add({
    id: 'am_fisher', topic: 'Macro', subtopic: 'Real vs nominal rates', difficulty: 2, targetTime: 60,
    build(r) {
      const nominal = r.pick([4, 5, 6, 7]), inflation = r.pick([2, 2.5, 3, 3.5]);
      const real = round(nominal - inflation, 3);
      const ask = r.pick(['real', 'nominal']);
      if (ask === 'real') {
        return {
          prompt: `The nominal interest rate is ${nominal}% and expected inflation is ${inflation}%. Using the simple (approximate) Fisher relationship, what is the real interest rate, in percent?`,
          answerType: 'numeric', correctAnswer: real, tolerance: 0.05,
          hint: 'The simple approximation just subtracts one from the other.',
          approach: 'Approximate Fisher equation: real rate ≈ nominal rate − inflation rate.',
          solution: `${nominal}% − ${inflation}% = ${real}%.`,
          recognitionTechnique: 'Direct calculation', commonTrap: 'Adding inflation instead of subtracting it.',
          tags: ['fisher-equation']
        };
      }
      return {
        prompt: `The real interest rate is ${real}% and expected inflation is ${inflation}%. Using the simple (approximate) Fisher relationship, what is the nominal interest rate, in percent?`,
        answerType: 'numeric', correctAnswer: nominal, tolerance: 0.05,
        hint: 'Rearrange the approximation to solve for the nominal rate.',
        approach: 'Approximate Fisher equation: nominal rate ≈ real rate + inflation rate.',
        solution: `${real}% + ${inflation}% = ${nominal}%.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Subtracting inflation instead of adding it back to recover the nominal rate.',
        tags: ['fisher-equation']
      };
    }
  });

  add({
    id: 'am_yield_curve', topic: 'Macro', subtopic: 'Yield curve', difficulty: 2, targetTime: 60,
    build(r) {
      const short = r.pick([2, 3, 4, 5]), longAdj = r.pick([-1.5, -0.5, 0.5, 1, 1.5, 2]);
      const long = round(short + longAdj, 2);
      const spread = round(long - short, 3);
      const shape = spread > 0.05 ? 'normal (upward-sloping)' : spread < -0.05 ? 'inverted (downward-sloping)' : 'flat';
      return {
        prompt: `The 2-year government yield is ${short}% and the 10-year government yield is ${long}%. What is the 10-year minus 2-year term spread, in percentage points, and how would the resulting curve shape be described?`,
        answerType: 'numeric', correctAnswer: spread, tolerance: 0.02,
        hint: 'Spread = longer-maturity yield minus shorter-maturity yield. A negative spread means shorter-term yields exceed longer-term yields.',
        approach: 'Term spread = long-maturity yield − short-maturity yield; the sign determines the curve shape.',
        solution: `Spread = ${long}% − ${short}% = ${spread} percentage points. Since the spread is ${spread > 0 ? 'positive' : spread < 0 ? 'negative' : 'zero'}, the curve is ${shape}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Computing short minus long instead of long minus short, which flips the sign and the resulting curve-shape interpretation.',
        tags: ['yield-curve']
      };
    }
  });

  /* ============================ ALTERNATIVES / TIPS ============================ */

  add({
    id: 'am_tips_coupon', topic: 'Fixed Income', subtopic: 'TIPS', difficulty: 2, targetTime: 75,
    build(r) {
      const par = r.pick([1000, 1500, 2000, 2500]);
      const couponRate = r.pick([1, 1.5, 2, 2.5, 3]);
      const cpi = r.pick([1.5, 2, 2.5, 3, 3.5, 4]);
      const adjPrincipal = round(par * (1 + cpi / 100), 2);
      const coupon = round(adjPrincipal * couponRate / 100, 2);
      const ask = r.pick(['principal', 'coupon']);
      if (ask === 'principal') {
        return {
          prompt: `A TIPS bond has an original par value of $${par} and a ${couponRate}% coupon rate. Cumulative CPI inflation over the period is ${cpi}%. What is the inflation-adjusted principal, in dollars?`,
          answerType: 'numeric', correctAnswer: adjPrincipal, tolerance: Math.max(0.5, adjPrincipal * 0.002),
          hint: 'Adjusted principal = original par × (1 + cumulative CPI increase).',
          approach: 'Apply the CPI adjustment directly to the original par value.',
          solution: `Adjusted principal = ${par} × (1 + ${cpi}%) = ${par} × ${round(1 + cpi / 100, 4)} = $${adjPrincipal}.`,
          recognitionTechnique: 'Direct calculation', commonTrap: 'Forgetting to convert the CPI percentage into a decimal multiplier before applying it.',
          tags: ['tips']
        };
      }
      return {
        prompt: `A TIPS bond has an original par value of $${par} and a ${couponRate}% coupon rate. Cumulative CPI inflation over the period is ${cpi}%. What is the coupon payment, in dollars?`,
        answerType: 'numeric', correctAnswer: coupon, tolerance: Math.max(0.3, coupon * 0.005),
        hint: 'First adjust the principal for inflation, then apply the coupon rate to the ADJUSTED (not original) principal.',
        approach: 'Adjusted principal = par × (1+CPI). Coupon = coupon rate × adjusted principal.',
        solution: `Adjusted principal = ${par} × (1+${cpi}%) = $${adjPrincipal}. Coupon = ${couponRate}% × ${adjPrincipal} = $${coupon}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Applying the coupon rate to the original, un-adjusted par value instead of the inflation-adjusted principal.',
        tags: ['tips']
      };
    }
  });

  add({
    id: 'am_sector_macro', topic: 'Equities & Market Knowledge', subtopic: 'Sector rotation', difficulty: 3, targetTime: 90,
    build(r) {
      const scenarios = [
        {
          name: 'high inflation',
          winner: 'Energy and materials (commodity-linked revenue gives natural pricing power)',
          distractors: ['Consumer discretionary (price-sensitive customers cut back first)', 'Growth technology (higher discount rate hurts far-future cash flows)', 'Long-duration nominal bonds (fixed coupons lose real value)']
        },
        {
          name: 'high interest rates',
          winner: 'Banks (net interest margin typically widens)',
          distractors: ['Utilities (act as bond proxies, losing appeal versus now-higher yields)', 'REITs (act as bond proxies, losing appeal versus now-higher yields)', 'Growth technology (higher discount rate hurts far-future cash flows)']
        },
        {
          name: 'a recession',
          winner: 'Consumer staples (inelastic, necessity-driven demand)',
          distractors: ['Financials (rising credit losses)', 'Industrials (capital expenditure cuts)', 'Consumer discretionary (pulled-back discretionary spending)']
        },
        {
          name: 'a sharply strengthening domestic currency',
          winner: 'Domestically-focused companies with minimal foreign revenue',
          distractors: ['Multinational exporters (translation losses plus reduced competitiveness abroad)', 'Companies with heavy foreign-currency revenue exposure', 'Export-oriented manufacturers']
        }
      ];
      const scenario = r.pick(scenarios);
      const options = r.shuffle([scenario.winner, ...scenario.distractors]);
      return {
        prompt: `Under a macro regime of ${scenario.name}, which of these sectors/company types is MOST LIKELY to benefit?`,
        answerType: 'mc', options, correctAnswer: scenario.winner,
        hint: 'Ask: does this sector\'s demand hold up, and is its cost structure or discount rate directly squeezed by this specific macro force?',
        approach: 'Identify the sector whose revenue or cost structure is structurally aligned with, rather than squeezed by, this specific macro regime.',
        solution: `Under ${scenario.name}, "${scenario.winner}" is the sector most likely to benefit — its revenue or cost structure is structurally aligned with this specific macro force, unlike the other options listed, which face a direct headwind from it.`,
        recognitionTechnique: 'Other', commonTrap: 'Memorizing a sector\'s typical direction without understanding the underlying economic mechanism connecting it to this specific macro regime.',
        tags: ['sector-rotation']
      };
    }
  });

  add({
    id: 'am_yield_curve_signal', topic: 'Macro', subtopic: 'Yield curve', difficulty: 2, targetTime: 60,
    build(r) {
      const shapes = [
        {
          name: 'normal (upward-sloping)',
          implication: 'This is the typical, historically most common shape — investors demand extra compensation for locking up money longer; it does not by itself signal anything unusual about the economic cycle'
        },
        {
          name: 'inverted (downward-sloping)',
          implication: 'Historically often associated with markets expecting future rate cuts, and has frequently preceded economic slowdowns, though the relationship is not a certainty and is genuinely debated'
        },
        {
          name: 'flat',
          implication: 'Suggests the market is genuinely uncertain about, or in transition regarding, the future path of growth and interest rates'
        }
      ];
      const shape = r.pick(shapes);
      const wrongs = [
        'It guarantees a recession will occur within exactly 6 months, with no exceptions',
        'It has no historical association with anything macroeconomic whatsoever',
        'It always indicates that inflation is about to rise sharply'
      ];
      const options = r.shuffle([shape.implication, ...wrongs]);
      return {
        prompt: `The yield curve currently has a ${shape.name} shape. What does this typically imply about market expectations for the economic cycle?`,
        answerType: 'mc', options, correctAnswer: shape.implication,
        hint: 'Be wary of any option phrased as an absolute guarantee — real macro signals are rarely certainties.',
        approach: 'Match the curve shape to its historically-observed, appropriately-hedged implication.',
        solution: `A ${shape.name} curve: ${shape.implication}.`,
        recognitionTechnique: 'Other', commonTrap: 'Treating a historical tendency as an absolute, guaranteed prediction.',
        tags: ['yield-curve']
      };
    }
  });

  add({
    id: 'am_asset_allocation', topic: 'Portfolio & Client Management', subtopic: 'Constraints & allocation', difficulty: 3, targetTime: 90,
    build(r) {
      const profiles = [
        {
          desc: 'a pension fund with large, predictable annual benefit payments',
          correct: 'Majority in investment-grade bonds structured to match the payment schedule, a meaningful equity allocation for growth, and only a small alternatives sleeve'
        },
        {
          desc: 'a university endowment with an effectively perpetual horizon and a smooth, trailing-average spending rule',
          correct: 'A large allocation to illiquid alternatives (private equity, hedge funds, real assets) alongside global equities, since near-term liquidity needs are minimal'
        },
        {
          desc: 'a retired HNWI client who is withdrawing from the portfolio, prioritizing income and capital preservation',
          correct: 'A meaningful allocation to shorter/medium-duration bonds and quality dividend-paying equities, plus a cash reserve to cover near-term spending'
        }
      ];
      const profile = r.pick(profiles);
      const others = profiles.filter((p) => p !== profile).map((p) => p.correct);
      const genericWrong = 'An all-equity, maximum-growth allocation regardless of liquidity needs or time horizon';
      const options = r.shuffle([profile.correct, ...others, genericWrong]);
      return {
        prompt: `Which allocation approach best fits ${profile.desc}?`,
        answerType: 'mc', options, correctAnswer: profile.correct,
        hint: 'Start from the client\'s liquidity needs, time horizon, and liability structure before picking an allocation.',
        approach: 'Match the allocation to this client\'s specific constraints (liquidity needs, horizon, liability structure).',
        solution: `For ${profile.desc}, the best-fitting approach is: ${profile.correct} — directly matching this client\'s specific liquidity needs, time horizon, and liability structure.`,
        recognitionTechnique: 'Other', commonTrap: 'Applying a generic "textbook" allocation without first considering this client\'s own specific constraints.',
        tags: ['portfolio-construction']
      };
    }
  });

  add({
    id: 'am_var_interpretation', topic: 'Portfolio & Client Management', subtopic: 'VaR & stress testing', difficulty: 2, targetTime: 60,
    build(r) {
      const amt = r.pick([1, 2, 3, 4, 5, 8, 10]);
      const conf = r.pick([90, 95, 99]);
      const badPct = 100 - conf;
      const correct = `The portfolio is expected to lose no more than $${amt}m on ${conf}% of days, implying it could lose MORE than $${amt}m on the remaining ${badPct}% of days`;
      const wrongs = [
        `The portfolio can never lose more than $${amt}m under any circumstances`,
        `The portfolio is guaranteed to lose exactly $${amt}m on ${badPct}% of days`,
        `$${amt}m is the portfolio's average daily gain or loss, unrelated to any confidence level`
      ];
      const options = r.shuffle([correct, ...wrongs]);
      return {
        prompt: `A portfolio has a 1-day ${conf}% VaR of $${amt}m. What does this specifically mean?`,
        answerType: 'mc', options, correctAnswer: correct,
        hint: 'VaR states a probabilistic threshold, not an absolute ceiling or a guarantee.',
        approach: 'VaR describes the loss threshold not expected to be exceeded on (confidence%) of days.',
        solution: `A ${conf}% VaR of $${amt}m means the portfolio is expected to lose no more than $${amt}m on ${conf}% of days — implying it could lose more on the remaining ${badPct}% of days. It is a probabilistic threshold, not an absolute ceiling or a guarantee of any specific loss.`,
        recognitionTechnique: 'Other', commonTrap: 'Treating VaR as a hard ceiling on possible losses, or as a guarantee of a specific loss on the "bad" days.',
        tags: ['var']
      };
    }
  });

  add({
    id: 'am_fx_parity', topic: 'Economics, Trade & Macro', subtopic: 'FX & carry trade', difficulty: 3, targetTime: 90,
    build(r) {
      const domesticRate = r.pick([2, 3, 4, 5]);
      const foreignRate = r.pick([1, 2, 3, 6, 7, 8]);
      const spot = r.pick([1.05, 1.10, 1.15, 1.20, 1.30]);
      const forward = round(spot * (1 + domesticRate / 100) / (1 + foreignRate / 100), 4);
      return {
        prompt: `Domestic 1-year interest rate is ${domesticRate}%, foreign 1-year interest rate is ${foreignRate}%, and the spot exchange rate is ${spot} (domestic currency per foreign currency unit). Using covered interest rate parity, what is the approximate 1-year forward rate?`,
        answerType: 'numeric', correctAnswer: forward, tolerance: Math.max(0.002, forward * 0.002),
        hint: 'Forward = Spot × (1+domestic rate)/(1+foreign rate).',
        approach: 'Apply the covered interest rate parity formula directly.',
        solution: `Forward = ${spot} × (1+${domesticRate}%)/(1+${foreignRate}%) = ${spot} × ${round(1 + domesticRate / 100, 4)}/${round(1 + foreignRate / 100, 4)} = ${forward}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Inverting the ratio (foreign rate over domestic rate) instead of domestic over foreign.',
        tags: ['covered-interest-parity', 'fx']
      };
    }
  });

  global.QTL_GEN_AM = G;
})(window);
