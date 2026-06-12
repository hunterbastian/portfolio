export const PROJECT_CONTACT_CTA_SOURCE = 'project_cta'
export const PROJECT_CONTACT_CTA_RESUME_TARGET = 'project_cta_resume'
export const PROJECT_CONTACT_CTA_EMAIL_PLATFORM = 'email'
export const PROJECT_CONTACT_CTA_RESUME_HREF = '/cv'
export const PROJECT_CONTACT_CTA_HAPTIC_STYLE = 'light'

export const PROJECT_CONTACT_CTA_ACTION_CLASS_NAME =
  'group inline-flex min-h-[40px] origin-center touch-manipulation items-center gap-2 border border-border/75 bg-background px-3 py-2 font-mono text-[0.72rem] text-foreground shadow-card-subtle transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-[1px] hover:border-foreground/20 hover:shadow-card active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'

export const PROJECT_CONTACT_CTA_ICON_CLASS_NAME =
  'h-3 w-3 text-muted-foreground transition-[color,transform] duration-150 group-hover:text-foreground group-hover:-translate-y-px'

export const PROJECT_CONTACT_CTA_COPY = {
  eyebrow: 'Work together',
  heading: 'Interested in this kind of work?',
  description: 'View my resume or send a quick note about a similar project.',
  resumeLabel: 'View resume',
  resumeToast: 'Opening resume',
  emailLabel: 'Email me',
  emailToast: 'Opening email',
} as const

export interface ProjectContactAnalyticsContext {
  source: typeof PROJECT_CONTACT_CTA_SOURCE
  projectSlug: string
  projectTitle: string
}

export type ProjectContactCtaActionIcon = 'file-text' | 'mail'

export type ProjectContactCtaAction =
  | {
      analyticsKind: 'navigation'
      analyticsTarget: typeof PROJECT_CONTACT_CTA_RESUME_TARGET
      ariaLabel: string
      href: typeof PROJECT_CONTACT_CTA_RESUME_HREF
      icon: 'file-text'
      label: typeof PROJECT_CONTACT_CTA_COPY.resumeLabel
      toast: typeof PROJECT_CONTACT_CTA_COPY.resumeToast
    }
  | {
      analyticsKind: 'external'
      analyticsTarget: typeof PROJECT_CONTACT_CTA_EMAIL_PLATFORM
      ariaLabel: string
      href: string
      icon: 'mail'
      label: typeof PROJECT_CONTACT_CTA_COPY.emailLabel
      toast: typeof PROJECT_CONTACT_CTA_COPY.emailToast
    }

export interface ProjectContactCtaActionsInput {
  inquiryHref: string
  personName: string
  projectTitle: string
}

export interface ProjectContactCtaActivationInput {
  action: ProjectContactCtaAction
  analyticsContext: ProjectContactAnalyticsContext
  showToast: (message: string) => void
  trackExternalLink: (
    href: string,
    platform: string,
    context: ProjectContactAnalyticsContext,
  ) => void
  trackNavigationClick: (
    target: string,
    context: ProjectContactAnalyticsContext,
  ) => void
  triggerHaptic: (style: typeof PROJECT_CONTACT_CTA_HAPTIC_STYLE) => void
}

export function getProjectContactAnalyticsContext(
  projectSlug: string,
  projectTitle: string,
): ProjectContactAnalyticsContext {
  return {
    source: PROJECT_CONTACT_CTA_SOURCE,
    projectSlug,
    projectTitle,
  }
}

export function getProjectContactResumeAriaLabel(projectTitle: string) {
  return `View resume after reading ${projectTitle}`
}

export function getProjectContactEmailAriaLabel(personName: string, projectTitle: string) {
  return `Email ${personName} about work like ${projectTitle}`
}

export function getProjectContactCtaActions({
  inquiryHref,
  personName,
  projectTitle,
}: ProjectContactCtaActionsInput): ProjectContactCtaAction[] {
  return [
    {
      analyticsKind: 'navigation',
      analyticsTarget: PROJECT_CONTACT_CTA_RESUME_TARGET,
      ariaLabel: getProjectContactResumeAriaLabel(projectTitle),
      href: PROJECT_CONTACT_CTA_RESUME_HREF,
      icon: 'file-text',
      label: PROJECT_CONTACT_CTA_COPY.resumeLabel,
      toast: PROJECT_CONTACT_CTA_COPY.resumeToast,
    },
    {
      analyticsKind: 'external',
      analyticsTarget: PROJECT_CONTACT_CTA_EMAIL_PLATFORM,
      ariaLabel: getProjectContactEmailAriaLabel(personName, projectTitle),
      href: inquiryHref,
      icon: 'mail',
      label: PROJECT_CONTACT_CTA_COPY.emailLabel,
      toast: PROJECT_CONTACT_CTA_COPY.emailToast,
    },
  ]
}

export function activateProjectContactCtaAction({
  action,
  analyticsContext,
  showToast,
  trackExternalLink,
  trackNavigationClick,
  triggerHaptic,
}: ProjectContactCtaActivationInput) {
  triggerHaptic(PROJECT_CONTACT_CTA_HAPTIC_STYLE)

  if (action.analyticsKind === 'navigation') {
    trackNavigationClick(action.analyticsTarget, analyticsContext)
  } else {
    trackExternalLink(action.href, action.analyticsTarget, analyticsContext)
  }

  showToast(action.toast)
}
