import { MOTION_EASE_SOFT } from './motion.ts'

export const RESUME_BUTTON_LABEL = 'Resume'
export const RESUME_BUTTON_MAGNETIC_STRENGTH = 0.15
export const RESUME_BUTTON_MAGNETIC_RANGE = 100
export const RESUME_BUTTON_HAPTIC_STYLE = 'light'
export const RESUME_BUTTON_IDLE_VARIANT = 'idle'
export const RESUME_BUTTON_HOVER_VARIANT = 'hover'
export const RESUME_BUTTON_CLASS_NAME =
  'playground-joy group relative inline-flex items-center gap-2 overflow-hidden px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.08em] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2'
export const RESUME_BUTTON_TEXT_CLASS_NAME = 'relative z-10'
export const RESUME_BUTTON_STYLE = { fontFamily: 'inherit' } as const
export const RESUME_BUTTON_TAP_MOTION = { scale: 0.96, y: 0 } as const
export const RESUME_BUTTON_VARIANTS = {
  idle: { y: 0 },
  hover: { y: -3 },
} as const
export const RESUME_BUTTON_TEXT_VARIANTS = {
  idle: { letterSpacing: '0.06em' },
  hover: {
    letterSpacing: '0.1em',
    transition: { duration: 0.4, ease: MOTION_EASE_SOFT },
  },
} as const

export interface ResumeButtonOpenAction {
  setOpen: (isOpen: boolean) => void
  triggerHaptic: (style: typeof RESUME_BUTTON_HAPTIC_STYLE) => void
}

export function openResumeButtonModal({ setOpen, triggerHaptic }: ResumeButtonOpenAction) {
  triggerHaptic(RESUME_BUTTON_HAPTIC_STYLE)
  setOpen(true)
}

export function getResumeButtonHoverVariant(prefersReducedMotion: boolean) {
  return prefersReducedMotion ? undefined : RESUME_BUTTON_HOVER_VARIANT
}

export function getResumeButtonTapMotion(prefersReducedMotion: boolean) {
  return prefersReducedMotion ? undefined : RESUME_BUTTON_TAP_MOTION
}

export function getResumeButtonTextVariants(prefersReducedMotion: boolean) {
  return prefersReducedMotion ? undefined : RESUME_BUTTON_TEXT_VARIANTS
}
