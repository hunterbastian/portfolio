# AGENTS.md

## Project Commands

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

## Environment Variables

- `RESUME_PASSWORD`: Locks the resume modal; used by `/api/resume/file` after unlock.

## Notes

- Node.js >= 18.17.0 (see `package.json`).
- `npm run lighthouse` expects a server at `http://localhost:3000`.
- `npm run dev:turbo` is incompatible with JetBrains Mono; use `npm run dev` if that font is enabled.

## TODO

- None.
