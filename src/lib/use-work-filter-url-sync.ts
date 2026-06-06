'use client'

import { useEffect } from 'react'
import {
  HOME_WORK_FILTER_EVENT,
  getWorkFilterFromEventDetail,
  getWorkFilterFromHref,
  type HomeWorkFilterEventDetail,
  type WorkFilter,
} from './home-projects.ts'

export interface WorkFilterLocationSource {
  location: {
    href: string
  }
}

export interface WorkFilterUrlSyncTarget extends WorkFilterLocationSource {
  addEventListener: (type: 'popstate' | typeof HOME_WORK_FILTER_EVENT, listener: EventListener) => void
  removeEventListener: (type: 'popstate' | typeof HOME_WORK_FILTER_EVENT, listener: EventListener) => void
}

export function subscribeWorkFilterUrlSync(
  target: WorkFilterUrlSyncTarget,
  setFilter: (filter: WorkFilter) => void,
) {
  const syncFromUrl = (_event?: Event) => {
    setFilter(getWorkFilterFromHref(target.location.href))
  }

  const handleExternalFilter: EventListener = (event) => {
    const detail = (event as CustomEvent<HomeWorkFilterEventDetail>).detail
    setFilter(getWorkFilterFromEventDetail(detail))
  }

  syncFromUrl()
  target.addEventListener('popstate', syncFromUrl)
  target.addEventListener(HOME_WORK_FILTER_EVENT, handleExternalFilter)

  return () => {
    target.removeEventListener('popstate', syncFromUrl)
    target.removeEventListener(HOME_WORK_FILTER_EVENT, handleExternalFilter)
  }
}

export function useWorkFilterUrlSync(setFilter: (filter: WorkFilter) => void) {
  useEffect(() => {
    return subscribeWorkFilterUrlSync(window, setFilter)
  }, [setFilter])
}
