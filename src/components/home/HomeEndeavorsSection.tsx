'use client'

import type { CSSProperties, FocusEvent } from 'react'
import { useState } from 'react'
import { EditorialItem } from '@/components/home/EditorialItem'
import { Section } from '@/components/home/HomeSection'
import { creatingLinks, type HomeLinkItem } from '@/content/homepage'
import { analytics } from '@/lib/analytics'
import {
  getHomeEndeavorAccent,
  getHomeEndeavorDescription,
  getHomeEndeavorListState,
  getHomeEndeavorMeta,
  getHomeEndeavorRowStyleVars,
  getHomeEndeavorThumbnail,
  type HomeEndeavorHoveredState,
  type HomeEndeavorRowState,
  type HomeEndeavorRowStyleVars,
} from '@/lib/home-endeavors'
import { cn } from '@/lib/utils'

type HomeEndeavorRowStyle = CSSProperties &
  HomeEndeavorRowStyleVars

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
  const thumbnail = getHomeEndeavorThumbnail(link.iconType)

  return (
    <div
      className={cn(
        'featured-project-row home-endeavor-row relative isolate',
        rowState.active && 'featured-project-row-active',
        rowState.muted && 'featured-project-row-muted',
      )}
      onFocus={onHoverStart}
      onMouseEnter={onHoverStart}
      style={getHomeEndeavorRowStyleVars(rowState.label, rowState.hoverDistance) as HomeEndeavorRowStyle}
    >
      <div className="relative z-10">
        <EditorialItem
          href={link.href}
          external={link.external}
          title={link.label}
          description={getHomeEndeavorDescription(link.label)}
          trailing={getHomeEndeavorMeta(link.label)}
          onMouseEnter={onHoverStart}
          thumbnailImage={thumbnail?.src}
          thumbnailAlt={thumbnail?.alt}
          underlineOnHover
          hoverAccentColor={hoverAccentColor}
          tracking={() => analytics.externalLink(link.href, link.label.toLowerCase())}
          simpleHover
        />
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
    <Section title="Endeavors">
      <div
        className={cn(
          'featured-project-list home-endeavor-list space-y-3 sm:space-y-5',
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
