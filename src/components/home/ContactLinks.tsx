'use client'

import { ArrowUpRight } from 'lucide-react'
import { useWebHaptics } from 'web-haptics/react'
import { EmailButton } from '@/components/EmailButton'
import { contactSocialLinks } from '@/content/homepage'
import { analytics } from '@/lib/analytics'
import { showJoyToast } from '@/lib/joy'
import { cn } from '@/lib/utils'
import styles from './ContactLinks.module.css'

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
          className="max-w-[12.25rem] sm:max-w-[13.75rem]"
          onClick={() => handleContactClick(emailLink)}
        />
      ) : null}

      <div className="flex flex-wrap gap-3 text-left sm:gap-3.5">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={opensNewTab(link) ? '_blank' : undefined}
            rel={opensNewTab(link) ? 'noreferrer' : undefined}
            aria-label={link.ariaLabel ?? `Open ${link.label}`}
            className={cn(
              styles.socialLink,
              'group/social-link inline-flex min-h-[40px] origin-center touch-manipulation items-center justify-center gap-1.5 font-header text-[0.72rem] leading-none text-[#403d38]/78 transition-[background-color,box-shadow,color,transform] duration-150 hover:-translate-y-[1px] hover:text-[#403d38] active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary dark:text-[#f7efe4]/76 dark:hover:text-[#f7efe4] sm:text-[0.76rem]',
            )}
            onClick={() => handleContactClick(link)}
          >
            <span className="relative z-10 min-w-0 truncate underline decoration-current underline-offset-[0.2em] transition-[text-decoration-color] duration-150 group-hover/social-link:decoration-current">
              {link.label}
            </span>
            <ArrowUpRight
              aria-hidden="true"
              strokeWidth={1.7}
              className="relative z-10 h-2.5 w-2.5 shrink-0 text-[#403d38]/42 transition-[color,transform] duration-150 group-hover/social-link:-translate-y-0.5 group-hover/social-link:translate-x-0.5 group-hover/social-link:text-[#403d38]/68 dark:text-[#f7efe4]/42 dark:group-hover/social-link:text-[#f7efe4]/68"
            />
          </a>
        ))}
      </div>
    </div>
  )
}
