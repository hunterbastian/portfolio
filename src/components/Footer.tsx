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

    // Try immediately, then poll every 100ms
    if (!attach()) {
      intervalId = setInterval(() => { attach() }, 100)
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
      <div className="container relative z-10 mx-auto grid max-w-6xl gap-3 px-4 py-6 text-center font-mono md:grid-cols-2 md:items-center">
        <span className="text-[11px] tracking-[0.04em] text-muted-foreground tabular-nums md:justify-self-start">
          © {currentYear}
        </span>
        <p className="text-[11px] uppercase tracking-[0.04em] text-muted-foreground md:justify-self-end md:text-right" style={{ fontFamily: 'inherit' }}>
          <span className="group inline-flex items-center gap-0.5">Crafted with <IconHeart2 size={10} className="inline-block mx-0.5 text-primary/70 transition-[transform,filter] duration-300 ease-out group-hover:scale-125 group-hover:blur-[0.3px]" aria-hidden /> by Hunter Bastian</span>
        </p>
      </div>
    </m.footer>
  )
}
