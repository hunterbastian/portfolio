import { getAllProjects, getAllCategories } from '@/lib/projects'
import ProjectCard from '@/components/ProjectCard'
import ClientWrapper from '@/components/ClientWrapper'
import AnimatedHomePage from '@/components/AnimatedHomePage'
import { Suspense } from 'react'

interface HomePageProps {
  searchParams: Promise<{ category?: string }>
}

function ProjectGrid({ category }: { category?: string }) {
  const projects = getAllProjects()
  const filteredProjects = category && category !== 'all' 
    ? projects.filter(project => project.frontmatter.category === category)
    : projects

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
                }}
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
            <div key={project.slug} className="w-full">
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

export default async function HomePage({ searchParams }: HomePageProps) {
  const categories = getAllCategories()
  const params = await searchParams

  return (
    <AnimatedHomePage>
      <ClientWrapper categories={categories}>
        <Suspense fallback={<div>Loading projects...</div>}>
          <ProjectGrid category={params.category} />
        </Suspense>
      </ClientWrapper>

      {getAllProjects().length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">
            No projects yet. Check back soon for exciting updates!
          </p>
        </div>
      )}
    </AnimatedHomePage>
  )
}
