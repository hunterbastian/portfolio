'use client'

import { AnimatePresence, m, useInView, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { Card } from '@/components/ui/card'

const MotionCard = m.create(Card)
import { Separator } from '@/components/ui/separator'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import {
  contactSocialLinks,
  creatingLinks,
  educationItems,
  experienceItems,
  homeHeroContent,
} from '@/content/homepage'
import { MOTION_EASE_SOFT, motionDelayMs, motionDurationMs } from '@/lib/motion'
import { useIsInitialLoad } from '@/lib/initial-load'
import CollapsibleSection from './CollapsibleSection'
import { Magnetic } from '@/components/animate-ui/primitives/effects/magnetic'
import TextReveal from './TextReveal'
import { IconGamepad2, IconHandshake } from 'nucleo-pixel-essential'
import { Sun, ArrowDown } from 'lucide-react'
import { useWebHaptics } from 'web-haptics/react'

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
  caseStudies: 0,
  creating: 220,
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

/* ─────────────────────────────────────────────────────────
 * HERO ENTRANCE STORYBOARD
 *
 *    0ms   waiting for mount
 *   60ms   profile image fades in, scales 0.94 → 1
 *  100ms   text panel glides up y 12 → 0
 *  220ms   intro paragraph + handwritten note rise in
 * ───────────────────────────────────────────────────────── */

const HERO_ENTRANCE = {
  profileDelay: 40,     // profile appears first
  textPanelDelay: 80,   // text panel follows shortly
  textItemsDelay: 160,  // intro + note arrive last
  duration: 320,        // snappier reveal
}

/* ─────────────────────────────────────────────────────────
 * SECTION STAGGER STORYBOARD
 *
 * Read top-to-bottom. Each `at` value is ms after section enters view.
 *
 *    0ms   waiting for section in-view + open
 *  100ms   panel fades in, y 12 → 0
 *  240ms   rows/items rise into place (staggered 70ms)
 * ───────────────────────────────────────────────────────── */

const STAGGER_TIMING = {
  panelAppear: 120,     // panel starts appearing
  itemsAppear: 280,     // items begin staggered reveal
  panelDuration: 420,   // slower panel transition
  itemDuration: 460,    // each item transitions gently
  itemStagger: 90,      // wider stagger — items breathe (間)
}

const STAGGER_PANEL = {
  initialOpacity: 0,    // hidden before stage 1
  finalOpacity: 1,      // visible at rest
  initialY: 12,         // more travel for visible glide
  finalY: 0,            // resting panel position
  ease: MOTION_EASE_SOFT,
}

const STAGGER_ITEM = {
  initialOpacity: 0,    // hidden item before stage 2
  finalOpacity: 1,      // visible item at rest
  initialY: 12,         // items rise from further down
  finalY: 0,            // resting item position
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
            exit={{ opacity: 0, scale: 0.9 }}
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

const playgroundIconVariants = {
  idle: { rotate: 0, scale: 1 },
  hover: {
    rotate: [0, -15, 10, -5, 0],
    scale: 1.2,
    transition: {
      rotate: { duration: 0.5, ease: 'easeInOut' },
      scale: { type: 'spring', stiffness: 500, damping: 12 },
    },
  },
}

function PlaygroundButton() {
  const prefersReducedMotion = useReducedMotion() ?? false
  const haptic = useWebHaptics()

  return (
    <m.a
      href="/archive"
      className="playground-joy group relative overflow-hidden inline-flex items-center gap-2 rounded-full px-5 py-2.5 min-h-[44px] text-[11px] font-medium tracking-[0.06em] uppercase focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
      aria-label="Open Playground"
      title="Joy"
      initial="idle"
      whileHover={prefersReducedMotion ? undefined : 'hover'}
      animate="idle"
      whileTap={prefersReducedMotion ? undefined : { scale: 0.93, y: 0 }}
      onClick={() => haptic.trigger('light')}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      variants={{ idle: { y: 0 }, hover: { y: -3 } }}
    >
      <m.span
        className="relative z-10"
        variants={prefersReducedMotion ? undefined : playgroundIconVariants}
      >
        <IconGamepad2 size={13} aria-hidden />
      </m.span>
      <m.span
        className="relative z-10"
        variants={prefersReducedMotion ? undefined : {
          idle: { letterSpacing: '0.06em' },
          hover: { letterSpacing: '0.1em', transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
        }}
      >
        Playground
      </m.span>
    </m.a>
  )
}

export default function AnimatedHomePage({ children }: AnimatedHomePageProps) {
  const isInitialLoad = useIsInitialLoad()
  const [sectionOpen, setSectionOpen] = useState<SectionOpenState>(DEFAULT_SECTION_OPEN_STATE)
  // Skip internal hero entrance on client-side nav — PageTransition handles it
  const [heroTextStage, setHeroTextStage] = useState(2)
  const [underlineRevealed, setUnderlineRevealed] = useState(false)
  const haptic = useWebHaptics()
  const prefersReducedMotion = useReducedMotion() ?? false

  const experiencePanelRef = useRef<HTMLDivElement>(null)
  const educationPanelRef = useRef<HTMLDivElement>(null)

  const isExperienceInView = useInView(experiencePanelRef, { once: true, margin: '-120px 0px -120px 0px' })
  const isEducationInView = useInView(educationPanelRef, { once: true, margin: '-120px 0px -120px 0px' })

  const experienceStage = useSectionStage(sectionOpen.experience, isExperienceInView, prefersReducedMotion)
  const educationStage = useSectionStage(sectionOpen.education, isEducationInView, prefersReducedMotion)

  useEffect(() => {
    if (isInitialLoad) return
    if (prefersReducedMotion) {
      setHeroTextStage(2)
      return
    }

    setHeroTextStage(0)
    const timers: Array<ReturnType<typeof setTimeout>> = []
    timers.push(setTimeout(() => setHeroTextStage(1), HERO_ENTRANCE.textPanelDelay))
    timers.push(setTimeout(() => setHeroTextStage(2), HERO_ENTRANCE.textItemsDelay))

    return () => timers.forEach(clearTimeout)
  }, [isInitialLoad, prefersReducedMotion])

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
      <section className={`relative pb-8 sm:pb-12 pt-20 sm:pt-28${isInitialLoad ? '' : ' animate-fade-in'}`} suppressHydrationWarning>
        <div className="mx-auto max-w-[560px] hero-section relative z-10 px-4 sm:px-6 lg:px-0">
          <m.a
            href="/about"
            className="hero-handwritten-preview cursor-pointer focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 inline-block mb-10"
            initial="idle"
            whileHover="hover"
          >
            <span className="hero-handwritten-text hero-handwritten-text--no-underline font-handscript">
              <TextReveal
                text={homeHeroContent.handwrittenNote}
                as="span"
                trigger={heroTextStage >= 1}
                duration={0.5}
                staggerDelay={0.06}
                startDelay={0.1}
                filter
              />
              <m.span
                className="inline select-none ml-1.5"
                onClick={() => haptic.trigger('soft')}
                style={{ display: 'inline-flex', verticalAlign: 'text-top', position: 'relative', top: '-0.05em' }}
                variants={{
                  idle: {
                    rotate: 0,
                    scale: [null, 1.15, 1],
                    filter: [null, 'drop-shadow(0 0 10px rgba(255, 200, 50, 0.7))', 'drop-shadow(0 0 0px transparent)'],
                    transition: {
                      rotate: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                      scale: { duration: 0.6, times: [0, 0.3, 1], ease: 'easeOut' },
                      filter: { duration: 0.8, times: [0, 0.25, 1], ease: 'easeOut' },
                    },
                  },
                  hover: {
                    rotate: 360,
                    scale: 1.2,
                    filter: 'drop-shadow(0 0 6px rgba(255, 200, 50, 0.5))',
                    transition: { rotate: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }, scale: { type: 'spring', stiffness: 300, damping: 15 }, filter: { duration: 0.3 } },
                  },
                }}
                aria-hidden
              >
                <Sun size={16} strokeWidth={2} className="text-accent" />
              </m.span>
              <m.svg
                className="hero-ink-underline"
                viewBox="0 0 200 6"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden
              >
                <m.path
                  d="M1 3.5C20 2.2 40 4.8 60 3.1C80 1.4 100 4.6 120 3.3C140 2 160 4.2 180 3C190 2.4 197 3.8 199 3.2"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={underlineRevealed ? { pathLength: 1, opacity: 1 } : undefined}
                  variants={underlineRevealed ? undefined : {
                    idle: {
                      pathLength: 0,
                      opacity: 0,
                    },
                    hover: {
                      pathLength: 1,
                      opacity: 1,
                      strokeWidth: [1, 1.5, 1],
                      transition: {
                        pathLength: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: 0.12 },
                        strokeWidth: { duration: 0.8, ease: 'easeInOut' },
                      },
                    },
                  }}
                  onAnimationComplete={(variant) => {
                    if (variant === 'hover') setUnderlineRevealed(true)
                  }}
                />
              </m.svg>
            </span>
          </m.a>

          <div className="mb-6 flex items-start gap-3 sm:items-center sm:gap-4">
            <m.div
              initial={isInitialLoad ? false : {
                opacity: STAGGER_ITEM.initialOpacity,
                y: STAGGER_ITEM.initialY,
                scale: 0.94,
                filter: 'blur(6px)',
              }}
              animate={{ opacity: STAGGER_ITEM.finalOpacity, y: STAGGER_ITEM.finalY, scale: 1, filter: 'blur(0px)' }}
              transition={{
                duration: motionDurationMs(HERO_ENTRANCE.duration, prefersReducedMotion),
                delay: motionDelayMs(HERO_ENTRANCE.profileDelay, prefersReducedMotion),
                ease: STAGGER_PANEL.ease,
              }}
            >
              <div className="shrink-0 mask mask-squircle p-[2px] shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.06]" style={{ background: 'var(--border)' }}>
                <Image
                  src="/images/profilepicture.webp"
                  alt="Hunter Bastian"
                  width={72}
                  height={72}
                  className="h-16 w-16 mask mask-squircle object-cover sm:h-[72px] sm:w-[72px]"
                  sizes="72px"
                  priority
                />
              </div>
            </m.div>
            <div className="min-w-0">
              <h1
                className="text-foreground font-mono font-semibold text-[13px] leading-[1.2] tracking-[0.02em] sm:text-[14px]"
              >
                {homeHeroContent.headline}
              </h1>
              <p className="mt-1 font-mono text-[10px] font-normal tracking-[0.06em] text-foreground opacity-75 sm:text-[11px]">
                {homeHeroContent.subtitle}
              </p>
            </div>
          </div>

          <m.div
            className="mt-4 mb-8 sm:mt-5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.008] hover:-translate-y-0.5"
            initial={isInitialLoad ? false : {
              opacity: STAGGER_PANEL.initialOpacity,
              y: STAGGER_PANEL.initialY,
              filter: 'blur(6px)',
            }}
            animate={{
              opacity: heroTextStage >= 1 ? STAGGER_PANEL.finalOpacity : STAGGER_PANEL.initialOpacity,
              y: heroTextStage >= 1 ? STAGGER_PANEL.finalY : STAGGER_PANEL.initialY,
              filter: heroTextStage >= 1 ? 'blur(0px)' : 'blur(6px)',
            }}
            transition={{
              duration: motionDurationMs(STAGGER_TIMING.panelDuration, prefersReducedMotion),
              ease: STAGGER_PANEL.ease,
            }}
          >
            <p className="m-0 font-inter text-sm leading-relaxed text-muted-foreground">
              <TextReveal
                text="0 → 1 design engineer bringing motion, craft and detail to production."
                as="span"
                className="font-medium text-foreground/80"
                trigger={heroTextStage >= 2}
                duration={0.5}
                staggerDelay={0.04}
                startDelay={0.1}
              />
            </p>
            <p className="m-0 mt-2 font-inter text-sm leading-relaxed text-muted-foreground">
              <TextReveal
                text="Interaction Design student and Department Representative at UVU"
                as="span"
                trigger={heroTextStage >= 2}
                duration={0.5}
                staggerDelay={0.04}
                startDelay={0.5}
              />{' '}
              <TextReveal
                text="with experience designing and building digital products. I create experiences with craft and detail."
                as="span"
                trigger={heroTextStage >= 2}
                duration={0.5}
                staggerDelay={0.04}
                startDelay={0.9}
              />
            </p>
            <m.div
              className="mt-8"
              initial={isInitialLoad ? false : { opacity: 0, y: 8 }}
              animate={{
                opacity: heroTextStage >= 2 ? 1 : 0,
                y: heroTextStage >= 2 ? 0 : 8,
              }}
              transition={{
                duration: motionDurationMs(STAGGER_TIMING.panelDuration, prefersReducedMotion),
                delay: motionDelayMs(200, prefersReducedMotion),
                ease: STAGGER_PANEL.ease,
              }}
            >
              <div className="inline-block">
                <Magnetic strength={0.15} range={100} onlyOnHover disableOnTouch>
                  <m.a
                    href="#contact"
                    className="playground-joy group/contact relative overflow-hidden inline-flex items-center gap-2 rounded-full px-5 py-2.5 min-h-[44px] text-[11px] font-medium tracking-[0.06em] uppercase focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                    onClick={(e) => {
                      e.preventDefault()
                      haptic.trigger('light')
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    initial="idle"
                    whileHover={prefersReducedMotion ? undefined : 'hover'}
                    animate="idle"
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.93, y: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    variants={{ idle: { y: 0 }, hover: { y: -3 } }}
                  >
                    <m.span
                      className="relative z-10"
                      variants={prefersReducedMotion ? undefined : {
                        idle: { letterSpacing: '0.06em' },
                        hover: { letterSpacing: '0.1em', transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
                      }}
                    >
                      Contact
                    </m.span>
                    <m.span
                      className="relative z-10"
                      variants={prefersReducedMotion ? undefined : {
                        idle: { rotate: 0, scale: 1 },
                        hover: {
                          rotate: [0, -15, 10, -5, 0],
                          scale: 1.2,
                          transition: {
                            rotate: { duration: 0.5, ease: 'easeInOut' },
                            scale: { type: 'spring', stiffness: 500, damping: 12 },
                          },
                        },
                      }}
                    >
                      <ArrowDown size={13} aria-hidden />
                    </m.span>
                  </m.a>
                </Magnetic>
              </div>
            </m.div>
          </m.div>

        </div>
      </section>

      <CollapsibleSection
        id="case-studies"
        title="PROJECTS"
        isOpen={sectionOpen.caseStudies}
        initialLoadDelayMs={INITIAL_SECTION_LOAD_DELAY.caseStudies}
        skipContentStaging
        className="px-4 sm:px-6 lg:px-0 relative z-10"
        openClassName="py-16"
        closedClassName="py-5"
        contentClassName="mt-4 px-2 pb-6 space-y-8"
      >
        <Card className="mx-auto max-w-[560px] px-2 sm:px-3 overflow-visible" size="sm">
          {children}
        </Card>
        <div className="flex justify-start mx-auto max-w-[560px] pt-5">
          <Magnetic strength={0.15} range={100} onlyOnHover disableOnTouch>
            <PlaygroundButton />
          </Magnetic>
        </div>
      </CollapsibleSection>

      <div className="mx-auto max-w-[560px] px-4 sm:px-6 lg:px-0">
        <Separator className="bg-border/40" />
      </div>

      <CollapsibleSection
        id="creating"
        title="ENDEAVORS"
        isOpen={sectionOpen.creating}
        initialLoadDelayMs={INITIAL_SECTION_LOAD_DELAY.creating}
        className="px-4 sm:px-6 lg:px-0 relative z-10"
        openClassName="py-16"
        closedClassName="py-5"
        contentClassName="mt-4 pb-6"
      >
        <div className="mx-auto max-w-[560px] text-left">
          <ul className="space-y-2">
            {creatingLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="group inline-flex items-center gap-2 text-sm tracking-[0.06em] text-muted-foreground transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-accent min-h-[44px]"
                  aria-label={link.ariaLabel ?? link.label}
                  title={link.title ?? link.label}
                >
                  <span className="underline decoration-muted-foreground/30 underline-offset-4 decoration-[1px] transition-[text-decoration-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:decoration-accent">{link.label}</span>
                  {link.iconType === 'handshake' && (
                    <IconHandshake size={13} className="shrink-0 opacity-50 transition-[opacity,transform,filter] duration-300 ease-out group-hover:opacity-100 group-hover:scale-110 group-hover:blur-[0.3px]" aria-hidden />
                  )}
                  {link.iconType === 'studio-alpine' && (
                    <Image
                      src="/images/optimized/studio-alpine-logo.webp"
                      alt=""
                      width={50}
                      height={50}
                      className="h-[35px] w-[35px] shrink-0 dark:invert -ml-1 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-3"
                      aria-hidden
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </CollapsibleSection>
      </div>

      <div className="mx-auto max-w-[560px] px-4 sm:px-6 lg:px-0">
        <Separator className="bg-border/40" />
      </div>

      <CollapsibleSection
        id="experience"
        title="EXPERIENCE"
        isOpen={sectionOpen.experience}
        className="px-4 sm:px-6 lg:px-0"
        openClassName="py-16"
        closedClassName="py-5"
        contentClassName="mt-4 pb-6"
      >
        <div className="mx-auto max-w-[560px]">
          <MotionCard
            ref={experiencePanelRef}
            className="p-4 sm:p-5 space-y-2 section-card-glow overflow-visible"
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
                  key={`${job.company}-${index}`}
                  className="border-b border-border/60 py-3.5 last:border-b-0"
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
                    <span className="font-mono text-xs font-normal text-muted-foreground tabular-nums sm:min-w-[90px]">
                      <span className="block whitespace-nowrap">{displayYear.primary}</span>
                      {displayYear.secondary && (
                        <span className="block whitespace-nowrap leading-tight">{displayYear.secondary}</span>
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-mono text-[13px] font-semibold tracking-[0.04em] text-foreground">
                          {job.company}
                        </h3>
                      </div>
                      <p className="mt-0.5 font-inter text-xs font-normal text-muted-foreground">
                        {job.title}
                      </p>
                      <p className="mt-2.5 font-inter text-sm font-normal leading-relaxed text-muted-foreground">
                        {job.description}
                      </p>
                    </div>
                  </div>
                </m.div>
              )
            })}
          </MotionCard>
        </div>
      </CollapsibleSection>

      <div className="mx-auto max-w-[560px] px-4 sm:px-6 lg:px-0">
        <Separator className="bg-border/40" />
      </div>

      <CollapsibleSection
        id="education"
        title="EDUCATION"
        isOpen={sectionOpen.education}
        className="px-4 sm:px-6 lg:px-0"
        openClassName="py-16"
        closedClassName="py-5"
        contentClassName="mt-4 pb-6"
      >
        <div className="mx-auto max-w-[560px]">
          <MotionCard
            ref={educationPanelRef}
            className="p-5 space-y-5 section-card-glow overflow-visible"
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
                className="border-b border-border/60 pb-5 last:border-b-0 last:pb-0"
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
                  <div className="font-mono text-xs font-normal text-muted-foreground tabular-nums sm:min-w-[100px]">
                    {edu.year}
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-0.5 font-mono text-[13px] font-semibold tracking-[0.04em] text-foreground">
                      {edu.institution}
                    </h3>
                    <p className="mb-0.5 font-inter text-sm font-normal text-foreground">
                      {edu.degree}
                    </p>
                    <p className="font-inter text-sm font-normal text-muted-foreground">
                      {edu.level}
                    </p>
                    {edu.note && (
                      <p
                        className="mt-3 font-mono text-xs font-normal tracking-[0.08em] text-muted-foreground"
                        style={{ opacity: 0.7 }}
                      >
                        {edu.note}
                      </p>
                    )}
                  </div>
                </div>
              </m.div>
            ))}
          </MotionCard>
        </div>
      </CollapsibleSection>

      <div className="mx-auto max-w-[560px] px-4 sm:px-6 lg:px-0">
        <Separator className="bg-border/40" />
      </div>

      <CollapsibleSection
        id="contact"
        title="CONTACT"
        isOpen={sectionOpen.contact}
        className="px-4 sm:px-6 lg:px-0"
        openClassName="pt-16 pb-24 sm:pb-32"
        closedClassName="py-5"
        contentClassName="mt-4"
      >
        <div className="mx-auto max-w-[560px]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 font-mono text-[14px] font-normal tracking-[0.02em] sm:gap-x-5 sm:gap-y-2 sm:text-[15px]">
            {contactSocialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="text-[13px] text-muted-foreground/60 underline decoration-muted-foreground/30 underline-offset-4 decoration-[1px] transition-[color,opacity,text-decoration-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-accent hover:decoration-accent inline-flex items-center min-h-[44px] min-w-[44px] justify-center"
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
