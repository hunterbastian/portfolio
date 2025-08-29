'use client'

import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <motion.div
          className="w-12 h-12 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground"
        >
          Loading portfolio...
        </motion.p>
      </div>
    </div>
  )
}
