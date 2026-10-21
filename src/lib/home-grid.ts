import { HOME_SHOWCASE_SLUGS, getShowcaseHash, getShowcaseIndexFromHash } from './home-showcase.ts'

export type HomeWorkView = 'grid' | 'showcase'
export type HomeGridCategory = 'apps' | 'web' | 'experiments' | 'graphic'
export type HomeGridFilter = 'all' | HomeGridCategory

export interface HomeGridPiece {
  id: string
  title: string
  year: string
  category: HomeGridCategory
  src: string
  width: number
  height: number
  videoSrc?: string
  /** Set only when the piece belongs to a homepage carousel project. */
  projectSlug?: (typeof HOME_SHOWCASE_SLUGS)[number]
}

export const HOME_GRID_FILTERS = ['all', 'apps', 'web', 'experiments', 'graphic'] as const satisfies readonly HomeGridFilter[]

const carouselSlug = new Set<string>(HOME_SHOWCASE_SLUGS)

function piece(input: HomeGridPiece): HomeGridPiece {
  if (input.projectSlug && !carouselSlug.has(input.projectSlug)) {
    throw new Error(`Grid piece "${input.id}" is linked to a project outside the homepage carousel`)
  }
  return input
}

/** Real files already in the repo. Dimensions match the encoded assets. */
export const HOME_GRID_PIECES: readonly HomeGridPiece[] = [
  piece({
    id: 'mentalhealth-minisite',
    title: 'Mental Health Mini Site',
    year: '2026',
    category: 'web',
    src: '/showcase/mentalhealth-minisite.webp',
    width: 2400,
    height: 1600,
    videoSrc: '/showcase/mentalhealth-minisite-loop.mp4',
    projectSlug: 'mentalhealth-minisite',
  }),
  piece({
    id: 'lumo-orb',
    title: 'Lumo orb',
    year: '2026',
    category: 'apps',
    src: '/images/optimized/projects/lumo-orb-icon.png',
    width: 1024,
    height: 1024,
    projectSlug: 'lumo',
  }),
  piece({
    id: 'alpine-01',
    title: 'Alpine 01',
    year: '2026',
    category: 'graphic',
    src: '/images/projects/alpine-01.jpeg',
    width: 1024,
    height: 1536,
  }),
  piece({
    id: 'wander-utah',
    title: 'WanderUtah',
    year: '2025',
    category: 'apps',
    src: '/showcase/wander-utah.webp',
    width: 2400,
    height: 1600,
    projectSlug: 'wander-utah',
  }),
  piece({
    id: 'sunset-graphic',
    title: 'Sunset Graphic',
    year: '2023',
    category: 'graphic',
    src: '/images/optimized/projects/sunset-graphic.webp',
    width: 752,
    height: 321,
  }),
  piece({
    id: 'middle-earth-journey',
    title: 'Middle-Earth Journey',
    year: '2025',
    category: 'web',
    src: '/showcase/middle-earth-journey.webp',
    width: 2400,
    height: 1600,
    videoSrc: '/showcase/middle-earth-journey-loop.mp4',
    projectSlug: 'middle-earth-journey',
  }),
  piece({
    id: 'alcove',
    title: 'Alcove',
    year: '2026',
    category: 'graphic',
    src: '/images/optimized/endeavors/freelance-coffee-icon.png',
    width: 1024,
    height: 1024,
  }),
  piece({
    id: 'iceland-logo',
    title: 'Iceland Logo',
    year: '2024',
    category: 'graphic',
    src: '/images/optimized/projects/Iceland Logo.webp',
    width: 1162,
    height: 430,
  }),
  piece({
    id: 'porsche-app',
    title: 'Porsche Boutique',
    year: '2025',
    category: 'apps',
    src: '/showcase/porsche-app.webp',
    width: 2400,
    height: 1600,
    videoSrc: '/showcase/porsche-app-loop.mp4',
    projectSlug: 'porsche-app',
  }),
  piece({
    id: 'obsidian-vault',
    title: 'My Obsidian Vault',
    year: '2026',
    category: 'experiments',
    src: '/images/optimized/projects/obsidian-vault-graph.webp',
    width: 1118,
    height: 1024,
  }),
  piece({
    id: 'sky-farm',
    title: 'Sky Farm',
    year: '2026',
    category: 'experiments',
    src: '/images/optimized/projects/sky-farm.webp',
    width: 1539,
    height: 826,
  }),
  piece({
    id: 'nutricost',
    title: 'Nutricost',
    year: '2025',
    category: 'graphic',
    src: '/showcase/nutricost.webp',
    width: 2400,
    height: 1600,
    videoSrc: '/showcase/nutricost-loop.mp4',
    projectSlug: 'nutricost',
  }),
  piece({
    id: 'middle-earth-sketches',
    title: 'Middle-Earth sketches',
    year: '2025',
    category: 'web',
    src: '/images/optimized/projects/middle-earth/Sketches.webp',
    width: 1520,
    height: 1114,
    projectSlug: 'middle-earth-journey',
  }),
  piece({
    id: 'studio-alpine-camera',
    title: 'Studio Alpine',
    year: '2026',
    category: 'graphic',
    src: '/images/optimized/endeavors/studio-alpine-camera-icon.png',
    width: 1024,
    height: 1024,
  }),
  piece({
    id: 'path',
    title: 'PATH',
    year: '2026',
    category: 'experiments',
    src: '/images/optimized/projects/path.webp',
    width: 1200,
    height: 860,
    videoSrc: '/images/projects/path-hover.mp4',
  }),
  piece({
    id: 'aol-redesign',
    title: 'AOL',
    year: '2025',
    category: 'apps',
    src: '/showcase/aol-redesign.webp',
    width: 2400,
    height: 1600,
    projectSlug: 'aol-redesign',
  }),
  piece({
    id: 'middle-earth-process',
    title: 'Middle-Earth process',
    year: '2025',
    category: 'web',
    src: '/images/projects/middle-earth/thought process.webp',
    width: 866,
    height: 554,
    projectSlug: 'middle-earth-journey',
  }),
  piece({
    id: 'grand-teton-wallet',
    title: 'Grand Teton Wallet',
    year: '2025',
    category: 'apps',
    src: '/images/optimized/projects/grand-teton-wallet-case-study.webp',
    width: 1200,
    height: 1098,
  }),
  piece({
    id: 'constellation',
    title: 'Constellation',
    year: '2026',
    category: 'web',
    src: '/images/optimized/projects/constellation.webp',
    width: 1200,
    height: 644,
  }),
  piece({
    id: 'porsche-icon',
    title: 'Porsche mark',
    year: '2025',
    category: 'apps',
    src: '/images/optimized/projects/porsche-boutique-icon.png',
    width: 1024,
    height: 1024,
    projectSlug: 'porsche-app',
  }),
  piece({
    id: 'middle-earth-moodboard',
    title: 'Middle-Earth moodboard',
    year: '2025',
    category: 'web',
    src: '/images/optimized/projects/middle-earth/Moodboard.webp',
    width: 1200,
    height: 879,
    projectSlug: 'middle-earth-journey',
  }),
  piece({
    id: 'alder',
    title: 'Alder',
    year: '2026',
    category: 'graphic',
    src: '/images/studio-work/alder.webp',
    width: 1000,
    height: 687,
  }),
  piece({
    id: 'lumo',
    title: 'Lumo',
    year: '2026',
    category: 'apps',
    src: '/showcase/lumo.webp',
    width: 2400,
    height: 1600,
    projectSlug: 'lumo',
  }),
  piece({
    id: 'playground-mountain',
    title: 'Mountain study',
    year: '2024',
    category: 'experiments',
    src: '/images/optimized/projects/playground-mountain-icon.png',
    width: 1024,
    height: 1024,
  }),
  piece({
    id: 'middle-earth-map',
    title: 'Middle-Earth map',
    year: '2025',
    category: 'web',
    src: '/images/projects/middle-earth/interactive-map.webp',
    width: 2198,
    height: 1374,
    projectSlug: 'middle-earth-journey',
  }),
  piece({
    id: 'iceland-graphics',
    title: 'Iceland Graphics',
    year: '2023',
    category: 'graphic',
    src: '/images/optimized/projects/iceland-graphics.webp',
    width: 752,
    height: 583,
  }),
  piece({
    id: 'little-lands',
    title: 'Aethlands',
    year: '2026',
    category: 'web',
    src: '/images/optimized/projects/little-lands/aesthetic-lands.webp',
    width: 1710,
    height: 926,
  }),
  piece({
    id: 'wander-icon',
    title: 'WanderUtah mark',
    year: '2025',
    category: 'apps',
    src: '/images/optimized/projects/wander-utah-icon.png',
    width: 1024,
    height: 1024,
    projectSlug: 'wander-utah',
  }),
  piece({
    id: 'form',
    title: 'Form',
    year: '2026',
    category: 'graphic',
    src: '/images/studio-work/form.webp',
    width: 1000,
    height: 687,
  }),
  piece({
    id: 'mountain',
    title: 'Mountain',
    year: '2024',
    category: 'web',
    src: '/images/optimized/projects/mountain.webp',
    width: 1430,
    height: 942,
  }),
  piece({
    id: 'middle-earth-style',
    title: 'Middle-Earth style',
    year: '2025',
    category: 'web',
    src: '/images/optimized/projects/middle-earth/style.webp',
    width: 1167,
    height: 735,
    projectSlug: 'middle-earth-journey',
  }),
  piece({
    id: 'studio-alpine-logo',
    title: 'Studio Alpine logo',
    year: '2026',
    category: 'graphic',
    src: '/images/optimized/studio-alpine-logo.webp',
    width: 1920,
    height: 1920,
  }),
  piece({
    id: 'mental-health-icon',
    title: 'Mental Health mark',
    year: '2026',
    category: 'web',
    src: '/images/optimized/projects/mental-health-computer-icon.png',
    width: 1024,
    height: 1024,
    projectSlug: 'mentalhealth-minisite',
  }),
  piece({
    id: 'nutricost-detail',
    title: 'Nutricost detail',
    year: '2025',
    category: 'graphic',
    src: '/images/optimized/projects/nuticost-1.webp',
    width: 1200,
    height: 931,
    projectSlug: 'nutricost',
  }),
  piece({
    id: 'middle-earth-icon',
    title: 'Middle-Earth mark',
    year: '2025',
    category: 'web',
    src: '/images/optimized/projects/middle-earth/middle-earth-landscape-icon.png',
    width: 1024,
    height: 1024,
    projectSlug: 'middle-earth-journey',
  }),
]

export function getHomeGridFilters(pieces: readonly HomeGridPiece[] = HOME_GRID_PIECES): HomeGridFilter[] {
  const present = new Set(pieces.map((item) => item.category))
  return HOME_GRID_FILTERS.filter((filter) => filter === 'all' || present.has(filter))
}

export function getHomeGridPieces(filter: HomeGridFilter, pieces: readonly HomeGridPiece[] = HOME_GRID_PIECES) {
  if (filter === 'all') return pieces
  return pieces.filter((item) => item.category === filter)
}

export function getHomeGridProjectHref(item: Pick<HomeGridPiece, 'projectSlug'>) {
  return item.projectSlug ? `/projects/${item.projectSlug}` : null
}

export function stepHomeGridIndex(index: number, delta: number, count: number) {
  if (count < 1) return 0
  return (index + delta + count * 8) % count
}

export function isShowcaseProjectHash(hash: string, slugs: readonly string[] = HOME_SHOWCASE_SLUGS) {
  const trimmed = hash.trim()
  const numeric = /^#(\d+)$/.exec(trimmed)
  if (numeric) return Number(numeric[1]) >= 1

  const slug = trimmed.replace(/^#/, '').toLowerCase()
  return slug.length > 0 && slugs.includes(slug)
}

export function getHomeShowcaseIndex(hash: string, slugs: readonly string[] = HOME_SHOWCASE_SLUGS) {
  const trimmed = hash.trim()
  const numeric = /^#(\d+)$/.exec(trimmed)
  if (numeric && Number(numeric[1]) >= 1) {
    return getShowcaseIndexFromHash(trimmed, slugs.length)
  }

  const slug = trimmed.replace(/^#/, '').toLowerCase()
  const index = slugs.indexOf(slug)
  return index >= 0 ? index : 0
}

/** Grid is the landing view. A project hash or ?view=showcase opens the carousel. ?view=grid wins. */
export function resolveHomeWorkView(search: string, hash: string, slugs: readonly string[] = HOME_SHOWCASE_SLUGS): HomeWorkView {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const view = params.get('view')
  if (view === 'grid') return 'grid'
  if (view === 'showcase') return 'showcase'
  return isShowcaseProjectHash(hash, slugs) ? 'showcase' : 'grid'
}

export function buildShowcaseViewUrl(index: number) {
  return `?view=showcase${getShowcaseHash(index)}`
}
