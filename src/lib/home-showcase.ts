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
export const HOME_SHOWCASE_CANVAS_DARK = '#0E0E0D'
export const HOME_SHOWCASE_INK = '#0A0A0A'
export const HOME_SHOWCASE_INK_DARK = '#EDEDEA'
/** Slightly lifted from #7E7E79 so 11px caps clear WCAG AA on the dark canvas. */
export const HOME_SHOWCASE_MUTE_DARK = '#84847F'
export const HOME_SHOWCASE_LINE_DARK = '#262624'
export const HOME_SHOWCASE_TIME_ZONE = 'America/Denver'
export const HOME_SHOWCASE_ROLE = 'Design Engineer'
export const HOME_SHOWCASE_LOCATION = 'Lehi, Utah'

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

export function getShowcaseLinks(): ShowcaseLink[] {
  const socialHref = new Map(contactSocialLinks.map((link) => [link.label, link.href]))

  return [
    { external: false, href: '/cv', label: 'Resume' },
    { external: true, href: siteMailtoHref, label: 'Email' },
    { external: true, href: socialHref.get('LinkedIn') ?? '', label: 'LinkedIn' },
    { external: true, href: socialHref.get('GitHub') ?? '', label: 'GitHub' },
  ].filter((link) => link.href.length > 0)
}
