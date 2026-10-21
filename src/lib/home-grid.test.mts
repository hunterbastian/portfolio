import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import test from 'node:test'

import { HOME_SHOWCASE_SLUGS } from './home-showcase.ts'
import {
  HOME_GRID_PIECES,
  getHomeGridProjectHref,
  getHomeShowcaseIndex,
  getWorkStripAction,
  isShowcaseProjectHash,
  stepHomeGridIndex,
  withoutHomeViewParam,
  workStripMatchesSlide,
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

  assert.equal(HOME_GRID_PIECES.length, 50)
  const camping = HOME_GRID_PIECES.find((piece) => piece.id === 'camping')
  const skiing = HOME_GRID_PIECES.find((piece) => piece.id === 'skiing')
  assert.equal(camping?.title, 'Camping')
  assert.equal(skiing?.title, 'Skiing')
  assert.equal(camping?.year, '2026')
  assert.equal(skiing?.year, '2026')
  assert.equal(camping?.category, 'illustration')
  assert.equal(skiing?.category, 'illustration')
  assert.equal(camping?.videoSrc, '/images/projects/camping-loop.mp4')
  assert.equal(skiing?.videoSrc, '/images/projects/skiing-loop.mp4')
  assert.ok(HOME_GRID_PIECES.some((piece) => piece.category === 'apps'))
  assert.ok(HOME_GRID_PIECES.some((piece) => piece.category === 'experiments'))
})

test('a thumbnail jumps the showcase only when it belongs to a carousel project', () => {
  const lumo = HOME_GRID_PIECES.find((piece) => piece.projectSlug === 'lumo')
  const loose = HOME_GRID_PIECES.find((piece) => !piece.projectSlug)
  assert.ok(lumo)
  assert.ok(loose)
  assert.deepEqual(getWorkStripAction(lumo), { type: 'showcase', index: HOME_SHOWCASE_SLUGS.indexOf('lumo') })
  assert.deepEqual(getWorkStripAction(loose), { type: 'lightbox' })
  assert.equal(workStripMatchesSlide(lumo, 'lumo'), true)
  assert.equal(workStripMatchesSlide(lumo, 'porsche-app'), false)
  assert.equal(workStripMatchesSlide(loose, 'lumo'), false)
  assert.equal(isShowcaseProjectHash('#0'), false)
  assert.equal(isShowcaseProjectHash('#lumo'), true)
  assert.equal(getHomeShowcaseIndex('#lumo'), HOME_SHOWCASE_SLUGS.indexOf('lumo'))
  assert.equal(getHomeShowcaseIndex('#3'), 2)
  assert.equal(withoutHomeViewParam('?view=grid'), '')
  assert.equal(withoutHomeViewParam('?view=showcase&ref=1'), '?ref=1')
  assert.equal(withoutHomeViewParam(''), '')
  assert.equal(stepHomeGridIndex(0, -1, 4), 3)
  assert.equal(stepHomeGridIndex(3, 1, 4), 0)
})
