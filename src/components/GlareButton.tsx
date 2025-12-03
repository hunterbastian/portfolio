'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, MouseEvent, useState } from 'react'

interface GlareButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
  whileHover?: any
  transition?: any
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onFocus?: () => void
  onBlur?: () => void
  target?: string
  rel?: string
}

export default function GlareButton({
  children,
  href,
  onClick,
  className = '',
  style,
  whileHover,
  transition,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  target,
  rel,
}: GlareButtonProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 })
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 })
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg'])

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)

    // Update glare position
    setGlarePosition({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
    })
  }

  const handleMouseEnterWrapper = () => {
    setIsHovered(true)
    onMouseEnter?.()
  }

  const handleMouseLeaveWrapper = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
    onMouseLeave?.()
  }

  const baseProps = {
    className: `relative overflow-hidden group ${className}`,
    style: {
      ...style,
      rotateX,
      rotateY,
      transformStyle: 'preserve-3d' as const,
    },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeaveWrapper,
    onMouseEnter: handleMouseEnterWrapper,
    onFocus,
    onBlur,
    whileHover,
    transition,
  }

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...baseProps}
      >
        {/* Glare effect */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(600px circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.15), transparent 40%)`,
            transition: 'opacity 0.3s ease',
          }}
        />
        <div className="relative z-10">{children}</div>
      </motion.a>
    )
  }

  return (
    <motion.button
      onClick={onClick}
      ref={ref as React.Ref<HTMLButtonElement>}
      {...baseProps}
    >
      {/* Glare effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.15), transparent 40%)`,
          transition: 'opacity 0.3s ease',
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.button>
  )
}

