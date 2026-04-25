'use client'

import { m, useReducedMotion } from 'framer-motion'
import BreadcrumbPill from '@/components/BreadcrumbPill'
import TextReveal from '@/components/TextReveal'
import * as Glyphs from '@/components/pixel/glyphs'
import { experienceItems, educationItems } from '@/content/homepage'
import { siteConfig } from '@/lib/site'
import { MOTION_EASE_SOFT } from '@/lib/motion'

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

export default function CVPageClient() {
  const prefersReducedMotion = useReducedMotion() ?? false

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
    <div className="relative min-h-screen">
      <div className="relative z-10 container mx-auto max-w-2xl px-4 sm:px-6">
        {/* Breadcrumb — hidden in print */}
        <div className="mb-10 sm:mb-14 flex justify-start pt-4 sm:pt-6 print:hidden">
          <BreadcrumbPill href="/" parentLabel="Home" currentLabel="CV" />
        </div>

        {/* Header */}
        <header className="pb-8 sm:pb-10 pt-8 sm:pt-12 print:pt-0 print:pb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-mono text-[14px] font-semibold tracking-[0.08em] uppercase text-foreground sm:text-[15px]">
                <TextReveal text="Hunter Bastian" as="span" trigger duration={0.5} staggerDelay={0.08} startDelay={0.1} filter />
              </h1>
              <p className="mt-2 text-[13px] text-muted-foreground">
                <TextReveal text={siteConfig.siteDescription} as="span" trigger duration={0.4} staggerDelay={0.03} startDelay={0.4} />
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="print:hidden ml-4 inline-flex min-h-[40px] shrink-0 items-center border border-border bg-card px-3 py-1.5 text-[10px] font-mono tracking-[0.12em] text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              aria-label="Print or save as PDF"
            >
              Print
            </button>
          </div>

          {/* Contact links */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-mono tracking-wide text-muted-foreground/70">
            <span>Utah, USA</span>
            <span className="text-border">·</span>
            <a href="mailto:hunterbastianux@gmail.com" className="underline-offset-4 hover:text-foreground hover:underline transition-colors">
              hunterbastianux@gmail.com
            </a>
            <span className="text-border">·</span>
            <a href="https://hunterbastian.com" className="underline-offset-4 hover:text-foreground hover:underline transition-colors print:no-underline">
              hunterbastian.com
            </a>
            <span className="text-border">·</span>
            <a href="https://linkedin.com/in/hunterbastian" className="underline-offset-4 hover:text-foreground hover:underline transition-colors">
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
