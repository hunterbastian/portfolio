import assert from 'node:assert/strict'
import test from 'node:test'

import {
  CV_CONTACT_LINKS,
  CV_CONTACT_LIST_CLASS_NAME,
  CV_EMAIL_ADDRESS,
  CV_LINKEDIN_LABEL,
  CV_LINKEDIN_URL,
  CV_LOCATION_LABEL,
  CV_ITEM_ENTRANCE_BASE_DELAY,
  CV_ITEM_ENTRANCE_DURATION,
  CV_ITEM_HIDDEN_MOTION,
  CV_ITEM_STAGGER_DELAY,
  CV_PORTFOLIO_LABEL,
  CV_PORTFOLIO_URL,
  CV_PRINT_ARIA_LABEL,
  CV_PRINT_BUTTON_CLASS_NAME,
  CV_PRINT_BUTTON_LABEL,
  CV_RESUME_PRINT_ACTION,
  CV_RESUME_VIEW_ACTION,
  activateCvContactClick,
  activateCvPrint,
  getCvContactAnalyticsEvent,
  getCvContactLinkClassName,
  getCvItemVisibleMotion,
} from './cv-page.ts'

test('cv page constants preserve visible contact and print copy', () => {
  assert.equal(CV_LOCATION_LABEL, 'Utah, USA')
  assert.equal(CV_PRINT_BUTTON_LABEL, 'Print')
  assert.equal(CV_PRINT_ARIA_LABEL, 'Print or save as PDF')
  assert.equal(CV_RESUME_VIEW_ACTION, 'view')
  assert.equal(CV_RESUME_PRINT_ACTION, 'print')
  assert.match(CV_PRINT_BUTTON_CLASS_NAME, /print:hidden/)
  assert.match(CV_PRINT_BUTTON_CLASS_NAME, /min-h-\[40px\]/)
  assert.match(CV_CONTACT_LIST_CLASS_NAME, /flex flex-wrap/)
})

test('cv contact links preserve hrefs and analytics routes', () => {
  assert.deepEqual(CV_CONTACT_LINKS, [
    {
      label: CV_EMAIL_ADDRESS,
      href: `mailto:${CV_EMAIL_ADDRESS}`,
      analytics: { kind: 'external', platform: 'email' },
    },
    {
      label: CV_PORTFOLIO_LABEL,
      href: CV_PORTFOLIO_URL,
      analytics: { kind: 'navigation', target: 'portfolio_link' },
      printNoUnderline: true,
    },
    {
      label: CV_LINKEDIN_LABEL,
      href: CV_LINKEDIN_URL,
      analytics: { kind: 'external', platform: 'linkedin' },
    },
  ])
})

test('cv contact analytics helper preserves external and navigation events', () => {
  const [emailLink, portfolioLink, linkedinLink] = CV_CONTACT_LINKS

  assert.deepEqual(getCvContactAnalyticsEvent(emailLink!), {
    href: `mailto:${CV_EMAIL_ADDRESS}`,
    kind: 'external',
    platform: 'email',
  })
  assert.deepEqual(getCvContactAnalyticsEvent(portfolioLink!), {
    kind: 'navigation',
    target: 'portfolio_link',
  })
  assert.deepEqual(getCvContactAnalyticsEvent(linkedinLink!), {
    href: CV_LINKEDIN_URL,
    kind: 'external',
    platform: 'linkedin',
  })
})

test('activateCvContactClick routes external and navigation analytics', () => {
  const [emailLink, portfolioLink] = CV_CONTACT_LINKS
  const calls: unknown[] = []

  activateCvContactClick({
    link: emailLink!,
    trackExternalLink: (href, platform) => calls.push(['external', href, platform]),
    trackNavigationClick: (target) => calls.push(['navigation', target]),
  })
  activateCvContactClick({
    link: portfolioLink!,
    trackExternalLink: (href, platform) => calls.push(['external', href, platform]),
    trackNavigationClick: (target) => calls.push(['navigation', target]),
  })

  assert.deepEqual(calls, [
    ['external', `mailto:${CV_EMAIL_ADDRESS}`, 'email'],
    ['navigation', 'portfolio_link'],
  ])
})

test('activateCvPrint tracks the print action before opening print', () => {
  const calls: unknown[] = []

  activateCvPrint({
    printPage: () => calls.push('print'),
    trackResumeAction: (action) => calls.push(['resume', action]),
  })

  assert.deepEqual(calls, [
    ['resume', 'print'],
    'print',
  ])
})

test('cv contact link class helper preserves print and interaction states', () => {
  assert.match(getCvContactLinkClassName(), /touch-manipulation/)
  assert.match(getCvContactLinkClassName(), /active:scale-\[0\.96\]/)
  assert.doesNotMatch(getCvContactLinkClassName(), /print:no-underline/)
  assert.match(getCvContactLinkClassName(true), /print:no-underline/)
})

test('cv item motion helpers preserve staggered and reduced-motion timing', () => {
  assert.equal(CV_ITEM_STAGGER_DELAY, 0.06)
  assert.equal(CV_ITEM_ENTRANCE_BASE_DELAY, 0.3)
  assert.equal(CV_ITEM_ENTRANCE_DURATION, 0.4)
  assert.deepEqual(CV_ITEM_HIDDEN_MOTION, { opacity: 0, y: 8 })
  assert.deepEqual(getCvItemVisibleMotion(2, false), {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.42,
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  })
  assert.deepEqual(getCvItemVisibleMotion(2, true), {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0,
      duration: 0,
      ease: [0.16, 1, 0.3, 1],
    },
  })
})
