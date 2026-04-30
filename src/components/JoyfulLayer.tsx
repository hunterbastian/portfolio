'use client'

import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useWebHaptics } from 'web-haptics/react'
import ResumeModal from '@/components/ResumeModal'
import { JOY_TOAST_EVENT, showJoyToast, type JoyToastDetail } from '@/lib/joy'
import { MOTION_EASE_SOFT, motionDurationMs } from '@/lib/motion'

const EMAIL_ADDRESS = 'hunterbastianux@gmail.com'

interface JoyToast {
  id: number
  message: string
}

interface LauncherCommand {
  id: string
  label: string
  hint: string
  keys?: string
  run: () => void | Promise<void>
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tagName = target.tagName.toLowerCase()

  return tagName === 'input' || tagName === 'textarea' || target.isContentEditable
}

export default function JoyfulLayer() {
  const router = useRouter()
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion() ?? false
  const haptic = useWebHaptics()
  const [toast, setToast] = useState<JoyToast | null>(null)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [resumeOpen, setResumeOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const toastIdRef = useRef(0)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const commands = useMemo<LauncherCommand[]>(
    () => [
      {
        id: 'projects',
        label: 'Projects',
        hint: 'Jump to selected work',
        keys: 'P',
        run: () => {
          router.push('/#projects')
          showJoyToast('Opening projects')
        },
      },
      {
        id: 'cv',
        label: 'View CV',
        hint: 'Open the resume page',
        keys: 'C',
        run: () => {
          router.push('/cv')
          showJoyToast('Opening CV')
        },
      },
      {
        id: 'contact',
        label: 'Contact',
        hint: 'Jump to social links',
        keys: 'S',
        run: () => {
          router.push('/#contact')
          showJoyToast('Say hi')
        },
      },
      {
        id: 'playground',
        label: 'Playground',
        hint: 'Open experiments',
        keys: 'G',
        run: () => {
          router.push('/archive')
          showJoyToast('Opening playground')
        },
      },
      {
        id: 'resume',
        label: 'Resume',
        hint: 'Open the resume preview',
        keys: 'R',
        run: () => {
          setResumeOpen(true)
          showJoyToast('Resume opened')
        },
      },
      {
        id: 'email',
        label: 'Copy Email',
        hint: EMAIL_ADDRESS,
        keys: 'E',
        run: async () => {
          try {
            await navigator.clipboard.writeText(EMAIL_ADDRESS)
            showJoyToast('Email copied')
          } catch {
            window.location.href = `mailto:${EMAIL_ADDRESS}`
            showJoyToast('Opening email')
          }
        },
      },
    ],
    [router],
  )

  const filteredCommands = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return commands

    return commands.filter((command) => {
      const label = command.label.toLowerCase()
      const hint = command.hint.toLowerCase()
      return label.includes(normalizedQuery) || hint.includes(normalizedQuery)
    })
  }, [commands, query])

  useEffect(() => {
    const handleToast = (event: Event) => {
      const detail = (event as CustomEvent<JoyToastDetail>).detail
      if (!detail?.message) return

      toastIdRef.current += 1
      setToast({ id: toastIdRef.current, message: detail.message })

      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current)
      }

      toastTimerRef.current = setTimeout(() => {
        setToast(null)
      }, 1800)
    }

    window.addEventListener(JOY_TOAST_EVENT, handleToast)

    return () => {
      window.removeEventListener(JOY_TOAST_EVENT, handleToast)
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (isTypingTarget(event.target)) return

      const opensPalette = event.key === '/' || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k')
      if (!opensPalette) return

      event.preventDefault()
      haptic.trigger('light')
      setPaletteOpen(true)
      showJoyToast('Launcher opened')
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [haptic])

  useEffect(() => {
    setPaletteOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!paletteOpen) {
      setQuery('')
      setActiveIndex(0)
      return
    }

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 40)
    return () => window.clearTimeout(focusTimer)
  }, [paletteOpen])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const closePalette = () => {
    haptic.trigger('light')
    setPaletteOpen(false)
  }

  const runCommand = async (command: LauncherCommand) => {
    haptic.trigger('light')
    await command.run()
    setPaletteOpen(false)
  }

  const handlePaletteKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closePalette()
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, filteredCommands.length - 1))
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      const activeCommand = filteredCommands[activeIndex]
      if (activeCommand) {
        void runCommand(activeCommand)
      }
    }
  }

  return (
    <>
      <AnimatePresence initial={false}>
        {paletteOpen ? (
          <m.div
            className="fixed inset-0 z-[70] flex items-start justify-center px-5 pt-[18vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionDurationMs(160, prefersReducedMotion), ease: MOTION_EASE_SOFT }}
          >
            <button
              type="button"
              aria-label="Close launcher"
              className="absolute inset-0 cursor-default bg-background/22 backdrop-blur-[2px]"
              onClick={closePalette}
            />
            <m.div
              role="dialog"
              aria-modal="true"
              aria-label="Tiny launcher"
              className="relative w-full max-w-[22rem] overflow-hidden border border-border/80 bg-background/92 shadow-[0_18px_55px_-32px_rgba(15,23,42,0.42)] backdrop-blur-xl"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: motionDurationMs(220, prefersReducedMotion), ease: MOTION_EASE_SOFT }}
            >
              <div className="border-b border-border/70 px-3.5 py-3">
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={handlePaletteKeyDown}
                  placeholder="Where to?"
                  className="h-9 w-full bg-transparent font-mono text-[0.92rem] text-foreground outline-none placeholder:text-muted-foreground/58"
                  aria-label="Filter launcher commands"
                />
              </div>

              <div className="max-h-[19rem] overflow-y-auto p-1.5">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((command, index) => {
                    const active = index === activeIndex

                    return (
                      <button
                        key={command.id}
                        type="button"
                        className={`flex min-h-[48px] w-full origin-center touch-manipulation items-center justify-between gap-4 px-3 py-2 text-left transition-[background-color,color,transform] duration-150 active:translate-y-0 active:scale-[0.96] ${
                          active ? 'bg-foreground/[0.045]' : 'hover:bg-foreground/[0.035]'
                        }`}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => void runCommand(command)}
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-header text-[0.9rem] tracking-[-0.02em] text-foreground">
                            {command.label}
                          </span>
                          <span className="block truncate font-mono text-[0.72rem] text-muted-foreground">
                            {command.hint}
                          </span>
                        </span>
                        {command.keys ? (
                          <span className="shrink-0 font-mono text-[0.62rem] text-muted-foreground/65">
                            {command.keys}
                          </span>
                        ) : null}
                      </button>
                    )
                  })
                ) : (
                  <p className="px-3 py-5 text-center font-mono text-[0.78rem] text-muted-foreground">
                    Nothing here yet.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-border/60 px-3.5 py-2 font-mono text-[0.62rem] text-muted-foreground/72">
                <span>/ or cmd k</span>
                <span>enter to open</span>
              </div>
            </m.div>
          </m.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {toast ? (
          <m.div
            key={toast.id}
            role="status"
            aria-live="polite"
            className="fixed inset-x-0 bottom-5 z-[80] flex justify-center px-5"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: motionDurationMs(180, prefersReducedMotion), ease: MOTION_EASE_SOFT }}
          >
            <div className="border border-border/80 bg-background/92 px-3.5 py-2 font-mono text-[0.74rem] text-foreground shadow-[0_14px_40px_-30px_rgba(15,23,42,0.5)] backdrop-blur-xl">
              {toast.message}
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>

      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </>
  )
}
