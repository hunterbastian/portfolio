import type { Metadata } from 'next'
import BreadcrumbPill from '@/components/BreadcrumbPill'
import PlaygroundOrbit from '@/components/PlaygroundOrbit'
import { getArchivedProjects } from '@/lib/projects'
import { resolveSiteUrl, siteConfig, sitePortfolioName } from '@/lib/site'

export const metadata: Metadata = {
  title: `Playground | ${sitePortfolioName}`,
  description: `Browse side projects and experiments by ${siteConfig.brandName}. A collection of explorations in UI/UX design, web development, and branding.`,
  robots: {
    index: false,
    follow: true,
  },
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
    <div className="relative min-h-screen px-5 pb-24 sm:px-8 sm:pb-32">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.14] dark:opacity-[0.08] archive-glow"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-[36rem]">
        <div className="pt-4 sm:pt-6">
          <BreadcrumbPill href="/" parentLabel="Home" currentLabel="Playground" />
        </div>

        <div className="pt-16 sm:pt-24">
          <div className="space-y-4">
            <p className="font-mono text-[1rem] tracking-[-0.03em] text-foreground/92">
              Playground
            </p>
            <p className="max-w-[31rem] font-mono text-[1rem] leading-[1.72] tracking-[-0.02em] text-foreground/84">
              Smaller creative coding experiments, visual studies, and side explorations that live outside the main case-study flow.
            </p>
          </div>

          {archivedProjects.length === 0 ? (
            <div className="pt-16">
              <p className="font-mono text-[0.96rem] text-muted-foreground">
                No archived projects yet.
              </p>
            </div>
          ) : (
            <section className="pt-14">
              <div className="space-y-3">
                <div className="flex items-baseline gap-4 text-[0.85rem] tracking-[-0.02em] text-foreground/92">
                  <h1>Orbit</h1>
                </div>
                <div className="h-px w-full bg-border/90" />
              </div>

              <div className="pt-8">
                <div className="mx-auto max-w-[44rem]">
                  <div className="relative h-[28rem] overflow-hidden border border-border/80 bg-card/[0.28] shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:h-[32rem]">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.42),transparent_48%)]" />
                    <div className="relative z-10 h-full">
                      <PlaygroundOrbit
                        projects={archivedProjects}
                        radiusDesktop={160}
                        radiusLarge={190}
                      />
                    </div>
                  </div>
                </div>

                <p className="mx-auto mt-5 max-w-[28rem] text-center font-mono text-[0.9rem] leading-[1.65] text-muted-foreground">
                  A rotating field of smaller experiments. Hover around, then open any card to see the full project.
                </p>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
