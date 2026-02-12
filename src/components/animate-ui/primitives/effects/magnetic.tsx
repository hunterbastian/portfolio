'use client'

import * as React from 'react'
import { motion, useSpring, type MotionStyle, type SpringOptions } from 'framer-motion'

const DEFAULT_SPRING: SpringOptions = {
  stiffness: 100,
  damping: 10,
  mass: 0.5,
}

export interface MagneticProps extends React.ComponentPropsWithoutRef<typeof motion.div> {
  asChild?: boolean
  strength?: number
  range?: number
  springOptions?: SpringOptions
  onlyOnHover?: boolean
  disableOnTouch?: boolean
}

export function Magnetic({
  asChild = false,
  children,
  className,
  style,
  strength = 0.5,
  range = 120,
  springOptions = DEFAULT_SPRING,
  onlyOnHover = false,
  disableOnTouch = true,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  ...props
}: MagneticProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const x = useSpring(0, springOptions)
  const y = useSpring(0, springOptions)

  const resetPosition = React.useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  const handlePointerEnter = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disableOnTouch && event.pointerType === 'touch') {
      return
    }

    setIsHovered(true)
    onPointerEnter?.(event)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event)

    if (disableOnTouch && event.pointerType === 'touch') {
      return
    }

    if (onlyOnHover && !isHovered) {
      return
    }

    const node = event.currentTarget
    const rect = node.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const offsetX = event.clientX - centerX
    const offsetY = event.clientY - centerY
    const distance = Math.hypot(offsetX, offsetY)

    if (range > 0 && distance > range) {
      resetPosition()
      return
    }

    const pull = range > 0 ? 1 - distance / range : 1
    x.set(offsetX * strength * pull)
    y.set(offsetY * strength * pull)
  }

  const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    setIsHovered(false)
    resetPosition()
    onPointerLeave?.(event)
  }

  const motionStyle: MotionStyle = {
    ...(style as MotionStyle),
    x,
    y,
  }

  return (
    <motion.div
      className={className}
      style={motionStyle}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      data-as-child={asChild ? 'true' : undefined}
      {...props}
    >
      {children}
    </motion.div>
  )
}
