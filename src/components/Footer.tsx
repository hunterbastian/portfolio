'use client'

import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { usePathname } from 'next/navigation'
import { Summer as PixelSun } from '@/components/pixel/glyphs'

const SCROLL_REVEAL_THRESHOLD = 24
const SCROLL_DELTA_THRESHOLD = 6
const PAGE_END_PADDING = 160
const SPARKLE_DURATION_MS = 1300
const REVEAL_OBSERVER_THRESHOLD = 0.35

function useHideOnScroll() {
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    let ticking = false

    const update = () => {
      const y = window.scrollY
      const delta = Math.abs(y - lastScrollY.current)
      const scrollingDown = y > lastScrollY.current
      const nearEnd = y + window.innerHeight >= document.documentElement.scrollHeight - PAGE_END_PADDING

      if (y <= SCROLL_REVEAL_THRESHOLD || nearEnd) {
        setHidden(false)
      } else if (delta > SCROLL_DELTA_THRESHOLD) {
        setHidden(!scrollingDown)
      }

      lastScrollY.current = y
      ticking = false
    }

    const onScroll = () => {
      if (ticking) return
      window.requestAnimationFrame(update)
      ticking = true
    }

    lastScrollY.current = window.scrollY
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return hidden
}

function useSparkleOnReveal(targetRef: RefObject<HTMLElement | null>) {
  const [active, setActive] = useState(false)
  const hasFiredRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const node = targetRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasFiredRef.current) return
        hasFiredRef.current = true
        setActive(true)
        timerRef.current = setTimeout(() => setActive(false), SPARKLE_DURATION_MS)
      },
      { threshold: REVEAL_OBSERVER_THRESHOLD },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [targetRef])

  return active
}

export default function Footer() {
  const pathname = usePathname()
  const footerRef = useRef<HTMLElement | null>(null)
  const hidden = useHideOnScroll()
  const sparkleActive = useSparkleOnReveal(footerRef)
  const currentYear = new Date().getFullYear()

  const shellClass = pathname === '/' ? 'footer-coast-shell' : ''
  const visibilityClass = hidden
    ? 'pointer-events-none translate-y-6 opacity-0'
    : 'translate-y-0 opacity-100'

  return (
    <footer
      ref={footerRef}
      className={`${shellClass} px-5 pb-10 pt-12 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-8 sm:pb-14 sm:pt-20 ${visibilityClass}`}
    >
      <div className="mx-auto max-w-[36rem] border-t border-border/80 pt-5">
        <div className="flex flex-col gap-3 text-[0.76rem] text-muted-foreground sm:flex-row sm:items-start sm:justify-between">
          <p className="font-header transition-colors duration-150 hover:text-foreground/78">
            © {currentYear} Hunter Bastian
          </p>
          <p className="footer-made-line inline-flex items-center gap-2 font-header transition-colors duration-150 hover:text-foreground/78">
            <span aria-hidden="true" className="footer-pixel-sun-shell">
              <span
                className={`footer-pixel-sun transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  sparkleActive ? 'animate-hb-sun-blink' : ''
                }`}
              >
                <PixelSun size={12} />
              </span>
            </span>
            <span>Made with care in Utah.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
