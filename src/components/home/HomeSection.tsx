'use client'

import { m, useInView, useReducedMotion } from 'framer-motion'
import { useRef, type CSSProperties, type ReactNode } from 'react'
import {
  getHomeRevealInitialState,
  getHomeRevealMotionState,
  getHomeRevealShadowDelay,
  getHomeRevealTransition,
  getHomeSectionClassName,
  HOME_SECTION_RULE_CLASS_NAME,
  HOME_SECTION_TITLE_CLASS_NAME,
  shouldRevealHomeSection,
} from '@/lib/home-section'

type RevealStyle = CSSProperties & {
  '--reveal-shadow-delay': string
}

export function Reveal({ children, delayMs = 0 }: { children: ReactNode; delayMs?: number }) {
  const prefersReducedMotion = useReducedMotion() ?? false
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {
    once: true,
    amount: 0.2,
    margin: '0px 0px -12% 0px',
  })
  const revealed = shouldRevealHomeSection(isInView, prefersReducedMotion)
  const revealStyle: RevealStyle = {
    '--reveal-shadow-delay': getHomeRevealShadowDelay(delayMs, prefersReducedMotion),
  }

  return (
    <m.div
      ref={ref}
      className="home-reveal-shell"
      data-home-reveal
      data-revealed={revealed ? 'true' : 'false'}
      style={revealStyle}
      initial={getHomeRevealInitialState(prefersReducedMotion)}
      animate={getHomeRevealMotionState(revealed)}
      transition={getHomeRevealTransition(delayMs, prefersReducedMotion)}
    >
      <span aria-hidden="true" className="home-reveal-cloud-shadow" />
      {children}
    </m.div>
  )
}

export function Section({
  id,
  title,
  meta,
  children,
  contentGapClassName = 'space-y-4 sm:space-y-7',
  scrollMarginClassName = 'scroll-mt-24',
  rule = true,
}: {
  id?: string
  title: string
  meta?: string
  children: ReactNode
  contentGapClassName?: string
  scrollMarginClassName?: string
  rule?: boolean
}) {
  return (
    <section id={id} className={getHomeSectionClassName(scrollMarginClassName, contentGapClassName)}>
      <div className="space-y-2 sm:space-y-3">
        <div className="home-section-heading flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <h2 className={HOME_SECTION_TITLE_CLASS_NAME}>{title}</h2>
          {meta ? <p className="home-section-meta">{meta}</p> : null}
        </div>
        {rule ? <div className={HOME_SECTION_RULE_CLASS_NAME} /> : null}
      </div>
      {children}
    </section>
  )
}
