'use client'

import { AnimatePresence, m, useInView, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  contactSocialLinks,
  creatingLinks,
  educationItems,
  experienceItems,
  homeHeroContent,
} from '@/content/homepage'
import { siteConfig, siteProjectInquiryHref } from '@/lib/site'
import { MOTION_EASE_STANDARD, motionDelayMs, motionDurationMs } from '@/lib/motion'
import CollapsibleSection from './CollapsibleSection'

interface AnimatedHomePageProps {
  children: ReactNode
}

type SectionKey = 'creating' | 'caseStudies' | 'experience' | 'education' | 'contact'
type SectionOpenState = Record<SectionKey, boolean>

interface SectionNavigateDetail {
  href: string
}

const SECTION_NAV_EVENT = 'hb:section-navigate'

const DEFAULT_SECTION_OPEN_STATE: SectionOpenState = {
  creating: true,
  caseStudies: true,
  experience: true,
  education: true,
  contact: true,
}

const HREF_TO_SECTION_KEY: Record<string, SectionKey> = {
  '#creating': 'creating',
  '#case-studies': 'caseStudies',
  '#experience': 'experience',
  '#education': 'education',
  '#contact': 'contact',
}

const INITIAL_SECTION_LOAD_DELAY = {
  caseStudies: 220,
  creating: 440,
} as const

const PRESENT_SUFFIX = ' - Present'

function splitExperienceYear(year: string) {
  if (!year.endsWith(PRESENT_SUFFIX)) {
    return { primary: year, secondary: null as string | null }
  }

  return {
    primary: `${year.slice(0, -PRESENT_SUFFIX.length)} -`,
    secondary: 'Present',
  }
}

const HERO_ENTRANCE = {
  profileDelay: 40, // profile appears first
  textPanelDelay: 60, // align with section panel reveal
  textItemsDelay: 140, // align with section item reveal
  duration: 260, // reveal transition duration
}

/* ─────────────────────────────────────────────────────────
 * SECTION STAGGER STORYBOARD
 *
 * Read top-to-bottom. Each `at` value is ms after section enters view.
 *
 *    0ms   waiting for section in-view + open
 *  120ms   panel fades in, y 14 → 0
 *  280ms   rows/items reveal (staggered 90ms)
 * ───────────────────────────────────────────────────────── */

const STAGGER_TIMING = {
  panelAppear: 60, // panel starts appearing
  itemsAppear: 140, // items begin staggered reveal
  panelDuration: 240, // panel transition duration
  itemDuration: 280, // each item transition duration
  itemStagger: 50, // stagger gap between items
}

const STAGGER_PANEL = {
  initialOpacity: 0, // hidden before stage 1
  finalOpacity: 1, // visible at rest
  initialY: 8, // panel vertical offset before reveal
  finalY: 0, // resting panel position
  ease: MOTION_EASE_STANDARD,
}

const STAGGER_ITEM = {
  initialOpacity: 0, // hidden item before stage 2
  finalOpacity: 1, // visible item at rest
  initialY: 8, // item vertical offset before reveal
  finalY: 0, // resting item position
}

function useSectionStage(isOpen: boolean, isInView: boolean, prefersReducedMotion: boolean): number {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    if (!isOpen || !isInView) {
      setStage(0)
      return
    }

    if (prefersReducedMotion) {
      setStage(2)
      return
    }

    setStage(0)
    const timers: Array<ReturnType<typeof setTimeout>> = []

    timers.push(setTimeout(() => setStage(1), STAGGER_TIMING.panelAppear))
    timers.push(setTimeout(() => setStage(2), STAGGER_TIMING.itemsAppear))

    return () => timers.forEach(clearTimeout)
  }, [isOpen, isInView, prefersReducedMotion])

  return stage
}

type Breakpoint = 'mobile' | 'tablet' | 'desktop'

function getBreakpoint(width: number): Breakpoint {
  if (width >= 1024) return 'desktop'
  if (width >= 640) return 'tablet'
  return 'mobile'
}

// Detect viewport crossings between the homepage's three layout modes so the
// resize feels acknowledged instead of snapping with no visual feedback.
function useBreakpointChange() {
  const [flash, setFlash] = useState(false)
  const bpRef = useRef<Breakpoint | null>(null)

  useEffect(() => {
    const initial = getBreakpoint(window.innerWidth)
    bpRef.current = initial

    const observer = new ResizeObserver(([entry]) => {
      const next = getBreakpoint(entry.contentRect.width)
      if (bpRef.current !== null && next !== bpRef.current) {
        bpRef.current = next
        setFlash(true)
        setTimeout(() => setFlash(false), 900)
      } else {
        bpRef.current = next
      }
    })

    observer.observe(document.documentElement)
    return () => observer.disconnect()
  }, [])

  return flash
}

// Keep the transition contextual. A light blur preserves the page underneath
// better than a dark wash and stays aligned with the site's restrained palette.
function CreatingLoader() {
  const flash = useBreakpointChange()
  const prefersReducedMotion = useReducedMotion() ?? false

  if (prefersReducedMotion) return null

  return (
    <AnimatePresence>
      {flash && (
        <m.div
          className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          style={{
            background: 'rgba(var(--background-rgb), 0.16)',
            backdropFilter: 'blur(14px) saturate(0.92)',
            WebkitBackdropFilter: 'blur(14px) saturate(0.92)',
          }}
        >
          <m.svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            initial={{ rotate: 0, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 360, opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{
              rotate: { duration: 0.8, ease: 'linear', repeat: Infinity },
              opacity: { duration: 0.18 },
              scale: { duration: 0.22, ease: 'easeOut' },
            }}
          >
            <circle
              cx="16"
              cy="16"
              r="12"
              stroke="var(--primary)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="56"
              strokeDashoffset="40"
              opacity="0.7"
            />
          </m.svg>
        </m.div>
      )}
    </AnimatePresence>
  )
}

export default function AnimatedHomePage({ children }: AnimatedHomePageProps) {
  const [sectionOpen, setSectionOpen] = useState<SectionOpenState>(DEFAULT_SECTION_OPEN_STATE)
  const [heroTextStage, setHeroTextStage] = useState(0)
  const prefersReducedMotion = useReducedMotion() ?? false

  const experiencePanelRef = useRef<HTMLDivElement>(null)
  const educationPanelRef = useRef<HTMLDivElement>(null)

  const isExperienceInView = useInView(experiencePanelRef, { once: true, margin: '-120px 0px -120px 0px' })
  const isEducationInView = useInView(educationPanelRef, { once: true, margin: '-120px 0px -120px 0px' })

  const experienceStage = useSectionStage(sectionOpen.experience, isExperienceInView, prefersReducedMotion)
  const educationStage = useSectionStage(sectionOpen.education, isEducationInView, prefersReducedMotion)

  useEffect(() => {
    if (prefersReducedMotion) {
      setHeroTextStage(2)
      return
    }

    setHeroTextStage(0)
    const timers: Array<ReturnType<typeof setTimeout>> = []
    timers.push(setTimeout(() => setHeroTextStage(1), HERO_ENTRANCE.textPanelDelay))
    timers.push(setTimeout(() => setHeroTextStage(2), HERO_ENTRANCE.textItemsDelay))

    return () => timers.forEach(clearTimeout)
  }, [prefersReducedMotion])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const openSectionForHref = (href: string) => {
      const sectionKey = HREF_TO_SECTION_KEY[href]
      if (!sectionKey) {
        return
      }

      setSectionOpen((prev) => {
        if (prev[sectionKey]) {
          return prev
        }

        return { ...prev, [sectionKey]: true }
      })
    }

    const handleSectionNavigate = (event: Event) => {
      const detail = (event as CustomEvent<SectionNavigateDetail>).detail
      if (detail?.href) {
        openSectionForHref(detail.href)
      }
    }

    const handleHashChange = () => {
      if (window.location.hash) {
        openSectionForHref(window.location.hash)
      }
    }

    window.addEventListener(SECTION_NAV_EVENT, handleSectionNavigate as EventListener)
    window.addEventListener('hashchange', handleHashChange)

    handleHashChange()

    return () => {
      window.removeEventListener(SECTION_NAV_EVENT, handleSectionNavigate as EventListener)
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const toggleSection = useCallback((key: SectionKey) => {
    setSectionOpen((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  return (
    <div className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[23rem] sm:h-[30rem]"
      >
        <div className="hero-sky" />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <div className="relative">
      <CreatingLoader />
      <section className="relative animate-fade-in pb-0 pt-8 sm:pt-12">
        <div className="mx-auto max-w-[560px] hero-section relative z-10 px-4 sm:px-6 lg:px-0">
          <div className="mb-6 flex items-start gap-3 sm:items-center sm:gap-4">
            <m.div
              initial={{ opacity: STAGGER_ITEM.initialOpacity, y: STAGGER_ITEM.initialY, scale: 0.94 }}
              animate={{ opacity: STAGGER_ITEM.finalOpacity, y: STAGGER_ITEM.finalY, scale: 1 }}
              transition={{
                duration: motionDurationMs(HERO_ENTRANCE.duration, prefersReducedMotion),
                delay: motionDelayMs(HERO_ENTRANCE.profileDelay, prefersReducedMotion),
                ease: STAGGER_PANEL.ease,
              }}
            >
              <Image
                src="/images/profilepicture.webp"
                alt="Hunter Bastian"
                width={72}
                height={72}
                className="h-16 w-16 shrink-0 rounded-full border border-border object-cover shadow-sm sm:h-[72px] sm:w-[72px]"
                priority
              />
            </m.div>
            <div className="min-w-0">
              <h1
                className="text-foreground font-mono font-normal text-[14px] leading-[1.2] tracking-[0.02em]"
              >
                {homeHeroContent.headline}
              </h1>
              <p className="mt-1 font-mono text-[11px] font-normal tracking-[0.06em] text-foreground opacity-75 sm:text-xs">
                {homeHeroContent.subtitle}
              </p>
              <p className="mt-1 font-mono text-[9px] font-normal tracking-[0.1em] uppercase text-foreground opacity-40 sm:text-[10px]">
                {siteConfig.siteLocation} / {siteConfig.siteSeason}
              </p>
            </div>
          </div>

          <m.div
            className="mt-4 mb-4 sm:mt-5"
            initial={{ opacity: STAGGER_PANEL.initialOpacity, y: STAGGER_PANEL.initialY }}
            animate={{
              opacity: heroTextStage >= 1 ? STAGGER_PANEL.finalOpacity : STAGGER_PANEL.initialOpacity,
              y: heroTextStage >= 1 ? STAGGER_PANEL.finalY : STAGGER_PANEL.initialY,
            }}
            transition={{
              duration: motionDurationMs(STAGGER_TIMING.panelDuration, prefersReducedMotion),
              ease: STAGGER_PANEL.ease,
            }}
          >
            <m.p
              className="m-0 font-mono font-normal text-sm leading-relaxed text-muted-foreground"
              initial={{ opacity: STAGGER_ITEM.initialOpacity, y: STAGGER_ITEM.initialY }}
              animate={{
                opacity: heroTextStage >= 2 ? STAGGER_ITEM.finalOpacity : STAGGER_ITEM.initialOpacity,
                y: heroTextStage >= 2 ? STAGGER_ITEM.finalY : STAGGER_ITEM.initialY,
              }}
              transition={{
                duration: motionDurationMs(STAGGER_TIMING.itemDuration, prefersReducedMotion),
                delay: heroTextStage >= 2 ? motionDelayMs(STAGGER_TIMING.itemStagger, prefersReducedMotion) : 0,
                ease: STAGGER_PANEL.ease,
              }}
            >
              {homeHeroContent.intro}
            </m.p>

            <m.div
              className="hero-handwritten-preview"
              initial={{ opacity: STAGGER_ITEM.initialOpacity, y: STAGGER_ITEM.initialY + 4 }}
              animate={{
                opacity: heroTextStage >= 2 ? STAGGER_ITEM.finalOpacity : STAGGER_ITEM.initialOpacity,
                y: heroTextStage >= 2 ? STAGGER_ITEM.finalY : STAGGER_ITEM.initialY + 4,
              }}
              transition={{
                duration: motionDurationMs(STAGGER_TIMING.itemDuration, prefersReducedMotion),
                delay: heroTextStage >= 2 ? motionDelayMs(STAGGER_TIMING.itemStagger + 170, prefersReducedMotion) : 0,
                ease: STAGGER_PANEL.ease,
              }}
            >
              <a href="/about" className="hero-handwritten-text font-handscript cursor-pointer">{homeHeroContent.handwrittenNote}</a>
            </m.div>
          </m.div>

        </div>
      </section>

      <CollapsibleSection
        id="case-studies"
        title="01 PROJECTS"
        isOpen={sectionOpen.caseStudies}
        onToggle={() => toggleSection('caseStudies')}
        initialLoadDelayMs={INITIAL_SECTION_LOAD_DELAY.caseStudies}
        className="px-4 sm:px-6 lg:px-0 relative z-10"
        openClassName="py-12"
        closedClassName="py-5"
        contentClassName="mt-4 space-y-8"
      >
        <div className="mx-auto max-w-[560px] rounded-md border border-border/70 bg-card/32 px-3 py-5 sm:px-5 sm:py-6">
          {children}
        </div>
      </CollapsibleSection>

      <div className="px-4 pb-2 sm:px-6 lg:px-0 relative z-10">
        <div className="mx-auto max-w-[560px]">
          <a
            href="/archive"
            className="social-button nord-button playground-btn inline-flex items-center justify-center gap-1.5 rounded-sm px-4 py-2 text-xs font-medium transition-transform transition-shadow duration-500 relative overflow-hidden hover:-translate-y-0.5 hover:shadow-md"
            aria-label="Open Playground"
            title="Open Playground"
          >
            <span className="font-light uppercase tracking-[0.08em] relative z-10">Playground</span>
          </a>
        </div>
      </div>

      <CollapsibleSection
        id="creating"
        title="02 ENDEAVORS"
        isOpen={sectionOpen.creating}
        onToggle={() => toggleSection('creating')}
        initialLoadDelayMs={INITIAL_SECTION_LOAD_DELAY.creating}
        className="px-4 sm:px-6 lg:px-0 relative z-10"
        openClassName="py-12"
        closedClassName="py-5"
        contentClassName="mt-4"
      >
        <div className="mx-auto max-w-[560px] text-left">
          <ul className="space-y-2">
            {creatingLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 text-sm tracking-[0.06em] text-muted-foreground underline decoration-muted-foreground/30 underline-offset-4 hover:text-primary hover:decoration-primary/40"
                  aria-label={link.ariaLabel ?? link.label}
                  title={link.title ?? link.label}
                >
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </CollapsibleSection>
      </div>

      <CollapsibleSection
        id="experience"
        title="03 EXPERIENCE"
        isOpen={sectionOpen.experience}
        onToggle={() => toggleSection('experience')}
        className="px-4 sm:px-6 lg:px-0"
        openClassName="py-12"
        closedClassName="py-5"
        contentClassName="mt-4"
      >
        <div className="mx-auto max-w-[560px]">
          <m.div
            ref={experiencePanelRef}
            className="nord-panel rounded-lg p-4 sm:p-5 space-y-2"
            initial={{ opacity: STAGGER_PANEL.initialOpacity, y: STAGGER_PANEL.initialY }}
            animate={{
              opacity: experienceStage >= 1 ? STAGGER_PANEL.finalOpacity : STAGGER_PANEL.initialOpacity,
              y: experienceStage >= 1 ? STAGGER_PANEL.finalY : STAGGER_PANEL.initialY,
            }}
            transition={{
              duration: motionDurationMs(STAGGER_TIMING.panelDuration, prefersReducedMotion),
              ease: STAGGER_PANEL.ease,
            }}
          >
            {experienceItems.map((job, index) => {
              const displayYear = splitExperienceYear(job.year)
              return (
                <m.div
                  key={job.company}
                  className="border-b border-border py-3.5 last:border-b-0"
                  initial={{ opacity: STAGGER_ITEM.initialOpacity, y: STAGGER_ITEM.initialY }}
                  animate={{
                    opacity: experienceStage >= 2 ? STAGGER_ITEM.finalOpacity : STAGGER_ITEM.initialOpacity,
                    y: experienceStage >= 2 ? STAGGER_ITEM.finalY : STAGGER_ITEM.initialY,
                  }}
                  transition={{
                    duration: motionDurationMs(STAGGER_TIMING.itemDuration, prefersReducedMotion),
                    delay: experienceStage >= 2 ? motionDelayMs(index * STAGGER_TIMING.itemStagger, prefersReducedMotion) : 0,
                    ease: STAGGER_PANEL.ease,
                  }}
                >
                  <div className="flex flex-col gap-2 px-2 sm:flex-row sm:items-start sm:gap-6">
                    <span className="font-mono text-xs font-normal text-muted-foreground sm:min-w-[90px]">
                      <span className="block whitespace-nowrap">{displayYear.primary}</span>
                      {displayYear.secondary && (
                        <span className="block whitespace-nowrap leading-tight">{displayYear.secondary}</span>
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-mono text-[13px] font-medium tracking-[0.04em] text-foreground">
                          {job.company}
                        </h3>
                      </div>
                      <p className="mt-1 font-mono text-xs font-normal tracking-[0.04em] text-muted-foreground">
                        {job.title}
                      </p>
                      <p className="mt-2 font-mono text-sm font-normal leading-relaxed text-muted-foreground">
                        {job.description}
                      </p>
                    </div>
                  </div>
                </m.div>
              )
            })}
          </m.div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        id="education"
        title="04 EDUCATION"
        isOpen={sectionOpen.education}
        onToggle={() => toggleSection('education')}
        className="px-4 sm:px-6 lg:px-0"
        openClassName="py-12"
        closedClassName="py-5"
        contentClassName="mt-4"
      >
        <div className="mx-auto max-w-[560px]">
          <m.div
            ref={educationPanelRef}
            className="nord-panel rounded-lg p-5 space-y-5"
            initial={{ opacity: STAGGER_PANEL.initialOpacity, y: STAGGER_PANEL.initialY }}
            animate={{
              opacity: educationStage >= 1 ? STAGGER_PANEL.finalOpacity : STAGGER_PANEL.initialOpacity,
              y: educationStage >= 1 ? STAGGER_PANEL.finalY : STAGGER_PANEL.initialY,
            }}
            transition={{
              duration: motionDurationMs(STAGGER_TIMING.panelDuration, prefersReducedMotion),
              ease: STAGGER_PANEL.ease,
            }}
          >
            {educationItems.map((edu, index) => (
              <m.div
                key={edu.institution}
                className="border-b border-border last:border-b-0 pb-5 last:pb-0"
                initial={{ opacity: STAGGER_ITEM.initialOpacity, y: STAGGER_ITEM.initialY }}
                animate={{
                  opacity: educationStage >= 2 ? STAGGER_ITEM.finalOpacity : STAGGER_ITEM.initialOpacity,
                  y: educationStage >= 2 ? STAGGER_ITEM.finalY : STAGGER_ITEM.initialY,
                }}
                transition={{
                  duration: motionDurationMs(STAGGER_TIMING.itemDuration, prefersReducedMotion),
                  delay: educationStage >= 2 ? motionDelayMs(index * STAGGER_TIMING.itemStagger, prefersReducedMotion) : 0,
                  ease: STAGGER_PANEL.ease,
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="font-mono text-xs font-normal text-muted-foreground sm:min-w-[100px]">
                    {edu.year}
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 font-mono text-[13px] font-medium tracking-[0.04em] text-foreground">
                      {edu.institution}
                    </h3>
                    <p className="mb-1 font-mono text-sm font-normal tracking-[0.04em] text-foreground">
                      {edu.degree}
                    </p>
                    <p className="font-mono text-sm font-normal tracking-[0.04em] text-muted-foreground">
                      {edu.level}
                    </p>
                    {edu.note && (
                      <p
                        className="mt-1 font-mono text-xs font-normal tracking-[0.08em] text-muted-foreground"
                        style={{ opacity: 0.7 }}
                      >
                        {edu.note}
                      </p>
                    )}
                  </div>
                </div>
              </m.div>
            ))}
          </m.div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        id="contact"
        title="05 CONTACT"
        isOpen={sectionOpen.contact}
        onToggle={() => toggleSection('contact')}
        className="px-4 sm:px-6 lg:px-0"
        openClassName="pt-12 pb-20"
        closedClassName="py-5"
        contentClassName="mt-4"
      >
        <div className="mx-auto max-w-[560px]">
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[14px] font-normal tracking-[0.02em] sm:text-[15px]">
            <a
              href={siteProjectInquiryHref}
              className="text-[13px] text-foreground underline decoration-current underline-offset-4 transition-colors duration-200 hover:text-foreground"
              aria-label="Email Hunter"
              title="Email Hunter"
            >
              Email
            </a>
            {contactSocialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="text-[13px] text-foreground underline decoration-current underline-offset-4 transition-colors duration-200 hover:text-foreground"
                aria-label={link.label}
                title={link.label}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      </div>
    </div>
  )
}
