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
│   └── sections/             # Homepage sections
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
description: "Short description."
category: "Mobile Design"
tags: ["UI Design", "Mobile Design"]
image: "/images/optimized/projects/your-image.webp"
demo: ""
github: ""
featured: false
date: "2025-01-01"
---
```

Run `npm run optimize-images` before adding new images.

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

## Deployment

Vercel, auto-deploys from `master` branch. No required environment variables currently.

## Git

- Main branch: `master`
- Reference `CHANGELOG.md` for version history
