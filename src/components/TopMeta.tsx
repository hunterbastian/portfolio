'use client'

import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useWebHaptics } from 'web-haptics/react'
import { Summer as PixelSun } from '@/components/pixel/glyphs'
import { PeekAction } from '@/components/PeekAction'
import { showJoyToast } from '@/lib/joy'
import { analytics } from '@/lib/analytics'
import {
  HOME_SECTION_NAV_ARIA_LABEL,
  HOME_SECTION_NAV_ITEMS,
  HOME_SECTION_NAV_LIST_CLASS_NAME,
  HOME_SECTION_NAV_SCROLL_OFFSET_PX,
  activateHomeSectionNavigation,
  getActiveHomeSectionId,
  getHomeSectionHref,
  getHomeSectionNavAriaCurrent,
  getHomeSectionNavLinkClassName,
  getHomeSectionPositions,
  shouldShowHomeSectionNav,
  type HomeSectionNavItem,
} from '@/lib/home-section-nav'
import { getPeekActionClassName } from '@/lib/peek-action'
import {
  TOP_META_BRAND_ACTION,
  TOP_META_MOBILE_MENU_LABEL,
  activateTopMetaBrandAction,
  activateTopMetaMobileMenuToggle,
  activateTopMetaNavAction,
  activateTopMetaSunBlink,
  getTopMetaInnerClassName,
  getTopMetaMobileMenuAriaLabel,
  getTopMetaMobileMenuClassName,
  getTopMetaHeaderState,
  getTopMetaMobilePageNavItems,
  getTopMetaNavAction,
  getTopMetaNavLabelClassName,
  getTopMetaNavLinkClassName,
  getTopMetaPageNavItems,
  getTopMetaShellClassName,
  getTopMetaSunClassName,
  getTopMetaSunIdleDelay,
  type TopMetaNavItem,
  isTopMetaNavItemActive,
  shouldFrostTopMetaHeader,
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

function replaceHomeSectionUrl(href: string) {
  window.history.replaceState(null, '', href)
}

function SectionNavLink({
  active,
  className,
  closeMobileMenu,
  item,
  onActivate,
  prefersReducedMotion,
}: {
  active: boolean
  className?: string
  closeMobileMenu?: () => void
  item: HomeSectionNavItem
  onActivate?: (sectionId: string) => void
  prefersReducedMotion: boolean
}) {
  const haptic = useWebHaptics()

  return (
    <a
      href={getHomeSectionHref(item.id)}
      aria-current={getHomeSectionNavAriaCurrent(active)}
      className={getPeekActionClassName(cn(getHomeSectionNavLinkClassName(active), className))}
      title={item.peek}
      onClick={(event) => {
        if (!shouldShowHomeSectionNav(window.location.pathname)) {
          closeMobileMenu?.()
          return
        }

        event.preventDefault()
        onActivate?.(item.id)
        activateHomeSectionNavigation({
          closeMobileMenu,
          findSectionElement: (sectionId) => document.getElementById(sectionId),
          prefersReducedMotion,
          replaceUrl: replaceHomeSectionUrl,
          sectionId: item.id,
          trackNavigationClick: (target) => analytics.navigationClick(target),
          triggerHaptic: (style) => haptic.trigger(style),
        })
      }}
    >
      <span className={getTopMetaNavLabelClassName(active)}>{item.name}</span>
    </a>
  )
}

export default function TopMeta() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [headerHidden, setHeaderHidden] = useState(false)
  const [headerFrosted, setHeaderFrosted] = useState(false)
  const [sunBlinking, setSunBlinking] = useState(false)
  const [activeSectionId, setActiveSectionId] = useState<string>(HOME_SECTION_NAV_ITEMS[0].id)
  const mobileMenuOpenRef = useRef(false)
  const sunIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sunBlinkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const haptic = useWebHaptics()
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const persistVisible = shouldShowHomeSectionNav(pathname)
  const pageNavItems = getTopMetaPageNavItems(pathname)
  const mobilePageNavItems = getTopMetaMobilePageNavItems(pathname)
  const closeMobileMenu = () => setMobileMenuOpen(false)

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
    setActiveSectionId(HOME_SECTION_NAV_ITEMS[0].id)

    const syncHeaderVisibility = () => {
      setHeaderHidden(shouldHideTopMetaHeader({ persistVisible, scrollY: window.scrollY }))
      setHeaderFrosted(shouldFrostTopMetaHeader({ persistVisible, scrollY: window.scrollY }))
    }

    syncHeaderVisibility()
    const frame = window.requestAnimationFrame(syncHeaderVisibility)

    return () => window.cancelAnimationFrame(frame)
  }, [pathname, persistVisible])

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
        persistVisible,
        scrollY: window.scrollY,
      })

      if (!nextState.mobileMenuOpen && mobileMenuOpenRef.current) {
        setMobileMenuOpen(false)
      }

      setHeaderHidden(nextState.headerHidden)
      setHeaderFrosted(shouldFrostTopMetaHeader({ persistVisible, scrollY: window.scrollY }))

      if (persistVisible) {
        const sections = getHomeSectionPositions(HOME_SECTION_NAV_ITEMS, (sectionId) => {
          const element = document.getElementById(sectionId)

          if (!element) {
            return null
          }

          return element.getBoundingClientRect().top + window.scrollY
        })

        setActiveSectionId(
          getActiveHomeSectionId(sections, window.scrollY, HOME_SECTION_NAV_SCROLL_OFFSET_PX, {
            documentHeight: document.documentElement.scrollHeight,
            height: window.innerHeight,
          }),
        )
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
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [persistVisible])

  return (
    <div
      className={getTopMetaShellClassName(headerHidden, mobileMenuOpen, headerFrosted)}
    >
      <div
        className={cn(getTopMetaInnerClassName(headerHidden, mobileMenuOpen), persistVisible && 'gap-3 sm:gap-4')}
      >
        <PeekAction
          href="/"
          peek="Start here"
          className="z-10 shrink-0 text-[0.86rem] tracking-normal text-foreground/80 hover:text-foreground"
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

        <div
          className={cn(
            'relative z-10 hidden items-center justify-end sm:flex',
            persistVisible && 'min-w-0 flex-1',
          )}
        >
          {persistVisible ? (
            <nav aria-label={HOME_SECTION_NAV_ARIA_LABEL} className={HOME_SECTION_NAV_LIST_CLASS_NAME}>
              {HOME_SECTION_NAV_ITEMS.map((item) => (
                <SectionNavLink
                  key={item.id}
                  active={item.id === activeSectionId}
                  item={item}
                  onActivate={setActiveSectionId}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </nav>
          ) : (
            <nav className="flex items-center gap-6">
              {pageNavItems.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  active={isTopMetaNavItemActive(pathname, item)}
                />
              ))}
            </nav>
          )}
        </div>

        <div className="relative z-10 flex items-center gap-1 sm:hidden">
          <PeekAction
            onClick={() =>
              activateTopMetaMobileMenuToggle({
                toggleMobileMenu: () => setMobileMenuOpen((open) => !open),
                triggerHaptic: (style) => haptic.trigger(style),
              })
            }
            className="min-h-[44px] min-w-[44px] justify-center text-[0.76rem] text-muted-foreground hover:text-foreground"
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
              {persistVisible ? (
                <nav aria-label={HOME_SECTION_NAV_ARIA_LABEL} className="flex flex-col items-stretch gap-2">
                  {HOME_SECTION_NAV_ITEMS.map((item) => (
                    <SectionNavLink
                      key={item.id}
                      active={item.id === activeSectionId}
                      className="min-h-[44px] w-full justify-start rounded-[6px] px-2 text-left hover:bg-foreground/[0.035]"
                      closeMobileMenu={closeMobileMenu}
                      item={item}
                      onActivate={setActiveSectionId}
                      prefersReducedMotion={prefersReducedMotion}
                    />
                  ))}
                </nav>
              ) : null}
              {mobilePageNavItems.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  active={isTopMetaNavItemActive(pathname, item)}
                  className="min-h-[44px] w-full justify-start rounded-[6px] px-2 text-left hover:bg-foreground/[0.035]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
