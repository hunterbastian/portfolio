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
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const removeWatermark = () => {
      const container = containerRef.current
      if (!container) return
      // Hide typical watermark link
      container.querySelectorAll<HTMLAnchorElement>('a[href*="unicornstudio"]').forEach((el) => {
        el.style.display = 'none'
      })
      // Heuristic: hide elements containing the phrase
      container.querySelectorAll<HTMLElement>('*').forEach((node) => {
        const text = (node.textContent || '').trim().toLowerCase()
        if (text.includes('unicorn studio')) {
          node.style.display = 'none'
        }
      })
    }

    // If UnicornStudio is already on the page, just init again to pick up new nodes
    const maybeInit = () => {
      try {
        const anyWindow = window as unknown as { UnicornStudio?: { init: () => void; isInitialized?: boolean } }
        if (anyWindow.UnicornStudio) {
          anyWindow.UnicornStudio.init()
          anyWindow.UnicornStudio.isInitialized = true
          // Attempt to remove watermark shortly after init
          setTimeout(removeWatermark, 50)
          setTimeout(removeWatermark, 300)
          setTimeout(removeWatermark, 1000)
        }
      } catch (error) {
        // Silently handle UnicornStudio initialization errors
        // This is expected if the library isn't loaded yet
        console.debug('UnicornStudio not ready yet:', error)
      }
    }

    const anyWindow = window as unknown as { UnicornStudio?: { init: () => void; isInitialized?: boolean }; __usScriptLoading?: boolean }
    if (!anyWindow.UnicornStudio && !anyWindow.__usScriptLoading) {
      anyWindow.__usScriptLoading = true
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js'
      script.async = true
      script.onload = () => {
        anyWindow.__usScriptLoading = false
        maybeInit()
      }
      ;(document.head || document.body).appendChild(script)
    } else {
      // Already present or loading — try init in case it is ready
      maybeInit()
    }

    // Observe future mutations inside the container to hide any late-added label
    const observer = new MutationObserver(() => removeWatermark())
    if (containerRef.current) {
      observer.observe(containerRef.current, { childList: true, subtree: true })
    }
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      data-us-project={projectId}
      className={className}
      style={{ width, height }}
    />
  )
}


