'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { BLANK_LINK_TARGET, getSafeExternalLinkRel } from '@/lib/link-safety'
import {
  getPeekActionClassName,
  getPeekActionKind,
  getPeekTooltipClassName,
  shouldRenderPeekTooltip,
} from '@/lib/peek-action'

type PeekActionProps = {
  children: ReactNode
  peek?: ReactNode
  href?: string
  external?: boolean
  type?: 'button' | 'submit' | 'reset'
  ariaLabel?: string
  ariaExpanded?: boolean
  className?: string
  labelClassName?: string
  tooltipClassName?: string
  onClick?: () => void
  onFocus?: () => void
  onMouseEnter?: () => void
}

export function PeekAction({
  children,
  peek,
  href,
  external = false,
  type = 'button',
  ariaLabel,
  ariaExpanded,
  className,
  labelClassName,
  tooltipClassName,
  onClick,
  onFocus,
  onMouseEnter,
}: PeekActionProps) {
  const content = (
    <>
      <span className={labelClassName}>{children}</span>
      {shouldRenderPeekTooltip(peek) ? (
        <span aria-hidden="true" className={getPeekTooltipClassName(tooltipClassName)}>
          {peek}
        </span>
      ) : null}
    </>
  )
  const actionClassName = getPeekActionClassName(className)
  const actionKind = getPeekActionKind(href, external)

  if (actionKind === 'external-link' && href) {
    return (
      <a
        href={href}
        target={BLANK_LINK_TARGET}
        rel={getSafeExternalLinkRel(BLANK_LINK_TARGET)}
        aria-label={ariaLabel}
        className={actionClassName}
        onClick={onClick}
        onFocus={onFocus}
        onMouseEnter={onMouseEnter}
      >
        {content}
      </a>
    )
  }

  if (actionKind === 'internal-link' && href) {
    return (
      <Link
        href={href}
        aria-label={ariaLabel}
        className={actionClassName}
        onClick={onClick}
        onFocus={onFocus}
        onMouseEnter={onMouseEnter}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      className={actionClassName}
      onClick={onClick}
      onFocus={onFocus}
      onMouseEnter={onMouseEnter}
    >
      {content}
    </button>
  )
}
