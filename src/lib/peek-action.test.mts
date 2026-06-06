import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  getPeekActionClassName,
  getPeekActionKind,
  getPeekTooltipClassName,
  PEEK_ACTION_BASE_CLASS,
  PEEK_TOOLTIP_BASE_CLASS,
  shouldRenderPeekTooltip,
} from './peek-action.ts'

test('peek action kind helper preserves link and button routing', () => {
  assert.equal(getPeekActionKind(undefined, false), 'button')
  assert.equal(getPeekActionKind('', true), 'button')
  assert.equal(getPeekActionKind('/cv', false), 'internal-link')
  assert.equal(getPeekActionKind('https://example.com', true), 'external-link')
})

test('peek action class helpers preserve base classes and caller overrides', () => {
  assert.equal(getPeekActionClassName(), PEEK_ACTION_BASE_CLASS)
  assert.match(getPeekActionClassName('text-primary'), /text-primary/)
  assert.match(getPeekActionClassName('text-primary'), /group\/peek/)
  assert.equal(getPeekTooltipClassName(), PEEK_TOOLTIP_BASE_CLASS)
  assert.match(getPeekTooltipClassName('bg-card'), /bg-card/)
  assert.match(getPeekTooltipClassName('bg-card'), /group-hover\/peek:opacity-100/)
})

test('peek tooltip helper preserves existing truthy rendering behavior', () => {
  assert.equal(shouldRenderPeekTooltip('Open'), true)
  assert.equal(shouldRenderPeekTooltip({}), true)
  assert.equal(shouldRenderPeekTooltip(''), false)
  assert.equal(shouldRenderPeekTooltip(0), false)
  assert.equal(shouldRenderPeekTooltip(false), false)
  assert.equal(shouldRenderPeekTooltip(null), false)
  assert.equal(shouldRenderPeekTooltip(undefined), false)
})
