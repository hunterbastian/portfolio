'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useUISound } from '@/lib/sounds/context'
import { clickSoftSound } from '@/lib/sounds/click-soft'

interface TopMetaProps {
  coordinates: string
  location: string
  season: string
}

const PAGE_NAV = [
  { name: 'HOME', href: '/' },
  { name: 'ABOUT ME', href: '/about' },
  { name: 'PROJECTS', href: '/#case-studies' },
  { name: 'PLAYGROUND', href: '/archive' },
  { name: 'BLOG', href: '/blog' },
] as const

function CoordinateLabel({ coordinates }: { coordinates: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="fixed left-4 top-4 z-50 select-none sm:left-6 sm:top-6 cursor-default rounded-full backdrop-blur-xl px-3 py-1.5"
      style={{ background: 'rgba(255,255,255,0.45)', boxShadow: '0px 0px 0px 1px rgba(0,0,0,0.04)', fontFamily: 'inherit' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Location: ${coordinates}`}
    >
      <div className="relative overflow-hidden">
        <span
          className="block text-[10px] tracking-[0.12em] text-foreground whitespace-nowrap sm:text-[11px]"
          style={{
            transform: hovered ? 'translateY(-100%) scale(0.92)' : 'translateY(0) scale(1)',
            opacity: hovered ? 0 : 0.9,
            filter: hovered ? 'blur(2px)' : 'blur(0)',
            transition: 'transform 500ms cubic-bezier(0.22,1,0.36,1), opacity 400ms cubic-bezier(0.22,1,0.36,1), filter 450ms cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {coordinates}
        </span>
        <span
          className="absolute left-0 top-0 block text-[10px] tracking-[0.12em] text-foreground whitespace-nowrap sm:text-[11px]"
          style={{
            transform: hovered ? 'translateY(0) scale(1)' : 'translateY(100%) scale(0.92)',
            opacity: hovered ? 0.9 : 0,
            filter: hovered ? 'blur(0)' : 'blur(2px)',
            transition: 'transform 500ms cubic-bezier(0.22,1,0.36,1), opacity 420ms cubic-bezier(0.22,1,0.36,1) 60ms, filter 450ms cubic-bezier(0.22,1,0.36,1) 60ms',
          }}
          aria-hidden
        >
          UTAH, USA
        </span>
      </div>
    </div>
  )
}

function NavLink({ href, name }: { href: string; name: string }) {
  return (
    <Link
      href={href}
      className="flex items-center text-[11px] tracking-[0.12em] uppercase text-foreground opacity-90 whitespace-nowrap no-underline hover:underline underline-offset-[3px] decoration-[1px] transition-[text-decoration-color] duration-300 ease-out"
    >
      {name}
    </Link>
  )
}

function SoundToggle() {
  const { enabled, toggle, play } = useUISound()

  return (
    <button
      type="button"
      onClick={() => {
        toggle()
        if (!enabled) {
          // Play a sample click right after enabling so the user hears feedback
          setTimeout(() => play(clickSoftSound, 0.5), 50)
        }
      }}
      className="fixed left-4 top-14 z-50 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-xl transition-opacity duration-200 hover:opacity-80 sm:left-6 sm:top-14 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/50"
      style={{ background: 'rgba(255,255,255,0.45)', boxShadow: '0px 0px 0px 1px rgba(0,0,0,0.04)' }}
      aria-label={enabled ? 'Mute sounds' : 'Enable sounds'}
      title={enabled ? 'Sound on' : 'Sound off'}
    >
      {enabled ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground opacity-70">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground opacity-40">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) }
    </button>
  )
}

export default function TopMeta({ coordinates }: TopMetaProps) {
  const pathname = usePathname()

  if (pathname.startsWith('/projects/') || pathname === '/about' || pathname === '/archive') {
    return null
  }

  return (
    <>
      <CoordinateLabel coordinates={coordinates} />
      <SoundToggle />
      <div
        className="fixed right-4 top-4 z-50 hidden items-center gap-4 rounded-full backdrop-blur-xl px-5 py-2.5 sm:right-6 sm:top-6 sm:flex"
        style={{ background: 'rgba(255,255,255,0.45)', boxShadow: '0px 0px 0px 1px rgba(0,0,0,0.04)', fontFamily: 'inherit' }}
      >
        {PAGE_NAV.map((item) => (
          <NavLink key={item.href} href={item.href} name={item.name} />
        ))}
      </div>
    </>
  )
}
