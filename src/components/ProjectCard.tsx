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

function formatCardDate(dateValue?: string): string {
  if (!dateValue) return ''
  const d = new Date(dateValue)
  if (Number.isNaN(d.getTime())) return dateValue
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(d)
}

function ProjectCardComponent({ slug, frontmatter, index }: ProjectCardProps) {
  const [imgSrc, setImgSrc] = useState(frontmatter.image)
  const [imgLoaded, setImgLoaded] = useState(index === 0)
  const displayTitle = frontmatter.displayTitle ?? frontmatter.title
  const formattedDate = formatCardDate(frontmatter.date)
  const onLoad = useCallback(() => setImgLoaded(true), [])

  return (
    <div className="relative">
      <Link href={`/projects/${slug}`} className="group block h-full w-full">
        <div
          className="project-card relative isolate overflow-hidden rounded-[3px] text-card-foreground transition-[transform,box-shadow] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.998] touch-manipulation hover:-translate-y-1 will-change-transform"
          style={{
            animationDelay: `${index * 80}ms`,
          }}
        >
          <div className="relative aspect-[16/9] overflow-hidden img-inset-outline">
            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse bg-muted" />
            )}
            <Image
              src={imgSrc}
              alt={frontmatter.title}
              fill
              className={`object-cover ${index === 0 ? 'transition-transform' : 'transition-[transform,opacity]'} duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={frontmatter.imageZoom ? { objectPosition: 'center', scale: `${frontmatter.imageZoom}` } : undefined}
              sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) calc((100vw - 5rem) / 2), 560px"
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

          <div className="px-3.5 pb-3 pt-2.5" style={{ background: 'var(--card)' }}>
            <h3
              className="block w-full truncate whitespace-nowrap font-medium leading-tight text-foreground transition-colors duration-200 group-hover:text-foreground/80"
              style={{ fontSize: '13px' }}
              title={displayTitle}
            >
              {displayTitle}
            </h3>
            {formattedDate && (
              <p className="mt-0.5 font-mono text-[10px] tracking-[0.04em] text-muted-foreground tabular-nums">
                {formattedDate}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

const ProjectCard = memo(ProjectCardComponent)
ProjectCard.displayName = 'ProjectCard'

export default ProjectCard
