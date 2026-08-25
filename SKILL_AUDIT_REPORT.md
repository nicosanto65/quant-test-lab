# Skill Audit Report

Audit of the current app (post Visual Rework, Reports 5–8) against the exact checklist the
`ui-ux-pro-max` skill returned in `SKILL_DESIGN_SYSTEM.md` — every accessibility item the skill's
own style/color/ux-guideline records repeat verbatim:
`contrast-text-4.5, keyboard, visible-focus, reduced-motion`, plus the badge-wrap, icon, and
responsive-breakpoint guidance from the domain-specific queries.

Contrast ratios below are computed with the real WCAG relative-luminance formula (not eyeballed) —
script and full output preserved in the session scratchpad. Live-rendered checks (badge wrap,
overflow) used Playwright against the actual running app, not static markup reading.

## 1. Color contrast — 4.5:1 minimum for normal text (light mode)

**FAIL — real, specific failures found**, all in `css/styles.css` `:root`/light-theme tokens:

| Combo | Ratio | Verdict | Where it's used |
|---|---|---|---|
| `--dim` on any panel shade (light) | 2.3–2.8:1 | **FAIL** | `.eyebrow`, `.dim`, `.stat .label`, `kbd`, `.micro-label`, `.formula-label`, `.chart-legend`, `.heatmap-legend`, `.empty` — all real small text, none large/bold enough for the 3:1 exception |
| `--dim` on any panel shade (dark) | 2.9–3.2:1 | **FAIL** | same token, dark theme |
| `--nav-text-dim` on `--nav-bg` (light) | 2.95:1 | **FAIL** | inactive sidenav/tabbar labels, `.topbar-btn` |
| `--nav-text-dim` on `--nav-bg` (dark) | 4.33:1 | **FAIL** (narrowly) | same |
| `accent-2` on `accent-soft` (`.verdict.ok`) | 4.17:1 | **FAIL** | "correct" verdict banner text |
| `--pos` on `--pos-soft` | 4.48:1 | **FAIL** (by 0.02) | any positive-data badge text |
| `--warn` on `--warn-soft` | 3.51:1 | **FAIL** | "Common trap" badge text |
| `--teal` on `--teal-soft` | 3.60:1 | **FAIL** | worked-examples badge text |
| `--track-consulting` on its own `-soft` | 4.42:1 | **FAIL** (by 0.08) | Consulting track badge text |
| `accent-ink` on `accent` (`.btn.primary`, `.locked-cta`) | 3.46:1 | **FAIL** for normal text (passes only the 3:1 large-text exception, and the button's 650 weight at 15px doesn't clearly qualify as WCAG "bold large text") | every primary CTA button, the Unlock button |

**PASS** — `--muted` on every panel shade (4.89–5.91:1, both themes), `--brand`/`--brand-2` as text
color (6.3–9.2:1), `kicker` (5.9–6.6:1), `pill-badge` default and neutral variants (4.89–5.68:1),
`--neg` on `--neg-soft` (4.52:1), `--info` on `--info-soft` (4.89:1), `--track-wm` on its `-soft`
(5.58:1), nav active-tab text (5.17:1), body text (16:1).

The `.stat.accent .value` combo (`--accent` on white, 3.55:1) is a legitimate **pass** under the
large-text exception — it's set in `--fs-xl` (26px) mono, well above the 18px/24px large-text
threshold — included above for completeness, not as a failure.

## 2. Cursor + hover state on every clickable element

**PASS**, verified by reading every `.onclick =` assignment in `js/app.js` against the class it's
attached to. Every interactive element (`.btn`, `.chip`, `.opt`, `.track-card`/`.mode-card`
[both always paired with `.gradient-card`], `.sector-concept-row`, `.expand-toggle`,
`.concept-stepper button`, `.sheet-item`, `.navgrid button`, `.topbar-btn`, `.track-pill`,
`select`) already carries `cursor: pointer` and a real (non-subtle) hover rule from the
component-language work in Reports 5–8 and the Visual Rework. No `<div>`/`<span>` with an
`onclick` handler and no matching cursor/hover rule was found. `.check-card` and `.heatmap i`
have hover treatments but **no `onclick` of their own** (only elements nested inside them are
real controls) — their hover is anticipatory/atmospheric, not a false click affordance, and
neither sets `cursor: pointer`, so nothing here misrepresents itself as clickable.

## 3. `prefers-reduced-motion` respected globally

**PASS**, unchanged from every prior report:
`@media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none
!important; } }` (styles.css, last line) — confirmed again this session via Playwright with
`reducedMotion: 'reduce'`, `document.getAnimations().length === 0`.

One **non-blocking observation** from the skill's own animation guidance ("animate 1–2 key
elements per view maximum, don't animate everything that moves"): the app now has view-enter
fade, ring fill, counter count-up, and answer-reveal color-ease running on Dashboard/Drill loads.
None of these are looping/ambient — they're one-shot entrance effects that finish and stop — so
this doesn't read as the "animate everything" anti-pattern the guideline warns against, but it's
worth keeping in mind before adding more.

## 4. Responsive at 375 / 768 / 1024 / 1440px

**PASS.** Screenshotted all four breakpoints across Dashboard/Learn/Drill/Mocks. The only overflow
at any width is the same `scrollWidth − clientWidth = 3px` quirk documented in every report since
Report 6 (traced to the topbar, confirmed via `git stash` to predate this session too — re-checked
again here). 1024px (not previously tested explicitly — prior reports used 375/768/1440/1920) sits
cleanly between the existing `@media (min-width: 700px)` and `@media (min-width: 900px)` rules with
no dead zone.

## 5. Badges/chips with long real content don't break layout

**PASS, verified live** with the two longest real strings a `topicPill()` badge will ever actually
render: `"Alternative Investments (Client View)"` (38 chars, WM track) and Consulting's topics
(≤24 chars — `"Real Estate / Travel / Professional Services"` turned out to be a *subtopic*, shown
only as plain inline text in the Mistakes list, never as a pill). At 375px, running an actual WM
Drill session filtered to that topic: the pill renders at 281px width, entirely inside the 375px
viewport, its text never wraps internally (`pill-badge` already sets `white-space: nowrap`), and
the only page overflow present is the same pre-existing 3px topbar quirk from item 4 — confirmed
identical with and without that topic selected. The mechanism is exactly what the skill's own
guidance recommends (`"use nowrap with a shrinkable label"`): `.qmeta`'s `flex-wrap: wrap` lets the
whole pill drop to its own row when the row is full, rather than letting the badge itself overflow
or break its text across two lines. No current real content exercises a true worst case, so this
is a pass with headroom, not a coincidence — see Step 3d for the one small hardening applied
anyway as defense-in-depth.

## 6. No emoji-as-icon anywhere; every icon is real SVG

**PASS.** `grep -P` for the emoji Unicode ranges (`U+1F300–1FAFF`, `U+2600–27BF`, `U+2190–21FF`,
`U+2B00–2BFF`) across `js/app.js` and `index.html` returns zero matches. Every icon in the app is
drawn through the single `icon(name)` → `ICONS` map helper as inline `<svg>` paths (confirmed in
prior reports and re-confirmed here) — no separate icon system exists to have missed.

Checked against the skill's icon-domain guidance (decorative icons beside their own visible text
label should carry `aria-hidden="true"`): every `<svg>` produced by `icon()`, `trackIcon()`, and
the two inline icon strings already sets `aria-hidden="true"` — a `grep '<svg'` across the whole
file confirms it. Two real gaps *were* found by the same sweep, both fixed in Step 3f: `barChart()`
had neither `aria-hidden` nor a `role`/`aria-label` (a genuinely meaningful chart with zero
accessible summary — now `role="img" aria-label="..."`, matching the sibling `lineChart()`
function that already did this correctly), and the progress-`ring()` SVG had neither (now
`aria-hidden="true"`, since every call site already shows the same percentage as visible text
elsewhere on the card).

## 7. Visible focus states for keyboard navigation

**Mostly PASS, one real gap found.** A global `:focus-visible { outline: 2px solid var(--brand);
outline-offset: 2px; }` rule (styles.css, last line) covers every interactive element by default —
this alone satisfies the skill's "visible focus ring on every interactive control" requirement
almost everywhere. One exception: `.sector-concept-row:hover, .sector-concept-row:focus-visible {
background: var(--panel-2); outline: none; }` (Learn's concept-list rows) explicitly removes the
outline and substitutes only a background tint as the focus indicator — exactly the pattern the
skill's own guidance calls out by name ("Don't: Remove focus outline without replacement"). A
background shift this subtle (panel → panel-2, one step on a very close tonal scale) is not a
reliable keyboard-focus indicator on its own. See Step 3f.

---

## Summary — what needs fixing (Step 3)

| # | Area | Verdict | Action |
|---|---|---|---|
| 3a | Color contrast | **FAIL** (10 combos, both themes) | Darken `--dim`, `--nav-text-dim`, `accent-2`, `--pos`, `--warn`, `--teal`, `--track-consulting` where used as text-on-soft; fix `accent-ink`-on-`accent` button text |
| 3b | Cursor/hover | PASS | No change needed |
| 3c | `prefers-reduced-motion` | PASS | No change needed |
| 3d | Badge/chip wrap | PASS (verified live) | Added `title` on `pillBadge`/`topicPill` for full-text exposure as defense-in-depth |
| 3e | Emoji icons | PASS | No change needed |
| 3f | Focus states | Mostly PASS, 1 gap | Restored a real focus indicator on `.sector-concept-row`; added `role`/`aria-label` to `barChart()` and `aria-hidden` to the progress ring SVG |
