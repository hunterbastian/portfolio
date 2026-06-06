export const HOVER_CUE_SELECTOR = [
  'a[href]',
  'button:not(:disabled)',
  'input:not(:disabled)',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  'summary',
  '[role="button"]:not([aria-disabled="true"])',
  '[role="link"]:not([aria-disabled="true"])',
  '[data-hover-sound="true"]',
].join(', ')

export const HOVER_CUE_SUPPRESS_SELECTOR = '[data-hover-sound="false"], [aria-disabled="true"]'
export const HOVER_CUE_MIN_INTERVAL_MS = 90

export function isHoverCuePointerType(pointerType: string | undefined) {
  return pointerType === undefined || pointerType === '' || pointerType === 'mouse'
}

export function getHoverCueTarget(target: EventTarget | null): Element | null {
  if (!(target instanceof Element)) return null

  const hoverTarget = target.closest(HOVER_CUE_SELECTOR)
  if (!hoverTarget) return null
  if (hoverTarget.closest(HOVER_CUE_SUPPRESS_SELECTOR)) return null

  return hoverTarget
}

export function shouldPlayHoverCue({
  lastPlayedAt,
  now,
  relatedTarget,
  target,
}: {
  lastPlayedAt: number
  now: number
  relatedTarget: Node | null
  target: Pick<Node, 'contains'>
}) {
  if (relatedTarget && target.contains(relatedTarget)) return false
  return now - lastPlayedAt >= HOVER_CUE_MIN_INTERVAL_MS
}
