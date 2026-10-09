export const PAGE_TRANSITION_TIMING = {
  exit: 120,
  enter: 400,
} as const

export const PAGE_ENTRANCE_INITIAL_Y = 8

export function getPageTransitionYOffset(): number {
  return PAGE_ENTRANCE_INITIAL_Y
}

/** First-load HTML stays visible; navigation gets one gentle entrance. */
export function getPageTransitionInitial(isInitialLoad: boolean, prefersReducedMotion: boolean) {
  if (isInitialLoad || prefersReducedMotion) return false
  return { opacity: 0, y: PAGE_ENTRANCE_INITIAL_Y }
}
