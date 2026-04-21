// Shared OG image color palette — matches light-mode CSS variables from globals.css
// Satori (ImageResponse) can't read CSS vars, so these must be hardcoded.
// Update here if the light-mode palette in globals.css changes.

export const OG_COLORS = {
  background: '#f2f0ec',
  foreground: '#3f4f5c',
  accent: '#d4928e',
  muted: '#a8a8a8',
} as const
