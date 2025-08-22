import { getAllProjects, getAllCategories } from '@/lib/projects'
import ClientWrapper from '@/components/ClientWrapper'
import AnimatedHomePage from '@/components/AnimatedHomePage'
import ProjectGridClient from '@/components/ProjectGridClient'
import { Suspense } from 'react'

interface HomePageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const categories = getAllCategories()
  const projects = getAllProjects()
  const params = await searchParams

  return (
    <AnimatedHomePage>
      <ClientWrapper categories={categories}>
        <Suspense fallback={<div>Loading projects...</div>}>
          <ProjectGridClient category={params.category} projects={projects} />
        </Suspense>
      </ClientWrapper>

      {projects.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">
            No projects yet. Check back soon for exciting updates!
          </p>
        </div>
      )}
    </AnimatedHomePage>
  )
}
