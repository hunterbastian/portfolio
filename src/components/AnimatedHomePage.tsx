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

type SectionKey = 'contact' | 'creating' | 'caseStudies' | 'experience' | 'education' | 'everydayTech' | 'techStack'
type SectionOpenState = Record<SectionKey, boolean>

interface SectionNavigateDetail {
  href: string
}

const SECTION_NAV_EVENT = 'hb:section-navigate'

const DEFAULT_SECTION_OPEN_STATE: SectionOpenState = {
  contact: true,
  creating: true,
  caseStudies: true,
  experience: true,
  education: true,
  everydayTech: true,
  techStack: true,
}

const HREF_TO_SECTION_KEY: Record<string, SectionKey> = {
  '#contact': 'contact',
  '#creating': 'creating',
  '#case-studies': 'caseStudies',
  '#experience': 'experience',
  '#education': 'education',
  '#everyday-tech': 'everydayTech',
  '#tech-stack': 'techStack',
}

const desktopContactActionClassName =
  'hidden md:inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-sm transition-all duration-[420ms] hover:-translate-y-0.5 hover:border-primary/45 hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'

const mobileContactActionClassName =
  'inline-flex md:hidden h-11 w-full items-center justify-start gap-2.5 rounded-md border border-border bg-card/88 px-3 text-foreground shadow-sm transition-all duration-[420ms] hover:border-primary/45 hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'

const mobileContactLabelClassName =
  'font-code text-[10px] tracking-[0.1em] uppercase text-muted-foreground transition-colors duration-300 group-hover:text-foreground'

const experience: ExperienceItem[] = [
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
  { label: 'X', href: 'https://x.com/thestudioalpine', iconName: 'IconX' },
  { label: 'GitHub', href: 'https://github.com/hunterbastian', iconName: 'IconGithub' },
  { label: 'Dribbble', href: 'https://dribbble.com/hunterbastian', iconName: 'IconDribbble' },
]

const resumeIconName: CentralIconName = 'IconFileText'

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

function ContactLink({ link }: { link: ContactLinkItem }) {
  return (
    <>
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`group ${mobileContactActionClassName}`}
        aria-label={`Social media icon ${link.label}`}
      >
        <ContactIcon iconName={link.iconName} label={link.label} className="h-4 w-4 shrink-0" />
        <span className={mobileContactLabelClassName}>Social media icon {link.label}</span>
      </a>
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={desktopContactActionClassName}
        aria-label={link.label}
        title={link.label}
      >
        <ContactIcon iconName={link.iconName} label={link.label} />
        <span className="sr-only">{link.label}</span>
      </a>
    </>
  )
}

export default function AnimatedHomePage({ children }: AnimatedHomePageProps) {
  const [showResumePreview, setShowResumePreview] = useState(false)
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [expandedJobs, setExpandedJobs] = useState<Set<number>>(new Set())
  const [sectionOpen, setSectionOpen] = useState<SectionOpenState>(DEFAULT_SECTION_OPEN_STATE)
  const prefersReducedMotion = useReducedMotion() ?? false

  const contactPanelRef = useRef<HTMLDivElement>(null)
  const resumeButtonRef = useRef<HTMLButtonElement>(null)
  const experiencePanelRef = useRef<HTMLDivElement>(null)
  const educationPanelRef = useRef<HTMLDivElement>(null)
  const everydayPanelRef = useRef<HTMLDivElement>(null)
  const stackPanelRef = useRef<HTMLDivElement>(null)

  const isContactInView = useInView(contactPanelRef, { once: true, margin: '-120px 0px -120px 0px' })
  const isExperienceInView = useInView(experiencePanelRef, { once: true, margin: '-120px 0px -120px 0px' })
  const isEducationInView = useInView(educationPanelRef, { once: true, margin: '-120px 0px -120px 0px' })
  const isEverydayInView = useInView(everydayPanelRef, { once: true, margin: '-120px 0px -120px 0px' })
  const isStackInView = useInView(stackPanelRef, { once: true, margin: '-120px 0px -120px 0px' })

  const contactStage = useSectionStage(sectionOpen.contact, isContactInView, prefersReducedMotion)
  const experienceStage = useSectionStage(sectionOpen.experience, isExperienceInView, prefersReducedMotion)
  const educationStage = useSectionStage(sectionOpen.education, isEducationInView, prefersReducedMotion)
  const everydayStage = useSectionStage(sectionOpen.everydayTech, isEverydayInView, prefersReducedMotion)
  const stackStage = useSectionStage(sectionOpen.techStack, isStackInView, prefersReducedMotion)

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
      <section className="relative animate-fade-in pb-0 pt-8 sm:pt-12">
        <div className="max-w-2xl mx-auto hero-section relative z-10 px-4 sm:px-6 lg:px-0">
          <div className="mb-6 flex items-start gap-3 sm:items-center sm:gap-4">
            <Image
              src="/images/profilepicture.jpg"
              alt="Hunter Bastian // Studio Alpine"
              width={72}
              height={72}
              className="h-16 w-16 shrink-0 rounded-full border border-border object-cover shadow-sm sm:h-[72px] sm:w-[72px]"
              priority
            />
            <div>
              <h1 className="text-foreground font-garamond-narrow font-semibold text-[clamp(0.95rem,4vw,1.53rem)] leading-tight">
                <TextType
                  text="Hunter Bastian // Studio Alpine"
                  className="block"
                  typingSpeed={62}
                  deletingSpeed={44}
                  pauseDuration={2800}
                  loop={false}
                  cinematic
                />
              </h1>
              <div className="font-code text-muted-foreground mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] tracking-[0.12em] sm:text-xs">
                <span>Interaction Designer</span>
                <span className="hidden opacity-50 sm:inline">|</span>
                <span>Lehi, UT</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground text-sm font-garamond-narrow leading-relaxed m-0">
              Interaction Design student at UVU with experience designing and building digital products. I work in front-end
              code, and I&apos;m focused on clear, meaningful interfaces with an AI-first mindset. I am also a founder at{' '}
              <span className="font-semibold text-primary">Studio Alpine</span>.
            </p>
          </div>
        </div>
      </section>

      <CollapsibleSection
        id="contact"
        title="Contact"
        isOpen={sectionOpen.contact}
        onToggle={() => toggleSection('contact')}
        className="px-4 sm:px-6 lg:px-0 relative z-20"
        openClassName="pt-8 pb-8"
        closedClassName="pt-5 pb-5"
        contentClassName="mt-4"
      >
        <div className="max-w-2xl mx-auto">
          <motion.div
            ref={contactPanelRef}
            className="flex flex-col gap-2.5 md:flex-row md:flex-wrap md:items-center md:gap-4"
            initial={{ opacity: STAGGER_PANEL.initialOpacity, y: STAGGER_PANEL.initialY }}
            animate={{
              opacity: contactStage >= 1 ? STAGGER_PANEL.finalOpacity : STAGGER_PANEL.initialOpacity,
              y: contactStage >= 1 ? STAGGER_PANEL.finalY : STAGGER_PANEL.initialY,
            }}
            transition={{
              duration: motionDurationMs(STAGGER_TIMING.panelDuration, prefersReducedMotion),
              ease: STAGGER_PANEL.ease,
            }}
          >
            {contactLinks.map((link, index) => (
              <motion.div
                key={link.label}
                className="w-full md:w-auto"
                initial={{ opacity: STAGGER_ITEM.initialOpacity, y: STAGGER_ITEM.initialY }}
                animate={{
                  opacity: contactStage >= 2 ? STAGGER_ITEM.finalOpacity : STAGGER_ITEM.initialOpacity,
                  y: contactStage >= 2 ? STAGGER_ITEM.finalY : STAGGER_ITEM.initialY,
                }}
                transition={{
                  duration: motionDurationMs(STAGGER_TIMING.itemDuration, prefersReducedMotion),
                  delay: contactStage >= 2 ? motionDelayMs(index * STAGGER_TIMING.itemStagger, prefersReducedMotion) : 0,
                  ease: STAGGER_PANEL.ease,
                }}
              >
                <ContactLink link={link} />
              </motion.div>
            ))}

            <motion.div
              className="relative w-full overflow-visible md:w-auto"
              initial={{ opacity: STAGGER_ITEM.initialOpacity, y: STAGGER_ITEM.initialY }}
              animate={{
                opacity: contactStage >= 2 ? STAGGER_ITEM.finalOpacity : STAGGER_ITEM.initialOpacity,
                y: contactStage >= 2 ? STAGGER_ITEM.finalY : STAGGER_ITEM.initialY,
              }}
              transition={{
                duration: motionDurationMs(STAGGER_TIMING.itemDuration, prefersReducedMotion),
                delay: contactStage >= 2 ? motionDelayMs(contactLinks.length * STAGGER_TIMING.itemStagger, prefersReducedMotion) : 0,
                ease: STAGGER_PANEL.ease,
              }}
            >
              <button
                type="button"
                onClick={() => setShowResumeModal(true)}
                className={`group ${mobileContactActionClassName}`}
                aria-label="Social media icon Resume"
              >
                <ContactIcon iconName={resumeIconName} label="Resume" className="h-4 w-4 shrink-0" />
                <span className={mobileContactLabelClassName}>Social media icon Resume</span>
              </button>
              <button
                ref={resumeButtonRef}
                type="button"
                onClick={() => setShowResumeModal(true)}
                className={desktopContactActionClassName}
                onMouseEnter={() => setShowResumePreview(true)}
                onMouseLeave={() => setShowResumePreview(false)}
                onFocus={() => setShowResumePreview(true)}
                onBlur={() => setShowResumePreview(false)}
                aria-label="Resume"
                title="Resume"
              >
                <ContactIcon iconName={resumeIconName} label="Resume" />
                <span className="sr-only">Resume</span>
              </button>
              <ResumePreview isVisible={showResumePreview} anchorRef={resumeButtonRef} />
            </motion.div>
          </motion.div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        id="creating"
        title="Creating"
        isOpen={sectionOpen.creating}
        onToggle={() => toggleSection('creating')}
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
        className="px-4 sm:px-6 lg:px-0 relative z-10"
        openClassName="pt-12 pb-12"
        closedClassName="pt-5 pb-5"
        contentClassName="mt-4 space-y-10"
      >
        {children}

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-0">
          <div className="flex justify-start mt-9">
            <a
              href="/archive"
              className="social-button nord-button inline-flex items-center justify-center gap-1.5 px-4 py-2 font-medium text-xs rounded-sm transition-transform transition-shadow duration-500 relative overflow-hidden hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="font-code font-light tracking-[0.08em] relative z-10">Other</span>
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
                    className="flex w-full items-center justify-between py-3.5 px-2 text-left"
                    onClick={() => toggleJob(index)}
                  >
                    <div className="flex items-center space-x-6">
                      <span className="text-muted-foreground text-xs font-code w-16">{job.year}</span>
                      <span className="font-medium font-garamond-narrow">{job.company}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-muted-foreground text-sm font-garamond-narrow hidden sm:block">{job.title}</span>
                      <motion.div
                        className="w-5 h-5 flex items-center justify-center transition-transform duration-[400ms] text-muted-foreground"
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
                          <p className="text-muted-foreground text-sm leading-relaxed">{job.description}</p>
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
                    <h3 className="font-semibold text-foreground text-base mb-1 font-garamond-narrow">{edu.institution}</h3>
                    <p className="text-foreground text-sm mb-1 font-garamond-narrow">{edu.degree}</p>
                    <p className="text-muted-foreground text-sm font-garamond-narrow">{edu.level}</p>
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
