import type { Project } from '@/types/project'
import { formatYearFromDate } from './date.ts'

/** Hand-picked lead order for the archive grid; anything unlisted falls back to newest-first. */
export const PLAYGROUND_DISPLAY_ORDER = [
  'path',
  'sky-farm',
  'constellation',
  'little-lands',
  'obsidian-vault',
  'grand-teton-wallet',
  'mountain',
  'sunset-graphic',
  'iceland-graphics',
  'iceland-logo',
] as const

export const PLAYGROUND_EMPTY_COPY = 'No archived projects yet.'
export const PLAYGROUND_GALLERY_LABEL = 'Playground gallery'
export const PLAYGROUND_GALLERY_TITLE = 'Playground'
export const PLAYGROUND_GALLERY_TILE_VARIANTS = [
  'portrait',
  'feature',
  'browser',
  'document',
  'phone',
  'stack',
  'address',
  'print',
] as const
export const PLAYGROUND_PRIORITY_IMAGE_COUNT = 4

export type PlaygroundGalleryTileVariant = (typeof PLAYGROUND_GALLERY_TILE_VARIANTS)[number]

export interface PlaygroundGalleryTileState {
  index: number
  priorityImage: boolean
  project: Project
  title: string
  variant: PlaygroundGalleryTileVariant
  year: string
}

export function shouldPrioritizePlaygroundImage(index: number): boolean {
  return index < PLAYGROUND_PRIORITY_IMAGE_COUNT
}

export function getPlaygroundGalleryTileVariant(index: number): PlaygroundGalleryTileVariant {
  return PLAYGROUND_GALLERY_TILE_VARIANTS[index % PLAYGROUND_GALLERY_TILE_VARIANTS.length]
}

/** The gallery is the full archive, so tile variants cycle rather than capping the list. */
export function getPlaygroundGalleryTileStates(projects: readonly Project[]): PlaygroundGalleryTileState[] {
  return projects.map((project, index) => ({
    index,
    priorityImage: shouldPrioritizePlaygroundImage(index),
    project,
    title: project.frontmatter.displayTitle ?? project.frontmatter.title,
    variant: getPlaygroundGalleryTileVariant(index),
    year: formatYearFromDate(project.frontmatter.date),
  }))
}

export function sortProjectsForPlayground(
  projects: Project[],
  preferredOrder: readonly string[] = PLAYGROUND_DISPLAY_ORDER,
): Project[] {
  const rank = new Map<string, number>(preferredOrder.map((slug, index) => [slug, index]))

  return [...projects].sort((a, b) => {
    const aRank = rank.get(a.slug) ?? Number.MAX_SAFE_INTEGER
    const bRank = rank.get(b.slug) ?? Number.MAX_SAFE_INTEGER

    if (aRank !== bRank) {
      return aRank - bRank
    }

    return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  })
}
