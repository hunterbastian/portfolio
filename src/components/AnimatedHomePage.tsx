'use client'

import dynamic from 'next/dynamic'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { useDialKit } from 'dialkit'
import Image from 'next/image'
import type { CSSProperties, ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
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

const contactInlineActionClassName =
  'group inline-flex h-9 w-9 origin-center items-center justify-center rounded-full no-underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:h-10 sm:w-10'

const contactIconGlyphClassName =
  'h-[17px] w-[17px] sm:h-[19px] sm:w-[19px]'

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
  contactIconsDelay: 860, // icon row starts only after intro paragraph fully settles
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

const SOCIAL_ICON_DIAL_DEFAULTS = {
  baseColor: '#7f8b98',
  hoverColor: '#ffffff',
  glowColor: '#ffffff',
  baseOpacity: 0.82,
  hoverOpacity: 1,
  iconBaseOpacity: 0.74,
  iconHoverOpacity: 1,
  glowAlpha: 0.76,
  hoverScale: 1.1,
  iconHoverScale: 1.16,
  fadeMs: 420,
} as const

function hexToRgba(hexColor: string, alpha: number): string {
  const normalized = hexColor.replace('#', '').trim()
  const valid =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => `${char}${char}`)
          .join('')
      : normalized

  if (!/^[\da-fA-F]{6}$/.test(valid)) {
    return `rgba(158, 200, 232, ${alpha})`
  }

  const value = Number.parseInt(valid, 16)
  const red = (value >> 16) & 255
  const green = (value >> 8) & 255
  const blue = value & 255
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
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

function ContactIcon({
  iconName,
  label,
  className = 'h-5 w-5',
  style,
}: {
  iconName: CentralIconName
  label: string
  className?: string
  style?: CSSProperties
}) {
  return <CentralIcon name={iconName} size={20} className={className} style={style} aria-label={label} />
}

function ContactLink({
  link,
  actionClassName,
  actionStyle,
  iconStyle,
  onHoverStart,
  onHoverEnd,
}: {
  link: ContactLinkItem
  actionClassName: string
  actionStyle: CSSProperties
  iconStyle: CSSProperties
  onHoverStart: () => void
  onHoverEnd: () => void
}) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={actionClassName}
      style={actionStyle}
      aria-label={link.label}
      title={link.label}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
    >
      <ContactIcon iconName={link.iconName} label={link.label} className={contactIconGlyphClassName} style={iconStyle} />
    </a>
  )
}

export default function AnimatedHomePage({ children }: AnimatedHomePageProps) {
  const [showResumePreview, setShowResumePreview] = useState(false)
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [hoveredSocialAction, setHoveredSocialAction] = useState<string | null>(null)
  const [expandedJobs, setExpandedJobs] = useState<Set<number>>(new Set())
  const [sectionOpen, setSectionOpen] = useState<SectionOpenState>(DEFAULT_SECTION_OPEN_STATE)
  const [heroTextStage, setHeroTextStage] = useState(0)
  const prefersReducedMotion = useReducedMotion() ?? false

  const resumeButtonRef = useRef<HTMLButtonElement>(null)
  const resumePreviewHideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
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

  const socialIconDial = useDialKit('Social Icon Lab', {
    color: {
      baseColor: SOCIAL_ICON_DIAL_DEFAULTS.baseColor,
      hoverColor: SOCIAL_ICON_DIAL_DEFAULTS.hoverColor,
      glowColor: SOCIAL_ICON_DIAL_DEFAULTS.glowColor,
    },
    emphasis: {
      baseOpacity: [SOCIAL_ICON_DIAL_DEFAULTS.baseOpacity, 0.25, 1],
      hoverOpacity: [SOCIAL_ICON_DIAL_DEFAULTS.hoverOpacity, 0.45, 1],
      iconBaseOpacity: [SOCIAL_ICON_DIAL_DEFAULTS.iconBaseOpacity, 0.2, 1],
      iconHoverOpacity: [SOCIAL_ICON_DIAL_DEFAULTS.iconHoverOpacity, 0.4, 1],
      glowAlpha: [SOCIAL_ICON_DIAL_DEFAULTS.glowAlpha, 0.25, 1],
    },
    motion: {
      hoverScale: [SOCIAL_ICON_DIAL_DEFAULTS.hoverScale, 1, 1.16],
      iconHoverScale: [SOCIAL_ICON_DIAL_DEFAULTS.iconHoverScale, 1, 1.24],
      fadeMs: [SOCIAL_ICON_DIAL_DEFAULTS.fadeMs, 120, 800],
    },
  })

  const socialTransitionMs = Math.max(120, Math.round(socialIconDial.motion.fadeMs))
  const socialTransition = `all ${socialTransitionMs}ms cubic-bezier(0.22, 1, 0.36, 1)`
  const socialGlowAlpha = Math.min(1, Math.max(0.25, socialIconDial.emphasis.glowAlpha))
  const socialGlow = hexToRgba(socialIconDial.color.glowColor, socialGlowAlpha)
  const socialSoftGlow = hexToRgba(socialIconDial.color.glowColor, Math.max(0.2, socialGlowAlpha * 0.45))

  const getSocialActionStyle = (isHovered: boolean): CSSProperties => ({
    transition: socialTransition,
    color: isHovered ? socialIconDial.color.hoverColor : socialIconDial.color.baseColor,
    opacity: isHovered ? socialIconDial.emphasis.hoverOpacity : socialIconDial.emphasis.baseOpacity,
    transform: `scale(${isHovered ? socialIconDial.motion.hoverScale : 1})`,
    filter: isHovered ? `drop-shadow(0 0 7px ${socialSoftGlow})` : 'none',
  })

  const getSocialIconStyle = (isHovered: boolean): CSSProperties => ({
    transition: socialTransition,
    opacity: isHovered ? socialIconDial.emphasis.iconHoverOpacity : socialIconDial.emphasis.iconBaseOpacity,
    transform: `scale(${isHovered ? socialIconDial.motion.iconHoverScale : 1})`,
    filter: isHovered ? `drop-shadow(0 0 7px ${socialGlow}) drop-shadow(0 0 14px ${socialSoftGlow})` : 'none',
  })

  const handleSocialHoverStart = (label: string) => {
    setHoveredSocialAction(label)
  }

  const handleSocialHoverEnd = (label: string) => {
    setHoveredSocialAction((current) => (current === label ? null : current))
  }

  const openResumePreview = useCallback(() => {
    if (resumePreviewHideTimeoutRef.current) {
      clearTimeout(resumePreviewHideTimeoutRef.current)
      resumePreviewHideTimeoutRef.current = null
    }
    setShowResumePreview(true)
  }, [])

  const closeResumePreview = useCallback(() => {
    if (resumePreviewHideTimeoutRef.current) {
      clearTimeout(resumePreviewHideTimeoutRef.current)
    }

    if (prefersReducedMotion) {
      setShowResumePreview(false)
      return
    }

    resumePreviewHideTimeoutRef.current = setTimeout(() => {
      setShowResumePreview(false)
      resumePreviewHideTimeoutRef.current = null
    }, 120)
  }, [prefersReducedMotion])

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

  useEffect(() => {
    return () => {
      if (resumePreviewHideTimeoutRef.current) {
        clearTimeout(resumePreviewHideTimeoutRef.current)
      }
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

  const isHeroCopyVisible = heroTextStage >= 2
  const socialRevealDelay = Math.max(0, HERO_ENTRANCE.contactIconsDelay - HERO_ENTRANCE.textItemsDelay)

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 sm:py-8">
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
              <span className="ambient-word-glow font-semibold" data-glow="Studio Alpine">Studio Alpine</span>.
            </motion.p>
          </motion.div>

          <motion.div
            className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2.5 sm:mt-5 sm:gap-x-6"
            initial={{ opacity: STAGGER_PANEL.initialOpacity, y: STAGGER_PANEL.initialY, filter: 'blur(1.4px)' }}
            animate={{
              opacity: isHeroCopyVisible ? STAGGER_PANEL.finalOpacity : STAGGER_PANEL.initialOpacity,
              y: isHeroCopyVisible ? STAGGER_PANEL.finalY : STAGGER_PANEL.initialY,
              filter: isHeroCopyVisible ? 'blur(0px)' : 'blur(1.4px)',
            }}
            transition={{
              duration: motionDurationMs(HERO_ENTRANCE.duration, prefersReducedMotion),
              delay: isHeroCopyVisible ? motionDelayMs(socialRevealDelay, prefersReducedMotion) : 0,
              ease: STAGGER_PANEL.ease,
            }}
            style={{ pointerEvents: isHeroCopyVisible ? 'auto' : 'none' }}
          >
            {contactLinks.map((link, index) => (
              <motion.div
                key={link.label}
                initial={{ opacity: STAGGER_ITEM.initialOpacity, y: STAGGER_ITEM.initialY }}
                animate={{
                  opacity: isHeroCopyVisible ? STAGGER_ITEM.finalOpacity : STAGGER_ITEM.initialOpacity,
                  y: isHeroCopyVisible ? STAGGER_ITEM.finalY : STAGGER_ITEM.initialY,
                }}
                transition={{
                  duration: motionDurationMs(STAGGER_TIMING.itemDuration, prefersReducedMotion),
                  delay: isHeroCopyVisible
                    ? motionDelayMs(socialRevealDelay + index * STAGGER_TIMING.itemStagger, prefersReducedMotion)
                    : 0,
                  ease: STAGGER_PANEL.ease,
                }}
              >
                <ContactLink
                  link={link}
                  actionClassName={contactInlineActionClassName}
                  actionStyle={getSocialActionStyle(hoveredSocialAction === link.label)}
                  iconStyle={getSocialIconStyle(hoveredSocialAction === link.label)}
                  onHoverStart={() => handleSocialHoverStart(link.label)}
                  onHoverEnd={() => handleSocialHoverEnd(link.label)}
                />
              </motion.div>
            ))}

            <motion.div
              className="relative overflow-visible"
              initial={{ opacity: STAGGER_ITEM.initialOpacity, y: STAGGER_ITEM.initialY }}
              animate={{
                opacity: isHeroCopyVisible ? STAGGER_ITEM.finalOpacity : STAGGER_ITEM.initialOpacity,
                y: isHeroCopyVisible ? STAGGER_ITEM.finalY : STAGGER_ITEM.initialY,
              }}
              transition={{
                duration: motionDurationMs(STAGGER_TIMING.itemDuration, prefersReducedMotion),
                delay: isHeroCopyVisible
                  ? motionDelayMs(socialRevealDelay + contactLinks.length * STAGGER_TIMING.itemStagger, prefersReducedMotion)
                  : 0,
                ease: STAGGER_PANEL.ease,
              }}
            >
              <button
                ref={resumeButtonRef}
                type="button"
                onClick={() => {
                  setShowResumePreview(false)
                  setShowResumeModal(true)
                }}
                className={contactInlineActionClassName}
                style={getSocialActionStyle(hoveredSocialAction === 'Resume')}
                onMouseEnter={() => {
                  handleSocialHoverStart('Resume')
                  openResumePreview()
                }}
                onMouseLeave={() => {
                  handleSocialHoverEnd('Resume')
                  closeResumePreview()
                }}
                onFocus={() => {
                  handleSocialHoverStart('Resume')
                  openResumePreview()
                }}
                onBlur={() => {
                  handleSocialHoverEnd('Resume')
                  closeResumePreview()
                }}
                aria-label="Resume"
                title="Resume"
              >
                <ContactIcon
                  iconName={resumeIconName}
                  label="Resume"
                  className={contactIconGlyphClassName}
                  style={getSocialIconStyle(hoveredSocialAction === 'Resume')}
                />
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
            className="inline-flex flex-wrap items-center gap-1.5 text-sm font-code font-medium uppercase tracking-[0.08em] text-muted-foreground no-underline hover:text-primary"
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
                    className="flex w-full items-center justify-between rounded-md border border-transparent px-2 py-3.5 text-left"
                    onClick={() => toggleJob(index)}
                  >
                    <div className="flex items-center space-x-6">
                      <span className="w-16 text-xs font-code text-muted-foreground">
                        {job.year}
                      </span>
                      <span className="font-code font-medium tracking-[0.06em]">
                        {job.company}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="hidden text-sm font-code tracking-[0.06em] text-muted-foreground sm:block">
                        {job.title}
                      </span>
                      <motion.div
                        className="flex h-5 w-5 items-center justify-center text-muted-foreground transition-transform duration-[400ms]"
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
