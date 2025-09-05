'use client'

import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function LoadingSpinner({ 
  text = "Loading...", 
  size = 'md',
  className = ""
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const dotSizes = {
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2'
  }

  const centerSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        {/* Outer rotating ring */}
        <motion.div
          className={`${sizeClasses[size]} border-2 border-gray-200 dark:border-gray-700 rounded-full mx-auto`}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner spinning dots */}
        <motion.div
          className={`absolute inset-0 ${sizeClasses[size]} mx-auto`}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <div className={`${dotSizes[size]} bg-gray-900 dark:bg-gray-100 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2`} />
          <div className={`${dotSizes[size]} bg-gray-900 dark:bg-gray-100 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2`} />
          <div className={`${dotSizes[size]} bg-gray-900 dark:bg-gray-100 rounded-full absolute left-0 top-1/2 transform -translate-y-1/2`} />
          <div className={`${dotSizes[size]} bg-gray-900 dark:bg-gray-100 rounded-full absolute right-0 top-1/2 transform -translate-y-1/2`} />
        </motion.div>
        
        {/* Center pulse */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
        >
          <div className={`${centerSizes[size]} bg-gray-400 dark:bg-gray-500 rounded-full`} />
        </motion.div>
      </div>
      
      {text && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-4 text-center"
        >
          <motion.p
            className="text-sm font-medium text-muted-foreground"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {text}
          </motion.p>
        </motion.div>
      )}
    </div>
  )
}
