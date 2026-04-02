import type { Metadata } from 'next'
import AboutPageClient from './AboutPageClient'
import { resolveSiteUrl, siteConfig, sitePortfolioName } from '@/lib/site'

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

/* Static string literals only — no user input. Safe for JSON.stringify. */
const aboutJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
    { '@type': 'ListItem', position: 2, name: 'About', item: resolveSiteUrl('/about') },
  ],
})

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: aboutJsonLd }} />
      <AboutPageClient />
    </>
  )
}
