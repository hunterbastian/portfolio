'use client'

import { useEffect, useRef, useState } from 'react'
import {
  m,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

export default function CursorFollower() {
  const prefersReduced = useReducedMotion()
  const [isTouch, setIsTouch] = useState(true)
  const [visible, setVisible] = useState(false)
  const entered = useRef(false)

  // Cursor position — updates directly, no React re-renders
  const cx = useMotionValue(-100)
  const cy = useMotionValue(-100)

  useEffect(() => {
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return
    setIsTouch(false)
    const previousHtmlCursor = document.documentElement.style.cursor
    const previousBodyCursor = document.body.style.cursor
    document.documentElement.style.cursor = 'none'
    document.body.style.cursor = 'none'

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
      document.documentElement.style.cursor = previousHtmlCursor
      document.body.style.cursor = previousBodyCursor
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
      {/* Small cursor dot — pinned directly to the live cursor position */}
      <m.div
        style={{
          position: 'fixed',
          left: cx,
          top: cy,
          x: '-50%',
          y: '-50%',
          width: 4,
          height: 4,
          borderRadius: '50%',
          backgroundColor: 'var(--foreground)',
          mixBlendMode: 'exclusion',
        }}
        animate={{
          opacity: visible ? 0.88 : 0,
        }}
        transition={{ duration: prefersReduced ? 0 : 0.18, ease: EASE }}
      />
    </div>
  )
}
