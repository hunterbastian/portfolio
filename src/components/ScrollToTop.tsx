'use client'

import { useEffect, useState } from 'react'
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
  const haptic = useWebHaptics()
  const prefersReducedMotion = useReducedMotion() ?? false

  useEffect(() => {
    const onScroll = () => {
      const pageHeight = document.documentElement.scrollHeight
      const viewportBottom = window.scrollY + window.innerHeight
      const nearPageEnd = viewportBottom >= pageHeight - 360

      setVisible(nearPageEnd && window.scrollY > 720)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
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
          className="fixed bottom-[5rem] right-4 z-50 origin-center sm:bottom-[5.5rem] sm:right-5"
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
            className={`${arcStyles.button} ${arcStyles.compactButton}`}
          >
            <span className={arcStyles.bezel} aria-hidden="true" />
            <span className={arcStyles.recess} aria-hidden="true" />
            <span className={arcStyles.face} aria-hidden="true">
              <ScrollArrowMark className={arcStyles.arrow} />
            </span>
          </button>
        </m.div>
      )}
    </AnimatePresence>
  )
}
