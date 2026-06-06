'use client'

import { useWebHaptics } from 'web-haptics/react'
import { FeaturedProjectList } from '@/components/home/FeaturedProjectList'
import { Section } from '@/components/home/HomeSection'
import { analytics } from '@/lib/analytics'
import {
  WORK_FILTER_LABELS,
  activateHomeProjectClearFilter,
  getProjectRows,
  type HomeProject,
  type WorkFilter,
} from '@/lib/home-projects'
import { showJoyToast } from '@/lib/joy'

interface HomeProjectsSectionProps {
  onWorkFilterChange: (filter: WorkFilter) => void
  projects: HomeProject[]
  workFilter: WorkFilter
}

export function HomeProjectsSection({ onWorkFilterChange, projects, workFilter }: HomeProjectsSectionProps) {
  const haptic = useWebHaptics()
  const projectRows = getProjectRows(projects, workFilter)

  return (
    <Section
      id="projects"
      title="Projects"
      contentGapClassName="space-y-2 sm:space-y-3"
      scrollMarginClassName="scroll-mt-10 sm:scroll-mt-12"
    >
      <div className="relative">
        <div className="relative z-10 space-y-3 sm:space-y-5">
          {workFilter !== 'all' ? (
            <div className="flex items-center justify-between gap-3 border border-border/65 bg-background/50 px-2.5 py-2 font-mono text-[0.68rem] text-muted-foreground">
              <span>
                Showing <span className="text-foreground">{WORK_FILTER_LABELS[workFilter]}</span>
              </span>
              <button
                type="button"
                className="min-h-[40px] min-w-[40px] origin-center touch-manipulation text-foreground underline decoration-border underline-offset-[0.22em] transition-[color,transform,text-decoration-color] duration-150 hover:text-[var(--contact-accent)] hover:decoration-[color-mix(in_srgb,var(--contact-accent)_64%,transparent)] active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                onClick={() =>
                  activateHomeProjectClearFilter({
                    setWorkFilter: onWorkFilterChange,
                    showToast: showJoyToast,
                    trackNavigationClick: (target) => analytics.navigationClick(target),
                    triggerHaptic: (style) => haptic.trigger(style),
                  })
                }
              >
                Clear
              </button>
            </div>
          ) : null}
          <FeaturedProjectList projects={projectRows} />
        </div>
      </div>
    </Section>
  )
}
