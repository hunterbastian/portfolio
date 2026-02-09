'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault()
  const target = document.querySelector(href)
  if (target) {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
    window.history.pushState({}, '', href)
  }
}

const navigation: Array<{ name: string; href: string }> = [
  { name: 'CASE STUDIES', href: '#case-studies' },
  { name: 'EXPERIENCE', href: '#experience' },
  { name: 'EDUCATION', href: '#education' },
]

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigation.map((item) => item.href.substring(1))
      const scrollPosition = window.scrollY + 110

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
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className="sticky top-0 z-50 w-full py-4 px-6 border-b"
      style={{
        borderColor: 'var(--border)',
        backgroundColor: 'color-mix(in srgb, var(--background) 88%, transparent)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex h-12 items-center justify-between">
          <Link
            href="/"
            className="font-code font-medium text-sm tracking-[0.14em] text-foreground hover:text-primary transition-colors"
          >
            HB
          </Link>

          <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Primary">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className={`font-code text-[11px] font-medium tracking-[0.14em] transition-colors cursor-pointer ${
                  activeSection === item.href ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-current={activeSection === item.href ? 'page' : undefined}
              >
                {item.name}
              </a>
            ))}
          </nav>

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
              {showMobileMenu ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {showMobileMenu && (
        <div className="md:hidden mt-4 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
          <div className="container mx-auto max-w-6xl space-y-1">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  handleSmoothScroll(e, item.href)
                  setShowMobileMenu(false)
                }}
                className={`font-code block py-3 text-xs tracking-[0.14em] transition-colors cursor-pointer ${
                  activeSection === item.href ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
