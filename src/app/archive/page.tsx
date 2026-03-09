import { getAllProjects, getArchivedProjects } from '@/lib/projects'
import ProjectCard from '@/components/ProjectCard'
import Link from 'next/link'

import type { Metadata } from 'next'
import type { Project } from '@/types/project'

const baseUrl = 'https://hunterbastian.com'
const brandName = 'Hunter Bastian // Studio Alpine'
const HERO_NOTE_LABEL = 'NOT A STUDIO - JUST ME'
const HERO_NOTE_TEXT =
  "I'm Hunter Bastian. I study interaction design at UVU and spend most of my time making interfaces, videos, brands, and small experiments for the internet. This site is a collection of the work and ideas I keep returning to."
const WORK_TRACKER_LABEL = 'CORE THREADS OF MY WORK'
const PLAYGROUND_CARD_LAYOUT = [
  'lg:left-[4%] lg:top-[10%] lg:w-[320px] lg:-rotate-[7deg]',
  'lg:left-[38%] lg:top-[3%] lg:w-[320px] lg:rotate-[4deg]',
  'lg:right-[4%] lg:top-[18%] lg:w-[320px] lg:-rotate-[5deg]',
  'lg:left-[16%] lg:bottom-[6%] lg:w-[320px] lg:rotate-[6deg]',
  'lg:right-[17%] lg:bottom-[3%] lg:w-[320px] lg:-rotate-[3deg]',
  'lg:left-[43%] lg:bottom-[14%] lg:w-[320px] lg:rotate-[2deg]',
] as const

interface ThreadDefinition {
  index: string
  title: string
  detail: string
  categories: string[]
  tags: string[]
}

interface WorkTrackerData {
  totalProjects: number
  totalCategories: number
  totalTags: number
  threads: Array<{
    index: string
    title: string
    detail: string
    count: number
    barUnits: number
  }>
}

const THREAD_DEFINITIONS: ThreadDefinition[] = [
  {
    index: '01',
    title: 'INTERFACE SYSTEMS',
    detail: 'web / mobile / product ux',
    categories: ['Web Design', 'UI and Web Design', 'Mobile Design'],
    tags: ['UI Design', 'UX Design', 'UI/UX', 'Interactive Design', 'App Design', 'Mobile'],
  },
  {
    index: '02',
    title: 'BRAND & IMAGE',
    detail: 'identity / graphic / marketing',
    categories: ['Brand Identity', 'Graphic Design'],
    tags: ['Brand Identity', 'Logo Design', 'Visual Identity', 'Graphic Design', 'Marketing'],
  },
  {
    index: '03',
    title: 'OBJECTS & PRODUCT',
    detail: 'physical / packaging / applied',
    categories: ['Product Design'],
    tags: ['Product Design', 'Wallet', 'E-commerce'],
  },
  {
    index: '04',
    title: 'TOOLS & EXPERIMENTS',
    detail: 'html / css / figma / framer',
    categories: [],
    tags: ['HTML', 'CSS', 'Figma', 'Framer', 'Immersive Design', 'Storytelling'],
  },
] as const

function formatTrackerCount(value: number) {
  return value.toString().padStart(2, '0')
}

function buildWorkTracker(projects: Project[]): WorkTrackerData {
  const uniqueCategories = new Set(projects.map((project) => project.frontmatter.category))
  const uniqueTags = new Set(projects.flatMap((project) => project.frontmatter.tags))

  const threadCounts = THREAD_DEFINITIONS.map((thread) => {
    const categorySet = new Set(thread.categories.map((category) => category.toLowerCase()))
    const tagSet = new Set(thread.tags.map((tag) => tag.toLowerCase()))

    const count = projects.filter((project) => {
      const category = project.frontmatter.category.toLowerCase()
      const tags = project.frontmatter.tags.map((tag) => tag.toLowerCase())

      return categorySet.has(category) || tags.some((tag) => tagSet.has(tag))
    }).length

    return {
      index: thread.index,
      title: thread.title,
      detail: thread.detail,
      count,
    }
  })

  const maxCount = Math.max(...threadCounts.map((thread) => thread.count), 1)

  return {
    totalProjects: projects.length,
    totalCategories: uniqueCategories.size,
    totalTags: uniqueTags.size,
    threads: threadCounts.map((thread) => ({
      ...thread,
      barUnits: Math.max(7, Math.round((thread.count / maxCount) * 18)),
    })),
  }
}

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
  const projects = getAllProjects()
  const archivedProjects = getArchivedProjects()
  const workTracker = buildWorkTracker(projects)

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
