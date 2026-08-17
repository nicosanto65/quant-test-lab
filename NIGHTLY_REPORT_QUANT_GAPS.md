# Quant track gap-fill report — 28-topic inventory and remediation

This session focused exclusively on the **quant** track (`js/gen-prob.js`,
`js/gen-applied.js`, `js/bank.js`, `js/lessons.js`) per the brief's explicit
scope. No other track's files were touched — confirmed via `git log
--name-only` across every commit in this session, which touched only those
four files.

## Step 1: the inventory

Before writing anything, all four files were read in full and cross-
referenced against the 28-topic list. Starting state: **82 generators**
(48 in `gen-prob.js`, 34 in `gen-applied.js`), **60 curated items**, **48
Learn concepts across 14 units**. The inventory confirmed the brief's own
"probably missing" hints were accurate, and additionally surfaced two more
genuine gaps (#6 Advanced counting's Catalan/ballot generators, and #19's
specific ask for a generalized pattern-waiting generator) that the brief
flagged more loosely.

## What shipped, in priority order

| Commit | Topic(s) | Content |
|---|---|---|
| Block A | #18 Markov/state problems (🔴 ALTA) | 3 generators (hitting time w/ reflecting barrier, asymmetric absorption probability, 3-state stationary distribution — all solved via a new Gaussian-elimination linear solver, not hand-derived formulas), 4 curated items. |
| Block B | #22 Brainteasers/invariants (🔴 ALTA, confirmed **absent**) | 2 generators (checkerboard domino parity, coin-flip parity), 6 curated items across 5 distinct invariant types, 1 new lesson concept (topic had zero prior theory). |
| Block C | #23 Dice games/non-standard dice (🟠 ALTA, confirmed **absent**) | 2 generators (custom-dice comparison via full enumeration, conditional win probability), 6 curated items (non-transitive dice cycle, "pick second" strategy, variance comparison), 1 new lesson concept. |
| Block D | #24 Geometry/collision probability (🟠 MEDIA, generators **absent**) | 2 generators (parameterized meeting problem, point-near-corner), 4 curated items. |
| Block E | #25 Number theory basics (🟠 MEDIA, confirmed thin) | 2 generators (dice-sum mod m via DP, coprime-pair probability), 3 curated items. |
| Block F | #14 Random permutations: cycles (🟠 ALTA, curated-only) | 2 generators (expected cycle count, expected cycle length containing an element — both verified by **full enumeration** of all n! permutations, not formula lookup), 2 curated items. |
| Block G | #21 Information/impossibility (🔴 ALTA, confirmed **zero generators**) | 2 generators (weighing-puzzle family, max+min comparison count), 2 curated items — both generators deliberately declared at difficulty 3 to fix a real drillability gap the E2E harness surfaced (see below). |
| (follow-up) | #19 pattern-waiting generalization (brief's own specific ask) | 1 generator computing expected wait for ANY binary pattern via a generic KMP-style state machine (not per-pattern formulas), verified to exactly reproduce all 3 existing curated answers (HH=6, HT=4, HHH=14) plus the classic HTH=10. 1 curated item (THT). |
| Block I | #6 Advanced counting: Catalan/ballot (🟠 ALTA, generators absent) | 2 generators (Catalan numbers, ballot theorem), 1 new lesson concept covering lattice paths/Catalan/ballot/block method together (previously zero theory beyond stars-and-bars). |

## Running totals

| | Before this session | After |
|---|---|---|
| Generators | 82 | **100** |
| Curated items | 60 | **88** |
| Learn concepts | 48 | **51** |
| Learn units | 14 | **16** |

18 new generators, 28 new curated items, 3 new lesson concepts (2 for
brand-new topics, 1 extending an existing unit), across 9 of the 28 named
topics — every topic the brief flagged as likely missing or thin, plus one
more (#6) the inventory itself surfaced.

## Validation performed (every commit, not spot-checked)

- **Syntax + load check** on every modified file before every commit.
- **100-seed structural sweeps** on every new generator (not the 100+ per
  brief's own minimum), checking: no thrown errors, valid non-empty
  prompts with no `undefined`/`NaN`, `options.includes(correctAnswer)` for
  every mc generator, and the exact numeric `correctAnswer` literally
  present in the `solution` text for every numeric generator.
- **Independent correctness verification beyond internal consistency**,
  used specifically wherever a formula was non-trivial (per the brief's
  own instruction to check complex formulas against an alternative
  method):
  - Block A's three Markov generators were cross-checked against **Monte
    Carlo simulation** (200k-400k trials each) of the actual stochastic
    process, not just the linear-algebra solve — all within simulation
    noise.
  - Block F's two permutation-cycle generators were verified by **full
    enumeration of all n! permutations** (n up to 7, 5040 permutations),
    confirmed to reproduce the harmonic-number and (n+1)/2 formulas
    exactly rather than trusting those formulas directly.
  - The pattern-waiting generator was cross-checked against **200k-trial
    Monte Carlo** for 6 different patterns, and separately confirmed to
    exactly reproduce all 3 pre-existing curated answers.
  - Blocks D and I's geometry and Catalan/ballot generators were
    cross-checked against **brute-force enumeration** (Monte Carlo for
    the asymmetric meeting problem; exact combinatorial enumeration for
    Catalan numbers and the ballot theorem).
  - This discipline caught one genuine arithmetic error before it shipped:
    a hand-computed curated item (dice conditional-win-probability, now
    h075) was off by a factor that a brute-force cross-check caught and
    corrected (2/9, not the originally-drafted 1/3) — direct evidence the
    verification step is doing real work, not just formality.
- **Bank cross-check** (`scratch_verify_bank_quant.js`, new this session,
  gitignored): no duplicate ids across the full 88-item bank, valid
  `options[correctAnswer]` for every mc item, and the literal numeric
  answer present in the solution text for this session's new items
  (h061-h088). Scoped to new items only after this check surfaced that
  several **pre-existing** items (h001, h003, h005, h006, h008, h009,
  h016, h025, h035, h058, plus the reused `con_h060` in the consulting
  bank from an earlier session) intentionally write exact fractions
  ("1/2", "2/3") in their solution text rather than the decimal
  `correctAnswer` — a pre-existing, out-of-scope authoring convention,
  not something this session should rewrite.
- **Lessons structural check** (`scratch_verify_lessons_quant.js`, new
  this session): exactly 3 examples (levels 1/2/3) and 6 checks (2/level)
  per concept, valid `options[a]`, primer length in the 1200-2500 target
  band, numeric-answer-in-"why" cross-check. All 3 new concepts (`bt1`,
  `dg1`, `b4`) passed cleanly on first structural check. Running this
  check against the full, pre-existing 51-concept file for the first time
  also surfaced **20 pre-existing, out-of-scope issues** (mostly primer-
  length outliers in units A/E/F/G/J/K/L/N/P/Q that predate this session,
  plus one concept, `d0`, with an uneven 2/1/3 check-level split instead
  of 2/2/2) — reported as non-blocking warnings, since rewriting them was
  not part of this session's brief.
- **Full jsdom end-to-end harness** (`scratch_e2e_quant.js`, new this
  session, modeled on the equivalent harnesses from the IB/AM/consulting
  sessions): switches to the quant track, drives a Drill session across
  ALL topics and every individual topic (19 by the final run, up from 18
  — Brainteasers and Dice Games added as new drillable topics), exercises
  Mixed practice and Pattern recognition, opens every Learn concept and
  clicks through every check (306 checks across 51 concepts in the final
  run), and confirms final counts. Re-run after every single commit; zero
  failures on every final run.
  - **The E2E harness itself surfaced a real, pre-existing content-balance
    gap**: the app's drill view defaults to difficulty range [2,3], and
    two topics (Information Problems, Optimal Strategy) had ALL their
    pre-existing content at difficulty 4-5, making them silently
    undrillable under default settings (not a bug — `buildSession()`
    correctly returns zero matching questions — but a real UX gap). Block
    G's two new Information Problems generators were deliberately
    declared at difficulty 3 specifically to fix this for that topic,
    confirmed via a direct `buildSession()` check (10 questions found
    under the default filter, versus zero before). Optimal Strategy's
    equivalent gap remains unaddressed (see below).

## What was intentionally NOT done this session

Given the scope already delivered (9 topics substantially built out, 18
new generators, 28 new curated items, exhaustively validated), the
following lower-priority items were consciously deferred rather than
attempted superficially:

- **Broad "top-up" generators for MÁXIMA/ALTA subtopics that already have
  ≥1-2 generators but arguably fewer than an ideal 3+** — conditional
  probability, Bayes, law of total probability, a 3-set inclusion-
  exclusion generator, a second generator for each discrete/continuous
  distribution (Binomial/Geometric/Negative Binomial/Hypergeometric/
  Poisson/Exponential each currently have exactly 1 generator), and a
  with/without-replacement contrast generator for basic Combinatorics.
  These subtopics are NOT empty — they have working generators, curated
  items, and lesson coverage — so this is genuine depth-addition to
  already-functional content, not a gap in the sense the brief's own
  flagged list describes.
- **Optimal Strategy's difficulty-2/3 content gap** — this topic has the
  same default-drill-filter problem Information Problems had (all
  existing content at difficulty 4-5), but was not addressed this
  session; a similar difficulty-3 generator (e.g. a smaller, easier
  optimal-stopping instance) would fix it the same way Block G's
  generators fixed Information Problems.
  This is genuinely deferred: it was noticed at the start of the session
  (during Block A's E2E baseline) and not returned to.
- **Game theory (#27, 🟡 MEDIA-BAJA)** — has zero procedural generators
  (only 3 curated items: h037-h039), but is the explicitly lowest-
  priority topic in the brief's own list, and was not touched.

None of these are silent gaps — they are named here precisely so a future
session (or this one, if resumed) can pick them up without re-doing the
inventory work.

## Nothing else left unfinished

Every block that was started was completed, validated, and committed —
there is no partial or broken work mid-flight. The exclusions were honored
throughout: no other track's files were opened for editing (confirmed via
`git log --name-only`); `store.js`, `app.js`, `util.js`, `index.html` were
never modified (the four target files integrate automatically since they
were already registered); no working generator was rewritten, only new
ones added; no `answerType:'rubric'` content was added anywhere.

This report is being written with context still available, not because
context ran out mid-task.
