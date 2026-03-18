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
    <div className="relative h-[100dvh] overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.15] dark:opacity-[0.1] archive-glow"
        aria-hidden="true"
      />
      <div className="relative z-10 flex h-full flex-col container mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
        <div className="mb-2 sm:mb-4 shrink-0">
          <BreadcrumbPill href="/" parentLabel="Home" currentLabel="Playground" />
        </div>

        <div className="flex-1 min-h-0">
          {archivedProjects.length === 0 ? (
            <div className="text-center py-16">
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
