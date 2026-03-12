'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface TopMetaProps {
  coordinates: string
  location: string
  season: string
}

const PAGE_NAV = [
  { name: 'HOME', href: '/' },
  { name: 'ABOUT', href: '/about' },
  { name: 'PROJECTS', href: '/#case-studies' },
  { name: 'PLAYGROUND', href: '/archive' },
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
      className="text-foreground opacity-90 hover:opacity-100 transition-opacity duration-200"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        {isDark ? (
          <path d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 7.66l-.71-.71M4.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        ) : (
          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
        )}
      </svg>
    </button>
  )
}

function CoordinateLabel({ coordinates }: { coordinates: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="absolute left-4 top-4 z-50 select-none sm:left-6 sm:top-6 cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Location: ${coordinates}`}
      style={{ fontFamily: 'inherit' }}
    >
      <div className="relative overflow-hidden">
        <span
          className="block text-[10px] tracking-[0.12em] text-foreground whitespace-nowrap sm:text-[11px]"
          style={{
            transform: hovered ? 'translateY(-100%) scale(0.92)' : 'translateY(0) scale(1)',
            opacity: hovered ? 0 : 0.9,
            filter: hovered ? 'blur(2px)' : 'blur(0)',
            transition: 'transform 350ms cubic-bezier(0.16,1,0.3,1), opacity 250ms cubic-bezier(0.16,1,0.3,1), filter 300ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {coordinates}
        </span>
        <span
          className="absolute left-0 top-0 block text-[10px] tracking-[0.12em] text-foreground whitespace-nowrap sm:text-[11px]"
          style={{
            transform: hovered ? 'translateY(0) scale(1)' : 'translateY(100%) scale(0.92)',
            opacity: hovered ? 0.9 : 0,
            filter: hovered ? 'blur(0)' : 'blur(2px)',
            transition: 'transform 350ms cubic-bezier(0.16,1,0.3,1), opacity 300ms cubic-bezier(0.16,1,0.3,1) 50ms, filter 300ms cubic-bezier(0.16,1,0.3,1) 50ms',
          }}
          aria-hidden
        >
          UTAH, USA
        </span>
      </div>
    </div>
  )
}

function NavLink({ href, name }: { href: string; name: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={href}
      className="relative overflow-hidden block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className="block text-[11px] tracking-[0.12em] uppercase text-foreground whitespace-nowrap"
        style={{
          transform: hovered ? 'translateY(-100%) scale(0.92)' : 'translateY(0) scale(1)',
          opacity: hovered ? 0 : 0.9,
          filter: hovered ? 'blur(2px)' : 'blur(0)',
          transition: 'transform 350ms cubic-bezier(0.16,1,0.3,1), opacity 250ms cubic-bezier(0.16,1,0.3,1), filter 300ms cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {name}
      </span>
      <span
        className="absolute left-0 top-0 block text-[11px] tracking-[0.12em] uppercase text-foreground whitespace-nowrap"
        style={{
          transform: hovered ? 'translateY(0) scale(1)' : 'translateY(100%) scale(0.92)',
          opacity: hovered ? 0.9 : 0,
          filter: hovered ? 'blur(0)' : 'blur(2px)',
          transition: 'transform 350ms cubic-bezier(0.16,1,0.3,1), opacity 300ms cubic-bezier(0.16,1,0.3,1) 50ms, filter 300ms cubic-bezier(0.16,1,0.3,1) 50ms',
        }}
        aria-hidden
      >
        {name}
      </span>
    </Link>
  )
}

export default function TopMeta({ coordinates }: TopMetaProps) {
  const pathname = usePathname()

  if (pathname.startsWith('/projects/') || pathname === '/about' || pathname === '/archive') {
    return null
  }

  return (
    <>
      <CoordinateLabel coordinates={coordinates} />
      <div
        className="absolute right-4 top-4 z-50 hidden items-center gap-4 sm:right-6 sm:top-6 sm:flex"
        style={{ fontFamily: 'inherit' }}
      >
        {PAGE_NAV.map((item) => (
          <NavLink key={item.href} href={item.href} name={item.name} />
        ))}
        <ThemeToggle />
      </div>
    </>
  )
}
