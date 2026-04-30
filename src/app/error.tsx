'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
      <div className="max-w-sm text-center">
        <p
          className="text-[11px] tracking-[0.14em] uppercase text-muted-foreground"
          style={{ fontFamily: 'inherit' }}
        >
          Error
        </p>
        <h2 className="mt-3 text-sm font-medium tracking-[0.06em] text-foreground" style={{ fontFamily: 'inherit' }}>
          Something went wrong.
        </h2>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground" style={{ fontFamily: 'inherit' }}>
          We hit an unexpected error. You can try again or return home.
        </p>
        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            onClick={() => reset()}
            className="inline-flex min-h-[40px] origin-center touch-manipulation items-center font-mono text-[12px] tracking-[0.06em] text-foreground transition-[color,transform] duration-150 hover:text-muted-foreground active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-[40px] origin-center touch-manipulation items-center text-xs tracking-[0.08em] uppercase text-muted-foreground transition-[color,transform] duration-150 hover:text-foreground active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            style={{ fontFamily: 'inherit' }}
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
