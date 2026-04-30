'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useWebHaptics } from 'web-haptics/react'
import { Summer as PixelSun } from '@/components/pixel/glyphs'
import { showJoyToast } from '@/lib/joy'

const PAGE_NAV = [
  { name: 'Home', href: '/', peek: 'Go home', toast: 'Opening home' },
  { name: 'Playground', href: '/archive', peek: 'Open experiments', toast: 'Opening playground' },
] as const

function NavLink({ href, name, active, peek, toast }: { href: string; name: string; active: boolean; peek: string; toast: string }) {
  const haptic = useWebHaptics()

  return (
    <Link
      href={href}
      className={`group/peek relative inline-flex min-h-[40px] origin-center touch-manipulation items-center font-header text-[0.76rem] tracking-[-0.01em] transition-[color,transform] duration-150 active:translate-y-0 active:scale-[0.96] ${
        active ? 'text-foreground' : 'text-muted-foreground hover:-translate-y-[1px] hover:text-foreground'
      }`}
      onClick={() => {
        haptic.trigger('light')
        showJoyToast(toast)
      }}
    >
      <span className="decoration-border underline underline-offset-[0.24em] transition-[text-decoration-color] duration-150 hover:decoration-foreground/60">
        {name}
      </span>
      <span className="pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 -translate-y-1 whitespace-nowrap border border-border/70 bg-background/92 px-2 py-1 font-mono text-[0.62rem] text-muted-foreground opacity-0 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.35)] blur-[4px] transition-[opacity,transform,filter] duration-200 group-hover/peek:translate-y-0 group-hover/peek:opacity-100 group-hover/peek:blur-0 group-focus-visible/peek:translate-y-0 group-focus-visible/peek:opacity-100 group-focus-visible/peek:blur-0">
        {peek}
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
  const haptic = useWebHaptics()

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
          className="group group/peek relative inline-flex min-h-[40px] origin-center touch-manipulation items-center gap-2 leading-none font-header text-[0.9rem] tracking-[-0.03em] text-foreground/88 transition-[color,transform] duration-150 hover:-translate-y-[1px] hover:text-foreground active:translate-y-0 active:scale-[0.96]"
          onMouseEnter={() => setBrandHovered(true)}
          onMouseLeave={() => setBrandHovered(false)}
          onClick={() => {
            haptic.trigger('light')
            showJoyToast('Opening home')
          }}
        >
          <span>Hunter Bastian</span>
          <span className="text-accent/85 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-12 group-hover:scale-110 group-active:scale-[0.96]">
            <PixelSun size={11} />
          </span>
          <span className="pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 -translate-y-1 whitespace-nowrap border border-border/70 bg-background/92 px-2 py-1 font-mono text-[0.62rem] text-muted-foreground opacity-0 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.35)] blur-[4px] transition-[opacity,transform,filter] duration-200 group-hover/peek:translate-y-0 group-hover/peek:opacity-100 group-hover/peek:blur-0 group-focus-visible/peek:translate-y-0 group-focus-visible/peek:opacity-100 group-focus-visible/peek:blur-0">
            Start here
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
              peek={item.peek}
              toast={item.toast}
              active={item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)}
            />
          ))}
        </nav>

        <div className="sm:hidden">
          <button
            type="button"
            onClick={() => {
              haptic.trigger('light')
              setMobileMenuOpen((open) => !open)
            }}
            className="min-h-[40px] origin-center touch-manipulation font-header text-[0.76rem] text-muted-foreground transition-[color,transform] duration-150 hover:text-foreground active:translate-y-0 active:scale-[0.96]"
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
                  peek={item.peek}
                  toast={item.toast}
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
