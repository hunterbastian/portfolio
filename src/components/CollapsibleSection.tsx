'use client'

import { AnimatePresence, m, useInView, useReducedMotion } from 'framer-motion'
import { Children, isValidElement, type ReactNode, useEffect, useRef, useState } from 'react'
import { MOTION_EASE_SOFT, motionDelayMs, motionDurationMs } from '@/lib/motion'

interface CollapsibleSectionProps {
  id: string
  title: string
  isOpen: boolean
  onToggle?: () => void
  children: ReactNode
  className?: string
  openClassName?: string
  closedClassName?: string
  contentClassName?: string
  initialLoadDelayMs?: number
  /** Skip inner content staging animation — content renders immediately when open. Use for sections containing LCP elements. */
  skipContentStaging?: boolean
}

/* ─────────────────────────────────────────────────────────
 * COLLAPSIBLE SECTION STORYBOARD
 *
 * Read top-to-bottom. Each `at` value is ms after section opens.
 *
 *    0ms   waiting for section open trigger
 *   80ms   panel fades in, y 12 → 0 (spring)
 *  200ms   content rows rise into place (staggered 70ms, spring)
 * ───────────────────────────────────────────────────────── */

const SECTION_TIMING = {
  panelAppear: 80,      // panel starts appearing
  rowsAppear: 200,      // child rows begin staggered reveal
  panelDuration: 380,   // panel fade-in duration
  rowDuration: 420,     // each child row transition duration
  rowStagger: 70,       // wider stagger — each row gets its moment
}

const SECTION_PANEL = {
  initialOpacity: 0,    // hidden before stage 1
  finalOpacity: 1,      // visible at rest
  initialY: 12,         // more travel for visible glide
  finalY: 0,            // resting panel position
  ease: MOTION_EASE_SOFT,
}

const SECTION_ROW = {
  initialOpacity: 0,    // hidden row before stage 2
  finalOpacity: 1,      // visible row at rest
  initialY: 12,         // rows rise from further down
  finalY: 0,            // resting row position
}

/* Height animation uses a spring for organic open/close feel */
const HEIGHT_SPRING = { type: 'spring' as const, stiffness: 200, damping: 28, mass: 0.9 }

/* ─────────────────────────────────────────────────────────
 * LABEL ENTRANCE — gentle fade-in
 * ───────────────────────────────────────────────────────── */

const LABEL_TIMING = {
  start: 72,            // heading label reveal starts
  duration: 420,        // longer, gentler fade-in
}

export default function CollapsibleSection({
  id,
  title,
  isOpen,
  onToggle,
  children,
  className,
  openClassName,
  closedClassName,
  contentClassName,
  initialLoadDelayMs = 0,
  skipContentStaging = false,
}: CollapsibleSectionProps) {
  const prefersReducedMotion = useReducedMotion() ?? false
  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const hasPlayedSectionEntranceRef = useRef(false)
  const hasPlayedTitleEntranceRef = useRef(false)
  const isInView = useInView(contentRef, { once: true, amount: 0.18 })
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.7 })
  const [stage, setStage] = useState(0)
  const [titleStage, setTitleStage] = useState(0)

  const contentId = `${id}-content`
  const contentOpacityDuration = motionDurationMs(340, prefersReducedMotion)
  const panelDuration = motionDurationMs(SECTION_TIMING.panelDuration, prefersReducedMotion)
  const rowDuration = motionDurationMs(SECTION_TIMING.rowDuration, prefersReducedMotion)
  const rowStagger = motionDelayMs(SECTION_TIMING.rowStagger, prefersReducedMotion)
  const contentPanelClassName = contentClassName ?? ''
  const contentItems = Children.toArray(children)
  const sectionClasses = [className, isOpen ? openClassName : closedClassName, 'performance-section transition-[padding] duration-300']
    .filter(Boolean)
    .join(' ')

  useEffect(() => {
    if (!isOpen) {
      setStage(0)
      return
    }

    if (!isInView) {
      setStage(0)
      return
    }

    if (prefersReducedMotion) {
      setStage(2)
      hasPlayedSectionEntranceRef.current = true
      return
    }

    const initialDelay = hasPlayedSectionEntranceRef.current ? 0 : initialLoadDelayMs
    setStage(0)
    const timers: Array<ReturnType<typeof setTimeout>> = []

    timers.push(setTimeout(() => setStage(1), initialDelay + SECTION_TIMING.panelAppear))
    timers.push(
      setTimeout(() => {
        setStage(2)
        hasPlayedSectionEntranceRef.current = true
      }, initialDelay + SECTION_TIMING.rowsAppear)
    )

    return () => timers.forEach(clearTimeout)
  }, [initialLoadDelayMs, isOpen, isInView, prefersReducedMotion])

  useEffect(() => {
    if (!isTitleInView) {
      setTitleStage(0)
      return
    }

    if (prefersReducedMotion) {
      setTitleStage(1)
      hasPlayedTitleEntranceRef.current = true
      return
    }

    if (hasPlayedTitleEntranceRef.current) {
      setTitleStage(1)
      return
    }

    setTitleStage(0)
    const timer = setTimeout(() => {
      setTitleStage(1)
      hasPlayedTitleEntranceRef.current = true
    }, initialLoadDelayMs + LABEL_TIMING.start)
    return () => clearTimeout(timer)
  }, [initialLoadDelayMs, isTitleInView, prefersReducedMotion, title])

  return (
    <section id={id} className={sectionClasses}>
      <div className="relative mx-auto flex min-h-6 w-full max-w-[560px] items-center justify-start">
        <m.h2
          ref={titleRef}
          className="section-heading m-0 font-mono text-[12px] leading-none tracking-[0.06em]"
          initial={false}
          animate={{
            opacity: titleStage >= 1 ? 1 : 0,
            y: titleStage >= 1 ? 0 : 6,
          }}
          transition={{
            duration: motionDurationMs(LABEL_TIMING.duration, prefersReducedMotion),
            ease: MOTION_EASE_SOFT,
          }}
        >
          {onToggle ? (
            <button
              type="button"
              onClick={onToggle}
              className="inline-flex items-center cursor-pointer bg-transparent border-none p-0 m-0 font-mono text-[12px] tracking-[0.06em] uppercase hover:opacity-80 transition-opacity duration-200"
              aria-expanded={isOpen}
              aria-controls={contentId}
            >
              {title}
            </button>
          ) : (
            title
          )}
        </m.h2>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <m.div
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: prefersReducedMotion ? { duration: 0 } : HEIGHT_SPRING,
              opacity: { duration: contentOpacityDuration, ease: MOTION_EASE_SOFT },
            }}
            className="overflow-hidden"
          >
            <m.div
              ref={contentRef}
              className={contentPanelClassName}
              initial={false}
              animate={{
                opacity: skipContentStaging ? SECTION_PANEL.finalOpacity : (stage >= 1 ? SECTION_PANEL.finalOpacity : SECTION_PANEL.initialOpacity),
                y: skipContentStaging ? SECTION_PANEL.finalY : (stage >= 1 ? SECTION_PANEL.finalY : SECTION_PANEL.initialY),
              }}
              transition={{
                duration: skipContentStaging ? 0 : panelDuration,
                ease: SECTION_PANEL.ease,
              }}
            >
              {contentItems.map((child, index) => (
                <m.div
                  key={isValidElement(child) && child.key != null ? String(child.key) : `section-row-${index}`}
                  initial={false}
                  animate={{
                    opacity: skipContentStaging ? SECTION_ROW.finalOpacity : (stage >= 2 ? SECTION_ROW.finalOpacity : SECTION_ROW.initialOpacity),
                    y: skipContentStaging ? SECTION_ROW.finalY : (stage >= 2 ? SECTION_ROW.finalY : SECTION_ROW.initialY),
                  }}
                  transition={{
                    duration: skipContentStaging ? 0 : rowDuration,
                    delay: skipContentStaging ? 0 : (stage >= 2 ? index * rowStagger : 0),
                    ease: SECTION_PANEL.ease,
                  }}
                >
                  {child}
                </m.div>
              ))}
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </section>
  )
}
