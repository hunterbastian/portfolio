'use client'

import { ArrowUpRight } from 'lucide-react'
import { useWebHaptics } from 'web-haptics/react'
import { contactSocialLinks } from '@/content/homepage'
import { analytics } from '@/lib/analytics'
import { showJoyToast } from '@/lib/joy'

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
    <div className="space-y-4 sm:space-y-5">
      {emailLink ? (
        <a
          href={emailLink.href}
          aria-label={`Email me directly at ${emailAddress}`}
          className="contact-email-gloss-button group/contact-email mx-auto flex w-full max-w-[18rem] origin-center touch-manipulation items-center justify-center text-center font-mono text-[1rem] leading-none text-[#070707] transition-[filter,transform] duration-200 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:max-w-[24rem] sm:text-[1.24rem]"
          onClick={() => handleContactClick(emailLink)}
        >
          <span className="contact-email-gloss-label relative z-10">
            email me
          </span>
        </a>
      ) : null}

      <div className="grid grid-cols-2 gap-x-5 gap-y-1 text-left sm:grid-cols-4 sm:gap-x-6">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={opensNewTab(link) ? '_blank' : undefined}
            rel={opensNewTab(link) ? 'noreferrer' : undefined}
            aria-label={link.ariaLabel ?? `Open ${link.label}`}
            className="group/social-link inline-flex min-h-[40px] origin-center touch-manipulation items-center justify-between gap-2 font-header text-[0.78rem] leading-none text-muted-foreground/76 transition-[color,transform] duration-150 hover:-translate-y-[1px] hover:text-[var(--contact-accent)] active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-[0.82rem]"
            onClick={() => handleContactClick(link)}
          >
            <span className="min-w-0 truncate underline decoration-current underline-offset-[0.2em] transition-[text-decoration-color] duration-150 group-hover/social-link:decoration-[var(--contact-accent)]">
              {link.label}
            </span>
            <ArrowUpRight
              aria-hidden="true"
              strokeWidth={1.7}
              className="h-3 w-3 shrink-0 text-muted-foreground/42 transition-[color,transform] duration-150 group-hover/social-link:-translate-y-0.5 group-hover/social-link:translate-x-0.5 group-hover/social-link:text-[var(--contact-accent)]"
            />
          </a>
        ))}
      </div>
    </div>
  )
}
