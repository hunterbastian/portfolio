'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { m, useInView, useReducedMotion } from 'framer-motion'
import { ProjectGridCardSlot } from '@/components/project-grid/ProjectGridCardSlot'
import {
  CARD_STAGGER_PANEL,
  CARD_STAGGER_TIMING,
  CASE_STUDY_DIAL_DEFAULTS,
} from '@/components/project-grid/constants'
import {
  getProjectGridViewStateFromOrderedProjects,
  PROJECT_GRID_INITIAL_STAGE,
  scheduleProjectGridRevealStages,
  sortCaseStudyProjects,
  type ProjectGridProject,
} from '@/lib/project-grid'
import { motionDurationMs } from '@/lib/motion'
import { useMediaQuery } from '@/lib/use-media-query'

interface ProjectGridClientProps {
  projects: ProjectGridProject[]
  initialLoadDelayMs?: number
}

export default function ProjectGridClient({ projects, initialLoadDelayMs = 0 }: ProjectGridClientProps) {
  const [stage, setStage] = useState(PROJECT_GRID_INITIAL_STAGE)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const supportsHover = useMediaQuery('(hover: hover) and (pointer: fine)')

  const router = useRouter()
  const prefersReducedMotion = useReducedMotion() ?? false
  const gridRef = useRef<HTMLDivElement>(null)
  const hasPlayedEntranceRef = useRef(false)
  const isGridInView = useInView(gridRef, { once: true, amount: 0.16 })
  const prefetchedSlugsRef = useRef(new Set<string>())

  const orderedProjects = useMemo(() => sortCaseStudyProjects(projects), [projects])

  const caseStudyDial = CASE_STUDY_DIAL_DEFAULTS

  const prefetchProject = useCallback((slug: string) => {
    if (prefetchedSlugsRef.current.has(slug)) {
      return
    }

    prefetchedSlugsRef.current.add(slug)
    router.prefetch(`/projects/${slug}`)
  }, [router])

  useEffect(() => {
    const timers = scheduleProjectGridRevealStages({
      hasPlayedEntrance: hasPlayedEntranceRef.current,
      initialLoadDelayMs,
      isGridInView,
      prefersReducedMotion,
      scheduleStage: (step) => (
        setTimeout(() => {
          setStage(step.stage)
          if (step.completesEntrance) {
            hasPlayedEntranceRef.current = true
          }
        }, step.delay)
      ),
      setHasPlayedEntrance: (hasPlayedEntrance) => {
        hasPlayedEntranceRef.current = hasPlayedEntrance
      },
      setStage,
      timing: CARD_STAGGER_TIMING,
    })

    return () => timers.forEach(clearTimeout)
  }, [initialLoadDelayMs, isGridInView, prefersReducedMotion])

  const isExpandedLayout = true
  const gridState = useMemo(
    () => getProjectGridViewStateFromOrderedProjects(orderedProjects, {
      dial: caseStudyDial,
      hoveredIndex,
      isExpandedLayout,
      supportsHover,
    }),
    [caseStudyDial, hoveredIndex, isExpandedLayout, orderedProjects, supportsHover],
  )
  const {
    gridColumnGap,
    gridRowGap,
    layoutTransitionDuration,
    targetScale,
  } = gridState.layoutMetrics

  return (
    <m.div
      ref={gridRef}
      className="mx-auto grid w-full max-w-[980px] grid-cols-1 gap-5 px-0 sm:grid-cols-2 sm:gap-0 sm:px-0"
      onMouseLeave={() => supportsHover && setHoveredIndex(null)}
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
      {gridState.cardStates.map(({ cardOpacity, index, isHovered, project, stackZIndex }) => (
        <ProjectGridCardSlot
          key={project.slug}
          cardOpacity={cardOpacity}
          compactScale={caseStudyDial.pile.compactScale}
          index={index}
          isHovered={isHovered}
          layoutTransitionDuration={layoutTransitionDuration}
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
          prefersReducedMotion={prefersReducedMotion}
          project={project}
          stage={stage}
          stackZIndex={stackZIndex}
          targetScale={targetScale}
          totalProjects={gridState.totalProjects}
        />
      ))}
    </m.div>
  )
}
