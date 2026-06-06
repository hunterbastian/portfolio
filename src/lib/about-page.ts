export const ABOUT_PAGE_ACTION_CLASS =
  'min-h-[40px] origin-center touch-manipulation font-mono text-[0.96rem] text-foreground decoration-border underline underline-offset-[0.24em] transition-[color,transform,text-decoration-color] duration-150 hover:-translate-y-[1px] hover:text-foreground/70 hover:decoration-foreground/80 active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'

export interface AboutPageBaseAction {
  id: string
  label: string
  toast: string
}

export interface AboutPageLinkAction extends AboutPageBaseAction {
  href: string
  kind: 'link'
}

export interface AboutPagePreviewAction extends AboutPageBaseAction {
  kind: 'preview'
}

export type AboutPageAction = AboutPageLinkAction | AboutPagePreviewAction

export const ABOUT_PAGE_ACTION_HAPTIC_STYLE = 'light'

export interface AboutPageActionActivationInput {
  action: AboutPageAction
  openResumePreview: () => void
  showToast: (message: string) => void
  triggerHaptic: (style: typeof ABOUT_PAGE_ACTION_HAPTIC_STYLE) => void
}

export const ABOUT_PAGE_ACTIONS = [
  {
    id: 'contact',
    kind: 'link',
    href: '/#contact',
    label: 'Contact',
    toast: 'Say hi',
  },
  {
    id: 'resume',
    kind: 'link',
    href: '/cv',
    label: 'Resume',
    toast: 'Opening resume',
  },
  {
    id: 'preview',
    kind: 'preview',
    label: 'Preview',
    toast: 'Resume opened',
  },
] as const satisfies readonly AboutPageAction[]

export function shouldOpenAboutResumePreview(action: AboutPageAction): boolean {
  return action.kind === 'preview'
}

export function activateAboutPageAction({
  action,
  openResumePreview,
  showToast,
  triggerHaptic,
}: AboutPageActionActivationInput) {
  triggerHaptic(ABOUT_PAGE_ACTION_HAPTIC_STYLE)
  showToast(action.toast)

  if (shouldOpenAboutResumePreview(action)) {
    openResumePreview()
  }
}
