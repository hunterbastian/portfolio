'use client'

import Image from 'next/image'
import { AnimatePresence, m } from 'framer-motion'
import { useState } from 'react'
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
import { PeekAction } from '@/components/PeekAction'
import { logoFrameClassName } from '@/components/ui/tactile'
import { showJoyToast } from '@/lib/joy'
import { MOTION_EASE_SOFT } from '@/lib/motion'
import { analytics } from '@/lib/analytics'
import { useHeroGlow } from '@/lib/use-hero-glow'
import { useWorkFilterUrlSync } from '@/lib/use-work-filter-url-sync'
import {
  PROJECT_GLOW_GRADIENTS,
  WORK_FILTER_LABELS,
  formatProjectYear,
  getHomeProjectDescription,
  getProjectAccent,
  getProjectRows,
  type HomeProject,
  type WorkFilter,
} from '@/lib/home-projects'

interface AnimatedHomePageProps {
  projects: HomeProject[]
}

export default function AnimatedHomePage({ projects }: AnimatedHomePageProps) {
  const introParagraphs = homeHeroContent.intro.split('\n\n')
  const [hoveredProjectSlug, setHoveredProjectSlug] = useState<string | null>(null)
  const [workFilter, setWorkFilter] = useState<WorkFilter>('all')
  const heroGlow = useHeroGlow()
  const haptic = useWebHaptics()
  const projectRows = getProjectRows(projects, workFilter)

  useWorkFilterUrlSync(setWorkFilter)

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

  return (
    <div className="relative isolate overflow-x-clip px-5 pb-10 sm:px-8 sm:pb-32">
      <div aria-hidden="true" className="home-painterly-washes">
        <span className="home-painterly-wash home-painterly-wash-hero" />
        <span className="home-painterly-wash home-painterly-wash-projects" />
        <span className="home-painterly-wash home-painterly-wash-contact" />
      </div>
      <div aria-hidden="true" className="home-coast-outro" />

      <div className="mx-auto max-w-[36rem] pt-9 sm:pt-28">
        <Reveal>
          <section
            className="relative isolate min-h-[calc(100svh-5.5rem)] pb-4 sm:min-h-[calc(100svh-10rem)] sm:pb-6"
            onPointerEnter={heroGlow.handlers.onPointerEnter}
            onPointerMove={heroGlow.handlers.onPointerMove}
            onPointerLeave={heroGlow.handlers.onPointerLeave}
          >
            <div
              ref={heroGlow.glowRef}
              aria-hidden="true"
              className={`animated-hero-glow pointer-events-none absolute left-1/2 -top-14 -z-10 h-[27rem] w-[112vw] -translate-x-1/2 overflow-hidden opacity-100 blur-[2.5px] transition-transform duration-[1600ms] ease-soft will-change-transform sm:-top-20 sm:h-[34rem] sm:w-[min(92rem,112vw)] sm:blur-[3.5px] ${
                heroGlow.isActive ? 'is-active' : ''
              }`}
              style={{
                maskImage:
                  'radial-gradient(ellipse 56% 54% at 50% 42%, black 0%, rgba(0, 0, 0, 0.88) 28%, rgba(0, 0, 0, 0.42) 58%, rgba(0, 0, 0, 0.1) 82%, transparent 100%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 56% 54% at 50% 42%, black 0%, rgba(0, 0, 0, 0.88) 28%, rgba(0, 0, 0, 0.42) 58%, rgba(0, 0, 0, 0.1) 82%, transparent 100%)',
              }}
            >
              <Image
                src="/images/mediterranean-ambient-home.webp"
                alt=""
                fill
                loading="eager"
                fetchPriority="low"
                className="scale-[1.02] object-cover object-[50%_48%] saturate-[1.08] brightness-[1.03] contrast-[0.98]"
                sizes="100vw"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(245, 252, 254, 0.18) 0%, transparent 34%, rgba(255, 199, 139, 0.1) 78%, transparent 100%)',
                }}
              />
              <div className="absolute inset-0 bg-background/8" />
            </div>

            <div
              ref={heroGlow.grainRef}
              aria-hidden="true"
              className={`animated-hero-grain pointer-events-none absolute left-[calc(50%+2rem)] -top-10 -z-10 h-[28rem] w-[calc(100vw+2rem)] opacity-[0.04] mix-blend-multiply transition-transform duration-[1800ms] ease-soft will-change-transform sm:left-[calc(50%+7rem)] sm:-top-16 sm:h-[34rem] sm:w-[calc(100vw+14rem)] sm:opacity-[0.065] ${
                heroGlow.isActive ? 'is-active' : ''
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
                    className="pointer-events-none absolute -inset-10 -z-10 rounded-full opacity-0 blur-3xl scale-90 transition-[opacity,transform] duration-500 ease-soft group-hover:opacity-100 group-hover:scale-100"
                    style={{
                      background:
                        'radial-gradient(ellipse at 48% 52%, rgba(255, 72, 0, 0.56) 0%, rgba(255, 103, 16, 0.42) 32%, rgba(255, 178, 66, 0.22) 58%, transparent 80%)',
                    }}
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-10 -z-10 hidden rounded-full opacity-0 blur-3xl scale-90 transition-[opacity,transform] duration-500 ease-soft group-hover:opacity-100 group-hover:scale-100"
                    style={{
                      background:
                        'radial-gradient(ellipse at 48% 52%, rgba(255, 78, 0, 0.4) 0%, rgba(255, 114, 18, 0.3) 34%, rgba(255, 178, 66, 0.16) 60%, transparent 82%)',
                    }}
                  />
                  <div
                    className="mask mask-squircle w-fit p-[2px] shadow-sm transition-[transform,box-shadow,background-color] duration-200 ease-soft hover:-translate-y-[2px] hover:scale-[1.01] hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
                    style={{ background: 'var(--border)' }}
                  >
                    <Image
                      src="/images/profilepicture.webp"
                      alt="Outdoor photograph of Hunter Bastian walking along a mountain road."
                      width={75}
                      height={75}
                      priority
                      className="mask mask-squircle object-cover img-inset-outline transition-[filter,transform] duration-200 ease-soft hover:scale-[1.02] hover:brightness-[1.02]"
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
                <PeekAction
                  href="/#contact"
                  peek="Say hi"
                  className="text-[0.74rem] text-foreground hover:text-foreground/70 sm:text-[0.78rem]"
                  labelClassName="underline decoration-transparent underline-offset-[0.2em] group-hover/peek:decoration-current group-focus-visible/peek:decoration-current"
                  onClick={() => {
                    haptic.trigger('light')
                    analytics.navigationClick('contact')
                    showJoyToast('Say hi')
                  }}
                >
                  Contact
                </PeekAction>
                <PeekAction
                  href="/cv"
                  peek="Open resume"
                  className="text-[0.74rem] text-foreground hover:text-foreground/70 sm:text-[0.78rem]"
                  labelClassName="underline decoration-transparent underline-offset-[0.2em] group-hover/peek:decoration-current group-focus-visible/peek:decoration-current"
                  onClick={() => {
                    haptic.trigger('light')
                    analytics.navigationClick('resume')
                    showJoyToast('Opening resume')
                  }}
                >
                  Resume
                </PeekAction>
              </div>
            </div>
          </section>
        </Reveal>

        <div className="mt-7 space-y-9 sm:mt-10 sm:space-y-20">
          <Reveal delayMs={40}>
            <Section
              id="projects"
              title="Projects"
              contentGapClassName="space-y-2 sm:space-y-3"
              scrollMarginClassName="scroll-mt-10 sm:scroll-mt-12"
            >
              <div className="relative">
                <div className="relative z-10 space-y-3 sm:space-y-5">
                  {workFilter !== 'all' ? (
                    <div className="flex items-center justify-between gap-3 border border-border/65 bg-background/50 px-2.5 py-2 font-mono text-[0.68rem] text-muted-foreground">
                      <span>
                        Showing <span className="text-foreground">{WORK_FILTER_LABELS[workFilter]}</span>
                      </span>
                      <button
                        type="button"
                        className="min-h-[40px] min-w-[40px] origin-center touch-manipulation text-foreground underline decoration-border underline-offset-[0.22em] transition-[color,transform,text-decoration-color] duration-150 hover:text-[var(--contact-accent)] hover:decoration-[color-mix(in_srgb,var(--contact-accent)_64%,transparent)] active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
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
                    titleLeadingIcon={
                      link.iconType === 'studio-alpine' ? (
                        <span
                          aria-hidden="true"
                          className={logoFrameClassName}
                        >
                          <Image
                            src="/images/optimized/studio-alpine-linkedin-logo.svg"
                            alt=""
                            fill
                            sizes="22px"
                            className="object-cover"
                            unoptimized
                          />
                        </span>
                      ) : null
                    }
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
            <Section id="contact" title="Contact">
              <div className="space-y-5 sm:space-y-7">
                <div className="space-y-2">
                  <p className="max-w-[31rem] font-header text-[0.9rem] font-semibold leading-[1.58] tracking-[-0.02em] text-muted-foreground sm:text-[0.96rem] sm:leading-[1.65]">
                    If something here resonates, reach out.
                  </p>
                </div>
                <ContactLinks />
              </div>
            </Section>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
