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
    if (limit <= 0) return // Content hasn't measured yet — don't flash footer
    const atBottom = scrollY >= Math.max(0, limit - FOOTER_REVEAL_EPSILON_PX)
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
      className="site-header-frosted footer-separator fixed bottom-0 left-0 right-0 z-40 w-full px-4 py-3 sm:px-6 sm:py-4"
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
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between py-1">
          <span className="inline-flex items-center gap-2 text-[9px] tracking-[0.1em] font-mono text-foreground/60">
            <span
              className="inline-block size-[10px] rounded-full shrink-0"
              style={{
                background: 'radial-gradient(circle at 50% 50%, #ff5a2d 0%, #ff7a3a 28%, #f2a06a 58%, #e0a893 100%)',
              }}
              aria-hidden
            />
            © {currentYear} Hunter Bastian
          </span>
          <span className="group/heart text-[9px] tracking-[0.1em] font-mono text-foreground/60 cursor-default">
            Made with care <IconHeart2 size={8} className="inline -mt-px text-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/heart:scale-[1.5] group-hover/heart:rotate-[-8deg]" style={{ fill: 'var(--accent)' }} aria-hidden />
          </span>
        </div>
      </div>
    </m.footer>
  )
}
