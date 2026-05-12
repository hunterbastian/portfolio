import type { Metadata } from 'next'
import CVPageClient from './CVPageClient'
import { resolveSiteUrl, siteConfig, sitePortfolioName } from '@/lib/site'

const cvTitle = `Resume | ${sitePortfolioName}`
const cvDescription = `${siteConfig.personName} - design engineer resume. Experience, education, and skills.`

export const metadata: Metadata = {
  title: cvTitle,
  description: cvDescription,
  alternates: {
    canonical: resolveSiteUrl('/cv'),
  },
  openGraph: {
    title: cvTitle,
    description: cvDescription,
    url: resolveSiteUrl('/cv'),
    siteName: sitePortfolioName,
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: siteConfig.appName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: cvTitle,
    description: cvDescription,
    images: [siteConfig.defaultOgImage],
  },
}

export default function CVPage() {
  return <CVPageClient />
}
