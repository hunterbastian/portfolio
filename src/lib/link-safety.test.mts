import assert from 'node:assert/strict'
import test from 'node:test'

import {
  BLANK_LINK_TARGET,
  SAFE_BLANK_LINK_REL,
  getSafeExternalLinkRel,
  isExternalHttpHref,
} from './link-safety.ts'

test('link safety helper classifies only absolute http links as external', () => {
  assert.equal(isExternalHttpHref('https://hunterbastian.com'), true)
  assert.equal(isExternalHttpHref('http://example.com'), true)
  assert.equal(isExternalHttpHref('/projects/lumo'), false)
  assert.equal(isExternalHttpHref('#projects'), false)
  assert.equal(isExternalHttpHref('mailto:hunter@example.com'), false)
})

test('link safety helper secures blank targets by default', () => {
  assert.equal(BLANK_LINK_TARGET, '_blank')
  assert.equal(SAFE_BLANK_LINK_REL, 'noopener noreferrer')
  assert.equal(getSafeExternalLinkRel(BLANK_LINK_TARGET), SAFE_BLANK_LINK_REL)
  assert.equal(getSafeExternalLinkRel('_self'), undefined)
  assert.equal(getSafeExternalLinkRel(BLANK_LINK_TARGET, 'nofollow'), 'nofollow')
})
