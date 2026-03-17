'use client'

import { memo, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ProjectFrontmatter } from '@/types/project'

interface ProjectCardProps {
  slug: string
  frontmatter: ProjectFrontmatter
  index: number
  hideLiveBadge?: boolean
}

function formatCategoryLabel(category?: string): string {
  if (!category) return ''
  const map: Record<string, string> = {
    'Mobile Design': 'UX/UI, MOBILE',
    'Web Design': 'UX/UI, WEB',
    'Product Design': 'UX/UI, PRODUCT',
    'UI and Web Design': 'UX/UI, WEB',
    'Graphic Design': 'GRAPHIC DESIGN',
    'Brand Identity': 'BRAND IDENTITY',
    'Creative Coding': 'CREATIVE CODING',
    'Photography': 'PHOTOGRAPHY',
    'AI': 'AI',
  }
  return map[category] ?? category.toUpperCase()
}

function formatCardDate(dateValue?: string): string {
  if (!dateValue) return ''
  const d = new Date(dateValue)
  if (Number.isNaN(d.getTime())) return dateValue
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(d)
}

function ProjectCardComponent({ slug, frontmatter, index, hideLiveBadge }: ProjectCardProps) {
  const [imgSrc, setImgSrc] = useState(frontmatter.image)
  const [imgLoaded, setImgLoaded] = useState(index === 0)
  const displayTitle = frontmatter.displayTitle ?? frontmatter.title
  const formattedDate = formatCardDate(frontmatter.date)
  const categoryLabel = formatCategoryLabel(frontmatter.category)
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
            {categoryLabel && (
              <p className="mt-1 font-mono text-[9px] tracking-[0.06em] text-muted-foreground/70">
                [{categoryLabel}]
              </p>
            )}
          </div>
        </div>
      </Link>
      {frontmatter.demo && !hideLiveBadge && (
        <a
          href={frontmatter.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 rounded-[3px] bg-background/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium tracking-[0.04em] text-primary transition-[background-color,box-shadow] duration-200 hover:bg-background/95"
          style={{ boxShadow: '0px 0px 0px 1px rgba(0,0,0,0.06), 0px 1px 2px -1px rgba(0,0,0,0.06), 0px 2px 4px 0px rgba(0,0,0,0.04)' }}
          aria-label={`Live demo for ${displayTitle}`}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
            <span className="absolute inset-[-2px] rounded-full bg-emerald-400/20" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.5)]" />
          </span>
          Live
        </a>
      )}
    </div>
  )
}

const ProjectCard = memo(ProjectCardComponent)
ProjectCard.displayName = 'ProjectCard'

export default ProjectCard
