export interface HomeHeroAction {
  analyticsLabel: string
  href: string
  label: string
  peek: string
  toast: string
}

export const HOME_HERO_ACTION_CLASS_NAME = 'text-[0.74rem] text-foreground hover:text-foreground/70 sm:text-[0.78rem]'
export const HOME_HERO_ACTION_LABEL_CLASS_NAME = 'underline decoration-transparent underline-offset-[0.2em] group-hover/peek:decoration-current group-focus-visible/peek:decoration-current'
export const HOME_HERO_ACTION_HAPTIC_STYLE = 'light'
export const HOME_HERO_PROFILE_DEFOCUS_BASE_CLASS =
  'transition-[filter,opacity,transform] duration-300 ease-soft motion-reduce:transition-none'
export const HOME_HERO_PROFILE_DEFOCUS_IDLE_CLASS = 'translate-y-0 blur-0 opacity-100'
export const HOME_HERO_PROFILE_DEFOCUS_ACTIVE_CLASS = 'translate-y-[1px] blur-[1.35px] opacity-65'
export const HOME_HERO_LOCAL_TIME_ZONE = 'America/Denver'
export const HOME_HERO_LOCAL_TIME_UPDATE_MS = 30_000
export const HOME_HERO_INLINE_LOCAL_TIME_CLASS_NAME =
  'home-hero-local-time inline whitespace-nowrap text-inherit'
export const HOME_HERO_TIME_TOGGLE_CLASS_NAME =
  'home-hero-time-toggle relative inline-flex shrink-0 cursor-pointer items-baseline whitespace-nowrap rounded-[3px] font-[inherit] text-[inherit] leading-[inherit] tracking-[inherit] text-inherit underline decoration-current/35 decoration-dotted decoration-[1px] underline-offset-[0.22em] transition-[color,opacity,transform,text-decoration-color] duration-200 ease-soft hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.96] motion-reduce:transition-none'
export const HOME_HERO_TIME_VALUE_CLASS_NAME = 'home-hero-time-value tabular-nums'
export const HOME_HERO_TIME_TOGGLE_HAPTIC_STYLE = 'light'

export type HomeHeroLocalTimeFormat = 'standard' | 'military'

export interface HomeHeroActionActivationInput {
  action: HomeHeroAction
  showToast: (message: string) => void
  trackNavigationClick: (target: string) => void
  triggerHaptic: (style: typeof HOME_HERO_ACTION_HAPTIC_STYLE) => void
}

export const HOME_HERO_ACTIONS: readonly HomeHeroAction[] = [
  {
    analyticsLabel: 'contact',
    href: '/#contact',
    label: 'Contact',
    peek: 'Say hi',
    toast: 'Say hi',
  },
  {
    analyticsLabel: 'resume',
    href: '/cv',
    label: 'Resume',
    peek: 'Open resume',
    toast: 'Opening resume',
  },
]

export function getHomeHeroIntroParagraphs(intro: string): string[] {
  return intro.split('\n\n')
}

export function formatHomeHeroLocalTime(
  date: Date,
  format: HomeHeroLocalTimeFormat = 'standard',
): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: format === 'military' ? '2-digit' : 'numeric',
    hour12: format === 'standard',
    hourCycle: format === 'military' ? 'h23' : undefined,
    minute: '2-digit',
    timeZone: HOME_HERO_LOCAL_TIME_ZONE,
  }).format(date)
}

export function getNextHomeHeroLocalTimeFormat(format: HomeHeroLocalTimeFormat): HomeHeroLocalTimeFormat {
  return format === 'standard' ? 'military' : 'standard'
}

export function getHomeHeroLocalTimeToggleLabel(format: HomeHeroLocalTimeFormat, localTime: string) {
  const nextFormat = getNextHomeHeroLocalTimeFormat(format)
  const nextFormatLabel = nextFormat === 'military' ? '24-hour time' : 'AM/PM time'

  return `Switch to ${nextFormatLabel}. Current time is ${localTime}.`
}

export function getHomeHeroProfileDefocusClassName(active: boolean) {
  return `${HOME_HERO_PROFILE_DEFOCUS_BASE_CLASS} ${
    active ? HOME_HERO_PROFILE_DEFOCUS_ACTIVE_CLASS : HOME_HERO_PROFILE_DEFOCUS_IDLE_CLASS
  }`
}

export function activateHomeHeroAction({
  action,
  showToast,
  trackNavigationClick,
  triggerHaptic,
}: HomeHeroActionActivationInput) {
  triggerHaptic(HOME_HERO_ACTION_HAPTIC_STYLE)
  trackNavigationClick(action.analyticsLabel)
  showToast(action.toast)
}
