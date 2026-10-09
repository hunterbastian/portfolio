'use client'

import Link from 'next/link'
import Image from 'next/image'
import * as Tag from '@/components/alignui/tag'
import type { CSSProperties, FocusEvent } from 'react'
import { useState } from 'react'
import { useWebHaptics } from 'web-haptics/react'
import { analytics } from '@/lib/analytics'
import { activateEditorialItem } from '@/lib/editorial-item'
import {
  formatProjectYear,
  getFeaturedProjectListState,
  getFeaturedProjectRowStyleVars,
  getHomeProjectDescription,
  getHomeProjectTitle,
  HOME_FEATURED_ROW_META_CLASS_NAME,
  HOME_FEATURED_ROW_OUTCOME_CLASS_NAME,
  HOME_FEATURED_ROW_TITLE_CLASS_NAME,
  HOME_MORE_ROW_META_CLASS_NAME,
  HOME_MORE_ROW_TITLE_CLASS_NAME,
  type FeaturedProjectHoveredState,
  type FeaturedProjectListDensity,
  type FeaturedProjectRowState,
  type HomeProject,
} from '@/lib/home-projects'
import { showJoyToast } from '@/lib/joy'
import { cn } from '@/lib/utils'

interface FeaturedProjectListProps {
  density?: FeaturedProjectListDensity
  projects: HomeProject[]
  showImages?: boolean
  showPlaygroundRow?: boolean
}

type FeaturedProjectRowStyle = CSSProperties &
  ReturnType<typeof getFeaturedProjectRowStyleVars> & {
    '--featured-row-delay': string
  }

function getFeaturedProjectRowStyle(slug: string, hoverDistance = 0, sequence = 0): FeaturedProjectRowStyle {
  return {
    ...getFeaturedProjectRowStyleVars(slug, hoverDistance),
    '--featured-row-delay': `${Math.min(sequence, 7) * 42}ms`,
  }
}

interface FeaturedProjectCardProps {
  image?: string
  active: boolean
  density: FeaturedProjectListDensity
  description: string
  discipline?: string
  hoverDistance: number
  href: string
  muted: boolean
  onHoverEnd: () => void
  onHoverStart: () => void
  sequence: number
  title: string
  toastMessage: string
  tracking: () => void
  trailing: string
  slug: string
}

function FeaturedProjectCard({
  image,
  active,
  density,
  description,
  discipline,
  hoverDistance,
  href,
  muted,
  onHoverEnd,
  onHoverStart,
  sequence,
  title,
  toastMessage,
  tracking,
  trailing,
  slug,
}: FeaturedProjectCardProps) {
  const haptic = useWebHaptics()
  const quiet = density === 'quiet'

  const handleClick = () => {
    activateEditorialItem({
      showToast: showJoyToast,
      title,
      toastMessage,
      tracking,
      triggerHaptic: (style) => haptic.trigger(style),
    })
  }

  return (
    <div
      className={cn(
        'featured-project-row featured-project-card relative isolate h-full',
        image && 'featured-project-with-image',
        active && 'featured-project-row-active',
        muted && 'featured-project-row-muted',
      )}
      onFocus={onHoverStart}
      onMouseLeave={onHoverEnd}
      onMouseEnter={onHoverStart}
      style={getFeaturedProjectRowStyle(slug, hoverDistance, sequence)}
    >
      <Link
        href={href}
        className={cn(
          'featured-text-row group relative z-10 grid min-h-[44px] grid-cols-[4.5rem_minmax(0,1fr)_auto] items-start gap-x-3 border-t border-border text-left transition-[color,transform] duration-200 ease-soft active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:grid-cols-[4.75rem_minmax(0,1fr)_auto] sm:gap-x-5',
          quiet ? 'py-2.5 sm:py-3' : 'py-3 sm:py-3.5',
        )}
        onClick={handleClick}
      >
        {image ? (
          <div className="featured-project-image">
            <Image src={image} alt="" fill sizes="(max-width: 639px) calc(100vw - 48px), (max-width: 1023px) calc((100vw - 104px) / 2), (max-width: 1311px) calc((100vw - 160px) / 3), 384px" />
          </div>
        ) : null}
        <span className={quiet ? HOME_MORE_ROW_META_CLASS_NAME : HOME_FEATURED_ROW_META_CLASS_NAME}>
          {trailing}
        </span>
        <div className={cn('featured-text-row-copy min-w-0 pr-2', quiet ? 'space-y-0' : 'space-y-1.5')}>
          <h3 className={quiet ? HOME_MORE_ROW_TITLE_CLASS_NAME : HOME_FEATURED_ROW_TITLE_CLASS_NAME}>
            <span>{title}</span>
          </h3>
          {quiet ? null : (
            <p className={HOME_FEATURED_ROW_OUTCOME_CLASS_NAME}>
              {description}
            </p>
          )}
        </div>
        <span aria-hidden="true" className="featured-text-row-arrow pt-0.5 font-mono text-[0.78rem] text-muted-foreground/62">
          →
        </span>
        {!quiet && discipline ? (
          <Tag.Root className="featured-text-row-discipline">{discipline}</Tag.Root>
        ) : null}
      </Link>
    </div>
  )
}

function PlaygroundProjectRow({
  active,
  density,
  hoverDistance,
  muted,
  onHoverEnd,
  onHoverStart,
  sequence,
}: {
  active: boolean
  density: FeaturedProjectListDensity
  hoverDistance: number
  muted: boolean
  onHoverEnd: () => void
  onHoverStart: () => void
  sequence: number
}) {
  return (
    <FeaturedProjectCard
      active={active}
      density={density}
      description="Small experiments and prototypes."
      hoverDistance={hoverDistance}
      href="/archive"
      muted={muted}
      onHoverEnd={onHoverEnd}
      onHoverStart={onHoverStart}
      sequence={sequence}
      title="Playground"
      toastMessage="Opening playground"
      tracking={() => analytics.navigationClick('archive')}
      trailing="See more"
      slug="playground"
    />
  )
}

function FeaturedProjectRow({
  showImages,
  density,
  project,
  rowState,
  onHoverEnd,
  onHoverStart,
}: {
  showImages: boolean
  density: FeaturedProjectListDensity
  project: HomeProject
  rowState: FeaturedProjectRowState
  onHoverEnd: () => void
  onHoverStart: () => void
}) {
  const title = getHomeProjectTitle(project)

  return (
    <FeaturedProjectCard
      image={showImages ? project.frontmatter.image : undefined}
      active={rowState.active}
      density={density}
      description={getHomeProjectDescription(project)}
      discipline={project.frontmatter.category}
      hoverDistance={rowState.hoverDistance}
      href={`/projects/${project.slug}`}
      muted={rowState.muted}
      onHoverEnd={onHoverEnd}
      onHoverStart={onHoverStart}
      sequence={rowState.index}
      title={title}
      toastMessage="Opening project"
      tracking={() => analytics.projectClick(project.slug, title)}
      trailing={formatProjectYear(project.frontmatter.date)}
      slug={project.slug}
    />
  )
}

export function FeaturedProjectList({
  density = 'default',
  showImages = false,
  projects,
  showPlaygroundRow = false,
}: FeaturedProjectListProps) {
  const [hoveredProject, setHoveredProject] = useState<FeaturedProjectHoveredState | null>(null)

  const listState = getFeaturedProjectListState(projects, hoveredProject)
  const clearHoveredProject = () => setHoveredProject(null)

  const handleListBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      clearHoveredProject()
    }
  }

  return (
    <div
      data-density={density}
      className={cn(
        'featured-project-list',
        listState.hasHoveredProject && 'featured-project-list-hovering',
      )}
      onBlur={handleListBlur}
      onMouseLeave={clearHoveredProject}
    >
      {listState.projectRows.map((rowState) => {
        const project = projects[rowState.index]

        if (!project) return null

        return (
          <FeaturedProjectRow
            key={rowState.slug}
            showImages={showImages}
            density={density}
            project={project}
            rowState={rowState}
            onHoverEnd={clearHoveredProject}
            onHoverStart={() => setHoveredProject({ slug: rowState.slug, index: rowState.index })}
          />
        )
      })}
      {showPlaygroundRow ? (
        <PlaygroundProjectRow
          active={listState.playgroundRow.active}
          density={density}
          hoverDistance={listState.playgroundRow.hoverDistance}
          muted={listState.playgroundRow.muted}
          onHoverEnd={clearHoveredProject}
          onHoverStart={() => setHoveredProject({
            slug: listState.playgroundRow.slug,
            index: listState.playgroundRow.index,
          })}
          sequence={listState.playgroundRow.index}
        />
      ) : null}
    </div>
  )
}
