/* QUANT TEST LAB — curated question bank.
   ------------------------------------------------------------------
   TO ADD QUESTIONS: append objects to the array below, or call
   QTL_BANK.add({...}) from a separate file loaded after this one.
   Required fields: id, topic, subtopic, difficulty (1-5), prompt,
   answerType ('numeric' | 'mc' | 'text'), correctAnswer.
   Optional: options, tolerance, solution, approach, hint,
   recognitionTechnique, commonTrap, targetTime, tags, altSolution.
   ------------------------------------------------------------------ */
(function (global) {
  'use strict';

  const Q = [
    /* ---------------------- SYMMETRY & CARDS ---------------------- */
    {
      id: 'h001', topic: 'Symmetry', subtopic: 'Exchangeability', difficulty: 2, targetTime: 60,
      prompt: 'A standard deck is shuffled uniformly. What is the probability that the ace of spades lies somewhere above the ace of hearts in the deck?',
      answerType: 'numeric', correctAnswer: 0.5, tolerance: 0.001,
      hint: 'Ignore all 50 other cards.', recognitionTechnique: 'Symmetry',
      approach: 'Exchangeability: the two aces are equally likely to fall in either relative order.',
      solution: 'Conditional on the set of two positions the aces occupy, both assignments are equally likely, so the probability is 1/2 regardless of deck size.',
      commonTrap: 'Summing over the 52 possible positions of the ace of spades — correct but slow.', tags: ['cards']
    },
    {
      id: 'h002', topic: 'Symmetry', subtopic: 'Random permutations', difficulty: 3, targetTime: 90,
      prompt: 'Five players are each dealt one card from a shuffled 52-card deck. What is the probability that the player sitting in seat 1 receives the single highest card of the five dealt (assume no ties are possible)?',
      answerType: 'numeric', correctAnswer: 0.2, tolerance: 0.002,
      hint: 'Whatever five cards come out, who is most likely to hold the best of them?', recognitionTechnique: 'Symmetry',
      approach: 'Condition on the set of five cards dealt; by symmetry each seat is equally likely to hold the maximum.',
      solution: 'Given any set of five distinct cards, all 5! assignments to seats are equally likely, so each seat holds the maximum with probability 1/5 = 0.2.',
      commonTrap: 'Trying to integrate over card ranks — the answer does not depend on the deck at all.', tags: ['cards']
    },
    {
      id: 'h003', topic: 'Symmetry', subtopic: 'Random permutations', difficulty: 4, targetTime: 150,
      prompt: 'A uniformly random permutation of 1..n is drawn. What is the probability that the elements 1 and 2 lie in the same cycle?',
      answerType: 'numeric', correctAnswer: 0.5, tolerance: 0.001,
      hint: 'Build the cycle containing 1 step by step and ask when it closes.', recognitionTechnique: 'Symmetry',
      approach: 'Sequential construction of the cycle containing 1; at the moment the cycle is about to close, 2 is as likely to be inside as outside.',
      solution: 'Trace the cycle from 1. At each step the next element is uniform over the remaining unvisited elements plus the closing option. A short induction (or the pairing bijection swapping the two cases) gives exactly 1/2 for every n ≥ 2.',
      commonTrap: 'Assuming the answer depends on n.', tags: ['permutations']
    },
    {
      id: 'h004', topic: 'Expected Value', subtopic: 'Cycles', difficulty: 4, targetTime: 150,
      prompt: 'What is the expected number of cycles in a uniformly random permutation of 5 elements? Give your answer to three decimal places.',
      answerType: 'numeric', correctAnswer: 2.283, tolerance: 0.01,
      hint: 'Build the permutation one step at a time; at each step there is a fixed chance of closing a cycle.', recognitionTechnique: 'Indicator variables',
      approach: 'Sequential construction: the k-th step closes a cycle with probability 1/(n−k+1); linearity gives the harmonic number.',
      solution: 'E[# cycles] = H_n = 1 + 1/2 + 1/3 + 1/4 + 1/5 = 2.2833.',
      commonTrap: 'Confusing the expected number of cycles with the expected cycle length.', tags: ['permutations', 'linearity']
    },
    {
      id: 'h005', topic: 'Expected Value', subtopic: 'Indicator variables', difficulty: 3, targetTime: 120,
      prompt: 'Five cards are dealt from a standard deck. What is the expected number of distinct suits represented in the hand? Answer to three decimals.',
      answerType: 'numeric', correctAnswer: 3.114, tolerance: 0.01,
      hint: 'One indicator per suit.', recognitionTechnique: 'Indicator variables',
      approach: 'Indicator per suit: P(suit present) = 1 − C(39,5)/C(52,5); multiply by 4.',
      solution: 'P(a given suit absent) = C(39,5)/C(52,5) = 575757/2598960 = 0.22153. E = 4·(1 − 0.22153) = 3.1139.',
      commonTrap: 'Trying to enumerate suit distribution patterns (4-1, 3-2, …).', tags: ['cards', 'linearity']
    },

    /* --------------------- GEOMETRIC PROBABILITY -------------------- */
    {
      id: 'h006', topic: 'Probability', subtopic: 'Geometric probability', difficulty: 4, targetTime: 180,
      prompt: 'A stick of length 1 is broken at two independent uniformly random points. What is the probability the three resulting pieces can form a triangle?',
      answerType: 'numeric', correctAnswer: 0.25, tolerance: 0.005,
      hint: 'The triangle inequality fails exactly when one piece exceeds 1/2.', recognitionTechnique: 'Complement',
      approach: 'Map to the unit square of break points and use the complement: exactly one of three disjoint events makes a piece longer than 1/2.',
      solution: 'A triangle fails iff some piece exceeds 1/2. The three failure events are disjoint and each has probability 1/4 by symmetry, so P(fail) = 3/4 and P(triangle) = 1/4.',
      commonTrap: 'Forgetting that the three failure events are disjoint, or double-counting them.', tags: ['geometry']
    },
    {
      id: 'h007', topic: 'Probability', subtopic: 'Geometric probability', difficulty: 3, targetTime: 150,
      prompt: 'Two people each arrive at a uniformly random time between 12:00 and 13:00, independently. Each waits 15 minutes for the other and then leaves. What is the probability they meet?',
      answerType: 'numeric', correctAnswer: 0.4375, tolerance: 0.005,
      hint: 'Draw the unit square and shade |x − y| ≤ 1/4.', recognitionTechnique: 'Complement',
      approach: 'Geometric probability on the square; the complement is two congruent triangles.',
      solution: 'They meet iff |x − y| ≤ 15 min. The complement is two triangles each of area (45/60)²/2, total 9/16. Answer 1 − 9/16 = 7/16 = 0.4375.',
      commonTrap: 'Computing only one of the two non-meeting triangles.', tags: ['geometry']
    },

    /* ---------------------- CLASSIC CONDITIONING -------------------- */
    {
      id: 'h008', topic: 'Probability', subtopic: 'Conditional probability', difficulty: 3, targetTime: 120,
      prompt: 'Three cards: one is red on both sides, one is white on both sides, one is red on one side and white on the other. One card is drawn at random and one of its faces is shown at random — it is red. What is the probability the other face is also red?',
      answerType: 'numeric', correctAnswer: 0.6667, tolerance: 0.01,
      hint: 'Condition on faces, not on cards.', recognitionTechnique: 'Bayes',
      approach: 'Enumerate the six equally likely faces rather than the three cards.',
      solution: 'Three of the six faces are red; two of those belong to the red/red card. So P = 2/3.',
      commonTrap: 'Answering 1/2 by conditioning on cards rather than faces.', tags: ['bertrand']
    },
    {
      id: 'h009', topic: 'Probability', subtopic: 'Sequential decisions', difficulty: 3, targetTime: 120,
      prompt: 'In a game a fair die is rolled repeatedly. What is the probability that a 5 appears before a 6?',
      answerType: 'numeric', correctAnswer: 0.5, tolerance: 0.002,
      hint: 'Only rolls showing 5 or 6 matter.', recognitionTechnique: 'Symmetry',
      approach: 'Condition on the first roll in the relevant set {5,6}; irrelevant rolls can be discarded.',
      solution: 'Ignore every roll that is neither 5 nor 6. Conditional on being one of these, each is equally likely, so P = 1/2.',
      commonTrap: 'Summing an infinite series when conditioning collapses it instantly.', tags: ['dice']
    },
    {
      id: 'h010', topic: 'Recursion', subtopic: 'Waiting times', difficulty: 4, targetTime: 210,
      prompt: 'A fair coin is flipped repeatedly. What is the expected number of flips needed to first see two heads in a row (HH)?',
      answerType: 'numeric', correctAnswer: 6, tolerance: 0.05,
      hint: 'Define states by how much of the pattern you currently hold.', recognitionTechnique: 'Recursion',
      approach: 'Markov chain on states {∅, H, HH} and solve the linear system.',
      solution: 'Let a = E from ∅ and b = E from H. a = 1 + ½b + ½a; b = 1 + ½·0 + ½a. Solving: b = 4, a = 6.',
      commonTrap: 'Answering 4 — that is the expected wait for HT, not HH. Overlapping patterns wait longer.', tags: ['markov']
    },
    {
      id: 'h011', topic: 'Recursion', subtopic: 'Waiting times', difficulty: 4, targetTime: 180,
      prompt: 'A fair coin is flipped repeatedly. What is the expected number of flips to first see the pattern HT (a head immediately followed by a tail)?',
      answerType: 'numeric', correctAnswer: 4, tolerance: 0.05,
      hint: 'Wait for the first head, then wait for the first tail.', recognitionTechnique: 'Recursion',
      approach: 'Decompose into two independent geometric waits because the pattern has no self-overlap.',
      solution: 'E[first head] = 2; from there E[first tail] = 2. Total 4. Non-overlapping patterns are cheaper than overlapping ones.',
      commonTrap: 'Assuming all two-letter patterns take the same expected time.', tags: ['markov']
    },
    {
      id: 'h012', topic: 'Recursion', subtopic: 'Waiting times', difficulty: 5, targetTime: 240,
      prompt: 'A fair coin is flipped repeatedly. What is the expected number of flips to first see three heads in a row?',
      answerType: 'numeric', correctAnswer: 14, tolerance: 0.1,
      hint: 'Each failure sends you all the way back to the start.', recognitionTechnique: 'Recursion',
      approach: 'States by current run length; the general result is 2^{n+1} − 2.',
      solution: 'E_n = 2^{n+1} − 2. For n = 3: 2⁴ − 2 = 14. (Chain: a=1+½a+½b, b=1+½a+½c, c=1+½a ⇒ a=14.)',
      commonTrap: 'Multiplying the HH answer by 1.5.', tags: ['markov']
    },
    {
      id: 'h013', topic: 'Recursion', subtopic: 'Gambler’s ruin', difficulty: 4, targetTime: 180,
      prompt: 'You start with €30 and bet €1 on fair coin flips until you reach €100 or go broke. What is the probability you reach €100?',
      answerType: 'numeric', correctAnswer: 0.3, tolerance: 0.005,
      hint: 'Your wealth is a martingale under a fair game.', recognitionTechnique: 'Recursion',
      approach: 'Gambler’s ruin with p = 1/2: P(hit N before 0 from k) = k/N.',
      solution: 'By the optional stopping theorem for the fair-game martingale, 30 = 100·P ⇒ P = 0.3.',
      commonTrap: 'Believing a long enough session improves the odds — it does not in a fair game.', tags: ['martingale']
    },
    {
      id: 'h014', topic: 'Recursion', subtopic: 'Markov chains', difficulty: 4, targetTime: 210,
      prompt: 'An ant walks on the vertices of a cube, at each step moving to one of the three adjacent vertices uniformly at random. Starting at one vertex, what is the expected number of steps to reach the diagonally opposite vertex?',
      answerType: 'numeric', correctAnswer: 10, tolerance: 0.1,
      hint: 'Lump vertices by their distance from the target: 3, 2, 1, 0.', recognitionTechnique: 'Recursion',
      approach: 'State lumping by graph distance, then solve three linear equations.',
      solution: 'Let a, b, c be expected steps from distance 3, 2, 1. a = 1 + b; b = 1 + (2/3)c + (1/3)a; c = 1 + (2/3)b. Solving gives c = 7, b = 9, a = 10.',
      commonTrap: 'Treating all seven non-target vertices as one state.', tags: ['markov']
    },
    {
      id: 'h015', topic: 'Expected Value', subtopic: 'Coupon collector', difficulty: 3, targetTime: 120,
      prompt: 'What is the expected number of rolls of a fair six-sided die needed to see every face at least once? Answer to one decimal place.',
      answerType: 'numeric', correctAnswer: 14.7, tolerance: 0.1,
      hint: 'Sum the geometric waits between new faces.', recognitionTechnique: 'Conditioning',
      approach: 'Coupon collector: 6(1 + 1/2 + 1/3 + 1/4 + 1/5 + 1/6).',
      solution: '6·H₆ = 6·2.45 = 14.7 rolls.',
      commonTrap: 'Answering 6.', tags: ['stages']
    },

    /* ------------------------- DICE & COUNTING ---------------------- */
    {
      id: 'h016', topic: 'Combinatorics', subtopic: 'Dice sums', difficulty: 3, targetTime: 120,
      prompt: 'Three fair six-sided dice are rolled. What is the probability their sum is exactly 10?',
      answerType: 'numeric', correctAnswer: 0.125, tolerance: 0.004,
      hint: 'Count ordered triples; stars and bars needs an upper-bound correction.', recognitionTechnique: 'Counting',
      approach: 'Stars and bars with inclusion–exclusion for the face-value cap of 6.',
      solution: 'Solutions to x₁+x₂+x₃ = 10 with 1 ≤ xᵢ ≤ 6: C(9,2) − 3·C(3,2) = 36 − 9 = 27. So 27/216 = 1/8.',
      commonTrap: 'Forgetting the cap of 6 and answering 36/216.', tags: ['dice']
    },
    {
      id: 'h017', topic: 'Expected Value', subtopic: 'Absolute differences', difficulty: 3, targetTime: 150,
      prompt: 'Two fair six-sided dice are rolled. What is the expected absolute difference between the two values? Answer to three decimals.',
      answerType: 'numeric', correctAnswer: 1.944, tolerance: 0.01,
      hint: 'Count how many of the 36 outcomes give each difference.', recognitionTechnique: 'Direct calculation',
      approach: 'Enumerate the difference distribution over the 36 equally likely pairs.',
      solution: 'Counts: diff 0→6, 1→10, 2→8, 3→6, 4→4, 5→2. Weighted sum = 70, so E = 70/36 = 1.9444.',
      commonTrap: 'Computing E[X] − E[Y] = 0 — the absolute value is essential.', tags: ['dice']
    },
    {
      id: 'h018', topic: 'Probability', subtopic: 'Compound games', difficulty: 4, targetTime: 240,
      prompt: 'In craps, the shooter rolls two dice. A 7 or 11 wins immediately; 2, 3 or 12 loses immediately; any other total becomes the "point" and the shooter then rolls until either repeating the point (win) or rolling a 7 (lose). What is the probability the shooter wins? Answer to four decimals.',
      answerType: 'numeric', correctAnswer: 0.4929, tolerance: 0.004,
      hint: 'For each point p, the conditional win probability is n_p/(n_p + 6).', recognitionTechnique: 'Conditioning',
      approach: 'Condition on the come-out roll; for point p only rolls of p or 7 matter, giving n_p/(n_p+6).',
      solution: 'Immediate win 8/36. Points 4,10: (3/36)(3/9) each; 5,9: (4/36)(4/10) each; 6,8: (5/36)(5/11) each. Total = 244/495 ≈ 0.4929.',
      commonTrap: 'Forgetting that only rolls of the point or 7 are relevant once the point is set.', tags: ['games']
    },
    {
      id: 'h019', topic: 'Combinatorics', subtopic: 'Recurrences', difficulty: 4, targetTime: 180,
      prompt: 'How many binary strings of length 10 contain no two adjacent 1s?',
      answerType: 'numeric', correctAnswer: 144, tolerance: 0,
      hint: 'Condition on the last character.', recognitionTechnique: 'Recursion',
      approach: 'Recurrence a(n) = a(n−1) + a(n−2), the Fibonacci numbers with a(1)=2, a(2)=3.',
      solution: 'a(n) = F(n+2): 2, 3, 5, 8, 13, 21, 34, 55, 89, 144. So a(10) = 144.',
      commonTrap: 'Trying to count by number of 1s without noticing the gap structure (which also works: Σ C(11−k, k) = 144).', tags: ['fibonacci']
    },
    {
      id: 'h020', topic: 'Combinatorics', subtopic: 'Catalan structures', difficulty: 4, targetTime: 180,
      prompt: 'How many sequences of 4 opening and 4 closing brackets are correctly matched (never more closing than opening at any prefix)?',
      answerType: 'numeric', correctAnswer: 14, tolerance: 0,
      hint: 'Total arrangements minus the bad ones, via a reflection argument.', recognitionTechnique: 'Counting',
      approach: 'Catalan number C_n = C(2n,n)/(n+1).',
      solution: 'C₄ = C(8,4)/5 = 70/5 = 14.',
      commonTrap: 'Answering C(8,4) = 70 and ignoring the prefix condition.', tags: ['catalan']
    },
    {
      id: 'h021', topic: 'Combinatorics', subtopic: 'Ballot problems', difficulty: 5, targetTime: 210,
      prompt: 'Candidate A receives 7 votes and candidate B receives 3 votes. Votes are counted in a uniformly random order. What is the probability that A is strictly ahead throughout the entire count? Answer to one decimal place as a percentage.',
      answerType: 'numeric', correctAnswer: 40, tolerance: 0.6,
      hint: 'There is a one-line formula for this.', recognitionTechnique: 'Counting',
      approach: 'Bertrand’s ballot theorem: P = (a − b)/(a + b).',
      solution: '(7 − 3)/(7 + 3) = 0.4 = 40%.',
      commonTrap: 'Confusing "always strictly ahead" with "ahead at the end" (which has probability 1 here).', tags: ['ballot']
    },
    {
      id: 'h022', topic: 'Combinatorics', subtopic: 'Number theory counting', difficulty: 2, targetTime: 90,
      prompt: 'How many trailing zeros does 100! have?',
      answerType: 'numeric', correctAnswer: 24, tolerance: 0,
      hint: 'Zeros come from factors of 10 = 2 × 5; fives are scarcer.', recognitionTechnique: 'Counting',
      approach: 'Legendre’s formula: count factors of 5.',
      solution: '⌊100/5⌋ + ⌊100/25⌋ = 20 + 4 = 24.',
      commonTrap: 'Answering 20 by forgetting that 25, 50, 75, 100 each contribute an extra 5.', tags: ['number theory']
    },
    {
      id: 'h023', topic: 'Combinatorics', subtopic: 'Classic puzzles', difficulty: 3, targetTime: 120,
      prompt: '100 lockers are all closed. Person k (for k = 1..100) toggles every k-th locker. After all 100 people have passed, how many lockers are open?',
      answerType: 'numeric', correctAnswer: 10, tolerance: 0,
      hint: 'A locker is open iff it was toggled an odd number of times.', recognitionTechnique: 'Counting',
      approach: 'Divisor counting: the number of divisors is odd exactly for perfect squares.',
      solution: 'Locker n is toggled once per divisor. Only perfect squares have an odd divisor count, and there are 10 squares ≤ 100.',
      commonTrap: 'Simulating instead of noticing the divisor-parity structure.', tags: ['divisors']
    },
    {
      id: 'h024', topic: 'Probability', subtopic: 'Birthday problem', difficulty: 3, targetTime: 120,
      prompt: 'What is the smallest number of people needed for the probability that at least two share a birthday (365 equally likely days, no twins) to exceed 50%?',
      answerType: 'numeric', correctAnswer: 23, tolerance: 0,
      hint: 'Use the complement and the approximation exp(−k(k−1)/730).', recognitionTechnique: 'Complement',
      approach: 'Complement of all-distinct birthdays with the approximation Π(1 − i/365) ≈ exp(−k²/730).',
      solution: 'Setting exp(−k(k−1)/730) = 0.5 gives k(k−1) ≈ 506, so k ≈ 23. Exact computation confirms P(23) = 0.507.',
      commonTrap: 'Answering 183 by confusing this with matching one specific birthday.', tags: ['collisions']
    },

    /* ------------------- ORDER STATISTICS & CONTINUOUS -------------- */
    {
      id: 'h025', topic: 'Order Statistics', subtopic: 'Uniform spacings', difficulty: 4, targetTime: 180,
      prompt: 'Three independent uniform points are dropped on [0, 1]. What is the expected length of the gap between the smallest and the largest of them?',
      answerType: 'numeric', correctAnswer: 0.5, tolerance: 0.005,
      hint: 'E[max] − E[min], each of which has a symmetric closed form.', recognitionTechnique: 'Order statistics',
      approach: 'E[range] = E[max] − E[min] = n/(n+1) − 1/(n+1).',
      solution: 'E[max] = 3/4, E[min] = 1/4, so E[range] = 1/2. Equivalently (n−1)/(n+1).',
      commonTrap: 'Assuming the range is 1 minus twice the mean of a single point.', tags: ['uniform']
    },
    {
      id: 'h026', topic: 'Order Statistics', subtopic: 'Minimum of exponentials', difficulty: 4, targetTime: 150,
      prompt: 'Three independent exponential clocks have rates 1, 2 and 3 per hour. What is the expected time, in hours, until the first one rings? Answer to four decimals.',
      answerType: 'numeric', correctAnswer: 0.1667, tolerance: 0.004,
      hint: 'The minimum of independent exponentials is exponential.', recognitionTechnique: 'Order statistics',
      approach: 'Rates add: min of Exp(λᵢ) is Exp(Σλᵢ), so E = 1/Σλᵢ.',
      solution: 'Σλ = 6 per hour ⇒ E[min] = 1/6 ≈ 0.1667 hours (10 minutes).',
      commonTrap: 'Averaging the three individual means (1, 1/2, 1/3).', tags: ['exponential']
    },
    {
      id: 'h027', topic: 'Order Statistics', subtopic: 'Competing risks', difficulty: 4, targetTime: 150,
      prompt: 'Two independent exponential clocks have rates 2 and 3 per hour. What is the probability that the rate-2 clock rings first?',
      answerType: 'numeric', correctAnswer: 0.4, tolerance: 0.005,
      hint: 'The winner is chosen in proportion to the rates.', recognitionTechnique: 'Order statistics',
      approach: 'Competing exponentials: P(i first) = λᵢ/Σλ.',
      solution: '2/(2+3) = 0.4.',
      commonTrap: 'Inverting the ratio because "faster means smaller mean".', tags: ['exponential']
    },
    {
      id: 'h028', topic: 'Order Statistics', subtopic: 'Discrete maxima', difficulty: 4, targetTime: 180,
      prompt: 'Four fair six-sided dice are rolled. What is the probability that the maximum shown is exactly 5?',
      answerType: 'numeric', correctAnswer: 0.3117, tolerance: 0.004,
      hint: 'P(max = k) = P(max ≤ k) − P(max ≤ k−1).', recognitionTechnique: 'Order statistics',
      approach: 'Use the CDF of the maximum: P(max ≤ k) = (k/6)ⁿ.',
      solution: '(5/6)⁴ − (4/6)⁴ = 625/1296 − 256/1296 = 369/1296 ≈ 0.3117.',
      commonTrap: 'Requiring exactly one die to show 5 rather than at least one.', tags: ['dice']
    },

    /* ------------------------ VARIANCE & STATS ---------------------- */
    {
      id: 'h029', topic: 'Variance', subtopic: 'Correlation bounds', difficulty: 5, targetTime: 240,
      prompt: 'X and Y have correlation 0.8, and Y and Z have correlation 0.8. What is the smallest possible correlation between X and Z? Answer to two decimals.',
      answerType: 'numeric', correctAnswer: 0.28, tolerance: 0.01,
      hint: 'Correlations behave like cosines of angles between vectors.', recognitionTechnique: 'Other',
      approach: 'Positive semi-definiteness of the correlation matrix, or the cosine-of-angles geometry.',
      solution: 'ρ₁₃ ≥ ρ₁₂ρ₂₃ − √((1−ρ₁₂²)(1−ρ₂₃²)) = 0.64 − (0.6)(0.6) = 0.28.',
      commonTrap: 'Assuming correlation is transitive and answering 0.64 or 0.8.', tags: ['correlation']
    },
    {
      id: 'h030', topic: 'Variance', subtopic: 'Hat-check variance', difficulty: 5, targetTime: 240,
      prompt: 'n coats are returned to n people in a uniformly random order. What is the variance of the number of people who receive their own coat (for n ≥ 2)?',
      answerType: 'numeric', correctAnswer: 1, tolerance: 0.02,
      hint: 'Compute E[M²] using pairs of indicators.', recognitionTechnique: 'Indicator variables',
      approach: 'Var = E[M²] − (E[M])² with E[M²] = ΣE[Iᵢ] + Σ_{i≠j}E[IᵢIⱼ].',
      solution: 'E[M] = 1. E[M²] = n(1/n) + n(n−1)·1/(n(n−1)) = 2. So Var = 2 − 1 = 1, independent of n.',
      commonTrap: 'Assuming independence of the indicators — they are dependent, but the covariances happen to sum neatly.', tags: ['linearity']
    },
    {
      id: 'h031', topic: 'Variance', subtopic: 'Conditional variance', difficulty: 5, targetTime: 240,
      prompt: 'N is Poisson with mean 4. Given N = n, X is the sum of n independent fair coin indicators (each 1 with probability 1/2). What is Var(X)?',
      answerType: 'numeric', correctAnswer: 2, tolerance: 0.05,
      hint: 'Use the law of total variance, or notice X is itself Poisson.', recognitionTechnique: 'Conditioning',
      approach: 'Poisson thinning, or Var(X) = E[Var(X|N)] + Var(E[X|N]).',
      solution: 'E[X|N] = N/2, Var(X|N) = N/4. So Var(X) = E[N]/4 + Var(N)/4 = 1 + 1 = 2. (Consistent with thinning: X ~ Poisson(2).)',
      commonTrap: 'Using only E[Var(X|N)] and dropping the variance of the conditional mean.', tags: ['law of total variance']
    },
    {
      id: 'h032', topic: 'Distributions', subtopic: 'Normal comparisons', difficulty: 4, targetTime: 180,
      prompt: 'X ~ N(100, 15²) and Y ~ N(94, 20²) are independent. What is P(X > Y)? Answer to three decimals.',
      answerType: 'numeric', correctAnswer: 0.594, tolerance: 0.012,
      hint: 'Study the single variable X − Y.', recognitionTechnique: 'Direct calculation',
      approach: 'Difference of independent normals is normal with variances adding.',
      solution: 'X − Y ~ N(6, 15²+20² = 625), sd 25. P(X−Y > 0) = Φ(6/25) = Φ(0.24) ≈ 0.5948.',
      commonTrap: 'Adding the standard deviations instead of the variances.', tags: ['normal']
    },
    {
      id: 'h033', topic: 'Distributions', subtopic: 'Poisson thinning', difficulty: 4, targetTime: 150,
      prompt: 'Orders arrive as a Poisson process at 10 per minute, and each independently is a buy with probability 0.3. What is the probability that exactly 2 buy orders arrive in a given minute? Answer to four decimals.',
      answerType: 'numeric', correctAnswer: 0.224, tolerance: 0.006,
      hint: 'Thinning a Poisson process leaves a Poisson process.', recognitionTechnique: 'Direct calculation',
      approach: 'Poisson thinning gives buys ~ Poisson(10 × 0.3 = 3).',
      solution: 'e⁻³·3²/2! = 0.0498·4.5 = 0.2240.',
      commonTrap: 'Using a binomial with n = 10 — the total count is itself random.', tags: ['poisson']
    },
    {
      id: 'h034', topic: 'Distributions', subtopic: 'Inspection paradox', difficulty: 5, targetTime: 210,
      prompt: 'Buses arrive as a Poisson process with mean gap 10 minutes. You arrive at the stop at a random time. What is your expected waiting time until the next bus, in minutes?',
      answerType: 'numeric', correctAnswer: 10, tolerance: 0.2,
      hint: 'Memorylessness.', recognitionTechnique: 'Conditional probability',
      approach: 'Exponential inter-arrivals are memoryless, so the residual wait has the full mean.',
      solution: 'Your residual wait is Exp(1/10) regardless of elapsed time, so E = 10 minutes — even though the mean gap is also 10. You land in longer gaps more often (the inspection paradox): the gap you land in has mean 20.',
      commonTrap: 'Answering 5 by assuming you land in the middle of a typical gap.', tags: ['exponential', 'paradox']
    },

    /* ---------------------- OPTIMAL STRATEGY / GAMES ---------------- */
    {
      id: 'h035', topic: 'Optimal Strategy', subtopic: 'Secretary problem', difficulty: 5, targetTime: 240,
      prompt: 'Three candidates of distinct unknown quality are interviewed in random order. After each you must accept or reject irrevocably, seeing only relative ranks. Playing optimally, what is the probability of hiring the best candidate?',
      answerType: 'numeric', correctAnswer: 0.5, tolerance: 0.01,
      hint: 'Reject the first, then take the next candidate better than everyone seen so far.', recognitionTechnique: 'Optimal stopping',
      approach: 'Enumerate all 3! orders under the "reject 1, then take the next record" rule.',
      solution: 'Rejecting the first and taking the next record-setter succeeds in 3 of the 6 orderings, giving 1/2 — better than the 1/3 from picking blindly.',
      commonTrap: 'Applying the 1/e rule for large n to the n = 3 case.', tags: ['stopping']
    },
    {
      id: 'h036', topic: 'Optimal Strategy', subtopic: 'Threshold rules', difficulty: 5, targetTime: 270,
      prompt: 'You roll a fair six-sided die and may accept the value or reroll, up to a maximum of three rolls in total; you are paid the value of the roll you accept (if you reach the third roll you must take it). Playing optimally, what is the expected payout? Answer to four decimals.',
      answerType: 'numeric', correctAnswer: 4.6667, tolerance: 0.02,
      hint: 'Work backwards from the final roll.', recognitionTechnique: 'Optimal stopping',
      approach: 'Backward induction: value of the last roll is 3.5; with one reroll left, accept ≥ 4.',
      solution: 'Last roll: 3.5. With two rolls left: accept 4,5,6 else reroll ⇒ (4+5+6)/6 + (3/6)·3.5 = 2.5 + 1.75 = 4.25. With three rolls left: accept 5,6 else continue ⇒ (5+6)/6 + (4/6)·4.25 = 1.8333 + 2.8333 = 4.6667.',
      commonTrap: 'Using the same acceptance threshold at every stage.', tags: ['backward induction']
    },
    {
      id: 'h037', topic: 'Game Theory', subtopic: 'Mixed strategies', difficulty: 4, targetTime: 210,
      prompt: 'In a penalty-kick game the kicker shoots left or right and the keeper dives left or right. If they match, the keeper saves; otherwise the kicker scores — except that a shot to the right that is not matched scores only 80% of the time (the kicker sometimes misses). What probability should the kicker place on shooting left in equilibrium? Answer to three decimals.',
      answerType: 'numeric', correctAnswer: 0.444, tolerance: 0.012,
      hint: 'Choose the mix that makes the opponent indifferent between their two actions.', recognitionTechnique: 'Game theory',
      approach: 'Indifference principle: pick p so the keeper’s expected concession is equal for both dives.',
      solution: 'Let p = P(shoot left). Keeper dives left ⇒ concedes 0.8(1−p); dives right ⇒ concedes p. Setting p = 0.8 − 0.8p gives p = 0.8/1.8 = 4/9 ≈ 0.444.',
      commonTrap: 'Making yourself indifferent instead of your opponent.', tags: ['nash']
    },
    {
      id: 'h038', topic: 'Game Theory', subtopic: 'Dominance', difficulty: 3, targetTime: 120,
      prompt: 'Two players simultaneously name an integer from 0 to 100; the winner is whoever is closest to two-thirds of the average of all numbers named. If both players are perfectly rational and know the other is, what number should you name?',
      answerType: 'numeric', correctAnswer: 0, tolerance: 0,
      hint: 'Iteratively delete dominated strategies.', recognitionTechnique: 'Game theory',
      approach: 'Iterated elimination of strictly dominated strategies converges to the unique equilibrium.',
      solution: 'Nothing above 67 can ever win, so those are deleted; then nothing above 44; iterating drives the upper bound to 0. The unique Nash equilibrium is 0 for both players.',
      commonTrap: 'Stopping the iteration after one or two rounds (answering 33 or 22) — that is optimal against real humans, not against a rational opponent.', tags: ['nash']
    },
    {
      id: 'h039', topic: 'Game Theory', subtopic: 'Combinatorial games', difficulty: 4, targetTime: 180,
      prompt: 'A pile has 21 stones. Players alternate removing 1, 2 or 3 stones; whoever takes the last stone wins. You move first. How many stones should you take to guarantee a win?',
      answerType: 'numeric', correctAnswer: 1, tolerance: 0,
      hint: 'Which pile sizes are losing for the player about to move?', recognitionTechnique: 'Game theory',
      approach: 'Nim-style parity: multiples of 4 are losing positions for the player to move.',
      solution: 'Positions divisible by 4 are losses for the mover. 21 = 4·5 + 1, so take 1 and leave 20; thereafter always complete the opponent’s move to 4.',
      commonTrap: 'Taking the maximum of 3 each turn.', tags: ['nim']
    },

    /* ------------------ INFORMATION / IMPOSSIBILITY ----------------- */
    {
      id: 'h040', topic: 'Information Problems', subtopic: 'Weighings', difficulty: 5, targetTime: 300,
      prompt: 'You have 12 visually identical balls; exactly one has a different weight (heavier or lighter, unknown which). Using a balance scale with no weights, what is the minimum number of weighings that always identifies the odd ball and whether it is heavy or light?',
      answerType: 'numeric', correctAnswer: 3, tolerance: 0,
      hint: 'Each weighing has three outcomes; count how many distinguishable answers you need.', recognitionTechnique: 'Information / impossibility',
      approach: 'Information-theoretic lower bound (3ⁿ ≥ number of outcomes) plus an explicit strategy achieving it.',
      solution: 'There are 24 possible answers (12 balls × heavy/light). Two weighings distinguish at most 3² = 9 < 24, so 2 is impossible; three give 27 ≥ 24, and the classic 4-4 split strategy achieves it. Answer: 3.',
      commonTrap: 'Giving a strategy without proving the lower bound — the "minimum" claim needs both halves.', tags: ['lower bound']
    },
    {
      id: 'h041', topic: 'Information Problems', subtopic: 'Comparisons', difficulty: 4, targetTime: 210,
      prompt: 'What is the minimum number of pairwise comparisons needed to identify both the maximum and the minimum of 10 distinct numbers in the worst case?',
      answerType: 'numeric', correctAnswer: 13, tolerance: 0,
      hint: 'Compare elements in pairs first, then run two separate tournaments.', recognitionTechnique: 'Information / impossibility',
      approach: 'Pair-first strategy giving ⌈3n/2⌉ − 2, matched by an adversary lower-bound argument.',
      solution: 'Split into 5 pairs (5 comparisons), then find the max among the 5 winners (4) and the min among the 5 losers (4): 13 total = ⌈3·10/2⌉ − 2.',
      commonTrap: 'Answering 2n − 3 = 17 by running the two tournaments independently.', tags: ['lower bound']
    },
    {
      id: 'h042', topic: 'Information Problems', subtopic: 'Tournament design', difficulty: 5, targetTime: 300,
      prompt: '25 horses race; a track holds 5 horses at a time and gives only the finishing order, with no timing. What is the minimum number of races needed to determine the fastest three horses?',
      answerType: 'numeric', correctAnswer: 7, tolerance: 0,
      hint: 'After the group stage plus a race of winners, most horses are eliminated by transitivity.', recognitionTechnique: 'Information / impossibility',
      approach: 'Elimination by transitive dominance, then a single decisive final race.',
      solution: '5 group races, then a race of the 5 winners (race 6) fixes the overall fastest and eliminates all horses dominated by three others. Exactly 5 candidates remain for places 2 and 3, settled in race 7. Total 7.',
      commonTrap: 'Answering 6 by forgetting that second and third could come from the winner’s own group.', tags: ['lower bound']
    },
    {
      id: 'h043', topic: 'Information Problems', subtopic: 'Search', difficulty: 4, targetTime: 210,
      prompt: 'You must find one counterfeit coin among 27 coins, known to be lighter than the rest, using a balance scale. What is the minimum number of weighings that always suffices?',
      answerType: 'numeric', correctAnswer: 3, tolerance: 0,
      hint: 'Each weighing partitions into three equal groups.', recognitionTechnique: 'Information / impossibility',
      approach: 'Ternary search: each weighing has 3 outcomes so it can reduce the candidate set by a factor of 3.',
      solution: '27 = 3³, so three weighings suffice (split into three 9s, then 3s, then singles) and two cannot (3² = 9 < 27).',
      commonTrap: 'Splitting into halves — binary search wastes the third outcome of a balance.', tags: ['ternary']
    },

    /* ---------------------- MARKETS / TRADING ----------------------- */
    {
      id: 'h044', topic: 'Market Making', subtopic: 'Kelly sizing', difficulty: 4, targetTime: 180,
      prompt: 'You can bet on an event with true probability 0.60 at even money (win 1 for 1). What fraction of your bankroll maximises the long-run growth rate?',
      answerType: 'numeric', correctAnswer: 0.2, tolerance: 0.01,
      hint: 'Edge divided by odds.', recognitionTechnique: 'Other',
      approach: 'Kelly criterion f* = (bp − q)/b.',
      solution: 'b = 1, p = 0.6, q = 0.4 ⇒ f* = (0.6 − 0.4)/1 = 0.2, i.e. 20% of bankroll.',
      commonTrap: 'Betting the full edge (60%) or the whole bankroll — that maximises expected wealth but ruins growth.', tags: ['kelly']
    },
    {
      id: 'h045', topic: 'Market Making', subtopic: 'Fair value', difficulty: 4, targetTime: 210,
      prompt: 'A contract pays €100 if a fair coin lands heads twice in a row within the next two flips, and €0 otherwise. You are shown a market of 20 bid / 30 offered. What is your expected profit, in euros, from taking the best available trade for one contract?',
      answerType: 'numeric', correctAnswer: 5, tolerance: 0.5,
      hint: 'Fair value first, then compare with both sides of the market.', recognitionTechnique: 'Direct calculation',
      approach: 'Compute fair value, then take the side offering positive edge and size the edge.',
      solution: 'P(HH in exactly two flips) = 1/4, so fair value is €25. The offer at 30 is above fair value, so sell at 30 for €5 of expected edge. (Buying at 20 would also be a €5 edge — either side works here; the answer is €5.)',
      commonTrap: 'Assuming you must buy because the payoff is positive.', tags: ['market making']
    },
    {
      id: 'h046', topic: 'Market Making', subtopic: 'Arbitrage', difficulty: 3, targetTime: 150,
      prompt: 'Three mutually exclusive and exhaustive outcomes are quoted at implied probabilities of 40%, 35% and 30%. If you can buy all three at those prices, what is the guaranteed profit, in cents per €1 of total payout?',
      answerType: 'numeric', correctAnswer: 5, tolerance: 0.5,
      hint: 'Add the implied probabilities.', recognitionTechnique: 'Direct calculation',
      approach: 'Check whether the implied probabilities sum to more or less than 1 (the "overround").',
      solution: 'Total cost = 0.40 + 0.35 + 0.30 = €1.05 for a certain €1 payout — that is a 5-cent loss per €1, so the arbitrage is on the other side: sell all three and lock in 5 cents per €1.',
      commonTrap: 'Assuming a sum above 1 is a buying opportunity — it is the bookmaker’s margin and you must be the seller.', tags: ['arbitrage']
    },
    {
      id: 'h047', topic: 'Finance', subtopic: 'Duration', difficulty: 3, targetTime: 120,
      prompt: 'A bond has modified duration 6.5 and trades at 98. If yields rise by 40 basis points, approximately what is the new price?',
      answerType: 'numeric', correctAnswer: 95.45, tolerance: 0.3,
      hint: 'Percentage price change ≈ −duration × yield change.', recognitionTechnique: 'Direct calculation',
      approach: 'First-order duration approximation ΔP/P ≈ −D_mod·Δy.',
      solution: 'ΔP/P ≈ −6.5 × 0.0040 = −2.6%. New price ≈ 98 × 0.974 = 95.45.',
      commonTrap: 'Subtracting 2.6 points instead of 2.6 percent.', tags: ['rates']
    },
    {
      id: 'h048', topic: 'Finance', subtopic: 'Scenario reasoning', difficulty: 4, targetTime: 180,
      prompt: 'A company beats consensus EPS by 8% but cuts full-year revenue guidance by 5%, and the stock falls. Which single explanation is most consistent with all three facts?',
      answerType: 'mc',
      options: [
        'The market prices forward expectations, and lowered guidance outweighs a backward-looking beat',
        'Earnings beats always cause stocks to fall',
        'The beat must have been an accounting error',
        'Revenue is irrelevant when earnings beat'
      ],
      correctAnswer: 'The market prices forward expectations, and lowered guidance outweighs a backward-looking beat',
      tolerance: 0,
      hint: 'Which piece of information is about the future?', recognitionTechnique: 'Other',
      approach: 'Separate backward-looking results from forward-looking guidance; valuation depends on the latter.',
      solution: 'Price reflects the present value of future cash flows. A realised quarterly beat is largely already known or quickly discounted, while a guidance cut lowers the whole forward path — so the net reaction is negative.',
      commonTrap: 'Treating the beat/miss headline as the whole story.', tags: ['earnings']
    },
    {
      id: 'h049', topic: 'Finance', subtopic: 'Options intuition', difficulty: 4, targetTime: 180,
      prompt: 'A stock trades at 100. A digital option pays €1 if the stock is above 110 in one year and nothing otherwise. Annual volatility is 20%, the drift is zero and rates are zero. Using a normal approximation to log-returns, what is the approximate value of the option? Answer to two decimals.',
      answerType: 'numeric', correctAnswer: 0.31, tolerance: 0.035,
      hint: 'Convert the barrier into a z-score in log space.', recognitionTechnique: 'Direct calculation',
      approach: 'Digital value = risk-neutral probability of finishing above the strike = 1 − Φ(z).',
      solution: 'ln(110/100) = 0.0953. With drift −σ²/2 = −0.02, z = (0.0953 + 0.02)/0.20 ≈ 0.577 (or ≈0.477 ignoring the convexity term). 1 − Φ(0.5) ≈ 0.31.',
      commonTrap: 'Working in price space rather than log space, or forgetting that a digital is just a probability.', tags: ['options']
    },
    {
      id: 'h050', topic: 'Finance', subtopic: 'Expected value in markets', difficulty: 3, targetTime: 150,
      prompt: 'A binary event has a true probability of 35%. The market quotes it at 30 bid / 40 offered (payout 100). Playing only when you have positive expected value, what is your expected profit per contract in the best available trade?',
      answerType: 'numeric', correctAnswer: 5, tolerance: 0.5,
      hint: 'Fair value is 35; compare with both sides.', recognitionTechnique: 'Direct calculation',
      approach: 'Compare fair value with bid and offer; edge is the distance to the side you can trade on.',
      solution: 'Fair value 35. Selling at the offer of 40 gives +5 expected; buying at the bid of 30 also gives +5. Best available edge is 5 per contract.',
      commonTrap: 'Computing the edge from the mid rather than from the price you actually transact at.', tags: ['market making']
    },

    /* -------------------- MIXED / SPEED / SIG STYLE ------------------ */
    {
      id: 'h051', topic: 'Mental Maths', subtopic: 'Approximation', difficulty: 3, targetTime: 45,
      prompt: 'Estimate 1.03^12 to two decimal places.',
      answerType: 'numeric', correctAnswer: 1.43, tolerance: 0.05,
      hint: 'Rule of 72, or (1+x)ⁿ ≈ e^{nx}.', recognitionTechnique: 'Direct calculation',
      approach: 'Exponential approximation e^{0.36} with a small convexity correction.',
      solution: 'e^{0.36} ≈ 1.433; the true value is 1.4258.',
      commonTrap: 'Answering 1.36 by using simple interest.', tags: ['speed']
    },
    {
      id: 'h052', topic: 'Mental Maths', subtopic: 'Percentages', difficulty: 3, targetTime: 40,
      prompt: 'A position loses 20% and then gains 20%. What is the net percentage change, to one decimal place (use a negative sign for a loss)?',
      answerType: 'numeric', correctAnswer: -4, tolerance: 0.15,
      hint: 'Multiply the factors.', recognitionTechnique: 'Direct calculation',
      approach: 'Compounding is multiplicative, so symmetric percentage moves do not cancel.',
      solution: '0.8 × 1.2 = 0.96 ⇒ −4%.',
      commonTrap: 'Answering 0%.', tags: ['speed']
    },
    {
      id: 'h053', topic: 'Probability', subtopic: 'Conditional probability', difficulty: 4, targetTime: 180,
      prompt: 'A family has two children. You are told that at least one is a boy born on a Tuesday. What is the probability both children are boys? Answer to four decimals.',
      answerType: 'numeric', correctAnswer: 0.4815, tolerance: 0.01,
      hint: 'Count the 14 × 14 equally likely (gender, day) pairs.', recognitionTechnique: 'Conditional probability',
      approach: 'Careful sample-space construction over (gender, weekday) pairs for each child.',
      solution: 'Of 196 equally likely combinations, 27 include at least one Tuesday boy, and 13 of those have two boys: 13/27 ≈ 0.4815.',
      commonTrap: 'Answering 1/3 (ignoring the day) or 1/2 — the extra information genuinely shifts the answer.', tags: ['paradox']
    },
    {
      id: 'h054', topic: 'Probability', subtopic: 'Bayes', difficulty: 4, targetTime: 180,
      prompt: 'A coin is picked at random from two: one fair, one double-headed. It is flipped three times and lands heads all three times. What is the probability it is the double-headed coin? Answer to four decimals.',
      answerType: 'numeric', correctAnswer: 0.8889, tolerance: 0.01,
      hint: 'Likelihoods are 1 and 1/8.', recognitionTechnique: 'Bayes',
      approach: 'Bayes with equal priors: posterior odds = likelihood ratio.',
      solution: 'Posterior odds = 1 : 1/8 = 8 : 1, so P = 8/9 ≈ 0.8889.',
      commonTrap: 'Answering 1 — three heads is still possible with a fair coin.', tags: ['bayes']
    },
    {
      id: 'h055', topic: 'Expected Value', subtopic: 'Conditional expectation', difficulty: 5, targetTime: 240,
      prompt: 'You roll a fair six-sided die repeatedly, adding each result to a running total, and stop the first time you roll a 1 (the terminating 1 is not added). What is the expected total?',
      answerType: 'numeric', correctAnswer: 20, tolerance: 0.1,
      hint: 'Condition on the first roll and write a one-line equation for E.', recognitionTechnique: 'Conditioning',
      approach: 'First-step conditioning (or Wald: E[N]·E[value | not 1]).',
      solution: 'E = (5/6)(4 + E), since with probability 5/6 you add a non-1 roll averaging (2+3+4+5+6)/5 = 4 and then face the same problem again. Solving: E/6 = 10/3, so E = 20. Wald check: E[non-1 rolls] = 5, each worth 4 on average.',
      commonTrap: 'Adding the terminating 1, or using 3.5 as the average of a scoring roll.', tags: ['wald']
    },
    {
      id: 'h056', topic: 'Expected Value', subtopic: 'Linearity', difficulty: 4, targetTime: 180,
      prompt: 'A fair coin is flipped 100 times. What is the expected number of positions i (1 ≤ i ≤ 99) at which flip i and flip i+1 show the same face?',
      answerType: 'numeric', correctAnswer: 49.5, tolerance: 0.2,
      hint: 'One indicator per adjacent pair.', recognitionTechnique: 'Indicator variables',
      approach: 'Indicator per adjacent pair + linearity; overlapping pairs are dependent but that is irrelevant.',
      solution: 'Each of the 99 adjacent pairs matches with probability 1/2, so E = 99/2 = 49.5.',
      commonTrap: 'Worrying about the dependence between overlapping pairs.', tags: ['linearity']
    },
    {
      id: 'h057', topic: 'Combinatorics', subtopic: 'Inclusion-exclusion', difficulty: 4, targetTime: 210,
      prompt: 'How many permutations of the letters A, B, C, D, E have no letter in its original alphabetical position?',
      answerType: 'numeric', correctAnswer: 44, tolerance: 0,
      hint: 'Inclusion–exclusion over the five "letter is fixed" events.', recognitionTechnique: 'Counting',
      approach: 'Derangement of 5 elements: D(5) = 5!·Σ(−1)^k/k!.',
      solution: 'D(5) = 120(1 − 1 + 1/2 − 1/6 + 1/24 − 1/120) = 44.',
      commonTrap: 'Answering 120 − 5 = 115.', tags: ['derangement']
    },
    {
      id: 'h058', topic: 'Order Statistics', subtopic: 'Median', difficulty: 4, targetTime: 180,
      prompt: 'Three independent uniform [0,1] values are drawn. What is the probability that the median of the three exceeds 0.5?',
      answerType: 'numeric', correctAnswer: 0.5, tolerance: 0.005,
      hint: 'The median exceeds 1/2 iff at least two of the three do.', recognitionTechnique: 'Symmetry',
      approach: 'Reduce to a binomial count of how many values exceed 1/2, then use symmetry.',
      solution: 'Each value exceeds 1/2 with probability 1/2. P(at least 2 of 3) = [C(3,2)+C(3,3)]/8 = 4/8 = 1/2 — also immediate by symmetry of the median about 1/2.',
      commonTrap: 'Integrating the Beta(2,2) density when symmetry answers it instantly.', tags: ['order statistics']
    },
    {
      id: 'h059', topic: 'Data Interpretation', subtopic: 'Rate traps', difficulty: 4, targetTime: 180,
      prompt: 'Treatment A cures 80 of 100 mild cases and 30 of 100 severe cases. Treatment B cures 18 of 20 mild cases and 60 of 180 severe cases. Which statement is correct?',
      answerType: 'mc',
      options: [
        'A has the higher overall cure rate, but B is better within each severity group',
        'A has the higher overall cure rate and is better within each group',
        'B has the higher overall cure rate and is better within each group',
        'B has the higher overall cure rate, but A is better within each group'
      ],
      correctAnswer: 'A has the higher overall cure rate, but B is better within each severity group',
      tolerance: 0,
      hint: 'Compute the four within-group rates and the two pooled rates separately.', recognitionTechnique: 'Other',
      approach: "Simpson's paradox: pooling across groups with very different case mixes can reverse the comparison.",
      solution: 'Mild: A 80% vs B 90%. Severe: A 30% vs B 33.3%. B wins both. Pooled: A 110/200 = 55%, B 78/200 = 39% — A wins overall, because B treated 90% severe cases while A treated only 50%.',
      commonTrap: 'Reading only the pooled row of an exhibit without checking the case mix behind it.', tags: ['simpson', 'mckinsey']
    },
    {
      id: 'h060', topic: 'Constraint Optimisation', subtopic: 'Shadow prices', difficulty: 4, targetTime: 210,
      prompt: 'A workshop makes chairs (profit €40, needs 2 hours of machining) and tables (profit €90, needs 5 hours). Only 100 machining hours are available and there is no other constraint. What is the maximum total profit, in euros?',
      answerType: 'numeric', correctAnswer: 2000, tolerance: 0,
      hint: 'Compare profit per hour of the binding resource.', recognitionTechnique: 'Other',
      approach: 'Single-constraint LP: allocate everything to the highest profit per unit of the scarce resource.',
      solution: 'Chairs: €20/hour. Tables: €18/hour. With one binding constraint, produce only chairs: 50 chairs × €40 = €2,000.',
      commonTrap: 'Choosing tables because their absolute profit per unit is higher.', tags: ['optimisation', 'mckinsey']
    }
  ];

  // Apply any answer overrides written during authoring, then freeze the bank.
  Q.forEach((q) => {
    if (Object.prototype.hasOwnProperty.call(q, 'correctAnswerOverride')) {
      q.correctAnswer = q.correctAnswerOverride;
      delete q.correctAnswerOverride;
    }
    if (q.tolerance === undefined) q.tolerance = q.answerType === 'numeric' ? 0.01 : 0;
    q.source = 'curated';
  });

  global.QTL_BANK = {
    questions: Q,
    add(q) { q.source = q.source || 'curated'; Q.push(q); return Q.length; },
    addMany(list) { list.forEach(this.add, this); return Q.length; }
  };
})(window);
