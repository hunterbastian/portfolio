import assert from 'node:assert/strict'
import test from 'node:test'

import {
  UNICORN_ORB_DEFAULT_HEIGHT,
  UNICORN_ORB_DEFAULT_WIDTH,
  UNICORN_STUDIO_LOADING_FLAG,
  UNICORN_STUDIO_SCRIPT_SRC,
  UNICORN_STUDIO_WATERMARK_LINK_SELECTOR,
  UNICORN_STUDIO_WATERMARK_RETRY_DELAYS_MS,
  UNICORN_STUDIO_WATERMARK_TEXT,
  getUnicornOrbStyle,
  isUnicornStudioWatermarkText,
  normalizeUnicornStudioText,
} from './unicorn-orb.ts'

test('unicorn orb constants preserve script and watermark contracts', () => {
  assert.equal(UNICORN_ORB_DEFAULT_WIDTH, '100%')
  assert.equal(UNICORN_ORB_DEFAULT_HEIGHT, 420)
  assert.equal(
    UNICORN_STUDIO_SCRIPT_SRC,
    'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js',
  )
  assert.equal(UNICORN_STUDIO_LOADING_FLAG, '__usScriptLoading')
  assert.equal(UNICORN_STUDIO_WATERMARK_LINK_SELECTOR, 'a[href*="unicornstudio"]')
  assert.equal(UNICORN_STUDIO_WATERMARK_TEXT, 'unicorn studio')
  assert.deepEqual(UNICORN_STUDIO_WATERMARK_RETRY_DELAYS_MS, [50, 300, 1000])
})

test('unicorn orb style helper preserves configured dimensions', () => {
  assert.deepEqual(getUnicornOrbStyle({ width: '100%', height: 420 }), {
    width: '100%',
    height: 420,
  })
  assert.deepEqual(getUnicornOrbStyle({ width: 320, height: '50vh' }), {
    width: 320,
    height: '50vh',
  })
})

test('unicorn studio text helpers normalize and identify watermark copy', () => {
  assert.equal(normalizeUnicornStudioText('  Unicorn Studio  '), 'unicorn studio')
  assert.equal(isUnicornStudioWatermarkText('Made with Unicorn Studio'), true)
  assert.equal(isUnicornStudioWatermarkText('Portfolio animation'), false)
})
