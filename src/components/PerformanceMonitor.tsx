'use client'

import { useEffect } from 'react'

export default function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Monitor Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime)
          }
          if (entry.entryType === 'first-input') {
            const firstInputEntry = entry as PerformanceEventTiming
            console.log('FID:', firstInputEntry.processingStart - firstInputEntry.startTime)
          }
          if (entry.entryType === 'layout-shift') {
            const layoutShiftEntry = entry as LayoutShift
            if (!layoutShiftEntry.hadRecentInput) {
              console.log('CLS:', layoutShiftEntry.value)
            }
          }
        }
      })

      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })

      // Cleanup
      return () => {
        observer.disconnect()
      }
    }
  }, [])

  return null
}
