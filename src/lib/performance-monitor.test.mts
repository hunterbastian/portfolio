import assert from 'node:assert/strict'
import test from 'node:test'

import {
  PERFORMANCE_MONITOR_ENTRY_TYPES,
  PERFORMANCE_MONITOR_ENVIRONMENT,
  activatePerformanceMonitor,
  getPerformanceMetricLog,
} from './performance-monitor.ts'
import type { PerformanceMonitorEntry } from './performance-monitor.ts'

test('performance monitor constants preserve development-only observer setup', () => {
  assert.equal(PERFORMANCE_MONITOR_ENVIRONMENT, 'development')
  assert.deepEqual(PERFORMANCE_MONITOR_ENTRY_TYPES, [
    'largest-contentful-paint',
    'first-input',
    'layout-shift',
  ])
})

test('getPerformanceMetricLog maps supported performance entries to metric logs', () => {
  assert.deepEqual(
    getPerformanceMetricLog({ entryType: 'largest-contentful-paint', startTime: 1200 }),
    { label: 'LCP:', value: 1200 },
  )
  assert.deepEqual(
    getPerformanceMetricLog({ entryType: 'first-input', processingStart: 105, startTime: 100 }),
    { label: 'FID:', value: 5 },
  )
  assert.deepEqual(
    getPerformanceMetricLog({ entryType: 'layout-shift', hadRecentInput: false, startTime: 0, value: 0.02 }),
    { label: 'CLS:', value: 0.02 },
  )
  assert.equal(getPerformanceMetricLog({ entryType: 'layout-shift', hadRecentInput: true, startTime: 0, value: 0.02 }), null)
  assert.equal(getPerformanceMetricLog({ entryType: 'paint', startTime: 30 }), null)
})

test('activatePerformanceMonitor skips unsupported environments and observes metrics in development', () => {
  const calls: unknown[] = []

  assert.equal(
    activatePerformanceMonitor({
      createObserver: () => {
        throw new Error('should not observe')
      },
      environment: 'production',
      hasPerformance: true,
    }),
    undefined,
  )
  assert.equal(
    activatePerformanceMonitor({
      createObserver: () => {
        throw new Error('should not observe')
      },
      environment: 'development',
      hasPerformance: false,
    }),
    undefined,
  )

  let handleEntries: ((entries: PerformanceMonitorEntry[]) => void) | null = null
  const cleanup = activatePerformanceMonitor({
    createObserver: (onEntries) => {
      handleEntries = onEntries
      return {
        disconnect: () => calls.push(['disconnect']),
        observe: (options) => calls.push(['observe', options.entryTypes]),
      }
    },
    environment: 'development',
    hasPerformance: true,
    logMetric: (label, value) => calls.push(['log', label, value]),
  })

  assert.deepEqual(calls, [['observe', PERFORMANCE_MONITOR_ENTRY_TYPES]])

  handleEntries?.([
    { entryType: 'largest-contentful-paint', startTime: 1200 },
    { entryType: 'first-input', processingStart: 105, startTime: 100 },
    { entryType: 'layout-shift', hadRecentInput: true, startTime: 0, value: 0.02 },
  ])
  cleanup?.()

  assert.deepEqual(calls, [
    ['observe', PERFORMANCE_MONITOR_ENTRY_TYPES],
    ['log', 'LCP:', 1200],
    ['log', 'FID:', 5],
    ['disconnect'],
  ])
})
