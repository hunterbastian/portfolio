'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import ScrollIndicator from './ScrollIndicator'

const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault()
  const target = document.querySelector(href)
  if (target) {
    window.dispatchEvent(new CustomEvent('hb:section-navigate', { detail: { href } }))
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scrollToTarget = () =>
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      })

    if (prefersReducedMotion) {
      scrollToTarget()
    } else {
      requestAnimationFrame(scrollToTarget)
    }

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
    const sectionIds = navigation.map((item) => item.href.slice(1))
    const sectionElements = sectionIds
      .map((sectionId) => document.getElementById(sectionId))
      .filter((element): element is HTMLElement => Boolean(element))

    if (sectionElements.length === 0) {
      return
    }

    const visibilityRatios = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibilityRatios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        })

        let nextSection = ''
        let bestRatio = 0
        visibilityRatios.forEach((ratio, sectionId) => {
          if (ratio > bestRatio) {
            bestRatio = ratio
            nextSection = `#${sectionId}`
          }
        })

        if (nextSection) {
          setActiveSection((previous) => (previous === nextSection ? previous : nextSection))
        }
      },
      {
        root: null,
        rootMargin: '-100px 0px -50% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    )

    sectionElements.forEach((section) => {
      visibilityRatios.set(section.id, 0)
      observer.observe(section)
    })

    const currentHash = window.location.hash
    if (currentHash && sectionIds.includes(currentHash.slice(1))) {
      setActiveSection(currentHash)
    } else {
      setActiveSection(`#${sectionElements[0].id}`)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <header
      className="sticky top-0 z-50 w-full border-b px-4 py-3 sm:px-6 sm:py-4"
      style={{
        borderColor: 'var(--border)',
        backgroundColor: 'color-mix(in srgb, var(--background) 88%, transparent)',
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex h-12 items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground no-underline hover:text-primary transition-colors duration-300"
          >
            <ScrollIndicator />
            <span className="font-code font-medium text-sm tracking-[0.14em] sm:hidden">HB</span>
            <span className="hidden sm:flex flex-col leading-tight">
              <span className="font-code text-[11px] font-medium tracking-[0.12em] text-foreground">
                HUNTER BASTIAN // STUDIO ALPINE
              </span>
              <span className="font-code text-[10px] tracking-[0.11em] text-muted-foreground">
                INTERACTION DESIGNER - LEHI, UTAH
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Primary">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className={`font-code text-[11px] font-medium tracking-[0.14em] transition-colors duration-300 cursor-pointer ${
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
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors duration-300"
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
          <div className="container mx-auto max-w-6xl space-y-1 px-1">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  handleSmoothScroll(e, item.href)
                  setShowMobileMenu(false)
                }}
                className={`font-code block py-3 text-xs tracking-[0.14em] transition-colors duration-300 cursor-pointer ${
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
