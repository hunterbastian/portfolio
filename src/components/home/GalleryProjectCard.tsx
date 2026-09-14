import Image from 'next/image'
import Link from 'next/link'
import { getHomeProjectTitle, type HomeProject } from '@/lib/home-projects'

export function GalleryProjectCard({ project, priority = false }: { project: HomeProject; priority?: boolean }) {
  const title = getHomeProjectTitle(project)
  return (
    <Link className="collection-card" href={`/projects/${project.slug}`}>
      <div className="collection-card-media">
        <Image
          src={project.frontmatter.image}
          alt={`${title} — project preview`}
          fill
          priority={priority}
          sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 46vw, 36vw"
          className="collection-card-image"
        />
        <span className="collection-card-open" aria-hidden="true">View project ↗</span>
      </div>
      <div className="collection-card-caption">
        <h3>{title}</h3>
        <span>{project.frontmatter.category}</span>
      </div>
    </Link>
  )
}
