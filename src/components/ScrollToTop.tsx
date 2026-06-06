'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { MOTION_EASE_EXIT, MOTION_EASE_SOFT, motionDurationMs } from '@/lib/motion'
import { useWebHaptics } from 'web-haptics/react'
import { showJoyToast } from '@/lib/joy'
import {
  SCROLL_TO_TOP_ARIA_LABEL,
  SCROLL_TO_TOP_MOTION_DURATION_MS,
  activateScrollToTop,
  getScrollToTopAnimateFrame,
  getScrollToTopExitFrame,
  getScrollToTopFrameScheduleState,
  getScrollToTopInitialFrame,
  getScrollToTopVisibilityUpdate,
} from '@/lib/scroll-to-top'
import arcStyles from './ArcGlossUploadButton.module.css'

function ScrollArrowMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32 48V17"
        stroke="currentColor"
        strokeWidth="7.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 30.5L32 17L45.5 30.5"
        stroke="currentColor"
        strokeWidth="7.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const visibleRef = useRef(false)
  const frameRef = useRef<number | null>(null)
  const tickingRef = useRef(false)
  const haptic = useWebHaptics()
  const prefersReducedMotion = useReducedMotion() ?? false
  const enterTransition = {
    duration: motionDurationMs(SCROLL_TO_TOP_MOTION_DURATION_MS, prefersReducedMotion),
    ease: MOTION_EASE_SOFT,
  }
  const exitTransition = {
    duration: motionDurationMs(160, prefersReducedMotion),
    ease: MOTION_EASE_EXIT,
  }

  useEffect(() => {
    const updateVisibility = () => {
      const nextVisibility = getScrollToTopVisibilityUpdate({
        currentVisible: visibleRef.current,
        pageHeight: document.documentElement.scrollHeight,
        scrollY: window.scrollY,
        viewportHeight: window.innerHeight,
      })

      if (nextVisibility.changed) {
        visibleRef.current = nextVisibility.visible
        setVisible(nextVisibility.visible)
      }

      tickingRef.current = false
      frameRef.current = null
    }

    const onScroll = () => {
      const scheduleState = getScrollToTopFrameScheduleState(tickingRef.current)
      tickingRef.current = scheduleState.ticking

      if (!scheduleState.shouldRequestFrame) return

      frameRef.current = window.requestAnimationFrame(updateVisibility)
    }

    updateVisibility()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const scrollToTop = () => {
    activateScrollToTop({
      scrollToTop: (options) => window.scrollTo(options),
      showToast: showJoyToast,
      triggerHaptic: (style) => haptic.trigger(style),
    })
  }

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <m.div
          className="fixed bottom-[6.85rem] right-5 z-50 origin-center sm:bottom-[5.5rem] sm:right-10 lg:right-12"
          initial={getScrollToTopInitialFrame(prefersReducedMotion)}
          animate={{ ...getScrollToTopAnimateFrame(), transition: enterTransition }}
          exit={{ ...getScrollToTopExitFrame(prefersReducedMotion), transition: exitTransition }}
        >
          <button
            type="button"
            onClick={scrollToTop}
            aria-label={SCROLL_TO_TOP_ARIA_LABEL}
            className={arcStyles.scrollTopButton}
          >
            <ScrollArrowMark className={arcStyles.scrollTopArrow} />
          </button>
        </m.div>
      )}
    </AnimatePresence>
  )
}
