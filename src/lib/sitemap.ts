import { resolveSiteUrl } from './site.ts'

export type SitemapChangeFrequency = 'weekly' | 'monthly'

export interface SitemapProjectSource {
  slug: string
  frontmatter?: {
    date?: string
  }
}

export interface SitemapRoute {
  changeFrequency: SitemapChangeFrequency
  path: string
  priority: number
}

export interface SitemapEntry {
  changeFrequency: SitemapChangeFrequency
  lastModified: Date
  priority: number
  url: string
}

export const STATIC_SITEMAP_ROUTES: SitemapRoute[] = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/cv', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/archive', changeFrequency: 'monthly', priority: 0.6 },
]

export function getStaticSitemapEntries(lastModified = new Date()): SitemapEntry[] {
  return STATIC_SITEMAP_ROUTES.map((route) => ({
    url: resolveSiteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}

export function getProjectSitemapEntry(project: SitemapProjectSource, fallbackDate = new Date()): SitemapEntry {
  return {
    url: resolveSiteUrl(`/projects/${project.slug}`),
    lastModified: project.frontmatter?.date ? new Date(project.frontmatter.date) : fallbackDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  }
}

export function getSitemapEntries(projects: SitemapProjectSource[], lastModified = new Date()): SitemapEntry[] {
  return [
    ...getStaticSitemapEntries(lastModified),
    ...projects.map((project) => getProjectSitemapEntry(project, lastModified)),
  ]
}
