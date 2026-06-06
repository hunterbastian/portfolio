import assert from 'node:assert/strict'
import test from 'node:test'

import {
  SCROLL_TO_TOP_ARIA_LABEL,
  SCROLL_TO_TOP_ANIMATE_FRAME,
  SCROLL_TO_TOP_END_THRESHOLD_PX,
  SCROLL_TO_TOP_EXIT_FRAME,
  SCROLL_TO_TOP_HAPTIC_STYLE,
  SCROLL_TO_TOP_INITIAL_FRAME,
  SCROLL_TO_TOP_MIN_SCROLL_Y,
  SCROLL_TO_TOP_MOTION_DURATION_MS,
  SCROLL_TO_TOP_REDUCED_MOTION_FRAME,
  SCROLL_TO_TOP_SCROLL_OPTIONS,
  SCROLL_TO_TOP_TOAST,
  activateScrollToTop,
  getScrollToTopAnimateFrame,
  getScrollToTopExitFrame,
  getScrollToTopFrameScheduleState,
  getScrollToTopInitialFrame,
  getScrollToTopVisibilityUpdate,
  shouldShowScrollToTop,
} from './scroll-to-top.ts'

test('scroll to top constants preserve visible copy and thresholds', () => {
  assert.equal(SCROLL_TO_TOP_ARIA_LABEL, 'Scroll to top')
  assert.equal(SCROLL_TO_TOP_TOAST, 'Back to top')
  assert.equal(SCROLL_TO_TOP_END_THRESHOLD_PX, 360)
  assert.equal(SCROLL_TO_TOP_MIN_SCROLL_Y, 720)
  assert.equal(SCROLL_TO_TOP_MOTION_DURATION_MS, 220)
  assert.equal(SCROLL_TO_TOP_HAPTIC_STYLE, 'light')
  assert.deepEqual(SCROLL_TO_TOP_SCROLL_OPTIONS, { top: 0, behavior: 'smooth' })
})

test('shouldShowScrollToTop appears near page end after minimum scroll', () => {
  assert.equal(shouldShowScrollToTop({ pageHeight: 2400, viewportHeight: 900, scrollY: 1100 }), false)
  assert.equal(shouldShowScrollToTop({ pageHeight: 2400, viewportHeight: 900, scrollY: 1200 }), true)
  assert.equal(shouldShowScrollToTop({ pageHeight: 1200, viewportHeight: 900, scrollY: 720 }), false)
  assert.equal(shouldShowScrollToTop({ pageHeight: 1200, viewportHeight: 900, scrollY: 721 }), true)
})

test('scroll to top visibility update reports only meaningful state changes', () => {
  assert.deepEqual(
    getScrollToTopVisibilityUpdate({
      currentVisible: false,
      pageHeight: 2400,
      viewportHeight: 900,
      scrollY: 1200,
    }),
    {
      changed: true,
      visible: true,
    },
  )
  assert.deepEqual(
    getScrollToTopVisibilityUpdate({
      currentVisible: true,
      pageHeight: 2400,
      viewportHeight: 900,
      scrollY: 1200,
    }),
    {
      changed: false,
      visible: true,
    },
  )
})

test('scroll to top frame schedule helper throttles repeated scroll work', () => {
  assert.deepEqual(getScrollToTopFrameScheduleState(false), {
    shouldRequestFrame: true,
    ticking: true,
  })
  assert.deepEqual(getScrollToTopFrameScheduleState(true), {
    shouldRequestFrame: false,
    ticking: true,
  })
})

test('scroll to top motion helpers preserve normal and reduced frames', () => {
  assert.deepEqual(getScrollToTopInitialFrame(false), SCROLL_TO_TOP_INITIAL_FRAME)
  assert.deepEqual(getScrollToTopInitialFrame(true), SCROLL_TO_TOP_REDUCED_MOTION_FRAME)
  assert.deepEqual(getScrollToTopAnimateFrame(), SCROLL_TO_TOP_ANIMATE_FRAME)
  assert.deepEqual(getScrollToTopExitFrame(false), SCROLL_TO_TOP_EXIT_FRAME)
  assert.deepEqual(getScrollToTopExitFrame(true), SCROLL_TO_TOP_REDUCED_MOTION_FRAME)
})

test('activateScrollToTop preserves haptic, toast, and scroll ordering', () => {
  const calls: unknown[] = []

  activateScrollToTop({
    scrollToTop: (options) => calls.push(['scroll', options]),
    showToast: (message) => calls.push(['toast', message]),
    triggerHaptic: (style) => calls.push(['haptic', style]),
  })

  assert.deepEqual(calls, [
    ['haptic', 'light'],
    ['toast', 'Back to top'],
    ['scroll', { top: 0, behavior: 'smooth' }],
  ])
})
