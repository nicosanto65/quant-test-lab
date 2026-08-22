# UX Improvements Report 8

Two navigation/naming changes, unrelated to each other: restructuring how Learn is browsed,
and removing exam-brand naming from two Mock formats. All work is in `js/app.js`,
`js/store.js`, and `css/styles.css`. **Zero content files were touched** — verified via
`git diff --stat` against every `bank*.js`, `lessons*.js`, `gen-*.js`, and `formulas.js` file
on both commits, confirmed empty on each. Not one word of any concept's primer/core/when/
intuition/example/trap/check text changed, and no mock's underlying question pool, timing, or
skip mechanics changed — only navigation, presentation, and naming.

Status: **both changes complete, validated, committed separately (2 commits), and pushed.**

## Cambio 2 — Wincent/SIG mock rename (commit `6d7b7d8`)

The two Mocks formats named after specific employer assessments were renamed to describe
their actual mechanic instead:

| Old name | New name | Why |
|---|---|---|
| Wincent | **Extended Timed Mock** | 12 questions, 100 min total, difficulty 3-5, no hints, feedback withheld until submission — a long-form comprehensive test, not a speed format |
| SIG | **No-Skip Timed Mock** | configurable questions/minutes, hard no-skip-once-answered constraint — the defining trait is the lockout, not the duration |
| Mixed practice "Wincent level" | **Advanced — No Hints** | d3-5, no hints, curated hard-topic list |
| Mixed practice "SIG speed level" | **Speed Round** | 55s-per-question hard timer — genuinely a speed format, unlike the Mocks-view SIG |

Technical config is byte-for-byte unchanged (same `totalSeconds`, `noSkip`, `difficulties`,
`curatedShare`, topic pools). The internal identifiers store.js's readiness scoring keys off
— `testType` `'Wincent'`/`'SIG'` in `state.attempts`/`state.mocks`, and the
`settings.weights.wincent`/`.sig` object keys — are also unchanged, so nothing about scoring
or history matching broke.

**Historical-record decision:** a new `mockLabel()` helper in `js/app.js` centralizes the
name mapping, and every render site — Mocks buttons/headers, the mock-result page, mock
history list, Dashboard "Recent mock scores", Dashboard/Statistics readiness stats, the
Settings readiness-weights editor and SIG-minutes panel — goes through it. This means a mock
completed under the OLD name before this change now displays under the NEW name too, rather
than showing two different labels for the same format depending on when it was recorded.
Chose consistency-going-forward over preserving the literal old label, since the underlying
identifier never changed — only the display layer — so there's no ambiguity about which
records the new label refers to.

Two hardcoded coaching strings in `store.js`'s `recommendation()` that named "Wincent" in
prose were reworded to describe the action generically ("a timed mock") instead of the
condition/action logic itself changing.

## Cambio 1 — Learn navigation restructure (commit `182432d`)

Replaced the old "row of unit-letter buttons (A/B/C...) + every concept in the track stacked
as an accordion on one long page" layout with three focused screens:

1. **Topic menu** — one gradient-card per unit (icon-box + kicker + pill badge — the exact
   components the track picker and Mixed practice's mode cards already use), labeled by each
   unit's own existing `title` field from `lessons.js`. Only the label/presentation changed;
   the unit letters and underlying data are untouched.
2. **Concept dropdown** — tapping a topic card shows that unit's concepts (name + studied
   dot), tap one to open it.
3. **Concept page** — a dedicated view for exactly one concept, with the complete visual
   language already built in prior sessions (Start from zero / Core idea + Key formulas grid
   / When to use it / Intuition / worked examples / Common trap / Practice) carried over
   unchanged, plus a "← [topic]" back link and Previous/Next concept buttons at both the top
   and bottom of the page.

**Implementation choice:** a full page-to-page drill-down (menu → list → detail) rather than
an inline-expanding dropdown, specifically for mobile — no accordion reflow/scroll-jank to
manage on a small screen, and it matches the navigation shape every other view in the app
already uses (Mixed's mode-card grid, Pattern's config-then-run screens). Navigation state
lives inside `viewLearn` itself (`S.setLearnNav`/`getLearnNav`, mirroring the existing
`lastView` persistence pattern exactly) rather than being routed through the top-level
`go()`/`VIEWS` dispatcher — the same technique `viewPattern`/`viewPatternRun` already used to
switch between a config screen and a run screen inside one nav entry.

**Persistence:** per-track, so returning to Learn — or switching tracks and back — restores
the last open topic/concept independently for each track. A persisted sector/concept that no
longer resolves (stale data, or content that changed) falls back cleanly to the topic menu
instead of erroring.

**Studied-progress tracking** is completely unchanged — same `S.recordAttempt` call, same
`qid` format, same studied-set computation from `state.attempts`.

### Test-suite adaptation

Five existing E2E scratch scripts assumed the old "find and open an `.acc` accordion by
concept name" DOM shape. Their *substantive* checks — exact-text paragraph/primer
reconstruction, KaTeX formula rendering across all 6 tracks with 0 visible errors,
worked-example inline formulas, expand/collapse mechanics, viewport-width overflow — are
unaffected by the restructure and still valuable, so they were updated to reach concepts via
`S.setLearnNav(track, {sector, concept}); A.go('learn')` (the same mechanism the UI itself
uses) instead of searching for and clicking an accordion. `scratch_e2e_flow.js` additionally
needed its accordion-exclusive-open / sub-index checks rewritten as page-navigation checks
(Previous/Next moves to the correct concept in the real order; first concept's Previous and
last concept's Next are disabled; back-to-dropdown and back-to-menu links work) since those
specific old mechanics no longer exist by design — the underlying mechanics they *did* keep
testing (progressive worked-example reveal, the primer's own expand-group, section-jump
stepper) are all still exercised unchanged inside the new concept page.

A new `scratch_verify_learn_restructure.js` covers the new navigation end-to-end across 2
tracks (quant, ib): menu → dropdown → concept, all block types present, Core idea/When/
Intuition text character-for-character unchanged, Next/Previous in correct order, both back
links, answering a practice check records the attempt and marks it studied, and per-track
state persistence (including that switching tracks and back doesn't cross-contaminate each
track's own remembered position).

## Validation

- **(a)** `node -e "global.window=global; require('./js/app.js')"` — same documented
  pre-existing `ReferenceError: document is not defined` from the module's bottom-level
  `document.addEventListener('DOMContentLoaded', init)` call, unrelated to this session.
- **(b)/(c)** jsdom E2E across 2+ tracks (quant, ib) for the Learn restructure: menu →
  dropdown → concept navigation, Next/Previous respecting real concept order, studied-progress
  recording, back links, and state persistence across re-entering Learn and switching tracks
  — all pass (`scratch_verify_learn_restructure.js`). For the mock rename: Mocks view shows
  the new generic names with zero raw "Wincent"/"SIG" text anywhere in the UI (checked on
  Mocks, Dashboard, Statistics, Settings, Mixed practice), a mock recorded under the OLD
  internal type displays under the NEW label, and starting each renamed mock produces the
  exact same session config (question count / total time / no-skip behavior) as before
  (`scratch_verify_mock_rename.js`).
- **(d)** `git diff --stat` against every content file, empty on both commits.
- **(e)** Exact-text checks: Core idea / When to use it / Intuition paragraphs verified
  character-for-character identical to source in the new concept page
  (`scratch_verify_learn_restructure.js`); primer and worked-example paragraph splits
  re-verified via the updated `scratch_e2e_paragraphs.js` / `scratch_e2e_expand_multitrack.js`
  (character-for-character match, no mid-word breaks, across 6+ concepts on 2 tracks).
- **(f)** Playwright screenshots at 375px/768px/1440px of the topic menu, concept dropdown,
  and concept page: no horizontal overflow (`scratch_width_multiviewport.js`, adapted to
  target `.concept-page` instead of the retired `.acc-body`), KaTeX formula cards wrap and
  shrink cleanly on mobile, Previous/Next buttons stack vertically below 520px instead of
  squeezing narrow.

Full pre-existing E2E suite (formula rendering across 6 tracks, worked-example inline
formulas, concept-flow expand/collapse mechanics, cross-track exact-text reconstruction) was
re-run after each commit and stayed green, aside from one already-confirmed pre-existing,
unrelated failure (a track-switch generator-count restore check that fails identically on the
pre-Report-8 commit via `git stash` — not something either change touches).

## Files changed

- `js/app.js` — `viewLearn` split into `viewLearnMenu`/`viewLearnSector`/`viewLearnConcept`
  (replacing the old single accordion-stack function), new `mockLabel()` display-name helper
  applied at every Mocks/Dashboard/Statistics/Settings render site, Mixed practice's two
  exam-named mode keys renamed, `$$` hoisted to module scope.
- `js/store.js` — new `setLearnNav`/`getLearnNav` (mirrors the existing `lastView` pattern) +
  `learnNav: {}` default, two coaching strings in `recommendation()` reworded to drop the
  "Wincent" brand reference.
- `css/styles.css` — retired the dead `.learn-index`/`.learn-subindex` rules (no longer
  reachable now that the unit-letter row is gone), added `.learn-sector-grid` /
  `.sector-concept-row` / `.concept-page-head` / `.concept-page-nav` for the three new Learn
  screens.
