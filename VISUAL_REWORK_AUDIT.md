# Visual Rework Audit

Honest pass over the current state (screenshots at 1440px across Dashboard, Learn, Drill,
Pattern, Mixed, Mocks, Settings, Statistics, a Learn concept page, and a live Drill session)
before any code changes. Six prior UX passes improved individual pieces — nav color, typography
webfonts, KaTeX rendering, gradient-card/icon-box/pill-badge components applied to track
pickers, Learn content blocks, and Mixed's mode cards — but the overall product still reads as
a themed admin panel, not a SaaS product. Specific findings below, organized by what's actually
wrong, not by view.

## 1. Where it still reads as "document," not product

- **Drill's config screen is a bare HTML form.** Native `<select>` dropdowns with default
  browser chrome (visibly un-styled — different font, different height, different border-radius
  from everything else on the page), plain flat panel, no card composition at all beyond one
  gold CTA button. This is the single most "internal tool" screen in the app.
- **Settings is one long column of labeled `<input>` rows.** ~20 numeric weight inputs (Extended
  Timed Mock / No-Skip Timed Mock / IMC readiness weights) rendered as a flat vertical list with
  tiny uppercase labels above each box — no grouping cards, no icons, no visual hierarchy
  distinguishing one mock's weight group from the next. Reads exactly like a raw JSON config
  form, because structurally that's what it is.
- **Mocks' four format cards are visually identical.** Every one of Extended Timed Mock /
  No-Skip Timed Mock / IMC / McKinsey Solve prep uses the exact same "sheet" icon, the exact
  same blue icon-box, the exact same flat dark panel. Four fundamentally different formats
  (long-form, no-skip-speed, sectioned, case-style) present as four copies of one template.
- **Learn's topic menu: 16 cards, 1 icon.** Every unit card in the topic-menu grid uses the
  identical book icon and the identical track-blue tint — the cards differentiate purely by
  reading the title text, defeating the point of an icon system (scan by shape/color, not just
  text) the moment there are more than 2-3 cards on screen.
- **Dashboard's real hero is a plain pill row, not a hero.** The actual track SELECTOR — the
  single most important choice on the page — renders as six small `<button>` pills inside a
  paragraph-heavy panel ("Six tracks, one offline lab..."). The genuinely well-designed
  gradient-card track grid (icon-box, pill badge, progress ring) exists lower down as
  "Progress by track" — it's just not the first thing anyone sees, and there are two different
  track-selection UIs on the same page (the plain pills at top, the gradient cards below) with
  no visual relationship between them.
- **Dashboard's lower two-thirds reverts to flat gray boxes.** Accuracy/Completed/Avg time/
  Best run stat tiles, the three readiness-score tiles, Accuracy-by-topic, Weakest/Strongest
  topics, Recent mock scores — eight consecutive panels, all the same `--panel` gray, no icon,
  no color-coding, no elevation difference between them and the page background. The
  "Consistency" streak heatmap renders at such low contrast (thin dotted squares almost
  invisible against `--bg`) it reads as a rendering bug on first glance, not a feature.

## 2. Spacing / color / typography inconsistencies

- **Type scale tops out too low for a "hero."** `--fs-xl` is 26px — used for every `<h1>` page
  title AND meant to double as a hero headline. Linear/Stripe/Notion hero type is closer to
  40-56px. There is currently no size above 26px anywhere in the system.
- **No elevation scale is actually *used*.** `--shadow-sm`/`--shadow` exist as tokens but appear
  in exactly two rules (the toast, and one card). Every panel, card, and modal sits at the same
  flat z=0 visual plane — nothing "floats." Hover states on cards (`.mode-card:hover`) only
  `transform: scale(1.012)`, no shadow change, so the lift is barely perceptible.
- **Color-per-meaning is inconsistent between views.** Track identity color (brand/accent/pos/
  teal/track-wm/track-consulting) is used well inside Learn's content blocks and the track
  picker, but Drill/Mocks/Settings panels ignore it entirely and stay neutral gray-on-gray. A
  reader loses the "I'm in the WM track" visual cue the moment they leave Learn.
- **`--dur: 180ms` is a single global value**, not a scale — every transition in the app
  (button hover, card hover, accordion open, toast) uses the identical timing regardless of how
  large or small the visual change is. Larger movements (page-level content swaps) get no
  distinct, slightly longer easing from small ones (a button border color).

## 3. Missing interactivity — static where it should feel alive

- **Answer feedback is one color for everything.** In a live Drill session, the selected option
  gets an accent-gold highlight whether the answer is correct OR incorrect — there is no
  green/red differentiation at all on the option itself (the separate "Correct ·" banner below
  is the only signal), and the highlight appears instantly with no transition.
- **No entrance animation anywhere.** Switching views, opening an accordion, revealing a
  session report — every content swap is an instant DOM replace. Nothing fades or slides in.
- **No loading state.** View switches are synchronous re-renders (the whole app is client-side
  and instant, so this is rarely user-visible today, but there's no skeleton/shimmer pattern
  defined at all, and one will be needed once real data/paywall calls exist).
- **Numbers and progress appear fully-formed.** Accuracy percentages, readiness scores, and the
  progress rings on track cards render at their final value immediately — no count-up, no ring
  animating from 0.
- **Buttons/cards have a hover state but no distinct active/pressed state** — clicking feels the
  same as hovering, with no extra feedback confirming the click registered.

## 4. What already works (do not regress)

- The gradient-card / icon-box / pill-badge / kicker component language (Reports 5-8) is a
  genuinely strong foundation — track picker, Mixed's mode cards, Learn's content blocks,
  panel headers all already use it consistently and look considerably better than the rest.
- KaTeX formula rendering and the mixed-formula-label fix (Report 6) work correctly and should
  not be touched.
- Learn's restructured navigation (Report 8) — topic menu → dropdown → concept page — is
  structurally sound; this rework changes its visual treatment, not its architecture.
- Inter + Source Serif 4 is already the right font pairing decision (1b's ask is partially
  already done) — the gap is hierarchy scale and where the serif gets used, not the fonts
  themselves.

## Scope decision for this pass

Given the size of the existing stylesheet (1244 lines, 318 rules) and the amount already
working well (finding #4 above), this rework **extends and systematically re-applies** the
token system rather than deleting and rewriting it from scratch. A from-scratch rewrite would
re-introduce regression risk across every view for no visual gain over disciplined extension —
the brief authorizes a rewrite "if it produces a better result than iterating," and for a
system this size, extension *is* the better result: same ceiling, far less risk to the parts
that already work. New tokens (extended palette, elevation scale, gradient utility classes,
motion scale) are added alongside the existing ones, then applied broadly across every view
called out above.
