import assert from 'node:assert/strict'
import test from 'node:test'

import {
  activateTrackedExternalLink,
  getTrackedExternalLinkAnalyticsContext,
  getTrackedExternalLinkAnalyticsPayload,
  getTrackedExternalLinkRel,
} from './tracked-external-link.ts'

test('tracked external link analytics context preserves camelCase payload keys', () => {
  assert.deepEqual(
    getTrackedExternalLinkAnalyticsContext({
      trackingSource: 'case-study',
      projectSlug: 'lumo',
      projectTitle: 'Lumo',
    }),
    {
      source: 'case-study',
      projectSlug: 'lumo',
      projectTitle: 'Lumo',
    }
  )
})

test('tracked external link analytics payload preserves href, platform, and context', () => {
  assert.deepEqual(
    getTrackedExternalLinkAnalyticsPayload({
      href: 'https://example.com',
      platform: 'github',
      trackingSource: 'case-study',
      projectSlug: 'lumo',
      projectTitle: 'Lumo',
    }),
    {
      href: 'https://example.com',
      platform: 'github',
      context: {
        source: 'case-study',
        projectSlug: 'lumo',
        projectTitle: 'Lumo',
      },
    }
  )
})

test('tracked external link rel helper delegates blank-target safety', () => {
  assert.equal(getTrackedExternalLinkRel('_blank'), 'noopener noreferrer')
  assert.equal(getTrackedExternalLinkRel('_self'), undefined)
  assert.equal(getTrackedExternalLinkRel('_blank', 'nofollow'), 'nofollow')
})

test('activateTrackedExternalLink tracks analytics before caller click handler', () => {
  const event = { type: 'click' }
  const calls: unknown[] = []

  activateTrackedExternalLink({
    event,
    href: 'https://example.com/demo?ref=portfolio',
    onClick: (receivedEvent) => calls.push(['caller', receivedEvent]),
    platform: 'demo',
    projectSlug: 'lumo',
    projectTitle: 'Lumo',
    trackExternalLink: (href, platform, context) => calls.push(['analytics', href, platform, context]),
    trackingSource: 'case-study',
  })

  assert.deepEqual(calls, [
    [
      'analytics',
      'https://example.com/demo?ref=portfolio',
      'demo',
      {
        source: 'case-study',
        projectSlug: 'lumo',
        projectTitle: 'Lumo',
      },
    ],
    ['caller', event],
  ])
})
