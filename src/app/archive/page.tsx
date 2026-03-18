import { getArchivedProjects } from '@/lib/projects'
import PlaygroundOrbit from '@/components/PlaygroundOrbit'

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
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.15] dark:opacity-[0.1] archive-glow"
        aria-hidden="true"
      />
      <div className="relative z-10 flex h-full flex-col container mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
        <div className="mb-2 sm:mb-4 shrink-0">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full backdrop-blur-xl px-5 py-2.5 top-meta-pill font-mono text-[11px] tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <IconArrowBackUp size={11} className="shrink-0 opacity-60 transition-transform duration-200 ease-out group-hover:-translate-x-0.5" aria-hidden />
            <span className="text-foreground opacity-90">Home</span>
            <span aria-hidden className="text-muted-foreground/40">/</span>
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
