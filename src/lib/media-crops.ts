export interface ScreenCrop {
  x: number
  y: number
  w: number
  h: number
}

export interface MediaCrop {
  /** Window of the source, as fractions of its width and height. */
  crop: ScreenCrop
  /** Visible width / height. The picture keeps this shape, so a phone shot is not stretched. */
  aspect: number
  shape: 'phone' | 'wide'
  /**
   * `fill` maps the crop window onto the picture.
   * `cover` scales the whole source and crops the overflow.
   */
  fit?: 'fill' | 'cover'
}

/** Tall phone UI, about 19.5:9. */
const PHONE_ASPECT = 1206 / 2622

const FULL: ScreenCrop = { x: 0, y: 0, w: 1, h: 1 }

/**
 * UI inside the old 2400×1600 phone mockups.
 * The window sits inside the baked glass, below its black pill, so the bare shot has no chrome and no bars.
 */
const SHOWCASE_PHONE_GLASS = { x: 920, y: 200, w: 560, h: 1202 }
const SHOWCASE_PHONE_WIDTH = 504
const SHOWCASE_PHONE_HEIGHT = SHOWCASE_PHONE_WIDTH / PHONE_ASPECT
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

/** Screen inside the shared desktop mockup. */
const SHOWCASE_WIDE_CROP: ScreenCrop = {
  x: 286 / 2400,
  y: 188 / 1600,
  w: 1822 / 2400,
  h: 1224 / 1600,
}

const SHOWCASE_WIDE_ASPECT = 1822 / 1224

/** Nutricost product spread. The colored header and bottles already sit at 4:3. */
const NUTRICOST_CROP: ScreenCrop = {
  x: 640 / 2400,
  y: 322 / 1600,
  w: 1120 / 2400,
  h: 840 / 1600,
}

const SHOWCASE_PHONE: MediaCrop = {
  crop: SHOWCASE_PHONE_CROP,
  aspect: PHONE_ASPECT,
  shape: 'phone',
}

const SHOWCASE_WIDE: MediaCrop = {
  crop: SHOWCASE_WIDE_CROP,
  aspect: SHOWCASE_WIDE_ASPECT,
  shape: 'wide',
}

const NUTRICOST: MediaCrop = {
  crop: NUTRICOST_CROP,
  aspect: 4 / 3,
  shape: 'wide',
}

const RAIN: MediaCrop = {
  crop: FULL,
  aspect: 1920 / 940,
  shape: 'wide',
}

const LUMO_PROJECT: MediaCrop = {
  crop: {
    x: 451 / 1200,
    y: 76 / 800,
    w: 298 / 1200,
    h: (298 / PHONE_ASPECT) / 800,
  },
  aspect: PHONE_ASPECT,
  shape: 'phone',
}

const PORSCHE_STILL: MediaCrop = {
  crop: {
    x: 1490 / 3840,
    y: 450 / 2560,
    w: 722 / 3840,
    h: (722 / PHONE_ASPECT) / 2560,
  },
  aspect: PHONE_ASPECT,
  shape: 'phone',
}

const PORSCHE_SCREEN_VIDEO: MediaCrop = {
  crop: FULL,
  aspect: 426 / 916,
  shape: 'phone',
  fit: 'cover',
}

const RAIN_PHONE: MediaCrop = {
  crop: FULL,
  aspect: PHONE_ASPECT,
  shape: 'phone',
  fit: 'cover',
}

const SHOWCASE_CROPS: Record<string, MediaCrop> = {
  rain: RAIN,
  'mentalhealth-minisite': SHOWCASE_WIDE,
  lumo: SHOWCASE_PHONE,
  'middle-earth-journey': SHOWCASE_WIDE,
  'wander-utah': SHOWCASE_PHONE,
  'porsche-app': SHOWCASE_PHONE,
  'aol-redesign': SHOWCASE_PHONE,
  nutricost: NUTRICOST,
}

const MEDIA_CROPS: Record<string, MediaCrop> = {
  '/showcase/rain.webp': RAIN,
  '/images/optimized/projects/lumo.webp': LUMO_PROJECT,
  '/images/projects/porscheapp.webp': PORSCHE_STILL,
  '/images/optimized/projects/porscheapp.webp': PORSCHE_STILL,
  '/images/projects/porscheapp-screen.mp4': PORSCHE_SCREEN_VIDEO,
  '/images/optimized/projects/rain/phone-play.webp': RAIN_PHONE,
}

function zoomFactor(spec: MediaCrop) {
  const zoom = spec.fit === 'cover' ? 1 : 1 / spec.crop.w
  return Number(zoom.toFixed(3))
}

export function getShowcaseCrop(slug: string) {
  const spec = SHOWCASE_CROPS[slug]
  if (!spec) {
    throw new Error(`Showcase slide "${slug}" has no crop`)
  }
  return spec
}

export function getMediaCrop(src: string | undefined | null) {
  if (!src) return null
  return MEDIA_CROPS[src] ?? null
}

/**
 * `sizes` for the image element inside a crop.
 * A fill crop is drawn at `1 / crop.w` of the visible picture, so the request has to match that element.
 */
export function mediaImageSizes(spec: MediaCrop, presentation: 'inline' | 'enlarged' = 'inline') {
  const factor = zoomFactor(spec)
  const slot = presentation === 'enlarged'
    ? spec.shape === 'phone' ? 'min(420px, 78vw)' : 'min(960px, 92vw)'
    : spec.shape === 'phone' ? 'min(232px, 68vw)' : 'min(520px, 100vw)'
  return `calc(${slot} * ${factor})`
}

/** `sizes` for a homepage slide. The value is the CSS width of the zoomed image. */
export function showcaseImageSizes(spec: MediaCrop) {
  const factor = zoomFactor(spec)
  if (spec.shape === 'phone') {
    return `(max-width: 820px) calc(min(34vw, 140px) * ${factor}), calc(min(18vw, 260px) * ${factor})`
  }
  return `(max-width: 820px) calc(min(74vw, 340px) * ${factor}), calc(min(48vw, 720px) * ${factor})`
}

export function listShowcaseCropSlugs() {
  return Object.keys(SHOWCASE_CROPS)
}
