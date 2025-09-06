'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const navigation: Array<{ name: string; href: string }> = [
  { name: 'CASE STUDIES', href: '#case-studies' },
  { name: 'CONTACT', href: '#contact' },
  { name: 'EXPERIENCE', href: '#experience' },
  { name: 'EDUCATION', href: '#education' },
  { name: 'CREATING', href: '#creating' },
  { name: 'EVERYDAY TECH', href: '#everyday-tech' },
  { name: 'STACK', href: '#tech-stack' }
]

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = navigation.map(item => item.href.substring(1))
      const scrollPosition = window.scrollY + 100 // Offset for header

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(`#${sectionId}`)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial position

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full py-4 px-6">
      <div className="container mx-auto max-w-6xl">
        <div 
          className="flex h-14 items-center justify-between px-8 backdrop-blur-xl border shadow-lg"
          style={{
            borderRadius: '50px',
            background: 'linear-gradient(180deg, rgba(56, 178, 172, 0.25) 0%, rgba(20, 184, 166, 0.22) 30%, rgba(13, 148, 136, 0.28) 100%)',
            backdropFilter: 'blur(24px) saturate(150%)',
            WebkitBackdropFilter: 'blur(24px) saturate(150%)',
            boxShadow: '0 4px 20px rgba(56, 178, 172, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6), inset 0 -1px 0 rgba(56, 178, 172, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Link href="/" className="font-bold text-xs text-white">
              HB
            </Link>
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                className={`text-xs font-medium transition-all duration-200 px-3 py-2 rounded-full relative ${
                  activeSection === item.href 
                    ? 'text-white font-semibold' 
                    : 'text-white/85 hover:text-white'
                }`}
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)'
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{
                  backdropFilter: activeSection === item.href ? 'blur(12px) saturate(150%)' : 'none',
                  background: activeSection === item.href 
                    ? 'rgba(255, 255, 255, 0.25)' 
                    : 'transparent',
                  boxShadow: activeSection === item.href 
                    ? 'inset 0 1px 0 rgba(255, 255, 255, 0.7), inset 0 -1px 0 rgba(56, 178, 172, 0.2)'
                    : 'none'
                }}
              >
                {item.name}
              </motion.a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-full text-white"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: 'rgba(255, 255, 255, 0.15)'
            }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <motion.svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              animate={{ rotate: showMobileMenu ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {showMobileMenu ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </motion.svg>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden px-6 pb-4 mt-4"
        >
          <div className="container mx-auto max-w-6xl">
            <div 
              className="backdrop-blur-xl border shadow-lg px-6 py-4 space-y-3"
              style={{
                borderRadius: '24px',
                background: 'linear-gradient(180deg, rgba(56, 178, 172, 0.25) 0%, rgba(20, 184, 166, 0.22) 30%, rgba(13, 148, 136, 0.28) 100%)',
                backdropFilter: 'blur(24px) saturate(150%)',
                WebkitBackdropFilter: 'blur(24px) saturate(150%)',
                boxShadow: '0 4px 20px rgba(56, 178, 172, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6), inset 0 -1px 0 rgba(56, 178, 172, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              {navigation.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={`block py-3 px-3 text-sm transition-all rounded-lg ${
                    activeSection === item.href
                      ? 'text-white font-semibold'
                      : 'text-white/85 hover:text-white'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  whileHover={{ 
                    scale: 1.01,
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    x: 3
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </header>
  )
}