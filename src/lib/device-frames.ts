import type { DeviceKind } from './media-crops.ts'

/**
 * Fractions of the shell width.
 * Phones and iPads are an even silver rim. A laptop lid is a thin dark bezel
 * with a taller top (camera) and a wider aluminum lip underneath.
 * Inner screen radius is the outer radius minus the side bezel.
 */
export const DEVICE_FRAME = {
  iphone: { bezel: 0.024, top: 0.024, chin: 0.024, radius: 0.125, lip: 0, base: 0 },
  ipad: { bezel: 0.014, top: 0.014, chin: 0.014, radius: 0.028, lip: 0, base: 0 },
  laptop: { bezel: 0.011, top: 0.02, chin: 0.01, radius: 0.016, lip: 0.02, base: 0.038 },
} as const

/** Outer shell width / height. The screen keeps its own aspect inside the bezel. */
export function deviceShellAspect(kind: DeviceKind, screenAspect: number) {
  const frame = DEVICE_FRAME[kind]
  const screenW = 1 - 2 * (frame.lip + frame.bezel)
  const screenH = screenW / screenAspect
  return 1 / (frame.top + screenH + frame.chin + frame.base)
}

/** Screen corner radius as a fraction of the screen width. */
export function deviceInnerRadius(kind: DeviceKind) {
  const frame = DEVICE_FRAME[kind]
  const screenW = 1 - 2 * (frame.lip + frame.bezel)
  return Math.max(0, (frame.radius - frame.bezel) / screenW)
}

export function deviceFrameVars(kind: DeviceKind, screenAspect: number) {
  const frame = DEVICE_FRAME[kind]
  const shell = deviceShellAspect(kind, screenAspect)
  const lidH = 1 / shell - frame.base
  return {
    '--device-aspect': shell,
    '--screen-aspect': screenAspect,
    '--bezel': frame.bezel,
    '--top': frame.top,
    '--chin': frame.chin,
    '--lip': frame.lip,
    '--base': frame.base,
    '--radius': frame.radius,
    '--inner-radius': deviceInnerRadius(kind),
    '--lid-height': lidH,
  }
}
