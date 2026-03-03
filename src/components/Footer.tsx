'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import FooterSnakeEasterEgg from './FooterSnakeEasterEgg'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [visible, setVisible] = useState(false)
  const lastScrollY = useRef(0)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const threshold = 4 // minimum px delta to count as intentional scroll

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY.current

      // Near the very bottom of the page — always show
      const nearBottom =
        window.innerHeight + currentScrollY >= document.documentElement.scrollHeight - 80

      if (nearBottom) {
        setVisible(true)
      } else if (delta > threshold) {
        // Scrolling down → show the shelf
        setVisible(true)
      } else if (delta < -threshold) {
        // Scrolling up → hide the shelf
        setVisible(false)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.footer
      className="border-t"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        borderColor: 'var(--border)',
        background: 'var(--background)',
      }}
      initial={{ y: '100%' }}
      animate={{ y: visible ? '0%' : '100%' }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              type: 'spring',
              stiffness: 260,
              damping: 28,
              mass: 0.8,
            }
      }
    >
      <div className="container relative z-10 mx-auto grid max-w-6xl gap-3 px-4 py-6 text-center md:grid-cols-[1fr_auto_1fr] md:items-center">
        <span className="font-sans text-[11px] tracking-[0.04em] text-muted-foreground md:justify-self-start">
          © {currentYear}
        </span>
        <div className="flex items-center justify-center">
          <FooterSnakeEasterEgg />
        </div>
        <p className="font-sans text-[11px] tracking-[0.04em] text-muted-foreground md:justify-self-end md:text-right">
          Crafted by Hunter Bastian
        </p>
      </div>
    </motion.footer>
  )
}
