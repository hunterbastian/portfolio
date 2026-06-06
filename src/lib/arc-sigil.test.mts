import assert from 'node:assert/strict'
import test from 'node:test'

import {
  ARC_SIGIL_DOWNLOAD_ACTIONS,
  ARC_SIGIL_DOWNLOAD_FILES,
  ARC_SIGIL_DOWNLOAD_BUTTON_CLASS,
  ARC_SIGIL_EXPORT_COLORS,
  ARC_SIGIL_EXPORT_SIZES,
  ARC_SIGIL_LOADER_BASE_CLASS,
  ARC_SIGIL_LOADER_FRAME_CLASS,
  buildArcSigilLinkedInSvgMarkup,
  buildArcSigilLogoSvgMarkup,
  getArcSigilLoaderClassName,
  getArcSigilLoaderSizeStyle,
  getArcSigilGroupMarkup,
} from './arc-sigil.ts'

test('arc sigil export constants preserve files, colors, and PNG sizes', () => {
  assert.deepEqual(ARC_SIGIL_DOWNLOAD_FILES, {
    logoPng: 'hunter-logo.png',
    logoSvg: 'hunter-logo.svg',
    linkedInPng: 'hunter-linkedin-logo-400x400.png',
  })
  assert.equal(ARC_SIGIL_EXPORT_COLORS.stroke, '#d8dee9')
  assert.equal(ARC_SIGIL_EXPORT_COLORS.accent, '#d4928e')
  assert.deepEqual(ARC_SIGIL_EXPORT_SIZES.logoPng, { width: 1200, height: 1200 })
  assert.deepEqual(ARC_SIGIL_EXPORT_SIZES.linkedInPng, { width: 400, height: 400 })
  assert.deepEqual(ARC_SIGIL_DOWNLOAD_ACTIONS, [
    { id: 'logoSvg', label: 'Download SVG' },
    { id: 'logoPng', label: 'Download PNG' },
    { id: 'linkedInPng', label: 'LinkedIn 400x400' },
  ])
})

test('arc sigil loader helpers preserve wrapper, frame, button, and sizing contracts', () => {
  assert.equal(ARC_SIGIL_LOADER_BASE_CLASS, 'flex flex-col items-center justify-center gap-5')
  assert.equal(ARC_SIGIL_LOADER_FRAME_CLASS, 'relative isolate')
  assert.match(ARC_SIGIL_DOWNLOAD_BUTTON_CLASS, /nord-button/)
  assert.match(ARC_SIGIL_DOWNLOAD_BUTTON_CLASS, /uppercase/)
  assert.equal(getArcSigilLoaderClassName(), ARC_SIGIL_LOADER_BASE_CLASS)
  assert.equal(getArcSigilLoaderClassName('mt-8'), `${ARC_SIGIL_LOADER_BASE_CLASS} mt-8`)
  assert.deepEqual(getArcSigilLoaderSizeStyle(96), { width: '96px', height: '96px' })
})

test('getArcSigilGroupMarkup emits the reusable sigil geometry', () => {
  const markup = getArcSigilGroupMarkup('#fff', '#f00')

  assert.match(markup, /stroke="#fff"/)
  assert.match(markup, /stroke="#f00"/)
  assert.match(markup, /<circle cx="60" cy="60" r="44"/)
  assert.match(markup, /<path d="M90 48a32 32 0 0 1-4 24"/)
})

test('buildArcSigilLogoSvgMarkup emits the standalone 120px logo svg', () => {
  const markup = buildArcSigilLogoSvgMarkup()

  assert.match(markup, /^<svg /)
  assert.match(markup, /width="120" height="120"/)
  assert.match(markup, /viewBox="0 0 120 120"/)
  assert.match(markup, new RegExp(ARC_SIGIL_EXPORT_COLORS.stroke))
  assert.match(markup, new RegExp(ARC_SIGIL_EXPORT_COLORS.accent))
})

test('buildArcSigilLinkedInSvgMarkup emits the padded 400px profile svg', () => {
  const markup = buildArcSigilLinkedInSvgMarkup()

  assert.match(markup, /width="400" height="400"/)
  assert.match(markup, /<rect width="400" height="400"/)
  assert.match(markup, /<circle cx="200" cy="200" r="170"/)
  assert.match(markup, /transform="translate\(55 55\) scale\(2\.4167\)"/)
  assert.match(markup, new RegExp(ARC_SIGIL_EXPORT_COLORS.background))
  assert.match(markup, new RegExp(ARC_SIGIL_EXPORT_COLORS.panel))
})
