import { getAllProjects } from '@/lib/projects'
import AnimatedHomePage, { type WorkTrackerData } from '@/components/AnimatedHomePage'
import ProjectGridClient from '@/components/ProjectGridClient'
import { ProjectLoader } from '@/components/Loader'
import { Suspense } from 'react'
import type { Project } from '@/types/project'

// Revalidate every 1 minute in production
export const revalidate = 60

interface ThreadDefinition {
  index: string
  title: string
  detail: string
  categories: string[]
  tags: string[]
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

export default function HomePage() {
  const projects = getAllProjects()
  const workTracker = buildWorkTracker(projects)

  return (
    <AnimatedHomePage workTracker={workTracker}>
      <Suspense fallback={<ProjectLoader />}>
        <ProjectGridClient projects={projects} initialLoadDelayMs={220} />
      </Suspense>

      {projects.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">
            No projects yet. Check back soon for exciting updates!
          </p>
        </div>
      )}
    </AnimatedHomePage>
  )
}
