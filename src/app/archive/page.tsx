import { getArchivedProjects } from '@/lib/projects'
import ProjectCard from '@/components/ProjectCard'
import Link from 'next/link'

import type { Metadata } from 'next'

const baseUrl = 'https://hunterbastian.com'
const brandName = 'Hunter Bastian // Studio Alpine'
const PLAYGROUND_CARD_LAYOUT = [
  'lg:left-[4%] lg:top-[10%] lg:w-[320px] lg:-rotate-[7deg]',
  'lg:left-[38%] lg:top-[3%] lg:w-[320px] lg:rotate-[4deg]',
  'lg:right-[4%] lg:top-[18%] lg:w-[320px] lg:-rotate-[5deg]',
  'lg:left-[16%] lg:bottom-[6%] lg:w-[320px] lg:rotate-[6deg]',
  'lg:right-[17%] lg:bottom-[3%] lg:w-[320px] lg:-rotate-[3deg]',
  'lg:left-[43%] lg:bottom-[14%] lg:w-[320px] lg:rotate-[2deg]',
] as const

export const metadata: Metadata = {
  title: `Playground | ${brandName} Portfolio`,
  description: `Browse side projects and experiments by ${brandName}. A collection of explorations in UI/UX design, web development, and branding.`,
  openGraph: {
    title: `Playground - ${brandName}`,
    description: 'Browse side projects and experiments.',
    url: `${baseUrl}/archive`,
    type: 'website',
  },
  alternates: {
    canonical: `${baseUrl}/archive`,
  },
}

export default function ArchivePage() {
  const archivedProjects = getArchivedProjects()

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 max-w-[560px]">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-foreground transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
      </div>

      <div className="mb-12 max-w-[560px]">
        <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">Playground</h1>
      </div>

      {archivedProjects.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-foreground">No archived projects yet.</p>
        </div>
      ) : (
        <section className="playground-meadow relative overflow-hidden rounded-[2rem] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
          <div className="playground-meadow-sky" aria-hidden="true" />
          <div className="playground-meadow-cloud playground-meadow-cloud-a" aria-hidden="true" />
          <div className="playground-meadow-cloud playground-meadow-cloud-b" aria-hidden="true" />


          <div className="relative z-10 mb-8 max-w-[520px]">
            <p className="playground-field-kicker">The meadow</p>
            <h2 className="playground-field-title">Archived work scattered across a small field of experiments.</h2>
            <p className="playground-field-copy">
              Older studies, side quests, and playful detours live out here. On larger screens they wander a little.
            </p>
          </div>

          <div className="relative z-10 flex flex-col gap-6 lg:min-h-[54rem] lg:block">
            {archivedProjects.map((project, index) => (
              <div
                key={project.slug}
                className={`playground-card-plot mx-auto w-full max-w-[340px] ${PLAYGROUND_CARD_LAYOUT[index % PLAYGROUND_CARD_LAYOUT.length]}`}
              >
                <ProjectCard
                  slug={project.slug}
                  frontmatter={project.frontmatter}
                  index={index}
                />
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
