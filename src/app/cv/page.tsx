import { Inter } from 'next/font/google'
import CVPageClient from './CVPageClient'
import { siteConfig, sitePortfolioName } from '@/lib/site'
import { getStaticPageMetadata } from '@/lib/site-metadata'

const showcaseFont = Inter({
  subsets: ['latin'],
  weight: '500',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
  adjustFontFallback: false,
})

const cvTitle = `Resume | ${sitePortfolioName}`
const cvDescription = `${siteConfig.personName} - product designer resume. Experience, education, and skills.`

export const metadata = getStaticPageMetadata({
  description: cvDescription,
  image: '/cv/opengraph-image',
  imageAlt: `Resume — ${siteConfig.personName}`,
  path: '/cv',
  siteName: sitePortfolioName,
  title: cvTitle,
})

export default function CVPage() {
  return <CVPageClient className={showcaseFont.className} />
}
