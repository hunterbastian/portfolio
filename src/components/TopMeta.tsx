'use client'

import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useWebHaptics } from 'web-haptics/react'
import { Summer as PixelSun } from '@/components/pixel/glyphs'
import { PeekAction } from '@/components/PeekAction'
import { chromePillClassName, chromePillIconClassName, chromePillLabelClassName } from '@/components/ui/tactile'
import { showJoyToast } from '@/lib/joy'
import { analytics } from '@/lib/analytics'
import { useMediaQuery } from '@/lib/use-media-query'
import { cn } from '@/lib/utils'

const PAGE_NAV = [
  { name: 'Home', href: '/', peek: 'Go home', toast: 'Opening home' },
  { name: 'Playground', href: '/archive', peek: 'Open experiments', toast: 'Opening playground' },
] as const

const LAUNCHER_OPEN_EVENT = 'hb-open-launcher'
const LAUNCHER_PRELOAD_EVENT = 'hb-preload-launcher'
const TOP_REVEAL_SCROLL_Y = 24

function NavLink({ href, name, active, peek, toast }: { href: string; name: string; active: boolean; peek: string; toast: string }) {
  const haptic = useWebHaptics()

  return (
    <PeekAction
      href={href}
      peek={peek}
      className={cn(
        'justify-center text-[0.76rem] tracking-normal sm:text-[0.94rem]',
        active ? 'text-foreground' : 'text-muted-foreground/76 hover:text-foreground/82',
      )}
      labelClassName={cn(
        'underline decoration-[0.08em] underline-offset-[0.24em] transition-[filter,text-decoration-color] duration-150 group-hover/peek:brightness-95',
        active ? 'decoration-foreground/55' : 'decoration-transparent group-hover/peek:decoration-foreground/30',
      )}
      onClick={() => {
        haptic.trigger('light')
        analytics.navigationClick(name.toLowerCase())
        showJoyToast(toast)
      }}
    >
      {name}
    </PeekAction>
  )
}

export default function TopMeta() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [headerHidden, setHeaderHidden] = useState(false)
  const [sunBlinking, setSunBlinking] = useState(false)
  const mobileMenuOpenRef = useRef(false)
  const sunIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sunBlinkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const haptic = useWebHaptics()
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

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

    const syncHeaderVisibility = () => {
      setHeaderHidden(window.scrollY > TOP_REVEAL_SCROLL_Y)
    }

    syncHeaderVisibility()
    const frame = window.requestAnimationFrame(syncHeaderVisibility)

    return () => window.cancelAnimationFrame(frame)
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
    if (prefersReducedMotion) return

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
  }, [prefersReducedMotion, triggerSunBlink])

  useEffect(() => {
    mobileMenuOpenRef.current = mobileMenuOpen
  }, [mobileMenuOpen])

  useEffect(() => {
    let ticking = false

    const updateHeaderVisibility = () => {
      const currentScrollY = window.scrollY
      const atTop = currentScrollY <= TOP_REVEAL_SCROLL_Y

      if (atTop) {
        setHeaderHidden(false)
      } else {
        if (mobileMenuOpenRef.current) {
          setMobileMenuOpen(false)
        }
        setHeaderHidden(true)
      }

      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeaderVisibility)
        ticking = true
      }
    }

    updateHeaderVisibility()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={`fixed inset-x-0 top-0 z-40 px-5 py-4 transition-[transform,opacity,filter] duration-300 ease-soft sm:px-8 sm:py-6 ${
        headerHidden && !mobileMenuOpen
          ? 'pointer-events-none -translate-y-3 opacity-0 blur-[2px]'
          : 'pointer-events-none translate-y-0 opacity-100 blur-0'
      }`}
    >
      <div
        className={cn(
          'relative isolate mx-auto flex max-w-[36rem] items-center justify-between gap-6 border-b border-border/72 pb-3 sm:pb-3.5',
          headerHidden && !mobileMenuOpen ? 'pointer-events-none' : 'pointer-events-auto',
        )}
      >
        <PeekAction
          href="/"
          peek="Start here"
          className="z-10 text-[0.86rem] tracking-normal text-foreground/80 hover:text-foreground"
          labelClassName="inline-flex items-center gap-2"
          onClick={() => {
            haptic.trigger('light')
            analytics.navigationClick('home')
            triggerSunBlink()
            showJoyToast('Opening home')
          }}
        >
          <span>Hunter Bastian</span>
          <span className={`header-sun-shell text-accent/85 transition-[filter,transform] duration-200 ease-soft group-active:scale-[0.96] ${
            sunBlinking ? 'animate-hb-sun-blink' : ''
          }`}>
              <PixelSun size={11} />
            </span>
        </PeekAction>

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

          <PeekAction
            peek="Open Launchpad"
            className="group/launcher pointer-events-auto shrink-0 text-foreground transition-[filter,transform] duration-200"
            labelClassName="inline-flex"
            ariaLabel="Open Launchpad. Also use CMD K"
            onClick={() => {
              haptic.trigger('light')
              analytics.navigationClick('launchpad')
              window.dispatchEvent(new CustomEvent(LAUNCHER_OPEN_EVENT))
            }}
            onFocus={() => window.dispatchEvent(new CustomEvent(LAUNCHER_PRELOAD_EVENT))}
            onMouseEnter={() => window.dispatchEvent(new CustomEvent(LAUNCHER_PRELOAD_EVENT))}
          >
            <span className={chromePillClassName({ size: 'launchpad' })}>
              <span className={chromePillLabelClassName}>Launchpad</span>
              <ArrowUpRight
                aria-hidden="true"
                strokeWidth={1.95}
                className={cn(chromePillIconClassName, 'h-[1rem] w-[1rem] translate-y-[-0.03rem] group-hover/launcher:-translate-y-[0.18rem]')}
              />
            </span>
          </PeekAction>
        </div>

        <div className="relative z-10 sm:hidden">
          <PeekAction
            onClick={() => {
              haptic.trigger('light')
              setMobileMenuOpen((open) => !open)
            }}
            className="justify-center text-[0.76rem] text-muted-foreground hover:text-foreground"
            labelClassName="decoration-border underline underline-offset-[0.24em]"
            ariaLabel={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            ariaExpanded={mobileMenuOpen}
          >
            Menu
          </PeekAction>

          <div
            className={`absolute right-0 top-[calc(100%+0.65rem)] z-50 w-[10.5rem] origin-top-right overflow-hidden rounded-[8px] border border-border/72 bg-background/94 shadow-[0_18px_44px_-32px_rgba(43,39,34,0.52),0_1px_3px_rgba(43,39,34,0.06)] backdrop-blur-xl transition-[opacity,transform,filter] duration-200 ease-soft ${
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
              <PeekAction
                className="group/launcher-mobile gap-2 border-t border-border/58 pt-2.5 text-[0.76rem] text-foreground hover:text-foreground/82"
                labelClassName="inline-flex items-center gap-2"
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
              </PeekAction>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
