'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

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

export default function TopMeta({ coordinates }: TopMetaProps) {
  const pathname = usePathname()

  if (pathname.startsWith('/projects/') || pathname === '/about' || pathname === '/archive') {
    return null
  }

  return (
    <>
      <CoordinateLabel coordinates={coordinates} />
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
