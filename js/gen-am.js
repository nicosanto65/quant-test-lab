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

  global.QTL_GEN_AM = G;
})(window);
