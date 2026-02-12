'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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

const CASE_STUDY_ORDER = [
  'brand-identity-system',
  'wander-utah',
  'porsche-app',
  'aol-redesign',
  'grand-teton-wallet',
  'nutricost',
] as const

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
  initialBlur: 'blur(1.8px)',
  finalBlur: 'blur(0px)',
  ease: MOTION_EASE_STANDARD,
}

const CARD_STAGGER_ITEM = {
  initialOpacity: 0,
  finalOpacity: 1,
  initialY: 16,
  finalY: 0,
}

const CARD_ANGLE = {
  layout: [-2.2, 0.1, 2.2, -1.6, 0, 1.6],
  hoverLiftY: -5,
  hoverRotationFactor: 0.35,
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
    <motion.div
      ref={gridRef}
      className="mx-auto grid w-full max-w-[780px] grid-cols-1 gap-x-6 gap-y-7 px-1 sm:grid-cols-2 sm:px-0 md:grid-cols-3"
      initial={{ opacity: CARD_STAGGER_PANEL.initialOpacity, y: CARD_STAGGER_PANEL.initialY }}
      animate={{
        opacity: stage >= 1 ? CARD_STAGGER_PANEL.finalOpacity : CARD_STAGGER_PANEL.initialOpacity,
        y: stage >= 1 ? CARD_STAGGER_PANEL.finalY : CARD_STAGGER_PANEL.initialY,
        filter: stage >= 1 ? CARD_STAGGER_PANEL.finalBlur : CARD_STAGGER_PANEL.initialBlur,
      }}
      transition={{
        duration: motionDurationMs(CARD_STAGGER_TIMING.panelDuration, prefersReducedMotion),
        ease: CARD_STAGGER_PANEL.ease,
      }}
    >
      {orderedProjects.map((project, index) => {
        const isFeaturedCard = project.slug === 'porsche-app'
        const baseRotation = CARD_ANGLE.layout[index % CARD_ANGLE.layout.length]
        const isHovered = hoveredIndex === index
        const hasHoverTarget = hoveredIndex !== null
        const rotation = isHovered ? baseRotation * CARD_ANGLE.hoverRotationFactor : baseRotation
        const translateY = isHovered ? CARD_ANGLE.hoverLiftY : 0

        return (
          <motion.div
            key={project.slug}
            className={`w-full transition-[transform,opacity,filter] duration-[430ms] ${isFeaturedCard ? 'md:-translate-y-1 md:scale-[1.03]' : ''}`}
            style={{
              transform: `translateY(${translateY}px) rotate(${rotation}deg)`,
              opacity: !supportsHover || !hasHoverTarget || isHovered ? 1 : 0.9,
              filter: !supportsHover || !hasHoverTarget || isHovered ? 'saturate(1)' : 'saturate(0.92)',
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
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
            <Magnetic className="will-change-transform" strength={0.28} range={130} onlyOnHover disableOnTouch>
              {project.frontmatter?.image ? (
                <ProjectCard
                  slug={project.slug}
                  frontmatter={project.frontmatter}
                  index={index}
                  isFeatured={isFeaturedCard}
                />
              ) : (
                <div className="aspect-[16/9] w-full rounded-[14px]">
                  <Skeleton className="h-full w-full rounded-[14px]" />
                </div>
              )}
            </Magnetic>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
