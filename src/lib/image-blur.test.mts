import assert from 'node:assert/strict'
import test from 'node:test'

import { HOME_SHOWCASE_SLUGS, getShowcaseImageSrc } from './home-showcase.ts'
import { getImageBlurDataUrl } from './image-blur.ts'

test('showcase stills have blur placeholders', () => {
  for (const slug of HOME_SHOWCASE_SLUGS) {
    const light = getImageBlurDataUrl(getShowcaseImageSrc(slug))
    assert.equal(light?.startsWith('data:image/webp;base64,'), true)
  }
})

test('unknown images skip the blur placeholder', () => {
  assert.equal(getImageBlurDataUrl('/images/missing.webp'), undefined)
  assert.equal(getImageBlurDataUrl('/images/placeholder.svg'), undefined)
})
