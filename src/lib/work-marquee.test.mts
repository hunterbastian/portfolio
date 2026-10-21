import assert from 'node:assert/strict'
import test from 'node:test'

import {
  DESKTOP_MARQUEE_PX_PER_SECOND,
  MOBILE_MARQUEE_PX_PER_SECOND,
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
