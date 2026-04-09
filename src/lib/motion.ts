export const MOTION_EASE_STANDARD = [0.22, 1, 0.36, 1] as const
/** Softer entrance ease — gentler deceleration for reveals and fades */
export const MOTION_EASE_SOFT = [0.16, 1, 0.3, 1] as const
/** Exit ease — slightly accelerating departure */
export const MOTION_EASE_EXIT = [0.4, 0, 0.7, 0.2] as const
export const MOTION_REDUCED_DURATION = 0.01

/** Spring preset for interactive/layout elements — feels organic and settled */
export const MOTION_SPRING_SMOOTH = { type: 'spring' as const, stiffness: 170, damping: 26, mass: 1 }
/** Snappy spring — responsive buttons, modals, hover lifts */
export const MOTION_SPRING_SNAPPY = { type: 'spring' as const, stiffness: 400, damping: 22 }
/** Bouncy spring — playful micro-interactions, icon wiggles */
export const MOTION_SPRING_BOUNCY = { type: 'spring' as const, stiffness: 500, damping: 12 }
/** Heavy spring — panels, collapsible sections, height animations */
export const MOTION_SPRING_HEAVY = { type: 'spring' as const, stiffness: 200, damping: 28, mass: 0.9 }

export function motionDurationMs(ms: number, prefersReducedMotion: boolean): number {
  return prefersReducedMotion ? MOTION_REDUCED_DURATION : ms / 1000
}

export function motionDelayMs(ms: number, prefersReducedMotion: boolean): number {
  return prefersReducedMotion ? 0 : ms / 1000
}
