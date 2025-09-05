'use client'

import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
  type?: 'card' | 'text' | 'title' | 'avatar' | 'custom'
  className?: string
  animate?: boolean
  count?: number
}

export default function SkeletonLoader({ 
  type = 'card',
  className = "",
  animate = true,
  count = 1
}: SkeletonLoaderProps) {
  const baseClasses = "bg-gray-200 dark:bg-gray-700 rounded"
  const animateClasses = animate ? "skeleton" : ""

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`space-y-4 p-4 ${className}`}>
            <div className={`${baseClasses} ${animateClasses} h-48 w-full`} />
            <div className="space-y-2">
              <div className={`${baseClasses} ${animateClasses} h-4 w-3/4`} />
              <div className={`${baseClasses} ${animateClasses} h-4 w-1/2`} />
            </div>
            <div className="flex space-x-2">
              <div className={`${baseClasses} ${animateClasses} h-6 w-16`} />
              <div className={`${baseClasses} ${animateClasses} h-6 w-20`} />
            </div>
          </div>
        )
      
      case 'text':
        return (
          <div className={`space-y-2 ${className}`}>
            <div className={`${baseClasses} ${animateClasses} h-4 w-full`} />
            <div className={`${baseClasses} ${animateClasses} h-4 w-4/5`} />
            <div className={`${baseClasses} ${animateClasses} h-4 w-3/5`} />
          </div>
        )
      
      case 'title':
        return (
          <div className={`${baseClasses} ${animateClasses} h-8 w-1/3 ${className}`} />
        )
      
      case 'avatar':
        return (
          <div className={`${baseClasses} ${animateClasses} h-12 w-12 rounded-full ${className}`} />
        )
      
      case 'custom':
        return (
          <div className={`${baseClasses} ${animateClasses} ${className}`} />
        )
      
      default:
        return (
          <div className={`${baseClasses} ${animateClasses} h-4 w-full ${className}`} />
        )
    }
  }

  if (count === 1) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {renderSkeleton()}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.3, 
            delay: index * 0.1 
          }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Project grid skeleton loader
export function ProjectGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.3, 
            delay: index * 0.1 
          }}
        >
          <SkeletonLoader type="card" />
        </motion.div>
      ))}
    </div>
  )
}
