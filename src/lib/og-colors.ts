// Shared OG image color palette — matches light-mode CSS variables from globals.css
// Satori (ImageResponse) can't read CSS vars, so these must be hardcoded.
// Update here if the light-mode palette in globals.css changes.

export const OG_COLORS = {
  background: '#f2f1ef',
  foreground: '#171717',
  accent: '#7f8f81',
  muted: '#a09d98',
} as const
