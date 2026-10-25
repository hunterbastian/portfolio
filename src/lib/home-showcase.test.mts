import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { contactSocialLinks, creatingLinks } from '../content/homepage.ts'
import { siteConfig, siteMailtoHref } from './site.ts'
import {
  HOME_SHOWCASE_SLUGS,
  buildShowcaseSlides,
  formatDenverClock,
  getShowcaseBio,
  getShowcaseCaption,
  getShowcaseChrome,
  getShowcaseEndeavors,
  getShowcaseFrame,
  getShowcaseHash,
  getShowcaseIndexFromHash,
  getShowcaseKeyboardAction,
  getShowcaseLinks,
  getShowcaseTravelDirection,
  getShowcaseWebsiteProjectHref,
  SHOWCASE_WEBSITE_PROJECT_LINE,
  getShowcaseVideoSrc,
  planShowcaseSlideMotion,
  HOME_SHOWCASE_CANVAS,
  HOME_SHOWCASE_THEME_STORAGE_KEY,
} from './home-showcase.ts'

test('frame query selects a preview variant and otherwise stays on the current card', () => {
  assert.equal(getShowcaseFrame(''), 'current')
  assert.equal(getShowcaseFrame('?frame=a'), 'a')
  assert.equal(getShowcaseFrame('?frame=b'), 'b')
  assert.equal(getShowcaseFrame('?frame=c'), 'c')
  assert.equal(getShowcaseFrame('?frame=nope'), 'current')
})

test('showcase slides follow the homepage order and MDX fields', () => {
  const slides = buildShowcaseSlides([
    {
      slug: 'nutricost',
      frontmatter: {
        title: 'Nutricost',
        description: 'Labels',
        category: 'Graphic Design',
        tags: [],
        image: '/old.webp',
        date: '2025-11-26',
      },
    },
    {
      slug: 'rain',
      frontmatter: {
        title: 'RAIN',
        description: 'A calm rain and koi-pond game.',
        category: 'Game',
        tags: [],
        image: '/old.webp',
        date: '2026-01-01',
      },
    },
    {
      slug: 'mentalhealth-minisite',
      frontmatter: {
        title: 'Mental Health Mini Site',
        description: 'A clear starting point.',
        category: 'Web Design',
        tags: [],
        image: '/old.webp',
        date: '2026-05-05',
      },
    },
    ...HOME_SHOWCASE_SLUGS.filter((slug) => slug !== 'nutricost' && slug !== 'mentalhealth-minisite' && slug !== 'rain').map((slug) => ({
      slug,
      frontmatter: {
        title: slug,
        description: slug,
        category: 'Mobile Design',
        tags: [],
        image: '/old.webp',
        date: '2025-01-01',
      },
    })),
  ])

  assert.deepEqual(slides.map((slide) => slide.slug), [...HOME_SHOWCASE_SLUGS])
  assert.equal(slides[0]?.title, 'Mental Health Mini Site')
  assert.equal(slides[0]?.year, '2026')
  assert.equal(slides[0]?.category, 'Web Design')
  assert.equal(slides[0]?.imageSrc, '/showcase/mentalhealth-minisite.webp')
  assert.equal('darkImageSrc' in (slides[0] ?? {}), false)
  assert.equal(slides[0]?.videoSrc, '/showcase/mentalhealth-minisite-loop.mp4')
  const rain = slides[HOME_SHOWCASE_SLUGS.indexOf('rain')]
  assert.equal(rain?.title, 'RAIN')
  assert.equal(rain?.year, '2026')
  assert.equal(rain?.category, 'Game')
  assert.equal(rain?.imageSrc, '/showcase/rain.webp')
  assert.equal(rain?.videoSrc, '/showcase/rain-loop.mp4')
  assert.equal(getShowcaseVideoSrc('rain'), '/showcase/rain-loop.mp4')
  assert.equal(slides.at(-1)?.category, 'Graphic')
  assert.equal(slides.at(-1)?.videoSrc, '/showcase/nutricost-loop.mp4')
  assert.equal(getShowcaseVideoSrc('lumo'), null)
  assert.equal(getShowcaseCaption(0, slides.length, slides[0]!).lead, '1 of 8 — Mental Health Mini Site, 2026')
  assert.equal(getShowcaseCaption(0, slides.length, slides[0]!).tag, 'Web Design')
  assert.equal(getShowcaseCaption(HOME_SHOWCASE_SLUGS.indexOf('rain'), slides.length, rain!).lead, '4 of 8 — RAIN, 2026')
  assert.equal(getShowcaseCaption(HOME_SHOWCASE_SLUGS.indexOf('rain'), slides.length, rain!).tag, 'Game')
})

test('arrow keys move the showcase and ignore typing or modifiers', () => {
  assert.equal(getShowcaseKeyboardAction({ key: 'ArrowRight' }), 'next')
  assert.equal(getShowcaseKeyboardAction({ key: 'ArrowLeft' }), 'previous')
  assert.equal(getShowcaseKeyboardAction({ key: 'ArrowUp' }), null)
  assert.equal(getShowcaseKeyboardAction({ key: 'ArrowRight', shiftKey: true }), null)
  assert.equal(getShowcaseKeyboardAction({ key: 'ArrowLeft', altKey: true }), null)
  assert.equal(getShowcaseKeyboardAction({ key: 'ArrowRight', metaKey: true }), null)
  assert.equal(getShowcaseKeyboardAction({ key: 'ArrowLeft', ctrlKey: true }), null)
  assert.equal(getShowcaseKeyboardAction({ key: 'ArrowRight', target: { tagName: 'INPUT' } }), null)
  assert.equal(getShowcaseKeyboardAction({ key: 'ArrowLeft', target: { tagName: 'textarea' } }), null)
  assert.equal(getShowcaseKeyboardAction({ key: 'ArrowRight', target: { tagName: 'DIV', isContentEditable: true } }), null)
  assert.equal(getShowcaseKeyboardAction({ key: 'ArrowRight', target: { tagName: 'BUTTON' } }), 'next')
})

test('hash indexes clamp to the showcase length', () => {
  assert.equal(getShowcaseIndexFromHash('', 7), 0)
  assert.equal(getShowcaseIndexFromHash('#1', 7), 0)
  assert.equal(getShowcaseIndexFromHash('#7', 7), 6)
  assert.equal(getShowcaseIndexFromHash('#8', 7), 6)
  assert.equal(getShowcaseIndexFromHash('#0', 7), 0)
  assert.equal(getShowcaseHash(0), '#1')
  assert.equal(getShowcaseHash(6), '#7')
})

test('endeavors and links reuse the existing site URLs', () => {
  const endeavors = getShowcaseEndeavors()
  assert.deepEqual(
    endeavors.map((item) => item.label),
    ['Studio Alpine', 'Studio Cala'],
  )
  assert.deepEqual(endeavors.map((item) => item.meta), [
    'Photography',
    'Web studio',
  ])
  assert.equal(endeavors.some((item) => item.label === 'Playground'), false)

  for (const endeavor of endeavors) {
    const source = creatingLinks.find((link) => link.label === endeavor.label)
    assert.equal(endeavor.href, source?.href)
  }

  const links = getShowcaseLinks()
  assert.deepEqual(links.map((link) => link.label), ['Start a project', 'Resume', 'Email', 'LinkedIn', 'GitHub'])
  assert.deepEqual(links.filter((link) => link.primary).map((link) => link.label), ['Start a project'])
  assert.equal(links[1]?.primary, undefined)
  const project = new URL(links[0]?.href ?? '')
  assert.equal(project.protocol, 'mailto:')
  assert.equal(project.pathname, siteConfig.email)
  assert.equal(project.searchParams.get('subject'), 'Website project')
  assert.match(project.searchParams.get('body') ?? '', /project, timeline, and budget/i)
  assert.equal(links[0]?.href, getShowcaseWebsiteProjectHref())
  assert.equal(links[0]?.copyOnClick, undefined)
  assert.equal(links[1]?.href, '/cv')
  assert.equal(links[2]?.href, siteMailtoHref)
  assert.equal(links[2]?.copyOnClick, true)
  assert.equal(links[3]?.href, contactSocialLinks.find((link) => link.label === 'LinkedIn')?.href)
  assert.equal(links[4]?.href, contactSocialLinks.find((link) => link.label === 'GitHub')?.href)
  assert.equal(getShowcaseBio(), `${siteConfig.siteDescription} ${SHOWCASE_WEBSITE_PROJECT_LINE}`)
  assert.equal(getShowcaseBio().includes('open to product design roles'), true)
  assert.equal(getShowcaseBio().includes('from first sketch to shipped code'), false)
  assert.equal(siteConfig.siteDescription.includes(SHOWCASE_WEBSITE_PROJECT_LINE), false)
})

test('homepage chrome is the light canvas only', () => {
  assert.equal(HOME_SHOWCASE_CANVAS, '#F7F7F5')
  assert.deepEqual(getShowcaseChrome(), {
    canvas: '#F7F7F5',
    colorScheme: 'light',
    statusBar: 'default',
  })
})

test('a stored theme is cleared and the page stays light', () => {
  assert.equal(HOME_SHOWCASE_THEME_STORAGE_KEY, 'hb-showcase-theme')

  const css = readFileSync(new URL('../app/home-showcase.css', import.meta.url), 'utf8')
  const layout = readFileSync(new URL('../app/layout.tsx', import.meta.url), 'utf8')
  assert.ok(css.includes('#f7f7f5'))
  assert.equal(css.includes('#232323'), false)
  assert.equal(css.includes('#262626'), false)
  assert.equal(css.includes('data-home-showcase-theme'), false)
  assert.equal(css.includes('showcase-theme-switch'), false)
  assert.equal(css.includes('prefers-color-scheme'), false)
  assert.equal(layout.includes('prefers-color-scheme'), false)
  assert.equal(layout.includes('pref!=="light"'), false)
  assert.equal(layout.includes('-transparent.webp'), false)
  assert.ok(layout.includes('localStorage.removeItem("${HOME_SHOWCASE_THEME_STORAGE_KEY}")'))
  assert.ok(layout.includes('content="light"'))
  assert.ok(layout.includes('content="default"'))
  assert.ok(layout.includes('background-color:${HOME_SHOWCASE_CANVAS}'))
})

test('showcase travel direction follows the click, including wrap', () => {
  assert.equal(getShowcaseTravelDirection(0, 1, 7), 1)
  assert.equal(getShowcaseTravelDirection(3, 1, 7), -1)
  assert.equal(getShowcaseTravelDirection(6, 0, 7), 1)
  assert.equal(getShowcaseTravelDirection(0, 6, 7), -1)
})

test('showcase slide motion drifts from the visible slide and does not restart a partial fade', () => {
  const forward = planShowcaseSlideMotion({
    direction: 1,
    nextIndex: 1,
    opacities: [1, 0, 0],
    previousIndex: 0,
    reduced: false,
    transforms: ['none', 'none', 'none'],
  })
  assert.equal(forward?.source, 0)
  assert.equal(forward?.duration, 250)
  assert.equal(forward?.easing, 'cubic-bezier(0.22, 1, 0.36, 1)')
  assert.equal(forward?.exit[1]?.transform, 'translate3d(-8px, 0, 0)')
  assert.equal(forward?.enter[0]?.transform, 'translate3d(8px, 0, 0)')
  assert.deepEqual(forward?.departures, [])
  assert.deepEqual(forward?.hidden, [2])

  const backward = planShowcaseSlideMotion({
    direction: -1,
    nextIndex: 0,
    opacities: [0, 1],
    previousIndex: 1,
    reduced: false,
    transforms: ['none', 'none'],
  })
  assert.equal(backward?.exit[1]?.transform, 'translate3d(8px, 0, 0)')
  assert.equal(backward?.enter[0]?.transform, 'translate3d(-8px, 0, 0)')

  const interrupted = planShowcaseSlideMotion({
    direction: 1,
    nextIndex: 2,
    opacities: [0.7, 0.3, 0],
    previousIndex: 1,
    reduced: false,
    transforms: ['matrix(1, 0, 0, 1, -2, 0)', 'matrix(1, 0, 0, 1, 4, 0)', 'none'],
  })
  assert.equal(interrupted?.source, 0)
  assert.equal(interrupted?.exit[0]?.transform, 'matrix(1, 0, 0, 1, -2, 0)')
  assert.equal(interrupted?.exit[0]?.opacity, 0.7)
  assert.equal(interrupted?.enter[0]?.transform, 'translate3d(8px, 0, 0)')
  assert.deepEqual(interrupted?.hidden, [])
  assert.equal(interrupted?.departures.length, 1)
  assert.equal(interrupted?.departures[0]?.index, 1)
  assert.equal(interrupted?.departures[0]?.keyframes[0]?.opacity, 0.3)
  assert.equal(interrupted?.departures[0]?.keyframes[0]?.transform, 'matrix(1, 0, 0, 1, 4, 0)')
  assert.equal(interrupted?.departures[0]?.keyframes[1]?.opacity, 0)
  assert.equal(interrupted?.departures[0]?.keyframes[1]?.transform, 'matrix(1, 0, 0, 1, 4, 0)')

  const reduced = planShowcaseSlideMotion({
    direction: 1,
    nextIndex: 1,
    opacities: [1, 0],
    previousIndex: 0,
    reduced: true,
    transforms: ['none', 'none'],
  })
  assert.equal(reduced?.duration, 0)
  assert.equal(reduced?.exit[1]?.transform, 'none')
  assert.equal(reduced?.enter[1]?.transform, 'none')
})

test('Denver clock uses 24-hour time and a short zone name', () => {
  assert.equal(formatDenverClock(new Date('2026-10-19T18:14:32Z')), '12:14:32 MDT')
  assert.equal(formatDenverClock(new Date('2026-01-15T04:16:49Z')), '21:16:49 MST')
})
