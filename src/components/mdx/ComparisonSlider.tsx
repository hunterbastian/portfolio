'use client'

import Image from 'next/image'
import { useId, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
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

function clampPercentage(value: number): number {
  return Math.min(90, Math.max(10, value))
}

export default function ComparisonSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  beforeLabel = 'Before',
  afterLabel = 'After',
  initialPosition = 52,
}: ComparisonSliderProps) {
  const sliderId = useId()
  const prefersReducedMotion = useReducedMotion() ?? false
  const [position, setPosition] = useState(clampPercentage(initialPosition))

  return (
    <figure className="my-10">
      <div className="relative w-full overflow-hidden rounded-xl border border-border bg-card/80 shadow-sm">
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={beforeSrc}
            alt={beforeAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 860px"
          />

          <motion.div
            className="absolute inset-y-0 left-0 overflow-hidden"
            animate={{ width: `${position}%` }}
            transition={{
              duration: motionDurationMs(260, prefersReducedMotion),
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
          </motion.div>

          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/95 shadow-[0_0_0_1px_rgba(0,0,0,0.28)]"
            animate={{ left: `${position}%` }}
            transition={{
              duration: motionDurationMs(260, prefersReducedMotion),
              ease: MOTION_EASE_STANDARD,
            }}
          />

          <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-center justify-between">
            <span className="rounded-md border border-border bg-background/75 px-2 py-1 text-[10px] font-inter uppercase tracking-[0.12em] text-foreground">
              {afterLabel}
            </span>
            <span className="rounded-md border border-border bg-background/75 px-2 py-1 text-[10px] font-inter uppercase tracking-[0.12em] text-foreground">
              {beforeLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <label htmlFor={sliderId} className="sr-only">
          Compare before and after designs
        </label>
        <input
          id={sliderId}
          type="range"
          min={10}
          max={90}
          value={position}
          onChange={(event) => setPosition(clampPercentage(Number(event.target.value)))}
          className="h-1.5 w-full cursor-ew-resize accent-primary"
          aria-label="Compare before and after designs"
        />
      </div>
    </figure>
  )
}
