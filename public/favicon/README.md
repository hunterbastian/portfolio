# Favicon Folder

All favicon and app icon files for the portfolio website.

## Files

- `favicon-source.svg` — single source of truth (64x64 blocky pixelated sun mark)
- `favicon.svg` — browser-facing SVG favicon copied from the source
- `favicon.ico` — 16/32/48 combined
- `/public/favicon.ico` — root browser fallback copied from `favicon/favicon.ico`
- `favicon-16x16.png`, `favicon-32x32.png` — standard PNG favicons
- `favicon-192x192.png`, `favicon-512x512.png` — Android / PWA / high-res
- `apple-touch-icon.png` — 180x180 for iOS home screen

## Regenerating

Edit `favicon-source.svg`, then run:

```bash
node scripts/generate-favicons.mjs
```

Uses `sharp` to render the 64x64 block-based SVG source with nearest-neighbor scaling, then packs the PNG favicon set into `favicon.ico`, copies the browser-facing SVG, and copies the root `/favicon.ico` fallback. Also bump `siteConfig.faviconVersion` in `src/lib/site.ts` so browsers refetch.

## Usage

Referenced in `src/app/layout.tsx` metadata via `/favicon/*?v=<version>` URLs.
