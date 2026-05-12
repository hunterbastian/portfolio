import assert from 'node:assert/strict'
import test from 'node:test'

import {
  getNextProject,
  getProjectEndNavigation,
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
