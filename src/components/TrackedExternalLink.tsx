'use client'

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { analytics } from '@/lib/analytics'

interface TrackedExternalLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'> {
  href: string
  platform?: string
  children: ReactNode
}

export default function TrackedExternalLink({
  href,
  platform,
  children,
  target = '_blank',
  rel,
  onClick,
  ...props
}: TrackedExternalLinkProps) {
  const safeRel = rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    analytics.externalLink(href, platform)
    onClick?.(event)
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
