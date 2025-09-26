'use client'

import { type ReactNode, useEffect } from 'react'
import { setupLazyLoading } from '@/lib/performance'

interface ClientWrapperProps {
  children: ReactNode
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  useEffect(() => {
    const cleanup = setupLazyLoading()

    return () => {
      cleanup()
    }
  }, [])
  return <>{children}</>
}
