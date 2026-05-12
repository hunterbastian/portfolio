'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

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

const baseActionClass =
  'group/peek relative inline-flex min-h-[40px] min-w-[40px] origin-center touch-manipulation items-center leading-none font-header transition-[color,transform] duration-150 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'

const baseTooltipClass =
  'pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 hidden -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-[5px] border border-border/70 bg-background/92 px-2 py-1 font-mono text-[0.62rem] leading-none text-muted-foreground opacity-0 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.35)] blur-[4px] transition-[opacity,transform,filter] duration-200 group-hover/peek:translate-y-0 group-hover/peek:opacity-100 group-hover/peek:blur-0 group-focus-visible/peek:translate-y-0 group-focus-visible/peek:opacity-100 group-focus-visible/peek:blur-0 sm:block'

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
      {peek ? (
        <span aria-hidden="true" className={cn(baseTooltipClass, tooltipClassName)}>
          {peek}
        </span>
      ) : null}
    </>
  )
  const actionClassName = cn(baseActionClass, className)

  if (href && external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
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

  if (href) {
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
