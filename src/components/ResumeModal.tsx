'use client'

import { AnimatePresence, m } from 'framer-motion'
import { useEffect } from 'react'
import IconArrowBackUp from './IconArrowBackUp'

interface ResumeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Resume"
          className="fixed inset-0 z-50 bg-background overflow-y-auto"
        >
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="min-h-screen"
          >
            <article className="container mx-auto max-w-[560px] px-4 py-8 min-h-screen">
              <div className="mb-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="group inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.06em] text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                  <IconArrowBackUp size={12} className="shrink-0 opacity-60 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-0.5" aria-hidden />
                  <span className="text-foreground">Home</span>
                  <span aria-hidden className="text-muted-foreground/70">/</span>
                  <span>Resume</span>
                </button>

                <h1 className="font-mono text-lg font-medium tracking-[0.01em] text-foreground sm:text-2xl">Resume</h1>
              </div>

              <div className="mb-12 flex gap-4">
                <a
                  href="/api/resume/file?download=1"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </a>
              </div>

              <div className="relative overflow-hidden rounded-[3px] mb-12">
                <iframe
                  src="/api/resume/file"
                  className="w-full h-screen border-0"
                  title="Hunter Bastian Resume"
                />
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <p className="text-center text-xs text-foreground">
                  Press <kbd className="rounded bg-secondary px-2 py-1 text-xs font-mono text-foreground">Esc</kbd> to close
                </p>
              </div>
            </article>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
