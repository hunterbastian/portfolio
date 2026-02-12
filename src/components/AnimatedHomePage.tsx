'use client'

import dynamic from 'next/dynamic'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { CentralIcon, type CentralIconName } from '@/icons'
import { MOTION_EASE_STANDARD, motionDelayMs, motionDurationMs } from '@/lib/motion'
import ResumePreview from './ResumePreview'
import TextType from './TextType'
import CollapsibleSection from './CollapsibleSection'

const ResumeModal = dynamic(() => import('./ResumeModal'), { ssr: false })

interface AnimatedHomePageProps {
  children: ReactNode
}

interface ExperienceItem {
  year: string
  company: string
  title: string
  description: string
}

interface EducationItem {
  year: string
  institution: string
  degree: string
  level: string
  note?: string
}

interface ContactLinkItem {
  label: string
  href: string
  iconName: CentralIconName
}

type ContactHoverStyle = 'dark' | 'light'

type SectionKey = 'creating' | 'caseStudies' | 'experience' | 'education' | 'everydayTech' | 'techStack'
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
  everydayTech: true,
  techStack: true,
}

const HREF_TO_SECTION_KEY: Record<string, SectionKey> = {
  '#creating': 'creating',
  '#case-studies': 'caseStudies',
  '#experience': 'experience',
  '#education': 'education',
  '#everyday-tech': 'everydayTech',
  '#tech-stack': 'techStack',
}

const INITIAL_SECTION_LOAD_DELAY = {
  creating: 220,
  caseStudies: 440,
} as const

const contactGlassActionBaseClassName =
  'group inline-flex h-9 items-center justify-center gap-1.5 rounded-[12px] border border-white/55 bg-[linear-gradient(155deg,rgba(255,255,255,0.74),rgba(255,255,255,0.38))] px-3 text-foreground no-underline shadow-[0_10px_22px_rgba(15,23,42,0.14)] backdrop-blur-[14px] transition-[transform,background,border-color,color,box-shadow] duration-[420ms] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/75 sm:h-10 sm:px-3.5'

const contactGlassActionHoverClassNames: Record<ContactHoverStyle, string> = {
  dark: 'hover:scale-[1.12] hover:border-black/45 hover:bg-[linear-gradient(155deg,rgba(46,52,64,0.9),rgba(59,66,82,0.84))] hover:text-white hover:shadow-[0_16px_34px_rgba(15,23,42,0.34)] active:scale-[0.98]',
  light:
    'hover:scale-[1.12] hover:border-white/95 hover:bg-[linear-gradient(155deg,rgba(255,255,255,0.98),rgba(255,255,255,0.84))] hover:text-black hover:shadow-[0_0_0_1px_rgba(255,255,255,0.75),0_18px_40px_rgba(255,255,255,0.62)] active:scale-[0.98]',
}

const contactIconGlyphClassName = 'h-[13px] w-[13px] sm:h-[14px] sm:w-[14px]'

const experience: ExperienceItem[] = [
  {
    year: '2026 - Present',
    company: 'Studio Alpine',
    title: 'Founder',
    description:
      "Founder of Studio Alpine. I am at the front of a visionary studio that involves photography and design. I'm excited to see where this will go into the future.",
  },
  {
    year: '2024 - Present',
    company: 'Catapult',
    title: 'Video Producer',
    description:
      'Produce and edit marketing videos for Catapult products including banner stands, from planning and filming to post-production in Final Cut Pro. Deliver optimized content for YouTube to support marketing campaigns and ensure alignment with brand standards.',
  },
  {
    year: '2024 - Present',
    company: 'Utah Valley University',
    title: 'Department Representative',
    description:
      'Helped new students with internship opportunities, helping design students in the Web Design and Development program, working on ongoing topics and issues within our department. Responsibilities include finding internship opportunities for students and assisting at school sponsored events, as well as content creation for UVU CET social media and marketing.',
  },
  {
    year: '2023',
    company: 'Nutricost',
    title: 'Graphic Design Intern',
    description:
      'At Nutricost, I assisted the marketing team and strengthened my knowledge as I worked in the graphic design queue. Assisted the marketing team with their design queue and helped with production. Edited product mockups in Photoshop and Illustrator for Nutricost online product images. Worked on and edited Amazon online product images.',
  },
  {
    year: '2017',
    company: 'Clutch.',
    title: 'Digital Design Intern',
    description:
      'At Clutch, I helped with design branding and further improved my knowledge about the UX design process.',
  },
]

const education: EducationItem[] = [
  {
    year: '2023 - 2027',
    institution: 'Utah Valley University',
    degree: 'Interaction Design',
    level: "Bachelor's Degree",
  },
  {
    year: '2021',
    institution: 'Columbus State Community College',
    degree: 'Graphic Design',
    level: "Associate's Degree",
    note: 'TRANSFERRED TO UVU',
  },
  {
    year: '2021',
    institution: 'Google',
    degree: 'IT Support Professional Certificate',
    level: 'Issued in 2021',
  },
]

const everydayTech = [
  'iPhone 15 Pro Natural Titanium',
  'MacBook Air 15" M2 Starlight',
  'Apple Trackpad & Logitech G502',
  'AirPods Pro 2',
  'IKEA Desk',
  'Apple Watch',
  'Wishlist: Apple Studio Display',
  'Wishlist: Keychron K3',
]

const skills = ['Figma', 'Framer', 'ChatGPT', 'Codex', 'Claude Code']

const contactLinks: ContactLinkItem[] = [
  { label: 'Instagram', href: 'https://instagram.com/studio.alpine', iconName: 'IconInstagram' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/hunterbastian', iconName: 'IconLinkedin' },
  { label: 'Twitter', href: 'https://x.com/thestudioalpine', iconName: 'IconTwitter' },
  { label: 'GitHub', href: 'https://github.com/hunterbastian', iconName: 'IconGithub' },
]

const resumeIconName: CentralIconName = 'IconFileText'
const HERO_HEADLINE_TEXT = 'Hunter Bastian // Studio Alpine'
const HERO_SUBTITLE_TEXT = 'Interaction Designer - Lehi, Utah'

const HERO_TYPING = {
  headline: 62, // keep current speed
}

const HERO_ENTRANCE = {
  profileDelay: 80, // profile appears first
  textPanelDelay: 120, // align with section panel reveal
  textItemsDelay: 280, // align with section item reveal
  contactIconsDelay: 360, // icon row settles after intro copy
  duration: 420, // reveal transition duration
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
  panelAppear: 120, // panel starts appearing
  itemsAppear: 280, // items begin staggered reveal
  panelDuration: 380, // panel transition duration
  itemDuration: 420, // each item transition duration
  itemStagger: 90, // stagger gap between items
}

const STAGGER_PANEL = {
  initialOpacity: 0, // hidden before stage 1
  finalOpacity: 1, // visible at rest
  initialY: 14, // panel vertical offset before reveal
  finalY: 0, // resting panel position
  initialBlur: 'blur(1.8px)', // softened before reveal
  finalBlur: 'blur(0px)', // crisp at rest
  ease: MOTION_EASE_STANDARD,
}

const STAGGER_ITEM = {
  initialOpacity: 0, // hidden item before stage 2
  finalOpacity: 1, // visible item at rest
  initialY: 16, // item vertical offset before reveal
  finalY: 0, // resting item position
}

const EXPERIENCE_TIMING = {
  expandDuration: 320, // row detail expand/collapse duration
  iconRotate: 240, // plus icon rotate duration
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

function ContactIcon({ iconName, label, className = 'h-5 w-5' }: { iconName: CentralIconName; label: string; className?: string }) {
  return <CentralIcon name={iconName} size={20} className={className} aria-label={label} />
}

function ContactLink({ link, actionClassName }: { link: ContactLinkItem; actionClassName: string }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={actionClassName}
      aria-label={link.label}
      title={link.label}
    >
      <ContactIcon iconName={link.iconName} label={link.label} className={contactIconGlyphClassName} />
      <span className="font-code text-[11px] tracking-[0.08em] underline underline-offset-[5px] decoration-[1px]">
        {link.label}
      </span>
    </a>
  )
}

export default function AnimatedHomePage({ children }: AnimatedHomePageProps) {
  const [showResumePreview, setShowResumePreview] = useState(false)
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [contactHoverStyle, setContactHoverStyle] = useState<ContactHoverStyle>('dark')
  const [expandedJobs, setExpandedJobs] = useState<Set<number>>(new Set())
  const [sectionOpen, setSectionOpen] = useState<SectionOpenState>(DEFAULT_SECTION_OPEN_STATE)
  const [heroTextStage, setHeroTextStage] = useState(0)
  const prefersReducedMotion = useReducedMotion() ?? false

  const resumeButtonRef = useRef<HTMLButtonElement>(null)
  const experiencePanelRef = useRef<HTMLDivElement>(null)
  const educationPanelRef = useRef<HTMLDivElement>(null)
  const everydayPanelRef = useRef<HTMLDivElement>(null)
  const stackPanelRef = useRef<HTMLDivElement>(null)

  const isExperienceInView = useInView(experiencePanelRef, { once: true, margin: '-120px 0px -120px 0px' })
  const isEducationInView = useInView(educationPanelRef, { once: true, margin: '-120px 0px -120px 0px' })
  const isEverydayInView = useInView(everydayPanelRef, { once: true, margin: '-120px 0px -120px 0px' })
  const isStackInView = useInView(stackPanelRef, { once: true, margin: '-120px 0px -120px 0px' })

  const experienceStage = useSectionStage(sectionOpen.experience, isExperienceInView, prefersReducedMotion)
  const educationStage = useSectionStage(sectionOpen.education, isEducationInView, prefersReducedMotion)
  const everydayStage = useSectionStage(sectionOpen.everydayTech, isEverydayInView, prefersReducedMotion)
  const stackStage = useSectionStage(sectionOpen.techStack, isStackInView, prefersReducedMotion)
  const contactGlassActionClassName = `${contactGlassActionBaseClassName} ${contactGlassActionHoverClassNames[contactHoverStyle]}`

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

  const toggleSection = (section: SectionKey) => {
    setSectionOpen((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const toggleJob = (index: number) => {
    setExpandedJobs((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <div className="pointer-events-none fixed left-3 top-1/2 z-[80] -translate-y-1/2">
        <div className="pointer-events-auto flex flex-col gap-1 rounded-xl border border-white/45 bg-[linear-gradient(155deg,rgba(255,255,255,0.72),rgba(255,255,255,0.38))] p-2 shadow-[0_10px_22px_rgba(15,23,42,0.2)] backdrop-blur-[14px]">
          <span className="px-1 pb-0.5 font-code text-[9px] tracking-[0.14em] text-muted-foreground">ICON HOVER</span>
          <button
            type="button"
            className={`rounded-md border px-2 py-1 font-code text-[10px] tracking-[0.12em] transition-colors ${
              contactHoverStyle === 'dark'
                ? 'border-black/30 bg-black/75 text-white'
                : 'border-transparent bg-transparent text-muted-foreground hover:border-border/70 hover:text-foreground'
            }`}
            onClick={() => setContactHoverStyle('dark')}
            aria-pressed={contactHoverStyle === 'dark'}
          >
            DARK
          </button>
          <button
            type="button"
            className={`rounded-md border px-2 py-1 font-code text-[10px] tracking-[0.12em] transition-colors ${
              contactHoverStyle === 'light'
                ? 'border-white/90 bg-white text-black'
                : 'border-transparent bg-transparent text-muted-foreground hover:border-border/70 hover:text-foreground'
            }`}
            onClick={() => setContactHoverStyle('light')}
            aria-pressed={contactHoverStyle === 'light'}
          >
            LIGHT
          </button>
        </div>
      </div>

      <section className="relative animate-fade-in pb-0 pt-8 sm:pt-12">
        <div className="max-w-2xl mx-auto hero-section relative z-10 px-4 sm:px-6 lg:px-0">
          <div className="mb-6 flex items-start gap-3 sm:items-center sm:gap-4">
            <motion.div
              initial={{ opacity: STAGGER_ITEM.initialOpacity, y: STAGGER_ITEM.initialY, scale: 0.94, filter: 'blur(1.2px)' }}
              animate={{ opacity: STAGGER_ITEM.finalOpacity, y: STAGGER_ITEM.finalY, scale: 1, filter: 'blur(0px)' }}
              transition={{
                duration: motionDurationMs(HERO_ENTRANCE.duration, prefersReducedMotion),
                delay: motionDelayMs(HERO_ENTRANCE.profileDelay, prefersReducedMotion),
                ease: STAGGER_PANEL.ease,
              }}
            >
              <Image
                src="/images/profilepicture.jpg"
                alt="Hunter Bastian // Studio Alpine"
                width={72}
                height={72}
                className="h-16 w-16 shrink-0 rounded-full border border-border object-cover shadow-sm sm:h-[72px] sm:w-[72px]"
                priority
              />
            </motion.div>
            <div className="min-w-0">
              <h1 className="text-foreground font-garamond-narrow font-semibold text-[clamp(0.95rem,4vw,1.53rem)] leading-tight">
                <TextType
                  text={HERO_HEADLINE_TEXT}
                  className="block"
                  typingSpeed={HERO_TYPING.headline}
                  deletingSpeed={44}
                  pauseDuration={2800}
                  loop={false}
                  cinematic
                />
              </h1>
              <motion.div
                className="font-code text-muted-foreground mt-2 text-[11px] tracking-[0.12em] sm:text-xs"
                initial={{ opacity: STAGGER_ITEM.initialOpacity, y: STAGGER_ITEM.initialY, filter: 'blur(1.2px)' }}
                animate={{
                  opacity: heroTextStage >= 2 ? STAGGER_ITEM.finalOpacity : STAGGER_ITEM.initialOpacity,
                  y: heroTextStage >= 2 ? STAGGER_ITEM.finalY : STAGGER_ITEM.initialY,
                  filter: heroTextStage >= 2 ? 'blur(0px)' : 'blur(1.2px)',
                }}
                transition={{
                  duration: motionDurationMs(STAGGER_TIMING.itemDuration, prefersReducedMotion),
                  delay: heroTextStage >= 2 ? motionDelayMs(0, prefersReducedMotion) : 0,
                  ease: STAGGER_PANEL.ease,
                }}
              >
                <span>{HERO_SUBTITLE_TEXT}</span>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: STAGGER_PANEL.initialOpacity, y: STAGGER_PANEL.initialY, filter: 'blur(1.8px)' }}
            animate={{
              opacity: heroTextStage >= 1 ? STAGGER_PANEL.finalOpacity : STAGGER_PANEL.initialOpacity,
              y: heroTextStage >= 1 ? STAGGER_PANEL.finalY : STAGGER_PANEL.initialY,
              filter: heroTextStage >= 1 ? STAGGER_PANEL.finalBlur : STAGGER_PANEL.initialBlur,
            }}
            transition={{
              duration: motionDurationMs(STAGGER_TIMING.panelDuration, prefersReducedMotion),
              ease: STAGGER_PANEL.ease,
            }}
            style={{ willChange: 'opacity, transform, filter' }}
          >
            <motion.p
              className="text-muted-foreground text-sm font-garamond-narrow leading-relaxed m-0"
              initial={{ opacity: STAGGER_ITEM.initialOpacity, y: STAGGER_ITEM.initialY, filter: 'blur(1.2px)' }}
              animate={{
                opacity: heroTextStage >= 2 ? STAGGER_ITEM.finalOpacity : STAGGER_ITEM.initialOpacity,
                y: heroTextStage >= 2 ? STAGGER_ITEM.finalY : STAGGER_ITEM.initialY,
                filter: heroTextStage >= 2 ? 'blur(0px)' : 'blur(1.2px)',
              }}
              transition={{
                duration: motionDurationMs(STAGGER_TIMING.itemDuration, prefersReducedMotion),
                delay: heroTextStage >= 2 ? motionDelayMs(STAGGER_TIMING.itemStagger, prefersReducedMotion) : 0,
                ease: STAGGER_PANEL.ease,
              }}
            >
              Interaction Design student at UVU with experience designing and building digital products. I work in front-end
              code, and I&apos;m focused on clear, meaningful interfaces with an AI-first mindset. I am also a founder at{' '}
              <span className="font-semibold text-primary">Studio Alpine</span>.
            </motion.p>
          </motion.div>

          <motion.div
            className="mt-4 flex flex-wrap items-center gap-2.5 sm:mt-5 sm:gap-3"
            initial={{ opacity: STAGGER_PANEL.initialOpacity, y: STAGGER_PANEL.initialY, filter: 'blur(1.4px)' }}
            animate={{ opacity: STAGGER_PANEL.finalOpacity, y: STAGGER_PANEL.finalY, filter: 'blur(0px)' }}
            transition={{
              duration: motionDurationMs(HERO_ENTRANCE.duration, prefersReducedMotion),
              delay: motionDelayMs(HERO_ENTRANCE.contactIconsDelay, prefersReducedMotion),
              ease: STAGGER_PANEL.ease,
            }}
          >
            {contactLinks.map((link, index) => (
              <motion.div
                key={link.label}
                initial={{ opacity: STAGGER_ITEM.initialOpacity, y: STAGGER_ITEM.initialY }}
                animate={{ opacity: STAGGER_ITEM.finalOpacity, y: STAGGER_ITEM.finalY }}
                transition={{
                  duration: motionDurationMs(STAGGER_TIMING.itemDuration, prefersReducedMotion),
                  delay: motionDelayMs(
                    HERO_ENTRANCE.contactIconsDelay + index * STAGGER_TIMING.itemStagger,
                    prefersReducedMotion
                  ),
                  ease: STAGGER_PANEL.ease,
                }}
              >
                <ContactLink link={link} actionClassName={contactGlassActionClassName} />
              </motion.div>
            ))}

            <motion.div
              className="relative overflow-visible"
              initial={{ opacity: STAGGER_ITEM.initialOpacity, y: STAGGER_ITEM.initialY }}
              animate={{ opacity: STAGGER_ITEM.finalOpacity, y: STAGGER_ITEM.finalY }}
              transition={{
                duration: motionDurationMs(STAGGER_TIMING.itemDuration, prefersReducedMotion),
                delay: motionDelayMs(
                  HERO_ENTRANCE.contactIconsDelay + contactLinks.length * STAGGER_TIMING.itemStagger,
                  prefersReducedMotion
                ),
                ease: STAGGER_PANEL.ease,
              }}
            >
              <button
                ref={resumeButtonRef}
                type="button"
                onClick={() => setShowResumeModal(true)}
                className={contactGlassActionClassName}
                onMouseEnter={() => setShowResumePreview(true)}
                onMouseLeave={() => setShowResumePreview(false)}
                onFocus={() => setShowResumePreview(true)}
                onBlur={() => setShowResumePreview(false)}
                aria-label="Resume"
                title="Resume"
              >
                <ContactIcon iconName={resumeIconName} label="Resume" className={contactIconGlyphClassName} />
                <span className="font-code text-[11px] tracking-[0.08em] underline underline-offset-[5px] decoration-[1px]">
                  Resume
                </span>
              </button>
              <ResumePreview isVisible={showResumePreview} anchorRef={resumeButtonRef} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <CollapsibleSection
        id="creating"
        title="Creating"
        isOpen={sectionOpen.creating}
        onToggle={() => toggleSection('creating')}
        initialLoadDelayMs={INITIAL_SECTION_LOAD_DELAY.creating}
        className="px-4 sm:px-6 lg:px-0 relative z-10"
        openClassName="py-12"
        closedClassName="py-5"
        contentClassName="mt-4"
      >
        <div className="max-w-2xl mx-auto text-left">
          <a
            href="https://instagram.com/studio.alpine"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-wrap items-center gap-1.5 text-sm font-code font-medium uppercase tracking-[0.08em] text-muted-foreground underline underline-offset-4 hover:text-primary"
          >
            <CentralIcon name="IconCamera1" size={14} aria-hidden className="h-3.5 w-3.5 shrink-0" />
            <span>Photography Studio: Studio Alpine</span>
          </a>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        id="case-studies"
        title="Case Studies"
        isOpen={sectionOpen.caseStudies}
        onToggle={() => toggleSection('caseStudies')}
        initialLoadDelayMs={INITIAL_SECTION_LOAD_DELAY.caseStudies}
        className="px-4 sm:px-6 lg:px-0 relative z-10"
        openClassName="pt-12 pb-12"
        closedClassName="pt-5 pb-5"
        contentClassName="mt-4 space-y-8"
      >
        <div className="mx-auto max-w-4xl rounded-[22px] border border-border/45 bg-card/30 px-3 py-5 sm:px-5 sm:py-6">
          {children}
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-0">
          <div className="flex justify-start mt-8">
            <a
              href="/archive"
              className="social-button nord-button inline-flex items-center justify-center gap-1.5 rounded-sm px-4 py-2 text-xs font-medium transition-transform transition-shadow duration-500 relative overflow-hidden hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="font-code font-light uppercase tracking-[0.08em] relative z-10">Other</span>
            </a>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        id="experience"
        title="Experience"
        isOpen={sectionOpen.experience}
        onToggle={() => toggleSection('experience')}
        className="px-4 sm:px-6 lg:px-0"
        openClassName="py-12"
        closedClassName="py-5"
        contentClassName="mt-4"
      >
        <div className="max-w-2xl mx-auto">
          <motion.div
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
            {experience.map((job, index) => {
              const isExpanded = expandedJobs.has(index)

              return (
                <motion.div
                  key={job.company}
                  className="border-b border-border last:border-b-0"
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
                  <button
                    type="button"
                    className={`group flex w-full items-center justify-between rounded-md border px-2 py-3.5 text-left transition-[background-color,border-color,color] duration-300 ${
                      isExpanded
                        ? 'border-[color-mix(in_srgb,var(--accent)_45%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)]'
                        : 'border-transparent hover:border-[color-mix(in_srgb,var(--accent)_45%,var(--border))] hover:bg-[color-mix(in_srgb,var(--accent)_14%,transparent)]'
                    }`}
                    onClick={() => toggleJob(index)}
                  >
                    <div className="flex items-center space-x-6">
                      <span
                        className={`text-xs font-code w-16 transition-colors duration-300 ${
                          isExpanded ? 'text-foreground/80' : 'text-muted-foreground group-hover:text-foreground/80'
                        }`}
                      >
                        {job.year}
                      </span>
                      <span className="font-code font-medium tracking-[0.06em]">{job.company}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`text-sm font-code tracking-[0.06em] hidden sm:block transition-colors duration-300 ${
                          isExpanded ? 'text-foreground/80' : 'text-muted-foreground group-hover:text-foreground/80'
                        }`}
                      >
                        {job.title}
                      </span>
                      <motion.div
                        className={`w-5 h-5 flex items-center justify-center transition-[transform,color] duration-[400ms] ${
                          isExpanded ? 'text-foreground/80' : 'text-muted-foreground group-hover:text-foreground/80'
                        }`}
                        animate={{ rotate: isExpanded ? 45 : 0 }}
                        transition={{
                          duration: motionDurationMs(EXPERIENCE_TIMING.iconRotate, prefersReducedMotion),
                          ease: MOTION_EASE_STANDARD,
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </motion.div>
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{
                          duration: motionDurationMs(EXPERIENCE_TIMING.expandDuration, prefersReducedMotion),
                          ease: MOTION_EASE_STANDARD,
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 pl-2 sm:pl-[5.5rem] pr-2">
                          <p className="text-muted-foreground text-sm font-inter leading-relaxed">{job.description}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        id="education"
        title="Education"
        isOpen={sectionOpen.education}
        onToggle={() => toggleSection('education')}
        className="px-4 sm:px-6 lg:px-0"
        openClassName="py-12"
        closedClassName="py-5"
        contentClassName="mt-4"
      >
        <div className="max-w-2xl mx-auto">
          <motion.div
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
            {education.map((edu, index) => (
              <motion.div
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
                  <div className="text-muted-foreground text-xs font-code sm:min-w-[100px]">{edu.year}</div>
                  <div className="flex-1">
                    <h3 className="font-code font-semibold text-foreground text-base mb-1 tracking-[0.06em]">{edu.institution}</h3>
                    <p className="text-foreground text-sm font-code mb-1 tracking-[0.06em]">{edu.degree}</p>
                    <p className="text-muted-foreground text-sm font-code tracking-[0.06em]">{edu.level}</p>
                    {edu.note && (
                      <p className="text-muted-foreground text-xs mt-1 font-code tracking-[0.08em]" style={{ opacity: 0.7 }}>
                        {edu.note}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        id="everyday-tech"
        title="Everyday Tech"
        isOpen={sectionOpen.everydayTech}
        onToggle={() => toggleSection('everydayTech')}
        className="px-4 sm:px-6 lg:px-0"
        openClassName="py-10"
        closedClassName="py-5"
        contentClassName="mt-4"
      >
        <div className="max-w-2xl mx-auto">
          <motion.div
            ref={everydayPanelRef}
            className="flex flex-wrap justify-start gap-x-8 gap-y-4"
            initial={{ opacity: STAGGER_PANEL.initialOpacity, y: STAGGER_PANEL.initialY }}
            animate={{
              opacity: everydayStage >= 1 ? STAGGER_PANEL.finalOpacity : STAGGER_PANEL.initialOpacity,
              y: everydayStage >= 1 ? STAGGER_PANEL.finalY : STAGGER_PANEL.initialY,
            }}
            transition={{
              duration: motionDurationMs(STAGGER_TIMING.panelDuration, prefersReducedMotion),
              ease: STAGGER_PANEL.ease,
            }}
          >
            {everydayTech.map((item, index) => (
              <motion.div
                key={item}
                className="text-left"
                initial={{ opacity: STAGGER_ITEM.initialOpacity, y: STAGGER_ITEM.initialY }}
                animate={{
                  opacity: everydayStage >= 2 ? STAGGER_ITEM.finalOpacity : STAGGER_ITEM.initialOpacity,
                  y: everydayStage >= 2 ? STAGGER_ITEM.finalY : STAGGER_ITEM.initialY,
                }}
                transition={{
                  duration: motionDurationMs(STAGGER_TIMING.itemDuration, prefersReducedMotion),
                  delay: everydayStage >= 2 ? motionDelayMs(index * STAGGER_TIMING.itemStagger, prefersReducedMotion) : 0,
                  ease: STAGGER_PANEL.ease,
                }}
              >
                <span
                  className={`text-sm font-code tracking-[0.08em] uppercase font-medium ${
                    item.startsWith('Wishlist:') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        id="tech-stack"
        title="Stack"
        isOpen={sectionOpen.techStack}
        onToggle={() => toggleSection('techStack')}
        className="px-4 sm:px-6 lg:px-0"
        openClassName="py-12"
        closedClassName="py-5"
        contentClassName="mt-4"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            ref={stackPanelRef}
            className="flex flex-wrap justify-start gap-x-6 gap-y-3 max-w-2xl mx-auto"
            initial={{ opacity: STAGGER_PANEL.initialOpacity, y: STAGGER_PANEL.initialY }}
            animate={{
              opacity: stackStage >= 1 ? STAGGER_PANEL.finalOpacity : STAGGER_PANEL.initialOpacity,
              y: stackStage >= 1 ? STAGGER_PANEL.finalY : STAGGER_PANEL.initialY,
            }}
            transition={{
              duration: motionDurationMs(STAGGER_TIMING.panelDuration, prefersReducedMotion),
              ease: STAGGER_PANEL.ease,
            }}
          >
            {skills.map((skill, index) => (
              <motion.div
                key={skill}
                className="text-center"
                initial={{ opacity: STAGGER_ITEM.initialOpacity, y: STAGGER_ITEM.initialY }}
                animate={{
                  opacity: stackStage >= 2 ? STAGGER_ITEM.finalOpacity : STAGGER_ITEM.initialOpacity,
                  y: stackStage >= 2 ? STAGGER_ITEM.finalY : STAGGER_ITEM.initialY,
                }}
                transition={{
                  duration: motionDurationMs(STAGGER_TIMING.itemDuration, prefersReducedMotion),
                  delay: stackStage >= 2 ? motionDelayMs(index * STAGGER_TIMING.itemStagger, prefersReducedMotion) : 0,
                  ease: STAGGER_PANEL.ease,
                }}
              >
                <span className="text-sm font-code text-muted-foreground tracking-[0.08em] uppercase font-medium">
                  {skill}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </CollapsibleSection>

      <ResumeModal isOpen={showResumeModal} onClose={() => setShowResumeModal(false)} />
    </div>
  )
}
