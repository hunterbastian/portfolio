'use client'

import { useState, useRef } from 'react'
import { m, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { MOTION_EASE_SOFT, motionDurationMs } from '@/lib/motion'

interface Option {
  label: string
  description: string
}

interface DesignDecisionProps {
  /** The design question being explored */
  question: string
  /** Available options — accepts an array or a JSON string (for MDX compatibility) */
  options: Option[] | string
  /** Index of the chosen option (0-based) */
  chosen: number
}

function parseOptions(input: Option[] | string): Option[] {
  if (Array.isArray(input)) return input
  try {
    return JSON.parse(input) as Option[]
  } catch {
    return []
  }
}

const PANEL_DURATION_MS = 500

export default function DesignDecision({
  question,
  options: optionsInput,
  chosen,
}: DesignDecisionProps) {
  const options = parseOptions(optionsInput)
  const [activeIndex, setActiveIndex] = useState(chosen)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px -60px 0px' })
  const prefersReducedMotion = useReducedMotion() ?? false

  const activeOption = options[activeIndex]

  return (
    <figure ref={ref} className="not-prose my-10">
      <m.div
        className="border border-border bg-card/50 p-5 sm:p-6 shadow-card-subtle"
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{
          duration: motionDurationMs(PANEL_DURATION_MS, prefersReducedMotion),
          ease: MOTION_EASE_SOFT,
        }}
      >
        {/* Question */}
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
          {question}
        </p>

        {/* Option toggles */}
        <div className="mb-4 flex flex-wrap gap-2" role="radiogroup" aria-label={question}>
          {options.map((option, i) => {
            const isActive = i === activeIndex
            const isChosen = i === chosen

            return (
              <button
                key={option.label}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => setActiveIndex(i)}
                className={`relative flex items-center gap-1.5 px-3 py-2 font-mono text-[12px] tracking-[0.04em] transition-[color,background-color,border-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                  isActive
                    ? 'bg-foreground/10 text-foreground border border-foreground/20'
                    : 'bg-transparent text-muted-foreground border border-border hover:text-foreground/70 hover:border-foreground/10'
                }`}
              >
                {option.label}
                {isChosen && (
                  <span
                    className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    title="Chosen direction"
                    aria-label="Chosen direction"
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Description */}
        <AnimatePresence mode="wait">
          <m.div
            key={activeIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{
              duration: motionDurationMs(250, prefersReducedMotion),
              ease: MOTION_EASE_SOFT,
            }}
          >
            <p className="font-inter text-[13px] leading-relaxed text-muted-foreground">
              {activeOption?.description}
            </p>
          </m.div>
        </AnimatePresence>

        {/* Chosen indicator */}
        {activeIndex === chosen && (
          <p className="mt-3 font-mono text-[10px] tracking-[0.1em] uppercase text-accent">
            Chosen direction
          </p>
        )}
      </m.div>
    </figure>
  )
}
