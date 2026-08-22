# UX Improvements Report 7

Two-part brief: (1) diagnose and fix why formulas with a plain-text label before the math
notation (`"Bayes: P(A|B) = P(B|A)P(A)/P(B)"`) were falling back to plain text instead of
KaTeX, and (2) extend the gradient-card/icon-box/pill-badge/kicker visual language built in
Report 5 to the rest of Learn and to Drill/Pattern/Mixed/Mocks, reusing those exact components
rather than inventing new ones. All work is in `js/app.js` and `css/styles.css`. **Zero content
files were touched** — verified via `git diff --stat` against every `bank*.js`, `lessons*.js`,
`gen-*.js`, and `formulas.js` file across every commit in this session, confirmed empty on
each. Not one word of primer/core/example/formula/trap/check text changed — only detection and
presentation.

Status: **both parts complete, validated, committed separately (3 commits), and pushed.**

## Part 1+2 — Mixed-formula-label detection bug (commit `1f8c678`)

**Starting hypothesis** (from the brief): the parser expects a formula to start directly with
math notation and discards the whole clause — label included — when it hits leading prose
before a `:` separator.

**What the diagnostic actually found.** A new read-only script
(`scratch_diagnose_mixed_formulas.js`, gitignored) walked every formula in `formulas.js` and
every concept's `formulas` field across all 6 tracks' `lessons*.js` files, ran each through the
real production parser (`parseFormulaSegment`, exposed via `QTL_APP` for exactly this purpose),
and traced *which pipeline gate* rejected each labeled failure. The label-stripping step
(`stripLeadingLabel`, a `"Word(s): "` prefix regex) already existed and was already wired in
from a prior pass — proven because many labeled formulas (`"Chain rule: P(A ∩ B) = P(B) ·
P(A|B)"`) already converted successfully *before* any change this session.

The real bug was narrower and not exclusive to labeled formulas: an *earlier* pipeline gate,
`wordIsProse` (feeding `countProseWordsOutsideText`), was stricter than a *later* gate,
`isLatexSafe`. The later gate already exempted all-caps tickers/acronyms (`GDP`, `EUR`,
`WACC`...) and known math function names (`Var`, `Cov`, `min`, `max`, `Pr`...) from counting as
prose — the earlier gate had neither exemption, so it rejected the whole clause as "too much
prose" before the formula ever reached the permissive check.

**Fix.** Gave `wordIsProse` the same two exemptions `isLatexSafe` already had, using
`KNOWN_FUNC_NAME_EXACT_RE` — an exact-anchored variant derived from the *same* source regex as
`KNOWN_FUNC_NAMES_RE`, not hand-duplicated (this project's established anti-drift convention).
No change to `stripLeadingLabel`, no change to how much text is sent to LaTeX — a pure
gate-consistency fix, not the "accept leading text, send everything to LaTeX" approach the
brief explicitly warned against.

**Also added** (the "conservative but not binary" ask): when a labeled clause's math still
can't safely convert — real prose mixed all through it, not just a clean label — the label is
now split into its own muted `.formula-label-plain` span ahead of the plain-text `.formula`
fallback, instead of one flat span mashing both together. This reuses only the
already-trusted `stripLeadingLabel` output, so it adds zero new math-detection risk.

**Before → after** (full diagnosis and the 3 specific formulas that moved from fallback to
real KaTeX are in `FORMULA_RENDER_AUDIT.md`'s "Report 6: mixed-formula-label bug" section):

| Metric | Before | After |
|---|---|---|
| Total formula clauses converted | 114 / 667 (17.1%) | 125 / 667 (18.7%) |
| Worked-example sentences converted | 61 / 1752 | 64 / 1752 |
| Render errors | 0 | 0 |

**Deliberately out of scope** (reasoned, not omitted): the token-alternating segmentation
heuristic for clauses with no clean `:`/` — ` separator, and extending `wrapNamedOperands` to
`[...]`-bracket operands (`E[net gain]`) — both documented in the audit file with the specific
evidence behind each call.

## Part 3 — extending the visual language (commits `67cd6fe`, `86b95d2`)

Reused exactly the four components Report 5 built (`gradient-card`, `icon-box`, `pill-badge`,
`kicker`) — no new UI component invented this pass.

**Learn's remaining content blocks** ("Core idea" and "Start from zero" already had this from
Report 5; the rest didn't):
- **Key formulas** (teal, formula-sheet icon), **When to use it** (green, a forward-arrow
  "apply" icon), **Intuition** (blue, a lightbulb) now get the same tinted-card + icon-box +
  kicker header treatment, via a new shared `.flow-item-tinted` base CSS class — mirrors
  `gradient-card`'s `--gc-tint`/`--gc-line` technique but kept on `.flow-item` since these stay
  full-width flow items, not an independent card grid. `flow-item-core` itself (Report 5,
  already shipped) was left untouched rather than folded into the new base, to avoid any risk
  of visual regression on a working rule.
- **Common trap** gets a genuinely distinct identity: a new calm amber `--warn` colour token
  (dark/light variants, same `-soft`/`-line`/`-ink` structure every other colour token uses),
  deliberately *not* the existing `--neg` red — that stays reserved for actual wrong-answer
  feedback elsewhere in the app, so a trap doesn't read as "you already got this wrong." Paired
  with the existing warning-triangle glyph (reused from the `mistakes` nav icon).
- **Worked examples** (green/blue/gold per level) and **Practice** (gold) already had this
  from Report 5 — confirmed unchanged, not regressed.

**Learn's unit index** (the A/B/C... row) read as flat grey circles with a CSS `.on` state
that nothing in the code ever actually toggled — genuinely dead styling. Wired it into
`updateSubIndex` (which already fires on every unit/concept navigation), and made the active
pill pick up the *current track's own* identity colour (`TRACK_COLOR_VAR`, the same map the
track picker already uses) instead of a hardcoded blue — confirmed visually distinct on quant
(blue), IB (gold), and WM (purple). Resting pills switched to the same neutral translucent fill
`pill-badge.neutral` already uses elsewhere, so they read as real pills, not dots.

**Drill / Pattern recognition / Mixed practice / Mocks** top-level headers were still the old
flat eyebrow-only `.panel-head`, while Mixed's own mode-selection cards already had the full
gradient-card treatment from Report 5 — an inconsistency within a single screen. Added a small
`panelHeader(iconName, text)` helper (icon-box + kicker, coloured by the current track, same
reuse as the unit index) and applied it to: Drill's "Configure drill", Pattern's "Pattern
recognition", Mixed practice's own header, and all 5 Mocks sub-panels (Speed Sprint, Wincent,
SIG, IMC, McKinsey Solve prep). Left secondary/in-session screens (mock results, pattern-run
feedback, individual question/check cards) on their existing plain treatment deliberately —
matches this project's established restraint principle for busy, repeated-many-times-per-
session UI (the same reasoning Report 5 used to keep individual practice-question cards flat).

**Known pre-existing gap, not touched:** the Mocks view has no mock format at all for the IB/
AM/WM/Consulting tracks beyond "Mock history" — Wincent/SIG/IMC/McKinsey are gated to
`track === 'quant'`, Speed Sprint to `track === 'reasoning'`. This is a content/feature gap,
not a styling inconsistency, and out of scope for a visual-language pass.

## Validation

- **(a)** `node -e "global.window=global; require('./js/app.js')"` — same documented
  pre-existing `ReferenceError: document is not defined` from the module's bottom-level
  `document.addEventListener('DOMContentLoaded', init)` call, unrelated to this session's
  changes (confirmed across 4 reports now).
- **(b)** Diagnostic re-run after the Part 2 fix: exactly 3 clauses moved from fallback to real
  KaTeX (all three named above), nothing else changed unexpectedly. Full breakdown in
  `FORMULA_RENDER_AUDIT.md`.
- **(c)** jsdom: opened Bayes' theorem, Total Probability, and Chain rule in Unit A (quant) and
  confirmed the label/formula split and full-KaTeX cards both render correctly side by side.
  A corpus-wide smoke test (`scratch_shot_content_blocks.js`) opened and checked every one of
  the 169 concepts across all 6 tracks for the new block-header markup on Key
  formulas/When/Intuition/Common trap — 0 missing. Playwright screenshots confirmed the visual
  result on quant, IB, and WM tracks, and on Drill/Pattern/Mixed/Mocks.
- **(d)** `git diff --stat` against every content file, empty on every commit in this session.
- **(e)** `scratch_verify_mixed_formula_labels.js` confirms the label + formula spans
  reconstruct the original text exactly (character for character) for a labeled fallback case,
  and that an unlabeled clause is completely unchanged. The existing
  `scratch_e2e_paragraphs.js` exact-text-reconstruction checks and the full existing E2E suite
  (formula rendering, worked-example inline formulas, concept-flow expand/collapse,
  cross-track rendering) were re-run after every change in this session and stayed green,
  except one already-confirmed pre-existing, unrelated failure (a track-switch generator-count
  restore check) reproduced identically via `git stash` against the pre-Report-6 commit.
- **(f)** Screenshotted at 375px (mobile), 768px (tablet), and 1440px (desktop): no horizontal
  overflow at any width (`scratch_width_multiviewport.js`: 0 overflows), KaTeX fractions wrap
  and shrink cleanly on mobile, and the tinted content-block cards stack single-column below
  900px exactly like the existing Core-idea/Key-formulas grid already did.

## Files changed

- `js/app.js` — formula-pipeline gate fix, `renderFormula` label-split, new
  `compass`/`bulb` icons, `.flow-item-tinted` markup for Key formulas/When/Intuition,
  `Common trap`'s new `blockIcon`, unit-index colour wiring + `on`-state toggle, new
  `panelHeader()` helper applied to Drill/Pattern/Mixed/Mocks headers, extended `QTL_APP`
  diagnostic exposure.
- `css/styles.css` — `.formula-label-plain`, new `--warn` colour token (both themes),
  `.flow-item-tinted` base + 3 modifiers, `.reveal.trap`/`.reading-block.trap` amber override,
  `.learn-index` active-state colour variables + neutral resting-pill treatment.
- `FORMULA_RENDER_AUDIT.md` — regenerated with the new conversion counts plus a dedicated
  before/after diagnosis section.
