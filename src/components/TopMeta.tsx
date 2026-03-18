'use client'

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

  return (
    <>
      <div
        className="fixed right-4 top-4 z-50 hidden items-center gap-4 rounded-full backdrop-blur-xl px-5 py-2.5 sm:right-6 sm:top-6 sm:flex top-meta-pill"
      >
        {PAGE_NAV.map((item) => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : item.href.startsWith('/#')
              ? pathname === '/'
              : pathname.startsWith(item.href)
          return (
            <NavLink key={item.href} href={item.href} name={item.name} isActive={isActive} />
          )
        })}
      </div>
    </>
  )
}
