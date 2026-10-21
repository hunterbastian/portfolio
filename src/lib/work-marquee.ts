/** Constant marquee speeds. A longer row wraps later; it does not move faster. */
export const DESKTOP_MARQUEE_PX_PER_SECOND = 12
export const MOBILE_MARQUEE_PX_PER_SECOND = 10

const MAX_FRAME_SECONDS = 0.05

/** Pixels to subtract from the track offset this frame. Independent of set width. */
export function marqueeFrameDelta(pxPerSecond: number, dtSeconds: number) {
  if (!(pxPerSecond > 0) || !(dtSeconds > 0)) return 0
  return pxPerSecond * Math.min(dtSeconds, MAX_FRAME_SECONDS)
}
