'use client'

import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { Children, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react'
import { MOTION_EASE_SOFT, MOTION_EASE_EXIT, motionDelayMs, motionDurationMs } from '@/lib/motion'
import { useIsInitialLoad } from '@/lib/initial-load'
import {
  PAGE_TRANSITION_STAGE,
  PAGE_TRANSITION_TIMING,
  getInitialRouteSceneStage,
  getRouteSceneChildDelay,
  getRouteSceneDefaults,
  getRouteSceneExit,
  getRouteSceneExitDuration,
  getRouteSceneInitial,
  getRouteSceneMotion,
  isRouteSceneStatic,
  scheduleRouteSceneStages,
  type RouteSceneOffsets,
  type RouteSceneStage,
  type RouteSceneTiming,
} from '@/lib/page-transition'
import {
  getProjectMorphServerSnapshot,
  getProjectMorphSlug,
  subscribeProjectMorph,
} from '@/lib/view-transition'

/* ─────────────────────────────────────────────────────────
 * PAGE TRANSITION STORYBOARD
 *
 * Read top-to-bottom. Each `at` value is ms after route swap.
 *
 *    0ms   previous page fades out + drifts up slightly
 *  140ms   old page gone
 *   24ms   new page container settles y 6 → 0
 *   44ms   new page children settle y 4 → 0
 * ───────────────────────────────────────────────────────── */

interface PageTransitionProps {
  children: ReactNode
}

const ROUTE_SCENE_DEFAULTS = getRouteSceneDefaults()

interface RouteSceneProps {
  children: ReactNode
  prefersReducedMotion: boolean
  /** Render at rest and let something else own the motion for this route swap. */
  isStatic: boolean
  timing: RouteSceneTiming
  offsets: RouteSceneOffsets
}

function RouteScene({ children, prefersReducedMotion, isStatic, timing, offsets }: RouteSceneProps) {
  const [stage, setStage] = useState<RouteSceneStage>(getInitialRouteSceneStage(isStatic))
  const routeChildren = useMemo(() => Children.toArray(children), [children])

  useEffect(() => {
    const timers = scheduleRouteSceneStages({
      isInitialLoad: isStatic,
      prefersReducedMotion,
      scheduleStage: (nextStage, delay) => setTimeout(() => setStage(nextStage), delay),
      setStage,
      timing: {
        childStartDelay: timing.childStartDelay,
        newContentDelay: timing.newContentDelay,
      },
    })

    return () => timers.forEach(clearTimeout)
  }, [isStatic, prefersReducedMotion, timing.childStartDelay, timing.newContentDelay])

  return (
    <m.div
      initial={getRouteSceneInitial(isStatic, offsets.pageY)}
      animate={getRouteSceneMotion(stage, PAGE_TRANSITION_STAGE.page, offsets.pageY)}
      transition={{
        duration: motionDurationMs(timing.newSlideDuration, prefersReducedMotion),
        ease: MOTION_EASE_SOFT,
      }}
      className="will-change-transform"
    >
      {routeChildren.map((child, index) => (
        <m.div
          key={index}
          initial={getRouteSceneInitial(isStatic, offsets.childY)}
          animate={getRouteSceneMotion(stage, PAGE_TRANSITION_STAGE.children, offsets.childY)}
          transition={{
            duration: motionDurationMs(timing.childDuration, prefersReducedMotion),
            delay: motionDelayMs(
              getRouteSceneChildDelay({
                index,
                prefersReducedMotion,
                stage,
                stagger: timing.childStagger,
              }),
              prefersReducedMotion,
            ),
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
  const morphSlug = useSyncExternalStore(
    subscribeProjectMorph,
    getProjectMorphSlug,
    getProjectMorphServerSnapshot,
  )
  const isMorphing = morphSlug !== null

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={pathname}
        exit={getRouteSceneExit(isMorphing)}
        transition={{
          duration: motionDurationMs(
            getRouteSceneExitDuration(isMorphing, PAGE_TRANSITION_TIMING.oldFadeDuration),
            prefersReducedMotion,
          ),
          ease: MOTION_EASE_EXIT,
        }}
      >
        <RouteScene
          isStatic={isRouteSceneStatic({ isInitialLoad, isMorphing })}
          prefersReducedMotion={prefersReducedMotion}
          timing={ROUTE_SCENE_DEFAULTS.timing}
          offsets={ROUTE_SCENE_DEFAULTS.offsets}
        >
          {children}
        </RouteScene>
      </m.div>
    </AnimatePresence>
  )
}
