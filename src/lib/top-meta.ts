import { CHROME_NAV_ACTIVE_CLASS, CHROME_NAV_INACTIVE_CLASS } from './chrome.ts'

export const TOP_REVEAL_SCROLL_Y = 24
export const TOP_META_SUN_BLINK_MS = 420
export const TOP_META_SUN_IDLE_MIN_MS = 11000
export const TOP_META_SUN_IDLE_JITTER_MS = 7000
export const TOP_META_MOBILE_MENU_LABEL = 'Menu'
export const TOP_META_MOBILE_MENU_OPEN_LABEL = 'Open menu'
export const TOP_META_MOBILE_MENU_CLOSE_LABEL = 'Close menu'
export const TOP_META_HAPTIC_STYLE = 'light'

const TOP_META_SHELL_BASE_CLASS =
  'fixed inset-x-0 top-0 z-50 px-5 py-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] transition-[transform,opacity,filter] duration-300 ease-soft sm:px-8 sm:py-6 sm:pt-6'
const TOP_META_SHELL_HIDDEN_CLASS = 'pointer-events-none -translate-y-3 opacity-0 blur-[2px]'
const TOP_META_SHELL_VISIBLE_CLASS = 'pointer-events-none translate-y-0 opacity-100 blur-0'
const TOP_META_SHELL_FROSTED_CLASS =
  'bg-card/88 shadow-[0_1px_0_0_var(--border),0_10px_26px_-24px_rgba(0,0,0,0.58)] backdrop-blur-sm sm:backdrop-blur-md'

const TOP_META_INNER_BASE_CLASS =
  'relative isolate mx-auto flex max-w-[36rem] min-w-0 items-center justify-between gap-4 border-b border-border pb-2.5 sm:gap-6 sm:pb-4'
const TOP_META_INNER_DISABLED_CLASS = 'pointer-events-none'
const TOP_META_INNER_ENABLED_CLASS = 'pointer-events-auto'

const TOP_META_MOBILE_MENU_BASE_CLASS =
  'fixed right-[max(1.25rem,env(safe-area-inset-right))] top-[calc(3.15rem+env(safe-area-inset-top))] z-50 w-[min(14rem,calc(100vw-2.5rem))] origin-top-right overflow-hidden rounded-[8px] border border-border bg-[#252525] shadow-[0_20px_46px_-28px_rgba(0,0,0,0.72),0_1px_2px_rgba(0,0,0,0.32)] backdrop-blur-sm transition-[opacity,transform] duration-200 ease-soft motion-reduce:transition-none motion-reduce:transform-none'
const TOP_META_MOBILE_MENU_OPEN_CLASS = 'pointer-events-auto visible translate-y-0 opacity-100'
const TOP_META_MOBILE_MENU_CLOSED_CLASS = 'pointer-events-none invisible translate-y-1 opacity-0'
const TOP_META_SUN_BASE_CLASS =
  'header-sun-shell text-muted-foreground/62 transition-[color,filter,transform] duration-200 ease-soft group-hover/peek:scale-[1.08] group-hover/peek:text-foreground/80 group-hover/peek:brightness-110 group-active:scale-[0.96]'
const TOP_META_SUN_BLINK_CLASS = 'animate-hb-sun-blink'
const TOP_META_NAV_LINK_BASE_CLASS =
  'justify-center rounded-[8px] px-3 text-[0.62rem] font-medium tracking-normal transition-[background-color,color,filter,transform] duration-150 sm:text-[0.7rem]'
const TOP_META_NAV_LINK_ACTIVE_CLASS = CHROME_NAV_ACTIVE_CLASS
const TOP_META_NAV_LINK_INACTIVE_CLASS = CHROME_NAV_INACTIVE_CLASS
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

export interface TopMetaHeaderVisibilityInput {
  persistVisible?: boolean
  scrollY: number
}

export interface TopMetaHeaderStateInput extends TopMetaHeaderVisibilityInput {
  mobileMenuOpen: boolean
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

export interface TopMetaMobileMenuToggleActivationInput {
  toggleMobileMenu: () => void
  triggerHaptic: (style: typeof TOP_META_HAPTIC_STYLE) => void
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

export function activateTopMetaMobileMenuToggle({
  toggleMobileMenu,
  triggerHaptic,
}: TopMetaMobileMenuToggleActivationInput) {
  triggerHaptic(TOP_META_HAPTIC_STYLE)
  toggleMobileMenu()
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

export function shouldHideTopMetaHeader({
  persistVisible = false,
  scrollY,
}: TopMetaHeaderVisibilityInput) {
  if (persistVisible) {
    return false
  }

  return scrollY > TOP_REVEAL_SCROLL_Y
}

export function shouldFrostTopMetaHeader({
  persistVisible = false,
  scrollY,
}: TopMetaHeaderVisibilityInput) {
  return persistVisible && scrollY > TOP_REVEAL_SCROLL_Y
}

export function getTopMetaHeaderState({
  mobileMenuOpen,
  persistVisible = false,
  scrollY,
}: TopMetaHeaderStateInput): TopMetaHeaderState {
  const headerHidden = shouldHideTopMetaHeader({ persistVisible, scrollY })

  return {
    headerHidden,
    mobileMenuOpen: headerHidden ? false : mobileMenuOpen,
  }
}

export function getTopMetaPageNavItems(pathname: string) {
  return pathname === '/' ? [] : [...TOP_META_NAV_ITEMS]
}

export function getTopMetaMobilePageNavItems(pathname: string) {
  if (pathname !== '/') {
    return [...TOP_META_NAV_ITEMS]
  }

  return TOP_META_NAV_ITEMS.filter((item) => item.href !== '/')
}

function shouldDisableTopMetaPointerEvents(headerHidden: boolean, mobileMenuOpen: boolean) {
  return headerHidden && !mobileMenuOpen
}

export function getTopMetaShellClassName(headerHidden: boolean, mobileMenuOpen: boolean, frosted = false) {
  return `${TOP_META_SHELL_BASE_CLASS} ${
    shouldDisableTopMetaPointerEvents(headerHidden, mobileMenuOpen)
      ? TOP_META_SHELL_HIDDEN_CLASS
      : TOP_META_SHELL_VISIBLE_CLASS
  }${frosted ? ` ${TOP_META_SHELL_FROSTED_CLASS}` : ''}`
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
