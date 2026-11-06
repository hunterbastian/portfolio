import assert from 'node:assert/strict'
import test from 'node:test'

import { getDocumentShell, isHomePathname, normalizeAppPathname } from './pathname.ts'

test('homepage SSR pathname matches the browser pathname', () => {
  assert.equal(normalizeAppPathname('/index'), '/')
  assert.equal(normalizeAppPathname('/'), '/')
  assert.equal(normalizeAppPathname('/playground'), '/playground')
  assert.equal(isHomePathname('/index'), true)
  assert.equal(isHomePathname('/'), true)
  assert.equal(isHomePathname('/cv'), false)
})

test('document shell follows the cards and showcase routes', () => {
  assert.deepEqual(getDocumentShell('/'), { kind: 'cards' })
  assert.deepEqual(getDocumentShell('/projects'), { kind: 'cards' })
  assert.deepEqual(getDocumentShell('/projects/'), { kind: 'cards' })
  assert.deepEqual(getDocumentShell('/projects/lumo'), { kind: 'default' })
  assert.deepEqual(getDocumentShell('/cv'), { kind: 'showcase', extra: 'cvShowcase' })
  assert.deepEqual(getDocumentShell('/playground'), { kind: 'showcase', extra: 'playgroundShowcase' })
  assert.deepEqual(getDocumentShell('/about'), { kind: 'default' })
  assert.deepEqual(getDocumentShell('/missing'), { kind: 'showcase', extra: 'notFoundShowcase' })
})
