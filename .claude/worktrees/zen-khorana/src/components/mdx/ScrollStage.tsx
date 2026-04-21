'use client'

import { type ReactNode, useRef } from 'react'
import { m, useInView, useReducedMotion } from 'framer-motion'
import { MOTION_EASE_SOFT, motionDurationMs, motionDelayMs } from '@/lib/motion'

interface ScrollStageProps {
  /** Chapter number label (e.g. "01") */
  chapter: string
  /** Optional chapter title */
  title?: string
  children: ReactNode
  className?: string
}

const DURATION_MS = 600
const STAGGER_MS = 120

export default function ScrollStage({
  chapter,
  title,
  children,
  className,
}: ScrollStageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px 0px -100px 0px' })
  const prefersReducedMotion = useReducedMotion() ?? false

  const duration = motionDurationMs(DURATION_MS, prefersReducedMotion)

  return (
    <section
      ref={ref}
      data-chapter={chapter}
      data-chapter-title={title ?? ''}
      className={`my-16 first:mt-0 ${className ?? ''}`}
    >
      <div className="not-prose">
        {/* Chapter label + rule */}
        <m.div
          className="mb-5 flex items-center gap-3"
          initial={{ opacity: 0, x: -8 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
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
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{
              duration,
              delay: motionDelayMs(STAGGER_MS, prefersReducedMotion),
              ease: MOTION_EASE_SOFT,
            }}
          >
            {title}
          </m.h2>
        )}
      </div>

      {/* Content — inherits prose styling from parent */}
      <m.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{
          duration,
          delay: motionDelayMs(title ? STAGGER_MS * 2 : STAGGER_MS, prefersReducedMotion),
          ease: MOTION_EASE_SOFT,
        }}
      >
        {children}
      </m.div>
    </section>
  )
}
