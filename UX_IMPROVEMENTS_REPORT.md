# UX Improvements Report

Three targeted improvements on top of the existing product design (not a
redesign). All work is rendering/styling only — **zero content files were
touched** (verified via `git diff --stat` against every `bank*.js`,
`lessons*.js`, `gen-*.js`, and `formulas.js` file after each Mejora).

Status: **all 3 complete, validated, committed, and pushed.**

## Mejora 1 — Vivid blue in navigation only

Commit: `b70f848`

- Introduced a dedicated `--nav-*` CSS custom-property namespace
  (`--nav-bg`, `--nav-bg-2`, `--nav-text`, `--nav-text-dim`,
  `--nav-border`, `--nav-hover-bg`, `--nav-active-bg`,
  `--nav-active-text`), defined separately for dark and light themes, kept
  fully independent from `--brand` (structural navy) and `--accent`
  (achievement gold).
- Light mode: topbar/sidebar/mobile tabbar now render a vivid saturated
  blue (`#2563EB` family) with white text. Dark mode: nav uses a more
  saturated navy than the rest of the UI, same principle.
- Active sidebar/tab item uses a white pill (`--nav-active-bg` /
  `--nav-active-text`) so it stands out clearly against the vivid blue
  field.
- Content area (Learn primers, question text, panels) intentionally left
  untouched — still neutral/light in light mode, unchanged dark panels in
  dark mode. Verified via Playwright screenshots at 375px/1440px in both
  themes that vivid blue never bleeds into content cards.

## Mejora 2 — Digestible primer paragraphs

Commit: `bf565ef`

- Added `splitIntoSentences(text)` and `splitIntoDigestibleParagraphs(text)`
  in `app.js`: regex sentence-boundary detection (with an abbreviation
  blacklist) plus a topic-shift connector list ("Now", "Finally", "Here's",
  etc., drawn from the content's own existing vocabulary) to decide where a
  new paragraph starts; falls back to a length-based split (~400-500 chars)
  when no connector is found.
- `renderProse(text)` renders each paragraph as its own `<p class="prose-p">`,
  marking topic-shift paragraphs with a purely visual thin accent bar
  (`.prose-p.topic-shift`) — never new text.
- Applied to all long-form text renders: Learn primers, Learn check "why"
  reveals, runner/session-report "solution" reveals. `approach`/hint fields
  (short, inline) deliberately left as plain text.
- Increased line-height to 1.75 and capped primer width at 720px.
- **Exact-text-reconstruction invariant**: paragraphs keep their raw,
  untrimmed source slice in the data model, so
  `paragraphs.map(p => p.text).join('')` is byte-identical to the original
  string by construction. `renderProse` does not trim before rendering
  either (relies on the browser collapsing leading whitespace visually at
  block-box boundaries) — this was a real bug found and fixed during
  validation (see below).
- Validation: standalone reconstruction test across 484 primer/why/solution/
  approach/hint fields across every track (0 mismatches); jsdom E2E opening
  6 concepts across 6 different units confirming exact `textContent` match
  against source `c.primer` plus a no-mid-word/no-mid-number-break check
  (all pass); Playwright screenshot review of the Bayes' theorem primer at
  375px/1440px confirming no visible whitespace artifact.

## Mejora 3 — Continuous concept-flow narrative

Commit: `ed8904f`

- Rebuilt `viewLearn()`'s per-concept layout. Core idea / When to use it /
  Key formulas / Intuition are now one continuous `.concept-flow` card with
  soft internal dividers instead of four separate boxed panels.
- Hard uppercase section separators replaced with soft micro-transitions
  (`.concept-transition`, `.micro-label`) — small italic connector text
  ("Now that the pieces are in place", "Try it yourself") rather than
  aggressive labels that force a mental reset.
- Worked examples reveal progressively: Level 1 shown by default, a
  "Continue to Level N" button reveals the next level on click.
- Added a 4-step in-concept stepper (Context / Core / Examples / Practice)
  that jumps to that section within the currently open concept.
- Added "← Previous: [name]" / "Next: [name] →" footer buttons — clicking
  closes the current concept, opens the next/previous one, and scrolls it
  into view, so a user can move through a whole unit without returning to
  the index each time.
- Concept accordions are now mutually exclusive (opening one always closes
  any other open one), enforced both by the native `<summary>` toggle
  behavior and by the prev/next/sub-index navigation handlers.
- Added a concept-level sub-index (`.learn-subindex`) below the existing
  unit index: numbered dots for every concept in the active unit,
  highlighting whichever one is currently open — so the sticky lateral
  index now communicates both unit and concept position, not just unit.
- Fixed a latent bug surfaced by testing this: jsdom does not implement
  `Element.prototype.scrollIntoView` at all (unlike `window.scrollTo`,
  which it stubs with a warning). Added `smoothScrollTo(node)` — a
  `typeof` guard around every `scrollIntoView` call — used at all 3 call
  sites in `viewLearn`.

### Judgment calls (interpreting "considera" language from the brief)

Two suggestions in the brief were phrased as "consider," not as strict
requirements. Both were interpreted pragmatically rather than implemented
literally:

1. **Formulas interleaved at point of use in each example** — not
   implemented literally. Doing this safely would require guessing which
   formula applies to which specific example from content alone, which
   risks misrepresenting the material without ever touching the forbidden
   content files to verify. Instead, formulas are merged into the single
   continuous `.concept-flow` card immediately before the examples, so
   they're still adjacent to the examples that use them.
2. **Live scroll-spy highlighting for the concept stepper** — not
   implemented. The stepper is click-to-jump only. A scroll-spy
   (IntersectionObserver-based) version would add meaningful complexity and
   a source of flakiness across the jsdom test environment and real
   browsers alike, for a marginal UX gain over click-to-jump.

### Validation performed for Mejora 3

- `node -c js/app.js`: syntax OK
- `scratch_e2e_flow.js` (new): 7 checks — accordion-exclusivity, progressive
  example reveal, stepper targets resolve to real DOM ids, prev/next nav
  switches the open concept, sub-index highlights the active concept, no
  "Previous" on the first concept, no "Next" on the last. All pass.
- `scratch_e2e_redesign.js` (pre-existing full-app E2E suite): still passes
  unmodified.
- `scratch_e2e_paragraphs.js` (Mejora 2's test): still passes — confirms the
  DOM restructuring didn't affect paragraph-splitting correctness.
- `git diff --stat -- 'js/bank*.js' 'js/lessons*.js' 'js/gen-*.js' 'js/formulas.js'`:
  empty (zero content-file changes).
- Playwright visual QA at 375px and 1440px, dark and light themes: confirmed
  the concept-flow card, micro-transitions, progressive example reveal, and
  prev/next footer all render cleanly, with nav staying vivid and the
  content area staying neutral in both themes.

## Nothing remaining

All 3 Mejoras are implemented, validated per the brief's checklist (a-e),
committed, and pushed to `claude/quant-test-lab-architecture-ssa7xf`.
