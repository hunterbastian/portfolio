export type HomeHeroActionVariant = 'primary' | 'secondary'

export interface HomeHeroAction {
  analyticsLabel: string
  href: string
  label: string
  peek: string
  toast: string
  variant: HomeHeroActionVariant
}

export const HOME_HERO_ACTION_HAPTIC_STYLE = 'light'
export const HOME_HERO_PROFILE_DEFOCUS_BASE_CLASS =
  'transition-[filter,opacity,transform] duration-300 ease-soft motion-reduce:transition-none'
export const HOME_HERO_PROFILE_DEFOCUS_IDLE_CLASS = 'translate-y-0 blur-0 opacity-100'
export const HOME_HERO_PROFILE_DEFOCUS_ACTIVE_CLASS = 'translate-y-[1px] blur-[1.35px] opacity-65'
export const HOME_HERO_LOCAL_TIME_ZONE = 'America/Denver'
export const HOME_HERO_LOCAL_TIME_UPDATE_MS = 60_000
export const HOME_HERO_NAME_CLASS_NAME =
  'break-words text-pretty font-hero-name text-[36px] font-semibold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-[44px]'
export const HOME_HERO_INTRO_CLASS_NAME =
  'w-full max-w-full text-pretty font-header text-[14px] font-normal leading-[1.5] tracking-[-0.012em] text-foreground sm:text-[14px] sm:leading-[1.5]'
export const HOME_HERO_LOCATION_META_CLASS_NAME =
  'flex max-w-full items-baseline gap-x-1.5 overflow-hidden whitespace-nowrap font-mono text-[10px] font-normal leading-none text-subtle-foreground'
export const HOME_HERO_LOCATION_LABEL_CLASS_NAME = 'uppercase tracking-[0.18em]'
export const HOME_HERO_LOCAL_TIME_SEPARATOR_CLASS_NAME =
  'select-none font-normal tracking-normal text-subtle-foreground/70'
export const HOME_HERO_LOCAL_TIME_CLASS_NAME =
  'tabular-nums tracking-[0.04em] text-subtle-foreground/80'
export const HOME_HERO_CONTACT_LINE_CLASS_NAME =
  'max-w-[31rem] font-header text-[0.9rem] font-normal leading-[1.5] tracking-[-0.02em] text-foreground sm:text-[0.96rem]'

const HOME_HERO_ACTION_BASE_CLASS_NAME =
  'min-h-[44px] min-w-[44px] items-center font-medium sm:min-h-0 sm:min-w-0 text-[0.74rem] sm:text-[0.78rem]'

export const HOME_HERO_PRIMARY_ACTION_CLASS_NAME =
  `${HOME_HERO_ACTION_BASE_CLASS_NAME} text-foreground hover:text-foreground/80`
export const HOME_HERO_SECONDARY_ACTION_CLASS_NAME =
  `${HOME_HERO_ACTION_BASE_CLASS_NAME} text-muted-foreground/78 hover:text-foreground/70`
export const HOME_HERO_PRIMARY_ACTION_LABEL_CLASS_NAME =
  'underline decoration-current/40 underline-offset-[0.2em] group-hover/peek:decoration-current group-focus-visible/peek:decoration-current'
export const HOME_HERO_SECONDARY_ACTION_LABEL_CLASS_NAME =
  'underline decoration-transparent underline-offset-[0.2em] group-hover/peek:decoration-current group-focus-visible/peek:decoration-current'

export interface HomeHeroActionActivationInput {
  action: HomeHeroAction
  showToast: (message: string) => void
  trackNavigationClick: (target: string) => void
  triggerHaptic: (style: typeof HOME_HERO_ACTION_HAPTIC_STYLE) => void
}

export const HOME_HERO_ACTIONS: readonly HomeHeroAction[] = [
  {
    analyticsLabel: 'resume',
    href: '/cv',
    label: 'Resume',
    peek: 'Open resume',
    toast: 'Opening resume',
    variant: 'primary',
  },
]

export function getHomeHeroIntroParagraphs(intro: string): string[] {
  return intro.split('\n\n')
}

export function formatHomeHeroLocalTime(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    hourCycle: 'h23',
    minute: '2-digit',
    timeZone: HOME_HERO_LOCAL_TIME_ZONE,
  }).formatToParts(date)

  const hour = parts.find((part) => part.type === 'hour')?.value ?? '00'
  const minute = parts.find((part) => part.type === 'minute')?.value ?? '00'

  return `${hour}:${minute}`
}

export function getHomeHeroLocalTimeAriaLabel(localTime: string) {
  return `${localTime} in Lehi`
}

export function getHomeHeroLocalTimeDelayMs(
  date: Date,
  intervalMs = HOME_HERO_LOCAL_TIME_UPDATE_MS,
) {
  const elapsedMs = date.getTime() % intervalMs

  return elapsedMs === 0 ? intervalMs : intervalMs - elapsedMs
}

export function getHomeHeroActionClassName(variant: HomeHeroActionVariant) {
  switch (variant) {
    case 'primary':
      return HOME_HERO_PRIMARY_ACTION_CLASS_NAME
    case 'secondary':
      return HOME_HERO_SECONDARY_ACTION_CLASS_NAME
    default: {
      const _exhaustive: never = variant
      return _exhaustive
    }
  }
}

export function getHomeHeroActionLabelClassName(variant: HomeHeroActionVariant) {
  switch (variant) {
    case 'primary':
      return HOME_HERO_PRIMARY_ACTION_LABEL_CLASS_NAME
    case 'secondary':
      return HOME_HERO_SECONDARY_ACTION_LABEL_CLASS_NAME
    default: {
      const _exhaustive: never = variant
      return _exhaustive
    }
  }
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
