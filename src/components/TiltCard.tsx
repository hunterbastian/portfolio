'use client'

import { useRef, type CSSProperties, type ReactNode } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion'

const TILT_SPRING = { stiffness: 240, damping: 30 }
const DEFAULT_MAX_TILT = 2.8 // degrees

interface TiltCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  maxTilt?: number
  perspective?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initial?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animate?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transition?: any
}

export default function TiltCard({
  children,
  className,
  style,
  maxTilt = DEFAULT_MAX_TILT,
  perspective = 900,
  initial,
  animate,
  transition,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  const springX = useSpring(rotateX, TILT_SPRING)
  const springY = useSpring(rotateY, TILT_SPRING)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) return
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    // Normalize to -1…1 from center
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2

    // rotateX tilts around horizontal axis (mouse Y controls it, inverted)
    rotateX.set(-ny * maxTilt)
    // rotateY tilts around vertical axis (mouse X controls it)
    rotateY.set(nx * maxTilt)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={{
        perspective,
        willChange: 'transform',
      }}
      initial={initial}
      animate={animate}
      transition={transition}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className={className}
        style={{
          ...style,
          rotateX: springX,
          rotateY: springY,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
