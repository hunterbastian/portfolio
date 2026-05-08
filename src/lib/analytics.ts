'use client'

import { track } from '@vercel/analytics/react'

type AnalyticsValue = string | number | boolean
type AnalyticsPayload = Record<string, AnalyticsValue | undefined>

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
    gtag?: (command: string, eventName: string, payload?: Record<string, AnalyticsValue>) => void
  }
}

function normalizeTrackedUrl(url: string): string {
  if (url.startsWith('mailto:')) {
    return url.split('?')[0] ?? url
  }

  try {
    const parsed = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'https://hunterbastian.com')
    return `${parsed.origin}${parsed.pathname}`
  } catch {
    return url.split('?')[0] ?? url
  }
}

function inferPlatform(url: string): string {
  if (url.startsWith('mailto:')) return 'email'

  try {
    return new URL(url, typeof window !== 'undefined' ? window.location.origin : 'https://hunterbastian.com')
      .hostname
      .replace(/^www\./, '')
  } catch {
    return 'unknown'
  }
}

function sanitizePayload(payload: AnalyticsPayload): Record<string, AnalyticsValue> {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  ) as Record<string, AnalyticsValue>
}

function trackEvent(eventName: string, payload: AnalyticsPayload = {}): void {
  const cleanPayload = sanitizePayload(payload)

  track(eventName, cleanPayload)

  if (typeof window !== 'undefined') {
    window.gtag?.('event', eventName, cleanPayload)

    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: eventName,
        ...cleanPayload,
      })
    }
  }
}

export const analytics = {
  /**
   * Track page views with custom metadata
   */
  pageView: (url: string, metadata?: Record<string, AnalyticsValue>) => {
    trackEvent('page_view', {
      url,
      ...metadata,
    })
  },

  /**
   * Track project views
   */
  projectView: (projectSlug: string, projectTitle: string) => {
    trackEvent('project_view', {
      slug: projectSlug,
      title: projectTitle,
    })
  },

  /**
   * Track project clicks before navigation
   */
  projectClick: (projectSlug: string, projectTitle: string) => {
    trackEvent('project_click', {
      slug: projectSlug,
      title: projectTitle,
    })
  },

  /**
   * Track navigation clicks
   */
  navigationClick: (section: string) => {
    trackEvent('navigation_click', {
      section,
    })
  },

  /**
   * Track resume downloads/views
   */
  resumeAction: (action: 'view' | 'download' | 'print') => {
    trackEvent('resume_action', {
      action,
    })
  },

  /**
   * Track external link clicks
   */
  externalLink: (url: string, platform?: string) => {
    trackEvent('external_link', {
      url: normalizeTrackedUrl(url),
      platform: platform || inferPlatform(url),
    })
  },

  /**
   * Track case study interactions
   */
  caseStudyInteraction: (action: 'hover' | 'click', projectSlug: string) => {
    trackEvent('case_study_interaction', {
      action,
      project: projectSlug,
    })
  },

  /**
   * Track performance metrics
   */
  performanceMetric: (metric: string, value: number) => {
    trackEvent('performance_metric', {
      metric,
      value,
    })
  },
}
