import assert from 'node:assert/strict'
import test from 'node:test'

import {
  PROJECT_DETAIL_FINAL_STAGE,
  PROJECT_DETAIL_HERO_INITIAL_Y,
  PROJECT_DETAIL_INITIAL_STAGE,
  PROJECT_DETAIL_LINK_CLASS,
  PROJECT_DETAIL_TIMING,
  activateProjectDetailTransitionTarget,
  activateProjectDetailView,
  formatProjectDate,
  getProjectDetailBreadcrumb,
  getProjectDetailDisplayTitle,
  getProjectDetailItemMotion,
  getProjectDetailLinks,
  getProjectDetailTransitionTarget,
  getProjectPageMetadata,
  getProjectStructuredData,
  resolveProjectImageUrl,
  scheduleProjectDetailRevealStages,
} from './project-detail.ts'
import type { ProjectFrontmatter } from '@/types/project'

const frontmatter: ProjectFrontmatter = {
  title: 'Lumo',
  description: 'Mindfulness app for calm reflection.',
  category: 'Product Design',
  tags: ['mobile', 'mindfulness'],
  image: '/images/lumo.webp',
  date: '2026-02-14',
}

test('resolveProjectImageUrl resolves site-relative images and preserves absolute URLs', () => {
  assert.equal(resolveProjectImageUrl('/images/lumo.webp'), 'https://hunterbastian.com/images/lumo.webp')
  assert.equal(resolveProjectImageUrl('https://cdn.example.com/lumo.webp'), 'https://cdn.example.com/lumo.webp')
})

test('formatProjectDate keeps project dates compact and stable', () => {
  assert.equal(formatProjectDate('2026-02-14'), 'Feb 2026')
  assert.equal(formatProjectDate('not-a-date'), 'not-a-date')
  assert.equal(formatProjectDate(), '')
})

test('project detail display helpers preserve title and breadcrumb behavior', () => {
  assert.equal(getProjectDetailDisplayTitle({ title: 'Lumo', displayTitle: 'Lumo App' }), 'Lumo App')
  assert.equal(getProjectDetailDisplayTitle({ title: 'Lumo' }), 'Lumo')
  assert.deepEqual(getProjectDetailBreadcrumb({ isPlayground: false }), {
    currentLabel: 'Projects',
    href: '/',
    parentLabel: 'Home',
  })
  assert.deepEqual(getProjectDetailBreadcrumb({ isPlayground: true }), {
    currentLabel: 'Projects',
    href: '/archive',
    parentLabel: 'Playground',
  })
})

test('project detail link helper preserves optional link order and labels', () => {
  assert.deepEqual(
    getProjectDetailLinks({
      github: 'https://github.com/example/lumo',
      demo: 'https://example.com/lumo',
      figjam: 'https://figjam.example.com/lumo',
    }),
    [
      {
        href: 'https://github.com/example/lumo',
        kind: 'github',
        label: 'View on GitHub',
        platform: 'github',
      },
      {
        href: 'https://example.com/lumo',
        kind: 'demo',
        label: 'Live Demo',
        platform: 'demo',
      },
      {
        href: 'https://figjam.example.com/lumo',
        kind: 'figjam',
        label: 'View Slides',
        platform: 'figjam',
      },
    ],
  )
  assert.deepEqual(getProjectDetailLinks({ demo: 'https://example.com/lumo' }), [
    {
      href: 'https://example.com/lumo',
      kind: 'demo',
      label: 'Live Demo',
      platform: 'demo',
    },
  ])
  assert.deepEqual(getProjectDetailLinks({}), [])
  assert.match(PROJECT_DETAIL_LINK_CLASS, /hover:-translate-y-\[2px\]/)
})

test('getProjectDetailItemMotion maps detail stages to opacity and y motion', () => {
  assert.equal(PROJECT_DETAIL_INITIAL_STAGE, 0)
  assert.equal(PROJECT_DETAIL_FINAL_STAGE, 4)
  assert.deepEqual(
    getProjectDetailItemMotion({ stage: 1, visibleStage: 2 }),
    { opacity: 0, y: 12 },
  )
  assert.deepEqual(
    getProjectDetailItemMotion({ stage: 2, visibleStage: 2 }),
    { opacity: 1, y: 0 },
  )
  assert.deepEqual(
    getProjectDetailItemMotion({
      initialY: PROJECT_DETAIL_HERO_INITIAL_Y,
      stage: 4,
      transitionActive: true,
      visibleStage: 2,
    }),
    { opacity: 0, y: 0 },
  )
})

test('activateProjectDetailView only tracks complete project view data', () => {
  const calls: string[][] = []
  const trackProjectView = (slug: string, title: string) => calls.push([slug, title])

  activateProjectDetailView({ projectTitle: 'Lumo', slug: 'lumo', trackProjectView })
  activateProjectDetailView({ projectTitle: 'Missing slug', trackProjectView })
  activateProjectDetailView({ slug: 'missing-title', trackProjectView })

  assert.deepEqual(calls, [['lumo', 'Lumo']])
})

test('activateProjectDetailTransitionTarget measures and stores the adjusted hero rect', () => {
  const calls: unknown[] = []

  activateProjectDetailTransitionTarget({
    getHeroRect: () => ({ top: 42, left: 12, width: 640, height: 360 }),
    pageTransitionYOffset: 10,
    setTransitionTarget: (target) => calls.push(target),
  })

  assert.deepEqual(calls, [{ top: 32, left: 12, width: 640, height: 360 }])
})

test('getProjectDetailTransitionTarget subtracts page entrance offset from hero top', () => {
  assert.deepEqual(
    getProjectDetailTransitionTarget({ top: 42, left: 12, width: 640, height: 360 }, 10),
    { top: 32, left: 12, width: 640, height: 360 },
  )
})

test('scheduleProjectDetailRevealStages schedules staged reveal timers and respects reduced motion', () => {
  const scheduledCalls: unknown[] = []
  const timers = scheduleProjectDetailRevealStages({
    prefersReducedMotion: false,
    scheduleStage: (stage, delay) => {
      scheduledCalls.push(['schedule', stage, delay])
      return `${stage}:${delay}`
    },
    setStage: (stage) => scheduledCalls.push(['set', stage]),
  })

  assert.deepEqual(scheduledCalls, [
    ['set', PROJECT_DETAIL_INITIAL_STAGE],
    ['schedule', 1, PROJECT_DETAIL_TIMING.headerAppear],
    ['schedule', 2, PROJECT_DETAIL_TIMING.imageAppear],
    ['schedule', 3, PROJECT_DETAIL_TIMING.metaAppear],
    ['schedule', PROJECT_DETAIL_FINAL_STAGE, PROJECT_DETAIL_TIMING.contentAppear],
  ])
  assert.deepEqual(timers, [
    `1:${PROJECT_DETAIL_TIMING.headerAppear}`,
    `2:${PROJECT_DETAIL_TIMING.imageAppear}`,
    `3:${PROJECT_DETAIL_TIMING.metaAppear}`,
    `${PROJECT_DETAIL_FINAL_STAGE}:${PROJECT_DETAIL_TIMING.contentAppear}`,
  ])

  const reducedMotionCalls: unknown[] = []
  const reducedMotionTimers = scheduleProjectDetailRevealStages({
    prefersReducedMotion: true,
    scheduleStage: (stage, delay) => {
      reducedMotionCalls.push(['schedule', stage, delay])
      return `${stage}:${delay}`
    },
    setStage: (stage) => reducedMotionCalls.push(['set', stage]),
  })

  assert.deepEqual(reducedMotionCalls, [['set', PROJECT_DETAIL_FINAL_STAGE]])
  assert.deepEqual(reducedMotionTimers, [])
})

test('getProjectPageMetadata preserves project metadata payloads', () => {
  assert.deepEqual(
    getProjectPageMetadata({
      frontmatter,
      portfolioName: 'Hunter Bastian Portfolio',
      site: { personName: 'Hunter Bastian' },
      slug: 'lumo',
    }),
    {
      title: 'Lumo | Hunter Bastian Portfolio',
      description: 'Mindfulness app for calm reflection.',
      keywords: ['Lumo', 'Product Design', 'mobile', 'mindfulness', 'Hunter Bastian', 'portfolio', 'case study'],
      openGraph: {
        type: 'article',
        title: 'Lumo - Case Study',
        description: 'Mindfulness app for calm reflection.',
        url: 'https://hunterbastian.com/projects/lumo',
        siteName: 'Hunter Bastian Portfolio',
        images: [
          {
            url: 'https://hunterbastian.com/images/lumo.webp',
            width: 1200,
            height: 630,
            alt: 'Lumo',
          },
        ],
        publishedTime: '2026-02-14',
        authors: ['Hunter Bastian'],
        tags: ['mobile', 'mindfulness'],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Lumo',
        description: 'Mindfulness app for calm reflection.',
        images: ['https://hunterbastian.com/images/lumo.webp'],
      },
      alternates: {
        canonical: 'https://hunterbastian.com/projects/lumo',
      },
    },
  )
})

test('getProjectStructuredData builds article and breadcrumb JSON-LD', () => {
  const [article, breadcrumbs] = getProjectStructuredData({
    frontmatter,
    imageUrl: 'https://hunterbastian.com/images/lumo.webp',
    projectUrl: 'https://hunterbastian.com/projects/lumo',
    site: {
      personName: 'Hunter Bastian',
      url: 'https://hunterbastian.com',
    },
  })

  assert.equal(article?.['@type'], 'Article')
  assert.equal(article?.headline, 'Lumo')
  assert.equal(article?.image, 'https://hunterbastian.com/images/lumo.webp')
  assert.equal(article?.keywords, 'mobile, mindfulness')
  assert.deepEqual(article?.author, {
    '@type': 'Person',
    name: 'Hunter Bastian',
    url: 'https://hunterbastian.com',
  })
  assert.deepEqual(article?.mainEntityOfPage, {
    '@type': 'WebPage',
    '@id': 'https://hunterbastian.com/projects/lumo',
  })

  assert.equal(breadcrumbs?.['@type'], 'BreadcrumbList')
  assert.deepEqual(breadcrumbs?.itemListElement, [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hunterbastian.com' },
    { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://hunterbastian.com/#case-studies' },
    { '@type': 'ListItem', position: 3, name: 'Lumo', item: 'https://hunterbastian.com/projects/lumo' },
  ])
})
