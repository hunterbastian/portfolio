import type { Metadata } from 'next'
import { getAllProjects } from '@/lib/projects'
import AnimatedHomePage from '@/components/AnimatedHomePage'
import ErrorBoundary from '@/components/ErrorBoundary'
import { resolveSiteUrl, siteConfig } from '@/lib/site'

const previewTitle = siteConfig.personName
const previewDescription = siteConfig.siteLocation

export const metadata: Metadata = {
  title: {
    absolute: previewTitle,
  },
  description: previewDescription,
  alternates: {
    canonical: resolveSiteUrl('/'),
  },
  openGraph: {
    title: previewTitle,
    description: previewDescription,
    url: resolveSiteUrl('/'),
    siteName: previewTitle,
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: `${previewTitle} ${previewDescription}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: previewTitle,
    description: previewDescription,
    images: ['/opengraph-image'],
  },
}

// Revalidate every 1 minute in production
export const revalidate = 60

export default function HomePage() {
  const projects = getAllProjects()

  return (
    <ErrorBoundary>
      <AnimatedHomePage projects={projects} />
    </ErrorBoundary>
  )
}
