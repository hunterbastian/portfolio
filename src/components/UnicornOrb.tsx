'use client'

import { useEffect, useRef } from 'react'
import {
  UNICORN_ORB_DEFAULT_HEIGHT,
  UNICORN_ORB_DEFAULT_WIDTH,
  UNICORN_STUDIO_SCRIPT_SRC,
  UNICORN_STUDIO_WATERMARK_LINK_SELECTOR,
  UNICORN_STUDIO_WATERMARK_RETRY_DELAYS_MS,
  getUnicornOrbStyle,
  isUnicornStudioWatermarkText,
} from '@/lib/unicorn-orb'
import type { UnicornStudioWindow } from '@/lib/unicorn-orb'

interface UnicornOrbProps {
  projectId: string
  width?: string | number
  height?: string | number
  className?: string
}

export default function UnicornOrb({
  projectId,
  width = UNICORN_ORB_DEFAULT_WIDTH,
  height = UNICORN_ORB_DEFAULT_HEIGHT,
  className = '',
}: UnicornOrbProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const removeWatermark = () => {
      const container = containerRef.current
      if (!container) return
      // Hide typical watermark link
      container.querySelectorAll<HTMLAnchorElement>(UNICORN_STUDIO_WATERMARK_LINK_SELECTOR).forEach((el) => {
        el.style.display = 'none'
      })
      // Heuristic: hide elements containing the phrase
      container.querySelectorAll<HTMLElement>('*').forEach((node) => {
        const text = node.textContent || ''
        if (isUnicornStudioWatermarkText(text)) {
          node.style.display = 'none'
        }
      })
    }

    // If UnicornStudio is already on the page, just init again to pick up new nodes
    const maybeInit = () => {
      try {
        const anyWindow = window as unknown as UnicornStudioWindow
        if (anyWindow.UnicornStudio) {
          anyWindow.UnicornStudio.init()
          anyWindow.UnicornStudio.isInitialized = true
          // Attempt to remove watermark shortly after init
          UNICORN_STUDIO_WATERMARK_RETRY_DELAYS_MS.forEach((delayMs) => setTimeout(removeWatermark, delayMs))
        }
      } catch {
        return
      }
    }

    const anyWindow = window as unknown as UnicornStudioWindow
    if (!anyWindow.UnicornStudio && !anyWindow.__usScriptLoading) {
      anyWindow.__usScriptLoading = true
      const script = document.createElement('script')
      script.src = UNICORN_STUDIO_SCRIPT_SRC
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
      style={getUnicornOrbStyle({ width, height })}
    />
  )
}
