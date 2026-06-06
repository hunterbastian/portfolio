'use client'

import { ArrowUpRight } from 'lucide-react'
import { useWebHaptics } from 'web-haptics/react'
import { EmailButton } from '@/components/EmailButton'
import { chromePillClassName, chromePillIconClassName, chromePillLabelClassName } from '@/components/ui/tactile'
import { contactSocialLinks } from '@/content/homepage'
import { analytics } from '@/lib/analytics'
import {
  activateContactLink,
  getContactLinksView,
  type ContactLinkAction,
} from '@/lib/contact-links'
import { showJoyToast } from '@/lib/joy'
import { cn } from '@/lib/utils'

export function ContactLinks() {
  const haptic = useWebHaptics()
  const contactLinksView = getContactLinksView(contactSocialLinks)

  const handleContactClick = (action: ContactLinkAction<(typeof contactSocialLinks)[number]>) => {
    activateContactLink({
      action,
      showToast: showJoyToast,
      trackExternalLink: (href, trackedPlatform) => analytics.externalLink(href, trackedPlatform),
      triggerHaptic: (style) => haptic.trigger(style),
    })
  }

  return (
    <div className="space-y-10 sm:space-y-12">
      {contactLinksView.emailLink ? (
        <EmailButton
          email={contactLinksView.emailAddress}
          aria-label={contactLinksView.emailAriaLabel}
          className="max-w-[8.5rem] sm:max-w-[9.25rem]"
          onClick={() => {
            if (contactLinksView.emailAction) {
              handleContactClick(contactLinksView.emailAction)
            }
          }}
        />
      ) : null}

      <div className="flex flex-wrap gap-2 text-left sm:gap-2.5">
        {contactLinksView.socialLinks.map((socialLink) => (
          <a
            key={socialLink.link.label}
            href={socialLink.link.href}
            target={socialLink.target}
            rel={socialLink.rel}
            aria-label={socialLink.ariaLabel}
            className={chromePillClassName({ size: 'contact-social' })}
            onClick={() => handleContactClick(socialLink)}
          >
            <span className={chromePillLabelClassName}>{socialLink.link.label}</span>
            <ArrowUpRight
              aria-hidden="true"
              strokeWidth={1.7}
              className={cn(chromePillIconClassName, 'h-2 w-2')}
            />
          </a>
        ))}
      </div>
    </div>
  )
}
