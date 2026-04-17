# Portfolio Pixel Accents — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add pixel micro-details and restraint-oriented label handling as a signature accent layer on the portfolio, without changing typography, color, motion, or IA.

**Architecture:** New `src/components/pixel/` folder owns all pixel primitives (divider, glyphs, section marker, shared CSS). Existing components (GitHub heatmap, section headers, dividers, cursor targets, favicon, OG image) are retrofitted to call the primitives. Colors flow through existing CSS custom properties (`--foreground`, `--muted-foreground`, `--border`, `--accent`) — no hardcoded hex. React-github-calendar stays; we pixelate via its `blockRadius={0}` + `image-rendering: pixelated` rather than writing a custom tile renderer (YAGNI).

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind, CSS Modules, `nucleo-pixel-essential`, `react-github-calendar`. Existing `npm run lint` / `npm run build` / `npx tsc --noEmit` are the gates. No new test framework introduced.

**Reference docs:**
- Spec: `docs/superpowers/specs/2026-04-16-portfolio-pixel-accents-design.md`
- CLAUDE.md: warm neutral palette (`#f2f0ec` bg, `#3f4f5c` fg, `#d4928e` accent), `.dark` class for dark mode, `npm run dev` (never `dev:turbo`).

---

## Task 1 — Pixel foundation (folder + shared CSS)

**Files:**
- Create: `src/components/pixel/pixel.module.css`
- Create: `src/components/pixel/index.ts` (barrel export)

- [ ] **Step 1: Create the folder and CSS module**

Create `src/components/pixel/pixel.module.css`:

```css
.crisp {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  shape-rendering: crispEdges;
}

.pixelHover {
  cursor: url('/cursors/pixel-pointer.svg') 2 2, pointer;
}

@media (hover: none), (pointer: coarse) {
  .pixelHover { cursor: pointer; }
}
```

- [ ] **Step 2: Create barrel export**

Create `src/components/pixel/index.ts`:

```ts
export { default as PixelDivider } from './PixelDivider'
export { default as SectionMarker } from './SectionMarker'
export * as Glyphs from './glyphs'
```

(Files it references will be added in Tasks 2–4 — TypeScript will error until then, which is expected.)

- [ ] **Step 3: Commit the scaffolding**

```bash
git add src/components/pixel/
git commit -m "feat(pixel): scaffold pixel/ folder and shared CSS module"
```

---

## Task 2 — PixelDivider component

**Files:**
- Create: `src/components/pixel/PixelDivider.tsx`

- [ ] **Step 1: Implement the component**

Create `src/components/pixel/PixelDivider.tsx`:

```tsx
import styles from './pixel.module.css'

type Props = { className?: string; ariaLabel?: string }

export default function PixelDivider({ className, ariaLabel }: Props) {
  return (
    <svg
      className={[styles.crisp, className].filter(Boolean).join(' ')}
      width={36}
      height={4}
      viewBox="0 0 36 4"
      role={ariaLabel ? 'img' : 'presentation'}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <rect x="0"  y="0" width="4" height="4" fill="currentColor" />
      <rect x="16" y="0" width="4" height="4" fill="currentColor" />
      <rect x="32" y="0" width="4" height="4" fill="currentColor" />
    </svg>
  )
}
```

- [ ] **Step 2: Sanity-render it**

Temporarily add `<PixelDivider className="text-muted-foreground/40 mx-auto my-8" />` somewhere on `src/app/page.tsx`, run `npm run dev`, open `http://127.0.0.1:3000` in Dia, verify it renders as 3 crisp 4×4 squares with 12px gaps. Remove the temp markup after verification.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/pixel/PixelDivider.tsx
git commit -m "feat(pixel): add PixelDivider (3-square crisp motif)"
```

---

## Task 3 — Glyph library + SectionMarker

**Files:**
- Create: `src/components/pixel/glyphs.tsx`
- Create: `src/components/pixel/SectionMarker.tsx`

- [ ] **Step 1: Implement the six glyphs**

Create `src/components/pixel/glyphs.tsx`. Each glyph is an 8×8 SVG built from 1×1 rect pixels (edit pixels as needed to match the subject; keep consistent visual density across glyphs):

```tsx
import styles from './pixel.module.css'
import type { SVGProps } from 'react'

type GlyphProps = SVGProps<SVGSVGElement> & { size?: number }

function Base({ size = 12, className, children, ...rest }: GlyphProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 8 8"
      className={[styles.crisp, className].filter(Boolean).join(' ')}
      fill="currentColor"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

// Monitor — Work
export const Work = (p: GlyphProps) => (
  <Base {...p}>
    <rect x="1" y="1" width="6" height="4" />
    <rect x="2" y="2" width="4" height="2" fill="var(--background)" />
    <rect x="3" y="6" width="2" height="1" />
    <rect x="2" y="7" width="4" height="1" />
  </Base>
)

// Page — Writing
export const Writing = (p: GlyphProps) => (
  <Base {...p}>
    <rect x="1" y="0" width="5" height="8" />
    <rect x="2" y="2" width="3" height="1" fill="var(--background)" />
    <rect x="2" y="4" width="3" height="1" fill="var(--background)" />
    <rect x="2" y="6" width="2" height="1" fill="var(--background)" />
  </Base>
)

// Controller — Games
export const Games = (p: GlyphProps) => (
  <Base {...p}>
    <rect x="0" y="3" width="8" height="3" />
    <rect x="1" y="2" width="2" height="1" />
    <rect x="5" y="2" width="2" height="1" />
    <rect x="2" y="4" width="1" height="1" fill="var(--background)" />
    <rect x="5" y="4" width="1" height="1" fill="var(--background)" />
  </Base>
)

// Envelope — Contact
export const Contact = (p: GlyphProps) => (
  <Base {...p}>
    <rect x="0" y="2" width="8" height="5" />
    <rect x="1" y="3" width="6" height="1" fill="var(--background)" />
    <rect x="2" y="4" width="4" height="1" fill="var(--background)" />
  </Base>
)

// Box — Archive
export const Archive = (p: GlyphProps) => (
  <Base {...p}>
    <rect x="0" y="1" width="8" height="2" />
    <rect x="1" y="3" width="6" height="5" />
    <rect x="3" y="4" width="2" height="1" fill="var(--background)" />
  </Base>
)

// Dot — Now
export const Now = (p: GlyphProps) => (
  <Base {...p}>
    <rect x="3" y="3" width="2" height="2" />
  </Base>
)
```

- [ ] **Step 2: Implement SectionMarker**

Create `src/components/pixel/SectionMarker.tsx`:

```tsx
import type { ComponentType, SVGProps } from 'react'
import * as Glyphs from './glyphs'

type Kind = 'work' | 'writing' | 'games' | 'contact' | 'archive' | 'now'
type GlyphComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>

type Props = {
  kind: Kind
  label?: string
  className?: string
}

const GLYPHS: Record<Kind, GlyphComponent> = {
  work: Glyphs.Work,
  writing: Glyphs.Writing,
  games: Glyphs.Games,
  contact: Glyphs.Contact,
  archive: Glyphs.Archive,
  now: Glyphs.Now,
}

export default function SectionMarker({ kind, label, className }: Props) {
  const Glyph = GLYPHS[kind]
  return (
    <span
      className={[
        'inline-flex items-center gap-2 font-mono text-[10px] font-normal tracking-[0.06em] uppercase text-muted-foreground/55',
        className,
      ].filter(Boolean).join(' ')}
    >
      <Glyph size={10} />
      {label ? <span>{label}</span> : null}
    </span>
  )
}
```

Note the smaller font-size (10px) and reduced opacity (`/55`) versus existing mono meta (`/60`) — this is the label-restraint move: softer than current labels so the glyph does the section-signaling work.

- [ ] **Step 3: Typecheck + build**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Visual sanity in dev**

Temporarily render one of each on `src/app/page.tsx`:

```tsx
<SectionMarker kind="work" label="Work" />
<SectionMarker kind="writing" label="Writing" />
<SectionMarker kind="games" label="Games" />
<SectionMarker kind="contact" />
<SectionMarker kind="archive" label="Archive" />
<SectionMarker kind="now" label="Now" />
```

Verify in Dia: glyphs are crisp (no anti-aliasing), label is visibly smaller/quieter than existing `GitHub Activity` label. Remove temp markup.

- [ ] **Step 5: Commit**

```bash
git add src/components/pixel/glyphs.tsx src/components/pixel/SectionMarker.tsx
git commit -m "feat(pixel): add 8x8 glyph library and SectionMarker"
```

---

## Task 4 — Pixel cursor asset + class

**Files:**
- Create: `public/cursors/pixel-pointer.svg`

- [ ] **Step 1: Create the cursor SVG**

Create `public/cursors/pixel-pointer.svg`. Use a 16×16 viewBox of 1×1 pixel rects forming a chunky arrow:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" shape-rendering="crispEdges">
  <g fill="#111">
    <rect x="2" y="2" width="1" height="1"/>
    <rect x="2" y="3" width="2" height="1"/>
    <rect x="2" y="4" width="3" height="1"/>
    <rect x="2" y="5" width="4" height="1"/>
    <rect x="2" y="6" width="5" height="1"/>
    <rect x="2" y="7" width="6" height="1"/>
    <rect x="2" y="8" width="7" height="1"/>
    <rect x="2" y="9" width="4" height="1"/>
    <rect x="6" y="9" width="1" height="1"/>
    <rect x="2" y="10" width="2" height="1"/>
    <rect x="7" y="10" width="2" height="1"/>
    <rect x="2" y="11" width="1" height="1"/>
    <rect x="8" y="11" width="2" height="1"/>
    <rect x="9" y="12" width="1" height="1"/>
  </g>
</svg>
```

(The fill is dark so the cursor is visible on light bg. OS cursor rendering does not respect CSS variables — a fixed fill is correct here. A `pixel-pointer-dark.svg` alternate for dark mode is out of scope for this pass.)

- [ ] **Step 2: Verify the CSS class works**

`pixel.module.css` already declared `.pixelHover` in Task 1, so no CSS change is needed. Confirm the class path in the module matches `/cursors/pixel-pointer.svg`.

- [ ] **Step 3: Visual sanity**

Run `npm run dev`. Temporarily add `className={styles.pixelHover}` to a button on any page (import styles from pixel module). Hover and verify the pixel cursor shows on desktop. Confirm it falls back to system pointer on mobile widths via devtools device emulation. Remove temp markup.

- [ ] **Step 4: Commit**

```bash
git add public/cursors/pixel-pointer.svg
git commit -m "feat(pixel): add pixel-art cursor asset"
```

---

## Task 5 — Pixelate GitHub contributions

**Files:**
- Modify: `src/components/GitHubContributions.tsx`

- [ ] **Step 1: Update the component**

Edit `src/components/GitHubContributions.tsx`. Change `blockRadius={2}` → `blockRadius={0}`, wrap the calendar in a div that applies `image-rendering: pixelated`, and replace the "GitHub Activity" label with a `<SectionMarker kind="now" label="GitHub Activity" />`:

```tsx
'use client'

import { GitHubCalendar } from 'react-github-calendar'
import type { Activity } from 'react-github-calendar'
import SectionMarker from './pixel/SectionMarker'
import styles from './pixel/pixel.module.css'

function selectRecentMonths(data: Activity[], months: number): Activity[] {
  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - months)
  const cutoffStr = cutoff.toISOString().slice(0, 10)
  return data.filter((d) => d.date >= cutoffStr)
}

export default function GitHubContributions() {
  return (
    <div className="mx-auto max-w-[560px] px-4 sm:px-6 lg:px-0 py-8">
      <div className="mb-4">
        <SectionMarker kind="now" label="GitHub Activity" />
      </div>
      <div className={styles.crisp}>
        <GitHubCalendar
          username="hunterbastian"
          transformData={(data) => selectRecentMonths(data, 5)}
          showColorLegend={false}
          showTotalCount={false}
          blockSize={10}
          blockMargin={3}
          blockRadius={0}
          fontSize={10}
          theme={{
            light: ['#e5e5e5', '#c0c0c0', '#8a8a8a', '#555555', '#222222'],
            dark: ['#2a2a2a', '#444444', '#666666', '#999999', '#cccccc'],
          }}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Visual verification**

Run `npm run dev`, visit `/about`. Confirm heatmap tiles are now crisp squares (no rounded corners), the label is a pixel dot + smaller "GitHub Activity" text. Toggle OS dark mode and verify both palettes still look clean.

- [ ] **Step 4: Commit**

```bash
git add src/components/GitHubContributions.tsx
git commit -m "feat(pixel): pixelate GitHub contributions heatmap and marker"
```

---

## Task 6 — Pixel favicon + OG corner mark

**Files:**
- Create: `public/favicon/favicon-source.svg`
- Modify: `public/favicon/favicon-16x16.png`, `favicon-32x32.png`, `favicon-192x192.png`, `favicon-512x512.png`, `apple-touch-icon.png`
- Modify: `src/app/opengraph-image.tsx`

- [ ] **Step 1: Draft the pixel HB source**

Create `public/favicon/favicon-source.svg` — a 32×32 SVG representing "HB" in pixel form on a transparent background. Keep strokes 2 pixels wide for clarity at small sizes:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <g fill="#3f4f5c">
    <!-- H: two vertical bars + crossbar -->
    <rect x="4" y="8"  width="2" height="16"/>
    <rect x="12" y="8" width="2" height="16"/>
    <rect x="6" y="15" width="6" height="2"/>
    <!-- B: spine + two bumps -->
    <rect x="18" y="8"  width="2" height="16"/>
    <rect x="20" y="8"  width="6" height="2"/>
    <rect x="26" y="10" width="2" height="4"/>
    <rect x="20" y="14" width="6" height="2"/>
    <rect x="26" y="16" width="2" height="6"/>
    <rect x="20" y="22" width="6" height="2"/>
  </g>
</svg>
```

Note: the fill uses the foreground hex as a baseline because favicons don't inherit CSS tokens. Dark-mode favicon tuning is out of scope for this pass.

- [ ] **Step 2: Regenerate PNG sizes from the source**

Use `sharp` (already transitively available via Next / optimize-images pipeline) or `rsvg-convert`. Pick the one on your machine:

```bash
# with sharp-cli (preferred — install if missing: npm i -g sharp-cli)
for size in 16 32 192 512; do
  npx sharp-cli -i public/favicon/favicon-source.svg -o "public/favicon/favicon-${size}x${size}.png" resize $size $size
done
npx sharp-cli -i public/favicon/favicon-source.svg -o public/favicon/apple-touch-icon.png resize 180 180
```

Verify each file exists and opens as a recognizable pixel HB.

- [ ] **Step 3: Add OG corner mark**

Modify `src/app/opengraph-image.tsx` — add a small inline SVG in a corner (bottom-right, e.g. 24×24, 12px margin) using the same pixel HB shape. Do not replace the existing OG content; this is a signature. (Read the current file first; if it already has a mark, replace that mark only.)

- [ ] **Step 4: Build and verify**

Run: `npm run build`
Expected: build succeeds. Open `.next/server/app/opengraph-image.png` or visit `/opengraph-image` in dev and confirm the corner mark is present and crisp. Reload the site in Dia and confirm the browser tab shows the new pixel favicon (may require a hard refresh; browser caches favicons aggressively).

- [ ] **Step 5: Commit**

```bash
git add public/favicon/ src/app/opengraph-image.tsx
git commit -m "feat(pixel): pixel HB favicon + OG corner mark"
```

---

## Task 7 — Label audit inventory

**Files:**
- Create: `docs/superpowers/plans/2026-04-16-label-audit-inventory.md`

- [ ] **Step 1: Walk the codebase and list every current label**

Search for all uppercase mono labels. Start with:

```bash
cd ~/Desktop/Projects/Code/web/portfolio
grep -rn "tracking-\[0.06em\] uppercase\|font-mono.*uppercase" src/ | grep -v node_modules
```

Cross-check the following files for label-bearing markup: `AnimatedHomePage.tsx`, `ProjectTextList.tsx`, `ProjectGridClient.tsx`, `ProjectCard.tsx`, `BlogCardList.tsx`, `AboutPageClient.tsx`, `Footer.tsx`, `Header.tsx`, `src/app/cv/page.tsx`, `src/app/projects/[slug]/` templates.

- [ ] **Step 2: Write the inventory**

Create `docs/superpowers/plans/2026-04-16-label-audit-inventory.md` with a table:

```markdown
| File:line | Current label | Value context | Proposed treatment | Rationale |
|-----------|---------------|---------------|--------------------|-----------|
| AnimatedHomePage.tsx:XXX | SELECTED WORK | project grid | SectionMarker kind=work label=Work | pixel signal + quieter |
| ProjectCard.tsx:XXX | 2025 · case study | tile meta | keep `2025`, drop `· case study`; glyph signals kind | year self-signals |
| ...
```

Treatments = `delete` / `shrink` / `embed` / `replace-with-marker`.

- [ ] **Step 3: Commit the inventory for review**

```bash
git add docs/superpowers/plans/2026-04-16-label-audit-inventory.md
git commit -m "docs(pixel): label audit inventory"
```

Pause here: the **user reviews the inventory** before Task 8. No edits to pages yet.

---

## Task 8 — Apply markers, dividers, and label edits (page-by-page)

One commit per page so reverts are clean. After the inventory is approved, work this task in phases:

- [ ] **Step 1: Home** (`src/app/page.tsx`, `src/components/AnimatedHomePage.tsx`)

Apply inventory edits. Replace section headers with `SectionMarker`. Replace hairline dividers between sections with `<PixelDivider className="text-muted-foreground/30 mx-auto my-12" />`. Run `npx tsc --noEmit` + visually verify in Dia at `http://127.0.0.1:3000`. Commit:

```bash
git add src/app/page.tsx src/components/AnimatedHomePage.tsx
git commit -m "feat(pixel): apply section markers and divider on home"
```

- [ ] **Step 2: About** (`src/app/about/AboutPageClient.tsx`)

Same pattern. Commit:

```bash
git commit -m "feat(pixel): apply section markers and divider on about"
```

- [ ] **Step 3: Blog list** (`src/components/BlogCardList.tsx` and the `/blog` page that uses it)

Same pattern. Commit:

```bash
git commit -m "feat(pixel): apply section markers and divider on blog"
```

- [ ] **Step 4: CV** (`src/app/cv/page.tsx` and any sub-components it pulls in)

Same pattern. Commit:

```bash
git commit -m "feat(pixel): apply section markers and divider on cv"
```

- [ ] **Step 5: Project cards + text list** (`src/components/ProjectCard.tsx`, `ProjectTextList.tsx`, `ProjectGridClient.tsx`)

Meta labels only (year-and-kind strips). Commit:

```bash
git commit -m "feat(pixel): trim project card meta labels per audit"
```

- [ ] **Step 6: Footer + Header** (`src/components/Footer.tsx`, `Header.tsx`)

Apply inventory edits (e.g. pixel HB glyph next to footer mark). Commit:

```bash
git commit -m "feat(pixel): pixel footer mark and nav label trim"
```

---

## Task 9 — Apply pixel cursor to interactive surfaces

**Files:**
- Modify: `src/app/globals.css` (or `src/app/viewport.css` — pick whichever already hosts interactive defaults)
- Optionally modify: `src/components/ui/button.tsx`, `src/components/ProjectCard.tsx`, nav link primitives.

- [ ] **Step 1: Promote the hover class to a global utility**

Add to `globals.css` at the end, scoped to hover-capable pointers so it doesn't fire on touch:

```css
@media (hover: hover) and (pointer: fine) {
  .pixel-hover,
  a.pixel-hover,
  button.pixel-hover {
    cursor: url('/cursors/pixel-pointer.svg') 2 2, pointer;
  }
}
```

(Keeping both a CSS-module class and a global utility lets isolated components opt-in without importing the module.)

- [ ] **Step 2: Apply to surfaces**

Add `pixel-hover` className to:
- Root `<a>` and `<button>` elements in `ui/button.tsx`
- `ProjectCard.tsx` outer link
- Nav links in `Header.tsx`
- Footer links in `Footer.tsx`

Do NOT apply to: text inputs, textareas, MDX prose links inside blog body (those stay system-default so reading feels neutral).

- [ ] **Step 3: Visual verification**

Run `npm run dev`. On desktop, hover through: nav, hero CTA, project cards, footer links. Confirm pixel cursor on all. Hover over the blog body text: confirm system cursor. Resize to mobile width in devtools: confirm no broken cursor state.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/components/ui/button.tsx src/components/ProjectCard.tsx src/components/Header.tsx src/components/Footer.tsx
git commit -m "feat(pixel): apply pixel cursor to interactive surfaces"
```

---

## Task 10 — Verification pass

- [ ] **Step 1: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: PASS (or only warnings you explicitly accept).

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: build succeeds, no new errors.

- [ ] **Step 4: Manual walkthrough in Dia**

- Run `npm run dev`.
- Visit `/`, `/about`, `/projects`, `/projects/<any slug>`, `/blog`, `/cv`, `/archive` — confirm every page renders, no layout shifts.
- Toggle OS dark mode — confirm pixel assets remain readable in both modes.
- Shrink the browser to 360px, 390px, 768px — confirm pixel cursor does not appear on mobile sizes, glyphs don't break tap targets, labels still legible.

- [ ] **Step 5: Accessibility spot-check**

- Tab through `/` — confirm focus rings still visible on all interactive elements.
- Inspect a `SectionMarker` in devtools — confirm its inner `<svg>` has `aria-hidden="true"` (the glyph is decorative; the adjacent label carries meaning).
- Check `PixelDivider` — `aria-hidden="true"` unless used as a standalone semantic separator (in which case `ariaLabel` prop is set).

- [ ] **Step 6: Lighthouse (optional)**

Run: `npm run lighthouse` (needs local server up first).
Expected: performance and a11y scores within your existing budgets. No regression on LCP.

- [ ] **Step 7: Final commit + summary**

If any final touch-ups surfaced during verification, commit them, then tag the work in a summary comment:

```bash
git log --oneline | head -20
```

Confirm the feature is a clean sequence of commits; nothing to squash.

---

## Done criteria

- All five spec moves present: pixelated heatmap, section markers, pixel divider, pixel cursor, pixel favicon + OG mark.
- Label audit inventory exists and each row is resolved in the codebase.
- `npm run build`, `npx tsc --noEmit`, `npm run lint` all pass.
- Manual visual walkthrough clean in light + dark, desktop + mobile.
- No change to typography, palette, motion, or IA.
