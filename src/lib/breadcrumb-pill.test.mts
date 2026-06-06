import assert from 'node:assert/strict'
import test from 'node:test'

import {
  BREADCRUMB_HAPTIC_STYLE,
  BREADCRUMB_ICON_CLASS,
  BREADCRUMB_PARENT_LABEL_CLASS,
  BREADCRUMB_PILL_CLASS,
  BREADCRUMB_SEPARATOR_CLASS,
  activateBreadcrumbPill,
  getBreadcrumbAnalyticsTarget,
  getBreadcrumbPillViewState,
} from './breadcrumb-pill.ts'

test('breadcrumb analytics target preserves lowercased parent label behavior', () => {
  assert.equal(getBreadcrumbAnalyticsTarget('Home'), 'home')
  assert.equal(getBreadcrumbAnalyticsTarget('Project Archive'), 'project archive')
})

test('breadcrumb view state packages route, labels, and analytics target', () => {
  assert.deepEqual(
    getBreadcrumbPillViewState({
      href: '/archive',
      parentLabel: 'Project Archive',
      currentLabel: 'Lumo',
    }),
    {
      analyticsTarget: 'project archive',
      currentLabel: 'Lumo',
      href: '/archive',
      parentLabel: 'Project Archive',
    },
  )
})

test('breadcrumb class constants preserve pill layout and hover contracts', () => {
  assert.equal(BREADCRUMB_HAPTIC_STYLE, 'light')
  assert.match(BREADCRUMB_PILL_CLASS, /top-meta-pill/)
  assert.match(BREADCRUMB_PILL_CLASS, /min-h-\[40px\]/)
  assert.match(BREADCRUMB_PILL_CLASS, /touch-manipulation/)
  assert.match(BREADCRUMB_PILL_CLASS, /active:scale-\[0\.96\]/)
  assert.match(BREADCRUMB_ICON_CLASS, /group-hover:-translate-x-1/)
  assert.equal(BREADCRUMB_PARENT_LABEL_CLASS, 'text-foreground opacity-90')
  assert.equal(BREADCRUMB_SEPARATOR_CLASS, 'text-muted-foreground/30')
})

test('activateBreadcrumbPill preserves haptic before navigation tracking', () => {
  const calls: unknown[] = []

  activateBreadcrumbPill({
    analyticsTarget: 'project archive',
    trackNavigationClick: (target) => calls.push(['navigation', target]),
    triggerHaptic: (style) => calls.push(['haptic', style]),
  })

  assert.deepEqual(calls, [
    ['haptic', 'light'],
    ['navigation', 'project archive'],
  ])
})
