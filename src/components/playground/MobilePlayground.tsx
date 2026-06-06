'use client'

import { m, useReducedMotion } from 'framer-motion'
import { RadioTower } from 'lucide-react'
import ProjectCard from '@/components/ProjectCard'
import {
  getPlaygroundMobileManifestEntranceTransition,
  getPlaygroundMobileViewState,
  getPlaygroundMotionInitial,
  getPlaygroundOrbitCardEntranceTransition,
  getPlaygroundVerticalEntranceMotion,
} from '@/lib/playground'
import type { Project } from '@/types/project'

interface MobilePlaygroundProps {
  projects: Project[]
}

export function MobilePlayground({ projects }: MobilePlaygroundProps) {
  const prefersReducedMotion = useReducedMotion() ?? false
  const mobileState = getPlaygroundMobileViewState(projects)
  const manifestMotion = getPlaygroundVerticalEntranceMotion({ y: 8, blur: 4 })
  const tileMotion = getPlaygroundVerticalEntranceMotion({ y: 16, blur: 6 })

  return (
    <div className="flex flex-col md:hidden">
      <m.div
        className="playground-mobile-manifest"
        initial={getPlaygroundMotionInitial(prefersReducedMotion, manifestMotion.initial)}
        animate={manifestMotion.animate}
        transition={getPlaygroundMobileManifestEntranceTransition()}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2">
            <RadioTower size={14} strokeWidth={1.7} aria-hidden="true" />
            Manifest
          </span>
          <span>{mobileState.manifest.routeCountLabel} routes</span>
        </div>
        {mobileState.manifest.leadMeta ? (
          <p>
            {mobileState.manifest.leadMeta.title} / {mobileState.manifest.leadMeta.primaryTag}
          </p>
        ) : null}
      </m.div>

      <div className="grid w-full grid-cols-2 gap-x-3 gap-y-4 pb-5 pt-1">
        {mobileState.tileStates.map(({ index, meta, priorityImage, project }) => {
          return (
            <m.div
              key={project.slug}
              className="playground-mobile-tile min-w-0"
              initial={getPlaygroundMotionInitial(prefersReducedMotion, tileMotion.initial)}
              animate={tileMotion.animate}
              transition={getPlaygroundOrbitCardEntranceTransition(index)}
            >
              <div className="playground-mobile-tile-meta">
                <span>{meta.routeCode}</span>
                <span>{meta.year}</span>
              </div>
              <ProjectCard
                slug={project.slug}
                frontmatter={project.frontmatter}
                index={index}
                hideLiveBadge
                priorityImage={priorityImage}
              />
            </m.div>
          )
        })}
      </div>
    </div>
  )
}
