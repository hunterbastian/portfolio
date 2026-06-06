import assert from 'node:assert/strict'
import test from 'node:test'

import { formatYearFromDate } from './date.ts'

test('formatYearFromDate reads frontmatter date years without timezone drift', () => {
  assert.equal(formatYearFromDate('2023-01-01'), '2023')
  assert.equal(formatYearFromDate('2026-02-03'), '2026')
})

test('formatYearFromDate supports fallback parsing and invalid-date fallbacks', () => {
  assert.equal(formatYearFromDate('March 12, 2026'), '2026')
  assert.equal(formatYearFromDate('not-a-date'), 'Now')
  assert.equal(formatYearFromDate('not-a-date', 'Unknown'), 'Unknown')
})
