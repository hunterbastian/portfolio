/** Constant marquee speeds. A longer row wraps later; it does not move faster. */
export const DESKTOP_MARQUEE_PX_PER_SECOND = 12
export const MOBILE_MARQUEE_PX_PER_SECOND = 10

/** Hover keeps the row moving, just slower. 30% sits inside the 25–35% range. */
export const HOVER_SPEED_SCALE = 0.3
export const HOVER_EASE_SECONDS = 0.4

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
