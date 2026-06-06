export const FOOTER_SCROLL_REVEAL_THRESHOLD = 24
export const FOOTER_SCROLL_DELTA_THRESHOLD = 6
export const FOOTER_PAGE_END_PADDING = 160
export const FOOTER_SPARKLE_DURATION_MS = 1300
export const FOOTER_REVEAL_OBSERVER_THRESHOLD = 0.35
export const FOOTER_HOME_SHELL_CLASS = 'footer-coast-shell'
export const FOOTER_VISIBLE_CLASS = 'translate-y-0 opacity-100'
export const FOOTER_HIDDEN_CLASS = 'pointer-events-none translate-y-6 opacity-0'
export const FOOTER_SPARKLE_BASE_CLASS = 'footer-pixel-sun transition-transform duration-200 ease-soft'
export const FOOTER_SPARKLE_ACTIVE_CLASS = 'animate-hb-sun-blink'
export const FOOTER_BASE_CLASS =
  'px-5 pb-10 pt-12 transition-[transform,opacity] duration-300 ease-soft sm:px-8 sm:pb-14 sm:pt-20'
export const FOOTER_INNER_CLASS = 'mx-auto max-w-[36rem] border-t border-border/80 pt-6'
export const FOOTER_META_ROW_CLASS =
  'flex items-start justify-between gap-4 text-[0.76rem] text-muted-foreground'
export const FOOTER_COPYRIGHT_CLASS = 'shrink-0 font-header transition-colors duration-150 hover:text-foreground/78'
export const FOOTER_MADE_LINE_CLASS =
  'footer-made-line inline-flex items-center justify-end gap-2 text-right font-header transition-colors duration-150 hover:text-foreground/78'
export const FOOTER_PIXEL_SUN_SHELL_CLASS = 'footer-pixel-sun-shell'
export const FOOTER_MADE_LABEL = 'Made with care in Utah.'

export interface FooterVisibilityInput {
  lastScrollY: number
  pageHeight: number
  scrollY: number
  viewportHeight: number
}

export interface FooterSparkleRevealInput {
  hasFired: boolean
  isIntersecting?: boolean
}

export interface FooterSparkleActivationInput {
  markFired: () => void
  scheduleDeactivate: (durationMs: typeof FOOTER_SPARKLE_DURATION_MS) => void
  setActive: (active: boolean) => void
}

export interface FooterVisibilityDocumentSource {
  scrollHeight: number
}

export interface FooterVisibilityViewportSource {
  innerHeight: number
  scrollY: number
}

export interface FooterVisibilitySubscriptionInput<TFrame = number> {
  addEventListener: (type: 'scroll', listener: () => void, options?: { passive: boolean }) => void
  cancelAnimationFrame: (frame: TFrame) => void
  documentElement: FooterVisibilityDocumentSource
  getLastScrollY: () => number
  removeEventListener: (type: 'scroll', listener: () => void) => void
  requestAnimationFrame: (callback: () => void) => TFrame
  setHidden: (hidden: boolean) => void
  setLastScrollY: (scrollY: number) => void
  viewport: FooterVisibilityViewportSource
}

export function isNearFooterPageEnd({
  pageHeight,
  scrollY,
  viewportHeight,
}: Pick<FooterVisibilityInput, 'pageHeight' | 'scrollY' | 'viewportHeight'>) {
  return scrollY + viewportHeight >= pageHeight - FOOTER_PAGE_END_PADDING
}

export function getNextFooterHidden({
  lastScrollY,
  pageHeight,
  scrollY,
  viewportHeight,
}: FooterVisibilityInput) {
  const delta = Math.abs(scrollY - lastScrollY)
  const scrollingDown = scrollY > lastScrollY

  if (scrollY <= FOOTER_SCROLL_REVEAL_THRESHOLD || isNearFooterPageEnd({ pageHeight, scrollY, viewportHeight })) {
    return false
  }

  if (delta > FOOTER_SCROLL_DELTA_THRESHOLD) {
    return !scrollingDown
  }

  return null
}

export function subscribeFooterVisibility<TFrame = number>({
  addEventListener,
  cancelAnimationFrame,
  documentElement,
  getLastScrollY,
  removeEventListener,
  requestAnimationFrame,
  setHidden,
  setLastScrollY,
  viewport,
}: FooterVisibilitySubscriptionInput<TFrame>) {
  let frameId: TFrame | null = null

  const update = () => {
    frameId = null
    const scrollY = viewport.scrollY
    const nextHidden = getNextFooterHidden({
      lastScrollY: getLastScrollY(),
      pageHeight: documentElement.scrollHeight,
      scrollY,
      viewportHeight: viewport.innerHeight,
    })

    if (nextHidden !== null) {
      setHidden(nextHidden)
    }

    setLastScrollY(scrollY)
  }

  const onScroll = () => {
    if (frameId !== null) return
    frameId = requestAnimationFrame(update)
  }

  setLastScrollY(viewport.scrollY)
  addEventListener('scroll', onScroll, { passive: true })

  return () => {
    removeEventListener('scroll', onScroll)

    if (frameId !== null) {
      cancelAnimationFrame(frameId)
    }
  }
}

export function shouldActivateFooterSparkle({
  hasFired,
  isIntersecting,
}: FooterSparkleRevealInput) {
  return Boolean(isIntersecting) && !hasFired
}

export function activateFooterSparkle({
  markFired,
  scheduleDeactivate,
  setActive,
}: FooterSparkleActivationInput) {
  markFired()
  setActive(true)
  scheduleDeactivate(FOOTER_SPARKLE_DURATION_MS)
}

export function getFooterShellClassName(pathname: string) {
  return pathname === '/' ? FOOTER_HOME_SHELL_CLASS : ''
}

export function getFooterVisibilityClassName(hidden: boolean) {
  return hidden ? FOOTER_HIDDEN_CLASS : FOOTER_VISIBLE_CLASS
}

export function getFooterClassName(pathname: string, hidden: boolean) {
  return `${getFooterShellClassName(pathname)} ${FOOTER_BASE_CLASS} ${getFooterVisibilityClassName(hidden)}`
}

export function getFooterSparkleClassName(active: boolean) {
  return active
    ? `${FOOTER_SPARKLE_BASE_CLASS} ${FOOTER_SPARKLE_ACTIVE_CLASS}`
    : FOOTER_SPARKLE_BASE_CLASS
}

export function getFooterCopyrightLabel(year: number) {
  return `\u00a9 ${year} Hunter Bastian`
}
