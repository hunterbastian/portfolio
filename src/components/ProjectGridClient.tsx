'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { m, useInView, useReducedMotion } from 'framer-motion'
import ProjectCard from '@/components/ProjectCard'
import { Skeleton } from '@/components/ui/skeleton'
import { ProjectFrontmatter } from '@/types/project'
import { MOTION_EASE_SOFT, motionDelayMs, motionDurationMs } from '@/lib/motion'

interface Project {
  slug: string
  frontmatter: ProjectFrontmatter
}

interface ProjectGridClientProps {
  projects: Project[]
  initialLoadDelayMs?: number
}

const CASE_STUDY_ORDER = [
  'lumo',
  'ai-project',
  'wander-utah',
  'brand-identity-system',
  'porsche-app',
  'aol-redesign',
  'grand-teton-wallet',
  'nutricost',
] as const

const CARD_STAGGER_TIMING = {
  panelAppear: 90,      // panel starts appearing
  cardsAppear: 220,     // cards begin staggered reveal
  panelDuration: 360,   // panel fade-in
  cardDuration: 400,    // each card transitions smoothly
  cardStagger: 75,      // wider gap between cards
}

const CARD_STAGGER_PANEL = {
  initialOpacity: 0,
  finalOpacity: 1,
  initialY: 12,         // more travel distance
  finalY: 0,
  ease: MOTION_EASE_SOFT,
}

const CARD_STAGGER_ITEM = {
  initialOpacity: 0,
  finalOpacity: 1,
  initialY: 12,
  finalY: 0,
}

const GRID_COLUMN_GAP = 28
const GRID_ROW_GAP = 32
const HOVER_DIM_OPACITY = 0.88
const HOVER_Z_OFFSET = 20

function GridCardSkeleton() {
  return (
    <div className="aspect-[16/9] w-full rounded-[8px]">
      <Skeleton className="h-full w-full rounded-[8px]" />
    </div>
  )
}

export default function ProjectGridClient({ projects, initialLoadDelayMs = 0 }: ProjectGridClientProps) {
  const [stage, setStage] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [supportsHover, setSupportsHover] = useState(false)

  const router = useRouter()
  const prefersReducedMotion = useReducedMotion() ?? false
  const gridRef = useRef<HTMLDivElement>(null)
  const hasPlayedEntranceRef = useRef(false)
  const isGridInView = useInView(gridRef, { once: true, amount: 0.16 })
  const prefetchedSlugsRef = useRef(new Set<string>())

  const orderedProjects = useMemo(() => {
    const orderIndex = new Map<string, number>(CASE_STUDY_ORDER.map((slug, index) => [slug, index]))

    return [...projects].sort((a, b) => {
      const aIndex = orderIndex.get(a.slug)
      const bIndex = orderIndex.get(b.slug)

      if (aIndex != null && bIndex != null) {
        return aIndex - bIndex
      }
      if (aIndex != null) {
        return -1
      }
      if (bIndex != null) {
        return 1
      }

      return 0
    })
  }, [projects])
  const prefetchProject = useCallback((slug: string) => {
    if (prefetchedSlugsRef.current.has(slug)) {
      return
    }

    prefetchedSlugsRef.current.add(slug)
    router.prefetch(`/projects/${slug}`)
  }, [router])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const updateSupportsHover = () => setSupportsHover(mediaQuery.matches)

    updateSupportsHover()
    mediaQuery.addEventListener('change', updateSupportsHover)

    return () => mediaQuery.removeEventListener('change', updateSupportsHover)
  }, [])

  useEffect(() => {
    if (!isGridInView) {
      setStage(0)
      return
    }

    if (prefersReducedMotion) {
      setStage(2)
      hasPlayedEntranceRef.current = true
      return
    }

    const initialDelay = hasPlayedEntranceRef.current ? 0 : initialLoadDelayMs
    setStage(0)
    const timers: Array<ReturnType<typeof setTimeout>> = []
    timers.push(setTimeout(() => setStage(1), initialDelay + CARD_STAGGER_TIMING.panelAppear))
    timers.push(
      setTimeout(() => {
        setStage(2)
        hasPlayedEntranceRef.current = true
      }, initialDelay + CARD_STAGGER_TIMING.cardsAppear)
    )

    return () => timers.forEach(clearTimeout)
  }, [initialLoadDelayMs, isGridInView, prefersReducedMotion])

  return (
    <m.div
      ref={gridRef}
      className="mx-auto grid w-full max-w-[980px] grid-cols-1 gap-5 px-0 sm:grid-cols-2 sm:gap-0 sm:px-0"
      onMouseLeave={() => supportsHover && setHoveredIndex(null)}
      initial={{ opacity: CARD_STAGGER_PANEL.finalOpacity, y: CARD_STAGGER_PANEL.finalY }}
      animate={{
        opacity: CARD_STAGGER_PANEL.finalOpacity,
        y: CARD_STAGGER_PANEL.finalY,
        columnGap: GRID_COLUMN_GAP,
        rowGap: GRID_ROW_GAP,
      }}
      transition={{
        opacity: {
          duration: motionDurationMs(CARD_STAGGER_TIMING.panelDuration, prefersReducedMotion),
          ease: CARD_STAGGER_PANEL.ease,
        },
        y: {
          duration: motionDurationMs(CARD_STAGGER_TIMING.panelDuration, prefersReducedMotion),
          ease: CARD_STAGGER_PANEL.ease,
        },
        columnGap: {
          duration: motionDurationMs(CARD_STAGGER_TIMING.panelDuration, prefersReducedMotion),
          ease: CARD_STAGGER_PANEL.ease,
        },
        rowGap: {
          duration: motionDurationMs(CARD_STAGGER_TIMING.panelDuration, prefersReducedMotion),
          ease: CARD_STAGGER_PANEL.ease,
        },
      }}
    >
      {orderedProjects.map((project, index) => {
        const isHovered = hoveredIndex === index
        const hasHoverTarget = hoveredIndex !== null
        const cardOpacity = !supportsHover || !hasHoverTarget || isHovered ? 1 : HOVER_DIM_OPACITY
        const stackZIndex = index + 1

        // First card renders as plain div for instant LCP paint (no Framer Motion hydration delay)
        if (index === 0) {
          return (
            <div
              key={project.slug}
              className="w-full transition-[transform,opacity] duration-[550ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                zIndex: isHovered ? orderedProjects.length + HOVER_Z_OFFSET : stackZIndex,
                opacity: cardOpacity,
              }}
              onMouseEnter={() => {
                prefetchProject(project.slug)
                if (supportsHover) {
                  setHoveredIndex(index)
                }
              }}
              onMouseLeave={() => {
                if (supportsHover) {
                  setHoveredIndex(null)
                }
              }}
            >
              {project.frontmatter?.image ? (
                <ProjectCard slug={project.slug} frontmatter={project.frontmatter} index={index} />
              ) : (
                <GridCardSkeleton />
              )}
            </div>
          )
        }

        return (
          <m.div
            key={project.slug}
            className="w-full transition-[transform,opacity] duration-[550ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              zIndex: isHovered ? orderedProjects.length + HOVER_Z_OFFSET : stackZIndex,
            }}
            onMouseEnter={() => {
              prefetchProject(project.slug)
              if (supportsHover) {
                setHoveredIndex(index)
              }
            }}
            onMouseLeave={() => {
              if (supportsHover) {
                setHoveredIndex(null)
              }
            }}
            initial={{
              opacity: CARD_STAGGER_ITEM.initialOpacity,
              y: CARD_STAGGER_ITEM.initialY,
            }}
            animate={{
              opacity: stage >= 2 ? cardOpacity : CARD_STAGGER_ITEM.initialOpacity,
              y: stage >= 2 ? CARD_STAGGER_ITEM.finalY : CARD_STAGGER_ITEM.initialY,
            }}
            transition={{
              opacity: {
                duration: motionDurationMs(CARD_STAGGER_TIMING.cardDuration, prefersReducedMotion),
                delay: stage >= 2 ? motionDelayMs(index * CARD_STAGGER_TIMING.cardStagger, prefersReducedMotion) : 0,
                ease: CARD_STAGGER_PANEL.ease,
              },
              y: {
                duration: motionDurationMs(CARD_STAGGER_TIMING.cardDuration, prefersReducedMotion),
                delay: stage >= 2 ? motionDelayMs(index * CARD_STAGGER_TIMING.cardStagger, prefersReducedMotion) : 0,
                ease: CARD_STAGGER_PANEL.ease,
              },
            }}
          >
            {project.frontmatter?.image ? (
              <ProjectCard slug={project.slug} frontmatter={project.frontmatter} index={index} />
            ) : (
              <GridCardSkeleton />
            )}
          </m.div>
        )
      })}
    </m.div>
  )
}
