import assert from 'node:assert/strict'
import test from 'node:test'

import {
  COMPARISON_SLIDER_AFTER_LABEL,
  COMPARISON_SLIDER_ARIA_LABEL,
  COMPARISON_SLIDER_BEFORE_LABEL,
  COMPARISON_SLIDER_INITIAL_POSITION,
  COMPARISON_SLIDER_MAX,
  COMPARISON_SLIDER_MIN,
  COMPARISON_SLIDER_MOTION_DURATION_MS,
  clampComparisonSliderPosition,
  getComparisonSliderInputPosition,
  getComparisonSliderPercent,
} from './comparison-slider.ts'

test('comparison slider constants preserve labels, bounds, and timing', () => {
  assert.equal(COMPARISON_SLIDER_MIN, 10)
  assert.equal(COMPARISON_SLIDER_MAX, 90)
  assert.equal(COMPARISON_SLIDER_INITIAL_POSITION, 52)
  assert.equal(COMPARISON_SLIDER_BEFORE_LABEL, 'Before')
  assert.equal(COMPARISON_SLIDER_AFTER_LABEL, 'After')
  assert.equal(COMPARISON_SLIDER_ARIA_LABEL, 'Compare before and after designs')
  assert.equal(COMPARISON_SLIDER_MOTION_DURATION_MS, 260)
})

test('comparison slider position helper clamps to draggable range', () => {
  assert.equal(clampComparisonSliderPosition(0), 10)
  assert.equal(clampComparisonSliderPosition(52), 52)
  assert.equal(clampComparisonSliderPosition(100), 90)
})

test('comparison slider input helper normalizes range input values', () => {
  assert.equal(getComparisonSliderInputPosition('4'), 10)
  assert.equal(getComparisonSliderInputPosition('42'), 42)
  assert.equal(getComparisonSliderInputPosition('108'), 90)
})

test('comparison slider percent helper formats clamped motion values', () => {
  assert.equal(getComparisonSliderPercent(8), '10%')
  assert.equal(getComparisonSliderPercent(42), '42%')
  assert.equal(getComparisonSliderPercent(99), '90%')
})
