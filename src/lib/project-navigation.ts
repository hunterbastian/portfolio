import type { Project } from '@/types/project'

export interface ProjectEndNavItem {
  slug: string
  title: string
  description: string
  category: string
  image: string
}

export interface ProjectEndNavigation {
  nextProject: ProjectEndNavItem | null
  relatedProject: ProjectEndNavItem | null
}

export type ProjectEndNavSource = 'project_end_next' | 'project_end_related'

export const PROJECT_END_NAV_SOURCE_LABELS = {
  project_end_next: 'Next project',
  project_end_related: 'Related project',
} as const satisfies Record<ProjectEndNavSource, string>

export const PROJECT_END_NAV_HAPTIC_STYLE = 'light'
export const PROJECT_END_NAV_ARIA_LABEL = 'Continue exploring projects'
export const PROJECT_END_NAV_EYEBROW = 'Keep exploring'
export const PROJECT_END_NAV_HEADING = 'More project work'
export const PROJECT_END_NAV_IMAGE_SIZES = '(max-width: 640px) 68px, 80px'

export const PROJECT_END_NAV_SECTION_CLASS_NAME =
  'not-prose mt-10 border-t border-border/70 pt-6 sm:mt-12 sm:pt-7'

export const PROJECT_END_NAV_HEADER_CLASS_NAME = 'mb-4 space-y-1.5'

export const PROJECT_END_NAV_EYEBROW_CLASS_NAME =
  'font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground/62'

export const PROJECT_END_NAV_HEADING_CLASS_NAME =
  'font-mono text-[0.98rem] font-medium leading-snug text-foreground sm:text-[1.05rem]'

export const PROJECT_END_NAV_GRID_CLASS_NAME = 'grid gap-3 sm:grid-cols-2'

export const PROJECT_END_NAV_LINK_CLASS_NAME =
  'group block touch-manipulation border border-border/70 bg-background/55 p-2.5 shadow-card-subtle transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-[1px] hover:border-foreground/18 hover:shadow-card active:translate-y-0 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'

export const PROJECT_END_NAV_LINK_LAYOUT_CLASS_NAME =
  'grid grid-cols-[4.25rem_1fr] gap-3 sm:grid-cols-[5rem_1fr]'

export const PROJECT_END_NAV_IMAGE_FRAME_CLASS_NAME =
  'relative aspect-[4/3] overflow-hidden border border-border/60 bg-card'

export const PROJECT_END_NAV_IMAGE_CLASS_NAME =
  'object-cover transition-transform duration-300 ease-soft group-hover:scale-[1.02]'

export const PROJECT_END_NAV_LINK_BODY_CLASS_NAME = 'min-w-0 space-y-1'

export const PROJECT_END_NAV_LINK_META_CLASS_NAME =
  'flex min-w-0 items-center justify-between gap-3'

export const PROJECT_END_NAV_LABEL_CLASS_NAME =
  'font-mono text-[0.64rem] uppercase tracking-[0.12em] text-muted-foreground/65'

export const PROJECT_END_NAV_ICON_CLASS_NAME =
  'h-3 w-3 shrink-0 text-muted-foreground transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-foreground'

export const PROJECT_END_NAV_TITLE_CLASS_NAME =
  'truncate font-mono text-[0.88rem] font-medium leading-snug text-foreground sm:text-[0.94rem]'

export const PROJECT_END_NAV_DESCRIPTION_CLASS_NAME =
  'line-clamp-2 font-inter text-[12px] leading-relaxed text-muted-foreground'

export interface ProjectEndNavEntry {
  item: ProjectEndNavItem
  label: string
  source: ProjectEndNavSource
}

export interface ProjectEndNavAnalyticsContext {
  projectSlug: string
  projectTitle: string
  source: ProjectEndNavSource
}

export interface ProjectEndNavLinkAction {
  currentSlug: string
  currentTitle: string
  item: ProjectEndNavItem
  showToast: (message: string) => void
  source: ProjectEndNavSource
  trackProjectClick: (
    slug: string,
    title: string,
    context: ProjectEndNavAnalyticsContext,
  ) => void
  triggerHaptic: (style: typeof PROJECT_END_NAV_HAPTIC_STYLE) => void
}

export function toProjectEndNavItem(project: Project): ProjectEndNavItem {
  return {
    slug: project.slug,
    title: project.frontmatter.displayTitle ?? project.frontmatter.title,
    description: project.frontmatter.description,
    category: project.frontmatter.category,
    image: project.frontmatter.image,
  }
}

export function getProjectEndNavHref(item: ProjectEndNavItem): string {
  return `/projects/${item.slug}`
}

export function getProjectEndNavToastMessage(item: ProjectEndNavItem): string {
  return `Opening ${item.title}`
}

export function getProjectEndNavAnalyticsContext({
  currentSlug,
  currentTitle,
  source,
}: {
  currentSlug: string
  currentTitle: string
  source: ProjectEndNavSource
}): ProjectEndNavAnalyticsContext {
  return {
    source,
    projectSlug: currentSlug,
    projectTitle: currentTitle,
  }
}

export function getProjectEndNavEntries({
  nextProject,
  relatedProject,
}: ProjectEndNavigation): ProjectEndNavEntry[] {
  const entries: ProjectEndNavEntry[] = []

  if (nextProject) {
    entries.push({
      item: nextProject,
      label: PROJECT_END_NAV_SOURCE_LABELS.project_end_next,
      source: 'project_end_next',
    })
  }

  if (relatedProject) {
    entries.push({
      item: relatedProject,
      label: PROJECT_END_NAV_SOURCE_LABELS.project_end_related,
      source: 'project_end_related',
    })
  }

  return entries
}

export function activateProjectEndNavLink({
  currentSlug,
  currentTitle,
  item,
  showToast,
  source,
  trackProjectClick,
  triggerHaptic,
}: ProjectEndNavLinkAction) {
  triggerHaptic(PROJECT_END_NAV_HAPTIC_STYLE)
  trackProjectClick(
    item.slug,
    item.title,
    getProjectEndNavAnalyticsContext({ currentSlug, currentTitle, source }),
  )
  showToast(getProjectEndNavToastMessage(item))
}

export function getNextProject(projects: Project[], currentSlug: string): Project | null {
  if (projects.length <= 1) return null

  const currentIndex = projects.findIndex((project) => project.slug === currentSlug)
  if (currentIndex < 0) return projects[0] ?? null

  return projects[(currentIndex + 1) % projects.length] ?? null
}

export function getRelatedProject(
  projects: Project[],
  currentProject: Project,
  nextProject: Project | null,
): Project | null {
  const currentTags = new Set(currentProject.frontmatter.tags.map((tag) => tag.toLowerCase()))
  const candidates = projects.filter((project) => project.slug !== currentProject.slug && project.slug !== nextProject?.slug)

  return (
    candidates.find((project) => project.frontmatter.category === currentProject.frontmatter.category) ??
    candidates.find((project) => project.frontmatter.tags.some((tag) => currentTags.has(tag.toLowerCase()))) ??
    candidates[0] ??
    null
  )
}

export function getProjectEndNavigation(projects: Project[], currentProject: Project): ProjectEndNavigation {
  const nextProject = getNextProject(projects, currentProject.slug)
  const relatedProject = getRelatedProject(projects, currentProject, nextProject)

  return {
    nextProject: nextProject ? toProjectEndNavItem(nextProject) : null,
    relatedProject: relatedProject ? toProjectEndNavItem(relatedProject) : null,
  }
}
