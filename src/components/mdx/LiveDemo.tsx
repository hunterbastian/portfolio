'use client'

import { useState, useRef } from 'react'
import { m, useInView, useReducedMotion } from 'framer-motion'
import { BLANK_LINK_TARGET, getSafeExternalLinkRel } from '@/lib/link-safety'
import {
  LIVE_DEMO_DEFAULT_ASPECT_RATIO,
  LIVE_DEMO_FALLBACK_LINK_LABEL,
  LIVE_DEMO_LOAD_BUTTON_LABEL,
  LIVE_DEMO_PANEL_DURATION_MS,
  getLiveDemoLoadAriaLabel,
  getLiveDemoPanelAnimationState,
} from '@/lib/live-demo'
import { MOTION_EASE_SOFT, motionDurationMs } from '@/lib/motion'

interface LiveDemoProps {
  /** URL to embed in the iframe */
  src: string
  /** Title for the iframe (accessibility) */
  title: string
  /** CSS aspect-ratio value. Default: "16/9" */
  aspectRatio?: string
}

export default function LiveDemo({
  src,
  title,
  aspectRatio = LIVE_DEMO_DEFAULT_ASPECT_RATIO,
}: LiveDemoProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px -60px 0px' })
  const prefersReducedMotion = useReducedMotion() ?? false

  return (
    <figure ref={ref} className="not-prose my-10">
      <m.div
        className="overflow-hidden border border-border shadow-card"
        initial={getLiveDemoPanelAnimationState(false)}
        animate={getLiveDemoPanelAnimationState(isInView)}
        transition={{
          duration: motionDurationMs(LIVE_DEMO_PANEL_DURATION_MS, prefersReducedMotion),
          ease: MOTION_EASE_SOFT,
        }}
      >
        {!isLoaded ? (
          <button
            type="button"
            onClick={() => setIsLoaded(true)}
            className="group relative w-full origin-center touch-manipulation bg-card/80 transition-transform duration-150 active:translate-y-0 active:scale-[0.96]"
            style={{ aspectRatio }}
            aria-label={getLiveDemoLoadAriaLabel(title)}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/8 transition-colors duration-200 group-hover:bg-foreground/12">
                <svg
                  className="h-5 w-5 text-foreground/70 ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="font-mono text-[11px] tracking-[0.08em] text-muted-foreground">
                {LIVE_DEMO_LOAD_BUTTON_LABEL}
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
          target={BLANK_LINK_TARGET}
          rel={getSafeExternalLinkRel(BLANK_LINK_TARGET)}
          className="inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.08em] text-muted-foreground transition-colors duration-200 hover:text-foreground"
        >
          {LIVE_DEMO_FALLBACK_LINK_LABEL}
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
