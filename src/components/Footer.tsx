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
      initial={{ y: '100%' }}
      animate={{ y: visible ? '0%' : '100%' }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              type: 'spring',
              stiffness: 180,
              damping: 26,
              mass: 1,
            }
      }
    >
      <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-center gap-[0.6em] px-6 py-5 font-mono text-[11px] tracking-[0.06em] text-muted-foreground sm:px-8">
        <span className="tabular-nums">© {currentYear}</span>
        <span className="opacity-30" aria-hidden>·</span>
        <span>Hunter Bastian</span>
        <span className="opacity-30" aria-hidden>·</span>
        <span className="group inline-flex items-center gap-1 cursor-default">
          Utah
          <IconHeart2 size={9} className="text-primary/40 transition-[transform,color] duration-300 ease-out group-hover:scale-125 group-hover:text-primary/70" aria-hidden />
        </span>
      </div>
    </m.footer>
  )
}
