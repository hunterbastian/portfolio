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

/** iPhone 16 Pro glass, 2622×1206. */
export const IPHONE_SCREEN_ASPECT = 1206 / 2622

/** 13-inch iPad Pro landscape glass is 4:3. */
export const IPAD_SCREEN_ASPECT = 4 / 3

const IPHONE_BEZEL = 0.025
const IPAD_BEZEL = 0.016
const LAPTOP_SIDE = 0.018
/** Bottom chin, as a multiple of the side bezel. */
const LAPTOP_CHIN = 1.85

const FULL: ScreenCrop = { x: 0, y: 0, w: 1, h: 1 }

/**
 * UI inside the old 2400×1600 phone mockups.
 * The window sits 28px inside the baked glass so the black corner pixels stay outside the new shell.
 */
const SHOWCASE_PHONE_GLASS = { x: 920, y: 200, w: 560, h: 1202 }
const SHOWCASE_PHONE_WIDTH = 504
const SHOWCASE_PHONE_HEIGHT = SHOWCASE_PHONE_WIDTH / IPHONE_SCREEN_ASPECT
/** Drops the black pill baked into the old mockup so the new Dynamic Island is the only one. */
const SHOWCASE_PHONE_ISLAND_CLEARANCE = 18
const SHOWCASE_PHONE_CROP: ScreenCrop = {
  x: (SHOWCASE_PHONE_GLASS.x + (SHOWCASE_PHONE_GLASS.w - SHOWCASE_PHONE_WIDTH) / 2) / 2400,
  y:
    (SHOWCASE_PHONE_GLASS.y +
      (SHOWCASE_PHONE_GLASS.h - SHOWCASE_PHONE_HEIGHT) / 2 +
      SHOWCASE_PHONE_ISLAND_CLEARANCE) /
    1600,
  w: SHOWCASE_PHONE_WIDTH / 2400,
  h: SHOWCASE_PHONE_HEIGHT / 1600,
}

/** Shared laptop mockup used by the two desktop website slides. */
const SHOWCASE_LAPTOP_CROP: ScreenCrop = {
  x: 286 / 2400,
  y: 188 / 1600,
  w: 1822 / 2400,
  h: 1224 / 1600,
}

const SHOWCASE_LAPTOP_ASPECT = 1822 / 1224

/**
 * Nutricost product spread, not the white card around it.
 * The colored header and bottles already sit at 4:3.
 */
const SHOWCASE_IPAD_CROP: ScreenCrop = {
  x: 640 / 2400,
  y: 322 / 1600,
  w: 1120 / 2400,
  h: 840 / 1600,
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
    y: 76 / 800,
    w: 298 / 1200,
    h: (298 / IPHONE_SCREEN_ASPECT) / 800,
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

/**
 * `sizes` for the image element inside a frame.
 * A fill crop is drawn at `1 / crop.w` of the glass, so the request has to match that element, not the visible slot.
 * Cover frames keep the glass size.
 */
export function deviceImageSizes(spec: DeviceFrameSpec, presentation: 'inline' | 'enlarged' = 'inline') {
  const bezel = spec.kind === 'laptop' ? LAPTOP_SIDE : spec.kind === 'iphone' ? IPHONE_BEZEL : IPAD_BEZEL
  const zoom = spec.fit === 'cover' ? 1 : 1 / spec.crop.w
  const factor = Number(((1 - 2 * bezel) * zoom).toFixed(3))
  const slot = presentation === 'enlarged'
    ? spec.kind === 'iphone' ? 'min(420px, 78vw)' : 'min(960px, 92vw)'
    : spec.kind === 'iphone' ? 'min(232px, 68vw)' : 'min(520px, 100vw)'
  return `calc(${slot} * ${factor})`
}

/** `sizes` for a homepage slide. The value is the CSS width of the zoomed image, so a 2× screen can select the full source. */
export function showcaseImageSizes(spec: DeviceFrameSpec) {
  const bezel = spec.kind === 'laptop' ? LAPTOP_SIDE : spec.kind === 'iphone' ? IPHONE_BEZEL : IPAD_BEZEL
  const zoom = spec.fit === 'cover' ? 1 : 1 / spec.crop.w
  const factor = Number(((1 - 2 * bezel) * zoom).toFixed(3))
  if (spec.kind === 'iphone') {
    return `(max-width: 820px) calc(min(46vw, 160px) * ${factor}), calc(min(24vw, 290px) * ${factor})`
  }
  return `(max-width: 820px) calc(min(78vw, 460px) * ${factor}), calc(min(50vw, 700px) * ${factor})`
}

export function listShowcaseDeviceSlugs() {
  return Object.keys(SHOWCASE_DEVICES)
}
