'use client'

import { useEffect } from 'react'
import {
  activatePerformanceMonitor,
  type PerformanceMonitorEntry,
} from '@/lib/performance-monitor'

export default function PerformanceMonitor() {
  useEffect(() => {
    return activatePerformanceMonitor({
      createObserver: (onEntries) => new PerformanceObserver((list) => {
        onEntries(list.getEntries() as PerformanceMonitorEntry[])
      }),
      environment: process.env.NODE_ENV,
      hasPerformance: 'performance' in window,
      logMetric: (label, value) => console.log(label, value),
    })
  }, [])

  return null
}
