'use client'

import { useEffect } from 'react'
import { normalizeWorkFilter, type WorkFilter } from './home-projects'

export function useWorkFilterUrlSync(setFilter: (filter: WorkFilter) => void) {
  useEffect(() => {
    const syncFromUrl = () => {
      setFilter(normalizeWorkFilter(new URL(window.location.href).searchParams.get('work')))
    }

    const handleExternalFilter = (event: Event) => {
      const detail = (event as CustomEvent<{ filter?: string }>).detail
      setFilter(normalizeWorkFilter(detail?.filter))
    }

    syncFromUrl()
    window.addEventListener('popstate', syncFromUrl)
    window.addEventListener('hb-work-filter', handleExternalFilter as EventListener)

    return () => {
      window.removeEventListener('popstate', syncFromUrl)
      window.removeEventListener('hb-work-filter', handleExternalFilter as EventListener)
    }
  }, [setFilter])
}
