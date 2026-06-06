export type EditorialAccentStyle = Record<
  | '--dust-delay-offset'
  | '--editorial-accent'
  | '--editorial-accent-bg'
  | '--editorial-accent-border'
  | '--editorial-accent-shadow'
  | '--glint-delay'
  | '--glint-hover-x'
  | '--glint-hover-y'
  | '--glint-start-x'
  | '--glint-start-y'
  | '--glint-x'
  | '--glint-y',
  string
>

export const EDITORIAL_GLINT_PLACEMENTS = [
  { x: '1px', y: '-1px', hoverX: '1px', hoverY: '0px', startX: '-5px', startY: '3px', delay: '35ms', dust: '20ms' },
  { x: '-1px', y: '1px', hoverX: '-1px', hoverY: '1px', startX: '-4px', startY: '4px', delay: '80ms', dust: '90ms' },
  { x: '2px', y: '0px', hoverX: '2px', hoverY: '-1px', startX: '-6px', startY: '2px', delay: '55ms', dust: '55ms' },
  { x: '0px', y: '2px', hoverX: '0px', hoverY: '2px', startX: '-5px', startY: '5px', delay: '110ms', dust: '130ms' },
] as const
export const EDITORIAL_ITEM_HAPTIC_STYLE = 'light'

export interface EditorialItemActivationInput {
  showToast: (message: string) => void
  title: string
  toastMessage?: string
  tracking?: () => void
  triggerHaptic: (style: typeof EDITORIAL_ITEM_HAPTIC_STYLE) => void
}

export function getEditorialGlintPlacement(title: string) {
  return EDITORIAL_GLINT_PLACEMENTS[title.length % EDITORIAL_GLINT_PLACEMENTS.length]
}

export function getEditorialItemToastMessage(title: string, toastMessage?: string) {
  return toastMessage ?? `Opening ${title}`
}

export function activateEditorialItem({
  showToast,
  title,
  toastMessage,
  tracking,
  triggerHaptic,
}: EditorialItemActivationInput) {
  triggerHaptic(EDITORIAL_ITEM_HAPTIC_STYLE)
  tracking?.()
  showToast(getEditorialItemToastMessage(title, toastMessage))
}

export function getEditorialAccentStyle(title: string, hoverAccentColor: string): EditorialAccentStyle {
  const placement = getEditorialGlintPlacement(title)

  return {
    '--dust-delay-offset': placement.dust,
    '--editorial-accent': hoverAccentColor,
    '--editorial-accent-bg': `color-mix(in srgb, ${hoverAccentColor} 9%, transparent)`,
    '--editorial-accent-border': `color-mix(in srgb, ${hoverAccentColor} 54%, var(--border))`,
    '--editorial-accent-shadow': `color-mix(in srgb, ${hoverAccentColor} 32%, transparent)`,
    '--glint-delay': placement.delay,
    '--glint-hover-x': placement.hoverX,
    '--glint-hover-y': placement.hoverY,
    '--glint-start-x': placement.startX,
    '--glint-start-y': placement.startY,
    '--glint-x': placement.x,
    '--glint-y': placement.y,
  }
}
