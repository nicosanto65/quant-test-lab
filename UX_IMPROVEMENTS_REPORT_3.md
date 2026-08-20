# UX Improvements Report 3

A more ambitious quality pass on top of every previous one: real editorial typography,
bidirectional expand/collapse, real math typesetting via KaTeX, and deliberate color
presence throughout Learn's content — not just its navigation. All work is rendering/
styling in `js/app.js`, `css/styles.css`, `index.html`, plus the two supporting
infrastructure files the brief's own requirements made unavoidable (`sw.js`, for the
offline-caching requirement explicitly stated in validation criterion (f); `vendor/katex/`
and `fonts/`, the self-hosted asset files those caching requirements point at). **Zero
content files were touched** — verified via `git diff --stat` against every `bank*.js`,
`lessons*.js`, `gen-*.js`, and `formulas.js` file before every commit. No word of any
primer, example, formula, solution, or check text was changed — only how it renders.

Status: **all 4 Mejoras complete, validated, committed separately, and pushed.**

## Mejora B — Bidirectional expand/collapse (commit `5575673`)

Fixed the one-directional accordion from the previous pass.

- Every block's toggle button now works both ways: collapsed, it's the full-width "preview
  text + Continue reading" row; open, it shrinks to a quiet top-right "− Collapse"
  affordance instead of disappearing.
- Cumulative-by-default is unchanged (`CUMULATIVE_EXPAND = true`): opening a card never
  auto-collapses another. Collapsing is purely manual and per-card — it never touches
  siblings, and in the sequential worked-example accordion, collapsing an earlier level
  doesn't re-lock a later one that was already unlocked.
- Added a group-level "Expand all / Collapse all" control, rendered once per multi-card
  group: "Expand all" opens and unlocks every card (including sequential ones); "Collapse
  all" resets to the just-rendered state.

## Mejora A — Real editorial typography (commit `cfa54f6`)

Debugged the actual rendered font first, as the brief asked. A real Linux/Chromium render
(`getComputedStyle` + `document.fonts`) showed the previous system-font stack
(`-apple-system`/`Segoe UI`/`Roboto`) resolving to none of those names and silently falling
through to the browser's generic sans-serif default — Liberation Sans, the exact
metric-compatible Arial substitute Word/LibreOffice use on Linux. That's the literal
mechanism behind "looks like an exported Word doc": a system stack only looks considered on
the platform it was tuned for, not a guarantee everywhere.

- Self-hosted two real webfonts as local `.woff2` files under `/fonts` (fetched once from
  Google Fonts' CDN during this session, not linked live): **Inter** (48KB) as the new
  `--font-body`/UI face, **Source Serif 4** (120KB) as a new `--font-serif`. Self-hosted
  rather than a live CDN `<link>` — zero network dependency even on first load, and each is
  a single variable-font file covering the whole 400–700 weight range.
- `--font-serif` applied only to Learn concept titles (a new `.concept-title` span, scoped
  so the mistakes-log accordion — which reuses the same `.acc` component — stays in the UI
  sans font) and to a new lead-in treatment on each primer's opening sentence.
- Reading blocks (primer/solution/why/trap) now render at 17.5px/1.8 line-height instead of
  the 15px UI body size, with max-width changed from a flat 720px to `70ch` (capped in
  character units, the ~65–75-characters-per-line editorial convention). Confirmed no
  `text-align: justify` exists anywhere in the stylesheet; text stays explicitly left-aligned.
- New `renderLeadInParagraph()`: wraps the first sentence of a primer's opening paragraph in
  a larger serif `.lead-in` span, with that sentence's own first word carrying extra weight
  (`.lead-word`) — a quiet visual entry point, purely rendering, reconstructing the source
  string exactly.
- `sw.js` bumped to `qtl-v2`→`v3` across this pass and extended to cache both font files,
  verified with a real offline test (network fully cut via Playwright, confirmed both fonts
  report `status: "loaded"` from cache alone).

## Mejora D — Real math typesetting via KaTeX (commit `098a8da`)

The most important piece of this pass. Formulas previously rendered as flat monospace text.

- Self-hosted KaTeX 0.18.4 under `vendor/katex/` (fetched from npm, not a live CDN — same
  reasoning as the fonts): `katex.min.js`, a trimmed `katex.min.css` (woff2-only font
  references — the woff/ttf fallbacks a full install ships are never needed by any browser
  capable of running this app), and the 20 `.woff2` math fonts (~600KB total). `sw.js`
  caches all of it, verified end-to-end offline (network fully cut, confirmed a formula
  still renders as real KaTeX typesetting from cache alone).
- A conservative text→LaTeX heuristic parser in `app.js` (~250 lines): detects unicode
  super/subscripts, Greek letters, Σ/√/±/≤/≥/≠/∈/∪/∩/etc., `a/b` fractions, `P(A|B)`
  conditional-bar notation, and named-quantity operands ("Operating margin = operating
  income / revenue" — common in the finance tracks, wrapped in `\text{}` the way textbooks
  do it). Every clause is independently gated before conversion is attempted, the finished
  LaTeX is checked once more, and it's actually run through `katex.renderToString` before
  being trusted — anything that fails, at any stage, falls back to the original plain
  monospace text for that clause specifically. Never a visible rendering error, never a
  silently-wrong formula.
- Built and iterated against every formula in the actual dataset (491 strings, 667
  independent clauses: every concept's `formulas` field across all 6 tracks, plus
  `formulas.js` as an additional read-only stress-test corpus). That process caught and
  fixed 5 real correctness bugs before this was trustworthy: a fraction converter that
  could mis-match across unrelated parenthesized groups, a fraction that could silently
  drop a trailing exponent's scope, compound abbreviations misread as literal division
  ("Forward P/E"), a stripped "aside" that actually truncated real formula content
  ("Call intrinsic value = max(...)" losing its own argument), and several missing Unicode
  superscript/subscript glyphs. Final state: **114/667 clauses (17%) convert to real
  KaTeX, 553 fall back cleanly, 0 render errors** — documented clause by clause in
  `FORMULA_RENDER_AUDIT.md`.
- Rendered formulas get real visual presence: a centered block with a distinct tinted
  background (new `--formula-bg`/`--formula-line` tokens), generous padding, and 1.35×
  body font-size. Wired into the "Key formulas" list in Learn's concept-flow (the brief's
  explicit priority target); `formulas.js`'s own view left untouched, matching the brief's
  framing of that file as read-only test data.

## Mejora C — Real color presence in content (commit `90a790e`)

- **Key-term highlighting**: a new `highlightKeyTerms()` wraps every `"quoted phrase"` in a
  primer in a soft-blue `.key-term` span — this dataset already uses double quotes as its
  own convention for marking a term right as it's defined, so this is pure rendering on an
  existing pattern, not new vocabulary.
- **Three-way section color-coding**, extending the left-border-accent language `.reveal`
  already used: brand blue on the Core/When/Formulas/Intuition card, a new **teal** accent
  on worked-example cards and their "Level N" labels, and the existing achievement **gold**
  on the practice/checks zone — so scrolling past each section reads as "now in examples" /
  "now in practice" by color alone.
- **Progress breadcrumb**: the concept stepper picks up achievement gold once a concept has
  been studied, live the moment a practice check is answered.
- Confirmed two completion states the brief called out were already in place from earlier
  work: the studied-dot and the correct-answer highlight both already used gold.

### Judgment calls (documented, not silently skipped)

- **No external font CDN, self-hosted instead** (Mejora A) — the brief explicitly offered
  self-hosting as the way to avoid the offline-first risk of a live CDN; taken deliberately.
- **No section icons** (Mejora C) — the brief's other suggested mechanism for "recognize a
  section without reading the label." Color-coding alone delivers that outcome without
  designing and wiring a new icon set; flagged here since it was explicitly mentioned and
  deliberately not built.
- **No inline formula detection inside primer/solution/why prose** (Mejora D) — the brief
  explicitly framed this as secondary ("de forma secundaria... si el parser las detecta con
  confianza"), lower-value than the primary `formulas` field target, and meaningfully
  harder (detecting a formula-shaped substring mid-sentence in free-form prose, vs. an
  already-isolated array entry). Left for a future pass.
- **`sw.js` and `vendor/`/`fonts/` touched** despite not being in the brief's explicit
  editable-files list — neither is a content file (not in the prohibited list), and editing
  `sw.js` was the only way to satisfy the brief's own explicit validation criterion (f)
  about caching new assets for offline use.

## Validation performed (every commit)

- `node -c js/app.js` and `node -c sw.js`: syntax OK.
- `scratch_e2e_flow.js`: 13 checks (bidirectional toggle, expand-all/collapse-all, primer
  accordion, sequential worked-example accordion, prev/next nav, sub-index, stepper) — all
  pass.
- `scratch_e2e_paragraphs.js` / `scratch_e2e_expand_multitrack.js`: exact-text
  reconstruction across quant + am, 6 concepts, every collapsed card actually clicked open
  and compared character-for-character against source — including, after Mejora C, primers
  that now contain quoted key-terms and a lead-in span, confirming neither changed a single
  character of the underlying text.
- `scratch_e2e_formulas.js` (new): opens Learn on all 6 tracks, checks all 169 concepts
  that have a `formulas` field (well past the brief's 8-concept minimum), confirms zero
  visible `.katex-error` spans and zero empty formula blocks.
- `scratch_e2e_redesign.js` (pre-existing full-app suite): still passes unmodified.
- `scratch_test_offline.js` (new): a real browser, network fully cut after one online
  visit — confirms both custom fonts, KaTeX's CSS/JS/20 font files, and a live rendered
  formula all work entirely from Cache Storage.
- `git diff --stat` against every content file: empty, on every commit.
- Playwright visual QA at 375px/1440px, dark/light: confirmed the collapse affordance,
  Inter/Source Serif 4 actually rendering (via `document.fonts`), typeset formulas sitting
  correctly next to plain-text fallbacks in the same list with `overflow-x: auto` protecting
  mobile layout, and the blue/teal/gold section coding reading coherently without bleeding
  into the vivid nav-only blue from an earlier pass.

## Nothing remaining

All 4 Mejoras are implemented, validated per the brief's checklist (a–f), committed
separately, and pushed to `claude/quant-test-lab-architecture-ssa7xf`.
