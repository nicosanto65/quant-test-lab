# Nightly build report — track architecture + 5 new tracks

All five tracks requested were completed and pushed as five incremental,
independently-validated commits on `claude/quant-test-lab-architecture-ssa7xf`.
Nothing was left mid-track; the order of priority in the brief (architecture →
reasoning → IB → WM → AM → consulting) was followed exactly, and each commit's
message documents its own validation in detail. This file is the higher-level
summary: what shipped, where content volume fell short of the brief's targets,
design decisions worth a second look, and open questions.

## What shipped

| Commit | Content |
|---|---|
| `118cff1` | Track architecture: `S.state.settings.track`, per-track filtering in `store.js` (`allGenerators`/`curated`/`allLessonUnits`/`topics`/`subtopics`), topbar track selector in `app.js` |
| `dbbd62d` | Reasoning track: 19 generators, 60 curated verbal items, 8 Learn concepts, Speed Sprint mock mode |
| `56627de` | IB track: 14 generators, 40 curated items, 7 Learn concepts |
| `587c116` | WM track: 35 curated items, 7 Learn concepts (no generators — see below) |
| `617ec4c` | AM track: 10 generators, 20 curated items, 4 Learn concepts (quantifiable-only, per the explicit exclusion) |
| `ecb4e15` | Consulting track: filled the Data Interpretation / Constraint Optimisation / Structured Decisions theory gap first, then added 12 generators and 17 curated items for market sizing, profitability trees, and more exhibit reading |

Running totals across the whole app after all five tracks: **137 generators**,
**232 curated items**, **33 Learn units / 80 Learn concepts** (up from 82
generators / 60 curated / 14 units / roughly 40-something concepts before
tonight). The pre-existing quant track is byte-for-byte unchanged in its own
question/lesson content — confirmed after every single commit by a scripted
jsdom check that re-asserts 82 generators / 60 curated on the quant track and
drives every view without a thrown error.

## Validation performed (every commit, not just spot-checked)

- Syntax-loaded every new file with its real dependency chain (`node -e
  "global.window=global; require(...)"`), matching the brief's own example
  command for `lessons.js`.
- 80-seed sweeps on every generator (reasoning, IB, AM, consulting — WM has
  none) checking for thrown errors, malformed answers, and — critically — that
  the numeric answer literally appears in its own worked solution text. That
  last check is a real bug-finder, not busywork: it caught and fixed **three
  genuine arithmetic mistakes** before they shipped (`ib_b018`'s share price,
  `am_c005`'s alpha-difference figure, `am_c002`'s alpha figure — all cases
  where I'd typed the wrong final number after writing a correct derivation).
  It also caught one item where the *derivation itself* was wrong
  (`con_b011`'s weighted-average rating, 3.2 vs. the correct 3.3).
- For the two logic-heavy reasoning generators, correctness wasn't just
  asserted — it was proven: all 13 categorical-syllogism forms and all 4
  conditional-reasoning forms were checked against an exhaustive finite-model
  search (all 256 populated/empty Venn-region combinations for syllogisms, all
  4 boolean truth-table rows for conditionals), not just my own Venn-diagram
  reasoning. The constraint-satisfaction ordering-puzzle generator was
  independently re-solved by brute force across 300 seeds to confirm every
  generated puzzle has a genuinely unique solution.
- `ib_accretion_dilution` and `ib_lbo_returns` (the two most arithmetically
  involved IB generators) were cross-checked against an independently-written
  recomputation (regex-parsed from the rendered prompt, recalculated from
  scratch) across 200 seeds each.
- Every curated bank item checked for: all required fields present,
  `options[correctAnswer]` actually present for mc items, no duplicate ids
  across the now-232-item bank.
- A full jsdom end-to-end harness per track: switches to the track, clicks
  "Start drill" for the whole track and then for every individual topic,
  drives each session to completion by answering every question via real DOM
  clicks (mc buttons or the numeric input + submit button), and does the same
  for Mixed practice, Pattern recognition, and — for reasoning — Speed Sprint.
  It also opens every Learn `<details>` and clicks through every check. This
  is the harness that satisfies checklist items 3d/3e from the brief; it
  lives in `scratch_*.js` files that are gitignored (they're dev-time
  harnesses, not part of the shipped app) — happy to check them into a
  `test/` directory in a follow-up if you'd like them kept in the repo
  permanently rather than regenerated ad hoc.

I did not have a real browser available in this environment, so "click
through the UI" was done via jsdom + synthetic DOM events, not a visual
screenshot pass. The logic exercised is identical to what a real browser
would run (same event handlers, same DOM), but I haven't visually confirmed
layout/CSS in an actual window.

## Where content volume fell short of the brief's targets

The brief gave explicit or implicit volume targets in a few places; here's
where I landed short, and why:

- **WM curated bank: 35 items, not ~40.** Close, but under. No generators for
  this track — everything here (suitability judgment, tax-location
  heuristics, liquidity matching) is inherently qualitative, which is also
  what the brief's own framing for this track implies. Fastest way to close
  the gap: 5 more items, probably 2 more on Suitability and 3 more on Tax &
  Liquidity, since those two subtopics have the least depth relative to Asset
  Allocation and Alternatives.
- **AM curated bank: 20 items.** The brief didn't give AM an explicit target
  count the way it did for IB (~60) and WM (~40), but 20 is noticeably
  thinner than the other paid tracks. This was a deliberate time-budget
  choice late in the session — AM's scope is already narrower by design (no
  stock pitches), and I prioritized getting Factor Exposure, Fixed Income,
  and Macro each represented with real depth over padding item count.
- **IB curated bank: 40 items, not ~60.** Reasonable coverage across all six
  IB topics, but if you want the full ~60 the brief mentioned, Comps &
  Precedents and LBO are the two subtopics with the most room to grow (5 and
  8 items respectively right now).
- **Consulting curated bank: 17 items** (2 reused + 15 new). No explicit
  target was given for this track, but 17 is light relative to the other
  tracks. Market Sizing and Profitability Trees each only have 4 curated
  items backing their 2 generators each; that's the thinnest spot.

None of this is a correctness problem — everything present is validated to
the same standard as the reasoning track. It's purely a volume gap, and it's
concentrated in specific, nameable subtopics rather than spread evenly, so
it should be quick to close in a follow-up session working from this list.

## Design decisions worth a second look

1. **Consulting track reuses quant-track content via wrapper objects, not by
   retagging or duplicating it.** The brief said to reuse the existing Data
   Interpretation / Constraint Optimisation / Structured Decisions questions
   without duplicating them, and to add `track:'consulting'`. Doing that
   literally — adding a `track` property directly onto the existing objects
   in `gen-applied.js`/`bank.js` — would have *removed* those items from the
   quant track's pool (since a single object can only carry one `track`
   value), which would have silently broken the quant track's own
   McKinsey-prep mock and shrunk its generator/curated counts. Instead,
   `gen-consulting.js` and `bank-consulting.js` create new registry entries
   with new ids (`con_k_table_share`, `con_h059`, etc.) that reuse the exact
   same `build()` function / prompt / solution *by reference*, under
   `track:'consulting'`. No prose was duplicated, and the original
   quant-tagged entries are completely untouched — but there are now two
   registry entries pointing at the same underlying question content, one per
   track. I think this is the right call given the constraint ("don't break
   quant" + "don't duplicate content" are in tension unless something like
   this is done), but it's a deliberate architectural choice you should be
   aware of, not something implied unambiguously by the instructions.
2. **Mocks view (Wincent / SIG / IMC / McKinsey prep / Speed Sprint) is
   gated per-track rather than track-agnostic.** Wincent/SIG/IMC/McKinsey
   only render when `S.activeTrack() === 'quant'`; Speed Sprint only renders
   for `'reasoning'`. IB/WM/AM/consulting currently show only the mock
   history panel with no track-specific mock mode of their own. This wasn't
   explicitly requested for the new tracks, but it seemed better than either
   (a) leaving the quant-specific buttons visible and silently broken on
   other tracks (they'd build empty sessions — I found and fixed this exact
   latent bug while validating), or (b) building bespoke IB/WM/AM/consulting
   mock formats without being asked to. A natural follow-up: IB and
   consulting in particular would support a "case-style" timed mock fairly
   easily, reusing the same `perQuestion`/`noSkip` mechanism Speed Sprint
   uses.
3. **`store.js`'s `GEN_SOURCES` initially omitted `QTL_GEN_CONSULTING`.** I
   added `QTL_LESSONS_CONSULTING` to the lesson-source registry in the very
   first architecture commit (anticipating this track), but forgot the
   matching generator-source entry until I actually built
   `gen-consulting.js`. Caught immediately by the smoke test (consulting
   showed 0 generators until the array was registered) and fixed in the same
   commit — flagging it here only because it's the kind of easy-to-miss
   parallel-registration gap that could recur if a sixth track is added
   later; the fix is a one-line addition to `GEN_SOURCES` in `store.js`.
4. **Speed Sprint pulls questions from *all* reasoning-track topics
   (numerical + abstract + logical + verbal) at once**, rather than letting
   the user pick a subset. This matches "Speed Sprint" being a single mock
   mode in the brief rather than four, but if the intent was closer to four
   separate speed-drill flavors, that's a quick parameterization of the
   existing `buildSession({topics: [...]})` call in `viewMocks`.

## Ambiguities I resolved by judgment call — worth confirming

- **Whether AM should have any generators at all.** The brief listed AM's
  scope (factor exposure, quant portfolio construction, fixed income basics,
  macro) without saying explicitly whether it should follow the
  generator+bank pattern of reasoning/IB or the bank-only pattern of WM. I
  judged that duration/convexity/factor-attribution/Fisher-equation math is
  exact-arithmetic in the same way IB's WACC/DCF math is, so I built 10
  generators for it. If the intent was for AM to be curated-only like WM,
  that's a scope reduction rather than an addition, so nothing needs
  rebuilding — just note that AM currently behaves more like a smaller IB
  than like WM.
- **How literally to take "no toques el contenido del track quant existente"
  for the consulting track.** Covered under design decision #1 above — I
  interpreted "don't touch existing quant content" as meaning the original
  files/objects must be byte-identical after the change (verified: `git diff`
  on `gen-applied.js` and `bank.js` across the whole session is empty), which
  is a stronger reading than just "don't break it," and drove the
  wrapper-object approach.
- **Exact wording/scope of "Speed Sprint" mechanics.** The brief said 12-20s
  per question, no hints, reusing `perQuestion`+`noSkip` — I additionally
  made it `deferFeedback:true` (no per-question feedback, only a report at
  the end) to match how SIG mock behaves, since a true no-hints speed format
  showing full solutions after every single 15-second question felt
  inconsistent with the "speed test" framing. This is a judgment call, not
  something the brief specified either way.

## Nothing left unfinished

Every one of the five requested tracks (reasoning → IB → WM → AM →
consulting, in the brief's own priority order) is built, wired into
`index.html`, and validated. There's no track that was started and abandoned
mid-way. The gaps documented above are volume/depth gaps within already-
shipped, already-correct tracks, not missing tracks or broken functionality.
