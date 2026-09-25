'use client'

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

const contactLinkClassName = 'editorial-text-link'

export function ContactLinks() {
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
    <div className="editorial-contact-links">
      {contactLinksView.emailLink ? (
        <a
          href={contactLinksView.emailLink.href}
          aria-label={contactLinksView.emailAriaLabel}
          className={contactLinkClassName}
          onClick={() => {
            if (contactLinksView.emailAction) {
              handleContactClick(contactLinksView.emailAction)
            }
          }}
        >
          {contactLinksView.emailLink.label}
        </a>
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
