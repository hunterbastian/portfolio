'use client'

import { type ReactNode } from 'react'
import { m, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { MOTION_EASE_SOFT, motionDurationMs, motionDelayMs } from '@/lib/motion'

type Direction = 'up' | 'down' | 'left' | 'right'

interface ScrollRevealProps {
  children: ReactNode
  /** Direction the element enters from. Default: 'up' */
  direction?: Direction
  /** Delay in ms before the reveal starts. Default: 0 */
  delay?: number
  /** Distance in px the element travels. Default: 24 */
  distance?: number
  /** Only animate once. Default: true */
  once?: boolean
  /** Additional className */
  className?: string
}

const DURATION_MS = 500

function getInitialOffset(direction: Direction, distance: number) {
  switch (direction) {
    case 'up': return { x: 0, y: distance }
    case 'down': return { x: 0, y: -distance }
    case 'left': return { x: distance, y: 0 }
    case 'right': return { x: -distance, y: 0 }
  }
}

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  distance = 24,
  once = true,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: '-80px 0px -80px 0px' })
  const prefersReducedMotion = useReducedMotion() ?? false

  const offset = getInitialOffset(direction, distance)

  return (
    <m.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: offset.x, y: offset.y }}
      transition={{
        duration: motionDurationMs(DURATION_MS, prefersReducedMotion),
        delay: motionDelayMs(delay, prefersReducedMotion),
        ease: MOTION_EASE_SOFT,
      }}
    >
      {children}
    </m.div>
  )
}
