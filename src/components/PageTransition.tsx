'use client'

import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
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
  oldFadeDuration: 120, // previous page fade-out — snappy exit
  newContentDelay: 20, // minimal wait before new container
  newSlideDuration: 280, // new container slide/fade — smooth but quick
  childStartDelay: 40, // tight delay before child stagger
  childStagger: 35, // quicker cascade between children
  childDuration: 200, // each child slide/fade
}

const PAGE = {
  initialY: 8, // subtle slide — less dramatic, more refined
  finalY: 0,
  initialOpacity: 0,
  finalOpacity: 1,
  exitOpacity: 0,
}

const CHILD = {
  initialY: 5, // very subtle child offset
  finalY: 0,
  initialOpacity: 0,
  finalOpacity: 1,
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
    <m.div
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
      className="will-change-transform"
    >
      {routeChildren.map((child, index) => (
        <m.div
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
          className="will-change-transform"
        >
          {child}
        </m.div>
      ))}
    </m.div>
  )
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion() ?? false

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
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
      </m.div>
    </AnimatePresence>
  )
}
