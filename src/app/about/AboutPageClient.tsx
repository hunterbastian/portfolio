'use client'

import Image from 'next/image'
import Link from 'next/link'
import { m, useReducedMotion } from 'framer-motion'
import BreadcrumbPill from '@/components/BreadcrumbPill'
import { Magnetic } from '@/components/animate-ui/primitives/effects/magnetic'
import AnimatedDashedArrow from '@/components/AnimatedDashedArrow'
import ResumeButton from '@/components/ResumeButton'
import TextReveal from '@/components/TextReveal'
import { useWebHaptics } from 'web-haptics/react'

export default function AboutPageClient() {
  const prefersReducedMotion = useReducedMotion() ?? false
  const haptic = useWebHaptics()

  return (
    <div className="relative min-h-screen">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.15] dark:opacity-[0.08] about-page-glow"
        aria-hidden="true"
      />
      <div className="relative z-10 container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 sm:mb-14 flex justify-start pt-4 sm:pt-6">
          <BreadcrumbPill href="/" parentLabel="Home" currentLabel="About" />
        </div>

        <div className="relative z-10 flex justify-center pb-32 pt-16 sm:pt-24">
          <div className="flex flex-col items-center text-center max-w-md">
            {/* --- Profile --- */}
            <div className="mask mask-squircle p-[2px] shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.06]" style={{ background: 'var(--border)' }}>
              <Image
                src="/images/profilepicture.webp"
                alt="Hunter Bastian"
                width={120}
                height={120}
                className="mask mask-squircle object-cover"
                priority
              />
            </div>

            <h1 className="mt-8 font-mono text-[13px] font-medium tracking-[0.12em] uppercase text-foreground sm:text-sm">
              <TextReveal
                text="Hunter Bastian"
                as="span"
                trigger
                duration={0.5}
                staggerDelay={0.08}
                startDelay={0.2}
                filter
              />
            </h1>

            <p className="mt-5 text-[13px] leading-relaxed text-balance text-muted-foreground sm:text-sm">
              <TextReveal
                text="Interaction design student at Utah Valley University. I design and build digital products with care and photograph the world in between."
                as="span"
                trigger
                duration={0.5}
                staggerDelay={0.04}
                startDelay={0.6}
              />
            </p>

            <p className="mt-2.5 text-[13px] leading-relaxed text-balance text-muted-foreground sm:text-sm">
              <TextReveal
                text="I also love photography and I own a Fujifilm X100VI, which has been my favorite item recently."
                as="span"
                trigger
                duration={0.5}
                staggerDelay={0.04}
                startDelay={1.2}
              />
            </p>

            {/* --- Actions --- */}
            <div className="mt-8 flex items-center gap-4">
              <Magnetic strength={0.15} range={100} onlyOnHover disableOnTouch>
              <m.a
                href="/#contact"
                className="playground-joy group relative overflow-hidden inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-medium tracking-[0.06em] uppercase focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                onClick={() => haptic.trigger('light')}
                initial="idle"
                whileHover={prefersReducedMotion ? undefined : 'hover'}
                animate="idle"
                whileTap={prefersReducedMotion ? undefined : { scale: 0.93, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                variants={{ idle: { y: 0 }, hover: { y: -3 } }}
              >
                <m.span
                  className="relative z-10"
                  variants={prefersReducedMotion ? undefined : {
                    idle: { letterSpacing: '0.06em' },
                    hover: { letterSpacing: '0.1em', transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
                  }}
                >
                  Contact
                </m.span>
                <AnimatedDashedArrow size={14} />
              </m.a>
              </Magnetic>
              <Magnetic strength={0.15} range={100} onlyOnHover disableOnTouch>
              <m.a
                href="/cv"
                className="playground-joy group relative overflow-hidden inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-medium tracking-[0.06em] uppercase focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                onClick={() => haptic.trigger('light')}
                initial="idle"
                whileHover={prefersReducedMotion ? undefined : 'hover'}
                animate="idle"
                whileTap={prefersReducedMotion ? undefined : { scale: 0.93, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                variants={{ idle: { y: 0 }, hover: { y: -3 } }}
              >
                <m.span
                  className="relative z-10"
                  variants={prefersReducedMotion ? undefined : {
                    idle: { letterSpacing: '0.06em' },
                    hover: { letterSpacing: '0.1em', transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
                  }}
                >
                  View CV
                </m.span>
                <AnimatedDashedArrow size={14} />
              </m.a>
              </Magnetic>
              <ResumeButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
