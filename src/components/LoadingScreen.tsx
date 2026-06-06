'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import DotMatrixLoader from './DotMatrixLoader'
import {
  LOADING_SCREEN_CONTENT_TRANSITION,
  LOADING_SCREEN_DEFAULT_DURATION_MS,
  LOADING_SCREEN_LOADER_TRANSITION,
  scheduleLoadingScreenReveal,
} from '@/lib/loading-screen'
import { MOTION_EASE_SOFT } from '@/lib/motion'

interface LoadingScreenProps {
  children: ReactNode
  duration?: number
}

export default function LoadingScreen({
  children,
  duration = LOADING_SCREEN_DEFAULT_DURATION_MS,
}: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timer = scheduleLoadingScreenReveal({
      durationMs: duration,
      scheduleReveal: (delayMs) => setTimeout(() => setIsLoading(false), delayMs),
      setIsMounted,
    })

    return () => clearTimeout(timer)
  }, [duration])

  if (!isMounted) {
    return <>{children}</>
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <m.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ...LOADING_SCREEN_LOADER_TRANSITION, ease: MOTION_EASE_SOFT }}
          >
            <DotMatrixLoader />
          </m.div>
        ) : (
          <m.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...LOADING_SCREEN_CONTENT_TRANSITION, ease: MOTION_EASE_SOFT }}
          >
            {children}
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
