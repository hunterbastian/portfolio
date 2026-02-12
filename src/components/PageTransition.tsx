'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { Children, useEffect, useMemo, useState, type ReactNode } from 'react'

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
  ease: [0.22, 1, 0.36, 1] as const,
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

function RouteScene({ children, timing, offsets }: RouteSceneProps) {
  const [stage, setStage] = useState(0)
  const routeChildren = useMemo(() => Children.toArray(children), [children])

  useEffect(() => {
    setStage(0)
    const timers: Array<ReturnType<typeof setTimeout>> = []

    timers.push(setTimeout(() => setStage(1), timing.newContentDelay))
    timers.push(setTimeout(() => setStage(2), timing.newContentDelay + timing.childStartDelay))

    return () => timers.forEach(clearTimeout)
  }, [timing.childStartDelay, timing.newContentDelay])

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
        duration: timing.newSlideDuration / 1000,
        ease: PAGE.ease,
      }}
      className="will-change-transform"
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
            duration: timing.childDuration / 1000,
            delay: stage >= 2 ? (index * timing.childStagger) / 1000 : 0,
            ease: PAGE.ease,
          }}
          className="will-change-transform"
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        exit={{ opacity: PAGE.exitOpacity }}
        transition={{
          duration: TIMING.oldFadeDuration / 1000,
          ease: PAGE.ease,
        }}
      >
        <RouteScene
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
