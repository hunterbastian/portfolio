import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  RESUME_PREVIEW_ANCHOR_OFFSET_Y,
  RESUME_PREVIEW_FOOTER_TEXT,
  RESUME_PREVIEW_HEADER,
  RESUME_PREVIEW_MOTION,
  RESUME_PREVIEW_PLACEHOLDER_SECTIONS,
  RESUME_PREVIEW_RESIZE_EVENT,
  RESUME_PREVIEW_SCROLL_EVENT,
  RESUME_PREVIEW_SCROLL_LISTENER_OPTIONS,
  RESUME_PREVIEW_SCROLL_REMOVE_OPTIONS,
  RESUME_PREVIEW_TRANSITION,
  RESUME_PREVIEW_WIDTH,
  activateResumePreviewPositionTracking,
  getResumePreviewActivePosition,
  getResumePreviewPosition,
  getResumePreviewRenderMode,
  updateResumePreviewPosition,
} from './resume-preview.ts'

test('getResumePreviewPosition centers under the anchor when there is room', () => {
  assert.deepEqual(
    getResumePreviewPosition({
      anchorRect: { bottom: 100, left: 200, width: 80 },
      viewportWidth: 800,
    }),
    { left: 240, top: 100 + RESUME_PREVIEW_ANCHOR_OFFSET_Y },
  )
})

test('getResumePreviewPosition clamps against viewport padding', () => {
  assert.equal(
    getResumePreviewPosition({
      anchorRect: { bottom: 100, left: 0, width: 20 },
      viewportWidth: 800,
    }).left,
    12 + RESUME_PREVIEW_WIDTH / 2,
  )
  assert.equal(
    getResumePreviewPosition({
      anchorRect: { bottom: 100, left: 790, width: 20 },
      viewportWidth: 800,
    }).left,
    800 - 12 - RESUME_PREVIEW_WIDTH / 2,
  )
})

test('getResumePreviewActivePosition prefers a fresh anchor rect before stored fallback', () => {
  assert.deepEqual(
    getResumePreviewActivePosition({
      anchorRect: { bottom: 100, left: 200, width: 80 },
      fallbackPosition: { left: 10, top: 20 },
      viewportWidth: 800,
    }),
    { left: 240, top: 100 + RESUME_PREVIEW_ANCHOR_OFFSET_Y },
  )
  assert.deepEqual(
    getResumePreviewActivePosition({
      anchorRect: null,
      fallbackPosition: { left: 10, top: 20 },
      viewportWidth: 800,
    }),
    { left: 10, top: 20 },
  )
})

test('updateResumePreviewPosition stores a clamped position only when an anchor exists', () => {
  const calls: unknown[] = []

  assert.equal(
    updateResumePreviewPosition({
      getAnchorRect: () => null,
      setPosition: (position) => calls.push(position),
      viewportWidth: 800,
    }),
    false,
  )
  assert.deepEqual(calls, [])

  assert.equal(
    updateResumePreviewPosition({
      getAnchorRect: () => ({ bottom: 100, left: 200, width: 80 }),
      setPosition: (position) => calls.push(position),
      viewportWidth: 800,
    }),
    true,
  )
  assert.deepEqual(calls, [{ left: 240, top: 100 + RESUME_PREVIEW_ANCHOR_OFFSET_Y }])
})

test('activateResumePreviewPositionTracking skips hidden and missing-anchor states', () => {
  const calls: unknown[] = []

  assert.equal(
    activateResumePreviewPositionTracking({
      addEventListener: (type) => calls.push(['add', type]),
      getAnchorRect: () => ({ bottom: 100, left: 200, width: 80 }),
      getViewportWidth: () => 800,
      isVisible: false,
      removeEventListener: (type) => calls.push(['remove', type]),
      setPosition: (position) => calls.push(['position', position]),
    }),
    undefined,
  )

  assert.equal(
    activateResumePreviewPositionTracking({
      addEventListener: (type) => calls.push(['add', type]),
      getAnchorRect: () => null,
      getViewportWidth: () => 800,
      isVisible: true,
      removeEventListener: (type) => calls.push(['remove', type]),
      setPosition: (position) => calls.push(['position', position]),
    }),
    undefined,
  )

  assert.deepEqual(calls, [])
})

test('activateResumePreviewPositionTracking registers listeners and cleans them up', () => {
  const calls: unknown[] = []
  let resizeListener: (() => void) | null = null
  let scrollListener: (() => void) | null = null
  let viewportWidth = 800
  let anchorLeft = 200

  const cleanup = activateResumePreviewPositionTracking({
    addEventListener: (type, listener, options) => {
      calls.push(['add', type, options])
      if (type === 'resize') resizeListener = listener
      if (type === 'scroll') scrollListener = listener
    },
    getAnchorRect: () => ({ bottom: 100, left: anchorLeft, width: 80 }),
    getViewportWidth: () => viewportWidth,
    isVisible: true,
    removeEventListener: (type, listener, options) => {
      calls.push(['remove', type, listener === resizeListener || listener === scrollListener, options])
    },
    setPosition: (position) => calls.push(['position', position]),
  })

  assert.equal(typeof cleanup, 'function')
  viewportWidth = 600
  anchorLeft = 500
  resizeListener?.()
  scrollListener?.()
  cleanup?.()

  assert.deepEqual(calls, [
    ['position', { left: 240, top: 100 + RESUME_PREVIEW_ANCHOR_OFFSET_Y }],
    ['add', RESUME_PREVIEW_RESIZE_EVENT, undefined],
    ['add', RESUME_PREVIEW_SCROLL_EVENT, RESUME_PREVIEW_SCROLL_LISTENER_OPTIONS],
    ['position', { left: 600 - 12 - RESUME_PREVIEW_WIDTH / 2, top: 100 + RESUME_PREVIEW_ANCHOR_OFFSET_Y }],
    ['position', { left: 600 - 12 - RESUME_PREVIEW_WIDTH / 2, top: 100 + RESUME_PREVIEW_ANCHOR_OFFSET_Y }],
    ['remove', RESUME_PREVIEW_RESIZE_EVENT, true, undefined],
    ['remove', RESUME_PREVIEW_SCROLL_EVENT, true, RESUME_PREVIEW_SCROLL_REMOVE_OPTIONS],
  ])
})

test('getResumePreviewRenderMode uses a portal only after mount with an anchor', () => {
  assert.equal(getResumePreviewRenderMode({ mounted: false, hasAnchor: false }), 'inline')
  assert.equal(getResumePreviewRenderMode({ mounted: false, hasAnchor: true }), 'inline')
  assert.equal(getResumePreviewRenderMode({ mounted: true, hasAnchor: false }), 'inline')
  assert.equal(getResumePreviewRenderMode({ mounted: true, hasAnchor: true }), 'portal')
})

test('resume preview motion constants preserve hover storyboard timing', () => {
  assert.deepEqual(RESUME_PREVIEW_MOTION.initial, { opacity: 0, y: -7, scale: 0.96 })
  assert.deepEqual(RESUME_PREVIEW_MOTION.animate, { opacity: 1, y: 0, scale: 1 })
  assert.deepEqual(RESUME_PREVIEW_MOTION.exit, { opacity: 0, y: -5, scale: 0.98 })
  assert.equal(RESUME_PREVIEW_TRANSITION.y.type, 'spring')
  assert.equal(RESUME_PREVIEW_TRANSITION.y.stiffness, 320)
  assert.deepEqual(RESUME_PREVIEW_TRANSITION.opacity.ease, [0.22, 1, 0.36, 1])
})

test('resume preview placeholder content keeps the mini resume scaffold stable', () => {
  assert.deepEqual(RESUME_PREVIEW_HEADER, {
    name: 'Hunter Bastian',
    subtitle: 'Resume Preview',
  })
  assert.equal(RESUME_PREVIEW_FOOTER_TEXT, 'Click to view full resume')
  assert.equal(RESUME_PREVIEW_PLACEHOLDER_SECTIONS.length, 5)
  assert.deepEqual(
    RESUME_PREVIEW_PLACEHOLDER_SECTIONS[2]?.skillChips?.map((chip) => chip.label),
    ['JS', 'React', 'TS'],
  )
  assert.deepEqual(RESUME_PREVIEW_PLACEHOLDER_SECTIONS.at(-1)?.lineClassNames, ['h-0.5 w-2/3 bg-gray-300'])
})
