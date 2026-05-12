'use client'

import { useEffect, useRef, useState } from 'react'
import { Summer as PixelSun } from '@/components/pixel/glyphs'
import { homeHeroContent } from '@/content/homepage'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [footerHidden, setFooterHidden] = useState(false)
  const [sparkleActive, setSparkleActive] = useState(false)
  const lastScrollY = useRef(0)
  const footerRef = useRef<HTMLElement | null>(null)
  const hasSparkledRef = useRef(false)
  const sparkleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let ticking = false

    const updateFooterVisibility = () => {
      const currentScrollY = window.scrollY
      const scrollingDown = currentScrollY > lastScrollY.current
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current)
      const viewportBottom = currentScrollY + window.innerHeight
      const pageHeight = document.documentElement.scrollHeight
      const nearPageEnd = viewportBottom >= pageHeight - 160

      if (currentScrollY <= 24 || nearPageEnd) {
        setFooterHidden(false)
      } else if (scrollDelta > 6) {
        setFooterHidden(!scrollingDown)
      }

      lastScrollY.current = currentScrollY
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateFooterVisibility)
        ticking = true
      }
    }

    lastScrollY.current = window.scrollY
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const footer = footerRef.current
    if (!footer) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting || hasSparkledRef.current) return

        hasSparkledRef.current = true
        setSparkleActive(true)
        sparkleTimerRef.current = setTimeout(() => {
          setSparkleActive(false)
        }, 1300)
      },
      { threshold: 0.35 },
    )

    observer.observe(footer)

    return () => {
      observer.disconnect()
      if (sparkleTimerRef.current) {
        clearTimeout(sparkleTimerRef.current)
      }
    }
  }, [])

  return (
    <footer
      ref={footerRef}
      className={`px-5 pb-10 pt-12 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-8 sm:pb-14 sm:pt-20 ${
        footerHidden ? 'pointer-events-none translate-y-6 opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="mx-auto max-w-[36rem] border-t border-border/80 pt-5">
        <div className="flex flex-col gap-3 text-[0.76rem] text-muted-foreground sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <p className="font-header transition-colors duration-150 hover:text-foreground/78">© {currentYear} Hunter Bastian</p>
            <p className="max-w-[22rem] font-mono text-[0.62rem] leading-[1.55] text-muted-foreground/58">
              {homeHeroContent.motionLine}
            </p>
          </div>
          <p className="footer-made-line inline-flex items-center gap-2 font-header transition-colors duration-150 hover:text-foreground/78">
            <span aria-hidden="true" className="footer-pixel-sun-shell">
              <span className={`footer-pixel-sun transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${sparkleActive ? 'animate-hb-sun-blink' : ''}`}>
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
