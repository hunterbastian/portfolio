'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { getLenisInstance } from '@/lib/lenis'
import FooterSnakeEasterEgg from './FooterSnakeEasterEgg'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [visible, setVisible] = useState(false)
  const lastScrollY = useRef(0)
  const prefersReducedMotion = useReducedMotion()

  const handleScroll = useCallback((scrollY: number, limit: number) => {
    const threshold = 4
    const delta = scrollY - lastScrollY.current
    const nearBottom = scrollY >= limit - 80

    if (nearBottom) {
      setVisible(true)
    } else if (delta > threshold) {
      setVisible(true)
    } else if (delta < -threshold) {
      setVisible(false)
    }

    lastScrollY.current = scrollY
  }, [])

  useEffect(() => {
    // Poll for Lenis instance (it initializes async in SmoothScroll)
    let intervalId: ReturnType<typeof setInterval> | null = null
    let cleanup: (() => void) | null = null

    const attach = () => {
      const lenis = getLenisInstance()
      if (lenis) {
        const onScroll = ({ scroll, limit }: { scroll: number; limit: number }) => {
          handleScroll(scroll, limit)
        }
        lenis.on('scroll', onScroll)
        cleanup = () => lenis.off('scroll', onScroll)
        if (intervalId) clearInterval(intervalId)
        return true
      }
      return false
    }

    // Try immediately, then poll every 100ms
    if (!attach()) {
      intervalId = setInterval(() => { attach() }, 100)
    }

    // Fallback: also listen to native scroll for non-Lenis environments
    const onNativeScroll = () => {
      if (!getLenisInstance()) {
        const scrollY = window.scrollY
        const limit = document.documentElement.scrollHeight - window.innerHeight
        handleScroll(scrollY, limit)
      }
    }
    window.addEventListener('scroll', onNativeScroll, { passive: true })

    return () => {
      if (intervalId) clearInterval(intervalId)
      cleanup?.()
      window.removeEventListener('scroll', onNativeScroll)
    }
  }, [handleScroll])

  return (
    <motion.footer
      className="border-t"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        borderColor: 'var(--border)',
        background: 'var(--background)',
      }}
      initial={{ y: '100%' }}
      animate={{ y: visible ? '0%' : '100%' }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              type: 'spring',
              stiffness: 260,
              damping: 28,
              mass: 0.8,
            }
      }
    >
      <div className="container relative z-10 mx-auto grid max-w-6xl gap-3 px-4 py-6 text-center md:grid-cols-[1fr_auto_1fr] md:items-center">
        <span className="font-sans text-[11px] tracking-[0.04em] text-muted-foreground md:justify-self-start">
          © {currentYear}
        </span>
        <div className="flex items-center justify-center">
          <FooterSnakeEasterEgg />
        </div>
        <p className="font-sans text-[11px] tracking-[0.04em] text-muted-foreground md:justify-self-end md:text-right">
          Crafted by Hunter Bastian
        </p>
      </div>
    </motion.footer>
  )
}
