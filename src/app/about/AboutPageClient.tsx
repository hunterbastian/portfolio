'use client'

import Image from 'next/image'
import { m, useReducedMotion } from 'framer-motion'
import { MOTION_SPRING_SNAPPY } from '@/lib/motion'
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
      <div className="relative z-10 mx-auto max-w-[36rem] px-5 sm:px-8">
        <div className="mb-10 flex justify-start pt-4 sm:mb-14 sm:pt-6">
          <BreadcrumbPill href="/" parentLabel="Home" currentLabel="About" />
        </div>

        <div className="relative z-10 flex justify-center pb-32 pt-16 sm:pt-24">
          <div className="flex max-w-[36rem] flex-col items-center text-center">
            {/* --- Profile --- */}
            <div className="mask mask-squircle p-[2px] shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.06]" style={{ background: 'var(--border)' }}>
              <Image
                src="/images/profilepicture.webp"
                alt="Outdoor photograph of Hunter Bastian walking along a mountain road."
                width={120}
                height={120}
                className="mask mask-squircle object-cover img-inset-outline"
                priority
              />
            </div>

            <h1 className="mt-8 font-mono text-[12px] font-medium tracking-[0.1em] uppercase text-foreground">
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

            <p className="mt-5 max-w-[31rem] font-mono text-[1rem] leading-[1.72] tracking-[-0.02em] text-muted-foreground">
              <TextReveal
                text="Interaction design student at Utah Valley University. I design and build digital products with care, photograph the world in between, and spend a lot of time shooting with my Fujifilm X100VI."
                as="span"
                trigger
                duration={0.5}
                staggerDelay={0.04}
                startDelay={0.6}
              />
            </p>

            {/* --- Actions --- */}
            <div className="mt-8 flex items-center gap-4">
              <Magnetic strength={0.15} range={100} onlyOnHover disableOnTouch>
              <m.a
                href="/#contact"
                className="playground-joy group relative overflow-hidden inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[10px] font-medium tracking-[0.08em] uppercase focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                onClick={() => haptic.trigger('light')}
                initial="idle"
                whileHover={prefersReducedMotion ? undefined : 'hover'}
                animate="idle"
                whileTap={prefersReducedMotion ? undefined : { scale: 0.96, y: 0 }}
                transition={MOTION_SPRING_SNAPPY}
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
                className="playground-joy group relative overflow-hidden inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[10px] font-medium tracking-[0.08em] uppercase focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                onClick={() => haptic.trigger('light')}
                initial="idle"
                whileHover={prefersReducedMotion ? undefined : 'hover'}
                animate="idle"
                whileTap={prefersReducedMotion ? undefined : { scale: 0.96, y: 0 }}
                transition={MOTION_SPRING_SNAPPY}
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
