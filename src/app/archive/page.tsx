import type { Metadata } from 'next'
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
    <div className="relative -mt-14 min-h-screen px-5 pb-24 pt-14 sm:-mt-16 sm:px-8 sm:pb-32 sm:pt-16">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.14] dark:opacity-[0.08] archive-glow"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-[36rem]">
        <div className="pt-16 sm:pt-24">
          <div className="space-y-4">
            <p className="font-mono text-[1rem] tracking-[-0.03em] text-foreground/92">
              Playground
            </p>
            <p className="max-w-[31rem] font-mono text-[1rem] leading-[1.72] tracking-[-0.02em] text-foreground/84">
              Smaller creative coding experiments, visual studies, and side explorations.
            </p>
          </div>

          {archivedProjects.length === 0 ? (
            <div className="pt-16">
              <p className="font-mono text-[0.96rem] text-muted-foreground">
                No archived projects yet.
              </p>
            </div>
          ) : (
            <section className="pt-10 sm:pt-14">
              <div>
                <div className="mx-0 max-w-none sm:mx-[-4rem] lg:mx-[-6rem]">
                  <div className="relative overflow-visible py-2 sm:py-0 md:h-[39rem] lg:h-[41rem] xl:h-[43rem]">
                    <div className="relative z-10 h-full">
                      <PlaygroundOrbit
                        projects={archivedProjects}
                        radiusDesktop={224}
                        radiusLarge={252}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
