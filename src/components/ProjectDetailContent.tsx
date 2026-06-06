'use client'

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { MOTION_EASE_SOFT, motionDelayMs, motionDurationMs } from '@/lib/motion'
import {
  getProjectTransition,
  subscribeProjectTransition,
  setProjectTransitionTarget,
} from '@/lib/project-transition'
import {
  PROJECT_DETAIL_HERO_INITIAL_Y,
  PROJECT_DETAIL_INITIAL_STAGE,
  PROJECT_DETAIL_ITEM_MOTION,
  PROJECT_DETAIL_TIMING,
  activateProjectDetailTransitionTarget,
  activateProjectDetailView,
  getProjectDetailItemMotion,
  scheduleProjectDetailRevealStages,
} from '@/lib/project-detail'
import { getPageTransitionYOffset } from '@/lib/page-transition'
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

// PageTransition entrance offsets at mount time — subtract from
// getBoundingClientRect() to get the hero's final resting position.
const PAGE_TRANSITION_Y_OFFSET = getPageTransitionYOffset()

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
  const heroRef = useRef<HTMLDivElement>(null)

  const transition = useSyncExternalStore(
    subscribeProjectTransition,
    getProjectTransition,
    () => null,
  )
  // Active = transition matches this slug and overlay hasn't started fading out
  const isTransitionActive = transition != null && transition.slug === slug && !transition.completing

  useEffect(() => {
    activateProjectDetailView({
      projectTitle,
      slug,
      trackProjectView: (viewSlug, title) => analytics.projectView(viewSlug, title),
    })
  }, [projectTitle, slug])

  // Measure the hero image position and feed it to the overlay.
  // useLayoutEffect fires before paint, so the overlay gets the target immediately.
  useLayoutEffect(() => {
    const heroNode = heroRef.current

    if (isTransitionActive && heroNode) {
      activateProjectDetailTransitionTarget({
        getHeroRect: () => heroNode.getBoundingClientRect(),
        pageTransitionYOffset: PAGE_TRANSITION_Y_OFFSET,
        setTransitionTarget: setProjectTransitionTarget,
      })
    }
  }, [isTransitionActive])

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
        ref={heroRef}
        initial={getProjectDetailItemMotion({
          initialY: PROJECT_DETAIL_HERO_INITIAL_Y,
          stage: 0,
          transitionActive: isTransitionActive,
          visibleStage: 2,
        })}
        animate={getProjectDetailItemMotion({
          initialY: PROJECT_DETAIL_HERO_INITIAL_Y,
          stage,
          transitionActive: isTransitionActive,
          visibleStage: 2,
        })}
        transition={{ duration, ease: MOTION_EASE_SOFT }}
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
