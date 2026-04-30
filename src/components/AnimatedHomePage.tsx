'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent, type ReactNode } from 'react'
import { useWebHaptics } from 'web-haptics/react'
import {
  contactSocialLinks,
  creatingLinks,
  educationItems,
  experienceItems,
  homeHeroContent,
} from '@/content/homepage'
import ResumeModal from '@/components/ResumeModal'
import { showJoyToast } from '@/lib/joy'
import { MOTION_EASE_SOFT, motionDurationMs } from '@/lib/motion'
import type { ProjectFrontmatter } from '@/types/project'

interface Project {
  slug: string
  frontmatter: ProjectFrontmatter
}

interface AnimatedHomePageProps {
  projects: Project[]
}

const HOME_PROJECT_DESCRIPTIONS: Record<string, string> = {
  lumo: 'Mindfulness app for calm reflection.',
  'middle-earth-journey': 'Interactive Tolkien map experience.',
  'wander-utah': 'National parks trip-planning app.',
  'porsche-app': 'Simplified Porsche browsing concept.',
}

const PROJECT_GLOW_GRADIENTS: Record<string, string> = {
  lumo:
    'radial-gradient(ellipse at 22% 48%, rgba(248, 198, 57, 0.34) 0%, rgba(255, 212, 80, 0.2) 22%, rgba(255, 236, 148, 0.08) 42%, transparent 72%), radial-gradient(ellipse at 44% 58%, rgba(255, 75, 0, 0.13) 0%, rgba(255, 154, 64, 0.06) 30%, transparent 58%)',
  'middle-earth-journey':
    'radial-gradient(ellipse at 24% 48%, rgba(35, 84, 128, 0.3) 0%, rgba(66, 116, 156, 0.17) 24%, rgba(156, 182, 196, 0.08) 42%, transparent 72%), radial-gradient(ellipse at 44% 58%, rgba(226, 61, 40, 0.11) 0%, rgba(226, 61, 40, 0.045) 28%, transparent 56%)',
  'wander-utah':
    'radial-gradient(ellipse at 24% 48%, rgba(255, 75, 0, 0.3) 0%, rgba(255, 116, 36, 0.17) 23%, rgba(255, 186, 105, 0.08) 42%, transparent 72%), radial-gradient(ellipse at 44% 58%, rgba(143, 166, 85, 0.13) 0%, rgba(143, 166, 85, 0.055) 28%, transparent 56%)',
  'porsche-app':
    'radial-gradient(ellipse at 24% 48%, rgba(226, 61, 40, 0.28) 0%, rgba(226, 61, 40, 0.16) 23%, rgba(242, 170, 150, 0.075) 42%, transparent 72%), radial-gradient(ellipse at 44% 58%, rgba(42, 42, 44, 0.16) 0%, rgba(42, 42, 44, 0.055) 28%, transparent 56%)',
  playground:
    'radial-gradient(ellipse at 24% 48%, rgba(255, 75, 0, 0.36) 0%, rgba(255, 154, 64, 0.2) 20%, rgba(255, 188, 118, 0.1) 36%, rgba(255, 212, 168, 0.04) 52%, transparent 72%), radial-gradient(ellipse at 42% 58%, rgba(255, 185, 120, 0.13) 0%, rgba(255, 205, 152, 0.065) 28%, transparent 56%)',
}

const PROJECT_ACCENTS: Record<string, string> = {
  lumo: '#f8c639',
  'middle-earth-journey': '#235480',
  'wander-utah': '#8fa655',
  'porsche-app': '#e23d28',
  playground: '#ff4b00',
}

type EditorialAccentStyle = CSSProperties & {
  '--editorial-accent': string
  '--editorial-accent-bg': string
  '--editorial-accent-border': string
  '--editorial-accent-shadow': string
}

interface EditorialItemProps {
  eyebrow?: string
  eyebrowClassName?: string
  href?: string
  external?: boolean
  title: string
  description: string
  trailing?: string
  titleFontClassName?: string
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  thumbnailImage?: string
  thumbnailAlt?: string
  underlineOnHover?: boolean
  hoverAccentColor?: string
  toastMessage?: string
}

function formatYear(date: string) {
  return new Date(date).getFullYear().toString()
}

function getProjectRows(projects: Project[]) {
  return projects.slice(0, 4)
}

function getHomeProjectDescription(project: Project) {
  return HOME_PROJECT_DESCRIPTIONS[project.slug] ?? project.frontmatter.description
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function Reveal({ children, delayMs = 0 }: { children: ReactNode; delayMs?: number }) {
  const prefersReducedMotion = useReducedMotion() ?? false

  return (
    <m.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px 0px' }}
      transition={{
        duration: motionDurationMs(520, prefersReducedMotion),
        delay: prefersReducedMotion ? 0 : delayMs / 1000,
        ease: MOTION_EASE_SOFT,
      }}
    >
      {children}
    </m.div>
  )
}

function Section({
  id,
  title,
  children,
}: {
  id?: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-5 sm:space-y-7">
      <div className="space-y-2.5 sm:space-y-3">
        <div className="flex items-baseline gap-4 text-[0.85rem] tracking-[-0.02em] text-foreground/92">
          <h2>{title}</h2>
        </div>
        <div className="h-px w-full bg-border/90" />
      </div>
      {children}
    </section>
  )
}

function EditorialItem({
  eyebrow,
  eyebrowClassName,
  href,
  external = false,
  title,
  description,
  trailing,
  titleFontClassName,
  onMouseEnter,
  onMouseLeave,
  thumbnailImage,
  thumbnailAlt,
  underlineOnHover = false,
  hoverAccentColor = '#ff4b00',
  toastMessage,
}: EditorialItemProps) {
  const interactive = Boolean(href)
  const haptic = useWebHaptics()
  const accentStyle: EditorialAccentStyle = {
    '--editorial-accent': hoverAccentColor,
    '--editorial-accent-bg': `color-mix(in srgb, ${hoverAccentColor} 7%, transparent)`,
    '--editorial-accent-border': `color-mix(in srgb, ${hoverAccentColor} 46%, var(--border))`,
    '--editorial-accent-shadow': `color-mix(in srgb, ${hoverAccentColor} 22%, transparent)`,
  }
  const content = (
    <div
      className={`group relative flex w-full origin-center items-start justify-between gap-3.5 px-0 py-2.5 transition-[transform,color,opacity,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:-mx-3 sm:gap-10 sm:px-3 sm:py-3 ${
        interactive ? 'cursor-pointer touch-manipulation active:translate-y-0 active:scale-[0.96] sm:hover:translate-x-[3px] sm:hover:bg-[var(--editorial-accent-bg)]' : ''
      }`}
      style={accentStyle}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-6">
        {thumbnailImage ? (
          <div className="relative mt-0.5 h-[64px] w-[64px] shrink-0 overflow-hidden border border-border/75 bg-card/55 shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition-[transform,border-color,box-shadow,filter] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[1px] group-hover:border-[var(--editorial-accent-border)] group-hover:shadow-[0_12px_28px_-18px_var(--editorial-accent-shadow)] group-active:translate-y-0 group-active:scale-[0.96] group-active:brightness-[0.98] sm:h-[84px] sm:w-[84px]">
            <Image
              src={thumbnailImage}
              alt={thumbnailAlt ?? title}
              fill
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.018] group-active:scale-[1.01]"
              sizes="(min-width: 640px) 84px, 72px"
            />
          </div>
        ) : null}

        <div className="min-w-0 flex-1 space-y-1.5">
          {eyebrow ? (
            <p className={`${eyebrowClassName ?? 'font-mono text-muted-foreground/70 group-hover:text-muted-foreground'} text-[0.66rem] uppercase tracking-[0.12em] transition-colors duration-300`}>
              {eyebrow}
            </p>
          ) : null}
          <div className="flex min-w-0 items-baseline justify-between gap-3">
            <p className={`${titleFontClassName ?? 'font-mono'} min-w-0 text-[1rem] leading-[1.15] tracking-[-0.03em] text-foreground transition-colors duration-300 ${underlineOnHover ? 'group-hover:text-[var(--editorial-accent)]' : 'group-hover:text-foreground/86'} sm:text-[1.02rem] sm:leading-none`}>
              <span
                className={
                  underlineOnHover
                    ? `${titleFontClassName ?? ''} inline underline decoration-border underline-offset-[0.2em] transition-[text-decoration-color] duration-300 group-hover:decoration-[var(--editorial-accent)]`
                    : `${titleFontClassName ?? ''} inline`
                }
              >
                {title}
              </span>
            </p>
            {trailing ? (
              <span className="shrink-0 font-mono text-[0.72rem] text-muted-foreground/70 transition-colors duration-300 group-hover:text-[var(--editorial-accent)] sm:hidden">
                {trailing}
              </span>
            ) : null}
          </div>
          <p className="max-w-[44rem] font-mono text-[0.86rem] leading-[1.5] text-muted-foreground transition-colors duration-300 group-hover:text-foreground/72 sm:text-[0.96rem] sm:leading-[1.65]">
            {description}
          </p>
        </div>
      </div>
      {trailing ? (
        <span className="hidden shrink-0 pt-0.5 font-mono text-[0.84rem] text-muted-foreground/75 transition-[transform,color] duration-300 group-hover:translate-x-[2px] group-hover:text-[var(--editorial-accent)] sm:block">
          {trailing}
        </span>
      ) : null}
    </div>
  )

  if (!href) return content

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="block rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={() => {
          haptic.trigger('light')
          showJoyToast(toastMessage ?? `Opening ${title}`)
        }}
      >
        {content}
      </a>
    )
  }

  return (
    <Link
      href={href}
      className="block rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => {
        haptic.trigger('light')
        showJoyToast(toastMessage ?? `Opening ${title}`)
      }}
    >
      {content}
    </Link>
  )
}

function ContactLinks() {
  const haptic = useWebHaptics()

  const handleContactClick = async (event: MouseEvent<HTMLAnchorElement>, link: (typeof contactSocialLinks)[number]) => {
    haptic.trigger('light')

    if (link.label !== 'Email') {
      showJoyToast(`Opening ${link.label}`)
      return
    }

    event.preventDefault()

    try {
      await navigator.clipboard.writeText(link.href.replace('mailto:', ''))
      showJoyToast('Email copied')
    } catch {
      window.location.href = link.href
      showJoyToast('Opening email')
    }
  }

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4 sm:gap-x-6 sm:gap-y-3.5">
      {contactSocialLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noreferrer' : undefined}
          className="group/peek relative min-h-[40px] w-fit origin-center touch-manipulation font-mono text-[0.92rem] text-foreground decoration-border underline underline-offset-[0.24em] transition-[color,transform,text-decoration-color] duration-150 hover:-translate-y-[1px] hover:text-[#ff4b00] hover:decoration-[#ff4b00]/70 active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-[0.94rem]"
          onClick={(event) => void handleContactClick(event, link)}
        >
          {link.label}
          <span className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 translate-y-1 whitespace-nowrap border border-border/70 bg-background/92 px-2 py-1 font-mono text-[0.62rem] text-muted-foreground opacity-0 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.35)] blur-[4px] transition-[opacity,transform,filter] duration-200 group-hover/peek:translate-y-0 group-hover/peek:opacity-100 group-hover/peek:blur-0 group-focus-visible/peek:translate-y-0 group-focus-visible/peek:opacity-100 group-focus-visible/peek:blur-0">
            {link.label === 'Email' ? 'Copy email' : `Open ${link.label}`}
          </span>
        </a>
      ))}
    </div>
  )
}

export default function AnimatedHomePage({ projects }: AnimatedHomePageProps) {
  const projectRows = getProjectRows(projects)
  const introParagraphs = homeHeroContent.intro.split('\n\n')
  const [hoveredProjectSlug, setHoveredProjectSlug] = useState<string | null>(null)
  const [resumeOpen, setResumeOpen] = useState(false)
  const [heroGlowActive, setHeroGlowActive] = useState(false)
  const [contactGlowActive, setContactGlowActive] = useState(false)
  const heroGlowRef = useRef<HTMLDivElement | null>(null)
  const heroGrainRef = useRef<HTMLDivElement | null>(null)
  const heroGlowBoundsRef = useRef<DOMRect | null>(null)
  const heroGlowFrameRef = useRef<number | null>(null)
  const heroGlowPointerRef = useRef({ x: 0, y: 0 })
  const contactGlowRef = useRef<HTMLDivElement | null>(null)
  const contactGlowBoundsRef = useRef<DOMRect | null>(null)
  const contactGlowFrameRef = useRef<number | null>(null)
  const contactGlowPointerRef = useRef({ x: 0, y: 0 })
  const haptic = useWebHaptics()

  useEffect(() => {
    return () => {
      if (heroGlowFrameRef.current !== null) {
        window.cancelAnimationFrame(heroGlowFrameRef.current)
      }

      if (contactGlowFrameRef.current !== null) {
        window.cancelAnimationFrame(contactGlowFrameRef.current)
      }
    }
  }, [])

  const writeHeroGlowPosition = () => {
    const glow = heroGlowRef.current
    const grain = heroGrainRef.current
    const { x, y } = heroGlowPointerRef.current
    const glowX = clamp(x * 20, -20, 20)
    const glowY = clamp(y * 10, -10, 10)

    if (glow) {
      glow.style.setProperty('--hero-glow-cursor-x', `${glowX}px`)
      glow.style.setProperty('--hero-glow-cursor-y', `${glowY}px`)
    }

    if (grain) {
      grain.style.setProperty('--hero-grain-cursor-x', `${glowX * 0.55}px`)
      grain.style.setProperty('--hero-grain-cursor-y', `${glowY * 0.55}px`)
    }

    heroGlowFrameRef.current = null
  }

  const trackHeroGlowBounds = (event: PointerEvent<HTMLElement>) => {
    setHeroGlowActive(true)
    heroGlowBoundsRef.current = event.currentTarget.getBoundingClientRect()
  }

  const updateHeroGlow = (event: PointerEvent<HTMLElement>) => {
    const rect = heroGlowBoundsRef.current ?? event.currentTarget.getBoundingClientRect()
    heroGlowBoundsRef.current = rect

    heroGlowPointerRef.current = {
      x: (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2),
      y: (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2),
    }

    if (heroGlowFrameRef.current === null) {
      heroGlowFrameRef.current = window.requestAnimationFrame(writeHeroGlowPosition)
    }
  }

  const resetHeroGlow = () => {
    const glow = heroGlowRef.current
    const grain = heroGrainRef.current

    heroGlowBoundsRef.current = null
    heroGlowPointerRef.current = { x: 0, y: 0 }
    setHeroGlowActive(false)

    if (glow) {
      glow.style.setProperty('--hero-glow-cursor-x', '0px')
      glow.style.setProperty('--hero-glow-cursor-y', '0px')
    }

    if (grain) {
      grain.style.setProperty('--hero-grain-cursor-x', '0px')
      grain.style.setProperty('--hero-grain-cursor-y', '0px')
    }
  }

  const writeContactGlowPosition = () => {
    const glow = contactGlowRef.current
    if (!glow) return

    const { x, y } = contactGlowPointerRef.current
    glow.style.setProperty('--contact-glow-cursor-x', `${clamp(x * 42, -42, 42)}px`)
    glow.style.setProperty('--contact-glow-cursor-y', `${clamp(y * 18, -18, 18)}px`)
    contactGlowFrameRef.current = null
  }

  const trackContactGlowBounds = (event: PointerEvent<HTMLDivElement>) => {
    setContactGlowActive(true)
    contactGlowBoundsRef.current = event.currentTarget.getBoundingClientRect()
  }

  const updateContactGlow = (event: PointerEvent<HTMLDivElement>) => {
    const rect = contactGlowBoundsRef.current ?? event.currentTarget.getBoundingClientRect()
    contactGlowBoundsRef.current = rect

    contactGlowPointerRef.current = {
      x: (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2),
      y: (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2),
    }

    if (contactGlowFrameRef.current === null) {
      contactGlowFrameRef.current = window.requestAnimationFrame(writeContactGlowPosition)
    }
  }

  const resetContactGlow = () => {
    const glow = contactGlowRef.current
    if (!glow) return

    contactGlowBoundsRef.current = null
    contactGlowPointerRef.current = { x: 0, y: 0 }
    setContactGlowActive(false)
    glow.style.setProperty('--contact-glow-cursor-x', '0px')
    glow.style.setProperty('--contact-glow-cursor-y', '0px')
  }

  return (
    <div className="px-5 pb-[4.5rem] sm:px-8 sm:pb-32">
      <div className="mx-auto max-w-[36rem] pt-16 sm:pt-28">
        <Reveal>
          <section
            className="relative isolate space-y-7 sm:space-y-8"
            onPointerEnter={trackHeroGlowBounds}
            onPointerMove={updateHeroGlow}
            onPointerLeave={resetHeroGlow}
          >
            <div
              ref={heroGlowRef}
              aria-hidden="true"
              className={`animated-hero-glow pointer-events-none absolute left-[calc(50%+5rem)] -top-24 -z-10 h-[32rem] w-[calc(100vw+8rem)] overflow-hidden opacity-[0.34] blur-xl transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform sm:left-[calc(50%+7rem)] sm:-top-28 sm:h-[34rem] sm:w-[calc(100vw+12rem)] sm:opacity-[0.38] dark:opacity-[0.24] ${
                heroGlowActive ? 'is-active' : ''
              }`}
              style={{
                maskImage:
                  'radial-gradient(ellipse 58% 44% at 50% 42%, black 0%, rgba(0, 0, 0, 0.72) 32%, rgba(0, 0, 0, 0.22) 58%, transparent 82%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 58% 44% at 50% 42%, black 0%, rgba(0, 0, 0, 0.72) 32%, rgba(0, 0, 0, 0.22) 58%, transparent 82%)',
              }}
            >
              <Image
                src="/images/grainient-lightglow-01.jpg"
                alt=""
                fill
                priority
                className="scale-[1.04] object-cover object-[50%_48%] sepia-[0.36] saturate-[1.18] hue-rotate-[326deg] brightness-[1.08] contrast-[0.92] mix-blend-multiply dark:mix-blend-screen"
                sizes="100vw"
              />
              <div
                className="absolute inset-0 dark:mix-blend-screen"
                style={{
                  background:
                    'radial-gradient(ellipse at 46% 48%, rgba(255, 72, 0, 0.88) 0%, rgba(255, 92, 10, 0.64) 34%, rgba(255, 156, 58, 0.26) 62%, transparent 84%)',
                }}
              />
              <div className="absolute inset-0 bg-background/14 dark:bg-background/42" />
            </div>

            <div
              ref={heroGrainRef}
              aria-hidden="true"
              className={`animated-hero-grain pointer-events-none absolute left-[calc(50%+5rem)] -top-20 -z-10 h-[32rem] w-[calc(100vw+10rem)] opacity-[0.05] mix-blend-multiply transition-transform duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform sm:left-[calc(50%+7rem)] sm:-top-24 sm:h-[34rem] sm:w-[calc(100vw+14rem)] sm:opacity-[0.065] dark:opacity-[0.036] dark:mix-blend-screen ${
                heroGlowActive ? 'is-active' : ''
              }`}
              style={{
                backgroundImage: "url('/images/hero-grain.svg')",
                backgroundSize: '260px 260px',
                maskImage:
                  'radial-gradient(ellipse 60% 48% at 50% 42%, rgba(0, 0, 0, 0.64) 0%, rgba(0, 0, 0, 0.32) 48%, transparent 78%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 60% 48% at 50% 42%, rgba(0, 0, 0, 0.64) 0%, rgba(0, 0, 0, 0.32) 48%, transparent 78%)',
              }}
            />

            <div className="relative z-10 space-y-6 sm:space-y-7">
              <div className="space-y-3.5 sm:space-y-4">
                <div className="group relative isolate w-fit">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-10 -z-10 rounded-full opacity-0 blur-3xl scale-90 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:scale-100 dark:hidden"
                    style={{
                      background:
                        'radial-gradient(ellipse at 48% 52%, rgba(255, 72, 0, 0.56) 0%, rgba(255, 103, 16, 0.42) 32%, rgba(255, 178, 66, 0.22) 58%, transparent 80%)',
                    }}
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-10 -z-10 hidden rounded-full opacity-0 blur-3xl scale-90 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:scale-100 dark:block"
                    style={{
                      background:
                        'radial-gradient(ellipse at 48% 52%, rgba(255, 78, 0, 0.4) 0%, rgba(255, 114, 18, 0.3) 34%, rgba(255, 178, 66, 0.16) 60%, transparent 82%)',
                    }}
                  />
                  <div
                    className="mask mask-squircle w-fit p-[2px] shadow-sm transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[2px] hover:scale-[1.01] hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
                    style={{ background: 'var(--border)' }}
                  >
                    <Image
                      src="/images/profilepicture.webp"
                      alt="Outdoor photograph of Hunter Bastian walking along a mountain road."
                      width={75}
                      height={75}
                      priority
                      className="mask mask-squircle object-cover img-inset-outline transition-[filter,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:brightness-[1.02]"
                      sizes="75px"
                    />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <p className="font-header text-[1.05rem] tracking-[-0.03em] text-foreground/92">
                    {homeHeroContent.headline}
                  </p>
                  <p className="font-header text-[0.98rem] tracking-[-0.02em] text-muted-foreground">
                    {homeHeroContent.subtitle}
                  </p>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-5">
                {introParagraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="max-w-[31rem] font-header text-[1rem] leading-[1.62] tracking-[-0.02em] text-foreground/84 sm:text-[1.03rem] sm:leading-[1.72]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 sm:gap-x-5">
                <Link
                  href="/#contact"
                  className="group group/peek relative inline-flex min-h-[40px] origin-center touch-manipulation items-center leading-none font-header text-[0.74rem] text-foreground transition-[color,transform] duration-150 hover:-translate-y-[1px] hover:text-foreground/70 active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-[0.78rem]"
                  onClick={() => {
                    haptic.trigger('light')
                    showJoyToast('Say hi')
                  }}
                >
                  <span className="underline decoration-transparent underline-offset-[0.2em] group-hover:decoration-current group-focus-visible:decoration-current">
                    Contact
                  </span>
                  <span className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 translate-y-1 whitespace-nowrap border border-border/70 bg-background/92 px-2 py-1 font-mono text-[0.62rem] text-muted-foreground opacity-0 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.35)] blur-[4px] transition-[opacity,transform,filter] duration-200 group-hover/peek:translate-y-0 group-hover/peek:opacity-100 group-hover/peek:blur-0 group-focus-visible/peek:translate-y-0 group-focus-visible/peek:opacity-100 group-focus-visible/peek:blur-0">
                    Say hi
                  </span>
                </Link>
                <Link
                  href="/cv"
                  className="group group/peek relative inline-flex min-h-[40px] origin-center touch-manipulation items-center leading-none font-header text-[0.74rem] text-foreground transition-[color,transform] duration-150 hover:-translate-y-[1px] hover:text-foreground/70 active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-[0.78rem]"
                  onClick={() => {
                    haptic.trigger('light')
                    showJoyToast('Opening CV')
                  }}
                >
                  <span className="underline decoration-transparent underline-offset-[0.2em] group-hover:decoration-current group-focus-visible:decoration-current">
                    View CV
                  </span>
                  <span className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 translate-y-1 whitespace-nowrap border border-border/70 bg-background/92 px-2 py-1 font-mono text-[0.62rem] text-muted-foreground opacity-0 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.35)] blur-[4px] transition-[opacity,transform,filter] duration-200 group-hover/peek:translate-y-0 group-hover/peek:opacity-100 group-hover/peek:blur-0 group-focus-visible/peek:translate-y-0 group-focus-visible/peek:opacity-100 group-focus-visible/peek:blur-0">
                    Open CV
                  </span>
                </Link>
                <button
                  type="button"
                  className="group group/peek relative inline-flex min-h-[40px] origin-center touch-manipulation items-center leading-none font-header text-[0.74rem] text-foreground transition-[color,transform] duration-150 hover:-translate-y-[1px] hover:text-foreground/70 active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-[0.78rem]"
                  onClick={() => {
                    haptic.trigger('light')
                    showJoyToast('Resume opened')
                    setResumeOpen(true)
                  }}
                >
                  <span className="underline decoration-transparent underline-offset-[0.2em] group-hover:decoration-current group-focus-visible:decoration-current">
                    Resume
                  </span>
                  <span className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 translate-y-1 whitespace-nowrap border border-border/70 bg-background/92 px-2 py-1 font-mono text-[0.62rem] text-muted-foreground opacity-0 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.35)] blur-[4px] transition-[opacity,transform,filter] duration-200 group-hover/peek:translate-y-0 group-hover/peek:opacity-100 group-hover/peek:blur-0 group-focus-visible/peek:translate-y-0 group-focus-visible/peek:opacity-100 group-focus-visible/peek:blur-0">
                    Preview resume
                  </span>
                </button>
              </div>
            </div>
          </section>
        </Reveal>

        <div className="mt-14 space-y-12 sm:mt-24 sm:space-y-20">
          <Reveal delayMs={40}>
            <Section id="projects" title="Projects">
              <div className="relative">
                <div className="relative z-10 space-y-3.5 sm:space-y-5">
                  {projectRows.map((project) => (
                    <div key={project.slug} className="relative isolate">
                      <AnimatePresence initial={false}>
                        {hoveredProjectSlug === project.slug ? (
                          <m.div
                            className="pointer-events-none absolute left-[-54%] top-[-3.6rem] z-0 h-[13rem] w-[210%] opacity-[0.72] blur-[58px]"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 0.72, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{
                              opacity: { duration: 0.34, ease: MOTION_EASE_SOFT },
                              scale: { duration: 0.5, ease: MOTION_EASE_SOFT },
                            }}
                            style={{
                              background: PROJECT_GLOW_GRADIENTS[project.slug],
                            }}
                          />
                        ) : null}
                      </AnimatePresence>
                      <div className="relative z-10">
                        <EditorialItem
                          href={`/projects/${project.slug}`}
                          title={project.frontmatter.displayTitle || project.frontmatter.title}
                          description={getHomeProjectDescription(project)}
                          trailing={formatYear(project.frontmatter.date)}
                          titleFontClassName="font-header"
                          onMouseEnter={() => setHoveredProjectSlug(project.slug)}
                          onMouseLeave={() => setHoveredProjectSlug((current) => (current === project.slug ? null : current))}
                          thumbnailImage={project.frontmatter.image}
                          thumbnailAlt={project.frontmatter.displayTitle || project.frontmatter.title}
                          underlineOnHover
                          hoverAccentColor={PROJECT_ACCENTS[project.slug] ?? '#ff4b00'}
                          toastMessage="Opening project"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="relative isolate">
                    <AnimatePresence initial={false}>
                      {hoveredProjectSlug === 'playground' ? (
                        <m.div
                          className="pointer-events-none absolute left-[-54%] top-[-3.6rem] z-0 h-[13rem] w-[210%] opacity-[0.72] blur-[58px]"
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 0.72, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{
                            opacity: { duration: 0.34, ease: MOTION_EASE_SOFT },
                            scale: { duration: 0.5, ease: MOTION_EASE_SOFT },
                          }}
                          style={{
                            background: PROJECT_GLOW_GRADIENTS.playground,
                          }}
                        />
                      ) : null}
                    </AnimatePresence>
                    <div className="relative z-10">
                      <EditorialItem
                        href="/archive"
                        title="Playground"
                        description="Small experiments and prototypes."
                        trailing="See more"
                        titleFontClassName="font-header"
                        onMouseEnter={() => setHoveredProjectSlug('playground')}
                        onMouseLeave={() => setHoveredProjectSlug((current) => (current === 'playground' ? null : current))}
                        thumbnailImage="/images/optimized/projects/path.webp"
                        thumbnailAlt="Playground experiments preview"
                        underlineOnHover
                        hoverAccentColor={PROJECT_ACCENTS.playground}
                        toastMessage="Opening playground"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          </Reveal>

          <Reveal delayMs={80}>
            <Section title="Endeavors">
              <div className="space-y-3.5 sm:space-y-5">
                {creatingLinks.map((link) => (
                  <EditorialItem
                    key={link.label}
                    href={link.href}
                    external={link.external}
                    title={link.label}
                    description={
                      link.label === 'Studio Alpine'
                        ? 'Photography, image-making, and visual experiments shaped outside of client work.'
                        : 'Open for freelance and collaborative projects across design, interfaces, and creative web work.'
                    }
                    underlineOnHover
                  />
                ))}
              </div>
            </Section>
          </Reveal>

          <Reveal delayMs={120}>
            <Section title="Experience">
              <div className="space-y-3.5 sm:space-y-5">
                {experienceItems.map((item) => (
                  <EditorialItem
                    key={`${item.company}-${item.year}`}
                    eyebrow={item.year}
                    eyebrowClassName="font-mono text-muted-foreground/45 group-hover:text-muted-foreground/58"
                    title={`${item.title} — ${item.company}`}
                    description={item.description}
                  />
                ))}
              </div>
            </Section>
          </Reveal>

          <Reveal delayMs={160}>
            <Section title="Education">
              <div className="space-y-3.5 sm:space-y-5">
                {educationItems.map((item) => (
                  <EditorialItem
                    key={`${item.institution}-${item.year}`}
                    eyebrow={item.year}
                    title={`${item.degree} — ${item.institution}`}
                    description={item.note ? `${item.level}. ${item.note}.` : item.level}
                  />
                ))}
              </div>
            </Section>
          </Reveal>

          <Reveal delayMs={200}>
            <Section id="contact" title="Contact">
              <div
                className="relative space-y-[1.125rem] sm:space-y-6"
                onPointerEnter={trackContactGlowBounds}
                onPointerMove={updateContactGlow}
                onPointerLeave={resetContactGlow}
              >
                <div
                  ref={contactGlowRef}
                  className={`animated-contact-glow pointer-events-none absolute left-[-56%] top-[18%] z-0 h-[20rem] w-[215%] opacity-90 blur-[58px] ${
                    contactGlowActive ? 'is-active' : ''
                  }`}
                  style={{
                    background:
                      'radial-gradient(ellipse at 20% 78%, rgba(255, 154, 64, 0.3) 0%, rgba(232, 96, 86, 0.08) 18%, rgba(255, 170, 86, 0.18) 32%, rgba(255, 188, 118, 0.1) 46%, rgba(255, 212, 168, 0.04) 58%, transparent 78%), radial-gradient(ellipse at 42% 64%, rgba(255, 185, 120, 0.08) 0%, rgba(215, 92, 92, 0.035) 24%, rgba(255, 205, 152, 0.04) 36%, transparent 60%)',
                  }}
                />

                <div className="relative z-10 space-y-[1.125rem] sm:space-y-6">
                  <p className="max-w-[38rem] font-mono text-[0.92rem] leading-[1.58] text-muted-foreground sm:text-[1rem] sm:leading-[1.7]">
                    If something here resonates, reach out.
                  </p>
                  <ContactLinks />
                </div>
              </div>
            </Section>
          </Reveal>
        </div>
      </div>

      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  )
}
