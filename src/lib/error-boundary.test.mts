import assert from 'node:assert/strict'
import test from 'node:test'

import {
  ERROR_BOUNDARY_DESCRIPTION,
  ERROR_BOUNDARY_HOME_CLASS,
  ERROR_BOUNDARY_HOME_HREF,
  ERROR_BOUNDARY_HOME_LABEL,
  ERROR_BOUNDARY_LOG_LABEL,
  ERROR_BOUNDARY_RETRY_CLASS,
  ERROR_BOUNDARY_RETRY_LABEL,
  ERROR_BOUNDARY_TITLE,
  getErrorBoundaryHomeAction,
  logErrorBoundaryError,
} from './error-boundary.ts'

test('error boundary fallback copy and home action stay stable', () => {
  assert.equal(ERROR_BOUNDARY_TITLE, 'Something went wrong')
  assert.equal(ERROR_BOUNDARY_DESCRIPTION, 'Please try again. If the issue persists, contact me.')
  assert.equal(ERROR_BOUNDARY_RETRY_LABEL, 'Try again')
  assert.equal(ERROR_BOUNDARY_HOME_LABEL, 'Go Home')
  assert.equal(ERROR_BOUNDARY_HOME_HREF, '/')
  assert.equal(ERROR_BOUNDARY_LOG_LABEL, 'ErrorBoundary caught an error:')
  assert.deepEqual(getErrorBoundaryHomeAction(), {
    href: '/',
    label: 'Go Home',
  })
})

test('error boundary action classes preserve touch and press behavior', () => {
  assert.match(ERROR_BOUNDARY_RETRY_CLASS, /min-h-\[40px\]/)
  assert.match(ERROR_BOUNDARY_RETRY_CLASS, /touch-manipulation/)
  assert.match(ERROR_BOUNDARY_RETRY_CLASS, /active:scale-\[0\.96\]/)
  assert.match(ERROR_BOUNDARY_HOME_CLASS, /inline-flex/)
  assert.match(ERROR_BOUNDARY_HOME_CLASS, /active:scale-\[0\.96\]/)
})

test('logErrorBoundaryError delegates the configured console label', () => {
  const error = new Error('boundary')
  const calls: unknown[] = []

  logErrorBoundaryError(error, (label, loggedError) => calls.push([label, loggedError]))

  assert.deepEqual(calls, [[ERROR_BOUNDARY_LOG_LABEL, error]])
})
