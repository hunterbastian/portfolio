'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { MOTION_EASE_SOFT, motionDurationMs } from '@/lib/motion'

interface Hotspot {
  /** X position as percentage (0–100) */
  x: number
  /** Y position as percentage (0–100) */
  y: number
  /** Label shown on the hotspot dot */
  label: string
  /** Description revealed on click/hover */
  description: string
}

interface ImageAnnotationProps {
  /** Image source path */
  src: string
  /** Image alt text */
  alt: string
  /** Hotspot annotations — accepts an array or a JSON string (for MDX compatibility) */
  hotspots: Hotspot[] | string
  /** Image aspect ratio. Default: "16/10" */
  aspect?: string
}

function parseHotspots(input: Hotspot[] | string): Hotspot[] {
  if (Array.isArray(input)) return input
  try {
    return JSON.parse(input) as Hotspot[]
  } catch {
    return []
  }
}

const TOOLTIP_MS = 240

export default function ImageAnnotation({
  src,
  alt,
  hotspots: hotspotsInput,
  aspect = '16/10',
}: ImageAnnotationProps) {
  const hotspots = parseHotspots(hotspotsInput)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const prefersReducedMotion = useReducedMotion() ?? false

  function toggleHotspot(index: number) {
    setActiveIndex((prev) => (prev === index ? null : index))
  }

  return (
    <figure className="my-8">
      <div
        className="relative w-full overflow-hidden rounded-[3px]"
        style={{ aspectRatio: aspect, boxShadow: '0px 0px 0px 1px rgba(0,0,0,0.06), 0px 1px 2px -1px rgba(0,0,0,0.06), 0px 2px 4px 0px rgba(0,0,0,0.04)' }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 560px"
        />

        {hotspots.map((hotspot, index) => {
          const isActive = activeIndex === index

          // Determine tooltip horizontal alignment based on position
          const alignRight = hotspot.x > 65
          const alignCenter = hotspot.x > 35 && hotspot.x <= 65

          return (
            <div
              key={`${hotspot.x}-${hotspot.y}-${hotspot.label}`}
              className="absolute"
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <button
                type="button"
                onClick={() => toggleHotspot(index)}
                className="group relative flex h-6 w-6 items-center justify-center focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                aria-expanded={isActive}
                aria-label={`${hotspot.label}: ${hotspot.description}`}
              >
                {/* Ping animation */}
                <span
                  className="absolute inset-0 rounded-full animate-ping opacity-30"
                  style={{ background: 'var(--accent)', animationDuration: '2.5s' }}
                  aria-hidden
                />
                {/* Outer ring */}
                <span
                  className="absolute inset-0 rounded-full transition-transform duration-200 group-hover:scale-110"
                  style={{ background: 'var(--accent)', opacity: 0.25 }}
                  aria-hidden
                />
                {/* Inner dot */}
                <span
                  className="relative h-2.5 w-2.5 rounded-full shadow-sm transition-transform duration-200 group-hover:scale-125"
                  style={{ background: 'var(--accent)' }}
                  aria-hidden
                />
              </button>

              <AnimatePresence>
                {isActive && (
                  <m.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{
                      duration: motionDurationMs(TOOLTIP_MS, prefersReducedMotion),
                      ease: MOTION_EASE_SOFT,
                    }}
                    className="absolute z-20 mt-2 w-52 rounded-[3px] border border-border bg-background/95 px-3 py-2.5 shadow-lg backdrop-blur-sm sm:w-60"
                    style={{
                      top: '100%',
                      ...(alignRight
                        ? { right: '-8px' }
                        : alignCenter
                          ? { left: '50%', transform: 'translateX(-50%)' }
                          : { left: '-8px' }),
                    }}
                  >
                    <span className="mb-1 block font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-accent">
                      {hotspot.label}
                    </span>
                    <p className="font-inter text-[12px] leading-relaxed text-foreground/90">
                      {hotspot.description}
                    </p>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </figure>
  )
}
