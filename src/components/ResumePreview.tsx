'use client'

import { type RefObject, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
    filter: 'blur(1.8px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
  },
  exit: {
    opacity: 0,
    y: -5,
    scale: 0.98,
    filter: 'blur(1px)',
  },
}

const PREVIEW_TRANSITION = {
  y: { type: 'spring' as const, stiffness: 430, damping: 31, mass: 0.78 },
  scale: { type: 'spring' as const, stiffness: 500, damping: 34, mass: 0.8 },
  opacity: { duration: 0.16, ease: [0.22, 1, 0.36, 1] as const },
  filter: { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const },
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
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isVisible, anchorRef])

  const previewBody = (
    <div
      className="relative bg-white border border-gray-300 rounded-lg shadow-2xl overflow-hidden"
      style={{ width: `${PREVIEW_WIDTH}px`, height: `${PREVIEW_HEIGHT}px` }}
    >
      <div className="bg-gray-100 px-3 py-2 border-b border-gray-200">
        <div className="text-[8px] font-semibold text-gray-700">HUNTER BASTIAN</div>
        <div className="text-[6px] text-gray-500">Resume Preview</div>
      </div>

      <div className="p-3 space-y-2">
        <div className="space-y-1">
          <div className="h-1 bg-gray-800 rounded w-3/4"></div>
          <div className="h-0.5 bg-gray-400 rounded w-full"></div>
          <div className="h-0.5 bg-gray-400 rounded w-5/6"></div>
        </div>

        <div className="space-y-1">
          <div className="h-0.5 bg-gray-600 rounded w-1/2"></div>
          <div className="space-y-0.5">
            <div className="h-0.5 bg-gray-300 rounded w-full"></div>
            <div className="h-0.5 bg-gray-300 rounded w-4/5"></div>
            <div className="h-0.5 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="h-0.5 bg-gray-600 rounded w-1/3"></div>
          <div className="flex gap-1">
            <div className="h-3 w-6 bg-blue-200 rounded text-[4px] flex items-center justify-center">JS</div>
            <div className="h-3 w-8 bg-green-200 rounded text-[4px] flex items-center justify-center">React</div>
            <div className="h-3 w-6 bg-purple-200 rounded text-[4px] flex items-center justify-center">TS</div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="h-0.5 bg-gray-600 rounded w-2/5"></div>
          <div className="h-0.5 bg-gray-300 rounded w-4/5"></div>
          <div className="h-0.5 bg-gray-300 rounded w-3/5"></div>
        </div>

        <div className="space-y-1">
          <div className="h-0.5 bg-gray-600 rounded w-1/4"></div>
          <div className="h-0.5 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>

      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
        <div className="text-[6px] text-gray-400">Click to view full resume</div>
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
      <AnimatePresence>
        {isVisible ? (
          <motion.div
            className="fixed -translate-x-1/2 z-[80] pointer-events-none origin-top"
            aria-hidden
            style={{ left: `${activePosition.left}px`, top: `${activePosition.top}px`, willChange: 'transform, opacity, filter' }}
            initial={PREVIEW_MOTION.initial}
            animate={PREVIEW_MOTION.animate}
            exit={PREVIEW_MOTION.exit}
            transition={PREVIEW_TRANSITION}
          >
            {previewBody}
          </motion.div>
        ) : null}
      </AnimatePresence>,
      document.body
    )
  }

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          className="absolute left-1/2 top-full mt-2 -translate-x-1/2 z-50 pointer-events-none origin-top"
          aria-hidden
          style={{ willChange: 'transform, opacity, filter' }}
          initial={PREVIEW_MOTION.initial}
          animate={PREVIEW_MOTION.animate}
          exit={PREVIEW_MOTION.exit}
          transition={PREVIEW_TRANSITION}
        >
          {previewBody}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
