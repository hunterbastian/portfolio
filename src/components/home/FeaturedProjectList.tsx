'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Route } from 'lucide-react'
import { analytics } from '@/lib/analytics'
import { formatProjectYear, getHomeProjectDescription, getHomeProjectTitle, type HomeProject } from '@/lib/home-projects'

export function FeaturedProjectList({ projects }: { projects: HomeProject[] }) {
  const featured = projects.slice(0, 3)
  const more = projects.slice(3)
  return (
    <div className="hb-work">
      <div className="hb-project-grid">
        {featured.map((project, index) => {
          const title = getHomeProjectTitle(project)
          return (
            <Link href={`/projects/${project.slug}`} key={project.slug} className="hb-project-card" onClick={() => analytics.projectClick(project.slug, title)}>
              <div className="hb-project-image">
                <Image src={project.frontmatter.image} alt={`Preview of ${title}`} fill sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1100px) 30vw, 320px" className="object-cover" />
                <span className="hb-project-open"><ArrowUpRight size={18} aria-hidden="true" /></span>
              </div>
              <div className="hb-project-info">
                <p className="hb-project-meta"><span>{String(index + 1).padStart(2, '0')} / {project.frontmatter.category}</span><span>{formatProjectYear(project.frontmatter.date)}</span></p>
                <h3>{title}</h3>
                <p className="hb-project-description">{getHomeProjectDescription(project)}</p>
              </div>
            </Link>
          )
        })}
      </div>
      {more.length > 0 && <div className="hb-more-projects">
        {more.map((project, index) => (
          <Link href={`/projects/${project.slug}`} key={project.slug} className="hb-project-row" onClick={() => analytics.projectClick(project.slug, getHomeProjectTitle(project))}>
            <span className="hb-row-index">{String(index + 4).padStart(2, '0')}</span>
            <div><h3>{getHomeProjectTitle(project)}</h3><p>{getHomeProjectDescription(project)}</p></div>
            <span className="hb-row-year">{formatProjectYear(project.frontmatter.date)}</span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        ))}
      </div>}
      <Link href="/archive" className="hb-playground-link" onClick={() => analytics.navigationClick('archive')}>
        <span className="hb-playground-icon"><Route size={26} strokeWidth={1.5} aria-hidden="true" /></span>
        <div><span className="hb-meta-label">Take a detour</span><h3>Into the Playground</h3><p>Small worlds, playful interfaces, and things built out of curiosity.</p></div>
        <ArrowUpRight size={24} aria-hidden="true" />
      </Link>
    </div>
  )
}
