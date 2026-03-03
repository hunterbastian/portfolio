'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion'

const INTERACTIVE =
  'a, button, [role="button"], input, select, textarea, label, [data-cursor="pointer"]'

const SPRING = { stiffness: 120, damping: 28, mass: 0.8 }
const EASE = [0.22, 1, 0.36, 1] as const

export default function CursorFollower() {
  const prefersReduced = useReducedMotion()
  const [isTouch, setIsTouch] = useState(true) // true by default avoids flash
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const entered = useRef(false)

  // Cursor position — updates directly, no React re-renders
  const cx = useMotionValue(-100)
  const cy = useMotionValue(-100)

  // Ring follows cursor with spring physics
  const rx = useSpring(cx, SPRING)
  const ry = useSpring(cy, SPRING)

  useEffect(() => {
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return
    setIsTouch(false)

    // No cursor hiding — keep default cursor visible alongside the follower

    const onMove = (e: MouseEvent) => {
      cx.set(e.clientX)
      cy.set(e.clientY)
      if (!entered.current) {
        entered.current = true
        setVisible(true)
      }
    }

    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(INTERACTIVE)) setHovering(true)
    }
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(INTERACTIVE)) setHovering(false)
    }

    const onLeave = () => {
      entered.current = false
      setVisible(false)
    }
    const onEnter = () => {
      entered.current = true
      setVisible(true)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseout', onOut, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
    }
  }, [cx, cy])

  if (isTouch) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      {/* Ring — spring-lagged with blend mode */}
      {!prefersReduced && (
        <motion.div
          style={{
            position: 'fixed',
            left: rx,
            top: ry,
            x: '-50%',
            y: '-50%',
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '1px solid var(--foreground)',
            mixBlendMode: 'exclusion',
          }}
          animate={{
            scale: hovering ? 1.4 : 1,
            opacity: visible ? (hovering ? 0.5 : 0.25) : 0,
          }}
          transition={{ duration: 0.35, ease: EASE }}
        />
      )}
    </div>
  )
}
