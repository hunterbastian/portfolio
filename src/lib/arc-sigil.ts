export const ARC_SIGIL_EXPORT_COLORS = {
  stroke: '#d8dee9',
  accent: '#d4928e',
  background: '#2e3440',
  panel: '#3b4252',
} as const

export const ARC_SIGIL_DOWNLOAD_FILES = {
  logoPng: 'hunter-logo.png',
  logoSvg: 'hunter-logo.svg',
  linkedInPng: 'hunter-linkedin-logo-400x400.png',
} as const

export type ArcSigilDownloadActionId = keyof typeof ARC_SIGIL_DOWNLOAD_FILES

export interface ArcSigilDownloadAction {
  id: ArcSigilDownloadActionId
  label: string
}

export const ARC_SIGIL_DOWNLOAD_ACTIONS: readonly ArcSigilDownloadAction[] = [
  { id: 'logoSvg', label: 'Download SVG' },
  { id: 'logoPng', label: 'Download PNG' },
  { id: 'linkedInPng', label: 'LinkedIn 400x400' },
] as const

export const ARC_SIGIL_EXPORT_SIZES = {
  linkedInPng: { width: 400, height: 400 },
  logoPng: { width: 1200, height: 1200 },
} as const

export const ARC_SIGIL_LOADER_BASE_CLASS = 'flex flex-col items-center justify-center gap-5'
export const ARC_SIGIL_LOADER_FRAME_CLASS = 'relative isolate'
export const ARC_SIGIL_DOWNLOAD_BUTTON_CLASS = 'nord-button px-3 py-2 text-xs font-mono tracking-[0.08em] uppercase'

export function getArcSigilLoaderClassName(className = ''): string {
  return className ? `${ARC_SIGIL_LOADER_BASE_CLASS} ${className}` : ARC_SIGIL_LOADER_BASE_CLASS
}

export function getArcSigilLoaderSizeStyle(size: number) {
  const pixelSize = `${size}px`

  return {
    width: pixelSize,
    height: pixelSize,
  }
}

export function getArcSigilGroupMarkup(
  stroke = ARC_SIGIL_EXPORT_COLORS.stroke,
  accent = ARC_SIGIL_EXPORT_COLORS.accent,
) {
  return `
    <g fill="none" stroke="${stroke}" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="60" cy="60" r="44" stroke-width="1.4" />
      <circle cx="60" cy="60" r="30" stroke-width="1.0" opacity="0.45" />
      <path d="M24 42l72 36" stroke-width="0.8" opacity="0.22" />
      <path d="M20 66l80-12" stroke-width="0.8" opacity="0.18" />
      <line x1="60" y1="26" x2="60" y2="38" stroke-width="1.6" />
      <circle cx="60" cy="60" r="4.2" fill="${stroke}" stroke="none" opacity="0.95" />
    </g>
    <g fill="none" stroke="${accent}" stroke-linecap="round" stroke-linejoin="round">
      <path d="M90 48a32 32 0 0 1-4 24" stroke-width="2.1" />
      <path d="M84 34a44 44 0 0 1 8 22" stroke-width="1.5" opacity="0.7" />
      <circle cx="60" cy="16" r="2.1" fill="${accent}" stroke="none" />
      <circle cx="96" cy="62" r="2.1" fill="${accent}" stroke="none" />
    </g>
  `
}

export function buildArcSigilLogoSvgMarkup() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
      ${getArcSigilGroupMarkup()}
    </svg>
  `.trim()
}

export function buildArcSigilLinkedInSvgMarkup() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="none">
      <rect width="400" height="400" fill="${ARC_SIGIL_EXPORT_COLORS.background}" />
      <circle cx="200" cy="200" r="170" fill="${ARC_SIGIL_EXPORT_COLORS.panel}" />
      <g transform="translate(55 55) scale(2.4167)">
        ${getArcSigilGroupMarkup()}
      </g>
    </svg>
  `.trim()
}
