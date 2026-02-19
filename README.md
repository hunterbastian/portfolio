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
RESUME_PASSWORD=your-password
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXXX
NEXT_PUBLIC_ENABLE_GTM=true
NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SPEED_INSIGHTS=true
```

- `RESUME_PASSWORD` locks the resume file endpoint (`/api/resume/file`) until unlocked.
- `NEXT_PUBLIC_GTM_ID` overrides the GTM container ID used in production.
- `NEXT_PUBLIC_ENABLE_GTM`, `NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS`, and `NEXT_PUBLIC_ENABLE_SPEED_INSIGHTS` can be set to `true`/`false` to control telemetry loading in production.

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

## Docs

- `AGENTS.md`: agent command and environment reference
- `CHANGELOG.md`: versioned product updates
