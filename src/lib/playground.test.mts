import assert from 'node:assert/strict'
import test from 'node:test'

import {
  PLAYGROUND_EMPTY_COPY,
  PLAYGROUND_GALLERY_LABEL,
  PLAYGROUND_GALLERY_TILE_VARIANTS,
  PLAYGROUND_GALLERY_TITLE,
  getPlaygroundGalleryTileStates,
  getPlaygroundGalleryTileVariant,
  shouldPrioritizePlaygroundImage,
  sortProjectsForPlayground,
} from './playground.ts'
import type { Project } from '../types/project.ts'

function project(
  slug: string,
  date: string,
  title = slug,
  displayTitle?: string,
): Project {
  return {
    slug,
    frontmatter: {
      title,
      displayTitle,
      description: `${title} description`,
      category: 'Web Design',
      tags: ['Creative Coding'],
      image: `/images/${slug}.webp`,
      date,
    },
    content: '',
  }
}

test('sortProjectsForPlayground honors preferred order before date fallback', () => {
  const projects = [
    project('custom-new', '2026-01-01'),
    project('sky-farm', '2024-01-01'),
    project('path', '2023-01-01'),
    project('custom-old', '2025-01-01'),
  ]

  assert.deepEqual(
    sortProjectsForPlayground(projects).map((item) => item.slug),
    ['path', 'sky-farm', 'custom-new', 'custom-old'],
  )
})

test('playground gallery copy stays centralized', () => {
  assert.equal(PLAYGROUND_EMPTY_COPY, 'No archived projects yet.')
  assert.equal(PLAYGROUND_GALLERY_LABEL, 'Playground gallery')
  assert.equal(PLAYGROUND_GALLERY_TITLE, 'Playground')
})

test('playground image priority covers only the first row', () => {
  assert.equal(shouldPrioritizePlaygroundImage(0), true)
  assert.equal(shouldPrioritizePlaygroundImage(3), true)
  assert.equal(shouldPrioritizePlaygroundImage(4), false)
})

test('playground gallery state preserves the reference-style tile rhythm', () => {
  const projects = Array.from({ length: 10 }, (_, index) =>
    project(`project-${index}`, `2026-01-${String(index + 1).padStart(2, '0')}`),
  )
  const tiles = getPlaygroundGalleryTileStates(projects)

  assert.deepEqual([...PLAYGROUND_GALLERY_TILE_VARIANTS], ['portrait', 'feature', 'browser', 'document', 'phone', 'stack', 'address', 'print'])
  assert.equal(getPlaygroundGalleryTileVariant(9), 'feature')
  assert.equal(tiles.length, 10)
  assert.deepEqual(tiles.slice(0, 8).map((tile) => tile.variant), [...PLAYGROUND_GALLERY_TILE_VARIANTS])
  assert.deepEqual(tiles.slice(8).map((tile) => tile.variant), ['portrait', 'feature'])
  assert.equal(tiles[0].priorityImage, true)
  assert.equal(tiles[4].priorityImage, false)
})

test('playground gallery tiles resolve display title and year fallbacks', () => {
  const [titled, untitled] = getPlaygroundGalleryTileStates([
    project('sky-farm', '2026-03-16', 'Sky Farm', 'Sky Farm Lab'),
    project('path', 'not-a-date', 'Path'),
  ])

  assert.equal(titled.title, 'Sky Farm Lab')
  assert.equal(titled.year, '2026')
  assert.equal(untitled.title, 'Path')
  assert.equal(untitled.year, 'Now')
})
