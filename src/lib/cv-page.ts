import { getEmailButtonHref } from './email-button.ts'
import { MOTION_EASE_SOFT } from './motion.ts'

type CvExternalContactAnalytics = {
  kind: 'external'
  platform: string
}

type CvNavigationContactAnalytics = {
  kind: 'navigation'
  target: string
}

export type CvContactAnalytics = CvExternalContactAnalytics | CvNavigationContactAnalytics

export interface CvContactLink {
  label: string
  href: string
  analytics: CvContactAnalytics
  printNoUnderline?: boolean
}

export type CvContactAnalyticsEvent =
  | {
      href: string
      kind: 'external'
      platform: string
    }
  | {
      kind: 'navigation'
      target: string
    }

export interface CvContactClickActivationInput {
  link: CvContactLink
  trackExternalLink: (href: string, platform: string) => void
  trackNavigationClick: (target: string) => void
}

export interface CvPrintActivationInput {
  printPage: () => void
  trackResumeAction: (action: typeof CV_RESUME_PRINT_ACTION) => void
}

export const CV_LOCATION_LABEL = 'Utah, USA'
export const CV_EMAIL_ADDRESS = 'hunterbastianux@gmail.com'
export const CV_PORTFOLIO_LABEL = 'hunterbastian.com'
export const CV_PORTFOLIO_URL = 'https://hunterbastian.com'
export const CV_LINKEDIN_LABEL = 'LinkedIn'
export const CV_LINKEDIN_URL = 'https://linkedin.com/in/hunterbastian'
export const CV_PRINT_BUTTON_LABEL = 'Print'
export const CV_PRINT_ARIA_LABEL = 'Print or save as PDF'
export const CV_RESUME_VIEW_ACTION = 'view'
export const CV_RESUME_PRINT_ACTION = 'print'
export const CV_ITEM_STAGGER_DELAY = 0.06
export const CV_ITEM_ENTRANCE_BASE_DELAY = 0.3
export const CV_ITEM_ENTRANCE_DURATION = 0.4
export const CV_ITEM_HIDDEN_MOTION = { opacity: 0, y: 8 } as const
export const CV_PRINT_BUTTON_CLASS_NAME =
  'print:hidden ml-4 inline-flex min-h-[40px] origin-center touch-manipulation shrink-0 items-center border border-border bg-card px-3 py-1.5 text-[10px] font-mono tracking-[0.12em] text-muted-foreground transition-[color,transform,border-color] duration-150 hover:border-foreground/20 hover:text-foreground active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2'
export const CV_CONTACT_LIST_CLASS_NAME =
  'mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-mono tracking-wide text-muted-foreground/70'

const CV_CONTACT_LINK_BASE_CLASS_NAME =
  'origin-center touch-manipulation underline-offset-4 transition-[color,transform,text-decoration-color] duration-150 hover:text-foreground hover:underline active:translate-y-0 active:scale-[0.96]'
const CV_CONTACT_LINK_PRINT_CLASS_NAME = 'print:no-underline'

export const CV_CONTACT_LINKS: CvContactLink[] = [
  {
    label: CV_EMAIL_ADDRESS,
    href: getEmailButtonHref(CV_EMAIL_ADDRESS),
    analytics: { kind: 'external', platform: 'email' },
  },
  {
    label: CV_PORTFOLIO_LABEL,
    href: CV_PORTFOLIO_URL,
    analytics: { kind: 'navigation', target: 'portfolio_link' },
    printNoUnderline: true,
  },
  {
    label: CV_LINKEDIN_LABEL,
    href: CV_LINKEDIN_URL,
    analytics: { kind: 'external', platform: 'linkedin' },
  },
]

export function getCvContactAnalyticsEvent(link: CvContactLink): CvContactAnalyticsEvent {
  if (link.analytics.kind === 'external') {
    return {
      href: link.href,
      kind: 'external',
      platform: link.analytics.platform,
    }
  }

  return {
    kind: 'navigation',
    target: link.analytics.target,
  }
}

export function activateCvContactClick({
  link,
  trackExternalLink,
  trackNavigationClick,
}: CvContactClickActivationInput) {
  const event = getCvContactAnalyticsEvent(link)

  if (event.kind === 'external') {
    trackExternalLink(event.href, event.platform)
    return
  }

  trackNavigationClick(event.target)
}

export function activateCvPrint({
  printPage,
  trackResumeAction,
}: CvPrintActivationInput) {
  trackResumeAction(CV_RESUME_PRINT_ACTION)
  printPage()
}

export function getCvContactLinkClassName(printNoUnderline?: boolean) {
  return `${CV_CONTACT_LINK_BASE_CLASS_NAME}${printNoUnderline ? ` ${CV_CONTACT_LINK_PRINT_CLASS_NAME}` : ''}`
}

export function getCvItemVisibleMotion(index: number, prefersReducedMotion: boolean) {
  return {
    opacity: 1,
    y: 0,
    transition: {
      delay: prefersReducedMotion ? 0 : CV_ITEM_ENTRANCE_BASE_DELAY + index * CV_ITEM_STAGGER_DELAY,
      duration: prefersReducedMotion ? 0 : CV_ITEM_ENTRANCE_DURATION,
      ease: MOTION_EASE_SOFT,
    },
  }
}
