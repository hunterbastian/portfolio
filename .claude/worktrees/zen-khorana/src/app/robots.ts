import { MetadataRoute } from 'next'
import { resolveSiteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: resolveSiteUrl('/sitemap.xml'),
  }
}
