'use client'

import { useRef, type CSSProperties, type ReactNode } from 'react'
import {
  m,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type HTMLMotionProps,
} from 'framer-motion'
import {
  TILT_CARD_DEFAULT_MAX_TILT,
  TILT_CARD_DEFAULT_PERSPECTIVE,
  TILT_CARD_RESET_ROTATION,
  TILT_CARD_SPRING,
  getTiltCardInnerStyle,
  getTiltCardOuterStyle,
  getTiltCardRotation,
} from '@/lib/tilt-card'

interface TiltCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  maxTilt?: number
  perspective?: number
  initial?: HTMLMotionProps<'div'>['initial']
  animate?: HTMLMotionProps<'div'>['animate']
  transition?: HTMLMotionProps<'div'>['transition']
}

export default function TiltCard({
  children,
  className,
  style,
  maxTilt = TILT_CARD_DEFAULT_MAX_TILT,
  perspective = TILT_CARD_DEFAULT_PERSPECTIVE,
  initial,
  animate,
  transition,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  const springX = useSpring(rotateX, TILT_CARD_SPRING)
  const springY = useSpring(rotateY, TILT_CARD_SPRING)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) return
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const nextRotation = getTiltCardRotation({
      clientX: e.clientX,
      clientY: e.clientY,
      maxTilt,
      rect,
    })

    rotateX.set(nextRotation.rotateX)
    rotateY.set(nextRotation.rotateY)
  }

  const handleMouseLeave = () => {
    rotateX.set(TILT_CARD_RESET_ROTATION.rotateX)
    rotateY.set(TILT_CARD_RESET_ROTATION.rotateY)
  }

  return (
    <m.div
      ref={ref}
      style={getTiltCardOuterStyle(perspective)}
      initial={initial}
      animate={animate}
      transition={transition}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <m.div
        className={className}
        style={getTiltCardInnerStyle({
          rotateX: springX,
          rotateY: springY,
          style,
        })}
      >
        {children}
      </m.div>
    </m.div>
  )
}
