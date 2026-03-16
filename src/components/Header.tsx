'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, m } from 'framer-motion'
import Link from 'next/link'

const PAGE_NAV = [
  { name: 'HOME', href: '/' },
  { name: 'ABOUT', href: '/about' },
  { name: 'PROJECTS', href: '/#case-studies' },
  { name: 'PLAYGROUND', href: '/archive' },
] as const

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = useCallback(() => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }, [isDark])

  return (
    <button
      type="button"
      onClick={toggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-foreground transition-[color,transform] duration-200 active:scale-[0.96]"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.svg
          key={isDark ? 'sun' : 'moon'}
          className="w-3.5 h-3.5 absolute"
          stroke="currentColor"
          strokeWidth="1.6"
          viewBox="0 0 24 24"
          initial={{ opacity: 0, rotate: -120, scale: 0.3, filter: 'blur(4px)' }}
          animate={{ opacity: 1, rotate: 0, scale: [0.3, 1.18, 0.95, 1], filter: 'blur(0px)' }}
          exit={{ opacity: 0, rotate: 30, scale: 0.8, filter: 'blur(4px)' }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
            scale: { duration: 0.5, times: [0, 0.5, 0.75, 1], ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.3 },
            filter: { duration: 0.35 },
          }}
          style={{ fill: hovered ? 'currentColor' : 'none', transition: 'fill 300ms ease' }}
        >
          {isDark ? (
            <path d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 7.66l-.71-.71M4.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          ) : (
            <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
          )}
        </m.svg>
      </AnimatePresence>
    </button>
  )
}

export default function Header() {
  const pathname = usePathname()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

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
          <Link
            href="/"
            className="group flex min-h-[40px] items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Home"
          >
            <span
              className="text-xs font-medium tracking-[0.1em] uppercase transition-opacity duration-300 group-hover:opacity-100 sm:text-sm"
              style={{ color: 'var(--foreground)', opacity: 0.9 }}
            >
              Hunter Bastian
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-foreground transition-[color,transform] duration-200 active:scale-[0.96] sm:hidden"
              aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
              aria-expanded={showMobileMenu}
              style={{ fontFamily: 'inherit' }}
            >
              <span
                className="text-sm leading-none transition-transform duration-200"
                style={{ transform: showMobileMenu ? 'rotate(45deg)' : 'none' }}
              >
                {showMobileMenu ? '✕' : '⁙'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {showMobileMenu && (
        <div className="sm:hidden mt-3 border-t pt-3 pb-1" style={{ borderColor: 'var(--border)' }}>
          <div className="container mx-auto max-w-6xl space-y-0.5">
            {PAGE_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setShowMobileMenu(false)}
                className={`block py-3 text-xs tracking-[0.14em] uppercase transition-colors duration-200 ${
                  pathname === item.href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
                style={{ fontFamily: 'inherit' }}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
