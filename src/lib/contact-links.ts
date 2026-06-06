export interface ContactLink {
  label: string
  href: string
  external?: boolean
  ariaLabel?: string
}

export interface ContactLinkAction<TLink extends ContactLink = ContactLink> {
  link: TLink
  platform: string
  toast: string
}

export interface ContactSocialLinkView<TLink extends ContactLink = ContactLink> extends ContactLinkAction<TLink> {
  ariaLabel: string
  rel: 'noreferrer' | undefined
  target: '_blank' | undefined
}

export interface ContactLinksView<TLink extends ContactLink = ContactLink> {
  emailAction: ContactLinkAction<TLink> | undefined
  emailAddress: string
  emailAriaLabel: string
  emailLink: TLink | undefined
  socialLinks: ContactSocialLinkView<TLink>[]
}

export const CONTACT_EMAIL_LABEL = 'Email'
export const CONTACT_EMAIL_TOAST = 'Opening email'
export const CONTACT_LINK_HAPTIC_STYLE = 'light'

export interface ContactLinkActivationInput<TLink extends ContactLink = ContactLink> {
  action: ContactLinkAction<TLink>
  showToast: (message: string) => void
  trackExternalLink: (href: string, platform: string) => void
  triggerHaptic: (style: typeof CONTACT_LINK_HAPTIC_STYLE) => void
}

export function getContactEmailLink<TLink extends ContactLink>(links: TLink[]): TLink | undefined {
  return links.find((link) => link.label === CONTACT_EMAIL_LABEL)
}

export function getContactSocialLinks<TLink extends ContactLink>(links: TLink[]): TLink[] {
  return links.filter((link) => link.label !== CONTACT_EMAIL_LABEL)
}

export function getContactEmailAddress(emailHref: string | undefined) {
  return emailHref?.replace(/^mailto:/, '').split('?')[0] ?? ''
}

export function shouldContactLinkOpenNewTab(link: ContactLink) {
  return Boolean(link.external && !link.href.startsWith('mailto:'))
}

export function getContactLinkPlatform(link: ContactLink) {
  return link.label.toLowerCase()
}

export function getContactLinkToast(link: ContactLink) {
  return link.label === CONTACT_EMAIL_LABEL ? CONTACT_EMAIL_TOAST : `Opening ${link.label}`
}

export function getContactLinkAriaLabel(link: ContactLink) {
  return link.ariaLabel ?? `Open ${link.label}`
}

export function getContactEmailAriaLabel(emailAddress: string) {
  return `Email me directly at ${emailAddress}`
}

export function getContactSocialLinkView<TLink extends ContactLink>(link: TLink): ContactSocialLinkView<TLink> {
  const opensNewTab = shouldContactLinkOpenNewTab(link)

  return {
    ariaLabel: getContactLinkAriaLabel(link),
    link,
    platform: getContactLinkPlatform(link),
    rel: opensNewTab ? 'noreferrer' : undefined,
    target: opensNewTab ? '_blank' : undefined,
    toast: getContactLinkToast(link),
  }
}

export function getContactLinkAction<TLink extends ContactLink>(link: TLink): ContactLinkAction<TLink> {
  return {
    link,
    platform: getContactLinkPlatform(link),
    toast: getContactLinkToast(link),
  }
}

export function getContactLinksView<TLink extends ContactLink>(links: TLink[]): ContactLinksView<TLink> {
  const emailLink = getContactEmailLink(links)
  const emailAddress = getContactEmailAddress(emailLink?.href)

  return {
    emailAction: emailLink ? getContactLinkAction(emailLink) : undefined,
    emailAddress,
    emailAriaLabel: getContactEmailAriaLabel(emailAddress),
    emailLink,
    socialLinks: getContactSocialLinks(links).map((link) => getContactSocialLinkView(link)),
  }
}

export function activateContactLink<TLink extends ContactLink>({
  action,
  showToast,
  trackExternalLink,
  triggerHaptic,
}: ContactLinkActivationInput<TLink>) {
  triggerHaptic(CONTACT_LINK_HAPTIC_STYLE)
  trackExternalLink(action.link.href, action.platform)
  showToast(action.toast)
}
