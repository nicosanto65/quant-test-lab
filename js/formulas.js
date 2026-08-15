/* QUANT TEST LAB — formula / technique sheet (preparation only). */
(function (global) {
  'use strict';
  global.QTL_FORMULAS = [
    {
      group: 'Recognition triggers', items: [
        { t: 'TAIL SUM', trigger: 'Asked for E[X] where X is a non-negative integer (a max, a count, a waiting time).', body: 'E[X] = Σ_{k≥1} P(X ≥ k). Continuous version: E[X] = ∫₀^∞ P(X > x) dx.' },
        { t: 'SYMMETRY', trigger: 'Objects are interchangeable; the question asks about relative order or "which one is the biggest".', body: 'k marked objects fall in a specific relative order with probability 1/k!. Each of n exchangeable slots holds the extreme with probability 1/n. Always test for symmetry before counting.' },
        { t: 'LINEARITY OF EXPECTATION', trigger: 'Any "expected number of…".', body: 'E[ΣXᵢ] = ΣE[Xᵢ]. Valid even when the Xᵢ are strongly dependent. You never need the joint distribution.' },
        { t: 'INDICATOR VARIABLES', trigger: 'Counting matches, empty boxes, adjacent pairs, records, fixed points.', body: 'Write the count as ΣIᵢ and compute one marginal probability per term. Choose the index (per box / per pair / per position) that makes that probability trivial.' },
        { t: 'COMPLEMENT', trigger: '"At least one", "none", "not all".', body: 'P(at least one) = 1 − P(none). Turns a messy union into one product.' },
        { t: 'CONDITIONING / FIRST-STEP ANALYSIS', trigger: 'Repeated trials, "until", patterns, walks.', body: 'Condition on the first step, write E (or P) in terms of itself, solve the small linear system. Lump equivalent states.' },
        { t: 'BAYES', trigger: 'A test result, a signal, or evidence, and you are asked about the cause.', body: 'Posterior odds = prior odds × likelihood ratio. Under time pressure use natural frequencies out of 10,000.' },
        { t: 'ORDER STATISTICS', trigger: 'Max, min, k-th smallest, range, first failure.', body: 'Build the CDF, not the pmf: P(max ≤ k) = F(k)ⁿ, P(min ≥ k) = (1−F)ⁿ. Uniform spacings: E[X_(k)] = k/(n+1).' },
        { t: 'OPTIMAL STOPPING', trigger: '"You may stop", rerolls, hiring, irrevocable accept/reject.', body: 'Backward induction. Accept when the current value beats the expected value of continuing; the threshold changes at every stage.' },
        { t: 'INFORMATION / IMPOSSIBILITY', trigger: '"Minimum number of weighings / questions / races".', body: 'Two halves are required: a strategy achieving the bound, and a counting bound (k outcomes per query ⇒ ⌈log_k N⌉) proving nothing smaller works.' },
        { t: 'GAME THEORY', trigger: 'Simultaneous choices, an opponent who reacts.', body: 'Delete dominated strategies first. Then choose the mix that makes the OPPONENT indifferent.' }
      ]
    },
    {
      group: 'Probability', items: [
        { t: 'Basic identities', trigger: 'Always', body: 'P(A∪B) = P(A)+P(B)−P(A∩B). P(A|B) = P(A∩B)/P(B). Chain rule: P(A∩B) = P(B)P(A|B). Total probability: P(B) = ΣP(Aᵢ)P(B|Aᵢ).' },
        { t: 'Independence', trigger: 'Repeated trials with no feedback', body: 'P(A∩B) = P(A)P(B). Disjoint ≠ independent. Zero correlation ≠ independence.' }
      ]
    },
    {
      group: 'Counting', items: [
        { t: 'The four cases', trigger: 'Selections and arrangements', body: 'Ordered with replacement nᵏ · ordered without n!/(n−k)! · unordered without C(n,k) · unordered with replacement C(n+k−1,k).' },
        { t: 'Multinomial', trigger: 'Repeated identical items', body: 'n!/(n₁!n₂!…). Arrangements of MISSISSIPPI = 11!/(4!4!2!) = 34,650.' },
        { t: 'Stars and bars', trigger: 'Identical items, distinct boxes', body: 'Non-negative: C(n+k−1,k−1). Positive: C(n−1,k−1).' },
        { t: 'Inclusion–exclusion', trigger: 'Overlapping conditions', body: '|A∪B∪C| = Σ|Aᵢ| − Σ|Aᵢ∩Aⱼ| + |A∩B∩C|. Derangements D(n) = n!Σ(−1)ᵏ/k!; D(4)=9, D(5)=44.' },
        { t: 'Useful numbers', trigger: 'Fast recall', body: 'C(52,5) = 2,598,960. Catalan 1,2,5,14,42,132. Fibonacci 1,1,2,3,5,8,13,21,34,55,89,144. 2¹⁰ = 1024.' }
      ]
    },
    {
      group: 'Expectation and variance', items: [
        { t: 'Expectation toolkit', trigger: 'Any E[·]', body: 'E[aX+b] = aE[X]+b. E[X] = E[E[X|Y]]. Wald: E[ΣᴺXᵢ] = E[N]E[X] for independent N. Geometric wait E = 1/p.' },
        { t: 'Variance toolkit', trigger: 'Risk, spread, sums', body: 'Var(X) = E[X²]−E[X]². Var(aX+b) = a²Var(X). Var(X±Y) = VarX + VarY ± 2Cov. Var(X̄) = σ²/n. Law of total variance: Var(X) = E[Var(X|Y)] + Var(E[X|Y]).' },
        { t: 'Pattern waits', trigger: 'Coin patterns', body: 'E[HH] = 6, E[HT] = 4, E[HHH] = 14, E[n heads in a row] = 2ⁿ⁺¹ − 2. Overlapping patterns are slower.' },
        { t: 'Standard results worth memorising', trigger: 'Instant recall', body: 'Fixed points of a random permutation: mean 1, variance 1. Coupon collector: nH_n (6 faces ⇒ 14.7). Expected cycles: H_n. First ace in a deck: 53/5 = 10.6.' }
      ]
    },
    {
      group: 'Distributions', items: [
        { t: 'Discrete', trigger: 'Counting successes', body: 'Bin(n,p): mean np, var np(1−p). Geom(p): mean 1/p, var (1−p)/p². NegBin(r,p): mean r/p. Hypergeom(N,K,n): mean nK/N. Poisson(λ): mean = var = λ; thinning by q gives Poisson(λq).' },
        { t: 'Continuous', trigger: 'Times and magnitudes', body: 'U[a,b]: mean (a+b)/2, var (b−a)²/12. Exp(λ): mean 1/λ, memoryless, min of independents is Exp(Σλ), P(i first) = λᵢ/Σλ. Normal: 68/95/99.7; sums of independent normals add variances.' },
        { t: 'Dice constants', trigger: 'Any dice question', body: 'Fair d6: mean 3.5, variance 35/12 ≈ 2.917. Sum of two d6: 36 outcomes, 7 is the mode with 6 ways. E|X−Y| = 70/36 ≈ 1.944.' }
      ]
    },
    {
      group: 'Finance (SIG)', items: [
        { t: 'Valuation', trigger: 'Multiples and takeovers', body: 'Cap = price × diluted shares. EV = cap + debt − cash. P/E pairs with net income; EV/EBITDA and EV/Sales pair with EV. Never mix the two families.' },
        { t: 'Per-share effects', trigger: 'Issuance, buybacks', body: 'EPS = NI/shares. Issuing m shares on top of s dilutes EPS by m/(s+m). A buyback is accretive when the earnings yield exceeds the after-tax cost of funding.' },
        { t: 'Rates and FX', trigger: 'Bonds, crosses', body: 'Current yield = coupon/price. ΔP/P ≈ −D_mod·Δy (+ ½·convexity·Δy²). Cross rate chains: EUR/JPY = EUR/USD × USD/JPY.' },
        { t: 'Events', trigger: 'Earnings scenarios', body: 'Surprise = (actual − consensus)/consensus. Price reflects forward expectations, so a guidance cut can dominate a reported beat.' },
        { t: 'Leverage', trigger: 'Return on equity', body: 'RoE = asset return × assets/equity, symmetric in gains and losses.' }
      ]
    },
    {
      group: 'Markets and sizing', items: [
        { t: 'Fair value first', trigger: 'Any quoted market', body: 'Compute fair value before looking at the quote. Sell above fair value, buy below; the edge is measured from the price you actually trade at, not the mid.' },
        { t: 'Adverse selection', trigger: 'Quoting to mixed flow', body: 'EV per trade = (1−p)·spread earned − p·loss to informed flow. If negative, widen the quote.' },
        { t: 'Kelly', trigger: 'Sizing a repeated edge', body: 'f* = (bp − q)/b. At even money with p = 0.6, f* = 20% of bankroll. Half-Kelly gives 75% of the growth with far less variance.' },
        { t: 'Overround', trigger: 'A full set of quoted outcomes', body: 'If the implied probabilities sum above 1, the margin is on the buyer; the arbitrage is to sell the set.' }
      ]
    },
    {
      group: 'Speed arithmetic', items: [
        { t: 'Decomposition', trigger: 'Percentages', body: 'Build from 10%, 5%, 1%. x% of y = y% of x. ×99 = ×100 − ×1. ×25 = ×100/4. ×15 = ×10 + half of that.' },
        { t: 'Fraction anchors', trigger: 'Fraction to percent', body: '1/6 = 16.67, 1/7 = 14.29, 1/8 = 12.5, 1/9 = 11.11, 1/11 = 9.09, 1/12 = 8.33, 1/16 = 6.25.' },
        { t: 'Compounding', trigger: 'Growth over time', body: 'Rule of 72 for doubling. (1+x)ⁿ ≈ e^{nx} for small x. Successive percentage moves multiply: +20% then −20% is −4%.' },
        { t: 'Roots', trigger: 'Estimating √', body: '√(a²+d) ≈ a + d/(2a). √2 = 1.414, √3 = 1.732, √5 = 2.236, √10 = 3.162.' }
      ]
    }
  ];
})(window);
