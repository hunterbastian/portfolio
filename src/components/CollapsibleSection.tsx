'use client'

import { AnimatePresence, m, useInView, useReducedMotion } from 'framer-motion'
import { Children, isValidElement, type ReactNode, useEffect, useRef, useState } from 'react'
import { MOTION_EASE_SOFT, MOTION_SPRING_HEAVY, motionDelayMs, motionDurationMs } from '@/lib/motion'
import {
  LABEL_TIMING,
  SECTION_PANEL_STATE,
  SECTION_ROW_STATE,
  SECTION_STAGE,
  SECTION_TIMING,
  SECTION_TITLE_STAGE,
  getCollapsibleSectionClassName,
  getSectionRowDelay,
  getSectionRowKey,
  getSectionTitleMotion,
  getSectionTransitionDuration,
  getStagedSectionMotion,
  isSectionStageReady,
  scheduleSectionEntranceStages,
  scheduleSectionTitleEntrance,
  splitSectionTitle,
  type SectionKind,
} from '@/lib/collapsible-section'
import * as Glyphs from './pixel/glyphs'

const KIND_GLYPHS = {
  work: Glyphs.Work,
  writing: Glyphs.Writing,
  games: Glyphs.Games,
  contact: Glyphs.Contact,
  archive: Glyphs.Archive,
  now: Glyphs.Now,
} as const

function SectionTitle({ title }: { title: string }) {
  const splitTitle = splitSectionTitle(title)
  if (!splitTitle.number) return <>{splitTitle.label}</>
  return (
    <>
      <span className="text-accent/70">{splitTitle.number}</span>{' '}{splitTitle.label}
    </>
  )
}

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
  /** Optional pixel glyph rendered before the title text — signature marker. */
  kind?: SectionKind
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

/* Height animation uses a spring for organic open/close feel */
const HEIGHT_SPRING = MOTION_SPRING_HEAVY

/* ─────────────────────────────────────────────────────────
 * LABEL ENTRANCE — gentle fade-in
 * ───────────────────────────────────────────────────────── */

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
  kind,
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
  const sectionClasses = getCollapsibleSectionClassName({
    className,
    closedClassName,
    isOpen,
    openClassName,
  })

  useEffect(() => {
    const timers = scheduleSectionEntranceStages({
      hasPlayed: hasPlayedSectionEntranceRef.current,
      initialLoadDelayMs,
      isInView,
      isOpen,
      prefersReducedMotion,
      scheduleStage: (nextStage, delay, markPlayed) => (
        setTimeout(() => {
          setStage(nextStage)
          if (markPlayed) {
            hasPlayedSectionEntranceRef.current = true
          }
        }, delay)
      ),
      setHasPlayed: (hasPlayed) => {
        hasPlayedSectionEntranceRef.current = hasPlayed
      },
      setStage,
    })

    return () => timers.forEach(clearTimeout)
  }, [initialLoadDelayMs, isOpen, isInView, prefersReducedMotion])

  useEffect(() => {
    const timers = scheduleSectionTitleEntrance({
      hasPlayed: hasPlayedTitleEntranceRef.current,
      initialLoadDelayMs,
      isTitleInView,
      prefersReducedMotion,
      scheduleVisible: (delay) => (
        setTimeout(() => {
          setTitleStage(SECTION_TITLE_STAGE.visible)
          hasPlayedTitleEntranceRef.current = true
        }, delay)
      ),
      setHasPlayed: (hasPlayed) => {
        hasPlayedTitleEntranceRef.current = hasPlayed
      },
      setTitleStage,
    })

    return () => timers.forEach(clearTimeout)
  }, [initialLoadDelayMs, isTitleInView, prefersReducedMotion, title])

  return (
    <section id={id} className={sectionClasses}>
      <div className="section-heading-row relative mx-auto flex min-h-6 w-full max-w-[980px] items-center gap-4">
        <m.h2
          ref={titleRef}
          className="section-heading m-0 shrink-0 font-mono text-[10px] leading-none tracking-[0.1em]"
          initial={false}
          animate={getSectionTitleMotion(titleStage)}
          transition={{
            duration: motionDurationMs(LABEL_TIMING.duration, prefersReducedMotion),
            ease: MOTION_EASE_SOFT,
          }}
        >
          {(() => {
            const Glyph = kind ? KIND_GLYPHS[kind] : null
            const content = (
              <>
                {Glyph ? (
                  <Glyph
                    size={10}
                    className="text-muted-foreground/70"
                    style={{ marginRight: 8 }}
                  />
                ) : null}
                <SectionTitle title={title} />
              </>
            )
            return onToggle ? (
              <button
                type="button"
                onClick={onToggle}
                className="m-0 inline-flex min-h-[44px] items-center cursor-pointer border-none bg-transparent p-0 font-mono text-[10px] uppercase tracking-[0.1em] transition-opacity duration-200 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:text-[10px]"
                aria-expanded={isOpen}
                aria-controls={contentId}
              >
                {content}
              </button>
            ) : (
              <span className="inline-flex items-center">{content}</span>
            )
          })()}
        </m.h2>
        <div aria-hidden className="section-heading-rule" />
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
              animate={getStagedSectionMotion({
                ...SECTION_PANEL_STATE,
                ready: isSectionStageReady(stage, SECTION_STAGE.panel),
                skipStaging: skipContentStaging,
              })}
              transition={{
                duration: getSectionTransitionDuration(skipContentStaging, panelDuration),
                ease: MOTION_EASE_SOFT,
              }}
            >
              {contentItems.map((child, index) => (
                <m.div
                  key={getSectionRowKey(isValidElement(child) ? child.key : null, index)}
                  initial={false}
                  animate={getStagedSectionMotion({
                    ...SECTION_ROW_STATE,
                    ready: isSectionStageReady(stage, SECTION_STAGE.rows),
                    skipStaging: skipContentStaging,
                  })}
                  transition={{
                    duration: getSectionTransitionDuration(skipContentStaging, rowDuration),
                    delay: getSectionRowDelay({ index, rowStagger, skipStaging: skipContentStaging, stage }),
                    ease: MOTION_EASE_SOFT,
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
