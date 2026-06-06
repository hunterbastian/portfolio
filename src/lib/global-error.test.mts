import assert from 'node:assert/strict'
import test from 'node:test'

import {
  GLOBAL_ERROR_DESCRIPTION,
  GLOBAL_ERROR_EYEBROW,
  GLOBAL_ERROR_FONT_STYLE,
  GLOBAL_ERROR_HOME_CLASS,
  GLOBAL_ERROR_HOME_HREF,
  GLOBAL_ERROR_HOME_LABEL,
  GLOBAL_ERROR_LOG_LABEL,
  GLOBAL_ERROR_RETRY_CLASS,
  GLOBAL_ERROR_RETRY_LABEL,
  GLOBAL_ERROR_TITLE,
  getGlobalErrorHomeAction,
  logGlobalError,
} from './global-error.ts'

test('global error copy and home action preserve fallback page contract', () => {
  assert.equal(GLOBAL_ERROR_EYEBROW, 'Error')
  assert.equal(GLOBAL_ERROR_TITLE, 'Something went wrong.')
  assert.equal(GLOBAL_ERROR_DESCRIPTION, 'We hit an unexpected error. You can try again or return home.')
  assert.equal(GLOBAL_ERROR_RETRY_LABEL, 'Try again')
  assert.equal(GLOBAL_ERROR_HOME_LABEL, 'Go Home')
  assert.equal(GLOBAL_ERROR_HOME_HREF, '/')
  assert.equal(GLOBAL_ERROR_LOG_LABEL, 'Global error:')
  assert.deepEqual(getGlobalErrorHomeAction(), {
    href: '/',
    label: 'Go Home',
  })
})

test('global error style constants preserve tactile action behavior', () => {
  assert.deepEqual(GLOBAL_ERROR_FONT_STYLE, { fontFamily: 'inherit' })
  assert.match(GLOBAL_ERROR_RETRY_CLASS, /min-h-\[40px\]/)
  assert.match(GLOBAL_ERROR_RETRY_CLASS, /active:scale-\[0\.96\]/)
  assert.match(GLOBAL_ERROR_HOME_CLASS, /uppercase/)
  assert.match(GLOBAL_ERROR_HOME_CLASS, /hover:text-foreground/)
})

test('logGlobalError delegates the configured console label', () => {
  const error = new Error('boom')
  const calls: unknown[] = []

  logGlobalError(error, (label, loggedError) => calls.push([label, loggedError]))

  assert.deepEqual(calls, [[GLOBAL_ERROR_LOG_LABEL, error]])
})
