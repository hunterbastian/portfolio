import assert from 'node:assert/strict'
import test from 'node:test'

import {
  SEASON_ACCENT,
  applySeasonalAccent,
  getSeason,
  getSeasonAccent,
} from './season.ts'

test('getSeason maps dates to seasonal accent buckets', () => {
  assert.equal(getSeason(new Date(2026, 2, 1)), 'Spring')
  assert.equal(getSeason(new Date(2026, 5, 1)), 'Summer')
  assert.equal(getSeason(new Date(2026, 8, 1)), 'Autumn')
  assert.equal(getSeason(new Date(2026, 11, 1)), 'Winter')
})

test('getSeasonAccent returns the configured seasonal color', () => {
  assert.equal(getSeasonAccent('Spring'), SEASON_ACCENT.Spring)
  assert.equal(getSeasonAccent('Summer'), SEASON_ACCENT.Summer)
  assert.equal(getSeasonAccent('Autumn'), SEASON_ACCENT.Autumn)
  assert.equal(getSeasonAccent('Winter'), SEASON_ACCENT.Winter)
})

test('applySeasonalAccent writes accent and ring CSS variables', () => {
  const writes: Array<[string, string]> = []
  const accent = applySeasonalAccent({
    style: {
      setProperty: (name, value) => writes.push([name, value]),
    },
  }, 'Summer')

  assert.equal(accent, SEASON_ACCENT.Summer)
  assert.deepEqual(writes, [
    ['--accent', SEASON_ACCENT.Summer],
    ['--ring', SEASON_ACCENT.Summer],
  ])
})
