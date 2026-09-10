# CLAUDE.MD - Portfolio Project Guide

## Project Overview

Hunter Bastian's personal portfolio website. Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 3, Framer Motion.

## Commands

```bash
# Development
npm run dev              # Dev server on 127.0.0.1:3000
npm run dev:turbo        # Turbopack mode

# Building
npm run build            # Production build (webpack)
npm run build:analyze    # Build with bundle analysis (ANALYZE=true)
npm run start            # Start production server

# Quality
npm run lint             # ESLint
npm run test             # Unit tests + theme regressions (Node test runner)
npm run optimize-images  # Optimize images via scripts/optimize-images.js
npm run lighthouse       # Lighthouse audit (requires local server running first)
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout
│   ├── about/ cv/ logo/      # Static pages
│   ├── archive/              # Playground gallery (full project archive)
│   ├── projects/[slug]/      # Dynamic project pages
│   ├── api/                  # resume/file, revalidate
│   ├── globals.css           # Layout + composition
│   ├── dark-theme.css        # Palette tokens
│   └── view-transitions.css  # Card-to-hero morph
├── components/
│   ├── AnimatedHomePage.tsx  # Homepage animation orchestrator
│   ├── home/                 # Homepage sections
│   ├── launcher/             # Launchpad command palette
│   ├── playground/           # Archive gallery + tiles
│   ├── MorphLink.tsx         # Navigation that hands off to view transitions
│   ├── PageTransition.tsx
│   └── Footer.tsx
├── lib/                      # One module per surface, each with a .test.mts
│   ├── projects.ts           # MDX project loading
│   ├── motion.ts             # Shared eases and duration helpers
│   └── view-transition.ts    # Shared-element morph store
└── types/
    └── project.ts
content/
└── projects/                 # MDX files (one per project)
public/
└── images/optimized/projects/ # Optimized webp project images
```

There is no `Header.tsx` — the top bar is `TopMeta.tsx`. There is no blog.

## Adding Projects

Create `content/projects/your-project.mdx` with this frontmatter:

```mdx
---
title: "Project Title"
displayTitle: "Override label on card"   # optional
description: "Short description."
category: "Mobile Design"
tags: ["UI Design", "Mobile Design"]
image: "/images/optimized/projects/your-image.webp"
video: "/images/projects/hover.mp4"      # optional hover video
demo: ""
github: ""
figjam: ""                               # optional FigJam slide link
featured: false                          # true = large card in grid
date: "2025-01-01"
---
```

Run `npm run optimize-images` before adding new images.

## Motion System

Constants live in `src/lib/motion.ts`:
- `MOTION_EASE_SOFT [0.16, 1, 0.3, 1]` — default entrance/reveal ease
- `MOTION_EASE_EXIT [0.4, 0, 0.7, 0.2]` — exit transitions
- `motionDurationMs()` / `motionDelayMs()` — helpers that respect `prefers-reduced-motion`

Animation orchestration uses named timing constants, stage-driven sequencing via a single integer state, and config objects at the top of the file.

Project navigation is a shared-element morph, not a crossfade: `MorphLink` hands off to the View Transitions API and `src/lib/view-transition.ts` names exactly one element at a time. It falls back to a plain client push without browser support or under reduced motion.

## Icons

Uses `nucleo-pixel-essential` — React SVG icon library. Tree-shakeable ESM imports:
```tsx
import { IconChevronLeft, IconTag } from 'nucleo-pixel-essential'
<IconChevronLeft size={12} />
```
`IconProps` extends `SVGProps<SVGSVGElement>` with `size` and `title` props.

## Typography

- **Geist Mono**: the site-wide text face, loaded in `layout.tsx`
- **Geist Pixel Square**: reserved for the top header

Fluid sizing via `clamp()` in `tailwind.config.ts`. Note that the `font-inter` Tailwind
alias there resolves to Geist Mono — the name is a leftover, not a second font.

## Gotchas

- **WATCHPACK_POLLING** is set in dev commands for filesystem watch reliability
- **Node 22.14.0** required (see `.nvmrc`) — `engines` in package.json says >=18.17.0 but `.nvmrc` pins 22.14.0
- **MDX errors**: Verify frontmatter fields and component imports; check `src/lib/projects.ts` for loading logic
- **Performance budget**: `.lighthousebudgets.json` — run `npm run build:analyze` after significant changes
- **`overflow-hidden` clips box shadows**: Framer Motion height-animation wrappers use `overflow-hidden`. Add padding (`pb-6`) inside the clip boundary so child shadows render.
- **Profile picture**: `public/images/profilepicture.webp` — 200×200 WebP, 13KB. Regenerate with `sharp` if updating; keep dimensions ≤200px.
- **No frosted glass on Endeavors or Contact cards** — user explicitly reverted this; don't re-add.
- **No dark mode toggle and no light theme** — the site ships dark unconditionally and has no `prefers-color-scheme` branch
- **No PixelateHover or DepthCard** — removed in a 2026-03-22 session. Don't re-add.
- **Unlayered CSS beats `@layer utilities`**: a plain rule in `globals.css` overrides a Tailwind utility on the same element. `.top-meta-pill { backdrop-filter: none }` exists to cancel a `backdrop-blur-xl` the markup still carries — deleting it re-enables the blur.
- **Tailwind reads tokens through `withOpacity()`**: 20 custom properties are consumed by `tailwind.config.ts` and never appear in a `var()`. Grepping for `var(--x)` will not find them.

## Color System

Dark only, on a Nord palette. Tokens live in `src/app/dark-theme.css`; `globals.css`
holds layout and composition. Surfaces climb the Polar Night ramp, text comes from
Snow Storm, accents from Frost, and Aurora is reserved for the warm contact cue.

- `--background: #242933` — one step below nord0, so cards read as lifted
- `--card: #2e3440` — nord0
- `--foreground: #eceff4` — nord6
- `--accent: #8fbcbb` — nord7
- `--ambient-grade: #5e81ac` — re-tints the two backdrop photographs, which are
  flattened to luminance first because their own greens and golds have no Nord equivalent

## Deployment

Vercel, auto-deploys from `master` branch. Analytics env vars are listed in `AGENTS.md`; the site reads `NEXT_PUBLIC_GA_ID`, not a GTM id.

## Git

- Main branch: `master`
- Reference `CHANGELOG.md` for version history

## Verification

Run `npm run test` and `npm run lint` before commits, and `npm run build` after multi-file changes. For visual changes, run `npm run dev` and check in a browser.

Two checks worth running when deleting code: `npx tsc --noEmit` catches broken imports the build's incremental cache can miss, and a module reachable only from its own `.test.mts` is dead regardless of how green the suite looks.

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
