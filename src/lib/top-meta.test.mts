import assert from 'node:assert/strict'
import test from 'node:test'

import {
  TOP_META_BRAND_ACTION,
  TOP_META_HAPTIC_STYLE,
  TOP_META_LAUNCHPAD_ARIA_LABEL,
  TOP_META_LAUNCHPAD_ACTION,
  TOP_META_LAUNCHPAD_LABEL,
  TOP_META_LAUNCHPAD_PEEK,
  TOP_META_MOBILE_MENU_CLOSE_LABEL,
  TOP_META_MOBILE_MENU_LABEL,
  TOP_META_MOBILE_MENU_OPEN_LABEL,
  TOP_META_NAV_ITEMS,
  TOP_META_SUN_BLINK_MS,
  TOP_META_SUN_IDLE_JITTER_MS,
  TOP_META_SUN_IDLE_MIN_MS,
  TOP_REVEAL_SCROLL_Y,
  activateTopMetaBrandAction,
  activateTopMetaLaunchpad,
  activateTopMetaMobileMenuToggle,
  activateTopMetaNavAction,
  activateTopMetaSunBlink,
  getTopMetaAnalyticsTarget,
  getTopMetaHeaderState,
  getTopMetaInnerClassName,
  getTopMetaMobileMenuAriaLabel,
  getTopMetaMobileMenuClassName,
  getTopMetaNavAction,
  getTopMetaNavLabelClassName,
  getTopMetaNavLinkClassName,
  getTopMetaShellClassName,
  getTopMetaSunClassName,
  getTopMetaSunIdleDelay,
  isTopMetaNavItemActive,
  preloadTopMetaLaunchpad,
  shouldHideTopMetaHeader,
} from './top-meta.ts'

test('TOP_META_NAV_ITEMS keeps primary header navigation stable', () => {
  assert.deepEqual(TOP_META_NAV_ITEMS.map((item) => item.href), ['/', '/archive'])
  assert.equal(TOP_META_NAV_ITEMS[0]?.toast, 'Opening home')
  assert.equal(TOP_META_NAV_ITEMS[1]?.peek, 'Open experiments')
})

test('top meta copy constants preserve menu and launchpad labels', () => {
  assert.equal(TOP_META_MOBILE_MENU_LABEL, 'Menu')
  assert.equal(TOP_META_MOBILE_MENU_OPEN_LABEL, 'Open menu')
  assert.equal(TOP_META_MOBILE_MENU_CLOSE_LABEL, 'Close menu')
  assert.equal(TOP_META_LAUNCHPAD_LABEL, 'Launchpad')
  assert.equal(TOP_META_LAUNCHPAD_PEEK, 'Open Launchpad')
  assert.equal(TOP_META_LAUNCHPAD_ARIA_LABEL, 'Open Launchpad. Also use CMD K')
  assert.equal(getTopMetaMobileMenuAriaLabel(false), 'Open menu')
  assert.equal(getTopMetaMobileMenuAriaLabel(true), 'Close menu')
})

test('isTopMetaNavItemActive handles exact home and nested route matches', () => {
  const [home, archive] = TOP_META_NAV_ITEMS

  assert.equal(isTopMetaNavItemActive('/', home!), true)
  assert.equal(isTopMetaNavItemActive('/projects/lumo', home!), false)
  assert.equal(isTopMetaNavItemActive('/archive', archive!), true)
  assert.equal(isTopMetaNavItemActive('/archive?from=home', archive!), true)
  assert.equal(isTopMetaNavItemActive('/projects/lumo', archive!), false)
})

test('TOP_REVEAL_SCROLL_Y documents header hide threshold', () => {
  assert.equal(TOP_REVEAL_SCROLL_Y, 24)
})

test('top meta sun timing constants keep blink behavior stable', () => {
  assert.equal(TOP_META_SUN_BLINK_MS, 420)
  assert.equal(TOP_META_SUN_IDLE_MIN_MS, 11000)
  assert.equal(TOP_META_SUN_IDLE_JITTER_MS, 7000)
  assert.equal(getTopMetaSunIdleDelay(() => 0), 11000)
  assert.equal(getTopMetaSunIdleDelay(() => 0.5), 14500)
  assert.equal(getTopMetaSunIdleDelay(() => 1), 18000)
})

test('activateTopMetaSunBlink starts blinking, clears stale timers, and schedules reset', () => {
  const calls: unknown[] = []
  let scheduledCallback: (() => void) | null = null

  const nextTimer = activateTopMetaSunBlink({
    clearTimer: (timer) => calls.push(['clear', timer]),
    currentTimer: 'old-timer',
    scheduleTimer: (callback, delayMs) => {
      scheduledCallback = callback
      calls.push(['schedule', delayMs])

      return 'next-timer'
    },
    setSunBlinking: (blinking) => calls.push(['blinking', blinking]),
  })

  assert.equal(nextTimer, 'next-timer')
  assert.deepEqual(calls, [
    ['blinking', true],
    ['clear', 'old-timer'],
    ['schedule', TOP_META_SUN_BLINK_MS],
  ])

  scheduledCallback?.()
  assert.deepEqual(calls, [
    ['blinking', true],
    ['clear', 'old-timer'],
    ['schedule', TOP_META_SUN_BLINK_MS],
    ['blinking', false],
  ])
})

test('shouldHideTopMetaHeader mirrors the scroll reveal threshold', () => {
  assert.equal(shouldHideTopMetaHeader(0), false)
  assert.equal(shouldHideTopMetaHeader(TOP_REVEAL_SCROLL_Y), false)
  assert.equal(shouldHideTopMetaHeader(TOP_REVEAL_SCROLL_Y + 1), true)
})

test('getTopMetaHeaderState closes the mobile menu when the header hides', () => {
  assert.deepEqual(getTopMetaHeaderState({ mobileMenuOpen: true, scrollY: 0 }), {
    headerHidden: false,
    mobileMenuOpen: true,
  })
  assert.deepEqual(getTopMetaHeaderState({ mobileMenuOpen: true, scrollY: TOP_REVEAL_SCROLL_Y + 1 }), {
    headerHidden: true,
    mobileMenuOpen: false,
  })
  assert.deepEqual(getTopMetaHeaderState({ mobileMenuOpen: false, scrollY: TOP_REVEAL_SCROLL_Y + 1 }), {
    headerHidden: true,
    mobileMenuOpen: false,
  })
})

test('top meta chrome class helpers preserve hidden and interactive states', () => {
  const visibleShell = getTopMetaShellClassName(false, false)
  const hiddenShell = getTopMetaShellClassName(true, false)
  const menuShell = getTopMetaShellClassName(true, true)
  const hiddenInner = getTopMetaInnerClassName(true, false)
  const menuInner = getTopMetaInnerClassName(true, true)

  assert.match(visibleShell, /translate-y-0/)
  assert.match(hiddenShell, /-translate-y-3/)
  assert.match(hiddenShell, /pointer-events-none/)
  assert.match(menuShell, /opacity-100/)
  assert.match(hiddenInner, /pointer-events-none/)
  assert.match(menuInner, /pointer-events-auto/)
})

test('top meta mobile menu class helper preserves open and closed transitions', () => {
  const openClassName = getTopMetaMobileMenuClassName(true)
  const closedClassName = getTopMetaMobileMenuClassName(false)

  assert.match(openClassName, /pointer-events-auto/)
  assert.match(openClassName, /translate-y-0/)
  assert.match(openClassName, /w-\[12rem\]/)
  assert.match(closedClassName, /pointer-events-none/)
  assert.match(closedClassName, /blur-\[4px\]/)
})

test('top meta nav and sun class helpers preserve active and blink states', () => {
  assert.match(getTopMetaSunClassName(false), /header-sun-shell/)
  assert.match(getTopMetaSunClassName(false), /transition-\[color,filter,transform\]/)
  assert.match(getTopMetaSunClassName(false), /group-hover\/peek:scale-\[1\.08\]/)
  assert.match(getTopMetaSunClassName(false), /group-hover\/peek:brightness-110/)
  assert.doesNotMatch(getTopMetaSunClassName(false), /animate-hb-sun-blink/)
  assert.match(getTopMetaSunClassName(true), /animate-hb-sun-blink/)
  assert.match(getTopMetaNavLinkClassName(true), /text-\[#2f7d73\]/)
  assert.match(getTopMetaNavLinkClassName(true), /bg-\[color-mix\(in_srgb,#2f7d73_11%,transparent\)\]/)
  assert.match(getTopMetaNavLinkClassName(false), /text-muted-foreground\/76/)
  assert.match(getTopMetaNavLinkClassName(false), /hover:text-\[#2f7d73\]/)
  assert.match(getTopMetaNavLinkClassName(false), /hover:bg-\[color-mix\(in_srgb,#2f7d73_8%,transparent\)\]/)
  assert.doesNotMatch(getTopMetaNavLabelClassName(true), /underline|decoration-/)
  assert.doesNotMatch(getTopMetaNavLabelClassName(false), /underline|decoration-/)
})

test('getTopMetaAnalyticsTarget normalizes nav labels for analytics', () => {
  assert.equal(getTopMetaAnalyticsTarget('Playground'), 'playground')
  assert.equal(getTopMetaAnalyticsTarget('Launchpad'), 'launchpad')
})

test('top meta action helpers centralize nav analytics and toast copy', () => {
  assert.equal(TOP_META_HAPTIC_STYLE, 'light')
  assert.deepEqual(TOP_META_BRAND_ACTION, {
    analyticsTarget: 'home',
    toast: 'Opening home',
  })
  assert.deepEqual(TOP_META_LAUNCHPAD_ACTION, {
    analyticsTarget: 'launchpad',
  })
  assert.deepEqual(getTopMetaNavAction(TOP_META_NAV_ITEMS[1]!), {
    analyticsTarget: 'playground',
    toast: 'Opening playground',
  })
})

test('activateTopMetaNavAction preserves haptic, analytics, and toast ordering', () => {
  const calls: unknown[] = []

  activateTopMetaNavAction({
    action: getTopMetaNavAction(TOP_META_NAV_ITEMS[1]!),
    showToast: (message) => calls.push(['toast', message]),
    trackNavigationClick: (target) => calls.push(['navigation', target]),
    triggerHaptic: (style) => calls.push(['haptic', style]),
  })

  assert.deepEqual(calls, [
    ['haptic', 'light'],
    ['navigation', 'playground'],
    ['toast', 'Opening playground'],
  ])
})

test('activateTopMetaBrandAction blinks the sun before showing toast', () => {
  const calls: unknown[] = []

  activateTopMetaBrandAction({
    action: TOP_META_BRAND_ACTION,
    showToast: (message) => calls.push(['toast', message]),
    trackNavigationClick: (target) => calls.push(['navigation', target]),
    triggerHaptic: (style) => calls.push(['haptic', style]),
    triggerSunBlink: () => calls.push('blink'),
  })

  assert.deepEqual(calls, [
    ['haptic', 'light'],
    ['navigation', 'home'],
    'blink',
    ['toast', 'Opening home'],
  ])
})

test('activateTopMetaLaunchpad preserves desktop and mobile open ordering', () => {
  const desktopCalls: unknown[] = []
  const mobileCalls: unknown[] = []

  activateTopMetaLaunchpad({
    openLauncher: () => desktopCalls.push('open'),
    trackNavigationClick: (target) => desktopCalls.push(['navigation', target]),
    triggerHaptic: (style) => desktopCalls.push(['haptic', style]),
  })
  activateTopMetaLaunchpad({
    closeMobileMenu: () => mobileCalls.push('close-menu'),
    openLauncher: () => mobileCalls.push('open'),
    trackNavigationClick: (target) => mobileCalls.push(['navigation', target]),
    triggerHaptic: (style) => mobileCalls.push(['haptic', style]),
  })

  assert.deepEqual(desktopCalls, [
    ['haptic', 'light'],
    ['navigation', 'launchpad'],
    'open',
  ])
  assert.deepEqual(mobileCalls, [
    ['haptic', 'light'],
    ['navigation', 'launchpad'],
    'close-menu',
    'open',
  ])
})

test('top meta launchpad preload and mobile menu toggle helpers preserve small actions', () => {
  const calls: unknown[] = []

  activateTopMetaMobileMenuToggle({
    toggleMobileMenu: () => calls.push('toggle'),
    triggerHaptic: (style) => calls.push(['haptic', style]),
  })
  preloadTopMetaLaunchpad({
    preloadLauncher: () => calls.push('preload'),
  })

  assert.deepEqual(calls, [
    ['haptic', 'light'],
    'toggle',
    'preload',
  ])
})
