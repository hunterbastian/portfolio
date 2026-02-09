import { getArchivedProjects } from '@/lib/projects'
import ProjectCard from '@/components/ProjectCard'
import Link from 'next/link'

import type { Metadata } from 'next'

const baseUrl = 'https://hunterbastian.com'
const brandName = 'Hunter Bastian // Studio Alpine'

export const metadata: Metadata = {
  title: `Project Archive | ${brandName} Portfolio`,
  description: `Browse archived case studies and design projects by ${brandName}. A collection of past work in UI/UX design, web development, and branding.`,
  openGraph: {
    title: `Project Archive - ${brandName}`,
    description: 'Browse archived case studies and design projects.',
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
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
      </div>

      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Archive</h1>
        <p className="text-gray-600 dark:text-gray-400">Past projects and case studies</p>
      </div>

      {archivedProjects.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600 dark:text-gray-400">No archived projects yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {archivedProjects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              slug={project.slug}
              frontmatter={project.frontmatter}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  )
}
