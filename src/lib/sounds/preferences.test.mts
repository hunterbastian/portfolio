import assert from 'node:assert/strict'
import test from 'node:test'

import {
  SOUND_STORAGE_KEY,
  getNextSoundEnabled,
  parseStoredSoundEnabled,
  readStoredSoundEnabled,
  stringifyStoredSoundEnabled,
  writeStoredSoundEnabled,
} from './preferences.ts'

test('sound preference storage helpers preserve opt-in behavior', () => {
  assert.equal(SOUND_STORAGE_KEY, 'hb-sound-enabled')
  assert.equal(parseStoredSoundEnabled('true'), true)
  assert.equal(parseStoredSoundEnabled('false'), false)
  assert.equal(parseStoredSoundEnabled(null), false)
  assert.equal(parseStoredSoundEnabled(undefined), false)
})

test('sound preference toggle helpers serialize boolean state', () => {
  assert.equal(getNextSoundEnabled(false), true)
  assert.equal(getNextSoundEnabled(true), false)
  assert.equal(stringifyStoredSoundEnabled(true), 'true')
  assert.equal(stringifyStoredSoundEnabled(false), 'false')
})

test('sound preference storage helpers isolate unavailable localStorage behavior', () => {
  const values = new Map<string, string | null>([
    ['sound', 'true'],
  ])
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  }
  const unavailableStorage = {
    getItem: () => {
      throw new Error('storage unavailable')
    },
    setItem: () => {
      throw new Error('storage unavailable')
    },
  }

  assert.equal(readStoredSoundEnabled(storage, 'sound'), true)
  assert.equal(readStoredSoundEnabled(storage, 'missing'), false)
  writeStoredSoundEnabled(storage, false, 'sound')
  assert.equal(values.get('sound'), 'false')
  assert.equal(readStoredSoundEnabled(unavailableStorage), false)
  assert.doesNotThrow(() => writeStoredSoundEnabled(unavailableStorage, true))
})
