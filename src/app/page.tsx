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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProjects.map((project, index) => (
        <ProjectCard
          key={project.slug}
          slug={project.slug}
          frontmatter={project.frontmatter}
          index={index}
        />
      ))}
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
