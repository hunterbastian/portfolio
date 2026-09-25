'use client'

import Link from 'next/link'
import { EditorialProjectCard } from '@/components/home/EditorialProjectCard'
import { formatProjectYear, getHomeProjectTitle, partitionHomeProjectRows, type HomeProject, type WorkFilter } from '@/lib/home-projects'

const filters: { value: WorkFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'product', label: 'Product' },
  { value: 'web', label: 'Web' },
  { value: 'visual', label: 'Visual' },
]

interface HomeProjectsSectionProps {
  onWorkFilterChange: (filter: WorkFilter) => void
  projects: HomeProject[]
  workFilter: WorkFilter
}

export function HomeProjectsSection({ onWorkFilterChange, projects, workFilter }: HomeProjectsSectionProps) {
  const { featured, more } = partitionHomeProjectRows(projects, workFilter)
  // Categories without a featured project still get an image-led view.
  const visible = featured.length ? featured : more
  const additional = featured.length ? more : []

  return (
    <section id="projects" className="editorial-section" aria-labelledby="work-heading">
      <div className="editorial-section-heading">
        <h2 id="work-heading">Selected work</h2>
        <div className="editorial-filters" aria-label="Filter work">
          {filters.map((filter) => (
            <button key={filter.value} type="button" aria-pressed={workFilter === filter.value} onClick={() => onWorkFilterChange(filter.value)}>
              {filter.label}
            </button>
          ))}
        </div>
      </div>
      <div className="editorial-project-grid" aria-live="polite" aria-atomic="false">
        {visible.map((project) => <EditorialProjectCard key={project.slug} project={project} />)}
        {!visible.length && <p className="editorial-project-description">No projects in this category yet. Choose All to see the collection.</p>}
      </div>
      {additional.length > 0 && (
        <div className="editorial-more-work">
          <p className="editorial-eyebrow">More work</p>
          {additional.map((project) => (
            <Link key={project.slug} href={`/projects/${project.slug}`} className="editorial-index-row">
              <span>{getHomeProjectTitle(project)}</span>
              <span className="editorial-project-year">{formatProjectYear(project.frontmatter.date)}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
