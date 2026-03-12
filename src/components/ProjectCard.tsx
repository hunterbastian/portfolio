'use client'

import { memo, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ProjectFrontmatter } from '@/types/project'

interface ProjectCardProps {
  slug: string
  frontmatter: ProjectFrontmatter
  index: number
}

function ProjectCardComponent({ slug, frontmatter, index }: ProjectCardProps) {
  const [imgSrc, setImgSrc] = useState(frontmatter.image)
  const [imgLoaded, setImgLoaded] = useState(false)
  const displayTitle = frontmatter.displayTitle ?? frontmatter.title
  const onLoad = useCallback(() => setImgLoaded(true), [])

  return (
    <Link href={`/projects/${slug}`} className="group block h-full w-full">
      <div
        className="project-card relative isolate overflow-hidden rounded-md border text-card-foreground transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.998] touch-manipulation shadow-sm hover:-translate-y-0.5 hover:shadow-md will-change-transform"
        style={{
          animationDelay: `${index * 80}ms`,
        }}
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-muted" />
          )}
          <Image
            src={imgSrc}
            alt={frontmatter.title}
            fill
            className={`object-cover transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) calc((100vw - 5rem) / 2), 300px"
            priority={index === 0}
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'low'}
            onLoad={onLoad}
            onError={() => setImgSrc('/images/placeholder.svg')}
          />

          {frontmatter.video && (
            <video
              src={frontmatter.video}
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
              autoPlay
              loop
              muted
              playsInline
              preload="none"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/16 opacity-55 transition-opacity duration-500 ease-out group-hover:opacity-70" />
        </div>

        <div className="border-t border-border/20 px-3.5 pb-3 pt-2.5" style={{ background: 'var(--card)' }}>
          <h3
            className="block w-full truncate whitespace-nowrap font-medium leading-tight text-foreground transition-colors duration-200 group-hover:text-foreground/80"
            style={{ fontSize: '13px' }}
            title={displayTitle}
          >
            {displayTitle}
          </h3>
        </div>
      </div>
    </Link>
  )
}

const ProjectCard = memo(ProjectCardComponent)
ProjectCard.displayName = 'ProjectCard'

export default ProjectCard
