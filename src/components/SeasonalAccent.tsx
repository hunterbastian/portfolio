'use client'

import { useEffect } from 'react'
import { getSeason, SEASON_ACCENT } from '@/lib/season'

export default function SeasonalAccent() {
  useEffect(() => {
    const accent = SEASON_ACCENT[getSeason()]
    document.documentElement.style.setProperty('--accent', accent)
    document.documentElement.style.setProperty('--ring', accent)
  }, [])

  return null
}
