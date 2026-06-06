import assert from 'node:assert/strict'
import test from 'node:test'

import {
  HOVER_CUE_MIN_INTERVAL_MS,
  HOVER_CUE_SELECTOR,
  HOVER_CUE_SUPPRESS_SELECTOR,
  isHoverCuePointerType,
  shouldPlayHoverCue,
} from './hover-cue.ts'

test('hover cue selectors target interactive controls and expose opt-out hook', () => {
  assert.match(HOVER_CUE_SELECTOR, /a\[href\]/)
  assert.match(HOVER_CUE_SELECTOR, /button:not\(:disabled\)/)
  assert.match(HOVER_CUE_SELECTOR, /\[data-hover-sound="true"\]/)
  assert.match(HOVER_CUE_SUPPRESS_SELECTOR, /\[data-hover-sound="false"\]/)
  assert.match(HOVER_CUE_SUPPRESS_SELECTOR, /\[aria-disabled="true"\]/)
})

test('hover cue only runs for mouse-like pointer events', () => {
  assert.equal(isHoverCuePointerType('mouse'), true)
  assert.equal(isHoverCuePointerType(''), true)
  assert.equal(isHoverCuePointerType(undefined), true)
  assert.equal(isHoverCuePointerType('touch'), false)
  assert.equal(isHoverCuePointerType('pen'), false)
})

test('hover cue throttles repeated sounds and ignores movement inside one target', () => {
  const child = {}
  const target = {
    contains: (node: object) => node === child,
  }

  assert.equal(shouldPlayHoverCue({
    lastPlayedAt: 0,
    now: HOVER_CUE_MIN_INTERVAL_MS - 1,
    relatedTarget: null,
    target,
  }), false)
  assert.equal(shouldPlayHoverCue({
    lastPlayedAt: 0,
    now: HOVER_CUE_MIN_INTERVAL_MS,
    relatedTarget: null,
    target,
  }), true)
  assert.equal(shouldPlayHoverCue({
    lastPlayedAt: 0,
    now: HOVER_CUE_MIN_INTERVAL_MS + 20,
    relatedTarget: child as Node,
    target,
  }), false)
})
