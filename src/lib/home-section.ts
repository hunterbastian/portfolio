import { MOTION_EASE_SOFT, motionDurationMs } from './motion.ts'

export const HOME_REVEAL_OFFSET_Y = 12
export const HOME_REVEAL_BLUR = 3
export const HOME_REVEAL_DURATION_MS = 780
export const HOME_REVEAL_SHADOW_DELAY_OFFSET_MS = 80

export type HomeRevealMotionState = Record<string, number | string> & {
  filter: string
  opacity: number
  y: number
}

export function shouldRevealHomeSection(isInView: boolean, prefersReducedMotion: boolean): boolean {
  return isInView || prefersReducedMotion
}

export function getHomeRevealShadowDelay(delayMs: number, prefersReducedMotion: boolean): string {
  return prefersReducedMotion ? '0ms' : `${delayMs + HOME_REVEAL_SHADOW_DELAY_OFFSET_MS}ms`
}

export function getHomeRevealMotionState(revealed: boolean): HomeRevealMotionState {
  return revealed
    ? { opacity: 1, y: 0, filter: 'blur(0px)' }
    : { opacity: 0, y: HOME_REVEAL_OFFSET_Y, filter: `blur(${HOME_REVEAL_BLUR}px)` }
}

export function getHomeRevealInitialState(prefersReducedMotion: boolean): false | HomeRevealMotionState {
  return prefersReducedMotion ? false : getHomeRevealMotionState(false)
}

export function getHomeRevealTransition(delayMs: number, prefersReducedMotion: boolean) {
  return {
    duration: motionDurationMs(HOME_REVEAL_DURATION_MS, prefersReducedMotion),
    delay: prefersReducedMotion ? 0 : delayMs / 1000,
    ease: MOTION_EASE_SOFT,
  }
}

export function getHomeSectionClassName(scrollMarginClassName: string, contentGapClassName: string): string {
  return `${scrollMarginClassName} ${contentGapClassName}`
}
