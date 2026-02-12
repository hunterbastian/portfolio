'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface CollapsibleSectionProps {
  id: string
  title: string
  isOpen: boolean
  onToggle: () => void
  children: ReactNode
  className?: string
  contentClassName?: string
}

const CONTENT_EASE = [0.22, 1, 0.36, 1] as const

export default function CollapsibleSection({
  id,
  title,
  isOpen,
  onToggle,
  children,
  className,
  contentClassName,
}: CollapsibleSectionProps) {
  const prefersReducedMotion = useReducedMotion()
  const contentId = `${id}-content`
  const contentDuration = prefersReducedMotion ? 0.01 : 0.3
  const iconDuration = prefersReducedMotion ? 0.01 : 0.24
  const contentClasses = ['overflow-hidden', contentClassName].filter(Boolean).join(' ')

  return (
    <section id={id} className={className}>
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
        <h2 className="section-heading font-code text-sm">{title}</h2>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={contentId}
          aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${title}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-300 hover:text-foreground hover:border-primary/45 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <motion.span
            initial={false}
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: iconDuration, ease: CONTENT_EASE }}
            className="flex items-center justify-center"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </motion.span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: contentDuration, ease: CONTENT_EASE },
              opacity: { duration: contentDuration * 0.82, ease: CONTENT_EASE },
            }}
            className={contentClasses}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
