import assert from 'node:assert/strict'
import test from 'node:test'

import { MOTION_EASE_SOFT } from './motion.ts'
import {
  getNotFoundRevealTransition,
  getNotFoundStaggerDelay,
  NOT_FOUND_ACTIONS_ANIMATE,
  NOT_FOUND_ACTIONS_INITIAL,
  NOT_FOUND_BLUR_REVEAL_ANIMATE,
  NOT_FOUND_BLUR_REVEAL_INITIAL,
  NOT_FOUND_CONTACT_ACTION_CLASS,
  NOT_FOUND_CONTACT_HREF,
  NOT_FOUND_CONTACT_LABEL,
  NOT_FOUND_DESCRIPTION,
  NOT_FOUND_HOME_ACTION_CLASS,
  NOT_FOUND_HOME_HREF,
  NOT_FOUND_HOME_ICON_CLASS,
  NOT_FOUND_HOME_LABEL,
  NOT_FOUND_REVEAL_DURATION,
  NOT_FOUND_STATUS_CODE,
  NOT_FOUND_STATUS_DELAY,
  NOT_FOUND_STAGGER_DELAY,
  NOT_FOUND_TITLE,
} from './not-found.ts'

test('not found copy and links preserve the 404 page contract', () => {
  assert.equal(NOT_FOUND_STATUS_CODE, '404')
  assert.equal(NOT_FOUND_TITLE, "This page doesn't exist.")
  assert.equal(NOT_FOUND_DESCRIPTION, 'It might have been moved or deleted.')
  assert.equal(NOT_FOUND_HOME_LABEL, 'Home')
  assert.equal(NOT_FOUND_HOME_HREF, '/')
  assert.equal(NOT_FOUND_CONTACT_LABEL, 'Contact')
  assert.equal(NOT_FOUND_CONTACT_HREF, '/#contact')
})

test('not found reveal states preserve the blur and action entrances', () => {
  assert.deepEqual(NOT_FOUND_BLUR_REVEAL_INITIAL, { opacity: 0, y: 8, filter: 'blur(4px)' })
  assert.deepEqual(NOT_FOUND_BLUR_REVEAL_ANIMATE, { opacity: 1, y: 0, filter: 'blur(0px)' })
  assert.deepEqual(NOT_FOUND_ACTIONS_INITIAL, { opacity: 0, y: 8 })
  assert.deepEqual(NOT_FOUND_ACTIONS_ANIMATE, { opacity: 1, y: 0 })
})

test('not found action classes preserve tactile link behavior', () => {
  assert.match(NOT_FOUND_HOME_ACTION_CLASS, /min-h-\[40px\]/)
  assert.match(NOT_FOUND_HOME_ACTION_CLASS, /active:scale-\[0\.96\]/)
  assert.match(NOT_FOUND_HOME_ICON_CLASS, /group-hover:-translate-x-1/)
  assert.match(NOT_FOUND_CONTACT_ACTION_CLASS, /uppercase/)
  assert.match(NOT_FOUND_CONTACT_ACTION_CLASS, /hover:text-accent/)
})

test('not found timing helpers preserve stagger and explicit status delay', () => {
  assert.equal(NOT_FOUND_REVEAL_DURATION, 0.4)
  assert.equal(NOT_FOUND_STAGGER_DELAY, 0.08)
  assert.equal(NOT_FOUND_STATUS_DELAY, 0.04)
  assert.equal(getNotFoundStaggerDelay(3), 0.24)
  assert.deepEqual(getNotFoundRevealTransition(), {
    duration: NOT_FOUND_REVEAL_DURATION,
    ease: MOTION_EASE_SOFT,
  })
  assert.deepEqual(getNotFoundRevealTransition(NOT_FOUND_STATUS_DELAY), {
    duration: NOT_FOUND_REVEAL_DURATION,
    delay: NOT_FOUND_STATUS_DELAY,
    ease: MOTION_EASE_SOFT,
  })
})
