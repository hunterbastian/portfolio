'use client'

import { m, useInView, useReducedMotion } from 'framer-motion'
import { useRef, type CSSProperties, type ReactNode } from 'react'
import { MOTION_EASE_SOFT, motionDurationMs } from '@/lib/motion'

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
  const revealed = isInView || prefersReducedMotion
  const revealStyle: RevealStyle = {
    '--reveal-shadow-delay': prefersReducedMotion ? '0ms' : `${delayMs + 80}ms`,
  }

  return (
    <m.div
      ref={ref}
      className="home-reveal-shell"
      data-home-reveal
      data-revealed={revealed ? 'true' : 'false'}
      style={revealStyle}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12, filter: 'blur(3px)' }}
      animate={revealed ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 12, filter: 'blur(3px)' }}
      transition={{
        duration: motionDurationMs(780, prefersReducedMotion),
        delay: prefersReducedMotion ? 0 : delayMs / 1000,
        ease: MOTION_EASE_SOFT,
      }}
    >
      <span aria-hidden="true" className="home-reveal-cloud-shadow" />
      {children}
    </m.div>
  )
}

export function Section({
  id,
  title,
  children,
  contentGapClassName = 'space-y-4 sm:space-y-7',
  scrollMarginClassName = 'scroll-mt-24',
  rule = true,
}: {
  id?: string
  title: string
  children: ReactNode
  contentGapClassName?: string
  scrollMarginClassName?: string
  rule?: boolean
}) {
  return (
    <section id={id} className={`${scrollMarginClassName} ${contentGapClassName}`}>
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-baseline gap-4 text-[0.85rem] tracking-[-0.02em] text-foreground/92">
          <h2>{title}</h2>
        </div>
        {rule ? <div className="h-px w-full bg-border/90" /> : null}
      </div>
      {children}
    </section>
  )
}
