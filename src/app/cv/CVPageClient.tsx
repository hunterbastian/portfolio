'use client'

import { Fragment, useEffect } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import BreadcrumbPill from '@/components/BreadcrumbPill'
import TextReveal from '@/components/TextReveal'
import * as Glyphs from '@/components/pixel/glyphs'
import { experienceItems, educationItems } from '@/content/homepage'
import { siteConfig } from '@/lib/site'
import { analytics } from '@/lib/analytics'
import {
  CV_CONTACT_LINKS,
  CV_CONTACT_LIST_CLASS_NAME,
  CV_ITEM_HIDDEN_MOTION,
  CV_LOCATION_LABEL,
  CV_PRINT_ARIA_LABEL,
  CV_PRINT_BUTTON_CLASS_NAME,
  CV_PRINT_BUTTON_LABEL,
  CV_RESUME_VIEW_ACTION,
  activateCvContactClick,
  activateCvPrint,
  getCvContactLinkClassName,
  getCvItemVisibleMotion,
  type CvContactLink,
} from '@/lib/cv-page'

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

function trackCvContactClick(link: CvContactLink) {
  activateCvContactClick({
    link,
    trackExternalLink: (href, platform) => analytics.externalLink(href, platform),
    trackNavigationClick: (target) => analytics.navigationClick(target),
  })
}

export default function CVPageClient() {
  const prefersReducedMotion = useReducedMotion() ?? false

  useEffect(() => {
    analytics.resumeAction(CV_RESUME_VIEW_ACTION)
  }, [])

  const itemVariants = {
    hidden: CV_ITEM_HIDDEN_MOTION,
    visible: (i: number) => getCvItemVisibleMotion(i, prefersReducedMotion),
  }

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 container mx-auto max-w-2xl px-4 sm:px-6">
        {/* Breadcrumb — hidden in print */}
        <div className="mb-10 sm:mb-14 flex justify-start pt-4 sm:pt-6 print:hidden">
          <BreadcrumbPill href="/" parentLabel="Home" currentLabel="Resume" />
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
              onClick={() => {
                activateCvPrint({
                  printPage: () => window.print(),
                  trackResumeAction: (action) => analytics.resumeAction(action),
                })
              }}
              className={CV_PRINT_BUTTON_CLASS_NAME}
              aria-label={CV_PRINT_ARIA_LABEL}
            >
              {CV_PRINT_BUTTON_LABEL}
            </button>
          </div>

          {/* Contact links */}
          <div className={CV_CONTACT_LIST_CLASS_NAME}>
            <span>{CV_LOCATION_LABEL}</span>
            {CV_CONTACT_LINKS.map((link) => (
              <Fragment key={link.href}>
                <span className="text-border">·</span>
                <a
                  href={link.href}
                  className={getCvContactLinkClassName(link.printNoUnderline)}
                  onClick={() => trackCvContactClick(link)}
                >
                  {link.label}
                </a>
              </Fragment>
            ))}
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
