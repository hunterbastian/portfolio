'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { useWebHaptics } from 'web-haptics/react'
import { editorialImageClassName, editorialImageFrameClassName } from '@/components/ui/tactile'
import {
  activateEditorialItem,
  getEditorialAccentStyle,
  type EditorialAccentStyle,
} from '@/lib/editorial-item'
import { showJoyToast } from '@/lib/joy'
import { BLANK_LINK_TARGET, getSafeExternalLinkRel } from '@/lib/link-safety'

type EditorialAccentCssStyle = CSSProperties & EditorialAccentStyle

export interface EditorialItemProps {
  eyebrow?: string
  eyebrowClassName?: string
  href?: string
  external?: boolean
  title: string
  description: string
  titleLeadingIcon?: ReactNode
  trailing?: string
  titleFontClassName?: string
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  thumbnailImage?: string
  thumbnailAlt?: string
  underlineOnHover?: boolean
  hoverAccentColor?: string
  toastMessage?: string
  tracking?: () => void
  simpleHover?: boolean
  compact?: boolean
}

export function EditorialItem({
  eyebrow,
  eyebrowClassName,
  href,
  external = false,
  title,
  description,
  titleLeadingIcon,
  trailing,
  titleFontClassName,
  onMouseEnter,
  onMouseLeave,
  thumbnailImage,
  thumbnailAlt,
  underlineOnHover = false,
  hoverAccentColor = 'var(--accent-editorial-hover)',
  toastMessage,
  tracking,
  simpleHover = false,
  compact = false,
}: EditorialItemProps) {
  const interactive = Boolean(href)
  const decorativeHover = interactive && !simpleHover
  const imageFrameClassName = simpleHover
    ? compact
      ? 'relative h-[38px] w-[38px] shrink-0 overflow-visible rounded-[6px] bg-transparent transition-[filter] duration-150 ease-soft group-active:brightness-[0.98] sm:h-[48px] sm:w-[48px] sm:rounded-[7px]'
      : 'relative mt-0.5 h-[44px] w-[44px] shrink-0 overflow-visible rounded-[7px] bg-transparent transition-[filter] duration-150 ease-soft group-active:brightness-[0.98] sm:h-[62px] sm:w-[62px] sm:rounded-[8px]'
    : editorialImageFrameClassName
  const imageClassName = simpleHover
    ? 'object-contain drop-shadow-[0_10px_14px_rgba(15,23,42,0.055)] transition-[filter] duration-150 ease-soft group-hover:brightness-[1.015]'
    : editorialImageClassName
  const imageSizes = compact ? '(min-width: 640px) 48px, 38px' : '(min-width: 640px) 62px, 44px'
  const titleSizeClassName = compact
    ? 'text-[1rem] sm:text-[1rem]'
    : simpleHover
      ? 'text-[0.93rem] sm:text-[0.93rem]'
      : 'text-[0.95rem] sm:text-[1.02rem]'
  const descriptionSizeClassName = compact
    ? 'text-[0.9375rem] sm:text-[0.9375rem]'
    : simpleHover
      ? 'text-[0.93rem] sm:text-[0.93rem]'
      : 'text-[0.82rem] sm:text-[0.96rem]'
  const eyebrowSizeClassName = compact ? 'text-[0.75rem] sm:text-[0.75rem]' : 'text-[0.66rem]'
  const rowSpacingClassName = compact
    ? 'gap-2.5 px-0 py-1.5 sm:-mx-2 sm:gap-5 sm:rounded-[7px] sm:px-2 sm:py-2'
    : 'gap-3 px-0 py-2 sm:-mx-3 sm:gap-10 sm:rounded-[8px] sm:px-3 sm:py-3'
  const contentGapClassName = compact ? 'gap-2.5 sm:gap-4' : 'gap-3 sm:gap-6'
  const textStackClassName = compact ? 'space-y-1' : 'space-y-1.5'
  const titleGapClassName = compact ? 'gap-1.5' : 'gap-2'
  const titleTrailingClassName = compact ? 'text-[0.75rem]' : 'text-[0.68rem]'
  const descriptionLeadingClassName = compact ? 'leading-[1.6] sm:leading-[1.6]' : 'leading-[1.46] sm:leading-[1.65]'
  const desktopTrailingClassName = compact
    ? 'min-w-[3.25rem] px-1.5 py-0.5 text-[0.75rem]'
    : 'min-w-[4.25rem] px-2 py-1 text-[0.74rem]'
  const haptic = useWebHaptics()
  const accentStyle = getEditorialAccentStyle(title, hoverAccentColor) as EditorialAccentCssStyle
  const handleClick = () => {
    activateEditorialItem({
      showToast: showJoyToast,
      title,
      toastMessage,
      tracking,
      triggerHaptic: (style) => haptic.trigger(style),
    })
  }
  const content = (
    <div
      className={`group relative flex w-full origin-center items-start justify-between overflow-hidden transition-[transform,color,opacity,background-color,box-shadow] duration-300 ease-soft ${rowSpacingClassName} ${
        interactive
          ? simpleHover
            ? 'cursor-pointer touch-manipulation active:scale-[0.96]'
            : 'cursor-pointer touch-manipulation active:translate-y-0 active:scale-[0.96] sm:hover:-translate-y-[1px] sm:hover:translate-x-[3px] sm:hover:bg-[var(--editorial-accent-bg)] sm:hover:shadow-[0_1px_0_rgba(255,255,255,0.68),0_16px_38px_-34px_var(--editorial-accent-shadow)]'
          : ''
      }`}
      style={accentStyle}
    >
      {decorativeHover ? <span aria-hidden="true" className="nature-link-glint" /> : null}
      {thumbnailImage && decorativeHover ? (
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
      <div className={`flex min-w-0 flex-1 items-start ${contentGapClassName}`}>
        {thumbnailImage ? (
          <div className={imageFrameClassName}>
            <Image
              src={thumbnailImage}
              alt={thumbnailAlt ?? title}
              fill
              className={imageClassName}
              sizes={imageSizes}
            />
          </div>
        ) : null}

        <div className={`min-w-0 flex-1 ${textStackClassName}`}>
          {eyebrow ? (
            <p className={`${eyebrowClassName ?? 'font-mono text-muted-foreground/70 group-hover:text-muted-foreground'} ${eyebrowSizeClassName} uppercase tracking-[0.12em] transition-colors duration-300`}>
              {eyebrow}
            </p>
          ) : null}
          <div className="flex min-w-0 items-center justify-between gap-3">
            <div className={`flex min-w-0 items-center ${titleGapClassName}`}>
              {titleLeadingIcon ? <span className="shrink-0">{titleLeadingIcon}</span> : null}
              <p className={`${titleFontClassName ?? 'font-sans'} min-w-0 ${titleSizeClassName} leading-[1.15] tracking-[-0.03em] text-foreground transition-colors duration-200 ${simpleHover ? 'group-hover:text-foreground/88' : underlineOnHover ? 'group-hover:text-[var(--editorial-accent)]' : 'group-hover:text-foreground/86'} sm:leading-none`}>
                <span
                  className={
                    underlineOnHover
                      ? `${titleFontClassName ?? ''} inline underline decoration-current underline-offset-[0.2em] transition-[text-decoration-color] duration-200 ${simpleHover ? 'group-hover:decoration-current' : 'group-hover:decoration-[var(--editorial-accent)]'}`
                      : `${titleFontClassName ?? ''} inline`
                  }
                >
                  {title}
                </span>
              </p>
            </div>
            {trailing ? (
              <span className={`shrink-0 font-mono ${titleTrailingClassName} font-medium tabular-nums text-muted-foreground/72 transition-[color,transform] duration-200 sm:hidden ${simpleHover ? 'group-hover:text-foreground/76' : 'group-hover:-translate-y-px group-hover:text-[var(--editorial-accent)]'}`}>
                {trailing}
              </span>
            ) : null}
          </div>
          <p className={`max-w-[44rem] font-sans ${descriptionSizeClassName} ${descriptionLeadingClassName} text-muted-foreground transition-colors duration-300 group-hover:text-foreground/72`}>
            {description}
          </p>
        </div>
      </div>
      {trailing ? (
        <span className="hidden shrink-0 pt-0.5 sm:block">
          <span className={`inline-flex justify-end rounded-full font-mono font-medium leading-none tabular-nums text-muted-foreground/70 transition-[background-color,color,transform] duration-200 ${desktopTrailingClassName} ${simpleHover ? 'group-hover:text-foreground/76' : 'group-hover:-translate-y-px group-hover:bg-[color-mix(in_srgb,var(--editorial-accent)_12%,transparent)] group-hover:text-[var(--editorial-accent)]'}`}>
            {trailing}
          </span>
        </span>
      ) : null}
    </div>
  )

  if (!href) return content

  if (external) {
    return (
      <a
        href={href}
        target={BLANK_LINK_TARGET}
        rel={getSafeExternalLinkRel(BLANK_LINK_TARGET)}
        className="block rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={handleClick}
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
      onClick={handleClick}
    >
      {content}
    </Link>
  )
}
