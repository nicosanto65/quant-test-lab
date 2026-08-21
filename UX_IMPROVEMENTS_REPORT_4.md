# UX Improvements Report 4

A direct response to specific feedback on the previous pass (Report 3), given via a
reference screenshot and explicit written notes: expanded content blocks didn't reach the
right edge of their container while headers above them did; the content area still read as
flat and "seco" despite the nav's vivid blue; and formulas throughout the project — the
Formula/technique sheet especially — still rendered as plain black text merely larger than
the rest. All work is rendering/styling in `js/app.js` and `css/styles.css`. **Zero content
files were touched** — verified via `git diff --stat` against every `bank*.js`,
`lessons*.js`, `gen-*.js`, and `formulas.js` file before every commit, confirmed empty on
all five. No word of any primer, example, formula, solution, or check text was changed, and
no formula's mathematical value or meaning changed — only how everything renders.

Status: **all three problems (layout bug, formula coverage/presentation, general visual
composition) complete, validated, committed separately, and pushed.**

## Problem 1 — Expand-block width bug (commit `864e508`)

**Root cause**: `.reveal.primer`, `.reveal.prose-block`, and `.reading-block` carried
`max-width: 70ch` directly on the outer box — a rule from the previous pass meant purely as
an editorial reading-line-length cap, but it also shrank the entire card/accordion-group box
to ~773px against ~928px siblings (`.panel-head`, `.acc`, `.acc-body`) at the same level.
That's the literal mechanism behind "content doesn't reach the right edge."

**Fix**: moved the `70ch` cap off the outer wrapper and onto the paragraph-level elements
(`.prose-p`, and bare `<p>` inside the reading-block wrappers) instead. The box now correctly
fills its parent width; individual paragraphs of running text still cap their own line
length for reading comfort — the two no longer have to be the same width. Verified via
`getBoundingClientRect()` at 375px/768px/1440px: content width matches `.acc-body`'s inner
width exactly at all three, zero overflow anywhere, the "Collapse" toggle included.

**Also fixed in the same commit**: while visually confirming the width fix, a separate,
previously-unknown bug surfaced — `highlightKeyTerms`'s naive `/"[^"]{2,40}"/g` regex paired
quotes by nearest-neighbor retry, so a legitimate quoted question longer than 40 characters
(this dataset uses double quotes for both defined terms AND quoted rhetorical questions)
caused the regex to re-pair its own closing quote with the next unrelated opening quote,
producing a nonsensical highlight spanning two sentences (`" The "`). Quotes are now paired
by fixed position (1st+2nd, 3rd+4th, ...) found up front, so one oversized pair can't corrupt
every pairing after it.

## Problem 2 — Formula coverage and visual presentation (commits `8423cbf`, parts of `7678ff8`)

The brief's framing: KaTeX fixes the FORM of a formula but adds zero visual presence on its
own — both the conversion work and the container treatment are mandatory, neither substitutes
for the other. Both were addressed together, not sequenced.

**Coverage (2a/2b)**:
- The "Formula / technique sheet" view (`formulas.js` data) had never been wired through
  `renderFormula`/KaTeX at all in any previous pass — it was a plain click-to-expand
  accordion of monospace text, exactly the complaint singled out by name. `viewSheet()` now
  runs every item's body through the existing `renderFormula` pipeline: **55% of its 38
  entries convert to real KaTeX, 0 render errors** — higher than the formula-field's 17%
  since these bodies are mostly standalone "LHS = RHS" statements.
- New conservative inline-formula detection for worked examples: a read-only probe across
  the full dataset found 61 full-sentence formula candidates in worked-example text
  (calculation steps like `P(X=2) = C(4,2)(0.5)²(0.5)² = 0.375.`) versus only 11 across ALL
  of primer/core/when/intuition/trap/why/solution/approach combined — so detection is
  deliberately scoped to worked examples only, where the signal is real. General prose is
  left untouched: hunting for formula-shaped substrings mid-sentence in free-form text for
  negligible yield wasn't worth the regression risk to exact-text reconstruction. Reuses the
  exact same `parseFormulaSegment` gate the formula field already trusts, applied per
  sentence — only a sentence that independently passes gets substituted, every other
  sentence's raw text is preserved exactly (verified across all 507 worked examples in 6
  tracks, `scratch_e2e_worked_formulas.js`).

**Container treatment (2c, not deferred)**:
- `.formula-katex` bumped from 1.35em to **1.5em** (within the requested 1.4–1.6× range),
  plus a new left accent border alongside the existing tinted background/full border.
- New `.formula-sheet-grid` replaces the old accordion list with a real **grid of cards**
  (title on top, trigger context, large centered rendered formula) — the change most likely
  to shift the technique sheet from "boring reference list" to "useful, beautiful
  reference," per the brief's own framing. A scoped rule also gives the plain-text fallback
  real card presence within this one view, so nothing in it reads as bare monospace text in
  a gray box even for the 45% that don't convert.

**Audit**: `FORMULA_RENDER_AUDIT.md` regenerated from the real production parser, now
covering all three sites — 667 formula-field/technique-sheet clauses (114 converted, 17.1%),
1,752 worked-example sentences (61 converted, 3.5%), **0 render errors across 2,419 items**.

## Problem 3 — General visual composition (commits `7678ff8`, `f314a27`, `7dc1de1`)

Worked in the order the brief specified: 3a → 3c → 3d → 3e → 3b (2-column layout saved for
last as the riskiest for responsive breakage).

**3a — per-block-type identity**: "Start from zero" primer cards pick up a quiet blue left
border (foundational/context, the meaning blue already carries everywhere else). "Core idea"
gets its own compact, gold-tinted, bolder card — the one idea worth remembering, not just
more text in a list. Each worked-example level gets its own colour **extended to the whole
card**, not just the badge: green/blue/gold for L1/L2/L3, reusing the exact same semantic
the difficulty tags elsewhere in the app already use. Practice checks are now real bordered
cards that warm to gold on hover instead of bare question lines.

**3c — highlighting**: the lead-word at the start of every reading block now uses brand blue
instead of plain black-bold. (Key-term background highlighting was already in place from the
previous pass — confirmed working correctly, not re-implemented.)

**3d — hover/tap feedback**: real background shifts + ~1.2% scale (not subtle opacity) on
answer options and track cards. The per-card toggle CTA — "Continue reading" / "Collapse",
the single most-clicked control on the page — is now a real pill/badge with soft blue
background and generous padding instead of small plain-coloured text.

**3e — icons**: the top-level concept accordion's flat "+"/"−" swap is now a single chevron
that rotates 90° open. The per-card toggle picks up the same rotating chevron. Small inline
SVG icons (flag/target/layers, matching the existing icon language) now lead the
Context/Core/Examples breadcrumb steps; Practice reuses the existing check-mark icon. Track
icons were already in place from an earlier pass — confirmed, not re-done.

**3b — 2-column layout (last, riskiest)**: on desktop (≥900px) Core idea and Key formulas now
sit side by side — text explaining the idea on the left, the formula(s) that capture it on
the right. Content was reordered to Core → Formulas → When → Intuition so the paired items
are DOM-adjacent; below 900px it reverts to a single column in that same order, verified via
computed `grid-template-columns` resolving to one track at both 375px and 768px, and visually
via screenshot (no squeezed half-width formula boxes on a phone). Section transitions ("Now
that the pieces are in place") get a small brand-blue dot and a fading gradient hairline
instead of a flat line.

## Judgment calls (documented, not silently skipped)

- **Inline formula detection scoped to worked examples, not general prose** — a read-only
  probe found the signal was real in one place (61/1706 candidates) and negligible in the
  other (11/1802), so effort followed the evidence rather than attempting uniform coverage
  everywhere the brief listed as a possible site.
- **KaTeX kept self-hosted, not switched to a live CDN** — the brief's example wording said
  "via CDN," but self-hosting (already in place from the previous pass) is the stronger
  offline-first choice and already satisfies the underlying requirement (validation criterion
  f) more completely than a live CDN would.
- **The worked-example fallback list in `FORMULA_RENDER_AUDIT.md` is a count, not a full
  table** — 1,691 ordinary narrative sentences would have made the audit unreadable; the
  formula-field/technique-sheet fallback list (553 items) stays fully itemized since that's a
  manageable size and matches the previous report's format.
- **A pre-existing, unrelated test failure was found and left alone**: `scratch_e2e_am.js`
  and four sibling track scripts assert `S.allGenerators().length === 82 && S.curated().length
  === 60` after switching back to the quant track. This fails identically on the commit
  immediately before this session's work began (verified via `git stash`) — it's a stale
  hardcoded content-count assertion from an earlier pass, unrelated to any file this session
  touched, and fixing it would mean editing test expectations against content files, which is
  out of this session's scope either way.

## Validation performed (every commit)

- `node -c js/app.js`: syntax OK, every commit.
- `scratch_e2e_flow.js`, `scratch_e2e_paragraphs.js`, `scratch_e2e_expand_multitrack.js`,
  `scratch_e2e_redesign.js`, `scratch_e2e_formulas.js` (pre-existing suites): all still pass,
  every commit — bidirectional toggle, exact-text reconstruction, cross-track expand,
  full-app regression, zero visible KaTeX errors across 169 concepts.
- `scratch_verify_quote_fix.js` (new): confirms the quote-pairing fix on the exact concept
  that exposed the bug, real terms still highlighted, exact-text reconstruction holds.
- `scratch_e2e_worked_formulas.js` (new): every non-formula sentence across all 507 worked
  examples in 6 tracks survives verbatim; every formula-eligible sentence gets real KaTeX;
  live DOM check confirms it reaches the page; 0 visible errors.
- `scratch_verify_chevron.js` (new): confirms the chevron icon survives the toggle's
  `textContent` update (the bug that would have silently deleted it), `aria-expanded` flips
  correctly on click.
- `scratch_width_multiviewport.js` (new): re-run after every subsequent commit — 375px/
  768px/1440px, zero overflow, content width matches parent exactly, at every stage.
- `scratch_gen_formula_audit.js` re-run to produce the final `FORMULA_RENDER_AUDIT.md`: 2,419
  items checked across all three formula-rendering sites, 0 errors.
- `scratch_test_offline.js` (pre-existing): re-run at the end — network fully cut after one
  online visit, both custom fonts + all 20 KaTeX font files + KaTeX CSS/JS + a live rendered
  formula all confirmed working entirely from Cache Storage.
- `git diff --stat` against every content file: empty, on every commit.
- Playwright visual QA at 375px/1440px: width fix, quote-highlighting fix, technique-sheet
  grid, per-level worked-example colours, the gold Core-idea card, the 2-column desktop
  layout collapsing correctly to 1-column mobile, and the pill CTA/chevron all confirmed by
  screenshot.

## Nothing remaining

Problem 1 (layout bug), Problem 2 (formula coverage + container treatment, 2a/2b/2c), and
Problem 3 (3a–3e, all five sub-parts including the 2-column layout) are complete, validated
per the brief's checklist (a–f), committed separately in the brief's specified order, and
pushed to `claude/quant-test-lab-architecture-ssa7xf`.
