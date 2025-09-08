'use client'

import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold mb-3">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">We hit an unexpected error. You can try again or return home.</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => reset()} className="px-4 py-2 rounded bg-primary text-primary-foreground">
              Try again
            </button>
            <a href="/" className="px-4 py-2 rounded border">Go Home</a>
          </div>
        </div>
      </body>
    </html>
  )
}


