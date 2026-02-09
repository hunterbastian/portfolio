'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

interface ResumeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden' // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-white overflow-y-auto"
        >
          {/* Full page content - styled exactly like project pages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="min-h-screen"
          >
            {/* Project page container styling */}
            <article className="container mx-auto max-w-4xl px-4 py-8 min-h-screen">
              {/* Header - matches project page header */}
              <div className="mb-8">
                <button
                  onClick={onClose}
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to portfolio
                </button>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-8">Hunter Bastian // Studio Alpine</h1>
              </div>

              {/* Resume Details - matches project details */}
              <div className="mb-12 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">Document:</span>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                    Resume
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">Format:</span>
                  <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                    PDF
                  </span>
                </div>
              </div>

              {/* Action Links - matches project links */}
              <div className="mb-12 flex gap-4">
                <a
                  href="/resume/Hunter Bastian Resume.pdf"
                  download="Hunter_Bastian_Resume.pdf"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </a>
              </div>

              {/* Resume viewer - full screen like project images */}
              <div className="relative rounded-xl overflow-hidden mb-12">
                <iframe
                  src="/resume/Hunter Bastian Resume.pdf"
                  className="w-full h-screen border-0 rounded-xl"
                  title="Hunter Bastian // Studio Alpine Resume"
                />
                
                {/* Fallback if PDF doesn't load */}
                <div className="hidden w-full h-screen bg-gray-50 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500 mb-4">Resume not found</p>
                    <p className="text-sm text-gray-400">Place your resume.pdf file in the /public/resume/ folder</p>
                  </div>
                </div>
              </div>



              {/* Keyboard shortcut hint */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Esc</kbd> to close
                </p>
              </div>
            </article>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
