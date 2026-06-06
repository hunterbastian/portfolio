import assert from 'node:assert/strict'
import test from 'node:test'

import {
  METRIC_CARD_DEFAULT_DURATION_MS,
  METRIC_CARD_PANEL_DURATION_MS,
  METRIC_CARD_PANEL_INITIAL_STATE,
  METRIC_CARD_PANEL_VISIBLE_STATE,
  activateMetricCardCountUp,
  easeMetricCardProgress,
  getMetricCardAnimationProgress,
  getMetricCardCountUpFrame,
  getMetricCardDisplayValue,
  getMetricCardNumericValue,
  getMetricCardPanelAnimationState,
  getMetricCardVisibleValue,
  isMetricCardNumericValue,
} from './metric-card.ts'

test('metric card constants preserve animation defaults', () => {
  assert.equal(METRIC_CARD_DEFAULT_DURATION_MS, 1200)
  assert.equal(METRIC_CARD_PANEL_DURATION_MS, 400)
  assert.deepEqual(METRIC_CARD_PANEL_INITIAL_STATE, { opacity: 0, y: 12 })
  assert.deepEqual(METRIC_CARD_PANEL_VISIBLE_STATE, { opacity: 1, y: 0 })
})

test('metric card numeric helpers mirror current display coercion', () => {
  assert.equal(isMetricCardNumericValue(42), true)
  assert.equal(isMetricCardNumericValue('42'), true)
  assert.equal(isMetricCardNumericValue('Figma'), false)
  assert.equal(getMetricCardNumericValue('42'), 42)
})

test('metric card progress helpers clamp and ease count-up values', () => {
  assert.equal(getMetricCardAnimationProgress(600, 1200), 0.5)
  assert.equal(getMetricCardAnimationProgress(1400, 1200), 1)
  assert.equal(getMetricCardAnimationProgress(0, 0), 1)
  assert.equal(easeMetricCardProgress(0.5), 0.75)
  assert.equal(easeMetricCardProgress(-1), 0)
  assert.equal(easeMetricCardProgress(2), 1)
  assert.equal(getMetricCardDisplayValue(100, 600, 1200), 75)
})

test('metric card count-up frame helper couples display values with completion state', () => {
  assert.deepEqual(getMetricCardCountUpFrame({ durationMs: 1200, elapsedMs: 600, target: 100 }), {
    complete: false,
    displayValue: 75,
  })
  assert.deepEqual(getMetricCardCountUpFrame({ durationMs: 1200, elapsedMs: 1200, target: 100 }), {
    complete: true,
    displayValue: 100,
  })
  assert.deepEqual(getMetricCardCountUpFrame({ durationMs: 0, elapsedMs: 0, target: 100 }), {
    complete: true,
    displayValue: 100,
  })
})

test('activateMetricCardCountUp resets inactive cards and schedules count frames', () => {
  const inactiveDisplayValues: number[] = []
  const inactiveCleanup = activateMetricCardCountUp({
    cancelFrame: () => inactiveDisplayValues.push(-1),
    durationMs: 1200,
    isActive: false,
    now: () => 1000,
    requestFrame: () => 1,
    setDisplay: (displayValue) => inactiveDisplayValues.push(displayValue),
    target: 100,
  })

  inactiveCleanup()
  assert.deepEqual(inactiveDisplayValues, [0])

  const callbacks: Array<(now: number) => void> = []
  const canceledFrames: number[] = []
  const activeDisplayValues: number[] = []
  let nextFrame = 1

  const activeCleanup = activateMetricCardCountUp({
    cancelFrame: (frame) => canceledFrames.push(frame),
    durationMs: 1200,
    isActive: true,
    now: () => 1000,
    requestFrame: (callback) => {
      callbacks.push(callback)
      return nextFrame++
    },
    setDisplay: (displayValue) => activeDisplayValues.push(displayValue),
    target: 100,
  })

  assert.equal(callbacks.length, 1)
  callbacks[0]?.(1600)
  assert.deepEqual(activeDisplayValues, [75])
  assert.equal(callbacks.length, 2)
  callbacks[1]?.(2200)
  assert.deepEqual(activeDisplayValues, [75, 100])

  activeCleanup()
  assert.deepEqual(canceledFrames, [2])
})

test('metric card render helpers preserve motion and visible-value decisions', () => {
  assert.deepEqual(getMetricCardPanelAnimationState(false), METRIC_CARD_PANEL_INITIAL_STATE)
  assert.deepEqual(getMetricCardPanelAnimationState(true), METRIC_CARD_PANEL_VISIBLE_STATE)
  assert.equal(getMetricCardVisibleValue({
    animatedValue: 42,
    isNumeric: true,
    prefersReducedMotion: false,
    value: 100,
  }), 42)
  assert.equal(getMetricCardVisibleValue({
    animatedValue: 42,
    isNumeric: true,
    prefersReducedMotion: true,
    value: 100,
  }), 100)
  assert.equal(getMetricCardVisibleValue({
    animatedValue: 42,
    isNumeric: false,
    prefersReducedMotion: false,
    value: 'Figma',
  }), 'Figma')
})
