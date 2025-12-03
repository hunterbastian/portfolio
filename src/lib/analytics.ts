'use client'

import { track } from '@vercel/analytics/react'

/**
 * Enhanced analytics tracking utilities
 */

export const analytics = {
  /**
   * Track page views with custom metadata
   */
  pageView: (url: string, metadata?: Record<string, string>) => {
    track('page_view', {
      url,
      ...metadata,
    })
  },

  /**
   * Track project views
   */
  projectView: (projectSlug: string, projectTitle: string) => {
    track('project_view', {
      slug: projectSlug,
      title: projectTitle,
    })
  },

  /**
   * Track navigation clicks
   */
  navigationClick: (section: string) => {
    track('navigation_click', {
      section,
    })
  },

  /**
   * Track resume downloads/views
   */
  resumeAction: (action: 'view' | 'download') => {
    track('resume_action', {
      action,
    })
  },

  /**
   * Track external link clicks
   */
  externalLink: (url: string, platform?: string) => {
    track('external_link', {
      url,
      platform: platform || 'unknown',
    })
  },

  /**
   * Track case study interactions
   */
  caseStudyInteraction: (action: 'hover' | 'click', projectSlug: string) => {
    track('case_study_interaction', {
      action,
      project: projectSlug,
    })
  },

  /**
   * Track performance metrics
   */
  performanceMetric: (metric: string, value: number) => {
    track('performance_metric', {
      metric,
      value: value.toString(),
    })
  },
}

