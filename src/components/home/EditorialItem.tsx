'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { useWebHaptics } from 'web-haptics/react'
import { showJoyToast } from '@/lib/joy'

type EditorialAccentStyle = CSSProperties & {
  '--dust-delay-offset': string
  '--editorial-accent': string
  '--editorial-accent-bg': string
  '--editorial-accent-border': string
  '--editorial-accent-shadow': string
  '--glint-delay': string
  '--glint-hover-x': string
  '--glint-hover-y': string
  '--glint-start-x': string
  '--glint-start-y': string
  '--glint-x': string
  '--glint-y': string
}

export interface EditorialItemProps {
  eyebrow?: string
  eyebrowClassName?: string
  href?: string
  external?: boolean
  indexLabel?: string
  title: string
  description: string
  titleLeadingIcon?: ReactNode
  trailing?: string
  titleFontClassName?: string
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  thumbnailImage?: string
  thumbnailAlt?: string
  thumbnailShape?: 'square' | 'catalog'
  underlineOnHover?: boolean
  hoverAccentColor?: string
  toastMessage?: string
  tracking?: () => void
}

export function EditorialItem({
  eyebrow,
  eyebrowClassName,
  href,
  external = false,
  indexLabel,
  title,
  description,
  titleLeadingIcon,
  trailing,
  titleFontClassName,
  onMouseEnter,
  onMouseLeave,
  thumbnailImage,
  thumbnailAlt,
  thumbnailShape = 'square',
  underlineOnHover = false,
  hoverAccentColor = 'var(--accent-editorial-hover)',
  toastMessage,
  tracking,
}: EditorialItemProps) {
  const interactive = Boolean(href)
  const haptic = useWebHaptics()
  const placementSeed = title.length % 4
  const glintPlacements = [
    { x: '1px', y: '-1px', hoverX: '1px', hoverY: '0px', startX: '-5px', startY: '3px', delay: '35ms', dust: '20ms' },
    { x: '-1px', y: '1px', hoverX: '-1px', hoverY: '1px', startX: '-4px', startY: '4px', delay: '80ms', dust: '90ms' },
    { x: '2px', y: '0px', hoverX: '2px', hoverY: '-1px', startX: '-6px', startY: '2px', delay: '55ms', dust: '55ms' },
    { x: '0px', y: '2px', hoverX: '0px', hoverY: '2px', startX: '-5px', startY: '5px', delay: '110ms', dust: '130ms' },
  ] as const
  const glintPlacement = glintPlacements[placementSeed]
  const accentStyle: EditorialAccentStyle = {
    '--dust-delay-offset': glintPlacement.dust,
    '--editorial-accent': hoverAccentColor,
    '--editorial-accent-bg': `color-mix(in srgb, ${hoverAccentColor} 7%, transparent)`,
    '--editorial-accent-border': `color-mix(in srgb, ${hoverAccentColor} 46%, var(--border))`,
    '--editorial-accent-shadow': `color-mix(in srgb, ${hoverAccentColor} 22%, transparent)`,
    '--glint-delay': glintPlacement.delay,
    '--glint-hover-x': glintPlacement.hoverX,
    '--glint-hover-y': glintPlacement.hoverY,
    '--glint-start-x': glintPlacement.startX,
    '--glint-start-y': glintPlacement.startY,
    '--glint-x': glintPlacement.x,
    '--glint-y': glintPlacement.y,
  }
  const content = (
    <div
      className={`group relative flex w-full max-w-full origin-center items-start justify-between gap-3 overflow-hidden px-0 py-2 transition-[transform,color,opacity,background-color] duration-300 ease-soft sm:-mx-3 sm:gap-10 sm:overflow-visible sm:px-3 sm:py-3 ${
        interactive ? 'cursor-pointer touch-manipulation active:translate-y-0 active:scale-[0.96] sm:hover:translate-x-[3px] sm:hover:bg-[var(--editorial-accent-bg)]' : ''
      }`}
      style={accentStyle}
    >
      {interactive ? <span aria-hidden="true" className="nature-link-glint" /> : null}
      {thumbnailImage && interactive ? (
        <>
          <span
            aria-hidden="true"
            className="project-hover-dust absolute left-[3.4rem] top-1.5 z-20 hidden h-1 w-1 rounded-full sm:block"
            style={{ background: 'var(--editorial-accent)', animationDelay: 'calc(20ms + var(--dust-delay-offset, 0ms))' }}
          />
          <span
            aria-hidden="true"
            className="project-hover-dust absolute left-[4.3rem] top-8 z-20 hidden h-[3px] w-[3px] rounded-full sm:left-[5.3rem] sm:top-11 sm:block"
            style={{ background: 'var(--editorial-accent)', animationDelay: 'calc(160ms + var(--dust-delay-offset, 0ms))' }}
          />
          <span
            aria-hidden="true"
            className="project-hover-dust absolute left-[1.15rem] top-[3.6rem] z-20 hidden h-[3px] w-[3px] rounded-full sm:left-[1.45rem] sm:top-[4.7rem] sm:block"
            style={{ background: 'var(--editorial-accent)', animationDelay: 'calc(280ms + var(--dust-delay-offset, 0ms))' }}
          />
        </>
      ) : null}
      <div className="flex min-w-0 max-w-full flex-1 items-start gap-3 sm:gap-6">
        {indexLabel ? (
          <span className="hidden w-6 shrink-0 pt-1.5 font-mono text-[0.58rem] leading-none tracking-[0.22em] text-muted-foreground/48 transition-colors duration-300 group-hover:text-[var(--editorial-accent)] sm:block">
            {indexLabel}
          </span>
        ) : null}
        {thumbnailImage ? (
          <div
            className={`relative mt-0.5 shrink-0 overflow-hidden border border-border/75 bg-card/55 shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition-[transform,border-color,box-shadow,filter] duration-300 ease-soft group-hover:-translate-y-[1px] group-hover:border-[var(--editorial-accent-border)] group-hover:shadow-[0_12px_28px_-18px_var(--editorial-accent-shadow)] group-active:translate-y-0 group-active:scale-[0.96] group-active:brightness-[0.98] ${
              thumbnailShape === 'catalog'
                ? 'h-[68px] w-[52px] sm:h-[112px] sm:w-[82px]'
                : 'h-[60px] w-[60px] sm:h-[84px] sm:w-[84px]'
            }`}
          >
            <Image
              src={thumbnailImage}
              alt={thumbnailAlt ?? title}
              fill
              className={`object-cover transition-[filter,transform] duration-500 ease-soft group-hover:scale-[1.018] group-active:scale-[1.01] ${
                thumbnailShape === 'catalog' ? 'saturate-[0.82] contrast-[1.03] sepia-[0.08]' : ''
              }`}
              sizes={thumbnailShape === 'catalog' ? '(min-width: 640px) 82px, 52px' : '(min-width: 640px) 84px, 60px'}
            />
          </div>
        ) : null}

        <div
          className={`min-w-0 flex-1 space-y-1.5 ${
            thumbnailImage ? 'max-w-[min(16.75rem,calc(100vw-6.75rem))] sm:max-w-none' : 'max-w-full'
          }`}
        >
          {eyebrow ? (
            <p className={`${eyebrowClassName ?? 'font-mono text-muted-foreground/70 group-hover:text-muted-foreground'} text-[0.66rem] uppercase tracking-[0.12em] transition-colors duration-300`}>
              {eyebrow}
            </p>
          ) : null}
          <div className="flex min-w-0 items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              {titleLeadingIcon ? <span className="shrink-0">{titleLeadingIcon}</span> : null}
              <p className={`${titleFontClassName ?? 'font-mono'} min-w-0 max-w-full text-[0.95rem] leading-[1.15] tracking-[-0.03em] text-foreground transition-colors duration-300 ${underlineOnHover ? 'group-hover:text-[var(--editorial-accent)]' : 'group-hover:text-foreground/86'} sm:text-[1.02rem] sm:leading-none`}>
                <span
                  className={
                    underlineOnHover
                      ? `${titleFontClassName ?? ''} inline break-words [overflow-wrap:anywhere] underline decoration-current underline-offset-[0.2em] transition-[text-decoration-color] duration-300 group-hover:decoration-[var(--editorial-accent)]`
                      : `${titleFontClassName ?? ''} inline break-words [overflow-wrap:anywhere]`
                  }
                >
                  {title}
                </span>
              </p>
            </div>
            {trailing ? (
              <span className="shrink-0 font-mono text-[0.72rem] text-muted-foreground/70 transition-colors duration-300 group-hover:text-[var(--editorial-accent)] sm:hidden">
                {trailing}
              </span>
            ) : null}
          </div>
          <p className="w-full max-w-full whitespace-normal break-normal font-mono text-[0.82rem] leading-[1.46] text-muted-foreground transition-colors duration-300 [overflow-wrap:normal] [text-wrap:wrap] group-hover:text-foreground/72 sm:max-w-[44rem] sm:text-[0.96rem] sm:leading-[1.65]">
            {description}
          </p>
        </div>
      </div>
      {trailing ? (
        <span className="hidden shrink-0 pt-0.5 font-mono text-[0.84rem] text-muted-foreground/75 transition-[transform,color] duration-300 group-hover:translate-x-[2px] group-hover:text-[var(--editorial-accent)] sm:block">
          {trailing}
        </span>
      ) : null}
    </div>
  )

  if (!href) return content

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="block rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={() => {
          haptic.trigger('light')
          tracking?.()
          showJoyToast(toastMessage ?? `Opening ${title}`)
        }}
      >
        {content}
      </a>
    )
  }

  return (
    <Link
      href={href}
      className="block rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => {
        haptic.trigger('light')
        tracking?.()
        showJoyToast(toastMessage ?? `Opening ${title}`)
      }}
    >
      {content}
    </Link>
  )
}
