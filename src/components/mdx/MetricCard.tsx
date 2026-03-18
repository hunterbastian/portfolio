'use client'

import { useEffect, useRef, useState } from 'react'
import { m, useInView, useReducedMotion } from 'framer-motion'
import { MOTION_EASE_SOFT, motionDurationMs } from '@/lib/motion'

interface MetricCardProps {
  /** The numeric value to count up to (e.g. 40) */
  value: number
  /** Label shown below the number (e.g. "faster task completion") */
  label: string
  /** Text before the number (e.g. "$") */
  prefix?: string
  /** Text after the number (e.g. "%" or "x") */
  suffix?: string
  /** Duration of the count animation in ms. Default: 1200 */
  duration?: number
}

function useCountUp(target: number, isActive: boolean, durationMs: number) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!isActive) {
      setDisplay(0)
      return
    }

    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / durationMs, 1)
      // Ease-out quad for a satisfying deceleration
      const eased = 1 - (1 - progress) * (1 - progress)
      setDisplay(Math.round(eased * target))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isActive, target, durationMs])

  return display
}

const PANEL_DURATION_MS = 400

export default function MetricCard({
  value,
  label,
  prefix = '',
  suffix = '',
  duration = 1200,
}: MetricCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px -60px 0px' })
  const prefersReducedMotion = useReducedMotion() ?? false
  const displayValue = useCountUp(value, isInView, prefersReducedMotion ? 0 : duration)

  return (
    <m.div
      ref={ref}
      className="inline-flex flex-col items-center rounded-[3px] px-6 py-5 text-center shadow-card-subtle"
      style={{ background: 'var(--card)' }}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{
        duration: motionDurationMs(PANEL_DURATION_MS, prefersReducedMotion),
        ease: MOTION_EASE_SOFT,
      }}
    >
      <span className="font-mono text-2xl font-medium tracking-tight text-foreground tabular-nums sm:text-3xl">
        {prefix}{prefersReducedMotion ? value : displayValue}{suffix}
      </span>
      <span className="mt-1.5 font-inter text-xs font-normal leading-snug text-muted-foreground sm:text-sm">
        {label}
      </span>
    </m.div>
  )
}
