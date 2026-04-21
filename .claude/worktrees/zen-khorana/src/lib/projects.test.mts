import assert from 'node:assert/strict'
import test from 'node:test'

import { getProjectBySlug, isValidProjectSlug } from './projects.ts'

test('isValidProjectSlug accepts canonical slugs', () => {
  assert.equal(isValidProjectSlug('aol-redesign'), true)
  assert.equal(isValidProjectSlug('wander-utah'), true)
})

test('isValidProjectSlug rejects traversal and unsafe characters', () => {
  assert.equal(isValidProjectSlug(''), false)
  assert.equal(isValidProjectSlug('../secrets'), false)
  assert.equal(isValidProjectSlug('folder/child'), false)
  assert.equal(isValidProjectSlug('project.mdx'), false)
  assert.equal(isValidProjectSlug('Project-Uppercase'), false)
})

test('getProjectBySlug returns null for invalid slugs', () => {
  assert.equal(getProjectBySlug('../package'), null)
  assert.equal(getProjectBySlug('folder/child'), null)
})
