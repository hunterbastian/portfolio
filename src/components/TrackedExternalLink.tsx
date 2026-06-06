'use client'

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { analytics } from '@/lib/analytics'
import {
  activateTrackedExternalLink,
  getTrackedExternalLinkRel,
} from '@/lib/tracked-external-link'

interface TrackedExternalLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'> {
  href: string
  platform?: string
  trackingSource?: string
  projectSlug?: string
  projectTitle?: string
  children: ReactNode
}

export default function TrackedExternalLink({
  href,
  platform,
  trackingSource,
  projectSlug,
  projectTitle,
  children,
  target = '_blank',
  rel,
  onClick,
  ...props
}: TrackedExternalLinkProps) {
  const safeRel = getTrackedExternalLinkRel(target, rel)

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    activateTrackedExternalLink({
      event,
      href,
      onClick,
      platform,
      projectSlug,
      projectTitle,
      trackExternalLink: (trackedHref, trackedPlatform, context) =>
        analytics.externalLink(trackedHref, trackedPlatform, context),
      trackingSource,
    })
  }

  return (
    <a
      href={href}
      target={target}
      rel={safeRel}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  )
}
