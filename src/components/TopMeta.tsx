'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Summer as PixelSun } from '@/components/pixel/glyphs'

const PAGE_NAV = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Playground', href: '/archive' },
] as const

function NavLink({ href, name, active }: { href: string; name: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`min-h-[40px] font-mono text-[0.76rem] tracking-[-0.01em] transition-[color,transform] duration-150 ${
        active ? 'text-foreground' : 'text-muted-foreground hover:-translate-y-[1px] hover:text-foreground'
      }`}
    >
      <span className="decoration-border underline underline-offset-[0.24em] transition-[text-decoration-color] duration-150 hover:decoration-foreground/60">
        {name}
      </span>
    </Link>
  )
}

export default function TopMeta() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 px-5 py-4 sm:px-8 sm:py-6">
      <div className="pointer-events-auto mx-auto flex max-w-[48rem] items-start justify-between gap-6">
        <Link
          href="/"
          className="min-h-[40px] inline-flex items-center gap-2 text-[0.9rem] tracking-[-0.03em] text-foreground/88 transition-[color,transform] duration-150 hover:-translate-y-[1px] hover:text-foreground"
        >
          <span>Hunter Bastian</span>
          <span className="text-accent/85">
            <PixelSun size={11} />
          </span>
        </Link>

        <nav className="hidden items-center gap-5 sm:flex">
          {PAGE_NAV.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              name={item.name}
              active={item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)}
            />
          ))}
        </nav>

        <div className="sm:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="min-h-[40px] font-mono text-[0.76rem] text-muted-foreground transition-colors duration-150 hover:text-foreground"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span className="decoration-border underline underline-offset-[0.24em]">
              Menu
            </span>
          </button>

          {mobileMenuOpen ? (
            <div className="mt-3 flex flex-col items-end gap-2 rounded-[14px] border border-border/80 bg-background/96 px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              {PAGE_NAV.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  name={item.name}
                  active={item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
