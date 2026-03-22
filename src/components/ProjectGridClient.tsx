'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { m, useInView, useReducedMotion } from 'framer-motion'
import ProjectCard from '@/components/ProjectCard'
import { Skeleton } from '@/components/ui/skeleton'
import { ProjectFrontmatter } from '@/types/project'
import { Magnetic } from '@/components/animate-ui/primitives/effects/magnetic'
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

interface CardLayoutAngle {
  rotate: number
  x: number
}

const CARD_DEFAULT_LAYOUT: CardLayoutAngle = { rotate: -1.6, x: -2 }
type StackPriority = 'default' | 'center' | 'left' | 'right'

interface CaseStudyDialState {
  pile: {
    compactSpreadFactor: number
    compactScale: number
    compactGapX: number
    compactGapY: number
    stackPriority: StackPriority
  }
  expanded: {
    gapX: number
    gapY: number
    scale: number
  }
  motion: {
    expandMs: number
    collapseMs: number
  }
  hover: {
    inactiveOpacity: number
  }
}

const CASE_STUDY_DIAL_DEFAULTS: CaseStudyDialState = {
  pile: {
    compactSpreadFactor: -0.12,
    compactScale: 0.9,
    compactGapX: -8,
    compactGapY: -2,
    stackPriority: 'default',
  },
  expanded: {
    gapX: 20,
    gapY: 24,
    scale: 1,
  },
  motion: {
    expandMs: 380,
    collapseMs: 340,
  },
  hover: {
    inactiveOpacity: 0.88,
  },
}

function getStackPriorityZIndex(index: number, total: number, stackPriority: StackPriority): number {
  if (stackPriority === 'center') {
    const center = (total - 1) / 2
    return Math.round(total - Math.abs(index - center) * 2)
  }

  if (stackPriority === 'left') {
    return total - index
  }

  if (stackPriority === 'right') {
    return index + 1
  }

  return index + 1
}

const CARD_LAYOUT_BY_SLUG: Record<string, CardLayoutAngle> = {
  'brand-identity-system': { rotate: -6.2, x: -14 },
  'aol-redesign': { rotate: -5.4, x: -11 },
  'porsche-app': { rotate: 6.2, x: 14 },
  'wander-utah': { rotate: 0, x: 0 },
  'grand-teton-wallet': { rotate: 0, x: 0 },
  nutricost: { rotate: -2.8, x: -5 },
}

const MOBILE_TILT_FACTOR = 0.48

export default function ProjectGridClient({ projects, initialLoadDelayMs = 0 }: ProjectGridClientProps) {
  const [stage, setStage] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isGridHovered, setIsGridHovered] = useState(false)
  const [supportsHover, setSupportsHover] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.matchMedia('(hover: hover) and (pointer: fine)').matches
  })

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

  const caseStudyDial = CASE_STUDY_DIAL_DEFAULTS

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

  const isExpandedLayout = !supportsHover || isGridHovered
  const layoutTransitionDuration = isExpandedLayout ? caseStudyDial.motion.expandMs : caseStudyDial.motion.collapseMs
  const layoutSpreadFactor = isExpandedLayout ? 1 : caseStudyDial.pile.compactSpreadFactor
  const gridColumnGap = isExpandedLayout ? caseStudyDial.expanded.gapX : caseStudyDial.pile.compactGapX
  const gridRowGap = isExpandedLayout ? caseStudyDial.expanded.gapY : caseStudyDial.pile.compactGapY

  return (
    <m.div
      ref={gridRef}
      className="mx-auto grid w-full max-w-[780px] grid-cols-1 px-1 sm:grid-cols-2 sm:px-0"
      onMouseEnter={() => {
        if (supportsHover) {
          setIsGridHovered(true)
        }
      }}
      onMouseLeave={() => {
        if (supportsHover) {
          setIsGridHovered(false)
          setHoveredIndex(null)
        }
      }}
      initial={{ opacity: CARD_STAGGER_PANEL.finalOpacity, y: CARD_STAGGER_PANEL.finalY }}
      animate={{
        opacity: CARD_STAGGER_PANEL.finalOpacity,
        y: CARD_STAGGER_PANEL.finalY,
        columnGap: gridColumnGap,
        rowGap: gridRowGap,
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
          duration: motionDurationMs(layoutTransitionDuration, prefersReducedMotion),
          ease: CARD_STAGGER_PANEL.ease,
        },
        rowGap: {
          duration: motionDurationMs(layoutTransitionDuration, prefersReducedMotion),
          ease: CARD_STAGGER_PANEL.ease,
        },
      }}
    >
      {orderedProjects.map((project, index) => {
        const baseAngle = CARD_LAYOUT_BY_SLUG[project.slug] ?? CARD_DEFAULT_LAYOUT

        const compactX = baseAngle.x * caseStudyDial.pile.compactSpreadFactor
        const compactRotate = baseAngle.rotate * caseStudyDial.pile.compactSpreadFactor
        const mobileDampen = supportsHover ? 1 : MOBILE_TILT_FACTOR
        const targetX = baseAngle.x * layoutSpreadFactor * mobileDampen
        const targetRotate = baseAngle.rotate * layoutSpreadFactor * mobileDampen
        const targetScale = isExpandedLayout ? caseStudyDial.expanded.scale : caseStudyDial.pile.compactScale
        const isHovered = hoveredIndex === index
        const hasHoverTarget = hoveredIndex !== null
        const cardOpacity = !supportsHover || !hasHoverTarget || isHovered ? 1 : caseStudyDial.hover.inactiveOpacity
        const stackZIndex = getStackPriorityZIndex(index, orderedProjects.length, caseStudyDial.pile.stackPriority)

        // First card renders as plain div for instant LCP paint (no Framer Motion hydration delay)
        if (index === 0) {
          return (
            <div
              key={project.slug}
              className="w-full transition-[transform,opacity] duration-[550ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                zIndex: isHovered ? orderedProjects.length + 20 : stackZIndex,
                opacity: cardOpacity,
                transform: `translateX(${targetX}px) rotate(${targetRotate}deg) scale(${targetScale})`,
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
              <Magnetic strength={0.28} range={130} onlyOnHover disableOnTouch>
                {project.frontmatter?.image ? (
                  <ProjectCard slug={project.slug} frontmatter={project.frontmatter} index={index} />
                ) : (
                  <div className="aspect-[16/9] w-full rounded-xl">
                    <Skeleton className="h-full w-full rounded-xl" />
                  </div>
                )}
              </Magnetic>
            </div>
          )
        }

        return (
          <m.div
            key={project.slug}
            className="w-full transition-[transform,opacity] duration-[550ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              zIndex: isHovered ? orderedProjects.length + 20 : stackZIndex,
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
              x: compactX,
              rotate: compactRotate,
              scale: caseStudyDial.pile.compactScale,
            }}
            animate={{
              opacity: stage >= 2 ? cardOpacity : CARD_STAGGER_ITEM.initialOpacity,
              y: stage >= 2 ? CARD_STAGGER_ITEM.finalY : CARD_STAGGER_ITEM.initialY,
              x: targetX,
              rotate: targetRotate,
              scale: targetScale,
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
              x: {
                duration: motionDurationMs(layoutTransitionDuration, prefersReducedMotion),
                ease: CARD_STAGGER_PANEL.ease,
              },
              rotate: {
                duration: motionDurationMs(layoutTransitionDuration, prefersReducedMotion),
                ease: CARD_STAGGER_PANEL.ease,
              },
              scale: {
                duration: motionDurationMs(layoutTransitionDuration, prefersReducedMotion),
                ease: CARD_STAGGER_PANEL.ease,
              },
            }}
          >
            <Magnetic strength={0.28} range={130} onlyOnHover disableOnTouch>
              {project.frontmatter?.image ? (
                <ProjectCard slug={project.slug} frontmatter={project.frontmatter} index={index} />
              ) : (
                <div className="aspect-[16/9] w-full rounded-xl">
                  <Skeleton className="h-full w-full rounded-xl" />
                </div>
              )}
            </Magnetic>
          </m.div>
        )
      })}
    </m.div>
  )
}
