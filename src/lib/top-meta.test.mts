import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  TOP_META_BRAND_ACTION,
  TOP_META_HAPTIC_STYLE,
  TOP_META_MOBILE_MENU_CLOSE_LABEL,
  TOP_META_MOBILE_MENU_LABEL,
  TOP_META_MOBILE_MENU_OPEN_LABEL,
  TOP_META_NAV_ITEMS,
  TOP_META_SUN_BLINK_MS,
  TOP_META_SUN_IDLE_JITTER_MS,
  TOP_META_SUN_IDLE_MIN_MS,
  TOP_REVEAL_SCROLL_Y,
  activateTopMetaBrandAction,
  activateTopMetaMobileMenuToggle,
  activateTopMetaNavAction,
  activateTopMetaSunBlink,
  getTopMetaAnalyticsTarget,
  getTopMetaHeaderState,
  getTopMetaInnerClassName,
  getTopMetaMobileMenuAriaLabel,
  getTopMetaMobileMenuClassName,
  getTopMetaMobilePageNavItems,
  getTopMetaNavAction,
  getTopMetaNavLabelClassName,
  getTopMetaNavLinkClassName,
  getTopMetaPageNavItems,
  getTopMetaShellClassName,
  getTopMetaSunClassName,
  getTopMetaSunIdleDelay,
  isTopMetaNavItemActive,
  shouldFrostTopMetaHeader,
  shouldHideTopMetaHeader,
} from './top-meta.ts'

test('TOP_META_NAV_ITEMS keeps primary header navigation stable', () => {
  assert.deepEqual(TOP_META_NAV_ITEMS.map((item) => item.href), ['/', '/archive'])
  assert.equal(TOP_META_NAV_ITEMS[0]?.toast, 'Opening home')
  assert.equal(TOP_META_NAV_ITEMS[1]?.peek, 'Open experiments')
})

test('top meta copy constants preserve menu labels without Launchpad chrome', () => {
  const chrome = readFileSync(new URL('../components/TopMeta.tsx', import.meta.url), 'utf8')

  assert.equal(TOP_META_MOBILE_MENU_LABEL, 'Menu')
  assert.equal(TOP_META_MOBILE_MENU_OPEN_LABEL, 'Open menu')
  assert.equal(TOP_META_MOBILE_MENU_CLOSE_LABEL, 'Close menu')
  assert.equal(getTopMetaMobileMenuAriaLabel(false), 'Open menu')
  assert.equal(getTopMetaMobileMenuAriaLabel(true), 'Close menu')
  assert.doesNotMatch(chrome, /Launchpad/)
  assert.doesNotMatch(chrome, /LAUNCHPAD/)
  assert.doesNotMatch(chrome, /launcher/)
  assert.doesNotMatch(chrome, /w-\[21rem\]/)
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
  assert.equal(shouldHideTopMetaHeader({ scrollY: 0 }), false)
  assert.equal(shouldHideTopMetaHeader({ scrollY: TOP_REVEAL_SCROLL_Y }), false)
  assert.equal(shouldHideTopMetaHeader({ scrollY: TOP_REVEAL_SCROLL_Y + 1 }), true)
})

test('homepage keeps the header sticky so section jumps stay reachable', () => {
  assert.equal(shouldHideTopMetaHeader({ persistVisible: true, scrollY: TOP_REVEAL_SCROLL_Y + 80 }), false)
  assert.equal(shouldFrostTopMetaHeader({ persistVisible: true, scrollY: 0 }), false)
  assert.equal(shouldFrostTopMetaHeader({ persistVisible: true, scrollY: TOP_REVEAL_SCROLL_Y + 80 }), true)
  assert.equal(shouldFrostTopMetaHeader({ persistVisible: false, scrollY: TOP_REVEAL_SCROLL_Y + 80 }), false)
  assert.deepEqual(
    getTopMetaHeaderState({
      mobileMenuOpen: true,
      persistVisible: true,
      scrollY: TOP_REVEAL_SCROLL_Y + 80,
    }),
    {
      headerHidden: false,
      mobileMenuOpen: true,
    },
  )
  assert.match(getTopMetaShellClassName(false, false, true), /bg-card\/88/)
  assert.match(getTopMetaShellClassName(false, false, true), /shadow-\[0_1px_0_0_var\(--border\)/)
  assert.match(getTopMetaShellClassName(false, false, true), /safe-area-inset-top/)
  assert.doesNotMatch(getTopMetaShellClassName(false, false, false), /bg-card\/88/)
})

test('homepage desktop nav yields to section jumps while mobile keeps Playground', () => {
  assert.deepEqual(getTopMetaPageNavItems('/'), [])
  assert.deepEqual(getTopMetaPageNavItems('/archive'), [...TOP_META_NAV_ITEMS])
  assert.deepEqual(
    getTopMetaMobilePageNavItems('/').map((item) => item.href),
    ['/archive'],
  )
  assert.deepEqual(
    getTopMetaMobilePageNavItems('/cv').map((item) => item.href),
    ['/', '/archive'],
  )
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

test('top meta mobile menu class helper preserves visibility and interactivity', () => {
  const openClasses = getTopMetaMobileMenuClassName(true).split(' ')
  const closedClasses = getTopMetaMobileMenuClassName(false).split(' ')

  for (const token of ['pointer-events-auto', 'visible', 'translate-y-0', 'opacity-100']) {
    assert.ok(openClasses.includes(token), token)
    assert.ok(!closedClasses.includes(token), token)
  }
  for (const token of ['pointer-events-none', 'invisible', 'translate-y-1', 'opacity-0']) {
    assert.ok(closedClasses.includes(token), token)
    assert.ok(!openClasses.includes(token), token)
  }
})

test('top meta mobile menu uses only a 200ms translate and fade without animated blur', () => {
  for (const open of [false, true]) {
    const classes = getTopMetaMobileMenuClassName(open).split(' ')

    assert.deepEqual(classes.filter((token) => token.startsWith('transition-')), [
      'transition-[opacity,transform]',
    ])
    assert.deepEqual(classes.filter((token) => token.startsWith('blur-')), [])
    for (const token of [
      'duration-200',
      'ease-soft',
      'fixed',
      'right-[max(1.25rem,env(safe-area-inset-right))]',
      'top-[calc(3.15rem+env(safe-area-inset-top))]',
      'w-[min(14rem,calc(100vw-2.5rem))]',
      'origin-top-right',
      'backdrop-blur-sm',
    ]) {
      assert.ok(classes.includes(token), token)
    }
  }
})

test('top meta mobile menu disables transitions and translation for reduced motion in both states', () => {
  for (const open of [false, true]) {
    const classes = getTopMetaMobileMenuClassName(open).split(' ')

    assert.ok(classes.includes('motion-reduce:transition-none'))
    assert.ok(classes.includes('motion-reduce:transform-none'))
  }
})

test('top meta nav and sun class helpers preserve active and blink states', () => {
  assert.match(getTopMetaSunClassName(false), /header-sun-shell/)
  assert.match(getTopMetaSunClassName(false), /transition-\[color,filter,transform\]/)
  assert.match(getTopMetaSunClassName(false), /group-hover\/peek:scale-\[1\.08\]/)
  assert.match(getTopMetaSunClassName(false), /group-hover\/peek:brightness-110/)
  assert.match(getTopMetaSunClassName(false), /text-muted-foreground/)
  assert.doesNotMatch(getTopMetaSunClassName(false), /text-accent|#2f7d73|255,75,0/)
  assert.doesNotMatch(getTopMetaSunClassName(false), /animate-hb-sun-blink/)
  assert.match(getTopMetaSunClassName(true), /animate-hb-sun-blink/)
  assert.match(getTopMetaNavLinkClassName(true), /text-foreground/)
  assert.match(getTopMetaNavLinkClassName(true), /bg-secondary/)
  assert.doesNotMatch(getTopMetaNavLinkClassName(true), /#2f7d73|#2383E2|accent/)
  assert.match(getTopMetaNavLinkClassName(false), /text-muted-foreground/)
  assert.match(getTopMetaNavLinkClassName(false), /hover:text-foreground/)
  assert.match(getTopMetaNavLinkClassName(false), /hover:bg-secondary/)
  assert.doesNotMatch(getTopMetaNavLinkClassName(false), /#2f7d73|#2383E2|accent/)
  assert.match(getTopMetaNavLinkClassName(false), /text-\[0\.62rem\]/)
  assert.match(getTopMetaNavLinkClassName(false), /sm:text-\[0\.7rem\]/)
  assert.match(getTopMetaNavLinkClassName(false), /font-medium/)
  assert.doesNotMatch(getTopMetaNavLabelClassName(true), /underline|decoration-/)
  assert.doesNotMatch(getTopMetaNavLabelClassName(false), /underline|decoration-/)
})

test('getTopMetaAnalyticsTarget normalizes nav labels for analytics', () => {
  assert.equal(getTopMetaAnalyticsTarget('Playground'), 'playground')
  assert.equal(getTopMetaAnalyticsTarget('Home'), 'home')
})

test('top meta action helpers centralize nav analytics and toast copy', () => {
  assert.equal(TOP_META_HAPTIC_STYLE, 'light')
  assert.deepEqual(TOP_META_BRAND_ACTION, {
    analyticsTarget: 'home',
    toast: 'Opening home',
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

test('top meta mobile menu toggle helper preserves haptic then toggle order', () => {
  const calls: unknown[] = []

  activateTopMetaMobileMenuToggle({
    toggleMobileMenu: () => calls.push('toggle'),
    triggerHaptic: (style) => calls.push(['haptic', style]),
  })

  assert.deepEqual(calls, [
    ['haptic', 'light'],
    'toggle',
  ])
})
