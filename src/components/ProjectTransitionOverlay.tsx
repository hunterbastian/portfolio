'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  getProjectTransition,
  subscribeProjectTransition,
  activateProjectTransitionOverlayCompletion,
  activateProjectTransitionOverlayTarget,
  clearProjectTransition,
  clearProjectTransitionForPath,
  getProjectTransitionOverlayAnimateFrame,
  getProjectTransitionOverlayDuration,
  getProjectTransitionOverlayInitialFrame,
  markProjectTransitionCompleting,
  PROJECT_TRANSITION_OVERLAY_IMAGE_CLASS_NAME,
  PROJECT_TRANSITION_OVERLAY_IMAGE_QUALITY,
  PROJECT_TRANSITION_OVERLAY_IMAGE_SIZES,
  PROJECT_TRANSITION_OVERLAY_ROOT_CLASS_NAME,
  resetProjectTransitionOverlayPhase,
  scheduleProjectTransitionHoldFallback,
  type ProjectTransitionOverlayPhase,
} from '@/lib/project-transition'
import { MOTION_EASE_SOFT } from '@/lib/motion'

/* ─────────────────────────────────────────────────────────
 * SHARED-ELEMENT TRANSITION OVERLAY
 *
 * Phases:
 *   hold   — overlay sits at the card's rect, waiting for target
 *   fly    — animates from source → target (0.48s)
 *   fade   — crossfades out while hero fades in (0.22s)
 *   (unmount) — clearProjectTransition() removes overlay
 * ───────────────────────────────────────────────────────── */

export default function ProjectTransitionOverlay() {
  const transition = useSyncExternalStore(
    subscribeProjectTransition,
    getProjectTransition,
    () => null,
  )
  const prefersReducedMotion = useReducedMotion() ?? false
  const [phase, setPhase] = useState<ProjectTransitionOverlayPhase>('hold')
  const phaseRef = useRef<ProjectTransitionOverlayPhase>('hold')
  const pathname = usePathname()

  const setOverlayPhase = useCallback((nextPhase: ProjectTransitionOverlayPhase) => {
    setPhase(nextPhase)
    phaseRef.current = nextPhase
  }, [])

  // Reset phase when a new transition starts (id changes on every click, even same card)
  useEffect(() => {
    resetProjectTransitionOverlayPhase({ setPhase: setOverlayPhase, transition })
  }, [setOverlayPhase, transition, transition?.id])

  // Start flying when target rect arrives
  useEffect(() => {
    activateProjectTransitionOverlayTarget({
      clearTransition: clearProjectTransition,
      markCompleting: markProjectTransitionCompleting,
      phase: phaseRef.current,
      prefersReducedMotion,
      setPhase: setOverlayPhase,
      transition,
    })
  }, [prefersReducedMotion, setOverlayPhase, transition, transition?.targetRect])

  // Safety: graceful degradation if target never arrives
  useEffect(() => {
    const timers = scheduleProjectTransitionHoldFallback({
      clearTransition: clearProjectTransition,
      markCompleting: markProjectTransitionCompleting,
      phase: phaseRef.current,
      schedule: (delay, callback) => setTimeout(callback, delay),
      transition,
    })

    return () => timers.forEach(clearTimeout)
  }, [transition?.id])

  // Clear if user navigates away from the target page
  useEffect(() => {
    clearProjectTransitionForPath({
      clearTransition: clearProjectTransition,
      pathname,
      transition,
    })
  }, [pathname, transition])

  const handleAnimationComplete = useCallback(() => {
    activateProjectTransitionOverlayCompletion({
      clearTransition: clearProjectTransition,
      markCompleting: markProjectTransitionCompleting,
      phase: phaseRef.current,
      setPhase: setOverlayPhase,
    })
  }, [setOverlayPhase])

  if (!transition) return null

  return (
    <m.div
      key={transition.id}
      className={PROJECT_TRANSITION_OVERLAY_ROOT_CLASS_NAME}
      initial={{ ...getProjectTransitionOverlayInitialFrame(transition) }}
      animate={{ ...getProjectTransitionOverlayAnimateFrame(phase, transition) }}
      transition={{
        duration: getProjectTransitionOverlayDuration(phase),
        ease: MOTION_EASE_SOFT,
      }}
      onAnimationComplete={handleAnimationComplete}
    >
      <Image
        src={transition.imageSrc}
        alt=""
        fill
        className={PROJECT_TRANSITION_OVERLAY_IMAGE_CLASS_NAME}
        sizes={PROJECT_TRANSITION_OVERLAY_IMAGE_SIZES}
        quality={PROJECT_TRANSITION_OVERLAY_IMAGE_QUALITY}
        priority
      />
    </m.div>
  )
}
