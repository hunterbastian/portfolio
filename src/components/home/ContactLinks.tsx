'use client'

import { ArrowUpRight } from 'lucide-react'
import { useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { useWebHaptics } from 'web-haptics/react'
import { contactSocialLinks } from '@/content/homepage'
import { analytics } from '@/lib/analytics'
import { showJoyToast } from '@/lib/joy'

type CaptureBurst = {
  id: number
  x: number
  y: number
}

type CaptureBurstStyle = CSSProperties & {
  '--capture-x': string
  '--capture-y': string
}

type SocialGlintStyle = CSSProperties & {
  '--glint-delay': string
  '--glint-hover-x': string
  '--glint-hover-y': string
  '--glint-start-x': string
  '--glint-start-y': string
  '--glint-x': string
  '--glint-y': string
}

const SOCIAL_GLINT_STYLES: SocialGlintStyle[] = [
  {
    '--glint-delay': '20ms',
    '--glint-hover-x': '1px',
    '--glint-hover-y': '-1px',
    '--glint-start-x': '-6px',
    '--glint-start-y': '3px',
    '--glint-x': '1px',
    '--glint-y': '-1px',
  },
  {
    '--glint-delay': '90ms',
    '--glint-hover-x': '-1px',
    '--glint-hover-y': '1px',
    '--glint-start-x': '-4px',
    '--glint-start-y': '2px',
    '--glint-x': '-2px',
    '--glint-y': '1px',
  },
  {
    '--glint-delay': '45ms',
    '--glint-hover-x': '2px',
    '--glint-hover-y': '0px',
    '--glint-start-x': '-5px',
    '--glint-start-y': '4px',
    '--glint-x': '0px',
    '--glint-y': '2px',
  },
  {
    '--glint-delay': '120ms',
    '--glint-hover-x': '0px',
    '--glint-hover-y': '-2px',
    '--glint-start-x': '-7px',
    '--glint-start-y': '2px',
    '--glint-x': '2px',
    '--glint-y': '0px',
  },
]

export function ContactLinks() {
  const haptic = useWebHaptics()
  const [captureBurst, setCaptureBurst] = useState<CaptureBurst | null>(null)
  const emailLink = contactSocialLinks.find((link) => link.label === 'Email')
  const socialLinks = contactSocialLinks.filter((link) => link.label !== 'Email')
  const emailAddress = emailLink?.href.replace(/^mailto:/, '').split('?')[0] ?? ''
  const captureBurstStyle: CaptureBurstStyle = {
    '--capture-x': `${captureBurst?.x ?? 0}px`,
    '--capture-y': `${captureBurst?.y ?? 0}px`,
  }

  const handleContactClick = (link: (typeof contactSocialLinks)[number]) => {
    haptic.trigger('light')
    analytics.externalLink(link.href, link.label.toLowerCase())
    showJoyToast(link.label === 'Email' ? 'Opening email' : `Opening ${link.label}`)
  }

  const triggerCaptureBurst = (linkElement: HTMLAnchorElement) => {
    const parentRect = linkElement.parentElement?.getBoundingClientRect()
    const linkRect = linkElement.getBoundingClientRect()

    if (parentRect) {
      const id = Date.now()
      setCaptureBurst({
        id,
        x: linkRect.left - parentRect.left + linkRect.width / 2,
        y: parentRect.height + 10,
      })
      window.setTimeout(() => {
        setCaptureBurst((current) => (current?.id === id ? null : current))
      }, 760)
    }
  }

  const handleSocialPointerDown = (event: PointerEvent<HTMLAnchorElement>) => {
    triggerCaptureBurst(event.currentTarget)
  }

  const handleSocialKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      triggerCaptureBurst(event.currentTarget)
    }
  }

  const handleSocialClick = (link: (typeof contactSocialLinks)[number]) => {
    handleContactClick(link)
  }

  return (
    <div className="space-y-5 sm:space-y-7">
      {emailLink ? (
        <a
          href={emailLink.href}
          aria-label={`Email me directly at ${emailAddress}`}
          className="aqua-contact-button group/aqua-contact relative isolate mx-auto flex min-h-[3.95rem] w-[calc(100%-1.25rem)] max-w-[28.75rem] origin-center touch-manipulation items-center justify-center overflow-visible px-7 py-3 text-center transition-[filter,transform,box-shadow] duration-200 ease-[cubic-bezier(0.2,0,0,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:min-h-[4.35rem] sm:w-full sm:px-10"
          onClick={() => handleContactClick(emailLink)}
        >
          <span className="relative z-10 flex min-w-0 items-center justify-center font-header text-[0.98rem] font-normal leading-none text-[#0d0f12] transition-transform duration-150 ease-[cubic-bezier(0.2,0,0,1)] group-active/aqua-contact:translate-y-px sm:text-[1.16rem]">
            <span className="truncate">Connect with me</span>
          </span>
          <span className="sr-only">{emailAddress}</span>
        </a>
      ) : null}

      <div className="relative isolate mx-auto grid w-full max-w-[30rem] grid-cols-[repeat(auto-fit,minmax(8.75rem,1fr))] gap-2 sm:gap-2.5">
        <div aria-hidden="true" className="social-pixel-field">
          <span className="social-capture-rail" />
          <span className="social-ambient-pixel social-ambient-pixel-one" />
          <span className="social-ambient-pixel social-ambient-pixel-two" />
          <span className="social-ambient-pixel social-ambient-pixel-three" />
          <span className="social-ambient-pixel social-ambient-pixel-four" />
        </div>
        {captureBurst ? (
          <div
            key={captureBurst.id}
            aria-hidden="true"
            className="social-capture-burst"
            style={captureBurstStyle}
          >
            <span className="social-capture-pixel social-capture-pixel-one" />
            <span className="social-capture-pixel social-capture-pixel-two" />
            <span className="social-capture-pixel social-capture-pixel-three" />
          </div>
        ) : null}

        {socialLinks.map((link, index) => (
          <a
            key={link.label}
            href={link.href}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noreferrer' : undefined}
            aria-label={link.ariaLabel ?? `Open ${link.label}`}
            className="group/social-link relative z-10 inline-flex min-h-[40px] w-full origin-center touch-manipulation items-center justify-between gap-2 overflow-hidden rounded-[2px] border border-border/70 bg-[var(--contact-paper)] px-3 py-2 font-header text-[0.72rem] font-normal leading-none tracking-normal text-foreground/78 shadow-[0_1px_0_rgba(255,255,255,0.5)] transition-[background-color,border-color,box-shadow,color,transform] duration-150 hover:-translate-y-[1px] hover:border-[var(--contact-rule)] hover:bg-[var(--contact-paper-hover)] hover:text-[var(--contact-accent)] hover:shadow-[0_1px_0_rgba(255,255,255,0.54),0_10px_18px_-20px_rgba(var(--contact-accent-rgb),0.16)] active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-[0.74rem] last:sm:col-start-2"
            style={SOCIAL_GLINT_STYLES[index % SOCIAL_GLINT_STYLES.length]}
            onClick={() => handleSocialClick(link)}
            onKeyDown={handleSocialKeyDown}
            onPointerDown={handleSocialPointerDown}
          >
            <span className="relative z-10 truncate transition-colors duration-150">
              {link.label}
            </span>
            <ArrowUpRight
              aria-hidden="true"
              strokeWidth={1.7}
              className="relative z-10 h-3 w-3 shrink-0 text-muted-foreground/58 transition-[color,transform] duration-150 group-hover/social-link:translate-x-0.5 group-hover/social-link:-translate-y-0.5 group-hover/social-link:text-[var(--contact-accent)]"
            />
            <span aria-hidden="true" className="nature-link-glint" />
          </a>
        ))}
      </div>
    </div>
  )
}
