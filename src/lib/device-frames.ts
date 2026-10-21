export type DeviceKind = 'iphone' | 'ipad' | 'laptop'

export interface ScreenCrop {
  x: number
  y: number
  w: number
  h: number
}

export interface DeviceFrameSpec {
  kind: DeviceKind
  /** Window of the source media, as fractions of its width and height. */
  crop: ScreenCrop
  /** Screen width / height. The shell is built around this so the picture is not stretched. */
  aspect: number
  /**
   * `fill` maps the crop window onto the glass.
   * `cover` scales the whole source to the glass and crops the overflow.
   */
  fit?: 'fill' | 'cover'
}

/** iPhone 16 glass is 19.5:9. Showcase phones are cropped to this. */
export const IPHONE_SCREEN_ASPECT = 560 / 1202

/** 13-inch iPad Pro landscape glass is 4:3. */
export const IPAD_SCREEN_ASPECT = 4 / 3

const IPHONE_BEZEL = 0.026
const IPAD_BEZEL = 0.02
const LAPTOP_SIDE = 0.016
/** Bottom chin, as a multiple of the side bezel. */
const LAPTOP_CHIN = 2.35

const FULL: ScreenCrop = { x: 0, y: 0, w: 1, h: 1 }

/**
 * Glass inside the old 2400×1600 phone mockups.
 * Straight edges sit at x 920–1480 and y 200–1402; the shell radius clips the old corner.
 */
const SHOWCASE_PHONE_CROP: ScreenCrop = {
  x: 920 / 2400,
  y: 200 / 1600,
  w: 560 / 2400,
  h: 1202 / 1600,
}

/** Shared laptop mockup used by the two desktop website slides. */
const SHOWCASE_LAPTOP_CROP: ScreenCrop = {
  x: 286 / 2400,
  y: 188 / 1600,
  w: 1822 / 2400,
  h: 1224 / 1600,
}

const SHOWCASE_LAPTOP_ASPECT = 1822 / 1224

/** White product board inside the Nutricost still, trimmed to 4:3. */
const SHOWCASE_IPAD_CROP: ScreenCrop = {
  x: 420 / 2400,
  y: 216 / 1600,
  w: 1558 / 2400,
  h: (1558 / IPAD_SCREEN_ASPECT) / 1600,
}

const SHOWCASE_PHONE: DeviceFrameSpec = {
  kind: 'iphone',
  crop: SHOWCASE_PHONE_CROP,
  aspect: IPHONE_SCREEN_ASPECT,
}

const SHOWCASE_LAPTOP: DeviceFrameSpec = {
  kind: 'laptop',
  crop: SHOWCASE_LAPTOP_CROP,
  aspect: SHOWCASE_LAPTOP_ASPECT,
}

const SHOWCASE_IPAD: DeviceFrameSpec = {
  kind: 'ipad',
  crop: SHOWCASE_IPAD_CROP,
  aspect: IPAD_SCREEN_ASPECT,
}

/** RAIN's title still is a wide scene. A laptop screen keeps the whole frame, with no bars. */
const RAIN_LAPTOP: DeviceFrameSpec = {
  kind: 'laptop',
  crop: FULL,
  aspect: 1920 / 940,
}

const LUMO_PROJECT: DeviceFrameSpec = {
  kind: 'iphone',
  crop: {
    x: 451 / 1200,
    y: 80 / 800,
    w: 298 / 1200,
    h: 640 / 800,
  },
  aspect: IPHONE_SCREEN_ASPECT,
}

/**
 * Phone UI centered in the 3840×2560 Porsche still.
 * The window is 19.5:9, cut from the tall screenshot.
 */
const PORSCHE_STILL: DeviceFrameSpec = {
  kind: 'iphone',
  crop: {
    x: 1490 / 3840,
    y: 450 / 2560,
    w: 722 / 3840,
    h: (722 / IPHONE_SCREEN_ASPECT) / 2560,
  },
  aspect: IPHONE_SCREEN_ASPECT,
}

const PORSCHE_SCREEN_VIDEO: DeviceFrameSpec = {
  kind: 'iphone',
  crop: FULL,
  aspect: 426 / 916,
  fit: 'cover',
}

const RAIN_PHONE: DeviceFrameSpec = {
  kind: 'iphone',
  crop: FULL,
  aspect: IPHONE_SCREEN_ASPECT,
  fit: 'cover',
}

const SHOWCASE_DEVICES: Record<string, DeviceFrameSpec> = {
  rain: RAIN_LAPTOP,
  'mentalhealth-minisite': SHOWCASE_LAPTOP,
  lumo: SHOWCASE_PHONE,
  'middle-earth-journey': SHOWCASE_LAPTOP,
  'wander-utah': SHOWCASE_PHONE,
  'porsche-app': SHOWCASE_PHONE,
  'aol-redesign': SHOWCASE_PHONE,
  nutricost: SHOWCASE_IPAD,
}

const MEDIA_DEVICES: Record<string, DeviceFrameSpec> = {
  '/showcase/rain.webp': RAIN_LAPTOP,
  '/images/optimized/projects/lumo.webp': LUMO_PROJECT,
  '/images/projects/porscheapp.webp': PORSCHE_STILL,
  '/images/optimized/projects/porscheapp.webp': PORSCHE_STILL,
  '/images/projects/porscheapp-screen.mp4': PORSCHE_SCREEN_VIDEO,
  '/images/optimized/projects/rain/phone-play.webp': RAIN_PHONE,
}

export function deviceShellAspect(kind: DeviceKind, screenAspect: number) {
  if (kind === 'laptop') {
    const side = LAPTOP_SIDE
    return 1 / ((1 - 2 * side) / screenAspect + side * (1 + LAPTOP_CHIN))
  }

  const bezel = kind === 'iphone' ? IPHONE_BEZEL : IPAD_BEZEL
  return 1 / ((1 - 2 * bezel) / screenAspect + 2 * bezel)
}

export function getShowcaseDevice(slug: string) {
  const spec = SHOWCASE_DEVICES[slug]
  if (!spec) {
    throw new Error(`Showcase slide "${slug}" has no device frame`)
  }
  return spec
}

export function getDeviceFrameForSrc(src: string | undefined | null) {
  if (!src) return null
  return MEDIA_DEVICES[src] ?? null
}

export function listShowcaseDeviceSlugs() {
  return Object.keys(SHOWCASE_DEVICES)
}
