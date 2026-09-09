import PlaygroundGalleryTile from '@/components/playground/PlaygroundGalleryTile'
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
            <PlaygroundGalleryTile
              key={project.slug}
              image={project.frontmatter.image}
              imageTitle={project.frontmatter.title}
              index={index}
              priorityImage={priorityImage}
              slug={project.slug}
              title={meta.title}
              variant={variant}
              year={meta.year}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
