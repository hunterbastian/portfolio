'use client'

import { AnimatePresence, m } from 'framer-motion'
import { useCallback, useEffect } from 'react'
import { useWebHaptics } from 'web-haptics/react'
import { showJoyToast } from '@/lib/joy'
import { analytics } from '@/lib/analytics'
import {
  RESUME_MODAL_CONTENT_MOTION,
  RESUME_MODAL_CONTENT_TRANSITION,
  RESUME_MODAL_COPY,
  RESUME_MODAL_DOWNLOAD_HREF,
  RESUME_MODAL_FILE_HREF,
  RESUME_MODAL_META_ITEMS,
  RESUME_MODAL_OVERLAY_MOTION,
  RESUME_MODAL_OVERLAY_TRANSITION,
  activateResumeModalClose,
  activateResumeModalDownload,
  activateResumeModalView,
  isResumeModalCloseKey,
} from '@/lib/resume-modal'
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock'
import IconArrowBackUp from './IconArrowBackUp'

interface ResumeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const haptic = useWebHaptics()

  const handleClose = useCallback(() => {
    activateResumeModalClose({
      closeModal: onClose,
      showToast: showJoyToast,
      triggerHaptic: (style) => haptic.trigger(style),
    })
  }, [haptic, onClose])

  useEffect(() => {
    activateResumeModalView({
      isOpen,
      trackResumeAction: (action) => analytics.resumeAction(action),
    })
  }, [isOpen])

  useBodyScrollLock(isOpen)

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (isResumeModalCloseKey(e.key)) handleClose()
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, handleClose])

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <m.div
          initial={RESUME_MODAL_OVERLAY_MOTION.initial}
          animate={RESUME_MODAL_OVERLAY_MOTION.animate}
          exit={RESUME_MODAL_OVERLAY_MOTION.exit}
          transition={RESUME_MODAL_OVERLAY_TRANSITION}
          role="dialog"
          aria-modal="true"
          aria-label={RESUME_MODAL_COPY.dialogLabel}
          className="fixed inset-0 z-50 bg-background overflow-y-auto"
        >
          <m.div
            initial={RESUME_MODAL_CONTENT_MOTION.initial}
            animate={RESUME_MODAL_CONTENT_MOTION.animate}
            exit={RESUME_MODAL_CONTENT_MOTION.exit}
            transition={RESUME_MODAL_CONTENT_TRANSITION}
            className="min-h-screen"
          >
            <article className="container mx-auto max-w-[560px] px-4 py-8 min-h-screen">
              <div className="mb-8">
                <button
                  type="button"
                  onClick={handleClose}
                  className="group mb-6 inline-flex min-h-[40px] origin-center touch-manipulation items-center gap-2 font-mono text-[12px] tracking-[0.06em] text-muted-foreground transition-[color,transform] duration-150 hover:text-foreground active:translate-y-0 active:scale-[0.96]"
                >
                  <IconArrowBackUp size={11} className="shrink-0 opacity-60 transition-transform duration-200 ease-soft group-hover:-translate-x-0.5" aria-hidden />
                  <span className="text-foreground">{RESUME_MODAL_COPY.breadcrumbParent}</span>
                  <span aria-hidden className="text-muted-foreground/70">/</span>
                  <span>{RESUME_MODAL_COPY.breadcrumbCurrent}</span>
                </button>

                <h1 className="font-mono text-lg font-medium tracking-[0.01em] text-foreground sm:text-2xl">{RESUME_MODAL_COPY.title}</h1>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-2 font-mono sm:grid-cols-4">
                {RESUME_MODAL_META_ITEMS.map(({ label, value }) => (
                  <div key={label} className="min-h-[48px] border border-border/65 bg-background/55 px-2.5 py-2">
                    <span className="flex items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.1em] text-muted-foreground/62">
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#ff4b00]/55" />
                      {label}
                    </span>
                    <span className="mt-1 block text-[0.72rem] leading-tight text-foreground/82">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mb-12 flex gap-4">
                <a
                  href={RESUME_MODAL_DOWNLOAD_HREF}
                  className="inline-flex min-h-[40px] origin-center touch-manipulation items-center gap-2 text-sm font-medium text-primary transition-[color,transform] duration-150 hover:text-primary/80 active:translate-y-0 active:scale-[0.96]"
                  onClick={() => {
                    activateResumeModalDownload({
                      showToast: showJoyToast,
                      trackResumeAction: (action) => analytics.resumeAction(action),
                      triggerHaptic: (style) => haptic.trigger(style),
                    })
                  }}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {RESUME_MODAL_COPY.downloadLabel}
                </a>
              </div>

              <div className="relative mb-12 overflow-hidden">
                <iframe
                  src={RESUME_MODAL_FILE_HREF}
                  className="w-full h-screen border-0"
                  title={RESUME_MODAL_COPY.iframeTitle}
                />
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <p className="text-center text-xs text-foreground">
                  {RESUME_MODAL_COPY.keyboardHintPrefix}{' '}
                  <kbd className="bg-secondary px-2 py-1 text-xs font-mono text-foreground">
                    {RESUME_MODAL_COPY.keyboardShortcut}
                  </kbd>{' '}
                  {RESUME_MODAL_COPY.keyboardHintSuffix}
                </p>
              </div>
            </article>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
