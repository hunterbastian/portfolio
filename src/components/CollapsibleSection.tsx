'use client'

import { AnimatePresence, motion, useAnimationControls, useInView, useReducedMotion } from 'framer-motion'
import { Children, isValidElement, type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { MOTION_EASE_STANDARD, motionDelayMs, motionDurationMs } from '@/lib/motion'

interface CollapsibleSectionProps {
  id: string
  title: string
  isOpen: boolean
  onToggle: () => void
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
  initialBlur: 'blur(1.8px)', // slight softness before reveal
  finalBlur: 'blur(0px)', // crisp at rest
  ease: MOTION_EASE_STANDARD,
}

const SECTION_ROW = {
  initialOpacity: 0, // hidden row before stage 2
  finalOpacity: 1, // visible row at rest
  initialY: 16, // row vertical offset before reveal
  finalY: 0, // resting row position
  initialBlur: 'blur(1.4px)', // slight softness before reveal
  finalBlur: 'blur(0px)', // crisp at rest
}

const BUTTON_COLORS = {
  backgroundBase: 'color-mix(in srgb, var(--background) 65%, transparent)',
  backgroundPressed: 'color-mix(in srgb, var(--foreground) 12%, var(--background) 88%)',
  borderBase: 'color-mix(in srgb, var(--border) 90%, transparent)',
  borderPressed: 'color-mix(in srgb, var(--foreground) 28%, var(--border) 72%)',
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
  initialBlur: 'blur(4px)', // softened character before reveal
  finalBlur: 'blur(0px)', // crisp character at rest
  ease: MOTION_EASE_STANDARD,
}

const TOGGLE_BUTTON_ENTRANCE = {
  delay: 56, // follows the first label characters
  duration: 320, // button entrance duration
  initialOpacity: 0, // hidden before heading reveal
  finalOpacity: 1, // visible at rest
  initialScale: 0.9, // slight downscale before reveal
  finalScale: 1, // resting size
  initialBlur: 'blur(3px)', // softened before reveal
  finalBlur: 'blur(0px)', // crisp at rest
  ease: MOTION_EASE_STANDARD,
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
}: CollapsibleSectionProps) {
  const prefersReducedMotion = useReducedMotion() ?? false
  const buttonControls = useAnimationControls()
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
  const iconDuration = motionDurationMs(240, prefersReducedMotion)
  const panelDuration = motionDurationMs(SECTION_TIMING.panelDuration, prefersReducedMotion)
  const rowDuration = motionDurationMs(SECTION_TIMING.rowDuration, prefersReducedMotion)
  const rowStagger = motionDelayMs(SECTION_TIMING.rowStagger, prefersReducedMotion)
  const contentPanelClassName = contentClassName ?? ''
  const contentItems = Children.toArray(children)
  const titleChars = useMemo(() => Array.from(title.toUpperCase()), [title])
  const sectionClasses = [className, isOpen ? openClassName : closedClassName, 'transition-[padding] duration-300']
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
    buttonControls.set({
      backgroundColor: BUTTON_COLORS.backgroundBase,
      borderColor: BUTTON_COLORS.borderBase,
      scale: 1,
    })
  }, [buttonControls])

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

  const handleToggle = () => {
    onToggle()

    if (prefersReducedMotion) {
      return
    }

    buttonControls.start({
      backgroundColor: [BUTTON_COLORS.backgroundBase, BUTTON_COLORS.backgroundPressed, BUTTON_COLORS.backgroundBase],
      borderColor: [BUTTON_COLORS.borderBase, BUTTON_COLORS.borderPressed, BUTTON_COLORS.borderBase],
      scale: [1, 0.94, 1],
      transition: {
        duration: 0.52,
        ease: MOTION_EASE_STANDARD,
        times: [0, 0.32, 1],
      },
    })
  }

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
                  filter: titleStage >= 1 ? LABEL_CHAR.finalBlur : LABEL_CHAR.initialBlur,
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
        <motion.div
          className="absolute -left-8 top-1/2 sm:-left-9"
          initial={false}
          animate={{
            opacity: titleStage >= 1 ? TOGGLE_BUTTON_ENTRANCE.finalOpacity : TOGGLE_BUTTON_ENTRANCE.initialOpacity,
            scale: titleStage >= 1 ? TOGGLE_BUTTON_ENTRANCE.finalScale : TOGGLE_BUTTON_ENTRANCE.initialScale,
            filter: titleStage >= 1 ? TOGGLE_BUTTON_ENTRANCE.finalBlur : TOGGLE_BUTTON_ENTRANCE.initialBlur,
          }}
          transition={{
            duration: motionDurationMs(TOGGLE_BUTTON_ENTRANCE.duration, prefersReducedMotion),
            delay: titleStage >= 1 ? motionDelayMs(TOGGLE_BUTTON_ENTRANCE.delay, prefersReducedMotion) : 0,
            ease: TOGGLE_BUTTON_ENTRANCE.ease,
          }}
          style={{ pointerEvents: titleStage >= 1 ? 'auto' : 'none' }}
        >
          <motion.button
            type="button"
            onClick={handleToggle}
            aria-expanded={isOpen}
            aria-controls={contentId}
            aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${title}`}
            initial={false}
            animate={buttonControls}
            className="group inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-border/90 bg-background/65 text-muted-foreground shadow-[0_1px_2px_rgba(46,52,64,0.08),inset_0_1px_0_rgba(255,255,255,0.38)] backdrop-blur-[1px] transition-all duration-300 hover:border-primary/45 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <motion.span
              initial={false}
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: iconDuration, ease: MOTION_EASE_STANDARD }}
              className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground/[0.06] text-foreground/70 shadow-inner transition-colors duration-300 group-hover:text-foreground"
            >
              <svg className="h-[9px] w-[9px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" />
              </svg>
            </motion.span>
          </motion.button>
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            initial={{ height: 0, opacity: 0, filter: 'blur(1.8px)' }}
            animate={{ height: 'auto', opacity: 1, filter: 'blur(0px)' }}
            exit={{ height: 0, opacity: 0, filter: 'blur(1.8px)' }}
            transition={{
              height: { duration: contentDuration, ease: MOTION_EASE_STANDARD },
              opacity: { duration: contentOpacityDuration, ease: MOTION_EASE_STANDARD },
              filter: { duration: contentOpacityDuration, ease: MOTION_EASE_STANDARD },
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
                filter: stage >= 1 ? SECTION_PANEL.finalBlur : SECTION_PANEL.initialBlur,
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
                    filter: stage >= 2 ? SECTION_ROW.finalBlur : SECTION_ROW.initialBlur,
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
