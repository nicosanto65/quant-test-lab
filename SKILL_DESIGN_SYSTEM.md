# Skill Design System Consultation

Every recommendation below came from real calls to `.claude/skills/ui-ux-pro-max/scripts/search.py`
against the project's own local databases (styles.csv, colors.csv, typography.csv,
ux-guidelines.csv, stacks/html-tailwind.csv) — not from general judgment. Full JSON output for
each query is preserved in this session's scratchpad; the relevant fields are reproduced here.

## Queries run

```
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "fintech education platform quant trading exam prep" --design-system -p "Quant Test Lab" --json
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "fintech banking dashboard" --domain style --json
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "serious professional serif sans pairing finance" --domain typography --json
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "fintech color palette trustworthy" --domain style --json      # off-topic, see below
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "fintech color palette trustworthy" --domain color --json     # retry, correct domain
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "badge chip label wraps to second line" --domain ux --json
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "responsive layout" --stack html-tailwind --json
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "pre-delivery checklist accessibility" --domain ux --json
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "focus visible keyboard navigation outline" --domain ux --json
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "reduced motion respects user preference" --domain ux --json
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "emoji icon anti-pattern use svg icons" --domain icons --json  # empty, retried below
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "decorative icon aria hidden" --domain icons --json
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "icon button accessible label" --domain icons --json
```

Per the skill's own query contract ("retry once with a narrower rewrite... if that retry fails,
state that no verified match was found"): two queries needed a retry. `"fintech color palette
trustworthy" --domain style` returned three results with zero relevance (pixel-art, organic-
biophilic, flat-design) — wrong domain for a palette question — discarded, and the `--domain
color` retry returned the real match. `"emoji icon anti-pattern" --domain icons` returned 0
results; retried as `"decorative icon aria hidden"` per the skill's own suggested phrasing for
icon-accessibility queries, which returned real guidance.

## `--design-system` result: not applied as-is

The generated design-system call classified the project as "Financial Dashboard" / "Enterprise
Gateway" and returned a **dark-mode-only, `Playfair Display`-body, navy/green** system with
`anti_patterns: "Light mode default"`. This does not fit our case and was **not applied**:

- The pattern (`Hero (Video/Mission) > Solutions by Industry > Solutions by Role > Client Logos >
  Contact Sales`) is a **marketing landing page for an enterprise SaaS buyer**, not a study/drill
  application someone uses for 45+ minutes at a time. The tool's own `--design-system` mode is
  tuned for that shape of product; ours doesn't have a "Contact Sales" moment.
- `light_mode: not-recommended` conflicts directly with this app's validated, already-shipped
  light theme (the app defaults to light, dark is the toggle option — see `css/styles.css`
  `:root` vs `html[data-theme="light"]`). Forcing dark-only would regress five prior UX report
  cycles of theme work.
- `Playfair Display` as a **body** font is an editorial/luxury poster face — wrong register for
  dense quant/finance study content read for long sessions; it also failed to appear in any of
  the finance-specific typography-domain results below, which is a stronger, more targeted
  signal for this specific case.

Kept from this result: the **accessibility requirement string itself** —
`contrast-text-4.5,keyboard,visible-focus,reduced-motion` — which recurs identically across
every other query below and became the literal checklist for Step 2.

## Style: `--domain style`, query "fintech banking dashboard"

Two real matches:

| Style | Best for | Relevant to us |
|---|---|---|
| **Data-Dense Dashboard** | BI dashboards, financial analytics, enterprise reporting | Partial — describes Statistics/Dashboard stat-tile density, not the whole app |
| **Bento Box Grid** | Dashboards, product pages, SaaS, "Apple-style" | **Strong match** — modular cards, varied sizes, rounded-xl (16px), subtle shadows, hover scale (1.02), asymmetric grid |

Bento Box Grid's own CSS keywords (`border-radius: 16-24px`, `box-shadow: 0 4px 6px
rgba(0,0,0,0.05)`, `--hover-scale: 1.02`) describe — almost exactly — the `.gradient-card` /
`.track-card` / `.mode-card` language already built across Reports 5–8 and the Visual Rework
(`--radius: 12px`, `--radius-lg: 18px`, `--shadow-sm/md/lg` elevation scale, `translateY(-3px)`
hover-lift). **This confirms the existing card system is the right pattern for this product
type** — no rebuild needed here, Bloque 3/1 of the Visual Rework already arrived at the skill's
own recommendation independently.

## Typography: `--domain typography`, query "serious professional serif sans pairing finance"

Three real matches, all finance/professional-register pairings:

| Pairing | Heading | Body | Best for |
|---|---|---|---|
| Financial Trust | IBM Plex Sans | IBM Plex Sans | Banks, finance, insurance, fintech |
| Corporate Trust | Lexend | Source Sans 3 | Enterprise, government, accessibility-focused |
| Academic/Archival | EB Garamond | Crimson Text | University, archives, research |

None of these name the app's current pair (**Inter** for UI/body, **Source Serif 4** for concept
titles/primer lead-ins). But the *category* the skill returns for "serious finance" is
consistently a **clean, trustworthy sans** (IBM Plex Sans, Lexend+Source Sans 3) — Inter is in
the same design family (a neo-grotesque built for UI legibility, the same rationale IBM Plex Sans
and Lexend give). The one serif match ("Academic/Archival") is explicitly for a different
register (university archive, not fintech) — it validates the project's choice to use Source
Serif 4 sparingly, as an editorial accent on concept titles only, rather than as a body font.
**No change recommended** — see Step 4 below for the explicit comparison.

## Color: `--domain color`, query "fintech color palette trustworthy" (after retry)

One real match, `Product Type: Fintech/Crypto`:

```
Primary:    #F59E0B (gold/amber)      On Primary:   #0F172A (near-navy-black)
Secondary:  #FBBF24 (lighter gold)    Accent:       #8B5CF6 (purple)
Background: #0F172A (navy)            Foreground:   #F8FAFC
Ring:       #F59E0B
Notes: "Gold trust + purple tech"
```

**This directly validates the project's core navy + gold pairing** — the skill's own
fintech-category primary color is a warm gold/amber (`#F59E0B`) on a navy background, the same
structural relationship `--accent` (warm gold, CTAs/correct-feedback/achievement) and `--brand`
(desaturated steel navy, chrome/identity) already have here. The one element this result adds
that we don't have is a **purple accent** ("purple tech") — **not adopted**: purple/violet
gradients are the single most common "generic AI product" tell across current SaaS design
(the exact anti-pattern this task's brief anticipated), and introducing a second, unrelated
saturated hue would fight the existing 5-accent semantic system (`--brand` nav, `--accent` gold
CTA/achievement, `--pos`/`--neg` data, `--info` neutral info, `--warn` caution, `--teal` worked
examples) built specifically so every color already means one specific thing. See Step 4.

## UX: badge/chip wrap — `--domain ux`, query "badge chip label wraps to second line"

```
Issue: Compact Label Overflow            Severity: High
Do:    Bound only unpredictable values; use nowrap with a shrinkable label;
       expose full text to keyboard/pointer/touch users
Don't: Let one compact label wrap to a second line or use a hover-only tooltip
```

Important: the skill's actual recommendation is the **opposite** of "wrap to a second line" —
it says never let a single badge wrap internally; keep it `nowrap` and let the *badge as a whole*
either fit or move as one flex item, never break its own text across two lines, and never hide
overflow behind a hover-only tooltip (which fails touch/keyboard users entirely). This shaped
the actual Step 3d fix below.

Two more results from the same query, both already satisfied by the existing stylesheet: line
height 1.5–1.75 for body text (`.reveal.primer p` etc. already use `line-height: 1.8`, `body`
uses `1.5`), and live badge/count updates needing one atomic status message rather than a bare
number in a competing live region (not applicable — this app has no live-updating badges/counts
outside a fully re-rendered view, so there's no `aria-live` region to get wrong here).

## Stack: `--stack html-tailwind`, query "responsive layout"

Translated to our actual stack (vanilla CSS custom properties, no Tailwind, no build step):

| Tailwind guideline | Vanilla-CSS translation | Already true here? |
|---|---|---|
| `px-4 md:px-6 lg:px-8` (responsive padding, not fixed at every size) | `padding: var(--sp-4)` + width-based `@media` bumps | Yes — `main { padding: var(--sp-4) }`, desktop `@media (min-width:900px)` adds sidenav/grid, `--fs-2xl`/`--fs-hero` already use `clamp()` instead of a fixed px value per breakpoint |
| `w-full md:max-w-xl` (mobile-first images, never a fixed desktop px width) | N/A — the app has no `<img>` content, only inline SVG icons that already scale via their `viewBox` | Yes, trivially |
| `hidden md:block` (breakpoint visibility, not separate mobile/desktop components) | `display:none`/`display:block` inside `@media` on the *same* markup | Yes — `.sidenav`/`.tabbar` toggle via `@media (min-width:900px)`, not two different render paths |

No action needed here — the existing mobile-first, single-markup, `clamp()`-based approach is
already what this guidance describes; it just doesn't use Tailwind's utility-class spelling.

## Icons: `--domain icons`, "decorative icon aria hidden" / "icon button accessible label"

```
Usage: "...if decorative beside visible text, set aria-hidden="true"; if meaningful
        without equivalent visible text, provide a text alternative; if inside an
        interactive control, give the control an accessible name and expose applicable
        state (aria-pressed, aria-expanded)."
```

Used directly in the Step 2 audit below to check the app's existing SVG icon usage, not just
whether icons are SVG (they already are — see Step 2).

## Pre-delivery checklist: `--domain ux`, "pre-delivery checklist accessibility" / focus / reduced-motion

Three more concrete, testable rules, folded into the Step 2 checklist verbatim:

- **Alt text**: descriptive alt text for meaningful images, never empty for content images
  (not applicable — no `<img>` elements in this app, only inline SVG, which the icons guidance
  above already covers via `aria-hidden`/accessible-name instead of `alt`).
- **Color contrast**: minimum 4.5:1 for normal text (`#333 on white (7:1)` good example, `#999 on
  white (2.8:1)` bad example — this exact "too-light gray on white" bad example turned out to be
  almost precisely the project's `--dim` token problem found in Step 2/3a).
- **Keyboard navigation / focus states**: visible focus ring on every interactive control, tab
  order matching visual order, never `outline: none` without a replacement.
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` must exist and be honored; motion
  duration should come from shared tokens rather than one hardcoded value everywhere; and — a
  guideline the project should keep in mind going forward — **animate 1–2 key elements per view
  maximum**, not everything that moves.

---

# Step 4 — Palette / typography recommendation

**Recommendation: keep the current palette and typography unchanged. No change proposed.**

- **Palette**: the skill's own fintech-category color match independently produced the same
  structural pairing already in use — a warm gold/amber primary/accent against a navy base. The
  purple ("tech") accent that result also carries is explicitly *not* recommended for adoption:
  it would duplicate the generic "AI purple gradient" look this task's brief called out as a risk
  to avoid, and it has no role to play in a color system where every existing hue (`brand`,
  `accent`, `pos`, `neg`, `info`, `warn`, `teal`, plus the two track-only hues) already carries
  one specific, load-bearing meaning. Adding a ninth color with no assigned meaning would weaken
  that system rather than extend it.
- **Typography**: no queried pairing named the exact current fonts, but every finance-specific
  result converged on the same *category* (clean, legible sans for the working font) that Inter
  already is, and the one serif result available was for a different register (academic archive)
  than how Source Serif 4 is actually used here (a restrained editorial accent on concept titles
  and primer lead-ins only, not body text). Nothing surfaced is a clear, unambiguous upgrade over
  the current pairing, so per the brief's own instruction this stays **proposed-only, not
  applied**: there's no real upgrade here to confirm.

This is a confirmation, not a placeholder — the direction chosen across Reports 5–8 and the
Visual Rework holds up independently against the skill's own fintech-specific data.
