import { getEmailButtonHref } from './email-button.ts'

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

/** Empty dates stay out of the row so the title does not shift. */
export function getCvEntryDate(year: string) {
  const trimmed = year.trim()
  return trimmed.length > 0 ? trimmed : null
}

/** Empty descriptions stay out of the row so they do not add a blank line. */
export function getCvEntryDetail(description: string) {
  const trimmed = description.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function formatCvEducationDetail(item: { level: string; note?: string }) {
  const note = item.note?.trim()
  return note ? `${item.level} · ${note}` : item.level
}
