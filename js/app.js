/* QUANT TEST LAB — application shell, session runner and views. */
(function (global) {
  'use strict';
  const S = global.QTL_STORE, U = global.QTL_UTIL;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  };
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const smoothScrollTo = (node) => { if (node && typeof node.scrollIntoView === 'function') node.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const fmtTime = (sec) => {
    sec = Math.max(0, Math.round(sec));
    const m = Math.floor(sec / 60), s = sec % 60;
    return m + ':' + String(s).padStart(2, '0');
  };

  /* ------------------------- digestible-paragraph rendering ------------------------ */
  /* Splits a long, dense block of prose into shorter <p> paragraphs at natural sentence
     boundaries, purely for rendering — the underlying string is never modified, only how
     it is chunked into DOM nodes. Two rules, applied in order per sentence:
       1. Start a new paragraph when the sentence begins with a recognisable topic-shift
          connector ("Now," "Finally," "Here's the trick," etc.) — this is the same
          convention writers already lean on in this content, so it needs no invented
          vocabulary, only detection.
       2. Otherwise (a primer with long unbroken run-on sentences and no such connector),
          fall back to breaking every ~3 sentences or ~480 characters, whichever comes
          first, so no paragraph runs unreasonably long. */
  const SENTENCE_SPLIT_RE = /[.!?]+['")\]]?(?=\s+[A-Z(])/g;
  const ABBREV_TAIL_RE = /\b(e\.g|i\.e|etc|vs|approx|fig|eqs?|resp|cf|no|dr|mr|mrs|ms|st|vol|ch|pp|op|art|ref)\.$/i;
  function splitIntoSentences(text) {
    if (!text) return [];
    const parts = [];
    let start = 0, m;
    SENTENCE_SPLIT_RE.lastIndex = 0;
    while ((m = SENTENCE_SPLIT_RE.exec(text))) {
      const endIdx = m.index + m[0].length;
      const window = text.slice(Math.max(0, m.index - 8), endIdx);
      if (ABBREV_TAIL_RE.test(window)) continue; // false boundary, e.g. "e.g. Two flips..."
      parts.push(text.slice(start, endIdx));
      start = endIdx;
    }
    if (start < text.length) parts.push(text.slice(start));
    return parts;
  }
  const TOPIC_SHIFT_RE = /^\s*(Now|Finally|Here'?s?|Next,?|However,?|So,?|This means|In other words|For example|Notice|Crucially|Importantly|The key|Once you|As a result|In practice|Putting (it|this) together|To see why|Consider|Recall|Contrast this|A useful|The single|Rather than|Because of this|Given this|In short|The upshot)\b/;
  /* Each paragraph keeps its EXACT raw slice of the source string (including whatever
     whitespace sat between sentences) — trimming only happens later, purely for display.
     That means paras.map(p => p.text).join('') always reconstructs the original text
     character-for-character; nothing is ever dropped or invented, only re-chunked. */
  function splitIntoDigestibleParagraphs(text) {
    if (!text) return [];
    const sentences = splitIntoSentences(text);
    if (sentences.length <= 1) return sentences.length ? [{ text: sentences[0], shift: false }] : [];
    const paras = [];
    let cur = '', curLen = 0, curCount = 0, curShift = false;
    sentences.forEach((raw) => {
      const trimmed = raw.replace(/^\s+/, '');
      const isShift = TOPIC_SHIFT_RE.test(trimmed);
      const shouldBreak = cur && (isShift || curCount >= 3 || curLen >= 480);
      if (shouldBreak) {
        paras.push({ text: cur, shift: curShift });
        cur = ''; curLen = 0; curCount = 0; curShift = false;
      }
      if (!cur && isShift) curShift = true;
      cur += raw; curLen += raw.length; curCount++;
    });
    if (cur) paras.push({ text: cur, shift: curShift });
    return paras;
  }
  /* Renders long prose as digestible paragraphs; short text (a single check's "why",
     a brief hint) just gets one plain <p> so nothing is over-engineered for a one-liner.
     Deliberately NOT trimmed: any boundary whitespace a paragraph inherits from the
     original sentence split is left in the text node. A browser collapses leading
     whitespace at the start of a block box for display (so it's visually invisible),
     while textContent (and this app's own concatenation check) still sees the exact,
     unmodified source characters — no word or space is ever added or dropped. */
  /* Flat variant with no accordion — every paragraph as a plain <p>, never wrapped in
     expand-cards. Used inside content that is already someone else's expand-card body (a
     worked example's own text, nested inside the Level 1/2/3 sequential accordion): nesting
     a second independent accordion inside an already-collapsible block would just stack two
     layers of "click to reveal" on top of each other for no reason. */
  /* Worked examples are full of standalone calculation-step sentences that are themselves
     complete formulas ("P(X=2) = C(4,2)(0.5)²(0.5)² = 6 × 0.25 × 0.25 = 0.375."). A read-only
     probe across the real dataset found 61 such full-sentence candidates inside worked
     examples versus only 11 across ALL of primer/core/when/intuition/trap/why/solution/
     approach combined — so inline detection is deliberately scoped to worked examples only:
     the tradeoff (a substituted sentence's rendered .textContent is no longer character-
     identical to its source, by design — a KaTeX-typeset fraction has no literal "/") isn't
     worth taking on the huge, low-yield surface of free-form prose. Reuses the exact same
     parseFormulaSegment gate the "formulas" field and the technique sheet already trust:
     only whole sentences that independently pass it get substituted; every other sentence,
     unchanged, keeps its exact source text (parseFormulaSegment is defined further down this
     file — safe to reference here, function declarations are hoisted within the module). */
  function renderTextWithInlineFormulas(text) {
    const sentences = splitIntoSentences(text);
    if (!sentences.length) return esc(text);
    return sentences.map((raw) => {
      const leadWS = (raw.match(/^\s+/) || [''])[0];
      const core = raw.slice(leadWS.length);
      const trailMatch = core.match(/([.!?]+['")\]]?)$/);
      const trailPunct = trailMatch ? trailMatch[0] : '';
      const mathPart = trailPunct ? core.slice(0, core.length - trailPunct.length) : core;
      if (!mathPart.trim()) return esc(raw);
      const parsed = parseFormulaSegment(mathPart.trim());
      if (!parsed) return esc(raw);
      const labelHtml = parsed.label ? `<span class="formula-label">${esc(parsed.label)}</span>` : '';
      const trailHtml = parsed.trail ? `<span class="formula-note">${esc(parsed.trail)}</span>` : '';
      return `${esc(leadWS)}<span class="formula-katex-wrap">${labelHtml}<span class="formula-katex">${parsed.html}</span>${trailHtml}</span>${esc(trailPunct)}`;
    }).join('');
  }
  function renderPlainProseWithFormulas(text) {
    text = text || '';
    if (text.length < 260) return `<p>${renderTextWithInlineFormulas(text)}</p>`;
    const paras = splitIntoDigestibleParagraphs(text);
    return paras.map((p) => `<p class="prose-p${p.shift ? ' topic-shift' : ''}">${renderTextWithInlineFormulas(p.text)}</p>`).join('');
  }
  /* Editorial lead-in: wraps the first SENTENCE of a paragraph's raw text in a larger
     serif span, with that sentence's own first WORD carrying extra weight inside it — a
     quiet visual entry point into a reading block, the way a considered publication opens
     a piece. Reconstructs the exact source string: leadWhitespace + firstWord + afterWord
     is exactly the raw first sentence (splitIntoSentences includes any leading whitespace
     it inherited from the previous split), and first + rest is exactly rawText — nothing
     is trimmed, added, or reordered, only re-wrapped in spans. */
  /* Wraps "quoted phrases" in a colored .key-term span — this dataset already uses double
     quotes as its own convention for marking a term right as it's being defined (Mejora C:
     "detectando el patrón de comillas dobles... que ya usa el contenido para marcar
     definiciones"). Pure rendering: every character of the source, including the quote
     marks themselves, passes through esc() untouched — only wrapped in a span, nothing
     added, removed, or reordered, so this never affects the exact-text-reconstruction
     guarantee the paragraph splitter already relies on.
     Quotes are paired by POSITION (1st+2nd, 3rd+4th, ...), never by nearest-neighbor regex
     retry: this text also uses double quotes for quoted questions ('"how much did the
     company earn... on paper?"'), which routinely run past the ~40-char "this is a term"
     length. A naive /"[^"]{2,40}"/g regex that fails to match a too-long legitimate pair
     doesn't skip it — it retries from that pair's own closing quote, which then wrongly
     pairs with the NEXT unrelated opening quote and corrupts every pairing after it (e.g.
     misreading the boundary between two sentences as a highlighted term reading '" The "').
     Finding every quote index up front and pairing them in fixed (even, odd) order keeps
     parity correct regardless of how long any individual pair's content is; a pair is only
     rendered as a highlight when its content also satisfies the original length/shape
     bounds, otherwise both its quote characters are left as plain text. */
  function highlightKeyTerms(rawText) {
    const idx = [];
    for (let i = 0; i < rawText.length; i++) if (rawText[i] === '"') idx.push(i);
    let out = '', last = 0;
    for (let p = 0; p + 1 < idx.length; p += 2) {
      const start = idx[p], end = idx[p + 1];
      const contentLen = end - start - 1;
      if (contentLen < 2 || contentLen > 40) continue;
      out += esc(rawText.slice(last, start));
      out += `<span class="key-term">${esc(rawText.slice(start, end + 1))}</span>`;
      last = end + 1;
    }
    out += esc(rawText.slice(last));
    return out;
  }
  function renderLeadInParagraph(rawText, shift, highlight) {
    const escRest = highlight ? highlightKeyTerms : esc;
    const sentences = splitIntoSentences(rawText);
    const cls = `prose-p${shift ? ' topic-shift' : ''}`;
    if (!sentences.length) return `<p class="${cls}">${escRest(rawText)}</p>`;
    const first = sentences[0];
    const rest = rawText.slice(first.length);
    const trimmedFirst = first.replace(/^\s+/, '');
    const leadWhitespace = first.slice(0, first.length - trimmedFirst.length);
    const wordMatch = trimmedFirst.match(/^\S+/);
    const firstWord = wordMatch ? wordMatch[0] : '';
    const afterWord = trimmedFirst.slice(firstWord.length);
    const leadHtml = `${esc(leadWhitespace)}<span class="lead-in"><span class="lead-word">${esc(firstWord)}</span>${escRest(afterWord)}</span>`;
    return `<p class="${cls}">${leadHtml}${escRest(rest)}</p>`;
  }
  function renderProse(text, options) {
    options = options || {};
    text = text || '';
    const escFn = options.highlightTerms ? highlightKeyTerms : esc;
    if (text.length < 260) {
      return options.leadIn ? renderLeadInParagraph(text, false, options.highlightTerms) : `<p>${escFn(text)}</p>`;
    }
    const paras = splitIntoDigestibleParagraphs(text);
    if (paras.length <= 1) {
      return paras.map((p) => options.leadIn
        ? renderLeadInParagraph(p.text, p.shift, options.highlightTerms)
        : `<p class="prose-p${p.shift ? ' topic-shift' : ''}">${escFn(p.text)}</p>`).join('');
    }
    return renderExpandableBlocks(paras, { mode: 'toggle', leadIn: options.leadIn, highlightTerms: options.highlightTerms });
  }

  /* ---------------------- expandable block accordion (Mejora A) -------------------- */
  /* Renders a set of blocks as independent cards — each with its own background, padding
     and margin, never one shared box — with the first card open and every later one
     collapsed behind a short preview. One reusable component behind every long-form field
     in the app (primer, worked examples, long solution/why), so they all get the same
     accordion behaviour instead of a bespoke implementation per field.
     CUMULATIVE_EXPAND controls what happens when a new card opens in 'toggle' mode: true
     (default) leaves every previously opened card visible, so a reader can scroll back up
     through everything already read. Flip this one constant to collapse others instead. */
  const CUMULATIVE_EXPAND = true;
  let expandGroupSeq = 0;
  function previewWords(text, n) {
    n = n || 8;
    const words = String(text || '').trim().split(/\s+/).filter(Boolean);
    if (words.length <= n) return words.join(' ');
    return words.slice(0, n).join(' ') + '…';
  }
  /* blocks: array of { text, shift?, bodyHtml?, preview?, ctaLabel?, collapseLabel? }.
     bodyHtml/preview let a caller (worked examples) supply already-rendered markup and a
     hand-picked preview instead of plain escaped paragraph text; otherwise the body is one
     <p class="prose-p"> and the preview is auto-derived from the block's own first words.
     options.mode: 'toggle' (default) — every collapsed card opens independently, in any
     order. 'sequential' — a card stays locked (no preview, not interactive) until the one
     before it has been opened, for content that only makes sense read in order.
     Every card's single toggle button works both directions: click to open, click again
     (its label swaps to "− Collapse") to close it, in any order, regardless of what else
     in the group is open — the delegated handler below (handleExpandGroupClick) owns that
     behaviour so nothing here needs live DOM references. A 2+ block group also gets an
     "Expand all / Collapse all" control for skimming vs. reading everything at once. */
  function renderExpandableBlocks(blocks, options) {
    options = options || {};
    const mode = options.mode || 'toggle';
    const groupId = 'eg' + (++expandGroupSeq);
    const cardsHtml = blocks.map((b, i) => {
      const open = i === 0;
      // in sequential mode the very next block stays visible (collapsed, with its own
      // preview + toggle) so the reader can see what's coming; only blocks further out
      // are fully locked away until their turn
      const locked = mode === 'sequential' && i > 1;
      const body = b.bodyHtml !== undefined ? b.bodyHtml
        : (i === 0 && options.leadIn) ? renderLeadInParagraph(b.text, b.shift, options.highlightTerms)
        : `<p class="prose-p${b.shift ? ' topic-shift' : ''}">${(options.highlightTerms ? highlightKeyTerms : esc)(b.text)}</p>`;
      const preview = b.preview !== undefined ? b.preview : previewWords(b.text);
      const expandLabel = b.ctaLabel || 'Continue reading';
      const collapseLabel = b.collapseLabel || 'Collapse';
      const cls = ['expand-card', open ? 'open' : 'collapsed', locked ? 'locked' : '', b.cardClass || ''].filter(Boolean).join(' ');
      return `<div class="${cls}" data-idx="${i}">
          <button class="expand-toggle" type="button" data-expand-toggle
            data-expand-label="${esc(expandLabel)}" data-collapse-label="${esc(collapseLabel)}"
            aria-expanded="${open}" tabindex="${locked ? '-1' : '0'}">
            <span class="expand-preview-text">${esc(preview)}</span>
            <span class="expand-cta"><span class="expand-cta-label">${esc(open ? collapseLabel : expandLabel)}</span><i class="expand-chevron">&#8250;</i></span>
          </button>
          <div class="expand-body">${body}</div>
        </div>`;
    }).join('');
    const allControls = blocks.length > 1
      ? `<div class="expand-all-controls">
          <button type="button" class="expand-all-btn" data-expand-all>Expand all</button>
          <span class="expand-all-sep">·</span>
          <button type="button" class="expand-all-btn" data-collapse-all>Collapse all</button>
        </div>`
      : '';
    return `<div class="expand-group" data-eg="${groupId}" data-mode="${esc(mode)}">${cardsHtml}${allControls}</div>`;
  }
  /* Short text gets the old single "callout" box (a colored, left-bordered card — fine for
     one or two sentences). Long text drops that shared box in favour of the independent
     cards above; the box would otherwise just nest a second frame around content that
     already frames itself, so it's dropped in exactly this case, not removed everywhere. */
  function renderReadingBlock(eyebrowLabel, text, extraClass, idAttr, options) {
    text = text || '';
    const cls = extraClass ? ' ' + extraClass : '';
    const idStr = idAttr ? ` id="${esc(idAttr)}"` : '';
    const eyebrow = eyebrowLabel ? `<span class="eyebrow">${esc(eyebrowLabel)}</span>` : '';
    const prose = renderProse(text, options);
    if (text.length < 260) return `<div class="reveal${cls}"${idStr}>${eyebrow}${prose}</div>`;
    return `<div class="reading-block${cls}"${idStr}>${eyebrow}${prose}</div>`;
  }

  /* ============================= formula rendering (Mejora D) ============================
     A conservative text->LaTeX heuristic converter for the "formulas" field, rendered with
     KaTeX. This NEVER touches source content — every formula string from lessons*.js is
     read exactly as written; only how it is drawn to the screen changes. The conversion is
     deliberately cautious: every clause is independently gated on "does this look like
     clean, self-contained math" before conversion is even attempted, and the finished LaTeX
     is checked once more (isLatexSafe) and actually run through katex.renderToString before
     being trusted — any clause that fails either check, or that KaTeX itself rejects, falls
     back to the original plain monospace rendering for that clause specifically. A single
     formula string can end up as a mix of both: some clauses rendered as real typeset math,
     others as clean text, exactly matching the brief's "simple formula shown well beats a
     complex one converted wrong." See FORMULA_RENDER_AUDIT.md for the full corpus this was
     tested against (491 formulas from every track's lessons*.js plus formulas.js). */

  // ---- "is this clean math" gate ----
  const ALLOWED_WORDS = new Set([
    'a', 'an', 'the', 'of', 'in', 'on', 'to', 'for', 'if', 'is', 'are', 'at', 'by', 'or', 'and',
    'when', 'where', 'all', 'any', 'no', 'not', 'per', 'with', 'from', 'as', 'provided', 'always',
    'never', 'matches', 'same', 'other', 'out', 'each'
  ]);
  function wordIsProse(w) {
    const lower = w.toLowerCase();
    if (ALLOWED_WORDS.has(lower)) return false;
    return /^[a-zA-Z]{3,}$/.test(w);
  }

  // ---- named-quantity operands ("Operating margin = operating income / revenue") ----
  // Finance/applied formulas in this dataset routinely use full English phrases as variable
  // names instead of single letters — legitimate, well-formed math notation (textbooks do
  // the same with \text{} in LaTeX). STOP_WORDS is a blacklist of grammar words that only
  // show up in real sentences, never in a named quantity like "operating income" — any
  // phrase containing one aborts the WHOLE segment rather than risk wrapping a sentence
  // fragment in \text{}.
  const STOP_WORDS = new Set([
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'the', 'this', 'that', 'these', 'those',
    'always', 'never', 'since', 'while', 'whenever', 'when', 'where', 'which', 'who', 'whom',
    'because', 'so', 'than', 'then', 'thus', 'hence', 'therefore', 'however', 'although', 'though',
    'if', 'unless', 'until', 'before', 'after', 'during', 'between', 'within', 'without', 'about',
    'above', 'below', 'under', 'over', 'through', 'across', 'against', 'toward', 'towards',
    'upon', 'onto', 'into', 'not', 'no', 'none', 'any', 'all', 'each', 'every', 'some', 'much',
    'many', 'more', 'most', 'less', 'least', 'very', 'quite', 'rather', 'just', 'only', 'also',
    'too', 'as', 'such', 'you', 'your', 'it', 'its', 'they', 'their', 'we', 'our', 'i', 'he', 'she',
    'can', 'could', 'should', 'would', 'will', 'shall', 'must', 'may', 'might', 'do', 'does', 'did',
    'have', 'has', 'had', 'and', 'or', 'but', 'yet', 'nor'
  ]);
  // NOTE: plain ASCII '-' is deliberately excluded from the boundary class below (unlike the
  // unicode minus '−', which this dataset uses for actual subtraction) — this dataset uses
  // ASCII hyphens inside compound terms ("10-year", "next-12-months", "risk-free"), and
  // treating '-' as an operator boundary here would fracture those mid-word.
  const PHRASE_RE = /(?:^|[=/×÷·+−(])\s*([A-Za-z][A-Za-z0-9'-]*(?:\s+[A-Za-z][A-Za-z0-9'-]*){0,5})\s*(?=[=/×÷·+−)]|$)/g;
  // A lone single-letter/short token ("n", "x", "Rf", "Rm") is almost always a math variable
  // or a 2-3-char abbreviation and must stay bare, italic — only a lone word that's actually
  // spelled out (4+ letters, and not ALL-CAPS the way a ticker/acronym like GDP or YTM is)
  // gets wrapped on its own.
  function isWrappableSingleWord(w) {
    return w.length >= 4 && /[a-z]/.test(w);
  }
  function wrapNamedOperands(s) {
    let aborted = false;
    const out = s.replace(PHRASE_RE, (m, phrase) => {
      if (aborted || !phrase) return m;
      const words = phrase.trim().split(/\s+/);
      if (words.length === 1 && !isWrappableSingleWord(words[0])) return m;
      const hasStopWord = words.some((w) => STOP_WORDS.has(w.toLowerCase()));
      if (hasStopWord || words.length > 6) { aborted = true; return m; }
      const lead = m.slice(0, m.indexOf(phrase));
      return `${lead}\\text{${phrase.trim()}}`;
    });
    return aborted ? null : out;
  }
  // prose-word gate, but blind to anything already wrapped in \text{...} — those are
  // intentional named operands, not stray sentence prose
  function countProseWordsOutsideText(s) {
    const withoutTextSpans = s.replace(/\\text\{[^}]*\}/g, ' ');
    const words = withoutTextSpans.match(/[a-zA-Z]{3,}/g) || [];
    return words.filter(wordIsProse).length;
  }

  // ---- unicode -> LaTeX token conversion ----
  const SUPERSCRIPT_MAP = {
    '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
    'ⁿ': 'n', 'ⁱ': 'i', 'ᵏ': 'k', 'ᵗ': 't', 'ᶜ': 'c', 'ʳ': 'r', 'ᴺ': 'N', '⁺': '+', '⁻': '-',
    'ᵞ': '\\gamma '
  };
  const SUBSCRIPT_MAP = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9', 'ᵢ': 'i', 'ⱼ': 'j', 'ₖ': 'k', 'ₙ': 'n', 'ₓ': 'x', 'ₜ': 't', 'ₐ': 'a' };
  const GREEK_MAP = {
    'α': '\\alpha', 'β': '\\beta', 'γ': '\\gamma', 'δ': '\\delta', 'ε': '\\epsilon', 'ζ': '\\zeta',
    'η': '\\eta', 'θ': '\\theta', 'ι': '\\iota', 'κ': '\\kappa', 'λ': '\\lambda', 'μ': '\\mu', 'ν': '\\nu',
    'ξ': '\\xi', 'ο': 'o', 'π': '\\pi', 'ρ': '\\rho', 'ς': '\\varsigma', 'σ': '\\sigma', 'τ': '\\tau',
    'υ': '\\upsilon', 'φ': '\\phi', 'χ': '\\chi', 'ψ': '\\psi', 'ω': '\\omega',
    'Γ': '\\Gamma', 'Δ': '\\Delta', 'Θ': '\\Theta', 'Λ': '\\Lambda', 'Ξ': '\\Xi', 'Π': '\\Pi',
    'Σ': '\\Sigma', 'Υ': '\\Upsilon', 'Φ': '\\Phi', 'Ψ': '\\Psi', 'Ω': '\\Omega'
  };
  const SYMBOL_MAP = {
    '×': '\\times', '÷': '\\div', '±': '\\pm', '∓': '\\mp', '·': '\\cdot',
    '≤': '\\leq', '≥': '\\geq', '≠': '\\neq', '≈': '\\approx', '≡': '\\equiv',
    '∈': '\\in', '∉': '\\notin', '⊂': '\\subset', '⊆': '\\subseteq',
    '∪': '\\cup', '∩': '\\cap', '∅': '\\emptyset',
    '∞': '\\infty', '→': '\\to', '⇒': '\\Rightarrow', '⇔': '\\Leftrightarrow',
    '∀': '\\forall', '∃': '\\exists', '∂': '\\partial', '∝': '\\propto',
    '−': '-'
  };
  function convertRun(chars, map) {
    return chars.split('').map((c) => map[c]).join('');
  }
  const SUPERSCRIPT_RUN_RE = new RegExp(`[${Object.keys(SUPERSCRIPT_MAP).join('')}]+`, 'g');
  const SUBSCRIPT_RUN_RE = new RegExp(`[${Object.keys(SUBSCRIPT_MAP).join('')}]+`, 'g');
  function convertSuperSubscripts(s) {
    s = s.replace(SUPERSCRIPT_RUN_RE, (run) => `^{${convertRun(run, SUPERSCRIPT_MAP)}}`);
    s = s.replace(SUBSCRIPT_RUN_RE, (run) => `_{${convertRun(run, SUBSCRIPT_MAP)}}`);
    return s;
  }
  function convertGreek(s) {
    return s.replace(/[α-ωΑ-Ω]/g, (c) => GREEK_MAP[c] !== undefined ? GREEK_MAP[c] + ' ' : c);
  }
  function convertSymbols(s) {
    return s.replace(/[×÷±∓·≤≥≠≈≡∈∉⊂⊆∪∩∅∞→⇒⇔∀∃∂∝−]/g, (c) => SYMBOL_MAP[c] + ' ');
  }
  // Σ handling: bare "Σ" (optionally already turned into "Σ_{i}" by convertSuperSubscripts)
  // -> \sum, run BEFORE convertGreek maps Σ to a bare non-operator \Sigma
  function convertSigmaSum(s) {
    return s.replace(/Σ(_\{[^}]*\})?/g, (m, sub) => `\\sum${sub || ''} `);
  }
  function convertSqrt(s) {
    s = s.replace(/√\(([^()]*)\)/g, (m, inner) => `\\sqrt{${inner}}`);
    // √Var(X) — a function name immediately followed by its own paren group; the whole
    // call belongs inside the radical, not just the bare name before the "("
    s = s.replace(/√([A-Za-z0-9]+\([^()]*\))/g, (m, inner) => `\\sqrt{${inner}}`);
    s = s.replace(/√([A-Za-z0-9]+)/g, (m, inner) => `\\sqrt{${inner}}`);
    return s;
  }
  // a/b -> \frac{a}{b}: only for a clearly-delimited numerator/denominator. Each side must
  // be EITHER a single balanced-parens group OR a bare identifier/number with no parens at
  // all, and may not border '(' or ')' directly — a fraction operand is never half-inside a
  // call like P(...), which is what let an earlier version mis-match "P(A)/P(Aᶜ)" as
  // "A)/P". A trailing lookahead also blocks matching when the right side is immediately
  // followed by a superscript/subscript group (e.g. "(1+yield)ⁿ") — that exponent belongs
  // to the whole right-hand group, and this converter can't safely pull it inside the
  // fraction, so it leaves the '/' as a literal slash rather than scope it wrong.
  function convertFractions(s) {
    const SIDE = '(?:\\([^()]*\\)|\\\\text\\{[^}]*\\}|[A-Za-z0-9]+(?:[_^]\\{[^}]*\\})*)';
    const re = new RegExp(`(?<![(A-Za-z0-9)])(${SIDE})\\s*/\\s*(${SIDE})(?![A-Za-z0-9(])(?!\\^|_)`, 'g');
    let prev;
    do {
      prev = s;
      s = s.replace(re, (m, a, b) => {
        const na = a.trim().replace(/^\(([^()]*)\)$/, '$1');
        const nb = b.trim().replace(/^\(([^()]*)\)$/, '$1');
        if (!na || !nb) return m;
        return `\\frac{${na}}{${nb}}`;
      });
    } while (s !== prev && s.includes('/'));
    return s;
  }
  function convertConditionalBar(s) {
    // P(A|B) — a single '|' inside one balanced-paren group is a conditioning bar, not an
    // absolute-value delimiter; must run before convertAbsBars, which would otherwise pair
    // it with an unrelated '|' in a second, separate P(...) later in the string.
    return s.replace(/\(([^()|]*)\|([^()|]*)\)/g, (m, a, b) => `(${a}\\mid ${b})`);
  }
  function convertAbsBars(s) {
    return s.replace(/\|([^|]{1,40})\|/g, (m, inner) => `\\left|${inner}\\right|`);
  }
  const RELATION_OP_LATEX = { '=': '=', '≈': '\\approx', '≤': '\\leq', '≥': '\\geq', '≠': '\\neq' };
  function convertFragment(s) {
    s = convertSigmaSum(s);
    s = convertSqrt(s);
    s = convertConditionalBar(s);
    s = convertAbsBars(s);
    s = convertSuperSubscripts(s);
    s = convertSymbols(s);
    s = convertGreek(s);
    return s;
  }
  /* Splits on the FIRST relation operator and converts each side separately, applying
     fraction conversion only to the right-hand side. A left-hand side in this dataset is a
     NAME ("Forward P/E", "Gold/silver ratio"), never a literal division; the right-hand
     side is the actual formula, where a/b really does mean division. A further '=' inside
     the right side (a chained equality like "coupon rate = current yield = YTM") is left as
     a literal '=', already valid direct KaTeX input. */
  function formulaToLatex(segment) {
    const relIdx = segment.search(/[=≈≤≥≠]/);
    if (relIdx === -1) return convertFragment(segment).replace(/\s+/g, ' ').trim();
    const lhs = convertFragment(segment.slice(0, relIdx));
    const op = RELATION_OP_LATEX[segment[relIdx]] || segment[relIdx];
    const rhs = convertFractions(convertFragment(segment.slice(relIdx + 1)));
    return `${lhs} ${op} ${rhs}`.replace(/\s+/g, ' ').trim();
  }

  // ---- structural stripping: separate a segment's "math core" from label/aside wrapper
  // text that isn't itself math, so the gate evaluates only the part that should become
  // KaTeX. Anything stripped off is kept as plain text around the rendered formula.
  const TRAILING_CONNECTORS = [
    ' where ', ' when ', ' given ', ' provided ', ' for every ', ' with equality when ',
    ' matches ', ' valid for '
  ];
  function stripTrailingClause(s) {
    let bestIdx = -1;
    TRAILING_CONNECTORS.forEach((marker) => {
      const idx = s.indexOf(marker);
      if (idx >= 0 && (bestIdx === -1 || idx < bestIdx)) bestIdx = idx;
    });
    if (bestIdx === -1) return { core: s, trail: '' };
    return { core: s.slice(0, bestIdx), trail: s.slice(bestIdx) };
  }
  const LEADING_LABEL_RE = /^([A-Za-z][A-Za-z0-9' ,-]{1,40}):\s+/;
  function stripLeadingLabel(s) {
    const m = s.match(LEADING_LABEL_RE);
    if (!m) return { label: '', core: s };
    return { label: m[0], core: s.slice(m[0].length) };
  }
  // requires actual whitespace before the '(' — "max(" (a function call) has none and is
  // never touched here, only a genuinely separate "... clause) (aside)" is a candidate
  const TRAILING_PAREN_RE = /^(.*?)\s+\(([^()]{4,80})\)\s*$/;
  function stripTrailingAside(s) {
    const m = s.match(TRAILING_PAREN_RE);
    if (!m) return { core: s, aside: '' };
    const [, prefix, inner] = m;
    // even with a space before it, a trailing "(...)" can still be a required OPERAND, not
    // a detachable aside — a fraction's denominator or a multiplicand always leaves the
    // preceding operator dangling with nothing after it if stripped, truncating the actual
    // formula rather than removing genuine explanatory text.
    if (/[/×÷+\-−]\s*$/.test(prefix)) return { core: s, aside: '' };
    const innerWords = (inner.match(/[a-zA-Z]{3,}/g) || []).filter(wordIsProse);
    if (innerWords.length < 2) return { core: s, aside: '' };
    return { core: prefix, aside: ` (${inner})` };
  }

  // Final safety net, run on the FINISHED latex string: strip every \text{...} span
  // (deliberate named operands), every \command, and every recognized bare function name,
  // then check what's left. Anything else non-ASCII, or any lowercase-letter word of 3+
  // characters, means some piece of the source text slipped through unconverted — reject
  // the whole segment rather than emit a partially-garbled result. All-caps runs (GDP, YTM,
  // WACC...) are allowed through: those are acronyms used directly as symbols, not prose.
  const KNOWN_FUNC_NAMES_RE = /\b(Var|Cov|Cor|Corr|min|max|log|ln|exp|sin|cos|tan|lim|sup|inf|mean|mode|median|Pr)\b/g;
  function isLatexSafe(latex) {
    let s = latex.replace(/\\text\{[^}]*\}/g, ' ');
    s = s.replace(/\\[a-zA-Z]+/g, ' ');
    s = s.replace(KNOWN_FUNC_NAMES_RE, ' ');
    if (/[^\x00-\x7F]/.test(s)) return false;
    const words = s.match(/[A-Za-z]{3,}/g) || [];
    return !words.some((w) => /[a-z]/.test(w));
  }

  /* Full pipeline for one clause: strip a leading "Label: " prefix and a trailing
     "(explanatory aside)" or " where/when/given ..." clause, gate-check what's left, and
     only if that passes, convert and KaTeX-render it. Returns null (never throws) if
     nothing in the segment is confidently convertible or if KaTeX itself rejects the
     result — the caller then renders the ENTIRE original segment as plain text. */
  function parseFormulaSegment(rawSegment) {
    const { label, core: afterLabel } = stripLeadingLabel(rawSegment);
    const { core: afterAside, aside } = stripTrailingAside(afterLabel);
    const { core, trail } = stripTrailingClause(afterAside);
    const mathCore = core.trim();
    if (!/[=≈≤≥≠]/.test(mathCore)) return null;
    if (mathCore.length > 160) return null;
    const wrapped = wrapNamedOperands(mathCore);
    if (wrapped === null) return null;
    if (countProseWordsOutsideText(wrapped) >= 2) return null;
    const latex = formulaToLatex(wrapped);
    if (!isLatexSafe(latex)) return null;
    let html;
    try {
      html = global.katex.renderToString(latex, { throwOnError: true, strict: 'ignore' });
    } catch (e) {
      return null; // KaTeX itself refused it — safe fallback to plain text, never a visible error
    }
    return { label, html, trail: trail + aside };
  }

  // splits a formula string into independent clauses: a trailing " — note" is split off
  // first (an em-dash explanation applies to the whole formula, not just its last clause),
  // then the remaining core is split on ". " / "; " into a list of separate formulas —
  // this dataset often packs several related ones into one string ("DSO = ...; DIO = ...").
  function splitFormulaClauses(text) {
    const emdashIdx = text.indexOf(' — ');
    const core = emdashIdx >= 0 ? text.slice(0, emdashIdx) : text;
    const note = emdashIdx >= 0 ? text.slice(emdashIdx) : '';
    const parts = core.split(/(?:\.\s+|;\s+)/).filter((p) => p.trim());
    return { parts, note };
  }

  /* Renders one "formulas" array entry: each clause independently becomes either a
     KaTeX-rendered block (its own larger, centered, distinctly-backed presentation — see
     .formula-katex in styles.css) or, whenever the parser isn't confident, the original
     clean monospace text (.formula) exactly as before this feature existed. Never partially
     mangles a clause: a given clause is either fully typeset or fully plain text. */
  function renderFormula(text) {
    text = String(text || '');
    if (typeof global.katex === 'undefined') return `<span class="formula">${esc(text)}</span>`;
    const { parts, note } = splitFormulaClauses(text);
    const rendered = parts.map((part) => {
      const parsed = parseFormulaSegment(part);
      if (!parsed) return `<span class="formula">${esc(part.trim())}</span>`;
      const labelHtml = parsed.label ? `<span class="formula-label">${esc(parsed.label)}</span>` : '';
      const trailHtml = parsed.trail ? `<span class="formula-note">${esc(parsed.trail)}</span>` : '';
      return `<span class="formula-katex-wrap">${labelHtml}<span class="formula-katex">${parsed.html}</span>${trailHtml}</span>`;
    }).join(' ');
    const noteHtml = note ? `<span class="formula-note">${esc(note)}</span>` : '';
    return rendered + noteHtml;
  }

  /* Minimal monoline icon set (24x24, stroke=currentColor) — one glyph per nav view and
     one per track, kept intentionally simple so the same set reads cleanly at 14-22px in
     both themes with no raster assets to cache. */
  const ICONS = {
    dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
    learn: '<path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z"/><path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z"/>',
    drill: '<circle cx="12" cy="12" r="8.2"/><circle cx="12" cy="12" r="4.4"/><circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none"/>',
    pattern: '<circle cx="9" cy="9" r="5.5"/><circle cx="15" cy="15" r="5.5"/>',
    mixed: '<path d="M4 7h4.5l7 10H20"/><path d="M4 17h4.5l2-2.9"/><path d="M13.6 9.8 15.5 7H20"/><path d="M17.3 4.3 20 7l-2.7 2.7"/><path d="M17.3 19.7 20 17l-2.7-2.7"/>',
    mocks: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 3.5h6a1 1 0 0 1 1 1V6H8V4.5a1 1 0 0 1 1-1z"/><path d="M8.5 11h7M8.5 14.5h7M8.5 18h4"/>',
    mistakes: '<path d="M12 3 21 19.5H3z"/><path d="M12 9.5v4.2"/><circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none"/>',
    sheet: '<rect x="4.5" y="3" width="15" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    stats: '<path d="M4 20V10M11 20V4M18 20v-7"/><path d="M2.5 20h19"/>',
    settings: '<circle cx="12" cy="12" r="3.1"/><path d="M12 3.5v2.4M12 18.1v2.4M20.5 12h-2.4M5.9 12H3.5M18.1 5.9l-1.7 1.7M7.6 16.5l-1.7 1.7M18.1 18.1l-1.7-1.7M7.6 7.6 5.9 5.9"/>',
    more: '<circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
    check: '<path d="M4 12.5 9.5 18 20 6"/>',
    flame: '<path d="M12 2.5c1 2.6-.3 4-1.6 5.4C9 9.1 8 10.6 8 13a4 4 0 0 0 8 0c0-1-.3-1.8-.8-2.6.9.6 1.8 2 1.8 3.9a5 5 0 0 1-10 0c0-4.7 3-6.4 5-11.8z"/>'
  };
  const TRACK_ICONS = {
    quant: '<path d="M3 17 9 9l4 4 8-9"/><path d="M15 3.5h4.5V8"/>',
    reasoning: '<path d="M13 2 4.5 13.5H11L9.5 22 19 9.5h-6.5z"/>',
    ib: '<path d="M4 10.5 12 4l8 6.5"/><path d="M5.5 10.5V20M9.5 10.5V20M14.5 10.5V20M18.5 10.5V20"/><path d="M3.5 20h17"/>',
    am: '<circle cx="12" cy="12" r="8"/><path d="M12 4v8l6 3.2"/>',
    wm: '<path d="M12 3 4.5 6v6c0 5 3.2 7.8 7.5 9 4.3-1.2 7.5-4 7.5-9V6z"/>',
    consulting: '<path d="M4 5h13a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H10l-4.5 4V16H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" transform="translate(1 0)"/>'
  };
  function icon(name, cls) {
    const d = ICONS[name] || ICONS.dashboard;
    return `<svg class="${cls || 'navicon'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  }
  function trackIcon(id, cls) {
    const d = TRACK_ICONS[id] || TRACK_ICONS.quant;
    return `<svg class="${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  }
  /* Problem 3e: one small consistent glyph per breadcrumb step (Context/Core/Examples/
     Practice) — same 24x24, stroke=currentColor language as every other icon in the app, so
     a reader recognises where they are in a concept at a glance instead of only via text. */
  const STEP_ICONS = {
    context: '<path d="M6 3v18"/><path d="M6 4h11l-3 4 3 4H6z"/>',
    core: '<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="3.5"/><circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none"/>',
    examples: '<path d="M12 4 3 9l9 5 9-5-9-5z"/><path d="M3 14l9 5 9-5"/>'
  };
  function stepIcon(name) {
    const d = STEP_ICONS[name];
    return d ? `<svg class="step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>` : '';
  }

  const VIEWS = [
    { id: 'dashboard', label: 'Dash', title: 'Dashboard', group: 'primary', navgroup: 'Overview' },
    { id: 'learn', label: 'Learn', title: 'Learn', group: 'primary', navgroup: 'Practice' },
    { id: 'drill', label: 'Drill', title: 'Drill', group: 'primary', navgroup: 'Practice' },
    { id: 'pattern', label: 'Pattern', title: 'Pattern recognition', group: 'secondary', navgroup: 'Practice' },
    { id: 'mixed', label: 'Mixed', title: 'Mixed practice', group: 'secondary', navgroup: 'Practice' },
    { id: 'mocks', label: 'Mocks', title: 'Mock tests', group: 'primary', navgroup: 'Practice' },
    { id: 'mistakes', label: 'Errors', title: 'Mistakes and error log', group: 'secondary', navgroup: 'Review' },
    { id: 'sheet', label: 'Sheet', title: 'Formula / technique sheet', group: 'secondary', navgroup: 'Review' },
    { id: 'stats', label: 'Stats', title: 'Statistics', group: 'secondary', navgroup: 'Review' },
    { id: 'settings', label: 'Set', title: 'Settings', group: 'secondary', navgroup: 'App' }
  ];

  let current = 'dashboard';
  let session = null;       // active runner
  let tickHandle = null;

  /* ------------------------------- utilities ------------------------------- */

  function toast(msg) {
    let t = $('#toast');
    if (!t) { t = el('div', 'toast'); t.id = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove('show'), 2200);
  }

  function bars(rows, opts) {
    opts = opts || {};
    if (!rows.length) return '<div class="empty">No data yet.</div>';
    const max = opts.max || 100;
    return rows.map((r) => {
      const v = opts.field ? r[opts.field] : r.accuracy;
      const w = Math.max(2, Math.min(100, 100 * v / max));
      const cls = opts.plain ? '' : (v >= 75 ? 'good' : v < 50 ? 'bad' : '');
      const val = opts.fmt ? opts.fmt(r) : v + '% · n=' + r.n;
      return `<div class="bar-row"><span class="name" title="${esc(r.key)}">${esc(r.key)}</span>
        <span class="bar"><i class="${cls}" style="width:${w}%"></i></span>
        <span class="val">${esc(val)}</span></div>`;
    }).join('');
  }

  /* Minimal inline SVG line chart. points: [{x,y}] with y in 0..max */
  function lineChart(series, opts) {
    opts = opts || {};
    const w = 320, h = 120, pad = 22;
    if (!series.length) return '<div class="empty">Not enough history yet.</div>';
    const max = opts.max || Math.max(1, Math.max.apply(null, series.map((p) => p.y)) * 1.15);
    const n = series.length;
    const px = (i) => pad + (n === 1 ? (w - 2 * pad) / 2 : i * (w - 2 * pad) / (n - 1));
    const py = (y) => h - pad - (y / max) * (h - 2 * pad);
    const d = series.map((p, i) => (i ? 'L' : 'M') + px(i).toFixed(1) + ' ' + py(p.y).toFixed(1)).join(' ');
    const dots = series.map((p, i) => `<circle cx="${px(i).toFixed(1)}" cy="${py(p.y).toFixed(1)}" r="2.4" fill="var(--accent)"/>`).join('');
    const grid = [0, 0.5, 1].map((f) => {
      const y = h - pad - f * (h - 2 * pad);
      return `<line x1="${pad}" y1="${y}" x2="${w - pad}" y2="${y}" stroke="var(--line-soft)" stroke-width="1"/>
              <text x="2" y="${y + 3}" fill="var(--dim)" font-size="8" font-family="monospace">${Math.round(f * max)}</text>`;
    }).join('');
    return `<svg class="chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="${esc(opts.label || 'chart')}">
      ${grid}<path d="${d}" fill="none" stroke="var(--accent)" stroke-width="1.6"/>${dots}</svg>
      <div class="chart-legend">${esc(opts.label || '')} · ${n} point${n === 1 ? '' : 's'}</div>`;
  }

  function barChart(rows, opts) {
    opts = opts || {};
    if (!rows.length) return '<div class="empty">No data yet.</div>';
    const w = 320, h = 120, pad = 20;
    const max = Math.max.apply(null, rows.map((r) => r.n)) || 1;
    const bw = (w - 2 * pad) / rows.length;
    const bars = rows.map((r, i) => {
      const bh = (r.n / max) * (h - 2 * pad - 12);
      return `<rect x="${(pad + i * bw + 2).toFixed(1)}" y="${(h - pad - bh).toFixed(1)}" width="${Math.max(2, bw - 4).toFixed(1)}" height="${bh.toFixed(1)}" fill="var(--info)"/>`;
    }).join('');
    const labels = rows.length <= 8 ? rows.map((r, i) =>
      `<text x="${(pad + i * bw + bw / 2).toFixed(1)}" y="${h - 6}" fill="var(--dim)" font-size="7" font-family="monospace" text-anchor="middle">${esc(String(r.key).slice(0, 9))}</text>`).join('') : '';
    return `<svg class="chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${bars}${labels}</svg>
      <div class="chart-legend">${esc(opts.label || '')}</div>`;
  }

  /* ------------------------------ answer grading --------------------------- */

  function parseNumeric(text) {
    if (text === null || text === undefined) return NaN;
    let t = String(text).trim().replace(/,/g, '.').replace(/[%€$\s]/g, '');
    if (!t) return NaN;
    const frac = t.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
    if (frac) return parseFloat(frac[1]) / parseFloat(frac[2]);
    const v = parseFloat(t);
    return isNaN(v) ? NaN : v;
  }

  function grade(q, given) {
    if (q.answerType === 'mc') return { correct: given === q.correctAnswer, given: given };
    const v = parseNumeric(given);
    if (isNaN(v)) return { correct: false, given: given };
    const tol = q.tolerance === undefined ? 0.01 : q.tolerance;
    let ok = Math.abs(v - q.correctAnswer) <= tol + 1e-9;
    if (!ok && q.acceptFraction) {
      const f = q.acceptFraction[0] / q.acceptFraction[1];
      ok = Math.abs(v - f) <= Math.max(tol, 0.005);
    }
    // also accept the percentage form of a probability answer
    if (!ok && q.correctAnswer > 0 && q.correctAnswer < 1) ok = Math.abs(v / 100 - q.correctAnswer) <= Math.max(tol, 0.005);
    return { correct: ok, given: v };
  }

  /* ================================ RUNNER ================================= */
  /* cfg: {items, mode, testType, allowHelp, perQuestion, totalSeconds,
           noSkip, deferFeedback, onFinish, title, calculator} */
  function startSession(cfg) {
    session = {
      cfg, items: cfg.items, idx: 0,
      records: cfg.items.map(() => null),
      flags: cfg.items.map(() => false),
      startedAt: Date.now(), qStart: Date.now(),
      hintUsed: false, approachShown: false, solutionShown: false,
      confidence: 'Medium', answered: false, lastResult: null,
      deadline: cfg.totalSeconds ? Date.now() + cfg.totalSeconds * 1000 : null
    };
    go('runner');
  }

  let lastSessionReport = null;

  function endSession(aborted) {
    const cfg = session.cfg;
    const recs = session.records;
    const elapsed = (Date.now() - session.startedAt) / 1000;
    session = null;
    stopTick();
    if (cfg.onFinish) return cfg.onFinish(recs, elapsed, aborted);
    const done = recs.filter(Boolean);
    if (!done.length) return go(cfg.returnTo || 'dashboard');
    lastSessionReport = { cfg, recs: done, score: done.filter((r) => r.correct).length, total: done.length, elapsed };
    go('sessionreport');
  }

  function stopTick() { if (tickHandle) { clearInterval(tickHandle); tickHandle = null; } }

  function startTick() {
    stopTick();
    tickHandle = setInterval(() => {
      if (!session) return stopTick();
      const t = $('#sess-timer');
      if (t) {
        if (session.deadline) {
          const left = (session.deadline - Date.now()) / 1000;
          t.textContent = 'Remaining ' + fmtTime(left);
          t.className = 'timer' + (left < 60 ? ' danger' : left < 180 ? ' warn' : '');
          if (left <= 0) { toast('Time is up.'); autoSubmitRemaining(); return; }
        } else {
          t.textContent = 'Elapsed ' + fmtTime((Date.now() - session.qStart) / 1000);
          t.className = 'timer';
        }
      }
      const pq = $('#pq-timer');
      if (pq && session.cfg.perQuestion) {
        const left = session.cfg.perQuestion - (Date.now() - session.qStart) / 1000;
        pq.textContent = fmtTime(left);
        pq.className = 'timer' + (left < 5 ? ' danger' : '');
        if (left <= 0) submitAnswer(null, true);
      }
    }, 250);
  }

  function autoSubmitRemaining() {
    if (!session) return;
    session.records.forEach((r, i) => {
      if (r) return;
      const q = session.items[i];
      session.records[i] = {
        q, given: null, correct: false, timeSec: 0, hintUsed: false,
        confidence: 'Guess', errorType: 'Too slow', timedOut: true
      };
    });
    finishAndRecord();
  }

  function finishAndRecord() {
    if (!session) return;
    const cfg = session.cfg;
    const track = S.activeTrack();
    session.records.forEach((r) => {
      if (!r || r.recorded) return;
      r.recorded = true;
      S.recordAttempt({
        qid: r.q.id, baseId: r.q.baseId || r.q.id, mode: cfg.mode, testType: cfg.testType || cfg.mode,
        topic: r.q.topic, subtopic: r.q.subtopic, difficulty: r.q.difficulty,
        correct: !!r.correct, timeSec: Math.round(r.timeSec), targetTime: r.q.targetTime,
        hintUsed: !!r.hintUsed, confidence: r.confidence || 'Medium',
        errorType: r.errorType || null, given: r.given, expected: r.q.correctAnswer,
        track
      });
    });
    const done = session.records.filter(Boolean);
    if (done.length) {
      const topicCounts = {};
      done.forEach((r) => { topicCounts[r.q.topic] = (topicCounts[r.q.topic] || 0) + 1; });
      const topics = Object.keys(topicCounts);
      S.recordSession({
        track, mode: cfg.mode, topic: topics.length === 1 ? topics[0] : 'Mixed',
        score: done.filter((r) => r.correct).length, total: done.length,
        timeSec: Math.round((Date.now() - session.startedAt) / 1000)
      });
    }
    endSession(false);
  }

  function submitAnswer(given, timedOut) {
    if (!session || session.answered) return;
    const q = session.items[session.idx];
    const timeSec = (Date.now() - session.qStart) / 1000;
    const g = timedOut ? { correct: false, given: null } : grade(q, given);
    const errorType = S.classifyError({
      correct: g.correct, timeSec, targetTime: q.targetTime, hintUsed: session.hintUsed,
      confidence: session.confidence, given: g.given, expected: q.correctAnswer,
      answerType: q.answerType, topic: q.topic
    });
    const rec = {
      q, given: g.given, correct: g.correct, timeSec, hintUsed: session.hintUsed,
      confidence: session.confidence, errorType, timedOut: !!timedOut
    };
    session.records[session.idx] = rec;
    session.lastResult = rec;
    session.answered = true;
    if (session.cfg.deferFeedback) nextQuestion();
    else render();
  }

  function nextQuestion() {
    if (!session) return;
    if (session.idx >= session.items.length - 1) return finishAndRecord();
    session.idx++;
    session.qStart = Date.now();
    session.hintUsed = session.approachShown = session.solutionShown = false;
    session.answered = !!session.records[session.idx];
    session.confidence = 'Medium';
    render();
  }

  function gotoQuestion(i) {
    if (!session || session.cfg.noSkip) return;
    session.idx = i; session.qStart = Date.now();
    session.hintUsed = session.approachShown = session.solutionShown = false;
    session.answered = !!session.records[session.idx];
    render();
  }

  /* ------------------------------ runner view ------------------------------ */

  function viewRunner(root) {
    const cfg = session.cfg;
    const q = session.items[session.idx];
    const rec = session.records[session.idx];
    const n = session.items.length;

    const head = el('div', 'panel');
    head.innerHTML = `
      <div class="flex between wrap mb-2">
        <span class="eyebrow">${esc(cfg.title || cfg.mode)}</span>
        <span class="flex">
          ${cfg.perQuestion ? '<span id="pq-timer" class="timer"></span>' : ''}
          <span id="sess-timer" class="timer"></span>
        </span>
      </div>
      <div class="progress"><i style="width:${((session.idx) / n * 100).toFixed(1)}%"></i></div>
      <div class="flex between">
        <span class="mono-sm dim">Question ${session.idx + 1} of ${n}</span>
        <span class="flex">
          <button class="btn sm ghost" id="flag-btn">${session.flags[session.idx] ? '⚑ Flagged' : '⚐ Flag'}</button>
          <button class="btn sm ghost" id="end-btn">End</button>
        </span>
      </div>`;
    root.appendChild(head);

    const card = el('div', 'panel');
    card.innerHTML = `
      <div class="qmeta">
        <span class="tag d${q.difficulty}">L${q.difficulty}</span>
        ${cfg.hideTopic ? '' : `<span class="tag">${esc(q.topic)}</span>`}
        ${q.targetTime ? `<span>target ${q.targetTime}s</span>` : ''}
        ${q.source === 'curated' ? '<span>curated</span>' : ''}
      </div>
      <div class="qprompt">${/^\s*</.test(q.prompt) ? q.prompt : '<p>' + esc(q.prompt) + '</p>'}</div>`;

    const answerBox = el('div');
    if (q.answerType === 'mc') {
      q.options.forEach((o, i) => {
        const b = el('button', 'opt', `<span class="idx">${String.fromCharCode(65 + i)}</span>${esc(o)}`);
        if (rec) {
          if (o === q.correctAnswer) b.classList.add('right');
          if (rec.given === o && !rec.correct) b.classList.add('wrong');
          b.disabled = true;
        } else {
          b.onclick = () => submitAnswer(o);
        }
        answerBox.appendChild(b);
      });
    } else {
      const wrap = el('div');
      wrap.innerHTML = `<label class="field"><span>Your answer</span>
        <input type="text" inputmode="decimal" id="ans-input" autocomplete="off"
          placeholder="number or fraction, e.g. 0.25 or 1/4" ${rec ? 'disabled' : ''}
          value="${rec && rec.given !== null ? esc(rec.given) : ''}"></label>`;
      answerBox.appendChild(wrap);
      if (!rec) {
        const b = el('button', 'btn primary full', 'Submit answer <kbd>Enter</kbd>');
        b.onclick = () => submitAnswer($('#ans-input').value);
        answerBox.appendChild(b);
      }
    }
    card.appendChild(answerBox);

    if (!rec) {
      const conf = el('div');
      conf.innerHTML = `<div class="eyebrow mt-3 mb-2">Confidence</div>
        <div class="chips" id="conf-chips">${['Guess', 'Low', 'Medium', 'High'].map((c) =>
        `<button class="chip ${c === session.confidence ? 'on' : ''}" data-c="${c}">${c}</button>`).join('')}</div>`;
      conf.querySelectorAll('.chip').forEach((c) => {
        c.onclick = () => {
          session.confidence = c.dataset.c;
          conf.querySelectorAll('.chip').forEach((x) => x.classList.toggle('on', x === c));
        };
      });
      card.appendChild(conf);

      if (cfg.allowHelp) {
        const help = el('div', 'btn-row');
        help.style.marginTop = '12px';
        const mk = (label, key, field, note) => {
          const b = el('button', 'btn sm ghost', label);
          b.onclick = () => {
            session[key] = true;
            if (key === 'hintUsed') session.hintUsed = true;
            const r = el('div', 'reveal', `<span class="eyebrow">${note}</span>${esc(q[field] || 'Not available for this question.')}`);
            card.appendChild(r);
            b.disabled = true;
          };
          return b;
        };
        help.appendChild(mk('Hint', 'hintUsed', 'hint', 'Hint'));
        help.appendChild(mk('Show approach', 'approachShown', 'approach', 'Approach'));
        help.appendChild(mk('Full solution', 'solutionShown', 'solution', 'Full solution'));
        card.appendChild(help);
      }
    }
    root.appendChild(card);

    /* feedback */
    if (rec && !cfg.deferFeedback) {
      const f = el('div', 'panel');
      const alt = q.altSolution ? `<div class="reveal"><span class="eyebrow">Faster alternative</span>${esc(q.altSolution)}</div>` : '';
      f.innerHTML = `
        <div class="verdict ${rec.correct ? 'ok' : 'no'}"><span class="vmark">${rec.correct ? icon('check', '') : '!'}</span>
          <span>${rec.correct ? 'Correct' : rec.timedOut ? 'Timed out' : 'Incorrect'}
          · ${fmtTime(rec.timeSec)} vs target ${fmtTime(q.targetTime || 90)}
          · confidence ${esc(rec.confidence)}</span></div>
        <div class="grid c2 mb-2">
          <div class="stat"><span class="label">Correct answer</span><span class="value" style="font-size:18px">${esc(String(q.correctAnswer))}</span></div>
          <div class="stat"><span class="label">Your answer</span><span class="value" style="font-size:18px">${rec.given === null ? '—' : esc(String(rec.given))}</span></div>
        </div>
        ${renderReadingBlock('Best solution', q.solution, 'prose-block')}
        ${alt}
        <div class="reveal"><span class="eyebrow">Main concept · recognition clue</span>
          <strong>${esc(q.recognitionTechnique || '—')}</strong> — ${esc(q.approach || '')}</div>
        <div class="reveal"><span class="eyebrow">Common trap</span>${esc(q.commonTrap || '—')}</div>
        ${!rec.correct ? `<label class="field mt-2"><span>Error type (editable)</span>
          <select id="err-sel">${S.ERROR_TYPES.map((t) =>
        `<option ${t === rec.errorType ? 'selected' : ''}>${t}</option>`).join('')}</select></label>` : ''}`;
      const row = el('div', 'btn-row');
      if (q.baseId) {
        const sim = el('button', 'btn sm', 'Generate similar problem');
        sim.onclick = () => {
          const nq = S.similar(q);
          if (!nq) return toast('No generator for this question.');
          session.items.splice(session.idx + 1, 0, nq);
          session.records.splice(session.idx + 1, 0, null);
          session.flags.splice(session.idx + 1, 0, false);
          toast('Similar problem queued next.');
          render();
        };
        row.appendChild(sim);
      }
      const nx = el('button', 'btn primary',
        session.idx >= session.items.length - 1 ? 'Finish session' : 'Next question <kbd>N</kbd>');
      nx.onclick = () => (session.idx >= session.items.length - 1 ? finishAndRecord() : nextQuestion());
      row.appendChild(nx);
      f.appendChild(row);
      root.appendChild(f);
      const sel = $('#err-sel', f);
      if (sel) sel.onchange = () => { rec.errorType = sel.value; };
    }

    /* navigator */
    if (!cfg.noSkip && n > 1) {
      const nav = el('div', 'panel');
      nav.innerHTML = '<span class="eyebrow">Navigator</span><div class="navgrid mt-2"></div>';
      const g = $('.navgrid', nav);
      session.items.forEach((_, i) => {
        const b = el('button', (session.records[i] ? 'done ' : '') + (session.flags[i] ? 'flag ' : '') + (i === session.idx ? 'cur' : ''), String(i + 1));
        b.onclick = () => gotoQuestion(i);
        g.appendChild(b);
      });
      root.appendChild(nav);
    }

    $('#flag-btn').onclick = () => { session.flags[session.idx] = !session.flags[session.idx]; render(); };
    $('#end-btn').onclick = () => {
      if (confirm('End this session? Answered questions are saved.')) {
        session.records.forEach((r, i) => { if (!r) session.records[i] = null; });
        session.records = session.records.filter(Boolean).map((r) => r);
        finishAndRecord();
      }
    };
    const inp = $('#ans-input');
    if (inp) { inp.focus(); inp.onkeydown = (e) => { if (e.key === 'Enter') submitAnswer(inp.value); }; }
    startTick();
  }

  /* =============================== DASHBOARD =============================== */

  function heatmap(days) {
    const level = (n) => n === 0 ? 0 : n < 3 ? 1 : n < 6 ? 2 : n < 12 ? 3 : 4;
    const cells = days.map((d) => `<i class="l${level(d.n)}" title="${d.date} · ${d.n} question${d.n === 1 ? '' : 's'}"></i>`).join('');
    return `<div class="heatmap">${cells}</div>
      <div class="heatmap-legend">Less
        <i style="background:var(--heat-0)"></i><i style="background:var(--heat-1)"></i>
        <i style="background:var(--heat-2)"></i><i style="background:var(--heat-3)"></i><i style="background:var(--heat-4)"></i>
        More</div>`;
  }

  function viewDashboard(root) {
    const track = S.activeTrack();
    const trackLabel = (S.tracks().find((t) => t.id === track) || {}).label || track;
    const s = S.trackSummary(track);
    const rd = S.readiness();
    const rec = S.recommendation();
    const streak = S.dayStreak();

    /* ---- first-run onboarding (global, not per-track — disappears the moment the
       user has done ANYTHING anywhere, never blocks the primary action below it) ---- */
    if (!S.state.attempts.length && !S.state.sessions.length) {
      const ob = el('div', 'panel');
      ob.style.borderColor = 'var(--brand-line)';
      ob.innerHTML = `<span class="eyebrow">Six tracks, one offline lab</span>
        <p class="mt-2">This runs entirely on your device — no account, no network calls after
        the first load. Pick a track below (quant trading, reasoning speed, IB, AM, WM or consulting),
        then use <strong>Learn</strong> for theory or jump straight into <strong>Drill</strong> for
        practice. Your progress, streak and history are saved locally and never leave this browser.</p>
        <div class="chips mt-2">
          ${S.tracks().map((t) => `<span class="chip" data-ob-track="${esc(t.id)}">${esc(t.label)}</span>`).join('')}
        </div>`;
      ob.querySelectorAll('[data-ob-track]').forEach((c) => {
        c.onclick = () => { S.setTrack(c.dataset.obTrack); render(); buildTrackPill(); };
      });
      root.appendChild(ob);
    }

    /* ---- hero: one-tap continue + day streak ---- */
    const hero = el('div', 'hero-cta');
    const hasHistory = s.total > 0;
    hero.innerHTML = `
      <span class="eyebrow">${hasHistory ? 'Continue in ' + esc(trackLabel) : 'Welcome to ' + esc(trackLabel)}</span>
      <h2>${hasHistory ? esc(rec.text) : 'Start with a short guided session — no setup needed.'}</h2>
      <p>${hasHistory ? 'One tap resumes an adaptive set built from your weakest topics right now.' : 'We’ll build a first set from the fundamentals and adjust as you go.'}</p>
      <div class="btn-row"></div>`;
    const heroRow = $('.btn-row', hero);
    const heroBtn = el('button', 'btn primary lg', hasHistory ? 'Continue training' : 'Start first session');
    heroBtn.onclick = () => startSession({
      items: S.weaknessSession(12), mode: 'Adaptive', testType: 'Adaptive',
      allowHelp: true, title: 'Adaptive — train my weaknesses', returnTo: 'dashboard'
    });
    heroRow.appendChild(heroBtn);
    if (streak.current > 0) {
      const flame = el('div', 'flex', `${icon('flame', 'navicon acc-c')}
        <span><strong class="acc-c mono-sm">${streak.current}-day streak</strong>
        <span class="dim mono-sm"> · best ${streak.best}</span></span>`);
      flame.style.marginLeft = '4px';
      heroRow.appendChild(flame);
    }
    root.appendChild(hero);

    /* ---- quick-length sessions (still one tap once a length is picked) ---- */
    const quick = el('div', 'btn-row');
    quick.style.marginBottom = 'var(--sp-3)';
    [['5 min', 5], ['10 min', 10], ['20 min', 20], ['45 min', 45]].forEach(([label, min]) => {
      const b = el('button', 'btn sm', label);
      b.onclick = () => startSession({
        items: S.weaknessSession(Math.max(4, Math.round(min * 60 / 75))),
        mode: 'Session', testType: 'Session', allowHelp: true,
        totalSeconds: min * 60, title: label + ' session', returnTo: 'dashboard'
      });
      quick.appendChild(b);
    });
    root.appendChild(quick);

    /* ---- usage streak / contribution history ---- */
    const hp = el('div', 'panel');
    hp.innerHTML = `<span class="eyebrow">Consistency</span>
      <div class="mt-2">${heatmap(S.contributionDays(70))}</div>`;
    root.appendChild(hp);

    /* ---- track progress at a glance ---- */
    const tp = el('div', 'panel');
    tp.innerHTML = '<span class="eyebrow">Progress by track</span><div class="grid c3 mt-2" id="track-progress-grid"></div>';
    root.appendChild(tp);
    const tgrid = $('#track-progress-grid', tp);
    S.tracks().forEach((t) => {
      const sum = S.trackSummary(t.id);
      const started = sum.total > 0;
      const card = el('button', 'track-card' + (t.id === track ? ' active' : ''));
      card.style.cssText = 'flex-direction:column;align-items:flex-start;gap:8px;text-align:left';
      card.innerHTML = `<span class="flex between" style="width:100%">
          <span class="ic">${trackIcon(t.id)}</span>
          ${started ? ring(sum.accuracy, { size: 30, stroke: 3, accent: t.id === track, showNum: false }) : ''}
        </span>
        <span class="name" style="font-size:var(--fs-sm)">${esc(t.label)}</span>
        <span class="meta">${started ? sum.accuracy + '% · n=' + sum.total : 'Not started'}</span>`;
      card.onclick = () => {
        if (t.id !== track) { S.setTrack(t.id); current = S.getLastView(t.id); }
        else go('dashboard');
        render(); buildTrackPill();
      };
      tgrid.appendChild(card);
    });

    /* ---- core stat tiles (scoped to this track) ---- */
    root.appendChild(el('div', 'grid c4', `
      <div class="stat accent"><span class="label">Accuracy</span><span class="value">${s.accuracy}%</span><span class="sub">${s.correct}/${s.total}</span></div>
      <div class="stat"><span class="label">Completed</span><span class="value">${s.total}</span><span class="sub">questions</span></div>
      <div class="stat"><span class="label">Avg time</span><span class="value">${s.avgTime}s</span><span class="sub">per question</span></div>
      <div class="stat brand"><span class="label">Best run</span><span class="value">${S.summary().bestStreak}</span><span class="sub">consecutive correct</span></div>`));

    if (track === 'quant') {
      root.appendChild(el('div', 'grid c3', `
        <div class="stat"><span class="label">Wincent readiness</span><span class="value">${rd.wincent}</span><span class="sub">internal metric</span></div>
        <div class="stat"><span class="label">SIG readiness</span><span class="value">${rd.sig}</span><span class="sub">internal metric</span></div>
        <div class="stat"><span class="label">IMC readiness</span><span class="value">${rd.imc}</span><span class="sub">internal metric</span></div>`));
    }

    const cols = el('div', 'grid c2');
    const p1 = el('div', 'panel');
    p1.innerHTML = '<span class="eyebrow">Accuracy by topic</span><div class="mt-2">' +
      bars(S.byKey('topic', track).sort((a, b) => b.n - a.n)) + '</div>';
    const p2 = el('div', 'panel');
    p2.innerHTML = '<span class="eyebrow">Accuracy by difficulty</span><div class="mt-2">' +
      bars(S.byKey('difficulty', track).sort((a, b) => a.key - b.key).map((r) => Object.assign({}, r, { key: 'Level ' + r.key }))) + '</div>';
    cols.appendChild(p1); cols.appendChild(p2);
    root.appendChild(cols);

    const cols2 = el('div', 'grid c2');
    const w = S.weakestTopics(3, 3, track), st = S.strongestTopics(3, 3, track);
    const p3 = el('div', 'panel');
    p3.innerHTML = '<span class="eyebrow">Weakest 3 topics</span>' +
      (w.length ? '<ul class="list">' + w.map((r) => `<li>${esc(r.key)} <span class="neg mono-sm right" style="float:right">${r.accuracy}% · n=${r.n}</span></li>`).join('') + '</ul>'
        : '<div class="empty">Needs at least 3 attempts per topic.</div>');
    const p4 = el('div', 'panel');
    p4.innerHTML = '<span class="eyebrow">Strongest 3 topics</span>' +
      (st.length ? '<ul class="list">' + st.map((r) => `<li>${esc(r.key)} <span class="pos mono-sm" style="float:right">${r.accuracy}% · n=${r.n}</span></li>`).join('') + '</ul>'
        : '<div class="empty">Needs at least 3 attempts per topic.</div>');
    cols2.appendChild(p3); cols2.appendChild(p4);
    root.appendChild(cols2);

    const m = S.recentMocks(null, 5);
    const p5 = el('div', 'panel');
    p5.innerHTML = '<span class="eyebrow">Recent mock scores</span>' +
      (m.length ? '<ul class="list">' + m.map((x) => `<li>${esc(x.type)} — <strong>${x.score}/${x.total}</strong>
        <span class="dim mono-sm" style="float:right">${new Date(x.ts).toLocaleDateString()} · ${fmtTime(x.timeSec)}</span></li>`).join('') + '</ul>'
        : '<div class="empty">No mocks taken yet.</div>');
    root.appendChild(p5);
  }

  /* ================================= LEARN ================================= */

  function viewLearn(root) {
    const units = S.allLessonUnits();
    const studiedSet = new Set(S.state.attempts.filter((a) => a.mode === 'Learn').map((a) => String(a.qid).split(':')[1]));
    const levelWord = (lv) => lv === 1 ? 'Basic' : lv === 2 ? 'Intermediate' : 'Advanced';
    const cid = (id) => 'concept-' + id.replace(/[^a-zA-Z0-9]/g, '_');

    // flat, ordered list of every concept across every unit — backs prev/next navigation
    const flat = [];
    units.forEach((unit) => unit.concepts.forEach((c) => flat.push({ unit, c })));
    const conceptEls = {}; // c.id -> <details> element, populated as concepts render below

    let activeUnitId = null;

    function openConcept(id) {
      const entry = flat.find((x) => x.c.id === id);
      const target = conceptEls[id];
      if (!entry || !target) return;
      Object.values(conceptEls).forEach((d) => { if (d !== target) d.removeAttribute('open'); });
      target.setAttribute('open', '');
      smoothScrollTo(target);
      updateSubIndex(entry.unit, id);
    }

    const idx = el('div', 'learn-index');
    units.forEach((unit) => {
      const b = el('button', '', esc(unit.unit));
      b.title = unit.title;
      b.onclick = () => {
        const target = $('#learn-unit-' + unit.unit.replace(/[^a-zA-Z0-9]/g, '_'));
        if (target) smoothScrollTo(target);
        updateSubIndex(unit, null);
      };
      idx.appendChild(b);
    });
    root.appendChild(idx);

    // secondary row: which CONCEPT within the current unit is active — not just the unit
    const subIdx = el('div', 'learn-subindex');
    root.appendChild(subIdx);
    function updateSubIndex(unit, activeConceptId) {
      activeUnitId = unit.unit;
      subIdx.innerHTML = `<span class="sub-label">Unit ${esc(unit.unit)}:</span>` + unit.concepts.map((cc, i) =>
        `<button class="sub-dot ${cc.id === activeConceptId ? 'active' : ''}" data-cid="${esc(cc.id)}" title="${esc(cc.name)}">${i + 1}</button>`).join('');
      $$('[data-cid]', subIdx).forEach((btn) => { btn.onclick = () => openConcept(btn.dataset.cid); });
    }
    function $$(sel, root2) { return Array.from((root2 || document).querySelectorAll(sel)); }

    units.forEach((unit) => {
      const p = el('div', 'panel');
      p.id = 'learn-unit-' + unit.unit.replace(/[^a-zA-Z0-9]/g, '_');
      const doneCount = unit.concepts.filter((c) => studiedSet.has(c.id)).length;
      p.innerHTML = `<div class="panel-head"><span class="eyebrow">Unit ${esc(unit.unit)} · ${doneCount}/${unit.concepts.length} studied</span><h2>${esc(unit.title)}</h2></div>`;
      unit.concepts.forEach((c) => {
        const d = el('details', 'acc');
        d.id = cid(c.id);
        conceptEls[c.id] = d;
        const studied = studiedSet.has(c.id);
        const flatIdx = flat.findIndex((x) => x.c.id === c.id);
        const posInUnit = unit.concepts.findIndex((x) => x.id === c.id) + 1;

        d.innerHTML = `<summary><span class="concept-title">${esc(c.name)}</span><span class="studied-dot ${studied ? 'done' : ''}" title="${studied ? 'Studied' : 'Not yet studied'}"></span></summary>
          <div class="acc-body">
            <div class="concept-meta">Unit ${esc(unit.unit)} · concept ${posInUnit} of ${unit.concepts.length}</div>
            <div class="concept-stepper${studied ? ' stepper-done' : ''}">
              <button data-jump="context">${stepIcon('context')}Context</button><i></i>
              <button data-jump="core">${stepIcon('core')}Core</button><i></i>
              <button data-jump="examples">${stepIcon('examples')}Examples</button><i></i>
              <button data-jump="practice">${icon('check', 'step-icon')}Practice</button>
            </div>
            ${c.primer ? renderReadingBlock('Start from zero', c.primer, 'primer', cid(c.id) + '-context', { leadIn: true, highlightTerms: true }) : ''}
            <div class="concept-flow" id="${cid(c.id)}-core">
              <div class="core-formula-grid">
                <div class="flow-item flow-item-core"><span class="micro-label">Core idea</span><p>${esc(c.core)}</p></div>
                <div class="flow-item flow-item-formulas"><span class="micro-label">Key formulas</span>
                  <ul class="formula-list">${c.formulas.map((f) => `<li>${renderFormula(f)}</li>`).join('')}</ul></div>
              </div>
              <div class="flow-item"><span class="micro-label">When to use it</span><p>${esc(c.when)}</p></div>
              <div class="flow-item"><span class="micro-label">Intuition</span><p>${esc(c.intuition)}</p></div>
            </div>
            <div class="concept-transition"><span class="micro-label">Now that the pieces are in place</span></div>
            <div class="examples-flow" id="${cid(c.id)}-examples"></div>
            ${renderReadingBlock('Common trap', c.trap, 'prose-block')}
            <div class="concept-transition"><span class="micro-label">Try it yourself</span></div>
            <div class="checks" id="${cid(c.id)}-practice"></div>
            <div class="concept-nav-footer"></div>
          </div>`;

        // progressive worked-example reveal: Level 1 open, later levels locked behind their
        // own preview until the one before them opens — the same expandable-block accordion
        // used for the primer/solution text above, just in 'sequential' mode.
        const exBox = $('.examples-flow', d);
        const sortedEx = (c.examples || []).slice().sort((a, b) => a.level - b.level);
        exBox.innerHTML = renderExpandableBlocks(sortedEx.map((ex) => ({
          bodyHtml: `<span class="eyebrow">Level ${ex.level} — ${levelWord(ex.level)}</span>${renderPlainProseWithFormulas(ex.text)}`,
          preview: `Level ${ex.level} — ${levelWord(ex.level)}: ${previewWords(ex.text, 8)}`,
          ctaLabel: `Continue to Level ${ex.level} (${levelWord(ex.level)}) →`,
          collapseLabel: `Collapse Level ${ex.level}`,
          cardClass: 'lvl-' + ex.level
        })), { mode: 'sequential' });

        // section-jump stepper
        $$('.concept-stepper [data-jump]', d).forEach((btn) => {
          btn.onclick = () => {
            const target = $('#' + cid(c.id) + '-' + btn.dataset.jump, d);
            if (target) smoothScrollTo(target);
          };
        });

        // practice checks (unchanged mechanics, just re-targeted into #...-practice)
        const box = $('.checks', d);
        c.checks.forEach((chk, ci) => {
          const wrap = el('div', 'check-card');
          const lv = chk.level || 1;
          wrap.innerHTML = `<p class="mb-2"><span class="tag d${lv}">L${lv} ${levelWord(lv)}</span> ${esc(chk.q)}</p>`;
          chk.options.forEach((o, oi) => {
            const b = el('button', 'opt', `<span class="idx">${String.fromCharCode(65 + oi)}</span>${esc(o)}`);
            b.onclick = () => {
              Array.from(wrap.querySelectorAll('.opt')).forEach((x, xi) => {
                x.disabled = true;
                if (xi === chk.a) x.classList.add('right');
              });
              if (oi !== chk.a) b.classList.add('wrong');
              wrap.insertAdjacentHTML('beforeend', renderReadingBlock(oi === chk.a ? 'Correct' : 'Not quite', chk.why, 'prose-block'));
              S.recordAttempt({
                qid: 'lesson:' + c.id + ':' + ci, mode: 'Learn', testType: 'Learn',
                topic: unit.topic, subtopic: c.name, difficulty: lv, correct: oi === chk.a, timeSec: 0,
                targetTime: 30, hintUsed: false, confidence: 'Medium', track: S.activeTrack()
              });
              const dot = $('.studied-dot', d);
              if (dot) dot.classList.add('done');
              const stepper = $('.concept-stepper', d);
              if (stepper) stepper.classList.add('stepper-done');
            };
            wrap.appendChild(b);
          });
          box.appendChild(wrap);
        });

        // prev/next concept navigation — read from the shared flat list + conceptEls map,
        // both fully populated by the time any of these are actually clicked
        const navFooter = $('.concept-nav-footer', d);
        const prevEntry = flat[flatIdx - 1], nextEntry = flat[flatIdx + 1];
        if (prevEntry) {
          const pb = el('button', 'btn sm ghost concept-nav-btn', `← Previous: ${esc(prevEntry.c.name)}`);
          pb.onclick = () => openConcept(prevEntry.c.id);
          navFooter.appendChild(pb);
        } else { navFooter.appendChild(el('span')); }
        if (nextEntry) {
          const nb = el('button', 'btn sm ghost concept-nav-btn', `Next: ${esc(nextEntry.c.name)} →`);
          nb.onclick = () => openConcept(nextEntry.c.id);
          navFooter.appendChild(nb);
        }

        d.addEventListener('toggle', () => {
          if (d.open) {
            Object.values(conceptEls).forEach((other) => { if (other !== d) other.removeAttribute('open'); });
            updateSubIndex(unit, c.id);
          }
        });

        p.appendChild(d);
      });
      root.appendChild(p);
    });
  }

  /* ================================= DRILL ================================= */

  const drillState = { topic: '', subtopic: '', diffs: [2, 3], count: 10, timed: false, calc: true };

  function viewDrill(root) {
    const p = el('div', 'panel');
    p.innerHTML = `<div class="panel-head"><span class="eyebrow">Configure drill</span></div>
      <label class="field"><span>Topic</span><select id="d-topic">
        <option value="">All topics</option>
        ${S.topics().map((t) => `<option ${t === drillState.topic ? 'selected' : ''}>${esc(t)}</option>`).join('')}
      </select></label>
      <label class="field"><span>Subtopic</span><select id="d-sub"></select></label>
      <div class="eyebrow">Difficulty</div>
      <div class="chips mt-2 mb-3" id="d-diff">
        ${[1, 2, 3, 4, 5].map((d) => `<button class="chip ${drillState.diffs.includes(d) ? 'on' : ''}" data-d="${d}">Level ${d}</button>`).join('')}
      </div>
      <label class="field"><span>Number of questions</span>
        <select id="d-count">${[5, 10, 15, 20, 30].map((c) => `<option ${c === drillState.count ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
      <div class="chips mb-3">
        <button class="chip ${drillState.timed ? 'on' : ''}" id="d-timed">Timed to target</button>
        <button class="chip ${drillState.calc ? 'on' : ''}" id="d-calc">Calculator allowed</button>
      </div>`;
    const start = el('button', 'btn primary full', 'Start drill');
    p.appendChild(start);
    root.appendChild(p);

    const fillSubs = () => {
      const sel = $('#d-sub');
      const subs = S.subtopics(drillState.topic || null);
      sel.innerHTML = '<option value="">All subtopics</option>' + subs.map((x) => `<option ${x === drillState.subtopic ? 'selected' : ''}>${esc(x)}</option>`).join('');
    };
    fillSubs();
    $('#d-topic').onchange = (e) => { drillState.topic = e.target.value; drillState.subtopic = ''; fillSubs(); };
    $('#d-sub').onchange = (e) => { drillState.subtopic = e.target.value; };
    $('#d-count').onchange = (e) => { drillState.count = +e.target.value; };
    $('#d-diff').querySelectorAll('.chip').forEach((c) => {
      c.onclick = () => {
        const d = +c.dataset.d;
        const i = drillState.diffs.indexOf(d);
        if (i >= 0) { if (drillState.diffs.length > 1) drillState.diffs.splice(i, 1); }
        else drillState.diffs.push(d);
        c.classList.toggle('on', drillState.diffs.includes(d));
      };
    });
    $('#d-timed').onclick = (e) => { drillState.timed = !drillState.timed; e.target.classList.toggle('on', drillState.timed); };
    $('#d-calc').onclick = (e) => { drillState.calc = !drillState.calc; e.target.classList.toggle('on', drillState.calc); };

    start.onclick = () => {
      const items = S.buildSession({
        topics: drillState.topic ? [drillState.topic] : null,
        subtopic: drillState.subtopic || null,
        difficulties: drillState.diffs.slice(),
        count: drillState.count
      });
      if (!items.length) return toast('No questions match that combination.');
      startSession({
        items, mode: 'Drill', testType: 'Drill', allowHelp: true,
        title: 'Drill — ' + (drillState.topic || 'all topics') + (drillState.calc ? '' : ' · no calculator'),
        totalSeconds: drillState.timed ? items.reduce((s, q) => s + (q.targetTime || 90), 0) : null,
        returnTo: 'drill'
      });
    };

    const info = el('div', 'panel small muted');
    info.innerHTML = `<span class="eyebrow">Bank</span><p class="mt-2">
      ${S.allGenerators().length} parameterised generators · ${S.curated().length} curated hard questions ·
      ${S.topics().length} topics. Generated questions are built from controlled parameters, so every answer is exact.</p>`;
    root.appendChild(info);
  }

  /* ========================= PATTERN RECOGNITION =========================== */

  const patternState = { seconds: 20, count: 12 };

  function viewPattern(root) {
    if (patternState.run) return viewPatternRun(root);
    const p = el('div', 'panel');
    p.innerHTML = `<div class="panel-head"><span class="eyebrow">Pattern recognition</span></div>
      <p class="small muted">You are not asked to solve the problem. Classify the primary technique before the clock runs out. Recognition accuracy is tracked separately from calculation accuracy.</p>
      <label class="field"><span>Seconds per item</span>
        <select id="p-sec">${[15, 20, 25, 30].map((s) => `<option ${s === patternState.seconds ? 'selected' : ''}>${s}</option>`).join('')}</select></label>
      <label class="field"><span>Items</span>
        <select id="p-n">${[8, 12, 20, 30].map((s) => `<option ${s === patternState.count ? 'selected' : ''}>${s}</option>`).join('')}</select></label>`;
    const b = el('button', 'btn primary full', 'Start recognition set');
    p.appendChild(b);
    root.appendChild(p);

    const r = S.recognitionAccuracy();
    const st = el('div', 'grid c2', `
      <div class="stat"><span class="label">Recognition accuracy</span><span class="value">${r.accuracy}%</span><span class="sub">${r.n} items</span></div>
      <div class="stat"><span class="label">Calculation accuracy</span><span class="value">${S.summary().accuracy}%</span><span class="sub">${S.summary().total} attempts</span></div>`);
    root.appendChild(st);

    $('#p-sec').onchange = (e) => { patternState.seconds = +e.target.value; };
    $('#p-n').onchange = (e) => { patternState.count = +e.target.value; };
    b.onclick = () => {
      const items = S.buildSession({ count: patternState.count, difficulties: [2, 3, 4, 5], curatedShare: 0.5 })
        .filter((q) => q.recognitionTechnique);
      if (items.length < 3) return toast('Not enough classified questions available.');
      patternState.run = { items, idx: 0, answers: [], start: Date.now(), qStart: Date.now(), picked: null };
      render();
    };
  }

  function viewPatternRun(root) {
    const r = patternState.run;
    const q = r.items[r.idx];
    const p = el('div', 'panel');
    p.innerHTML = `<div class="flex between"><span class="eyebrow">Classify — item ${r.idx + 1}/${r.items.length}</span>
        <span id="pr-timer" class="timer"></span></div>
      <div class="progress mt-2"><i style="width:${(r.idx / r.items.length * 100).toFixed(1)}%"></i></div>
      <div class="qprompt mt-2">${/^\s*</.test(q.prompt) ? q.prompt : '<p>' + esc(q.prompt) + '</p>'}</div>`;
    root.appendChild(p);

    const box = el('div', 'panel');
    box.innerHTML = '<span class="eyebrow">Primary approach</span><div class="chips mt-2"></div>';
    const chips = $('.chips', box);
    S.TECHNIQUES.forEach((t) => {
      const c = el('button', 'chip', t);
      c.onclick = () => answerPattern(t);
      chips.appendChild(c);
    });
    root.appendChild(box);

    if (r.picked) {
      const ok = r.picked === q.recognitionTechnique;
      const f = el('div', 'panel');
      f.innerHTML = `<div class="verdict ${ok ? 'ok' : 'no'}"><span class="vmark">${ok ? icon('check', '') : '!'}</span>
        <span>${ok ? 'Correct' : 'Incorrect'} — primary approach: ${esc(q.recognitionTechnique)}</span></div>
        <div class="reveal"><span class="eyebrow">Why</span>${esc(q.approach || '')}</div>
        <div class="reveal"><span class="eyebrow">Trap</span>${esc(q.commonTrap || '—')}</div>`;
      const b = el('button', 'btn primary full', r.idx >= r.items.length - 1 ? 'Finish set' : 'Next item <kbd>N</kbd>');
      b.onclick = nextPattern;
      f.appendChild(b);
      root.appendChild(f);
    }

    stopTick();
    tickHandle = setInterval(() => {
      const t = $('#pr-timer');
      if (!t || !patternState.run) return stopTick();
      if (patternState.run.picked) { t.textContent = ''; return; }
      const left = patternState.seconds - (Date.now() - patternState.run.qStart) / 1000;
      t.textContent = fmtTime(left);
      t.className = 'timer' + (left < 6 ? ' danger' : '');
      if (left <= 0) answerPattern(null);
    }, 250);
  }

  function answerPattern(t) {
    const r = patternState.run;
    if (!r || r.picked) return;
    r.picked = t || '—';
    const q = r.items[r.idx];
    S.recordRecognition({
      qid: q.id, topic: q.topic, correct: t === q.recognitionTechnique,
      timeSec: (Date.now() - r.qStart) / 1000, picked: t, expected: q.recognitionTechnique
    });
    render();
  }
  function nextPattern() {
    const r = patternState.run;
    if (r.idx >= r.items.length - 1) {
      const acc = S.state.recognition.slice(-r.items.length);
      toast('Set complete: ' + acc.filter((x) => x.correct).length + '/' + r.items.length + ' classified correctly.');
      patternState.run = null;
      stopTick();
    } else { r.idx++; r.qStart = Date.now(); r.picked = null; }
    render();
  }

  /* ============================= MIXED PRACTICE ============================ */

  function viewMixed(root) {
    const modes = [
      { k: 'Easy', d: [1, 2], n: 12, help: true },
      { k: 'Medium', d: [2, 3], n: 12, help: true },
      { k: 'Hard', d: [4, 5], n: 10, help: true },
      { k: 'Wincent level', d: [3, 4, 5], n: 8, help: false, topics: ['Probability', 'Expected Value', 'Combinatorics', 'Order Statistics', 'Symmetry', 'Recursion', 'Optimal Strategy', 'Information Problems', 'Variance', 'Distributions', 'Game Theory'] },
      { k: 'SIG speed level', d: [1, 2, 3], n: 20, help: false, per: 55, topics: ['Mental Maths', 'Finance', 'Data Interpretation', 'Logic', 'Probability', 'Expected Value'] },
      { k: 'Fully mixed', d: [1, 2, 3, 4, 5], n: 15, help: true }
    ];
    const p = el('div', 'panel');
    p.innerHTML = '<div class="panel-head"><span class="eyebrow">Mixed practice</span></div><p class="small muted">The topic is hidden until you answer, so you have to recognise the structure yourself.</p>';
    const row = el('div', 'btn-row');
    modes.forEach((m) => {
      const b = el('button', 'btn', m.k);
      b.onclick = () => {
        const items = S.buildSession({ count: m.n, difficulties: m.d, topics: m.topics || null });
        startSession({
          items, mode: 'Mixed', testType: 'Mixed — ' + m.k, allowHelp: m.help,
          hideTopic: true, perQuestion: m.per || null,
          title: 'Mixed — ' + m.k, returnTo: 'mixed'
        });
      };
      row.appendChild(b);
    });
    p.appendChild(row);
    root.appendChild(p);

    const cm = S.confidenceMatrix();
    const q = el('div', 'panel');
    q.innerHTML = '<span class="eyebrow">Confidence calibration</span><div class="mt-2">' +
      bars(cm.rows.filter((r) => r.n)) + `</div>
      <div class="hr"></div>
      <div class="grid c2">
        <div class="stat"><span class="label">Confident errors</span><span class="value neg">${cm.confidentErrors}</span><span class="sub">high confidence, wrong</span></div>
        <div class="stat"><span class="label">Lucky correct</span><span class="value">${cm.luckyCorrect}</span><span class="sub">guess/low, right</span></div>
      </div>`;
    root.appendChild(q);
  }

  /* ================================= MOCKS ================================= */

  const sprintState = { seconds: 15, count: 15 };

  function viewMocks(root) {
    const track = S.activeTrack();

    /* --- Speed Sprint (reasoning track) --- */
    if (track === 'reasoning') {
      const sp = el('div', 'panel');
      sp.innerHTML = `<div class="panel-head"><span class="eyebrow">Speed Sprint</span><h2>Fast numerical / abstract / logical / verbal reasoning</h2></div>
        <p class="small muted">One question at a time, a short hard timer per question, no skipping back, no hints. This is the format real speed-reasoning assessments use — the clock is the whole point.</p>
        <label class="field"><span>Seconds per question</span><select id="sprint-sec">
          ${[12, 15, 18, 20].map((s) => `<option ${s === sprintState.seconds ? 'selected' : ''}>${s}</option>`).join('')}</select></label>
        <label class="field"><span>Questions</span><select id="sprint-n">
          ${[10, 15, 20, 25].map((n) => `<option ${n === sprintState.count ? 'selected' : ''}>${n}</option>`).join('')}</select></label>`;
      const spb = el('button', 'btn primary full', 'Start Speed Sprint');
      spb.onclick = () => {
        sprintState.seconds = +$('#sprint-sec', sp).value;
        sprintState.count = +$('#sprint-n', sp).value;
        const items = S.buildSession({ count: sprintState.count, difficulties: [1, 2, 3, 4, 5] });
        if (!items.length) return toast('No reasoning-track questions available.');
        startSession({
          items, mode: 'Mock', testType: 'Speed Sprint', allowHelp: false, deferFeedback: true, noSkip: true,
          perQuestion: sprintState.seconds, totalSeconds: items.length * sprintState.seconds,
          title: 'SPEED SPRINT — ' + items.length + ' questions / ' + sprintState.seconds + 's each',
          onFinish: (recs, elapsed) => finishMock('Speed Sprint', recs, elapsed)
        });
      };
      sp.appendChild(spb);
      root.appendChild(sp);
    }

    /* --- Wincent / SIG / IMC / McKinsey prep (quant track only — these mocks are defined
       around quant-track topic names and have no matching content on other tracks) --- */
    const set = S.state.settings;
    if (track === 'quant') {
    const w = el('div', 'panel');
    w.innerHTML = `<div class="panel-head"><span class="eyebrow">Wincent mock</span><h2>12 questions · 100 minutes</h2></div>
      <p class="small muted">Substantial probability and mathematical reasoning. No hints, no solutions until submission. Target pace is roughly 8 minutes per question.</p>`;
    const wb = el('button', 'btn primary full', 'Start Wincent mock');
    wb.onclick = () => {
      const items = S.buildSession({
        count: 12, difficulties: [3, 4, 5], curatedShare: 0.6,
        topics: ['Probability', 'Expected Value', 'Combinatorics', 'Order Statistics', 'Symmetry',
          'Recursion', 'Optimal Strategy', 'Information Problems', 'Variance', 'Distributions', 'Game Theory']
      });
      if (!items.length) return toast('No questions match that combination.');
      startSession({
        items, mode: 'Mock', testType: 'Wincent', allowHelp: false, deferFeedback: true,
        totalSeconds: 100 * 60, title: 'WINCENT MOCK — 12 questions / 100 min',
        onFinish: (recs, elapsed) => finishMock('Wincent', recs, elapsed)
      });
    };
    w.appendChild(wb);
    root.appendChild(w);

    const g = el('div', 'panel');
    g.innerHTML = `<div class="panel-head"><span class="eyebrow">SIG mock</span><h2>${set.sigMinutes} minutes · no skipping</h2></div>
      <p class="small muted">One total timer. Once an answer is submitted the test moves on and cannot go back. Speed and accuracy both count.</p>
      <label class="field"><span>Questions</span><select id="sig-n">
        ${[15, 20, 25, 30].map((n) => `<option ${n === set.sigCount ? 'selected' : ''}>${n}</option>`).join('')}</select></label>`;
    const gb = el('button', 'btn primary full', 'Start SIG mock');
    gb.onclick = () => {
      const n = +$('#sig-n').value;
      set.sigCount = n; S.save();
      const items = S.buildSession({
        count: n, difficulties: [1, 2, 3],
        topics: ['Mental Maths', 'Finance', 'Data Interpretation', 'Logic', 'Probability', 'Expected Value', 'Market Making']
      });
      if (!items.length) return toast('No questions match that combination.');
      startSession({
        items, mode: 'Mock', testType: 'SIG', allowHelp: false, deferFeedback: true, noSkip: true,
        totalSeconds: set.sigMinutes * 60, title: 'SIG MOCK — ' + n + ' questions / ' + set.sigMinutes + ' min',
        onFinish: (recs, elapsed) => finishMock('SIG', recs, elapsed)
      });
    };
    g.appendChild(gb);
    root.appendChild(g);

    /* --- IMC --- */
    const imc = set.imc;
    const i = el('div', 'panel');
    i.innerHTML = `<div class="panel-head"><span class="eyebrow">IMC mock — provisional</span><h2>${esc(imc.label)}</h2></div>
      <p class="small muted">The real structure is unknown. This framework is defined by a single JS object
      (<code>settings.imc</code>) and can be edited below or in <code>js/store.js</code> once you have the official practice assessment.</p>
      <ul class="list">${imc.sections.map((sec) =>
      `<li>${esc(sec.name)} <span class="dim mono-sm" style="float:right">${sec.count} q · ${sec.seconds}s each</span></li>`).join('')}</ul>`;
    const ib = el('button', 'btn primary full', 'Start IMC mock');
    ib.onclick = () => {
      let items = [];
      imc.sections.forEach((sec) => {
        items = items.concat(S.buildSession({ count: sec.count, topics: sec.topics, difficulties: [1, 2, 3, 4] })
          .map((q) => Object.assign(q, { targetTime: sec.seconds, section: sec.name })));
      });
      startSession({
        items, mode: 'Mock', testType: 'IMC', allowHelp: false, deferFeedback: true,
        totalSeconds: imc.totalMinutes * 60, title: 'IMC MOCK (provisional)',
        onFinish: (recs, elapsed) => finishMock('IMC', recs, elapsed)
      });
    };
    i.appendChild(ib);
    root.appendChild(i);

    /* --- McKinsey-style --- */
    const k = el('div', 'panel');
    k.innerHTML = `<div class="panel-head"><span class="eyebrow">McKinsey Solve preparation</span><h2>Analogous exercises only</h2></div>
      <p class="small muted">These are original exercises built to train the same underlying skills. They do not reproduce or imitate any proprietary assessment content, and this section is kept separate from the quantitative trading material.</p>`;
    const krow = el('div', 'btn-row');
    [['A · Data interpretation sprint', ['Data Interpretation'], 10, 75],
    ['B · Constraint optimisation', ['Constraint Optimisation'], 6, 150],
    ['C · Structured decisions', ['Structured Decisions'], 6, 110]].forEach(([label, topics, n, per]) => {
      const b = el('button', 'btn', label);
      b.onclick = () => {
        const items = S.buildSession({ count: n, topics, difficulties: [2, 3, 4] });
        startSession({
          items, mode: 'Mock', testType: 'McKinsey prep', allowHelp: false, deferFeedback: true,
          perQuestion: per, totalSeconds: n * per, title: label,
          onFinish: (recs, elapsed) => finishMock('McKinsey prep', recs, elapsed)
        });
      };
      krow.appendChild(b);
    });
    k.appendChild(krow);
    root.appendChild(k);
    }

    /* --- history --- */
    const hist = S.state.mocks.slice().reverse();
    const h = el('div', 'panel');
    h.innerHTML = '<span class="eyebrow">Mock history</span>' + (hist.length
      ? '<ul class="list">' + hist.map((m) => `<li>${esc(m.type)} — <strong>${m.score}/${m.total}</strong>
          <span class="dim mono-sm" style="float:right">${new Date(m.ts).toLocaleString()} · ${fmtTime(m.timeSec)}${m.rating !== null && m.rating !== undefined ? ' · internal ' + m.rating : ''}</span></li>`).join('') + '</ul>'
      : '<div class="empty">No mocks yet.</div>');
    root.appendChild(h);
  }

  let lastMockReport = null;

  function finishMock(type, recs, elapsed) {
    const done = recs.filter(Boolean);
    const score = done.filter((r) => r.correct).length;
    const total = done.length;
    const rating = S.internalRating(type, total ? score / total : 0);
    S.recordMock({ type, score, total, timeSec: Math.round(elapsed), rating });
    lastMockReport = { type, recs: done, score, total, elapsed, rating };
    go('mockreport');
  }

  function viewMockReport(root) {
    const r = lastMockReport;
    if (!r) { go('mocks'); return; }
    const perMin = r.elapsed > 0 ? (r.total / (r.elapsed / 60)) : 0;
    const slow = r.recs.filter((x) => x.q.targetTime && x.timeSec > x.q.targetTime * 1.5);
    const topicRows = (() => {
      const m = {};
      r.recs.forEach((x) => {
        m[x.q.topic] = m[x.q.topic] || { n: 0, c: 0 };
        m[x.q.topic].n++; if (x.correct) m[x.q.topic].c++;
      });
      return Object.keys(m).map((k) => ({ key: k, n: m[k].n, accuracy: Math.round(100 * m[k].c / m[k].n) }))
        .sort((a, b) => a.accuracy - b.accuracy);
    })();

    const head = el('div', 'panel');
    head.innerHTML = `<div class="panel-head"><span class="eyebrow">${esc(r.type)} mock result</span></div>
      <div class="grid c4">
        <div class="stat accent"><span class="label">Score</span><span class="value">${r.score}/${r.total}</span></div>
        <div class="stat"><span class="label">Time</span><span class="value">${fmtTime(r.elapsed)}</span></div>
        <div class="stat"><span class="label">Pace</span><span class="value">${perMin.toFixed(2)}</span><span class="sub">q / minute</span></div>
        <div class="stat"><span class="label">Internal rating</span><span class="value">${r.rating === null || r.rating === undefined ? '—' : r.rating}</span><span class="sub">vs your own history</span></div>
      </div>
      <p class="small dim mt-2">The internal rating compares this attempt only with your own previous mocks of the same type. It is not a prediction of any employer's score.</p>`;
    root.appendChild(head);

    if (r.rating === 100) {
      const ms = el('div', 'milestone');
      ms.innerHTML = `<span class="mic">${icon('flame', 'navicon')}</span>
        <span class="mtext">Your best <strong>${esc(r.type)}</strong> result yet — ahead of every previous attempt at this mock.</span>`;
      root.insertBefore(ms, head);
    } else if (r.rating === null || r.rating === undefined) {
      const ms = el('div', 'milestone');
      ms.innerHTML = `<span class="mic">${icon('check', 'navicon')}</span>
        <span class="mtext">First <strong>${esc(r.type)}</strong> mock recorded — future attempts will be compared against this one.</span>`;
      root.insertBefore(ms, head);
    }

    const br = el('div', 'panel');
    br.innerHTML = '<span class="eyebrow">Topic breakdown</span><div class="mt-2">' + bars(topicRows) + '</div>' +
      (slow.length ? `<div class="hr"></div><span class="eyebrow">Inefficient method — well over target time</span>
        <ul class="list">${slow.map((x) => `<li>${esc(x.q.topic)} — ${fmtTime(x.timeSec)} vs ${fmtTime(x.q.targetTime)}
          <span class="dim mono-sm" style="float:right">${esc(x.q.recognitionTechnique || '')}</span></li>`).join('')}</ul>` : '');
    root.appendChild(br);

    r.recs.forEach((x, i) => {
      const p = el('div', 'panel');
      p.innerHTML = `<div class="qmeta"><span class="tag d${x.q.difficulty}">L${x.q.difficulty}</span>
          <span class="tag">${esc(x.q.topic)}</span><span>${fmtTime(x.timeSec)}</span></div>
        <div class="verdict ${x.correct ? 'ok' : 'no'}">Q${i + 1} — ${x.correct ? 'correct' : 'incorrect'}
          · your answer ${x.given === null ? '—' : esc(String(x.given))} · correct ${esc(String(x.q.correctAnswer))}</div>
        <div class="qprompt small">${/^\s*</.test(x.q.prompt) ? x.q.prompt : '<p>' + esc(x.q.prompt) + '</p>'}</div>
        ${renderReadingBlock('Solution', x.q.solution, 'prose-block')}
        <div class="reveal"><span class="eyebrow">Technique</span>${esc(x.q.recognitionTechnique || '')} — ${esc(x.q.approach || '')}</div>`;
      root.appendChild(p);
    });

    const b = el('button', 'btn primary full', 'Back to mocks');
    b.onclick = () => go('mocks');
    root.appendChild(b);
  }

  /* Generic, lightweight completion screen for non-mock sessions (Drill/Mixed/Adaptive/
     Redo). Every session now ends here instead of silently bouncing back — the whole
     point is to leave visible, comparative evidence of the session rather than a bare
     stat dump. */
  function viewSessionReport(root) {
    const r = lastSessionReport;
    if (!r) { go('dashboard'); return; }
    const cfg = r.cfg;
    const accuracy = Math.round(100 * r.score / r.total);
    const topicCounts = {};
    r.recs.forEach((x) => { topicCounts[x.q.topic] = (topicCounts[x.q.topic] || 0) + 1; });
    const topics = Object.keys(topicCounts);
    const topic = topics.length === 1 ? topics[0] : 'Mixed';
    const cmp = S.sessionComparison(cfg.mode, topic);

    if (cmp && cmp.isPersonalBest) {
      const ms = el('div', 'milestone');
      ms.innerHTML = `<span class="mic">${icon('flame', 'navicon')}</span>
        <span class="mtext">New best for <strong>${esc(topic)}</strong> ${esc(cfg.mode)} sessions —
        ${accuracy}% beats your previous best of ${cmp.bestPrior}%.</span>`;
      root.appendChild(ms);
    }

    const head = el('div', 'panel');
    head.innerHTML = `<div class="panel-head"><span class="eyebrow">${esc(cfg.title || cfg.mode)} — complete</span></div>
      <div class="grid c3">
        <div class="stat accent"><span class="label">Score</span><span class="value">${r.score}/${r.total}</span><span class="sub">${accuracy}%</span></div>
        <div class="stat"><span class="label">Time</span><span class="value">${fmtTime(r.elapsed)}</span></div>
        <div class="stat brand"><span class="label">${cmp ? 'vs your average' : 'Topic'}</span>
          <span class="value" style="font-size:var(--fs-lg)">${cmp ? (cmp.deltaVsAvg >= 0 ? '+' : '') + cmp.deltaVsAvg + '%' : esc(topic)}</span>
          <span class="sub">${cmp ? 'avg ' + cmp.avgPrior + '%' : ''}</span></div>
      </div>`;
    root.appendChild(head);

    const wrong = r.recs.filter((x) => !x.correct);
    if (wrong.length) {
      const wp = el('div', 'panel');
      wp.innerHTML = '<span class="eyebrow">Missed this session</span><ul class="list">' +
        wrong.map((x) => `<li>${esc(x.q.topic)} <span class="dim mono-sm ml-2">${esc(x.q.subtopic || '')}</span>
          <span class="neg mono-sm right" style="float:right">L${x.q.difficulty}</span></li>`).join('') + '</ul>';
      root.appendChild(wp);
    }

    const row = el('div', 'btn-row');
    const again = el('button', 'btn', 'Do another set');
    again.onclick = () => startSession({
      items: S.weaknessSession(Math.max(4, r.total)), mode: 'Adaptive', testType: 'Adaptive',
      allowHelp: true, title: 'Adaptive — train my weaknesses', returnTo: cfg.returnTo
    });
    row.appendChild(again);
    const cont = el('button', 'btn primary', 'Continue');
    cont.onclick = () => go(cfg.returnTo || 'dashboard');
    row.appendChild(cont);
    root.appendChild(row);
  }

  /* ================================ MISTAKES =============================== */

  function viewMistakes(root) {
    const wrong = S.state.attempts.filter((a) => !a.correct).slice().reverse();
    const eb = S.errorBreakdown();

    const p = el('div', 'panel');
    p.innerHTML = '<span class="eyebrow">Error types</span><div class="mt-2">' +
      bars(eb, { field: 'n', max: Math.max(1, Math.max.apply(null, eb.map((e) => e.n))), plain: true, fmt: (r) => r.n }) + '</div>';
    const redo = el('button', 'btn primary full', 'Redo mistakes (spaced repetition)');
    redo.style.marginTop = '10px';
    redo.onclick = () => {
      const ids = Array.from(new Set(wrong.map((a) => a.qid)));
      const cur = S.curated().filter((q) => ids.includes(q.id));
      const baseIds = Array.from(new Set(wrong.map((a) => a.baseId).filter(Boolean)));
      const regen = S.allGenerators().filter((g) => baseIds.includes(g.id)).map((g) => S.instantiate(g));
      const items = cur.concat(regen).slice(0, 15);
      if (!items.length) return toast('No mistakes recorded yet.');
      startSession({ items, mode: 'Redo', testType: 'Redo', allowHelp: true, title: 'Redo mistakes', returnTo: 'mistakes' });
    };
    p.appendChild(redo);
    root.appendChild(p);

    const list = el('div', 'panel');
    list.innerHTML = '<span class="eyebrow">Error log</span>';
    if (!wrong.length) list.innerHTML += '<div class="empty">No mistakes logged. Take a drill to populate this.</div>';
    wrong.slice(0, 60).forEach((a) => {
      const d = el('details', 'acc');
      d.innerHTML = `<summary>${esc(a.topic || '—')} <span class="dim mono-sm" style="margin-left:auto">${new Date(a.ts).toLocaleDateString()}</span></summary>
        <div class="acc-body">
          <p class="small muted">${esc(a.subtopic || '')} · level ${a.difficulty} · ${a.timeSec}s · confidence ${esc(a.confidence || '—')}
            ${a.hintUsed ? '· hint used' : ''}</p>
          <p class="small">Your answer <strong>${a.given === null || a.given === undefined ? '—' : esc(String(a.given))}</strong>
            · correct <strong>${esc(String(a.expected))}</strong></p>
          <label class="field"><span>Error classification</span>
            <select data-aid="${a.aid}">${S.ERROR_TYPES.map((t) => `<option ${t === a.errorType ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
        </div>`;
      $('select', d).onchange = (e) => { S.setErrorType(a.aid, e.target.value); toast('Reclassified.'); };
      list.appendChild(d);
    });
    root.appendChild(list);
  }

  /* ================================= SHEET ================================= */

  function viewSheet(root) {
    const note = el('div', 'panel small muted');
    note.innerHTML = '<span class="eyebrow">Preparation only</span><p class="mt-2">This sheet is a study aid. Do not use it during any real assessment.</p>';
    root.appendChild(note);
    global.QTL_FORMULAS.forEach((g) => {
      const p = el('div', 'panel');
      p.innerHTML = `<div class="panel-head"><span class="eyebrow">${esc(g.group)}</span></div>`;
      const grid = el('div', 'formula-sheet-grid');
      grid.innerHTML = g.items.map((it) => `
        <div class="formula-sheet-card">
          <span class="formula-card-title">${esc(it.t)}</span>
          <p class="formula-card-trigger">${esc(it.trigger)}</p>
          <div class="formula-card-body">${renderFormula(it.body)}</div>
        </div>`).join('');
      p.appendChild(grid);
      root.appendChild(p);
    });
  }

  /* ================================= STATS ================================= */

  function viewStats(root) {
    const days = S.perDay();
    const rd = S.readiness();
    const cm = S.confidenceMatrix();
    const rec = S.recognitionAccuracy();

    const a = el('div', 'grid c2');
    const p1 = el('div', 'panel');
    p1.innerHTML = '<span class="eyebrow">Accuracy over time (daily %)</span>' +
      lineChart(days.map((d) => ({ y: d.accuracy })), { max: 100, label: 'daily accuracy' });
    const p2 = el('div', 'panel');
    p2.innerHTML = '<span class="eyebrow">Speed over time (avg s/question)</span>' +
      lineChart(days.map((d) => ({ y: d.avgTime })), { label: 'avg seconds' });
    a.appendChild(p1); a.appendChild(p2);
    root.appendChild(a);

    const b = el('div', 'grid c2');
    const p3 = el('div', 'panel');
    p3.innerHTML = '<span class="eyebrow">Questions completed per day</span>' +
      barChart(days.map((d) => ({ key: d.date.slice(5), n: d.n })), { label: 'questions/day' });
    const p4 = el('div', 'panel');
    p4.innerHTML = '<span class="eyebrow">Mock performance (%)</span>' +
      lineChart(S.state.mocks.map((m) => ({ y: Math.round(100 * m.score / Math.max(1, m.total)) })), { max: 100, label: 'mock score' });
    b.appendChild(p3); b.appendChild(p4);
    root.appendChild(b);

    const c = el('div', 'grid c2');
    const p5 = el('div', 'panel');
    p5.innerHTML = '<span class="eyebrow">Accuracy by topic</span><div class="mt-2">' + bars(S.byKey('topic')) + '</div>';
    const p6 = el('div', 'panel');
    p6.innerHTML = '<span class="eyebrow">Average time by topic (s)</span><div class="mt-2">' +
      bars(S.byKey('topic'), { field: 'avgTime', max: Math.max(30, Math.max.apply(null, S.byKey('topic').map((r) => r.avgTime) || [30])), plain: true, fmt: (r) => r.avgTime + 's' }) + '</div>';
    c.appendChild(p5); c.appendChild(p6);
    root.appendChild(c);

    const d = el('div', 'panel');
    d.innerHTML = `<span class="eyebrow">Recognition vs calculation</span>
      <div class="grid c2 mt-2">
        <div class="stat"><span class="label">Recognition</span><span class="value">${rec.accuracy}%</span><span class="sub">${rec.n} items</span></div>
        <div class="stat"><span class="label">Calculation</span><span class="value">${S.summary().accuracy}%</span><span class="sub">${S.summary().total} attempts</span></div>
      </div>
      <div class="hr"></div>
      <span class="eyebrow">Confidence calibration</span><div class="mt-2">${bars(cm.rows.filter((r) => r.n))}</div>
      <p class="small muted mt-2">Confident errors: <strong class="neg">${cm.confidentErrors}</strong> ·
        low-confidence correct: <strong>${cm.luckyCorrect}</strong></p>`;
    root.appendChild(d);

    const e = el('div', 'panel');
    e.innerHTML = `<span class="eyebrow">Readiness scores</span>
      <p class="small muted mt-2">Internal progress metrics only. They do not predict employer test outcomes.</p>
      <div class="grid c3 mt-2">
        <div class="stat accent"><span class="label">Wincent</span><span class="value">${rd.wincent}</span></div>
        <div class="stat accent"><span class="label">SIG</span><span class="value">${rd.sig}</span></div>
        <div class="stat accent"><span class="label">IMC</span><span class="value">${rd.imc}</span></div>
      </div>
      <div class="hr"></div>
      <div class="small muted mono-sm">components — hard accuracy ${rd.parts.hardAcc}% · recognition ${rd.parts.rec}% ·
        within target time ${rd.parts.speed}% · speed-set accuracy ${rd.parts.sigAcc}% · throughput ${rd.parts.throughput} · finance ${rd.parts.finAcc}%</div>`;
    root.appendChild(e);

    const f = el('div', 'panel');
    f.innerHTML = '<span class="eyebrow">Error types</span><div class="mt-2">' +
      bars(S.errorBreakdown(), { field: 'n', max: Math.max(1, Math.max.apply(null, S.errorBreakdown().map((x) => x.n).concat([1]))), plain: true, fmt: (r) => r.n }) + '</div>';
    root.appendChild(f);
  }

  /* ================================ SETTINGS =============================== */

  function viewSettings(root) {
    const set = S.state.settings;

    const t = el('div', 'panel');
    t.innerHTML = '<span class="eyebrow">Appearance</span>';
    const tb = el('button', 'btn full', 'Toggle dark / light theme');
    tb.style.marginTop = '8px';
    tb.onclick = toggleTheme;
    t.appendChild(tb);
    root.appendChild(t);

    const w = el('div', 'panel');
    w.innerHTML = `<span class="eyebrow">Readiness weights</span>
      <p class="small muted mt-2">Weights are relative; they are normalised automatically.</p>`;
    Object.keys(set.weights).forEach((test) => {
      const grp = el('div');
      grp.innerHTML = `<div class="eyebrow mt-3 mb-2">${test.toUpperCase()}</div>`;
      Object.keys(set.weights[test]).forEach((k) => {
        const lab = el('label', 'field');
        lab.innerHTML = `<span>${k}</span><input type="number" min="0" max="100" value="${set.weights[test][k]}">`;
        $('input', lab).onchange = (e) => { set.weights[test][k] = Math.max(0, +e.target.value || 0); S.save(); toast('Weights updated.'); };
        grp.appendChild(lab);
      });
      w.appendChild(grp);
    });
    root.appendChild(w);

    const i = el('div', 'panel');
    i.innerHTML = `<span class="eyebrow">IMC mock configuration</span>
      <p class="small muted mt-2">Edit the JSON below and save once you know the real structure. Topics must match topic names used by the bank.</p>
      <textarea id="imc-json">${esc(JSON.stringify(set.imc, null, 2))}</textarea>`;
    const ib = el('button', 'btn full', 'Save IMC configuration');
    ib.onclick = () => {
      try {
        const obj = JSON.parse($('#imc-json').value);
        if (!obj.sections || !Array.isArray(obj.sections)) throw new Error('sections missing');
        set.imc = obj; S.save(); toast('IMC configuration saved.');
      } catch (e) { toast('Invalid JSON: ' + e.message); }
    };
    i.appendChild(ib);
    root.appendChild(i);

    const sg = el('div', 'panel');
    sg.innerHTML = `<span class="eyebrow">SIG mock</span>
      <label class="field"><span>Total minutes</span><input type="number" id="sig-min" value="${set.sigMinutes}" min="1" max="120"></label>`;
    $('#sig-min', sg).onchange = (e) => { set.sigMinutes = Math.max(1, +e.target.value || 23); S.save(); toast('Saved.'); };
    root.appendChild(sg);

    const d = el('div', 'panel');
    d.innerHTML = '<span class="eyebrow">Data</span>';
    const row = el('div', 'btn-row');
    row.style.marginTop = '8px';
    const dl = (name, text, type) => {
      const blob = new Blob([text], { type });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    };
    const bj = el('button', 'btn', 'Export progress (JSON)');
    bj.onclick = () => dl('quant-test-lab-progress.json', S.exportJSON(), 'application/json');
    const bc = el('button', 'btn', 'Export attempts (CSV)');
    bc.onclick = () => dl('quant-test-lab-attempts.csv', S.exportCSV(), 'text/csv');
    const bi = el('button', 'btn', 'Import progress (JSON)');
    bi.onclick = () => $('#import-file').click();
    const br = el('button', 'btn ghost', 'Reset all data');
    br.onclick = () => {
      if (confirm('Delete all stored progress? This cannot be undone.')) { S.reset(); toast('All data cleared.'); render(); }
    };
    [bj, bc, bi, br].forEach((b) => row.appendChild(b));
    d.appendChild(row);
    const inp = el('input');
    inp.type = 'file'; inp.id = 'import-file'; inp.accept = '.json,application/json'; inp.style.display = 'none';
    inp.onchange = (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        try { S.importJSON(r.result); toast('Progress imported.'); render(); }
        catch (err) { toast('Import failed: ' + err.message); }
      };
      r.readAsText(f);
    };
    d.appendChild(inp);
    root.appendChild(d);

    const about = el('div', 'panel small muted');
    about.innerHTML = `<span class="eyebrow">About</span>
      <p class="mt-2">Quant Test Lab runs entirely in your browser. All progress is stored in localStorage on this device,
      so exporting the JSON periodically is the only backup. No network requests are made after the first load.</p>
      <p>${S.allGenerators().length} generators · ${S.curated().length} curated questions · ${S.state.attempts.length} attempts recorded.</p>`;
    root.appendChild(about);
  }

  /* ================================= SHELL ================================= */

  function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', cur);
    S.state.settings.theme = cur; S.save();
  }

  function go(view) {
    if (session && view !== 'runner') { session = null; stopTick(); }
    current = view;
    if (VIEWS.some((v) => v.id === view)) S.setLastView(S.activeTrack(), view);
    render();
    window.scrollTo(0, 0);
  }

  function render() {
    const main = $('#main');
    main.innerHTML = '';
    const view = session ? 'runner' : current;

    if (view !== 'runner') {
      const meta = VIEWS.find((v) => v.id === view);
      if (meta) {
        const h = el('div');
        h.style.margin = '2px 0 12px';
        h.innerHTML = `<h1>${esc(meta.title)}</h1>`;
        main.appendChild(h);
      }
    }

    ({
      runner: viewRunner, dashboard: viewDashboard, learn: viewLearn, drill: viewDrill,
      pattern: viewPattern, mixed: viewMixed, mocks: viewMocks, mockreport: viewMockReport,
      sessionreport: viewSessionReport,
      mistakes: viewMistakes, sheet: viewSheet, stats: viewStats, settings: viewSettings
    }[view] || viewDashboard)(main);

    document.querySelectorAll('[data-nav]').forEach((b) => {
      b.classList.toggle('active', b.dataset.nav === current);
    });
    const moreBtn = $('#more-tab');
    if (moreBtn) moreBtn.classList.toggle('active', VIEWS.some((v) => v.id === current && v.group === 'secondary'));
    if (view !== 'runner' && view !== 'pattern') stopTick();
  }

  /* ------------------------------- bottom sheets ---------------------------- */

  function openSheet(id) {
    const bd = $('#' + id + '-backdrop'), sh = $('#' + id);
    if (!bd || !sh) return;
    bd.classList.add('show'); sh.classList.add('show');
  }
  function closeSheet(id) {
    const bd = $('#' + id + '-backdrop'), sh = $('#' + id);
    if (!bd || !sh) return;
    bd.classList.remove('show'); sh.classList.remove('show');
  }
  function mountSheet(id, cls, innerHTML) {
    let bd = $('#' + id + '-backdrop');
    if (!bd) {
      bd = el('div', 'more-sheet-backdrop'); bd.id = id + '-backdrop';
      bd.onclick = () => closeSheet(id);
      document.body.appendChild(bd);
    }
    let sh = $('#' + id);
    if (!sh) { sh = el('div', 'more-sheet ' + cls); sh.id = id; document.body.appendChild(sh); }
    sh.innerHTML = '<div class="sheet-grab"></div>' + innerHTML;
    return sh;
  }

  function buildMoreSheet() {
    const items = VIEWS.filter((v) => v.group === 'secondary');
    const groups = {};
    items.forEach((v) => { (groups[v.navgroup] = groups[v.navgroup] || []).push(v); });
    const body = Object.keys(groups).map((g) => `
      <div class="eyebrow mb-2 ${g === Object.keys(groups)[0] ? '' : 'mt-3'}">${esc(g)}</div>
      <div class="sheet-grid">${groups[g].map((v) => `
        <button class="sheet-item ${v.id === current ? 'active' : ''}" data-nav-sheet="${v.id}">
          ${icon(v.id, 'navicon')}<span>${esc(v.title)}</span>
        </button>`).join('')}</div>`).join('');
    const sh = mountSheet('more-sheet', '', body);
    sh.querySelectorAll('[data-nav-sheet]').forEach((b) => {
      b.onclick = () => { closeSheet('more-sheet'); go(b.dataset.navSheet); };
    });
  }

  function buildNav() {
    const tab = $('#tabbar'), side = $('#sidenav');
    tab.innerHTML = ''; side.innerHTML = '';

    VIEWS.filter((v) => v.group === 'primary').forEach((v) => {
      const a = el('button', '', `${icon(v.id, 'navicon')}<span>${esc(v.label)}</span>`);
      a.dataset.nav = v.id;
      a.onclick = () => go(v.id);
      tab.appendChild(a);
    });
    const moreTab = el('button', '', `${icon('more', 'navicon')}<span>More</span>`);
    moreTab.id = 'more-tab';
    moreTab.onclick = () => { buildMoreSheet(); openSheet('more-sheet'); };
    tab.appendChild(moreTab);

    let lastGroup = null;
    VIEWS.forEach((v, i) => {
      const g = v.navgroup;
      if (g !== lastGroup) {
        const lbl = el('div', 'navgroup-label', esc(g));
        side.appendChild(lbl);
        lastGroup = g;
      }
      const b = el('button', '', `${icon(v.id, 'navicon')}<span>${esc(v.title)}</span><span class="k">${i + 1 === 10 ? '0' : i + 1}</span>`);
      b.dataset.nav = v.id;
      b.onclick = () => go(v.id);
      side.appendChild(b);
    });
  }

  function keys(e) {
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) {
      if (e.key === 'Escape') e.target.blur();
      return;
    }
    if (e.key >= '1' && e.key <= '9' || e.key === '0') {
      if (session) {
        // answer MC by number
        const q = session.items[session.idx];
        if (q && q.answerType === 'mc' && !session.records[session.idx]) {
          const i = (e.key === '0' ? 10 : +e.key) - 1;
          if (q.options[i]) return submitAnswer(q.options[i]);
        }
        return;
      }
      const i = (e.key === '0' ? 10 : +e.key) - 1;
      if (VIEWS[i]) go(VIEWS[i].id);
      return;
    }
    const k = e.key.toLowerCase();
    if (session) {
      if (k === 'n') {
        if (session.records[session.idx]) (session.idx >= session.items.length - 1 ? finishAndRecord() : nextQuestion());
      } else if (k === 'h' && session.cfg.allowHelp) {
        const b = Array.from(document.querySelectorAll('.btn')).find((x) => x.textContent.trim() === 'Hint');
        if (b && !b.disabled) b.click();
      } else if (k === 'f') {
        session.flags[session.idx] = !session.flags[session.idx]; render();
      }
    } else if (patternState.run && k === 'n') nextPattern();
    if (k === 't') toggleTheme();
  }

  function ring(pct, opts) {
    opts = opts || {};
    const size = opts.size || 40, sw = opts.stroke || 4;
    const r = (size - sw) / 2, c = 2 * Math.PI * r;
    const v = Math.max(0, Math.min(100, pct || 0));
    const off = c * (1 - v / 100);
    return `<span class="ring-label" style="width:${size}px;height:${size}px">
      <svg class="ring${opts.accent ? ' accent' : ''}" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle class="track" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${sw}"/>
        <circle class="val" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${sw}"
          stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"
          transform="rotate(-90 ${size / 2} ${size / 2})"/>
      </svg>
      ${opts.showNum === false ? '' : `<span class="num" style="font-size:${Math.max(10, size * 0.28)}px">${Math.round(v)}</span>`}
    </span>`;
  }

  function buildTrackSheet() {
    const active = S.activeTrack();
    const body = '<div class="sheet-grid">' + S.tracks().map((t) => {
      const sum = S.trackSummary(t.id);
      const started = sum.total > 0;
      return `<button class="track-card ${t.id === active ? 'active' : ''}" data-track="${esc(t.id)}">
        <span class="ic">${trackIcon(t.id)}</span>
        <span class="body">
          <span class="name">${esc(t.label)}</span>
          <span class="meta">${started ? sum.total + ' answered · ' + sum.accuracy + '% accuracy' : 'Not started yet'}</span>
        </span>
        <span class="ring-wrap">${started ? ring(sum.accuracy, { size: 34, stroke: 3.5, accent: t.id === active }) : ''}</span>
      </button>`;
    }).join('') + '</div>';
    const sh = mountSheet('track-sheet', 'track-sheet',
      '<div class="eyebrow mb-2">Choose a track</div>' + body);
    sh.querySelectorAll('[data-track]').forEach((b) => {
      b.onclick = () => {
        const id = b.dataset.track;
        closeSheet('track-sheet');
        if (id === active) return;
        S.setTrack(id);
        drillState.topic = ''; drillState.subtopic = '';
        current = S.getLastView(id);
        render();
        buildTrackPill();
        toast(S.tracks().find((t) => t.id === id).label + ' — welcome back.');
      };
    });
  }

  function buildTrackPill() {
    const host = $('#track-pill-host');
    if (!host) return;
    const t = S.tracks().find((x) => x.id === S.activeTrack()) || S.tracks()[0];
    host.innerHTML = `<button class="track-pill" id="track-pill-btn" title="Switch track">
      <span class="ic">${trackIcon(t.id)}</span><span class="lbl">${esc(t.label)}</span>
    </button>`;
    $('#track-pill-btn').onclick = () => { buildTrackSheet(); openSheet('track-sheet'); };
  }

  /* Single delegated listener for every expand-group accordion in the app (Mejora A/B) —
     attached once here rather than re-wired at each of its call sites, so it keeps working
     for accordions rendered later inside any view, including ones nested inside dynamically
     inserted content (Learn concepts, mock reports, mistake reviews, ...). */
  function setExpandCardOpen(card, opening) {
    card.classList.toggle('open', opening);
    card.classList.toggle('collapsed', !opening);
    const btn = card.querySelector('[data-expand-toggle]');
    if (!btn) return;
    btn.setAttribute('aria-expanded', String(opening));
    const cta = btn.querySelector('.expand-cta-label');
    if (cta) cta.textContent = opening ? btn.dataset.collapseLabel : btn.dataset.expandLabel;
  }
  function unlockExpandCard(card) {
    card.classList.remove('locked');
    const btn = card.querySelector('[data-expand-toggle]');
    if (btn) btn.tabIndex = 0;
  }
  function handleExpandGroupClick(e) {
    const toggleBtn = e.target.closest('[data-expand-toggle]');
    if (toggleBtn) {
      const card = toggleBtn.closest('.expand-card');
      if (!card || card.classList.contains('locked')) return;
      const group = card.closest('.expand-group');
      const mode = group && group.dataset.mode;
      const opening = !card.classList.contains('open');
      if (opening && mode !== 'sequential' && !CUMULATIVE_EXPAND && group) {
        Array.from(group.querySelectorAll('.expand-card.open')).forEach((c) => {
          if (c !== card) setExpandCardOpen(c, false);
        });
      }
      setExpandCardOpen(card, opening);
      if (opening && mode === 'sequential') {
        const next = card.nextElementSibling;
        if (next && next.classList.contains('expand-card') && next.classList.contains('locked')) unlockExpandCard(next);
      }
      return;
    }
    const allBtn = e.target.closest('[data-expand-all], [data-collapse-all]');
    if (allBtn) {
      const group = allBtn.closest('.expand-group');
      if (!group) return;
      const cards = Array.from(group.children).filter((c) => c.classList.contains('expand-card'));
      if (allBtn.hasAttribute('data-expand-all')) {
        cards.forEach((c) => { unlockExpandCard(c); setExpandCardOpen(c, true); });
      } else {
        // "collapse all" returns the group to its just-rendered state: first card open,
        // the rest collapsed, and (for a sequential group) re-locked beyond the first two
        cards.forEach((c, i) => { setExpandCardOpen(c, i === 0); });
        if (group.dataset.mode === 'sequential') {
          cards.forEach((c, i) => {
            if (i > 1) { c.classList.add('locked'); const b = c.querySelector('[data-expand-toggle]'); if (b) b.tabIndex = -1; }
          });
        }
      }
    }
  }

  function init() {
    document.documentElement.setAttribute('data-theme', S.state.settings.theme || 'dark');
    buildNav();
    buildTrackPill();
    $('#theme-btn').onclick = toggleTheme;
    document.addEventListener('keydown', keys);
    document.body.addEventListener('click', handleExpandGroupClick);
    window.addEventListener('beforeunload', () => S.save());
    go(S.getLastView(S.activeTrack()));
  }

  document.addEventListener('DOMContentLoaded', init);
  global.QTL_APP = { go, render, startSession, renderFormula, parseFormulaSegment, splitIntoSentences, renderTextWithInlineFormulas };
})(window);
