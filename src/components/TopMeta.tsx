'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { AnimatePresence, m } from 'framer-motion'
import { useScrambleText } from '@/lib/scramble'
import { siteConfig } from '@/lib/site'
import { MOTION_EASE_SOFT } from '@/lib/motion'

// Mobile: hamburger · Desktop: pill
const PAGE_NAV = [
  { name: 'HOME', href: '/' },
  { name: 'ABOUT ME', href: '/about' },
  { name: 'PLAYGROUND', href: '/archive' },
  { name: 'BLOG', href: '/blog' },
] as const

const SCROLL_THRESHOLD = 100
const SCROLL_RANGE = 280

function NavLink({ href, name, isActive }: { href: string; name: string; isActive: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center text-[10px] tracking-[0.1em] font-mono whitespace-nowrap underline-offset-4 decoration-[1px] transition-[color,opacity,text-decoration-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isActive
          ? 'font-medium text-foreground/60 underline decoration-accent'
          : 'text-muted-foreground/50 underline decoration-transparent hover:text-foreground/60 hover:decoration-accent'
      }`}
    >
      {name}
    </Link>
  )
}

/**
 * Drives scroll-linked animations via CSS custom properties.
 * Sets --scroll-progress (0 → 1) on the returned ref element.
 * Zero React re-renders during scroll — all visual changes are CSS-driven.
 */
function useScrollCSS() {
  const ref = useRef<HTMLDivElement>(null)
  const rafId = useRef(0)

  useEffect(() => {
    function update() {
      if (!ref.current) return
      const y = window.scrollY
      const progress = y < SCROLL_THRESHOLD ? 0 : Math.min(1, (y - SCROLL_THRESHOLD) / SCROLL_RANGE)
      ref.current.style.setProperty('--scroll-progress', String(progress))
    }

    function onScroll() {
      cancelAnimationFrame(rafId.current)
      rafId.current = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  return ref
}

function CoordinateDisplay() {
  const coord = useScrambleText(siteConfig.siteCoordinates, true, 400)
  const loc = useScrambleText(siteConfig.siteLocation, true, 600)

  return (
    <div
      className="fixed left-4 top-4 z-50 hidden select-none cursor-default sm:left-6 sm:top-6 sm:block"
      style={{ opacity: 'calc(1 - var(--scroll-progress, 0))' }}
      onMouseEnter={() => { coord.scramble(); loc.scramble() }}
    >
      <p className="text-[10px] tracking-[0.1em] text-foreground/60 whitespace-nowrap font-mono tabular-nums leading-tight">
        {coord.display}
      </p>
      <p className="text-[9px] tracking-[0.1em] text-muted-foreground/50 whitespace-nowrap font-mono leading-tight">
        {loc.display}
      </p>
    </div>
  )
}

export default function TopMeta() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const scrollRef = useScrollCSS()

  // Close menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    if (href.startsWith('/#')) return false
    return pathname.startsWith(href)
  }

  return (
    <div ref={scrollRef} style={{ '--scroll-progress': '0' } as React.CSSProperties}>
      {/* Top-edge gradient so scrolling content fades out smoothly */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-40 hidden h-16 sm:block"
        style={{ background: 'linear-gradient(to bottom, var(--background) 0%, transparent 100%)' }}
      />
      {pathname === '/' && <CoordinateDisplay />}
      {/* Desktop: top-right nav — pill fades in on scroll via CSS */}
      <div
        className="fixed right-4 top-4 z-50 hidden items-center gap-4 rounded-full sm:right-6 sm:top-6 sm:flex nav-scroll-pill"
      >
        {PAGE_NAV.map((item) => (
          <NavLink key={item.href} href={item.href} name={item.name} isActive={isActive(item.href)} />
        ))}
      </div>

      {/* Mobile: top-right hamburger button */}
      <button
        type="button"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed right-4 top-4 z-50 flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-xl text-foreground/70 active:scale-[0.94] transition-transform duration-200 sm:hidden top-meta-pill"
        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileMenuOpen}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
          <line
            x1="3" y1="5.5" x2="13" y2="5.5"
            className="transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: mobileMenuOpen ? 'translate(0.5px, 2.5px) rotate(45deg)' : 'none',
              transformOrigin: '8px 8px',
            }}
          />
          <line
            x1="3" y1="10.5" x2="13" y2="10.5"
            className="transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: mobileMenuOpen ? 'translate(0.5px, -2.5px) rotate(-45deg)' : 'none',
              transformOrigin: '8px 8px',
            }}
          />
        </svg>
      </button>

      {/* Mobile: dropdown menu */}
      <div className="sm:hidden">
        <AnimatePresence>
          {mobileMenuOpen && (
            <m.nav
              className="fixed right-4 top-16 z-50 rounded-xl backdrop-blur-xl px-5 py-3 top-meta-pill"
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.25, ease: MOTION_EASE_SOFT }}
            >
              <div className="flex flex-col gap-1">
                {PAGE_NAV.map((item, i) => (
                  <m.div
                    key={item.href}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.05, ease: MOTION_EASE_SOFT }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block py-2.5 min-h-[44px] flex items-center text-[11px] tracking-[0.12em] uppercase transition-colors duration-200 ${
                        isActive(item.href)
                          ? 'text-foreground'
                          : 'text-foreground/50 active:text-foreground'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </m.div>
                ))}
              </div>
            </m.nav>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
