/* QUANT TEST LAB — Learn mode content.
   Concise, recognition-first lessons. Each concept:
   core, when, formulas[], intuition, easy, hard, trap, checks[]
   A check is {q, options[], a (index), why}.                       */
(function (global) {
  'use strict';

  const L = [

    /* =============================== A =============================== */
    {
      unit: 'A', topic: 'Probability', title: 'Probability fundamentals', concepts: [
        {
          id: 'a1', name: 'Sample spaces and complements',
          core: 'Every probability question is a counting question in disguise: fix the set of equally likely outcomes, then count.',
          when: 'The moment a question feels ambiguous, the sample space is wrong or unstated. Any phrase like "at least one" is a complement flag.',
          formulas: ['P(A) = |A| / |S| when outcomes are equally likely', 'P(Aᶜ) = 1 − P(A)', 'P(at least one) = 1 − P(none)'],
          intuition: 'Complements convert an OR-mess with overlaps into a single AND-product.',
          easy: 'Two fair coins. P(at least one head) = 1 − P(TT) = 1 − 1/4 = 3/4.',
          hard: 'Roll a die 4 times. P(at least one 6) = 1 − (5/6)⁴ = 1 − 625/1296 = 671/1296 ≈ 0.518. Note it is not 4/6.',
          trap: 'Adding probabilities of overlapping events. Four rolls do not give 4 × 1/6.',
          checks: [
            { q: 'P(at least one head in 3 fair flips)?', options: ['3/8', '1/2', '7/8', '1'], a: 2, why: '1 − (1/2)³ = 7/8.' },
            { q: 'Which phrasing most strongly signals the complement rule?', options: ['"exactly two"', '"at least one"', '"the first"', '"given that"'], a: 1, why: '"At least one" negates to the single event "none".' }
          ]
        },
        {
          id: 'a2', name: 'Conditional probability and independence',
          core: 'Conditioning shrinks the universe. Independence means the shrink changes nothing.',
          when: 'Words "given", "knowing that", "among those who". Also whenever a process happens in stages.',
          formulas: ['P(A|B) = P(A∩B)/P(B)', 'A, B independent ⇔ P(A∩B) = P(A)P(B)', 'Chain rule: P(A∩B) = P(B)P(A|B)'],
          intuition: 'Draw the restricted region first, then ask what fraction of it is favourable.',
          easy: 'Two dice, given the first is a 4, P(sum = 7) = 1/6 — the second die is untouched.',
          hard: 'Two dice, given the sum is 7, P(one die is a 4) = 2/6 = 1/3. The conditioning set has 6 outcomes and two contain a 4.',
          trap: 'Independence of events is not the same as being mutually exclusive — in fact disjoint events with positive probability are always dependent.',
          checks: [
            { q: 'If P(A) = 0.5, P(B) = 0.4 and A, B are disjoint, are they independent?', options: ['Yes', 'No'], a: 1, why: 'P(A∩B) = 0 ≠ 0.2, so they are dependent.' },
            { q: 'Two dice, given at least one is a 6. P(both are 6)?', options: ['1/6', '1/11', '1/12', '1/36'], a: 1, why: '11 outcomes contain a six; one is (6,6).' }
          ]
        },
        {
          id: 'a3', name: 'Total probability and Bayes',
          core: 'Split on a hidden cause, compute forwards, then invert.',
          when: 'Two-stage experiments, tests with error rates, "what is the probability the cause was X given the effect".',
          formulas: ['P(B) = Σ P(Aᵢ)P(B|Aᵢ)', 'P(A|B) = P(B|A)P(A) / P(B)', 'Posterior odds = prior odds × likelihood ratio'],
          intuition: 'Natural frequencies beat formulas under time pressure: imagine 10,000 people and count.',
          easy: 'Urn A (2R,1W) or urn B (1R,3W) chosen by fair coin. P(red) = ½(2/3) + ½(1/4) = 11/24.',
          hard: 'Prevalence 1%, sensitivity 99%, specificity 95%. Of 10,000: 99 true positives, 495 false positives ⇒ P(disease | +) = 99/594 ≈ 16.7%.',
          trap: 'Ignoring the base rate. A very accurate test on a rare condition still produces mostly false positives.',
          checks: [
            { q: 'Prevalence 1%, sensitivity 100%, specificity 90%. P(disease | positive)?', options: ['≈100%', '≈50%', '≈9%', '≈1%'], a: 2, why: '100 true positives vs 990 false positives ⇒ 100/1090 ≈ 9%.' },
            { q: 'Odds form of Bayes multiplies prior odds by…', options: ['the prior', 'the likelihood ratio', 'the evidence', 'the posterior'], a: 1, why: 'Posterior odds = prior odds × LR.' }
          ]
        }
      ]
    },

    /* =============================== B =============================== */
    {
      unit: 'B', topic: 'Combinatorics', title: 'Counting and combinatorics', concepts: [
        {
          id: 'b1', name: 'Permutations, combinations and replacement',
          core: 'Two questions decide every counting problem: does order matter, and is replacement allowed?',
          when: 'Anything phrased as selections, arrangements, hands, teams, passwords.',
          formulas: ['Ordered, with replacement: nᵏ', 'Ordered, without: n!/(n−k)!', 'Unordered, without: C(n,k)', 'Unordered, with: C(n+k−1, k)'],
          intuition: 'C(n,k) = P(n,k)/k! — you always over-count by exactly the number of internal orderings.',
          easy: 'Committees of 3 from 10: C(10,3) = 120.',
          hard: 'Distinct arrangements of MISSISSIPPI: 11!/(4!4!2!) = 34,650.',
          trap: 'Using permutations when the labels are interchangeable, inflating the count by k!.',
          checks: [
            { q: 'How many 4-digit PINs use digits 0-9 with repeats allowed?', options: ['5040', '10000', '210', '24'], a: 1, why: '10⁴.' },
            { q: 'Ways to pick 2 of 6 people if order is irrelevant?', options: ['12', '15', '30', '36'], a: 1, why: 'C(6,2) = 15.' }
          ]
        },
        {
          id: 'b2', name: 'Inclusion–exclusion and complement counting',
          core: 'When conditions overlap, add singles, subtract pairs, add triples.',
          when: '"At least one of…", "none of…", divisibility, derangements, surjections.',
          formulas: ['|A∪B| = |A|+|B|−|A∩B|', '|A∪B∪C| = Σ|Aᵢ| − Σ|Aᵢ∩Aⱼ| + |A∩B∩C|', 'D(n) = n!Σ(−1)ᵏ/k!'],
          intuition: 'Ask whether the complement has fewer cases. Usually it does.',
          easy: 'Integers 1..100 divisible by 3 or 5: 33 + 20 − 6 = 47.',
          hard: 'Five letters into five envelopes, no letter correct: D(5) = 44 of 120.',
          trap: 'Using |A|·|B| for the intersection instead of the lcm/joint condition.',
          checks: [
            { q: 'Teams of 3 from 4 analysts and 3 traders with at least one trader?', options: ['31', '35', '30', '4'], a: 0, why: 'C(7,3) − C(4,3) = 35 − 4 = 31.' }
          ]
        },
        {
          id: 'b3', name: 'Stars and bars',
          core: 'Distributing identical items into distinct boxes is a bar-placement problem.',
          when: 'Identical objects, distinct recipients, possibly with minimums.',
          formulas: ['Non-negative solutions to x₁+…+x_k = n: C(n+k−1, k−1)', 'Positive solutions: C(n−1, k−1)'],
          intuition: 'Write n stars in a row and choose where k−1 dividers go.',
          easy: '10 identical sweets to 3 children, any amount: C(12,2) = 66.',
          hard: 'Same but each child gets at least 2: give 2 away first, then C(4+2,2) = 15.',
          trap: 'Applying stars and bars when the objects are distinguishable — then it is kⁿ.',
          checks: [
            { q: 'Non-negative integer solutions to a+b+c = 6?', options: ['21', '28', '18', '20'], a: 1, why: 'C(8,2) = 28.' }
          ]
        }
      ]
    },

    /* =============================== C =============================== */
    {
      unit: 'C', topic: 'Expected Value', title: 'Expected value', concepts: [
        {
          id: 'c1', name: 'Linearity of expectation',
          core: 'E[X+Y] = E[X] + E[Y] always — dependence is irrelevant.',
          when: 'Any "expected number of…" question. This is the single highest-yield technique in quant interviews.',
          formulas: ['E[ΣXᵢ] = ΣE[Xᵢ]', 'E[aX + b] = aE[X] + b'],
          intuition: 'You never need the joint distribution, only one marginal probability per term.',
          easy: 'Expected number of heads in 10 flips: 10 × 1/2 = 5.',
          hard: 'Expected fixed points of a random permutation of n: n × 1/n = 1, for every n.',
          trap: 'Believing linearity requires independence. It does not (variance does).',
          checks: [
            { q: 'Expected number of people who get their own hat back, 8 people?', options: ['0', '1', '8', '1/8'], a: 1, why: '8 indicators each with probability 1/8.' },
            { q: 'Does linearity of expectation require independence?', options: ['Yes', 'No'], a: 1, why: 'Only variance addition needs independence.' }
          ]
        },
        {
          id: 'c2', name: 'Indicator variables',
          core: 'Turn a count into a sum of 0/1 variables, then take expectations term by term.',
          when: '"Expected number of X" where X is a count of events, matches, empty boxes, adjacent pairs, records.',
          formulas: ['X = ΣIᵢ, E[Iᵢ] = P(event i)', 'E[X] = Σ P(event i)'],
          intuition: 'Choose the indicator over the right object: per box, per pair, per position — whichever makes P easy.',
          easy: 'n balls into b boxes: E[empty boxes] = b((b−1)/b)ⁿ.',
          hard: 'Random row of r red and b blue: E[colour changes] = 2rb/(r+b), from an indicator per adjacent slot.',
          trap: 'Indexing over the wrong object, producing a probability you cannot compute.',
          checks: [
            { q: '5 balls, 4 boxes. Expected number of empty boxes?', options: ['4(3/4)⁵ ≈ 0.95', '1', '4/5', '(3/4)⁵'], a: 0, why: 'One indicator per box.' }
          ]
        },
        {
          id: 'c3', name: 'Conditioning and first-step analysis',
          core: 'Condition on the first step, write E in terms of itself, solve.',
          when: 'Repeated trials, waiting times, patterns, random walks, "keep going until".',
          formulas: ['E[X] = E[E[X|Y]]', 'Geometric wait: E = 1/p', 'Wald: E[ΣᴺXᵢ] = E[N]E[X]'],
          intuition: 'One equation per state. Small state spaces beat infinite sums.',
          easy: 'Rolls until a 6: E = 6.',
          hard: 'Flips until HH: a = 1 + ½b + ½a, b = 1 + ½a ⇒ a = 6, while HT takes only 4.',
          trap: 'Assuming all patterns of the same length take the same expected time. Self-overlap makes patterns slower.',
          checks: [
            { q: 'Expected flips to first see HHH?', options: ['8', '14', '6', '16'], a: 1, why: '2ⁿ⁺¹ − 2 = 14.' }
          ]
        }
      ]
    },

    /* =============================== D =============================== */
    {
      unit: 'D', topic: 'Variance', title: 'Variance and covariance', concepts: [
        {
          id: 'd1', name: 'Variance rules',
          core: 'Variance scales by the square of constants and adds only when covariance vanishes.',
          when: 'Portfolio risk, sums of trials, sampling error.',
          formulas: ['Var(X) = E[X²] − E[X]²', 'Var(aX+b) = a²Var(X)', 'Var(X+Y) = Var(X)+Var(Y)+2Cov(X,Y)', 'Var(X̄ₙ) = σ²/n'],
          intuition: 'Standard deviations add like vectors, not like numbers — √ at the very end.',
          easy: 'Var of the sum of 3 fair dice: 3 × 35/12 = 8.75.',
          hard: 'ρ(X, X+Y) with independent X, Y = √(Var X / (Var X + Var Y)).',
          trap: 'Subtracting variances for X − Y. The sign squares away; variances add.',
          checks: [
            { q: 'Var(3X) if Var(X) = 4?', options: ['12', '36', '7', '4'], a: 1, why: '9 × 4.' },
            { q: 'X, Y independent, Var each 5. Var(X − Y)?', options: ['0', '5', '10', '25'], a: 2, why: 'Variances add regardless of sign.' }
          ]
        },
        {
          id: 'd2', name: 'Covariance, correlation and conditional variance',
          core: 'Correlation is covariance on a −1..1 scale; it is a cosine, so it is not transitive.',
          when: 'Two-asset problems, hedge ratios, and any "how much of the variance is explained" question.',
          formulas: ['Cov(X,Y) = E[XY] − E[X]E[Y]', 'ρ = Cov/(σ_Xσ_Y)', 'Var(X) = E[Var(X|Y)] + Var(E[X|Y])', 'β = Cov(X,Y)/Var(Y)'],
          intuition: 'The law of total variance splits risk into within-group noise plus between-group spread.',
          easy: 'ρ = 0.5, σ = 2 and 6 ⇒ Cov = 6.',
          hard: 'ρ(X,Y) = ρ(Y,Z) = 0.8 forces ρ(X,Z) ≥ 0.28, not ≥ 0.8.',
          trap: 'Assuming zero correlation means independence. It only means no linear relationship.',
          checks: [
            { q: 'Minimum-variance hedge ratio equals…', options: ['ρ', 'Cov(S,F)/Var(F)', 'σ_S/σ_F', 'Var(S)/Cov(S,F)'], a: 1, why: 'The OLS slope of spot on futures.' }
          ]
        }
      ]
    },

    /* =============================== E =============================== */
    {
      unit: 'E', topic: 'Distributions', title: 'Distributions', concepts: [
        {
          id: 'e1', name: 'The discrete family',
          core: 'Identify the counting question the distribution answers, and the formula follows.',
          when: 'Fixed trials → binomial. Wait for first success → geometric. Wait for r-th → negative binomial. Without replacement → hypergeometric. Rare events per interval → Poisson.',
          formulas: ['Bin: C(n,k)pᵏ(1−p)ⁿ⁻ᵏ, mean np, var np(1−p)', 'Geom: (1−p)ᵏ⁻¹p, mean 1/p, var (1−p)/p²', 'NegBin: C(k−1,r−1)pʳ(1−p)ᵏ⁻ʳ', 'Hyper: C(K,k)C(N−K,n−k)/C(N,n)', 'Poisson: e⁻ᵞλᵏ/k!, mean = var = λ'],
          intuition: 'Hypergeometric → binomial when the population is large relative to the sample. Binomial → Poisson when n is large and p small with np fixed.',
          easy: '5 flips, P(exactly 2 heads) = C(5,2)/32 = 10/32.',
          hard: 'Orders at 10/min, 30% are buys ⇒ buys are Poisson(3) by thinning, so P(2 buys) = e⁻³·4.5 ≈ 0.224.',
          trap: 'Using the binomial for draws without replacement from a small population.',
          checks: [
            { q: 'Defectives in a sample drawn without replacement from a small box follow…', options: ['Binomial', 'Hypergeometric', 'Poisson', 'Geometric'], a: 1, why: 'Finite population, no replacement.' },
            { q: 'Mean and variance are equal for…', options: ['Binomial', 'Geometric', 'Poisson', 'Uniform'], a: 2, why: 'Both equal λ.' }
          ]
        },
        {
          id: 'e2', name: 'Continuous essentials',
          core: 'Uniform gives length ratios; normal gives z-scores; exponential is memoryless.',
          when: 'Waiting times → exponential. Aggregates of many small effects → normal. "Somewhere in an interval" → uniform.',
          formulas: ['U[a,b]: mean (a+b)/2, var (b−a)²/12', 'N: 68/95/99.7 within 1/2/3σ', 'Exp(λ): P(T>t) = e^{−λt}, mean 1/λ, memoryless', 'min of Exp(λᵢ) ~ Exp(Σλᵢ)'],
          intuition: 'Memorylessness means elapsed waiting time carries no information.',
          easy: 'X ~ U[0,10]: P(3 ≤ X ≤ 7) = 0.4.',
          hard: 'X ~ N(100,15²), Y ~ N(94,20²) independent ⇒ X − Y ~ N(6,25²) and P(X>Y) = Φ(0.24) ≈ 0.59.',
          trap: 'Adding standard deviations instead of variances when combining normals.',
          checks: [
            { q: 'You have waited 10 min for an exponential event with mean 5 min. Expected further wait?', options: ['0', '5 min', '15 min', 'Cannot say'], a: 1, why: 'Memorylessness.' }
          ]
        }
      ]
    },

    /* =============================== F =============================== */
    {
      unit: 'F', topic: 'Order Statistics', title: 'Order statistics', concepts: [
        {
          id: 'f1', name: 'Maxima, minima and the tail sum',
          core: 'Never build the pmf of a max or min — build its CDF, because "max ≤ k" means "all ≤ k".',
          when: 'Largest/smallest of several draws, best of n bids, first failure among components.',
          formulas: ['P(max ≤ k) = F(k)ⁿ', 'P(min ≥ k) = (1−F(k⁻))ⁿ', 'E[X] = Σ_{k≥1} P(X ≥ k) for non-negative integer X', 'E[X] = ∫₀^∞ P(X>x)dx for non-negative continuous X'],
          intuition: 'The tail-sum formula converts an expectation into a sum of easy tail probabilities.',
          easy: 'Two dice: P(max ≤ 4) = (4/6)² = 4/9.',
          hard: 'E[max of 3 dice] = Σ_{k=1}^{6}[1 − ((k−1)/6)³] = 119/24 ≈ 4.958.',
          trap: 'Computing P(max = k) directly and forgetting to subtract the k−1 case.',
          checks: [
            { q: 'E[X] for non-negative integer X equals…', options: ['ΣkP(X=k) only', 'Σ_{k≥1}P(X ≥ k)', 'Σ P(X ≤ k)', 'Σ P(X = k)'], a: 1, why: 'Tail sum.' }
          ]
        },
        {
          id: 'f2', name: 'Uniform spacings',
          core: 'n uniform points cut [0,1] into n+1 exchangeable gaps of mean 1/(n+1).',
          when: 'Expected value of the k-th smallest, expected range, expected position of the first special card in a shuffled deck.',
          formulas: ['E[X_(k)] = k/(n+1)', 'E[max] = n/(n+1)', 'E[range] = (n−1)/(n+1)', 'Deck version: E[position of first of m specials] = 53/(m+1)'],
          intuition: 'The gap picture also solves discrete card problems: special cards are the dividers, ordinary cards fill the gaps.',
          easy: '3 uniform points: E[median] = 2/4 = 0.5.',
          hard: 'Expected position of the first ace in a shuffled deck = 48/5 + 1 = 53/5 = 10.6.',
          trap: 'Dividing by n instead of n+1.',
          checks: [
            { q: '4 uniform points on [0,1]. E[smallest]?', options: ['1/4', '1/5', '1/2', '4/5'], a: 1, why: 'k/(n+1) = 1/5.' }
          ]
        }
      ]
    },

    /* =============================== G-I ============================= */
    {
      unit: 'G–I', topic: 'Symmetry', title: 'Cards, dice, urns and symmetry', concepts: [
        {
          id: 'g1', name: 'Symmetry arguments',
          core: 'If relabelling the objects leaves the problem unchanged, all the relabelled outcomes have equal probability.',
          when: 'Relative order questions, "which position holds the best", tournaments, race outcomes, anything where the answer looks suspiciously independent of the deck size.',
          formulas: ['k specified objects appear in a given relative order with probability 1/k!', 'Each of n exchangeable positions holds the extreme with probability 1/n'],
          intuition: 'Before counting anything, ask: are the objects exchangeable? If yes, the answer is usually a small fraction with no work at all.',
          easy: 'P(ace of spades above ace of hearts) = 1/2.',
          hard: 'Five players dealt one card each: P(seat 3 has the highest) = 1/5, regardless of deck composition.',
          trap: 'Grinding out a correct but slow enumeration when a symmetry line finishes it in five seconds. Under a 100-minute, 12-question format that time gap is the whole test.',
          checks: [
            { q: 'P(3 named cards appear in a specific relative order)?', options: ['1/3', '1/6', '1/52', '3/52'], a: 1, why: '1/3! = 1/6.' }
          ]
        },
        {
          id: 'g2', name: 'Urn and card mechanics',
          core: 'Without replacement means hypergeometric; sequential draws can often be reordered by symmetry.',
          when: 'Hands, bags of chips, defect sampling.',
          formulas: ['P(same colour, 2 draws) = [C(r,2)+C(b,2)]/C(n,2)', 'P(k of type A) = C(K,k)C(N−K,n−k)/C(N,n)'],
          intuition: 'The probability that the second card is an ace equals the probability that the first is — position does not matter unconditionally.',
          easy: '3 red, 2 blue: P(two draws same colour) = (3+1)/10 = 0.4.',
          hard: 'P(exactly 2 hearts in a 5-card hand) = C(13,2)C(39,3)/C(52,5) ≈ 0.274.',
          trap: 'Applying binomial probabilities to draws without replacement.',
          checks: [
            { q: 'Unconditionally, P(2nd card of a shuffled deck is an ace)?', options: ['4/51', '3/51', '1/13', '4/52 only if the first was not an ace'], a: 2, why: 'By symmetry every position is equally likely to hold an ace: 4/52 = 1/13.' }
          ]
        }
      ]
    },

    /* =============================== J-K ============================= */
    {
      unit: 'J–K', topic: 'Recursion', title: 'Recursion and stopping', concepts: [
        {
          id: 'j1', name: 'Setting up recurrences',
          core: 'Define the state, condition on one step, and write one equation per state.',
          when: 'Random walks, pattern waits, ruin problems, games that repeat.',
          formulas: ['Gambler’s ruin, fair: P(hit N before 0 | start k) = k/N', 'Unfair with q/p = s: (1−sᵏ)/(1−sᴺ)', 'Expected duration, fair game: k(N−k)'],
          intuition: 'Lump states that behave identically. A cube walk has 4 states, not 8.',
          easy: 'Start with 30, target 100, fair bets: P(win) = 0.3.',
          hard: 'Ant on a cube: distances 3,2,1 give a = 1+b, b = 1+⅔c+⅓a, c = 1+⅔b ⇒ a = 10 steps.',
          trap: 'Forgetting the "+1" for the step you just took.',
          checks: [
            { q: 'Fair coin bets from 20 towards 50 or 0. P(reach 50)?', options: ['0.2', '0.4', '0.5', '0.6'], a: 1, why: 'k/N = 20/50.' }
          ]
        },
        {
          id: 'k1', name: 'Optimal stopping',
          core: 'Work backwards. The value of continuing is the expectation of the optimal future; accept when the current offer beats it.',
          when: 'Reroll games, hiring/secretary problems, "you may stop at any point" phrasing.',
          formulas: ['Threshold rule: accept x if x ≥ V(continue)', 'Backward induction from the last stage', 'Secretary, large n: reject first n/e, then take the next record'],
          intuition: 'The threshold rises as fewer chances remain behind you and falls as you run out of future.',
          easy: 'One reroll of a fair die: keep 4, 5, 6; EV = 4.25.',
          hard: 'Three rolls maximum: thresholds 5 then 4 then take anything, EV = 14/3 ≈ 4.667.',
          trap: 'Using one fixed threshold at every stage, or taking max(rolls) when the decision must be made before seeing the next roll.',
          checks: [
            { q: 'Two rolls of a fair die, keep or reroll once. Optimal EV?', options: ['3.5', '4.25', '4.67', '5'], a: 1, why: 'Accept 4+, else take 3.5.' }
          ]
        }
      ]
    },

    /* =============================== L-N ============================= */
    {
      unit: 'L–N', topic: 'Game Theory', title: 'Strategy, information and games', concepts: [
        {
          id: 'm1', name: 'Information and impossibility arguments',
          core: 'To prove a minimum, you need two halves: a strategy that achieves it, and a counting bound showing nothing smaller can work.',
          when: 'Weighings, guessing games, minimum number of questions/races/comparisons.',
          formulas: ['k outcomes per query, N possibilities ⇒ need ⌈log_k N⌉ queries', 'Balance scale has 3 outcomes per weighing', 'Max and min of n: ⌈3n/2⌉ − 2 comparisons'],
          intuition: 'Each query can at best split the possibilities into equal parts. Unequal splits waste information.',
          easy: '27 coins, one lighter: 3³ = 27 ⇒ 3 weighings.',
          hard: '12 balls, odd one heavy or light: 24 outcomes, 3² = 9 < 24 ≤ 27 ⇒ exactly 3 weighings.',
          trap: 'Presenting a clever strategy and calling it minimal without the lower bound.',
          checks: [
            { q: 'Why is a balance better than a scale that only reports "heavier/lighter than a reference"?', options: ['It is faster', 'It has three outcomes, not two', 'It is more accurate', 'No difference'], a: 1, why: 'log₃ beats log₂.' }
          ]
        },
        {
          id: 'n1', name: 'Game theory essentials',
          core: 'Delete dominated strategies; if none remain dominated, mix so that your opponent is indifferent.',
          when: 'Simultaneous choices, bluffing, penalty kicks, guessing games, market-making against informed flow.',
          formulas: ['Mixed equilibrium: choose p making the opponent indifferent', 'Zero-sum: your maximin equals their minimax', 'Iterated dominance for guessing games'],
          intuition: 'You never mix to make yourself better off in a single round — you mix to stop being exploited.',
          easy: 'Matching pennies: mix 50/50.',
          hard: 'Asymmetric penalty kicks where one side converts only 80% of unsaved shots: shoot left with probability 4/9.',
          trap: 'Solving for the mix that makes you indifferent instead of your opponent.',
          checks: [
            { q: 'In a mixed equilibrium you choose probabilities to make…', options: ['yourself indifferent', 'your opponent indifferent', 'the payoff maximal', 'the game fair'], a: 1, why: 'Your opponent must be indifferent, otherwise they deviate.' }
          ]
        }
      ]
    },

    /* =============================== O =============================== */
    {
      unit: 'O', topic: 'Mental Maths', title: 'Mental maths', concepts: [
        {
          id: 'o1', name: 'Speed arithmetic toolkit',
          core: 'Replace long calculation with decomposition, anchors and approximation plus a correction.',
          when: 'Every SIG-style timed question. At 23 minutes for 15–30 questions there is no time for written long division.',
          formulas: ['a×99 = a×100 − a', 'a×25 = a×100/4', 'x% of y = y% of x', '√(a²+d) ≈ a + d/(2a)', 'Rule of 72 for doubling time', '(1+x)ⁿ ≈ e^{nx}'],
          intuition: 'Fraction anchors are worth memorising: 1/7 ≈ 14.29%, 1/8 = 12.5%, 1/9 ≈ 11.11%, 1/11 ≈ 9.09%, 1/12 ≈ 8.33%.',
          easy: '17.5% of 240 = 24 + 12 + 6 = 42.',
          hard: '1.03¹² ≈ e^{0.36} ≈ 1.43 (true 1.4258); or via rule of 72, doubling takes 24 years so 12 years is about √2 ≈ 1.41.',
          trap: 'Averaging percentages of differently sized groups; +20% then −20% is −4%, not 0%.',
          checks: [
            { q: '16% of 25 = ?', options: ['4', '2.5', '6.25', '40'], a: 0, why: 'Swap: 25% of 16 = 4.' },
            { q: 'Price rises 25% then falls 20%. Net?', options: ['+5%', '0%', '−5%', '+45%'], a: 1, why: '1.25 × 0.8 = 1.' }
          ]
        }
      ]
    },

    /* =============================== P =============================== */
    {
      unit: 'P', topic: 'Finance', title: 'Finance for SIG', concepts: [
        {
          id: 'p1', name: 'Valuation building blocks',
          core: 'Equity value is what shareholders own; enterprise value is what the whole operating business is worth.',
          when: 'Any multiple, any "what happens to X if Y" scenario, any takeover question.',
          formulas: ['Market cap = price × diluted shares', 'EV = market cap + debt − cash', 'P/E = price/EPS = cap/net income', 'EV/EBITDA uses EV, never market cap', 'EPS = net income / diluted shares'],
          intuition: 'Numerator and denominator must belong to the same claimants. EBITDA is pre-interest, so it pairs with EV, not equity.',
          easy: 'Cap 500, debt 200, cash 50 ⇒ EV = 650.',
          hard: 'Issuing 10m shares on top of 90m dilutes EPS by 10/100 = 10%, not 11.1%.',
          trap: 'Pairing an equity metric with an enterprise metric (P/EBITDA is meaningless).',
          checks: [
            { q: 'A company raises cash by issuing debt. What happens to EV, all else equal?', options: ['Rises', 'Falls', 'Unchanged', 'Doubles'], a: 2, why: 'Debt and cash both rise and cancel in EV.' },
            { q: 'EBITDA pairs with…', options: ['market cap', 'enterprise value', 'EPS', 'net income'], a: 1, why: 'Both are pre-capital-structure.' }
          ]
        },
        {
          id: 'p2', name: 'Rates, bonds, FX and events',
          core: 'Prices move on the change in expectations, not on the level of realised results.',
          when: 'Earnings scenarios, guidance changes, rate moves, cross-rate questions.',
          formulas: ['Current yield = coupon/price', 'ΔP/P ≈ −modified duration × Δy', 'Cross rate: EUR/JPY = EUR/USD × USD/JPY', 'RoE = asset return × assets/equity'],
          intuition: 'Bond price and yield always move in opposite directions; a bond below par yields more than its coupon.',
          easy: 'Coupon 5 on a price of 90 ⇒ current yield 5.56%.',
          hard: 'Duration 6.5 at price 98, yields +40bp ⇒ price ≈ 98 × (1 − 0.026) = 95.45.',
          trap: 'Assuming an earnings beat must send the stock up. A guidance cut alongside the beat usually dominates.',
          checks: [
            { q: 'Yields rise 50bp on a bond with modified duration 4. Approximate price change?', options: ['+2%', '−2%', '−0.5%', '−4%'], a: 1, why: '−4 × 0.005.' }
          ]
        }
      ]
    }
  ];

  global.QTL_LESSONS = L;
})(window);
