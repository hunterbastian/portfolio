import type { ProjectFrontmatter } from '@/types/project'

export interface HomeProject {
  slug: string
  frontmatter: ProjectFrontmatter
}

export const HOME_PROJECT_DESCRIPTIONS: Record<string, string> = {
  'mentalhealth-minisite': 'Student support minisite for finding help quickly.',
  lumo: 'Mindfulness app for calm reflection.',
  'middle-earth-journey': 'Interactive Tolkien map experience.',
  'wander-utah': 'National parks trip-planning app.',
  'porsche-app': 'Simplified Porsche browsing concept.',
}

export const PROJECT_GLOW_GRADIENTS: Record<string, string> = {
  'mentalhealth-minisite':
    'radial-gradient(ellipse at 22% 48%, rgba(47, 125, 115, 0.28) 0%, rgba(84, 156, 143, 0.16) 24%, rgba(166, 214, 204, 0.08) 43%, transparent 72%), radial-gradient(ellipse at 44% 58%, rgba(80, 112, 196, 0.12) 0%, rgba(80, 112, 196, 0.05) 30%, transparent 58%)',
  lumo:
    'radial-gradient(ellipse at 22% 48%, rgba(248, 198, 57, 0.34) 0%, rgba(255, 212, 80, 0.2) 22%, rgba(255, 236, 148, 0.08) 42%, transparent 72%), radial-gradient(ellipse at 44% 58%, rgba(255, 75, 0, 0.13) 0%, rgba(255, 154, 64, 0.06) 30%, transparent 58%)',
  'middle-earth-journey':
    'radial-gradient(ellipse at 24% 48%, rgba(35, 84, 128, 0.3) 0%, rgba(66, 116, 156, 0.17) 24%, rgba(156, 182, 196, 0.08) 42%, transparent 72%), radial-gradient(ellipse at 44% 58%, rgba(226, 61, 40, 0.11) 0%, rgba(226, 61, 40, 0.045) 28%, transparent 56%)',
  'wander-utah':
    'radial-gradient(ellipse at 24% 48%, rgba(255, 75, 0, 0.3) 0%, rgba(255, 116, 36, 0.17) 23%, rgba(255, 186, 105, 0.08) 42%, transparent 72%), radial-gradient(ellipse at 44% 58%, rgba(143, 166, 85, 0.13) 0%, rgba(143, 166, 85, 0.055) 28%, transparent 56%)',
  'porsche-app':
    'radial-gradient(ellipse at 24% 48%, rgba(226, 61, 40, 0.28) 0%, rgba(226, 61, 40, 0.16) 23%, rgba(242, 170, 150, 0.075) 42%, transparent 72%), radial-gradient(ellipse at 44% 58%, rgba(42, 42, 44, 0.16) 0%, rgba(42, 42, 44, 0.055) 28%, transparent 56%)',
  playground:
    'radial-gradient(ellipse at 24% 48%, rgba(255, 75, 0, 0.36) 0%, rgba(255, 154, 64, 0.2) 20%, rgba(255, 188, 118, 0.1) 36%, rgba(255, 212, 168, 0.04) 52%, transparent 72%), radial-gradient(ellipse at 42% 58%, rgba(255, 185, 120, 0.13) 0%, rgba(255, 205, 152, 0.065) 28%, transparent 56%)',
}

export const PROJECT_ACCENTS: Record<string, string> = {
  'mentalhealth-minisite': '#2f7d73',
  lumo: '#f8c639',
  'middle-earth-journey': '#235480',
  'wander-utah': '#8fa655',
  'porsche-app': '#e23d28',
  playground: '#ff4b00',
}

export type WorkFilter = 'all' | 'product' | 'visual' | 'web'

export const WORK_FILTER_LABELS: Record<WorkFilter, string> = {
  all: 'All work',
  product: 'Product work',
  visual: 'Visual work',
  web: 'Web work',
}

const PRODUCT_TAGS = new Set(['ux design', 'ui design', 'mobile design', 'web design', 'accessibility'])
const VISUAL_TAGS = new Set(['graphic design', 'product design', 'marketing', 'branding', 'visual design'])

export function normalizeWorkFilter(value: string | null | undefined): WorkFilter {
  if (value === 'product' || value === 'visual' || value === 'web') {
    return value
  }

  return 'all'
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
  return new Date(date).getFullYear().toString()
}

export function getProjectRows(projects: HomeProject[], filter: WorkFilter) {
  return projects.filter((project) => projectMatchesWorkFilter(project, filter)).slice(0, 5)
}

export function getHomeProjectDescription(project: HomeProject) {
  return HOME_PROJECT_DESCRIPTIONS[project.slug] ?? project.frontmatter.description
}

export function getProjectAccent(slug: string) {
  return PROJECT_ACCENTS[slug] ?? '#ff4b00'
}
