# Quant track bug hunt: logical contradictions & incorrect answers

Scope: quant track only (`js/lessons.js`, `js/bank.js`, `js/gen-prob.js`,
`js/gen-applied.js`). This is a **correctness** pass, distinct from the
prior quality/clarity audit (4 commits, already complete) — every fix
here changes a wrong answer or a self-contradiction, not wording.

## Bugs found and fixed (4, in commit order)

### 1. TT/HH expected-value contradiction (user-reported)
`lessons.js`, concept `c3` (first-step analysis / waiting times). Two
adjacent checks disagreed: one marked E[flips until TT]=4, the other
correctly stated overlapping patterns (same symbol repeated, like HH)
wait longer than non-overlapping ones (different symbols, like HT).
TT *is* an overlapping pattern (repeats T), so it cannot share HT's
value.

**Verification:** first-step analysis on a 2-state Markov chain (state
0 = no progress, state 1 = one T seen; a H from state 1 wipes all
progress) solves to E=6. Cross-checked with a 200k-trial Monte Carlo
simulation: E(TT)≈6.01, E(HH)≈6.00, E(HT)≈4.00.

**Fix:** corrected the answer index and rewrote the explanation to
parallel the (correct) HH/HT check instead of contradicting it.

### 2. E[max] arithmetic error in the order-statistics tail-sum check
`lessons.js`, concept `f1` (tail-sum formula for order statistics). A
check for 2 fair 4-sided dice stated the four tail probabilities
P(max≥1..4) as 1, 12/16, 7/16, 1/16 (summing to 36/16=2.25) and marked
that sum correct — directly contradicting an earlier check in the
*same* concept that correctly established P(max≥4)=7/16, not 1/16.

**Verification:** recomputed P(max≥k)=1−((k−1)/4)² directly for
k=1..4, getting 16/16, 15/16, 12/16, 7/16 (sum=50/16=3.125). Cross-
checked against a brute-force average over all 16 equally likely
(die1,die2) outcomes for two 4-sided dice: E[max]=3.125 exactly. The
original numbers were an off-by-one slip (each P(max≥k) shifted into
the k−1 slot) plus a mislabeled quantity (P(both dice=4)=1/16 used as
if it were P(max≥4)).

**Fix:** corrected the tail probabilities stated in the question,
the correct option (2.25→3.125), and the explanation.

### 3. Inverted bid/offer convention in two curated bank items
`bank.js`, items `h045` and `h050` (Market Making). Both claimed you
"sell at the offer" and "buy at the bid" — backwards from the
standard convention (bid = price you SELL at; offer/ask = price you
BUY at), which is taught *correctly* in `lessons.js`'s `mm1` concept
("Fair value €70, market 71 bid/73 offered... selling into that bid
captures 71−70=1 of edge; buying at 73 would mean paying more"). This
is a direct contradiction between curated practice content and the
theory it's supposed to reinforce.

It was worse than a labeling slip: in both items, fair value sat
*exactly* at the market's midpoint (h045: fair value 25, market
20/30; h050: fair value 35, market 30/40). Under the correct
convention, neither side has any edge in that configuration — the
same "market is wider than the edge" situation `mm1` already teaches
correctly elsewhere. The claimed "+5 edge on either side" answer only
existed because of the mislabeling.

**Fix:** adjusted each market quote to be genuinely asymmetric around
fair value (h045: 15 bid/20 offered; h050: 25 bid/30 offered) so that
buying at the correctly-identified offer produces a real €5 edge,
preserving the original `correctAnswer` (5) without needing to change
it. Rewrote both solutions to state the standard convention explicitly.

### 4. Same bid/offer bug in the `mm_spread` generator — much larger blast radius
`gen-applied.js`, generator `mm_spread`. Same root bug as #3, except
here it affects **every** question this generator has ever produced,
across every session and seed, not two fixed items. The market was
always constructed symmetrically around fair value (bid=fair−x,
ask=fair+x), meaning no side ever had genuine edge — yet
`correctAnswer` was hardcoded to `Sell at ${ask}` (an impossible
action; you cannot sell at the offer) with a fabricated edge.

**Verification:** rewrote the generator to randomly select one of
three genuine scenarios per call (buy-side edge, sell-side edge, or a
symmetric no-edge market), deriving bid/ask/correctAnswer consistently
from whichever was picked, always respecting buy-at-offer/sell-at-bid.
Validated with a 300-seed sweep that independently re-derives the
correct action from each generated prompt's own numbers and confirms
it matches `correctAnswer` (0 mismatches; roughly even 99/106/95 split
across the three scenarios).

## Methodology

For every check reviewed, correctness was established via at least one
of: manual first-step/Markov analysis written out explicitly, a Monte
Carlo simulation (200k trials) or brute-force enumeration in Node, or
direct recomputation of the stated formula from first principles —
never by trusting the existing code's internal consistency alone (the
f1 bug specifically would have passed an internal-consistency check,
since its wrong tail probabilities summed correctly to its wrong
answer; only independent recomputation caught it).

Systematic sweeps performed, beyond the two directly reported/found
bugs:
- Every check in `lessons.js` whose question stem embeds 3+ numeric
  givens (the vulnerable pattern behind bug #2) was independently
  recomputed — 16 such checks across units A, B, C, D, F, P, Q, S, all
  confirmed correct except the one fixed.
- Every check whose `why` field contains 2+ chained "=" steps was
  independently recomputed — an additional ~30 checks across units A,
  B, D, K, L, N, O, P, Q, all confirmed correct.
- All non-transitive dice claims (h071-h076, and the `dg1` lesson
  concept) verified by brute-force enumeration of all 36 face pairs.
- All brainteaser/invariant items (h065-h070, and the `bt1` lesson
  concept) re-derived from their own invariant argument (parity,
  colour-count, sum-minus-one, gcd) — all correct.
- The `mm1`/`mm2`/`mm3` (market making) and `n1`/`n2` (game theory) and
  `k1` (optimal stopping) and `m1` (information/impossibility) lesson
  concepts checked end-to-end against their own worked examples — all
  internally consistent except where `mm1` was used as the reference
  standard that caught bug #3.
- The pattern-waiting generator (`rw_pattern_wait`) spot-checked across
  15 distinct binary patterns via its own internal state machine
  against known values (HH=6, HT=4, HHH=14, HTH=THT=10, all 4-length
  non-fully-overlapping patterns=18) — all correct, not touched.
- Every previously-unaudited original bank.js item (h001-h002, h006-
  h009, h017-h019, h034-h037, h055-h060, h065-h088) independently
  recomputed or brute-force verified — all correct except the two
  fixed.

## Cases considered and deliberately left unchanged

- The `mm1` lesson concept's own examples and checks (bid/offer
  convention) were the *correct* reference used to catch bugs #3 and
  #4 — nothing there needed changing.
- `h046` (three-outcome arbitrage) uses "buy all three" language
  without bid/offer terminology; verified its arithmetic (0.40+0.35+
  0.30=1.05, 5-cent loss, sell side is the arbitrage) is correct and
  unrelated to the bid/offer bug family.
- The pre-existing structural-validator warnings (primer-length
  outliers in units A/E/F/G/J/K/L/N/P/Q, `d0`'s uneven 2/1/3 check-
  level split, a handful of pre-existing generators with display-
  precision-only mismatches: `p_seq_order`, `p_first_ace`, `d_normal`,
  `m_frac_dec`, `f_pe`) are unrelated to correctness — they are
  formatting/precision issues already documented as out-of-scope in
  `NIGHTLY_REPORT_QUANT_GAPS.md` from the original content build, and
  this task's brief is explicitly about logical contradictions and
  wrong answers, not formatting.
- No case surfaced where I was genuinely unsure and chose to leave it
  as-is — every flagged discrepancy either resolved to "confirmed
  correct" after independent recomputation, or was a genuine bug that
  got fixed.

## Validation performed on every fix

1. `node -e "require('./js/lessons.js'); require('./js/bank.js')"` —
   syntax/load check.
2. `options[a] !== undefined` and the corrected value present literally
   in the rewritten `why`/`solution` text.
3. `scratch_verify_bank_quant.js` — no duplicate ids, all mc options
   valid, across the full 88-item bank (unchanged count, confirming
   these were pure corrections, not additions/removals).
4. `scratch_verify_all_quant_gens.js` — full 100-generator, 100-seed
   sweep, plus (for the `mm_spread` fix) an additional dedicated
   300-seed sweep independently re-deriving the correct answer from
   each generated prompt's own numbers.
5. `scratch_e2e_quant.js` — full jsdom harness: Drill (all topics +
   per-topic), Mixed, Pattern recognition, Learn (all 306 checks
   clicked), Settings. Confirmed unchanged totals throughout: 100
   generators, 88 curated items, 16 lesson units, 306 Learn checks.

Committed individually after each fix (4 commits total, all pushed to
`claude/quant-test-lab-architecture-ssa7xf`), each with a message
explaining the specific bug, the verification method, and the fix.

## Status

All four confirmed bugs are fixed, verified, committed, and pushed.
This report is written with context still available, not because
context ran out mid-task — the systematic sweep described above is
complete for the quant track.
