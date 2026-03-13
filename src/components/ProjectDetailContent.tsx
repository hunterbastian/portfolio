'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { MOTION_EASE_SOFT, motionDelayMs, motionDurationMs } from '@/lib/motion'

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

interface ProjectDetailContentProps {
  header: ReactNode
  image: ReactNode
  description: ReactNode
  meta: ReactNode
  links: ReactNode | null
  content: ReactNode
}

export default function ProjectDetailContent({
  header,
  image,
  description,
  meta,
  links,
  content,
}: ProjectDetailContentProps) {
  const prefersReducedMotion = useReducedMotion() ?? false
  const [stage, setStage] = useState(0)

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
        initial={{ opacity: ITEM.initialOpacity, y: 16 }}
        animate={{
          opacity: stage >= 2 ? ITEM.finalOpacity : ITEM.initialOpacity,
          y: stage >= 2 ? ITEM.finalY : 16,
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
