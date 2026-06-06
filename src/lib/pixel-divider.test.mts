import assert from 'node:assert/strict'
import test from 'node:test'

import {
  PIXEL_DIVIDER_HEIGHT,
  PIXEL_DIVIDER_RECT_FILL,
  PIXEL_DIVIDER_RECT_SIZE,
  PIXEL_DIVIDER_RECT_X_POSITIONS,
  PIXEL_DIVIDER_VIEW_BOX,
  PIXEL_DIVIDER_WIDTH,
  getPixelDividerAriaHidden,
  getPixelDividerClassName,
  getPixelDividerRole,
} from './pixel-divider.ts'

test('pixel divider constants preserve SVG geometry', () => {
  assert.equal(PIXEL_DIVIDER_WIDTH, 36)
  assert.equal(PIXEL_DIVIDER_HEIGHT, 4)
  assert.equal(PIXEL_DIVIDER_VIEW_BOX, '0 0 36 4')
  assert.equal(PIXEL_DIVIDER_RECT_SIZE, 4)
  assert.equal(PIXEL_DIVIDER_RECT_FILL, 'currentColor')
  assert.deepEqual(PIXEL_DIVIDER_RECT_X_POSITIONS, [0, 16, 32])
})

test('pixel divider helpers preserve class and aria states', () => {
  assert.equal(getPixelDividerClassName('crisp'), 'crisp')
  assert.equal(getPixelDividerClassName('crisp', 'mt-4'), 'crisp mt-4')
  assert.equal(getPixelDividerRole(), 'presentation')
  assert.equal(getPixelDividerRole('Divider'), 'img')
  assert.equal(getPixelDividerAriaHidden(), true)
  assert.equal(getPixelDividerAriaHidden('Divider'), undefined)
})
