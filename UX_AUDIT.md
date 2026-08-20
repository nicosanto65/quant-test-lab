# UX Audit — pre-redesign baseline

Written before any navigation/visual changes were made (the color
palette in `css/styles.css` was established first, per the requested
work order, but no HTML/JS structure had changed yet when this was
written). Describes the app exactly as it behaved going into this
redesign.

## 1. First-time entry flow

1. `index.html` loads all 24 script files synchronously (11 content
   files across 6 tracks, `store.js`, `app.js`, `util.js`, `formulas.js`).
2. `DOMContentLoaded` fires `init()`: sets `data-theme` from saved
   settings (defaults to `dark`), builds the sidenav/tabbar buttons,
   builds the track `<select>`, wires the theme button and keyboard
   shortcuts, then calls `go('dashboard')`.
3. The user lands directly on the Dashboard — there is **no onboarding
   of any kind**. A first-time user with an empty `state.attempts`
   sees: 4 stat tiles all reading 0/0%/0s, a "Recommended next
   session" panel (the only concession to onboarding — `recommendation()`
   returns a fixed string when `total < 5`: *"Start with Learn →
   Probability fundamentals, then a 10-question Drill at difficulty
   2"*), a row of quick-session buttons, three readiness-score tiles
   at 0, two empty topic-accuracy panels, two empty weak/strong-topic
   lists, and an empty mock-history panel.
4. Nothing on this screen explains **what the product is**, **who
   it's for**, or **what a track even means** — the track selector in
   the topbar is a bare, unstyled native `<select>` with no label, and
   a first-time visitor has no reason to know it exists or matters.

## 2. Clicks/taps to common actions (as of the pre-redesign build)

Counted from a cold app load (Dashboard active), tapping only — no
keyboard shortcuts (which exist but are undiscoverable — the `kbd`
hints are hidden entirely below 900px width, i.e. on every phone).

| Action | Taps | Notes |
|---|---|---|
| Start "Train my weaknesses" | 1 | Genuinely one tap, but only findable if the user reads the paragraph above it — no icon, ordinary `.btn` styling identical to six other buttons on the same screen. |
| Start a specific Drill (e.g. "Bayes, difficulty 3, 10 questions") | 1 (nav) + 3 (topic, difficulty toggle, count) + 1 (Start) = 5 | Drill is a full config form with no memory of "what did I drill last time" surfaced anywhere. |
| Open Learn for one specific concept | 1 (nav) + scroll to the right unit + 1 (click `<summary>` to expand) = 2 taps + unbounded scroll | All units/concepts render in one long flat page — there is no index, search, or jump-to. On the quant track this is **16 units, 51 concepts** rendered as one uninterrupted scroll. |
| See the Dashboard from anywhere | 1 | Fine. |
| Switch track | 1 (open the native `<select>`) + 1 (pick an option) = 2, but... | ...the interaction model is a bare OS-native dropdown with 6 text-only options ("Quant trading", "Reasoning speed", ...). No icon, no indication of progress in that track, no confirmation of what just happened beyond a generic toast. |
| Resume "where I left off" after switching track | Not possible | Switching track always calls `go('dashboard')` unconditionally (`app.js` `buildTrackSelect`). Whatever view you were on (mid-Drill-config, Learn, Stats) is discarded. There is no per-track "last view" memory at all. |

## 3. Friction points found

- **No onboarding.** A brand-new user is dropped straight onto a
  Dashboard full of zeros with no explanation of the 6-track model,
  no explanation of what "Wincent/SIG/IMC readiness" scores mean
  (there is a one-line disclaimer buried in Stats, not Dashboard), and
  no guided first action beyond one paragraph of recommendation text.
- **Track switch = full reset to Dashboard, always.** There is no
  concept of "you were mid-way through configuring a Drill in
  Consulting, now you're back in Quant" continuity. This is the single
  most named friction point in the brief, and it's real: `setTrack()`
  is called, then unconditionally `go('dashboard')`.
- **Global (not per-track) analytics.** `S.summary()`, `S.byKey()`,
  `S.readiness()`, `S.perDay()` all iterate `state.attempts` with **no
  track filter** — attempts recorded in the Quant track and attempts
  recorded in the Consulting track are averaged together into one
  "Accuracy" number on the Dashboard. A user studying two tracks would
  see a single blended accuracy/streak/readiness that reflects neither
  track honestly. (Root cause: attempts were never tagged with which
  track they belonged to — `finishAndRecord()`'s call to
  `S.recordAttempt()` never includes a `track` field.)
- **The "streak" shown is not a usage streak.** `summary().streak` is
  "consecutive *correct answers* at the tail of the attempt log," not
  "consecutive *days* you opened the app." There is no calendar-based
  streak or contribution history anywhere in the app — nothing like a
  GitHub graph exists yet, despite streak psychology being core to the
  retention goal.
- **Empty states are bare text, not designed.** `.empty` renders as
  centered dim text ("No data yet.", "Needs at least 3 attempts per
  topic.") with no illustration, no suggested action, no visual weight
  — six or seven of these can appear simultaneously on a first-time
  Dashboard.
- **Learn is one continuous scroll with no wayfinding.** 51 concepts
  across 16 units (quant track) render as nested `<details>`
  accordions in one flat page with zero sticky index, zero jump
  navigation, and zero indication of which concepts have already been
  studied. Finding "the Bayes' theorem concept" requires either
  remembering which unit it's filed under or scroll-hunting.
- **Session-end feedback is a data dump, not a moment.** `finishMock`
  routes to `viewMockReport`, which is a a straightforward stack of
  stat tiles, a topic-accuracy bar chart, and then **every single
  question re-rendered in full** with its solution — for a 25-question
  SIG mock, that's 25 full question cards stacked vertically below the
  summary. Regular (non-mock) session completion has **no dedicated
  summary screen at all** — `endSession()` just calls `go(cfg.returnTo
  || 'dashboard')`, silently dropping the user back wherever they
  started with no acknowledgment that they just finished 10 or 20
  questions. There is no comparison to a previous session, no "you
  beat your average," nothing.
- **Question-level feedback is instant but visually flat.** Answering
  correctly and answering incorrectly produce the same static
  border-color change with no transition, no distinguishing weight —
  a correct answer and a wrong answer are visually equivalent events
  except for the color, with zero animation to mark the moment.
- **Bottom tab bar overflows on small phones.** `.tabbar` holds 10
  buttons (`Dash/Learn/Drill/Pattern/Mixed/Mocks/Errors/Sheet/
  Stats/Set`) in a single horizontally-scrolling row with no visual
  affordance that more tabs exist off-screen — a first-time mobile
  user has no reason to know "Errors," "Sheet," "Stats," and "Set" are
  even there unless they happen to scroll the tab strip sideways.
  Every tab is text-only (no icon), 10px uppercase mono type, which is
  a genuinely hard tap target to parse at a glance while also being
  visually undifferentiated from a plain label.
- **The `<select>` track switcher is a native OS control**, which
  means: on iOS it opens a wheel picker, on Android a Material dialog,
  on desktop a plain dropdown — three inconsistent experiences with
  zero visual identity per track (no icon, no color) and the option
  labels are the only distinguishing thing.
- **Confidence chips and difficulty chips share the same visual
  language as topic/answer selection**, which meant every "active/
  selected" state in the app was rendered with the same single accent
  color as "this is the correct answer" — selection and
  correctness were visually conflated everywhere (chip.on used the
  same amber as opt.right).

## 4. Mobile vs desktop

- **Desktop (≥900px):** two-column layout (`210px` sidenav + content),
  sidenav shows all 10 views as a vertical text list with a 2-digit
  keyboard-shortcut hint (`.k` span) that's otherwise invisible unless
  you already know `1`–`0` map to views. Chart SVGs are viewBox-scaled
  so they resize acceptably. `kbd` hints on buttons only render here.
- **Mobile (<900px):** single column, sidenav is `display:none`,
  bottom tabbar takes over (10-button horizontal-scroll strip, see
  above). `.grid.c3`/`.grid.c4` collapse to 2 columns below 700px,
  which is reasonable, but the Dashboard's 4-stat-tile row and
  3-readiness-tile row both end up as awkward 2+1/2+2 wrapping at
  narrow widths (375px) rather than a clean grid.
- Text inputs correctly use `font-size:16px` (prevents iOS zoom-on-
  focus) and buttons hit the 44px minimum tap-target height — this
  part was already done correctly.
- No breakpoint issue causes actual breakage (nothing overlaps or
  clips at 375px), but everything below 900px is visibly "the same
  desktop layout with the sidebar removed" rather than a
  mobile-considered layout — most real usage (per the brief) will be
  mobile, and mobile was clearly the secondary consideration in the
  original build.

## Summary of what the redesign needs to fix, in priority order

1. Track switch must feel like switching a mode, not reloading a page
   — visual identity per track, preserved context, per-track progress
   visible before you even switch.
2. Attempts need a `track` tag so analytics can be scoped per track
   (additive change, doesn't break existing history).
3. A real onboarding beat for first-time users, without blocking
   returning users.
4. A designed, weighted session-completion moment for every session
   type, not just mocks.
5. A genuine day-based usage streak + contribution history, separate
   from the existing "consecutive correct" stat.
6. Learn needs wayfinding: sticky index, studied/not-studied
   indicators.
7. Icons + a coherent nav IA (primary vs. secondary sections) instead
   of a 10-button flat tab strip.
8. Consistent color semantics: brand navy for structure/selection,
   gold reserved for CTA/correct-feedback/progress only.
