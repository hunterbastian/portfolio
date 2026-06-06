import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  activateLauncherClosePalette,
  activateLauncherCommandRun,
  activateLauncherDraftProjectEmail,
  activateLauncherEmailCopy,
  activateLauncherGlobalKeyboardAction,
  activateLauncherOpenPalette,
  activateLauncherOpenSignal,
  activateLauncherPageLinkCopy,
  activateLauncherWorkFilter,
  buildLauncherCommandSections,
  canCreateEmptySpaceRipple,
  cancelEmptySpaceRippleTimers,
  cancelLauncherToastDismiss,
  commandMatchesQuery,
  EMPTY_SPACE_RIPPLE_DURATION_MS,
  EMPTY_SPACE_RIPPLE_INTERACTIVE_SELECTOR,
  getClampedLauncherActiveIndex,
  getLauncherPageLabel,
  getGlobalLauncherKeyboardAction,
  getLauncherAnalyticsTarget,
  getLauncherPaletteKeyboardAction,
  getNextEmptySpaceRipples,
  getLauncherProjectCommandHint,
  getLauncherProjectCommandKeywords,
  getLauncherProjectSource,
  getLauncherProjectSources,
  getLauncherEmailHref,
  getLauncherProjectEmailHref,
  getLauncherWorkFilterTarget,
  getMatchingLauncherCommands,
  getNextEmptySpaceRipple,
  getNextLauncherToastState,
  getNextLauncherActiveIndex,
  getNextRecentCommandIds,
  getVisibleCommandEntries,
  isEmptySpaceRippleInteractiveTarget,
  isLauncherTypingTarget,
  LAUNCHER_EMAIL_ADDRESS,
  LAUNCHER_EMAIL_COPIED_TOAST,
  LAUNCHER_EMAIL_OPEN_TOAST,
  LAUNCHER_OPEN_TOAST,
  LAUNCHER_PAGE_LINK_COPIED_TOAST,
  LAUNCHER_PAGE_LINK_COPY_FAILED_TOAST,
  LAUNCHER_PROJECT_INQUIRY_SUBJECT,
  LAUNCHER_PROJECT_EMAIL_OPEN_TOAST,
  LAUNCHER_TOAST_TIMEOUT_MS,
  LAUNCHER_WORK_FILTER_EVENT,
  LAUNCHER_WORK_FILTER_EVENT_DELAY_MS,
  LAUNCHER_WORK_FILTERS,
  normalizeRecentCommandIds,
  parseStoredRecentCommandIds,
  readStoredRecentCommandIds,
  removeEmptySpaceRipple,
  scheduleEmptySpaceRippleRemoval,
  scheduleLauncherPaletteFocus,
  scheduleLauncherToastDismiss,
  stringifyStoredRecentCommandIds,
  writeStoredRecentCommandIds,
  type SearchableLauncherCommand,
} from './launcher.ts'

function command(
  id: string,
  section: SearchableLauncherCommand['section'],
  priority = 0,
  overrides: Partial<SearchableLauncherCommand> = {},
): SearchableLauncherCommand {
  return {
    id,
    label: id,
    hint: `${id} hint`,
    section,
    priority,
    ...overrides,
  }
}

test('commandMatchesQuery searches command copy, shortcuts, kind, and keywords', () => {
  const item = command('resume', 'navigate', 0, {
    label: 'Resume',
    hint: 'Open the CV page',
    keys: 'C',
    kind: 'Navigate',
    keywords: ['experience', 'pdf'],
  })

  assert.equal(commandMatchesQuery(item, 'resume'), true)
  assert.equal(commandMatchesQuery(item, 'pdf'), true)
  assert.equal(commandMatchesQuery(item, 'navigate'), true)
  assert.equal(commandMatchesQuery(item, 'z'), false)
})

test('getMatchingLauncherCommands normalizes query text and preserves blank queries', () => {
  const commands = [
    command('home', 'navigate', 0, { label: 'Home', keywords: ['landing'] }),
    command('resume', 'navigate', 0, { label: 'Resume', hint: 'Open the CV page', keywords: ['experience'] }),
    command('contact', 'contact', 0, { hint: 'Email Hunter' }),
  ]

  assert.equal(getMatchingLauncherCommands(commands, '   '), commands)
  assert.deepEqual(
    getMatchingLauncherCommands(commands, '  CV  ').map((item) => item.id),
    ['resume'],
  )
  assert.deepEqual(
    getMatchingLauncherCommands(commands, 'hunter').map((item) => item.id),
    ['contact'],
  )
  assert.deepEqual(getMatchingLauncherCommands(commands, 'missing'), [])
})

test('normalizeRecentCommandIds keeps only recent string command ids', () => {
  assert.deepEqual(normalizeRecentCommandIds(['projects', 3, 'home', null, 'contact', 'cv']), ['projects', 'home', 'contact'])
  assert.deepEqual(normalizeRecentCommandIds('bad value'), [])
})

test('stored recent command helpers tolerate stale storage and preserve limits', () => {
  assert.deepEqual(parseStoredRecentCommandIds(null), [])
  assert.deepEqual(parseStoredRecentCommandIds('not-json'), [])
  assert.deepEqual(parseStoredRecentCommandIds('["projects",3,"home","contact","cv"]'), ['projects', 'home', 'contact'])
  assert.equal(stringifyStoredRecentCommandIds(['projects', 'home', 'contact', 'cv']), '["projects","home","contact"]')
})

test('getNextRecentCommandIds promotes commands, dedupes, and preserves the limit', () => {
  assert.deepEqual(getNextRecentCommandIds('contact', ['projects', 'home']), ['contact', 'projects', 'home'])
  assert.deepEqual(getNextRecentCommandIds('projects', ['contact', 'projects', 'home']), ['projects', 'contact', 'home'])
  assert.deepEqual(getNextRecentCommandIds('cv', ['contact', 'projects', 'home'], 2), ['cv', 'contact'])
})

test('stored recent command storage helpers isolate unavailable localStorage behavior', () => {
  const values = new Map<string, string | null>([
    ['recent', '["projects",3,"home","contact","cv"]'],
  ])
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  }
  const unavailableStorage = {
    getItem: () => {
      throw new Error('storage unavailable')
    },
    setItem: () => {
      throw new Error('storage unavailable')
    },
  }

  assert.deepEqual(readStoredRecentCommandIds(storage, 'recent'), ['projects', 'home', 'contact'])
  writeStoredRecentCommandIds(storage, ['contact', 'projects', 'home', 'cv'], 'recent')
  assert.equal(values.get('recent'), '["contact","projects","home"]')
  assert.deepEqual(readStoredRecentCommandIds(unavailableStorage), [])
  assert.doesNotThrow(() => writeStoredRecentCommandIds(unavailableStorage, ['home']))
})

test('getNextLauncherToastState ignores empty details and increments toast ids', () => {
  assert.equal(LAUNCHER_TOAST_TIMEOUT_MS, 1800)
  assert.deepEqual(getNextLauncherToastState(4, null), {
    nextId: 4,
    toast: null,
  })
  assert.deepEqual(getNextLauncherToastState(4, {}), {
    nextId: 4,
    toast: null,
  })
  assert.deepEqual(getNextLauncherToastState(4, { message: 'Launchpad opened' }), {
    nextId: 5,
    toast: {
      id: 5,
      message: 'Launchpad opened',
    },
  })
})

test('launcher toast dismiss helpers replace stale timers and clean up active timers', () => {
  const callbacks = new Map<number, () => void>()
  const clearedTimers: number[] = []
  const toastStates: unknown[] = []
  const timerRef = { current: null as number | null }
  let timerId = 0
  const scheduleTimer = (callback: () => void, delayMs: number) => {
    assert.equal(delayMs, LAUNCHER_TOAST_TIMEOUT_MS)
    timerId += 1
    callbacks.set(timerId, callback)
    return timerId
  }
  const clearTimer = (timer: number) => {
    clearedTimers.push(timer)
    callbacks.delete(timer)
  }

  assert.equal(
    scheduleLauncherToastDismiss({
      clearTimer,
      scheduleTimer,
      setToast: (toast) => toastStates.push(toast),
      timerRef,
    }),
    1,
  )
  assert.equal(timerRef.current, 1)
  assert.equal(
    scheduleLauncherToastDismiss({
      clearTimer,
      scheduleTimer,
      setToast: (toast) => toastStates.push(toast),
      timerRef,
    }),
    2,
  )
  assert.deepEqual(clearedTimers, [1])
  assert.equal(timerRef.current, 2)

  callbacks.get(2)?.()

  assert.deepEqual(toastStates, [null])
  assert.equal(timerRef.current, null)
  assert.equal(cancelLauncherToastDismiss({ clearTimer, timerRef }), false)

  scheduleLauncherToastDismiss({
    clearTimer,
    scheduleTimer,
    setToast: (toast) => toastStates.push(toast),
    timerRef,
  })

  assert.equal(cancelLauncherToastDismiss({ clearTimer, timerRef }), true)
  assert.deepEqual(clearedTimers, [1, 3])
  assert.equal(timerRef.current, null)
})

test('getGlobalLauncherKeyboardAction keeps launcher shortcuts predictable', () => {
  assert.equal(
    getGlobalLauncherKeyboardAction({ ctrlKey: false, isTypingTarget: true, key: 'k', metaKey: true }),
    'toggle',
  )
  assert.equal(
    getGlobalLauncherKeyboardAction({ ctrlKey: true, isTypingTarget: false, key: 'K', metaKey: false }),
    'toggle',
  )
  assert.equal(
    getGlobalLauncherKeyboardAction({ ctrlKey: false, isTypingTarget: false, key: '/', metaKey: false }),
    'open',
  )
  assert.equal(
    getGlobalLauncherKeyboardAction({ ctrlKey: false, isTypingTarget: true, key: '/', metaKey: false }),
    null,
  )
})

test('isLauncherTypingTarget identifies editable launcher shortcut targets', () => {
  class MockHTMLElement {
    tagName = 'div'
    isContentEditable = false
  }

  const input = new MockHTMLElement()
  input.tagName = 'INPUT'

  const textarea = new MockHTMLElement()
  textarea.tagName = 'textarea'

  const editable = new MockHTMLElement()
  editable.isContentEditable = true

  assert.equal(isLauncherTypingTarget(input, MockHTMLElement), true)
  assert.equal(isLauncherTypingTarget(textarea, MockHTMLElement), true)
  assert.equal(isLauncherTypingTarget(editable, MockHTMLElement), true)
  assert.equal(isLauncherTypingTarget(new MockHTMLElement(), MockHTMLElement), false)
  assert.equal(isLauncherTypingTarget({ tagName: 'input', isContentEditable: false }, MockHTMLElement), false)
  assert.equal(isLauncherTypingTarget(null, MockHTMLElement), false)
})

test('isEmptySpaceRippleInteractiveTarget identifies ignored ripple targets', () => {
  class MockHTMLElement {
    private closestResult: unknown

    constructor(closestResult: unknown = null) {
      this.closestResult = closestResult
    }

    closest(selector: string) {
      assert.equal(selector, EMPTY_SPACE_RIPPLE_INTERACTIVE_SELECTOR)
      return this.closestResult
    }
  }

  assert.match(EMPTY_SPACE_RIPPLE_INTERACTIVE_SELECTOR, /button/)
  assert.match(EMPTY_SPACE_RIPPLE_INTERACTIVE_SELECTOR, /\[role="dialog"\]/)
  assert.equal(isEmptySpaceRippleInteractiveTarget(new MockHTMLElement({ tagName: 'button' }), MockHTMLElement), true)
  assert.equal(isEmptySpaceRippleInteractiveTarget(new MockHTMLElement(null), MockHTMLElement), false)
  assert.equal(isEmptySpaceRippleInteractiveTarget({ closest: () => ({}) }, MockHTMLElement), false)
  assert.equal(isEmptySpaceRippleInteractiveTarget(null, MockHTMLElement), false)
})

test('getNextLauncherActiveIndex clamps keyboard navigation to visible commands', () => {
  assert.equal(getNextLauncherActiveIndex(0, 'next', 3), 1)
  assert.equal(getNextLauncherActiveIndex(2, 'next', 3), 2)
  assert.equal(getNextLauncherActiveIndex(2, 'previous', 3), 1)
  assert.equal(getNextLauncherActiveIndex(0, 'previous', 3), 0)
  assert.equal(getNextLauncherActiveIndex(4, 'next', 0), 0)
})

test('getClampedLauncherActiveIndex preserves valid selection after filtering', () => {
  assert.equal(getClampedLauncherActiveIndex(0, 3), 0)
  assert.equal(getClampedLauncherActiveIndex(2, 3), 2)
  assert.equal(getClampedLauncherActiveIndex(4, 3), 2)
  assert.equal(getClampedLauncherActiveIndex(4, 0), 0)
  assert.equal(LAUNCHER_OPEN_TOAST, 'Launchpad opened')
})

test('getLauncherPaletteKeyboardAction preserves palette key handling decisions', () => {
  assert.deepEqual(getLauncherPaletteKeyboardAction({ key: 'Escape', commandCount: 0 }), { type: 'close' })
  assert.deepEqual(getLauncherPaletteKeyboardAction({ key: 'Enter', commandCount: 0 }), { type: 'run' })
  assert.deepEqual(getLauncherPaletteKeyboardAction({ key: 'ArrowDown', commandCount: 3 }), {
    type: 'move',
    direction: 'next',
  })
  assert.deepEqual(getLauncherPaletteKeyboardAction({ key: 'ArrowUp', commandCount: 3 }), {
    type: 'move',
    direction: 'previous',
  })
  assert.deepEqual(getLauncherPaletteKeyboardAction({ key: 'ArrowDown', commandCount: 0 }), { type: 'prevent-default' })
  assert.deepEqual(getLauncherPaletteKeyboardAction({ key: 'ArrowUp', commandCount: 0 }), { type: 'prevent-default' })
  assert.equal(getLauncherPaletteKeyboardAction({ key: 'Tab', commandCount: 3 }), null)
})

test('getLauncherAnalyticsTarget maps commands to analytics destinations', () => {
  assert.deepEqual(
    getLauncherAnalyticsTarget(command('project-lumo', 'projects', 0, { label: 'Lumo' }), 'hunter@example.com'),
    {
      type: 'project',
      label: 'Lumo',
      slug: 'lumo',
    },
  )
  assert.deepEqual(getLauncherAnalyticsTarget(command('email', 'contact'), 'hunter@example.com'), {
    type: 'external',
    href: 'mailto:hunter@example.com',
    label: 'email',
  })
  assert.deepEqual(getLauncherAnalyticsTarget(command('cv', 'navigate'), 'hunter@example.com'), {
    type: 'navigation',
    label: 'launchpad_cv',
  })
})

test('project command metadata keeps launcher project search stable', () => {
  const project = {
    slug: 'lumo',
    description: 'Mindfulness app for calm reflection.',
    category: 'Product Design',
    tags: ['mobile', 'mindfulness', 'ios', 'prototype'],
    date: '2026-02-14',
  }

  assert.equal(getLauncherProjectCommandHint(project), 'Product Design · mobile, mindfulness, ios')
  assert.deepEqual(getLauncherProjectCommandKeywords(project), [
    'lumo',
    'Product Design',
    'Mindfulness app for calm reflection.',
    '2026',
    'mobile',
    'mindfulness',
    'ios',
    'prototype',
  ])
})

test('launcher work filter constants and targets preserve command behavior', () => {
  assert.equal(LAUNCHER_WORK_FILTER_EVENT, 'hb-work-filter')
  assert.equal(LAUNCHER_WORK_FILTER_EVENT_DELAY_MS, 80)
  assert.equal(LAUNCHER_EMAIL_ADDRESS, 'hunterbastianux@gmail.com')
  assert.equal(LAUNCHER_PROJECT_INQUIRY_SUBJECT, 'Project Inquiry')
  assert.deepEqual(
    LAUNCHER_WORK_FILTERS.map((filter) => [filter.id, filter.label, filter.toast]),
    [
      ['product', 'Product work', 'Filtering product work'],
      ['visual', 'Visual work', 'Filtering visual work'],
      ['web', 'Web work', 'Filtering web work'],
      ['all', 'All work', 'Showing all work'],
    ],
  )
  assert.equal(getLauncherWorkFilterTarget('product'), '/?work=product#projects')
  assert.equal(getLauncherWorkFilterTarget('visual'), '/?work=visual#projects')
  assert.equal(getLauncherWorkFilterTarget('web'), '/?work=web#projects')
  assert.equal(getLauncherWorkFilterTarget('all'), '/#projects')
})

test('activateLauncherWorkFilter pushes route, delays event dispatch, and shows toast', () => {
  const calls: unknown[] = []
  const timer = activateLauncherWorkFilter({
    dispatchWorkFilterEvent: (filter) => calls.push(['dispatch', filter]),
    filter: 'web',
    pushRoute: (target) => calls.push(['push', target]),
    schedule: (callback, delayMs) => {
      calls.push(['schedule', delayMs])
      callback()
      return `timer:${delayMs}`
    },
    showToast: (message) => calls.push(['toast', message]),
    toastMessage: 'Filtering web work',
  })

  assert.equal(timer, 'timer:80')
  assert.deepEqual(calls, [
    ['push', '/?work=web#projects'],
    ['schedule', 80],
    ['dispatch', 'web'],
    ['toast', 'Filtering web work'],
  ])
})

test('launcher email href helpers preserve mailto destinations', () => {
  assert.equal(getLauncherEmailHref('hunter@example.com'), 'mailto:hunter@example.com')
  assert.equal(
    getLauncherProjectEmailHref('hunter@example.com', 'Project Inquiry'),
    'mailto:hunter@example.com?subject=Project%20Inquiry',
  )
})

test('activateLauncherEmailCopy copies email or falls back to mailto', async () => {
  const copiedCalls: unknown[] = []
  const copiedResult = await activateLauncherEmailCopy({
    copyText: async (value) => copiedCalls.push(['copy', value]),
    emailAddress: 'hunter@example.com',
    navigateToHref: (href) => copiedCalls.push(['href', href]),
    showToast: (message) => copiedCalls.push(['toast', message]),
  })

  assert.equal(copiedResult, 'copied')
  assert.deepEqual(copiedCalls, [
    ['copy', 'hunter@example.com'],
    ['toast', LAUNCHER_EMAIL_COPIED_TOAST],
  ])

  const fallbackCalls: unknown[] = []
  const fallbackResult = await activateLauncherEmailCopy({
    copyText: async () => {
      throw new Error('clipboard unavailable')
    },
    emailAddress: 'hunter@example.com',
    navigateToHref: (href) => fallbackCalls.push(['href', href]),
    showToast: (message) => fallbackCalls.push(['toast', message]),
  })

  assert.equal(fallbackResult, 'opened-email')
  assert.deepEqual(fallbackCalls, [
    ['href', 'mailto:hunter@example.com'],
    ['toast', LAUNCHER_EMAIL_OPEN_TOAST],
  ])
})

test('activateLauncherPageLinkCopy copies the current URL or reports failure', async () => {
  const copiedCalls: unknown[] = []
  const copiedResult = await activateLauncherPageLinkCopy({
    copyText: async (value) => copiedCalls.push(['copy', value]),
    currentHref: 'https://hunterbastian.com/archive',
    showToast: (message) => copiedCalls.push(['toast', message]),
  })

  assert.equal(copiedResult, 'copied')
  assert.deepEqual(copiedCalls, [
    ['copy', 'https://hunterbastian.com/archive'],
    ['toast', LAUNCHER_PAGE_LINK_COPIED_TOAST],
  ])

  const failedCalls: unknown[] = []
  const failedResult = await activateLauncherPageLinkCopy({
    copyText: async () => {
      throw new Error('clipboard unavailable')
    },
    currentHref: 'https://hunterbastian.com/archive',
    showToast: (message) => failedCalls.push(['toast', message]),
  })

  assert.equal(failedResult, 'copy-failed')
  assert.deepEqual(failedCalls, [['toast', LAUNCHER_PAGE_LINK_COPY_FAILED_TOAST]])
})

test('activateLauncherDraftProjectEmail opens a focused project mailto', () => {
  const calls: unknown[] = []

  activateLauncherDraftProjectEmail({
    emailAddress: 'hunter@example.com',
    navigateToHref: (href) => calls.push(['href', href]),
    showToast: (message) => calls.push(['toast', message]),
    subject: 'Project Inquiry',
  })

  assert.deepEqual(calls, [
    ['href', 'mailto:hunter@example.com?subject=Project%20Inquiry'],
    ['toast', LAUNCHER_PROJECT_EMAIL_OPEN_TOAST],
  ])
})

test('activateLauncherClosePalette triggers haptics before closing', () => {
  const calls: unknown[] = []

  activateLauncherClosePalette({
    setPaletteOpen: (open) => calls.push(['open', open]),
    triggerHaptic: (style) => calls.push(['haptic', style]),
  })

  assert.deepEqual(calls, [
    ['haptic', 'light'],
    ['open', false],
  ])
})

test('activateLauncherOpenPalette triggers haptics before opening', () => {
  const calls: unknown[] = []

  activateLauncherOpenPalette({
    setPaletteOpen: (open) => calls.push(['open', open]),
    triggerHaptic: (style) => calls.push(['haptic', style]),
  })

  assert.deepEqual(calls, [
    ['haptic', 'light'],
    ['open', true],
  ])
})

test('activateLauncherGlobalKeyboardAction toggles or opens after haptic feedback', () => {
  const toggleCalls: unknown[] = []
  const openCalls: unknown[] = []

  activateLauncherGlobalKeyboardAction({
    action: 'toggle',
    setPaletteOpen: (open) => toggleCalls.push(['open', open]),
    togglePaletteOpen: () => toggleCalls.push(['toggle']),
    triggerHaptic: (style) => toggleCalls.push(['haptic', style]),
  })
  activateLauncherGlobalKeyboardAction({
    action: 'open',
    setPaletteOpen: (open) => openCalls.push(['open', open]),
    togglePaletteOpen: () => openCalls.push(['toggle']),
    triggerHaptic: (style) => openCalls.push(['haptic', style]),
  })

  assert.deepEqual(toggleCalls, [
    ['haptic', 'light'],
    ['toggle'],
  ])
  assert.deepEqual(openCalls, [
    ['haptic', 'light'],
    ['open', true],
  ])
})

test('activateLauncherOpenSignal opens and resets palette state only for positive signals', () => {
  const ignoredCalls: unknown[] = []
  const handledCalls: unknown[] = []

  assert.equal(
    activateLauncherOpenSignal({
      openSignal: 0,
      setActiveIndex: (index) => ignoredCalls.push(['index', index]),
      setPaletteOpen: (open) => ignoredCalls.push(['open', open]),
      setQuery: (query) => ignoredCalls.push(['query', query]),
      showToast: (message) => ignoredCalls.push(['toast', message]),
    }),
    false,
  )
  assert.deepEqual(ignoredCalls, [])

  assert.equal(
    activateLauncherOpenSignal({
      openSignal: 2,
      setActiveIndex: (index) => handledCalls.push(['index', index]),
      setPaletteOpen: (open) => handledCalls.push(['open', open]),
      setQuery: (query) => handledCalls.push(['query', query]),
      showToast: (message) => handledCalls.push(['toast', message]),
    }),
    true,
  )
  assert.deepEqual(handledCalls, [
    ['open', true],
    ['query', ''],
    ['index', 0],
    ['toast', LAUNCHER_OPEN_TOAST],
  ])
})

test('activateLauncherCommandRun preserves launchpad command side-effect ordering', async () => {
  const calls: unknown[] = []
  const command = {
    id: 'projects',
    run: async () => calls.push(['run']),
  }

  await activateLauncherCommandRun({
    closePalette: () => calls.push(['close']),
    command,
    rememberCommand: (commandId) => calls.push(['remember', commandId]),
    trackCommand: (trackedCommand) => calls.push(['track', trackedCommand.id]),
    triggerHaptic: (style) => calls.push(['haptic', style]),
  })

  assert.deepEqual(calls, [
    ['haptic', 'light'],
    ['remember', 'projects'],
    ['track', 'projects'],
    ['run'],
    ['close'],
  ])
})

test('scheduleLauncherPaletteFocus waits two frames and cleans up scheduled frames', () => {
  const calls: unknown[] = []
  const callbacks: Array<() => void> = []

  const cleanup = scheduleLauncherPaletteFocus({
    cancelFrame: (frame) => calls.push(['cancel', frame]),
    focusInput: () => calls.push(['focus']),
    requestFrame: (callback) => {
      callbacks.push(callback)
      calls.push(['request', callbacks.length])
      return callbacks.length
    },
  })

  assert.deepEqual(calls, [['request', 1]])
  callbacks[0]?.()
  assert.deepEqual(calls, [
    ['request', 1],
    ['request', 2],
  ])
  callbacks[1]?.()
  assert.deepEqual(calls, [
    ['request', 1],
    ['request', 2],
    ['focus'],
  ])

  cleanup()
  assert.deepEqual(calls, [
    ['request', 1],
    ['request', 2],
    ['focus'],
    ['cancel', 1],
    ['cancel', 2],
  ])
})

test('launcher project source helpers preserve project data and display title fallback', () => {
  const projects = [
    {
      slug: 'lumo',
      frontmatter: {
        title: 'Lumo Case Study',
        displayTitle: 'Lumo',
        description: 'Mindfulness app for calm reflection.',
        category: 'Product Design',
        tags: ['mobile', 'mindfulness'],
        date: '2026-02-14',
      },
    },
    {
      slug: 'archive-path',
      frontmatter: {
        title: 'Archive Path',
        description: 'Interactive archive experiment.',
        category: 'Web',
        tags: ['interactive'],
        date: '2025-10-01',
      },
    },
  ]

  assert.deepEqual(getLauncherProjectSource(projects[0]!), {
    slug: 'lumo',
    title: 'Lumo',
    description: 'Mindfulness app for calm reflection.',
    category: 'Product Design',
    tags: ['mobile', 'mindfulness'],
    date: '2026-02-14',
  })
  assert.deepEqual(getLauncherProjectSources(projects).map((project) => project.title), ['Lumo', 'Archive Path'])
})

test('getLauncherPageLabel maps route families to launcher copy', () => {
  assert.equal(getLauncherPageLabel('/projects/lumo'), 'Project Space')
  assert.equal(getLauncherPageLabel('/archive'), 'Playground Space')
  assert.equal(getLauncherPageLabel('/cv'), 'Resume Space')
  assert.equal(getLauncherPageLabel('/about'), 'About Space')
  assert.equal(getLauncherPageLabel('/'), 'Home Space')
})

test('empty space ripple helpers gate and retain transient ripples', () => {
  assert.equal(canCreateEmptySpaceRipple({ interactiveTarget: false, paletteOpen: false, prefersReducedMotion: false }), true)
  assert.equal(canCreateEmptySpaceRipple({ interactiveTarget: true, paletteOpen: false, prefersReducedMotion: false }), false)
  assert.equal(canCreateEmptySpaceRipple({ interactiveTarget: false, paletteOpen: true, prefersReducedMotion: false }), false)
  assert.equal(canCreateEmptySpaceRipple({ interactiveTarget: false, paletteOpen: false, prefersReducedMotion: true }), false)
  assert.equal(EMPTY_SPACE_RIPPLE_DURATION_MS, 760)

  assert.deepEqual(
    getNextEmptySpaceRipples(
      [
        { id: 1, x: 1, y: 1 },
        { id: 2, x: 2, y: 2 },
        { id: 3, x: 3, y: 3 },
      ],
      { id: 4, x: 4, y: 4 },
      3,
    ).map((ripple) => ripple.id),
    [2, 3, 4],
  )

  assert.deepEqual(getNextEmptySpaceRipple(4, { clientX: 120, clientY: 240 }), {
    nextId: 5,
    ripple: { id: 5, x: 120, y: 240 },
  })
  assert.deepEqual(
    removeEmptySpaceRipple(
      [
        { id: 1, x: 1, y: 1 },
        { id: 2, x: 2, y: 2 },
      ],
      1,
    ),
    [{ id: 2, x: 2, y: 2 }],
  )
})

test('empty space ripple timer helpers remove ripples and clear pending timers', () => {
  let ripples = [
    { id: 1, x: 1, y: 1 },
    { id: 2, x: 2, y: 2 },
  ]
  const callbacks = new Map<number, () => void>()
  const clearedTimers: number[] = []
  const timerRegistry = { current: new Set<number>() }
  let timerId = 0
  const scheduleTimer = (callback: () => void, delayMs: number) => {
    assert.equal(delayMs, EMPTY_SPACE_RIPPLE_DURATION_MS)
    timerId += 1
    callbacks.set(timerId, callback)
    return timerId
  }
  const setRipples = (updater: (currentRipples: typeof ripples) => typeof ripples) => {
    ripples = updater(ripples)
  }

  assert.equal(
    scheduleEmptySpaceRippleRemoval({
      rippleId: 1,
      scheduleTimer,
      setRipples,
      timerRegistry,
    }),
    1,
  )
  assert.deepEqual([...timerRegistry.current], [1])

  callbacks.get(1)?.()

  assert.deepEqual(ripples, [{ id: 2, x: 2, y: 2 }])
  assert.equal(timerRegistry.current.size, 0)

  scheduleEmptySpaceRippleRemoval({
    rippleId: 2,
    scheduleTimer,
    setRipples,
    timerRegistry,
  })
  scheduleEmptySpaceRippleRemoval({
    rippleId: 3,
    scheduleTimer,
    setRipples,
    timerRegistry,
  })

  assert.equal(
    cancelEmptySpaceRippleTimers({
      clearTimer: (timer) => clearedTimers.push(timer),
      timerRegistry,
    }),
    2,
  )
  assert.deepEqual(clearedTimers, [2, 3])
  assert.equal(timerRegistry.current.size, 0)
  assert.equal(cancelEmptySpaceRippleTimers({ clearTimer: (timer) => clearedTimers.push(timer), timerRegistry }), 0)
})

test('buildLauncherCommandSections uses recent commands or fallback suggestions', () => {
  const commands = [
    command('home', 'navigate', 20),
    command('projects', 'navigate', 10),
    command('contact', 'contact', 10),
  ]

  const withRecent = buildLauncherCommandSections({
    commands,
    matchingCommands: commands,
    query: '',
    recentCommandIds: ['contact'],
  })
  const withFallback = buildLauncherCommandSections({
    commands,
    matchingCommands: commands,
    query: '',
    recentCommandIds: [],
  })

  assert.deepEqual(withRecent[0]?.commands.map((item) => item.id), ['contact'])
  assert.deepEqual(withFallback[0]?.commands.map((item) => item.id), ['home', 'projects', 'contact'])
  assert.deepEqual(getVisibleCommandEntries(withRecent).map((entry) => entry.command.id), [
    'contact',
    'projects',
    'home',
  ])
  assert.deepEqual(getVisibleCommandEntries(withFallback).map((entry) => entry.command.id), [
    'home',
    'projects',
    'contact',
  ])
})

test('buildLauncherCommandSections groups visible commands by priority and skips suggestions while searching', () => {
  const commands = [
    command('contact', 'contact', 30),
    command('projects', 'navigate', 20),
    command('home', 'navigate', 10),
  ]
  const matchingCommands = [commands[0]!, commands[2]!]
  const sections = buildLauncherCommandSections({
    commands,
    matchingCommands,
    query: 'co',
    recentCommandIds: ['projects'],
  })

  assert.deepEqual(sections.map((section) => section.id), ['navigate', 'contact'])
  assert.deepEqual(getVisibleCommandEntries(sections).map((entry) => entry.command.id), ['home', 'contact'])
})
