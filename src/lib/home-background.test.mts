import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'

import {
  areBackgroundBeatsNewestFirst,
  getHomeBackgroundDisplayItem,
  getHomeBackgroundKey,
  getHomeBackgroundSortYear,
} from './home-background.ts'

const beat = {
  year: '2026',
  title: 'Founder, Studio Alpine',
  description: 'Photography and design project. Continuing Interaction Design at UVU.',
}

test('home background helpers preserve keys and display fields', () => {
  assert.equal(getHomeBackgroundKey(beat), 'Founder, Studio Alpine-2026')
  assert.deepEqual(getHomeBackgroundDisplayItem(beat), {
    description: beat.description,
    eyebrow: '2026',
    key: 'Founder, Studio Alpine-2026',
    title: 'Founder, Studio Alpine',
  })
})

test('home background beats stay a short newest-first momentum timeline', () => {
  const source = readFileSync(new URL('../content/homepage.ts', import.meta.url), 'utf8')
  const start = source.indexOf('export const backgroundBeats')
  const end = source.indexOf('export const experienceItems')
  const years = [...source.slice(start, end).matchAll(/year: '([^']+)'/g)].map((match) => match[1])

  assert.equal(getHomeBackgroundSortYear('2024 - Present'), 2024)
  assert.equal(getHomeBackgroundSortYear('undated'), 0)
  assert.ok(start >= 0)
  assert.ok(end > start)
  assert.ok(years.length >= 4)
  assert.ok(years.length <= 6)
  assert.equal(areBackgroundBeatsNewestFirst(years.map((year) => ({ year }))), true)
  assert.equal(
    areBackgroundBeatsNewestFirst([
      { year: '2023' },
      { year: '2024 - Present' },
    ]),
    false,
  )
})
