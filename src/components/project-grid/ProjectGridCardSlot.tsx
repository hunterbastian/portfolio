'use client'

import { m } from 'framer-motion'
import ProjectCard from '@/components/ProjectCard'
import { CARD_STAGGER_ITEM, CARD_STAGGER_PANEL, CARD_STAGGER_TIMING } from '@/components/project-grid/constants'
import { Skeleton } from '@/components/ui/skeleton'
import { motionDelayMs, motionDurationMs } from '@/lib/motion'
import {
  PROJECT_GRID_CARDS_STAGE,
  PROJECT_GRID_CARD_SLOT_CLASS_NAME,
  PROJECT_GRID_FLAT_TRANSFORM,
  getProjectGridCardZIndex,
  getProjectGridStaticCardStyle,
} from '@/lib/project-grid'
import type { ProjectGridProject } from '@/lib/project-grid'

interface ProjectGridCardSlotProps {
  cardOpacity: number
  compactScale: number
  index: number
  isHovered: boolean
  layoutTransitionDuration: number
  onMouseEnter: () => void
  onMouseLeave: () => void
  prefersReducedMotion: boolean
  project: ProjectGridProject
  stage: number
  stackZIndex: number
  targetScale: number
  totalProjects: number
}

function ProjectGridCardMedia({ index, project }: Pick<ProjectGridCardSlotProps, 'index' | 'project'>) {
  if (!project.frontmatter?.image) {
    return (
      <div className="aspect-[16/9] w-full">
        <Skeleton className="h-full w-full" />
      </div>
    )
  }

  return <ProjectCard slug={project.slug} frontmatter={project.frontmatter} index={index} />
}

export function ProjectGridCardSlot({
  cardOpacity,
  compactScale,
  index,
  isHovered,
  layoutTransitionDuration,
  onMouseEnter,
  onMouseLeave,
  prefersReducedMotion,
  project,
  stage,
  stackZIndex,
  targetScale,
  totalProjects,
}: ProjectGridCardSlotProps) {
  const zIndex = getProjectGridCardZIndex(isHovered, totalProjects, stackZIndex)

  // Keep the first card as plain HTML so the LCP image can paint without motion hydration.
  if (index === 0) {
    return (
      <div
        className={PROJECT_GRID_CARD_SLOT_CLASS_NAME}
        style={getProjectGridStaticCardStyle({
          cardOpacity,
          targetScale,
          zIndex,
        })}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <ProjectGridCardMedia index={index} project={project} />
      </div>
    )
  }

  return (
    <m.div
      className={PROJECT_GRID_CARD_SLOT_CLASS_NAME}
      style={{ zIndex }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      initial={{
        opacity: CARD_STAGGER_ITEM.initialOpacity,
        y: CARD_STAGGER_ITEM.initialY,
        x: PROJECT_GRID_FLAT_TRANSFORM.x,
        rotate: PROJECT_GRID_FLAT_TRANSFORM.rotate,
        scale: compactScale,
      }}
      animate={{
        opacity: stage >= PROJECT_GRID_CARDS_STAGE ? cardOpacity : CARD_STAGGER_ITEM.initialOpacity,
        y: stage >= PROJECT_GRID_CARDS_STAGE ? CARD_STAGGER_ITEM.finalY : CARD_STAGGER_ITEM.initialY,
        x: PROJECT_GRID_FLAT_TRANSFORM.x,
        rotate: PROJECT_GRID_FLAT_TRANSFORM.rotate,
        scale: targetScale,
      }}
      transition={{
        opacity: {
          duration: motionDurationMs(CARD_STAGGER_TIMING.cardDuration, prefersReducedMotion),
          delay: stage >= PROJECT_GRID_CARDS_STAGE ? motionDelayMs(index * CARD_STAGGER_TIMING.cardStagger, prefersReducedMotion) : 0,
          ease: CARD_STAGGER_PANEL.ease,
        },
        y: {
          duration: motionDurationMs(CARD_STAGGER_TIMING.cardDuration, prefersReducedMotion),
          delay: stage >= PROJECT_GRID_CARDS_STAGE ? motionDelayMs(index * CARD_STAGGER_TIMING.cardStagger, prefersReducedMotion) : 0,
          ease: CARD_STAGGER_PANEL.ease,
        },
        x: {
          duration: motionDurationMs(layoutTransitionDuration, prefersReducedMotion),
          delay: motionDelayMs(index * 50, prefersReducedMotion),
          ease: CARD_STAGGER_PANEL.ease,
        },
        rotate: {
          duration: motionDurationMs(layoutTransitionDuration, prefersReducedMotion),
          delay: motionDelayMs(index * 50, prefersReducedMotion),
          ease: CARD_STAGGER_PANEL.ease,
        },
        scale: {
          duration: motionDurationMs(layoutTransitionDuration, prefersReducedMotion),
          delay: motionDelayMs(index * 50, prefersReducedMotion),
          ease: CARD_STAGGER_PANEL.ease,
        },
      }}
    >
      <ProjectGridCardMedia index={index} project={project} />
    </m.div>
  )
}
