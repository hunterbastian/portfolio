'use client'

import { useState } from 'react'
import { HomeBackgroundSection } from '@/components/home/HomeBackgroundSection'
import { HomeEndeavorsSection } from '@/components/home/HomeEndeavorsSection'
import { HomeHeroSection } from '@/components/home/HomeHeroSection'
import { HomePlaygroundSection } from '@/components/home/HomePlaygroundSection'
import { HomeProjectsSection } from '@/components/home/HomeProjectsSection'
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
    <div className="editorial-home">
      <HomeHeroSection />
      <div className="editorial-container editorial-sections">
        <HomeProjectsSection onWorkFilterChange={applyWorkFilter} projects={projects} workFilter={workFilter} />
        <HomeEndeavorsSection />
        <HomePlaygroundSection projects={playgroundProjects} />
        <HomeBackgroundSection />
      </div>
    </div>
  )
}
