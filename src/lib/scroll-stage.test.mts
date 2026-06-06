import assert from 'node:assert/strict'
import test from 'node:test'

import {
  SCROLL_STAGE_CONTENT_INITIAL_STATE,
  SCROLL_STAGE_CONTENT_VISIBLE_STATE,
  SCROLL_STAGE_DURATION_MS,
  SCROLL_STAGE_RULE_INITIAL_STATE,
  SCROLL_STAGE_RULE_VISIBLE_STATE,
  SCROLL_STAGE_STAGGER_MS,
  SCROLL_STAGE_TITLE_INITIAL_STATE,
  SCROLL_STAGE_TITLE_VISIBLE_STATE,
  getScrollStageClassName,
  getScrollStageContentAnimationState,
  getScrollStageContentDelayMs,
  getScrollStageRuleAnimationState,
  getScrollStageTitleAnimationState,
  getScrollStageTitleDelayMs,
} from './scroll-stage.ts'

test('scroll stage constants preserve reveal timing and motion states', () => {
  assert.equal(SCROLL_STAGE_DURATION_MS, 600)
  assert.equal(SCROLL_STAGE_STAGGER_MS, 120)
  assert.deepEqual(SCROLL_STAGE_RULE_INITIAL_STATE, { opacity: 0, x: -8 })
  assert.deepEqual(SCROLL_STAGE_RULE_VISIBLE_STATE, { opacity: 1, x: 0 })
  assert.deepEqual(SCROLL_STAGE_TITLE_INITIAL_STATE, { opacity: 0, y: 12 })
  assert.deepEqual(SCROLL_STAGE_TITLE_VISIBLE_STATE, { opacity: 1, y: 0 })
  assert.deepEqual(SCROLL_STAGE_CONTENT_INITIAL_STATE, { opacity: 0, y: 16 })
  assert.deepEqual(SCROLL_STAGE_CONTENT_VISIBLE_STATE, { opacity: 1, y: 0 })
})

test('scroll stage helpers preserve class name and in-view state decisions', () => {
  assert.equal(getScrollStageClassName(), 'my-16 first:mt-0')
  assert.equal(getScrollStageClassName('wide-stage'), 'my-16 first:mt-0 wide-stage')
  assert.deepEqual(getScrollStageRuleAnimationState(false), SCROLL_STAGE_RULE_INITIAL_STATE)
  assert.deepEqual(getScrollStageRuleAnimationState(true), SCROLL_STAGE_RULE_VISIBLE_STATE)
  assert.deepEqual(getScrollStageTitleAnimationState(false), SCROLL_STAGE_TITLE_INITIAL_STATE)
  assert.deepEqual(getScrollStageTitleAnimationState(true), SCROLL_STAGE_TITLE_VISIBLE_STATE)
  assert.deepEqual(getScrollStageContentAnimationState(false), SCROLL_STAGE_CONTENT_INITIAL_STATE)
  assert.deepEqual(getScrollStageContentAnimationState(true), SCROLL_STAGE_CONTENT_VISIBLE_STATE)
})

test('scroll stage delay helpers stagger title and content consistently', () => {
  assert.equal(getScrollStageTitleDelayMs(), 120)
  assert.equal(getScrollStageContentDelayMs(false), 120)
  assert.equal(getScrollStageContentDelayMs(true), 240)
})
