import assert from 'node:assert/strict'
import test from 'node:test'

import {
  EDITORIAL_ITEM_HAPTIC_STYLE,
  activateEditorialItem,
  getEditorialAccentStyle,
  getEditorialGlintPlacement,
  getEditorialItemToastMessage,
} from './editorial-item.ts'

test('getEditorialGlintPlacement picks stable placement from title length', () => {
  assert.deepEqual(getEditorialGlintPlacement('abcd'), getEditorialGlintPlacement(''))
  assert.equal(getEditorialGlintPlacement('a').delay, '80ms')
  assert.equal(getEditorialGlintPlacement('abc').dust, '130ms')
})

test('getEditorialAccentStyle maps placement and accent color to CSS variables', () => {
  assert.deepEqual(getEditorialAccentStyle('Lumo', '#f8c639'), {
    '--dust-delay-offset': '20ms',
    '--editorial-accent': '#f8c639',
    '--editorial-accent-bg': 'color-mix(in srgb, #f8c639 9%, transparent)',
    '--editorial-accent-border': 'color-mix(in srgb, #f8c639 54%, var(--border))',
    '--editorial-accent-shadow': 'color-mix(in srgb, #f8c639 32%, transparent)',
    '--glint-delay': '35ms',
    '--glint-hover-x': '1px',
    '--glint-hover-y': '0px',
    '--glint-start-x': '-5px',
    '--glint-start-y': '3px',
    '--glint-x': '1px',
    '--glint-y': '-1px',
  })
})

test('editorial item toast helper preserves default and custom copy', () => {
  assert.equal(EDITORIAL_ITEM_HAPTIC_STYLE, 'light')
  assert.equal(getEditorialItemToastMessage('Lumo'), 'Opening Lumo')
  assert.equal(getEditorialItemToastMessage('Lumo', 'Opening project'), 'Opening project')
})

test('activateEditorialItem preserves haptic, tracking, and toast ordering', () => {
  const calls: unknown[] = []

  activateEditorialItem({
    showToast: (message) => calls.push(['toast', message]),
    title: 'Playground',
    tracking: () => calls.push('tracking'),
    triggerHaptic: (style) => calls.push(['haptic', style]),
  })

  assert.deepEqual(calls, [
    ['haptic', 'light'],
    'tracking',
    ['toast', 'Opening Playground'],
  ])
})

test('activateEditorialItem uses custom toast copy without requiring tracking', () => {
  const calls: unknown[] = []

  activateEditorialItem({
    showToast: (message) => calls.push(['toast', message]),
    title: 'Playground',
    toastMessage: 'Opening playground',
    triggerHaptic: (style) => calls.push(['haptic', style]),
  })

  assert.deepEqual(calls, [
    ['haptic', 'light'],
    ['toast', 'Opening playground'],
  ])
})
