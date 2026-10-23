import type { DeviceKind } from './media-crops.ts'

/**
 * Bezel, chin, and radius are fractions of the shell width.
 * Top and side insets match, so the rim is even. A laptop chin is taller than the
 * side bezel, which is what makes the wide shell a laptop rather than a tablet.
 * Inner corner radius is the outer radius minus the side bezel.
 */
export const DEVICE_FRAME = {
  iphone: { bezel: 0.03, chin: 0.03, radius: 0.148 },
  ipad: { bezel: 0.015, chin: 0.015, radius: 0.03 },
  laptop: { bezel: 0.011, chin: 0.022, radius: 0.018 },
} as const

/** Outer shell width / height. The screen keeps its own aspect inside the bezel. */
export function deviceShellAspect(kind: DeviceKind, screenAspect: number) {
  const frame = DEVICE_FRAME[kind]
  return 1 / (frame.bezel + frame.chin + (1 - 2 * frame.bezel) / screenAspect)
}

/** Screen corner radius as a fraction of the screen width. */
export function deviceInnerRadius(kind: DeviceKind) {
  const frame = DEVICE_FRAME[kind]
  return Math.max(0, (frame.radius - frame.bezel) / (1 - 2 * frame.bezel))
}

export function deviceFrameVars(kind: DeviceKind, screenAspect: number) {
  const frame = DEVICE_FRAME[kind]
  return {
    '--device-aspect': deviceShellAspect(kind, screenAspect),
    '--screen-aspect': screenAspect,
    '--bezel': frame.bezel,
    '--chin': frame.chin,
    '--radius': frame.radius,
    '--inner-radius': deviceInnerRadius(kind),
  }
}
