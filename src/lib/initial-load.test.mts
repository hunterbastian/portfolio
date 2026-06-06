import assert from 'node:assert/strict'
import test from 'node:test'

import {
  getIsInitialLoad,
  markInitialLoadComplete,
  type InitialLoadTracker,
} from './initial-load.ts'

test('initial load tracker starts as initial until marked complete', () => {
  const tracker: InitialLoadTracker = { complete: false }

  assert.equal(getIsInitialLoad(tracker), true)

  markInitialLoadComplete(tracker)

  assert.equal(getIsInitialLoad(tracker), false)
  assert.equal(tracker.complete, true)
})

test('initial load tracker remains non-initial after repeated completion marks', () => {
  const tracker: InitialLoadTracker = { complete: true }

  markInitialLoadComplete(tracker)

  assert.equal(getIsInitialLoad(tracker), false)
  assert.equal(tracker.complete, true)
})
