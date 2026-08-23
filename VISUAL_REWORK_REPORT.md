# Visual Rework Report

A full visual rework of the app's design system and its four highest-impact surfaces
(Dashboard, answer feedback, progress/counters, locked content), following the honest
pre-work audit in `VISUAL_REWORK_AUDIT.md`. All work is in `js/app.js`, `css/styles.css`,
and `js/store.js`. **Zero content files were touched** — verified via `git diff --stat`
against every `bank*.js`, `lessons*.js`, `gen-*.js`, and `formulas.js` file before each
commit, confirmed empty every time. Not one word of any question, concept, formula, or its
mathematical meaning changed — only how the app looks, moves, and responds.

Status: **all 4 blocks complete, validated, committed separately (4 commits after the
audit), and pushed.**

## Scope decision: extend the design system, don't rewrite it

`VISUAL_REWORK_AUDIT.md` documents the full reasoning. In short: the existing
gradient-card/icon-box/pill-badge/kicker component language (built across Reports 5-8)
already works well and is used consistently in several places. A from-scratch CSS rewrite
of a 1244-line, 318-rule stylesheet would have re-introduced regression risk across every
view for no visual ceiling gain over disciplined extension. The brief explicitly authorized
either path ("reescribe desde cero si hace falta") — for a system this size and this
functional, extension *is* the better result.

## Audit (commit `58f40f9`)

Documented, with real screenshots reviewed at 1440px, where the app still read as a
document: Drill's native-`<select>` config form, Settings' flat ~20-input list, Mocks' four
visually-identical format cards, Learn's 16 topic cards sharing one icon, and a Dashboard
whose real hero (a plain onboarding pill row) was upstaged by a better-designed section
lower on the same page. Also documented what already worked and had to survive the rework
unregressed: KaTeX rendering, Learn's restructured navigation, the existing component
language.

## Bloque 1 — design system foundation (commit `e11db73`)

Extended rather than replaced the token system:
- **Palette**: `--info` was previously just `var(--brand)` (no real fifth accent); given a
  genuine distinct sky-cyan. Added the missing `--neg-line` so every semantic colour has the
  same `-soft`/`-line`/`-ink` structure.
- **Typography**: added `--fs-2xl` and `--fs-hero` (clamp()-based) above the previous 26px
  ceiling, for Dashboard's hero and strong section titles. Every existing `--fs-xl` call
  site is unchanged.
- **Motion**: `--dur` was a single 180ms value for every transition regardless of size;
  added `--dur-fast`/`--dur-slow`/`--ease-out` for large movements to use a deliberately
  different pace than a button hover.
- **Elevation**: added `--shadow-md`/`--shadow-lg` alongside the existing (barely-used)
  `--shadow-sm`/`--shadow`. Applied real elevation + hover-lift to `.panel` and
  `.gradient-card` — cards now visibly float and lift on hover instead of sitting flush
  with the page background.
- **Gradients**: `.gradient-card` gained 6 more `.tone-*` modifiers (success/danger/teal/
  info/warn/track-wm/track-consulting) so any card reaches its colour via one class instead
  of JS hand-building a `--gc-tint`/`--gc-line` string per call site.
- **Forms**: native `<select>` elements previously fell back to the raw OS dropdown chevron
  — the clearest single "unstyled form" tell in the audit. Restyled with `appearance:none`
  and a themed SVG chevron.

## Bloque 3 — Dashboard as flagship (commit `3fc5c56`)

- First-run onboarding's track picker — very plausibly the first thing a brand-new visitor
  or evaluator ever sees — now uses the same large gradient-card + icon-box treatment as
  "Progress by track," instead of a flat text chip list.
- Hero headings promoted from 18px to the new `--fs-2xl`.
- Every track card always renders its progress ring now (previously blank for
  not-started tracks), and rings animate from 0 to their real value on mount.
- Fixed the Consistency heatmap's near-invisible empty cells (flagged in the audit as
  looking like a rendering bug) — real, visible, hoverable cells now.
- Every view swap gets a quiet fade-in + slide-up on `#main`.

## Bloque 2 — interactivity (commit `8a9eac5`)

- **Answer feedback**: `.opt.right`/`.opt.wrong` now play a short entrance animation that
  holds at the same brand-blue `.opt.sel` state for its first ~45% before easing into the
  real accent/neg verdict colour — a reader sees "this is what I picked" before the colour
  resolves. Documented mid-course correction: a first attempt used a real
  `setTimeout()`-based delay in `submitAnswer`'s call site, which broke every session-driving
  E2E script across all 6 tracks (they click an option and immediately check for the "Next
  question" button, a reasonable assumption given the app's fully-synchronous render
  architecture). Reverted in favour of the animation-only approach above, which needed zero
  test changes since the underlying DOM/class state is still set in the same synchronous
  tick as before — only the *paint* is staggered.
- Dashboard's headline stat tiles (Accuracy/Completed/Avg time/Best run, the 3 readiness
  scores) count up from 0 over ~650ms on mount.
- Hover/active states and transitions on `.btn`/`.opt`/`.chip`/`.gradient-card`/`select`
  already existed or were completed in Bloque 1.

## Bloque 4 — locked/premium content component (commit `e981488`)

Purely visual, per the brief — no entitlement or auth logic:
- `.locked-card`/`.locked-overlay` (CSS): blurs/dims real card content underneath a
  centred lock icon, "Premium" pill badge, and Unlock CTA, in the achievement-gold accent.
- `lockedOverlay(opts)` + `wireLockedCtas(scope)` (JS): a small reusable helper pair; the
  Unlock button is wired to a no-op toast ("Premium unlocking isn't connected yet — coming
  soon."), exactly the placeholder the brief specifies.
- Demonstrated with one live, clearly-additive example: a 7th "More tracks — Premium" card
  in Dashboard's track grid. None of the 6 real tracks are restricted by this or anything
  else added this session.

## Validation

- **(a)** `node -e "global.window=global; require('./js/app.js')"` — same documented
  pre-existing `ReferenceError: document is not defined`, unrelated to this session,
  confirmed after every commit.
- **(b)** Full E2E suite re-run after every commit: all 6 track-specific scripts (quant/ib/
  am/wm/reasoning/consulting — Drill sessions across every topic, Mixed practice, Pattern
  recognition, Learn, Mocks, Settings), plus the dedicated Learn-restructure, mock-rename,
  concept-flow, formula-rendering, worked-example, and paragraph-split scripts. All green
  except two categories of failure confirmed via `git stash` to be **pre-existing and
  unrelated to this session**: (1) a track-switch generator-count restore check that fails
  identically on the pre-Visual-Rework commit, documented in every report since Report 6;
  (2) five of the six track scripts (all but quant) still query the pre-Report-8 accordion
  DOM shape (`details.acc`) for their Learn assertions and silently find 0 — a testing gap
  left over from Report 8's Learn restructure, not something this session touched or
  introduced. Learn's real navigation is already covered by the dedicated, passing
  `scratch_verify_learn_restructure.js`. Flagged here rather than silently fixed, since
  updating 5 files' worth of Learn assertions is outside a "visual rework" task's charter.
- **(c)** `git diff --stat` against every content file, empty on all 4 commits.
- **(d)** Exact-text checks (`scratch_verify_learn_restructure.js`,
  `scratch_e2e_paragraphs.js`, `scratch_e2e_expand_multitrack.js`): Core idea/When to use
  it/Intuition and primer/worked-example paragraphs verified character-for-character
  identical to source across multiple concepts and tracks, unaffected by any styling change.
- **(e)** Screenshotted at 375px/768px/1440px/1920px across Dashboard, Learn, Drill, Mocks,
  Mixed, and Settings (`scratch_visual_final_check.js`): zero overflow beyond the same
  pre-existing ~3px topbar quirk documented across multiple prior reports (confirmed via
  `git stash` to predate every commit in this session, appears identically at every view and
  viewport, not something this rework introduced or could fix without touching the topbar
  itself). 1920px layout holds up cleanly — content stays comfortably contained rather than
  stretching awkwardly edge-to-edge.
- **(f)** Performance: every new animation targets only `transform`/`opacity`/`border-color`/
  `background` (compositor- or paint-only properties, never `width`/`height`/layout-
  triggering properties), matching the pattern the app's existing animations already used.
  The one `filter: blur()` (the locked-card backdrop) is a static filter on one small card,
  not an animated/per-frame cost. Confirmed via Playwright with `reducedMotion: 'reduce'`
  that the existing global `@media (prefers-reduced-motion: reduce)` rule (unchanged this
  session) correctly disables every animation added in this rework —
  `document.getAnimations()` reports 0 active animations under that setting.

## Files changed

- `css/styles.css` — extended palette/typography/motion/elevation tokens; `.gradient-card`
  hover-lift + 6 new tone modifiers; restyled `<select>`; heatmap contrast fix; hero heading
  size; view-swap entrance animation; two-stage answer-reveal animation; `.locked-card`/
  `.locked-overlay` component.
- `js/app.js` — Dashboard hero/onboarding/progress-grid rework; `ring()` animate-from-0 +
  `activateRings()`; `animateCounters()`; `lockedOverlay()`/`wireLockedCtas()`; both wired
  into `render()`.
- No changes to `js/store.js` in this session (all Bloque work was pure UI/CSS/render-layer).
