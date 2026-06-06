'use client'

import { memo, useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import TrackedExternalLink from '@/components/TrackedExternalLink'
import type { ProjectFrontmatter } from '@/types/project'
import { startProjectTransition } from '@/lib/project-transition'
import { useWebHaptics } from 'web-haptics/react'
import { showJoyToast } from '@/lib/joy'
import { analytics } from '@/lib/analytics'
import {
  PROJECT_CARD_PLACEHOLDER_SRC,
  activateProjectCard,
  getProjectCardActionState,
  getProjectCardAnimationDelay,
  getProjectCardDemoAriaLabel,
  getProjectCardDisplayState,
  getProjectCardImageAlt,
  getProjectCardImageFrameClassName,
  getProjectCardImageTransitionClassName,
  getProjectCardImageZoomStyle,
  getProjectCardTransitionRect,
} from '@/lib/project-card'

interface ProjectCardProps {
  slug: string
  frontmatter: ProjectFrontmatter
  index: number
  hideLiveBadge?: boolean
  hideLabel?: boolean
  priorityImage?: boolean
}

function ProjectCardComponent({ slug, frontmatter, index, hideLiveBadge, hideLabel, priorityImage }: ProjectCardProps) {
  const displayState = getProjectCardDisplayState({ frontmatter, hideLiveBadge, index, priorityImage })
  const actionState = getProjectCardActionState({ slug, displayTitle: displayState.displayTitle })
  const { href } = actionState
  const [imgSrc, setImgSrc] = useState(frontmatter.image)
  const [imgLoaded, setImgLoaded] = useState(displayState.shouldPrioritizeImage)
  const imageRef = useRef<HTMLDivElement>(null)
  const onLoad = useCallback(() => setImgLoaded(true), [])
  const haptic = useWebHaptics()

  const handleTransitionClick = useCallback(() => {
    const transitionRect = imageRef.current
      ? getProjectCardTransitionRect(imageRef.current.getBoundingClientRect())
      : undefined

    activateProjectCard({
      actionState,
      imageSrc: imgSrc,
      showToast: showJoyToast,
      startTransition: startProjectTransition,
      trackProjectClick: (slug, title) => analytics.projectClick(slug, title),
      transitionRect,
      triggerHaptic: (style) => haptic.trigger(style),
    })
  }, [actionState, imgSrc, haptic])

  return (
    <div className="relative">
      <Link href={href} onClick={handleTransitionClick} className="group block h-full w-full touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground">
          <div
            className="project-card relative isolate origin-center overflow-hidden text-card-foreground transition-[transform,box-shadow] duration-[400ms] ease-soft hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.96]"
            style={{
              animationDelay: getProjectCardAnimationDelay(index),
            }}
          >
            <div ref={imageRef} className={`relative overflow-hidden ${getProjectCardImageFrameClassName(hideLabel)}`}>
              {!imgLoaded && (
                <div className="absolute inset-0 animate-pulse bg-muted" />
              )}
              <div
                className="absolute inset-0 h-full w-full"
                style={getProjectCardImageZoomStyle(frontmatter.imageZoom)}
              >
                <Image
                  src={imgSrc}
                  alt={getProjectCardImageAlt(frontmatter)}
                  fill
                  className={getProjectCardImageTransitionClassName(index, imgLoaded)}
                  sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) calc((100vw - 5rem) / 2), 560px"
                  quality={80}
                  priority={displayState.shouldPrioritizeImage}
                  loading={displayState.imagePriorityProps.loading}
                  fetchPriority={displayState.imagePriorityProps.fetchPriority}
                  onLoad={onLoad}
                  onError={() => setImgSrc(PROJECT_CARD_PLACEHOLDER_SRC)}
                />
              </div>

              {frontmatter.video && (
                <video
                  src={frontmatter.video}
                  className="absolute inset-0 hidden h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-soft group-hover:opacity-100 sm:block"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/8 transition-opacity duration-500 ease-soft group-hover:opacity-70" />
            </div>

            {!hideLabel && (
              <div className="card-label-area relative z-[3] overflow-hidden px-4 pb-4 pt-4 sm:px-4 sm:pb-4 sm:pt-4" style={{ background: 'var(--card)' }}>
                <h3
                  className="relative z-10 block w-full truncate whitespace-nowrap text-[12px] font-semibold leading-tight tracking-[0.01em] text-foreground transition-colors duration-200"
                  title={displayState.displayTitle}
                >
                  {displayState.displayTitle}
                </h3>
                {displayState.categoryLabel && (
                  <span className="relative z-10 mt-2.5 inline-flex border border-border/60 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.08em] text-muted-foreground/70">
                    {displayState.categoryLabel}
                  </span>
                )}
              </div>
            )}
          </div>
      </Link>
      {displayState.demoHref && (
        <TrackedExternalLink
          href={displayState.demoHref}
          platform="demo"
          className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-0.5 text-[9px] font-medium tracking-[0.04em] text-primary shadow-card transition-[background-color,box-shadow] duration-200 hover:bg-background/95"
          aria-label={getProjectCardDemoAriaLabel(displayState.displayTitle)}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
            <span className="absolute inset-[-2px] rounded-full bg-emerald-400/20" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.5)]" />
          </span>
          Live
        </TrackedExternalLink>
      )}
    </div>
  )
}

const ProjectCard = memo(ProjectCardComponent)
ProjectCard.displayName = 'ProjectCard'

export default ProjectCard
