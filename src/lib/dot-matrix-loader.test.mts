import assert from 'node:assert/strict'
import test from 'node:test'

import {
  DOT_MATRIX_DOTS,
  DOT_MATRIX_BRAND_MARK,
  DOT_MATRIX_FULLSCREEN_ROOT_CLASS,
  DOT_MATRIX_GRID_SIZE,
  DOT_MATRIX_INLINE_ROOT_CLASS,
  DOT_MATRIX_SPIRAL_ORDER,
  DOT_MATRIX_SPIRAL_PATH,
  getDotMatrixDotStyleVars,
  getDotMatrixLayout,
  getDotMatrixOpacity,
  getDotMatrixRootClassName,
  getDotMatrixStackClassName,
  getDotMatrixStyleVars,
} from './dot-matrix-loader.ts'

test('dot matrix spiral path covers every grid cell once', () => {
  const dotCount = DOT_MATRIX_GRID_SIZE * DOT_MATRIX_GRID_SIZE

  assert.equal(DOT_MATRIX_SPIRAL_PATH.length, dotCount)
  assert.deepEqual(
    [...new Set(DOT_MATRIX_SPIRAL_PATH)].sort((a, b) => a - b),
    Array.from({ length: dotCount }, (_, index) => index),
  )
  assert.deepEqual(DOT_MATRIX_SPIRAL_ORDER.slice(0, 5), [0, 1, 2, 3, 4])
  assert.equal(DOT_MATRIX_SPIRAL_ORDER[12], 24)
})

test('getDotMatrixLayout preserves compact gap and safe matrix sizing', () => {
  assert.deepEqual(getDotMatrixLayout(52, 6), { gap: 5, matrixSize: 50 })
  assert.deepEqual(getDotMatrixLayout(24, 6), { gap: 2, matrixSize: 38 })
  assert.deepEqual(getDotMatrixLayout(24, 3), { gap: 2, matrixSize: 23 })
})

test('dot matrix dots expose stable render order and opacity ramp', () => {
  assert.equal(DOT_MATRIX_DOTS.length, DOT_MATRIX_GRID_SIZE * DOT_MATRIX_GRID_SIZE)
  assert.deepEqual(DOT_MATRIX_DOTS[0], { index: 0, opacity: 0.16, order: 0 })
  assert.deepEqual(DOT_MATRIX_DOTS[12], { index: 12, opacity: 0.8, order: 24 })
  assert.equal(getDotMatrixOpacity(4), 0.26666666666666666)
  assert.equal(getDotMatrixOpacity(0, 1), 1)
})

test('dot matrix render helpers preserve style variables and wrapper classes', () => {
  assert.equal(DOT_MATRIX_BRAND_MARK, 'HB')
  assert.deepEqual(getDotMatrixStyleVars(52, 6), {
    '--dotmatrix-dot-size': '6px',
    '--dotmatrix-gap': '5px',
    '--dotmatrix-size': '50px',
  })
  assert.deepEqual(getDotMatrixDotStyleVars({ opacity: 0.42, order: 7 }), {
    '--dotmatrix-order': 7,
    opacity: 0.42,
  })
  assert.equal(getDotMatrixRootClassName(true), DOT_MATRIX_FULLSCREEN_ROOT_CLASS)
  assert.equal(getDotMatrixRootClassName(false), DOT_MATRIX_INLINE_ROOT_CLASS)
  assert.match(getDotMatrixRootClassName(false, 'text-primary'), /text-primary/)
  assert.equal(getDotMatrixStackClassName(true), 'relative z-10 flex flex-col items-center gap-5')
  assert.equal(getDotMatrixStackClassName(false), 'relative z-10 flex flex-col items-center gap-0')
})
