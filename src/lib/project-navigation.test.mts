import assert from 'node:assert/strict'
import test from 'node:test'

import {
  activateProjectEndNavLink,
  getProjectEndNavEntries,
  getNextProject,
  PROJECT_END_NAV_ARIA_LABEL,
  PROJECT_END_NAV_DESCRIPTION_CLASS_NAME,
  PROJECT_END_NAV_EYEBROW,
  PROJECT_END_NAV_EYEBROW_CLASS_NAME,
  PROJECT_END_NAV_GRID_CLASS_NAME,
  PROJECT_END_NAV_HAPTIC_STYLE,
  PROJECT_END_NAV_HEADER_CLASS_NAME,
  PROJECT_END_NAV_HEADING,
  PROJECT_END_NAV_HEADING_CLASS_NAME,
  PROJECT_END_NAV_ICON_CLASS_NAME,
  PROJECT_END_NAV_IMAGE_CLASS_NAME,
  PROJECT_END_NAV_IMAGE_FRAME_CLASS_NAME,
  PROJECT_END_NAV_IMAGE_SIZES,
  PROJECT_END_NAV_LABEL_CLASS_NAME,
  PROJECT_END_NAV_LINK_BODY_CLASS_NAME,
  PROJECT_END_NAV_LINK_CLASS_NAME,
  PROJECT_END_NAV_LINK_LAYOUT_CLASS_NAME,
  PROJECT_END_NAV_LINK_META_CLASS_NAME,
  PROJECT_END_NAV_SECTION_CLASS_NAME,
  PROJECT_END_NAV_SOURCE_LABELS,
  PROJECT_END_NAV_TITLE_CLASS_NAME,
  getProjectEndNavAnalyticsContext,
  getProjectEndNavHref,
  getProjectEndNavigation,
  getProjectEndNavToastMessage,
  getRelatedProject,
  toProjectEndNavItem,
} from './project-navigation.ts'
import type { Project } from '@/types/project'

function project(
  slug: string,
  category: string,
  tags: string[],
  title = slug,
): Project {
  return {
    slug,
    frontmatter: {
      title,
      displayTitle: title.toUpperCase(),
      description: `${title} description`,
      category,
      tags,
      image: `/images/${slug}.webp`,
      date: '2026-01-01',
    },
    content: '',
  }
}

test('getNextProject returns the next project in order', () => {
  const projects = [
    project('a', 'Mobile Design', ['ux']),
    project('b', 'Web Design', ['web']),
    project('c', 'Graphic Design', ['brand']),
  ]

  assert.equal(getNextProject(projects, 'a')?.slug, 'b')
  assert.equal(getNextProject(projects, 'c')?.slug, 'a')
})

test('getNextProject returns null when there is no alternate project', () => {
  assert.equal(getNextProject([project('a', 'Mobile Design', ['ux'])], 'a'), null)
})

test('getRelatedProject prefers category matches while avoiding current and next projects', () => {
  const current = project('a', 'Mobile Design', ['ux'])
  const next = project('b', 'Web Design', ['web'])
  const categoryMatch = project('c', 'Mobile Design', ['prototype'])
  const tagMatch = project('d', 'Graphic Design', ['ux'])
  const projects = [current, next, tagMatch, categoryMatch]

  assert.equal(getRelatedProject(projects, current, next)?.slug, 'c')
})

test('getRelatedProject falls back to tag matches', () => {
  const current = project('a', 'Mobile Design', ['ux'])
  const next = project('b', 'Web Design', ['web'])
  const tagMatch = project('c', 'Graphic Design', ['UX'])
  const projects = [current, next, tagMatch]

  assert.equal(getRelatedProject(projects, current, next)?.slug, 'c')
})

test('getProjectEndNavigation returns serializable nav items', () => {
  const current = project('a', 'Mobile Design', ['ux'], 'Lumo')
  const next = project('b', 'Web Design', ['web'], 'Middle Earth')
  const related = project('c', 'Mobile Design', ['prototype'], 'Wander Utah')

  assert.deepEqual(toProjectEndNavItem(current), {
    slug: 'a',
    title: 'LUMO',
    description: 'Lumo description',
    category: 'Mobile Design',
    image: '/images/a.webp',
  })
  assert.deepEqual(getProjectEndNavigation([current, next, related], current), {
    nextProject: {
      slug: 'b',
      title: 'MIDDLE EARTH',
      description: 'Middle Earth description',
      category: 'Web Design',
      image: '/images/b.webp',
    },
    relatedProject: {
      slug: 'c',
      title: 'WANDER UTAH',
      description: 'Wander Utah description',
      category: 'Mobile Design',
      image: '/images/c.webp',
    },
  })
})

test('project end navigation UI helpers preserve route and analytics contracts', () => {
  const item = toProjectEndNavItem(project('lumo', 'Mobile Design', ['ux'], 'Lumo'))

  assert.equal(getProjectEndNavHref(item), '/projects/lumo')
  assert.equal(getProjectEndNavToastMessage(item), 'Opening LUMO')
  assert.deepEqual(
    getProjectEndNavAnalyticsContext({
      currentSlug: 'current-project',
      currentTitle: 'Current Project',
      source: 'project_end_related',
    }),
    {
      source: 'project_end_related',
      projectSlug: 'current-project',
      projectTitle: 'Current Project',
    },
  )
})

test('project end navigation chrome constants preserve copy, layout, and interaction classes', () => {
  assert.equal(PROJECT_END_NAV_HAPTIC_STYLE, 'light')
  assert.equal(PROJECT_END_NAV_ARIA_LABEL, 'Continue exploring projects')
  assert.equal(PROJECT_END_NAV_EYEBROW, 'Keep exploring')
  assert.equal(PROJECT_END_NAV_HEADING, 'More project work')
  assert.equal(PROJECT_END_NAV_IMAGE_SIZES, '(max-width: 640px) 68px, 80px')
  assert.match(PROJECT_END_NAV_SECTION_CLASS_NAME, /border-t/)
  assert.match(PROJECT_END_NAV_HEADER_CLASS_NAME, /space-y-1\.5/)
  assert.match(PROJECT_END_NAV_EYEBROW_CLASS_NAME, /uppercase/)
  assert.match(PROJECT_END_NAV_HEADING_CLASS_NAME, /text-\[0\.98rem\]/)
  assert.match(PROJECT_END_NAV_GRID_CLASS_NAME, /sm:grid-cols-2/)
  assert.match(PROJECT_END_NAV_LINK_CLASS_NAME, /min-h|touch-manipulation/)
  assert.match(PROJECT_END_NAV_LINK_CLASS_NAME, /active:scale-\[0\.98\]/)
  assert.match(PROJECT_END_NAV_LINK_LAYOUT_CLASS_NAME, /grid-cols-\[4\.25rem_1fr\]/)
  assert.match(PROJECT_END_NAV_IMAGE_FRAME_CLASS_NAME, /aspect-\[4\/3\]/)
  assert.match(PROJECT_END_NAV_IMAGE_CLASS_NAME, /group-hover:scale-\[1\.02\]/)
  assert.match(PROJECT_END_NAV_LINK_BODY_CLASS_NAME, /min-w-0/)
  assert.match(PROJECT_END_NAV_LINK_META_CLASS_NAME, /justify-between/)
  assert.match(PROJECT_END_NAV_LABEL_CLASS_NAME, /tracking-\[0\.12em\]/)
  assert.match(PROJECT_END_NAV_ICON_CLASS_NAME, /group-hover:translate-x-0\.5/)
  assert.match(PROJECT_END_NAV_TITLE_CLASS_NAME, /truncate/)
  assert.match(PROJECT_END_NAV_DESCRIPTION_CLASS_NAME, /line-clamp-2/)
})

test('getProjectEndNavEntries returns ordered visible entries', () => {
  const nextProject = toProjectEndNavItem(project('lumo', 'Mobile Design', ['ux'], 'Lumo'))
  const relatedProject = toProjectEndNavItem(project('wander', 'Web Design', ['travel'], 'Wander Utah'))

  assert.deepEqual(getProjectEndNavEntries({ nextProject, relatedProject }), [
    {
      item: nextProject,
      label: PROJECT_END_NAV_SOURCE_LABELS.project_end_next,
      source: 'project_end_next',
    },
    {
      item: relatedProject,
      label: PROJECT_END_NAV_SOURCE_LABELS.project_end_related,
      source: 'project_end_related',
    },
  ])
  assert.deepEqual(getProjectEndNavEntries({ nextProject: null, relatedProject }), [
    {
      item: relatedProject,
      label: PROJECT_END_NAV_SOURCE_LABELS.project_end_related,
      source: 'project_end_related',
    },
  ])
})

test('activateProjectEndNavLink preserves haptic, analytics, and toast ordering', () => {
  const item = toProjectEndNavItem(project('lumo', 'Mobile Design', ['ux'], 'Lumo'))
  const calls: unknown[] = []

  activateProjectEndNavLink({
    currentSlug: 'current-project',
    currentTitle: 'Current Project',
    item,
    showToast: (message) => calls.push(['toast', message]),
    source: 'project_end_next',
    trackProjectClick: (slug, title, context) => calls.push(['analytics', slug, title, context]),
    triggerHaptic: (style) => calls.push(['haptic', style]),
  })

  assert.deepEqual(calls, [
    ['haptic', 'light'],
    [
      'analytics',
      'lumo',
      'LUMO',
      {
        source: 'project_end_next',
        projectSlug: 'current-project',
        projectTitle: 'Current Project',
      },
    ],
    ['toast', 'Opening LUMO'],
  ])
})
