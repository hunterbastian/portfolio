'use client'

import { useEffect } from 'react'
import { applySeasonalAccent } from '@/lib/season'

export default function SeasonalAccent() {
  useEffect(() => {
    applySeasonalAccent(document.documentElement)
  }, [])

  return null
}
