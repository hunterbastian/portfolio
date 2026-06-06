import { getAllProjects } from '@/lib/projects'
import AnimatedHomePage from '@/components/AnimatedHomePage'
import ErrorBoundary from '@/components/ErrorBoundary'
import { siteConfig } from '@/lib/site'
import { getStaticPageMetadata } from '@/lib/site-metadata'

const previewTitle = siteConfig.personName
const previewDescription = siteConfig.siteLocation

export const metadata = getStaticPageMetadata({
  absoluteTitle: true,
  description: previewDescription,
  image: '/opengraph-image',
  imageAlt: `${previewTitle} ${previewDescription}`,
  openGraphType: 'website',
  path: '/',
  siteName: previewTitle,
  title: previewTitle,
})

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
