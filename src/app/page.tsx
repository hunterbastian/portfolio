import type { Metadata } from 'next'
import { getAllProjects } from '@/lib/projects'
import AnimatedHomePage from '@/components/AnimatedHomePage'
import ProjectGridClient from '@/components/ProjectGridClient'
import { ProjectLoader } from '@/components/Loader'
import ErrorBoundary from '@/components/ErrorBoundary'
import { Suspense } from 'react'
import { resolveSiteUrl, siteConfig, sitePortfolioName } from '@/lib/site'

export const metadata: Metadata = {
  title: siteConfig.siteTitle,
  description: 'Hunter Bastian — design engineer, creative coder, and photographer based in Utah. Case studies, experiments, and side projects in UI design, web development, and interactive media.',
  alternates: {
    canonical: resolveSiteUrl('/'),
  },
  openGraph: {
    title: siteConfig.siteTitle,
    description: `${siteConfig.brandName} — design engineer, creative coder, and photographer based in Utah.`,
    url: resolveSiteUrl('/'),
    siteName: sitePortfolioName,
    type: 'website',
  },
}

// Revalidate every 1 minute in production
export const revalidate = 60

export default function HomePage() {
  const projects = getAllProjects()

  return (
    <ErrorBoundary>
      <AnimatedHomePage>
        <Suspense fallback={<ProjectLoader />}>
          <ProjectGridClient projects={projects} initialLoadDelayMs={0} />
        </Suspense>

        {projects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              No projects yet. Check back soon for exciting updates!
            </p>
          </div>
        )}
      </AnimatedHomePage>
    </ErrorBoundary>
  )
}
