import { MOTION_EASE_SOFT, motionDurationMs } from './motion.ts'

export const HOME_REVEAL_OFFSET_Y = 16
export const HOME_REVEAL_DURATION_MS = 640

export type HomeRevealMotionState = Record<string, number | string> & {
  opacity: number
  y: number
}

export function shouldRevealHomeSection(isInView: boolean, prefersReducedMotion: boolean): boolean {
  return isInView || prefersReducedMotion
}

export function getHomeRevealMotionState(revealed: boolean): HomeRevealMotionState {
  return revealed
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: HOME_REVEAL_OFFSET_Y }
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

export const HOME_SECTION_TITLE_CLASS_NAME =
  'font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-subtle-foreground sm:text-[11px]'
export const HOME_SECTION_RULE_CLASS_NAME = 'h-px w-full bg-border'

export function getHomeSectionClassName(scrollMarginClassName: string, contentGapClassName: string): string {
  return `${scrollMarginClassName} ${contentGapClassName}`
}
