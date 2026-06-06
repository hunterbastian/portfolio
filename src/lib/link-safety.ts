export const BLANK_LINK_TARGET = '_blank'
export const SAFE_BLANK_LINK_REL = 'noopener noreferrer'

export function isExternalHttpHref(href: string) {
  return /^https?:\/\//.test(href)
}

export function getSafeExternalLinkRel(target?: string, rel?: string) {
  return rel ?? (target === BLANK_LINK_TARGET ? SAFE_BLANK_LINK_REL : undefined)
}
