import { getAllProjects, getAllCategories } from '@/lib/projects'
import ClientWrapper from '@/components/ClientWrapper'
import AnimatedHomePage from '@/components/AnimatedHomePage'
import ProjectGridClient from '@/components/ProjectGridClient'
import { ProjectLoader } from '@/components/Loader'
import { Suspense } from 'react'

// Revalidate every 1 minute in production
export const revalidate = 60

interface HomePageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/c48e2695-972e-4ac3-bdec-4b04dfb6b4bd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/app/page.tsx:HomePage:entry',message:'HomePage entry',data:{searchParamsType:typeof searchParams},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1'})}).catch(()=>{});
  // #endregion
  const categories = getAllCategories()
  const projects = getAllProjects()
  const params = await searchParams

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/c48e2695-972e-4ac3-bdec-4b04dfb6b4bd',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'src/app/page.tsx:HomePage:after-data',message:'HomePage after data',data:{categoriesCount:categories.length,projectsCount:projects.length,categoryParam:params?.category??null},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1'})}).catch(()=>{});
  // #endregion

  return (
    <AnimatedHomePage>
      <ClientWrapper>
        <Suspense fallback={<ProjectLoader />}>
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
