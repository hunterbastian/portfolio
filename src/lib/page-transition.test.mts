import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  PAGE_ENTRANCE_INITIAL_Y,
  getPageTransitionYOffset,
  getPageTransitionInitial,
} from './page-transition.ts'

test('first-load and reduced-motion pages start visible', () => {
  assert.equal(getPageTransitionInitial(true, false), false)
  assert.equal(getPageTransitionInitial(true, true), false)
  assert.equal(getPageTransitionInitial(false, true), false)
})

test('client navigation fades in without a vertical offset', () => {
  assert.deepEqual(getPageTransitionInitial(false, false), { opacity: 0 })
  assert.equal(PAGE_ENTRANCE_INITIAL_Y, 0)
  assert.equal(getPageTransitionYOffset(), 0)
})
