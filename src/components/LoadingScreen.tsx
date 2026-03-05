'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { PortfolioLoader } from './Loader'

interface LoadingScreenProps {
  children: React.ReactNode
  duration?: number
}

export default function LoadingScreen({ children, duration = 1000 }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  // Prevent hydration mismatch by not rendering until mounted
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
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 bg-background"
          >
            <PortfolioLoader />
          </m.div>
        ) : (
          <m.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.16 }}
          >
            {children}
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
