'use client'

import dynamic from 'next/dynamic'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import Image from 'next/image'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { CentralIcon, type CentralIconName } from '@/icons'
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

const SECTION_STORAGE_KEY = 'hb.sectionOpen.v1'
const SECTION_NAV_EVENT = 'hb:section-navigate'

const DEFAULT_SECTION_OPEN_STATE: SectionOpenState = {
  contact: false,
  creating: false,
  caseStudies: true,
  experience: true,
  education: false,
  everydayTech: false,
  techStack: false,
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

const socialLinkClassName =
  'inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-sm transition-all duration-[420ms] hover:-translate-y-0.5 hover:border-primary/45 hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'

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

const skills = ['Figma', 'Framer', 'UX Design', 'UI Design', 'HTML', 'JavaScript', 'CSS', 'ChatGPT']

const contactLinks: ContactLinkItem[] = [
  { label: 'Instagram', href: 'https://instagram.com/studio.alpine', iconName: 'IconInstagram' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/hunterbastian', iconName: 'IconLinkedin' },
  { label: 'X', href: 'https://x.com/thestudioalpine', iconName: 'IconX' },
  { label: 'GitHub', href: 'https://github.com/hunterbastian', iconName: 'IconGithub' },
  { label: 'Dribbble', href: 'https://dribbble.com/hunterbastian', iconName: 'IconDribbble' },
]

const resumeIconName: CentralIconName = 'IconFileText'

/* ─────────────────────────────────────────────────────────
 * EXPERIENCE LIST STORYBOARD
 *
 * Read top-to-bottom. Each `at` value is ms after section enters view.
 *
 *    0ms   waiting for experience section to enter view
 *  120ms   experience panel fades in, y 14 → 0
 *  280ms   timeline rows slide in (staggered 90ms)
 *   tap    row expands details + icon rotates 45°
 * ───────────────────────────────────────────────────────── */

const EXPERIENCE_TIMING = {
  panelAppear: 120, // panel starts appearing
  rowsAppear: 280, // rows begin staggered reveal
  panelDuration: 380, // panel transition duration
  rowDuration: 420, // each row transition duration
  rowStagger: 90, // stagger gap between rows
  expandDuration: 320, // row detail expand/collapse duration
  iconRotate: 240, // plus icon rotate duration
}

const EXPERIENCE_PANEL = {
  initialOpacity: 0, // hidden before stage 1
  finalOpacity: 1, // visible at rest
  initialY: 14, // panel vertical offset before reveal
  finalY: 0, // resting panel position
  ease: [0.22, 1, 0.36, 1] as const,
}

const EXPERIENCE_ROW = {
  initialOpacity: 0, // hidden row before stage 2
  finalOpacity: 1, // visible row at rest
  initialY: 16, // row vertical offset before reveal
  finalY: 0, // resting row position
}

function mergeStoredSectionState(value: unknown): SectionOpenState {
  const merged: SectionOpenState = { ...DEFAULT_SECTION_OPEN_STATE }

  if (!value || typeof value !== 'object') {
    return merged
  }

  const candidate = value as Partial<Record<SectionKey, unknown>>
  ;(Object.keys(DEFAULT_SECTION_OPEN_STATE) as SectionKey[]).forEach((key) => {
    if (typeof candidate[key] === 'boolean') {
      merged[key] = candidate[key]
    }
  })

  return merged
}

function ContactIcon({ iconName, label }: { iconName: CentralIconName; label: string }) {
  return <CentralIcon name={iconName} size={20} className="h-5 w-5" aria-label={label} />
}

function ContactLink({ link }: { link: ContactLinkItem }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={socialLinkClassName}
      aria-label={link.label}
      title={link.label}
    >
      <ContactIcon iconName={link.iconName} label={link.label} />
      <span className="sr-only">{link.label}</span>
    </a>
  )
}

export default function AnimatedHomePage({ children }: AnimatedHomePageProps) {
  const [showResumePreview, setShowResumePreview] = useState(false)
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [expandedJobs, setExpandedJobs] = useState<Set<number>>(new Set())
  const [experienceStage, setExperienceStage] = useState(0)
  const [sectionOpen, setSectionOpen] = useState<SectionOpenState>(DEFAULT_SECTION_OPEN_STATE)
  const [hasHydratedSections, setHasHydratedSections] = useState(false)

  const experiencePanelRef = useRef<HTMLDivElement>(null)
  const isExperienceInView = useInView(experiencePanelRef, {
    once: true,
    margin: '-120px 0px -120px 0px',
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const stored = window.localStorage.getItem(SECTION_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setSectionOpen(mergeStoredSectionState(parsed))
      }
    } catch {
      setSectionOpen({ ...DEFAULT_SECTION_OPEN_STATE })
    } finally {
      setHasHydratedSections(true)
    }
  }, [])

  useEffect(() => {
    if (!hasHydratedSections || typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.setItem(SECTION_STORAGE_KEY, JSON.stringify(sectionOpen))
    } catch {
      // Ignore storage write failures.
    }
  }, [hasHydratedSections, sectionOpen])

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

  useEffect(() => {
    if (!sectionOpen.experience || !isExperienceInView) {
      return
    }

    setExperienceStage(0)
    const timers: Array<ReturnType<typeof setTimeout>> = []

    timers.push(setTimeout(() => setExperienceStage(1), EXPERIENCE_TIMING.panelAppear))
    timers.push(setTimeout(() => setExperienceStage(2), EXPERIENCE_TIMING.rowsAppear))

    return () => timers.forEach(clearTimeout)
  }, [isExperienceInView, sectionOpen.experience])

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
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <section className="pt-12 pb-0 relative animate-fade-in">
        <div className="max-w-2xl mx-auto hero-section relative z-10 px-4 sm:px-6 lg:px-0">
          <div className="mb-6 flex items-center gap-4">
            <Image
              src="/images/profilepicture.jpg"
              alt="Hunter Bastian // Studio Alpine"
              width={72}
              height={72}
              className="h-[72px] w-[72px] shrink-0 rounded-full object-cover border border-border shadow-sm"
              priority
            />
            <div>
              <h1 className="text-foreground font-garamond-narrow font-semibold text-[clamp(0.78rem,3.35vw,1.53rem)] leading-tight">
                <TextType
                  text="Hunter Bastian // Studio Alpine"
                  className="block whitespace-nowrap"
                  typingSpeed={62}
                  deletingSpeed={44}
                  pauseDuration={2800}
                  loop={false}
                  cinematic
                />
              </h1>
              <div className="font-code text-muted-foreground mt-2 flex items-center gap-3 text-xs tracking-[0.12em]">
                <span>Interaction designer</span>
                <span className="opacity-50">|</span>
                <span>Lehi, UT</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground text-sm font-garamond-narrow leading-relaxed m-0">
              Interaction Design student at UVU with experience designing and building digital products. I work in Figma and
              front-end code at <span className="font-semibold text-primary">Studio Alpine</span>, and I&apos;m focused on clear,
              meaningful interfaces with an AI-first mindset.
            </p>
          </div>
        </div>
      </section>

      <CollapsibleSection
        id="contact"
        title="Contact"
        isOpen={sectionOpen.contact}
        onToggle={() => toggleSection('contact')}
        className="pt-8 pb-8 px-4 sm:px-6 lg:px-0 relative z-20"
        contentClassName="mt-4"
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-wrap gap-4 items-stretch sm:items-center">
            {contactLinks.map((link) => (
              <ContactLink key={link.label} link={link} />
            ))}

            <div className="relative overflow-visible">
              <button
                onClick={() => setShowResumeModal(true)}
                className={socialLinkClassName}
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
              <ResumePreview isVisible={showResumePreview} />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        id="creating"
        title="Creating"
        isOpen={sectionOpen.creating}
        onToggle={() => toggleSection('creating')}
        className="py-12 px-4 sm:px-6 lg:px-0 relative z-10"
        contentClassName="mt-4"
      >
        <div className="max-w-2xl mx-auto text-left">
          <a
            href="https://instagram.com/studio.alpine"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-code tracking-[0.08em] uppercase font-medium text-muted-foreground hover:text-primary underline underline-offset-4"
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
        className="pt-12 pb-12 px-4 sm:px-6 lg:px-0 relative z-10"
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
        className="py-12 px-4 sm:px-6 lg:px-0"
        contentClassName="mt-4"
      >
        <div className="max-w-2xl mx-auto">
          <motion.div
            ref={experiencePanelRef}
            className="nord-panel rounded-lg p-4 sm:p-5 space-y-2"
            initial={{
              opacity: EXPERIENCE_PANEL.initialOpacity,
              y: EXPERIENCE_PANEL.initialY,
            }}
            animate={{
              opacity: experienceStage >= 1 ? EXPERIENCE_PANEL.finalOpacity : EXPERIENCE_PANEL.initialOpacity,
              y: experienceStage >= 1 ? EXPERIENCE_PANEL.finalY : EXPERIENCE_PANEL.initialY,
            }}
            transition={{
              duration: EXPERIENCE_TIMING.panelDuration / 1000,
              ease: EXPERIENCE_PANEL.ease,
            }}
          >
            {experience.map((job, index) => {
              const isExpanded = expandedJobs.has(index)

              return (
                <motion.div
                  key={job.company}
                  className="border-b border-border last:border-b-0"
                  initial={{
                    opacity: EXPERIENCE_ROW.initialOpacity,
                    y: EXPERIENCE_ROW.initialY,
                  }}
                  animate={{
                    opacity: experienceStage >= 2 ? EXPERIENCE_ROW.finalOpacity : EXPERIENCE_ROW.initialOpacity,
                    y: experienceStage >= 2 ? EXPERIENCE_ROW.finalY : EXPERIENCE_ROW.initialY,
                  }}
                  transition={{
                    duration: EXPERIENCE_TIMING.rowDuration / 1000,
                    delay: experienceStage >= 2 ? (index * EXPERIENCE_TIMING.rowStagger) / 1000 : 0,
                    ease: EXPERIENCE_PANEL.ease,
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
                          duration: EXPERIENCE_TIMING.iconRotate / 1000,
                          ease: EXPERIENCE_PANEL.ease,
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
                          duration: EXPERIENCE_TIMING.expandDuration / 1000,
                          ease: EXPERIENCE_PANEL.ease,
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
        className="py-12 px-4 sm:px-6 lg:px-0"
        contentClassName="mt-4"
      >
        <div className="max-w-2xl mx-auto">
          <div className="nord-panel rounded-lg p-5 space-y-5">
            {education.map((edu) => (
              <div key={edu.institution} className="border-b border-border last:border-b-0 pb-5 last:pb-0">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="text-muted-foreground text-xs font-code min-w-[100px]">{edu.year}</div>
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
              </div>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        id="everyday-tech"
        title="Everyday Tech"
        isOpen={sectionOpen.everydayTech}
        onToggle={() => toggleSection('everydayTech')}
        className="py-10 px-4 sm:px-6 lg:px-0"
        contentClassName="mt-4"
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-wrap justify-start gap-x-8 gap-y-4">
            {everydayTech.map((item) => (
              <div key={item} className="text-left">
                <span
                  className={`text-sm font-code tracking-[0.08em] uppercase font-medium ${
                    item.startsWith('Wishlist:') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        id="tech-stack"
        title="Stack"
        isOpen={sectionOpen.techStack}
        onToggle={() => toggleSection('techStack')}
        className="py-12 px-4 sm:px-6 lg:px-0"
        contentClassName="mt-4"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-start gap-x-6 gap-y-3 max-w-2xl mx-auto">
            {skills.map((skill) => (
              <div key={skill} className="text-center">
                <span className="text-sm font-code text-muted-foreground tracking-[0.08em] uppercase font-medium whitespace-nowrap">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      <ResumeModal isOpen={showResumeModal} onClose={() => setShowResumeModal(false)} />
    </div>
  )
}
