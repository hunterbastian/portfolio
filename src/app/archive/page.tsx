import type { Metadata } from 'next'
import BreadcrumbPill from '@/components/BreadcrumbPill'
import PlaygroundOrbit from '@/components/PlaygroundOrbit'
import { getArchivedProjects } from '@/lib/projects'
import { resolveSiteUrl, siteConfig, sitePortfolioName } from '@/lib/site'
import type { Project } from '@/types/project'

const PREFERRED_ORBIT_ORDER = [
  'path',
  'sky-farm',
  'constellation',
  'little-lands',
  'obsidian-vault',
  'grand-teton-wallet',
  'mountain',
  'sunset-graphic',
  'iceland-graphics',
  'iceland-logo',
] as const

function sortArchivedForOrbit(projects: Project[]): Project[] {
  const rank = new Map<string, number>(PREFERRED_ORBIT_ORDER.map((slug, index) => [slug, index]))

  return [...projects].sort((a, b) => {
    const aRank = rank.get(a.slug) ?? Number.MAX_SAFE_INTEGER
    const bRank = rank.get(b.slug) ?? Number.MAX_SAFE_INTEGER

    if (aRank !== bRank) {
      return aRank - bRank
    }

    return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  })
}

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
  const archivedProjects = sortArchivedForOrbit(getArchivedProjects())

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
                <div className="mx-auto max-w-[36rem]">
                  <div className="playground-meadow relative h-[29rem] overflow-hidden sm:h-[32rem]">
                    <div className="playground-meadow-sky pointer-events-none" />
                    <div className="playground-meadow-cloud playground-meadow-cloud-a pointer-events-none opacity-80" />
                    <div className="playground-meadow-cloud playground-meadow-cloud-b pointer-events-none opacity-70" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] bg-[radial-gradient(90%_80%_at_50%_100%,rgba(255,244,227,0.82),transparent_75%)]" />
                    <div className="relative z-10 h-full">
                      <PlaygroundOrbit
                        projects={archivedProjects}
                        radiusDesktop={172}
                        radiusLarge={194}
                      />
                    </div>
                  </div>
                </div>

                <p className="mx-auto mt-5 max-w-[28rem] text-center font-mono text-[0.9rem] leading-[1.65] text-muted-foreground">
                  A rotating field of smaller experiments, sketches, and one-off ideas. Hover around, then open any card to see the full project.
                </p>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
