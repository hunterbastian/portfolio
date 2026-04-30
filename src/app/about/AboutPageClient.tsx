'use client'

import Image from 'next/image'
import Link from 'next/link'
import BreadcrumbPill from '@/components/BreadcrumbPill'
import ResumeModal from '@/components/ResumeModal'
import TextReveal from '@/components/TextReveal'
import { useState } from 'react'
import { useWebHaptics } from 'web-haptics/react'
import { showJoyToast } from '@/lib/joy'

export default function AboutPageClient() {
  const [resumeOpen, setResumeOpen] = useState(false)
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
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <Link
                href="/#contact"
                className="min-h-[40px] origin-center touch-manipulation font-mono text-[0.96rem] text-foreground decoration-border underline underline-offset-[0.24em] transition-[color,transform,text-decoration-color] duration-150 hover:-translate-y-[1px] hover:text-foreground/70 hover:decoration-foreground/80 active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                onClick={() => {
                  haptic.trigger('light')
                  showJoyToast('Say hi')
                }}
              >
                Contact
              </Link>
              <Link
                href="/cv"
                className="min-h-[40px] origin-center touch-manipulation font-mono text-[0.96rem] text-foreground decoration-border underline underline-offset-[0.24em] transition-[color,transform,text-decoration-color] duration-150 hover:-translate-y-[1px] hover:text-foreground/70 hover:decoration-foreground/80 active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                onClick={() => {
                  haptic.trigger('light')
                  showJoyToast('Opening CV')
                }}
              >
                View CV
              </Link>
              <button
                type="button"
                className="min-h-[40px] origin-center touch-manipulation font-mono text-[0.96rem] text-foreground decoration-border underline underline-offset-[0.24em] transition-[color,transform,text-decoration-color] duration-150 hover:-translate-y-[1px] hover:text-foreground/70 hover:decoration-foreground/80 active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                onClick={() => {
                  haptic.trigger('light')
                  showJoyToast('Resume opened')
                  setResumeOpen(true)
                }}
              >
                Resume
              </button>
            </div>
            <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
          </div>
        </div>
      </div>
    </div>
  )
}
