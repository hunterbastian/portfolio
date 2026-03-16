'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { IconChevronUp } from 'nucleo-pixel-essential'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

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
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <m.button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-8 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full focus-visible:outline-none sm:bottom-10 sm:right-8"
          style={{
            background: 'var(--card)',
            color: 'var(--foreground)',
            boxShadow: '0px 0px 0px 1px rgba(0,0,0,0.06), 0px 1px 2px -1px rgba(0,0,0,0.06), 0px 2px 4px 0px rgba(0,0,0,0.04)',
          }}
          initial={{ opacity: 0, y: 16, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 24,
            mass: 0.8,
            opacity: { duration: 0.25 },
          }}
          whileHover={{ y: -2, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
          whileTap={{ scale: 0.92 }}
        >
          <IconChevronUp size={15} aria-hidden style={{ marginTop: '-1px' }} />
        </m.button>
      )}
    </AnimatePresence>
  )
}
