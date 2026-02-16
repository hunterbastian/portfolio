'use client'

import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { Children, isValidElement, type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { MOTION_EASE_STANDARD, motionDelayMs, motionDurationMs } from '@/lib/motion'

interface CollapsibleSectionProps {
  id: string
  title: string
  isOpen: boolean
  children: ReactNode
  className?: string
  openClassName?: string
  closedClassName?: string
  contentClassName?: string
  initialLoadDelayMs?: number
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

/* ─────────────────────────────────────────────────────────
 * LABEL RHYTHM STORYBOARD
 *
 * Read top-to-bottom. Each `at` value is ms after label enters view.
 *
 *    0ms   waiting for heading in-view
 *   60ms   first character appears
 *  200ms   remaining characters reveal (staggered 22ms)
 * ───────────────────────────────────────────────────────── */

const LABEL_TIMING = {
  start: 72, // heading label reveal starts
  charDuration: 260, // each character transition duration
  charStagger: 24, // stagger gap between characters
}

const LABEL_CHAR = {
  initialOpacity: 0, // hidden character before reveal
  finalOpacity: 1, // visible character at rest
  initialY: 8, // vertical offset before reveal
  finalY: 0, // resting character position
  initialScale: 0.96, // slight size dip before reveal
  finalScale: 1, // resting size
  ease: MOTION_EASE_STANDARD,
}

export default function CollapsibleSection({
  id,
  title,
  isOpen,
  children,
  className,
  openClassName,
  closedClassName,
  contentClassName,
  initialLoadDelayMs = 0,
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
  const titleChars = useMemo(() => Array.from(title.toUpperCase()), [title])
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

    const initialDelay = hasPlayedTitleEntranceRef.current ? 0 : initialLoadDelayMs
    setTitleStage(0)
    const timer = setTimeout(() => {
      setTitleStage(1)
      hasPlayedTitleEntranceRef.current = true
    }, initialDelay + LABEL_TIMING.start)
    return () => clearTimeout(timer)
  }, [initialLoadDelayMs, isTitleInView, prefersReducedMotion, title])

  return (
    <section id={id} className={sectionClasses}>
      <div className="relative mx-auto flex min-h-6 w-full max-w-2xl items-center justify-start">
        <h2 ref={titleRef} className="section-heading m-0 font-code text-sm leading-none" aria-label={title}>
          <span className="sr-only">{title}</span>
          <span aria-hidden className="inline-flex items-center">
            {titleChars.map((char, index) => (
              <motion.span
                key={`${id}-label-char-${index}`}
                className="inline-block whitespace-pre"
                initial={false}
                animate={{
                  opacity: titleStage >= 1 ? LABEL_CHAR.finalOpacity : LABEL_CHAR.initialOpacity,
                  y: titleStage >= 1 ? LABEL_CHAR.finalY : LABEL_CHAR.initialY,
                  scale: titleStage >= 1 ? LABEL_CHAR.finalScale : LABEL_CHAR.initialScale,
                }}
                transition={{
                  duration: motionDurationMs(LABEL_TIMING.charDuration, prefersReducedMotion),
                  delay: titleStage >= 1 ? motionDelayMs(index * LABEL_TIMING.charStagger, prefersReducedMotion) : 0,
                  ease: LABEL_CHAR.ease,
                }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        </h2>
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
              ref={contentRef}
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
