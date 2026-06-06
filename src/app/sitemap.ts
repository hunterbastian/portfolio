import { MetadataRoute } from 'next'
import { getAllProjects } from '@/lib/projects'
import { getSitemapEntries } from '@/lib/sitemap'

export default function sitemap(): MetadataRoute.Sitemap {
  return getSitemapEntries(getAllProjects())
}
