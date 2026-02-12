'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import ProjectCard from '@/components/ProjectCard'
import { Skeleton } from '@/components/ui/skeleton'
import { ProjectFrontmatter } from '@/types/project'
import { Magnetic } from '@/components/animate-ui/primitives/effects/magnetic'
import { MOTION_EASE_STANDARD, motionDelayMs, motionDurationMs } from '@/lib/motion'

interface Project {
  slug: string
  frontmatter: ProjectFrontmatter
}

interface ProjectGridClientProps {
  projects: Project[]
  initialLoadDelayMs?: number
}

const CARD_STAGGER_TIMING = {
  panelAppear: 120,
  cardsAppear: 280,
  panelDuration: 380,
  cardDuration: 420,
  cardStagger: 90,
}

const CARD_STAGGER_PANEL = {
  initialOpacity: 0,
  finalOpacity: 1,
  initialY: 14,
  finalY: 0,
  ease: MOTION_EASE_STANDARD,
}

const CARD_STAGGER_ITEM = {
  initialOpacity: 0,
  finalOpacity: 1,
  initialY: 16,
  finalY: 0,
}

const CARD_ANGLE = {
  layout: [-2.8, -0.4, 4.2, -2.6, 0.2, 2.4], // closer to the original "angled board" composition
  hoverLiftY: -4, // hover lift in px
  hoverRotationFactor: 0.2, // retain a hint of card angle on hover
}

export default function ProjectGridClient({ projects, initialLoadDelayMs = 0 }: ProjectGridClientProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [stage, setStage] = useState(0)
  const [supportsHover, setSupportsHover] = useState(false)
  const router = useRouter()
  const prefersReducedMotion = useReducedMotion() ?? false
  const gridRef = useRef<HTMLDivElement>(null)
  const hasPlayedEntranceRef = useRef(false)
  const isGridInView = useInView(gridRef, { once: true, amount: 0.16 })
  const prefetchedSlugsRef = useRef(new Set<string>())
  const hoverClearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const prefetchProject = useCallback((slug: string) => {
    if (prefetchedSlugsRef.current.has(slug)) {
      return
    }

    prefetchedSlugsRef.current.add(slug)
    router.prefetch(`/projects/${slug}`)
  }, [router])
  
  // Keep startup prefetch light, then prefetch remaining projects based on user intent.
  useEffect(() => {
    if (typeof window === 'undefined') return

    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string }
    }).connection
    const hasConstrainedNetwork =
      connection?.saveData === true || connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g'

    if (hasConstrainedNetwork) {
      return
    }

    const initialProjects = projects.slice(0, 2)

    const requestIdle = (window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
    }).requestIdleCallback
    const cancelIdle = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback

    let idleId: number | null = null
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const runPrefetch = () => {
      initialProjects.forEach((project) => prefetchProject(project.slug))
    }

    if (requestIdle) {
      idleId = requestIdle(runPrefetch, { timeout: 1500 })
    } else {
      timeoutId = setTimeout(runPrefetch, 600)
    }

    return () => {
      if (cancelIdle && idleId !== null) {
        cancelIdle(idleId)
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
      }
    }
  }, [prefetchProject, projects])

  useEffect(() => {
    return () => {
      if (hoverClearTimeoutRef.current !== null) {
        clearTimeout(hoverClearTimeoutRef.current)
      }
    }
  }, [])

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

  const cancelHoverClear = () => {
    if (hoverClearTimeoutRef.current !== null) {
      clearTimeout(hoverClearTimeoutRef.current)
      hoverClearTimeoutRef.current = null
    }
  }

  const handleMouseEnter = (index: number) => {
    if (!supportsHover) {
      return
    }

    cancelHoverClear()
    setHoveredIndex((previous) => (previous === index ? previous : index))
    const hoveredProject = projects[index]
    if (hoveredProject) {
      prefetchProject(hoveredProject.slug)
    }
  }

  const handleMouseLeave = () => {
    if (!supportsHover) {
      return
    }

    cancelHoverClear()

    // Small delay avoids a visual snap when moving between cards across grid gaps.
    hoverClearTimeoutRef.current = setTimeout(() => {
      setHoveredIndex(null)
      hoverClearTimeoutRef.current = null
    }, 80)
  }

  return (
    <motion.div
      ref={gridRef}
      className="mx-auto grid w-full max-w-[900px] grid-cols-1 gap-x-5 gap-y-7 px-2 sm:grid-cols-2 sm:px-4 lg:grid-cols-3 lg:px-0"
      initial={{ opacity: CARD_STAGGER_PANEL.initialOpacity, y: CARD_STAGGER_PANEL.initialY }}
      animate={{
        opacity: stage >= 1 ? CARD_STAGGER_PANEL.finalOpacity : CARD_STAGGER_PANEL.initialOpacity,
        y: stage >= 1 ? CARD_STAGGER_PANEL.finalY : CARD_STAGGER_PANEL.initialY,
      }}
      transition={{
        duration: motionDurationMs(CARD_STAGGER_TIMING.panelDuration, prefersReducedMotion),
        ease: CARD_STAGGER_PANEL.ease,
      }}
    >
      {projects.map((project, index) => {
        const isHovered = hoveredIndex === index
        const baseRotation = CARD_ANGLE.layout[index % CARD_ANGLE.layout.length]
        const cardOpacity = hoveredIndex === null || isHovered ? 1 : 0.9

        return (
          <motion.div
            key={project.slug}
            className="w-full transition-[transform,opacity,filter]"
            style={{
              transform: isHovered
                ? `translateY(${CARD_ANGLE.hoverLiftY}px) rotate(${(baseRotation * CARD_ANGLE.hoverRotationFactor).toFixed(2)}deg)`
                : `translateY(0px) rotate(${baseRotation}deg)`,
              opacity: cardOpacity,
              filter: hoveredIndex === null || isHovered ? 'saturate(1)' : 'saturate(0.92)',
              transitionDuration: '360ms',
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: CARD_STAGGER_ITEM.initialOpacity, y: CARD_STAGGER_ITEM.initialY }}
            animate={{
              opacity: stage >= 2 ? CARD_STAGGER_ITEM.finalOpacity : CARD_STAGGER_ITEM.initialOpacity,
              y: stage >= 2 ? CARD_STAGGER_ITEM.finalY : CARD_STAGGER_ITEM.initialY,
            }}
            transition={{
              duration: motionDurationMs(CARD_STAGGER_TIMING.cardDuration, prefersReducedMotion),
              delay: stage >= 2 ? motionDelayMs(index * CARD_STAGGER_TIMING.cardStagger, prefersReducedMotion) : 0,
              ease: CARD_STAGGER_PANEL.ease,
            }}
          >
            <Magnetic
              className="will-change-transform"
              strength={0.4}
              range={120}
              onlyOnHover
              disableOnTouch
            >
              {project.frontmatter?.image ? (
                <ProjectCard
                  slug={project.slug}
                  frontmatter={project.frontmatter}
                  index={index}
                />
              ) : (
                <div className="aspect-[4/3] w-full">
                  <Skeleton className="h-full w-full rounded-[20px]" />
                </div>
              )}
            </Magnetic>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
