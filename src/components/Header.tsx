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
  { name: 'ABOUT ME', href: '#about-me' },
  { name: 'CREATING', href: '#creating' },
  { name: 'EVERYDAY TECH', href: '#everyday-tech' },
  { name: 'STACK', href: '#tech-stack' }
]

export default function Header() {
  const pathname = usePathname()
  const [language, setLanguage] = useState('EN')
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 mx-auto max-w-6xl">
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
        <nav className="ml-auto hidden lg:flex items-center space-x-4">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative font-medium transition-colors hover:text-foreground/80 text-foreground/60 px-2 py-1"
              style={{ fontSize: '10px' }}
            >
              {item.name}
            </a>
          ))}
          
          {/* More Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="relative font-medium transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1 px-2 py-1"
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
            </button>
            
            {showMoreMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 mt-2 w-40 bg-background border rounded-md shadow-lg py-1 z-50"
              >
                {moreNavigation.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowMoreMenu(false)}
                    className="block px-3 py-2 text-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
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
            className="relative font-medium transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1 px-2 py-1"
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

      {/* Mobile Menu */}
      {showMobileMenu && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden border-t bg-background/95 backdrop-blur"
        >
          <div className="container mx-auto max-w-6xl px-4 py-4 space-y-2">
            {[...navigation, ...moreNavigation].map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setShowMobileMenu(false)}
                className="block py-2 text-foreground/60 hover:text-foreground transition-colors"
                style={{ fontSize: '12px' }}
              >
                {item.name}
              </a>
            ))}
            
            <div className="pt-2 border-t">
              <button
                onClick={() => setLanguage(language === 'EN' ? 'ES' : 'EN')}
                className="flex items-center gap-2 py-2 text-foreground/60 hover:text-foreground transition-colors"
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
        </motion.div>
      )}
    </header>
  )
}
