'use client'

import { m, useReducedMotion } from 'framer-motion'
import BreadcrumbPill from '@/components/BreadcrumbPill'
import TextReveal from '@/components/TextReveal'
import { experienceItems, educationItems } from '@/content/homepage'
import { siteConfig } from '@/lib/site'
import { MOTION_EASE_SOFT } from '@/lib/motion'

const SKILLS = [
  'Figma',
  'React',
  'Next.js',
  'TypeScript',
  'Tailwind CSS',
  'Framer Motion',
  'Three.js',
  'Adobe Creative Suite',
  'Prototyping',
  'User Research',
] as const

const STAGGER_DELAY = 0.06

function SectionHeading({ children, delay = 0 }: { children: string; delay?: number }) {
  return (
    <h2 className="font-mono text-[11px] font-medium tracking-[0.16em] uppercase text-muted-foreground mb-6">
      <TextReveal text={children} as="span" trigger duration={0.4} staggerDelay={0.06} startDelay={delay} />
    </h2>
  )
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
        <div className="mb-10 sm:mb-14 flex justify-start pt-4 sm:pt-6">
          <BreadcrumbPill href="/" parentLabel="Home" currentLabel="CV" />
        </div>

        {/* Header */}
        <header className="pb-12 sm:pb-16 pt-8 sm:pt-12">
          <h1 className="font-mono text-[14px] font-semibold tracking-[0.08em] uppercase text-foreground sm:text-[15px]">
            <TextReveal text="Hunter Bastian" as="span" trigger duration={0.5} staggerDelay={0.08} startDelay={0.1} filter />
          </h1>
          <p className="mt-2 text-[13px] text-muted-foreground">
            <TextReveal text={siteConfig.siteDescription} as="span" trigger duration={0.4} staggerDelay={0.03} startDelay={0.4} />
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground/70 font-mono tracking-wide">
            <TextReveal text="Utah, USA · hello@hunterbastian.com" as="span" trigger duration={0.4} staggerDelay={0.02} startDelay={0.6} />
          </p>
        </header>

        {/* Experience */}
        <section className="pb-10 sm:pb-14">
          <SectionHeading delay={0.5}>Experience</SectionHeading>
          <div className="space-y-6">
            {experienceItems.map((item, i) => (
              <m.div
                key={`${item.company}-${item.year}`}
                className="group grid grid-cols-[1fr_auto] gap-x-4 items-baseline"
                variants={itemVariants}
                custom={i}
                initial="hidden"
                animate="visible"
              >
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[13px] font-medium text-foreground">{item.company}</span>
                    <span className="text-[11px] text-muted-foreground/60">·</span>
                    <span className="text-[12px] text-muted-foreground">{item.title}</span>
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground/70">{item.description}</p>
                </div>
                <span className="text-[11px] font-mono tracking-wide text-muted-foreground/50 whitespace-nowrap">{item.year}</span>
              </m.div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="pb-10 sm:pb-14">
          <SectionHeading delay={0.8}>Education</SectionHeading>
          <div className="space-y-6">
            {educationItems.map((item, i) => (
              <m.div
                key={`${item.institution}-${item.year}`}
                className="group grid grid-cols-[1fr_auto] gap-x-4 items-baseline"
                variants={itemVariants}
                custom={i + experienceItems.length}
                initial="hidden"
                animate="visible"
              >
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[13px] font-medium text-foreground">{item.institution}</span>
                    <span className="text-[11px] text-muted-foreground/60">·</span>
                    <span className="text-[12px] text-muted-foreground">{item.degree}</span>
                  </div>
                  <p className="mt-1 text-[12px] text-muted-foreground/70">
                    {item.level}
                    {item.note && <span className="ml-2 font-mono text-[10px] tracking-wider text-accent/80 uppercase">{item.note}</span>}
                  </p>
                </div>
                <span className="text-[11px] font-mono tracking-wide text-muted-foreground/50 whitespace-nowrap">{item.year}</span>
              </m.div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="pb-16 sm:pb-24">
          <SectionHeading delay={1.0}>Skills</SectionHeading>
          <m.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: prefersReducedMotion ? 0 : 1.1, duration: 0.5, ease: MOTION_EASE_SOFT }}
          >
            {SKILLS.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-border bg-card px-3 py-1 text-[11px] font-mono tracking-wide text-muted-foreground transition-colors hover:text-foreground hover:border-foreground/20"
              >
                {skill}
              </span>
            ))}
          </m.div>
        </section>
      </div>
    </div>
  )
}
