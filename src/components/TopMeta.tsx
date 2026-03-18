'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useScrambleText } from '@/lib/scramble'
import { siteConfig } from '@/lib/site'

interface TopMetaProps {
  coordinates: string
  location: string
  season: string
}

const PAGE_NAV = [
  { name: 'HOME', href: '/' },
  { name: 'ABOUT ME', href: '/about' },
  { name: 'PLAYGROUND', href: '/archive' },
  { name: 'BLOG', href: '/blog' },
] as const


function NavLink({ href, name, isActive }: { href: string; name: string; isActive: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center text-[11px] tracking-[0.12em] uppercase whitespace-nowrap underline-offset-[3px] decoration-[1px] transition-[text-decoration-color,opacity] duration-300 ease-out ${
        isActive
          ? 'text-foreground underline decoration-foreground/40'
          : 'text-foreground opacity-60 no-underline hover:opacity-90 hover:underline'
      }`}
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

  const coord = useScrambleText(siteConfig.siteCoordinates, true, 400)
  const location = useScrambleText('UTAH, USA', true, 600)

  return (
    <>
      {/* Top-edge gradient so scrolling content fades out smoothly */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-40 hidden h-16 sm:block"
        style={{ background: 'linear-gradient(to bottom, var(--background) 0%, transparent 100%)' }}
      />
      <div
        className="fixed left-4 top-4 z-50 hidden select-none cursor-default sm:left-6 sm:top-6 sm:block"
        onMouseEnter={() => { coord.scramble(); location.scramble() }}
      >
        <p className="text-[10px] tracking-[0.1em] text-foreground/60 whitespace-nowrap font-mono tabular-nums leading-tight">
          {coord.display}
        </p>
        <p className="text-[9px] tracking-[0.1em] text-muted-foreground/50 whitespace-nowrap font-mono leading-tight">
          {location.display}
        </p>
      </div>
      <div
        className="fixed right-4 top-4 z-50 hidden items-center gap-4 rounded-full backdrop-blur-xl px-5 py-2.5 sm:right-6 sm:top-6 sm:flex top-meta-pill"
      >
        {PAGE_NAV.map((item) => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : item.href.startsWith('/#')
              ? false
              : pathname.startsWith(item.href)
          return (
            <NavLink key={item.href} href={item.href} name={item.name} isActive={isActive} />
          )
        })}
      </div>
    </>
  )
}
