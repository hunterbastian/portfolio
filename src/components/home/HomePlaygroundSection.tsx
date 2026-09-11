'use client'

import Link from 'next/link'
import { useWebHaptics } from 'web-haptics/react'
import { Section } from '@/components/home/HomeSection'
import { WorkScatterStack } from '@/components/home/WorkScatterStack'
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
      contentGapClassName="space-y-4 sm:space-y-5"
      scrollMarginClassName={HOME_SECTION_SCROLL_MARGIN_CLASS_NAME}
    >
      <WorkScatterStack label="Playground" projects={projects} tone="playground" />
      <Link
        href="/archive"
        className="inline-flex min-h-[44px] origin-center touch-manipulation items-center rounded-[8px] px-2.5 font-header text-[0.78rem] font-medium tracking-[-0.02em] text-muted-foreground shadow-[var(--shadow-raised-subtle)] transition-[color,box-shadow,transform] duration-200 ease-soft hover:-translate-y-[1px] hover:text-foreground hover:shadow-[var(--shadow-hover)] active:translate-y-0 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
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
      </Link>
    </Section>
  )
}
