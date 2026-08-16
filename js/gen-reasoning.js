/* QUANT TEST LAB — REASONING TRACK generators.
   Numerical, abstract/pattern and logical reasoning items for speed-focused
   assessments (CCAT / Watson-Glaser / numerical-verbal OA style). Every
   generator returns a fully verified answer computed directly from the same
   parameters used to build the prompt, so there is never a separate
   "make up a plausible answer" step. track:'reasoning' throughout. */
(function (global) {
  'use strict';
  const U = global.QTL_UTIL;
  const { round } = U;
  const G = [];
  const add = (g) => { g.track = 'reasoning'; G.push(g); };

  const SYMBOLS = ['▲', '●', '■', '◆', '★', '▼', '◇', '○'];

  function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
    return true;
  }
  function isSquare(n) { const s = Math.round(Math.sqrt(n)); return s * s === n; }

  function gridTable(cells, missingIdx, fmt) {
    fmt = fmt || ((v) => String(v));
    let rows = '';
    for (let r = 0; r < 3; r++) {
      rows += '<tr>';
      for (let c = 0; c < 3; c++) {
        const i = r * 3 + c;
        rows += `<td>${i === missingIdx ? '<strong>?</strong>' : fmt(cells[i])}</td>`;
      }
      rows += '</tr>';
    }
    return `<table class="qtable"><tbody>${rows}</tbody></table>`;
  }

  /* ============================ NUMERICAL REASONING ============================ */

  add({
    id: 'rn_arith', topic: 'Numerical Reasoning', subtopic: 'Sequences', difficulty: 1, targetTime: 20,
    build(r) {
      const a = r.int(2, 40), d = r.pick([2, 3, 4, 5, 6, 7, 8, -2, -3, -4, -5, -6]);
      const seq = [0, 1, 2, 3, 4].map((i) => a + i * d);
      const next = a + 5 * d;
      return {
        prompt: `What number comes next? ${seq.join(', ')}, ?`,
        answerType: 'numeric', correctAnswer: next, tolerance: 0,
        hint: 'Find the constant difference between consecutive terms.',
        approach: 'First-difference test: the sequence is arithmetic with common difference ' + d + '.',
        solution: `Consecutive differences are all ${d}. Next term = ${seq[4]} + (${d}) = ${next}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Miscounting how many steps of ' + d + ' separate the last shown term from the answer.',
        tags: ['sequence', 'arithmetic']
      };
    }
  });

  add({
    id: 'rn_geom', topic: 'Numerical Reasoning', subtopic: 'Sequences', difficulty: 2, targetTime: 25,
    build(r) {
      const a = r.int(1, 6), q = r.pick([2, 3]);
      const seq = [0, 1, 2, 3].map((i) => a * Math.pow(q, i));
      const next = a * Math.pow(q, 4);
      return {
        prompt: `What number comes next? ${seq.join(', ')}, ?`,
        answerType: 'numeric', correctAnswer: next, tolerance: 0,
        hint: 'Divide each term by the one before it — is the ratio constant?',
        approach: 'Ratio test: the sequence is geometric with common ratio ' + q + '.',
        solution: `Each term is ${q}× the previous one. Next term = ${seq[3]} × ${q} = ${next}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: `Treating it as arithmetic and adding a constant difference instead of multiplying.`,
        tags: ['sequence', 'geometric']
      };
    }
  });

  add({
    id: 'rn_quad', topic: 'Numerical Reasoning', subtopic: 'Sequences', difficulty: 3, targetTime: 35,
    build(r) {
      const a = r.int(1, 10), d0 = r.pick([1, 2, 3, -1, -2]), s = r.pick([1, 2, 3, -1, -2]);
      const seq = [a];
      let diff = d0;
      for (let i = 0; i < 5; i++) { seq.push(seq[seq.length - 1] + diff); diff += s; }
      const shown = seq.slice(0, 5), next = seq[5];
      return {
        prompt: `What number comes next? ${shown.join(', ')}, ?`,
        answerType: 'numeric', correctAnswer: next, tolerance: 0,
        hint: 'The first differences are not constant — try taking differences of the differences.',
        approach: 'Second-difference test: first differences change by a constant amount (' + s + ' each time), so the sequence is quadratic.',
        solution: `First differences: ${shown.slice(1).map((v, i) => v - shown[i]).join(', ')} — these themselves increase by ${s} each step. The next first difference is ${shown[4] - shown[3] + s}, so the next term is ${shown[4]} + (${shown[4] - shown[3] + s}) = ${next}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Stopping at the first-difference table and forcing an arithmetic answer when the differences are not constant.',
        tags: ['sequence', 'quadratic']
      };
    }
  });

  add({
    id: 'rn_interleave', topic: 'Numerical Reasoning', subtopic: 'Sequences', difficulty: 3, targetTime: 35,
    build(r) {
      const a1 = r.int(1, 15), d1 = r.pick([2, 3, 4, 5]);
      const a2 = r.int(1, 15), d2 = r.pick([2, 3, 4, 5, -2, -3]);
      // combined[i]: even index i=2k -> subsequence A term k; odd index i=2k+1 -> subsequence B term k
      const subA = [0, 1, 2, 3].map((k) => a1 + k * d1);
      const subB = [0, 1, 2].map((k) => a2 + k * d2);
      const combined = [subA[0], subB[0], subA[1], subB[1], subA[2], subB[2]];
      const next = subA[3];
      return {
        prompt: `This sequence alternates between two interleaved patterns. What number comes next? ${combined.join(', ')}, ?`,
        answerType: 'numeric', correctAnswer: next, tolerance: 0,
        hint: 'Split the sequence into two separate sequences: the 1st, 3rd, 5th... terms, and the 2nd, 4th, 6th... terms.',
        approach: 'Two interleaved arithmetic sequences: positions 1,3,5,7 form one pattern (+' + d1 + ' each step) and positions 2,4,6 form another (' + (d2 >= 0 ? '+' : '') + d2 + ' each step). The next term continues the first pattern.',
        solution: `Odd positions: ${subA.slice(0, 3).join(', ')}, ... increasing by ${d1} each time → next is ${subA[2]} + ${d1} = ${next}. Even positions: ${subB.join(', ')}, ... increasing by ${d2} each time (not needed for this answer since position 7 belongs to the odd-position pattern).`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Treating all six numbers as one single sequence and looking for one common rule.',
        tags: ['sequence', 'interleaved']
      };
    }
  });

  add({
    id: 'rn_fib', topic: 'Numerical Reasoning', subtopic: 'Sequences', difficulty: 3, targetTime: 30,
    build(r) {
      const a = r.int(1, 6), b = r.int(1, 8), m = r.pick([1, 1, 1, 2]);
      const seq = [a, b];
      for (let i = 0; i < 3; i++) seq.push(seq[seq.length - 1] + m * seq[seq.length - 2]);
      const shown = seq.slice(0, 4), next = seq[4];
      const rule = m === 1 ? 'each term equals the sum of the two terms before it' : `each term equals the previous term plus ${m} times the term before that`;
      return {
        prompt: `What number comes next? ${shown.join(', ')}, ?`,
        answerType: 'numeric', correctAnswer: next, tolerance: 0,
        hint: 'Look at how each term relates to the TWO terms before it, not just the one immediately before.',
        approach: `Fibonacci-style recursion: ${rule}.`,
        solution: `${shown[2]} = ${shown[1]} ${m === 1 ? '+' : '+ ' + m + '×'} ${shown[0]}; ${shown[3]} = ${shown[2]} ${m === 1 ? '+' : '+ ' + m + '×'} ${shown[1]}. Continuing the rule: next = ${shown[3]} ${m === 1 ? '+' : '+ ' + m + '×'} ${shown[2]} = ${next}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Only checking the difference between adjacent terms instead of testing a two-term recursion.',
        tags: ['sequence', 'fibonacci']
      };
    }
  });

  add({
    id: 'rn_altop', topic: 'Numerical Reasoning', subtopic: 'Sequences', difficulty: 3, targetTime: 30,
    build(r) {
      const a = r.int(1, 5), p = r.pick([2, 3]), q = r.pick([1, 2, 3, 4, 5]);
      const seq = [a];
      for (let i = 0; i < 4; i++) {
        const prev = seq[seq.length - 1];
        seq.push(i % 2 === 0 ? prev * p : prev + q);
      }
      const shown = seq.slice(0, 4), next = seq[4];
      const nextOpIsMul = shown.length % 2 === 0;
      return {
        prompt: `The rule alternates between two operations. What number comes next? ${shown.join(', ')}, ?`,
        answerType: 'numeric', correctAnswer: next, tolerance: 0,
        hint: `Check what happens on odd steps versus even steps separately.`,
        approach: `Alternating operation: ×${p}, then +${q}, then ×${p}, then +${q}, repeating.`,
        solution: `${shown[0]} ×${p} = ${shown[1]}; ${shown[1]} +${q} = ${shown[2]}; ${shown[2]} ×${p} = ${shown[3]}; next step is +${q}: ${shown[3]} + ${q} = ${next}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Applying the same single operation to every step instead of alternating.',
        tags: ['sequence', 'alternating-operation']
      };
    }
  });

  add({
    id: 'rn_linrec', topic: 'Numerical Reasoning', subtopic: 'Sequences', difficulty: 3, targetTime: 30,
    build(r) {
      const a = r.int(1, 5), k = r.pick([2, 3]), c = r.pick([1, 2, 3, 4, 5, -1, -2]);
      const seq = [a];
      for (let i = 0; i < 4; i++) seq.push(seq[seq.length - 1] * k + c);
      const shown = seq.slice(0, 4), next = seq[4];
      return {
        prompt: `What number comes next? ${shown.join(', ')}, ?`,
        answerType: 'numeric', correctAnswer: next, tolerance: 0,
        hint: 'This is neither purely additive nor purely multiplicative — try "multiply, then add a fixed amount."',
        approach: `Each term = previous term × ${k}, then ${c >= 0 ? '+ ' + c : '− ' + Math.abs(c)}.`,
        solution: `${shown[3]} × ${k} = ${shown[3] * k}; ${shown[3] * k} ${c >= 0 ? '+ ' + c : '− ' + Math.abs(c)} = ${next}. The same rule generates every step: e.g. ${shown[0]}→${shown[1]}, ${shown[1]}→${shown[2]}, ${shown[2]}→${shown[3]}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Testing only a pure ratio or only a pure difference, missing the combined rule.',
        tags: ['sequence', 'linear-recurrence']
      };
    }
  });

  add({
    id: 'rn_missing_mid', topic: 'Numerical Reasoning', subtopic: 'Sequences', difficulty: 2, targetTime: 25,
    build(r) {
      const mode = r.pick(['arith', 'geom']);
      let seq, missingPos;
      if (mode === 'arith') {
        const a = r.int(2, 30), d = r.pick([2, 3, 4, 5, 6, -2, -3, -4]);
        seq = [0, 1, 2, 3, 4].map((i) => a + i * d);
      } else {
        const a = r.int(1, 6), q = r.pick([2, 3]);
        seq = [0, 1, 2, 3, 4].map((i) => a * Math.pow(q, i));
      }
      missingPos = r.int(1, 3); // never the first or last term
      const missing = seq[missingPos];
      const display = seq.map((v, i) => (i === missingPos ? '?' : v));
      return {
        prompt: `Fill in the missing term: ${display.join(', ')}`,
        answerType: 'numeric', correctAnswer: missing, tolerance: 0,
        hint: 'Work out the rule from the terms you can see on both sides of the gap.',
        approach: mode === 'arith' ? 'Arithmetic sequence — use the visible common difference to fill the gap.' : 'Geometric sequence — use the visible common ratio to fill the gap.',
        solution: mode === 'arith'
          ? `The common difference is ${seq[1] - seq[0]}. The missing term is ${seq[missingPos - 1]} + (${seq[1] - seq[0]}) = ${missing}.`
          : `The common ratio is ${seq[1] / seq[0]}. The missing term is ${seq[missingPos - 1]} × ${seq[1] / seq[0]} = ${missing}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Only checking the rule on one side of the gap instead of confirming it against both neighbours.',
        tags: ['sequence', 'missing-term']
      };
    }
  });

  add({
    id: 'rn_grid_row', topic: 'Numerical Reasoning', subtopic: 'Number grids', difficulty: 2, targetTime: 35,
    build(r) {
      const colStep = r.pick([2, 3, 4, 5]);
      const rowBase = [];
      while (rowBase.length < 3) {
        const v = r.int(1, 20);
        if (!rowBase.includes(v)) rowBase.push(v);
      }
      const cells = [];
      for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) cells.push(rowBase[row] + col * colStep);
      const missingIdx = r.int(0, 8);
      const missing = cells[missingIdx];
      return {
        prompt: `<p>Each row follows the same left-to-right rule. What number replaces the "?"</p>${gridTable(cells, missingIdx)}`,
        answerType: 'numeric', correctAnswer: missing, tolerance: 0,
        hint: 'Compare the three numbers within the SAME row as the missing cell.',
        approach: 'Every row increases by the same constant step moving left to right; use the missing cell\'s own row.',
        solution: `Moving left to right, every row increases by ${colStep}. In the row containing the "?", that gives the missing value ${missing}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Looking down a column for the pattern when the rule actually runs across each row.',
        tags: ['grid']
      };
    }
  });

  add({
    id: 'rn_grid_bilinear', topic: 'Numerical Reasoning', subtopic: 'Number grids', difficulty: 3, targetTime: 45,
    build(r) {
      const base = r.int(1, 10), rowStep = r.pick([3, 4, 5]), colStep = r.pick([2, 3, 6, 7]);
      const cells = [];
      for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) cells.push(base + row * rowStep + col * colStep);
      const missingIdx = r.int(0, 8);
      const missing = cells[missingIdx];
      const mr = Math.floor(missingIdx / 3), mc = missingIdx % 3;
      return {
        prompt: `<p>Every cell is built from its row number and column number by the same rule. What number replaces the "?"</p>${gridTable(cells, missingIdx)}`,
        answerType: 'numeric', correctAnswer: missing, tolerance: 0,
        hint: 'Find how much a cell increases when you move one step right, and separately how much it increases when you move one step down.',
        approach: `Cell value = ${base} + (row index)×${rowStep} + (column index)×${colStep}, with row and column both counted from 0.`,
        solution: `Moving one column right adds ${colStep}; moving one row down adds ${rowStep}. The missing cell is in row ${mr + 1}, column ${mc + 1} (counting from 1), giving ${base} + ${mr}×${rowStep} + ${mc}×${colStep} = ${missing}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Only checking rows OR only checking columns instead of combining both step sizes.',
        tags: ['grid']
      };
    }
  });

  add({
    id: 'rn_odd_one_out', topic: 'Numerical Reasoning', subtopic: 'Odd one out', difficulty: 2, targetTime: 25,
    build(r) {
      const kind = r.pick(['even', 'multiple3', 'multiple5', 'square', 'prime']);
      let pool, outlierPool, label;
      if (kind === 'even') { pool = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]; outlierPool = [3, 5, 7, 9, 11, 13, 15, 17]; label = 'even numbers'; }
      else if (kind === 'multiple3') { pool = [6, 9, 12, 15, 18, 21, 24, 27, 30, 33]; outlierPool = [7, 8, 10, 11, 13, 14, 16, 17]; label = 'multiples of 3'; }
      else if (kind === 'multiple5') { pool = [10, 15, 20, 25, 30, 35, 40, 45]; outlierPool = [12, 13, 14, 16, 17, 18, 19]; label = 'multiples of 5'; }
      else if (kind === 'square') { pool = [4, 9, 16, 25, 36, 49, 64, 81]; outlierPool = [10, 12, 15, 20, 24, 30, 40, 50]; label = 'perfect squares'; }
      else { pool = [2, 3, 5, 7, 11, 13, 17, 19, 23]; outlierPool = [4, 6, 8, 9, 10, 12, 14, 15]; label = 'prime numbers'; }
      const chosen = r.sample(pool, 5);
      const outlier = r.pick(outlierPool);
      const options = r.shuffle(chosen.concat([outlier]));
      return {
        prompt: `Five of these six numbers share a property. Which one does NOT belong? ${options.join(', ')}`,
        answerType: 'mc', options: options.map(String), correctAnswer: String(outlier),
        hint: `Check each number against the categories: even/odd, multiples of small numbers, perfect squares, primes.`,
        approach: `Five numbers are ${label}; one is not.`,
        solution: `${chosen.join(', ')} are all ${label}. ${outlier} is the only one that is not, so it is the odd one out.`,
        recognitionTechnique: 'Other', commonTrap: 'Fixating on the first property you notice (like odd/even) when the shared property is something else (like "multiple of 3").',
        tags: ['odd-one-out']
      };
    }
  });

  add({
    id: 'rn_power', topic: 'Numerical Reasoning', subtopic: 'Sequences', difficulty: 2, targetTime: 30,
    build(r) {
      const power = r.pick([2, 3]), c = r.int(-5, 5);
      const seq = [1, 2, 3, 4, 5].map((n) => Math.pow(n, power) + c);
      const next = Math.pow(6, power) + c;
      return {
        prompt: `What number comes next? ${seq.join(', ')}, ?`,
        answerType: 'numeric', correctAnswer: next, tolerance: 0,
        hint: `Compare each term to the square${power === 3 ? ' or cube' : ''} of its position in the list (1st, 2nd, 3rd...).`,
        approach: `Each term equals (position)${power === 2 ? '²' : '³'} ${c >= 0 ? '+ ' + c : '− ' + Math.abs(c)}.`,
        solution: `Term n = n${power === 2 ? '²' : '³'} ${c >= 0 ? '+ ' + c : '− ' + Math.abs(c)}. For n=6: 6${power === 2 ? '²' : '³'} = ${Math.pow(6, power)}, so the answer is ${Math.pow(6, power)} ${c >= 0 ? '+ ' + c : '− ' + Math.abs(c)} = ${next}.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Testing only first differences, which grow but are not constant or even linear for a squared/cubed rule.',
        tags: ['sequence', 'power']
      };
    }
  });

  /* ========================= ABSTRACT / PATTERN REASONING ========================= */
  /* Text/unicode approximation of visual pattern-matrix reasoning. This trains the
     underlying skill (spot the rule, apply it) but is NOT a substitute for genuine
     spatial reasoning with rotated/reflected figures, which needs images — see the
     honesty note in the Learn lesson for this section. */

  add({
    id: 'rn_sym_cycle', topic: 'Abstract Reasoning', subtopic: 'Symbol cycles', difficulty: 2, targetTime: 25,
    build(r) {
      const period = r.int(3, 5);
      const set = r.sample(SYMBOLS, period);
      const shown = [];
      for (let i = 0; i < period * 2; i++) shown.push(set[i % period]);
      const targetPos = r.int(period * 2 + 1, period * 2 + 8); // 1-indexed position to predict
      const answer = set[(targetPos - 1) % period];
      const distractorPool = SYMBOLS.filter((s) => !set.includes(s));
      const options = r.shuffle(set.slice(0, Math.min(3, set.length)).concat(r.sample(distractorPool, 1)).filter((v, i, a) => a.indexOf(v) === i));
      while (options.length < 4) { const c = r.pick(SYMBOLS); if (!options.includes(c)) options.push(c); }
      if (!options.includes(answer)) options[0] = answer;
      return {
        prompt: `This symbol pattern repeats with a fixed period: ${shown.join(' ')} ...\nWhich symbol is in position ${targetPos} of the sequence (counting the first symbol shown as position 1)?`,
        answerType: 'mc', options: r.shuffle(Array.from(new Set(options))).map(String), correctAnswer: answer,
        hint: `Find the repeating block first — how many symbols before it repeats?`,
        approach: `The cycle has period ${period}: ${set.join(' ')}. Position N holds the symbol at index (N−1) mod ${period}.`,
        solution: `The block ${set.join(' ')} repeats every ${period} symbols. Position ${targetPos}: (${targetPos}−1) mod ${period} = ${(targetPos - 1) % period}, which is "${answer}".`,
        recognitionTechnique: 'Other', commonTrap: 'Miscounting the period, especially when it does not divide evenly into the number of symbols shown.',
        tags: ['abstract', 'cycle']
      };
    }
  });

  add({
    id: 'rn_sym_growth', topic: 'Abstract Reasoning', subtopic: 'Growing patterns', difficulty: 1, targetTime: 25,
    build(r) {
      const sym = r.pick(SYMBOLS);
      const start = r.int(1, 3), step = r.pick([1, 2, 3]);
      const counts = [0, 1, 2, 3].map((i) => start + i * step);
      const steps = counts.map((n) => sym.repeat(n));
      const nextCount = start + 4 * step;
      return {
        prompt: `The number of symbols follows a fixed rule at each step:\nStep 1: ${steps[0]}\nStep 2: ${steps[1]}\nStep 3: ${steps[2]}\nStep 4: ${steps[3]}\nHow many symbols will step 5 have?`,
        answerType: 'numeric', correctAnswer: nextCount, tolerance: 0,
        hint: 'Count the symbols at each step and look at how the count itself changes.',
        approach: `The count of symbols increases by ${step} at every step (an arithmetic pattern in the COUNT, not in the symbol itself).`,
        solution: `Counts are ${counts.join(', ')}, increasing by ${step} each step. Step 5 has ${counts[3]} + ${step} = ${nextCount} symbols.`,
        recognitionTechnique: 'Direct calculation', commonTrap: 'Trying to find a rule about which symbol appears instead of counting how many appear.',
        tags: ['abstract', 'growth']
      };
    }
  });

  add({
    id: 'rn_sym_grid', topic: 'Abstract Reasoning', subtopic: 'Symbol grids', difficulty: 3, targetTime: 45,
    build(r) {
      const sym = r.pick(SYMBOLS);
      const rowBase = [1, r.int(2, 3), r.int(4, 6)].sort((a, b) => a - b);
      const colStep = r.pick([1, 2]);
      const counts = [];
      for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) counts.push(rowBase[row] + col * colStep);
      const missingIdx = r.int(0, 8);
      const missing = counts[missingIdx];
      const cellsText = counts.map((n) => sym.repeat(n));
      const mr = Math.floor(missingIdx / 3), mc = missingIdx % 3;
      return {
        prompt: `<p>Each cell shows a number of "${sym}" symbols, following the same rule as the number grids. How many symbols belong in the "?" cell?</p>${gridTable(cellsText, missingIdx, (v) => v)}`,
        answerType: 'numeric', correctAnswer: missing, tolerance: 0,
        hint: 'Count the symbols in each cell first, then look for the row and column pattern in those counts.',
        approach: `Counting symbols converts this into the same row+column additive rule as a number grid: count = (row base) + (column index)×${colStep}.`,
        solution: `Counting each cell gives row bases ${rowBase.join(', ')} with each column adding ${colStep} more symbols. Row ${mr + 1}, column ${mc + 1} (from 1): ${rowBase[mr]} + ${mc}×${colStep} = ${missing} symbols.`,
        recognitionTechnique: 'Other', commonTrap: 'Trying to read a shape-based rule when the actual pattern is purely in the COUNT of symbols.',
        tags: ['abstract', 'grid']
      };
    }
  });

  add({
    id: 'rn_sym_altcycle', topic: 'Abstract Reasoning', subtopic: 'Symbol cycles', difficulty: 3, targetTime: 35,
    build(r) {
      const setA = r.sample(SYMBOLS, 2);
      const rest = SYMBOLS.filter((s) => !setA.includes(s));
      const setB = r.sample(rest, 3);
      const combined = [];
      for (let i = 0; i < 6; i++) combined.push(i % 2 === 0 ? setA[(i / 2) % 2] : setB[((i - 1) / 2) % 3]);
      const targetPos = r.int(9, 14); // 1-indexed
      const answer = (targetPos % 2 === 1) ? setA[((targetPos - 1) / 2) % 2] : setB[((targetPos - 2) / 2) % 3];
      const options = Array.from(new Set([answer].concat(setA, setB))).slice(0, 4);
      while (options.length < 4) { const c = r.pick(SYMBOLS); if (!options.includes(c)) options.push(c); }
      return {
        prompt: `Two symbol cycles are interleaved: ${combined.join(' ')} ...\nWhich symbol is in position ${targetPos}?`,
        answerType: 'mc', options: r.shuffle(options).map(String), correctAnswer: answer,
        hint: 'Odd positions (1st, 3rd, 5th...) belong to one cycle; even positions belong to the other.',
        approach: `Odd positions cycle through ${setA.join(' ')} (period 2); even positions cycle through ${setB.join(' ')} (period 3).`,
        solution: `Position ${targetPos} is ${targetPos % 2 === 1 ? 'odd' : 'even'}, so it belongs to the ${targetPos % 2 === 1 ? setA.join('/') : setB.join('/')} cycle. Working out its place in that cycle gives "${answer}".`,
        recognitionTechnique: 'Other', commonTrap: 'Treating the whole interleaved list as a single cycle instead of splitting it into two.',
        tags: ['abstract', 'cycle', 'interleaved']
      };
    }
  });

  /* ============================= LOGICAL REASONING ============================= */

  const NOUN_TRIPLES = [
    ['engineers', 'doctors', 'musicians'], ['painters', 'teachers', 'athletes'],
    ['bankers', 'chefs', 'sailors'], ['lawyers', 'pilots', 'dancers'],
    ['students', 'scientists', 'writers'], ['nurses', 'farmers', 'actors'],
    ['drivers', 'surgeons', 'poets'], ['managers', 'clerks', 'singers'],
    ['soldiers', 'artists', 'traders'], ['coaches', 'analysts', 'gardeners']
  ];
  const propAll = (x, y) => `All ${x} are ${y}.`;
  const propNo = (x, y) => `No ${x} are ${y}.`;
  const propSome = (x, y) => `Some ${x} are ${y}.`;
  const propSomeNot = (x, y) => `Some ${x} are not ${y}.`;

  /* Every form below is a verified categorical syllogism with S = minor term,
     M = middle term (does not appear in the conclusion), P = major term.
     Validity was checked by exhaustive finite-model search over small universes
     (see scratch validation) as well as manual Venn-diagram / distribution-rule
     reasoning; see the 'why' text in each for the specific justification. */
  const SYLLOGISM_FORMS = [
    { name: 'Barbara', valid: true, premise1: (S, M, P) => propAll(M, P), premise2: (S, M, P) => propAll(S, M), conclusion: (S, M, P) => propAll(S, P), why: (S, M, P) => `All ${M} are ${P}, and every ${S.slice(0, -1)} is a ${M.slice(0, -1)}, so every ${S.slice(0, -1)} must also be a ${P.slice(0, -1)}. Valid.` },
    { name: 'Celarent', valid: true, premise1: (S, M, P) => propNo(M, P), premise2: (S, M, P) => propAll(S, M), conclusion: (S, M, P) => propNo(S, P), why: (S, M, P) => `${M} and ${P} do not overlap at all, and every ${S.slice(0, -1)} is inside ${M}, so no ${S.slice(0, -1)} can be inside ${P} either. Valid.` },
    { name: 'Darii', valid: true, premise1: (S, M, P) => propAll(M, P), premise2: (S, M, P) => propSome(S, M), conclusion: (S, M, P) => propSome(S, P), why: (S, M, P) => `The ${S} that are ${M} are guaranteed to also be ${P}, since every ${M.slice(0, -1)} is a ${P.slice(0, -1)}. Valid.` },
    { name: 'Ferio', valid: true, premise1: (S, M, P) => propNo(M, P), premise2: (S, M, P) => propSome(S, M), conclusion: (S, M, P) => propSomeNot(S, P), why: (S, M, P) => `Some ${S} are ${M}, and no ${M} are ${P}, so those particular ${S} cannot be ${P} — giving at least some ${S} that are not ${P}. Valid.` },
    { name: 'Disamis', valid: true, premise1: (S, M, P) => propSome(M, P), premise2: (S, M, P) => propAll(M, S), conclusion: (S, M, P) => propSome(S, P), why: (S, M, P) => `Take one of the ${M} that is also ${P} (premise 1). Since all ${M} are ${S} (premise 2), that same individual is also ${S} — so it is both ${S} and ${P}. Valid.` },
    { name: 'Bocardo', valid: true, premise1: (S, M, P) => propSomeNot(M, P), premise2: (S, M, P) => propAll(M, S), conclusion: (S, M, P) => propSomeNot(S, P), why: (S, M, P) => `Take one of the ${M} that is not ${P} (premise 1). Since all ${M} are ${S} (premise 2), that same individual is ${S} — so it is ${S} but not ${P}. Valid.` },
    { name: 'Baroko', valid: true, premise1: (S, M, P) => propAll(P, M), premise2: (S, M, P) => propSomeNot(S, M), conclusion: (S, M, P) => propSomeNot(S, P), why: (S, M, P) => `Take an ${S} that is not ${M} (premise 2). Since all ${P} are ${M} (premise 1), anything outside ${M} must be outside ${P} too — so that ${S} is not ${P}. Valid.` },
    { name: 'undistributed-middle-1', valid: false, premise1: (S, M, P) => propAll(P, M), premise2: (S, M, P) => propAll(S, M), conclusion: (S, M, P) => propAll(S, P), why: (S, M, P) => `Both premises only place ${P} and ${S} INSIDE ${M} — neither says anything about how they relate to each other within ${M}. E.g. all ${P} could be one part of ${M} and all ${S} a completely different part. Invalid (undistributed middle term).` },
    { name: 'undistributed-middle-2', valid: false, premise1: (S, M, P) => propAll(P, M), premise2: (S, M, P) => propSome(S, M), conclusion: (S, M, P) => propSome(S, P), why: (S, M, P) => `"Some ${S} are ${M}" only guarantees overlap with ${M}, not specifically with the (possibly smaller) ${P} part of ${M}. Invalid (undistributed middle term).` },
    { name: 'two-negatives', valid: false, premise1: (S, M, P) => propNo(M, P), premise2: (S, M, P) => propNo(S, M), conclusion: (S, M, P) => propNo(S, P), why: (S, M, P) => `Knowing ${S} is excluded from ${M}, and ${M} is excluded from ${P}, says nothing about whether ${S} and ${P} overlap each other — ${S} is free to be entirely inside ${P} instead. Invalid (two negative premises).` },
    { name: 'illicit-collapse', valid: false, premise1: (S, M, P) => propAll(M, P), premise2: (S, M, P) => propAll(M, S), conclusion: (S, M, P) => propAll(S, P), why: (S, M, P) => `Both premises describe ${M} as a subset of ${P} and of ${S} separately — but ${S} can easily contain members that have nothing to do with ${M} (and so nothing guarantees they are ${P}). Invalid.` },
    { name: 'undistributed-middle-3', valid: false, premise1: (S, M, P) => propSome(S, M), premise2: (S, M, P) => propAll(P, M), conclusion: (S, M, P) => propSome(S, P), why: (S, M, P) => `The ${S} that overlaps ${M} is not guaranteed to be the same part of ${M} that ${P} occupies. Invalid (undistributed middle term).` },
    { name: 'particular-negative-particular', valid: false, premise1: (S, M, P) => propSomeNot(M, P), premise2: (S, M, P) => propSome(S, M), conclusion: (S, M, P) => propSomeNot(S, P), why: (S, M, P) => `The ${M} that is excluded from ${P} (premise 1) need not be the same ${M} that overlaps ${S} (premise 2) — two different "some" statements about ${M} are not guaranteed to point at the same members. Invalid.` }
  ];

  add({
    id: 'rn_syllogism', topic: 'Logical Reasoning', subtopic: 'Syllogisms', difficulty: 3, targetTime: 30,
    build(r) {
      const form = r.pick(SYLLOGISM_FORMS);
      const [S, M, P] = r.shuffle(r.pick(NOUN_TRIPLES).slice());
      const p1 = form.premise1(S, M, P), p2 = form.premise2(S, M, P), concl = form.conclusion(S, M, P);
      const verdict = form.valid ? 'Valid' : 'Invalid';
      return {
        prompt: `${p1} ${p2} Therefore, ${concl.charAt(0).toLowerCase() + concl.slice(1)} Is this conclusion VALID (it must be true whenever the premises are true) or INVALID (the premises do not guarantee it)?`,
        answerType: 'mc', options: ['Valid', 'Invalid'], correctAnswer: verdict,
        hint: 'Draw three circles (or picture three groups) — does the conclusion hold in every possible arrangement consistent with both premises, or can you sketch an arrangement where the premises hold but the conclusion fails?',
        approach: 'Categorical syllogism: check whether the conclusion is forced by the two premises in every possible arrangement, not just the most natural-sounding one.',
        solution: form.why(S, M, P),
        recognitionTechnique: 'Other', commonTrap: 'Judging validity by whether the conclusion sounds true in the real world rather than whether it is logically forced by the premises.',
        tags: ['logic', 'syllogism', form.name]
      };
    }
  });

  const COND_FORMS = [
    { name: 'modus-ponens', valid: true, minor: (P, Q) => P, ask: (P, Q) => Q, why: (P, Q) => `Affirming the antecedent: since "${P}" is true and "if ${P.toLowerCase()} then ${Q.toLowerCase()}" is given, "${Q}" is forced to be true. Valid (modus ponens).` },
    { name: 'modus-tollens', valid: true, minor: (P, Q) => 'It is not the case that ' + Q.charAt(0).toLowerCase() + Q.slice(1), ask: (P, Q) => 'It is not the case that ' + P.charAt(0).toLowerCase() + P.slice(1), why: (P, Q) => `Denying the consequent: if "${Q}" were true, "${P}" would have to be true too (by the conditional) — but "${Q}" is false, so "${P}" must be false. Valid (modus tollens).` },
    { name: 'affirming-consequent', valid: false, minor: (P, Q) => Q, ask: (P, Q) => P, why: (P, Q) => `Knowing "${Q}" is true does not tell you "${P}" caused it — the conditional guarantees "${Q}" whenever "${P}" happens, but it never claims "${P}" is the ONLY way "${Q}" can happen. Invalid (affirming the consequent).` },
    { name: 'denying-antecedent', valid: false, minor: (P, Q) => 'It is not the case that ' + P.charAt(0).toLowerCase() + P.slice(1), ask: (P, Q) => 'It is not the case that ' + Q.charAt(0).toLowerCase() + Q.slice(1), why: (P, Q) => `The conditional only guarantees "${Q}" when "${P}" happens — it says nothing about what happens when "${P}" does NOT occur; "${Q}" could still happen for some other reason. Invalid (denying the antecedent).` }
  ];
  const COND_PAIRS = [
    ['the machine overheats', 'the safety valve opens'], ['a bond is downgraded', 'its yield rises'],
    ['it rains overnight', 'the pitch is closed in the morning'], ['inflation rises sharply', 'the central bank raises rates'],
    ['a trade breaches the risk limit', 'the position is automatically closed'], ['the server load exceeds 90%', 'a new instance is launched'],
    ['a shipment is delayed', 'the client is notified within an hour'], ['the exam score is below 50', 'the candidate is not shortlisted']
  ];

  add({
    id: 'rn_conditional', topic: 'Logical Reasoning', subtopic: 'Conditional reasoning', difficulty: 2, targetTime: 25,
    build(r) {
      const form = r.pick(COND_FORMS);
      const [pRaw, qRaw] = r.pick(COND_PAIRS);
      const P = pRaw.charAt(0).toUpperCase() + pRaw.slice(1), Q = qRaw.charAt(0).toUpperCase() + qRaw.slice(1);
      const minorStmt = form.minor(P, Q), askStmt = form.ask(P, Q);
      const verdict = form.valid ? 'Valid' : 'Invalid';
      return {
        prompt: `If ${pRaw}, then ${qRaw}. ${minorStmt}. Therefore, ${askStmt.charAt(0).toLowerCase() + askStmt.slice(1)}. Is this conclusion VALID or INVALID?`,
        answerType: 'mc', options: ['Valid', 'Invalid'], correctAnswer: verdict,
        hint: 'A conditional "if P then Q" only promises Q when P happens — it says nothing about what happens when P does not happen, and it does not claim P is the ONLY way to get Q.',
        approach: 'Conditional reasoning: identify whether the argument affirms/denies the antecedent or the consequent.',
        solution: form.why(P, Q),
        recognitionTechnique: 'Other', commonTrap: 'Treating "if P then Q" as if it also means "if Q then P" and "if not P then not Q" — a conditional only guarantees one direction.',
        tags: ['logic', 'conditional', form.name]
      };
    }
  });

  const NAME_POOL = ['Ana', 'Ben', 'Cara', 'Dev', 'Elin', 'Finn', 'Gia', 'Hugo'];

  add({
    id: 'rn_ordering', topic: 'Logical Reasoning', subtopic: 'Ordering puzzles', difficulty: 4, targetTime: 60,
    build(r) {
      const n = r.pick([4, 4, 5]);
      const names = r.sample(NAME_POOL, n);
      const truth = r.shuffle(names.slice()); // truth[0] = leftmost / position 1
      const posOf = (name) => truth.indexOf(name) + 1;

      const candidateClues = [];
      for (let i = 0; i < n; i++) {
        const a = truth[i];
        candidateClues.push({ text: `${a} is in position ${i + 1}.`, weight: 3 });
        if (i < n - 1) candidateClues.push({ text: `${a} is immediately to the left of ${truth[i + 1]}.`, weight: 2 });
        if (i > 0) candidateClues.push({ text: `${a} is immediately to the right of ${truth[i - 1]}.`, weight: 2 });
        for (let j = 0; j < n; j++) {
          if (i < j) candidateClues.push({ text: `${a} is somewhere to the left of ${truth[j]}.`, weight: 1 });
        }
      }
      const shuffledClues = r.shuffle(candidateClues);

      function satisfiesAll(perm, clues) {
        const pos = {}; perm.forEach((nm, i) => { pos[nm] = i; });
        return clues.every((c) => c.test(pos));
      }
      // Compile clue text -> a test(pos) function by re-deriving structure from candidateClues generation
      function compile(clueObjs) {
        return clueObjs.map((c) => {
          const t = c.text;
          let m;
          if ((m = t.match(/^(.+) is in position (\d+)\.$/))) { const nm = m[1], p = +m[2] - 1; return { text: t, test: (pos) => pos[nm] === p }; }
          if ((m = t.match(/^(.+) is immediately to the left of (.+)\.$/))) { const a = m[1], b = m[2]; return { text: t, test: (pos) => pos[a] === pos[b] - 1 }; }
          if ((m = t.match(/^(.+) is immediately to the right of (.+)\.$/))) { const a = m[1], b = m[2]; return { text: t, test: (pos) => pos[a] === pos[b] + 1 }; }
          if ((m = t.match(/^(.+) is somewhere to the left of (.+)\.$/))) { const a = m[1], b = m[2]; return { text: t, test: (pos) => pos[a] < pos[b] }; }
          throw new Error('unrecognised clue: ' + t);
        });
      }

      function allPerms(arr) {
        if (arr.length <= 1) return [arr];
        const out = [];
        arr.forEach((v, i) => {
          const rest = arr.slice(0, i).concat(arr.slice(i + 1));
          allPerms(rest).forEach((p) => out.push([v].concat(p)));
        });
        return out;
      }
      const universe = allPerms(names);

      const chosen = [];
      let compiled = [];
      for (const c of shuffledClues) {
        chosen.push(c);
        compiled = compile(chosen);
        const survivors = universe.filter((perm) => satisfiesAll(perm, compiled));
        if (survivors.length === 1) break;
      }
      // Safety: guarantee uniqueness (always achievable since position clues alone determine it)
      let survivors = universe.filter((perm) => satisfiesAll(perm, compile(chosen)));
      while (survivors.length > 1) {
        const idx = truth.length - survivors.length; // arbitrary but deterministic-enough fallback, rarely hit
        const extra = { text: `${truth[0]} is in position 1.` };
        if (!chosen.some((c) => c.text === extra.text)) chosen.push(extra);
        survivors = universe.filter((perm) => satisfiesAll(perm, compile(chosen)));
        if (chosen.length > candidateClues.length) break; // guard
      }

      const askPos = r.int(1, n);
      const answer = truth[askPos - 1];
      return {
        prompt: `${chosen.map((c) => c.text).join(' ')} Based only on these clues, who is in position ${askPos}?`,
        answerType: 'mc', options: r.shuffle(names.slice()), correctAnswer: answer,
        hint: 'Start from any clue that fixes an exact position, then work outward using the relative clues.',
        approach: 'Constraint satisfaction: combine the clues until only one ordering of all ' + n + ' people is possible.',
        solution: `The only ordering consistent with every clue is: ${truth.map((nm, i) => (i + 1) + '.' + nm).join(', ')}. So position ${askPos} is ${answer}.`,
        recognitionTechnique: 'Other', commonTrap: 'Locking in an order after satisfying only some of the clues instead of checking all of them together.',
        tags: ['logic', 'ordering']
      };
    }
  });

  global.QTL_GEN_REASONING = G;
})(window);
