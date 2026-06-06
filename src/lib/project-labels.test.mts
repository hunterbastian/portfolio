import assert from 'node:assert/strict'
import { test } from 'node:test'
import { formatProjectCategoryLabel } from './project-labels.ts'

test('formatProjectCategoryLabel returns curated labels for known categories', () => {
  assert.equal(formatProjectCategoryLabel('Mobile Design'), 'UX/UI, MOBILE')
  assert.equal(formatProjectCategoryLabel('UI and Web Design'), 'UX/UI, WEB')
  assert.equal(formatProjectCategoryLabel('Creative Coding'), 'CREATIVE CODING')
})

test('formatProjectCategoryLabel supports empty and unknown categories', () => {
  assert.equal(formatProjectCategoryLabel(), '')
  assert.equal(formatProjectCategoryLabel('Motion Systems'), 'MOTION SYSTEMS')
})
