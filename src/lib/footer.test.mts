import assert from 'node:assert/strict'
import test from 'node:test'

import {
  FOOTER_BASE_CLASS,
  FOOTER_COPYRIGHT_CLASS,
  FOOTER_INNER_CLASS,
  FOOTER_MADE_LABEL,
  FOOTER_MADE_LINE_CLASS,
  FOOTER_META_ROW_CLASS,
  FOOTER_PAGE_END_PADDING,
  FOOTER_PIXEL_SUN_SHELL_CLASS,
  FOOTER_REVEAL_OBSERVER_THRESHOLD,
  FOOTER_SCROLL_DELTA_THRESHOLD,
  FOOTER_SCROLL_REVEAL_THRESHOLD,
  FOOTER_SPARKLE_DURATION_MS,
  activateFooterSparkle,
  getFooterClassName,
  getFooterCopyrightLabel,
  getFooterShellClassName,
  getFooterSparkleClassName,
  getFooterVisibilityClassName,
  getNextFooterHidden,
  isNearFooterPageEnd,
  shouldActivateFooterSparkle,
  subscribeFooterVisibility,
} from './footer.ts'

test('footer constants preserve scroll and reveal timing behavior', () => {
  assert.equal(FOOTER_SCROLL_REVEAL_THRESHOLD, 24)
  assert.equal(FOOTER_SCROLL_DELTA_THRESHOLD, 6)
  assert.equal(FOOTER_PAGE_END_PADDING, 160)
  assert.equal(FOOTER_SPARKLE_DURATION_MS, 1300)
  assert.equal(FOOTER_REVEAL_OBSERVER_THRESHOLD, 0.35)
})

test('footer chrome constants preserve layout and visible copy', () => {
  assert.match(FOOTER_BASE_CLASS, /transition-\[transform,opacity\]/)
  assert.match(FOOTER_INNER_CLASS, /max-w-\[36rem\]/)
  assert.match(FOOTER_META_ROW_CLASS, /justify-between/)
  assert.doesNotMatch(FOOTER_META_ROW_CLASS, /flex-col/)
  assert.match(FOOTER_COPYRIGHT_CLASS, /font-header/)
  assert.match(FOOTER_MADE_LINE_CLASS, /footer-made-line/)
  assert.equal(FOOTER_PIXEL_SUN_SHELL_CLASS, 'footer-pixel-sun-shell')
  assert.equal(FOOTER_MADE_LABEL, 'Made with care in Utah.')
  assert.equal(getFooterCopyrightLabel(2026), '\u00a9 2026 Hunter Bastian')
})

test('footer visibility keeps top and page-end states visible', () => {
  assert.equal(getNextFooterHidden({ pageHeight: 2400, viewportHeight: 900, lastScrollY: 0, scrollY: 24 }), false)
  assert.equal(getNextFooterHidden({ pageHeight: 2400, viewportHeight: 900, lastScrollY: 900, scrollY: 1340 }), false)
  assert.equal(isNearFooterPageEnd({ pageHeight: 2400, viewportHeight: 900, scrollY: 1339 }), false)
  assert.equal(isNearFooterPageEnd({ pageHeight: 2400, viewportHeight: 900, scrollY: 1340 }), true)
})

test('footer visibility mirrors delta-based scroll behavior', () => {
  assert.equal(getNextFooterHidden({ pageHeight: 2400, viewportHeight: 900, lastScrollY: 100, scrollY: 105 }), null)
  assert.equal(getNextFooterHidden({ pageHeight: 2400, viewportHeight: 900, lastScrollY: 100, scrollY: 120 }), false)
  assert.equal(getNextFooterHidden({ pageHeight: 2400, viewportHeight: 900, lastScrollY: 120, scrollY: 100 }), true)
})

test('subscribeFooterVisibility throttles scroll updates and cancels pending work on cleanup', () => {
  const listeners = new Map<string, () => void>()
  const removed: string[] = []
  const canceledFrames: number[] = []
  const hiddenValues: boolean[] = []
  const frameCallbacks: Array<() => void> = []
  const documentElement = { scrollHeight: 2400 }
  const viewport = { innerHeight: 900, scrollY: 0 }
  let lastScrollY = 0
  let nextFrame = 1

  const cleanup = subscribeFooterVisibility({
    addEventListener: (type, listener) => listeners.set(type, listener),
    cancelAnimationFrame: (frame) => canceledFrames.push(frame),
    documentElement,
    getLastScrollY: () => lastScrollY,
    removeEventListener: (type) => removed.push(type),
    requestAnimationFrame: (callback) => {
      frameCallbacks.push(callback)
      return nextFrame++
    },
    setHidden: (hidden) => hiddenValues.push(hidden),
    setLastScrollY: (scrollY) => {
      lastScrollY = scrollY
    },
    viewport,
  })

  viewport.scrollY = 120
  listeners.get('scroll')?.()
  listeners.get('scroll')?.()
  assert.equal(frameCallbacks.length, 1)

  frameCallbacks[0]?.()
  assert.deepEqual(hiddenValues, [false])
  assert.equal(lastScrollY, 120)

  viewport.scrollY = 100
  listeners.get('scroll')?.()
  cleanup()

  assert.deepEqual(removed, ['scroll'])
  assert.deepEqual(canceledFrames, [2])
})

test('footer sparkle reveal only activates on the first intersecting entry', () => {
  assert.equal(shouldActivateFooterSparkle({ hasFired: false, isIntersecting: true }), true)
  assert.equal(shouldActivateFooterSparkle({ hasFired: true, isIntersecting: true }), false)
  assert.equal(shouldActivateFooterSparkle({ hasFired: false, isIntersecting: false }), false)
  assert.equal(shouldActivateFooterSparkle({ hasFired: false }), false)
})

test('activateFooterSparkle marks fired, activates, and schedules cleanup', () => {
  const calls: unknown[] = []

  activateFooterSparkle({
    markFired: () => calls.push('fired'),
    scheduleDeactivate: (durationMs) => calls.push(['schedule', durationMs]),
    setActive: (active) => calls.push(['active', active]),
  })

  assert.deepEqual(calls, [
    'fired',
    ['active', true],
    ['schedule', 1300],
  ])
})

test('footer class helpers preserve route, visibility, and sparkle states', () => {
  assert.equal(getFooterShellClassName('/'), 'footer-coast-shell')
  assert.equal(getFooterShellClassName('/archive'), '')
  assert.equal(getFooterVisibilityClassName(false), 'translate-y-0 opacity-100')
  assert.equal(getFooterVisibilityClassName(true), 'pointer-events-none translate-y-6 opacity-0')
  assert.match(getFooterClassName('/', false), /footer-coast-shell/)
  assert.match(getFooterClassName('/', false), /translate-y-0 opacity-100/)
  assert.match(getFooterClassName('/archive', true), /pointer-events-none translate-y-6 opacity-0/)
  assert.equal(getFooterSparkleClassName(false), 'footer-pixel-sun transition-transform duration-200 ease-soft')
  assert.equal(
    getFooterSparkleClassName(true),
    'footer-pixel-sun transition-transform duration-200 ease-soft animate-hb-sun-blink',
  )
})
