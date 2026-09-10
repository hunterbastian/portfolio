import {
  formatProjectYear,
  getHomeProjectTitle,
  type HomeProject,
} from './home-projects.ts'

export type WorkStackTone = 'projects' | 'playground'
export type WorkStackAspect = 'portrait' | 'landscape' | 'square'

export interface WorkStackSlot {
  aspect: WorkStackAspect
  left: number
  rotate: number
  top: number
  width: number
  zIndex: number
}

export interface WorkStackCard {
  href: string
  image: string
  imageZoom?: number
  layout: WorkStackSlot
  slug: string
  title: string
  year: string
}

/**
 * The homepage playground is a teaser, not an index — the full set lives on /archive.
 * Keeping it small stops the two collages from swamping the rest of the page.
 */
export const HOME_PLAYGROUND_STACK_LIMIT = 4

export const WORK_STACK_ASPECT_RATIO: Record<WorkStackAspect, string> = {
  landscape: '5 / 4',
  portrait: '4 / 5',
  square: '1 / 1',
}

export const PROJECT_STACK_SLOTS: WorkStackSlot[] = [
  { left: 31, top: 14, width: 40, rotate: -7, zIndex: 8, aspect: 'portrait' },
  { left: 5, top: 4, width: 34, rotate: -16, zIndex: 4, aspect: 'landscape' },
  { left: 54, top: 2, width: 35, rotate: 13, zIndex: 6, aspect: 'square' },
  { left: 1, top: 40, width: 32, rotate: -5, zIndex: 5, aspect: 'portrait' },
  { left: 62, top: 38, width: 31, rotate: 17, zIndex: 7, aspect: 'landscape' },
  { left: 24, top: 50, width: 28, rotate: 8, zIndex: 3, aspect: 'square' },
  { left: 42, top: 44, width: 27, rotate: -11, zIndex: 9, aspect: 'portrait' },
  { left: 14, top: 26, width: 24, rotate: 4, zIndex: 2, aspect: 'landscape' },
]

export const PLAYGROUND_STACK_SLOTS: WorkStackSlot[] = [
  { left: 4, top: 14, width: 38, rotate: -11, zIndex: 4, aspect: 'portrait' },
  { left: 44, top: 6, width: 40, rotate: 9, zIndex: 3, aspect: 'landscape' },
  { left: 24, top: 44, width: 36, rotate: -5, zIndex: 5, aspect: 'square' },
  { left: 60, top: 36, width: 32, rotate: 14, zIndex: 2, aspect: 'portrait' },
]

export function getWorkStackSlots(tone: WorkStackTone): readonly WorkStackSlot[] {
  switch (tone) {
    case 'playground':
      return PLAYGROUND_STACK_SLOTS
    case 'projects':
      return PROJECT_STACK_SLOTS
    default: {
      const exhaustive: never = tone
      throw new Error(`Unhandled work stack tone: ${exhaustive}`)
    }
  }
}

export function getWorkStackCards(
  projects: readonly HomeProject[],
  tone: WorkStackTone,
): WorkStackCard[] {
  const slots = getWorkStackSlots(tone)
  const limit = tone === 'playground' ? HOME_PLAYGROUND_STACK_LIMIT : slots.length

  return projects.slice(0, Math.min(limit, slots.length)).map((project, index) => {
    const slot = slots[index]

    if (!slot) {
      throw new Error(`Missing work stack slot for ${tone} index ${index}`)
    }

    return {
      href: `/projects/${project.slug}`,
      image: project.frontmatter.image,
      imageZoom: project.frontmatter.imageZoom,
      layout: slot,
      slug: project.slug,
      title: getHomeProjectTitle(project),
      year: formatProjectYear(project.frontmatter.date),
    }
  })
}

/**
 * Scatter placement travels as custom properties so the mobile collage can lay the
 * same cards out as a column flow without fighting inline positioning.
 */
export function getWorkStackCardStyle(layout: WorkStackSlot) {
  return {
    '--card-left': `${layout.left}%`,
    '--card-top': `${layout.top}%`,
    '--card-width': `${layout.width}%`,
    '--card-z': layout.zIndex,
    '--card-ratio': WORK_STACK_ASPECT_RATIO[layout.aspect],
    '--stack-rotate': `${layout.rotate}deg`,
  } as const
}
