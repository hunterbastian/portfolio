import Image from 'next/image'
import Link from 'next/link'
import { formatProjectYear, getHomeProjectDescription, getHomeProjectTitle, type HomeProject } from '@/lib/home-projects'

export function EditorialProjectCard({ project, compact = false }: { project: HomeProject; compact?: boolean }) {
  return (
    <Link className="editorial-project" href={`/projects/${project.slug}`}>
      <div className="editorial-project-image">
        <Image
          src={project.frontmatter.image}
          alt={project.frontmatter.title}
          fill
          sizes={compact
            ? '(max-width: 699px) calc(100vw - 48px), (max-width: 1000px) 44vw, 380px'
            : '(max-width: 699px) calc(100vw - 48px), (max-width: 1360px) 44vw, 580px'}
          quality={80}
          className="object-cover"
        />
      </div>
      <div className="editorial-project-caption">
        <h3>{getHomeProjectTitle(project)}</h3>
        <span className="editorial-project-year">{formatProjectYear(project.frontmatter.date)}</span>
      </div>
      {!compact && <p className="editorial-project-description">{getHomeProjectDescription(project)}</p>}
    </Link>
  )
}
