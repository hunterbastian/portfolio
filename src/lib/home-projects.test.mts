import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  HOME_FEATURED_PROJECT_LIMIT,
  HOME_FEATURED_PROJECT_SLUGS,
  HOME_PROJECT_DESCRIPTIONS,
  HOME_WORK_FILTER_EVENT,
  HOME_FEATURED_ROW_META_CLASS_NAME,
  HOME_FEATURED_ROW_OUTCOME_CLASS_NAME,
  HOME_FEATURED_ROW_TITLE_CLASS_NAME,
  HOME_MORE_ROW_META_CLASS_NAME,
  HOME_MORE_ROW_TITLE_CLASS_NAME,
  HOME_PROJECT_GRID_PROJECT_LIMIT,
  HOME_PROJECT_CLEAR_FILTER_ANALYTICS_TARGET,
  HOME_PROJECT_CLEAR_FILTER_HAPTIC_STYLE,
  HOME_PROJECT_CLEAR_FILTER_TOAST,
  HOME_ROW_HOVER_ACCENT,
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
  partitionHomeProjectRows,
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
    project('g', 'Web Design', ['Next.js']),
    project('h', 'Web Design', ['Interactive']),
    project('i', 'Web Design', ['Web Design']),
    project('j', 'Graphic Design', ['Branding']),
  ]

  assert.equal(HOME_PROJECT_GRID_PROJECT_LIMIT, 8)
  assert.deepEqual(
    getProjectRows(projects, 'web').map((item) => item.slug),
    ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  )
})

test('partitionHomeProjectRows keeps a short featured set and quieter more list', () => {
  const projects = [
    project('porsche-app', 'Product Design', ['UI Design']),
    project('lumo', 'Mobile Design', ['UX Design']),
    project('nutricost', 'Graphic Design', ['Branding']),
    project('mentalhealth-minisite', 'Web Design', ['Web Design']),
    project('aol-redesign', 'UI Design', ['UX Design']),
    project('middle-earth-journey', 'Web Design', ['Interactive']),
    project('wander-utah', 'Web Design', ['Next.js']),
  ]

  assert.deepEqual([...HOME_FEATURED_PROJECT_SLUGS], [
    'mentalhealth-minisite',
    'lumo',
    'middle-earth-journey',
    'wander-utah',
  ])
  assert.equal(HOME_FEATURED_PROJECT_LIMIT, 4)

  const partitioned = partitionHomeProjectRows(projects, 'all')

  assert.deepEqual(
    partitioned.featured.map((item) => item.slug),
    ['mentalhealth-minisite', 'lumo', 'middle-earth-journey', 'wander-utah'],
  )
  assert.deepEqual(
    partitioned.more.map((item) => item.slug),
    ['porsche-app', 'nutricost', 'aol-redesign'],
  )
})

test('partitionHomeProjectRows falls back when no featured slugs match the filter', () => {
  const projects = [
    project('a', 'Graphic Design', ['Branding']),
    project('b', 'Graphic Design', ['Marketing']),
    project('c', 'Graphic Design', ['Visual Design']),
    project('d', 'Graphic Design', ['Branding']),
    project('e', 'Graphic Design', ['Marketing']),
  ]

  const partitioned = partitionHomeProjectRows(projects, 'visual')

  assert.deepEqual(
    partitioned.featured.map((item) => item.slug),
    ['a', 'b', 'c', 'd'],
  )
  assert.deepEqual(
    partitioned.more.map((item) => item.slug),
    ['e'],
  )
})

test('getHomeProjectDescription uses curated copy before frontmatter fallback', () => {
  for (const slug of [
    'mentalhealth-minisite',
    'lumo',
    'middle-earth-journey',
    'wander-utah',
    'porsche-app',
    'aol-redesign',
    'nutricost',
  ] as const) {
    assert.equal(typeof HOME_PROJECT_DESCRIPTIONS[slug], 'string')
    assert.ok((HOME_PROJECT_DESCRIPTIONS[slug] ?? '').length > 0)
  }

  assert.equal(
    getHomeProjectDescription(project('lumo', 'Mobile Design', [], 'Lumo', 'Original Lumo copy')),
    'Mindfulness app for calm reflection.',
  )
  assert.equal(
    getHomeProjectDescription(project('custom', 'Web Design', [], 'Custom', 'Original custom copy')),
    'Original custom copy',
  )
  assert.equal(
    getHomeProjectDescription(project('aol-redesign', 'UI Design', [], 'AOL', 'Original AOL copy')),
    'Email redesign that keeps AOL familiar.',
  )
  assert.equal(
    getHomeProjectDescription(project('nutricost', 'Graphic Design', [], 'Nutricost', 'Original Nutricost copy')),
    'Product labels and marketing for Nutricost supplements.',
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

test('formatProjectYear and getProjectAccent stay monochrome for row chrome', () => {
  assert.equal(formatProjectYear('2023-01-01'), '2023')
  assert.equal(formatProjectYear('2026-02-03'), '2026')
  assert.equal(HOME_ROW_HOVER_ACCENT, 'var(--foreground)')
  assert.equal(getProjectAccent('lumo'), 'var(--foreground)')
  assert.equal(getProjectAccent('unknown'), 'var(--foreground)')
  assert.match(HOME_FEATURED_ROW_META_CLASS_NAME, /text-\[10px\]/)
  assert.match(HOME_FEATURED_ROW_META_CLASS_NAME, /sm:text-\[11px\]/)
  assert.match(HOME_FEATURED_ROW_META_CLASS_NAME, /font-normal/)
  assert.match(HOME_FEATURED_ROW_META_CLASS_NAME, /text-subtle-foreground/)
  assert.match(HOME_FEATURED_ROW_OUTCOME_CLASS_NAME, /text-\[0\.68rem\]/)
  assert.match(HOME_FEATURED_ROW_OUTCOME_CLASS_NAME, /font-normal/)
  assert.match(HOME_FEATURED_ROW_OUTCOME_CLASS_NAME, /text-muted-foreground/)
  assert.match(HOME_FEATURED_ROW_OUTCOME_CLASS_NAME, /leading-\[1\.5\]/)
  assert.match(HOME_FEATURED_ROW_TITLE_CLASS_NAME, /text-\[0\.92rem\]/)
  assert.match(HOME_FEATURED_ROW_TITLE_CLASS_NAME, /sm:text-\[0\.98rem\]/)
  assert.match(HOME_FEATURED_ROW_TITLE_CLASS_NAME, /font-medium/)
  assert.match(HOME_FEATURED_ROW_TITLE_CLASS_NAME, /group-hover:text-foreground/)
  assert.doesNotMatch(HOME_FEATURED_ROW_TITLE_CLASS_NAME, /editorial-accent|#2f7d73/)
  assert.match(HOME_MORE_ROW_TITLE_CLASS_NAME, /text-\[0\.82rem\]/)
  assert.match(HOME_MORE_ROW_META_CLASS_NAME, /text-\[10px\]/)
})

test('featured project row hover uses a solid grey surface instead of a color mix', () => {
  assert.deepEqual(getFeaturedProjectRowStyleVars('lumo', 2), {
    '--editorial-accent': 'var(--foreground)',
    '--featured-row-highlight-bg': 'var(--secondary)',
    '--featured-row-highlight-border': 'var(--border)',
    '--featured-row-highlight-shadow': 'transparent',
  })
  assert.equal(getFeaturedProjectRowStyleVars('unknown', -2)['--featured-row-highlight-bg'], 'var(--secondary)')
  assert.equal(getFeaturedProjectRowStyleVars('lumo', 10)['--featured-row-highlight-border'], 'var(--border)')
  assert.deepEqual(getFeaturedProjectRowStyleVars('Studio Alpine', 1, '#c8ced2'), {
    '--editorial-accent': '#c8ced2',
    '--featured-row-highlight-bg': 'var(--secondary)',
    '--featured-row-highlight-border': 'var(--border)',
    '--featured-row-highlight-shadow': 'transparent',
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

test('featured project rows use tiny meta and a visible focus ring that is not color-only', () => {
  const source = readFileSync(new URL('../components/home/FeaturedProjectList.tsx', import.meta.url), 'utf8')
  const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8')

  assert.match(source, /HOME_FEATURED_ROW_META_CLASS_NAME/)
  assert.match(source, /HOME_FEATURED_ROW_OUTCOME_CLASS_NAME/)
  assert.match(source, /density/)
  assert.match(source, /HOME_MORE_ROW_TITLE_CLASS_NAME/)
  assert.match(source, /focus-visible:ring-2/)
  assert.match(source, /focus-visible:ring-ring\/70/)
  assert.match(source, /focus-visible:ring-offset-2/)
  assert.match(css, /\.featured-project-row:focus-within::after/)
  assert.match(css, /background: var\(--ring\)/)
})

test('homepage projects section renders featured then quiet More', () => {
  const source = readFileSync(new URL('../components/home/HomeProjectsSection.tsx', import.meta.url), 'utf8')

  assert.match(source, /partitionHomeProjectRows/)
  assert.match(source, /density="quiet"/)
  assert.match(source, />More</)
  assert.match(source, /projects=\{featured\}/)
})

test('all filter matches every project', () => {
  const filters: WorkFilter[] = ['product', 'visual', 'web']
  const projects = filters.map((filter) => project(filter, filter, []))

  assert.equal(projects.every((item) => projectMatchesWorkFilter(item, 'all')), true)
})
