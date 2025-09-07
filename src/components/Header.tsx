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
            borderRadius: '12px',
            background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.85) 0%, rgba(241, 245, 249, 0.8) 50%, rgba(226, 232, 240, 0.85) 100%)',
            backdropFilter: 'blur(20px) saturate(120%)',
            WebkitBackdropFilter: 'blur(20px) saturate(120%)',
            boxShadow: '0 2px 16px rgba(100, 116, 139, 0.15), 0 0 0 1px rgba(148, 163, 184, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(148, 163, 184, 0.25)'
          }}
        >
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Link 
              href="/" 
              className="font-bold text-sm text-slate-700"
              style={{
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
              }}
            >
              HB
            </Link>
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                className={`text-xs font-medium transition-all duration-200 px-3 py-2 rounded-lg relative ${
                  activeSection === item.href 
                    ? 'text-slate-800 font-semibold' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
                style={{
                  textShadow: activeSection === item.href 
                    ? '0 1px 2px rgba(255, 255, 255, 0.9)' 
                    : '0 1px 2px rgba(255, 255, 255, 0.6)',
                  ...{
                    backdropFilter: activeSection === item.href ? 'blur(8px) saturate(110%)' : 'none',
                    background: activeSection === item.href 
                      ? 'rgba(148, 163, 184, 0.15)' 
                      : 'transparent',
                    boxShadow: activeSection === item.href 
                      ? 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 1px 3px rgba(100, 116, 139, 0.1)'
                      : 'none'
                  }
                }}
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: 'rgba(148, 163, 184, 0.1)'
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {item.name}
              </motion.a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-lg text-slate-700"
            style={{
              textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
            }}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: 'rgba(148, 163, 184, 0.15)'
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
                borderRadius: '16px',
                background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.85) 50%, rgba(226, 232, 240, 0.9) 100%)',
                backdropFilter: 'blur(20px) saturate(120%)',
                WebkitBackdropFilter: 'blur(20px) saturate(120%)',
                boxShadow: '0 4px 20px rgba(100, 116, 139, 0.2), 0 0 0 1px rgba(148, 163, 184, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.3)'
              }}
            >
              {navigation.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={`block py-3 px-3 text-sm transition-all rounded-lg ${
                    activeSection === item.href
                      ? 'text-slate-800 font-semibold'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                  style={{
                    textShadow: activeSection === item.href 
                      ? '0 1px 2px rgba(255, 255, 255, 0.9)' 
                      : '0 1px 2px rgba(255, 255, 255, 0.6)',
                    background: activeSection === item.href 
                      ? 'rgba(148, 163, 184, 0.1)'
                      : 'transparent'
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  whileHover={{ 
                    scale: 1.01,
                    backgroundColor: 'rgba(148, 163, 184, 0.15)',
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