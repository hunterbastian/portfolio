'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { useDialKit } from 'dialkit'
import ProjectCard from '@/components/ProjectCard'
import { Skeleton } from '@/components/ui/skeleton'
import { ProjectFrontmatter } from '@/types/project'
import { Magnetic } from '@/components/animate-ui/primitives/effects/magnetic'
import { MOTION_EASE_STANDARD, motionDelayMs, motionDurationMs } from '@/lib/motion'

interface Project {
  slug: string
  frontmatter: ProjectFrontmatter
}

interface ProjectGridClientProps {
  projects: Project[]
  initialLoadDelayMs?: number
}

const CASE_STUDY_ORDER = [
  'brand-identity-system',
  'wander-utah',
  'porsche-app',
  'aol-redesign',
  'grand-teton-wallet',
  'nutricost',
] as const

const CARD_STAGGER_TIMING = {
  panelAppear: 120,
  cardsAppear: 280,
  panelDuration: 380,
  cardDuration: 420,
  cardStagger: 90,
}

const CARD_STAGGER_PANEL = {
  initialOpacity: 0,
  finalOpacity: 1,
  initialY: 14,
  finalY: 0,
  initialBlur: 'blur(1.8px)',
  finalBlur: 'blur(0px)',
  ease: MOTION_EASE_STANDARD,
}

const CARD_STAGGER_ITEM = {
  initialOpacity: 0,
  finalOpacity: 1,
  initialY: 16,
  finalY: 0,
}

interface CardLayoutAngle {
  rotate: number
  x: number
}

const CARD_DEFAULT_LAYOUT: CardLayoutAngle = { rotate: -1.6, x: -2 }
const CASE_STUDY_DIAL_DEFAULTS = {
  compactSpreadFactor: -0.12,
  compactScale: 0.82,
  compactGapX: -8,
  compactGapY: -2,
  expandedGapX: 30,
  expandedGapY: 32,
  expandedScale: 0.89,
  expandMs: 201,
  collapseMs: 219,
  inactiveOpacity: 0.88,
  stackPriority: 'default',
} as const

const DIALOG_FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) {
    return []
  }

  return Array.from(container.querySelectorAll<HTMLElement>(DIALOG_FOCUSABLE_SELECTOR)).filter((element) => {
    if (element.getAttribute('aria-hidden') === 'true') {
      return false
    }
    if (element.tabIndex < 0) {
      return false
    }
    if ('disabled' in element && (element as HTMLButtonElement).disabled) {
      return false
    }
    return true
  })
}

function getStackPriorityZIndex(index: number, total: number, stackPriority: string): number {
  if (stackPriority === 'center') {
    const center = (total - 1) / 2
    return Math.round(total - Math.abs(index - center) * 2)
  }

  if (stackPriority === 'left') {
    return total - index
  }

  if (stackPriority === 'right') {
    return index + 1
  }

  return index + 1
}

const CARD_LAYOUT_BY_SLUG: Record<string, CardLayoutAngle> = {
  'brand-identity-system': { rotate: -6.2, x: -14 }, // Middle Earth Journey - left tilt
  'aol-redesign': { rotate: -5.4, x: -11 }, // AOL Redesign - left tilt
  'porsche-app': { rotate: 6.2, x: 14 }, // Porsche App - right tilt
  'wander-utah': { rotate: 0, x: 0 }, // centered / no tilt
  'grand-teton-wallet': { rotate: 0, x: 0 }, // centered / no tilt
  nutricost: { rotate: -2.8, x: -5 },
}

export default function ProjectGridClient({ projects, initialLoadDelayMs = 0 }: ProjectGridClientProps) {
  const [stage, setStage] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isGridHovered, setIsGridHovered] = useState(false)
  const [activeCaseStudySlug, setActiveCaseStudySlug] = useState<string | null>(null)
  const [supportsHover, setSupportsHover] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.matchMedia('(hover: hover) and (pointer: fine)').matches
  })
  const router = useRouter()
  const prefersReducedMotion = useReducedMotion() ?? false
  const gridRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const lastFocusedElementRef = useRef<HTMLElement | null>(null)
  const hasPlayedEntranceRef = useRef(false)
  const isGridInView = useInView(gridRef, { once: true, amount: 0.16 })
  const prefetchedSlugsRef = useRef(new Set<string>())

  const orderedProjects = useMemo(() => {
    const orderIndex = new Map<string, number>(CASE_STUDY_ORDER.map((slug, index) => [slug, index]))
    return [...projects].sort((a, b) => {
      const aIndex = orderIndex.get(a.slug)
      const bIndex = orderIndex.get(b.slug)

      if (aIndex != null && bIndex != null) {
        return aIndex - bIndex
      }
      if (aIndex != null) {
        return -1
      }
      if (bIndex != null) {
        return 1
      }
      return 0
    })
  }, [projects])

  const activeCaseStudy = useMemo(() => {
    if (!activeCaseStudySlug) {
      return null
    }

    return orderedProjects.find((project) => project.slug === activeCaseStudySlug) ?? null
  }, [activeCaseStudySlug, orderedProjects])

  const caseStudyDial = useDialKit('Case Study Stack', {
    pile: {
      compactSpreadFactor: [CASE_STUDY_DIAL_DEFAULTS.compactSpreadFactor, -1.2, 0.35],
      compactScale: [CASE_STUDY_DIAL_DEFAULTS.compactScale, 0.82, 1.02],
      compactGapX: [CASE_STUDY_DIAL_DEFAULTS.compactGapX, -24, 18],
      compactGapY: [CASE_STUDY_DIAL_DEFAULTS.compactGapY, -16, 20],
      stackPriority: {
        type: 'select',
        options: [
          { value: 'default', label: 'Current Layering' },
          { value: 'center', label: 'Center Cards On Top' },
          { value: 'left', label: 'Left Cards On Top' },
          { value: 'right', label: 'Right Cards On Top' },
        ],
        default: CASE_STUDY_DIAL_DEFAULTS.stackPriority,
      },
    },
    expanded: {
      gapX: [CASE_STUDY_DIAL_DEFAULTS.expandedGapX, 8, 52],
      gapY: [CASE_STUDY_DIAL_DEFAULTS.expandedGapY, 10, 54],
      scale: [CASE_STUDY_DIAL_DEFAULTS.expandedScale, 0.82, 1],
    },
    motion: {
      expandMs: [CASE_STUDY_DIAL_DEFAULTS.expandMs, 80, 420],
      collapseMs: [CASE_STUDY_DIAL_DEFAULTS.collapseMs, 90, 520],
    },
    hover: {
      inactiveOpacity: [CASE_STUDY_DIAL_DEFAULTS.inactiveOpacity, 0.65, 1],
    },
  })

  const prefetchProject = useCallback((slug: string) => {
    if (prefetchedSlugsRef.current.has(slug)) {
      return
    }

    prefetchedSlugsRef.current.add(slug)
    router.prefetch(`/projects/${slug}`)
  }, [router])

  const openCaseStudyOverlay = useCallback((slug: string) => {
    if (typeof document !== 'undefined') {
      const activeElement = document.activeElement
      lastFocusedElementRef.current = activeElement instanceof HTMLElement ? activeElement : null
    }

    prefetchProject(slug)
    setActiveCaseStudySlug(slug)
  }, [prefetchProject])

  const closeCaseStudyOverlay = useCallback(() => {
    setActiveCaseStudySlug(null)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const updateSupportsHover = () => setSupportsHover(mediaQuery.matches)

    updateSupportsHover()
    mediaQuery.addEventListener('change', updateSupportsHover)
    return () => mediaQuery.removeEventListener('change', updateSupportsHover)
  }, [])

  useEffect(() => {
    if (!isGridInView) {
      setStage(0)
      return
    }

    if (prefersReducedMotion) {
      setStage(2)
      hasPlayedEntranceRef.current = true
      return
    }

    const initialDelay = hasPlayedEntranceRef.current ? 0 : initialLoadDelayMs
    setStage(0)
    const timers: Array<ReturnType<typeof setTimeout>> = []
    timers.push(setTimeout(() => setStage(1), initialDelay + CARD_STAGGER_TIMING.panelAppear))
    timers.push(
      setTimeout(() => {
        setStage(2)
        hasPlayedEntranceRef.current = true
      }, initialDelay + CARD_STAGGER_TIMING.cardsAppear)
    )

    return () => timers.forEach(clearTimeout)
  }, [initialLoadDelayMs, isGridInView, prefersReducedMotion])

  useEffect(() => {
    if (!activeCaseStudySlug) {
      return
    }

    const previousOverflow = document.body.style.overflow
    const focusDialog = () => {
      const initialFocusTarget = closeButtonRef.current ?? getFocusableElements(dialogRef.current)[0] ?? dialogRef.current
      initialFocusTarget?.focus()
    }

    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeCaseStudyOverlay()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusableElements = getFocusableElements(dialogRef.current)
      if (focusableElements.length === 0) {
        event.preventDefault()
        dialogRef.current?.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      const activeElement = document.activeElement

      if (event.shiftKey) {
        if (activeElement === firstElement || activeElement === dialogRef.current) {
          event.preventDefault()
          lastElement.focus()
        }
        return
      }

      if (activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.body.style.overflow = 'hidden'
    requestAnimationFrame(focusDialog)
    document.addEventListener('keydown', handleKeyboard)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyboard)
      const elementToRestore = lastFocusedElementRef.current
      if (elementToRestore) {
        requestAnimationFrame(() => {
          elementToRestore.focus()
        })
      }
    }
  }, [activeCaseStudySlug, closeCaseStudyOverlay])

  const isExpandedLayout = !supportsHover || isGridHovered
  const layoutTransitionDuration = isExpandedLayout ? caseStudyDial.motion.expandMs : caseStudyDial.motion.collapseMs
  const layoutSpreadFactor = isExpandedLayout ? 1 : caseStudyDial.pile.compactSpreadFactor
  const gridColumnGap = isExpandedLayout ? caseStudyDial.expanded.gapX : caseStudyDial.pile.compactGapX
  const gridRowGap = isExpandedLayout ? caseStudyDial.expanded.gapY : caseStudyDial.pile.compactGapY

  return (
    <>
      <motion.div
        ref={gridRef}
        className="mx-auto grid w-full max-w-[780px] grid-cols-1 px-1 sm:grid-cols-2 sm:px-0 md:grid-cols-3"
        onMouseEnter={() => {
          if (supportsHover) {
            setIsGridHovered(true)
          }
        }}
        onMouseLeave={() => {
          if (supportsHover) {
            setIsGridHovered(false)
            setHoveredIndex(null)
          }
        }}
        initial={{ opacity: CARD_STAGGER_PANEL.initialOpacity, y: CARD_STAGGER_PANEL.initialY }}
        animate={{
          opacity: stage >= 1 ? CARD_STAGGER_PANEL.finalOpacity : CARD_STAGGER_PANEL.initialOpacity,
          y: stage >= 1 ? CARD_STAGGER_PANEL.finalY : CARD_STAGGER_PANEL.initialY,
          filter: stage >= 1 ? CARD_STAGGER_PANEL.finalBlur : CARD_STAGGER_PANEL.initialBlur,
          columnGap: gridColumnGap,
          rowGap: gridRowGap,
        }}
        style={{
          willChange: stage < 2 ? 'transform, opacity, filter' : 'auto',
        }}
        transition={{
          opacity: {
            duration: motionDurationMs(CARD_STAGGER_TIMING.panelDuration, prefersReducedMotion),
            ease: CARD_STAGGER_PANEL.ease,
          },
          y: {
            duration: motionDurationMs(CARD_STAGGER_TIMING.panelDuration, prefersReducedMotion),
            ease: CARD_STAGGER_PANEL.ease,
          },
          filter: {
            duration: motionDurationMs(CARD_STAGGER_TIMING.panelDuration, prefersReducedMotion),
            ease: CARD_STAGGER_PANEL.ease,
          },
          columnGap: {
            duration: motionDurationMs(layoutTransitionDuration, prefersReducedMotion),
            ease: CARD_STAGGER_PANEL.ease,
          },
          rowGap: {
            duration: motionDurationMs(layoutTransitionDuration, prefersReducedMotion),
            ease: CARD_STAGGER_PANEL.ease,
          },
        }}
      >
        {orderedProjects.map((project, index) => {
        const isFeaturedCard = project.slug === 'porsche-app'
        const baseAngle = CARD_LAYOUT_BY_SLUG[project.slug] ?? CARD_DEFAULT_LAYOUT
        const compactX = baseAngle.x * caseStudyDial.pile.compactSpreadFactor
        const compactRotate = baseAngle.rotate * caseStudyDial.pile.compactSpreadFactor
        const targetX = baseAngle.x * layoutSpreadFactor
        const targetRotate = baseAngle.rotate * layoutSpreadFactor
        const targetScale = isExpandedLayout ? caseStudyDial.expanded.scale : caseStudyDial.pile.compactScale
        const isHovered = hoveredIndex === index
        const hasHoverTarget = hoveredIndex !== null
        const cardOpacity = !supportsHover || !hasHoverTarget || isHovered ? 1 : caseStudyDial.hover.inactiveOpacity
        const stackZIndex = getStackPriorityZIndex(index, orderedProjects.length, caseStudyDial.pile.stackPriority)

        return (
          <motion.div
            key={project.slug}
            className="w-full transition-[transform,opacity,filter] duration-[430ms]"
            style={{
              zIndex: isHovered ? orderedProjects.length + 20 : stackZIndex,
              filter: !supportsHover || !hasHoverTarget || isHovered ? 'saturate(1)' : 'saturate(0.92)',
              willChange: stage < 2 || isHovered ? 'transform, opacity, filter' : 'auto',
            }}
            onMouseEnter={() => {
              prefetchProject(project.slug)
              if (supportsHover) {
                setHoveredIndex(index)
              }
            }}
            onMouseLeave={() => {
              if (supportsHover) {
                setHoveredIndex(null)
              }
            }}
            initial={{
              opacity: CARD_STAGGER_ITEM.initialOpacity,
              y: CARD_STAGGER_ITEM.initialY,
              x: compactX,
              rotate: compactRotate,
              scale: caseStudyDial.pile.compactScale,
            }}
            animate={{
              opacity: stage >= 2 ? cardOpacity : CARD_STAGGER_ITEM.initialOpacity,
              y: stage >= 2 ? CARD_STAGGER_ITEM.finalY : CARD_STAGGER_ITEM.initialY,
              x: targetX,
              rotate: targetRotate,
              scale: targetScale,
            }}
            transition={{
              opacity: {
                duration: motionDurationMs(CARD_STAGGER_TIMING.cardDuration, prefersReducedMotion),
                delay: stage >= 2 ? motionDelayMs(index * CARD_STAGGER_TIMING.cardStagger, prefersReducedMotion) : 0,
                ease: CARD_STAGGER_PANEL.ease,
              },
              y: {
                duration: motionDurationMs(CARD_STAGGER_TIMING.cardDuration, prefersReducedMotion),
                delay: stage >= 2 ? motionDelayMs(index * CARD_STAGGER_TIMING.cardStagger, prefersReducedMotion) : 0,
                ease: CARD_STAGGER_PANEL.ease,
              },
              x: {
                duration: motionDurationMs(layoutTransitionDuration, prefersReducedMotion),
                ease: CARD_STAGGER_PANEL.ease,
              },
              rotate: {
                duration: motionDurationMs(layoutTransitionDuration, prefersReducedMotion),
                ease: CARD_STAGGER_PANEL.ease,
              },
              scale: {
                duration: motionDurationMs(layoutTransitionDuration, prefersReducedMotion),
                ease: CARD_STAGGER_PANEL.ease,
              },
            }}
          >
            <Magnetic strength={0.28} range={130} onlyOnHover disableOnTouch>
              {project.frontmatter?.image ? (
                <ProjectCard
                  slug={project.slug}
                  frontmatter={project.frontmatter}
                  index={index}
                  isFeatured={isFeaturedCard}
                  onOpenCaseStudy={openCaseStudyOverlay}
                />
              ) : (
                <div className="aspect-[16/9] w-full rounded-[14px]">
                  <Skeleton className="h-full w-full rounded-[14px]" />
                </div>
              )}
            </Magnetic>
          </motion.div>
        )
      })}
      </motion.div>

      <AnimatePresence>
        {activeCaseStudy && (
          <motion.div
            className="fixed inset-0 z-[140] flex items-center justify-center p-3 sm:p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: CARD_STAGGER_PANEL.ease }}
            onClick={closeCaseStudyOverlay}
          >
            <motion.div
              className="absolute inset-0 bg-[rgba(15,20,30,0.36)] backdrop-blur-[5px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.section
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              tabIndex={-1}
              aria-labelledby={`case-study-dialog-title-${activeCaseStudy.slug}`}
              className="relative z-10 flex h-[min(88vh,960px)] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-[color:color-mix(in_srgb,var(--border)_72%,white)] bg-[color:color-mix(in_srgb,var(--card)_92%,white)] shadow-[0_36px_110px_rgba(12,18,28,0.34)]"
              initial={{ opacity: 0, y: 22, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.99 }}
              transition={{ duration: 0.28, ease: CARD_STAGGER_PANEL.ease }}
              onClick={(event) => event.stopPropagation()}
            >
              <header className="flex items-center justify-between border-b border-[color:color-mix(in_srgb,var(--border)_68%,white)] px-4 py-3 sm:px-5">
                <div className="min-w-0">
                  <p className="truncate font-code text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    Case Study
                  </p>
                  <h2
                    id={`case-study-dialog-title-${activeCaseStudy.slug}`}
                    className="truncate text-sm font-semibold text-foreground sm:text-base"
                  >
                    {activeCaseStudy.frontmatter.title}
                  </h2>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeCaseStudyOverlay}
                  className="nord-button inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground/80 transition-colors hover:text-foreground"
                  aria-label="Close case study"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </header>

              <div className="h-full w-full bg-background/70">
                <iframe
                  src={`/projects/${activeCaseStudy.slug}#main-content`}
                  className="h-full w-full border-0"
                  title={`${activeCaseStudy.frontmatter.title} case study`}
                  loading="eager"
                />
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
