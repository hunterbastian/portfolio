'use client'

import { AnimatePresence, m } from 'framer-motion'
import { useCallback, useEffect } from 'react'
import { useWebHaptics } from 'web-haptics/react'
import { showJoyToast } from '@/lib/joy'
import IconArrowBackUp from './IconArrowBackUp'

interface ResumeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const haptic = useWebHaptics()

  const handleClose = useCallback(() => {
    haptic.trigger('light')
    showJoyToast('Resume closed')
    onClose()
  }, [haptic, onClose])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleClose])

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          role="dialog"
          aria-modal="true"
          aria-label="Resume"
          className="fixed inset-0 z-50 bg-background overflow-y-auto"
        >
          <m.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-screen"
          >
            <article className="container mx-auto max-w-[560px] px-4 py-8 min-h-screen">
              <div className="mb-8">
                <button
                  type="button"
                  onClick={handleClose}
                  className="group mb-6 inline-flex min-h-[40px] origin-center touch-manipulation items-center gap-2 font-mono text-[12px] tracking-[0.06em] text-muted-foreground transition-[color,transform] duration-150 hover:text-foreground active:translate-y-0 active:scale-[0.96]"
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
                  className="inline-flex min-h-[40px] origin-center touch-manipulation items-center gap-2 text-sm font-medium text-primary transition-[color,transform] duration-150 hover:text-primary/80 active:translate-y-0 active:scale-[0.96]"
                  onClick={() => {
                    haptic.trigger('light')
                    showJoyToast('Downloading resume')
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </a>
              </div>

              <div className="relative mb-12 overflow-hidden">
                <iframe
                  src="/api/resume/file"
                  className="w-full h-screen border-0"
                  title="Hunter Bastian Resume"
                />
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <p className="text-center text-xs text-foreground">
                  Press <kbd className="bg-secondary px-2 py-1 text-xs font-mono text-foreground">Esc</kbd> to close
                </p>
              </div>
            </article>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
