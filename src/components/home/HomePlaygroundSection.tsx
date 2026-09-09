'use client'

import Link from 'next/link'
import { useWebHaptics } from 'web-haptics/react'
import { Section } from '@/components/home/HomeSection'
import { WorkScatterStack } from '@/components/home/WorkScatterStack'
import { analytics } from '@/lib/analytics'
import { activateEditorialItem } from '@/lib/editorial-item'
import type { HomeProject } from '@/lib/home-projects'
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
      contentGapClassName="space-y-3 sm:space-y-4"
      scrollMarginClassName="scroll-mt-10 sm:scroll-mt-12"
    >
      <WorkScatterStack label="Playground" projects={projects} tone="playground" />
      <Link
        href="/archive"
        className="inline-flex min-h-[40px] items-center font-mono text-[0.72rem] text-muted-foreground/78 underline decoration-border underline-offset-[0.22em] transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
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
        See all experiments →
      </Link>
    </Section>
  )
}
