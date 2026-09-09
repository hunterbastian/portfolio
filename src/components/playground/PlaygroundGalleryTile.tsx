'use client'

import Image from 'next/image'
import { useSyncExternalStore } from 'react'
import MorphLink from '@/components/MorphLink'
import type { PlaygroundGalleryTileVariant } from '@/lib/playground'
import {
  getProjectMorphProps,
  getProjectMorphServerSnapshot,
  getProjectMorphSlug,
  subscribeProjectMorph,
} from '@/lib/view-transition'

interface PlaygroundGalleryTileProps {
  image: string
  /** The project's own title, which the alt text describes rather than the display label. */
  imageTitle: string
  index: number
  priorityImage: boolean
  slug: string
  title: string
  variant: PlaygroundGalleryTileVariant
  year: string
}

/**
 * Takes primitive props rather than the whole project so the gallery can stay a
 * server component — the archive entries carry their MDX source, which has no
 * business crossing into the client bundle just to render a thumbnail.
 */
export default function PlaygroundGalleryTile({
  image,
  imageTitle,
  index,
  priorityImage,
  slug,
  title,
  variant,
  year,
}: PlaygroundGalleryTileProps) {
  const morphSlug = useSyncExternalStore(
    subscribeProjectMorph,
    getProjectMorphSlug,
    getProjectMorphServerSnapshot,
  )

  return (
    <MorphLink
      href={`/projects/${slug}`}
      slug={slug}
      className={`playground-gallery-tile playground-gallery-tile-${variant} playground-gallery-project-${slug}`}
      aria-label={`Open ${title}`}
    >
      <span className="playground-gallery-caption">
        <span>{year}</span>
      </span>

      {/* The photo carries the morph, not the tile, so the browser chrome and
          captions around it are free to crossfade with the rest of the page. */}
      <span className="playground-gallery-media" {...getProjectMorphProps(slug, morphSlug)}>
        <Image
          src={image}
          alt={`Preview of ${imageTitle}`}
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
        <span>{title}</span>
        <span>{String(index + 1).padStart(2, '0')}</span>
      </span>
    </MorphLink>
  )
}
