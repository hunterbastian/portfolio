'use client'

import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { Children, useEffect, useMemo, useState, type ReactNode } from 'react'
import { MOTION_EASE_SOFT, MOTION_EASE_EXIT, motionDelayMs, motionDurationMs } from '@/lib/motion'
import { useIsInitialLoad } from '@/lib/initial-load'

/* ─────────────────────────────────────────────────────────
 * PAGE TRANSITION STORYBOARD
 *
 * Read top-to-bottom. Each `at` value is ms after route swap.
 *
 *    0ms   previous page fades out + drifts up, blur 0 → 3px
 *  340ms   old page gone
 *   80ms   new page container slides up y 18 → 0, blur 4 → 0
 *  200ms   new page children rise into place (staggered 70ms)
 * ───────────────────────────────────────────────────────── */

const TIMING = {
  oldFadeDuration: 340,   // gentle fade-out — unhurried exit
  newContentDelay: 80,    // breathing room before new page arrives
  newSlideDuration: 600,  // slow editorial entrance
  childStartDelay: 120,   // let container settle before children reveal
  childStagger: 70,       // wider cascade — each child gets its moment
  childDuration: 500,     // each child fades in gently
}

/** Exported for shared-element transition measurement offset */
export const PAGE_ENTRANCE_INITIAL_Y = 18

const PAGE = {
  initialY: PAGE_ENTRANCE_INITIAL_Y, // more travel distance for a visible glide
  finalY: 0,
  initialOpacity: 0,
  finalOpacity: 1,
  exitOpacity: 0,
  exitY: -8,              // exits upward — feels like turning a page
  initialBlur: 'blur(4px)',
  finalBlur: 'blur(0px)',
  exitBlur: 'blur(3px)',
}

/** Exported for shared-element transition measurement offset */
export const CHILD_ENTRANCE_INITIAL_Y = 14

const CHILD = {
  initialY: CHILD_ENTRANCE_INITIAL_Y, // children rise more — noticeable but not dramatic
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
  isInitialLoad: boolean
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

function RouteScene({ children, prefersReducedMotion, isInitialLoad, timing, offsets }: RouteSceneProps) {
  const [stage, setStage] = useState(isInitialLoad ? 2 : 0)
  const routeChildren = useMemo(() => Children.toArray(children), [children])

  useEffect(() => {
    if (isInitialLoad) return  // Content already visible from SSR
    if (prefersReducedMotion) {
      setStage(2)
      return
    }

    setStage(0)
    const timers: Array<ReturnType<typeof setTimeout>> = []

    timers.push(setTimeout(() => setStage(1), timing.newContentDelay))
    timers.push(setTimeout(() => setStage(2), timing.newContentDelay + timing.childStartDelay))

    return () => timers.forEach(clearTimeout)
  }, [isInitialLoad, prefersReducedMotion, timing.childStartDelay, timing.newContentDelay])

  return (
    <m.div
      initial={isInitialLoad ? false : {
        opacity: PAGE.initialOpacity,
        y: offsets.pageY,
        filter: PAGE.initialBlur,
      }}
      animate={{
        opacity: stage >= 1 ? PAGE.finalOpacity : PAGE.initialOpacity,
        y: stage >= 1 ? PAGE.finalY : offsets.pageY,
        filter: stage >= 1 ? PAGE.finalBlur : PAGE.initialBlur,
      }}
      transition={{
        duration: motionDurationMs(timing.newSlideDuration, prefersReducedMotion),
        ease: MOTION_EASE_SOFT,
        filter: { duration: motionDurationMs(timing.newSlideDuration * 0.65, prefersReducedMotion) },
      }}
      className="will-change-transform"
    >
      {routeChildren.map((child, index) => (
        <m.div
          key={index}
          initial={isInitialLoad ? false : {
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
            ease: MOTION_EASE_SOFT,
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
  const isInitialLoad = useIsInitialLoad()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={pathname}
        exit={{ opacity: PAGE.exitOpacity, y: PAGE.exitY, filter: PAGE.exitBlur }}
        transition={{
          duration: motionDurationMs(TIMING.oldFadeDuration, prefersReducedMotion),
          ease: MOTION_EASE_EXIT,
        }}
      >
        <RouteScene
          isInitialLoad={isInitialLoad}
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
