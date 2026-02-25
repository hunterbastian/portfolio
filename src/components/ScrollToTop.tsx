'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion() ?? false

  useEffect(() => {
    const onScroll = () => {
      const scrolledToBottom =
        window.scrollY + window.innerHeight >= document.body.scrollHeight - 120
      setVisible(scrolledToBottom && window.scrollY > 400)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-8 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full focus-visible:outline-none sm:bottom-10 sm:right-8"
          style={{
            border: '1px solid var(--border)',
            background: 'var(--card)',
            color: 'var(--foreground)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}
          initial={{ opacity: 0, y: 12, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.92 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.94 }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            aria-hidden
          >
            <path
              d="M7.5 2.5L2.5 7.5M7.5 2.5L12.5 7.5M7.5 2.5V12.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
