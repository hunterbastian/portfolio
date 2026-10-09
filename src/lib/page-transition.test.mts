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

test('client navigation has one entrance matching the project scroll offset', () => {
  assert.deepEqual(getPageTransitionInitial(false, false), { opacity: 0, y: PAGE_ENTRANCE_INITIAL_Y })
  assert.equal(getPageTransitionYOffset(), PAGE_ENTRANCE_INITIAL_Y)
})
