'use client'

import { useEffect, useState } from 'react'

export interface MediaQueryChangeSnapshot {
  matches: boolean
}

export interface MediaQueryListLike<TChangeEvent extends MediaQueryChangeSnapshot = MediaQueryChangeSnapshot> {
  matches: boolean
  addEventListener: (type: 'change', listener: (event: TChangeEvent) => void) => void
  removeEventListener: (type: 'change', listener: (event: TChangeEvent) => void) => void
}

export function getMediaQueryMatches(mediaQuery: Pick<MediaQueryListLike, 'matches'>): boolean {
  return mediaQuery.matches
}

export function subscribeMediaQuery<TChangeEvent extends MediaQueryChangeSnapshot>(
  mediaQuery: MediaQueryListLike<TChangeEvent>,
  setMatches: (matches: boolean) => void,
) {
  setMatches(getMediaQueryMatches(mediaQuery))

  const onChange = (event: TChangeEvent) => setMatches(event.matches)
  mediaQuery.addEventListener('change', onChange)

  return () => mediaQuery.removeEventListener('change', onChange)
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)
    return subscribeMediaQuery(mediaQuery, setMatches)
  }, [query])

  return matches
}
