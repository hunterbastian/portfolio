'use client'

import Link from 'next/link'
import { useWebHaptics } from 'web-haptics/react'
import IconArrowBackUp from '@/components/IconArrowBackUp'
import MorphLink from '@/components/MorphLink'
import { analytics } from '@/lib/analytics'
import {
  BREADCRUMB_ICON_CLASS,
  BREADCRUMB_PARENT_LABEL_CLASS,
  BREADCRUMB_PILL_CLASS,
  BREADCRUMB_SEPARATOR_CLASS,
  activateBreadcrumbPill,
  getBreadcrumbPillViewState,
} from '@/lib/breadcrumb-pill'

interface BreadcrumbPillProps {
  href: string
  parentLabel: string
  currentLabel: string
  /** When set, going back morphs the detail hero down onto its card in the index. */
  morphSlug?: string
}

export default function BreadcrumbPill({
  href,
  parentLabel,
  currentLabel,
  morphSlug,
}: BreadcrumbPillProps) {
  const haptic = useWebHaptics()
  const viewState = getBreadcrumbPillViewState({ href, parentLabel, currentLabel })

  const handleClick = () =>
    activateBreadcrumbPill({
      analyticsTarget: viewState.analyticsTarget,
      trackNavigationClick: (target) => analytics.navigationClick(target),
      triggerHaptic: (style) => haptic.trigger(style),
    })

  const label = (
    <>
      <IconArrowBackUp size={10} className={BREADCRUMB_ICON_CLASS} aria-hidden />
      <span className={BREADCRUMB_PARENT_LABEL_CLASS}>{viewState.parentLabel}</span>
      <span aria-hidden className={BREADCRUMB_SEPARATOR_CLASS}>/</span>
      <span>{viewState.currentLabel}</span>
    </>
  )

  if (morphSlug) {
    return (
      <MorphLink
        href={viewState.href}
        slug={morphSlug}
        className={BREADCRUMB_PILL_CLASS}
        onClick={handleClick}
      >
        {label}
      </MorphLink>
    )
  }

  return (
    <Link href={viewState.href} className={BREADCRUMB_PILL_CLASS} onClick={handleClick}>
      {label}
    </Link>
  )
}
