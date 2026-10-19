import assert from 'node:assert/strict'
import test from 'node:test'

import { educationItems, experienceItems } from '../content/homepage.ts'
import {
  CV_CONTACT_LINKS,
  CV_EMAIL_ADDRESS,
  CV_LINKEDIN_LABEL,
  CV_LINKEDIN_URL,
  CV_LOCATION_LABEL,
  CV_PORTFOLIO_LABEL,
  CV_PORTFOLIO_URL,
  CV_PRINT_ARIA_LABEL,
  CV_PRINT_BUTTON_LABEL,
  CV_RESUME_PRINT_ACTION,
  CV_RESUME_VIEW_ACTION,
  activateCvContactClick,
  activateCvPrint,
  formatCvEducationDetail,
  getCvContactAnalyticsEvent,
  getCvEntryDate,
  getCvEntryDetail,
} from './cv-page.ts'

test('cv page constants preserve visible contact and print copy', () => {
  assert.equal(CV_LOCATION_LABEL, 'Utah, USA')
  assert.equal(CV_PRINT_BUTTON_LABEL, 'Print')
  assert.equal(CV_PRINT_ARIA_LABEL, 'Print or save as PDF')
  assert.equal(CV_RESUME_VIEW_ACTION, 'view')
  assert.equal(CV_RESUME_PRINT_ACTION, 'print')
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

test('cv entry helpers omit blank dates and descriptions', () => {
  assert.equal(getCvEntryDate(''), null)
  assert.equal(getCvEntryDate('   '), null)
  assert.equal(getCvEntryDate('2024 - Present'), '2024 - Present')
  assert.equal(getCvEntryDetail(''), null)
  assert.equal(getCvEntryDetail('  '), null)
  assert.equal(getCvEntryDetail('Produced and edited marketing and product videos for Catapult.'), 'Produced and edited marketing and product videos for Catapult.')
})

test('cv education detail keeps the level and optional note', () => {
  assert.equal(formatCvEducationDetail({ level: 'Certification' }), 'Certification')
  assert.equal(
    formatCvEducationDetail({ level: "Bachelor's Degree", note: "ProdUX at UVU · Dean's List Fall 2024" }),
    "Bachelor's Degree · ProdUX at UVU · Dean's List Fall 2024",
  )
})

test('cv experience keeps every existing role and leads with undated Tesla', () => {
  assert.deepEqual(
    experienceItems.map((item) => [item.company, item.title, item.year, item.description]),
    [
      ['Tesla', 'Data Labeler', '', ''],
      ['Studio Alpine', 'Founder', '2026 - Present', 'Founder of Studio Alpine, a photography and design project.'],
      ['Catapult', 'Video Producer', '2024 - Present', 'Produced and edited marketing and product videos for Catapult.'],
      ['Utah Valley University', 'Department Representative', '2024 - Present', 'Helped new students with internship opportunities in the Web Design and Development program.'],
      ['Nutricost', 'Graphic Design Intern', '2023', 'At Nutricost, I assisted the marketing team and strengthened my knowledge as I worked in the graphic design queue.'],
      ['Clutch', 'Digital Design Intern', '2017', 'At Clutch, I helped with design branding and further improved my knowledge about the UX design process.'],
    ],
  )
  assert.equal(educationItems.length, 6)
  assert.equal(educationItems[0]?.institution, 'Utah Valley University')
  assert.equal(educationItems[0]?.degree, 'B.S. Interaction Design')
})
