import assert from 'node:assert/strict'
import test from 'node:test'

import {
  LOADING_SCREEN_CONTENT_TRANSITION,
  LOADING_SCREEN_DEFAULT_DURATION_MS,
  LOADING_SCREEN_LOADER_TRANSITION,
  scheduleLoadingScreenReveal,
} from './loading-screen.ts'

test('loading screen constants preserve transition timing', () => {
  assert.equal(LOADING_SCREEN_DEFAULT_DURATION_MS, 1000)
  assert.deepEqual(LOADING_SCREEN_LOADER_TRANSITION, { duration: 0.5 })
  assert.deepEqual(LOADING_SCREEN_CONTENT_TRANSITION, { duration: 0.8, delay: 0.1 })
})

test('scheduleLoadingScreenReveal mounts immediately and schedules the reveal', () => {
  const calls: unknown[] = []
  const timer = scheduleLoadingScreenReveal({
    durationMs: 1200,
    scheduleReveal: (delayMs) => {
      calls.push(['schedule', delayMs])
      return `timer:${delayMs}`
    },
    setIsMounted: (isMounted) => calls.push(['mounted', isMounted]),
  })

  assert.deepEqual(calls, [
    ['mounted', true],
    ['schedule', 1200],
  ])
  assert.equal(timer, 'timer:1200')
})
