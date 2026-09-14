'use client'

import Link from 'next/link'
import { useWebHaptics } from 'web-haptics/react'
import { Section } from '@/components/home/HomeSection'
import { GalleryProjectCard } from '@/components/home/GalleryProjectCard'
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
      title="Explorations"
      contentGapClassName="space-y-4 sm:space-y-5"
      scrollMarginClassName={HOME_SECTION_SCROLL_MARGIN_CLASS_NAME}
    >
      <div className="collection-grid collection-grid-explorations">
        {projects.slice(0, 4).map((project) => <GalleryProjectCard key={project.slug} project={project} />)}
      </div>
      <Link
        href="/archive"
        className="collection-text-link"
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
