'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function LazyDinosaur() {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // Load iframe after page is interactive
    if (typeof window !== 'undefined') {
      // Use requestIdleCallback if available, otherwise setTimeout
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          setShouldLoad(true)
        }, { timeout: 3000 })
      } else {
        setTimeout(() => {
          setShouldLoad(true)
        }, 2000)
      }
    }
  }, [])

  if (!shouldLoad) {
    return null
  }

  return (
    <motion.div
      className="flex justify-center items-center py-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        opacity: { duration: 0.8, ease: 'easeOut' },
        y: { duration: 0.8, ease: 'easeOut' }
      }}
    >
      <iframe
        loading="lazy"
        style={{ width: '130px', height: '130px', backgroundColor: 'transparent', border: 'none' }}
        src="https://app.endlesstools.io/embed/b6f39d54-23c2-429f-a315-4ea4eb90320b"
        title="3D Model"
        allow="clipboard-write; encrypted-media; gyroscope; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </motion.div>
  )
}

