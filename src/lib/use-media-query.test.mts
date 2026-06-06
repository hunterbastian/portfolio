import assert from 'node:assert/strict'
import test from 'node:test'

import {
  getMediaQueryMatches,
  subscribeMediaQuery,
  type MediaQueryChangeSnapshot,
  type MediaQueryListLike,
} from './use-media-query.ts'

function createMediaQuery(matches: boolean) {
  let listener: ((event: MediaQueryChangeSnapshot) => void) | null = null
  const calls: unknown[] = []
  const mediaQuery: MediaQueryListLike = {
    matches,
    addEventListener: (type, nextListener) => {
      calls.push(['add', type])
      listener = nextListener
    },
    removeEventListener: (type, nextListener) => {
      calls.push(['remove', type, listener === nextListener])
      if (listener === nextListener) listener = null
    },
  }

  return {
    calls,
    emit: (nextMatches: boolean) => listener?.({ matches: nextMatches }),
    mediaQuery,
  }
}

test('getMediaQueryMatches reads the current match snapshot', () => {
  assert.equal(getMediaQueryMatches({ matches: true }), true)
  assert.equal(getMediaQueryMatches({ matches: false }), false)
})

test('subscribeMediaQuery sets initial match state, listens for changes, and cleans up', () => {
  const states: boolean[] = []
  const source = createMediaQuery(true)
  const cleanup = subscribeMediaQuery(source.mediaQuery, (matches) => states.push(matches))

  assert.deepEqual(states, [true])
  assert.deepEqual(source.calls, [['add', 'change']])

  source.emit(false)

  assert.deepEqual(states, [true, false])

  cleanup()

  assert.deepEqual(source.calls, [
    ['add', 'change'],
    ['remove', 'change', true],
  ])

  source.emit(true)

  assert.deepEqual(states, [true, false])
})
