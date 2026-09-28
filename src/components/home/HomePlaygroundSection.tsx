'use client'

import Link from 'next/link'
import { useWebHaptics } from 'web-haptics/react'
import { Section } from '@/components/home/HomeSection'
import { WorkScatterStack } from '@/components/home/WorkScatterStack'
import { DraggablePrintStack } from '@/components/home/DraggablePrintStack'
import { analytics } from '@/lib/analytics'
import { activateEditorialItem } from '@/lib/editorial-item'
import type { HomeProject } from '@/lib/home-projects'
import { HOME_SECTION_SCROLL_MARGIN_CLASS_NAME } from '@/lib/home-section-nav'
import { showJoyToast } from '@/lib/joy'

interface HomePlaygroundSectionProps {
  projects: HomeProject[]
}

export function HomePlaygroundSection({ projects }: HomePlaygroundSectionProps) {
  const haptic = useWebHaptics()

  return (
    <Section
      id="playground"
      title="Playground"
      meta="Ongoing experiments"
      contentGapClassName="space-y-4 sm:space-y-5"
      scrollMarginClassName={HOME_SECTION_SCROLL_MARGIN_CLASS_NAME}
    >
      <DraggablePrintStack />
      <WorkScatterStack label="Playground" projects={projects} tone="playground" />
      <Link
        href="/archive"
        className="home-editorial-link inline-flex min-h-[44px] origin-center touch-manipulation items-center gap-3 font-header text-[0.78rem] font-medium text-muted-foreground transition-[color,transform] duration-150 ease-soft hover:text-foreground active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        onClick={() =>
          activateEditorialItem({
            showToast: showJoyToast,
            title: 'Playground',
            toastMessage: 'Opening playground',
            tracking: () => analytics.navigationClick('archive'),
            triggerHaptic: (style) => haptic.trigger(style),
          })
        }
      >
        See all experiments
        <span aria-hidden="true">→</span>
      </Link>
    </Section>
  )
}
