/** Tab destination inside a modal. Null lets the browser move between the controls. */
export function nextDialogTabIndex(
  current: number,
  count: number,
  shiftKey: boolean,
  inside: boolean,
): number | null {
  if (count <= 0) return null
  if (!inside || current < 0) return shiftKey ? count - 1 : 0
  if (shiftKey) return current === 0 ? count - 1 : null
  return current === count - 1 ? 0 : null
}
