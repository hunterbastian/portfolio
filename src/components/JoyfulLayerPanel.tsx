'use client'

import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { Search } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import type { ComponentType, SVGProps } from 'react'
import { useWebHaptics } from 'web-haptics/react'
import ResumeModal from '@/components/ResumeModal'
import { Archive, Contact, Work, Writing } from '@/components/pixel/glyphs'
import { JOY_TOAST_EVENT, showJoyToast, type JoyToastDetail } from '@/lib/joy'
import { MOTION_EASE_SOFT, motionDurationMs } from '@/lib/motion'
import { analytics } from '@/lib/analytics'

const EMAIL_ADDRESS = 'hunterbastianux@gmail.com'
const PROJECT_INQUIRY_SUBJECT = 'Project Inquiry'
const LAUNCHER_OPEN_EVENT = 'hb-open-launcher'
const RECENT_COMMANDS_STORAGE_KEY = 'hb-launcher-recent-command-ids'

type LauncherSectionId = 'navigate' | 'work' | 'projects' | 'contact'

const LAUNCHER_SECTION_ORDER: LauncherSectionId[] = ['navigate', 'work', 'projects', 'contact']
const LAUNCHER_SECTION_LABELS: Record<LauncherSectionId, string> = {
  navigate: 'Navigate',
  work: 'Work',
  projects: 'Projects',
  contact: 'Contact',
}
const SUGGESTED_FALLBACK_COMMAND_IDS = ['home', 'projects', 'contact']

interface JoyToast {
  id: number
  message: string
}

interface EmptySpaceRipple {
  id: number
  x: number
  y: number
}

interface LauncherCommand {
  id: string
  label: string
  hint: string
  icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>
  section: LauncherSectionId
  priority?: number
  keys?: string
  kind?: string
  keywords?: string[]
  run: () => void | Promise<void>
}

interface LauncherCommandSection {
  id: LauncherSectionId | 'suggested'
  label: string
  commands: LauncherCommand[]
}

export interface LauncherProject {
  slug: string
  title: string
  description: string
  category: string
  tags: string[]
  date: string
}

interface JoyfulLayerPanelProps {
  projects?: LauncherProject[]
  openSignal?: number
}

type WorkFilter = 'all' | 'product' | 'visual' | 'web'

const WORK_FILTERS: Array<{
  id: WorkFilter
  label: string
  hint: string
  toast: string
  keywords: string[]
}> = [
  {
    id: 'product',
    label: 'Product work',
    hint: 'Filter projects to UX, app, and interface work',
    toast: 'Filtering product work',
    keywords: ['ux', 'ui', 'app', 'mobile', 'interface', 'case study', 'hiring'],
  },
  {
    id: 'visual',
    label: 'Visual work',
    hint: 'Filter projects to graphic and image-led work',
    toast: 'Filtering visual work',
    keywords: ['visual', 'graphic', 'photography', 'studio alpine', 'brand', 'identity'],
  },
  {
    id: 'web',
    label: 'Web work',
    hint: 'Filter projects to websites and interactive pages',
    toast: 'Filtering web work',
    keywords: ['web', 'website', 'next', 'interactive', 'frontend'],
  },
  {
    id: 'all',
    label: 'All work',
    hint: 'Clear project filters',
    toast: 'Showing all work',
    keywords: ['clear', 'reset', 'all', 'everything'],
  },
]

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tagName = target.tagName.toLowerCase()

  return tagName === 'input' || tagName === 'textarea' || target.isContentEditable
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false

  return Boolean(
    target.closest(
      'a, button, input, textarea, select, summary, [role="button"], [role="link"], [role="dialog"], [data-ignore-empty-ripple]',
    ),
  )
}

function commandMatchesQuery(command: LauncherCommand, query: string) {
  const searchable = [
    command.label,
    command.hint,
    command.kind,
    command.keys,
    ...(command.keywords ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return searchable.includes(query)
}

export default function JoyfulLayerPanel({ projects = [], openSignal = 0 }: JoyfulLayerPanelProps) {
  const router = useRouter()
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion() ?? false
  const haptic = useWebHaptics()
  const [toast, setToast] = useState<JoyToast | null>(null)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [resumeOpen, setResumeOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [recentCommandIds, setRecentCommandIds] = useState<string[]>([])
  const [ripples, setRipples] = useState<EmptySpaceRipple[]>([])
  const toastIdRef = useRef(0)
  const rippleIdRef = useRef(0)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const commandButtonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const currentPageLabel = useMemo(() => {
    if (pathname.startsWith('/projects/')) return 'Project Space'
    if (pathname.startsWith('/archive')) return 'Playground Space'
    if (pathname.startsWith('/cv')) return 'Resume Space'
    if (pathname.startsWith('/about')) return 'About Space'

    return 'Home Space'
  }, [pathname])

  const openWorkFilter = useCallback(
    (filter: WorkFilter, toastMessage: string) => {
      const target = filter === 'all' ? '/#projects' : `/?work=${filter}#projects`
      router.push(target)
      window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent('hb-work-filter', { detail: { filter } }))
      }, 80)
      showJoyToast(toastMessage)
    },
    [router],
  )

  const commands = useMemo<LauncherCommand[]>(
    () => {
      const coreCommands: LauncherCommand[] = [
      {
        id: 'home',
        label: 'Home',
        hint: 'Return to the main page',
        icon: Work,
        section: 'navigate',
        priority: 10,
        keys: 'H',
        kind: 'Navigate',
        keywords: ['start', 'main', 'index', 'landing'],
        run: () => {
          router.push('/')
          showJoyToast('Opening home')
        },
      },
      {
        id: 'projects',
        label: 'Projects',
        hint: 'Jump to selected work',
        icon: Work,
        section: 'navigate',
        priority: 20,
        keys: 'P',
        kind: 'Navigate',
        keywords: ['work', 'case studies', 'portfolio', 'selected'],
        run: () => {
          router.push('/#projects')
          showJoyToast('Opening projects')
        },
      },
      {
        id: 'cv',
        label: 'View Resume',
        hint: 'Open the resume page',
        icon: Writing,
        section: 'navigate',
        priority: 30,
        keys: 'C',
        kind: 'Navigate',
        keywords: ['cv', 'resume', 'pdf', 'experience'],
        run: () => {
          router.push('/cv')
          showJoyToast('Opening resume')
        },
      },
      {
        id: 'contact',
        label: 'Contact',
        hint: 'Jump to social links',
        icon: Contact,
        section: 'navigate',
        priority: 40,
        keys: 'S',
        kind: 'Contact',
        keywords: ['email', 'social', 'hire', 'freelance'],
        run: () => {
          router.push('/#contact')
          showJoyToast('Say hi')
        },
      },
      {
        id: 'playground',
        label: 'Playground',
        hint: 'Open experiments',
        icon: Archive,
        section: 'navigate',
        priority: 50,
        keys: 'G',
        kind: 'Navigate',
        keywords: ['archive', 'experiments', 'prototypes', 'play'],
        run: () => {
          router.push('/archive')
          showJoyToast('Opening playground')
        },
      },
      {
        id: 'resume',
        label: 'Resume',
        hint: 'Open the resume preview',
        icon: Writing,
        section: 'contact',
        priority: 10,
        keys: 'R',
        kind: 'Control',
        keywords: ['pdf', 'download', 'work history', 'experience'],
        run: () => {
          setResumeOpen(true)
          showJoyToast('Resume opened')
        },
      },
      {
        id: 'email',
        label: 'Copy Email',
        hint: EMAIL_ADDRESS,
        icon: Contact,
        section: 'contact',
        priority: 20,
        keys: 'E',
        kind: 'Contact',
        keywords: ['copy', 'mail', 'contact', 'hire'],
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
      {
        id: 'copy-page-link',
        label: 'Copy Page Link',
        hint: 'Copy the current portfolio URL',
        icon: Archive,
        section: 'contact',
        priority: 30,
        keys: 'L',
        kind: 'Tool',
        keywords: ['copy', 'url', 'link', 'current page', 'share', 'arc command'],
        run: async () => {
          try {
            await navigator.clipboard.writeText(window.location.href)
            showJoyToast('Page link copied')
          } catch {
            showJoyToast('Could not copy link')
          }
        },
      },
      {
        id: 'draft-project-email',
        label: 'Draft Project Email',
        hint: 'Open a focused project inquiry email',
        icon: Contact,
        section: 'contact',
        priority: 40,
        kind: 'Skill',
        keywords: ['email', 'inquiry', 'project', 'hire', 'dia skill', 'compose'],
        run: () => {
          window.location.href = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(PROJECT_INQUIRY_SUBJECT)}`
          showJoyToast('Opening project email')
        },
      },
    ]

      const filterCommands: LauncherCommand[] = WORK_FILTERS.map((filter, index) => ({
        id: `filter-${filter.id}`,
        label: filter.label,
        hint: filter.hint,
        icon: Work,
        section: 'work',
        priority: index,
        kind: 'Filter',
        keywords: filter.keywords,
        run: () => openWorkFilter(filter.id, filter.toast),
      }))

      const projectCommands: LauncherCommand[] = projects.map((project, index) => ({
        id: `project-${project.slug}`,
        label: project.title,
        hint: `${project.category} · ${project.tags.slice(0, 3).join(', ')}`,
        icon: Work,
        section: 'projects',
        priority: index,
        kind: 'Project',
        keywords: [
          project.slug,
          project.category,
          project.description,
          new Date(project.date).getFullYear().toString(),
          ...project.tags,
        ],
        run: () => {
          router.push(`/projects/${project.slug}`)
          showJoyToast('Opening project')
        },
      }))

      return [...coreCommands, ...filterCommands, ...projectCommands]
    },
    [openWorkFilter, projects, router],
  )

  const matchingCommands = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return normalizedQuery
      ? commands.filter((command) => commandMatchesQuery(command, normalizedQuery))
      : commands
  }, [commands, query])

  const commandSections = useMemo<LauncherCommandSection[]>(() => {
    const commandById = new Map(commands.map((command) => [command.id, command]))
    const normalizedQuery = query.trim().toLowerCase()
    const sections: LauncherCommandSection[] = []

    if (!normalizedQuery) {
      const recentCommands = recentCommandIds
        .map((id) => commandById.get(id))
        .filter((command): command is LauncherCommand => Boolean(command))
      const suggestedCommands = recentCommands.length > 0
        ? recentCommands
        : SUGGESTED_FALLBACK_COMMAND_IDS
          .map((id) => commandById.get(id))
          .filter((command): command is LauncherCommand => Boolean(command))

      if (suggestedCommands.length > 0) {
        sections.push({
          id: 'suggested',
          label: 'Suggested',
          commands: suggestedCommands,
        })
      }
    }

    for (const sectionId of LAUNCHER_SECTION_ORDER) {
      const sectionCommands = matchingCommands
        .filter((command) => command.section === sectionId)
        .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))

      if (sectionCommands.length > 0) {
        sections.push({
          id: sectionId,
          label: LAUNCHER_SECTION_LABELS[sectionId],
          commands: sectionCommands,
        })
      }
    }

    return sections
  }, [commands, matchingCommands, query, recentCommandIds])

  const visibleCommandEntries = useMemo(
    () => commandSections.flatMap((section) => section.commands.map((command) => ({ sectionId: section.id, command }))),
    [commandSections],
  )

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(RECENT_COMMANDS_STORAGE_KEY)
      if (!stored) return

      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        setRecentCommandIds(parsed.filter((id): id is string => typeof id === 'string').slice(0, 3))
      }
    } catch {
      // localStorage unavailable or stale value
    }
  }, [])

  const rememberCommand = useCallback((commandId: string) => {
    setRecentCommandIds((current) => {
      const next = [commandId, ...current.filter((id) => id !== commandId)].slice(0, 3)

      try {
        window.localStorage.setItem(RECENT_COMMANDS_STORAGE_KEY, JSON.stringify(next))
      } catch {
        // localStorage unavailable
      }

      return next
    })
  }, [])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (prefersReducedMotion || paletteOpen || isInteractiveTarget(event.target)) return

      rippleIdRef.current += 1
      const ripple: EmptySpaceRipple = {
        id: rippleIdRef.current,
        x: event.clientX,
        y: event.clientY,
      }

      setRipples((current) => [...current.slice(-5), ripple])

      window.setTimeout(() => {
        setRipples((current) => current.filter((item) => item.id !== ripple.id))
      }, 760)
    }

    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [paletteOpen, prefersReducedMotion])

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
    const handleOpenLauncher = () => {
      haptic.trigger('light')
      setPaletteOpen(true)
    }

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      const isLauncherShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k'

      if (isLauncherShortcut) {
        event.preventDefault()
        haptic.trigger('light')
        setPaletteOpen((open) => !open)
        return
      }

      if (isTypingTarget(event.target)) return

      const opensPalette = event.key === '/'
      if (!opensPalette) return

      event.preventDefault()
      haptic.trigger('light')
      setPaletteOpen(true)
    }

    window.addEventListener(LAUNCHER_OPEN_EVENT, handleOpenLauncher)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener(LAUNCHER_OPEN_EVENT, handleOpenLauncher)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [haptic])

  useEffect(() => {
    setPaletteOpen(false)
  }, [pathname])

  useEffect(() => {
    if (openSignal <= 0) return

    setPaletteOpen(true)
    setQuery('')
    setActiveIndex(0)
    showJoyToast('Launchpad opened')
  }, [openSignal])

  useEffect(() => {
    if (!paletteOpen) {
      setQuery('')
      setActiveIndex(0)
      return
    }

    let firstFrame = 0
    let secondFrame = 0

    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        inputRef.current?.focus({ preventScroll: true })
      })
    })

    return () => {
      window.cancelAnimationFrame(firstFrame)
      window.cancelAnimationFrame(secondFrame)
    }
  }, [paletteOpen])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    setActiveIndex((index) => Math.min(index, Math.max(visibleCommandEntries.length - 1, 0)))
    commandButtonRefs.current.length = visibleCommandEntries.length
  }, [visibleCommandEntries.length])

  useEffect(() => {
    if (!paletteOpen) return

    commandButtonRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, paletteOpen])

  const closePalette = () => {
    haptic.trigger('light')
    setPaletteOpen(false)
  }

  const trackCommand = (command: LauncherCommand) => {
    if (command.id.startsWith('project-')) {
      analytics.projectClick(command.id.replace(/^project-/, ''), command.label)
      return
    }

    if (command.id === 'resume') {
      analytics.navigationClick('launchpad_resume')
      return
    }

    if (command.id === 'email' || command.id === 'draft-project-email') {
      analytics.externalLink(`mailto:${EMAIL_ADDRESS}`, 'email')
      return
    }

    analytics.navigationClick(`launchpad_${command.id}`)
  }

  const runCommand = async (command: LauncherCommand) => {
    haptic.trigger('light')
    rememberCommand(command.id)
    trackCommand(command)
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
      if (visibleCommandEntries.length === 0) return
      setActiveIndex((index) => Math.min(index + 1, visibleCommandEntries.length - 1))
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (visibleCommandEntries.length === 0) return
      setActiveIndex((index) => Math.max(index - 1, 0))
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      const activeCommand = visibleCommandEntries[activeIndex]?.command
      if (activeCommand) {
        void runCommand(activeCommand)
      }
    }
  }

  let renderedCommandIndex = 0

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[35] overflow-hidden">
        <AnimatePresence initial={false}>
          {ripples.map((ripple) => (
            <m.span
              key={ripple.id}
              className="absolute h-28 w-28 rounded-full border border-[#ff4b00]/10 bg-[#ff4b00]/[0.025] shadow-[0_0_36px_rgba(255,75,0,0.05)]"
              style={{
                left: ripple.x,
                top: ripple.y,
                translateX: '-50%',
                translateY: '-50%',
              }}
              initial={{ opacity: 0, scale: 0.2, filter: 'blur(2px)' }}
              animate={{ opacity: [0, 0.26, 0], scale: [0.2, 0.74, 1.25], filter: ['blur(3px)', 'blur(1px)', 'blur(8px)'] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.72, ease: MOTION_EASE_SOFT }}
            />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {paletteOpen ? (
          <m.div
            className="fixed inset-0 z-[2147483000] flex items-end justify-center overflow-hidden px-3 pt-16 sm:items-start sm:px-5 sm:pt-[16vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionDurationMs(120, prefersReducedMotion), ease: MOTION_EASE_SOFT }}
          >
            <m.button
              type="button"
              aria-label="Close Launchpad"
              className="absolute inset-0 cursor-default"
              onClick={closePalette}
              style={{
                backgroundColor: 'color-mix(in srgb, var(--background) 34%, transparent)',
              }}
              initial={{
                opacity: 0,
                backdropFilter: 'blur(0px) saturate(1)',
                WebkitBackdropFilter: 'blur(0px) saturate(1)',
              }}
              animate={{
                opacity: 1,
                backdropFilter: prefersReducedMotion ? 'blur(0px) saturate(1)' : 'blur(10px) saturate(1.04)',
                WebkitBackdropFilter: prefersReducedMotion ? 'blur(0px) saturate(1)' : 'blur(10px) saturate(1.04)',
              }}
              exit={{
                opacity: 0,
                backdropFilter: 'blur(0px) saturate(1)',
                WebkitBackdropFilter: 'blur(0px) saturate(1)',
              }}
              transition={{ duration: motionDurationMs(150, prefersReducedMotion), ease: MOTION_EASE_SOFT }}
            />
            <m.div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-1/2 h-[16rem] w-[34rem] max-w-[104vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,75,0,0.1)_0%,color-mix(in_srgb,var(--background)_34%,transparent)_46%,transparent_74%)] blur-3xl sm:bottom-auto sm:top-[15vh] sm:w-[38rem] sm:max-w-[92vw]"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: prefersReducedMotion ? 0.12 : 0.3, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: motionDurationMs(160, prefersReducedMotion), ease: MOTION_EASE_SOFT }}
            />
            <m.div
              role="dialog"
              aria-modal="true"
              aria-label="Portfolio Launchpad"
              className="relative flex max-h-[78dvh] w-full max-w-[30rem] flex-col overflow-hidden rounded-t-[10px] border border-foreground/[0.08] border-b-0 bg-background/[0.88] pb-[env(safe-area-inset-bottom)] shadow-[inset_0_1px_0_rgba(255,255,255,0.78),inset_0_0_0_1px_rgba(255,255,255,0.34),0_26px_80px_-48px_rgba(43,39,34,0.72),0_1px_3px_rgba(43,39,34,0.08)] backdrop-blur-2xl sm:max-h-[min(34rem,72vh)] sm:rounded-[8px] sm:border-b sm:pb-0"
              style={{
                background:
                  'linear-gradient(180deg, color-mix(in srgb, var(--background) 94%, #fff9f0) 0%, color-mix(in srgb, var(--background) 88%, #f7ead8) 100%)',
              }}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18, scale: 0.992 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 14, scale: 0.992 }}
              transition={{ duration: motionDurationMs(130, prefersReducedMotion), ease: MOTION_EASE_SOFT }}
            >
              <div className="sticky top-0 z-10 border-b border-border/58 bg-background/60 p-2 backdrop-blur-xl">
                <div className="relative">
                  <Search
                    aria-hidden="true"
                    size={13}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/48"
                  />
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-[5px] border border-border/55 bg-background/65 px-1.5 py-1 font-mono text-[0.56rem] leading-none text-muted-foreground/58">
                    ⌘K
                  </span>
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={handlePaletteKeyDown}
                    placeholder="Search or open..."
                    className="h-11 w-full rounded-[6px] border border-transparent bg-foreground/[0.035] pl-8 pr-16 font-mono text-[0.92rem] text-foreground outline-none placeholder:text-muted-foreground/52 transition-[background-color,border-color,box-shadow] duration-150 focus:border-foreground/[0.08] focus:bg-background/52 focus:shadow-[inset_0_1px_0_rgba(255,255,255,0.62)]"
                    aria-label="Search Launchpad commands"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 px-1 font-mono text-[0.58rem] uppercase tracking-[0.1em] text-muted-foreground/56">
                  <span className="truncate">{currentPageLabel}</span>
                  <span className="shrink-0">{visibleCommandEntries.length} commands</span>
                </div>
                <div className="mt-2 flex gap-1 overflow-x-auto px-0.5 pb-0.5 [scrollbar-width:none]">
                  {commandSections.map((section) => (
                    <span
                      key={`chip-${section.id}`}
                      className="shrink-0 rounded-[5px] border border-border/52 bg-background/52 px-2 py-1 font-mono text-[0.58rem] leading-none text-muted-foreground/66"
                    >
                      {section.label}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className="min-h-0 flex-1 overflow-y-auto px-1.5 py-2 sm:max-h-[26rem]"
                role="listbox"
                aria-label="Launchpad commands"
              >
                {visibleCommandEntries.length > 0 ? (
                  <div className="space-y-2.5">
                    {commandSections.map((section) => (
                      <section key={section.id} aria-label={section.label} className="space-y-1">
                        <div className="px-2 pt-1 font-mono text-[0.56rem] uppercase leading-none tracking-[0.12em] text-muted-foreground/46">
                          {section.label}
                        </div>
                        <div className="space-y-0.5">
                          {section.commands.map((command) => {
                            const rowIndex = renderedCommandIndex
                            renderedCommandIndex += 1
                            const active = rowIndex === activeIndex
                            const Icon = command.icon

                            return (
                              <button
                                key={`${section.id}-${command.id}`}
                                ref={(element) => {
                                  commandButtonRefs.current[rowIndex] = element
                                }}
                                type="button"
                                role="option"
                                aria-selected={active}
                                className={`flex min-h-[46px] w-full origin-center touch-manipulation items-center justify-between gap-3 rounded-[6px] border px-2.5 py-2 text-left transition-[background-color,border-color,box-shadow,color,transform] duration-150 active:translate-y-0 active:scale-[0.97] ${
                                  active
                                    ? 'border-[#d8cfc2]/80 bg-[#fffaf4]/82 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_10px_24px_-22px_rgba(43,39,34,0.54)] dark:border-foreground/[0.14] dark:bg-foreground/[0.08]'
                                    : 'border-transparent text-foreground hover:bg-foreground/[0.035]'
                                }`}
                                onMouseEnter={() => setActiveIndex(rowIndex)}
                                onClick={() => void runCommand(command)}
                              >
                                <span className="flex min-w-0 items-center gap-2.5">
                                  <span
                                    aria-hidden="true"
                                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[5px] border text-muted-foreground transition-[color,background-color,border-color,box-shadow] duration-150 ${
                                      active
                                        ? 'border-[#d3c6b8]/90 bg-background/82 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] dark:border-foreground/[0.16] dark:bg-background/62'
                                        : 'border-border/56 bg-background/50'
                                    }`}
                                  >
                                    <Icon size={11} />
                                  </span>
                                  <span className="min-w-0">
                                    <span className="block truncate font-header text-[0.9rem] tracking-[-0.02em] text-foreground">
                                      {command.label}
                                    </span>
                                    <span className="block truncate font-mono text-[0.71rem] text-muted-foreground">
                                      {command.hint}
                                    </span>
                                  </span>
                                </span>
                                <span className="shrink-0 rounded-[5px] border border-border/50 bg-background/58 px-1.5 py-1 font-mono text-[0.56rem] leading-none text-muted-foreground/60">
                                  {command.keys ?? command.kind}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </section>
                    ))}
                  </div>
                ) : (
                  <p className="px-3 py-5 text-center font-mono text-[0.78rem] text-muted-foreground">
                    Nothing here yet.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-border/55 px-3 py-2 font-mono text-[0.56rem] text-muted-foreground/48">
                <span className="inline-flex items-center gap-1.5">
                  <kbd className="rounded-[4px] border border-border/50 bg-background/60 px-1 py-0.5 text-[0.54rem] leading-none text-muted-foreground/58">↑↓</kbd>
                  <span>move</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <kbd className="rounded-[4px] border border-border/50 bg-background/60 px-1 py-0.5 text-[0.54rem] leading-none text-muted-foreground/58">return</kbd>
                  <span>open</span>
                </span>
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
            className="fixed inset-x-0 bottom-16 z-[2147483001] flex justify-center px-5 sm:bottom-5"
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
