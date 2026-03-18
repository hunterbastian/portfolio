'use client'

import { useEffect, useState, useCallback } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { getLenisInstance } from '@/lib/lenis'
import { IconHeart2 } from 'nucleo-pixel-essential'

const FOOTER_REVEAL_EPSILON_PX = 6

export default function Footer() {
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()

  const [visible, setVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const isArchive = pathname === '/archive'

  const syncFooterVisibility = useCallback((scrollY: number, limit: number) => {
    const atBottom = limit <= 0 || scrollY >= Math.max(0, limit - FOOTER_REVEAL_EPSILON_PX)
    setVisible(atBottom)
  }, [])

  useEffect(() => {
    if (isArchive) return

    // Poll for Lenis instance (it initializes async in SmoothScroll)
    let intervalId: ReturnType<typeof setInterval> | null = null
    let cleanup: (() => void) | null = null

    const attach = () => {
      const lenis = getLenisInstance()
      if (lenis) {
        const onScroll = ({ scroll, limit }: { scroll: number; limit: number }) => {
          syncFooterVisibility(scroll, limit)
        }
        lenis.on('scroll', onScroll)
        cleanup = () => lenis.off('scroll', onScroll)
        if (intervalId) clearInterval(intervalId)
        return true
      }
      return false
    }

    // Try immediately, then poll every 100ms (max 50 attempts / 5s)
    if (!attach()) {
      let attempts = 0
      intervalId = setInterval(() => {
        attempts++
        if (attach() || attempts >= 50) {
          if (intervalId) clearInterval(intervalId)
          intervalId = null
        }
      }, 100)
    }

    // Fallback: also listen to native scroll for non-Lenis environments
    const onNativeScroll = () => {
      if (!getLenisInstance()) {
        const scrollY = window.scrollY
        const limit = document.documentElement.scrollHeight - window.innerHeight
        syncFooterVisibility(scrollY, limit)
      }
    }
    onNativeScroll()
    window.addEventListener('scroll', onNativeScroll, { passive: true })

    return () => {
      if (intervalId) clearInterval(intervalId)
      cleanup?.()
      window.removeEventListener('scroll', onNativeScroll)
    }
  }, [isArchive, syncFooterVisibility])

  if (isArchive) return null

  return (
    <m.footer
      className="footer-separator"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: 'var(--background)',
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={
        visible
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 12, pointerEvents: 'none' as const }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
      }
    >
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center gap-1.5 px-6 py-6 sm:px-8">
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground/50">
          Made with care <IconHeart2 size={8} className="inline -mt-px text-muted-foreground/40" aria-hidden />
        </span>
        <span className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground/30">
          © {currentYear} Hunter Bastian
        </span>
      </div>
    </m.footer>
  )
}
