import assert from 'node:assert/strict'
import test from 'node:test'
import { HOME_SHOWCASE_SLUGS } from './home-showcase.ts'
import {
  getMediaCrop,
  getShowcaseCrop,
  listShowcaseCropSlugs,
  mediaImageSizes,
} from './media-crops.ts'

test('every showcase slide has one bare crop', () => {
  assert.deepEqual(listShowcaseCropSlugs().sort(), [...HOME_SHOWCASE_SLUGS].sort())

  for (const slug of HOME_SHOWCASE_SLUGS) {
    const spec = getShowcaseCrop(slug)
    assert.ok(spec.aspect > 0.3 && spec.aspect < 2.2)
    assert.ok(spec.crop.w > 0 && spec.crop.h > 0)
    assert.ok(spec.crop.x >= 0 && spec.crop.y >= 0)
    assert.ok(spec.crop.x + spec.crop.w <= 1.001)
    assert.ok(spec.crop.y + spec.crop.h <= 1.001)
  }
})

test('phone slides stay tall and Nutricost stays a wide 4:3 spread', () => {
  for (const slug of ['lumo', 'wander-utah', 'porsche-app', 'aol-redesign']) {
    const spec = getShowcaseCrop(slug)
    assert.equal(spec.shape, 'phone')
    assert.ok(spec.aspect < 0.7)
  }

  const nutricost = getShowcaseCrop('nutricost')
  assert.equal(nutricost.shape, 'wide')
  const nutricostPixels = (nutricost.crop.w * 2400) / (nutricost.crop.h * 1600)
  assert.ok(Math.abs(nutricostPixels - 4 / 3) < 0.01)
  assert.ok(nutricost.crop.w < 0.5)

  assert.equal(getShowcaseCrop('rain').shape, 'wide')
  assert.equal(getShowcaseCrop('rain').crop.w, 1)
  assert.equal(getShowcaseCrop('mentalhealth-minisite').shape, 'wide')
  assert.equal(getShowcaseCrop('middle-earth-journey').shape, 'wide')
})

test('project mockups that need a crop resolve, and plain artwork does not', () => {
  assert.equal(getMediaCrop('/images/optimized/projects/lumo.webp')?.shape, 'phone')
  assert.equal(getMediaCrop('/images/optimized/projects/rain/phone-play.webp')?.shape, 'phone')
  assert.equal(getMediaCrop('/images/projects/porscheapp-screen.mp4')?.shape, 'phone')
  assert.equal(getMediaCrop('/showcase/rain.webp')?.shape, 'wide')
  assert.equal(getMediaCrop('/images/projects/nutricost-case-study.webp'), null)
})

test('cropped pictures request a source large enough for the zoomed window', () => {
  const porsche = getMediaCrop('/images/projects/porscheapp.webp')
  const lumo = getMediaCrop('/images/optimized/projects/lumo.webp')
  const rainPhone = getMediaCrop('/images/optimized/projects/rain/phone-play.webp')
  const rain = getMediaCrop('/showcase/rain.webp')
  assert.ok(porsche && lumo && rainPhone && rain)

  const factor = (sizes: string) => Number(sizes.match(/\* ([0-9.]+)\)/)?.[1])
  const porscheSizes = mediaImageSizes(porsche)
  assert.match(porscheSizes, /min\(232px, 68vw\)/)
  assert.ok(factor(porscheSizes) > 4)
  assert.ok(factor(mediaImageSizes(lumo)) > 3)
  assert.ok(factor(mediaImageSizes(lumo)) < factor(porscheSizes))

  assert.match(mediaImageSizes(rainPhone), /min\(232px, 68vw\) \* 1\)/)
  assert.match(mediaImageSizes(rain), /min\(520px, 100vw\)/)
  assert.match(mediaImageSizes(porsche, 'enlarged'), /min\(420px, 78vw\)/)
})
