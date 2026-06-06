export const SCROLL_INDICATOR_SIZE = 24
export const SCROLL_INDICATOR_STROKE_WIDTH = 2.8
export const SCROLL_INDICATOR_MIN_PROGRESS = 0.08
export const SCROLL_INDICATOR_PROGRESS_RANGE = 0.92
export const SCROLL_INDICATOR_FILL_OPACITY_BASE = 0.08
export const SCROLL_INDICATOR_FILL_OPACITY_RANGE = 0.1
export const SCROLL_INDICATOR_FILL_BACKGROUND =
  'color-mix(in srgb, var(--foreground) 6%, var(--background) 94%)'
export const SCROLL_INDICATOR_FILL_BOX_SHADOW =
  'inset 0 0 0 1px color-mix(in srgb, var(--foreground) 20%, transparent)'
export const SCROLL_INDICATOR_TRACK_STROKE =
  'color-mix(in srgb, var(--foreground) 30%, white 70%)'
export const SCROLL_INDICATOR_PROGRESS_STROKE =
  'color-mix(in srgb, var(--foreground) 48%, white 52%)'
export const SCROLL_INDICATOR_DASH_TRANSITION = 'stroke-dashoffset 120ms linear'

export interface ScrollIndicatorProgressInput {
  pageHeight: number
  scrollY: number
  viewportHeight: number
}

export interface ScrollIndicatorDocumentElementSource {
  scrollHeight: number
}

export interface ScrollIndicatorViewportSource {
  innerHeight: number
  scrollY: number
}

export interface ScrollIndicatorRenderState {
  center: number
  circumference: number
  dashOffset: number
  fillOpacity: number
  radius: number
  size: number
  strokeWidth: number
}

export interface ScrollIndicatorFillStyle {
  backgroundColor: string
  boxShadow: string
  opacity: number
}

export interface ScrollIndicatorDashStyle {
  transition: string
}

export interface ScrollIndicatorSubscriptionInput<TFrame = number> {
  addEventListener: (
    type: 'resize' | 'scroll',
    listener: () => void,
    options?: { passive: boolean },
  ) => void
  cancelAnimationFrame: (frame: TFrame) => void
  documentElement: ScrollIndicatorDocumentElementSource
  removeEventListener: (type: 'resize' | 'scroll', listener: () => void) => void
  requestAnimationFrame: (callback: () => void) => TFrame
  setProgress: (progress: number) => void
  viewport: ScrollIndicatorViewportSource
}

export function getScrollIndicatorProgress({
  pageHeight,
  scrollY,
  viewportHeight,
}: ScrollIndicatorProgressInput) {
  const scrollableHeight = pageHeight - viewportHeight
  const scrollPercent = scrollableHeight <= 0 ? 0 : scrollY / scrollableHeight

  return Math.min(
    Math.max(
      scrollPercent * SCROLL_INDICATOR_PROGRESS_RANGE + SCROLL_INDICATOR_MIN_PROGRESS,
      SCROLL_INDICATOR_MIN_PROGRESS,
    ),
    1,
  )
}

export function getScrollIndicatorProgressFromViewport({
  documentElement,
  viewport,
}: {
  documentElement: ScrollIndicatorDocumentElementSource
  viewport: ScrollIndicatorViewportSource
}) {
  return getScrollIndicatorProgress({
    pageHeight: documentElement.scrollHeight,
    scrollY: viewport.scrollY,
    viewportHeight: viewport.innerHeight,
  })
}

export function getScrollIndicatorGeometry(
  size = SCROLL_INDICATOR_SIZE,
  strokeWidth = SCROLL_INDICATOR_STROKE_WIDTH,
) {
  const radius = (size - strokeWidth) / 2

  return {
    circumference: 2 * Math.PI * radius,
    radius,
    size,
    strokeWidth,
  }
}

export function getScrollIndicatorDashOffset(progress: number, circumference: number) {
  return circumference * (1 - progress)
}

export function getScrollIndicatorFillOpacity(progress: number) {
  return SCROLL_INDICATOR_FILL_OPACITY_BASE + progress * SCROLL_INDICATOR_FILL_OPACITY_RANGE
}

export function getScrollIndicatorFillStyle(fillOpacity: number): ScrollIndicatorFillStyle {
  return {
    backgroundColor: SCROLL_INDICATOR_FILL_BACKGROUND,
    boxShadow: SCROLL_INDICATOR_FILL_BOX_SHADOW,
    opacity: fillOpacity,
  }
}

export function getScrollIndicatorDashStyle(): ScrollIndicatorDashStyle {
  return {
    transition: SCROLL_INDICATOR_DASH_TRANSITION,
  }
}

export function getScrollIndicatorRenderState(
  progress: number,
): ScrollIndicatorRenderState {
  const geometry = getScrollIndicatorGeometry()

  return {
    ...geometry,
    center: geometry.size / 2,
    dashOffset: getScrollIndicatorDashOffset(progress, geometry.circumference),
    fillOpacity: getScrollIndicatorFillOpacity(progress),
  }
}

export function subscribeScrollIndicatorProgress<TFrame = number>({
  addEventListener,
  cancelAnimationFrame,
  documentElement,
  removeEventListener,
  requestAnimationFrame,
  setProgress,
  viewport,
}: ScrollIndicatorSubscriptionInput<TFrame>) {
  let frameId: TFrame | null = null

  const updateScrollProgress = () => {
    frameId = null
    setProgress(getScrollIndicatorProgressFromViewport({ documentElement, viewport }))
  }

  const onScroll = () => {
    if (frameId !== null) return
    frameId = requestAnimationFrame(updateScrollProgress)
  }

  updateScrollProgress()

  addEventListener('scroll', onScroll, { passive: true })
  addEventListener('resize', onScroll, { passive: true })

  return () => {
    removeEventListener('scroll', onScroll)
    removeEventListener('resize', onScroll)

    if (frameId !== null) {
      cancelAnimationFrame(frameId)
    }
  }
}
