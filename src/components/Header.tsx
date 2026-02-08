'use client'

import Link from 'next/link'
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
  { name: 'EDUCATION', href: '#education' }
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
    <header 
      className="sticky top-0 z-50 w-full py-4 px-6" 
      style={{ 
        backgroundColor: 'rgba(21, 18, 16, 0.88)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <div 
          className="flex h-14 items-center justify-between px-8 border-b"
          style={{ borderColor: 'rgba(200, 169, 107, 0.35)' }}
        >
          {/* Logo */}
          <Link 
            href="/" 
            className="font-code font-medium text-sm tracking-[0.08em] text-[#F3ECE0] hover:text-[#C8A96B] transition-colors"
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
                className={`font-code text-xs font-light tracking-[0.08em] transition-colors cursor-pointer ${
                  activeSection === item.href 
                    ? 'text-[#C8A96B]' 
                    : 'text-[#C9B69A] hover:text-[#F3ECE0]'
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
            className="md:hidden p-2 text-[#F3ECE0] hover:text-[#C8A96B] transition-colors"
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
        <div 
          className="md:hidden px-6 pb-4 mt-4" 
          style={{ 
            backgroundColor: 'rgba(21, 18, 16, 0.96)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
        >
          <div className="container mx-auto max-w-6xl">
            <div className="border-t pt-4 space-y-2" style={{ borderColor: 'rgba(200, 169, 107, 0.35)' }}>
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    handleSmoothScroll(e, item.href)
                    setShowMobileMenu(false)
                  }}
                  className={`font-code block py-3 px-3 text-sm tracking-[0.08em] transition-colors cursor-pointer ${
                    activeSection === item.href
                      ? 'text-[#C8A96B]'
                      : 'text-[#C9B69A] hover:text-[#F3ECE0]'
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
