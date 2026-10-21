import type { Project } from '@/types/project'
import { contactSocialLinks, creatingLinks } from '../content/homepage.ts'
import { formatYearFromDate } from './date.ts'
import { siteConfig, siteMailtoHref } from './site.ts'

/** Homepage showcase order. Captions and years still come from each project's MDX. */
export const HOME_SHOWCASE_SLUGS = [
  'mentalhealth-minisite',
  'lumo',
  'middle-earth-journey',
  'wander-utah',
  'porsche-app',
  'aol-redesign',
  'nutricost',
] as const

export const HOME_SHOWCASE_CANVAS = '#F7F7F5'
export const HOME_SHOWCASE_CANVAS_DARK = '#232323'
export const HOME_SHOWCASE_RAISED_DARK = '#262626'
export const HOME_SHOWCASE_INK = '#0A0A0A'
export const HOME_SHOWCASE_INK_DARK = '#EDEDEA'
/** Secondary gray tuned for WCAG AA on #232323 and the #262626 raised surfaces. */
export const HOME_SHOWCASE_MUTE_DARK = '#A1A19C'
export const HOME_SHOWCASE_LINE_DARK = '#333333'
export const HOME_SHOWCASE_TIME_ZONE = 'America/Denver'
export const HOME_SHOWCASE_ROLE = 'Product Designer'
export const HOME_SHOWCASE_LOCATION = 'Lehi, Utah'
/** Persisted theme override. Absent means dark, including for first-time visitors. */
export const HOME_SHOWCASE_THEME_STORAGE_KEY = 'hb-showcase-theme'

export type ShowcaseTheme = 'light' | 'dark'
export type ShowcaseThemePreference = ShowcaseTheme | 'system'

const SHOWCASE_MEDIA_DIRECTORY = '/showcase'

const SHOWCASE_VIDEO_SLUGS = new Set<string>([
  'mentalhealth-minisite',
  'middle-earth-journey',
  'nutricost',
  'porsche-app',
])

/** Short labels used in the homepage caption. Nutricost's MDX category is "Graphic Design". */
const SHOWCASE_CATEGORY_LABELS: Record<string, string> = {
  'Graphic Design': 'Graphic',
}

const SHOWCASE_ENDEAVOR_META: Record<string, string> = {
  'Studio Alpine': 'Photography',
  'Studio Cala': 'Web studio',
  'Above / Utah': 'Hiking app',
  Alcove: 'Coffee guide',
  'parallax.': 'Model viewer',
}

export interface ShowcaseSlide {
  category: string
  darkImageSrc: string
  description: string
  href: string
  imageAlt: string
  imageSrc: string
  slug: string
  title: string
  videoSrc: string | null
  year: string
}

export interface ShowcaseChrome {
  canvas: string
  colorScheme: 'light' | 'dark'
  statusBar: 'default' | 'black'
}

export interface ShowcaseEndeavor {
  external: boolean
  href: string
  label: string
  meta: string
}

export interface ShowcaseLink {
  external: boolean
  href: string
  label: string
}

export function getShowcaseImageSrc(slug: string) {
  return `${SHOWCASE_MEDIA_DIRECTORY}/${slug}.webp`
}

export function getShowcaseDarkImageSrc(slug: string) {
  return `${SHOWCASE_MEDIA_DIRECTORY}/${slug}-transparent.webp`
}

export function getShowcaseChrome(prefersDark: boolean): ShowcaseChrome {
  if (prefersDark) {
    return {
      canvas: HOME_SHOWCASE_CANVAS_DARK,
      colorScheme: 'dark',
      statusBar: 'black',
    }
  }

  return {
    canvas: HOME_SHOWCASE_CANVAS,
    colorScheme: 'light',
    statusBar: 'default',
  }
}

export function parseShowcaseThemePreference(value: string | null | undefined): ShowcaseThemePreference {
  if (value === 'light' || value === 'dark') return value
  return 'system'
}

/** A saved light or dark choice wins. With no stored preference, dark is the default. */
export function resolveShowcaseTheme(preference: ShowcaseThemePreference, _prefersDark: boolean): ShowcaseTheme {
  if (preference === 'light' || preference === 'dark') return preference
  return 'dark'
}

export function getShowcaseVideoSrc(slug: string) {
  if (!SHOWCASE_VIDEO_SLUGS.has(slug)) return null
  return `${SHOWCASE_MEDIA_DIRECTORY}/${slug}-loop.mp4`
}

export function getShowcaseCategoryLabel(category: string) {
  return SHOWCASE_CATEGORY_LABELS[category] ?? category
}

export function buildShowcaseSlides(projects: readonly Pick<Project, 'frontmatter' | 'slug'>[]): ShowcaseSlide[] {
  const bySlug = new Map(projects.map((project) => [project.slug, project]))

  return HOME_SHOWCASE_SLUGS.map((slug) => {
    const project = bySlug.get(slug)
    if (!project) {
      throw new Error(`Homepage showcase is missing project "${slug}"`)
    }

    const { category, date, description, title } = project.frontmatter

    return {
      category: getShowcaseCategoryLabel(category),
      darkImageSrc: getShowcaseDarkImageSrc(slug),
      description,
      href: `/projects/${slug}`,
      imageAlt: '',
      imageSrc: getShowcaseImageSrc(slug),
      slug,
      title,
      videoSrc: getShowcaseVideoSrc(slug),
      year: formatYearFromDate(date),
    }
  })
}

export function getShowcaseCaption(index: number, count: number, slide: Pick<ShowcaseSlide, 'category' | 'title' | 'year'>) {
  return {
    lead: `${index + 1} of ${count} — ${slide.title}, ${slide.year}`,
    tag: slide.category,
  }
}

export function getShowcaseIndexFromHash(hash: string, count: number) {
  if (count < 1) return 0

  const match = /^#(\d+)$/.exec(hash.trim())
  if (!match) return 0

  const slideNumber = Number(match[1])
  if (!Number.isFinite(slideNumber) || slideNumber < 1) return 0

  return Math.min(slideNumber, count) - 1
}

export function getShowcaseHash(index: number) {
  return `#${index + 1}`
}

export const HOME_SHOWCASE_SLIDE_DRIFT_PX = 8
export const HOME_SHOWCASE_SLIDE_DURATION_MS = 250
export const HOME_SHOWCASE_SLIDE_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'

/** Forward travel exits left. Backward travel, including the wrap from the first slide, exits right. */
export function getShowcaseTravelDirection(current: number, next: number, count: number): 1 | -1 {
  if (current === count - 1 && next === 0) return 1
  if (current === 0 && next === count - 1) return -1
  return next >= current ? 1 : -1
}

/** The slide that is actually on screen should leave, even if an older fade is still running. */
export function pickShowcaseMotionSource(opacities: number[], nextIndex: number, previousIndex: number) {
  let source = previousIndex
  let best = opacities[previousIndex] ?? -1

  opacities.forEach((opacity, index) => {
    if (index === nextIndex) return
    if (opacity > best) {
      best = opacity
      source = index
    }
  })

  return source === nextIndex ? previousIndex : source
}

export interface ShowcaseSlideDeparture {
  index: number
  keyframes: Keyframe[]
}

export interface ShowcaseSlideMotionPlan {
  departures: ShowcaseSlideDeparture[]
  duration: number
  easing: string
  enter: Keyframe[]
  exit: Keyframe[]
  hidden: number[]
  nextIndex: number
  source: number
}

function showcaseDrift(px: number) {
  return `translate3d(${px}px, 0, 0)`
}

/**
 * Crossfade from the captured on-screen styles. A hidden incoming slide starts
 * one drift away; a slide that is already partly visible keeps its current
 * transform so a second click does not snap it back to the start. Other slides
 * that are still visible fade out from that captured frame instead of popping
 * to zero.
 */
export function planShowcaseSlideMotion(input: {
  direction: 1 | -1
  nextIndex: number
  opacities: number[]
  previousIndex: number
  reduced: boolean
  transforms: string[]
}): ShowcaseSlideMotionPlan | null {
  const source = pickShowcaseMotionSource(input.opacities, input.nextIndex, input.previousIndex)
  if (source === input.nextIndex) return null

  const drift = input.direction > 0 ? HOME_SHOWCASE_SLIDE_DRIFT_PX : -HOME_SHOWCASE_SLIDE_DRIFT_PX
  const enterOpacity = input.opacities[input.nextIndex] ?? 0
  const enterTransform = enterOpacity < 0.05
    ? showcaseDrift(drift)
    : input.transforms[input.nextIndex] || 'none'
  const departures: ShowcaseSlideDeparture[] = []
  const hidden: number[] = []

  input.opacities.forEach((opacity, index) => {
    if (index === source || index === input.nextIndex) return
    if (opacity < 0.05) {
      hidden.push(index)
      return
    }

    const transform = input.reduced ? 'none' : input.transforms[index] || 'none'
    departures.push({
      index,
      keyframes: [
        { opacity, transform },
        { opacity: 0, transform },
      ],
    })
  })

  if (input.reduced) {
    return {
      departures,
      duration: 0,
      easing: 'linear',
      enter: [
        { opacity: enterOpacity, transform: 'none' },
        { opacity: 1, transform: 'none' },
      ],
      exit: [
        { opacity: input.opacities[source] ?? 1, transform: 'none' },
        { opacity: 0, transform: 'none' },
      ],
      hidden,
      nextIndex: input.nextIndex,
      source,
    }
  }

  return {
    departures,
    duration: HOME_SHOWCASE_SLIDE_DURATION_MS,
    easing: HOME_SHOWCASE_SLIDE_EASING,
    enter: [
      { opacity: enterOpacity, transform: enterTransform },
      { opacity: 1, transform: showcaseDrift(0) },
    ],
    exit: [
      { opacity: input.opacities[source] ?? 1, transform: input.transforms[source] || 'none' },
      { opacity: 0, transform: showcaseDrift(-drift) },
    ],
    hidden,
    nextIndex: input.nextIndex,
    source,
  }
}

export function formatDenverClock(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    hourCycle: 'h23',
    minute: '2-digit',
    second: '2-digit',
    timeZone: HOME_SHOWCASE_TIME_ZONE,
    timeZoneName: 'short',
  }).formatToParts(date)

  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? ''

  return `${value('hour')}:${value('minute')}:${value('second')} ${value('timeZoneName')}`
}

export function getShowcaseBio() {
  return siteConfig.siteDescription
}

export function getShowcaseEndeavors(): ShowcaseEndeavor[] {
  return creatingLinks.flatMap((link) => {
    const meta = SHOWCASE_ENDEAVOR_META[link.label]
    if (!meta || !link.href) return []

    return [{
      external: link.external !== false,
      href: link.href,
      label: link.label,
      meta,
    }]
  })
}

export interface ShowcaseKeyboardInput {
  altKey?: boolean
  ctrlKey?: boolean
  key: string
  metaKey?: boolean
  shiftKey?: boolean
  target?: { isContentEditable?: boolean; tagName?: string } | null
}

export type ShowcaseKeyboardAction = 'next' | 'previous'

/** Left/Right move the homepage carousel. Typing targets and modifier keys do not. */
export function getShowcaseKeyboardAction(input: ShowcaseKeyboardInput): ShowcaseKeyboardAction | null {
  if (input.altKey || input.ctrlKey || input.metaKey || input.shiftKey) return null

  const tag = input.target?.tagName?.toUpperCase()
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || input.target?.isContentEditable) {
    return null
  }

  if (input.key === 'ArrowRight') return 'next'
  if (input.key === 'ArrowLeft') return 'previous'
  return null
}

export function getShowcaseLinks(): ShowcaseLink[] {
  const socialHref = new Map(contactSocialLinks.map((link) => [link.label, link.href]))

  return [
    { external: false, href: '/cv', label: 'Resume' },
    { external: true, href: siteMailtoHref, label: 'Email' },
    { external: true, href: socialHref.get('LinkedIn') ?? '', label: 'LinkedIn' },
    { external: true, href: socialHref.get('GitHub') ?? '', label: 'GitHub' },
  ].filter((link) => link.href.length > 0)
}
