import {
  formatProjectYear,
  getHomeProjectThumbnailImage,
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
  layout: WorkStackSlot
  slug: string
  title: string
  year: string
}

export const HOME_PLAYGROUND_STACK_LIMIT = 9

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
  { left: 28, top: 12, width: 36, rotate: 9, zIndex: 8, aspect: 'square' },
  { left: 3, top: 8, width: 32, rotate: -19, zIndex: 5, aspect: 'portrait' },
  { left: 58, top: 6, width: 33, rotate: 15, zIndex: 6, aspect: 'landscape' },
  { left: 7, top: 44, width: 29, rotate: -8, zIndex: 4, aspect: 'landscape' },
  { left: 55, top: 42, width: 34, rotate: -14, zIndex: 7, aspect: 'portrait' },
  { left: 30, top: 50, width: 26, rotate: 11, zIndex: 9, aspect: 'square' },
  { left: 17, top: 22, width: 25, rotate: 6, zIndex: 3, aspect: 'portrait' },
  { left: 46, top: 26, width: 24, rotate: -4, zIndex: 2, aspect: 'landscape' },
  { left: 67, top: 22, width: 22, rotate: 21, zIndex: 1, aspect: 'square' },
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
      image: getHomeProjectThumbnailImage(project),
      layout: slot,
      slug: project.slug,
      title: getHomeProjectTitle(project),
      year: formatProjectYear(project.frontmatter.date),
    }
  })
}

export function getWorkStackCardStyle(layout: WorkStackSlot) {
  return {
    left: `${layout.left}%`,
    top: `${layout.top}%`,
    width: `${layout.width}%`,
    zIndex: layout.zIndex,
    '--stack-rotate': `${layout.rotate}deg`,
    aspectRatio: WORK_STACK_ASPECT_RATIO[layout.aspect],
  } as const
}
