'use client'

import Link from 'next/link'
import { m } from 'framer-motion'
import { siteMailtoHref } from '@/lib/site'

export default function NotFound() {
  return (
    <div className="container mx-auto max-w-[560px] px-4 py-16">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <m.h1
          className="text-6xl md:text-8xl font-bold text-muted-foreground mb-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          404
        </m.h1>
        
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Page Not Found</h2>
        
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Go Home
            </Link>
          </m.div>
          
          <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Contact Me
            </Link>
          </m.div>
        </div>
        
        <m.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-sm text-muted-foreground">
            If you think this is an error, please{' '}
            <a
              href={siteMailtoHref}
              className="text-primary hover:text-primary/80 underline underline-offset-4"
            >
              let me know
            </a>
          </p>
        </m.div>
      </m.div>
    </div>
  )
}
