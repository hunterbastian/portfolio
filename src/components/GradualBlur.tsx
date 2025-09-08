'use client'

import React from 'react'

interface GradualBlurProps {
  height?: string
  blurPx?: number
  className?: string
}

export default function GradualBlur({
  height = '140px',
  blurPx = 16,
  className = ''
}: GradualBlurProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed bottom-0 left-0 right-0 z-40 ${className}`}
      style={{
        height,
        backdropFilter: `blur(${blurPx}px)`,
        WebkitBackdropFilter: `blur(${blurPx}px)`,
        // Create a soft fade so the blur ramps in from transparent to full at the very bottom
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)',
      }}
    />
  )
}


