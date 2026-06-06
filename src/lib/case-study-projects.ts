import type { ProjectFrontmatter } from '@/types/project'
import { MOTION_EASE_SOFT } from './motion.ts'

export interface CaseStudyProject {
  slug: string
  frontmatter: ProjectFrontmatter
}

export interface CaseStudyTextListRowState<ProjectType extends CaseStudyProject = CaseStudyProject> {
  category: string
  href: string
  index: number
  isHovered: boolean
  project: ProjectType
  rowStyle: ReturnType<typeof getCaseStudyTextListRowStyle>
  title: string
  titleClassName: string
}

export interface CaseStudyTextListPreviewState {
  alt: string
  image: string
}

export interface CaseStudyTextListViewState<ProjectType extends CaseStudyProject = CaseStudyProject> {
  hoveredProject: ProjectType | null
  orderedProjects: ProjectType[]
  preview: CaseStudyTextListPreviewState | null
  rows: CaseStudyTextListRowState<ProjectType>[]
}

export interface CaseStudyTextListRowActivationInput<ProjectType extends CaseStudyProject = CaseStudyProject> {
  href: string
  navigateTo: (href: string) => void
  project: ProjectType
  title: string
  trackProjectClick: (slug: string, title: string) => void
}

export interface CaseStudyTextListHoverStartInput {
  projectSlug: string
  setHoveredSlug: (slug: string | null) => void
}

export interface CaseStudyTextListHoverEndInput {
  setHoveredSlug: (slug: string | null) => void
}

export const CASE_STUDY_ORDER = [
  'lumo',
  'ai-project',
  'wander-utah',
  'brand-identity-system',
  'porsche-app',
  'aol-redesign',
  'grand-teton-wallet',
  'nutricost',
] as const

export const CASE_STUDY_TEXT_LIST_MOUSE_OFFSET = { x: 24, y: -80 } as const
export const CASE_STUDY_TEXT_LIST_SPRING = { stiffness: 300, damping: 30 } as const
export const CASE_STUDY_TEXT_LIST_ROW_FADED_OPACITY = 0.35
export const CASE_STUDY_TEXT_LIST_ROW_ACTIVE_OPACITY = 1
export const CASE_STUDY_TEXT_LIST_ROW_BLUR = 'blur(1px)'
export const CASE_STUDY_TEXT_LIST_ROW_FILTER = 'none'
export const CASE_STUDY_TEXT_LIST_ITEM_INITIAL = { opacity: 0, y: 8 } as const
export const CASE_STUDY_TEXT_LIST_ITEM_ANIMATE = { opacity: 1, y: 0 } as const
export const CASE_STUDY_TEXT_LIST_ITEM_DURATION = 0.4
export const CASE_STUDY_TEXT_LIST_ITEM_STAGGER = 0.06
export const CASE_STUDY_TEXT_LIST_PREVIEW_WIDTH = 280
export const CASE_STUDY_TEXT_LIST_PREVIEW_IMAGE_WIDTH = 560
export const CASE_STUDY_TEXT_LIST_PREVIEW_IMAGE_HEIGHT = 315
export const CASE_STUDY_TEXT_LIST_PREVIEW_SIZES = '280px'
export const CASE_STUDY_TEXT_LIST_PREVIEW_INITIAL = { opacity: 0, scale: 0.9 } as const
export const CASE_STUDY_TEXT_LIST_PREVIEW_ANIMATE = { opacity: 1, scale: 1 } as const
export const CASE_STUDY_TEXT_LIST_PREVIEW_EXIT = { opacity: 0, scale: 0.95 } as const
export const CASE_STUDY_TEXT_LIST_PREVIEW_OPACITY_DURATION = 0.25
export const CASE_STUDY_TEXT_LIST_PREVIEW_SCALE_DURATION = 0.35
export const CASE_STUDY_TEXT_LIST_CONTAINER_CLASS_NAME = 'relative'
export const CASE_STUDY_TEXT_LIST_LIST_CLASS_NAME = 'border-t border-border'
export const CASE_STUDY_TEXT_LIST_ROW_CLASS_NAME =
  'group relative flex w-full items-center justify-between border-b border-border px-1 py-4 text-left transition-[color,opacity,filter] duration-500 ease-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:py-5'
export const CASE_STUDY_TEXT_LIST_ROW_CONTENT_CLASS_NAME = 'flex items-center gap-3'
export const CASE_STUDY_TEXT_LIST_DOT_CLASS_NAME = 'w-[4px] h-[4px] rounded-full bg-accent shrink-0'
export const CASE_STUDY_TEXT_LIST_DOT_LAYOUT_ID = 'project-dot'
export const CASE_STUDY_TEXT_LIST_CATEGORY_CLASS_NAME =
  'font-mono text-[9px] tracking-[0.1em] text-muted-foreground/50 uppercase shrink-0'
export const CASE_STUDY_TEXT_LIST_PREVIEW_CLASS_NAME = 'pointer-events-none fixed z-50 overflow-hidden shadow-lg'
export const CASE_STUDY_TEXT_LIST_PREVIEW_IMAGE_CLASS_NAME = 'h-auto w-full object-cover'

export function getCaseStudyTextListMousePosition(clientX: number, clientY: number) {
  return {
    x: clientX + CASE_STUDY_TEXT_LIST_MOUSE_OFFSET.x,
    y: clientY + CASE_STUDY_TEXT_LIST_MOUSE_OFFSET.y,
  }
}

export function getCaseStudyTextListRowStyle(hasHover: boolean, isHovered: boolean) {
  const faded = hasHover && !isHovered

  return {
    opacity: faded ? CASE_STUDY_TEXT_LIST_ROW_FADED_OPACITY : CASE_STUDY_TEXT_LIST_ROW_ACTIVE_OPACITY,
    filter: faded ? CASE_STUDY_TEXT_LIST_ROW_BLUR : CASE_STUDY_TEXT_LIST_ROW_FILTER,
  }
}

export function getCaseStudyTextListItemTransition(index: number) {
  return {
    duration: CASE_STUDY_TEXT_LIST_ITEM_DURATION,
    delay: index * CASE_STUDY_TEXT_LIST_ITEM_STAGGER,
    ease: MOTION_EASE_SOFT,
  }
}

export function getCaseStudyTextListTitleClassName(isHovered: boolean): string {
  return `font-mono text-[13px] tracking-[0.04em] transition-colors duration-300 sm:text-[14px] ${
    isHovered ? 'text-foreground' : 'text-foreground/70'
  }`
}

export function getCaseStudyTextListPreviewTransition() {
  return {
    opacity: { duration: CASE_STUDY_TEXT_LIST_PREVIEW_OPACITY_DURATION, ease: MOTION_EASE_SOFT },
    scale: { duration: CASE_STUDY_TEXT_LIST_PREVIEW_SCALE_DURATION, ease: MOTION_EASE_SOFT },
  }
}

export function getCaseStudyTextListPreviewStyle<TPosition>(x: TPosition, y: TPosition) {
  return {
    x,
    y,
    width: CASE_STUDY_TEXT_LIST_PREVIEW_WIDTH,
  }
}

export function sortCaseStudyProjects<ProjectType extends CaseStudyProject>(
  projects: ProjectType[],
  preferredOrder: readonly string[] = CASE_STUDY_ORDER,
): ProjectType[] {
  const orderIndex = new Map<string, number>(preferredOrder.map((slug, index) => [slug, index]))

  return [...projects].sort((a, b) => {
    const aIndex = orderIndex.get(a.slug)
    const bIndex = orderIndex.get(b.slug)

    if (aIndex != null && bIndex != null) {
      return aIndex - bIndex
    }

    if (aIndex != null) {
      return -1
    }

    if (bIndex != null) {
      return 1
    }

    return 0
  })
}

export function getCaseStudyProjectTitle(project: CaseStudyProject): string {
  return project.frontmatter.displayTitle ?? project.frontmatter.title
}

export function getCaseStudyProjectHref(project: CaseStudyProject): string {
  return `/projects/${project.slug}`
}

export function activateCaseStudyTextListRow({
  href,
  navigateTo,
  project,
  title,
  trackProjectClick,
}: CaseStudyTextListRowActivationInput) {
  trackProjectClick(project.slug, title)
  navigateTo(href)
}

export function activateCaseStudyTextListHoverStart({
  projectSlug,
  setHoveredSlug,
}: CaseStudyTextListHoverStartInput) {
  setHoveredSlug(projectSlug)
}

export function activateCaseStudyTextListHoverEnd({
  setHoveredSlug,
}: CaseStudyTextListHoverEndInput) {
  setHoveredSlug(null)
}

export function getHoveredCaseStudyProject<ProjectType extends CaseStudyProject>(
  projects: ProjectType[],
  hoveredSlug: string | null,
): ProjectType | null {
  if (!hoveredSlug) return null
  return projects.find((project) => project.slug === hoveredSlug) ?? null
}

export function getCaseStudyTextListRowState<ProjectType extends CaseStudyProject>(
  project: ProjectType,
  index: number,
  hoveredSlug: string | null,
): CaseStudyTextListRowState<ProjectType> {
  const isHovered = hoveredSlug === project.slug
  const hasHover = hoveredSlug !== null

  return {
    category: project.frontmatter.category,
    href: getCaseStudyProjectHref(project),
    index,
    isHovered,
    project,
    rowStyle: getCaseStudyTextListRowStyle(hasHover, isHovered),
    title: getCaseStudyProjectTitle(project),
    titleClassName: getCaseStudyTextListTitleClassName(isHovered),
  }
}

export function getCaseStudyTextListPreviewState(
  project: CaseStudyProject | null,
): CaseStudyTextListPreviewState | null {
  if (!project?.frontmatter.image) return null

  return {
    alt: getCaseStudyProjectTitle(project),
    image: project.frontmatter.image,
  }
}

export function getCaseStudyTextListViewState<ProjectType extends CaseStudyProject>(
  projects: ProjectType[],
  hoveredSlug: string | null,
): CaseStudyTextListViewState<ProjectType> {
  const orderedProjects = sortCaseStudyProjects(projects)

  return getCaseStudyTextListViewStateFromOrderedProjects(orderedProjects, hoveredSlug)
}

export function getCaseStudyTextListViewStateFromOrderedProjects<ProjectType extends CaseStudyProject>(
  orderedProjects: ProjectType[],
  hoveredSlug: string | null,
): CaseStudyTextListViewState<ProjectType> {
  const hoveredProject = getHoveredCaseStudyProject(orderedProjects, hoveredSlug)

  return {
    hoveredProject,
    orderedProjects,
    preview: getCaseStudyTextListPreviewState(hoveredProject),
    rows: orderedProjects.map((project, index) => getCaseStudyTextListRowState(project, index, hoveredSlug)),
  }
}
