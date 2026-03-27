'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { IconChevronUp } from 'nucleo-pixel-essential'
import { useWebHaptics } from 'web-haptics/react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const haptic = useWebHaptics()

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
    haptic.trigger('light')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <m.button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-24 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:bottom-20 sm:right-8"
          style={{
            background: 'linear-gradient(160deg, #dfa8a4 0%, #d4928e 50%, #c98380 100%)',
            color: '#fff',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.3) inset, 0 1px 2px rgba(255,255,255,0.35) inset, 0 -1px 3px rgba(0,0,0,0.06) inset, 0 4px 12px rgba(212,146,142,0.35), 0 8px 24px rgba(212,146,142,0.2)',
          }}
          initial={{ opacity: 0, y: 16, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 26,
            mass: 1,
            opacity: { duration: 0.4 },
          }}
          whileHover={{ y: -2, boxShadow: '0 0 0 1px rgba(255,255,255,0.35) inset, 0 1px 2px rgba(255,255,255,0.4) inset, 0 -1px 3px rgba(0,0,0,0.06) inset, 0 6px 18px rgba(212,146,142,0.4), 0 12px 32px rgba(212,146,142,0.25)', transition: { type: 'spring', stiffness: 400, damping: 20 } }}
          whileTap={{ scale: 0.94, y: 1 }}
        >
          <IconChevronUp size={15} aria-hidden style={{ marginTop: '-1px' }} />
        </m.button>
      )}
    </AnimatePresence>
  )
}
