'use client'

import { useEffect, type ReactNode } from 'react'
import { setLenisInstance } from '@/lib/lenis'

interface SmoothScrollProps {
  children: ReactNode
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    setLenisInstance(null)
    return () => setLenisInstance(null)
  }, [])

  return <>{children}</>
}
