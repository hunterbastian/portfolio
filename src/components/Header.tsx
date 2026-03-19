'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useScrambleText } from '@/lib/scramble'
import { siteConfig } from '@/lib/site'
import { MOTION_EASE_SOFT } from '@/lib/motion'

const PAGE_NAV = [
  { name: 'HOME', href: '/' },
  { name: 'ABOUT', href: '/about' },
  { name: 'PROJECTS', href: '/#case-studies' },
  { name: 'PLAYGROUND', href: '/archive' },
  { name: 'BLOG', href: '/blog' },
] as const

function CoordinateDisplay() {
  const coord = useScrambleText(siteConfig.siteCoordinates, true, 400)
  const location = useScrambleText('UTAH, USA', true, 600)

  return (
    <div
      className="select-none cursor-default"
      onMouseEnter={() => { coord.scramble(); location.scramble() }}
    >
      <p className="text-[10px] tracking-[0.1em] text-foreground/60 whitespace-nowrap font-mono tabular-nums leading-tight">
        {coord.display}
      </p>
      <p className="text-[9px] tracking-[0.1em] text-muted-foreground/50 whitespace-nowrap font-mono leading-tight">
        {location.display}
      </p>
    </div>
  )
}

export default function Header() {
  const pathname = usePathname()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const showCoordinates = true

  useEffect(() => {
    setShowMobileMenu(false)
  }, [pathname])

  if (pathname === '/archive') return null

  return (
    <header
      className="site-header-frosted sticky top-0 z-50 w-full px-4 py-3 sm:px-6 sm:py-4 header-separator"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex h-10 items-center justify-between sm:h-14">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="group flex min-h-[44px] items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Home"
            >
              <span
                className="text-xs font-medium tracking-[0.1em] uppercase transition-opacity duration-300 group-hover:opacity-100 sm:text-sm"
                style={{ color: 'var(--foreground)', opacity: 0.9 }}
              >
                Hunter Bastian
              </span>
            </Link>
            {showCoordinates && <CoordinateDisplay />}
          </div>

          <div className="flex items-center gap-1">
            <nav className="hidden sm:flex items-center gap-1">
              {PAGE_NAV.map((item, i) => (
                <m.div
                  key={item.href}
                  initial={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    duration: 0.4,
                    delay: 0.2 + i * 0.06,
                    ease: MOTION_EASE_SOFT,
                  }}
                >
                  <Link
                    href={item.href}
                    className={`px-2.5 py-1.5 text-[10px] tracking-[0.12em] uppercase font-mono transition-colors duration-200 ${
                      pathname === item.href
                        ? 'text-foreground'
                        : 'text-muted-foreground/60 hover:text-foreground'
                    }`}
                  >
                    {item.name}
                  </Link>
                </m.div>
              ))}
            </nav>
            <button
              type="button"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-foreground transition-[color,transform] duration-200 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:hidden"
              aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
              aria-expanded={showMobileMenu}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
                <line
                  x1="2" y1="5" x2="14" y2="5"
                  className="origin-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ transform: showMobileMenu ? 'translateY(3px) rotate(45deg)' : 'none' }}
                />
                <line
                  x1="2" y1="11" x2="14" y2="11"
                  className="origin-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ transform: showMobileMenu ? 'translateY(-3px) rotate(-45deg)' : 'none' }}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showMobileMenu && (
          <m.div
            className="sm:hidden mt-3 border-t pt-3 pb-1 overflow-hidden"
            style={{ borderColor: 'var(--border)' }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="container mx-auto max-w-6xl space-y-0.5">
              {PAGE_NAV.map((item, i) => (
                <m.div
                  key={item.href}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setShowMobileMenu(false)}
                    className={`block py-3 min-h-[44px] flex items-center text-xs tracking-[0.14em] uppercase transition-colors duration-200 ${
                      pathname === item.href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                    style={{ fontFamily: 'inherit' }}
                  >
                    {item.name}
                  </Link>
                </m.div>
              ))}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  )
}
