'use client'

import { useState } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { MOTION_EASE_SOFT } from '@/lib/motion'

interface AnimatedDashedArrowProps {
  size?: number
  className?: string
}

export default function AnimatedDashedArrow({ size = 14, className = '' }: AnimatedDashedArrowProps) {
  const [hovered, setHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion() ?? false

  return (
    <span
      className={`inline-flex ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-hidden
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        {/* Dashed line */}
        <path d="M5 12h.5m3 0h1.5m3 0h6" />
        {/* Arrow head — animated */}
        <m.g
          animate={
            prefersReducedMotion
              ? {}
              : hovered
                ? { x: [0, 3, 0], transition: { duration: 0.6, ease: MOTION_EASE_SOFT, repeat: Infinity, repeatDelay: 0.3 } }
                : { x: 0 }
          }
        >
          <path d="M15 16l4 -4" />
          <path d="M15 8l4 4" />
        </m.g>
      </svg>
    </span>
  )
}
