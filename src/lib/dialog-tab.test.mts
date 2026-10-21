import assert from 'node:assert/strict'
import test from 'node:test'

import { nextDialogTabIndex } from './dialog-tab.ts'

test('dialog tab stays inside the open lightbox', () => {
  assert.equal(nextDialogTabIndex(2, 3, false, true), 0)
  assert.equal(nextDialogTabIndex(0, 3, true, true), 2)
  assert.equal(nextDialogTabIndex(1, 3, false, true), null)
  assert.equal(nextDialogTabIndex(-1, 3, false, false), 0)
  assert.equal(nextDialogTabIndex(-1, 3, true, true), 2)
  assert.equal(nextDialogTabIndex(0, 0, false, true), null)
})
