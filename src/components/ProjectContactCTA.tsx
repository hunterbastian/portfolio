'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FileText, Mail } from 'lucide-react'
import { useWebHaptics } from 'web-haptics/react'
import { analytics } from '@/lib/analytics'
import { showJoyToast } from '@/lib/joy'
import { siteConfig, siteProjectInquiryHref } from '@/lib/site'

interface ProjectContactCTAProps {
  projectSlug: string
  projectTitle: string
}

export default function ProjectContactCTA({ projectSlug, projectTitle }: ProjectContactCTAProps) {
  const haptic = useWebHaptics()
  const analyticsContext = {
    source: 'project_cta',
    projectSlug,
    projectTitle,
  }

  return (
    <section
      className="not-prose relative isolate my-12 overflow-hidden border-y border-border/70 py-6 sm:my-14 sm:py-7"
      aria-labelledby="project-contact-heading"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full opacity-70"
      >
        <Image
          src="/images/mediterranean-ambient-home.webp"
          alt=""
          fill
          className="scale-[1.08] object-cover object-[50%_54%] opacity-[0.18] saturate-[0.78] contrast-[0.96] sepia-[0.08]"
          sizes="560px"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--background)_0%,rgba(249,247,242,0.76)_28%,rgba(249,247,242,0.9)_100%)]" />
      </div>

      <div className="space-y-4">
        <div
          aria-hidden="true"
          className="h-[2.65rem] w-full max-w-[17rem] overflow-hidden border border-border/58 bg-card/45 shadow-[0_12px_30px_-26px_rgba(43,39,34,0.44)] sm:max-w-[20rem]"
        >
          <Image
            src="/images/mediterranean-ambient-home.webp"
            alt=""
            width={512}
            height={120}
            className="h-full w-full object-cover object-[42%_58%] opacity-90 saturate-[0.86] contrast-[0.98] sepia-[0.06]"
            sizes="(min-width: 640px) 20rem, 17rem"
          />
        </div>

        <div className="space-y-1.5">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground/62">
            Work together
          </p>
          <h2
            id="project-contact-heading"
            className="font-mono text-[0.98rem] font-medium leading-snug text-foreground text-balance sm:text-[1.05rem]"
          >
            Interested in this kind of work?
          </h2>
          <p className="max-w-[31rem] font-inter text-[13px] leading-relaxed text-muted-foreground">
            View my resume or send a quick note about a similar project.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/cv"
            aria-label={`View resume after reading ${projectTitle}`}
            className="group inline-flex min-h-[40px] origin-center touch-manipulation items-center gap-2 border border-border/70 bg-[color-mix(in_srgb,var(--background)_82%,#fff7ed)] px-3 py-2 font-mono text-[0.72rem] text-foreground shadow-[0_10px_24px_-22px_rgba(43,39,34,0.46),inset_0_1px_0_rgba(255,255,255,0.72)] transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-[1px] hover:border-[color-mix(in_srgb,var(--contact-accent)_32%,var(--border))] hover:shadow-[0_14px_30px_-24px_rgba(43,39,34,0.55),inset_0_1px_0_rgba(255,255,255,0.82)] active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            onClick={() => {
              haptic.trigger('light')
              analytics.navigationClick('project_cta_resume', analyticsContext)
              showJoyToast('Opening resume')
            }}
          >
            <FileText
              aria-hidden="true"
              className="h-3.5 w-3.5 text-muted-foreground transition-[color,transform] duration-150 group-hover:text-foreground group-hover:-translate-y-px"
              strokeWidth={1.8}
            />
            View resume
          </Link>
          <a
            href={siteProjectInquiryHref}
            aria-label={`Email ${siteConfig.personName} about work like ${projectTitle}`}
            className="group inline-flex min-h-[40px] origin-center touch-manipulation items-center gap-2 border border-border/70 bg-[color-mix(in_srgb,var(--background)_82%,#fff7ed)] px-3 py-2 font-mono text-[0.72rem] text-foreground shadow-[0_10px_24px_-22px_rgba(43,39,34,0.46),inset_0_1px_0_rgba(255,255,255,0.72)] transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-[1px] hover:border-[color-mix(in_srgb,var(--contact-accent)_32%,var(--border))] hover:shadow-[0_14px_30px_-24px_rgba(43,39,34,0.55),inset_0_1px_0_rgba(255,255,255,0.82)] active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            onClick={() => {
              haptic.trigger('light')
              analytics.externalLink(siteProjectInquiryHref, 'email', analyticsContext)
              showJoyToast('Opening email')
            }}
          >
            <Mail
              aria-hidden="true"
              className="h-3.5 w-3.5 text-muted-foreground transition-[color,transform] duration-150 group-hover:text-foreground group-hover:-translate-y-px"
              strokeWidth={1.8}
            />
            Email me
          </a>
        </div>
      </div>
    </section>
  )
}
