'use client'

import Link from 'next/link'
import { m } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-sm"
      >
        <p
          className="text-[11px] tracking-[0.14em] uppercase text-muted-foreground"
          style={{ fontFamily: 'inherit' }}
        >
          404
        </p>

        <h1
          className="mt-3 text-sm font-medium tracking-[0.06em] text-foreground"
          style={{ fontFamily: 'inherit' }}
        >
          This page doesn&apos;t exist.
        </h1>

        <p
          className="mt-3 text-xs leading-relaxed text-muted-foreground"
          style={{ fontFamily: 'inherit' }}
        >
          It might have been moved or deleted.
        </p>

        <div className="mt-8 flex items-center justify-center gap-6">
          <Link
            href="/"
            className="text-xs tracking-[0.08em] uppercase text-foreground hover:text-muted-foreground transition-colors duration-200"
            style={{ fontFamily: 'inherit' }}
          >
            ↩ Home
          </Link>
          <Link
            href="/#contact"
            className="text-xs tracking-[0.08em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200"
            style={{ fontFamily: 'inherit' }}
          >
            Contact
          </Link>
        </div>
      </m.div>
    </div>
  )
}
