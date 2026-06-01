'use client'

import { ArrowUpRight } from 'lucide-react'
import { useWebHaptics } from 'web-haptics/react'
import { EmailButton } from '@/components/EmailButton'
import { chromePillClassName, chromePillIconClassName, chromePillLabelClassName } from '@/components/ui/tactile'
import { contactSocialLinks } from '@/content/homepage'
import { analytics } from '@/lib/analytics'
import { showJoyToast } from '@/lib/joy'
import { cn } from '@/lib/utils'

export function ContactLinks() {
  const haptic = useWebHaptics()
  const emailLink = contactSocialLinks.find((link) => link.label === 'Email')
  const socialLinks = contactSocialLinks.filter((link) => link.label !== 'Email')
  const emailAddress = emailLink?.href.replace(/^mailto:/, '').split('?')[0] ?? ''

  const handleContactClick = (link: (typeof contactSocialLinks)[number]) => {
    haptic.trigger('light')
    analytics.externalLink(link.href, link.label.toLowerCase())
    showJoyToast(link.label === 'Email' ? 'Opening email' : `Opening ${link.label}`)
  }

  const opensNewTab = (link: (typeof contactSocialLinks)[number]) => {
    return Boolean(link.external && !link.href.startsWith('mailto:'))
  }

  return (
    <div className="space-y-10 sm:space-y-12">
      {emailLink ? (
        <EmailButton
          email={emailAddress}
          aria-label={`Email me directly at ${emailAddress}`}
          className="max-w-[8.5rem] sm:max-w-[9.25rem]"
          onClick={() => handleContactClick(emailLink)}
        />
      ) : null}

      <div className="flex flex-wrap gap-2 text-left sm:gap-2.5">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={opensNewTab(link) ? '_blank' : undefined}
            rel={opensNewTab(link) ? 'noreferrer' : undefined}
            aria-label={link.ariaLabel ?? `Open ${link.label}`}
            className={chromePillClassName({ size: 'contact-social' })}
            onClick={() => handleContactClick(link)}
          >
            <span className={chromePillLabelClassName}>{link.label}</span>
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
