'use client'

import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { MOTION_EASE_SOFT, motionDelayMs, motionDurationMs } from '@/lib/motion'
import {
  PROJECT_DETAIL_INITIAL_STAGE,
  PROJECT_DETAIL_ITEM_MOTION,
  PROJECT_DETAIL_TIMING,
  activateProjectDetailView,
  getProjectDetailHeroMotion,
  getProjectDetailItemMotion,
  scheduleProjectDetailRevealStages,
} from '@/lib/project-detail'
import {
  getProjectMorphProps,
  getProjectMorphServerSnapshot,
  getProjectMorphSlug,
  subscribeProjectMorph,
} from '@/lib/view-transition'
import { analytics } from '@/lib/analytics'

/* ─────────────────────────────────────────────────────────
 * PROJECT DETAIL STORYBOARD
 *
 *    0ms   waiting for mount
 *   60ms   header (title + date) fades in, y 12 → 0
 *  160ms   hero image rises in, y 16 → 0
 *  280ms   description + meta rise into place
 *  400ms   MDX content appears
 * ───────────────────────────────────────────────────────── */

interface ProjectDetailContentProps {
  header: ReactNode
  image: ReactNode
  description: ReactNode
  meta: ReactNode
  links: ReactNode | null
  content: ReactNode
  slug?: string
  projectTitle?: string
}

export default function ProjectDetailContent({
  header,
  image,
  description,
  meta,
  links,
  content,
  slug,
  projectTitle,
}: ProjectDetailContentProps) {
  const prefersReducedMotion = useReducedMotion() ?? false
  const [stage, setStage] = useState(PROJECT_DETAIL_INITIAL_STAGE)

  const morphSlug = useSyncExternalStore(
    subscribeProjectMorph,
    getProjectMorphSlug,
    getProjectMorphServerSnapshot,
  )
  const { style: morphStyle, ...morphAttributes } = getProjectMorphProps(slug ?? '', morphSlug)
  const isMorphing = morphStyle !== undefined

  useEffect(() => {
    activateProjectDetailView({
      projectTitle,
      slug,
      trackProjectView: (viewSlug, title) => analytics.projectView(viewSlug, title),
    })
  }, [projectTitle, slug])

  useEffect(() => {
    const timers = scheduleProjectDetailRevealStages({
      prefersReducedMotion,
      scheduleStage: (nextStage, delay) => setTimeout(() => setStage(nextStage), delay),
      setStage,
    })

    return () => timers.forEach(clearTimeout)
  }, [prefersReducedMotion])

  const duration = motionDurationMs(PROJECT_DETAIL_TIMING.duration, prefersReducedMotion)

  return (
    <>
      <m.div
        initial={{ opacity: PROJECT_DETAIL_ITEM_MOTION.initialOpacity, y: PROJECT_DETAIL_ITEM_MOTION.initialY }}
        animate={getProjectDetailItemMotion({ stage, visibleStage: 1 })}
        transition={{ duration, ease: MOTION_EASE_SOFT }}
      >
        {header}
      </m.div>

      <m.div
        initial={isMorphing ? false : getProjectDetailHeroMotion({ isMorphing, stage: 0 })}
        animate={getProjectDetailHeroMotion({ isMorphing, stage })}
        transition={{ duration: isMorphing ? 0 : duration, ease: MOTION_EASE_SOFT }}
        style={morphStyle}
        {...morphAttributes}
      >
        {image}
      </m.div>

      <m.div
        initial={{ opacity: PROJECT_DETAIL_ITEM_MOTION.initialOpacity, y: PROJECT_DETAIL_ITEM_MOTION.initialY }}
        animate={getProjectDetailItemMotion({ stage, visibleStage: 3 })}
        transition={{ duration, ease: MOTION_EASE_SOFT }}
      >
        {description}
      </m.div>

      <m.div
        initial={{ opacity: PROJECT_DETAIL_ITEM_MOTION.initialOpacity, y: PROJECT_DETAIL_ITEM_MOTION.initialY }}
        animate={getProjectDetailItemMotion({ stage, visibleStage: 3 })}
        transition={{
          duration,
          delay: stage >= 3 ? motionDelayMs(60, prefersReducedMotion) : 0,
          ease: MOTION_EASE_SOFT,
        }}
      >
        {meta}
        {links}
      </m.div>

      <m.div
        initial={{ opacity: PROJECT_DETAIL_ITEM_MOTION.initialOpacity, y: PROJECT_DETAIL_ITEM_MOTION.initialY }}
        animate={getProjectDetailItemMotion({ stage, visibleStage: 4 })}
        transition={{ duration, ease: MOTION_EASE_SOFT }}
      >
        {content}
      </m.div>
    </>
  )
}
