'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

// Smooth scroll handler
const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault()
  const target = document.querySelector(href)
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
    // Update URL without scrolling
    window.history.pushState({}, '', href)
  }
}

const navigation: Array<{ name: string; href: string }> = [
  { name: 'CASE STUDIES', href: '#case-studies' },
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
    <header className="sticky top-0 z-50 w-full py-4 px-6 bg-white dark:bg-gray-950">
      <div className="container mx-auto max-w-6xl">
        <div 
          className="flex h-14 items-center justify-between px-8 border-b border-gray-200 dark:border-gray-800"
        >
          {/* Logo */}
          <Link 
            href="/" 
            className="font-medium text-sm text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          >
            HB
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Primary">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className={`text-xs font-light tracking-wide transition-colors cursor-pointer ${
                  activeSection === item.href 
                    ? 'text-gray-900 dark:text-gray-100' 
                    : 'text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
                aria-current={activeSection === item.href ? 'page' : undefined}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              {showMobileMenu ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden px-6 pb-4 mt-4 bg-white dark:bg-gray-950">
          <div className="container mx-auto max-w-6xl">
            <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-2">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    handleSmoothScroll(e, item.href)
                    setShowMobileMenu(false)
                  }}
                  className={`block py-3 px-3 text-sm transition-colors cursor-pointer ${
                    activeSection === item.href
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}