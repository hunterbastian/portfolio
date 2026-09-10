'use client'

import { useState } from 'react'
import { HomeBackgroundSection } from '@/components/home/HomeBackgroundSection'
import { HomeContactSection } from '@/components/home/HomeContactSection'
import { HomeEndeavorsSection } from '@/components/home/HomeEndeavorsSection'
import { HomeHeroSection } from '@/components/home/HomeHeroSection'
import { HomePlaygroundSection } from '@/components/home/HomePlaygroundSection'
import { HomeProjectsSection } from '@/components/home/HomeProjectsSection'
import { Reveal } from '@/components/home/HomeSection'
import { useWorkFilterUrlSync } from '@/lib/use-work-filter-url-sync'
import {
  activateHomeWorkFilterChange,
  type HomeProject,
  type WorkFilter,
} from '@/lib/home-projects'

interface AnimatedHomePageProps {
  playgroundProjects: HomeProject[]
  projects: HomeProject[]
}

export default function AnimatedHomePage({ playgroundProjects, projects }: AnimatedHomePageProps) {
  const [workFilter, setWorkFilter] = useState<WorkFilter>('all')

  useWorkFilterUrlSync(setWorkFilter)

  const applyWorkFilter = (filter: WorkFilter) => {
    activateHomeWorkFilterChange({
      currentHref: typeof window === 'undefined' ? undefined : window.location.href,
      filter,
      replaceUrl: (href) => window.history.replaceState(null, '', href),
      requestFrame: (callback) => {
        window.requestAnimationFrame(callback)
      },
      scrollProjectsIntoView: () => {
        document.getElementById('projects')?.scrollIntoView({ block: 'start', behavior: 'smooth' })
      },
      setWorkFilter,
    })
  }

  return (
    <div className="relative isolate overflow-x-clip px-5 pb-10 sm:px-8 sm:pb-32">
      <div aria-hidden="true" className="home-painterly-washes">
        <span className="home-painterly-wash home-painterly-wash-canvas" />
        <span className="home-painterly-wash home-painterly-wash-dawn" />
        <span className="home-painterly-wash home-painterly-wash-hero" />
        <span className="home-painterly-wash home-painterly-wash-projects" />
        <span className="home-painterly-wash home-painterly-wash-contact" />
      </div>
      <div aria-hidden="true" className="home-coast-outro" />

      <div className="mx-auto max-w-[36rem] pt-9 sm:pt-28">
        <Reveal>
          <HomeHeroSection />
        </Reveal>

        <div className="mt-5 space-y-11 sm:mt-7 sm:space-y-24">
          <Reveal delayMs={40}>
            <HomeProjectsSection
              onWorkFilterChange={applyWorkFilter}
              projects={projects}
              workFilter={workFilter}
            />
          </Reveal>

          <Reveal delayMs={80}>
            <HomeEndeavorsSection />
          </Reveal>

          <Reveal delayMs={100}>
            <HomePlaygroundSection projects={playgroundProjects} />
          </Reveal>

          <Reveal delayMs={120}>
            <HomeBackgroundSection />
          </Reveal>

          <Reveal delayMs={160}>
            <HomeContactSection />
          </Reveal>
        </div>
      </div>
    </div>
  )
}
