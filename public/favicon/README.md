# Favicon Folder

All favicon and app icon files for the portfolio website.

## Files

- `favicon-source.svg` — single source of truth (radial sunset gradient)
- `favicon.ico` — 16/32/48 combined
- `favicon-16x16.png`, `favicon-32x32.png` — standard PNG favicons
- `favicon-192x192.png`, `favicon-512x512.png` — Android / PWA / high-res
- `apple-touch-icon.png` — 180x180 for iOS home screen

## Regenerating

Edit `favicon-source.svg`, then run:

```bash
node scripts/generate-favicons.mjs
```

Uses `sharp` for PNGs and `magick` (ImageMagick) to pack the `.ico`. Also bump `faviconVersion` in `src/app/layout.tsx` so browsers refetch.
The script also syncs the root `/public/favicon.ico` fallback used by browsers and the service worker.

## Usage

Referenced in `src/app/layout.tsx` metadata via `/favicon/*?v=<version>` URLs.
