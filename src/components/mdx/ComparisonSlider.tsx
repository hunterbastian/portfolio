'use client'

import Image from 'next/image'
import { useId, useState } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import {
  COMPARISON_SLIDER_AFTER_LABEL,
  COMPARISON_SLIDER_ARIA_LABEL,
  COMPARISON_SLIDER_BEFORE_LABEL,
  COMPARISON_SLIDER_INITIAL_POSITION,
  COMPARISON_SLIDER_MAX,
  COMPARISON_SLIDER_MIN,
  COMPARISON_SLIDER_MOTION_DURATION_MS,
  clampComparisonSliderPosition,
  getComparisonSliderInputPosition,
  getComparisonSliderPercent,
} from '@/lib/comparison-slider'
import { MOTION_EASE_STANDARD, motionDurationMs } from '@/lib/motion'

interface ComparisonSliderProps {
  beforeSrc: string
  afterSrc: string
  beforeAlt: string
  afterAlt: string
  beforeLabel?: string
  afterLabel?: string
  initialPosition?: number
}

export default function ComparisonSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  beforeLabel = COMPARISON_SLIDER_BEFORE_LABEL,
  afterLabel = COMPARISON_SLIDER_AFTER_LABEL,
  initialPosition = COMPARISON_SLIDER_INITIAL_POSITION,
}: ComparisonSliderProps) {
  const sliderId = useId()
  const prefersReducedMotion = useReducedMotion() ?? false
  const [position, setPosition] = useState(clampComparisonSliderPosition(initialPosition))

  return (
    <figure className="my-10">
      <div className="relative w-full overflow-hidden border border-border bg-card/80 shadow-sm">
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={beforeSrc}
            alt={beforeAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 860px"
          />

          <m.div
            className="absolute inset-y-0 left-0 overflow-hidden"
            animate={{ width: getComparisonSliderPercent(position) }}
            transition={{
              duration: motionDurationMs(COMPARISON_SLIDER_MOTION_DURATION_MS, prefersReducedMotion),
              ease: MOTION_EASE_STANDARD,
            }}
          >
            <div className="relative h-full w-full">
              <Image
                src={afterSrc}
                alt={afterAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 860px"
              />
            </div>
          </m.div>

          <m.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-0.5 bg-card/95 shadow-[0_0_0_1px_rgba(0,0,0,0.28)]"
            animate={{ left: getComparisonSliderPercent(position) }}
            transition={{
              duration: motionDurationMs(COMPARISON_SLIDER_MOTION_DURATION_MS, prefersReducedMotion),
              ease: MOTION_EASE_STANDARD,
            }}
          />

          <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-center justify-between">
            <span className="border border-border bg-background/75 px-2 py-1 text-[10px] font-inter uppercase tracking-[0.12em] text-foreground">
              {afterLabel}
            </span>
            <span className="border border-border bg-background/75 px-2 py-1 text-[10px] font-inter uppercase tracking-[0.12em] text-foreground">
              {beforeLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <label htmlFor={sliderId} className="sr-only">
          {COMPARISON_SLIDER_ARIA_LABEL}
        </label>
        <input
          id={sliderId}
          type="range"
          min={COMPARISON_SLIDER_MIN}
          max={COMPARISON_SLIDER_MAX}
          value={position}
          onChange={(event) => setPosition(getComparisonSliderInputPosition(event.target.value))}
          className="h-1.5 w-full cursor-ew-resize accent-primary"
          aria-label={COMPARISON_SLIDER_ARIA_LABEL}
        />
      </div>
    </figure>
  )
}
