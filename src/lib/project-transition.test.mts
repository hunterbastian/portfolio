import assert from 'node:assert/strict'
import test from 'node:test'

import {
  activateProjectTransitionOverlayCompletion,
  activateProjectTransitionOverlayTarget,
  clearProjectTransition,
  clearProjectTransitionForPath,
  getProjectTransition,
  getProjectTransitionOverlayAnimateFrame,
  getProjectTransitionOverlayBorderRadius,
  getProjectTransitionOverlayCompletionAction,
  getProjectTransitionOverlayDuration,
  getProjectTransitionOverlayInitialFrame,
  getProjectTransitionOverlayOpacity,
  getProjectTransitionOverlayRect,
  markProjectTransitionCompleting,
  PROJECT_TRANSITION_CLEAR_DELAY_MS,
  PROJECT_TRANSITION_FADE_DURATION,
  PROJECT_TRANSITION_FLY_DURATION,
  PROJECT_TRANSITION_HOLD_RADIUS,
  PROJECT_TRANSITION_HOLD_TIMEOUT_MS,
  PROJECT_TRANSITION_OVERLAY_IMAGE_CLASS_NAME,
  PROJECT_TRANSITION_OVERLAY_IMAGE_QUALITY,
  PROJECT_TRANSITION_OVERLAY_IMAGE_SIZES,
  PROJECT_TRANSITION_OVERLAY_ROOT_CLASS_NAME,
  PROJECT_TRANSITION_TARGET_RADIUS,
  resetProjectTransitionOverlayPhase,
  scheduleProjectTransitionHoldFallback,
  setProjectTransitionTarget,
  shouldClearProjectTransitionForPath,
  startProjectTransition,
  subscribeProjectTransition,
  type ProjectTransitionState,
  type TransitionRect,
} from './project-transition.ts'

const sourceRect: TransitionRect = { top: 10, left: 20, width: 300, height: 180 }
const targetRect: TransitionRect = { top: 40, left: 60, width: 720, height: 420 }

function transition(overrides: Partial<ProjectTransitionState> = {}): ProjectTransitionState {
  return {
    id: 1,
    slug: 'lumo',
    imageSrc: '/images/lumo.webp',
    sourceRect,
    targetRect: null,
    completing: false,
    ...overrides,
  }
}

test('project transition store emits each transition stage', () => {
  clearProjectTransition()
  const snapshots: Array<ProjectTransitionState | null> = []
  const unsubscribe = subscribeProjectTransition(() => {
    snapshots.push(getProjectTransition())
  })

  startProjectTransition('lumo', '/images/lumo.webp', sourceRect)
  setProjectTransitionTarget(targetRect)
  markProjectTransitionCompleting()
  clearProjectTransition()
  unsubscribe()

  assert.equal(snapshots.length, 4)
  assert.equal(snapshots[0]?.slug, 'lumo')
  assert.deepEqual(snapshots[0]?.targetRect, null)
  assert.deepEqual(snapshots[1]?.targetRect, targetRect)
  assert.equal(snapshots[2]?.completing, true)
  assert.equal(snapshots[3], null)
})

test('overlay helpers preserve phase timing, radius, and opacity', () => {
  assert.equal(getProjectTransitionOverlayDuration('hold'), 0)
  assert.equal(getProjectTransitionOverlayDuration('fly'), PROJECT_TRANSITION_FLY_DURATION)
  assert.equal(getProjectTransitionOverlayDuration('fade'), PROJECT_TRANSITION_FADE_DURATION)
  assert.equal(getProjectTransitionOverlayBorderRadius('hold'), PROJECT_TRANSITION_HOLD_RADIUS)
  assert.equal(getProjectTransitionOverlayBorderRadius('fly'), PROJECT_TRANSITION_TARGET_RADIUS)
  assert.equal(getProjectTransitionOverlayOpacity('hold'), 1)
  assert.equal(getProjectTransitionOverlayOpacity('fade'), 0)
  assert.equal(PROJECT_TRANSITION_HOLD_TIMEOUT_MS, 2000)
  assert.equal(PROJECT_TRANSITION_CLEAR_DELAY_MS, 300)
})

test('overlay chrome constants preserve fixed layer and image loading contracts', () => {
  assert.match(PROJECT_TRANSITION_OVERLAY_ROOT_CLASS_NAME, /pointer-events-none/)
  assert.match(PROJECT_TRANSITION_OVERLAY_ROOT_CLASS_NAME, /z-\[100\]/)
  assert.match(PROJECT_TRANSITION_OVERLAY_ROOT_CLASS_NAME, /will-change-\[top,left,width,height\]/)
  assert.equal(PROJECT_TRANSITION_OVERLAY_IMAGE_CLASS_NAME, 'object-cover')
  assert.equal(PROJECT_TRANSITION_OVERLAY_IMAGE_SIZES, '(max-width: 640px) 100vw, 560px')
  assert.equal(PROJECT_TRANSITION_OVERLAY_IMAGE_QUALITY, 90)
})

test('overlay rect helper uses source until a target-backed phase can fly', () => {
  assert.deepEqual(getProjectTransitionOverlayRect('hold', transition({ targetRect })), sourceRect)
  assert.deepEqual(getProjectTransitionOverlayRect('fly', transition()), sourceRect)
  assert.deepEqual(getProjectTransitionOverlayRect('fly', transition({ targetRect })), targetRect)
  assert.deepEqual(getProjectTransitionOverlayRect('fade', transition({ targetRect })), targetRect)
})

test('overlay frame helpers build Framer-compatible frame objects', () => {
  assert.deepEqual(getProjectTransitionOverlayInitialFrame(transition({ targetRect })), {
    ...sourceRect,
    borderRadius: PROJECT_TRANSITION_HOLD_RADIUS,
    opacity: 1,
  })
  assert.deepEqual(getProjectTransitionOverlayAnimateFrame('fly', transition({ targetRect })), {
    ...targetRect,
    borderRadius: PROJECT_TRANSITION_TARGET_RADIUS,
    opacity: 1,
  })
  assert.deepEqual(getProjectTransitionOverlayAnimateFrame('fade', transition({ targetRect })), {
    ...targetRect,
    borderRadius: PROJECT_TRANSITION_TARGET_RADIUS,
    opacity: 0,
  })
})

test('overlay completion helper maps animation phases to component side effects', () => {
  assert.equal(getProjectTransitionOverlayCompletionAction('hold'), null)
  assert.equal(getProjectTransitionOverlayCompletionAction('fly'), 'fade')
  assert.equal(getProjectTransitionOverlayCompletionAction('fade'), 'clear')
})

test('project transition overlay reset and target helpers preserve phase transitions', () => {
  const calls: unknown[] = []
  const setPhase = (phase: ProjectTransitionOverlayPhase) => calls.push(['phase', phase])
  const clearTransition = () => calls.push(['clear'])
  const markCompleting = () => calls.push(['complete'])

  resetProjectTransitionOverlayPhase({ setPhase, transition: transition() })
  resetProjectTransitionOverlayPhase({ setPhase, transition: transition({ targetRect }) })

  activateProjectTransitionOverlayTarget({
    clearTransition,
    markCompleting,
    phase: 'hold',
    prefersReducedMotion: false,
    setPhase,
    transition: transition({ targetRect }),
  })
  activateProjectTransitionOverlayTarget({
    clearTransition,
    markCompleting,
    phase: 'hold',
    prefersReducedMotion: true,
    setPhase,
    transition: transition({ targetRect }),
  })

  assert.deepEqual(calls, [
    ['phase', 'hold'],
    ['phase', 'fly'],
    ['complete'],
    ['clear'],
  ])
})

test('project transition hold fallback schedules completion and delayed cleanup', () => {
  const calls: unknown[] = []
  const scheduled: Array<() => void> = []
  let nextTimer = 1

  assert.deepEqual(
    scheduleProjectTransitionHoldFallback({
      clearTransition: () => calls.push(['clear']),
      markCompleting: () => calls.push(['complete']),
      phase: 'fly',
      schedule: () => nextTimer++,
      transition: transition(),
    }),
    [],
  )

  const timers = scheduleProjectTransitionHoldFallback({
    clearTransition: () => calls.push(['clear']),
    markCompleting: () => calls.push(['complete']),
    phase: 'hold',
    schedule: (delay, callback) => {
      calls.push(['schedule', delay])
      scheduled.push(callback)
      return nextTimer++
    },
    transition: transition(),
  })

  assert.deepEqual(timers, [1])
  scheduled[0]?.()

  assert.deepEqual(calls, [
    ['schedule', PROJECT_TRANSITION_HOLD_TIMEOUT_MS],
    ['complete'],
    ['schedule', PROJECT_TRANSITION_CLEAR_DELAY_MS],
  ])
  assert.deepEqual(timers, [1, 2])

  scheduled[1]?.()
  assert.deepEqual(calls.at(-1), ['clear'])
})

test('project transition path and completion activators delegate side effects', () => {
  const calls: unknown[] = []
  const setPhase = (phase: ProjectTransitionOverlayPhase) => calls.push(['phase', phase])
  const clearTransition = () => calls.push(['clear'])
  const markCompleting = () => calls.push(['complete'])

  clearProjectTransitionForPath({
    clearTransition,
    pathname: '/projects/lumo',
    transition: transition(),
  })
  clearProjectTransitionForPath({
    clearTransition,
    pathname: '/archive',
    transition: transition(),
  })
  activateProjectTransitionOverlayCompletion({
    clearTransition,
    markCompleting,
    phase: 'fly',
    setPhase,
  })
  activateProjectTransitionOverlayCompletion({
    clearTransition,
    markCompleting,
    phase: 'fade',
    setPhase,
  })

  assert.deepEqual(calls, [
    ['clear'],
    ['complete'],
    ['phase', 'fade'],
    ['clear'],
  ])
})

test('path helper mirrors project detail route clearing behavior', () => {
  const state = transition({ slug: 'lumo' })

  assert.equal(shouldClearProjectTransitionForPath('/projects/lumo', state), false)
  assert.equal(shouldClearProjectTransitionForPath('/projects/lumo/details', state), false)
  assert.equal(shouldClearProjectTransitionForPath('/projects/other', state), true)
  assert.equal(shouldClearProjectTransitionForPath('/archive', state), true)
})
