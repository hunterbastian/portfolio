import assert from 'node:assert/strict'
import test from 'node:test'

import { HOME_SHOWCASE_SLUGS } from './home-showcase.ts'
import { DEVICE_FRAME, deviceInnerRadius, deviceShellAspect } from './device-frames.ts'
import { getMediaCrop, getShowcaseCrop } from './media-crops.ts'

test('showcase frames are the simple iPhone, iPad, and laptop shells', () => {
  for (const slug of ['lumo', 'wander-utah', 'porsche-app', 'aol-redesign']) {
    assert.equal(getShowcaseCrop(slug).frame, 'iphone')
  }
  assert.equal(getShowcaseCrop('nutricost').frame, 'ipad')
  assert.equal(getShowcaseCrop('rain').frame, 'laptop')
  assert.equal(getShowcaseCrop('mentalhealth-minisite').frame, 'laptop')
  assert.equal(getShowcaseCrop('middle-earth-journey').frame, 'laptop')

  for (const slug of HOME_SHOWCASE_SLUGS) {
    const spec = getShowcaseCrop(slug)
    const shell = deviceShellAspect(spec.frame, spec.aspect)
    assert.ok(shell > 0.3 && shell < 2.4, slug)
    if (spec.frame === 'laptop') assert.ok(shell < spec.aspect, slug)
    if (spec.frame === 'iphone') assert.ok(shell > spec.aspect * 0.9 && shell < spec.aspect * 1.15, slug)
  }
})

test('shells use one thin rim, and a laptop chin is taller than its sides', () => {
  assert.equal(DEVICE_FRAME.ipad.chin, DEVICE_FRAME.ipad.bezel)
  assert.ok(DEVICE_FRAME.laptop.chin > DEVICE_FRAME.laptop.bezel * 1.6)
  assert.ok(DEVICE_FRAME.laptop.bezel < 0.02)
  assert.ok(DEVICE_FRAME.ipad.bezel < 0.02)

  for (const kind of ['iphone', 'ipad', 'laptop'] as const) {
    const frame = DEVICE_FRAME[kind]
    const inner = deviceInnerRadius(kind)
    assert.ok(Math.abs(inner - (frame.radius - frame.bezel) / (1 - 2 * frame.bezel)) < 1e-9)
    assert.ok(inner > 0)
  }
})

test('framed project mockups use the same simple shells', () => {
  assert.equal(getMediaCrop('/images/optimized/projects/lumo.webp')?.frame, 'iphone')
  assert.equal(getMediaCrop('/images/optimized/projects/rain/phone-play.webp')?.frame, 'iphone')
  assert.equal(getMediaCrop('/images/projects/porscheapp-screen.mp4')?.frame, 'iphone')
  assert.equal(getMediaCrop('/showcase/rain.webp')?.frame, 'laptop')
  assert.equal(getMediaCrop('/images/projects/nutricost-case-study.webp'), null)
})
