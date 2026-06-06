import assert from 'node:assert/strict'
import test from 'node:test'

import { HOME_WORK_FILTER_EVENT, type HomeWorkFilterEventDetail, type WorkFilter } from './home-projects.ts'
import { subscribeWorkFilterUrlSync, type WorkFilterUrlSyncTarget } from './use-work-filter-url-sync.ts'

function createWorkFilterTarget(href: string) {
  const listeners = new Map<string, EventListener>()
  const calls: unknown[] = []
  const target: WorkFilterUrlSyncTarget = {
    location: { href },
    addEventListener: (type, listener) => {
      calls.push(['add', type])
      listeners.set(type, listener)
    },
    removeEventListener: (type, listener) => {
      calls.push(['remove', type, listeners.get(type) === listener])
      if (listeners.get(type) === listener) listeners.delete(type)
    },
  }

  return {
    calls,
    emit: (type: string, event = { type } as Event) => listeners.get(type)?.(event),
    emitFilter: (detail: HomeWorkFilterEventDetail | null | undefined) => {
      listeners.get(HOME_WORK_FILTER_EVENT)?.({ detail } as CustomEvent<HomeWorkFilterEventDetail>)
    },
    setHref: (nextHref: string) => {
      target.location.href = nextHref
    },
    target,
  }
}

test('subscribeWorkFilterUrlSync syncs from URL, external filter events, and cleanup', () => {
  const filters: WorkFilter[] = []
  const source = createWorkFilterTarget('https://hunterbastian.com/?work=product#projects')
  const cleanup = subscribeWorkFilterUrlSync(source.target, (filter) => filters.push(filter))

  assert.deepEqual(filters, ['product'])
  assert.deepEqual(source.calls, [
    ['add', 'popstate'],
    ['add', HOME_WORK_FILTER_EVENT],
  ])

  source.setHref('https://hunterbastian.com/?work=web#projects')
  source.emit('popstate')
  source.emitFilter({ filter: 'visual' })
  source.emitFilter({ filter: 'unknown' })

  assert.deepEqual(filters, ['product', 'web', 'visual', 'all'])

  cleanup()

  assert.deepEqual(source.calls, [
    ['add', 'popstate'],
    ['add', HOME_WORK_FILTER_EVENT],
    ['remove', 'popstate', true],
    ['remove', HOME_WORK_FILTER_EVENT, true],
  ])

  source.setHref('https://hunterbastian.com/?work=product#projects')
  source.emit('popstate')
  source.emitFilter({ filter: 'web' })

  assert.deepEqual(filters, ['product', 'web', 'visual', 'all'])
})
