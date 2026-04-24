'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Summer as PixelSun } from '@/components/pixel/glyphs'

const PAGE_NAV = [
  { name: 'Home', href: '/' },
  { name: 'Playground', href: '/archive' },
] as const

function NavLink({ href, name, active }: { href: string; name: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-[40px] items-center font-header text-[0.76rem] tracking-[-0.01em] transition-[color,transform] duration-150 ${
        active ? 'text-foreground' : 'text-muted-foreground hover:-translate-y-[1px] hover:text-foreground'
      }`}
    >
      <span className="decoration-border underline underline-offset-[0.24em] transition-[text-decoration-color] duration-150 hover:decoration-foreground/60">
        {name}
      </span>
    </Link>
  )
}

export default function TopMeta() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [headerHidden, setHeaderHidden] = useState(false)
  const [brandHovered, setBrandHovered] = useState(false)
  const [navHovered, setNavHovered] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    setMobileMenuOpen(false)
    setHeaderHidden(false)
  }, [pathname])

  useEffect(() => {
    let ticking = false

    const updateHeaderVisibility = () => {
      const currentScrollY = window.scrollY
      const scrollingDown = currentScrollY > lastScrollY.current
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current)

      if (currentScrollY <= 24) {
        setHeaderHidden(false)
      } else if (scrollDelta > 6) {
        setHeaderHidden(scrollingDown)
      }

      lastScrollY.current = currentScrollY
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeaderVisibility)
        ticking = true
      }
    }

    lastScrollY.current = window.scrollY
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={`fixed inset-x-0 top-0 z-40 px-5 py-4 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-8 sm:py-6 ${
        headerHidden && !mobileMenuOpen
          ? 'pointer-events-none -translate-y-6 opacity-0'
          : 'pointer-events-none translate-y-0 opacity-100'
      }`}
    >
      <div
        className="pointer-events-auto relative mx-auto flex max-w-[36rem] items-center justify-between gap-6"
      >
        <div
          aria-hidden
          className={`pointer-events-none absolute left-[-10%] top-[-120%] h-[12rem] w-[42%] rounded-full blur-[48px] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            brandHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{
            background:
              'radial-gradient(ellipse at 28% 48%, rgba(255, 78, 56, 0.48) 0%, rgba(255, 111, 42, 0.34) 24%, rgba(255, 150, 66, 0.18) 44%, rgba(255, 198, 126, 0.07) 62%, transparent 78%)',
          }}
        />
        <div
          aria-hidden
          className={`pointer-events-none absolute right-[-8%] top-[-120%] h-[12rem] w-[38%] rounded-full blur-[48px] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            navHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{
            background:
              'radial-gradient(ellipse at 72% 48%, rgba(255, 154, 64, 0.34) 0%, rgba(255, 170, 86, 0.2) 24%, rgba(255, 188, 118, 0.1) 42%, rgba(255, 212, 168, 0.04) 58%, transparent 76%)',
          }}
        />
        <Link
          href="/"
          className="inline-flex min-h-[40px] items-center gap-2 leading-none font-header text-[0.9rem] tracking-[-0.03em] text-foreground/88 transition-[color,transform] duration-150 hover:-translate-y-[1px] hover:text-foreground"
          onMouseEnter={() => setBrandHovered(true)}
          onMouseLeave={() => setBrandHovered(false)}
        >
          <span>Hunter Bastian</span>
          <span className="text-accent/85">
            <PixelSun size={11} />
          </span>
        </Link>

        <nav
          className="hidden items-center gap-5 sm:flex"
          onMouseEnter={() => setNavHovered(true)}
          onMouseLeave={() => setNavHovered(false)}
        >
          {PAGE_NAV.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              name={item.name}
              active={item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)}
            />
          ))}
        </nav>

        <div className="sm:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="min-h-[40px] font-header text-[0.76rem] text-muted-foreground transition-colors duration-150 hover:text-foreground"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span className="decoration-border underline underline-offset-[0.24em]">
              Menu
            </span>
          </button>

          {mobileMenuOpen ? (
            <div className="mt-3 flex flex-col items-end gap-2 border border-border/80 bg-background/96 px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              {PAGE_NAV.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  name={item.name}
                  active={item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
