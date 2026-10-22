import assert from 'node:assert/strict'
import test from 'node:test'

import {
  DESKTOP_MARQUEE_PX_PER_SECOND,
  HOVER_EASE_SECONDS,
  HOVER_SPEED_SCALE,
  MOBILE_MARQUEE_PX_PER_SECOND,
  TOUCH_HOVER_SUPPRESS_MS,
  acceptsHoverPointer,
  clampTagCenter,
  marqueeEasedSpeed,
  marqueeFrameDelta,
} from './work-marquee.ts'

test('work row moves at a constant pixel speed', () => {
  assert.equal(DESKTOP_MARQUEE_PX_PER_SECOND, 12)
  assert.equal(MOBILE_MARQUEE_PX_PER_SECOND, 10)

  let desktop = 0
  let mobile = 0
  for (let frame = 0; frame < 60; frame += 1) {
    desktop += marqueeFrameDelta(DESKTOP_MARQUEE_PX_PER_SECOND, 1 / 60)
    mobile += marqueeFrameDelta(MOBILE_MARQUEE_PX_PER_SECOND, 1 / 60)
  }
  assert.ok(Math.abs(desktop - 12) < 0.001)
  assert.ok(Math.abs(mobile - 10) < 0.001)
  assert.equal(marqueeFrameDelta(12, 0), 0)
  assert.ok(Math.abs(marqueeFrameDelta(12, 2) - 0.6) < 1e-9)
})

test('hover eases the row to about 30% speed over 400ms', () => {
  assert.ok(HOVER_SPEED_SCALE >= 0.25 && HOVER_SPEED_SCALE <= 0.35)
  assert.equal(HOVER_EASE_SECONDS, 0.4)
  const slow = DESKTOP_MARQUEE_PX_PER_SECOND * HOVER_SPEED_SCALE
  assert.ok(Math.abs(slow - 3.6) < 1e-9)
  assert.equal(marqueeEasedSpeed(12, slow, 0), 12)
  assert.ok(Math.abs(marqueeEasedSpeed(12, slow, 0.2) - 7.8) < 1e-9)
  assert.ok(Math.abs(marqueeEasedSpeed(12, slow, 0.4) - slow) < 1e-9)
  assert.ok(Math.abs(marqueeEasedSpeed(slow, 12, 0.4) - 12) < 1e-9)
  assert.equal(marqueeEasedSpeed(12, slow, 1), slow)
})

test('a mouse or pen hover works on a touchscreen, and a tap does not', () => {
  assert.equal(acceptsHoverPointer('mouse', TOUCH_HOVER_SUPPRESS_MS), true)
  assert.equal(acceptsHoverPointer('pen', Number.POSITIVE_INFINITY), true)
  assert.equal(acceptsHoverPointer('touch', Number.POSITIVE_INFINITY), false)
  assert.equal(acceptsHoverPointer('mouse', 0), false)
  assert.equal(acceptsHoverPointer('mouse', TOUCH_HOVER_SUPPRESS_MS - 1), false)
})

test('the hover tag stays inside the frame', () => {
  assert.equal(clampTagCenter(400, 120, 1000), 400)
  assert.equal(clampTagCenter(20, 120, 1000), 68)
  assert.equal(clampTagCenter(980, 120, 1000), 932)
  assert.equal(clampTagCenter(10, 200, 100), 50)
})
