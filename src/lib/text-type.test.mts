import assert from 'node:assert/strict'
import test from 'node:test'

import {
  TEXT_TYPE_CURSOR_COMPLETION_BLINK_INTERVAL_MS,
  TEXT_TYPE_CURSOR_IDLE_BLINK_INTERVAL_MS,
  TEXT_TYPE_DEFAULT_COMPLETION_BLINKS,
  TEXT_TYPE_DEFAULT_CURSOR_CHARACTER,
  TEXT_TYPE_DEFAULT_DELETING_SPEED,
  TEXT_TYPE_DEFAULT_PAUSE_DURATION,
  TEXT_TYPE_DEFAULT_TYPING_SPEED,
  activateTextTypeCursorEffectAction,
  activateTextTypeEffectAction,
  clearTextTypeCursorTimer,
  getTextTypeEffectAction,
  getTextTypeClassName,
  getTextTypeCursorClassName,
  getTextTypeCursorEffectAction,
  getTextTypeCursorStyle,
  getNextTextTypeIndex,
  getNextTextTypeSlice,
  getTextTypeStepSpeed,
  isTextTypeComplete,
  normalizeTextTypeEntries,
  shouldRenderTextTypeCursor,
} from './text-type.ts'

test('text type defaults preserve typing and cursor timing', () => {
  assert.equal(TEXT_TYPE_DEFAULT_TYPING_SPEED, 65)
  assert.equal(TEXT_TYPE_DEFAULT_DELETING_SPEED, 40)
  assert.equal(TEXT_TYPE_DEFAULT_PAUSE_DURATION, 1500)
  assert.equal(TEXT_TYPE_DEFAULT_CURSOR_CHARACTER, '|')
  assert.equal(TEXT_TYPE_DEFAULT_COMPLETION_BLINKS, 2)
  assert.equal(TEXT_TYPE_CURSOR_COMPLETION_BLINK_INTERVAL_MS, 220)
  assert.equal(TEXT_TYPE_CURSOR_IDLE_BLINK_INTERVAL_MS, 530)
})

test('normalizeTextTypeEntries keeps single and rotating copy in array form', () => {
  assert.deepEqual(normalizeTextTypeEntries('Hello'), ['Hello'])
  assert.deepEqual(normalizeTextTypeEntries(['Hello', 'World']), ['Hello', 'World'])
})

test('isTextTypeComplete only resolves for final non-looping settled text', () => {
  const texts = ['One', 'Two']

  assert.equal(
    isTextTypeComplete({
      currentTextIndex: 1,
      displayText: 'Two',
      isDeleting: false,
      loop: false,
      texts,
    }),
    true,
  )
  assert.equal(
    isTextTypeComplete({
      currentTextIndex: 1,
      displayText: 'Two',
      isDeleting: false,
      loop: true,
      texts,
    }),
    false,
  )
  assert.equal(
    isTextTypeComplete({
      currentTextIndex: 0,
      displayText: 'One',
      isDeleting: false,
      loop: false,
      texts,
    }),
    false,
  )
})

test('text type index and slice helpers preserve typing and deleting steps', () => {
  assert.equal(getNextTextTypeIndex(0, 3), 1)
  assert.equal(getNextTextTypeIndex(2, 3), 0)
  assert.equal(getNextTextTypeIndex(0, 0), 0)
  assert.equal(getNextTextTypeSlice('Hello', 2, false), 'Hel')
  assert.equal(getNextTextTypeSlice('Hello', 2, true), 'H')
})

test('getTextTypeStepSpeed leaves non-cinematic and deleting speeds unchanged', () => {
  assert.equal(
    getTextTypeStepSpeed({
      baseSpeed: 65,
      cinematic: false,
      currentText: 'Hello',
      currentTextIndex: 0,
      displayTextLength: 0,
      isDeleting: false,
      nextLength: 1,
    }),
    65,
  )
  assert.equal(
    getTextTypeStepSpeed({
      baseSpeed: 40,
      cinematic: true,
      currentText: 'Hello',
      currentTextIndex: 0,
      displayTextLength: 3,
      isDeleting: true,
      nextLength: 2,
    }),
    40,
  )
})

test('getTextTypeStepSpeed applies cinematic punctuation, newline, initial, and jitter timing', () => {
  assert.equal(
    getTextTypeStepSpeed({
      baseSpeed: 65,
      cinematic: true,
      currentText: 'Hello.',
      currentTextIndex: 0,
      displayTextLength: 5,
      isDeleting: false,
      nextLength: 6,
      random: () => 0.5,
    }),
    146,
  )
  assert.equal(
    getTextTypeStepSpeed({
      baseSpeed: 65,
      cinematic: true,
      currentText: '\n',
      currentTextIndex: 0,
      displayTextLength: 0,
      isDeleting: false,
      nextLength: 1,
      random: () => 0,
    }),
    467,
  )
})

test('getTextTypeEffectAction resolves empty and reduced-motion states', () => {
  assert.deepEqual(
    getTextTypeEffectAction({
      cinematic: false,
      currentTextIndex: 0,
      deletingSpeed: 40,
      displayText: '',
      isDeleting: false,
      loop: true,
      pauseDuration: 1500,
      reduceMotion: false,
      texts: [],
      typingSpeed: 65,
    }),
    { kind: 'none' },
  )
  assert.deepEqual(
    getTextTypeEffectAction({
      cinematic: false,
      currentTextIndex: 1,
      deletingSpeed: 40,
      displayText: '',
      isDeleting: false,
      loop: true,
      pauseDuration: 1500,
      reduceMotion: true,
      texts: ['One', 'Two'],
      typingSpeed: 65,
    }),
    { kind: 'set-display', text: 'One' },
  )
})

test('getTextTypeEffectAction preserves pause, final, and index-advance decisions', () => {
  assert.deepEqual(
    getTextTypeEffectAction({
      cinematic: false,
      currentTextIndex: 0,
      deletingSpeed: 40,
      displayText: 'One',
      isDeleting: false,
      loop: true,
      pauseDuration: 1500,
      reduceMotion: false,
      texts: ['One', 'Two'],
      typingSpeed: 65,
    }),
    { kind: 'start-deleting-after-pause', delay: 1500 },
  )
  assert.deepEqual(
    getTextTypeEffectAction({
      cinematic: false,
      currentTextIndex: 1,
      deletingSpeed: 40,
      displayText: 'Two',
      isDeleting: false,
      loop: false,
      pauseDuration: 1500,
      reduceMotion: false,
      texts: ['One', 'Two'],
      typingSpeed: 65,
    }),
    { kind: 'none' },
  )
  assert.deepEqual(
    getTextTypeEffectAction({
      cinematic: false,
      currentTextIndex: 1,
      deletingSpeed: 40,
      displayText: '',
      isDeleting: true,
      loop: true,
      pauseDuration: 1500,
      reduceMotion: false,
      texts: ['One', 'Two'],
      typingSpeed: 65,
    }),
    { kind: 'advance-index', nextIndex: 0 },
  )
})

test('getTextTypeEffectAction packages typing and deleting step text with delays', () => {
  assert.deepEqual(
    getTextTypeEffectAction({
      cinematic: false,
      currentTextIndex: 0,
      deletingSpeed: 40,
      displayText: 'He',
      isDeleting: false,
      loop: true,
      pauseDuration: 1500,
      reduceMotion: false,
      texts: ['Hello'],
      typingSpeed: 65,
    }),
    { kind: 'set-display-after-step', delay: 65, text: 'Hel' },
  )
  assert.deepEqual(
    getTextTypeEffectAction({
      cinematic: true,
      currentTextIndex: 0,
      deletingSpeed: 40,
      displayText: 'Hel',
      isDeleting: true,
      loop: true,
      pauseDuration: 1500,
      reduceMotion: false,
      texts: ['Hello'],
      typingSpeed: 65,
    }),
    { kind: 'set-display-after-step', delay: 40, text: 'He' },
  )
})

test('activateTextTypeEffectAction applies immediate and scheduled text actions', () => {
  const immediateCalls: unknown[] = []
  const immediateTimers = activateTextTypeEffectAction({
    action: { kind: 'set-display', text: 'One' },
    schedule: (delay, callback) => {
      immediateCalls.push(['schedule', delay, callback])
      return `timer:${delay}`
    },
    setCurrentTextIndex: (index) => immediateCalls.push(['index', index]),
    setDisplayText: (text) => immediateCalls.push(['display', text]),
    setIsDeleting: (isDeleting) => immediateCalls.push(['deleting', isDeleting]),
  })

  assert.deepEqual(immediateCalls, [['display', 'One']])
  assert.deepEqual(immediateTimers, [])

  const advanceCalls: unknown[] = []
  const advanceTimers = activateTextTypeEffectAction({
    action: { kind: 'advance-index', nextIndex: 2 },
    schedule: (delay, callback) => {
      advanceCalls.push(['schedule', delay, callback])
      return `timer:${delay}`
    },
    setCurrentTextIndex: (index) => advanceCalls.push(['index', index]),
    setDisplayText: (text) => advanceCalls.push(['display', text]),
    setIsDeleting: (isDeleting) => advanceCalls.push(['deleting', isDeleting]),
  })

  assert.deepEqual(advanceCalls, [
    ['deleting', false],
    ['index', 2],
  ])
  assert.deepEqual(advanceTimers, [])

  const scheduledCalls: unknown[] = []
  const scheduledTimers = activateTextTypeEffectAction({
    action: { kind: 'set-display-after-step', delay: 65, text: 'Hel' },
    schedule: (delay, callback) => {
      scheduledCalls.push(['schedule', delay])
      callback()
      return `timer:${delay}`
    },
    setCurrentTextIndex: (index) => scheduledCalls.push(['index', index]),
    setDisplayText: (text) => scheduledCalls.push(['display', text]),
    setIsDeleting: (isDeleting) => scheduledCalls.push(['deleting', isDeleting]),
  })

  assert.deepEqual(scheduledCalls, [
    ['schedule', 65],
    ['display', 'Hel'],
  ])
  assert.deepEqual(scheduledTimers, ['timer:65'])

  const pauseCalls: unknown[] = []
  const pauseTimers = activateTextTypeEffectAction({
    action: { kind: 'start-deleting-after-pause', delay: 1500 },
    schedule: (delay, callback) => {
      pauseCalls.push(['schedule', delay])
      callback()
      return `timer:${delay}`
    },
    setCurrentTextIndex: (index) => pauseCalls.push(['index', index]),
    setDisplayText: (text) => pauseCalls.push(['display', text]),
    setIsDeleting: (isDeleting) => pauseCalls.push(['deleting', isDeleting]),
  })

  assert.deepEqual(pauseCalls, [
    ['schedule', 1500],
    ['deleting', true],
  ])
  assert.deepEqual(pauseTimers, ['timer:1500'])
})

test('text type cursor effect action resolves hidden, completion, reduced, and idle states', () => {
  assert.deepEqual(
    getTextTypeCursorEffectAction({
      completionBlinks: 2,
      hasStarted: true,
      isComplete: false,
      reduceMotion: false,
      showCursor: false,
    }),
    { kind: 'hide' },
  )
  assert.deepEqual(
    getTextTypeCursorEffectAction({
      completionBlinks: 2,
      hasStarted: false,
      isComplete: false,
      reduceMotion: false,
      showCursor: true,
    }),
    { kind: 'hide' },
  )
  assert.deepEqual(
    getTextTypeCursorEffectAction({
      completionBlinks: 2,
      hasStarted: true,
      isComplete: true,
      reduceMotion: false,
      showCursor: true,
    }),
    {
      kind: 'completion-blink',
      intervalMs: TEXT_TYPE_CURSOR_COMPLETION_BLINK_INTERVAL_MS,
      maxSteps: 4,
    },
  )
  assert.deepEqual(
    getTextTypeCursorEffectAction({
      completionBlinks: 0,
      hasStarted: true,
      isComplete: true,
      reduceMotion: false,
      showCursor: true,
    }),
    { kind: 'hide' },
  )
  assert.deepEqual(
    getTextTypeCursorEffectAction({
      completionBlinks: 2,
      hasStarted: true,
      isComplete: false,
      reduceMotion: true,
      showCursor: true,
    }),
    { kind: 'show' },
  )
  assert.deepEqual(
    getTextTypeCursorEffectAction({
      completionBlinks: 2,
      hasStarted: true,
      isComplete: false,
      reduceMotion: false,
      showCursor: true,
    }),
    {
      kind: 'idle-blink',
      intervalMs: TEXT_TYPE_CURSOR_IDLE_BLINK_INTERVAL_MS,
    },
  )
})

test('text type cursor timer helpers clear existing timers and hide immediately', () => {
  const clearedTimers: string[] = []
  const visibleCalls: unknown[] = []
  const timerRef = { current: 'timer:stale' as string | null }

  assert.equal(
    clearTextTypeCursorTimer({
      clearTimer: (timer) => clearedTimers.push(timer),
      timerRef,
    }),
    true,
  )
  assert.deepEqual(clearedTimers, ['timer:stale'])
  assert.equal(timerRef.current, null)
  assert.equal(
    clearTextTypeCursorTimer({
      clearTimer: (timer) => clearedTimers.push(timer),
      timerRef,
    }),
    false,
  )

  const cleanup = activateTextTypeCursorEffectAction({
    action: { kind: 'hide' },
    clearTimer: (timer) => clearedTimers.push(timer),
    scheduleInterval: () => 'timer:hidden',
    setCursorVisible: (value) => visibleCalls.push(value),
    timerRef: { current: 'timer:old' as string | null },
  })

  cleanup()

  assert.deepEqual(clearedTimers, ['timer:stale', 'timer:old'])
  assert.deepEqual(visibleCalls, [false])
})

test('text type cursor activation schedules idle and completion blink intervals', () => {
  const idleCalls: unknown[] = []
  const idleTimerRef = { current: null as string | null }
  let idleCallback: (() => void) | null = null

  const cleanupIdle = activateTextTypeCursorEffectAction({
    action: { kind: 'idle-blink', intervalMs: 530 },
    clearTimer: (timer) => idleCalls.push(['clear', timer]),
    scheduleInterval: (callback, intervalMs) => {
      idleCalls.push(['schedule', intervalMs])
      idleCallback = callback
      return 'timer:idle'
    },
    setCursorVisible: (value) => idleCalls.push(['visible', typeof value]),
    timerRef: idleTimerRef,
  })

  assert.equal(idleTimerRef.current, 'timer:idle')
  idleCallback?.()
  cleanupIdle()
  assert.equal(idleTimerRef.current, null)
  assert.deepEqual(idleCalls, [
    ['schedule', 530],
    ['visible', 'function'],
    ['clear', 'timer:idle'],
  ])

  const completionCalls: unknown[] = []
  const completionTimerRef = { current: null as string | null }
  let completionCallback: (() => void) | null = null

  activateTextTypeCursorEffectAction({
    action: { kind: 'completion-blink', intervalMs: 220, maxSteps: 2 },
    clearTimer: (timer) => completionCalls.push(['clear', timer]),
    scheduleInterval: (callback, intervalMs) => {
      completionCalls.push(['schedule', intervalMs])
      completionCallback = callback
      return 'timer:complete'
    },
    setCursorVisible: (value) => completionCalls.push(['visible', typeof value === 'function' ? 'function' : value]),
    timerRef: completionTimerRef,
  })

  assert.equal(completionTimerRef.current, 'timer:complete')
  completionCallback?.()
  assert.equal(completionTimerRef.current, 'timer:complete')
  completionCallback?.()
  assert.equal(completionTimerRef.current, null)
  assert.deepEqual(completionCalls, [
    ['visible', true],
    ['schedule', 220],
    ['visible', 'function'],
    ['clear', 'timer:complete'],
    ['visible', false],
  ])
})

test('text type render helpers preserve cinematic classes and cursor visibility', () => {
  assert.equal(getTextTypeClassName(undefined, false), '')
  assert.equal(getTextTypeClassName('hero-copy', false), 'hero-copy')
  assert.equal(getTextTypeClassName('hero-copy', true), 'hero-copy text-type-cinematic')
  assert.equal(getTextTypeCursorClassName(false), 'inline-block ml-1')
  assert.equal(getTextTypeCursorClassName(true), 'inline-block ml-1 text-type-cinematic-cursor')
  assert.deepEqual(getTextTypeCursorStyle(true), { opacity: 1 })
  assert.deepEqual(getTextTypeCursorStyle(false), { opacity: 0 })
  assert.equal(shouldRenderTextTypeCursor(true, true), true)
  assert.equal(shouldRenderTextTypeCursor(true, false), false)
  assert.equal(shouldRenderTextTypeCursor(false, true), false)
})
