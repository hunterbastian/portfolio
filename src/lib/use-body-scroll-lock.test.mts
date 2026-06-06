import assert from 'node:assert/strict'
import test from 'node:test'

import { activateBodyScrollLock } from './use-body-scroll-lock.ts'

test('activateBodyScrollLock hides body overflow and restores the previous value', () => {
  const style = { overflow: 'auto' }
  const restore = activateBodyScrollLock(style)

  assert.equal(style.overflow, 'hidden')

  restore()

  assert.equal(style.overflow, 'auto')
})

test('activateBodyScrollLock preserves an empty previous overflow value', () => {
  const style = { overflow: '' }
  const restore = activateBodyScrollLock(style)

  assert.equal(style.overflow, 'hidden')

  restore()

  assert.equal(style.overflow, '')
})
