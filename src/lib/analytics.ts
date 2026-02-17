'use client'

import { track } from '@vercel/analytics/react'

/**
 * Enhanced analytics tracking utilities
 */

type AnalyticsValue = string | number | boolean
type AnalyticsPayload = Record<string, AnalyticsValue | undefined>

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
  }
}

const sanitizePayload = (payload: AnalyticsPayload): Record<string, AnalyticsValue> => {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  ) as Record<string, AnalyticsValue>
}

const trackEvent = (eventName: string, payload: AnalyticsPayload = {}) => {
  const cleanPayload = sanitizePayload(payload)

  track(eventName, cleanPayload)

  if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: eventName,
      ...cleanPayload,
    })
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
  resumeAction: (action: 'view' | 'download') => {
    trackEvent('resume_action', {
      action,
    })
  },

  /**
   * Track external link clicks
   */
  externalLink: (url: string, platform?: string) => {
    trackEvent('external_link', {
      url,
      platform: platform || 'unknown',
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
