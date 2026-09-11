import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  HOME_SECTION_NAV_ARIA_LABEL,
  HOME_SECTION_NAV_HAPTIC_STYLE,
  HOME_SECTION_NAV_ITEMS,
  HOME_SECTION_NAV_SCROLL_OFFSET_PX,
  activateHomeSectionNavigation,
  getActiveHomeSectionId,
  getHomeSectionNavProbeOffset,
  getHomeSectionHash,
  getHomeSectionHref,
  getHomeSectionNavAriaCurrent,
  getHomeSectionNavLinkClassName,
  getHomeSectionPositions,
  getHomeSectionScrollBehavior,
  getHomeSectionScrollOptions,
  isHomeSectionNavPath,
  shouldShowHomeSectionNav,
} from './home-section-nav.ts'

test('HOME_SECTION_NAV_ITEMS maps homepage destinations to short labels', () => {
  assert.deepEqual(
    HOME_SECTION_NAV_ITEMS.map((item) => ({ id: item.id, name: item.name })),
    [
      { id: 'home', name: 'Home' },
      { id: 'projects', name: 'Work' },
      { id: 'playground', name: 'Play' },
      { id: 'background', name: 'Background' },
    ],
  )
})

test('homepage section ids exist on the current homepage structure', () => {
  const hero = readFileSync(new URL('../components/home/HomeHeroSection.tsx', import.meta.url), 'utf8')
  const background = readFileSync(new URL('../components/home/HomeBackgroundSection.tsx', import.meta.url), 'utf8')
  const projects = readFileSync(new URL('../components/home/HomeProjectsSection.tsx', import.meta.url), 'utf8')
  const playground = readFileSync(new URL('../components/home/HomePlaygroundSection.tsx', import.meta.url), 'utf8')

  assert.match(hero, /id="home"/)
  assert.match(hero, /id="contact"/)
  assert.match(projects, /id="projects"/)
  assert.match(playground, /id="playground"/)
  assert.match(background, /id="background"/)
})

test('home section href and hash helpers keep shareable anchors', () => {
  assert.equal(getHomeSectionHref('home'), '/#home')
  assert.equal(getHomeSectionHref('projects'), '/#projects')
  assert.equal(getHomeSectionHash('contact'), '#contact')
  assert.equal(HOME_SECTION_NAV_ARIA_LABEL, 'On this page')
})

test('section nav is homepage-only', () => {
  assert.equal(isHomeSectionNavPath('/'), true)
  assert.equal(isHomeSectionNavPath('/archive'), false)
  assert.equal(shouldShowHomeSectionNav('/'), true)
  assert.equal(shouldShowHomeSectionNav('/cv'), false)
})

test('getHomeSectionPositions keeps missing sections out of the active probe', () => {
  assert.deepEqual(
    getHomeSectionPositions(
      [{ id: 'home' }, { id: 'projects' }],
      (sectionId) => (sectionId === 'home' ? 0 : null),
    ),
    [
      { id: 'home', top: 0 },
      { id: 'projects', top: Number.POSITIVE_INFINITY },
    ],
  )
})

test('getActiveHomeSectionId follows the last section whose top has crossed the header offset', () => {
  const sections = [
    { id: 'home', top: 0 },
    { id: 'projects', top: 800 },
    { id: 'playground', top: 1400 },
    { id: 'background', top: 2000 },
  ]

  assert.equal(getActiveHomeSectionId(sections, 0), 'home')
  assert.equal(getActiveHomeSectionId(sections, 700), 'home')
  assert.equal(getActiveHomeSectionId(sections, 800 - HOME_SECTION_NAV_SCROLL_OFFSET_PX), 'projects')
  assert.equal(getActiveHomeSectionId(sections, 1450), 'playground')
  assert.equal(getActiveHomeSectionId(sections, 4000), 'background')
  assert.equal(
    getActiveHomeSectionId(sections, 2200, HOME_SECTION_NAV_SCROLL_OFFSET_PX, {
      documentHeight: 2800,
      height: 800,
    }),
    'background',
  )
  assert.equal(getActiveHomeSectionId([], 120), '')
})

test('getActiveHomeSectionId uses a reading-band probe so Background wins while it is in view', () => {
  const sections = [
    { id: 'home', top: 0 },
    { id: 'projects', top: 800 },
    { id: 'playground', top: 1400 },
    { id: 'background', top: 2000 },
  ]
  const viewport = { documentHeight: 3200, height: 800 }

  assert.equal(getHomeSectionNavProbeOffset(HOME_SECTION_NAV_SCROLL_OFFSET_PX, 800), 288)
  assert.equal(
    getActiveHomeSectionId(sections, 1800, HOME_SECTION_NAV_SCROLL_OFFSET_PX, viewport),
    'background',
  )
  assert.equal(
    getActiveHomeSectionId(sections, 1450, HOME_SECTION_NAV_SCROLL_OFFSET_PX, viewport),
    'playground',
  )
  assert.equal(
    getActiveHomeSectionId(sections, 2312, HOME_SECTION_NAV_SCROLL_OFFSET_PX, viewport),
    'background',
  )
})

test('home section scrolling respects reduced motion', () => {
  assert.equal(getHomeSectionScrollBehavior(false), 'smooth')
  assert.equal(getHomeSectionScrollBehavior(true), 'auto')
  assert.deepEqual(getHomeSectionScrollOptions(false), { behavior: 'smooth', block: 'start' })
  assert.deepEqual(getHomeSectionScrollOptions(true), { behavior: 'auto', block: 'start' })
})

test('activateHomeSectionNavigation scrolls, updates the hash, and skips toasts', () => {
  const calls: unknown[] = []

  activateHomeSectionNavigation({
    closeMobileMenu: () => calls.push('close-menu'),
    findSectionElement: (sectionId) => {
      calls.push(['find', sectionId])

      return {
        scrollIntoView: (options) => calls.push(['scroll', options]),
      }
    },
    prefersReducedMotion: true,
    replaceUrl: (href) => calls.push(['url', href]),
    sectionId: 'playground',
    trackNavigationClick: (target) => calls.push(['navigation', target]),
    triggerHaptic: (style) => calls.push(['haptic', style]),
  })

  assert.deepEqual(calls, [
    ['haptic', HOME_SECTION_NAV_HAPTIC_STYLE],
    ['navigation', 'section_playground'],
    'close-menu',
    ['find', 'playground'],
    ['scroll', { behavior: 'auto', block: 'start' }],
    ['url', '/#playground'],
  ])
})

test('top meta hosts homepage section jumps without dropping the mobile playground link', () => {
  const source = readFileSync(new URL('../components/TopMeta.tsx', import.meta.url), 'utf8')

  assert.match(source, /HOME_SECTION_NAV_ITEMS/)
  assert.match(source, /getTopMetaMobilePageNavItems/)
  assert.match(source, /persistVisible/)
})

test('home section nav link classes stay a quiet monochrome highlight', () => {
  assert.match(getHomeSectionNavLinkClassName(true), /text-foreground/)
  assert.match(getHomeSectionNavLinkClassName(true), /bg-secondary/)
  assert.doesNotMatch(getHomeSectionNavLinkClassName(true), /#2f7d73|#2383E2|accent/)
  assert.match(getHomeSectionNavLinkClassName(false), /text-muted-foreground/)
  assert.match(getHomeSectionNavLinkClassName(false), /hover:text-foreground/)
  assert.match(getHomeSectionNavLinkClassName(false), /hover:bg-secondary/)
  assert.doesNotMatch(getHomeSectionNavLinkClassName(false), /#2f7d73|#2383E2|accent/)
  assert.match(getHomeSectionNavLinkClassName(false), /text-\[0\.62rem\]/)
  assert.match(getHomeSectionNavLinkClassName(false), /sm:text-\[0\.68rem\]/)
  assert.match(getHomeSectionNavLinkClassName(false), /font-medium/)
  assert.equal(getHomeSectionNavAriaCurrent(true), 'location')
  assert.equal(getHomeSectionNavAriaCurrent(false), undefined)
})
