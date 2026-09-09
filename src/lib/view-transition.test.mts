import assert from 'node:assert/strict'
import test from 'node:test'

import {
  PROJECT_MORPH_NAME,
  PROJECT_MORPH_TARGET_ATTRIBUTE,
  getProjectMorphName,
  getProjectMorphProps,
  getProjectMorphServerSnapshot,
  getProjectMorphSlug,
  isModifiedNavigation,
  setProjectMorphSlug,
  shouldMorphNavigation,
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

test('morphing needs support, motion consent, and an unmodified click', () => {
  const base = { modifiers: plainClick, prefersReducedMotion: false, supportsViewTransitions: true }

  assert.equal(shouldMorphNavigation(base), true)
  assert.equal(shouldMorphNavigation({ ...base, supportsViewTransitions: false }), false)
  assert.equal(shouldMorphNavigation({ ...base, prefersReducedMotion: true }), false)
  assert.equal(shouldMorphNavigation({ ...base, modifiers: { ...plainClick, metaKey: true } }), false)
})
