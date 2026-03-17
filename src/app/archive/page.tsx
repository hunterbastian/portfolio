import { getArchivedProjects } from '@/lib/projects'
import PlaygroundOrbit from '@/components/PlaygroundOrbit'
import PlaygroundDraw from '@/components/PlaygroundDraw'
import Link from 'next/link'
import { resolveSiteUrl, siteConfig, sitePortfolioName } from '@/lib/site'
import IconArrowBackUp from '@/components/IconArrowBackUp'

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
        className="pointer-events-none fixed inset-0 z-0 playground-page-bg"
        aria-hidden="true"
      />
      <PlaygroundDraw />
      <div className="relative z-10 flex h-full flex-col container mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8">
        <div className="mb-4 sm:mb-8 shrink-0">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.06em] text-muted-foreground hover:text-foreground"
          >
            <IconArrowBackUp size={12} className="shrink-0 opacity-60 transition-transform duration-200 ease-out group-hover:-translate-x-0.5" aria-hidden />
            <span className="text-foreground">Home</span>
            <span aria-hidden className="text-muted-foreground/70">/</span>
            <span>Playground</span>
          </Link>
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
