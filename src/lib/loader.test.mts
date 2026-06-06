import assert from 'node:assert/strict'
import test from 'node:test'

import {
  DEFAULT_LOADER_TYPE,
  LDRS_LOADER_ELEMENT_TAGS,
  LDRS_LOADER_TYPES,
  LOADER_CONTAINER_BASE_CLASS,
  LOADER_ICON_WRAPPER_CLASS,
  LOADER_TEXT_CLASS,
  activateLoaderRegistration,
  getLoaderContainerClassName,
  getLoaderElementProps,
  getLoaderElementTag,
  getLoaderRenderState,
  isLoaderType,
  shouldRenderLoaderText,
} from './loader.ts'

test('LDRS_LOADER_TYPES keeps supported loader order stable', () => {
  assert.deepEqual([...LDRS_LOADER_TYPES], [
    'zoomies',
    'bouncy',
    'ring',
    'spiral',
    'dots-pulse',
    'quantum',
    'tailspin',
    'lineSpinner',
    'dotStream',
    'infinity',
  ])
  assert.equal(DEFAULT_LOADER_TYPE, 'zoomies')
})

test('isLoaderType narrows known loader ids', () => {
  assert.equal(isLoaderType('ring'), true)
  assert.equal(isLoaderType('lineSpinner'), true)
  assert.equal(isLoaderType('unknown'), false)
})

test('getLoaderElementTag maps loader ids to custom elements with fallback', () => {
  assert.equal(getLoaderElementTag('zoomies'), 'l-zoomies')
  assert.equal(getLoaderElementTag('dots-pulse'), 'l-dots-pulse')
  assert.equal(getLoaderElementTag('lineSpinner'), 'l-line-spinner')
  assert.equal(getLoaderElementTag('dotStream'), 'l-dot-stream')
  assert.equal(getLoaderElementTag('unknown'), LDRS_LOADER_ELEMENT_TAGS[DEFAULT_LOADER_TYPE])
})

test('getLoaderElementProps preserves custom element prop values', () => {
  assert.deepEqual(getLoaderElementProps('48', '1.2', 'currentColor'), {
    size: '48',
    speed: '1.2',
    color: 'currentColor',
  })
})

test('loader render helpers package tag, props, classes, and optional text', () => {
  assert.deepEqual(getLoaderRenderState({
    color: 'currentColor',
    size: '48',
    speed: '1.2',
    type: 'ring',
  }), {
    props: {
      color: 'currentColor',
      size: '48',
      speed: '1.2',
    },
    tag: 'l-ring',
  })
  assert.equal(getLoaderContainerClassName(), LOADER_CONTAINER_BASE_CLASS)
  assert.match(getLoaderContainerClassName('min-h-screen'), /min-h-screen/)
  assert.equal(LOADER_ICON_WRAPPER_CLASS, 'text-foreground')
  assert.equal(LOADER_TEXT_CLASS, 'mt-4 text-sm font-medium text-muted-foreground animate-pulse')
  assert.equal(shouldRenderLoaderText('Loading'), true)
  assert.equal(shouldRenderLoaderText(''), false)
  assert.equal(shouldRenderLoaderText(undefined), false)
})

test('activateLoaderRegistration delegates registration and reports failures', async () => {
  const registeredTypes: string[] = []
  const errors: unknown[] = []

  await activateLoaderRegistration({
    registerLoader: async (type) => {
      registeredTypes.push(type)
    },
    reportError: (message, error) => errors.push([message, error]),
    type: 'ring',
  })

  assert.deepEqual(registeredTypes, ['ring'])
  assert.deepEqual(errors, [])

  const failure = new Error('missing loader')
  await activateLoaderRegistration({
    registerLoader: async () => {
      throw failure
    },
    reportError: (message, error) => errors.push([message, error]),
    type: 'zoomies',
  })

  assert.deepEqual(errors, [['Failed to load LDRS loader:', failure]])
})
