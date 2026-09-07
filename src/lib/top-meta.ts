export const TOP_REVEAL_SCROLL_Y = 24
export const TOP_META_SUN_BLINK_MS = 420
export const TOP_META_SUN_IDLE_MIN_MS = 11000
export const TOP_META_SUN_IDLE_JITTER_MS = 7000
export const TOP_META_MOBILE_MENU_LABEL = 'Menu'
export const TOP_META_MOBILE_MENU_OPEN_LABEL = 'Open menu'
export const TOP_META_MOBILE_MENU_CLOSE_LABEL = 'Close menu'
export const TOP_META_LAUNCHPAD_LABEL = 'Launchpad'
export const TOP_META_LAUNCHPAD_PEEK = 'Open Launchpad'
export const TOP_META_LAUNCHPAD_ARIA_LABEL = 'Open Launchpad. Also use CMD K'
export const TOP_META_HAPTIC_STYLE = 'light'

const TOP_META_SHELL_BASE_CLASS =
  'hb-header fixed inset-x-0 top-0 z-50 px-5 py-4 transition-[transform,opacity,filter] duration-300 ease-soft sm:px-8 sm:py-6'
const TOP_META_SHELL_HIDDEN_CLASS = 'pointer-events-none -translate-y-3 opacity-0 blur-[2px]'
const TOP_META_SHELL_VISIBLE_CLASS = 'pointer-events-none translate-y-0 opacity-100 blur-0'

const TOP_META_INNER_BASE_CLASS =
  'relative isolate mx-auto flex max-w-[64rem] items-center justify-between gap-6 border-b border-border/72 pb-4 sm:pb-4'
const TOP_META_INNER_DISABLED_CLASS = 'pointer-events-none'
const TOP_META_INNER_ENABLED_CLASS = 'pointer-events-auto'

const TOP_META_MOBILE_MENU_BASE_CLASS =
  'fixed right-5 top-[3.5rem] z-50 w-[12rem] origin-top-right overflow-hidden rounded-[8px] border border-border/72 bg-card/95 shadow-[0_18px_44px_-28px_rgba(43,39,34,0.56),0_1px_3px_rgba(43,39,34,0.08)] backdrop-blur-xl transition-[opacity,transform,filter] duration-200 ease-soft'
const TOP_META_MOBILE_MENU_OPEN_CLASS = 'pointer-events-auto visible translate-y-0 opacity-100 blur-0'
const TOP_META_MOBILE_MENU_CLOSED_CLASS = 'pointer-events-none invisible translate-y-1 opacity-0 blur-[4px]'
const TOP_META_SUN_BASE_CLASS =
  'header-sun-shell text-accent/85 transition-[color,filter,transform] duration-200 ease-soft group-hover/peek:scale-[1.08] group-hover/peek:text-accent group-hover/peek:brightness-110 group-hover/peek:drop-shadow-[0_0_8px_rgba(255,75,0,0.28)] group-active:scale-[0.96]'
const TOP_META_SUN_BLINK_CLASS = 'animate-hb-sun-blink'
const TOP_META_NAV_ACCENT_CLASS = 'text-[#ff7547]'
const TOP_META_NAV_LINK_BASE_CLASS =
  'justify-center rounded-[8px] px-3 text-[0.76rem] tracking-normal transition-[background-color,color,filter,transform] duration-150 sm:text-[0.94rem]'
const TOP_META_NAV_LINK_ACTIVE_CLASS =
  `${TOP_META_NAV_ACCENT_CLASS} bg-[color-mix(in_srgb,#ff7547_11%,transparent)]`
const TOP_META_NAV_LINK_INACTIVE_CLASS =
  'text-muted-foreground hover:bg-[color-mix(in_srgb,#ff7547_8%,transparent)] hover:text-[#ff7547] focus-visible:bg-[color-mix(in_srgb,#ff7547_8%,transparent)] focus-visible:text-[#ff7547]'
const TOP_META_NAV_LABEL_BASE_CLASS =
  'transition-[color,filter] duration-150 group-hover/peek:brightness-95'
const TOP_META_NAV_LABEL_ACTIVE_CLASS = ''
const TOP_META_NAV_LABEL_INACTIVE_CLASS = ''

export const TOP_META_NAV_ITEMS = [
  { name: 'Home', href: '/', peek: 'Go home', toast: 'Opening home' },
  { name: 'Playground', href: '/archive', peek: 'Open experiments', toast: 'Opening playground' },
] as const

export type TopMetaNavItem = (typeof TOP_META_NAV_ITEMS)[number]

export interface TopMetaActionState {
  analyticsTarget: string
  toast: string
}

export interface TopMetaHeaderState {
  headerHidden: boolean
  mobileMenuOpen: boolean
}

export interface TopMetaHeaderStateInput {
  mobileMenuOpen: boolean
  scrollY: number
}

export interface TopMetaNavActivationInput {
  action: TopMetaActionState
  showToast: (message: string) => void
  trackNavigationClick: (target: string) => void
  triggerHaptic: (style: typeof TOP_META_HAPTIC_STYLE) => void
}

export interface TopMetaBrandActivationInput extends TopMetaNavActivationInput {
  triggerSunBlink: () => void
}

export interface TopMetaLaunchpadActivationInput {
  closeMobileMenu?: () => void
  openLauncher: () => void
  trackNavigationClick: (target: string) => void
  triggerHaptic: (style: typeof TOP_META_HAPTIC_STYLE) => void
}

export interface TopMetaMobileMenuToggleActivationInput {
  toggleMobileMenu: () => void
  triggerHaptic: (style: typeof TOP_META_HAPTIC_STYLE) => void
}

export interface TopMetaLaunchpadPreloadInput {
  preloadLauncher: () => void
}

export interface TopMetaSunBlinkActivationInput<TTimer> {
  clearTimer: (timer: TTimer) => void
  currentTimer: TTimer | null
  scheduleTimer: (callback: () => void, delayMs: typeof TOP_META_SUN_BLINK_MS) => TTimer
  setSunBlinking: (blinking: boolean) => void
}

export const TOP_META_BRAND_ACTION = {
  analyticsTarget: 'home',
  toast: 'Opening home',
} as const satisfies TopMetaActionState

export const TOP_META_LAUNCHPAD_ACTION = {
  analyticsTarget: 'launchpad',
} as const

export function isTopMetaNavItemActive(pathname: string, item: Pick<TopMetaNavItem, 'href'>) {
  return item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
}

export function getTopMetaAnalyticsTarget(name: string) {
  return name.toLowerCase()
}

export function getTopMetaNavAction(item: Pick<TopMetaNavItem, 'name' | 'toast'>): TopMetaActionState {
  return {
    analyticsTarget: getTopMetaAnalyticsTarget(item.name),
    toast: item.toast,
  }
}

export function activateTopMetaNavAction({
  action,
  showToast,
  trackNavigationClick,
  triggerHaptic,
}: TopMetaNavActivationInput) {
  triggerHaptic(TOP_META_HAPTIC_STYLE)
  trackNavigationClick(action.analyticsTarget)
  showToast(action.toast)
}

export function activateTopMetaBrandAction({
  action,
  showToast,
  trackNavigationClick,
  triggerHaptic,
  triggerSunBlink,
}: TopMetaBrandActivationInput) {
  triggerHaptic(TOP_META_HAPTIC_STYLE)
  trackNavigationClick(action.analyticsTarget)
  triggerSunBlink()
  showToast(action.toast)
}

export function activateTopMetaLaunchpad({
  closeMobileMenu,
  openLauncher,
  trackNavigationClick,
  triggerHaptic,
}: TopMetaLaunchpadActivationInput) {
  triggerHaptic(TOP_META_HAPTIC_STYLE)
  trackNavigationClick(TOP_META_LAUNCHPAD_ACTION.analyticsTarget)
  closeMobileMenu?.()
  openLauncher()
}

export function activateTopMetaMobileMenuToggle({
  toggleMobileMenu,
  triggerHaptic,
}: TopMetaMobileMenuToggleActivationInput) {
  triggerHaptic(TOP_META_HAPTIC_STYLE)
  toggleMobileMenu()
}

export function preloadTopMetaLaunchpad({ preloadLauncher }: TopMetaLaunchpadPreloadInput) {
  preloadLauncher()
}

export function getTopMetaSunIdleDelay(random: () => number = Math.random) {
  return TOP_META_SUN_IDLE_MIN_MS + random() * TOP_META_SUN_IDLE_JITTER_MS
}

export function activateTopMetaSunBlink<TTimer>({
  clearTimer,
  currentTimer,
  scheduleTimer,
  setSunBlinking,
}: TopMetaSunBlinkActivationInput<TTimer>): TTimer {
  setSunBlinking(true)

  if (currentTimer !== null) {
    clearTimer(currentTimer)
  }

  return scheduleTimer(() => setSunBlinking(false), TOP_META_SUN_BLINK_MS)
}

export function shouldHideTopMetaHeader(scrollY: number) {
  return scrollY > TOP_REVEAL_SCROLL_Y
}

export function getTopMetaHeaderState({
  mobileMenuOpen,
  scrollY,
}: TopMetaHeaderStateInput): TopMetaHeaderState {
  const headerHidden = shouldHideTopMetaHeader(scrollY)

  return {
    headerHidden,
    mobileMenuOpen: headerHidden ? false : mobileMenuOpen,
  }
}

function shouldDisableTopMetaPointerEvents(headerHidden: boolean, mobileMenuOpen: boolean) {
  return headerHidden && !mobileMenuOpen
}

export function getTopMetaShellClassName(headerHidden: boolean, mobileMenuOpen: boolean) {
  return `${TOP_META_SHELL_BASE_CLASS} ${
    shouldDisableTopMetaPointerEvents(headerHidden, mobileMenuOpen)
      ? TOP_META_SHELL_HIDDEN_CLASS
      : TOP_META_SHELL_VISIBLE_CLASS
  }`
}

export function getTopMetaInnerClassName(headerHidden: boolean, mobileMenuOpen: boolean) {
  return `${TOP_META_INNER_BASE_CLASS} ${
    shouldDisableTopMetaPointerEvents(headerHidden, mobileMenuOpen)
      ? TOP_META_INNER_DISABLED_CLASS
      : TOP_META_INNER_ENABLED_CLASS
  }`
}

export function getTopMetaMobileMenuClassName(mobileMenuOpen: boolean) {
  return `${TOP_META_MOBILE_MENU_BASE_CLASS} ${
    mobileMenuOpen ? TOP_META_MOBILE_MENU_OPEN_CLASS : TOP_META_MOBILE_MENU_CLOSED_CLASS
  }`
}

export function getTopMetaMobileMenuAriaLabel(mobileMenuOpen: boolean) {
  return mobileMenuOpen ? TOP_META_MOBILE_MENU_CLOSE_LABEL : TOP_META_MOBILE_MENU_OPEN_LABEL
}

export function getTopMetaSunClassName(sunBlinking: boolean) {
  return `${TOP_META_SUN_BASE_CLASS}${sunBlinking ? ` ${TOP_META_SUN_BLINK_CLASS}` : ''}`
}

export function getTopMetaNavLinkClassName(active: boolean) {
  return `${TOP_META_NAV_LINK_BASE_CLASS} ${
    active ? TOP_META_NAV_LINK_ACTIVE_CLASS : TOP_META_NAV_LINK_INACTIVE_CLASS
  }`
}

export function getTopMetaNavLabelClassName(active: boolean) {
  return `${TOP_META_NAV_LABEL_BASE_CLASS} ${
    active ? TOP_META_NAV_LABEL_ACTIVE_CLASS : TOP_META_NAV_LABEL_INACTIVE_CLASS
  }`
}
