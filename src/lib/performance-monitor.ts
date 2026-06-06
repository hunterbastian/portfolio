export const PERFORMANCE_MONITOR_ENVIRONMENT = 'development'
export const PERFORMANCE_MONITOR_ENTRY_TYPES = [
  'largest-contentful-paint',
  'first-input',
  'layout-shift',
] as const

export type PerformanceMonitorEntryType = (typeof PERFORMANCE_MONITOR_ENTRY_TYPES)[number]

export interface PerformanceMonitorEntry {
  entryType: string
  hadRecentInput?: boolean
  processingStart?: number
  startTime: number
  value?: number
}

export interface PerformanceMetricLog {
  label: 'CLS:' | 'FID:' | 'LCP:'
  value: number
}

export interface PerformanceMonitorObserver {
  disconnect: () => void
  observe: (options: { entryTypes: PerformanceMonitorEntryType[] }) => void
}

export interface PerformanceMonitorActivationInput {
  createObserver: (onEntries: (entries: PerformanceMonitorEntry[]) => void) => PerformanceMonitorObserver
  environment: string | undefined
  hasPerformance: boolean
  logMetric?: (label: PerformanceMetricLog['label'], value: number) => void
}

export function getPerformanceMetricLog(entry: PerformanceMonitorEntry): PerformanceMetricLog | null {
  if (entry.entryType === 'largest-contentful-paint') {
    return { label: 'LCP:', value: entry.startTime }
  }

  if (entry.entryType === 'first-input') {
    return { label: 'FID:', value: (entry.processingStart ?? entry.startTime) - entry.startTime }
  }

  if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
    return { label: 'CLS:', value: entry.value ?? 0 }
  }

  return null
}

export function activatePerformanceMonitor({
  createObserver,
  environment,
  hasPerformance,
  logMetric = console.log,
}: PerformanceMonitorActivationInput): (() => void) | undefined {
  if (environment !== PERFORMANCE_MONITOR_ENVIRONMENT || !hasPerformance) {
    return undefined
  }

  const observer = createObserver((entries) => {
    entries.forEach((entry) => {
      const metric = getPerformanceMetricLog(entry)
      if (metric) {
        logMetric(metric.label, metric.value)
      }
    })
  })

  observer.observe({ entryTypes: [...PERFORMANCE_MONITOR_ENTRY_TYPES] })
  return () => observer.disconnect()
}
