'use client'

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
      className="not-prose my-12 border-y border-border/70 py-6 sm:my-14 sm:py-7"
      aria-labelledby="project-contact-heading"
    >
      <div className="space-y-4">
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
            className="group inline-flex min-h-[40px] origin-center touch-manipulation items-center gap-2 border border-border/75 bg-background px-3 py-2 font-mono text-[0.72rem] text-foreground shadow-card-subtle transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-[1px] hover:border-foreground/20 hover:shadow-card active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
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
            className="group inline-flex min-h-[40px] origin-center touch-manipulation items-center gap-2 border border-border/75 bg-background px-3 py-2 font-mono text-[0.72rem] text-foreground shadow-card-subtle transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-[1px] hover:border-foreground/20 hover:shadow-card active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
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
