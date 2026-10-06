import assert from 'node:assert/strict'
import { test } from 'node:test'
import { DEFAULT_DITHER_SETTINGS, DITHER_PALETTES, ditherPixels, fitDitherImage } from './dither.ts'

test('export dimensions preserve aspect ratio without enlarging small images', () => {
  assert.deepEqual(fitDitherImage(6000, 4000), { width: 2400, height: 1600 })
  assert.deepEqual(fitDitherImage(4000, 6000), { width: 1600, height: 2400 })
  assert.deepEqual(fitDitherImage(80, 60), { width: 80, height: 60 })
})

test('both methods produce only the selected inks and preserve source pixels', () => {
  const source = new Uint8ClampedArray([0,0,0,255, 128,128,128,255, 255,255,255,255, 64,192,128,255])
  const before = source.slice()
  for (const palette of ['silver', 'charcoal', 'paper'] as const) {
    for (const method of ['ordered', 'diffusion'] as const) {
      const result = ditherPixels(source, 2, 2, { ...DEFAULT_DITHER_SETTINGS, palette, method })
      const inks = DITHER_PALETTES[palette]
      for (let i = 0; i < result.length; i += 4) {
        assert.ok([inks.dark.join(','), inks.light.join(',')].includes(Array.from(result.slice(i, i + 3)).join(',')))
        assert.equal(result[i + 3], 255)
      }
      assert.deepEqual(source, before)
    }
  }
})

test('transparent pixels become paper and single-pixel diffusion is bounded', () => {
  const result = ditherPixels(new Uint8ClampedArray([0, 0, 0, 0]), 1, 1, { ...DEFAULT_DITHER_SETTINGS, method: 'diffusion', grain: 0 })
  assert.deepEqual(Array.from(result), [...DITHER_PALETTES.silver.light, 255])
})

test('grain is deterministic so preview and export remain identical', () => {
  const source = new Uint8ClampedArray(16 * 16 * 4).fill(127)
  for (let i = 3; i < source.length; i += 4) source[i] = 255
  const settings = { ...DEFAULT_DITHER_SETTINGS, grain: 60 }
  assert.deepEqual(ditherPixels(source, 16, 16, settings), ditherPixels(source, 16, 16, settings))
})
