'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const PAGE_NAV = [
  { name: 'HOME', href: '/' },
  { name: 'ABOUT', href: '/about' },
  { name: 'PROJECTS', href: '/#case-studies' },
] as const

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

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
      className="p-1.5 text-muted-foreground hover:text-foreground transition-colors duration-200"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        {isDark ? (
          <path d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 7.66l-.71-.71M4.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        ) : (
          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
        )}
      </svg>
    </button>
  )
}

export default function Header() {
  const pathname = usePathname()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  if (pathname === '/archive') return null

  return (
    <header
      className="site-header-frosted sticky top-0 z-50 w-full border-b px-4 py-3 sm:px-6 sm:py-4"
      style={{
        borderColor: 'var(--border)',
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="group flex items-baseline gap-1.5 focus-visible:outline-none"
            aria-label="Home"
          >
            <span
              className="text-[11px] font-medium tracking-[0.1em] uppercase transition-opacity duration-300 group-hover:opacity-100"
              style={{ color: 'var(--foreground)', opacity: 0.9 }}
            >
              Hunter Bastian
            </span>
          </Link>

        </div>
      </div>

      {showMobileMenu && (
        <div className="sm:hidden mt-4 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
          <div className="container mx-auto max-w-6xl space-y-1 px-1">
            {PAGE_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setShowMobileMenu(false)}
                className={`block py-3 text-xs tracking-[0.14em] transition-colors duration-300 ${
                  pathname === item.href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
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
