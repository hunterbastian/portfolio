'use client'

import { useEffect, useState } from 'react'
import { CentralIcon } from '@/icons'

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

  const handleRefreshToTop = () => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    const { pathname, search } = window.location
    window.location.assign(`${pathname}${search}`)
  }

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
      className="sticky top-0 z-50 w-full px-3 py-2 sm:px-5 sm:py-2"
      style={{
        borderBottom: '1px solid color-mix(in srgb, var(--border) 62%, transparent)',
        backgroundColor: 'color-mix(in srgb, var(--background) 78%, transparent)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex h-10 items-center justify-between">
          <button
            type="button"
            onClick={handleRefreshToTop}
            className="group inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
            aria-label="Refresh and return to top"
            title="Refresh and return to top"
          >
            <CentralIcon
              name="IconArrowRotateClockwise"
              size={16}
              className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180"
              aria-hidden
            />
          </button>

          <nav
            className="header-nav-vertical hidden md:flex"
            role="navigation"
            aria-label="Primary"
          >
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className={`header-nav-link font-code cursor-pointer ${activeSection === item.href ? 'is-active' : ''}`}
                aria-current={activeSection === item.href ? 'page' : undefined}
              >
                {item.name}
              </a>
            ))}
          </nav>

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:text-foreground"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
              {showMobileMenu ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {showMobileMenu && (
        <div className="md:hidden mt-2 border-t pt-2" style={{ borderColor: 'color-mix(in srgb, var(--border) 66%, transparent)' }}>
          <div className="container mx-auto max-w-6xl space-y-0.5 px-0.5">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  handleSmoothScroll(e, item.href)
                  setShowMobileMenu(false)
                }}
                className={`font-code block py-2 text-[11px] tracking-[0.1em] transition-colors duration-200 cursor-pointer ${
                  activeSection === item.href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
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
