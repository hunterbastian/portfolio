import assert from 'node:assert/strict'
import test from 'node:test'

import { getProjectCardImageZoomStyle } from './project-card.ts'

test('project card zoom style only applies a transform for a real zoom factor', () => {
  assert.deepEqual(getProjectCardImageZoomStyle(1.08), { transform: 'scale(1.08)' })
  assert.equal(getProjectCardImageZoomStyle(0), undefined)
  assert.equal(getProjectCardImageZoomStyle(), undefined)
})
