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

Add this optional value to `.env.local` to lock resume access:

```bash
RESUME_PASSWORD=your-password
```

The resume file is served through `/api/resume/file` only after unlock.

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
