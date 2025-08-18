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
              className="flex-shrink-0 w-64 transition-all duration-500 ease-out"
              style={{
                transform: `rotate(${rotation}deg) scale(0.9)`,
              }}
              onMouseEnter={(e) => {
                const parent = e.currentTarget.closest('.group');
                if (parent) {
                  parent.classList.add('hovered');
                  const allCards = parent.querySelectorAll('[data-project-card]');
                  allCards.forEach((card) => {
                    (card as HTMLElement).style.transform = 'rotate(0deg) scale(1)';
                  });
                }
              }}
              onMouseLeave={(e) => {
                const parent = e.currentTarget.closest('.group');
                if (parent) {
                  parent.classList.remove('hovered');
                  const allCards = parent.querySelectorAll('[data-project-card]');
                  allCards.forEach((card, idx) => {
                    const isFirstCard = idx === 0;
                    const isLastCard = idx === allCards.length - 1;
                    let cardRotation = 0;
                    if (isFirstCard) cardRotation = -3;
                    else if (isLastCard) cardRotation = 3;
                    else if (allCards.length > 2) {
                      const middleIdx = idx - 1;
                      const middleCount = allCards.length - 2;
                      const rotStep = 6 / (middleCount + 1);
                      cardRotation = -3 + rotStep * (middleIdx + 1);
                    }
                    (card as HTMLElement).style.transform = `rotate(${cardRotation}deg) scale(0.9)`;
                  });
                }
              }}
              data-project-card
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
