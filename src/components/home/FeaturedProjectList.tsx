'use client'

import Link from 'next/link'
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
  type FeaturedProjectHoveredState,
  type FeaturedProjectRowState,
  type HomeProject,
} from '@/lib/home-projects'
import { showJoyToast } from '@/lib/joy'
import { cn } from '@/lib/utils'

interface FeaturedProjectListProps {
  projects: HomeProject[]
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
  active: boolean
  description: string
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
  active,
  description,
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
        className="featured-text-row group relative z-10 grid min-h-[6.75rem] grid-cols-[4.5rem_minmax(0,1fr)_auto] items-start gap-x-3 border-t border-border/85 py-4 text-left transition-[color,transform] duration-200 ease-soft active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:grid-cols-[4.75rem_minmax(0,1fr)_auto] sm:gap-x-5 sm:py-5"
        onClick={handleClick}
      >
        <span className="featured-text-row-meta pt-0.5 font-mono text-[0.62rem] font-medium leading-none tabular-nums text-muted-foreground/78 transition-colors duration-200 group-hover:text-foreground/72 sm:text-[0.66rem]">
          {trailing}
        </span>
        <div className="featured-text-row-copy min-w-0 space-y-1.5 pr-2">
          <h3 className="font-header text-[0.92rem] leading-[1.16] tracking-[-0.025em] text-foreground transition-colors duration-200 group-hover:text-[var(--editorial-accent)] sm:text-[0.98rem]">
            <span>{title}</span>
          </h3>
          <p className="max-w-[42rem] font-mono text-[0.76rem] leading-[1.5] text-muted-foreground transition-colors duration-200 group-hover:text-foreground/74 sm:text-[0.8rem]">
            {description}
          </p>
        </div>
        <span aria-hidden="true" className="featured-text-row-arrow pt-0.5 font-mono text-[0.78rem] text-muted-foreground/62">
          →
        </span>
      </Link>
    </div>
  )
}

function PlaygroundProjectRow({
  active,
  hoverDistance,
  muted,
  onHoverEnd,
  onHoverStart,
  sequence,
}: {
  active: boolean
  hoverDistance: number
  muted: boolean
  onHoverEnd: () => void
  onHoverStart: () => void
  sequence: number
}) {
  return (
    <FeaturedProjectCard
      active={active}
      description="Small experiments and prototypes."
      hoverDistance={hoverDistance}
      href="/#playground"
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
  project,
  rowState,
  onHoverEnd,
  onHoverStart,
}: {
  project: HomeProject
  rowState: FeaturedProjectRowState
  onHoverEnd: () => void
  onHoverStart: () => void
}) {
  const title = getHomeProjectTitle(project)

  return (
    <FeaturedProjectCard
      active={rowState.active}
      description={getHomeProjectDescription(project)}
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

export function FeaturedProjectList({ projects }: FeaturedProjectListProps) {
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
            project={project}
            rowState={rowState}
            onHoverEnd={clearHoveredProject}
            onHoverStart={() => setHoveredProject({ slug: rowState.slug, index: rowState.index })}
          />
        )
      })}
      <PlaygroundProjectRow
        active={listState.playgroundRow.active}
        hoverDistance={listState.playgroundRow.hoverDistance}
        muted={listState.playgroundRow.muted}
        onHoverEnd={clearHoveredProject}
        onHoverStart={() => setHoveredProject({
          slug: listState.playgroundRow.slug,
          index: listState.playgroundRow.index,
        })}
        sequence={listState.playgroundRow.index}
      />
    </div>
  )
}
