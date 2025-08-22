'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function ScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0.08) // Start with minimum value
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    const updateScrollProgress = () => {
      if (typeof window === 'undefined') return
      
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0
      
      // Add a minimum progress of 8% so it always shows a little bit
      const adjustedProgress = Math.min(Math.max(scrollPercent * 0.92 + 0.08, 0.08), 1)
      setScrollProgress(adjustedProgress)
    }

    // Set initial scroll progress
    updateScrollProgress()

    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    window.addEventListener('resize', updateScrollProgress, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateScrollProgress)
      window.removeEventListener('resize', updateScrollProgress)
    }
  }, [])

  // Consistent structure for SSR and client-side to prevent hydration issues
  const circleStructure = (
    <div className="relative w-3 h-3 ml-2 flex-shrink-0">
      {/* Background circle - always visible */}
      <div className="absolute inset-0 rounded-full border border-gray-300 dark:border-gray-600" />
      
      {/* Progress circle */}
      <svg
        className="absolute inset-0 w-3 h-3 -rotate-90"
        viewBox="0 0 12 12"
      >
        <circle
          cx="6"
          cy="6"
          r="4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-gray-600 dark:text-gray-400"
          strokeDasharray={`${2 * Math.PI * 4.5}`}
          strokeDashoffset={`${2 * Math.PI * 4.5 * (1 - scrollProgress)}`}
          style={{
            transition: isMounted ? 'stroke-dashoffset 0.1s ease-out' : 'none'
          }}
        />
      </svg>
      

    </div>
  )

  // If not mounted (SSR), return static version
  if (!isMounted) {
    return circleStructure
  }

  // When mounted, wrap with motion for smooth animations
  return (
    <motion.div
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="contents" // Use contents to avoid extra wrapper
    >
      {circleStructure}
    </motion.div>
  )
}