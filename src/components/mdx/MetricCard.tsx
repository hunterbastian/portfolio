'use client'

import { useEffect, useRef, useState } from 'react'
import { m, useInView, useReducedMotion } from 'framer-motion'
import {
  METRIC_CARD_DEFAULT_DURATION_MS,
  METRIC_CARD_PANEL_DURATION_MS,
  activateMetricCardCountUp,
  getMetricCardNumericValue,
  getMetricCardPanelAnimationState,
  getMetricCardVisibleValue,
  isMetricCardNumericValue,
} from '@/lib/metric-card'
import { MOTION_EASE_SOFT, motionDurationMs } from '@/lib/motion'

interface MetricCardProps {
  /** The value to display. Numbers animate; non-numeric strings (e.g. "Figma") render as-is. */
  value: number | string
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

  useEffect(() => {
    return activateMetricCardCountUp({
      cancelFrame: (frame: number) => cancelAnimationFrame(frame),
      durationMs,
      isActive,
      now: () => performance.now(),
      requestFrame: (callback) => requestAnimationFrame(callback),
      setDisplay,
      target,
    })
  }, [isActive, target, durationMs])

  return display
}

export default function MetricCard({
  value,
  label,
  prefix = '',
  suffix = '',
  duration = METRIC_CARD_DEFAULT_DURATION_MS,
}: MetricCardProps) {
  const numericValue = getMetricCardNumericValue(value)
  const isNumeric = isMetricCardNumericValue(value)

  const ref = useRef<HTMLDivElement>(null)
  // Use no negative margin so elements near the viewport edge still trigger.
  // The -60px margin combined with parent element transforms was preventing cards
  // from ever entering the detection zone, leaving the counter stuck at 0.
  const isInView = useInView(ref, { once: true, margin: '0px' })
  const prefersReducedMotion = useReducedMotion() ?? false
  const displayValue = useCountUp(numericValue, isInView && isNumeric, prefersReducedMotion ? 0 : duration)
  const visibleValue = getMetricCardVisibleValue({
    animatedValue: displayValue,
    isNumeric,
    prefersReducedMotion,
    value,
  })

  return (
    <m.div
      ref={ref}
      className="inline-flex flex-col items-center px-6 py-5 text-center shadow-card-subtle"
      style={{ background: 'var(--card)' }}
      initial={getMetricCardPanelAnimationState(false)}
      animate={getMetricCardPanelAnimationState(isInView)}
      transition={{
        duration: motionDurationMs(METRIC_CARD_PANEL_DURATION_MS, prefersReducedMotion),
        ease: MOTION_EASE_SOFT,
      }}
    >
      <span className="font-mono text-2xl font-medium tracking-tight text-foreground tabular-nums sm:text-3xl">
        {prefix}{visibleValue}{suffix}
      </span>
      <span className="mt-1.5 font-inter text-xs font-normal leading-snug text-muted-foreground sm:text-sm">
        {label}
      </span>
    </m.div>
  )
}
