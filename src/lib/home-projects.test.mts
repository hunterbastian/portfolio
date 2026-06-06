import assert from 'node:assert/strict'
import test from 'node:test'

import {
  HOME_WORK_FILTER_EVENT,
  HOME_PROJECT_CLEAR_FILTER_ANALYTICS_TARGET,
  HOME_PROJECT_CLEAR_FILTER_HAPTIC_STYLE,
  HOME_PROJECT_CLEAR_FILTER_TOAST,
  activateHomeProjectClearFilter,
  activateHomeWorkFilterChange,
  formatProjectYear,
  getFeaturedProjectHoverDistance,
  getFeaturedProjectListState,
  getFeaturedProjectRowState,
  getFeaturedProjectRowStyleVars,
  getHomeProjectDescription,
  getHomeProjectThumbnailImage,
  getHomeProjectTitle,
  getProjectAccent,
  getProjectRows,
  getWorkFilterFromEventDetail,
  getWorkFilterFromHref,
  getWorkFilterUrl,
  normalizeWorkFilter,
  projectMatchesWorkFilter,
} from './home-projects.ts'
import type { HomeProject, WorkFilter } from './home-projects.ts'

function project(
  slug: string,
  category: string,
  tags: string[],
  title = slug,
  description = `${title} fallback description`,
): HomeProject {
  return {
    slug,
    frontmatter: {
      title,
      description,
      category,
      tags,
      image: `/images/${slug}.webp`,
      date: '2025-09-14',
    },
  }
}

test('normalizeWorkFilter accepts known filters and defaults unknown values to all', () => {
  assert.equal(HOME_WORK_FILTER_EVENT, 'hb-work-filter')
  assert.equal(normalizeWorkFilter('product'), 'product')
  assert.equal(normalizeWorkFilter('visual'), 'visual')
  assert.equal(normalizeWorkFilter('web'), 'web')
  assert.equal(normalizeWorkFilter('mobile'), 'all')
  assert.equal(normalizeWorkFilter(null), 'all')
})

test('work filter source helpers normalize URL and external event detail values', () => {
  assert.equal(getWorkFilterFromHref('https://hunterbastian.com/?work=product#projects'), 'product')
  assert.equal(getWorkFilterFromHref('https://hunterbastian.com/?work=unknown#projects'), 'all')
  assert.equal(getWorkFilterFromEventDetail({ filter: 'visual' }), 'visual')
  assert.equal(getWorkFilterFromEventDetail({ filter: 'mobile' }), 'all')
  assert.equal(getWorkFilterFromEventDetail(null), 'all')
})

test('home project clear filter action preserves constants and side-effect ordering', () => {
  const calls: unknown[] = []

  assert.equal(HOME_PROJECT_CLEAR_FILTER_ANALYTICS_TARGET, 'work_filter_all')
  assert.equal(HOME_PROJECT_CLEAR_FILTER_HAPTIC_STYLE, 'light')
  assert.equal(HOME_PROJECT_CLEAR_FILTER_TOAST, 'Showing all work')

  activateHomeProjectClearFilter({
    setWorkFilter: (filter) => calls.push(['filter', filter]),
    showToast: (message) => calls.push(['toast', message]),
    trackNavigationClick: (target) => calls.push(['navigation', target]),
    triggerHaptic: (style) => calls.push(['haptic', style]),
  })

  assert.deepEqual(calls, [
    ['haptic', 'light'],
    ['navigation', 'work_filter_all'],
    ['filter', 'all'],
    ['toast', 'Showing all work'],
  ])
})

test('home work filter change sets state without browser effects when no href is available', () => {
  const calls: unknown[] = []

  activateHomeWorkFilterChange({
    filter: 'visual',
    replaceUrl: (href) => calls.push(['url', href]),
    requestFrame: () => calls.push(['frame']),
    scrollProjectsIntoView: () => calls.push(['scroll']),
    setWorkFilter: (filter) => calls.push(['filter', filter]),
  })

  assert.deepEqual(calls, [['filter', 'visual']])
})

test('home work filter change updates URL and schedules project scroll after state update', () => {
  const calls: unknown[] = []

  activateHomeWorkFilterChange({
    currentHref: 'https://hunterbastian.com/?utm=portfolio&work=all#contact',
    filter: 'web',
    replaceUrl: (href) => calls.push(['url', href]),
    requestFrame: (callback) => {
      calls.push(['frame'])
      callback()
    },
    scrollProjectsIntoView: () => calls.push(['scroll']),
    setWorkFilter: (filter) => calls.push(['filter', filter]),
  })

  assert.deepEqual(calls, [
    ['filter', 'web'],
    ['url', '/?utm=portfolio&work=web#projects'],
    ['frame'],
    ['scroll'],
  ])
})

test('getWorkFilterUrl updates work filter while preserving unrelated URL state', () => {
  assert.equal(
    getWorkFilterUrl('https://hunterbastian.com/?utm=portfolio&work=visual#contact', 'product'),
    '/?utm=portfolio&work=product#projects',
  )
  assert.equal(
    getWorkFilterUrl('https://hunterbastian.com/about?work=web&view=full', 'all'),
    '/about?view=full#projects',
  )
})

test('projectMatchesWorkFilter classifies product work from category and tags', () => {
  const mobileProject = project('mobile', 'Mobile Design', [])
  const taggedProject = project('tagged', 'Case Study', ['UX Design'])
  const visualProject = project('visual', 'Graphic Design', ['Branding'])

  assert.equal(projectMatchesWorkFilter(mobileProject, 'product'), true)
  assert.equal(projectMatchesWorkFilter(taggedProject, 'product'), true)
  assert.equal(projectMatchesWorkFilter(visualProject, 'product'), false)
})

test('projectMatchesWorkFilter classifies visual and web work', () => {
  const visualProject = project('brand', 'Identity', ['Visual Design'])
  const logoProject = project('logo', 'Exploration', [], 'Logo Sketches')
  const webProject = project('web', 'Case Study', ['Next.js', 'Interactive'])

  assert.equal(projectMatchesWorkFilter(visualProject, 'visual'), true)
  assert.equal(projectMatchesWorkFilter(logoProject, 'visual'), true)
  assert.equal(projectMatchesWorkFilter(webProject, 'web'), true)
})

test('getProjectRows filters projects and limits homepage rows', () => {
  const projects = [
    project('a', 'Web Design', ['Next.js']),
    project('b', 'Web Design', ['Interactive']),
    project('c', 'Web Design', ['Web Design']),
    project('d', 'Web Design', ['Next.js']),
    project('e', 'Web Design', ['Interactive']),
    project('f', 'Web Design', ['Web Design']),
    project('g', 'Graphic Design', ['Branding']),
  ]

  assert.deepEqual(
    getProjectRows(projects, 'web').map((item) => item.slug),
    ['a', 'b', 'c', 'd', 'e'],
  )
})

test('getHomeProjectDescription uses curated copy before frontmatter fallback', () => {
  assert.equal(
    getHomeProjectDescription(project('lumo', 'Mobile Design', [], 'Lumo', 'Original Lumo copy')),
    'Mindfulness app for calm reflection.',
  )
  assert.equal(
    getHomeProjectDescription(project('custom', 'Web Design', [], 'Custom', 'Original custom copy')),
    'Original custom copy',
  )
})

test('getHomeProjectTitle prefers display title before frontmatter title', () => {
  const displayProject = project('display', 'Web Design', [], 'Frontmatter Title')
  displayProject.frontmatter.displayTitle = 'Display Title'

  assert.equal(getHomeProjectTitle(displayProject), 'Display Title')
  assert.equal(getHomeProjectTitle(project('plain', 'Web Design', [], 'Plain Title')), 'Plain Title')
})

test('getHomeProjectThumbnailImage prefers home-specific image before detail image', () => {
  const thumbnailProject = project('lumo', 'Mobile Design', [], 'Lumo')

  assert.equal(getHomeProjectThumbnailImage(thumbnailProject), '/images/lumo.webp')

  thumbnailProject.frontmatter.homeImage = '/images/home/lumo-object-icon.png'

  assert.equal(getHomeProjectThumbnailImage(thumbnailProject), '/images/home/lumo-object-icon.png')
})

test('formatProjectYear and getProjectAccent provide display fallbacks', () => {
  assert.equal(formatProjectYear('2023-01-01'), '2023')
  assert.equal(formatProjectYear('2026-02-03'), '2026')
  assert.equal(getProjectAccent('lumo'), '#2f7d73')
  assert.equal(getProjectAccent('unknown'), '#2f7d73')
})

test('featured project row style vars clamp hover distance and preserve accent math', () => {
  assert.deepEqual(getFeaturedProjectRowStyleVars('lumo', 2), {
    '--editorial-accent': '#2f7d73',
    '--featured-row-highlight-bg': 'color-mix(in srgb, #2f7d73 5%, rgba(var(--background-rgb), 0.58))',
    '--featured-row-highlight-border': 'color-mix(in srgb, #2f7d73 16%, transparent)',
    '--featured-row-highlight-shadow': 'color-mix(in srgb, #2f7d73 10%, transparent)',
  })
  assert.equal(
    getFeaturedProjectRowStyleVars('unknown', -2)['--featured-row-highlight-bg'],
    'color-mix(in srgb, #2f7d73 5%, rgba(var(--background-rgb), 0.58))',
  )
  assert.equal(
    getFeaturedProjectRowStyleVars('lumo', 10)['--featured-row-highlight-border'],
    'color-mix(in srgb, #2f7d73 16%, transparent)',
  )
  assert.deepEqual(getFeaturedProjectRowStyleVars('Studio Alpine', 1, '#2f7d73'), {
    '--editorial-accent': '#2f7d73',
    '--featured-row-highlight-bg': 'color-mix(in srgb, #2f7d73 5%, rgba(var(--background-rgb), 0.58))',
    '--featured-row-highlight-border': 'color-mix(in srgb, #2f7d73 16%, transparent)',
    '--featured-row-highlight-shadow': 'color-mix(in srgb, #2f7d73 10%, transparent)',
  })
})

test('featured project hover distance resolves null and active row offsets', () => {
  assert.equal(getFeaturedProjectHoverDistance(null, 3), 0)
  assert.equal(getFeaturedProjectHoverDistance(3, 3), 0)
  assert.equal(getFeaturedProjectHoverDistance(1, 4), 3)
})

test('featured project row state resolves active, muted, and hover distance', () => {
  assert.deepEqual(getFeaturedProjectRowState('lumo', 1, null), {
    active: false,
    hoverDistance: 0,
    index: 1,
    muted: false,
    slug: 'lumo',
  })
  assert.deepEqual(getFeaturedProjectRowState('lumo', 1, { slug: 'lumo', index: 1 }), {
    active: true,
    hoverDistance: 0,
    index: 1,
    muted: false,
    slug: 'lumo',
  })
  assert.deepEqual(getFeaturedProjectRowState('lumo', 1, { slug: 'porsche-app', index: 4 }), {
    active: false,
    hoverDistance: 3,
    index: 1,
    muted: true,
    slug: 'lumo',
  })
})

test('featured project list state packages project and playground rows', () => {
  const projects = [
    project('lumo', 'Mobile Design', []),
    project('porsche-app', 'Product Design', []),
  ]

  assert.deepEqual(getFeaturedProjectListState(projects, null), {
    hasHoveredProject: false,
    playgroundRow: {
      active: false,
      hoverDistance: 0,
      index: 2,
      muted: false,
      slug: 'playground',
    },
    projectRows: [
      {
        active: false,
        hoverDistance: 0,
        index: 0,
        muted: false,
        slug: 'lumo',
      },
      {
        active: false,
        hoverDistance: 0,
        index: 1,
        muted: false,
        slug: 'porsche-app',
      },
    ],
  })
  assert.deepEqual(getFeaturedProjectListState(projects, { slug: 'playground', index: 2 }), {
    hasHoveredProject: true,
    playgroundRow: {
      active: true,
      hoverDistance: 0,
      index: 2,
      muted: false,
      slug: 'playground',
    },
    projectRows: [
      {
        active: false,
        hoverDistance: 2,
        index: 0,
        muted: true,
        slug: 'lumo',
      },
      {
        active: false,
        hoverDistance: 1,
        index: 1,
        muted: true,
        slug: 'porsche-app',
      },
    ],
  })
})

test('all filter matches every project', () => {
  const filters: WorkFilter[] = ['product', 'visual', 'web']
  const projects = filters.map((filter) => project(filter, filter, []))

  assert.equal(projects.every((item) => projectMatchesWorkFilter(item, 'all')), true)
})
