import assert from 'node:assert/strict'
import test from 'node:test'

import {
  TILT_CARD_DEFAULT_MAX_TILT,
  TILT_CARD_DEFAULT_PERSPECTIVE,
  TILT_CARD_RESET_ROTATION,
  TILT_CARD_SPRING,
  getTiltCardInnerStyle,
  getTiltCardOuterStyle,
  getTiltCardRotation,
} from './tilt-card.ts'

test('tilt card constants preserve defaults and spring response', () => {
  assert.deepEqual(TILT_CARD_SPRING, { stiffness: 240, damping: 30 })
  assert.equal(TILT_CARD_DEFAULT_MAX_TILT, 2.8)
  assert.equal(TILT_CARD_DEFAULT_PERSPECTIVE, 900)
  assert.deepEqual(TILT_CARD_RESET_ROTATION, { rotateX: 0, rotateY: 0 })
})

test('getTiltCardRotation maps pointer position around the card center', () => {
  const rect = { left: 10, top: 20, width: 200, height: 100 }

  assert.deepEqual(getTiltCardRotation({ clientX: 110, clientY: 70, maxTilt: 2.8, rect }), {
    rotateX: -0,
    rotateY: 0,
  })
  assert.deepEqual(getTiltCardRotation({ clientX: 10, clientY: 20, maxTilt: 2.8, rect }), {
    rotateX: 2.8,
    rotateY: -2.8,
  })
  assert.deepEqual(getTiltCardRotation({ clientX: 210, clientY: 120, maxTilt: 2.8, rect }), {
    rotateX: -2.8,
    rotateY: 2.8,
  })
})

test('tilt card style helpers preserve transform style contracts', () => {
  assert.deepEqual(getTiltCardOuterStyle(900), {
    perspective: 900,
    willChange: 'transform',
  })
  assert.deepEqual(
    getTiltCardInnerStyle({
      rotateX: 1,
      rotateY: -1,
      style: { borderRadius: 8 },
    }),
    {
      borderRadius: 8,
      rotateX: 1,
      rotateY: -1,
      transformStyle: 'preserve-3d',
      willChange: 'transform',
    },
  )
})
