import Image from 'next/image'
import Link from 'next/link'
import {
  PLAYGROUND_GALLERY_LABEL,
  PLAYGROUND_GALLERY_TITLE,
  getPlaygroundGalleryTileStates,
} from '@/lib/playground'
import type { Project } from '@/types/project'

interface PlaygroundGalleryProps {
  projects: Project[]
}

export default function PlaygroundGallery({ projects }: PlaygroundGalleryProps) {
  const tiles = getPlaygroundGalleryTileStates(projects)

  return (
    <section className="playground-gallery" aria-label={PLAYGROUND_GALLERY_LABEL}>
      <h1 className="sr-only">{PLAYGROUND_GALLERY_TITLE}</h1>

      <div className="playground-gallery-shell">
        <div className="playground-gallery-grid">
          {tiles.map(({ index, meta, priorityImage, project, variant }) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className={`playground-gallery-tile playground-gallery-tile-${variant} playground-gallery-project-${project.slug}`}
              aria-label={`Open ${meta.title}`}
            >
              <span className="playground-gallery-caption">
                <span>{meta.year}</span>
              </span>

              <span className="playground-gallery-media">
                <Image
                  src={project.frontmatter.image}
                  alt={`Preview of ${project.frontmatter.title}`}
                  fill
                  className="playground-gallery-image"
                  sizes="(max-width: 640px) calc((100vw - 3rem) / 2), (max-width: 1024px) calc((100vw - 5rem) / 2), 25vw"
                  priority={priorityImage}
                  loading={priorityImage ? 'eager' : 'lazy'}
                  fetchPriority={priorityImage ? 'high' : 'low'}
                  quality={90}
                />
              </span>

              <span className="playground-gallery-title">
                <span>{meta.title}</span>
                <span>{String(index + 1).padStart(2, '0')}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
