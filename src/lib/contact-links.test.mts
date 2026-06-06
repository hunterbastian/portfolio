import assert from 'node:assert/strict'
import test from 'node:test'

import {
  CONTACT_EMAIL_LABEL,
  CONTACT_EMAIL_TOAST,
  CONTACT_LINK_HAPTIC_STYLE,
  activateContactLink,
  getContactEmailAddress,
  getContactEmailAriaLabel,
  getContactEmailLink,
  getContactLinkAction,
  getContactLinkAriaLabel,
  getContactLinkPlatform,
  getContactLinkToast,
  getContactLinksView,
  getContactSocialLinkView,
  getContactSocialLinks,
  shouldContactLinkOpenNewTab,
} from './contact-links.ts'

const links = [
  { label: 'Email', href: 'mailto:hunter@example.com?subject=Hello', external: true },
  { label: 'GitHub', href: 'https://github.com/hunterbastian', external: true },
  { label: 'Local', href: '/archive' },
]

test('contact link helpers split email from social links', () => {
  assert.equal(CONTACT_EMAIL_LABEL, 'Email')
  assert.equal(CONTACT_EMAIL_TOAST, 'Opening email')
  assert.equal(CONTACT_LINK_HAPTIC_STYLE, 'light')
  assert.deepEqual(getContactEmailLink(links), links[0])
  assert.deepEqual(getContactSocialLinks(links), [links[1], links[2]])
})

test('contact email helpers normalize mailto hrefs and aria copy', () => {
  assert.equal(getContactEmailAddress('mailto:hunter@example.com?subject=Hello'), 'hunter@example.com')
  assert.equal(getContactEmailAddress(undefined), '')
  assert.equal(
    getContactEmailAriaLabel('hunter@example.com'),
    'Email me directly at hunter@example.com',
  )
})

test('contact link helpers preserve analytics, toast, aria, and tab behavior', () => {
  assert.equal(getContactLinkPlatform(links[1]), 'github')
  assert.equal(getContactLinkToast(links[0]), 'Opening email')
  assert.equal(getContactLinkToast(links[1]), 'Opening GitHub')
  assert.equal(getContactLinkAriaLabel(links[1]), 'Open GitHub')
  assert.equal(getContactLinkAriaLabel({ ...links[1], ariaLabel: 'Open profile' }), 'Open profile')
  assert.equal(shouldContactLinkOpenNewTab(links[0]), false)
  assert.equal(shouldContactLinkOpenNewTab(links[1]), true)
  assert.equal(shouldContactLinkOpenNewTab(links[2]), false)
})

test('contact link view helpers package click and browser metadata', () => {
  assert.deepEqual(getContactLinkAction(links[0]), {
    link: links[0],
    platform: 'email',
    toast: 'Opening email',
  })
  assert.deepEqual(getContactSocialLinkView(links[1]), {
    ariaLabel: 'Open GitHub',
    link: links[1],
    platform: 'github',
    rel: 'noreferrer',
    target: '_blank',
    toast: 'Opening GitHub',
  })
  assert.deepEqual(getContactSocialLinkView(links[2]), {
    ariaLabel: 'Open Local',
    link: links[2],
    platform: 'local',
    rel: undefined,
    target: undefined,
    toast: 'Opening Local',
  })
})

test('contact links view packages email and social display state', () => {
  assert.deepEqual(getContactLinksView(links), {
    emailAction: {
      link: links[0],
      platform: 'email',
      toast: 'Opening email',
    },
    emailAddress: 'hunter@example.com',
    emailAriaLabel: 'Email me directly at hunter@example.com',
    emailLink: links[0],
    socialLinks: [
      {
        ariaLabel: 'Open GitHub',
        link: links[1],
        platform: 'github',
        rel: 'noreferrer',
        target: '_blank',
        toast: 'Opening GitHub',
      },
      {
        ariaLabel: 'Open Local',
        link: links[2],
        platform: 'local',
        rel: undefined,
        target: undefined,
        toast: 'Opening Local',
      },
    ],
  })
})

test('activateContactLink preserves haptic, analytics, and toast ordering', () => {
  const action = getContactLinkAction(links[1])
  const calls: unknown[] = []

  activateContactLink({
    action,
    showToast: (message) => calls.push(['toast', message]),
    trackExternalLink: (href, platform) => calls.push(['external', href, platform]),
    triggerHaptic: (style) => calls.push(['haptic', style]),
  })

  assert.deepEqual(calls, [
    ['haptic', 'light'],
    ['external', 'https://github.com/hunterbastian', 'github'],
    ['toast', 'Opening GitHub'],
  ])
})
