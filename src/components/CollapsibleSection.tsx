'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Children, isValidElement, type ReactNode, useEffect, useState } from 'react'
import { MOTION_EASE_STANDARD, motionDelayMs, motionDurationMs } from '@/lib/motion'

interface CollapsibleSectionProps {
  id: string
  title: string
  isOpen: boolean
  onToggle: () => void
  children: ReactNode
  className?: string
  contentClassName?: string
}

/* ─────────────────────────────────────────────────────────
 * COLLAPSIBLE SECTION STORYBOARD
 *
 * Read top-to-bottom. Each `at` value is ms after section opens.
 *
 *    0ms   waiting for section open trigger
 *  120ms   panel fades in, y 14 → 0
 *  280ms   content rows slide in (staggered 90ms)
 * ───────────────────────────────────────────────────────── */

const SECTION_TIMING = {
  panelAppear: 120, // panel starts appearing
  rowsAppear: 280, // child rows begin staggered reveal
  panelDuration: 380, // panel transition duration
  rowDuration: 420, // each child row transition duration
  rowStagger: 90, // stagger gap between child rows
}

const SECTION_PANEL = {
  initialOpacity: 0, // hidden before stage 1
  finalOpacity: 1, // visible at rest
  initialY: 14, // panel vertical offset before reveal
  finalY: 0, // resting panel position
  ease: MOTION_EASE_STANDARD,
}

const SECTION_ROW = {
  initialOpacity: 0, // hidden row before stage 2
  finalOpacity: 1, // visible row at rest
  initialY: 16, // row vertical offset before reveal
  finalY: 0, // resting row position
}

export default function CollapsibleSection({
  id,
  title,
  isOpen,
  onToggle,
  children,
  className,
  contentClassName,
}: CollapsibleSectionProps) {
  const prefersReducedMotion = useReducedMotion() ?? false
  const [stage, setStage] = useState(0)

  const contentId = `${id}-content`
  const contentDuration = motionDurationMs(300, prefersReducedMotion)
  const contentOpacityDuration = motionDurationMs(250, prefersReducedMotion)
  const iconDuration = motionDurationMs(240, prefersReducedMotion)
  const panelDuration = motionDurationMs(SECTION_TIMING.panelDuration, prefersReducedMotion)
  const rowDuration = motionDurationMs(SECTION_TIMING.rowDuration, prefersReducedMotion)
  const rowStagger = motionDelayMs(SECTION_TIMING.rowStagger, prefersReducedMotion)
  const contentPanelClassName = contentClassName ?? ''
  const contentItems = Children.toArray(children)

  useEffect(() => {
    if (!isOpen) {
      setStage(0)
      return
    }

    if (prefersReducedMotion) {
      setStage(2)
      return
    }

    setStage(0)
    const timers: Array<ReturnType<typeof setTimeout>> = []

    timers.push(setTimeout(() => setStage(1), SECTION_TIMING.panelAppear))
    timers.push(setTimeout(() => setStage(2), SECTION_TIMING.rowsAppear))

    return () => timers.forEach(clearTimeout)
  }, [isOpen, prefersReducedMotion])

  return (
    <section id={id} className={className}>
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
        <h2 className="section-heading font-inter text-sm">{title}</h2>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={contentId}
          aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${title}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-300 hover:text-foreground hover:border-primary/45 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <motion.span
            initial={false}
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: iconDuration, ease: MOTION_EASE_STANDARD }}
            className="flex items-center justify-center"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </motion.span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: contentDuration, ease: MOTION_EASE_STANDARD },
              opacity: { duration: contentOpacityDuration, ease: MOTION_EASE_STANDARD },
            }}
            className="overflow-hidden"
          >
            <motion.div
              className={contentPanelClassName}
              initial={false}
              animate={{
                opacity: stage >= 1 ? SECTION_PANEL.finalOpacity : SECTION_PANEL.initialOpacity,
                y: stage >= 1 ? SECTION_PANEL.finalY : SECTION_PANEL.initialY,
              }}
              transition={{
                duration: panelDuration,
                ease: SECTION_PANEL.ease,
              }}
            >
              {contentItems.map((child, index) => (
                <motion.div
                  key={isValidElement(child) && child.key != null ? String(child.key) : `section-row-${index}`}
                  initial={false}
                  animate={{
                    opacity: stage >= 2 ? SECTION_ROW.finalOpacity : SECTION_ROW.initialOpacity,
                    y: stage >= 2 ? SECTION_ROW.finalY : SECTION_ROW.initialY,
                  }}
                  transition={{
                    duration: rowDuration,
                    delay: stage >= 2 ? index * rowStagger : 0,
                    ease: SECTION_PANEL.ease,
                  }}
                >
                  {child}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
