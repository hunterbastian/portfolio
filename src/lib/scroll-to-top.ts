export const SCROLL_TO_TOP_ARIA_LABEL = 'Scroll to top'
export const SCROLL_TO_TOP_TOAST = 'Back to top'
export const SCROLL_TO_TOP_END_THRESHOLD_PX = 360
export const SCROLL_TO_TOP_MIN_SCROLL_Y = 720
export const SCROLL_TO_TOP_MOTION_DURATION_MS = 220
export const SCROLL_TO_TOP_HAPTIC_STYLE = 'light'
export const SCROLL_TO_TOP_SCROLL_OPTIONS = { top: 0, behavior: 'smooth' } as const

export const SCROLL_TO_TOP_INITIAL_FRAME = {
  opacity: 0,
  y: 10,
  scale: 0.94,
  filter: 'blur(4px)',
} as const

export const SCROLL_TO_TOP_ANIMATE_FRAME = {
  opacity: 1,
  y: 0,
  scale: 1,
  filter: 'blur(0px)',
} as const

export const SCROLL_TO_TOP_EXIT_FRAME = {
  opacity: 0,
  y: 6,
  scale: 0.96,
  filter: 'blur(4px)',
} as const

export const SCROLL_TO_TOP_REDUCED_MOTION_FRAME = {
  opacity: 0,
} as const

export interface ScrollToTopVisibilityInput {
  pageHeight: number
  scrollY: number
  viewportHeight: number
}

export interface ScrollToTopVisibilityUpdateInput extends ScrollToTopVisibilityInput {
  currentVisible: boolean
}

export interface ScrollToTopVisibilityUpdate {
  changed: boolean
  visible: boolean
}

export interface ScrollToTopFrameScheduleState {
  shouldRequestFrame: boolean
  ticking: boolean
}

export interface ScrollToTopActivationInput {
  scrollToTop: (options: typeof SCROLL_TO_TOP_SCROLL_OPTIONS) => void
  showToast: (message: string) => void
  triggerHaptic: (style: typeof SCROLL_TO_TOP_HAPTIC_STYLE) => void
}

export function shouldShowScrollToTop({
  pageHeight,
  scrollY,
  viewportHeight,
}: ScrollToTopVisibilityInput) {
  const viewportBottom = scrollY + viewportHeight
  const nearPageEnd = viewportBottom >= pageHeight - SCROLL_TO_TOP_END_THRESHOLD_PX

  return nearPageEnd && scrollY > SCROLL_TO_TOP_MIN_SCROLL_Y
}

export function getScrollToTopVisibilityUpdate({
  currentVisible,
  pageHeight,
  scrollY,
  viewportHeight,
}: ScrollToTopVisibilityUpdateInput): ScrollToTopVisibilityUpdate {
  const visible = shouldShowScrollToTop({ pageHeight, scrollY, viewportHeight })

  return {
    changed: visible !== currentVisible,
    visible,
  }
}

export function getScrollToTopFrameScheduleState(ticking: boolean): ScrollToTopFrameScheduleState {
  return {
    shouldRequestFrame: !ticking,
    ticking: true,
  }
}

export function getScrollToTopInitialFrame(prefersReducedMotion: boolean) {
  return prefersReducedMotion ? SCROLL_TO_TOP_REDUCED_MOTION_FRAME : SCROLL_TO_TOP_INITIAL_FRAME
}

export function getScrollToTopAnimateFrame() {
  return SCROLL_TO_TOP_ANIMATE_FRAME
}

export function getScrollToTopExitFrame(prefersReducedMotion: boolean) {
  return prefersReducedMotion ? SCROLL_TO_TOP_REDUCED_MOTION_FRAME : SCROLL_TO_TOP_EXIT_FRAME
}

export function activateScrollToTop({
  scrollToTop,
  showToast,
  triggerHaptic,
}: ScrollToTopActivationInput) {
  triggerHaptic(SCROLL_TO_TOP_HAPTIC_STYLE)
  showToast(SCROLL_TO_TOP_TOAST)
  scrollToTop(SCROLL_TO_TOP_SCROLL_OPTIONS)
}
