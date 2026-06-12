'use client'

import { useState } from 'react'
import { HomeContactSection } from '@/components/home/HomeContactSection'
import { HomeEducationSection } from '@/components/home/HomeEducationSection'
import { HomeEndeavorsSection } from '@/components/home/HomeEndeavorsSection'
import { HomeExperienceSection } from '@/components/home/HomeExperienceSection'
import { HomeHeroSection } from '@/components/home/HomeHeroSection'
import { HomeProjectsSection } from '@/components/home/HomeProjectsSection'
import { Reveal } from '@/components/home/HomeSection'
import { useWorkFilterUrlSync } from '@/lib/use-work-filter-url-sync'
import {
  activateHomeWorkFilterChange,
  type HomeProject,
  type WorkFilter,
} from '@/lib/home-projects'

interface AnimatedHomePageProps {
  projects: HomeProject[]
}

export default function AnimatedHomePage({ projects }: AnimatedHomePageProps) {
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

        <div className="mt-5 space-y-9 sm:mt-7 sm:space-y-20">
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

          <Reveal delayMs={120}>
            <HomeExperienceSection />
          </Reveal>

          <Reveal delayMs={160}>
            <HomeEducationSection />
          </Reveal>

          <Reveal delayMs={200}>
            <HomeContactSection />
          </Reveal>
        </div>
      </div>
    </div>
  )
}
