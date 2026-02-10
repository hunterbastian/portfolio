'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FormEvent, useEffect, useState } from 'react'

interface ResumeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [password, setPassword] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isConfigured, setIsConfigured] = useState(true)
  const [isCheckingAccess, setIsCheckingAccess] = useState(false)
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false)
  const [accessError, setAccessError] = useState('')

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

  useEffect(() => {
    if (!isOpen) {
      setPassword('')
      setAccessError('')
      setIsSubmittingPassword(false)
      return
    }

    let isMounted = true
    const checkAccess = async () => {
      setIsCheckingAccess(true)
      setAccessError('')
      try {
        const response = await fetch('/api/resume/status', {
          method: 'GET',
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error('Unable to verify resume access.')
        }

        const data = (await response.json()) as {
          configured?: boolean
          unlocked?: boolean
        }

        if (!isMounted) {
          return
        }

        setIsConfigured(Boolean(data.configured))
        setIsUnlocked(Boolean(data.unlocked))

        if (!data.configured) {
          setAccessError('Resume access is not configured yet.')
        }
      } catch {
        if (!isMounted) {
          return
        }
        setIsUnlocked(false)
        setAccessError('Could not verify resume access. Try again in a moment.')
      } finally {
        if (isMounted) {
          setIsCheckingAccess(false)
        }
      }
    }

    checkAccess()

    return () => {
      isMounted = false
    }
  }, [isOpen])

  const handleUnlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedPassword = password.trim()
    if (!trimmedPassword) {
      setAccessError('Enter the resume password.')
      return
    }

    setIsSubmittingPassword(true)
    setAccessError('')

    try {
      const response = await fetch('/api/resume/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: trimmedPassword }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        setAccessError(payload?.error ?? 'Incorrect password.')
        return
      }

      setIsUnlocked(true)
      setPassword('')
    } catch {
      setAccessError('Unable to unlock resume right now. Please try again.')
    } finally {
      setIsSubmittingPassword(false)
    }
  }

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
                
                <h1 className="text-[2.08rem] md:text-[2.83rem] font-bold mb-8">Hunter Bastian // Studio Alpine</h1>
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

              {isCheckingAccess ? (
                <div className="mb-12 rounded-xl border border-border bg-card p-6">
                  <p className="text-sm text-muted-foreground">Checking resume access...</p>
                </div>
              ) : isUnlocked ? (
                <>
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

                  <div className="relative rounded-xl overflow-hidden mb-12">
                    <iframe
                      src="/api/resume/file"
                      className="w-full h-screen border-0 rounded-xl"
                      title="Hunter Bastian // Studio Alpine Resume"
                    />
                  </div>
                </>
              ) : (
                <div className="mb-12 rounded-xl border border-border bg-card p-6 sm:p-8">
                  <h2 className="text-2xl font-semibold font-garamond-narrow mb-3">Resume Access</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Enter the password to view or download the resume.
                  </p>
                  <form className="max-w-sm space-y-4" onSubmit={handleUnlock}>
                    <label htmlFor="resume-password" className="block text-xs font-code tracking-[0.08em] uppercase text-muted-foreground">
                      Password
                    </label>
                    <input
                      id="resume-password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      disabled={!isConfigured || isSubmittingPassword}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      autoComplete="current-password"
                    />
                    {accessError && (
                      <p className="text-sm text-red-600">{accessError}</p>
                    )}
                    <button
                      type="submit"
                      disabled={!isConfigured || isSubmittingPassword}
                      className="nord-button rounded-md px-4 py-2 text-xs font-code tracking-[0.08em] uppercase disabled:opacity-50"
                    >
                      {isSubmittingPassword ? 'Unlocking...' : 'Unlock Resume'}
                    </button>
                  </form>
                </div>
              )}

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
