'use client'

import Link from 'next/link'
import { m } from 'framer-motion'
import IconArrowBackUp from '@/components/IconArrowBackUp'
import { Archive as ArchiveGlyph } from '@/components/pixel/glyphs'
import { MOTION_EASE_SOFT } from '@/lib/motion'

const STAGGER_DELAY = 0.08

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <m.div
          className="flex justify-center mb-4"
          initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.4, ease: MOTION_EASE_SOFT }}
        >
          <ArchiveGlyph size={24} className="text-muted-foreground/50" />
        </m.div>

        <m.p
          className="text-[11px] tracking-[0.14em] uppercase text-muted-foreground"
          style={{ fontFamily: 'inherit' }}
          initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.4, delay: 0.04, ease: MOTION_EASE_SOFT }}
        >
          404
        </m.p>

        <m.h1
          className="mt-3 text-sm font-medium tracking-[0.06em] text-foreground"
          style={{ fontFamily: 'inherit' }}
          initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.4, delay: STAGGER_DELAY, ease: MOTION_EASE_SOFT }}
        >
          This page doesn&apos;t exist.
        </m.h1>

        <m.p
          className="mt-1.5 text-xs leading-relaxed text-muted-foreground"
          style={{ fontFamily: 'inherit' }}
          initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.4, delay: STAGGER_DELAY * 2, ease: MOTION_EASE_SOFT }}
        >
          It might have been moved or deleted.
        </m.p>

        <m.div
          className="mt-10 flex items-center justify-center gap-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: STAGGER_DELAY * 3, ease: MOTION_EASE_SOFT }}
        >
          <Link
            href="/"
            className="group inline-flex min-h-[40px] origin-center touch-manipulation items-center gap-1.5 font-mono text-[12px] tracking-[0.06em] text-foreground transition-[color,transform] duration-150 hover:text-accent active:translate-y-0 active:scale-[0.96]"
          >
            <IconArrowBackUp size={12} className="shrink-0 opacity-60 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1" aria-hidden />
            Home
          </Link>
          <Link
            href="/#contact"
            className="inline-flex min-h-[40px] origin-center touch-manipulation items-center text-xs tracking-[0.08em] uppercase text-muted-foreground transition-[color,transform] duration-150 hover:text-accent active:translate-y-0 active:scale-[0.96]"
            style={{ fontFamily: 'inherit' }}
          >
            Contact
          </Link>
        </m.div>
      </div>
    </div>
  )
}
