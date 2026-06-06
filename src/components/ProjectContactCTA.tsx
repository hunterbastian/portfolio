'use client'

import Link from 'next/link'
import { FileText, Mail } from 'lucide-react'
import { useWebHaptics } from 'web-haptics/react'
import { analytics } from '@/lib/analytics'
import { showJoyToast } from '@/lib/joy'
import {
  PROJECT_CONTACT_CTA_ACTION_CLASS_NAME,
  PROJECT_CONTACT_CTA_COPY,
  PROJECT_CONTACT_CTA_ICON_CLASS_NAME,
  activateProjectContactCtaAction,
  type ProjectContactCtaAction,
  type ProjectContactCtaActionIcon,
  getProjectContactAnalyticsContext,
  getProjectContactCtaActions,
} from '@/lib/project-contact-cta'
import { siteConfig, siteProjectInquiryHref } from '@/lib/site'

interface ProjectContactCTAProps {
  projectSlug: string
  projectTitle: string
}

function ProjectContactCtaIcon({ icon }: { icon: ProjectContactCtaActionIcon }) {
  const Icon = icon === 'file-text' ? FileText : Mail

  return (
    <Icon
      aria-hidden="true"
      className={PROJECT_CONTACT_CTA_ICON_CLASS_NAME}
      strokeWidth={1.8}
    />
  )
}

export default function ProjectContactCTA({ projectSlug, projectTitle }: ProjectContactCTAProps) {
  const haptic = useWebHaptics()
  const analyticsContext = getProjectContactAnalyticsContext(projectSlug, projectTitle)
  const actions = getProjectContactCtaActions({
    inquiryHref: siteProjectInquiryHref,
    personName: siteConfig.personName,
    projectTitle,
  })

  const handleActionClick = (action: ProjectContactCtaAction) => {
    activateProjectContactCtaAction({
      action,
      analyticsContext,
      showToast: showJoyToast,
      trackExternalLink: (href, platform, context) => analytics.externalLink(href, platform, context),
      trackNavigationClick: (target, context) => analytics.navigationClick(target, context),
      triggerHaptic: (style) => haptic.trigger(style),
    })
  }

  return (
    <section
      className="not-prose my-12 border-y border-border/70 py-6 sm:my-14 sm:py-7"
      aria-labelledby="project-contact-heading"
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground/62">
            {PROJECT_CONTACT_CTA_COPY.eyebrow}
          </p>
          <h2
            id="project-contact-heading"
            className="font-mono text-[0.98rem] font-medium leading-snug text-foreground text-balance sm:text-[1.05rem]"
          >
            {PROJECT_CONTACT_CTA_COPY.heading}
          </h2>
          <p className="max-w-[31rem] font-inter text-[13px] leading-relaxed text-muted-foreground">
            {PROJECT_CONTACT_CTA_COPY.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {actions.map((action) => {
            const content = (
              <>
                <ProjectContactCtaIcon icon={action.icon} />
                {action.label}
              </>
            )

            if (action.analyticsKind === 'navigation') {
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  aria-label={action.ariaLabel}
                  className={PROJECT_CONTACT_CTA_ACTION_CLASS_NAME}
                  onClick={() => handleActionClick(action)}
                >
                  {content}
                </Link>
              )
            }

            return (
              <a
                key={action.label}
                href={action.href}
                aria-label={action.ariaLabel}
                className={PROJECT_CONTACT_CTA_ACTION_CLASS_NAME}
                onClick={() => handleActionClick(action)}
              >
                {content}
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
