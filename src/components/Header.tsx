'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import ScrollIndicator from './ScrollIndicator'

const navigation: Array<{ name: string; href: string }> = [
  { name: 'CASE STUDIES', href: '#case-studies' },
  { name: 'CONTACT', href: '#contact' },
  { name: 'EXPERIENCE', href: '#experience' },
  { name: 'EDUCATION', href: '#education' }
]

const moreNavigation: Array<{ name: string; href: string }> = [
  { name: 'CREATING', href: '#creating' },
  { name: 'EVERYDAY TECH', href: '#everyday-tech' },
  { name: 'STACK', href: '#tech-stack' }
]

export default function Header() {
  const pathname = usePathname()
  const [language, setLanguage] = useState('EN')
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 })
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({})

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Update underline position when active section changes
  useEffect(() => {
    const updateUnderline = () => {
      const activeItem = itemRefs.current[activeSection]
      if (activeItem && navRef.current) {
        const navRect = navRef.current.getBoundingClientRect()
        const itemRect = activeItem.getBoundingClientRect()
        
        setUnderlineStyle({
          width: itemRect.width - 16, // Account for padding (px-2 = 8px each side)
          left: itemRect.left - navRect.left + 8 // Offset by padding to center under text
        })
      } else {
        setUnderlineStyle({ width: 0, left: 0 })
      }
    }

    updateUnderline()
    window.addEventListener('resize', updateUnderline)
    
    return () => {
      window.removeEventListener('resize', updateUnderline)
    }
  }, [activeSection])

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = [...navigation, ...moreNavigation].map(item => item.href.substring(1))
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
    <header className="sticky top-0 z-50 w-full py-3 px-6">
      <div className="container mx-auto max-w-8xl">
        <div className="flex h-14 items-center px-6 backdrop-blur supports-[backdrop-filter]:bg-background/80 border border-border/40 rounded-t shadow-md" style={{ backgroundColor: 'rgba(245, 244, 243, 0.8)' }}>
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold" style={{ fontSize: '11px' }}>
                HB
              </span>
              <div className="relative" style={{ width: '11px', height: '11px' }}>
                <Image
                  src="/favicon/Frame.svg"
                  alt="Hunter Bastian Logo"
                  width={11}
                  height={11}
                  className="object-contain"
                  sizes="11px"
                />
              </div>
            </Link>
            <ScrollIndicator />
          </div>
          
          {/* Desktop Navigation */}
          <nav ref={navRef} className="ml-auto hidden lg:flex items-center space-x-4 relative">
            {navigation.map((item) => (
              <a
                key={item.href}
                ref={(el) => { itemRefs.current[item.href] = el }}
                href={item.href}
                className={`relative font-medium transition-colors duration-200 px-2 py-1 font-garamond-narrow ${
                  activeSection === item.href 
                    ? 'text-foreground' 
                    : 'text-foreground/60 hover:text-foreground/80'
                }`}
                style={{ fontSize: '10px' }}
              >
                {item.name}
              </a>
            ))}
            
            {/* Sliding underline */}
            <motion.div
              className="absolute bottom-1 h-0.5 bg-gray-600 rounded-full"
              animate={{
                width: underlineStyle.width,
                x: underlineStyle.left
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            />
            
            {/* More Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={`relative font-medium transition-all duration-200 flex items-center gap-1 px-2 py-1 font-garamond-narrow group ${
                  moreNavigation.some(item => activeSection === item.href)
                    ? 'text-foreground'
                    : 'text-foreground/60 hover:text-foreground/80'
                }`}
                style={{ fontSize: '10px' }}
              >
                MORE
                <svg 
                  className={`w-3 h-3 transition-transform ${showMoreMenu ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
                {/* Active/Hover Line */}
                <span className={`absolute bottom-0 left-1/2 h-0.5 bg-gray-600 transition-all duration-200 transform -translate-x-1/2 ${
                  moreNavigation.some(item => activeSection === item.href)
                    ? 'w-full opacity-100' 
                    : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                }`} />
              </button>
              
              {showMoreMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-2 w-40 backdrop-blur supports-[backdrop-filter]:bg-background/80 border rounded shadow-md py-1 z-50"
                  style={{ backgroundColor: 'rgba(245, 244, 243, 0.8)' }}
                >
                  {moreNavigation.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setShowMoreMenu(false)}
                      className={`block px-3 py-2 transition-colors font-garamond-narrow ${
                        activeSection === item.href
                          ? 'text-foreground bg-muted'
                          : 'text-foreground/60 hover:text-foreground hover:bg-muted'
                      }`}
                      style={{ fontSize: '10px' }}
                    >
                      {item.name}
                    </a>
                  ))}
                </motion.div>
              )}
            </div>
            
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'EN' ? 'ES' : 'EN')}
              className="relative font-medium transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1 px-2 py-1 font-garamond-narrow"
              style={{ fontSize: '10px' }}
            >
              <svg 
                className="w-3 h-3" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              {language}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="ml-auto lg:hidden p-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
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
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="lg:hidden px-6 mt-0"
        >
          <div className="container mx-auto max-w-8xl">
            <div className="backdrop-blur supports-[backdrop-filter]:bg-background/80 border border-border/40 border-t-0 rounded-b shadow-md px-6 py-4 space-y-2" style={{ backgroundColor: 'rgba(245, 244, 243, 0.8)' }}>
              {[...navigation, ...moreNavigation].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={`block py-2 transition-colors font-garamond-narrow relative ${
                    activeSection === item.href
                      ? 'text-foreground'
                      : 'text-foreground/60 hover:text-foreground'
                  }`}
                  style={{ fontSize: '12px' }}
                >
                  {item.name}
                  {activeSection === item.href && (
                    <span className="absolute left-0 top-1/2 w-0.5 h-4 bg-gray-600 transform -translate-y-1/2" />
                  )}
                </a>
              ))}
              
              <div className="pt-2 border-t">
                <button
                  onClick={() => setLanguage(language === 'EN' ? 'ES' : 'EN')}
                  className="flex items-center gap-2 py-2 text-foreground/60 hover:text-foreground transition-colors font-garamond-narrow"
                  style={{ fontSize: '12px' }}
                >
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M2 12h20"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  Language: {language}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  )
}