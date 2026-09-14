'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HomeBackgroundSection } from '@/components/home/HomeBackgroundSection'
import { HomeEndeavorsSection } from '@/components/home/HomeEndeavorsSection'
import { HomePlaygroundSection } from '@/components/home/HomePlaygroundSection'
import { HomeProjectsSection } from '@/components/home/HomeProjectsSection'
import { Section } from '@/components/home/HomeSection'
import { homePhilosophyContent } from '@/content/homepage'
import { siteMailtoHref } from '@/lib/site'
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
    <div className="portfolio-home">
      <section id="home" className="collection-intro">
        <h1>Interaction design,<br />code & photography.</h1>
        <p>I design and build digital products.<br />Currently studying Interaction Design at UVU.</p>
      </section>

      <div className="collection-sections">
        <HomeProjectsSection
          onWorkFilterChange={applyWorkFilter}
          projects={projects}
          workFilter={workFilter}
        />
        <HomePlaygroundSection projects={playgroundProjects} />

        <Section id="photography" title="Photography">
          <div className="collection-photography">
            <div>
              <h3>Studio Alpine</h3>
              <p>My photography and lifestyle project.</p>
            </div>
            <a className="collection-text-link" href="https://instagram.com/studio.alpine" target="_blank" rel="noopener noreferrer">View photographs ↗</a>
          </div>
        </Section>

        <HomeBackgroundSection />
        <div className="collection-about-note">
          <p>{homePhilosophyContent.body}</p>
          <div id="contact" className="collection-contact">
            <a className="collection-text-link" href={siteMailtoHref}>Email me ↗</a>
            <Link className="collection-text-link" href="/cv">Résumé</Link>
            <a className="collection-text-link" href="https://linkedin.com/in/hunterbastian" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            <a className="collection-text-link" href="https://github.com/hunterbastian" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          </div>
        </div>
        <HomeEndeavorsSection />
      </div>
    </div>
  )
}
