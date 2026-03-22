'use client'

import Image from 'next/image'
import Link from 'next/link'
import BreadcrumbPill from '@/components/BreadcrumbPill'
import AnimatedDashedArrow from '@/components/AnimatedDashedArrow'
import ResumeButton from '@/components/ResumeButton'
import TextReveal from '@/components/TextReveal'

export default function AboutPageClient() {
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
            <Image
              src="/images/profilepicture.webp"
              alt="Hunter Bastian"
              width={120}
              height={120}
              className="rounded-full img-inset-outline shadow-sm"
              priority
            />

            <h1 className="mt-10 font-mono text-[13px] font-medium tracking-[0.12em] uppercase text-foreground sm:text-sm">
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

            {/* --- Actions --- */}
            <div className="mt-16 flex items-center gap-5">
              <Link
                href="/#contact"
                className="group inline-flex items-center gap-1.5 min-h-[44px] text-xs tracking-[0.08em] uppercase text-muted-foreground hover:text-accent transition-colors duration-200 underline-offset-4 decoration-transparent hover:underline hover:decoration-accent"
              >
                Contact
                <AnimatedDashedArrow size={14} />
              </Link>
              <ResumeButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
