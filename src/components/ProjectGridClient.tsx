'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProjectCard from '@/components/ProjectCard'
import { Skeleton } from '@/components/ui/skeleton'
import { ProjectFrontmatter } from '@/types/project'
import { Magnetic } from '@/components/animate-ui/primitives/effects/magnetic'

interface Project {
  slug: string
  frontmatter: ProjectFrontmatter
}

interface ProjectGridClientProps {
  projects: Project[]
}

export default function ProjectGridClient({ projects }: ProjectGridClientProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const router = useRouter()
  const prefetchedSlugsRef = useRef(new Set<string>())
  const hoverClearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const prefetchProject = useCallback((slug: string) => {
    if (prefetchedSlugsRef.current.has(slug)) {
      return
    }

    prefetchedSlugsRef.current.add(slug)
    router.prefetch(`/projects/${slug}`)
  }, [router])
  
  // Keep startup prefetch light, then prefetch remaining projects based on user intent.
  useEffect(() => {
    if (typeof window === 'undefined') return

    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string }
    }).connection
    const hasConstrainedNetwork =
      connection?.saveData === true || connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g'

    if (hasConstrainedNetwork) {
      return
    }

    const initialProjects = projects.slice(0, 2)

    const requestIdle = (window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
    }).requestIdleCallback
    const cancelIdle = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback

    let idleId: number | null = null
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const runPrefetch = () => {
      initialProjects.forEach((project) => prefetchProject(project.slug))
    }

    if (requestIdle) {
      idleId = requestIdle(runPrefetch, { timeout: 1500 })
    } else {
      timeoutId = setTimeout(runPrefetch, 600)
    }

    return () => {
      if (cancelIdle && idleId !== null) {
        cancelIdle(idleId)
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [prefetchProject, projects])

  useEffect(() => {
    return () => {
      if (hoverClearTimeoutRef.current !== null) {
        window.clearTimeout(hoverClearTimeoutRef.current)
      }
    }
  }, [])

  const cancelHoverClear = () => {
    if (hoverClearTimeoutRef.current !== null) {
      window.clearTimeout(hoverClearTimeoutRef.current)
      hoverClearTimeoutRef.current = null
    }
  }

  const handleMouseEnter = (index: number) => {
    cancelHoverClear()
    setHoveredIndex((previous) => (previous === index ? previous : index))
    const hoveredProject = projects[index]
    if (hoveredProject) {
      prefetchProject(hoveredProject.slug)
    }
  }

  const handleMouseLeave = () => {
    cancelHoverClear()

    // Small delay avoids a visual snap when moving between cards across grid gaps.
    hoverClearTimeoutRef.current = window.setTimeout(() => {
      setHoveredIndex(null)
      hoverClearTimeoutRef.current = null
    }, 80)
  }

  const rotations = [-1.8, 0.9, 1.6, -1.2, 0.7, 1.3]

  return (
    <div className="mx-auto grid max-w-[1120px] grid-cols-1 justify-items-center gap-x-7 gap-y-10 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-0">
      {projects.map((project, index) => {
        const isHovered = hoveredIndex === index
        const baseRotation = rotations[index % rotations.length]
        const cardOpacity = hoveredIndex === null || isHovered ? 1 : 0.9

        return (
          <div
            key={project.slug}
            className="w-full max-w-[19.5rem] transition-[transform,opacity,filter]"
            style={{
              transform: isHovered ? 'translateY(-3px) rotate(0deg)' : `translateY(0px) rotate(${baseRotation}deg)`,
              opacity: cardOpacity,
              filter: hoveredIndex === null || isHovered ? 'saturate(1)' : 'saturate(0.92)',
              transitionDuration: '360ms',
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <Magnetic
              className="will-change-transform"
              strength={0.4}
              range={120}
              onlyOnHover
              disableOnTouch
            >
              {project.frontmatter?.image ? (
                <ProjectCard
                  slug={project.slug}
                  frontmatter={project.frontmatter}
                  index={index}
                />
              ) : (
                <div className="aspect-[4/3] w-full">
                  <Skeleton className="h-full w-full rounded-[20px]" />
                </div>
              )}
            </Magnetic>
          </div>
        )
      })}
    </div>
  )
}
