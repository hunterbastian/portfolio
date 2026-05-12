import assert from 'node:assert/strict'
import test from 'node:test'

import {
  formatProjectYear,
  getHomeProjectDescription,
  getProjectAccent,
  getProjectRows,
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
  assert.equal(normalizeWorkFilter('product'), 'product')
  assert.equal(normalizeWorkFilter('visual'), 'visual')
  assert.equal(normalizeWorkFilter('web'), 'web')
  assert.equal(normalizeWorkFilter('mobile'), 'all')
  assert.equal(normalizeWorkFilter(null), 'all')
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

test('formatProjectYear and getProjectAccent provide display fallbacks', () => {
  assert.equal(formatProjectYear('2026-02-03'), '2026')
  assert.equal(getProjectAccent('lumo'), '#f8c639')
  assert.equal(getProjectAccent('unknown'), '#ff4b00')
})

test('all filter matches every project', () => {
  const filters: WorkFilter[] = ['product', 'visual', 'web']
  const projects = filters.map((filter) => project(filter, filter, []))

  assert.equal(projects.every((item) => projectMatchesWorkFilter(item, 'all')), true)
})
