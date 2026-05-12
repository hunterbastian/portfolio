'use client'

import { ArrowUpRight, Mail } from 'lucide-react'
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
    <div className="space-y-[2.45rem] sm:space-y-[4rem]">
      {emailLink ? (
        <a
          href={emailLink.href}
          aria-label={`Email me directly at ${emailAddress}`}
          className="email-warm-card group/email-card relative flex min-h-[5rem] w-full max-w-[29.75rem] origin-center touch-manipulation items-center gap-2.5 overflow-hidden rounded-[8px] bg-[#fffaf4] px-3 py-2.5 pr-9 text-left shadow-[inset_0_0_0_1px_rgba(43,39,34,0.095),inset_0_1px_0_rgba(255,255,255,0.92),0_18px_34px_-30px_rgba(43,39,34,0.52),0_7px_20px_-23px_rgba(255,114,46,0.45),0_1px_3px_rgba(43,39,34,0.052)] transition-[transform,box-shadow,color,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] hover:bg-[#fff8f1] hover:text-[#ff4b00] hover:shadow-[inset_0_0_0_1px_rgba(255,75,0,0.16),inset_0_1px_0_rgba(255,255,255,0.95),0_20px_38px_-30px_rgba(255,97,22,0.38),0_8px_20px_-23px_rgba(43,39,34,0.32),0_2px_8px_-7px_rgba(43,39,34,0.16)] active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:min-h-[5.45rem] sm:gap-3.5 sm:px-[1.125rem] sm:py-3.5 sm:pr-[3.25rem]"
          onClick={() => handleContactClick(emailLink)}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(255,255,255,0.72),rgba(255,255,255,0)_58%),linear-gradient(180deg,rgba(255,255,255,0.38),rgba(255,239,226,0.18))]"
          />
          <span className="relative z-10 flex h-[2.78rem] w-[2.78rem] shrink-0 items-center justify-center rounded-[6px] bg-[#fffdfa] text-foreground/86 shadow-[inset_0_0_0_1px_rgba(43,39,34,0.1),inset_0_1px_0_rgba(255,255,255,0.96),0_7px_16px_-15px_rgba(43,39,34,0.46)] transition-[box-shadow,color,transform] duration-200 group-hover/email-card:text-[#ff4b00] group-hover/email-card:shadow-[inset_0_0_0_1px_rgba(255,75,0,0.2),inset_0_1px_0_rgba(255,255,255,0.96),0_9px_18px_-15px_rgba(255,75,0,0.42)] sm:h-[3rem] sm:w-[3rem]">
            <Mail aria-hidden="true" strokeWidth={1.55} className="h-[1.22rem] w-[1.22rem] sm:h-[1.32rem] sm:w-[1.32rem]" />
          </span>
          <span className="relative z-10 min-w-0 flex-1 space-y-1">
            <span className="block font-header text-[0.66rem] font-normal leading-none tracking-normal text-muted-foreground/78 sm:text-[0.68rem]">
              Email me directly
            </span>
            <span className="block font-header text-[0.84rem] font-normal leading-[1.18] tracking-normal text-foreground [overflow-wrap:anywhere] sm:text-[0.92rem]">
              {emailAddress}
            </span>
          </span>
          <span className="absolute right-2 top-1/2 z-10 flex h-[2.05rem] w-[2.05rem] -translate-y-1/2 items-center justify-center text-foreground/78 transition-[transform,color] duration-200 group-hover/email-card:translate-x-0.5 group-hover/email-card:-translate-y-[calc(50%+1px)] group-hover/email-card:text-[#ff4b00] sm:right-3.5">
            <ArrowUpRight aria-hidden="true" strokeWidth={1.7} className="h-[0.86rem] w-[0.86rem]" />
          </span>
        </a>
      ) : null}

      <div className="relative isolate grid w-full max-w-[21rem] grid-cols-[repeat(2,minmax(0,8.5rem))] gap-x-8 gap-y-2 sm:max-w-[31rem] sm:grid-cols-[repeat(3,minmax(0,8.5rem))] sm:gap-x-10 sm:gap-y-3">
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
            className="group/social-link relative z-10 inline-flex min-h-[40px] min-w-[40px] max-w-[10rem] origin-center touch-manipulation items-start justify-start rounded-[2px] font-mono text-[0.88rem] leading-none text-foreground transition-[color,transform] duration-150 hover:-translate-y-[1px] hover:text-[#ff4b00] active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-[0.98rem]"
            style={SOCIAL_GLINT_STYLES[index % SOCIAL_GLINT_STYLES.length]}
            onClick={() => handleSocialClick(link)}
            onKeyDown={handleSocialKeyDown}
            onPointerDown={handleSocialPointerDown}
          >
            <span className="border-b border-border pb-[0.1em] transition-[border-color,color] duration-150 group-hover/social-link:border-[#ff4b00]/70">
              {link.label}
            </span>
            <span aria-hidden="true" className="nature-link-glint" />
          </a>
        ))}
      </div>
    </div>
  )
}
