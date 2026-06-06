import assert from 'node:assert/strict'
import test from 'node:test'

import {
  SCROLL_INDICATOR_DASH_TRANSITION,
  SCROLL_INDICATOR_FILL_OPACITY_BASE,
  SCROLL_INDICATOR_FILL_OPACITY_RANGE,
  SCROLL_INDICATOR_MIN_PROGRESS,
  SCROLL_INDICATOR_PROGRESS_STROKE,
  SCROLL_INDICATOR_TRACK_STROKE,
  SCROLL_INDICATOR_PROGRESS_RANGE,
  SCROLL_INDICATOR_SIZE,
  SCROLL_INDICATOR_STROKE_WIDTH,
  getScrollIndicatorDashOffset,
  getScrollIndicatorDashStyle,
  getScrollIndicatorFillOpacity,
  getScrollIndicatorFillStyle,
  getScrollIndicatorGeometry,
  getScrollIndicatorProgress,
  getScrollIndicatorProgressFromViewport,
  getScrollIndicatorRenderState,
  subscribeScrollIndicatorProgress,
} from './scroll-indicator.ts'

test('scroll indicator constants preserve visual defaults', () => {
  assert.equal(SCROLL_INDICATOR_SIZE, 24)
  assert.equal(SCROLL_INDICATOR_STROKE_WIDTH, 2.8)
  assert.equal(SCROLL_INDICATOR_MIN_PROGRESS, 0.08)
  assert.equal(SCROLL_INDICATOR_PROGRESS_RANGE, 0.92)
  assert.equal(SCROLL_INDICATOR_FILL_OPACITY_BASE, 0.08)
  assert.equal(SCROLL_INDICATOR_FILL_OPACITY_RANGE, 0.1)
  assert.equal(SCROLL_INDICATOR_TRACK_STROKE, 'color-mix(in srgb, var(--foreground) 30%, white 70%)')
  assert.equal(SCROLL_INDICATOR_PROGRESS_STROKE, 'color-mix(in srgb, var(--foreground) 48%, white 52%)')
  assert.equal(SCROLL_INDICATOR_DASH_TRANSITION, 'stroke-dashoffset 120ms linear')
})

test('getScrollIndicatorProgress clamps and offsets page progress', () => {
  assert.equal(getScrollIndicatorProgress({ pageHeight: 900, viewportHeight: 900, scrollY: 0 }), 0.08)
  assert.equal(getScrollIndicatorProgress({ pageHeight: 2900, viewportHeight: 900, scrollY: 1000 }), 0.54)
  assert.equal(getScrollIndicatorProgress({ pageHeight: 2900, viewportHeight: 900, scrollY: 4000 }), 1)
})

test('getScrollIndicatorProgressFromViewport reads browser metric sources', () => {
  assert.equal(
    getScrollIndicatorProgressFromViewport({
      documentElement: { scrollHeight: 2900 },
      viewport: { innerHeight: 900, scrollY: 1000 },
    }),
    0.54,
  )
})

test('scroll indicator geometry helpers preserve circle math', () => {
  const geometry = getScrollIndicatorGeometry()

  assert.equal(geometry.size, 24)
  assert.equal(geometry.strokeWidth, 2.8)
  assert.equal(geometry.radius, 10.6)
  assert.equal(Number(geometry.circumference.toFixed(4)), 66.6018)
  assert.equal(Number(getScrollIndicatorDashOffset(0.25, geometry.circumference).toFixed(4)), 49.9513)
  assert.equal(getScrollIndicatorFillOpacity(0.5), 0.13)
})

test('scroll indicator render state keeps geometry and visual values together', () => {
  const state = getScrollIndicatorRenderState(0.25)

  assert.equal(state.size, 24)
  assert.equal(state.center, 12)
  assert.equal(state.radius, 10.6)
  assert.equal(state.strokeWidth, 2.8)
  assert.equal(Number(state.circumference.toFixed(4)), 66.6018)
  assert.equal(Number(state.dashOffset.toFixed(4)), 49.9513)
  assert.equal(state.fillOpacity, 0.10500000000000001)
})

test('scroll indicator style helpers preserve fill and dash styling', () => {
  assert.deepEqual(getScrollIndicatorFillStyle(0.13), {
    backgroundColor: 'color-mix(in srgb, var(--foreground) 6%, var(--background) 94%)',
    boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--foreground) 20%, transparent)',
    opacity: 0.13,
  })
  assert.deepEqual(getScrollIndicatorDashStyle(), {
    transition: 'stroke-dashoffset 120ms linear',
  })
})

test('subscribeScrollIndicatorProgress throttles viewport updates and cleans listeners', () => {
  const listeners = new Map<string, () => void>()
  const removed: string[] = []
  const canceledFrames: number[] = []
  const progressValues: number[] = []
  const frameCallbacks: Array<() => void> = []
  let nextFrame = 1
  const viewport = { innerHeight: 900, scrollY: 0 }
  const documentElement = { scrollHeight: 2900 }

  const cleanup = subscribeScrollIndicatorProgress({
    addEventListener: (type, listener) => listeners.set(type, listener),
    cancelAnimationFrame: (frame) => canceledFrames.push(frame),
    documentElement,
    removeEventListener: (type) => removed.push(type),
    requestAnimationFrame: (callback) => {
      frameCallbacks.push(callback)
      return nextFrame++
    },
    setProgress: (progress) => progressValues.push(progress),
    viewport,
  })

  assert.deepEqual(progressValues, [SCROLL_INDICATOR_MIN_PROGRESS])
  assert.equal(listeners.has('scroll'), true)
  assert.equal(listeners.has('resize'), true)

  viewport.scrollY = 1000
  listeners.get('scroll')?.()
  listeners.get('scroll')?.()
  assert.equal(frameCallbacks.length, 1)

  frameCallbacks[0]?.()
  assert.deepEqual(progressValues, [SCROLL_INDICATOR_MIN_PROGRESS, 0.54])

  viewport.scrollY = 2000
  listeners.get('resize')?.()
  cleanup()

  assert.deepEqual(removed, ['scroll', 'resize'])
  assert.deepEqual(canceledFrames, [2])
})
