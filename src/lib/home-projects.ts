import type { ProjectFrontmatter } from '@/types/project'
import { formatYearFromDate } from './date.ts'

export interface HomeProject {
  slug: string
  frontmatter: ProjectFrontmatter
}

export interface FeaturedProjectRowStyleVars {
  '--editorial-accent': string
  '--featured-row-highlight-bg': string
  '--featured-row-highlight-border': string
  '--featured-row-highlight-shadow': string
}

export const HOME_ROW_HOVER_ACCENT = '#2f7d73'
export const HOME_PROJECT_GRID_PROJECT_LIMIT = 8

export type WorkFilter = 'all' | 'product' | 'visual' | 'web'

export const HOME_WORK_FILTER_EVENT = 'hb-work-filter'
export const HOME_PROJECT_CLEAR_FILTER_ANALYTICS_TARGET = 'work_filter_all'
export const HOME_PROJECT_CLEAR_FILTER_HAPTIC_STYLE = 'light'
export const HOME_PROJECT_CLEAR_FILTER_TOAST = 'Showing all work'

export const WORK_FILTER_LABELS: Record<WorkFilter, string> = {
  all: 'All work',
  product: 'Product work',
  visual: 'Visual work',
  web: 'Web work',
}

export interface HomeProjectClearFilterActivationInput {
  setWorkFilter: (filter: WorkFilter) => void
  showToast: (message: string) => void
  trackNavigationClick: (target: string) => void
  triggerHaptic: (style: typeof HOME_PROJECT_CLEAR_FILTER_HAPTIC_STYLE) => void
}

export interface HomeWorkFilterChangeActivationInput {
  currentHref?: string
  filter: WorkFilter
  replaceUrl: (href: string) => void
  requestFrame: (callback: () => void) => void
  scrollProjectsIntoView: () => void
  setWorkFilter: (filter: WorkFilter) => void
}

export interface HomeWorkFilterEventDetail {
  filter?: string
}

const PRODUCT_TAGS = new Set(['ux design', 'ui design', 'mobile design', 'web design', 'accessibility'])
const VISUAL_TAGS = new Set(['graphic design', 'product design', 'marketing', 'branding', 'visual design'])

export function normalizeWorkFilter(value: string | null | undefined): WorkFilter {
  if (value === 'product' || value === 'visual' || value === 'web') {
    return value
  }

  return 'all'
}

export function getWorkFilterFromHref(currentHref: string): WorkFilter {
  return normalizeWorkFilter(new URL(currentHref).searchParams.get('work'))
}

export function getWorkFilterFromEventDetail(detail: HomeWorkFilterEventDetail | null | undefined): WorkFilter {
  return normalizeWorkFilter(detail?.filter)
}

export function getWorkFilterUrl(currentHref: string, filter: WorkFilter) {
  const url = new URL(currentHref)

  if (filter === 'all') {
    url.searchParams.delete('work')
  } else {
    url.searchParams.set('work', filter)
  }

  url.hash = 'projects'

  return `${url.pathname}${url.search}${url.hash}`
}

export function projectMatchesWorkFilter(project: HomeProject, filter: WorkFilter) {
  if (filter === 'all') return true

  const category = project.frontmatter.category.toLowerCase()
  const tags = project.frontmatter.tags.map((tag) => tag.toLowerCase())
  const title = project.frontmatter.title.toLowerCase()

  if (filter === 'product') {
    return (
      category.includes('mobile') ||
      category.includes('web') ||
      tags.some((tag) => PRODUCT_TAGS.has(tag))
    )
  }

  if (filter === 'visual') {
    return (
      category.includes('graphic') ||
      tags.some((tag) => VISUAL_TAGS.has(tag)) ||
      title.includes('logo')
    )
  }

  return category.includes('web') || tags.some((tag) => tag.includes('web') || tag.includes('next') || tag.includes('interactive'))
}

export function formatProjectYear(date: string) {
  return formatYearFromDate(date)
}

export function getProjectRows(projects: HomeProject[], filter: WorkFilter) {
  return projects.filter((project) => projectMatchesWorkFilter(project, filter)).slice(0, HOME_PROJECT_GRID_PROJECT_LIMIT)
}

export function activateHomeProjectClearFilter({
  setWorkFilter,
  showToast,
  trackNavigationClick,
  triggerHaptic,
}: HomeProjectClearFilterActivationInput) {
  triggerHaptic(HOME_PROJECT_CLEAR_FILTER_HAPTIC_STYLE)
  trackNavigationClick(HOME_PROJECT_CLEAR_FILTER_ANALYTICS_TARGET)
  setWorkFilter('all')
  showToast(HOME_PROJECT_CLEAR_FILTER_TOAST)
}

export function activateHomeWorkFilterChange({
  currentHref,
  filter,
  replaceUrl,
  requestFrame,
  scrollProjectsIntoView,
  setWorkFilter,
}: HomeWorkFilterChangeActivationInput) {
  setWorkFilter(filter)

  if (!currentHref) {
    return
  }

  replaceUrl(getWorkFilterUrl(currentHref, filter))
  requestFrame(scrollProjectsIntoView)
}

export function getHomeProjectTitle(project: HomeProject) {
  return project.frontmatter.displayTitle ?? project.frontmatter.title
}

export function getProjectAccent(_slug: string) {
  return HOME_ROW_HOVER_ACCENT
}

export function getFeaturedProjectRowStyleVars(
  slug: string,
  _hoverDistance = 0,
  accent = getProjectAccent(slug),
): FeaturedProjectRowStyleVars {
  return {
    '--editorial-accent': accent,
    '--featured-row-highlight-bg': `color-mix(in srgb, ${accent} 5%, rgba(var(--background-rgb), 0.58))`,
    '--featured-row-highlight-border': `color-mix(in srgb, ${accent} 16%, transparent)`,
    '--featured-row-highlight-shadow': `color-mix(in srgb, ${accent} 10%, transparent)`,
  }
}
