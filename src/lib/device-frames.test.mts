import assert from 'node:assert/strict'
import test from 'node:test'
import { HOME_SHOWCASE_SLUGS } from './home-showcase.ts'
import {
  IPHONE_SCREEN_ASPECT,
  IPAD_SCREEN_ASPECT,
  deviceShellAspect,
  getDeviceFrameForSrc,
  getShowcaseDevice,
  listShowcaseDeviceSlugs,
} from './device-frames.ts'

test('every showcase slide has one device frame', () => {
  assert.deepEqual(listShowcaseDeviceSlugs().sort(), [...HOME_SHOWCASE_SLUGS].sort())

  for (const slug of HOME_SHOWCASE_SLUGS) {
    const spec = getShowcaseDevice(slug)
    assert.ok(spec.aspect > 0.3 && spec.aspect < 2.2)
    assert.ok(spec.crop.w > 0 && spec.crop.h > 0)
    assert.ok(spec.crop.x >= 0 && spec.crop.y >= 0)
    assert.ok(spec.crop.x + spec.crop.w <= 1.001)
    assert.ok(spec.crop.y + spec.crop.h <= 1.001)
    const shell = deviceShellAspect(spec.kind, spec.aspect)
    assert.ok(shell > 0)
  }
})

test('phone slides share an iPhone and Nutricost is an iPad', () => {
  for (const slug of ['lumo', 'wander-utah', 'porsche-app', 'aol-redesign']) {
    const spec = getShowcaseDevice(slug)
    assert.equal(spec.kind, 'iphone')
    assert.equal(spec.aspect, IPHONE_SCREEN_ASPECT)
  }

  assert.equal(getShowcaseDevice('nutricost').kind, 'ipad')
  assert.equal(getShowcaseDevice('nutricost').aspect, IPAD_SCREEN_ASPECT)
  assert.equal(getShowcaseDevice('rain').kind, 'laptop')
  assert.equal(getShowcaseDevice('mentalhealth-minisite').kind, 'laptop')
  assert.equal(getShowcaseDevice('middle-earth-journey').kind, 'laptop')
})

test('project mockups that already use a frame resolve to the same shells', () => {
  assert.equal(getDeviceFrameForSrc('/images/optimized/projects/lumo.webp')?.kind, 'iphone')
  assert.equal(getDeviceFrameForSrc('/images/optimized/projects/rain/phone-play.webp')?.kind, 'iphone')
  assert.equal(getDeviceFrameForSrc('/images/projects/porscheapp-screen.mp4')?.kind, 'iphone')
  assert.equal(getDeviceFrameForSrc('/showcase/rain.webp')?.kind, 'laptop')
  assert.equal(getDeviceFrameForSrc('/images/projects/nutricost-case-study.webp'), null)
})
