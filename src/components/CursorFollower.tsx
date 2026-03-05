'use client'

import { useEffect, useRef, useState } from 'react'
import {
  m,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion'

const SPRING = { stiffness: 70, damping: 20, mass: 1.2 }
const EASE = [0.22, 1, 0.36, 1] as const

export default function CursorFollower() {
  const prefersReduced = useReducedMotion()
  const [isTouch, setIsTouch] = useState(true)
  const [visible, setVisible] = useState(false)
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

    const onLeave = () => {
      entered.current = false
      setVisible(false)
    }
    const onEnter = () => {
      entered.current = true
      setVisible(true)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)

    return () => {
      window.removeEventListener('mousemove', onMove)
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
        <m.div
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
            opacity: visible ? 0.25 : 0,
          }}
          transition={{ duration: 0.35, ease: EASE }}
        />
      )}
    </div>
  )
}
