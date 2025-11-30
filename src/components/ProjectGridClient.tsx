'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProjectCard from '@/components/ProjectCard'
import { Skeleton } from '@/components/ui/skeleton'
import { ProjectFrontmatter } from '@/types/project'

interface Project {
  slug: string
  frontmatter: ProjectFrontmatter
}

interface ProjectGridClientProps {
  category?: string
  projects: Project[]
}

export default function ProjectGridClient({ category, projects }: ProjectGridClientProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const router = useRouter()
  
  // Prefetch project pages on idle
  useEffect(() => {
    if (typeof window === 'undefined') return
    const idleId = (window as any).requestIdleCallback?.(() => {
      projects.slice(0, 6).forEach((p) => router.prefetch(`/projects/${p.slug}`))
    })
    return () => {
      if ((window as any).cancelIdleCallback && idleId) {
        (window as any).cancelIdleCallback(idleId)
      }
    }
  }, [projects, router])
  
  const filteredProjects = category && category !== 'all' 
    ? projects.filter(project => project.frontmatter.category === category)
    : projects

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index)
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
  }

  // Split projects into rows: first 3 on top row, rest on bottom row
  const topRowProjects = filteredProjects.slice(0, 3)
  const bottomRowProjects = filteredProjects.slice(3)

  const renderProjectRow = (projects: Project[], rowIndex: number) => {
    return (
      <div className="flex gap-6 justify-center transition-transform duration-500 ease-out group overflow-visible">
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
          
          return (
            <div 
              key={project.slug}
              className="flex-shrink-0 w-52 transition-all duration-500 ease-out group-hover:!rotate-0 group-hover:!scale-100"
              style={{
                transform: `rotate(${rotation}deg) scale(0.80)`,
                opacity: hoveredIndex === null ? 1 : hoveredIndex === actualIndex ? 1 : 0.7
              }}
              onMouseEnter={() => handleMouseEnter(actualIndex)}
              onMouseLeave={handleMouseLeave}
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
          {filteredProjects.map((project, index) => (
            <div 
              key={project.slug} 
              className="w-full transition-opacity duration-300 ease-out"
              style={{
                opacity: hoveredIndex === null ? 1 : hoveredIndex === index ? 1 : 0.7
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <ProjectCard
                slug={project.slug}
                frontmatter={project.frontmatter}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>


    </>
  )
}
