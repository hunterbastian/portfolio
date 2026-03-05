'use client'

import { useEffect, type ReactNode } from 'react'
import { setLenisInstance } from '@/lib/lenis'

const LENIS_OPTIONS = {
  duration: 1.6,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical' as const,
  gestureOrientation: 'vertical' as const,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
}

interface SmoothScrollProps {
  children: ReactNode
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    let active = true
    let rafId = 0
    let cleanup: (() => void) | null = null

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setLenisInstance(null)
      return
    }

    const initLenis = async () => {
      const { default: Lenis } = await import('lenis')
      if (!active) {
        return
      }

      const lenis = new Lenis(LENIS_OPTIONS)
      setLenisInstance(lenis)

      const raf = (time: number) => {
        lenis.raf(time)
        rafId = window.requestAnimationFrame(raf)
      }

      rafId = window.requestAnimationFrame(raf)
      cleanup = () => {
        window.cancelAnimationFrame(rafId)
        setLenisInstance(null)
        lenis.destroy()
      }
    }

    void initLenis()

    return () => {
      active = false
      cleanup?.()
    }
  }, [])

  return <>{children}</>
}
