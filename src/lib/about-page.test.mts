import assert from 'node:assert/strict'
import test from 'node:test'

import {
  ABOUT_PAGE_ACTION_HAPTIC_STYLE,
  ABOUT_PAGE_ACTION_CLASS,
  ABOUT_PAGE_ACTIONS,
  activateAboutPageAction,
  shouldOpenAboutResumePreview,
} from './about-page.ts'

test('about page actions preserve visible order, routes, and toast copy', () => {
  assert.deepEqual(
    ABOUT_PAGE_ACTIONS.map((action) => ({
      id: action.id,
      kind: action.kind,
      label: action.label,
      toast: action.toast,
      href: action.kind === 'link' ? action.href : undefined,
    })),
    [
      {
        id: 'contact',
        kind: 'link',
        label: 'Contact',
        toast: 'Say hi',
        href: '/#contact',
      },
      {
        id: 'resume',
        kind: 'link',
        label: 'Resume',
        toast: 'Opening resume',
        href: '/cv',
      },
      {
        id: 'preview',
        kind: 'preview',
        label: 'Preview',
        toast: 'Resume opened',
        href: undefined,
      },
    ],
  )
})

test('about page action helpers preserve touch target and preview behavior', () => {
  const [contactAction, , previewAction] = ABOUT_PAGE_ACTIONS

  assert.match(ABOUT_PAGE_ACTION_CLASS, /min-h-\[40px\]/)
  assert.match(ABOUT_PAGE_ACTION_CLASS, /active:scale-\[0\.96\]/)
  assert.equal(shouldOpenAboutResumePreview(contactAction!), false)
  assert.equal(shouldOpenAboutResumePreview(previewAction!), true)
  assert.equal(ABOUT_PAGE_ACTION_HAPTIC_STYLE, 'light')
})

test('activateAboutPageAction preserves haptic and toast ordering for links', () => {
  const [contactAction] = ABOUT_PAGE_ACTIONS
  const calls: unknown[] = []

  activateAboutPageAction({
    action: contactAction!,
    openResumePreview: () => calls.push('preview'),
    showToast: (message) => calls.push(['toast', message]),
    triggerHaptic: (style) => calls.push(['haptic', style]),
  })

  assert.deepEqual(calls, [
    ['haptic', 'light'],
    ['toast', 'Say hi'],
  ])
})

test('activateAboutPageAction opens the resume preview after feedback', () => {
  const previewAction = ABOUT_PAGE_ACTIONS[2]
  const calls: unknown[] = []

  activateAboutPageAction({
    action: previewAction!,
    openResumePreview: () => calls.push('preview'),
    showToast: (message) => calls.push(['toast', message]),
    triggerHaptic: (style) => calls.push(['haptic', style]),
  })

  assert.deepEqual(calls, [
    ['haptic', 'light'],
    ['toast', 'Resume opened'],
    'preview',
  ])
})
