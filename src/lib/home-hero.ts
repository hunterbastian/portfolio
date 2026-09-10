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

const HOME_HERO_ACTION_BASE_CLASS_NAME =
  'min-h-[44px] min-w-[44px] items-center sm:min-h-0 sm:min-w-0 text-[0.74rem] sm:text-[0.78rem]'

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
  {
    analyticsLabel: 'contact',
    href: '/#contact',
    label: 'Contact',
    peek: 'Say hi',
    toast: 'Say hi',
    variant: 'secondary',
  },
]

export function getHomeHeroIntroParagraphs(intro: string): string[] {
  return intro.split('\n\n')
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
