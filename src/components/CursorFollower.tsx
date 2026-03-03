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

const SPRING = { stiffness: 200, damping: 25, mass: 0.5 }
const EASE = [0.22, 1, 0.36, 1] as const

export default function CursorFollower() {
  const prefersReduced = useReducedMotion()
  const [isTouch, setIsTouch] = useState(true) // true by default avoids flash
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [clicking, setClicking] = useState(false)
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

    const onDown = () => setClicking(true)
    const onUp = () => setClicking(false)

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
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseout', onOut, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
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
      {/* Dot — precise cursor replacement */}
      <motion.div
        style={{
          position: 'fixed',
          left: cx,
          top: cy,
          x: '-50%',
          y: '-50%',
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: 'var(--foreground)',
        }}
        animate={{
          scale: clicking ? 0.5 : 1,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.15, ease: EASE }}
      />

      {/* Ring — spring-lagged with blend mode */}
      {!prefersReduced && (
        <motion.div
          style={{
            position: 'fixed',
            left: rx,
            top: ry,
            x: '-50%',
            y: '-50%',
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1.5px solid var(--foreground)',
            mixBlendMode: 'exclusion',
          }}
          animate={{
            scale: clicking ? 0.85 : hovering ? 1.5 : 1,
            opacity: visible ? (hovering ? 0.8 : 0.4) : 0,
          }}
          transition={{ duration: 0.25, ease: EASE }}
        />
      )}
    </div>
  )
}
