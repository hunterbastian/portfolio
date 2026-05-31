'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { m, useReducedMotion } from 'framer-motion'
import BreadcrumbPill from '@/components/BreadcrumbPill'
import TextReveal from '@/components/TextReveal'
import * as Glyphs from '@/components/pixel/glyphs'
import { experienceItems, educationItems } from '@/content/homepage'
import { siteConfig } from '@/lib/site'
import { MOTION_EASE_SOFT } from '@/lib/motion'
import { analytics } from '@/lib/analytics'

const STAGGER_DELAY = 0.06

const CV_KIND_GLYPHS = {
  work: Glyphs.Work,
  writing: Glyphs.Writing,
} as const

function SectionHeading({
  children,
  delay = 0,
  kind,
}: {
  children: string
  delay?: number
  kind?: keyof typeof CV_KIND_GLYPHS
}) {
  const Glyph = kind ? CV_KIND_GLYPHS[kind] : null
  return (
    <h2 className="font-mono text-[11px] font-medium tracking-[0.16em] uppercase text-muted-foreground mb-5 inline-flex items-center gap-2">
      {Glyph ? <Glyph size={10} className="text-muted-foreground/70" /> : null}
      <TextReveal text={children} as="span" trigger duration={0.4} staggerDelay={0.06} startDelay={delay} />
    </h2>
  )
}

function Divider() {
  return <div className="border-t border-border/40 print:border-border/20" />
}

function ResumeArtworkStrip() {
  return (
    <div
      aria-hidden="true"
      className="relative mt-5 h-[4.25rem] w-full overflow-hidden border border-border/68 bg-card/45 shadow-[0_16px_38px_-32px_rgba(43,39,34,0.48),inset_0_1px_0_rgba(255,255,255,0.7)] print:hidden sm:h-[5rem]"
    >
      <Image
        src="/images/mediterranean-ambient-home.webp"
        alt=""
        fill
        priority
        className="scale-[1.04] object-cover object-[48%_56%] saturate-[0.86] contrast-[0.98] sepia-[0.08]"
        sizes="(min-width: 768px) 42rem, calc(100vw - 2rem)"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(249,247,242,0.18)_0%,transparent_36%,rgba(255,247,236,0.24)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-foreground/10" />
    </div>
  )
}

export default function CVPageClient() {
  const prefersReducedMotion = useReducedMotion() ?? false

  useEffect(() => {
    analytics.resumeAction('view')
  }, [])

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: prefersReducedMotion ? 0 : 0.3 + i * STAGGER_DELAY,
        duration: prefersReducedMotion ? 0 : 0.4,
        ease: MOTION_EASE_SOFT,
      },
    }),
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="cv-glow pointer-events-none fixed inset-0 z-0 opacity-[0.13] print:hidden"
        aria-hidden="true"
      />
      <div className="relative z-10 container mx-auto max-w-2xl px-4 sm:px-6">
        {/* Breadcrumb — hidden in print */}
        <div className="mb-10 sm:mb-14 flex justify-start pt-4 sm:pt-6 print:hidden">
          <BreadcrumbPill href="/" parentLabel="Home" currentLabel="Resume" />
        </div>

        {/* Header */}
        <header className="pb-8 pt-8 print:pb-6 print:pt-0 sm:pb-10 sm:pt-12">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground/58 print:hidden">
                Resume
              </p>
              <h1 className="mt-1.5 font-header text-[1.12rem] tracking-[-0.03em] text-foreground/92 sm:text-[1.22rem]">
                <TextReveal text="Hunter Bastian" as="span" trigger duration={0.5} staggerDelay={0.08} startDelay={0.1} filter />
              </h1>
              <p className="mt-2 max-w-[32rem] font-header text-[0.95rem] leading-[1.62] tracking-[-0.02em] text-muted-foreground sm:text-[1rem]">
                <TextReveal text={siteConfig.siteDescription} as="span" trigger duration={0.4} staggerDelay={0.03} startDelay={0.4} />
              </p>
            </div>
            <button
              onClick={() => {
                analytics.resumeAction('print')
                window.print()
              }}
              className="ml-4 inline-flex min-h-[40px] origin-center touch-manipulation shrink-0 items-center border border-border/70 bg-[color-mix(in_srgb,var(--background)_82%,#fff7ed)] px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-muted-foreground shadow-[0_10px_24px_-22px_rgba(43,39,34,0.46),inset_0_1px_0_rgba(255,255,255,0.72)] transition-[color,transform,border-color,box-shadow] duration-150 hover:-translate-y-[1px] hover:border-[color-mix(in_srgb,var(--contact-accent)_28%,var(--border))] hover:text-foreground hover:shadow-[0_14px_30px_-24px_rgba(43,39,34,0.55),inset_0_1px_0_rgba(255,255,255,0.82)] active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 print:hidden"
              aria-label="Print or save as PDF"
            >
              Print
            </button>
          </div>

          <ResumeArtworkStrip />

          {/* Contact links */}
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] font-mono tracking-wide text-muted-foreground/70 print:mt-2">
            <span>Utah, USA</span>
            <span className="text-border">·</span>
            <a
              href="mailto:hunterbastianux@gmail.com"
              className="origin-center touch-manipulation underline-offset-4 transition-[color,transform,text-decoration-color] duration-150 hover:text-foreground hover:underline active:translate-y-0 active:scale-[0.96]"
              onClick={() => analytics.externalLink('mailto:hunterbastianux@gmail.com', 'email')}
            >
              hunterbastianux@gmail.com
            </a>
            <span className="text-border">·</span>
            <a
              href="https://hunterbastian.com"
              className="origin-center touch-manipulation underline-offset-4 transition-[color,transform,text-decoration-color] duration-150 hover:text-foreground hover:underline active:translate-y-0 active:scale-[0.96] print:no-underline"
              onClick={() => analytics.navigationClick('portfolio_link')}
            >
              hunterbastian.com
            </a>
            <span className="text-border">·</span>
            <a
              href="https://linkedin.com/in/hunterbastian"
              className="origin-center touch-manipulation underline-offset-4 transition-[color,transform,text-decoration-color] duration-150 hover:text-foreground hover:underline active:translate-y-0 active:scale-[0.96]"
              onClick={() => analytics.externalLink('https://linkedin.com/in/hunterbastian', 'linkedin')}
            >
              LinkedIn
            </a>
          </div>
        </header>

        <Divider />

        {/* Experience */}
        <section className="py-8 sm:py-10 print:py-5">
          <SectionHeading delay={0.5} kind="work">Experience</SectionHeading>
          <div className="space-y-5">
            {experienceItems.map((item, i) => (
              <m.div
                key={`${item.company}-${item.year}`}
                className="group grid gap-y-1 sm:grid-cols-[1fr_auto] sm:gap-x-4 sm:items-baseline"
                variants={itemVariants}
                custom={i}
                initial="hidden"
                animate="visible"
              >
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="text-[13px] font-medium text-foreground">{item.company}</span>
                    <span className="text-[11px] text-muted-foreground/60">·</span>
                    <span className="text-[12px] text-muted-foreground">{item.title}</span>
                  </div>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground/70">{item.description}</p>
                </div>
                <span className="text-[11px] font-mono tracking-wide text-muted-foreground/50 whitespace-nowrap sm:justify-self-end">{item.year}</span>
              </m.div>
            ))}
          </div>
        </section>

        <Divider />

        {/* Education */}
        <section className="py-8 sm:py-10 print:py-5">
          <SectionHeading delay={0.8} kind="writing">Education</SectionHeading>
          <div className="space-y-5">
            {educationItems.map((item, i) => (
              <m.div
                key={`${item.institution}-${item.year}`}
                className="group grid gap-y-1 sm:grid-cols-[1fr_auto] sm:gap-x-4 sm:items-baseline"
                variants={itemVariants}
                custom={i + experienceItems.length}
                initial="hidden"
                animate="visible"
              >
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="text-[13px] font-medium text-foreground">{item.institution}</span>
                    <span className="text-[11px] text-muted-foreground/60">·</span>
                    <span className="text-[12px] text-muted-foreground">{item.degree}</span>
                  </div>
                  <p className="mt-1 text-[12px] text-muted-foreground/70">
                    {item.level}
                    {item.note && <span className="ml-2 font-mono text-[10px] tracking-wider text-accent/80 uppercase">{item.note}</span>}
                  </p>
                </div>
                <span className="text-[11px] font-mono tracking-wide text-muted-foreground/50 whitespace-nowrap sm:justify-self-end">{item.year}</span>
              </m.div>
            ))}
          </div>
        </section>

        {/* Bottom spacer */}
        <div className="pb-16 sm:pb-24 print:pb-4" />
      </div>
    </div>
  )
}
