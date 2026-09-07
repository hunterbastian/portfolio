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
import { LAUNCHER_OPEN_EVENT, LAUNCHER_PRELOAD_EVENT } from '@/lib/launcher'
import {
  TOP_META_BRAND_ACTION,
  TOP_META_LAUNCHPAD_ARIA_LABEL,
  TOP_META_LAUNCHPAD_LABEL,
  TOP_META_LAUNCHPAD_PEEK,
  TOP_META_MOBILE_MENU_LABEL,
  TOP_META_NAV_ITEMS,
  activateTopMetaBrandAction,
  activateTopMetaLaunchpad,
  activateTopMetaMobileMenuToggle,
  activateTopMetaNavAction,
  activateTopMetaSunBlink,
  getTopMetaInnerClassName,
  getTopMetaMobileMenuAriaLabel,
  getTopMetaMobileMenuClassName,
  getTopMetaHeaderState,
  getTopMetaNavAction,
  getTopMetaNavLabelClassName,
  getTopMetaNavLinkClassName,
  getTopMetaShellClassName,
  getTopMetaSunClassName,
  getTopMetaSunIdleDelay,
  preloadTopMetaLaunchpad,
  type TopMetaNavItem,
  isTopMetaNavItemActive,
  shouldHideTopMetaHeader,
} from '@/lib/top-meta'
import { useMediaQuery } from '@/lib/use-media-query'
import { cn } from '@/lib/utils'

function NavLink({ item, active, className }: { item: TopMetaNavItem; active: boolean; className?: string }) {
  const haptic = useWebHaptics()
  const action = getTopMetaNavAction(item)

  return (
    <PeekAction
      href={item.href}
      peek={item.peek}
      className={cn(getTopMetaNavLinkClassName(active), className)}
      labelClassName={getTopMetaNavLabelClassName(active)}
      onClick={() =>
        activateTopMetaNavAction({
          action,
          showToast: showJoyToast,
          trackNavigationClick: (target) => analytics.navigationClick(target),
          triggerHaptic: (style) => haptic.trigger(style),
        })
      }
    >
      {item.name}
    </PeekAction>
  )
}

function openTopMetaLaunchpad() {
  window.dispatchEvent(new CustomEvent(LAUNCHER_OPEN_EVENT))
}

function preloadLauncher() {
  preloadTopMetaLaunchpad({
    preloadLauncher: () => window.dispatchEvent(new CustomEvent(LAUNCHER_PRELOAD_EVENT)),
  })
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
    sunBlinkTimerRef.current = activateTopMetaSunBlink({
      clearTimer: (timer) => clearTimeout(timer),
      currentTimer: sunBlinkTimerRef.current,
      scheduleTimer: (callback, delayMs) => setTimeout(callback, delayMs),
      setSunBlinking,
    })
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)

    const syncHeaderVisibility = () => {
      setHeaderHidden(shouldHideTopMetaHeader(window.scrollY))
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
      }, getTopMetaSunIdleDelay())
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
      const nextState = getTopMetaHeaderState({
        mobileMenuOpen: mobileMenuOpenRef.current,
        scrollY: window.scrollY,
      })

      if (!nextState.mobileMenuOpen && mobileMenuOpenRef.current) {
        setMobileMenuOpen(false)
      }

      setHeaderHidden(nextState.headerHidden)
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
      className={getTopMetaShellClassName(headerHidden, mobileMenuOpen)}
    >
      <div
        className={getTopMetaInnerClassName(headerHidden, mobileMenuOpen)}
      >
        <PeekAction
          href="/"
          peek="Start here"
          className="z-10 text-[0.86rem] tracking-normal text-foreground/80 hover:text-foreground"
          labelClassName="inline-flex items-center gap-2"
          onClick={() =>
            activateTopMetaBrandAction({
              action: TOP_META_BRAND_ACTION,
              showToast: showJoyToast,
              trackNavigationClick: (target) => analytics.navigationClick(target),
              triggerHaptic: (style) => haptic.trigger(style),
              triggerSunBlink,
            })
          }
        >
          <span>Hunter Bastian</span>
          <span className={getTopMetaSunClassName(sunBlinking)}>
            <PixelSun size={10} />
          </span>
        </PeekAction>

        <div className="relative z-10 hidden w-[21rem] items-center justify-end gap-3 sm:flex">
          <nav className="flex items-center gap-6">
            {TOP_META_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={isTopMetaNavItemActive(pathname, item)}
              />
            ))}
          </nav>
          <PeekAction
            peek={TOP_META_LAUNCHPAD_PEEK}
            className="group/launcher pointer-events-auto shrink-0 text-foreground transition-[filter,transform] duration-200"
            labelClassName="inline-flex"
            ariaLabel={TOP_META_LAUNCHPAD_ARIA_LABEL}
            onClick={() =>
              activateTopMetaLaunchpad({
                openLauncher: openTopMetaLaunchpad,
                trackNavigationClick: (target) => analytics.navigationClick(target),
                triggerHaptic: (style) => haptic.trigger(style),
              })
            }
            onFocus={preloadLauncher}
            onMouseEnter={preloadLauncher}
          >
            <span className={chromePillClassName({ size: 'launchpad' })}>
              <span className={chromePillLabelClassName}>{TOP_META_LAUNCHPAD_LABEL}</span>
              <ArrowUpRight
                aria-hidden="true"
                strokeWidth={1.95}
                className={cn(chromePillIconClassName, 'h-[0.9rem] w-[0.9rem] translate-y-[-0.03rem] group-hover/launcher:-translate-y-[0.18rem]')}
              />
            </span>
          </PeekAction>
        </div>

        <div className="relative z-10 flex items-center gap-1 sm:hidden">
          <PeekAction
            onClick={() =>
              activateTopMetaMobileMenuToggle({
                toggleMobileMenu: () => setMobileMenuOpen((open) => !open),
                triggerHaptic: (style) => haptic.trigger(style),
              })
            }
            className="justify-center text-[0.76rem] text-muted-foreground hover:text-foreground"
            labelClassName="decoration-border underline underline-offset-[0.24em]"
            ariaLabel={getTopMetaMobileMenuAriaLabel(mobileMenuOpen)}
            ariaExpanded={mobileMenuOpen}
          >
            {TOP_META_MOBILE_MENU_LABEL}
          </PeekAction>

          <div
            className={getTopMetaMobileMenuClassName(mobileMenuOpen)}
            aria-hidden={!mobileMenuOpen}
          >
            <div className="flex flex-col items-stretch gap-1.5 px-3.5 py-3">
              {TOP_META_NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  active={isTopMetaNavItemActive(pathname, item)}
                  className="w-full justify-start rounded-[6px] px-2 text-left hover:bg-foreground/[0.035]"
                />
              ))}
              <PeekAction
                className="group/launcher-mobile w-full justify-start gap-2 border-t border-border/58 px-2 pt-2.5 text-left text-[0.76rem] text-foreground hover:bg-foreground/[0.035] hover:text-foreground/82"
                labelClassName="inline-flex items-center gap-2"
                onClick={() =>
                  activateTopMetaLaunchpad({
                    closeMobileMenu: () => setMobileMenuOpen(false),
                    openLauncher: openTopMetaLaunchpad,
                    trackNavigationClick: (target) => analytics.navigationClick(target),
                    triggerHaptic: (style) => haptic.trigger(style),
                  })
                }
                onFocus={preloadLauncher}
                onMouseEnter={preloadLauncher}
              >
                <span className="underline decoration-border underline-offset-[0.24em]">
                  {TOP_META_LAUNCHPAD_LABEL}
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  strokeWidth={1.9}
                  className="h-[0.76rem] w-[0.76rem] transition-transform duration-150 group-hover/launcher-mobile:translate-x-0.5 group-hover/launcher-mobile:-translate-y-0.5"
                />
              </PeekAction>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
