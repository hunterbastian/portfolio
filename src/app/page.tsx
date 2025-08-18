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
    <div className="flex justify-center">
      <div className="flex gap-6 transition-transform duration-500 ease-out group overflow-visible">
        {filteredProjects.map((project, index) => {
          const isFirst = index === 0
          const isLast = index === filteredProjects.length - 1
          return (
            <div 
              key={project.slug}
              className={`
                flex-shrink-0 transition-all duration-500 ease-out
                ${isFirst 
                  ? 'w-64 transform -rotate-3 scale-90 group-hover:rotate-0 group-hover:scale-100 group-hover:translate-x-12' 
                  : isLast 
                    ? 'w-64 transform rotate-3 scale-90 group-hover:rotate-0 group-hover:scale-100 group-hover:-translate-x-12' 
                    : 'w-80 group-hover:-translate-x-6'
                }
              `}
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
