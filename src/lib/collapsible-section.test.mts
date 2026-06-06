import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  SECTION_PANEL_STATE,
  SECTION_ROW_STATE,
  SECTION_STAGE,
  SECTION_TITLE_STAGE,
  getCollapsibleSectionClassName,
  getSectionEntranceSchedule,
  getSectionRowDelay,
  getSectionRowKey,
  getSectionTitleMotion,
  getSectionTransitionDuration,
  getStagedSectionMotion,
  isSectionStageReady,
  scheduleSectionEntranceStages,
  scheduleSectionTitleEntrance,
  splitSectionTitle,
} from './collapsible-section.ts'

test('splitSectionTitle separates numeric prefixes from labels', () => {
  assert.deepEqual(splitSectionTitle('01 Projects'), { number: '01', label: 'Projects' })
  assert.deepEqual(splitSectionTitle('Projects'), { number: null, label: 'Projects' })
})

test('getCollapsibleSectionClassName preserves base and open or closed classes', () => {
  assert.equal(
    getCollapsibleSectionClassName({
      className: 'root',
      closedClassName: 'closed',
      isOpen: false,
      openClassName: 'open',
    }),
    'root closed performance-section transition-[padding] duration-300',
  )
  assert.equal(
    getCollapsibleSectionClassName({
      className: 'root',
      closedClassName: 'closed',
      isOpen: true,
      openClassName: 'open',
    }),
    'root open performance-section transition-[padding] duration-300',
  )
})

test('getStagedSectionMotion switches between staged and final values', () => {
  assert.deepEqual(
    getStagedSectionMotion({
      ...SECTION_PANEL_STATE,
      ready: false,
      skipStaging: false,
    }),
    { opacity: 0, y: 12 },
  )
  assert.deepEqual(
    getStagedSectionMotion({
      ...SECTION_ROW_STATE,
      ready: true,
      skipStaging: false,
    }),
    { opacity: 1, y: 0 },
  )
  assert.deepEqual(
    getStagedSectionMotion({
      ...SECTION_ROW_STATE,
      ready: false,
      skipStaging: true,
    }),
    { opacity: 1, y: 0 },
  )
})

test('section stage helpers keep title and row thresholds explicit', () => {
  assert.equal(isSectionStageReady(SECTION_STAGE.hidden, SECTION_STAGE.panel), false)
  assert.equal(isSectionStageReady(SECTION_STAGE.panel, SECTION_STAGE.panel), true)
  assert.equal(isSectionStageReady(SECTION_STAGE.rows, SECTION_STAGE.rows), true)
  assert.deepEqual(getSectionTitleMotion(SECTION_TITLE_STAGE.hidden), { opacity: 0, y: 6 })
  assert.deepEqual(getSectionTitleMotion(SECTION_TITLE_STAGE.visible), { opacity: 1, y: 0 })
})

test('section transition helpers preserve staging delays and fallbacks', () => {
  assert.equal(getSectionTransitionDuration(false, 380), 380)
  assert.equal(getSectionTransitionDuration(true, 380), 0)
  assert.equal(getSectionRowDelay({ index: 3, rowStagger: 70, skipStaging: false, stage: SECTION_STAGE.panel }), 0)
  assert.equal(getSectionRowDelay({ index: 3, rowStagger: 70, skipStaging: false, stage: SECTION_STAGE.rows }), 210)
  assert.equal(getSectionRowDelay({ index: 3, rowStagger: 70, skipStaging: true, stage: SECTION_STAGE.rows }), 0)
})

test('section entrance schedule preserves hidden, reduced, and staged flows', () => {
  assert.deepEqual(
    getSectionEntranceSchedule({
      hasPlayed: false,
      initialLoadDelayMs: 120,
      isInView: true,
      isOpen: false,
      prefersReducedMotion: false,
    }),
    { kind: 'hidden' },
  )
  assert.deepEqual(
    getSectionEntranceSchedule({
      hasPlayed: false,
      initialLoadDelayMs: 120,
      isInView: false,
      isOpen: true,
      prefersReducedMotion: false,
    }),
    { kind: 'hidden' },
  )
  assert.deepEqual(
    getSectionEntranceSchedule({
      hasPlayed: false,
      initialLoadDelayMs: 120,
      isInView: true,
      isOpen: true,
      prefersReducedMotion: true,
    }),
    { kind: 'immediate', stage: SECTION_STAGE.rows },
  )
  assert.deepEqual(
    getSectionEntranceSchedule({
      hasPlayed: false,
      initialLoadDelayMs: 120,
      isInView: true,
      isOpen: true,
      prefersReducedMotion: false,
    }),
    { kind: 'staged', panelDelay: 200, rowsDelay: 320 },
  )
  assert.deepEqual(
    getSectionEntranceSchedule({
      hasPlayed: true,
      initialLoadDelayMs: 120,
      isInView: true,
      isOpen: true,
      prefersReducedMotion: false,
    }),
    { kind: 'staged', panelDelay: 80, rowsDelay: 200 },
  )
})

test('scheduleSectionEntranceStages maps section schedules to stage updates and timers', () => {
  const hiddenCalls: unknown[] = []
  const hiddenTimers = scheduleSectionEntranceStages({
    hasPlayed: false,
    initialLoadDelayMs: 120,
    isInView: true,
    isOpen: false,
    prefersReducedMotion: false,
    scheduleStage: (stage, delay, markPlayed) => {
      hiddenCalls.push(['schedule', stage, delay, markPlayed])
      return `${stage}:${delay}:${markPlayed}`
    },
    setHasPlayed: (hasPlayed) => hiddenCalls.push(['played', hasPlayed]),
    setStage: (stage) => hiddenCalls.push(['set', stage]),
  })

  assert.deepEqual(hiddenCalls, [['set', SECTION_STAGE.hidden]])
  assert.deepEqual(hiddenTimers, [])

  const immediateCalls: unknown[] = []
  const immediateTimers = scheduleSectionEntranceStages({
    hasPlayed: false,
    initialLoadDelayMs: 120,
    isInView: true,
    isOpen: true,
    prefersReducedMotion: true,
    scheduleStage: (stage, delay, markPlayed) => {
      immediateCalls.push(['schedule', stage, delay, markPlayed])
      return `${stage}:${delay}:${markPlayed}`
    },
    setHasPlayed: (hasPlayed) => immediateCalls.push(['played', hasPlayed]),
    setStage: (stage) => immediateCalls.push(['set', stage]),
  })

  assert.deepEqual(immediateCalls, [
    ['set', SECTION_STAGE.rows],
    ['played', true],
  ])
  assert.deepEqual(immediateTimers, [])

  const stagedCalls: unknown[] = []
  const stagedTimers = scheduleSectionEntranceStages({
    hasPlayed: false,
    initialLoadDelayMs: 120,
    isInView: true,
    isOpen: true,
    prefersReducedMotion: false,
    scheduleStage: (stage, delay, markPlayed) => {
      stagedCalls.push(['schedule', stage, delay, markPlayed])
      return `${stage}:${delay}:${markPlayed}`
    },
    setHasPlayed: (hasPlayed) => stagedCalls.push(['played', hasPlayed]),
    setStage: (stage) => stagedCalls.push(['set', stage]),
  })

  assert.deepEqual(stagedCalls, [
    ['set', SECTION_STAGE.hidden],
    ['schedule', SECTION_STAGE.panel, 200, false],
    ['schedule', SECTION_STAGE.rows, 320, true],
  ])
  assert.deepEqual(stagedTimers, [
    `${SECTION_STAGE.panel}:200:false`,
    `${SECTION_STAGE.rows}:320:true`,
  ])
})

test('scheduleSectionTitleEntrance maps title visibility paths to timers', () => {
  const hiddenCalls: unknown[] = []
  const hiddenTimers = scheduleSectionTitleEntrance({
    hasPlayed: false,
    initialLoadDelayMs: 120,
    isTitleInView: false,
    prefersReducedMotion: false,
    scheduleVisible: (delay) => {
      hiddenCalls.push(['schedule', delay])
      return `visible:${delay}`
    },
    setHasPlayed: (hasPlayed) => hiddenCalls.push(['played', hasPlayed]),
    setTitleStage: (stage) => hiddenCalls.push(['set', stage]),
  })

  assert.deepEqual(hiddenCalls, [['set', SECTION_TITLE_STAGE.hidden]])
  assert.deepEqual(hiddenTimers, [])

  const reducedCalls: unknown[] = []
  const reducedTimers = scheduleSectionTitleEntrance({
    hasPlayed: false,
    initialLoadDelayMs: 120,
    isTitleInView: true,
    prefersReducedMotion: true,
    scheduleVisible: (delay) => {
      reducedCalls.push(['schedule', delay])
      return `visible:${delay}`
    },
    setHasPlayed: (hasPlayed) => reducedCalls.push(['played', hasPlayed]),
    setTitleStage: (stage) => reducedCalls.push(['set', stage]),
  })

  assert.deepEqual(reducedCalls, [
    ['set', SECTION_TITLE_STAGE.visible],
    ['played', true],
  ])
  assert.deepEqual(reducedTimers, [])

  const playedCalls: unknown[] = []
  const playedTimers = scheduleSectionTitleEntrance({
    hasPlayed: true,
    initialLoadDelayMs: 120,
    isTitleInView: true,
    prefersReducedMotion: false,
    scheduleVisible: (delay) => {
      playedCalls.push(['schedule', delay])
      return `visible:${delay}`
    },
    setHasPlayed: (hasPlayed) => playedCalls.push(['played', hasPlayed]),
    setTitleStage: (stage) => playedCalls.push(['set', stage]),
  })

  assert.deepEqual(playedCalls, [['set', SECTION_TITLE_STAGE.visible]])
  assert.deepEqual(playedTimers, [])

  const stagedCalls: unknown[] = []
  const stagedTimers = scheduleSectionTitleEntrance({
    hasPlayed: false,
    initialLoadDelayMs: 120,
    isTitleInView: true,
    prefersReducedMotion: false,
    scheduleVisible: (delay) => {
      stagedCalls.push(['schedule', delay])
      return `visible:${delay}`
    },
    setHasPlayed: (hasPlayed) => stagedCalls.push(['played', hasPlayed]),
    setTitleStage: (stage) => stagedCalls.push(['set', stage]),
  })

  assert.deepEqual(stagedCalls, [
    ['set', SECTION_TITLE_STAGE.hidden],
    ['schedule', 192],
  ])
  assert.deepEqual(stagedTimers, ['visible:192'])
})

test('section row keys prefer stable child keys before index fallbacks', () => {
  assert.equal(getSectionRowKey('intro', 4), 'intro')
  assert.equal(getSectionRowKey(12, 4), '12')
  assert.equal(getSectionRowKey(null, 4), 'section-row-4')
})
