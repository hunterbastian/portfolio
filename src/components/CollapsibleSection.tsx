'use client'

import { AnimatePresence, m, useInView, useReducedMotion } from 'framer-motion'
import { Children, isValidElement, type ReactNode, useEffect, useRef, useState } from 'react'
import { MOTION_EASE_STANDARD, motionDelayMs, motionDurationMs } from '@/lib/motion'

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
 *  120ms   panel fades in, y 14 → 0
 *  280ms   content rows slide in (staggered 90ms)
 * ───────────────────────────────────────────────────────── */

const SECTION_TIMING = {
  panelAppear: 60, // panel starts appearing
  rowsAppear: 140, // child rows begin staggered reveal
  panelDuration: 240, // panel transition duration
  rowDuration: 280, // each child row transition duration
  rowStagger: 50, // stagger gap between child rows
}

const SECTION_PANEL = {
  initialOpacity: 0, // hidden before stage 1
  finalOpacity: 1, // visible at rest
  initialY: 8, // panel vertical offset before reveal
  finalY: 0, // resting panel position
  ease: MOTION_EASE_STANDARD,
}

const SECTION_ROW = {
  initialOpacity: 0, // hidden row before stage 2
  finalOpacity: 1, // visible row at rest
  initialY: 8, // row vertical offset before reveal
  finalY: 0, // resting row position
}

/* ─────────────────────────────────────────────────────────
 * LABEL ENTRANCE — simple fade-in (Notion-style)
 * ───────────────────────────────────────────────────────── */

const LABEL_TIMING = {
  start: 72, // heading label reveal starts
  duration: 320, // fade-in duration
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
  const contentDuration = motionDurationMs(300, prefersReducedMotion)
  const contentOpacityDuration = motionDurationMs(250, prefersReducedMotion)
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
            ease: MOTION_EASE_STANDARD,
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
              height: { duration: contentDuration, ease: MOTION_EASE_STANDARD },
              opacity: { duration: contentOpacityDuration, ease: MOTION_EASE_STANDARD },
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
