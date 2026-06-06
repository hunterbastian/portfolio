'use client'

import { useState, useRef } from 'react'
import { m, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import {
  DESIGN_DECISION_DESCRIPTION_DURATION_MS,
  DESIGN_DECISION_DESCRIPTION_EXIT_STATE,
  DESIGN_DECISION_DESCRIPTION_INITIAL_STATE,
  DESIGN_DECISION_DESCRIPTION_VISIBLE_STATE,
  DESIGN_DECISION_PANEL_DURATION_MS,
  getDesignDecisionOptionButtonClassName,
  getDesignDecisionPanelAnimationState,
  parseDesignDecisionOptions,
  shouldShowDesignDecisionChosenIndicator,
} from '@/lib/design-decision'
import { MOTION_EASE_SOFT, motionDurationMs } from '@/lib/motion'
import type { DesignDecisionOption } from '@/lib/design-decision'

interface DesignDecisionProps {
  /** The design question being explored */
  question: string
  /** Available options — accepts an array or a JSON string (for MDX compatibility) */
  options: DesignDecisionOption[] | string
  /** Index of the chosen option (0-based) */
  chosen: number
}

export default function DesignDecision({
  question,
  options: optionsInput,
  chosen,
}: DesignDecisionProps) {
  const options = parseDesignDecisionOptions(optionsInput)
  const [activeIndex, setActiveIndex] = useState(chosen)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px -60px 0px' })
  const prefersReducedMotion = useReducedMotion() ?? false

  const activeOption = options[activeIndex]

  return (
    <figure ref={ref} className="not-prose my-10">
      <m.div
        className="border border-border bg-card/50 p-5 sm:p-6 shadow-card-subtle"
        initial={getDesignDecisionPanelAnimationState(false)}
        animate={getDesignDecisionPanelAnimationState(isInView)}
        transition={{
          duration: motionDurationMs(DESIGN_DECISION_PANEL_DURATION_MS, prefersReducedMotion),
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
                className={getDesignDecisionOptionButtonClassName(isActive)}
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
            initial={DESIGN_DECISION_DESCRIPTION_INITIAL_STATE}
            animate={DESIGN_DECISION_DESCRIPTION_VISIBLE_STATE}
            exit={DESIGN_DECISION_DESCRIPTION_EXIT_STATE}
            transition={{
              duration: motionDurationMs(DESIGN_DECISION_DESCRIPTION_DURATION_MS, prefersReducedMotion),
              ease: MOTION_EASE_SOFT,
            }}
          >
            <p className="font-inter text-[13px] leading-relaxed text-muted-foreground">
              {activeOption?.description}
            </p>
          </m.div>
        </AnimatePresence>

        {/* Chosen indicator */}
        {shouldShowDesignDecisionChosenIndicator(activeIndex, chosen) && (
          <p className="mt-3 font-mono text-[10px] tracking-[0.1em] uppercase text-accent">
            Chosen direction
          </p>
        )}
      </m.div>
    </figure>
  )
}
