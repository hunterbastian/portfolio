'use client'

import Link from 'next/link'
import { useWebHaptics } from 'web-haptics/react'
import IconArrowBackUp from '@/components/IconArrowBackUp'

interface BreadcrumbPillProps {
  href: string
  parentLabel: string
  currentLabel: string
}

export default function BreadcrumbPill({ href, parentLabel, currentLabel }: BreadcrumbPillProps) {
  const haptic = useWebHaptics()

  return (
    <Link
      href={href}
      className="group top-meta-pill inline-flex min-h-[40px] origin-center touch-manipulation items-center gap-2 px-5 py-2.5 font-mono text-[11px] tracking-[0.12em] text-muted-foreground backdrop-blur-xl transition-[color,transform] duration-150 hover:text-foreground active:translate-y-0 active:scale-[0.96]"
      onClick={() => haptic.trigger('light')}
    >
      <IconArrowBackUp size={11} className="shrink-0 opacity-60 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1" aria-hidden />
      <span className="text-foreground opacity-90">{parentLabel}</span>
      <span aria-hidden className="text-muted-foreground/30">/</span>
      <span>{currentLabel}</span>
    </Link>
  )
}
