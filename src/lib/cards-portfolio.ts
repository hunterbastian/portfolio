import { creatingLinks } from '../content/homepage.ts'
import { studioWork } from '../content/studio-work.ts'
import { HOME_GRID_PIECES, type HomeGridCategory, type HomeGridPiece } from './home-grid.ts'
import {
  HOME_SHOWCASE_SLUGS,
  getShowcaseBioParts,
  getShowcaseEndeavors,
  getShowcaseLinks,
  type ShowcaseLink,
} from './home-showcase.ts'

/** Tuned Cards dark palette. Canvas stays a dark grey, never pure black. */
export const CARDS_CANVAS = '#0E0E0D'
export const CARDS_INK = '#EDEBE6'
export const CARDS_MUTED = '#8F8D88'

export interface PortfolioProjectSource {
  slug: string
  frontmatter: {
    category: string
    title: string
  }
}

export interface PortfolioProjectCard {
  category: string
  external: boolean
  href: string | null
  id: string
  imageSrc: string
  title: string
  year: string
}

const GRID_CATEGORY_LABEL: Record<HomeGridCategory, string> = {
  apps: 'Product',
  experiments: 'Experiment',
  graphic: 'Graphic',
  illustration: 'Illustration',
  web: 'Web',
}

/** Pieces that belong to one project even when the gallery stored them separately. */
const GROUP_BY_PIECE_ID: Record<string, string> = {
  'iceland-graphics': 'iceland',
  'iceland-logo': 'iceland',
  'playground-mountain': 'mountain',
  'studio-alpine-camera': 'studio-alpine',
  'studio-alpine-logo': 'studio-alpine',
}

const GROUP_TITLE: Record<string, string> = {
  iceland: 'Iceland',
  'studio-alpine': 'Studio Alpine',
}

const GROUP_SLUG: Record<string, string> = {
  iceland: 'iceland-logo',
  mountain: 'mountain',
}

const COVER_ID: Record<string, string> = {
  iceland: 'iceland-logo',
  mountain: 'mountain',
  'studio-alpine': 'studio-alpine-logo',
}

export function encodePublicSrc(src: string) {
  return src
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

function groupKey(piece: HomeGridPiece) {
  if (piece.projectSlug) return piece.projectSlug
  return GROUP_BY_PIECE_ID[piece.id] ?? piece.id
}

function isMark(piece: HomeGridPiece) {
  return piece.width === piece.height && piece.width <= 1024
}

function coverScore(piece: HomeGridPiece, key: string) {
  if (piece.id === (COVER_ID[key] ?? key)) return 1_000_000_000
  if (isMark(piece)) return piece.width
  return piece.width * piece.height
}

function pickCover(pieces: readonly HomeGridPiece[], key: string) {
  return [...pieces].sort((a, b) => coverScore(b, key) - coverScore(a, key) || a.id.localeCompare(b.id))[0]
}

function externalHref(key: string) {
  if (key === 'alcove') return creatingLinks.find((link) => link.label === 'Alcove')?.href ?? null
  if (key === 'studio-alpine') return creatingLinks.find((link) => link.label === 'Studio Alpine')?.href ?? null

  const studioCala = studioWork['Studio Cala'] ?? []
  if (key === 'alder') return studioCala.find((item) => item.title === 'Alder')?.href ?? null
  if (key === 'form') return studioCala.find((item) => item.title === 'Form')?.href ?? null
  return null
}

function categoryFor(
  key: string,
  cover: HomeGridPiece,
  projects: ReadonlyMap<string, PortfolioProjectSource>,
) {
  const studioCala = studioWork['Studio Cala'] ?? []
  if (key === 'alder') return studioCala.find((item) => item.title === 'Alder')?.type ?? GRID_CATEGORY_LABEL[cover.category]
  if (key === 'form') return studioCala.find((item) => item.title === 'Form')?.type ?? GRID_CATEGORY_LABEL[cover.category]

  const slug = GROUP_SLUG[key] ?? (projects.has(key) ? key : null)
  const project = slug ? projects.get(slug) : undefined
  return project?.frontmatter.category ?? GRID_CATEGORY_LABEL[cover.category]
}

/**
 * Collapse the homepage carousel and the larger gallery into one card per project.
 * Related frames (Middle-Earth sketches, RAIN stills, Iceland logo and graphics)
 * stay on that project instead of becoming their own rows.
 */
export function groupPortfolioProjects(
  pieces: readonly HomeGridPiece[],
  projects: readonly PortfolioProjectSource[],
): PortfolioProjectCard[] {
  const bySlug = new Map(projects.map((project) => [project.slug, project]))
  const groups = new Map<string, HomeGridPiece[]>()

  for (const piece of pieces) {
    const key = groupKey(piece)
    const list = groups.get(key)
    if (list) list.push(piece)
    else groups.set(key, [piece])
  }

  const showcaseOrder = new Map<string, number>(HOME_SHOWCASE_SLUGS.map((slug, index) => [slug, index]))
  const cards: PortfolioProjectCard[] = []

  for (const [key, group] of groups) {
    const cover = pickCover(group, key)
    if (!cover) continue

    const slug = GROUP_SLUG[key] ?? (bySlug.has(key) ? key : null)
    const project = slug ? bySlug.get(slug) : undefined
    const external = externalHref(key)

    cards.push({
      category: categoryFor(key, cover, bySlug),
      external: Boolean(external),
      href: external ?? (slug && bySlug.has(slug) ? `/projects/${slug}` : null),
      id: key,
      imageSrc: encodePublicSrc(cover.src),
      title: GROUP_TITLE[key] ?? project?.frontmatter.title ?? cover.title,
      year: cover.year,
    })
  }

  cards.sort((a, b) => {
    const aOrder = showcaseOrder.get(a.id) ?? Number.POSITIVE_INFINITY
    const bOrder = showcaseOrder.get(b.id) ?? Number.POSITIVE_INFINITY
    if (aOrder !== bOrder) return aOrder - bOrder
    if (a.year !== b.year) return Number(b.year) - Number(a.year)
    return a.title.localeCompare(b.title)
  })

  return cards
}

export function getPortfolioProjectCards(projects: readonly PortfolioProjectSource[]) {
  return groupPortfolioProjects(HOME_GRID_PIECES, projects)
}

export function getCardsHomeLinks(): ShowcaseLink[] {
  return [
    { external: false, href: '/projects', label: 'Projects' },
    ...getShowcaseLinks(),
    ...getShowcaseEndeavors().map((item) => ({
      external: item.external,
      href: item.href,
      label: item.label,
    })),
  ]
}

export function getCardsHomeBio() {
  return getShowcaseBioParts()
}
