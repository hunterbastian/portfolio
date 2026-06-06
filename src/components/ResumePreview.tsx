'use client'

import { type RefObject, useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { createPortal } from 'react-dom'
import {
  RESUME_PREVIEW_FOOTER_TEXT,
  RESUME_PREVIEW_HEADER,
  RESUME_PREVIEW_MOTION,
  RESUME_PREVIEW_PLACEHOLDER_SECTIONS,
  RESUME_PREVIEW_TRANSITION,
  RESUME_PREVIEW_HEIGHT,
  RESUME_PREVIEW_WIDTH,
  type ResumePreviewPlaceholderSection,
  activateResumePreviewPositionTracking,
  getResumePreviewActivePosition,
  getResumePreviewRenderMode,
} from '@/lib/resume-preview'

interface ResumePreviewProps {
  isVisible: boolean
  anchorRef?: RefObject<HTMLElement | null>
}

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

function ResumePreviewPlaceholderBlock({
  section,
}: {
  section: ResumePreviewPlaceholderSection
}) {
  return (
    <div className="space-y-1">
      <div className={section.headingClassName}></div>
      {section.lineClassNames ? (
        <div className="space-y-0.5">
          {section.lineClassNames.map((className, index) => (
            <div key={`${className}-${index}`} className={className}></div>
          ))}
        </div>
      ) : null}
      {section.skillChips ? (
        <div className="flex gap-1">
          {section.skillChips.map((chip) => (
            <div key={chip.label} className={chip.className}>{chip.label}</div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default function ResumePreview({ isVisible, anchorRef }: ResumePreviewProps) {
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState({ left: 0, top: 0 })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    return activateResumePreviewPositionTracking({
      addEventListener: (type, listener, options) => window.addEventListener(type, listener, options),
      getAnchorRect: () => anchorRef?.current?.getBoundingClientRect(),
      getViewportWidth: () => window.innerWidth,
      isVisible,
      removeEventListener: (type, listener, options) => window.removeEventListener(type, listener, options),
      setPosition,
    })
  }, [isVisible, anchorRef])

  const previewBody = (
    <div
      className="relative overflow-hidden border border-gray-300 bg-card shadow-2xl"
      style={{ width: `${RESUME_PREVIEW_WIDTH}px`, height: `${RESUME_PREVIEW_HEIGHT}px` }}
    >
      <div className="bg-gray-100 px-3 py-2 border-b border-gray-200">
        <div className="text-[8px] font-semibold text-[#171717]">{RESUME_PREVIEW_HEADER.name}</div>
        <div className="text-[6px] text-[#171717]">{RESUME_PREVIEW_HEADER.subtitle}</div>
      </div>

      <div className="p-3 space-y-2">
        {RESUME_PREVIEW_PLACEHOLDER_SECTIONS.map((section) => (
          <ResumePreviewPlaceholderBlock key={section.headingClassName} section={section} />
        ))}
      </div>

      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
        <div className="text-[6px] text-[#171717]">{RESUME_PREVIEW_FOOTER_TEXT}</div>
      </div>
    </div>
  )

  const anchorElement = anchorRef?.current ?? null
  const activePosition = getResumePreviewActivePosition({
    anchorRect: anchorElement?.getBoundingClientRect(),
    fallbackPosition: position,
    viewportWidth: mounted ? window.innerWidth : 0,
  })
  const renderMode = getResumePreviewRenderMode({
    hasAnchor: Boolean(anchorElement),
    mounted,
  })

  if (renderMode === 'portal') {
    return createPortal(
      <AnimatePresence initial={false}>
        {isVisible ? (
          <m.div
            className="fixed -translate-x-1/2 z-[80] pointer-events-none origin-top"
            aria-hidden
            style={{ left: `${activePosition.left}px`, top: `${activePosition.top}px`, willChange: 'transform, opacity' }}
            initial={RESUME_PREVIEW_MOTION.initial}
            animate={RESUME_PREVIEW_MOTION.animate}
            exit={RESUME_PREVIEW_MOTION.exit}
            transition={RESUME_PREVIEW_TRANSITION}
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
          initial={RESUME_PREVIEW_MOTION.initial}
          animate={RESUME_PREVIEW_MOTION.animate}
          exit={RESUME_PREVIEW_MOTION.exit}
          transition={RESUME_PREVIEW_TRANSITION}
        >
          {previewBody}
        </m.div>
      ) : null}
    </AnimatePresence>
  )
}
