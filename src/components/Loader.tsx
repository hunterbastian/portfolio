/// <reference path="../types/ldrs.d.ts" />
'use client'

import { useEffect, createElement } from 'react'

// Import LDRS type definitions
import '@/types/ldrs'

// LDRS loader types
type LoaderType = 
  | 'zoomies' 
  | 'bouncy' 
  | 'ring' 
  | 'spiral' 
  | 'dots-pulse' 
  | 'quantum' 
  | 'tailspin' 
  | 'lineSpinner'
  | 'dotStream'
  | 'infinity'

interface LoaderProps {
  type?: LoaderType
  size?: string
  speed?: string
  color?: string
  text?: string
  className?: string
}

export default function Loader({
  type = 'zoomies',
  size = '40',
  speed = '1.4',
  color = 'currentColor',
  text,
  className = ''
}: LoaderProps) {
  useEffect(() => {
    const registerLoader = async () => {
      try {
        switch (type) {
          case 'zoomies':
            const { zoomies } = await import('ldrs')
            zoomies.register()
            break
          case 'bouncy':
            const { bouncy } = await import('ldrs')
            bouncy.register()
            break
          case 'ring':
            const { ring } = await import('ldrs')
            ring.register()
            break
          case 'spiral':
            const { spiral } = await import('ldrs')
            spiral.register()
            break
          case 'dots-pulse':
            const { dotPulse } = await import('ldrs')
            dotPulse.register()
            break
          case 'quantum':
            const { quantum } = await import('ldrs')
            quantum.register()
            break
          case 'tailspin':
            const { tailspin } = await import('ldrs')
            tailspin.register()
            break
          case 'lineSpinner':
            const { lineSpinner } = await import('ldrs')
            lineSpinner.register()
            break
          case 'dotStream':
            const { dotStream } = await import('ldrs')
            dotStream.register()
            break
          case 'infinity':
            const { infinity } = await import('ldrs')
            infinity.register()
            break
        }
      } catch (error) {
        console.error('Failed to load LDRS loader:', error)
      }
    }

    registerLoader()
  }, [type])

  const renderLoader = () => {
    const commonProps = {
      size,
      speed,
      color
    }

    switch (type) {
      case 'zoomies':
        return createElement('l-zoomies', commonProps)
      case 'bouncy':
        return createElement('l-bouncy', commonProps)
      case 'ring':
        return createElement('l-ring', commonProps)
      case 'spiral':
        return createElement('l-spiral', commonProps)
      case 'dots-pulse':
        return createElement('l-dots-pulse', commonProps)
      case 'quantum':
        return createElement('l-quantum', commonProps)
      case 'tailspin':
        return createElement('l-tailspin', commonProps)
      case 'lineSpinner':
        return createElement('l-line-spinner', commonProps)
      case 'dotStream':
        return createElement('l-dot-stream', commonProps)
      case 'infinity':
        return createElement('l-infinity', commonProps)
      default:
        return createElement('l-zoomies', commonProps)
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="text-gray-900 dark:text-gray-100">
        {renderLoader()}
      </div>
      {text && (
        <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

// Specialized loaders for common use cases
export function PortfolioLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-background ${className}`}>
      <Loader 
        type="zoomies" 
        size="50" 
        speed="1.4" 
        text="Loading..." 
        className="text-center"
      />
    </div>
  )
}

export function ProjectLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center items-center py-16 ${className}`}>
      <Loader 
        type="ring" 
        size="40" 
        speed="2" 
        text="Loading projects..." 
      />
    </div>
  )
}

export function InlineLoader({ 
  type = 'dots-pulse', 
  size = '20', 
  className = '' 
}: { 
  type?: LoaderType
  size?: string
  className?: string 
}) {
  return (
    <Loader 
      type={type} 
      size={size} 
      speed="1.8" 
      className={`inline-flex ${className}`}
    />
  )
}
