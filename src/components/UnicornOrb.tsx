'use client'

import { useEffect, useRef } from 'react'

interface UnicornOrbProps {
  projectId: string
  width?: string | number
  height?: string | number
  className?: string
}

export default function UnicornOrb({
  projectId,
  width = '100%',
  height = 420,
  className = ''
}: UnicornOrbProps) {
  const orbContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const removeUnicornWatermark = () => {
      const orbContainer = orbContainerRef.current
      if (!orbContainer) return
      // Hide typical watermark link
      orbContainer.querySelectorAll<HTMLAnchorElement>('a[href*="unicornstudio"]').forEach((linkElement) => {
        linkElement.style.display = 'none'
      })
      // Heuristic: hide elements containing the phrase
      orbContainer.querySelectorAll<HTMLElement>('*').forEach((domNode) => {
        const textContent = (domNode.textContent || '').trim().toLowerCase()
        if (textContent.includes('unicorn studio')) {
          domNode.style.display = 'none'
        }
      })
    }

    // If UnicornStudio is already on the page, just init again to pick up new nodes
    const initializeUnicornStudio = () => {
      try {
        const windowWithUnicornStudio = window as unknown as { UnicornStudio?: { init: () => void; isInitialized?: boolean } }
        if (windowWithUnicornStudio.UnicornStudio) {
          windowWithUnicornStudio.UnicornStudio.init()
          windowWithUnicornStudio.UnicornStudio.isInitialized = true
          // Attempt to remove watermark shortly after init
          setTimeout(removeUnicornWatermark, 50)
          setTimeout(removeUnicornWatermark, 300)
          setTimeout(removeUnicornWatermark, 1000)
        }
      } catch {}
    }

    const windowWithUnicornStudio = window as unknown as { UnicornStudio?: { init: () => void; isInitialized?: boolean }; __unicornScriptLoading?: boolean }
    if (!windowWithUnicornStudio.UnicornStudio && !windowWithUnicornStudio.__unicornScriptLoading) {
      windowWithUnicornStudio.__unicornScriptLoading = true
      const unicornScript = document.createElement('script')
      unicornScript.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js'
      unicornScript.async = true
      unicornScript.onload = () => {
        windowWithUnicornStudio.__unicornScriptLoading = false
        initializeUnicornStudio()
      }
      ;(document.head || document.body).appendChild(unicornScript)
    } else {
      // Already present or loading — try init in case it is ready
      initializeUnicornStudio()
    }

    // Observe future mutations inside the container to hide any late-added label
    const mutationObserver = new MutationObserver(() => removeUnicornWatermark())
    if (orbContainerRef.current) {
      mutationObserver.observe(orbContainerRef.current, { childList: true, subtree: true })
    }
    return () => mutationObserver.disconnect()
  }, [])

  return (
    <div
      ref={orbContainerRef}
      data-us-project={projectId}
      className={className}
      style={{ width, height }}
    />
  )
}


