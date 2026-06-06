import assert from 'node:assert/strict'
import test from 'node:test'

import {
  getValidImageAnnotationHotspots,
  getImageAnnotationHotspotKey,
  getImageAnnotationHotspotPositionStyle,
  getImageAnnotationTooltipPlacement,
  getImageAnnotationTooltipStyle,
  getNextImageAnnotationActiveIndex,
  isImageAnnotationHotspot,
  parseImageAnnotationHotspots,
} from './image-annotation.ts'

test('parseImageAnnotationHotspots accepts arrays and MDX JSON strings', () => {
  const hotspots = [{ x: 20, y: 30, label: 'A', description: 'First' }]

  assert.deepEqual(parseImageAnnotationHotspots(hotspots), hotspots)
  assert.deepEqual(parseImageAnnotationHotspots(JSON.stringify(hotspots)), hotspots)
})

test('parseImageAnnotationHotspots returns an empty list for invalid JSON strings', () => {
  assert.deepEqual(parseImageAnnotationHotspots('{bad json'), [])
})

test('image annotation runtime guards reject invalid hotspot shapes', () => {
  const validHotspot = { x: 20, y: 30, label: 'A', description: 'First' }
  const invalidHotspots = [
    { x: '20', y: 30, label: 'A', description: 'First' },
    { x: 20, y: Number.NaN, label: 'A', description: 'First' },
    { x: 20, y: 30, label: 'A' },
  ]

  assert.equal(isImageAnnotationHotspot(validHotspot), true)
  assert.equal(isImageAnnotationHotspot(invalidHotspots[0]), false)
  assert.deepEqual(getValidImageAnnotationHotspots([validHotspot, ...invalidHotspots]), [validHotspot])
  assert.deepEqual(parseImageAnnotationHotspots(JSON.stringify({ x: 20, y: 30 })), [])
})

test('image annotation hotspot helpers keep keys and absolute positioning stable', () => {
  const hotspot = { x: 42, y: 64, label: 'Flow' }

  assert.equal(getImageAnnotationHotspotKey(hotspot), '42-64-Flow')
  assert.deepEqual(getImageAnnotationHotspotPositionStyle(hotspot), {
    left: '42%',
    top: '64%',
    transform: 'translate(-50%, -50%)',
  })
})

test('image annotation active index helper opens, closes, and switches hotspots', () => {
  assert.equal(getNextImageAnnotationActiveIndex(null, 2), 2)
  assert.equal(getNextImageAnnotationActiveIndex(2, 2), null)
  assert.equal(getNextImageAnnotationActiveIndex(1, 2), 2)
})

test('getImageAnnotationTooltipPlacement preserves alignment thresholds', () => {
  assert.equal(getImageAnnotationTooltipPlacement(20), 'left')
  assert.equal(getImageAnnotationTooltipPlacement(35), 'left')
  assert.equal(getImageAnnotationTooltipPlacement(36), 'center')
  assert.equal(getImageAnnotationTooltipPlacement(65), 'center')
  assert.equal(getImageAnnotationTooltipPlacement(66), 'right')
})

test('getImageAnnotationTooltipStyle maps alignment to tooltip offsets', () => {
  assert.deepEqual(getImageAnnotationTooltipStyle(20), { top: '100%', left: '-8px' })
  assert.deepEqual(getImageAnnotationTooltipStyle(50), {
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
  })
  assert.deepEqual(getImageAnnotationTooltipStyle(80), { top: '100%', right: '-8px' })
})
