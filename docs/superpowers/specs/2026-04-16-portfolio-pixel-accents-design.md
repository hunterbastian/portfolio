# Portfolio — Pixel Micro-Details & Label Restraint

**Date:** 2026-04-16
**Status:** Design approved, pending spec review
**Owner:** Hunter Bastian

## Context

The portfolio (`~/Desktop/Projects/Code/web/portfolio`, Next.js 15) is clean, Japandi, oklch-themed, with recent work on unified motion, grey palette, plant shadow, and a GitHub activity graph on About. Strong craft, but too safe — forgettable. Reference direction (grainy/halftone/pixelated monochrome) suggested the vibe; after scoping, we settled on an **accent-only texture pass** rather than a full aesthetic swap, and selected **pixel micro-details** as the accent flavor.

This fits because pixel already lives in the surrounding work: nucleo-pixel-essential icon set is installed, and active game projects (Soratchi/Pyxel, PATH, Tova) are native pixel territory. Pixel is Hunter's through-line, not a borrowed theme.

We also adopt a complementary principle from Refactoring UI's *Labels Are A Last Resort*: embed meaning in format, de-emphasize explicit labels, let visual hierarchy carry the weight.

## Goals

1. Give the portfolio a signature — something memorable without changing its quiet feel.
2. Lean into work Hunter already owns (pixel craft, game dev) rather than importing a new aesthetic.
3. Reduce visual scaffolding (labels) so the remaining elements land harder.

## Non-goals

- No change to typography (Inter + mono scale stays).
- No change to the oklch color palette.
- No change to motion system or spring constants.
- No change to information architecture (/, /about, /projects, /cv, /blog, /archive, /playground).
- No pixel styling on photographic project imagery — photos stay clean.
- No pixel-font body copy — pixel stays at micro scale only.
- Playground stays as-is per prior preference.

## The Five Moves

### 1. Pixel GitHub activity chart

**Scope:** Re-render the existing About-page contributions graph as pixelated tiles.

**Component:** `src/components/GitHubContributions.tsx`

**Spec:**
- Each day tile = 8–10px square with `image-rendering: pixelated` / crisp edges (no rounded corners, no anti-aliasing).
- Heat tiers = 5 stepped grayscale/accent swatches from oklch palette (no gradient interpolation).
- Gap between tiles = 2px, also crisp.
- Respect `prefers-reduced-motion`: disable any reveal/stagger animation.
- Preserve existing tooltip/hover behavior.

**Success:** the graph reads as a chunky pixel heatmap at a glance; clearly different from the default GitHub embed.

### 2. Pixel section markers + label audit

**Scope:** Replace overuse of mono labels (`WORK`, `SELECTED WRITING`, `2026 · case`, etc.) with a tiny pixel glyph paired with smaller, de-emphasized label text — or no label at all when format self-signals.

**Components touched:**
- Home sections (`src/app/page.tsx`, `src/components/AnimatedHomePage.tsx`)
- Project lists (`src/components/ProjectTextList.tsx`, `src/components/ProjectGridClient.tsx`, `src/components/ProjectCard.tsx`)
- About (`src/app/about/AboutPageClient.tsx`)
- Blog list (`src/components/BlogCardList.tsx`)
- Footer / Header (`src/components/Footer.tsx`, `src/components/Header.tsx`)

**Glyph library (new):** `src/components/pixel/glyphs.tsx` — 6 custom 8×8 SVGs rendered with `shape-rendering: crispEdges`:
- `work` (small monitor), `writing` (page), `games` (controller), `contact` (letter), `archive` (box), `now` (dot)

**Label audit deliverable:** the implementation plan produces an inventory of every current label in the form `{page, component, label text, current treatment, proposed treatment (delete / shrink / embed), rationale}` before any edits. Review the inventory, then apply.

**Label audit rule:** every `LABEL: value` pair gets one of three treatments:
1. **Delete label** — if format already signals (`2026` reads as year).
2. **Shrink label** — reduce to 10px, opacity ~55%, letter-spacing tightened; pair with pixel glyph where section/category meaning matters.
3. **Embed in prose** — rewrite "Role: Designer" → "Led design for…" style.

Examples to kill/shrink:
- Home project tile meta `2025 · case study` → `2025` + tiny pixel glyph for type.
- Blog list `SELECTED WRITING` section header → pixel `writing` glyph + `writing` at smaller size.
- CV section labels where format is self-evident.

**Success:** visual scan of any page shows fewer uppercase mono strings; the remaining labels feel intentional, not automatic.

### 3. Pixel divider

**Scope:** Replace hairline `<hr>` / divider lines between major sections with a pixel `· · ·` motif — three crisp squares, spaced.

**Component:** `src/components/pixel/PixelDivider.tsx`

**Spec:**
- 3 squares, 4×4px each, 12px gaps, centered.
- Color matches current hairline color token.
- `shape-rendering: crispEdges`.
- Replaces existing dividers in: Home section boundaries, About page sections, CV sections. Retain `ui/separator.tsx` for inline uses (lists, metadata strips).

**Success:** divider rhythm reads as a quiet pixel accent, not a "hr" tag.

### 4. Pixel cursor on interactive surfaces

**Scope:** Custom CSS cursor for hover state on links, buttons, and card CTAs.

**Implementation:** Global class `.pixel-hover` applied to interactive surfaces; CSS cursor uses a 16×16 pixel-art SVG served from `public/cursors/`.

**Assets:** `public/cursors/pixel-pointer.svg` (and `-default.svg` if needed).

**Rules:**
- Only applied to links, buttons, card root elements — not text, inputs, textareas.
- Disabled on touch devices (`@media (hover: hover) and (pointer: fine)`).
- Falls back gracefully to `pointer` if the SVG fails to load.

**Success:** desktop hover over interactive elements shows a signature 8-bit pointer; forms and reading flow unaffected.

### 5. Pixel wordmark / favicon

**Scope:** Replace the current favicon and footer logo mark with a pixel "HB" monogram (or single-letter glyph if cleaner).

**Files:**
- `public/favicon/*` (all sizes — regenerate from a single 32×32 source)
- `src/app/opengraph-image.tsx` (fold in the pixel mark as a corner signature, not as the whole mark)
- `src/components/Footer.tsx` (small pixel glyph replaces any current footer mark)

**Spec:**
- Source: 32×32 SVG, crisp edges, monochrome (render in current foreground token).
- Favicon scales: 16, 32, 192, 512 (matching existing on-disk set) + 180 `apple-touch-icon.png`. Regenerate all from the 32×32 source.
- Keep existing `manifest.json` theme/background colors.

**Success:** browser tab shows a recognizable pixel HB; footer feels signed rather than branded.

## Architecture

New folder: `src/components/pixel/`
- `glyphs.tsx` — section/category glyph components (work, writing, games, contact, archive, now).
- `PixelDivider.tsx` — section divider.
- `PixelHeatmap.tsx` — pixel tile renderer used by `GitHubContributions.tsx` (contributions graph delegates tile rendering here for testability/reuse).
- `pixel.module.css` — shared `image-rendering: pixelated`, `shape-rendering: crispEdges`, and pixel-cursor class. Keeps CSS colocated.

New folder: `public/cursors/` — cursor SVG assets.
New folder: `public/pixel/` — any non-component pixel source files.

**Reuse constraint:** `PixelHeatmap` and `Glyphs` must accept a color-token prop and NOT hardcode hex. All pixel colors flow through existing oklch CSS variables — so light/dark mode and future palette changes "just work."

## Data flow

- `GitHubContributions.tsx` continues to fetch via existing API route; only rendering changes (delegates to `PixelHeatmap`).
- Glyph selection in section markers is prop-driven (`<SectionMarker kind="writing" label="Writing" />`), no global state.

## Error handling / edge cases

- Cursor SVG 404 → browser falls back to `pointer` via CSS.
- GitHub fetch fails → existing empty/error state preserved; no pixel-specific failure mode.
- High-density displays (Retina) → SVG/`image-rendering: pixelated` keeps crisp rendering natively; no extra handling needed.
- `prefers-reduced-motion` → disables any stagger/reveal on the pixel heatmap and on glyph entrances (though glyphs should not animate anyway).

## Testing

Visual/manual (this is a design polish pass, not logic work):
- Home, About, Blog, CV pages: run through each with dev server, verify every label audited.
- Dark/light mode toggle: pixel assets remain crisp and readable in both.
- Mobile widths (360, 390, 768): cursor disabled, pixel glyphs don't break tap targets.
- Screen reader pass: glyph `<svg>` elements have `aria-hidden="true"` unless they are the sole signal (then add `<title>`).

Automated:
- Existing TypeScript check (`npx tsc --noEmit`) and build (`npm run build`) must pass.
- No new test files required for this pass; visual review is the verification.

## Risks / mitigations

| Risk | Mitigation |
|---|---|
| Pixel motif reads as a theme, not a signature | 5-move cap; Inter typography preserved; no pixel on photos |
| Label audit gets too aggressive, loses scannability | Each removed label requires format-signals-enough check; keep shrink-and-deemphasize as default, delete only when safe |
| Cursor feels gimmicky | Opt-in per element; desktop-only; can be killed with one class swap if it ages poorly |
| Pixel glyphs look inconsistent across sections | Single glyph file, shared grid (8×8), single stroke weight |
| Adds perceivable weight to About page (heatmap) | Already lazy-loaded per recent session; preserve |

## Out of scope / follow-ups

- Pixel-style project thumbnails (the "dithered imagery" direction we rejected).
- Pixel display type for hero headlines.
- Pixel-art hero illustration.
- Any IA or navigation change.

## References

- Reference image: moody halftone/pixel snow scene (provided in brainstorming session).
- [Labels Are A Last Resort — Refactoring UI](https://refactoringui.com/previews/labels-are-a-last-resort/)
- nucleo-pixel-essential icon set (already installed).
- Related sessions (memory): `project_portfolio_session_0406.md` (grey palette, plant shadow, GitHub graph), `project_portfolio_session_0401.md` (micro-interactions, SEO).
