'use client'

import { useState, useEffect } from 'react'
import ProjectCard from '@/components/ProjectCard'
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showTooltip, setShowTooltip] = useState(false)
  
  const filteredProjects = category && category !== 'all' 
    ? projects.filter(project => project.frontmatter.category === category)
    : projects

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    if (showTooltip) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [showTooltip])

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index)
    setShowTooltip(true)
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
    setShowTooltip(false)
  }

  return (
    <>
      {/* Desktop Layout - Original with rotation effects */}
      <div className="hidden lg:flex justify-center">
        <div className="flex gap-6 transition-transform duration-500 ease-out group overflow-visible">
          {filteredProjects.map((project, index) => {
            const totalProjects = filteredProjects.length
            const isFirst = index === 0
            const isLast = index === totalProjects - 1
            
            // Calculate rotation based on position
            let rotation = 0
            if (isFirst) rotation = -3
            else if (isLast) rotation = 3
            else if (totalProjects > 2) {
              // Distribute rotations for middle projects
              const middleIndex = index - 1
              const middleCount = totalProjects - 2
              const rotationStep = 6 / (middleCount + 1) // Distribute between -3 and 3
              rotation = -3 + rotationStep * (middleIndex + 1)
            }
            
            return (
              <div 
                key={project.slug}
                className="flex-shrink-0 w-64 transition-all duration-500 ease-out group-hover:!rotate-0 group-hover:!scale-100"
                style={{
                  transform: `rotate(${rotation}deg) scale(0.9)`,
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
            )
          })}
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

      {/* Cursor-following tooltip */}
      {showTooltip && (
        <div 
          className="fixed pointer-events-none z-50 transition-all duration-200 ease-out"
          style={{
            left: mousePosition.x + 20,
            top: mousePosition.y - 40,
            transform: 'translate3d(0, 0, 0)', // GPU acceleration
          }}
        >
          <div className="bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/20">
            <span className="text-gray-800 font-medium text-sm whitespace-nowrap">View Project</span>
          </div>
        </div>
      )}
    </>
  )
}
