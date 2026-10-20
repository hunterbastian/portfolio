'use client'

import { useEffect, useState } from 'react'
import {
  getPlaygroundOrbitResponsiveRadius,
  getPlaygroundOrbitViewportSnapshot,
} from '@/lib/playground'

export function useOrbitRadius(radiusDesktop: number, radiusLarge: number) {
  const [radius, setRadius] = useState(radiusDesktop)
  const [viewportWidth, setViewportWidth] = useState<number | null>(null)

  useEffect(() => {
    function update() {
      const viewport = getPlaygroundOrbitViewportSnapshot(window)

      setViewportWidth(viewport.viewportWidth)
      setRadius(
        getPlaygroundOrbitResponsiveRadius({
          radiusDesktop,
          radiusLarge,
          ...viewport,
        }),
      )
    }

    update()
    window.addEventListener('resize', update)
    window.visualViewport?.addEventListener('resize', update)

    return () => {
      window.removeEventListener('resize', update)
      window.visualViewport?.removeEventListener('resize', update)
    }
  }, [radiusDesktop, radiusLarge])

  return { radius, viewportWidth }
}
