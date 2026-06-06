import assert from 'node:assert/strict'
import test from 'node:test'

import {
  ALLOWED_REVALIDATE_PATHS,
  isAllowedRevalidatePath,
  normalizeRevalidatePath,
} from './revalidate.ts'

test('revalidate path allowlist preserves static routes', () => {
  assert.deepEqual(ALLOWED_REVALIDATE_PATHS, [
    '/',
    '/about',
    '/archive',
    '/cv',
    '/logo',
    '/opengraph-image',
    '/robots.txt',
    '/sitemap.xml',
  ])
  assert.equal(isAllowedRevalidatePath('/'), true)
  assert.equal(isAllowedRevalidatePath('/cv'), true)
  assert.equal(isAllowedRevalidatePath('/sitemap.xml'), true)
})

test('project revalidate paths allow canonical project and opengraph routes only', () => {
  assert.equal(isAllowedRevalidatePath('/projects/lumo'), true)
  assert.equal(isAllowedRevalidatePath('/projects/middle-earth-journey/opengraph-image'), true)
  assert.equal(isAllowedRevalidatePath('/projects/Lumo'), false)
  assert.equal(isAllowedRevalidatePath('/projects/lumo/extra'), false)
  assert.equal(isAllowedRevalidatePath('/projects/../cv'), false)
})

test('normalizeRevalidatePath trims optional request body values', () => {
  assert.equal(normalizeRevalidatePath(' /cv '), '/cv')
  assert.equal(normalizeRevalidatePath(''), '')
  assert.equal(normalizeRevalidatePath(undefined), '')
  assert.equal(normalizeRevalidatePath(null), '')
})
