'use client'

import { type ReactNode, useRef } from 'react'
import { m, useInView, useReducedMotion } from 'framer-motion'
import {
  SCROLL_STAGE_DURATION_MS,
  getScrollStageClassName,
  getScrollStageContentAnimationState,
  getScrollStageContentDelayMs,
  getScrollStageRuleAnimationState,
  getScrollStageTitleAnimationState,
  getScrollStageTitleDelayMs,
} from '@/lib/scroll-stage'
import { MOTION_EASE_SOFT, motionDurationMs, motionDelayMs } from '@/lib/motion'

interface ScrollStageProps {
  /** Chapter number label (e.g. "01") */
  chapter: string
  /** Optional chapter title */
  title?: string
  children: ReactNode
  className?: string
}

export default function ScrollStage({
  chapter,
  title,
  children,
  className,
}: ScrollStageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px 0px -100px 0px' })
  const prefersReducedMotion = useReducedMotion() ?? false

  const duration = motionDurationMs(SCROLL_STAGE_DURATION_MS, prefersReducedMotion)

  return (
    <section
      ref={ref}
      data-chapter={chapter}
      data-chapter-title={title ?? ''}
      className={getScrollStageClassName(className)}
    >
      <div className="not-prose">
        {/* Chapter label + rule */}
        <m.div
          className="mb-5 flex items-center gap-3"
          initial={getScrollStageRuleAnimationState(false)}
          animate={getScrollStageRuleAnimationState(isInView)}
          transition={{ duration, ease: MOTION_EASE_SOFT }}
        >
          <span className="shrink-0 font-mono text-[11px] font-medium tracking-[0.12em] uppercase text-accent">
            {chapter}
          </span>
          <span className="h-px flex-1 bg-border" aria-hidden />
        </m.div>

        {/* Chapter title */}
        {title && (
          <m.h2
            className="mb-8 font-mono text-lg font-medium tracking-[0.01em] text-foreground sm:text-xl"
            initial={getScrollStageTitleAnimationState(false)}
            animate={getScrollStageTitleAnimationState(isInView)}
            transition={{
              duration,
              delay: motionDelayMs(getScrollStageTitleDelayMs(), prefersReducedMotion),
              ease: MOTION_EASE_SOFT,
            }}
          >
            {title}
          </m.h2>
        )}
      </div>

      {/* Content — inherits prose styling from parent */}
      <m.div
        initial={getScrollStageContentAnimationState(false)}
        animate={getScrollStageContentAnimationState(isInView)}
        transition={{
          duration,
          delay: motionDelayMs(getScrollStageContentDelayMs(Boolean(title)), prefersReducedMotion),
          ease: MOTION_EASE_SOFT,
        }}
      >
        {children}
      </m.div>
    </section>
  )
}
