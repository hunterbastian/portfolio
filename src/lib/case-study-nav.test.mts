import assert from 'node:assert/strict'
import test from 'node:test'

import {
  CASE_STUDY_CHAPTER_BUTTON_CLASS_NAME,
  CASE_STUDY_CHAPTER_HAPTIC_STYLE,
  CASE_STUDY_CHAPTER_MARKER_CLASS_NAME,
  CASE_STUDY_CHAPTER_OBSERVER_OPTIONS,
  CASE_STUDY_CHAPTER_SCROLL_OPTIONS,
  CASE_STUDY_CHAPTER_SELECTOR,
  CASE_STUDY_NAV_ARIA_LABEL,
  CASE_STUDY_NAV_LIST_CLASS_NAME,
  CASE_STUDY_NAV_ROOT_CLASS_NAME,
  activateCaseStudyChapterObserver,
  activateCaseStudyChapterNavigation,
  getCaseStudyChapterAriaCurrent,
  getCaseStudyChapterAriaLabel,
  getCaseStudyChapterAnalyticsTarget,
  getCaseStudyChapterIndicatorState,
  getCaseStudyChapterLabelClassName,
  getCaseStudyChapterSelector,
  getCaseStudyChapters,
  getInitialCaseStudyChapterId,
  getIntersectingCaseStudyChapterId,
} from './case-study-nav.ts'

test('getCaseStudyChapters reads data-chapter elements and skips missing ids', () => {
  const chapters = getCaseStudyChapters([
    { dataset: { chapter: '01', chapterTitle: 'Overview' } },
    { dataset: { chapterTitle: 'Ignored' } },
    { dataset: { chapter: '02' } },
  ])

  assert.deepEqual(chapters, [
    { id: '01', title: 'Overview' },
    { id: '02', title: '' },
  ])
})

test('case study chapter helpers preserve initial state, selectors, and analytics labels', () => {
  assert.equal(getInitialCaseStudyChapterId([{ id: '03', title: 'Reflection' }]), '03')
  assert.equal(getInitialCaseStudyChapterId([]), '')
  assert.equal(getCaseStudyChapterAnalyticsTarget('03'), 'chapter_03')
  assert.equal(getCaseStudyChapterSelector('03'), '[data-chapter="03"]')
})

test('getIntersectingCaseStudyChapterId returns the first visible chapter id', () => {
  assert.equal(
    getIntersectingCaseStudyChapterId([
      { isIntersecting: false, target: { dataset: { chapter: '01' } } },
      { isIntersecting: true, target: { dataset: {} } },
      { isIntersecting: true, target: { dataset: { chapter: '02' } } },
      { isIntersecting: true, target: { dataset: { chapter: '03' } } },
    ]),
    '02',
  )

  assert.equal(
    getIntersectingCaseStudyChapterId([
      { isIntersecting: false, target: { dataset: { chapter: '01' } } },
      { isIntersecting: true, target: {} },
    ]),
    null,
  )
})

test('getCaseStudyChapterSelector escapes attribute selector values', () => {
  assert.equal(
    getCaseStudyChapterSelector('quote"and\\slash'),
    '[data-chapter="quote\\"and\\\\slash"]',
  )
})

test('case study nav constants preserve desktop chapter rail chrome', () => {
  assert.equal(CASE_STUDY_NAV_ARIA_LABEL, 'Case study chapters')
  assert.match(CASE_STUDY_NAV_ROOT_CLASS_NAME, /hidden xl:block/)
  assert.match(CASE_STUDY_NAV_LIST_CLASS_NAME, /sticky top-\[33vh\]/)
  assert.match(CASE_STUDY_CHAPTER_BUTTON_CLASS_NAME, /min-h-\[40px\]/)
  assert.match(CASE_STUDY_CHAPTER_BUTTON_CLASS_NAME, /active:scale-\[0\.96\]/)
  assert.equal(CASE_STUDY_CHAPTER_HAPTIC_STYLE, 'light')
  assert.deepEqual(CASE_STUDY_CHAPTER_SCROLL_OPTIONS, { behavior: 'smooth', block: 'start' })
  assert.equal(CASE_STUDY_CHAPTER_MARKER_CLASS_NAME, 'block rounded-full')
  assert.equal(CASE_STUDY_CHAPTER_SELECTOR, '[data-chapter]')
  assert.deepEqual(CASE_STUDY_CHAPTER_OBSERVER_OPTIONS, { rootMargin: '-20% 0px -60% 0px' })
})

test('case study chapter a11y helpers preserve labels and current step state', () => {
  assert.equal(
    getCaseStudyChapterAriaLabel({ id: '02', title: 'Process' }),
    'Chapter 02: Process',
  )
  assert.equal(getCaseStudyChapterAriaCurrent(true), 'step')
  assert.equal(getCaseStudyChapterAriaCurrent(false), undefined)
})

test('case study chapter visual helpers preserve active and inactive marker states', () => {
  assert.deepEqual(getCaseStudyChapterIndicatorState(true), {
    width: 16,
    height: 4,
    opacity: 0.9,
    backgroundColor: 'var(--accent)',
  })
  assert.deepEqual(getCaseStudyChapterIndicatorState(false), {
    width: 4,
    height: 4,
    opacity: 0.15,
    backgroundColor: 'var(--foreground)',
  })
  assert.match(getCaseStudyChapterLabelClassName(true), /text-foreground/)
  assert.match(getCaseStudyChapterLabelClassName(true), /opacity-70/)
  assert.match(getCaseStudyChapterLabelClassName(false), /text-muted-foreground/)
  assert.match(getCaseStudyChapterLabelClassName(false), /group-hover:opacity-50/)
})

test('activateCaseStudyChapterNavigation preserves haptic, analytics, and scroll ordering', () => {
  const calls: unknown[] = []

  activateCaseStudyChapterNavigation({
    chapterId: 'quote"and\\slash',
    findChapterElement: (selector) => {
      calls.push(['find', selector])

      return {
        scrollIntoView: (options) => calls.push(['scroll', options]),
      }
    },
    trackNavigationClick: (target) => calls.push(['navigation', target]),
    triggerHaptic: (style) => calls.push(['haptic', style]),
  })

  assert.deepEqual(calls, [
    ['haptic', 'light'],
    ['navigation', 'chapter_quote"and\\slash'],
    ['find', '[data-chapter="quote\\"and\\\\slash"]'],
    ['scroll', { behavior: 'smooth', block: 'start' }],
  ])
})

test('activateCaseStudyChapterNavigation skips scroll when chapter element is missing', () => {
  const calls: unknown[] = []

  activateCaseStudyChapterNavigation({
    chapterId: '03',
    findChapterElement: (selector) => {
      calls.push(['find', selector])
      return null
    },
    trackNavigationClick: (target) => calls.push(['navigation', target]),
    triggerHaptic: (style) => calls.push(['haptic', style]),
  })

  assert.deepEqual(calls, [
    ['haptic', 'light'],
    ['navigation', 'chapter_03'],
    ['find', '[data-chapter="03"]'],
  ])
})

test('activateCaseStudyChapterObserver skips empty chapter lists', () => {
  const calls: unknown[] = []

  const cleanup = activateCaseStudyChapterObserver({
    chapters: [],
    createObserver: () => {
      calls.push('create')

      return {
        disconnect: () => calls.push('disconnect'),
        observe: (element: string) => calls.push(['observe', element]),
      }
    },
    getChapterElements: () => ['one', 'two'],
    setActiveChapter: (chapterId) => calls.push(['active', chapterId]),
  })

  assert.equal(cleanup, undefined)
  assert.deepEqual(calls, [])
})

test('activateCaseStudyChapterObserver observes chapters and updates active id', () => {
  const calls: unknown[] = []
  let handleEntries: ((entries: Iterable<{ isIntersecting: boolean; target: unknown }>) => void) | null = null

  const cleanup = activateCaseStudyChapterObserver({
    chapters: [{ id: '01', title: 'Overview' }],
    createObserver: (onEntries, options) => {
      calls.push(['create', options])
      handleEntries = onEntries

      return {
        disconnect: () => calls.push('disconnect'),
        observe: (element: string) => calls.push(['observe', element]),
      }
    },
    getChapterElements: () => ['chapter-one', 'chapter-two'],
    setActiveChapter: (chapterId) => calls.push(['active', chapterId]),
  })

  assert.equal(typeof cleanup, 'function')
  handleEntries?.([
    { isIntersecting: false, target: { dataset: { chapter: '01' } } },
    { isIntersecting: true, target: { dataset: { chapter: '02' } } },
  ])
  cleanup?.()

  assert.deepEqual(calls, [
    ['create', { rootMargin: '-20% 0px -60% 0px' }],
    ['observe', 'chapter-one'],
    ['observe', 'chapter-two'],
    ['active', '02'],
    'disconnect',
  ])
})
