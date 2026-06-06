import assert from 'node:assert/strict'
import test from 'node:test'

import { getAnimatedDigitParts } from './animated-digits.ts'

test('getAnimatedDigitParts splits text and staggers the final numeric characters', () => {
  assert.deepEqual(getAnimatedDigitParts('8:34 AM'), [
    { character: '8', key: '0-8' },
    { character: ':', key: '1-:' },
    { character: '3', key: '2-3', stagger: 1 },
    { character: '4', key: '3-4', stagger: 2 },
    { character: ' ', key: '4- ' },
    { character: 'A', key: '5-A' },
    { character: 'M', key: '6-M' },
  ])
})

test('getAnimatedDigitParts can disable stagger metadata', () => {
  assert.deepEqual(getAnimatedDigitParts('12', { staggerLastNumericCount: 0 }), [
    { character: '1', key: '0-1' },
    { character: '2', key: '1-2' },
  ])
})
