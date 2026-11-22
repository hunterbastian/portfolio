export const PAGE_TRANSITION_TIMING = {
  exit: 160,
  enter: 200,
} as const

/** Opacity only. A vertical offset would move the page and show up as layout shift. */
export const PAGE_ENTRANCE_INITIAL_Y = 0
export const PAGE_FADE_EASE = [0.2, 0, 0, 1] as const

export function getPageTransitionYOffset(): number {
  return PAGE_ENTRANCE_INITIAL_Y
}

/** First-load HTML stays visible; navigation fades in without moving. */
export function getPageTransitionInitial(isInitialLoad: boolean, prefersReducedMotion: boolean) {
  if (isInitialLoad || prefersReducedMotion) return false
  return { opacity: 0 }
}
