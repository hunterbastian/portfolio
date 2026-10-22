/** Constant marquee speeds. A longer row wraps later; it does not move faster. */
export const DESKTOP_MARQUEE_PX_PER_SECOND = 12
export const MOBILE_MARQUEE_PX_PER_SECOND = 10

/** Hover keeps the row moving, just slower. 30% sits inside the 25–35% range. */
export const HOVER_SPEED_SCALE = 0.3
export const HOVER_EASE_SECONDS = 0.4

/** Ignore the mouse event a phone synthesizes immediately after a tap. */
export const TOUCH_HOVER_SUPPRESS_MS = 750

const MAX_FRAME_SECONDS = 0.05

/** Pixels to subtract from the track offset this frame. Independent of set width. */
export function marqueeFrameDelta(pxPerSecond: number, dtSeconds: number) {
  if (!(pxPerSecond > 0) || !(dtSeconds > 0)) return 0
  return pxPerSecond * Math.min(dtSeconds, MAX_FRAME_SECONDS)
}

function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

/** Glide from one speed to another. Reaches the target in about 400ms. */
export function marqueeEasedSpeed(from: number, to: number, elapsedSeconds: number, durationSeconds = HOVER_EASE_SECONDS) {
  if (!(durationSeconds > 0)) return to
  return from + (to - from) * smoothstep(elapsedSeconds / durationSeconds)
}

/**
 * A mouse or pen hover counts even when the primary pointer is a touchscreen.
 * The mouse event that follows a tap does not.
 */
export function acceptsHoverPointer(pointerType: string, msSinceTouch: number) {
  if (pointerType !== 'mouse' && pointerType !== 'pen') return false
  return !(msSinceTouch >= 0 && msSinceTouch < TOUCH_HOVER_SUPPRESS_MS)
}

/** Keep a centered label inside the frame. `center` and the result are the label's midpoint. */
export function clampTagCenter(center: number, tagWidth: number, frameWidth: number, margin = 8) {
  if (!(tagWidth > 0) || !(frameWidth > 0)) return center
  const half = tagWidth / 2
  if (tagWidth + margin * 2 >= frameWidth) return frameWidth / 2
  return Math.min(frameWidth - margin - half, Math.max(margin + half, center))
}
