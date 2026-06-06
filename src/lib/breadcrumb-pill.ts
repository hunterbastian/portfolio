export const BREADCRUMB_PILL_CLASS =
  'group top-meta-pill inline-flex min-h-[40px] origin-center touch-manipulation items-center gap-2 px-5 py-2.5 font-mono text-[11px] tracking-[0.12em] text-muted-foreground backdrop-blur-xl transition-[color,transform] duration-150 hover:text-foreground active:translate-y-0 active:scale-[0.96]'

export const BREADCRUMB_ICON_CLASS =
  'shrink-0 opacity-60 transition-transform duration-200 ease-soft group-hover:-translate-x-1'

export const BREADCRUMB_PARENT_LABEL_CLASS = 'text-foreground opacity-90'
export const BREADCRUMB_SEPARATOR_CLASS = 'text-muted-foreground/30'
export const BREADCRUMB_HAPTIC_STYLE = 'light'

export interface BreadcrumbPillViewStateInput {
  currentLabel: string
  href: string
  parentLabel: string
}

export interface BreadcrumbPillViewState {
  analyticsTarget: string
  currentLabel: string
  href: string
  parentLabel: string
}

export interface BreadcrumbPillActivationInput {
  analyticsTarget: string
  trackNavigationClick: (target: string) => void
  triggerHaptic: (style: typeof BREADCRUMB_HAPTIC_STYLE) => void
}

export function getBreadcrumbAnalyticsTarget(parentLabel: string) {
  return parentLabel.toLowerCase()
}

export function getBreadcrumbPillViewState({
  currentLabel,
  href,
  parentLabel,
}: BreadcrumbPillViewStateInput): BreadcrumbPillViewState {
  return {
    analyticsTarget: getBreadcrumbAnalyticsTarget(parentLabel),
    currentLabel,
    href,
    parentLabel,
  }
}

export function activateBreadcrumbPill({
  analyticsTarget,
  trackNavigationClick,
  triggerHaptic,
}: BreadcrumbPillActivationInput) {
  triggerHaptic(BREADCRUMB_HAPTIC_STYLE)
  trackNavigationClick(analyticsTarget)
}
