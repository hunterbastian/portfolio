'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  getProjectTransition,
  subscribeProjectTransition,
  clearProjectTransition,
  markProjectTransitionCompleting,
  type TransitionRect,
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

type Phase = 'hold' | 'fly' | 'fade'

const FLY_DURATION = 0.48
const FADE_DURATION = 0.22
/** Safety net: clear if target never arrives */
const HOLD_TIMEOUT_MS = 2000

export default function ProjectTransitionOverlay() {
  const transition = useSyncExternalStore(
    subscribeProjectTransition,
    getProjectTransition,
    () => null,
  )
  const prefersReducedMotion = useReducedMotion() ?? false
  const [phase, setPhase] = useState<Phase>('hold')
  const phaseRef = useRef<Phase>('hold')
  const pathname = usePathname()

  // Reset phase when a new transition starts (id changes on every click, even same card)
  useEffect(() => {
    if (transition && !transition.targetRect && !transition.completing) {
      setPhase('hold')
      phaseRef.current = 'hold'
    }
  }, [transition?.id])

  // Start flying when target rect arrives
  useEffect(() => {
    if (transition?.targetRect && phaseRef.current === 'hold') {
      if (prefersReducedMotion) {
        markProjectTransitionCompleting()
        clearProjectTransition()
        return
      }
      setPhase('fly')
      phaseRef.current = 'fly'
    }
  }, [transition?.targetRect, prefersReducedMotion])

  // Safety: graceful degradation if target never arrives
  useEffect(() => {
    if (transition && phaseRef.current === 'hold') {
      const timer = setTimeout(() => {
        markProjectTransitionCompleting()
        // Give the hero a moment to start fading in, then remove the overlay
        setTimeout(clearProjectTransition, 300)
      }, HOLD_TIMEOUT_MS)
      return () => clearTimeout(timer)
    }
  }, [transition?.id])

  // Clear if user navigates away from the target page
  useEffect(() => {
    if (transition && !pathname.startsWith(`/projects/${transition.slug}`)) {
      clearProjectTransition()
    }
  }, [pathname, transition])

  const handleAnimationComplete = useCallback(() => {
    if (phaseRef.current === 'fly') {
      markProjectTransitionCompleting()
      setPhase('fade')
      phaseRef.current = 'fade'
    } else if (phaseRef.current === 'fade') {
      clearProjectTransition()
    }
  }, [])

  if (!transition) return null

  const target = transition.targetRect
  const rect: TransitionRect =
    (phase === 'fly' || phase === 'fade') && target ? target : transition.sourceRect

  return (
    <m.div
      key={transition.id}
      className="pointer-events-none fixed z-[100] overflow-hidden will-change-[top,left,width,height]"
      initial={{
        top: transition.sourceRect.top,
        left: transition.sourceRect.left,
        width: transition.sourceRect.width,
        height: transition.sourceRect.height,
        borderRadius: 12,
        opacity: 1,
      }}
      animate={{
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        borderRadius: phase === 'hold' ? 12 : 3,
        opacity: phase === 'fade' ? 0 : 1,
      }}
      transition={{
        duration: phase === 'fly' ? FLY_DURATION : phase === 'fade' ? FADE_DURATION : 0,
        ease: MOTION_EASE_SOFT,
      }}
      onAnimationComplete={handleAnimationComplete}
    >
      <Image
        src={transition.imageSrc}
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, 560px"
        quality={90}
        priority
      />
    </m.div>
  )
}
