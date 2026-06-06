import PlaygroundGallery from '@/components/playground/PlaygroundGallery'
import { PLAYGROUND_EMPTY_COPY, sortProjectsForPlayground } from '@/lib/playground'
import { getArchivedProjects } from '@/lib/projects'
import { siteConfig, sitePortfolioName } from '@/lib/site'
import { getStaticPageMetadata } from '@/lib/site-metadata'

const archiveTitle = `Playground | ${sitePortfolioName}`
const archiveDescription = `Browse side projects and experiments by ${siteConfig.personName}. A collection of explorations in UI/UX design, web development, and branding.`

export const metadata = getStaticPageMetadata({
  absoluteTitle: true,
  description: archiveDescription,
  openGraphType: 'website',
  path: '/archive',
  robots: {
    index: false,
    follow: true,
  },
  siteName: sitePortfolioName,
  title: archiveTitle,
})

export default function ArchivePage() {
  const archivedProjects = sortProjectsForPlayground(getArchivedProjects())

  return (
    <div className="playground-page relative -mt-14 min-h-screen px-3 pb-16 pt-14 sm:-mt-16 sm:px-5 sm:pb-24 sm:pt-16">
      <div
        className="pointer-events-none fixed inset-0 z-0 archive-glow"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-[calc(100vw-7rem)]">
        <div className="pt-8 sm:pt-12">
          {archivedProjects.length === 0 ? (
            <div className="pt-16">
              <p className="font-mono text-[0.96rem] text-muted-foreground">
                {PLAYGROUND_EMPTY_COPY}
              </p>
            </div>
          ) : (
            <PlaygroundGallery projects={archivedProjects} />
          )}
        </div>
      </div>
    </div>
  )
}
