# Bloque 2 — "Showcase 2030" visual rework report

Real, bold motion added on top of the already-validated identity (Inter + Source Serif 4,
saturated nav blue, warm-neutral reading surfaces, the gradient-card/icon-box/pill-badge/
kicker system) — nothing here replaces that direction, everything extends it with the motion
and interactivity a Linear/Notion/Duolingo/Stripe-tier product actually has. Native browser
APIs only (`IntersectionObserver`, `document.startViewTransition`, CSS transitions/keyframes)
— no new dependency was added, and none was needed.

**No content file touched.** `git diff --stat -- js/bank*.js js/lessons*.js js/gen-*.js
js/formulas.js` is empty, checked after every commit below.

## What shipped

### 1. Scroll-driven reveal (`.reveal-on-scroll`, `initScrollReveal()` in `js/app.js`)

A single shared `IntersectionObserver` (rebuilt once per `render()` call, since `render()`
fully replaces `#main`'s contents every time) watches every `.reveal-on-scroll` element.
Crossing into the viewport adds `.in-view`, which fades/slides the element into place
(`opacity 0→1`, `translateY(16px)→0`, 420ms). Applied to Dashboard's hero, quick-session row,
consistency panel, all four analytics panels, and — the flagship moment — every card in
"Progress by track" (the onboarding grid, the six real track cards, and the locked-premium
demo card), each with an index-based stagger capped at 330ms so the grid cascades in card by
card instead of arriving as one flat block.

Elements already on-screen at load (the hero, above the fold) still reveal almost
immediately — `IntersectionObserver` reports current intersection state the moment
`observe()` is called, it doesn't require an actual scroll gesture. No `IntersectionObserver`
support, or a scope with no matching elements (the jsdom E2E suite), fails open: everything
just appears at full opacity, never silently stuck invisible.

**Verified live** (Playwright/real Chromium): 15 reveal targets on a populated Dashboard; the
above-the-fold ones (hero/quick-row/consistency panel) are in-view within ~500ms of mount;
scrolling to the bottom brings the rest to 12/15 in-view, confirming genuinely scroll-driven
behavior rather than an on-load fade dressed up as one. Screenshots at 375/768/1440px in
`reports/` (see the `final2/` set referenced in this session, dashboard fully scrolled through)
show the whole page — hero through "Recent mock scores" — laid out cleanly with no overflow
beyond the same pre-existing ~3px topbar quirk documented since Report 6.

This is deliberately **not** parallax and does not scroll-jack: the observer only watches, it
never intercepts or alters the actual scroll — exactly the distinction the `ui-ux-pro-max`
skill's own "Motion Sensitivity" guideline draws ("Parallax/Scroll-jacking causes nausea... Do:
honour `prefers-reduced-motion` and present the final readable state").

### 2. View Transitions on real navigation (`js/app.js`, `render()`/`renderNow()`)

`render()` is the one function every screen swap AND every in-session redraw (next question,
answer feedback, flag toggle) goes through. Wrapping all of it in
`document.startViewTransition` would have put transition cost on the single most frequent
interaction in the app — the opposite of what the brief asks ("no debe introducir lag
perceptible"). Split into `render()` (the router) and `renderNow()` (the actual DOM rebuild,
unchanged): `render()` tracks the view/track it last actually painted and only opens a view
transition when the resolved view or the active track differs from that — i.e., genuine
section/track navigation, never a same-screen re-render.

Custom `::view-transition-old(root)`/`::view-transition-new(root)` keyframes replace the
browser's default cross-fade: outgoing content fades out quickly (160ms), incoming content
fades **and slides up** (320ms) — the same "arriving" motion language `.reveal-on-scroll`
already uses, so the two features read as one system rather than two unrelated effects.
Browsers without support (everything but Chromium as of this writing) never call
`startViewTransition` at all — `render()` falls straight back to the plain DOM swap plus the
pre-existing `#main.view-enter` fade/slide, which is the CSS fallback the brief asks for, and
was already shipped before this Bloque.

**Verified live**: `document.startViewTransition` is called on `go('learn')` (a real nav);
zero calls are recorded during an in-session `.opt` click in a running Drill session.
`prefers-reduced-motion` skips the wrapper entirely (checked before calling
`startViewTransition`), and a CSS safety net (`::view-transition-old/new/group { animation:
none !important }` under the reduced-motion media query) covers any future direct caller —
`*` never matches pseudo-elements, so the app's existing blanket reduced-motion rule couldn't
have reached these on its own.

### 3. Micro-interactions: buttons now match every other interactive surface

`.gradient-card`, `.chip`, `.opt`, and `.locked-cta` already lifted + gained a shadow on
hover (earlier sessions). `.btn`/`.btn.primary`/`.btn.secondary` were still colour-only
(border/background shift, no transform, no shadow) — the most-used interactive element in
the app was the one exception to its own design system. Fixed: every button now lifts
`translateY(-1px)` and gains `box-shadow` on hover (primary/secondary get a layered
shadow — a crisp near-shadow plus a soft colour-tinted glow, matching `.locked-cta`'s existing
pattern); `:active` keeps its existing press-down feel. The shared transform/box-shadow
transition moved from 80ms to 150ms so the **hover** motion reads as deliberate rather than
instant, while still being snappy enough for the same rule to serve the **press** feedback.

**Deliberately left colour-only**, and documented as such in the CSS rather than left
unexplained: nav chrome (`.topbar-btn`, `.sidenav button`, `.track-pill`) and full-width list
rows (`.sector-concept-row`, `.expand-toggle`, `.concept-stepper button`). These sit flush on
a surface (the nav bar) or read as list rows, not floating cards — Linear and Notion, the two
references this rework cites, don't lift sidebar rows or nav items on hover either. Not an
oversight; a scope decision that matches the cited quality bar.

### 4. Dashboard showcase — counters and rings (verified, not rebuilt)

Both were already built in the prior Visual Rework session (`animateCounters`/`activateRings`
+ `data-count-to`) and needed no further work — verified rather than reimplemented, per the
brief's own "verificación+extensión" framing. Live instrumentation this session: the accuracy
tile animates 0%→2%→…→50% over ~650ms with an ease-out cubic, no dropped frames, no garbage
intermediate values (an earlier, less careful manual check briefly appeared to show a
negative percentage — re-run three times with frame-by-frame instrumentation and never
reproduced; attributed to a one-off Playwright/harness timing artifact in that specific
ad-hoc script, not the app). Progress rings mount at 0% circumference and animate to their
real value via `activateRings`, confirmed settling on the exact target `stroke-dashoffset`.

### 5. Paywall visual treatment (verified, not rebuilt)

`.locked-card`/`.locked-overlay`/`lockedOverlay()` shipped in the prior session's Visual
Rework and already meets this round's spec exactly: blurred content, a centred lock icon,
a "Premium" pill in the gold accent, and an "Unlock" CTA. Re-verified live this session: the
CTA shows the placeholder toast ("Premium unlocking isn't connected yet — coming soon.") and
does **not** navigate anywhere — no real gating logic exists or was added, as required.

### 6. Smooth dark/light theme swap (`toggleTheme()` in `js/app.js`)

Every themed colour is a CSS custom property, so flipping `data-theme` recomputes the whole
page in one frame — correct for the token architecture, but it reads as an abrupt cut. Rather
than a permanent global `* { transition: background-color … }` (which would fight almost
every component's own hover/press transition list — double-animating some properties, losing
to specificity on others), `toggleTheme()` now adds a `theme-transitioning` class right
before the attribute swap and removes it ~340ms later. The class's rule uses `!important` to
briefly take priority over every component's own transition list for exactly the swap's
duration, covering `background-color`/`color`/`border-color`/`box-shadow`/`fill`/`stroke` (the
last two so SVG icons drawn with `currentColor` swap smoothly too).

One real bug caught and fixed during implementation: `.theme-transitioning *`'s selector
(class + universal, specificity `0,1,0,0`) is **more specific** than the existing global
reduced-motion rule's bare `*` (specificity `0,0,0,0`) — an `!important`-vs-`!important` fight
that the theme-transition rule would have *won*, silently overriding the user's motion
preference. Fixed by never adding the class at all when `prefers-reduced-motion: reduce` is
set (checked in JS before `classList.add`), which sidesteps the specificity trap entirely and
is simpler than trying to out-specify the global rule in CSS. Verified live: class is added
and removed correctly under normal motion; never added under reduced motion (0 active
animations either way).

## Proposed, not applied — needs your go-ahead

**Skeleton loaders.** The brief flags this as optional, pending approval after seeing the
result, so nothing was implemented. `.skel`/`.skel::after` shimmer CSS already exists in the
stylesheet from an earlier pass but has never been wired to any view — the app is fully
synchronous (everything reads from `localStorage`, nothing is actually asynchronous except
maybe a future real paywall/auth backend), so there's no genuine loading gap to cover today.
Forcing an artificial delay purely to show a skeleton would make the app feel *slower*, not
more alive — the same reasoning the prior Visual Rework session used to skip this. If real
async operations arrive later (a Supabase/Stripe backend, syncing progress across devices),
that's the moment skeleton loaders would earn their keep, and the CSS is already sitting
there ready to be used.

## Design decisions worth your review

- **View Transitions is Chromium-only today** (Firefox/Safari don't implement
  `document.startViewTransition` yet). Every other browser gets the pre-existing
  `#main.view-enter` fade/slide instead — a real fallback, not a broken experience, but worth
  knowing the "big" transition is currently a Chromium-exclusive enhancement layered on top of
  a baseline that already works everywhere.
- **Reveal stagger is index-based across the whole render scope**, not scoped per-section —
  so the hero, quick-row, and consistency panel stagger in sequence *before* the track cards
  start their own cascade, rather than each section restarting its own stagger from zero. This
  reads as one continuous top-to-bottom "arrival," which was the intent, but it's a specific
  choice among a few reasonable ones (per-section restart was the alternative).
- **Nav chrome and list rows were deliberately left out of the hover-lift treatment** (see
  Bloque 2c above) — flagging this explicitly in case the intent was actually "everything
  clickable lifts," not "everything that reads as a card lifts."

## Validation

- **(a)** `node -e "global.window=global; require('./js/app.js')"` — the same documented
  pre-existing `ReferenceError: document is not defined`, unchanged, after every commit.
- **(b)** Full local suite: `for f in scratch_e2e_*.js scratch_verify_*.js; do node "$f"; done`
  — **36/36 scripts exit 0** after every commit in this Bloque, no `FAIL:` lines anywhere.
- **(c)/(content-file guard)** `git diff --stat -- js/bank*.js js/lessons*.js js/gen-*.js
  js/formulas.js` — empty after every commit.
- **(d) reduced motion**: `document.getAnimations().length === 0` on Dashboard and again after
  a real navigation to Learn, under a Playwright context with `reducedMotion: 'reduce'` —
  content still becomes visible (no permanently-hidden `.reveal-on-scroll` elements), just
  without motion; the theme-swap class is never added; the view-transition wrapper is never
  invoked.
- **(e) three breakpoints**: 375/768/1440px, Dashboard/Learn/Drill/Mocks/Mixed/Settings — zero
  overflow beyond the same pre-existing ~3px topbar quirk present at every width since Report
  6 (re-confirmed, not introduced by this Bloque).
- **(f) contrast**: no color token changed in this Bloque (only shadows, transforms, opacity,
  and transition timing) — the WCAG 4.5:1 work from the `ui-ux-pro-max` skill audit earlier
  this session is untouched and still holds. Re-consulted the skill's own checklist
  (`--domain ux`, "pre-delivery checklist accessibility motion contrast") as the brief asks;
  its motion-sensitivity guideline ("honour prefers-reduced-motion, no parallax or
  scroll-jacking") is satisfied by construction — the reveal system observes scroll position,
  it never intercepts or alters scrolling itself.

**All Bloque 2 work is committed and pushed**, in the same incremental-commit-per-piece
pattern this project has used throughout: scroll-reveal + view-transitions together, then
button hover + theme-transition together — both content-file-clean and full-suite-green at
each step.
