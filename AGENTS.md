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
npm run test

# Performance + assets
npm run performance
npm run optimize-images
npm run lighthouse
```

## Environment Variables

- The resume PDF is public through `/api/resume/file`; no password environment variable is required.
- `NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS`: Set `true`/`false` to control Vercel Web Analytics in production on Vercel; defaults to `true`.
- `NEXT_PUBLIC_ENABLE_SPEED_INSIGHTS`: Set `true`/`false` to control Vercel Speed Insights in production on Vercel; defaults to `true`.
- `NEXT_PUBLIC_GA_ID`: Optional Google Analytics measurement ID.
- `NEXT_PUBLIC_ENABLE_GA`: Set `true` to enable Google Analytics in production when `NEXT_PUBLIC_GA_ID` is present; defaults to `false`.

## Notes

- Node.js >= 18.17.0 (see `package.json`); `.nvmrc` pins 22.14.0.
- `npm run lighthouse` expects a server at `http://localhost:3000`.

## TODO

- None.
