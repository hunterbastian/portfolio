import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  CHILD_ENTRANCE_INITIAL_Y,
  PAGE_TRANSITION_STAGE,
  getInitialRouteSceneStage,
  PAGE_ENTRANCE_INITIAL_Y,
  getPageTransitionYOffset,
  getRouteSceneChildDelay,
  getRouteSceneDefaults,
  getRouteSceneInitial,
  getRouteSceneMotion,
  getRouteSceneStageSchedule,
  scheduleRouteSceneStages,
} from './page-transition.ts'

test('getPageTransitionYOffset combines page and child entrance offsets', () => {
  assert.equal(getPageTransitionYOffset(), PAGE_ENTRANCE_INITIAL_Y + CHILD_ENTRANCE_INITIAL_Y)
})

test('getRouteSceneInitial skips initial animation on first load', () => {
  assert.equal(getRouteSceneInitial(true, 6), false)
  assert.deepEqual(getRouteSceneInitial(false, 6), { opacity: 0, y: 6 })
})

test('route scene defaults package timing and offsets for the component', () => {
  assert.deepEqual(getRouteSceneDefaults(), {
    offsets: {
      pageY: 6,
      childY: 4,
    },
    timing: {
      newContentDelay: 24,
      newSlideDuration: 220,
      childStartDelay: 20,
      childStagger: 0,
      childDuration: 200,
    },
  })
})

test('initial route scene stage keeps first load visible from SSR', () => {
  assert.equal(getInitialRouteSceneStage(true), PAGE_TRANSITION_STAGE.children)
  assert.equal(getInitialRouteSceneStage(false), PAGE_TRANSITION_STAGE.hidden)
})

test('route scene stage schedule preserves initial, reduced, and staged flows', () => {
  assert.deepEqual(
    getRouteSceneStageSchedule({
      isInitialLoad: true,
      prefersReducedMotion: false,
      timing: { childStartDelay: 20, newContentDelay: 24 },
    }),
    { kind: 'preserve' },
  )
  assert.deepEqual(
    getRouteSceneStageSchedule({
      isInitialLoad: false,
      prefersReducedMotion: true,
      timing: { childStartDelay: 20, newContentDelay: 24 },
    }),
    { kind: 'immediate', stage: PAGE_TRANSITION_STAGE.children },
  )
  assert.deepEqual(
    getRouteSceneStageSchedule({
      isInitialLoad: false,
      prefersReducedMotion: false,
      timing: { childStartDelay: 20, newContentDelay: 24 },
    }),
    { kind: 'staged', pageDelay: 24, childrenDelay: 44 },
  )
})

test('scheduleRouteSceneStages wires route scene schedules into stage updates and timers', () => {
  const preservedCalls: unknown[] = []
  const preservedTimers = scheduleRouteSceneStages({
    isInitialLoad: true,
    prefersReducedMotion: false,
    scheduleStage: (stage, delay) => {
      preservedCalls.push(['schedule', stage, delay])
      return `${stage}:${delay}`
    },
    setStage: (stage) => preservedCalls.push(['set', stage]),
    timing: { childStartDelay: 20, newContentDelay: 24 },
  })

  assert.deepEqual(preservedCalls, [])
  assert.deepEqual(preservedTimers, [])

  const immediateCalls: unknown[] = []
  const immediateTimers = scheduleRouteSceneStages({
    isInitialLoad: false,
    prefersReducedMotion: true,
    scheduleStage: (stage, delay) => {
      immediateCalls.push(['schedule', stage, delay])
      return `${stage}:${delay}`
    },
    setStage: (stage) => immediateCalls.push(['set', stage]),
    timing: { childStartDelay: 20, newContentDelay: 24 },
  })

  assert.deepEqual(immediateCalls, [['set', PAGE_TRANSITION_STAGE.children]])
  assert.deepEqual(immediateTimers, [])

  const stagedCalls: unknown[] = []
  const stagedTimers = scheduleRouteSceneStages({
    isInitialLoad: false,
    prefersReducedMotion: false,
    scheduleStage: (stage, delay) => {
      stagedCalls.push(['schedule', stage, delay])
      return `${stage}:${delay}`
    },
    setStage: (stage) => stagedCalls.push(['set', stage]),
    timing: { childStartDelay: 20, newContentDelay: 24 },
  })

  assert.deepEqual(stagedCalls, [
    ['set', PAGE_TRANSITION_STAGE.hidden],
    ['schedule', PAGE_TRANSITION_STAGE.page, 24],
    ['schedule', PAGE_TRANSITION_STAGE.children, 44],
  ])
  assert.deepEqual(stagedTimers, [
    `${PAGE_TRANSITION_STAGE.page}:24`,
    `${PAGE_TRANSITION_STAGE.children}:44`,
  ])
})

test('getRouteSceneMotion maps staged visibility to opacity and y', () => {
  assert.deepEqual(getRouteSceneMotion(PAGE_TRANSITION_STAGE.hidden, PAGE_TRANSITION_STAGE.page, 6), { opacity: 0, y: 6 })
  assert.deepEqual(getRouteSceneMotion(PAGE_TRANSITION_STAGE.page, PAGE_TRANSITION_STAGE.page, 6), { opacity: 1, y: 0 })
})

test('route scene child delay waits for the children stage and respects reduced motion', () => {
  assert.equal(
    getRouteSceneChildDelay({
      index: 3,
      prefersReducedMotion: false,
      stage: PAGE_TRANSITION_STAGE.page,
      stagger: 80,
    }),
    0,
  )
  assert.equal(
    getRouteSceneChildDelay({
      index: 3,
      prefersReducedMotion: false,
      stage: PAGE_TRANSITION_STAGE.children,
      stagger: 80,
    }),
    240,
  )
  assert.equal(
    getRouteSceneChildDelay({
      index: 3,
      prefersReducedMotion: true,
      stage: PAGE_TRANSITION_STAGE.children,
      stagger: 80,
    }),
    0,
  )
})
