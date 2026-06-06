import assert from 'node:assert/strict'
import { test } from 'node:test'

import { MOTION_EASE_SOFT, MOTION_REDUCED_DURATION } from './motion.ts'
import {
  getHomeRevealInitialState,
  getHomeRevealMotionState,
  getHomeRevealShadowDelay,
  getHomeRevealTransition,
  getHomeSectionClassName,
  HOME_REVEAL_BLUR,
  HOME_REVEAL_DURATION_MS,
  HOME_REVEAL_OFFSET_Y,
  HOME_REVEAL_SHADOW_DELAY_OFFSET_MS,
  shouldRevealHomeSection,
} from './home-section.ts'

test('home reveal helpers preserve visible and hidden states', () => {
  assert.equal(shouldRevealHomeSection(false, false), false)
  assert.equal(shouldRevealHomeSection(true, false), true)
  assert.equal(shouldRevealHomeSection(false, true), true)
  assert.deepEqual(getHomeRevealMotionState(false), {
    opacity: 0,
    y: HOME_REVEAL_OFFSET_Y,
    filter: `blur(${HOME_REVEAL_BLUR}px)`,
  })
  assert.deepEqual(getHomeRevealMotionState(true), {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
  })
  assert.deepEqual(getHomeRevealInitialState(false), getHomeRevealMotionState(false))
  assert.equal(getHomeRevealInitialState(true), false)
})

test('home reveal timing helpers preserve delay and reduced-motion contracts', () => {
  assert.equal(getHomeRevealShadowDelay(120, false), `${120 + HOME_REVEAL_SHADOW_DELAY_OFFSET_MS}ms`)
  assert.equal(getHomeRevealShadowDelay(120, true), '0ms')
  assert.deepEqual(getHomeRevealTransition(120, false), {
    duration: HOME_REVEAL_DURATION_MS / 1000,
    delay: 0.12,
    ease: MOTION_EASE_SOFT,
  })
  assert.deepEqual(getHomeRevealTransition(120, true), {
    duration: MOTION_REDUCED_DURATION,
    delay: 0,
    ease: MOTION_EASE_SOFT,
  })
})

test('home section class helper preserves scroll and content spacing composition', () => {
  assert.equal(getHomeSectionClassName('scroll-mt-24', 'space-y-4 sm:space-y-7'), 'scroll-mt-24 space-y-4 sm:space-y-7')
})
