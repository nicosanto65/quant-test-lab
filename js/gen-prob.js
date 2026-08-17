/* QUANT TEST LAB — parameterised generators: core probability curriculum.
   Each generator returns a fully-specified question with a verified answer. */
(function (global) {
  'use strict';
  const U = global.QTL_UTIL;
  const { nCr, nPr, fact, F, round } = U;
  const G = [];
  const add = (g) => G.push(g);
  const fr = (n, d) => { const f = F.make(n, d); return F.str(f); };
  const dec = (n, d) => round(n / d, 4);
  // Gaussian elimination with partial pivoting — used to solve small (n<=4)
  // linear systems exactly for Markov hitting-time / stationary-distribution
  // generators, so every seed gets a verified, closed-system answer rather
  // than a hand-derived formula that could be mistyped.
  function solveLinear(A, b) {
    const n = b.length;
    const M = A.map((row, i) => row.slice().concat([b[i]]));
    for (let col = 0; col < n; col++) {
      let piv = col;
      for (let rr = col + 1; rr < n; rr++) if (Math.abs(M[rr][col]) > Math.abs(M[piv][col])) piv = rr;
      const tmp = M[col]; M[col] = M[piv]; M[piv] = tmp;
      const pivVal = M[col][col];
      for (let c = col; c <= n; c++) M[col][c] /= pivVal;
      for (let rr = 0; rr < n; rr++) {
        if (rr === col) continue;
        const factor = M[rr][col];
        for (let c = col; c <= n; c++) M[rr][c] -= factor * M[col][c];
      }
    }
    return M.map((row) => row[n]);
  }

  /* ============================ A. PROBABILITY ============================ */

  add({
    id: 'p_union', topic: 'Probability', subtopic: 'Union / intersection', difficulty: 1, targetTime: 60,
    build(r) {
      const n = r.pick([20, 25, 40, 50]);
      const c = r.int(2, Math.floor(n / 8));
      const a = c + r.int(2, Math.floor(n / 4));
      const b = c + r.int(2, Math.floor(n / 4));
      const un = a + b - c;
      return {
        prompt: `In a class of ${n} students, ${a} study statistics, ${b} study programming and ${c} study both. One student is chosen uniformly at random. What is the probability the student studies at least one of the two subjects?`,
        answerType: 'numeric', correctAnswer: dec(un, n), tolerance: 0.005,
        acceptFraction: [un, n],
        hint: 'Do not add the two groups directly — the overlap is being counted twice.',
        approach: 'Inclusion–exclusion on two sets: P(A∪B) = P(A) + P(B) − P(A∩B).',
        solution: `|A∪B| = ${a} + ${b} − ${c} = ${un}. Probability = ${un}/${n} = ${fr(un, n)} ≈ ${dec(un, n)}.`,
        recognitionTechnique: 'Counting', commonTrap: 'Adding the two counts and ignoring the intersection.',
        tags: ['inclusion-exclusion']
      };
    }
  });

  add({
    id: 'p_cond', topic: 'Probability', subtopic: 'Conditional probability', difficulty: 2, targetTime: 75,
    build(r) {
      const n = r.pick([60, 80, 100, 120]);
      const b = r.int(Math.floor(n * 0.3), Math.floor(n * 0.6));
      const c = r.int(Math.floor(b * 0.2), Math.floor(b * 0.7));
      return {
        prompt: `Of ${n} trades logged this month, ${b} were executed in the London session and ${c} of those London trades were profitable. A trade is drawn at random from the ${b} London trades. What is P(profitable | London)?`,
        answerType: 'numeric', correctAnswer: dec(c, b), tolerance: 0.005, acceptFraction: [c, b],
        hint: 'Conditioning shrinks the sample space to the London trades only.',
        approach: 'P(A|B) = |A∩B| / |B| once the conditioning set is treated as the new universe.',
        solution: `The new sample space has ${b} outcomes, of which ${c} are favourable: ${c}/${b} = ${fr(c, b)} ≈ ${dec(c, b)}.`,
        recognitionTechnique: 'Conditional probability', commonTrap: `Dividing by the full ${n} instead of the conditioning set.`,
        tags: ['conditioning']
      };
    }
  });

  add({
    id: 'p_bayes', topic: 'Probability', subtopic: "Bayes' theorem", difficulty: 3, targetTime: 150,
    build(r) {
      const prev = r.pick([1, 2, 4, 5]);          // % prevalence
      const sens = r.pick([90, 95, 98]);
      const spec = r.pick([90, 92, 95]);
      const p = prev / 100, se = sens / 100, sp = spec / 100;
      const num = p * se, den = p * se + (1 - p) * (1 - sp);
      const ans = round(num / den, 4);
      return {
        prompt: `A screening test has sensitivity ${sens}% and specificity ${spec}%. The condition affects ${prev}% of the population. A randomly selected person tests positive. What is the probability they actually have the condition?`,
        answerType: 'numeric', correctAnswer: ans, tolerance: 0.006,
        hint: 'Imagine 10,000 people and count the two kinds of positives.',
        approach: "Bayes: P(D|+) = P(+|D)P(D) / [P(+|D)P(D) + P(+|¬D)P(¬D)]. Natural frequencies are fastest.",
        solution: `Out of 10,000: ${round(p * 10000, 0)} have it, of whom ${round(p * se * 10000, 1)} test positive. ${round((1 - p) * 10000, 0)} do not, of whom ${round((1 - p) * (1 - sp) * 10000, 1)} are false positives. P = ${round(num * 10000, 1)} / ${round(den * 10000, 1)} ≈ ${ans} (${round(ans * 100, 1)}%).`,
        recognitionTechnique: 'Bayes', commonTrap: 'Answering with the sensitivity — ignoring base rate.',
        tags: ['base rate']
      };
    }
  });

  add({
    id: 'p_total', topic: 'Probability', subtopic: 'Law of total probability', difficulty: 2, targetTime: 120,
    build(r) {
      const rA = r.int(2, 5), wA = r.int(2, 5), rB = r.int(2, 6), wB = r.int(1, 5);
      const p = 0.5 * (rA / (rA + wA)) + 0.5 * (rB / (rB + wB));
      return {
        prompt: `Urn A holds ${rA} red and ${wA} white balls; urn B holds ${rB} red and ${wB} white balls. You flip a fair coin to pick an urn, then draw one ball at random. What is the probability it is red?`,
        answerType: 'numeric', correctAnswer: round(p, 4), tolerance: 0.005,
        hint: 'Condition on which urn was selected.',
        approach: 'Law of total probability: P(R) = P(A)P(R|A) + P(B)P(R|B).',
        solution: `P = ½·${rA}/${rA + wA} + ½·${rB}/${rB + wB} = ${round(p, 4)}.`,
        recognitionTechnique: 'Conditioning', commonTrap: 'Pooling all balls into one urn — that weights the urns by size, not by ½.',
        tags: ['urn']
      };
    }
  });

  add({
    id: 'p_atleastone', topic: 'Probability', subtopic: 'Complement', difficulty: 1, targetTime: 60,
    build(r) {
      const n = r.int(3, 8), s = r.pick([6, 6, 6, 8, 10]);
      const p = 1 - Math.pow((s - 1) / s, n);
      return {
        prompt: `You roll a fair ${s}-sided die ${n} times. What is the probability that at least one roll shows a ${s}?`,
        answerType: 'numeric', correctAnswer: round(p, 4), tolerance: 0.005,
        hint: '"At least one" is almost always easier as one minus "none".',
        approach: 'Complement rule with independent trials: 1 − (1 − p)^n.',
        solution: `P(no ${s} in one roll) = ${s - 1}/${s}. Independent rolls ⇒ P(none) = (${s - 1}/${s})^${n} = ${round(Math.pow((s - 1) / s, n), 4)}. Answer = 1 − that = ${round(p, 4)}.`,
        recognitionTechnique: 'Complement', commonTrap: `Answering ${n}/${s} by adding probabilities of overlapping events.`,
        tags: ['complement']
      };
    }
  });

  add({
    id: 'p_indep_or', topic: 'Probability', subtopic: 'Independence', difficulty: 2, targetTime: 75,
    build(r) {
      const a = r.pick([0.2, 0.25, 0.3, 0.4]), b = r.pick([0.3, 0.5, 0.6]);
      const p = a + b - a * b;
      return {
        prompt: `Two independent systems fail with probability ${a} and ${b} respectively on a given day. What is the probability that at least one of them fails today?`,
        answerType: 'numeric', correctAnswer: round(p, 4), tolerance: 0.004,
        hint: 'Independence makes P(both) a product.',
        approach: 'P(A∪B) = 1 − (1−a)(1−b) for independent events.',
        solution: `1 − (1−${a})(1−${b}) = 1 − ${round((1 - a) * (1 - b), 4)} = ${round(p, 4)}.`,
        recognitionTechnique: 'Complement', commonTrap: 'Adding the two probabilities and exceeding the true value.',
        tags: ['independence']
      };
    }
  });

  add({
    id: 'p_two_same', topic: 'Probability', subtopic: 'Sampling without replacement', difficulty: 2, targetTime: 90,
    build(r) {
      const rd = r.int(3, 7), bl = r.int(3, 7);
      const n = rd + bl;
      const num = nCr(rd, 2) + nCr(bl, 2), den = nCr(n, 2);
      return {
        prompt: `A bag contains ${rd} red and ${bl} blue chips. Two chips are drawn without replacement. What is the probability they are the same colour?`,
        answerType: 'numeric', correctAnswer: dec(num, den), tolerance: 0.005, acceptFraction: [num, den],
        hint: 'Two disjoint ways to succeed; count pairs rather than sequences.',
        approach: 'Unordered counting: [C(r,2)+C(b,2)] / C(n,2).',
        solution: `C(${rd},2)+C(${bl},2) = ${nCr(rd, 2)}+${nCr(bl, 2)} = ${num}; C(${n},2) = ${den}. Answer ${fr(num, den)} ≈ ${dec(num, den)}.`,
        recognitionTechnique: 'Counting', commonTrap: 'Treating the draws as independent (with replacement).',
        tags: ['hypergeometric']
      };
    }
  });

  add({
    id: 'p_boygirl', topic: 'Probability', subtopic: 'Conditional probability', difficulty: 3, targetTime: 90,
    build(r) {
      const k = r.pick([2, 3]);
      const total = Math.pow(2, k);
      const num = total - 1 - k;   // at least two heads among k, given at least one head... computed below
      const atLeastOne = total - 1;
      const atLeastTwo = total - 1 - k;
      return {
        prompt: `${k} fair coins are tossed. Given that at least one coin shows heads, what is the probability that at least two show heads?`,
        answerType: 'numeric', correctAnswer: dec(atLeastTwo, atLeastOne), tolerance: 0.005,
        acceptFraction: [atLeastTwo, atLeastOne],
        hint: 'Write out the equally likely outcomes and cross off the all-tails case.',
        approach: 'Conditional probability by restricting an equally-likely sample space.',
        solution: `There are ${total} equally likely outcomes; ${atLeastOne} have at least one head. Exactly one head occurs in ${k} of them, so ${atLeastTwo} have at least two. Answer ${fr(atLeastTwo, atLeastOne)} ≈ ${dec(atLeastTwo, atLeastOne)}.`,
        recognitionTechnique: 'Conditional probability', commonTrap: 'Assuming the remaining coins are "fresh" and answering as if unconditioned.',
        tags: ['sample space']
      };
    }
  });

  add({
    id: 'p_seq_order', topic: 'Symmetry', subtopic: 'Relative order', difficulty: 3, targetTime: 90,
    build(r) {
      const k = r.pick([3, 3, 4]);
      const ans = 1 / fact(k);
      const names = ['ace of spades', 'king of hearts', 'queen of clubs', 'jack of diamonds'].slice(0, k);
      return {
        prompt: `A standard 52-card deck is shuffled uniformly at random. What is the probability that the ${names.join(', ')} appear in exactly that order (not necessarily consecutively) reading from the top of the deck?`,
        answerType: 'numeric', correctAnswer: round(ans, 5), tolerance: 0.002, acceptFraction: [1, fact(k)],
        hint: 'The other 49 cards are irrelevant. How many orderings of the marked cards are there, and are they equally likely?',
        approach: 'Symmetry / exchangeability: all ' + fact(k) + ' relative orders of the marked cards are equally likely.',
        solution: `Ignore every unmarked card. The ${k} marked cards appear in one of ${k}! = ${fact(k)} relative orders, all equally likely by symmetry. Answer = 1/${fact(k)} ≈ ${round(ans, 4)}.`,
        recognitionTechnique: 'Symmetry', commonTrap: 'Attempting a positional count over all 52! shuffles — correct but enormously slower.',
        tags: ['cards', 'symmetry']
      };
    }
  });

  add({
    id: 'p_first_ace', topic: 'Symmetry', subtopic: 'Random permutations', difficulty: 4, targetTime: 180,
    build(r) {
      const n = r.pick([52]), m = r.pick([4, 4, 13]);
      const label = m === 4 ? 'aces' : 'hearts';
      const ansN = n + 1, ansD = m + 1;
      return {
        prompt: `A standard 52-card deck is shuffled uniformly. Cards are turned over one at a time. What is the expected position (counting from the top) of the first ${m === 4 ? 'ace' : 'heart'}?`,
        answerType: 'numeric', correctAnswer: round(ansN / ansD, 4), tolerance: 0.02, acceptFraction: [ansN, ansD],
        hint: `The ${52 - m} other cards are split into ${m + 1} gaps by the ${m} ${label}. By symmetry each gap has the same expected size.`,
        approach: 'Symmetry + linearity: the non-special cards are distributed symmetrically among the m+1 gaps created by the special cards.',
        solution: `The ${m} ${label} create ${m + 1} gaps holding the ${52 - m} other cards. By symmetry each gap has expected size ${52 - m}/${m + 1} = ${round((52 - m) / (m + 1), 4)}. The first ${m === 4 ? 'ace' : 'heart'} sits just after the first gap, so E = ${52 - m}/${m + 1} + 1 = ${ansN}/${ansD} ≈ ${round(ansN / ansD, 3)}.`,
        recognitionTechnique: 'Symmetry', commonTrap: 'Summing k·P(first ace at k) by brute force — correct but far slower and error-prone.',
        tags: ['cards', 'order statistics']
      };
    }
  });

  /* =========================== B. COMBINATORICS =========================== */

  add({
    id: 'c_committee', topic: 'Combinatorics', subtopic: 'Combinations', difficulty: 1, targetTime: 45,
    build(r) {
      const n = r.int(8, 14), k = r.int(3, 5);
      return {
        prompt: `How many different committees of ${k} people can be formed from a pool of ${n} candidates?`,
        answerType: 'numeric', correctAnswer: nCr(n, k), tolerance: 0,
        hint: 'Does the order in which committee members are named matter?',
        approach: 'Unordered selection ⇒ binomial coefficient C(n,k).',
        solution: `C(${n},${k}) = ${n}!/(${k}!·${n - k}!) = ${nCr(n, k)}.`,
        recognitionTechnique: 'Counting', commonTrap: `Using permutations (${nPr(n, k)}) and over-counting by ${k}!.`,
        tags: ['combinations']
      };
    }
  });

  add({
    id: 'c_complement', topic: 'Combinatorics', subtopic: 'Counting by complement', difficulty: 2, targetTime: 90,
    build(r) {
      const m = r.int(4, 7), w = r.int(4, 7), k = r.int(3, 4);
      const tot = nCr(m + w, k), none = nCr(m, k);
      return {
        prompt: `A group has ${m} analysts and ${w} traders. A team of ${k} is chosen at random. In how many ways can the team be chosen so that it contains at least one trader?`,
        answerType: 'numeric', correctAnswer: tot - none, tolerance: 0,
        hint: 'Count the teams you do not want.',
        approach: 'Complement counting: total − (teams with no trader).',
        solution: `Total C(${m + w},${k}) = ${tot}. All-analyst teams C(${m},${k}) = ${none}. Answer ${tot} − ${none} = ${tot - none}.`,
        recognitionTechnique: 'Complement', commonTrap: 'Picking one trader first then filling the rest — this double-counts teams with several traders.',
        tags: ['complement']
      };
    }
  });

  add({
    id: 'c_word', topic: 'Combinatorics', subtopic: 'Permutations with repetition', difficulty: 2, targetTime: 75,
    build(r) {
      const words = [['BANANA', fact(6) / (fact(3) * fact(2))], ['LEVEL', fact(5) / (fact(2) * fact(2))],
      ['SUCCESS', fact(7) / (fact(3) * fact(2))], ['MISSISSIPPI', fact(11) / (fact(4) * fact(4) * fact(2))],
      ['BOOKKEEPER', fact(10) / (fact(3) * fact(2) * fact(2))]];
      const [w, a] = r.pick(words);
      return {
        prompt: `How many distinct arrangements are there of all the letters of the word ${w}?`,
        answerType: 'numeric', correctAnswer: a, tolerance: 0,
        hint: 'Identical letters can be swapped without producing a new word.',
        approach: 'Multinomial coefficient: n! divided by the factorial of each repeat count.',
        solution: `${w} has ${w.length} letters; divide ${w.length}! by the factorials of the repeated-letter counts. Answer ${a}.`,
        recognitionTechnique: 'Counting', commonTrap: 'Using n! and forgetting to quotient out identical letters.',
        tags: ['multinomial']
      };
    }
  });

  add({
    id: 'c_grid', topic: 'Combinatorics', subtopic: 'Lattice paths', difficulty: 2, targetTime: 75,
    build(r) {
      const a = r.int(3, 6), b = r.int(3, 6);
      return {
        prompt: `On a grid you must walk from (0,0) to (${a},${b}) moving only one unit right or one unit up at a time. How many distinct routes are there?`,
        answerType: 'numeric', correctAnswer: nCr(a + b, a), tolerance: 0,
        hint: 'Every route is a sequence of R and U moves — how many of each?',
        approach: 'Choose which of the n moves are "right": C(a+b, a).',
        solution: `Each route is a word with ${a} R's and ${b} U's: C(${a + b},${a}) = ${nCr(a + b, a)}.`,
        recognitionTechnique: 'Counting', commonTrap: 'Multiplying a·b or treating routes as ordered pairs.',
        tags: ['paths']
      };
    }
  });

  add({
    id: 'c_stars', topic: 'Combinatorics', subtopic: 'Stars and bars', difficulty: 3, targetTime: 90,
    build(r) {
      const n = r.int(8, 14), k = r.int(3, 4);
      return {
        prompt: `How many ways can ${n} identical contracts be allocated among ${k} distinct desks, if a desk may receive zero contracts?`,
        answerType: 'numeric', correctAnswer: nCr(n + k - 1, k - 1), tolerance: 0,
        hint: 'Line up the contracts and insert dividers between desks.',
        approach: 'Stars and bars: C(n+k−1, k−1) for non-negative integer solutions.',
        solution: `C(${n} + ${k} − 1, ${k} − 1) = C(${n + k - 1},${k - 1}) = ${nCr(n + k - 1, k - 1)}.`,
        recognitionTechnique: 'Counting', commonTrap: 'Using C(n,k) or k^n — the contracts are identical, the desks are not.',
        tags: ['stars and bars']
      };
    }
  });

  add({
    id: 'c_incl_exc', topic: 'Combinatorics', subtopic: 'Inclusion-exclusion', difficulty: 2, targetTime: 90,
    build(r) {
      const N = r.pick([100, 200, 300, 500, 1000]);
      const a = r.pick([3, 4, 5]), b = r.pick([6, 7, 8]);
      const lcm = (a * b) / U.gcd(a, b);
      const ans = Math.floor(N / a) + Math.floor(N / b) - Math.floor(N / lcm);
      return {
        prompt: `How many integers from 1 to ${N} inclusive are divisible by ${a} or by ${b}?`,
        answerType: 'numeric', correctAnswer: ans, tolerance: 0,
        hint: 'Numbers divisible by both are counted twice.',
        approach: 'Inclusion–exclusion with floor division; the overlap is multiples of lcm(a,b).',
        solution: `⌊${N}/${a}⌋ + ⌊${N}/${b}⌋ − ⌊${N}/${lcm}⌋ = ${Math.floor(N / a)} + ${Math.floor(N / b)} − ${Math.floor(N / lcm)} = ${ans}.`,
        recognitionTechnique: 'Counting', commonTrap: `Subtracting multiples of ${a * b} instead of lcm = ${lcm}.`,
        tags: ['inclusion-exclusion']
      };
    }
  });

  add({
    id: 'c_suit', topic: 'Combinatorics', subtopic: 'Cards', difficulty: 3, targetTime: 120,
    build(r) {
      const h = r.pick([5, 5, 6]), k = r.pick([2, 3]);
      const num = nCr(13, k) * nCr(39, h - k), den = nCr(52, h);
      return {
        prompt: `A hand of ${h} cards is dealt from a standard 52-card deck. What is the probability it contains exactly ${k} hearts?`,
        answerType: 'numeric', correctAnswer: round(num / den, 4), tolerance: 0.004,
        hint: 'Choose the hearts and the non-hearts separately.',
        approach: 'Hypergeometric: C(13,k)·C(39,h−k)/C(52,h).',
        solution: `C(13,${k})·C(39,${h - k}) / C(52,${h}) = ${nCr(13, k)}·${nCr(39, h - k)} / ${den} = ${round(num / den, 4)}.`,
        recognitionTechnique: 'Counting', commonTrap: 'Using the binomial formula — draws are without replacement.',
        tags: ['hypergeometric', 'cards']
      };
    }
  });

  add({
    id: 'c_together', topic: 'Combinatorics', subtopic: 'Permutations', difficulty: 2, targetTime: 90,
    build(r) {
      const n = r.int(5, 8);
      const ans = fact(n - 1) * 2;
      return {
        prompt: `${n} people are seated in a row at random. In how many of the ${fact(n)} possible seatings do two specific people sit next to each other?`,
        answerType: 'numeric', correctAnswer: ans, tolerance: 0,
        hint: 'Glue the pair into a single block.',
        approach: 'Block (gluing) method: treat the pair as one unit, then account for their internal order.',
        solution: `Treat the pair as one block: ${n - 1} units arrange in ${n - 1}! = ${fact(n - 1)} ways, times 2 internal orders = ${ans}.`,
        recognitionTechnique: 'Counting', commonTrap: 'Forgetting the factor of 2 for the pair swapping.',
        tags: ['adjacency']
      };
    }
  });

  add({
    id: 'c_teams', topic: 'Combinatorics', subtopic: 'Partitions', difficulty: 3, targetTime: 120,
    build(r) {
      const g = r.pick([2, 3]), size = r.pick([2, 3, 4]);
      const n = g * size;
      let ways = 1, left = n;
      for (let i = 0; i < g; i++) { ways *= nCr(left, size); left -= size; }
      const ans = ways / fact(g);
      return {
        prompt: `${n} people are split into ${g} unlabelled groups of ${size}. How many different splits are possible?`,
        answerType: 'numeric', correctAnswer: ans, tolerance: 0,
        hint: 'If the groups had names, how many ways? Then remove the naming.',
        approach: 'Sequential choice then divide by g! because the groups are indistinguishable.',
        solution: `Labelled groups: ${ways}. The groups are unlabelled so divide by ${g}! = ${fact(g)}: ${ans}.`,
        recognitionTechnique: 'Counting', commonTrap: 'Forgetting to divide by g! for unlabelled groups.',
        tags: ['partitions']
      };
    }
  });

  add({
    id: 'c_derange', topic: 'Combinatorics', subtopic: 'Derangements', difficulty: 4, targetTime: 150,
    build(r) {
      const n = r.pick([4, 5, 6]);
      const D = (m) => { let d = [1, 0]; for (let i = 2; i <= m; i++) d[i] = (i - 1) * (d[i - 1] + d[i - 2]); return d[m]; };
      const d = D(n);
      return {
        prompt: `${n} traders each hand in a phone; the phones are returned at random, one per trader. In how many ways can they be returned so that nobody gets their own phone?`,
        answerType: 'numeric', correctAnswer: d, tolerance: 0,
        hint: 'Inclusion–exclusion over the events "person i gets their own phone".',
        approach: 'Derangement count D(n) = n!·Σ(−1)^k/k!, or the recursion D(n) = (n−1)[D(n−1)+D(n−2)].',
        solution: `D(${n}) = ${d}. (Check: D(n)/n! → 1/e ≈ 0.368; here ${d}/${fact(n)} = ${round(d / fact(n), 4)}.)`,
        recognitionTechnique: 'Counting', commonTrap: 'Assuming the answer is n! − n.',
        tags: ['derangement', 'inclusion-exclusion']
      };
    }
  });

  /* =========================== C. EXPECTED VALUE =========================== */

  add({
    id: 'e_die_payoff', topic: 'Expected Value', subtopic: 'Basic EV', difficulty: 1, targetTime: 60,
    build(r) {
      const s = r.pick([6, 6, 8]);
      const mult = r.pick([2, 3, 5]);
      const thresh = r.int(3, s - 1);
      let ev = 0;
      for (let i = 1; i <= s; i++) ev += (i > thresh ? mult * i : i) / s;
      return {
        prompt: `You roll a fair ${s}-sided die. You are paid the face value in euros, except that a roll strictly greater than ${thresh} pays ${mult}× the face value. What is the expected payout?`,
        answerType: 'numeric', correctAnswer: round(ev, 4), tolerance: 0.02,
        hint: 'Split the outcomes into the two payout regimes.',
        approach: 'Direct EV: sum over equally likely faces of payout × 1/s.',
        solution: `Faces 1..${thresh} pay face value; faces ${thresh + 1}..${s} pay ${mult}×. EV = ${round(ev, 4)}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Multiplying the plain average by the multiplier.',
        tags: ['dice']
      };
    }
  });

  add({
    id: 'e_fixedpoints', topic: 'Expected Value', subtopic: 'Linearity of expectation', difficulty: 3, targetTime: 90,
    build(r) {
      const n = r.int(5, 12);
      return {
        prompt: `${n} guests leave identical-looking coats and receive them back in a uniformly random order. What is the expected number of guests who get their own coat back?`,
        answerType: 'numeric', correctAnswer: 1, tolerance: 0.001,
        hint: 'Define an indicator for each guest and add the expectations, not the events.',
        approach: 'Indicator variables + linearity of expectation (dependence does not matter).',
        solution: `Let I_k = 1 if guest k gets their own coat. P(I_k=1) = 1/${n}. E[ΣI_k] = ${n}·(1/${n}) = 1, independent of ${n}.`,
        recognitionTechnique: 'Indicator variables', commonTrap: 'Trying to compute the full distribution of matches (derangements) — unnecessary.',
        tags: ['linearity', 'permutation']
      };
    }
  });

  add({
    id: 'e_empty_boxes', topic: 'Expected Value', subtopic: 'Indicator variables', difficulty: 3, targetTime: 150,
    build(r) {
      const n = r.int(4, 8), b = r.int(3, 6);
      const ev = b * Math.pow((b - 1) / b, n);
      return {
        prompt: `${n} balls are thrown independently and uniformly at random into ${b} boxes. What is the expected number of boxes that end up empty?`,
        answerType: 'numeric', correctAnswer: round(ev, 4), tolerance: 0.02,
        hint: 'One indicator per box, not per ball.',
        approach: 'Indicator per box: P(box empty) = ((b−1)/b)^n, then multiply by b.',
        solution: `P(a given box empty) = (${b - 1}/${b})^${n} = ${round(Math.pow((b - 1) / b, n), 4)}. E = ${b}·that = ${round(ev, 4)}.`,
        recognitionTechnique: 'Indicator variables', commonTrap: 'Conditioning on how many balls each box gets — vastly harder for the same answer.',
        tags: ['occupancy', 'linearity']
      };
    }
  });

  add({
    id: 'e_adjacent', topic: 'Expected Value', subtopic: 'Indicator variables', difficulty: 4, targetTime: 180,
    build(r) {
      const a = r.int(3, 6), b = r.int(3, 6);
      const n = a + b;
      const ev = (n - 1) * 2 * a * b / (n * (n - 1));
      return {
        prompt: `${a} red and ${b} blue chips are arranged in a random row (all ${n}!/(${a}!${b}!) distinct arrangements equally likely). What is the expected number of adjacent pairs whose two chips have different colours?`,
        answerType: 'numeric', correctAnswer: round(ev, 4), tolerance: 0.02,
        hint: `There are ${n - 1} adjacent slots; what is the chance a given slot straddles two different colours?`,
        approach: 'Indicator per adjacent position + linearity; use symmetry for P(different colours).',
        solution: `For any adjacent pair, P(different) = 2·${a}·${b}/(${n}·${n - 1}) = ${round(2 * a * b / (n * (n - 1)), 4)}. With ${n - 1} adjacent positions, E = ${round(ev, 4)} = 2·${a}·${b}/${n}.`,
        recognitionTechnique: 'Indicator variables', commonTrap: 'Trying to count arrangements by number of colour changes.',
        tags: ['linearity', 'runs']
      };
    }
  });

  add({
    id: 'e_coupon', topic: 'Expected Value', subtopic: 'Coupon collector', difficulty: 4, targetTime: 150,
    build(r) {
      const n = r.pick([4, 5, 6]);
      let ev = 0; for (let i = 1; i <= n; i++) ev += n / i;
      return {
        prompt: `A cereal brand includes one of ${n} equally likely collectible cards per box. What is the expected number of boxes you must buy to collect all ${n} distinct cards?`,
        answerType: 'numeric', correctAnswer: round(ev, 4), tolerance: 0.05,
        hint: 'Break the wait into stages: the time to go from k distinct cards to k+1.',
        approach: 'Coupon collector: sum of geometric waiting times, E = n·(1 + 1/2 + … + 1/n).',
        solution: `From k distinct cards, P(new) = (${n}−k)/${n}, so the wait is geometric with mean ${n}/(${n}−k). Summing: ${n}·H_${n} = ${round(ev, 4)}.`,
        recognitionTechnique: 'Conditioning', commonTrap: 'Answering n (one box per card) or ignoring repeats.',
        tags: ['geometric', 'stages']
      };
    }
  });

  add({
    id: 'e_recursion_roll', topic: 'Recursion', subtopic: 'Expected waiting time', difficulty: 3, targetTime: 120,
    build(r) {
      const s = r.pick([6, 6, 8, 10]), k = r.int(2, s - 1);
      const p = (s - k + 1) / s;
      return {
        prompt: `You roll a fair ${s}-sided die repeatedly until you obtain a value of ${k} or higher. What is the expected number of rolls?`,
        answerType: 'numeric', correctAnswer: round(1 / p, 4), tolerance: 0.01, acceptFraction: [s, s - k + 1],
        hint: 'Each roll independently succeeds with the same probability.',
        approach: 'Geometric waiting time: E = 1/p.',
        solution: `P(success) = ${s - k + 1}/${s} = ${round(p, 4)}. E = 1/p = ${s}/${s - k + 1} ≈ ${round(1 / p, 4)}.`,
        recognitionTechnique: 'Recursion', commonTrap: 'Averaging the number of failures rather than total trials (off by one).',
        tags: ['geometric']
      };
    }
  });

  add({
    id: 'e_reroll', topic: 'Optimal Strategy', subtopic: 'Stopping', difficulty: 4, targetTime: 210,
    build(r) {
      const s = r.pick([6, 8, 10]);
      const mean = (s + 1) / 2;                 // value of the fresh roll
      const t = Math.floor(mean);               // keep if strictly greater than t... derive
      // Optimal: keep roll x if x >= E[value of rerolling] = mean. threshold = ceil(mean)
      const th = Math.ceil(mean);
      let ev = 0;
      for (let x = 1; x <= s; x++) ev += (x >= th ? x : mean) / s;
      return {
        prompt: `You roll a fair ${s}-sided die and are paid its value in euros. Before seeing the result you may instead choose, after the roll, to discard it and roll once more — in which case you are paid the second roll. Playing optimally, what is the expected payout?`,
        answerType: 'numeric', correctAnswer: round(ev, 4), tolerance: 0.03,
        hint: 'Work backwards: the reroll is worth the plain average of the die. Keep anything at least that good.',
        approach: 'One-step backward induction / optimal stopping with a threshold rule.',
        solution: `The reroll is worth ${round(mean, 2)}. So keep the first roll iff it is ≥ ${th}. EV = (1/${s})[Σ_{x≥${th}} x + (number of low faces)·${round(mean, 2)}] = ${round(ev, 4)}.`,
        recognitionTechnique: 'Optimal stopping', commonTrap: 'Taking max(first, second) — you must decide before seeing the second roll.',
        tags: ['backward induction']
      };
    }
  });

  add({
    id: 'e_bet_odds', topic: 'Expected Value', subtopic: 'EV in games', difficulty: 2, targetTime: 75,
    build(r) {
      const p = r.pick([0.3, 0.35, 0.4, 0.45, 0.55]);
      const win = r.int(2, 5), stake = 1;
      const ev = p * win - (1 - p) * stake;
      return {
        prompt: `A bet costs nothing to enter. With probability ${p} you win €${win}; otherwise you lose €${stake}. What is the expected profit per bet?`,
        answerType: 'numeric', correctAnswer: round(ev, 4), tolerance: 0.02,
        hint: 'Weight each outcome by its probability, keeping the sign of losses.',
        approach: 'Direct EV of a two-outcome payoff.',
        solution: `EV = ${p}·${win} − ${round(1 - p, 2)}·${stake} = ${round(p * win, 3)} − ${round((1 - p) * stake, 3)} = ${round(ev, 4)}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Forgetting the loss branch, or treating the stake as sunk on a win.',
        tags: ['betting']
      };
    }
  });

  add({
    id: 'e_tailsum_max', topic: 'Order Statistics', subtopic: 'Tail sum', difficulty: 4, targetTime: 180,
    build(r) {
      const n = r.pick([2, 3]), s = r.pick([4, 5, 6]);
      let ev = 0;
      for (let k = 1; k <= s; k++) ev += 1 - Math.pow((k - 1) / s, n);   // E[X] = Σ_{k>=1} P(X>=k)
      return {
        prompt: `You roll ${n} fair ${s}-sided dice. What is the expected value of the largest number shown?`,
        answerType: 'numeric', correctAnswer: round(ev, 4), tolerance: 0.02,
        hint: 'P(max < k) is easy because all dice must be below k.',
        approach: 'Tail-sum formula E[X] = Σ_{k≥1} P(X ≥ k), with P(X ≥ k) = 1 − ((k−1)/s)^n.',
        solution: `P(max ≤ k) = (k/${s})^${n}, so P(max ≥ k) = 1 − ((k−1)/${s})^${n}. Summing k = 1..${s} gives E[max] = ${round(ev, 4)}.`,
        recognitionTechnique: 'Tail sum', commonTrap: 'Computing the pmf face by face — slower and error-prone under time pressure.',
        tags: ['order statistics', 'dice']
      };
    }
  });

  add({
    id: 'e_min_dice', topic: 'Order Statistics', subtopic: 'Expected minimum', difficulty: 4, targetTime: 180,
    build(r) {
      const n = r.pick([2, 3]), s = r.pick([4, 6]);
      let ev = 0;
      for (let k = 1; k <= s; k++) ev += Math.pow((s - k + 1) / s, n);   // Σ P(min >= k)
      return {
        prompt: `You roll ${n} fair ${s}-sided dice. What is the expected value of the smallest number shown?`,
        answerType: 'numeric', correctAnswer: round(ev, 4), tolerance: 0.02,
        hint: 'P(min ≥ k) means every die is at least k.',
        approach: 'Tail sum with P(min ≥ k) = ((s−k+1)/s)^n.',
        solution: `E[min] = Σ_{k=1}^{${s}} ((${s}−k+1)/${s})^${n} = ${round(ev, 4)}. (Sanity check: E[min] + E[max] = ${s + 1} by the symmetry x ↦ ${s + 1} − x.)`,
        recognitionTechnique: 'Order statistics', commonTrap: 'Assuming E[min] = (s+1)/2 ÷ n.',
        tags: ['order statistics']
      };
    }
  });

  /* ========================= D. VARIANCE / COVARIANCE ======================= */

  add({
    id: 'v_dice_sum', topic: 'Variance', subtopic: 'Variance of sums', difficulty: 2, targetTime: 90,
    build(r) {
      const n = r.int(2, 6);
      const v = n * 35 / 12;
      return {
        prompt: `What is the variance of the sum of ${n} independent fair six-sided dice?`,
        answerType: 'numeric', correctAnswer: round(v, 4), tolerance: 0.03,
        hint: 'A single fair die has variance 35/12.',
        approach: 'Variance adds over independent summands.',
        solution: `Var(one die) = 35/12 ≈ 2.9167. Independence ⇒ Var(sum) = ${n}·35/12 = ${round(v, 4)}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Multiplying the standard deviation by n instead of the variance.',
        tags: ['variance']
      };
    }
  });

  add({
    id: 'v_linear', topic: 'Variance', subtopic: 'Variance rules', difficulty: 2, targetTime: 75,
    build(r) {
      const a = r.int(2, 5), b = r.int(2, 5), vx = r.int(2, 9), vy = r.int(2, 9);
      const v = a * a * vx + b * b * vy;
      return {
        prompt: `X and Y are independent with Var(X) = ${vx} and Var(Y) = ${vy}. What is Var(${a}X − ${b}Y)?`,
        answerType: 'numeric', correctAnswer: v, tolerance: 0.001,
        hint: 'Constants come out squared, and the sign of the coefficient does not survive squaring.',
        approach: 'Var(aX + bY) = a²Var(X) + b²Var(Y) + 2ab·Cov(X,Y); independence kills the covariance term.',
        solution: `${a}²·${vx} + ${b}²·${vy} = ${a * a * vx} + ${b * b * vy} = ${v}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Subtracting the second variance because of the minus sign.',
        tags: ['variance rules']
      };
    }
  });

  add({
    id: 'v_cov', topic: 'Variance', subtopic: 'Covariance', difficulty: 2, targetTime: 60,
    build(r) {
      const rho = r.pick([0.2, 0.3, -0.4, 0.5, -0.25]);
      const sx = r.int(2, 8), sy = r.int(2, 8);
      return {
        prompt: `Two assets have return standard deviations ${sx}% and ${sy}% and a correlation of ${rho}. What is their covariance (in %²)?`,
        answerType: 'numeric', correctAnswer: round(rho * sx * sy, 4), tolerance: 0.02,
        hint: 'Correlation is covariance normalised by both standard deviations.',
        approach: 'Cov(X,Y) = ρ·σ_X·σ_Y.',
        solution: `${rho}·${sx}·${sy} = ${round(rho * sx * sy, 4)}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Dividing instead of multiplying, or using variances in place of sds.',
        tags: ['covariance']
      };
    }
  });

  add({
    id: 'v_portfolio', topic: 'Variance', subtopic: 'Variance of sums', difficulty: 3, targetTime: 120,
    build(r) {
      const w = r.pick([0.3, 0.4, 0.5, 0.6, 0.7]);
      const sx = r.int(10, 25), sy = r.int(10, 25), rho = r.pick([0, 0.2, 0.4, -0.3]);
      const v = w * w * sx * sx + (1 - w) * (1 - w) * sy * sy + 2 * w * (1 - w) * rho * sx * sy;
      return {
        prompt: `A portfolio puts weight ${w} in asset A (σ = ${sx}%) and the rest in asset B (σ = ${sy}%), with correlation ${rho}. What is the portfolio standard deviation, in %?`,
        answerType: 'numeric', correctAnswer: round(Math.sqrt(v), 3), tolerance: 0.06,
        hint: 'Compute the variance first, then take the square root at the very end.',
        approach: 'Two-asset portfolio variance: w²σ₁² + (1−w)²σ₂² + 2w(1−w)ρσ₁σ₂.',
        solution: `Var = ${round(v, 3)} ⇒ σ = ${round(Math.sqrt(v), 3)}%.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Taking the weighted average of the standard deviations.',
        tags: ['portfolio']
      };
    }
  });

  add({
    id: 'v_from_moments', topic: 'Variance', subtopic: 'Variance rules', difficulty: 2, targetTime: 60,
    build(r) {
      const m = r.int(2, 9), e2 = m * m + r.int(2, 20);
      return {
        prompt: `A random variable has E[X] = ${m} and E[X²] = ${e2}. What is Var(X)?`,
        answerType: 'numeric', correctAnswer: e2 - m * m, tolerance: 0.001,
        hint: 'One line.',
        approach: 'Var(X) = E[X²] − (E[X])².',
        solution: `${e2} − ${m}² = ${e2 - m * m}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Computing (E[X²] − E[X])².',
        tags: ['moments']
      };
    }
  });

  add({
    id: 'v_binomial', topic: 'Variance', subtopic: 'Variance of distributions', difficulty: 2, targetTime: 60,
    build(r) {
      const n = r.pick([20, 40, 50, 100]), p = r.pick([0.1, 0.2, 0.25, 0.5]);
      return {
        prompt: `X ~ Binomial(n = ${n}, p = ${p}). What is Var(X)?`,
        answerType: 'numeric', correctAnswer: round(n * p * (1 - p), 4), tolerance: 0.02,
        hint: 'A binomial is a sum of independent indicators.',
        approach: 'Var = np(1−p) — follows from summing independent Bernoulli variances.',
        solution: `${n}·${p}·${round(1 - p, 2)} = ${round(n * p * (1 - p), 4)}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Using np (the mean) as the variance.',
        tags: ['binomial']
      };
    }
  });

  add({
    id: 'v_samplemean', topic: 'Variance', subtopic: 'Variance of sums', difficulty: 2, targetTime: 75,
    build(r) {
      const s = r.int(2, 12), n = r.pick([4, 9, 16, 25, 100]);
      return {
        prompt: `Independent observations each have standard deviation ${s}. What is the standard deviation of the mean of ${n} such observations?`,
        answerType: 'numeric', correctAnswer: round(s / Math.sqrt(n), 4), tolerance: 0.01,
        hint: 'Divide by √n, not n.',
        approach: 'Var(X̄) = σ²/n ⇒ sd = σ/√n.',
        solution: `${s}/√${n} = ${s}/${Math.sqrt(n)} = ${round(s / Math.sqrt(n), 4)}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Dividing the standard deviation by n.',
        tags: ['sampling']
      };
    }
  });

  add({
    id: 'v_corr_sum', topic: 'Variance', subtopic: 'Correlation', difficulty: 4, targetTime: 150,
    build(r) {
      const vx = r.pick([1, 4, 9]), vy = r.pick([1, 4, 9, 16]);
      const c = Math.sqrt(vx / (vx + vy));
      return {
        prompt: `X and Y are independent with Var(X) = ${vx} and Var(Y) = ${vy}. What is the correlation between X and X + Y?`,
        answerType: 'numeric', correctAnswer: round(c, 4), tolerance: 0.006,
        hint: 'Cov(X, X+Y) = Var(X) when X and Y are independent.',
        approach: 'Compute covariance and both variances, then normalise.',
        solution: `Cov(X, X+Y) = Var(X) = ${vx}. Var(X+Y) = ${vx + vy}. ρ = ${vx}/√(${vx}·${vx + vy}) = √(${vx}/${vx + vy}) = ${round(c, 4)}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Answering 0 because X and Y are independent — X appears on both sides.',
        tags: ['correlation']
      };
    }
  });

  /* ============================ E. DISTRIBUTIONS =========================== */

  add({
    id: 'd_binom_k', topic: 'Distributions', subtopic: 'Binomial', difficulty: 2, targetTime: 90,
    build(r) {
      const n = r.int(5, 10), k = r.int(2, 4), p = r.pick([0.2, 0.25, 0.3, 0.4, 0.5]);
      const pr = nCr(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
      return {
        prompt: `A trade signal fires correctly with probability ${p}, independently each day. Over ${n} days, what is the probability it is correct exactly ${k} times?`,
        answerType: 'numeric', correctAnswer: round(pr, 4), tolerance: 0.004,
        hint: 'Count the orderings of successes as well as the probability of one ordering.',
        approach: 'Binomial pmf C(n,k)p^k(1−p)^{n−k}.',
        solution: `C(${n},${k})·${p}^${k}·${round(1 - p, 2)}^${n - k} = ${nCr(n, k)}·${round(Math.pow(p, k), 5)}·${round(Math.pow(1 - p, n - k), 5)} = ${round(pr, 4)}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Omitting the binomial coefficient.',
        tags: ['binomial']
      };
    }
  });

  add({
    id: 'd_geom', topic: 'Distributions', subtopic: 'Geometric', difficulty: 2, targetTime: 75,
    build(r) {
      const p = r.pick([0.1, 0.2, 0.25, 0.3, 0.5]), k = r.int(2, 5);
      const pr = Math.pow(1 - p, k - 1) * p;
      return {
        prompt: `Independent trials each succeed with probability ${p}. What is the probability that the first success occurs on trial number ${k}?`,
        answerType: 'numeric', correctAnswer: round(pr, 5), tolerance: 0.003,
        hint: 'One specific sequence: failures then a success.',
        approach: 'Geometric pmf (1−p)^{k−1}p.',
        solution: `${round(1 - p, 2)}^${k - 1}·${p} = ${round(pr, 5)}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Using (1−p)^k p (off-by-one on the exponent).',
        tags: ['geometric']
      };
    }
  });

  add({
    id: 'd_negbinom', topic: 'Distributions', subtopic: 'Negative binomial', difficulty: 3, targetTime: 120,
    build(r) {
      const p = r.pick([0.3, 0.4, 0.5, 0.6]), rr = r.int(2, 3), k = rr + r.int(1, 3);
      const pr = nCr(k - 1, rr - 1) * Math.pow(p, rr) * Math.pow(1 - p, k - rr);
      return {
        prompt: `Independent trials each succeed with probability ${p}. What is the probability that the ${rr === 2 ? '2nd' : '3rd'} success occurs exactly on trial ${k}?`,
        answerType: 'numeric', correctAnswer: round(pr, 5), tolerance: 0.004,
        hint: 'Trial k must be a success; distribute the remaining successes among the first k−1 trials.',
        approach: 'Negative binomial: C(k−1, r−1)p^r(1−p)^{k−r}.',
        solution: `C(${k - 1},${rr - 1})·${p}^${rr}·${round(1 - p, 2)}^${k - rr} = ${round(pr, 5)}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Using C(k, r) and allowing the last trial to be a failure.',
        tags: ['negative binomial']
      };
    }
  });

  add({
    id: 'd_hyper', topic: 'Distributions', subtopic: 'Hypergeometric', difficulty: 3, targetTime: 120,
    build(r) {
      const N = r.pick([12, 15, 20]), K = r.int(4, 7), n = r.int(3, 5), k = r.int(1, Math.min(3, n));
      const pr = nCr(K, k) * nCr(N - K, n - k) / nCr(N, n);
      return {
        prompt: `A box holds ${N} components of which ${K} are defective. ${n} are drawn without replacement. What is the probability that exactly ${k} are defective?`,
        answerType: 'numeric', correctAnswer: round(pr, 4), tolerance: 0.004,
        hint: 'Choose defectives and non-defectives separately, divide by all equally likely samples.',
        approach: 'Hypergeometric: C(K,k)C(N−K,n−k)/C(N,n).',
        solution: `C(${K},${k})·C(${N - K},${n - k})/C(${N},${n}) = ${nCr(K, k)}·${nCr(N - K, n - k)}/${nCr(N, n)} = ${round(pr, 4)}.`,
        recognitionTechnique: 'Counting', commonTrap: 'Using the binomial with p = K/N.',
        tags: ['hypergeometric']
      };
    }
  });

  add({
    id: 'd_poisson', topic: 'Distributions', subtopic: 'Poisson', difficulty: 3, targetTime: 100,
    build(r) {
      const lam = r.pick([1, 2, 3, 4]), k = r.int(0, 4);
      const pr = Math.exp(-lam) * Math.pow(lam, k) / fact(k);
      return {
        prompt: `Orders arrive at an exchange gateway as a Poisson process at a rate of ${lam} per second. What is the probability that exactly ${k} orders arrive in a given second?`,
        answerType: 'numeric', correctAnswer: round(pr, 4), tolerance: 0.004,
        hint: 'λ is already per second, so no rescaling is needed.',
        approach: 'Poisson pmf e^{−λ}λ^k/k!.',
        solution: `e^{−${lam}}·${lam}^${k}/${k}! = ${round(pr, 4)}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Forgetting k! or mis-scaling the interval.',
        tags: ['poisson']
      };
    }
  });

  add({
    id: 'd_normal', topic: 'Distributions', subtopic: 'Normal', difficulty: 2, targetTime: 75,
    build(r) {
      const mu = r.pick([50, 100, 200]), sd = r.pick([5, 10, 20]);
      const kk = r.pick([1, 2]);
      const pr = kk === 1 ? 0.68 : 0.95;
      const lo = mu - kk * sd, hi = mu + kk * sd;
      return {
        prompt: `A quantity is approximately normal with mean ${mu} and standard deviation ${sd}. Using the empirical (68–95–99.7) rule, what is the approximate probability that it falls between ${lo} and ${hi}?`,
        answerType: 'numeric', correctAnswer: pr, tolerance: 0.02,
        hint: 'How many standard deviations wide is the interval on each side?',
        approach: 'Standardise, then apply the empirical rule.',
        solution: `The interval is ±${kk}σ around the mean, so the probability is about ${round(pr * 100, 1)}%.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Mixing up the one-sided and two-sided tail masses.',
        tags: ['normal']
      };
    }
  });

  add({
    id: 'd_exp_mem', topic: 'Distributions', subtopic: 'Exponential', difficulty: 3, targetTime: 100,
    build(r) {
      const mean = r.pick([2, 4, 5, 10]), t = r.pick([1, 2, 3]);
      const pr = Math.exp(-t / mean);
      return {
        prompt: `Waiting time between trades on an illiquid instrument is exponential with mean ${mean} minutes. Given that you have already waited ${r.pick([3, 6, 8])} minutes, what is the probability you must wait at least ${t} more minutes?`,
        answerType: 'numeric', correctAnswer: round(pr, 4), tolerance: 0.005,
        hint: 'The elapsed wait is a red herring.',
        approach: 'Memorylessness of the exponential: P(T > s+t | T > s) = P(T > t) = e^{−t/mean}.',
        solution: `e^{−${t}/${mean}} = ${round(pr, 4)}. The time already waited is irrelevant.`,
        recognitionTechnique: 'Conditional probability', commonTrap: 'Subtracting the elapsed time from the mean.',
        tags: ['exponential', 'memoryless']
      };
    }
  });

  add({
    id: 'd_uniform', topic: 'Distributions', subtopic: 'Uniform', difficulty: 2, targetTime: 75,
    build(r) {
      const a = r.int(0, 4), b = a + r.int(4, 12);
      const lo = a + r.int(1, 2), hi = b - r.int(1, 3);
      const pr = (hi - lo) / (b - a);
      return {
        prompt: `X is uniform on [${a}, ${b}]. What is P(${lo} ≤ X ≤ ${hi})?`,
        answerType: 'numeric', correctAnswer: round(pr, 4), tolerance: 0.004, acceptFraction: [hi - lo, b - a],
        hint: 'Length of the sub-interval over length of the whole interval.',
        approach: 'Uniform density is constant: probability equals the length ratio.',
        solution: `(${hi} − ${lo})/(${b} − ${a}) = ${hi - lo}/${b - a} = ${round(pr, 4)}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Dividing by b rather than by b − a.',
        tags: ['uniform']
      };
    }
  });

  add({
    id: 'd_uniform_max', topic: 'Order Statistics', subtopic: 'Continuous order statistics', difficulty: 3, targetTime: 120,
    build(r) {
      const n = r.int(2, 6);
      return {
        prompt: `${n} independent values are drawn uniformly from [0, 1]. What is the expected value of the largest one?`,
        answerType: 'numeric', correctAnswer: round(n / (n + 1), 4), tolerance: 0.004, acceptFraction: [n, n + 1],
        hint: 'P(max ≤ x) = xⁿ.',
        approach: 'Continuous order statistic: E[max] = ∫₀¹(1 − xⁿ)dx = n/(n+1).',
        solution: `F_max(x) = x^${n}. E = ∫₀¹(1 − x^${n})dx = 1 − 1/${n + 1} = ${n}/${n + 1} = ${round(n / (n + 1), 4)}.`,
        recognitionTechnique: 'Order statistics', commonTrap: 'Answering 1/2 or 1 − 1/n.',
        tags: ['order statistics', 'uniform']
      };
    }
  });

  add({
    id: 'd_uniform_kth', topic: 'Order Statistics', subtopic: 'Continuous order statistics', difficulty: 4, targetTime: 150,
    build(r) {
      const n = r.int(3, 7), k = r.int(1, n);
      return {
        prompt: `${n} independent values are drawn uniformly from [0, 1] and sorted increasingly. What is the expected value of the ${k}${k === 1 ? 'st' : k === 2 ? 'nd' : k === 3 ? 'rd' : 'th'} smallest?`,
        answerType: 'numeric', correctAnswer: round(k / (n + 1), 4), tolerance: 0.004, acceptFraction: [k, n + 1],
        hint: `The ${n} points cut [0,1] into ${n + 1} gaps whose expected lengths are equal by symmetry.`,
        approach: 'Spacings argument: the n points create n+1 exchangeable gaps each of mean 1/(n+1).',
        solution: `E[X_(${k})] = ${k}/(${n}+1) = ${k}/${n + 1} = ${round(k / (n + 1), 4)}.`,
        recognitionTechnique: 'Symmetry', commonTrap: 'Integrating the Beta density under time pressure when symmetry gives it instantly.',
        tags: ['order statistics', 'spacings']
      };
    }
  });

  /* ====================== R. MARKOV / STATE PROBLEMS ======================= */

  add({
    id: 'rw_hitting_reflect', topic: 'Recursion', subtopic: 'Hitting times', difficulty: 4, targetTime: 180,
    build(r) {
      const n = r.pick([3, 4, 5]);
      const p = r.pick([0.4, 0.5, 0.6]);
      const q = round(1 - p, 2);
      const A = Array.from({ length: n }, () => Array(n).fill(0));
      const b = Array(n).fill(1);
      A[0][0] = 1; A[0][1] = -1;
      for (let i = 1; i <= n - 1; i++) {
        A[i][i - 1] = -q;
        A[i][i] = 1;
        if (i + 1 <= n - 1) A[i][i + 1] = -p;
      }
      const h = solveLinear(A, b);
      const ans = round(h[0], 4);
      return {
        prompt: `A particle performs a random walk on states 0, 1, ..., ${n}. At states 1 through ${n - 1} it moves up (+1) with probability ${p} and down (−1) with probability ${q}. State 0 is a reflecting barrier: from state 0 the particle always moves to state 1. State ${n} is absorbing (the walk stops there). Starting at state 0, what is the expected number of steps to reach state ${n}?`,
        answerType: 'numeric', correctAnswer: ans, tolerance: Math.max(0.05, Math.abs(ans) * 0.01),
        hint: 'Set up first-step equations for each state\'s expected hitting time, remembering state 0 always moves to state 1 (costing one step either way).',
        approach: 'First-step analysis on a birth–death chain with a reflecting lower boundary: h_0 = 1+h_1; h_i = 1+p·h_(i+1)+q·h_(i-1) for interior i; h_n = 0. Solve the resulting linear system.',
        solution: `Solving the linear system of hitting-time equations (h_${n}=0, h_0=1+h_1, and h_i=1+${p}·h_(i+1)+${q}·h_(i-1) for i=1..${n - 1}) gives h_0 = ${ans}.`,
        recognitionTechnique: 'Recursion', commonTrap: 'Treating state 0 as absorbing instead of reflecting, or forgetting that being forced back to state 1 still costs one step.',
        tags: ['markov', 'hitting time']
      };
    }
  });

  add({
    id: 'rw_absorb_asym', topic: 'Recursion', subtopic: 'Absorption probability', difficulty: 4, targetTime: 180,
    build(r) {
      const N = r.pick([5, 8, 10]);
      const k = r.int(1, N - 1);
      const p = r.pick([0.4, 0.45, 0.55, 0.6]);
      const q = round(1 - p, 2);
      const ratio = round(q / p, 4);
      const ans = round((1 - Math.pow(ratio, k)) / (1 - Math.pow(ratio, N)), 4);
      return {
        prompt: `A gambler starts with €${k} and repeatedly bets €1 on a game won with probability ${p} (lost with probability ${q}). They stop when reaching €${N} or going broke. What is the probability they reach €${N} before going broke?`,
        answerType: 'numeric', correctAnswer: ans, tolerance: Math.max(0.005, Math.abs(ans) * 0.01),
        hint: 'This is an asymmetric random walk — the fair-game formula k/N no longer applies once p ≠ 0.5.',
        approach: "Asymmetric gambler's ruin: P(reach N before 0 | start k) = (1−(q/p)^k) / (1−(q/p)^N) for p ≠ q.",
        solution: `q/p = ${ratio}. P = (1 − ${ratio}^${k}) / (1 − ${ratio}^${N}) = ${ans}.`,
        recognitionTechnique: 'Recursion', commonTrap: 'Using the fair-game formula k/N, which only holds when p = q = 0.5.',
        tags: ['markov', "gambler's ruin", 'absorption']
      };
    }
  });

  add({
    id: 'rw_stationary3', topic: 'Recursion', subtopic: 'Stationary distribution', difficulty: 4, targetTime: 180,
    build(r) {
      const labels = ['Sunny', 'Cloudy', 'Rainy'];
      const P = [];
      for (let i = 0; i < 3; i++) {
        const a = r.pick([0.1, 0.2, 0.3]);
        const b2 = r.pick([0.1, 0.2, 0.3]);
        const c = round(1 - a - b2, 2);
        P.push([a, b2, c]);
      }
      const A = [
        [round(P[0][0] - 1, 4), P[1][0], P[2][0]],
        [P[0][1], round(P[1][1] - 1, 4), P[2][1]],
        [1, 1, 1]
      ];
      const bvec = [0, 0, 1];
      const pi = solveLinear(A, bvec).map((x) => round(x, 4));
      const state = r.int(0, 2);
      const ans = pi[state];
      const rows = labels.map((l, i) => `<tr><td>${l}</td><td>${P[i][0]}</td><td>${P[i][1]}</td><td>${P[i][2]}</td></tr>`).join('');
      return {
        prompt: `<p>A simple weather model has three states with the following daily transition probabilities:</p>
        <table class="qtable"><thead><tr><th>From \\ To</th><th>${labels[0]}</th><th>${labels[1]}</th><th>${labels[2]}</th></tr></thead><tbody>${rows}</tbody></table>
        <p>In the long run, what fraction of days is ${labels[state]}? Give the stationary probability, to 4 decimal places.</p>`,
        answerType: 'numeric', correctAnswer: ans, tolerance: Math.max(0.005, Math.abs(ans) * 0.02),
        hint: 'Solve π = πP together with the constraint that the three probabilities sum to 1.',
        approach: 'Stationary distribution: solve the balance equations π = πP plus Σπ = 1 for the 3-state chain.',
        solution: `Solving π=πP with Σπ=1 gives π(${labels[0]})=${pi[0]}, π(${labels[1]})=${pi[1]}, π(${labels[2]})=${pi[2]}. So π(${labels[state]}) = ${ans}.`,
        recognitionTechnique: 'Recursion', commonTrap: 'Forgetting the normalization constraint Σπ=1 — the balance equations π=πP alone are one equation short of a unique solution.',
        tags: ['markov', 'stationary distribution']
      };
    }
  });

  global.QTL_GEN_PROB = G;
})(window);
