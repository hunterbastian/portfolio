'use client'

import { useState, useRef } from 'react'
import { m, useInView, useReducedMotion } from 'framer-motion'
import { MOTION_EASE_SOFT, motionDurationMs } from '@/lib/motion'

interface LiveDemoProps {
  /** URL to embed in the iframe */
  src: string
  /** Title for the iframe (accessibility) */
  title: string
  /** CSS aspect-ratio value. Default: "16/9" */
  aspectRatio?: string
}

const DURATION_MS = 600

export default function LiveDemo({
  src,
  title,
  aspectRatio = '16/9',
}: LiveDemoProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px -60px 0px' })
  const prefersReducedMotion = useReducedMotion() ?? false

  return (
    <figure ref={ref} className="not-prose my-10">
      <m.div
        className="overflow-hidden rounded-[3px] border border-border"
        style={{
          boxShadow: '0px 0px 0px 1px rgba(0,0,0,0.06), 0px 1px 2px -1px rgba(0,0,0,0.06), 0px 2px 4px 0px rgba(0,0,0,0.04)',
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{
          duration: motionDurationMs(DURATION_MS, prefersReducedMotion),
          ease: MOTION_EASE_SOFT,
        }}
      >
        {!isLoaded ? (
          <button
            type="button"
            onClick={() => setIsLoaded(true)}
            className="group relative w-full bg-card/80"
            style={{ aspectRatio }}
            aria-label={`Load ${title} demo`}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/8 transition-colors duration-200 group-hover:bg-foreground/12">
                <svg
                  className="h-5 w-5 text-foreground/70 ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="font-mono text-[11px] tracking-[0.08em] text-muted-foreground">
                Load interactive demo
              </span>
            </div>
          </button>
        ) : (
          <div style={{ aspectRatio }}>
            <iframe
              src={src}
              title={title}
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
              loading="lazy"
            />
          </div>
        )}
      </m.div>

      {/* Fallback link */}
      <div className="mt-2 flex justify-end">
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.08em] text-muted-foreground transition-colors duration-200 hover:text-foreground"
        >
          Open in new tab
          <svg
            className="h-2.5 w-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </figure>
  )
}
