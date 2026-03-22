'use client'

import { useEffect, useState, useCallback } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { getLenisInstance } from '@/lib/lenis'
import { IconHeart2 } from 'nucleo-pixel-essential'
import { MOTION_EASE_SOFT } from '@/lib/motion'

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
        backdropFilter: 'blur(20px) saturate(1.15)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.15)',
        background: 'rgba(var(--background-rgb), 0.72)',
        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
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
          : { duration: 0.4, ease: MOTION_EASE_SOFT }
      }
    >
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-4 sm:px-8" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))' }}>
        <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-muted-foreground/50 sm:text-[10px]">
          Made with care <IconHeart2 size={8} className="inline -mt-px text-muted-foreground/40" aria-hidden />
          <span className="mx-1.5 opacity-30">·</span>
          <span className="tracking-[0.08em] normal-case text-muted-foreground/30">© {currentYear} Hunter Bastian</span>
          <span className="mx-1.5 opacity-30">·</span>
          <span className="tracking-[0.08em] normal-case text-muted-foreground/30">Last updated: Mar 2026</span>
        </span>
      </div>
    </m.footer>
  )
}
