# UX Improvements Report 5

A direct response to a concrete visual reference (a course-card product screenshot, described
in detail via text — depth via internal gradients, large icons in solid rounded-corner colour
boxes, icon+translucent-pill badges, kicker labels above bold titles) applied to this project's
own established navy/gold palette, not the reference's literal colours. All work is
rendering/styling in `js/app.js` and `css/styles.css`. **Zero content files were touched** —
verified via `git diff --stat` against every `bank*.js`, `lessons*.js`, `gen-*.js`, and
`formulas.js` file across the full range of this session's commits, confirmed empty. No word
of any primer, example, formula, solution, or check text changed — only how it renders.

Status: **all 6 steps of the brief's own work order complete, validated, committed
separately, and pushed.**

## Step 1+2 — Base components + Dashboard track picker (commit `5550d97`)

Four reusable pieces built once in `styles.css`, used everywhere below:
- **`.gradient-card`**: an opaque two-stop neutral gradient (never a flat single-tone fill)
  with a colour-tinted radial glow layered on top via `::before` — the tint colour is set per
  instance (`--gc-tint`, a `*-soft` token), so one class serves every context.
- **`.icon-box`**: a large icon in a solid, saturated, generously-rounded (16-18px) colour
  box — the single element the reference most clearly showed as missing from every previous
  pass, which only ever used small monoline glyphs with no fill of their own.
- **`.pill-badge`**: icon + translucent fill (a `*-soft` token, not solid) + full pill shape.
- **`.kicker`**: small, uppercase, wide-tracked, accent-coloured label above a bold title.

Two new per-track hues (`--track-wm`, `--track-consulting`) were added because 6 tracks need
6 distinguishable identities and the existing brand/accent/pos/teal set only covers 4; quant/
reasoning/ib/am reuse those 4 existing hues (each already means one thing elsewhere in the
app) rather than inventing more colours than necessary.

Applied to both track pickers (Dashboard's "Progress by track" grid and the track-sheet):
gradient-tinted card, large icon-box (one hue per track), bold title, a new one-line
`TRACK_TAGLINE` description (UI caption text in `app.js`, not sourced from any content file),
and a pill badge for progress/status. `ring()` gained an optional `colorVar` to stroke the
progress ring in the track's own colour instead of always brand blue.

## Step 3 — Learn's unit headers and content blocks (commit `d90d040`)

Unit headers ("UNIT AM-B · 0/1 studied") replaced their flat eyebrow line with the kicker
pattern — a small tracked label above a larger, bolder title — plus a pill badge (check icon)
for the studied count.

Each of the four block types (Context/Core/Examples/Practice) now carries a real identity
header — icon-box + kicker — instead of a plain small-caps eyebrow, and picked up the
two-tone gradient + tinted glow directly on their existing `.expand-card` elements:
- **Context** ("Start from zero"): blue flag icon, blue-tinted cards.
- **Core idea**: gold target icon, gold-tinted card — the flat solid fill from the previous
  pass is now genuine two-stop depth.
- **Worked examples**: each level keeps its established green/blue/gold identity, now with a
  matching tier icon (leaf/circle/flame) and a gradient-tinted card. A new
  `EXAMPLE_LEVEL_COLOR` map keeps this 3-tier scheme distinct from the unrelated 5-level Drill
  difficulty scale so the two colour systems don't collide in meaning.
- **Practice**: gold check icon leads the checks list. Individual question cards deliberately
  stayed a flat neutral card — a gradient tint repeated across 6+ questions per concept would
  read as visual noise, not aliveness, especially across a long study session.

## Step 4 — Difficulty/topic badges project-wide (commit `4adc09e`)

Every flat "L{n}" difficulty tag in the app — the live question card shown on every single
Drill/Mixed/Mocks question, Learn's practice checks, and the mistakes-log review list — now
uses `diffPill()`: an icon (leaf/circle/flame, reusing the existing d1-green/d2+d3-blue/
d4+d5-red grouping) inside a translucent pill.

Topic badges get the same icon+pill *structure* via `topicPill()`, deliberately neutral
(grey, tag icon) rather than colourful — topic names have no assigned colour meaning
anywhere in the app, unlike difficulty, so giving them one would violate "every colour has
one consistent purpose" purely to imitate the reference's look. subtopic/targetTime/curated
markers stayed plain text — icons on every one of several dozen secondary labels would add
clutter, not life.

## Step 5 — Mixed practice's mode picker (commit `e8233e0`)

Mixed practice's six modes (Easy/Medium/Hard/Wincent level/SIG speed level/Fully mixed) were
a flat row of plain buttons — now a grid of gradient-cards with an icon-box, a bold title, a
description built from the mode's own data (question count, timing, hint availability, never
hardcoded copy), and a `diffPill` badge for its difficulty range. Wincent/SIG — named-firm
presets, not just another difficulty tier — get their own identity colour (gold, teal).

Drill's topic/subtopic/difficulty/count selectors were deliberately left as native form
controls: a functional multi-field settings form is a different kind of UI than a "pick one
of several options" list, and forcing a card layout onto it would add risk without a real win.

**Regression found and fixed in the same commit**: 6 track-specific E2E test scripts clicked
into Mixed sessions via a `.panel .btn-row .btn` selector the new `.mode-card` markup no
longer matches. Updated all 6 to `.panel .mode-card` and re-verified they drive full Mixed
sessions on every track again.

## Step 6 — Dashboard welcome-card depth (commit `2a495e2`)

`.hero-cta`'s gradient now runs through a genuine brand-blue tint (previously two neutral
panel shades) and gained a real inline SVG (`.hero-deco`) of concentric rings + scattered
points in one corner, low-opacity, layered behind existing content via `z-index:-1`.
Deliberately scoped to just this one card — the Dashboard welcome frame is seen once per
session, not spent in for long stretches, matching the brief's own caution against fatiguing
a long study session with a busy background everywhere else.

## Judgment calls (documented, not silently skipped)

- **Two new colour hues added** (`--track-wm`, `--track-consulting`) — the only deviation
  from "reuse the existing palette," made because 6 tracks genuinely need 6 distinguishable
  identities and the brief itself explicitly asked for "un color/icono distintivo por track."
  Both are pastel-lightness-matched to the rest of the dark-mode palette and darkened/
  saturated the same way for light mode, following the exact pattern brand/accent already use.
- **Practice-check cards NOT given a gradient tint** — the reference's card treatment is built
  for a handful of "course" items; repeating it across 6+ quiz questions per concept would
  read as noise, not aliveness, and works against the brief's own point about not fatiguing
  long study sessions.
- **Drill's config form left as native selects/chips**, not converted to cards — it's a
  multi-field settings form, a fundamentally different UI shape than a "pick one" list;
  Mixed's mode buttons were the genuine analogue to the reference's course cards.
- **Topic badges kept neutral, not colourful** — topic strings have no established colour
  meaning anywhere in the app; inventing one per topic just to match the reference's *look*
  would violate the brief's own "every colour has one consistent purpose" rule.
- **A pre-existing, unrelated test failure was hit again and re-confirmed, not touched**:
  `scratch_e2e_am.js` and 4 sibling track scripts assert
  `S.allGenerators().length === 82 && S.curated().length === 60` after switching back to
  quant. Documented as pre-existing (predating this session) in Report 4; still true here.

## Validation performed (every commit)

- `node -c js/app.js` (or the harness's own syntax check via require): OK, every commit.
- The brief's own literal `node -e "global.window=global; require('./js/app.js')"` one-liner
  still throws `ReferenceError: document is not defined` — a pre-existing limitation
  (documented in Reports 3 and 4) unrelated to any change in this session: the module's
  bottom-level `document.addEventListener('DOMContentLoaded', init)` needs a real `document`
  that plain `global.window=global` doesn't provide. The project's actual regression
  mechanism is its jsdom E2E suite below, which does provide one.
- Full jsdom E2E suite re-run after every commit: `scratch_e2e_flow.js`,
  `scratch_e2e_formulas.js`, `scratch_e2e_redesign.js`, `scratch_e2e_expand_multitrack.js`,
  `scratch_e2e_paragraphs.js`, `scratch_verify_quote_fix.js`, `scratch_e2e_worked_formulas.js`,
  `scratch_verify_chevron.js`, `scratch_verify_trackcard_started.js` (new — confirms a track
  with real progress renders its coloured ring + accuracy pill), and all 6 track-specific
  suites (`scratch_e2e_quant/am/ib/wm/consulting/reasoning.js`) — all pass except the one
  documented pre-existing failure above.
- `scratch_width_multiviewport.js` (from the previous pass, re-run after every commit):
  375px/768px/1440px, zero overflow, content width matches parent exactly throughout.
- `git diff --stat` against every content file across the full commit range: empty.
- Exact-text reconstruction: unaffected by any header/icon markup change, since those tests
  select `<p>`/prose elements only — re-verified passing after every commit.
- Contrast check (new, `scratch_check_contrast.js` + `scratch_check_real_contrast.js`): an
  analytical worst-case model (full-strength tint everywhere) flagged two small-text cases
  (card descriptions, ~13px muted text; warm kickers in light mode, ~10px) as marginally under
  the 4.5:1 AA-normal threshold. A pixel-sampled check against the ACTUAL rendered position of
  a real track-card description (the radial tint is corner-anchored and fades out —
  description text sits away from that corner) measured a real ratio of **5.22:1**, passing —
  confirming the worst-case model overstates the tint's real effect once actual card layout is
  accounted for. All large-text/title cases pass comfortably (9.5–14.6:1 across both themes).
- Playwright visual QA at 375px/1000px/1440px, dark and light themes: track-picker grid and
  sheet-list, Learn's unit header/block headers/per-level example cards, difficulty/topic
  pills on a live Drill question, Mixed's mode grid, and the Dashboard hero's rings/gradient —
  all confirmed by screenshot, no overflow, text legible against every tint in both themes.

## Nothing remaining

All 6 steps are implemented, validated per the brief's checklist (a–f), committed separately
in the brief's specified order, and pushed to `claude/quant-test-lab-architecture-ssa7xf`.
