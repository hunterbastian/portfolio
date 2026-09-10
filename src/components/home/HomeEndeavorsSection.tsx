'use client'

import Link from 'next/link'
import type { CSSProperties, FocusEvent } from 'react'
import { useState } from 'react'
import { useWebHaptics } from 'web-haptics/react'
import { Section } from '@/components/home/HomeSection'
import { creatingLinks, type HomeLinkItem } from '@/content/homepage'
import { analytics } from '@/lib/analytics'
import { activateEditorialItem } from '@/lib/editorial-item'
import {
  getHomeEndeavorAccent,
  getHomeEndeavorDescription,
  getHomeEndeavorListState,
  getHomeEndeavorMeta,
  getHomeEndeavorRowStyleVars,
  type HomeEndeavorHoveredState,
  type HomeEndeavorRowState,
  type HomeEndeavorRowStyleVars,
} from '@/lib/home-endeavors'
import { showJoyToast } from '@/lib/joy'
import { BLANK_LINK_TARGET, getSafeExternalLinkRel } from '@/lib/link-safety'
import { cn } from '@/lib/utils'
import { StudioWorkStack } from './StudioWorkStack'
import { studioWork } from '@/content/studio-work'

type HomeEndeavorRowStyle = CSSProperties &
  HomeEndeavorRowStyleVars & {
    '--featured-row-delay': string
  }

function HomeEndeavorRow({
  link,
  onHoverStart,
  rowState,
}: {
  link: HomeLinkItem
  onHoverStart: () => void
  rowState: HomeEndeavorRowState
}) {
  const hoverAccentColor = getHomeEndeavorAccent(link.label)
  const haptic = useWebHaptics()
  const examples = studioWork[link.label]
  const style: HomeEndeavorRowStyle = {
    ...getHomeEndeavorRowStyleVars(rowState.label, rowState.hoverDistance),
    '--editorial-accent': hoverAccentColor,
    '--featured-row-delay': `${rowState.index * 42}ms`,
  }
  const handleClick = () => {
    activateEditorialItem({
      showToast: showJoyToast,
      title: link.label,
      tracking: () => analytics.externalLink(link.href, link.label.toLowerCase()),
      triggerHaptic: (hapticStyle) => haptic.trigger(hapticStyle),
    })
  }
  const content = (
    <>
      <span className="featured-text-row-meta pt-0.5 font-mono text-[0.62rem] font-medium leading-none text-muted-foreground/78 transition-colors duration-200 group-hover:text-foreground/72 sm:text-[0.66rem]">
        {getHomeEndeavorMeta(link.label)}
      </span>
      <div className="featured-text-row-copy min-w-0 space-y-1.5 pr-2">
        <h3 className="break-words text-pretty font-header text-[0.92rem] leading-[1.16] tracking-[-0.025em] text-foreground transition-colors duration-200 group-hover:text-[var(--editorial-accent)] sm:text-[0.98rem]">
          {link.label}
        </h3>
        <p className="max-w-[42rem] font-mono text-[0.76rem] leading-[1.5] text-muted-foreground transition-colors duration-200 group-hover:text-foreground/74 sm:text-[0.8rem]">
          {getHomeEndeavorDescription(link.label)}
        </p>
      </div>
      <span aria-hidden="true" className="featured-text-row-arrow pt-0.5 font-mono text-[0.78rem] text-muted-foreground/62">
        {link.external ? '↗' : '→'}
      </span>
    </>
  )
  const linkClassName = 'min-w-0 flex-1 featured-text-row group relative z-10 grid min-h-[6.75rem] grid-cols-[4.5rem_minmax(0,1fr)_auto] items-start gap-x-3 py-4 text-left transition-[color,transform] duration-200 ease-soft active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:grid-cols-[4.75rem_minmax(0,1fr)_auto] sm:gap-x-5 sm:py-5'

  return (
    <div
      className={cn(
        'featured-project-row home-endeavor-row relative isolate',
        rowState.active && 'featured-project-row-active',
        rowState.muted && 'featured-project-row-muted',
      )}
      onFocus={onHoverStart}
      onMouseEnter={onHoverStart}
      style={style}
    >
      <div className="relative z-10 flex items-center gap-2 border-t border-border/85 sm:gap-4">
      {link.external ? (
        <a
          href={link.href}
          aria-label={link.ariaLabel}
          title={link.title}
          target={BLANK_LINK_TARGET}
          rel={getSafeExternalLinkRel(BLANK_LINK_TARGET)}
          className={linkClassName}
          onClick={handleClick}
        >
          {content}
        </a>
      ) : (
        <Link
          href={link.href}
          aria-label={link.ariaLabel}
          title={link.title}
          className={linkClassName}
          onClick={handleClick}
        >
          {content}
        </Link>
      )}
      {examples && <StudioWorkStack studio={link.label} examples={examples} print={link.iconType === 'studio-alpine'} />}
      </div>
    </div>
  )
}

export function HomeEndeavorsSection() {
  const [hoveredEndeavor, setHoveredEndeavor] = useState<HomeEndeavorHoveredState | null>(null)
  const listState = getHomeEndeavorListState(creatingLinks, hoveredEndeavor)
  const clearHoveredEndeavor = () => setHoveredEndeavor(null)

  const handleListBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      clearHoveredEndeavor()
    }
  }

  return (
    <Section title="Endeavors" contentGapClassName="space-y-1.5 sm:space-y-2">
      <div
        className={cn(
          'featured-project-list home-endeavor-list',
          listState.hasHoveredEndeavor && 'featured-project-list-hovering',
        )}
        onBlur={handleListBlur}
        onMouseLeave={clearHoveredEndeavor}
      >
        {listState.rows.map((rowState) => {
          const link = creatingLinks[rowState.index]

          if (!link) return null

          return (
            <HomeEndeavorRow
              key={rowState.label}
              link={link}
              rowState={rowState}
              onHoverStart={() => setHoveredEndeavor({
                label: rowState.label,
                index: rowState.index,
              })}
            />
          )
        })}
      </div>
    </Section>
  )
}
