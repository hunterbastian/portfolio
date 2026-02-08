import { getAllProjects } from '@/lib/projects'
import LoadingScreen from '@/components/LoadingScreen'
import AnimatedHomePage from '@/components/AnimatedHomePage'
import ProjectGridClient from '@/components/ProjectGridClient'
import { ProjectLoader } from '@/components/Loader'
import { Suspense } from 'react'

// Revalidate every 1 minute in production
export const revalidate = 60

export default function HomePage() {
  const projects = getAllProjects()

  return (
    <LoadingScreen duration={1000}>
      <AnimatedHomePage>
        <Suspense fallback={<ProjectLoader />}>
          <ProjectGridClient projects={projects} />
        </Suspense>

        {projects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              No projects yet. Check back soon for exciting updates!
            </p>
          </div>
        )}
      </AnimatedHomePage>
    </LoadingScreen>
  )
}
