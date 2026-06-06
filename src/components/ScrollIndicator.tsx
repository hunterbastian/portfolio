'use client'

import { useEffect, useState } from 'react'
import {
  SCROLL_INDICATOR_MIN_PROGRESS,
  SCROLL_INDICATOR_PROGRESS_STROKE,
  SCROLL_INDICATOR_TRACK_STROKE,
  getScrollIndicatorDashStyle,
  getScrollIndicatorFillStyle,
  getScrollIndicatorRenderState,
  subscribeScrollIndicatorProgress,
} from '@/lib/scroll-indicator'

export default function ScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(SCROLL_INDICATOR_MIN_PROGRESS)

  useEffect(() => {
    return subscribeScrollIndicatorProgress({
      addEventListener: (type, listener, options) => window.addEventListener(type, listener, options),
      cancelAnimationFrame: (frame: number) => window.cancelAnimationFrame(frame),
      documentElement: document.documentElement,
      removeEventListener: (type, listener) => window.removeEventListener(type, listener),
      requestAnimationFrame: (callback) => window.requestAnimationFrame(callback),
      setProgress: setScrollProgress,
      viewport: window,
    })
  }, [])

  const {
    center,
    circumference,
    dashOffset,
    fillOpacity,
    radius,
    size,
    strokeWidth,
  } = getScrollIndicatorRenderState(scrollProgress)

  return (
    <span className="relative inline-flex h-[24px] w-[24px] items-center justify-center" aria-hidden="true">
      <span
        className="absolute inset-[4px] rounded-full transition-opacity duration-150"
        style={getScrollIndicatorFillStyle(fillOpacity)}
      />
      <svg className="h-full w-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          stroke={SCROLL_INDICATOR_TRACK_STROKE}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          stroke={SCROLL_INDICATOR_PROGRESS_STROKE}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={getScrollIndicatorDashStyle()}
        />
      </svg>
    </span>
  )
}
