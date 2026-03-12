import { MetadataRoute } from 'next'
import { getAllProjects } from '@/lib/projects'
import { resolveSiteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getAllProjects()

  const projectUrls = projects.map((project) => ({
    url: resolveSiteUrl(`/projects/${project.slug}`),
    lastModified: project.frontmatter?.date ? new Date(project.frontmatter.date) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: resolveSiteUrl(),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: resolveSiteUrl('/archive'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...projectUrls,
  ]
}
