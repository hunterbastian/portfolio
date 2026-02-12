export const MOTION_EASE_STANDARD = [0.22, 1, 0.36, 1] as const
export const MOTION_REDUCED_DURATION = 0.01

export function motionDurationMs(ms: number, prefersReducedMotion: boolean): number {
  return prefersReducedMotion ? MOTION_REDUCED_DURATION : ms / 1000
}

export function motionDelayMs(ms: number, prefersReducedMotion: boolean): number {
  return prefersReducedMotion ? 0 : ms / 1000
}
