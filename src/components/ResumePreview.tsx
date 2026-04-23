'use client'

import { type RefObject, useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { createPortal } from 'react-dom'

interface ResumePreviewProps {
  isVisible: boolean
  anchorRef?: RefObject<HTMLElement | null>
}

const PREVIEW_WIDTH = 170
const PREVIEW_HEIGHT = 220

/* ─────────────────────────────────────────────────────────
 * RESUME PREVIEW ANIMATION STORYBOARD
 *
 * Read top-to-bottom. Each `at` value is ms after hover/focus trigger.
 *
 *    0ms   preview mounts in portal under the resume button
 *  120ms   fade + rise + scale to full size
 *  190ms   blur settles to crisp
 *  240ms   exit completes when hover/focus leaves
 * ───────────────────────────────────────────────────────── */

const PREVIEW_MOTION = {
  initial: {
    opacity: 0,
    y: -7,
    scale: 0.96,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: -5,
    scale: 0.98,
  },
}

const PREVIEW_TRANSITION = {
  y: { type: 'spring' as const, stiffness: 320, damping: 28, mass: 0.9 },
  scale: { type: 'spring' as const, stiffness: 360, damping: 30, mass: 0.9 },
  opacity: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
}

export default function ResumePreview({ isVisible, anchorRef }: ResumePreviewProps) {
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState({ left: 0, top: 0 })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isVisible || !anchorRef?.current) {
      return
    }

    const updatePosition = () => {
      const target = anchorRef.current
      if (!target) {
        return
      }

      const rect = target.getBoundingClientRect()
      const viewportPadding = 12
      const centeredLeft = rect.left + rect.width / 2
      const minLeft = viewportPadding + PREVIEW_WIDTH / 2
      const maxLeft = window.innerWidth - viewportPadding - PREVIEW_WIDTH / 2

      setPosition({
        left: Math.min(maxLeft, Math.max(minLeft, centeredLeft)),
        top: rect.bottom + 8,
      })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, { capture: true, passive: true })

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, { capture: true })
    }
  }, [isVisible, anchorRef])

  const previewBody = (
    <div
      className="relative overflow-hidden border border-gray-300 bg-card shadow-2xl"
      style={{ width: `${PREVIEW_WIDTH}px`, height: `${PREVIEW_HEIGHT}px` }}
    >
      <div className="bg-gray-100 px-3 py-2 border-b border-gray-200">
        <div className="text-[8px] font-semibold text-[#171717]">HUNTER BASTIAN</div>
        <div className="text-[6px] text-[#171717]">Resume Preview</div>
      </div>

      <div className="p-3 space-y-2">
        <div className="space-y-1">
          <div className="h-1 w-3/4 bg-gray-800"></div>
          <div className="h-0.5 w-full bg-gray-400"></div>
          <div className="h-0.5 w-5/6 bg-gray-400"></div>
        </div>

        <div className="space-y-1">
          <div className="h-0.5 w-1/2 bg-gray-600"></div>
          <div className="space-y-0.5">
            <div className="h-0.5 w-full bg-gray-300"></div>
            <div className="h-0.5 w-4/5 bg-gray-300"></div>
            <div className="h-0.5 w-3/4 bg-gray-300"></div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="h-0.5 w-1/3 bg-gray-600"></div>
          <div className="flex gap-1">
            <div className="flex h-3 w-6 items-center justify-center bg-blue-200 text-[4px]">JS</div>
            <div className="flex h-3 w-8 items-center justify-center bg-green-200 text-[4px]">React</div>
            <div className="flex h-3 w-6 items-center justify-center bg-purple-200 text-[4px]">TS</div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="h-0.5 w-2/5 bg-gray-600"></div>
          <div className="h-0.5 w-4/5 bg-gray-300"></div>
          <div className="h-0.5 w-3/5 bg-gray-300"></div>
        </div>

        <div className="space-y-1">
          <div className="h-0.5 w-1/4 bg-gray-600"></div>
          <div className="h-0.5 w-2/3 bg-gray-300"></div>
        </div>
      </div>

      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
        <div className="text-[6px] text-[#171717]">Click to view full resume</div>
      </div>
    </div>
  )

  const anchorPosition = anchorRef?.current
    ? (() => {
        const rect = anchorRef.current.getBoundingClientRect()
        const viewportPadding = 12
        const centeredLeft = rect.left + rect.width / 2
        const minLeft = viewportPadding + PREVIEW_WIDTH / 2
        const maxLeft = window.innerWidth - viewportPadding - PREVIEW_WIDTH / 2

        return {
          left: Math.min(maxLeft, Math.max(minLeft, centeredLeft)),
          top: rect.bottom + 8,
        }
      })()
    : null

  const activePosition = anchorPosition ?? position

  if (mounted && anchorRef?.current) {
    return createPortal(
      <AnimatePresence initial={false}>
        {isVisible ? (
          <m.div
            className="fixed -translate-x-1/2 z-[80] pointer-events-none origin-top"
            aria-hidden
            style={{ left: `${activePosition.left}px`, top: `${activePosition.top}px`, willChange: 'transform, opacity' }}
            initial={PREVIEW_MOTION.initial}
            animate={PREVIEW_MOTION.animate}
            exit={PREVIEW_MOTION.exit}
            transition={PREVIEW_TRANSITION}
          >
            {previewBody}
          </m.div>
        ) : null}
      </AnimatePresence>,
      document.body
    )
  }

  return (
    <AnimatePresence initial={false}>
      {isVisible ? (
        <m.div
          className="absolute left-1/2 top-full mt-2 -translate-x-1/2 z-50 pointer-events-none origin-top"
          aria-hidden
          style={{ willChange: 'transform, opacity' }}
          initial={PREVIEW_MOTION.initial}
          animate={PREVIEW_MOTION.animate}
          exit={PREVIEW_MOTION.exit}
          transition={PREVIEW_TRANSITION}
        >
          {previewBody}
        </m.div>
      ) : null}
    </AnimatePresence>
  )
}
