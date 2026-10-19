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

// Inter's latin subset includes ↑ and ↓, not ↗. This face adds that one glyph
// to the same family so the inherited text arrow stays in Inter.
const showcaseArrowFamily = showcaseFont.style.fontFamily.split(',')[0].trim().replace(/^['"]|['"]$/g, '')
const showcaseArrowFace = `@font-face{font-family:"${showcaseArrowFamily}";font-style:normal;font-weight:500;font-display:swap;src:url(/fonts/inter-northeast-500.woff2) format("woff2");unicode-range:U+2197}`

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
      <style dangerouslySetInnerHTML={{ __html: showcaseArrowFace }} />
      <HomeShowcase className={showcaseFont.className} slides={slides} />
    </ErrorBoundary>
  )
}
