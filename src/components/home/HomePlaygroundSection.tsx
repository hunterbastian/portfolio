import Link from 'next/link'
import { EditorialProjectCard } from '@/components/home/EditorialProjectCard'
import type { HomeProject } from '@/lib/home-projects'

export function HomePlaygroundSection({ projects }: { projects: HomeProject[] }) {
  return (
    <section id="playground" className="editorial-section" aria-labelledby="playground-heading">
      <div className="editorial-section-heading">
        <h2 id="playground-heading">Playground</h2>
        <Link href="/archive" className="editorial-text-link">All experiments <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="editorial-project-grid editorial-play-grid">
        {projects.slice(0, 6).map((project) => <EditorialProjectCard key={project.slug} project={project} compact />)}
      </div>
    </section>
  )
}
