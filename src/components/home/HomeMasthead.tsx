'use client'

import Link from 'next/link'
import MobileNavigation from '@/components/MobileNavigation'
import { homeHeroContent } from '@/content/homepage'

export function HomeMasthead() {
  return (
    <header className="home-masthead">
      <div className="home-masthead-inner">
        <div className="home-masthead-identity">
          <Link href="/" className="home-masthead-name">{homeHeroContent.headline}</Link>
          <p>{homeHeroContent.discipline}<br />Based in {homeHeroContent.subtitle}</p>
        </div>
        <nav className="home-masthead-nav" aria-label="On this page">
          <a href="#projects">Work</a>
          <a href="#background">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="home-masthead-menu sm:hidden"><MobileNavigation /></div>
      </div>
    </header>
  )
}
