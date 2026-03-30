import type { Metadata } from 'next'
import CVPageClient from './CVPageClient'
import { resolveSiteUrl, siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: 'CV - Hunter Bastian',
  description: `${siteConfig.brandName} — design engineer CV. Experience, education, and skills.`,
  alternates: {
    canonical: resolveSiteUrl('/cv'),
  },
  openGraph: {
    title: 'CV - Hunter Bastian',
    description: `${siteConfig.brandName} — design engineer CV. Experience, education, and skills.`,
    url: resolveSiteUrl('/cv'),
  },
}

export default function CVPage() {
  return <CVPageClient />
}
