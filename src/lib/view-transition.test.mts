import assert from 'node:assert/strict'
import test from 'node:test'

import {
  PROJECT_MORPH_IMAGE_WAIT_MS,
  PROJECT_MORPH_NAME,
  PROJECT_MORPH_TARGET_WAIT_MS,
  PROJECT_MORPH_TARGET_ATTRIBUTE,
  getProjectMorphName,
  getProjectMorphProps,
  getProjectMorphServerSnapshot,
  getProjectMorphSlug,
  isModifiedNavigation,
  isMorphTargetInView,
  setProjectMorphSlug,
  shouldMorphNavigation,
  shouldSettleMorph,
  subscribeProjectMorph,
} from './view-transition.ts'

const plainClick = { altKey: false, button: 0, ctrlKey: false, metaKey: false, shiftKey: false }

test('morph slug store notifies subscribers and collapses repeat writes', () => {
  const snapshots: (string | null)[] = []
  const unsubscribe = subscribeProjectMorph(() => snapshots.push(getProjectMorphSlug()))

  setProjectMorphSlug('lumo')
  setProjectMorphSlug('lumo')
  setProjectMorphSlug(null)
  unsubscribe()
  setProjectMorphSlug('ignored-after-unsubscribe')

  assert.deepEqual(snapshots, ['lumo', null])

  setProjectMorphSlug(null)
})

test('server render never claims a morph so the name only appears on the client', () => {
  setProjectMorphSlug('lumo')

  assert.equal(getProjectMorphServerSnapshot(), null)

  setProjectMorphSlug(null)
})

test('only the active slug takes the shared name so the document stays unique', () => {
  assert.equal(getProjectMorphName('lumo', 'lumo'), PROJECT_MORPH_NAME)
  assert.equal(getProjectMorphName('lumo', 'middle-earth-journey'), undefined)
  assert.equal(getProjectMorphName('lumo', null), undefined)
})

test('morph props carry both the name and the lookup hook, or nothing at all', () => {
  assert.deepEqual(getProjectMorphProps('lumo', 'lumo'), {
    [PROJECT_MORPH_TARGET_ATTRIBUTE]: 'true',
    style: { viewTransitionName: PROJECT_MORPH_NAME },
  })
  assert.deepEqual(getProjectMorphProps('lumo', null), {})
})

test('new-tab and middle-click navigations keep the browser default', () => {
  assert.equal(isModifiedNavigation(plainClick), false)
  assert.equal(isModifiedNavigation({ ...plainClick, metaKey: true }), true)
  assert.equal(isModifiedNavigation({ ...plainClick, ctrlKey: true }), true)
  assert.equal(isModifiedNavigation({ ...plainClick, shiftKey: true }), true)
  assert.equal(isModifiedNavigation({ ...plainClick, altKey: true }), true)
  assert.equal(isModifiedNavigation({ ...plainClick, button: 1 }), true)
})

test('the morph waits generously for its destination and briefly for its photo', () => {
  // Nothing found yet: keep waiting, right up to the overall budget.
  assert.equal(
    shouldSettleMorph({ imageReady: false, msSinceStart: 400, msSinceTargetFound: null }),
    false,
  )
  assert.equal(
    shouldSettleMorph({ imageReady: false, msSinceStart: PROJECT_MORPH_TARGET_WAIT_MS, msSinceTargetFound: null }),
    true,
  )

  // Found with its photo ready: go immediately rather than sitting on the budget.
  assert.equal(
    shouldSettleMorph({ imageReady: true, msSinceStart: 20, msSinceTargetFound: 0 }),
    true,
  )

  // Found but the photo is still loading: a short grace period, then go anyway
  // and let the outgoing snapshot cover it.
  assert.equal(
    shouldSettleMorph({ imageReady: false, msSinceStart: 60, msSinceTargetFound: 40 }),
    false,
  )
  assert.equal(
    shouldSettleMorph({
      imageReady: false,
      msSinceStart: 60,
      msSinceTargetFound: PROJECT_MORPH_IMAGE_WAIT_MS,
    }),
    true,
  )
})

test('a destination below the fold is scrolled to, one already on screen is not', () => {
  const viewportHeight = 900

  // The detail hero after a push to the top of the page.
  assert.equal(isMorphTargetInView({ top: 180, bottom: 700, viewportHeight }), true)
  // A collage card further down an index that just scrolled to the top.
  assert.equal(isMorphTargetInView({ top: 1200, bottom: 1480, viewportHeight }), false)
  // Scrolled past, above the viewport.
  assert.equal(isMorphTargetInView({ top: -400, bottom: -120, viewportHeight }), false)
  // A sliver past the bottom edge is not somewhere the photo should land.
  assert.equal(isMorphTargetInView({ top: 820, bottom: 1100, viewportHeight }), false)
  // Flush against each edge still counts.
  assert.equal(isMorphTargetInView({ top: 0, bottom: viewportHeight, viewportHeight }), true)
  // Taller than the window: covering it is the best available landing.
  assert.equal(isMorphTargetInView({ top: -200, bottom: 1400, viewportHeight }), true)
  assert.equal(isMorphTargetInView({ top: 400, bottom: 2000, viewportHeight }), false)
})

test('morphing needs support, motion consent, and an unmodified click', () => {
  const base = { modifiers: plainClick, prefersReducedMotion: false, supportsViewTransitions: true }

  assert.equal(shouldMorphNavigation(base), true)
  assert.equal(shouldMorphNavigation({ ...base, supportsViewTransitions: false }), false)
  assert.equal(shouldMorphNavigation({ ...base, prefersReducedMotion: true }), false)
  assert.equal(shouldMorphNavigation({ ...base, modifiers: { ...plainClick, metaKey: true } }), false)
})
