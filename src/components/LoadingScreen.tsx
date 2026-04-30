'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import DotMatrixLoader from './DotMatrixLoader'
import { MOTION_EASE_SOFT } from '@/lib/motion'

interface LoadingScreenProps {
  children: React.ReactNode
  duration?: number
}

export default function LoadingScreen({ children, duration = 1000 }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const timer = setTimeout(() => setIsLoading(false), duration)
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
            transition={{ duration: 0.5, ease: MOTION_EASE_SOFT }}
          >
            <DotMatrixLoader />
          </m.div>
        ) : (
          <m.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: MOTION_EASE_SOFT }}
          >
            {children}
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
