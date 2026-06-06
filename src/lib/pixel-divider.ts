export const PIXEL_DIVIDER_WIDTH = 36
export const PIXEL_DIVIDER_HEIGHT = 4
export const PIXEL_DIVIDER_VIEW_BOX = '0 0 36 4'
export const PIXEL_DIVIDER_RECT_SIZE = 4
export const PIXEL_DIVIDER_RECT_FILL = 'currentColor'
export const PIXEL_DIVIDER_RECT_X_POSITIONS = [0, 16, 32] as const

export function getPixelDividerClassName(crispClassName: string, className?: string) {
  return [crispClassName, className].filter(Boolean).join(' ')
}

export function getPixelDividerRole(ariaLabel?: string) {
  return ariaLabel ? 'img' : 'presentation'
}

export function getPixelDividerAriaHidden(ariaLabel?: string) {
  return ariaLabel ? undefined : true
}
