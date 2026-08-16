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
    },

    /* ---------------------- PORTFOLIO CONSTRUCTION FROM CONSTRAINTS ---------------------- */
    {
      id: 'am_c021', topic: 'Portfolio & Client Management', subtopic: 'Constraints & allocation', difficulty: 2, targetTime: 60,
      prompt: 'What is the correct ORDER of the portfolio construction process?',
      answerType: 'mc', options: ['Pick attractive assets first, then check if they fit any constraints', 'Gather constraints first, determine the required return, then build an allocation that fits inside those constraints', 'Determine required return first, ignoring constraints entirely', 'There is no meaningful order — all steps happen simultaneously with no priority'], correctAnswer: 'Gather constraints first, determine the required return, then build an allocation that fits inside those constraints',
      hint: 'Constraints define the boundaries the portfolio must respect.',
      approach: 'The PM process is constraints-first, not asset-first.',
      solution: 'Constraints (liquidity, horizon, risk tolerance, restrictions, liability structure) must be gathered first, since they define the boundaries the portfolio must operate inside; only then does the PM determine the required return and build an allocation to achieve it within those boundaries.',
      recognitionTechnique: 'Other', commonTrap: 'Starting from attractive-looking assets rather than the client\'s own specific constraints.',
      tags: ['portfolio-construction']
    },
    {
      id: 'am_c022', topic: 'Portfolio & Client Management', subtopic: 'Constraints & allocation', difficulty: 2, targetTime: 60,
      prompt: 'A pension fund must pay $50m in predictable annual benefits. Why does this typically drive a MAJORITY allocation to investment-grade bonds rather than equities?',
      answerType: 'mc', options: ['Bonds always have the highest expected return', 'The fund\'s liquidity needs are high and recurring, and bonds can be structured to reliably generate the predictable cash flows needed to meet those payments', 'Equities are illegal for pension funds to hold', 'This allocation has nothing to do with the fund\'s liabilities'], correctAnswer: 'The fund\'s liquidity needs are high and recurring, and bonds can be structured to reliably generate the predictable cash flows needed to meet those payments',
      hint: 'Think about what asset class best matches a predictable, recurring cash need.',
      approach: 'Bonds\' scheduled cash flows directly match the fund\'s recurring liquidity need.',
      solution: 'Bonds\' scheduled, more predictable cash flows directly match the fund\'s need for reliable, recurring liquidity to pay benefits — a direct application of matching asset structure to liability structure.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming allocation decisions are made purely to maximize expected return, ignoring liquidity needs.',
      tags: ['portfolio-construction']
    },
    {
      id: 'am_c023', topic: 'Portfolio & Client Management', subtopic: 'Constraints & allocation', difficulty: 3, targetTime: 90,
      prompt: 'A retired HNWI client has a 25-year remaining time horizon, yet a wealth manager still recommends a meaningful cash reserve and a lower-beta equity tilt rather than an aggressive growth allocation. Why doesn\'t the long horizon alone justify a more aggressive allocation?',
      answerType: 'mc', options: ['A long horizon always means the most aggressive allocation is appropriate', 'The client is WITHDRAWING (not contributing), making them vulnerable to sequence-of-returns risk — a drawdown right before or during withdrawals can lock in permanent losses, lowering effective risk capacity below what raw horizon alone suggests', 'Cash reserves are never appropriate for any retired client', 'Dividend-paying stocks are always lower-returning than growth stocks with no other tradeoff'], correctAnswer: 'The client is WITHDRAWING (not contributing), making them vulnerable to sequence-of-returns risk — a drawdown right before or during withdrawals can lock in permanent losses, lowering effective risk capacity below what raw horizon alone suggests',
      hint: 'Consider the difference between someone still contributing and someone now withdrawing.',
      approach: 'Withdrawal-phase clients face sequence-of-returns risk, distinct from raw horizon length.',
      solution: 'Withdrawal-phase clients face sequence-of-returns risk — the same average return earned in a different order, with losses concentrated early during withdrawals, can leave a materially worse outcome — which lowers effective risk capacity independent of the number of years in the horizon.',
      recognitionTechnique: 'Other', commonTrap: 'Equating a long time horizon with high risk capacity regardless of whether the client is contributing or withdrawing.',
      tags: ['portfolio-construction', 'sequence-of-returns']
    },

    /* ---------------------- PENSION VS ENDOWMENT ---------------------- */
    {
      id: 'am_c024', topic: 'Portfolio & Client Management', subtopic: 'Pension vs endowment', difficulty: 2, targetTime: 60,
      prompt: 'What happens if a pension fund\'s ACTUAL investment return consistently falls below its actuarial ASSUMED rate of return?',
      answerType: 'mc', options: ['Nothing — the assumed rate is purely symbolic with no consequence', 'A funding gap opens and widens over time, eventually requiring larger contributions or resulting in a deteriorating funded ratio', 'The fund automatically raises its assumed rate to match', 'This situation is legally impossible'], correctAnswer: 'A funding gap opens and widens over time, eventually requiring larger contributions or resulting in a deteriorating funded ratio',
      hint: 'The assumed rate is used to calculate how much must be contributed today.',
      approach: 'Underperforming the assumed rate creates a real, growing shortfall over time.',
      solution: 'The assumed rate is used to calculate how much needs to be contributed today to cover future promised benefits — persistently underperforming it creates a real, growing shortfall requiring larger contributions or a deteriorating funded ratio.',
      recognitionTechnique: 'Other', commonTrap: 'Treating the actuarial assumed rate as a purely symbolic figure with no real financial consequence.',
      tags: ['pension', 'alm']
    },
    {
      id: 'am_c025', topic: 'Portfolio & Client Management', subtopic: 'Pension vs endowment', difficulty: 3, targetTime: 90,
      prompt: 'Why can a university endowment typically tolerate a much larger allocation to illiquid alternatives (PE, hedge funds, real assets) than a pension fund with near-term payment obligations?',
      answerType: 'mc', options: ['Endowments are legally required to hold alternatives', 'The endowment has no fixed, calculable near-term liability like the pension fund\'s benefit payments — its smooth spending-rate rule creates far less rigid liquidity pressure', 'Pension funds are legally prohibited from holding any alternatives', 'There is no real difference in liquidity needs between the two'], correctAnswer: 'The endowment has no fixed, calculable near-term liability like the pension fund\'s benefit payments — its smooth spending-rate rule creates far less rigid liquidity pressure',
      hint: 'Compare the endowment\'s spending rule to the pension fund\'s payment obligations.',
      approach: 'The absence of a concrete near-term liability is the real driver of the endowment\'s greater illiquidity tolerance.',
      solution: 'The endowment\'s smooth, trailing-average spending rule creates far less rigid liquidity pressure than the pension fund\'s recurring, calculable benefit payments, directly supporting a larger illiquid alternatives allocation.',
      recognitionTechnique: 'Other', commonTrap: 'Attributing the difference purely to "long horizon" without identifying the real driver — liability structure and liquidity pressure.',
      tags: ['pension', 'endowment']
    },
    {
      id: 'am_c026', topic: 'Portfolio & Client Management', subtopic: 'Pension vs endowment', difficulty: 3, targetTime: 90,
      prompt: 'The Yale/Swensen model\'s heavy allocation to illiquid alternatives worked well for Yale over long periods. What is the key underlying assumption that, if it breaks, reveals a genuine risk of this model?',
      answerType: 'mc', options: ['That alternatives always outperform public markets with no exceptions', 'That the endowment will not need a large, unplanned amount of near-term cash — if this assumption breaks (e.g., during a crisis), illiquid holdings may be difficult to sell quickly or favorably exactly when cash is needed most', 'That interest rates will never change', 'That the endowment has no board oversight'], correctAnswer: 'That the endowment will not need a large, unplanned amount of near-term cash — if this assumption breaks (e.g., during a crisis), illiquid holdings may be difficult to sell quickly or favorably exactly when cash is needed most',
      hint: 'Consider what happens if the endowment unexpectedly needs cash during a downturn.',
      approach: 'The model\'s success depends on genuinely not needing large unplanned liquidity.',
      solution: 'The model\'s success depends on the endowment genuinely not needing large unplanned liquidity — an unexpected need during a crisis, when illiquid assets are hardest to sell favorably, is the real risk this reveals.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming a historically successful model carries no residual risk under any circumstances.',
      tags: ['yale-model', 'endowment']
    },

    /* ---------------------- MANAGING DRAWDOWNS ---------------------- */
    {
      id: 'am_c027', topic: 'Portfolio & Client Management', subtopic: 'Managing drawdowns', difficulty: 2, targetTime: 60,
      prompt: 'What is the key difference between an "unrealized" (paper) loss and a "realized" loss?',
      answerType: 'mc', options: ['They are the same thing under a different name', 'An unrealized loss is a decline in value on an asset still held (reversible if the price recovers); a realized loss is locked in permanently by actually selling at the lower price', 'A realized loss only applies to bonds, never stocks', 'An unrealized loss is always larger than a realized loss'], correctAnswer: 'An unrealized loss is a decline in value on an asset still held (reversible if the price recovers); a realized loss is locked in permanently by actually selling at the lower price',
      hint: 'Think about reversibility.',
      approach: 'The distinction is whether the loss can still recover.',
      solution: 'The critical distinction is reversibility: a paper loss can still recover while the asset is held, but selling converts it into a permanent, locked-in loss.',
      recognitionTechnique: 'Other', commonTrap: 'Treating paper losses and realized losses as economically identical.',
      tags: ['drawdown-management']
    },
    {
      id: 'am_c028', topic: 'Portfolio & Client Management', subtopic: 'Managing drawdowns', difficulty: 2, targetTime: 60,
      prompt: 'A portfolio has drifted from its 60/40 target to 48% equity / 52% bond after a crash. What does rebalancing back to 60/40 require doing?',
      answerType: 'mc', options: ['Selling equities and buying more bonds', 'Selling some bonds and buying more (now cheaper) equities, restoring the original target weights', 'Selling the entire portfolio and moving to cash', 'Doing nothing, since 48/52 is close enough to 60/40'], correctAnswer: 'Selling some bonds and buying more (now cheaper) equities, restoring the original target weights',
      hint: 'Restore the target by trimming the now-oversized position.',
      approach: 'Rebalancing sells the now-overweight asset and buys the now-underweight one.',
      solution: 'Restoring the target requires trimming the now-oversized bond position and adding to the now-undersized, relatively cheaper equity position.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming rebalancing means selling the asset class that fell, rather than buying more of it.',
      tags: ['rebalancing']
    },
    {
      id: 'am_c029', topic: 'Portfolio & Client Management', subtopic: 'Managing drawdowns', difficulty: 3, targetTime: 90,
      prompt: 'Why is rebalancing back to a previously agreed target allocation during a crash fundamentally different from telling a client "I think the market is about to bottom, let\'s buy more now"?',
      answerType: 'mc', options: ['They are functionally identical actions with no meaningful difference', 'Rebalancing to a pre-agreed target requires no new prediction about future market direction, while a "buy the bottom" call is an active, uncertain market-timing judgment', 'Rebalancing is always illegal for a fiduciary advisor to recommend', 'Only the second statement is ever appropriate to say to a client'], correctAnswer: 'Rebalancing to a pre-agreed target requires no new prediction about future market direction, while a "buy the bottom" call is an active, uncertain market-timing judgment',
      hint: 'Think about whether either action requires predicting the market\'s future direction.',
      approach: 'Rebalancing restores an agreed target; it does not predict where markets go next.',
      solution: 'Rebalancing rests on restoring an already-agreed risk level using a pre-established rule, not on a fresh, uncertain prediction of where markets are headed next — a meaningfully more defensible action than market timing.',
      recognitionTechnique: 'Other', commonTrap: 'Conflating disciplined rebalancing with speculative market-timing calls.',
      tags: ['rebalancing', 'client-communication']
    },

    /* ---------------------- FIVE RISK CATEGORIES ---------------------- */
    {
      id: 'am_c030', topic: 'Portfolio & Client Management', subtopic: 'Risk categories', difficulty: 2, targetTime: 60,
      prompt: 'A stock trades with a wide bid-ask spread and low average daily volume. Which risk category does this primarily signal, and how would a PM typically respond?',
      answerType: 'mc', options: ['Market risk; the PM would reduce the portfolio\'s beta', 'Liquidity risk; the PM would typically size the position more conservatively relative to typical trading volume', 'Credit risk; the PM would buy credit default swaps', 'Currency risk; the PM would use FX forwards'], correctAnswer: 'Liquidity risk; the PM would typically size the position more conservatively relative to typical trading volume',
      hint: 'A wide spread and thin volume are classic signals of one specific risk category.',
      approach: 'Liquidity risk is measured by bid-ask spread and volume, managed via position sizing.',
      solution: 'A wide spread and thin volume are the classic signals of liquidity risk, typically managed through prudent position sizing rather than hedging instruments meant for other risk categories.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing liquidity risk with market risk or applying the wrong risk category\'s hedging tool.',
      tags: ['liquidity-risk']
    },
    {
      id: 'am_c031', topic: 'Portfolio & Client Management', subtopic: 'Risk categories', difficulty: 2, targetTime: 60,
      prompt: 'What does a "credit spread" measure?',
      answerType: 'mc', options: ['A stock\'s sensitivity to the overall market', 'The extra yield a bond offers over an equivalent-maturity risk-free government bond, compensating for default/downgrade risk', 'The bid-ask spread of a stock', 'The exposure of a portfolio to a foreign currency'], correctAnswer: 'The extra yield a bond offers over an equivalent-maturity risk-free government bond, compensating for default/downgrade risk',
      hint: 'Credit spread isolates one specific type of compensation.',
      approach: 'Credit spread compensates for issuer credit risk specifically.',
      solution: 'Credit spread specifically isolates the extra yield compensating investors for the issuer\'s credit (default/downgrade) risk, beyond the risk-free rate.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing credit spread with bid-ask spread or general market beta.',
      tags: ['credit-risk']
    },
    {
      id: 'am_c032', topic: 'Portfolio & Client Management', subtopic: 'Risk categories', difficulty: 3, targetTime: 90,
      prompt: 'A US fund holds European equities and hedges the EUR/USD currency exposure using FX forwards. If the euro subsequently APPRECIATES against the dollar, what happens to the fund\'s realized return from that currency move?',
      answerType: 'mc', options: ['The fund fully captures the currency appreciation on top of its equity return', 'The fund largely gives up the currency-driven upside, since the hedge was designed to remove currency exposure (both downside and upside) in exchange for isolating the equity return', 'Currency hedging always increases returns regardless of which direction the currency moves', 'The hedge has no effect on the fund\'s return in any scenario'], correctAnswer: 'The fund largely gives up the currency-driven upside, since the hedge was designed to remove currency exposure (both downside and upside) in exchange for isolating the equity return',
      hint: 'A currency hedge removes exposure symmetrically.',
      approach: 'Hedging removes both downside and upside currency exposure.',
      solution: 'A currency hedge removes exposure in BOTH directions — it protects against depreciation but also gives up any benefit from an unexpected appreciation.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming a hedge only removes downside risk without also giving up upside.',
      tags: ['currency-risk']
    },

    /* ---------------------- VAR, CVAR, STRESS TESTING ---------------------- */
    {
      id: 'am_c033', topic: 'Portfolio & Client Management', subtopic: 'VaR & stress testing', difficulty: 2, targetTime: 60,
      prompt: 'A portfolio has a 1-day 95% VaR of $4 million. What does this specifically mean?',
      answerType: 'mc', options: ['The portfolio can never lose more than $4 million under any circumstances', 'The portfolio is expected to lose no more than $4 million on 95% of days, implying it could lose more on the remaining 5%', 'The portfolio will definitely lose exactly $4 million tomorrow', 'VaR measures the portfolio\'s average annual return'], correctAnswer: 'The portfolio is expected to lose no more than $4 million on 95% of days, implying it could lose more on the remaining 5%',
      hint: 'VaR states a threshold associated with a confidence level, not an absolute ceiling.',
      approach: 'VaR is a probabilistic threshold, not a guarantee.',
      solution: 'VaR states a threshold associated with a specific confidence level, not an absolute ceiling on possible losses — on the remaining 5% of days, losses could exceed the stated figure.',
      recognitionTechnique: 'Other', commonTrap: 'Treating VaR as a hard ceiling on possible losses rather than a probabilistic threshold.',
      tags: ['var']
    },
    {
      id: 'am_c034', topic: 'Portfolio & Client Management', subtopic: 'VaR & stress testing', difficulty: 3, targetTime: 90,
      prompt: 'Two portfolios have identical 1-day 95% VaR, but Portfolio X has a much higher expected shortfall than Portfolio Y. What does this indicate?',
      answerType: 'mc', options: ['The two portfolios are equally risky in every respect', 'Portfolio X has a far more severe potential tail outcome — on its worst days, it tends to lose much more than the shared VaR threshold would suggest', 'This scenario cannot actually occur — identical VaR always means identical expected shortfall', 'Portfolio Y must have a higher total return'], correctAnswer: 'Portfolio X has a far more severe potential tail outcome — on its worst days, it tends to lose much more than the shared VaR threshold would suggest',
      hint: 'Expected shortfall reveals something VaR alone cannot.',
      approach: 'Expected shortfall measures average loss beyond the VaR threshold.',
      solution: 'Identical VaR thresholds can mask very different tail severities, which expected shortfall specifically reveals by measuring the average loss beyond the threshold.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming identical VaR means identical overall risk.',
      tags: ['expected-shortfall', 'var']
    },
    {
      id: 'am_c035', topic: 'Portfolio & Client Management', subtopic: 'VaR & stress testing', difficulty: 3, targetTime: 90,
      prompt: 'Why can a VaR model calibrated on 3 years of calm historical data give a much LOWER risk estimate than a stress test applying a specific severe historical scenario to the same current portfolio?',
      answerType: 'mc', options: ['This situation can never actually happen — VaR and stress tests always agree', 'The VaR model reflects statistically typical recent conditions (which may not include a genuine tail event, and may rely on correlations that hold in calm periods but collapse in a crisis), while the stress test deliberately applies a specific extreme scenario regardless of its recent statistical likelihood', 'Stress tests are always less accurate than VaR models', 'VaR models always incorporate every possible historical scenario automatically'], correctAnswer: 'The VaR model reflects statistically typical recent conditions (which may not include a genuine tail event, and may rely on correlations that hold in calm periods but collapse in a crisis), while the stress test deliberately applies a specific extreme scenario regardless of its recent statistical likelihood',
      hint: 'VaR and stress testing answer genuinely different questions.',
      approach: 'VaR reflects recent statistical conditions; stress testing applies a deliberate extreme scenario.',
      solution: 'VaR and stress testing answer genuinely different questions — statistical likelihood based on recent data versus a specific, deliberately extreme "what if" — and can legitimately produce very different numbers as a result.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming VaR and stress testing should always produce consistent, similar results.',
      tags: ['var', 'stress-testing']
    },

    /* ---------------------- INVESTMENT PHILOSOPHY ---------------------- */
    {
      id: 'am_c036', topic: 'Portfolio & Client Management', subtopic: 'Investment philosophy', difficulty: 2, targetTime: 60,
      prompt: 'Value investing, associated with Graham and Buffett, is built on the belief that:',
      answerType: 'mc', options: ['Markets are always perfectly efficient at all time horizons', 'Markets are broadly efficient long-term but can be meaningfully inefficient short-term, creating opportunities to buy below intrinsic value with a margin of safety', 'The best approach is always to pay a premium for high-growth companies', 'Active management can never outperform an index'], correctAnswer: 'Markets are broadly efficient long-term but can be meaningfully inefficient short-term, creating opportunities to buy below intrinsic value with a margin of safety',
      hint: 'Value investing rests on a specific belief about short-term versus long-term market efficiency.',
      approach: 'Value investing exploits short-term inefficiency via intrinsic value and margin of safety.',
      solution: 'Value investing specifically rests on the belief in exploitable short-term inefficiency, with intrinsic value and margin of safety as its core tools.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing value investing with growth investing\'s premium-paying logic.',
      tags: ['investment-philosophy']
    },
    {
      id: 'am_c037', topic: 'Portfolio & Client Management', subtopic: 'Investment philosophy', difficulty: 2, targetTime: 60,
      prompt: 'What does the "efficient market hypothesis" (associated with Eugene Fama) argue?',
      answerType: 'mc', options: ['Markets are always driven by irrational behavioral biases', 'Available information is already reflected in prices quickly and thoroughly, making it very difficult to consistently outperform the market through active selection after costs', 'Active management is always superior to passive investing', 'Factor investing is guaranteed to generate excess returns forever'], correctAnswer: 'Available information is already reflected in prices quickly and thoroughly, making it very difficult to consistently outperform the market through active selection after costs',
      hint: 'EMH is the theoretical foundation for passive investing.',
      approach: 'EMH argues prices already incorporate available information efficiently.',
      solution: 'EMH is the theoretical foundation for passive/index investing, arguing prices already incorporate available information efficiently.',
      recognitionTechnique: 'Other', commonTrap: 'Confusing EMH with the behavioral finance critique that challenges it.',
      tags: ['investment-philosophy', 'efficient-markets']
    },
    {
      id: 'am_c038', topic: 'Portfolio & Client Management', subtopic: 'Investment philosophy', difficulty: 3, targetTime: 90,
      prompt: 'What is the core, genuinely unresolved debate about WHY documented factors (value, momentum, quality, etc.) have historically persisted?',
      answerType: 'mc', options: ['There is no debate — everyone agrees factors are pure luck', 'Whether the extra historical return represents compensation for a genuine additional risk being borne (risk premium), or persists due to behavioral biases among investors that are not fully arbitraged away', 'Whether factors exist at all — this is not actually supported by any evidence', 'Whether momentum is the only real factor and all others are fake'], correctAnswer: 'Whether the extra historical return represents compensation for a genuine additional risk being borne (risk premium), or persists due to behavioral biases among investors that are not fully arbitraged away',
      hint: 'This is the central, still-unresolved question in the factor investing literature.',
      approach: 'The risk-premium versus behavioral-bias debate is genuinely unresolved.',
      solution: 'The risk-premium versus behavioral-bias debate is the central, still-unresolved question in the academic factor investing literature.',
      recognitionTechnique: 'Other', commonTrap: 'Assuming this debate has been definitively settled in one direction.',
      tags: ['investment-philosophy', 'factor-investing']
    }
  ];

  items.forEach((q) => { q.track = 'am'; });
  global.QTL_BANK.addMany(items);
})(window);
