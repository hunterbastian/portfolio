import assert from 'node:assert/strict'
import test from 'node:test'

import {
  PROJECT_CONTACT_CTA_ACTION_CLASS_NAME,
  PROJECT_CONTACT_CTA_COPY,
  PROJECT_CONTACT_CTA_EMAIL_PLATFORM,
  PROJECT_CONTACT_CTA_HAPTIC_STYLE,
  PROJECT_CONTACT_CTA_ICON_CLASS_NAME,
  PROJECT_CONTACT_CTA_RESUME_HREF,
  PROJECT_CONTACT_CTA_RESUME_TARGET,
  PROJECT_CONTACT_CTA_SOURCE,
  activateProjectContactCtaAction,
  getProjectContactAnalyticsContext,
  getProjectContactCtaActions,
  getProjectContactEmailAriaLabel,
  getProjectContactResumeAriaLabel,
} from './project-contact-cta.ts'

test('project contact CTA constants preserve copy and analytics targets', () => {
  assert.equal(PROJECT_CONTACT_CTA_SOURCE, 'project_cta')
  assert.equal(PROJECT_CONTACT_CTA_RESUME_TARGET, 'project_cta_resume')
  assert.equal(PROJECT_CONTACT_CTA_EMAIL_PLATFORM, 'email')
  assert.equal(PROJECT_CONTACT_CTA_RESUME_HREF, '/cv')
  assert.equal(PROJECT_CONTACT_CTA_HAPTIC_STYLE, 'light')
  assert.match(PROJECT_CONTACT_CTA_ACTION_CLASS_NAME, /min-h-\[40px\]/)
  assert.match(PROJECT_CONTACT_CTA_ACTION_CLASS_NAME, /active:scale-\[0\.96\]/)
  assert.match(PROJECT_CONTACT_CTA_ICON_CLASS_NAME, /h-3\.5/)
  assert.match(PROJECT_CONTACT_CTA_ICON_CLASS_NAME, /group-hover:text-foreground/)
  assert.equal(PROJECT_CONTACT_CTA_COPY.eyebrow, 'Work together')
  assert.equal(PROJECT_CONTACT_CTA_COPY.resumeToast, 'Opening resume')
  assert.equal(PROJECT_CONTACT_CTA_COPY.emailToast, 'Opening email')
})

test('project contact CTA analytics context keeps camelCase contract for analytics helpers', () => {
  assert.deepEqual(getProjectContactAnalyticsContext('lumo', 'Lumo'), {
    source: 'project_cta',
    projectSlug: 'lumo',
    projectTitle: 'Lumo',
  })
})

test('project contact CTA aria labels include project and person context', () => {
  assert.equal(
    getProjectContactResumeAriaLabel('Middle-Earth Journey'),
    'View resume after reading Middle-Earth Journey',
  )
  assert.equal(
    getProjectContactEmailAriaLabel('Hunter Bastian', 'Middle-Earth Journey'),
    'Email Hunter Bastian about work like Middle-Earth Journey',
  )
})

test('project contact CTA actions preserve order, labels, analytics, and aria metadata', () => {
  assert.deepEqual(
    getProjectContactCtaActions({
      inquiryHref: 'mailto:hunter@example.com',
      personName: 'Hunter Bastian',
      projectTitle: 'Middle-Earth Journey',
    }),
    [
      {
        analyticsKind: 'navigation',
        analyticsTarget: 'project_cta_resume',
        ariaLabel: 'View resume after reading Middle-Earth Journey',
        href: '/cv',
        icon: 'file-text',
        label: 'View resume',
        toast: 'Opening resume',
      },
      {
        analyticsKind: 'external',
        analyticsTarget: 'email',
        ariaLabel: 'Email Hunter Bastian about work like Middle-Earth Journey',
        href: 'mailto:hunter@example.com',
        icon: 'mail',
        label: 'Email me',
        toast: 'Opening email',
      },
    ],
  )
})

test('activateProjectContactCtaAction tracks resume navigation action ordering', () => {
  const analyticsContext = getProjectContactAnalyticsContext('lumo', 'Lumo')
  const [resumeAction] = getProjectContactCtaActions({
    inquiryHref: 'mailto:hunter@example.com',
    personName: 'Hunter Bastian',
    projectTitle: 'Lumo',
  })
  const calls: unknown[] = []

  assert.ok(resumeAction)

  activateProjectContactCtaAction({
    action: resumeAction,
    analyticsContext,
    showToast: (message) => calls.push(['toast', message]),
    trackExternalLink: (href, platform, context) => calls.push(['external', href, platform, context]),
    trackNavigationClick: (target, context) => calls.push(['navigation', target, context]),
    triggerHaptic: (style) => calls.push(['haptic', style]),
  })

  assert.deepEqual(calls, [
    ['haptic', 'light'],
    ['navigation', 'project_cta_resume', analyticsContext],
    ['toast', 'Opening resume'],
  ])
})

test('activateProjectContactCtaAction tracks email external action ordering', () => {
  const analyticsContext = getProjectContactAnalyticsContext('lumo', 'Lumo')
  const [, emailAction] = getProjectContactCtaActions({
    inquiryHref: 'mailto:hunter@example.com',
    personName: 'Hunter Bastian',
    projectTitle: 'Lumo',
  })
  const calls: unknown[] = []

  assert.ok(emailAction)

  activateProjectContactCtaAction({
    action: emailAction,
    analyticsContext,
    showToast: (message) => calls.push(['toast', message]),
    trackExternalLink: (href, platform, context) => calls.push(['external', href, platform, context]),
    trackNavigationClick: (target, context) => calls.push(['navigation', target, context]),
    triggerHaptic: (style) => calls.push(['haptic', style]),
  })

  assert.deepEqual(calls, [
    ['haptic', 'light'],
    ['external', 'mailto:hunter@example.com', 'email', analyticsContext],
    ['toast', 'Opening email'],
  ])
})
