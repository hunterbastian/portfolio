import assert from 'node:assert/strict'
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
  getShowcaseHash,
  getShowcaseIndexFromHash,
  getShowcaseLinks,
  getShowcaseVideoSrc,
} from './home-showcase.ts'

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
    ...HOME_SHOWCASE_SLUGS.filter((slug) => slug !== 'nutricost' && slug !== 'mentalhealth-minisite').map((slug) => ({
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
  assert.equal(slides[0]?.darkImageSrc, '/showcase/mentalhealth-minisite-transparent.webp')
  assert.equal(slides.at(-1)?.darkImageSrc, '/showcase/nutricost-transparent.webp')
  assert.equal(slides[0]?.videoSrc, '/showcase/mentalhealth-minisite-loop.mp4')
  assert.equal(slides.at(-1)?.category, 'Graphic')
  assert.equal(slides.at(-1)?.videoSrc, '/showcase/nutricost-loop.mp4')
  assert.equal(getShowcaseVideoSrc('lumo'), null)
  assert.equal(getShowcaseCaption(0, slides.length, slides[0]!).lead, '1 of 7 — Mental Health Mini Site, 2026')
  assert.equal(getShowcaseCaption(0, slides.length, slides[0]!).tag, 'Web Design')
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
    ['Studio Alpine', 'Studio Cala', 'Above / Utah', 'Alcove', 'parallax.'],
  )
  assert.deepEqual(endeavors.map((item) => item.meta), [
    'Photography',
    'Web studio',
    'Hiking app',
    'Coffee guide',
    'Model viewer',
  ])

  for (const endeavor of endeavors) {
    const source = creatingLinks.find((link) => link.label === endeavor.label)
    assert.equal(endeavor.href, source?.href)
  }

  const links = getShowcaseLinks()
  assert.deepEqual(links.map((link) => link.label), ['Resume', 'Email', 'LinkedIn', 'GitHub'])
  assert.equal(links[0]?.href, '/cv')
  assert.equal(links[1]?.href, siteMailtoHref)
  assert.equal(links[2]?.href, contactSocialLinks.find((link) => link.label === 'LinkedIn')?.href)
  assert.equal(links[3]?.href, contactSocialLinks.find((link) => link.label === 'GitHub')?.href)
  assert.equal(getShowcaseBio(), siteConfig.siteDescription)
  assert.equal(getShowcaseBio().includes('from first sketch to shipped code'), false)
})

test('homepage chrome follows the system color scheme', () => {
  assert.deepEqual(getShowcaseChrome(false), {
    canvas: '#F7F7F5',
    colorScheme: 'light',
    statusBar: 'default',
  })
  assert.deepEqual(getShowcaseChrome(true), {
    canvas: '#0E0E0D',
    colorScheme: 'dark',
    statusBar: 'black',
  })
})

test('Denver clock uses 24-hour time and a short zone name', () => {
  assert.equal(formatDenverClock(new Date('2026-10-19T18:14:32Z')), '12:14:32 MDT')
  assert.equal(formatDenverClock(new Date('2026-01-15T04:16:49Z')), '21:16:49 MST')
})
