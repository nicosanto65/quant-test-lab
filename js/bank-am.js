/* QUANT TEST LAB — ASSET MANAGEMENT TRACK curated bank.
   Factor exposure/attribution, fixed income duration & convexity, and
   quantifiable macro relationships. Deliberately excludes stock pitches or
   open investment cases (needs a rubric engine this app does not have).
   Loaded after bank.js — appends into the SAME QTL_BANK.questions array via
   addMany(), tagged track:'am'. */
(function (global) {
  'use strict';

  const items = [

    /* ---------------------- FACTOR EXPOSURE ---------------------- */
    {
      id: 'am_c001', topic: 'Factor Exposure', subtopic: 'Return attribution', difficulty: 2, targetTime: 60,
      prompt: 'A stock has alpha of 0%, a market beta of 1.0, and the market returns 9%. What is the stock\'s expected return under this simple one-factor model?',
      answerType: 'numeric', correctAnswer: 9, tolerance: 0.1,
      hint: 'With alpha zero and beta exactly 1, the stock is expected to simply track the market.',
      approach: 'Total return = alpha + beta × market return.',
      solution: '0% + 1.0×9% = 9%.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Overcomplicating a case where beta is exactly 1 and alpha is exactly 0.',
      tags: ['factor-model']
    },
    {
      id: 'am_c002', topic: 'Factor Exposure', subtopic: 'Return attribution', difficulty: 3, targetTime: 90,
      prompt: 'A fund returned 14% while a simple factor model (market beta 1.1 on a 9% market return, plus a momentum factor exposure of 0.3 on a 4% momentum return) explains part of it. What is the fund\'s alpha?',
      answerType: 'numeric', correctAnswer: 2.9, tolerance: 0.1,
      hint: 'Add up the factor-explained pieces first, then subtract from the total.',
      approach: 'Alpha = total return − Σ(factor exposure × factor return).',
      solution: 'Factor-explained = (1.1×9%)+(0.3×4%) = 9.9%+1.2% = 11.1%. Alpha = 14%−11.1% = 2.9%.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Forgetting to include BOTH factor terms before subtracting from the total return.',
      tags: ['factor-model', 'alpha']
    },
    {
      id: 'am_c003', topic: 'Factor Exposure', subtopic: 'Active management', difficulty: 2, targetTime: 60,
      prompt: 'A portfolio returns 12%, its benchmark returns 9%, and tracking error is 3%. What is the information ratio?',
      answerType: 'numeric', correctAnswer: 1, tolerance: 0.02,
      hint: 'Active return divided by tracking error.',
      approach: 'Information ratio = (portfolio return − benchmark return) / tracking error.',
      solution: '(12−9)/3 = 1.0.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Using the risk-free rate instead of the benchmark return in the numerator.',
      tags: ['information-ratio']
    },
    {
      id: 'am_c004', topic: 'Factor Exposure', subtopic: 'Active management', difficulty: 3, targetTime: 75,
      prompt: 'Manager A: active return 4%, tracking error 2%. Manager B: active return 6%, tracking error 5%. Which manager has the higher information ratio?',
      answerType: 'mc', options: ['Manager A (IR=2.0)', 'Manager B (IR=1.2)', 'They are equal', 'Cannot be determined'], correctAnswer: 'Manager A (IR=2.0)',
      hint: 'Compute each information ratio separately before comparing.',
      approach: 'IR = active return / tracking error, for each manager.',
      solution: 'Manager A: 4/2 = 2.0. Manager B: 6/5 = 1.2. Manager A has the higher information ratio, despite Manager B\'s larger raw active return.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Comparing raw active returns instead of the risk-adjusted information ratio, which accounts for how consistently that outperformance was achieved.',
      tags: ['information-ratio']
    },
    {
      id: 'am_c005', topic: 'Factor Exposure', subtopic: 'Return attribution', difficulty: 4, targetTime: 90,
      prompt: 'A manager achieved a 15% return with market beta 1.6 on an 8% market return (no other factors). A second manager achieved the same 15% return with market beta 0.7 on the same market. By how many percentage points does the second manager\'s alpha exceed the first manager\'s?',
      answerType: 'numeric', correctAnswer: 7.2, tolerance: 0.15,
      hint: 'Compute each manager\'s alpha separately, then find the difference.',
      approach: 'Alpha = total return − (beta × market return), computed separately for each manager, then subtract.',
      solution: 'Manager 1 alpha = 15% − (1.6×8%) = 15%−12.8% = 2.2%. Manager 2 alpha = 15% − (0.7×8%) = 15%−5.6% = 9.4%. Difference = 9.4%−2.2% = 7.2 percentage points.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Comparing only the identical total returns and concluding both managers performed equally.',
      tags: ['factor-model', 'alpha']
    },
    {
      id: 'am_c006', topic: 'Factor Exposure', subtopic: 'Active management', difficulty: 3, targetTime: 75,
      prompt: 'A manager has an information ratio of 0.9 and an active return of 3.6%. What is the tracking error?',
      answerType: 'numeric', correctAnswer: 4, tolerance: 0.05,
      hint: 'Rearrange the information ratio formula to solve for the denominator.',
      approach: 'Tracking error = active return / information ratio.',
      solution: '3.6/0.9 = 4%.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Multiplying instead of dividing when solving for tracking error.',
      tags: ['information-ratio']
    },

    /* ---------------------- FIXED INCOME ---------------------- */
    {
      id: 'am_c007', topic: 'Fixed Income', subtopic: 'Duration', difficulty: 2, targetTime: 60,
      prompt: 'A bond has modified duration 4.5. Yields fall by 60 basis points. What is the approximate percentage price change?',
      answerType: 'numeric', correctAnswer: 2.7, tolerance: 0.05,
      hint: 'Falling yields mean rising prices — watch the sign.',
      approach: 'ΔP/P ≈ −modified duration × Δyield.',
      solution: '−4.5 × (−0.60%) = +2.7%.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Getting the sign backwards — falling yields should produce a price GAIN.',
      tags: ['duration']
    },
    {
      id: 'am_c008', topic: 'Fixed Income', subtopic: 'Duration', difficulty: 3, targetTime: 75,
      prompt: 'A bond trades at $100 with modified duration 8. Yields rise by 50 basis points. What is the approximate new price?',
      answerType: 'numeric', correctAnswer: 96, tolerance: 0.3,
      hint: 'Find the percentage price change first, then apply it to the starting price.',
      approach: 'ΔP/P ≈ −duration×Δy; new price = old price × (1+ΔP/P).',
      solution: 'ΔP/P ≈ −8×0.50% = −4%. New price ≈ 100×0.96 = $96.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Subtracting 4 dollars directly without checking that 4% of $100 happens to also be $4 — this shortcut fails for any starting price other than exactly 100.',
      tags: ['duration']
    },
    {
      id: 'am_c009', topic: 'Fixed Income', subtopic: 'Convexity', difficulty: 4, targetTime: 120,
      prompt: 'A bond has modified duration 6 and convexity 60. Yields fall by 150 basis points. Using the duration-plus-convexity approximation, what is the approximate percentage price change?',
      answerType: 'numeric', correctAnswer: 9.68, tolerance: 0.1,
      hint: 'Compute the duration term and the convexity term separately, then add them.',
      approach: 'ΔP/P ≈ −(duration×Δy) + ½×convexity×(Δy)².',
      solution: 'Duration term = −6×(−1.5%) = +9%. Convexity term = ½×60×(0.015)² = 30×0.000225 = 0.00675 = +0.675%. Total ≈ 9%+0.675% ≈ 9.68% (rounding).',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Forgetting the convexity term is ALWAYS positive (added), regardless of whether yields rose or fell, since it depends on the SQUARE of the yield change.',
      tags: ['convexity']
    },
    {
      id: 'am_c010', topic: 'Fixed Income', subtopic: 'Convexity', difficulty: 3, targetTime: 90,
      prompt: 'Bond A and Bond B have identical modified duration. Bond A has convexity 20; Bond B has convexity 80. For a large yield move in EITHER direction, which bond\'s actual price response is more favorable relative to the shared duration-only estimate?',
      answerType: 'mc', options: ['Bond A', 'Bond B', 'They are identical, since duration is the same', 'It depends on which direction yields move'], correctAnswer: 'Bond B',
      hint: 'The convexity term is always additive/favorable, and a larger convexity value means a larger favorable adjustment — in EITHER direction.',
      approach: 'A higher convexity term produces a larger favorable adjustment, regardless of the direction of the yield move.',
      solution: 'Bond B\'s higher convexity (80 vs 20) means a larger positive adjustment on top of the shared duration-only estimate, in BOTH the favorable and unfavorable yield-move scenarios, making it the more attractive bond, all else equal.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming higher convexity only helps in one direction (e.g. only when yields fall) — it helps in both, since the term depends on the squared yield change.',
      tags: ['convexity']
    },
    {
      id: 'am_c011', topic: 'Fixed Income', subtopic: 'Portfolio duration', difficulty: 2, targetTime: 60,
      prompt: 'A portfolio holds 50% in a bond with duration 3 and 50% in a bond with duration 9. What is the portfolio\'s duration?',
      answerType: 'numeric', correctAnswer: 6, tolerance: 0.05,
      hint: 'Weighted average, not a simple sum.',
      approach: 'Portfolio duration = Σ(weight × individual duration).',
      solution: '0.5×3 + 0.5×9 = 1.5+4.5 = 6.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Adding the two durations directly (3+9=12) instead of weighting them.',
      tags: ['duration', 'portfolio-construction']
    },
    {
      id: 'am_c012', topic: 'Fixed Income', subtopic: 'Portfolio duration', difficulty: 4, targetTime: 120,
      prompt: 'A manager wants a portfolio duration of exactly 4, using a short bond (duration 2) and a long bond (duration 10). What weight should go to the SHORT bond?',
      answerType: 'numeric', correctAnswer: 0.75, tolerance: 0.01,
      hint: 'Find the long-bond weight first, then subtract from 1 — or set up the equation directly for the short-bond weight.',
      approach: 'Solve w_short×2 + (1−w_short)×10 = 4 for w_short.',
      solution: 'w×2 + (1−w)×10 = 4 → 10 − 8w = 4 → 8w = 6 → w = 0.75. (Check: 0.75×2 + 0.25×10 = 1.5+2.5 = 4. ✓)',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Solving for the long-bond weight instead of the short-bond weight, which the question specifically asks for.',
      tags: ['duration', 'portfolio-construction']
    },
    {
      id: 'am_c013', topic: 'Fixed Income', subtopic: 'Duration', difficulty: 2, targetTime: 60,
      prompt: 'Two bonds have the same maturity, but Bond X has a much higher coupon rate than Bond Y. All else equal, which bond has the LOWER duration?',
      answerType: 'mc', options: ['Bond X (the higher-coupon bond)', 'Bond Y (the lower-coupon bond)', 'They must have identical duration', 'Coupon rate has no relationship to duration'], correctAnswer: 'Bond X (the higher-coupon bond)',
      hint: 'Duration is a weighted-average measure of when a bond\'s cash flows arrive — a higher coupon shifts more weight toward earlier payments.',
      approach: 'Higher coupon payments return more cash to the investor earlier, pulling the duration (weighted-average time to cash flows) down.',
      solution: 'A higher-coupon bond returns relatively more cash flow earlier (via larger coupon payments), which pulls its duration DOWN compared to a lower-coupon bond of the same maturity — duration is fundamentally a weighted-average timing measure, not just a maturity measure.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing duration with simple maturity — two bonds with identical maturities can have meaningfully different durations if their coupon rates differ.',
      tags: ['duration']
    },

    /* ---------------------- MACRO ---------------------- */
    {
      id: 'am_c014', topic: 'Macro', subtopic: 'Real vs nominal rates', difficulty: 2, targetTime: 45,
      prompt: 'Nominal rate is 5%, expected inflation is 2%. What is the approximate real rate?',
      answerType: 'numeric', correctAnswer: 3, tolerance: 0.1,
      hint: 'Subtract inflation from the nominal rate.',
      approach: 'Approximate Fisher relationship: real ≈ nominal − inflation.',
      solution: '5%−2% = 3%.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Adding instead of subtracting.',
      tags: ['fisher-equation']
    },
    {
      id: 'am_c015', topic: 'Macro', subtopic: 'Real vs nominal rates', difficulty: 3, targetTime: 60,
      prompt: 'An investor wants a real return of at least 2%, and expects inflation of 4% over the period. What is the minimum NOMINAL return they should require?',
      answerType: 'numeric', correctAnswer: 6, tolerance: 0.1,
      hint: 'Rearrange the Fisher approximation to solve for the nominal rate.',
      approach: 'Nominal ≈ real + inflation.',
      solution: '2%+4% = 6%.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Subtracting inflation instead of adding it when solving for the required nominal rate.',
      tags: ['fisher-equation']
    },
    {
      id: 'am_c016', topic: 'Macro', subtopic: 'Real vs nominal rates', difficulty: 3, targetTime: 75,
      prompt: 'Bond A offers a nominal 9% return in an environment with 6% expected inflation. Bond B offers a nominal 5% return in an environment with 1% expected inflation. Which bond offers the better approximate REAL return?',
      answerType: 'mc', options: ['Bond A (real ≈3%)', 'Bond B (real ≈4%)', 'They are identical in real terms', 'Cannot be compared without more information'], correctAnswer: 'Bond B (real ≈4%)',
      hint: 'Compute each bond\'s approximate real return separately before comparing.',
      approach: 'Real ≈ nominal − inflation, computed for each bond using its own inflation environment.',
      solution: 'Bond A: 9%−6% = 3% real. Bond B: 5%−1% = 4% real. Despite Bond A\'s higher nominal rate, Bond B offers the better real return.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Comparing the nominal rates directly (9% vs 5%) without adjusting each for its own inflation environment.',
      tags: ['fisher-equation']
    },
    {
      id: 'am_c017', topic: 'Macro', subtopic: 'Yield curve', difficulty: 2, targetTime: 45,
      prompt: 'The 2-year yield is 3.5% and the 10-year yield is 4.2%. What is the 10y-2y term spread, in percentage points?',
      answerType: 'numeric', correctAnswer: 0.7, tolerance: 0.02,
      hint: 'Long yield minus short yield.',
      approach: 'Term spread = long-maturity yield − short-maturity yield.',
      solution: '4.2%−3.5% = 0.7 percentage points.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Computing short minus long, which flips the sign.',
      tags: ['yield-curve']
    },
    {
      id: 'am_c018', topic: 'Macro', subtopic: 'Yield curve', difficulty: 2, targetTime: 60,
      prompt: 'The 2-year yield is 5.0% and the 10-year yield is 4.3%. What shape does this yield curve have?',
      answerType: 'mc', options: ['Normal (upward-sloping)', 'Inverted (downward-sloping)', 'Perfectly flat', 'Cannot be determined'], correctAnswer: 'Inverted (downward-sloping)',
      hint: 'Compare the short-maturity yield to the long-maturity yield directly.',
      approach: 'A curve is inverted when shorter-maturity yields exceed longer-maturity yields.',
      solution: 'The 2-year (5.0%) yields MORE than the 10-year (4.3%) — a negative term spread of −0.7 points, indicating an inverted curve.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Assuming the curve is always normal/upward-sloping without actually checking the specific yields given.',
      tags: ['yield-curve']
    },
    {
      id: 'am_c019', topic: 'Macro', subtopic: 'Yield curve', difficulty: 3, targetTime: 75,
      prompt: 'What has an inverted yield curve historically often been associated with, and how reliable is this signal?',
      answerType: 'mc', options: [
        'It guarantees a recession will occur within exactly 6 months, with no exceptions',
        'It has often preceded economic slowdowns and reflects markets expecting future rate cuts, but the relationship is not a certainty and is genuinely debated',
        'It has no historical association with anything macroeconomic',
        'It always indicates that inflation is about to rise sharply'
      ], correctAnswer: 'It has often preceded economic slowdowns and reflects markets expecting future rate cuts, but the relationship is not a certainty and is genuinely debated',
      hint: 'Be careful of options that overstate the certainty of this relationship.',
      approach: 'An inverted curve is a widely-watched historical pattern, not a guaranteed predictive rule.',
      solution: 'While an inverted curve has historically often preceded slowdowns and reflects rate-cut expectations, it is not a guaranteed or perfectly reliable predictor — the exact mechanism and reliability are genuinely debated among economists.',
      recognitionTechnique: 'Other', commonTrap: 'Overstating a historical association as an absolute guarantee, rather than treating it as one input among many.',
      tags: ['yield-curve']
    },
    {
      id: 'am_c020', topic: 'Macro', subtopic: 'Real vs nominal rates', difficulty: 2, targetTime: 45,
      prompt: 'Real rate is 1.5%, expected inflation is 3.5%. What is the approximate nominal rate?',
      answerType: 'numeric', correctAnswer: 5, tolerance: 0.1,
      hint: 'Add inflation back to the real rate.',
      approach: 'Nominal ≈ real + inflation.',
      solution: '1.5%+3.5% = 5%.',
      recognitionTechnique: 'Direct calculation', commonTrap: 'Subtracting inflation instead of adding it.',
      tags: ['fisher-equation']
    }
  ];

  items.forEach((q) => { q.track = 'am'; });
  global.QTL_BANK.addMany(items);
})(window);
