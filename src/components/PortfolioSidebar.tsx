'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { analytics } from '@/lib/analytics'
import { siteMailtoHref } from '@/lib/site'

const sections = [
  { id: 'projects', label: 'Work' },
  { id: 'playground', label: 'Explorations' },
  { id: 'photography', label: 'Photography' },
  { id: 'background', label: 'About' },
] as const

export default function PortfolioSidebar() {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState<string>('projects')

  useEffect(() => {
    if (pathname !== '/') return
    let frame = 0
    const update = () => {
      let active: string = 'projects'
      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element && element.getBoundingClientRect().top <= 180) active = section.id
      }
      setActiveSection(active)
      frame = 0
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('hashchange', schedule)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('hashchange', schedule)
    }
  }, [pathname])

  const current = pathname === '/'
    ? activeSection
    : pathname === '/archive'
      ? 'playground'
      : pathname.startsWith('/projects/')
        ? 'projects'
        : undefined

  return (
    <header className="portfolio-sidebar">
      <Link className="portfolio-name" href="/" aria-label="Hunter Bastian — home">
        Hunter Bastian
      </Link>
      <nav className="portfolio-navigation" aria-label="Portfolio">
        {sections.map((section) => (
          <Link
            key={section.id}
            href={`/#${section.id}`}
            className="portfolio-nav-link"
            aria-current={current === section.id ? 'location' : undefined}
            onClick={() => analytics.navigationClick(section.label.toLowerCase())}
          >
            <span className="portfolio-nav-mark" aria-hidden="true" />
            {section.label}
          </Link>
        ))}
      </nav>
      <div className="portfolio-sidebar-note">
        <p>Interaction designer.<br />Based in Lehi, Utah.</p>
        <div className="portfolio-sidebar-links">
          <a href={siteMailtoHref}>Email</a>
          <Link href="/cv">Résumé</Link>
        </div>
        <span className="portfolio-edition">A personal collection</span>
      </div>
    </header>
  )
}
