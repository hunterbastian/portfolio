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

  const size = 28
  const strokeWidth = 3.2
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - scrollProgress)
  const fillOpacity = 0.12 + scrollProgress * 0.18

  return (
    <span className="relative inline-flex h-[28px] w-[28px] items-center justify-center" aria-hidden="true">
      <span
        className="absolute inset-[5px] rounded-full transition-opacity duration-150"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--background) 70%, white 30%)',
          opacity: fillOpacity,
          boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--foreground) 14%, transparent)',
        }}
      />
      <svg className="h-full w-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          stroke="color-mix(in srgb, var(--foreground) 12%, white 88%)"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          stroke="color-mix(in srgb, var(--foreground) 32%, white 68%)"
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
