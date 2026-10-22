import type { DeviceKind } from './media-crops.ts'

const IPHONE_BEZEL = 0.026
const IPAD_BEZEL = 0.02
const LAPTOP_SIDE = 0.016
/** Bottom chin, as a multiple of the side bezel. */
const LAPTOP_CHIN = 2.35

/** Outer shell width / height. The screen keeps its own aspect inside the bezel. */
export function deviceShellAspect(kind: DeviceKind, screenAspect: number) {
  if (kind === 'laptop') {
    const side = LAPTOP_SIDE
    return 1 / ((1 - 2 * side) / screenAspect + side * (1 + LAPTOP_CHIN))
  }

  const bezel = kind === 'iphone' ? IPHONE_BEZEL : IPAD_BEZEL
  return 1 / ((1 - 2 * bezel) / screenAspect + 2 * bezel)
}
