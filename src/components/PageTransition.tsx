'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { Children, useEffect, useMemo, useState, type ReactNode } from 'react'
import { MOTION_EASE_STANDARD, motionDelayMs, motionDurationMs } from '@/lib/motion'

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD
 *
 * Read top-to-bottom. Each `at` value is ms after route swap.
 *
 *    0ms   previous page fades out
 *   60ms   new page container starts sliding up + fading in
 *  180ms   new page children start sliding up (staggered 90ms)
 * ───────────────────────────────────────────────────────── */

const TIMING = {
  oldFadeDuration: 260, // previous page fade-out duration
  newContentDelay: 60, // wait before new container starts
  newSlideDuration: 520, // new container slide/fade duration
  childStartDelay: 120, // wait before child stagger starts
  childStagger: 90, // gap between each child animation
  childDuration: 360, // each child slide/fade duration
}

const PAGE = {
  initialY: 28, // px offset before page slides up
  finalY: 0, // resting position
  initialOpacity: 0, // hidden state before enter
  finalOpacity: 1, // resting visibility
  exitOpacity: 0, // old page fades to transparent
}

const CHILD = {
  initialY: 20, // px offset before each child slides up
  finalY: 0, // resting child position
  initialOpacity: 0, // hidden child state
  finalOpacity: 1, // resting child visibility
}

interface PageTransitionProps {
  children: ReactNode
}

interface RouteSceneProps {
  children: ReactNode
  prefersReducedMotion: boolean
  timing: {
    newContentDelay: number
    newSlideDuration: number
    childStartDelay: number
    childStagger: number
    childDuration: number
  }
  offsets: {
    pageY: number
    childY: number
  }
}

function RouteScene({ children, prefersReducedMotion, timing, offsets }: RouteSceneProps) {
  const [stage, setStage] = useState(0)
  const routeChildren = useMemo(() => Children.toArray(children), [children])

  useEffect(() => {
    if (prefersReducedMotion) {
      setStage(2)
      return
    }

    setStage(0)
    const timers: Array<ReturnType<typeof setTimeout>> = []

    timers.push(setTimeout(() => setStage(1), timing.newContentDelay))
    timers.push(setTimeout(() => setStage(2), timing.newContentDelay + timing.childStartDelay))

    return () => timers.forEach(clearTimeout)
  }, [prefersReducedMotion, timing.childStartDelay, timing.newContentDelay])

  return (
    <motion.div
      initial={{
        opacity: PAGE.initialOpacity,
        y: offsets.pageY,
      }}
      animate={{
        opacity: stage >= 1 ? PAGE.finalOpacity : PAGE.initialOpacity,
        y: stage >= 1 ? PAGE.finalY : offsets.pageY,
      }}
      transition={{
        duration: motionDurationMs(timing.newSlideDuration, prefersReducedMotion),
        ease: MOTION_EASE_STANDARD,
      }}
      style={{
        willChange: stage < 2 ? 'transform, opacity' : 'auto',
      }}
    >
      {routeChildren.map((child, index) => (
        <motion.div
          key={index}
          initial={{
            opacity: CHILD.initialOpacity,
            y: offsets.childY,
          }}
          animate={{
            opacity: stage >= 2 ? CHILD.finalOpacity : CHILD.initialOpacity,
            y: stage >= 2 ? CHILD.finalY : offsets.childY,
          }}
          transition={{
            duration: motionDurationMs(timing.childDuration, prefersReducedMotion),
            delay: stage >= 2 ? motionDelayMs(index * timing.childStagger, prefersReducedMotion) : 0,
            ease: MOTION_EASE_STANDARD,
          }}
          style={{
            willChange: stage < 2 ? 'transform, opacity' : 'auto',
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion() ?? false

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        exit={{ opacity: PAGE.exitOpacity }}
        transition={{
          duration: motionDurationMs(TIMING.oldFadeDuration, prefersReducedMotion),
          ease: MOTION_EASE_STANDARD,
        }}
      >
        <RouteScene
          prefersReducedMotion={prefersReducedMotion}
          timing={{
            newContentDelay: TIMING.newContentDelay,
            newSlideDuration: TIMING.newSlideDuration,
            childStartDelay: TIMING.childStartDelay,
            childStagger: TIMING.childStagger,
            childDuration: TIMING.childDuration,
          }}
          offsets={{
            pageY: PAGE.initialY,
            childY: CHILD.initialY,
          }}
        >
          {children}
        </RouteScene>
      </motion.div>
    </AnimatePresence>
  )
}
