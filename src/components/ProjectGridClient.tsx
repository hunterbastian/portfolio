'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProjectCard from '@/components/ProjectCard'
import { Skeleton } from '@/components/ui/skeleton'
import { ProjectFrontmatter } from '@/types/project'

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
  const magnetEnabledRef = useRef(false)
  const MAGNET_STRENGTH = 0.24
  const MAGNET_MAX_OFFSET = 28

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
    if (typeof window === 'undefined') return

    const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)')

    const setMagnetSupport = () => {
      magnetEnabledRef.current = supportsFinePointer.matches
    }

    setMagnetSupport()
    supportsFinePointer.addEventListener('change', setMagnetSupport)

    return () => {
      supportsFinePointer.removeEventListener('change', setMagnetSupport)
    }
  }, [])

  const applyMagnetOffset = useCallback((node: HTMLDivElement | null, offsetX: number, offsetY: number, settle = false) => {
    if (!node) return

    node.style.transition = settle
      ? 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)'
      : 'transform 120ms cubic-bezier(0.22, 1, 0.36, 1)'
    node.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0px)`
  }, [])

  const handleMagnetMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!magnetEnabledRef.current) return

    const magnetNode = event.currentTarget.firstElementChild as HTMLDivElement | null
    const rect = event.currentTarget.getBoundingClientRect()
    const pointerOffsetX = event.clientX - (rect.left + rect.width / 2)
    const pointerOffsetY = event.clientY - (rect.top + rect.height / 2)
    const magnetX = Math.max(-MAGNET_MAX_OFFSET, Math.min(MAGNET_MAX_OFFSET, pointerOffsetX * MAGNET_STRENGTH))
    const magnetY = Math.max(-MAGNET_MAX_OFFSET, Math.min(MAGNET_MAX_OFFSET, pointerOffsetY * MAGNET_STRENGTH))

    applyMagnetOffset(magnetNode, magnetX, magnetY)
  }, [MAGNET_MAX_OFFSET, MAGNET_STRENGTH, applyMagnetOffset])
  
  const handleMouseEnter = (index: number) => {
    setHoveredIndex((previous) => (previous === index ? previous : index))
    const hoveredProject = projects[index]
    if (hoveredProject) {
      prefetchProject(hoveredProject.slug)
    }
  }

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    setHoveredIndex(null)
    const magnetNode = event.currentTarget.firstElementChild as HTMLDivElement | null
    applyMagnetOffset(magnetNode, 0, 0, true)
  }

  // Split projects into rows: first 3 on top row, rest on bottom row
  const topRowProjects = projects.slice(0, 3)
  const bottomRowProjects = projects.slice(3)

  const renderProjectRow = (projects: Project[], rowIndex: number) => {
    return (
      <div className="flex gap-6 justify-center overflow-visible">
        {projects.map((project, index) => {
          const totalInRow = projects.length
          const isFirst = index === 0
          const isLast = index === totalInRow - 1
          const actualIndex = rowIndex === 0 ? index : index + 3 // Maintain original index for animations
          
          // Calculate rotation based on position in row
          let rotation = 0
          if (totalInRow === 1) {
            rotation = 0 // No rotation for single item
          } else if (isFirst) {
            rotation = -3
          } else if (isLast) {
            rotation = 3
          } else if (totalInRow > 2) {
            // Distribute rotations for middle projects
            const middleIndex = index - 1
            const middleCount = totalInRow - 2
            const rotationStep = 6 / (middleCount + 1) // Distribute between -3 and 3
            rotation = -3 + rotationStep * (middleIndex + 1)
          }
          
          const isHovered = hoveredIndex === actualIndex
          
          return (
            <div 
              key={project.slug}
              className="flex-shrink-0 w-52 transition-transform transition-opacity duration-500 ease-out"
              style={{
                transform: isHovered ? 'rotate(0deg) scale(1)' : `rotate(${rotation}deg) scale(0.80)`,
                opacity: hoveredIndex === null ? 1 : hoveredIndex === actualIndex ? 1 : 0.7
              }}
              onMouseEnter={() => handleMouseEnter(actualIndex)}
              onMouseMove={handleMagnetMove}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className="will-change-transform"
              >
                {project.frontmatter?.image ? (
                  <ProjectCard
                    slug={project.slug}
                    frontmatter={project.frontmatter}
                    index={actualIndex}
                  />
                ) : (
                  <div className="aspect-video w-full">
                    <Skeleton className="h-full w-full rounded-xl" />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <>
      {/* Desktop Layout - Multi-row with rotation effects */}
      <div className="hidden lg:block">
        <div className="space-y-8">
          {/* Top Row - First 3 projects */}
          {topRowProjects.length > 0 && renderProjectRow(topRowProjects, 0)}
          
          {/* Bottom Row - Remaining projects */}
          {bottomRowProjects.length > 0 && renderProjectRow(bottomRowProjects, 1)}
        </div>
      </div>
      
      {/* Mobile/Tablet Layout - Simple grid */}
      <div className="lg:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-4 sm:px-6">
          {projects.map((project, index) => (
            <div 
              key={project.slug} 
              className="w-full transition-opacity duration-300 ease-out"
              style={{
                opacity: hoveredIndex === null ? 1 : hoveredIndex === index ? 1 : 0.7
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseMove={handleMagnetMove}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className="will-change-transform"
              >
                <ProjectCard
                  slug={project.slug}
                  frontmatter={project.frontmatter}
                  index={index}
                />
              </div>
            </div>
          ))}
        </div>
      </div>


    </>
  )
}
