import assert from 'node:assert/strict'
import test from 'node:test'

import {
  activateUnicodeLoaderFrameLoop,
  getNextUnicodeLoaderFrameIndex,
  getUnicodeLoaderClassName,
} from './unicode-loader.ts'

test('getNextUnicodeLoaderFrameIndex wraps spinner frames safely', () => {
  assert.equal(getNextUnicodeLoaderFrameIndex(0, 4), 1)
  assert.equal(getNextUnicodeLoaderFrameIndex(3, 4), 0)
  assert.equal(getNextUnicodeLoaderFrameIndex(0, 0), 0)
})

test('getUnicodeLoaderClassName preserves overlay base classes', () => {
  assert.equal(
    getUnicodeLoaderClassName('theme-dark'),
    'fixed inset-0 z-50 flex items-center justify-center theme-dark',
  )
})

test('activateUnicodeLoaderFrameLoop schedules frame updates and clears the timer', () => {
  const calls: unknown[] = []
  let tick: (() => void) | null = null

  const cleanup = activateUnicodeLoaderFrameLoop({
    clearInterval: (timer) => calls.push(['clear', timer]),
    frameCount: 4,
    intervalMs: 120,
    scheduleInterval: (callback, intervalMs) => {
      calls.push(['schedule', intervalMs])
      tick = callback
      return 'timer:unicode'
    },
    setFrameIndex: (updater) => {
      calls.push(['frame', updater(3)])
    },
  })

  tick?.()
  cleanup()

  assert.deepEqual(calls, [
    ['schedule', 120],
    ['frame', 0],
    ['clear', 'timer:unicode'],
  ])
})
