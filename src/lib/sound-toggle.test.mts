import assert from 'node:assert/strict'
import test from 'node:test'

import {
  SOUND_TOGGLE_BUTTON_CLASS_NAME,
  SOUND_TOGGLE_ENABLE_LABEL,
  SOUND_TOGGLE_ICON_CLASS_NAME,
  SOUND_TOGGLE_ICONS,
  SOUND_TOGGLE_ICON_SIZE,
  SOUND_TOGGLE_ICON_STROKE_WIDTH,
  SOUND_TOGGLE_ICON_SWAP_CLASS_NAME,
  SOUND_TOGGLE_ICON_VIEW_BOX,
  SOUND_TOGGLE_MUTE_LABEL,
  getSoundToggleIconState,
  getSoundToggleLabel,
} from './sound-toggle.ts'

test('sound toggle labels describe the next available action', () => {
  assert.equal(SOUND_TOGGLE_ENABLE_LABEL, 'Enable sounds')
  assert.equal(SOUND_TOGGLE_MUTE_LABEL, 'Mute sounds')
  assert.equal(getSoundToggleLabel(false), SOUND_TOGGLE_ENABLE_LABEL)
  assert.equal(getSoundToggleLabel(true), SOUND_TOGGLE_MUTE_LABEL)
})

test('sound toggle icon descriptors preserve muted and enabled states', () => {
  assert.equal(SOUND_TOGGLE_ICON_SIZE, 12)
  assert.equal(SOUND_TOGGLE_ICON_VIEW_BOX, '0 0 16 16')
  assert.equal(SOUND_TOGGLE_ICON_STROKE_WIDTH, 1.5)
  assert.deepEqual(SOUND_TOGGLE_ICONS.map((icon) => icon.id), ['a', 'b'])
  assert.equal(SOUND_TOGGLE_ICONS[0]?.paths.length, 2)
  assert.equal(SOUND_TOGGLE_ICONS[1]?.paths.length, 3)
  assert.equal(getSoundToggleIconState(false), 'a')
  assert.equal(getSoundToggleIconState(true), 'b')
})

test('sound toggle chrome constants preserve hit area and icon swap classes', () => {
  assert.match(SOUND_TOGGLE_BUTTON_CLASS_NAME, /w-11 h-11/)
  assert.match(SOUND_TOGGLE_BUTTON_CLASS_NAME, /active:scale-\[0\.96\]/)
  assert.match(SOUND_TOGGLE_BUTTON_CLASS_NAME, /focus-visible:outline-primary/)
  assert.equal(SOUND_TOGGLE_ICON_SWAP_CLASS_NAME, 't-icon-swap')
  assert.equal(SOUND_TOGGLE_ICON_CLASS_NAME, 't-icon')
})
