# Hunter Bastian — Portfolio

Personal portfolio and case study site. Design engineer, creative coder, and photographer based in Utah.

**[hunterbastian.com](https://hunterbastian.com)**

## Stack

- **Framework** — Next.js 16 (App Router)
- **UI** — React 19, TypeScript, Tailwind CSS
- **Animation** — Framer Motion, Motion
- **3D** — Three.js / React Three Fiber
- **Content** — MDX (project case studies)
- **Deployment** — Vercel

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> Use `npm run dev`, not `dev:turbo` — Turbopack is incompatible with the JetBrains Mono font.

## Commands

```bash
# Development
npm run dev              # Dev server on 127.0.0.1:3000
npm run dev:turbo        # Turbopack mode (breaks JetBrains Mono — avoid)

# Build + run
npm run build            # Production build
npm run build:analyze    # Build with bundle analysis
npm run start            # Start production server

# Quality + checks
npm run lint             # ESLint
npm run test:snake       # Snake game unit tests

# Performance + assets
npm run optimize-images  # Compress and convert project images
npm run lighthouse       # Lighthouse audit (requires local server running)
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

| Variable | Purpose |
|---|---|
| `RESUME_PASSWORD` | Locks `/api/resume/file` until unlocked via the resume modal |
| `NEXT_PUBLIC_GTM_ID` | GTM container ID override (defaults to `GTM-5XJBDKM9`) |
| `NEXT_PUBLIC_ENABLE_GTM` | Toggle Google Tag Manager in production |
| `NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS` | Toggle Vercel Analytics in production |
| `NEXT_PUBLIC_ENABLE_SPEED_INSIGHTS` | Toggle Vercel Speed Insights in production |

## Project Layout

```text
src/
├── app/               App Router pages and API routes
├── components/        UI and animation components
└── lib/               Utilities, motion constants, project loader

content/projects/      MDX files — one per project case study
public/                Static assets (images, fonts, icons)
scripts/               Utility scripts (image optimization, etc.)
```

## Notes

- Node.js `>= 18.17.0` required (`.nvmrc` pins 22.14.0)
- `npm run lighthouse` expects a local server at `http://localhost:3000`
- See `CHANGELOG.md` for version history
