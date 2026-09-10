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
npm run test

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

- Node.js `>= 18.17.0`; `.nvmrc` pins 22.14.0
- `npm run lighthouse` expects a local server at `http://localhost:3000`

## Docs

- `AGENTS.md`: agent command and environment reference
- `CHANGELOG.md`: versioned product updates
