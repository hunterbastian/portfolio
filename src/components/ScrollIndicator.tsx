'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function ScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    const updateScrollProgress = () => {
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

  // Show a static version during SSR, then animate when mounted
  if (!isMounted) {
    return (
      <div className="relative w-3 h-3 ml-2 flex-shrink-0">
        <div className="absolute inset-0 rounded-full border border-foreground/30" />
        <svg className="absolute inset-0 w-3 h-3 -rotate-90" viewBox="0 0 12 12">
          <circle
            cx="6"
            cy="6"
            r="4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-foreground/70"
            strokeDasharray={`${2 * Math.PI * 4.5}`}
            strokeDashoffset={`${2 * Math.PI * 4.5 * (1 - 0.08)}`}
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-foreground/50 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
      </div>
    )
  }

  return (
    <motion.div
      className="relative w-3 h-3 ml-2 flex-shrink-0"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Background circle */}
      <div className="absolute inset-0 rounded-full border border-foreground/30" />
      
      {/* Progress circle */}
      <svg
        className="absolute inset-0 w-3 h-3 -rotate-90"
        viewBox="0 0 12 12"
      >
        <motion.circle
          cx="6"
          cy="6"
          r="4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-foreground/70"
          strokeDasharray={`${2 * Math.PI * 4.5}`}
          initial={{ strokeDashoffset: `${2 * Math.PI * 4.5}` }}
          animate={{ 
            strokeDashoffset: `${2 * Math.PI * 4.5 * (1 - scrollProgress)}` 
          }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 40 
          }}
        />
      </svg>
      
      {/* Center dot */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-1 h-1 bg-foreground/50 rounded-full transform -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.2, ease: "easeOut" }}
      />
    </motion.div>
  )
}