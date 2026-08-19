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
      prompt: 'A permutation can be broken into "cycles": starting from any element, repeatedly follow where the permutation sends it, and you eventually loop back to where you started — that loop is one cycle (for example, a permutation sending 1→3→1 and 2→2 has a 2-element cycle {1,3} and a separate 1-element cycle {2}). A uniformly random permutation of 1..n is drawn. What is the probability that the elements 1 and 2 end up in the same cycle?',
      answerType: 'numeric', correctAnswer: 0.5, tolerance: 0.001,
      hint: 'Trace out the cycle containing element 1 one step at a time, and think about how likely element 2 is to join it before the cycle simply closes.', recognitionTechnique: 'Symmetry',
      approach: 'Sequential construction of the cycle containing 1; at the moment the cycle is about to close, 2 is as likely to be inside as outside.',
      solution: 'Build the cycle containing element 1 one step at a time: starting from 1, follow the permutation to whichever element it maps to, then follow that element, and so on, until the chain closes back to 1. At every step, the next element added is chosen uniformly at random from all elements not yet in the chain, OR the chain closes back to 1 — both options are equally likely at each draw. So element 2 (if not yet visited) is exactly as likely to be pulled into the chain at any given step as the chain is to close without it. This head-to-head symmetry between "2 joins next" and "the cycle closes next" gives element 2 a probability of exactly 1/2 = 0.5 of ending up in 1\'s cycle — and this argument never actually depends on n, since it only compares 2\'s chances against the closing option, not against the total number of elements.',
      commonTrap: 'Assuming the answer depends on n.', tags: ['permutations']
    },
    {
      id: 'h004', topic: 'Expected Value', subtopic: 'Cycles', difficulty: 4, targetTime: 150,
      prompt: 'A permutation can be broken into "cycles" — closed loops formed by repeatedly following where each element is sent (e.g. a permutation sending 1→3→1 has a 2-element cycle {1,3}; an element sent to itself, like 2→2, is its own 1-element cycle). What is the expected TOTAL NUMBER of cycles in a uniformly random permutation of 5 elements? Give your answer to three decimal places.',
      answerType: 'numeric', correctAnswer: 2.283, tolerance: 0.01,
      hint: 'Build the permutation by tracing out one cycle at a time — at the moment k elements are still unplaced, what is the chance THIS step is the one that closes off the current cycle?', recognitionTechnique: 'Indicator variables',
      approach: 'Sequential construction: the k-th step closes a cycle with probability 1/(n−k+1); linearity gives the harmonic number.',
      solution: 'Build the permutation by tracing out its cycles one at a time: pick an unvisited element, then repeatedly pick its image uniformly among the still-unvisited elements or the option to close the current cycle. At the moment k elements remain unplaced, the chance THIS step closes off a cycle (rather than continuing it) is exactly 1/k. Using an indicator variable for "a cycle closes at this step" and summing via linearity of expectation as k runs through 5, 4, 3, 2, 1 (the number of elements still unplaced at each successive step) gives E[number of cycles] = 1/5 + 1/4 + 1/3 + 1/2 + 1/1 = 1 + 1/2 + 1/3 + 1/4 + 1/5 = 2.2833. (This sum, 1+1/2+...+1/n, is called the n-th harmonic number, written H_n.)',
      commonTrap: 'Confusing the expected number of cycles with the expected cycle length.', tags: ['permutations', 'linearity']
    },
    {
      id: 'h005', topic: 'Expected Value', subtopic: 'Indicator variables', difficulty: 3, targetTime: 120,
      prompt: 'Five cards are dealt from a standard deck. What is the expected number of distinct suits represented in the hand? Answer to three decimals.',
      answerType: 'numeric', correctAnswer: 3.114, tolerance: 0.01,
      hint: 'For each of the 4 suits, ask: what is the probability that suit is completely ABSENT from the hand? That is usually easier to count directly than "present."', recognitionTechnique: 'Indicator variables',
      approach: 'Indicator per suit: P(suit present) = 1 − C(39,5)/C(52,5); multiply by 4.',
      solution: 'For each of the 4 suits, define an indicator that equals 1 if at least one card of that suit appears in the 5-card hand. By linearity of expectation, the expected number of DISTINCT suits represented is just the sum of the 4 individual "this suit appears" probabilities — so start by finding P(a given suit is completely absent), since that is easier to count directly. A suit is absent exactly when all 5 cards are drawn from the other 39 cards (the 3 remaining suits, 13 cards each): P(absent) = C(39,5)/C(52,5) = 575757/2598960 ≈ 0.2215. So P(that suit appears) ≈ 1 − 0.2215 = 0.7785, and by symmetry this is the same for every suit. Summing all 4 (equivalently, 4 × 0.7785) gives E[distinct suits] ≈ 3.114.',
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
      hint: 'Track two "progress" states — no useful head yet, or one head just seen — and write a first-step equation for the expected remaining flips from each.', recognitionTechnique: 'Recursion',
      approach: 'Markov chain on states {∅, H, HH} and solve the linear system.',
      solution: 'Track your progress toward HH with two states: state ∅ (no progress) and state H (you just flipped a head, one more head away from success). Let a = expected additional flips from state ∅, and b = expected additional flips from state H. From state ∅: flip once; with probability ½ it\'s tails, and you\'re still in state ∅ (a more flips needed); with probability ½ it\'s heads, moving you to state H (b more needed). This gives a = 1 + ½a + ½b. From state H: flip once; with probability ½ it\'s heads, completing HH (0 more flips needed); with probability ½ it\'s tails, sending you all the way back to state ∅ (a more flips needed — a single tails wipes out the earlier head entirely). This gives b = 1 + ½a. Substituting b = 1 + ½a into the first equation: a = 1 + ½a + ½(1 + ½a) = 1.5 + ¾a, so ¼a = 1.5, giving a = 6 (and b = 1 + ½·6 = 4).',
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
      hint: 'Track your progress by the CURRENT RUN LENGTH of consecutive heads (0, 1, or 2) — a single tails at any point resets the run all the way back to 0, not down by one.', recognitionTechnique: 'Recursion',
      approach: 'States by current run length; the general result is 2^{n+1} − 2.',
      solution: 'Track progress by the current run of consecutive heads: state a (run length 0), state b (run length 1), state c (run length 2). From state a: with probability ½ a tails keeps the run at 0 (a more flips needed); with probability ½ a head starts a run of 1 (b more needed): a = 1 + ½a + ½b. From state b: with probability ½ a tails BREAKS the run entirely, back to 0 (a more needed, not "run length 0.5" — a single tails wipes out all progress); with probability ½ a head extends the run to 2 (c more needed): b = 1 + ½a + ½c. From state c: with probability ½ a head completes HHH (0 more needed); with probability ½ a tails resets to 0 (a more needed): c = 1 + ½a. Solving: substitute c = 1+½a into b = 1+½a+½(1+½a) = 1.5+¾a, then substitute into a = 1+½a+½(1.5+¾a) = 1.75+⅞a, giving ⅛a = 1.75, so a = 14. (The general pattern for n heads in a row is 2^(n+1)−2 — each extra required head roughly doubles the wait, since one failure at the end still sends you all the way back to zero progress.)',
      commonTrap: 'Multiplying the HH answer by 1.5.', tags: ['markov']
    },
    {
      id: 'h013', topic: 'Recursion', subtopic: 'Gambler’s ruin', difficulty: 4, targetTime: 180,
      prompt: 'You start with €30 and bet €1 on fair coin flips until you reach €100 or go broke. What is the probability you reach €100?',
      answerType: 'numeric', correctAnswer: 0.3, tolerance: 0.005,
      hint: 'In a fair game, your win probability starting from €k must equal the exact average of the win probabilities starting from €(k+1) and €(k−1) — what kind of function has that property?', recognitionTechnique: 'Recursion',
      approach: 'Gambler’s ruin with p = 1/2: P(hit N before 0 from k) = k/N.',
      solution: 'Let P(k) be the probability of reaching €100 before going broke, starting from €k. Since the game is fair, after one bet your wealth becomes k+1 (probability ½) or k−1 (probability ½), so P(k) = ½P(k+1) + ½P(k−1) — meaning P(k) must always equal the exact average of its two neighbouring values. Combined with the boundary conditions P(0)=0 (already broke, can\'t win) and P(100)=1 (already reached the goal), the only function that satisfies "each value is the exact average of its neighbours" everywhere is the straight LINE P(k) = k/100. Starting from k=30: P(30) = 30/100 = 0.3.',
      commonTrap: 'Believing a long enough session improves the odds — it does not in a fair game.', tags: ['martingale']
    },
    {
      id: 'h014', topic: 'Recursion', subtopic: 'Markov chains', difficulty: 4, targetTime: 210,
      prompt: 'An ant walks on the vertices of a cube, at each step moving to one of the three adjacent vertices uniformly at random. Starting at one vertex, what is the expected number of steps to reach the diagonally opposite vertex?',
      answerType: 'numeric', correctAnswer: 10, tolerance: 0.1,
      hint: 'Group the 8 vertices by their distance (0, 1, 2, or 3 edges away) from the target, and work out how many of each vertex\'s 3 neighbours move it one distance closer versus one distance farther.', recognitionTechnique: 'Recursion',
      approach: 'State lumping by graph distance, then solve three linear equations.',
      solution: 'Group the 8 cube vertices by graph distance from the target: distance 3 (the start — the single vertex diagonally opposite the target), distance 2 (3 vertices), distance 1 (3 vertices), and distance 0 (the target). Every vertex has exactly 3 neighbours, and moving along any edge changes the distance to the target by exactly ±1. From the distance-3 start, ALL 3 neighbours are at distance 2 (there is nowhere farther to go from the single most-distant vertex), so a = 1 + b, where a, b, c are the expected remaining steps from distance 3, 2, 1. From a distance-2 vertex, exactly 2 of its 3 neighbours are one step closer (distance 1) and 1 neighbour is one step farther (back to distance 3): b = 1 + (2/3)c + (1/3)a. From a distance-1 vertex, exactly 1 of its 3 neighbours IS the target (distance 0, done) and the other 2 are one step farther (back to distance 2): c = 1 + (2/3)b. Solving: substitute a = 1+b into b\'s equation to get b = 1+(2/3)c+(1/3)(1+b), i.e. (2/3)b = 4/3+(2/3)c, so b = 2+c. Substitute into c = 1+(2/3)b = 1+(2/3)(2+c) to get (1/3)c = 7/3, so c = 7, then b = 9, and a = 1+b = 10.',
      commonTrap: 'Treating all seven non-target vertices as one state.', tags: ['markov']
    },
    {
      id: 'h015', topic: 'Expected Value', subtopic: 'Coupon collector', difficulty: 3, targetTime: 120,
      prompt: 'What is the expected number of rolls of a fair six-sided die needed to see every face at least once? Answer to one decimal place.',
      answerType: 'numeric', correctAnswer: 14.7, tolerance: 0.1,
      hint: 'Split the process into 6 stages — one per new face collected — and find the expected number of EXTRA rolls needed at each stage, given how many distinct faces you already have.', recognitionTechnique: 'Conditioning',
      approach: 'Coupon collector: 6(1 + 1/2 + 1/3 + 1/4 + 1/5 + 1/6).',
      solution: 'Break the process into 6 stages, one for each new face collected. In the stage where you already have k distinct faces, each roll shows a genuinely new face with probability (6−k)/6, so the number of rolls needed for that stage is geometric with expected value 6/(6−k). Summing the expected length of all 6 stages, for k=0,1,2,3,4,5 distinct faces already held: 6/6 + 6/5 + 6/4 + 6/3 + 6/2 + 6/1 = 6×(1 + 1/2 + 1/3 + 1/4 + 1/5 + 1/6) = 6×2.45 = 14.7 rolls. (The bracketed sum, 1+1/2+...+1/6, is the 6th harmonic number.)',
      commonTrap: 'Answering 6.', tags: ['stages']
    },

    /* ------------------------- DICE & COUNTING ---------------------- */
    {
      id: 'h016', topic: 'Combinatorics', subtopic: 'Dice sums', difficulty: 3, targetTime: 120,
      prompt: 'Three fair six-sided dice are rolled. What is the probability their sum is exactly 10?',
      answerType: 'numeric', correctAnswer: 0.125, tolerance: 0.004,
      hint: 'Shift each die value down by 1 to remove the "≥1" restriction, then count solutions — but watch out, some of those solutions would need a die to show more than 6.', recognitionTechnique: 'Counting',
      approach: 'Stars and bars with inclusion–exclusion for the face-value cap of 6.',
      solution: 'We want ordered triples (x₁,x₂,x₃), each from 1 to 6, with x₁+x₂+x₃=10. Substitute yᵢ=xᵢ−1 (so each yᵢ runs from 0 to 5): this becomes y₁+y₂+y₃=7 with each 0≤yᵢ≤5. Ignoring the upper limit of 5 for a moment, the number of non-negative integer solutions to y₁+y₂+y₃=7 is C(7+2,2)=C(9,2)=36. But this count includes impossible cases where some yᵢ≥6 (i.e. the original die would need to show more than 6) — if one yᵢ is at least 6, substituting y\'ᵢ=yᵢ−6 turns the equation into y\'ᵢ+(other two)=1, which has C(1+2,2)=C(3,2)=3 solutions; since 7 is too small for two variables to both need this correction, exactly one of the 3 positions can be the oversized one, giving 3×3=9 invalid cases to remove: 36−9=27 valid triples. With 6³=216 equally likely outcomes for three dice, the probability is 27/216 = 1/8 = 0.125.',
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
      hint: 'Total unrestricted arrangements of 4 opens and 4 closes, minus the ones that go negative at some point — count the "bad" ones using a reflection trick that turns each invalid sequence into an arrangement with one extra closing bracket.', recognitionTechnique: 'Counting',
      approach: 'Catalan number C_n = C(2n,n)/(n+1).',
      solution: 'Without any restriction, there are C(8,4)=70 ways to arrange 4 opening and 4 closing brackets in a row (choose which 4 of the 8 positions are opening brackets). Some of these arrangements are invalid — at some point reading left to right, they have more closing brackets than opening ones so far. By a classical reflection argument: take any INVALID sequence, find the first position where it goes wrong (one more closing than opening), and flip every bracket after that point (swap every "(" for ")" and vice versa) — this bijects each invalid sequence of 4 opens/4 closes to a sequence with 3 opens and 5 closes (one fewer opening bracket than closing, overall), of which there are C(8,3)=56. This means exactly 56 of the 70 total arrangements are invalid, leaving 70−56=14 valid ones. (This count is called the 4th Catalan number, and the general formula C(2n,n)/(n+1) = C(8,4)/5 = 70/5 = 14 gives the same answer.)',
      commonTrap: 'Answering C(8,4) = 70 and ignoring the prefix condition.', tags: ['catalan']
    },
    {
      id: 'h021', topic: 'Combinatorics', subtopic: 'Ballot problems', difficulty: 5, targetTime: 210,
      prompt: 'Candidate A receives 7 votes and candidate B receives 3 votes. Votes are counted in a uniformly random order. What is the probability that A is strictly ahead throughout the entire count? Answer to one decimal place as a percentage.',
      answerType: 'numeric', correctAnswer: 40, tolerance: 0.6,
      hint: 'Start with an easy necessary condition: which candidate must receive the very FIRST vote counted, for "strictly ahead throughout" to even be possible?', recognitionTechnique: 'Counting',
      approach: 'Bertrand’s ballot theorem: P = (a − b)/(a + b).',
      solution: 'This is Bertrand\'s ballot problem. A necessary starting observation: the very FIRST vote counted must go to A — if the first counted vote were B\'s, A would already be behind at the very first step, violating "strictly ahead throughout" immediately. Among the P(first vote is A) = a/(a+b) chance the count starts correctly, a further reflection-principle argument (pairing each remaining "bad" sequence, where A ties or falls behind again, with a specific "good" one) shows that, conditional on the first vote being A\'s, A stays strictly ahead throughout with probability (a−b)/a. Multiplying: (a/(a+b)) × ((a−b)/a) = (a−b)/(a+b). Plugging in a=7, b=3: (7−3)/(7+3) = 4/10 = 0.4 = 40%.',
      commonTrap: 'Confusing "always strictly ahead" with "ahead at the end" (which has probability 1 here).', tags: ['ballot']
    },
    {
      id: 'h022', topic: 'Combinatorics', subtopic: 'Number theory counting', difficulty: 2, targetTime: 90,
      prompt: 'How many trailing zeros does 100! have?',
      answerType: 'numeric', correctAnswer: 24, tolerance: 0,
      hint: 'Trailing zeros come from factors of 10=2×5; since factors of 2 are far more plentiful than factors of 5 in 100!, count only how many times 5 divides in — but don\'t forget multiples of 25 contribute an extra factor of 5 each.', recognitionTechnique: 'Counting',
      approach: 'Legendre’s formula: count factors of 5.',
      solution: 'A trailing zero in 100! comes from a factor of 10 = 2×5 in the product 1×2×3×...×100. Since even numbers are far more common than multiples of 5 among 1 to 100, the number of factors of 2 is always much larger than the number of factors of 5 — so the number of trailing zeros is limited entirely by how many times 5 divides into 100!, not by the 2\'s. Count the factors of 5: numbers 5,10,15,...,100 each contribute at least one factor of 5 — there are ⌊100/5⌋=20 of them. But some numbers contribute a SECOND factor of 5: multiples of 25 (25,50,75,100) each contain 5²=25, so they contribute one extra factor of 5 beyond what was already counted — there are ⌊100/25⌋=4 of them. (No number ≤100 is a multiple of 125=5³, so there\'s no third layer.) Total factors of 5 in 100! = 20+4 = 24, so 100! has exactly 24 trailing zeros.',
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
      hint: 'Find E[max] and E[min] separately (the CDF of the max is P(max≤x)=xⁿ; the min is a mirror image of the max by symmetry), then subtract.', recognitionTechnique: 'Order statistics',
      approach: 'E[range] = E[max] − E[min] = n/(n+1) − 1/(n+1).',
      solution: 'The gap between the smallest and largest of the 3 points is the RANGE, E[max]−E[min]. For n independent Uniform[0,1] points, the maximum has CDF P(max≤x)=xⁿ (all n points must individually be below x), which gives E[max]=n/(n+1) — for n=3, E[max]=3/4. By the symmetry x↦1−x, the minimum of n uniform points has the mirror-image distribution, giving E[min]=1/(n+1) — for n=3, E[min]=1/4. So E[range] = E[max]−E[min] = 3/4−1/4 = 1/2 = 0.5 (equivalently, the general formula (n−1)/(n+1) = 2/4 = 0.5 for n=3).',
      commonTrap: 'Assuming the range is 1 minus twice the mean of a single point.', tags: ['uniform']
    },
    {
      id: 'h026', topic: 'Order Statistics', subtopic: 'Minimum of exponentials', difficulty: 4, targetTime: 150,
      prompt: 'Three independent exponential clocks have rates 1, 2 and 3 per hour. What is the expected time, in hours, until the first one rings? Answer to four decimals.',
      answerType: 'numeric', correctAnswer: 0.1667, tolerance: 0.004,
      hint: 'P(the minimum of several independent clocks exceeds t) requires ALL clocks to individually exceed t — multiply their individual survival probabilities together and see what distribution results.', recognitionTechnique: 'Order statistics',
      approach: 'Rates add: min of Exp(λᵢ) is Exp(Σλᵢ), so E = 1/Σλᵢ.',
      solution: 'For the FIRST of several independent exponential clocks to ring by time t, ALL of them must not yet have rung — so P(min > t) = P(clock 1 > t)×P(clock 2 > t)×P(clock 3 > t) = e^(−1t)×e^(−2t)×e^(−3t) = e^(−(1+2+3)t) = e^(−6t), since independent probabilities multiply and the exponents add. This is exactly the survival function of an exponential distribution with rate 1+2+3=6 — so the minimum itself is exponentially distributed with the SUMMED rate, and its mean is 1/(sum of rates) = 1/6 ≈ 0.1667 hours (10 minutes).',
      commonTrap: 'Averaging the three individual means (1, 1/2, 1/3).', tags: ['exponential']
    },
    {
      id: 'h027', topic: 'Order Statistics', subtopic: 'Competing risks', difficulty: 4, targetTime: 150,
      prompt: 'Two independent exponential clocks have rates 2 and 3 per hour. What is the probability that the rate-2 clock rings first?',
      answerType: 'numeric', correctAnswer: 0.4, tolerance: 0.005,
      hint: 'The clock with the higher rate should intuitively be more likely to ring first — the exact probability turns out to be its rate as a fraction of the combined rate.', recognitionTechnique: 'Order statistics',
      approach: 'Competing exponentials: P(i first) = λᵢ/Σλ.',
      solution: 'When two independent exponential clocks "race" to ring first, the probability that the rate-λ₁ clock wins is λ₁/(λ₁+λ₂) — intuitively, a clock that rings more frequently (higher rate) is proportionally more likely to be the one that happens to ring first. (This follows from integrating over the time the winning clock rings: P(clock 1 rings first) = ∫₀^∞ λ₁e^(−λ₁t)·e^(−λ₂t) dt = λ₁/(λ₁+λ₂), since the density of clock 1 ringing at time t, times the probability clock 2 hasn\'t rung yet, integrates to that ratio.) Here λ₁=2 and λ₂=3, so P(rate-2 clock rings first) = 2/(2+3) = 2/5 = 0.4.',
      commonTrap: 'Inverting the ratio because "faster means smaller mean".', tags: ['exponential']
    },
    {
      id: 'h028', topic: 'Order Statistics', subtopic: 'Discrete maxima', difficulty: 4, targetTime: 180,
      prompt: 'Four fair six-sided dice are rolled. What is the probability that the maximum shown is exactly 5?',
      answerType: 'numeric', correctAnswer: 0.3117, tolerance: 0.004,
      hint: 'P(max ≤ k) is easy: it just means every one of the 4 dice individually lands at or below k. Use that to sandwich P(max = exactly 5) between P(max≤5) and P(max≤4).', recognitionTechnique: 'Order statistics',
      approach: 'Use the CDF of the maximum: P(max ≤ k) = (k/6)ⁿ.',
      solution: 'P(max ≤ k) means ALL 4 dice show at most k, which happens with probability (k/6)⁴ since each die independently must land in {1,...,k}. The event "max is EXACTLY 5" is the same as "max ≤ 5" but NOT "max ≤ 4" (i.e., at least one die actually reaches 5), so P(max=5) = P(max≤5) − P(max≤4) = (5/6)⁴ − (4/6)⁴ = 625/1296 − 256/1296 = 369/1296 ≈ 0.3117.',
      commonTrap: 'Requiring exactly one die to show 5 rather than at least one.', tags: ['dice']
    },

    /* ------------------------ VARIANCE & STATS ---------------------- */
    {
      id: 'h029', topic: 'Variance', subtopic: 'Correlation bounds', difficulty: 5, targetTime: 240,
      prompt: 'X and Y have correlation 0.8, and Y and Z have correlation 0.8. What is the smallest possible correlation between X and Z? Answer to two decimals.',
      answerType: 'numeric', correctAnswer: 0.28, tolerance: 0.01,
      hint: 'Picture each variable as a unit vector, with correlation = cosine of the angle between vectors. If X-Y and Y-Z each make a known angle, what is the WIDEST possible angle between X and Z, and what correlation does that correspond to?', recognitionTechnique: 'Other',
      approach: 'Positive semi-definiteness of the correlation matrix, or the cosine-of-angles geometry.',
      solution: 'Think of each random variable as a UNIT VECTOR, where the correlation between two variables equals the COSINE of the angle between their vectors (a standard geometric representation of correlation). If the angle between vectors X and Y is θ₁₂ (with cos θ₁₂=0.8) and the angle between Y and Z is θ₂₃ (with cos θ₂₃=0.8), then by the triangle inequality for angles, the angle between X and Z can range from |θ₁₂−θ₂₃| up to θ₁₂+θ₂₃ — the SMALLEST possible correlation ρ₁₃ = cos(θ₁₂+θ₂₃) occurs at the WIDEST possible angle between X and Z. Using the cosine addition formula, cos(θ₁₂+θ₂₃) = cos θ₁₂ cos θ₂₃ − sin θ₁₂ sin θ₂₃ = ρ₁₂ρ₂₃ − √(1−ρ₁₂²)·√(1−ρ₂₃²) = (0.8)(0.8) − √(1−0.64)·√(1−0.64) = 0.64 − (0.6)(0.6) = 0.64 − 0.36 = 0.28.',
      commonTrap: 'Assuming correlation is transitive and answering 0.64 or 0.8.', tags: ['correlation']
    },
    {
      id: 'h030', topic: 'Variance', subtopic: 'Hat-check variance', difficulty: 5, targetTime: 240,
      prompt: 'n coats are returned to n people in a uniformly random order. What is the variance of the number of people who receive their own coat (for n ≥ 2)?',
      answerType: 'numeric', correctAnswer: 1, tolerance: 0.02,
      hint: 'Use indicators Iᵢ = 1 if person i gets their own coat. You\'ll need E[Iᵢ²] AND E[IᵢIⱼ] for i≠j (the probability BOTH i and j get their own coats) to build E[M²].', recognitionTechnique: 'Indicator variables',
      approach: 'Var = E[M²] − (E[M])² with E[M²] = ΣE[Iᵢ] + Σ_{i≠j}E[IᵢIⱼ].',
      solution: 'Let Iᵢ = 1 if person i receives their own coat, and M = ΣIᵢ be the total number of correct matches. E[Iᵢ] = 1/n (person i\'s coat is equally likely to be any of the n coats), so by linearity E[M] = n×(1/n) = 1. For the variance, we need E[M²] = ΣE[Iᵢ²] + Σ_{i≠j}E[IᵢIⱼ]. Since Iᵢ is 0 or 1, Iᵢ²=Iᵢ, so the first sum is just ΣE[Iᵢ] = n×(1/n) = 1. For the second sum: E[IᵢIⱼ] = P(BOTH i and j get their own coat) = 1/(n(n−1)) (person i\'s coat is fixed with probability 1/n, and GIVEN that, person j\'s coat is separately fixed with probability 1/(n−1) among the remaining coats) — there are n(n−1) ordered pairs (i,j) with i≠j, so this sum contributes n(n−1)×1/(n(n−1)) = 1. Total: E[M²] = 1+1 = 2. So Var(M) = E[M²]−(E[M])² = 2−1 = 1, remarkably independent of n.',
      commonTrap: 'Assuming independence of the indicators — they are dependent, but the covariances happen to sum neatly.', tags: ['linearity']
    },
    {
      id: 'h031', topic: 'Variance', subtopic: 'Conditional variance', difficulty: 5, targetTime: 240,
      prompt: 'N is Poisson with mean 4. Given N = n, X is the sum of n independent fair coin indicators (each 1 with probability 1/2). What is Var(X)?',
      answerType: 'numeric', correctAnswer: 2, tolerance: 0.05,
      hint: 'Var(X) = E[Var(X|N)] + Var(E[X|N]) (the law of total variance) — you\'ll need both the conditional variance/mean formulas for a Binomial(N,½), AND the fact that a Poisson distribution\'s variance equals its mean.', recognitionTechnique: 'Conditioning',
      approach: 'Poisson thinning, or Var(X) = E[Var(X|N)] + Var(E[X|N]).',
      solution: 'Given N=n, X is a sum of n independent fair-coin indicators, so X is Binomial(n, ½): E[X|N]=N/2 and Var(X|N)=N×½×½=N/4. To find the overall variance of X, use the law of total variance: Var(X) = E[Var(X|N)] + Var(E[X|N]) — this splits the total variability into "variability within a fixed N" (averaged over N) plus "variability caused by N itself changing." Here E[Var(X|N)] = E[N]/4, and Var(E[X|N]) = Var(N)/4. Since N is Poisson with mean 4, and a defining property of the Poisson distribution is that its mean EQUALS its variance, E[N]=Var(N)=4. So Var(X) = 4/4 + 4/4 = 1+1 = 2. (Consistent with Poisson thinning: taking a Poisson(4) count and independently keeping each item with probability ½ produces a new Poisson(4×½)=Poisson(2) count, whose variance also equals its mean, 2.)',
      commonTrap: 'Using only E[Var(X|N)] and dropping the variance of the conditional mean.', tags: ['law of total variance']
    },
    {
      id: 'h032', topic: 'Distributions', subtopic: 'Normal comparisons', difficulty: 4, targetTime: 180,
      prompt: 'X ~ N(100, 15²) and Y ~ N(94, 20²) are independent. What is P(X > Y)? Answer to three decimals.',
      answerType: 'numeric', correctAnswer: 0.594, tolerance: 0.012,
      hint: 'P(X>Y) is the same as P(X−Y>0) — study the single variable D=X−Y, which is normal too, with mean = difference of the two means, but variance = SUM (not difference) of the two variances.', recognitionTechnique: 'Direct calculation',
      approach: 'Difference of independent normals is normal with variances adding.',
      solution: 'P(X>Y) is the same as P(X−Y>0), so study the single variable D=X−Y. A difference of two INDEPENDENT normal variables is itself normal, with mean = difference of means (100−94=6) and VARIANCE = SUM of the two individual variances (variances always add for independent variables, regardless of whether you are adding or subtracting the variables themselves): Var(D)=15²+20²=225+400=625, so D ~ N(6, 625), with standard deviation √625=25. Standardizing: P(D>0) = P((D−6)/25 > (0−6)/25) = P(Z > −0.24) = P(Z < 0.24) = Φ(0.24), where Φ denotes the standard normal cumulative distribution function (the probability that a standard normal variable is below a given value), and Φ(0.24) ≈ 0.5948 from the standard normal table.',
      commonTrap: 'Adding the standard deviations instead of the variances.', tags: ['normal']
    },
    {
      id: 'h033', topic: 'Distributions', subtopic: 'Poisson thinning', difficulty: 4, targetTime: 150,
      prompt: 'Orders arrive as a Poisson process at 10 per minute, and each independently is a buy with probability 0.3. What is the probability that exactly 2 buy orders arrive in a given minute? Answer to four decimals.',
      answerType: 'numeric', correctAnswer: 0.224, tolerance: 0.006,
      hint: 'Poisson thinning: independently keeping each arrival of a Poisson process with a fixed probability produces another Poisson process, with the rate scaled down by that same probability.', recognitionTechnique: 'Direct calculation',
      approach: 'Poisson thinning gives buys ~ Poisson(10 × 0.3 = 3).',
      solution: 'Orders arrive as a Poisson process at rate 10/minute, and each is independently a "buy" with probability 0.3. A key fact (Poisson thinning) is that independently filtering a Poisson process — keeping each arrival with some fixed probability — produces ANOTHER Poisson process, with rate equal to the original rate times the keep-probability: buy orders alone therefore arrive as Poisson(10×0.3)=Poisson(3) per minute. Using the Poisson probability mass formula P(exactly k arrivals) = e^(−λ)λᵏ/k! with λ=3 and k=2: P(exactly 2 buy orders) = e^(−3)·3²/2! = 0.0498×9/2 = 0.0498×4.5 ≈ 0.2240.',
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
      hint: 'Think about what the HIGHEST possible number could ever be worth naming, then repeat the same logic against an opponent who also reasons that way.', recognitionTechnique: 'Game theory',
      approach: 'Iterated elimination of strictly dominated strategies converges to the unique equilibrium.',
      solution: 'Since the winning number is two-thirds of the AVERAGE of the two numbers named, and that average can never exceed 100, the winning number itself can never exceed (2/3)×100 ≈ 66.7 — so naming anything above 67 is never optimal and can be ruled out. But if both players know neither would ever name above 67, the average can never exceed 67 either, so the winning number can never exceed (2/3)×67 ≈ 44.4 — anything above 44 is now also ruled out. Repeating this reasoning indefinitely (each round shrinking the upper bound by a further factor of 2/3) drives the bound all the way down to 0. Since both players are assumed to reason this way without limit, the unique Nash equilibrium is for both players to name 0.',
      commonTrap: 'Stopping the iteration after one or two rounds (answering 33 or 22) — that is optimal against real humans, not against a rational opponent.', tags: ['nash']
    },
    {
      id: 'h039', topic: 'Game Theory', subtopic: 'Combinatorial games', difficulty: 4, targetTime: 180,
      prompt: 'A pile has 21 stones. Players alternate removing 1, 2 or 3 stones; whoever takes the last stone wins. You move first. How many stones should you take to guarantee a win?',
      answerType: 'numeric', correctAnswer: 1, tolerance: 0,
      hint: 'Work backwards from small piles: figure out which pile sizes are forced losses for whoever must move next, and look for a repeating pattern.', recognitionTechnique: 'Game theory',
      approach: 'Nim-style parity: multiples of 4 are losing positions for the player to move.',
      solution: 'Define a pile size as a "losing position" if the player who must move next will lose under best play from both sides. From a pile of 1, 2, or 3 stones, the mover can simply take all of them and win — these are winning positions. From a pile of exactly 4, whatever the mover takes (1, 2, or 3), they leave 3, 2, or 1 stones — each a winning position for the OPPONENT — so 4 is a losing position. This pattern repeats: from any pile that is a multiple of 4, every possible move leaves a pile that is NOT a multiple of 4 (winning for the opponent, since the opponent can always remove just enough — 1 to 3 stones — to bring the total back down to the next multiple of 4). So piles that are multiples of 4 are exactly the losing positions. With 21 stones (21 = 4×5+1, not a multiple of 4), the first player wins by taking 1 stone, leaving 20 (a multiple of 4, a losing position for the opponent) — then on every later turn, taking enough to bring the total removed that round to 4 keeps handing the opponent a multiple of 4, until the last stone is taken by you.',
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
      hint: 'The Kelly fraction balances edge against odds: f* = (bp−q)/b, where b is the net odds, p is your win probability, and q=1−p.', recognitionTechnique: 'Other',
      approach: 'Kelly criterion f* = (bp − q)/b.',
      solution: 'The Kelly criterion picks the bet size that maximizes the long-run growth rate of wealth, rather than its expected value — betting your whole edge or bankroll grows expected wealth fastest on a single bet, but risks eventual ruin over repeated bets, since one bad streak can be catastrophic. The formula is f* = (bp − q)/b, where b is the net odds received on a win (here b=1, even money), p is your true win probability (0.6), and q=1−p is the loss probability (0.4). Plugging in: f* = (1×0.6 − 0.4)/1 = 0.2/1 = 0.2, meaning you should bet 20% of your bankroll.',
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
      hint: 'A bond\'s "modified duration" measures how sensitive its price is to a small yield change — treat the price change as approximately linear: %ΔP ≈ −(modified duration)×Δy.', recognitionTechnique: 'Direct calculation',
      approach: 'First-order duration approximation ΔP/P ≈ −D_mod·Δy.',
      solution: '"Modified duration" measures a bond\'s price sensitivity to yield changes: for a small yield change Δy, the price changes by approximately −(modified duration)×Δy in percentage terms (negative because prices and yields move in opposite directions). Here modified duration = 6.5 and yields rise by Δy = 0.40% = 0.0040, so ΔP/P ≈ −6.5 × 0.0040 = −0.026 = −2.6%. Applying this to the current price of 98: new price ≈ 98 × (1 − 0.026) = 98 × 0.974 = 95.45.',
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
      hint: 'The value of a digital option is just a probability: convert the barrier into a z-score in log-return space and use the normal CDF, Φ.', recognitionTechnique: 'Direct calculation',
      approach: 'Digital value = risk-neutral probability of finishing above the strike = 1 − Φ(z).',
      solution: 'A digital (cash-or-nothing) option paying €1 if S_T > K is worth exactly the probability that this happens — no option Greeks needed. Work in log space: with zero drift and zero rates, ln(S_T/S_0) is approximately Normal(0, σ²). The barrier corresponds to a log-return of ln(110/100) ≈ 0.0953, which in standard-deviation units is z = 0.0953/0.20 ≈ 0.48. The option pays only if the stock ends up MORE than 0.48 standard deviations above where it started, so its value is 1 − Φ(z) = 1 − Φ(0.48) ≈ 1 − 0.685 = 0.315 ≈ 0.31, where Φ is the standard normal cumulative distribution function (the probability a standard normal variable falls below a given value). (A fully precise risk-neutral treatment shifts z down slightly, by about σ/2 ≈ 0.10, to account for the lognormal mean sitting above its median — this nudges the estimate to about 0.28, still close given the tolerance here; the simple z-score above is the standard first approximation.)',
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
      hint: 'For small x and moderate n, (1+x)ⁿ ≈ e^(nx) — compute nx first, then estimate e raised to that power.', recognitionTechnique: 'Direct calculation',
      approach: 'Exponential approximation e^{0.36} with a small convexity correction.',
      solution: 'For a small growth rate x compounded n times, (1+x)ⁿ ≈ e^(nx) (since ln(1+x)≈x for small x, so n·ln(1+x)≈nx, and (1+x)ⁿ=e^(n·ln(1+x))). Here x=0.03 and n=12, so nx=0.36, giving (1.03)¹² ≈ e^0.36. Estimating e^0.36 by splitting it as e^0.3 × e^0.06 ≈ 1.35 × 1.06 ≈ 1.43. (The true value is 1.4258, very close to this estimate.)',
      commonTrap: 'Answering 1.36 by using simple interest.', tags: ['speed']
    },
    {
      id: 'h052', topic: 'Mental Maths', subtopic: 'Percentages', difficulty: 3, targetTime: 40,
      prompt: 'A position loses 20% and then gains 20%. What is the net percentage change, to one decimal place (use a negative sign for a loss)?',
      answerType: 'numeric', correctAnswer: -4, tolerance: 0.15,
      hint: 'A 20% loss and a 20% gain are NOT symmetric in dollar terms — the gain applies to a smaller base than the loss did. Multiply the growth factors instead of adding the percentages.', recognitionTechnique: 'Direct calculation',
      approach: 'Compounding is multiplicative, so symmetric percentage moves do not cancel.',
      solution: 'Percentage changes compound multiplicatively, not additively, so a 20% loss followed by a 20% gain do NOT cancel out. Starting from a factor of 1, a 20% loss leaves 1−0.20=0.8, and a 20% gain on THAT smaller amount multiplies by 1+0.20=1.2: 0.8×1.2=0.96 — a net factor of 0.96, i.e. a 4% loss overall, because the 20% gain is computed on a smaller starting base than the original 20% loss was, so it doesn\'t fully recover it. Net change: −4%.',
      commonTrap: 'Answering 0%.', tags: ['speed']
    },
    {
      id: 'h053', topic: 'Probability', subtopic: 'Conditional probability', difficulty: 4, targetTime: 180,
      prompt: 'A family has two children. You are told that at least one is a boy born on a Tuesday. What is the probability both children are boys? Answer to four decimals.',
      answerType: 'numeric', correctAnswer: 0.4815, tolerance: 0.01,
      hint: 'Build the full sample space: each child independently has one of 2 genders × 7 weekdays = 14 equally likely (gender, day) combinations, giving 14×14=196 equally likely combinations for the family. Count how many satisfy "at least one Tuesday boy," then how many of those have two boys.', recognitionTechnique: 'Conditional probability',
      approach: 'Careful sample-space construction over (gender, weekday) pairs for each child.',
      solution: 'Model each child as an independent, uniformly random (gender, day-of-week) pair — 2×7=14 equally likely combinations per child, so 14×14=196 equally likely combinations for the family. We\'re told "at least one child is a boy born on a Tuesday" (event T): child 1 is a Tuesday-boy (1 fixed combo) with child 2 being anything (14 combos) gives 14, or child 2 is a Tuesday-boy similarly gives 14, but this double-counts "both are Tuesday-boys" (1 combo), so |T| = 14+14−1 = 27. Now count how many of those 27 have BOTH children boys: child 1 is a Tuesday-boy with child 2 any of the 7 boy-days gives 7, or child 2 is a Tuesday-boy with child 1 any of the 7 boy-days gives 7, minus the double-counted both-Tuesday-boys case (1): 7+7−1 = 13. So P(both boys | T) = 13/27 ≈ 0.4815 — noticeably different from the "no day information" answer of 1/3, because the specific, unlikely detail (Tuesday) makes it disproportionately likely that only ONE child triggered the event, not both.',
      commonTrap: 'Answering 1/3 (ignoring the day) or 1/2 — the extra information genuinely shifts the answer.', tags: ['paradox']
    },
    {
      id: 'h054', topic: 'Probability', subtopic: 'Bayes', difficulty: 4, targetTime: 180,
      prompt: 'A coin is picked at random from two: one fair, one double-headed. It is flipped three times and lands heads all three times. What is the probability it is the double-headed coin? Answer to four decimals.',
      answerType: 'numeric', correctAnswer: 0.8889, tolerance: 0.01,
      hint: 'Compare the LIKELIHOODS of seeing three heads under each hypothesis (fair vs double-headed), then combine with the equal 50/50 prior using Bayes\' rule.', recognitionTechnique: 'Bayes',
      approach: 'Bayes with equal priors: posterior odds = likelihood ratio.',
      solution: 'There are two equally likely hypotheses to start (prior 50/50): the coin is FAIR or DOUBLE-HEADED. Compute the likelihood of the observed data (three heads in three flips) under each: if fair, P(3 heads)=(1/2)³=1/8; if double-headed, P(3 heads)=1 (it always lands heads). By Bayes\' rule, posterior odds = prior odds × likelihood ratio: (double-headed : fair) = 1:1 × (1 : 1/8) = 1 : 1/8, the same as 8 : 1. Converting odds of 8:1 to a probability: P(double-headed) = 8/(8+1) = 8/9 ≈ 0.8889.',
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
      hint: 'Use inclusion-exclusion: start with all 5! arrangements, subtract those that fix at least one letter, add back those fixing at least two (to correct for double-subtracting), and so on.', recognitionTechnique: 'Counting',
      approach: 'Derangement of 5 elements: D(5) = 5!·Σ(−1)^k/k!.',
      solution: 'This is a "derangement" count — an arrangement where NO letter ends up in its original position (e.g. for {A,B,C}, {B,C,A} is a derangement but {A,C,B} is not, since A stays in position 1). Use inclusion-exclusion over the 5 "letter i is fixed" events: start with all 5!=120 permutations, subtract those fixing at least one letter, add back those fixing at least two (since they were subtracted twice), subtract those fixing at least three, and so on, alternating signs: D(5) = 120×(1 − 1 + 1/2 − 1/6 + 1/24 − 1/120) = 120×(60/120 − 20/120 + 5/120 − 1/120) = 120×(44/120) = 44.',
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
    },

    /* ------------------------ MARKOV / STATE PROBLEMS --------------------- */
    {
      id: 'h061', topic: 'Recursion', subtopic: 'Hitting times', difficulty: 4, targetTime: 180,
      prompt: 'A token sits on state 0 of {0, 1, 2}. State 0 is a reflecting barrier (from 0 it always moves to 1). From state 1 it moves to state 0 or to state 2, each with probability 1/2. State 2 is absorbing. What is the expected number of steps, starting from state 0, to reach state 2?',
      answerType: 'numeric', correctAnswer: 4, tolerance: 0.01,
      hint: 'Write the two first-step equations for h_0 and h_1, using h_2 = 0.', recognitionTechnique: 'Recursion',
      approach: 'First-step analysis: h_0 = 1 + h_1 (reflecting); h_1 = 1 + ½h_0 + ½h_2, with h_2 = 0.',
      solution: 'h_1 = 1 + ½h_0. Substituting into h_0 = 1 + h_1 = 1 + 1 + ½h_0 = 2 + ½h_0, so ½h_0 = 2 and h_0 = 4. (This matches the general symmetric-reflecting-barrier result h_0 = n² for n=2 states of travel.)',
      commonTrap: 'Treating state 0 as absorbing (giving h_0 = 0) instead of reflecting, which still costs one step every time the walk lands there.', tags: ['markov', 'hitting time']
    },
    {
      id: 'h062', topic: 'Recursion', subtopic: 'Absorption probability', difficulty: 4, targetTime: 180,
      prompt: 'A gambler with a biased coin (P(win) = 0.6 each round) starts with €2 and bets €1 per round, stopping at €0 or €4. What is the probability they reach €4 before going broke? Give your answer as an exact fraction or to four decimals.',
      answerType: 'numeric', correctAnswer: 0.6923, tolerance: 0.002, acceptFraction: [9, 13],
      hint: 'This is asymmetric — the fair-game formula k/N (which would give 1/2) does not apply here.', recognitionTechnique: 'Recursion',
      approach: "Asymmetric gambler's ruin: P(hit N before 0 | start k) = (1-(q/p)^k)/(1-(q/p)^N), with p=0.6, q=0.4.",
      solution: 'q/p = 2/3. P = (1 − (2/3)²)/(1 − (2/3)⁴) = (5/9)/(65/81) = 45/65 = 9/13 ≈ 0.6923.',
      commonTrap: 'Answering k/N = 2/4 = 0.5 by using the SYMMETRIC gambler\'s-ruin formula, which only holds when p = q = 0.5.', tags: ['markov', "gambler's ruin", 'absorption']
    },
    {
      id: 'h063', topic: 'Recursion', subtopic: 'Stationary distribution', difficulty: 3, targetTime: 150,
      prompt: 'A machine is either "Up" or "Down" each day. If Up, it stays Up the next day with probability 0.9 (Down with probability 0.1). If Down, it becomes Up the next day with probability 0.6 (stays Down with probability 0.4). In the long run, what fraction of days is the machine Up?',
      answerType: 'numeric', correctAnswer: 0.8571, tolerance: 0.002, acceptFraction: [6, 7],
      hint: 'Balance the flow between the two states: the rate of Up→Down transitions must equal the rate of Down→Up transitions in steady state.', recognitionTechnique: 'Recursion',
      approach: 'Two-state stationary distribution via detailed balance: π_Up · P(Up→Down) = π_Down · P(Down→Up).',
      solution: 'π_Up·0.1 = π_Down·0.6 ⇒ π_Up/π_Down = 6. With π_Up+π_Down=1: π_Up = 6/7 ≈ 0.8571, π_Down = 1/7 ≈ 0.1429.',
      commonTrap: 'Averaging the two "stay" probabilities (0.9 and 0.4) instead of solving the actual balance equations.', tags: ['markov', 'stationary distribution']
    },
    {
      id: 'h064', topic: 'Recursion', subtopic: 'Hitting times', difficulty: 3, targetTime: 150,
      prompt: 'A FAIR coin-flip random walk starts at €3 and stops at €0 or €5 (both ends absorbing — this is the classic gambler\'s ruin setup, NOT a reflecting barrier). What is the expected number of steps until the walk stops?',
      answerType: 'numeric', correctAnswer: 6, tolerance: 0.01,
      hint: 'For a symmetric walk with two absorbing barriers, the expected duration has a one-line closed form: k(N−k).', recognitionTechnique: 'Recursion',
      approach: 'Symmetric gambler\'s ruin duration formula: E[steps | start k, absorbing at 0 and N] = k(N−k).',
      solution: 'k=3, N=5: E = 3·(5−3) = 3·2 = 6 steps.',
      commonTrap: 'Confusing this two-sided-absorbing setup with a reflecting-barrier setup (whose expected duration follows a different formula, n² when starting at the reflecting end) — always check whether BOTH ends are absorbing or only one.', tags: ['markov', "gambler's ruin", 'hitting time']
    },

    /* ------------------------ BRAINTEASERS / INVARIANTS ------------------- */
    {
      id: 'h065', topic: 'Brainteasers', subtopic: 'Parity arguments', difficulty: 3, targetTime: 120,
      prompt: 'A standard 8×8 chessboard has its two diagonally opposite corner squares removed (both corners are the same colour on a standard board). Can the remaining 62 squares be exactly covered by 31 dominoes, each covering two adjacent squares?',
      answerType: 'mc',
      options: ['No — impossible', 'Yes — always possible', 'Only if the dominoes can be rotated', 'Only on boards larger than 8×8'],
      correctAnswer: 'No — impossible',
      tolerance: 0,
      hint: 'Count how many squares of each colour remain after the two same-coloured corners are removed.', recognitionTechnique: 'Other',
      approach: 'Colouring/parity invariant: every domino covers exactly one black and one white square, so the two colour-counts must stay equal for a tiling to exist.',
      solution: 'A full 8×8 board has 32 squares of each colour. The two removed corners are the SAME colour (opposite corners always match on a standard board), leaving 32 of one colour and 30 of the other. Since every domino covers one of each colour, 31 dominoes would need to cover 31+31, not 32+30 — impossible.',
      commonTrap: 'Trying to find an explicit tiling by trial and error instead of noticing the colour-count invariant rules it out immediately, before any tiling attempt.', tags: ['invariant', 'parity', 'coloring', 'classic']
    },
    {
      id: 'h070', topic: 'Brainteasers', subtopic: 'Parity arguments', difficulty: 4, targetTime: 150,
      prompt: 'On a standard 8×8 chessboard, ANY one black square and ANY one white square are removed (not necessarily corners, and not necessarily adjacent). Is the remaining 62-square board always guaranteed to be exactly tileable by 31 dominoes, no matter which black square and which white square were chosen?',
      answerType: 'mc',
      options: ['Yes — always tileable', 'No — it depends on exactly which two squares were removed', 'Only if the two removed squares are adjacent', 'Only if the two removed squares are far apart'],
      correctAnswer: 'Yes — always tileable',
      tolerance: 0,
      hint: 'The colour-count invariant only tells you when a tiling is IMPOSSIBLE (unequal counts) — here the counts are still equal (31 and 31). A separate, stronger classical result covers this case.', recognitionTechnique: 'Other',
      approach: "Gomory's theorem: removing any one black square and any one white square from a standard chessboard always leaves a board that can be perfectly tiled by dominoes, regardless of which two squares (of opposite colour) were removed.",
      solution: 'Removing one square of each colour leaves 31 black and 31 white squares — the colour-count invariant no longer rules anything out. A classical result (Gomory\'s theorem, provable by tracing a Hamiltonian cycle through all 64 squares and pairing consecutive squares along it) guarantees a full tiling always exists in this case, regardless of exactly where the two removed squares are.',
      commonTrap: 'Assuming that because the two-SAME-colour case (h065) is impossible, removing two DIFFERENT-coloured squares must sometimes also fail depending on position — the colour-count invariant is necessary but the equal-colour-count case is always sufficient here, a genuinely stronger guarantee than parity alone would suggest.', tags: ['invariant', 'parity', 'coloring']
    },
    {
      id: 'h066', topic: 'Brainteasers', subtopic: 'Invariants', difficulty: 4, targetTime: 150,
      prompt: 'The numbers 1 through 20 are written on a whiteboard. Repeatedly, two numbers a and b are erased and replaced by the single number a + b − 1, reducing the count on the board by one each time. This continues until exactly one number remains. What is that final number?',
      answerType: 'numeric', correctAnswer: 191, tolerance: 0,
      hint: 'Track how the TOTAL SUM of all numbers on the board changes with each operation.', recognitionTechnique: 'Other',
      approach: 'Invariant tracking: each operation replaces a+b with a+b−1, so the total sum on the board decreases by exactly 1 every single operation, regardless of which two numbers are chosen.',
      solution: 'Initial sum = 1+2+...+20 = 210. Going from 20 numbers to 1 number takes 19 operations, and each operation reduces the total sum by exactly 1, so the final sum (which equals the single remaining number) is 210 − 19 = 191 — the same regardless of which pairs were chosen at each step.',
      commonTrap: 'Assuming the final answer depends on the specific order in which numbers are combined, when the sum-minus-one-per-operation invariant makes the final result the same no matter what order is used.', tags: ['invariant', 'conservation']
    },
    {
      id: 'h067', topic: 'Brainteasers', subtopic: 'Parity arguments', difficulty: 3, targetTime: 120,
      prompt: '9 coins are laid out, 5 showing tails and 4 showing heads. A move consists of choosing any two coins and flipping both simultaneously. Is it possible to reach a state where all 9 coins show heads?',
      answerType: 'mc',
      options: ['No — impossible', 'Yes — always possible', 'Only if the two chosen coins are adjacent', 'Only after an even number of moves'],
      correctAnswer: 'No — impossible',
      tolerance: 0,
      hint: 'Each move changes the number of tails by 0, +2, or −2 — what property of the tails count never changes?', recognitionTechnique: 'Other',
      approach: 'Invariant identification: the PARITY of the tails count is preserved by every move (each move changes it by an even amount), so it can only reach another value of the same parity.',
      solution: 'The tails count starts at 5 (odd). Every move changes it by 0, +2, or −2 — always an even amount — so the parity of the tails count never changes. The all-heads target has 0 tails (even), which has different parity from 5, so it can never be reached, regardless of how many moves are made.',
      commonTrap: 'Assuming enough moves can eventually reach any target state, without checking whether a conserved quantity (here, the parity of the tails count) rules it out entirely.', tags: ['invariant', 'parity']
    },
    {
      id: 'h068', topic: 'Brainteasers', subtopic: 'Parity arguments', difficulty: 4, targetTime: 150,
      prompt: 'The numbers 1 through 11 are to be arranged around a circle so that every pair of adjacent numbers sums to an odd number. Is this possible?',
      answerType: 'mc',
      options: ['No — impossible', 'Yes — always possible', 'Only if 11 is placed first', 'Only if the numbers are arranged in increasing order'],
      correctAnswer: 'No — impossible',
      tolerance: 0,
      hint: 'Two numbers sum to an odd number only when one is even and the other is odd — what does that force about the arrangement around the whole circle?', recognitionTechnique: 'Other',
      approach: 'Parity 2-colouring argument: requiring every adjacent sum to be odd forces even and odd numbers to strictly alternate all the way around the circle — but a circle with an ODD number of positions cannot be 2-coloured in a strictly alternating pattern.',
      solution: 'Every adjacent pair summing to odd means parities must strictly alternate (even, odd, even, odd, ...) all the way around. But going around a circle of 11 (odd) positions and alternating, the 11th number would need to differ in parity from BOTH its neighbours including the 1st number, yet after an odd number of alternations you return to the same parity as the start — a direct contradiction. (There are 6 odd numbers and 5 even numbers among 1-11, which also cannot alternate evenly around an odd-length circle.) No arrangement can satisfy the condition.',
      commonTrap: 'Only checking a few sample positions instead of recognizing that alternating parity around an ODD-length cycle is structurally impossible, regardless of which specific numbers are used.', tags: ['invariant', 'parity', 'coloring']
    },
    {
      id: 'h069', topic: 'Brainteasers', subtopic: 'Invariants', difficulty: 4, targetTime: 150,
      prompt: 'You have two unmarked jugs, one holding exactly 4 litres and the other exactly 6 litres, plus an unlimited water supply and a drain. Using only "fill a jug completely," "empty a jug completely," and "pour from one jug into the other until either the source is empty or the destination is full," is it possible to end up with exactly 3 litres in either jug?',
      answerType: 'mc',
      options: ['No — impossible', 'Yes — always possible', 'Only using the 6-litre jug', 'Only using the 4-litre jug'],
      correctAnswer: 'No — impossible',
      tolerance: 0,
      hint: 'Every amount you can ever measure with jugs of capacity a and b is a multiple of gcd(a,b).', recognitionTechnique: 'Other',
      approach: 'Number-theoretic invariant: with fill/empty/pour operations between two jugs of integer capacities a and b, every reachable water amount is always a multiple of gcd(a,b) (a consequence of Bézout\'s identity).',
      solution: 'gcd(4,6) = 2. Every quantity reachable in either jug through fill/empty/pour operations must be a multiple of 2 (0, 2, 4, or 6 litres) — 3 is not a multiple of 2, so it can never be measured exactly, no matter how many operations are used.',
      commonTrap: 'Trying to search for a specific sequence of pours by trial and error, instead of first checking whether the target is even a multiple of gcd(capacity 1, capacity 2), which rules it out immediately when it is not.', tags: ['invariant', 'number theory', 'gcd']
    },

    /* --------------------- DICE GAMES / NON-STANDARD DICE ------------------ */
    {
      id: 'h071', topic: 'Dice Games', subtopic: 'Non-transitive dice', difficulty: 4, targetTime: 180,
      prompt: 'Three non-standard dice: Die A has faces {2,2,4,4,9,9}. Die B has faces {1,1,6,6,8,8}. Die C has faces {3,3,5,5,7,7}. What is P(A beats B) (A shows the strictly higher number)? Answer to four decimals.',
      answerType: 'numeric', correctAnswer: 0.5556, tolerance: 0.001, acceptFraction: [5, 9],
      hint: 'Enumerate all 36 (A,B) face pairs directly — there is no shortcut formula for custom dice.', recognitionTechnique: 'Counting',
      approach: 'Direct enumeration of all 36 equally likely face pairs, counting how many have A > B.',
      solution: 'A=2 (×2 occurrences) beats B\'s two 1s (2 wins) each: 4 wins total, 8 losses. A=4 (×2) same pattern vs B: 4 wins, 8 losses. A=9 (×2) beats all 6 B faces: 12 wins, 0 losses. Total: 20 wins out of 36 = 5/9 ≈ 0.5556.',
      commonTrap: 'Assuming "beats" is transitive the way it is for numbers — remarkably, B beats C with the same 5/9 probability, and C beats A with the same 5/9 probability too, forming a full non-transitive cycle A→B→C→A despite every pairwise probability being IDENTICAL.', tags: ['dice', 'non-transitive', 'classic']
    },
    {
      id: 'h072', topic: 'Dice Games', subtopic: 'Non-transitive dice', difficulty: 3, targetTime: 120,
      prompt: 'Using the same three dice as above (A beats B with probability 5/9, B beats C with probability 5/9), does it follow that A beats C with probability greater than 1/2?',
      answerType: 'mc',
      options: [
        'No — in fact C beats A (also with probability 5/9), the opposite of what transitivity would suggest',
        'Yes — "beats" must be transitive, so A beats C with probability greater than 1/2',
        'It is exactly 1/2, since the three dice are symmetric',
        'It cannot be determined without simulating the dice'
      ],
      correctAnswer: 'No — in fact C beats A (also with probability 5/9), the opposite of what transitivity would suggest',
      tolerance: 0,
      hint: 'This is precisely what makes these dice "non-transitive" — check the actual cycle, not an assumed ordering.', recognitionTechnique: 'Other',
      approach: 'Non-transitivity: with custom dice, "A beats B" and "B beats C" do NOT imply "A beats C" the way ordinary number comparisons would.',
      solution: 'Direct enumeration of C vs A shows C actually beats A with probability 5/9 — the complete opposite of what transitivity (A>B, B>C ⟹ A>C) would predict. The three dice form a genuine rock-paper-scissors-style cycle: A beats B, B beats C, C beats A, each with the same 5/9 probability.',
      commonTrap: 'Assuming pairwise "beats" relationships must chain transitively, the way ≥ does for ordinary real numbers — non-standard dice are the classic counterexample showing this assumption can fail completely.', tags: ['dice', 'non-transitive', 'classic']
    },
    {
      id: 'h073', topic: 'Dice Games', subtopic: 'Non-transitive dice', difficulty: 4, targetTime: 150,
      prompt: 'You are shown three non-transitive dice (each beats one of the others with probability 5/9, in a cycle, as above) and are told an opponent will pick one die first, and then you pick one of the remaining two. Should you prefer to pick first or second?',
      answerType: 'mc',
      options: [
        'Second — whichever die the opponent picks, one of the remaining two dice beats it with probability 5/9',
        'First — picking first always guarantees at least a 50% edge',
        'It makes no difference — all three dice are equally good against each other',
        'First, because the opponent might pick a weak die by mistake'
      ],
      correctAnswer: 'Second — whichever die the opponent picks, one of the remaining two dice beats it with probability 5/9',
      tolerance: 0,
      hint: 'Because the "beats" relationship cycles (A beats B, B beats C, C beats A), every single die is beaten by exactly one other die.',
      recognitionTechnique: 'Other',
      approach: 'Exploiting the non-transitive cycle: since every die in the cycle is beaten by exactly one of the other two, the SECOND picker can always identify and choose the die that beats whatever was picked first.',
      solution: 'Because the three dice form a cycle (A beats B, B beats C, C beats A), every die has exactly one "predator" among the other two. Picking second lets you always select that predator die, giving you a 5/9 edge regardless of what the opponent picked first — picking first is actually the WORSE position here, the opposite of intuition from most games.',
      commonTrap: 'Assuming picking first is always advantageous, as in most games — non-transitive dice specifically invert this intuition because there is no single "best" die, only a cycle of relative advantages.', tags: ['dice', 'non-transitive', 'strategy']
    },
    {
      id: 'h074', topic: 'Dice Games', subtopic: 'Comparing distributions', difficulty: 3, targetTime: 120,
      prompt: 'Which has the higher variance: a single roll of a fair 12-sided die (faces 1-12), or the sum of two independent fair 6-sided dice?',
      answerType: 'mc',
      options: [
        'The single d12 roll',
        'The sum of two d6 rolls',
        'They have exactly the same variance',
        'Variance cannot be compared across different numbers of dice'
      ],
      correctAnswer: 'The single d12 roll',
      tolerance: 0,
      hint: 'Compute each variance directly: Var(uniform 1..n) = (n²−1)/12 for one die; variances of independent dice simply add for a sum.',
      recognitionTechnique: 'Direct calculation',
      approach: 'Var(single die, uniform 1..n) = (n²−1)/12. Var(sum of independent dice) = sum of each die\'s individual variance.',
      solution: 'Var(d12) = (12²−1)/12 = 143/12 ≈ 11.92. Var(one d6) = (6²−1)/12 = 35/12 ≈ 2.92, so Var(sum of two d6) = 2×35/12 ≈ 5.83. The single d12 has roughly double the variance of the two-d6 sum, even though both range from a similar minimum and the d6 sum has a wider raw range (2-12 vs 1-12) — summing independent dice concentrates probability toward the middle (a discrete analogue of the Central Limit Theorem), sharply reducing variance relative to a single flat/uniform roll.',
      commonTrap: 'Assuming a wider RANGE (2-12 for two d6, vs 1-12 for one d12) means higher variance — range and variance are different measures of spread, and summing independent dice concentrates mass near the middle, reducing variance despite an unchanged or even wider range.', tags: ['dice', 'variance', 'comparing distributions']
    },
    {
      id: 'h075', topic: 'Dice Games', subtopic: 'Conditional win probability', difficulty: 4, targetTime: 150,
      prompt: 'Die A has faces {1, 3, 5, 6, 8, 10}. Die B has faces {2, 4, 4, 7, 7, 9}. Given that die A shows an ODD number, what is the probability that A beats B (shows a strictly higher number)? Answer to four decimals.',
      answerType: 'numeric', correctAnswer: 0.2222, tolerance: 0.001, acceptFraction: [2, 9],
      hint: 'Restrict die A to only its odd faces {1,3,5}, then compare each against all 6 faces of B.', recognitionTechnique: 'Conditional probability',
      approach: 'Condition on A\'s odd faces only ({1,3,5}), pair each against all 6 faces of B, and count A-wins among those 18 equally likely outcomes.',
      solution: 'A\'s odd faces are {1,3,5}. A=1 beats none of B\'s faces {2,4,4,7,7,9} (0 wins). A=3 beats only B\'s 2 (1 win). A=5 beats B\'s 2 and both 4s (3 wins). Total wins = 0+1+3 = 4 out of 3×6=18 equally likely pairs = 4/18 = 2/9 ≈ 0.2222.',
      commonTrap: 'Comparing A\'s odd faces against only PART of die B\'s faces, or forgetting to restrict A to its odd faces in the first place and using all 6 A faces instead.', tags: ['dice', 'conditional probability']
    },
    {
      id: 'h076', topic: 'Dice Games', subtopic: 'Non-transitive dice', difficulty: 3, targetTime: 120,
      prompt: 'A game uses three non-transitive dice arranged in a cycle (A beats B, B beats C, C beats A, each with probability 5/9). If you play many rounds always picking the die that beats your opponent\'s LAST-round die (switching your choice as needed), can your opponent ever adjust their strategy to beat you consistently?',
      answerType: 'mc',
      options: [
        'No — for any die they choose, you can always pick the one specific die from the cycle that beats it',
        'Yes — they can always find a die that beats yours in return, since the relationship is symmetric',
        'It depends on how many total dice are in the game',
        'Only if they switch dice faster than you do'
      ],
      correctAnswer: 'No — for any die they choose, you can always pick the one specific die from the cycle that beats it',
      tolerance: 0,
      hint: 'This is the same structural fact as the "pick second" advantage — every die in a 3-cycle has exactly one predator.',
      recognitionTechnique: 'Other',
      approach: 'Structural property of a 3-cycle: every die is beaten by exactly one other specific die, so a player who always reacts second (choosing after seeing the opponent\'s die) can always select that predator.',
      solution: 'Because the cycle has exactly three dice with each beaten by exactly one other, reacting to the opponent\'s choice always lets you pick the one die that beats theirs — the opponent cannot escape this by switching dice, since whichever die they pick, exactly one of the other two beats it with probability 5/9.',
      commonTrap: 'Assuming the disadvantaged player can "counter-adjust" the way one might in a game with more strategic depth — a 3-cycle\'s structure specifically guarantees the second-mover always has a beating die available, with no escape via switching.', tags: ['dice', 'non-transitive', 'strategy']
    },

    /* ------------------- GEOMETRY / COLLISION PROBABILITY ------------------ */
    {
      id: 'h077', topic: 'Probability', subtopic: 'Geometric probability', difficulty: 2, targetTime: 90,
      prompt: 'A point (X, Y) is chosen uniformly at random inside the unit square [0,1]×[0,1]. What is P(X + Y < 1)?',
      answerType: 'numeric', correctAnswer: 0.5, tolerance: 0.002, acceptFraction: [1, 2],
      hint: 'Sketch the line X+Y=1 across the unit square — which side has less area, and by how much?', recognitionTechnique: 'Direct calculation',
      approach: 'Geometric probability: the region X+Y<1 within the unit square is a right triangle; divide its area by the square\'s area (1).',
      solution: 'The line X+Y=1 cuts the unit square exactly along its diagonal, splitting it into two equal-area right triangles. The region X+Y<1 is one of them, with area 1/2 = 0.5. Since the square has area 1, P(X+Y<1) = 0.5.',
      commonTrap: 'Overcomplicating a simple linear boundary with integration when the region is visibly just half the square by symmetry.', tags: ['geometry', 'random point']
    },
    {
      id: 'h078', topic: 'Probability', subtopic: 'Geometric probability', difficulty: 4, targetTime: 180,
      prompt: 'Alice arrives at a cafe at a uniformly random time between 0 and 60 minutes past the hour and waits 10 minutes for Bob. Bob arrives at a uniformly random time between 0 and 60 minutes past the hour and waits 20 minutes for Alice, independently of Alice\'s arrival time. What is the probability they meet? Answer to four decimals.',
      answerType: 'numeric', correctAnswer: 0.4306, tolerance: 0.004,
      hint: 'The waiting times are no longer equal, so the two "miss" regions in the arrival-time square are DIFFERENT-sized triangles — handle them separately.', recognitionTechnique: 'Direct calculation',
      approach: 'Geometric probability with asymmetric waits: they meet iff X−Y ≤ 10 AND Y−X ≤ 20, so the two "miss" triangles (one per direction) have different leg lengths, (60−10) and (60−20).',
      solution: 'The two disjoint "miss" regions have areas (60−10)²/2 = 1250 and (60−20)²/2 = 800, totalling 2050, out of the full 60×60=3600 square. P(miss) = 2050/3600 = 0.5694. P(meet) = 1 − 0.5694 = 0.4306.',
      commonTrap: 'Reusing the SYMMETRIC formula 1−((T−w)/T)² with a single w, which only applies when both people wait the same amount of time.', tags: ['geometry', 'meeting problem']
    },
    {
      id: 'h079', topic: 'Probability', subtopic: 'Geometric probability', difficulty: 3, targetTime: 150,
      prompt: 'Two independent points X and Y are each drawn uniformly from [0, 1]. What is E[|X − Y|]?',
      answerType: 'numeric', correctAnswer: 0.3333, tolerance: 0.002, acceptFraction: [1, 3],
      hint: '|X−Y| equals the range (max minus min) of the two points — use the known expected max and expected min for n=2 uniform points.', recognitionTechnique: 'Order statistics',
      approach: 'E[|X−Y|] = E[max(X,Y)] − E[min(X,Y)], using the standard order-statistic results E[max] = n/(n+1) and E[min] = 1/(n+1) for n=2 uniform [0,1] points.',
      solution: 'For n=2 uniform points, E[max] = 2/3 and E[min] = 1/3, so E[|X−Y|] = E[max]−E[min] = 2/3 − 1/3 = 1/3 ≈ 0.3333.',
      commonTrap: 'Assuming E[|X−Y|] = |E[X]−E[Y]| = 0 by linearity — absolute value does not commute with expectation, and the two independent points are not literally equal just because their means are.', tags: ['geometry', 'order statistics', 'uniform']
    },
    {
      id: 'h080', topic: 'Probability', subtopic: 'Geometric probability', difficulty: 3, targetTime: 150,
      prompt: 'A point (X, Y) is chosen uniformly at random inside the unit square [0,1]×[0,1]. What is P(Y < X²)?',
      answerType: 'numeric', correctAnswer: 0.3333, tolerance: 0.002, acceptFraction: [1, 3],
      hint: 'The favourable region is bounded by a curve, not a straight line — integrate the curve\'s height across the square.', recognitionTechnique: 'Direct calculation',
      approach: 'Geometric probability with a curved boundary: the area under y=x² for x from 0 to 1 is ∫₀¹x²dx.',
      solution: '∫₀¹ x² dx = [x³/3]₀¹ = 1/3 ≈ 0.3333. Since the square has area 1, this integral directly gives P(Y < X²).',
      commonTrap: 'Treating the curved boundary y=x² as if it were a straight line (which would incorrectly give an area of 1/2, the same as a linear boundary through similar endpoints).', tags: ['geometry', 'random point', 'integration']
    },

    /* ---------------------------- NUMBER THEORY ---------------------------- */
    {
      id: 'h081', topic: 'Probability', subtopic: 'Number theory', difficulty: 3, targetTime: 150,
      prompt: 'Three fair six-sided dice are rolled. What is the probability that the sum of all three is divisible by 3?',
      answerType: 'numeric', correctAnswer: 0.3333, tolerance: 0.001, acceptFraction: [1, 3],
      hint: 'Look at each die\'s value modulo 3 — how many of the 6 faces give each possible remainder?', recognitionTechnique: 'Other',
      approach: 'Symmetry via modular arithmetic: each die\'s face values {1,...,6} contain exactly two faces giving each residue mod 3 (residue 0: {3,6}; residue 1: {1,4}; residue 2: {2,5}), so each die\'s remainder mod 3 is itself perfectly uniform over {0,1,2}, and the sum of independent uniform-mod-3 remainders is also uniform mod 3.',
      solution: 'Each die is equally likely to land on remainder 0, 1, or 2 (mod 3), since exactly two of its six faces give each remainder. Because this holds independently for all three dice, the sum\'s remainder mod 3 is also exactly uniform over {0,1,2} — so P(sum divisible by 3) = 1/3 ≈ 0.3333, regardless of how many dice are rolled (as long as each die individually has this uniform-residue property).',
      commonTrap: 'Assuming you need to enumerate all 216 outcomes by brute force — recognizing that each die is already uniform mod 3 gives the answer immediately, with no counting required at all.', tags: ['number theory', 'modular arithmetic', 'dice']
    },
    {
      id: 'h082', topic: 'Probability', subtopic: 'Number theory', difficulty: 2, targetTime: 100,
      prompt: 'Two fair six-sided dice are rolled. What is the probability that their sum is divisible by 4?',
      answerType: 'numeric', correctAnswer: 0.25, tolerance: 0.001, acceptFraction: [1, 4],
      hint: 'List the sums from 2 to 12 that are multiples of 4, then count the ways to make each.', recognitionTechnique: 'Counting',
      approach: 'Direct counting: identify which sums (4, 8, 12) are divisible by 4, and count the number of (die 1, die 2) combinations giving each.',
      solution: 'Sum=4: 3 ways (1+3,2+2,3+1). Sum=8: 5 ways (2+6,3+5,4+4,5+3,6+2). Sum=12: 1 way (6+6). Total = 3+5+1 = 9 out of 36 equally likely outcomes. P = 9/36 = 1/4 = 0.25.',
      commonTrap: 'Assuming the sum\'s remainder mod 4 is uniform (as it happens to be for mod 3 with a single die) — this does NOT generally hold for every modulus, so it must be checked directly by counting rather than assumed by symmetry.', tags: ['number theory', 'modular arithmetic', 'dice']
    },
    {
      id: 'h083', topic: 'Probability', subtopic: 'Number theory', difficulty: 3, targetTime: 120,
      prompt: 'Two integers X and Y are each chosen independently and uniformly at random from {1, 2, ..., 12}. What is the probability that X and Y are coprime (gcd(X,Y)=1)? Answer to four decimals.',
      answerType: 'numeric', correctAnswer: 0.6319, tolerance: 0.002, acceptFraction: [91, 144],
      hint: 'For a small, specific N like 12, count the coprime pairs directly rather than using the large-N asymptotic constant 6/π².', recognitionTechnique: 'Counting',
      approach: 'Direct counting over the 12×12=144 ordered pairs, checking gcd(x,y)=1 for each.',
      solution: 'Counting all ordered pairs (x,y) with x,y ∈ {1,...,12} and gcd(x,y)=1 gives exactly 91 coprime pairs out of 144 total. P = 91/144 ≈ 0.6319.',
      commonTrap: 'Using the asymptotic large-N constant 6/π² ≈ 0.6079 as if it applied exactly here — that limit is only approached as N→∞, and is noticeably off for a small, finite N=12.', tags: ['number theory', 'gcd', 'coprime']
    },

    /* ------------------- RANDOM PERMUTATIONS: CYCLES ----------------------- */
    {
      id: 'h084', topic: 'Symmetry', subtopic: 'Random permutations', difficulty: 4, targetTime: 150,
      prompt: 'A uniformly random permutation of 6 elements (labelled 1 through 6) is drawn. What is the expected length of the cycle that contains element 1?',
      answerType: 'numeric', correctAnswer: 3.5, tolerance: 0.02, acceptFraction: [7, 2],
      hint: 'By symmetry, every other element is equally likely to end up sharing a cycle with element 1.', recognitionTechnique: 'Symmetry',
      approach: 'By symmetry among the other n−1 elements, the expected length of the cycle containing a fixed element is (n+1)/2.',
      solution: 'E[cycle length containing element 1] = (n+1)/2 = (6+1)/2 = 3.5.',
      commonTrap: 'Confusing this with the expected NUMBER of cycles in the whole permutation (a harmonic-number sum, H_6 ≈ 2.45) — a different, unrelated quantity from the length of one specific cycle.', tags: ['permutations', 'cycles', 'symmetry']
    },
    {
      id: 'h085', topic: 'Symmetry', subtopic: 'Random permutations', difficulty: 4, targetTime: 150,
      prompt: 'A uniformly random permutation of 6 elements is drawn. What is the probability that the permutation consists of a SINGLE cycle of length 6 (i.e. it is one big cycle, with no shorter cycles at all)?',
      answerType: 'numeric', correctAnswer: 0.1667, tolerance: 0.002, acceptFraction: [1, 6],
      hint: 'Count how many of the 6! permutations are a single 6-cycle, using the standard cycle-counting formula (n−1)!.', recognitionTechnique: 'Counting',
      approach: 'The number of permutations of n elements forming a single n-cycle is (n−1)!, out of n! total permutations, giving probability (n−1)!/n! = 1/n.',
      solution: 'Single 6-cycles number (6−1)! = 5! = 120, out of 6! = 720 total permutations. P = 120/720 = 1/6 ≈ 0.1667.',
      commonTrap: 'Assuming a "random" permutation is unlikely to be a single cycle without checking the actual count — 1/n is often larger than intuition suggests (here, roughly 1 in 6, not some vanishingly small chance).', tags: ['permutations', 'cycles', 'counting']
    },

    /* ------------------- INFORMATION / IMPOSSIBILITY ----------------------- */
    {
      id: 'h086', topic: 'Information Problems', subtopic: 'Search', difficulty: 2, targetTime: 90,
      prompt: 'Someone is thinking of a whole number from 1 to 100. You may ask only yes/no questions. What is the minimum number of questions that always guarantees identifying the exact number, in the worst case?',
      answerType: 'numeric', correctAnswer: 7, tolerance: 0,
      hint: 'Each yes/no question can at best cut the remaining candidates in half — how many halvings does it take to get from 100 down to 1?', recognitionTechnique: 'Information / impossibility',
      approach: 'Information-theoretic lower bound: each yes/no answer distinguishes at most a factor of 2, so the minimum number of questions is ⌈log₂(number of candidates)⌉, achieved exactly by binary search.',
      solution: '⌈log₂(100)⌉ = ⌈6.644⌉ = 7. Six questions could distinguish at most 2⁶=64<100 possibilities (not enough), while seven give 2⁷=128≥100, and binary search (always asking "is it above the midpoint of the remaining range?") achieves this.',
      commonTrap: 'Guessing a round number like 10 or 100 without computing the actual log₂ bound, or forgetting that 2⁶=64 is NOT enough to cover 100 distinct possibilities.', tags: ['lower bound', 'binary search']
    },
    {
      id: 'h087', topic: 'Information Problems', subtopic: 'Comparisons', difficulty: 2, targetTime: 75,
      prompt: 'What is the minimum number of pairwise comparisons needed to find just the MAXIMUM (not the minimum) of 20 distinct numbers, in the worst case?',
      answerType: 'numeric', correctAnswer: 19, tolerance: 0,
      hint: 'Every number except the eventual maximum must "lose" at least one comparison to be ruled out.', recognitionTechnique: 'Information / impossibility',
      approach: 'Each comparison eliminates at most one candidate from contention for the maximum (the loser of that comparison); with n candidates, at least n−1 eliminations (comparisons) are needed to leave exactly one standing.',
      solution: 'To find the max, every one of the other 19 numbers must lose at least one direct or indirect comparison to be ruled out, and each single comparison can only eliminate one candidate — so at least 19 comparisons are required, and a simple sequential scan achieves exactly 19.',
      commonTrap: 'Confusing this with the harder "find BOTH max and min" problem (which needs ⌈3n/2⌉−2 comparisons, not n−1) — finding only the maximum is strictly cheaper.', tags: ['lower bound', 'comparisons']
    },

    /* ---------------- PATTERN WAITING TIMES (RECURRENCES) ------------------ */
    {
      id: 'h088', topic: 'Recursion', subtopic: 'Pattern waiting times', difficulty: 4, targetTime: 180,
      prompt: 'A fair coin is flipped repeatedly. What is the expected number of flips to first see the pattern THT (tails, heads, tails)?',
      answerType: 'numeric', correctAnswer: 10, tolerance: 0.05,
      hint: 'THT has a partial self-overlap (its last letter T matches its first letter T) — set up states for "matched nothing" (h0), "matched T" (h1), and "matched TH" (h2).', recognitionTechnique: 'Recursion',
      approach: 'State-based first-step recursion with 3 states (matched-prefix length 0, 1, or 2 of "THT", with length 3 absorbing): from state 0, a T advances to state 1 and an H stays at state 0; from state 1, a T stays at state 1 (self-overlap — "TT" still ends in a single matched "T") and an H advances to state 2; from state 2, a T completes the pattern (absorbed) and an H drops all the way back to state 0 ("THH" shares no prefix with "THT").',
      solution: 'h0 = 1+½h0+½h1; h1 = 1+½h1+½h2; h2 = 1+½h0+½·0. Solving: from h2, h2=1+½h0. Substituting into h1=2+h2 gives h1=2+1+½h0=3+½h0. Substituting into h0=2+h1 gives h0=2+3+½h0=5+½h0, so ½h0=5 and h0=10.',
      commonTrap: 'Assuming all 3-letter patterns take the same expected 8 flips (the non-overlapping value) — THT\'s partial self-overlap (shares "T" between its start and end) genuinely increases its expected waiting time to 10.', tags: ['markov', 'pattern waiting', 'waiting time']
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
