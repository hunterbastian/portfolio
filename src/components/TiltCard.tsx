'use client'

import { useRef, type ReactNode } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion'

const TILT_SPRING = { stiffness: 300, damping: 30 }
const MAX_TILT = 6 // degrees

interface TiltCardProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  /** Framer Motion animation props — forwarded to the inner motion.div */
  initial?: Record<string, unknown>
  animate?: Record<string, unknown>
  transition?: Record<string, unknown>
}

export default function TiltCard({
  children,
  className,
  style,
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
    rotateX.set(-ny * MAX_TILT)
    // rotateY tilts around vertical axis (mouse X controls it)
    rotateY.set(nx * MAX_TILT)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...style,
        perspective: 800,
        willChange: 'transform',
      }}
      initial={initial}
      animate={animate}
      transition={transition}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX: springX,
          rotateY: springY,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
