'use client'

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { MOTION_EASE_SOFT, motionDelayMs, motionDurationMs } from '@/lib/motion'
import {
  getProjectTransition,
  subscribeProjectTransition,
  setProjectTransitionTarget,
} from '@/lib/project-transition'
import { PAGE_ENTRANCE_INITIAL_Y, CHILD_ENTRANCE_INITIAL_Y } from '@/components/PageTransition'

/* ─────────────────────────────────────────────────────────
 * PROJECT DETAIL STORYBOARD
 *
 *    0ms   waiting for mount
 *   60ms   header (title + date) fades in, y 12 → 0
 *  160ms   hero image rises in, y 16 → 0
 *  280ms   description + meta rise into place
 *  400ms   MDX content appears
 * ───────────────────────────────────────────────────────── */

const TIMING = {
  headerAppear: 60,
  imageAppear: 160,
  metaAppear: 280,
  contentAppear: 400,
  duration: 500,
}

const ITEM = {
  initialOpacity: 0,
  finalOpacity: 1,
  initialY: 12,
  finalY: 0,
  ease: MOTION_EASE_SOFT,
}

// PageTransition entrance offsets at mount time — subtract from
// getBoundingClientRect() to get the hero's final resting position.
const PAGE_TRANSITION_Y_OFFSET = PAGE_ENTRANCE_INITIAL_Y + CHILD_ENTRANCE_INITIAL_Y

interface ProjectDetailContentProps {
  header: ReactNode
  image: ReactNode
  description: ReactNode
  meta: ReactNode
  links: ReactNode | null
  content: ReactNode
  slug?: string
}

export default function ProjectDetailContent({
  header,
  image,
  description,
  meta,
  links,
  content,
  slug,
}: ProjectDetailContentProps) {
  const prefersReducedMotion = useReducedMotion() ?? false
  const [stage, setStage] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  const transition = useSyncExternalStore(
    subscribeProjectTransition,
    getProjectTransition,
    () => null,
  )
  // Active = transition matches this slug and overlay hasn't started fading out
  const isTransitionActive = transition != null && transition.slug === slug && !transition.completing

  // Measure the hero image position and feed it to the overlay.
  // useLayoutEffect fires before paint, so the overlay gets the target immediately.
  useLayoutEffect(() => {
    if (isTransitionActive && heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect()
      setProjectTransitionTarget({
        top: rect.top - PAGE_TRANSITION_Y_OFFSET,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      })
    }
  }, [isTransitionActive])

  useEffect(() => {
    if (prefersReducedMotion) {
      setStage(4)
      return
    }

    setStage(0)
    const timers: Array<ReturnType<typeof setTimeout>> = []
    timers.push(setTimeout(() => setStage(1), TIMING.headerAppear))
    timers.push(setTimeout(() => setStage(2), TIMING.imageAppear))
    timers.push(setTimeout(() => setStage(3), TIMING.metaAppear))
    timers.push(setTimeout(() => setStage(4), TIMING.contentAppear))

    return () => timers.forEach(clearTimeout)
  }, [prefersReducedMotion])

  const duration = motionDurationMs(TIMING.duration, prefersReducedMotion)

  return (
    <>
      <m.div
        initial={{ opacity: ITEM.initialOpacity, y: ITEM.initialY }}
        animate={{
          opacity: stage >= 1 ? ITEM.finalOpacity : ITEM.initialOpacity,
          y: stage >= 1 ? ITEM.finalY : ITEM.initialY,
        }}
        transition={{ duration, ease: ITEM.ease }}
      >
        {header}
      </m.div>

      <m.div
        ref={heroRef}
        initial={{ opacity: isTransitionActive ? 0 : ITEM.initialOpacity, y: isTransitionActive ? 0 : 16 }}
        animate={{
          opacity: isTransitionActive ? 0 : (stage >= 2 ? ITEM.finalOpacity : ITEM.initialOpacity),
          y: isTransitionActive ? 0 : (stage >= 2 ? ITEM.finalY : 16),
        }}
        transition={{ duration, ease: ITEM.ease }}
      >
        {image}
      </m.div>

      <m.div
        initial={{ opacity: ITEM.initialOpacity, y: ITEM.initialY }}
        animate={{
          opacity: stage >= 3 ? ITEM.finalOpacity : ITEM.initialOpacity,
          y: stage >= 3 ? ITEM.finalY : ITEM.initialY,
        }}
        transition={{ duration, ease: ITEM.ease }}
      >
        {description}
      </m.div>

      <m.div
        initial={{ opacity: ITEM.initialOpacity, y: ITEM.initialY }}
        animate={{
          opacity: stage >= 3 ? ITEM.finalOpacity : ITEM.initialOpacity,
          y: stage >= 3 ? ITEM.finalY : ITEM.initialY,
        }}
        transition={{
          duration,
          delay: stage >= 3 ? motionDelayMs(60, prefersReducedMotion) : 0,
          ease: ITEM.ease,
        }}
      >
        {meta}
        {links}
      </m.div>

      <m.div
        initial={{ opacity: ITEM.initialOpacity, y: ITEM.initialY }}
        animate={{
          opacity: stage >= 4 ? ITEM.finalOpacity : ITEM.initialOpacity,
          y: stage >= 4 ? ITEM.finalY : ITEM.initialY,
        }}
        transition={{ duration, ease: ITEM.ease }}
      >
        {content}
      </m.div>
    </>
  )
}
