'use client'

import type { ReactNode } from 'react'
import * as Button from '@/components/alignui/button'
import { useWebHaptics } from 'web-haptics/react'
import { contactSocialLinks, homepageContactSocialLabels } from '@/content/homepage'
import { analytics } from '@/lib/analytics'
import {
  activateContactLink,
  getContactLinksView,
  getHomepageContactLinks,
  type ContactLinkAction,
} from '@/lib/contact-links'
import { showJoyToast } from '@/lib/joy'

const contactLinkClassName =
  'inline-flex min-h-[44px] min-w-[44px] items-center rounded-sm font-mono text-[0.8125rem] leading-relaxed text-foreground/80 underline decoration-transparent decoration-1 underline-offset-[0.3em] transition-colors duration-200 hover:text-foreground hover:decoration-foreground/50 focus-visible:text-foreground focus-visible:decoration-foreground/50 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-foreground/60 motion-reduce:transition-none'

export function ContactLinks({ primaryAction, emailLabel }: { primaryAction?: ReactNode; emailLabel?: string }) {
  const haptic = useWebHaptics()
  const contactLinksView = getContactLinksView(
    getHomepageContactLinks(contactSocialLinks, homepageContactSocialLabels),
  )

  const handleContactClick = (action: ContactLinkAction<(typeof contactSocialLinks)[number]>) => {
    activateContactLink({
      action,
      showToast: showJoyToast,
      trackExternalLink: (href, trackedPlatform) => analytics.externalLink(href, trackedPlatform),
      triggerHaptic: (style) => haptic.trigger(style),
    })
  }

  return (
    <div className="home-contact-links flex max-w-full flex-wrap items-center gap-x-6 gap-y-1 text-left sm:gap-x-7">
      {primaryAction}
      {contactLinksView.emailLink ? (
        <Button.Root asChild mode="filled"><a
          href={contactLinksView.emailLink.href}
          aria-label={contactLinksView.emailAriaLabel}
          onClick={() => {
            if (contactLinksView.emailAction) {
              handleContactClick(contactLinksView.emailAction)
            }
          }}
        >
          {emailLabel ?? contactLinksView.emailLink.label}
        </a></Button.Root>
      ) : null}

      {contactLinksView.socialLinks.map((socialLink) => (
        <a
          key={socialLink.link.label}
          href={socialLink.link.href}
          target={socialLink.target}
          rel={socialLink.rel}
          aria-label={socialLink.ariaLabel}
          className={contactLinkClassName}
          onClick={() => handleContactClick(socialLink)}
        >
          {socialLink.link.label}
        </a>
      ))}
    </div>
  )
}
