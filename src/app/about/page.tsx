import type { Metadata } from 'next'
import AboutPageClient from './AboutPageClient'
import { resolveSiteUrl, sitePortfolioName } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About - Hunter Bastian',
  description: 'Hunter Bastian is a design engineer and photographer based in Utah. Interaction design student at UVU, building digital products with care.',
  alternates: {
    canonical: resolveSiteUrl('/about'),
  },
  openGraph: {
    title: 'About - Hunter Bastian',
    description: 'Design engineer and photographer based in Utah. Building digital products with motion, craft, and detail.',
    url: resolveSiteUrl('/about'),
    siteName: sitePortfolioName,
    type: 'profile',
  },
}

export default function AboutPage() {
  return <AboutPageClient />
}
