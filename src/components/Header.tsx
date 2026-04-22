'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useScrambleText } from '@/lib/scramble'
import { getSeason, type Season } from '@/lib/season'
import { siteConfig } from '@/lib/site'
import { MOTION_EASE_SOFT } from '@/lib/motion'
import { useSound } from '@/lib/sounds/context'
import SoundToggle from '@/components/SoundToggle'
import { Spring, Summer, Autumn, Winter } from '@/components/pixel/glyphs'
import type { ComponentType, SVGProps } from 'react'

type GlyphComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>

const SEASON_GLYPH: Record<Season, GlyphComponent> = {
  Spring,
  Summer,
  Autumn,
  Winter,
}

const PAGE_NAV = [
  { name: 'INFO', href: '/about' },
  { name: 'WORK', href: '/#case-studies' },
  { name: 'EMAIL', href: 'mailto:hunterbastianux@gmail.com', external: true },
  { name: 'LINKEDIN', href: 'https://linkedin.com/in/hunterbastian', external: true },
] as const

function CoordinateDisplay() {
  const currentSeason = getSeason()
  const coord = useScrambleText(siteConfig.siteCoordinates, true, 400)
  const location = useScrambleText('UTAH, USA', true, 600)
  const season = useScrambleText(currentSeason, true, 800)
  const SeasonGlyph = SEASON_GLYPH[currentSeason]

  return (
    <div
      className="select-none cursor-default group/coord"
      onMouseEnter={() => { coord.scramble(); location.scramble(); season.scramble() }}
    >
      <p className="text-[10px] tracking-[0.1em] text-foreground/60 whitespace-nowrap font-mono tabular-nums leading-tight transition-[filter] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/coord:blur-[3px]">
        {coord.display}
      </p>
      <p className="text-[9px] tracking-[0.1em] text-muted-foreground/50 whitespace-nowrap font-mono leading-tight transition-[filter] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/coord:blur-[3px]">
        {location.display}
      </p>
      <p className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.1em] text-accent/50 whitespace-nowrap font-mono leading-tight transition-[filter] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/coord:blur-[3px]">
        <SeasonGlyph size={8} className="shrink-0" aria-hidden />
        {season.display}
      </p>
    </div>
  )
}

export default function Header() {
  const pathname = usePathname()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const showCoordinates = true
  const { play } = useSound()

  useEffect(() => {
    setShowMobileMenu(false)
  }, [pathname])

  if (pathname === '/archive') return null

  return (
    <header
      className="site-header-frosted sticky top-0 z-50 w-full px-4 py-3 sm:px-6 sm:py-4 header-separator"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between py-1">
          <div className="flex items-start gap-4">
            <Link
              href="/"
              className="group flex min-h-[44px] items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Home"
            >
              <span
                className="inline-block size-5 rounded-full shrink-0"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, #ff5a2d 0%, #ff7a3a 28%, #f2a06a 58%, #e0a893 100%)',
                }}
                aria-hidden
              />
              <span
                className="text-xs font-medium tracking-[0.1em] uppercase transition-opacity duration-300 group-hover:opacity-100 sm:text-sm"
                style={{ color: 'var(--foreground)', opacity: 0.9 }}
              >
                Hunter Bastian
              </span>
            </Link>
            {showCoordinates && <CoordinateDisplay />}
          </div>

          <div className="flex items-center gap-1">
            <nav className="hidden sm:flex items-center gap-3">
              {PAGE_NAV.map((item, i) => (
                <m.div
                  key={item.href}
                  initial={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    duration: 0.4,
                    delay: 0.2 + i * 0.06,
                    ease: MOTION_EASE_SOFT,
                  }}
                >
                  {'external' in item && item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => play('click')}
                      className="text-[10px] tracking-[0.1em] font-mono transition-colors duration-150 underline-offset-4 decoration-transparent hover:decoration-accent text-foreground/60 hover:text-accent hover:underline leading-tight inline-flex items-center min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => play('click')}
                      className={`relative text-[10px] tracking-[0.1em] font-mono transition-colors duration-150 underline-offset-4 decoration-transparent hover:decoration-accent leading-tight inline-flex items-center min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                        pathname === item.href
                          ? 'text-foreground underline decoration-accent'
                          : 'text-foreground/60 hover:text-accent hover:underline'
                      }`}
                    >
                      {pathname === item.href && (
                        <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-[4px] h-[4px] rounded-full bg-accent" aria-hidden />
                      )}
                      {item.name}
                    </Link>
                  )}
                </m.div>
              ))}
            </nav>
            <SoundToggle />
            <button
              type="button"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="flex items-center justify-center w-11 h-11 text-muted-foreground hover:text-foreground transition-[color,transform] duration-200 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:hidden"
              aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
              aria-expanded={showMobileMenu}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
                <line
                  x1="2" y1="5" x2="14" y2="5"
                  className="origin-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ transform: showMobileMenu ? 'translateY(3px) rotate(45deg)' : 'none' }}
                />
                <line
                  x1="2" y1="11" x2="14" y2="11"
                  className="origin-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ transform: showMobileMenu ? 'translateY(-3px) rotate(-45deg)' : 'none' }}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showMobileMenu && (
          <m.div
            className="sm:hidden mt-3 border-t pt-3 pb-1 overflow-hidden"
            style={{ borderColor: 'var(--border)' }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="container mx-auto max-w-6xl space-y-0.5">
              {PAGE_NAV.map((item, i) => (
                <m.div
                  key={item.href}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                >
                  {'external' in item && item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => { play('click'); setShowMobileMenu(false) }}
                      className="block py-3 min-h-[44px] flex items-center text-xs tracking-[0.14em] uppercase transition-colors duration-200 underline-offset-4 decoration-transparent hover:decoration-accent text-muted-foreground hover:text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      style={{ fontFamily: 'inherit' }}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => { play('click'); setShowMobileMenu(false) }}
                      className={`block py-3 min-h-[44px] flex items-center text-xs tracking-[0.14em] uppercase transition-colors duration-200 underline-offset-4 decoration-transparent hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                        pathname === item.href ? 'text-foreground underline decoration-accent' : 'text-muted-foreground hover:text-accent hover:underline'
                      }`}
                      style={{ fontFamily: 'inherit' }}
                    >
                      {item.name}
                    </Link>
                  )}
                </m.div>
              ))}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  )
}
