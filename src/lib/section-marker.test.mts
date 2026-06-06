import assert from 'node:assert/strict'
import test from 'node:test'

import {
  SECTION_MARKER_BASE_CLASS_NAME,
  SECTION_MARKER_DEFAULT_KIND,
  SECTION_MARKER_GLYPH_SIZE,
  categoryToSectionMarkerKind,
  getSectionMarkerClassName,
  shouldRenderSectionMarkerLabel,
} from './section-marker.ts'

test('section marker constants preserve base chrome and default kind', () => {
  assert.equal(SECTION_MARKER_DEFAULT_KIND, 'work')
  assert.equal(SECTION_MARKER_GLYPH_SIZE, 10)
  assert.match(SECTION_MARKER_BASE_CLASS_NAME, /inline-flex/)
  assert.match(SECTION_MARKER_BASE_CLASS_NAME, /uppercase/)
  assert.match(SECTION_MARKER_BASE_CLASS_NAME, /text-muted-foreground\/55/)
})

test('section marker class helper preserves optional caller classes', () => {
  assert.equal(getSectionMarkerClassName(), SECTION_MARKER_BASE_CLASS_NAME)
  assert.equal(getSectionMarkerClassName('mb-3'), `${SECTION_MARKER_BASE_CLASS_NAME} mb-3`)
})

test('categoryToSectionMarkerKind maps portfolio categories to marker glyph kinds', () => {
  assert.equal(categoryToSectionMarkerKind(), 'work')
  assert.equal(categoryToSectionMarkerKind('Product Design'), 'work')
  assert.equal(categoryToSectionMarkerKind('Game Design'), 'games')
  assert.equal(categoryToSectionMarkerKind('Creative Coding'), 'games')
  assert.equal(categoryToSectionMarkerKind('Brand System'), 'writing')
  assert.equal(categoryToSectionMarkerKind('Editorial Writing'), 'writing')
  assert.equal(categoryToSectionMarkerKind('Graphic Design'), 'writing')
  assert.equal(categoryToSectionMarkerKind('Photography'), 'archive')
})

test('section marker label helper preserves truthy render behavior', () => {
  assert.equal(shouldRenderSectionMarkerLabel('Projects'), true)
  assert.equal(shouldRenderSectionMarkerLabel(''), false)
  assert.equal(shouldRenderSectionMarkerLabel(undefined), false)
})
