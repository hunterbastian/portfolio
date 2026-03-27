import { getArchivedProjects } from '@/lib/projects'
import PlaygroundOrbit from '@/components/PlaygroundOrbit'

import { resolveSiteUrl, siteConfig, sitePortfolioName } from '@/lib/site'
import BreadcrumbPill from '@/components/BreadcrumbPill'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Playground | ${sitePortfolioName}`,
  description: `Browse side projects and experiments by ${siteConfig.brandName}. A collection of explorations in UI/UX design, web development, and branding.`,
  openGraph: {
    title: `Playground - ${siteConfig.brandName}`,
    description: 'Browse side projects and experiments.',
    url: resolveSiteUrl('/archive'),
    type: 'website',
  },
  alternates: {
    canonical: resolveSiteUrl('/archive'),
  },
}

export default function ArchivePage() {
  const archivedProjects = getArchivedProjects()

  return (
    <div className="relative h-[100dvh]">
      {/* Breadcrumb — matches About page positioning */}
      <div className="absolute top-0 left-0 right-0 z-30">
        <div className="container mx-auto max-w-6xl px-4 pt-4 sm:px-6 sm:pt-6">
          <BreadcrumbPill href="/" parentLabel="Home" currentLabel="Playground" />
        </div>
      </div>

      <div className="relative h-full overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.15] dark:opacity-[0.1] archive-glow"
          aria-hidden="true"
        />

        {/* Orbit — fills entire viewport, centers from true middle */}
        <div className="relative z-10 h-full">
          {archivedProjects.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-foreground text-xs" style={{ fontFamily: 'inherit' }}>No archived projects yet.</p>
            </div>
          ) : (
            <PlaygroundOrbit projects={archivedProjects} />
          )}
        </div>
      </div>
    </div>
  )
}
