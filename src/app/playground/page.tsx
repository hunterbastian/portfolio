import { Inter } from 'next/font/google'
import Link from 'next/link'
import PlaygroundDraw from '@/components/PlaygroundDraw'
import PlaygroundFlightDeck from '@/components/playground/PlaygroundFlightDeck'
import PlaygroundGallery from '@/components/playground/PlaygroundGallery'
import PlaygroundMasthead from '@/components/playground/PlaygroundMasthead'
import PlaygroundThemeSync from '@/components/playground/PlaygroundThemeSync'
import {
  PLAYGROUND_EMPTY_COPY,
  formatPlaygroundRange,
  sortProjectsForPlayground,
} from '@/lib/playground'
import { getArchivedProjects } from '@/lib/projects'
import { siteConfig } from '@/lib/site'
import { getStaticPageMetadata } from '@/lib/site-metadata'

const backFont = Inter({
  subsets: ['latin'],
  weight: '500',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
  adjustFontFallback: false,
})

const playgroundDescription = `Experiments and side projects by ${siteConfig.personName}.`

export const metadata = getStaticPageMetadata({
  absoluteTitle: true,
  description: playgroundDescription,
  openGraphType: 'website',
  path: '/playground',
  siteName: siteConfig.personName,
  title: 'Playground',
})

export default function PlaygroundPage() {
  const projects = sortProjectsForPlayground(getArchivedProjects())
  const archiveRange = formatPlaygroundRange(projects)

  return (
    <div className="playground-page playground-experience relative -mt-14 min-h-screen px-3 pb-28 pt-14 sm:-mt-16 sm:px-5 sm:pb-32 sm:pt-16">
      <PlaygroundThemeSync />
      <div className="pointer-events-none fixed inset-0 z-0 archive-glow" aria-hidden="true" />
      <PlaygroundDraw />

      <div className="relative z-10 mx-auto w-full max-w-[calc(100vw-2rem)] pt-10 sm:max-w-[calc(100vw-4rem)] sm:pt-16">
        <Link href="/" className={`${backFont.className} playground-back`}>
          Back
        </Link>
        <PlaygroundMasthead projectCount={projects.length} archiveRange={archiveRange} />
        {projects.length === 0 ? (
          <p className="pt-16 font-mono text-[0.96rem] text-muted-foreground">{PLAYGROUND_EMPTY_COPY}</p>
        ) : (
          <>
            <PlaygroundFlightDeck archiveRange={archiveRange} projects={projects} />
            <PlaygroundGallery projects={projects} />
          </>
        )}
      </div>
    </div>
  )
}
