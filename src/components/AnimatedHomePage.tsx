'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { useWebHaptics } from 'web-haptics/react'
import {
  contactSocialLinks,
  creatingLinks,
  educationItems,
  experienceItems,
  homeHeroContent,
} from '@/content/homepage'
import ResumeModal from '@/components/ResumeModal'
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
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-7">
      <div className="space-y-3">
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
}: EditorialItemProps) {
  const interactive = Boolean(href)
  const content = (
    <div
      className={`group relative flex w-full items-start justify-between gap-4 px-0 py-3 transition-[transform,color,opacity,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:-mx-3 sm:gap-10 sm:px-3 ${
        interactive ? 'sm:hover:translate-x-[3px] sm:hover:bg-foreground/[0.03]' : ''
      }`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3.5 sm:gap-6">
        {thumbnailImage ? (
          <div className="relative mt-0.5 h-[72px] w-[72px] shrink-0 overflow-hidden border border-border/75 bg-card/55 shadow-[0_2px_10px_rgba(15,23,42,0.04)] sm:h-[84px] sm:w-[84px]">
            <Image
              src={thumbnailImage}
              alt={thumbnailAlt ?? title}
              fill
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.015]"
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
            <p className={`${titleFontClassName ?? 'font-mono'} min-w-0 text-[1rem] leading-[1.15] tracking-[-0.03em] text-foreground transition-colors duration-300 ${underlineOnHover ? 'group-hover:text-[#ff4b00]' : 'group-hover:text-foreground/86'} sm:text-[1.02rem] sm:leading-none`}>
              <span
                className={
                  underlineOnHover
                    ? `${titleFontClassName ?? ''} inline underline decoration-border underline-offset-[0.2em] transition-[text-decoration-color] duration-300 group-hover:decoration-[#ff4b00]/70`
                    : `${titleFontClassName ?? ''} inline`
                }
              >
                {title}
              </span>
            </p>
            {trailing ? (
              <span className="shrink-0 font-mono text-[0.72rem] text-muted-foreground/70 sm:hidden">
                {trailing}
              </span>
            ) : null}
          </div>
          <p className="max-w-[44rem] font-mono text-[0.9rem] leading-[1.58] text-muted-foreground transition-colors duration-300 group-hover:text-foreground/72 sm:text-[0.96rem] sm:leading-[1.65]">
            {description}
          </p>
        </div>
      </div>
      {trailing ? (
        <span className="hidden shrink-0 pt-0.5 font-mono text-[0.84rem] text-muted-foreground/75 transition-[transform,color] duration-300 group-hover:translate-x-[2px] group-hover:text-foreground/72 sm:block">
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
        className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {content}
      </a>
    )
  }

  return (
    <Link
      href={href}
      className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {content}
    </Link>
  )
}

function ContactLinks() {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4 sm:gap-x-6 sm:gap-y-3.5">
      {contactSocialLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noreferrer' : undefined}
          className="min-h-[40px] w-fit font-mono text-[0.92rem] text-foreground decoration-border underline underline-offset-[0.24em] transition-[color,transform,text-decoration-color] duration-150 hover:-translate-y-[1px] hover:text-[#ff4b00] hover:decoration-[#ff4b00]/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-[0.94rem]"
        >
          {link.label}
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
  const contactGlowRef = useRef<HTMLDivElement | null>(null)
  const contactGlowBoundsRef = useRef<DOMRect | null>(null)
  const contactGlowFrameRef = useRef<number | null>(null)
  const contactGlowPointerRef = useRef({ x: 0, y: 0 })
  const activeProjectGlow = hoveredProjectSlug ? PROJECT_GLOW_GRADIENTS[hoveredProjectSlug] : null
  const haptic = useWebHaptics()

  useEffect(() => {
    return () => {
      if (contactGlowFrameRef.current !== null) {
        window.cancelAnimationFrame(contactGlowFrameRef.current)
      }
    }
  }, [])

  const writeContactGlowPosition = () => {
    const glow = contactGlowRef.current
    if (!glow) return

    const { x, y } = contactGlowPointerRef.current
    glow.style.setProperty('--contact-glow-cursor-x', `${clamp(x * 42, -42, 42)}px`)
    glow.style.setProperty('--contact-glow-cursor-y', `${clamp(y * 18, -18, 18)}px`)
    contactGlowFrameRef.current = null
  }

  const trackContactGlowBounds = (event: PointerEvent<HTMLDivElement>) => {
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
    glow.style.setProperty('--contact-glow-cursor-x', '0px')
    glow.style.setProperty('--contact-glow-cursor-y', '0px')
  }

  return (
    <div className="px-5 pb-24 sm:px-8 sm:pb-32">
      <div className="mx-auto max-w-[36rem] pt-20 sm:pt-28">
        <Reveal>
          <section className="relative isolate space-y-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[calc(50%+5rem)] -top-24 -z-10 h-[32rem] w-[calc(100vw+8rem)] -translate-x-1/2 overflow-hidden opacity-[0.34] blur-xl sm:left-[calc(50%+7rem)] sm:-top-28 sm:h-[34rem] sm:w-[calc(100vw+12rem)] sm:opacity-[0.38] dark:opacity-[0.24]"
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
              aria-hidden="true"
              className="pointer-events-none absolute left-[calc(50%+5rem)] -top-20 -z-10 h-[32rem] w-[calc(100vw+10rem)] -translate-x-1/2 opacity-[0.05] mix-blend-multiply sm:left-[calc(50%+7rem)] sm:-top-24 sm:h-[34rem] sm:w-[calc(100vw+14rem)] sm:opacity-[0.065] dark:opacity-[0.036] dark:mix-blend-screen"
              style={{
                backgroundImage: "url('/images/hero-grain.svg')",
                backgroundSize: '260px 260px',
                maskImage:
                  'radial-gradient(ellipse 60% 48% at 50% 42%, rgba(0, 0, 0, 0.64) 0%, rgba(0, 0, 0, 0.32) 48%, transparent 78%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 60% 48% at 50% 42%, rgba(0, 0, 0, 0.64) 0%, rgba(0, 0, 0, 0.32) 48%, transparent 78%)',
              }}
            />

            <div className="relative z-10 space-y-7">
              <div className="space-y-4">
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
                    className="mask mask-squircle w-fit p-[2px] shadow-sm transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[2px] hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
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

              <div className="space-y-5">
                {introParagraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="max-w-[31rem] font-header text-[1rem] leading-[1.72] tracking-[-0.02em] text-foreground/84 sm:text-[1.03rem]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 sm:gap-x-5">
                <Link
                  href="/#contact"
                  className="group inline-flex min-h-[40px] items-center leading-none font-header text-[0.74rem] text-foreground transition-[color,transform] duration-150 hover:-translate-y-[1px] hover:text-foreground/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-[0.78rem]"
                  onClick={() => haptic.trigger('light')}
                >
                  <span className="underline decoration-transparent underline-offset-[0.2em] group-hover:decoration-current group-focus-visible:decoration-current">
                    Contact
                  </span>
                </Link>
                <Link
                  href="/cv"
                  className="group inline-flex min-h-[40px] items-center leading-none font-header text-[0.74rem] text-foreground transition-[color,transform] duration-150 hover:-translate-y-[1px] hover:text-foreground/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-[0.78rem]"
                  onClick={() => haptic.trigger('light')}
                >
                  <span className="underline decoration-transparent underline-offset-[0.2em] group-hover:decoration-current group-focus-visible:decoration-current">
                    View CV
                  </span>
                </Link>
                <button
                  type="button"
                  className="group inline-flex min-h-[40px] items-center leading-none font-header text-[0.74rem] text-foreground transition-[color,transform] duration-150 hover:-translate-y-[1px] hover:text-foreground/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-[0.78rem]"
                  onClick={() => {
                    haptic.trigger('light')
                    setResumeOpen(true)
                  }}
                >
                  <span className="underline decoration-transparent underline-offset-[0.2em] group-hover:decoration-current group-focus-visible:decoration-current">
                    Resume
                  </span>
                </button>
              </div>
            </div>
          </section>
        </Reveal>

        <div className="mt-20 space-y-16 sm:mt-24 sm:space-y-20">
          <Reveal delayMs={40}>
            <Section title="Projects">
              <div className="relative">
                <AnimatePresence initial={false}>
                  {activeProjectGlow ? (
                    <m.div
                      key={hoveredProjectSlug}
                      className="pointer-events-none absolute left-[-54%] top-[60%] z-0 h-[22rem] w-[210%] opacity-[0.72] blur-[58px]"
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 0.72, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{
                        opacity: { duration: 0.44, ease: MOTION_EASE_SOFT },
                        scale: { duration: 0.62, ease: MOTION_EASE_SOFT },
                      }}
                      style={{
                        background: activeProjectGlow,
                      }}
                    />
                  ) : null}
                </AnimatePresence>

                <div className="relative z-10 space-y-5">
                {projectRows.map((project) => (
                  <EditorialItem
                    key={project.slug}
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
                  />
                ))}
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
                />
                </div>
              </div>
            </Section>
          </Reveal>

          <Reveal delayMs={80}>
            <Section title="Endeavors">
              <div className="space-y-5">
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
              <div className="space-y-5">
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
              <div className="space-y-5">
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
            <Section title="Contact">
              <div
                className="relative space-y-6"
                onPointerEnter={trackContactGlowBounds}
                onPointerMove={updateContactGlow}
                onPointerLeave={resetContactGlow}
              >
                <div
                  ref={contactGlowRef}
                  className="pointer-events-none absolute left-[-56%] top-[18%] z-0 h-[20rem] w-[215%] opacity-90 blur-[58px] animated-contact-glow"
                  style={{
                    background:
                      'radial-gradient(ellipse at 20% 78%, rgba(255, 154, 64, 0.3) 0%, rgba(232, 96, 86, 0.08) 18%, rgba(255, 170, 86, 0.18) 32%, rgba(255, 188, 118, 0.1) 46%, rgba(255, 212, 168, 0.04) 58%, transparent 78%), radial-gradient(ellipse at 42% 64%, rgba(255, 185, 120, 0.08) 0%, rgba(215, 92, 92, 0.035) 24%, rgba(255, 205, 152, 0.04) 36%, transparent 60%)',
                  }}
                />

                <div className="relative z-10 space-y-6">
                  <ContactLinks />
                  <p className="max-w-[38rem] font-mono text-[1rem] leading-[1.7] text-muted-foreground">
                    If something here resonates, reach out.
                  </p>
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
