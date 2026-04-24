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
      className={`group relative flex w-full items-start justify-between gap-6 px-3 py-3 transition-[transform,color,opacity,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:-mx-3 sm:gap-10 ${
        interactive ? 'hover:translate-x-[3px] hover:bg-foreground/[0.03]' : ''
      }`}
    >
      <div className="flex min-w-0 items-start gap-4 sm:gap-6">
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

        <div className="min-w-0 space-y-1.5">
          {eyebrow ? (
            <p className={`${eyebrowClassName ?? 'font-mono text-muted-foreground/70 group-hover:text-muted-foreground'} text-[0.66rem] uppercase tracking-[0.12em] transition-colors duration-300`}>
              {eyebrow}
            </p>
          ) : null}
          <p className={`${titleFontClassName ?? 'font-mono'} text-[1.02rem] leading-none tracking-[-0.03em] text-foreground transition-colors duration-300 group-hover:text-foreground/86`}>
            <span
              className={
                underlineOnHover
                  ? `${titleFontClassName ?? ''} inline-block bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[length:0%_1px] bg-[position:0_100%] transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]`
                  : `${titleFontClassName ?? ''} inline-block`
              }
            >
              {title}
            </span>
          </p>
          <p className="max-w-[44rem] font-mono text-[0.96rem] leading-[1.65] text-muted-foreground transition-colors duration-300 group-hover:text-foreground/72">
            {description}
          </p>
        </div>
      </div>
      {trailing ? (
        <span className="shrink-0 pt-0.5 font-mono text-[0.84rem] text-muted-foreground/75 transition-[transform,color] duration-300 group-hover:translate-x-[2px] group-hover:text-foreground/72">
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
    <div className="flex flex-wrap gap-x-4 gap-y-3 sm:gap-x-5">
      {contactSocialLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noreferrer' : undefined}
          className="min-h-[40px] font-mono text-[0.92rem] text-foreground decoration-border underline underline-offset-[0.24em] transition-[color,transform,text-decoration-color] duration-150 hover:-translate-y-[1px] hover:text-foreground/70 hover:decoration-foreground/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-[0.94rem]"
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
  const playgroundGlowActive = hoveredProjectSlug === 'playground'
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
          <section className="space-y-8">
            <div className="space-y-7">
              <div className="space-y-4">
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
                  className="group inline-flex min-h-[40px] items-center leading-none font-header text-[0.68rem] text-foreground transition-[color,transform] duration-150 hover:-translate-y-[1px] hover:text-foreground/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-[0.7rem]"
                  onClick={() => haptic.trigger('light')}
                >
                  <span className="bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[length:0%_1px] bg-[position:0_100%] transition-[background-size] duration-200 group-hover:bg-[length:100%_1px] group-focus-visible:bg-[length:100%_1px]">
                    Contact
                  </span>
                </Link>
                <Link
                  href="/cv"
                  className="group inline-flex min-h-[40px] items-center leading-none font-header text-[0.68rem] text-foreground transition-[color,transform] duration-150 hover:-translate-y-[1px] hover:text-foreground/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-[0.7rem]"
                  onClick={() => haptic.trigger('light')}
                >
                  <span className="bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[length:0%_1px] bg-[position:0_100%] transition-[background-size] duration-200 group-hover:bg-[length:100%_1px] group-focus-visible:bg-[length:100%_1px]">
                    View CV
                  </span>
                </Link>
                <button
                  type="button"
                  className="group inline-flex min-h-[40px] items-center leading-none font-header text-[0.68rem] text-foreground transition-[color,transform] duration-150 hover:-translate-y-[1px] hover:text-foreground/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-[0.7rem]"
                  onClick={() => {
                    haptic.trigger('light')
                    setResumeOpen(true)
                  }}
                >
                  <span className="bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[length:0%_1px] bg-[position:0_100%] transition-[background-size] duration-200 group-hover:bg-[length:100%_1px] group-focus-visible:bg-[length:100%_1px]">
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
                  {playgroundGlowActive ? (
                    <m.div
                      className="pointer-events-none absolute left-[-54%] top-[60%] z-0 h-[22rem] w-[210%] opacity-90 blur-[58px]"
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{
                        opacity: { duration: 0.44, ease: MOTION_EASE_SOFT },
                        scale: { duration: 0.62, ease: MOTION_EASE_SOFT },
                      }}
                      style={{
                        background:
                          'radial-gradient(ellipse at 24% 48%, rgba(255, 154, 64, 0.48) 0%, rgba(255, 170, 86, 0.28) 20%, rgba(255, 188, 118, 0.14) 36%, rgba(255, 212, 168, 0.05) 52%, transparent 72%), radial-gradient(ellipse at 42% 58%, rgba(255, 185, 120, 0.16) 0%, rgba(255, 205, 152, 0.08) 28%, transparent 56%)',
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
                    description={project.frontmatter.description}
                    trailing={formatYear(project.frontmatter.date)}
                    titleFontClassName="font-header"
                    thumbnailImage={project.frontmatter.image}
                    thumbnailAlt={project.frontmatter.displayTitle || project.frontmatter.title}
                    underlineOnHover
                  />
                ))}
                <EditorialItem
                  href="/archive"
                  title="Playground"
                  description="Smaller creative coding experiments, prototypes, and side explorations that do not need the full case-study treatment."
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
                <p className="max-w-[38rem] font-mono text-[1rem] leading-[1.7] text-muted-foreground">
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
