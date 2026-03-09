'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'

function handleSmoothScroll(e: React.MouseEvent<HTMLAnchorElement>, href: string): void {
  e.preventDefault()
  const target = document.querySelector(href)
  if (target) {
    window.dispatchEvent(new CustomEvent('hb:section-navigate', { detail: { href } }))
    target.scrollIntoView({ behavior: 'auto', block: 'start' })
    window.history.pushState({}, '', href)
  }
}

const HOME_SECTION_NAV = [
  { name: 'PROJECTS', href: '#case-studies' },
  { name: 'ENDEAVORS', href: '#creating' },
  { name: 'EXPERIENCE', href: '#experience' },
  { name: 'EDUCATION', href: '#education' },
  { name: 'CONTACT', href: '#contact' },
] as const

const PROJECT_PAGE_NAV = [
  { name: 'HOME', href: '/' },
  { name: 'PROJECTS', href: '/#case-studies' },
  { name: 'CONTACT', href: '/#contact' },
] as const

export default function Header() {
  const pathname = usePathname()
  const isHomeRoute = pathname === '/'
  const navigation = useMemo(
    () => (isHomeRoute ? HOME_SECTION_NAV : PROJECT_PAGE_NAV),
    [isHomeRoute],
  )
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [hoveredSection, setHoveredSection] = useState('')

  const handleBrandAction = () => {
    if (!isHomeRoute) {
      window.location.assign('/')
      return
    }

    window.scrollTo({ top: 0, behavior: 'auto' })
    const { pathname, search } = window.location
    window.location.assign(`${pathname}${search}`)
  }

  useEffect(() => {
    if (!isHomeRoute) {
      setActiveSection('')
      return
    }

    const sectionIds = HOME_SECTION_NAV.map((item) => item.href.slice(1))
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
  }, [isHomeRoute])

  const emphasizedSection = hoveredSection || activeSection || navigation[0]?.href || ''

  return (
    <header
      className="site-header-frosted sticky top-0 z-50 w-full border-b px-4 py-3 sm:px-6 sm:py-4"
      style={{
        borderColor: 'var(--border)',
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex h-14 items-center justify-between">
          <button
            type="button"
            onClick={handleBrandAction}
            className="group flex items-baseline gap-1.5 focus-visible:outline-none"
            aria-label="Return to top"
            title="Return to top"
          >
            <span
              className="text-[11px] font-medium tracking-[0.1em] uppercase transition-opacity duration-300 group-hover:opacity-100"
              style={{ color: 'var(--foreground)', opacity: 0.9 }}
            >
              Hunter Bastian
            </span>
          </button>

          <nav
            className="header-nav-vertical hidden md:flex"
            role="navigation"
            aria-label="Primary"
            onMouseLeave={() => setHoveredSection('')}
          >
            {navigation.map((item) => {
              const isSectionLink = isHomeRoute && item.href.startsWith('#')
              const isActive = isHomeRoute && activeSection === item.href

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    if (isSectionLink) {
                      handleSmoothScroll(e, item.href)
                    }
                  }}
                  onMouseEnter={() => setHoveredSection(item.href)}
                  onFocus={() => setHoveredSection(item.href)}
                  onBlur={() => setHoveredSection('')}
                  className={`header-nav-link cursor-pointer ${isActive ? 'is-active' : ''} ${
                    emphasizedSection === item.href ? 'is-emphasis' : 'is-subdued'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.name}
                </a>
              )
            })}
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
            {navigation.map((item) => {
              const isSectionLink = isHomeRoute && item.href.startsWith('#')
              const isActive = isHomeRoute && activeSection === item.href

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    if (isSectionLink) {
                      handleSmoothScroll(e, item.href)
                    }
                    setShowMobileMenu(false)
                  }}
                  className={`block py-3 text-xs tracking-[0.14em] transition-colors duration-300 cursor-pointer ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.name}
                </a>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}
