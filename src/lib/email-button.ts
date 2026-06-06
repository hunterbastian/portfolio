export const DEFAULT_EMAIL_BUTTON_LABEL = 'email me'

export interface EmailButtonViewStateInput {
  ariaLabel?: string
  email: string
  label?: string
}

export interface EmailButtonViewState {
  ariaLabel: string
  href: string
  label: string
}

export function getEmailButtonHref(email: string) {
  return `mailto:${email}`
}

export function getEmailButtonAriaLabel(email: string) {
  return `Email me directly at ${email}`
}

export function getEmailButtonViewState({
  ariaLabel,
  email,
  label = DEFAULT_EMAIL_BUTTON_LABEL,
}: EmailButtonViewStateInput): EmailButtonViewState {
  return {
    ariaLabel: ariaLabel ?? getEmailButtonAriaLabel(email),
    href: getEmailButtonHref(email),
    label,
  }
}
