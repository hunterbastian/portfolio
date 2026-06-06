import assert from 'node:assert/strict'
import test from 'node:test'

import {
  GITHUB_CONTRIBUTION_CALENDAR_CONFIG,
  GITHUB_CONTRIBUTION_MONTHS,
  GITHUB_CONTRIBUTION_THEME,
  GITHUB_CONTRIBUTION_USERNAME,
  getContributionCutoffDate,
  selectRecentContributionMonths,
} from './github-contributions.ts'

test('github contribution constants preserve visible calendar defaults', () => {
  assert.equal(GITHUB_CONTRIBUTION_MONTHS, 5)
  assert.equal(GITHUB_CONTRIBUTION_USERNAME, 'hunterbastian')
  assert.deepEqual(GITHUB_CONTRIBUTION_CALENDAR_CONFIG, {
    showColorLegend: false,
    showTotalCount: false,
    blockSize: 10,
    blockMargin: 3,
    blockRadius: 0,
    fontSize: 10,
  })
  assert.deepEqual(GITHUB_CONTRIBUTION_THEME.light, ['#e5e5e5', '#c0c0c0', '#8a8a8a', '#555555', '#222222'])
  assert.deepEqual(GITHUB_CONTRIBUTION_THEME.dark, ['#2a2a2a', '#444444', '#666666', '#999999', '#cccccc'])
})

test('getContributionCutoffDate calculates a stable yyyy-mm-dd cutoff', () => {
  assert.equal(getContributionCutoffDate(5, new Date('2026-06-15T12:00:00.000Z')), '2026-01-15')
})

test('selectRecentContributionMonths keeps contributions on or after the cutoff', () => {
  const data = [
    { date: '2026-01-14', count: 2 },
    { date: '2026-01-15', count: 3 },
    { date: '2026-03-01', count: 4 },
  ]

  assert.deepEqual(selectRecentContributionMonths(data, 5, new Date('2026-06-15T12:00:00.000Z')), [
    { date: '2026-01-15', count: 3 },
    { date: '2026-03-01', count: 4 },
  ])
})
