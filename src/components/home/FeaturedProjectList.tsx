'use client'

import type { CSSProperties, FocusEvent } from 'react'
import { useState } from 'react'
import { EditorialItem } from '@/components/home/EditorialItem'
import { analytics } from '@/lib/analytics'
import {
  formatProjectYear,
  getFeaturedProjectListState,
  getFeaturedProjectRowStyleVars,
  getHomeProjectDescription,
  getHomeProjectThumbnailImage,
  getHomeProjectTitle,
  getProjectAccent,
  type FeaturedProjectHoveredState,
  type FeaturedProjectRowState,
  type HomeProject,
} from '@/lib/home-projects'
import { cn } from '@/lib/utils'

interface FeaturedProjectListProps {
  projects: HomeProject[]
}

type FeaturedProjectRowStyle = CSSProperties &
  ReturnType<typeof getFeaturedProjectRowStyleVars>

function getFeaturedProjectRowStyle(slug: string, hoverDistance = 0): FeaturedProjectRowStyle {
  return getFeaturedProjectRowStyleVars(slug, hoverDistance)
}

function PlaygroundProjectRow({
  active,
  hoverDistance,
  muted,
  onHoverEnd,
  onHoverStart,
}: {
  active: boolean
  hoverDistance: number
  muted: boolean
  onHoverEnd: () => void
  onHoverStart: () => void
}) {
  return (
    <div
      className={cn(
        'featured-project-row relative isolate',
        active && 'featured-project-row-active',
        muted && 'featured-project-row-muted',
      )}
      onFocus={onHoverStart}
      onMouseLeave={onHoverEnd}
      onMouseEnter={onHoverStart}
      style={getFeaturedProjectRowStyle('playground', hoverDistance)}
    >
      <div className="relative z-10">
        <EditorialItem
          href="/archive"
          title="Playground"
          description="Small experiments and prototypes."
          trailing="See more"
          titleFontClassName="font-header"
          onMouseEnter={onHoverStart}
          thumbnailImage="/images/optimized/projects/playground-mountain-object-icon.png"
          thumbnailAlt="Playground mountain icon"
          underlineOnHover
          hoverAccentColor={getProjectAccent('playground')}
          toastMessage="Opening playground"
          tracking={() => analytics.navigationClick('archive')}
          simpleHover
          compact
        />
      </div>
    </div>
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
    <div
      className={cn(
        'featured-project-row relative isolate',
        rowState.active && 'featured-project-row-active',
        rowState.muted && 'featured-project-row-muted',
      )}
      onFocus={onHoverStart}
      onMouseLeave={onHoverEnd}
      onMouseEnter={onHoverStart}
      style={getFeaturedProjectRowStyle(project.slug, rowState.hoverDistance)}
    >
      <div className="relative z-10">
        <EditorialItem
          href={`/projects/${project.slug}`}
          title={title}
          description={getHomeProjectDescription(project)}
          trailing={formatProjectYear(project.frontmatter.date)}
          titleFontClassName="font-header"
          onMouseEnter={onHoverStart}
          thumbnailImage={getHomeProjectThumbnailImage(project)}
          thumbnailAlt={title}
          underlineOnHover
          hoverAccentColor={getProjectAccent(project.slug)}
          toastMessage="Opening project"
          tracking={() => analytics.projectClick(project.slug, title)}
          simpleHover
          compact
        />
      </div>
    </div>
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
        'featured-project-list space-y-1.5 sm:space-y-2.5',
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
      />
    </div>
  )
}
