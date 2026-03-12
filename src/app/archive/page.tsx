import { getArchivedProjects } from '@/lib/projects'
import ProjectCard from '@/components/ProjectCard'
import PlaygroundOrbit from '@/components/PlaygroundOrbit'
import Link from 'next/link'
import { resolveSiteUrl, siteConfig, sitePortfolioName } from '@/lib/site'

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
    <div className="relative h-screen overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 z-0 playground-page-bg"
        aria-hidden="true"
      />
      <div className="relative z-10 h-full container mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <span aria-hidden className="text-base leading-none">↩</span>
            <span className="text-foreground">Home</span>
            <span aria-hidden className="text-muted-foreground/70">/</span>
            <span>Playground</span>
          </Link>
        </div>

        {archivedProjects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-foreground text-xs" style={{ fontFamily: 'inherit' }}>No archived projects yet.</p>
          </div>
        ) : (
          <>
            {/* Desktop: rotating orbit */}
            <PlaygroundOrbit projects={archivedProjects} />
            {/* Mobile: simple stack */}
            <div className="flex flex-col items-center gap-4 lg:hidden">
              {archivedProjects.map((project, index) => (
                <div key={project.slug} className="w-full max-w-[130px]">
                  <ProjectCard
                    slug={project.slug}
                    frontmatter={project.frontmatter}
                    index={index}
                  />
                  {project.frontmatter.demo && (
                    <a
                      href={project.frontmatter.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 flex items-center justify-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium tracking-[0.04em] text-primary transition-colors duration-200 hover:bg-primary/20"
                      aria-label={`Live demo for ${project.frontmatter.title}`}
                    >
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                      </span>
                      Live Demo
                    </a>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
