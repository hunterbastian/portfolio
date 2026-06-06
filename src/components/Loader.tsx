'use client'

import { createElement, useEffect } from 'react'
import DotMatrixLoader from './DotMatrixLoader'
import {
  type LoaderType,
  LOADER_ICON_WRAPPER_CLASS,
  LOADER_TEXT_CLASS,
  activateLoaderRegistration,
  getLoaderContainerClassName,
  getLoaderRenderState,
  shouldRenderLoaderText,
} from '@/lib/loader'

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
  className = '',
}: LoaderProps) {
  useEffect(() => {
    void activateLoaderRegistration({ type })
  }, [type])

  const loaderRenderState = getLoaderRenderState({ color, size, speed, type })

  return (
    <div className={getLoaderContainerClassName(className)}>
      <div className={LOADER_ICON_WRAPPER_CLASS}>
        {createElement(loaderRenderState.tag, loaderRenderState.props)}
      </div>
      {shouldRenderLoaderText(text) ? (
        <p className={LOADER_TEXT_CLASS}>
          {text}
        </p>
      ) : null}
    </div>
  )
}

// Specialized loaders for common use cases
export function PortfolioLoader({ className = '' }: { className?: string }) {
  return <DotMatrixLoader className={className} />
}

export function ProjectLoader({ className = '' }: { className?: string }) {
  return <DotMatrixLoader className={className} />
}

export function InlineLoader({ className = '' }: { className?: string }) {
  return <DotMatrixLoader className={className} dotSize={3} fullscreen={false} size={24} />
}
