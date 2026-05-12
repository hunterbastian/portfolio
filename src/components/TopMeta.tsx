'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useWebHaptics } from 'web-haptics/react'
import { Summer as PixelSun } from '@/components/pixel/glyphs'
import { showJoyToast } from '@/lib/joy'
import { analytics } from '@/lib/analytics'

const PAGE_NAV = [
  { name: 'Home', href: '/', peek: 'Go home', toast: 'Opening home' },
  { name: 'Playground', href: '/archive', peek: 'Open experiments', toast: 'Opening playground' },
] as const

const LAUNCHER_OPEN_EVENT = 'hb-open-launcher'
const LAUNCHER_PRELOAD_EVENT = 'hb-preload-launcher'
const HEADER_TOOLTIP_CLASS =
  'pointer-events-none absolute left-1/2 top-full z-50 mt-1.5 hidden -translate-x-1/2 -translate-y-1 whitespace-nowrap rounded-[5px] border border-border/70 bg-background px-2 py-1 font-mono text-[0.62rem] leading-none text-muted-foreground opacity-0 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.35)] blur-[4px] transition-[opacity,transform,filter] duration-200 group-hover/peek:translate-y-0 group-hover/peek:opacity-100 group-hover/peek:blur-0 group-focus-visible/peek:translate-y-0 group-focus-visible/peek:opacity-100 group-focus-visible/peek:blur-0 sm:block'

function NavLink({ href, name, active, peek, toast }: { href: string; name: string; active: boolean; peek: string; toast: string }) {
  const haptic = useWebHaptics()

  return (
    <Link
      href={href}
      className={`group/nav group/peek relative inline-flex min-h-[40px] origin-center touch-manipulation items-center justify-center font-header text-[0.76rem] leading-none tracking-normal transition-[color,transform] duration-150 active:translate-y-0 active:scale-[0.96] sm:min-h-[40px] sm:text-[0.94rem] ${
        active ? 'text-foreground' : 'text-muted-foreground/76 hover:-translate-y-[1px] hover:text-foreground/82'
      }`}
      onClick={() => {
        haptic.trigger('light')
        analytics.navigationClick(name.toLowerCase())
        showJoyToast(toast)
      }}
    >
      <span
        className={`underline decoration-[0.08em] underline-offset-[0.24em] transition-[filter,text-decoration-color] duration-150 group-hover/nav:brightness-95 ${
          active ? 'decoration-foreground/55' : 'decoration-transparent group-hover/nav:decoration-foreground/30'
        }`}
      >
        {name}
      </span>
      <span className={HEADER_TOOLTIP_CLASS}>{peek}</span>
    </Link>
  )
}

export default function TopMeta() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [headerHidden, setHeaderHidden] = useState(false)
  const [sunBlinking, setSunBlinking] = useState(false)
  const lastScrollY = useRef(0)
  const mobileMenuOpenRef = useRef(false)
  const sunIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sunBlinkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const haptic = useWebHaptics()

  const triggerSunBlink = useCallback(() => {
    setSunBlinking(true)
    if (sunBlinkTimerRef.current) {
      clearTimeout(sunBlinkTimerRef.current)
    }
    sunBlinkTimerRef.current = setTimeout(() => {
      setSunBlinking(false)
    }, 420)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setHeaderHidden(false)
  }, [pathname])

  useEffect(() => {
    return () => {
      if (sunIdleTimerRef.current) {
        clearTimeout(sunIdleTimerRef.current)
      }
      if (sunBlinkTimerRef.current) {
        clearTimeout(sunBlinkTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const scheduleIdleBlink = () => {
      sunIdleTimerRef.current = setTimeout(() => {
        triggerSunBlink()
        scheduleIdleBlink()
      }, 11000 + Math.random() * 7000)
    }

    scheduleIdleBlink()

    return () => {
      if (sunIdleTimerRef.current) {
        clearTimeout(sunIdleTimerRef.current)
      }
    }
  }, [triggerSunBlink])

  useEffect(() => {
    mobileMenuOpenRef.current = mobileMenuOpen
  }, [mobileMenuOpen])

  useEffect(() => {
    let ticking = false

    const updateHeaderVisibility = () => {
      const currentScrollY = window.scrollY
      const scrollingDown = currentScrollY > lastScrollY.current
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current)

      if (currentScrollY <= 24) {
        setHeaderHidden(false)
      } else if (scrollDelta > 6) {
        if (mobileMenuOpenRef.current) {
          setMobileMenuOpen(false)
        }
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
        className="pointer-events-auto relative isolate mx-auto flex max-w-[36rem] items-center justify-between gap-6 border-b border-border/72 pb-3 sm:pb-3.5"
      >
        <Link
          href="/"
          className="group group/peek relative z-10 inline-flex min-h-[40px] origin-center touch-manipulation items-center gap-2 leading-none font-header text-[0.86rem] tracking-normal text-foreground/80 transition-[color,transform] duration-150 hover:-translate-y-[1px] hover:text-foreground active:translate-y-0 active:scale-[0.96]"
          onClick={() => {
            haptic.trigger('light')
            analytics.navigationClick('home')
            triggerSunBlink()
            showJoyToast('Opening home')
          }}
        >
          <span>Hunter Bastian</span>
          <span className={`header-sun-shell text-accent/85 transition-[filter,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-active:scale-[0.96] ${
            sunBlinking ? 'animate-hb-sun-blink' : ''
          }`}>
            <PixelSun size={11} />
          </span>
          <span className={HEADER_TOOLTIP_CLASS}>Start here</span>
        </Link>

        <div className="relative z-10 hidden w-[16.5rem] items-center justify-end gap-5 sm:flex">
          <nav className="flex items-center gap-6">
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

          <button
            type="button"
            className="group/launcher group/peek pointer-events-auto relative inline-flex min-h-[40px] origin-center touch-manipulation items-center font-header leading-none tracking-normal text-foreground transition-[filter,transform] duration-200 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            aria-label="Open Launchpad. Also use CMD K"
            onClick={() => {
              haptic.trigger('light')
              analytics.navigationClick('launchpad')
              window.dispatchEvent(new CustomEvent(LAUNCHER_OPEN_EVENT))
            }}
            onFocus={() => window.dispatchEvent(new CustomEvent(LAUNCHER_PRELOAD_EVENT))}
            onMouseEnter={() => window.dispatchEvent(new CustomEvent(LAUNCHER_PRELOAD_EVENT))}
          >
            <span className="launcher-depth-pill relative isolate inline-flex min-w-[8rem] items-center justify-center gap-3 overflow-hidden rounded-full px-4 py-[0.48rem] leading-none">
              <span className="relative z-10 translate-y-[0.01rem] text-[0.83rem] tracking-[-0.025em] text-[#403d38] [text-shadow:0_1px_0_rgba(255,255,255,0.72)] dark:text-[#f7efe4]">
                Launchpad
              </span>
              <ArrowUpRight
                aria-hidden="true"
                strokeWidth={1.95}
                className="relative z-10 h-[1rem] w-[1rem] translate-y-[-0.03rem] text-[#403d38] drop-shadow-[0_1px_0_rgba(255,255,255,0.7)] transition-transform duration-200 group-hover/launcher:translate-x-0.5 group-hover/launcher:-translate-y-[0.18rem] dark:text-[#f7efe4]"
              />
            </span>
            <span className={HEADER_TOOLTIP_CLASS}>Open Launchpad</span>
          </button>
        </div>

        <div className="relative z-10 sm:hidden">
          <button
            type="button"
            onClick={() => {
              haptic.trigger('light')
              setMobileMenuOpen((open) => !open)
            }}
            className="inline-flex min-h-[40px] min-w-[40px] origin-center touch-manipulation items-center justify-center font-header text-[0.76rem] text-muted-foreground transition-[color,transform] duration-150 hover:text-foreground active:translate-y-0 active:scale-[0.96]"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span className="decoration-border underline underline-offset-[0.24em]">
              Menu
            </span>
          </button>

          <div
            className={`absolute right-0 top-[calc(100%+0.65rem)] z-50 w-[10.5rem] origin-top-right overflow-hidden rounded-[8px] border border-border/72 bg-background/94 shadow-[0_18px_44px_-32px_rgba(43,39,34,0.52),0_1px_3px_rgba(43,39,34,0.06)] backdrop-blur-xl transition-[opacity,transform,filter] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mobileMenuOpen
                ? 'pointer-events-auto visible translate-y-0 opacity-100 blur-0'
                : 'pointer-events-none invisible translate-y-1 opacity-0 blur-[4px]'
            }`}
            aria-hidden={!mobileMenuOpen}
          >
            <div className="flex flex-col items-end gap-1.5 px-3.5 py-3">
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
              <button
                type="button"
                className="group/launcher-mobile relative inline-flex min-h-[40px] origin-center touch-manipulation items-center gap-2 border-t border-border/58 pt-2.5 font-header text-[0.76rem] leading-none text-foreground transition-[color,transform] duration-150 hover:text-foreground/82 active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                onClick={() => {
                  haptic.trigger('light')
                  analytics.navigationClick('launchpad')
                  setMobileMenuOpen(false)
                  window.dispatchEvent(new CustomEvent(LAUNCHER_OPEN_EVENT))
                }}
                onFocus={() => window.dispatchEvent(new CustomEvent(LAUNCHER_PRELOAD_EVENT))}
                onMouseEnter={() => window.dispatchEvent(new CustomEvent(LAUNCHER_PRELOAD_EVENT))}
              >
                <span className="underline decoration-border underline-offset-[0.24em]">
                  Launchpad
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  strokeWidth={1.9}
                  className="h-[0.82rem] w-[0.82rem] transition-transform duration-150 group-hover/launcher-mobile:translate-x-0.5 group-hover/launcher-mobile:-translate-y-0.5"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
