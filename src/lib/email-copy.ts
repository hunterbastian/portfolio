export const EMAIL_COPIED_TOAST = 'Email copied'
export const EMAIL_COPY_TOAST_MS = 1800

export type EmailCopyResult = 'copied' | 'mailto'

export function getEmailAddressFromHref(href: string): string | null {
  if (!href.toLowerCase().startsWith('mailto:')) return null

  const address = href.slice('mailto:'.length).split('?')[0]?.trim() ?? ''
  return address.length > 0 ? address : null
}

export async function copyEmailAddress(
  address: string,
  copyText: (value: string) => Promise<void> = (value) => navigator.clipboard.writeText(value),
): Promise<EmailCopyResult> {
  try {
    await copyText(address)
    return 'copied'
  } catch {
    return 'mailto'
  }
}
