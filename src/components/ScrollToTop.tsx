'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { MOTION_EASE_SOFT, motionDurationMs } from '@/lib/motion'
import { useWebHaptics } from 'web-haptics/react'
import { showJoyToast } from '@/lib/joy'
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

  useEffect(() => {
    const updateVisibility = () => {
      const pageHeight = document.documentElement.scrollHeight
      const viewportBottom = window.scrollY + window.innerHeight
      const nearPageEnd = viewportBottom >= pageHeight - 360
      const nextVisible = nearPageEnd && window.scrollY > 720

      if (nextVisible !== visibleRef.current) {
        visibleRef.current = nextVisible
        setVisible(nextVisible)
      }

      tickingRef.current = false
      frameRef.current = null
    }

    const onScroll = () => {
      if (tickingRef.current) return

      tickingRef.current = true
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
    haptic.trigger('light')
    showJoyToast('Back to top')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <m.div
          className="fixed bottom-[6.85rem] right-5 z-50 origin-center sm:bottom-[5.5rem] sm:right-10 lg:right-12"
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.94, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.96, filter: 'blur(4px)' }}
          transition={{
            duration: motionDurationMs(220, prefersReducedMotion),
            ease: MOTION_EASE_SOFT,
          }}
        >
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className={arcStyles.scrollTopButton}
          >
            <ScrollArrowMark className={arcStyles.scrollTopArrow} />
          </button>
        </m.div>
      )}
    </AnimatePresence>
  )
}
