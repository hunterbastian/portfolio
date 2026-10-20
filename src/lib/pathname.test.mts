import assert from 'node:assert/strict'
import test from 'node:test'

import { isHomePathname, normalizeAppPathname } from './pathname.ts'

test('homepage SSR pathname matches the browser pathname', () => {
  assert.equal(normalizeAppPathname('/index'), '/')
  assert.equal(normalizeAppPathname('/'), '/')
  assert.equal(normalizeAppPathname('/playground'), '/playground')
  assert.equal(isHomePathname('/index'), true)
  assert.equal(isHomePathname('/'), true)
  assert.equal(isHomePathname('/cv'), false)
})
