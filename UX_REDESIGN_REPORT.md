# UX redesign report

Product-design pass to move the app from a personal terminal-styled
tool toward a shareable, professional product, per the brief. This
report covers what shipped, the design decisions behind it, and what
was deliberately left for a future pass.

No content file was touched at any point (`bank*.js`, `lessons*.js`,
`gen-*.js`, `formulas.js`) — verified via `git diff --stat` before
every commit in this sequence. Changed files: `css/styles.css`,
`index.html`, `js/app.js`, `js/store.js`.

## What shipped

### 1. Color system (`css/styles.css`)
A documented palette as CSS custom properties, replacing the previous
ad-hoc terminal color set:
- **Navy/steel-blue (`--brand`)** for structure: borders, headers,
  active/selected states, brand identity, focus rings. Never used as
  a large fill.
- **Warm gold (`--accent`)**, reserved exclusively for primary CTAs,
  correct-answer feedback (the `verdict.ok` / `opt.right` states,
  matching the brief's explicit rule), and progress/achievement
  indicators (progress bars, streak flame, milestone banners, track
  progress rings). Nothing else uses it, so it keeps its signal value.
- Muted, separately-toned red/green kept for **data semantics** (bar
  charts, accuracy deltas) — distinct from the achievement gold, so a
  "your accuracy in Fixed Income is 80%, colored green" data point
  doesn't visually compete with "you just answered correctly, colored
  gold."
- Light mode background is `#FAFAF8` (warm off-white, not pure
  white). Dark mode kept the same structural depth (`--bg`/`--panel`/
  `--panel-2`/`--panel-3`) so neither mode reads as unfinished
  relative to the other — confirmed visually via Playwright
  screenshots at both 375px and 1440px, both themes (see below).
- A 4/8/12/16/24/32/48px spacing scale and a 5-size type scale
  (`--fs-xs` through `--fs-xl`), applied throughout instead of the
  previous dozen-plus ad hoc pixel values.
- `--radius`/`--radius-lg`/`--radius-pill` for consistent rounded
  corners across cards, chips, and sheets.

### 2. UX_AUDIT.md
Documents the pre-redesign flow in detail: no onboarding, track
switching that discarded all context and always dumped the user on
the Dashboard, unscoped-by-track analytics (attempts were never
tagged with which track they belonged to), a "streak" stat that
actually meant consecutive-correct-answers rather than days-used, a
51-concept Learn page with zero wayfinding, session completion with
no designed moment outside of mock reports, and a 10-button flat
mobile tab strip. Every item there is addressed below.

### 3. Navigation (`js/app.js`, `index.html`)
- **Track switcher**: the native `<select>` is now a track pill
  (icon + label) in the topbar that opens a bottom sheet of track
  cards — each showing an accuracy ring and question count, so
  progress in every track is visible *before* switching. Switching
  restores that track's last-open view (new `state.lastView` map in
  `store.js`, additive) instead of always resetting to the Dashboard.
- **Main nav**: mobile tab bar reduced from 10 flat text buttons to 4
  primary icons (Dash/Learn/Drill/Mocks) + a "More" button opening a
  grouped sheet (Practice: Pattern, Mixed · Review: Errors, Sheet,
  Stats · App: Settings). Desktop sidenav keeps all 10 destinations,
  now grouped under the same headers with icons and (restored,
  right-aligned) keyboard-shortcut hints.
- **Icon set**: one small hand-authored monoline SVG per nav view and
  per track, inlined in `app.js` (no new asset files, so the service
  worker's cache list didn't need changes).

### 4. Dashboard as home base
- One-tap hero CTA ("Continue training" / "Start first session" for
  true first-timers), styled as the visually dominant element.
- A day-based usage streak (new `store.js` `dayStreak()`, distinct
  from the pre-existing "consecutive correct answers" stat) with a
  GitHub-style contribution heatmap (`contributionDays()`) — muted
  navy/gold intensity scale, no gamified iconography.
- A "Progress by track" row: every track's accuracy ring and question
  count at a glance, tap any card to switch.
- All topic/difficulty/weakest/strongest breakdowns are now scoped to
  the active track (`byKey`/`weakestTopics`/`strongestTopics` gained
  an optional `track` parameter, defaulting to the old unscoped
  behavior so nothing else that calls them needed to change). The
  quant-specific Wincent/SIG/IMC readiness panel now only renders on
  the quant track instead of showing meaningless labels everywhere.
- A non-blocking first-run panel (shown only when the user has zero
  attempts and zero sessions anywhere) explaining the six-track model
  and offering direct track chips — disappears permanently the moment
  there's any activity, never gates the primary CTA beneath it.

### 5. Session completion — a designed moment, every time
- Regular sessions (Drill/Mixed/Adaptive/Redo) previously ended by
  silently returning to wherever they started. They now route to a
  new `viewSessionReport`: score, time, and — once there are at least
  two prior sessions of the same mode+topic — a comparison to the
  user's own rolling average, with a milestone banner when the
  session is a personal best. This uses a new, purely additive
  `state.sessions` log (`recordSession`/`sessionComparison` in
  `store.js`) that runs alongside the existing `state.mocks` log
  without altering it.
- Mock reports got the same milestone-banner treatment, reusing the
  existing `internalRating` percentile (rating === 100 means it beat
  every prior mock of that type — a "New best" banner; no prior mocks
  of that type gets a "first recorded" banner instead).
- The in-question verdict banner (correct/incorrect) now carries a
  small check/alert glyph in a colored badge instead of bare
  ALL-CAPS text, with a brief scale-in animation on a just-revealed
  correct option (150–250ms, disabled under `prefers-reduced-motion`,
  matching what was already respected in the base stylesheet).

### 6. Learn wayfinding
A sticky, horizontally-scrolling unit index (A, B, C, ... jump-to-unit
buttons) and a studied/not-studied dot per concept (derived from
existing `Learn`-mode attempt history, no new tracking needed), plus
a per-unit "X/Y studied" counter. Concepts remain accordions on one
page rather than a full one-concept-per-screen rebuild — the sticky
index was judged to solve the actual pain point (finding a specific
concept among 51) at a fraction of the implementation risk of a
bigger information-architecture change.

### 7. Shareability
`index.html` gained Open Graph / Twitter Card / apple-mobile-web-app
meta tags and a redrawn navy-and-gold favicon (was a flat amber "Q" on
near-black). The product name was deliberately left as "Quant Test
Lab" throughout — renaming it was never asked for and would have been
a scope overreach.

## Validation performed

- `node -c js/app.js` / `node -c js/store.js` — clean on every commit.
- A new jsdom E2E (`scratch_e2e_redesign.js`, gitignored per the
  existing `scratch_*.js` pattern) that: loads the real `index.html`
  in jsdom, visits **all 10 nav views on all 6 tracks** (60
  view-renders, zero uncaught JS errors), runs a **complete Drill
  session** from question one through to the new session-report
  screen with real clicks, verifies **per-track last-view memory**
  survives a track switch, opens and drives clicks through both the
  **track-picker sheet** and the **more-sheet**, exercises the
  **Learn sticky index** and answers a real check, and runs a
  **full SIG mock** end-to-end into the mock report. Re-run after
  every change in this sequence; last run before this report was
  written passed cleanly with the message `ALL REDESIGN E2E CHECKS
  PASSED`.
- Visual QA via a Playwright script (`scratch_screenshot.js`,
  gitignored) driving the real Chromium binary already available in
  this environment, capturing the Dashboard, track picker, Learn
  (closed and with a concept open), Drill config, the question
  runner, the runner's answer-feedback state, the session-report
  screen, and the more-sheet — at **375px and 1440px, in both light
  and dark theme** (16 screenshots total). Reviewed all of them
  directly; caught and fixed one real bug this way (the track-card's
  name/meta text were running together on one line because both were
  inline `<span>`s with no `display:block` — fixed by making
  `.track-card .body` a column flex container).
- `git diff --stat` against `bank*.js`, `lessons*.js`, `gen-*.js`,
  `formulas.js` checked before every commit — zero changes, every
  time.

## What was deliberately not done

- **Learn as one-concept-per-screen.** Considered and rejected in
  favor of the sticky index — solves the same wayfinding problem with
  much less risk to existing behavior (deep-linking, scroll position,
  the existing accordion-based check-answering flow).
- **Scoping the Stats view by track.** The Dashboard is now fully
  track-scoped; Stats was deliberately left as a global, all-tracks
  deep-dive view — a reasonable product distinction (Dashboard =
  "this track, right now," Stats = "everything, over time") rather
  than an oversight, but worth revisiting if user feedback wants
  Stats scoped too.
- **Recognition-accuracy (Pattern mode) track tagging.** `recordRecognition`
  attempts aren't tagged with `track` the way `recordAttempt` now is,
  since nothing currently reads recognition accuracy per-track. Cheap
  to add later if a per-track Pattern-accuracy view is wanted.
- **Renaming the product.** Not requested; the brief's shareability
  section was about meta tags and a real favicon, not identity.

## Commit sequence

1. Palette + `UX_AUDIT.md` (foundational, zero JS/HTML changes).
2. Navigation overhaul + retention mechanics (`store.js` additions,
   `app.js` rewrite of nav/dashboard/session-completion/Learn,
   `index.html` topbar + meta tags).
3. This report, plus the track-card CSS fix and the first-run
   onboarding panel found and added during final visual QA.

All pushed to `claude/quant-test-lab-architecture-ssa7xf`.
