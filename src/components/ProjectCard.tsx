'use client'

import { memo, useState, useCallback, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ProjectFrontmatter } from '@/types/project'
import { startProjectTransition } from '@/lib/project-transition'
import { useWebHaptics } from 'web-haptics/react'
import { useSound } from '@/lib/sounds/context'

interface ProjectCardProps {
  slug: string
  frontmatter: ProjectFrontmatter
  index: number
  hideLiveBadge?: boolean
  hideLabel?: boolean
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

function ProjectCardComponent({ slug, frontmatter, index, hideLiveBadge, hideLabel }: ProjectCardProps) {
  const [imgSrc, setImgSrc] = useState(frontmatter.image)
  const [imgLoaded, setImgLoaded] = useState(index === 0)
  const imageRef = useRef<HTMLDivElement>(null)
  const displayTitle = frontmatter.displayTitle ?? frontmatter.title
  const categoryLabel = formatCategoryLabel(frontmatter.category)
  const onLoad = useCallback(() => setImgLoaded(true), [])
  const haptic = useWebHaptics()
  const { play } = useSound()
  const [canHover, setCanHover] = useState(false)

  // Only enable hover sounds on devices that support fine pointer (desktop)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover)')
    setCanHover(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setCanHover(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const handleTransitionClick = useCallback(() => {
    haptic.trigger('medium')
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect()
      startProjectTransition(slug, imgSrc, {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      })
    }
  }, [slug, imgSrc, haptic])

  return (
    <div className="relative">
      <Link href={`/projects/${slug}`} onClick={handleTransitionClick} onMouseEnter={() => { if (canHover) play('tone') }} className={`group block h-full w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${hideLabel ? 'rounded-[10px]' : 'rounded-[8px]'}`}>
          <div
            className={`project-card relative isolate overflow-hidden text-card-foreground transition-[transform,box-shadow] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.998] touch-manipulation hover:-translate-y-0.5 will-change-transform ${hideLabel ? 'rounded-[10px]' : 'rounded-[8px]'}`}
            style={{
              animationDelay: `${index * 80}ms`,
            }}
          >
            <div ref={imageRef} className={`relative overflow-hidden ${hideLabel ? 'aspect-square' : 'aspect-[16/9] img-inset-outline'}`}>
              {!imgLoaded && (
                <div className="absolute inset-0 animate-pulse bg-muted" />
              )}
              <div
                className="absolute inset-0"
                style={frontmatter.imageZoom ? { transform: `scale(${frontmatter.imageZoom})` } : undefined}
              >
                <Image
                  src={imgSrc}
                  alt={`Preview of ${frontmatter.title}`}
                  fill
                  className={`object-cover ${index === 0 ? 'transition-[transform,filter]' : 'transition-[transform,opacity,filter]'} duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.015] group-hover:saturate-[0.96] ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                  sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) calc((100vw - 5rem) / 2), 560px"
                  quality={80}
                  priority={index === 0}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'low'}
                  onLoad={onLoad}
                  onError={() => setImgSrc('/images/placeholder.svg')}
                />
              </div>

              {frontmatter.video && (
                <video
                  src={frontmatter.video}
                  className="absolute inset-0 hidden h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 sm:block"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/8 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-70" />
            </div>

            {!hideLabel && (
              <div className="card-label-area relative z-[3] overflow-hidden px-4 pb-4 pt-4 sm:px-4 sm:pb-4 sm:pt-4" style={{ background: 'var(--card)' }}>
                <h3
                  className="relative z-10 block w-full truncate whitespace-nowrap text-[12px] font-semibold leading-tight tracking-[0.01em] text-foreground transition-colors duration-200 sm:text-[13px]"
                  title={displayTitle}
                >
                  {displayTitle}
                </h3>
                {categoryLabel && (
                  <span className="relative z-10 mt-2.5 inline-flex rounded-[3px] border border-border/60 px-1.5 py-0.5 font-mono text-[8px] tracking-[0.1em] text-muted-foreground/62">
                    {categoryLabel}
                  </span>
                )}
              </div>
            )}
          </div>
      </Link>
      {frontmatter.demo && !hideLiveBadge && (
        <a
          href={frontmatter.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 rounded-[3px] bg-background/80 backdrop-blur-sm px-2 py-0.5 text-[9px] font-medium tracking-[0.04em] text-primary shadow-card transition-[background-color,box-shadow] duration-200 hover:bg-background/95"
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
