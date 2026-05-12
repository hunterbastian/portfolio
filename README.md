# Portfolio

Minimal personal portfolio site built with Next.js, React, and TypeScript.

## Quick Start

```bash
npm install
npm run dev
```

## Commands

```bash
# Development
npm run dev
npm run dev:turbo

# Build + run
npm run build
npm run build:analyze
npm run start

# Quality + checks
npm run lint
npm run test:snake

# Performance + assets
npm run performance
npm run optimize-images
npm run lighthouse
```

## Environment

Add these optional values to `.env.local`:

```bash
NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SPEED_INSIGHTS=true
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ENABLE_GA=false
```

- The resume PDF is public through `/api/resume/file`; no password is required.
- `NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS` controls Vercel Web Analytics in production on Vercel; it defaults to enabled.
- `NEXT_PUBLIC_ENABLE_SPEED_INSIGHTS` controls Vercel Speed Insights in production on Vercel; it defaults to enabled.
- `NEXT_PUBLIC_GA_ID` and `NEXT_PUBLIC_ENABLE_GA=true` opt into Google Analytics. GA is off by default because Vercel is the primary analytics path.

## Project Layout

```text
src/               App Router pages, components, utilities
content/projects/  MDX project content
public/            Static assets
private/           Local private assets and update notes
scripts/           Utility scripts
```

## Notes

- Node.js `>= 18.17.0`
- `npm run lighthouse` expects a local server at `http://localhost:3000`

## Responsive Transition Notes

- The homepage watches for viewport changes that cross `mobile`, `tablet`, and `desktop` breakpoints in `src/components/AnimatedHomePage.tsx`.
- `useBreakpointChange()` toggles a short-lived `CreatingLoader` overlay for `900ms` whenever the layout mode changes.
- The current overlay uses a light, background-tinted blur instead of a dark opacity wash:
  `rgba(var(--background-rgb), 0.16)` with `blur(14px) saturate(0.92)`.
- The effect is disabled for users who prefer reduced motion.

## Docs

- `AGENTS.md`: agent command and environment reference
- `CHANGELOG.md`: versioned product updates
