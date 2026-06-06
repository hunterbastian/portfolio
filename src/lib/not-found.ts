import { MOTION_EASE_SOFT } from './motion.ts'

export const NOT_FOUND_STATUS_CODE = '404'
export const NOT_FOUND_TITLE = "This page doesn't exist."
export const NOT_FOUND_DESCRIPTION = 'It might have been moved or deleted.'
export const NOT_FOUND_HOME_LABEL = 'Home'
export const NOT_FOUND_HOME_HREF = '/'
export const NOT_FOUND_CONTACT_LABEL = 'Contact'
export const NOT_FOUND_CONTACT_HREF = '/#contact'

export const NOT_FOUND_HOME_ACTION_CLASS =
  'group inline-flex min-h-[40px] origin-center touch-manipulation items-center gap-1.5 font-mono text-[12px] tracking-[0.06em] text-foreground transition-[color,transform] duration-150 hover:text-accent active:translate-y-0 active:scale-[0.96]'

export const NOT_FOUND_HOME_ICON_CLASS =
  'shrink-0 opacity-60 transition-transform duration-200 ease-soft group-hover:-translate-x-1'

export const NOT_FOUND_CONTACT_ACTION_CLASS =
  'inline-flex min-h-[40px] origin-center touch-manipulation items-center text-xs tracking-[0.08em] uppercase text-muted-foreground transition-[color,transform] duration-150 hover:text-accent active:translate-y-0 active:scale-[0.96]'

export const NOT_FOUND_REVEAL_DURATION = 0.4
export const NOT_FOUND_STAGGER_DELAY = 0.08
export const NOT_FOUND_STATUS_DELAY = 0.04

export const NOT_FOUND_BLUR_REVEAL_INITIAL = { opacity: 0, y: 8, filter: 'blur(4px)' } as const
export const NOT_FOUND_BLUR_REVEAL_ANIMATE = { opacity: 1, y: 0, filter: 'blur(0px)' } as const
export const NOT_FOUND_ACTIONS_INITIAL = { opacity: 0, y: 8 } as const
export const NOT_FOUND_ACTIONS_ANIMATE = { opacity: 1, y: 0 } as const

export function getNotFoundStaggerDelay(step: number): number {
  return step * NOT_FOUND_STAGGER_DELAY
}

export function getNotFoundRevealTransition(delay = 0) {
  if (delay === 0) {
    return {
      duration: NOT_FOUND_REVEAL_DURATION,
      ease: MOTION_EASE_SOFT,
    }
  }

  return {
    duration: NOT_FOUND_REVEAL_DURATION,
    delay,
    ease: MOTION_EASE_SOFT,
  }
}
