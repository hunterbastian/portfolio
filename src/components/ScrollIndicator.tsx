'use client'

import { useEffect, useState } from 'react'

export default function ScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0.08)

  useEffect(() => {
    let frameId = 0

    const updateScrollProgress = () => {
      frameId = 0
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight <= 0 ? 0 : scrollTop / docHeight
      const adjustedProgress = Math.min(Math.max(scrollPercent * 0.92 + 0.08, 0.08), 1)
      setScrollProgress(adjustedProgress)
    }

    const onScroll = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(updateScrollProgress)
    }

    updateScrollProgress()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [])

  const size = 24
  const strokeWidth = 2.8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - scrollProgress)
  const fillOpacity = 0.1 + scrollProgress * 0.14

  return (
    <span className="relative inline-flex h-[24px] w-[24px] items-center justify-center" aria-hidden="true">
      <span
        className="absolute inset-[4px] rounded-full transition-opacity duration-150"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--background) 76%, white 24%)',
          opacity: fillOpacity,
          boxShadow:
            'inset 0 0 0 1px color-mix(in srgb, var(--foreground) 18%, transparent), 0 0.5px 0 color-mix(in srgb, white 60%, transparent)',
        }}
      />
      <svg className="h-full w-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          stroke="color-mix(in srgb, var(--foreground) 24%, white 76%)"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          stroke="color-mix(in srgb, #d27c3b 64%, var(--foreground) 36%)"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition: 'stroke-dashoffset 120ms linear',
          }}
        />
      </svg>
    </span>
  )
}
