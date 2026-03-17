'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const PAGE_NAV = [
  { name: 'HOME', href: '/' },
  { name: 'ABOUT', href: '/about' },
  { name: 'PROJECTS', href: '/#case-studies' },
  { name: 'PLAYGROUND', href: '/archive' },
  { name: 'BLOG', href: '/blog' },
] as const

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
            <button
              type="button"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-foreground transition-[color,transform] duration-200 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:hidden"
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
