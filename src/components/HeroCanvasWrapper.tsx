'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamically import HeroCanvas with SSR disabled
const HeroCanvas = dynamic(() => import('./HeroCanvas'), {
  ssr: false,
  loading: () => <HeroCanvasPlaceholder />
})

// Lightweight placeholder component
function HeroCanvasPlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-lg">
      <div className="flex flex-col items-center space-y-4">
        {/* Animated loading sphere */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 animate-pulse" />
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 animate-ping absolute" />
        
        {/* Loading text */}
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          Loading 3D Scene...
        </p>
      </div>
    </div>
  )
}

interface HeroCanvasWrapperProps {
  className?: string
  width?: number
  height?: number
}

export default function HeroCanvasWrapper({ 
  className = '', 
  width = 320, 
  height = 320 
}: HeroCanvasWrapperProps) {
  return (
    <div 
      className={`relative ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <Suspense fallback={<HeroCanvasPlaceholder />}>
        <HeroCanvas className="w-full h-full" />
      </Suspense>
    </div>
  )
}
