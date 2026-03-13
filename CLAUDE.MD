# CLAUDE.MD - Portfolio Project Guide

## Project Overview

Hunter Bastian's personal portfolio website. Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Framer Motion, Three.js.

## Commands

```bash
# Development
npm run dev              # Dev server on 127.0.0.1:3000 (use this, not dev:turbo)
npm run dev:turbo        # Turbopack mode — BREAKS JetBrains Mono font, avoid

# Building
npm run build            # Production build
npm run build:analyze    # Build with bundle analysis (ANALYZE=true)
npm run start            # Start production server

# Quality
npm run lint             # ESLint
npm run test:snake       # Run snake game unit tests (Node test runner)
npm run optimize-images  # Optimize images via scripts/optimize-images.js
npm run lighthouse       # Lighthouse audit (requires local server running first)
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout
│   ├── about/                # About page
│   ├── projects/[slug]/      # Dynamic project pages
│   └── api/                  # API routes
├── components/
│   ├── AnimatedHomePage.tsx  # Main homepage animation orchestrator
│   ├── HeroCanvas.tsx        # Three.js 3D hero scene
│   ├── HeroCanvasWrapper.tsx # SSR-safe wrapper for HeroCanvas
│   ├── Footer.tsx
│   ├── FooterSnakeEasterEgg.tsx
│   ├── Header.tsx
│   └── ScrollToTop.tsx       # Floating back-to-top button
├── lib/
│   ├── projects.ts           # MDX project loading utilities
│   ├── motion.ts             # Framer Motion variants
│   └── snake.ts              # Snake game logic
└── types/
    └── project.ts            # Project type definitions
content/
└── projects/                 # MDX files (one per project)
public/
└── images/optimized/projects/ # Optimized webp project images
```

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

Blog posts go in `content/blog/your-slug.mdx` with frontmatter: `title`, `description`, `date`, `tags` (optional). Blog nav link is prepared but hidden — add `{ name: 'BLOG', href: '/blog' }` to `PAGE_NAV` in `Header.tsx` to enable.

Run `npm run optimize-images` before adding new images.

## Motion System

Spring-first animation approach. Constants live in `src/lib/motion.ts`:
- `MOTION_EASE_SOFT [0.16, 1, 0.3, 1]` — default entrance/reveal ease
- `MOTION_EASE_EXIT [0.4, 0, 0.7, 0.2]` — exit transitions
- `MOTION_SPRING_SMOOTH { stiffness: 170, damping: 26, mass: 1 }` — interactive/layout elements
- `motionDurationMs()` / `motionDelayMs()` — helpers that respect `prefers-reduced-motion`

Animation orchestration uses the Interface Craft storyboard pattern: named timing constants, stage-driven sequencing via a single integer state, config objects at the top of the file.

## Icons

Uses `nucleo-pixel-essential` — React SVG icon library. Tree-shakeable ESM imports:
```tsx
import { IconChevronLeft, IconTag } from 'nucleo-pixel-essential'
<IconChevronLeft size={12} />
```
`IconProps` extends `SVGProps<SVGSVGElement>` with `size` and `title` props.

## Typography

- **Inter**: Primary UI font
- **JetBrains Mono**: Code/monospace — **incompatible with Turbopack**
- **EB Garamond**: Serif accents

Fluid sizing via `clamp()` in `tailwind.config.ts`.

## Gotchas

- **Use `npm run dev`, not `dev:turbo`** — Turbopack breaks JetBrains Mono
- **WATCHPACK_POLLING** is set in dev commands for filesystem watch reliability
- **Node 22.14.0** required (see `.nvmrc`) — `engines` field in package.json says >=18.17.0 but `.nvmrc` pins 22.14.0
- **Three.js SSR**: Always use `HeroCanvasWrapper` (not `HeroCanvas` directly) for SSR safety
- **MDX errors**: Verify frontmatter fields and component imports; check `src/lib/projects.ts` for loading logic
- **Performance budget**: `.lighthousebudgets.json` — run `npm run build:analyze` after significant changes
- **`overflow-hidden` clips box shadows**: Framer Motion height-animation wrappers use `overflow-hidden`. Add padding (`pb-6`) to `contentClassName` to create space *inside* the clip boundary so child shadows render.
- **`CollapsibleSection` shadow clipping**: Use `contentClassName="mt-4 pb-6"` (not outer section padding) to prevent box shadows being clipped by the animation wrapper's `overflow-hidden`.
- **Hero headline one-line**: Add `whitespace-nowrap` to the `<h1>` in `AnimatedHomePage.tsx:522` to prevent "Hunter Bastian // Studio Alpine" from wrapping.
- **Profile picture**: `public/images/profilepicture.webp` — 200×200 WebP, 13KB. Regenerate with `sharp` if updating; keep dimensions ≤200px.

## Color System

Light-by-default, warm neutral palette. Dark mode via `.dark` class on `<html>` (toggled by user, persisted in localStorage).

**Light mode** (`:root` in `globals.css`):
- `--background: #f2f1ef` — warm off-white canvas
- `--card: #f6f5f3` — slightly lighter panels
- `--foreground / --primary: #171717` — near-black text
- `--accent: #7f8f81` — muted sage green

**Dark mode** (`.dark` in `globals.css`):
- `--background: #232527` — dark charcoal canvas
- `--card: #2a2c2f` — slightly lighter panels
- `--foreground / --primary: #cdc8c0` — warm light gray text
- `--accent: #8a9b7a` — olive green

## Deployment

Vercel, auto-deploys from `master` branch. Set `RESUME_PASSWORD` and `NEXT_PUBLIC_GTM_ID` in Vercel environment variables.

## Git

- Main branch: `master`
- Reference `CHANGELOG.md` for version history
