'use client'

import { useEffect, useState } from 'react'

/**
 * Returns true on initial page load (SSR + hydration), false on
 * subsequent client-side navigations. Used to skip Framer Motion
 * entrance animations so SSR content paints immediately.
 *
 * Hydration safety:
 *   SSR render:      _initialLoadComplete = false → isInitial = true
 *   Client hydration: _initialLoadComplete = false → isInitial = true (matches SSR)
 *   After effect:     _initialLoadComplete = true
 *   Next mount:       isInitial = false → animations play normally
 */
let _initialLoadComplete = false

export function useIsInitialLoad(): boolean {
  const [isInitial] = useState(() => !_initialLoadComplete)

  useEffect(() => {
    _initialLoadComplete = true
  }, [])

  return isInitial
}
