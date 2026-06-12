'use client'

import Link from 'next/link'
import { useWebHaptics } from 'web-haptics/react'
import IconArrowBackUp from '@/components/IconArrowBackUp'
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
}

export default function BreadcrumbPill({ href, parentLabel, currentLabel }: BreadcrumbPillProps) {
  const haptic = useWebHaptics()
  const viewState = getBreadcrumbPillViewState({ href, parentLabel, currentLabel })

  return (
    <Link
      href={viewState.href}
      className={BREADCRUMB_PILL_CLASS}
      onClick={() =>
        activateBreadcrumbPill({
          analyticsTarget: viewState.analyticsTarget,
          trackNavigationClick: (target) => analytics.navigationClick(target),
          triggerHaptic: (style) => haptic.trigger(style),
        })
      }
    >
      <IconArrowBackUp size={10} className={BREADCRUMB_ICON_CLASS} aria-hidden />
      <span className={BREADCRUMB_PARENT_LABEL_CLASS}>{viewState.parentLabel}</span>
      <span aria-hidden className={BREADCRUMB_SEPARATOR_CLASS}>/</span>
      <span>{viewState.currentLabel}</span>
    </Link>
  )
}
