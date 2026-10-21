import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import test from 'node:test'

import { HOME_SHOWCASE_SLUGS } from './home-showcase.ts'
import {
  HOME_GRID_PIECES,
  buildShowcaseViewUrl,
  getHomeGridFilters,
  getHomeGridPieces,
  getHomeGridProjectHref,
  getHomeShowcaseIndex,
  isShowcaseProjectHash,
  resolveHomeWorkView,
  stepHomeGridIndex,
} from './home-grid.ts'

test('homepage grid uses real repo assets across the visible categories', () => {
  const ids = HOME_GRID_PIECES.map((piece) => piece.id)
  assert.equal(new Set(ids).size, ids.length)
  assert.ok(HOME_GRID_PIECES.length >= 30)

  for (const piece of HOME_GRID_PIECES) {
    assert.equal(existsSync(new URL(`../../public${piece.src.split('?')[0]}`, import.meta.url)), true, piece.src)
    if (piece.videoSrc) {
      assert.equal(existsSync(new URL(`../../public${piece.videoSrc}`, import.meta.url)), true, piece.videoSrc)
    }
    assert.ok(piece.width > 1 && piece.height > 1, piece.id)
    if (piece.projectSlug) {
      assert.ok(HOME_SHOWCASE_SLUGS.includes(piece.projectSlug))
      assert.equal(getHomeGridProjectHref(piece), `/projects/${piece.projectSlug}`)
    } else {
      assert.equal(getHomeGridProjectHref(piece), null)
    }
  }

  assert.deepEqual(getHomeGridFilters(), ['all', 'apps', 'web', 'experiments', 'graphic'])
  assert.equal(getHomeGridPieces('all').length, HOME_GRID_PIECES.length)
  assert.ok(getHomeGridPieces('apps').every((piece) => piece.category === 'apps'))
  assert.ok(getHomeGridPieces('apps').length > 0)
  assert.ok(getHomeGridPieces('experiments').length > 0)
})

test('work view stays on the grid unless the url asks for the showcase', () => {
  assert.equal(resolveHomeWorkView('', ''), 'grid')
  assert.equal(resolveHomeWorkView('?view=showcase', ''), 'showcase')
  assert.equal(resolveHomeWorkView('?view=grid', '#3'), 'grid')
  assert.equal(resolveHomeWorkView('', '#3'), 'showcase')
  assert.equal(resolveHomeWorkView('', '#0'), 'grid')
  assert.equal(resolveHomeWorkView('', '#lumo'), 'showcase')
  assert.equal(isShowcaseProjectHash('#0'), false)
  assert.equal(isShowcaseProjectHash('#lumo'), true)
  assert.equal(getHomeShowcaseIndex('#lumo'), HOME_SHOWCASE_SLUGS.indexOf('lumo'))
  assert.equal(getHomeShowcaseIndex('#3'), 2)
  assert.equal(buildShowcaseViewUrl(0), '?view=showcase#1')
  assert.equal(stepHomeGridIndex(0, -1, 4), 3)
  assert.equal(stepHomeGridIndex(3, 1, 4), 0)
})
