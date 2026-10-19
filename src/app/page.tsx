import { Inter } from 'next/font/google'
import ErrorBoundary from '@/components/ErrorBoundary'
import HomeShowcase from '@/components/home/HomeShowcase'
import { buildShowcaseSlides } from '@/lib/home-showcase'
import { getAllProjects } from '@/lib/projects'
import { siteConfig } from '@/lib/site'
import { getStaticPageMetadata } from '@/lib/site-metadata'

const showcaseFont = Inter({
  subsets: ['latin'],
  weight: '500',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
  adjustFontFallback: false,
})

const previewTitle = siteConfig.siteTitle
const previewDescription = siteConfig.siteDescription

export const metadata = getStaticPageMetadata({
  absoluteTitle: true,
  description: previewDescription,
  image: '/opengraph-image',
  imageAlt: previewTitle,
  openGraphType: 'website',
  path: '/',
  siteName: siteConfig.personName,
  title: previewTitle,
})

// Revalidate every 1 minute in production
export const revalidate = 60

export default function HomePage() {
  const slides = buildShowcaseSlides(getAllProjects())

  return (
    <ErrorBoundary>
      <HomeShowcase className={showcaseFont.className} slides={slides} />
    </ErrorBoundary>
  )
}
