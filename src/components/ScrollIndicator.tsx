'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function ScrollIndicator() {
  const [isMounted, setIsMounted] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0
      
      setScrollProgress(Math.min(Math.max(scrollPercent, 0), 1))
      setIsVisible(true) // Always visible
      
      // Debug log (remove this later)
      console.log('Scroll:', { scrollTop, docHeight, scrollPercent, scrollProgress: Math.min(Math.max(scrollPercent, 0), 1) })
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    updateScrollProgress() // Initial check

    return () => window.removeEventListener('scroll', updateScrollProgress)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <motion.div
      className="relative w-3 h-3 ml-2"
      initial={{ opacity: 1, scale: 1 }}
      animate={{ 
        opacity: 1, // Always visible
        scale: 1
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Background circle */}
      <div className="absolute inset-0 rounded-full border border-foreground/20" />
      
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
          className="text-foreground/60"
          strokeDasharray={`${2 * Math.PI * 4.5}`}
          strokeDashoffset={`${2 * Math.PI * 4.5 * (1 - scrollProgress)}`}
          style={{
            transition: 'stroke-dashoffset 0.1s ease-out'
          }}
        />
      </svg>
      
      {/* Center dot */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-1 h-1 bg-foreground/40 rounded-full transform -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      />
    </motion.div>
  )
}
