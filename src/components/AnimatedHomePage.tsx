'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, m } from 'framer-motion'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { useWebHaptics } from 'web-haptics/react'
import {
  creatingLinks,
  educationItems,
  experienceItems,
  homeHeroContent,
} from '@/content/homepage'
import { ContactLinks } from '@/components/home/ContactLinks'
import { EditorialItem } from '@/components/home/EditorialItem'
import { Reveal, Section } from '@/components/home/HomeSection'
import ResumeModal from '@/components/ResumeModal'
import { showJoyToast } from '@/lib/joy'
import { MOTION_EASE_SOFT } from '@/lib/motion'
import { analytics } from '@/lib/analytics'
import {
  PROJECT_GLOW_GRADIENTS,
  WORK_FILTER_LABELS,
  formatProjectYear,
  getHomeProjectDescription,
  getProjectAccent,
  getProjectRows,
  normalizeWorkFilter,
  type HomeProject,
  type WorkFilter,
} from '@/lib/home-projects'

interface AnimatedHomePageProps {
  projects: HomeProject[]
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export default function AnimatedHomePage({ projects }: AnimatedHomePageProps) {
  const introParagraphs = homeHeroContent.intro.split('\n\n')
  const [hoveredProjectSlug, setHoveredProjectSlug] = useState<string | null>(null)
  const [resumeOpen, setResumeOpen] = useState(false)
  const [workFilter, setWorkFilter] = useState<WorkFilter>('all')
  const [heroGlowActive, setHeroGlowActive] = useState(false)
  const [contactGlowActive, setContactGlowActive] = useState(false)
  const heroGlowRef = useRef<HTMLDivElement | null>(null)
  const heroGrainRef = useRef<HTMLDivElement | null>(null)
  const heroGlowBoundsRef = useRef<DOMRect | null>(null)
  const heroGlowFrameRef = useRef<number | null>(null)
  const heroGlowPointerRef = useRef({ x: 0, y: 0 })
  const heroGlowCurrentRef = useRef({ x: 0, y: 0 })
  const contactGlowRef = useRef<HTMLDivElement | null>(null)
  const contactGlowBoundsRef = useRef<DOMRect | null>(null)
  const contactGlowFrameRef = useRef<number | null>(null)
  const contactGlowPointerRef = useRef({ x: 0, y: 0 })
  const haptic = useWebHaptics()
  const projectRows = getProjectRows(projects, workFilter)

  const applyWorkFilter = (filter: WorkFilter) => {
    setWorkFilter(filter)

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      if (filter === 'all') {
        url.searchParams.delete('work')
      } else {
        url.searchParams.set('work', filter)
      }
      url.hash = 'projects'
      window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
      window.requestAnimationFrame(() => {
        document.getElementById('projects')?.scrollIntoView({ block: 'start', behavior: 'smooth' })
      })
    }
  }

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

  useEffect(() => {
    const syncFilterFromUrl = () => {
      setWorkFilter(normalizeWorkFilter(new URL(window.location.href).searchParams.get('work')))
    }

    const handleExternalFilter = (event: Event) => {
      const detail = (event as CustomEvent<{ filter?: string }>).detail
      setWorkFilter(normalizeWorkFilter(detail?.filter))
    }

    syncFilterFromUrl()
    window.addEventListener('popstate', syncFilterFromUrl)
    window.addEventListener('hb-work-filter', handleExternalFilter as EventListener)

    return () => {
      window.removeEventListener('popstate', syncFilterFromUrl)
      window.removeEventListener('hb-work-filter', handleExternalFilter as EventListener)
    }
  }, [])

  const writeHeroGlowPosition = () => {
    const glow = heroGlowRef.current
    const grain = heroGrainRef.current
    const target = heroGlowPointerRef.current
    const current = heroGlowCurrentRef.current

    current.x += (target.x - current.x) * 0.09
    current.y += (target.y - current.y) * 0.09

    const glowX = clamp(current.x * 16, -16, 16)
    const glowY = clamp(current.y * 8, -8, 8)

    if (glow) {
      glow.style.setProperty('--hero-glow-cursor-x', `${glowX}px`)
      glow.style.setProperty('--hero-glow-cursor-y', `${glowY}px`)
    }

    if (grain) {
      grain.style.setProperty('--hero-grain-cursor-x', `${glowX * 0.55}px`)
      grain.style.setProperty('--hero-grain-cursor-y', `${glowY * 0.55}px`)
    }

    if (Math.abs(target.x - current.x) > 0.002 || Math.abs(target.y - current.y) > 0.002) {
      heroGlowFrameRef.current = window.requestAnimationFrame(writeHeroGlowPosition)
      return
    }

    heroGlowCurrentRef.current = { x: target.x, y: target.y }
    heroGlowFrameRef.current = null
  }

  const scheduleHeroGlowPosition = () => {
    if (heroGlowFrameRef.current === null) {
      heroGlowFrameRef.current = window.requestAnimationFrame(writeHeroGlowPosition)
    }
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

    scheduleHeroGlowPosition()
  }

  const resetHeroGlow = () => {
    heroGlowBoundsRef.current = null
    heroGlowPointerRef.current = { x: 0, y: 0 }
    setHeroGlowActive(false)
    scheduleHeroGlowPosition()
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
    <div className="relative isolate overflow-x-clip px-5 pb-10 sm:px-8 sm:pb-32">
      <div aria-hidden="true" className="home-painterly-washes">
        <span className="home-painterly-wash home-painterly-wash-hero" />
        <span className="home-painterly-wash home-painterly-wash-projects" />
        <span className="home-painterly-wash home-painterly-wash-contact" />
      </div>

      <div className="mx-auto max-w-[36rem] pt-9 sm:pt-28">
        <Reveal>
          <section
            className="relative isolate space-y-6 sm:min-h-[20.5rem] sm:space-y-8"
            onPointerEnter={trackHeroGlowBounds}
            onPointerMove={updateHeroGlow}
            onPointerLeave={resetHeroGlow}
          >
            <div
              ref={heroGlowRef}
              aria-hidden="true"
              className={`animated-hero-glow pointer-events-none absolute left-[calc(50%+2rem)] -top-20 -z-10 h-[28rem] w-[calc(100vw+2rem)] overflow-hidden opacity-[0.3] blur-lg transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform sm:left-[calc(50%+7rem)] sm:-top-28 sm:h-[34rem] sm:w-[calc(100vw+12rem)] sm:opacity-[0.38] sm:blur-xl dark:opacity-[0.24] ${
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
                loading="lazy"
                fetchPriority="low"
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
              className={`animated-hero-grain pointer-events-none absolute left-[calc(50%+2rem)] -top-16 -z-10 h-[28rem] w-[calc(100vw+2rem)] opacity-[0.04] mix-blend-multiply transition-transform duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform sm:left-[calc(50%+7rem)] sm:-top-24 sm:h-[34rem] sm:w-[calc(100vw+14rem)] sm:opacity-[0.065] dark:opacity-[0.036] dark:mix-blend-screen ${
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

            <div className="relative z-10 space-y-5 sm:space-y-7">
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
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-[5px] border border-border/70 bg-background px-2 py-1 font-mono text-[0.62rem] leading-none text-muted-foreground opacity-0 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.35)] blur-[4px] transition-[opacity,transform,filter] duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-hover:blur-0"
                  >
                    hi
                  </span>
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

              <div className="space-y-3.5 sm:space-y-5">
                {introParagraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="max-w-[31rem] font-header text-[0.96rem] leading-[1.54] tracking-[-0.02em] text-foreground/84 sm:text-[1.03rem] sm:leading-[1.72]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 sm:gap-x-5 sm:gap-y-2.5">
                <Link
                  href="/#contact"
                  className="group group/peek relative inline-flex min-h-[40px] min-w-[40px] origin-center touch-manipulation items-center leading-none font-header text-[0.74rem] text-foreground transition-[color,transform] duration-150 hover:-translate-y-[1px] hover:text-foreground/70 active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-[0.78rem]"
                  onClick={() => {
                    haptic.trigger('light')
                    analytics.navigationClick('contact')
                    showJoyToast('Say hi')
                  }}
                >
                  <span className="underline decoration-transparent underline-offset-[0.2em] group-hover:decoration-current group-focus-visible:decoration-current">
                    Contact
                  </span>
                  <span aria-hidden="true" className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 hidden -translate-x-1/2 translate-y-1 whitespace-nowrap border border-border/70 bg-background/92 px-2 py-1 font-mono text-[0.62rem] text-muted-foreground opacity-0 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.35)] blur-[4px] transition-[opacity,transform,filter] duration-200 group-hover/peek:translate-y-0 group-hover/peek:opacity-100 group-hover/peek:blur-0 group-focus-visible/peek:translate-y-0 group-focus-visible/peek:opacity-100 group-focus-visible/peek:blur-0 sm:block">
                    Say hi
                  </span>
                </Link>
                <Link
                  href="/cv"
                  className="group group/peek relative inline-flex min-h-[40px] min-w-[40px] origin-center touch-manipulation items-center leading-none font-header text-[0.74rem] text-foreground transition-[color,transform] duration-150 hover:-translate-y-[1px] hover:text-foreground/70 active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-[0.78rem]"
                  onClick={() => {
                    haptic.trigger('light')
                    analytics.navigationClick('resume')
                    showJoyToast('Opening resume')
                  }}
                >
                  <span className="underline decoration-transparent underline-offset-[0.2em] group-hover:decoration-current group-focus-visible:decoration-current">
                    Resume
                  </span>
                  <span aria-hidden="true" className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 hidden -translate-x-1/2 translate-y-1 whitespace-nowrap border border-border/70 bg-background/92 px-2 py-1 font-mono text-[0.62rem] text-muted-foreground opacity-0 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.35)] blur-[4px] transition-[opacity,transform,filter] duration-200 group-hover/peek:translate-y-0 group-hover/peek:opacity-100 group-hover/peek:blur-0 group-focus-visible/peek:translate-y-0 group-focus-visible/peek:opacity-100 group-focus-visible/peek:blur-0 sm:block">
                    Open resume
                  </span>
                </Link>
                <button
                  type="button"
                  className="group group/peek relative inline-flex min-h-[40px] min-w-[40px] origin-center touch-manipulation items-center leading-none font-header text-[0.74rem] text-foreground transition-[color,transform] duration-150 hover:-translate-y-[1px] hover:text-foreground/70 active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-[0.78rem]"
                  onClick={() => {
                    haptic.trigger('light')
                    analytics.resumeAction('view', { source: 'home_hero' })
                    showJoyToast('Previewing resume')
                    setResumeOpen(true)
                  }}
                >
                  <span className="underline decoration-transparent underline-offset-[0.2em] group-hover:decoration-current group-focus-visible:decoration-current">
                    Preview
                  </span>
                  <span aria-hidden="true" className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 hidden -translate-x-1/2 translate-y-1 whitespace-nowrap border border-border/70 bg-background/92 px-2 py-1 font-mono text-[0.62rem] text-muted-foreground opacity-0 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.35)] blur-[4px] transition-[opacity,transform,filter] duration-200 group-hover/peek:translate-y-0 group-hover/peek:opacity-100 group-hover/peek:blur-0 group-focus-visible/peek:translate-y-0 group-focus-visible/peek:opacity-100 group-focus-visible/peek:blur-0 sm:block">
                    Preview resume
                  </span>
                </button>
              </div>
            </div>
          </section>
        </Reveal>

        <div className="mt-10 space-y-9 sm:mt-24 sm:space-y-20">
          <Reveal delayMs={40}>
            <Section id="projects" title="Projects">
              <div className="relative">
                <div className="relative z-10 space-y-3 sm:space-y-5">
                  {workFilter !== 'all' ? (
                    <div className="flex items-center justify-between gap-3 border border-border/65 bg-background/50 px-2.5 py-2 font-mono text-[0.68rem] text-muted-foreground">
                      <span>
                        Showing <span className="text-foreground">{WORK_FILTER_LABELS[workFilter]}</span>
                      </span>
                      <button
                        type="button"
                        className="min-h-[32px] origin-center touch-manipulation text-foreground underline decoration-border underline-offset-[0.22em] transition-[color,transform,text-decoration-color] duration-150 hover:text-[var(--contact-accent)] hover:decoration-[color-mix(in_srgb,var(--contact-accent)_64%,transparent)] active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                        onClick={() => {
                          haptic.trigger('light')
                          analytics.navigationClick('work_filter_all')
                          applyWorkFilter('all')
                          showJoyToast('Showing all work')
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  ) : null}
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
                          trailing={formatProjectYear(project.frontmatter.date)}
                          titleFontClassName="font-header"
                          onMouseEnter={() => setHoveredProjectSlug(project.slug)}
                          onMouseLeave={() => setHoveredProjectSlug((current) => (current === project.slug ? null : current))}
                          thumbnailImage={project.frontmatter.image}
                          thumbnailAlt={project.frontmatter.displayTitle || project.frontmatter.title}
                          underlineOnHover
                          hoverAccentColor={getProjectAccent(project.slug)}
                          toastMessage="Opening project"
                          tracking={() => analytics.projectClick(project.slug, project.frontmatter.displayTitle || project.frontmatter.title)}
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
                        hoverAccentColor={getProjectAccent('playground')}
                        toastMessage="Opening playground"
                        tracking={() => analytics.navigationClick('archive')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          </Reveal>

          <Reveal delayMs={80}>
            <Section title="Endeavors">
              <div className="space-y-3 sm:space-y-5">
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
                    tracking={() => analytics.externalLink(link.href, link.label.toLowerCase())}
                  />
                ))}
              </div>
            </Section>
          </Reveal>

          <Reveal delayMs={120}>
            <Section title="Experience">
              <div className="space-y-3 sm:space-y-5">
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
              <div className="space-y-3 sm:space-y-5">
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
            <section id="contact" className="scroll-mt-24">
              <div
                className="contact-aqua-stage relative left-1/2 isolate w-[min(92vw,82rem)] -translate-x-1/2 overflow-hidden px-5 py-14 sm:px-12 sm:py-20"
                onPointerEnter={trackContactGlowBounds}
                onPointerMove={updateContactGlow}
                onPointerLeave={resetContactGlow}
              >
                <div
                  ref={contactGlowRef}
                  className={`animated-contact-glow pointer-events-none absolute left-[-20%] top-[14%] z-0 h-[22rem] w-[140%] opacity-30 blur-[58px] sm:left-[-46%] sm:top-[10%] sm:h-[28rem] sm:w-[190%] sm:opacity-35 sm:blur-[76px] ${
                    contactGlowActive ? 'is-active' : ''
                  }`}
                  style={{
                    background:
                      'radial-gradient(ellipse at 50% 56%, rgba(211,228,247,0.36) 0%, rgba(222,235,249,0.22) 34%, transparent 72%), radial-gradient(ellipse at 18% 34%, rgba(255,255,255,0.5) 0%, transparent 50%)',
                  }}
                />

                <div className="relative z-10 mx-auto max-w-[47rem] text-center">
                  <div className="space-y-4 sm:space-y-5">
                    <span className="contact-aqua-badge mx-auto inline-flex min-h-[32px] items-center rounded-full px-5 font-header text-[0.78rem] font-normal leading-none text-muted-foreground/82 sm:text-[0.86rem]">
                      Let&apos;s work together
                    </span>
                    <div className="space-y-3 sm:space-y-4">
                      <h2 className="font-mono text-[2.35rem] font-normal leading-[0.98] tracking-[-0.055em] text-foreground/94 sm:text-[4rem]">
                        Ideas. Design. Impact.
                      </h2>
                      <p className="mx-auto max-w-[31rem] font-mono text-[0.98rem] leading-[1.55] tracking-[-0.02em] text-muted-foreground/72 sm:text-[1.12rem] sm:leading-[1.62]">
                        If something here resonates, reach out.
                      </p>
                    </div>
                  </div>

                  <div className="mt-9 sm:mt-11">
                    <ContactLinks />
                  </div>
                </div>
              </div>
            </section>
          </Reveal>
        </div>
      </div>

      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  )
}
