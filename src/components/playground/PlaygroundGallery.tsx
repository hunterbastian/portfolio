import { EditorialProjectCard } from '@/components/home/EditorialProjectCard'
import { PLAYGROUND_GALLERY_LABEL } from '@/lib/playground'
import type { Project } from '@/types/project'

export default function PlaygroundGallery({ projects }: { projects: Project[] }) {
  return (
    <section aria-label={PLAYGROUND_GALLERY_LABEL}>
      <header className="editorial-page-heading">
        <p className="editorial-eyebrow">An ongoing collection</p>
        <h1>Playground</h1>
        <p>Experiments in identity, image, and interaction.</p>
      </header>
      <div className="editorial-project-grid editorial-play-grid">
        {projects.map((project) => <EditorialProjectCard key={project.slug} project={project} compact />)}
      </div>
    </section>
  )
}
