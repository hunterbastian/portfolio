import assert from 'node:assert/strict'
import test from 'node:test'

import {
  NOT_FOUND_DESCRIPTION,
  NOT_FOUND_HEADING,
  NOT_FOUND_HOME_ARROW,
  NOT_FOUND_HOME_HREF,
  NOT_FOUND_HOME_LABEL,
} from './not-found.ts'

test('not found copy matches the showcase page', () => {
  assert.equal(NOT_FOUND_HEADING, '404 — Page not found')
  assert.equal(NOT_FOUND_DESCRIPTION, "This page doesn't exist.")
  assert.equal(NOT_FOUND_HOME_LABEL, 'Home')
  assert.equal(NOT_FOUND_HOME_HREF, '/')
  assert.equal(NOT_FOUND_HOME_ARROW, '↗\uFE0E')
})
